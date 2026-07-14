const state = {
  results: [],
  result: null,
  viewport: "desktop",
  models: [],
}

const elements = {
  viewer: document.querySelector("#result-viewer"),
  frame: document.querySelector("#result-frame"),
  kicker: document.querySelector("#result-kicker"),
  title: document.querySelector("#result-title"),
  status: document.querySelector("#result-status"),
  metrics: document.querySelector("#floating-metrics"),
  notes: document.querySelector("#run-notes"),
  facts: document.querySelector("#run-facts"),
  links: document.querySelector("#run-links"),
  matrix: document.querySelector("#result-matrix"),
  modelSlider: document.querySelector("#model-slider"),
  modelValue: document.querySelector("#model-value"),
  modelTicks: document.querySelector("#model-ticks"),
  effortSlider: document.querySelector("#effort-slider"),
  effortValue: document.querySelector("#effort-value"),
  effortTicks: document.querySelector("#effort-ticks"),
  notice: document.querySelector("#demo-notice"),
  noticeTitle: document.querySelector("#notice-title"),
  noticeCopy: document.querySelector("#notice-copy"),
  promptDialog: document.querySelector("#prompt-dialog"),
  promptContent: document.querySelector("#prompt-content"),
}

const formatNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
const effortOrder = ["default", "low", "medium", "high", "xhigh", "max"]
const modelOrder = ["default", "gpt-5.5", "gpt-5.6-luna", "gpt-5.6-terra", "gpt-5.6-sol"]

function uniqueBy(items, key) {
  return [...new Map(items.map((item) => [key(item), item])).values()]
}

function orderedModels(results) {
  return uniqueBy(results.map(({ model, modelLabel }) => ({ model, modelLabel })), (item) => item.model)
    .sort((a, b) => {
      const aIndex = modelOrder.indexOf(a.model)
      const bIndex = modelOrder.indexOf(b.model)
      if (aIndex === -1 && bIndex === -1) return a.modelLabel.localeCompare(b.modelLabel)
      if (aIndex === -1) return 1
      if (bIndex === -1) return -1
      return aIndex - bIndex
    })
}

function effortsFor(model) {
  return uniqueBy(
    state.results
      .filter((result) => result.model === model)
      .map(({ effort, effortLabel }) => ({ effort, effortLabel })),
    (item) => item.effort,
  ).sort((a, b) => effortOrder.indexOf(a.effort) - effortOrder.indexOf(b.effort))
}

function runsFor(model, effort) {
  return state.results
    .filter((result) => result.model === model && result.effort === effort)
    .sort((a, b) => (b.recordedAt ?? "").localeCompare(a.recordedAt ?? ""))
}

function totalTokens(usage = {}) {
  return (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0) + (usage.reasoningOutputTokens ?? 0)
}

