---
name: stakeholder-orchestrator
description: "Use when Stakeholder management or strategic document writing is needed. Orchestrates stakeholder-analysis. Keywords: Stakeholder alignment, strategic documents, strategic communication, stakeholders, stakeholder management, alignment communication."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Stakeholder Alignment"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me manage stakeholders"
    - "Write a strategic communication document"
    - "Do a stakeholder analysis"
    - "Align opinions across parties"
---

# Stakeholder Alignment Orchestrator

## Core Principles

Alignment is not persuasion; it is co-creation.

1. **Power-interest dual-dimension calibration** -- Stakeholder analysis must simultaneously cover power influence and interest relevance; neither can be omitted
2. **Communication strategy tailored per person** -- Communication strategy, information granularity, and expression style must be differentiated for different stakeholders; one-size-fits-all is prohibited
3. **Alignment results traceable** -- Conclusions, commitments, and objections from each alignment communication must be recorded and archived, ensuring downstream traceability

## Orchestrator Positioning Statement

This orchestrator's current Pipeline contains only 1 sub-Skill (stakeholder-analysis), making it a degenerate orchestrator after merge simplification. Reasons for retaining this orchestrator:

1. **Unified entry point**: Provides a standardized call entry for the Stakeholder alignment sub-module. Upper-level orchestrators (e.g., product-launch-orchestrator) do not need to know the internal sub-Skill merge history
2. **Stage summary**: Forces generation of a stage summary document (post_pipeline), ensuring sub-module output is auditable and traceable
3. **Exception handling**: Provides unified exception handling strategy and degradation plans. Sub-Skill degradation strategies do not override orchestrator-level exception interception
4. **Human decision points**: Provides human decision gates before and after sub-Skill execution, ensuring critical conclusions are human-confirmed before passing downstream

If this sub-module needs to expand into a multi-stage Pipeline in the future, this orchestrator can add stages directly without modifying upper-level orchestrator call patterns.

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: stakeholder-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/stakeholder-orchestrator.md

stages:
  - id: phase-1
    name: "Stakeholder Analysis"
    skills: [stakeholder-analysis]
    gate:
      condition: "Stakeholder map human-calibrated, strategic document quality check passed, brief actionability check passed"
      fail_action: "Influence assessment requires human calibration; quality check failures auto-corrected, still substandard after correction requires human review; tone and emphasis need adjustment per audience"
```

## Stage Execution Plan

### Stage 1: Stakeholder Analysis

- **Skill**: stakeholder-analysis
- **Input**:
  - bmc: Business model canvas (from output/pm-strategy/business-model-canvas/bmc.json)
  - product_info: Product/business information (user provided)
  - strategy_report: Business strategy report (from output/pm-strategy/business-strategy-report/business-strategy-report.json, optional)
  - audience_type: Audience type (user provided: executive/team/external)
- **Output**: `output/pm-strategy/stakeholder-analysis/stakeholder-analysis.json` + `output/pm-strategy/stakeholder-analysis/stakeholder-analysis.md`
- **Validation**: Stakeholder map human-calibrated, strategic document quality check passed, brief actionability check passed
- **Execution Mode**: AI->Human AI recommends, human approves
- **[GATE] Stage Gate**: Stakeholder map human-calibrated, strategic document quality check passed, brief actionability check passed -> Failed: Influence assessment requires human calibration; quality check failures auto-corrected, still substandard after correction requires human review; tone and emphasis need adjustment per audience

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-strategy/ |
| Summary output path | output/phase-reports/pm-strategy/stakeholder-orchestrator.md |

Next Steps:
  primary: planning-orchestrator (stakeholder analysis complete, ensure planning aligns with key stakeholders)
  alternatives:
    - target: project-planning-orchestrator
      reason: Already in project execution phase, directly start project planning
      condition: When strategic planning is complete and project initiation is needed
    - target: business-orchestrator
      reason: Stakeholder demands affect business model, need to backtrack and adjust
      condition: When key stakeholder demands conflict with existing business model
  special_cases: []

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| Stakeholder map complete | Stakeholder map human-calibrated | Influence assessment requires human calibration; missing stakeholders need manual addition |
| Strategic document complete | stakeholder-analysis output file generated and non-empty | Quality check failures auto-corrected, still substandard after correction requires human review and refinement |
| Strategic brief complete | stakeholder-analysis output file generated and non-empty | Tone and emphasis need adjustment per audience |
| Stage summary generated | output/phase-reports/pm-strategy/stakeholder-orchestrator.md generated and all 6 structure items non-empty | Supplement missing structure items and regenerate |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Stage 1 sub-Skill failure | Pause orchestration, output failure diagnostics, request human intervention for repair and retry of that stage |
| Upstream data missing | Annotate missing data items, fill with reasonable assumptions (annotate confidence <= 0.3), continue execution and highlight annotations in output |
| Key decision point not human-confirmed | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| All upstream data missing | Annotate "all data missing" status, output minimal template (metadata and empty structure only), set overall confidence to 0.3, force human confirmation on whether to continue. After human confirmation, generate based on user-provided info and AI knowledge base inference, all inferred content annotated confidence <= 0.5 and needs_human_validation: true |
| Stage summary generation failure | Generate partial summary based on completed sub-Skill output, mark missing items as "data missing", do not block orchestration completion |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Influence assessment calibration | Stage 1 stakeholder-analysis evaluates influence scores | Human calibrates final results involving interpersonal judgment |
| Strategic document review | Stage 1 stakeholder-analysis assembles strategic documents | Human reviews content accuracy and expression style |
