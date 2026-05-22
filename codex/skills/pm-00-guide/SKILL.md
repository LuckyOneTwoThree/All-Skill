---
name: pm-00-guide
description: Use when full product methodology process navigation, product planning, or new project launch path recommendation is needed. Recommends corresponding modules and Skills based on the user's current stage and business intent. Keywords: product methodology, product process, product planning, from 0 to 1, full product process, building a system, building a platform, building an App, building a marketplace, building SaaS, building e-commerce, building social, building community, building management system, new project launch, building mini-program, building website, adding features, changing requirements, optimizing product, growth, data analysis.
metadata:
  module: "Product Methodology"
  sub-module: "Navigation Entry"
  type: "guide"
  version: "3.0"
---

# Product Methodology Full Process Navigation

## Product Full Process Overview

```
Product Discovery → Product Business & Strategy → Product Ideation & Design (incl. PRD Generation + Change Impact Analysis)
       ↓                                    ↓
  Product Metrics Design (pre-dev)              [Backend Development & Launch]
                                          ↓
                                  Product Metrics Operations (post-launch)
                                          ↓
                              Product Growth & Operations ←→ Product Monitoring & Iteration (incl. Acceptance & Release)
                                          ↓
                                    Project Management & Execution (throughout)
```

## 8 Major Modules & Entry Orchestrators

| Stage | Module | Entry Orchestrator | When to Use |
|------|------|-----------|---------|
| 1 | Product Discovery | user-research-orchestrator / insight-orchestrator / market-orchestrator / opportunity-orchestrator | Starting from scratch, don't know who the users are or what the problem is |
| 2 | Product Business & Strategy | business-orchestrator / positioning-orchestrator / planning-orchestrator / stakeholder-orchestrator | Problem identified, need to determine business model and strategy |
| 3 | Product Ideation & Design (incl. PRD Generation + Change Impact Analysis) | ideation-orchestrator / design-orchestrator / validation-orchestrator | Strategy defined, need design solutions, generate PRD and validate |
| 4 | Product Metrics Design | metrics-orchestrator | Pre-development, need to design metrics system and tracking plan |
| 5 | Product Metrics Operations | analysis-orchestrator / experiment-orchestrator / decision-orchestrator | Post-launch, need data analysis and experiment validation |
| 6 | Product Growth & Operations | acquisition-orchestrator / activation-orchestrator / retention-orchestrator / revenue-orchestrator | Need to acquire users, improve retention, monetize |
| 7 | Product Monitoring & Iteration (incl. Acceptance & Release) | monitoring-orchestrator / release-orchestrator / diagnosis-orchestrator / iteration-orchestrator | Need monitoring alerts, issue diagnosis, iterative optimization, acceptance & release |
| 8 | Project Management & Execution | project-planning-orchestrator / agile-orchestrator / risk-orchestrator | Project management throughout the entire process |

## Intent Routing

Based on the user's natural language input, quickly route to the corresponding orchestrator or template.

| User Intent Pattern | Routing Target | Confidence |
|---|---|---|
| Build *system / Build *platform / Build *App / Build *marketplace / From 0 to 1 / New project / Build *mini-program | product-launch-orchestrator | High |
| Add features / Change requirements / Optimize / Iterate / Upgrade / Add module | product-iteration-orchestrator | High |
| Analyze data / View data / Funnel / Retention / Anomaly / Poor data | analysis-orchestrator | High |
| Growth / Acquisition / Monetization / AARRR / User volume / Revenue | growth-orchestrator | High |
| Write PRD / Requirements document / Product document / PRD | design-orchestrator | High |
| Competitors / Market / Industry / Market size | market-orchestrator | Medium |
| User research / Survey / Interview / Persona / User profile | user-research-orchestrator | High |
| Business model / Pricing / Canvas / How to make money | business-orchestrator | High |
| Monitoring / Alerts / Anomaly warning / Production issues | monitoring-orchestrator | High |
| Project management / Sprint / Agile / Standup | agile-orchestrator | High |
| Positioning / Differentiation / Competitive advantage | positioning-orchestrator | Medium |
| Requirements analysis / Requirements insight / KANO / JTBD | insight-orchestrator | High |
| Experiment / A/B testing / Effect validation | experiment-orchestrator | High |
| Quality assurance / Testing / Acceptance | quality-acceptance / release-orchestrator | Medium |
| Release / Launch / Gradual rollout | release-orchestrator | High |

