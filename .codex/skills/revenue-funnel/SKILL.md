---
name: revenue-funnel
description: Use when you need to analyze and optimize the paid conversion funnel. Paid Funnel Auto-Analysis Pipeline, analyzes the full journey data from registration to payment, identifies payment barriers, calculates conversion optimization suggestions, and optimizes paywall timing. Keywords: paid funnel, paid conversion, paywall, conversion optimization, payment analysis, unwilling to pay, where payment gets stuck, how to get users to pay.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Monetization"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Why are users unwilling to pay"
    - "How to improve paid conversion rate"
    - "Where is the best place to put the paywall"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output paid funnel and conversion bottlenecks"
  deep_description: "Complete analysis + funnel optimization simulation + pricing elasticity testing + revenue prediction model"
---

# Paid Funnel Auto-Analysis

## Core Principles

1. **Payment is value confirmation, not a barrier**: The timing and method of the paywall should make users feel "worth paying for" rather than "forced to pay"
2. **Barrier type determines optimization direction**: Five types of barriers — awareness, price, trust, need, and timing — require completely different optimization strategies
3. **Paywall timing equals conversion rate**: The same product can have a 3x difference in conversion rate under different paywall timing

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Registration to payment full journey data | object | Yes | User provided | Event logs, user behavior |
| Payment conversion data | object | Yes | output/pm-growth/revenue-nrr/nrr_analysis.json | Paying users, payment amounts, paid products |
| User characteristic data | object | ○ | User provided | User profiles, segment tags |

## Paid Funnel Stage Definitions

```
Registration → Activation → Deep Usage → Payment Intent → First Payment → Repeat Purchase
```

### Stage 1: Registered Users
- Users who have completed account registration
- Key metrics: Registration volume, registration source

### Stage 2: Activated Users
- Completed activation behavior (Aha Moment reached)
- Key metrics: Activation rate, D1 retention

### Stage 3: Deep Usage Users
- Multiple uses of core features
- Key metrics: Usage frequency, number of features used

### Stage 4: Payment Intent Users
- Showing payment intent (viewing pricing, trying premium features)
- Key metrics: Payment intent conversion rate

### Stage 5: First Payment Users
- Completed first payment
- Key metrics: First payment conversion rate, first payment amount

### Stage 6: Repeat Purchase Users
- Completed renewal or additional purchase
- Key metrics: Renewal rate, upsell rate

## Execution Steps

### Step 1: Paid Funnel Layer-by-Layer Conversion Analysis [Core]

#### Funnel Calculation
Calculate conversion rate and drop-off rate for each layer:

```
Stage conversion rate = Current stage user count / Previous stage user count
Stage drop-off rate = 1 - Stage conversion rate
```

#### Multi-Dimensional Breakdown
- Breakdown by user segment (new users / existing users / high-value users)
- Breakdown by registration source (organic / paid / referral)
- Breakdown by product type
- Breakdown by time window

#### Trend Analysis
Analyze time trends of conversion rates at each layer:
- Week-over-week change
- Year-over-year change
- Anomaly detection

### Step 2: Payment Barrier Identification [Core]

#### Qualitative Barrier Analysis
| Barrier Type | Manifestation | Inferred Cause |
|---------|------|---------|
| Awareness barrier | Unaware of payment value | Insufficient value communication |
| Price barrier | Perceives price as too high | Pricing strategy issue |
| Trust barrier | Distrusts payment security | Insufficient trust building |
| Need barrier | Doesn't need premium features | Product-need mismatch |
| Timing barrier | Not the right time to pay | Improper payment timing |

#### Quantitative Barrier Analysis
- User behavior analysis: Key behaviors not completed
- Funnel drop-off analysis: Identify major drop-off points
- Survey/interview analysis: User feedback summary
- Competitor comparison analysis: Differences from competitors

### Step 3: Conversion Optimization Suggestions [Deep]

