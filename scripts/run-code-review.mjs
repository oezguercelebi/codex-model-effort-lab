import { createHash } from "node:crypto"
import { spawn } from "node:child_process"
import { createServer } from "node:http"
import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { chromium } from "playwright-core"

const root = path.resolve(import.meta.dirname, "..")
const reviewBenchmark = await readJson(path.join(root, "benchmark", "code-review-v1.json"))
const targetBenchmark = await readJson(path.join(root, "benchmark", "v1.json"))
const calibration = await readJson(path.join(root, reviewBenchmark.calibrationManifest))
const categoryIds = reviewBenchmark.rubric.map((category) => category.id)
const categoryIdSet = new Set(categoryIds)
const severitySet = new Set(reviewBenchmark.severityLevels)
const codeExtensions = new Set([".css", ".html", ".js", ".jsx", ".ts", ".tsx"])

function parseArgs(argv) {
  const options = { calibration: false, checksOnly: false, publish: false, recheckPublished: false }
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index]
    if (argument === "--calibration") options.calibration = true
    else if (argument === "--checks-only") options.checksOnly = true
    else if (argument === "--publish") options.publish = true
    else if (argument === "--recheck-published") options.recheckPublished = true
    else if (argument.startsWith("--")) {
      const value = argv[index + 1]
      if (!value || value.startsWith("--")) throw new Error(`Missing value for ${argument}`)
      options[argument.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = value
      index += 1
    } else throw new Error(`Unknown argument: ${argument}`)
  }
  return options
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"))
}

function timestamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")
}

function digest(value) {
  return createHash("sha256").update(value).digest("hex")
}

function round(value) {
  return Math.round(value * 100) / 100
}

function sanitizeOutput(value, workspace) {
  let sanitized = value
    .replaceAll(workspace, "<workspace>")
    .replaceAll(root, "<benchmark-root>")
  if (process.env.HOME) sanitized = sanitized.replaceAll(process.env.HOME, "<home>")
  return sanitized.slice(-8_000)
}

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
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
      if (options.echo) process.stdout.write(chunk)
    })
    child.stderr.on("data", (chunk) => {
      stderr += chunk
      if (options.echo) process.stderr.write(chunk)
    })
    child.once("error", reject)

    let killTimer
    const timeout = options.timeoutMs
      ? setTimeout(() => {
          timedOut = true
          child.kill("SIGTERM")
          killTimer = setTimeout(() => child.kill("SIGKILL"), 5_000)
        }, options.timeoutMs)
      : null

    child.once("close", (code, signal) => {
      if (timeout) clearTimeout(timeout)
      if (killTimer) clearTimeout(killTimer)
      resolve({ code: code ?? 1, signal, stdout, stderr, timedOut })
    })
    child.stdin.end(options.input ?? "")
  })
}

async function hashDirectory(directory) {
  const hash = createHash("sha256")
  async function visit(current) {
    const entries = await readdir(current, { withFileTypes: true })
    entries.sort((a, b) => a.name.localeCompare(b.name))
    for (const entry of entries) {
      if ([".git", "dist", "node_modules"].includes(entry.name)) continue
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

async function collectFiles(directory, predicate = () => true) {
  const files = []
  async function visit(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      if ([".git", "dist", "node_modules"].includes(entry.name)) continue
      const absolute = path.join(current, entry.name)
      if (entry.isDirectory()) await visit(absolute)
      else if (predicate(absolute)) files.push(absolute)
    }
  }
  await visit(directory)
  return files.sort()
}

async function collectSourceStats(directory) {
  const files = await collectFiles(directory, (file) => codeExtensions.has(path.extname(file)))
  let lines = 0
  let remoteReferences = []
  for (const file of files) {
    const contents = await readFile(file, "utf8")
    lines += contents.split(/\r?\n/).filter((line) => line.trim()).length
    const matches = contents.match(/https?:\/\/[^\s"'`)]+/g) ?? []
    remoteReferences.push(
      ...matches.map((url) => ({
        file: path.relative(directory, file).split(path.sep).join("/"),
        url: url.slice(0, 240),
      })),
    )
  }
  remoteReferences = remoteReferences.slice(0, 20)
  return { files: files.length, nonEmptyLines: lines, remoteReferences }
}

function dependencyMap(manifest) {
  return new Map(
    Object.entries({ ...(manifest.dependencies ?? {}), ...(manifest.devDependencies ?? {}) }),
  )
}

function compareDependencies(starterManifest, candidateManifest) {
  const starter = dependencyMap(starterManifest)
  const candidate = dependencyMap(candidateManifest)
  const added = []
  const removed = []
  const changed = []
  for (const [name, version] of candidate) {
    if (!starter.has(name)) added.push({ name, version })
    else if (starter.get(name) !== version) {
      changed.push({ name, expected: starter.get(name), actual: version })
    }
  }
  for (const [name, version] of starter) {
    if (!candidate.has(name)) removed.push({ name, version })
  }
  return {
    status: added.length === 0 && removed.length === 0 && changed.length === 0 ? "pass" : "fail",
    added,
    removed,
    changed,
  }
}

async function directoryBytes(directory) {
  if (!(await exists(directory))) return 0
  let bytes = 0
  async function visit(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name)
      if (entry.isDirectory()) await visit(absolute)
      else bytes += (await stat(absolute)).size
    }
  }
  await visit(directory)
  return bytes
}

async function findBrowser() {
  const candidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean)
  for (const candidate of candidates) if (await exists(candidate)) return candidate
  throw new Error("No Chrome or Chromium executable found. Set CHROME_BIN.")
}

async function startStaticServer(directory) {
  const absoluteRoot = path.resolve(directory)
  const mimeTypes = {
    ".css": "text/css; charset=utf-8",
    ".gif": "image/gif",
    ".html": "text/html; charset=utf-8",
    ".jpeg": "image/jpeg",
    ".jpg": "image/jpeg",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".png": "image/png",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
  }
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname)
      const requested = path.resolve(absoluteRoot, `.${pathname}`)
      if (requested !== absoluteRoot && !requested.startsWith(`${absoluteRoot}${path.sep}`)) {
        response.writeHead(403).end("Forbidden")
        return
      }
      let file = requested
      if ((await stat(file)).isDirectory()) file = path.join(file, "index.html")
      response.writeHead(200, {
        "content-type": mimeTypes[path.extname(file).toLowerCase()] ?? "application/octet-stream",
        "cache-control": "no-store",
      })
      response.end(await readFile(file))
    } catch {
      response.writeHead(404).end("Not found")
    }
  })
  await new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", resolve)
  })
  return {
    server,
    url: `http://127.0.0.1:${server.address().port}/`,
  }
}