## Business Scenario Mapping

Translate user business language into methodology processes. When users mention specific business domains, first identify the business type, then recommend the corresponding scenario template and key orchestrators.

| User's Possible Phrases | Business Type | Recommended Template | Key Orchestrator | Special Focus |
|---|---|---|---|---|
| Build transaction marketplace / E-commerce / Shopping platform / E-commerce mini-program | C2C Transaction | Template 2 | product-launch-orchestrator | Payment security (api-design), transaction data (data-architecture), full growth funnel (acquisition→revenue) |
| Build SaaS / CRM / ERP / Management system / OA / HR system | B2B Efficiency | Template 1 | product-launch-orchestrator | Permission design (api-design), multi-tenancy (data-architecture), Stakeholder alignment |
| Build social / Community / Content platform / Forum / Short video | C2C Content | Template 2 | product-launch-orchestrator | Network effect growth (growth-orchestrator), content moderation safety |
| Build finance / Payment / Lending / Insurance / Wealth management | Financial Compliance | Template 1 | product-launch-orchestrator | Compliance assessment (Backend built-in), risk control, transaction flows (data-architecture) |
| Build education / Courses / Knowledge payment / Training | Content Transaction | Template 2 | product-launch-orchestrator | Payment model (business-pricing), learning path design |
| Build tools / Efficiency / Notes / Calendar / To-do | Tool | Template 2 | product-launch-orchestrator | Activation (activation-aha), retention strategy (retention-orchestrator) |
| Build healthcare / Health / Fitness / Consultation | Healthcare | Template 1 | product-launch-orchestrator | Privacy compliance (Backend built-in), data security |
| Build logistics / Supply chain / Warehousing / Delivery | Supply Chain | Template 1 | product-launch-orchestrator | Data architecture (data-architecture), system integration |
| Build games / Entertainment / Live streaming | Entertainment | Template 2 | product-launch-orchestrator | User experience design, retention & monetization (revenue-orchestrator) |
| Build AI products / Smart assistant / ChatBot | AI Product | Template 2 | product-launch-orchestrator | User research (user-research-orchestrator), validation (validation-orchestrator) |

### Business Scenario Mapping Usage

1. **Identify Business Type**: Match user input against the "User's Possible Phrases" column in the table above
2. **Recommend Template**: Use the "Recommended Template" from the corresponding row to start the process
3. **Focus Areas**: Pay special attention to the orchestrators and Skills noted in the "Special Focus" column during process execution
4. **One-Click Launch**: Directly call the cross-domain orchestrator in the "Key Orchestrator" column, which automatically coordinates the full process
5. **Flexible Adjustment**: Business scenario mapping is a recommended starting point; users can adjust the process based on actual circumstances

## Recommendations by User Scenario

### Scenario 1: Building a New Product from Scratch
Recommended sequence: Module 1 → 2 → 3 → 4 → 7

### Scenario 2: Existing Product Needs Optimization
Recommended entry: Module 5 (Data Analysis) or Module 7 (Monitoring & Iteration)

### Scenario 3: Need Growth
Recommended entry: Module 6 (Growth & Operations)

### Scenario 4: Need Requirements Analysis
Recommended entry: Module 1's insight-orchestrator or Module 3's design-prd

### Scenario 5: Need to Write PRD
Recommended entry: Module 3 design-prd

### Scenario 6: Project Management & Collaboration
Recommended entry: Module 8 project-planning-orchestrator

