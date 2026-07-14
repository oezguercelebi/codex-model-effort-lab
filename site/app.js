const state = {
  results: [],
  left: null,
  right: null,
  viewport: "desktop",
}

const elements = {
  grid: document.querySelector("#comparison-grid"),
  leftPanel: document.querySelector('[data-side="left"]'),
  rightPanel: document.querySelector('[data-side="right"]'),
  leftSelect: document.querySelector("#left-select"),
  rightSelect: document.querySelector("#right-select"),
  template: document.querySelector("#result-template"),
  notice: document.querySelector("#demo-notice"),
  promptDialog: document.querySelector("#prompt-dialog"),
  promptContent: document.querySelector("#prompt-content"),
}

const formatNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })

function optionLabel(result) {
  return `${result.modelLabel} · ${result.effortLabel}`
}

function metric(label, value) {
  const node = document.createElement("div")
  node.className = "metric"
  const name = document.createElement("span")
  const number = document.createElement("strong")
  name.textContent = label
  number.textContent = value
  node.append(name, number)
  return node
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
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" }).format(new Date(value)) + " UTC"
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

function renderPanel(panel, result) {
  panel.replaceChildren()
  if (!result) return

  const fragment = elements.template.content.cloneNode(true)
  fragment.querySelector(".result-kicker").textContent = `${result.modelLabel} · ${result.effortLabel} effort`
  fragment.querySelector("h3").textContent = result.title ?? "Weekender"

  const status = fragment.querySelector(".status-pill")
  if (result.status === "published") {
    status.textContent = "Captured run"
    status.classList.add("real")
  } else if (result.status === "failed") {
    status.textContent = "Failed run"
    status.classList.add("failed")
  } else status.textContent = "Sample"

  const frame = fragment.querySelector("iframe")
  frame.src = result.previewPath
  frame.title = `${optionLabel(result)} generated app preview`

  const metrics = fragment.querySelector(".metrics")
  metrics.append(
    metric("Total tokens", totalTokens(result.usage) ? formatNumber.format(totalTokens(result.usage)) : "—"),
    metric("Reasoning", result.usage?.reasoningOutputTokens ? formatNumber.format(result.usage.reasoningOutputTokens) : "—"),
    metric("Duration", durationLabel(result.durationMs)),
    metric("Plan usage", result.subscription?.observedChangePercent == null ? "—" : `${result.subscription.observedChangePercent}%`),
  )

  fragment.querySelector(".run-notes").textContent = result.notes ?? "No notes were recorded for this run."
  const facts = fragment.querySelector(".run-facts")
  const subscriptionRange = result.subscription?.remainingBeforePercent == null
    ? "—"
    : `${result.subscription.remainingBeforePercent}% → ${result.subscription.remainingAfterPercent ?? "?"}%`
  facts.append(
    fact("Exact model", result.model),
    fact("Effort", result.effort),
    fact("Input tokens", result.usage?.inputTokens ? formatNumber.format(result.usage.inputTokens) : "—"),
    fact("Cached input", result.usage?.cachedInputTokens ? formatNumber.format(result.usage.cachedInputTokens) : "—"),
    fact("Output tokens", result.usage?.outputTokens ? formatNumber.format(result.usage.outputTokens) : "—"),
    fact("Codex", result.codexVersion),
    fact("Captured", dateLabel(result.recordedAt)),
    fact("Plan remaining", subscriptionRange),
  )
  const links = fragment.querySelector(".run-links")
  for (const [label, url] of [["Generated source ↗", result.sourceUrl], ["Final response ↗", result.finalUrl]]) {
    if (!url) continue
    const link = document.createElement("a")
    link.href = url
    link.textContent = label
    links.append(link)
  }
  panel.append(fragment)
}

function setQuery() {
  const url = new URL(window.location.href)
  url.searchParams.set("left", state.left?.runId ?? "")
  url.searchParams.set("right", state.right?.runId ?? "")
  url.searchParams.set("viewport", state.viewport)
  history.replaceState(null, "", url)
}

function render() {
  elements.leftSelect.value = state.left?.runId ?? ""
  elements.rightSelect.value = state.right?.runId ?? ""
  elements.grid.dataset.viewport = state.viewport
  document.querySelectorAll("[data-viewport]").forEach((button) => {
    button.classList.toggle("active", button.dataset.viewport === state.viewport)
  })
  renderPanel(elements.leftPanel, state.left)
  renderPanel(elements.rightPanel, state.right)
  elements.notice.hidden = ![state.left, state.right].some((result) => result?.status === "sample")
  setQuery()
}

function populateSelect(select) {
  select.replaceChildren(
    ...state.results.map((result) => {
      const option = document.createElement("option")
      option.value = result.runId
      option.textContent = optionLabel(result)
      return option
    }),
  )
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

  if (state.results.length === 0) {
    elements.grid.innerHTML = '<p class="empty-state">No captured runs have been published yet.</p>'
    return
  }

  populateSelect(elements.leftSelect)
  populateSelect(elements.rightSelect)

  const query = new URLSearchParams(window.location.search)
  state.left = resultById(query.get("left")) ?? state.results[0]
  state.right = resultById(query.get("right")) ?? state.results[1] ?? state.results[0]
  state.viewport = ["desktop", "tablet", "mobile"].includes(query.get("viewport"))
    ? query.get("viewport")
    : "desktop"
  render()
}

elements.leftSelect.addEventListener("change", () => { state.left = resultById(elements.leftSelect.value); render() })
elements.rightSelect.addEventListener("change", () => { state.right = resultById(elements.rightSelect.value); render() })
document.querySelector("#swap-builds").addEventListener("click", () => {
  ;[state.left, state.right] = [state.right, state.left]
  render()
})
document.querySelectorAll("[data-viewport]").forEach((button) => {
  button.addEventListener("click", () => { state.viewport = button.dataset.viewport; render() })
})
document.querySelector("#copy-link").addEventListener("click", async (event) => {
  await navigator.clipboard.writeText(window.location.href)
  const button = event.currentTarget
  const original = button.textContent
  button.textContent = "Link copied"
  window.setTimeout(() => { button.textContent = original }, 1600)
})
document.querySelector("#prompt-open").addEventListener("click", () => elements.promptDialog.showModal())
document.querySelector("#prompt-close").addEventListener("click", () => elements.promptDialog.close())
elements.promptDialog.addEventListener("click", (event) => {
  if (event.target === elements.promptDialog) elements.promptDialog.close()
})

await Promise.all([initialize(), loadPrompt()])
