---
name: production-ready
description: "Use when preparing a frontend project for production launch. Integrated production readiness with build configuration, test generation, and performance optimization ensuring deployable, testable, high-performance frontend projects. Keywords: build deployment, performance optimization, frontend testing, production ready, launch preparation, bundling, optimization."
metadata:
  module: "UI Design & Frontend Development"
  sub-module: "Frontend Integration"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Prepare for launch"
    - "Optimize frontend performance"
    - "Run tests"
    - "Build and deploy"
---

# Production Ready Integration

## Core Principles

1. **Build as Validation** -- Build process simultaneously validates code quality and performance
2. **Built-in Testing** -- Tests generated alongside code, not added afterward
3. **Performance Budget** -- Performance metrics have clear thresholds, exceeding auto-blocks
4. **Progressive Optimization** -- Solve biggest bottlenecks first, then optimize incrementally

## Interaction Mode

AI AI auto-executes

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Frontend Code | code | Yes | {project_dir}/src/ | Page and component code (code in project src directory, metadata in output path) |
| API Integration | JSON | O | output/ui-frontend-integration/api-integration/ | API integration metadata (code in {project_dir}/src/api/) |
| quality_debt | JSON | O | output/ui-frontend/page-builder/quality_debt.json | Quality debt list downgraded during page-builder stage |
| Target Framework | string | Yes | Passed from upstream orchestrator | React/Vue/Svelte |
| Deployment Target | string | O | User provided | Vercel/Netlify/Self-hosted/CDN |
| Target Language | string | O | Passed from upstream orchestrator (default zh-CN) | Target interface language |
| project_dir | string | Yes | Passed from upstream orchestrator | Project root directory absolute path |

## Execution Steps

**quality_debt Consumption Rules**: If quality_debt.json exists, prioritize handling critical-level debt before Step 1 (must fix), major-level debt included in test priority coverage.

### Step 1: Build Configuration and Optimization

Configure build tools and optimization strategies:

| Configuration Item | Content |
|--------|------|
| Build Tool | Vite/Webpack/Next.js built-in |
| Code Splitting | Route-level + component-level lazy loading |
| Asset Optimization | Image compression + font subsetting + SVG optimization |
| Cache Strategy | Content hash + long-term caching + preloading |
| Environment Variables | Dev/staging/production environment configuration |

Build configuration written to {project_dir}/.

### Step 2: Test Generation

**Test Pyramid**: Unit tests (70%) > Integration tests (20%) > E2E tests (10%)

| Test Type | Coverage Content | Tool (React) | Tool (Vue) | Tool (Svelte) | Ratio |
|----------|---------|-------------|-----------|--------------|------|
| Render Tests | Component renders normally, each variant renders | Jest+RTL | Vitest+Vue Test Utils | Vitest+Svelte Testing Library | 30% |
| Interaction Tests | Click/input/submit callbacks | fireEvent/userEvent | fireEvent/userEvent | fireEvent/userEvent | 25% |
| State Tests | State transitions, loading/error | Jest+RTL | Vitest+Vue Test Utils | Vitest+Svelte Testing Library | 15% |
| Boundary Tests | Empty data/long text/extreme values | Jest | Vitest | Vitest | 10% |
| Storybook Stories | One Story per Variant | Storybook | Storybook | Storybook | 20% |

E2E tests: Core user flows 100% covered, using Playwright/Cypress.

Accessibility tests: WCAG 2.1 AA standard, using axe-core/jest-axe.

Visual regression tests (built-in capability): Playwright screenshot comparison + Storybook Chromatic, covering 375/768/1440 three viewports.

Test files written to {project_dir}/tests/.

### Step 3: Performance Optimization

Establish performance baselines:

| Metric | Excellent | Needs Optimization | Poor |
|------|------|--------|-----|
| LCP | <=2.5s | 2.5-4s | >4s |
| FID | <=100ms | 100-300ms | >300ms |
| CLS | <=0.1 | 0.1-0.25 | >0.25 |
| First Screen JS | <=200KB | 200-500KB | >500KB |
| First Screen CSS | <=50KB | 50-100KB | >100KB |

Bundle size optimization: Code splitting + Tree Shaking + on-demand import + image optimization + font subsetting.

Loading speed optimization: Critical CSS inline + resource preloading + image lazy loading.

Rendering performance optimization: Virtual lists + React.memo/useMemo + debounce/throttle.

> ext enhancement results consumed through upstream design_brief.json, this step focuses on core logic

### Step 3b: Security Audit

**Security Checklist**:

| Check Item | Implementation | Block Level |
|--------|---------|---------|
| CSP Configuration | Generate Content-Security-Policy header, restrict script-src/style-src/img-src | P0 |
| XSS Protection | Ensure all user input is escaped, React default escaping + DOMPurify | P0 |
| CSRF Protection | SameSite Cookie + CSRF Token (if using Cookie authentication) | P1 |
| SRI | Add integrity attribute to external CDN resources | P1 |
| Sensitive Info Leakage | Check code for no hardcoded keys/tokens/passwords | P0 |
| Dependency Vulnerabilities | npm audit / pnpm audit, high-severity vulnerabilities must be fixed | P0 |
| HTTPS Enforcement | Force HTTPS in production, HSTS header configuration | P0 |

P0 level failure blocks output.

### Step 4: Performance Budget and CI Configuration

Establish performance budgets and CI blocking:

| Budget Item | Threshold | Block Level |
|--------|------|---------|
| First Screen JS | <=200KB | Exceeding blocks merge |
| First Screen CSS | <=50KB | Exceeding blocks merge |
| LCP | <=2.5s | Exceeding blocks release |
| CLS | <=0.1 | Exceeding warns |
| Single chunk size | <=300KB | Exceeding warns |

CI configuration written to {project_dir}/.

## Output

**Code File Output**: {project_dir}/ (build configuration, test files, CI configuration, performance budgets)

**Metadata Output**: output/ui-frontend-integration/production-ready/

**Output Files**: production-ready.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["build_config", "test_report", "performance_report", "performance_budget", "project_dir"],
  "properties": {
    "build_config": {
      "type": "object",
      "description": "Build configuration information",
      "properties": {
        "bundler": {"type": "string", "description": "Build tool (Vite/Webpack/Next.js)"},
        "code_splitting": {"type": "boolean", "description": "Whether code splitting is enabled"},
        "chunk_count": {"type": "number", "description": "Code splitting chunk count"},
        "env_configs": {"type": "array", "description": "Environment configuration list (dev/staging/prod)"}
      }
    },
    "test_report": {
      "type": "object",
      "description": "Test report",
      "properties": {
        "unit_coverage": {"type": "number", "description": "Unit test coverage (%)"},
        "integration_coverage": {"type": "number", "description": "Integration test coverage (%)"},
        "e2e_pass_rate": {"type": "number", "description": "E2E test pass rate (%)"},
        "a11y_pass": {"type": "boolean", "description": "Whether accessibility tests passed"},
        "total_tests": {"type": "number", "description": "Total test case count"},
        "failed_tests": {"type": "number", "description": "Failed test case count"}
      }
    },
    "performance_report": {
      "type": "object",
      "description": "Performance report",
      "properties": {
        "lcp": {"type": "number", "description": "LCP time (s)"},
        "fid": {"type": "number", "description": "FID time (ms)"},
        "cls": {"type": "number", "description": "CLS score"},
        "first_screen_js_kb": {"type": "number", "description": "First screen JS size (KB)"},
        "first_screen_css_kb": {"type": "number", "description": "First screen CSS size (KB)"},
        "bottlenecks": {"type": "array", "description": "Performance bottleneck list"}
      }
    },
    "performance_budget": {
      "type": "object",
      "description": "Performance budget thresholds",
      "properties": {
        "max_lcp": {"type": "number", "description": "LCP threshold (s)"},
        "max_cls": {"type": "number", "description": "CLS threshold"},
        "max_first_screen_js_kb": {"type": "number", "description": "First screen JS threshold (KB)"},
        "max_first_screen_css_kb": {"type": "number", "description": "First screen CSS threshold (KB)"},
        "ci_blocking": {"type": "boolean", "description": "Whether CI blocks on threshold exceedance"}
      }
    },
    "project_dir": {"type": "string", "description": "Project root directory path"}
  }
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| LCP>4s | P0, must optimize before release |
| First screen JS>500KB | P0, mandatory code splitting |
| CLS>0.25 | P0, layout shift must be fixed |
| Component coverage <80% | Supplement missing test cases |
| Core flow E2E failure | P0, blocks release |
| Accessibility test failure | P0, blocks release |
| Target language != en-US | E2E assertions use target language text, mock data uses target language |

