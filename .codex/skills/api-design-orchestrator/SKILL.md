---
name: api-design-orchestrator
description: "Use when designing API interfaces, formulating interface specifications, or designing authentication and authorization schemes. API design commander, orchestrating the complete flow of api-design-spec (design) and api-design-impl (implementation), ensuring API design is secure and compliant, with design outputs reviewed by humans before code generation. Keywords: API design, interface contract, API security, authentication, interface design, API specification, interface documentation, code generation."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "API Design"
  type: "orchestrator"
  version: "5.0"
  domain_tags: ["E-commerce", "SaaS", "Finance", "General"]
  trigger_examples:
    - "Design API interfaces"
    - "Formulate API specifications"
    - "Design authentication and authorization schemes"
    - "Generate interface documentation"
---

# API Design Orchestrator

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../../codex-templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## Core Principles

Contract-driven development, security built-in not bolted-on. Design first, review then implement.

1. **Contract First**: Design API contracts first, frontend and backend develop in parallel based on contracts
2. **Security Built-in**: Security policies designed alongside contracts, not patched afterward
3. **Unified Authentication**: Unified authentication scheme, not handled per-interface
4. **Design Review**: Design outputs must be reviewed and confirmed by humans before entering code implementation
5. **Version Management**: APIs support version management from day one

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
| Output Existence | Output files generated and non-empty | "api-design-spec output files generated" |
| Top-level Structure Integrity | JSON top-level required fields exist | "prd.json contains features/pages/entities" |
| Human Decision Confirmation | Key decision points have human confirmation | "Design review human confirmation passed" |

### General Exception Handling

| Exception Type | Handling Strategy |
|---------------|-------------------|
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestrator completion |
| Key decision point lacks human confirmation | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| Upstream data missing | Mark missing data items, fill with reasonable assumptions (mark confidence ≤0.3), continue execution and highlight in output |
| All upstream data missing | Mark "all data missing" status, output minimal template, set overall confidence to 0.3, force human confirmation whether to continue |

## Pipeline Definition

```yaml
pipeline: api-design-orchestrator
version: 5.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/api-design-orchestrator.md

stages:
  - id: phase-1
    name: "API Design Specification"
    skills:
      - api-design-spec
    gate:
      condition: "api-design-spec output files generated and non-empty + human review passed"
      fail_action: "Missing any item blocks"

  - id: phase-2
    name: "API Code Implementation"
    depends_on: [phase-1]
    skills:
      - api-design-impl
    gate:
      condition: "api-design-impl output files generated and non-empty + human confirmation passed"
      fail_action: "Missing items supplemented then re-validated"
```

## Stage Execution Plan

#### Stage 1: API Design Specification

#### Invoke api-design-spec

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
  PRD Page Data Requirements: output/pm-design/design-prd/prd.json -> pages[].data_requirements (optional)
Output: output/backend-api-design/api-design-spec/
Validation: API contract + security policy + authentication scheme complete, compliance check has no P0 issues
Mode: AI->Human
Internal Steps:
  1. Resource identification and modeling: Map API resources directly from ER model, fields precisely projected from Model
  2. Interface and specification design: Design CRUD interfaces + error codes + version strategy + service boundary grouping
  3. Interface security design: L1-L4 classification + rate limiting + data security
  4. Authentication and authorization design: Authentication scheme + permission model + session management
  5. Compliance check: Privacy compliance assessment
```

**Design Review Gate**: API contract + security policy + authentication scheme complete -> Human reviews design output -> After review passes, enter code implementation

#### Stage 2: API Code Implementation

#### Invoke api-design-impl

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
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json (optional)
  project_dir: User provided
  tech_stack: User provided (optional, used when tech_stack_decision.json not available)
Output: output/backend-api-design/api-design-impl/ + code written to {project_dir}/src/
Validation: Code compiles, PRD feature points 100% covered, mappers fully implemented, Service calls real Repository, code self-review P0=0
Mode: AI->Human
Internal Steps:
  1. Code skeleton generation: routes/controllers/validators/types/mappers complete implementation
  2. Service business logic implementation: Business logic + transaction management + real Repository calls (code compiles)
  3. Middleware and security implementation: Authentication/rate limiting/CORS/error handling
  4. Alignment check and code self-review: PRD alignment + frontend alignment + security self-review + Repository call chain verification
  5. API test code generation: Integration test skeletons
```

