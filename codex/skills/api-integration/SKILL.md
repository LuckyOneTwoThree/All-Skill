---
name: api-integration
description: "Use when integrating frontend with backend APIs. Auto-generates frontend request layer code from API contracts, including type-safe API clients, request/response interceptors, error handling, and mock data. Keywords: API integration, interface debugging, request layer, API client, frontend-backend integration, connect API, call API."
metadata:
  module: "UI Design & Frontend Development"
  sub-module: "Frontend Integration"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Integrate with backend API"
    - "Generate request layer code"
    - "Call API"
---

# API Integration Auto-Generation

## Core Principles

1. **Contract-Driven** -- API client code auto-generated from contracts, no hand-written request functions. When contracts are missing, infer from page data flows, but inference results must be human-confirmed
2. **Type Safety** -- Request parameters and response types 100% derived from contracts, zero any types
3. **Defensive Programming** -- Every API call has error handling, timeout, and retry; error handling strategy defined in layers
4. **Built-in Authentication** -- Token management, refresh, expiration handling as infrastructure, never missed
5. **Developer Experience** -- Mock data auto-generated, frontend and backend can develop in parallel, one-click switch between mock and real APIs

## Interaction Mode

AI AI suggests, human confirms

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| API Contract | YAML/JSON | O | output/backend-api-design/api-design-spec/openapi.yaml | OpenAPI 3.0 specification (infer from page data flows when missing) |
| Authentication Scheme | JSON | O | output/backend-api-design/api-design-spec/auth-scheme.json | Backend API authentication design (JWT/OAuth2/SSO scheme, permission model, session management), takes priority over PRD non-functional requirements |
| Security Policy | JSON | O | output/backend-api-design/api-design-spec/security-policy.json | Backend API security policy (rate limiting rules, CORS policy, data masking rules), for frontend error handling and security policy alignment |
| Page Data Flows | JSON | Yes | output/ui-frontend/page-builder/pages.json | Page data fetching requirements |
| Target Framework | string | Yes | Passed from upstream orchestrator | React/Vue/Svelte |
| Target Language | string | O | Passed from upstream orchestrator (default zh-CN) | Target interface language, affects mock data and error message language |
| project_dir | string | Yes | Passed from upstream orchestrator | Project root directory absolute path |
| Auth Scheme | string | O | PRD non-functional requirements / User provided | JWT/OAuth2/Cookie/ApiKey (default JWT), used when auth-scheme.json is unavailable |

## Execution Steps

### Step 1: API Contract Parsing and Endpoint Planning

**1a. Contract Parsing**

If API contract input exists:
1. Parse OpenAPI/Swagger specification, extract all endpoints (method/path/parameters/requestBody/responses)
2. Extract authentication schemes (security schemes)
3. Extract common error code definitions
4. Mark deprecated endpoints

If API contract is missing:
1. Infer API endpoints from pages.json data_flow fields
2. Inference rule: each data_flow source corresponds to one API endpoint
3. Inferred endpoints marked with `inferred: true`
4. Generate inference report, requires human confirmation

**1b. Endpoint Classification and Directory Planning**

| Classification Rule | Directory Structure | Example |
|---------|---------|------|
| By domain module | src/api/{module}/ | src/api/auth/, src/api/user/, src/api/product/ |
| Common endpoints | src/api/shared/ | Health check, config endpoints |
| Endpoints <=5 | Single file src/api/index.ts | Small projects without module separation |

**1c. Authentication Scheme Planning**

| Auth Type | Implementation Strategy | Token Storage |
|---------|---------|----------|
| JWT | Axios interceptor auto-inject Authorization header | localStorage + memory cache |
| OAuth2 | Authorization code flow + PKCE | localStorage + memory cache |
| Cookie | withCredentials configuration | Browser auto-managed |
| ApiKey | Request header/query parameter injection | Environment variables |

Token refresh strategy:
- Auto-refresh 5 minutes before expiration (based on exp claim)
- Refresh failure -> redirect to login page
- Concurrent requests queue while refresh is in progress

