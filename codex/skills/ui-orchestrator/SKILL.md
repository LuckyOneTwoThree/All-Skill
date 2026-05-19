---
name: ui-orchestrator
description: "Use when UI design and frontend development are needed. Orchestrates core and ext skills from project initialization to production readiness with multiple execution modes (express/prototype/full/progressive). Keywords: UI design, frontend development, interface development, design system, frontend code."
metadata:
  module: "UI Design & Frontend Development"
  sub-module: "UI Orchestrator"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Build UI"
    - "Write frontend code"
    - "Create interface"
    - "Build pages"
    - "Build design system and frontend code together"
    - "Full flow from design to frontend"
---

# UI Design & Frontend Development Orchestrator

## Core Principles

Execute on demand -- only run the steps the project needs, skip unnecessary stages. Core stages and ext enhancement stages alternate; ext Skill invocations are orchestrated centrally rather than embedded within Pipeline Skills.

## Execution Modes

The orchestrator supports four execution modes, selected via the `mode` parameter:

| Mode | Description | Use Case |
|------|------|---------|
| `express` | Select one ext Skill to directly read PRD and generate page code, minimal quality checks | Single page/landing page/rapid prototype/proof of concept |
| `prototype` | Generate prototype only, no frontend code | Requirements validation, multi-scheme comparison, interaction logic alignment |
| `full` | Complete frontend code output, skip exploration | Requirements confirmed, design direction clear, proceed directly to implementation |
| `progressive` | Progressive -- explore and validate first, automatically enter full delivery after confirmation | Most scenarios, especially when requirements are not fully validated |

**Mode Selection Guide**:
- Single page/quick results -> use `express`
- Just want a quick prototype -> use `prototype`
- Requirements and design confirmed -> use `full`
- Not sure which to choose -> use `progressive` (default)

### express Mode Pipeline

```
stage-e: Generate anchor -> Design direction quick select (2-3 options) -> Structured prompt -> ext Skill generation -> Enhanced quality check -> Output
```

**Design Engine Selection**: express mode selects the design engine (1 of 4) via the `express_engine` parameter; different engines have different design styles and capability focuses:

| Design Engine | ext Skill | Style Focus | Use Case | Recommended External Tools (Optional) |
|----------|-----------|---------|---------|-------------------|
| `visual` (default) | ext-frontend-design | Visual differentiation, avoid AI homogenization, bold creativity | Brand sites/landing pages/creative showcases | v0.dev / Bolt / Lovable |
| `ux` | ext-ui-ux-pro-max | UX best practices, data-driven recommendations, industry standards | SaaS/admin dashboards/e-commerce | v0.dev / Cursor |
| `polish` | ext-impeccable | Quality polish, detail optimization, production-grade quality | Pages requiring high completion level | Google Stitch / Cursor |
| `motion` | ext-interaction-design | Interactive motion, micro-interactions, dynamic experience | Interaction-intensive apps/gamified interfaces | Framer / Rive |

**Selection Guide**:
- Want beautiful and unique -> `visual` (default)
- Want usable and standardized -> `ux`
- Want refined and complete -> `polish`
- Want dynamic and fun -> `motion`

**Prompt Source Mode** (selected via the `express_prompt_source` parameter):

| Mode | Description | Use Case |
|------|------|---------|
| `auto` (default) | Orchestrator generates 2-3 design directions for user quick selection, generates structured prompt based on selected direction, passes to chosen ext Skill | Quick results, want design direction selection |
| `manual` | User goes to recommended external tool website, gets/writes prompt, fills in `express_prompt` parameter | Want finer control over design results |

**manual Mode Usage Flow**:
1. User selects `express_engine` (e.g., `visual`)
2. User selects `express_prompt_source=manual`
3. Orchestrator prompts user to visit recommended external tool website (e.g., v0.dev)
4. User enters requirements in external tool, gets/writes prompt
5. User fills prompt content into `express_prompt` parameter
6. Orchestrator passes `express_prompt` directly to chosen ext Skill, skipping auto prompt generation

