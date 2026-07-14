# Weekender Code Review Benchmark v1

Status: **Draft. Do not run the full matrix until this document is approved and frozen.**

## Purpose

The build arena currently exposes visual quality, speed, tokens, credits, and source size. This companion benchmark evaluates the engineering quality hidden behind each preview.

It answers a narrower question:

> Given the same Weekender brief and starter, how correct, reliable, accessible, maintainable, secure, efficient, and verifiable is the source returned by each one-prompt build?

It does not score visual taste. Visitors continue to judge visual and product quality from the working previews.

## Core rules

1. Review the immutable source captured by `weekender-v1`.
2. Never repair, reformat, or modify the source under review.
3. Use one fresh reviewer task per build.
4. Use the same reviewer model, effort, prompt, tools, time limit, and environment for every build.
5. Hide builder model, builder effort, token usage, duration, credits, and other reviews from the reviewer.
6. Randomize review order with a recorded seed.
7. Run each review once. Preserve failures instead of retrying.
8. Require evidence for every scored claim and every finding.
9. Publish the final review and sanitized check output. Do not publish private reasoning traces.
10. Keep the review result separate from the human visual evaluation.

## Proposed reviewer configuration

The draft proposes:

- Reviewer: `gpt-5.6-sol`
- Reasoning effort: `xhigh`
- Attempts: one
- Follow-up messages: zero
- Maximum duration: 20 minutes
- Network: disabled
- Source access: read-only copy
- Builder identity: hidden

The reviewer configuration is not part of the builder comparison. It is a fixed measuring instrument. If the reviewer configuration changes after v1 is frozen, create a new review benchmark version.

## Inputs provided to the reviewer

The reviewer receives only:

- the frozen `weekender-v1` product brief;
- the frozen starter manifest and allowed dependency list;
- a blinded copy of one generated source tree;
- deterministic check results from the harness;
- the frozen review prompt and rubric.

The reviewer does not receive screenshots from other builds, model labels, effort labels, usage, cost, duration, final response, or matrix position.

## Deterministic checks

The harness runs these checks before the model review. Results are facts, not model opinions.

### Repository checks

- Compare dependencies with the frozen starter. Flag added packages, external services, or unexpected remote assets.
- Run `npm run check` in an isolated prepared workspace.
- Record exit code, duration, and the final sanitized output.
- Record source file count, source lines, and production asset size.

### Desktop and mobile acceptance checks

Use the same browser version at 1440 by 900 and 390 by 844. Verify:

1. Multiple destinations are visible and comparable.
2. Expected budget is visible.
3. Travel time is visible.
4. Voting is interactive and a vote changes visible state.
5. A winning destination and simple itinerary are visible or reachable.
6. The core experience works without sign-in or a backend.
7. Primary content remains usable without horizontal page overflow.
8. Interactive controls have accessible names and keyboard operation.
9. No uncaught browser errors occur during the defined path.

The harness stores pass, fail, not-applicable, and supporting evidence for every item.

## Review rubric

Each category receives an integer score from 0 to 4. The weighted total is out of 100.

| Score | Meaning |
| --- | --- |
| 4 | Strong implementation with no material issue found in this category. |
| 3 | Works well with minor, bounded issues. |
| 2 | Mixed implementation with at least one meaningful gap or fragile choice. |
| 1 | Major gaps, repeated problems, or a serious user-impacting issue. |
| 0 | Missing, nonfunctional, unsafe, or not reviewable. |

### 1. Brief fidelity and functional correctness, 30%

Review required product coverage and whether the implemented interactions behave consistently.

Evidence includes destination comparison, budget, travel time, voting, winner state, itinerary, realistic sample data, desktop and mobile behavior, and build results.

Do not award points for decorative volume. A smaller implementation can receive full credit when it completely and correctly serves the brief.

### 2. Reliability and state integrity, 15%

Review state transitions, derived values, stable identifiers, vote consistency, invalid states, edge cases, and resilience to repeated interaction.

Look for state that can contradict the UI, totals that drift, controls that stop responding, unstable rendering, and logic coupled to accidental array order.

### 3. Accessibility, 15%

Review semantic structure, heading order, landmarks, accessible names, keyboard access, visible focus, form and button semantics, image alternatives, contrast risks, and motion behavior.

Automated signals can support a finding, but they do not replace code and interaction evidence.

### 4. Maintainability and code clarity, 15%

