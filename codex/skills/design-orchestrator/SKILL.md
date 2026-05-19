---
name: design-orchestrator
description: "Use when generating PRD, information architecture, user flows, prototypes, or interaction specs. Orchestrates design-prd/design-ia/design-userflow/design-prototype/interaction-spec/design-handoff-spec/change-impact-analysis. Keywords: product design, PRD, information architecture, prototype, interaction spec, design handoff, write PRD, product documentation, design output, change impact analysis."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Product Design & Prototype"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me write a PRD"
    - "Generate product requirements document"
    - "Design information architecture"
    - "Map user flows"
    - "Output interaction design specifications"
    - "PRD changed, analyze the impact"
---

# Product Design & Prototype Orchestrator

## Core Principles

1. **Design is trade-off, not accumulation** -- Core paths must be extremely smooth; non-core paths can be compromised
2. **Upstream quality determines downstream efficiency** -- PRD quality gates cannot be bypassed; garbage in, garbage out
3. **Design consistency is a system property** -- From tokens to components to interaction specs must be coherent throughout; breaks equal debt
4. **Bidirectional feedback loop** -- PM->UI is forward constraint, UI->PM is reverse feedback; both together ensure design quality

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Sub-Skill output file missing | Block current stage, output missing items list, prompt human to supplement upstream input |
| Sub-Skill quality check not passed | Block entry to next stage, output failed items details, prompt human to confirm whether to fix or accept risk |
| Context approaching limit | Prioritize current stage content, summarize completed stage outputs as key conclusions written to file |
| Human decision timeout without response | Pause orchestration flow, preserve current state, wait for human decision before continuing |
| Upstream input data format error | Attempt compatible parsing; if parsing fails, degrade to user-provided description, annotate "data format error" |
| Stage summary generation failure | Generate partial summary based on completed sub-Skill output, mark missing items as "data missing", do not block orchestration completion |

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: design-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-design/design-orchestrator.md

stages:
  - id: phase-0
    name: "UI Feedback Processing"
    depends_on: []
    skills: []
    trigger: output/pm-design/design-feedback/design_feedback.json exists
    gate:
      condition: "Feedback suggestions evaluated, accept/reject decided"
      fail_action: "Annotate unprocessed feedback, do not block main flow"

  - id: phase-1
    name: "Product Requirements Document"
    depends_on: [phase-0]
    skills: [design-prd]
    gate:
      condition: "PRD 4 quality gates all passed"
      fail_action: "Gate 1 or 2 failure blocks flow, output missing items list"

  - id: phase-2
    name: "Information Architecture Design"
    depends_on: [phase-1]
    parallel_with: [phase-3]
    skills: [design-ia]
    gate:
      condition: "IA plan human-confirmed"
      fail_action: "Generate 2-3 candidate plans for human selection"

  - id: phase-3
    name: "User Flow Design"
    depends_on: [phase-1]
    parallel_with: [phase-2]
    skills: [design-userflow]
    gate:
      condition: "User flow dead ends = 0"
      fail_action: "Dead ends must be fixed before entering prototype stage"

  - id: phase-4
    name: "Prototype Design"
    depends_on: [phase-2, phase-3]
    skills: [design-prototype]
    gate:
      condition: "Prototype design spec consistency >= 85%"
      fail_action: "Consistency < 85% requires human confirmation of violations"

  - id: phase-5
    name: "Interaction Design Specification"
    depends_on: [phase-3, phase-4]
    parallel_with: [phase-6]
    skills: [interaction-spec]
    gate:
      condition: "Interaction state machine covers all 8 basic states"
      fail_action: "Supplement missing state definitions"

  - id: phase-6
    name: "Design Handoff Specification"
    depends_on: [phase-4, phase-2, phase-3, phase-1]
    parallel_with: [phase-5]
    skills: [design-handoff-spec]
    gate:
      condition: "Handoff document pending confirmation items = 0"
      fail_action: "Pending items must be confirmed one by one or annotated as accepted risk"

  - id: phase-7
    name: "Change Impact Analysis"
    depends_on: [phase-1, phase-2, phase-3, phase-4]
    skills: [change-impact-analysis]
    trigger: Triggered when PRD changes
    gate:
      condition: "Impact matrix covers all downstream design outputs, redo list is actionable"
      fail_action: "Supplement missing downstream impact items"
```

## Stage Execution Plan

#### Process UI Feedback (phase-0, conditional execution)

```
Trigger condition: output/pm-design/design-feedback/design_feedback.json exists
Action: Evaluate UI->PM feedback suggestions
Input:
  design_feedback: output/pm-design/design-feedback/design_feedback.json
Processing flow:
  1. Read design_feedback.json
  2. Group suggestions by target_artifact
  3. Evaluate each suggestion:
     - Accept: Mark as accepted, include in subsequent stage modification scope
     - Reject: Mark as rejected, record rejection reason
  4. [GATE] Human confirmation required for feedback processing results
  5. For accepted suggestions:
     - If target_artifact is prd.json: Include in phase-1 modification scope
     - If target_artifact is ia_proposals.json: Include in phase-2 modification scope
     - If target_artifact is userflow.json: Include in phase-3 modification scope
     - If target_artifact is component_catalog.json: Include in phase-4 modification scope
     - If target_artifact is interaction-spec.json: Include in phase-5 modification scope
  6. After processing, delete design_feedback.json to avoid duplicate consumption
