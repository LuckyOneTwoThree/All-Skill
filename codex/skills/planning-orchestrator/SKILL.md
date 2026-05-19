---
name: planning-orchestrator
description: "Use when initiating a product project, strategic planning, or roadmap creation. Orchestrates product proposal, strategic analysis (SWOT/Ansoff/Porter's Five Forces), OKR, north star metric, and roadmap sub-Skills. Keywords: product initiation, strategic planning, SWOT, OKR, roadmap, strategic analysis, goal setting, product planning, annual planning."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Strategic Planning & Roadmap"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me initiate a product project"
    - "Create a strategic plan"
    - "Set OKR goals"
    - "Plan a product roadmap"
    - "Do a SWOT analysis"
---

# Strategic Planning & Roadmap Orchestrator

## Core Principles

Ensure doing the right things, not doing things right.

1. **Strategic alignment cascaded** -- From vision to OKR to roadmap, ensure each level of objectives is traceable to the strategic intent of the level above
2. **Resource constraints upfront** -- Introduce resource boundary conditions at the planning stage to avoid producing idealized roadmaps that cannot be implemented
3. **Decision points not deferred** -- Strategic choices at each stage must be completed in the current stage; passing items downstream as "TBD" is prohibited

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline Definition

```yaml
pipeline: planning-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/planning-orchestrator.md

stages:
  - id: phase-1
    name: "Product Proposal"
    skills: [product-proposal]
    gate:
      condition: "Proposal human-approved"
      fail_action: "Supplement data and resubmit"

  - id: phase-2
    name: "Strategic Analysis"
    depends_on: [phase-1]
    skills: [strategic-analysis]
    gate:
      condition: "strategic-analysis.json generated, strategic conclusions integrated, human decision items confirmed"
      fail_action: "Items with confidence < 0.6 escalated for human calibration; strategic direction requires human selection"

  - id: phase-3
    name: "North Star Metric"
    depends_on: [phase-2]
    skills:
      - planning-north-star
    gate:
      condition: "North star metric human-selected"
      fail_action: "North star must be a human decision"

  - id: phase-3b
    name: "OKR Setting"
    depends_on: [phase-3]
    skills:
      - planning-okr
    gate:
      condition: "OKR human-confirmed"
      fail_action: "OKR achievement probability < 0.3 escalated for adjustment"

  - id: phase-4
    name: "Roadmap"
    depends_on: [phase-3b]
    skills:
      - planning-roadmap
    gate:
      condition: "Roadmap resources human-approved"
      fail_action: "Priorities and resource allocation must be human decisions"
```

## Stage Execution Plan

### Stage 1: product-proposal

- **Skill**: product-proposal
- **Input**:
  - competitor_analysis: Competitor analysis report (from market-competitor-analysis -> competitor-analysis.md)
  - tam_som: Market size data (from market-tam-som -> tam-som.json)
  - user_research_report: User research report (from user-research-report -> user-research-report.md)
  - opportunity_definition: Opportunity definition (from opportunity-definition -> opportunity-definition.json)
  - positioning_strategy: Positioning strategy (from output/pm-strategy/positioning-strategy/positioning-strategy.json)
  - product_name_category: Product name and category (user provided)
  - business_goal: Business goal (user provided)
  - resource_constraints: Resource constraints (optional, user provided)
- **Output**: `output/pm-strategy/product-proposal/` (product-proposal.md + product-proposal.json)
- **Validation**: Proposal human-approved
- **Execution Mode**: AI->Human AI recommends, human approves
- **Gate**: Proposal human-approved -> Failed: Supplement data and resubmit

### Stage 2: strategic-analysis

- **Skill**: strategic-analysis
- **Input**:
  - exploration_output: Exploration phase output (from user-research-user-modeling / opportunity-definition)
  - competitor_analysis: Competitor analysis data (from market-competitor-analysis -> competitor-analysis.json)
  - bmc: BMC business model canvas (from output/pm-strategy/business-model-canvas/bmc.json, optional)
  - market_data: Market data (from market-tam-som -> tam-som.json, optional)
  - industry_info: Industry information (from market-pest -> pest.json, optional)
  - internal_capability: Internal capability assessment (optional, user provided)
  - product_definition: Current product definition (optional, user provided)
  - market_definition: Current market definition (optional, user provided)
  - growth_goal: Growth goal (optional, from planning-okr -> okr.json)
- **Output**: `output/pm-strategy/strategic-analysis/` (strategic-analysis.json + strategic-analysis.md)
- **Validation**: strategic-analysis.json generated, framework selection reasonable, each selected framework analysis complete, strategic conclusions integrated, human decision items confirmed
- **Execution Mode**: AI->Human AI recommends, human approves
- **Gate**: Strategic conclusions integrated, human decision items confirmed -> Failed: Items with confidence < 0.6 escalated for human calibration; strategic direction requires human selection

### Stage 3: Goal Setting (planning-north-star -> planning-okr)

This stage executes two sub-Skills sequentially: first invoke planning-north-star to generate north star metric candidates, after human selection, then invoke planning-okr to generate OKR candidates based on the north star metric, for human confirmation.

