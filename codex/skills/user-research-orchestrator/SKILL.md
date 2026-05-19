---
name: user-research-orchestrator
description: "Use when a complete user research workflow is needed. Orchestrates voice-analysis/behavior-analysis/user-modeling/interview-assist/report. Keywords: user research, VOC analysis, behavior analysis, Persona, interview assistance, user survey, user persona, user feedback, user interview."
metadata:
  module: "Product Exploration & Discovery"
  sub-module: "User Research"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me do user research"
    - "Analyze user feedback"
    - "Design a user interview"
    - "Generate user personas"
    - "Understand user behavior"
---

# User Research Orchestrator

## Core Principles

1. **What users say and do differ** -- VOC (what users say) and behavior data (what users do) must be collected in parallel and cross-validated; single-source conclusions are unreliable
2. **Models are hypotheses, not facts** -- Persona/Empathy Map/Journey Map are hypothesis models based on data; they must be human-approved before use in subsequent processes
3. **Interviews are for validation, not exploration** -- The purpose of interviews is to validate existing hypotheses (from VOC and behavior data), not aimless exploration; scripts must anchor to hypotheses to be validated
4. **Reports are endpoints and starting points** -- User research reports are the endpoint of the research phase but the starting point for product decisions; reports must include actionable recommendations

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline Definition

```yaml
pipeline: user-research-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-discovery/user-research-orchestrator.md

stages:
  - id: phase-1
    name: "Parallel Collection"
    skills:
      - user-research-voice-analysis
      - user-research-behavior-analysis
    gate:
      condition: "voice-analysis.json + behavior-analysis.json both generated and validated"
      fail_action: "Supplement user feedback data or behavior data"

  - id: phase-2
    name: "User Modeling"
    depends_on: [phase-1]
    skills:
      - user-research-user-modeling
    gate:
      condition: "persona.json has been generated"
      fail_action: "Supplement data or check sub-Skill execution results"

  - id: phase-2b
    name: "Interview Assistance"
    depends_on: [phase-2]
    skills:
      - user-research-interview-assist
    gate:
      condition: "interview-script.json has been generated"
      fail_action: "Supplement data or check sub-Skill execution results"

  - id: phase-3
    name: "Research Report"
    depends_on: [phase-1, phase-2b]
    skills: [user-research-report]
    gate:
      condition: "Executive summary contains 3 core findings + Top 1 recommendation"
      fail_action: "Supplement upstream data and regenerate report"
```

## Stage Execution Plan

### Stage 1: Parallel Collection

#### Invoke user-research-voice-analysis

```
Invoke: ${user-research-voice-analysis}
Input:
  app_reviews: User provided (app store reviews)
  support_tickets: User provided (support ticket data)
  social_mentions: User provided (optional, social media mentions)
  community_posts: User provided (optional, community posts)
  analysis_config: User provided (optional, analysis config)
Output: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
Validation: sentiment_distribution non-empty, top_themes at least 3 themes, top_pain_points extracted, confidence annotated
Mode: AI
```

#### Invoke user-research-behavior-analysis

```
Invoke: ${user-research-behavior-analysis}
Input:
  event_logs: User provided (behavior event logs)
  funnel_data: User provided (funnel data)
  heatmap_data: User provided (optional, heatmap data)
  analysis_config: User provided (optional, analysis config)
Output: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
Validation: funnel_health non-empty, aha_moment_candidates extracted, feature_usage analysis complete, confidence annotated
Mode: AI
```

[GATE] **Stage Gate**: voice-analysis.json + behavior-analysis.json both generated and validated -> Failed: Supplement user feedback data or behavior data

### Stage 2: User Modeling

#### Invoke user-research-user-modeling

```
Invoke: ${user-research-user-modeling}
Input:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
  survey_data: User provided (optional, survey data)
  modeling_config: User provided (optional, modeling config)
Output: output/pm-discovery/user-research-user-modeling/persona.json + empathy-map.json + journey-map.json
Validation: personas array non-empty, at least 1 Persona confidence >= 0.7, Empathy Map four quadrants complete, Journey Map stages complete
Mode: AI->Human
```

[GATE] **Stage Gate**: personas array non-empty, at least 1 Persona confidence >= 0.7 -> Failed: Mark modeling as insufficient, recommend supplementing data or conducting interviews

### Stage 2b: Interview Assistance

#### Invoke user-research-interview-assist

