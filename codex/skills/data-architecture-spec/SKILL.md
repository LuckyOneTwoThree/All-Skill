---
name: data-architecture-spec
description: "Use when designing data architecture. Produces data architecture design specifications from PRD and API contracts, automatically designing business data dictionaries, ER models, table structures, index strategies, cache schemes, and data migration plans. Keywords: data model, ER diagram, table structure, index, cache strategy, data migration, data dictionary, database design."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Data Architecture"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Design database tables"
    - "Create tables and indexes"
    - "How to add caching for slow system response"
    - "How to design Redis caching"
    - "Modify table structure"
    - "Database upgrade"
---

# Data Architecture Design Specification

## Core Principles

1. **Business Data Standards First**: Extract business data dictionary from PRD, ensuring unified data definitions
2. **Normalization and Denormalization Balance**: Follow 3NF for write-intensive scenarios, moderate denormalization for read-intensive scenarios
3. **Evidence-Based Caching**: Every cache item has a clear hit rate target and invalidation strategy
4. **Reversible Migrations**: Every migration must have a corresponding rollback script

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | Business entity and relationship requirements |
| PRD Structured Data | JSON | Yes | output/pm-design/design-prd/prd.json | Machine-consumable PRD version, containing entities[]/features[], for programmatic data model design consumption |
| API Contract | YAML/JSON | Yes | output/backend-api-design/api-design-spec/openapi.yaml | Interface data structure definitions |
| database_type | string | Yes | User provided | Database type (PostgreSQL/MySQL/MongoDB/SQLite) |
| Data Volume Estimate | JSON | O | User provided | Core table data volume and growth rate |
| Concurrency Estimate | JSON | O | User provided | QPS/TPS peak and average |
| Current Schema | SQL/JSON | O | User provided | Existing database table structure (required for incremental projects) |

## Execution Steps

### Step 1: Business Data Dictionary Extraction

Extract business data entity definitions from PRD, establishing product data standards:

- Identify core business entities and attributes
- Define data types, constraints, and business rules
- Establish inter-entity relationships and referential integrity
- Generate business data dictionary (for downstream consumption)

**Stage Gate**: Core business entities 100% have data dictionary definitions

### Step 2: Entity Identification and Relationship Modeling

Extract data entities from PRD, API contract, and data dictionary:

- Identify core business entities (noun extraction)
- Determine inter-entity relationships (1:1 / 1:N / N:M)
- Annotate relationship cardinality and optionality
- Generate ER diagram

**Relationship Mapping Rules**:
- 1:1 -> Add foreign key to primary table + UNIQUE constraint
- 1:N -> Add foreign key to child table
- N:M -> Create association table

### Step 3: Table Structure and Index Design

Design table structure for each entity (primary key, foreign key, timestamps, soft delete, status fields and other common field conventions), design index strategy and database sharding plan.

**Stage Gate**: ER diagram + DDL + data dictionary complete

### Step 4: Cache Strategy Design

Identify data access patterns requiring caching, design multi-level cache architecture, consistency strategy, and penetration/breakdown/avalanche protection.

**Stage Gate**: Penetration/breakdown/avalanche protection fully covered

### Step 5: Data Migration Plan

Compare current Schema with target Schema, generate migration scripts + rollback scripts + verification plan. Skip this step for new projects.

**Stage Gate**: 100% of changes have rollback scripts, data model human-confirmed

## Output

**Metadata Output**: output/backend-data-architecture/data-architecture-spec/

**Output Files**:
- data_dictionary.json -- Business data dictionary
- er_model.json -- ER model + DDL + index strategy
- cache_strategy.json -- Cache scheme
- migration_plan.json -- Migration plan (incremental projects)
- data-coverage.json -- API alignment coverage report

## Decision Rules

| Condition | Decision |
|------|------|
| Write-intensive scenario | Follow 3NF |
| Read-intensive scenario | Moderate denormalization |
| Read/write ratio >10:1 | High cache value |
| Hotspot data | Multi-level caching + warmup |
| Large table migration | Online DDL or dual-write strategy |
| Multi-tenant + tenant count >100 | Shared database + tenant_id |

## Quality Checks

- [ ] Core business entities 100% have data dictionary definitions
- [ ] Each entity has complete table structure design
- [ ] Indexes have clear query scenario support
- [ ] Penetration/breakdown/avalanche protection fully covered
- [ ] Migration scripts 100% have rollback scripts
- [ ] API data requirements 100% have Model field coverage

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| API contract missing | Derive data structure from PRD | Data model may be incomplete |
| PRD missing | Cannot design data architecture | Output is empty |
| Current Schema missing | Design new table structures only, no migration scripts | No migration plan |
| Concurrency estimate missing | Design caching for moderate concurrency | Cache scheme may be insufficient or excessive |
| database_type not specified | Default PostgreSQL | SQL dialect may be incompatible |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| PRD entity add/remove | Data model + data dictionary | Mark affected entities, generate change list |
| API contract change | Table structure and indexes | Mark affected fields, assess migration needs |
