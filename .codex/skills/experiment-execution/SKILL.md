---
name: experiment-execution
description: Use when you need to execute A/B tests, analyze results, and generate complete reports. A/B test automated execution, analysis and report generation. AI automatically executes monitoring during experiment runs and analysis after experiment completion, including statistical testing, practical significance assessment, multi-dimensional drill-down, novelty effect detection, and generates a complete A/B test report including experiment overview, statistical conclusions, effect analysis, and action recommendations. Keywords: A/B test execution, statistical testing, experiment analysis, novelty effect, experiment monitoring, experiment result analysis, AB test is done help me check results, how to read experiment data, is the result significant, A/B test report, experiment report, statistical conclusion, effect analysis, experiment summary, generate an experiment report, AB test summary, experiment result presentation.
metadata:
  module: "Product Metrics & Operations"
  sub-module: "Experiment Validation"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["Internet", "General"]
  trigger_examples:
    - "The AB test is done, help me analyze the results"
    - "The experiment data looks different, is it significant"
    - "Help me monitor a running experiment"
    - "Help me produce a complete AB test report"
    - "The experiment is done, write a summary report"
    - "Organize the experiment results into a presentable document"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Execute statistical significance testing and guardrail metric checks, output experiment conclusions and basic decision recommendations"
  deep_description: "Additionally includes multi-dimensional drill-down heterogeneity analysis, novelty effect detection, interaction effect checking, complete A/B test report generation, follow-up experiment recommendations"
---

# A/B Test Automated Execution, Analysis & Reporting

## Core Principles

1. **Statistically significant ≠ practically effective**: The p-value only tells you "a difference exists"; the effect size tells you "how large the difference is and whether it's worth pursuing"
2. **Heterogeneity is the hidden truth**: An overall positive effect may mask negative effects in certain segments; without drill-down, you won't know the true impact
3. **Novelty effect is an experiment trap**: Initial effects may decay over time; stability is what makes results trustworthy
4. **Experiment reports are the basis for decisions, not data dumps**: The core value of a report lies in translating statistical conclusions into actionable recommendations, answering "what should we do" and "why"

## Interaction Mode

### In-Run Monitoring Mode

```
Scheduled execution (daily/every 4 hours)
├── Data sync check
├── Sample size progress
├── Primary metric trends
├── Guardrail metric checks
├── Statistical significance check
└── Anomaly detection
```

### Post-Completion Analysis + Report Mode

```
Trigger condition: Stop condition reached
├── Lock data
├── Statistical analysis
├── Drill-down analysis
├── Generate conclusions
├── Generate report
└── Output recommendations
```

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Experiment design document | object | Yes | output/pm-metrics-ops/experiment-design/experiment_design.json | Experiment plan output from experiment-design |
| Experiment data | object | Yes | User provided | Group data, metric data, guardrail metric data |
| Stop conditions | object | Yes | output/pm-metrics-ops/experiment-design/experiment_design.json | Sample size target, run duration, minimum detectable effect |
| Product background | text | No | User input | Product stage, business objectives, historical experiments |

## Execution Steps

### Step 1: Experiment Monitoring & Result Analysis (original experiment-execution) [Core]

Statistical testing, practical significance assessment, multi-dimensional drill-down, novelty effect detection

#### 1.1 Statistical Significance Testing

##### Test Method Selection

| Metric Type | Test Method | Description |
|---------|---------|------|
| Proportion (conversion rate) | Z-test / Chi-square test | Binomial distribution |
| Mean (revenue) | T-test / Mann-Whitney | Normal/non-normal |
| Distribution (duration) | KS test | Distribution difference |
| Multiple metrics | FDR correction | Multiple testing |

##### Output Format

```yaml
statistical_test:
  method: "two_sample_proportion_z_test"

  results:
    control:
      sample_size: 12450
      rate: 0.352
      standard_error: 0.0043

    treatment:
      sample_size: 12380
      rate: 0.381
      standard_error: 0.0044

    test_statistic: 4.82
    p_value: 0.0000014
    confidence_interval:
      lower: 0.018
      upper: 0.040
      confidence_level: 0.95

  interpretation:
    is_significant: true
    significance_level: 0.05
    conclusion: "Treatment group significantly outperforms control group"
```

#### 1.2 Practical Significance Assessment

Statistically significant ≠ practically effective