## Quality Checks

P0 (Must pass, blocks output if not):
- [ ] Build succeeds, no TypeScript errors
- [ ] No hardcoded keys/tokens/passwords
- [ ] npm audit has no high-severity vulnerabilities
- [ ] LCP<=2.5s
- [ ] CLS<=0.1
- [ ] Core user flows 100% have E2E tests
- [ ] Accessibility tests cover WCAG 2.1 AA
- [ ] XSS protection configured (React default escaping + DOMPurify)

P1 (Recommended, mark as "pending fix" if not):
- [ ] Component unit test coverage >=80%
- [ ] First screen JS<=200KB
- [ ] Performance budget written to CI configuration
- [ ] CSP configuration generated
- [ ] CSRF protection configured (when using Cookie authentication)
- [ ] SRI configured (external CDN resources)
- [ ] HTTPS enforcement + HSTS header configured

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| API integration missing | Skip API-related tests | Missing API integration tests |
| quality_debt missing | Skip debt handling, proceed directly to build and test | Critical-level debt may be unfixed, production quality risk |
| Deployment target missing | Output generic build configuration | Deployment configuration needs manual adjustment |
| project_dir missing | Output to output/ directory only | Configuration files need manual copying |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Frontend code change (component add/remove/page structure change/route change) | Test cases, build configuration, code splitting strategy | Mark affected test files and build chunks, recommend regenerating corresponding tests and verifying build |
| API integration change (endpoint add/remove/type definition change/request layer selection change) | API-related tests, mock data, dependency configuration | Mark affected API tests and dependencies, recommend updating test mocks and build configuration |
| quality_debt change | Step 1 debt handling plan | Mark new/upgraded critical-level debt, prioritize fixing before executing build and test |
| Target framework change | Build tool, test framework, dependency configuration | Mark build and test solutions needing replacement, recommend regenerating build configuration and tests |
| Deployment target change | CI/CD configuration, environment variables, cache strategy | Mark deployment configuration needing adjustment, recommend regenerating CI configuration |

### Upstream Feedback Mechanism Table

| Issue Found by This Skill | Feedback to Upstream Skill | Feedback Content | Trigger Condition |
|---------------|-------------|---------|---------|
| Component rendering performance issue | page-builder | Component needs optimization (e.g. missing memo/virtual list) | Single component render >16ms or list >100 items without virtualization |
| Build artifact size exceeds limit | page-builder | Component needs splitting or lazy loading | Single chunk >300KB |
| TypeScript type error | page-builder / api-integration | Type definition missing or inconsistent | Build fails due to type errors |
| Accessibility test failure | page-builder | Component missing ARIA attributes or keyboard navigation | axe-core detects WCAG AA violation |

## Changelog

- v1.0: Adapted from v1.3 -- Fixed input path confusion (code path vs metadata path); refined output schema; added security audit step; added security items to quality checks
