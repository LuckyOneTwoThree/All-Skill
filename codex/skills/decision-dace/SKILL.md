---
name: decision-dace
description: "Use when executing data-driven decision loops or transforming data into actionable insights. DACE loop: Define/Analyze auto-executed, Conclude AI-assisted human decision, Execute AI-tracked. Analyze phase converts results into narrative insights with decision recommendations and boundary annotation. Keywords: DACE loop, data decision, decision loop, data-driven, decision framework, data insights, insight transformation, decision recommendations."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Decision Loop"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me make a data decision using the DACE method"
    - "How to build a complete loop from data to action"
    - "Data analyzed but nobody executes, what to do"
    - "What does this data mean, help me interpret"
    - "Transform analysis results into a tellable story"
    - "Data is too dry, help me convert to actionable recommendations"
execution_depth:
  default: standard
  quick_description: "Output decision recommendation and key rationale only"
  deep_description: "Full decision analysis + scenario modeling + stakeholder impact + decision audit trail"
---

# DACE Loop Automation (with Insight Transformation)

## Core Principles

1. **Define is direction, Analyze is evidence**: Analysis without clear goals and decisions without evidence support are equally dangerous
2. **Conclude authority belongs to humans, Execute tracking belongs to the system**: AI provides options and boundaries, humans make final decisions, the system tracks execution effectiveness
3. **Closed loop is complete**: DACE is indispensable; Conclude without Execute is empty talk, Conclude without Analyze is gambling
4. **Data is the starting point, insight is the endpoint, action is the purpose**: Insights without action direction are just data displays
5. **Narrative over jargon**: Translate "p=0.001" into "99.9% confidence" so decision-makers can understand and act
6. **Boundary annotation is more important than recommendation**: Clarifying what can be auto-executed vs. what needs human confirmation is more valuable than simple recommendations

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| OKR data | object | Yes | User provided | Objectives and key results, baseline values and target values |
| KR progress | object | Yes | output/pm-metrics-ops/analysis-anomaly/anomaly_report.json | Current progress and deviation analysis for each KR |
| Experiment results | object | Yes | output/pm-metrics-ops/experiment-execution/experiment_result.json | A/B test results, anomaly detection data |
| Analysis results | object | Yes | output/pm-metrics-ops/analysis-anomaly/anomaly_report.json | anomaly/funnel/retention reports |
| Business context | object | O | User provided | Product stage, team goals |
| Historical insight library | object[] | O | output/pm-metrics-ops/decision-dace/insight_library.json | Avoid duplication |

## Execution Steps

### DACE Four Phases

```
┌────────────────────────────────────────────────────────┐
│                     DACE Loop                            │
├────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────┐                                            │
│   │  Define │  Define goals and success metrics          │
│   └────┬────┘                                            │
│        │                                                  │
│        v                                                  │
│   ┌─────────┐                                            │
│   │ Analyze │  Insight generation: Data->Story->Decision   │
│   └────┬────┘                                            │
│        │                                                  │
│        v                                                  │
│   ┌─────────┐                                            │
│   │Conclude │  Draw conclusions and decision recommendations    <──────┐         │
│   └────┬────┘                                                  │         │
│        │                                                       │         │
│        v                                                       │         │
│   ┌─────────┐                                                  │         │
│   │ Execute │  Execute strategy and track effectiveness ───────────┘         │
│   └─────────┘       │                                              │    │
│        │            │                                              │    │
│        v            │                                              │    │
│   Return to Analyze <─────┘                                        │    │
│                                                          │
└────────────────────────────────────────────────────────┘
```

### Step 1: Define AI [Core]

Auto-establish OKR tracking system:

```yaml
define:
  status: "automated"
  trigger: "OKR update or quarter start"

  output:
    current_cycle: "2024_Q1"
    cycle_id: "dace_2024_Q1"

    objectives:
      - id: "obj_1"
        text: "Increase user activity"
        owner: "product_team"

        key_results:
          - id: "kr_1_1"
            text: "DAU reach 12M"
            metric: "dau"
            baseline: 10500000
            target: 12000000
            current: 10800000
            progress: 30

          - id: "kr_1_2"
            text: "D7 retention rate reach 30%"
            metric: "d7_retention"
            baseline: 0.25
            target: 0.30
            current: 0.285
            progress: 70

      - id: "obj_2"
        text: "Increase commercial revenue"
        owner: "biz_team"

        key_results:
          - id: "kr_2_1"
            text: "Monthly revenue reach 50M"
            metric: "monthly_revenue"
            baseline: 42000000
            target: 50000000
            current: 45500000
            progress: 43.75

    success_metrics:
      primary: ["dau", "d7_retention", "monthly_revenue"]
      supporting: ["dau_conversion", "arpu", "paying_users"]
      guardrail: ["user_satisfaction", "app_crash_rate"]
```

