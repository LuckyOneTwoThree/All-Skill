---
name: product-iteration-orchestrator
description: "Use when performing feature iteration on an existing product. Product iteration commander coordinating incremental updates and integrated delivery across PM/UI/Backend sub-orchestrators based on change impact scope. Keywords: feature iteration, requirement change, incremental update, cross-domain, product optimization, add feature, change requirement, product upgrade, feature enhancement, iterative development."
metadata:
  module: "Cross-Domain Coordination"
  sub-module: "Product Iteration"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Add a payment feature to an existing product"
    - "Requirements changed, need to adjust"
    - "Product upgrade, add new modules"
    - "Optimize existing features"
    - "Add a new feature to the system"
    - "Requirements changed, re-evaluate impact"
    - "Version iteration, update several modules"
---

# Product Iteration Commander

## Core Principles

**Impact analysis driven, conditional branch execution, minimal change set delivery**

The core difference between product iteration and product launch is: existing products have existing code, existing APIs, and existing users. The key to iteration is not full-process advancement but precisely identifying the change impact scope and only executing affected domain orchestrators, avoiding unnecessary full rework.

## Execution Steps

1. **Requirements and Design**: Invoke design-orchestrator to complete requirement analysis and PRD incremental update
2. **Change Impact Analysis**: Identify change impact scope, determine whether API/UI/Backend need changes
3. **API Design**: Conditionally execute API design orchestrator, produce API contracts for Backend and UI to consume in parallel
4. **Backend Implementation**: Conditionally execute data architecture and backend architecture orchestrators, can run in parallel with UI changes
5. **UI Changes**: Conditionally execute UI orchestrator, based on API contracts in parallel with Backend implementation
6. **Delivery and Launch**: Invoke release-orchestrator + monitoring-orchestrator to complete quality acceptance -> release checks -> gradual rollout -> monitoring setup

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: product-iteration-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/cross-domain/product-iteration-orchestrator.md

stages:
  - id: phase-1
    name: "Requirements and Design"
    depends_on: []
    skills: [design-orchestrator]
    gate:
      condition: "PRD confirmed by human"
      fail_action: "Supplement requirement details"

  - id: phase-2
    name: "Change Impact Analysis"
    depends_on: [phase-1]
    skills: [change-impact-analysis]
    gate:
      condition: "Impact matrix covers all downstream deliverables"
      fail_action: "Supplement missing downstream impact items"

  - id: phase-3
    name: "API Design"
    depends_on: [phase-2]
    trigger: API needs changes
    skills: [api-design-orchestrator]
    gate:
      condition: "API changes confirmed by human"
      fail_action: "Adjust API design"

  - id: phase-4
    name: "Backend Implementation"
    depends_on: [phase-2, phase-3]
    parallel_with: [phase-5]
    trigger: Data/Backend needs changes
    skills: [data-architecture-orchestrator, backend-architecture-orchestrator]
    gate:
      condition: "Backend review passed (P0=0)"
      fail_action: "Fix P0 issues"

  - id: phase-5
    name: "UI Changes"
    depends_on: [phase-2, phase-3]
    parallel_with: [phase-4]
    trigger: UI needs changes
    skills: [ui-orchestrator]
    gate:
      condition: "UI development and integration verification passed"
      fail_action: "Fix integration issues"

  - id: phase-6
    name: "Delivery and Launch"
    depends_on: [phase-4, phase-5]
    skills: [release-orchestrator, monitoring-orchestrator]
    gate:
      condition: "P0 issues = 0, gradual rollout passed"
      fail_action: "Fix blocking issues and re-verify"
```

## Stage Execution Plan

### Stage 1: Requirements and Design

#### Invoke design-orchestrator

```
Invoke: ${design-orchestrator}
Input:
  User feedback: Iteration user feedback data
  Business requirements: Business requirement changes
  Data anomalies: Data anomaly metrics
Output: output/cross-domain/design-orchestrator/
Validation: PRD confirmed by human
Mode: AI->Human
```

### Stage 2: Change Impact Analysis

#### Invoke change-impact-analysis

```
Invoke: ${change-impact-analysis}
Input:
  PRD changes: output/cross-domain/design-orchestrator/
Output: output/cross-domain/product-iteration-orchestrator/impact-report.md
Validation: Impact matrix covers all downstream deliverables
Mode: AI
```

### Stage 3: API Design (Conditional Execution)

#### Invoke api-design-orchestrator

```
Invoke: ${api-design-orchestrator}
Input:
  PRD changes: output/cross-domain/design-orchestrator/
Output: output/cross-domain/api-design-orchestrator/
Validation: API changes confirmed by human
Mode: AI->Human
```

### Stage 4: Backend Implementation (Conditional Execution, Parallel with Stage 5)

#### Invoke data-architecture-orchestrator

```
Invoke: ${data-architecture-orchestrator}
Input:
  PRD changes: output/cross-domain/design-orchestrator/
  API change output: output/cross-domain/api-design-orchestrator/
