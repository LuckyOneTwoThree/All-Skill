---
name: api-design-impl
description: "Use when API code generation is needed. Generates runnable routes, controllers, services, middleware, and type code from api-design-spec OpenAPI specs and security policies. Built-in PRD alignment, frontend alignment, and code self-review. Keywords: generate API code, write endpoint code, generate routes, generate controller, generate service, API code generation."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "API Design"
  type: "pipeline"
  version: "5.0"
  trigger_examples:
    - "Generate API code"
    - "Write endpoint code"
    - "Generate routes and controllers"
    - "Generate service code"
    - "Generate middleware code"
---

# API Code Implementation

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../../codex-templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## Core Principles

1. **Design as Specification**: Strictly follow api-design-spec outputs, never modify interface contracts without authorization
2. **Clear Layering**: Controllers only handle transformation, Services contain logic, Repositories access data
3. **Type Safety**: API types and data models are converted through mappers, never directly referenced
4. **Built-in Security**: Middleware automatically matched by security level, sensitive fields automatically masked
5. **Test Coverage**: Every API endpoint has an integration test skeleton

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| OpenAPI Specification | YAML | Yes | output/backend-api-design/api-design-spec/openapi.yaml | API contract definition |
| Security Policy | JSON | Yes | output/backend-api-design/api-design-spec/security-policy.json | Security levels and rate limiting rules |
| Authentication & Authorization Scheme | JSON | Yes | output/backend-api-design/api-design-spec/auth-scheme.json | Authentication and permission scheme |
| Compliance Checklist | JSON | O | output/backend-api-design/api-design-spec/compliance-checklist.json | Compliance requirements |
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | For PRD alignment check |
| PRD Structured Data | JSON | Yes | output/pm-design/design-prd/prd.json | Machine-consumable PRD version for code generation alignment |
| Data Model | JSON | Yes | output/backend-data-architecture/data-architecture-spec/er_model.json | Data entity and relationship definitions, API types converted through mappers with Model types |
| Data Layer Implementation Report | JSON | Yes | output/backend-data-architecture/data-architecture-impl/impl-report.json | Data layer implementation report, containing Repository list and method signatures, for Service to call real implementations |
| Frontend Page Data Requirements | JSON | O | output/ui-frontend/page-builder/pages.json | For frontend alignment check |
| Tech Stack Decision | JSON | O | output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | Unified tech stack, determines API framework and middleware style |
| project_dir | string | Yes | User provided | Project root directory absolute path |
| tech_stack | string | O | User provided | Fallback when tech_stack_decision.json is not available |

## Execution Steps

### Step 1: Code Skeleton Generation [Core]

Generate project API layer code skeleton based on OpenAPI specification:

| Generated Content | Path | Description |
|----------|------|------|
| Route Definitions | src/routes/ | One route file per resource, including CRUD endpoints |
| Route Registration Entry | src/routes/index.ts | Unified route registration entry for backend-architecture's app.ts mounting |
| Controllers | src/controllers/ | One controller per resource, responsible for request/response transformation and parameter validation |
| Request Validation | src/validators/ | Request parameter validation based on OpenAPI schema |
| API Type Definitions | src/types/api.ts | API request/response TypeScript types (aligned with OpenAPI), defining API layer transport structures only |
| Type Mapping Layer | src/types/mappers.ts | API type<->Model type conversion functions **complete implementation** (Model types already generated by data-architecture-impl, complete conversion logic generated here based on er_model.json and OpenAPI specification) |

**Stage Gate**: Code compiles (npm run build or tsc --noEmit passes), routes correspond one-to-one with OpenAPI specification

### Step 2: Service Business Logic Implementation [Core]

Generate a Service for each resource, including complete business logic:

| Generated Content | Path | Description |
|----------|------|------|
| Services | src/services/resource/ | One service per resource, including resource-level business logic (CRUD), transaction management, cache calls |

**Service Method Structure**: Parameter validation->Permission check->Business processing->Data persistence->Cache update->Response assembly

**Code Quality Requirements**:
- Controller methods only handle request/response transformation + parameter validation, no business logic
- Service methods include complete business logic + error handling + transaction management + JSDoc comments
- Services access data through **existing** Repository+CacheRepository (Repository methods obtained from impl-report.json), code is compilable and runnable

**Stage Gate**: Every API endpoint has a corresponding Service method, Controller->Service->Repository call chain is complete, all Repository calls reference implemented methods

### Step 3: Middleware and Security Implementation [Core]

Generate middleware based on security policy and authentication scheme:

| Generated Content | Path | Description |
|----------|------|------|
| Middleware | src/middleware/ | Authentication, rate limiting, CORS, error handling middleware |

**Implementation Requirements**:
- Middleware automatically matches authentication strategy by security level (L1-L4)
- Rate limiting rules directly written into middleware configuration
- Unified error response format consistent with OpenAPI error code system

**Stage Gate**: L1-L4 middleware matching is correct, rate limiting rules are consistent with security policy

### Step 4: Alignment Check and Code Self-Review [Core]

**PRD Alignment Check**:
- Check each PRD feature point one by one, ensuring every feature point has a corresponding API endpoint
- If frontend page data requirements input exists, check each page one by one to ensure API covers all frontend data fetching needs
- Uncovered feature points are marked as TODO and supplementary suggestions are generated

**Frontend Alignment Check**:
- If frontend page data requirements exist, verify each page's data fetching has a corresponding API
- API response fields match frontend page display requirements
- Missing API endpoints are automatically supplemented