## Scenario Templates

Scenario templates provide complete orchestrator call sequences that can be executed in order without needing to determine which orchestrator to use at each stage.

### Template 1: Building SaaS/B2B Product from Scratch

> 🚀 **One-Click Launch**: Use cross-domain orchestrator `product-launch-orchestrator` to automatically coordinate the full process

```
product-launch-orchestrator
  Stage 1: Discovery & Positioning
    insight-orchestrator → market-orchestrator → business-orchestrator → positioning-orchestrator
  Stage 2: Design & Metrics
    design-orchestrator → metrics-orchestrator
  Stage 3: Parallel Build (after PRD confirmation, launch simultaneously)
    ├── api-design-orchestrator → data-architecture-orchestrator → backend-architecture-orchestrator
    └── ui-orchestrator
  Stage 4: Integration Verification
    ui-orchestrator
  Stage 5: Acceptance & Release
    release-orchestrator
```

Key Data Contracts:
- design-orchestrator outputs PRD → api-design-orchestrator consumes
- positioning-orchestrator outputs positioning statement → ui-orchestrator consumes (brand DNA)
- metrics-orchestrator outputs metrics system → release-orchestrator consumes (acceptance criteria)
- Target language: specified by user at launch (default zh-CN), passed through the entire chain to ui-orchestrator

### Template 2: Building C2C/Mobile Product from Scratch

> 🚀 **One-Click Launch**: Use cross-domain orchestrator `product-launch-orchestrator` to automatically coordinate the full process (frontend-first mode)

```
product-launch-orchestrator
  Stage 1: User Research & Insights
    user-research-orchestrator → insight-orchestrator → opportunity-orchestrator
  Stage 2: Strategy & Design
    positioning-orchestrator → design-orchestrator → metrics-orchestrator
  Stage 3: Parallel Build
    ├── ui-orchestrator (design system establishment)
    └── api-design-orchestrator (backend API design)
  Stage 4: Frontend-First Development
    ui-orchestrator
  Stage 5: Acceptance & Release
    release-orchestrator
```

Key Data Contracts:
- design-orchestrator outputs IA/prototype → ui-orchestrator consumes
- api-design-orchestrator outputs OpenAPI contract → ui-orchestrator consumes
- ui-orchestrator internally passes design tokens
- Target language: specified by user at launch (default zh-CN), passed through the entire chain to ui-orchestrator

### Template 3: Data-Driven Optimization for Existing Product

```
Stage 1: Data Diagnosis
  analysis-orchestrator → decision-orchestrator

Stage 2: Iterative Design
  design-orchestrator (only update changed parts) → metrics-orchestrator (supplement new metrics)

Stage 3: Verification & Release
  release-orchestrator

Stage 4: Effect Validation
  experiment-orchestrator → analysis-orchestrator (compare before/after data)
```

Key Data Contracts:
- analysis-orchestrator outputs analysis report → decision-orchestrator consumes (decision basis)
- experiment-orchestrator outputs experiment results → analysis-orchestrator consumes (effect comparison)

### Template 4: Growth Breakthrough

```
Stage 1: Growth Diagnosis
  growth-orchestrator → [Bottleneck sub-orchestrators: acquisition / activation / retention / revenue]

Stage 2: Experiment Validation
  experiment-orchestrator

Stage 3: Scale-up
  release-orchestrator (full rollout of growth plan)
```

Key Data Contracts:
- growth-orchestrator outputs growth diagnosis → bottleneck sub-orchestrators consume
- experiment-orchestrator outputs experiment results → decision basis for whether to fully roll out growth plan

### Template 5: Feature Iteration

> 🚀 **One-Click Launch**: Use cross-domain orchestrator `product-iteration-orchestrator` to automatically coordinate the full iteration process

