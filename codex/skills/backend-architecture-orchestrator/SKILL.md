---
name: backend-architecture-orchestrator
description: "Use when designing backend architecture, selecting architecture patterns, or conducting architecture reviews. Backend architecture commander, orchestrating the complete flow of backend-architecture-spec (design) and backend-architecture-impl (implementation), ensuring backend architecture is reasonable, scalable, and high-quality, with design outputs reviewed by humans before code generation. Keywords: backend architecture, architecture pattern, service design, architecture review, technical architecture, microservices, system architecture, code generation."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Backend Architecture"
  type: "orchestrator"
  version: "5.0"
  domain_tags: ["E-commerce", "SaaS", "Finance", "General"]
  trigger_examples:
    - "Design backend architecture"
    - "Select architecture pattern"
    - "Design microservices"
    - "Conduct architecture review"
---

# Backend Architecture Orchestrator

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../../codex-templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## Core Principles

Architecture serves business, simple solutions first, evolve as needed. Design first, review then implement.

1. **Pattern First**: Determine architecture pattern first, then design services
2. **Domain-Driven**: Service boundaries determined by business domains
3. **Review Loop**: If review doesn't pass, go back and fix
4. **Evolutionary**: Start simple, evolve as needed
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
| Output Existence | Output files generated and non-empty | "backend-architecture-spec output files generated" |
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
pipeline: backend-architecture-orchestrator
version: 5.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/backend-architecture-orchestrator.md

stages:
  - id: phase-1
    name: "Backend Architecture Design Specification"
    skills:
      - backend-architecture-spec
    gate:
      condition: "backend-architecture-spec output files generated and non-empty + human review passed"
      fail_action: "P0 issues must be fixed before passing"

  - id: phase-2
    name: "Backend Architecture Code Implementation"
    depends_on: [phase-1]
    skills:
      - backend-architecture-impl
    gate:
      condition: "backend-architecture-impl output files generated and non-empty + human confirmation passed"
      fail_action: "Missing items supplemented then re-validated"
```

## Stage Execution Plan

#### Stage 1: Backend Architecture Design Specification

#### Invoke backend-architecture-spec

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
Validation: Architecture pattern + ADR + service design + service data ownership + tech stack decision complete, P0 issues=0
Mode: AI->Human
Internal Steps:
  1. Architecture pattern evaluation and selection: Monolithic/Microservices/Serverless, generate topology diagram
  2. Architecture Decision Records: Generate ADR for each decision
  3. Service design: DDD bounded contexts + service division + communication scheme + service data ownership
  4. Backend review: Performance/security/maintainability/scalability review
  5. Tech debt registration: Identify and register technical debt
```

**Design Review Gate**: Architecture pattern + service design + review report + tech debt register complete + P0 issues=0 -> Human reviews design output -> After review passes, enter code implementation

#### Stage 2: Backend Architecture Code Implementation

#### Invoke backend-architecture-impl

```
Skill: backend-architecture-impl
Input:
  Architecture Plan: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  Service Design: output/backend-architecture/backend-architecture-spec/service_design.json
  ADR: output/backend-architecture/backend-architecture-spec/adr.json
  Review Report: output/backend-architecture/backend-architecture-spec/review_report.json (optional)
  Tech Debt Register: output/backend-architecture/backend-architecture-spec/tech_debt_register.json (optional)
  Tech Stack Decision: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json (optional)
  API Contract: output/backend-api-design/api-design-spec/openapi.yaml
  Data Model: output/backend-data-architecture/data-architecture-spec/er_model.json
  Cache Strategy: output/backend-data-architecture/data-architecture-spec/cache_strategy.json (optional)
  project_dir: User provided
  tech_stack: User provided (optional, used when tech_stack_decision.json not available)
Output: output/backend-architecture/backend-architecture-impl/ + code written to {project_dir}/
Validation: Project can start, /health returns 200, architecture decisions 100% reflected in code, unified alignment check passed, code self-review P0=0
Mode: AI->Human
Internal Steps:
  1. Project entry and configuration generation: app.ts + config (integrating api-design-impl routes + data-architecture-impl database/cache)
  2. Service layer and communication layer generation: services + clients
  3. Infrastructure code generation: errors + logger + health
  4. Containerization and CI/CD generation: Docker + CI + package.json
  5. Architecture alignment check and code self-review: app.ts integration + Service alignment + multi-environment config + Docker buildable + CI complete + unified alignment check
  6. Architecture test code generation: Health check + contract tests + build verification tests
```

### Stage Summary (post_pipeline)

After all sub-Skills complete, must generate stage summary document, written to `output/phase-reports/backend/backend-architecture-orchestrator.md`, containing the following 6 structures (none can be empty):

1. **Execution Overview**: Orchestrator name and version, execution time, sub-Skill execution status (success/failure/degraded)
2. **Key Findings**: Core output summary for each sub-Skill (1-3 items), cross-sub-Skill insights
3. **Decision Records**: Human decision points and decision results, AI automatic decisions and basis
4. **Output Inventory**: All output file paths and content summaries, output quality assessment (whether validation passed)
5. **Risks and TODOs**: Items that failed validation, items executed with degradation, recommended follow-up items
6. **Downstream Handoff**: Which downstream orchestrators can consume this orchestrator's outputs, recommended next orchestrator