#### Optimization Direction Matrix
| Barrier Type | Optimization Strategy | Implementation Plan |
|---------|---------|---------|
| Awareness barrier | Strengthen value demonstration | Feature demos, case studies |
| Price barrier | Optimize pricing structure | Tiered pricing, bundle discounts |
| Trust barrier | Enhance trust endorsement | User reviews, certifications |
| Need barrier | Guide need discovery | Trial experience, feature guidance |
| Timing barrier | Optimize payment timing | Paywall adjustment, trigger optimization |

#### Priority Ranking
Rank based on impact coefficient and implementation difficulty:

```
Priority = Impact coefficient × Expected improvement / Implementation difficulty
```

### Step 4: Paywall Timing Optimization [Core]

#### Paywall Types
| Type | Characteristics | Applicable Scenarios |
|------|------|---------|
| Hard paywall | Cannot use without payment | High-value B2B products |
| Soft paywall | Feature limitations, trial available | Mass-market products |
| Hybrid paywall | Partial free + limited-time trial | Balance experience and conversion |

#### Optimal Payment Timing
Identify the best timing to trigger the paywall:
- After user completes Aha Moment
- When user reaches free version limit
- When user attempts to use paid features
- When user usage reaches peak

#### Trial Strategy Optimization
- Trial duration: 7 days vs 14 days vs 30 days
- Trial features: Full features vs core features
- Trial trigger: Trial on registration vs behavior-triggered trial

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Paid funnel and conversion bottlenecks | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output, including all Step outputs |
| deep | Complete analysis + funnel optimization simulation + pricing elasticity testing + revenue prediction model | Complete output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-growth/revenue-funnel/`

**Output File**: revenue_funnel.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["funnel", "bottlenecks"],
  "properties": {
    "funnel": {"type": "object", "description": "Paid funnel data, including user count and conversion rate at each stage"},
    "bottlenecks": {"type": "array", "description": "Bottleneck analysis list, including drop-off rate, impact score, and cause"},
    "optimization_suggestions": {"type": "array", "description": "Optimization suggestion list, including problem, solution, and expected improvement"},
    "paywall_timing": {"type": "object", "description": "Paywall timing recommendation, including optimal timing, type, and trial period"}
  }
}
```

