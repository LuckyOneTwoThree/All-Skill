---
name: activation-onboarding
description: Use when optimizing the user Onboarding flow. An automated Onboarding optimization pipeline that analyzes Onboarding data and user segments, automatically generates personalized guidance strategies, and designs A/B test plans. Keywords: Onboarding, new user guidance, guidance optimization, personalized guidance, user activation, beginner guidance, quick onboarding, guidance too long.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Activation"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "The new user onboarding flow is too long"
    - "How to get users onboarded faster"
    - "How to improve beginner guidance"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output Onboarding flow and activation strategy"
  deep_description: "Full strategy + Activation funnel deep analysis + Personalized Onboarding design + A/B test plan"
---

# Automated Onboarding Optimization

## Core Principles

1. **Onboarding is Value Delivery Not Feature Tour**: Every guidance step must let the user feel value, not just know where features are
2. **Segmentation is Separate Paths**: Different user segments need different Onboarding paths; one path cannot serve everyone
3. **Aha Moment is the Destination**: The sole goal of Onboarding is to get users to the Aha Moment; everything else is a means

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Onboarding data | object | Yes | User provided | Completion rate, drop-off rate, user feedback |
| Aha Moment data | object | Yes | output/pm-growth/activation-aha/aha_moment.json | Aha Moment data |
| User segment data | object | ○ | User provided | User characteristics, behavioral characteristics |

## Onboarding Stage Definitions

The standard Onboarding flow includes the following stages:

```
Welcome Page → Value Demonstration → Account Setup → Feature Guidance → Aha Moment → Activation Complete
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
- Operation demonstration
- Hands-on practice

### Stage 5: Aha Moment
- Guide completion of core value behavior
- Ensure user experiences product value

### Stage 6: Activation Complete
- Celebrate activation success
- Show subsequent value path
- Provide help resources

## Execution Steps

### Step 1: Current Onboarding Effectiveness Analysis [Core]

#### Overall Effectiveness Assessment
- Onboarding completion rate
- Stage-by-stage conversion rates
- Completion time distribution
- User satisfaction

#### Drop-off Analysis
- Largest drop-off node identification
- Drop-off cause inference
- Drop-off user characteristic analysis

#### Effectiveness Comparison
- Onboarding differences across channel users
- Onboarding differences across user segments
- Comparison with industry benchmarks

### Step 2: Segment Onboarding Strategy Generation [Core]

Based on user segments, design differentiated Onboarding strategies:

#### Segmentation Dimensions
- Technical background (Technical/Non-technical)
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
| Individual | Lightweight and fast | Minimum steps, immediate experience |

### Step 3: Personalized Guidance Content Generation [Core]

Based on segment strategies, generate personalized guidance content:

#### Content Types
1. **Progressive Guidance** - Step-by-step guide users through key operations
2. **Contextual Tips** - Show help when users need it
3. **Video Demos** - Demonstrate core feature operations
4. **Interactive Tutorials** - Guide users to learn by doing
5. **Reward Incentives** - Earn rewards for completing guidance

#### Content Generation Principles
- Concise and clear, understood at a glance
- Action-oriented, emphasize the next step
- Value-oriented, emphasize benefits
- Progress awareness, let users know how much is left

### Step 4: A/B Test Design [Core]

Design A/B tests for Onboarding optimization:

#### Test Types
1. **Overall Onboarding Redesign** - Compare new vs. old Onboarding plans
2. **Single-point Optimization Test** - Optimize a specific guidance step
3. **Segment Differentiation Test** - Different guidance plans for different user groups

#### Core Metrics
- **Primary Metrics**: Onboarding completion rate, activation rate
- **Secondary Metrics**: Onboarding duration, user satisfaction
- **Guardrail Metrics**: Subsequent retention rate, payment conversion rate

### Output Depth Tiering

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Onboarding flow and activation strategy | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output including all Step outputs |
| deep | Full strategy + Activation funnel deep analysis + Personalized Onboarding design + A/B test plan | Full output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-growth/activation-onboarding/`

