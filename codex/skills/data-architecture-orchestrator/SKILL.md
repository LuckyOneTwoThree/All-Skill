---
name: data-architecture-orchestrator
description: "Use when designing data models, planning data architecture, or designing cache and migration strategies. Orchestrates data-architecture-spec and data-architecture-impl sub-skills with human review before code generation. Keywords: data architecture, data model, data migration, cache strategy, database design."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Data Architecture"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Design data models"
    - "Plan data architecture"
    - "Design cache strategies"
    - "Plan data migration schemes"
---

# Data Architecture Orchestrator

## Core Principles

Data is the foundation of the system; models determine the upper limit, caching determines the lower limit. Design first, implement after review.

## Execution Steps

1. **Model First**: Design data models first, then caching and migration
2. **Migration Safety**: Every change is rollbackable, no data loss
3. **Cache On Demand**: Add caching only when there are performance bottlenecks, avoid over-engineering
4. **Explicit Consistency**: Cache-database consistency strategies must be explicitly defined
5. **Design Review**: Design outputs must pass human review before entering code implementation

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline Definition

```yaml
pipeline: data-architecture-orchestrator
version: 4.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/data-architecture-orchestrator.md

stages:
  - id: phase-1
    name: "Data Architecture Design Specification"
    skills:
      - data-architecture-spec
    gate:
      condition: "ER diagram+DDL+data dictionary+cache strategy+migration plan complete + human review passed"
      fail_action: "Missing items must be supplemented"

  - id: phase-2
    name: "Data Layer Code Implementation"
    depends_on: [phase-1]
    skills:
      - data-architecture-impl
    gate:
      condition: "Code compiles + Migration executable + API data requirements 100% covered + Code self-audit P0=0 + Human confirmation passed"
      fail_action: "Supplement missing items and re-verify"
```

## Stage Execution Plan

#### Stage 1: Data Architecture Design Specification

#### Invoke data-architecture-spec

```
Invoke: ${data-architecture-spec}
Input:
  PRD: output/pm-design/design-prd/prd.md
  PRD structured data: output/pm-design/design-prd/prd.json
  API contract: output/backend-api-design/api-design-spec/openapi.yaml
  database_type: user provided
  Data volume estimate: user provided (optional)
  Concurrency estimate: user provided (optional)
  Current Schema: user provided (optional)
Output: output/backend-data-architecture/data-architecture-spec/
Validation: ER diagram+DDL+data dictionary+cache strategy+migration plan complete
Mode: AI->Human
Internal steps:
  1. Business data dictionary extraction: Extract business data entity definitions from PRD
  2. Entity identification and relationship modeling: Design ER diagram
  3. Table structure and index design: DDL+index strategy
  4. Cache strategy design: Multi-level cache+penetration/breakdown/avalanche protection
  5. Data migration plan: Migration+rollback scripts
```

[GATE] **Design Review Gate**: ER diagram+DDL+data dictionary+cache strategy+migration plan complete -> Human reviews design output -> Enter code implementation after review passes

#### Stage 2: Data Layer Code Implementation

#### Invoke data-architecture-impl