function durationLabel(milliseconds) {
  if (!milliseconds) return "—"
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.round((milliseconds % 60000) / 1000)
  return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`
}

function dateLabel(value) {
  if (!value) return "—"
  return `${new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(value))} UTC`
}

function valueLabel(value, suffix = "") {
  return value ? `${formatNumber.format(value)}${suffix}` : "—"
}

function fact(label, value) {
  const row = document.createElement("div")
  const term = document.createElement("dt")
  const detail = document.createElement("dd")
  term.textContent = label
  detail.textContent = value ?? "—"
  row.append(term, detail)
  return row
}

function floatingMetric(label, value, accent = false) {
  const card = document.createElement("div")
  card.className = `floating-metric${accent ? " accent" : ""}`
  const name = document.createElement("span")
  const number = document.createElement("strong")
  name.textContent = label
  number.textContent = value
  card.append(name, number)
  return card
}

function statusLabel(status) {
  if (status === "default") return "Default"
  if (status === "published") return "Captured run"
  if (status === "failed") return "Failed run"
  return "Sample"
}

function setSlider(slider, ticks, items, currentIndex, labelKey) {
  const maximum = Math.max(0, items.length - 1)
  slider.max = maximum
  slider.value = Math.max(0, currentIndex)
  slider.disabled = items.length < 2
  slider.style.setProperty("--slider-progress", maximum ? `${(currentIndex / maximum) * 100}%` : "0%")
  ticks.replaceChildren(
    ...items.map((item) => {
      const tick = document.createElement("span")
      tick.textContent = item[labelKey]
      return tick
    }),
  )
}

function syncSliders() {
  const modelIndex = Math.max(0, state.models.findIndex((item) => item.model === state.result.model))
  setSlider(elements.modelSlider, elements.modelTicks, state.models, modelIndex, "modelLabel")
  elements.modelValue.textContent = state.result.modelLabel

  const efforts = effortsFor(state.result.model)
  const effortIndex = Math.max(0, efforts.findIndex((item) => item.effort === state.result.effort))
  setSlider(elements.effortSlider, elements.effortTicks, efforts, effortIndex, "effortLabel")
  elements.effortValue.textContent = state.result.effortLabel
}

function renderResult() {
  const result = state.result
  if (!result) return

  elements.viewer.dataset.viewport = state.viewport
  elements.kicker.textContent = `${result.modelLabel} · ${result.effortLabel} effort`
  elements.title.textContent = result.title ?? "Weekender"
  elements.status.className = "status-pill"
  elements.status.textContent = statusLabel(result.status)
  if (result.status === "published") elements.status.classList.add("real")
  if (result.status === "failed") elements.status.classList.add("failed")
  if (result.status === "default") elements.status.classList.add("reference")

  if (elements.frame.getAttribute("src") !== result.previewPath) {
    elements.frame.src = result.previewPath
  }
  elements.frame.title = `${result.modelLabel} with ${result.effortLabel} effort generated app preview`

  elements.metrics.replaceChildren(
    floatingMetric("Total tokens", valueLabel(totalTokens(result.usage)), true),
    floatingMetric("Duration", durationLabel(result.durationMs)),
    floatingMetric("Plan usage", result.subscription?.observedChangePercent == null ? "—" : `${result.subscription.observedChangePercent}%`),
    floatingMetric("Source lines", valueLabel(result.codeStats?.sourceLines)),
  )

  elements.notes.textContent = result.notes ?? "No notes were recorded for this run."
  const subscriptionRange = result.subscription?.remainingBeforePercent == null
    ? "—"
    : `${result.subscription.remainingBeforePercent}% → ${result.subscription.remainingAfterPercent ?? "?"}%`
  elements.facts.replaceChildren(
    fact("Exact model", result.model),
    fact("Effort", result.effort),
    fact("Input tokens", valueLabel(result.usage?.inputTokens)),
    fact("Cached input", valueLabel(result.usage?.cachedInputTokens)),
    fact("Output tokens", valueLabel(result.usage?.outputTokens)),
    fact("Reasoning tokens", valueLabel(result.usage?.reasoningOutputTokens)),
    fact("Source files", valueLabel(result.codeStats?.sourceFiles)),
    fact("Source lines", valueLabel(result.codeStats?.sourceLines)),
    fact("Codex", result.codexVersion),
    fact("Captured", dateLabel(result.recordedAt)),
    fact("Plan", result.subscription?.planLabel),
    fact("Plan remaining", subscriptionRange),
  )

  elements.links.replaceChildren()
  for (const [label, url] of [["Generated source ↗", result.sourceUrl], ["Final response ↗", result.finalUrl]]) {
    if (!url) continue
    const link = document.createElement("a")
    link.href = url
    link.textContent = label
    elements.links.append(link)
  }

  elements.notice.hidden = result.status !== "sample"
  if (result.status === "sample") {
    elements.noticeTitle.textContent = "Interface preview"
    elements.noticeCopy.textContent = "This hand-built sample is not a Codex benchmark result."
  }
}

function matrixCell(result, count) {
  if (!result) {
    const empty = document.createElement("span")
    empty.className = "matrix-empty"
    empty.textContent = "Not captured"
    return empty
  }

  const button = document.createElement("button")
  button.type = "button"
  button.className = "matrix-cell"
  button.dataset.runId = result.runId
  button.setAttribute("aria-pressed", String(result.runId === state.result.runId))
  if (result.runId === state.result.runId) button.classList.add("selected")

  const top = document.createElement("span")
  top.className = "matrix-cell-top"
  top.textContent = result.status === "failed" ? "Failed" : count > 1 ? `${count} runs` : statusLabel(result.status)
  const primary = document.createElement("strong")
  primary.textContent = totalTokens(result.usage) ? `${formatNumber.format(totalTokens(result.usage))} tokens` : `${result.codeStats?.sourceLines ?? "—"} source lines`
  const secondary = document.createElement("span")
  secondary.textContent = `${durationLabel(result.durationMs)} · ${result.codeStats?.sourceFiles ?? "—"} files`
  button.append(top, primary, secondary)
  button.addEventListener("click", () => {
    state.result = result
    render()
  })
  return button
}

function renderMatrix() {
  const allEfforts = uniqueBy(
    state.results.map(({ effort, effortLabel }) => ({ effort, effortLabel })),
    (item) => item.effort,
  ).sort((a, b) => effortOrder.indexOf(a.effort) - effortOrder.indexOf(b.effort))

  const head = document.createElement("thead")
  const headRow = document.createElement("tr")
  const corner = document.createElement("th")
  corner.scope = "col"
  corner.textContent = "Model"
  headRow.append(corner)
  for (const effort of allEfforts) {
    const heading = document.createElement("th")
    heading.scope = "col"
    heading.textContent = effort.effortLabel
    headRow.append(heading)
  }
  head.append(headRow)

  const body = document.createElement("tbody")
  for (const model of state.models) {
    const row = document.createElement("tr")
    const heading = document.createElement("th")
    heading.scope = "row"
    const modelName = document.createElement("strong")
    const modelId = document.createElement("span")
    modelName.textContent = model.modelLabel
    modelId.textContent = model.model
    heading.append(modelName, modelId)
    row.append(heading)

    for (const effort of allEfforts) {
      const cell = document.createElement("td")
      const runs = runsFor(model.model, effort.effort)
      cell.append(matrixCell(runs[0], runs.length))
      row.append(cell)
    }
    body.append(row)
  }

  elements.matrix.replaceChildren(head, body)
}

function setQuery() {
  const url = new URL(window.location.href)
  url.searchParams.set("result", state.result?.runId ?? "")
  url.searchParams.set("viewport", state.viewport)
  history.replaceState(null, "", url)
}

function render() {
  syncSliders()
  renderResult()
  renderMatrix()
  document.querySelectorAll("[data-viewport]").forEach((button) => {
    button.classList.toggle("active", button.dataset.viewport === state.viewport)
  })
  setQuery()
}

function resultById(id) {
  return state.results.find((result) => result.runId === id)
}

async function loadPrompt() {
  const response = await fetch("./prompt.txt")
  const prompt = await response.text()
  elements.promptContent.replaceChildren(
    ...prompt
      .split(/\n\s*\n/)
      .map((paragraph) => paragraph.replace(/^#\s+.*\n?/, "").replaceAll("**", "").replaceAll("`", "").trim())
      .filter(Boolean)
      .map((paragraph) => {
        const node = document.createElement("p")
        node.textContent = paragraph
        return node
      }),
  )
}

