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

## Changelog

- v4.0: Split data-architecture into data-architecture-spec (design) + data-architecture-impl (implementation), added design review gate
- v3.0: Added code generation capability (models/migrations/repositories), implemented design+code dual output mode
- v2.0: Merged data-model, cache-strategy, data-migration into single data-architecture skill
- v1.0: Initial version
