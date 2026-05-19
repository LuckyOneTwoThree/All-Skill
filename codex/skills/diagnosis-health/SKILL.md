---
name: diagnosis-health
description: "Use when diagnosing product health. Automated product health diagnosis, collecting multi-dimensional data for comprehensive scoring, trend prediction and bottleneck identification, outputting health report. Keywords: health score, product diagnosis, multi-dimensional scoring, health check, product health, health rating, product checkup, status check."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Issue Diagnosis"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Is the product healthy right now"
    - "Help me do a health check"
    - "How is the product status"
execution_depth:
  default: standard
  quick_description: "Output health score and issue list"
  deep_description: "Full diagnosis + health trend analysis + root cause deep inference + improvement priority roadmap"
---

# Product Health Auto-Diagnosis AI

## Core Principles

1. **Health is a leading indicator not a lagging report**: The purpose of health scoring is not to record the past but to predict the future -- discovering hidden issues before users perceive problems
2. **Layered scoring tracked independently**: Performance/Availability/Satisfaction/Business four layers scored independently, ensuring each layer can be independently located and tracked
3. **Bottlenecks determine resource allocation**: The ultimate goal of health diagnosis is to identify bottlenecks; resources go where bottlenecks are

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Performance Data | JSON | Yes | APM/Monitoring system -> Performance data | Response time, throughput, resource utilization |
| Availability Data | JSON | Yes | Monitoring system -> Availability data | SLA achievement rate, MTTR, MTBF |
| User Satisfaction | JSON | Yes | Feedback system -> Satisfaction data | NPS, CSAT, feedback, complaints |
| Business Metrics | JSON | Yes | Data analytics platform -> Business metrics | Conversion rate, GMV, DAU/MAU, retention |
| Competitor Dynamics | JSON | No | output/pm-monitoring/diagnosis-competition/competitor-report | Competitor health comparison data |

## Execution Steps

### Step 1: Data Collection & Standardization [Core]

**Goal**: Collect and standardize data across dimensions

**Data Source Mapping**:

| Dimension | Data Source | Collection Method |
|-----------|-------------|-------------------|
| Performance | APM/Monitoring system | API/Export |
| Availability | Monitoring system/Incident management | API/Export |
| Satisfaction | Feedback system/Survey tools | API/Export |
| Business | Data analytics platform | SQL/API |

**Standardization Processing**:
- Time alignment (unified to same time window)
- Metric normalization (0-100 or 0-1 range)
- Outlier handling (remove/smooth)
- Missing value imputation (interpolation/mean)

**Output Format**:

```yaml
raw_data:
  collected_at: {ISO8601}
  time_window:
    start: {ISO8601}
    end: {ISO8601}
  dimensions:
    performance:
      metrics: {...}
    availability:
      metrics: {...}
    satisfaction:
      metrics: {...}
    business:
      metrics: {...}
  data_quality:
    completeness: {percentage}
    accuracy: {percentage}
    freshness: {minutes}
```

### Step 2: Dimension Scoring [Core]

**Goal**: Calculate scores for each health dimension

**Scoring Methods**:

| Dimension | Metric Weights | Scoring Algorithm |
|-----------|----------------|-------------------|
| Performance | Response time 40%, Throughput 30%, Resources 30% | Baseline deviation scoring |
| Availability | SLA 50%, MTTR 25%, Failure frequency 25% | Target achievement scoring |
| Satisfaction | NPS 40%, CSAT 30%, Complaint rate 30% | Industry benchmark scoring |
| Business | Conversion rate 30%, Retention 30%, GMV 40% | Trend period-over-period scoring |

**Scoring Formula**:

```
score = Σ(metric_weight x metric_score)
metric_score = min(100, (actual / baseline) x 100)
```

**Output Format**:

