import { createHash } from "node:crypto"
import { spawn } from "node:child_process"
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { createInterface } from "node:readline/promises"
import { captureScreenshots } from "./capture-screenshots.mjs"

const root = path.resolve(import.meta.dirname, "..")
const benchmark = JSON.parse(await readFile(path.join(root, "benchmark", "v1.json"), "utf8"))
const validEfforts = new Set(["low", "medium", "high", "xhigh"])

function parseArgs(argv) {
  const options = { dryRun: false, recordSubscription: false }

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === "--dry-run") options.dryRun = true
    else if (argument === "--record-subscription") options.recordSubscription = true
    else if (argument.startsWith("--")) {
      const value = argv[index + 1]
      if (value == null || value.startsWith("--")) throw new Error(`Missing value for ${argument}`)
      options[argument.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value
      index += 1
    } else throw new Error(`Unknown argument: ${argument}`)
  }

  return options
}

function safeSlug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

function modelLabel(model) {
  if (/^gpt-[\d.]+$/.test(model)) return model.toUpperCase()
  const name = model.replace(/^gpt-[\d.]+-/, "")
  return name.charAt(0).toUpperCase() + name.slice(1)
}

function effortLabel(effort) {
  if (effort === "low") return "Light"
  if (effort === "xhigh") return "Extra High"
  return effort.charAt(0).toUpperCase() + effort.slice(1)
}

function asPercent(value, label) {
  if (value == null || value === "") return null
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0 || number > 100) {
    throw new Error(`${label} must be between 0 and 100`)
  }
  return number
}

async function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["pipe", "pipe", "pipe"],
    })
    let stdout = ""
    let stderr = ""
    let timedOut = false

    child.stdout.on("data", (chunk) => {
      stdout += chunk
      if (options.echoStdout) process.stdout.write(chunk)
    })
    child.stderr.on("data", (chunk) => {
      stderr += chunk
      if (options.echoStderr) process.stderr.write(chunk)
    })
    child.once("error", reject)

    let timer
    if (options.timeoutMs) {
      timer = setTimeout(() => {
        timedOut = true
        child.kill("SIGTERM")
      }, options.timeoutMs)
    }

    child.once("close", (code, signal) => {
      if (timer) clearTimeout(timer)
      resolve({ code: code ?? 1, signal, stdout, stderr, timedOut })
    })

    if (options.input != null) child.stdin.end(options.input)
    else child.stdin.end()
  })
}

async function requireSuccess(command, args, options = {}) {
  const result = await run(command, args, { ...options, echoStdout: true, echoStderr: true })
  if (result.code !== 0) throw new Error(`${command} ${args.join(" ")} failed with exit code ${result.code}`)
  return result
}

async function findCodex() {
  const candidates = [
    process.env.CODEX_BIN,
    "codex",
    "/Applications/ChatGPT.app/Contents/Resources/codex",
  ].filter(Boolean)

  for (const candidate of [...new Set(candidates)]) {
    try {
      const result = await run(candidate, ["--version"])
      if (result.code === 0) return { binary: candidate, version: result.stdout.trim() }
    } catch {
      // Try the next known installation.
    }
  }

  throw new Error("No working Codex CLI found. Set CODEX_BIN to a working Codex executable.")
}

async function hashDirectory(directory) {
  const hash = createHash("sha256")

  async function visit(current) {
    const entries = await readdir(current, { withFileTypes: true })
    entries.sort((a, b) => a.name.localeCompare(b.name))
    for (const entry of entries) {
      if (["node_modules", "dist"].includes(entry.name)) continue
      const absolute = path.join(current, entry.name)
      const relative = path.relative(directory, absolute).split(path.sep).join("/")
      hash.update(relative)
      if (entry.isDirectory()) await visit(absolute)
      else hash.update(await readFile(absolute))
    }
  }

  await visit(directory)
  return hash.digest("hex")
}

async function collectCodeStats(directory) {
  const codeExtensions = new Set([".css", ".html", ".js", ".jsx", ".ts", ".tsx"])
  let sourceFiles = 0
  let sourceLines = 0

  async function visit(current) {
    const entries = await readdir(current, { withFileTypes: true })
    for (const entry of entries) {
      if ([".git", "dist", "node_modules"].includes(entry.name)) continue
      const absolute = path.join(current, entry.name)
      if (entry.isDirectory()) await visit(absolute)
      else if (codeExtensions.has(path.extname(entry.name))) {
        const contents = await readFile(absolute, "utf8")
        sourceFiles += 1
        sourceLines += contents.split(/\r?\n/).filter((line) => line.trim()).length
      }
    }
  }

  await visit(directory)
  return { sourceFiles, sourceLines }
}