Review whether architecture is proportional to the app, data and behavior are understandable, components have coherent responsibilities, repeated logic is controlled, types are useful, and future changes can be made safely.

Do not punish a single-file implementation solely for being small. Penalize it only when size or coupling creates a demonstrated maintenance risk.

### 5. Security, privacy, and dependency compliance, 10%

Review unsafe HTML injection, secret-like values, risky URL handling, insecure external links, unnecessary data collection, external service use, new dependencies, and violations of the frozen brief.

Do not invent backend threats for a static sample app. Score risks that are reachable or clearly enabled by the source.

### 6. Performance and responsive robustness, 10%

Review production asset weight, unnecessary rerenders, oversized media, layout overflow, expensive effects, remote asset fragility, and whether the implementation remains usable at the defined viewports.

Source size alone is not a performance finding.

### 7. Verification readiness, 5%

Review the available scripts, type checking, deterministic build, testability, and whether important behavior is structured so it can be verified.

The frozen starter does not require an automated test suite. Missing tests alone cannot score zero. Award higher scores when meaningful logic is isolated or covered and the reported checks are truthful.

## Finding severity

Every finding must use one severity:

- **Critical:** exploitable security issue, data loss, or a completely unusable core experience.
- **High:** a core requirement is broken, the build is not deployable, or a major accessibility barrier blocks use.
- **Medium:** a user-impacting defect, meaningful reliability problem, or demonstrated maintenance risk.
- **Low:** a bounded issue with limited impact.
- **Note:** an improvement idea or positive observation. Notes do not reduce the score.

Every critical, high, medium, or low finding requires:

- a concise title;
- one primary rubric category;
- file path and tight line range;
- concrete evidence or reproduction steps;
- user or maintainer impact;
- a minimal remediation direction.

Do not report formatting preferences, speculative abstractions, or generic best practices without demonstrated impact. Do not count the same root cause multiple times.

## Score guardrails

- If `npm run check` fails, correctness is 0 and the total score cannot exceed 39.
- If a core Weekender path is unusable, correctness cannot exceed 1 and the total score cannot exceed 59.
- A critical finding caps the total score at 39.
- A high finding caps its primary category at 1.
- Notes never change scores.
- Each category score must cite at least one supporting fact. Scores of 0, 1, or 4 require explicit justification.

The public page must show category scores and finding counts alongside the total. Never publish the total alone.

## Required review output

Each review is stored beside its target run with this shape:

```json
{
  "schemaVersion": 1,
  "reviewBenchmarkId": "weekender-code-review-v1",
  "targetRunId": "blinded-during-review",
  "reviewer": {
    "model": "gpt-5.6-sol",
    "effort": "xhigh",
    "codexVersion": "recorded-at-run-time"
  },
  "deterministicChecks": [],
  "findings": [],
  "categories": [
    {
      "id": "correctness",
      "score": 0,
      "weight": 30,
      "evidence": []
    }
  ],
  "rawWeightedScore": 0,
  "capsApplied": [],
  "totalScore": 0,
  "strengths": [],
  "risks": [],
  "recommendation": ""
}
```

The harness validates the schema, recalculates the weighted score, applies caps, and rejects missing evidence. The reviewer does not calculate its own final total.

## Calibration and freeze process

Before reviewing all 16 builds:

1. Choose four runs that cover low and high effort plus at least three builder models.
2. Blind their identities and randomize order with a recorded seed.
3. Run the proposed reviewer once on each.
4. Human-audit every finding for evidence, severity, duplication, and rubric fit.
5. Adjust ambiguous rubric language only. Do not tune the rubric to favor a preferred build.
6. Re-run the four calibration reviews from scratch.
7. Freeze the prompt, schema, reviewer configuration, acceptance path, and harness version.
8. Run all 16 builds once in a new seeded order.

Calibration reviews are discarded when the benchmark is frozen. Published reviews come only from the frozen configuration.

## Interpretation

The code review score is supporting evidence, not the winner.

The public comparison should keep four ideas separate:

- **Visual and product quality:** judged by people using the preview.
- **Engineering quality:** described by category scores and evidenced findings.
- **Efficiency:** measured with duration, tokens, and estimated credits.
- **Variance:** measured later with repeated runs of the same configuration.

A high code review score does not prove superior design. A visually strong build can still contain engineering risks. The useful comparison is the tradeoff among all four views.