**express Mode Trade-offs**:
- [OK] Gain: Extremely fast speed, minimal process, directly runnable code
- [X] Forgo: Design system consistency, token-driven architecture, component library integration, quality debt tracking, PM<->UI feedback loop

**express Mode Minimal Quality Checks** (5 items, upgraded in v7.2):
1. WCAG AA contrast ratio compliant
2. No hardcoded keys/tokens
3. Page runnable (npm run dev starts successfully)
4. visual_bans compliant (no AI homogenization patterns)
5. Design anchor consistency (color/typography direction validation)

**Lightweight Design Anchor** (added in v7.2):
Although express mode skips full design system establishment, it generates a lightweight design anchor (express_design_anchor) before ext Skill invocation, containing register, color_direction, typography_direction, layout_direction, visual_bans, ensuring ext Skill output has design direction constraints rather than being completely random. The anchor automatically adjusts focus based on express_engine (visual->no blue-purple no card-grid, ux->functional layout+generous whitespace, polish->complete anti-patterns, motion->animation-friendly layout).

**Design Direction Quick Select** (added in v7.3):
In auto mode, after anchor generation the orchestrator generates 2-3 differentiated design direction descriptions (each about 100-200 words, including color temperature/layout/typography/tension differences), and the user quickly selects one to write back to the anchor. Users can also skip quick select and use the default direction (`express_skip_scheme=true`). This corresponds to the "design exploration -> human selection" in full mode, but the express version is lighter (direction descriptions rather than complete visual directions).

**Structured Prompt** (added in v7.3):
The original auto mode prompt was simple concatenation (PRD + brand specs + anchor); v7.3 upgrades to structured prompt -- based on user-selected design direction + PRD + anchor, generates precise prompt including specific color values/font names/layout patterns/ban lists/functional requirements, replacing vague descriptions. In manual mode, anchor design constraints are automatically appended to the user's prompt.

**express Mode Output**:
- Page code written directly to {project_dir}/src/
- No output/ metadata (no design_brief, no quality_debt, no design_feedback)
- No downstream Skill connections (if API integration or production readiness is needed, switch to full mode and re-execute)

> [DOC] For detailed execution plan, see [stages/stage-e.md](stages/stage-e.md)

### prototype Mode Pipeline

```
stage-1 -> stage-p
project-init -> prototype-output
  Core           Prototype output
```

Only executes design system establishment and PM constraint review, outputs visual direction + constraint review results, does not generate page code.

**prototype Mode Trade-offs**:
- [OK] Gain: Rapid design direction validation, low-cost multi-scheme comparison, interaction logic alignment
- [X] Forgo: Page code, ext enhancement, quality audit, API integration, production readiness

**prototype Mode Output**:
- Prototype report (prototype-report.md): Visual direction summary + key page layout descriptions + component selection summary
- Design system output (project-init.json): Visual direction + design tokens + component library
- No page code, no design_brief, no quality_debt

**Connection to full Mode**: After prototype completes and visual direction is confirmed, switching to full mode starts from stage-2 (skipping stage-1, reusing existing project-init output).

> [DOC] For detailed execution plan, see [stages/stage-p.md](stages/stage-p.md)

### full Mode Pipeline

```
stage-1 -> stage-2 -> stage-3 -> stage-4 -> [stage-5] -> [stage-6]
```

Skips exploration phase, starts directly from design system establishment for full delivery. PM constraint review is built in as a conditional branch of stage-1.

### progressive Mode Pipeline (default)

```
stage-1 -> stage-2 -> stage-3 -> stage-4 -> [stage-5] -> [stage-6]
Design system  Enhancement  Page build  Enhancement+Audit  On-demand  On-demand
```

First freely explore design schemes (built into stage-1 conditional branch), automatically enter full delivery process after human confirmation.

## Execution Flow (full Mode / progressive Mode)

```
stage-1        stage-2          stage-3        stage-4              stage-5      stage-6
project-init -> ext-enhance -> page-builder -> ext-enhance+audit -> [api-int] -> [prod-ready]
  Core          Enhancement     Core          Enhancement+Audit    On-demand    On-demand
```

