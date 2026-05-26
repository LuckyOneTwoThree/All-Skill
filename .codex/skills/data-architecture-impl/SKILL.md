---
name: data-architecture-impl
description: "Use when generating data layer code. Implements data layer code from data-architecture-spec ER models and table structure designs, generating runnable Models, Migrations, Repositories, and cache layer code to the project directory. Built-in API alignment check and code self-review. Keywords: generate Model code, generate Migration, generate Repository, generate cache code, data layer code generation."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Data Architecture"
  type: "pipeline"
  version: "5.0"
  trigger_examples:
    - "Generate Model code"
    - "Generate Migration scripts"
    - "Generate Repository code"
    - "Generate cache layer code"
    - "Table creation script generation"
---

# Data Layer Code Implementation

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../../codex-templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## Core Principles

1. **Design as Specification**: Strictly follow data-architecture-spec outputs, Model fields fully consistent with DDL
2. **Clear Layering**: Models only define data layer structure, API types defined by api-design-impl's types/api.ts
3. **Cache Alignment**: Cache layer code aligned with cache strategy design
4. **Reversible Migrations**: Every Migration script has a corresponding rollback script
5. **Test Coverage**: Every Model and Repository has a test skeleton

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| ER Model | JSON | Yes | output/backend-data-architecture/data-architecture-spec/er_model.json | Entity relationships and DDL definitions |
| Cache Strategy | JSON | Yes | output/backend-data-architecture/data-architecture-spec/cache_strategy.json | Cache scheme |
| Migration Plan | JSON | O | output/backend-data-architecture/data-architecture-spec/migration_plan.json | Migration plan (incremental projects) |
| API Contract | YAML | O | output/backend-api-design/api-design-spec/openapi.yaml | For API alignment check (empty when API not yet implemented, normal case) |
| Tech Stack Decision | JSON | Yes | output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | Unified tech stack, including language/ORM/database type |
| project_dir | string | Yes | User provided | Project root directory absolute path |
| tech_stack | string | O | User provided | Fallback when tech_stack_decision.json is not available |

## Execution Steps

### Step 1: Model Code Generation [Core]

Generate data layer entity code based on ER model:

| Generated Content | Path | Description |
|----------|------|------|
| Model/Entity | src/models/ (or entities/) | One Model file per entity, including field definitions, validation rules, relationships, defining data layer structure only |
| Database Configuration | src/config/database.ts | Database connection configuration + connection pool |

**Code Quality Requirements**:
- Model field types, constraints, default values fully consistent with DDL
- Models only define data layer structure, API types defined by api-design-impl's types/api.ts

**Stage Gate**: Code compiles (npm run build or tsc --noEmit passes), Model fields consistent with DDL

### Step 2: Migration and Seed Data Generation [Core]

Generate migration scripts and seed data based on DDL:

| Generated Content | Path | Description |
|----------|------|------|
| Migration Scripts | src/migrations/ | Migration scripts for table creation/indexes/seed data |
| Seed Data | src/seeds/ | Development environment seed data |

**Code Quality Requirements**:
- Migration scripts are executable and reversible
- Seed data covers core business entities

**Stage Gate**: Migrations are executable (verified via npx prisma migrate status or equivalent), 100% have rollback scripts

### Step 3: Repository Code Generation [Core]

Generate a Repository for each entity:

| Generated Content | Path | Description |
|----------|------|------|
| Repository/DAO | src/repositories/ (or dao/) | One Repository per entity, including CRUD operations + common queries |

**Code Quality Requirements**:
- Repository methods have complete type annotations + error handling
- Query methods cover all API layer data access needs
- Soft delete, pagination, sorting uniformly encapsulated in Repository layer

**Stage Gate**: Every API data access need has a corresponding Repository method

### Step 4: Cache Layer Code Generation [Core]

Generate cache layer code based on cache strategy:

| Generated Content | Path | Description |
|----------|------|------|
| Cache Layer | src/cache/ | Redis connection configuration, CacheRepository, cache decorators/interceptors |

**Code Quality Requirements**:
- Cache layer aligned with cache strategy design: hit rate targets, invalidation strategy, penetration/breakdown/avalanche protection
- CacheRepository encapsulates cache read/write logic, Services access data through Repository+CacheRepository

**Stage Gate**: Cache layer aligned with cache strategy design

### Step 5: Alignment Check and Code Self-Review [Core]

**API Alignment Check** (optional, executed when API contract exists):
- Check each API contract request/response structure one by one, ensuring Model fields cover all API requirements
- Missing fields are marked and automatically supplemented
- When no API contract exists, skip this check, mark "API alignment pending api-design-impl completion, to be verified by backend-architecture-impl unified check"

**Code Self-Review**:
- Check Model field consistency with DDL
- Check Migration scripts are executable and reversible
- Check cache layer alignment with cache strategy design
- Check Repository queries for N+1 issues
- Check index coverage for high-frequency query scenarios
- Auto-fix discovered issues, P0 issues block output

**Stage Gate**: Model fields consistent with DDL, code self-review P0 issues=0

### Step 6: Data Layer Test Code Generation [Core]

