/*
  The sheet holds every frame for the whole session. Nothing is created or
  destroyed when the view changes — the frames only ever move, so the two
  arrangements are the same seventeen objects seen two ways.
*/

const state = {
  all: [],
  rolls: [],
  rollNotes: new Map(),
  roll: null,
  results: [],
  models: [],
  efforts: [],
  control: null,
  arrangement: "grid",
  metric: "credits",
  marked: null,
  loupe: null,
  against: null,
  viewport: "desktop",
  planId: "5x",
}

const elements = {
  sheet: document.querySelector("#sheet"),
  frames: document.querySelector("#frames"),
  axisEffort: document.querySelector("#axis-effort"),
  axisModel: document.querySelector("#axis-model"),
  plotGuides: document.querySelector("#plot-guides"),
  plotLegend: document.querySelector("#plot-legend"),
  plotRead: document.querySelector("#plot-read"),
  sheetHint: document.querySelector("#sheet-hint"),
  frameCount: document.querySelector("#frame-count"),
  loupe: document.querySelector("#loupe"),
  loupeSetting: document.querySelector("#loupe-setting"),
  loupeName: document.querySelector("#loupe-name"),
  loupeReadout: document.querySelector("#loupe-readout"),
  stage: document.querySelector("#stage"),
  paneB: document.querySelector('[data-pane="b"]'),
  paneALabel: document.querySelector("#pane-a-label"),
  paneBLabel: document.querySelector("#pane-b-label"),
  frameA: document.querySelector("#frame-a"),
  frameB: document.querySelector("#frame-b"),
  delta: document.querySelector("#delta"),
  runNote: document.querySelector("#run-note"),
  runFacts: document.querySelector("#run-facts"),
  runLinks: document.querySelector("#run-links"),
  holdAgainst: document.querySelector("#hold-against"),
  reviewOpen: document.querySelector("#review-open"),
  review: document.querySelector("#review"),
  reviewKicker: document.querySelector("#review-kicker"),
  reviewTitle: document.querySelector("#review-title"),
  reviewBody: document.querySelector("#review-body"),
  brief: document.querySelector("#brief"),
  briefOpen: document.querySelector("#brief-open"),
  promptBody: document.querySelector("#prompt-body"),
  plans: document.querySelector("#plans"),
  picker: document.querySelector("#picker"),
  pickerGrid: document.querySelector("#picker-grid"),
}

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 })
const assetVersion = new URL(import.meta.url).searchParams.get("v")
// "default" and "none" both mean "this run sits off the effort axis" — a
// hand-built reference in the Codex roll, a model with no effort parameter in
// the Claude roll. Neither gets a column.
const offAxisEfforts = new Set(["default", "none"])
const effortOrder = ["default", "none", "low", "medium", "high", "xhigh", "max"]
const modelOrder = [
  "default",
  "gpt-5.5",
  "gpt-5.6-luna",
  "gpt-5.6-terra",
  "gpt-5.6-sol",
  "claude-haiku-4-5",
  "claude-sonnet-5",
  "claude-opus-5",
  "claude-fable-5",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.1-pro",
]

const creditRates = {
  "gpt-5.5": { input: 125, cachedInput: 12.5, output: 750 },
  "gpt-5.6-luna": { input: 25, cachedInput: 2.5, output: 150 },
  "gpt-5.6-terra": { input: 62.5, cachedInput: 6.25, output: 375 },
  "gpt-5.6-sol": { input: 125, cachedInput: 12.5, output: 750 },
}

const plans = [
  { id: "plus", label: "Plus", multiplier: "1×", allowance: 3000, messages: "15–90 messages" },
  { id: "5x", label: "Pro 5x", multiplier: "5×", allowance: 15000, messages: "75–450 messages" },
  { id: "20x", label: "Pro 20x", multiplier: "20×", allowance: 60000, messages: "300–1,800 messages" },
]

const categoryLabels = {
  correctness: "Correctness",
  reliability: "Reliability",
  accessibility: "Accessibility",
  maintainability: "Maintainability",
  security: "Security",
  performance: "Performance",
  verification: "Verification",
}

/* ── numbers ─────────────────────────────────────────────────────────────── */

const assetPath = (path) => (assetVersion ? `${path}?v=${encodeURIComponent(assetVersion)}` : path)

const uniqueBy = (items, key) => [...new Map(items.map((item) => [key(item), item])).values()]

const resultById = (id) => state.results.find((result) => result.runId === id)

const totalTokens = (usage = {}) =>
  (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0) + (usage.reasoningOutputTokens ?? 0)

function estimatedCredits(result) {
  const rate = creditRates[result?.model]
  if (!rate || !result.usage) return null
  const cached = result.usage.cachedInputTokens ?? 0
  const uncached = Math.max(0, (result.usage.inputTokens ?? 0) - cached)
  return (uncached * rate.input + cached * rate.cachedInput + (result.usage.outputTokens ?? 0) * rate.output) / 1e6
}

function engineeringScore(result) {
  const score = result?.engineeringReview?.totalScore
  return result?.engineeringReview?.status === "frozen" && Number.isFinite(score) ? score : null
}

const reviewed = () => state.results.filter((result) => engineeringScore(result) != null)

function durationLabel(ms) {
  if (!ms) return "—"
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.round((ms % 60000) / 1000)
  return minutes ? `${minutes}m ${seconds}s` : `${seconds}s`
}

function dateLabel(value) {
  if (!value) return "—"
  const format = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short", timeZone: "UTC" })
  return `${format.format(new Date(value))} UTC`
}

const countLabel = (value, suffix = "") => (value ? `${compact.format(value)}${suffix}` : "—")

function scoreLabel(value) {
  if (!Number.isFinite(value)) return "N/A"
  return Number.isInteger(value) ? String(value) : value.toFixed(1)
}

function signed(value, digits = 1) {
  if (!Number.isFinite(value)) return "N/A"
  if (Math.abs(value) < 0.05) return "no change"
  const size = Math.abs(value).toFixed(digits).replace(/\.0$/, "")
  return `${value > 0 ? "+" : "−"}${size}`
}

const currentPlan = () => plans.find((plan) => plan.id === state.planId) ?? plans[1]