async function initialize() {
  const response = await fetch("./results-manifest.json")
  if (!response.ok) throw new Error(`Could not load results (${response.status})`)
  const manifest = await response.json()
  state.results = manifest.results
  state.models = orderedModels(state.results)

  if (state.results.length === 0) {
    elements.viewer.innerHTML = '<p class="empty-state">No captured runs have been published yet.</p>'
    return
  }

  const query = new URLSearchParams(window.location.search)
  state.result = resultById(query.get("result")) ?? state.results.find((result) => result.isDefault) ?? state.results[0]
  state.viewport = ["desktop", "tablet", "mobile"].includes(query.get("viewport"))
    ? query.get("viewport")
    : "desktop"
  render()
}

elements.modelSlider.addEventListener("input", () => {
  const model = state.models[Number(elements.modelSlider.value)]
  const efforts = effortsFor(model.model)
  const matchingEffort = efforts.find((item) => item.effort === state.result.effort) ?? efforts[0]
  state.result = runsFor(model.model, matchingEffort.effort)[0]
  render()
})

elements.effortSlider.addEventListener("input", () => {
  const efforts = effortsFor(state.result.model)
  const effort = efforts[Number(elements.effortSlider.value)]
  state.result = runsFor(state.result.model, effort.effort)[0]
  render()
})

document.querySelectorAll("[data-viewport]").forEach((button) => {
  button.addEventListener("click", () => {
    state.viewport = button.dataset.viewport
    render()
  })
})

document.querySelector("#copy-link").addEventListener("click", async (event) => {
  await navigator.clipboard.writeText(window.location.href)
  const button = event.currentTarget
  const original = button.textContent
  button.textContent = "Selection copied"
  window.setTimeout(() => { button.textContent = original }, 1600)
})

document.querySelector("#prompt-open").addEventListener("click", () => elements.promptDialog.showModal())
document.querySelector("#prompt-close").addEventListener("click", () => elements.promptDialog.close())
elements.promptDialog.addEventListener("click", (event) => {
  if (event.target === elements.promptDialog) elements.promptDialog.close()
})

await Promise.all([initialize(), loadPrompt()])