```
Invoke: ${data-architecture-impl}
Input:
  ER model: output/backend-data-architecture/data-architecture-spec/er_model.json
  Cache strategy: output/backend-data-architecture/data-architecture-spec/cache_strategy.json
  Migration plan: output/backend-data-architecture/data-architecture-spec/migration_plan.json (optional)
  API contract: output/backend-api-design/api-design-spec/openapi.yaml
  project_dir: user provided
  tech_stack: user provided
  database_type: user provided
Output: output/backend-data-architecture/data-architecture-impl/ + Code written to {project_dir}/src/
Validation: Code compiles, Migration executable, API data requirements 100% covered, Code self-audit P0=0
Mode: AI->Human
Internal steps:
  1. Model code generation: models/entities+database configuration
  2. Migration and seed data generation: Migration scripts+seed data
  3. Repository code generation: CRUD+common queries
  4. Cache layer code generation: Redis+CacheRepository
  5. Alignment check and code self-audit: API alignment+DDL consistency+cache alignment+N+1 check
  6. Data layer test code generation: Model+Repository+Migration tests
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/backend-data-architecture/ |
| Summary output path | output/phase-reports/backend/data-architecture-orchestrator.md |

Downstream connections:
  primary: backend-architecture-orchestrator (After data architecture is complete, enter backend architecture design, designing service architecture based on data models and API contracts)
  alternatives:
    - target: api-design-orchestrator
      reason: Data model changes require reverse-updating API contracts
      condition: When data architecture design finds API contracts need adjustment

## Stage Gates

| Gate | Condition | Action if Not Passed |
|------|------|------------|
| Data architecture design complete | data-architecture-spec output files generated and non-empty | Missing items must be supplemented |
| Design review passed | Human reviews design output and confirms | Redesign based on human feedback |
| Data layer code implementation complete | data-architecture-impl output files generated and non-empty | Supplement missing items and re-verify |
| Stage summary generated | output/phase-reports/backend/data-architecture-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Normalization vs Denormalization | During data-architecture-spec execution | Read-write ratio determines, human confirms balance point |
| Sharding strategy | During data-architecture-spec execution | Affects cost and complexity, human confirms |
| Cache consistency level | During data-architecture-spec execution | Strong consistency vs eventual consistency, human confirms |
| Migration execution time | During data-architecture-spec execution | Off-peak window, human confirms |
| Design review confirmation | After data-architecture-spec completes | Review whether data architecture design meets requirements, confirm before entering code implementation |
| Data migration execution confirmation | After data-architecture-impl output completes | Migration plan and rollback scripts generated, human confirms whether to execute migration |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| PRD data requirements unclear | Infer data entities from API contracts, mark as "inferred value" |
| Data volume estimate missing | Use conservative estimates, mark as "estimate pending verification" |
| Cache consistency strategy conflict | Mark conflicting items, provide both strong and eventual consistency plans, human decides |
| Migration rollback script generation failed | Block migration execution, manual rollback script required |
| Sharding strategy uncertain | Provide single-table + sharded dual-plan comparison, human decides |
| Design review not passed | Adjust design based on human feedback, re-review |
| Code self-audit P0 issues | Auto-fix and re-audit, block output if unfixable |
| Stage summary generation failed | Generate partial summary from completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |

## Standalone Usage Input Acquisition Strategy

### Standalone Trigger Scenario Identification

When this orchestrator is invoked directly (not through backend-orchestrator orchestration), it is considered a standalone trigger scenario. Typical trigger methods:
- User directly requests "Design data models" or "Plan data architecture"
- Triggered as a standalone skill by an external system
- Upstream orchestrators have not been executed, but the user only needs data architecture design capability

### Required Input Acquisition Strategy

| Required Input | Priority: Read from output/ | Fallback: Acquire from user dialog | Last Resort: AI inference |
|----------|------------------------|------------------------|----------------------|
| PRD (prd.md) | Read output/pm-design/design-prd/prd.md | Ask user to provide PRD document or describe requirements verbally | Infer requirements document from user description (⚠️ Low confidence, mark "PRD is AI-inferred") |
| PRD structured data (prd.json) | Read output/pm-design/design-prd/prd.json | Ask user to provide structured requirements | Extract structured data from PRD document (⚠️ Low confidence) |
| Architecture plan (architecture_decision.json) | Read output/backend-architecture/backend-architecture-spec/architecture_decision.json | Ask user to provide architecture plan | Default to monolithic architecture, all entities in the same database (⚠️ Low confidence, mark "Architecture constraints pending confirmation") |
| Service data ownership (service_data_ownership.json) | Read output/backend-architecture/backend-architecture-spec/service_data_ownership.json | Ask user to provide service data ownership | Infer entity ownership from PRD (⚠️ Low confidence, mark "Service ownership pending confirmation") |
| Tech stack decision (tech_stack_decision.json) | Read output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | Ask user to provide tech stack decision | Default to common tech stack (⚠️ Low confidence, mark "Tech stack pending confirmation") |
| project_dir | — | Ask user to provide project directory path | Cannot infer, must be provided by user |
| tech_stack | — | Ask user to provide tech stack | Read tech_stack_decision.json or default to common tech stack (⚠️ Low confidence) |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest the user execute upstream orchestrators in the following priority order:

| Missing Input | Suggested Upstream Orchestrator | Description |
|----------|---------------------|------|
| PRD + PRD structured data | pm-design related orchestrators | PRD is the business source for data architecture design; missing it will result in data entity identification without basis |
| Architecture plan + Service data ownership + Tech stack decision | backend-architecture-orchestrator | Architecture plan determines data sharding strategy, service data ownership determines entity partitioning, tech stack determines ORM and database selection |

Backtracking suggestion output format:
```
⚠️ Critical input missing detected. It is recommended to execute upstream orchestrators first:
1. [Priority] backend-architecture-orchestrator → Produces architecture plan, service data ownership, and tech stack decision
2. [Recommended] pm-design related orchestrators → Produces PRD
Continue with AI-inferred values? (Inferred values have confidence ≤ 0.3, outputs require additional human review)
```

### Standalone Usage Gate

When triggered standalone, the following additional checks must pass before executing the Pipeline:

| Gate Item | Check Content | Action if Not Passed |
|--------|----------|------------|
| PRD existence | prd.md or equivalent requirements document is accessible | Block execution, suggest user execute pm-design orchestrator or provide PRD |
| Architecture plan existence | architecture_decision.json is accessible or inferable | Degrade execution, default to monolithic architecture, mark "Architecture plan missing, using default monolithic architecture" |
| Service data ownership existence | service_data_ownership.json is accessible or inferable | Degrade execution, infer entity ownership from PRD, mark "Service ownership pending confirmation" |
| Tech stack decision existence | tech_stack_decision.json is accessible or inferable | Degrade execution, default to common tech stack, mark "Tech stack pending confirmation" |
| project_dir validity | User provides a valid project directory path | Block execution, user must provide a valid project_dir |
| Input confidence assessment | All required input acquisition methods are determined, overall confidence ≥ 0.5 | If confidence < 0.5, force human confirmation on whether to continue execution |

Gate execution order: PRD existence → project_dir validity → Architecture plan existence → Service data ownership existence → Tech stack decision existence → Input confidence assessment
