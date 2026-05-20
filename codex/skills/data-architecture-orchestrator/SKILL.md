---
name: data-architecture-orchestrator
description: "Use when designing data models, planning data architecture, or designing cache and migration schemes. Data architecture commander, orchestrating the complete flow of data-architecture-spec (design) and data-architecture-impl (implementation), ensuring data architecture is reasonable, migratable, and high-performance, with design outputs reviewed by humans before code generation. Keywords: data architecture, data model, data migration, cache strategy, database design, data scheme, code generation."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Data Architecture"
  type: "orchestrator"
  version: "5.0"
  domain_tags: ["E-commerce", "SaaS", "Finance", "Logistics", "General"]
  trigger_examples:
    - "Design data models"
    - "Plan data architecture"
    - "Design cache strategy"
    - "Plan data migration scheme"
---

# Data Architecture Orchestrator

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../../codex-templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## Core Principles

Data is the system foundation, models determine the ceiling, caching determines the floor. Design first, review then implement.

1. **Model First**: Design data models first, then design caching and migration
2. **Migration Safety**: Every change is reversible, no data loss
3. **Cache On-Demand**: Add caching only when there are performance bottlenecks, no over-engineering
4. **Consistency Explicit**: Cache and database consistency strategies explicitly defined
5. **Design Review**: Design outputs must be reviewed and confirmed by humans before entering code implementation

## Orchestration Protocol

> Protocol source: [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md) (for maintainers tracking only, this file has the complete protocol inlined and can be used independently)

You are an orchestrator, responsible for **dispatching sub-Skills by stage**, not proxy-executing sub-Skill logic. Strictly follow the protocol below:

### Invocation Rules

1. **Explicit Invocation**: Use the `Skill` tool to invoke sub-Skills, passing input data and receiving output results
2. **No Proxy Execution**: Do not read sub-Skill SKILL.md to substitute execution, do not self-infer sub-Skill internal logic
3. **Contract-Driven**: Only focus on sub-Skill input contracts, output contracts, and validation conditions, not internal implementation
4. **State Transfer**: Pass current stage output as next stage input, transfer data via file paths
5. **Validate Before Proceeding**: Only advance to next stage after current stage output validation passes
6. **Stage Summary (Mandatory)**: After all Pipeline stages complete, **must immediately** execute the `post_pipeline` defined stage summary action to generate summary document. This is not optional; if stage summary is not generated, orchestrator execution is considered incomplete.
7. **Cross-Sub-Skill Validation**: When consistency constraints exist between outputs of multiple sub-Skills, the orchestrator may perform cross-validation between stages (reading multiple outputs to compare consistency). This is the orchestrator's coordination responsibility, not proxy-executing sub-Skill logic. Cross-validation rules are explicitly defined in the orchestrator SKILL.md.

### Context Management

- After each sub-Skill invocation completes, only retain **output file paths** and **key conclusion summaries**
- Detailed outputs written to `output/{domain-path}/{skill-name}/` directory
- If context approaches limits, prioritize retaining current stage content and pending stage sub-Skill names

### Stage Gate Standards

The orchestrator's stage gates only validate the following 3 categories of conditions, not sub-Skill internal fields:

| Gate Type | Validation Content | Example |
|-----------|-------------------|---------|
| Output Existence | Output files generated and non-empty | "data-architecture-spec output files generated" |
| Top-level Structure Integrity | JSON top-level required fields exist | "prd.json contains features/pages/entities" |
| Human Decision Confirmation | Key decision points have human confirmation | "Design review human confirmation passed" |

### General Exception Handling

| Exception Type | Handling Strategy |
|---------------|-------------------|
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestrator completion |
| Key decision point lacks human confirmation | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| Upstream data missing | Mark missing data items, fill with reasonable assumptions (mark confidence <=0.3), continue execution and highlight in output |
| All upstream data missing | Mark "all data missing" status, output minimal template, set overall confidence to 0.3, force human confirmation whether to continue |

## Pipeline Definition

```yaml
pipeline: data-architecture-orchestrator
version: 5.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/data-architecture-orchestrator.md

stages:
  - id: phase-1
    name: "Data Architecture Design Specification"
    skills:
      - data-architecture-spec
    gate:
      condition: "data-architecture-spec output files generated and non-empty + human review passed"
      fail_action: "Missing items must be supplemented"

  - id: phase-2
    name: "Data Layer Code Implementation"
    depends_on: [phase-1]
    skills:
      - data-architecture-impl
    gate:
      condition: "data-architecture-impl output files generated and non-empty + human confirmation passed"
      fail_action: "Missing items supplemented then re-validated"
```

## Stage Execution Plan

#### Stage 1: Data Architecture Design Specification

#### Invoke data-architecture-spec