| Parameter | Value |
|-----------|-------|
| Sub-Skill output path | output/backend-architecture/ |
| Summary output path | output/phase-reports/backend/backend-architecture-orchestrator.md |
| Approval record path | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

Downstream handoff:
  primary: data-architecture-orchestrator (After architecture plan is determined, enter data architecture design)
  alternatives:
    - target: release-orchestrator
      reason: After architecture implementation completes, enter quality acceptance and release
      condition: Only executing architecture module + no data layer and API layer needed
    - target: ui-orchestrator
      reason: After backend is ready, start UI frontend development and integration
      condition: Frontend not yet developed + need backend API support
  special_cases:
    - target: backend-architecture-spec
      reason: Only need architecture design evaluation, no code implementation needed
      condition: Only need to evaluate architecture pattern and service design, no full orchestration flow needed

## Stage Gates

| Gate | Condition | Failure Handling |
|------|-----------|-----------------|
| Backend architecture design complete | backend-architecture-spec output files generated and non-empty + human review passed | P0 issues must be fixed before passing |
| Backend architecture code implementation complete | backend-architecture-impl output files generated and non-empty + human confirmation passed | Missing items supplemented then re-validated |
| Stage summary generated | output/phase-reports/backend/backend-architecture-orchestrator.md generated and all 6 structures non-empty | Supplement missing structure items then regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|---------------|-------------------|-----------------|
| Architecture pattern selection | During backend-architecture-spec execution | Monolithic/Microservices/Serverless, human final confirmation |
| Service division granularity | During backend-architecture-spec execution | Too fine increases complexity, too coarse loses flexibility |
| Tech stack confirmation | During backend-architecture-spec execution | Confirm unified tech stack decision, affects all subsequent implementation |
| Service data ownership confirmation | During backend-architecture-spec execution | Confirm data entities owned by each service, affects data architecture design |
| Evolution pace | During backend-architecture-spec execution | When to evolve from monolithic to microservices, human decision |
| P1 issue handling | During backend-architecture-spec execution | Fix or accept as technical debt |
| Design review confirmation | After backend-architecture-spec completes | Review whether architecture design meets requirements, confirm before entering code implementation |
| Architecture readiness confirmation | After backend-architecture-impl review passes | Code implementation complete, human confirms architecture is ready for development |

## Exception Handling

| Exception Type | Handling Strategy |
|---------------|-------------------|
| PRD missing | Cannot design architecture, output is empty |
| Business scale not specified | Default medium scale (10K users, QPS 100, 10GB data, team of 5), mark "scale pending confirmation" |
| Architecture pattern dispute | Provide monolithic + microservices dual-plan comparison, human decision |
| Service circular dependency | Auto-detect and alert, must eliminate before entering review |
| Review P0 issues | Must fix before passing design review |
| Design review not passed | Adjust design based on human feedback, re-review |
| Code self-review P0 issues | Auto-fix then re-review, block output if unfixable |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestrator completion |

## Standalone Usage Input Acquisition Strategy

### Standalone Trigger Scenario Identification

When this orchestrator is invoked directly (not through backend-orchestrator orchestration), it is considered a standalone trigger scenario. Typical trigger methods:
- User directly requests "design backend architecture" or "select architecture pattern"
- Triggered as an independent skill by external systems
- Upstream orchestrator not executed, but user only needs backend architecture design capability

### Required Input Acquisition Strategy

| Required Input | Priority: Read from output/ | Fallback: Get from user conversation | Last Resort: AI knowledge base inference |
|---------------|---------------------------|-------------------------------------|---------------------------------------|
| PRD (prd.md) | Read output/pm-design/design-prd/prd.md | Ask user for PRD document or verbal requirements | Infer requirements document from user description (low confidence, mark "PRD is AI-inferred") |
| PRD Structured Data (prd.json) | Read output/pm-design/design-prd/prd.json | Ask user for structured requirements | Extract structured data from PRD document (low confidence) |
| Business Scale | — | Ask user for business scale (user count, QPS, data volume, team size) | Default medium scale: 10K users, QPS 100, 10GB data, team of 5 (low confidence, mark "scale pending confirmation") |
| project_dir | — | Ask user for project directory path | Cannot infer, user must provide |
| tech_stack | — | Ask user for tech stack | Default common tech stack (low confidence, mark "tech stack pending confirmation") |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest user execute upstream orchestrators in the following priority:

| Missing Input | Suggested Upstream Orchestrator | Description |
|--------------|-------------------------------|-------------|
| PRD + PRD Structured Data | pm-design related orchestrator | PRD is the business basis for architecture design, missing will result in architecture pattern selection and service division without business foundation |

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
| PRD existence | prd.md or equivalent requirements document available | Block execution, suggest user execute pm-design orchestrator or provide PRD |
| Business scale clarity | Business scale parameters obtained | Degraded execution, use default medium scale, mark "scale pending confirmation" |
| project_dir validity | User provided valid project directory path | Block execution, user must provide valid project_dir |
| Input confidence assessment | All required input acquisition methods determined, overall confidence >=0.5 | When confidence <0.5, force human confirmation whether to continue execution |

Gate execution order: PRD existence -> project_dir validity -> Business scale clarity -> Input confidence assessment
