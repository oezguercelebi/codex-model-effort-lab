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

  results.push({
    ...metadata,
    previewPath: `./previews/${encodeURIComponent(runId)}/index.html`,
    sourceUrl: (await exists(path.join(runDirectory, "source")))
      ? `${repositoryUrl}/tree/main/${repositoryPath}/source`
      : null,
    finalUrl: (await exists(path.join(runDirectory, "final.md")))
      ? `${repositoryUrl}/blob/main/${repositoryPath}/final.md`
      : null,
  })
}

const manifest = {
  generatedAt: new Date().toISOString(),
  resultCount: results.length,
  results: results.sort((a, b) => a.runId.localeCompare(b.runId)),
}

await writeFile(
  path.join(output, "results-manifest.json"),
  `${JSON.stringify(manifest, null, 2)}\n`,
)

process.stdout.write(`Built ${output} with ${results.length} result(s).\n`)
