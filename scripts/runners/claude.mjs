import process from "node:process"
import { findBinary } from "../lib/process.mjs"

/*
  The Claude Code runner.

  Two policy decisions worth stating, because they are what make a run
  comparable to a Codex run rather than merely similar:

  --safe-mode disables every local customization (CLAUDE.md, skills, plugins,
  hooks, MCP servers, custom agents, output styles). Without it the maintainer's
  own configuration leaks into the benchmark and no two machines produce the
  same run. It is this runner's equivalent of Codex's
  --ignore-user-config --ignore-rules.

  WebSearch and WebFetch are denied to match the benchmark's
  networkForGeneratedCommands: false policy. The starter's dependencies are
  installed before the run begins, so nothing legitimate needs the network.
*/

const EFFORT_CAPABLE = /^claude-(fable|mythos|opus|sonnet)-/

const MODEL_LABELS = {
  "claude-fable-5": "Fable 5",
  "claude-opus-5": "Opus 5",
  "claude-sonnet-5": "Sonnet 5",
  "claude-haiku-4-5": "Haiku 4.5",
}

export const claudeRunner = {
  id: "claude",
  label: "Claude Code",
  efforts: ["low", "medium", "high", "xhigh", "max"],

  // Haiku 4.5 has no effort parameter — the flag is an error there, so a Haiku
  // run is recorded as sitting off the effort axis rather than pretending to a
  // level it never had.
  supportsEffort(model) {
    return EFFORT_CAPABLE.test(model)
  },

  modelLabel(model) {
    if (MODEL_LABELS[model]) return MODEL_LABELS[model]
    const name = model.replace(/^claude-/, "").replace(/-/g, " ")
    return name.replace(/\b[a-z]/g, (letter) => letter.toUpperCase())
  },

  async detect() {
    const found = await findBinary([process.env.CLAUDE_BIN, "claude"])
    if (!found) {
      throw new Error("No working Claude Code CLI found. Set CLAUDE_BIN to a working executable.")
    }
    return { binary: found.binary, version: `claude-code ${found.version.split(/\s+/)[0]}` }
  },

  invocation({ model, effort, benchmark }) {
    const args = [
      "--print",
      "--output-format",
      "json",
      "--model",
      model,
      "--safe-mode",
      "--strict-mcp-config",
      "--no-session-persistence",
      "--exclude-dynamic-system-prompt-sections",
      "--dangerously-skip-permissions",
      "--disallowed-tools",
      "WebSearch",
      "WebFetch",
    ]

    if (this.supportsEffort(model)) args.push("--effort", effort)
    if (benchmark.policy.maxCostUsd) args.push("--max-budget-usd", String(benchmark.policy.maxCostUsd))

    // The prompt arrives on stdin, and the run happens in the workspace cwd.
    return { args, usesStdinPrompt: true }
  },

  parse({ stdout, stderr }) {
    let result = null
    for (const line of stdout.split("\n")) {
      const text = line.trim()
      if (!text.startsWith("{")) continue
      try {
        const parsed = JSON.parse(text)
        if (parsed.type === "result") result = parsed
      } catch {
        // Non-result JSON lines are ignored; the raw stream is kept privately.
      }
    }

    if (!result) {
      return {
        finalMessage: "",
        usage: { inputTokens: 0, cachedInputTokens: 0, outputTokens: 0, reasoningOutputTokens: 0 },
        costUsd: null,
        turns: null,
        failure: stderr.trim() || "Claude Code produced no result object.",
      }
    }

    const usage = result.usage ?? {}
    const cacheRead = usage.cache_read_input_tokens ?? 0
    const cacheCreation = usage.cache_creation_input_tokens ?? 0

    return {
      // inputTokens is reported the way Codex reports it — the full input
      // including everything served from cache — so the two rolls stay
      // comparable on the same axis.
      usage: {
        inputTokens: (usage.input_tokens ?? 0) + cacheCreation + cacheRead,
        cachedInputTokens: cacheRead,
        outputTokens: usage.output_tokens ?? 0,
        // Claude bills thinking inside output_tokens and does not break it out,
        // so there is no reasoning figure to publish rather than a guessed one.
        reasoningOutputTokens: null,
      },
      finalMessage: typeof result.result === "string" ? result.result : "",
      costUsd: typeof result.total_cost_usd === "number" ? result.total_cost_usd : null,
      turns: result.num_turns ?? null,
      failure: result.is_error ? result.api_error_status || result.subtype || "Run reported an error." : null,
    }
  },

  dryRunOutput() {
    return JSON.stringify({
      type: "result",
      subtype: "success",
      is_error: false,
      num_turns: 1,
      total_cost_usd: 0.0123,
      result: "Dry run completed without calling a model.",
      usage: {
        input_tokens: 40,
        cache_creation_input_tokens: 1200,
        cache_read_input_tokens: 8000,
        output_tokens: 180,
      },
    })
  },
}
