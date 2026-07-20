const state = {
  results: [],
  result: null,
  viewport: "desktop",
  planId: "5x",
  models: [],
  compareOpen: false,
  compareAId: null,
  compareBId: null,
  compareSide: "a",
  valueMetric: "credits",
  valueRunId: null,
}

const elements = {
  viewer: document.querySelector("#result-viewer"),
  frame: document.querySelector("#result-frame"),
  kicker: document.querySelector("#result-kicker"),
  title: document.querySelector("#result-title"),
  status: document.querySelector("#result-status"),
  currentBuildBar: document.querySelector("#current-build-bar"),
  currentBuildName: document.querySelector("#current-build-name"),
  currentBuildContext: document.querySelector("#current-build-context"),
  currentBuildMetrics: document.querySelector("#current-build-metrics"),
  currentBuildToggle: document.querySelector("#current-build-toggle"),
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
  compareOpen: document.querySelector("#compare-open"),
  compareDialog: document.querySelector("#compare-dialog"),
  compareClose: document.querySelector("#compare-close"),
  compareCopy: document.querySelector("#compare-copy"),
  compareSwap: document.querySelector("#compare-swap"),
  compareASelect: document.querySelector("#compare-a-select"),
  compareBSelect: document.querySelector("#compare-b-select"),
  compareStage: document.querySelector("#compare-stage"),
  compareDelta: document.querySelector("#compare-delta"),
  compareATitle: document.querySelector("#compare-a-title"),
  compareBTitle: document.querySelector("#compare-b-title"),
  compareAMetrics: document.querySelector("#compare-a-metrics"),
  compareBMetrics: document.querySelector("#compare-b-metrics"),
  compareAFrame: document.querySelector("#compare-a-frame"),
  compareBFrame: document.querySelector("#compare-b-frame"),
  compareAEvidence: document.querySelector("#compare-a-evidence"),
  compareBEvidence: document.querySelector("#compare-b-evidence"),
  evidenceOpen: document.querySelector("#evidence-open"),
  evidenceDialog: document.querySelector("#evidence-dialog"),
  evidenceClose: document.querySelector("#evidence-close"),
  evidenceTitle: document.querySelector("#evidence-title"),
  evidenceBody: document.querySelector("#evidence-body"),
  valueChart: document.querySelector("#value-chart"),
  valueDetail: document.querySelector("#value-detail"),
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
const reviewCategoryLabels = {
  correctness: "Correctness",
  reliability: "Reliability",
  accessibility: "Accessibility",
  maintainability: "Maintainability",
  security: "Security",
  performance: "Performance",
  verification: "Verification",
}

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

function scoreLabel(value) {
  if (!Number.isFinite(value)) return "N/A"
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")
}

function findingSummary(review) {
  if (!review) return ""
  return ["critical", "high", "medium", "low"]
    .filter((severity) => review.findingCounts?.[severity])
    .map((severity) => `${review.findingCounts[severity]} ${severity}`)
    .join(" · ") || "No actionable findings"
}

function engineeringScore(result) {
  const score = result?.engineeringReview?.totalScore
  return result?.engineeringReview?.status === "frozen" && Number.isFinite(score) ? score : null
}

function reviewedResults() {
  return state.results.filter((result) => engineeringScore(result) != null)
}

function createNode(tag, className = "", text = null) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text != null) element.textContent = text
  return element
}