function node(tag, className = "", text = null) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (text != null) element.textContent = text
  return element
}

function pair(term, detail) {
  const row = node("div")
  row.append(node("dt", "", term), node("dd", "", detail ?? "—"))
  return row
}

function svgNode(tag, attributes = {}, text = null) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tag)
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value)
  if (text != null) element.textContent = text
  return element
}

// Claude Code reports what a run actually cost; Codex does not, so that roll
// is estimated from a rate card. The axis is labelled for whichever roll is on
// screen rather than mixing the two units.
const usesRealCost = () => state.results.some((result) => result.costUsd != null)

const runCost = (result) => (result.costUsd != null ? result.costUsd : estimatedCredits(result))

const metrics = {
  credits: {
    get name() {
      return usesRealCost() ? "Cost in dollars" : "Estimated credits"
    },
    of: (result) => runCost(result) ?? 0,
    format: (value) => (usesRealCost() ? `$${value.toFixed(2)}` : value.toFixed(1)),
    short: (result) => {
      const cost = runCost(result)
      if (cost == null) return "—"
      return result.costUsd != null ? `$${cost.toFixed(2)}` : `${cost.toFixed(1)}c`
    },
  },
  duration: {
    name: "Wall-clock time",
    of: (result) => result.durationMs ?? 0,
    format: (value) => `${Math.round(value / 60000)}m`,
    short: (result) => durationLabel(result.durationMs),
  },
  tokens: {
    name: "Tokens",
    of: (result) => totalTokens(result.usage),
    format: (value) => compact.format(value),
    short: (result) => countLabel(totalTokens(result.usage)),
  },
}

/* ── the sheet ───────────────────────────────────────────────────────────── */

const frameNodes = new Map()

function buildFrames() {
  elements.frames.replaceChildren()
  frameNodes.clear()

  for (const result of state.results) {
    const frame = node("button", "frame")
    frame.type = "button"
    frame.dataset.runId = result.runId
    frame.dataset.control = String(result.status === "default" || result.status === "sample")
    frame.setAttribute("role", "listitem")

    const score = engineeringScore(result)
    frame.setAttribute(
      "aria-label",
      `${result.modelLabel}, ${result.effortLabel} effort. ${
        score == null ? "Not reviewed" : `Engineering ${scoreLabel(score)} out of 100`
      }. ${metrics.credits.short(result)} estimated credits, ${durationLabel(result.durationMs)}. Open this build.`,
    )

    const well = node("div", "frame-well")
    if (result.thumbnailPath) {
      const image = document.createElement("img")
      image.src = assetPath(result.thumbnailPath)
      image.alt = ""
      image.loading = "lazy"
      image.decoding = "async"
      well.append(image)
    } else {
      well.append(node("div", "frame-blank", "No capture"))
    }

    const markings = node("div", "frame-markings")
    markings.append(
      node("span", `frame-score${score == null ? " none" : ""}`, score == null ? "—" : scoreLabel(score)),
      node("span", "frame-setting", `${result.modelLabel} · ${result.effortLabel}`),
      node("span", "frame-cost", metrics[state.metric].short(result)),
    )

    frame.append(well, markings)
    frame.addEventListener("click", () => openLoupe(result.runId))
    frame.addEventListener("pointerenter", () => mark(result.runId, false))
    elements.frames.append(frame)
    frameNodes.set(result.runId, frame)
  }
}

function refreshMarkings() {
  for (const [runId, frame] of frameNodes) {
    const result = resultById(runId)
    frame.querySelector(".frame-cost").textContent = metrics[state.metric].short(result)
  }
}

const isStacked = () => elements.sheet.clientWidth < 780

/* Column = model, row = effort. Frames are sized so the whole sheet fits the
   plane without scrolling; the gutter carries the effort scale.
   Below 780px the axes cannot survive, so the sheet becomes one scrolling
   column and each frame carries its own setting. */
function gridLayout() {
  const { clientWidth: width, clientHeight: height } = elements.sheet
  // Frame size is height-bound: four rows of 16:10 have to clear the sheet, and
  // a real 1440x900 display is only a ~764px viewport once browser chrome is
  // taken out. Every constant here is chrome stolen from the evidence, so they
  // are kept as tight as they can be while staying legible.
  const pad = width < 900 ? 16 : 24
  const gap = width < 900 ? 12 : 12
  const markings = 18
  const positions = new Map()

  if (isStacked()) {
    const frameWidth = width - pad * 2
    const rowHeight = frameWidth * (10 / 16) + markings + 26
    state.results.forEach((result, index) => {
      positions.set(result.runId, { x: pad, y: pad + index * rowHeight, scale: 1 })
    })
    return {
      positions,
      frameWidth,
      frameHeight: frameWidth * (10 / 16),
      contentHeight: pad * 2 + rowHeight * state.results.length,
      stacked: true,
    }
  }

  const gutter = 116
  const header = 38
  const columns = state.models.length
  const rows = state.efforts.length

  const byWidth = (width - pad * 2 - gutter - gap * (columns - 1)) / columns
  // The control print gets its own short row beneath the grid.
  const controlRow = 46
  const byHeight = ((height - pad * 2 - header - controlRow - gap * (rows - 1)) / rows - markings) * (16 / 10)
  const frameWidth = Math.max(96, Math.min(byWidth, byHeight))
  const frameHeight = frameWidth * (10 / 16)
  const rowHeight = frameHeight + markings + gap

  const blockWidth = gutter + frameWidth * columns + gap * (columns - 1)
  const blockHeight = header + rowHeight * rows - gap + controlRow
  const originX = Math.max(pad, (width - blockWidth) / 2)
  const originY = Math.max(pad, (height - blockHeight) / 2)

  const columnX = (index) => originX + gutter + index * (frameWidth + gap)
  const rowY = (index) => originY + header + index * rowHeight

  for (const result of state.results) {
    const column = state.models.findIndex((item) => item.model === result.model)
    const row = state.efforts.findIndex((item) => item.effort === result.effort)
    if (column === -1 || row === -1) {
      // The control print sits off both axes, printed small beneath the grid.
      positions.set(result.runId, {
        x: originX + gutter,
        y: originY + header + rowHeight * rows - gap + 16,
        scale: 34 / frameHeight,
      })
      continue
    }
    positions.set(result.runId, { x: columnX(column), y: rowY(row), scale: 1 })
  }

  return {
    positions,
    frameWidth,
    frameHeight,
    originX,
    originY,
    gutter,
    header,
    rowHeight,
    columnX,
    rowY,
    gap,
    rows,
    contentHeight: height,
    stacked: false,
  }
}

