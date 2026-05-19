---
name: analysis-funnel
description: "Use when analyzing user conversion paths. Funnel auto-analysis with full funnel calculation, multi-dimensional drilldown, drop-off node identification and trend analysis. Keywords: Funnel analysis, conversion analysis, drop-off node, conversion rate, user path, user drop-off, conversion too low."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Data Analysis"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Registration flow conversion rate is too low, help me analyze"
    - "At which step do users drop off the most"
    - "Help me look at the payment conversion funnel"
---

# Funnel Auto-Analysis

## Core Principles

1. **Drop-off equals opportunity**: Every drop-off node is an optimization entry point; largest drop-off point = largest improvement potential
2. **Drilldown enables attribution**: Overall conversion rate only tells you "there's a problem"; multi-dimensional drilldown tells you "where the problem is"
3. **Comparison enables judgment**: Absolute values are meaningless; MoM and YoY comparison is needed to judge trend health

## Interaction Mode

AI AI auto-execution (data analysis type)

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Funnel definition | object | Yes | User provided | Step definitions and event configuration for the funnel |
| Event data | object | Yes | User provided | Tracking event data |
| Segment configuration | object | O | User provided | Optional user segmentation dimensions |
| Comparison period | string | O | User provided | Which time period to compare against |

## Supported Funnel Types

| Type | Example |
|------|---------|
| Conversion funnel | Browse->Click->Add to cart->Order->Pay |
| Activation funnel | Register->First use->Complete onboarding |
| Payment funnel | Impression->Click->Detail->Pay->Repurchase |
| Search funnel | Search->Results page->Detail page->Add to cart |

## Execution Steps

### Step 1: Full Funnel Calculation

```
Get funnel definition
├── Query event data for each step
├── Calculate user count at each step
├── Calculate step-to-step conversion rate
└── Calculate overall conversion rate
```

### Step 2: Multi-Dimensional Drilldown

Perform multi-dimensional breakdown analysis on the funnel:

| Dimension | Breakdown Items |
|-----------|----------------|
| Platform | iOS, Android, Web, Mini Program |
| Channel | Organic, paid, referral |
| User type | New/returning, paid/free, high-value/regular |
| Version | By App version |
| Region | By country/province |
| Time | By hour/day/week |

### Step 3: Largest Drop-off Node Identification

```
Analyze drop-off rate at each step
├── Find the step with highest drop-off rate
├── Analyze characteristics of dropped-off users at that step
├── Correlate user behavior before drop-off
└── Identify drop-off cause hypotheses
```

### Step 4: Trend Analysis

- **Time trend**: Daily/weekly/monthly changes in conversion rate at each step
- **Comparison analysis**: Compare with previous period
- **Prediction**: Predict future performance based on trends

## Output

**Storage Path**: `output/pm-metrics-ops/analysis-funnel/`
**Output File**: funnel_analysis.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["funnel_name", "steps", "overall_conversion"],
  "properties": {
    "funnel_name": {"type": "string", "description": "Funnel name"},
    "date_range": {"type": "object", "description": "Analysis time range, including start and end dates"},
    "steps": {"type": "array", "description": "Funnel step data, including event name, count, and conversion rate"},
    "overall_conversion": {"type": "number", "description": "Overall conversion rate"},
    "vs_last_period": {"type": "object", "description": "Comparison with previous period, including change trend and key steps"},
    "critical_drop": {"type": "object", "description": "Critical drop-off analysis, including dimension breakdown and potential causes"}
  }
}
```

```yaml
funnel_analysis:
  analysis_time: "2024-01-15T10:00:00Z"

  funnel_name: "E-commerce Purchase Conversion Funnel"
  date_range:
    start: "2024-01-08"
    end: "2024-01-14"

  steps:
    - step: 1
      name: "Product detail page view"
      event: "product_view"
      count: 500000
      conversion_from_previous: 100.0

    - step: 2
      name: "Add to cart"
      event: "add_to_cart"
      count: 80000
      conversion_from_previous: 16.0
      dropoff_from_previous: 420000

    - step: 3
      name: "Start checkout"
      event: "checkout_start"
      count: 50000
      conversion_from_previous: 62.5
      dropoff_from_previous: 30000

    - step: 4
      name: "Complete payment"
      event: "purchase_complete"
      count: 35000
      conversion_from_previous: 70.0
      dropoff_from_previous: 15000

  overall_conversion: 7.0

  vs_last_period:
    change_pct: -5.2
    trend: "declining"
    significant_steps:
      - step: 2
        change: -8.3
      - step: 3
        change: -3.1

  critical_drop:
    step: 1_to_2
    dropoff_rate: 84.0
    affected_users: 420000

    dimension_breakdown:
      platform:
        iOS: 82.0
        Android: 85.0
        Web: 88.0
      user_type:
        new_users: 78.0
        returning_users: 86.0
      traffic_source:
        search: 75.0
        recommendation: 90.0
        direct: 80.0

    potential_causes:
      - "Product price higher than user expectations"
      - "Detail page information not compelling enough"
      - "Recommendation algorithm not precise enough"

    optimization_suggestions:
      - "Optimize product pricing strategy"
      - "Improve detail page design and content"
      - "Optimize recommendation algorithm, improve relevance"

  reports:
    funnel_chart: "output/pm-metrics-ops/analysis-funnel/charts/funnel_purchase_20240114.png"
    trend_chart: "output/pm-metrics-ops/analysis-funnel/charts/funnel_trend_20240114.png"
    dimension_data: "output/pm-metrics-ops/analysis-funnel/data/funnel_dimensions_20240114.json"