### Step 2: Analyze (Insight Generation) AI [Core]

Narrative insight transformation, decision recommendations, decision boundaries, confidence assessment

Integrates the insight transformation capability of the original decision-insight, transforming analysis results into narrative insights.

#### 2.1 Data Collection and Analysis

Auto-collect and analyze data:

```yaml
analyze:
  status: "automated"
  execution_mode: "continuous"

  data_sources:
    - type: "metrics"
      name: "daily_metrics"
      frequency: "hourly"

    - type: "experiments"
      name: "ab_test_results"
      frequency: "on_completion"

    - type: "events"
      name: "product_events"
      frequency: "realtime"

  analyses_performed:
    - type: "anomaly_detection"
      findings:
        - metric: "dau_conversion"
          status: "warning"
          change: -3.2%
          reason: "Registration flow change impact"

    - type: "experiment_summary"
      findings:
        - experiment: "Simplified registration experiment"
          result: "positive"
          lift: +8.2%

    - type: "funnel_analysis"
      findings:
        - funnel: "Purchase conversion"
          conversion: 7.2%
          critical_drop: "step_1_to_2"
```

#### 2.2 From Numbers to Stories

```
Data analysis -> Business narrative
```

**Transformation Principles**:

| Data Language | Business Language |
|--------------|------------------|
| Conversion rate dropped 3.2% | "Out of every 100 visitors, 3 fewer complete registration" |
| p-value=0.001 | "This conclusion has 99.9% confidence" |
| Confidence interval [2%,5%] | "We're confident the improvement is between 2% and 5%" |
| D7 retention 28.5% | "After one week, about 3 in 10 users are still using the product" |

**Narrative Template**:

```yaml
narrative_template: |
  ## Insight Title

  ### Background
  How did [product/feature] perform in [time range]?

  ### Finding
  We found [core data change], which means [business impact].

  ### Impact
  Without intervention, [impact level] is expected after [time].
  If intervention succeeds, [benefit] is expected.

  ### Recommendation
  Based on data, we recommend [specific action].
```

#### 2.3 Decision Recommendation Generation

Generate multiple executable decision options:

```yaml
action_options:
  - option_id: "opt_001"
    option_name: "Full release new feature"
    description: "Full release the new registration flow from the experiment group"

    expected_effect:
      primary_metric: "+8.2% registration conversion rate"
      secondary_metrics:
        - "Registered users +12%"
        - "Overall DAU +2%"

    risk:
      level: "low"
      factors:
        - "All guardrail metrics safe"
        - "Effect stable, no novelty effect"
        - "Can quickly rollback"

    confidence:
      level: "high"
      basis:
        - "Statistically significant (p=0.001)"
        - "Complete experiment period (14 days)"
        - "Sufficient sample size (24830)"

    resource_requirements:
      engineering: "2 person-days (release deployment)"
      qa: "1 person-day (regression testing)"

    timeline:
      ready_for_release: "2 days later"

    prerequisites:
      - "Technical review passed"
      - "Monitoring alert configuration complete"

  - option_id: "opt_002"
    option_name: "Phased release"
    description: "Release iOS first, then Android after stabilization"

    expected_effect:
      primary_metric: "+5.2% iOS registration conversion rate"
      secondary_metrics:
        - "Android effect to be verified"

    risk:
      level: "medium"
      factors:
        - "Android effect uncertain"
        - "Maintaining two logic sets"

    confidence:
      level: "medium"
      basis:
        - "iOS statistically significant"
        - "Android effect not significant"
```

#### 2.4 Decision Boundary Annotation

Distinguish different types of decisions:

```yaml
decision_boundary:
  type: "data_decision"
  criteria:
    - "Statistically significant (p < 0.01)"
    - "Practically significant (exceeds threshold)"
    - "Guardrail metrics safe"
    - "No major risks"
  auto_execute_eligible: true

  automation_level: "full"

  human_oversight:
    required: false
    notification_only: true

decision_boundary:
  type: "data_reference"
  criteria:
    - "Data supports one option"
    - "But uncertainty exists"
    - "Or strategic considerations involved"
  auto_execute_eligible: false

  human_oversight:
    required: true
    decision_maker: "product_manager"
    deadline: "3 business days"
```

