---
name: release-orchestrator
description: "Use when executing the product release and delivery process. Release delivery commander orchestrating quality acceptance, release checks, gradual rollout, and release notes. Keywords: product release, launch, gradual rollout, release checks, release notes, delivery, acceptance release."
metadata:
  module: "Product Monitoring and Iteration"
  sub-module: "Release Delivery"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Release the product"
    - "Gradual rollout to production"
    - "Execute the release process"
    - "Release after acceptance"
---

# Release Delivery Commander

## Core Principles

1. **Quality is the prerequisite for release** -- P0 issues = 0 before entering the release process
2. **Progressive delivery** -- gradual rollout -> small traffic -> full rollout, with monitoring at each step
3. **Rollback capability is the baseline** -- every release step must have a corresponding rollback plan

## Orchestration Philosophy

1. **Quality gate first, progressive delivery advances**: First ensure release prerequisites through quality acceptance, then gradually increase traffic per gradual rollout strategy
2. **Checklist as safety net, rollback plan as baseline**: Release checks ensure no omissions, each gradual rollout step has rollback capability

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: release-orchestrator
version: 1.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/release-orchestrator.md

stages:
  - id: phase-1
    name: "Quality Acceptance"
    depends_on: []
    skills: [quality-acceptance]
    gate:
      condition: "P0 issues = 0, P1 issues <= 3"
      fail_action: "Fix P0 issues and re-accept"

  - id: phase-2
    name: "Release Checks"
    depends_on: [phase-1]
    skills: [release-auto-checklist]
    gate:
      condition: "Release checklist all passed"
      fail_action: "Supplement missing items and re-check"

  - id: phase-3
    name: "Gradual Rollout"
    depends_on: [phase-2]
    skills: [release-gradual]
    gate:
      condition: "Gradual rollout monitoring metrics normal"
      fail_action: "Rollback and investigate issues"

  - id: phase-4
    name: "Release Notes"
    depends_on: [phase-3]
    skills: [release-notes]
    gate:
      condition: "Release notes confirmed by human"
      fail_action: "Supplement release notes content"
```

## Stage Execution Plan

#### Invoke quality-acceptance

```
Invoke: ${quality-acceptance}
Input:
  acceptance_criteria: User provided (acceptance criteria)
  test_report: Testing platform (test report)
  launch_checklist: User provided (launch checklist, optional)
Output: output/pm-monitoring/quality-acceptance/
Validation: Acceptance criteria verified item by item; risk items listed; go-live recommendation actionable
Mode: AI->Human
```

#### Invoke release-auto-checklist

```
Invoke: ${release-auto-checklist}
Input:
  release_content: User provided (release content)
  env_config: User provided (environment configuration)
  dependency_list: User provided (dependency list, optional)
Output: output/pm-monitoring/release-auto-checklist/
Validation: Check items fully covered; all blocking items resolved
Mode: AI
```

#### Invoke release-gradual

```
Invoke: ${release-gradual}
Input:
  release_plan: User provided (release plan)
  gradual_strategy: User provided (gradual rollout strategy, optional)
  monitoring_config: monitoring-pipeline -> monitoring configuration (optional)
Output: output/pm-monitoring/release-gradual/
Validation: Gradual rollout stage configuration complete; traffic rules clear; rollback conditions actionable
Mode: AI->Human
```

#### Invoke release-notes

```
Invoke: ${release-notes}
Input:
  release_content: User provided (release content)
  change_log: User provided (change log)
  user_impact: User provided (user impact, optional)
Output: output/pm-monitoring/release-notes/
Validation: User version, ops version, and internal version release notes all generated
Mode: AI
```

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/pm-monitoring/ |
| Summary output path | output/phase-reports/pm-monitoring/release-orchestrator.md |

Downstream connections:
  primary: monitoring-orchestrator (release completed, track post-release metric changes)
  alternatives:
    - target: agile-orchestrator
      reason: Need to enter next Sprint after release
      condition: When release is complete and iteration needs to continue
    - target: growth-orchestrator
      reason: Launch growth strategy after release
      condition: When release involves growth-related features and needs to drive user growth
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Quality acceptance passed | quality-acceptance output files generated and non-empty | Fix P0 issues and re-accept |
| Release checks passed | release-auto-checklist output files generated and non-empty | Supplement missing items and re-check |
| Gradual rollout monitoring normal | release-gradual output files generated and non-empty | Rollback and investigate issues |
| Release notes confirmed | release-notes output files generated and confirmed by human | Supplement release notes content |
| Stage summary generated | output/phase-reports/pm-monitoring/release-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Quality acceptance go-live decision | Quality acceptance report generated | Confirm acceptance results, decide whether to go-live or conditionally go-live |
| Gradual rollout strategy confirmation | Gradual rollout plan generated | Confirm gradual rollout stages, traffic rules, and rollback conditions |
| Gradual rollout monitoring metrics confirmation | Monitoring metrics fluctuate during gradual rollout execution | Confirm whether to continue increasing traffic or rollback |
| Release notes confirmation | Release notes document generated | Confirm release notes content is accurate and complete |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Quality acceptance P0 issues not zeroed | Block release process, require fixing P0 issues before re-acceptance |
| Release check blocking items cannot be resolved | Block release process, escalate to human to decide on degraded release or postponement |
| Gradual rollout monitoring metrics abnormal | Immediately rollback to previous stable version, investigate issues and re-formulate gradual rollout plan |
| Gradual rollback failed | Activate emergency rollback plan, notify On-Call personnel, escalate to human for emergency handling |
| Sub-skill output validation failed | Roll back to current stage and re-execute, max 1 retry; if still fails, mark exception and escalate to human |
| Upstream/downstream data format incompatible | Map fields and fill default values per downstream sub-skill input schema, record mapping relationships |
| Stage summary generation failed | Generate partial summary based on completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |
| Monitoring alert requirement | Transfer to monitoring-orchestrator for handling |

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
| PRD | pm-design related orchestrator | PRD is the business basis for release-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (release-gradual, release-auto-checklist, release-notes...) produce domain-specific outputs |

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
