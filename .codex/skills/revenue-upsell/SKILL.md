---
name: revenue-upsell
description: Use when you need to optimize upgrade conversion strategy. Upgrade Conversion Automation Pipeline, identifies upgrade signal users, automatically generates personalized upgrade content, optimizes outreach timing, and designs A/B tests. Keywords: upgrade conversion, upsell, upsell, upgrade strategy, cross-sell, push higher-tier plans, get customers to buy more, upgrade plan.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Monetization"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "Internet", "General"]
  trigger_examples:
    - "How to get users to upgrade their plan"
    - "Which users are suitable for upsell"
    - "How to do cross-selling"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output upsell strategy and opportunity list"
  deep_description: "Complete strategy + upsell trigger design + customer-tiered upsell model + upsell experiment plan"
---

# Upgrade Conversion Automation

## Core Principles

1. **Upgrade is value extension, not sales**: Upgrade recommendations must be based on users' genuine usage needs and scenarios, not sales targets
2. **Signal strength determines timing**: Multiple strong signals trigger immediate guidance, weak signals require continuous nurturing; avoid reaching out too early or too late
3. **Personalization equals conversion rate**: The more closely upgrade content matches the user's current usage scenario, the higher the conversion rate

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User behavior data | object | Yes | User provided | Usage volume, feature usage, collaboration behavior |
| Payment history data | object | Yes | output/pm-growth/revenue-nrr/nrr_analysis.json | Historical plans, payment amounts, payment cycles |
| Product usage data | object | ○ | User provided | Feature usage details, usage statistics |

## Upgrade Signal Types

### Type 1: Usage Limit Signals
| Signal | Description | Upgrade Potential |
|------|------|---------|
| Storage reaching limit | File storage approaching free version limit | High |
| API call limit exceeded | API calls approaching quota | High |
| Seat capacity full | Team size reaching free version limit | High |
| Feature usage limit exceeded | Some features have usage count limits | Medium |

### Type 2: Feature Demand Signals
| Signal | Description | Upgrade Potential |
|------|------|---------|
| Premium feature access | Frequently accessing paid-exclusive features | High |
| Collaboration feature usage | Using team collaboration features | High |
| Advanced API usage | Using advanced API features | High |
| Customization needs | Emerging customization requirements | Medium |

### Type 3: Behavioral Signals
| Signal | Description | Upgrade Potential |
|------|------|---------|
| High-frequency usage | Usage frequency far exceeding average users | High |
| Extended usage | Usage duration far exceeding average users | Medium |
| Multi-project operations | Simultaneously operating multiple projects/workspaces | High |
| Key feature usage | Using core business features | High |

### Type 4: Intent Signals
| Signal | Description | Upgrade Potential |
|------|------|---------|
| Pricing page visits | Frequently viewing paid pricing | High |
| Comparison page visits | Viewing different plan comparisons | High |
| Trial request | Requesting trial of paid features | High |
| Customer support inquiry | Inquiring about upgrade-related questions | High |

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

#### Priority Tiering
| Priority | Score Range | Characteristics | Response Strategy |
|--------|---------|------|---------|
| P0 | ≥0.8 | Multiple strong signals | Immediate upgrade guidance |
| P1 | 0.6-0.8 | Clear upgrade need | Proactive upgrade recommendation |
| P2 | 0.4-0.6 | Some upgrade signals | Scenario-based upgrade guidance |
| P3 | <0.4 | Potential upgrade need | Continuous nurturing |

### Step 2: Upgrade Content Personalization [Core]

#### Personalization Elements
| Element | Content Source | Description |
|------|---------|------|
| User name | User profile | Personalized greeting |
| Current usage | Product data | "You have used 80%" |
| Usage limits | Product data | Specific limitation scenarios |
| Upgrade benefits | Product information | What you get after upgrading |
| Recommended plan | Product pricing | Most suitable plan |

#### Personalized Content Template
```
Title: {User name}, you have reached the {Product name} {Limit type} limit

Body:
You have used {Current usage}/{Free limit} this month.
When usage reaches 100%, some features will be restricted.

Upgrade to {Recommended plan}, you can:
✓ {Benefit 1}
✓ {Benefit 2}
✓ {Benefit 3}

{Incentive message}

[Upgrade Now] [Learn More]
```

### Step 3: Outreach Timing Optimization [Core]

#### Optimal Outreach Timing
| Timing | Trigger Condition | Effect |
|------|---------|------|
| Real-time trigger | When usage limit is reached | Most relevant |
| Activity peak | During user activity peak hours | High reach rate |
| After feature usage | After accessing/trying paid features | Clear need |
| Periodic reminder | Beginning of month / weekends | Sufficient decision time |

#### Outreach Channel Selection
| User Type | Recommended Channel | Priority |
|---------|---------|--------|
| High-activity users | App popup + Push | Real-time |
| Medium-activity users | Email + In-app message | Periodic |
| Low-activity users | Email + SMS | Reinforced |
| High-value users | Email + Phone | Omnichannel |

### Step 4: A/B Test Design [Core]