#### 2.5 Insight Summary

```yaml
insights_gathered:
  - insight: "Simplified registration flow can improve new user conversion"
    confidence: "high"
    source: "ab_test"

  - insight: "Add-to-cart step drop-off rate high"
    confidence: "medium"
    source: "funnel_analysis"

  - insight: "iOS retention performance better than Android"
    confidence: "high"
    source: "retention_analysis"
```

### Step 3: Conclude (Decision Options) AI->Human [Core]

AI-assisted human decision-making

AI generates decision recommendations, humans make the final decision:

```yaml
conclude:
  status: "human_decision"
  human_participation: true

  automated_analysis:
    options_considered: 3

    recommendations:
      - priority: 1
        action: "Full release simplified registration flow"
        rationale: "Experiment data shows conversion lift 8.2%, guardrail metrics safe"
        expected_outcome: "New user registration conversion +8.2%"
        risk_level: "low"

      - priority: 2
        action: "Optimize add-to-cart flow"
        rationale: "Funnel analysis shows add-to-cart is key drop-off point"
        expected_outcome: "Overall conversion improvement potential +15%"
        risk_level: "medium"

      - priority: 3
        action: "Targeted Android retention optimization"
        rationale: "Android retention lower than iOS, needs targeted optimization"
        expected_outcome: "Android D7 retention +5%"
        risk_level: "medium"

  human_decision_required:
    decision_type: "strategy_confirmation"
    decision_maker: "product_director"
    deadline: "2024-01-20"

    context_provided:
      - "Complete experiment analysis report"
      - "Risk assessment"
      - "Resource allocation requirements"
      - "Timeline planning"
```

### Step 4: Execute (Execution Tracking) AI [Conditional]

Track execution effectiveness:

```yaml
execute:
  status: "tracking"
  tracking_mode: "automated"

  approved_actions:
    - action_id: "act_001"
      action: "Full release simplified registration flow"
      approved_by: "product_director"
      approved_at: "2024-01-18"

      implementation:
        planned_date: "2024-01-22"
        rollout_plan: "100% traffic"

      tracking:
        metrics:
          - name: "registration_completion_rate"
            baseline: 0.35
            target: 0.38
            current: 0.381

        status: "released"
        release_date: "2024-01-22"

        monitoring:
          daily_check: true
          alert_threshold: -0.02

  results_tracked:
    - action_id: "act_001"
      days_since_release: 3

      results:
        metric: "registration_completion_rate"
        baseline: 0.35
        current: 0.378
        change: +8.0%
        status: "on_track"

      guardrail_status:
        - metric: "d7_retention"
          baseline: 0.42
          current: 0.419
          change: -0.2%
          status: "safe"

      verdict: "Feature performing as expected, continue monitoring"
```

## DACE Status Tracking

```yaml
dace_status:
  cycle_id: "dace_2024_Q1"
  current_phase: "Execute"

  phase_history:
    - phase: "Define"
      started: "2024-01-01"
      completed: "2024-01-05"
      output: "Q1 OKR system"

    - phase: "Analyze"
      started: "2024-01-05"
      completed: "2024-01-15"
      output: "Comprehensive analysis report + narrative insights"

    - phase: "Conclude"
      started: "2024-01-15"
      completed: "2024-01-18"
      output: "Decision recommendations + approval"

    - phase: "Execute"
      started: "2024-01-18"
      status: "in_progress"
      output: "Tracking results"

  insights:
    total_insights: 12
    actionable: 8
    implemented: 3
    pending: 5

  action_taken:
    total_actions: 3
    completed: 1
    in_progress: 1
    pending: 1

  results_tracked:
    active_tracking: 2
    target_achieved: 0
    target_at_risk: 0
    target_on_track: 2
```

## Auto-Trigger Mechanism

| Trigger Condition | DACE Response |
|------------------|---------------|
| OKR update | Re-Define |
| Anomaly detection | Prioritize Analyze, trigger Conclude |
| Experiment complete | Analyze results, trigger Conclude |
| Decision executed | Enter Execute tracking |
| Cycle end | Complete current loop, prepare next cycle |

## OKR Tracking Configuration