**Code Self-Review**:
- Check generated code for compliance with security policy (L1-L4 middleware matching, sensitive field masking)
- Check Controller->Service->Repository call chain completeness
- Check API type consistency with OpenAPI specification
- Check for SQL injection, XSS, and other security vulnerabilities
- Auto-fix discovered issues, P0 issues block output

**Stage Gate**: PRD feature points 100% have API coverage, frontend data requirements 100% have API correspondence, code self-review P0 issues=0

### Step 5: API Test Code Generation [Core]

Generate integration test skeletons for each API endpoint:

- Test coverage: Normal flow, parameter validation failure, permission denied, resource not found
- Test files output to src/__tests__/routes/

**Stage Gate**: Every API endpoint has an integration test skeleton

## Output

Adopts **dual output mode**:

1. **Code Files** -> Directly written to user-specified `{project_dir}/src/` project directory
2. **Metadata Files** -> Written to `output/` directory for downstream Skill consumption

**Code File Output**: {project_dir}/src/ (routes, controllers, services, middleware, type definitions, tests directly written to project directory)

**Metadata Output**: output/backend-api-design/api-design-impl/

**Metadata Output Files**:
- impl-report.json -- Code implementation report (generated file list + alignment check results + self-review results)

**impl-report.json Schema**:

```json
{
  "type": "object",
  "required": ["skill_name", "version", "generated_files", "alignment_check", "self_audit"],
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
          "type": { "type": "string", "enum": ["route", "controller", "service", "validator", "middleware", "type", "mapper", "test"] },
          "description": { "type": "string" }
        }
      }
    },
    "alignment_check": {
      "type": "object",
      "required": ["prd_alignment", "frontend_alignment", "security_alignment", "repository_call_chain"],
      "properties": {
        "prd_alignment": { "type": "object", "properties": { "passed": { "type": "boolean" }, "uncovered_features": { "type": "array", "items": { "type": "string" } } } },
        "frontend_alignment": { "type": "object", "properties": { "passed": { "type": "boolean" }, "uncovered_pages": { "type": "array", "items": { "type": "string" } } } },
        "security_alignment": { "type": "object", "properties": { "passed": { "type": "boolean" }, "issues": { "type": "array", "items": { "type": "object", "properties": { "severity": { "type": "string" }, "message": { "type": "string" } } } } } },
        "repository_call_chain": { "type": "object", "properties": { "passed": { "type": "boolean" }, "missing_repository_methods": { "type": "array", "items": { "type": "object", "properties": { "service": { "type": "string" }, "method": { "type": "string" }, "repository": { "type": "string" } } } } } }
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
| OpenAPI specification inconsistent with PRD | Follow PRD, correct OpenAPI specification, mark differences for human confirmation |
| Security policy conflicts with code implementation | Follow security policy, adjust code implementation |
| Frontend data requirements missing API | Automatically supplement API endpoints, mark as "frontend-driven addition" |
| Code self-review finds P0 issues | Block output, auto-fix then re-review |
| Data model missing | Cannot generate mappers, error and block |
| Data layer implementation report missing | Cannot call real Repository, mark which Service methods are skeletons, note pending data-architecture-impl completion for full implementation |
| Tech stack decision conflicts with user specification | Prefer tech_stack_decision.json (architecture design output), then tech_stack parameter (user direct input), default to Express+TypeScript. Mark conflicts for human confirmation |

## Quality Checks

- [ ] Code compiles (npm run build or tsc --noEmit passes)
- [ ] Routes correspond one-to-one with OpenAPI specification
- [ ] Controllers only handle request/response transformation, no business logic
- [ ] Services include complete business logic + error handling + transaction management
- [ ] Middleware correctly matched by security level
- [ ] mappers.ts API<->Model type conversion complete implementation (not skeleton)
- [ ] Repository methods called by Service exist in impl-report.json
- [ ] PRD feature points 100% have API endpoint coverage
- [ ] Frontend page data requirements 100% have API correspondence (when frontend input exists)
- [ ] Code self-review P0 issues=0
- [ ] Every API endpoint has an integration test skeleton

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Data model missing | Cannot generate mappers, error and block | Cannot generate API code |
| Data layer implementation report missing | Service calls Repository with skeleton code, mark "pending data-architecture-impl completion for supplement" | Service cannot be fully implemented, code cannot compile |
| Tech stack decision missing | Use tech_stack parameter (user provided), default to Express+TypeScript if absent | Code style may not match |
| Security policy missing | Default L2 authentication level | Middleware may not meet security requirements |
| Authentication scheme missing | Default JWT+RBAC | Authentication scheme may not match business needs |
| PRD missing | Generate code based on OpenAPI specification only | Cannot perform PRD alignment check |
| Frontend page data requirements missing | Generate code based on OpenAPI specification only | Cannot perform frontend alignment check |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| OpenAPI specification change | Routes+Controllers+Services+Types | Mark affected code files, assess modification scope |
| Data model change | mappers.ts + API types | Update API<->Model type conversion logic |
| Data layer implementation change | Repository calls in Service | Update Repository method calls, supplement new query methods as needed |
| Security policy change | Middleware configuration | Update middleware matching rules |
| Authentication scheme change | Middleware+Service permission checks | Update authentication and permission logic |
| Tech stack decision change | Tech stack related configuration | Update framework and middleware configuration |

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Route change | backend-architecture-impl (app.ts route mounting) | Mark affected route registrations, update impl-report.json |
| Service interface change | backend-architecture-impl (coordinator layer) | Mark affected cross-resource coordination logic, update impl-report.json |
| Middleware configuration change | backend-architecture-impl (app.ts middleware registration) | Mark affected middleware registrations, update impl-report.json |
