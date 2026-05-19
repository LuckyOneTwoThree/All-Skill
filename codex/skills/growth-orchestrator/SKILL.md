---
name: growth-orchestrator
description: "Use when formulating growth strategies or systematically driving growth. Growth strategy orchestrator diagnoses growth model first, then dispatches acquisition/activation/retention/revenue sub-orchestrators as needed. Keywords: growth strategy, growth model, AARRR, growth flywheel, growth system, user growth, growth bottleneck, growth diagnosis."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Growth Model"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me formulate a growth strategy"
    - "User growth has hit a bottleneck"
    - "Diagnose growth issues"
    - "Build a growth system"
---

# Growth Strategy Orchestrator

## Core Principles

**Diagnose the model first, then dispatch for execution**

Growth is not blindly stacking channels; it is first understanding which growth model fits the product, then precisely investing resources in the highest-leverage areas. The growth model determines the strategy combination for acquisition, activation, retention, and monetization.

## Orchestration Philosophy

1. **Model first**: Diagnose the growth model (PLG/SLG/MLG/Hybrid) first, then determine strategies for each stage
2. **Leverage priority**: Identify the current highest-leverage stage based on the flywheel model, concentrate resources for breakthrough
3. **Data-driven attribution**: Full-chain attribution from growth model to each stage, quantifying each action's contribution
4. **Closed-loop iteration**: Growth strategies continuously validated and iterated through data

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: growth-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/growth-orchestrator.md

stages:
  - id: phase-1
    name: "Growth Model Diagnosis"
    depends_on: []
    skills: [growth-model]
    gate:
      condition: "Growth model determined, flywheel model constructed"
      fail_action: "Supplement product features and user data"

  - id: phase-2
    name: "Acquisition Optimization"
    depends_on: [phase-1]
    skills: [acquisition-orchestrator]
    trigger: Acquisition is the bottleneck
    gate:
      condition: "Channel evaluation complete and funnel optimization plan generated"
      fail_action: "Supplement missing channel data or extend analysis period"

  - id: phase-3
    name: "Activation Optimization"
    depends_on: [phase-1]
    skills: [activation-orchestrator]
    trigger: Activation is the bottleneck
    gate:
      condition: "Aha Moment candidates identified and Onboarding strategy generated"
      fail_action: "Expand behavior search scope or supplement segment data"

  - id: phase-4
    name: "Retention Optimization"
    depends_on: [phase-1]
    skills: [retention-orchestrator]
    trigger: Retention is the bottleneck
    gate:
      condition: "Churn prediction model constructed and user segmentation complete"
      fail_action: "Optimize model or supplement training data"

  - id: phase-5
    name: "Monetization Optimization"
    depends_on: [phase-1]
    skills: [revenue-orchestrator]
    trigger: Monetization is the bottleneck
    gate:
      condition: "Payment funnel analysis complete and NRR tracking established"
      fail_action: "Supplement funnel step definitions or data"

  - id: phase-6
    name: "Growth Strategy Report"
    depends_on: [phase-1, phase-2, phase-3, phase-4, phase-5]
    skills: [growth-strategy-report]
    gate:
      condition: "Growth strategy report confirmed by human"
      fail_action: "Adjust strategy direction and execution roadmap"

  - id: phase-7
    name: "GTM Strategy"
    depends_on: [phase-1]
    skills: [gtm-strategy]
    trigger: New product launch / market expansion
    gate:
      condition: "GTM strategy confirmed by human"
      fail_action: "Confirm launch path and channel strategy"

  - id: phase-8
    name: "Operations Manual"
    depends_on: [phase-1]
    skills: [product-operations-manual]
    trigger: Operations manual creation needed
    gate:
      condition: "Operations manual confirmed by human"
      fail_action: "Confirm operations SOP and emergency procedures"
```

## Stage Execution Plan

### Stage 1: Growth Model Diagnosis

#### Invoke growth-model

```
Invoke: ${growth-model}
Input:
  product_features: provided by user (product characteristics)
  user_data: analysis-retention -> retention_analysis.json
  business_model: provided by user (business model)