#### Step 1: planning-north-star

- **Skill**: planning-north-star
- **Input**:
  - user_value_data: User value data (from user-research-user-modeling / user-research-voice-analysis)
  - bmc: BMC business model canvas (from output/pm-strategy/business-model-canvas/bmc.json)
  - business_status: Business status data (optional, user provided)
- **Output**: `output/pm-strategy/planning-north-star/` (north_star.json)
- **Validation**: North star metric human-selected
- **Execution Mode**: Human->AI Human executes, AI assists
- **Gate**: North star metric human-selected -> Failed: Must be human decision; AI only provides analytical support

#### Step 2: planning-okr

- **Skill**: planning-okr
- **Input**:
  - swot_strategy: SWOT strategic directions (from stage 2 `output/pm-strategy/strategic-analysis/strategic-analysis.json` swot.strategies)
  - north_star: North star metric (from stage 3 step 1 `output/pm-strategy/planning-north-star/north_star.json`)
  - bmc: BMC business model canvas (optional, from output/pm-strategy/business-model-canvas/bmc.json)
  - business_status: Business status data (optional, user provided)
- **Output**: `output/pm-strategy/planning-okr/` (okr.json)
- **Validation**: OKR human-confirmed
- **Execution Mode**: AI->Human AI recommends, human approves
- **Gate**: OKR human-confirmed -> Failed: Achievement probability < 0.3 escalated for adjustment; > 0.9 escalated to increase challenge

### Stage 4: planning-roadmap

- **Skill**: planning-roadmap
- **Input**:
  - okr: OKR objectives and key results (from stage 3 `output/pm-strategy/planning-okr/okr.json`)
  - swot_strategy: SWOT strategic directions (from stage 2 `output/pm-strategy/strategic-analysis/strategic-analysis.json` swot.strategies)
  - priority_score: Requirement priority scoring (optional, overridden by design-prd)
  - resource_constraints: Resource constraints (optional, user provided)
- **Output**: `output/pm-strategy/planning-roadmap/` (roadmap.json)
- **Validation**: Roadmap resources human-approved
- **Execution Mode**: AI->Human AI recommends, human approves
- **Gate**: Roadmap resources human-approved -> Failed: Priorities and resource allocation must be human decisions

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-strategy/ |
| Summary output path | output/phase-reports/pm-strategy/planning-orchestrator.md |

Next Steps:
  primary: design-orchestrator (strategic planning complete, transform strategy into PRD and design plans)
  alternatives:
    - target: metrics-orchestrator
      reason: Need to design measurement system before entering design
      condition: When key results in OKR lack quantifiable metric support
    - target: project-planning-orchestrator
      reason: Roadmap ready, directly start project planning
      condition: When strategic planning is sufficient and need to quickly enter project execution
  special_cases: []

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| Product proposal approved | Proposal human-approved | Supplement data and resubmit |
| Strategic analysis complete | strategic-analysis.json generated and non-empty | Items with confidence < 0.6 escalated for human calibration; strategic direction requires human selection |
| Goal setting complete | North star metric human-selected, OKR human-confirmed | North star must be human decision; OKR achievement probability < 0.3 escalated for adjustment |
| Roadmap complete | Roadmap resources human-approved | Priorities and resource allocation must be human decisions |
| Stage summary generated | output/phase-reports/pm-strategy/planning-orchestrator.md generated and all 6 structure items non-empty | Supplement missing structure items and regenerate |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Stage 1 sub-Skill failure | Pause orchestration, output failure diagnostics, request human intervention for repair and retry of that stage |
| strategic-analysis framework selection error | Default to SWOT framework execution, annotate "framework selection degraded to SWOT" |
| strategic-analysis framework analysis failure | Skip failed framework, generate strategic conclusions based on completed frameworks, annotate "XX framework analysis missing" |
| Upstream data missing | Annotate missing data items, fill with reasonable assumptions (annotate confidence <= 0.3), continue execution and highlight annotations in output |
| Key decision point not human-confirmed | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| All upstream data missing | Annotate "all data missing" status, output minimal template (metadata and empty structure only), set overall confidence to 0.3, force human confirmation on whether to continue. After human confirmation, generate based on user-provided info and AI knowledge base inference, all inferred content annotated confidence <= 0.5 and needs_human_validation: true |
| Stage summary generation failure | Generate partial summary based on completed sub-Skill output, mark missing items as "data missing", do not block orchestration completion |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Product initiation approval | Stage 1 product-proposal generates product proposal | Human decides whether to initiate the project |
| Strategic direction selection | Stage 2 strategic-analysis generates strategic conclusions | Human selects final strategic direction and growth path |
| Goal setting confirmation | Stage 3 planning-north-star generates north star candidates for human selection, planning-okr generates OKR candidates for human confirmation | Human selects north star metric and confirms OKR |
| Roadmap priorities | Stage 4 planning-roadmap calculates RICE scores and ranks | Human decides final priorities and resource allocation |

## Changelog

- v1.0: Initial version