Output: output/cross-domain/data-architecture-orchestrator/
Validation: Data architecture change review passed
Mode: AI->Human
```

#### Invoke backend-architecture-orchestrator

```
Invoke: ${backend-architecture-orchestrator}
Input:
  PRD changes: output/cross-domain/design-orchestrator/
  API change output: output/cross-domain/api-design-orchestrator/
  Data architecture change output: output/cross-domain/data-architecture-orchestrator/
Output: output/cross-domain/backend-architecture-orchestrator/
Validation: Backend review passed (P0=0)
Mode: AI->Human
```

### Stage 5: UI Changes (Conditional Execution, Parallel with Stage 4)

#### Invoke ui-orchestrator

```
Invoke: ${ui-orchestrator}
Input:
  mode: full (product iteration scenario, requirement changes already confirmed by upstream design-orchestrator, skip exploration phase)
  PRD changes: output/cross-domain/design-orchestrator/
  API change output: output/cross-domain/api-design-orchestrator/
  Target language: User provided (default zh-CN)
  project_dir: User provided (existing project directory path)
Output: output/cross-domain/ui-orchestrator/
Validation: Frontend code review passed, frontend-backend integration passed
Mode: AI->Human
```

### Stage 6: Delivery and Launch

#### Invoke release-orchestrator

```
Invoke: ${release-orchestrator}
Input:
  Change output: output/cross-domain/
  Integration output: output/cross-domain/ui-orchestrator/
Output: output/cross-domain/release-orchestrator/
Validation: P0 issues = 0, gradual rollout passed
Mode: AI->Human
```

#### Invoke monitoring-orchestrator

```
Invoke: ${monitoring-orchestrator}
Input:
  Release artifacts: output/cross-domain/release-orchestrator/
  Metrics system: output/cross-domain/metrics-orchestrator/ (optional)
Output: output/cross-domain/monitoring-orchestrator/
Validation: Monitoring alert system established
Mode: AI->Human
```

### Additional Dispatch (On-demand Trigger)

| Trigger Event | Dispatch Action |
|----------|----------|
| Need data to support decisions | -> analysis-orchestrator (execute before design-orchestrator) |
| Need A/B verification | -> experiment-orchestrator (execute before delivery and launch) |
| Need project management support | -> agile-orchestrator (throughout entire process) |
| Iteration effect evaluation | -> analysis-orchestrator (execute after delivery and launch) |

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/cross-domain/ |
| Summary output path | output/phase-reports/cross-domain/product-iteration-orchestrator.md |

Downstream connections:
  primary: monitoring-orchestrator (enter continuous monitoring after iteration release)
  alternatives:
    - target: product-iteration-orchestrator
      reason: Continue next iteration round
      condition: When there are new iteration requirements
    - target: growth-orchestrator
      reason: Iteration involves growth features
      condition: When iteration includes acquisition/activation/retention/monetization related features
    - target: agile-orchestrator
      reason: Enter next Sprint planning
      condition: When using agile development mode
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| PRD confirmed | PRD confirmed by human | Supplement requirement details |
| Impact scope confirmed | change-impact output files generated and non-empty | Supplement missing downstream impact items |
| API changes confirmed | api-design-orchestrator output files generated and non-empty | Adjust API design |
| Backend review passed | backend-review output files generated and non-empty | Fix P0 issues |
| UI integration verified | ui-integration output files generated and non-empty | Fix integration issues |
| Delivery and launch | release output files generated and non-empty | Fix blocking issues and re-verify |
| Stage summary generated | output/phase-reports/cross-domain/product-iteration-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| PRD confirmation | design-orchestrator completed | Confirm PRD changes can be distributed to affected domains |
| Impact scope confirmation | change-impact-analysis completed | Confirm which domains need changes, whether anything is missing |
| Release decision | Delivery and launch stage completed | Confirm whether to release |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Requirement scope creep | Mark out-of-scope requirements, human decides whether to include in current iteration |
| PRD change affects unevaluated domains | Automatically scan all domain orchestrator input dependencies, supplement missing impacts |
| API backward incompatible | Mark breaking changes, must provide compatibility plan or version upgrade strategy |
| Regression test failed | Roll back to pre-change code version, mark "iteration blocked" |
| Change scope exceeds expectations | Pause execution, human decides whether to split into multiple iteration phases |
| Pure UI change but design tokens need adjustment | Handled by ui-orchestrator for unified design token update and frontend development |
| Pure backend change but affects existing API | Must execute api-design-orchestrator to evaluate API compatibility |
| Stage summary generation failed | Generate partial summary based on completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |
