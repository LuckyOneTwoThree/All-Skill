---
name: growth-strategy-report
description: Use when you need to consolidate growth model diagnostics and optimization plans for each stage into a complete, deliverable growth strategy report. Growth strategy report auto-generation, including growth model assessment, AARRR funnel diagnostics, leverage strategies, flywheel model, and execution roadmap. Keywords: growth strategy report, growth report, AARRR report, growth flywheel, growth roadmap, growth bottleneck, how to grow, growth plan.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Growth Model"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Help me produce a growth strategy report"
    - "What to do when growth hits a bottleneck"
    - "How to create a growth plan"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output growth strategy and priority actions"
  deep_description: "Complete report + growth model projection + channel mix optimization + growth experiment roadmap"
---

# Growth Strategy Report Generation

## Core Principles

**A growth strategy report is an action blueprint, not a data dashboard**

The core value of a growth strategy report lies in integrating scattered growth diagnostics and optimization plans for each stage into an executable growth blueprint. The report answers not "what the data is" but "where we should invest, how much, and what returns to expect."

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Growth model diagnostics | markdown | Yes | growth-model | Growth model, flywheel model, bottleneck stage |
| Acquisition plan | markdown | No | acquisition-analysis | Channel evaluation, funnel optimization |
| Activation plan | markdown | No | activation-onboarding | Aha Moment, Onboarding optimization |
| Retention plan | markdown | No | retention-management | Churn prediction, segmented operations |
| Monetization plan | markdown | No | revenue-funnel | Payment funnel, NRR, upsell |
| Business objectives | text | No | User input | North Star metric, growth targets, budget constraints |

## Execution Steps

### Step 1: Growth Model Assessment [Core]

Extract core judgments from growth model diagnostic results:

1. **Growth model identification**: PLG / SLG / MLG / Hybrid model and determination basis
2. **Flywheel model construction**: Flywheel nodes, causal relationships, reinforcing loops, current rotation status
3. **Bottleneck positioning**: Current largest bottleneck stage and quantitative basis
4. **Growth stage determination**: Cold start / Takeoff / Scale / Maturity

### Step 2: AARRR Funnel Diagnostics [Core]

Integrate analysis results from each stage to build a full-funnel view:

1. **Acquisition funnel**: Impression→Click→Registration→Activation, conversion rates at each stage compared to industry benchmarks
2. **Activation funnel**: Registration→Aha Moment→Core feature usage, time decay analysis
3. **Retention curves**: D1/D7/D30 retention rates, retention curve shape (power law/exponential/logarithmic)
4. **Monetization funnel**: Free→Trial→Paid→Renewal→Upsell, ARPU contribution at each stage

### Step 3: Leverage Strategy Integration [Core]

Based on bottleneck positioning and stage-specific plans, integrate leverage strategies:

1. **High-leverage strategies** (highest ROI): Top 3 strategies + expected impact + required resources
2. **Medium-leverage strategies** (steady growth): Complementary strategies + expected impact
3. **Defensive strategies** (prevent decline): Risk mitigation + early warning indicators
4. **Strategy priority matrix**: Sorted by impact × feasibility

### Step 4: Execution Roadmap [Core]

Translate strategies into an executable roadmap:

1. **Quick Wins** (0-2 weeks): Low-investment, high-return immediate actions
2. **Core Optimization** (2-8 weeks): Systematic optimization of key levers
3. **Long-term Investment** (8+ weeks): Infrastructure building for flywheel acceleration
4. **Milestones and Metrics**: Key milestones and acceptance criteria for each phase

### Step 5: Report Assembly [Core]

Assemble the above content into a complete report.

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Growth strategy and priority actions | Core conclusions + minimum viable deliverables |
| standard | Complete deliverables (current default) | Complete deliverables, including all Step outputs |
| deep | Complete report + growth model projection + channel mix optimization + growth experiment roadmap | Complete deliverables + extended analysis + deep projection |

## Output

### Output Files

