---
name: decision-culture
description: Use when you need to drive a team's data-driven decision culture. Data culture automation, through daily, weekly, monthly, and quarterly automated reporting systems, drives the adoption of data-driven decision culture. Ensures the team always makes decisions based on data. Keywords: data culture, data-driven, decision culture, data literacy, reporting system, get team to make data-driven decisions, build data habits, regular data report delivery.
metadata:
  module: "Product Metrics & Operations"
  sub-module: "Decision Closed Loop"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["General"]
  trigger_examples:
    - "Team doesn't habitually look at data, how to drive change"
    - "Help me build a data-driven culture"
    - "Set up regular data report delivery"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Only output daily summary and anomaly alert delivery"
  deep_description: "Full reporting system + data literacy assessment + decision impact tracking + culture maturity scoring + improvement roadmap"
---

# Data Culture Automation

## Core Principles

1. **No disturbance without anomalies**: The value of reports lies not in quantity but in signal-to-noise ratio; noisy reports kill data culture
2. **Rhythm becomes habit**: Daily/weekly/monthly/quarterly automated rhythm turns data-driven from a "requirement" into a "habit"
3. **Action-oriented**: Every report must have clear next steps; reports without action recommendations are data dumping
4. **Measured decision standards**: All decisions must follow a standardized decision process, ensuring decisions are traceable and reviewable

## Measured Decision Standards

### Decision Types and Required Data

| Decision Type | Required Data | Data Source |
|---------|---------|---------|
| Feature priority adjustment | Feature usage rate, retention impact, ROI estimate | Data analytics platform, experiment results |
| Resource allocation decision | Module ROI, business objective progress, bottleneck analysis | Financial data, product data, engineering data |
| Release timing decision | Experiment results, current metric status, risk assessment | Experiment platform, monitoring system |
| Experiment stop decision | Statistical significance, p-value, confidence interval, business impact | Experiment analysis platform |

### Decision Process

```
1. Clarify decision objective
2. Collect required data
3. Analyze data and draw conclusions
4. Evaluate alternatives
5. Make decision and record it
6. Follow up on decision outcome and review
```

### Decision Record Template

```yaml
decision_record:
  decision_id: "DEC-2024-001"
  decision_date: "2024-01-15"
  decision_maker: "Product Manager"
  decision_context: "Whether to fully release simplified registration flow"
  data_sources: ["Experiment results", "Feature data", "User feedback"]
  key_insights: ["Experiment group conversion rate increased 8.2%", "User feedback positive", "No significant negative impact"]
  decision: "Full release"
  rationale: "Experiment results statistically significant, user feedback positive, risk controllable"
  expected_outcome: "Overall conversion rate increase 7-9%"
  follow_up_date: "2024-01-22"
```

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| OKR data | object | Yes | output/pm-metrics-ops/decision-dace/dace_status.yaml | Objectives and Key Results, progress tracking data |
| Decision records | object | Yes | output/pm-metrics-ops/decision-dace/decision_insight.json | Team historical decisions and data support status |
| Team feedback | object | ○ | User provided | Report usage rate, data literacy assessment |

## Execution Steps

### Execution Rhythm

```
┌─────────────────────────────────────────────────────────┐
│                   Data Culture Rhythm                     │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Daily      Anomaly detection → Daily summary (no disturbance without anomalies) │
│  │                                                        │
│  ▼                                                        │
│  Weekly     Feature Review → Experiment summary → Weekly report │
│  │                                                        │
│  ▼                                                        │
│  Monthly    Full report → OKR tracking → Monthly Review  │
│  │                                                        │
│  ▼                                                        │
│  Quarterly  Metric system review → Strategic Review (human-led) │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Daily Rhythm

#### Anomaly Detection (Automated) [Core]

```
Execute hourly
├── Core metric health check
├── Anomaly detection
└── If anomaly detected: trigger alert
```

#### Daily Summary (No Disturbance Without Anomalies) [Core]

```yaml
daily_summary:
  generated_at: "2024-01-15T20:00:00Z"
  date: "2024-01-15"
  
  # Status
  status: "no_alerts"  # no_alerts / alerts_handled / critical
  
  # Key metrics
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
  
  # Experiment status
  experiments:
    running: 3
    summary:
      - id: "exp_001"
        name: "Simplified Registration Flow"
        day: 7
        current_lift: "+8.5%"
        status: "on_track"
        
      - id: "exp_002"
        name: "New Homepage"
        day: 4
        current_lift: "+2.1%"
        status: "monitoring"
        
      - id: "exp_003"
        name: "New Pricing Strategy"
        day: 2
        current_lift: "+0.3%"
        status: "early_monitoring"
  
  # Alert records (if any)
  alerts:
    count: 0
    details: []
  
  # Today's highlights
  highlights:
    - "All core metrics normal, no alerts"
    - "Simplified registration experiment progressing well, expected to complete early"
    - "No major product changes today"
    
  # Tomorrow's preview
  tomorrow:
    - "exp_001 expected to reach statistical significance"
    - "Plan to release v2.5.1 minor version"