### Step 2: API Client Code Generation

**2a. Type Definition Generation**

Derive TypeScript types from contract schema:

```typescript
type {Endpoint}Request = { /* derived from requestBody */ }
type {Endpoint}Response = { /* derived from 200 response schema */ }
type {Endpoint}Error = { /* derived from 4xx/5xx response schema */ }

type ApiResponse<T> = { code: number; data: T; message: string }
type PaginatedResponse<T> = { items: T[]; total: number; page: number; page_size: number }
```

**2b. Request Function Generation**

Generate one request function per endpoint:

```typescript
export async function {endpointName}(params: {Endpoint}Request, config?: RequestConfig): Promise<{Endpoint}Response> {
  return request.{method}<{Endpoint}Response>('{path}', params, config)
}
```

Generation rules:
- GET request parameters mapped as query parameters
- POST/PUT/PATCH request parameters mapped as request body
- Path parameters (e.g. /users/{id}) extracted from params
- Each function includes JSDoc comments (extracted from contract description/summary)

**2c. Request Layer Infrastructure**

| Infrastructure | Implementation Content |
|---------|---------|
| HTTP Client | Axios instance (React/Vue) or fetch wrapper (Svelte) |
| Request Interceptor | Token injection + request ID + timestamp + request body serialization |
| Response Interceptor | Unified error handling + token expiration auto-refresh + response unwrapping |
| Error Handling | Network error/timeout(10s)/business error/auth expiration layered handling |
| Retry Strategy | Network errors and 5xx retry 2 times, exponential backoff (1s/2s) |
| Cancellation Mechanism | AbortController wrapper, auto-cancel on page unmount |
| Request Deduplication | Merge concurrent requests with same URL+parameters |

**2d. Error Handling Strategy**

| Error Type | Handling Method | User Feedback |
|---------|---------|---------|
| Network error | Retry 2 times -> prompt network exception | "Network connection error, please check your network and retry" |
| Timeout (>10s) | Retry 1 time -> prompt response timeout | "Request timed out, please try again later" |
| 401 Unauthorized | Attempt token refresh -> redirect to login | Auto-redirect to login page |
| 403 Forbidden | Prompt no permission | "You do not have permission to perform this action" |
| 404 Not Found | Prompt resource not found | "Requested resource not found" |
| 422 Validation Failed | Extract field errors | Display specific field error messages |
| 429 Rate Limited | Wait then retry | "Too many requests, please try again later" |
| 5xx Server Error | Retry 2 times -> prompt server exception | "Server error, please try again later" |

### Step 3: Mock Data and Parallel Development

**3a. Mock Data Generation**

Generate mock data from contract response schema:
- String type: Infer content from field name (name->"John Doe", email->"test@example.com")
- Number type: Generate based on range constraints, use reasonable defaults when no constraints
- Array type: Generate 3-5 records
- Nested objects: Generate recursively
- Enum type: Randomly select one value
- When target language != en-US, mock data uses target language content

**3b. Mock Switch Mechanism**

```typescript
export const useMock = import.meta.env.VITE_API_MOCK === 'true'

export async function getUser(id: string) {
  if (useMock) return mockData.user
  return request.get(`/users/${id}`)
}
```

**3c. MSW Integration (Recommended)**

Generate MSW (Mock Service Worker) handlers:
- One handler per endpoint
- Support request parameter matching
- Support delay simulation (200-500ms random delay)
- Support error scenario simulation (5% probability of returning 500 error)

### Step 4: Data Layer Integration and Cache Strategy

**4a. Data Preloading Configuration**

| Framework | Solution | Configuration |
|------|------|------|
| React | React Query (TanStack Query) | staleTime/cacheTime/refetchOnWindowFocus |
| Vue | Vue Query (TanStack Query) | staleTime/cacheTime/refetchOnWindowFocus |
| Svelte | svelte-query | staleTime/cacheTime/refetchOnWindowFocus |

**4b. Cache Strategy**

