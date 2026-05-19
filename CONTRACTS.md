# Source Skill Contracts

This repository keeps the deployable source skills in:

- `pm-skill/`
- `ui-skill/`
- `backend-skill/`
- `cross-domain/`

`codex/skills/` is a generated/synchronization target and is intentionally excluded from source validation in this workflow.

## Runtime Compatibility

Orchestrators use a dual-mode protocol:

1. If the host supports native Skill calls, call child skills by `name`.
2. If the host does not support native Skill calls, execute by the child skill's input contract, output contract, and gate conditions without copying the child skill's full methodology into the orchestrator context.

This keeps Claude and Trae compatible while avoiding repeated token-heavy skill bodies.

## Output Paths

Source skills write to their own domain-native output paths:

- PM: `output/pm-*`
- UI: `output/ui-*`
- Backend: `output/backend-*`
- Cross-domain summaries: `output/cross-domain/` and `output/phase-reports/cross-domain/`

Cross-domain orchestrators should not force child skills to write into `output/cross-domain/{skill-name}/`. They should maintain `output/cross-domain/artifact-index.json` with references to the real artifact paths.

Intentional cross-domain reads are allowlisted in `scripts/validate-skill.js`. This keeps validation noisy enough to catch accidental path drift, but quiet for approved contracts such as UI consuming PM design output or frontend integration consuming backend API contracts.

## Manifest

Run:

```bash
node scripts/build-source-manifest.js
node scripts/validate-source-manifest.js
node scripts/validate-orchestrators.js
node scripts/validate-contracts.js
```

`skills-manifest.json` is the source registry for names, versions, domains, paths, output prefixes, and child-skill references.

Current source counts:

- `pm-skill`: 102
- `ui-skill`: 9
- `backend-skill`: 10
- `cross-domain`: 2
- Total source skills: 123

## Minimal Schemas

Machine-consumable contracts live under `schemas/`. Keep `SKILL.md` files thin; link to schemas or name the expected artifact instead of embedding full validation rules in every skill.
