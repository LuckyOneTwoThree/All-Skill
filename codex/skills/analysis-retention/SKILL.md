---
name: analysis-retention
description: "Use when analyzing user stickiness and churn risk. Retention auto-analysis with full retention curve, Cohort analysis, Aha Moment search and churn prediction. Keywords: Retention analysis, Cohort analysis, Aha Moment, churn prediction, user stickiness, user not returning, retention too low."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Data Analysis"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "New user D7 retention is only 15%, help me analyze"
    - "When do users start churning"
    - "Help me find the Aha Moment"
---

# Retention Auto-Analysis

## Core Principles

1. **Retention is the ultimate metric of product health**: Acquisition determines the ceiling, retention determines the floor
2. **Aha Moment is the leverage for growth**: Finding the "aha moment" and increasing reach rate is more efficient than generalized optimization
3. **Prevention beats recovery**: Intervening before user churn is far less costly and more effective than recovering after churn

## Interaction Mode

AI AI auto-execution (data analysis type)

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| User behavior data | object | Yes | User provided | All user behavior events |
| Segment definition | object | O | User provided | User segmentation configuration |
| Cohort configuration | object | O | User provided | Cohort partitioning rules |
| Baseline date | string | O | User provided | Analysis baseline time |

## Execution Steps

### Step 1: Full Retention Curve

```
Calculate standard retention curve
├── Define time period (daily/weekly/monthly)
├── Calculate D1/D+7/D+30 retention rates
├── Plot retention curve
└── Identify curve shape
```

### Step 2: Retention Curve Shape Assessment

| Curve Shape | Characteristics | Implication |
|------------|----------------|-------------|
| Smile | Initial decline then recovery | Users continue using after forming habit |
| L-shape | Initial sharp decline then plateau | Product only satisfies one-time need |
| Steep decline | Rapid continuous decline | Product stickiness insufficient |
| Smooth | Slow steady decline | Healthy stable user base |

### Step 3: Cohort Auto-Analysis

Analyze retention changes by Cohort (same-period group):

```
Cohort partitioning
├── Time Cohort: By first use date
├── Channel Cohort: By first source
├── Behavior Cohort: By first behavior type
└── Value Cohort: By first-day value
```

### Step 4: Aha Moment Auto-Search

```
Identify "aha moment"
├── Analyze early behavior differences between retained vs. churned users
├── Calculate correlation coefficients of each behavior with retention
├── Find threshold behaviors (e.g., using feature X times)
└── Verify hypotheses
```

### Step 5: Churn Prediction Model

```
Churn risk assessment
├── Define churned users (inactive for N consecutive days)
├── Extract pre-churn behavior features
├── Build churn prediction model
└── Output high-risk user list
```

## Output

**Storage Path**: `output/pm-metrics-ops/analysis-retention/`
**Output File**: retention_analysis.json

Output files: retention_curve_{date}.png, cohort_heatmap_{date}.png, aha_moment_{date}.yaml, churn_risk_users_{date}.csv

**Output Schema**:

```json
{
  "type": "object",
  "required": ["overall"],
  "properties": {
    "overall": {"type": "object", "description": "Overall retention data, including key milestones, curve shape, and historical comparison"},
    "cohort_trend": {"type": "object", "description": "Cohort trend analysis, including monthly cohorts and insights"},
    "aha_moment_candidates": {"type": "array", "description": "Aha Moment candidate list, including behavior, retention lift, and statistical significance"},
    "churn_prediction": {"type": "object", "description": "Churn prediction, including high-risk user list and prediction model"},
    "lifecycle_stages": {"type": "array", "description": "Lifecycle stage segmentation"}
  }
}
```

