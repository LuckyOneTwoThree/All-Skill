---
name: revenue-funnel
description: "Use when analyzing and optimizing payment conversion funnel. Payment funnel auto-analysis pipeline that analyzes registration-to-payment full-funnel data, identifies payment barriers, calculates conversion optimization recommendations, and optimizes paywall timing. Keywords: payment funnel, payment conversion, paywall, conversion optimization, payment analysis, conversion rate, paywall placement."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Revenue"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Why are users unwilling to pay"
    - "How to improve payment conversion rate"
    - "Where is the best paywall placement"
execution_depth:
  default: standard
  quick_description: "Output payment funnel and conversion bottlenecks"
  deep_description: "Full analysis + funnel optimization simulation + pricing elasticity testing + revenue prediction model"
---

# Payment Funnel Auto-Analysis

## Core Principles

1. **Payment is value confirmation not barrier**: Paywall timing and approach should make users feel "worth paying for" rather than "forced to pay"
2. **Barrier type determines optimization direction**: Awareness/Price/Trust/Need/Timing five barrier types require completely different optimization strategies
3. **Paywall timing is conversion rate**: The same product can have 3x conversion rate difference under different paywall timing

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Registration-to-Payment Full-Funnel Data | object | Yes | User provided | Event logs, user behavior |
| Payment Conversion Data | object | Yes | output/pm-growth/revenue-nrr/nrr_analysis.json | Paid users, payment amounts, paid products |
| User Profile Data | object | No | User provided | User profiles, segment labels |

## Payment Funnel Stage Definition

```
Registration -> Activation -> Deep Usage -> Payment Intent -> First Payment -> Repeat Purchase
```

### Stage 1: Registered Users
- Users who completed account registration
- Key metrics: Registration count, registration source

### Stage 2: Activated Users
- Completed activation behavior (Aha Moment reached)
- Key metrics: Activation rate, D1 retention

### Stage 3: Deep Usage Users
- Multiple uses of core features
- Key metrics: Usage frequency, feature usage count

### Stage 4: Payment Intent Users
- Showing payment intent (viewing pricing, trying premium features)
- Key metrics: Payment intent conversion rate

### Stage 5: First Payment Users
- Completed first payment
- Key metrics: First payment conversion rate, first payment amount

### Stage 6: Repeat Purchase Users
- Completed renewal or upsell
- Key metrics: Renewal rate, upsell rate

## Execution Steps

### Step 1: Payment Funnel Stage Conversion Analysis [Core]

#### Funnel Calculation
Calculate conversion rate and drop-off rate at each stage:

```
Stage conversion rate = Current stage user count / Previous stage user count
Stage drop-off rate = 1 - Stage conversion rate
```

#### Multi-dimensional Breakdown
- By user segment (new users/existing users/high-value users)
- By registration source (organic/paid/referral)
- By product type
- By time window

#### Trend Analysis
Analyze time trends of conversion rates at each stage:
- Week-over-week change
- Month-over-month change
- Anomaly detection

### Step 2: Payment Barrier Identification [Core]

#### Qualitative Barrier Analysis
| Barrier Type | Manifestation | Cause Inference |
|---------|------|---------|
| Awareness barrier | Doesn't understand payment value | Insufficient value communication |
| Price barrier | Considers price too high | Pricing strategy issue |
| Trust barrier | Doesn't trust payment security | Insufficient trust building |
| Need barrier | Doesn't need premium features | Product-need mismatch |
| Timing barrier | Not the right time to pay | Inappropriate payment timing |

#### Quantitative Barrier Analysis
- User behavior analysis: Key behaviors not completed
- Funnel drop-off analysis: Identify main drop-off points
- Survey/interview analysis: User feedback summary
- Competitor comparison analysis: Differences from competitors

### Step 3: Conversion Optimization Recommendations [Deep]

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
Priority = Impact coefficient x Expected improvement / Implementation difficulty
```

### Step 4: Paywall Timing Optimization [Deep]

#### Paywall Types
| Type | Characteristics | Applicable Scenarios |
|------|------|---------|
| Hard paywall | Cannot use without payment | High-value B2B products |
| Soft paywall | Feature limitations, trial available | Mass-market products |
| Hybrid paywall | Partial free + limited trial | Balance experience and conversion |

#### Optimal Payment Timing
Identify the best timing to trigger the paywall:
- After user completes Aha Moment
- When user reaches free tier limit
- When user tries to use premium features
- When user usage peaks

#### Trial Strategy Optimization
- Trial duration: 7 days vs 14 days vs 30 days
- Trial features: Full features vs core features
- Trial trigger: Registration triggers trial vs behavior-triggered trial

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | payment funnel and conversion bottlenecks | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full analysis + funnel optimization simulation + pricing elasticity testing + revenue prediction model | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-growth/revenue-funnel/`