```yaml
scores_by_dimension:
  performance:
    score: 85
    trend: improving | stable | declining
    metrics:
      - name: response_time_p95
        value: 120ms
        baseline: 150ms
        score: 125
  availability:
    score: 92
    trend: stable
    metrics:
      - name: sla_achievement
        value: 99.9%
        target: 99.95%
        score: 99.5
  satisfaction:
    score: 78
    trend: declining
    metrics:
      - name: nps
        value: 35
        benchmark: 40
        score: 87.5
  business:
    score: 88
    trend: improving
    metrics:
      - name: conversion_rate
        value: 4.2%
        baseline: 4.0%
        score: 105
```

### Step 3: Trend Prediction [Core]

**Goal**: Predict future health trends based on historical data

**Analysis Methods**:
- Moving Average (MA)
- Exponential Smoothing (Holt-Winters)
- Trend Extrapolation (Linear/Polynomial Regression)

**Prediction Dimensions**:
- 7-day trend prediction
- 30-day trend prediction
- Seasonality analysis (if applicable)

**Output Format**:

```yaml
trend_analysis:
  prediction_horizon: 7d | 30d
  overall_trend:
    direction: up | down | stable
    change_rate: {percentage}
    confidence: {percentage}
  dimension_trends:
    - dimension: performance
      current: 85
      predicted_7d: 83
      predicted_30d: 80
      risk_alert: true | false
```

### Step 4: Bottleneck Identification [Core]

**Goal**: Identify key bottlenecks affecting overall health

**Analysis Methods**:
- Dimension weighted contribution analysis
- Period-over-period/year-over-year anomaly detection
- Competitor benchmarking analysis

**Bottleneck Classification**:

| Level | Definition | Response Requirement |
|-------|------------|----------------------|
| P0 | Severe threat to business metrics | Immediate action |
| P1 | Significant impact on user experience | Action this week |
| P2 | Potential risk | Planned action |
| P3 | Optimization item | Continuous follow-up |

**Output Format**:

```yaml
bottlenecks:
  - id: BOT-001
    dimension: satisfaction
    severity: P1
    description: "NPS declining for 3 consecutive weeks"
    root_cause: "Payment flow conversion rate declining"
    impact_score: 8
    affected_metrics: [nps, conversion_rate]
    recommendation: "Optimize payment flow"
```

### Step 5: Comprehensive Report [Core]

**Goal**: Generate comprehensive health diagnosis report

**Report Structure**:
1. Executive Summary (Overall Score + Key Findings)
2. Detailed Scores by Dimension
3. Trend Analysis
4. Bottleneck List
5. Improvement Recommendations

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | health score and issue list | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full diagnosis + health trend analysis + root cause deep inference + improvement priority roadmap | Full deliverables + extended analysis + deep simulation |

## Output


**Output file path**: `output/pm-monitoring/diagnosis-health/`
**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_id", "overall_score", "scores_by_dimension"],
  "properties": {
    "report_id": {"type": "string", "description": "Report unique identifier"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "period": {"type": "object", "description": "Assessment period, including start and end times"},
    "overall_score": {"type": "number", "description": "Overall health score"},
    "score_trend": {"type": "string", "description": "Score trend: improving/stable/declining"},
    "scores_by_dimension": {"type": "object", "description": "Scores by dimension, including performance/availability/satisfaction/business"},
    "trend_analysis": {"type": "object", "description": "Trend prediction, including 7-day and 30-day predicted changes"},
    "bottlenecks": {"type": "array", "description": "Bottleneck list, including severity and dimension"},
    "recommendations": {"type": "array", "description": "Improvement recommendation list, including priority and expected impact"}
  }
}
```

```
├── {date}/
│   ├── overall_score.md
│   ├── dimension_scores.yaml
│   ├── trend_analysis.yaml
│   ├── bottlenecks.yaml
│   └── recommendations.md
└── latest/
    └── health_report.md