function check(id, passed, evidence) {
  return { id, status: passed ? "pass" : "fail", evidence }
}

async function inspectViewport(browser, url, viewport) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const consoleErrors = []
  const pageErrors = []
  const externalRequests = []
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text().slice(0, 500))
  })
  page.on("pageerror", (error) => pageErrors.push(error.message.slice(0, 500)))
  await context.route("**/*", async (route) => {
    const requestUrl = route.request().url()
    if (!requestUrl.startsWith(url)) {
      externalRequests.push(requestUrl.slice(0, 300))
      await route.abort()
    } else await route.continue()
  })

  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 })
    await page.evaluate(() => document.fonts?.ready)
    const initial = await page.evaluate(() => {
      const visible = (element) => {
        const style = getComputedStyle(element)
        const rect = element.getBoundingClientRect()
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0
      }
      const nameOf = (element) => {
        const id = element.getAttribute("id")
        const label = id ? document.querySelector(`label[for="${CSS.escape(id)}"]`)?.textContent : ""
        const labelledBy = (element.getAttribute("aria-labelledby") ?? "")
          .split(/\s+/)
          .filter(Boolean)
          .map((labelId) => document.getElementById(labelId)?.textContent ?? "")
          .join(" ")
        const associatedLabels = "labels" in element
          ? [...(element.labels ?? [])].map((item) => item.textContent ?? "").join(" ")
          : ""
        return (
          element.getAttribute("aria-label") ||
          labelledBy ||
          element.getAttribute("title") ||
          label ||
          associatedLabels ||
          element.textContent ||
          element.querySelector("img")?.getAttribute("alt") ||
          ""
        ).trim()
      }
      const interactive = [...document.querySelectorAll("button,a[href],input,select,textarea,[role=button],[tabindex]")]
        .filter(visible)
        .map((element, index) => {
          element.setAttribute("data-benchmark-interactive-index", String(index))
          return {
            index,
            tag: element.tagName.toLowerCase(),
            name: nameOf(element).replace(/\s+/g, " ").slice(0, 120),
            disabled: Boolean(element.disabled) || element.getAttribute("aria-disabled") === "true",
          }
        })
      const cardLike = [...document.querySelectorAll("article,[class*=destination],[class*=Destination]")]
        .filter(visible)
        .filter((element) => (element.textContent ?? "").trim().length > 30).length
      const itineraryRegions = [...document.querySelectorAll('[id*="itinerary" i],[class*="itinerary" i],[id*="trip-plan" i],[class*="trip-plan" i]')]
        .filter(visible)
        .filter((element) => (element.textContent ?? "").trim().length > 80).length
      return {
        text: document.body.innerText.replace(/\s+/g, " ").slice(0, 30_000),
        textLength: document.body.innerText.trim().length,
        headings: [...document.querySelectorAll("h1,h2,h3")]
          .filter(visible)
          .map((element) => element.textContent.trim().replace(/\s+/g, " ").slice(0, 120))
          .filter(Boolean)
          .slice(0, 30),
        cardLike,
        itineraryRegions,
        interactive,
        horizontalOverflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        passwordFields: document.querySelectorAll('input[type="password"]').length,
      }
    })

    const lowerText = initial.text.toLowerCase()
    const moneyMatches = initial.text.match(/(?:[$€£]\s?\d[\d,.]*|\d[\d,.]*\s?(?:usd|eur|gbp))/gi) ?? []
    const timeMatches = initial.text.match(/(?:\d+(?:\.\d+)?\s?(?:h|hr|hrs|hour|hours|min|mins|minutes)|travel time|drive time|flight time)/gi) ?? []
    const multipleDestinations = initial.cardLike >= 2 || initial.headings.length >= 4

    const voteCandidate = initial.interactive.findIndex(
      (item) => !item.disabled && /^(?:vote(?:\s|\d|$)|voted|your vote|remove vote|favorite|favourite|heart|like)/i.test(item.name),
    )
    let voteChangedState = false
    let voteEvidence = "No enabled control with a vote-like accessible name was found."
    if (voteCandidate >= 0) {
      const locator = page.locator(`[data-benchmark-interactive-index="${voteCandidate}"]`)
      const before = await page.evaluate(() => document.body.innerText)
      const beforeMarkup = await locator.evaluate((element) => element.outerHTML)
      await locator.click({ timeout: 5_000 })
      await page.waitForTimeout(250)
      const after = await page.evaluate(() => document.body.innerText)
      const afterMarkup = await locator.evaluate((element) => element.outerHTML).catch(() => "element removed")
      voteChangedState = before !== after || beforeMarkup !== afterMarkup
      voteEvidence = `${initial.interactive[voteCandidate].tag} "${initial.interactive[voteCandidate].name}" ${voteChangedState ? "changed" : "did not change"} visible text or control state.`
    }

    const itineraryPathActions = []
    let finalText = (await page.locator("body").innerText()).replace(/\s+/g, " ")
    let winnerReachable = initial.itineraryRegions > 0 || /winner|winning destination|itinerary|friday|saturday|sunday|day 1/i.test(finalText)
    if (!winnerReachable) {
      const candidates = page.getByRole("button", { name: /winner|results|itinerary|plan|continue|finalize|view/i })
      const count = await candidates.count()
      for (let index = 0; index < Math.min(count, 4) && !winnerReachable; index += 1) {
        const candidate = candidates.nth(index)
        if (!(await candidate.isVisible().catch(() => false))) continue
        const name = await candidate.innerText().catch(() => "direct action")
        await candidate.click({ timeout: 3_000 }).catch(() => {})
        itineraryPathActions.push(`activated ${name.trim() || "direct itinerary action"}`)
        await page.waitForTimeout(150)
        finalText = (await page.locator("body").innerText()).replace(/\s+/g, " ")
        winnerReachable = /winner|winning destination|itinerary|friday|saturday|sunday|day 1/i.test(finalText)
      }
    }
    if (!winnerReachable) {
      const menuButtons = page.getByRole("button", { name: /open menu|menu|navigation/i })
      for (let index = 0; index < Math.min(await menuButtons.count(), 3) && !winnerReachable; index += 1) {
        const menuButton = menuButtons.nth(index)
        if (!(await menuButton.isVisible().catch(() => false))) continue
        await menuButton.click({ timeout: 3_000 }).catch(() => {})
        itineraryPathActions.push("opened navigation menu")
        await page.waitForTimeout(150)
        const navigationTargets = [
          page.getByRole("button", { name: /itinerary|plan/i }),
          page.getByRole("link", { name: /itinerary|plan/i }),
        ]
        for (const targets of navigationTargets) {
          for (let targetIndex = 0; targetIndex < Math.min(await targets.count(), 4) && !winnerReachable; targetIndex += 1) {
            const target = targets.nth(targetIndex)
            if (!(await target.isVisible().catch(() => false))) continue
            const name = await target.innerText().catch(() => "itinerary")
            await target.click({ timeout: 3_000 }).catch(() => {})
            itineraryPathActions.push(`activated ${name.trim() || "itinerary"} from navigation`)
            await page.waitForTimeout(150)
            finalText = (await page.locator("body").innerText()).replace(/\s+/g, " ")
            winnerReachable = /winner|winning destination|itinerary|friday|saturday|sunday|day 1/i.test(finalText)
          }
        }
      }
    }

    const keyboardTargets = []
    for (let index = 0; index < 12; index += 1) {
      await page.keyboard.press("Tab")
      const target = await page.evaluate(() => {
        const element = document.activeElement
        if (!element || element === document.body) return ""
        return `${element.tagName.toLowerCase()}:${(
          element.getAttribute("aria-label") ||
          element.getAttribute("title") ||
          element.textContent ||
          element.getAttribute("name") ||
          ""
        ).trim().replace(/\s+/g, " ").slice(0, 80)}`
      })
      if (target && !keyboardTargets.includes(target)) keyboardTargets.push(target)
    }

    const unnamedControls = initial.interactive.filter((item) => !item.name && !item.disabled)
    const checks = [
      check("multiple-destinations", multipleDestinations, `${initial.cardLike} destination/article regions and ${initial.headings.length} visible headings detected.`),
      check("expected-budget", moneyMatches.length > 0 || /budget|cost per person|estimated cost/i.test(initial.text), `${moneyMatches.length} monetary values detected; budget wording ${/budget|cost per person|estimated cost/i.test(initial.text) ? "present" : "absent"}.`),
      check("travel-time", timeMatches.length > 0, `${timeMatches.length} travel-time signals detected.`),
      check("vote-interaction", voteChangedState, voteEvidence),
      check("winner-itinerary", winnerReachable, winnerReachable ? `Winner or itinerary content was visible or reachable. ${initial.itineraryRegions} visible itinerary regions detected.${itineraryPathActions.length ? ` Path: ${itineraryPathActions.join("; ")}.` : ""}` : `Winner or itinerary content was not found after the defined direct and navigation-menu path.${itineraryPathActions.length ? ` Tried: ${itineraryPathActions.join("; ")}.` : ""}`),
      check("no-sign-in-or-backend", initial.passwordFields === 0 && initial.textLength > 100, `${initial.passwordFields} password fields; ${initial.textLength} visible text characters.`),
      check("horizontal-overflow", initial.horizontalOverflow <= 1, `${initial.horizontalOverflow}px document-level horizontal overflow.`),
      check("accessible-controls-and-keyboard", unnamedControls.length === 0 && keyboardTargets.length > 0, `${unnamedControls.length} enabled controls lacked a detectable name; ${keyboardTargets.length} unique controls received focus across 12 Tab presses.`),
      check("uncaught-browser-errors", consoleErrors.length === 0 && pageErrors.length === 0, `${consoleErrors.length} console errors and ${pageErrors.length} page errors.`),
    ]

    return {
      viewport,
      checks,
      evidence: {
        headings: initial.headings,
        controls: initial.interactive.slice(0, 40),
        keyboardTargets,
        consoleErrors,
        pageErrors,
        externalRequests: [...new Set(externalRequests)].slice(0, 20),
      },
    }
  } finally {
    await context.close()
  }
}

