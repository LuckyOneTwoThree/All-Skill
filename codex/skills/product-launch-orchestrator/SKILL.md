---
name: product-launch-orchestrator
description: "Use when building a new product from scratch. Product launch commander coordinating full-process parallel construction across PM/UI/Backend domain sub-orchestrators. Keywords: product launch, from scratch, new product, full process, cross-domain, product going live, build new product, build system, build SaaS, build e-commerce, build app, project from zero, new project startup."
metadata:
  module: "Cross-Domain Coordination"
  sub-module: "Product Launch"
  type: "orchestrator"
  version: "8.0"
  trigger_examples:
    - "I want to build a trading marketplace system"
    - "We want to build a SaaS product from scratch"
    - "I want to build a social app"
    - "The company wants to build a new platform"
    - "We need to start a new project for online education"
    - "Help me build an e-commerce mini-program"
    - "Build a management system from zero"
    - "Build a payment platform"
---

# Product Launch Commander
## Code Write Boundary

Follow [Engineering Boundary Protocol](../../../codex-templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.


## Core Principles

**PRD as contract, parallel construction, integration verification, progressive delivery**

The core challenge of product launch is not the lack of skills in any single domain but the coordination across three major domains: PM's PRD must simultaneously satisfy Backend's API design needs and UI's interface design needs; Backend's API contracts must align with UI's frontend integration; any party's changes ripple to others. This orchestrator uses PRD as the core contract, managing cross-domain data flow and stage gates.

## Execution Steps

1. **PM first**: Complete exploration, strategy, and design full process first, producing PRD as cross-domain contract
2. **Parallel construction**: After PRD confirmed, Backend and UI start simultaneously, shortening overall timeline
3. **Integration verification**: After frontend and backend development completed, verify integration through integration orchestrator
4. **Progressive delivery**: Quality verification -> gradual rollout -> full rollout -> retrospective

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: product-launch-orchestrator
version: 8.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/cross-domain/product-launch-orchestrator.md

stages:
  - id: phase-1
    name: "Insight Analysis"
    depends_on: []
    skills: [insight-orchestrator]
    gate:
      condition: "Insight report confirmed by human"
      fail_action: "Supplement product direction or requirement information"

  - id: phase-2
    name: "Market Analysis"
    depends_on: [phase-1]
    skills: [market-orchestrator]
    gate:
      condition: "Market analysis confirmed by human"
      fail_action: "Supplement market data or competitor information"

  - id: phase-3
    name: "Business Model"
    depends_on: [phase-1, phase-2]
    skills: [business-orchestrator]
    gate:
      condition: "Business model confirmed by human"
      fail_action: "Supplement business model elements"

  - id: phase-4
    name: "Positioning Strategy"
    depends_on: [phase-3]
    skills: [positioning-orchestrator]
    gate:
      condition: "Positioning statement confirmed by human"
      fail_action: "Adjust positioning strategy"

  - id: phase-5
    name: "Product Design"
    depends_on: [phase-3, phase-4]
    skills: [design-orchestrator]
    gate:
      condition: "PRD confirmed by human"
      fail_action: "Supplement requirement details"

  - id: phase-6
    name: "Metrics System"
    depends_on: [phase-5]
    parallel_with: [phase-7]
    skills: [metrics-orchestrator]
    gate:
      condition: "Metrics system confirmed by human"
      fail_action: "Supplement metric definitions"

  - id: phase-7
    name: "API Design"
    depends_on: [phase-5]
    parallel_with: [phase-6]
    skills: [api-design-orchestrator]
    gate:
      condition: "API contract confirmed by human"
      fail_action: "Adjust API design"

  - id: phase-8
    name: "UI Development"
    depends_on: [phase-5, phase-7]
    parallel_with: [phase-9]
    skills: [ui-orchestrator]
    gate:
      condition: "UI development and integration verification passed"
      fail_action: "Fix integration issues"

  - id: phase-9
    name: "Backend Implementation"
    depends_on: [phase-7]
    parallel_with: [phase-8]
    skills: [data-architecture-orchestrator, backend-architecture-orchestrator]
    gate:
      condition: "Backend review passed (P0=0)"
      fail_action: "Fix P0 issues"

  - id: phase-10
    name: "Delivery and Launch"
    depends_on: [phase-8, phase-9, phase-6]
    skills: [release-orchestrator, monitoring-orchestrator, iteration-orchestrator, agile-orchestrator]
    gate:
      condition: "P0 issues = 0, P1 issues <= 3, gradual rollout passed, retrospective conclusions confirmed"
      fail_action: "Fix blocking issues and re-verify"
```

## Stage Execution Plan

### Stage 1: Insight Discovery

#### Invoke insight-orchestrator

```
Invoke: ${insight-orchestrator}
Input:
  User feedback: Initial user feedback data
  Market data: Market trends and size data
  Competitor information: Competitor analysis materials
Output: output/cross-domain/insight-orchestrator/
Validation: Insight report confirmed by human
Mode: AI->Human
```

### Stage 2: Market Analysis

#### Invoke market-orchestrator

```
Invoke: ${market-orchestrator}
Input:
  Insight report: output/cross-domain/insight-orchestrator/
Output: output/cross-domain/market-orchestrator/
Validation: Market analysis confirmed by human
Mode: AI->Human
```

### Stage 3: Business Strategy

#### Invoke business-orchestrator

```
Invoke: ${business-orchestrator}
Input:
  Insight report: output/cross-domain/insight-orchestrator/
  Market analysis: output/cross-domain/market-orchestrator/
Output: output/cross-domain/business-orchestrator/
Validation: Business model confirmed by human
Mode: AI->Human
```

### Stage 4: Strategic Positioning

#### Invoke positioning-orchestrator

```
Invoke: ${positioning-orchestrator}
Input:
  Business model: output/cross-domain/business-orchestrator/
Output: output/cross-domain/positioning-orchestrator/
Validation: Positioning statement confirmed by human
Mode: AI->Human
```

### Stage 5: Solution Design

#### Invoke design-orchestrator

```
Invoke: ${design-orchestrator}
Input:
  Positioning statement: output/cross-domain/positioning-orchestrator/
  Business model: output/cross-domain/business-orchestrator/
Output: output/cross-domain/design-orchestrator/
Validation: PRD confirmed by human
Mode: AI->Human
```

### Stage 6: Metrics System (Parallel Branch)

#### Invoke metrics-orchestrator

```
Invoke: ${metrics-orchestrator}
Input:
  PRD: output/cross-domain/design-orchestrator/
  Business model: output/cross-domain/business-orchestrator/
Output: output/cross-domain/metrics-orchestrator/
Validation: Metrics system confirmed by human
Mode: AI->Human
```

### Stage 7a: API Design (Parallel Branch - Backend)

#### Invoke api-design-orchestrator

```
Invoke: ${api-design-orchestrator}
Input:
  PRD: output/cross-domain/design-orchestrator/
Output: output/cross-domain/api-design-orchestrator/
Validation: API contract confirmed by human
Mode: AI->Human
```

### Stage 7b: Data Architecture -> Backend Architecture (Parallel Branch - Backend)

#### Invoke data-architecture-orchestrator

```
Invoke: ${data-architecture-orchestrator}
Input:
  API contract: output/cross-domain/api-design-orchestrator/
  PRD: output/cross-domain/design-orchestrator/
Output: output/cross-domain/data-architecture-orchestrator/
Validation: Data model review passed
Mode: AI->Human
```

#### Invoke backend-architecture-orchestrator

```
Invoke: ${backend-architecture-orchestrator}
Input:
  API contract: output/cross-domain/api-design-orchestrator/
  PRD: output/cross-domain/design-orchestrator/
  Data model: output/cross-domain/data-architecture-orchestrator/
Output: output/cross-domain/backend-architecture-orchestrator/
Validation: Backend review passed (P0=0)
Mode: AI->Human
```

### Stage 8: UI Development and Integration (Parallel Branch - UI)

#### Invoke ui-orchestrator

```
Invoke: ${ui-orchestrator}
Input:
  mode: full (product launch scenario, requirements and design already confirmed by upstream design-orchestrator, skip exploration phase)
  Brand guidelines: Brand guideline materials
  Product positioning: output/cross-domain/positioning-orchestrator/
  Target language: User provided (default zh-CN)
  project_name: User provided
  project_dir: User provided
  framework: User provided (React/Vue/Svelte/Next.js/Nuxt.js)
  PRD: output/cross-domain/design-orchestrator/
  API contract: output/cross-domain/api-design-orchestrator/
Output: output/cross-domain/ui-orchestrator/ + code written to {project_dir}/
Validation: UI development and integration verification passed + project runnable (npm run dev successful) + project build successful (npm run build successful)
Mode: AI->Human
```

### Stage 9: Quality -> Release -> Retrospective

#### Invoke release-orchestrator

```
Invoke: ${release-orchestrator}
Input:
  Backend output: output/cross-domain/backend-architecture-orchestrator/
  UI output: output/cross-domain/ui-orchestrator/
  Metrics system: output/cross-domain/metrics-orchestrator/
Output: output/cross-domain/release-orchestrator/
Validation: P0 issues = 0, gradual rollout passed
Mode: AI->Human
```

#### Invoke monitoring-orchestrator

```
Invoke: ${monitoring-orchestrator}
Input:
  Integration output: output/cross-domain/ui-orchestrator/
  Metrics system: output/cross-domain/metrics-orchestrator/
Output: output/cross-domain/monitoring-orchestrator/
Validation: P0 issues = 0, P1 issues <= 3
Mode: AI->Human
```

#### Invoke iteration-orchestrator

```
Invoke: ${iteration-orchestrator}
Input:
  Quality report: output/cross-domain/monitoring-orchestrator/
  Integration output: output/cross-domain/ui-orchestrator/
Output: output/cross-domain/iteration-orchestrator/
Validation: Gradual rollout passed
Mode: AI->Human
```

#### Invoke agile-orchestrator

```
Invoke: ${agile-orchestrator}
Input:
  Release artifacts: output/cross-domain/iteration-orchestrator/
  Metrics system: output/cross-domain/metrics-orchestrator/
Output: output/cross-domain/agile-orchestrator/
Validation: Retrospective conclusions confirmed
Mode: AI->Human
```

### Additional Dispatch (On-demand Trigger)

| Trigger Event | Dispatch Action |
|----------|----------|
| Need user research support | -> user-research-orchestrator (execute before insight-orchestrator) |
| Need opportunity validation | -> opportunity-orchestrator (execute before business-orchestrator) |
| Need hypothesis validation | -> validation-orchestrator (execute after design-orchestrator) |
| Need project management support | -> project-planning-orchestrator (throughout entire process) |

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/cross-domain/ |
| Summary output path | output/phase-reports/cross-domain/product-launch-orchestrator.md |

Downstream connections:
  primary: product-iteration-orchestrator (enter iteration optimization cycle after product launch)
  alternatives:
    - target: growth-orchestrator
      reason: Product has validated PMF, start scaled growth
      condition: When product has validated product-market fit and needs scaled growth
    - target: monitoring-orchestrator
      reason: Continuously monitor product operation metrics
      condition: When need to independently establish long-term monitoring system
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| PM design completed | PRD generated and confirmed by human | Supplement product direction or requirement information |
| Parallel construction ready | API contract confirmed by human + UI development confirmed | Delay launch of affected branch |
| Both backend and UI ready | Backend and UI output files generated and non-empty | Wait for lagging party to complete |
| Quality gate passed | Quality acceptance output files generated and non-empty | Fix blocking issues and re-verify |
| Stage summary generated | output/phase-reports/cross-domain/product-launch-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| PRD confirmation | design-orchestrator completed | Confirm PRD can be distributed to Backend and UI |
| API contract confirmation | api-design-orchestrator completed | Confirm API contract can be delivered to frontend |
| UI development confirmation | ui-orchestrator completed | Confirm UI development and integration verification passed |
| Frontend-backend conflict resolution | API contract conflicts with frontend needs | Decide whether to change API side or frontend side |
| Release decision | iteration-orchestrator gradual rollout completed | Confirm whether to do full rollout |
| Retrospective confirmation | agile-orchestrator completed | Confirm retrospective conclusions and action items |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Frequent PRD changes | Lock PRD version, changes go through change approval process, affected domains paused |
| API contract conflicts with frontend needs | Pause both sides, human adjudicates, winning side updates output |
| Design tokens incompatible with component library | Prioritize adjusting component library to adapt to tokens; tokens are the authoritative source |
| Backend development progress behind frontend | Frontend uses mock data to continue development, mark "pending integration" |
| Frontend development progress behind backend | Backend self-tests API first, provides Postman collection to frontend |
| Integration test environment unavailable | Degrade to local integration verification, mark "integration environment pending verification" |
| Parallel construction branch failure | Do not block the other branch; failed branch fixes and enters integration separately |
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
| PRD | pm-design related orchestrator | PRD is the business basis for product-launch-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (insight-orchestrator, api-design-orchestrator, release-orchestrator...) produce domain-specific outputs |

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
