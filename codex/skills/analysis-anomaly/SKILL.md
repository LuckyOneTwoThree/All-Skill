---
name: analysis-anomaly
description: "Use when automatically detecting and attributing metric anomalies. Automated data analysis engine running 24/7 for metric health checks, anomaly detection, auto-attribution and insight push. Keywords: Anomaly detection, data analysis, auto-attribution, metric monitoring, anomaly report, metric anomaly, data anomaly, anomaly alert."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Data Analysis"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "DAU suddenly dropped 30% today, help me find the cause"
    - "Metric anomaly alert, help me with attribution analysis"
    - "Data fluctuation is too large, see what went wrong"
execution_depth:
  default: standard
  quick_description: "Output anomaly diagnosis and root cause"
  deep_description: "Full analysis + root cause inference chain + impact scope assessment + prevention mechanism design"
---

# Automated Data Analysis Engine

## Core Principles

1. **Anomalies are more noteworthy than normalcy**: Every anomaly is a signal for improvement; 24/7 detection ensures nothing is missed
2. **Attribution is more important than detection**: Detecting anomalies is just the starting point; the four-step attribution method (authenticity->scope->correlation->conclusion) transforms anomalies into actions
3. **Tiered alerts, not one-size-fits-all**: P0 instant push + phone, P1 within 2 hours, P2 daily summary, P3 log only; front-loading rules reduces noise

## Interaction Mode

AI AI auto-execution (data analysis type)

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Metric system | JSON | Yes | output/pm-metrics-design/metrics-system/metric_system.json | Core metric list and definitions to monitor |
| Real-time data stream | JSON | Yes | Data warehouse/real-time computing platform | Metric time series data |
| Alert rules | JSON | Yes | User provided | Threshold configurations for various metric anomalies |
| Event calendar | JSON | O | User provided | Product changes, marketing campaigns, market events, etc. |

## Execution Steps

### Step 1: Hourly Core Metric Health Check [Core]

```
Execute hourly
├── Get all core metric current values
├── Calculate YoY (same period last week), MoM (last hour) changes
├── Compare against preset thresholds and historical fluctuation ranges
└── Flag metrics requiring attention
```

### Step 2: Anomaly Detection [Core]

| Detection Method | Description |
|-----------------|-------------|
| Statistical threshold | Set upper/lower limits based on historical data (e.g., +/-3σ) |
| Trend deviation | Significant deviation from historical trend |
| MoM anomaly | Large fluctuation compared to recent data |
| YoY anomaly | Significant change compared to same period last year |

### Step 3: Auto-Attribution [Core]

Anomaly auto-attribution four-step method:

```
1. Confirm authenticity
   ├── Exclude data latency issues
   ├── Exclude data pipeline failures
   ├── Exclude statistical noise (natural fluctuations)
   └── Confirm as real anomaly

2. Locate scope
   ├── How many users affected
   ├── Which features/pages affected
   ├── Which platforms/channels affected
   └── How long it has lasted

3. Correlate external events
   ├── Product changes (version releases, feature toggles)
   ├── Marketing campaigns (promotions, push notifications, pop-ups)
   ├── Market events (competitor actions, trending events)
   └── Environmental factors (holidays, weather, emergencies)

4. Generate attribution conclusion
   ├── Most likely cause (most_likely_cause)
   ├── Confidence level (confidence)
   ├── Supporting evidence (evidence)
   └── Recommended action (recommended_action)
```

### Step 4: Insight Push [Core]

Push based on anomaly severity:

- **P0 (Critical)**: Instant push + phone alert
- **P1 (Important)**: Notification within 2 hours
- **P2 (General)**: Daily summary
- **P3 (Info)**: Log only

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | anomaly diagnosis and root cause | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full analysis + root cause inference chain + impact scope assessment + prevention mechanism design | Full deliverables + extended analysis + deep simulation |

## Output


**Output File Path**: `output/pm-metrics-ops/analysis-anomaly/`
**Output Schema**:

```json
{
  "type": "object",
  "required": ["metric_name", "current_value", "severity", "attribution"],
  "properties": {
    "metric_name": {"type": "string", "description": "Anomalous metric name"},
    "current_value": {"type": "number", "description": "Current value"},
    "expected_range": {"type": "array", "description": "Expected range"},
    "deviation": {"type": "string", "description": "Degree of deviation"},
    "severity": {"type": "string", "description": "Severity: P0/P1/P2/P3"},
    "attribution": {"type": "object", "description": "Attribution information, including authenticity judgment, related events, and recommended actions"},
    "trend_chart_url": {"type": "string", "description": "Trend chart URL"},
    "raw_data_url": {"type": "string", "description": "Raw data URL"}
  }
}
```

