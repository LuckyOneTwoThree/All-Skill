---
name: experiment-design
description: "Use when designing a new A/B test experiment. A/B test auto-design with hypothesis structuring, metric selection, sample size calculation, traffic split design and experiment configuration generation. Keywords: A/B test design, experiment design, sample size calculation, traffic split, hypothesis testing."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Experiment Verification"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "I want to verify if the new homepage improves conversion, help me design an A/B test"
    - "How many samples does this feature change need"
    - "Help me design a traffic split experiment plan"
execution_depth:
  default: standard
  quick_description: "Output experiment design and hypotheses"
  deep_description: "Full design + statistical power calculation + multivariate experiment plan + result interpretation framework"
---

# A/B Test Auto-Design

## Core Principles

1. **Hypothesis before experiment**: An experiment without a structured hypothesis is blind exploration; If-Then-Because-For are all indispensable
2. **Guardrail metrics are as important as primary metrics**: Primary metrics measure "whether effective", guardrail metrics measure "whether safe"; both are indispensable
3. **Sample size determines credibility**: An experiment with insufficient statistical power is worse than no experiment; MDE and sample size must be determined at the design stage

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Hypothesis statement | string | Yes | User provided | Business problem or improvement idea |
| Available traffic | number | Yes | User provided | User volume available for the experiment |
| Metric system | JSON | O | output/pm-metrics-design/metrics-system/metric_system.json | Product key metric definitions |
| Historical data | JSON | O | analysis-funnel / analysis-retention | Baseline data for sample size calculation |

## Execution Steps

### Step 1: Hypothesis Structuring [Core]

Transform raw hypothesis into structured Hypothesis:

```
Raw hypothesis -> Structured Hypothesis
```

**Structuring Template**:

```
If [we do this change]
Then [this metric] will [increase/decrease]
Because [our hypothesis about why]
For [these users]
```

**Example**:

```
Raw: Simplifying the registration flow can improve conversion rate

Structured:
If we simplify the registration flow from 5 steps to 3 steps
Then the registration completion rate will increase by 10%
Because users face less friction
For all new users on iOS and Android
```

### Step 2: Metric Auto-Selection [Core]

#### Primary Metric

| Selection Criteria | Description |
|-------------------|-------------|
| Directly measures hypothesis | Corresponds to the "then" part of the hypothesis |
| High sensitivity | Can detect expected changes |
| Business relevant | Related to core business goals |

#### Guardrail Metrics

Prevent experiments from negatively impacting the product:

| Type | Example | Threshold |
|------|---------|-----------|
| Core retention | D7 retention | Must not decline > 2% |
| Revenue metric | ARPU | Must not decline > 5% |
| Technical metric | Page load time | Must not increase > 20% |
| Experience metric | Crash rate | Must not increase > 50% |

#### Secondary Metrics

Provide additional insights:

- Sub-dimension metrics (for drilldown)
- Correlated metrics (for attribution)
- Exploratory metrics (for discovery)

### Step 3: Sample Size Auto-Calculation [Core]

```
Sample size calculation formula:
n = 2 * (Zα + Zβ)^2 * p-(1-p-) / MDE^2

Where:
- Zα: Significance level (typically 1.96 for α=0.05)
- Zβ: Statistical power (typically 0.84 for power=80%)
- p-: Baseline conversion rate
- MDE: Minimum Detectable Effect
```

**Calculator Configuration**:

```yaml
sample_size_calculation:
  significance_level: 0.05
  statistical_power: 0.80

  primary_metric:
    baseline_rate: 0.15
    minimum_detectable_effect: 0.10
    relative_mde: 0.015

  result:
    sample_size_per_group: 12400
    total_sample_size: 24800
    expected_duration_days: 7
```

### Step 4: Traffic Split Design [Core]

#### Traffic Split Principles

| Principle | Description |
|-----------|-------------|
| Randomness | Users randomly assigned |
| Uniformity | Consistent feature distribution across groups |
| Independence | Users in only one experiment group |
| Consistency | Stable user experience |

#### Traffic Split Layers

```
Traffic
├── Layer 1: Experience consistency experiments
├── Layer 2: Core feature experiments
├── Layer 3: Personalization experiments
└── Layer 4: Marketing experiments
```

#### Traffic Split Ratios

