# Codex One-Prompt Build Arena

See what model and reasoning effort actually change.

This is a public, visual comparison of complete apps produced by Codex from the exact same prompt and exact same starter repository. It is inspired by the one-prompt experience of app builders such as Lovable: submit one product idea, let the agent work without follow-up guidance, and judge the final build it returns.

The benchmark runs are performed and captured by this repository's maintainers. Public visitors do not run Codex themselves. They browse a set of precomputed, versioned results that are already stored in the repository and deployed as static previews.

The benchmark is not primarily a test suite or an abstract model score. The finished app is the benchmark result.

The engineering review companion in [`benchmark/code-review-v1.md`](benchmark/code-review-v1.md) is frozen after three blinded calibration passes. The reviewer returns evidenced findings, while the harness derives category and total scores deterministically.

## Current status

- `weekender-v1` prompt and starter are frozen.
- The static comparison site includes one permanent hand-built Default plus captured GPT-5.5, Luna, Terra, and Sol results.
- The local runner has passed an end-to-end no-model dry run, including desktop and mobile screenshot capture.
- Light-, Medium-, High-, and Extra-High-effort runs for GPT-5.5, Luna, Terra, and Sol have been published.
- Frozen engineering reviews are published for GPT-5.5, Luna, and Sol at Light; all four Medium and High runs; and Luna, Terra, and Sol at Extra High. Terra Light is preserved as unavailable after the reviewer reached its fixed time limit. GPT-5.5 Extra High remains unavailable because the fixed reviewer was at capacity.

## The experience

The public site has one page:

1. Read the shared benchmark prompt.
2. Move the model and reasoning-effort sliders.
3. Use the finished app for the current selection in one large live preview.
4. Open a full-screen A/B workspace to use two live builds side by side, with a compact A/B switch on mobile.
5. Share the exact comparison through its URL.
6. Explore the value map to compare engineering score with estimated credits, duration, or tokens.
7. Open the evidence sheet for category scores, findings, strengths, risks, and remediation details.
8. Cycle the 1x / 5x / 20x plan control to recalculate estimated plan usage for the selected run.
9. Keep tokens, duration, estimated plan usage, and source lines visible below the preview.
10. Use the matrix below to scan every captured configuration, with token and engineering-review breakdowns on hover or keyboard focus.
11. Read the data-driven summary and qualified recommendations beneath the matrix.
12. Expand the run details for the exact token breakdown, Codex version, final response, and source code.

No Codex account, subscription, API key, or local setup is required to view the results. The public page never starts a model run and has no prompt-submission form in the first version.

Example comparisons:

- Sol with Light effort versus Sol with High effort
- Luna with Medium effort versus Sol with Medium effort
- a faster configuration versus a more expensive configuration

The visitor decides which result is better by using and looking at the apps. Engineering reviews and automated checks provide supporting facts, but they do not replace the preview or score visual design.

## What stays identical

Every run receives:

- the exact same one-shot prompt
- the exact same clean starter repository
- the same tools and permissions
- the same time and network policy
- no follow-up messages, corrections, or human steering

Each run starts in a new session and must finish with a runnable build.

## How results are produced and published

Maintainers run the matrix locally in this repository:

1. Copy the frozen starter into a clean temporary workspace.
2. Start one fresh `codex exec --json` run with a fixed model and effort.
3. Capture the final response, usage event, duration, and generated source.
4. Build the generated app into static assets.
5. Capture desktop and mobile screenshots.
6. Sanitize the public metadata so it contains no credentials, account data, private paths, or hidden reasoning.
7. Store the source, static preview, screenshots, and metadata under a permanent run ID.
8. Add the run to the public manifest and commit it to the repository.

The comparison site reads only the committed manifest and files. Hosting can therefore use GitHub Pages with no backend and no runtime model cost.

A published run is immutable. If Codex, the prompt, starter, or run policy changes, a new run ID or benchmark version is created rather than replacing the old evidence.

