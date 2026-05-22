---
name: product-iteration-orchestrator
description: "Use when performing feature iteration on an existing product. Product iteration commander coordinating incremental updates and integrated delivery across PM/UI/Backend sub-orchestrators based on change impact scope. Keywords: feature iteration, requirement change, incremental update, cross-domain, product optimization, add feature, change requirement, product upgrade, system upgrade, feature enhancement, add module, requirement adjustment, version iteration, feature improvement, iterative development."
metadata:
  module: "Cross-Domain Coordination"
  sub-module: "Product Iteration"
  type: "orchestrator"
  version: "10.0"
  domain_tags: ["General"]
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
## Code Write Boundary

Follow [Engineering Boundary Protocol](../../../codex-templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.


## Core Principles

**Impact analysis driven, conditional branch execution, minimal change set delivery**

The core difference between product iteration and product launch is: existing products have existing code, existing APIs, and existing users. The key to iteration is not full-process advancement but precisely identifying the change impact scope and only executing affected domain orchestrators, avoiding unnecessary full rework.

## Execution Steps

1. **Requirements and Design**: Invoke design-orchestrator to complete requirement analysis and PRD incremental update
2. **Change Impact Analysis**: Identify change impact scope, determine whether API/UI/Backend need changes
3. **Backend Changes**: Conditionally execute backend-orchestrator, maintain unified API/data/architecture design review
4. **UI Changes**: Conditionally execute UI orchestrator; if backend changes exist, consume API contracts produced by backend-orchestrator
5. **Integration Alignment**: When both API and UI need changes, verify API changes are synced to frontend (type definitions/request functions/Mock data) and UI change required API endpoints are covered
6. **Delivery and Launch**: Invoke release-orchestrator + monitoring-orchestrator to complete quality acceptance -> release checks -> gradual rollout -> monitoring setup

## Orchestration Protocol

> Protocol source: [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md) (for maintainers tracking only, this file has the complete protocol inlined and can be used independently)

You are the orchestrator; your responsibility is to **schedule sub-Skill execution by stage**, not to proxy execute sub-Skill logic. Strictly follow the following protocol:

### Invocation Rules

1. **Dual-mode Invocation**: When the platform supports the Skill tool, explicitly invoke sub-Skills; when the platform doesn't support it, execute compatible scheduling according to the sub-Skill's `name`, input contract, output contract, and stage gates.
2. **No Proxy Expansion**: During compatible scheduling, do not copy sub-Skill internal methodology into the orchestrator context, nor rewrite sub-Skill logic; only pass necessary inputs, output paths, and validation conditions.
3. **Contract-Driven**: Only focus on sub-Skill input contracts, output contracts, and validation conditions, not internal implementation details.
4. **State Passing**: Pass current stage outputs as next stage inputs, transferring data via file paths and artifact index.
5. **Validate Before Proceeding**: Only advance to the next stage after current stage output validation passes.
6. **Stage Summary (Mandatory)**: After all Pipeline stages complete, **must immediately** execute the `post_pipeline` defined stage summary action, generating the summary document. This is not an optional step; if the stage summary is not generated, the orchestrator execution is considered incomplete.
7. **Cross-Sub-Skill Validation**: When consistency constraints exist between outputs of multiple sub-Skills, the orchestrator can perform cross-validation between stages (reading multiple outputs to compare consistency); this is part of the orchestrator's coordination responsibility, not proxy execution of sub-Skill logic. Cross-validation rules are explicitly defined in the orchestrator SKILL.md.

### Context Management

- After each sub-Skill invocation completes, only retain **output file paths** and **key conclusion summaries**
- Detailed outputs are written to each sub-Skill's domain-native output directory, such as `output/pm-design/design-prd/`
- If context approaches the limit, prioritize retaining current stage content and pending stage sub-Skill names

### Stage Gate Standards

The orchestrator's stage gates only validate the following 3 types of conditions, not diving into sub-Skill internal fields:

| Gate Type | Validation Content | Example |
|----------|----------|------|
| Output Existence | Output files generated and non-empty | "api-design-spec output files generated" |
| Top-level Structure Completeness | JSON top-level required fields exist | "prd.json contains features/pages/entities" |
| Human Decision Confirmation | Key decision points have received human confirmation | "Design review human confirmation passed" |

### General Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestration completion |
| Key decision point not confirmed by human | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| Upstream data missing | Mark missing data items, fill with reasonable assumptions (mark confidence <=0.3), continue execution and highlight in output |
| All upstream data missing | Mark "all data missing" status, output minimal template, set overall confidence to 0.3, force human confirmation whether to continue |

## Pipeline

```yaml
pipeline: product-iteration-orchestrator
version: 10.0

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
    name: "Backend Changes"
    depends_on: [phase-2]
    trigger: API/Data/Backend needs changes
    skills: [backend-orchestrator]
    gate:
      condition: "Backend unified design review passed + change compatibility confirmed + implementation review passed"
      fail_action: "Fix backend design/implementation blocking issues"

  - id: phase-5
    name: "UI Changes"
    depends_on: [phase-2]
    optional_depends_on: [phase-3]
    trigger: UI needs changes
    skills: [ui-orchestrator]
    gate:
      condition: "UI development and integration verification passed"
      fail_action: "Fix integration issues"

  - id: phase-4
    name: "Integration Alignment"
    depends_on: [phase-3, phase-5]
    trigger: Both API and UI need changes
    type: cross-validation
    skills: []
    gate:
      condition: "API changes synced to frontend (type definitions/request functions/Mock data), UI change required API endpoints covered, unaligned items=0"
      fail_action: "Roll back to backend-orchestrator or ui-orchestrator to fix alignment differences"

  - id: phase-6
    name: "Delivery and Launch"
    depends_on: [phase-2]
    optional_depends_on: [phase-3, phase-5, phase-4]
    skills: [release-orchestrator, monitoring-orchestrator]
    gate:
      condition: "P0 issues = 0, gradual rollout passed"
      fail_action: "Fix blocking issues and re-verify"
```

## Stage Execution Plan

### Cross-Domain Artifact Index

This orchestrator does not require sub-Skills to write artifacts to `output/cross-domain/<skill-name>/`. All sub-Skills still write to their respective domain native paths; this orchestrator records stage, skill, actual output path, summary, and validation status in `output/cross-domain/artifact-index.json`. Cross-domain paths appearing below represent index references only, not rewriting sub-Skill output directories.

### Stage 1: Requirements and Design

#### Invoke design-orchestrator

```
Skill: design-orchestrator
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
Skill: change-impact-analysis
Input:
  PRD changes: output/cross-domain/design-orchestrator/
Output: output/cross-domain/product-iteration-orchestrator/impact-report.md
Validation: Impact matrix covers all downstream deliverables
Mode: AI
```

### Stage 3: Backend Changes (Conditional Execution)

#### Invoke backend-orchestrator

```
Skill: backend-orchestrator
Input:
  PRD changes: artifact-index.json -> design-orchestrator -> output/pm-design/design-prd/
  change-impact: artifact-index.json -> change-impact-analysis
  project_dir: User provided (existing project directory path)
Output: output/backend-architecture/ + output/backend-data-architecture/ + output/backend-api-design/ + output/backend-design-review/
Validation: Backend unified design review passed + change compatibility confirmed + implementation review passed
Mode: AI->Human
```

### Stage 5: UI Changes (Conditional Execution)

#### Invoke ui-orchestrator

```
Skill: ui-orchestrator
Input:
  mode: full (product iteration scenario, requirement changes already confirmed by upstream design-orchestrator, skip exploration phase)
  PRD changes: artifact-index.json -> design-orchestrator -> output/pm-design/design-prd/
  API change output: artifact-index.json -> backend-orchestrator -> output/backend-api-design/api-design-spec/openapi.yaml
  Target language: User provided (default zh-CN)
  project_dir: User provided (existing project directory path)
Output: output/ui-project-init/ + output/ui-frontend/ + output/ui-frontend-integration/
Validation: Frontend code review passed, frontend-backend integration passed
Mode: AI->Human
```

### Stage 4: Integration Alignment (Conditional Execution)

When both API and UI need changes, the orchestrator reads backend API change and frontend UI change outputs from `artifact-index.json`, performing cross-domain alignment checks:

```
Action: API/UI Change Alignment Check
Input:
  API change contract: artifact-index.json -> backend-orchestrator -> output/backend-api-design/api-design-spec/openapi.yaml
  UI page data requirements: artifact-index.json -> ui-orchestrator -> output/ui-frontend/page-builder/pages.json
  Change impact report: output/cross-domain/product-iteration-orchestrator/impact-report.md
Output: output/cross-domain/integration-alignment.json
Validation: API changes synced to frontend (type definitions/request functions/Mock data), UI change required API endpoints covered, unaligned items=0
Mode: AI->Human
```

#### Alignment Check Rules

| Check Dimension | Check Item | Pass Standard |
|----------------|-----------|---------------|
| API->Frontend Sync | For new/modified API endpoints, are frontend TypeScript type definitions updated | All changed endpoints have corresponding type definitions |
| API->Frontend Sync | For new/modified API endpoints, are frontend request functions (API Service layer) added/updated | All changed endpoints have corresponding request functions |
| API->Frontend Sync | For new/modified API endpoints, are frontend Mock data updated accordingly | Mock data structure consistent with latest API response structure |
| Frontend->API Coverage | For data required by new UI pages/components, are corresponding API endpoints available | All UI data requirements have API endpoint coverage |
| Frontend->API Coverage | Are API calls involved in UI changes consistent with latest API contract (path/parameters/response structure) | No outdated API calls |
| Deprecated Item Cleanup | For deprecated API endpoints, have frontend calls been removed | No frontend calls pointing to deprecated endpoints |
| Deprecated Item Cleanup | For removed frontend pages/components, do redundant API-only-called-by-them still exist in backend | No redundant API endpoints |

#### Gate Standard

- **Unaligned items = 0**: All check items above pass
- Alignment check results written to `integration-alignment.json`, containing: aligned items list, unaligned items list (with difference description and suggested fix direction), overall alignment rate
- When unaligned items != 0, roll back to corresponding orchestrator for fix based on difference description: API side missing -> roll back to backend-orchestrator, frontend side missing -> roll back to ui-orchestrator

### Stage 6: Delivery and Launch

#### Invoke release-orchestrator

```
Skill: release-orchestrator
Input:
  Change output: output/cross-domain/
  Integration output: output/cross-domain/ui-orchestrator/
Output: output/cross-domain/release-orchestrator/
Validation: P0 issues = 0, gradual rollout passed
Mode: AI->Human
```

#### Invoke monitoring-orchestrator

```
Skill: monitoring-orchestrator
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

After all sub-Skills complete execution, a stage summary document must be generated, written to `output/phase-reports/cross-domain/product-iteration-orchestrator.md`, containing the following 6 structural items (all must be non-empty):

1. **Execution Overview**: Orchestrator name and version, execution time, sub-Skill execution status (success/failure/degraded)
2. **Key Findings**: Core output summary for each sub-Skill (1-3 items), cross-sub-Skill insights
3. **Decision Records**: Human decision points and decision results, AI automatic decisions and rationale
4. **Deliverable Inventory**: All output file paths and content summaries, deliverable quality assessment (whether validation passed)
5. **Risks and Follow-ups**: Items that failed validation, items executed with degradation, recommended follow-up actions
6. **Downstream Connections**: Which downstream orchestrators can consume this orchestrator's outputs, recommended next orchestrators

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/cross-domain/ |
| Summary output path | output/phase-reports/cross-domain/product-iteration-orchestrator.md |
| Approval record path | output/approvals/product-iteration-orchestrator/<stage-id>.approval.json |

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
| Integration alignment | integration-alignment.json generated and unaligned items=0 | Roll back to backend-orchestrator or ui-orchestrator to fix alignment differences |
| Delivery and launch | release output files generated and non-empty | Fix blocking issues and re-verify |
| Stage summary generated | output/phase-reports/cross-domain/product-iteration-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| PRD confirmation | design-orchestrator completed | Confirm PRD changes can be distributed to affected domains |
| Impact scope confirmation | change-impact-analysis completed | Confirm which domains need changes, whether anything is missing |
| Alignment conflict arbitration | Integration alignment phase discovers API and frontend inconsistency | Decide whether to fix API side or frontend side |
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
| API changes not synced to frontend | Integration alignment phase detects unsynced items, roll back to ui-orchestrator to supplement type definitions/request functions/Mock data |
| UI changes lack API endpoint support | Integration alignment phase detects uncovered endpoints, roll back to backend-orchestrator to supplement API design |
| Alignment check rolled back multiple times without passing | Pause orchestration, human arbitrates conflict direction, mark "alignment blocked" |
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
| PRD | pm-design related orchestrator | PRD is the business basis for product-iteration-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (release-orchestrator, design-orchestrator, ui-orchestrator...) produce domain-specific outputs |

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