**Output File**: revenue_funnel.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["funnel", "bottlenecks"],
  "properties": {
    "funnel": {"type": "object", "description": "Payment funnel data, including user count and conversion rate at each stage"},
    "bottlenecks": {"type": "array", "description": "Bottleneck analysis list, including drop-off rate, impact score, and cause"},
    "optimization_suggestions": {"type": "array", "description": "Optimization suggestions list, including issue, solution, and expected improvement"},
    "paywall_timing": {"type": "object", "description": "Paywall timing recommendations, including optimal timing, type, and trial period"}
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
      "target_stage": "Active->Payment Intent",
      "problem": "Insufficient payment value perception",
      "solution": "Optimize value demonstration and trial experience",
      "expected_improvement": "20% conversion rate increase",
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
| funnel | object | Yes | Payment funnel data, must contain stages/overall_conversion_rate |
| funnel.stages | array | Yes | Stage data, each item must contain name/count |
| funnel.stages[].name | string | Yes | Stage name, cannot be empty |
| funnel.stages[].count | number | Yes | Stage user count, must be >=0 |
| funnel.stages[].percentage | number | No | Percentage |
| funnel.overall_conversion_rate | number | Yes | Overall conversion rate, range 0-1 |
| funnel.avg_time_to_pay | string | No | Average time to payment conversion |
| bottlenecks | array | Yes | Bottleneck list, each item must contain from_stage/to_stage/drop_off_rate/impact_score |
| bottlenecks[].from_stage | string | Yes | Drop-off source stage |
| bottlenecks[].to_stage | string | Yes | Drop-off target stage |
| bottlenecks[].drop_off_rate | number | Yes | Drop-off rate, range 0-1 |
| bottlenecks[].impact_score | number | Yes | Impact score, range 0-1 |
| bottlenecks[].likely_cause | string | No | Likely cause |
| optimization_suggestions | array | No | Optimization suggestions list, each item must contain target_stage/problem/solution |
| optimization_suggestions[].target_stage | string | Yes | Target stage |
| optimization_suggestions[].problem | string | Yes | Problem description |
| optimization_suggestions[].solution | string | Yes | Solution |
| optimization_suggestions[].expected_improvement | string | No | Expected improvement |
| optimization_suggestions[].priority | number | No | Priority |
| paywall_timing | object | No | Paywall timing, must contain optimal_timing/optimal_paywall_type |
| paywall_timing.optimal_timing | string | Yes | Optimal trigger timing |
| paywall_timing.optimal_paywall_type | string | Yes | Optimal paywall type |
| paywall_timing.recommended_trial_period | string | No | Recommended trial period |
| paywall_timing.expected_conversion_lift | string | No | Expected conversion lift |

## Decision Rules

| Situation | Action |
|------|----------|
| Active->Payment intent drop-off >80% | Prioritize optimizing value perception and trial experience |
| Paywall trigger timing inappropriate | A/B test different trigger timings |
| First payment conversion rate <3% | Optimize pricing strategy and payment guidance |
| Awareness barrier is primary barrier | Strengthen feature demos and case studies |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Payment funnel covers registration to repeat purchase full chain
- [ ] Barrier identification distinguishes qualitative and quantitative analysis

### P1 Checks (must pass for standard/deep)

- [ ] Optimization suggestions ranked by impact coefficient x implementation difficulty
- [ ] Paywall timing recommendations based on user behavior data

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|----------|
| Registration-to-payment full-funnel data missing | User provides payment conversion data -> analyze funnel | Funnel analysis only covers data nodes provided by user | Request user to provide user count and conversion rate at each payment funnel stage, or upload funnel_data.json |
| Historical payment data missing | Skip payment trend analysis, analyze based on current data only | Cannot evaluate payment conversion trends | Request user to provide historical payment conversion rates, or upload payment_history.json |
| Full-funnel data + historical payment data both missing | User provides payment conversion data -> analyze funnel | Output basic payment funnel analysis, optimization suggestions marked "pending validation" | Request user to provide payment conversion data and pricing plan, or execute analysis-funnel first |
| User profile data not provided | Prompt user to provide or skip steps related to that input | Cannot perform user segment payment analysis | Prompt user to provide paid user characteristics for segment analysis |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| revenue-nrr | NRR data update | Payment conversion trends and funnel comparison | Update conversion rate baseline and trend analysis |
| User provided - full-funnel data | Data definition change | Funnel calculation and barrier identification | Recalculate funnel with new definition |
| User provided - user profile | Segment dimension change | Multi-dimensional breakdown analysis | Re-breakdown funnel by new dimensions |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| revenue-upsell | Paywall timing change | Write to output file | New paywall timing and trial strategy |
| revenue-orchestrator | Payment funnel analysis complete | Output file update | Funnel analysis completion status and key conclusions |

## Key Success Metrics

| Metric | Definition | Target Value |
|------|------|--------|
| Active user payment conversion rate | Paid users / Active users | >=5% |
| Payment funnel overall conversion rate | First payment users / Registered users | >=3% |
| Average payment conversion cycle | Average days from registration to first payment | <=14 days |
| First payment ARPU | Average first payment amount | Continuously improving |
