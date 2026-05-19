# Contract Schemas

These schemas are intentionally minimal. They validate the top-level machine contract between source skills without forcing each `SKILL.md` to embed large schemas.

Use them as the stable contract layer for Claude and Trae executions:

- PM: `schemas/pm/prd.schema.min.json`, `schemas/pm/opportunity-brief.schema.min.json`, `schemas/pm/roadmap.schema.min.json`, `schemas/pm/okr.schema.min.json`, `schemas/pm/metrics-system.schema.min.json`, `schemas/pm/tracking-plan.schema.min.json`, `schemas/pm/experiment-design.schema.min.json`, `schemas/pm/release-checklist.schema.min.json`, `schemas/pm/acceptance-report.schema.min.json`
- UI: `schemas/ui/project-init.schema.min.json`, `schemas/ui/pages.schema.min.json`
- Backend: `schemas/backend/openapi.schema.min.json`, `schemas/backend/er-model.schema.min.json`, `schemas/backend/impl-report.schema.min.json`, `schemas/backend/review-report.schema.min.json`
- Cross-domain: `schemas/cross-domain/artifact-index.schema.min.json`, `schemas/cross-domain/approval.schema.min.json`

Full, field-level schemas can be added later beside these `*.min.json` files when a workflow needs stricter delivery validation.
