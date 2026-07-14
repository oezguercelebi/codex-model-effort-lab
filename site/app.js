const state = {
  results: [],
  result: null,
  viewport: "desktop",
  planId: "5x",
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
  matrixTooltip: document.querySelector("#matrix-tooltip"),
  summaryInsights: document.querySelector("#summary-insights"),
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
  planCycle: document.querySelector("#plan-cycle"),
  planMultiplier: document.querySelector("#plan-multiplier"),
}

const formatNumber = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
const assetVersion = new URL(import.meta.url).searchParams.get("v")
const effortOrder = ["default", "low", "medium", "high", "xhigh", "max"]
const modelOrder = ["default", "gpt-5.5", "gpt-5.6-luna", "gpt-5.6-terra", "gpt-5.6-sol"]
const creditRates = {
  "gpt-5.5": { input: 125, cachedInput: 12.5, output: 750 },
  "gpt-5.6-luna": { input: 25, cachedInput: 2.5, output: 150 },
  "gpt-5.6-terra": { input: 62.5, cachedInput: 6.25, output: 375 },
  "gpt-5.6-sol": { input: 125, cachedInput: 12.5, output: 750 },
}
const plans = [
  { id: "plus", label: "Plus", multiplier: "1×", allowance: 3000 },
  { id: "5x", label: "Pro 5x", multiplier: "5×", allowance: 15000 },
  { id: "20x", label: "Pro 20x", multiplier: "20×", allowance: 60000 },
]

function assetPath(path) {
  return assetVersion ? `${path}?v=${encodeURIComponent(assetVersion)}` : path
}

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

function estimatedCredits(result) {
  const rate = creditRates[result.model]
  if (!rate || !result.usage) return null
  const cachedInput = result.usage.cachedInputTokens ?? 0
  const uncachedInput = Math.max(0, (result.usage.inputTokens ?? 0) - cachedInput)
  const output = result.usage.outputTokens ?? 0
  return (
    uncachedInput * rate.input
    + cachedInput * rate.cachedInput
    + output * rate.output
  ) / 1_000_000
}