**Output Files**: onboarding_plan.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["current_effectiveness", "segment_strategies"],
  "properties": {
    "current_effectiveness": {"type": "object", "description": "Current Onboarding effectiveness assessment, including completion rate, drop-off points, and average completion time"},
    "segment_strategies": {"type": "array", "description": "Segment Onboarding strategy list, including segment characteristics and expected improvement"},
    "personalized_content": {"type": "array", "description": "Personalized guidance content list, including content type and trigger conditions"},
    "ab_tests": {"type": "array", "description": "A/B test design plan list"}
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
      "segment": "New User - Technical Background",
      "size": 5000,
      "characteristics": ["Has technical background", "Prefers self-service exploration"],
      "strategy": "Simplify guidance, provide advanced feature entry",
      "expected_improvement": "+20% activation rate"
    }
  ],
  "personalized_content": [
    {
      "segment": "New User - Non-technical Background",
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
test_id: "ONB_TEST_{sequence_number}"
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
  secondary: ["Secondary metric list"]
  guardrail: ["Guardrail metric list"]
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
| current_effectiveness | object | Yes | Current effectiveness assessment, must include overall_completion_rate/drop_off_points |
| current_effectiveness.overall_completion_rate | number | Yes | Overall completion rate, range 0-1 |
| current_effectiveness.stage_completion_rates | object | No | Stage completion rates |
| current_effectiveness.drop_off_points | array | Yes | Drop-off point list, each item must include stage/drop_off_rate |
| current_effectiveness.drop_off_points[].stage | string | Yes | Drop-off stage name |
| current_effectiveness.drop_off_points[].drop_off_rate | number | Yes | Drop-off rate, range 0-1 |
| segment_strategies | array | Yes | Segment strategy list, at least 1 segment strategy |
| segment_strategies[].segment | string | Yes | Segment name |
| segment_strategies[].size | number | No | Segment user proportion |
| segment_strategies[].characteristics | string[] | No | Segment characteristic description |
| segment_strategies[].strategy | string | Yes | Strategy description |
| segment_strategies[].expected_improvement | string | No | Expected improvement effect |
| personalized_content | array | No | Personalized content list, each item must include segment/content_type/content/trigger |
| personalized_content[].segment | string | Yes | Target segment |
| personalized_content[].content_type | string | Yes | Content type, enum: step_by_step_guide/video/tooltip/checklist |
| personalized_content[].content | string | Yes | Content description, cannot be empty |
| personalized_content[].trigger | string | Yes | Trigger condition, cannot be empty |
| ab_tests | array | No | A/B test list, each item must include test_id/hypothesis |
| ab_tests[].test_id | string | Yes | Test ID, cannot be empty |
| ab_tests[].hypothesis | string | Yes | Test hypothesis, cannot be empty |
| ab_tests[].target_segment | string | No | Target segment |
| ab_tests[].expected_lift | string | No | Expected lift |

## Decision Rules

| Situation | Action |
|------|----------|
| Onboarding completion rate <40% | Redesign the guidance flow |
| Stage drop-off rate >30% | Optimize guidance content for that stage |
| Technical user completion rate significantly lower than non-technical | Provide self-service exploration path |
| A/B test primary metric lift <5% | Adjust test hypothesis or expand sample |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Onboarding stage definitions are complete (Welcome → Activation Complete)
- [ ] Drop-off analysis covers all stages and user segments

### P1 Checks (must pass for standard/deep)

- [ ] Personalized guidance matches user segments
- [ ] A/B tests include guardrail metrics (subsequent retention, payment conversion)

### P2 Checks (only deep must pass)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|------------|
| Onboarding data missing | User describes current Onboarding flow → Generate optimization recommendations | Optimization recommendations based on qualitative description rather than data-driven | Request user to provide current Onboarding flow steps and completion rate data per step |
| Aha Moment missing | Skip Aha Moment guidance optimization, based on general best practices | Onboarding optimization lacks Aha Moment anchor | Request user to provide Aha Moment definition or upload activation-aha output file |
| Both Onboarding data and Aha Moment missing | User describes current Onboarding flow → Generate optimization recommendations | Output optimization recommendations based on best practices, marked as "awaiting data validation" | Request user to provide current Onboarding flow description and core user behaviors |
| User segment data missing | Skip segment Onboarding optimization, output general guidance plan only | Cannot customize differentiated Onboarding for different user groups | Request user to provide user segment tags and characteristics data per group |

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Current Onboarding Flow**: Steps and content of new user guidance
- **Completion Rate Data** (optional): Completion rate per guidance step
- **User Feedback** (optional): New user feedback on the guidance flow

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| activation-aha | Primary Aha Moment change | Onboarding endpoint and guidance path | Redesign guidance path to point to new Aha |
| activation-aha | Reach rate data update | Expected improvement of segment strategies | Adjust expected improvement and priorities |
| User provided - Onboarding data | Data definition change | Effectiveness assessment and drop-off analysis | Re-evaluate effectiveness using new definition |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| retention-management | Activation rate change | Write to output file | New user activation rate and Onboarding completion rate |
| activation-orchestrator | Onboarding strategy output completed | Output file updated | Onboarding optimization completion status and key conclusions |

## Key Success Metrics

| Metric | Current Value | Target Value |
|------|--------|--------|
| Onboarding completion rate | 45% | ≥60% |
| Activation rate | 35% | ≥50% |
| Average completion time | 12.5 minutes | ≤10 minutes |
| Guidance satisfaction | 3.2 | ≥4.0 |
