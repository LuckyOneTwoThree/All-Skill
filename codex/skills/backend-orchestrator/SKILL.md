---
name: backend-orchestrator
description: "Use when completing the full backend flow from design to code implementation. Backend full-flow commander, orchestrating the two-phase flow of 'design all first, then implement uniformly': design phase produces specifications in architecture->data->API order, after unified design review, implementation phase generates runnable code in data->API->architecture order. Keywords: backend full flow, backend development, backend design+implementation, backend overall solution."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Full Flow Orchestration"
  type: "orchestrator"
  version: "5.0"
  domain_tags: ["E-commerce", "SaaS", "Finance", "General"]
  trigger_examples:
    - "Complete backend development full flow"
    - "From design to code in one step"
    - "Backend overall solution design and implementation"
    - "Build backend from scratch"
---

# Backend Full-Flow Orchestrator

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../../codex-templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## Core Principles

Architecture constraints first, data-driven contracts, design review closed-loop, implementation step-by-step compilable.

1. **Architecture Constraints First**: Architecture decisions fundamentally affect data models and API design, must be determined first
2. **Data-Driven Contracts**: API contracts designed based on confirmed data models, field definitions evidence-based
3. **Design All First Then Implement Uniformly**: Design phase only produces documents, three designs cross-validated then uniformly reviewed, avoiding design conflicts causing code rework
4. **Implementation Step-by-Step Compilable**: Implementation phase in data->API->architecture order, each step's output can independently compile and run

## Execution Steps

1. **Design Phase Serial**: Architecture->Data->API, later step consumes earlier step's output
2. **Unified Design Review**: Orchestrator reads three design outputs and performs cross-validation, ensures consistency then human unified confirmation
3. **Implementation Phase Serial**: Data->API->Architecture, each step compilable
4. **Final Validation**: Project can start, health check passes

## Orchestration Protocol

> Protocol source: [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md) (for maintainers tracking only, this file has the complete protocol inlined and can be used independently)

You are an orchestrator, responsible for **dispatching sub-Skills by stage**, not proxy-executing sub-Skill logic. Strictly follow the protocol below:

### Invocation Rules

1. **Dual-Mode Invocation**: When the platform supports the Skill tool, explicitly invoke sub-Skills; when the platform does not support it, execute compatible dispatching based on sub-Skill's `name`, input contract, output contract, and stage gates.
2. **No Proxy Expansion**: During compatible dispatching, do not copy sub-Skill internal methodology into orchestrator context, nor rewrite sub-Skill logic; only pass necessary input, output paths, and validation conditions.
3. **Contract-Driven**: Only focus on sub-Skill input contracts, output contracts, and validation conditions, not internal implementation details.
4. **State Transfer**: Pass current stage output as next stage input, transfer data via file paths and artifact index.
5. **Validate Before Proceeding**: Only advance to next stage after current stage output validation passes.
6. **Stage Summary (Mandatory)**: After all Pipeline stages complete, **must immediately** execute the `post_pipeline` defined stage summary action to generate summary document. This is not optional; if stage summary is not generated, orchestrator execution is considered incomplete.
7. **Cross-Sub-Skill Validation**: When consistency constraints exist between outputs of multiple sub-Skills, the orchestrator may perform cross-validation between stages (reading multiple outputs to compare consistency). This is the orchestrator's coordination responsibility, not proxy-executing sub-Skill logic. Cross-validation rules are explicitly defined in the orchestrator SKILL.md.

### Context Management

- After each sub-Skill invocation completes, only retain **output file paths** and **key conclusion summaries**
- Detailed outputs written to each sub-Skill's domain-native output directory, such as `output/backend-architecture/backend-architecture-spec/`
- If context approaches limits, prioritize retaining current stage content and pending stage sub-Skill names

### Stage Gate Standards

The orchestrator's stage gates only validate the following 3 categories of conditions, not sub-Skill internal fields:

| Gate Type | Validation Content | Example |
|-----------|-------------------|---------|
| Output Existence | Output files generated and non-empty | "api-design-spec output files generated" |
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
pipeline: backend-orchestrator
version: 5.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/backend-orchestrator.md

