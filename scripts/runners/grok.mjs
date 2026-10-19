import { mkdir, symlink, writeFile } from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import process from "node:process"
import { findBinary } from "../lib/process.mjs"

/*
  The Grok CLI runner.

  A clean GROK_HOME and HOME keep the maintainer's rules, skills, Claude
  instructions, and plugins out of the run. That is this runner's equivalent
  of Codex's --ignore-user-config --ignore-rules and Claude's --safe-mode.

  Web search and web fetch are off, matching networkForGeneratedCommands: false.
  Subagents are off so the roll stays one agent, the same shape as a Codex exec.
  The context window is pinned to 500k tokens, which is the window Grok sessions
  already report and the window requested for this roll.
*/

const CONTEXT_WINDOW_TOKENS = 500_000

const MODEL_LABELS = {
  "grok-4.7": "Grok 4.7",
}

const root = path.resolve(import.meta.dirname, "../..")
const grokHome = path.join(root, ".benchmark-private", "grok-home")

export const grokRunner = {
  id: "grok",
  label: "Grok CLI",
  efforts: ["low", "medium", "high", "xhigh"],

  supportsEffort() {
    return true
  },

  modelLabel(model) {
    if (MODEL_LABELS[model]) return MODEL_LABELS[model]
    return model.replace(/^grok-/, "Grok ")
  },

  async detect() {
    const found = await findBinary([process.env.GROK_BIN, "grok", path.join(os.homedir(), ".local/bin/grok")])
    if (!found) {
      throw new Error("No working Grok CLI found. Set GROK_BIN to a working executable.")
    }
    return { binary: found.binary, version: found.version.split("\n")[0] }
  },

  async invocation({ model, effort, workspace, prompt }) {
    await mkdir(grokHome, { recursive: true })
    const promptFile = path.join(grokHome, "prompt.md")
    await writeFile(promptFile, prompt)
    await writeFile(
      path.join(grokHome, "config.toml"),
      [
        "[models]",
        `default = "${model}"`,
        "",
        `[model.${model}]`,
        `model = "${model}"`,
        `name = "${this.modelLabel(model)}"`,
        `context_window = ${CONTEXT_WINDOW_TOKENS}`,
        "",
        "[features]",
        "telemetry = false",
        "feedback = false",
        "lsp_tools = false",
        "codebase_indexing = false",
        "",
        "[session]",
        "auto_compact_threshold_percent = 80",
        "",
      ].join("\n"),
    )

    const authLink = path.join(grokHome, "auth.json")
    const realAuth = path.join(os.homedir(), ".grok", "auth.json")
    try {
      await symlink(realAuth, authLink)
    } catch (error) {
      if (error.code !== "EEXIST") throw error
    }

    const env = {
      ...process.env,
      HOME: grokHome,
      GROK_HOME: grokHome,
      GROK_SUBAGENTS: "0",
      GROK_MEMORY: "0",
      GROK_WEB_FETCH: "0",
    }

    return {
      args: [
        "--prompt-file",
        promptFile,
        "--output-format",
        "json",
        "--model",
        model,
        "--effort",
        effort,
        "--permission-mode",
        "bypassPermissions",
        "--disable-web-search",
        "--no-subagents",
        "--no-plan",
        "--verbatim",
        "--cwd",
        workspace,
      ],
      usesStdinPrompt: false,
      env,
    }
  },

  parse({ stdout, stderr }) {
    let result = null
    for (const parsed of jsonObjects(stdout)) {
      if (parsed.text != null || parsed.type === "error" || parsed.usage) result = parsed
    }

    if (!result || result.type === "error") {
      return {
        finalMessage: "",
        usage: emptyUsage(),
        costUsd: null,
        turns: null,
        failure: result?.message || stderr.trim() || "Grok produced no result object.",
      }
    }

    const usage = result.usage ?? {}
    const uncached = usage.input_tokens ?? 0
    const cacheRead = usage.cache_read_input_tokens ?? 0
    const cacheCreation = usage.cache_creation_input_tokens ?? 0
    const ticks = result.total_cost_usd_ticks
    const costUsd =
      typeof result.total_cost_usd === "number"
        ? result.total_cost_usd
        : typeof ticks === "number"
          ? ticks / 1e10
          : null

    return {
      // Full input, including cache, so this roll sits on the same axis as Codex.
      usage: {
        inputTokens: uncached + cacheRead + cacheCreation,
        cachedInputTokens: cacheRead,
        outputTokens: usage.output_tokens ?? 0,
        reasoningOutputTokens: usage.reasoning_tokens ?? 0,
      },
      finalMessage: typeof result.text === "string" ? result.text : "",
      costUsd,
      turns: result.num_turns ?? null,
      failure: null,
    }
  },

  dryRunOutput() {
    return JSON.stringify({
      text: "Dry run completed without calling a model.",
      stopReason: "end_turn",
      sessionId: "dry-run",
      requestId: "dry-run",
      num_turns: 1,
      usage: {
        input_tokens: 1200,
        cache_read_input_tokens: 0,
        cache_creation_input_tokens: 0,
        output_tokens: 180,
        reasoning_tokens: 90,
        total_tokens: 1380,
      },
      total_cost_usd: 0.0123,
      total_cost_usd_ticks: 123000000,
    })
  },
}

function emptyUsage() {
  return { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0, reasoningOutputTokens: 0 }
}

// Grok pretty-prints large JSON results, so a line-oriented parse drops them.
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
          // Keep scanning. A brace inside non-JSON text is not a result.
        }
        start = -1
      }
    }
  }

  return objects
}