async function runBrowserChecks(previewDirectory) {
  const executablePath = await findBrowser()
  const { server, url } = await startStaticServer(previewDirectory)
  const browser = await chromium.launch({ executablePath, headless: true })
  try {
    const desktop = await inspectViewport(browser, url, { width: 1440, height: 900 })
    const mobile = await inspectViewport(browser, url, { width: 390, height: 844 })
    return { browserVersion: await browser.version(), desktop, mobile }
  } finally {
    await browser.close()
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
}

function isCorePathUnusable(browserChecks, npmCheckPassed) {
  if (!npmCheckPassed) return true
  const coreIds = ["multiple-destinations", "expected-budget", "travel-time", "vote-interaction", "winner-itinerary"]
  const results = [browserChecks.desktop, browserChecks.mobile].flatMap((viewport) => viewport.checks)
  const failedCoreChecks = coreIds.filter((id) =>
    results.filter((item) => item.id === id).every((item) => item.status === "fail"),
  )
  return failedCoreChecks.length >= 2 || (failedCoreChecks.includes("vote-interaction") && failedCoreChecks.includes("winner-itinerary"))
}

async function findRuns() {
  const matches = new Map()
  async function visit(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      const absolute = path.join(current, entry.name)
      if (entry.isDirectory()) await visit(absolute)
      else if (entry.name === "metadata.json") {
        const metadata = await readJson(absolute)
        if (metadata.benchmarkId === targetBenchmark.id && metadata.model !== "default") {
          matches.set(metadata.runId, { directory: path.dirname(absolute), metadata })
        }
      }
    }
  }
  await visit(path.join(root, "runs"))
  return matches
}