```yaml
practical_significance:
  absolute_lift: 0.029
  relative_lift: 0.082

  threshold:
    minimum_meaningful_lift: 0.02

  assessment:
    is_practically_significant: true
    business_verdict: "Worth full rollout"
    reasoning: "8.2% improvement exceeds business threshold of 5%, estimated annual revenue increase of 1.2 million"
```

#### 1.3 Multi-Dimensional Drill-Down Analysis [Conditional]

##### Heterogeneous Effect Detection

```yaml
heterogeneous_effects:
  summary: "Significant platform differences found"

  dimension_analysis:
    platform:
      ios:
        lift: 0.052
        p_value: 0.001
        significant: true

      android:
        lift: 0.018
        p_value: 0.089
        significant: false

      conclusion: "iOS user effect is significant, Android is not"

    user_segment:
      new_users:
        lift: 0.041
        significant: true

      returning_users:
        lift: 0.015
        significant: false

      conclusion: "Primarily effective for new users"

    traffic_source:
      organic:
        lift: 0.045
        significant: true

      paid:
        lift: 0.022
        significant: false

      conclusion: "More effective for organic traffic"

  recommendations:
    - "Consider full rollout on iOS only"
    - "Optimize Android version implementation"
    - "Targeted promotion for new users"
```

#### 1.4 Novelty Effect Detection [Deep]

Detect abnormal initial user behavior:

```yaml
novelty_check:
  enabled: true

  indicators:
    daily_trend:
      day_1: 0.15
      day_3: 0.09
      day_7: 0.08
      day_14: 0.082

    assessment:
      is_novelty_effect: false
      trend_stable: true
      conclusion: "Effect is stable, no novelty effect"

    actions:
      if_novelty: "Extend experiment period by 2 weeks"
      if_stable: "Can proceed to decision process"
```

#### 1.5 Decision Recommendation Generation

```yaml
decision_recommendation:
  overall_assessment:
    statistical_significance: true
    practical_significance: true
    guardrail_metrics_safe: true
    no_heterogeneous_risks: true
    novelty_effect_resolved: true

  conclusion: "positive"

  primary_metric:
    name: "registration_completion_rate"

    control:
      value: 0.352
      lower_ci: 0.344
      upper_ci: 0.360

    treatment:
      value: 0.381
      lower_ci: 0.373
      upper_ci: 0.389

    lift:
      absolute: 0.029
      relative: 0.082
      confidence_interval: [0.018, 0.040]

    statistics:
      p_value: 0.0000014
      statistically_significant: true
      practically_significant: true

  guardrail_metrics:
    - name: "d7_retention_rate"
      control: 0.42
      treatment: 0.418
      change: -0.47%
      safe: true
      verdict: "No significant impact"

    - name: "daily_active_users"
      control: 1000000
      treatment: 1001500
      change: +0.15%
      safe: true
      verdict: "No significant impact"

    - name: "app_crash_rate"
      control: 0.002
      treatment: 0.0021
      change: +5%
      safe: true
      verdict: "No significant impact"

  heterogeneous_effects:
    summary: "iOS effect significant (+5.2%), Android not significant (+1.8%)"
    recommendations:
      - "Consider platform-by-platform rollout strategy"
      - "Android version needs further optimization"

  novelty_check:
    detected: false
    trend: "stable"

  recommendation:
    action: "Full rollout"
    confidence: "high"

    reasoning:
      - "Primary metric improved 8.2%, statistically significant"
      - "Practically significant"
      - "Guardrail metrics safe"
      - "Effect stable, no novelty effect"

    risks:
      - "Android effect uncertain, needs follow-up monitoring"

    next_steps:
      - "Full rollout to iOS and Android"
      - "Monitor key metrics for 2 weeks post-release"
      - "If Android performance remains poor, consider rollback"
```

### Step 2: A/B Test Report Generation (from experiment-report) [Conditional]

Experiment overview, statistical conclusions, effect analysis, action recommendations

#### 2.1 Experiment Overview Assembly

Extract core elements from the experiment design plan:

1. **Experiment Identity**: Experiment name, ID, run period, sample size
2. **Hypothesis Statement**: Null hypothesis H₀ and alternative hypothesis H₁
3. **Metric System**: Core metric (OEC), guardrail metrics, auxiliary metrics
4. **Traffic Allocation**: Treatment/control group ratio, traffic percentage, stratification strategy