```
Invoke: ${user-research-interview-assist}
Input:
  persona: output/pm-discovery/user-research-user-modeling/persona.json (optional)
  research_objectives: User provided (research objectives)
  interview_config: User provided (interview config)
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json (optional)
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json (optional)
Output: output/pm-discovery/user-research-interview-assist/interview-script.json + interview-insights.json
Validation: interview-script.json core_modules non-empty, each core question has follow-up strategy; interview-insights.json validated_hypotheses or new_discoveries non-empty
Mode: Human->AI
```

[GATE] **Stage Gate**: interview-script.json generated, interview-insights.json generated after interview execution -> Failed: Check if research objectives and interview config are complete

### Stage 3: Research Report

#### Invoke user-research-report

```
Invoke: ${user-research-report}
Input:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json (optional)
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json (optional)
  persona: output/pm-discovery/user-research-user-modeling/persona.json (optional)
  interview_script: output/pm-discovery/user-research-interview-assist/interview-script.json (optional)
  research_objectives: User provided (research objectives)
  product_info: User provided (optional, product/category info)
Output: output/pm-discovery/user-research-report/user-research-report.md + user-research-report.json
Validation: Executive summary contains 3 core findings + Top 1 recommendation, each Persona has representative user quotes, at least 3 action recommendations with priority
Mode: AI->Human
```

[GATE] **Stage Gate**: Executive summary contains 3 core findings + Top 1 recommendation -> Failed: Supplement upstream data and regenerate report

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-discovery/ |
| Summary output path | output/phase-reports/pm-discovery/user-research-orchestrator.md |

Next Steps:
  primary: insight-orchestrator (user research complete, extract insights from research data)
  alternatives:
    - target: opportunity-orchestrator
      reason: Research conclusions are clear enough, proceed directly to opportunity definition
      condition: When user research has produced clear pain points and needs
    - target: design-orchestrator
      reason: Research conclusions can directly support product design
      condition: When user research has produced complete user personas and scenarios, and business model is determined
  special_cases:
    - target: user-research-report
      reason: Only need to generate research report, no further insight analysis needed
      condition: When research is a standalone project deliverable and does not need further analysis

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| Stage 1 complete | voice-analysis.json + behavior-analysis.json both generated and non-empty | Supplement user feedback data or behavior data |
| Stage 2 complete | persona.json generated and human-approved | Supplement data or adjust modeling parameters and re-execute |
| Stage 3 complete | interview-script.json generated and non-empty | Check if research objectives and interview config are complete |
| Interview insights extracted | interview-insights.json generated and non-empty | Wait for human to complete interview execution then extract insights |
| Stage 4 complete | user-research-report.md + user-research-report.json both generated and non-empty | Check if upstream data is complete |
| Stage summary generated | output/phase-reports/pm-discovery/user-research-orchestrator.md generated and all 6 structure items non-empty | Supplement missing structure items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Persona final confirmation | user-research-user-modeling complete | Confirm Persona portraits are accurate, correct inferred characteristics |
| Emotional/Social Job inference validation | Persona Emotional/Social Job confidence < 0.5 | Confirm emotional and social appeal inferences are reasonable |
| Interview result calibration | user-research-interview-assist complete | Calibrate consistency between interview findings and existing data, arbitrate contradictions |
| User research report conclusions and action recommendations approval | user-research-report complete | Approve final conclusions and action recommendations of user research report |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Stage 1 sub-Skill failure (voice-analysis or behavior-analysis) | Do not block the other sub-Skill; failed sub-Skill continues with degradation plan, annotated as "degraded execution" |
| voice-analysis data volume insufficient (< 500 entries) | Annotate "insufficient data", output degrades to exploratory conclusions, confidence uniformly degraded, report marks VOC conclusions as exploratory |
| behavior-analysis funnel data incomplete | Complete analyzable portions based on available data, mark missing stages as "data missing", aha_moment_candidates annotated as low confidence |
| user-modeling all Persona confidence < 0.7 | Annotate "insufficient modeling", output highest-confidence Persona for human approval, recommend supplementing data or conducting interviews before re-modeling |
| interview-assist interview not executed (human did not complete interview) | interview-insights.json annotated "interview not executed", report generated based on VOC + behavior data + modeling data, annotated "lacks interview validation" |
| All upstream data missing | Degrade to lightweight flow: user describes user portrait -> generate hypothetical Persona based on description -> generate exploratory report |
| Stage summary generation failure | Generate partial summary based on completed sub-Skill output, mark missing items as "data missing", do not block orchestration completion |

## Changelog

- v1.0: Initial version