| Stage | Name | Skill | Required/On-demand | Skip Condition | Detailed Plan |
|------|------|-------|---------|---------|---------|
| stage-1 | Design System Establishment | project-init | Required | -- | [stages/stage-1.md](stages/stage-1.md) |
| stage-2 | Design Enhancement+Brief Generation | ext-ui-ux-pro-max, ext-impeccable, ext-frontend-design | Required | -- | [stages/stage-2.md](stages/stage-2.md) |
| stage-3 | Page & Component Construction | page-builder | Required | -- | [stages/stage-3.md](stages/stage-3.md) |
| stage-4 | Page Enhancement+Quality Audit | ext-ui-ux-pro-max, ext-impeccable, ext-interaction-design | Required | -- | [stages/stage-4.md](stages/stage-4.md) |
| stage-5 | API Integration | api-integration | On-demand | No backend / static data | [stages/stage-5.md](stages/stage-5.md) |
| stage-6 | Production Readiness+Optimization | production-ready, ext-impeccable | On-demand | No build/deploy needed | [stages/stage-6.md](stages/stage-6.md) |

**Stage Merge Notes** (v7.0 simplification compared to v6.0):
- Stage 0/0.5 (design exploration/constraint alignment) -> Merged into stage-1 conditional branch (executed when mode=progressive)
- Stage 1.5 (PM constraint review) -> Merged into stage-1 conditional branch (executed when PM input exists)
- Stage 4 ext-frontend-design invocation -> Removed (already called in stage-2, output consumed via design_brief.json)
- Stage 5 (quality audit) -> Merged into stage-4 (enhancement+audit integration)
- Stage 7+8 (production readiness+production optimization) -> Merged into stage-6

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

### Checkpoint Resume Execution

After each sub-skill execution completes, the orchestrator writes execution state to a checkpoint file, supporting resumption from the breakpoint after interruption.

**Checkpoint File**: `output/checkpoints/ui-orchestrator.json`

**Checkpoint Schema**: See [schemas/checkpoint.json](schemas/checkpoint.json)

**Resume Rules**:
1. On orchestrator startup, check if `output/checkpoints/ui-orchestrator.json` exists
2. If it exists and has `pending_stages`, resume from the first pending stage, skipping completed stages
3. Update checkpoint file immediately after each stage completes (write file before advancing, ensuring no data loss on power failure)
4. On stage failure, keep the stage in `pending_stages`, checkpoint records failure reason
5. After ext stage completes, write invocation result summary to the corresponding `ext_enhancement_applied` field
6. After all stages complete, checkpoint file is retained as execution record

**Manual Recovery**: Users can delete the checkpoint file for a full re-execution, or manually modify `pending_stages` to specify resuming from a particular stage.

## Pipeline