function signedNumber(value, digits = 2) {
  if (!Number.isFinite(value)) return "N/A"
  const formatted = Math.abs(value).toFixed(digits).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1")
  if (value === 0) return "No change"
  return `${value > 0 ? "+" : "−"}${formatted}`
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

function currentBuildMetric(label, value, detail = null) {
  const item = document.createElement("div")
  const name = document.createElement("dt")
  const number = document.createElement("dd")
  name.textContent = label
  number.textContent = value
  item.append(name, number)
  if (detail) {
    const context = document.createElement("small")
    context.textContent = detail
    item.append(context)
  }
  return item
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

function evidenceSectionHeading(label, title) {
  const heading = createNode("div", "evidence-section-heading")
  heading.append(createNode("span", "", label), createNode("h3", "", title))
  return heading
}

function renderEvidence(result) {
  const review = result?.engineeringReview
  if (!review) return
  elements.evidenceTitle.textContent = `${result.modelLabel} · ${result.effortLabel}`

  const summary = createNode("section", "evidence-summary")
  const summaryCopy = createNode("div")
  summaryCopy.append(
    createNode("span", "evidence-eyebrow", "Engineering review"),
    createNode("h3", "", `${result.modelLabel} · ${result.effortLabel}`),
    createNode("p", "", review.status === "failed"
      ? "The frozen one-attempt review did not produce a score."
      : review.recommendation ?? "No recommendation was recorded."),
  )
  const score = createNode("div", `evidence-score${review.status === "failed" ? " unavailable" : ""}`)
  score.append(
    createNode("strong", "", review.status === "failed" ? "N/A" : scoreLabel(review.totalScore)),
    createNode("span", "", review.status === "failed" ? "Unavailable" : "out of 100"),
  )
  summary.append(summaryCopy, score)

  const meta = createNode("dl", "evidence-meta")
  meta.append(
    fact("Reviewer", `${review.reviewer?.model ?? "Unknown"} · ${review.reviewer?.effort ?? "Unknown"}`),
    fact("Reviewed", dateLabel(review.reviewedAt)),
    fact("Findings", review.status === "failed" ? "Not completed" : findingSummary(review)),
    fact("Instrument", review.benchmarkId ?? "Unknown"),
  )

  if (review.status === "failed") {
    const failure = createNode("section", "evidence-failure")
    failure.append(
      evidenceSectionHeading("Review status", "Why this score is unavailable"),
      createNode("p", "", review.failure?.message ?? "The frozen review attempt did not complete."),
    )
    elements.evidenceBody.replaceChildren(summary, meta, failure)
    return
  }

  const categorySection = createNode("section", "evidence-section")
  categorySection.append(evidenceSectionHeading("Score anatomy", "Seven engineering categories"))
  const categories = createNode("div", "evidence-categories")
  for (const category of review.categories ?? []) {
    const item = createNode("article", "evidence-category")
    const heading = createNode("div")
    heading.append(
      createNode("strong", "", reviewCategoryLabels[category.id] ?? category.label ?? category.id),
      createNode("span", "", `${category.score}/4 · ${category.weight}%`),
    )
    const track = createNode("span", "evidence-category-track")
    const fill = createNode("i")
    fill.style.width = `${Math.max(0, Math.min(100, category.score * 25))}%`
    track.append(fill)
    const list = createNode("ul")
    for (const itemEvidence of (category.evidence ?? []).slice(0, 3)) {
      list.append(createNode("li", "", itemEvidence))
    }
    item.append(heading, track)
    if (list.childElementCount) item.append(list)
    categories.append(item)
  }
  categorySection.append(categories)

  const findingsSection = createNode("section", "evidence-section")
  findingsSection.append(evidenceSectionHeading("Actionable review", `${review.findings?.length ?? 0} evidenced findings`))
  const findings = createNode("div", "evidence-findings")
  for (const finding of review.findings ?? []) {
    const item = createNode("article", "evidence-finding")
    const heading = createNode("div")
    const severity = createNode("span", `evidence-severity ${finding.severity}`, finding.severity)
    heading.append(createNode("strong", "", finding.title), severity)
    const location = createNode("code", "", `${finding.file}:${finding.lineStart}${finding.lineEnd !== finding.lineStart ? `–${finding.lineEnd}` : ""}`)
    item.append(
      heading,
      location,
      createNode("p", "", finding.evidence),
      createNode("p", "evidence-impact", `Impact: ${finding.impact}`),
      createNode("p", "evidence-remediation", `Fix: ${finding.remediation}`),
    )
    findings.append(item)
  }
  if (!findings.childElementCount) findings.append(createNode("p", "evidence-empty", "No actionable findings were recorded."))
  findingsSection.append(findings)

  const perspective = createNode("section", "evidence-section")
  perspective.append(evidenceSectionHeading("Reviewer perspective", "Strengths and remaining risks"))
  const perspectiveGrid = createNode("div", "evidence-perspective")
  for (const [label, items] of [["Strengths", review.strengths], ["Risks", review.risks]]) {
    const column = createNode("div")
    column.append(createNode("strong", "", label))
    const list = createNode("ul")
    for (const item of items ?? []) list.append(createNode("li", "", item))
    column.append(list)
    perspectiveGrid.append(column)
  }
  perspective.append(perspectiveGrid)

  elements.evidenceBody.replaceChildren(summary, meta, categorySection, findingsSection, perspective)
}

function openEvidence(result) {
  if (!result?.engineeringReview) return
  renderEvidence(result)
  if (!elements.evidenceDialog.open) elements.evidenceDialog.showModal()
}

function hideMatrixTooltip() {
  elements.matrixTooltip.hidden = true
}

function showMatrixTooltip(button, result) {
  const heading = document.createElement("div")
  heading.className = "matrix-tooltip-heading"
  const eyebrow = document.createElement("span")
  const title = document.createElement("strong")
  eyebrow.textContent = result.engineeringReview ? "Tokens + engineering" : "Token breakdown"
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
  total.className = "matrix-tooltip-total"
  total.innerHTML = `<span>Shown total</span><strong>${valueLabel(totalTokens(result.usage))}</strong>`
  const contents = [heading, breakdown, total]
  if (result.engineeringReview) {
    const review = document.createElement("section")
    review.className = "matrix-tooltip-review"
    const reviewHeading = document.createElement("div")
    const reviewLabel = document.createElement("span")
    const reviewScore = document.createElement("strong")
    reviewLabel.textContent = "Engineering review"
    reviewScore.textContent = result.engineeringReview.status === "failed"
      ? "Unavailable"
      : `${scoreLabel(result.engineeringReview.totalScore)} / 100`
    reviewHeading.append(reviewLabel, reviewScore)
    const categories = document.createElement("dl")
    categories.className = "matrix-tooltip-categories"
    for (const category of result.engineeringReview.categories) {
      const row = document.createElement("div")
      const term = document.createElement("dt")
      const detail = document.createElement("dd")
      term.textContent = reviewCategoryLabels[category.id] ?? category.id
      detail.textContent = `${category.score}/4`
      row.append(term, detail)
      categories.append(row)
    }
    const findings = document.createElement("p")
    findings.textContent = result.engineeringReview.status === "failed"
      ? result.engineeringReview.failure?.message ?? "The frozen review attempt did not complete."
      : findingSummary(result.engineeringReview)
    review.append(reviewHeading)
    if (result.engineeringReview.categories.length) review.append(categories)
    review.append(findings)
    contents.push(review)
  }
  elements.matrixTooltip.replaceChildren(...contents)
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
  const plan = plans.find((item) => item.id === state.planId) ?? plans[1]

  elements.viewer.dataset.viewport = state.viewport
  elements.kicker.textContent = `${result.modelLabel} · ${result.effortLabel} effort`
  elements.title.textContent = result.title ?? "Weekender"
  elements.status.className = "status-pill"
  elements.status.textContent = statusLabel(result.status)
  if (result.status === "published") elements.status.classList.add("real")
  if (result.status === "failed") elements.status.classList.add("failed")
  if (result.status === "default") elements.status.classList.add("reference")
  elements.evidenceOpen.hidden = !result.engineeringReview

  if (elements.frame.getAttribute("src") !== result.previewPath) {
    elements.frame.src = result.previewPath
  }
  elements.frame.title = `${result.modelLabel} with ${result.effortLabel} effort generated app preview`

  const reviewScore = result.engineeringReview
    ? result.engineeringReview.status === "failed"
      ? "Unavailable"
      : `${scoreLabel(result.engineeringReview.totalScore)}/100`
    : "Not reviewed"
  const viewportLabel = state.viewport.charAt(0).toUpperCase() + state.viewport.slice(1)
  elements.currentBuildName.textContent = `${result.modelLabel} · ${result.effortLabel}`
  elements.currentBuildContext.textContent = `${viewportLabel} · ${plan.label}`
  elements.currentBuildMetrics.replaceChildren(
    currentBuildMetric("Engineering", reviewScore),
    currentBuildMetric("Tokens", valueLabel(totalTokens(result.usage))),
    currentBuildMetric("Duration", durationLabel(result.durationMs)),
    currentBuildMetric(
      "Credits",
      usage.credits == null ? "N/A" : `≈ ${usage.credits.toFixed(2)}`,
      usage.share == null ? null : `${usage.value} of ${formatNumber.format(usage.allowance)}`,
    ),
    currentBuildMetric("Source", result.codeStats?.sourceLines == null ? "N/A" : `${valueLabel(result.codeStats.sourceLines)} lines`),
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
    fact("Engineering review", result.engineeringReview ? result.engineeringReview.status === "failed" ? "Unavailable" : `${scoreLabel(result.engineeringReview.totalScore)} / 100` : "Not reviewed"),
    fact("Review instrument", result.engineeringReview ? `${result.engineeringReview.reviewer.model} · ${result.engineeringReview.reviewer.effort}` : "Not reviewed"),
  )

  elements.links.replaceChildren()
  for (const [label, url] of [["Generated source ↗", result.sourceUrl], ["Final response ↗", result.finalUrl], ["Engineering review ↗", result.reviewUrl]]) {
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
  const reviewAria = result.engineeringReview
    ? result.engineeringReview.status === "failed"
      ? " Engineering review unavailable."
      : ` Engineering review ${scoreLabel(result.engineeringReview.totalScore)} out of 100.`
    : ""
  button.setAttribute(
    "aria-label",
    `${result.modelLabel}, ${result.effortLabel}. ${valueLabel(totalTokens(result.usage))} shown tokens. Input ${valueLabel(result.usage?.inputTokens)}, cached input ${valueLabel(result.usage?.cachedInputTokens)}, output ${valueLabel(result.usage?.outputTokens)}, reasoning ${valueLabel(result.usage?.reasoningOutputTokens)}.${reviewAria}`,
  )
  if (result.runId === state.result.runId) button.classList.add("selected")

  const header = document.createElement("span")
  header.className = "matrix-cell-header"
  const top = document.createElement("span")
  top.className = "matrix-cell-top"
  top.textContent = result.status === "failed" ? "Failed" : count > 1 ? `${count} runs` : statusLabel(result.status)
  header.append(top)
  if (result.engineeringReview) {
    const score = document.createElement("span")
    score.className = "matrix-score"
    score.textContent = result.engineeringReview.status === "failed" ? "N/A" : scoreLabel(result.engineeringReview.totalScore)
    if (result.engineeringReview.status === "failed") score.classList.add("unavailable")
    score.setAttribute("aria-hidden", "true")
    header.append(score)
  }
  const primary = document.createElement("strong")
  primary.textContent = totalTokens(result.usage) ? `${formatNumber.format(totalTokens(result.usage))} tokens` : `${result.codeStats?.sourceLines ?? "—"} source lines`
  const secondary = document.createElement("span")
  secondary.textContent = `${durationLabel(result.durationMs)} · ${result.codeStats?.sourceFiles ?? "—"} files`
  button.append(header, primary, secondary)
  button.addEventListener("mouseenter", () => showMatrixTooltip(button, result))
  button.addEventListener("mouseleave", hideMatrixTooltip)
  button.addEventListener("focus", () => showMatrixTooltip(button, result))
  button.addEventListener("blur", hideMatrixTooltip)
  button.addEventListener("click", () => {
    hideMatrixTooltip()
    state.result = result
    if (engineeringScore(result) != null) state.valueRunId = result.runId
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

function valueMetricConfig() {
  if (state.valueMetric === "duration") {
    return {
      label: "Duration",
      value: (result) => result.durationMs ?? 0,
      format: (value) => value ? durationLabel(value) : "0s",
    }
  }
  if (state.valueMetric === "tokens") {
    return {
      label: "Shown tokens",
      value: (result) => totalTokens(result.usage),
      format: (value) => value ? valueLabel(value) : "0",
    }
  }
  return {
    label: "Estimated credits",
    value: (result) => estimatedCredits(result) ?? 0,
    format: (value) => `≈ ${value.toFixed(2)} credits`,
  }
}

function svgNode(tag, attributes = {}, text = null) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag)
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
  if (text != null) element.textContent = text
  return element
}

function valuePointClass(result) {
  return `model-${result.model.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`
}

function renderValueDetail() {
  const candidates = reviewedResults()
  const result = resultById(state.valueRunId) ?? candidates[0]
  if (!result) {
    elements.valueDetail.replaceChildren()
    return
  }
  state.valueRunId = result.runId
  const config = valueMetricConfig()
  const secondaryValue = state.valueMetric === "duration"
    ? `≈ ${(estimatedCredits(result) ?? 0).toFixed(2)} credits`
    : durationLabel(result.durationMs)
  const copy = createNode("div", "value-detail-copy")
  copy.append(
    createNode("span", "", "Selected configuration"),
    createNode("strong", "", `${result.modelLabel} · ${result.effortLabel}`),
    createNode("p", "", `${scoreLabel(engineeringScore(result))} / 100 engineering · ${config.format(config.value(result))} · ${secondaryValue}`),
  )
  const actions = createNode("div", "value-detail-actions")
  const load = createNode("button", "value-action", "Load build")
  load.type = "button"
  load.addEventListener("click", () => {
    state.result = result
    render()
    elements.viewer.scrollIntoView({ behavior: "smooth", block: "start" })
  })
  const compare = createNode("button", "value-action primary", "Compare with current")
  compare.type = "button"
  compare.addEventListener("click", () => {
    const secondary = state.result?.runId === result.runId ? bestComparatorFor(result) : state.result
    openComparison(result, secondary)
  })
  const evidence = createNode("button", "value-action", "Review evidence")
  evidence.type = "button"
  evidence.addEventListener("click", () => openEvidence(result))
  actions.append(load, compare, evidence)
  elements.valueDetail.replaceChildren(copy, actions)
}

function renderValueMap() {
  const candidates = reviewedResults()
  if (!candidates.length) {
    elements.valueChart.replaceChildren(createNode("p", "value-empty", "Engineering reviews are not available yet."))
    elements.valueDetail.replaceChildren()
    return
  }

  if (!resultById(state.valueRunId) || engineeringScore(resultById(state.valueRunId)) == null) {
    state.valueRunId = [...candidates].sort((a, b) => (estimatedCredits(a) ?? Infinity) - (estimatedCredits(b) ?? Infinity))[0].runId
  }

  const config = valueMetricConfig()
  const width = 1000
  const height = 500
  const margin = { top: 28, right: 34, bottom: 64, left: 72 }
  const plotWidth = width - margin.left - margin.right
  const plotHeight = height - margin.top - margin.bottom
  const values = candidates.map((result) => config.value(result))
  const maxValue = Math.max(...values) * 1.08 || 1
  const scores = candidates.map((result) => engineeringScore(result))
  const minScore = Math.max(0, Math.floor((Math.min(...scores) - 5) / 5) * 5)
  const maxScore = 100
  const x = (value) => margin.left + (value / maxValue) * plotWidth
  const y = (score) => margin.top + ((maxScore - score) / (maxScore - minScore)) * plotHeight

  const svg = svgNode("svg", {
    class: "value-plot",
    viewBox: `0 0 ${width} ${height}`,
    role: "img",
    "aria-labelledby": "value-plot-title value-plot-description",
  })
  svg.append(
    svgNode("title", { id: "value-plot-title" }, `Engineering score against ${config.label.toLowerCase()}`),
    svgNode("desc", { id: "value-plot-description" }, "Reviewed benchmark configurations. Higher points scored better, while points further left used less of the selected metric."),
  )

  const xTicks = Array.from({ length: 5 }, (_, index) => (maxValue / 4) * index)
  const yStart = Math.ceil(minScore / 10) * 10
  const yTicks = []
  for (let score = yStart; score <= maxScore; score += 10) yTicks.push(score)
  for (const tick of xTicks) {
    const position = x(tick)
    svg.append(
      svgNode("line", { class: "value-grid", x1: position, y1: margin.top, x2: position, y2: height - margin.bottom }),
      svgNode("text", { class: "value-axis-label", x: position, y: height - 33, "text-anchor": "middle" }, config.format(tick).replace("≈ ", "")),
    )
  }
  for (const tick of yTicks) {
    const position = y(tick)
    svg.append(
      svgNode("line", { class: "value-grid", x1: margin.left, y1: position, x2: width - margin.right, y2: position }),
      svgNode("text", { class: "value-axis-label", x: margin.left - 14, y: position + 4, "text-anchor": "end" }, tick),
    )
  }
  svg.append(
    svgNode("line", { class: "value-axis", x1: margin.left, y1: height - margin.bottom, x2: width - margin.right, y2: height - margin.bottom }),
    svgNode("line", { class: "value-axis", x1: margin.left, y1: margin.top, x2: margin.left, y2: height - margin.bottom }),
    svgNode("text", { class: "value-axis-title", x: width / 2, y: height - 6, "text-anchor": "middle" }, config.label),
    svgNode("text", { class: "value-axis-title", x: 18, y: height / 2, "text-anchor": "middle", transform: `rotate(-90 18 ${height / 2})` }, "Engineering score"),
  )

  const ordered = [...candidates].sort((a, b) => config.value(a) - config.value(b))
  let bestScore = -Infinity
  const frontier = ordered.filter((result) => {
    const score = engineeringScore(result)
    if (score > bestScore) {
      bestScore = score
      return true
    }
    return false
  })
  const path = frontier.map((result, index) => `${index ? "L" : "M"}${x(config.value(result))} ${y(engineeringScore(result))}`).join(" ")
  if (path) svg.append(svgNode("path", { class: "value-frontier", d: path }))

  for (const result of candidates) {
    const score = engineeringScore(result)
    const group = svgNode("g", {
      class: `value-point ${valuePointClass(result)}${result.runId === state.valueRunId ? " selected" : ""}`,
      role: "button",
      tabindex: "0",
      "aria-label": `${result.modelLabel}, ${result.effortLabel}. Engineering score ${scoreLabel(score)} out of 100. ${config.format(config.value(result))}.`,
      transform: `translate(${x(config.value(result))} ${y(score)})`,
    })
    group.append(svgNode("circle", { r: frontier.includes(result) ? 10 : 8 }))
    if (frontier.includes(result)) {
      group.append(svgNode("text", { class: "value-frontier-label", x: 0, y: -17, "text-anchor": "middle" }, `${result.modelLabel} ${result.effortLabel}`))
    }
    const selectPoint = () => {
      state.valueRunId = result.runId
      renderValueMap()
    }
    group.addEventListener("click", selectPoint)
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault()
        selectPoint()
      }
    })
    svg.append(group)
  }

  const legend = createNode("div", "value-legend")
  for (const model of state.models.filter((item) => item.model !== "default")) {
    const item = createNode("span")
    item.append(createNode("i", valuePointClass({ model: model.model })), document.createTextNode(model.modelLabel))
    legend.append(item)
  }
  elements.valueChart.replaceChildren(svg, legend)
  renderValueDetail()
}

function bestComparatorFor(result) {
  const candidates = reviewedResults().filter((candidate) => candidate.runId !== result?.runId)
  if (!candidates.length) return state.results.find((candidate) => candidate.runId !== result?.runId) ?? result
  const qualityLeader = [...candidates].sort((a, b) => {
    const scoreDifference = engineeringScore(b) - engineeringScore(a)
    if (scoreDifference) return scoreDifference
    return (estimatedCredits(a) ?? Infinity) - (estimatedCredits(b) ?? Infinity)
  })[0]
  if (engineeringScore(result) !== Math.max(...reviewedResults().map(engineeringScore))) return qualityLeader
  return [...candidates].sort((a, b) => (estimatedCredits(a) ?? Infinity) - (estimatedCredits(b) ?? Infinity))[0]
}

function compareOptionLabel(result) {
  const score = engineeringScore(result)
  return `${result.modelLabel} · ${result.effortLabel}${score == null ? "" : ` · ${scoreLabel(score)}/100`}`
}

function populateCompareSelect(select, selectedId) {
  const results = [...state.results].sort((a, b) => {
    const modelDifference = modelOrder.indexOf(a.model) - modelOrder.indexOf(b.model)
    if (modelDifference) return modelDifference
    return effortOrder.indexOf(a.effort) - effortOrder.indexOf(b.effort)
  })
  select.replaceChildren(...results.map((result) => {
    const option = document.createElement("option")
    option.value = result.runId
    option.textContent = compareOptionLabel(result)
    option.selected = result.runId === selectedId
    return option
  }))
}

function compareMetric(label, value) {
  const row = createNode("div")
  row.append(createNode("dt", "", label), createNode("dd", "", value))
  return row
}

function renderComparePane(result, title, metrics, frame, evidenceButton) {
  title.textContent = `${result.modelLabel} · ${result.effortLabel}`
  const credits = estimatedCredits(result)
  metrics.replaceChildren(
    compareMetric("Engineering", engineeringScore(result) == null ? "N/A" : `${scoreLabel(engineeringScore(result))}/100`),
    compareMetric("Credits", credits == null ? "N/A" : `≈ ${credits.toFixed(2)}`),
    compareMetric("Duration", durationLabel(result.durationMs)),
    compareMetric("Tokens", valueLabel(totalTokens(result.usage))),
  )
  if (frame.getAttribute("src") !== result.previewPath) frame.src = result.previewPath
  frame.title = `${result.modelLabel} with ${result.effortLabel} effort generated app preview`
  evidenceButton.hidden = !result.engineeringReview
  evidenceButton.disabled = !result.engineeringReview
}

function compareDeltaItem(label, value, context) {
  const item = createNode("span")
  item.append(createNode("small", "", label), createNode("strong", "", value), createNode("em", "", context))
  return item
}

function renderComparison() {
  let resultA = resultById(state.compareAId) ?? state.result
  let resultB = resultById(state.compareBId) ?? bestComparatorFor(resultA)
  if (!resultA || !resultB) return
  if (resultA.runId === resultB.runId) resultB = bestComparatorFor(resultA)
  state.compareAId = resultA.runId
  state.compareBId = resultB.runId

  populateCompareSelect(elements.compareASelect, resultA.runId)
  populateCompareSelect(elements.compareBSelect, resultB.runId)
  renderComparePane(resultA, elements.compareATitle, elements.compareAMetrics, elements.compareAFrame, elements.compareAEvidence)
  renderComparePane(resultB, elements.compareBTitle, elements.compareBMetrics, elements.compareBFrame, elements.compareBEvidence)

  const scoreA = engineeringScore(resultA)
  const scoreB = engineeringScore(resultB)
  const creditsA = estimatedCredits(resultA)
  const creditsB = estimatedCredits(resultB)
  elements.compareDelta.replaceChildren(
    compareDeltaItem("B minus A · engineering", scoreA == null || scoreB == null ? "N/A" : signedNumber(scoreB - scoreA), "points"),
    compareDeltaItem("B minus A · credits", creditsA == null || creditsB == null ? "N/A" : signedNumber(creditsB - creditsA), "estimated"),
    compareDeltaItem("B minus A · duration", signedNumber((resultB.durationMs - resultA.durationMs) / 60000, 1), "minutes"),
    compareDeltaItem("B minus A · source", signedNumber((resultB.codeStats?.sourceLines ?? 0) - (resultA.codeStats?.sourceLines ?? 0), 0), "lines"),
  )

  elements.compareStage.dataset.viewport = state.viewport
  elements.compareStage.dataset.activeSide = state.compareSide
  document.querySelectorAll("[data-compare-viewport]").forEach((button) => {
    button.classList.toggle("active", button.dataset.compareViewport === state.viewport)
  })
  document.querySelectorAll("[data-compare-side]").forEach((button) => {
    button.classList.toggle("active", button.dataset.compareSide === state.compareSide)
    button.setAttribute("aria-pressed", String(button.dataset.compareSide === state.compareSide))
  })
  setQuery()
}

function openComparison(primary = state.result, secondary = null) {
  if (!primary) return
  const comparison = secondary && secondary.runId !== primary.runId ? secondary : bestComparatorFor(primary)
  state.compareAId = primary.runId
  state.compareBId = comparison?.runId ?? primary.runId
  state.compareSide = "a"
  state.compareOpen = true
  renderComparison()
  document.body.classList.add("compare-open")
  if (!elements.compareDialog.open) elements.compareDialog.showModal()
  setQuery()
}

function closeComparison() {
  state.compareOpen = false
  document.body.classList.remove("compare-open")
  if (elements.compareDialog.open) elements.compareDialog.close()
  setQuery()
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
  if (state.compareOpen && state.compareAId && state.compareBId) {
    url.searchParams.set("compare", `${state.compareAId},${state.compareBId}`)
  } else {
    url.searchParams.delete("compare")
  }
  history.replaceState(null, "", url)
}

function render() {
  syncSliders()
  renderResult()
  renderValueMap()
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
  document.querySelectorAll("[data-value-metric]").forEach((button) => {
    button.classList.toggle("active", button.dataset.valueMetric === state.valueMetric)
    button.setAttribute("aria-pressed", String(button.dataset.valueMetric === state.valueMetric))
  })
  if (state.compareOpen) renderComparison()
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
  const comparison = query.get("compare")?.split(",").map(resultById).filter(Boolean) ?? []
  if (comparison.length === 2 && comparison[0].runId !== comparison[1].runId) {
    state.compareAId = comparison[0].runId
    state.compareBId = comparison[1].runId
    state.compareOpen = true
  }
  render()
  if (state.compareOpen) {
    document.body.classList.add("compare-open")
    elements.compareDialog.showModal()
  }
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

document.querySelectorAll("[data-value-metric]").forEach((button) => {
  button.addEventListener("click", () => {
    state.valueMetric = button.dataset.valueMetric
    renderValueMap()
    document.querySelectorAll("[data-value-metric]").forEach((item) => {
      item.classList.toggle("active", item.dataset.valueMetric === state.valueMetric)
      item.setAttribute("aria-pressed", String(item.dataset.valueMetric === state.valueMetric))
    })
  })
})

elements.compareOpen.addEventListener("click", () => openComparison(state.result))
elements.evidenceOpen.addEventListener("click", () => openEvidence(state.result))
elements.evidenceClose.addEventListener("click", () => elements.evidenceDialog.close())
elements.evidenceDialog.addEventListener("click", (event) => {
  if (event.target === elements.evidenceDialog) elements.evidenceDialog.close()
})

elements.compareClose.addEventListener("click", closeComparison)
elements.compareDialog.addEventListener("close", () => {
  if (!state.compareOpen) return
  state.compareOpen = false
  document.body.classList.remove("compare-open")
  setQuery()
})
elements.compareASelect.addEventListener("change", () => {
  const previousA = state.compareAId
  state.compareAId = elements.compareASelect.value
  if (state.compareAId === state.compareBId) {
    state.compareBId = previousA !== state.compareAId ? previousA : bestComparatorFor(resultById(state.compareAId))?.runId
  }
  renderComparison()
})
elements.compareBSelect.addEventListener("change", () => {
  const previousB = state.compareBId
  state.compareBId = elements.compareBSelect.value
  if (state.compareAId === state.compareBId) {
    state.compareAId = previousB !== state.compareBId ? previousB : bestComparatorFor(resultById(state.compareBId))?.runId
  }
  renderComparison()
})
elements.compareSwap.addEventListener("click", () => {
  const previousA = state.compareAId
  state.compareAId = state.compareBId
  state.compareBId = previousA
  renderComparison()
})
document.querySelectorAll("[data-compare-viewport]").forEach((button) => {
  button.addEventListener("click", () => {
    state.viewport = button.dataset.compareViewport
    render()
  })
})
document.querySelectorAll("[data-compare-side]").forEach((button) => {
  button.addEventListener("click", () => {
    state.compareSide = button.dataset.compareSide
    renderComparison()
  })
})
elements.compareAEvidence.addEventListener("click", () => openEvidence(resultById(state.compareAId)))
elements.compareBEvidence.addEventListener("click", () => openEvidence(resultById(state.compareBId)))
elements.compareCopy.addEventListener("click", async () => {
  setQuery()
  await navigator.clipboard.writeText(window.location.href)
  const original = elements.compareCopy.textContent
  elements.compareCopy.textContent = "Comparison copied"
  window.setTimeout(() => { elements.compareCopy.textContent = original }, 1600)
})

elements.planCycle.addEventListener("click", () => {
  const currentIndex = plans.findIndex((plan) => plan.id === state.planId)
  state.planId = plans[(currentIndex + 1) % plans.length].id
  render()
})

elements.currentBuildToggle.addEventListener("click", () => {
  const expanded = elements.currentBuildBar.classList.toggle("expanded")
  elements.currentBuildToggle.setAttribute("aria-expanded", String(expanded))
  elements.currentBuildToggle.querySelector("span").textContent = expanded ? "Hide metrics" : "Metrics"
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