```

### Weekly Rhythm

#### Monday: Feature Review [Conditional]

```yaml
weekly_feature_review:
  week: "2024-W03"
  review_date: "2024-01-15"
  
  features_reviewed:
    - feature: "Simplified Registration Flow"
      release_date: "2024-01-08"
      status: "released"
      
      metrics:
        registration_rate:
          before: 0.352
          after: 0.381
          lift: +8.2%
        user_feedback: "positive"
        
      verdict: "Feature successful, maintain current state"
      
    - feature: "Homepage Recommendation Optimization"
      release_date: "2024-01-10"
      status: "monitoring"
      
      metrics:
        click_rate:
          before: 0.12
          after: 0.128
          lift: +6.7%
          
      verdict: "Metrics positive, continue monitoring for 2 weeks"
```

#### Mid-Week: Experiment Summary [Conditional]

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
        name: "Simplified Registration Experiment"
        result: "positive"
        lift: "+8.2%"
        decision: "Full release"
        
      - id: "exp_pricing_001"
        name: "New Pricing Experiment"
        result: "inconclusive"
        lift: "+2.1%"
        decision: "Continue experiment"
        
  learnings:
    - "Simplifying operation steps has significant positive impact on conversion"
    - "Pricing changes require longer validation time"
    
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
  
  # Executive summary
  executive_summary: |
    Overall performance this week was good.
    - DAU increased 2.1% vs last week, reaching 10.85M
    - Registration conversion rate improved 8.2% (experiment group)
    - Completed 2 experiments, 1 positive, 1 inconclusive
    
  # OKR progress
  okr_progress:
    obj_1_dau:
      target: 12000000
      current: 10850000
      progress: 35%
      on_track: true
      
    obj_2_revenue:
      target: 50000000  # Monthly
      current: 15500000  # Month-to-date
      progress: 31%
      on_track: true
  
  # Core metrics weekly
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
  
  # Experiment summary
  experiments:
    total: 5
    running: 3
    completed: 2
    positive_rate: 0.5
    
  # Insights and actions
  insights:
    - "Simplified registration flow effect significant, recommend extending to other registration scenarios"
    - "iOS user conversion outperforms Android, needs targeted optimization"
    
  actions_for_next_week:
    - "Full release of simplified registration flow"
    - "Launch Android registration flow optimization experiment"
    - "New homepage feature grayscale testing"
```

### Monthly Rhythm

#### Monthly OKR Tracking [Conditional]

```yaml
monthly_okr_review:
  month: "2024-01"
  review_date: "2024-01-31"
  
  # OKR status
  objectives:
    - id: "obj_1"
      text: "Increase user activity"
      progress: 72%
      status: "on_track"
      
      key_results:
        - kr: "DAU reaches 12M"
          progress: 35%
          assessment: "Needs acceleration"
          
        - kr: "D7 retention reaches 30%"
          progress: 70%
          assessment: "Progressing well"
          
    - id: "obj_2"
      text: "Increase monetization revenue"
      progress: 65%
      status: "on_track"
      
      key_results:
        - kr: "Monthly revenue reaches 50M"
          progress: 31%
          assessment: "Half time passed, 31% completed, needs attention"
  
  # Deviation analysis
  deviation_analysis:
    - kr: "DAU target"
      gap: 1150000
      reasons:
        - "New user acquisition below expectations"
        - "Existing user churn rate slightly high"
      recommendations:
        - "Increase channel spending"
        - "Improve existing user re-engagement"
```

#### Monthly Full Report [Conditional]

```yaml
monthly_report:
  month: "2024-01"
  generated_at: "2024-01-31T18:00:00Z"
  
  executive_summary: |
    January overall performance met expectations.
    DAU grew 2.1%, registration conversion improved 8.2%.
    Key feature simplified registration flow has been fully released.
    
  # Core metrics
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
  
  # Experiment summary
  experiments:
    total_this_month: 8
    positive: 4
    negative: 2
    inconclusive: 2
    
    key_findings:
      - "Flow simplification has broadly positive impact on conversion"
      - "Personalized recommendations show significant effect"
      - "Pricing strategy requires longer validation time"
  
  # Data culture building
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
  
  # Metric effectiveness
  metric_effectiveness:
    high_value:
      - name: "Registration conversion rate"
        reason: "Directly reflects product usability"
        
      - name: "D7 retention"
        reason: "Core health metric"
        
    low_value:
      - name: "Feature usage rate"
        reason: "Vague definition, needs redefinition"
        
  # Adjustment recommendations
  recommended_changes:
    - action: "Add metric: Core action completion rate"
      rationale: "Better measures user value"
      
    - action: "Adjust weight: Increase D7 retention weight"
      rationale: "More focus on user stickiness"
```

#### Quarterly Strategic Review (Human-Led) [Deep]

```
Human-led quarterly review
├── Review Q1 objective completion
├── Set Q2 strategic direction
├── Adjust OKR system
└── Determine key experiments
```

## Automated Report Configuration