stages:
  - id: arch-design
    name: "Architecture Design"
    skills:
      - backend-architecture-spec
    gate:
      condition: "backend-architecture-spec output files generated and non-empty + human review passed"
      fail_action: "Missing items must be supplemented"

  - id: data-design
    name: "Data Architecture Design"
    depends_on: [arch-design]
    skills:
      - data-architecture-spec
    gate:
      condition: "data-architecture-spec output files generated and non-empty + human review passed"
      fail_action: "Missing items must be supplemented"

  - id: api-design
    name: "API Design"
    depends_on: [data-design]
    skills:
      - api-design-spec
    gate:
      condition: "api-design-spec output files generated and non-empty + human review passed"
      fail_action: "Missing items must be supplemented"

  - id: design-review
    name: "Unified Design Review"
    depends_on: [arch-design, data-design, api-design]
    type: cross-validation
    validation_rules:
      - id: api-er-alignment
        name: "API Resource <-> ER Model Alignment"
        check: "Each API resource has corresponding ER model entity, API fields 100% have Model field support"
        fail_action: "Supplement missing entities or fields"
      - id: api-service-alignment
        name: "API Grouping <-> Service Boundary Consistency"
        check: "APIs grouped by bounded context, consistent with service design"
        fail_action: "Adjust API grouping or service boundaries"
      - id: tech-stack-consistency
        name: "Tech Stack Consistency"
        check: "Tech stack referenced across three design outputs is unified"
        fail_action: "Unify tech stack decision"
      - id: cache-api-alignment
        name: "Cache Strategy <-> API Access Pattern Alignment"
        check: "High-frequency APIs have corresponding cache strategies"
        fail_action: "Supplement cache strategies"
      - id: data-api-ownership
        name: "Data Ownership <-> API Ownership Consistency"
        check: "Service owning API resource is consistent with service owning data"
        fail_action: "Adjust ownership relationships"
    output: output/backend-design-review/review-report.json
    gate:
      condition: "Cross-validation all passed + human unified confirmation"
      fail_action: "Inconsistent items must be corrected then re-reviewed"

  - id: data-impl
    name: "Data Layer Implementation"
    depends_on: [design-review]
    skills:
      - data-architecture-impl
    gate:
      condition: "data-architecture-impl output files generated and non-empty + human confirmation passed"
      fail_action: "Missing items supplemented then re-validated"

  - id: api-impl
    name: "API Layer Implementation"
    depends_on: [data-impl]
    skills:
      - api-design-impl
    gate:
      condition: "api-design-impl output files generated and non-empty + human confirmation passed"
      fail_action: "Missing items supplemented then re-validated"

  - id: arch-impl
    name: "Architecture Layer Implementation"
    depends_on: [api-impl]
    skills:
      - backend-architecture-impl
    gate:
      condition: "backend-architecture-impl output files generated and non-empty + human confirmation passed"
      fail_action: "Missing items supplemented then re-validated"
```

## Stage Execution Plan

### Phase A: Full Design

#### A1: Architecture Design -> Invoke backend-architecture-spec

```
Skill: backend-architecture-spec
Input:
  PRD: output/pm-design/design-prd/prd.md
  PRD Structured Data: output/pm-design/design-prd/prd.json
  Business Scale: User provided
  Technical Constraints: User provided (optional)
Output: output/backend-architecture/backend-architecture-spec/
Key Outputs:
  - architecture_decision.json -- Architecture plan + topology diagram
  - service_design.json -- Service division + bounded contexts
  - service_data_ownership.json -- Service data ownership (for data-architecture-spec consumption)
  - tech_stack_decision.json -- Tech stack decision (for all impl Skills unified consumption)
  - adr.json -- Architecture Decision Records
  - review_report.json -- Review issue list
  - tech_debt_register.json -- Tech debt register
Validation: Output files generated and non-empty
Mode: AI->Human
```

**Architecture Design Review Gate**

#### A2: Data Architecture Design -> Invoke data-architecture-spec

```
Skill: data-architecture-spec
Input:
  PRD: output/pm-design/design-prd/prd.md
  PRD Structured Data: output/pm-design/design-prd/prd.json
  Architecture Plan: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  Service Data Ownership: output/backend-architecture/backend-architecture-spec/service_data_ownership.json
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  Data Volume Estimate: User provided (optional)
  Concurrency Estimate: User provided (optional)
  Current Schema: User provided (optional)
Output: output/backend-data-architecture/data-architecture-spec/
Key Outputs:
  - data_dictionary.json -- Business data dictionary
  - er_model.json -- ER model + DDL + index strategy
  - cache_strategy.json -- Cache scheme
  - migration_plan.json -- Migration plan (incremental projects)
Validation: Output files generated and non-empty
Mode: AI->Human
```

**Data Architecture Design Review Gate**

#### A3: API Design -> Invoke api-design-spec

```
Skill: api-design-spec
Input:
  PRD: output/pm-design/design-prd/prd.md
  PRD Structured Data: output/pm-design/design-prd/prd.json
  Data Model: output/backend-data-architecture/data-architecture-spec/er_model.json
  Business Data Dictionary: output/backend-data-architecture/data-architecture-spec/data_dictionary.json (optional)
  Architecture Plan: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  Service Design: output/backend-architecture/backend-architecture-spec/service_design.json
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json (optional)
  Business Process: output/pm-design/design-userflow/userflow.json (optional)
  Security Level: User provided
  Compliance Requirements: User provided (optional)
  Multi-tenant Requirements: User provided (optional)
  Frontend Page Data Requirements: output/ui-frontend/page-builder/pages.json (optional)
