---
name: business-orchestrator
description: "Use when designing or evaluating a product business model. Orchestrates business-model-canvas/value-fit/pricing/strategy-report. Keywords: business model, business canvas, pricing strategy, business strategy report, monetization, revenue model, charging model, business assessment."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Business Model Design"
  type: "orchestrator"
  version: "7.1"
  trigger_examples:
    - "Help me design a business model"
    - "How does the product make money"
    - "Design a pricing strategy"
    - "Evaluate if the business model is viable"
    - "Create a business canvas"
---

# Business Model Design Orchestrator

## Core Principles

Business models are validated, not designed.

1. **Validation before design** -- Business model assumptions must be verifiable; every canvas element should include validation methods and success criteria
2. **Financial closed-loop driven** -- Unit economics before scale expansion assumptions; ensure single-point profitability logic holds before projecting growth
3. **Multi-plan parallel comparison** -- Pricing and revenue models generate multiple comparable plans to avoid single-plan lock-in thinking

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: business-orchestrator
version: 7.1
stages:
  - id: phase-1
    name: "Business Model Canvas"
    skills: [business-model-canvas]
    gate:
      condition: "BMC 9 blocks all populated, assumptions annotated"
      fail_action: "Supplement missing elements; annotate unfillable ones as assumptions to validate"

  - id: phase-2
    name: "Value Fit Validation"
    depends_on: [phase-1]
    skills: [business-value-fit]
    gate:
      condition: "Value proposition fit score >= 3.0"
      fail_action: "Adjust value proposition or target users, re-validate"

  - id: phase-3
    name: "Pricing Strategy"
    depends_on: [phase-1]
    skills: [business-pricing]
    gate:
      condition: "3 pricing plans generated"
      fail_action: "Supplement pricing plans, ensure differentiation"

  - id: phase-4
    name: "Business Strategy Report"
    depends_on: [phase-1, phase-2, phase-3]
    skills: [business-strategy-report]
    gate:
      condition: "Report executive summary complete, at least 2 strategic directions"
      fail_action: "Supplement strategic directions or annotate recommendation for additional strategic analysis"

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/business-orchestrator.md
```

## Stage Execution Plan

#### Invoke business-model-canvas

```
Invoke: ${business-model-canvas}
Input:
  product_context: From user-research-user-modeling / opportunity-definition
  market_data: From market-competitor-analysis
Output: output/pm-strategy/business-model-canvas/
Validation: BMC 9 blocks all populated, assumptions annotated
Mode: AI->Human
```

#### Invoke business-value-fit

```
Invoke: ${business-value-fit}
Input:
  bmc_value_proposition: From stage 1 output/pm-strategy/business-model-canvas/bmc.json
  user_research_data: From user-research-user-modeling / user-research-voice-analysis
Output: output/pm-strategy/business-value-fit/
Validation: Value proposition fit score >= 3.0
Mode: AI
```

#### Invoke business-pricing

```
Invoke: ${business-pricing}
Input:
  bmc_data: From stage 1 output/pm-strategy/business-model-canvas/bmc.json
  competitor_pricing_data: From market-competitor-analysis -> competitor-analysis.json
  willingness_to_pay: User provided
Output: output/pm-strategy/business-pricing/
Validation: 3 pricing plans generated
Mode: AI->Human
```

#### Invoke business-strategy-report

```
Invoke: ${business-strategy-report}
Input:
  bmc: From stage 1 output/pm-strategy/business-model-canvas/bmc.json
  pricing_strategy: From stage 3 output/pm-strategy/business-pricing/pricing_analysis.json
  product_business_info: User provided
  optional_inputs: SWOT, OKR, roadmap, positioning, value curve, differentiation assessment, stakeholders, north star metric
Output: output/pm-strategy/business-strategy-report/
Validation: Report executive summary complete, at least 2 strategic directions
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-strategy/ |
| Summary output path | output/phase-reports/pm-strategy/business-orchestrator.md |

