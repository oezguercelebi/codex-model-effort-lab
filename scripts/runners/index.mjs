import { antigravityRunner } from "./antigravity.mjs"
import { claudeRunner } from "./claude.mjs"
import { codexRunner } from "./codex.mjs"

const runners = new Map([
  [codexRunner.id, codexRunner],
  [claudeRunner.id, claudeRunner],
  [antigravityRunner.id, antigravityRunner],
  ["gemini", antigravityRunner],
])

export function getRunner(id = "codex") {
  const runner = runners.get(id)
  if (!runner) {
    throw new Error(`Unknown runner "${id}". Available: ${[...runners.keys()].join(", ")}`)
  }
  return runner
}

export function runnerIds() {
  return [...runners.keys()]
}

