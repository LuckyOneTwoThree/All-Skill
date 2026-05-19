---
name: activation-orchestrator
description: "Use when identifying Aha Moments or designing Onboarding flows. User activation orchestrator dispatching activation-aha/onboarding. Keywords: user activation, Aha Moment, Onboarding, new user onboarding, beginner guidance, activation rate."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Activation"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Find the Aha Moment"
    - "Design onboarding flow"
    - "Improve user activation rate"
    - "Optimize Onboarding"
---

# User Activation Orchestrator

## Core Principles

**Aha Moment is the starting point of user retention**

The essence of user activation is helping users reach the Aha Moment as quickly as possible -- the moment when users feel the product's core value. Activation without an Aha Moment is just process completion, not value delivery.

## Orchestration Philosophy

1. **Aha Moment anchors Onboarding**: Identify the Aha Moment first, then design the Onboarding path with the Aha Moment as the endpoint, ensuring guidance has a clear target
2. **Data flows from identification to design**: Aha Moment arrival rate and path data directly drive Onboarding flow design

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: activation-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/activation-orchestrator.md

stages:
  - id: phase-1
    name: "Aha Moment Identification"
    depends_on: []
    skills: [activation-aha]
    gate:
      condition: "At least 1 Aha Moment candidate behavior produced, with retention lift and arrival rate data"
      fail_action: "Expand behavior search scope"

  - id: phase-2
    name: "Onboarding Design"
    depends_on: [phase-1]
    skills: [activation-onboarding]
    gate:
      condition: "Onboarding paths and content designed for each user segment"
      fail_action: "Supplement segment data or extend analysis period"
```

## Stage Execution Plan

#### Invoke activation-aha

```
Invoke: ${activation-aha}
Input:
  retention_data: analysis-retention -> retention_analysis.json
  user_behavior_data: provided by user
  user_segment_data: provided by user (optional)
Output: output/pm-growth/activation-aha/
Validation: Aha candidates pass correlation screening (>= 0.5) and significance testing; arrival rate analysis includes time distribution and path analysis; shortest path identification includes friction point analysis; Onboarding optimization recommendations directly executable
Mode: AI->Human
```

#### Invoke activation-onboarding

```
Invoke: ${activation-onboarding}
Input:
  onboarding_data: provided by user
  aha_moment_data: output/pm-growth/activation-aha/aha_moment.json
  user_segment_data: provided by user (optional)
Output: output/pm-growth/activation-onboarding/
Validation: Onboarding stages defined completely (welcome -> activation complete); drop-off analysis covers each stage and user segment; personalized guidance matches user segments; A/B test includes guardrail metrics (subsequent retention, payment conversion)
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-growth/ |
| Summary output path | output/phase-reports/pm-growth/activation-orchestrator.md |

Downstream connections:
  primary: retention-orchestrator (user activation optimization complete, prevent user churn)
  alternatives:
    - target: growth-orchestrator
      reason: Activation is not the current bottleneck, revert to growth diagnosis for re-evaluation
      condition: Activation rate optimization results below expectations or activation not the current biggest bottleneck
    - target: experiment-orchestrator
      reason: Activation strategy needs A/B testing validation
      condition: Onboarding plan changes need quantitative verification
  special_cases:
    - target: activation-aha
      reason: Only need to identify Aha Moment, no full activation orchestration required
      condition: Already have Onboarding plan, only need to confirm Aha Moment

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Aha Moment candidate identified | activation-aha-moment output file generated and non-empty | Expand behavior search scope |
| Onboarding strategy generated | activation-onboarding output file generated and non-empty | Supplement segment data or extend analysis period |
| Stage summary generated | output/phase-reports/pm-growth/activation-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Aha Moment confirmation | Aha Moment candidate identification complete | Confirm primary Aha Moment selection and Onboarding path design |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| No Aha Moment candidates pass screening threshold | Lower correlation threshold to 0.3 and re-search; if still no results, infer candidates based on product features, mark "pending data validation" |
| Onboarding data completely missing | Design generic Onboarding framework based on Aha Moment data, mark "pending Onboarding data supplementation" |
| Sub-Skill output validation not passed | Roll back to current stage and re-execute, max 1 retry; if still fails, mark as exception and escalate to human |
| Upstream/downstream data format incompatible | Map fields per downstream sub-Skill input Schema and fill default values, record mapping relationships |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestration completion |

## Changelog

- v1.0: Initial version
- v2.0: Description trigger word optimization
- v3.0: Orchestrator optimization -- task scheduling changed to stage execution plan, added sub-Skill execution protocol, scheduling rules changed to execution mode, stage gates and human decision points changed to tables
- v4.0: Execution steps replaced with orchestration philosophy, added exception handling table
- v5.0: Orchestration protocol optimization -- changed "read sub-Skill definition and proxy execute" to "use Skill tool for explicit invocation"; added Pipeline definition (YAML declarative execution graph); stage execution plan changed to invocation instruction format; scheduling rules merged into orchestration protocol
- v6.1: Stage summary enhancement -- Pipeline added post_pipeline definition; invocation rule 6 changed to mandatory; stage execution plan added stage summary execution instruction; stage gates added stage summary validation; exception handling added stage summary generation failure strategy