Output: output/pm-growth/growth-model/
Validation: North Star metric directly linked to >= 1 OKR Objective; growth model contains >= 3 quantifiable variables; growth flywheel contains >= 4 nodes forming a closed loop; bottleneck constraints identified <= 5, each with quantified impact assessment
Mode: AI->Human
```

### Stage 2: Bottleneck Stage Optimization (Conditional Branches)

Based on the bottleneck stages diagnosed in Stage 1, dispatch the corresponding sub-orchestrators.

#### Invoke acquisition-orchestrator

```
Invoke: ${acquisition-orchestrator}
Input:
  growth_model: output/pm-growth/growth-model/
  channel_data: provided by user
  funnel_data: provided by user
Output: output/pm-growth/acquisition-analysis/
Validation: Channel evaluation covers 19 channel types; acquisition funnel conversion analysis at each level complete, optimization recommendations output
Mode: AI->Human
```

#### Invoke activation-orchestrator

```
Invoke: ${activation-orchestrator}
Input:
  growth_model: output/pm-growth/growth-model/
  user_behavior_data: provided by user
  retention_data: analysis-retention -> retention_analysis.json
Output: output/pm-growth/activation-aha/, output/pm-growth/activation-onboarding/
Validation: Aha Moment candidates identified; Onboarding strategy generated
Mode: AI->Human
```

#### Invoke retention-orchestrator

```
Invoke: ${retention-orchestrator}
Input:
  growth_model: output/pm-growth/growth-model/
  user_behavior_data: provided by user
  churn_history: provided by user (churn history data)
Output: output/pm-growth/retention-management/
Validation: Churn prediction model constructed; user segmentation complete
Mode: AI->Human
```

#### Invoke revenue-orchestrator

```
Invoke: ${revenue-orchestrator}
Input:
  growth_model: output/pm-growth/growth-model/
  payment_funnel_data: provided by user (payment funnel data)
  revenue_data: provided by user (revenue data)
Output: output/pm-growth/revenue-funnel/, output/pm-growth/revenue-nrr/, output/pm-growth/revenue-upsell/
Validation: Payment funnel analysis complete; NRR tracking established
Mode: AI->Human
```

> **Multiple bottleneck scenario**: If multiple stages are bottlenecks, dispatch sub-orchestrators sequentially in flywheel order (acquisition -> activation -> retention -> monetization).

### Stage 3: Growth Strategy Report

#### Invoke growth-strategy-report

```
Invoke: ${growth-strategy-report}
Input:
  growth_model: output/pm-growth/growth-model/
  acquisition_plan: output/pm-growth/acquisition-analysis/ (optional)
  activation_plan: output/pm-growth/activation-aha/ (optional)
  retention_plan: output/pm-growth/retention-management/ (optional)
  revenue_plan: output/pm-growth/revenue-funnel/ (optional)
  business_goal: provided by user (optional)
Output: output/pm-growth/growth-strategy-report/
Validation: Flywheel model completeness (at least 3 nodes + 2 causal relationships); strategy consistent with bottlenecks; roadmap executable; funnel data complete (AARRR at least 3 stages with data)
Mode: AI->Human
```

### Additional Stages (Triggered on Demand)

#### Invoke gtm-strategy

```
Invoke: ${gtm-strategy}
Input:
  positioning: positioning-strategy (optional)
  business_model: business-model-canvas (optional)
  pricing: business-pricing (optional)
  growth_model: output/pm-growth/growth-model/
  product_info: provided by user
Output: output/pm-growth/gtm-strategy/
Validation: ICP profile specific (at least includes industry, size, role dimensions); launch path evidence-based; channel budget executable; success metrics quantifiable
Mode: AI->Human
```

#### Invoke product-operations-manual

```
Invoke: ${product-operations-manual}
Input:
  growth_model: output/pm-growth/growth-model/ (optional)
  activation_strategy: output/pm-growth/activation-onboarding/ (optional)
  retention_strategy: output/pm-growth/retention-management/ (optional)
  revenue_strategy: output/pm-growth/revenue-funnel/ (optional)
  product_info: provided by user