```
Skill: data-architecture-spec
Input:
  PRD: output/pm-design/design-prd/prd.md
  PRD Structured Data: output/pm-design/design-prd/prd.json
  Architecture Plan: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  Service Data Ownership: output/backend-architecture/backend-architecture-spec/service_data_ownership.json
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  API Contract: output/backend-api-design/api-design-spec/openapi.yaml (optional)
  Data Volume Estimate: User provided (optional)
  Concurrency Estimate: User provided (optional)
  Current Schema: User provided (optional)
Output: output/backend-data-architecture/data-architecture-spec/
Validation: ER diagram + DDL + data dictionary + cache strategy + migration plan complete
Mode: AI->Human
Internal Steps:
  1. Business data dictionary extraction: Extract business data entity definitions from PRD
  2. Entity identification and relationship modeling: Partition ER diagram by service data ownership
  3. Table structure and index design: DDL + index strategy + architecture constraint adaptation
  4. Cache strategy design: Multi-level caching + penetration/breakdown/avalanche protection
  5. Data migration plan: Migration + rollback scripts
```

**Design Review Gate**: ER diagram + DDL + data dictionary + cache strategy + migration plan complete -> Human reviews design output -> After review passes, enter code implementation

#### Stage 2: Data Layer Code Implementation

#### Invoke data-architecture-impl

```
Skill: data-architecture-impl
Input:
  ER Model: output/backend-data-architecture/data-architecture-spec/er_model.json
  Cache Strategy: output/backend-data-architecture/data-architecture-spec/cache_strategy.json
  Migration Plan: output/backend-data-architecture/data-architecture-spec/migration_plan.json (optional)
  API Contract: output/backend-api-design/api-design-spec/openapi.yaml (optional, for API alignment check)
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  project_dir: User provided
  tech_stack: User provided (optional, used when tech_stack_decision.json not available)
Output: output/backend-data-architecture/data-architecture-impl/ + code written to {project_dir}/src/
Validation: Code compiles, Migrations executable, code self-review P0=0
Mode: AI->Human
Internal Steps:
  1. Model code generation: models/entities + database configuration
  2. Migration and seed data generation: Migration scripts + seed data
  3. Repository code generation: CRUD + common queries
  4. Cache layer code generation: Redis + CacheRepository
  5. Alignment check and code self-review: API alignment (optional) + DDL consistency + cache alignment + N+1 check
  6. Data layer test code generation: Model + Repository + Migration tests
```

### Stage Summary (post_pipeline)

After all sub-Skills complete, must generate stage summary document, written to `output/phase-reports/backend/data-architecture-orchestrator.md`, containing the following 6 structures (none can be empty):

1. **Execution Overview**: Orchestrator name and version, execution time, sub-Skill execution status (success/failure/degraded)
2. **Key Findings**: Core output summary for each sub-Skill (1-3 items), cross-sub-Skill insights
3. **Decision Records**: Human decision points and decision results, AI automatic decisions and basis
4. **Output Inventory**: All output file paths and content summaries, output quality assessment (whether validation passed)
5. **Risks and TODOs**: Items that failed validation, items executed with degradation, recommended follow-up items
6. **Downstream Handoff**: Which downstream orchestrators can consume this orchestrator's outputs, recommended next orchestrator

| Parameter | Value |
|-----------|-------|
| Sub-Skill output path | output/backend-data-architecture/ |
| Summary output path | output/phase-reports/backend/data-architecture-orchestrator.md |
| Approval record path | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

Downstream handoff:
  primary: api-design-orchestrator (After data model is determined, enter API design)
  alternatives:
    - target: backend-architecture-orchestrator
      reason: When data architecture needs adjustment, may need to revisit architecture plan
      condition: Data architecture design finds architecture constraints unreasonable + need to adjust architecture plan
  special_cases:
    - target: data-architecture-spec
      reason: Only need data architecture design, no code implementation needed
      condition: Only need to design data models and cache strategy, no full orchestration flow needed

## Stage Gates

| Gate | Condition | Failure Handling |
|------|-----------|-----------------|
| Data architecture design complete | data-architecture-spec output files generated and non-empty + human review passed | Missing items must be supplemented |
| Data layer code implementation complete | data-architecture-impl output files generated and non-empty + human confirmation passed | Missing items supplemented then re-validated |
| Stage summary generated | output/phase-reports/backend/data-architecture-orchestrator.md generated and all 6 structures non-empty | Supplement missing structure items then regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|---------------|-------------------|-----------------|
| Data entity and service ownership confirmation | During data-architecture-spec execution | Confirm which service/bounded context each data entity belongs to, data ownership consistent with architecture plan |
| Normalization vs denormalization | During data-architecture-spec execution | Read/write ratio determines, human confirms balance point |
| Database sharding strategy | During data-architecture-spec execution | Affects cost and complexity, human confirmation |
| Cache consistency level | During data-architecture-spec execution | Strong consistency vs eventual consistency, human confirmation |
| Migration execution time | During data-architecture-spec execution | Off-peak window, human confirmation |
| Design review confirmation | After data-architecture-spec completes | Review whether data architecture design meets requirements, confirm before entering code implementation |
| Data migration execution confirmation | After data-architecture-impl output completes | Migration plan and rollback scripts generated, human confirms whether to execute migration |