```yaml
pipeline: ui-orchestrator
version: 7.3

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/ui/ui-orchestrator.md

stages:
  - id: stage-e
    name: "Quick Generation"
    depends_on: []
    skills: [ext-frontend-design, ext-ui-ux-pro-max, ext-impeccable, ext-interaction-design]
    trigger: mode=express
    engine_param: express_engine
    engine_mapping:
      visual: ext-frontend-design
      ux: ext-ui-ux-pro-max
      polish: ext-impeccable
      motion: ext-interaction-design
    gate:
      condition: "Page code generated + WCAG AA contrast compliant + No hardcoded keys + npm run dev starts successfully + visual_bans compliant + Design anchor consistency"
      fail_action: "Fix critical issues and re-verify"
    detail: stages/stage-e.md

  - id: stage-p
    name: "Prototype Output"
    depends_on: [stage-1]
    skills: []
    trigger: mode=prototype
    gate:
      condition: "prototype-report.md generated + visual_direction 10 dimensions defined"
      fail_action: "Supplement prototype report"
    detail: stages/stage-p.md

  - id: stage-1
    name: "Design System Establishment"
    depends_on: []
    skills: [project-init]
    gate:
      condition: "visual_direction 10 dimensions defined + inter-dimension consistency check passed + PRODUCT.md/DESIGN.md non-placeholder + token files written + WCAG AA compliant + npm run dev starts successfully"
      fail_action: "Fix non-compliant items and re-verify"
    conditional_branches:
      - trigger: mode=progressive
        name: "Design Exploration"
        steps:
          - "Extract core user tasks from prd.md, derive 2-3 visual direction candidates"
          - "Output design_explorations.json"
          - "[GATE] Human selects exploration scheme"
          - "Align selected scheme with PM constraints, generate design_decisions.json"
          - "[GATE] Human confirms constraint alignment result"
      - trigger: PM input exists (prd.json or ia_proposals or component_catalog exists)
        name: "PM Constraint Review"
        steps:
          - "5-dimension review of PM constraint rationality (page division/functional area/component selection/navigation structure/interaction complexity)"
          - "Output constraint_review.json"
          - "[GATE] Human confirms critical-level findings"
    detail: stages/stage-1.md

  - id: stage-2
    name: "Design Enhancement+Brief Generation"
    depends_on: [stage-1]
    skills: [ext-ui-ux-pro-max, ext-impeccable, ext-frontend-design]
    gate:
      condition: "visual_direction includes differentiation specs + design_brief.json generated + enhancement results written back to project-init.json"
      fail_action: "Core enhancement (ext-frontend-design/ext-ui-ux-pro-max) failed -> block stage-3, prompt to install or switch to express mode; Enhancement (colorize/typeset) failed -> mark as non-blocking"
    detail: stages/stage-2.md

  - id: stage-3
    name: "Page & Component Construction"
    depends_on: [stage-2]
    skills: [page-builder]
    gate:
      condition: "P0 issues=0 + Token reference rate 100% + WCAG AA compliant + Responsive 375/768/1024px + Mandatory visual review completed"
      fail_action: "Fix P0 issues and re-verify"
    detail: stages/stage-3.md

  - id: stage-4
    name: "Page Enhancement+Quality Audit"
    depends_on: [stage-3]
    skills: [ext-ui-ux-pro-max, ext-impeccable, ext-interaction-design]
    gate:
      condition: "quality_score>=75 (audit percentage x 0.5 + critique percentage x 0.5); When ext-impeccable is not deployed, degrades to built-in self-assessment score>=60"
      fail_action: "Fix and re-audit+critique, max 3 closed-loop iterations; When ext-impeccable is not deployed, use built-in self-assessment, threshold lowered to 60; When single item audit<60 or critique<55, [GATE] human confirmation required"
    detail: stages/stage-4.md

  - id: stage-5
    name: "API Integration"
    depends_on: [stage-4]
    trigger: Backend API needs integration
    skills: [api-integration]
    gate:
      condition: "100% endpoint coverage + Type safety + Mock data covers all endpoints + Authentication configuration complete"
      fail_action: "Supplement missing endpoints"
    detail: stages/stage-5.md

  - id: stage-6
    name: "Production Readiness+Optimization"
    depends_on: [stage-4]
    optional_depends_on: [stage-5]
    trigger: Production deployment needed
    skills: [production-ready, ext-impeccable]
    gate:
      condition: "Build successful + Test coverage>=80% + LCP<=2.5s + Security check passed + harden+polish completed"
      fail_action: "Fix blocking issues and re-verify"
    detail: stages/stage-6.md
```

## Stage Execution Plan

### Project Information Collection

| Input Item | Source | Required |
|--------|------|------|
| mode | User provided (default: progressive) | No |
| express_engine | User provided (default: visual, only effective when mode=express) | No |
| express_prompt_source | User provided (default: auto, only effective when mode=express) | No |
| express_prompt | User provided (required only when express_prompt_source=manual) | No |
| express_skip_scheme | User provided (default: false, only effective when mode=express and express_prompt_source=auto, skips design direction quick select) | No |
| Brand specifications | User provided / output/pm-strategy/positioning-strategy/positioning-strategy.json | Yes |
| Product positioning | output/pm-strategy/positioning-strategy/positioning-strategy.json | No |
| Target platform | User provided | Yes |
| Target language | User provided (default: zh-CN) | Yes |
| project_name | User provided | Yes |
| project_dir | User provided | Yes |
| framework | User provided (React/Vue/Svelte/Next.js/Nuxt.js) | Yes |
| Component library preference | User provided | No |
| Backend integration requirement | User provided (yes/no) | Yes |
| Deployment requirement | User provided (yes/no) | Yes |