async function runDeterministicChecks(candidate, candidateDirectory) {
  const source = path.join(candidate.directory, "source")
  const checkWorkspace = path.join(candidateDirectory, "check-workspace")
  await cp(source, checkWorkspace, { recursive: true })
  const sourceHashBefore = await hashDirectory(checkWorkspace)
  const starterManifest = await readJson(path.join(root, targetBenchmark.starter, "package.json"))
  const candidateManifest = await readJson(path.join(checkWorkspace, "package.json"))
  const dependencyDiff = compareDependencies(starterManifest, candidateManifest)
  const sourceStats = await collectSourceStats(checkWorkspace)

  const commandEnvironment = {
    ...process.env,
    npm_config_audit: "false",
    npm_config_fund: "false",
    npm_config_update_notifier: "false",
  }
  const installStartedAt = Date.now()
  const install = await run("npm", ["ci", "--prefer-offline"], {
    cwd: checkWorkspace,
    env: commandEnvironment,
    timeoutMs: 5 * 60_000,
  })
  const installDurationMs = Date.now() - installStartedAt
  const checkStartedAt = Date.now()
  const npmCheck = install.code === 0
    ? await run("npm", ["run", "check"], {
        cwd: checkWorkspace,
        env: commandEnvironment,
        timeoutMs: 5 * 60_000,
      })
    : { code: 1, stdout: "", stderr: "npm ci failed, so npm run check was not started.", timedOut: false }
  const checkDurationMs = Date.now() - checkStartedAt
  const sourceHashAfter = await hashDirectory(checkWorkspace)
  const sourceUnchanged = sourceHashBefore === sourceHashAfter

  const previewDirectory = npmCheck.code === 0 && (await exists(path.join(checkWorkspace, "dist")))
    ? path.join(checkWorkspace, "dist")
    : path.join(candidate.directory, candidate.metadata.previewDirectory ?? "preview")
  const browser = await runBrowserChecks(previewDirectory)
  const productionAssetBytes = await directoryBytes(previewDirectory)
  const corePathUnusable = isCorePathUnusable(browser, npmCheck.code === 0)
  const result = {
    schemaVersion: 1,
    reviewBenchmarkId: reviewBenchmark.id,
    blindId: candidateDirectory.split(path.sep).at(-1),
    generatedAt: new Date().toISOString(),
    dependencyDiff,
    source: {
      ...sourceStats,
      hashBefore: sourceHashBefore,
      hashAfter: sourceHashAfter,
      unchangedByChecks: sourceUnchanged,
      productionAssetBytes,
    },
    commands: {
      npmCi: {
        status: install.code === 0 ? "pass" : "fail",
        exitCode: install.code,
        timedOut: install.timedOut,
        durationMs: installDurationMs,
        output: sanitizeOutput(`${install.stdout}\n${install.stderr}`.trim(), checkWorkspace),
      },
      npmRunCheck: {
        status: npmCheck.code === 0 ? "pass" : "fail",
        exitCode: npmCheck.code,
        timedOut: npmCheck.timedOut,
        durationMs: checkDurationMs,
        output: sanitizeOutput(`${npmCheck.stdout}\n${npmCheck.stderr}`.trim(), checkWorkspace),
      },
    },
    browser,
    guardrailFacts: {
      npmRunCheckFailed: npmCheck.code !== 0,
      corePathUnusable,
      corePathDefinition: "npm run check failed, or at least two core acceptance items failed at both viewports.",
    },
  }
  await writeFile(path.join(candidateDirectory, "deterministic-checks.json"), `${JSON.stringify(result, null, 2)}\n`)
  return result
}

