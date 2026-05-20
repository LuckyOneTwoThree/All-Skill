English | **[中文](README.md)**

# All-Skill: Product × Design × Engineering AI Agent Skills Collection

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Skill Count](https://img.shields.io/badge/Skills-123-orange.svg)](#four-domains-overview)

> 🌟 **Recommended**: Visit [All-Skill Galaxy](https://luckyonetwothree.github.io/all-skill-html/) for an interactive visualization — a force-directed graph showing 123 source Skill orchestration relationships, 12 cross-domain data contract flows, and a panoramic view of all four domain modules!

> ## ⚠ Declaration: AI is a Lever, Not a Replacement
>
> This Skill system structures product methodology into executable Pipelines, making AI a **faithful executor** of methodology — but it can never replace human **judgment**.
>
> **What AI excels at**: Large-scale data processing, structured analysis, pattern recognition, solution enumeration, consistency checks. These are the lever's arm, amplifying human efficiency.
>
> **What humans must control**: The balance point of strategic trade-offs, priority judgment of user pain points, truth/falsity verdicts on business hypotheses, aesthetic judgment of experience details, final call on risk boundaries. These are the lever's fulcrum, determining the direction of force.
>
> The stage gates and human decision points in each orchestrator are not process overhead — they are the **dividing line of human-AI collaboration**. Skip them, and AI will efficiently march in the wrong direction. Continuous review is not distrust of AI, but respect for the essence of the product — **products are created for people, and ultimately must be accountable to people**.
>
> Remember: Methodology doesn't automatically produce correct results just because AI executes it. **Great products are always human judgment × AI execution.**

## What Is This

Extracting the full lifecycle methodology of software products from 0 to 1 into **123 AI Agent Skills**, covering four domains: **Product Methodology, UI Design & Frontend Development, Backend Architecture & Development, and Cross-Domain Coordination**, compatible with the Trae / Claude Code Agent Skills open standard. Source directory counts are based on `skills-manifest.json`; `codex/skills` serves as the subsequent sync target.

Each Skill is an independently executable methodology Pipeline. Orchestrators manage the execution order and stage gates of sub-Skills. The four domains are tightly connected through **data contracts**, forming a complete closed loop from product exploration to launch operations.

## Quick Start

### Deployment Method

The nested directory structure is for **human browsing and management only**. Trae scans and identifies Skills by **individual SKILL.md** files recursively, where the `name` field must match the immediate parent directory name.

In practice, all minimal Skill units need to be **flattened** into `.trae/skills/`:

```
# Structure when deployed to Trae (flattened, for machine recognition)
.trae/skills/
├── insight-orchestrator/SKILL.md
├── insight-analysis/SKILL.md
├── api-design-spec/SKILL.md
├── project-init/SKILL.md
├── ... (123 Skills flattened)
└── production-ready/SKILL.md
```

### Deployment Steps

1. **Full deployment**: Copy all `{skill-name}/` folders into `.trae/skills/`, flattened
2. **Selective deployment**: Only copy the Skill folders needed for the current project phase

> ⚠️ When deploying, only copy the innermost `{skill-name}/` folder (containing SKILL.md). No need to preserve the outer directory structure.

### Invocation Methods

Once deployed, invoke Skills in Trae conversations through the following methods:

**1. Natural Language Trigger**

Describe your needs directly — AI automatically matches based on the Skill's `description` field:

```
Help me analyze the competitive landscape
→ Auto-matches market-competitor-analysis or market-orchestrator

I need to write a PRD
→ Auto-matches design-prd

Design the API interfaces
→ Auto-matches api-design-orchestrator
```

**2. Command Invocation**

Directly use the Skill's `name` field for precise invocation:

```
/insight-orchestrator
/market-competitor-analysis
/design-prd
/api-design-spec
```

**3. Orchestrator Scheduling**

After invoking an orchestrator, it automatically schedules sub-Skills by stage. You can also guide it step by step in the conversation:

```
Please execute the insight analysis following the insight-orchestrator workflow
→ Orchestrator sequentially schedules insight-analysis
→ Each stage gate waits for human confirmation before proceeding
```

> 💡 **Tip**: Orchestrators pause at each stage gate, waiting for human approval before entering the next stage. This is a key design for human-AI collaboration — do not skip it.

## Four Domains Overview

| Domain | Modules | Orchestrators | Pipeline Skills | Extensions | Guide | Core Positioning |
|--------|---------|---------------|-----------------|------------|-------|------------------|
| **pm-skill** Product Methodology | 8 | 27 | 74 | — | 1 | Do the right things: from discovery to growth operations |
| **ui-skill** UI Design & Frontend | 3 | 1 | 4 | 4 | — | Do things right visually: design = implementation, token-driven |
| **backend-skill** Backend Architecture | 3 | 4 | 6 | — | — | Build things right: design fully first, review before implementation |
| **cross-domain** Cross-Domain Coordination | — | 2 | — | — | — | Global orchestration: product iteration & launch |

## Global Flow & Data Flow

The four domains are not isolated toolsets — they form a tightly connected product building closed loop through **data contracts**:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    PM Product Methodology (Do the Right Things)         │
│                                                                         │
│  Discovery → Strategy → Design → Metrics Design → Metrics Ops → Growth → Monitoring → Project Mgmt │
│      │         │         │         │                                    │
│      │  Positioning    PRD     Metrics System                           │
│      │  Brand Guide  IA/Prototype  Tracking Plan                        │
│      │         │         │         │                                    │
└──────┼─────────┼─────────┼─────────┼────────────────────────────────────┘
       │         │         │         │
       ▼         ▼         ▼         ▼
┌──────────────────────────────┐  ┌──────────────────────────────────────┐
│  UI Design & Frontend        │  │  Backend Architecture & Dev          │
│  (Do Things Right Visually)  │  │  (Design Fully First, Then Implement)│
│                              │  │                                      │
│  Project Init → Page Build → │  │  ┌─Design─ Arch→Data→API ──┐       │
│  API Integration → Prod Ready│  │  │    Unified Design Review  │       │
│                              │  │  └─Implement─ Data→API→Arch ─┘      │
│  project-init                │  │                                      │
│  page-builder                │  │  backend-orchestrator (top-level)    │
│  api-integration             │  │  api-design (security+auth+compliance)│
│  production-ready            │  │  data-architecture (cache+migration) │
│                              │  │  backend-architecture (review+ADR)   │
│                              │  │                                      │
│                              │  │  Dual output: code→{project_dir}/src/│
│                              │  │              metadata→output/        │
└──────────────────────────────┘  └──────────────────────────────────────┘
```

### Key Data Contracts

The three domains are connected through the following core deliverables, ensuring continuity from product definition to technical implementation:

| Data Contract | Producer | Consumer | Purpose |
|---------------|----------|----------|---------|
| **PRD** | pm design-prd | ui page-builder / backend api-design | Product requirements as shared input for UI and backend design |
| **Positioning Statement** | pm positioning-strategy | ui project-init | Product positioning determines brand DNA and visual style |
| **Brand Guidelines** | pm positioning + user input | ui project-init | Brand colors/fonts derive design tokens |
| **IA/Route Structure** | pm design-ia | ui page-builder | Information architecture determines page routing and navigation |
| **User Flow** | pm design-userflow | ui page-builder | User flows define interaction state machines |
| **Prototype** | pm design-prototype | ui page-builder | Prototypes guide component generation and page assembly |
| **Design Tokens** | ui project-init | ui api-integration / pm design-prototype | Tokens drive error styles and consistency checks |
| **Design Brief** | ui page-builder | ui-orchestrator stage-2 | Pre-generated page-level design decisions for orchestrator scheduling |
| **Page Inventory** | ui-orchestrator stage-2 | ui page-builder | Pre-generated page structure list guiding component generation |
| **Target Language** | User-specified (default zh-CN) | ui ui-orchestrator | Passed through entire pipeline, affects fonts/typesetting/copy/i18n |
| **OpenAPI Contract** | backend api-design | ui api-integration | API contract is the bridge for frontend-backend integration |
| **Architecture Plan + Topology** | backend backend-architecture-spec | backend data-architecture-spec / api-design-spec | Architecture decisions constrain data models and API design |
| **Service Data Ownership** | backend backend-architecture-spec | backend data-architecture-spec | Defines data entities owned by each service, drives data modeling |
| **Tech Stack Decision** | backend backend-architecture-spec | backend 3 impl Skills | Unifies tech stack across all implementation Skills |
| **Data Model** | backend data-architecture-spec | backend api-design-spec | Data model is the foundation for API design (v5.0 required input) |
| **Metrics System** | pm metrics-system | pm analysis / monitoring | Metrics system drives data analysis and monitoring |
| **Tracking Plan** | pm tracking-plan | ui page-builder | Tracking plan guides frontend data collection |
| **Backend Review Report** | backend backend-architecture | pm quality-acceptance | Backend review results as acceptance reference |
| **API Coverage Report** | backend api-design | pm quality-acceptance | PRD/frontend alignment coverage report |

## Directory Structure

```
All-Skill/
├── .github/                          ← Project infrastructure (not Skills)
│   ├── ISSUE_TEMPLATE/                   Issue templates
│   ├── workflows/                        PR auto-validation
│   └── config.yml                        Issue configuration
├── scripts/                          ← Project infrastructure (not Skills)
│   ├── validate-skill.js                 SKILL.md validation script
│   └── build-skill-index.js              Index generation script
├── templates/                        ← Project infrastructure (not Skills)
│   ├── orchestrator-protocol.md          Orchestrator protocol template
│   └── pipeline-skill-template.md        Pipeline Skill authoring template
├── CONTRIBUTING.md                   ← Project infrastructure (not Skills)
├── LICENSE                           ← Project infrastructure (not Skills)
├── ROADMAP.md                        ← Project infrastructure (not Skills)
│
├── pm-skill/                         ✅ Skill files — Product Methodology
│   ├── pm-00-guide/                       Navigation entry
│   ├── pm-01-discovery/                   Module 1: Product Discovery
│   │   ├── orchestrators/                     insight / market / opportunity / user-research
│   │   └── skills/                            10 Pipeline Skills
│   ├── pm-02-strategy/                    Module 2: Business & Strategy
│   │   ├── orchestrators/                     business / planning / positioning / stakeholder
│   │   └── skills/                            11 Pipeline Skills
│   ├── pm-03-design/                      Module 3: Ideation & Design
│   │   ├── orchestrators/                     design / ideation / validation
│   │   └── skills/                            12 Pipeline Skills
│   ├── pm-04-metrics-design/              Module 4: Metrics Design
│   │   ├── orchestrators/                     metrics
│   │   └── skills/                            3 Pipeline Skills
│   ├── pm-05-metrics-ops/                 Module 5: Metrics Operations
│   │   ├── orchestrators/                     analysis / decision / experiment
│   │   └── skills/                            8 Pipeline Skills
│   ├── pm-06-growth/                      Module 6: Growth & Operations
│   │   ├── orchestrators/                     growth / acquisition / activation / retention / revenue
│   │   └── skills/                            11 Pipeline Skills
│   ├── pm-07-monitoring/                  Module 7: Monitoring & Iteration
│   │   ├── orchestrators/                     monitoring / diagnosis / iteration / release
│   │   └── skills/                            11 Pipeline Skills
│   └── pm-08-project/                     Module 8: Project Management
│       ├── orchestrators/                     agile / project-planning / risk
│       └── skills/                            8 Pipeline Skills
│
├── ui-skill/                         ✅ Skill files — UI Design & Frontend
│   ├── ui-01-design-system/               Module 1: Design System (project init + visual style)
│   │   └── project-init/                      Project initialization all-in-one
│   ├── ui-02-ui-frontend/                 Module 2: UI Frontend (components + pages + review)
│   │   └── page-builder/                      Page building all-in-one
│   ├── ui-03-frontend-integration/        Module 3: Frontend Integration (API integration + production readiness)
│   │   ├── api-integration/                   API contract consumption all-in-one
│   │   └── production-ready/                  Production readiness all-in-one
│   ├── orchestrators/                     ui-orchestrator (unified orchestrator)
│   └── extensions/                        External Skills (ext-frontend-design / ext-impeccable / ext-interaction-design / ext-ui-ux-pro-max)
│
├── backend-skill/                     ✅ Skill files — Backend Architecture & Development
│   ├── orchestrators/                     backend-orchestrator (top-level two-phase orchestrator)
│   ├── backend-01-api-design/             Module 1: API Design (data-driven contracts, field-justified)
│   │   ├── orchestrators/                     api-design-orchestrator
│   │   └── skills/                            api-design-spec + api-design-impl
│   ├── backend-02-data-architecture/       Module 2: Data Architecture (architecture-constrained, models set the ceiling)
│   │   ├── orchestrators/                     data-architecture-orchestrator
│   │   └── skills/                            data-architecture-spec + data-architecture-impl
│   └── backend-03-backend-architecture/    Module 3: Backend Architecture (appropriate architecture, evolve on demand)
│       ├── orchestrators/                     backend-architecture-orchestrator
│       └── skills/                            backend-architecture-spec + backend-architecture-impl
│
├── codex/                             🔄 Codex deployment target — flattened English Skill set
│   └── skills/                            120 flattened Skills (English, with Codex runtime specialization)
│
├── codex-templates/                   🔄 Codex templates — authoring standards & protocols
│   ├── orchestrator-protocol.md           Codex orchestrator protocol (dual-mode invocation + artifact-index)
│   ├── orchestrator-skill-template/       Codex orchestrator Skill authoring template
│   ├── pipeline-skill-template/           Codex Pipeline Skill authoring template
│   ├── engineering-boundary-protocol.md   Engineering delivery boundary protocol
│   └── execution-depth-protocol.md        Execution depth protocol
│
└── cross-domain/                      ✅ Skill files — Cross-Domain Coordination
│   └── orchestrators/                     product-iteration-orchestrator / product-launch-orchestrator
│
└── skills/                            ✅ Skill files — Cross-cutting Skills
    └── skill-finder/                      Guide (Tier 0): Index-driven skill matching & recommendation
        ├── SKILL.md                           Skill definition
        └── index/                             CSV indexes (auto-generated)
            ├── skill-index.csv                    123-skill compact index
            ├── synonym-map.csv                    Synonym expansion layer
            ├── skill-relationships.csv            Upstream/downstream relationships
            ├── execution-templates.csv            Scenario execution templates
            └── domain-lifecycle-map.csv           Domain-lifecycle mapping
```

> **Skill Extraction Rule**: Only directories marked with ✅ contain deployable Skill files. The minimal unit of each Skill is `{skill-name}/SKILL.md`. When deploying, simply flatten-copy the innermost `{skill-name}/` folders into `.trae/skills/`. `templates/`, `scripts/`, `.github/` etc. are project infrastructure and do not need to be deployed. Directories marked with 🔄 (`codex/` and `codex-templates/`) are Codex deployment targets — already flattened with runtime specialization; simply copy folders from `codex/skills/`.

## Domain Module Details

### PM Product Methodology (102 Skills)

#### Module 1: Product Discovery

Explore product direction from four dimensions: market, users, needs, and opportunities.

| Sub-module | Orchestrator | Pipeline Skills | Core Output |
|------------|-------------|-----------------|-------------|
| Need Insights | insight-orchestrator | insight-analysis | Need prioritization |
| Market & Competition | market-orchestrator | market-tam-som / market-pest / market-competitor-analysis | Competitive analysis report + differentiation strategy |
| Opportunity Identification | opportunity-orchestrator | opportunity-definition | Opportunity brief |
| User Research | user-research-orchestrator | user-research-voice-analysis / user-research-behavior-analysis / user-research-user-modeling / user-research-interview-assist / user-research-report | User research report + action recommendations |

#### Module 2: Business & Strategy

Determine strategic direction from four dimensions: business model, strategic planning, product positioning, and stakeholder alignment.

| Sub-module | Orchestrator | Pipeline Skills | Core Output |
|------------|-------------|-----------------|-------------|
| Business Model | business-orchestrator | business-model-canvas / business-value-fit / business-pricing / business-strategy-report | Business strategy report |
| Strategic Planning | planning-orchestrator | product-proposal / strategic-analysis / planning-okr / planning-north-star / planning-roadmap | Product proposal + OKR + Roadmap |
| Product Positioning | positioning-orchestrator | positioning-strategy | Positioning statement → **Consumer: ui project-init** |
| Stakeholder | stakeholder-orchestrator | stakeholder-analysis | Strategy brief |

#### Module 3: Ideation & Design

Transform strategy into executable plans through three dimensions: ideation, product design, and solution validation.

| Sub-module | Orchestrator | Pipeline Skills | Core Output |
|------------|-------------|-----------------|-------------|
| Ideation | ideation-orchestrator | ideation-workshop | Top 5 solutions |
| Product Design & Prototype | design-orchestrator | design-prd / design-ia / design-userflow / design-prototype / interaction-spec / design-handoff-spec / change-impact-analysis | PRD + Prototype + Interaction Spec + Design Handoff + Change Impact Analysis → **Consumer: ui page-builder / backend api-design** |
| Solution Validation | validation-orchestrator | validation-assumption-map / validation-mvp / validation-experiment / validation-usability | MVP scope |

**Key Connection**: design-prd (PRD generation) is the core contract between PM and UI/Backend. The PRD simultaneously drives UI frontend generation and backend API design.

#### Module 4: Metrics Design (Pre-development)

Establish a measurement system before development to ensure quantifiability and traceability after launch.

| Sub-module | Orchestrator | Pipeline Skills | Core Output |
|------------|-------------|-----------------|-------------|
| Metrics Design | metrics-orchestrator | metrics-system / tracking-plan / metrics-dashboard | Metrics system + tracking plan → **Consumer: ui page-builder (tracking)** |

#### Module 5: Metrics Operations (Post-launch)

Continuously optimize through data analysis, decision loops, and experiment validation after launch.

| Sub-module | Orchestrator | Pipeline Skills | Core Output |
|------------|-------------|-----------------|-------------|
| Data Analysis | analysis-orchestrator | analysis-anomaly / analysis-funnel / analysis-retention / data-analysis-report | Data insight report + action recommendations |
| Decision Loop | decision-orchestrator | decision-dace / decision-culture | DACE decision cycle |
| Experiment Validation | experiment-orchestrator | experiment-design / experiment-execution | A/B test report + action recommendations |

#### Module 6: Growth & Operations

Drive growth across four dimensions of the AARRR model: acquisition, activation, retention, and revenue.

| Sub-module | Orchestrator | Pipeline Skills | Core Output |
|------------|-------------|-----------------|-------------|
| Growth Model | growth-orchestrator | growth-model / growth-strategy-report / gtm-strategy / product-operations-manual | Growth strategy report + GTM strategy + operations manual → **Drives acquisition/activation/retention/revenue strategies** |
| Acquisition | acquisition-orchestrator | acquisition-analysis | Channel evaluation + funnel optimization |
| Activation | activation-orchestrator | activation-aha / activation-onboarding | Aha Moment + Onboarding |
| Retention | retention-orchestrator | retention-management | Churn early warning + tiered operations |
| Revenue | revenue-orchestrator | revenue-funnel / revenue-nrr / revenue-upsell | Payment funnel + NRR + upsell |

#### Module 7: Monitoring & Iteration

Form a continuous improvement loop through monitoring alerts, problem diagnosis, iteration optimization, and release management.

| Sub-module | Orchestrator | Pipeline Skills | Core Output |
|------------|-------------|-----------------|-------------|
| Monitoring Alerts | monitoring-orchestrator | monitoring-pipeline / user-feedback-loop-report | Monitoring system + anomaly attribution + feedback loop |
| Intelligent Diagnosis | diagnosis-orchestrator | diagnosis-health / diagnosis-competition / competitor-monitoring-report / product-sunset-plan | Health score + competitor monitoring report + sunset plan |
| Iteration Decision | iteration-orchestrator | iteration-decision | Backlog optimization |
| Release Orchestration | release-orchestrator | quality-acceptance / release-gradual / release-auto-checklist / release-notes | Quality acceptance + gradual rollout + checklist + release notes |

#### Module 8: Project Management

Full-lifecycle project planning, agile execution, and risk management.

| Sub-module | Orchestrator | Pipeline Skills | Core Output |
|------------|-------------|-----------------|-------------|
| Project Planning | project-planning-orchestrator | planning-project-charter / planning-resource / planning-kickoff | Project charter + resource plan |
| Agile Execution | agile-orchestrator | agile-sprint-planning / agile-daily-sync / agile-review (includes iteration retrospective) | Sprint planning + daily sync + iteration retrospective |
| Risk Management | risk-orchestrator | risk-identification / risk-management | Risk register + monitoring + escalation |

---

### Cross-Domain Coordination (2 Skills)

Cross-domain orchestrators coordinate the complete product process across PM, UI, and Backend domains, enabling global scheduling from requirements to launch.

| Orchestrator | Purpose | Scheduled Sub-orchestrators |
|-------------|---------|----------------------------|
| product-iteration-orchestrator | Product iteration commander — schedules domain orchestrators based on requirement change impact scope | design / api-design / data-architecture / backend-architecture / ui / release / monitoring |
| product-launch-orchestrator | Product launch commander — coordinates end-to-end parallel construction from 0 to 1 | insight / market / business / positioning / design / metrics / api-design / data-architecture / backend-architecture / ui / release / monitoring / iteration / agile |

---

### UI Design & Frontend Development (9 Skills)

> **Unified Orchestration + Skip on Demand**: The UI module is orchestrated by a single `ui-orchestrator` with a skip-on-demand strategy — completed or unnecessary stages can be skipped directly. L1/L2 tiered routing is no longer used. 9 Skills = 1 orchestrator + 4 Pipeline + 4 external extensions.
>
> **Dual Output Mode**: UI Skills use a dual output mode — code files are written directly to `{project_dir}/` (runnable), while metadata files are written to `output/` (consumed by downstream Skills).

#### Orchestrator

| Orchestrator | Purpose | Scheduling Strategy |
|-------------|---------|---------------------|
| ui-orchestrator | Unified UI full-pipeline orchestration, supporting express/prototype/full/progressive execution modes | Skip on demand: completed or unnecessary stages can be skipped directly; express mode supports design direction quick-select (2-3 options) + structured prompt generation |

#### Pipeline Skills

| Skill | Purpose | Key Connections |
|-------|---------|-----------------|
| project-init | Project initialization + design system setup: framework selection, directory structure, dependency installation, design token derivation from brand guidelines, visual style definition, generates PRODUCT.md/DESIGN.md | **Input**: pm PRD + positioning-strategy + brand guidelines → **Must-call** ext-frontend-design → **Output**: `{project_dir}/` runnable project skeleton + design tokens + PRODUCT.md/DESIGN.md |
| page-builder | Component generation + page assembly + UI review: generates frontend components based on design system, assembles complete pages, auto-reviews visual/accessibility/interaction/responsive | **Input**: project-init + pm PRD/prototype/IA + pm tracking-plan → Review loop, P0 blocks release |
| api-integration | Frontend-backend integration bridge: generates frontend request layer + types + mocks based on OpenAPI | **Input**: backend api-design-spec ← core cross-domain contract |
| production-ready | Production readiness assurance: build config + CI/CD + CDN + performance optimization + auto-testing (component/visual/E2E/accessibility) | LCP≤2.5s + first-screen JS≤200KB + core flow E2E 100% pass as launch gates |

> **Skill Merge Mapping**: `project-scaffold` + `design-system` → `project-init`; `ui-component-gen` + `page-assembly` + `ui-review` → `page-builder`; `api-contract-consume` → `api-integration`; `frontend-build-deploy` + `frontend-performance` + `frontend-test` → `production-ready`

#### External Extensions

| Extension Skill | Purpose | Caller (Orchestrator Stage) |
|----------------|---------|-----------------------------|
| ext-frontend-design | Visual differentiation design | stage-2 **must-call** (design system setup) / stage-e express mode (visual engine) |
| ext-impeccable | colorize/typeset/layout/shape/animate/bolder/quieter/delight/clarify/onboard/distill/audit/critique/harden/polish/optimize | stage-2(colorize/typeset) / stage-4(layout/shape/animate/clarify/onboard/distill/audit/critique) / stage-6(harden/polish/optimize) |
| ext-interaction-design | Interaction motion patterns | stage-4 (interaction motion enhancement) / stage-e express mode (motion engine) |
| ext-ui-ux-pro-max | Data-driven design recommendations | stage-2 --design-system (design system recommendations) / stage-4 --domain (page structure recommendations) / stage-e express mode (UX engine) |

> **ext- Skill Invocation**: External extension Skills have been changed from descriptive tables to imperative invocation block format. Orchestrators schedule them precisely via `Skill: ext-xxx` instruction blocks rather than relying on description matching. For example: `Skill: ext-frontend-design`, `Skill: ext-impeccable`.

---

### Backend Architecture & Development (10 Skills)

> **Design Fully First, Then Implement**: The Backend module uses a two-phase approach — the Design phase produces design specs in Architecture→Data→API order, with cross-validation and unified review; the Implementation phase generates runnable code in Data→API→Architecture order. The top-level orchestrator (backend-orchestrator) coordinates the two-phase flow, while three sub-orchestrators can be invoked independently.

#### Top-Level Orchestrator

| Orchestrator | Purpose | Scheduling Strategy |
|-------------|---------|---------------------|
| backend-orchestrator | Backend full-pipeline two-phase orchestration | Phase A: Arch→Data→API design → Unified design review → Phase B: Data→API→Architecture implementation |

#### Module 1: Backend Architecture (Design First)

Architecture serves the business, simple solutions first, evolve on demand. Architecture decisions come first, constraining subsequent data models and API design.

| Skill | Purpose | Key Connections |
|-------|---------|-----------------|
| backend-architecture-spec | Architecture pattern → ADR → Service design → Service data ownership → Tech stack decision → Backend review | **Input**: pm PRD → **Output**: Architecture plan + service_data_ownership.json + tech_stack_decision.json → **Human review** |
| backend-architecture-impl | app.ts + config → Service layer → Infrastructure → Docker + CI → Unified alignment check → Test generation | **Input**: backend-architecture-spec outputs + api-design-impl + data-architecture-impl → **Output**: Code written to {project_dir}/ |

#### Module 2: Data Architecture (Architecture-Constrained)

Architecture constraints first, models set the ceiling, caching sets the floor, migrations are reversible.

| Skill | Purpose | Key Connections |
|-------|---------|-----------------|
| data-architecture-spec | Data dictionary → ER modeling → Table structure & indexes → Caching strategy → Migration plan | **Input**: pm PRD + Architecture plan + Service data ownership + Tech stack decision → **Output**: er_model.json + caching strategy + migration plan → **Human review** |
| data-architecture-impl | Model → Migration → Repository → Cache layer → Alignment check → Test generation | **Input**: data-architecture-spec outputs + Tech stack decision → **Output**: Code written to {project_dir}/src/ |

#### Module 3: API Design (Data-Driven Contracts)

Data-driven contracts, field-justified, security built-in rather than bolted on.

| Skill | Purpose | Key Connections |
|-------|---------|-----------------|
| api-design-spec | Resource identification → Interface design → Security design → Authentication & authorization → Compliance check | **Input**: pm PRD + Architecture plan + Service design + Tech stack decision + ER model (required) → **Output**: openapi.yaml + security policy + auth scheme → **Human review** |
| api-design-impl | Code skeleton → Service implementation → Middleware → Alignment check → Test generation | **Input**: api-design-spec outputs + Data model + Data layer implementation report → **Output**: Code written to {project_dir}/src/ ← core frontend-backend contract |

## Core Deliverable Documents

Of the 74 Pipeline Skills in the PM domain, 18 produce Markdown deliverable documents, while the remaining 56 produce JSON data fragments consumed by downstream Skills. UI/Backend deliverables are primarily code and configuration. There are 123 source Skills in total (including 34 orchestrators + 74 PM Pipeline + 4 UI Pipeline + 6 Backend Pipeline + 4 UI external extensions + 1 guide).

### PM Core Deliverable Documents

| Lifecycle | Deliverable | Skill |
|-----------|------------|-------|
| Discovery | Competitive Analysis Report | market-competitor-analysis |
| Discovery | User Research Report | user-research-report |
| Strategy | Product Proposal | product-proposal |
| Strategy | Business Strategy Report | business-strategy-report |
| Design | PRD | design-prd |
| Design | Interaction Design Spec | interaction-spec |
| Design | Design Handoff Document | design-handoff-spec |
| Design | Change Impact Analysis Report | change-impact-analysis |
| Monitoring | Acceptance Report | quality-acceptance |
| Monitoring | Release Notes | release-notes |
| Metrics Ops | Data Analysis Report | data-analysis-report |
| Metrics Ops | A/B Test Report | experiment-execution |
| Growth | Growth Strategy Report | growth-strategy-report |
| Growth | Go-to-Market Strategy | gtm-strategy |
| Growth | Product Operations Manual | product-operations-manual |
| Monitoring | Competitor Monitoring Report | competitor-monitoring-report |
| Monitoring | User Feedback Loop Report | user-feedback-loop-report |
| Monitoring | Product Sunset Plan | product-sunset-plan |

> 📌 **Backend Module Built-in Coverage**: Deliverables such as Architecture Decision Records (ADR), data dictionaries, security compliance assessments, and technical debt registers are produced by the Backend module natively, and are not separate PM Pipeline Skills.

## Typical Usage Paths

### Path 1: Building a New Product from 0 to 1

```
PM Discovery → PM Strategy → PM Design (PRD) ──┬── UI Project Init → UI Page Build → UI API Integration → UI Production Ready
                                                 │                                                          ↑
                                                 └── Arch Design→Data Design→API Design → Data Impl→API Impl→Arch Impl
                                                          ↑
                                                    PRD + Architecture Plan + Data Model

Cross-domain data flow:
  positioning-strategy → UI Project Init (project-init)
  IA/Prototype/Tokens → UI Page Build (page-builder)
  openapi.yaml → UI API Integration (api-integration)
```

### Path 2: Optimizing an Existing Product

```
PM Metrics Ops (Data Analysis) → PM Monitoring & Iteration (Diagnosis + Iteration) → PM/Backend/UI fix as needed
```

### Path 3: Need Growth

```
PM Growth & Operations (Acquisition → Activation → Retention → Revenue) → PM Metrics Ops (Experiment Validation) → Continuous iteration
```

### Path 4: Frontend-Backend Integration

```
Backend api-design (openapi.yaml) → UI api-integration (Types + Mock + Hook)
                                  → UI production-ready (CI/CD + performance gates + testing)
```

## Output Paths

Skill execution results are written to the `output/` directory under the **user's project root**:

```
User Project/
└── output/
    ├── pm-discovery/               ← PM Discovery
    ├── pm-strategy/                ← PM Strategy
    ├── pm-design/                  ← PM Design
    ├── pm-metrics-design/          ← PM Metrics Design
    ├── pm-metrics-ops/             ← PM Metrics Operations
    ├── pm-growth/                  ← PM Growth Operations
    ├── pm-monitoring/              ← PM Monitoring & Iteration
    ├── pm-project/                 ← PM Project Management
    ├── ui/                           ← UI Design & Frontend (unified output)
    ├── backend-api-design/         ← Backend API Design
    ├── backend-data-architecture/  ← Backend Data Architecture
    └── backend-architecture/       ← Backend Architecture
```

Output follows the user's project, not the Skill definition directory. Multiple projects have isolated outputs.

> **Dual Output Mode**: UI/Backend Skills write code files directly to `{project_dir}/` to ensure generated code is immediately runnable; metadata files are still written to `output/` for downstream Skill consumption.

## AI Capability Boundaries

- ✅ Can do: Read local files, analyze pasted text, process uploaded files, generate structured reports, logical reasoning
- ❌ Cannot do: Access external databases, call business APIs, fetch real-time data, operate external systems, execute code

When external data is needed, users must provide it through pasting / uploading / providing file paths.

## Choose Domain & Module by Scenario

| Your Scenario | Recommended Entry |
|---------------|-------------------|
| Building a new product from 0 to 1 | product-launch-orchestrator (cross-domain full pipeline) |
| Iterating on existing product features | product-iteration-orchestrator (cross-domain incremental update) |
| Optimizing an existing product | PM Module 6 (Data Analysis) or PM Module 8 (Monitoring & Iteration) |
| Need growth | PM Module 7 (Growth & Operations) |
| Competitive analysis | PM Module 1 market-orchestrator |
| User research | PM Module 1 user-research-orchestrator |
| Business model design | PM Module 2 business-orchestrator |
| Product positioning | PM Module 2 positioning-orchestrator |
| Need to write a PRD | PM Module 3 design-prd |
| Need A/B testing | PM Module 5 experiment-orchestrator |
| Need to establish a design system | UI project-init (includes design system setup) |
| Need to generate frontend code | UI ui-orchestrator (unified orchestration) |
| Need frontend-backend integration | UI api-integration ← Backend api-design |
| Need to design APIs | Backend Module 3 api-design-orchestrator (data-driven contracts) |
| Need to design database | Backend Module 2 data-architecture-orchestrator (architecture-constrained) |
| Need to determine architecture pattern | Backend Module 1 backend-architecture-orchestrator |
| Need full backend pipeline | Backend backend-orchestrator (top-level two-phase orchestration) |
| Project management & collaboration | PM Module 8 project-planning-orchestrator |

## Human & AI Division of Labor

- 🤖 AI auto-executes: Data processing, analytical computation, document generation, code generation, review checks
- 🤖→👤 AI suggests, human approves: Solution selection, architecture decisions, security policies, priority ranking
- 👤→🤖 Human executes, AI assists: Goal setting, brand guidelines, value judgments
- 👤 Human executes: Final decisions, external communication, security level confirmation

All orchestrator stage gates and human decision points ensure critical decisions remain under human control.

## Core Beliefs

- **Do the right things, then do things right**: PM ensures direction, UI/Backend ensures execution
- **Contracts drive everything**: PRD drives design, OpenAPI drives integration, design tokens drive UI
- **Security/accessibility built-in by default**: Not afterthought patches, but default settings
- **Review loop closure**: P0 issues block release — no pass, no release
- **Data-driven decisions**: Use data to reduce guessing, but decision authority stays with humans
- **Simple solutions first**: Architecture evolves on demand, no over-engineering

## Contributing

We welcome all forms of contribution — new Skills, improvements to existing Skills, issue reports, and document translations.

- 📋 [Contributing Guide](CONTRIBUTING.md) — Naming conventions, authoring templates, PR process
- 🗺️ [Roadmap](ROADMAP.md) — Skills to be claimed and new domain expansion directions
- 🐛 [Submit an Issue](https://github.com/LuckyOneTwoThree/All-Skill/issues/new?template=bug-skill.yml) — Report Skill execution issues
- 💡 [Propose a New Skill](https://github.com/LuckyOneTwoThree/All-Skill/issues/new?template=new-skill.yml) — Propose new methodology Pipelines

## License

This project is open-sourced under the [MIT License](LICENSE).