Output: Project information summary + Stage execution plan (determine which stages to execute/skip based on mode)
[GATE] Human confirms project information, execution mode, and execution plan

### Detailed Stage Plans

| Stage | Detailed Plan File | Core Input | Core Output |
|------|------------|---------|---------|
| Stage-E | [stages/stage-e.md](stages/stage-e.md) | PRD+brand specs+express_engine | Runnable project |
| Stage-P | [stages/stage-p.md](stages/stage-p.md) | visual_direction+tokens | prototype-report.md |
| Stage 1 | [stages/stage-1.md](stages/stage-1.md) | Brand specs+PRD | project-init.json+PRODUCT.md+DESIGN.md |
| Stage 2 | [stages/stage-2.md](stages/stage-2.md) | visual_direction+tokens | design_brief.json+page_manifest.json+written-back project-init.json |
| Stage 3 | [stages/stage-3.md](stages/stage-3.md) | design_brief+page_manifest | pages.json+page code+design_feedback.json+quality_debt.json |
| Stage 4 | [stages/stage-4.md](stages/stage-4.md) | Page code+design_brief.json+visual_review_result | Enhanced code+quality_score+quality_debt.json updated |
| Stage 5 | [stages/stage-5.md](stages/stage-5.md) | API contract+pages.json | api-integration.json+request layer code |
| Stage 6 | [stages/stage-6.md](stages/stage-6.md) | Frontend code+quality_debt | Build artifacts+tests+optimization |

### Schema Definitions

| Schema | File | Purpose |
|--------|------|------|
| checkpoint | [schemas/checkpoint.json](schemas/checkpoint.json) | Checkpoint for resume execution |
| constraint-review | [schemas/constraint-review.json](schemas/constraint-review.json) | PM constraint review result (Stage 1 conditional branch B) |
| design-brief | [schemas/design-brief.json](schemas/design-brief.json) | Executable design specification (Stage 2 -> Stage 3) |
| page-manifest | [schemas/page-manifest.json](schemas/page-manifest.json) | Page manifest (prevent page omissions) |
| prototype-report | [schemas/prototype-report.json](schemas/prototype-report.json) | Prototype report (prototype mode output) |
| quality-debt | [schemas/quality-debt.json](schemas/quality-debt.json) | Quality debt tracking |

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/ui-frontend/ |
| Summary output path | output/phase-reports/ui/ui-orchestrator.md |
| ext enhancement record | Summary of ext Skill invocation results in this execution round |

Downstream connections:
  primary: release-orchestrator (After UI development is complete, enter quality acceptance and release process)
  alternatives:
    - target: api-integration
      reason: Backend API is ready, need frontend-backend integration
      condition: When backend API exists but has not been integrated
    - target: monitoring-orchestrator
      reason: Establish frontend performance and user experience monitoring after UI goes live
      condition: When frontend is deployed and needs continuous monitoring

## Stage Gates

