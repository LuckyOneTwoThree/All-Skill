---
name: backend-architecture-orchestrator
description: "Use when designing backend architecture, selecting architecture patterns, or conducting architecture reviews. Orchestrates backend-architecture-spec and backend-architecture-impl sub-skills with human review before code generation. Keywords: backend architecture, architecture pattern, service design, microservices, system architecture."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Backend Architecture"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Design backend architecture"
    - "Select architecture patterns"
    - "Design microservices"
    - "Conduct architecture review"
---

# Backend Architecture Orchestrator

## Core Principles

Architecture serves the business; simple solutions first, evolve on demand. Design first, implement after review.

## Execution Steps

1. **Pattern First**: Determine architecture pattern first, then design services
2. **Domain Driven**: Service boundaries determined by business domains
3. **Review Loop**: If review fails, go back and fix
4. **Evolutionary**: Start simple, evolve on demand
5. **Design Review**: Design outputs must pass human review before entering code implementation

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline Definition

```yaml
pipeline: backend-architecture-orchestrator
version: 4.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/backend-architecture-orchestrator.md

stages:
  - id: phase-1
    name: "Backend Architecture Design Specification"
    skills:
      - backend-architecture-spec
    gate:
      condition: "Architecture pattern+service design+architecture review+tech debt register complete + P0 issues=0 + human review passed"
      fail_action: "P0 issues must be fixed before passing"

  - id: phase-2
    name: "Backend Architecture Code Implementation"
    depends_on: [phase-1]
    skills:
      - backend-architecture-impl
    gate:
      condition: "Project can start + /health returns 200 + Architecture decisions 100% reflected in code + Code self-audit P0=0 + Human confirmation passed"
      fail_action: "Supplement missing items and re-verify"
```

## Stage Execution Plan

#### Stage 1: Backend Architecture Design Specification

#### Invoke backend-architecture-spec

```
Invoke: ${backend-architecture-spec}
Input:
  PRD: output/pm-design/design-prd/prd.md
  PRD structured data: output/pm-design/design-prd/prd.json
  Data model: output/backend-data-architecture/data-architecture-spec/er_model.json
  API contract: output/backend-api-design/api-design-spec/openapi.yaml
  Business scale: user provided
  Technical constraints: user provided (optional)
  Cache strategy: output/backend-data-architecture/data-architecture-spec/cache_strategy.json (optional)
Output: output/backend-architecture/backend-architecture-spec/
Validation: Architecture pattern+ADR+service design+review report+tech debt register complete, P0 issues=0
Mode: AI->Human
Internal steps:
  1. Architecture pattern evaluation and selection: Monolith/Microservices/Serverless, generate topology diagram
  2. Architecture Decision Record: Generate ADR for each decision
  3. Service design: DDD bounded context+service decomposition+communication scheme
  4. Backend review: Performance/security/maintainability/scalability review
  5. Tech debt register: Identify and register technical debt
```

[GATE] **Design Review Gate**: Architecture pattern+service design+review report+tech debt register complete + P0 issues=0 -> Human reviews design output -> Enter code implementation after review passes

#### Stage 2: Backend Architecture Code Implementation

#### Invoke backend-architecture-impl

```
Invoke: ${backend-architecture-impl}
Input:
  Architecture plan: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  Service design: output/backend-architecture/backend-architecture-spec/service_design.json
  ADR: output/backend-architecture/backend-architecture-spec/adr.json
  Review report: output/backend-architecture/backend-architecture-spec/review_report.json (optional)
  Tech debt register: output/backend-architecture/backend-architecture-spec/tech_debt_register.json (optional)
  API contract: output/backend-api-design/api-design-spec/openapi.yaml
  Data model: output/backend-data-architecture/data-architecture-spec/er_model.json
  Cache strategy: output/backend-data-architecture/data-architecture-spec/cache_strategy.json (optional)
  project_dir: user provided
  tech_stack: user provided
Output: output/backend-architecture/backend-architecture-impl/ + Code written to {project_dir}/
Validation: Project can start, /health returns 200, architecture decisions 100% reflected in code, code self-audit P0=0
Mode: AI->Human
Internal steps:
  1. Project entry and configuration generation: app.ts+config (integrating api-design-impl routes+data-architecture-impl database/cache)
  2. Service layer and communication layer generation: services+clients
  3. Infrastructure code generation: errors+logger+health
  4. Containerization and CI/CD generation: Docker+CI+package.json
  5. Architecture alignment check and code self-audit: app.ts integration+Service alignment+multi-environment config+Docker buildable+CI complete
  6. Architecture test code generation: Health check+contract test+build verification test
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/backend-architecture/ |
| Summary output path | output/phase-reports/backend/backend-architecture-orchestrator.md |

Downstream connections:
  primary: release-orchestrator (After backend architecture implementation is complete, enter quality acceptance and release process)
  alternatives:
    - target: ui-orchestrator
      reason: Start UI frontend development and integration after backend is ready
      condition: When frontend has not been developed and needs backend API support
    - target: monitoring-orchestrator
      reason: Establish monitoring and alerting system after backend goes live
      condition: When backend is deployed and needs continuous monitoring

## Stage Gates

| Gate | Condition | Action if Not Passed |
|------|------|------------|
| Backend architecture design complete | backend-architecture-spec output files generated and non-empty | P0 issues must be fixed before passing |
| Design review passed | Human reviews design output and confirms | Redesign based on human feedback |
| Backend architecture code implementation complete | backend-architecture-impl output files generated and non-empty | Supplement missing items and re-verify |
| Stage summary generated | output/phase-reports/backend/backend-architecture-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Architecture pattern selection | During backend-architecture-spec execution | Monolith/Microservices/Serverless, human makes final confirmation |
| Service decomposition granularity | During backend-architecture-spec execution | Too fine increases complexity, too coarse loses flexibility |
| Evolution pace | During backend-architecture-spec execution | When to evolve from monolith to microservices, human decides |
| P1 issue handling | During backend-architecture-spec execution | Fix or accept as technical debt |
| Design review confirmation | After backend-architecture-spec completes | Review whether architecture design meets requirements, confirm before entering code implementation |
| Architecture readiness confirmation | After backend-architecture-impl review passes | Code implementation complete, human confirms architecture is ready for development |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Business requirements incomplete | Infer business domains from PRD, mark as "inferred value" |
| API contract missing | Infer interface requirements from PRD, mark as "API contract pending confirmation" |
| Architecture pattern dispute | Provide monolith + microservices dual-plan comparison, human decides |
| Service circular dependency | Auto-detect and alert, must be eliminated before entering review |
| Review P0 issues | Must be fixed before passing design review |
| Design review not passed | Adjust design based on human feedback, re-review |
| Code self-audit P0 issues | Auto-fix and re-audit, block output if unfixable |
| Stage summary generation failed | Generate partial summary from completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |

## Changelog

- v4.0: Split backend-architecture into backend-architecture-spec (design) + backend-architecture-impl (implementation), added design review gate
- v3.0: Added code generation capability (project scaffold/Docker/CI), implemented design+code dual output mode
- v2.0: Merged architecture-pattern, service-design, backend-review into single backend-architecture skill
- v1.0: Initial version
