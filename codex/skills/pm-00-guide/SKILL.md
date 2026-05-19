---
name: pm-00-guide
description: "Use when users mention building products, product planning, from 0 to 1, product methodology, product process, building systems, building platforms, building apps, building e-commerce, building SaaS, or new projects. Recommends corresponding modules and Skills based on user's current stage and business intent. Keywords: product methodology, product process, product planning, from 0 to 1, full product lifecycle, new project."
metadata:
  module: "Product Methodology"
  sub-module: "Navigation Entry"
  type: "guide"
  version: "1.0"
---

# Product Methodology Full Lifecycle Navigation

## Full Product Lifecycle Overview

```
Product Discovery & Insight -> Product Business & Strategy -> Product Ideation & Design (including PRD generation + Change Impact Analysis)
       v                                    v
  Product Metrics Design (pre-dev)              [Backend Development & Launch]
                                          v
                                  Product Metrics Operations (post-launch)
                                          v
                              Product Growth & Operations <--> Product Monitoring & Iteration (including Acceptance & Release)
                                          v
                                    Project Management & Execution (throughout)
```

## 8 Modules & Entry Orchestrators

| Stage | Module | Entry Orchestrator | When to Use |
|------|------|-----------|---------|
| 1 | Product Discovery & Insight | user-research-orchestrator / insight-orchestrator / market-orchestrator / opportunity-orchestrator | Starting from scratch, don't know who users are or what problems exist |
| 2 | Product Business & Strategy | business-orchestrator / positioning-orchestrator / planning-orchestrator / stakeholder-orchestrator | Problems identified, need to determine business model and strategy |
| 3 | Product Ideation & Design (including PRD generation + Change Impact Analysis) | ideation-orchestrator / design-orchestrator / validation-orchestrator | Strategy established, need to design solutions, generate PRD and validate |
| 4 | Product Metrics Design | metrics-orchestrator | Pre-development, need to design metrics system and tracking plan |
| 5 | Product Metrics Operations | analysis-orchestrator / experiment-orchestrator / decision-orchestrator | Post-launch, need data analysis and experiment validation |
| 6 | Product Growth & Operations | acquisition-orchestrator / activation-orchestrator / retention-orchestrator / revenue-orchestrator | Need to acquire users, improve retention, monetize |
| 7 | Product Monitoring & Iteration (including Acceptance & Release) | monitoring-orchestrator / release-orchestrator / diagnosis-orchestrator / iteration-orchestrator | Need monitoring alerts, issue diagnosis, iterative optimization, acceptance & release |
| 8 | Project Management & Execution | project-planning-orchestrator / agile-orchestrator / risk-orchestrator | Project management throughout the entire process |

## Intent Routing

Based on user's natural language input, quickly route to the corresponding orchestrator or template.

| User Intent Pattern | Routing Target | Confidence |
|---|---|---|
| Build *system / Build *platform / Build *app / Build *mall / From 0 to 1 / New project / Build *mini-program | product-launch-orchestrator | High |
| Add feature / Change requirement / Optimize / Iterate / Upgrade / New module | product-iteration-orchestrator | High |
| Analyze data / View data / Funnel / Retention / Anomaly / Poor data | analysis-orchestrator | High |
| Growth / Acquisition / Monetization / AARRR / User volume / Revenue | growth-orchestrator | High |
| Write PRD / Requirements document / Product document / PRD | design-orchestrator | High |
| Competitor / Market / Industry / Market size | market-orchestrator | Medium |
| User research / Survey / Interview / Persona / User profile | user-research-orchestrator | High |
| Business model / Pricing / Canvas / How to make money | business-orchestrator | High |
| Monitoring / Alert / Anomaly warning / Production issues | monitoring-orchestrator | High |
| Project management / Sprint / Agile / Standup | agile-orchestrator | High |
| Positioning / Differentiation / Competitive advantage | positioning-orchestrator | Medium |
| Requirements analysis / Requirements insight / KANO / JTBD | insight-orchestrator | High |
| Experiment / A/B testing / Effect validation | experiment-orchestrator | High |
| Quality assurance / Testing / Acceptance | quality-acceptance / release-orchestrator | Medium |
| Release / Launch / Gradual rollout | release-orchestrator | High |

