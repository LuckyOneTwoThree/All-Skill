---
name: decision-culture
description: "Use when driving team data-driven decision culture. Data culture automation through daily, weekly, monthly, quarterly automated report systems to drive data-driven decision culture adoption. Keywords: Data culture, data-driven, decision culture, data literacy, report system, data habits, regular data reports."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Decision Loop"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Team doesn't habitually look at data, how to drive change"
    - "Help me build a data-driven culture"
    - "Set up regular data report push"
execution_depth:
  default: standard
  quick_description: "Output decision framework and current assessment only"
  deep_description: "Full framework + decision audit + bias assessment + decision culture evolution roadmap"
---

# Data Culture Automation

## Core Principles

1. **No disturbance without anomaly**: The value of reports lies in signal-to-noise ratio, not quantity; noisy reports kill data culture
2. **Rhythm becomes habit**: Daily/weekly/monthly/quarterly automated rhythm transforms data-driven from "requirement" to "habit"
3. **Action-oriented**: Every report must have clear next steps; reports without action recommendations are data dumps

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| OKR data | object | Yes | output/pm-metrics-ops/decision-dace/dace_status.yaml | Objectives and key results, progress tracking data |
| Decision records | object | Yes | output/pm-metrics-ops/decision-dace/decision_insight.json | Team historical decisions and data support status |
| Team feedback | object | O | User provided | Report usage rate, data literacy assessment |

## Execution Steps

### Execution Rhythm

```
┌─────────────────────────────────────────────────────────┐
│                   Data Culture Rhythm                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Daily      Anomaly detection -> Daily summary (no disturbance without anomaly) │
│  │                                                        │
│  v                                                        │
│  Weekly     Feature Review -> Experiment summary -> Weekly report │
│  │                                                        │
│  v                                                        │
│  Monthly    Complete report -> OKR tracking -> Monthly Review │
│  │                                                        │
│  v                                                        │
│  Quarterly  Metric system review -> Strategic Review (human-led) │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Daily Rhythm

#### Anomaly Detection (automated) [Core]

```
Execute hourly
├── Core metric health check
├── Anomaly detection
└── If anomaly found: trigger alert
```

#### Daily Summary (no disturbance without anomaly) [Core]

```yaml
daily_summary:
  generated_at: "2024-01-15T20:00:00Z"
  date: "2024-01-15"

  status: "no_alerts"

  key_metrics:
    dau:
      value: 10850000
      vs_yesterday: +0.8%
      vs_last_week: +2.1%
      status: "healthy"

    revenue:
      value: 1580000
      vs_yesterday: -1.2%
      vs_last_week: +5.3%
      status: "healthy"

    conversion_rate:
      value: 0.352
      vs_yesterday: +0.5%
      status: "healthy"

  experiments:
    running: 3
    summary:
      - id: "exp_001"
        name: "Simplified registration flow"
        day: 7
        current_lift: "+8.5%"
        status: "on_track"

      - id: "exp_002"
        name: "New homepage"
        day: 4
        current_lift: "+2.1%"
        status: "monitoring"

      - id: "exp_003"
        name: "New pricing strategy"
        day: 2
        current_lift: "+0.3%"
        status: "early_monitoring"

  alerts:
    count: 0
    details: []

  highlights:
    - "All core metrics normal, no alerts"
    - "Simplified registration experiment progressing well, expected to complete early"
    - "No major product changes today"

  tomorrow:
    - "exp_001 expected to reach statistical significance"
    - "Planned v2.5.1 minor release"
```

### Weekly Rhythm

#### Monday: Feature Review [Conditional]

```yaml
weekly_feature_review:
  week: "2024-W03"
  review_date: "2024-01-15"

  features_reviewed:
    - feature: "Simplified registration flow"
      release_date: "2024-01-08"
      status: "released"

      metrics:
        registration_rate:
          before: 0.352
          after: 0.381
          lift: +8.2%
        user_feedback: "positive"

      verdict: "Feature successful, maintain current state"

    - feature: "Homepage recommendation optimization"
      release_date: "2024-01-10"
      status: "monitoring"

      metrics:
        click_rate:
          before: 0.12
          after: 0.128
          lift: +6.7%

      verdict: "Metrics positive, continue monitoring for 2 weeks"
```

#### Mid-week: Experiment Summary [Conditional]

```yaml
weekly_experiment_summary:
  week: "2024-W03"

  experiments_summary:
    completed_this_week: 2
    positive: 1
    negative: 0
    inconclusive: 1

    details:
      - id: "exp_reg_001"
        name: "Simplified registration experiment"
        result: "positive"
        lift: "+8.2%"
        decision: "Full release"

      - id: "exp_pricing_001"
        name: "New pricing experiment"
        result: "inconclusive"
        lift: "+2.1%"
        decision: "Continue experiment"

  learnings:
    - "Simplifying operation steps has significant positive impact on conversion"
    - "Pricing changes need longer verification period"

  recommendations:
    - "Continue simplifying core product flows"
    - "Extend pricing experiments to 3-4 weeks"
