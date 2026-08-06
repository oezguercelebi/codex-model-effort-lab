import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import { chromium } from "playwright-core"
import { findBinary } from "./lib/process.mjs"

/*
  Renders site/og-image.png from scripts/og-image.html.

  The previous card was a hand-made PNG with no source, so its "16 model and
  effort combinations" went stale the moment a second roll landed and nobody
  could tell where to change it. The count is now read from the benchmark
  configs, so the card cannot drift from the benchmarks it advertises.
*/

const root = path.resolve(import.meta.dirname, "..")

async function browserPath() {
  const known = [
    process.env.CHROME_BIN,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ]
  for (const candidate of known.filter(Boolean)) {
    const found = await findBinary([candidate], ["--version"])
    if (found) return found.binary
  }
  throw new Error("No Chrome or Chromium found. Set CHROME_BIN.")
}

let combinations = 0
for (const file of await readdir(path.join(root, "benchmark"))) {
  if (!file.endsWith(".json")) continue
  const config = JSON.parse(await readFile(path.join(root, "benchmark", file), "utf8"))
  if (config.id && Array.isArray(config.configurations)) combinations += config.configurations.length
}

const browser = await chromium.launch({ executablePath: await browserPath(), headless: true })
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })

await page.goto(`file://${path.join(root, "scripts", "og-image.html")}`, { waitUntil: "networkidle" })
await page.evaluate((count) => {
  document.getElementById("sub").textContent =
    `Same prompt. ${count} model and effort combinations, across Codex and Claude Code.`
}, combinations)
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(300)

const target = path.join(root, "site", "og-image.png")
await writeFile(target, await page.screenshot({ type: "png" }))
await browser.close()

process.stdout.write(`Wrote ${path.relative(root, target)} (1200x630, ${combinations} combinations)\n`)
