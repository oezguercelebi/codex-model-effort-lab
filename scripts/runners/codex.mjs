import process from "node:process"
import { findBinary } from "../lib/process.mjs"

/*
  The Codex runner. Behaviour here is exactly what the benchmark shipped with —
  it was extracted from run-benchmark.mjs unchanged so the published runs stay
  reproducible.
*/
export const codexRunner = {
  id: "codex",
  label: "Codex CLI",
  efforts: ["low", "medium", "high", "xhigh"],

  supportsEffort() {
    return true
  },

  modelLabel(model) {
    if (/^gpt-[\d.]+$/.test(model)) return model.toUpperCase()
    const name = model.replace(/^gpt-[\d.]+-/, "")
    return name.charAt(0).toUpperCase() + name.slice(1)
  },

  async detect() {
    const found = await findBinary([
      process.env.CODEX_BIN,
      "codex",
      "/Applications/ChatGPT.app/Contents/Resources/codex",
    ])
    if (!found) {
      throw new Error("No working Codex CLI found. Set CODEX_BIN to a working Codex executable.")
    }
    return found
  },

  invocation({ model, effort, workspace, finalFile, benchmark }) {
    return {
      args: [
        "exec",
        "--json",
        "--ephemeral",
        "--ignore-user-config",
        "--ignore-rules",
        "--color",
        "never",
        "--model",
        model,
        "--config",
        `model_reasoning_effort="${effort}"`,
        "--sandbox",
        benchmark.policy.sandbox,
        "--cd",
        workspace,
        "--output-last-message",
        finalFile,
        "-",
      ],
      usesStdinPrompt: true,
    }
  },

  parse({ stdout }) {
    const events = []
    for (const line of stdout.split("\n")) {
      if (!line.trim()) continue
      try {
        events.push(JSON.parse(line))
      } catch {
        // Preserve malformed output privately, but never publish it as structured data.
      }
    }

    const completed = [...events].reverse().find((event) => event.type === "turn.completed")
    const messages = events.filter(
      (event) => event.type === "item.completed" && event.item?.type === "agent_message",
    )
    const usage = completed?.usage ?? {}

    return {
      finalMessage: messages.at(-1)?.item?.text ?? "",
      usage: {
        inputTokens: usage.input_tokens ?? 0,
        cachedInputTokens: usage.cached_input_tokens ?? 0,
        outputTokens: usage.output_tokens ?? 0,
        reasoningOutputTokens: usage.reasoning_output_tokens ?? 0,
      },
      costUsd: null,
      turns: null,
    }
  },

  dryRunOutput() {
    return [
      JSON.stringify({ type: "thread.started", thread_id: "dry-run" }),
      JSON.stringify({
        type: "item.completed",
        item: { type: "agent_message", text: "Dry run completed without calling a model." },
      }),
      JSON.stringify({
        type: "turn.completed",
        usage: {
          input_tokens: 1200,
          cached_input_tokens: 0,
          output_tokens: 180,
          reasoning_output_tokens: 90,
        },
      }),
    ].join("\n")
  },
}