| Data Type | staleTime | cacheTime | Refetch Strategy |
|---------|-----------|-----------|------------|
| User info | 5min | 30min | Window focus |
| List data | 2min | 10min | Window focus |
| Detail data | 10min | 30min | No auto-refresh |
| Config data | 30min | 60min | No auto-refresh |
| Realtime data | 0 | 5min | Polling (5s) |

**4c. Optimistic Update Configuration**

Generate optimistic update configuration for write operations (POST/PUT/PATCH):
- Update operations: Immediately update cache, rollback on failure
- Delete operations: Immediately remove from cache, restore on failure
- Create operations: Immediately add to cache (temporary ID), replace with real ID on success

**4d. Replace page-builder Fallback Data Layer**

When api-integration executes, replace page-builder generated fallback data layer:
1. Locate all files annotated with `@api-integration`
2. Replace fallback functions with api-integration generated request functions
3. Keep function signatures consistent (page-builder fallback signatures aligned with api-integration request function signatures)
4. Delete no-longer-needed mock data files
5. Verify page functionality after replacement

## Output

**Code File Output**: {project_dir}/src/api/ (API client, type definitions, mock data directly written to project directory)

**Metadata Output**: output/ui-frontend-integration/api-integration/

**Output Files**: api-integration.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["endpoints", "types", "mock_data", "auth_config", "cache_config", "error_handling", "project_dir"],
  "properties": {
    "endpoints": {
      "type": "array",
      "description": "API endpoint list",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "Function name"},
          "method": {"type": "string", "enum": ["GET","POST","PUT","PATCH","DELETE"]},
          "path": {"type": "string", "description": "API path"},
          "request_type": {"type": "string", "description": "Request type name"},
          "response_type": {"type": "string", "description": "Response type name"},
          "module": {"type": "string", "description": "Module"},
          "inferred": {"type": "boolean", "description": "Whether inferred endpoint"},
          "deprecated": {"type": "boolean", "description": "Whether deprecated"}
        }
      }
    },
    "types": {
      "type": "array",
      "description": "TypeScript type definition file list",
      "items": {
        "type": "object",
        "properties": {
          "file_path": {"type": "string", "description": "Type file path"},
          "type_count": {"type": "number", "description": "Number of defined types"},
          "endpoints_covered": {"type": "array", "description": "Covered endpoint list"}
        }
      }
    },
    "mock_data": {
      "type": "array",
      "description": "Mock data file list",
      "items": {
        "type": "object",
        "properties": {
          "file_path": {"type": "string", "description": "Mock data file path"},
          "endpoint": {"type": "string", "description": "Corresponding endpoint"},
          "record_count": {"type": "number", "description": "Mock data record count"}
        }
      }
    },
    "auth_config": {
      "type": "object",
      "description": "Authentication configuration",
      "properties": {
        "type": {"type": "string", "enum": ["JWT","OAuth2","Cookie","ApiKey","None"]},
        "token_storage": {"type": "string", "description": "Token storage method"},
        "refresh_enabled": {"type": "boolean", "description": "Whether auto-refresh is enabled"},
        "login_redirect": {"type": "string", "description": "Unauthorized redirect path"}
      }
    },
    "cache_config": {
      "type": "object",
      "description": "Cache strategy configuration",
      "properties": {
        "library": {"type": "string", "description": "Data request library"},
        "strategies": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "data_type": {"type": "string", "description": "Data type (user_info/list_data/detail_data/config_data/realtime_data)"},
              "stale_time": {"type": "string", "description": "Data freshness time"},
              "cache_time": {"type": "string", "description": "Cache retention time"},
              "refetch_strategy": {"type": "string", "description": "Refetch strategy (window_focus/polling/none)"}
            }
          }
        }
      }
    },
    "error_handling": {
      "type": "object",
      "description": "Error handling configuration",
      "properties": {
        "timeout_ms": {"type": "number", "description": "Request timeout (ms)"},
        "retry_count": {"type": "number", "description": "Retry count"},
        "retry_delay_ms": {"type": "number", "description": "Retry delay (ms)"},
        "error_codes_mapped": {"type": "number", "description": "Number of mapped error codes"},
        "error_strategies": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "error_type": {"type": "string", "description": "Error type (network/timeout/401/403/404/422/429/5xx)"},
              "handling": {"type": "string", "description": "Handling method"},
              "user_feedback": {"type": "string", "description": "User feedback text"}
            }
          }
        }
      }
    },
    "project_dir": {"type": "string", "description": "Project root directory path"}
  }
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| Target framework = React | Use React Query + axios |
| Target framework = Vue | Use Vue Query + axios |
| Target framework = Svelte | Use svelte-query + fetch wrapper |
| API endpoints >20 | Split files by domain module |
| Has pagination interfaces | Generate generic pagination Hook |
| Has file upload interfaces | Generate progress callback wrapper |
| Target language != en-US | Mock data uses target language content |
| Auth scheme = JWT | Auto-generate token refresh interceptor |
| Auth scheme missing | Default JWT, mark as "auth scheme pending confirmation" |
| Inferred endpoints >50% | Mark as "high inference ratio, recommend supplementing API contract" |