Follows the general stage gate standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Gate | Condition | Action if Not Passed |
|------|------|------------|
| Stage summary generated | output/phase-reports/ui/ui-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |
| stage-e/1 complete | Project initialization+constraint review output complete | Fix and retry |
| stage-2 complete | design_brief.json + write-back verification passed | Handle write-back verification failure as exception |
| stage-3 complete | pages.json generated + visual review completed | P0 issues must be fixed |
| stage-4 complete | quality_debt.json updated + quality_score>=75 | Fix and re-audit |
| stage-6 complete | production_ready.json generated | Fix and retry |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Execution mode confirmation | When project information collection completes | Confirm execution mode (express/prototype/full/progressive) |
| Design direction quick select | stage-e, express_prompt_source=auto and express_skip_scheme=false | Select 1 from 2-3 design directions or merge multiple |
| Page manifest completeness confirmation | stage-3, no PM input | Confirm whether page manifest fully covers all required pages |
| Exploration scheme selection | After stage-1 conditional branch A, mode=progressive | Select exploration scheme or merge multiple schemes |
| Constraint alignment confirmation | After stage-1 conditional branch A continuation, mode=progressive | Confirm constraint alignment results and design decisions |
| Visual direction confirmation | After stage-1, before stage-2 | Confirm core visual direction and brand colors |
| PM constraint review confirmation | After stage-1 conditional branch B, when critical-level findings exist | Confirm critical findings in constraint review |
| Design system enhancement confirmation | After stage-2, before stage-3 | Confirm ext enhancement results; when write-back verification V5 finds visual_direction semantic contradiction, confirm handling approach |
| Page scheme confirmation | After stage-3, before stage-4 | Confirm page layout and components |
| Visual review confirmation | After stage-3, before stage-4, when mandatory visual review is completed | Confirm visual review results, decide whether to roll back to stage-2 for low-score dimensions |
| PM feedback confirmation | After stage-3, when design_feedback.json exists | Confirm whether to accept UI->PM feedback suggestions |
| Quality audit confirmation | After stage-4, when quality_score<75 or unbalanced scores | Confirm whether to approve |
| Release decision | After stage-6 | Confirm whether to release |

## Exception Handling

**Quality Debt Tracking**: All degraded, "pending fix", and "pending confirmation" issues are uniformly written to `output/ui-frontend/page-builder/quality_debt.json`, ensuring degraded issues are not forgotten.

**quality_debt.json Schema**: See [schemas/quality-debt.json](schemas/quality-debt.json)

**Debt Management Rules**:
- Each degraded/marked item generates a debt_item
- Before stage-6 (production readiness+optimization) execution, aggregate and check quality_debt.json
- critical severity open debt -> [STOP] Block execution, must fix before continuing
- high severity open debt -> [GATE] Human confirms whether to continue
- medium severity open debt -> Marked in stage summary
- low severity open debt -> Recorded but not blocking

| Exception Type | Handling Strategy | Debt Record |
|----------|----------|----------|
| Project information insufficient | Prompt user to supplement, cannot continue if required items are missing | -- |
| stage-e failure | Fix critical issues and retry, suggest switching to full mode after 3 attempts | -- |
| stage-e manual mode user cannot get prompt | Provide two options: 1) Switch to auto mode (with design direction quick select) 2) Switch to full mode | -- |
| stage-1 failure | Fix and retry, cannot skip | -- |
| stage-1 visual_direction consistency check contradiction | Blocking level ([X]): Must fix and retry; Warning level ([!]): Mark + [GATE] human confirmation | Warning level -> medium |
| stage-2 core enhancement failure | ext-frontend-design/ext-ui-ux-pro-max failed -> block stage-3; colorize/typeset failed -> mark as non-blocking | colorize/typeset failed -> medium |
| stage-2 write-back verification failure | V1(JSON parse) -> Roll back to original tokens; V2(WCAG) -> Adjust color values; V3(tokens out of sync) -> Regenerate css based on json; V4(hardcoded) -> Remove and replace; V5(semantic contradiction) -> [GATE] human confirmation | V1-V4 auto-fix -> low |
| stage-3 P0 issues | Must fix, cannot skip | -- |
| stage-3 visual review average score<=2.5 | [GATE] Human decides: Roll back to stage-2 to regenerate design_brief, or continue to stage-4 for enhancement fix | Continue to stage-4 -> high |
| stage-4 quality_score<75 | Fix and re-audit+critique, max 3 closed-loop iterations, [GATE] human confirmation after 3 attempts | Still not meeting standard after 3 attempts -> high |
| stage-4 single item unbalanced (audit<60 or critique<55) | Mark as "unbalanced risk", [GATE] human confirmation | medium |
| stage-4 ext-impeccable not deployed | Use built-in self-assessment score, gate threshold lowered to 60 | medium |
| stage-5 api-integration failure | Mark as "pending retry", does not block stage-6 | medium |
| stage-6 build failure | Fix and retry | -- |
| stage-6 ext invocation failure | Mark as pending optimization, does not block | low |
| Stage summary generation failed | Generate partial summary from completed outputs | |