## Business Scenario Mapping

Translate user's business language into methodology processes. When users mention specific business domains, first identify the business type, then recommend corresponding scenario templates and key orchestrators.

| User's Possible Expression | Business Type | Recommended Template | Key Orchestrator | Special Focus |
|---|---|---|---|---|
| Build trading mall / E-commerce / Shopping platform / E-commerce mini-program | C2C Transaction Type | Template 2 | product-launch-orchestrator | Payment security (api-design), transaction data (data-architecture), full growth funnel (acquisition->revenue) |
| Build SaaS / CRM / ERP / Management system / OA / HR system | B2B Efficiency Type | Template 1 | product-launch-orchestrator | Permission design (api-design), multi-tenancy (data-architecture), Stakeholder alignment |
| Build social / Community / Content platform / Forum / Short video | C2C Content Type | Template 2 | product-launch-orchestrator | Network effect growth (growth-orchestrator), content moderation & security |
| Build finance / Payment / Lending / Insurance / Wealth management | Financial Compliance Type | Template 1 | product-launch-orchestrator | Compliance assessment (Backend built-in), risk control, transaction ledger (data-architecture) |
| Build education / Courses / Knowledge payment / Training | Content Transaction Type | Template 2 | product-launch-orchestrator | Payment model (business-pricing), learning path design |
| Build tools / Efficiency / Notes / Calendar / To-do | Tool Type | Template 2 | product-launch-orchestrator | Activation (activation-aha), retention strategy (retention-orchestrator) |
| Build healthcare / Health / Fitness / Consultation | Healthcare Type | Template 1 | product-launch-orchestrator | Privacy compliance (Backend built-in), data security |
| Build logistics / Supply chain / Warehousing / Delivery | Supply Chain Type | Template 1 | product-launch-orchestrator | Data architecture (data-architecture), system integration |
| Build games / Entertainment / Live streaming | Entertainment Type | Template 2 | product-launch-orchestrator | User experience design, retention & monetization (revenue-orchestrator) |
| Build AI products / Smart assistant / ChatBot | AI Product Type | Template 2 | product-launch-orchestrator | User research (user-research-orchestrator), validation (validation-orchestrator) |

### Business Scenario Mapping Usage

1. **Identify business type**: Match user input against the "User's Possible Expression" column in the table above
2. **Recommend template**: Use the corresponding "Recommended Template" to start the process
3. **Focus areas**: Pay special attention to orchestrators and Skills marked in the "Special Focus" column during process execution
4. **One-click launch**: Directly invoke the cross-domain orchestrator in the "Key Orchestrator" column; it will automatically coordinate the full process
5. **Flexible adjustment**: Business scenario mapping is a recommended starting point; users can adjust the process based on actual conditions

## Recommendations by User Scenario

### Scenario 1: Building a new product from 0 to 1
Recommended sequence: Module 1 -> 2 -> 3 -> 4 -> 7

### Scenario 2: Existing product needs optimization
Recommended entry: Module 5 (Data Analysis) or Module 7 (Monitoring & Iteration)

### Scenario 3: Need growth
Recommended entry: Module 6 (Growth & Operations)

### Scenario 4: Need requirements analysis
Recommended entry: Module 1's insight-orchestrator or Module 3's design-prd

### Scenario 5: Need to write PRD
Recommended entry: Module 3 design-prd

### Scenario 6: Project management and collaboration
Recommended entry: Module 8 project-planning-orchestrator

## Scenario Templates

Scenario templates provide complete orchestrator invocation sequences that can be executed in order without needing to determine which orchestrator to use at each stage.

### Template 1: Building SaaS/B2B Products from 0 to 1

> [LAUNCH] **One-click launch**: Use cross-domain orchestrator `product-launch-orchestrator` to automatically coordinate the full process