```yaml
okr_tracking:
  cycle: "quarterly"
  current_cycle: "2024_Q1"

  update_frequency:
    progress: "daily"
    review: "weekly"
    recalibration: "monthly"

  alert_rules:
    - condition: "KR progress behind > 20%"
      severity: "high"
      action: "Trigger Conclude"

    - condition: "KR cannot be completed"
      severity: "critical"
      action: "Escalate + OKR adjustment"
```

## Insight Type Handling

### Anomaly Insight

```yaml
anomaly_insight:
  type: "anomaly"

  narrative: |
    ## Anomaly Detection Insight

    Found today: Registration conversion rate dropped from 35% to 32%.
    Anomaly start time: Today 9:00.
    Affected users: Approximately 15,000.

    Most likely cause: Registration flow change in v2.5.0.
    Confidence: 85%.

    Recommendation: Immediately check new version implementation, prepare rollback plan.

  action_options:
    - "Immediately rollback to previous version"
    - "Emergency fix then release hot update"
    - "Continue monitoring for 24 hours"

  decision_boundary:
    type: "data_decision"
    auto_execute_eligible: true
    condition: "Conversion rate continues to decline more than 5%"
```

### Funnel Insight

```yaml
funnel_insight:
  type: "funnel_analysis"

  narrative: |
    ## Purchase Conversion Funnel Insight

    Funnel overall conversion rate 7.2%, down 0.5 percentage points vs last week.

    Largest drop-off point: From browsing to add-to-cart, 84% of users drop off.
    Drop-off concentrated in: Price-sensitive users, Android users.

    Recommended optimization directions: Price display strategy, add-to-cart guidance copy.

  action_options:
    - "Optimize price display (show discounts, comparisons)"
    - "Enhance add-to-cart guidance (overlay, prompts)"
    - "Conduct research on dropped-off users"
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | decision recommendation and key rationale only | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full decision analysis + scenario modeling + stakeholder impact + decision audit trail | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-metrics-ops/decision-dace/`

**Output Files**: dace_status.json, okr_tracking.json, action_log.json, dace_cycle_report.md, decision_insight.json, insight_library.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["dace_status", "okr_tracking", "insight_id", "source", "narrative", "action_options"],
  "properties": {
    "dace_status": {"type": "object", "description": "DACE loop status, including current phase and progress"},
    "okr_tracking": {"type": "object", "description": "OKR tracking data, including objectives, key results, and achievement rate"},
    "action_log": {"type": "array", "description": "Action log, including executed decisions and pending items"},
    "cycle_report": {"type": "object", "description": "Cycle report, including analysis conclusions and execution recommendations"},
    "insight_id": {"type": "string", "description": "Insight unique identifier"},
    "created_at": {"type": "string", "description": "Creation time"},
    "source": {"type": "object", "description": "Insight source, including type and confidence"},
    "narrative": {"type": "string", "description": "Narrative description, including background, findings, impact, and recommendations"},
    "action_options": {"type": "array", "description": "Decision option list, including expected effect, risk, and confidence"},
    "decision_boundary": {"type": "object", "description": "Decision boundary, including type and auto-execute eligibility"},
    "decision_maker": {"type": "string", "description": "Decision maker role"},
    "deadline": {"type": "string", "description": "Decision deadline"}
  }
}
```

### Insight Output Example

```yaml
data_insight:
  insight_id: "insight_20240115_001"
  created_at: "2024-01-15T14:30:00Z"

  source:
    type: "experiment_result"
    experiment_id: "exp_20240115_simplified_register"
    confidence: "high"

  narrative: |
    ## Simplified Registration Flow Experiment Insight

    ### Background
    The product team launched a simplified registration flow experiment on January 15, 2024,
    shortening the 5-step registration flow to 3 steps.
    The experiment ran for 14 days with 24,830 users participating.

    ### Finding
    The treatment group (simplified flow) registration conversion rate reached 38.1%,
    compared to 35.2% for the control group (standard flow), an 8.2 percentage point improvement.
    This conclusion has 99.9% confidence (p=0.001).

    More importantly, this improvement is stable --
    from day 1 to day 14 of the experiment, the effect did not decay,
    indicating this is not a novelty effect but a genuine experience improvement.

    ### Impact
    If we fully release this feature:
    - Expected new registered users per month **+12%** (approximately 36K users/month)
    - Based on current conversion funnel, expected **+8%** DAU growth

    ### Risk
    We checked all guardrail metrics:
    - User D7 retention: 42.0% -> 41.8% (down 0.2%, acceptable)
    - DAU: Stable
    - Crash rate: No change

    All guardrail metrics are within safe range.

    ### Recommendation
    **Recommend full release of simplified registration flow.**
    This is a low-risk, high-reward change; the data supports immediate execution.

  action_options:
    - option: "Full release simplified registration flow"
      option_id: "opt_001"
      expected_effect:
        primary: "Registration conversion rate +8.2%"
        secondary: ["DAU +2%", "New users +12%"]
      risk: "low"
      confidence: "high"

    - option: "Platform-specific release (iOS first)"
      option_id: "opt_002"
      expected_effect:
        primary: "iOS conversion +5.2%"
        secondary: ["Android to be verified"]
      risk: "medium"
      confidence: "medium"

    - option: "Continue experiment for 2 weeks"
      option_id: "opt_003"
      expected_effect:
        primary: "More data verification"
        secondary: ["Reduce uncertainty"]
      risk: "low"
      confidence: "low"

  decision_boundary:
    type: "data_decision"
    description: |
      Data clearly supports the "full release" option:
      - Statistically significant (p=0.001)
      - Practically significant (+8.2%)
      - All guardrail metrics safe
      - No novelty effect

    auto_execute_eligible: true

    automation_conditions:
      - condition: "Technical team confirms release readiness"
        required: true
      - condition: "Monitoring alerts configured"
        required: true
      - condition: "Rollback plan prepared"
        required: true

    override_conditions:
      - condition: "Business strategy change"
        action: "Pause auto-execution, await manual confirmation"

  recommended_action:
    action: "Full release simplified registration flow"
    priority: "high"
    reason: "Data support sufficient, low risk, significant benefit"

    next_steps:
      - step: 1
        task: "Technical review"
        owner: "engineering"
        deadline: "2024-01-17"
      - step: 2
        task: "Configure monitoring alerts"
        owner: "data_team"
        deadline: "2024-01-18"
      - step: 3
        task: "Release deployment"
        owner: "engineering"
        deadline: "2024-01-19"
      - step: 4
        task: "Post-release monitoring"
        owner: "data_team"
        duration: "2 weeks"