## Frozen first prompt

The first prompt should leave enough room for product, design, and engineering decisions to become visible. It should describe the desired outcome without prescribing the layout or implementation.

The exact versioned prompt is [`prompt/weekender-v1.md`](prompt/weekender-v1.md). It asks Codex to build a polished responsive group weekend-planning app, using only the installed dependencies and no external services. The run must finish with `npm run check` passing and receives no follow-up questions or human steering.

Why this prompt works:

- It produces an immediately understandable visual result.
- It allows different information architecture and visual-design choices.
- It requires several connected interactions, not just a landing page.
- It exposes product judgment through features and states the model chooses.
- It is self-contained and does not require accounts, APIs, or private data.
- A visitor can evaluate it within a few minutes.

Changing this prompt, the starter, or the policy creates a new benchmark version rather than silently changing `weekender-v1`.

## What the comparison page shows

The live build is the largest element on the page. Supporting information should remain secondary.

For each result:

- live interactive preview in an isolated frame
- desktop and mobile screenshot
- exact model identifier
- reasoning effort
- run duration
- input tokens
- cached input tokens
- output tokens
- reasoning output tokens
- observed subscription usage before and after, when available
- Codex version and run date
- final Codex response
- link to the generated source and patch
- frozen engineering review score, category breakdown, and evidenced findings when available

If a run fails to produce a working app, its error or broken preview is still published. A failed attempt is part of the comparison rather than something silently discarded.

Useful controls:

- model slider
- effort slider
- desktop, tablet, and mobile viewport buttons
- clickable model/effort result matrix
- full-screen A/B comparison with shareable URLs
- engineering-score value map with credits, duration, and token views
- run-level review evidence sheet
- show prompt
- show run details

## Quality is visible, not assumed

The project exists because “newer model” and “more effort” do not automatically tell a user what the resulting app will feel like.

Visitors should be able to directly compare:

- visual polish
- product decisions
- information hierarchy
- interaction design
- responsiveness
- completeness
- error and empty states
- consistency
- apparent bugs
- whether extra effort produced a meaningful improvement

Optional community voting can ask one simple question:

> Which build would you keep?

Votes must be blind until after a choice is made so the model name does not bias the decision.

## Usage reporting

`codex exec --json` provides machine-readable token usage for a run, including input, cached-input, output, and reasoning-output tokens.

