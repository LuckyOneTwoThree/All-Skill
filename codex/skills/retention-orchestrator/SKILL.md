---
name: retention-orchestrator
description: "Use when reducing churn rate or improving user engagement. User retention orchestrator dispatching retention-management, achieving closed loop from churn prevention to user re-engagement. Keywords: user retention, churn prediction, tiered operations, engagement, retention strategy, retention-management, prevent churn, re-engage."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Retention"
  type: "orchestrator"
  version: "7.0"
  trigger_examples:
    - "User churn is severe"
    - "Improve user retention rate"
    - "Run churn prediction"
    - "Design tiered operations strategy"
---

# User Retention Orchestrator

## Core Principles

**Retention is the core metric measuring product value**

Acquisition determines the starting point, retention determines the endpoint. If users are unwilling to stay, it means the product has not yet delivered sufficient value. The root cause of retention problems is always a value problem, not an operations problem.

## Orchestration Philosophy

1. **Warning and operations executed as one**: retention-management internally builds churn prediction to identify high-risk users first, then designs differentiated operations strategies based on risk tiers
2. **Warning data drives operations priority**: Churn risk level directly determines operations resource allocation and intervention intensity

## Orchestrator Positioning Statement

This orchestrator's current Pipeline contains only 1 sub-Skill (retention-management), making it a degenerate orchestrator after merge simplification. Reasons for retaining this orchestrator:

1. **Unified entry point**: Provides a standardized invocation entry for the user retention sub-module; upper-level orchestrators (e.g., product-launch-orchestrator) do not need to know about internal sub-Skill merge history
2. **Stage summary**: Forces generation of stage summary documents (post_pipeline), ensuring sub-module outputs are auditable and traceable
3. **Exception handling**: Provides unified exception handling strategies and degradation plans; sub-Skill's own degradation strategies do not override orchestrator-level exception interception
4. **Human decision points**: Provides human decision gates before and after sub-Skill execution, ensuring key conclusions are confirmed by humans before passing downstream

If this sub-module needs to expand into a multi-stage Pipeline in the future, this orchestrator can directly add stages without modifying upper-level orchestrator invocation methods.

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: retention-orchestrator
version: 7.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/retention-orchestrator.md

stages:
  - id: phase-1
    name: "Churn Prediction & User Segmentation"
    depends_on: []
    skills: [retention-management]
    gate:
      condition: "Churn prediction model constructed and user segmentation complete"
      fail_action: "Optimize model or supplement training data"
```

## Stage Execution Plan

#### Invoke retention-management

```
Invoke: ${retention-management}
Input:
  user_behavior_data: data analytics platform (activity logs)
  churn_history: data analytics platform (churn records)
  user_account_data: user system (account info)
  user_lifecycle_stage: provided by user (optional, registration time, key milestones)
Output: output/pm-growth/retention-management/
Validation: Churn definition distinguishes free/paid/enterprise users; prediction model accuracy > 75%; intervention strategies match risk levels; intervention effect tracking includes ROI calculation; user segmentation covers complete lifecycle (new/growing/mature/dormant/churned); health score includes activity, feature depth, payment intent, social engagement; operations strategies match user tiers; outreach content personalized
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-growth/ |
| Summary output path | output/phase-reports/pm-growth/retention-orchestrator.md |

Downstream connections:
  primary: revenue-orchestrator (retention optimization complete, optimize payment conversion)
  alternatives:
    - target: growth-orchestrator
      reason: Retention is not the current bottleneck, revert to growth diagnosis for re-evaluation
      condition: Retention rate optimization results below expectations or retention not the current biggest bottleneck
    - target: experiment-orchestrator
      reason: Retention strategy needs A/B testing validation
      condition: Churn intervention plan changes need quantitative verification
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Retention management complete | retention-management output file generated and non-empty | Optimize model or supplement training data |
| Stage summary generated | output/phase-reports/pm-growth/retention-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Intervention strategy confirmation | Churn prediction and tiered operations strategy generation complete | Confirm intervention strategy priorities, outreach methods, and resource allocation |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Churn prediction model accuracy < 75% | Reduce application scope, use only for high-confidence user warnings; mark "model needs optimization", suggest supplementing training data |
| User behavior data insufficient for segmentation | Use simplified segmentation model (only active/dormant/churned 3 tiers), mark "segmentation needs refinement" |
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
| PRD | pm-design related orchestrator | PRD is the business basis for retention-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (retention-management...) produce domain-specific outputs |

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
