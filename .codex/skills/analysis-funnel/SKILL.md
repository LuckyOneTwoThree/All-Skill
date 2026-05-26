---
name: analysis-funnel
description: Use when analyzing user conversion paths is needed. Automated funnel analysis, AI automatically executes full funnel calculation, multi-dimensional drill-down, drop-off node identification, and trend analysis. Keywords: funnel analysis, conversion analysis, drop-off node, conversion rate, user path, where are users dropping off, conversion is too low, users can't complete the flow.
metadata:
  module: "Product Metrics Operations"
  sub-module: "Data Analysis"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["E-commerce", "Internet", "General"]
  trigger_examples:
    - "Registration flow conversion rate is too low, help me analyze"
    - "At which step do users drop off the most"
    - "Help me look at the payment conversion funnel"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Directly output funnel analysis and conversion bottlenecks"
  deep_description: "Complete analysis + funnel segmentation breakdown + conversion optimization simulation + multi-dimensional attribution analysis"
---

# Automated Funnel Analysis

## Core Principles

1. **Drop-off equals opportunity**: Every drop-off node is an optimization entry point; the largest drop-off point = the largest improvement potential
2. **Drill-down enables attribution**: Overall conversion rate only tells you "there's a problem"; multi-dimensional drill-down tells you "where the problem is"
3. **Comparison enables judgment**: Absolute values are meaningless; period-over-period and year-over-year comparisons are needed to judge trend health

## Interaction Mode

🤖 AI Auto-Execution (Data Analysis Type)

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Funnel Definition | object | Yes | User-provided | Step definitions and event configurations for the funnel |
| Event Data | object | Yes | User-provided | Tracking event data |
| Segment Configuration | object | ○ | User-provided | Optional user segmentation dimensions |
| Comparison Period | string | ○ | User-provided | Which time period to compare against |

## Supported Funnel Types

| Type | Example |
|-----|------|
| Conversion Funnel | Browse → Click → Add to Cart → Place Order → Pay |
| Activation Funnel | Register → First Use → Complete Onboarding |
| Payment Funnel | Impression → Click → Details → Pay → Repurchase |
| Search Funnel | Search → Results Page → Detail Page → Add to Cart |

## Execution Steps

### Step 1: Full Funnel Calculation [Core]

```
Retrieve funnel definition
├── Query event data for each step
├── Calculate user count at each step
├── Calculate step-to-step conversion rates
└── Calculate overall conversion rate
```

### Step 2: Multi-Dimensional Drill-Down [Core]

Perform multi-dimensional segmentation analysis on the funnel:

| Dimension | Segmentation Items |
|-----|--------|
| Platform | iOS, Android, Web, Mini Program |
| Channel | Organic traffic, paid channels, referral sources |
| User Type | New/returning users, paid/free, high-value/regular |
| Version | Grouped by App version |
| Region | Grouped by country/province |
| Time | Grouped by hour/day/week |

### Step 3: Largest Drop-off Node Identification [Core]

```
Analyze drop-off rate at each step
├── Identify the step with the highest drop-off rate
├── Analyze characteristics of dropped-off users at that step
├── Correlate user behaviors before drop-off
└── Identify drop-off cause hypotheses
```

### Step 4: Trend Analysis [Core]

- **Time Trend**: Daily/weekly/monthly changes in conversion rates at each step
- **Comparative Analysis**: Comparison with the previous period
- **Forecast**: Predict future performance based on trends

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Funnel analysis and conversion bottlenecks | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output including all Step outputs |
| deep | Complete analysis + funnel segmentation breakdown + conversion optimization simulation + multi-dimensional attribution analysis | Complete output + extended analysis + deep reasoning |

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
  
  # Funnel basic information
  funnel_name: "E-commerce Purchase Conversion Funnel"
  date_range:
    start: "2024-01-08"
    end: "2024-01-14"
  
  # Funnel step data
  steps:
    - step: 1
      name: "Product Detail Page View"
      event: "product_view"
      count: 500000
      conversion_from_previous: 100.0  # First step is 100%
      
    - step: 2
      name: "Add to Cart"
      event: "add_to_cart"
      count: 80000
      conversion_from_previous: 16.0
      dropoff_from_previous: 420000
      
    - step: 3
      name: "Initiate Checkout"
      event: "checkout_start"
      count: 50000
      conversion_from_previous: 62.5
      dropoff_from_previous: 30000
      
    - step: 4
      name: "Complete Payment"
      event: "purchase_complete"
      count: 35000
      conversion_from_previous: 70.0
      dropoff_from_previous: 15000
  
  # Overall conversion rate
  overall_conversion: 7.0  # From first step to final payment
  
  # Comparison with previous period
  vs_last_period:
    change_pct: -5.2
    trend: "declining"
    significant_steps:
      - step: 2  # Add-to-cart conversion declined
        change: -8.3
      - step: 3  # Checkout conversion declined
        change: -3.1
  
  # Critical drop-off analysis
  critical_drop:
    step: 1_to_2  # From browse to add-to-cart
    dropoff_rate: 84.0  # Drop-off rate
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
      - "Product prices are higher than user expectations"
      - "Detail page information is not compelling enough"
      - "Recommendation algorithm is not precise enough"
    
    optimization_suggestions:
      - "Optimize product pricing strategy"
      - "Improve detail page design and content"
      - "Optimize recommendation algorithm to improve relevance"
  
  # Detailed report links
  reports:
    funnel_chart: "output/pm-metrics-ops/analysis-funnel/charts/funnel_purchase_20240114.png"
    trend_chart: "output/pm-metrics-ops/analysis-funnel/charts/funnel_trend_20240114.png"
    dimension_data: "output/pm-metrics-ops/analysis-funnel/data/funnel_dimensions_20240114.json"