```

#### Friday: Weekly Report [Conditional]

```yaml
weekly_report:
  week: "2024-W03"
  period: "2024-01-08 to 2024-01-14"
  generated_at: "2024-01-14T18:00:00Z"

  executive_summary: |
    Overall performance this week was good.
    - DAU increased 2.1% vs last week, reaching 10.85M
    - Registration conversion rate improved 8.2% (experiment group)
    - Completed 2 experiments, 1 positive, 1 pending

  okr_progress:
    obj_1_dau:
      target: 12000000
      current: 10850000
      progress: 35%
      on_track: true

    obj_2_revenue:
      target: 50000000
      current: 15500000
      progress: 31%
      on_track: true

  metrics_weekly:
    dau:
      this_week_avg: 10820000
      last_week_avg: 10590000
      change: +2.2%

    d7_retention:
      this_week: 0.285
      last_week: 0.278
      change: +0.7pp

    revenue_daily:
      this_week_avg: 1560000
      last_week_avg: 1480000
      change: +5.4%

  experiments:
    total: 5
    running: 3
    completed: 2
    positive_rate: 0.5

  insights:
    - "Simplified registration flow effect significant, recommend extending to other registration scenarios"
    - "iOS user conversion better than Android, needs targeted optimization"

  actions_for_next_week:
    - "Full release simplified registration flow"
    - "Start Android registration flow optimization experiment"
    - "New homepage feature gradual rollout test"
```

### Monthly Rhythm

#### Monthly OKR Tracking [Conditional]

```yaml
monthly_okr_review:
  month: "2024-01"
  review_date: "2024-01-31"

  objectives:
    - id: "obj_1"
      text: "Increase user activity"
      progress: 72%
      status: "on_track"

      key_results:
        - kr: "DAU reach 12M"
          progress: 35%
          assessment: "Needs acceleration"

        - kr: "D7 retention reach 30%"
          progress: 70%
          assessment: "Progressing well"

    - id: "obj_2"
      text: "Increase commercial revenue"
      progress: 65%
      status: "on_track"

      key_results:
        - kr: "Monthly revenue reach 50M"
          progress: 31%
          assessment: "Half time passed, 31% complete, needs attention"

  deviation_analysis:
    - kr: "DAU target"
      gap: 1150000
      reasons:
        - "New user acquisition below expectations"
        - "Returning user churn rate slightly high"
      recommendations:
        - "Increase channel investment"
        - "Improve returning user re-engagement"
```

#### Monthly Complete Report [Conditional]

```yaml
monthly_report:
  month: "2024-01"
  generated_at: "2024-01-31T18:00:00Z"

  executive_summary: |
    January overall performance met expectations.
    DAU grew 2.1%, registration conversion improved 8.2%.
    Key feature simplified registration flow has been fully released.

  core_metrics:
    dau:
      monthly_avg: 10750000
      monthly_peak: 11200000
      trend: "up"

    retention:
      d1: 0.452
      d7: 0.285
      d30: 0.183
      trend: "improving"

    revenue:
      monthly_total: 46800000
      arpu: 4.35
      trend: "stable"

  experiments:
    total_this_month: 8
    positive: 4
    negative: 2
    inconclusive: 2

    key_findings:
      - "Flow simplification has universal positive impact on conversion"
      - "Personalized recommendations significantly effective"
      - "Pricing strategy needs longer verification period"

  data_culture:
    decisions_made: 15
    data_driven: 12
    data_driven_rate: 0.80

    report_engagement:
      daily_summary_open_rate: 0.95
      weekly_report_read_rate: 0.85
```

### Quarterly Rhythm

#### Quarterly Metric System Review [Deep]

```yaml
quarterly_metrics_review:
  quarter: "2024_Q1"

  metric_effectiveness:
    high_value:
      - name: "Registration conversion rate"
        reason: "Directly reflects product usability"

      - name: "D7 retention"
        reason: "Core health metric"

    low_value:
      - name: "Feature usage rate"
        reason: "Vague definition, needs redefinition"

  recommended_changes:
    - action: "Add metric: Core action completion rate"
      rationale: "Better measure of user value"

    - action: "Adjust weight: D7 retention weight increase"
      rationale: "More focus on user stickiness"
```

#### Quarterly Strategic Review (human-led) [Deep]

```
Human-led quarterly review
├── Review Q1 goal completion
├── Set Q2 strategic direction
├── Adjust OKR system
└── Determine key experiments
```

## Automated Report Configuration

```yaml
automation_config:
  daily:
    enabled: true
    time: "20:00"
    channels: ["slack", "email"]
    skip_if_no_alerts: true

  weekly:
    enabled: true
    day: "Friday"
    time: "18:00"
    channels: ["slack", "email", "wiki"]

  monthly:
    enabled: true
    day: "last_day"
    time: "18:00"
    channels: ["email", "presentation"]
    include_okr_review: true

  quarterly:
    enabled: true
    channels: ["presentation", "meeting"]
    human_dominated: true
