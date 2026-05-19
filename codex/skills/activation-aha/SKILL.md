---
name: activation-aha
description: "Use when identifying and engineering Aha Moments. Aha Moment auto-engineering pipeline that analyzes retention and behavior data to auto-identify Aha Moment candidates, measure reach rates, identify shortest paths, and output Onboarding optimization recommendations. Keywords: Aha Moment, activation moment, user activation, reach rate, Onboarding optimization, core value experience."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Activation"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "When do users find the product useful"
    - "How to find the aha moment"
    - "How long for new users to experience core value"
---

# Aha Moment Auto-Engineering

## Core Principles

1. **Aha is causation not correlation**: The Aha Moment must be a causal relationship between behavior and retention, not merely correlation
2. **Reach rate determines ceiling**: No matter how strong the Aha Moment, if the reach rate is low it cannot scale; the reach path must be optimized simultaneously
3. **Shortest path first**: The shorter the path from registration to Aha Moment, the higher the activation rate

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Retention Data | object | Yes | output/pm-metrics-ops/analysis-retention/retention_analysis.json | D1/D7/D30 retention rates |
| User Behavior Data | object | Yes | User provided | Event logs, behavior sequences |
| User Segment Data | object | No | User provided | User segmentation data |

## Aha Moment Definition

The Aha Moment is the critical moment when a user first experiences the core value of the product. When users complete this behavior, they are more likely to retain long-term and become active users.

**Aha Moment = Specific behavior + Specific time window + Retention lift effect**

## Execution Steps

### Step 1: Aha Moment Candidate Search

#### Candidate Behavior Enumeration
Scan all user behaviors to find those highly correlated with retention:

1. **Behavior type classification**:
   - Core feature usage
   - Key path completion
   - Social interaction behaviors
   - Content creation behaviors
   - Settings configuration behaviors

2. **Time window analysis**:
   - Within 1 hour of registration
   - Within 24 hours of registration
   - Within 7 days of registration

3. **Correlation calculation**:
   ```
   Correlation = Degree of correlation between user performing behavior and retention
   Lift = Retention rate of users who performed the behavior - Retention rate of users who did not
   ```

#### Candidate Screening Criteria
- Correlation >= 0.5
- Reach rate >= 10%
- Retention lift >= 15%

### Step 2: Reach Rate Measurement

Analyze the actual reach status of each candidate Aha Moment:

| Metric | Description |
|------|------|
| Overall reach rate | Proportion of registered users who reached this behavior |
| Time distribution | Time distribution of users reaching this behavior |
| Path analysis | Path from registration to this behavior |
| Drop-off points | Drop-off points before users reach this behavior |

### Step 3: Shortest Path Identification

Analyze how to get users to the Aha Moment fastest:

1. **Path analysis**: Identify typical paths from registration to Aha Moment
2. **Friction identification**: Find friction points and drop-off points in the path
3. **Optimization recommendations**: Design shorter reach paths

### Step 4: Onboarding Optimization Recommendations

Based on Aha Moment analysis, generate Onboarding optimization recommendations:

#### Direct Guidance Strategy
- Directly guide users to complete Aha Moment behavior in the Onboarding flow
- Design a "one-click experience core feature" shortcut path

#### Incentive Strategy
- Provide rewards for users who complete Aha Moment behavior
- Lower the threshold for completing Aha Moment

#### Education Strategy
- Strengthen Aha Moment value demonstration
- Provide value preview before reaching Aha Moment

## Output

**Storage Path**: `output/pm-growth/activation-aha/`