/* Cheap runs bunch together, so chips are nudged apart just far enough to be
   individually visible. Each displaced chip keeps a hairline back to its true
   reading, so the separation never hides where the run actually sits. */
function separate(items, width, height, bounds) {
  for (let pass = 0; pass < 90; pass += 1) {
    let moved = false
    for (let a = 0; a < items.length; a += 1) {
      for (let b = a + 1; b < items.length; b += 1) {
        const one = items[a]
        const two = items[b]
        const dx = two.x - one.x
        const dy = two.y - one.y
        const overlapX = width - Math.abs(dx)
        const overlapY = height - Math.abs(dy)
        if (overlapX <= 0 || overlapY <= 0) continue
        moved = true
        if (overlapX < overlapY) {
          const shift = (overlapX / 2) * (dx < 0 ? -1 : 1) || overlapX / 2
          one.x -= shift
          two.x += shift
        } else {
          const shift = (overlapY / 2) * (dy < 0 ? -1 : 1) || overlapY / 2
          one.y -= shift
          two.y += shift
        }
      }
    }
    if (!moved) break
  }
  for (const item of items) {
    item.x = Math.max(bounds.left, Math.min(bounds.right - width, item.x))
    item.y = Math.max(bounds.top, Math.min(bounds.bottom - height, item.y))
  }
}

function plotLayout(frameWidth) {
  const { clientWidth: width, clientHeight: height } = elements.sheet
  const narrow = width < 900
  const chip = Math.max(72, Math.min(frameWidth * 0.52, 156))
  const scale = chip / frameWidth
  const chipHeight = chip * (10 / 16)

  const margin = {
    top: narrow ? 168 : 66,
    right: narrow ? 22 : 54,
    bottom: 118,
    left: narrow ? 44 : 76,
  }
  const plotWidth = width - margin.left - margin.right - chip
  const plotHeight = height - margin.top - margin.bottom - chipHeight

  const scored = reviewed()
  const unscored = state.results.filter((result) => engineeringScore(result) == null)
  const metric = metrics[state.metric]
  const maxCost = Math.max(...scored.map((result) => metric.of(result)), 1) * 1.06
  // With no reviews at all there is nothing to plot against, so the scale falls
  // back to the full range rather than resolving to NaN.
  const scores = scored.map((result) => engineeringScore(result))
  const minScore = scores.length ? Math.max(0, Math.floor((Math.min(...scores) - 6) / 5) * 5) : 0

  const x = (value) => margin.left + (value / maxCost) * plotWidth
  const y = (score) => margin.top + ((100 - score) / (100 - minScore)) * plotHeight

  const placed = scored.map((result) => ({
    runId: result.runId,
    x: x(metric.of(result)),
    y: y(engineeringScore(result)),
    trueX: x(metric.of(result)),
    trueY: y(engineeringScore(result)),
  }))

  separate(placed, chip * 0.88, chipHeight * 0.88, {
    left: margin.left - chip * 0.2,
    right: width - margin.right,
    top: margin.top - chipHeight * 0.4,
    bottom: height - margin.bottom - chipHeight * 0.3,
  })

  const positions = new Map()
  for (const item of placed) positions.set(item.runId, { x: item.x, y: item.y, scale })

  // Runs with no review have no score, so they are shelved rather than plotted
  // at an implied zero.
  const shelfY = height - margin.bottom + 48
  unscored.forEach((result, index) => {
    positions.set(result.runId, { x: margin.left + index * (chip + 10), y: shelfY, scale })
  })

  return {
    positions,
    placed,
    scale,
    chip,
    chipHeight,
    x,
    y,
    margin,
    maxCost,
    minScore,
    plotWidth,
    plotHeight,
    scored,
    unscored,
    shelfY,
  }
}

function layout() {
  const grid = gridLayout()
  const plot = state.arrangement === "plot" ? plotLayout(grid.frameWidth) : null
  const positions = plot ? plot.positions : grid.positions

  elements.frames.style.setProperty("--fw", `${grid.frameWidth}px`)
  elements.frames.style.height = `${plot ? elements.sheet.clientHeight : grid.contentHeight}px`
  elements.sheet.dataset.stacked = String(grid.stacked && !plot)

  for (const [runId, frame] of frameNodes) {
    const spot = positions.get(runId)
    if (!spot) continue
    frame.style.width = `${grid.frameWidth}px`
    frame.style.transform = `translate3d(${spot.x}px, ${spot.y}px, 0) scale(${spot.scale})`
  }

  renderAxes(grid)
  renderPlotGuides(plot)
}

