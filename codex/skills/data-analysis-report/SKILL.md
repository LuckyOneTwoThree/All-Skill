---
name: data-analysis-report
description: "Use when producing a complete data analysis report. Data insight report auto-generation, integrating funnel analysis, retention analysis, anomaly detection and decision insight data, supplementing trend interpretation and action recommendations, outputting structured Markdown report. Keywords: Data analysis report, data insight report, operations report, data report, analysis report."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Data Analysis"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me produce this month's data analysis report"
    - "Summarize the recent data situation"
    - "Generate an operations weekly report"
---

# Data Insight Report Auto-Generation

## Core Principles

1. **Data speaks, insights drive** -- Data is the starting point, insight is the endpoint, action is the purpose
2. **Anomalies first** -- Anomalies are more noteworthy than normalcy; anomalies are signals for improvement
3. **Deep attribution** -- Not just "what", but answering "why"
4. **Actionable conclusions** -- Every insight must correspond to an actionable action

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Funnel analysis | JSON | O | output/pm-metrics-ops/analysis-funnel/funnel_analysis.json | Funnel health, conversion rates, drop-off points |
| Retention analysis | JSON | O | output/pm-metrics-ops/analysis-retention/retention_analysis.json | Retention curves, churn warnings, cohorts |
| Anomaly detection | JSON | O | output/pm-metrics-ops/analysis-anomaly/ | Anomalous metrics, attribution, impact scope |
| Decision insights | JSON | O | output/pm-metrics-ops/decision-dace/decision_insight.json | Data-driven decision recommendations |
| Metrics system | JSON | O | output/pm-metrics-design/metrics-system/metrics_system.json | Metric definitions and baselines |
| Analysis time range | string | Yes | User provided | E.g., "2025 Q1", "Last 30 days" |
| Product/business info | string | O | User provided | Product name, core business metrics |

## Execution Steps

### Step 1: Data Overview and Core Metrics

Integrate metrics system and analysis data to generate data overview:

**Core Metrics Dashboard**:

| Metric | Current Value | MoM Change | YoY Change | Trend | Status |
|--------|--------------|------------|------------|-------|--------|
| North Star metric | | | | ^v-> | [GREEN][YELLOW][RED] |
| Core conversion rate | | | | | |
| Retention rate (D7/D30) | | | | | |
| DAU/MAU | | | | | |
| ARPU | | | | | |

**Data Quality Statement**:
- Data coverage scope
- Data completeness assessment
- Known data biases

### Step 2: Funnel Health Analysis

Integrate funnel data to generate funnel analysis chapter:

**Full-Funnel**:
```
Impression -> Click -> Register -> Activate -> First Payment -> Repurchase
  v        v       v        v         v           v
 95%     45%     32%     68%      25%         40%
```

**Key Findings**:
- Largest drop-off point (step with highest drop-off rate)
- Largest improvement opportunity (step where conversion improvement has greatest overall impact)
- Step with largest MoM change
- Anomalous fluctuation points

**Each key finding includes**:
- Data facts (precise numbers)
- MoM/YoY comparison
- Possible causes (at least 2 hypotheses)
- Verification recommendations

### Step 3: Retention and Lifecycle Analysis

Integrate retention data to generate retention analysis chapter:

**Retention Curve Description**:
- D1/D7/D30 retention rates
- Retention curve shape (L-shaped/declining/stable)
- Cohort comparison (retention differences across user cohorts)

**Lifecycle Stage Segmentation**:

| Stage | Definition | Percentage | Characteristics |
|-------|-----------|-----------|----------------|
| Newcomer | 0-3 days after registration | | High activity, high churn risk |
| Growth | 4-14 days | | Feature exploration, habit formation |
| Mature | 15-90 days | | Stable usage, value perception |
| Decline | 90+ days with declining activity | | Decreasing usage frequency |
| Churned | Inactive for N consecutive days | | Needs re-engagement strategy |

**Churn Warning**:
- High-risk user characteristics
- Pre-churn behavior signals
- Re-engagement window

### Step 4: Anomaly Attribution Analysis

Integrate anomaly detection data to generate anomaly analysis chapter:

**Anomaly Event List**:

| Time | Metric | Anomaly Type | Deviation | Impact Scope | Attribution | Confidence |
|------|--------|-------------|-----------|-------------|------------|------------|
| | | Spike/Drop/Trend shift | +/-X% | User count/Revenue | Internal/External | High/Medium/Low |

**Attribution Analysis Framework**:
- Internal: Product changes, technical failures, marketing campaigns
- External: Market changes, competitor actions, seasonal factors
- Data: Statistical bias, missing data, metric definition changes

### Step 5: Insights and Action Recommendations

Integrate all analysis data to extract insights and action recommendations:

**Insight Extraction Rules**:
- Each insight = data fact + business implication + action direction
- Insights sorted by business impact

**Action Recommendation Template**:

| Priority | Recommendation | Target Metric | Expected Lift | Implementation Difficulty | Validation Method |
|----------|---------------|--------------|--------------|--------------------------|-------------------|
| P0 | | | | Low/Medium/High | A/B test/Before-after comparison |
| P1 | | | | | |
| P2 | | | | | |

**Recommendation Categories**:
- Quick Win: Low difficulty, high impact
- Core Optimization: Medium difficulty, high impact
- Long-term Investment: High difficulty, high impact
- Watch Items: Need more data verification

### Step 6: Report Assembly

**Report Structure**:

```
# {Product Name} Data Analysis Report ({Time Range})

## Executive Summary
- Core metrics overview
- 3 key findings
- Top 1 action recommendation

## 1. Data Overview
### 1.1 Core Metrics Dashboard
### 1.2 Data Quality Statement

## 2. Funnel Analysis
### 2.1 Full Funnel
### 2.2 Key Drop-off Points
### 2.3 Improvement Opportunities

## 3. Retention Analysis
### 3.1 Retention Curve
### 3.2 Lifecycle Stages
### 3.3 Churn Warning

## 4. Anomaly Analysis
### 4.1 Anomaly Event List
### 4.2 Attribution Analysis

## 5. Insights and Action Recommendations
### 5.1 Core Insights
### 5.2 Action Recommendations (by priority)

## Appendix
- Data sources and definitions
- Metric definitions
- Statistical method descriptions
```

## Output

**Storage Path**: `output/pm-metrics-ops/data-analysis-report/`

**Output Files**:

| File | Format | Description |
|------|--------|-------------|
| data-analysis-report.md | Markdown | Complete data analysis report |
| data-analysis-report.json | JSON | Structured data (for downstream Skill reference) |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_metadata", "executive_summary", "insights", "recommendations"],
  "properties": {
    "report_metadata": {"type": "object", "description": "Report metadata, including product name, time range, and data sources"},
    "executive_summary": {"type": "object", "description": "Executive summary, including key metrics, findings, and top recommendation"},
    "funnel_analysis": {"type": "object", "description": "Funnel analysis, including full funnel, largest drop-off, and opportunity points"},
    "retention_analysis": {"type": "object", "description": "Retention analysis, including key milestones and lifecycle stages"},
    "anomaly_analysis": {"type": "object", "description": "Anomaly analysis, including events and attribution"},
    "insights": {"type": "array", "description": "Insight list, including data facts, business implications, and action directions"},
    "recommendations": {"type": "array", "description": "Recommendation list, including priority, expected lift, and validation method"}
  }
}
```

**data-analysis-report.json Structure**:

```json
{
  "report_metadata": {
    "product": "Product Name", "time_range": "Analysis time range",
    "generated_at": "Timestamp", "data_sources": [], "data_quality": ""
  },
  "executive_summary": {
    "key_metrics": [], "key_findings": [], "top_recommendation": ""
  },
  "funnel_analysis": {
    "full_funnel": [], "biggest_drop": {},
    "biggest_opportunity": {}, "key_findings": []
  },
  "retention_analysis": {
    "d1": 0, "d7": 0, "d30": 0, "curve_shape": "",
    "lifecycle_stages": [], "churn_warnings": []
  },
  "anomaly_analysis": { "events": [], "attributions": [] },
  "insights": [
    { "id": "INS-001", "fact": "Data fact", "implication": "Business implication", "action_direction": "Action direction" }
  ],
  "recommendations": [
    { "id": "REC-001", "description": "Recommendation description", "target_metric": "Target metric",
      "expected_lift": "Expected lift", "difficulty": "Low/Medium/High",
      "category": "Quick Win/Core Optimization/Long-term Investment/Watch Item", "priority": "P0/P1/P2",
      "validation_method": "Validation method" }
  ]
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| report_metadata | object | Yes | Report metadata |
| report_metadata.product | string | Yes | Product name |
| report_metadata.time_range | string | Yes | Analysis time range |
| report_metadata.data_sources | array | Yes | Data source list |
| report_metadata.data_quality | string | Yes | Data quality statement |
| executive_summary | object | Yes | Executive summary |
| executive_summary.key_findings | array | Yes | Key findings list, at least 3 |
| executive_summary.top_recommendation | string | Yes | Top recommendation |
| funnel_analysis | object | No | Funnel analysis chapter |
| retention_analysis | object | No | Retention analysis chapter |
| anomaly_analysis | object | No | Anomaly analysis chapter |
| insights | array | Yes | Insight list, at least 1 |
| insights[].id | string | Yes | Insight ID |
| insights[].fact | string | Yes | Data fact |
| insights[].implication | string | Yes | Business implication |
| insights[].action_direction | string | Yes | Action direction |
| recommendations | array | Yes | Recommendation list, at least 3 |
| recommendations[].id | string | Yes | Recommendation ID |
| recommendations[].priority | string | Yes | Priority, enum: P0/P1/P2 |
| recommendations[].validation_method | string | Yes | Validation method |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| Funnel analysis data update | Funnel analysis chapter | Update funnel data, re-evaluate drop-off points and improvement opportunities |
| Retention analysis data update | Retention analysis chapter | Update retention data, re-evaluate lifecycle and churn warning |
| Anomaly detection data update | Anomaly analysis chapter | Update anomaly events and attribution, re-evaluate insights |
| Decision insights update | Insights and recommendations chapter | Update insights and recommendations, flag for human confirmation |
| Metrics system change | Core metrics dashboard | Update metric definitions and baselines, re-evaluate data overview |

When analysis report itself changes, notification mechanism to downstream:

| Report Change Type | Notification Scope | Notification Method |
|-------------------|-------------------|---------------------|
| P0 recommendation added | decision-dace | Flag P0 recommendation, trigger DACE Conclude |
| Key finding changed | decision-culture | Flag finding change, trigger report push |
| Data quality statement changed | All downstream | Flag quality change, trigger data source check |

---

## Decision Rules

| Condition | Decision |
|-----------|----------|
| Only funnel data available | Focus on funnel analysis, retention and anomaly chapters annotated as "lacking data" |
| Only retention data available | Focus on retention and lifecycle, funnel chapter annotated as "lacking data" |
| No anomaly data | Skip anomaly analysis chapter, annotate as "no anomaly detection data" |
| All analysis data missing | Generate framework report based on product info and AI knowledge, annotate as "lacking empirical data" |
| Time range >1 year | Recommend splitting into quarterly reports |

## Quality Checks

- [ ] Executive summary contains 3 key findings + Top 1 recommendation
- [ ] Core metrics dashboard complete
- [ ] Funnel analysis includes largest drop-off point and improvement opportunity
- [ ] Retention analysis includes lifecycle stages
- [ ] Each insight has data fact + business implication
- [ ] At least 3 action recommendations, each with priority and validation method
- [ ] Data scope and limitations documented

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------------------|-----------------|---------------|
| funnel-analysis missing | Funnel chapter annotated as "lacking funnel data" | Missing conversion analysis |
| retention-analysis missing | Retention chapter annotated as "lacking retention data" | Missing lifecycle analysis |
| anomaly-analysis missing | Skip anomaly analysis chapter | Missing anomaly attribution |
| decision-dace missing | Action recommendations derived from data analysis | Recommendations may lack depth |
| metrics-system missing | Core metrics based on user-provided info | Metric definitions may be incomplete |
- If user does not provide analysis time range, prompt user to provide or skip related steps
- If user does not provide product/business info, prompt user to provide or skip related steps