### Stage Summary (post_pipeline)

After all sub-Skills complete, must generate stage summary document, written to `output/phase-reports/backend/api-design-orchestrator.md`, containing the following 6 structures (none can be empty):

1. **Execution Overview**: Orchestrator name and version, execution time, sub-Skill execution status (success/failure/degraded)
2. **Key Findings**: Core output summary for each sub-Skill (1-3 items), cross-sub-Skill insights
3. **Decision Records**: Human decision points and decision results, AI automatic decisions and basis
4. **Output Inventory**: All output file paths and content summaries, output quality assessment (whether validation passed)
5. **Risks and TODOs**: Items that failed validation, items executed with degradation, recommended follow-up items
6. **Downstream Handoff**: Which downstream orchestrators can consume this orchestrator's outputs, recommended next orchestrator

| Parameter | Value |
|-----------|-------|
| Sub-Skill output path | output/backend-api-design/ |
| Summary output path | output/phase-reports/backend/api-design-orchestrator.md |
| Approval record path | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

Downstream handoff:
  primary: backend-architecture-orchestrator (After API code implementation completes, enter architecture layer code integration and project assembly)
  alternatives:
    - target: ui-orchestrator
      reason: API contracts can be consumed by UI frontend for parallel development
      condition: Frontend and backend parallel development + need API contracts to support frontend
    - target: data-architecture-orchestrator
      reason: When API design finds data model doesn't meet requirements, backtrack to adjust data architecture
      condition: API design phase finds ER model missing or incomplete + need to supplement data architecture
  special_cases:
    - target: api-design-spec
      reason: Only need API design specification, no code implementation needed
      condition: Only need to design interface contracts, no full orchestration flow needed

## Stage Gates

| Gate | Condition | Failure Handling |
|------|-----------|-----------------|
| API design specification complete | api-design-spec output files generated and non-empty + human review passed | Missing any item blocks |
| API code implementation complete | api-design-impl output files generated and non-empty + human confirmation passed | Missing items supplemented then re-validated |
| Stage summary generated | output/phase-reports/backend/api-design-orchestrator.md generated and all 6 structures non-empty | Supplement missing structure items then regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|---------------|-------------------|-----------------|
| API resource and data entity mapping confirmation | During api-design-spec execution | Confirm each API resource has corresponding ER model entity, fields 100% have Model field support |
| API style selection | During api-design-spec execution | RESTful vs GraphQL, human confirmation |
| Security level confirmation | During api-design-spec execution | Standard vs high security, affects rate limiting/encryption/audit strategy |
| Permission model selection | During api-design-spec execution | RBAC vs ABAC, affects permission management complexity |
| Multi-tenant strategy | During api-design-spec execution | Isolation level affects cost and security, human confirmation |
| API version strategy confirmation | During api-design-spec execution | Semantic versioning vs URL versioning, affects compatibility and client upgrade strategy |
| Design review confirmation | After api-design-spec completes | Review whether API design meets requirements, confirm before entering code implementation |

## Exception Handling

| Exception Type | Handling Strategy |
|---------------|-------------------|
| PRD feature points unclear | Mark "feature points pending confirmation", generate TODO interfaces, human supplements |
| Data model missing | Infer data entities from PRD, mark "data model pending confirmation" |
| API style dispute | Provide RESTful and GraphQL dual-plan comparison, human decision |
| Security policy conflict | Mark conflict items, human decision on trade-offs |
| Authentication scheme incompatible | Provide compatible solution, human confirmation |
| Design review not passed | Adjust design based on human feedback, re-review |
| Code self-review P0 issues | Auto-fix then re-review, block output if unfixable |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestrator completion |