Output: Feedback processing results (accepted/rejected list)
Validation: Feedback suggestions evaluated item by item, processing results human-confirmed
Mode: AI->Human
```

#### Invoke design-prd

```
Invoke: ${design-prd}
Input:
  ideation_workshop: output/pm-design/ideation-workshop/ideation-workshop.json
  strategic_output: User provided
  requirement_context: User provided (product_name required)
Output: output/pm-design/design-prd/
Validation: PRD 4 quality gates all passed
Mode: AI->Human
```

#### Invoke design-ia

```
Invoke: ${design-ia}
Input:
  prd: output/pm-design/design-prd/prd.md
  existing_ia: Optional
  user_research: Optional
Output: output/pm-design/design-ia/ia_proposals.json
Validation: IA plan human-confirmed
Mode: AI->Human
```

#### Invoke design-userflow

```
Invoke: ${design-userflow}
Input:
  prd: output/pm-design/design-prd/prd.md
  ia_proposals: output/pm-design/design-ia/ia_proposals.json
  user_research: Optional
Output: output/pm-design/design-userflow/userflow.json
Validation: User flow dead ends = 0
Mode: AI->Human
```

#### Invoke design-prototype

```
Invoke: ${design-prototype}
Input:
  ia_proposals: output/pm-design/design-ia/ia_proposals.json
  userflow: output/pm-design/design-userflow/userflow.json
  design_system: Optional
  design_tokens: Optional
Output: output/pm-design/design-prototype/prototype_spec.json
Validation: Prototype design spec consistency >= 85%
Mode: AI->Human
```

#### Invoke interaction-spec

```
Invoke: ${interaction-spec}
Input:
  userflow: output/pm-design/design-userflow/userflow.json
  prototype_spec: output/pm-design/design-prototype/prototype_spec.json
  handoff_doc: Optional
  brand_guidelines: Optional
Output: output/pm-design/interaction-spec/
Validation: Interaction state machine covers all 8 basic states
Mode: AI->Human
```

#### Invoke design-handoff-spec

```
Invoke: ${design-handoff-spec}
Input:
  prototype_spec: output/pm-design/design-prototype/prototype_spec.json
  design_tokens: Optional
  ia_proposals: output/pm-design/design-ia/ia_proposals.json
  userflow: output/pm-design/design-userflow/userflow.json
  prd: output/pm-design/design-prd/prd.md
  component_library: Optional
Output: output/pm-design/design-handoff-spec/
Validation: Handoff document pending confirmation items = 0
Mode: AI->Human
```

#### Invoke change-impact-analysis

```
Invoke: ${change-impact-analysis}
Input:
  prd_change: User provided (PRD change content)
  current_ia: output/pm-design/design-ia/ia_proposals.json
  current_userflow: output/pm-design/design-userflow/userflow.json
  current_prototype: output/pm-design/design-prototype/prototype_spec.json
Output: output/pm-design/change-impact-analysis/
Validation: Impact matrix covers all downstream design outputs; redo list is actionable
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-design/ |
| Summary output path | output/phase-reports/pm-design/design-orchestrator.md |

Next Steps:
  primary: metrics-orchestrator (product design complete, design metric system and instrumentation plan for PRD feature points)
  alternatives:
    - target: validation-orchestrator
      reason: High-risk assumptions in PRD need validation
      condition: When PRD features marked as high-risk exceed 30%
    - target: api-design-orchestrator
      reason: After PRD confirmation, parallel-start backend API design (cross-module: Backend)
      condition: In 0-to-1 product flow, after PRD confirmation need to parallel-start Backend development
  special_cases:
    - target: design-handoff-spec
      reason: Only need to generate handoff document for dev team
      condition: When design plan is confirmed and only development handoff summary is needed

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| PRD generation complete | design-prd output file generated and non-empty | Gate 1 or 2 failure blocks flow, output missing items list |
| IA design complete | IA plan human-confirmed | Generate 2-3 candidate plans for human selection |
| User flow complete | design-userflow output file generated and non-empty | Dead ends must be fixed before entering prototype stage |
| Prototype complete | design-prototype output file generated and non-empty | Consistency < 85% requires human confirmation of violations |
| Interaction spec complete | interaction-spec output file generated and non-empty | Supplement missing state definitions |
| Design handoff complete | design-handoff-spec output file generated and non-empty | Pending items must be confirmed one by one or annotated as accepted risk |
| Change impact analysis complete | change-impact-analysis output file generated and non-empty | Supplement missing downstream impact items |
| Stage summary generated | output/phase-reports/pm-design/design-orchestrator.md generated and all 6 structure items non-empty | Supplement missing structure items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| UI feedback processing confirmation | phase-0, when design_feedback.json exists | Confirm accept/reject of UI-side feedback suggestions |
| PRD tier confirmation | AI auto-tiering confidence < 0.7 | Confirm PRD tier (L/S/X) |
| IA plan selection | IA generates 2-3 candidate plans | Select final IA plan |
| Design spec violation confirmation | Design spec consistency < 85% | Judge whether to accept violations |
| Interaction spec confirmation | Interaction design spec generation complete | Confirm state machine, animation, and gesture specs |
