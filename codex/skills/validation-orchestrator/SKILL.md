---
name: validation-orchestrator
description: "Use when validating product solutions. Solution validation sub-module orchestrator dispatching validation-assumption-map, validation-mvp, validation-experiment, validation-usability. Keywords: solution validation, assumption validation, MVP, usability testing, experiment design, assumption map, risk assessment, idea validation, minimum viable product."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Solution Validation"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Validate the product solution"
    - "Design MVP scope"
    - "Run assumption validation"
    - "Assess solution risks"
---

# Solution Validation Orchestrator

## Core Principles

1. **Validate assumptions, not solutions** -- use minimum cost to gain maximum confidence; the goal of MVP is learning, not delivery
2. **Assumption-driven validation order** -- validate highest-risk assumptions first; validation results determine solution direction
3. **Validation loop must be complete** -- assumption -> experiment -> data -> conclusion -> decision; any broken link is waste

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Sub-Skill output file missing | Block current stage, prompt human to supplement upstream input or provide alternative data |
| Assumption map has incomplete feature coverage | Mark missing features, suggest human confirm whether to add assumptions |
| MVP ratio exceeds 60% | Escalate to human judgment, output trimming suggestions, confirm whether to adjust MVP scope |
| Experiment design cannot meet statistical significance | Lower confidence level or increase sample size, mark "insufficient statistical power" |
| Usability test has fewer than 5 participants | Results for reference only, mark "insufficient sample size", suggest additional testing |
| Human decision timeout without response | Pause orchestration flow, preserve current state, wait for human decision before continuing |
| Context approaching limit | Prioritize current stage content, summarize completed stage outputs as key conclusions to file |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestration completion |

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: validation-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-design/validation-orchestrator.md

stages:
  - id: phase-1
    name: "Assumption Map"
    depends_on: []
    skills: [validation-assumption-map]
    gate:
      condition: "Highest-risk assumptions identified, each feature has at least 1 assumption"
      fail_action: "Each feature must have at least 1 assumption, highest-risk assumptions must have validation plans"

  - id: phase-2
    name: "MVP Scope Definition"
    depends_on: [phase-1]
    skills: [validation-mvp]
    gate:
      condition: "MVP ratio < 60%, Must Have features all have associated assumptions"
      fail_action: "MVP ratio > 60% escalated to human judgment, confirm whether to adjust"

  - id: phase-3
    name: "Experiment Design"
    depends_on: [phase-1, phase-2]
    parallel_with: [phase-4]
    skills: [validation-experiment]
    gate:
      condition: "Experiment plan reviewed by human, includes validation method, sample size, duration, termination conditions"
      fail_action: "All experiment plans must be reviewed by human"

  - id: phase-4
    name: "Usability Testing"
    depends_on: [phase-1, phase-2]
    parallel_with: [phase-3]
    skills: [validation-usability]
    gate:
      condition: "Issue severity graded properly (P0/P1/P2/P3), insights correspond to assumption map"
      fail_action: "Test execution must be led by human researcher"
```

## Stage Execution Plan

#### Invoke validation-assumption-map

```
Invoke: ${validation-assumption-map}
Input:
  design_output: output/pm-design/design-prototype/prototype_spec.json (or output/pm-design/design-userflow/userflow.json)
  prd: output/pm-design/design-prd/prd.md
Output: output/pm-design/validation-assumption-map/assumption_map.json
Validation: Highest-risk assumptions identified, each feature has at least 1 assumption
Mode: AI
```

#### Invoke validation-mvp

```
Invoke: ${validation-mvp}
Input:
  design_output: output/pm-design/design-prototype/prototype_spec.json (or output/pm-design/design-userflow/userflow.json)
  assumption_map: output/pm-design/validation-assumption-map/assumption_map.json
  resource_constraints: optional
Output: output/pm-design/validation-mvp/mvp_definition.json
Validation: MVP ratio < 60%, Must Have features all have associated assumptions
Mode: AI->Human
```

#### Invoke validation-experiment

```
Invoke: ${validation-experiment}
Input:
  assumption_map: output/pm-design/validation-assumption-map/assumption_map.json
  mvp_scope: output/pm-design/validation-mvp/mvp_definition.json
  traffic_data: optional (available traffic/user data)
Output: output/pm-design/validation-experiment/experiment_design.json
Validation: Experiment plan reviewed by human, includes validation method, sample size, duration, termination conditions
Mode: AI->Human
```

#### Invoke validation-usability

```
Invoke: ${validation-usability}
Input:
  test_plan: output/pm-design/validation-assumption-map/assumption_map.json
  participants: provided by user
  test_scenarios: output/pm-design/design-prototype/prototype_spec.json
Output: output/pm-design/validation-usability/usability_report.json
Validation: Issue severity graded properly (P0/P1/P2/P3), insights correspond to assumption map
Mode: Human->AI
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-design/ |
| Summary output path | output/phase-reports/pm-design/validation-orchestrator.md |

Downstream connections:
  primary: design-orchestrator (solution validation complete, adjust design based on validation conclusions)
  alternatives:
    - target: experiment-orchestrator
      reason: Validation conclusions need A/B testing for further confirmation
      condition: Validation results uncertain (confidence < 80%), quantitative experiment verification needed
    - target: ideation-orchestrator
      reason: Validation negates current solution, need to re-ideate
      condition: MVP validation conclusion is negative, core assumptions do not hold
  special_cases:
    - target: validation-usability
      reason: Only usability testing needed, no full validation flow required
      condition: Solution has passed assumption validation, only user experience testing needed

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Assumption map complete | validation-assumption-map output file generated and non-empty | Each feature must have at least 1 assumption, highest-risk assumptions must have validation plans |
| MVP scope complete | validation-mvp-scope output file generated and non-empty | MVP ratio > 60% escalated to human judgment, confirm whether to adjust |
| Experiment design complete | Experiment plan reviewed by human | All experiment plans must be reviewed by human |
| Usability testing complete | validation-usability-test output file generated and non-empty | Test execution must be led by human researcher |
| Stage summary generated | output/phase-reports/pm-design/validation-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| MVP scope confirmation | MVP scope definition complete, MVP ratio > 60% or Must Have items disputed | Human approves and determines final MVP scope |
| Experiment plan review | Experiment plan design complete | Human reviews and approves experiment plan |
| Validation conclusion decision | Usability testing complete, validation data organized | Human makes final product solution decision |

## Changelog

- v1.0: Initial version
- v2.0: Description trigger word optimization
- v3.0: Orchestrator optimization -- added sub-Skill execution protocol, task scheduling changed to stage execution plan, scheduling rules changed to execution mode, stage gates and human decision points changed to tables, added sub-Skill input/output paths
- v5.0: Orchestration protocol refactoring -- sub-Skill execution protocol changed to orchestration protocol, added Pipeline definition, stage execution plan changed to invocation instruction format, removed scheduling rules
- v6.1: Stage summary enhancement -- Pipeline added post_pipeline definition; invocation rule 6 changed to mandatory; stage execution plan added stage summary execution instruction; stage gates added stage summary validation; exception handling added stage summary generation failure strategy
