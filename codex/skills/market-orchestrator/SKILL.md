---
name: market-orchestrator
description: "Use when a complete market and competitor analysis workflow is needed. Orchestrates market-tam-som/pest/competitor-analysis. Keywords: market analysis, competitor analysis, TAM/SAM/SOM, PEST, competitive intelligence, four-quadrant, market size, industry analysis, competitors, competitive research."
metadata:
  module: "Product Exploration & Discovery"
  sub-module: "Market & Competition"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me analyze the market"
    - "See what competitors are doing"
    - "Evaluate market size"
    - "Do a competitive research"
    - "Analyze industry trends"
---

# Market & Competition Orchestrator

## Core Principles

1. **Markets are dynamic ecosystems** -- Markets are not static arenas; competitors flow, users migrate, technology evolves. The orchestrator ensures analysis results are annotated with timeliness and recommends re-evaluation cycles
2. **Macro-micro cross-validation** -- TAM/PEST provide macro perspective, competitor-analysis provides micro perspective. Conclusions must integrate both; single-perspective conclusions are unreliable
3. **Parallel collection, serial integration** -- TAM and PEST can be collected in parallel; competitor-analysis depends on macro input, dependent steps must be serial
4. **Human verification at key nodes** -- Human judgment when TAM dual-path difference > 20%; human verification when competitor strategy inference has low confidence; human confirmation of differentiation strategy priority

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline Definition

```yaml
pipeline: market-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-discovery/market-orchestrator.md

stages:
  - id: phase-1
    name: "Parallel Collection"
    skills:
      - market-tam-som
      - market-pest
    gate:
      condition: "tam-som.json + pest.json both generated and validated"
      fail_action: "Supplement category keywords and target market info or check sub-Skill execution results"

  - id: phase-2
    name: "Competitor Analysis"
    depends_on: [phase-1]
    skills: [market-competitor-analysis]
    gate:
      condition: "Executive summary contains 3 core findings + Top 1 strategy, four-quadrant populated, Feature Matrix updated"
      fail_action: "Check if competitor list is sufficient or if upstream data is complete"
```

## Stage Execution Plan

### Stage 1: Parallel Collection

#### Invoke market-tam-som

```
Invoke: ${market-tam-som}
Input:
  category_keywords: User provided (category keywords)
  target_market: User provided (target market geographic scope)
  time_range: User provided (estimation time range)
Output: output/pm-discovery/market-tam-som/tam-som.json
Validation: tam/sam/som three-tier estimation complete, each tier includes range estimates (optimistic/neutral/conservative), key assumptions annotated
Mode: AI->Human
```

#### Invoke market-pest

```
Invoke: ${market-pest}
Input:
  category_keywords: User provided (category keywords)
  target_market: User provided (target market)
Output: output/pm-discovery/market-pest/pest.json
Validation: political/economic/social/technological four dimensions all scanned, at least 3 trend summaries per dimension
Mode: AI
```

[GATE] **Stage Gate**: tam-som.json + pest.json both generated and validated -> Failed: Supplement category keywords and target market info or check sub-Skill execution results

### Stage 2: Competitor Analysis

#### Invoke market-competitor-analysis

```
Invoke: ${market-competitor-analysis}
Input:
  competitor_list: User provided (competitor list)
  category_keywords: User provided (category keywords)
  monitor_config: User provided (monitoring config, optional)
  tam_som_ref: output/pm-discovery/market-tam-som/tam-som.json (optional)
  pest_ref: output/pm-discovery/market-pest/pest.json (optional)
  product_info: User provided (own product info, optional)
Output: output/pm-discovery/market-competitor-analysis/competitor-analysis.json + output/pm-discovery/market-competitor-analysis/competitor-analysis.md
Validation: Executive summary contains 3 core findings + Top 1 strategy, four-quadrant populated, Feature Matrix updated, at least 3 differentiation strategies
Mode: AI->Human
```

[GATE] **Stage Gate**: Executive summary contains 3 core findings + Top 1 strategy, four-quadrant populated, Feature Matrix updated -> Failed: Check if competitor list is sufficient or if upstream data is complete

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-discovery/ |
| Summary output path | output/phase-reports/pm-discovery/market-orchestrator.md |

Next Steps:
  primary: opportunity-orchestrator (market analysis complete, define product opportunities based on market size and competitive landscape)
  alternatives:
    - target: insight-orchestrator
      reason: Market data lacks user perspective, need user insight supplement
      condition: When market analysis conclusions lack user need validation
    - target: positioning-orchestrator
      reason: Market landscape is clear, proceed directly to positioning strategy
      condition: When competitor analysis is sufficient and differentiation positioning is needed
  special_cases:
    - target: market-competitor-analysis
      reason: Only need competitor intelligence update, no need for full market analysis
      condition: When market size has been assessed and only competitor dynamic tracking is needed

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| Stage 1 complete | tam-som.json + pest.json both generated and non-empty | Supplement category keywords and target market info or check sub-Skill execution results |
| Stage 2 complete | competitor-analysis.json + competitor-analysis.md both generated and non-empty | Check if competitor list is sufficient or if upstream data is complete |
| Stage summary generated | output/phase-reports/pm-discovery/market-orchestrator.md generated and all 6 structure items non-empty | Supplement missing structure items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| TAM/SAM/SOM key assumption validation | market-tam-som complete | Confirm key assumptions are reasonable; human judgment required when dual-path difference > 20% |
| Competitor strategy inference validation | market-competitor-analysis complete, strategy inference confidence < 0.5 | Confirm competitor strategy direction inference is reasonable |
| Differentiation strategy priority confirmation | market-competitor-analysis complete | Confirm differentiation strategy priority ranking and resource allocation |
| Report conclusions and action recommendations approval | market-competitor-analysis complete | Approve final conclusions and action recommendations of competitor analysis report |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Stage 1 sub-Skill failure | Do not block the other sub-Skill; failed sub-Skill continues with degradation plan, annotated as "degraded execution" |
| tam-som.json dual-path difference > 30% | Annotate "severe dual-path divergence", escalate to human judgment, use neutral values in report |
| pest.json dimension data completely missing | Fill with industry benchmark values, annotate as "inferred value", mark dimension data incomplete in report |
| competitor-analysis competitor list empty | Prompt user to provide competitor list or category keywords; infer competitors based on AI knowledge, annotate "competitor list is AI-inferred" |
| competitor-analysis quadrant empty | Annotate "no competitors identified in this quadrant", suggest human provide clues, mark quadrant coverage incomplete in report |
| All upstream data missing | Degrade to lightweight flow: user provides category keywords -> generate brief competitor analysis report based on AI knowledge base |
| Stage summary generation failure | Generate partial summary based on completed sub-Skill output, mark missing items as "data missing", do not block orchestration completion |

## Changelog

- v1.0: Initial version