```
product-launch-orchestrator
  Stage 1: Insight & Positioning
    insight-orchestrator -> market-orchestrator -> business-orchestrator -> positioning-orchestrator
  Stage 2: Design & Metrics
    design-orchestrator -> metrics-orchestrator
  Stage 3: Parallel Build (after PRD confirmed, start simultaneously)
    ├── api-design-orchestrator -> data-architecture-orchestrator -> backend-architecture-orchestrator
    └── ui-orchestrator
  Stage 4: Integration Validation
    ui-orchestrator
  Stage 5: Acceptance & Release
    release-orchestrator
```

Key Data Contracts:
- design-orchestrator outputs PRD -> api-design-orchestrator consumes
- positioning-orchestrator outputs positioning statement -> ui-orchestrator consumes (brand DNA)
- metrics-orchestrator outputs metrics system -> release-orchestrator consumes (acceptance criteria)
- Target language: specified by user at launch (default zh-CN), passed through entire chain to ui-orchestrator

### Template 2: Building C2C/Mobile Products from 0 to 1

> [LAUNCH] **One-click launch**: Use cross-domain orchestrator `product-launch-orchestrator` to automatically coordinate the full process (frontend-first mode)

```
product-launch-orchestrator
  Stage 1: User Research & Insight
    user-research-orchestrator -> insight-orchestrator -> opportunity-orchestrator
  Stage 2: Strategy & Design
    positioning-orchestrator -> design-orchestrator -> metrics-orchestrator
  Stage 3: Parallel Build
    ├── ui-orchestrator (design system establishment)
    └── api-design-orchestrator (backend API design)
  Stage 4: Frontend-first Development
    ui-orchestrator
  Stage 5: Acceptance & Release
    release-orchestrator
```

Key Data Contracts:
- design-orchestrator outputs IA/prototype -> ui-orchestrator consumes
- api-design-orchestrator outputs OpenAPI contract -> ui-orchestrator consumes
- ui-orchestrator internally passes design tokens
- Target language: specified by user at launch (default zh-CN), passed through entire chain to ui-orchestrator

### Template 3: Data-driven Optimization for Existing Products

```
Stage 1: Data Diagnosis
  analysis-orchestrator -> decision-orchestrator

Stage 2: Iterative Design
  design-orchestrator (update changed parts only) -> metrics-orchestrator (supplement new metrics)

Stage 3: Validation & Release
  release-orchestrator

Stage 4: Effect Validation
  experiment-orchestrator -> analysis-orchestrator (compare before/after data)
```

Key Data Contracts:
- analysis-orchestrator outputs analysis report -> decision-orchestrator consumes (decision basis)
- experiment-orchestrator outputs experiment results -> analysis-orchestrator consumes (effect comparison)

### Template 4: Growth Breakthrough

```
Stage 1: Growth Diagnosis
  growth-orchestrator -> [bottleneck sub-orchestrators: acquisition / activation / retention / revenue]

Stage 2: Experiment Validation
  experiment-orchestrator

Stage 3: Scale-up
  release-orchestrator (full rollout of growth solution)
```

Key Data Contracts:
- growth-orchestrator outputs growth diagnosis -> bottleneck sub-orchestrators consume
- experiment-orchestrator outputs experiment results -> decision basis for whether to fully roll out growth solution

### Template 5: Feature Iteration

> [LAUNCH] **One-click launch**: Use cross-domain orchestrator `product-iteration-orchestrator` to automatically coordinate the full iteration process

```
product-iteration-orchestrator
  Stage 1: Requirements Analysis
    design-orchestrator (requirements analysis covered by design-prd)
  Stage 2: Solution Design
    design-orchestrator (changed modules only)
  Stage 3: Impact Analysis & Conditional Branch Execution
    ├── API needs change -> api-design-orchestrator -> data-architecture-orchestrator -> backend-architecture-orchestrator
    ├── UI needs change -> ui-orchestrator
    └── No change -> Skip
  Stage 4: Integration & Delivery
    ui-orchestrator (only when API changes)
    -> release-orchestrator
```

Key Data Contracts:
- design-orchestrator outputs requirements document (covered by design-prd) -> downstream consumes
- design-orchestrator outputs updated PRD -> change-impact-analysis consumes

### Template Usage Instructions

