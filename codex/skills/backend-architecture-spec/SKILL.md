---
name: backend-architecture-spec
description: "Use when designing backend architecture. Produces backend architecture design specifications, automatically evaluating architecture patterns based on business scale, designing service division plans, executing architecture reviews, with built-in ADR and tech debt registration for decision traceability. Architecture constraints first, producing service data ownership and tech stack decisions for downstream consumption. Keywords: architecture pattern, microservices, monolithic, Serverless, service design, DDD, bounded context, architecture review, tech debt, architecture decision."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Backend Architecture"
  type: "pipeline"
  version: "5.0"
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
5. **Architecture Constraints First**: Architecture decisions constrain subsequent data models and API design; service data ownership and tech stack decisions must be explicit

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | Business domain and processes |
| PRD Structured Data | JSON | Yes | output/pm-design/design-prd/prd.json | Machine-consumable PRD version for architecture review alignment check |
| Business Scale | JSON | Yes | User provided | User count, QPS, data volume, team size |
| Technical Constraints | JSON | O | User provided | Tech stack, ops capability, budget |

## Execution Steps

### Step 1: Architecture Pattern Evaluation and Selection [Core]

Evaluate and recommend architecture patterns (Monolithic/Microservices/Serverless) based on multiple dimensions, generate system topology diagram.

**Architecture Evaluation Quantitative Matrix**:

Score each candidate architecture pattern across the following dimensions (1-5 points), quantitatively compare and recommend the optimal solution.

| Evaluation Dimension | 1 Point | 2 Points | 3 Points | 4 Points | 5 Points |
|---------------------|---------|----------|----------|----------|----------|
| Scalability | No horizontal scaling, single point bottleneck | Limited scaling, requires downtime for capacity expansion | Supports vertical scaling, limited horizontal scaling | Good horizontal scaling capability | Unlimited horizontal scaling, automatic elastic scaling |
| Maintainability | Tightly coupled, changes have wide impact | Partially decoupled, core modules coupled | Modular design, clear boundaries | Well decoupled, independently modifiable | Fully decoupled, services independently deployable and evolvable |
| Performance Expectation | Obvious single-point performance bottleneck | Meets low-load requirements basically | Meets medium load, pressure during peaks | Meets high load, locally optimizable | Meets extremely high load, full-chain optimizable |
| Security | No isolation, large attack surface | Basic isolation, blurry boundaries | Service-level isolation, clear boundaries | Fine-grained isolation + independent security policies | Zero-trust architecture + defense in depth |
| Deployment Complexity | Extremely simple deployment, single process | Simple deployment, few dependencies | Moderately complex, needs orchestration tools | Complex, needs complete DevOps system | Extremely complex, needs professional ops team (lower score is better for this dimension) |
| Team Fitness | Team cannot manage | Needs extensive training to get started | Team has partial experience | Team has rich experience | Team is proficient, has best practices |

**Composite Score Formula**:

```
Composite Score = Scalability x W1 + Maintainability x W2 + Performance Expectation x W3 + Security x W4 + (6 - Deployment Complexity) x W5 + Team Fitness x W6
```

**Default Weights** (adjustable by business type):

| Business Type | W1 (Scalability) | W2 (Maintainability) | W3 (Performance) | W4 (Security) | W5 (Deployment) | W6 (Team) |
|--------------|-------------------|---------------------|-------------------|---------------|-----------------|-----------|
| General/SaaS | 0.25 | 0.20 | 0.20 | 0.10 | 0.10 | 0.15 |
| E-commerce | 0.30 | 0.15 | 0.25 | 0.10 | 0.10 | 0.10 |
| Finance | 0.15 | 0.15 | 0.20 | 0.25 | 0.10 | 0.15 |

**Score Interpretation**:

| Composite Score | Recommendation Strategy |
|----------------|------------------------|
| >=4.0 | Recommended, low risk |
| 3.0-3.9 | Acceptable, monitor low-scoring dimensions and develop compensating measures |
| 2.0-2.9 | Not recommended, adjust solution or supplement capabilities before re-evaluation |
| <2.0 | Rejected, solution not viable |

**Stage Gate**: Architecture pattern and evolution path human-confirmed

### Step 2: Architecture Decision Records [Core]

