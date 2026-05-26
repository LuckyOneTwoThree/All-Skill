---
name: opportunity-orchestrator
description: "Use when a complete opportunity identification and definition workflow is needed. Orchestrates opportunity-definition for opportunity scoring, problem statements, HMW divergence, and opportunity briefs. Keywords: opportunity identification, opportunity scoring, HMW, Problem Statement, Opportunity Brief, product opportunity, opportunity assessment, problem definition."
metadata:
  module: "Product Exploration & Discovery"
  sub-module: "Opportunity Identification"
  type: "orchestrator"
  version: "8.0"
  trigger_examples:
    - "Help me evaluate this product opportunity"
    - "Identify product opportunities"
    - "Define the problem we need to solve"
    - "Generate an opportunity brief"
---

# Opportunity Identification Orchestrator

## Core Principles

1. **Good opportunities are defined, not found** -- Opportunities are not objectively existing waiting to be discovered; they are progressively defined through Problem Statement definition, HMW reframing, and scoring validation. The orchestrator ensures the definition process is complete
2. **Scoring before divergence** -- Score first to determine opportunity priority (scoring), then diverge to explore innovation space (hmw). Order must not be reversed, otherwise HMW will diverge in low-value directions
3. **Problem Statement is the anchor** -- All HMW and Briefs anchor to the Problem Statement. If Problem Statement quality does not pass, subsequent output is unreliable
4. **Human judgment at three key nodes** -- Strategic fit scoring by human; Problem Statement quality failure 3 times triggers human arbitration; Brief final decision requires human approval

## Orchestrator Positioning Statement

This orchestrator's current Pipeline contains only 1 sub-Skill (opportunity-definition), making it a degenerate orchestrator after merge simplification. Reasons for retaining this orchestrator:

1. **Unified entry point**: Provides a standardized call entry for the opportunity identification sub-module. Upper-level orchestrators (e.g., product-launch-orchestrator) do not need to know the internal sub-Skill merge history
2. **Stage summary**: Forces generation of a stage summary document (post_pipeline), ensuring sub-module output is auditable and traceable
3. **Exception handling**: Provides unified exception handling strategy and degradation plans. Sub-Skill degradation strategies do not override orchestrator-level exception interception
4. **Human decision points**: Provides human decision gates before and after sub-Skill execution, ensuring critical conclusions are human-confirmed before passing downstream

If this sub-module needs to expand into a multi-stage Pipeline in the future, this orchestrator can add stages directly without modifying upper-level orchestrator call patterns.

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline Definition

```yaml
pipeline: opportunity-orchestrator
version: 8.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-discovery/opportunity-orchestrator.md

stages:
  - id: phase-1
    name: "Opportunity Identification & Definition"
    skills: [opportunity-definition]
    gate:
      condition: "opportunity-definition.json generated, scoring complete, Problem Statement quality check passed, HMW 4-dimension coverage, Brief evidence summary complete"
      fail_action: "Handle per sub-step failure reason: missing scoring awaits human judgment, Problem Statement quality failure auto-retries 3 times then escalates to human, incomplete HMW dimensions supplement data, missing Brief supplement upstream data"
```

## Stage Execution Plan

### Stage 1: Opportunity Identification & Definition

#### Invoke opportunity-definition

```
Invoke: ${opportunity-definition}
Input:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
  tam_som: output/pm-discovery/market-tam-som/tam-som.json
  competitor_analysis: output/pm-discovery/market-competitor-analysis/competitor-analysis.json
  persona: output/pm-discovery/user-research-user-modeling/persona.json (optional)
  insight_analysis: output/pm-discovery/insight-analysis/insight-analysis.json (optional)
  tech_assessment: User provided (optional, tech team assessment)
Output: output/pm-discovery/opportunity-definition/opportunity-definition.json
Validation:
  - scoring: All 5 dimensions scored, strategic fit marked as needs_human=true, scoring rationale complete
  - problem_statement: All 5 quality checks passed (quality_check.all_passed=true), data support complete
  - hmw: All 4 dimensions covered, total 8-12 HMW statements
  - brief: Evidence summary 3 sub-fields all have content, key assumptions listed with verifiability, human decision items non-empty, opportunity scoring complete
Mode: AI->Human (strategic fit dimension Human judged by human, Brief final decision Human approved)
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-discovery/opportunity-definition/ |
| Summary output path | output/phase-reports/pm-discovery/opportunity-orchestrator.md |

Next Steps:
  primary: business-orchestrator (opportunity definition complete, transform opportunity into sustainable business model)
  alternatives:
    - target: design-orchestrator
      reason: Business model already determined, proceed directly to product design
      condition: When business model has been determined in prior stages and does not need redesign
    - target: validation-orchestrator
      reason: Opportunity assumptions carry high risk, need validation before investment
      condition: When key assumption risk level >= high in opportunity brief
  special_cases: []

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| Stage 1 complete | opportunity-definition.json generated and non-empty | Handle per sub-step failure reason |
| Strategic fit human confirmed | Human has confirmed strategic fit scoring | Wait for human to judge strategic fit |
| Opportunity Brief human confirmed | Human has approved Opportunity Brief | Wait for human to approve decision items |
| Stage summary generated | output/phase-reports/pm-discovery/opportunity-orchestrator.md generated and all 6 structure items non-empty | Supplement missing structure items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Strategic fit judgment | opportunity-definition Step 1 opportunity scoring complete | Confirm strategic fit scoring for each opportunity (AI provides analysis recommendations only; final score must be determined by human) |
| Problem Statement quality check | opportunity-definition Step 2 quality check fails 3 times | Human reviews all attempted versions and decides final Problem Statement |
| Opportunity Brief final decision | opportunity-definition Step 4 opportunity brief complete | Approve opportunity brief conclusions, key assumption validation priorities, and recommended next steps |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Opportunity scoring strategic fit not judged | Pause Brief generation, wait for human to judge strategic fit scoring; other 4 dimension scoring results can be output first |
| Problem Statement quality check fails 3 times | Escalate to human arbitration, output 3 attempted versions and comparison of failed items; human decides final Problem Statement |
| HMW dimension not covered | Annotate "dimension coverage incomplete", supplement HMW generation for that dimension based on existing Problem Statement, annotate "inferred supplement" |
| Brief upstream data largely missing | Generate Brief based on available data, mark missing fields as "data missing", degrade evidence summary and key assumption confidence, suggest human supplement data and regenerate |
| All upstream data missing | Degrade to lightweight flow: user describes problem -> generate Problem Statement based on description -> generate HMW based on Problem Statement -> output lightweight Brief, entire flow annotated as "data missing" |
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
| PRD | pm-design related orchestrator | PRD is the business basis for opportunity-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (opportunity-definition...) produce domain-specific outputs |

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
