---
name: revenue-orchestrator
description: "Use when optimizing payment conversion or increasing revenue. Monetization orchestrator dispatching revenue-funnel (payment funnel analysis), revenue-nrr (NRR tracking & alerting), revenue-upsell (upgrade conversion), achieving closed loop from payment funnel analysis to upsell strategy. Keywords: monetization, payment funnel, NRR, upsell strategy, revenue optimization, revenue-funnel, revenue-nrr, revenue-upsell, monetize, payment conversion."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Monetization"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Optimize payment conversion rate"
    - "Increase product revenue"
    - "Analyze payment funnel"
    - "Design upsell strategy"
    - "Improve NRR"
---

# Monetization Orchestrator

## Core Principles

**Monetization is a win-win for user value and business value**

Good monetization is not extracting value from users, but receiving fair returns while creating more value for users. Users are willing to pay because the product makes their lives or work better, not because they were designed into payment traps.

## Orchestration Philosophy

1. **Funnel diagnosis sets direction, NRR tracking monitors health, upsell conversion captures opportunities**: Three stages from diagnosis to monitoring to action form a complete monetization closed loop
2. **Data flows progressively from funnel to NRR to upsell**: Prior stage output directly drives subsequent stage strategy formulation

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: revenue-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/revenue-orchestrator.md

stages:
  - id: phase-1
    name: "Payment Funnel"
    depends_on: []
    skills: [revenue-funnel]
    gate:
      condition: "Registration-to-payment full-chain conversion analysis complete, bottlenecks identified"
      fail_action: "Supplement funnel step definitions or data"

  - id: phase-2
    name: "NRR Tracking"
    depends_on: [phase-1]
    skills: [revenue-nrr]
    gate:
      condition: "NRR calculation and trend tracking running normally, churn warnings and expansion opportunities identified"
      fail_action: "Improve revenue data collection"

  - id: phase-3
    name: "Upgrade Conversion"
    depends_on: [phase-2]
    skills: [revenue-upsell]
    gate:
      condition: "Upgrade conversion strategy and personalized plans generated"
      fail_action: "Optimize upgrade signal identification or supplement user behavior data"
```

## Stage Execution Plan

#### Invoke revenue-funnel

```
Invoke: ${revenue-funnel}
Input:
  payment_funnel_data: provided by user (registration-to-payment full-chain data)
  conversion_data: revenue-nrr -> nrr_analysis.json (optional)
  user_profile_data: provided by user (optional)
Output: output/pm-growth/revenue-funnel/
Validation: Payment funnel covers registration to repurchase full chain; barrier identification distinguishes qualitative and quantitative analysis; optimization recommendations sorted by impact coefficient x implementation difficulty; paywall timing recommendations based on user behavior data
Mode: AI->Human
```

#### Invoke revenue-nrr

```
Invoke: ${revenue-nrr}
Input:
  revenue_data: provided by user (revenue data)
  user_account_data: provided by user
  user_behavior_data: provided by user (optional)
Output: output/pm-growth/revenue-nrr/
Validation: NRR calculation includes expansion, contraction, and churn components; churn warning covers activity, feature, financial, and organizational 4 signal types; expansion opportunity identification has scoring and recommended strategies; dimensional NRR calculation covers user segments and product lines
Mode: AI->Human
```

#### Invoke revenue-upsell

```
Invoke: ${revenue-upsell}
Input:
  user_behavior_data: provided by user
  payment_history: output/pm-growth/revenue-nrr/nrr_analysis.json
  product_usage_data: provided by user (optional)
Output: output/pm-growth/revenue-upsell/
Validation: Upgrade signal identification covers 4 signal types (usage/feature/behavior/intent); personalized content includes username, usage, and benefits 3 elements; A/B test design includes guardrail metrics; upgrade ROI calculation includes outreach costs
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-growth/ |
| Summary output path | output/phase-reports/pm-growth/revenue-orchestrator.md |

Downstream connections:
  primary: growth-orchestrator (monetization optimization complete, return to growth diagnosis to evaluate overall growth flywheel effectiveness)
  alternatives:
    - target: experiment-orchestrator
      reason: Monetization plan needs A/B testing validation
      condition: Pricing or paywall strategy changes need quantitative verification
    - target: metrics-orchestrator
      reason: Monetization metrics need supplemental metrics design
      condition: Payment funnel key metrics lack tracking support
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Payment funnel analysis complete | revenue-funnel output file generated and non-empty | Supplement funnel step definitions or data |
| NRR tracking established | revenue-nrr output file generated and non-empty | Improve revenue data collection |
| Upgrade conversion strategy generated | revenue-upgrade output file generated and non-empty | Optimize upgrade signal identification or supplement user behavior data |
| Stage summary generated | output/phase-reports/pm-growth/revenue-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Pricing strategy confirmation | Payment funnel analysis and NRR tracking complete | Confirm pricing adjustments, upgrade plans, and resource allocation strategy |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Severe payment funnel data deficiency (cannot construct complete funnel) | Build partial funnel based on available data, mark missing stages as "to be supplemented", human confirmation required to continue |
| NRR calculation anomaly (NRR < 80% or > 150%) | Mark data anomaly warning, suggest manual verification of revenue data scope before recalculating |
| No valid upgrade signal candidates | Relax signal thresholds and re-search; if still no results, infer upgrade scenarios based on product features, mark "pending data validation" |
| Sub-Skill output validation not passed | Roll back to current stage and re-execute, max 1 retry; if still fails, mark as exception and escalate to human |
| Upstream/downstream data format incompatible | Map fields per downstream sub-Skill input Schema and fill default values, record mapping relationships |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestration completion |
