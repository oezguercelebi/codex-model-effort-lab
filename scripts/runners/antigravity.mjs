import process from "node:process"
import { findBinary } from "../lib/process.mjs"

/*
  The Antigravity CLI runner (Gemini models).
*/

const EFFORT_CAPABLE = /^gemini-/

const MODEL_LABELS = {
  "gemini-3.7-flash": "Gemini 3.7 Flash",
  "gemini-3.6-flash": "Gemini 3.6 Flash",
  "gemini-3.5-flash": "Gemini 3.5 Flash",
  "gemini-3.1-pro": "Gemini 3.1 Pro",
}

export const antigravityRunner = {
  id: "antigravity",
  label: "Antigravity CLI",
  efforts: ["low", "medium", "high"],

  supportsEffort(model) {
    return EFFORT_CAPABLE.test(model)
  },

  modelLabel(model) {
    if (MODEL_LABELS[model]) return MODEL_LABELS[model]
    const name = model.replace(/^gemini-/, "").replace(/-/g, " ")
    return name.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
  },

  async detect() {
    const found = await findBinary([process.env.AGY_BIN, "agy", "/Users/oezguercelebi/.local/bin/agy"])
    if (!found) {
      throw new Error("No working Antigravity CLI found. Set AGY_BIN to a working executable.")
    }
    return { binary: found.binary, version: `agy ${found.version.split(/\s+/)[0]}` }
  },

  invocation({ model, effort, workspace, benchmark, prompt }) {
    const args = [
      "--add-dir",
      workspace,
      "--print",
      prompt,
      "--output-format",
      "json",
      "--model",
      model,
      "--dangerously-skip-permissions",
      "--disable-slash-commands",
    ]

    if (this.supportsEffort(model)) args.push("--effort", effort)
    if (benchmark.policy?.maxDurationMinutes) {
      args.push("--print-timeout", `${benchmark.policy.maxDurationMinutes}m`)
    }

    return { args, usesStdinPrompt: false }
  },

  parse({ stdout, stderr }) {
    let result = null
    for (const line of stdout.split("\n")) {
      const text = line.trim()
      if (!text.startsWith("{")) continue
      try {
        const parsed = JSON.parse(text)
        if (parsed.status === "SUCCESS" || parsed.status === "ERROR" || parsed.usage) {
          result = parsed
        }
      } catch {
        // Non-result lines are ignored
      }
    }

    if (!result) {
      return {
        finalMessage: "",
        usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0, reasoningOutputTokens: 0 },
        costUsd: null,
        turns: null,
        failure: stderr.trim() || "Antigravity CLI produced no result object.",
      }
    }

    const usage = result.usage ?? {}
    const cacheRead = usage.cache_read_tokens ?? 0
    const inputTokens = usage.input_tokens ?? 0
    const outputTokens = usage.output_tokens ?? 0
    const thinkingTokens = usage.thinking_tokens ?? 0

    return {
      usage: {
        inputTokens: inputTokens + cacheRead,
        cachedInputTokens: cacheRead,
        outputTokens: outputTokens,
        reasoningOutputTokens: thinkingTokens,
      },
      finalMessage: typeof result.response === "string" ? result.response : "",
      costUsd: null,
      turns: result.num_turns ?? null,
      failure: result.status !== "SUCCESS" ? (result.error || "Run reported an error.") : null,
    }
  },

  dryRunOutput() {
    return JSON.stringify({
      conversation_id: "dry-run",
      status: "SUCCESS",
      response: "Dry run completed without calling a model.",
      duration_seconds: 1.23,
      num_turns: 1,
      usage: {
        input_tokens: 1200,
        output_tokens: 180,
        thinking_tokens: 90,
        cache_read_tokens: 0,
        total_tokens: 1380,
      },
    })
  },
}
