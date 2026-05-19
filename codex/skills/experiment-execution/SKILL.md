---
name: experiment-execution
description: "Use when executing A/B tests, analyzing results and generating complete reports. A/B test execution and report generation including statistical testing, practical significance assessment, multi-dimensional drilldown, novelty effect detection, and action recommendations. Keywords: A/B test execution, statistical testing, experiment analysis, novelty effect, experiment monitoring, experiment result analysis, A/B test report."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Experiment Verification"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "A/B test is done, help me analyze the results"
    - "Experiment data looks different, is it significant"
    - "Help me monitor a running experiment"
    - "Help me produce a complete A/B test report"
    - "Experiment is done, write a summary report"
    - "Organize experiment results into a presentable document"
execution_depth:
  default: standard
  quick_description: "Output experiment results and conclusions only"
  deep_description: "Full execution + statistical deep dive + segment analysis + experiment learning repository"
---

# A/B Test Auto-Execution, Analysis and Report

## Core Principles

1. **Statistically significant != practically effective**: p-value only tells you "a difference exists"; effect size tells you "how large the difference is and whether it's worth doing"
2. **Heterogeneity is the hidden truth**: Overall positive may mask negative effects for some groups; without drilldown, you don't know the real effect
3. **Novelty effect is an experiment trap**: Initial effects may decay over time; stability is credibility
4. **Experiment reports are decision basis, not data dumps**: The core value of a report is transforming statistical conclusions into actionable recommendations, answering "what should we do" and "why"

## Interaction Mode

### Running Monitoring Mode

```
Scheduled execution (daily/every 4 hours)
├── Data sync check
├── Sample size progress
├── Primary metric trend
├── Guardrail metric check
├── Statistical significance check
└── Anomaly detection
```

### Post-completion Analysis + Report Mode

```
Trigger: Termination condition reached
├── Lock data
├── Statistical analysis
├── Drilldown analysis
├── Generate conclusions
├── Generate report
└── Output recommendations
```

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Experiment design document | object | Yes | output/pm-metrics-ops/experiment-design/experiment_design.json | Experiment plan output from experiment-design |
| Experiment data | object | Yes | User provided | Group data, metric data, guardrail metric data |
| Termination conditions | object | Yes | output/pm-metrics-ops/experiment-design/experiment_design.json | Sample size target, run duration, minimum detectable effect |
| Product background | text | No | User input | Product stage, business goals, historical experiments |

## Execution Steps

### Step 1: Experiment Monitoring and Result Analysis [Core]

Statistical testing, practical significance assessment, multi-dimensional drilldown, novelty effect detection

#### 1.1 Statistical Significance Testing

##### Test Method Selection

| Metric Type | Test Method | Description |
|------------|------------|-------------|
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

Statistically significant != practically effective

```yaml
practical_significance:
  absolute_lift: 0.029
  relative_lift: 0.082

  threshold:
    minimum_meaningful_lift: 0.02

  assessment:
    is_practically_significant: true
    business_verdict: "Worth full release"
    reasoning: "8.2% lift exceeds 5% business threshold, estimated annual revenue increase of 1.2M"
```

#### 1.3 Multi-Dimensional Drilldown Analysis

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

      conclusion: "iOS user effect significant, Android not significant"

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
    - "Consider full release on iOS only"
    - "Optimize Android implementation"
    - "Target new users for promotion"
```

#### 1.4 Novelty Effect Detection

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
      conclusion: "Effect stable, no novelty effect"

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
      - "Consider platform-specific release strategy"
      - "Android version needs further optimization"

  novelty_check:
    detected: false
    trend: "stable"

  recommendation:
    action: "Full release"
    confidence: "high"

    reasoning:
      - "Primary metric lift 8.2%, statistically significant"
      - "Practically significant"
      - "Guardrail metrics safe"
      - "Effect stable, no novelty effect"

    risks:
      - "Android effect uncertain, needs ongoing monitoring"

    next_steps:
      - "Full release to iOS and Android"
      - "Monitor key metrics for 2 weeks post-release"
      - "If Android performance remains poor, consider rollback"
```

