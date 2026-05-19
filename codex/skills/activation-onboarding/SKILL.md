---
name: activation-onboarding
description: "Use when optimizing user Onboarding flow. Onboarding auto-optimization pipeline that analyzes Onboarding data and user segments to auto-generate personalized guidance strategies and design A/B test plans. Keywords: Onboarding, new user guidance, guidance optimization, personalized guidance, user activation, onboarding flow, onboarding too long."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Activation"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "New user onboarding flow is too long"
    - "How to get users onboarded faster"
    - "How to improve new user guidance"
---

# Onboarding Auto-Optimization

## Core Principles

1. **Onboarding is value delivery not feature tour**: Each guidance step must let users feel value, not just know where features are
2. **Segmentation is path differentiation**: Different user segments need different Onboarding paths; one path cannot serve everyone
3. **Aha Moment is the destination**: The sole objective of Onboarding is to get users to the Aha Moment; everything else is a means

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Onboarding Data | object | Yes | User provided | Completion rate, drop-off rate, user feedback |
| Aha Moment Data | object | Yes | output/pm-growth/activation-aha/aha_moment.json | Aha Moment data |
| User Segment Data | object | No | User provided | User characteristics, behavioral characteristics |

## Onboarding Stage Definition

Standard Onboarding flow includes the following stages:

```
Welcome Page -> Value Demonstration -> Account Setup -> Feature Guidance -> Aha Moment -> Activation Complete
```

### Stage 1: Welcome Page
- Brand presentation
- Value proposition communication
- Guidance start

### Stage 2: Value Demonstration
- Core feature demo
- User case showcase
- Value promise

### Stage 3: Account Setup
- Basic information entry
- Preference settings
- Personalization configuration

### Stage 4: Feature Guidance
- Core feature introduction
- Operation demo
- Practice exercise

### Stage 5: Aha Moment
- Guide completion of core value behavior
- Ensure user feels product value

### Stage 6: Activation Complete
- Celebrate activation success
- Show subsequent value path
- Provide help resources

## Execution Steps

### Step 1: Current Onboarding Effectiveness Analysis

#### Overall Effectiveness Assessment
- Onboarding completion rate
- Stage-by-stage conversion rates
- Completion time distribution
- User satisfaction

#### Drop-off Analysis
- Biggest drop-off point identification
- Drop-off cause inference
- Drop-off user characteristic analysis

#### Effectiveness Comparison
- Onboarding differences across channel users
- Onboarding differences across user segments
- Comparison with industry benchmarks

### Step 2: Segmented Onboarding Strategy Generation

Based on user segments, design differentiated Onboarding strategies:

#### Segmentation Dimensions
- Technical background (technical/non-technical)
- Use case (B2B/B2C)
- Industry type
- Registration source
- User scale

#### Strategy Design Principles
| User Type | Guidance Style | Guidance Content |
|---------|---------|---------|
| Technical | Concise and direct | Quick start, provide advanced features |
| Business | Detailed and friendly | Step-by-step guidance, emphasize value |
| Enterprise | Professional and comprehensive | Complete training, emphasize collaboration |
| Individual | Lightweight and fast | Minimal steps, immediate experience |

### Step 3: Personalized Guidance Content Generation

Based on segmentation strategy, generate personalized guidance content:

#### Content Types
1. **Progressive guidance** - Step-by-step guide users through key operations
2. **Contextual tips** - Show help when users need it
3. **Video demos** - Demonstrate core feature operations
4. **Interactive tutorials** - Guide users to learn by doing
5. **Reward incentives** - Earn rewards for completing guidance

#### Content Generation Principles
- Concise and clear, understood at a glance
- Action-oriented, emphasize next step
- Value-oriented, emphasize benefits
- Progress awareness, let users know how much is left

### Step 4: A/B Test Design

Design A/B tests for Onboarding optimization:

#### Test Types
1. **Overall Onboarding redesign** - New vs. old Onboarding plan comparison
2. **Single-point optimization test** - Optimization of a specific guidance step
3. **Segment differentiation test** - Different guidance plans for different user groups

#### Core Metrics
- **Primary metrics**: Onboarding completion rate, activation rate
- **Secondary metrics**: Onboarding duration, user satisfaction
- **Guardrail metrics**: Subsequent retention rate, paid conversion rate

## Output

**Storage Path**: `output/pm-growth/activation-onboarding/`