```

```
output/pm-metrics-ops/decision-dace/
├── dace_status.json
├── okr_tracking.json
├── action_log.json
├── dace_cycle_report.md
├── decision_insight.json
└── insight_library.json
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| dace_status | object | Yes | DACE loop status |
| dace_status.cycle_id | string | Yes | Cycle ID |
| dace_status.current_phase | string | Yes | Current phase, enum: Define/Analyze/Conclude/Execute |
| dace_status.phase_history | array | Yes | Phase history |
| okr_tracking | object | Yes | OKR tracking data |
| okr_tracking.objectives | array | Yes | Objectives list |
| okr_tracking.objectives[].id | string | Yes | Objective ID |
| okr_tracking.objectives[].progress | number | Yes | Progress percentage |
| okr_tracking.objectives[].status | string | Yes | Status, enum: on_track/at_risk/behind |
| action_log | array | Yes | Action log |
| action_log[].action_id | string | Yes | Action ID |
| action_log[].action | string | Yes | Action description |
| action_log[].status | string | Yes | Status, enum: approved/in_progress/completed |
| data_insight | object | No | Data insight root object (Analyze phase output) |
| data_insight.insight_id | string | Yes | Insight unique identifier |
| data_insight.created_at | string | Yes | Creation time |
| data_insight.source | object | Yes | Insight source |
| data_insight.source.type | string | Yes | Source type, enum: experiment_result/anomaly/funnel_analysis/retention_analysis |
| data_insight.source.confidence | string | Yes | Source confidence |
| data_insight.narrative | string | Yes | Narrative description |
| data_insight.action_options | array | Yes | Decision option list, at least 2 |
| data_insight.action_options[].option_id | string | Yes | Option ID |
| data_insight.action_options[].expected_effect | object | Yes | Expected effect |
| data_insight.action_options[].risk | string | Yes | Risk level |
| data_insight.action_options[].confidence | string | Yes | Confidence |
| data_insight.decision_boundary | object | Yes | Decision boundary |
| data_insight.decision_boundary.type | string | Yes | Boundary type, enum: data_decision/data_reference/human_decision |
| data_insight.decision_boundary.auto_execute_eligible | boolean | Yes | Whether auto-executable |
| data_insight.recommended_action | object | Yes | Recommended action |
| data_insight.recommended_action.action | string | Yes | Action description |
| data_insight.recommended_action.priority | string | Yes | Priority |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| OKR data change | Define phase goal definition | Redefine goals, update KR baselines and target values |
| KR progress change | Analyze phase data analysis | Update deviation analysis, re-evaluate Conclude options |
| Experiment result change | Analyze and Conclude phases | Update experiment data, re-evaluate decision options |
| Analysis result update | Insight narrative and decision options | Update insight narrative, re-evaluate decision options |
| Business context change | Action recommendations and priorities | Re-evaluate action recommendations, update priorities |
| Historical insight library update | Duplicate insight detection | Execute deduplication check, merge similar insights |