Generate ADR for each architecture decision:
- Decision background and drivers
- Alternative options and evaluation
- Decision result and rationale
- Impact scope and consequences

**ADR Template**:

```json
{
  "id": "ADR-001",
  "title": "Decision title",
  "status": "proposed | accepted | deprecated | superseded",
  "date": "2025-01-01",
  "context": "Decision background: describe drivers, constraints, and problem statement",
  "alternatives": [
    {
      "name": "Option name",
      "description": "Option description",
      "pros": ["Advantage 1", "Advantage 2"],
      "cons": ["Disadvantage 1", "Disadvantage 2"],
      "evaluation_scores": {
        "scalability": 0,
        "maintainability": 0,
        "performance": 0,
        "security": 0,
        "deployment_complexity": 0,
        "team_fitness": 0
      }
    }
  ],
  "decision": "Final decision result",
  "rationale": "Decision rationale: why this option was chosen over others",
  "consequences": {
    "positive": ["Positive impact 1"],
    "negative": ["Negative impact 1"],
    "risks": ["Risk 1"]
  },
  "affected_services": ["List of affected services"],
  "related_adrs": ["ADR-000"],
  "supersedes": null,
  "superseded_by": null
}
```

**ADR Numbering Rule**: Increment in architecture decision order (ADR-001, ADR-002, ...), core architecture decisions are numbered first.

**ADR Status Transitions**: proposed -> accepted -> (deprecated / superseded), status changes require human confirmation.

**Stage Gate**: Core architecture decisions 100% have ADR

### Step 3: Service Design [Core]

Identify bounded contexts based on Domain-Driven Design, design service division and communication scheme.

**Bounded Context Identification Method**:

Identify bounded contexts following the three rules below, in descending priority:

| Identification Rule | Division Basis | Identification Signal | Example |
|---------------------|---------------|----------------------|---------|
| Business Domain | Entities within the same business domain aggregate together | Entities in the same business process, same business rules and invariants | Order domain (Order/OrderItem/Payment), User domain (User/Profile/Role) |
| Data Ownership | Same data can only be owned and modified by one context | Same entity has different attribute subsets and lifecycles in different contexts | Product catalog context owns product base info, inventory context owns inventory quantities |
| Change Frequency | Entities with same change frequency and reason grouped into same context | Modules always modified together when requirements change | Marketing rules change frequently, separated from stable product base info |

**Bounded Context Mapping Template**:

```json
{
  "contexts": [
    {
      "name": "Context name",
      "description": "Context responsibility description",
      "core_entities": ["List of owned core entities"],
      "ubiquitous_language": ["List of ubiquitous language keywords"],
      "incoming_relations": [
        {
          "from_context": "Upstream context",
          "relationship_type": "Upstream-Downstream|Customer-Supplier|Conformist|Open Host Service|Anti-Corruption Layer",
          "data_flow": "Data flow direction description"
        }
      ]
    }
  ],
  "context_map_summary": "Context mapping overview description"
}
```

**Inter-Context Communication Pattern Selection**:

| Communication Pattern | Applicable Scenario | Consistency | Complexity | Example |
|----------------------|-------------------|-------------|-----------|---------|
| Synchronous Call (HTTP/gRPC) | Needs real-time response, low call frequency | Strong consistency | Low | User service queries order service for order list |
| Asynchronous Message (MQ) | No real-time response needed, needs decoupling | Eventual consistency | Medium | Order creation notifies inventory service for deduction |
| Event-Driven (Event Sourcing) | Needs complete audit trail, multiple downstream consumers | Eventual consistency | High | Payment completion triggers order status change + notification + points |
| Shared Database | Small team size, strong data dependency between services | Strong consistency | Low (short-term) | Shared database between modules within monolithic architecture |
| CQRS | Large read-write model difference, reads far exceed writes | Eventual consistency | High | Product list query and product detail use different models |

**Stage Gate**: Each bounded context has clear entity ownership and communication pattern

**New Outputs**:
- **Service Data Ownership** (service_data_ownership.json): Explicitly defines data entities owned by each service/bounded context, for data-architecture-spec to partition data models by service boundaries
- **Tech Stack Decision** (tech_stack_decision.json): Unified tech stack decision (language/framework/ORM/database/cache), for all impl Skills to consume uniformly, avoiding each defaulting to different tech stacks