### Step 2: A/B Test Report Generation [Core]

Experiment overview, statistical conclusions, effect analysis, action recommendations

#### 2.1 Experiment Overview Assembly

Extract core elements from experiment design:

1. **Experiment identity**: Experiment name, ID, run period, sample size
2. **Hypothesis statement**: Null hypothesis H_0 and alternative hypothesis H_1
3. **Metric system**: Core metrics (OEC), guardrail metrics, secondary metrics
4. **Traffic split**: Treatment/control group ratio, traffic percentage, layering strategy

#### 2.2 Statistical Conclusion Extraction

Extract statistical conclusions from experiment execution results:

1. **Core metric conclusion**: Effect size, confidence interval, p-value, statistical power
2. **Guardrail metric check**: Whether each guardrail metric triggered alert threshold
3. **Sample size verification**: Whether actual sample size meets preset MDE requirements
4. **Statistical significance determination**: Significant/not significant/marginally significant, with determination basis

#### 2.3 In-Depth Effect Analysis

Multi-dimensional analysis of core effects:

1. **Effect size interpretation**: Absolute lift, relative lift, business impact conversion
2. **Heterogeneous effects**: Drilldown analysis by user segments (new/returning, platform, region, etc.)
3. **Novelty effect assessment**: Short-term effect vs. long-term effect prediction
4. **Interaction effects**: Potential interactions with other running experiments

#### 2.4 Action Recommendation Generation

Generate tiered action recommendations based on statistical conclusions and effect analysis:

| Conclusion Type | Recommendation Level | Action |
|----------------|---------------------|--------|
| Core metric significantly positive + guardrails safe | [GREEN] Strongly recommend full release | Full release + monitoring plan |
| Core metric significantly positive + guardrails at risk | [YELLOW] Conditionally recommend | Phased full release + guardrail-specific optimization |
| Core metric not significant | [BLUE] Need more information | Extend period/increase sample/adjust metrics |
| Core metric significantly negative | [RED] Recommend termination | Terminate experiment + root cause analysis |
| Heterogeneous effects significant | [ORANGE] Segment strategy | Segment-differentiated release |

#### 2.5 Report Assembly

Assemble the above content into a complete report.

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | experiment results and conclusions only | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full execution + statistical deep dive + segment analysis + experiment learning repository | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-metrics-ops/experiment-execution/`

**Output Files**:

| File | Path | Description |
|------|------|-------------|
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
    "experiment_info": {"type": "object", "description": "Experiment info, including name, period, and sample size"},
    "conclusion": {"type": "string", "description": "Experiment conclusion: positive/negative/neutral/inconclusive"},
    "primary_metric": {"type": "object", "description": "Primary metric results, including control/treatment data and statistical testing"},
    "guardrail_metrics": {"type": "object", "description": "Guardrail metric results, including changes and safety judgments for each metric"},
    "heterogeneous_effects": {"type": "object", "description": "Heterogeneous effects, segmented by platform/user type"},
    "novelty_check": {"type": "object", "description": "Novelty effect detection"},
    "experiment_name": {"type": "string", "description": "Experiment name"},
    "report_date": {"type": "string", "description": "Report date"},
    "summary": {"type": "object", "description": "Statistical conclusion summary, including conclusion, recommendation, and primary metric results"},
    "novelty_effect": {"type": "object", "description": "Novelty effect assessment"},
    "action_recommendation": {"type": "object", "description": "Action recommendations, including decision, rationale, risks, and follow-up experiments"}
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
      - "Primary metric lift 8.2%"
      - "Guardrail metrics safe"
      - "No novelty effect"
```

### Markdown Report Structure