#### 2.2 Statistical Conclusion Extraction

Extract statistical conclusions from experiment execution results:

1. **Core Metric Conclusion**: Effect size, confidence interval, p-value, statistical power
2. **Guardrail Metric Check**: Whether each guardrail metric triggered alert thresholds
3. **Sample Size Verification**: Whether actual sample size meets preset MDE requirements
4. **Statistical Significance Determination**: Significant/not significant/marginally significant, with determination basis

#### 2.3 Effect Deep Analysis

Multi-dimensional analysis of core effects:

1. **Effect Size Interpretation**: Absolute lift, relative lift, business impact conversion
2. **Heterogeneous Effects**: Drill-down analysis by user segments (new/returning, platform, region, etc.)
3. **Novelty Effect Assessment**: Short-term effect vs. long-term effect projection
4. **Interaction Effects**: Potential interactions with other running experiments

#### 2.4 Action Recommendation Generation

Based on statistical conclusions and effect analysis, generate tiered action recommendations:

| Conclusion Type | Recommendation Level | Action |
|----------|----------|------|
| Core metric significantly positive + guardrails safe | 🟢 Strongly recommend full rollout | Full rollout + monitoring plan |
| Core metric significantly positive + guardrails at risk | 🟡 Conditional recommendation | Phased rollout + guardrail-specific optimization |
| Core metric not significant | 🔵 More information needed | Extend period/increase sample/adjust metrics |
| Core metric significantly negative | 🔴 Recommend termination | Terminate experiment + root cause analysis |
| Heterogeneous effects significant | 🟠 Segment strategy | Differentiated rollout by segment |

#### 2.5 Report Assembly

Assemble the above content into a complete report.

## Output

**Storage Path**: `output/pm-metrics-ops/experiment-execution/`

**Output Files**:

| File | Path | Description |
|------|------|------|
| Experiment result data | `output/pm-metrics-ops/experiment-execution/experiment_result.json` | Machine-consumable experiment result data |
| A/B test report | `output/pm-metrics-ops/experiment-execution/experiment-report.md` | Human-readable complete report |
| Structured report data | `output/pm-metrics-ops/experiment-execution/experiment-report.json` | Machine-consumable structured report data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["experiment_id", "conclusion", "primary_metric", "summary", "action_recommendation"],
  "properties": {
    "experiment_id": {"type": "string", "description": "Experiment ID"},
    "analyzed_at": {"type": "string", "description": "Analysis time"},
    "experiment_info": {"type": "object", "description": "Experiment information, including name, period and sample size"},
    "conclusion": {"type": "string", "description": "Experiment conclusion: positive/negative/neutral/inconclusive"},
    "primary_metric": {"type": "object", "description": "Primary metric results, including control/treatment data and statistical testing"},
    "guardrail_metrics": {"type": "object", "description": "Guardrail metric results, including changes and safety judgments for each metric"},
    "heterogeneous_effects": {"type": "object", "description": "Heterogeneous effects, segmented analysis by platform/user type"},
    "novelty_check": {"type": "object", "description": "Novelty effect detection"},
    "experiment_name": {"type": "string", "description": "Experiment name"},
    "report_date": {"type": "string", "description": "Report date"},
    "summary": {"type": "object", "description": "Statistical conclusion summary, including conclusion, recommendation and primary metric results"},
    "novelty_effect": {"type": "object", "description": "Novelty effect assessment"},
    "action_recommendation": {"type": "object", "description": "Action recommendations, including decision, rationale, risks and follow-up experiments"}
  }
}
```

### Experiment Result Data Example

```yaml
ab_test_result:
  experiment_id: "exp_20240115_simplified_register"
  analyzed_at: "2024-01-22T10:00:00Z"

  experiment_info:
    name: "Simplified Registration Flow Experiment"
    start_date: "2024-01-15"
    end_date: "2024-01-21"
    duration_days: 7
    total_sample: 24830

  conclusion: "positive"

  primary_metric:
    name: "registration_completion_rate"

    control:
      value: 0.352
      sample_size: 12450
      confidence_interval: [0.344, 0.360]

    treatment:
      value: 0.381
      sample_size: 12380
      confidence_interval: [0.373, 0.389]

    lift:
      absolute: 0.029
      relative: 0.082
      confidence_interval: [0.018, 0.040]

    statistics:
      p_value: 0.0000014
      test_method: "two_sample_z_test"
      statistically_significant: true
      practically_significant: true

  guardrail_metrics:
    d7_retention_rate:
      control: 0.42
      treatment: 0.418
      change: -0.47%
      safe: true

    daily_active_users:
      control: 1000000
      treatment: 1001500
      change: +0.15%
      safe: true

    app_crash_rate:
      control: 0.002
      treatment: 0.0021
      change: +5%
      safe: true

  heterogeneous_effects:
    platform:
      ios: { lift: 0.052, significant: true }
      android: { lift: 0.018, significant: false }
    user_type:
      new_users: { lift: 0.041, significant: true }
      returning_users: { lift: 0.015, significant: false }

  novelty_check:
    detected: false
    trend_stable: true

  decision_recommendation:
    action: "full_release"
    confidence: "high"
    reasoning:
      - "Primary metric improved 8.2%"
      - "Guardrail metrics safe"
      - "No novelty effect"
