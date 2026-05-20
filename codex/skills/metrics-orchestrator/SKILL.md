---
name: metrics-orchestrator
description: "Use when building a product metrics system. Product metrics design orchestrator dispatching metrics-system, tracking-plan, metrics-dashboard. Keywords: metrics design, metrics system, tracking plan, dashboard configuration, data metrics, KPI design, data tracking."
metadata:
  module: "Product Metrics Design"
  sub-module: "Metrics Design"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me design a metrics system"
    - "Plan data tracking"
    - "Design product KPIs"
    - "Configure a data dashboard"
---

# Product Metrics Design Orchestrator

## Core Principles

Use data to reduce guesswork in decisions, not to justify decisions with data.

## Orchestration Philosophy

1. **Metrics first, tracking follows**: The metrics system is the foundation of metrics design; tracking and dashboards must be derived from the metrics system, not built in reverse
2. **Gates at every level, confirm at each stage**: Each stage's output must pass human confirmation before passing downstream, preventing errors from amplifying along the chain
3. **Data closed loop, bidirectional validation**: Metrics -> tracking -> dashboard form a closed loop; upstream changes must propagate along the chain, downstream feedback must trace back to the source

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: metrics-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-metrics-design/metrics-orchestrator.md

stages:
  - id: phase-1
    name: "Metrics System"
    depends_on: []
    skills: [metrics-system]
    gate:
      condition: "North Star metric selected by human"
      fail_action: "North Star metric must be a human decision; AI only provides candidates and analysis"

  - id: phase-2
    name: "Tracking Plan"
    depends_on: [phase-1]
    skills: [tracking-plan]
    gate:
      condition: "Tracking plan reviewed by human"
      fail_action: "Business logic correctness and privacy compliance must be confirmed by human"

  - id: phase-3
    name: "Dashboard Configuration"
    depends_on: [phase-1, phase-2]
    skills: [metrics-dashboard]
    gate:
      condition: "Dashboard layout confirmed by human"
      fail_action: "Layout reasonableness and alert thresholds need human review"
```

## Stage Execution Plan

#### Invoke metrics-system

```
Invoke: ${metrics-system}
Input:
  product_context: provided by user (product type, North Star metric, OKR, business model)
  existing_metrics: provided by user (existing metrics list)
Output: output/pm-metrics-design/metrics-system/metric_system.json
Validation: North Star vanity metric check passed, L1-L2 decomposition complete (3-5 L2s per L1), action metrics trackable
Mode: AI->Human
```

#### Invoke tracking-plan

```
Invoke: ${tracking-plan}
Input:
  PRD: provided by user (product feature descriptions, user flows, core paths, business rules)
  metric_system: output/pm-metrics-design/metrics-system/metric_system.json
  existing_tracking: provided by user (existing tracking list)
Output: output/pm-metrics-design/tracking-plan/
Validation: Naming convention passed, core path coverage >= 90%, PRD consistency >= 90%
Mode: AI->Human
```

#### Invoke metrics-dashboard

```
Invoke: ${metrics-dashboard}
Input:
  metric_system: output/pm-metrics-design/metrics-system/metric_system.json
  tracking_plan: output/pm-metrics-design/tracking-plan/tracking_plan.json
  user_roles: provided by user
  dashboard_platform: provided by user
Output: output/pm-metrics-design/metrics-dashboard/
Validation: All metrics assigned to dashboards, each dashboard has at least 1 widget, North Star metric appears on strategic dashboard, alert rules configured completely
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-metrics-design/ |
| Summary output path | output/phase-reports/pm-metrics-design/metrics-orchestrator.md |

Downstream connections:
  primary: monitoring-orchestrator (metrics design complete, implement metrics system and tracking plan as monitoring configuration)
  alternatives:
    - target: design-orchestrator
      reason: Metrics design reveals PRD feature gaps, need to backtrack and supplement
      condition: PRD feature coverage < 80% found during metrics system design
    - target: growth-orchestrator
      reason: Metrics system ready, initiate growth strategy
      condition: Product is live and metrics system is ready, need to drive growth
  special_cases:
    - target: tracking-plan
      reason: Only need to generate tracking plan, no full metrics design required
      condition: Metrics system already established, only need to update tracking plan

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Metrics system complete | North Star metric selected by human | North Star metric must be a human decision; AI only provides candidates and analysis |
| Tracking plan complete | Tracking plan reviewed by human | Business logic correctness and privacy compliance must be confirmed by human |
| Dashboard complete | Dashboard layout confirmed by human | Layout reasonableness and alert thresholds need human review |
| Stage summary generated | output/phase-reports/pm-metrics-design/metrics-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| North Star metric selection | AI recommends 3 candidate North Star metrics | Human selects final metric |
| Tracking plan review | AI generates tracking plan | Human reviews business logic and privacy compliance |
| Dashboard layout confirmation | AI configures dashboard | Human confirms layout and alert thresholds |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Sub-Skill output validation failed | Pause downstream stage execution, output validation failure report, prompt human to fix and retry current stage |
| Stage gate not passed | Block flow progression, mark unmet gate conditions, wait for human decision before continuing |
| Upstream input file missing | Execute per sub-Skill degradation strategy, record degradation info, mark degradation impact scope in final output |
| Sub-Skill execution timeout | Mark timed-out stage, output completed partial results, prompt human to check input data quality |
| Human decision timeout without response | Pause flow, preserve current stage state, support resuming from checkpoint after human returns |
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
| PRD | pm-design related orchestrator | PRD is the business basis for metrics-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (metrics-system, metrics-dashboard, tracking-plan...) produce domain-specific outputs |

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