```

## Multi-Dimensional Drilldown Example

```yaml
platform_breakdown:
  ios:
    step1_count: 200000
    step4_count: 15000
    conversion: 7.5
    vs_avg: +0.5

  android:
    step1_count: 250000
    step4_count: 16000
    conversion: 6.4
    vs_avg: -0.6

  web:
    step1_count: 50000
    step4_count: 4000
    conversion: 8.0
    vs_avg: +1.0

user_type_breakdown:
  new_users:
    conversion: 5.2
    main_drop: "step_2_to_3"

  returning_users:
    conversion: 9.8
    main_drop: "step_1_to_2"
```

## Funnel Definition Configuration

```yaml
funnel_definitions:
  - name: "purchase_conversion"
    description: "E-commerce purchase conversion funnel"
    steps:
      - name: "Product detail page view"
        event: "product_view"
        conditions:
          page_type: "product_detail"

      - name: "Add to cart"
        event: "add_to_cart"

      - name: "Start checkout"
        event: "checkout_start"

      - name: "Complete payment"
        event: "purchase_complete"
        conditions:
          payment_status: "success"

    conversion_window: 7d

    exclusion_events:
      - event: "refund_complete"
        window: 30d
```

## Execution Frequency

- **Daily analysis**: Execute daily at 8:00
- **On-demand analysis**: Manually trigger for specific funnels
- **Real-time monitoring**: Real-time monitoring of core conversion nodes

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| funnel_analysis | object | Yes | Funnel analysis root object |
| funnel_analysis.funnel_name | string | Yes | Funnel name |
| funnel_analysis.date_range | object | Yes | Analysis time range |
| funnel_analysis.date_range.start | string | Yes | Start date |
| funnel_analysis.date_range.end | string | Yes | End date |
| funnel_analysis.steps | array | Yes | Funnel step data, at least 2 steps |
| funnel_analysis.steps[].step | number | Yes | Step number |
| funnel_analysis.steps[].name | string | Yes | Step name |
| funnel_analysis.steps[].event | string | Yes | Event name |
| funnel_analysis.steps[].count | number | Yes | User count |
| funnel_analysis.steps[].conversion_from_previous | number | Yes | Step-to-step conversion rate |
| funnel_analysis.overall_conversion | number | Yes | Overall conversion rate |
| funnel_analysis.vs_last_period | object | Yes | Comparison with previous period |
| funnel_analysis.critical_drop | object | Yes | Critical drop-off analysis |
| funnel_analysis.critical_drop.step | string | Yes | Drop-off step |
| funnel_analysis.critical_drop.dropoff_rate | number | Yes | Drop-off rate |
| funnel_analysis.critical_drop.potential_causes | array | Yes | Potential cause list |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| Funnel definition change | Step configuration and conversion calculation | Re-execute full funnel calculation, flag changed steps |
| Event data update | Conversion rate and drop-off analysis | Incrementally update conversion data, re-evaluate drop-off nodes |
| Segment configuration change | Multi-dimensional drilldown dimensions | Update drilldown dimensions, re-execute segment analysis |
| Comparison period change | MoM and YoY comparison | Re-execute comparison analysis, update trend judgment |

When funnel analysis itself changes, notification mechanism to downstream:

| Analysis Change Type | Notification Scope | Notification Method |
|---------------------|-------------------|---------------------|
| Key step conversion rate drop >10% | decision-dace | Flag alert, trigger insight transformation |
| Drop-off node change | data-analysis-report | Flag drop-off change, trigger report update |
| Overall conversion rate trend change | decision-dace | Flag trend change, trigger DACE Analyze |

---

## Decision Rules

| Situation | Handling Method |
|-----------|----------------|
| Key step conversion rate drop >10% | Trigger alert, flag as priority optimization item |
| Overall conversion rate below industry benchmark | Generate full-funnel optimization recommendations |
| New user conversion rate significantly lower than returning users | Recommend optimizing new user onboarding flow |
| Multi-dimensional drilldown reveals significant differences | Generate targeted optimization plan |

## Quality Checks

- [ ] Funnel step definition complete, no omissions
- [ ] Conversion rate calculation based on full data
- [ ] Drop-off node identification includes cause hypotheses
- [ ] Multi-dimensional drilldown covers at least 3 dimensions

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|---------------|-----------------|---------------|
| Funnel definition missing | Prompt user to provide funnel steps and data for each step, calculate conversion rate directly | Funnel steps based on user description, may be incomplete |
| Event data missing | User provides funnel steps and data for each step -> calculate conversion rate directly | Cannot auto-acquire data, relies on user input |
| Funnel definition + Event data both missing | User provides funnel steps and data for each step -> calculate conversion rate directly | Output basic conversion rate calculation results, multi-dimensional drilldown annotated as "to be supplemented" |

- If user does not provide segment configuration, prompt user to provide or skip related steps
- If user does not provide comparison period, prompt user to provide or skip related steps

### Data Acquisition Instructions

When upstream files are missing, the following information is needed from the user to support degraded generation:
- **Funnel steps**: Names and order of each step in the conversion funnel
- **Data per step**: User count or event count at each step
- **Comparison period** (optional): Time period to compare against

## Key Metrics

| Metric | Calculation Method | Healthy Range |
|--------|-------------------|---------------|
| Overall conversion rate | Final conversion / Entry users | Varies by business |
| Step conversion rate | Next step / Current step | Varies by step |
| Drop-off rate | Dropped users / Previous step users | < 50% ideal |
| Funnel efficiency | Actual conversion / Theoretical optimal | > 60% good |
