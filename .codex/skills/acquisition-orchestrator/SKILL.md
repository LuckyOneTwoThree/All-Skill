---
name: acquisition-orchestrator
description: "Use when evaluating acquisition channels or optimizing the acquisition funnel. User acquisition orchestrator dispatching acquisition-analysis, achieving closed loop from channel evaluation to funnel optimization. Keywords: user acquisition, acquisition channels, funnel optimization, channel evaluation, acquisition strategy, acquisition-analysis, user acquisition, acquisition."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Acquisition"
  type: "orchestrator"
  version: "7.0"
  trigger_examples:
    - "Evaluate acquisition channels"
    - "Optimize the acquisition funnel"
    - "How to acquire new users"
    - "Acquisition cost is too high"
---

# User Acquisition Orchestrator

## Core Principles

**Let the right users find the product**

User acquisition is not a traffic game, but a matching game. The goal is not more users, but more right users -- those who can derive value from the product while creating value for the product.

## Orchestration Philosophy

1. **Channel evaluation and funnel optimization executed as one**: acquisition-analysis internally completes channel evaluation first then executes funnel optimization, ensuring optimization plans are supported by channel-level data
2. **Data flows between steps**: Channel evaluation output directly drives funnel optimization input, no orchestrator relay needed

## Orchestrator Positioning Statement

This orchestrator's current Pipeline contains only 1 sub-Skill (acquisition-analysis), making it a degenerate orchestrator after merge simplification. Reasons for retaining this orchestrator:

1. **Unified entry point**: Provides a standardized invocation entry for the user acquisition sub-module; upper-level orchestrators (e.g., product-launch-orchestrator) do not need to know about internal sub-Skill merge history
2. **Stage summary**: Forces generation of stage summary documents (post_pipeline), ensuring sub-module outputs are auditable and traceable
3. **Exception handling**: Provides unified exception handling strategies and degradation plans; sub-Skill's own degradation strategies do not override orchestrator-level exception interception
4. **Human decision points**: Provides human decision gates before and after sub-Skill execution, ensuring key conclusions are confirmed by humans before passing downstream

If this sub-module needs to expand into a multi-stage Pipeline in the future, this orchestrator can directly add stages without modifying upper-level orchestrator invocation methods.

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: acquisition-orchestrator
version: 7.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/acquisition-orchestrator.md

stages:
  - id: phase-1
    name: "Channel Evaluation & Funnel Optimization"
    depends_on: []
    skills: [acquisition-analysis]
    gate:
      condition: "Channel evaluation complete and funnel optimization plan generated"
      fail_action: "Supplement missing channel data or extend analysis period"
```

## Stage Execution Plan

#### Invoke acquisition-analysis

```
Invoke: ${acquisition-analysis}
Input:
  channel_data: provided by user (19 acquisition channel data)
  historical_performance: provided by user (historical channel performance)
  channel_config_cost: provided by user (channel configuration and costs)
  historical_optimization: provided by user (optional, historical optimization experiment data)
Output: output/pm-growth/acquisition-analysis/
Validation: Channel evaluation covers scale, conversion rate, ROI, quality 4 dimensions; channel grading criteria clear (primary/test/observe); ROI calculation considers user LTV not single revenue; evaluation covers 19 acquisition channel types; funnel stages defined completely (exposure -> activation/payment); drop-off reasons distinguish awareness/trust/action/value 4 barrier types; optimization plans include expected improvement and implementation difficulty assessment; A/B test design includes decision rules and termination conditions
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-growth/ |
| Summary output path | output/phase-reports/pm-growth/acquisition-orchestrator.md |

Downstream connections:
  primary: activation-orchestrator (acquisition optimization complete, improve new user conversion)
  alternatives:
    - target: growth-orchestrator
      reason: Acquisition is not the current bottleneck, revert to growth diagnosis for re-evaluation
      condition: Acquisition channel ROI below industry benchmark or optimization results below expectations
    - target: experiment-orchestrator
      reason: Acquisition strategy needs A/B testing validation
      condition: Acquisition plan involves channel strategy changes needing quantitative verification
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Acquisition analysis complete | acquisition-analysis output file generated and non-empty | Supplement missing channel data or extend analysis period |
| Stage summary generated | output/phase-reports/pm-growth/acquisition-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Channel strategy confirmation | Channel evaluation complete, resource allocation adjustment needed | Confirm primary, test, and observe channel classification and budget allocation |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Severe channel data deficiency (> 50% channels without data) | Pause channel evaluation, require user to supplement core channel data before continuing |
| Funnel optimization A/B test insufficient sample | Extend test period until sample meets threshold, or relax significance requirement to 90% confidence |
| Sub-Skill output validation not passed | Roll back to current stage and re-execute, max 1 retry; if still fails, mark as exception and escalate to human |
| Upstream/downstream data format incompatible | Map fields per downstream sub-Skill input Schema and fill default values, record mapping relationships |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestration completion |

## Standalone Usage Input Acquisition Strategy

### Standalone Trigger Scenario Identification

When this orchestrator is invoked directly (not through a parent orchestrator), it is considered a standalone trigger scenario. Typical trigger methods:
- User directly requests capabilities within this orchestrator's domain
- Triggered as an independent skill by external systems
- Parent orchestrator not executed, but user only needs this orchestrator's capability

### Required Input Acquisition Strategy

| Required Input | Priority: Read from output/ | Fallback: Get from user conversation | Last Resort: AI knowledge base inference |
|---------------|---------------------------|-------------------------------------|---------------------------------------|
| PRD (prd.md) | Read output/pm-design/design-prd/prd.md | Ask user for PRD document or verbal requirements | Infer requirements from user description (low confidence, mark "PRD is AI-inferred") |
| project_dir | — | Ask user for project directory path | Cannot infer, user must provide |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest user execute upstream orchestrators in the following priority:

| Missing Input | Suggested Upstream Orchestrator | Description |
|--------------|-------------------------------|-------------|
| PRD | pm-design related orchestrator | PRD is the business basis for acquisition-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (acquisition-analysis...) produce domain-specific outputs |

Backtracking suggestion output format:
```
Critical input missing detected, suggest executing upstream orchestrator first:
1. [Priority] pm-design related orchestrator -> Produces PRD
Continue with AI-inferred values? (Inferred values confidence <=0.3, outputs require additional human review)
```

### Standalone Usage Gate

When triggered standalone, must pass the following additional checks before executing Pipeline:

| Gate Item | Check Content | Failure Handling |
|-----------|--------------|-----------------|
| PRD existence | prd.md or equivalent requirements document available | Block execution, suggest user provide PRD |
| project_dir validity | User provided valid project directory path | Block execution, user must provide valid project_dir |
| Input confidence assessment | All required input acquisition methods determined, overall confidence >=0.5 | When confidence <0.5, force human confirmation whether to continue execution |

Gate execution order: PRD existence -> project_dir validity -> Input confidence assessment