async function findCodex() {
  const candidates = [
    process.env.CODEX_BIN,
    "/Applications/ChatGPT.app/Contents/Resources/codex",
    "codex",
  ].filter(Boolean)
  for (const candidate of [...new Set(candidates)]) {
    try {
      const result = await run(candidate, ["--version"])
      if (result.code === 0) return { binary: candidate, version: result.stdout.trim() }
    } catch {
      // Try the next installation.
    }
  }
  throw new Error("No working Codex CLI found. Set CODEX_BIN.")
}

function parseUsage(jsonl) {
  const events = jsonl.split("\n").filter(Boolean).flatMap((line) => {
    try {
      return [JSON.parse(line)]
    } catch {
      return []
    }
  })
  const completed = [...events].reverse().find((event) => event.type === "turn.completed")
  const usage = completed?.usage ?? {}
  return {
    inputTokens: usage.input_tokens ?? 0,
    cachedInputTokens: usage.cached_input_tokens ?? 0,
    outputTokens: usage.output_tokens ?? 0,
    reasoningOutputTokens: usage.reasoning_output_tokens ?? 0,
  }
}

async function validateReview(review, sourceDirectory) {
  const errors = []
  if (review?.schemaVersion !== 1) errors.push("schemaVersion must be 1")
  if (review?.reviewBenchmarkId !== reviewBenchmark.id) errors.push(`reviewBenchmarkId must be ${reviewBenchmark.id}`)
  if (!Array.isArray(review?.categories) || review.categories.length !== categoryIds.length) {
    errors.push(`categories must contain exactly ${categoryIds.length} entries`)
  } else {
    const seen = new Set()
    for (const category of review.categories) {
      if (!categoryIdSet.has(category.id)) errors.push(`unknown category ${category.id}`)
      if (seen.has(category.id)) errors.push(`duplicate category ${category.id}`)
      seen.add(category.id)
      if (!Array.isArray(category.evidence) || category.evidence.length === 0 || category.evidence.some((item) => typeof item !== "string" || !item.trim())) {
        errors.push(`${category.id} must include evidence`)
      }
    }
    for (const id of categoryIds) if (!seen.has(id)) errors.push(`missing category ${id}`)
  }
  if (!Array.isArray(review?.findings)) errors.push("findings must be an array")
  else {
    for (const [index, finding] of review.findings.entries()) {
      if (!severitySet.has(finding.severity)) errors.push(`finding ${index} has invalid severity`)
      if (!categoryIdSet.has(finding.category)) errors.push(`finding ${index} has invalid category`)
      for (const key of ["title", "file", "evidence", "impact", "remediation"]) {
        if (typeof finding[key] !== "string" || !finding[key].trim()) errors.push(`finding ${index} is missing ${key}`)
      }
      if (!Number.isInteger(finding.lineStart) || !Number.isInteger(finding.lineEnd) || finding.lineEnd < finding.lineStart) {
        errors.push(`finding ${index} has an invalid line range`)
        continue
      }
      if (typeof finding.file === "string" && finding.file.startsWith("source/")) {
        const relative = finding.file.slice("source/".length)
        const absolute = path.resolve(sourceDirectory, relative)
        if (absolute !== sourceDirectory && !absolute.startsWith(`${sourceDirectory}${path.sep}`)) {
          errors.push(`finding ${index} points outside source`)
        } else if (!(await exists(absolute))) errors.push(`finding ${index} file does not exist: ${finding.file}`)
        else {
          const lineCount = (await readFile(absolute, "utf8")).split(/\r?\n/).length
          if (finding.lineEnd > lineCount) errors.push(`finding ${index} line ${finding.lineEnd} exceeds ${lineCount}`)
        }
      } else errors.push(`finding ${index} file must start with source/`)
    }
  }
  for (const key of ["strengths", "risks"]) {
    if (!Array.isArray(review?.[key]) || review[key].some((item) => typeof item !== "string" || !item.trim())) {
      errors.push(`${key} must be an array of non-empty strings`)
    }
  }
  if (typeof review?.recommendation !== "string" || !review.recommendation.trim()) errors.push("recommendation is required")
  if (errors.length) throw new Error(`Review validation failed:\n- ${errors.join("\n- ")}`)
}

