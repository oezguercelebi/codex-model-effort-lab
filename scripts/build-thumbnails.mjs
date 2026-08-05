import { createServer } from "node:http"
import { access, readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { setTimeout as delay } from "node:timers/promises"
import { chromium } from "playwright-core"

const root = path.resolve(import.meta.dirname, "..")
const runsRoot = path.join(root, "runs")

// A 1440x900 viewport at half scale renders the desktop layout and writes a
// 720x450 image, so no post-processing resize is needed.
const viewport = { width: 1440, height: 900 }
const deviceScaleFactor = 0.5
const quality = 82
const settleMs = 750

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
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

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

async function findBrowser() {
  const candidates = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean)

  for (const candidate of candidates) {
    if (await exists(candidate)) return candidate
  }

  throw new Error("No Chrome or Chromium executable found. Set CHROME_BIN to build thumbnails.")
}

async function findMetadata(directory) {
  const matches = []

  async function visit(current) {
    let entries = []
    try {
      entries = await readdir(current, { withFileTypes: true })
    } catch (error) {
      if (error.code === "ENOENT") return
      throw error
    }

    for (const entry of entries) {
      const absolute = path.join(current, entry.name)
      if (entry.isDirectory()) await visit(absolute)
      if (entry.isFile() && entry.name === "metadata.json") matches.push(absolute)
    }
  }

  await visit(directory)
  return matches.sort()
}

// Previews are Vite builds whose module scripts are blocked by CORS under
// file://, so they have to be served over http.
async function startStaticServer(directory) {
  const absoluteRoot = path.resolve(directory)
  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname)
      const requested = path.resolve(absoluteRoot, `.${pathname}`)

      if (requested !== absoluteRoot && !requested.startsWith(`${absoluteRoot}${path.sep}`)) {
        response.writeHead(403).end("Forbidden")
        return
      }

      let file = requested
      const fileStat = await stat(file)
      if (fileStat.isDirectory()) file = path.join(file, "index.html")
      const contents = await readFile(file)
      response.writeHead(200, {
        "content-type": mimeTypes[path.extname(file).toLowerCase()] ?? "application/octet-stream",
        "cache-control": "no-store",
      })
      response.end(contents)
    } catch {
      response.writeHead(404).end("Not found")
    }
  })

  await new Promise((resolve, reject) => {
    server.once("error", reject)
    server.listen(0, "127.0.0.1", resolve)
  })

  const address = server.address()
  return {
    server,
    url: `http://127.0.0.1:${address.port}/`,
  }
}

async function captureThumbnail(browser, url, target) {
  const page = await browser.newPage({ viewport, deviceScaleFactor })
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 })
    await page.evaluate(() => document.fonts?.ready)
    await delay(settleMs)
    await page.screenshot({ path: target, type: "jpeg", quality })
  } finally {
    await page.close()
  }
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`
}

const failures = []
const targets = []

for (const metadataFile of await findMetadata(runsRoot)) {
  const runDirectory = path.dirname(metadataFile)
  const metadata = JSON.parse(await readFile(metadataFile, "utf8"))
  const previewSource = path.resolve(runDirectory, metadata.previewDirectory ?? "preview")
  const expectedRoot = `${path.resolve(runDirectory)}${path.sep}`

  if (!`${previewSource}${path.sep}`.startsWith(expectedRoot)) {
    failures.push({ runId: metadata.runId, reason: "preview escapes its run directory" })
    continue
  }

  targets.push({
    runId: metadata.runId,
    file: path.join(runDirectory, "thumbnail.jpg"),
    previewPath: path.relative(runsRoot, previewSource).split(path.sep).map(encodeURIComponent).join("/"),
  })
}

const executablePath = await findBrowser()
const { server, url: baseUrl } = await startStaticServer(runsRoot)
const browser = await chromium.launch({ executablePath, headless: true })
const labelWidth = Math.max(0, ...targets.map((target) => target.runId.length))
const generated = []

try {
  for (const target of targets) {
    try {
      await captureThumbnail(browser, `${baseUrl}${target.previewPath}/index.html`, target.file)
      const { size } = await stat(target.file)
      generated.push(size)
      process.stdout.write(`  ${target.runId.padEnd(labelWidth)}  ${formatSize(size).padStart(9)}\n`)
    } catch (error) {
      failures.push({ runId: target.runId, reason: error.message })
      process.stdout.write(`  ${target.runId.padEnd(labelWidth)}     failed\n`)
    }
  }
} finally {
  await browser.close()
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
}

const totalBytes = generated.reduce((total, size) => total + size, 0)
const width = viewport.width * deviceScaleFactor
const height = viewport.height * deviceScaleFactor
process.stdout.write(
  `Generated ${generated.length} thumbnail(s) at ${width}x${height}, ${formatSize(totalBytes)} total.\n`,
)

for (const failure of failures) {
  process.stderr.write(`Failed ${failure.runId}: ${failure.reason}\n`)
}
if (failures.length > 0) process.exitCode = 1
