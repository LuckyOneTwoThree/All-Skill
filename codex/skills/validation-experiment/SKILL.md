---
name: validation-experiment
description: "Use when designing validation experiment plans. Automatically designs validation experiments based on assumption maps and MVP scope, intelligently selecting validation methods and designing experiment plans including A/B test and usability test parameter design. Keywords: experiment design, A/B testing, sample size, validation methods, validation plan, test design."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Solution Validation"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How to validate this assumption"
    - "Help me design an A/B test"
    - "How to create an experiment plan"
---

# Validation Experiment Auto-Design

## Core Principles

1. **Experiments are the courtroom for assumptions** -- Every experiment must correspond to an assumption; experiments without assumptions are waste
2. **Minimum cost for maximum confidence** -- Experiment design pursues cost minimization, not perfect data
3. **Statistical significance is the baseline** -- Sample size and confidence level must be pre-set; post-hoc adjustment is cheating
4. **Failed experiments are as valuable as successful ones** -- Falsifying an assumption is equivalent to confirming one; the key is what was learned

### Basic Information

| Attribute | Value |
|-----------|-------|
| Pipeline ID | 14 |
| Name | Validation Experiment Auto-Design |
| Execution Mode | AI->Human AI suggests, human approves |
| Input | Assumption map + MVP scope + Available traffic/user data |

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Assumption Map | JSON | Yes | output/pm-design/validation-assumption-map/assumption_map.json | Assumption map from Pipeline 12 |
| MVP Scope | JSON | Yes | output/pm-design/validation-mvp/mvp_definition.json | MVP scope from Pipeline 13 |
| Available Traffic/User Data | JSON | O | User provided | Current user count, DAU, new users, etc. |

### Input Format
```json
{
  "assumption_map": [...],
  "mvp_scope": {...},
  "traffic_data": {
    "daily_active_users": 10000,
    "new_users_daily": 500,
    "weekly_users": 50000,
    "conversion_rate": 0.03
  }
}
```

## Execution Steps

### Step 1: Validation Method Selection

**Decision Tree**:

```
Start
  v
Is traffic sufficient for A/B testing?
  v
Yes -> Consider A/B testing
No -> Consider usability testing
  v
Cost consideration
  v
Wizard MVP / Prototype test / Landing page test
```

**Validation Method Comparison**:

| Method | Applicable Scenario | Cost | Reliability |
|--------|-------------------|------|------------|
| A/B testing | Sufficient traffic, needs quantitative validation | High | [STAR][STAR][STAR][STAR][STAR] |
| Usability testing | Insufficient traffic, needs qualitative insights | Medium | [STAR][STAR][STAR][STAR] |
| Landing page test | Value assumption validation | Low | [STAR][STAR][STAR] |
| Wizard MVP | Feasibility validation | High | [STAR][STAR][STAR][STAR] |
| Prototype test | Usability assumption validation | Low | [STAR][STAR][STAR][STAR] |

**Selection Rules**:

| Condition | Recommended Method |
|-----------|-------------------|
| DAU > 5000, and assumption is quantifiable | A/B testing |
| DAU < 5000 | Usability testing |
| Need to quickly validate value assumption | Landing page test |
| Need to validate technical feasibility | Wizard MVP |

### Step 2: Experiment Plan Design

#### A/B Test Design Plan

```json
{
  "experiment_design": {
    "type": "A/B_TEST",
    "experiment_group": "Experiment group description",
    "control_group": "Control group description",
    "split_ratio": "50/50",
    "primary_metric": "Primary metric",
    "secondary_metrics": ["Secondary metrics"],
    "sample_size": 10000,
    "duration_days": 14,
    "minimum_detectable_effect": "MDE",
    "stopping_criteria": {
      "significance_level": 0.05,
      "statistical_power": 0.8,
      "early_stopping_conditions": ["Significance reached"]
    }
  }
}
```

**Parameter Calculation Notes**:

| Parameter | Description | Calculation Basis |
|-----------|-------------|-------------------|
| sample_size | Required sample size | Based on MDE, significance level, statistical power |
| duration_days | Experiment duration | sample_size / daily average traffic |
| split_ratio | Traffic split ratio | Commonly 50/50, adjustable |

#### Usability Test Design Plan

```json
{
  "experiment_design": {
    "type": "USABILITY_TEST",
    "objectives": ["Test objectives"],
    "task_script": [
      {
        "task_id": "T001",
        "task_description": "Task description",
        "success_criteria": "Success criteria"
      }
    ],
    "recruitment_criteria": {
      "user_count": 8,
      "qualification_questions": ["Screening questions"]
    },
    "success_metrics": {
      "task_completion_rate": ">90%",
      "time_on_task": "<2 minutes",
      "error_rate": "<10%"
    }
  }
}
```

### Step 3: Outcome Prediction

**Three Scenarios**:

```json
{
  "outcome_scenarios": {
    "optimistic": {
      "condition": "Metric improvement >= MDE",
      "action": "Proceed to development, continue monitoring"
    },
    "neutral": {
      "condition": "Metric improvement but not significant",
      "action": "Extend experiment or adjust plan"
    },
    "pessimistic": {
      "condition": "No metric improvement or decline",
      "action": "Re-examine assumption or adjust plan"
    }
  }
}
```