function renderAxes(grid) {
  if (grid.stacked) {
    elements.axisEffort.replaceChildren()
    elements.axisModel.replaceChildren()
    return
  }

  const efforts = node("div")
  for (const [index, item] of state.efforts.entries()) {
    const runs = state.results.filter((result) => result.effort === item.effort)
    const reasoning = runs.reduce((total, run) => total + (run.usage?.reasoningOutputTokens ?? 0), 0) / (runs.length || 1)
    const peak = Math.max(
      ...state.efforts.map((effort) => {
        const group = state.results.filter((result) => result.effort === effort.effort)
        return group.reduce((total, run) => total + (run.usage?.reasoningOutputTokens ?? 0), 0) / (group.length || 1)
      }),
      1,
    )

    const span = node("span")
    // Effort is an ordered variable, so the label's width axis and the rule
    // beneath it both grow with it. Wider type, longer rule, more thinking.
    span.style.setProperty("--w", String(88 + (index / Math.max(1, state.efforts.length - 1)) * 28))
    span.style.setProperty("--bar", `${Math.max(6, (reasoning / peak) * 100)}%`)
    span.style.left = `${grid.originX}px`
    span.style.top = `${grid.rowY(index) + grid.frameHeight / 2 - 26}px`
    span.style.width = `${grid.gutter - 14}px`
    // Some runners bill thinking inside output tokens and never break it out.
    // Where there is no reasoning figure the rule is dropped rather than drawn
    // at zero, which would read as "this setting did no thinking".
    span.append(node("b", "", item.effortLabel))
    if (reasoning > 0) {
      span.append(node("i"), node("u", "", `${compact.format(Math.round(reasoning))} reasoning`))
    }
    efforts.append(span)
  }

  // The control print is labelled in the gutter like any other row, so it is
  // clear it belongs to the sheet without belonging to the experiment.
  const control = state.results.find(
    (result) => !state.models.some((item) => item.model === result.model),
  )
  if (control) {
    const span = node("span")
    span.style.setProperty("--w", "84")
    span.style.setProperty("--bar", "0%")
    span.style.left = `${grid.originX}px`
    span.style.top = `${grid.originY + grid.header + grid.rowHeight * grid.rows - grid.gap + 22}px`
    span.style.width = `${grid.gutter - 14}px`
    span.append(
      node("b", "", control.status === "default" ? "Control" : control.modelLabel),
      node("u", "", control.status === "default" ? "hand-built" : "no effort axis"),
    )
    efforts.append(span)
  }

  elements.axisEffort.replaceChildren(...efforts.children)

  const models = node("div")
  for (const [index, item] of state.models.entries()) {
    const span = node("span")
    span.style.left = `${grid.columnX(index)}px`
    span.style.top = `${grid.originY + 4}px`
    span.style.width = `${grid.frameWidth}px`
    span.append(node("b", "", item.modelLabel), node("em", "", item.model))
    models.append(span)
  }
  elements.axisModel.replaceChildren(...models.children)
}

function renderPlotGuides(plot) {
  if (!plot) {
    elements.plotGuides.replaceChildren()
    return
  }

  const { clientWidth: width, clientHeight: height } = elements.sheet
  const metric = metrics[state.metric]
  const guides = svgNode("svg", { viewBox: `0 0 ${width} ${height}` })
  const half = plot.chip / 2
  const halfHeight = plot.chipHeight / 2

  for (let step = 0; step <= 4; step += 1) {
    const value = (plot.maxCost / 4) * step
    const at = plot.x(value) + half
    guides.append(
      svgNode("line", { class: "plot-grid", x1: at, y1: plot.margin.top, x2: at, y2: height - plot.margin.bottom }),
      svgNode(
        "text",
        { class: "plot-tick", x: at, y: height - plot.margin.bottom + 18, "text-anchor": "middle" },
        metric.format(value),
      ),
    )
  }

  for (let score = Math.ceil(plot.minScore / 10) * 10; score <= 100; score += 10) {
    const at = plot.y(score) + halfHeight
    guides.append(
      svgNode("line", { class: "plot-grid", x1: plot.margin.left, y1: at, x2: width - plot.margin.right, y2: at }),
      svgNode("text", { class: "plot-tick", x: plot.margin.left - 12, y: at + 4, "text-anchor": "end" }, String(score)),
    )
  }

  guides.append(
    svgNode("line", {
      class: "plot-axis",
      x1: plot.margin.left,
      y1: height - plot.margin.bottom,
      x2: width - plot.margin.right,
      y2: height - plot.margin.bottom,
    }),
    svgNode(
      "text",
      {
        class: "plot-name",
        x: width - plot.margin.right,
        y: height - plot.margin.bottom + 38,
        "text-anchor": "end",
      },
      metric.name,
    ),
    svgNode(
      "text",
      {
        class: "plot-name",
        x: 16,
        y: height / 2,
        "text-anchor": "middle",
        transform: `rotate(-90 16 ${height / 2})`,
      },
      "Engineering score",
    ),
  )

  // Where a chip was nudged aside, a hairline points back to its true reading.
  for (const item of plot.placed) {
    const drift = Math.hypot(item.x - item.trueX, item.y - item.trueY)
    if (drift < 3) continue
    guides.append(
      svgNode("line", {
        class: "plot-leader",
        x1: item.x + half,
        y1: item.y + halfHeight,
        x2: item.trueX + half,
        y2: item.trueY + halfHeight,
      }),
      svgNode("circle", { class: "plot-true", cx: item.trueX + half, cy: item.trueY + halfHeight, r: 1.6 }),
    )
  }

  if (plot.unscored.length) {
    guides.append(
      svgNode(
        "text",
        { class: "plot-name", x: plot.margin.left, y: plot.shelfY - 10 },
        `Not reviewed · ${plot.unscored.length}`,
      ),
    )
  }

  // The frontier: the runs that were the best available at their price. Drawn
  // through the chips so the line and the frames agree.
  const spot = new Map(plot.placed.map((item) => [item.runId, item]))
  const ordered = [...plot.scored].sort((a, b) => metrics[state.metric].of(a) - metrics[state.metric].of(b))
  let best = -Infinity
  const frontier = ordered.filter((result) => {
    const score = engineeringScore(result)
    if (score <= best) return false
    best = score
    return true
  })

  if (frontier.length > 1) {
    const path = frontier
      .map((result, index) => {
        const at = spot.get(result.runId)
        return `${index ? "L" : "M"}${at.x + half} ${at.y + halfHeight}`
      })
      .join(" ")
    guides.append(
      svgNode("path", { class: "plot-frontier-casing", d: path }),
      svgNode("path", { class: "plot-frontier", d: path }),
    )
  }

  elements.plotGuides.replaceChildren(...guides.childNodes)
  elements.plotGuides.setAttribute("viewBox", `0 0 ${width} ${height}`)
  renderPlotRead(frontier)
}

function renderPlotRead(frontier) {
  const cheapest = frontier[0]
  const bestRun = frontier[frontier.length - 1]
  if (!cheapest || !bestRun) {
    elements.plotRead.textContent = ""
    return
  }

  const metric = metrics[state.metric]
  elements.plotRead.replaceChildren(
    document.createTextNode("The line joins each run that was the best available at its price. "),
    node("b", "", `${cheapest.modelLabel} ${cheapest.effortLabel}`),
    document.createTextNode(
      ` scores ${scoreLabel(engineeringScore(cheapest))} for ${metric.short(cheapest)}; `,
    ),
    node("b", "", `${bestRun.modelLabel} ${bestRun.effortLabel}`),
    document.createTextNode(
      ` tops out at ${scoreLabel(engineeringScore(bestRun))} for ${metric.short(bestRun)}. Every run below the line was matched or beaten by a cheaper one.`,
    ),
  )
}