```yaml
retention_analysis:
  analysis_time: "2024-01-15T10:00:00Z"

  overall:
    d1: 45.2
    d7: 28.5
    d30: 18.3

    curve_shape:
      type: "smooth_decline"
      description: "Slow steady decline, healthy shape"
      d1_to_d7_drop: -37%
      d7_to_d30_drop: -36%
      assessment: "healthy"

    vs_last_period:
      d1_change: +2.1
      d7_change: +1.5
      d30_change: +0.8
      trend: "improving"

  cohort_trend:
    summary: "Cohort retention has been steadily improving over the past 3 months"

    monthly_cohorts:
      - cohort: "2023-12"
        d1: 44.5
        d7: 27.2
        d30: 17.1

      - cohort: "2023-11"
        d1: 43.8
        d7: 26.8
        d30: 16.9

      - cohort: "2023-10"
        d1: 42.1
        d7: 25.5
        d30: 16.2

    insight: "Cohort performance improving month over month, new user quality improving"

  aha_moment_candidates:
    - rank: 1
      behavior: "Complete 3 UGC content posts in first week"
      retention_lift:
        with_behavior: 68.5
        without_behavior: 22.3
        lift: +46.2
      correlation: 0.82
      statistical_significance: 0.001
      recommendation: |
        Design onboarding mechanisms to encourage users to post UGC content in their first week

    - rank: 2
      behavior: "Add 5 friends on first day"
      retention_lift:
        with_behavior: 72.1
        without_behavior: 31.5
        lift: +40.6
      correlation: 0.78
      statistical_significance: 0.002
      recommendation: |
        Optimize friend recommendation algorithm and add-friend flow

    - rank: 3
      behavior: "Participate in 3 community activities in first week"
      retention_lift:
        with_behavior: 65.3
        without_behavior: 25.8
        lift: +39.5
      correlation: 0.75
      statistical_significance: 0.003
      recommendation: |
        Optimize new user activity onboarding

  churn_risk:
    distribution:
      high_risk: 12500
      medium_risk: 35000
      low_risk: 85000
      healthy: 180000

    high_risk_count: 12500
    high_risk_rate: 4.8

    pre_churn_behaviors:
      - "Hasn't opened the app for 3 consecutive days"
      - "Interaction frequency decreased 50%"
      - "Core feature usage reduced"
      - "Feedback/complaints increased"

    recommended_intervention:
      high_risk:
        - action: "Push re-engagement"
          trigger: "Hasn't opened for 2 consecutive days"
          template: "Re-engagement template_v2"
        - action: "Exclusive offer"
          trigger: "High-value user + hasn't opened for 3 consecutive days"
          offer: "7-day VIP trial"
        - action: "Customer service callback"
          trigger: "Churn warning + previous complaints"
          channel: "Manual phone call"

      medium_risk:
        - action: "Personalized recommendation optimization"
          description: "Adjust recommendation algorithm, increase content users are interested in"
        - action: "Feature reminder"
          description: "Push features users may be interested in but haven't used"

  reports:
    retention_curve: "output/pm-metrics-ops/analysis-retention/charts/retention_curve_20240114.png"
    cohort_heatmap: "output/pm-metrics-ops/analysis-retention/charts/cohort_heatmap_20240114.png"
    aha_analysis: "output/pm-metrics-ops/analysis-retention/data/aha_moment_20240114.yaml"
    churn_users: "output/pm-metrics-ops/analysis-retention/data/churn_risk_users_20240114.csv"
```

## Cohort Analysis Example

```yaml
time_cohort:
  table:
    headers: ["Cohort", "Users", "D1", "D7", "D30"]
    rows:
      - ["2024-01", 50000, 46.2, 29.5, 19.2]
      - ["2023-12", 48000, 45.8, 28.8, 18.5]
      - ["2023-11", 45000, 44.5, 27.5, 17.2]

  insight: |
    Cohort D30 retention improved from 17.2% to 19.2%,
    an 11.6% YoY increase, primarily attributed to Aha Moment optimization

channel_cohort:
  organic:
    d30: 22.5
    quality: "high"
  paid:
    d30: 15.2
    quality: "medium"
  referral:
    d30: 28.3
    quality: "excellent"
```

## Aha Moment Discovery Logic

```
Step 1: Data preparation
├── Extract new users' first N days of behavior
├── Label retained and churned users
└── Standardize behavior data

Step 2: Feature analysis
├── Calculate retention lift for each behavior
├── Find optimal threshold (triggering X times yields best effect)
├── Correlation analysis
└── Significance testing

Step 3: Validation
├── Group validation (retention comparison with/without the behavior)
├── Time window validation (Aha for different periods)
└── User segment validation (whether applicable to all users)
```

## Churn Prediction Configuration

```yaml
churn_prediction:
  churn_definition:
    inactive_days: 7

  early_signals:
    - days: 2
      signals:
        - "Hasn't opened app"
        - "Push notifications not clicked"

    - days: 4
      signals:
        - "Core feature usage < 30%"
        - "DAU/MAU decline > 50%"

    - days: 6
      signals:
        - "Almost all feature usage zeroed"
        - "Clear churn-intent behaviors"

  interventions:
    high_value:
      push_content: "Personalized re-engagement"
      offer: "Exclusive offer/benefits"
      escalation: "Manual customer service"

    medium_value:
      push_content: "Content recommendation"
      offer: "Feature guidance"

    low_value:
      push_content: "Generic re-engagement"
```

