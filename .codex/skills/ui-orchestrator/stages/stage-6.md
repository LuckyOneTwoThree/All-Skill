# Stage 6: Production Readiness + Optimization (On-Demand)

Skip condition: No build/deployment required

**Dependencies**: depends_on: [stage-4]; optional_depends_on: [stage-5]. stage-5 (API Integration) is an optional stage that can be skipped when there is no backend API. When stage-5 is not executed, stage-6 directly consumes stage-4's enhanced code; after stage-5 executes, stage-6 consumes its API integration output.

**Stage Merge Note**: v7.0 merges the original Stage 7 (Production Readiness) and Stage 8 (Production Optimization) into a single stage. After production-ready executes, it directly invokes ext-impeccable for harden+polish+optimize.

| Input | Source |
|--------|------|
| Frontend code | {project_dir}/src/ + output/ui-frontend/page-builder/ |
| API integration | output/ui-frontend-integration/api-integration/ (optional, only exists after stage-5 execution) |
| quality_debt | output/ui-frontend/page-builder/quality_debt.json (optional) |
| Target framework / Deployment target / Target language / project_dir | Determined during project information collection phase / Provided by user |

**Execution Order**:

| # | Skill | Input | Output | Validation | Notes |
|---|-------|------|------|------|------|
| 6.1 | production-ready | Frontend code + quality_debt | Build + Tests + Performance + Security | Build successful + Test coverage >=80% + LCP<=2.5s + Security check passed + harden + polish completed | high-level items in quality_debt must be fixed |
| 6.2 | ext-impeccable {harden\|polish} | Code + build configuration (6.1) | Production readiness enhancement | harden + polish generated | Forms/async/i18n -> harden, always -> polish |
| 6.3 | ext-impeccable optimize | Performance report (6.1) | UI rendering performance optimization | Optimization suggestions generated | Skip when performance bottleneck is network latency or bundle size |

[GATE] Human confirmation required for release decision