## Quality Checks

**P0 (Must pass, blocks output if not)**:
- [ ] 100% of API endpoints have corresponding request functions
- [ ] 100% of request parameters and responses have TypeScript types (zero any)
- [ ] Authentication scheme configured (token injection + refresh + expiration handling)
- [ ] Interceptor configuration complete (token injection + error handling + response unwrapping)
- [ ] API code quality audit score >=70 (called by orchestrator via ext-impeccable audit)

**P1 (Recommended, mark as "pending fix" if not)**:
- [ ] Every API call has error handling and timeout configuration
- [ ] Mock data covers all endpoints
- [ ] Cache strategy configured (at least 3 data types)
- [ ] Optimistic updates configured (write operations)
- [ ] Inferred endpoints human-confirmed

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| API contract missing | Infer API requirements from page data flows, inferred endpoints marked inferred:true | API functions are skeletons, need human confirmation to supplement contract details |
| Page data flows missing | Generate independent functions for all API endpoints, no page-level preloading | Missing page-level data preloading and cache configuration |
| Auth scheme missing | Default JWT scheme, mark as "auth scheme pending confirmation" | Token refresh logic may need adjustment |
| Security policy missing | Skip security policy alignment, mark as "pending security policy supplement" | CORS/rate limiting and other frontend security policies not aligned |
| project_dir missing | Output to output/ directory only | Code needs manual copying |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| API contract change (endpoint add/remove/parameter change/response structure change/auth scheme change) | Request functions, type definitions, mock data, auth configuration | Mark affected endpoints and types, recommend regenerating corresponding request functions, mock data, and auth interceptors |
| Page data flow change (data fetching method/cache strategy change) | Data preloading configuration, cache strategy, request deduplication | Mark affected page data flows, recommend updating React Query/Vue Query/svelte-query configuration |
| Target framework change | Request layer technology selection (React Query/Vue Query/svelte-query) | Mark data request layer solution needing replacement, recommend regenerating |
| Auth scheme change | Token injection/refresh/expiration handling logic | Mark auth interceptor needing replacement, recommend regenerating auth infrastructure |

### Downstream Notification Mechanism Table

| This Skill Output Change | Notify Downstream Skill | Notification Content | Trigger Condition |
|---------------|-------------|---------|---------|
| API endpoint add/remove | production-ready | Affected tests and build configuration | endpoints list change |
| Type definition change | production-ready | Affected type-related tests | types structure change |
| Mock data change | production-ready | Affected test mocks | mock_data file change |
| Request layer technology selection change | production-ready | Dependency and build configuration change | Target framework or request library change |
| Auth configuration change | production-ready | Auth-related test and dependency change | auth_config change |
| Cache strategy change | production-ready | Data layer related test change | cache_config change |
| Error handling change | production-ready | Error handling related test change | error_handling change |

## Changelog

- v1.0: Adapted from v2.0 -- Full restructure with 4 steps replacing 3; added auth scheme/error handling strategy/cache strategy; output schema refined; quality checks P0/P1 graded
