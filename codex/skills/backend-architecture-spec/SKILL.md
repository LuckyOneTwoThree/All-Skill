---
name: backend-architecture-spec
description: "Use when designing backend architecture. Produces backend architecture design specifications, automatically evaluating architecture patterns based on business scale, designing service division plans, executing architecture reviews, with built-in ADR and tech debt registration for decision traceability. Keywords: architecture pattern, microservices, monolithic, Serverless, service design, DDD, bounded context, architecture review, tech debt, architecture decision."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Backend Architecture"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Which architecture pattern to choose"
    - "Should we use microservices"
    - "How to split services"
    - "Backend code review"
    - "Are there architecture issues"
---

# Backend Architecture Design Specification

## Core Principles

1. **Appropriate Architecture**: Architecture serves business, not technical advancement
2. **Evolutionary Architecture**: Start simple, evolve as needed, not all at once
3. **Traceable Decisions**: Every architecture decision has clear rationale and context, ADR auto-generated
4. **Visible Tech Debt**: Technical debt explicitly registered and managed, not hidden

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | Business domain and processes |
| PRD Structured Data | JSON | Yes | output/pm-design/design-prd/prd.json | Machine-consumable PRD version for architecture review alignment check |
| Data Model | JSON | Yes | output/backend-data-architecture/data-architecture-spec/er_model.json | Data entities and relationships |
| Business Data Dictionary | JSON | O | output/backend-data-architecture/data-architecture-spec/data_dictionary.json | Business data standards and entity definitions, for service division and bounded context delineation reference |
| API Contract | YAML/JSON | Yes | output/backend-api-design/api-design-spec/openapi.yaml | Interface definitions |
| Business Scale | JSON | Yes | User provided | User count, QPS, data volume, team size |
| Technical Constraints | JSON | O | User provided | Tech stack, ops capability, budget |
| Cache Strategy | JSON | O | output/backend-data-architecture/data-architecture-spec/cache_strategy.json | Cache scheme |

## Execution Steps

### Step 1: Architecture Pattern Evaluation and Selection

Evaluate and recommend architecture patterns (Monolithic/Microservices/Serverless) based on multiple dimensions, generate system topology diagram.

**Stage Gate**: Architecture pattern and evolution path human-confirmed

### Step 2: Architecture Decision Records

Generate ADR for each architecture decision:
- Decision background and drivers
- Alternative options and evaluation
- Decision result and rationale
- Impact scope and consequences

**Stage Gate**: Core architecture decisions 100% have ADR

### Step 3: Service Design

Identify bounded contexts based on Domain-Driven Design, design service division and communication scheme.

**Stage Gate**: No circular dependencies between services, data ownership is clear

### Step 4: Backend Review

Review performance, security, maintainability, and scalability, output issue list and fix recommendations.

**Stage Gate**: P0 issues=0, architecture decision records complete

### Step 5: Tech Debt Registration

Identify and register technical debt:
- Extract tech debt from review issues
- Assess impact scope and fix priority
- Generate tech debt register
- Recommend fix pace

**Stage Gate**: P0 tech debt=0, tech debt register generated

## Output

**Metadata Output**: output/backend-architecture/backend-architecture-spec/

**Output Files**:
- architecture_decision.json -- Architecture plan + topology diagram
- adr.json -- Architecture Decision Records
- service_design.json -- Service division + context mapping
- review_report.json -- Review issue list + fix recommendations
- tech_debt_register.json -- Tech debt register

## Decision Rules

| Condition | Decision |
|------|------|
| Team size <5 | Monolithic architecture preferred |
| Team size 5-20 | Microservices architecture |
| QPS <1000 | Monolithic or Serverless |
| Core business entities cross sub-domains | Split services by bounded context |
| Review P0 issues >0 | Block release, must fix |
| Tech debt affects core functionality | P0 priority, fix this iteration |

## Quality Checks

- [ ] Architecture pattern matches business scale
- [ ] Core architecture decisions 100% have ADR
- [ ] No circular dependencies between services
- [ ] P0 issues=0
- [ ] Tech debt register generated
- [ ] Each service has clear data ownership

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| PRD missing | Derive business domains from data model and API contract | Service division may be inaccurate |
| Data model missing | Cannot design services | Output is empty |
| API contract missing | Review scope limited | Cannot perform interface-level review |
| Business scale not specified | Default medium scale | Architecture pattern may not match |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| PRD business domain change | Service division | Mark affected service boundaries, assess whether re-division is needed |
| Data model change | Service data ownership | Mark affected services, assess data migration needs |
| API contract change | Review results | Re-evaluate affected interface security and performance |