function scoreReview(review, checks) {
  const capsApplied = []
  const categories = reviewBenchmark.rubric.map((rubricCategory) => {
    const modelCategory = review.categories.find((category) => category.id === rubricCategory.id)
    const categoryFindings = review.findings.filter((finding) => finding.category === rubricCategory.id)
    const findingCounts = Object.fromEntries(
      reviewBenchmark.severityLevels.map((severity) => [
        severity,
        categoryFindings.filter((finding) => finding.severity === severity).length,
      ]),
    )
    let score = findingCounts.critical > 0
      ? 0
      : findingCounts.high > 0 || findingCounts.medium >= 2
        ? 1
        : findingCounts.medium === 1
          ? 2
          : findingCounts.low > 0
            ? 3
            : 4
    if (rubricCategory.id === "correctness" && checks.guardrailFacts.npmRunCheckFailed && score !== 0) {
      score = 0
      capsApplied.push("correctness: npm run check failure forced category to 0")
    } else if (rubricCategory.id === "correctness" && checks.guardrailFacts.corePathUnusable && score > 1) {
      score = 1
      capsApplied.push("correctness: unusable core path capped category at 1")
    }
    return {
      id: rubricCategory.id,
      label: rubricCategory.label,
      score,
      weight: rubricCategory.weight,
      evidence: modelCategory.evidence,
      findingCounts,
    }
  })
  const rawCategories = categories.map((category) => {
    if (category.id !== "correctness") return category
    const categoryFindings = review.findings.filter((finding) => finding.category === category.id)
    const critical = categoryFindings.some((finding) => finding.severity === "critical")
    const high = categoryFindings.some((finding) => finding.severity === "high")
    const medium = categoryFindings.filter((finding) => finding.severity === "medium").length
    const low = categoryFindings.some((finding) => finding.severity === "low")
    const score = critical ? 0 : high || medium >= 2 ? 1 : medium === 1 ? 2 : low ? 3 : 4
    return { ...category, score }
  })
  const rawWeightedScore = round(rawCategories.reduce((total, category) => total + (category.score / 4) * category.weight, 0))
  let totalScore = round(categories.reduce((total, category) => total + (category.score / 4) * category.weight, 0))
  const totalCaps = []
  if (checks.guardrailFacts.npmRunCheckFailed) totalCaps.push({ maximum: 39, reason: "npm run check failed" })
  if (checks.guardrailFacts.corePathUnusable) totalCaps.push({ maximum: 59, reason: "core Weekender path was unusable" })
  if (review.findings.some((finding) => finding.severity === "critical")) {
    totalCaps.push({ maximum: 39, reason: "critical finding" })
  }
  for (const cap of totalCaps) {
    if (totalScore > cap.maximum) {
      totalScore = cap.maximum
      capsApplied.push(`total: ${cap.reason} capped score at ${cap.maximum}`)
    }
  }
  return { categories, rawWeightedScore, capsApplied, totalScore }
}