**Stage Gate**: No circular dependencies between services, data ownership explicit, tech stack decision complete

### Step 4: Backend Review [Core]

Review performance, security, maintainability, and scalability, output issue list and fix recommendations.

**Note**: This stage does not review API and data model alignment (they are not yet designed); focus on reviewing the reasonableness of architecture pattern selection and service boundary division.

**Stage Gate**: P0 issues=0, architecture decision records complete

### Step 5: Tech Debt Registration [Core]

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
- service_data_ownership.json -- Data entities owned by each service/bounded context, for data-architecture-spec consumption
- tech_stack_decision.json -- Unified tech stack decision (language/framework/ORM/database/cache), for all impl Skills consumption
- review_report.json -- Review issue list + fix recommendations
- tech_debt_register.json -- Tech debt register

**service_data_ownership.json Schema**:

```json
{
  "type": "object",
  "required": ["services"],
  "properties": {
    "services": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "bounded_context", "owned_entities"],
        "properties": {
          "name": { "type": "string" },
          "bounded_context": { "type": "string" },
          "owned_entities": { "type": "array", "items": { "type": "string" } },
          "database_strategy": { "type": "string", "enum": ["shared", "separate"] }
        }
      }
    }
  }
}
```

**tech_stack_decision.json Schema**:

```json
{
  "type": "object",
  "required": ["language", "framework", "orm", "database", "cache"],
  "properties": {
    "language": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "framework": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "orm": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "database": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "cache": { "type": "object", "required": ["name", "version"], "properties": { "name": { "type": "string" }, "version": { "type": "string" } } },
    "message_queue": { "type": "object", "properties": { "name": { "type": "string" }, "version": { "type": "string" } } }
  }
}
```

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
- [ ] Architecture evaluation quantitative matrix completed, composite score >=3.0
- [ ] Core architecture decisions 100% have ADR
- [ ] ADR includes alternative option evaluation scores
- [ ] Bounded contexts identified by business domain/data ownership/change frequency three rules
- [ ] Each bounded context has clear entity ownership and communication pattern
- [ ] No circular dependencies between services
- [ ] P0 issues=0
- [ ] Tech debt register generated
- [ ] Each service has clear data ownership

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Note |
|---------------|---------|---------|-------------|
| PRD missing | Cannot design architecture | Output is empty | Require user to provide PRD, or extract minimal PRD from user's verbal business requirements |
| Business scale not specified | Default medium scale (10K users, QPS 100, 10GB data, team of 5) | Architecture pattern may not match actual scale | Prompt user to provide business scale, or annotate "scale pending confirmation" in architecture decisions |
| API design missing | Architecture design does not depend on API design, derive service interaction requirements from PRD | Service communication scheme may need subsequent adjustment | Normal case, API not yet designed; after architecture design, api-design-spec consumes architecture outputs |
| Data architecture missing | Derive core data entities from PRD, annotate "data ownership pending data-architecture-spec confirmation" | Entity ownership in service_data_ownership.json based on derivation | Normal case, data architecture not yet designed; after architecture design, data-architecture-spec consumes service data ownership |
| Non-functional requirements missing | Derive default non-functional metrics from business scale (availability 99.9%, response time <500ms, RTO <1h) | Performance and reliability design may not meet actual requirements | Prompt user to provide non-functional requirements, or record assumptions and pending items in ADR |
| Technical constraints missing | Do not limit tech stack selection, recommend based on team fitness score optimal solution | Recommended tech stack may not meet organizational constraints | Prompt user to provide technical constraints (tech stack preferences, ops capability, budget), or annotate "technical constraints pending confirmation" in architecture decisions |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| PRD business domain change | Service division | Mark affected service boundaries, assess whether re-division is needed |
| PRD business scale change | Architecture pattern | Re-evaluate whether architecture pattern matches |

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Architecture plan change | data-architecture-spec, api-design-spec, all impl Skills | Mark affected downstream Skills, update architecture_decision.json |
| Service design change | data-architecture-spec, api-design-spec, backend-architecture-impl | Mark affected service boundaries, update service_design.json |
| Tech stack decision change | all impl Skills | Mark affected code generation, update tech_stack_decision.json |
| Service data ownership change | data-architecture-spec | Mark affected data entity ownership, update service_data_ownership.json |
