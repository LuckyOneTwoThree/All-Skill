---
name: backend-architecture-impl
description: "Use when generating backend project architecture code. Implements backend architecture code from backend-architecture-spec architecture plans and service designs, generating runnable project architecture code to the project directory. This Skill owns the application entry (app.ts), integrating api-design-impl and data-architecture-impl code outputs. Keywords: generate project scaffold, generate app.ts, generate Docker config, generate CI config, project architecture code generation."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Backend Architecture"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Generate project scaffold"
    - "Generate app.ts"
    - "Generate Docker configuration"
    - "Generate CI configuration"
    - "Project initialization code"
---

# Backend Architecture Code Implementation

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
| API Contract | YAML | Yes | output/backend-api-design/api-design-spec/openapi.yaml | For route mounting |
| Data Model | JSON | Yes | output/backend-data-architecture/data-architecture-spec/er_model.json | For database initialization |
| Cache Strategy | JSON | O | output/backend-data-architecture/data-architecture-spec/cache_strategy.json | For cache initialization |
| project_dir | string | Yes | User provided | Project root directory absolute path |
| tech_stack | string | Yes | User provided | Backend technology stack |

## Execution Steps

### Step 1: Project Entry and Configuration Generation

Generate application entry and configuration management:

| Generated Content | Path | Description |
|----------|------|------|
| Project Entry | src/app.ts (or equivalent) | Application startup entry, registers middleware, mounts api-design-impl routes, initializes data-architecture-impl database connections and cache |
| Configuration Management | src/config/ | Environment variables, database, cache, logging configuration |

**Code Quality Requirements**:
- app.ts integrates api-design-impl routes (mounted from src/routes/index.ts) and data-architecture-impl database/cache initialization
- Configuration management supports multiple environments (dev/staging/prod)

**Stage Gate**: app.ts correctly mounts all routes and middleware, configuration supports multiple environments

### Step 2: Service Layer and Communication Layer Generation

Generate service layer and communication layer based on service design:

| Generated Content | Path | Description |
|----------|------|------|
| Service Layer Skeleton | src/services/coordinator/ | One Service directory per bounded context (cross-resource coordination logic, calls api-design-impl resource-level Services) |
| Communication Layer | src/clients/ (or events/) | Inter-service communication (HTTP/gRPC/message queue) |

**Code Quality Requirements**:
- Service layer aligned with api-design-impl resource-level Services, coordinator layer calls resource layer
- Inter-service communication method matches architecture decisions

**Stage Gate**: Service layer aligned with api-design-impl resource-level Services, communication method matches architecture decisions

### Step 3: Infrastructure Code Generation

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

### Step 4: Containerization and CI/CD Generation

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

### Step 5: Architecture Alignment Check and Code Self-Review

**Architecture Alignment Check**:
- Project directory structure consistent with bounded context division
- Inter-service communication method matches architecture decisions
- Middleware configuration matches security policy
- app.ts correctly mounts all routes and middleware

**Code Self-Review**:
- Check app.ts correctly integrates api-design-impl routes and data-architecture-impl database/cache initialization
- Check Service layer alignment with api-design-impl Services
- Check configuration management supports multiple environments
- Check Docker image can be built
- Check CI pipeline is complete (lint + test + build)
- Auto-fix discovered issues, P0 issues block output

**Stage Gate**: Project can start (npm run dev succeeds or equivalent command verification), health check endpoint accessible (/health returns 200), architecture decisions 100% reflected in code, code self-review P0 issues=0

### Step 6: Architecture Test Code Generation

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

## Decision Rules

| Condition | Decision |
|------|------|
| Architecture plan conflicts with code implementation | Follow architecture plan, adjust code implementation |
| Service design inconsistent with api-design-impl | Follow api-design-impl, adjust service layer |
| Code self-review finds P0 issues | Block output, auto-fix then re-review |
| Docker build fails | Adjust Dockerfile configuration |

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

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Architecture plan missing | Default monolithic architecture | Architecture pattern may not match business needs |
| Service design missing | Organize by module directory | Service division may be suboptimal |
| tech_stack not specified | Default Node.js/Express | Code style may not match |
| project_dir missing | Cannot generate code | Only output design documents |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Architecture plan change | app.ts + configuration + service layer | Mark affected code files, assess modification scope |
| Service design change | Service layer + communication layer | Update Service directory and communication configuration |
| API contract change | Route mounting | Update route registration in app.ts |