Output: output/backend-api-design/api-design-spec/
Key Outputs:
  - openapi.yaml -- OpenAPI 3.0 specification
  - security-policy.json -- Security policy
  - auth-scheme.json -- Authentication and authorization scheme
  - compliance-checklist.json -- Compliance checklist
  - api-coverage.json -- PRD/frontend alignment coverage report
Validation: Output files generated and non-empty
Mode: AI->Human
```

#### A4: Unified Design Review -> Orchestrator Executes Cross-Validation

After three design outputs are complete, the orchestrator reads three outputs and performs cross-sub-Skill validation:

```
Action: Unified Design Review (orchestrator coordination responsibility)
Input:
  Architecture Plan: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  Service Design: output/backend-architecture/backend-architecture-spec/service_design.json
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  ER Model: output/backend-data-architecture/data-architecture-spec/er_model.json
  Cache Strategy: output/backend-data-architecture/data-architecture-spec/cache_strategy.json
  OpenAPI Specification: output/backend-api-design/api-design-spec/openapi.yaml
Output: output/backend-design-review/review-report.json
Validation Rules:
  - API Resource <-> ER Model Alignment: Each API resource has corresponding ER model entity, API fields 100% have Model field support
  - API Grouping <-> Service Boundary Consistency: APIs grouped by bounded context, consistent with service design
  - Tech Stack Consistency: Tech stack referenced across three design outputs is unified
  - Cache Strategy <-> API Access Pattern Alignment: High-frequency APIs have corresponding cache strategies
  - Data Ownership <-> API Ownership Consistency: Service owning API resource is consistent with service owning data