| Scenario | Recommended Ratio | Description |
|----------|------------------|-------------|
| Standard test | 50/50 | Highest statistical power |
| High risk | 90/10 | Reduced impact surface |
| High uncertainty | 50/25/25 | Multi-variant comparison |
| Gradual rollout | 95/5 | Minimum traffic verification |

### Step 5: Experiment Configuration Generation [Core]

Generate complete experiment configuration:

```yaml
ab_test_design:
  created_at: "2024-01-15T10:00:00Z"

  experiment:
    id: "exp_20240115_simplified_register"
    name: "Simplified Registration Flow Experiment"
    owner: "product_team"
    priority: "high"

  hypothesis:
    original: "Simplifying the registration flow can improve conversion rate"
    structured: |
      If we simplify the registration flow from 5 steps to 3 steps,
      then the registration completion rate will increase by 10%,
      because users face less friction,
      for all new users on iOS and Android.

    components:
      change: "Simplify registration from 5 steps to 3 steps"
      expected_outcome: "Registration rate +10%"
      mechanism: "Reduced user friction"
      target_users: "New users on iOS and Android"

  metrics:
    primary_metric:
      name: "registration_completion_rate"
      definition: "Users who complete registration / Users who start registration"
      baseline_value: 0.35
      minimum_detectable_effect: 0.10

    guardrail_metrics:
      - name: "d7_retention_rate"
        definition: "D7 retention rate after registration"
        baseline_value: 0.42
        acceptable_change: -0.02

    secondary_metrics:
      - name: "registration_abandon_rate"
        definition: "Registration abandonment rate"

  sample_size:
    per_group: 12400
    total: 24800
    daily_eligible_users: 4000
    expected_duration_days: 7
    minimum_duration_days: 5

    assumptions:
      baseline_rate: 0.35
      mde: 0.10
      significance_level: 0.05
      statistical_power: 0.80

  traffic_split:
    strategy: "random"
    allocation:
      control: 50
      treatment: 50

    targeting:
      platform: ["ios"]
      user_type: "new_user"
      exclusion:
        - registered_users

    hash_salt: "exp_reg_2024_v1"

  termination_conditions:
    automatic:
      - condition: "Target sample size reached"
        action: "Trigger result analysis"

    manual:
      - condition: "Guardrail metric significantly declined"
        action: "Alert + human decision"

    minimum_runtime_days: 5
    maximum_runtime_days: 30

  variants:
    control:
      name: "Current registration flow"
      description: "5-step registration flow, including email and phone verification"
      config: {}

    treatment:
      name: "Simplified registration flow"
      description: "3-step registration flow, phone verification only"
      config:
        steps: 3
        required_fields: ["phone"]
        optional_fields: ["email", "nickname"]
        skip_verification: false

  technical:
    platform: "internal_ab_platform"
    layer: 2
    mutex_group: "registration_flow"
    traffic_allocation: 100

  risk_assessment:
    overall_risk: "low"
    reasons:
      - "Only affects new user registration flow"
    mitigation:
      - "Configure real-time monitoring"
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | experiment design and hypotheses | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full design + statistical power calculation + multivariate experiment plan + result interpretation framework | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-metrics-ops/experiment-design/`