## Output


**Output Validation Rules**: See section below
**Storage Path**: `output/pm-design/validation-experiment/`
**Output File**: experiment_plan.json

```json
{
  "validation_experiment": {
    "method": "A_B_TEST|USABILITY_TEST|LANDING_PAGE|WIZARD_MVP",
    "target_assumption": {
      "id": "A001",
      "assumption": "Assumption content",
      "risk_score": 16
    },
    "experiment_design": {
      "type": "A_B_TEST",
      "experiment_group": "...",
      "control_group": "...",
      "split_ratio": "50/50",
      "primary_metric": "Click-through rate",
      "sample_size": 10000,
      "duration_days": 14,
      "stopping_criteria": {...}
    },
    "outcome_scenarios": {...}
  },
  "approval_status": "pending",
  "ai_recommendation": "AI recommendation explanation"
}
```

**Output Validation Rules**: See Output Validation Rules section below

## Decision Rules

| Rule | Condition | Action |
|------|-----------|--------|
| Human review | All experiment plans | Must be reviewed by human |
| Insufficient sample size | sample_size > available traffic | Lower MDE or switch to usability testing |
| Duration too long | duration_days > 30 | Consider increasing traffic or lowering MDE |

## Quality Checks

| Check Item | Pass Condition | Result |
|-----------|---------------|--------|
| Method selection justified | Decision tree result explained | pass/fail |
| Experiment design complete | Contains all necessary parameters | pass/fail |
| Success criteria clear | Has quantifiable metrics | pass/fail |
| Scenario prediction complete | All three scenarios present | pass/fail |
| Stopping criteria clear | Includes significance/power requirements | pass/fail |

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|-----------------|---------------|
| Assumption map missing | User describes key assumptions, design experiment | Lacks structured assumption data, experiment may not align with assumptions |
| Solution design data missing | User describes solution, design experiment | Lacks solution data, experiment design may be less precise |
| Both assumption map and solution design missing | User describes assumptions and solution, design experiment | Overall confidence reduced, experiment design may be less complete |
| All upstream files missing | Prompt user to execute prior stages first, or design experiment based on user description | Output is only basic experiment framework |

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| experiments | array | Yes | Experiment list |
| experiments[].id | string | Yes | Experiment unique identifier |
| experiments[].assumption_id | string | Yes | Associated assumption ID |
| experiments[].type | string | Yes | Experiment type |
| experiments[].hypothesis | string | Yes | Experiment hypothesis |
| experiments[].method | string | Yes | Experiment method |
| experiments[].metrics | array | Yes | Metric list |
| experiments[].metrics[].name | string | Yes | Metric name |
| experiments[].metrics[].type | string | Yes | Metric type (primary/secondary) |
| experiments[].metrics[].target | string | Yes | Target value |
| experiments[].sample_size | object | Yes | Sample size |
| experiments[].sample_size.minimum | integer | Yes | Minimum sample size |
| experiments[].duration | string | Yes | Experiment duration |
| experiments[].confidence_level | number | Yes | Confidence level |
| experiments[].cost_estimate | object | Yes | Cost estimate |
| experiments[].result | object | No | Experiment results (filled after experiment completion) |
| experiments[].result.conclusion | string | No | Experiment conclusion |
| experiments[].result.learnings | array | No | Key learnings |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| Assumption map change (assumption addition/removal/score change) | Experiment hypothesis, experiment priority | Mark affected experiments, suggest human confirmation on whether to redesign |
| Solution design change | Experiment design details | Mark affected experiment design, suggest human confirmation on whether to adjust |
| Resource constraint change | Experiment cost estimate, sample size | Mark affected cost and sample size, suggest human confirmation on whether to adjust |

### Downstream Notification Mechanism

| Experiment Design Change Type | Notification Scope | Notification Method |
|------------------------------|-------------------|---------------------|
| Experiment addition/removal | validation-mvp | Mark experiment changes, trigger MVP scope adjustment |
| Experiment priority change | validation-mvp | Mark priority changes, trigger MVP validation plan update |
| Experiment result update | validation-mvp | Mark result update, trigger MVP assumption validation status update |

---

## Usage Example

**Input**:
```json
{
  "assumption_map": [
    {"id": "A001", "assumption": "Users believe recommended content matches their interests", "risk_score": 20}
  ],
  "traffic_data": {
    "daily_active_users": 10000,
    "new_users_daily": 500
  }
}
```

**AI Analysis**:
```
Traffic assessment: DAU 10000 > 5000, A/B testing feasible
Assumption type: Value assumption + Usability assumption
Recommended method: A/B testing

Experiment design:
- Split: 50/50
- Primary metric: Recommended content click-through rate
- Sample size: ~10000 (based on MDE=10%)
- Duration: 14 days
```

**Output**:
```json
{
  "validation_experiment": {
    "method": "A_B_TEST",
    "target_assumption": {
      "id": "A001",
      "assumption": "Users believe recommended content matches their interests"
    },
    "experiment_design": {
      "type": "A_B_TEST",
      "primary_metric": "Recommended content click-through rate",
      "sample_size": 10000,
      "duration_days": 14
    }
  }
}
```