| File | Path | Description |
|------|------|------|
| Growth strategy report | `output/pm-growth/growth-strategy-report/growth-strategy-report.md` | Human-readable complete report |
| Structured data | `output/pm-growth/growth-strategy-report/growth-strategy-report.json` | Machine-consumable structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["product_name", "growth_model", "leverage_strategies", "roadmap"],
  "properties": {
    "product_name": {"type": "string", "description": "Product name"},
    "report_date": {"type": "string", "description": "Report date"},
    "growth_model": {"type": "object", "description": "Growth model assessment, including type, flywheel model and bottleneck"},
    "aarrr_funnel": {"type": "object", "description": "AARRR funnel diagnostics, including acquisition/activation/retention/monetization"},
    "leverage_strategies": {"type": "object", "description": "Leverage strategies, including high/medium/defensive strategies"},
    "roadmap": {"type": "object", "description": "Execution roadmap, including Quick Wins/Core Optimization/Long-term Investment"},
    "risks_and_assumptions": {"type": "array", "description": "Risks and assumptions list"}
  }
}
```

### Markdown Report Structure

```markdown
# Growth Strategy Report: {Product Name}

## 1. Executive Summary
- Growth model / Current stage / Core bottleneck / Top 3 actions

## 2. Growth Model Assessment
- Growth model identification and basis
- Flywheel model (nodes + causal relationships)
- Bottleneck positioning and quantification

## 3. AARRR Funnel Diagnostics
- Acquisition funnel (conversion rates + industry benchmarks)
- Activation funnel (Aha Moment + time decay)
- Retention curves (D1/D7/D30 + shape analysis)
- Monetization funnel (ARPU contribution breakdown)

## 4. Leverage Strategies
- High-leverage strategies Top 3 (impact × feasibility matrix)
- Medium-leverage strategies
- Defensive strategies
- Strategy priority ranking

## 5. Execution Roadmap
- Quick Wins (0-2 weeks)
- Core Optimization (2-8 weeks)
- Long-term Investment (8+ weeks)
- Milestones and acceptance criteria