**Output File**: aha_moment.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["candidates", "primary_aha"],
  "properties": {
    "candidates": {"type": "array", "description": "Aha Moment candidate list, including behavior, correlation, reach rate, and retention lift"},
    "primary_aha": {"type": "object", "description": "Primary Aha Moment, including behavior, reach rate, retention lift, and confidence"},
    "secondary_ahas": {"type": "array", "description": "Secondary Aha Moment list"},
    "onboarding_optimization": {"type": "object", "description": "Onboarding optimization recommendations, including target behaviors and optimization funnel"}
  }
}
```

`aha_moment`
```json
{
  "candidates": [
    {
      "behavior": "First create and publish an online course",
      "behavior_type": "action|feature_engagement",
      "retention_lift": 0.35,
      "correlation": 0.78,
      "reach_rate": 0.45,
      "time_to_aha": "Within 24 hours of registration",
      "recommendation": "Guide users to use course templates to quickly create first course in Onboarding"
    }
  ],
  "primary_aha": {
    "behavior": "First create and publish an online course",
    "reach_rate": 0.45,
    "retention_lift": 0.35,
    "confidence": 0.92
  },
  "secondary_ahas": [
    {
      "behavior": "First invite students to join course",
      "reach_rate": 0.25,
      "retention_lift": 0.28
    }
  ],
  "onboarding_optimization": {
    "target_behaviors": ["Create online course"],
    "current_funnel": {},
    "optimized_funnel": {},
    "expected_activation_lift": "15%"
  }
}
```

## Aha Moment Analysis Example

```
Candidate Aha Moment Analysis:

1. "First create first project"
   - Correlation: 0.82
   - Reach rate: 35%
   - Retention lift: +42%
   - Recommendation: Optimize project creation flow, lower creation threshold

2. "First share content with friends"
   - Correlation: 0.65
   - Reach rate: 18%
   - Retention lift: +28%
   - Recommendation: Guide users to share, increase sharing incentives

3. "First use core analytics feature"
   - Correlation: 0.75
   - Reach rate: 25%
   - Retention lift: +35%
   - Recommendation: Demonstrate core feature value in Onboarding
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| candidates | array | Yes | Aha Moment candidate list, at least 1 candidate |
| candidates[].behavior | string | Yes | Behavior description, cannot be empty |
| candidates[].correlation | number | Yes | Correlation coefficient, range 0-1 |
| candidates[].reach_rate | number | Yes | Reach rate, range 0-1 |
| candidates[].retention_lift | number | Yes | Retention lift, must be >0 |
| primary_aha | object | Yes | Primary Aha Moment, must contain behavior/reach_rate/retention_lift/confidence |
| primary_aha.confidence | number | Yes | Confidence, range 0-1 |
| secondary_ahas | array | No | Secondary Aha Moment list |
| onboarding_optimization | object | No | Onboarding optimization recommendations, must contain target_behaviors |

## Decision Rules

| Situation | Action |
|------|----------|
| Aha candidate correlation >=0.5 and reach rate >=10% | Add to priority validation list |
| Primary Aha reach rate <20% | Optimize Onboarding guidance path |
| Multiple Aha candidates point to different segments | Design differentiated guidance by segment |
| Aha behavior has no causal relationship with retention | Exclude this candidate, continue searching |

## Quality Checks

- [ ] Aha candidates pass correlation screening (>=0.5) and significance testing
- [ ] Reach rate analysis includes time distribution and path analysis
- [ ] Shortest path identification includes friction point analysis
- [ ] Onboarding optimization recommendations are directly executable

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| Retention data missing | User provides user behavior list -> infer Aha Moment candidates | Aha Moment based on inference rather than data validation |
| Behavior data missing | User provides user behavior list -> infer Aha Moment candidates | Cannot perform behavior-retention correlation analysis |
| Retention data + behavior data both missing | User provides user behavior list -> infer Aha Moment candidates | Output Aha Moment candidate list, marked "pending data validation" |
- If user has not provided user segment data, prompt user to provide or skip steps related to that input

### Data Acquisition Notes

When upstream files are missing, users need to provide the following information to support degraded generation:
- **User behavior list**: Core behaviors users can perform in the product
- **Retention rate data** (optional): Retention rate differences for users with different behaviors
- **New user typical path** (optional): Most common operation sequence for new users

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| analysis-retention | Retention metric definition change | Correlation calculation and retention lift assessment | Recalculate correlation and retention lift with new definition |
| User provided - behavior data | Event definition change | Candidate behavior enumeration and path analysis | Update behavior classification, re-search candidates |
| User provided - segment data | Segment dimension change | Segment-level Aha Moment identification | Re-identify segment Aha by new dimensions |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| activation-onboarding | Primary Aha Moment change | Write to output file | New Aha behavior, reach rate, and guidance path |
| activation-orchestrator | Aha Moment identification complete | Output file update | Aha identification completion status and key conclusions |

## Notes

- Aha Moment may change with product iterations and should be periodically re-evaluated
- Different user segments may have different Aha Moments
- Aha Moment optimization requires balancing reach rate and retention lift