async function runReviewer(candidateDirectory, checks, codex) {
  const reviewWorkspace = path.join(candidateDirectory, "review-workspace")
  const cleanSource = path.join(reviewWorkspace, "source")
  await mkdir(reviewWorkspace, { recursive: true })
  await cp(path.join(candidateDirectory, "check-workspace"), cleanSource, {
    recursive: true,
    filter: (source) => !source.split(path.sep).some((segment) => ["node_modules", "dist"].includes(segment)),
  })
  await writeFile(path.join(reviewWorkspace, "WEEKENDER_BRIEF.md"), await readFile(path.join(root, targetBenchmark.prompt)))
  await writeFile(path.join(reviewWorkspace, "REVIEW_RUBRIC.md"), await readFile(path.join(root, reviewBenchmark.specification)))
  await writeFile(path.join(reviewWorkspace, "DETERMINISTIC_CHECKS.json"), `${JSON.stringify(checks, null, 2)}\n`)
  await cp(path.join(root, reviewBenchmark.outputSchema), path.join(reviewWorkspace, "review-output.schema.json"))
  await run("git", ["init", "-b", "main"], { cwd: reviewWorkspace })
  await run("git", ["-c", "user.name=Weekender Review Harness", "-c", "user.email=review@localhost", "add", "-A"], { cwd: reviewWorkspace })
  await run("git", ["-c", "user.name=Weekender Review Harness", "-c", "user.email=review@localhost", "commit", "-m", "Blinded review input"], { cwd: reviewWorkspace })

  const outputFile = path.join(candidateDirectory, "reviewer-output.json")
  const eventsFile = path.join(candidateDirectory, "reviewer-events.jsonl")
  const stderrFile = path.join(candidateDirectory, "reviewer-stderr.log")
  const basePrompt = await readFile(path.join(root, reviewBenchmark.prompt), "utf8")
  const prompt = `${basePrompt}\n\nThe blinded input is in the current directory:\n\n- source/: immutable generated source\n- WEEKENDER_BRIEF.md: frozen product brief\n- REVIEW_RUBRIC.md: frozen rubric and guardrails\n- DETERMINISTIC_CHECKS.json: harness evidence\n\nDo not run commands that write files or rebuild the app. Inspect the supplied source and evidence only. Cite files using paths beginning with source/. The harness will calculate weights and caps, so do not return a total score.`
  const startedAt = Date.now()
  const result = await run(
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
      reviewBenchmark.reviewer.model,
      "--config",
      `model_reasoning_effort=\"${reviewBenchmark.reviewer.effort}\"`,
      "--sandbox",
      "read-only",
      "--cd",
      reviewWorkspace,
      "--output-schema",
      path.join(reviewWorkspace, "review-output.schema.json"),
      "--output-last-message",
      outputFile,
      "-",
    ],
    {
      cwd: reviewWorkspace,
      input: prompt,
      echo: false,
      timeoutMs: reviewBenchmark.reviewer.maxDurationMinutes * 60_000,
    },
  )
  await writeFile(eventsFile, `${result.stdout.trim()}\n`)
  await writeFile(stderrFile, result.stderr)
  if (result.code !== 0) {
    throw new Error(result.timedOut ? "Reviewer exceeded its time limit." : `Reviewer exited with code ${result.code}.`)
  }
  const review = await readJson(outputFile)
  await validateReview(review, cleanSource)
  const score = scoreReview(review, checks)
  return {
    schemaVersion: 1,
    reviewBenchmarkId: reviewBenchmark.id,
    targetRunId: "blinded-during-review",
    reviewer: {
      model: reviewBenchmark.reviewer.model,
      effort: reviewBenchmark.reviewer.effort,
      codexVersion: codex.version,
      durationMs: Date.now() - startedAt,
      usage: parseUsage(result.stdout),
    },
    deterministicChecks: checks,
    findings: review.findings,
    ...score,
    strengths: review.strengths,
    risks: review.risks,
    recommendation: review.recommendation,
  }
}

const options = parseArgs(process.argv.slice(2))
const selectors = [options.calibration, Boolean(options.runId), Boolean(options.effort)].filter(Boolean).length
if (selectors !== 1) throw new Error("Choose exactly one of --calibration, --run-id <id>, or --effort <effort>")
if (options.publish && (options.calibration || options.checksOnly)) throw new Error("--publish is only valid for frozen run reviews")
if (options.recheckPublished && (!options.runId || options.publish || options.calibration || options.checksOnly)) {
  throw new Error("--recheck-published requires exactly one --run-id and cannot be combined with other modes")
}
if (options.publish && reviewBenchmark.status !== "frozen") throw new Error("The review benchmark must be frozen before publishing reviews")

const availableRuns = await findRuns()
const selectedRunIds = options.calibration
  ? calibration.runs
  : options.effort
    ? [...availableRuns.values()]
        .filter((candidate) => candidate.metadata.effort === options.effort)
        .map((candidate) => candidate.metadata.runId)
        .sort()
    : [options.runId]
if (!selectedRunIds.length) throw new Error(`No captured runs match effort ${options.effort}`)
for (const runId of selectedRunIds) if (!availableRuns.has(runId)) throw new Error(`Run not found: ${runId}`)
if (options.publish) {
  for (const runId of selectedRunIds) {
    const reviewFile = path.join(availableRuns.get(runId).directory, "code-review.json")
    if (await exists(reviewFile)) throw new Error(`A frozen review already exists for ${runId}; refusing to overwrite it`)
  }
}
const seed = options.seed ?? (options.calibration ? calibration.seed : options.effort ? `${reviewBenchmark.id}-${options.effort}` : `single-${options.runId}`)
const orderedRunIds = [...selectedRunIds].sort((left, right) => digest(`${seed}:${left}`).localeCompare(digest(`${seed}:${right}`)))
const sessionId = `${timestamp()}-${digest(seed).slice(0, 10)}`
const sessionDirectory = path.join(root, ".benchmark-private", options.publish ? "code-review-published" : options.recheckPublished ? "code-review-rechecks" : "code-review-calibration", sessionId)
await rm(sessionDirectory, { recursive: true, force: true })
await mkdir(sessionDirectory, { recursive: true })