## 6. Risks and Assumptions
- Key assumptions list
- Risk mitigation measures
- Monitoring metrics and early warning thresholds
```

### JSON Structure

```json
{
  "product_name": "",
  "report_date": "",
  "growth_model": {
    "type": "PLG|SLG|MLG|hybrid",
    "evidence": "",
    "flywheel": {
      "nodes": [],
      "causal_links": [],
      "current_status": ""
    },
    "bottleneck": "",
    "stage": "cold_start|takeoff|scale|mature"
  },
  "aarrr_funnel": {
    "acquisition": {},
    "activation": {},
    "retention": {},
    "revenue": {}
  },
  "leverage_strategies": {
    "high": [],
    "medium": [],
    "defensive": []
  },
  "roadmap": {
    "quick_wins": [],
    "core_optimization": [],
    "long_term": []
  },
  "risks_and_assumptions": []
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| product_name | string | Yes | Product name, cannot be empty |
| growth_model | object | Yes | Growth model assessment, must include type/flywheel/bottleneck |
| growth_model.type | string | Yes | Growth model type, only PLG/SLG/MLG/hybrid allowed |
| growth_model.evidence | string | No | Model determination basis |
| growth_model.flywheel.nodes | array | Yes | Flywheel nodes, at least 3 |
| growth_model.flywheel.nodes[].node_name | string | Yes | Node name, cannot be empty |
| growth_model.flywheel.edges | array | No | Flywheel causal relationships, at least 2 |
| growth_model.flywheel.edges[].from | string | Yes | Source node |
| growth_model.flywheel.edges[].to | string | Yes | Target node |
| growth_model.flywheel.edges[].description | string | No | Causal relationship description |
| growth_model.bottleneck | string | Yes | Bottleneck description, cannot be empty |
| aarrr_funnel | object | No | AARRR funnel data |
| aarrr_funnel.acquisition | object | No | Acquisition stage |
| aarrr_funnel.acquisition.current_rate | number | No | Current acquisition rate |
| aarrr_funnel.activation | object | No | Activation stage |
| aarrr_funnel.activation.current_rate | number | No | Current activation rate |
| aarrr_funnel.retention | object | No | Retention stage |
| aarrr_funnel.retention.current_rate | number | No | Current retention rate |
| aarrr_funnel.referral | object | No | Referral stage |
| aarrr_funnel.referral.current_rate | number | No | Current referral rate |
| aarrr_funnel.revenue | object | No | Revenue stage |
| aarrr_funnel.revenue.current_rate | number | No | Current payment rate |
| leverage_strategies | object | Yes | Leverage strategies, must include high/medium/defensive |
| leverage_strategies.high | array | Yes | High-leverage strategies, at least 1 |
| leverage_strategies.high[].strategy | string | Yes | Strategy description, cannot be empty |
| leverage_strategies.high[].expected_impact | string | No | Expected impact |
| leverage_strategies.medium | array | Yes | Medium-leverage strategies, at least 1 |
| leverage_strategies.medium[].strategy | string | Yes | Strategy description, cannot be empty |
| leverage_strategies.defensive | array | No | Defensive strategies |
| leverage_strategies.defensive[].strategy | string | Yes | Strategy description, cannot be empty |
| roadmap | object | Yes | Execution roadmap, must include quick_wins/core_optimization/long_term |
| roadmap.quick_wins | array | Yes | Quick win items, at least 1 |
| roadmap.quick_wins[].action | string | Yes | Action description |
| roadmap.quick_wins[].timeline | string | No | Timeline |
| roadmap.core_optimization | array | Yes | Core optimization items, at least 1 |
| roadmap.core_optimization[].action | string | Yes | Action description |
| roadmap.core_optimization[].timeline | string | No | Timeline |
| roadmap.long_term | array | No | Long-term investment items |
| roadmap.long_term[].action | string | Yes | Action description |
| roadmap.long_term[].timeline | string | No | Timeline |
| risks_and_assumptions | array | No | Risks and assumptions list |
| risks_and_assumptions[].type | string | Yes | Type, enum: risk/assumption |
| risks_and_assumptions[].description | string | Yes | Description, cannot be empty |
| risks_and_assumptions[].impact | string | No | Impact assessment |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Flywheel model completeness (at least 3 nodes + 2 causal relationships)
- [ ] Strategy aligned with bottleneck (high-leverage strategies directly target core bottleneck)

### P1 Checks (must pass for standard/deep)

- [ ] Roadmap is executable (each action has an owner, timeline, acceptance criteria)
- [ ] Funnel data complete (at least 3 AARRR stages have data)

### P2 Checks (only deep must pass)

- [ ] Extended analysis complete (deep projections and roadmap generated)
- [ ] Decision records complete (key decisions have basis and alternatives)

## Decision Rules

- When the growth bottleneck is in the acquisition stage, prioritize resource allocation to acquisition strategies
- When the flywheel model has not been validated, annotate strategy recommendations as "pending flywheel validation" to avoid over-investment
- When Quick Wins conflict with long-term investments, prioritize Quick Wins while preserving the long-term investment path
- Decision points requiring human confirmation: growth model determination, core bottleneck confirmation, resource allocation ratios, roadmap prioritization

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|------------|
| No growth model diagnostics | Reverse-engineer growth model from stage-specific plans, annotate "model pending confirmation" | Growth model is an inferred conclusion, needs subsequent validation | Request user to provide growth model description or execute growth-model skill |
| Only partial stage plans available | Cover only stages with available data, annotate missing stages as "to be supplemented" | Report coverage incomplete, no strategy recommendations for missing stages | Request user to provide strategy summaries for missing stages or execute prerequisite skills |
| No upstream input at all | Generate growth strategy framework based on user-provided product information, annotate "needs data validation" | Report is framework-level, all conclusions need data validation | Request user to provide product information, growth objectives and core metrics |
| Business objectives missing | Prompt user to provide business objectives, otherwise cannot determine strategy focus | Strategy lacks goal orientation | Request user to provide business objectives (e.g., increase DAU, improve payment conversion rate, etc.) |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| growth-model | Growth model or bottleneck change | Growth model assessment and leverage strategies | Re-evaluate model, adjust strategy priorities |
| acquisition-* / activation-* / retention-* / revenue-* | Optimization plan update | AARRR funnel diagnostics and strategy integration | Update corresponding funnel stage data and strategies |
| User provided - Business objectives | Objective or budget change | Leverage strategies and execution roadmap | Re-sort strategy priorities, adjust roadmap |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| growth-orchestrator | Report generation complete | Output file update | Report completion status and key conclusions |
| User provided | Report generation complete | Output file | Complete growth strategy report |
