# Orchestrator Shared Protocol

> This file defines the orchestration protocol that all orchestrators uniformly follow. Each orchestrator's SKILL.md references this protocol to avoid duplicate maintenance.

## Orchestration Protocol

You are an orchestrator. Your responsibility is to **dispatch sub-Skills for execution by stage**, not to proxy-execute sub-Skill logic. Strictly follow this protocol:

### Invocation Rules

1. **Explicit Invocation**: Use the `Invoke` mechanism to call sub-Skills, pass input data, and receive output results
2. **No Proxy Execution**: Do not read a sub-Skill's SKILL.md to substitute for execution; do not infer a sub-Skill's internal logic on your own
3. **Contract-Driven**: Focus only on sub-Skill input contracts, output contracts, and validation conditions; do not concern yourself with internal implementation
4. **State Passing**: Pass the current stage's output as the next stage's input, transmitting data via file paths
5. **Validate Before Advancing**: Only advance to the next stage after the current stage's output has passed validation
6. **Stage Summary (Mandatory)**: After all Pipeline stages have completed execution, you **must immediately** execute the stage summary action defined in `post_pipeline` to generate a summary document. This is not optional; if the stage summary is not generated, the orchestrator execution is considered incomplete.

### Context Management

- After each sub-Skill invocation completes, retain only **output file paths** and **key conclusion summaries**
- Write detailed output to the `output/{domain-path}/{skill-name}/` directory
- If context approaches the limit, prioritize retaining current stage content and the names of sub-Skills in pending stages

### Stage Summary

After all sub-Skills have completed execution, the orchestrator must generate a stage summary document, written to `output/phase-reports/{module}/{orchestrator-name}.md`, containing the following structure:

1. **Execution Overview**: Orchestrator name and version, execution time, sub-Skill execution status (success/failure/degraded)
2. **Key Findings**: Core output summary for each sub-Skill (1-3 items), cross-sub-Skill insights
3. **Decision Record**: Human decision points and decision results, AI automatic decisions and rationale
4. **Deliverables List**: All output file paths and content summaries, deliverable quality assessment (whether validation passed)
5. **Risks & Follow-ups**: Items that failed validation, items executed with degradation, recommended follow-up actions
6. **Downstream Handoff**: Which downstream orchestrators can consume this orchestrator's outputs, recommended next orchestrators. Structure contains three layers:
   - **primary** (1): The most recommended downstream orchestrator; must be an orchestrator-type Skill, cannot point to itself
   - **alternatives** (2-3): Alternative downstream orchestrators, prioritizing orchestrator-type Skills; condition uses [trigger scenario] + [judgment basis] format
   - **special_cases** (0-1): Special-case recommended sub-Skills (non-orchestrator); condition must note "no full orchestration pipeline needed"

### Unified Stage Gate Standards

Orchestrator stage gates should only validate the following 3 types of conditions, without going deep into sub-Skill internal fields:

| Gate Type | Validation Content | Example |
|-----------|-------------------|---------|
| Output Existence | Output file has been generated and is non-empty | "insight-analysis output file generated" |
| Top-Level Structural Completeness | JSON top-level required fields exist | "prd.json contains features/pages/entities/user_flows" |
| Human Decision Confirmation | Key decision points have received human confirmation | "PRD human confirmation passed" |

Sub-Skill internal field-level validation (e.g., "JTBD three-layer Jobs extracted", "Feature Matrix updated") should be completed within the sub-Skill's own quality checks; the orchestrator does not concern itself with these.

### Stage Summary Execution Directive (post_pipeline)

After all business stages have completed execution, **must immediately** generate the stage summary document:

```
Action: Generate Stage Summary
Input:
  All sub-Skill outputs: output/{domain-path}/
  Human decision records: Human decision points and results from this execution round
Output: output/phase-reports/{module}/{orchestrator-name}.md
Validation: Stage summary document generated, all 6 structural sections (Execution Overview / Key Findings / Decision Record / Deliverables List / Risks & Follow-ups / Downstream Handoff) are non-empty
Downstream Handoff: (Defined per this protocol's "Downstream Handoff" three-layer structure)
Mode: AI
```

[GATE] **Stage Gate**: Stage summary document generated and all 6 structural sections are non-empty -> Not passed: supplement missing structural items and regenerate

Each orchestrator only needs to provide the following parameterized information in its SKILL.md; the execution directive body follows this protocol:

```markdown
### Stage Summary (post_pipeline)

Follows the [orchestrator-protocol.md](relative-path) stage summary protocol.

| Parameter | Value |
|-----------|-------|
| Sub-Skill output path | output/{domain-path}/ |
| Summary output path | output/phase-reports/{module}/{orchestrator-name}.md |

Downstream Handoff:
  primary: {target-orchestrator} ({reason})
  alternatives: {alternative-orchestrator-list}
  special_cases: {special-cases}
```

### Common Exception Handling Items

The following exception handling items apply to all orchestrators; individual orchestrators do not need to redefine them:

| Exception Type | Handling Strategy |
|----------------|-------------------|
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs; mark missing items as "data missing"; do not block orchestrator completion |
| Key decision point not confirmed by human | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| Upstream data missing | Mark missing data items, fill with reasonable assumptions (mark confidence ≤0.3), continue execution and highlight in output |
| All upstream data completely missing | Mark "all data missing" status, output minimal template (metadata and empty structures only), set overall confidence to 0.3, force human confirmation on whether to continue. After human confirmation, generate based on user-provided information and AI knowledge base inference; all inferred content marked with confidence≤0.5 and needs_human_validation:true |

### Common Stage Gate Items

The following gate items apply to all orchestrators; individual orchestrators do not need to redefine them:

| Gate | Condition | Failed Handling |
|------|-----------|-----------------|
| Stage summary generated | output/phase-reports/{module}/{orchestrator-name}.md generated and all 6 structural sections are non-empty | Supplement missing structural items and regenerate |