```

## Team Data Culture Metrics

```yaml
data_culture_metrics:
  decision_quality:
    data_driven_decisions: 45
    total_decisions: 52
    rate: 0.87

  report_usage:
    daily_summary_open: 0.95
    weekly_report_read: 0.88
    monthly_report_engagement: 0.75

  experimentation:
    experiments_per_month: 8
    experiment_decision_rate: 0.92
    fast_iteration_speed: "2 weeks avg"

  data_literacy:
    self_service_usage: 0.70
    sql_query_growth: "+20%"
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| report_type | string | Yes | Report type, enum: daily/weekly/monthly/quarterly |
| report_date | string | Yes | Report date |
| key_metrics | array | Yes | Key metric list, at least 1 item |
| key_metrics[].name | string | Yes | Metric name |
| key_metrics[].value | number | Yes | Current value |
| key_metrics[].change | string | Yes | Change trend |
| key_metrics[].status | string | Yes | Status, enum: healthy/warning/critical |
| anomalies | array | No | Anomalous metric list |
| action_items | array | Yes | Action item list |
| action_items[].description | string | Yes | Action description |
| action_items[].owner | string | No | Responsible person |
| action_items[].deadline | string | No | Deadline |
| engagement_stats | object | No | Report engagement statistics |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| OKR data change | OKR tracking chapter | Update OKR progress, re-evaluate deviation analysis |
| Decision record change | Data culture metrics | Update data-driven decision rate, re-evaluate culture health |
| Team feedback change | Report template and push strategy | Adjust report format and push timing |

When culture report itself changes, notification mechanism to downstream:

| Report Change Type | Notification Scope | Notification Method |
|-------------------|-------------------|---------------------|
| OKR progress behind >20% | decision-dace | Flag progress risk, trigger DACE Conclude |
| Data-driven decision rate decline | All downstream | Flag culture risk, trigger training recommendations |
| Report engagement decline | decision-culture | Flag engagement issue, trigger report optimization |

---

## Decision Rules

| Situation | Handling Method |
|-----------|----------------|
| Core metric anomaly (v>5%) | Instant push alert, trigger targeted analysis |
| OKR progress behind >20% | Flag risk in weekly report, recommend strategy adjustment |
| Data-driven decision rate <70% | Push data culture training recommendations |
| Report open rate continuously declining | Optimize report format and push timing |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Daily summary produces no noisy alerts when no anomalies
- [ ] Weekly report includes OKR progress and experiment summary

### P1 Checks (must pass for standard/deep)

- [ ] Monthly report includes complete metric trends and deviation analysis
- [ ] All data references in reports traceable to data sources

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|-----------------|---------------|----------|
| Analysis module outputs missing | User provides key metrics -> generate summary report | Report content based on user-provided metrics, lacking auto-analysis depth | Request user to provide core metric names and current values, or upload analysis module outputs |
| Anomaly detection output missing | Daily summary uses user-provided metric data | Daily report may miss unmonitored anomalies | Request user to describe observed anomalies, or upload anomaly-analysis.json |
| Experiment result output missing | Weekly report experiment summary chapter annotated as "to be supplemented" | Experiment progress tracking missing | Request user to provide experiment status and results, or upload experiment-execution.json |
| All analysis module outputs missing | User provides key metrics -> generate summary report | Output basic summary report, each analysis dimension annotated as "to be supplemented" | Request user to provide key metrics, targets, and team focus areas, or execute analysis-anomaly and experiment-execution first |

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | decision framework and current assessment only | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full framework + decision audit + bias assessment + decision culture evolution roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_type", "report_date", "key_metrics"],
  "properties": {
    "report_type": {"type": "string", "description": "Report type: daily/weekly/monthly/quarterly"},
    "report_date": {"type": "string", "description": "Report date"},
    "key_metrics": {"type": "array", "description": "Key metric list, including name, current value, and change trend"},
    "anomalies": {"type": "array", "description": "Anomalous metric list"},
    "action_items": {"type": "array", "description": "Action item list"},
    "engagement_stats": {"type": "object", "description": "Report engagement statistics"}
  }
}
```

```
output/pm-metrics-ops/decision-culture/
├── culture/
│   ├── daily/
│   │   └── {date}_daily_summary.md
│   ├── weekly/
│   │   └── {week}_weekly_report.md
│   ├── monthly/
│   │   └── {month}_monthly_report.md
│   └── quarterly/
│       └── {quarter}_quarterly_report.md
├── dashboards/
│   ├── daily_dashboard.yaml
│   └── metrics_overview.yaml
└── engagement/
    └── report_analytics.yaml
```

Output files: {date}_daily_summary.md, {week}_weekly_report.md, {month}_monthly_report.md, {quarter}_quarterly_report.md, daily_dashboard.yaml, metrics_overview.yaml, report_analytics.yaml

## Culture Promotion Principles

| Principle | Description |
|-----------|-------------|
| No disturbance without anomaly | Reduce noise, only disturb when needed |
| Data consistency | All reports use the same data source |
| Action-oriented | Every report must have clear next steps |
| Continuous iteration | Optimize report format based on feedback |
| Transparency | Everyone can see the data |
