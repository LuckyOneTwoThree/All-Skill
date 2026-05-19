---
name: project-planning-orchestrator
description: "Use when starting a new project or conducting project planning. Project planning commander orchestrating planning-project-charter, planning-resource, and planning-kickoff sub-skills. Keywords: project planning, project charter, resource planning, Kickoff, project initiation, project constitution, resource allocation, project setup."
metadata:
  module: "Project Management and Execution"
  sub-module: "Project Planning"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Start a new project"
    - "Conduct project planning"
    - "Write a project charter"
    - "Plan resource allocation"
---

# Project Planning Commander

## Core Principles

**A good start is half the battle; a chaotic start cannot be remedied**

Every minute invested in the project planning phase saves hours in subsequent execution. Planning is not procrastination but ensuring the team runs at full speed in the right direction. A chaotic start only leads to rework, conflict, and morale drain.

1. **Charter locked first** -- The project charter is the anchor for all subsequent planning. The orchestrator should ensure the charter receives human approval before resource planning and Kickoff, avoiding resource allocation without confirmed objectives.
2. **Resources aligned with scope** -- Resource planning is not an independent activity; it must align with the scope and objectives in the project charter. The orchestrator should detect scope-resource mismatches and proactively escalate.
3. **Alignment at kickoff** -- Kickoff is not formalism but the last calibration point ensuring all stakeholders agree on objectives, scope, and roles. The orchestrator should ensure Kickoff covers all key alignment items.

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: project-planning-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-project/project-planning-orchestrator.md

stages:
  - id: phase-1
    name: "Project Charter"
    depends_on: []
    skills: [planning-project-charter]
    gate:
      condition: "Charter approved"
      fail_action: "Modify charter and re-approve"

  - id: phase-2
    name: "Resource Lockdown"
    depends_on: [phase-1]
    skills: [planning-resource]
    gate:
      condition: "Resources locked"
      fail_action: "Escalate to human decision, adjust scope or resources"

  - id: phase-3
    name: "Kickoff"
    depends_on: [phase-1, phase-2]
    skills: [planning-kickoff]
    gate:
      condition: "Kickoff completed"
      fail_action: "Re-schedule meeting time"
```

## Stage Execution Plan

#### Invoke planning-project-charter

```
Invoke: ${planning-project-charter}
Input:
  product_background: User provided
  strategic_goal: User provided
  resource_constraints: User provided (optional)
Output: output/pm-project/planning-project-charter/
Validation: Project objectives follow SMART principles; stakeholders cover all key roles; success criteria quantifiable and verifiable; initial risk list includes impact and probability assessment
Mode: AI->Human
```

#### Invoke planning-resource

```
Invoke: ${planning-resource}
Input:
  project_scope: planning-project-charter -> project_charter
  tech_plan: User provided
  team_capability: User provided (optional)
Output: output/pm-project/planning-resource/
Validation: Resource estimation based on WBS decomposition; critical resource gaps identified and marked; schedule has no resource conflicts; estimation confidence marked
Mode: AI
```

#### Invoke planning-kickoff

```
Invoke: ${planning-kickoff}
Input:
  project_charter: planning-project-charter -> project_charter
  resource_plan: planning-resource -> resource_plan
  meeting_participants: User provided
  preferred_time: User provided (optional)
Output: output/pm-project/planning-kickoff/
Validation: Agenda covers project objectives, scope, roles, timeline; key stakeholders confirmed to attend; action items have clear owners and deadlines
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/pm-project/ |
| Summary output path | output/phase-reports/pm-project/project-planning-orchestrator.md |

Downstream connections:
  primary: agile-orchestrator (project planning completed, start first Sprint)
  alternatives:
    - target: risk-orchestrator
      reason: Project planning identified high risks
      condition: When risk assessment level in project charter is high
    - target: design-orchestrator
      reason: Project planning completed but product design not ready
      condition: When project is approved but PRD is not yet completed
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Charter approved | Project charter approved by human | Modify charter and re-approve |
| Resources locked | planning-resource output files generated and non-empty | Escalate to human decision, adjust scope or resources |
| Kickoff completed | kickoff output files generated and non-empty | Re-schedule meeting time |
| Stage summary generated | output/phase-reports/pm-project/project-planning-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Charter approval | Project charter generated | Approve project objectives, scope, and success criteria |
| Scope change | Scope change request during execution | Assess change impact, decide whether to accept change |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Stage 1 sub-skill (project charter) failed | Pause project initiation, output failure reason, prompt user to supplement project background or strategic goals before retry |
| Upstream data missing (e.g., product background, strategic goals) | Generate draft charter with placeholder data, mark low confidence, prompt user to supplement before regenerating |
| Key decision point not confirmed by human (e.g., charter approval) | Pause entering resource planning stage, continue waiting for approval, escalate reminder after timeout |
| All upstream data missing | Mark "all data missing" status, output minimal template (metadata and empty structure only), set overall confidence to 0.3, force human confirmation on whether to continue. After human confirmation, generate based on user-provided information and AI knowledge base inference, all inferred content marked with confidence <= 0.5 and needs_human_validation: true |
| Stage summary generation failed | Generate partial summary based on completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |

## Changelog

- v1.0: Initial version