/* The overlays are plain sections rather than dialogs, so whatever sits behind
   the topmost one is made inert. Without this, tab walks straight out of an
   open overlay into the seventeen frames underneath it. */
function updateInert() {
  const loupeOpen = !elements.loupe.hidden
  const briefOpen = !elements.brief.hidden
  const pickerOpen = !elements.picker.hidden
  const reviewOpen = !elements.review.hidden
  const sheetBlocked = loupeOpen || briefOpen || pickerOpen

  document.querySelector(".leader").inert = sheetBlocked
  elements.sheet.inert = sheetBlocked
  elements.loupe.inert = briefOpen || pickerOpen || reviewOpen
  elements.brief.inert = pickerOpen
  elements.review.inert = pickerOpen
}

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, iframe, summary, [tabindex]:not([tabindex="-1"])'

/* inert stops tab reaching what is behind an overlay, but tab still runs off
   the end of the overlay into the document, so the topmost layer wraps. Frames
   inside the loupe are deliberately included: you should be able to tab into
   the app you are testing. */
function trapFocus(event) {
  if (event.key !== "Tab") return
  const layer = [elements.picker, elements.review, elements.brief, elements.loupe].find(
    (element) => !element.hidden && !element.inert,
  )
  if (!layer) return

  const stops = [...layer.querySelectorAll(FOCUSABLE)].filter(
    (element) => !element.hidden && element.offsetParent !== null,
  )
  if (!stops.length) return

  const first = stops[0]
  const last = stops[stops.length - 1]
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

document.addEventListener("keydown", trapFocus)

function mark(runId, scroll = true) {
  state.marked = runId
  for (const [id, frame] of frameNodes) frame.classList.toggle("marked", id === runId)
  if (scroll && window.innerWidth < 900) {
    frameNodes.get(runId)?.scrollIntoView({ behavior: "smooth", block: "center" })
  }
}

function setArrangement(next) {
  state.arrangement = next
  elements.sheet.dataset.arrangement = next
  elements.plotLegend.hidden = next !== "plot"
  elements.sheetHint.style.opacity = next === "plot" ? "0" : "1"
  for (const button of document.querySelectorAll("[data-arrangement]")) {
    const on = button.dataset.arrangement === next
    button.classList.toggle("on", on)
    button.setAttribute("aria-pressed", String(on))
  }
  layout()
  syncUrl()
}

/* ── the loupe ───────────────────────────────────────────────────────────── */

function readoutItem(term, detail) {
  const row = node("div")
  row.append(node("dt", "", term), node("dd", "", detail))
  return row
}

function openLoupe(runId) {
  const result = resultById(runId)
  if (!result) return
  state.loupe = runId
  state.against = null
  mark(runId, false)
  elements.loupe.hidden = false
  renderLoupe()
  updateInert()
  elements.loupe.querySelector("#loupe-close").focus({ preventScroll: true })
  syncUrl()
}

function closeLoupe() {
  state.loupe = null
  state.against = null
  elements.loupe.hidden = true
  closeReview()
  updateInert()
  elements.frameA.removeAttribute("src")
  elements.frameB.removeAttribute("src")
  frameNodes.get(state.marked)?.focus({ preventScroll: true })
  syncUrl()
}

function renderLoupe() {
  const result = resultById(state.loupe)
  if (!result) return
  const against = resultById(state.against)
  const score = engineeringScore(result)
  const credits = estimatedCredits(result)
  const plan = currentPlan()

  elements.loupeSetting.textContent = `${result.effortLabel} effort · ${statusWord(result)}`
  elements.loupeName.textContent = result.modelLabel

  elements.loupeReadout.replaceChildren(
    readoutItem("Engineering", score == null ? "Not reviewed" : `${scoreLabel(score)}/100`),
    readoutItem("Credits", credits == null ? "N/A" : `≈ ${credits.toFixed(1)}`),
    readoutItem("Of plan", credits == null ? "—" : `${((credits / plan.allowance) * 100).toFixed(2)}%`),
    readoutItem("Time", durationLabel(result.durationMs)),
    readoutItem("Tokens", countLabel(totalTokens(result.usage))),
    readoutItem("Source", result.codeStats?.sourceLines ? `${compact.format(result.codeStats.sourceLines)} lines` : "N/A"),
  )

  if (elements.frameA.getAttribute("src") !== result.previewPath) elements.frameA.src = result.previewPath
  elements.frameA.title = `${result.modelLabel} at ${result.effortLabel} effort, running`

  elements.stage.dataset.split = String(Boolean(against))
  elements.stage.dataset.viewport = state.viewport
  elements.paneB.hidden = !against
  elements.paneALabel.hidden = !against
  elements.paneALabel.textContent = `${result.modelLabel} · ${result.effortLabel}`

  if (against) {
    elements.paneBLabel.textContent = `${against.modelLabel} · ${against.effortLabel}`
    if (elements.frameB.getAttribute("src") !== against.previewPath) elements.frameB.src = against.previewPath
    elements.frameB.title = `${against.modelLabel} at ${against.effortLabel} effort, running`
  } else {
    elements.frameB.removeAttribute("src")
  }

  renderDelta(result, against)

  elements.reviewOpen.hidden = !result.engineeringReview
  elements.holdAgainst.textContent = against ? "Change comparison" : "Hold against…"

  elements.runNote.textContent = result.notes ?? "No notes were recorded for this run."
  elements.runFacts.replaceChildren(
    pair("Model", result.model),
    pair("Effort", result.effort),
    pair("Input tokens", countLabel(result.usage?.inputTokens)),
    pair("Cached input", countLabel(result.usage?.cachedInputTokens)),
    pair("Output tokens", countLabel(result.usage?.outputTokens)),
    pair(
      "Reasoning tokens",
      result.usage?.reasoningOutputTokens == null
        ? "Not reported separately"
        : countLabel(result.usage.reasoningOutputTokens),
    ),
    pair("Source files", countLabel(result.codeStats?.sourceFiles)),
    pair("Source lines", countLabel(result.codeStats?.sourceLines)),
    pair("Agent", result.runner?.version ?? result.codexVersion),
    pair("Turns", result.runner?.turns == null ? "—" : String(result.runner.turns)),
    pair("Cost", result.costUsd == null ? "Estimated from rate card" : `$${result.costUsd.toFixed(2)}`),
    pair("Captured", dateLabel(result.recordedAt)),
    pair("Capture plan", result.subscription?.planLabel),
    pair("Estimated credits", credits == null ? "—" : `≈ ${credits.toFixed(2)}`),
    pair("Against", `${plan.label} · ${compact.format(plan.allowance)} credits`),
    pair("Rate card", "14 Jul 2026"),
    pair("Build", result.verification?.buildSucceeded ? "Succeeded" : "Failed"),
    pair(
      "Review",
      result.engineeringReview
        ? result.engineeringReview.status === "failed"
          ? "Unavailable"
          : `${scoreLabel(result.engineeringReview.totalScore)} / 100`
        : "Not reviewed",
    ),
  )

  elements.runLinks.replaceChildren()
  for (const [label, url] of [
    ["Generated source", result.sourceUrl],
    ["Final response", result.finalUrl],
    ["Review record", result.reviewUrl],
  ]) {
    if (!url) continue
    const link = node("a", "", `${label} ↗`)
    link.href = url
    link.target = "_blank"
    link.rel = "noreferrer"
    elements.runLinks.append(link)
  }
}

function statusWord(result) {
  if (result.status === "published") return "captured run"
  if (result.status === "failed") return "failed run"
  if (result.status === "default") return "hand-built control"
  return "interface sample"
}

function renderDelta(result, against) {
  if (!against) {
    elements.delta.hidden = true
    return
  }

  const scoreA = engineeringScore(result)
  const scoreB = engineeringScore(against)
  const creditsA = estimatedCredits(result)
  const creditsB = estimatedCredits(against)

  const rows = [
    ["Engineering", scoreA == null || scoreB == null ? "N/A" : `${signed(scoreB - scoreA)} pts`],
    ["Credits", creditsA == null || creditsB == null ? "N/A" : signed(creditsB - creditsA)],
    ["Time", signed((against.durationMs - result.durationMs) / 60000)],
    ["Source", `${signed((against.codeStats?.sourceLines ?? 0) - (result.codeStats?.sourceLines ?? 0), 0)} lines`],
  ]

  elements.delta.replaceChildren(
    ...rows.map(([term, detail]) => {
      const item = node("span")
      item.append(node("small", "", `right minus left · ${term}`), node("strong", "", detail))
      return item
    }),
  )
  elements.delta.hidden = false
}

/* ── the review ──────────────────────────────────────────────────────────── */

function openReview() {
  const result = resultById(state.loupe)
  if (!result?.engineeringReview) return
  renderReview(result)
  elements.review.hidden = false
  updateInert()
  elements.review.querySelector("#review-close").focus({ preventScroll: true })
}

function closeReview() {
  elements.review.hidden = true
  updateInert()
}

function renderReview(result) {
  const review = result.engineeringReview
  const failed = review.status === "failed"
  elements.reviewKicker.textContent = `${result.modelLabel} · ${result.effortLabel} effort`
  elements.reviewTitle.textContent = failed ? "No score recorded" : "The review"

  const verdict = node("section", "verdict")
  const copy = node("div")
  copy.append(
    node(
      "p",
      "",
      failed
        ? review.failure?.message ?? "The frozen one-attempt review did not complete."
        : review.recommendation ?? "No recommendation was recorded.",
    ),
  )
  const scoreBlock = node("div", `verdict-score${failed ? " none" : ""}`)
  scoreBlock.append(
    node("b", "", failed ? "N/A" : scoreLabel(review.totalScore)),
    node("span", "", failed ? "unavailable" : "out of 100"),
  )
  verdict.append(copy, scoreBlock)

  const sections = [verdict]

  if (!failed) {
    const anatomy = node("section", "review-section")
    anatomy.append(node("h3", "", "Where the score came from"))
    const categories = node("div", "categories")
    for (const category of review.categories ?? []) {
      const item = node("div", "category")
      const bar = node("i")
      bar.style.setProperty("--fill", `${Math.max(0, Math.min(100, category.score * 25))}%`)
      item.append(
        node("b", "", categoryLabels[category.id] ?? category.label ?? category.id),
        node("em", "", `${category.score}/4 · ${category.weight}%`),
        bar,
      )
      categories.append(item)
    }
    anatomy.append(categories)
    sections.push(anatomy)

    const findingsSection = node("section", "review-section")
    findingsSection.append(node("h3", "", `${review.findings?.length ?? 0} evidenced findings`))
    const findings = node("div", "findings")
    for (const finding of review.findings ?? []) {
      const item = node("article", `finding ${finding.severity}`)
      const head = node("div", "finding-head")
      head.append(node("b", "", finding.title), node("span", "", finding.severity))
      const where = node("code", "", `${finding.file}:${finding.lineStart}${
        finding.lineEnd !== finding.lineStart ? `–${finding.lineEnd}` : ""
      }`)
      item.append(head, where, node("p", "", finding.evidence), node("p", "fix", `Fix: ${finding.remediation}`))
      findings.append(item)
    }
    if (!findings.childElementCount) findings.append(node("p", "", "No actionable findings were recorded."))
    findingsSection.append(findings)
    sections.push(findingsSection)

    const perspective = node("section", "review-section")
    perspective.append(node("h3", "", "Strengths and remaining risks"))
    const grid = node("div", "two-up")
    for (const [heading, items] of [["Strengths", review.strengths], ["Risks", review.risks]]) {
      const column = node("div")
      column.append(node("h4", "", heading))
      const list = node("ul")
      for (const item of items ?? []) list.append(node("li", "", item))
      column.append(list)
      grid.append(column)
    }
    perspective.append(grid)
    sections.push(perspective)
  }

  const meta = node("dl", "review-meta")
  meta.append(
    pair("Reviewer", `${review.reviewer?.model ?? "Unknown"} · ${review.reviewer?.effort ?? "Unknown"}`),
    pair("Reviewed", dateLabel(review.reviewedAt)),
    pair("Instrument", review.benchmarkId ?? "Unknown"),
  )
  sections.push(meta)

  elements.reviewBody.replaceChildren(...sections)
}

/* ── picker ──────────────────────────────────────────────────────────────── */

function closePicker() {
  elements.picker.hidden = true
  updateInert()
  elements.holdAgainst.focus({ preventScroll: true })
}

function openPicker() {
  const current = resultById(state.loupe)
  elements.pickerGrid.replaceChildren(
    ...state.results
      .filter((result) => result.runId !== current?.runId)
      .map((result) => {
        const button = node("button")
        button.type = "button"
        if (result.thumbnailPath) {
          const image = document.createElement("img")
          image.src = assetPath(result.thumbnailPath)
          image.alt = ""
          image.loading = "lazy"
          button.append(image)
        }
        const score = engineeringScore(result)
        button.append(
          node("b", "", `${result.modelLabel} · ${result.effortLabel}`),
          node(
            "em",
            "",
            `${score == null ? "not reviewed" : `${scoreLabel(score)}/100`} · ${metrics.credits.short(result)}`,
          ),
        )
        button.addEventListener("click", () => {
          state.against = result.runId
          elements.picker.hidden = true
          updateInert()
          renderLoupe()
          syncUrl()
        })
        return button
      }),
  )
  elements.picker.hidden = false
  updateInert()
  elements.pickerGrid.querySelector("button")?.focus({ preventScroll: true })
}

/* ── the brief ───────────────────────────────────────────────────────────── */

function renderPlans() {
  elements.plans.replaceChildren(
    ...plans.map((plan) => {
      const button = node("button")
      button.type = "button"
      button.classList.toggle("on", plan.id === state.planId)
      button.setAttribute("aria-pressed", String(plan.id === state.planId))
      button.append(
        node("b", "", plan.label),
        node("em", "", `${compact.format(plan.allowance)} credits · ${plan.messages}`),
      )
      button.addEventListener("click", () => {
        state.planId = plan.id
        renderPlans()
        if (state.loupe) renderLoupe()
        syncUrl()
      })
      return button
    }),
  )
}

function setBrief(open) {
  elements.brief.hidden = !open
  updateInert()
  elements.briefOpen.setAttribute("aria-expanded", String(open))
  if (open) elements.brief.querySelector("#brief-close").focus({ preventScroll: true })
  else elements.briefOpen.focus({ preventScroll: true })
}

/* ── url ─────────────────────────────────────────────────────────────────── */

function syncUrl() {
  const url = new URL(window.location.href)
  const set = (key, value) => (value ? url.searchParams.set(key, value) : url.searchParams.delete(key))
  set("f", state.loupe)
  set("vs", state.against)
  set("roll", state.rolls.length > 1 && state.roll !== state.rolls[0].id ? state.roll : null)
  set("a", state.arrangement === "plot" ? "plot" : null)
  set("m", state.metric === "credits" ? null : state.metric)
  set("plan", state.planId === "5x" ? null : state.planId)
  history.replaceState(null, "", url)
}

/* ── keyboard ────────────────────────────────────────────────────────────── */

function moveMark(columnStep, rowStep) {
  const current = resultById(state.marked) ?? state.results[0]
  let column = state.models.findIndex((item) => item.model === current.model)
  let row = state.efforts.findIndex((item) => item.effort === current.effort)
  if (column === -1 || row === -1) {
    column = 0
    row = 0
  }
  column = Math.max(0, Math.min(state.models.length - 1, column + columnStep))
  row = Math.max(0, Math.min(state.efforts.length - 1, row + rowStep))

  const next = state.results.find(
    (result) => result.model === state.models[column].model && result.effort === state.efforts[row].effort,
  )
  if (!next) return
  mark(next.runId)
  frameNodes.get(next.runId)?.focus({ preventScroll: true })
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!elements.picker.hidden) return closePicker()
    if (!elements.review.hidden) return closeReview()
    if (!elements.brief.hidden) return setBrief(false)
    if (state.loupe) return closeLoupe()
    return
  }

  if (event.target.closest("input, textarea, select")) return
  if (state.loupe || !elements.brief.hidden || !elements.picker.hidden) return

  const moves = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }
  if (moves[event.key]) {
    event.preventDefault()
    moveMark(...moves[event.key])
    return
  }
  if (event.key === "Enter" && state.marked) openLoupe(state.marked)
  if (event.key.toLowerCase() === "g") setArrangement("grid")
  if (event.key.toLowerCase() === "p") setArrangement("plot")
})

