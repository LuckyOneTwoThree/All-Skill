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
  primary: data-architecture-orchestrator (after API contract completed, enter data architecture design, design ER model and table structure based on API data requirements)
  alternatives:
    - target: ui-orchestrator
      reason: API contract can be consumed by UI frontend for parallel development
      condition: Under frontend-backend parallel development mode

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

## Changelog

- v1.0: Initial version
