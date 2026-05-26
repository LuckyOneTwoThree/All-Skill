---
name: iteration-orchestrator
description: "Use when planning iteration cycles or adjusting product priorities. Iteration decision commander orchestrating iteration-decision sub-skill. Keywords: iteration decision, Backlog optimization, priority adjustment, iteration retrospective, iteration planning, requirement restructuring, RICE scoring, iteration management. This is a pass-through orchestrator dispatching only 1 sub-skill (iteration-decision); upper-level orchestrators may also invoke iteration-decision directly."
metadata:
  module: "Product Monitoring and Iteration"
  sub-module: "Iteration Optimization"
  type: "orchestrator"
  version: "10.0"
  trigger_examples:
    - "Plan the next iteration"
    - "Adjust priorities"
    - "Optimize the Backlog"
    - "Conduct an iteration retrospective"
---

# Iteration Decision Commander

## Core Principles

**Data-driven priority decisions, balancing short-term fixes with long-term value**

Iteration is not simply queuing requirements but making optimal trade-offs under limited resources. Every priority adjustment is a balance between short-term fixes and long-term value; data is the basis for decisions, not the decision itself.

## Orchestration Philosophy

1. **Backlog optimization first, priority adjustment follows**: First optimize the Backlog to establish a clear priority baseline, then adjust based on trigger events, avoiding adjustments on a chaotic Backlog
2. **Retrospective conclusions loop back to Backlog**: Improvement suggestions from iteration retrospectives must flow back to Backlog optimization, forming a continuous improvement loop of "execution -> retrospective -> optimization"

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

This is a pass-through orchestrator; its responsibility is to provide a unified entry point, stage summary, and exception handling. Upper-level orchestrators may directly invoke the iteration-decision sub-skill without going through this orchestrator.

## Pipeline

```yaml
pipeline: iteration-orchestrator
version: 10.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/iteration-orchestrator.md

stages:
  - id: phase-1
    name: "Iteration Decision"
    depends_on: []
    skills: [iteration-decision]
    gate:
      condition: "iteration-decision output files generated"
      fail_action: "Handle per sub-skill failure reason, escalate to human if necessary"
```

## Stage Execution Plan

#### Invoke iteration-decision

```
Invoke: ${iteration-decision}
Input:
  requirement_pool: Project management system (requirement pool)
  tech_debt: Code quality platform (technical debt)
  monitoring_alerts: monitoring-pipeline -> alert data (optional)
  user_feedback: Feedback system (optional)
  current_sprint_plan: agile-sprint-planning -> sprint_plan
  trigger_event: Monitoring system/feedback system
  resource_constraints: planning-resource -> resource_plan
  change_request: User provided
  iteration_completion: agile-daily-sync -> daily_sync
  quality_metrics: Testing platform/CI/CD
  team_feedback: Retro tools (optional)
  monitoring_data: monitoring-pipeline (optional)
Output: output/pm-monitoring/iteration-decision/
Validation: Output files generated and content complete
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/pm-monitoring/ |
| Summary output path | output/phase-reports/pm-monitoring/iteration-orchestrator.md |

Downstream connections:
  primary: design-orchestrator (iteration decision completed, implement iteration requirement changes)
  alternatives:
    - target: release-orchestrator
      reason: Iteration decision is to release directly
      condition: When iteration decision is for emergency fix or minor version release
    - target: monitoring-orchestrator
      reason: Need to strengthen monitoring after iteration
      condition: When iteration involves core feature changes requiring enhanced post-release monitoring
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Output files generated | iteration-decision output generated | Handle per sub-skill failure reason, escalate to human if necessary |
| Stage summary generated | output/phase-reports/pm-monitoring/iteration-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Downstream Connections

- Iteration decision completed -> design-orchestrator (implement requirement changes)
- Emergency fix/minor version -> release-orchestrator
- Core feature changes need monitoring -> monitoring-orchestrator

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Iteration plan adjustment confirmation | iteration-decision priority adjustment plan generated | Confirm adjustment plan, resource reallocation, and risk acceptance |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Sub-skill execution failed | Roll back to current stage and re-execute, max 1 retry; if still fails, mark exception and escalate to human |
| Upstream data missing | Mark missing data items, fill with reasonable assumptions, continue execution and highlight in output |
| Stage summary generation failed | Generate partial summary based on completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |

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
| PRD | pm-design related orchestrator | PRD is the business basis for iteration-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (iteration-decision...) produce domain-specific outputs |

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