## Exception Handling

| Exception Type | Handling Strategy |
|---------------|-------------------|
| Architecture plan missing | Default monolithic architecture, all entities in same database, mark "architecture constraints pending confirmation" |
| Service data ownership missing | Infer entity ownership from PRD, mark "service ownership pending confirmation", human confirms then supplements |
| PRD data requirements unclear | Infer data entities based on service data ownership, mark "inferred values" |
| Data volume estimate missing | Use conservative estimates, mark "estimate pending verification" |
| Cache consistency strategy conflict | Mark conflict items, provide strong consistency and eventual consistency dual-plan, human decision |
| Migration rollback script generation failed | Block migration execution, must manually write rollback scripts |
| Database sharding strategy uncertain | Provide single-table + sharded dual-plan comparison, human decision |
| Design review not passed | Adjust design based on human feedback, re-review |
| Code self-review P0 issues | Auto-fix then re-review, block output if unfixable |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestrator completion |

## Standalone Usage Input Acquisition Strategy

### Standalone Trigger Scenario Identification

When this orchestrator is invoked directly (not through backend-orchestrator orchestration), it is considered a standalone trigger scenario. Typical trigger methods:
- User directly requests "design data models" or "plan data architecture"
- Triggered as an independent skill by external systems
- Upstream orchestrator not executed, but user only needs data architecture design capability

### Required Input Acquisition Strategy

| Required Input | Priority: Read from output/ | Fallback: Get from user conversation | Last Resort: AI knowledge base inference |
|---------------|---------------------------|-------------------------------------|---------------------------------------|
| PRD (prd.md) | Read output/pm-design/design-prd/prd.md | Ask user for PRD document or verbal requirements | Infer requirements document from user description (low confidence, mark "PRD is AI-inferred") |
| PRD Structured Data (prd.json) | Read output/pm-design/design-prd/prd.json | Ask user for structured requirements | Extract structured data from PRD document (low confidence) |
| Architecture Plan (architecture_decision.json) | Read output/backend-architecture/backend-architecture-spec/architecture_decision.json | Ask user for architecture plan | Default monolithic architecture, all entities in same database (low confidence, mark "architecture constraints pending confirmation") |
| Service Data Ownership (service_data_ownership.json) | Read output/backend-architecture/backend-architecture-spec/service_data_ownership.json | Ask user for service data ownership | Infer entity ownership from PRD (low confidence, mark "service ownership pending confirmation") |
| Tech Stack Decision (tech_stack_decision.json) | Read output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | Ask user for tech stack decision | Default common tech stack (low confidence, mark "tech stack pending confirmation") |
| project_dir | — | Ask user for project directory path | Cannot infer, user must provide |
| tech_stack | — | Ask user for tech stack | Read tech_stack_decision.json or default to common tech stack (low confidence) |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest user execute upstream orchestrators in the following priority:

| Missing Input | Suggested Upstream Orchestrator | Description |
|--------------|-------------------------------|-------------|
| PRD + PRD Structured Data | pm-design related orchestrator | PRD is the business source for data architecture design, missing will result in data entity identification without basis |
| Architecture Plan + Service Data Ownership + Tech Stack Decision | backend-architecture-orchestrator | Architecture plan determines database sharding strategy, service data ownership determines entity partitioning, tech stack determines ORM and database selection |

Backtracking suggestion output format:
```
Critical input missing detected, suggest executing upstream orchestrator first:
1. [Priority] backend-architecture-orchestrator -> Produces architecture plan, service data ownership, and tech stack decision
2. [Recommended] pm-design related orchestrator -> Produces PRD
Continue with AI-inferred values? (Inferred values confidence <=0.3, outputs require additional human review)
```

### Standalone Usage Gate

When triggered standalone, must pass the following additional checks before executing Pipeline:

| Gate Item | Check Content | Failure Handling |
|-----------|--------------|-----------------|
| PRD existence | prd.md or equivalent requirements document available | Block execution, suggest user execute pm-design orchestrator or provide PRD |
| Architecture plan existence | architecture_decision.json available or inferable | Degraded execution, default monolithic architecture, mark "architecture plan missing, using default monolithic architecture" |
| Service data ownership existence | service_data_ownership.json available or inferable | Degraded execution, infer entity ownership from PRD, mark "service ownership pending confirmation" |
| Tech stack decision existence | tech_stack_decision.json available or inferable | Degraded execution, default common tech stack, mark "tech stack pending confirmation" |
| project_dir validity | User provided valid project directory path | Block execution, user must provide valid project_dir |
| Input confidence assessment | All required input acquisition methods determined, overall confidence >=0.5 | When confidence <0.5, force human confirmation whether to continue execution |

Gate execution order: PRD existence -> project_dir validity -> Architecture plan existence -> Service data ownership existence -> Tech stack decision existence -> Input confidence assessment