When DACE status/insights themselves change, notification mechanism to downstream:

| Status/Insight Change Type | Notification Scope | Notification Method |
|---------------------------|-------------------|---------------------|
| Conclude phase decision complete | decision-culture | Flag decision complete, trigger report update |
| Execute phase execution effect | decision-culture | Flag execution effect, trigger culture report update |
| KR progress behind >20% | decision-culture | Flag progress risk, trigger weekly report risk annotation |
| data_decision type insight | decision-culture | Flag as auto-executable, trigger report update |
| data_reference type insight | decision-culture | Flag as needing human confirmation, trigger report update |
| Insight merged/confidence increased | decision-culture | Flag insight update, trigger report update |

---

## Decision Rules

| Situation | Handling Method |
|-----------|----------------|
| KR progress behind >20% | Trigger Conclude, generate decision recommendations |
| KR cannot be completed | Escalate + OKR adjustment recommendation |
| Experiment result statistically significant | Auto-enter Conclude phase |
| Guardrail metric breached | Pause Execute, return to Analyze |
| Insight confidence >=0.8 + guardrail metrics no decline | Flag auto_execute_eligible, notify for execution |
| Insight confidence >=0.8 + guardrail metrics uncertain | Flag data_reference, needs human confirmation |
| Insight confidence 0.5-0.8 | Flag data_reference, needs human confirmation |
| Insight confidence <0.5 | Flag human_decision, human-led |
| Insight involves strategic considerations (impact >=3 OKRs) | Flag human_decision, human-led |
| >=3 independent insights point to same conclusion | Merge insights, confidence boost 0.15 |
| 2 insights point to same conclusion | Merge insights, confidence boost 0.1 |
| Insight involves revenue impact >=10% | Force flag human_decision |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Define phase goals quantifiable, with baselines
- [ ] Analyze phase covers all data sources

### P1 Checks (must pass for standard/deep)

- [ ] Conclude phase provides at least 2 decision options
- [ ] Execute phase sets monitoring and rollback mechanisms
- [ ] Insight narrative uses business language not data jargon
- [ ] Each insight provides at least 2 decision options
- [ ] Decision boundary annotation correct (auto/reference/human)
- [ ] Recommended action has clear next steps and responsible person

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|-----------------|---------------|----------|
| OKR tracking missing | User provides current metric data -> execute DACE analysis | Define phase goal definition based on user description | Request user to provide current metric values and targets, or upload okr.json |
| Anomaly detection missing | Skip Analyze phase anomaly trigger, execute based on user-provided metric data | Analysis dimensions limited, may miss unmonitored anomalies | Request user to describe observed anomalies and metric changes, or upload anomaly-analysis.json |
| OKR tracking + Anomaly detection both missing | User provides current metric data -> execute DACE analysis | Output DACE analysis based on user data, Define and Analyze annotated as "to be supplemented" | Request user to provide current metric data and business goals, or execute metrics-system and analysis-anomaly first |
| Analysis results missing | User provides data findings -> transform into insights | Insights based on user description, may lack deep attribution | Request user to describe data findings and observed trends, or upload analysis reports |
| Experiment results missing | Skip experiment-related insight transformation | Experiment insight dimension missing | Request user to provide experiment results, or upload experiment-execution.json |
| Analysis results + Experiment results both missing | User provides data findings -> transform into insights | Output insights based on user description, attribution and decision boundaries annotated as "to be supplemented" | Request user to provide data findings and desired decision direction, or execute analysis-anomaly and experiment-execution first |

## Execution Frequency

| Phase | Execution Frequency | Trigger Method |
|-------|-------------------|----------------|
| Define | Quarterly/OKR change | Automatic |
| Analyze | Continuous | Scheduled + Event |
| Conclude | On demand | Analysis complete |
| Execute | Continuous | Decision approved |