#### Test Types
| Test Type | Test Content | Goal |
|---------|---------|------|
| Timing test | Effect of different trigger timings | Find optimal trigger point |
| Content test | Conversion effect of different copy | Optimize messaging |
| Incentive test | Conversion with different discount levels | Balance conversion rate and profit |
| Channel test | Effect of different outreach channels | Optimize outreach efficiency |

#### A/B Test Template
```yaml
test_id: "UPSELL_TEST_{number}"
test_name: "Test name"
hypothesis: "If...then... hypothesis"

variants:
  control:
    name: "Control group"
    description: "Current approach"
  treatment:
    name: "Treatment group"
    description: "Test approach"

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

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Upsell strategy and opportunity list | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output, including all Step outputs |
| deep | Complete strategy + upsell trigger design + customer-tiered upsell model + upsell experiment plan | Complete output + extended analysis + deep inference |

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
    "personalized_offers": {"type": "array", "description": "Personalized upgrade plan list, including value proposition and incentives"},
    "ab_tests": {"type": "array", "description": "A/B test design plan list"},
    "tracking": {"type": "object", "description": "Upgrade effectiveness tracking, including conversion rate, revenue impact, and ROI"}
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
          "description": "Usage reached 80% of free version limit",
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
      "headline": "You have used 80% of free version capacity",
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
      "target_segment": "Free version users",
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
| personalized_offers | array | Yes | Personalized plan list, at least 1 |
| personalized_offers[].offer_type | string | No | Plan type, enum: upgrade/addon/trial_discount |
| personalized_offers[].headline | string | No | Plan headline |
| personalized_offers[].value_proposition | string | Yes | Value proposition, cannot be empty |
| personalized_offers[].incentive | string | No | Incentive content |
| personalized_offers[].cta_text | string | No | Call-to-action copy |
| ab_tests | array | No | A/B test list, each item must include test_id/hypothesis |
| ab_tests[].test_id | string | Yes | Test ID |
| ab_tests[].test_name | string | No | Test name |
| ab_tests[].hypothesis | string | Yes | Test hypothesis |
| ab_tests[].variants | array | No | Variant list |
| ab_tests[].primary_metric | string | No | Primary metric |
| tracking | object | No | Effectiveness tracking, must include upgrade_conversion_rate/roi |
| tracking.upgrade_conversion_rate | number | No | Upgrade conversion rate |
| tracking.roi | number | No | Upgrade ROI |

## Decision Rules

| Situation | Handling |
|------|----------|
| Upgrade score ≥0.8 (P0) | Trigger upgrade guidance immediately |
| Usage limit + Feature demand dual signals | Prioritize recommending matching plan |
| Upgrade conversion rate below 5% | Outreach content or timing needs A/B test optimization |
| Guardrail metrics (retention/NPS) declining | Pause upgrade outreach, investigate cause |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Upgrade signal identification covers 4 signal types (usage/feature/behavior/intent)
- [ ] Personalized content includes 3 elements: user name, usage, benefits

### P1 Checks (must pass for standard/deep)

- [ ] A/B test design includes guardrail metrics
- [ ] Upgrade ROI calculation includes outreach cost

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Notes |
|----------|----------|----------|------------|
| User behavior data missing | User describes paying user characteristics → Generate upgrade strategy | Upgrade signals based on user description, lacking behavioral data validation | Request user to provide paying user usage behavior and feature usage frequency |
| Payment history missing | Skip payment pattern analysis, use generic upgrade trigger rules | Upgrade timing judgment based on generic rules | Request user to provide historical plan distribution and payment cycle data |
| Product usage data missing | Skip feature usage detail analysis, upgrade signals based on behavior and payment data only | Upgrade signals lack feature dimension, upgrade recommendation precision reduced | Request user to provide feature usage details and usage statistics |
| User behavior + Payment history both missing | User describes paying user characteristics → Generate upgrade strategy | Output description-based upgrade strategy, marked "awaiting data validation" | Request user to provide paying user characteristic description, product tiers, and upgrade barriers |

### Data Acquisition Notes

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Paying user characteristics**: Current paying user usage behavior and payment patterns
- **Product tiers** (optional): Pricing and feature differences across paid tiers
- **Upgrade barriers** (optional): Known reasons why users don't upgrade

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| revenue-nrr | Expansion opportunity change | Upgrade signal identification and recommended plan | Update expansion signals and upgrade recommendations |
| User provided - Behavior data | Usage metric change | Signal detection rules and scoring | Update signal weights and scoring formula |
| User provided - Payment history | Payment pattern change | Personalized content and outreach timing | Adjust content templates and trigger conditions |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| revenue-orchestrator | Upgrade strategy output complete | Output file update | Upgrade conversion completion status and key conclusions |
| retention-management | High-value user upgrade signal | Write to output file | Upgrade signal user list |

## Key Success Metrics

| Metric | Definition | Target Value |
|------|------|--------|
| Upgrade conversion rate | Upgraded users / Upgrade opportunity users | ≥8% |
| Upgrade GMV | Monthly revenue increase from upgrades | Continuously growing |
| Upgrade response rate | Proportion of users responding after outreach | ≥15% |
| Upgrade ROI | Upgrade GMV / Outreach cost | ≥3 |
| Post-upgrade retention rate | 12-month retention rate of upgraded users | ≥85% |
