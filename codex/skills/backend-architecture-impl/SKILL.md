---
name: backend-architecture-impl
description: "Use when generating backend project architecture code. Implements backend architecture code from backend-architecture-spec architecture plans and service designs, generating runnable project architecture code to the project directory. This Skill owns the application entry (app.ts), integrating api-design-impl and data-architecture-impl code outputs. Built-in architecture alignment check and code self-review. Keywords: generate project scaffold, generate app.ts, generate Docker config, generate CI config, project architecture code generation."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Backend Architecture"
  type: "pipeline"
  version: "5.0"
  trigger_examples:
    - "Generate project scaffold"
    - "Generate app.ts"
    - "Generate Docker configuration"
    - "Generate CI configuration"
    - "Project initialization code"
---

# Backend Architecture Code Implementation

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## Core Principles

1. **Design as Specification**: Strictly follow backend-architecture-spec outputs
2. **Unified Entry**: This Skill owns app.ts, integrating api-design-impl and data-architecture-impl code outputs
3. **Multi-Environment Support**: Configuration management supports dev/staging/prod
4. **Container-Ready**: Docker images with multi-stage builds, lean images
5. **Built-in CI**: CI pipeline includes lint + test + build

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Architecture Plan | JSON | Yes | output/backend-architecture/backend-architecture-spec/architecture_decision.json | Architecture pattern and topology diagram |
| Service Design | JSON | Yes | output/backend-architecture/backend-architecture-spec/service_design.json | Service division and communication scheme |
| ADR | JSON | Yes | output/backend-architecture/backend-architecture-spec/adr.json | Architecture Decision Records |
| Review Report | JSON | O | output/backend-architecture/backend-architecture-spec/review_report.json | Review issue list |
| Tech Debt Register | JSON | O | output/backend-architecture/backend-architecture-spec/tech_debt_register.json | Technical debt |
| Tech Stack Decision | JSON | O | output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | Unified tech stack, determines ORM and database connection configuration |
| API Contract | YAML | Yes | output/backend-api-design/api-design-spec/openapi.yaml | For route mounting |
| Data Model | JSON | Yes | output/backend-data-architecture/data-architecture-spec/er_model.json | For database initialization |
| Cache Strategy | JSON | O | output/backend-data-architecture/data-architecture-spec/cache_strategy.json | For cache initialization |
| project_dir | string | Yes | User provided | Project root directory absolute path |
| tech_stack | string | O | User provided | Fallback when tech_stack_decision.json is not available |

## Execution Steps

### Step 1: Project Entry and Configuration Generation [Core]

Generate application entry and configuration management:

| Generated Content | Path | Description |
|----------|------|------|
| Project Entry | src/app.ts (or equivalent) | Application startup entry, registers middleware, mounts api-design-impl routes, initializes data-architecture-impl database connections and cache |
| Configuration Management | src/config/ | Environment variables, database, cache, logging configuration |

**Code Quality Requirements**:
- app.ts integrates api-design-impl routes (mounted from src/routes/index.ts) and data-architecture-impl database/cache initialization
- Configuration management supports multiple environments (dev/staging/prod)

**Stage Gate**: app.ts correctly mounts all routes and middleware, configuration supports multiple environments

### Step 2: Service Layer and Communication Layer Generation [Core]

Generate service layer and communication layer based on service design:

| Generated Content | Path | Description |
|----------|------|------|
| Service Layer Skeleton | src/services/coordinator/ | One Service directory per bounded context (cross-resource coordination logic, calls api-design-impl resource-level Services) |
| Communication Layer | src/clients/ (or events/) | Inter-service communication (HTTP/gRPC/message queue) |

**Code Quality Requirements**:
- Service layer aligned with api-design-impl resource-level Services, coordinator layer calls resource layer
- Inter-service communication method matches architecture decisions

**Stage Gate**: Service layer aligned with api-design-impl resource-level Services, communication method matches architecture decisions

### Step 3: Infrastructure Code Generation [Core]

Generate error handling, logging, health check and other infrastructure code:

| Generated Content | Path | Description |
|----------|------|------|
| Error Handling | src/errors/ | Unified error classes and error handling middleware |
| Logging | src/utils/logger.ts | Structured logging configuration |
| Health Check | src/health/ | /health endpoint + dependency checks (database + cache + external services) |

**Code Quality Requirements**:
- Unified error handling, no swallowed exceptions
- Structured logging with request ID tracing
- Health check covers all dependencies

**Stage Gate**: Error handling is unified, health check endpoint is accessible

### Step 4: Containerization and CI/CD Generation [Core]

Generate Docker and CI/CD configuration:

| Generated Content | Path | Description |
|----------|------|------|
| Docker | Dockerfile + docker-compose.yml | Containerization configuration |
| CI/CD | .github/workflows/ (or equivalent) | Basic CI pipeline (lint + test + build) |
| Package Management | package.json (or equivalent) | Dependency declaration + scripts + version locking |

**Code Quality Requirements**:
- Docker image with multi-stage builds, lean images
- CI pipeline includes lint + test + build

**Stage Gate**: Docker image can be built, CI pipeline is complete

### Step 5: Architecture Alignment Check and Code Self-Review [Core]

**Architecture Alignment Check**:
- Project directory structure consistent with bounded context division
- Inter-service communication method matches architecture decisions
- Middleware configuration matches security policy
- app.ts correctly mounts all routes and middleware
- **Unified Alignment Check**: Perform structured comparison based on metadata files, ensuring correct integration between api-design-impl and data-architecture-impl. Execution: Read api-design-impl/impl-report.json alignment_check.repository_call_chain and data-architecture-impl/impl-report.json repositories field, cross-compare Repository method signatures with Service calls for matching; Read er_model.json entity fields and openapi.yaml resource fields, compare API-Model mapping completeness

**Code Self-Review**:
- Check app.ts correctly integrates api-design-impl routes and data-architecture-impl database/cache initialization
- Check Service layer alignment with api-design-impl Services
- Check configuration management supports multiple environments
- Check Docker image can be built
- Check CI pipeline is complete (lint + test + build)
- Auto-fix discovered issues, P0 issues block output

**Stage Gate**: Project can start (npm run dev succeeds or equivalent command verification), health check endpoint accessible (/health returns 200), architecture decisions 100% reflected in code, unified alignment check passed, code self-review P0 issues=0

### Step 6: Architecture Test Code Generation [Core]

Generate test code for the architecture layer:

- Generate integration tests for health check endpoint
- Generate contract test skeletons for inter-service communication
- Generate build verification tests for CI pipeline
- Test files output to src/__tests__/integration/

**Stage Gate**: Health check and inter-service communication have test skeletons

## Output

Adopts **dual output mode**:

1. **Code Files** -> Directly written to user-specified `{project_dir}/` project directory
2. **Metadata Files** -> Written to `output/` directory for downstream Skill consumption

**Code File Output**: {project_dir}/ (project entry, configuration, service layer, Docker, CI/CD directly written to project directory)

**Metadata Output**: output/backend-architecture/backend-architecture-impl/

**Metadata Output Files**:
- impl-report.json -- Code implementation report (generated file list + alignment check results + self-review results)
- architecture-coverage.json -- Architecture alignment coverage report

**impl-report.json Schema**:

```json
{
  "type": "object",
  "required": ["skill_name", "version", "generated_files", "architecture_alignment", "self_audit"],
  "properties": {
    "skill_name": { "type": "string" },
    "version": { "type": "string" },
    "generated_files": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["path", "type", "description"],
        "properties": {
          "path": { "type": "string" },
          "type": { "type": "string", "enum": ["entry", "config", "service", "client", "infrastructure", "docker", "ci", "test"] },
          "description": { "type": "string" }
        }
      }
    },
    "architecture_alignment": {
      "type": "object",
      "required": ["api_model_mapping", "repository_service_chain", "architecture_decision_coverage"],
      "properties": {
        "api_model_mapping": { "type": "object", "properties": { "passed": { "type": "boolean" }, "unmapped_fields": { "type": "array", "items": { "type": "object", "properties": { "api_field": { "type": "string" }, "model_entity": { "type": "string" } } } } } },
        "repository_service_chain": { "type": "object", "properties": { "passed": { "type": "boolean" }, "missing_links": { "type": "array", "items": { "type": "object", "properties": { "service_method": { "type": "string" }, "repository_method": { "type": "string" } } } } } },
        "architecture_decision_coverage": { "type": "object", "properties": { "passed": { "type": "boolean" }, "unimplemented_decisions": { "type": "array", "items": { "type": "string" } } } }
      }
    },
    "self_audit": {
      "type": "object",
      "required": ["p0_count", "p1_count", "passed", "items"],
      "properties": {
        "p0_count": { "type": "integer" },
        "p1_count": { "type": "integer" },
        "passed": { "type": "boolean" },
        "items": { "type": "array", "items": { "type": "object", "properties": { "severity": { "type": "string" }, "check": { "type": "string" }, "result": { "type": "string" }, "detail": { "type": "string" } } } }
      }
    }
  }
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| Architecture plan conflicts with code implementation | Follow architecture plan, adjust code implementation |
| Service design inconsistent with api-design-impl | Follow api-design-impl, adjust service layer |
| Code self-review finds P0 issues | Block output, auto-fix then re-review |
| Docker build fails | Adjust Dockerfile configuration |
| Tech stack decision conflicts with user specification | Prefer tech_stack_decision.json (architecture design output), then tech_stack parameter (user direct input), default to Node.js/Express. Mark conflicts for human confirmation |

## Quality Checks

- [ ] Project can start (npm run dev succeeds or equivalent command verification)
- [ ] Health check endpoint accessible (/health returns 200)
- [ ] Architecture decisions 100% reflected in code
- [ ] app.ts correctly integrates api-design-impl routes and data-architecture-impl database/cache initialization
- [ ] Configuration management supports multiple environments
- [ ] Error handling is unified, no swallowed exceptions
- [ ] Docker image can be built
- [ ] CI pipeline includes lint + test + build
- [ ] Code self-review P0 issues=0
- [ ] Health check and inter-service communication have test skeletons
- [ ] API-Model mapping complete, Repository-Service call chain complete (unified alignment check)

### Real Runtime Validation Strategy

**Framework Identification & Adaptation Matrix**:

| Framework | Identification Signal | Entry File | Route Style | Middleware Style |
|------|---------|---------|---------|-----------|
| Express | package.json contains "express" | src/app.ts or src/index.ts | Router() | app.use() |
| NestJS | package.json contains "@nestjs/core" | src/main.ts | @Controller() decorator | @UseGuards() decorator |
| Fastify | package.json contains "fastify" | src/app.ts | fastify.route() | app.register() |
| Koa | package.json contains "koa" | src/app.ts | router.get/post | app.use() |

**ORM Identification & Adaptation Matrix**:

| ORM | Identification Signal | Model Style | Migration Command | Seed Command |
|-----|---------|-----------|---------------|----------|
| Prisma | package.json contains "@prisma/client" | schema.prisma | npx prisma migrate dev | npx prisma db seed |
| TypeORM | package.json contains "typeorm" | @Entity() decorator | npm run typeorm migration:run | — |
| Sequelize | package.json contains "sequelize" | sequelize.define() | npx sequelize-cli db:migrate | npx sequelize-cli db:seed |
| Mongoose | package.json contains "mongoose" | mongoose.Schema() | — (Schema-first) | — |

**Validation Command List**:

| Validation Dimension | Discovery Strategy | Execution Command | Pass Criteria | Failure Handling |
|---------|---------|---------|---------|---------|
| Dependency Install | package.json exists | npm install / pnpm install | Zero errors | Mark dependency conflicts |
| Compile Check | tsconfig.json exists | npx tsc --noEmit | Zero type errors | Mark type errors |
| Build Check | package.json scripts.build | npm run build | Zero-error exit | Mark build errors |
| DB Migration (dry-run) | After ORM identification | npx prisma migrate status / npm run typeorm migration:show | Migration status consistent | Mark pending migrations |
| Health Check | After framework identification | curl /health or check after npm run start | HTTP 200 | Mark startup failure reason |
| API Type Consistency | openapi.yaml exists | Compare route definitions with OpenAPI | 100% endpoint coverage | Mark uncovered endpoints |
| Tests | package.json scripts.test | npm run test | Pass rate >=80% | Mark failed test cases |

**Validation Execution Order**: Framework Identification -> Dependency Install -> Compile Check -> Build Check -> DB Migration (dry-run) -> Health Check -> API Type Consistency -> Tests

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Tech stack decision missing | Use tech_stack parameter (user provided), default to Node.js/Express if absent | Code style may not match |
| Architecture plan missing | Default monolithic architecture | Architecture pattern may not match business needs |
| Service design missing | Organize by module directory | Service division may be suboptimal |
| tech_stack parameter missing | Default Node.js/Express | Code style may not match |
| project_dir missing | Cannot generate code | Only output design documents |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Architecture plan change | app.ts + configuration + service layer | Mark affected code files, assess modification scope |
| Service design change | Service layer + communication layer | Update Service directory and communication configuration |
| Tech stack decision change | ORM configuration + database connection | Update tech_stack related configuration |
| API contract change | Route mounting | Update route registration in app.ts |
| Data model change | Database initialization configuration | Check if Model files need supplementing |
| API implementation or data layer implementation change | Unified alignment check | Check if API-Model mapping is still complete |

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| app.ts entry change | All generated code | Mark affected startup flow, update impl-report.json |
| Docker/CI config change | Deployment flow | Mark affected build and deployment steps, update impl-report.json |
| Unified alignment check results | api-design-impl, data-architecture-impl | Mark discovered mapping gaps, update architecture-coverage.json |