function parseEvents(jsonl) {
  const events = []
  for (const line of jsonl.split("\n")) {
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
  }
}

async function askPercent(question) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) return null
  const reader = createInterface({ input: process.stdin, output: process.stdout })
  try {
    return asPercent(await reader.question(`${question} (Enter to skip): `), question)
  } finally {
    reader.close()
  }
}

async function writeFailurePreview(directory, title, detail) {
  await mkdir(directory, { recursive: true })
  const escaped = detail.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  await writeFile(
    path.join(directory, "index.html"),
    `<!doctype html><meta name="viewport" content="width=device-width"><title>${title}</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#171717;color:#fafafa;font:16px system-ui}.card{max-width:620px;margin:24px;padding:32px;border:1px solid #444;border-radius:18px;background:#222}h1{margin-top:0;color:#ffcf5c}pre{white-space:pre-wrap;color:#bbb;font-size:12px}</style><div class="card"><p>Captured benchmark result</p><h1>${title}</h1><p>This run did not produce a deployable preview. The failure is preserved rather than rerun.</p><pre>${escaped.slice(-4000)}</pre></div>`,
  )
}

const options = parseArgs(process.argv.slice(2))
if (!options.model) throw new Error("Missing --model")
if (!options.effort || !validEfforts.has(options.effort)) {
  throw new Error("Use --effort low, medium, high, or xhigh")
}

const listedConfiguration = benchmark.configurations.some(
  (configuration) => configuration.model === options.model && configuration.effort === options.effort,
)
if (!listedConfiguration) throw new Error("The requested model/effort pair is not in benchmark/v1.json")

const runId = `${safeSlug(options.model)}-${options.effort}-${timestamp()}${options.dryRun ? "-dry" : ""}`
const privateDirectory = path.join(root, options.dryRun ? ".benchmark-work" : ".benchmark-private", runId)
const workspace = path.join(privateDirectory, "workspace")
const resultDirectory = options.dryRun
  ? path.join(root, ".benchmark-work", "dry-runs", runId)
  : path.join(root, "runs", safeSlug(options.model), options.effort, runId)
const eventsFile = path.join(privateDirectory, "events.jsonl")
const stderrFile = path.join(privateDirectory, "codex-stderr.log")
const capturedFinalFile = path.join(privateDirectory, "final-response.md")
const prompt = await readFile(path.join(root, benchmark.prompt), "utf8")
const promptSha256 = createHash("sha256").update(prompt).digest("hex")
const starterSha256 = await hashDirectory(path.join(root, benchmark.starter))

await rm(privateDirectory, { recursive: true, force: true })
await mkdir(privateDirectory, { recursive: true })
await cp(path.join(root, benchmark.starter), workspace, {
  recursive: true,
  filter: (source) => !source.split(path.sep).some((segment) => ["node_modules", "dist"].includes(segment)),
})

process.stdout.write(`Preparing ${runId}\n`)
await requireSuccess("npm", ["ci"], { cwd: workspace })
await requireSuccess("git", ["init", "-b", "main"], { cwd: workspace })
await requireSuccess("git", ["-c", "user.name=Codex Build Arena", "-c", "user.email=benchmark@localhost", "add", "-A"], { cwd: workspace })
await requireSuccess("git", ["-c", "user.name=Codex Build Arena", "-c", "user.email=benchmark@localhost", "commit", "-m", "Frozen benchmark starter"], { cwd: workspace })

let remainingBefore = asPercent(options.remainingBefore, "remaining-before")
let remainingAfter = asPercent(options.remainingAfter, "remaining-after")
if (options.recordSubscription && remainingBefore == null && !options.dryRun) {
  remainingBefore = await askPercent("Subscription remaining before the run")
}

let codexExitCode = 0
let codexVersion = "dry-run"
let rawEvents = ""
let codexError = ""
const startedAt = Date.now()