```yaml
anomaly_report:
  timestamp: "2024-01-15T10:30:00Z"

  metric_name: "dau_conversion_rate"
  current_value: 12.3
  expected_range: [15.0, 20.0]
  deviation: -27%

  severity: "P1"

  attribution:
    is_real: true
    scope:
      affected_users: 150000
      affected_platforms: ["iOS", "Android"]
      affected_features: ["Homepage recommendations"]
      duration: "ongoing"

    related_events:
      - type: "product_release"
        name: "v2.5.0 release"
        time: "2024-01-15T08:00:00Z"
        confidence: 0.85
      - type: "marketing_campaign"
        name: "New Year promotion"
        time: "2024-01-14T00:00:00Z"
        confidence: 0.3

    most_likely_cause: |
      Homepage recommendation algorithm change in v2.5.0,
      causing decreased relevance between recommended content and user interests

    confidence: 0.85

    evidence:
      - "Anomaly occurred within 2 hours of version release"
      - "iOS and Android both declined, excluding client-side issues"
      - "Non-campaign period, excluding marketing impact"

    recommended_action: |
      1. Immediately check v2.5.0 homepage recommendation algorithm changes
      2. If cannot be located within 2 hours, prepare rollback
      3. Prepare A/B test to verify hypothesis

    needs_human_confirmation: true

  trend_chart_url: "output/pm-metrics-ops/analysis-anomaly/charts/dau_conversion_20240115.png"
  raw_data_url: "output/pm-metrics-ops/analysis-anomaly/data/dau_conversion_20240115.json"
```

### Storage Path

```
output/pm-metrics-ops/analysis-anomaly/
├── anomaly_reports/
│   ├── YYYYMMDD_HHMMSS_anomaly_{metric}.yaml
│   └── summary_{date}.yaml
├── charts/
│   └── {metric}_{date}.png
└── data/
    └── {metric}_{date}.json
```

### Configuration Example

```yaml
anomaly_detection:
  core_metrics:
    - name: "dau"
      threshold_type: "absolute"
      min_value: 1000000
      max_value: null
      alert_on: "below"

    - name: "dau_conversion_rate"
      threshold_type: "statistical"
      std_multiplier: 3
      min_change_pct: 5
      alert_on: "both"

    - name: "revenue_daily"
      threshold_type: "relative"
      vs_last_week_pct: -15
      alert_on: "below"

  notification:
    channels:
      - type: "slack"
        url: "${SLACK_WEBHOOK}"
      - type: "phone"
        for_severity: ["P0"]
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| anomaly_report | object | Yes | Anomaly report root object |
| anomaly_report.metric_name | string | Yes | Anomalous metric name |
| anomaly_report.current_value | number | Yes | Current value |
| anomaly_report.expected_range | array | Yes | Expected range, [min, max] |
| anomaly_report.deviation | string | Yes | Degree of deviation |
| anomaly_report.severity | string | Yes | Severity, enum: P0/P1/P2/P3 |
| anomaly_report.attribution | object | Yes | Attribution information |
| anomaly_report.attribution.is_real | boolean | Yes | Whether it is a real anomaly |
| anomaly_report.attribution.scope | object | Yes | Impact scope |
| anomaly_report.attribution.most_likely_cause | string | Yes | Most likely cause |
| anomaly_report.attribution.confidence | number | Yes | Confidence, 0-1 |
| anomaly_report.attribution.recommended_action | string | Yes | Recommended action |
| anomaly_report.attribution.needs_human_confirmation | boolean | Yes | Whether human confirmation needed |
| anomaly_report.trend_chart_url | string | No | Trend chart URL |
| anomaly_report.raw_data_url | string | No | Raw data URL |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| Metric system change | Monitoring metric list and thresholds | Update monitoring metric list, reload alert rules, flag for human confirmation |
| Alert rule change | Anomaly detection thresholds and push strategy | Reload alert rules, update detection parameters |
| Event calendar change | External events for attribution correlation | Update event correlation data, re-evaluate attribution for unconfirmed anomalies |
| Data source change | Data acquisition and calculation logic | Update data source configuration, verify data completeness |

When anomaly reports themselves change, notification mechanism to downstream:

| Report Change Type | Notification Scope | Notification Method |
|-------------------|-------------------|---------------------|
| P0/P1 anomaly added | decision-dace, data-analysis-report | Flag anomaly addition, trigger insight transformation |
| Attribution conclusion changed | decision-dace | Flag attribution change, trigger DACE Conclude |
| Severity level escalated | All downstream | Flag level escalation, trigger corresponding alert strategy |

---

## Decision Rules

| Condition | Action |
|-----------|--------|
| P0 anomaly (core metric v > 10%) | Instant push + phone alert + auto-create Incident |
| P1 anomaly (metric v 3-10%) | Push within 2 hours + Slack notification |
| P2 anomaly (metric v 1-3%) | Daily summary |
| P3 fluctuation (metric v < 1%) | Log, continue monitoring |
| Human confirmation needed | Send confirmation request, await response |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Anomaly detection covers all key metrics
- [ ] Anomaly severity classification correct (P0/P1/P2)

### P1 Checks (must pass for standard/deep)

- [ ] Root cause analysis has data support
- [ ] Recommended actions are actionable

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|-----------------|---------------|----------|
| Metric system missing | Prompt user to provide metric data and anomaly description, perform attribution analysis based on description | Anomaly detection scope based on user description, may miss unmonitored metrics | Request user to provide metric names, current values, and baseline values, or upload metrics-system.json |
| Real-time data stream missing | User provides metric data and anomaly description -> attribution analysis based on description | Cannot auto-detect anomalies, relies on user to discover proactively | Request user to provide anomalous metric data and occurrence time, or upload real-time data |
| Metric system + Real-time data stream both missing | User provides metric data and anomaly description -> attribution analysis based on description | Output attribution analysis report based on description, annotated as "to be verified" | Request user to provide anomalous metric name, current value, baseline value, and change magnitude |

### Execution Frequency

- **Normal operation**: Execute once per hour
- **During P0 anomaly**: Update status every 15 minutes
- **Routine report**: Generate daily report at 8:00
