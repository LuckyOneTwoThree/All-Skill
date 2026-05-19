---
name: analysis-orchestrator
description: "Use when detecting data anomalies, running funnel analysis, or retention analysis. Data analysis orchestrator dispatching analysis-anomaly/funnel/retention/data-analysis-report. Keywords: data analysis, anomaly detection, funnel analysis, retention analysis, Aha Moment, look at data, poor data, data insights."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Data Analysis"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me analyze the data"
    - "Data has anomalies, investigate"
    - "Run a funnel analysis"
    - "Analyze user retention"
    - "Data is poor, find the reasons"
---

# Data Analysis Orchestrator

## Core Principles

**Use data to reduce guesswork in decisions**

The value of data analysis lies not in producing reports, but in converting uncertainty into quantifiable risk and transforming intuitive judgments into evidence-backed decisions.

## Orchestration Philosophy

1. **Detection first, analysis follows, report wraps up**: Anomaly detection runs 24/7, funnel and retention triggered on demand, report integrates and closes
2. **Every analysis result must be actionable**: Analysis results without action recommendations are not passed downstream
3. **Anomalies block, others run in sequence**: P0 anomalies immediately block current flow, other stages run in sequence

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: analysis-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-metrics-ops/analysis-orchestrator.md

stages:
  - id: phase-1
    name: "Anomaly Detection"
    depends_on: []
    skills: [analysis-anomaly]
    gate:
      condition: "Anomaly detection pipeline running continuously, no interruptions"
      fail_action: "Immediately fix detection pipeline, activate backup monitoring"

  - id: phase-2
    name: "Funnel Analysis"
    parallel_with: [phase-3]
    skills: [analysis-funnel]
    gate:
      condition: "Core business funnel defined and data complete"
      fail_action: "Supplement funnel definition, ensure core path coverage"

  - id: phase-3
    name: "Retention Analysis"
    parallel_with: [phase-2]
    skills: [analysis-retention]
    gate:
      condition: "At least 1 Aha Moment candidate behavior produced"
      fail_action: "Expand behavior search scope or extend analysis period"

  - id: phase-4
    name: "Data Analysis Report"
    depends_on: [phase-1, phase-2, phase-3]
    skills: [data-analysis-report]
    gate:
      condition: "Report executive summary complete, at least 3 action recommendations"
      fail_action: "Supplement analysis or mark recommendations as needing additional data"
```

## Stage Execution Plan

#### Invoke analysis-anomaly

```
Invoke: ${analysis-anomaly}
Input:
  metrics_system: metrics-system -> metrics.json
  real_time_data: data warehouse / real-time compute platform
  alert_rules: provided by user
  event_calendar: provided by user (optional)
Output: output/pm-metrics-ops/analysis-anomaly/
Validation: Anomaly detection covers all key metrics; anomaly severity classified correctly (P0/P1/P2); root cause analysis supported by data; recommended actions are actionable
Mode: AI
```

#### Invoke analysis-funnel

```
Invoke: ${analysis-funnel}
Input:
  funnel_definition: provided by user
  event_data: provided by user
  segment_config: provided by user (optional)
  comparison_period: provided by user (optional)
Output: output/pm-metrics-ops/analysis-funnel/
Validation: Funnel steps defined completely without omissions; conversion rates calculated from full data; drop-off nodes identified with cause hypotheses; multi-dimensional drill-down covers at least 3 dimensions
Mode: AI
```

#### Invoke analysis-retention

```
Invoke: ${analysis-retention}
Input:
  user_behavior_data: provided by user
  segment_definition: provided by user (optional)
  cohort_config: provided by user (optional)
  baseline_date: provided by user (optional)
Output: output/pm-metrics-ops/analysis-retention/
Validation: Retention calculated from full users not sampling; Cohort analysis covers time, channel, behavior dimensions; Aha Moment candidates pass significance testing; churn prediction model accuracy > 70%
Mode: AI
```

#### Invoke data-analysis-report

```
Invoke: ${data-analysis-report}
Input:
  funnel_analysis: output/pm-metrics-ops/analysis-funnel/
  retention_analysis: output/pm-metrics-ops/analysis-retention/
  anomaly_detection: output/pm-metrics-ops/analysis-anomaly/
  decision_dace: decision-dace -> decision_insight.json (optional)
  metrics_system: metrics-system -> metrics_system.json (optional)
  analysis_time_range: provided by user
  product_info: provided by user (optional)
Output: output/pm-metrics-ops/data-analysis-report/
Validation: Executive summary contains 3 key findings + Top 1 recommendation; core metrics dashboard complete; funnel analysis includes biggest drop-off point and improvement opportunities; retention analysis includes lifecycle stages; each insight has data facts + business implications; at least 3 action recommendations each with priority and validation method; data scope and limitations documented
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-metrics-ops/ |
| Summary output path | output/phase-reports/pm-metrics-ops/analysis-orchestrator.md |

Downstream connections:
  primary: decision-orchestrator (data analysis complete, convert analysis insights into actionable decisions)
  alternatives:
    - target: experiment-orchestrator
      reason: Analysis findings need A/B testing to validate hypotheses
      condition: Data analysis finds uncertain causal relationships needing experimental verification
    - target: iteration-orchestrator
      reason: Analysis conclusions directly impact iteration priorities
      condition: Data analysis produces clear iteration direction recommendations
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Anomaly detection running 24/7 | Anomaly detection pipeline running continuously, no interruptions | Immediately fix detection pipeline, activate backup monitoring |
| Funnel core path coverage | Core business funnel defined and data complete | Supplement funnel definition, ensure core path coverage |
| Retention Aha Moment candidate identified | retention-analysis output file generated and non-empty | Expand behavior search scope or extend analysis period |
| Data insight report generated | Data insight report file generated and non-empty | Supplement analysis or mark "recommend supplementing data" |
| Stage summary generated | output/phase-reports/pm-metrics-ops/analysis-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| P0 anomaly immediate confirmation | P0-level anomaly detection triggered | Confirm anomaly authenticity, decide response strategy |

## Decision Rules

| Condition | Action |
|------|--------|
| P0 anomaly | Immediate push + phone alert |
| P1 anomaly | Slack/WeCom notification within 2 hours |
| P2 anomaly | Daily summary report |
| P3 fluctuation | Log only, no alert |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Sub-Skill output validation failed | Pause downstream stage execution, output validation failure report, prompt human to fix and retry current stage |
| P0 anomaly detection triggered | Immediately interrupt current stage, prioritize P0 anomaly handling, resume original flow after handling |
| Upstream data source unavailable | Execute per sub-Skill degradation strategy, record degradation info, mark degradation impact scope in final output |
| Analysis results lack action recommendations | Block downstream transmission, require current sub-Skill to supplement action recommendations |
| Human decision timeout without response | Pause flow, preserve current stage state, support resuming from checkpoint after human returns |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestration completion |