if (options.dryRun) {
  rawEvents = [
    JSON.stringify({ type: "thread.started", thread_id: "dry-run" }),
    JSON.stringify({ type: "item.completed", item: { type: "agent_message", text: "Dry run completed without calling a model." } }),
    JSON.stringify({ type: "turn.completed", usage: { input_tokens: 1200, cached_input_tokens: 0, output_tokens: 180, reasoning_output_tokens: 90 } }),
  ].join("\n")
  await writeFile(capturedFinalFile, "Dry run completed without calling a model.\n")
} else {
  const codex = await findCodex()
  codexVersion = codex.version
  process.stdout.write(`Running ${options.model} with ${options.effort} effort using ${codexVersion}\n`)
  const codexResult = await run(
    codex.binary,
    [
      "exec",
      "--json",
      "--ephemeral",
      "--ignore-user-config",
      "--ignore-rules",
      "--color",
      "never",
      "--model",
      options.model,
      "--config",
      `model_reasoning_effort=\"${options.effort}\"`,
      "--sandbox",
      benchmark.policy.sandbox,
      "--cd",
      workspace,
      "--output-last-message",
      capturedFinalFile,
      "-",
    ],
    {
      cwd: workspace,
      input: prompt,
      echoStderr: true,
      timeoutMs: benchmark.policy.maxDurationMinutes * 60_000,
    },
  )
  codexExitCode = codexResult.code
  rawEvents = codexResult.stdout
  codexError = codexResult.stderr
  if (codexResult.timedOut) codexError += "\nRun exceeded the configured time limit."
}

const durationMs = Date.now() - startedAt
await writeFile(eventsFile, `${rawEvents.trim()}\n`)
await writeFile(stderrFile, codexError)

if (options.recordSubscription && remainingAfter == null && !options.dryRun) {
  remainingAfter = await askPercent("Subscription remaining after the run")
}

const buildResult = await run("npm", ["run", "build"], {
  cwd: workspace,
  echoStdout: true,
  echoStderr: true,
  timeoutMs: 5 * 60_000,
})
const buildSucceeded = buildResult.code === 0
const parsed = parseEvents(rawEvents)
const codeStats = await collectCodeStats(workspace)

let finalMessage = parsed.finalMessage
try {
  finalMessage = (await readFile(capturedFinalFile, "utf8")).trim() || finalMessage
} catch {
  // The parsed public agent message remains the fallback.
}
if (!finalMessage) finalMessage = codexError || "The run ended without a final response."

await rm(resultDirectory, { recursive: true, force: true })
await mkdir(resultDirectory, { recursive: true })
await cp(workspace, path.join(resultDirectory, "source"), {
  recursive: true,
  filter: (source) => !source.split(path.sep).some((segment) => [".git", "node_modules", "dist"].includes(segment)),
})
await writeFile(path.join(resultDirectory, "final.md"), `${finalMessage}\n`)

const previewDirectory = path.join(resultDirectory, "preview")
if (buildSucceeded) await cp(path.join(workspace, "dist"), previewDirectory, { recursive: true })
else await writeFailurePreview(previewDirectory, "Build failed", buildResult.stderr || buildResult.stdout)

let screenshotsCaptured = false
try {
  await captureScreenshots(previewDirectory, resultDirectory)
  screenshotsCaptured = true
} catch (error) {
  process.stderr.write(`Screenshot capture skipped: ${error.message}\n`)
}

const observedChangePercent =
  remainingBefore != null && remainingAfter != null ? Math.max(0, remainingBefore - remainingAfter) : null
const status = options.dryRun ? "dry-run" : codexExitCode === 0 && buildSucceeded ? "published" : "failed"
const metadata = {
  schemaVersion: 1,
  benchmarkId: benchmark.id,
  runId,
  status,
  title: "Weekender",
  model: options.model,
  modelLabel: modelLabel(options.model),
  effort: options.effort,
  effortLabel: effortLabel(options.effort),
  recordedAt: new Date().toISOString(),
  durationMs,
  codexVersion,
  codexExitCode,
  previewDirectory: "preview",
  promptSha256,
  starterSha256,
  usage: parsed.usage,
  codeStats,
  subscription: {
    planLabel: options.planLabel ?? null,
    windowLabel: options.windowLabel ?? null,
    remainingBeforePercent: remainingBefore,
    remainingAfterPercent: remainingAfter,
    observedChangePercent,
  },
  verification: {
    buildSucceeded,
    screenshotsCaptured,
  },
  notes: options.dryRun
    ? "Pipeline dry run. No model was called and these usage numbers are synthetic."
    : status === "published"
      ? "Captured without follow-up messages or manual repair."
      : "The failed attempt is preserved without a retry.",
}
await writeFile(path.join(resultDirectory, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`)

process.stdout.write(`\nResult: ${resultDirectory}\n`)
process.stdout.write(`Status: ${status}\n`)
process.stdout.write(`Build: ${buildSucceeded ? "passed" : "failed"}\n`)
process.stdout.write(`Screenshots: ${screenshotsCaptured ? "captured" : "not captured"}\n`)
if (!options.dryRun) process.stdout.write("Run npm run build:site to refresh the local public gallery.\n")

if (!options.dryRun && status === "failed") process.exitCode = 1
