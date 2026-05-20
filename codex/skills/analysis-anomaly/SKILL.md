---
name: analysis-anomaly
description: Use when automatic detection and attribution of metric anomalies are needed. Automated data analysis engine, AI automatically runs 24/7, responsible for metric health checks, anomaly detection, automatic attribution, and insight push. Outputs a complete anomaly report when metric anomalies are detected. Keywords: anomaly detection, data analysis, automatic attribution, metric monitoring, anomaly report, metric anomaly, data anomaly, anomaly alert, data has issues, metric suddenly dropped, data fluctuation.
metadata:
  module: "Product Metrics Operations"
  sub-module: "Data Analysis"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "DAU suddenly dropped 30% today, help me find the cause"
    - "Metric anomaly alert, help me with attribution analysis"
    - "Data fluctuation is too large, see what went wrong"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Directly output anomaly diagnosis and root cause"
  deep_description: "Complete analysis + root cause reasoning chain + impact scope assessment + prevention mechanism design"
---

# Automated Data Analysis Engine

## Core Principles

1. **Anomalies are more noteworthy than normal states**: Every anomaly is a signal for improvement; 24/7 uninterrupted detection ensures nothing is missed
2. **Attribution is more important than detection**: Discovering anomalies is only the starting point; the four-step attribution method (authenticity → scope → correlation → conclusion) transforms anomalies into actions
3. **Tiered alerts rather than one-size-fits-all**: P0 instant push + phone call, P1 within 2 hours, P2 daily summary, P3 log only; front-loading rules reduces noise

## Interaction Mode

🤖 AI Auto-Execution (Data Analysis Type)

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Metric System | JSON | Yes | output/pm-metrics-design/metrics-system/metric_system.json | Core metric list and definitions to monitor |
| Real-time Data Stream | JSON | Yes | Data Warehouse / Real-time Computing Platform | Metric time-series data |
| Alert Rules | JSON | Yes | User-provided | Threshold configurations for various metric anomalies |
| Event Calendar | JSON | ○ | User-provided | External events such as product changes, marketing campaigns, market events |

## Execution Steps

### Step 1: Hourly Core Metric Health Check [Core]

```
Executed hourly on schedule
├── Retrieve current values of all core metrics
├── Calculate YoY (same period last week) and MoM (previous hour) changes
├── Compare against preset thresholds and historical fluctuation ranges
└── Flag metrics requiring attention
```

### Step 2: Anomaly Detection [Core]

| Detection Method | Description |
|---------|------|
| Statistical Threshold | Set upper/lower limits based on historical data (e.g., ±3σ) |
| Trend Deviation | Significant deviation from historical trend |
| Period-over-Period Anomaly | Large fluctuation compared to recent data |
| Year-over-Year Anomaly | Significant change compared to the same period last year |

### Step 3: Automatic Attribution [Core]

Four-step automatic anomaly attribution method:

```
1. Confirm Authenticity
   ├── Exclude data latency issues
   ├── Exclude data pipeline failures
   ├── Exclude statistical noise (natural fluctuation)
   └── Confirm as real anomaly

2. Locate Scope
   ├── How many users are affected
   ├── Which features/pages are affected
   ├── Which platforms/channels are affected
   └── How long has it lasted

3. Correlate External Events
   ├── Product changes (version releases, feature toggles)
   ├── Marketing campaigns (promotions, push notifications, pop-ups)
   ├── Market events (competitor actions, trending events)
   └── Environmental factors (holidays, weather, emergencies)

4. Generate Attribution Conclusion
   ├── Most likely cause (most_likely_cause)
   ├── Confidence level (confidence)
   ├── Supporting evidence (evidence)
   └── Recommended action (recommended_action)
```

### Step 4: Insight Push [Core]

Push based on anomaly severity:

- **P0 (Critical)**: Instant push + phone alert
- **P1 (Important)**: Notification within 2 hours
- **P2 (Moderate)**: Daily summary
- **P3 (Info)**: Log only

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Anomaly diagnosis and root cause | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output including all Step outputs |
| deep | Complete analysis + root cause reasoning chain + impact scope assessment + prevention mechanism design | Complete output + extended analysis + deep reasoning |

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
    "severity": {"type": "string", "description": "Severity level: P0/P1/P2/P3"},
    "attribution": {"type": "object", "description": "Attribution information, including authenticity judgment, related events, and recommended actions"},
    "trend_chart_url": {"type": "string", "description": "Trend chart URL"},
    "raw_data_url": {"type": "string", "description": "Raw data URL"}
  }
}
```

```yaml
anomaly_report:
  timestamp: "2024-01-15T10:30:00Z"

  # Basic information
  metric_name: "dau_conversion_rate"
  current_value: 12.3
  expected_range: [15.0, 20.0]
  deviation: -27%

  # Severity level
  severity: "P1"  # P0/P1/P2/P3

  # Attribution information
  attribution:
    is_real: true
    scope:
      affected_users: 150000
      affected_platforms: ["iOS", "Android"]
      affected_features: ["Home Recommendations"]
      duration: "ongoing"

    related_events:
      - type: "product_release"
        name: "v2.5.0 Release"
        time: "2024-01-15T08:00:00Z"
        confidence: 0.85
      - type: "marketing_campaign"
        name: "New Year Promotion"
        time: "2024-01-14T00:00:00Z"
        confidence: 0.3

    most_likely_cause: |
      The home recommendation algorithm change in v2.5.0
      caused a decrease in recommendation content relevance to user interests

    confidence: 0.85

    evidence:
      - "Anomaly occurred within 2 hours of version release"
      - "Both iOS and Android declined simultaneously, excluding client-side issues"
      - "Non-campaign period, excluding marketing impact"

    recommended_action: |
      1. Immediately check v2.5.0 home recommendation algorithm changes
      2. If root cause cannot be located within 2 hours, prepare rollback
      3. Prepare A/B test to verify hypothesis

    needs_human_confirmation: true

  # Auxiliary information
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
# Metric anomaly detection configuration
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
|----------|------|------|------|
| anomaly_report | object | Yes | Anomaly report root object |
| anomaly_report.metric_name | string | Yes | Anomalous metric name |
| anomaly_report.current_value | number | Yes | Current value |
| anomaly_report.expected_range | array | Yes | Expected range, [min, max] |
| anomaly_report.deviation | string | Yes | Degree of deviation |
| anomaly_report.severity | string | Yes | Severity level, enum: P0/P1/P2/P3 |
| anomaly_report.attribution | object | Yes | Attribution information |
| anomaly_report.attribution.is_real | boolean | Yes | Whether it is a real anomaly |
| anomaly_report.attribution.scope | object | Yes | Impact scope |
| anomaly_report.attribution.most_likely_cause | string | Yes | Most likely cause |
| anomaly_report.attribution.confidence | number | Yes | Confidence level, 0-1 |
| anomaly_report.attribution.recommended_action | string | Yes | Recommended action |
| anomaly_report.attribution.needs_human_confirmation | boolean | Yes | Whether human confirmation is needed |
| anomaly_report.trend_chart_url | string | No | Trend chart URL |
| anomaly_report.raw_data_url | string | No | Raw data URL |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Metric system change | Monitored metric list and thresholds | Update monitored metric list, reload alert rules, flag for human confirmation |
| Alert rule change | Anomaly detection thresholds and push strategy | Reload alert rules, update detection parameters |
| Event calendar change | External events for attribution correlation | Update event correlation data, re-evaluate attribution of unconfirmed anomalies |
| Data source change | Data retrieval and calculation logic | Update data source configuration, verify data completeness |

When anomaly reports themselves change, notification mechanism for downstream:

| Report Change Type | Notification Scope | Notification Method |
|-------------|----------|----------|
| P0/P1 anomaly added | decision-dace, data-analysis-report | Flag anomaly addition, trigger insight conversion |
| Attribution conclusion changed | decision-dace | Flag attribution change, trigger DACE Conclude |
| Severity level escalated | All downstream | Flag level escalation, trigger corresponding alert strategy |

---

## Decision Rules

| Condition | Action |
|-----|--------|
| P0 anomaly (core metric ↓ > 10%) | Instant push + phone alert + auto-create Incident |
| P1 anomaly (metric ↓ 3-10%) | Push within 2 hours + Slack notification |
| P2 anomaly (metric ↓ 1-3%) | Daily summary |
| P3 fluctuation (metric ↓ < 1%) | Log, continue monitoring |
| Human confirmation needed | Send confirmation request, await response |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Anomaly detection covers all key metrics
- [ ] Anomaly severity classification is correct (P0/P1/P2)

### P1 Checks (must pass for standard/deep)

- [ ] Root cause analysis is supported by data
- [ ] Recommended actions are actionable

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep reasoning and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|----------|----------|----------|
| Metric system missing | Prompt user to provide metric data and anomaly description, perform attribution analysis based on description | Anomaly detection scope based on user description, may miss unmonitored metrics |
| Real-time data stream missing | User provides metric data and anomaly description → attribution analysis based on description | Cannot automatically detect anomalies, relies on user to proactively discover |
| Both metric system and real-time data stream missing | User provides metric data and anomaly description → attribution analysis based on description | Output attribution analysis report based on description, marked as "pending verification" |

- If user does not provide alert rules, prompt user to provide or skip steps related to this input
- If user does not provide event calendar, prompt user to provide or skip steps related to this input

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Metric Data**: Name, current value, baseline value, and change magnitude of the anomalous metric
- **Anomaly Description**: Observed anomaly phenomena and time of occurrence
- **Recent Changes** (optional): Potentially related product changes or marketing campaigns

### Execution Frequency

- **Normal operation**: Execute once per hour
- **During P0 anomaly**: Update status every 15 minutes
- **Routine report**: Generate daily report at 8:00