```yaml
automation_config:
  # Daily reports
  daily:
    enabled: true
    time: "20:00"
    channels: ["slack", "email"]
    skip_if_no_alerts: true
    
  # Weekly reports
  weekly:
    enabled: true
    day: "Friday"
    time: "18:00"
    channels: ["slack", "email", "wiki"]
    
  # Monthly reports
  monthly:
    enabled: true
    day: "last_day"
    time: "18:00"
    channels: ["email", "presentation"]
    include_okr_review: true
    
  # Quarterly reports
  quarterly:
    enabled: true
    channels: ["presentation", "meeting"]
    human_dominated: true
```

## Team Data Culture Metrics

```yaml
data_culture_metrics:
  # Decision quality
  decision_quality:
    data_driven_decisions: 45
    total_decisions: 52
    rate: 0.87
    
  # Report usage
  report_usage:
    daily_summary_open: 0.95
    weekly_report_read: 0.88
    monthly_report_engagement: 0.75
    
  # Experimentation culture
  experimentation:
    experiments_per_month: 8
    experiment_decision_rate: 0.92
    fast_iteration_speed: "2 weeks avg"
    
  # Data literacy
  data_literacy:
    self_service_usage: 0.70
    sql_query_growth: "+20%"
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| report_type | string | Yes | Report type, enum: daily/weekly/monthly/quarterly |
| report_date | string | Yes | Report date |
| key_metrics | array | Yes | Key metrics list, at least 1 item |
| key_metrics[].name | string | Yes | Metric name |
| key_metrics[].value | number | Yes | Current value |
| key_metrics[].change | string | Yes | Change trend |
| key_metrics[].status | string | Yes | Status, enum: healthy/warning/critical |
| anomalies | array | No | Anomalous metrics list |
| action_items | array | Yes | Action items list |
| action_items[].description | string | Yes | Action description |
| action_items[].owner | string | No | Responsible person |
| action_items[].deadline | string | No | Deadline |
| engagement_stats | object | No | Report engagement statistics |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| OKR data change | OKR tracking section | Update OKR progress, re-evaluate deviation analysis |
| Decision record change | Data culture metrics | Update data-driven decision rate, re-evaluate culture health |
| Team feedback change | Report template and delivery strategy | Adjust report format and delivery timing |

When culture reports themselves change, downstream notification mechanism:

| Report Change Type | Notification Scope | Notification Method |
|-------------|----------|----------|
| OKR progress behind >20% | decision-dace | Flag progress risk, trigger DACE Conclude |
| Data-driven decision rate decline | All downstream | Flag culture risk, trigger training recommendation |
| Report engagement decline | decision-culture | Flag engagement issue, trigger report optimization |

---

## Decision Rules

| Situation | Handling Method |
|------|----------|
| Core metric anomaly (↓>5%) | Immediate alert delivery, trigger focused analysis |
| OKR progress behind >20% | Flag risk in weekly report, suggest strategy adjustment |
| Data-driven decision rate <70% | Deliver data culture training recommendation |
| Report open rate consistently declining | Optimize report format and delivery timing |

## Quality Checks

- [ ] Daily summary produces no noisy alerts when no anomalies exist (P0)
- [ ] Weekly report includes OKR progress and experiment summary (P1)
- [ ] Monthly report includes complete metric trends and deviation analysis (P1)
- [ ] All data references in reports are traceable to data sources (P0)
- [ ] Quarterly review includes metric system health assessment (P2)
- [ ] Strategic review includes culture maturity scoring (P2)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|----------|----------|----------|
| Analysis module outputs missing | User provides key metrics → generate summary report | Report content based on user-provided metrics, lacks automated analysis depth |
| Anomaly detection output missing | Daily summary uses user-provided metric data | Daily report may miss unmonitored anomalies |
| Experiment result output missing | Experiment summary section in weekly report marked "to be supplemented" | Experiment progress tracking missing |
| All analysis module outputs missing | User provides key metrics → generate summary report | Output basic summary report, all analysis dimensions marked "to be supplemented" |

### Data Acquisition Instructions

When upstream files are missing, users need to provide the following information to support degraded generation:
- **Key metrics**: Core metric names and current values to track
- **Metric targets** (optional): Target values and baseline values for each metric
- **Team focus areas** (optional): Current business issues the team is most concerned about

## Output

**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_type", "report_date", "key_metrics"],
  "properties": {
    "report_type": {"type": "string", "description": "Report type: daily/weekly/monthly/quarterly"},
    "report_date": {"type": "string", "description": "Report date"},
    "key_metrics": {"type": "array", "description": "Key metrics list, including name, current value, and change trend"},
    "anomalies": {"type": "array", "description": "Anomalous metrics list"},
    "action_items": {"type": "array", "description": "Action items list"},
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
|-----|------|
| No disturbance without anomalies | Reduce noise, only disturb when needed |
| Data consistency | All reports use the same data source |
| Action-oriented | Every report must have clear next steps |
| Continuous iteration | Optimize report format based on feedback |
| Transparency | Everyone can access the data |