Output: output/pm-growth/product-operations-manual/
Validation: SOP executable; segmentation strategy complete (at least covers new/active/dormant/churned 4 user types); emergency procedures actionable (P0-P3 all have response SLAs and escalation paths); templates ready to use
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-growth/ |
| Summary output path | output/phase-reports/pm-growth/growth-orchestrator.md |

Downstream connections:
  primary: acquisition-orchestrator (growth strategy formulation complete, enter acquisition optimization execution)
  alternatives:
    - target: experiment-orchestrator
      reason: Growth plan needs A/B testing to validate effectiveness
      condition: Growth plan involves major strategy changes needing quantitative verification
    - target: release-orchestrator
      reason: Growth plan already validated, direct full rollout
      condition: Growth plan has sufficient data support, no experimental verification needed
    - target: growth-orchestrator
      reason: New product needs launch, enter GTM strategy stage (internal phase-7)
      condition: Growth diagnosis conclusion indicates new product launch needed
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Growth model diagnosis complete | growth-model output file generated and non-empty | Supplement product features and user data |
| Bottleneck stage identified | growth-bottleneck output file generated and non-empty | Extend analysis period or expand data scope |
| Growth strategy report confirmed | Growth strategy report confirmed by human | Adjust strategy direction and execution roadmap |
| Stage summary generated | output/phase-reports/pm-growth/growth-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Growth model confirmation | growth-model diagnosis complete | Confirm final growth model (PLG/SLG/MLG/Hybrid) |
| Bottleneck priority confirmation | Bottleneck stage identification complete | Confirm resource allocation priorities |
| Flywheel model confirmation | Flywheel model construction complete | Confirm flywheel nodes and causal relationships |
| Growth strategy report confirmation | growth-strategy-report generation complete | Confirm strategy direction and execution roadmap |
| GTM strategy confirmation | gtm-strategy generation complete | Confirm launch path and channel strategy |
| Operations manual confirmation | product-operations-manual generation complete | Confirm operations SOP and emergency procedures |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Growth model diagnosis cannot converge (multiple models with similar scores) | Mark as hybrid model, list each model's score and evidence, human decision required |
| Sub-orchestrator execution timeout or failure | Skip that bottleneck stage, continue executing other bottleneck stages, mark "stage to be supplemented" in final report |
| Multiple bottleneck context overflow | Execute only highest-priority bottleneck in flywheel order, record remaining bottlenecks as to-dos, execute in batches |
| Sub-Skill output validation not passed | Roll back to current stage and re-execute, max 1 retry; if still fails, mark as exception and escalate to human |
| Upstream/downstream data format incompatible | Map fields per downstream sub-Skill input Schema and fill default values, record mapping relationships |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestration completion |

## Changelog

- v1.0: Initial version
- v2.0: Structure optimization
- v3.0: Added growth-strategy-report, gtm-strategy, product-operations-manual
- v4.0: Orchestrator optimization -- task scheduling changed to stage execution plan, added sub-Skill execution protocol, scheduling rules changed to execution mode, stage gates and human decision points changed to tables, conditional branch sub-orchestrator descriptions
- v5.0: Execution steps replaced with orchestration philosophy, added exception handling table
- v6.0: Orchestration protocol optimization -- changed "read sub-Skill definition and proxy execute" to "use Skill tool for explicit invocation"; added Pipeline definition (YAML declarative execution graph); stage execution plan changed to invocation instruction format; scheduling rules merged into orchestration protocol
- v7.1: Stage summary enhancement -- Pipeline added post_pipeline definition; invocation rule 6 changed to mandatory; stage execution plan added stage summary execution instruction; stage gates added stage summary validation; exception handling added stage summary generation failure strategy
- v8.0: Updated references acquisition-channel/acquisition-optimize -> acquisition-analysis; updated references retention-churn/retention-engagement -> retention-management; updated output paths