function planUsage(result) {
  const credits = estimatedCredits(result)
  const plan = plans.find((item) => item.id === state.planId) ?? plans[1]
  const allowance = plan.allowance
  if (credits != null && allowance) {
    const share = (credits / allowance) * 100
    return {
      allowance,
      credits,
      detail: `≈ ${credits.toFixed(1)} of ${formatNumber.format(allowance)} credits`,
      label: `Plan usage · ${plan.label}`,
      share,
      value: `${share < 0.01 ? "<0.01" : share.toFixed(2)}%`,
    }
  }
  const observed = result.subscription?.observedChangePercent
  return {
    allowance: null,
    credits,
    detail: result.status === "default" ? "Not a Codex run" : "Allowance not recorded",
    label: "Plan usage",
    share: observed,
    value: observed == null ? "—" : `${observed}%`,
  }
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

function floatingMetric(label, value, accent = false, detail = null) {
  const card = document.createElement("div")
  card.className = `floating-metric${accent ? " accent" : ""}`
  const name = document.createElement("span")
  const number = document.createElement("strong")
  name.textContent = label
  number.textContent = value
  card.append(name, number)
  if (detail) {
    const context = document.createElement("small")
    context.textContent = detail
    card.append(context)
  }
  return card
}

function summaryInsight(label, title, detail, accent = false) {
  const card = document.createElement("article")
  if (accent) card.classList.add("accent")
  const eyebrow = document.createElement("span")
  const heading = document.createElement("strong")
  const copy = document.createElement("p")
  eyebrow.textContent = label
  heading.textContent = title
  copy.textContent = detail
  card.append(eyebrow, heading, copy)
  return card
}

function statusLabel(status) {
  if (status === "default") return "Default"
  if (status === "published") return "Captured run"
  if (status === "failed") return "Failed run"
  return "Sample"
}

function hideMatrixTooltip() {
  elements.matrixTooltip.hidden = true
}

function showMatrixTooltip(button, result) {
  const heading = document.createElement("div")
  heading.className = "matrix-tooltip-heading"
  const eyebrow = document.createElement("span")
  const title = document.createElement("strong")
  eyebrow.textContent = "Token breakdown"
  title.textContent = `${result.modelLabel} · ${result.effortLabel}`
  heading.append(eyebrow, title)

  const breakdown = document.createElement("dl")
  for (const [label, value] of [
    ["Input", result.usage?.inputTokens],
    ["Cached input", result.usage?.cachedInputTokens],
    ["Output", result.usage?.outputTokens],
    ["Reasoning", result.usage?.reasoningOutputTokens],
  ]) {
    const row = document.createElement("div")
    const term = document.createElement("dt")
    const detail = document.createElement("dd")
    term.textContent = label
    detail.textContent = valueLabel(value)
    row.append(term, detail)
    breakdown.append(row)
  }

  const total = document.createElement("p")
  total.innerHTML = `<span>Shown total</span><strong>${valueLabel(totalTokens(result.usage))}</strong>`
  elements.matrixTooltip.replaceChildren(heading, breakdown, total)
  elements.matrixTooltip.hidden = false

  window.requestAnimationFrame(() => {
    if (elements.matrixTooltip.hidden) return
    const anchor = button.getBoundingClientRect()
    const tooltip = elements.matrixTooltip.getBoundingClientRect()
    const left = Math.min(
      window.innerWidth - tooltip.width - 12,
      Math.max(12, anchor.left + (anchor.width - tooltip.width) / 2),
    )
    const above = anchor.top - tooltip.height - 10
    const top = above >= 12 ? above : anchor.bottom + 10
    elements.matrixTooltip.style.left = `${left}px`
    elements.matrixTooltip.style.top = `${top}px`
  })
}

function setSlider(slider, ticks, items, currentIndex, labelKey) {
  const maximum = Math.max(0, items.length - 1)
  slider.max = maximum
  slider.value = Math.max(0, currentIndex)
  slider.disabled = items.length < 2
  slider.style.setProperty("--slider-progress", maximum ? `${(currentIndex / maximum) * 100}%` : "0%")
  ticks.replaceChildren(
    ...items.map((item, index) => {
      const tick = document.createElement("span")
      tick.textContent = item[labelKey]
      tick.style.left = maximum ? `${(index / maximum) * 100}%` : "50%"
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
  const usage = planUsage(result)

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
    floatingMetric(usage.label, usage.value, false, usage.detail),
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
    fact("Capture plan", result.subscription?.planLabel),
    fact("Selected plan", plans.find((item) => item.id === state.planId)?.label),
    fact("Estimated credits", usage.credits == null ? "—" : `≈ ${usage.credits.toFixed(2)}`),
    fact("Allowance reference", usage.allowance == null ? "—" : `${formatNumber.format(usage.allowance)} credits`),
    fact("Estimated plan share", usage.share == null ? subscriptionRange : usage.value),
    fact("Rate card checked", "Jul 14, 2026"),
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
  button.setAttribute(
    "aria-label",
    `${result.modelLabel}, ${result.effortLabel}. ${valueLabel(totalTokens(result.usage))} shown tokens. Input ${valueLabel(result.usage?.inputTokens)}, cached input ${valueLabel(result.usage?.cachedInputTokens)}, output ${valueLabel(result.usage?.outputTokens)}, reasoning ${valueLabel(result.usage?.reasoningOutputTokens)}.`,
  )
  if (result.runId === state.result.runId) button.classList.add("selected")

  const top = document.createElement("span")
  top.className = "matrix-cell-top"
  top.textContent = result.status === "failed" ? "Failed" : count > 1 ? `${count} runs` : statusLabel(result.status)
  const primary = document.createElement("strong")
  primary.textContent = totalTokens(result.usage) ? `${formatNumber.format(totalTokens(result.usage))} tokens` : `${result.codeStats?.sourceLines ?? "—"} source lines`
  const secondary = document.createElement("span")
  secondary.textContent = `${durationLabel(result.durationMs)} · ${result.codeStats?.sourceFiles ?? "—"} files`
  button.append(top, primary, secondary)
  button.addEventListener("mouseenter", () => showMatrixTooltip(button, result))
  button.addEventListener("mouseleave", hideMatrixTooltip)
  button.addEventListener("focus", () => showMatrixTooltip(button, result))
  button.addEventListener("blur", hideMatrixTooltip)
  button.addEventListener("click", () => {
    hideMatrixTooltip()
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

function renderSummary() {
  const captured = state.results.filter((result) => result.status === "published")
  if (!captured.length) {
    elements.summaryInsights.replaceChildren()
    return
  }

  const fastest = captured.reduce((best, result) => result.durationMs < best.durationMs ? result : best)
  const mostSource = captured.reduce((best, result) => (result.codeStats?.sourceLines ?? 0) > (best.codeStats?.sourceLines ?? 0) ? result : best)
  const largest = captured.reduce((best, result) => totalTokens(result.usage) > totalTokens(best.usage) ? result : best)
  const solHigh = captured.find((result) => result.model === "gpt-5.6-sol" && result.effort === "high")
  const solExtraHigh = captured.find((result) => result.model === "gpt-5.6-sol" && result.effort === "xhigh")

  const insights = [
    summaryInsight(
      "Fastest captured",
      `${fastest.modelLabel} · ${fastest.effortLabel}`,
      `${durationLabel(fastest.durationMs)} · ${valueLabel(totalTokens(fastest.usage))} shown tokens · ≈ ${estimatedCredits(fastest).toFixed(2)} credits`,
    ),
    summaryInsight(
      "Most source lines",
      `${formatNumber.format(mostSource.codeStats.sourceLines)} lines`,
      `${mostSource.modelLabel} · ${mostSource.effortLabel} · ${durationLabel(mostSource.durationMs)} · ≈ ${estimatedCredits(mostSource).toFixed(2)} credits`,
      true,
    ),
    summaryInsight(
      "Largest token result",
      `${formatNumber.format(totalTokens(largest.usage))} tokens`,
      `${largest.modelLabel} · ${largest.effortLabel} · ${durationLabel(largest.durationMs)} · ≈ ${estimatedCredits(largest).toFixed(2)} credits`,
    ),
  ]

  if (solHigh && solExtraHigh) {
    const tokenDrop = Math.round((1 - totalTokens(solExtraHigh.usage) / totalTokens(solHigh.usage)) * 100)
    const outputGain = Math.round(((solExtraHigh.usage.outputTokens / solHigh.usage.outputTokens) - 1) * 100)
    const sourceRatio = (solExtraHigh.codeStats.sourceLines / solHigh.codeStats.sourceLines).toFixed(1)
    insights.push(summaryInsight(
      "Sol High vs Extra High",
      `${tokenDrop}% fewer shown tokens`,
      `${outputGain}% more output · ${sourceRatio}× source lines · nearly identical time and credits`,
    ))
  }

  elements.summaryInsights.replaceChildren(...insights)
}

function setQuery() {
  const url = new URL(window.location.href)
  url.searchParams.set("result", state.result?.runId ?? "")
  url.searchParams.set("viewport", state.viewport)
  url.searchParams.set("plan", state.planId)
  history.replaceState(null, "", url)
}

function render() {
  syncSliders()
  renderResult()
  renderMatrix()
  renderSummary()
  document.querySelectorAll("[data-viewport]").forEach((button) => {
    button.classList.toggle("active", button.dataset.viewport === state.viewport)
  })
  const plan = plans.find((item) => item.id === state.planId) ?? plans[1]
  elements.planMultiplier.textContent = plan.multiplier
  elements.planCycle.setAttribute("aria-label", `Plan ${plan.multiplier}, ${plan.label}. Activate to select the next plan.`)
  elements.planCycle.title = `${plan.label} · ${formatNumber.format(plan.allowance)} credits. Click to change.`
  document.querySelectorAll(".allowance-guide [data-plan]").forEach((card) => {
    card.classList.toggle("current", card.dataset.plan === state.planId)
  })
  setQuery()
}

function resultById(id) {
  return state.results.find((result) => result.runId === id)
}

async function loadPrompt() {
  const response = await fetch(assetPath("./prompt.txt"))
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
  const response = await fetch(assetPath("./results-manifest.json"))
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
  state.planId = plans.some((plan) => plan.id === query.get("plan"))
    ? query.get("plan")
    : plans.find((plan) => plan.label === state.result.subscription?.planLabel)?.id ?? "5x"
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

elements.planCycle.addEventListener("click", () => {
  const currentIndex = plans.findIndex((plan) => plan.id === state.planId)
  state.planId = plans[(currentIndex + 1) % plans.length].id
  render()
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

window.addEventListener("scroll", hideMatrixTooltip, true)
window.addEventListener("resize", hideMatrixTooltip)

await Promise.all([initialize(), loadPrompt()])
