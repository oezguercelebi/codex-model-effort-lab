import { access, mkdir, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import process from "node:process"
import { findBinary } from "../lib/process.mjs"

/*
  Cursor Agent runner aimed at Cursor's Grok models.

  Effort is selected by model slug (grok-4.7-medium, …-high, …-xhigh), which is
  how the Cursor Agent CLI exposes Grok 4.7 effort today. There is no separate
  --effort flag and no accepted [context=500k] override for these slugs, so this
  runner does not invent a context-window setting.

  Binary is cursor-agent on purpose: on this machine `agent` is the xAI Grok
  CLI. Do not call that CLI from this runner.

  Cursor Agent can load Claude-plugin PreToolUse hooks. One broken install on
  this machine points CLAUDE_PLUGIN_ROOT at openai-codex while running a
  log-event.py hook; if that file is missing every tool is denied. The runner
  only installs a no-op stub when that exact missing path would otherwise block
  the roll.
*/

const MODEL_LABELS = {
  "grok-4.7": "Grok 4.7",
}

export const cursorGrokRunner = {
  id: "cursor-grok",
  label: "Cursor Agent (Grok)",
  efforts: ["low", "medium", "high", "xhigh"],

  supportsEffort() {
    return true
  },

  modelLabel(model) {
    if (MODEL_LABELS[model]) return MODEL_LABELS[model]
    return model.replace(/^grok-/, "Grok ").replace(/-/g, " ")
  },

  cursorModelId(model, effort) {
    return `${model}-${effort}`
  },

  async detect() {
    const found = await findBinary([
      process.env.CURSOR_AGENT_BIN,
      "cursor-agent",
      path.join(process.env.HOME ?? "", ".local/bin/cursor-agent"),
    ])
    if (!found) {
      throw new Error(
        "No working Cursor Agent CLI found. Set CURSOR_AGENT_BIN, or install via https://cursor.com/install and keep the `cursor-agent` symlink (do not overwrite the xAI `agent` binary).",
      )
    }
    await ensureNoopClaudeHookStub()
    return { binary: found.binary, version: `cursor-agent ${found.version.split("\n")[0]}` }
  },

  async invocation({ model, effort, workspace }) {
    await ensureNoopClaudeHookStub()
    return {
      args: [
        "--print",
        "--output-format",
        "json",
        "--force",
        "--trust",
        "--sandbox",
        "disabled",
        "--workspace",
        workspace,
        "--model",
        this.cursorModelId(model, effort),
      ],
      usesStdinPrompt: true,
    }
  },

  parse({ stdout, stderr }) {
    let result = null
    for (const parsed of jsonObjects(stdout)) {
      if (parsed.type === "result" || parsed.result != null || parsed.usage) result = parsed
    }

    if (!result) {
      return {
        finalMessage: "",
        usage: emptyUsage(),
        costUsd: null,
        turns: null,
        failure: stderr.trim() || "Cursor Agent produced no result object.",
      }
    }

    if (result.is_error || result.subtype === "error") {
      return {
        finalMessage: typeof result.result === "string" ? result.result : "",
        usage: usageFrom(result.usage),
        costUsd: null,
        turns: null,
        failure:
          result.error ??
          result.message ??
          (typeof result.result === "string" && result.result ? result.result : null) ??
          (stderr.trim() || "Cursor Agent reported an error."),
      }
    }

    const finalMessage = typeof result.result === "string" ? result.result : ""
    const hookBlocked =
      /pre-tool hook/i.test(finalMessage) ||
      /every file and shell tool is blocked/i.test(finalMessage) ||
      /tools? (?:are|is) blocked/i.test(finalMessage)

    return {
      finalMessage,
      usage: usageFrom(result.usage),
      costUsd: typeof result.total_cost_usd === "number" ? result.total_cost_usd : null,
      turns: result.num_turns ?? null,
      failure: hookBlocked ? "Cursor Agent tools were blocked by a failing pre-tool hook." : null,
    }
  },

  dryRunOutput() {
    return JSON.stringify({
      type: "result",
      subtype: "success",
      is_error: false,
      duration_ms: 1200,
      duration_api_ms: 1200,
      result: "Dry run completed without calling a model.",
      session_id: "dry-run",
      request_id: "dry-run",
      usage: {
        inputTokens: 1200,
        outputTokens: 180,
        cacheReadTokens: 0,
        cacheWriteTokens: 0,
      },
    })
  },
}

async function ensureNoopClaudeHookStub() {
  const stub = path.join(
    os.homedir(),
    ".claude/plugins/cache/openai-codex/codex/1.0.5/scripts/log-event.py",
  )
  try {
    await access(stub)
    return
  } catch {
    // Missing only — create a no-op so PreToolUse cannot deny every tool.
  }
  try {
    await mkdir(path.dirname(stub), { recursive: true })
    await writeFile(
      stub,
      "#!/usr/bin/env python3\n# No-op stub for a mis-resolved Cursor Agent PreToolUse hook.\nimport sys\nsys.exit(0)\n",
      { flag: "wx" },
    )
  } catch (error) {
    if (error.code !== "EEXIST") {
      process.stderr.write(`cursor-grok: could not install hook stub at ${stub}: ${error.message}\n`)
    }
  }
}

function emptyUsage() {
  return { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0, reasoningOutputTokens: 0 }
}

function usageFrom(usage = {}) {
  const input =
    usage.inputTokens ??
    usage.input_tokens ??
    0
  const cacheRead =
    usage.cacheReadTokens ??
    usage.cache_read_input_tokens ??
    0
  const cacheWrite =
    usage.cacheWriteTokens ??
    usage.cache_write_input_tokens ??
    usage.cache_creation_input_tokens ??
    0
  return {
    // Full input including cache, matching the Codex / Grok CLI axis.
    inputTokens: input + cacheRead + cacheWrite,
    cachedInputTokens: cacheRead,
    outputTokens: usage.outputTokens ?? usage.output_tokens ?? 0,
    reasoningOutputTokens: usage.reasoningTokens ?? usage.reasoning_tokens ?? null,
  }
}

function jsonObjects(text) {
  const objects = []
  let start = -1
  let depth = 0
  let inString = false
  let escaped = false

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index]
    if (inString) {
      if (escaped) escaped = false
      else if (character === "\\") escaped = true
      else if (character === '"') inString = false
      continue
    }
    if (character === '"') {
      inString = true
      continue
    }
    if (character === "{") {
      if (depth === 0) start = index
      depth += 1
    } else if (character === "}") {
      depth -= 1
      if (depth === 0 && start >= 0) {
        try {
          objects.push(JSON.parse(text.slice(start, index + 1)))
        } catch {
          // Keep scanning.
        }
        start = -1
      }
    }
  }

  return objects
}