```

### Health Report Output Format

```yaml
health_diagnosis:
  report_id: {uuid}
  generated_at: {ISO8601}
  period:
    start: {ISO8601}
    end: {ISO8601}
  overall_score: 86
  score_trend: improving
  scores_by_dimension:
    performance: 85
    availability: 92
    satisfaction: 78
    business: 88
  trend_analysis:
    predicted_change_7d: -1
    predicted_change_30d: -3
  bottlenecks:
    - id: BOT-001
      severity: P1
      dimension: satisfaction
  recommendations:
    - priority: high
      action: "Optimize payment flow"
      expected_impact: "+5 NPS"
```

## Decision Rules

| Scenario | Decision Rule |
|----------|---------------|
| Dimension score < 60 | Mark red alert, generate specialized diagnosis |
| Dimension score 60-75 | Mark yellow alert, include in improvement plan |
| Dimension score > 85 | Mark green, maintain monitoring |
| Predicted trend declining | Generate preventive recommendations |
| Data missing > 30% | Mark data quality issue, skip that dimension scoring |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Data collection completeness >= 90%
- [ ] Score calculation accuracy (sample verification)

### P1 Checks (must pass for standard/deep)

- [ ] Trend prediction deviation +/-10%
- [ ] Bottleneck identification coverage >= 90%
- [ ] Recommendation executability >= 80%
- [ ] Report generation timeliness (< 5 minutes)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|------------------|---------------|
| Performance data | User provides response time, throughput and other key performance metric values, AI scores directly | Performance dimension direct scoring results, lacking auto-collected data |
| Availability data | User provides SLA achievement rate, failure count and other metrics, AI scores directly | Availability dimension direct scoring results, lacking auto-collected data |
| User satisfaction | User provides NPS/CSAT scores and complaint rate data, AI scores directly | Satisfaction dimension direct scoring results, lacking auto-collected data |
| Business metrics | User provides conversion rate, GMV, DAU/MAU, retention and other metrics, AI scores directly | Business dimension direct scoring results, lacking auto-collected data |
| Competitor dynamics | Skip competitor benchmarking, bottleneck identification based solely on self data | Health report without competitor benchmarking |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Multi-dimensional data missing**: Ask user to provide key metric values for each dimension, AI will score dimensions directly based on user-provided data, skipping auto-collection and standardization steps
2. **Partial dimensions missing**: Score only dimensions with available data, mark missing dimensions as "insufficient data", overall score calculated based on available dimensions only with confidence noted
3. **Competitor dynamics missing**: Skip competitor benchmarking analysis, bottleneck identification relies solely on self data trends and threshold judgments, recommend supplementing competitor data later to improve analysis

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| report_id | string | Yes | Report unique identifier |
| overall_score | number | Yes | Overall health score, range 0-100 |
| score_trend | string | Yes | Score trend, only improving/stable/declining allowed |
| scores_by_dimension | object | Yes | Scores by dimension, must contain performance/availability/satisfaction/business |
| trend_analysis | object | No | Trend prediction, must contain predicted_change_7d/predicted_change_30d |
| bottlenecks | array | No | Bottleneck list, each must contain id/severity/dimension |
| bottlenecks[].severity | string | Yes | Severity, only P0/P1/P2/P3 allowed |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|-----------------|-------------|--------------|-----------------|
| APM/Monitoring system | Performance metric definition change | Performance dimension scoring and baseline comparison | Recalculate scores per new definition |
| Monitoring system | Availability data format change | Availability dimension scoring | Adapt to new format, supplement missing fields |
| Feedback system | Satisfaction metric change | Satisfaction dimension scoring | Update scoring algorithm and weights |
| Data analytics platform | Business metric definition change | Business dimension scoring and trend prediction | Recalculate scores and predictions per new definition |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|---------------------|------------------------|---------------------|----------------------|
| diagnosis-orchestrator | Health diagnosis completed | Output file update | Diagnosis completion status and key bottlenecks |
| monitoring-pipeline | Health score anomaly | Write to output file | Anomalous dimensions and bottleneck details |
| iteration-decision | P0/P1 bottleneck identified | Write to output file | Bottleneck description and improvement recommendations |