Plan usage is estimated from the [Codex token-based credit rate card](https://help.openai.com/en/articles/20001106-codex-rate-card), checked July 14, 2026: uncached input, cached input, and output tokens are priced separately for each model. The public page compares that estimate with a measured 3k / 15k / 60k allowance reference for Plus, Pro 5x, and Pro 20x. Approximate message ranges are context, not fixed quotas; actual consumption changes with the model, token mix, task complexity, codebase size, and conversation length.

Example:

```text
Plan label: Pro 5x
Usage window: weekly
Remaining before: 82%
Remaining after: 79%
Observed change: 3 percentage points
```

Token totals and estimated credit usage are displayed beside the preview; neither is presented as a quality score.

## Run matrix

Start with a small, understandable matrix rather than every possible combination:

| Model | Efforts |
| --- | --- |
| GPT-5.5 | Light, Medium, High, Extra High |
| Luna | Light, Medium, High, Extra High |
| Terra | Light, Medium, High, Extra High |
| Sol | Light, Medium, High, Extra High |

Run each combination at least three times eventually, because model output varies. For the first public prototype, one run per combination is sufficient to prove the experience.

Max can be added later as a separate high-compute option. Ultra should be labeled as a multi-agent configuration rather than treated as another ordinary effort level.

## Repository shape

```text
benchmark/
  v1.json
prompt/
  weekender-v1.md
starter/
  package-lock.json
  package.json
  src/
runs/
  <model>/<effort>/<run-id>/
    source/
    preview/
      index.html
      assets/
    metadata.json
    code-review.json
    final.md
    screenshot-desktop.png
    screenshot-mobile.png
site/
  index.html
  app.js
  styles.css
scripts/
  build-site.mjs
  capture-screenshots.mjs
  run-benchmark.mjs
  run-benchmark.sh
.github/workflows/
  pages.yml
```

`scripts/build-site.mjs` scans committed run metadata, builds `_site/results-manifest.json`, and copies every generated preview below a unique URL for isolated iframes.

Raw JSONL can be retained locally for verification, but the public repository should contain only a sanitized event summary. Raw agent traces can contain private machine details or information that is unnecessary for comparing the result.

## Run record

```json
{
  "schemaVersion": 1,
  "benchmarkId": "weekender-v1",
  "runId": "gpt-5-6-sol-high-20260714T120000Z",
  "status": "published",
  "model": "exact-model-id",
  "effort": "medium",
  "codexVersion": "record-at-run-time",
  "durationMs": 0,
  "usage": {
    "inputTokens": 0,
    "cachedInputTokens": 0,
    "outputTokens": 0,
    "reasoningOutputTokens": 0
  },
  "subscription": {
    "planLabel": "Pro 5x",
    "windowLabel": "weekly",
    "remainingBeforePercent": null,
    "remainingAfterPercent": null,
    "observedChangePercent": null
  }
}
```

## Maintainer workflow

Install the small root-level tooling dependency and verify the complete capture pipeline without calling a model:

```bash
npm ci
npm run dry-run
```

Capture a real run:

```bash
./scripts/run-benchmark.sh \
  --model gpt-5.6-sol \
  --effort high \
  --record-subscription \
  --plan-label "Pro 5x" \
  --window-label weekly
```

The runner:

1. installs the frozen starter from its lockfile;
2. creates a clean Git repository;
3. invokes one ephemeral `codex exec --json` task with user configuration and rules ignored;
4. stores raw JSONL and stderr only in ignored private directories;
5. builds the generated app and preserves failures without retrying;
6. publishes sanitized metadata, source, preview, final response, and screenshots under `runs/`.

Use `CODEX_BIN=/path/to/codex` when a non-default CLI installation is required. Screenshot capture uses local Chrome or Chromium; set `CHROME_BIN` when it is installed in a non-standard location.

Assemble the static gallery locally:

```bash
npm run build:site
python3 -m http.server 4173 --directory _site
```

Run a frozen engineering-review batch once:

```bash
npm run review:light
npm run review:medium
npm run review:high
npm run review:xhigh
```

The review harness blinds builder identity, rebuilds and exercises the source, validates every cited file and line range, derives scores from finding severity, and refuses to overwrite an existing frozen result.

## GitHub Pages

The Pages workflow assembles and deploys `_site` on every push to `main`. In the GitHub repository settings, choose **GitHub Actions** as the Pages source once; no server, database, API key, or runtime model access is used by the public page.

## Fair-run rules

1. Freeze the prompt and starter before generating comparison results.
2. Reset the starter completely before every run.
3. Use a fresh Codex task for every run.
4. Do not send follow-up prompts or repair failed builds manually.
5. Record failures as results; do not silently rerun until an attractive app appears.
6. Pin and publish the Codex version and exact configuration.
7. Give every configuration the same permissions and runtime limits.
8. Preserve the complete raw run output for auditability.
9. Never publish authentication data or account identifiers.

Raw run output in rule 8 may be kept in a private local archive. The public repository receives the generated source, preview, final response, screenshots, configuration, and sanitized usage summary.

## Product references

Codex documents model and reasoning controls in [model selection](https://learn.chatgpt.com/docs/models). Machine-readable run events and token counts are available through [`codex exec --json`](https://learn.chatgpt.com/docs/non-interactive-mode). Plan descriptions and relative limits are documented under [Codex pricing](https://learn.chatgpt.com/docs/pricing).
