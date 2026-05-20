---
name: data-architecture-spec
description: "Use when designing data architecture. Produces data architecture design specifications from PRD and architecture constraints, automatically designing business data dictionaries, ER models, table structures, index strategies, cache schemes, and data migration plans. Data boundaries divided by service data ownership from architecture plan. Business rule-driven normalization modeling. Keywords: data model, ER diagram, table structure, index, cache strategy, data migration, data dictionary, database design."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "Data Architecture"
  type: "pipeline"
  version: "5.0"
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

1. **Architecture Constraints First**: Data models designed within architecture boundaries, each service's data ownership determined by architecture
2. **Business Data Standards Driven**: Extract business data dictionary from PRD, ensuring unified data definitions
3. **Normalization and Denormalization Balance**: Follow 3NF for write-intensive scenarios, moderate denormalization for read-intensive scenarios
4. **Evidence-Based Caching**: Every cache item has a clear hit rate target and invalidation strategy
5. **Reversible Migrations**: Every migration must have a corresponding rollback script

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | Business entity and relationship requirements |
| PRD Structured Data | JSON | Yes | output/pm-design/design-prd/prd.json | Machine-consumable PRD version, containing entities[]/features[], for programmatic data model design consumption |
| Architecture Plan | JSON | Yes | output/backend-architecture/backend-architecture-spec/architecture_decision.json | Architecture pattern + topology diagram, determines database splitting strategy |
| Service Data Ownership | JSON | Yes | output/backend-architecture/backend-architecture-spec/service_data_ownership.json | Data entities owned by each service, determines data model boundaries |
| Tech Stack Decision | JSON | Yes | output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | Unified tech stack (including database type), replaces user-provided database_type |
| API Contract | YAML/JSON | O | output/backend-api-design/api-design-spec/openapi.yaml | Interface data structure definitions (empty when API not yet designed, normal case) |
| Data Volume Estimate | JSON | O | User provided | Core table data volume and growth rate |
| Concurrency Estimate | JSON | O | User provided | QPS/TPS peak and average |
| Current Schema | SQL/JSON | O | User provided | Existing database table structure (required for incremental projects) |

## Execution Steps

### Step 1: Business Data Dictionary Extraction [Core]

Extract business data entity definitions from PRD, establishing product data standards:

- Identify core business entities and attributes
- Define data types, constraints, and business rules
- Establish inter-entity relationships and referential integrity
- Generate business data dictionary (for downstream consumption)

**Stage Gate**: Core business entities 100% have data dictionary definitions

### Step 2: Entity Identification and Relationship Modeling [Core]

Extract data entities from PRD, service data ownership, and data dictionary:

- Identify core business entities (noun extraction)
- Group entities by service data ownership (service_data_ownership.json) into corresponding bounded contexts
- Determine inter-entity relationships (1:1 / 1:N / N:M)
- Annotate relationship cardinality and optionality
- Generate ER diagram

**Relationship Mapping Rules**:
- 1:1 -> Add foreign key to primary table + UNIQUE constraint
- 1:N -> Add foreign key to child table
- N:M -> Create association table

### Step 3: Table Structure and Index Design [Core]

Design table structure for each entity (primary key, foreign key, timestamps, soft delete, status fields and other common field conventions), design index strategy and database sharding plan.

**Architecture Constraint Adaptation**:
- Microservices: Determine whether database-per-service is needed based on service data ownership
- Monolithic: All entities in the same database, grouped by bounded context using schema prefixes
- Serverless: Consider using DynamoDB or other non-relational database table design

**Stage Gate**: ER diagram + DDL + data dictionary complete

### Step 4: Cache Strategy Design [Core]

Identify data access patterns requiring caching, design multi-level cache architecture, consistency strategy, and penetration/breakdown/avalanche protection.

**Cache Decision Matrix**:

| Scenario | Read/Write Ratio | Consistency Requirement | Recommended Cache Strategy | Consistency Scheme | TTL Suggestion |
|------|--------|-----------|-------------|-----------|---------|
| User profile | Read>>Write | Strong consistency | cache-aside | Write invalidate (delete cache after DB update) | 5min |
| Product/Course list | Read>>>Write | Eventual consistency | cache-aside + TTL | Write invalidate + short TTL fallback | 1-5min |
| Product/Course detail | Read>>>Write | Eventual consistency | cache-aside | Write invalidate | 5-10min |
| Inventory/Balance | Read~=Write | Strong consistency | write-through | Write through (sync write DB+cache) | No TTL |
| Hot rankings | Read>>>>Write | Eventual consistency | cache-aside + warmup | Scheduled refresh | 1min |
| Config/Dictionary | Read>>>>>>Write | Weak consistency | cache-aside + long TTL | Manual invalidation + long TTL | 30min |
| Session/Token | Read>>Write | Strong consistency | Distributed cache | Write through + short TTL | Consistent with Token expiration |
| Search results | Read>>>Write | Weak consistency | Local cache + distributed cache | Scheduled refresh | 30s-2min |

