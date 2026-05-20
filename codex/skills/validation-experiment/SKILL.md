---
name: validation-experiment
description: Used when designing validation experiment plans. Validation experiment auto-design tool, intelligently selecting validation methods and designing experiment plans based on assumption maps and MVP scope, including parameter design for A/B tests and usability tests. Keywords: experiment design, A/B test, sample size, validation method, validation plan, test design.
metadata:
  module: "Product Ideation & Design"
  sub-module: "Solution Validation"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "Software", "General"]
  trigger_examples:
    - "How to validate this assumption"
    - "Help me design an A/B test"
    - "How to create an experiment plan"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output experiment plan and validation metrics"
  deep_description: "Complete plan + experiment design optimization + statistical power analysis + result interpretation framework"
---

# Validation Experiment Auto-Design

## Core Principles

1. **Experiments are the court for assumptions** — every experiment must correspond to an assumption; experiments without assumptions are waste
2. **Minimum cost for maximum confidence** — experiment design pursues cost minimization, not perfect data
3. **Statistical significance is the baseline** — sample size and confidence level must be preset; post-hoc adjustment is cheating
4. **Failed experiments are as valuable as successful ones** — falsifying an assumption is equivalent to confirming one; the key is what was learned

### Basic Information

| Attribute | Value |
|------|-----|
| Pipeline ID | 14 |
| Name | Validation Experiment Auto-Design |
| Execution Mode | 🤖→👤 AI suggests, human approves |
| Input | Assumption map + MVP scope + Available traffic/user data |

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Assumption Map | JSON | Yes | output/pm-design/validation-assumption-map/assumption_map.json | Pipeline 12 output assumption map |
| MVP Scope | JSON | Yes | output/pm-design/validation-mvp/mvp_definition.json | Pipeline 13 output MVP scope |
| Available Traffic/User Data | JSON | ○ | User provided | Current user count, DAU, new users, etc. |

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

### Step 1: Validation Method Selection [Core]

**Decision Tree**:

```
Start
  ↓
Is traffic sufficient for A/B testing?
  ↓
Yes → Consider A/B testing
No → Consider usability testing
  ↓
Cost consideration
  ↓
Wizard MVP / Prototype test / Landing page test
```

**Validation Method Comparison**:

| Method | Applicable Scenario | Cost | Reliability |
|------|----------|------|--------|
| A/B Test | Sufficient traffic, need quantitative validation | High | ⭐⭐⭐⭐⭐ |
| Usability Test | Insufficient traffic, need qualitative insights | Medium | ⭐⭐⭐⭐ |
| Landing Page Test | Value assumption validation | Low | ⭐⭐⭐ |
| Wizard MVP | Feasibility validation | High | ⭐⭐⭐⭐ |
| Prototype Test | Usability assumption validation | Low | ⭐⭐⭐⭐ |

**Selection Rules**:

| Condition | Recommended Method |
|------|----------|
| DAU > 5000, and assumption is quantifiable | A/B Test |
| DAU < 5000 | Usability Test |
| Need to quickly validate value assumption | Landing Page Test |
| Need to validate technical feasibility | Wizard MVP |

### Step 2: Experiment Plan Design [Core]

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
|------|------|----------|
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

### Step 3: Outcome Prediction [Core]

**Three Scenarios**:

```json
{
  "outcome_scenarios": {
    "optimistic": {
      "condition": "Metric improvement ≥ MDE",
      "action": "Proceed with development, continue monitoring"
    },
    "neutral": {
      "condition": "Metric improvement exists but not significant",
      "action": "Extend experiment or adjust plan"
    },
    "pessimistic": {
      "condition": "No metric improvement or decline",
      "action": "Re-examine assumption or adjust plan"
    }
  }
}
```

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Experiment plan and validation metrics | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output, including all Step outputs |
| deep | Complete plan + experiment design optimization + statistical power analysis + result interpretation framework | Complete output + extended analysis + deep inference |

## Output


**Output Validation Rules**: See the section below
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
  "ai_recommendation": "AI recommendation description"
}
```

**Output Validation Rules**: See the Output Validation Rules section below

## Decision Rules

| Rule | Condition | Action |
|------|------|------|
| Human review | All experiment plans | Must have human review |
| Insufficient sample size | sample_size > available traffic | Lower MDE or switch to usability test |
| Duration too long | duration_days > 30 | Consider increasing traffic or lowering MDE |

## Quality Check

### P0 Check (must pass for quick/standard/deep)

- [ ] Method selection has basis (decision tree result has explanation)
- [ ] Experiment design is complete (includes all necessary parameters)

### P1 Check (must pass for standard/deep)

- [ ] Success criteria are clear (has quantifiable metrics)
- [ ] Scenario prediction is complete (all three scenarios present)
- [ ] Stopping criteria are clear (includes significance/power requirements)

### P2 Check (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have basis and alternatives)

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|----------|------------|
| Assumption map missing | User provides assumption description, design experiment | Lacks structured assumption data, experiment design may be less precise | Ask user to provide assumption description and priority or upload assumption-map file |
| MVP plan missing | User provides solution description, design experiment | Lacks MVP plan data, experiment variables may be less focused | Ask user to provide MVP solution description or upload validation-mvp output file |
| Both assumption map and MVP plan missing | User provides assumption and solution description, design experiment | Overall confidence reduced, experiment design may be incomplete | Ask user to provide assumption description and solution overview |
| All upstream files missing | Prompt user to execute prior stages first, or design experiment based on user description | Output is only a basic experiment framework | Ask user to provide core assumptions, solution description, and available resources |

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
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
| experiments[].result | object | No | Experiment result (filled after experiment completion) |
| experiments[].result.conclusion | string | No | Experiment conclusion |
| experiments[].result.learnings | array | No | Key learnings |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Assumption map change (assumption addition/removal/score change) | Experiment hypothesis, experiment priority | Mark affected experiments, suggest human confirmation on whether to redesign |
| Solution design change | Experiment design details | Mark affected experiment design, suggest human confirmation on whether to adjust |
| Resource constraint change | Experiment cost estimate, sample size | Mark affected cost and sample size, suggest human confirmation on whether to adjust |

### Downstream Notification Mechanism

| Experiment Design Change Type | Notification Scope | Notification Method |
|-----------------|----------|----------|
| Experiment addition/removal | validation-mvp | Mark experiment change, trigger MVP scope adjustment |
| Experiment priority change | validation-mvp | Mark priority change, trigger MVP validation plan update |
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
Traffic assessment: DAU 10000 > 5000, A/B testing is feasible
Assumption type: Value assumption + Usability assumption
Recommended method: A/B Test

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