const mapping = orderedRunIds.map((runId, index) => ({
  blindId: `candidate-${String(index + 1).padStart(2, "0")}-${digest(`${seed}:${runId}`).slice(0, 8)}`,
  runId,
  sourceDirectory: path.relative(root, availableRuns.get(runId).directory).split(path.sep).join("/"),
}))
await writeFile(
  path.join(sessionDirectory, "private-mapping.json"),
  `${JSON.stringify({ schemaVersion: 1, sessionId, seed, mapping }, null, 2)}\n`,
)

const codex = options.checksOnly || options.recheckPublished ? null : await findCodex()
const summary = {
  schemaVersion: 1,
  reviewBenchmarkId: reviewBenchmark.id,
  sessionId,
  seed,
  mode: options.calibration ? "calibration" : options.publish ? "frozen-publish" : options.recheckPublished ? "frozen-recheck" : "single",
  checksOnly: options.checksOnly,
  startedAt: new Date().toISOString(),
  results: [],
}

for (const item of mapping) {
  const candidate = availableRuns.get(item.runId)
  const candidateDirectory = path.join(sessionDirectory, item.blindId)
  await mkdir(candidateDirectory, { recursive: true })
  process.stdout.write(`\n${item.blindId}: deterministic checks\n`)
  try {
    const checks = await runDeterministicChecks(candidate, candidateDirectory)
    if (options.checksOnly) {
      summary.results.push({ blindId: item.blindId, status: "checks-complete", checks })
      continue
    }
    if (options.recheckPublished) {
      const publishedPath = path.join(candidate.directory, "code-review.json")
      if (!(await exists(publishedPath))) throw new Error(`No published review exists for ${item.runId}`)
      const publishedReview = await readJson(publishedPath)
      if (publishedReview.reviewStatus !== "frozen" || !Array.isArray(publishedReview.findings)) {
        throw new Error(`Published review for ${item.runId} is not a completed frozen review`)
      }
      const rawReview = {
        findings: publishedReview.findings,
        categories: publishedReview.categories.map(({ id, evidence }) => ({ id, evidence })),
      }
      const score = scoreReview(rawReview, checks)
      const publicChecks = structuredClone(checks)
      delete publicChecks.blindId
      const updatedReview = {
        ...publishedReview,
        deterministicChecks: publicChecks,
        ...score,
        deterministicChecksRecheckedAt: new Date().toISOString(),
      }
      await writeFile(publishedPath, `${JSON.stringify(updatedReview, null, 2)}\n`)
      summary.results.push({
        blindId: item.blindId,
        status: "recheck-complete",
        totalScore: updatedReview.totalScore,
        rawWeightedScore: updatedReview.rawWeightedScore,
        capsApplied: updatedReview.capsApplied,
        publishedPath: path.relative(root, publishedPath).split(path.sep).join("/"),
      })
      continue
    }
    process.stdout.write(`${item.blindId}: blinded reviewer\n`)
    const review = await runReviewer(candidateDirectory, checks, codex)
    await writeFile(path.join(candidateDirectory, "scored-review.json"), `${JSON.stringify(review, null, 2)}\n`)
    let publishedPath = null
    if (options.publish) {
      const publicChecks = structuredClone(review.deterministicChecks)
      delete publicChecks.blindId
      const publishedReview = {
        ...review,
        reviewStatus: "frozen",
        targetRunId: item.runId,
        reviewedAt: new Date().toISOString(),
        deterministicChecks: publicChecks,
      }
      publishedPath = path.join(candidate.directory, "code-review.json")
      await writeFile(publishedPath, `${JSON.stringify(publishedReview, null, 2)}\n`)
    }
    summary.results.push({
      blindId: item.blindId,
      status: "review-complete",
      totalScore: review.totalScore,
      rawWeightedScore: review.rawWeightedScore,
      findingCounts: Object.fromEntries(reviewBenchmark.severityLevels.map((severity) => [severity, review.findings.filter((finding) => finding.severity === severity).length])),
      capsApplied: review.capsApplied,
      publishedPath: publishedPath ? path.relative(root, publishedPath).split(path.sep).join("/") : null,
    })
  } catch (error) {
    const failure = { blindId: item.blindId, status: "failed", error: error.message }
    summary.results.push(failure)
    await writeFile(path.join(candidateDirectory, "failure.json"), `${JSON.stringify(failure, null, 2)}\n`)
    process.stderr.write(`${item.blindId} failed: ${error.message}\n`)
  }
}

summary.completedAt = new Date().toISOString()
await writeFile(path.join(sessionDirectory, "summary.json"), `${JSON.stringify(summary, null, 2)}\n`)
process.stdout.write(`\nPrivate review evidence: ${sessionDirectory}\n`)
process.stdout.write(`${summary.results.filter((result) => result.status !== "failed").length}/${summary.results.length} candidates completed without harness failure.\n`)
if (summary.results.some((result) => result.status === "failed")) process.exitCode = 1
