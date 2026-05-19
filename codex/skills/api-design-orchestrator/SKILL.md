---
name: api-design-orchestrator
description: "Use when designing API interfaces or establishing interface specifications. API design commander coordinating api-design-spec and api-design-impl, ensuring API design is secure and compliant, with design outputs reviewed by human before code generation. Keywords: API design, interface contract, API security, authentication authorization, interface design, API specification, code generation."
metadata:
  module: "Backend Architecture and Development"
  sub-module: "API Design"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Design API interfaces"
    - "Establish API specifications"
    - "Design authentication and authorization scheme"
    - "Generate interface documentation"
---

# API Design Commander

## Core Principles

Contract-driven development, security built-in not bolted-on. Design first, review then implement.

## Execution Steps

1. **Contract first**: Design API contract first, frontend and backend develop in parallel based on contract
2. **Security built-in**: Security strategy designed synchronously with contract, not patched afterward
3. **Unified authentication**: Unified authentication scheme, not handled separately per endpoint
4. **Design review**: Design outputs must be reviewed and confirmed by human before entering code implementation
5. **Version management**: API supports version management from day one

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline Definition

```yaml
pipeline: api-design-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/api-design-orchestrator.md

stages:
  - id: phase-1
    name: "API Design Specification"
    skills:
      - api-design-spec
    gate:
      condition: "API contract + security policy + authentication/authorization scheme complete + human review passed"
      fail_action: "Any missing item blocks"

  - id: phase-2
    name: "API Code Implementation"
    depends_on: [phase-1]
    skills:
      - api-design-impl
    gate:
      condition: "Code compiles + PRD feature points 100% covered + code self-review P0=0 + human confirmation passed"
      fail_action: "Supplement missing items and re-verify"
```

## Stage Execution Plan

#### Stage 1: API Design Specification

#### Invoke api-design-spec

```
Invoke: ${api-design-spec}
Input:
  PRD: output/pm-design/design-prd/prd.md
  PRD structured data: output/pm-design/design-prd/prd.json
  Data model: output/backend-data-architecture/data-architecture-spec/er_model.json (optional)
  Business flow: output/pm-design/design-userflow/userflow.json (optional)
  Security level: User provided
  Compliance requirements: User provided (optional)
  Multi-tenant requirements: User provided (optional)
  Frontend page data requirements: output/ui-frontend/page-builder/pages.json (optional)
  PRD page data requirements: output/pm-design/design-prd/prd.json -> pages[].data_requirements (optional)
Output: output/backend-api-design/api-design-spec/
Validation: API contract + security policy + authentication/authorization scheme complete, compliance check no P0 issues
Mode: AI->Human
Internal steps:
  1. Resource identification and modeling: Identify API resources from PRD
  2. Interface and specification design: Design CRUD interfaces + error codes + version strategy
  3. Interface security design: L1-L4 grading + rate limiting + data security
  4. Authentication and authorization design: Authentication scheme + permission model + session management
  5. Compliance check: Privacy compliance assessment
```

[GATE] **Design Review Gate**: API contract + security policy + authentication/authorization scheme complete -> Human reviews design outputs -> After review passed, enter code implementation

#### Stage 2: API Code Implementation

#### Invoke api-design-impl

```
Invoke: ${api-design-impl}
Input:
  OpenAPI specification: output/backend-api-design/api-design-spec/openapi.yaml
  Security policy: output/backend-api-design/api-design-spec/security-policy.json
  Authentication/authorization scheme: output/backend-api-design/api-design-spec/auth-scheme.json
  Compliance checklist: output/backend-api-design/api-design-spec/compliance-checklist.json (optional)
  PRD: output/pm-design/design-prd/prd.md
  PRD structured data: output/pm-design/design-prd/prd.json
  Frontend page data requirements: output/ui-frontend/page-builder/pages.json (optional)
  project_dir: User provided
  tech_stack: User provided
Output: output/backend-api-design/api-design-impl/ + code written to {project_dir}/src/
Validation: Code compiles, PRD feature points 100% covered, frontend data requirements 100% mapped, code self-review P0=0
Mode: AI->Human
Internal steps:
  1. Code skeleton generation: routes/controllers/validators/types/mappers
  2. Service business logic implementation: Business logic + transaction management + cache calls
  3. Middleware and security implementation: Authentication/rate limiting/CORS/error handling
  4. Alignment check and code self-review: PRD alignment + frontend alignment + security self-review
  5. API test code generation: Integration test skeleton
```

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/backend-api-design/ |
| Summary output path | output/phase-reports/backend/api-design-orchestrator.md |

