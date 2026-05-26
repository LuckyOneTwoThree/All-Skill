---
name: insight-orchestrator
description: "Use when a complete requirements analysis workflow is needed. Orchestrates insight-analysis for JTBD, requirement layering, 5Whys, KANO classification, and priority scoring. Keywords: requirements analysis, insight orchestration, priority workflow, JTBD, 5Whys, KANO, priority scoring, analyze requirements, uncover requirements, user needs, requirement ranking."
metadata:
  module: "Product Exploration & Discovery"
  sub-module: "Requirement Insight"
  type: "orchestrator"
  version: "9.0"
  trigger_examples:
    - "Help me analyze user requirements"
    - "Too many requirements, help me prioritize them"
    - "Analyze requirements using the KANO model"
    - "Uncover deep user needs"
---

# Requirement Insight Orchestrator

## Core Principles

1. **Requirements != Problems** -- Users describe solutions, not the problems themselves. The orchestrator ensures decomposition (requirement-layers) precedes analysis (jtbd/5whys), avoiding staying at surface-level requirements
2. **Multi-dimensional cross-validation** -- JTBD + Requirement Three Layers + 5Whys + KANO four-dimensional cross-validation; single-dimension conclusions are unreliable. The orchestrator ensures all dimension data converges before outputting final priorities
3. **Serial dependency, parallel independence** -- Steps with data dependencies are serial (5whys depends on jtbd), independent steps are parallel (jtbd and requirement-layers can be parallel), shortening overall cycle
4. **Human decisions are irreplaceable** -- Emotional appeal validation, KANO boundary judgment, and priority weight confirmation require human participation. The orchestrator sets human decision points at every stage gate

## Orchestrator Positioning Statement

This orchestrator's current Pipeline contains only 1 sub-Skill (insight-analysis), making it a degenerate orchestrator after merge simplification. Reasons for retaining this orchestrator:

1. **Unified entry point**: Provides a standardized call entry for the requirement insight sub-module. Upper-level orchestrators (e.g., product-launch-orchestrator) do not need to know the internal sub-Skill merge history
2. **Stage summary**: Forces generation of a stage summary document (post_pipeline), ensuring sub-module output is auditable and traceable
3. **Exception handling**: Provides unified exception handling strategy and degradation plans. Sub-Skill degradation strategies do not override orchestrator-level exception interception
4. **Human decision points**: Provides human decision gates before and after sub-Skill execution, ensuring critical conclusions are human-confirmed before passing downstream

If this sub-module needs to expand into a multi-stage Pipeline in the future, this orchestrator can add stages directly without modifying upper-level orchestrator call patterns.

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

This orchestrator is a passthrough orchestrator, responsible for providing a unified entry point, stage summary, and exception handling. Upper-level orchestrators (e.g., product-launch-orchestrator) can directly call the insight-analysis sub-Skill without going through this orchestrator.

## Pipeline Definition

```yaml
pipeline: insight-orchestrator
version: 9.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-discovery/insight-orchestrator.md

stages:
  - id: phase-1
    name: "Requirement Insight Analysis"
    skills: [insight-analysis]
    gate:
      condition: "insight-analysis output file has been generated"
      fail_action: "Handle per sub-Skill failure reason; escalate to human if necessary"
```

## Stage Execution Plan

### Stage 1: Requirement Insight Analysis

#### Invoke insight-analysis

```
Invoke: ${insight-analysis}
Input:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
  requirements: User provided or output/pm-discovery/user-research-voice-analysis/voice-analysis.json (optional)
Output: output/pm-discovery/insight-analysis/insight-analysis.json
Validation:
  - Output file has been generated and content is complete
Mode: AI->Human (priority weights require human confirmation)
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-discovery/insight-analysis/ |
| Summary output path | output/phase-reports/pm-discovery/insight-orchestrator.md |

Next Steps:
  primary: opportunity-orchestrator (insight analysis complete, transform insights into actionable opportunities)
  alternatives:
    - target: market-orchestrator
      reason: Insight conclusions lack market data validation, need supplementary market analysis
      condition: When market data citation rate in insights < 30% or key assumptions lack market validation
    - target: user-research-orchestrator
      reason: Insight depth is insufficient, need more user research support
      condition: When insight sample size is insufficient or user personas are unclear
  special_cases:
    - target: insight-analysis
      reason: Only need to supplement specific dimensions of requirement insight, no need for full orchestration flow
      condition: When existing insight baseline exists and only incremental update is needed

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| Output file generated | insight-analysis.json has been generated | Handle per sub-Skill failure reason; escalate to human if necessary |
| Stage summary generated | output/phase-reports/pm-discovery/insight-orchestrator.md has been generated and all 6 structure items are non-empty | Supplement missing structure items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| KANO boundary judgment | insight-analysis KANO classification complete | Confirm classification assignment for boundary cases |
| Priority weight confirmation | insight-analysis priority scoring complete | Confirm scoring weights and final priority ranking |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Sub-Skill execution failure | Handle per sub-Skill internal degradation strategy; pause at orchestrator level and escalate to human |
| All upstream data missing | Degrade to lightweight flow: user describes requirements -> invoke insight-analysis for decomposition -> score based on description |
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
| PRD | pm-design related orchestrator | PRD is the business basis for insight-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (insight-analysis...) produce domain-specific outputs |

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
