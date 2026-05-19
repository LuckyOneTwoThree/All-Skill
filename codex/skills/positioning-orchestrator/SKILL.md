---
name: positioning-orchestrator
description: "Use when determining product positioning or evaluating differentiation strategy. Orchestrates positioning-strategy. Keywords: product positioning, differentiation, value curve, competitive strategy, brand positioning, market positioning, competitive advantage. This is a passthrough orchestrator with 1 sub-Skill; upper orchestrators may call positioning-strategy directly."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Product Positioning & Differentiation"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me determine product positioning"
    - "Analyze differentiation advantages"
    - "Write a positioning statement"
    - "Evaluate competitive strategy"
---

# Product Positioning & Differentiation Orchestrator

## Core Principles

The essence of positioning is choosing who not to serve.

1. **Trade-offs made explicit** -- Every positioning choice must simultaneously declare "what we choose to do" and "what we choose not to do"; trade-offs cannot be implicit
2. **Competitive anchor driven** -- Differentiation assessment must use competitors as reference anchors, avoiding self-positioning detached from competitive context
3. **Exclusivity equals commitment** -- Once an exclusion decision is made, it is treated as a product commitment and must be incorporated as a hard constraint in subsequent requirement filtering

## Orchestrator Positioning Statement

This orchestrator's current Pipeline contains only 1 sub-Skill (positioning-strategy), making it a degenerate orchestrator after merge simplification. Reasons for retaining this orchestrator:

1. **Unified entry point**: Provides a standardized call entry for the product positioning & differentiation sub-module. Upper-level orchestrators (e.g., product-launch-orchestrator) do not need to know the internal sub-Skill merge history
2. **Stage summary**: Forces generation of a stage summary document (post_pipeline), ensuring sub-module output is auditable and traceable
3. **Exception handling**: Provides unified exception handling strategy and degradation plans. Sub-Skill degradation strategies do not override orchestrator-level exception interception
4. **Human decision points**: Provides human decision gates before and after sub-Skill execution, ensuring critical conclusions are human-confirmed before passing downstream

If this sub-module needs to expand into a multi-stage Pipeline in the future, this orchestrator can add stages directly without modifying upper-level orchestrator call patterns.

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

This orchestrator is a passthrough orchestrator, responsible for providing a unified entry point, stage summary, and exception handling. Upper-level orchestrators (e.g., product-launch-orchestrator) can directly call the positioning-strategy sub-Skill without going through this orchestrator.

## Pipeline Definition

```yaml
pipeline: positioning-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/positioning-orchestrator.md

stages:
  - id: phase-1
    name: "Positioning Strategy"
    skills: [positioning-strategy]
    gate:
      condition: "positioning-strategy output file has been generated"
      fail_action: "Handle per sub-Skill failure reason; escalate to human if necessary"
```

## Stage Execution Plan

### Stage 1: Positioning Strategy

- **Invoke Skill**: `positioning-strategy`
- **Input parameters**:
  - `value_fit`: Value proposition fit results (from output/pm-strategy/business-value-fit/evaluation_report.json)
  - `competitor_analysis`: Competitor analysis data (from market-competitor-analysis -> competitor-analysis.json)
  - `user_insight`: User insights (from user-research-user-modeling)
  - `bmc`: Value proposition (from output/pm-strategy/business-model-canvas/bmc.json, optional)
  - `capability_assessment`: Self-capability assessment (optional, user provided)
- **Output**: `output/pm-strategy/positioning-strategy/positioning-strategy.json` + `output/pm-strategy/positioning-strategy/positioning-strategy.md`
- **Validation**: Output file generated and content complete
- **Execution Mode**: AI->Human AI recommends, human approves

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-strategy/ |
| Summary output path | output/phase-reports/pm-strategy/positioning-orchestrator.md |

Next Steps:
  primary: planning-orchestrator (positioning strategy complete, formulate OKR and roadmap)
  alternatives:
    - target: business-orchestrator
      reason: Positioning results affect business model, need to backtrack and adjust
      condition: When positioning strategy is inconsistent with existing business model
    - target: design-orchestrator
      reason: Positioning is clear and planning is complete, proceed directly to design
      condition: When OKR and roadmap have been completed in prior stages
  special_cases: []

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| Output file generated | positioning-strategy.json has been generated | Handle per sub-Skill failure reason; escalate to human if necessary |
| Stage summary generated | output/phase-reports/pm-strategy/positioning-orchestrator.md generated and all 6 structure items non-empty | Supplement missing structure items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Positioning statement final selection | positioning-strategy generates candidate positioning statements | Human selects final positioning statement |
| Exclusion decision | positioning-strategy provides exclusion recommendations | Human decides which users not to serve |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Sub-Skill execution failure | Pause orchestration, output failure diagnostics, request human intervention for repair and retry |
| Upstream data missing | Annotate missing data items, fill with reasonable assumptions (annotate confidence <= 0.3), continue execution and highlight annotations in output |
| Key decision point not human-confirmed | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| Stage summary generation failure | Generate partial summary based on completed sub-Skill output, mark missing items as "data missing", do not block orchestration completion |