/* ── wiring ──────────────────────────────────────────────────────────────── */

for (const button of document.querySelectorAll("[data-arrangement]")) {
  button.addEventListener("click", () => setArrangement(button.dataset.arrangement))
}

for (const button of document.querySelectorAll("[data-metric]")) {
  button.addEventListener("click", () => {
    state.metric = button.dataset.metric
    for (const item of document.querySelectorAll("[data-metric]")) {
      const on = item.dataset.metric === state.metric
      item.classList.toggle("on", on)
      item.setAttribute("aria-pressed", String(on))
    }
    refreshMarkings()
    layout()
    syncUrl()
  })
}

for (const button of document.querySelectorAll("[data-viewport]")) {
  button.addEventListener("click", () => {
    state.viewport = button.dataset.viewport
    for (const item of document.querySelectorAll("[data-viewport]")) {
      const on = item.dataset.viewport === state.viewport
      item.classList.toggle("on", on)
      item.setAttribute("aria-pressed", String(on))
    }
    elements.stage.dataset.viewport = state.viewport
  })
}

document.querySelector("#loupe-close").addEventListener("click", closeLoupe)
document.querySelector("#review-close").addEventListener("click", closeReview)
document.querySelector("#picker-close").addEventListener("click", closePicker)
document.querySelector("#brief-close").addEventListener("click", () => setBrief(false))
elements.briefOpen.addEventListener("click", () => setBrief(true))
elements.reviewOpen.addEventListener("click", openReview)
elements.holdAgainst.addEventListener("click", openPicker)
elements.picker.addEventListener("click", (event) => {
  if (event.target === elements.picker) closePicker()
})