## Execution Frequency

- **Daily retention calculation**: Updated daily at 8:00
- **Cohort weekly report**: Generated every Monday
- **Aha Moment review**: Re-analyzed monthly
- **Churn prediction**: Real-time calculation

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| retention_analysis | object | Yes | Retention analysis root object |
| retention_analysis.overall | object | Yes | Overall retention data |
| retention_analysis.overall.d1 | number | Yes | D1 retention rate |
| retention_analysis.overall.d7 | number | Yes | D7 retention rate |
| retention_analysis.overall.d30 | number | Yes | D30 retention rate |
| retention_analysis.overall.curve_shape | object | Yes | Curve shape analysis |
| retention_analysis.overall.curve_shape.type | string | Yes | Shape type, enum: smile/L/steep_decline/smooth |
| retention_analysis.cohort_trend | object | Yes | Cohort trend analysis |
| retention_analysis.aha_moment_candidates | array | Yes | Aha Moment candidate list, at least 1 |
| retention_analysis.aha_moment_candidates[].rank | number | Yes | Ranking |
| retention_analysis.aha_moment_candidates[].behavior | string | Yes | Behavior description |
| retention_analysis.aha_moment_candidates[].retention_lift | object | Yes | Retention lift data |
| retention_analysis.aha_moment_candidates[].correlation | number | Yes | Correlation coefficient |
| retention_analysis.churn_risk | object | Yes | Churn risk analysis |
| retention_analysis.churn_risk.high_risk_count | number | Yes | High-risk user count |
| retention_analysis.churn_risk.high_risk_rate | number | Yes | High-risk user percentage |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| User behavior data update | Retention curve and Cohort | Recalculate retention curve, update Cohort analysis |
| Segment definition change | Cohort dimensions | Update segment configuration, re-execute Cohort analysis |
| Churn definition change | Churn prediction model | Rebuild churn prediction model, update high-risk user list |
| Baseline date change | Retention calculation baseline | Recalculate retention data, update trend judgment |

When retention analysis itself changes, notification mechanism to downstream:

| Analysis Change Type | Notification Scope | Notification Method |
|---------------------|-------------------|---------------------|
| D7 retention drop >5% | decision-dace | Flag alert, trigger insight transformation |
| Aha Moment candidate change | data-analysis-report | Flag candidate change, trigger report update |
| Churn risk level change | decision-dace | Flag risk change, trigger DACE Analyze |

---

## Decision Rules

| Situation | Handling Method |
|-----------|----------------|
| D7 retention drop >5% | Trigger churn warning, push alert |
| Retention curve shows steep decline | Flag product stickiness insufficient, recommend Aha optimization |
| Aha Moment reach rate <20% | Recommend optimizing onboarding guidance |
| High-risk churn users >5% | Trigger intervention strategy recommendation |

## Quality Checks

- [ ] Retention calculation based on full users not sampling
- [ ] Cohort analysis covers time, channel, behavior dimensions
- [ ] Aha Moment candidates pass significance testing
- [ ] Churn prediction model accuracy >70%

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|---------------|-----------------|---------------|
| User behavior data missing | User provides retention data -> direct analysis | Cannot perform Aha Moment search and Cohort drilldown |
| Segment definition missing | Analyze full users without segment differentiation | Cannot perform segment comparison analysis |
| User behavior data + Segment definition both missing | User provides retention data -> direct analysis | Output basic retention analysis, Cohort and Aha Moment annotated as "to be supplemented" |

### Data Acquisition Instructions

When upstream files are missing, the following information is needed from the user to support degraded generation:
- **Retention data**: Retention rate data for each period (D1/D7/D30, etc.)
- **Cohort data** (optional): Retention rate matrix grouped by time
- **Key behavior list** (optional): User behaviors potentially related to retention

## Key Metrics

| Metric | Description | Healthy Standard |
|--------|-------------|-----------------|
| D1 retention rate | D1 retention | > 40% excellent |
| D7 retention rate | D7 retention | > 25% good |
| D30 retention rate | D30 retention | > 15% acceptable |
| Retention curve shape | Curve trend | Smile/Smooth |
| Cohort improvement rate | Cohort D30 change | > 0% indicates improvement |
| Churn prediction accuracy | Prediction accuracy | > 70% usable |
