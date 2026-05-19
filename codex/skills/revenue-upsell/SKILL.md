---
name: revenue-upsell
description: "Use when optimizing upgrade conversion strategy. Upgrade conversion automation pipeline that identifies upgrade signal users, auto-generates personalized upgrade content, optimizes outreach timing, and designs A/B tests. Keywords: upgrade conversion, upsell, upgrade strategy, cross-sell, premium upgrade, upgrade plan, upgrade package."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Revenue"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How to get users to upgrade their plan"
    - "Which users are suitable for upsell"
    - "How to implement cross-selling"
execution_depth:
  default: standard
  quick_description: "Output upsell strategies and opportunity list"
  deep_description: "Full strategy + upsell trigger design + customer tiered upsell model + upsell experiment plan"
---

# Upgrade Conversion Automation

## Core Principles

1. **Upgrade is value extension not sales**: Upgrade recommendations must be based on users' genuine usage needs and scenarios, not sales targets
2. **Signal strength determines timing**: Multiple strong signals trigger immediate guidance; weak signals require continuous nurturing; avoid too-early or too-late outreach
3. **Personalization is conversion rate**: The more upgrade content matches users' current usage scenarios, the higher the conversion rate

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User Behavior Data | object | Yes | User provided | Usage volume, feature usage, collaboration behavior |
| Payment History Data | object | Yes | output/pm-growth/revenue-nrr/nrr_analysis.json | Historical plans, payment amounts, payment cycles |
| Product Usage Data | object | No | User provided | Feature usage details, usage statistics |

## Upgrade Signal Types

### Type 1: Usage Limit Signals
| Signal | Description | Upgrade Potential |
|------|------|---------|
| Storage reaching limit | File storage approaching free tier limit | High |
| API call limit exceeded | API calls approaching quota | High |
| Seat capacity full | Team size reaching free tier limit | High |
| Feature usage limit | Some features have usage count limits | Medium |

### Type 2: Feature Need Signals
| Signal | Description | Upgrade Potential |
|------|------|---------|
| Premium feature access | Frequently accessing premium-only features | High |
| Collaboration feature usage | Using team collaboration features | High |
| API deep usage | Using advanced API features | High |
| Customization needs | Emerging customization requirements | Medium |

### Type 3: Behavioral Signals
| Signal | Description | Upgrade Potential |
|------|------|---------|
| High-frequency usage | Usage frequency far exceeding average users | High |
| Long-duration usage | Usage duration far exceeding average users | Medium |
| Multi-project operations | Simultaneously operating multiple projects/workspaces | High |
| Key feature usage | Using core business features | High |

### Type 4: Intent Signals
| Signal | Description | Upgrade Potential |
|------|------|---------|
| Pricing page visits | Frequently viewing paid pricing | High |
| Comparison page visits | Viewing different plan comparisons | High |
| Trial application | Applying for premium feature trial | High |
| Customer service inquiry | Inquiring about upgrade-related questions | High |

## Execution Steps

### Step 1: Upgrade Signal Identification [Core]

#### Signal Detection Rules
```yaml
signal_rules:
  usage_limit:
    - condition: "storage_usage >= 0.8 * free_limit"
      weight: 0.9
    - condition: "storage_usage >= 0.6 * free_limit"
      weight: 0.6
      
  feature_access:
    - condition: "premium_feature_access_count >= 5"
      weight: 0.8
      
  behavioral:
    - condition: "daily_active_days >= 5 AND avg_session > 30min"
      weight: 0.7
```

#### Signal Strength Calculation
```python
signal_strength = (
    signal_type_weight * 0.4 +
    behavior_frequency * 0.3 +
    recency_factor * 0.3
)
```

#### Upgrade Opportunity Scoring
```python
upgrade_score = (
    usage_signals * 0.35 +
    feature_signals * 0.30 +
    behavioral_signals * 0.20 +
    intent_signals * 0.15
)
```

#### Priority Stratification
| Priority | Score Range | Characteristics | Response Strategy |
|--------|---------|------|---------|
| P0 | >=0.8 | Multiple strong signals | Immediate upgrade guidance |
| P1 | 0.6-0.8 | Clear upgrade need | Proactive upgrade recommendation |
| P2 | 0.4-0.6 | Some upgrade signals | Scenario-based upgrade guidance |
| P3 | <0.4 | Potential upgrade need | Continuous nurturing |

### Step 2: Upgrade Content Personalization [Core]

#### Personalization Elements
| Element | Content Source | Description |
|------|---------|------|
| Username | User profile | Personalized greeting |
| Current usage | Product data | "You have used 80%" |
| Usage limits | Product data | Specific limitation scenarios |
| Upgrade benefits | Product info | What you get after upgrading |
| Recommended plan | Product pricing | Most suitable plan |