1. **Trim as needed**: Templates are complete paths; in practice, you can skip already completed stages
2. **Parallel launch**: Stages marked as "parallel" can be started simultaneously to shorten overall timeline
3. **Data dependencies**: Each template annotates key data contracts to ensure correct cross-orchestrator data passing
4. **Project management**: All templates can be overlaid with project-planning-orchestrator for project management
5. **Degraded execution**: If an orchestrator's upstream data doesn't exist, it can still execute independently (per each Skill's degradation strategy)

## Skill Directory Structure

### Storage Path

All Skill definition files are stored in the `ALL/` directory, organized by module number + module name:

```
ALL/
├── pm-00-guide/                        <- Navigation Entry (non-standard Skill)
│   └── SKILL.md
├── pm-01-discovery/                    <- Module 1: Product Discovery & Insight
│   ├── orchestrators/                  <- Orchestrators
│   │   ├── user-research-orchestrator/SKILL.md
│   │   ├── insight-orchestrator/SKILL.md
│   │   ├── market-orchestrator/SKILL.md
│   │   └── opportunity-orchestrator/SKILL.md
│   └── skills/                         <- Pipeline Skills (10)
│       ├── user-research-voice-analysis/SKILL.md
│       ├── insight-analysis/SKILL.md
│       └── ... (8 Pipelines)
├── pm-02-strategy/                     <- Module 2: Product Business & Strategy
│   ├── orchestrators/ (4 orchestrators)
│   └── skills/ (11 Pipelines)
├── pm-03-design/                       <- Module 3: Product Ideation & Design (including PRD generation + Change Impact Analysis)
│   ├── orchestrators/ (3 orchestrators)
│   └── skills/ (12 Pipelines, including design-prd, change-impact-analysis)
├── pm-04-metrics-design/               <- Module 4: Product Metrics Design
│   ├── orchestrators/ (1 orchestrator)
│   └── skills/ (3 Pipelines)
├── pm-05-metrics-ops/                  <- Module 5: Product Metrics Operations
│   ├── orchestrators/ (3 orchestrators)
│   └── skills/ (8 Pipelines)
├── pm-06-growth/                       <- Module 6: Product Growth & Operations
│   ├── orchestrators/ (5 orchestrators)
│   └── skills/ (11 Pipelines)
├── pm-07-monitoring/                   <- Module 7: Product Monitoring & Iteration (including Acceptance & Release)
│   ├── orchestrators/ (4 orchestrators)
│   └── skills/ (11 Pipelines, including quality-acceptance, release-gradual, release-auto-checklist, release-notes)
└── pm-08-project/                      <- Module 8: Project Management & Execution
    ├── orchestrators/ (3 orchestrators)
    └── skills/ (8 Pipelines, agile-review includes iteration retrospective)
```

### Directory Naming Rules

- `pm-{number}-{module-name}/`: Module-level directory, number controls process order
- `orchestrators/`: Stores orchestrators (commander pattern)
- `skills/`: Stores Pipeline Skills
- Innermost folder name must match the `name` field in SKILL.md

## Output Path Specification

### Path Convention

All Skill outputs are stored uniformly under the `output/` directory in the **user's project root**, following this standard path format:

```
output/pm-{module}/{skill-name}/
```

- `pm-{module}`: Module-level directory (without number, e.g., `pm-discovery`, `pm-design`)
- `{skill-name}`: Skill-level subdirectory, matching the Skill's name field
- Each Skill's output files are stored in their own subdirectory to avoid filename conflicts
- output follows the user's project, not the Skill definition directory

### Module Output Directory Mapping

```
output/
├── pm-discovery/                  <- Module 1: Product Discovery & Insight
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
├── pm-strategy/                   <- Module 2: Product Business & Strategy
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
├── pm-design/                     <- Module 3: Product Ideation & Design (including PRD generation + Change Impact Analysis)
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
├── pm-metrics-design/             <- Module 4: Product Metrics Design
│   ├── metrics-system/
│   ├── tracking-plan/
│   └── metrics-dashboard/
├── pm-metrics-ops/                <- Module 5: Product Metrics Operations
│   ├── analysis-anomaly/
│   ├── analysis-funnel/
│   ├── analysis-retention/
│   ├── data-analysis-report/
│   ├── experiment-design/
│   ├── experiment-execution/
│   ├── decision-dace/
│   └── decision-culture/
├── pm-growth/                     <- Module 6: Product Growth & Operations
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
├── pm-monitoring/                 <- Module 7: Product Monitoring & Iteration (including Acceptance & Release)
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
└── pm-project/                    <- Module 8: Project Management & Execution
    ├── planning-project-charter/
    ├── planning-resource/
    ├── planning-kickoff/
    ├── agile-sprint-planning/
    ├── agile-daily-sync/
    ├── agile-review/
    ├── risk-identification/
    └── risk-management/
└── phase-reports/                 <- Orchestrator Stage Summaries
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

### Cross-module File References

When a Skill needs to read output from other modules, use the following path format:

```
output/pm-{source-module}/{source-skill-name}/{filename}
```

Examples:
- Module 3 Skill reads Module 1 user research output: `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`
- Module 3 PRD reads Module 2 strategy output: `output/pm-strategy/planning-okr/okr.json`
- Module 8 acceptance Skill reads PRD: `output/pm-design/design-prd/prd.md`

### File Naming Convention

- JSON data files: `{skill-name}.json` or `{descriptive-name}.json`
- Markdown documents: `{descriptive-name}.md`
- Chart files: `charts/{chart-name}.png`
- Data files: `data/{data-name}.csv` or `data/{data-name}.json`

### Output Validation Rules

Each Pipeline Skill's output section includes **Output Validation Rules** tables that define required fields and type constraints for output JSON. After AI generates output, it must validate against validation rules:

| Validation Item | Rule | Non-compliance Handling |
|--------|------|-----------|
| Required field completeness | All fields marked as "Required" must exist | Auto-fill missing fields, mark `auto_filled: true`, lower confidence to 0.3 |
| Field type correctness | Field value types must match declared types | Attempt type conversion, mark `type_error: true` if conversion fails |
| Enum value validity | Enum type field values must be within allowed range | Mark `invalid_value: true`, suggest human correction |
| Confidence annotation | All inferred fields must have confidence annotated (0-1.0) | Fill default value 0.3 for fields missing confidence and mark |
| Array non-empty | Array fields marked as required cannot be empty arrays | Mark `empty_array: true`, suggest human supplement data |

Validation rule table format:

```
| Field Path | Type | Required | Description |
|----------|------|------|------|
| Top-level field | object/array/string/number/boolean | Yes/No | Field description |
| Nested field | ... | ... | ... |
```

> Note: Validation rules are added incrementally. Core Skills (design-prd, api-design, design-system, metrics-system, etc.) already include complete validation rules; other Skills supplement as needed.

## Global Quality Gate Specification

All orchestrators and Pipeline Skills must follow the unified quality gate specification below, ensuring degraded output does not unconditionally flow downstream.

### Confidence Level Standards

| Level | Range | Meaning | Passing Rule |
|------|------|------|----------|
| High | >= 0.7 | Sufficient data, multi-source verification | Can automatically pass downstream |
| Medium | 0.3 - 0.7 | Partial data missing or single source | Pass downstream with `confidence: medium` annotation, orchestrator stage gate requires human confirmation |
| Low | < 0.3 | Core data missing or AI inference | **Block automatic passing**, must be confirmed by human before passing downstream |

### Degraded Output Blocking Rules

| Degradation Scenario | Blocking Condition | Handling Method |
|----------|----------|----------|
| Upstream Skill output overall confidence < 0.3 | Orchestrator stage gate detects upstream output `overall_confidence < 0.3` | Block entering next stage, output low confidence report, require human confirmation whether to continue |
| Required field missing and AI auto-filled | Output validation detects `auto_filled: true` fields | Annotate field, orchestrator stage gate summarizes all `auto_filled` fields, require human to confirm each |
| Output quality degraded after degradation strategy execution | Skill degradation strategy explicitly marks "Output Impact" as "simplified" or "incomplete" | Orchestrator marks `degraded_output: true` at stage gate, human confirmation required before passing downstream |
| All upstream data missing | Skill forced to generate based on AI knowledge base inference | Overall confidence upper limit set to 0.3, forced blocking, human must confirm |

### AI Auto-execution Skill Input Pre-check Specification

The following Skills use `ai_auto` interaction mode (AI auto-execution, no real-time human approval required), and must perform input completeness pre-checks before execution:

| Skill | Pre-check Required Items | Pre-check Failure Handling |
|-------|-----------|-------------|
| analysis-anomaly | Metrics system definition + alert rules | Switch to `ai_suggest_human_approve`, require human to provide metrics system |
| analysis-funnel | Funnel definition + event data | Switch to `ai_suggest_human_approve`, require human to provide funnel and event data |
| analysis-retention | User behavior data + cohort definition | Switch to `ai_suggest_human_approve`, require human to provide behavior data |
| experiment-execution | Experiment configuration + guardrail metric definitions | Block execution, require human to provide experiment configuration |
| release-gradual | Release plan + monitoring configuration | Block execution, require human to provide release plan |
| release-auto-checklist | Release content + environment configuration | Switch to `ai_suggest_human_approve`, require human to provide release content |
| risk-management | Risk register + escalation rules | Switch to `ai_suggest_human_approve`, require human to provide risk register |
| monitoring-pipeline | Metrics system + SLA requirements | Switch to `ai_suggest_human_approve`, require human to provide monitoring configuration |
| agile-daily-sync | Sprint Backlog | Switch to `ai_suggest_human_approve`, require human to provide Sprint plan |

**Pre-check Rules**:
1. Before execution, check whether all required inputs exist and are non-empty
2. Required input missing -> Handle per table above (switch interaction mode or block)
3. Optional input missing -> Execute normally, related sections marked "to be supplemented"
4. Pre-check results recorded in output file's `pre_check` field

### Unified Orchestrator Exception Strategy

All orchestrators, when encountering "all upstream data missing", uniformly adopt the following strategy:

```
1. Mark "all data missing" status
2. Output minimized template (only metadata and empty structure)
3. Set overall confidence to 0.3
4. Force human confirmation whether to continue
5. After human confirmation, generate based on user-provided information and AI knowledge base inference
6. All inferred content marked with confidence <= 0.5 and needs_human_validation: true
```

This strategy replaces previous inconsistent handling across modules (pm-01 degraded execution / pm-02 terminate orchestration / pm-08 minimized output), unified as "minimized output + forced human confirmation + degradation annotation".

## AI Capability Boundaries

All Skills in this methodology run within AI Agents, with the following capability boundaries:

### What AI Can Do
- Read project local files (upstream outputs under output/ directory)
- Analyze text content pasted by users
- Process CSV/Excel/JSON files uploaded by users
- Generate structured analysis reports and documents
- Execute logical reasoning, scoring, ranking, and other computational tasks

### What AI Cannot Do
- **Access external databases**: Cannot directly connect to MySQL/PostgreSQL/MongoDB, etc.
- **Call business APIs**: Cannot access company internal APIs or third-party data platforms
- **Retrieve real-time data**: Cannot pull data from Google Analytics, Mixpanel, Sensors, etc.
- **Operate external systems**: Cannot create tasks in JIRA, Feishu, Enterprise WeChat, etc.
- **Execute code**: Cannot run Python/SQL scripts for data processing

### Data Provision Methods

When Skills need external data, users must provide it through one of the following methods:
1. **Direct paste**: Paste data content into the conversation
2. **Upload files**: Upload CSV/Excel/JSON files
3. **Provide path**: Provide local file path for AI to read file content

Each Pipeline Skill's "Degradation Strategy > Data Acquisition Instructions" section includes specific provision methods for the data required by that Skill.

## Usage Recommendations

1. **First-time use**: Start from Module 1, execute in sequence
2. **On-demand use**: Directly invoke the corresponding orchestrator based on current stage
3. **Standalone use**: Can also directly invoke any Pipeline Skill without going through an orchestrator
4. **Data passing**: Upstream module output files are stored under `output/pm-{module}/{skill-name}/`, downstream Skills read per path convention
5. **Human decisions**: All key decision points require human confirmation; AI only provides suggestions
6. **External data**: AI cannot access external systems; users must manually provide data (see "AI Capability Boundaries")