## Standalone Usage Input Acquisition Strategy

### Standalone Trigger Scenario Identification

When this orchestrator is invoked directly (not through backend-orchestrator orchestration), it is considered a standalone trigger scenario. Typical trigger methods:
- User directly requests "design API interfaces" or "formulate API specifications"
- Triggered as an independent skill by external systems
- Upstream orchestrator not executed, but user only needs API design capability

### Required Input Acquisition Strategy

| Required Input | Priority: Read from output/ | Fallback: Get from user conversation | Last Resort: AI knowledge base inference |
|---------------|---------------------------|-------------------------------------|---------------------------------------|
| PRD (prd.md) | Read output/pm-design/design-prd/prd.md | Ask user for PRD document or verbal requirements | Infer requirements document from user description (low confidence, mark "PRD is AI-inferred") |
| PRD Structured Data (prd.json) | Read output/pm-design/design-prd/prd.json | Ask user for structured requirements | Extract structured data from PRD document (low confidence) |
| Data Model (er_model.json) | Read output/backend-data-architecture/data-architecture-spec/er_model.json | Ask user for data model | Infer data entities and relationships from PRD (low confidence, mark "data model pending confirmation") |
| Architecture Plan (architecture_decision.json) | Read output/backend-architecture/backend-architecture-spec/architecture_decision.json | Ask user for architecture plan | Default monolithic architecture (low confidence, mark "architecture plan pending confirmation") |
| Service Design (service_design.json) | Read output/backend-architecture/backend-architecture-spec/service_design.json | Ask user for service division | Default single service (low confidence, mark "service design pending confirmation") |
| Security Level | — | Ask user to specify security level requirements | Default standard security level (low confidence, mark "security level pending confirmation") |
| project_dir | — | Ask user for project directory path | Cannot infer, user must provide |
| tech_stack | — | Ask user for tech stack | Read tech_stack_decision.json or default to common tech stack (low confidence) |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest user execute upstream orchestrators in the following priority:

| Missing Input | Suggested Upstream Orchestrator | Description |
|--------------|-------------------------------|-------------|
| PRD + PRD Structured Data | pm-design related orchestrator | PRD is the business source for API design, missing will result in interface design without basis |
| Architecture Plan + Service Design | backend-architecture-orchestrator | Architecture plan determines API service boundaries and communication methods, missing will result in API design lacking architecture constraints |
| Data Model | data-architecture-orchestrator | ER model is the basis for API resource mapping, missing will result in API resources not aligned with data entities |

Backtracking suggestion output format:
```
Critical input missing detected, suggest executing upstream orchestrator first:
1. [Priority] backend-architecture-orchestrator -> Produces architecture plan and service design
2. [Priority] data-architecture-orchestrator -> Produces data model
3. [Recommended] pm-design related orchestrator -> Produces PRD
Continue with AI-inferred values? (Inferred values confidence <=0.3, outputs require additional human review)
```

### Standalone Usage Gate

When triggered standalone, must pass the following additional checks before executing Pipeline:

| Gate Item | Check Content | Failure Handling |
|-----------|--------------|-----------------|
| PRD existence | prd.md or equivalent requirements document available | Block execution, suggest user execute pm-design orchestrator or provide PRD |
| Data model existence | er_model.json available or inferable | Degraded execution, mark "data model missing, API resource mapping based on PRD inference" |
| Architecture plan existence | architecture_decision.json available or inferable | Degraded execution, default monolithic architecture, mark "architecture plan missing, using default monolithic architecture" |
| project_dir validity | User provided valid project directory path | Block execution, user must provide valid project_dir |
| Input confidence assessment | All required input acquisition methods determined, overall confidence >=0.5 | When confidence <0.5, force human confirmation whether to continue execution |

Gate execution order: PRD existence -> project_dir validity -> Data model existence -> Architecture plan existence -> Input confidence assessment