```

## Multi-Dimensional Drill-Down Example

```yaml
# Platform dimension analysis
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

# User type dimension analysis
user_type_breakdown:
  new_users:
    conversion: 5.2
    main_drop: "step_2_to_3"  # High drop-off at checkout
    
  returning_users:
    conversion: 9.8
    main_drop: "step_1_to_2"  # High drop-off at add-to-cart
```

## Funnel Definition Configuration

```yaml
# Funnel configuration example
funnel_definitions:
  - name: "purchase_conversion"
    description: "E-commerce Purchase Conversion Funnel"
    steps:
      - name: "Product Detail Page View"
        event: "product_view"
        conditions:
          page_type: "product_detail"
          
      - name: "Add to Cart"
        event: "add_to_cart"
        
      - name: "Initiate Checkout"
        event: "checkout_start"
        
      - name: "Complete Payment"
        event: "purchase_complete"
        conditions:
          payment_status: "success"
    
    conversion_window: 7d  # Conversion counted if completed within 7 days
    
    exclusion_events:
      - event: "refund_complete"
        window: 30d
```

## Execution Frequency

- **Daily Analysis**: Execute daily at 8:00
- **On-Demand Analysis**: Manually trigger analysis for specific funnels
- **Real-time Monitoring**: Real-time monitoring of core conversion nodes

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
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
| funnel_analysis.critical_drop.potential_causes | array | Yes | List of potential causes |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Funnel definition change | Step configuration and conversion calculation | Re-execute full funnel calculation, flag changed steps |
| Event data update | Conversion rates and drop-off analysis | Incrementally update conversion data, re-evaluate drop-off nodes |
| Segment configuration change | Multi-dimensional drill-down dimensions | Update drill-down dimensions, re-execute segment analysis |
| Comparison period change | Period-over-period and year-over-year comparison | Re-execute comparative analysis, update trend judgment |

When funnel analysis itself changes, notification mechanism for downstream:

| Analysis Change Type | Notification Scope | Notification Method |
|-------------|----------|----------|
| Key step conversion rate decline > 10% | decision-dace | Flag alert, trigger insight conversion |
| Drop-off node change | data-analysis-report | Flag drop-off change, trigger report update |
| Overall conversion rate trend change | decision-dace | Flag trend change, trigger DACE Analyze |

---

## Decision Rules

| Situation | Handling Method |
|------|----------|
| Key step conversion rate decline > 10% | Trigger alert, flag as priority optimization item |
| Overall conversion rate below industry benchmark | Generate full-funnel optimization recommendations |
| New user conversion rate significantly lower than returning users | Recommend optimizing new user onboarding flow |
| Multi-dimensional drill-down reveals significant differences | Generate targeted optimization plan |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Funnel step definitions are complete with no omissions
- [ ] Conversion rate calculation is based on full data

### P1 Checks (must pass for standard/deep)

- [ ] Drop-off node identification includes cause hypotheses
- [ ] Multi-dimensional drill-down covers at least 3 dimensions

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep reasoning and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|----------|----------|----------|
| Funnel definition missing | Prompt user to provide funnel steps and data for each step, calculate conversion rates directly | Funnel steps based on user description, may be incomplete |
| Event data missing | User provides funnel steps and data for each step → calculate conversion rates directly | Cannot automatically retrieve data, relies on user input |
| Both funnel definition and event data missing | User provides funnel steps and data for each step → calculate conversion rates directly | Output basic conversion rate calculation results, multi-dimensional drill-down marked as "to be supplemented" |

- If user does not provide segment configuration, prompt user to provide or skip steps related to this input
- If user does not provide comparison period, prompt user to provide or skip steps related to this input

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Funnel Steps**: Names and order of each step in the conversion funnel
- **Step Data**: User count or event count for each step
- **Comparison Period** (optional): Time period to compare against

## Key Metrics

| Metric | Calculation Method | Healthy Range |
|-----|---------|---------|
| Overall Conversion Rate | Final conversions / Entering users | Varies by business |
| Step Conversion Rate | Next step / Current step | Varies by step |
| Drop-off Rate | Dropped-off users / Previous step users | < 50% ideal |
| Funnel Efficiency | Actual conversion / Theoretical optimal | > 60% good |