`revenue_funnel`
```json
{
  "funnel": {
    "stages": [
      {
        "name": "Registered Users",
        "count": 100000,
        "percentage": 1.0
      }
    ],
    "overall_conversion_rate": 0.03,
    "avg_time_to_pay": 14.5
  },
  "bottlenecks": [
    {
      "from_stage": "Active Users",
      "to_stage": "Payment Intent Users",
      "drop_off_rate": 0.833,
      "impact_score": 0.9,
      "likely_cause": "Lack of payment value perception"
    }
  ],
  "optimization_suggestions": [
    {
      "target_stage": "Active→Payment Intent",
      "problem": "Insufficient payment value perception",
      "solution": "Optimize value demonstration and trial experience",
      "expected_improvement": "Conversion rate increase 20%",
      "priority": 1
    }
  ],
  "paywall_timing": {
    "optimal_timing": "After user completes Aha Moment",
    "optimal_paywall_type": "Feature-limited",
    "recommended_trial_period": "7 days",
    "expected_conversion_lift": "15%"
  }
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| funnel | object | Yes | Paid funnel data, must include stages/overall_conversion_rate |
| funnel.stages | array | Yes | Stage data, each item must include name/count |
| funnel.stages[].name | string | Yes | Stage name, cannot be empty |
| funnel.stages[].count | number | Yes | Stage user count, must be ≥0 |
| funnel.stages[].percentage | number | No | Proportion |
| funnel.overall_conversion_rate | number | Yes | Overall conversion rate, range 0-1 |
| funnel.avg_time_to_pay | string | No | Average payment conversion cycle |
| bottlenecks | array | Yes | Bottleneck list, each item must include from_stage/to_stage/drop_off_rate/impact_score |
| bottlenecks[].from_stage | string | Yes | Drop-off start stage |
| bottlenecks[].to_stage | string | Yes | Drop-off target stage |
| bottlenecks[].drop_off_rate | number | Yes | Drop-off rate, range 0-1 |
| bottlenecks[].impact_score | number | Yes | Impact score, range 0-1 |
| bottlenecks[].likely_cause | string | No | Likely cause |
| optimization_suggestions | array | No | Optimization suggestion list, each item must include target_stage/problem/solution |
| optimization_suggestions[].target_stage | string | Yes | Target stage |
| optimization_suggestions[].problem | string | Yes | Problem description |
| optimization_suggestions[].solution | string | Yes | Solution |
| optimization_suggestions[].expected_improvement | string | No | Expected improvement |
| optimization_suggestions[].priority | number | No | Priority |
| paywall_timing | object | No | Paywall timing, must include optimal_timing/optimal_paywall_type |
| paywall_timing.optimal_timing | string | Yes | Optimal trigger timing |
| paywall_timing.optimal_paywall_type | string | Yes | Optimal paywall type |
| paywall_timing.recommended_trial_period | string | No | Recommended trial period |
| paywall_timing.expected_conversion_lift | string | No | Expected conversion lift |

## Decision Rules

| Situation | Handling |
|------|----------|
| Active→Payment intent drop-off >80% | Prioritize optimizing value perception and trial experience |
| Paywall trigger timing is inappropriate | A/B test different trigger timings |
| First payment conversion rate <3% | Optimize pricing strategy and payment guidance |
| Awareness barrier is the primary barrier | Strengthen feature demos and case studies |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Paid funnel covers the full journey from registration to repeat purchase
- [ ] Barrier identification distinguishes qualitative and quantitative analysis

### P1 Checks (must pass for standard/deep)

- [ ] Optimization suggestions ranked by impact coefficient × implementation difficulty
- [ ] Paywall timing recommendations based on user behavior data

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Notes |
|----------|----------|----------|------------|
| Registration to payment full journey data missing | User provides payment conversion data → Analyze funnel | Funnel analysis only covers data nodes provided by user | Request user to provide user count and conversion rate at each paid funnel stage |
| Historical payment data missing | Skip payment trend analysis, analyze based on current data only | Unable to evaluate payment conversion trends | Request user to provide historical payment conversion rate and paying user count trends |
| User characteristic data missing | Skip multi-dimensional breakdown analysis, output overall funnel only | Unable to break down funnel by user segments, barrier attribution precision reduced | Request user to provide user profile and segment tag data |
| Full journey data + Historical payment data both missing | User provides payment conversion data → Analyze funnel | Output basic paid funnel analysis, optimization suggestions marked "to be verified" | Request user to provide stage conversion data, pricing plans, and paying user characteristics |

### Data Acquisition Notes

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Payment conversion data**: User count and conversion rate at each paid funnel stage
- **Pricing plans** (optional): Product pricing tiers and prices
- **Paying user characteristics** (optional): Key differences between paying and free users

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| revenue-nrr | NRR data update | Payment conversion trends and funnel comparison | Update conversion rate baseline and trend analysis |
| User provided - Full journey data | Data口径 change | Funnel calculation and barrier identification | Recalculate funnel based on new data口径 |
| User provided - User characteristics | Segment dimension change | Multi-dimensional breakdown analysis | Re-breakdown funnel based on new dimensions |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| revenue-upsell | Paywall timing change | Write to output file | New paywall timing and trial strategy |
| revenue-orchestrator | Paid funnel analysis complete | Output file update | Funnel analysis completion status and key conclusions |

## Key Success Metrics

| Metric | Definition | Target Value |
|------|------|--------|
| Active user payment conversion rate | Paying users / Active users | ≥5% |
| Paid funnel overall conversion rate | First payment users / Registered users | ≥3% |
| Average payment conversion cycle | Average days from registration to first payment | ≤14 days |
| First payment ARPU | Average first payment amount | Continuously improving |
