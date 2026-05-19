---
name: growth-strategy-report
description: "Use when consolidating growth model diagnosis and optimization plans into a deliverable growth strategy report. Auto-generates growth strategy report including growth model assessment, AARRR funnel diagnosis, leverage strategies, flywheel model, and execution roadmap. Keywords: growth strategy report, growth report, AARRR report, growth flywheel, growth roadmap, growth bottleneck, growth plan."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Growth Model"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Generate a growth strategy report"
    - "Growth has hit a bottleneck, what should I do"
    - "How to develop a growth plan"
---

# Growth Strategy Report Generation

## Core Principles

**The growth strategy report is an action blueprint, not a data dashboard**

The core value of a growth strategy report lies in integrating scattered growth diagnoses and stage optimization plans into an executable growth blueprint. The report answers not "what the data is" but "where we should invest, how much, and what return to expect."

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Growth Model Diagnosis | markdown | Yes | growth-model | Growth model, flywheel model, bottleneck stage |
| Acquisition Plan | markdown | No | acquisition-analysis | Channel assessment, funnel optimization |
| Activation Plan | markdown | No | activation-onboarding | Aha Moment, Onboarding optimization |
| Retention Plan | markdown | No | retention-management | Churn prediction, segmented operations |
| Revenue Plan | markdown | No | revenue-funnel | Payment funnel, NRR, upsell |
| Business Goals | text | No | User input | North Star metric, growth targets, budget constraints |

## Execution Steps

### Step 1: Growth Model Assessment

Extract core judgments from the growth model diagnosis results:

1. **Growth model identification**: PLG / SLG / MLG / Hybrid model and basis for determination
2. **Flywheel model construction**: Flywheel nodes, causal relationships, reinforcing loops, current rotation status
3. **Bottleneck positioning**: Current biggest bottleneck stage and quantified basis
4. **Growth stage assessment**: Cold start / Takeoff / Scale / Maturity

### Step 2: AARRR Funnel Diagnosis

Integrate analysis results from each stage to build a full-funnel view:

1. **Acquisition funnel**: Impression -> Click -> Registration -> Activation, conversion rates at each stage compared with industry benchmarks
2. **Activation funnel**: Registration -> Aha Moment -> Core feature usage, time decay analysis
3. **Retention curve**: D1/D7/D30 retention rates, retention curve shape (power law/exponential/logarithmic)
4. **Revenue funnel**: Free -> Trial -> Paid -> Renewal -> Upsell, ARPU contribution at each stage

### Step 3: Leverage Strategy Integration

Based on bottleneck positioning and stage plans, integrate leverage strategies:

1. **High-leverage strategies** (highest ROI): Top 3 strategies + expected impact + required resources
2. **Medium-leverage strategies** (steady growth): Complementary strategies + expected impact
3. **Defensive strategies** (prevent decline): Risk mitigation + early warning indicators
4. **Strategy priority matrix**: Sorted by impact x feasibility

### Step 4: Execution Roadmap

Transform strategies into an executable roadmap:

1. **Quick Wins** (0-2 weeks): Low-investment, high-return immediate actions
2. **Core Optimization** (2-8 weeks): Systematic optimization of key levers
3. **Long-term Investment** (8+ weeks): Infrastructure building for flywheel acceleration
4. **Milestones and Metrics**: Key milestones and acceptance criteria for each phase

### Step 5: Report Assembly

Assemble the above content into a complete report.

## Output

### Output Files

| File | Path | Description |
|------|------|------|
| Growth Strategy Report | `output/pm-growth/growth-strategy-report/growth-strategy-report.md` | Human-readable complete report |
| Structured Data | `output/pm-growth/growth-strategy-report/growth-strategy-report.json` | Machine-consumable structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["product_name", "growth_model", "leverage_strategies", "roadmap"],
  "properties": {
    "product_name": {"type": "string", "description": "Product name"},
    "report_date": {"type": "string", "description": "Report date"},
    "growth_model": {"type": "object", "description": "Growth model assessment, including type, flywheel model, and bottleneck"},
    "aarrr_funnel": {"type": "object", "description": "AARRR funnel diagnosis, including acquisition/activation/retention/revenue"},
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

## 3. AARRR Funnel Diagnosis
- Acquisition funnel (conversion rates + industry benchmarks)
- Activation funnel (Aha Moment + time decay)
- Retention curve (D1/D7/D30 + shape analysis)
- Revenue funnel (ARPU contribution breakdown)

## 4. Leverage Strategies
- High-leverage strategies Top 3 (impact x feasibility matrix)
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
| growth_model | object | Yes | Growth model assessment, must contain type/flywheel/bottleneck |
| growth_model.type | string | Yes | Growth model type, only PLG/SLG/MLG/hybrid allowed |
| growth_model.flywheel.nodes | array | Yes | Flywheel nodes, at least 3 |
| growth_model.bottleneck | string | Yes | Bottleneck description, cannot be empty |
| leverage_strategies | object | Yes | Leverage strategies, must contain high/medium/defensive |
| leverage_strategies.high | array | Yes | High-leverage strategies, at least 1 |
| roadmap | object | Yes | Execution roadmap, must contain quick_wins/core_optimization/long_term |
| risks_and_assumptions | array | No | Risks and assumptions list |

## Quality Checks

| Check Item | Standard | Failed Action |
|--------|------|------------|
| Flywheel model completeness | At least 3 nodes + 2 causal relationships | Supplement flywheel nodes or mark "to be validated" |
| Strategy aligned with bottleneck | High-leverage strategies directly target core bottleneck | Adjust strategies or supplement bottleneck analysis |
| Roadmap executable | Each action has owner, timeline, acceptance criteria | Supplement execution details |
| Funnel data complete | AARRR at least 3 stages with data | Mark missing stages as "to be supplemented" |

## Decision Rules

- When growth bottleneck is in the acquisition stage, prioritize resource allocation to acquisition strategies
- When flywheel model is not yet validated, mark strategy recommendations as "pending flywheel validation" to avoid over-investment
- When Quick Wins conflict with long-term investment, prioritize Quick Wins but preserve the long-term investment path
- Decision points requiring human confirmation: growth model determination, core bottleneck confirmation, resource allocation ratio, roadmap priority

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| No growth model diagnosis | Infer growth model from stage plans, mark "model to be confirmed" | Growth model is inferred conclusion, needs subsequent validation |
| Only partial stage plans available | Cover only stages with available data, mark missing stages as "to be supplemented" | Report coverage incomplete, no strategy recommendations for missing stages |
| No upstream input at all | Generate growth strategy framework based on user-provided product info, mark "needs data validation" | Report is framework-level, all conclusions need data validation |
- If user has not provided business goals, prompt user to provide or skip steps related to that input

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| growth-model | Growth model or bottleneck change | Growth model assessment and leverage strategies | Re-evaluate model, adjust strategy priority |
| acquisition-* / activation-* / retention-* / revenue-* | Optimization plan update | AARRR funnel diagnosis and strategy integration | Update corresponding funnel stage data and strategies |
| User provided - business goals | Target or budget change | Leverage strategies and execution roadmap | Re-rank strategy priority, adjust roadmap |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| growth-orchestrator | Report generation complete | Output file update | Report completion status and key conclusions |
| User | Report generation complete | Output file | Complete growth strategy report |