**Output File**: experiment_design.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["hypothesis", "primary_metric", "sample_size", "traffic_allocation"],
  "properties": {
    "hypothesis": {"type": "object", "description": "Structured hypothesis, including If-Then-Because-For"},
    "primary_metric": {"type": "object", "description": "Primary metric definition, including name and calculation method"},
    "guardrail_metrics": {"type": "array", "description": "Guardrail metric list, covering retention/revenue/technical dimensions"},
    "sample_size": {"type": "object", "description": "Sample size estimation, including calculation parameters and results"},
    "traffic_allocation": {"type": "object", "description": "Traffic split plan, including ratio and layering strategy"},
    "termination_conditions": {"type": "object", "description": "Termination conditions, including early termination and maximum period"},
    "risk_assessment": {"type": "object", "description": "Risk assessment and mitigation measures"}
  }
}
```

### Required Outputs

1. **Experiment design plan**: Complete experiment configuration
2. **Sample size estimation**: Sample requirements based on statistical calculation
3. **Risk assessment**: Experiment risks and mitigation measures

### Auxiliary Outputs

1. **Historical reference**: Results reference from similar experiments
2. **Pre-launch checklist**: Items to check before going live
3. **Monitoring configuration**: Experiment monitoring dashboard configuration

## Execution Checklist

```
[ ] Hypothesis structured
[ ] Primary metric clearly defined
[ ] Guardrail metrics set
[ ] Sample size calculated
[ ] Traffic split design completed
[ ] Termination conditions set
[ ] Technical configuration completed
[ ] Risk assessment completed
[ ] Experiment configuration reviewed
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| ab_test_design | object | Yes | Experiment design root object |
| ab_test_design.experiment | object | Yes | Experiment basic info |
| ab_test_design.experiment.id | string | Yes | Experiment ID |
| ab_test_design.experiment.name | string | Yes | Experiment name |
| ab_test_design.hypothesis | object | Yes | Structured hypothesis |
| ab_test_design.hypothesis.structured | string | Yes | If-Then-Because-For format hypothesis |
| ab_test_design.metrics | object | Yes | Metric system |
| ab_test_design.metrics.primary_metric | object | Yes | Primary metric |
| ab_test_design.metrics.primary_metric.name | string | Yes | Primary metric name |
| ab_test_design.metrics.primary_metric.baseline_value | number | Yes | Baseline value |
| ab_test_design.metrics.guardrail_metrics | array | Yes | Guardrail metric list, at least 2 |
| ab_test_design.sample_size | object | Yes | Sample size calculation |
| ab_test_design.sample_size.per_group | number | Yes | Sample size per group |
| ab_test_design.sample_size.total | number | Yes | Total sample size |
| ab_test_design.sample_size.expected_duration_days | number | Yes | Expected days |
| ab_test_design.traffic_split | object | Yes | Traffic split plan |
| ab_test_design.termination_conditions | object | Yes | Termination conditions |
| ab_test_design.risk_assessment | object | Yes | Risk assessment |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| Hypothesis statement change | Structured hypothesis and metric selection | Re-structure hypothesis, update metric selection |
| Available traffic change | Sample size calculation and experiment period | Recalculate sample size, update expected experiment period |
| Metric system change | Primary and guardrail metrics | Update metric selection, re-evaluate guardrail metric coverage |
| Historical data change | Baseline values and MDE | Update baseline values, recalculate sample size |

When experiment design itself changes, notification mechanism to downstream:

| Design Change Type | Notification Scope | Notification Method |
|-------------------|-------------------|---------------------|
| Primary metric change | experiment-execution | Flag primary metric change, trigger execution configuration update |
| Guardrail metric change | experiment-execution | Flag guardrail change, trigger monitoring configuration update |
| Traffic split change | experiment-execution | Flag traffic split change, trigger split configuration update |

---

## Decision Rules

| Situation | Handling Method |
|-----------|----------------|
| Available traffic < sample size requirement | Extend experiment period or increase traffic split ratio |
| Guardrail metric threshold breached | Pause experiment, human decision |
| MDE too small leading to excessive sample size | Adjust MDE or accept longer experiment period |
| Multiple experiments competing for same traffic layer | Queue by priority or use orthogonal layering |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Hypothesis structured (If-Then-Because-For)
- [ ] Primary metric directly corresponds to hypothesis

### P1 Checks (must pass for standard/deep)

- [ ] Guardrail metrics cover retention, revenue, technical dimensions
- [ ] Sample size calculation parameters are evidence-based

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|-----------------|---------------|----------|
| Hypothesis statement missing | Cannot execute, user must describe hypothesis | - | Prompt user to describe improvement idea and expected effect to verify |
| Available traffic missing | Use conservative default (5% of total traffic), annotate as "to be confirmed" | Sample size calculation based on conservative assumption, experiment period may be longer | Prompt user to provide available user volume or traffic percentage for experiment |
| Metric system missing | Infer primary and guardrail metrics from hypothesis description, annotate as "to be confirmed" | Metric selection based on inference, may be incomplete | Request user to specify primary metrics and guardrail metrics, or upload metrics-system.json |
| Hypothesis statement + Available traffic + Metric system all missing | User describes hypothesis -> design experiment based on description | Output experiment design plan, key parameters annotated as "to be confirmed" | Request user to describe hypothesis, available traffic, and key metrics, or execute validation-experiment and metrics-system first |

## Design Principles

| Principle | Description |
|-----------|-------------|
| Single variable | Only change one factor per experiment |
| Sufficient sample | Ensure statistical power |
| Reasonable period | Cover complete user cycle |
| Guardrail protection | Prevent negative impact |
| Reproducible | Support repeat verification |
