---
name: api-design-spec
description: "Use when designing API specifications. Produces API design specifications from PRD, automatically designing RESTful/GraphQL interface contracts, security policies, and authentication schemes, generating OpenAPI 3.0 specs. Built-in compliance check ensures API security and compliance. Keywords: API design, interface contract, OpenAPI, RESTful, GraphQL, API security, authentication, JWT, OAuth2, RBAC."
metadata:
  module: "Backend Architecture & Development"
  sub-module: "API Design"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Design API interfaces"
    - "Write API documentation"
    - "Define API specifications"
    - "API security protection"
    - "Implement login authentication"
    - "Design permission system"
---

# API Design Specification

## Core Principles

1. **Contract First**: API contracts determined during design phase, frontend and backend develop in parallel based on contracts
2. **Built-in Security**: Security policies and authentication designed alongside interfaces, not patched afterward
3. **Compliance by Default**: Privacy compliance checks built-in, ensuring API design meets GDPR/MLPS requirements
4. **RESTful Priority**: Prefer RESTful style, consider GraphQL for complex query scenarios
5. **Default Deny**: Any request not explicitly allowed is denied

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | Product requirements document |
| PRD Structured Data | JSON | Yes | output/pm-design/design-prd/prd.json | Machine-consumable PRD version, containing features[]/entities[], for programmatic API design consumption |
| Data Model | JSON | O | output/backend-data-architecture/data-architecture-spec/er_model.json | Data entity and relationship definitions (usually not ready during API design phase, derived from PRD) |
| Business Process | JSON | O | output/pm-design/design-userflow/userflow.json | User flow definitions |
| Security Level | string | Yes | User provided | Standard / High Security (Finance/Healthcare) |
| Compliance Requirements | string | O | User provided | GDPR / MLPS / PCI-DSS |
| Multi-tenant Requirements | string | O | User provided | Whether multi-tenant isolation is needed |
| Frontend Page Data Requirements | JSON | O | output/ui-frontend/page-builder/pages.json | Frontend page data fetching requirements, ensuring API and frontend alignment (available in UI-first flow) |
| PRD Page Data Requirements | JSON | O | output/pm-design/design-prd/prd.json -> pages[].data_requirements | Page data operation requirements from PRD (read/create/update/delete, related entity, required fields), consumed when pages.json is unavailable in backend-first flow |

## Execution Steps

### Step 1: Resource Identification and Modeling [Core]

Identify API resources from PRD and data model:

- Each core data entity maps to a resource (plural noun)
- Identify relationships between resources (one-to-one/one-to-many/many-to-many)
- Determine CRUD operation requirements for resources
- Mark which resources need nested resources (sub-resources)

**Page Data Requirements Consumption Priority** (resolving backend-first timing conflict):

| Priority | Data Source | Availability Timing | Consumption Method |
|----------|-------------|---------------------|-------------------|
| 1 | pages.json (UI output) | UI-first flow | Directly consume pages.json data_flow fields |
| 2 | prd.json -> pages[].data_requirements | Backend-first flow | Consume PRD page data_operations/related_entity/fields, derive API endpoints |
| 3 | Neither available | PRD and ER model only | Design CRUD interfaces only, mark "pending frontend data requirements supplement" |

When prd.json pages[].data_requirements is available, derive API endpoints following these rules:
- data_operations contains "read" -> corresponding GET endpoint
- data_operations contains "create" -> corresponding POST endpoint
- data_operations contains "update" -> corresponding PUT/PATCH endpoint
- data_operations contains "delete" -> corresponding DELETE endpoint
- related_entity -> maps to corresponding resource path
- fields -> serves as subset of response fields or request fields

**Resource Naming Conventions**:
- Use plural nouns: `/courses` not `/course`
- Nested resources max 2 levels: `/courses/{id}/lessons`
- Use kebab-case: `/user-groups` not `/userGroups`

### Step 2: Interface and Specification Design [Core]

Design standard interfaces for each resource:

| Operation | Method | Path | Description |
|------|--------|------|------|
| List Query | GET | /resources | Pagination + filtering + sorting |
| Detail Query | GET | /resources/{id} | Single resource details |
| Create | POST | /resources | Create new resource |
| Full Update | PUT | /resources/{id} | Replace entire resource |
| Partial Update | PATCH | /resources/{id} | Update specified fields |
| Delete | DELETE | /resources/{id} | Delete resource |