```
product-iteration-orchestrator
  Stage 1: Requirements Analysis
    design-orchestrator (requirements analysis covered by design-prd)
  Stage 2: Solution Design
    design-orchestrator (only changed modules)
  Stage 3: Impact Analysis & Conditional Branch Execution
    ├── API needs changes → api-design-orchestrator → data-architecture-orchestrator → backend-architecture-orchestrator
    ├── UI needs changes → ui-orchestrator
    └── No changes → Skip
  Stage 4: Integration & Delivery
    ui-orchestrator (only when API changes)
    → release-orchestrator
```

Key Data Contracts:
- design-orchestrator outputs requirements document (covered by design-prd) → downstream consumes
- design-orchestrator outputs updated PRD → change-impact-analysis consumes

### Template Usage Instructions

1. **Tailor as Needed**: Templates are complete paths; in practice, you can skip already-completed stages based on product phase
2. **Parallel Launch**: Stages marked as "parallel" can be launched simultaneously to shorten the overall cycle
3. **Data Dependencies**: Each template annotates key data contracts to ensure correct cross-orchestrator data passing
4. **Project Management**: All templates can be overlaid with project-planning-orchestrator for project management
5. **Degraded Execution**: If an orchestrator's upstream data doesn't exist, the orchestrator can still execute independently (per each Skill's degradation strategy)

## Skill Directory Structure

### Storage Path

All Skill definition files are stored in the `ALL/` directory, organized by module number + module name:

```
ALL/
├── pm-00-guide/                        ← Navigation Entry (non-standard Skill)
│   └── SKILL.md
├── pm-01-discovery/                    ← Module 1: Product Discovery
│   ├── orchestrators/                  ← Orchestrators
│   │   ├── user-research-orchestrator/SKILL.md
│   │   ├── insight-orchestrator/SKILL.md
│   │   ├── market-orchestrator/SKILL.md
│   │   └── opportunity-orchestrator/SKILL.md
│   └── skills/                         ← Pipeline Skills (10)
│       ├── user-research-voice-analysis/SKILL.md
│       ├── insight-analysis/SKILL.md
│       └── ... (8 Pipelines)
├── pm-02-strategy/                     ← Module 2: Product Business & Strategy
│   ├── orchestrators/ (4 orchestrators)
│   └── skills/ (11 Pipelines)
├── pm-03-design/                       ← Module 3: Product Ideation & Design (incl. PRD Generation + Change Impact Analysis)
│   ├── orchestrators/ (3 orchestrators)
│   └── skills/ (12 Pipelines, incl. design-prd, change-impact-analysis)
├── pm-04-metrics-design/               ← Module 4: Product Metrics Design
│   ├── orchestrators/ (1 orchestrator)
│   └── skills/ (3 Pipelines)
├── pm-05-metrics-ops/                  ← Module 5: Product Metrics Operations
│   ├── orchestrators/ (3 orchestrators)
│   └── skills/ (8 Pipelines)
├── pm-06-growth/                       ← Module 6: Product Growth & Operations
│   ├── orchestrators/ (5 orchestrators)
│   └── skills/ (11 Pipelines)
├── pm-07-monitoring/                   ← Module 7: Product Monitoring & Iteration (incl. Acceptance & Release)
│   ├── orchestrators/ (4 orchestrators)
│   └── skills/ (11 Pipelines, incl. quality-acceptance, release-gradual, release-auto-checklist, release-notes)
└── pm-08-project/                      ← Module 8: Project Management & Execution
    ├── orchestrators/ (3 orchestrators)
    └── skills/ (8 Pipelines, agile-review includes iteration retrospective)
```

### Directory Naming Rules

- `pm-{sequence}-{module-name}/`: Module-level directory, sequence controls process order
- `orchestrators/`: Stores orchestrators (commander pattern)
- `skills/`: Stores Pipeline Skills
- Innermost folder name must match the `name` field in SKILL.md

## Output Path Specification

### Path Convention

All Skill outputs are stored uniformly under `output/` in the **user's project root directory**, following this standard path format:

```
output/pm-<module>/<skill-name>/
```

- `pm-<module>`: Module-level directory (without sequence number, e.g., `pm-discovery`, `pm-design`)
- `<skill-name>`: Skill-level subdirectory, matching the Skill's name field
- Each Skill's output files are stored in their own subdirectory to avoid filename conflicts
- output follows the user's project, not the Skill definition directory

### Module Output Directory Mapping

```
output/
├── pm-discovery/                  ← Module 1: Product Discovery
│   ├── user-research-voice-analysis/
│   ├── user-research-behavior-analysis/
│   ├── user-research-user-modeling/
│   ├── user-research-interview-assist/
│   ├── user-research-report/
│   ├── insight-analysis/
│   ├── market-tam-som/
│   ├── market-pest/
│   ├── market-competitor-analysis/
│   └── opportunity-definition/
├── pm-strategy/                   ← Module 2: Product Business & Strategy
│   ├── business-model-canvas/
│   ├── business-value-fit/
│   ├── business-pricing/
│   ├── business-strategy-report/
│   ├── positioning-strategy/
│   ├── strategic-analysis/
│   ├── planning-okr/
│   ├── planning-north-star/
│   ├── planning-roadmap/
│   ├── stakeholder-analysis/
│   └── product-proposal/
├── pm-design/                     ← Module 3: Product Ideation & Design (incl. PRD Generation + Change Impact Analysis)
│   ├── ideation-workshop/
│   ├── design-prd/
│   ├── design-ia/
│   ├── design-userflow/
│   ├── design-prototype/
│   ├── design-handoff-spec/
│   ├── change-impact-analysis/
│   ├── validation-assumption-map/
│   ├── validation-mvp/
│   ├── validation-experiment/
│   ├── validation-usability/
│   └── interaction-spec/
├── pm-metrics-design/             ← Module 4: Product Metrics Design
│   ├── metrics-system/
│   ├── tracking-plan/
│   └── metrics-dashboard/
├── pm-metrics-ops/                ← Module 5: Product Metrics Operations
│   ├── analysis-anomaly/
│   ├── analysis-funnel/
│   ├── analysis-retention/
│   ├── data-analysis-report/
│   ├── experiment-design/
│   ├── experiment-execution/
│   ├── decision-dace/
│   └── decision-culture/
├── pm-growth/                     ← Module 6: Product Growth & Operations
│   ├── growth-model/
│   ├── growth-strategy-report/
│   ├── gtm-strategy/
│   ├── product-operations-manual/
│   ├── acquisition-analysis/
│   ├── activation-aha/
│   ├── activation-onboarding/
│   ├── retention-management/
│   ├── revenue-funnel/
│   ├── revenue-nrr/
│   └── revenue-upsell/
├── pm-monitoring/                 ← Module 7: Product Monitoring & Iteration (incl. Acceptance & Release)
│   ├── monitoring-pipeline/
│   ├── diagnosis-health/
│   ├── diagnosis-competition/
│   ├── competitor-monitoring-report/
│   ├── user-feedback-loop-report/
│   ├── iteration-decision/
│   ├── quality-acceptance/
│   ├── release-gradual/
│   ├── release-auto-checklist/
│   ├── release-notes/
│   └── product-sunset-plan/
└── pm-project/                    ← Module 8: Project Management & Execution
    ├── planning-project-charter/
    ├── planning-resource/
    ├── planning-kickoff/
    ├── agile-sprint-planning/
    ├── agile-daily-sync/
    ├── agile-review/
    ├── risk-identification/
    └── risk-management/
└── phase-reports/                 ← Orchestrator Stage Summaries
    ├── pm-discovery/
    ├── pm-strategy/
    ├── pm-design/
    ├── pm-metrics-design/
    ├── pm-metrics-ops/
    ├── pm-growth/
    ├── pm-monitoring/
    ├── pm-project/
    ├── ui/
    ├── backend/
    └── cross-domain/
```

### Cross-Module File References

When a Skill needs to read output from other modules, use the following path format:

```
output/pm-{source-module}/{source-skill-name}/{filename}
```

Examples:
- Module 3 Skill reading Module 1 user research output: `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`
- Module 3 PRD reading Module 2 strategy output: `output/pm-strategy/planning-okr/okr.json`
- Module 8 acceptance Skill reading PRD: `output/pm-design/design-prd/prd.md`

### File Naming Conventions

- JSON data files: `<skill-name>.json` or `<descriptive-name>.json`
- Markdown documents: `<descriptive-name>.md`
- Chart files: `charts/<chart-name>.png`
- Data files: `data/{data-name}.csv` or `data/{data-name}.json`

### Output Validation Rules

Each Pipeline Skill's output section includes an **Output Validation Rules** table that defines required fields and type constraints for output JSON. After AI generates output, it must validate against the validation rules:

| Validation Item | Rule | Non-Compliance Handling |
|--------|------|-----------|
| Required field completeness | All fields marked as "Required" must exist | Auto-fill missing fields, annotate `auto_filled: true`, reduce confidence to 0.3 |
| Field type correctness | Field value types must match declared types | Attempt type conversion; if conversion fails, annotate `type_error: true` |
| Enum value validity | Enum type field values must be within allowed range | Annotate `invalid_value: true`, recommend human correction |
| Confidence annotation | All inferred fields must have confidence annotated (0-1.0) | Fields missing confidence get default value 0.3 and are flagged |
| Array non-empty | Array fields marked as required cannot be empty arrays | Annotate `empty_array: true`, recommend human to supplement data |

Validation rules table format:

```
| Field Path | Type | Required | Description |
|----------|------|------|------|
| Top-level field | object/array/string/number/boolean | Yes/No | Field description |
| Nested field | ... | ... | ... |
```

> Note: Validation rules are added incrementally. Core Skills (design-prd, api-design, design-system, metrics-system, etc.) already include complete validation rules; other Skills supplement as needed.

## Global Quality Gate Specification

All orchestrators and Pipeline Skills must follow the unified quality gate specification below to ensure degraded output does not unconditionally flow downstream.

### Confidence Level Standards

| Level | Range | Meaning | Passing Rule |
|------|------|------|----------|
| High | ≥ 0.7 | Sufficient data, multi-source validation | Can automatically pass downstream |
| Medium | 0.3 - 0.7 | Partial data missing or single source | Pass downstream with `confidence: medium` annotation; orchestrator stage gate requires human confirmation |
| Low | < 0.3 | Core data missing or AI inferred | **Block automatic passing**; must have human confirmation before passing downstream |

### Degraded Output Blocking Rules

| Degradation Scenario | Blocking Condition | Handling |
|----------|----------|----------|
| Upstream Skill output overall confidence < 0.3 | Orchestrator stage gate detects upstream output `overall_confidence < 0.3` | Block entry to next stage, output low-confidence report, require human confirmation to proceed |
| Required field missing and AI auto-filled | Output validation detects `auto_filled: true` fields | Annotate the field; orchestrator stage gate summarizes all `auto_filled` fields, require human item-by-item confirmation |
| Output quality degraded after degradation strategy execution | Skill degradation strategy explicitly annotates "Output Impact" as "simplified" or "incomplete" | Orchestrator annotates `degraded_output: true` at stage gate; only passes downstream after human confirmation |
| All upstream data missing | Skill forced to infer and generate based on AI knowledge base | Overall confidence cap set to 0.3, forced blocking, human must confirm |

### AI Auto-Execute Skill Input Pre-Check Specification

The following Skills use `ai_auto` interaction mode (AI auto-execute, no human real-time approval required) and must perform input completeness pre-checks before execution:

| Skill | Pre-Check Required Items | Pre-Check Failure Handling |
|-------|-----------|-------------|
| analysis-anomaly | Metrics system definition + alert rules | Switch to `ai_suggest_human_approve`, require human to provide metrics system |
| analysis-funnel | Funnel definition + event data | Switch to `ai_suggest_human_approve`, require human to provide funnel and event data |
| analysis-retention | User behavior data + segment definition | Switch to `ai_suggest_human_approve`, require human to provide behavior data |
| experiment-execution | Experiment configuration + guardrail metric definitions | Block execution, require human to provide experiment configuration |
| release-gradual | Release plan + monitoring configuration | Block execution, require human to provide release plan |
| release-auto-checklist | Release content + environment configuration | Switch to `ai_suggest_human_approve`, require human to provide release content |
| risk-management | Risk register + escalation rules | Switch to `ai_suggest_human_approve`, require human to provide risk register |
| monitoring-pipeline | Metrics system + SLA requirements | Switch to `ai_suggest_human_approve`, require human to provide monitoring configuration |
| agile-daily-sync | Sprint Backlog | Switch to `ai_suggest_human_approve`, require human to provide Sprint plan |

**Pre-Check Rules**:
1. Before execution, check that all required inputs exist and are non-empty
2. Required input missing → Handle per table above (switch interaction mode or block)
3. Optional input missing → Execute normally, annotate related sections as "to be supplemented"
4. Pre-check results recorded in output file's `pre_check` field

### Orchestrator Unified Exception Strategy

All orchestrators, when encountering "all upstream data completely missing," uniformly adopt the following strategy:

```
1. Annotate "all data missing" status
2. Output minimized template (containing only meta-information and empty structures)
3. Set overall confidence to 0.3
4. Force human confirmation to proceed
5. After human confirmation, infer and generate based on user-provided information and AI knowledge base
6. All inferred content annotated with confidence ≤ 0.5 and needs_human_validation: true
```

This strategy replaces the previously inconsistent handling across modules (pm-01 degraded execution / pm-02 terminate orchestration / pm-08 output minimization), unifying to "minimized output + forced human confirmation + degradation annotation."

## AI Capability Boundaries

All Skills in this methodology run within AI Agents and have the following capability boundaries:

### What AI Can Do
- Read project local files (upstream outputs under output/ directory)
- Analyze text content pasted by users
- Process CSV/Excel/JSON files uploaded by users
- Generate structured analysis reports and documents
- Execute logical reasoning, scoring, ranking, and other computational tasks

### What AI Cannot Do
- **Access external databases**: Cannot directly connect to MySQL/PostgreSQL/MongoDB, etc.
- **Call business APIs**: Cannot access company internal APIs or third-party data platforms
- **Retrieve real-time data**: Cannot pull data from Google Analytics, Mixpanel, Sensors, and other analytics platforms
- **Operate external systems**: Cannot create tasks in JIRA, Feishu, Enterprise WeChat, etc.
- **Execute code**: Cannot run Python/SQL scripts for data processing

### Data Provision Methods

When a Skill requires external data, users need to provide it via one of the following methods:
1. **Direct paste**: Paste data content into the conversation
2. **Upload file**: Upload CSV/Excel/JSON files
3. **Provide path**: Provide local file path for AI to read file content

Each Pipeline Skill's "Degradation Strategy > Data Acquisition Instructions" section includes the specific provision methods required for that Skill's data.

## Usage Recommendations

1. **First use**: Start from Module 1, execute in sequence
2. **As needed**: Directly call the corresponding orchestrator based on current stage
3. **Standalone use**: Can also directly call any Pipeline Skill without going through an orchestrator
4. **Data passing**: Upstream module output files are stored under `output/pm-<module>/<skill-name>/`, downstream Skills read per path convention
5. **Human decision**: All key decision points require human confirmation; AI only provides recommendations
6. **External data**: AI cannot access external systems; users must manually provide data (see "AI Capability Boundaries")