**Cache Level Selection**:

| Data Volume | Access Frequency | Recommended Level |
|--------|---------|---------|
| <100MB | Extremely high (>10K QPS) | Local cache + distributed cache |
| 100MB-1GB | High (1K-10K QPS) | Distributed cache |
| >1GB | Medium-low | Distributed cache + on-demand loading |

**Penetration/Breakdown/Avalanche Protection**:

| Problem | Cause | Protection Scheme |
|------|------|---------|
| Cache penetration | Querying non-existent data | Bloom filter + null value caching (TTL 30s) |
| Cache breakdown | Hot key expiration with massive concurrent requests | Mutex lock (only allow one request to fetch from source) + never expire (async refresh) |
| Cache avalanche | Large number of keys expiring simultaneously | TTL with random offset (+-10%) + multi-level cache expiration time staggered |

**Stage Gate**: Penetration/breakdown/avalanche protection fully covered

### Step 5: Data Migration Plan [Core]

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

**er_model.json Schema**:

```json
{
  "type": "object",
  "required": ["entities", "relationships"],
  "properties": {
    "entities": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "table_name", "bounded_context", "fields"],
        "properties": {
          "name": { "type": "string" },
          "table_name": { "type": "string" },
          "bounded_context": { "type": "string" },
          "fields": { "type": "array", "items": { "type": "object", "required": ["name", "type", "nullable"], "properties": { "name": { "type": "string" }, "type": { "type": "string" }, "nullable": { "type": "boolean" }, "default": {}, "constraints": { "type": "array", "items": { "type": "string" } } } } },
          "indexes": { "type": "array", "items": { "type": "object", "properties": { "name": { "type": "string" }, "fields": { "type": "array", "items": { "type": "string" } }, "unique": { "type": "boolean" }, "query_scenario": { "type": "string" } } } },
          "ddl": { "type": "string" }
        }
      }
    },
    "relationships": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["from", "to", "type"],
        "properties": {
          "from": { "type": "string" },
          "to": { "type": "string" },
          "type": { "type": "string", "enum": ["1:1", "1:N", "N:M"] },
          "through": { "type": "string" },
          "foreign_key": { "type": "string" }
        }
      }
    }
  }
}
```

**cache_strategy.json Schema**:

```json
{
  "type": "object",
  "required": ["strategies"],
  "properties": {
    "strategies": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["entity", "cache_type", "ttl", "invalidation"],
        "properties": {
          "entity": { "type": "string" },
          "cache_type": { "type": "string", "enum": ["local", "distributed", "multi-level"] },
          "ttl": { "type": "string" },
          "invalidation": { "type": "string", "enum": ["write-through", "write-behind", "cache-aside"] },
          "penetration_protection": { "type": "boolean" },
          "breakdown_protection": { "type": "boolean" },
          "avalanche_protection": { "type": "boolean" }
        }
      }
    }
  }
}
```

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
| Architecture plan missing | Default monolithic architecture, all entities in same database | Database splitting strategy may not match |
| Service data ownership missing | Derive entity ownership from PRD, mark "service ownership pending confirmation" | Data model boundaries may be inaccurate |
| Tech stack decision missing | Default PostgreSQL + Prisma | SQL dialect and ORM may not match |
| API contract missing | Normal case, API not yet designed, data model designed independently based on PRD + service data ownership | No API alignment coverage report |
| PRD missing | Cannot design data architecture | Output is empty |
| Current Schema missing | Design new table structures only, no migration scripts | No migration plan |
| Concurrency estimate missing | Design caching for moderate concurrency | Cache scheme may be insufficient or excessive |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| PRD entity add/remove | Data model + data dictionary | Mark affected entities, generate change list |
| Architecture plan change | Database splitting strategy | Re-evaluate database-per-service needs, adjust data model boundaries |
| Service data ownership change | Entity grouping + table structure | Re-divide entity ownership, assess cross-service data migration needs |
| API contract change | Table structure and indexes | Mark affected fields, assess migration needs |

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| ER model change | api-design-spec, data-architecture-impl, backend-architecture-impl | Mark affected entities and fields, update er_model.json |
| Cache strategy change | data-architecture-impl, backend-architecture-impl | Mark affected cache configurations, update cache_strategy.json |
| Data dictionary change | api-design-spec | Mark affected field naming and types, update data_dictionary.json |
