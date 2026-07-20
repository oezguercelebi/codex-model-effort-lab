import { createHash } from "node:crypto"
import { access, cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const root = path.resolve(import.meta.dirname, "..")
const siteSource = path.join(root, "site")
const runsRoot = path.join(root, "runs")
const output = path.join(root, "_site")

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

function safeSegment(value) {
  if (!/^[a-z0-9][a-z0-9._-]*$/i.test(value)) {
    throw new Error(`Unsafe run id: ${value}`)
  }
  return value
}

async function exists(file) {
  try {
    await access(file)
    return true
  } catch {
    return false
  }
}

await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
await cp(siteSource, output, { recursive: true })
await cp(path.join(root, "prompt", "weekender-v1.md"), path.join(output, "prompt.txt"))

const metadataFiles = await findMetadata(runsRoot)
const results = []

for (const metadataFile of metadataFiles) {
  const runDirectory = path.dirname(metadataFile)
  const metadata = JSON.parse(await readFile(metadataFile, "utf8"))
  const runId = safeSegment(metadata.runId)
  const previewSource = path.resolve(runDirectory, metadata.previewDirectory ?? "preview")
  const expectedRoot = `${path.resolve(runDirectory)}${path.sep}`

  if (!`${previewSource}${path.sep}`.startsWith(expectedRoot)) {
    throw new Error(`Preview escapes its run directory: ${metadataFile}`)
  }

  const previewTarget = path.join(output, "previews", runId)
  await mkdir(path.dirname(previewTarget), { recursive: true })
  await cp(previewSource, previewTarget, { recursive: true })

  const repositoryPath = path.relative(root, runDirectory).split(path.sep).join("/")
  const repositoryUrl = "https://github.com/oezguercelebi/codex-model-effort-lab"
  const reviewFile = path.join(runDirectory, "code-review.json")
  const review = (await exists(reviewFile)) ? JSON.parse(await readFile(reviewFile, "utf8")) : null
  const engineeringReview = review
    ? {
        benchmarkId: review.reviewBenchmarkId,
        status: review.reviewStatus,
        reviewedAt: review.reviewedAt,
        totalScore: review.totalScore ?? null,
        categories: review.categories ?? [],
        findings: review.findings ?? [],
        strengths: review.strengths ?? [],
        risks: review.risks ?? [],
        findingCounts: Object.fromEntries(
          ["critical", "high", "medium", "low", "note"].map((severity) => [
            severity,
            (review.findings ?? []).filter((finding) => finding.severity === severity).length,
          ]),
        ),
        recommendation: review.recommendation ?? null,
        reviewer: review.reviewer,
        failure: review.failure ?? null,
      }
    : null

  results.push({
    ...metadata,
    engineeringReview,
    previewPath: `./previews/${encodeURIComponent(runId)}/index.html`,
    sourceUrl: (await exists(path.join(runDirectory, "source")))
      ? `${repositoryUrl}/tree/main/${repositoryPath}/source`
      : null,
    finalUrl: (await exists(path.join(runDirectory, "final.md")))
      ? `${repositoryUrl}/blob/main/${repositoryPath}/final.md`
      : null,
    reviewUrl: review
      ? `${repositoryUrl}/blob/main/${repositoryPath}/code-review.json`
      : null,
  })
}

const manifest = {
  generatedAt: new Date().toISOString(),
  resultCount: results.length,
  results: results.sort((a, b) => a.runId.localeCompare(b.runId)),
}

const manifestJson = `${JSON.stringify(manifest, null, 2)}\n`
await writeFile(path.join(output, "results-manifest.json"), manifestJson)

const appSource = await readFile(path.join(output, "app.js"), "utf8")
const stylesSource = await readFile(path.join(output, "styles.css"), "utf8")
const assetVersion = createHash("sha256")
  .update(appSource)
  .update(stylesSource)
  .update(manifestJson)
  .digest("hex")
  .slice(0, 12)
const indexFile = path.join(output, "index.html")
const indexSource = await readFile(indexFile, "utf8")
await writeFile(
  indexFile,
  indexSource
    .replace('href="./styles.css"', `href="./styles.css?v=${assetVersion}"`)
    .replace('src="./app.js"', `src="./app.js?v=${assetVersion}"`),
)

process.stdout.write(`Built ${output} with ${results.length} result(s).\n`)
