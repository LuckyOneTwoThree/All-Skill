---
name: experiment-design
description: Use when designing a new A/B test experiment is needed. Automated A/B test design, AI automatically executes hypothesis structuring, metric selection, sample size calculation, traffic allocation design, and experiment configuration generation. Keywords: A/B test design, experiment design, sample size calculation, traffic allocation, hypothesis testing, run an AB test, want to verify this change, how to design an experiment.
metadata:
  module: "Product Metrics Operations"
  sub-module: "Experiment Validation"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "General"]
  trigger_examples:
    - "I want to verify if the new homepage improves conversion, help me design an AB test"
    - "How many samples does this feature change need"
    - "Help me design a traffic allocation experiment plan"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output experiment design and hypothesis"
  deep_description: "Complete design + statistical power calculation + multivariate experiment plan + result interpretation framework"
---

# Automated A/B Test Design

## Core Principles

1. **Hypothesis before experiment**: An experiment without a structured hypothesis is blind exploration; If-Then-Because-For are all indispensable
2. **Guardrail metrics are as important as primary metrics**: Primary metrics measure "whether it's effective", guardrail metrics measure "whether it's safe"; both are essential
3. **Sample size determines credibility**: An experiment with insufficient statistical power is worse than no experiment; MDE and sample size must be determined at the design stage

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Hypothesis Statement | string | Yes | User-provided | Business problem or improvement idea |
| Available Traffic | number | Yes | User-provided | User volume available for the experiment |
| Metrics System | JSON | ○ | output/pm-metrics-design/metrics-system/metric_system.json | Product key metric definitions |
| Historical Data | JSON | ○ | analysis-funnel / analysis-retention | Baseline data for sample size calculation |

## Execution Steps

### Step 1: Hypothesis Structuring [Core]

Transform the raw hypothesis into a structured Hypothesis:

```
Raw Hypothesis → Structured Hypothesis
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

### Step 2: Automated Metric Selection [Core]

#### Primary Metric

| Selection Criteria | Description |
|---------|------|
| Directly measures hypothesis | Corresponds to the "then" part of the hypothesis |
| High sensitivity | Can detect expected changes |
| Business relevant | Related to core business objectives |

#### Guardrail Metrics

Prevent experiments from causing negative impact on the product:

| Type | Example | Threshold |
|-----|------|------|
| Core Retention | D7 retention | Must not decline > 2% |
| Revenue Metric | ARPU | Must not decline > 5% |
| Technical Metric | Page load time | Must not increase > 20% |
| Experience Metric | Crash rate | Must not increase > 50% |

#### Secondary Metrics

Provide additional insights:

- Segmentation dimension metrics (for drill-down)
- Correlated metrics (for attribution)
- Exploratory metrics (for discovery)

### Step 3: Automated Sample Size Calculation [Core]

```
Sample size calculation formula:
n = 2 * (Zα + Zβ)² * p̄(1-p̄) / MDE²

Where:
- Zα: Significance level (typically 1.96 for α=0.05)
- Zβ: Statistical power (typically 0.84 for power=80%)
- p̄: Baseline conversion rate
- MDE: Minimum Detectable Effect
```

**Calculator Configuration**:

```yaml
sample_size_calculation:
  significance_level: 0.05
  statistical_power: 0.80
  
  # Primary metric parameters
  primary_metric:
    baseline_rate: 0.15  # Baseline conversion rate 15%
    minimum_detectable_effect: 0.10  # Minimum detectable lift 10%
    relative_mde: 0.015  # Absolute lift 1.5% (15% * 10%)
    
  result:
    sample_size_per_group: 12400
    total_sample_size: 24800
    expected_duration_days: 7
```

### Step 4: Traffic Allocation Design [Core]

#### Allocation Principles

| Principle | Description |
|-----|------|
| Randomness | Users randomly assigned |
| Uniformity | Consistent characteristic distribution across groups |
| Independence | Users in only one experiment group |
| Consistency | Stable user experience |

#### Allocation Layers

```
Traffic
├── Layer 1: Experience consistency experiments
├── Layer 2: Core feature experiments
├── Layer 3: Personalization experiments
└── Layer 4: Marketing experiments
```

#### Allocation Ratios

| Scenario | Recommended Ratio | Description |
|-----|---------|------|
| Standard test | 50/50 | Highest statistical power |
| High risk | 90/10 | Reduced impact surface |
| High uncertainty | 50/25/25 | Multi-variant comparison |
| Gradual rollout | 95/5 | Minimum traffic verification |

### Step 5: Experiment Configuration Generation [Core]

Generate complete experiment configuration:

```yaml
ab_test_design:
  created_at: "2024-01-15T10:00:00Z"
  
  # Experiment basic information
  experiment:
    id: "exp_20240115_simplified_register"
    name: "Simplified Registration Flow Experiment"
    owner: "product_team"
    priority: "high"
  
  # Structured hypothesis
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
  
  # Metric selection
  metrics:
    primary_metric:
      name: "registration_completion_rate"
      definition: "Users who complete registration / Users who start registration"
      baseline_value: 0.35
      minimum_detectable_effect: 0.10  # 10% relative lift
      
    guardrail_metrics:
      - name: "d7_retention_rate"
        definition: "D7 retention rate after registration"
        baseline_value: 0.42
        acceptable_change: -0.02  # Allowable 2% decline
    
    secondary_metrics:
      - name: "registration_abandon_rate"
        definition: "Registration abandonment rate"
  
  # Sample size calculation
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
  
  # Traffic allocation
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
    
  # Termination conditions
  termination_conditions:
    automatic:
      - condition: "Target sample size reached"
        action: "Trigger result analysis"
        
    manual:
      - condition: "Guardrail metric significant decline"
        action: "Alert + human decision"
        
    minimum_runtime_days: 5
    maximum_runtime_days: 30
  
  # Experiment variants
  variants:
    control:
      name: "Current Registration Flow"
      description: "5-step registration flow, including email and phone verification"
      config: {}
      
    treatment:
      name: "Simplified Registration Flow"
      description: "3-step registration flow, phone verification only"
      config:
        steps: 3
        required_fields: ["phone"]
        optional_fields: ["email", "nickname"]
        skip_verification: false
  
  # Technical configuration
  technical:
    platform: "internal_ab_platform"
    layer: 2
    mutex_group: "registration_flow"
    traffic_allocation: 100  # 100% available traffic
  
  # Risk assessment
  risk_assessment:
    overall_risk: "low"
    reasons:
      - "Only affects new user registration flow"
    mitigation:
      - "Configure real-time monitoring"