**Output File**: onboarding_plan.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["current_effectiveness", "segment_strategies"],
  "properties": {
    "current_effectiveness": {"type": "object", "description": "Current Onboarding effectiveness assessment, including completion rate, drop-off points, and average completion time"},
    "segment_strategies": {"type": "array", "description": "Segmented Onboarding strategy list, including segment characteristics and expected improvement"},
    "personalized_content": {"type": "array", "description": "Personalized guidance content list, including content type and trigger conditions"},
    "ab_tests": {"type": "array", "description": "A/B test design plans list"}
  }
}
```

`onboarding_optimization`
```json
{
  "current_effectiveness": {
    "overall_completion_rate": 0.45,
    "stage_completion_rates": {
      "welcome": 0.85,
      "profile_setup": 0.65,
      "first_action": 0.55,
      "aha_moment": 0.35
    },
    "drop_off_points": [
      {"stage": "profile_setup", "drop_off_rate": 0.24}
    ],
    "avg_time_to_complete": 12.5
  },
  "segment_strategies": [
    {
      "segment": "New user - Technical background",
      "size": 5000,
      "characteristics": ["Has technical background", "Prefers self-service exploration"],
      "strategy": "Simplify guidance, provide advanced feature entry",
      "expected_improvement": "+20% activation rate"
    }
  ],
  "personalized_content": [
    {
      "segment": "New user - Non-technical background",
      "content_type": "step_by_step_guide",
      "content": "Interactive tutorial guiding teachers step-by-step through course creation, content editing, and student invitation",
      "trigger": "Display immediately after registration"
    }
  ],
  "ab_tests": [
    {
      "test_id": "ONB_TEST_001",
      "hypothesis": "Step-by-step guidance vs. free exploration",
      "target_segment": "Non-technical background users",
      "expected_lift": "15%"
    }
  ]
}
```

## A/B Test Design Template

```yaml
test_id: "ONB_TEST_{sequence}"
name: "Test name"
hypothesis: "Optimization hypothesis description"
target_segment: "Target user group"
variants:
  control:
    name: "Control group"
    description: "Current plan description"
  treatment:
    name: "Treatment group"
    description: "Optimization plan description"
metrics:
  primary: "Primary metric definition"
  secondary: ["Secondary metrics list"]
  guardrail: ["Guardrail metrics list"]
design:
  min_sample_per_variant: 2000
  runtime_days: 14
  mde: 0.05
success_criteria:
  - primary_metric_lift: ">=10%"
  - guardrail_metrics: "No significant decline"
  - statistical_significance: 0.95
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| current_effectiveness | object | Yes | Current effectiveness assessment, must contain overall_completion_rate/drop_off_points |
| current_effectiveness.overall_completion_rate | number | Yes | Overall completion rate, range 0-1 |
| current_effectiveness.drop_off_points | array | Yes | Drop-off points list, each item must contain stage/drop_off_rate |
| segment_strategies | array | Yes | Segmented strategy list, at least 1 segment strategy |
| segment_strategies[].segment | string | Yes | Segment name |
| segment_strategies[].strategy | string | Yes | Strategy description |
| personalized_content | array | No | Personalized content list, each item must contain segment/content_type/content/trigger |
| ab_tests | array | No | A/B test list, each item must contain test_id/hypothesis |

## Decision Rules

| Situation | Action |
|------|----------|
| Onboarding completion rate <40% | Redesign guidance flow |
| Stage drop-off rate >30% | Optimize that stage's guidance content |
| Technical user completion rate significantly lower than non-technical | Provide self-service exploration path |
| A/B test primary metric lift <5% | Adjust test hypothesis or expand sample |

## Quality Checks

- [ ] Onboarding stage definition complete (Welcome -> Activation Complete)
- [ ] Drop-off analysis covers all stages and user segments
- [ ] Personalized guidance matches user segments
- [ ] A/B tests include guardrail metrics (subsequent retention, paid conversion)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| Onboarding data missing | User describes current Onboarding flow -> generate optimization recommendations | Optimization recommendations based on qualitative description rather than data-driven |
| Aha Moment missing | Skip Aha Moment guidance optimization, use general best practices | Onboarding optimization lacks Aha Moment anchor |
| Onboarding data + Aha Moment both missing | User describes current Onboarding flow -> generate optimization recommendations | Output based on best practice optimization recommendations, marked "pending data validation" |
- If user has not provided user segment data, prompt user to provide or skip steps related to that input

### Data Acquisition Notes

When upstream files are missing, users need to provide the following information to support degraded generation:
- **Current Onboarding flow**: Steps and content of new user guidance
- **Completion rate data** (optional): Completion rate at each guidance step
- **User feedback** (optional): New user feedback on the guidance flow

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| activation-aha | Primary Aha Moment change | Onboarding destination and guidance path | Redesign guidance path to point to new Aha |
| activation-aha | Reach rate data update | Segmented strategy expected improvement | Adjust expected improvement and priority |
| User provided - Onboarding data | Data definition change | Effectiveness assessment and drop-off analysis | Re-assess effectiveness with new definition |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| retention-management | Activation rate change | Write to output file | New user activation rate and Onboarding completion rate |
| activation-orchestrator | Onboarding strategy output complete | Output file update | Onboarding optimization completion status and key conclusions |

## Key Success Metrics

| Metric | Current Value | Target Value |
|------|--------|--------|
| Onboarding completion rate | 45% | >=60% |
| Activation rate | 35% | >=50% |
| Average completion time | 12.5 min | <=10 min |
| Guidance satisfaction | 3.2 | >=4.0 |