Define unified request/response formats, error code system, and versioning strategy.

**Stage Gate**: Each resource has CRUD definition + error code system

### Step 3: Interface Security Design [Core]

Classify interfaces by sensitivity level:

| Level | Interface Type | Access Control | Audit Requirements |
|------|---------|---------|---------|
| L1-Public | Health check, public docs | No authentication | None |
| L2-Authenticated | User personal info, business queries | Token authentication | Query logs |
| L3-Authorized | Write operations, admin functions | Token + permission check | Operation logs + change records |
| L4-Sensitive | Payments, keys, data export | Token + permission + secondary verification | Full audit + alerts |

Design rate limiting strategy, data security (encryption/masking/input validation), CORS and security headers.

**Stage Gate**: 100% of interfaces have security level + rate limiting rules, L4 interface security policies are complete

### Step 4: Authentication and Authorization Design [Core]

Select authentication scheme based on business scenario (JWT/OAuth2/SSO), design permission model (RBAC/ABAC), multi-tenant isolation and session management.

**Stage Gate**: Authentication scheme + permission model + session management complete

### Step 5: Compliance Check [Core]

Built-in privacy compliance assessment:
- Personal information collection minimum necessity principle check
- Cross-border data transfer compliance check
- User consent mechanism design
- Data retention and deletion policy
- Generate security requirements checklist

**Stage Gate**: Compliance check has no P0 issues

## Output

**Metadata Output**: output/backend-api-design/api-design-spec/

**Output Files**:
- openapi.yaml -- OpenAPI 3.0 specification
- security-policy.json -- Security policy
- auth-scheme.json -- Authentication and authorization scheme
- compliance-checklist.json -- Compliance checklist
- api-coverage.json -- PRD/frontend alignment coverage report

## Decision Rules

| Condition | Decision |
|------|------|
| Many-to-many relationship between resources | Create association resource |
| Query conditions >=5 | Consider providing GraphQL endpoint |
| Security level = High Security | L3+ interfaces all require request signing + full audit |
| Number of roles <=10 and fixed | Use RBAC |
| Number of roles >10 or frequently changing | Use RBAC + permission groups |
| Multi-tenant + tenant count >100 | Shared database + tenant_id |
| Involves personal privacy data | Mandatory masking + encrypted storage + compliance check |
| Compliance requirements include GDPR | Data export interface + data deletion interface |

## Quality Checks

- [ ] Each resource has complete CRUD interface definition
- [ ] 100% of interfaces have security level annotation
- [ ] L2+ interfaces 100% have authentication requirements
- [ ] Authentication scheme covers all user scenarios
- [ ] Permission model covers all roles and permissions
- [ ] Compliance check has no P0 issues
- [ ] Sensitive fields 100% have masking or encryption strategy
- [ ] PRD feature points 100% have API endpoint coverage
- [ ] Frontend page data requirements 100% have API correspondence (when frontend input or PRD page data requirements exist)

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Data model missing | Derive core entities from PRD | Resource definitions based on derivation, marked as "pending data model confirmation" |
| Business process missing | Design CRUD interfaces only | Missing cross-resource business interfaces |
| PRD missing | Cannot design API | Output is empty |
| Security level not specified | Default standard level | May not meet high security requirements |
| Frontend page data requirements missing | Prefer consuming prd.json pages[].data_requirements to derive API endpoints; if PRD also lacks page data, design CRUD interfaces based on PRD and ER model only | May lack frontend-specific data aggregation interfaces and pagination/filtering requirements |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| PRD feature points added/removed | API endpoints added/removed | Mark affected API endpoints, generate change list |
| Data model change | API request/response structure | Mark affected fields, assess backward compatibility |

| API Change Type | Compatibility | Notification Scope | Notification Method |
|-------------|--------|----------|----------|
| New endpoint | Backward compatible | api-design-impl | Mark new endpoint, implementation Skill can incrementally generate |
| Deleted endpoint | Breaking change | api-design-impl | Must have human confirmation, provide migration plan |
| Modified field type | Breaking change | api-design-impl | Must have human confirmation, provide compatibility plan |