```

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Experiment design and hypothesis | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output including all Step outputs |
| deep | Complete design + statistical power calculation + multivariate experiment plan + result interpretation framework | Complete output + extended analysis + deep reasoning |

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
    "traffic_allocation": {"type": "object", "description": "Traffic allocation plan, including ratios and layering strategy"},
    "termination_conditions": {"type": "object", "description": "Termination conditions, including early termination and maximum duration"},
    "risk_assessment": {"type": "object", "description": "Risk assessment and mitigation measures"}
  }
}
```

### Required Output

1. **Experiment Design Plan**: Complete experiment configuration
2. **Sample Size Estimation**: Sample requirements based on statistical calculation
3. **Risk Assessment**: Experiment risks and mitigation measures

### Auxiliary Output

1. **Historical Reference**: Results reference from similar experiments
2. **Pre-launch Checklist**: Items to check before going live
3. **Monitoring Configuration**: Experiment monitoring dashboard configuration

## Execution Checklist

```
□ Hypothesis structuring complete
□ Primary metric clearly defined
□ Guardrail metrics set
□ Sample size calculation complete
□ Traffic allocation design complete
□ Termination conditions set
□ Technical configuration complete
□ Risk assessment complete
□ Experiment configuration review passed
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| ab_test_design | object | Yes | Experiment design root object |
| ab_test_design.experiment | object | Yes | Experiment basic information |
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
| ab_test_design.sample_size.expected_duration_days | number | Yes | Expected duration in days |
| ab_test_design.traffic_split | object | Yes | Traffic allocation plan |
| ab_test_design.termination_conditions | object | Yes | Termination conditions |
| ab_test_design.risk_assessment | object | Yes | Risk assessment |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Hypothesis statement change | Structured hypothesis and metric selection | Re-structure hypothesis, update metric selection |
| Available traffic change | Sample size calculation and experiment duration | Recalculate sample size, update expected experiment duration |
| Metrics system change | Primary and guardrail metrics | Update metric selection, re-evaluate guardrail metric coverage |
| Historical data change | Baseline values and MDE | Update baseline values, recalculate sample size |

When experiment design itself changes, notification mechanism for downstream:

| Design Change Type | Notification Scope | Notification Method |
|-------------|----------|----------|
| Primary metric change | experiment-execution | Flag primary metric change, trigger execution configuration update |
| Guardrail metric change | experiment-execution | Flag guardrail change, trigger monitoring configuration update |
| Traffic allocation change | experiment-execution | Flag traffic allocation change, trigger allocation configuration update |

---

## Decision Rules

| Situation | Handling Method |
|------|----------|
| Available traffic < sample size requirement | Extend experiment duration or increase traffic allocation ratio |
| Guardrail metric threshold breached | Pause experiment, human decision |
| MDE too small leading to excessive sample size | Adjust MDE or accept longer experiment duration |
| Multiple experiments competing for the same traffic layer | Queue by priority or use orthogonal layering |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Hypothesis is structured (If-Then-Because-For)
- [ ] Primary metric directly corresponds to hypothesis

### P1 Checks (must pass for standard/deep)

- [ ] Guardrail metrics cover retention, revenue, and technical dimensions
- [ ] Sample size calculation parameters are evidence-based

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep reasoning and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|----------|----------|----------|
| Hypothesis statement missing | Cannot execute, user must describe hypothesis | - |
| Available traffic missing | Use conservative default value (5% of total traffic), marked as "pending confirmation" | Sample size calculation based on conservative assumptions, experiment duration may be longer |
| Metrics system missing | Infer primary and guardrail metrics from hypothesis description, marked as "pending confirmation" | Metric selection based on inference, may not be comprehensive |
| Hypothesis statement + available traffic + metrics system all missing | User describes hypothesis → design experiment based on description | Output experiment design plan, key parameters marked as "pending confirmation" |

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Hypothesis Description**: The improvement idea to be verified and expected effect
- **Available Traffic** (optional): User volume or traffic percentage available for the experiment
- **Key Metrics** (optional): Primary metrics and guardrail metrics the experiment focuses on

## Design Principles

| Principle | Description |
|-----|------|
| Single variable | Change only one factor per experiment |
| Sufficient sample | Ensure statistical power |
| Reasonable duration | Cover complete user cycle |
| Guardrail protection | Prevent negative impact |
| Reproducible | Support repeated verification |