```

### Markdown Report Structure

```markdown
# A/B Test Report: {Experiment Name}

## 1. Experiment Overview
- Experiment ID / Run period / Sample size
- Hypothesis statement (H₀ / H₁)
- Metric system (Core / Guardrail / Auxiliary)
- Traffic allocation

## 2. Statistical Conclusions
- Core metric: Effect size [CI] (p=xxx)
- Guardrail metrics: ✅/⚠️/❌ item-by-item check
- Sample size verification: Met/Not met
- Overall determination: Significantly positive / Not significant / Significantly negative

## 3. Effect Analysis
- Effect size interpretation (absolute/relative/business conversion)
- Heterogeneous effects (segment drill-down table)
- Novelty effect assessment
- Interaction effect check

## 4. Action Recommendations
- Recommended action + rationale
- Risk alerts
- Follow-up experiment recommendations

## 5. Appendix
- Statistical method description
- Data quality check
- Complete metric detail table
```

### Structured Report Data Example

```json
{
  "experiment_id": "",
  "experiment_name": "",
  "report_date": "",
  "summary": {
    "conclusion": "significant_positive|not_significant|significant_negative|marginal",
    "recommendation": "ship_full|ship_conditional|extend|terminate|segmented",
    "primary_metric": {
      "name": "",
      "control_value": 0,
      "treatment_value": 0,
      "absolute_lift": 0,
      "relative_lift": 0,
      "confidence_interval": [0, 0],
      "p_value": 0,
      "statistical_power": 0
    },
    "guardrail_status": []
  },
  "heterogeneous_effects": [],
  "novelty_effect": {},
  "action_recommendation": {
    "decision": "",
    "rationale": "",
    "risks": [],
    "next_experiments": []
  }
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| ab_test_result | object | Yes | Experiment result root object |
| ab_test_result.experiment_id | string | Yes | Experiment ID |
| ab_test_result.analyzed_at | string | Yes | Analysis time |
| ab_test_result.conclusion | string | Yes | Experiment conclusion, enum: positive/negative/neutral/inconclusive |
| ab_test_result.primary_metric | object | Yes | Primary metric results |
| ab_test_result.primary_metric.name | string | Yes | Primary metric name |
| ab_test_result.primary_metric.control.value | number | Yes | Control group value |
| ab_test_result.primary_metric.treatment.value | number | Yes | Treatment group value |
| ab_test_result.primary_metric.lift.relative | number | Yes | Relative lift |
| ab_test_result.primary_metric.statistics.p_value | number | Yes | p-value |
| ab_test_result.primary_metric.statistics.statistically_significant | boolean | Yes | Whether statistically significant |
| ab_test_result.guardrail_metrics | object | Yes | Guardrail metric results |
| ab_test_result.heterogeneous_effects | object | No | Heterogeneous effects |
| ab_test_result.novelty_check | object | Yes | Novelty effect detection |
| ab_test_result.novelty_check.detected | boolean | Yes | Whether novelty effect was detected |
| ab_test_result.decision_recommendation | object | Yes | Decision recommendation |
| ab_test_result.decision_recommendation.action | string | Yes | Recommended action, enum: full_release/partial_release/no_release/continue_experiment |
| ab_test_result.decision_recommendation.confidence | string | Yes | Confidence |
| experiment_id | string | Yes | Experiment ID (report) |
| experiment_name | string | Yes | Experiment name (report) |
| report_date | string | Yes | Report date |
| summary | object | Yes | Statistical conclusion summary |
| summary.conclusion | string | Yes | Conclusion, enum: significant_positive/not_significant/significant_negative/marginal |
| summary.recommendation | string | Yes | Recommendation, enum: ship_full/ship_conditional/extend/terminate/segmented |
| summary.primary_metric | object | Yes | Primary metric results |
| summary.primary_metric.name | string | Yes | Primary metric name |
| summary.primary_metric.relative_lift | number | Yes | Relative lift |
| summary.primary_metric.p_value | number | Yes | p-value |
| summary.guardrail_status | array | Yes | Guardrail metric status list |
| heterogeneous_effects | array | No | Heterogeneous effect analysis |
| novelty_effect | object | No | Novelty effect assessment |
| action_recommendation | object | Yes | Action recommendations |
| action_recommendation.decision | string | Yes | Decision |
| action_recommendation.rationale | string | Yes | Rationale |
| action_recommendation.risks | array | Yes | Risk list |
| action_recommendation.next_experiments | array | No | Follow-up experiment recommendations |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Experiment design change | Statistical testing parameters and stop conditions | Update statistical testing configuration, re-evaluate stop conditions |
| Experiment data update | Statistical testing and drill-down analysis | Re-execute statistical testing, update heterogeneous effects |
| Stop condition change | Experiment run monitoring | Update stop conditions, re-evaluate whether stop criteria are met |
| Product background change | Business relevance of action recommendations | Re-evaluate action recommendations, update risks and follow-up experiment recommendations |

When experiment results/reports themselves change, downstream notification mechanism:

| Result/Report Change Type | Notification Scope | Notification Method |
|-------------------|----------|----------|
| Conclusion change | decision-dace | Mark conclusion change, trigger DACE Analyze |
| Guardrail metric alert triggered | decision-dace | Mark guardrail alert, trigger insight transformation |
| Decision recommendation change | decision-dace | Mark recommendation change, trigger DACE Conclude |
| Action recommendation change | decision-culture | Mark recommendation change, trigger report push |

---

## Decision Rules

| Condition Combination | Decision |
|---------|------|
| Primary metric significant + meaningful, guardrails safe | Full rollout |
| Primary metric significant, guardrails problematic | Analyze guardrail causes, then decide |
| Primary metric not significant | Continue experiment or terminate |
| Novelty effect present | Extend experiment |
| Heterogeneity significant | Segment-by-segment rollout |

## Quality Checks

- [ ] Experiment group traffic allocation correct (P0)
- [ ] Guardrail metrics not triggered alerts (P0)
- [ ] Experiment data collection complete (P0)
- [ ] Statistical significance calculation correct (P0)
- [ ] Statistical conclusions consistent with data (P1)
- [ ] Action recommendations consistent with conclusions (P1)
- [ ] Guardrail metrics fully covered (P1)
- [ ] Heterogeneous effects analyzed (at least 3 segmentation dimensions) (P2)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|----------|----------|----------|
| Experiment configuration missing | Cannot auto-monitor, user must provide experiment result data | Cannot execute in-run monitoring |
| Experiment data missing | User provides experiment result data → Direct analysis | Cannot perform trend analysis and novelty effect detection |
| Experiment configuration + experiment data both missing | User provides experiment result data → Direct analysis | Output based on user data analysis results, trends and novelty effects annotated "to be supplemented" |
| No experiment design plan | Reverse-engineer experiment design elements from execution results, annotate "design information missing" | Experiment overview section incomplete |
| No product background | Focus on statistical conclusions themselves, action recommendations annotated "need business context" | Action recommendations may lack business relevance |

### Data Acquisition Instructions

When upstream files are missing, users need to provide the following information to support degraded generation:
- **Experiment result data**: Sample sizes, metric means, standard deviations, etc. for experiment and control groups
- **Experiment configuration** (optional): Experiment traffic ratio, run duration, metric definitions
- **Statistical significance requirements** (optional): Desired confidence level and statistical power
- **Product background** (optional): Product stage, business objectives and historical experiments

### Execution Frequency

- **In-run monitoring**: Every 4 hours or daily
- **Result analysis**: Triggered when stop condition is reached
- **Report generation**: Automatically triggered after result analysis is complete
- **Auto-alert**: P0 issues triggered immediately
