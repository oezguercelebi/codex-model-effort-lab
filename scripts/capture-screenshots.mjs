import { createServer } from "node:http"
import { access, mkdir, readFile, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { pathToFileURL } from "node:url"
import { chromium } from "playwright-core"

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

  throw new Error("No Chrome or Chromium executable found. Set CHROME_BIN to capture screenshots.")
}

async function startStaticServer(root) {
  const absoluteRoot = path.resolve(root)
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

export async function captureScreenshots(previewDirectory, outputDirectory) {
  await mkdir(outputDirectory, { recursive: true })
  const executablePath = await findBrowser()
  const { server, url } = await startStaticServer(previewDirectory)
  const browser = await chromium.launch({ executablePath, headless: true })

  try {
    const targets = [
      { name: "desktop", width: 1440, height: 1000 },
      { name: "mobile", width: 390, height: 844 },
    ]

    for (const target of targets) {
      const page = await browser.newPage({
        viewport: { width: target.width, height: target.height },
        deviceScaleFactor: 1,
      })
      await page.goto(url, { waitUntil: "networkidle", timeout: 30_000 })
      await page.evaluate(() => document.fonts?.ready)
      await page.screenshot({
        path: path.join(outputDirectory, `screenshot-${target.name}.png`),
        fullPage: true,
      })
      await page.close()
    }
  } finally {
    await browser.close()
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
}

function parseArgs(argv) {
  const options = {}
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index]
    const value = argv[index + 1]
    if (!key?.startsWith("--") || value == null) throw new Error("Use --preview <dir> --output <dir>")
    options[key.slice(2)] = value
  }
  return options
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const options = parseArgs(process.argv.slice(2))
  if (!options.preview || !options.output) throw new Error("Use --preview <dir> --output <dir>")
  await captureScreenshots(path.resolve(options.preview), path.resolve(options.output))
}