Validation: Cross-validation all passed + human unified confirmation
Mode: AI->Human
```

**Unified Design Review Gate**: Cross-validation all passed + human unified confirmation -> Inconsistent items corrected then re-reviewed

### Phase B: Unified Implementation

#### B1: Data Layer Implementation -> Invoke data-architecture-impl

```
Skill: data-architecture-impl
Input:
  ER Model: output/backend-data-architecture/data-architecture-spec/er_model.json
  Cache Strategy: output/backend-data-architecture/data-architecture-spec/cache_strategy.json
  Migration Plan: output/backend-data-architecture/data-architecture-spec/migration_plan.json (optional)
  API Contract: output/backend-api-design/api-design-spec/openapi.yaml (optional, for API alignment check)
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  project_dir: User provided
Output: Code written to {project_dir}/src/ + metadata output/backend-data-architecture/data-architecture-impl/
Validation: Output files generated and non-empty
Mode: AI->Human
```

#### B2: API Layer Implementation -> Invoke api-design-impl

```
Skill: api-design-impl
Input:
  OpenAPI Specification: output/backend-api-design/api-design-spec/openapi.yaml
  Security Policy: output/backend-api-design/api-design-spec/security-policy.json
  Authentication & Authorization Scheme: output/backend-api-design/api-design-spec/auth-scheme.json
  Compliance Checklist: output/backend-api-design/api-design-spec/compliance-checklist.json (optional)
  PRD: output/pm-design/design-prd/prd.md
  PRD Structured Data: output/pm-design/design-prd/prd.json
  Data Model: output/backend-data-architecture/data-architecture-spec/er_model.json
  Data Layer Implementation Report: output/backend-data-architecture/data-architecture-impl/impl-report.json
  Frontend Page Data Requirements: output/ui-frontend/page-builder/pages.json (optional)
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  project_dir: User provided
Output: Code written to {project_dir}/src/ + metadata output/backend-api-design/api-design-impl/
Validation: Output files generated and non-empty
Mode: AI->Human
```

#### B3: Architecture Layer Implementation -> Invoke backend-architecture-impl

```
Skill: backend-architecture-impl
Input:
  Architecture Plan: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  Service Design: output/backend-architecture/backend-architecture-spec/service_design.json
  ADR: output/backend-architecture/backend-architecture-spec/adr.json
  Review Report: output/backend-architecture/backend-architecture-spec/review_report.json (optional)
  Tech Debt Register: output/backend-architecture/backend-architecture-spec/tech_debt_register.json (optional)
  API Contract: output/backend-api-design/api-design-spec/openapi.yaml
  Data Model: output/backend-data-architecture/data-architecture-spec/er_model.json
  Cache Strategy: output/backend-data-architecture/data-architecture-spec/cache_strategy.json (optional)
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  project_dir: User provided
Output: Code written to {project_dir}/ + metadata output/backend-architecture/backend-architecture-impl/
Validation: Output files generated and non-empty
Mode: AI->Human
```

### Stage Summary (post_pipeline)

After all sub-Skills complete, must generate stage summary document, written to `output/phase-reports/backend/backend-orchestrator.md`, containing the following 6 structures (none can be empty):

1. **Execution Overview**: Orchestrator name and version, execution time, sub-Skill execution status (success/failure/degraded)
2. **Key Findings**: Core output summary for each sub-Skill (1-3 items), cross-sub-Skill insights
3. **Decision Records**: Human decision points and decision results, AI automatic decisions and basis
4. **Output Inventory**: All output file paths and content summaries, output quality assessment (whether validation passed)
5. **Risks and TODOs**: Items that failed validation, items executed with degradation, recommended follow-up items
6. **Downstream Handoff**: Which downstream orchestrators can consume this orchestrator's outputs, recommended next orchestrator

| Parameter | Value |
|-----------|-------|
| Sub-Skill output path | output/backend-architecture/ + output/backend-data-architecture/ + output/backend-api-design/ + output/backend-design-review/ |
| Summary output path | output/phase-reports/backend/backend-orchestrator.md |
| Approval record path | output/approvals/backend-orchestrator/<stage-id>.approval.json |

Downstream handoff:
  primary: release-orchestrator (After backend full flow completes, enter quality acceptance and release flow)
  alternatives:
    - target: ui-orchestrator
      reason: After backend is ready, start UI frontend development and integration
      condition: Frontend not yet developed + need backend API support
  special_cases:
    - target: api-design-spec
      reason: Only need to supplement API design, no full backend flow needed
      condition: Architecture and data layer ready, only need API design, no full orchestration flow needed

## Stage Gates

| Gate | Condition | Failure Handling |
|------|-----------|-----------------|
| Architecture design complete | backend-architecture-spec output files generated and non-empty + human review passed | Missing items must be supplemented |
| Data architecture design complete | data-architecture-spec output files generated and non-empty + human review passed | Missing items must be supplemented |
| API design complete | api-design-spec output files generated and non-empty + human review passed | Missing items must be supplemented |
| Unified design review passed | Cross-validation all passed + human unified confirmation | Inconsistent items corrected then re-reviewed |
| Data layer implementation complete | data-architecture-impl output files generated and non-empty + human confirmation passed | Missing items supplemented then re-validated |
| API layer implementation complete | api-design-impl output files generated and non-empty + human confirmation passed | Missing items supplemented then re-validated |
| Architecture layer implementation complete | backend-architecture-impl output files generated and non-empty + human confirmation passed | Missing items supplemented then re-validated |
| Stage summary generated | output/phase-reports/backend/backend-orchestrator.md generated and all 6 structures non-empty | Supplement missing structure items then regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|---------------|-------------------|-----------------|
| Architecture pattern selection | During backend-architecture-spec execution | Monolithic/Microservices/Serverless, human final confirmation |
| Service division granularity | During backend-architecture-spec execution | Too fine increases complexity, too coarse loses flexibility |
| Tech stack confirmation | During backend-architecture-spec execution | Confirm unified tech stack decision, affects all subsequent implementation |
| Normalization vs denormalization | During data-architecture-spec execution | Read/write ratio determines, human confirms balance point |
| Cache consistency level | During data-architecture-spec execution | Strong consistency vs eventual consistency, human confirmation |
| API style selection | During api-design-spec execution | RESTful vs GraphQL, human confirmation |
| Security level confirmation | During api-design-spec execution | Standard vs high security, affects rate limiting/encryption/audit strategy |
| Unified design review confirmation | After three designs complete | Review consistency of three designs, confirm before entering implementation |
| Data migration execution confirmation | After data-architecture-impl output completes | Migration plan and rollback scripts generated, human confirms whether to execute migration |
| Architecture readiness confirmation | After backend-architecture-impl review passes | Code implementation complete, human confirms architecture is ready for development |

## Exception Handling

| Exception Type | Handling Strategy |
|---------------|-------------------|
| Architecture pattern dispute | Provide monolithic + microservices dual-plan comparison, human decision |
| Service circular dependency | Auto-detect and alert, must eliminate before entering review |
| Data model and API conflict | Resolve in unified design review phase, adjust API based on data model |
| Design review not passed | Adjust design based on human feedback, re-review |
| Code self-review P0 issues | Auto-fix then re-review, block output if unfixable |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestrator completion |

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
| Business Scale | — | Ask user for business scale | Default medium scale (low confidence, mark "scale pending confirmation") |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest user execute upstream orchestrators in the following priority:

| Missing Input | Suggested Upstream Orchestrator | Description |
|--------------|-------------------------------|-------------|
| PRD | pm-design related orchestrator | PRD is the business basis for backend-orchestrator, missing will result in execution without business foundation |

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