```markdown
# A/B Test Report: {Experiment Name}

## 1. Experiment Overview
- Experiment ID / Run period / Sample size
- Hypothesis statement (H_0 / H_1)
- Metric system (Core / Guardrail / Secondary)
- Traffic split

## 2. Statistical Conclusions
- Primary metric: Effect size [CI] (p=xxx)
- Guardrail metrics: [OK]/[!]/[X] item-by-item check
- Sample size verification: Met/Not met
- Overall determination: Significant positive / Not significant / Significant negative

## 3. Effect Analysis
- Effect size interpretation (absolute/relative/business conversion)
- Heterogeneous effects (segment drilldown table)
- Novelty effect assessment
- Interaction effect check

## 4. Action Recommendations
- Recommended action + rationale
- Risk notes
- Follow-up experiment suggestions

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
|------------|------|----------|-------------|
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
| ab_test_result.novelty_check.detected | boolean | Yes | Whether novelty effect detected |
| ab_test_result.decision_recommendation | object | Yes | Decision recommendation |
| ab_test_result.decision_recommendation.action | string | Yes | Recommended action, enum: full_release/partial_release/no_release/continue_experiment |
| ab_test_result.decision_recommendation.confidence | string | Yes | Confidence level |
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
| action_recommendation.next_experiments | array | No | Follow-up experiment suggestions |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| Experiment design change | Statistical test parameters and termination conditions | Update statistical test configuration, re-evaluate termination conditions |
| Experiment data update | Statistical testing and drilldown analysis | Re-execute statistical testing, update heterogeneous effects |
| Termination condition change | Experiment run monitoring | Update termination conditions, re-evaluate whether termination criteria met |
| Product background change | Business relevance of action recommendations | Re-evaluate action recommendations, update risks and follow-up experiment suggestions |

When experiment results/report itself changes, notification mechanism to downstream:

| Result/Report Change Type | Notification Scope | Notification Method |
|--------------------------|-------------------|---------------------|
| Conclusion change | decision-dace | Flag conclusion change, trigger DACE Analyze |
| Guardrail metric alert triggered | decision-dace | Flag guardrail alert, trigger insight transformation |
| Decision recommendation change | decision-dace | Flag recommendation change, trigger DACE Conclude |
| Action recommendation change | decision-culture | Flag recommendation change, trigger report push |

---

## Decision Rules

| Condition Combination | Decision |
|----------------------|----------|
| Primary metric significant + meaningful, guardrails safe | Full release |
| Primary metric significant, guardrails problematic | Analyze guardrail causes, then decide |
| Primary metric not significant | Continue experiment or terminate |
| Novelty effect present | Extend experiment |
| Heterogeneous effects significant | Segment-specific release |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Experiment group traffic allocation correct
- [ ] Guardrail metrics not triggered

### P1 Checks (must pass for standard/deep)

- [ ] Experiment data collection complete
- [ ] Statistical significance calculation correct
- [ ] Statistical conclusions consistent with data
- [ ] Action recommendations consistent with conclusions
- [ ] Guardrail metrics fully covered
- [ ] Heterogeneous effects analyzed (at least 3 segment dimensions)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|-----------------|---------------|----------|
| Experiment configuration missing | Cannot auto-monitor, user must provide experiment result data | Cannot execute running monitoring | Request user to provide experiment configuration (traffic split, run time, metric definitions), or upload experiment-config.json |
| Experiment data missing | User provides experiment result data -> direct analysis | Cannot perform trend analysis and novelty effect detection | Request user to provide experiment result data (sample size, metric mean, standard deviation per group) |
| Experiment configuration + Experiment data both missing | User provides experiment result data -> direct analysis | Output analysis results based on user data, trend and novelty effect annotated as "to be supplemented" | Request user to provide treatment and control group data, or upload experiment-data.json |
| No experiment design plan | Reverse-engineer experiment design elements from execution results, annotate as "design info missing" | Experiment overview chapter incomplete | Request user to describe experiment hypothesis and design, or upload experiment-design.json |
| No product background | Focus on statistical conclusions themselves, action recommendations annotated as "need business context" | Action recommendations may lack business relevance | Request user to provide product stage, business goals, and historical experiments |

### Execution Frequency

- **Running monitoring**: Every 4 hours or daily
- **Result analysis**: Triggered when termination condition reached
- **Report generation**: Automatically triggered after result analysis completes
- **Auto-alert**: P0 issues triggered immediately
