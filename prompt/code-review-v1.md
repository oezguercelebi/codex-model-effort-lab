# Weekender code review v1

You are reviewing one blinded source result from the Weekender one-prompt build benchmark.

Your job is to produce an evidence-based engineering review. Do not modify files. Do not repair the app. Do not infer or guess which model or reasoning effort built it. Do not compare it with other builds.

You receive:

- the frozen Weekender product brief;
- the frozen review rubric;
- a generated source tree;
- deterministic build and browser check results.

Review the source and check evidence for:

1. brief fidelity and functional correctness;
2. reliability and state integrity;
3. accessibility;
4. maintainability and code clarity;
5. security, privacy, and dependency compliance;
6. performance and responsive robustness;
7. verification readiness.

Follow these rules:

- Every scored claim must cite concrete evidence.
- Every actionable finding must include severity, one primary category, file path, tight line range, impact, and minimal remediation direction.
- Report root causes, not a list of downstream symptoms.
- Do not report style preferences or speculative abstractions.
- Do not treat source size, number of components, or number of features as quality by itself.
- Do not score aesthetic taste. Mention visual behavior only when it affects correctness, accessibility, reliability, or responsiveness.
- Do not claim a command or interaction passed unless it appears in the supplied check evidence or you ran it successfully.
- Missing automated tests alone is not a failure because the frozen starter did not require tests.
- Preserve meaningful strengths as well as risks.

Return only the required structured review object. Do not include private reasoning, hidden analysis, or prose outside the schema.