Downstream connections:
  primary: backend-architecture-orchestrator (after API code implementation completed, enter architecture-level code integration and project assembly)
  alternatives:
    - target: ui-orchestrator
      reason: API contract can be consumed by UI frontend for parallel development
      condition: Under frontend-backend parallel development mode, when API contract needed to support frontend
    - target: data-architecture-orchestrator
      reason: When API design discovers data model does not meet requirements, trace back to adjust data architecture
      condition: When API design phase discovers ER model missing or incomplete, need to supplement data architecture

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| API design specification completed | api-design-spec output files generated and non-empty | Any missing item blocks |
| Design review passed | Human reviews design outputs and confirms | Human provides feedback, redesign |
| API code implementation completed | api-design-impl output files generated and non-empty | Supplement missing items and re-verify |
| Stage summary generated | output/phase-reports/backend/api-design-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| API style selection | During api-design-spec execution | RESTful vs GraphQL, human confirms |
| Security level confirmation | During api-design-spec execution | Standard vs high security, affects rate limiting/encryption/audit strategy |
| Permission model selection | During api-design-spec execution | RBAC vs ABAC, affects permission management complexity |
| Multi-tenant strategy | During api-design-spec execution | Isolation level affects cost and security, human confirms |
| API version strategy confirmation | During api-design-spec execution | Semantic versioning vs URL versioning, affects compatibility and client upgrade strategy |
| Design review confirmation | After api-design-spec completed | Review whether API design meets requirements, confirm before entering code implementation |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| PRD feature points unclear | Mark "feature points pending confirmation", generate TODO interfaces, human supplements |
| Data model missing | Infer data entities from PRD, mark "data model pending confirmation" |
| API style dispute | Provide RESTful and GraphQL dual-plan comparison, human decides |
| Security policy conflict | Mark conflict items, human decides trade-offs |
| Authentication scheme incompatible | Provide compatible solution, human confirms |
| Design review not passed | Adjust design per human feedback, re-review |
| Code self-review P0 issues | Auto-fix and re-review, if unfixable then block output |
| Stage summary generation failed | Generate partial summary based on completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |

## Standalone Usage Input Acquisition Strategy

### Standalone Trigger Scenario Identification

When this orchestrator is invoked directly (not through backend-orchestrator orchestration), it is considered a standalone trigger scenario. Typical trigger methods:
- User directly requests "Design API interfaces" or "Establish API specifications"
- Triggered as a standalone skill by an external system
- Upstream orchestrators have not been executed, but the user only needs API design capability

### Required Input Acquisition Strategy

| Required Input | Priority: Read from output/ | Fallback: Acquire from user dialog | Last Resort: AI inference |
|----------|------------------------|------------------------|----------------------|
| PRD (prd.md) | Read output/pm-design/design-prd/prd.md | Ask user to provide PRD document or describe requirements verbally | Infer requirements document from user description (⚠️ Low confidence, mark "PRD is AI-inferred") |
| PRD structured data (prd.json) | Read output/pm-design/design-prd/prd.json | Ask user to provide structured requirements | Extract structured data from PRD document (⚠️ Low confidence) |
| Data model (er_model.json) | Read output/backend-data-architecture/data-architecture-spec/er_model.json | Ask user to provide data model | Infer data entities and relationships from PRD (⚠️ Low confidence, mark "Data model pending confirmation") |
| Architecture plan (architecture_decision.json) | Read output/backend-architecture/backend-architecture-spec/architecture_decision.json | Ask user to provide architecture plan | Default to monolithic architecture (⚠️ Low confidence, mark "Architecture plan pending confirmation") |
| Service design (service_design.json) | Read output/backend-architecture/backend-architecture-spec/service_design.json | Ask user to provide service decomposition | Default to single service (⚠️ Low confidence, mark "Service design pending confirmation") |
| Security level | — | Ask user to specify security level requirements | Default to standard security level (⚠️ Low confidence, mark "Security level pending confirmation") |
| project_dir | — | Ask user to provide project directory path | Cannot infer, must be provided by user |
| tech_stack | — | Ask user to provide tech stack | Read tech_stack_decision.json or default to common tech stack (⚠️ Low confidence) |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest the user execute upstream orchestrators in the following priority order:

| Missing Input | Suggested Upstream Orchestrator | Description |
|----------|---------------------|------|
| PRD + PRD structured data | pm-design related orchestrators | PRD is the business source for API design; missing it will result in interface design without basis |
| Architecture plan + Service design | backend-architecture-orchestrator | Architecture plan determines API service boundaries and communication patterns; missing it will result in API design lacking architectural constraints |
| Data model | data-architecture-orchestrator | ER model is the foundation for API resource mapping; missing it will result in API resources not aligned with data entities |

Backtracking suggestion output format:
```
⚠️ Critical input missing detected. It is recommended to execute upstream orchestrators first:
1. [Priority] backend-architecture-orchestrator → Produces architecture plan and service design
2. [Priority] data-architecture-orchestrator → Produces data model
3. [Recommended] pm-design related orchestrators → Produces PRD
Continue with AI-inferred values? (Inferred values have confidence ≤ 0.3, outputs require additional human review)
```

### Standalone Usage Gate

When triggered standalone, the following additional checks must pass before executing the Pipeline:

| Gate Item | Check Content | Action if Not Passed |
|--------|----------|------------|
| PRD existence | prd.md or equivalent requirements document is accessible | Block execution, suggest user execute pm-design orchestrator or provide PRD |
| Data model existence | er_model.json is accessible or inferable | Degrade execution, mark "Data model missing, API resource mapping based on PRD inference" |
| Architecture plan existence | architecture_decision.json is accessible or inferable | Degrade execution, default to monolithic architecture, mark "Architecture plan missing, using default monolithic architecture" |
| project_dir validity | User provides a valid project directory path | Block execution, user must provide a valid project_dir |
| Input confidence assessment | All required input acquisition methods are determined, overall confidence ≥ 0.5 | If confidence < 0.5, force human confirmation on whether to continue execution |

Gate execution order: PRD existence → project_dir validity → Data model existence → Architecture plan existence → Input confidence assessment
