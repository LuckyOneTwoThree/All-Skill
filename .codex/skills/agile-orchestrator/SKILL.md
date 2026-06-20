---
name: agile-orchestrator
description: "Use when managing Sprint cycles or tracking agile execution. Agile execution commander orchestrating agile-sprint-planning, agile-daily-sync, and agile-review sub-skills. agile-review has merged retrospective-auto auto-retrospective capabilities. Keywords: agile execution, Sprint planning, daily standup, Sprint review, agile management, Sprint retrospective, iteration retrospective, agile development, retrospective report, auto-retrospective."
metadata:
  module: "Project Management and Execution"
  sub-module: "Agile Execution"
  type: "orchestrator"
  version: "9.0"
  trigger_examples:
    - "Plan a Sprint"
    - "Run a daily standup"
    - "Conduct a Sprint review"
    - "Manage agile iterations"
---

# Agile Execution Commander

## Core Principles

**Sprint is rhythm not goal, delivery is outcome not purpose**

The value of Sprint lies not in completing more Stories but in establishing a sustainable delivery rhythm. Delivery itself is not the purpose; delivering features valuable to users is. Do not sacrifice quality or ignore feedback just to complete the Sprint.

1. **Rhythm drives delivery** -- The core value of Sprint lies in establishing a predictable delivery rhythm, not maximizing output per Sprint. The orchestrator should ensure the completeness of each Sprint cycle, avoiding skipping reviews or retrospectives.
2. **Obstacles surface immediately** -- The orchestration focus of agile execution is to let problems surface in Daily Sync, not be discovered only at Review. The orchestrator should prioritize the flow speed of obstacle information.
3. **Retrospective drives improvement loop** -- Retrospective conclusions from each Sprint must be converted into concrete action items for the next Sprint. The orchestrator should ensure improvement suggestions are not forgotten but become input for the next round of planning. agile-review has merged retrospective-auto auto-retrospective capabilities, automatically collecting team feedback, identifying collaboration patterns, and generating retrospective insights.

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: agile-orchestrator
version: 9.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-project/agile-orchestrator.md

stages:
  - id: phase-1
    name: "Sprint Planning"
    depends_on: []
    skills: [agile-sprint-planning]
    gate:
      condition: "Sprint plan confirmed"
      fail_action: "Pause Sprint start, supplement planning"

  - id: phase-2
    name: "Daily Sync"
    depends_on: [phase-1]
    skills: [agile-daily-sync]
    gate:
      condition: "Daily Sync obstacles surfaced"
      fail_action: "Strengthen obstacle tracking and escalation mechanisms"

  - id: phase-3
    name: "Sprint Review and Retrospective"
    depends_on: [phase-1, phase-2]
    skills: [agile-review]
    gate:
      condition: "Sprint review and retrospective report completed"
      fail_action: "Supplement analysis or modify action items"
```

## Stage Execution Plan

#### Invoke agile-sprint-planning

```
Invoke: ${agile-sprint-planning}
Input:
  product_backlog: iteration-backlog-grooming -> prioritized_items
  sprint_goal: User provided (optional)
  team_capacity: planning-resource -> resource_plan
  sprint_days: User provided
Output: output/pm-project/agile-sprint-planning/
Validation: Sprint Goal clear with >= 1 quantifiable acceptance criteria; selected Stories total points <= team available capacity x 1.1; 100% cross-team dependencies identified
Mode: AI->Human
```

#### Invoke agile-daily-sync

```
Invoke: ${agile-daily-sync}
Input:
  sprint_backlog: agile-sprint-planning -> sprint_plan
  task_assignment: agile-sprint-planning -> sprint_plan
  last_daily_sync: agile-daily-sync -> daily_sync
  blocker_log: agile-daily-sync -> blocker_log (optional)
Output: output/pm-project/agile-daily-sync/
Validation: Progress summary covers all in-progress Stories; blockers have clear status and owners; risk flags timely and accurate
Mode: AI
```

#### Invoke agile-review

```
Invoke: ${agile-review}
Input:
  sprint_backlog: agile-sprint-planning -> sprint_plan.json
  completed_stories: User provided
  team_data: User provided (optional)
  stakeholder_feedback: User provided (optional)
  daily_sync_records: agile-daily-sync (optional)
  historical_sprint_data: User provided (optional)
  team_feedback: User provided (team feedback, for auto-retrospective)
Output: output/pm-project/agile-review/
Validation: Review covers all completed Stories; demo content corresponds to acceptance criteria; feedback categorized; improvement suggestions have clear owners; goal achievement consistent with data; action items actionable; retrospective report generated; retrospective insights generated and collaboration patterns identified
Mode: AI
```

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/pm-project/ |
| Summary output path | output/phase-reports/pm-project/agile-orchestrator.md |

Downstream connections:
  primary: release-orchestrator (Sprint completed and deliverables meet release standards, enter release process)
  alternatives:
    - target: agile-orchestrator
      reason: Enter next Sprint planning, continue iterating
      condition: When Sprint deliverables do not meet release standards and need continued iteration
    - target: monitoring-orchestrator
      reason: Sprint retrospective reveals need to strengthen monitoring
      condition: When retrospective reveals frequent production issues or insufficient monitoring coverage
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Sprint plan confirmed | agile-sprint-planning output files generated and non-empty | Pause Sprint start, supplement planning |
| Daily Sync obstacles surfaced | agile-daily-sync output files generated and non-empty | Strengthen obstacle tracking and escalation mechanisms |
| Sprint review and retrospective report completed | agile-review output files generated and confirmed by human | Supplement analysis or modify action items |
| Stage summary generated | output/phase-reports/pm-project/agile-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Sprint Goal confirmation | Sprint Planning completed | Confirm Sprint goal rationality and achievability |
| Sprint cancellation decision | Sprint goals repeatedly unmet or major scope change | Decide whether to cancel current Sprint |
| Retrospective action items confirmation | Sprint retrospective report generated | Confirm improvement action items and next Sprint suggestions |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Stage 1 sub-skill (Sprint planning) failed | Pause Sprint start, output failure reason, prompt user to supplement Backlog or adjust team capacity before retry |
| Upstream data missing (e.g., Backlog, team capacity) | Generate draft Sprint plan with placeholder data, mark low confidence, prompt user to supplement before re-planning |
| Key decision point not confirmed by human (e.g., Sprint Goal) | Pause entering next stage, continue waiting for confirmation, escalate reminder after timeout |
| All upstream data missing | Mark "all data missing" status, output minimal template (metadata and empty structure only), set overall confidence to 0.3, force human confirmation on whether to continue. After human confirmation, generate based on user-provided information and AI knowledge base inference, all inferred content marked with confidence <= 0.5 and needs_human_validation: true |
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
| PRD | pm-design related orchestrator | PRD is the business basis for agile-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (agile-review, agile-sprint-planning, agile-daily-sync...) produce domain-specific outputs |

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