#### Personalized Content Template
```
Title: {Username}, you have reached {Product Name} {Limit Type} limit

Body: 
You have used {Current Usage}/{Free Limit} this month,
When usage reaches 100%, some features will be restricted.

Upgrade to {Recommended Plan}, you can:
[OK] {Benefit 1}
[OK] {Benefit 2}
[OK] {Benefit 3}

{Incentive message}

[Upgrade Now] [Learn More]
```

### Step 3: Outreach Timing Optimization [Deep]

#### Optimal Outreach Timing
| Timing | Trigger Condition | Effect |
|------|---------|------|
| Real-time trigger | When usage limit reached | Most relevant |
| Activity peak | During user activity peak hours | High outreach rate |
| After feature usage | After accessing/trying premium features | Clear need |
| Periodic reminder | Month-start / weekends | Sufficient decision time |

#### Outreach Channel Selection
| User Type | Recommended Channel | Priority |
|---------|---------|--------|
| High-activity users | App popup + Push | Real-time |
| Medium-activity users | Email + In-app message | Periodic |
| Low-activity users | Email + SMS | Reinforced |
| High-value users | Email + Phone | Full-channel |

### Step 4: A/B Test Design [Core]

#### Test Types
| Test Type | Test Content | Objective |
|---------|---------|---------|
| Timing test | Effect of different trigger timings | Find optimal trigger point |
| Content test | Conversion effect of different copy | Optimize messaging |
| Incentive test | Conversion at different discount levels | Balance conversion rate and profit |
| Channel test | Effect of different outreach channels | Optimize outreach efficiency |

#### A/B Test Template
```yaml
test_id: "UPSELL_TEST_{sequence}"
test_name: "Test name"
hypothesis: "If...then... hypothesis"

variants:
  control:
    name: "Control group"
    description: "Current plan"
  treatment:
    name: "Treatment group"
    description: "Test plan"

metrics:
  primary: "Upgrade conversion rate"
  secondary: ["Upgrade GMV", "Upgrade user count"]
  guardrail: ["Retention rate", "NPS"]

design:
  min_sample_per_variant: 500
  runtime_days: 14
  mde: 0.1
  
success_criteria:
  - primary_metric_lift: ">=10%"
  - guardrail_metrics: "No significant decline"
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | upsell strategies and opportunity list | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full strategy + upsell trigger design + customer tiered upsell model + upsell experiment plan | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-growth/revenue-upsell/`