Next Steps:
  primary: positioning-orchestrator (business model design complete, determine differentiation positioning strategy)
  alternatives:
    - target: planning-orchestrator
      reason: Positioning already clear, proceed directly to strategic planning
      condition: When product positioning has been determined in business model design
    - target: design-orchestrator
      reason: Business model and positioning both determined, proceed directly to design
      condition: When business model and positioning are both complete and need to quickly move to product building
  special_cases: []

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| BMC generation complete | business-model-canvas output file generated and non-empty | Supplement missing elements; annotate unfillable ones as assumptions to validate |
| Pricing plans complete | pricing output file generated and non-empty | Supplement missing plans, ensure differentiation positioning |
| Business strategy report complete | strategy-report output file generated and non-empty | Supplement strategic directions or annotate "recommend additional strategic analysis" |
| Stage summary generated | output/phase-reports/pm-strategy/business-orchestrator.md generated and all 6 structure items non-empty | Supplement missing structure items and regenerate |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Stage 1 sub-Skill failure | Pause orchestration, output failure diagnostics, request human intervention for repair and retry of that stage |
| Upstream data missing | Annotate missing data items, fill with reasonable assumptions (annotate confidence <= 0.3), continue execution and highlight annotations in output |
| Key decision point not human-confirmed | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| All upstream data missing | Annotate "all data missing" status, output minimal template (metadata and empty structure only), set overall confidence to 0.3, force human confirmation on whether to continue. After human confirmation, generate based on user-provided info and AI knowledge base inference, all inferred content annotated confidence <= 0.5 and needs_human_validation: true |
| Stage summary generation failure | Generate partial summary based on completed sub-Skill output, mark missing items as "data missing", do not block orchestration completion |


## Standalone Usage Input Acquisition Strategy

### Standalone Trigger Scenario Identification

When this orchestrator is invoked directly (not through a parent orchestrator), it is considered a standalone trigger scenario. Typical trigger methods:
- User directly requests capabilities within this orchestrator's domain
- Triggered as an independent skill by external systems
- Parent orchestrator not executed, but user only needs this orchestrator's capability

### Required Input Acquisition Strategy

| Required Input | Priority: Read from output/ | Fallback: Get from user conversation | Last Resort: AI knowledge base inference |
|---------------|---------------------------|-------------------------------------|---------------------------------------|
| PRD (prd.md) | Read output/pm-design/design-prd/prd.md | Ask user for PRD document or verbal requirements | Infer requirements from user description (low confidence, mark "PRD is AI-inferred") |
| project_dir | — | Ask user for project directory path | Cannot infer, user must provide |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest user execute upstream orchestrators in the following priority:

| Missing Input | Suggested Upstream Orchestrator | Description |
|--------------|-------------------------------|-------------|
| PRD | pm-design related orchestrator | PRD is the business basis for business-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (business-strategy-report, business-pricing, business-value-fit...) produce domain-specific outputs |

Backtracking suggestion output format:
```
Critical input missing detected, suggest executing upstream orchestrator first:
1. [Priority] pm-design related orchestrator -> Produces PRD
Continue with AI-inferred values? (Inferred values confidence <=0.3, outputs require additional human review)
```

### Standalone Usage Gate

When triggered standalone, must pass the following additional checks before executing Pipeline:

| Gate Item | Check Content | Failure Handling |
|-----------|--------------|-----------------|
| PRD existence | prd.md or equivalent requirements document available | Block execution, suggest user provide PRD |
| project_dir validity | User provided valid project directory path | Block execution, user must provide valid project_dir |
| Input confidence assessment | All required input acquisition methods determined, overall confidence >=0.5 | When confidence <0.5, force human confirmation whether to continue execution |

Gate execution order: PRD existence -> project_dir validity -> Input confidence assessment

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Revenue model selection | Stage 1 business-model-canvas generates multiple revenue model options | Human selects final revenue model plan |
| Pricing number final decision | Stage 3 business-pricing provides pricing analysis and plans | Human decides specific pricing numbers and package structure |
| Business strategy direction confirmation | Stage 4 business-strategy-report recommends strategic directions | Human confirms final strategic choice |