let resizeFrame = 0
window.addEventListener("resize", () => {
  window.cancelAnimationFrame(resizeFrame)
  resizeFrame = window.requestAnimationFrame(layout)
})

/* ── start ───────────────────────────────────────────────────────────────── */

async function loadPrompt() {
  const response = await fetch(assetPath("./prompt.txt"))
  const text = await response.text()
  elements.promptBody.replaceChildren(
    ...text
      .split(/\n\s*\n/)
      .map((block) => block.replace(/^#\s+.*\n?/, "").replaceAll("**", "").replaceAll("`", "").trim())
      .filter(Boolean)
      .map((block) => node("p", "", block)),
  )
}

// Declaration order is display order: the original roll leads, and anything
// added later that is not listed here falls in behind them.
const rollLabels = {
  "weekender-v1": "Codex",
  "weekender-claude-v1": "Claude Code",
}

function rollOrder(id) {
  const index = Object.keys(rollLabels).indexOf(id)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

const onAxisRuns = () =>
  state.results.filter((result) => result.model !== "default" && !offAxisEfforts.has(result.effort))

function selectRoll(id, { rebuild = true } = {}) {
  state.roll = id
  state.results = state.all.filter((result) => result.benchmarkId === id)

  const runs = onAxisRuns()
  state.models = uniqueBy(
    runs.map(({ model, modelLabel }) => ({ model, modelLabel })),
    (item) => item.model,
  ).sort((a, b) => modelOrder.indexOf(a.model) - modelOrder.indexOf(b.model))
  state.efforts = uniqueBy(
    runs.map(({ effort, effortLabel }) => ({ effort, effortLabel })),
    (item) => item.effort,
  ).sort((a, b) => effortOrder.indexOf(a.effort) - effortOrder.indexOf(b.effort))

  elements.frameCount.textContent = String(runs.length)
  renderRollNotes()
  for (const button of document.querySelectorAll("[data-roll]")) {
    const on = button.dataset.roll === id
    button.classList.toggle("on", on)
    button.setAttribute("aria-pressed", String(on))
  }

  if (!rebuild) return
  state.loupe = null
  state.against = null
  elements.loupe.hidden = true
  updateInert()
  buildFrames()
  layout()
  mark(runs[0]?.runId ?? state.results[0]?.runId, false)
  syncUrl()
}

function renderRollNotes() {
  const block = document.querySelector("#roll-notes-block")
  const list = document.querySelector("#roll-notes")
  const title = document.querySelector("#roll-notes-title")
  if (!block || !list) return

  const notes = state.rollNotes.get(state.roll) ?? []
  block.hidden = notes.length === 0
  title.textContent = `About the ${rollLabels[state.roll] ?? state.roll} roll`
  list.replaceChildren(
    ...notes.map((note, index) => {
      const item = node("li")
      item.append(node("span", "", String(index + 1).padStart(2, "0")), document.createTextNode(` ${note}`))
      return item
    }),
  )
}

function renderRollSwitch() {
  const host = document.querySelector("#roll-switch")
  if (!host || state.rolls.length < 2) return
  host.hidden = false
  host.replaceChildren(
    ...state.rolls.map((roll) => {
      const button = node("button", roll.id === state.roll ? "on" : "")
      button.type = "button"
      button.dataset.roll = roll.id
      button.textContent = roll.label
      button.setAttribute("aria-pressed", String(roll.id === state.roll))
      button.addEventListener("click", () => selectRoll(roll.id))
      return button
    }),
  )
}

async function initialize() {
  const response = await fetch(assetPath("./results-manifest.json"))
  if (!response.ok) throw new Error(`Could not load the sheet (${response.status})`)
  const manifest = await response.json()

  state.all = manifest.results.sort((a, b) => {
    const byModel = modelOrder.indexOf(a.model) - modelOrder.indexOf(b.model)
    return byModel || effortOrder.indexOf(a.effort) - effortOrder.indexOf(b.effort)
  })

  if (!state.all.length) {
    elements.sheetHint.textContent = "No runs have been published yet."
    return
  }

  // Each roll is its own experiment. They share a prompt and a starter but not
  // a harness, so they are never mixed on one sheet — you switch between them.
  state.rollNotes = new Map((manifest.rolls ?? []).map((roll) => [roll.id, roll.notes ?? []]))
  state.rolls = uniqueBy(
    state.all.map((result) => ({
      id: result.benchmarkId,
      label: rollLabels[result.benchmarkId] ?? result.benchmarkId,
    })),
    (item) => item.id,
  ).sort((a, b) => rollOrder(a.id) - rollOrder(b.id))

  const query = new URLSearchParams(window.location.search)
  state.metric = ["credits", "duration", "tokens"].includes(query.get("m")) ? query.get("m") : "credits"
  state.planId = plans.some((plan) => plan.id === query.get("plan")) ? query.get("plan") : "5x"

  const requested = state.rolls.find((roll) => roll.id === query.get("roll"))
  const opening = state.all.find((result) => result.runId === query.get("f"))
  selectRoll(requested?.id ?? opening?.benchmarkId ?? state.rolls[0].id, { rebuild: false })

  renderRollSwitch()
  buildFrames()
  renderPlans()
  layout()

  const openingInRoll = resultById(query.get("f"))
  mark(openingInRoll?.runId ?? onAxisRuns()[0]?.runId ?? state.results[0].runId, false)
  if (query.get("a") === "plot") setArrangement("plot")
  else setArrangement("grid")

  for (const item of document.querySelectorAll("[data-metric]")) {
    const on = item.dataset.metric === state.metric
    item.classList.toggle("on", on)
    item.setAttribute("aria-pressed", String(on))
  }

  if (openingInRoll) {
    state.against = resultById(query.get("vs"))?.runId ?? null
    openLoupe(openingInRoll.runId)
  }

  // Fonts change the gutter measurements, so lay out once more when they land.
  document.fonts?.ready.then(layout)
}

await Promise.all([initialize(), loadPrompt()])