**Output File**: upsell_strategy.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["upgrade_signals", "personalized_offers"],
  "properties": {
    "upgrade_signals": {"type": "array", "description": "Upgrade signal user list, including signal type, score, and recommended plan"},
    "personalized_offers": {"type": "array", "description": "Personalized upgrade offer list, including value proposition and incentive"},
    "ab_tests": {"type": "array", "description": "A/B test design plans list"},
    "tracking": {"type": "object", "description": "Upgrade effect tracking, including conversion rate, revenue impact, and ROI"}
  }
}
```

`upsell_automation`
```json
{
  "upgrade_signals": [
    {
      "user_id": "EDU-20240389",
      "current_plan": "free",
      "upgrade_signals": [
        {
          "signal_type": "usage_limit",
          "description": "Usage reaching 80% of free tier limit",
          "strength": 0.85
        },
        {
          "signal_type": "feature_access",
          "description": "Frequently accessing premium features",
          "strength": 0.72
        }
      ],
      "overall_score": 0.8,
      "recommended_plan": "pro",
      "expected_revenue_increase": 99
    }
  ],
  "personalized_offers": [
    {
      "offer_id": "OFFER_001",
      "target_segment": "free_user_usage_limit",
      "offer_type": "upgrade_cta",
      "headline": "You have used 80% of free tier capacity",
      "value_proposition": "Upgrade to Pro, unlock unlimited usage",
      "incentive": "20% off first year",
      "cta_text": "Upgrade Now",
      "personalization_elements": ["User usage", "Limit scenario", "Upgrade benefits"]
    }
  ],
  "ab_tests": [
    {
      "test_id": "UPSELL_TEST_001",
      "test_name": "Upgrade popup timing optimization",
      "hypothesis": "Showing upgrade popup at 70% usage is more effective than at 90%",
      "target_segment": "Free tier users",
      "variants": {
        "control": "Trigger at 90%",
        "treatment_a": "Trigger at 70%",
        "treatment_b": "Trigger at 80%"
      },
      "primary_metric": "Upgrade conversion rate",
      "expected_lift": "15%"
    }
  ],
  "tracking": {
    "total_upgrade_opportunities": 5000,
    "upgrade_messages_sent": 3000,
    "upgrade_conversion_rate": 0.08,
    "revenue_impact": 150000,
    "roi": 4.5
  }
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| upgrade_signals | array | Yes | Upgrade signal user list, at least 1 user |
| upgrade_signals[].user_id | string | No | User ID |
| upgrade_signals[].current_plan | string | No | Current plan |
| upgrade_signals[].overall_score | number | Yes | Upgrade score, range 0-1 |
| upgrade_signals[].signal_type | string | No | Signal type, enum: usage/feature/behavior/intent |
| upgrade_signals[].strength | string | No | Signal strength, enum: strong/medium/weak |
| upgrade_signals[].description | string | No | Signal description |
| upgrade_signals[].recommended_plan | string | Yes | Recommended plan, cannot be empty |
| personalized_offers | array | Yes | Personalized offer list, at least 1 |
| personalized_offers[].offer_type | string | No | Offer type, enum: upgrade/addon/trial_discount |
| personalized_offers[].headline | string | No | Offer headline |
| personalized_offers[].value_proposition | string | Yes | Value proposition, cannot be empty |
| personalized_offers[].incentive | string | No | Incentive content |
| personalized_offers[].cta_text | string | No | Call-to-action text |
| ab_tests | array | No | A/B test list, each item must contain test_id/hypothesis |
| ab_tests[].test_id | string | Yes | Test ID |
| ab_tests[].test_name | string | No | Test name |
| ab_tests[].hypothesis | string | Yes | Test hypothesis |
| ab_tests[].variants | array | No | Variant list |
| ab_tests[].primary_metric | string | No | Primary metric |
| tracking | object | No | Effect tracking, must contain upgrade_conversion_rate/roi |
| tracking.upgrade_conversion_rate | number | No | Upgrade conversion rate |
| tracking.roi | number | No | Upgrade ROI |

## Decision Rules

| Situation | Action |
|------|----------|
| Upgrade score >=0.8 (P0) | Immediately trigger upgrade guidance |
| Usage limit + feature need dual signals | Prioritize recommending matching plan |
| Upgrade conversion rate below 5% | Outreach content or timing needs A/B test optimization |
| Guardrail metrics (retention/NPS) declining | Pause upgrade push, investigate cause |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Upgrade signal identification covers 4 signal types (usage/feature/behavioral/intent)
- [ ] Personalized content includes username, usage, benefits 3 elements

### P1 Checks (must pass for standard/deep)

- [ ] A/B test design includes guardrail metrics
- [ ] Upgrade ROI calculation includes outreach cost

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|----------|
| User behavior data missing | User describes paid user characteristics -> generate upgrade strategy | Upgrade signals based on user description, lacking behavioral data validation | Request user to describe paid user usage patterns and upgrade triggers, or upload behavior_data.json |
| Payment history missing | Skip payment pattern analysis, use generic upgrade trigger rules | Upgrade timing judgment based on generic rules | Request user to provide payment history and upgrade patterns, or upload payment_history.json |
| User behavior + payment history both missing | User describes paid user characteristics -> generate upgrade strategy | Output based on description upgrade strategy, marked "pending data validation" | Request user to describe paid user characteristics and product tiers, or execute revenue-nrr first |
| Product usage data not provided | Prompt user to provide or skip steps related to that input | Cannot identify usage-based upgrade signals | Prompt user to provide product usage data for upgrade signal detection |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| revenue-nrr | Expansion opportunity change | Upgrade signal identification and recommended plan | Update expansion signals and upgrade recommendations |
| User provided - behavior data | Usage metric change | Signal detection rules and scoring | Update signal weights and scoring formula |
| User provided - payment history | Payment pattern change | Personalized content and outreach timing | Adjust content templates and trigger conditions |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| revenue-orchestrator | Upgrade strategy output complete | Output file update | Upgrade conversion completion status and key conclusions |
| retention-management | High-value user upgrade signals | Write to output file | Upgrade signal user list |

## Key Success Metrics

| Metric | Definition | Target Value |
|------|------|--------|
| Upgrade conversion rate | Upgraded users / Upgrade opportunity users | >=8% |
| Upgrade GMV | Monthly revenue increase from upgrades | Continuously growing |
| Upgrade response rate | Proportion of users responding after outreach | >=15% |
| Upgrade ROI | Upgrade GMV / Outreach cost | >=3 |
| Post-upgrade retention rate | 12-month retention rate of upgraded users | >=85% |
