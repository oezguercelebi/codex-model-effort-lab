import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { run } from "./lib/process.mjs"

/*
  Drives a whole benchmark matrix. Each configuration is an independent run in
  its own workspace, so a few can run at once — but the concurrency stays low by
  default because every run also does an npm install and a Vite build, and the
  wall-clock of a run is part of what the benchmark measures.

  Already-captured configurations are skipped, so an interrupted roll is resumed
  by re-running the same command.
*/

const root = path.resolve(import.meta.dirname, "..")

function parseArgs(argv) {
  const options = { concurrency: 2, dryRun: false, force: false }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === "--dry-run") options.dryRun = true
    else if (argument === "--force") options.force = true
    else if (argument.startsWith("--")) {
      const value = argv[index + 1]
      if (value == null || value.startsWith("--")) throw new Error(`Missing value for ${argument}`)
      options[argument.slice(2)] = value
      index += 1
    } else throw new Error(`Unknown argument: ${argument}`)
  }
  options.concurrency = Number(options.concurrency) || 2
  return options
}

function safeSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

async function alreadyCaptured(model, effort) {
  const directory = path.join(root, "runs", safeSlug(model), effort)
  try {
    const entries = await readdir(directory)
    return entries.length > 0
  } catch {
    return false
  }
}

function durationLabel(ms) {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.round((ms % 60000) / 1000)
  return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`
}

const options = parseArgs(process.argv.slice(2))
const benchmarkFile = options.benchmark ?? "v1.json"
const benchmark = JSON.parse(await readFile(path.join(root, "benchmark", benchmarkFile), "utf8"))

const queue = []
for (const configuration of benchmark.configurations) {
  if (!options.force && !options.dryRun && (await alreadyCaptured(configuration.model, configuration.effort))) {
    process.stdout.write(`skip  ${configuration.model} ${configuration.effort} (already captured)\n`)
    continue
  }
  queue.push(configuration)
}

if (!queue.length) {
  process.stdout.write("Nothing to run — every configuration is already captured.\n")
  process.exit(0)
}

process.stdout.write(
  `\nRolling ${queue.length} configuration(s) from ${benchmarkFile} at concurrency ${options.concurrency}\n\n`,
)

const results = []
let cursor = 0

async function worker() {
  while (cursor < queue.length) {
    const configuration = queue[cursor++]
    const tag = `${configuration.model} ${configuration.effort}`
    const startedAt = Date.now()
    process.stdout.write(`start ${tag}\n`)

    const args = [
      path.join(root, "scripts", "run-benchmark.mjs"),
      "--benchmark",
      benchmarkFile,
      "--model",
      configuration.model,
      "--effort",
      configuration.effort,
    ]
    if (options.dryRun) args.push("--dry-run")

    const result = await run(process.execPath, args, { cwd: root })
    const elapsed = Date.now() - startedAt
    const ok = result.code === 0

    // A failed run is a published result, not an aborted roll — the benchmark
    // preserves failures rather than retrying them.
    results.push({ tag, ok, elapsed, stderr: result.stderr })
    process.stdout.write(`${ok ? "done " : "FAIL "} ${tag} (${durationLabel(elapsed)})\n`)
    if (!ok) process.stdout.write(`      ${result.stderr.trim().split("\n").slice(-3).join("\n      ")}\n`)
  }
}

await Promise.all(Array.from({ length: Math.min(options.concurrency, queue.length) }, worker))

process.stdout.write("\n── roll complete ──\n")
for (const entry of results) {
  process.stdout.write(`${entry.ok ? "ok    " : "failed"} ${entry.tag} · ${durationLabel(entry.elapsed)}\n`)
}
const failed = results.filter((entry) => !entry.ok).length
process.stdout.write(`\n${results.length - failed} captured, ${failed} failed\n`)
process.stdout.write("Run npm run build:thumbnails && npm run build:site to refresh the gallery.\n")