Generate test code for the data layer:

- Generate field validation tests for each Model
- Generate CRUD test skeletons for each Repository
- Generate execution + rollback verification tests for Migrations
- Test files output to src/__tests__/models/ and src/__tests__/repositories/

**Stage Gate**: Every Model and Repository has a test skeleton

## Output

Adopts **dual output mode**:

1. **Code Files** -> Directly written to user-specified `{project_dir}/src/` project directory
2. **Metadata Files** -> Written to `output/` directory for downstream Skill consumption

**Code File Output**: {project_dir}/src/ (Models, Migrations, Repositories, cache layer, configuration, tests directly written to project directory)

**Metadata Output**: output/backend-data-architecture/data-architecture-impl/

**Metadata Output Files**:
- impl-report.json -- Code implementation report (generated file list + alignment check results + self-review results)

**impl-report.json Schema**:

```json
{
  "type": "object",
  "required": ["skill_name", "version", "generated_files", "repositories", "alignment_check", "self_audit"],
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
          "type": { "type": "string", "enum": ["model", "migration", "repository", "cache", "config", "seed", "test"] },
          "description": { "type": "string" }
        }
      }
    },
    "repositories": {
      "type": "array",
      "description": "Repository list and method signatures, for api-design-impl consumption",
      "items": {
        "type": "object",
        "required": ["name", "entity", "methods"],
        "properties": {
          "name": { "type": "string" },
          "entity": { "type": "string" },
          "file_path": { "type": "string" },
          "methods": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["name", "return_type"],
              "properties": {
                "name": { "type": "string" },
                "params": { "type": "array", "items": { "type": "object", "properties": { "name": { "type": "string" }, "type": { "type": "string" } } } },
                "return_type": { "type": "string" },
                "description": { "type": "string" }
              }
            }
          }
        }
      }
    },
    "alignment_check": {
      "type": "object",
      "required": ["passed", "issues"],
      "properties": {
        "passed": { "type": "boolean" },
        "issues": { "type": "array", "items": { "type": "object", "properties": { "severity": { "type": "string", "enum": ["P0", "P1", "P2"] }, "category": { "type": "string" }, "message": { "type": "string" }, "resolution": { "type": "string" } } } }
      }
    },
    "self_audit": {
      "type": "object",
      "required": ["p0_count", "p1_count", "passed", "items"],
      "properties": {
        "p0_count": { "type": "integer" },
        "p1_count": { "type": "integer" },
        "passed": { "type": "boolean" },
        "items": { "type": "array", "items": { "type": "object", "properties": { "severity": { "type": "string", "enum": ["P0", "P1", "P2"] }, "check": { "type": "string" }, "result": { "type": "string", "enum": ["pass", "fail", "fixed"] }, "detail": { "type": "string" } } } }
      }
    }
  }
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| ER model inconsistent with API contract | Follow ER model, mark differences for human confirmation |
| Cache strategy conflicts with code implementation | Follow cache strategy, adjust code implementation |
| Code self-review finds P0 issues | Block output, auto-fix then re-review |
| Repository queries have N+1 issues | Switch to JOIN or batch queries |
| Tech stack decision conflicts with user specification | Prefer tech_stack_decision.json (architecture design output), then tech_stack parameter (user direct input), default to Node.js/Prisma. Mark conflicts for human confirmation |

## Quality Checks

- [ ] Code compiles (npm run build or tsc --noEmit passes)
- [ ] Model fields fully consistent with DDL
- [ ] Migration scripts are executable and reversible
- [ ] Every Repository method has type annotations + error handling
- [ ] Soft delete/pagination/sorting uniformly encapsulated
- [ ] Cache layer aligned with cache strategy design
- [ ] Models only define data layer structure, API types defined by api-design-impl's types/api.ts
- [ ] Code self-review P0 issues=0
- [ ] Every Model and Repository has a test skeleton
- [ ] API field coverage (mandatory when API contract exists, mark pending verification when absent)

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Tech stack decision missing | Use tech_stack parameter (user provided), default to Node.js/Prisma if absent | Code style may not match |
| Cache strategy missing | Do not generate cache layer code | No cache layer, Services directly access Repository |
| Migration plan missing | Do not generate migration scripts | No migration plan |
| API contract missing | Normal case, generate code based on ER model only, API alignment check degraded to optional | API field coverage pending api-design-impl completion for verification |
| tech_stack parameter missing | Default Node.js/Prisma | Code style may not match |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| ER model change | Model+Migration+Repository | Mark affected code files, assess modification scope |
| Cache strategy change | Cache layer code | Update CacheRepository and cache configuration |
| Tech stack decision change | Tech stack related configuration | Update ORM configuration and database connection code |
| API contract change | Repository query methods | Assess whether new or modified query methods are needed |

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Repository method signature change | api-design-impl | Mark affected Service calls, update repositories field in impl-report.json |
| Model field change | api-design-impl (mappers.ts) | Mark affected type conversions, update impl-report.json |
| Cache layer interface change | api-design-impl, backend-architecture-impl | Mark affected cache calls, update impl-report.json |
