---
name: decision-dace
description: Use when you need to execute a data-driven decision loop or transform data into actionable insights. DACE loop automation, Define/Analyze executed automatically by AI, Conclude assisted by AI for human decision-making, Execute tracked by AI for execution effectiveness. The Analyze phase integrates insight transformation capabilities, converting analysis results into narrative insights, decision recommendations, and decision boundary annotations. Keywords: DACE loop, data decision, decision loop, data-driven, decision framework, decision cycle, data analysis loop, making decisions with data, decision process, how to use data to drive action, data insights, insight transformation, decision recommendations, narrative analysis, data storytelling, data is hard to understand, turning data into plain language, what does the data tell us.
metadata:
  module: "Product Metrics & Operations"
  sub-module: "Decision Loop"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["General"]
  trigger_examples:
    - "Help me make a data-driven decision using the DACE method"
    - "How to build a complete loop from data to action"
    - "Data was analyzed but no one is executing, what to do"
    - "What does this data mean, help me interpret it"
    - "Turn analysis results into a compelling story"
    - "The data is too dry, help me convert it into actionable recommendations"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Only output decision recommendations and key evidence"
  deep_description: "Full analysis + decision tree + sensitivity analysis + counterfactual reasoning"
---

# DACE Loop Automation (with Insight Transformation)

## Core Principles

1. **Define is direction, Analyze is evidence**: Analysis without clear objectives and decisions without evidence are equally dangerous
2. **Conclude authority belongs to humans, Execute tracking belongs to the system**: AI provides options and boundaries, humans make final decisions, the system tracks execution effectiveness
3. **A closed loop is complete**: DACE is inseparable; Conclude without Execute is empty talk, Conclude without Analyze is gambling
4. **Data is the starting point, insight is the endpoint, action is the purpose**: Insights without actionable direction are just data displays
5. **Narrative over jargon**: Translate "p=0.001" into "99.9% confidence", so decision-makers can understand and act
6. **Boundary annotation is more important than recommendations**: Clearly marking what can be auto-executed vs. what needs human confirmation is more valuable than simple recommendations

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| OKR Data | object | Yes | User provided | Objectives and key results, baseline values and target values |
| KR Progress | object | Yes | output/pm-metrics-ops/analysis-anomaly/anomaly_report.json | Current progress and deviation analysis for each KR |
| Experiment Results | object | Yes | output/pm-metrics-ops/experiment-execution/experiment_result.json | A/B test results, anomaly detection data |
| Analysis Results | object | Yes | output/pm-metrics-ops/analysis-anomaly/anomaly_report.json | anomaly/funnel/retention reports |
| Business Context | object | ○ | User provided | Product stage, team objectives |
| Historical Insight Library | object[] | ○ | output/pm-metrics-ops/decision-dace/insight_library.json | Avoid duplication |

## Execution Steps

### DACE Four Phases

```
┌────────────────────────────────────────────────────────┐
│                     DACE Loop                           │
├────────────────────────────────────────────────────────┤
│                                                        │
│   ┌─────────┐                                          │
│   │  Define │  Define objectives and success metrics    │
│   └────┬────┘                                          │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐                                          │
│   │ Analyze │  Insight generation: Data→Story→Decision  │
│   └────┬────┘                                          │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐                                          │
│   │Conclude │  Draw conclusions and decision recs  ◀──┐ │
│   └────┬────┘                               │         │
│        │                                    │         │
│        ▼                                    │         │
│   ┌─────────┐                               │         │
│   │ Execute │  Execute strategy and track ──┘         │
│   └─────────┘       │                             │    │
│        │            │                             │    │
│        ▼            │                             │    │
│   Return to Analyze ◀─────┘                       │    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Step 1: Define 🤖 [Core]

Automatically establish OKR tracking system:

```yaml
define:
  status: "automated"
  trigger: "OKR update or quarter start"

  output:
    current_cycle: "2024_Q1"
    cycle_id: "dace_2024_Q1"

    objectives:
      - id: "obj_1"
        text: "Increase user engagement"
        owner: "product_team"

        key_results:
          - id: "kr_1_1"
            text: "DAU reaches 12 million"
            metric: "dau"
            baseline: 10500000
            target: 12000000
            current: 10800000
            progress: 30

          - id: "kr_1_2"
            text: "D7 retention rate reaches 30%"
            metric: "d7_retention"
            baseline: 0.25
            target: 0.30
            current: 0.285
            progress: 70

      - id: "obj_2"
        text: "Increase monetization revenue"
        owner: "biz_team"

        key_results:
          - id: "kr_2_1"
            text: "Monthly revenue reaches 50 million"
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

### Step 2: Analyze (Insight Generation) 🤖 [Core]

Narrative insight transformation, decision recommendations, decision boundaries, confidence assessment

Integrates the insight transformation capabilities from the original decision-insight, converting analysis results into narrative insights.

#### 2.1 Data Collection and Analysis [Core]

Automatically collect and analyze data:

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

#### 2.2 From Numbers to Stories [Core]

```
Data Analysis → Business Narrative
```

**Transformation Principles**:

| Data Language | Business Language |
|---------|---------|
| Conversion rate dropped 3.2% | "Out of every 100 visitors, 3 fewer complete registration" |
| p-value=0.001 | "This conclusion has 99.9% confidence" |
| Confidence interval [2%,5%] | "We are confident the improvement is between 2% and 5%" |
| D7 retention 28.5% | "After one week, about 3 in 10 users are still using the product" |

**Narrative Template**:

```yaml
narrative_template: |
  ## Insight Title

  ### Background
  How did [product/feature] perform during [time range]?

  ### Findings
  We found [core data change], which means [business impact].

  ### Impact
  Without intervention, [impact degree] is expected after [time].
  If intervention succeeds, [benefit] is expected.

  ### Recommendation
  Based on the data, we recommend [specific action].
```

#### 2.3 Decision Recommendation Generation [Conditional]

Generate multiple actionable decision options:

```yaml
action_options:
  - option_id: "opt_001"
    option_name: "Full rollout of new feature"
    description: "Roll out the new registration flow from the experiment group to all users"

    expected_effect:
      primary_metric: "+8.2% registration conversion rate"
      secondary_metrics:
        - "Registered users +12%"
        - "Overall DAU +2%"

    risk:
      level: "low"
      factors:
        - "All guardrail metrics are safe"
        - "Effect is stable with no novelty effect"
        - "Can be quickly rolled back"

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
      ready_for_release: "In 2 days"

    prerequisites:
      - "Technical review approved"
      - "Monitoring alerts configured"

  - option_id: "opt_002"
    option_name: "Phased rollout"
    description: "Release iOS first, then Android after stabilization"

    expected_effect:
      primary_metric: "+5.2% iOS registration conversion rate"
      secondary_metrics:
        - "Android effect pending verification"

    risk:
      level: "medium"
      factors:
        - "Android effect uncertain"
        - "Maintaining two logic branches"

    confidence:
      level: "medium"
      basis:
        - "iOS statistically significant"
        - "Android effect not significant"
```

#### 2.4 Decision Boundary Annotation [Deep]

Distinguish between different types of decisions:

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

#### 2.5 Insight Aggregation [Conditional]

```yaml
insights_gathered:
  - insight: "Simplified registration flow can improve new user conversion"
    confidence: "high"
    source: "ab_test"

  - insight: "Add-to-cart stage has high drop-off rate"
    confidence: "medium"
    source: "funnel_analysis"

  - insight: "iOS retention outperforms Android"
    confidence: "high"
    source: "retention_analysis"
```

### Step 3: Conclude (Decision Options) 🤖→👤 [Core]

AI-assisted human decision-making

AI generates decision recommendations, humans make the final call:

```yaml
conclude:
  status: "human_decision"
  human_participation: true

  automated_analysis:
    options_considered: 3

    recommendations:
      - priority: 1
        action: "Full rollout of simplified registration flow"
        rationale: "Experiment data shows 8.2% conversion improvement, guardrail metrics safe"
        expected_outcome: "New user registration conversion +8.2%"
        risk_level: "low"

      - priority: 2
        action: "Optimize add-to-cart flow"
        rationale: "Funnel analysis shows add-to-cart is a key drop-off point"
        expected_outcome: "Overall conversion improvement potential +15%"
        risk_level: "medium"

      - priority: 3
        action: "Retention optimization for Android"
        rationale: "Android retention is lower than iOS, targeted optimization needed"
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

### Step 4: Execute (Execution Tracking) 🤖 [Conditional]

Track execution effectiveness:

```yaml
execute:
  status: "tracking"
  tracking_mode: "automated"

  approved_actions:
    - action_id: "act_001"
      action: "Full rollout of simplified registration flow"
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
|---------|---------|
| OKR update | Re-Define |
| Anomaly detected | Prioritize Analyze, trigger Conclude |
| Experiment completed | Analyze results, trigger Conclude |
| Decision executed | Enter Execute tracking |
| Cycle ended | Complete current loop, prepare for next cycle |

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

## Insight Type Processing

### Anomaly Insight

```yaml
anomaly_insight:
  type: "anomaly"

  narrative: |
    ## Anomaly Detection Insight

    Today's finding: Registration conversion rate dropped from 35% to 32%.
    Anomaly start time: Today at 9:00.
    Affected users: Approximately 15,000.

    Most likely cause: Registration flow change in v2.5.0.
    Confidence: 85%.

    Recommendation: Immediately check the new version implementation, prepare rollback plan.

  action_options:
    - "Immediately roll back to previous version"
    - "Emergency fix and hotfix release"
    - "Continue monitoring for 24 hours"

  decision_boundary:
    type: "data_decision"
    auto_execute_eligible: true
    condition: "Conversion rate continues to drop more than 5%"
```

### Funnel Insight

```yaml
funnel_insight:
  type: "funnel_analysis"

  narrative: |
    ## Purchase Conversion Funnel Insight

    Overall funnel conversion rate is 7.2%, down 0.5 percentage points from last week.

    Largest drop-off point: From browsing to add-to-cart, 84% of users lost.
    Drop-off concentrated in: Price-sensitive users, Android users.

    Recommended optimization directions: Price display strategy, add-to-cart guidance messaging.

  action_options:
    - "Optimize price display (show discounts, comparisons)"
    - "Enhance add-to-cart guidance (overlay, prompts)"
    - "Survey dropped-off users"
```

## Output

**Storage Path**: `output/pm-metrics-ops/decision-dace/`

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Decision recommendations + key evidence | Core conclusions + minimum viable deliverables, only output Define conclusions and Conclude recommended options |
| standard | Complete decision analysis (current default) | Complete deliverables, including all four DACE phases output |
| deep | Complete analysis + extended analysis | Complete deliverables + decision tree + sensitivity analysis + counterfactual reasoning + decision records + risk assessment |

**Output Files**: dace_status.json, okr_tracking.json, action_log.json, dace_cycle_report.md, decision_insight.json, insight_library.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["dace_status", "okr_tracking", "insight_id", "source", "narrative", "action_options"],
  "properties": {
    "dace_status": {"type": "object", "description": "DACE loop status, including current phase and progress"},
    "okr_tracking": {"type": "object", "description": "OKR tracking data, including objectives, key results and achievement rates"},
    "action_log": {"type": "array", "description": "Action log, including executed decisions and pending items"},
    "cycle_report": {"type": "object", "description": "Cycle report, including analysis conclusions and execution recommendations"},
    "insight_id": {"type": "string", "description": "Unique insight identifier"},
    "created_at": {"type": "string", "description": "Creation time"},
    "source": {"type": "object", "description": "Insight source, including type and confidence"},
    "narrative": {"type": "string", "description": "Narrative description, including background, findings, impact and recommendations"},
    "action_options": {"type": "array", "description": "Decision options list, including expected effects, risks and confidence"},
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
    shortening the 5-step registration process to 3 steps.
    The experiment ran for 14 days with 24,830 users participating.

    ### Findings
    The experiment group (simplified flow) achieved a registration conversion rate of 38.1%,
    compared to 35.2% for the control group (standard flow), an improvement of 8.2 percentage points.
    This conclusion has 99.9% confidence (p=0.001).

    More importantly, this improvement is stable —
    from day 1 to day 14 of the experiment, the effect did not diminish,
    indicating this is not a novelty effect but a genuine experience improvement.

    ### Impact
    If we fully roll out this feature:
    - Expected new registered users per month **+12%** (approximately 36,000 users/month)
    - Based on the current conversion funnel, expected **+8%** DAU growth

    ### Risks
    We checked all guardrail metrics:
    - User 7-day retention: 42.0% → 41.8% (down 0.2%, acceptable)
    - DAU: Stable
    - Crash rate: No change

    All guardrail metrics are within safe range.

    ### Recommendation
    **Recommend full rollout of the simplified registration flow.**
    This is a low-risk, high-reward change, and the data supports immediate execution.

  action_options:
    - option: "Full rollout of simplified registration flow"
      option_id: "opt_001"
      expected_effect:
        primary: "Registration conversion rate +8.2%"
        secondary: ["DAU +2%", "New users +12%"]
      risk: "low"
      confidence: "high"

    - option: "Platform-by-platform rollout (iOS first)"
      option_id: "opt_002"
      expected_effect:
        primary: "iOS conversion +5.2%"
        secondary: ["Android pending verification"]
      risk: "medium"
      confidence: "medium"

    - option: "Continue experiment for 2 more weeks"
      option_id: "opt_003"
      expected_effect:
        primary: "More data for verification"
        secondary: ["Reduce uncertainty"]
      risk: "low"
      confidence: "low"

  decision_boundary:
    type: "data_decision"
    description: |
      The data clearly supports the "full rollout" option:
      - Statistically significant (p=0.001)
      - Practically significant (+8.2%)
      - All guardrail metrics safe
      - No novelty effect

    auto_execute_eligible: true

    automation_conditions:
      - condition: "Engineering team confirms ready for release"
        required: true
      - condition: "Monitoring alerts configured"
        required: true
      - condition: "Rollback plan prepared"
        required: true

    override_conditions:
      - condition: "Business strategy change"
        action: "Pause auto-execution, wait for human confirmation"

  recommended_action:
    action: "Full rollout of simplified registration flow"
    priority: "high"
    reason: "Strong data support, low risk, significant benefit"

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
|----------|------|------|------|
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
| data_insight.insight_id | string | Yes | Unique insight identifier |
| data_insight.created_at | string | Yes | Creation time |
| data_insight.source | object | Yes | Insight source |
| data_insight.source.type | string | Yes | Source type, enum: experiment_result/anomaly/funnel_analysis/retention_analysis |
| data_insight.source.confidence | string | Yes | Source confidence |
| data_insight.narrative | string | Yes | Narrative description |
| data_insight.action_options | array | Yes | Decision options list, at least 2 |
| data_insight.action_options[].option_id | string | Yes | Option ID |
| data_insight.action_options[].expected_effect | object | Yes | Expected effect |
| data_insight.action_options[].risk | string | Yes | Risk level |
| data_insight.action_options[].confidence | string | Yes | Confidence |
| data_insight.decision_boundary | object | Yes | Decision boundary |
| data_insight.decision_boundary.type | string | Yes | Boundary type, enum: data_decision/data_reference/human_decision |
| data_insight.decision_boundary.auto_execute_eligible | boolean | Yes | Whether auto-execution is eligible |
| data_insight.recommended_action | object | Yes | Recommended action |
| data_insight.recommended_action.action | string | Yes | Action description |
| data_insight.recommended_action.priority | string | Yes | Priority |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| OKR data change | Define phase objective definition | Redefine objectives, update KR baselines and targets |
| KR progress change | Analyze phase data analysis | Update deviation analysis, re-evaluate Conclude options |
| Experiment results change | Analyze and Conclude phases | Update experiment data, re-evaluate decision options |
| Analysis results update | Insight narrative and decision options | Update insight narrative, re-evaluate decision options |
| Business context change | Action recommendations and priorities | Re-evaluate action recommendations, update priorities |
| Historical insight library update | Duplicate insight detection | Execute deduplication check, merge similar insights |

When DACE status/insights themselves change, downstream notification mechanism:

| Status/Insight Change Type | Notification Scope | Notification Method |
|-------------------|----------|----------|
| Conclude phase decision completed | decision-culture | Mark decision completed, trigger report update |
| Execute phase execution effectiveness | decision-culture | Mark execution effectiveness, trigger culture report update |
| KR progress behind >20% | decision-culture | Mark progress risk, trigger weekly report risk annotation |
| data_decision type insight | decision-culture | Mark as auto-executable, trigger report update |
| data_reference type insight | decision-culture | Mark as requiring human confirmation, trigger report update |
| Insight merged/confidence increased | decision-culture | Mark insight update, trigger report update |

---

## Decision Rules

| Situation | Handling |
|------|----------|
| KR progress behind >20% | Trigger Conclude, generate decision recommendations |
| KR cannot be completed | Escalate + OKR adjustment recommendation |
| Experiment results statistically significant | Automatically enter Conclude phase |
| Guardrail metrics breached | Pause Execute, return to Analyze |
| Insight confidence ≥0.8 + guardrail metrics no decline | Mark auto_execute_eligible, notify for execution |
| Insight confidence ≥0.8 + guardrail metrics uncertain | Mark data_reference, requires human confirmation |
| Insight confidence 0.5-0.8 | Mark data_reference, requires human confirmation |
| Insight confidence <0.5 | Mark human_decision, human-led |
| Insight involves strategic considerations (impacting ≥3 OKRs) | Mark human_decision, human-led |
| ≥3 independent insights point to same conclusion | Merge insights, confidence increase 0.15 |
| 2 insights point to same conclusion | Merge insights, confidence increase 0.1 |
| Insight involves revenue impact ≥10% | Force mark human_decision |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Define phase objectives are quantifiable with baselines
- [ ] Analyze phase covers all data sources
- [ ] Conclude phase provides at least 2 decision options

### P1 Checks (must pass for standard/deep)

- [ ] Execute phase has monitoring and rollback mechanisms
- [ ] Insight narrative uses business language rather than data jargon
- [ ] Each insight provides at least 2 decision options
- [ ] Recommended actions have clear next steps and owners

### P2 Checks (only deep must pass)

- [ ] Decision boundary annotations are correct (auto/reference/human)
- [ ] Decision tree generated (branch options and probability assessments)
- [ ] Sensitivity analysis completed (impact of key variables on decision conclusions)
- [ ] Counterfactual reasoning completed (projected outcomes if alternative options were chosen)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|----------|----------|----------|
| OKR tracking missing | User provides current metric data → Execute DACE analysis | Define phase objectives based on user description |
| Anomaly detection missing | Skip Analyze phase anomaly triggers, execute based on user-provided metric data | Analysis dimensions limited, may miss unmonitored anomalies |
| OKR tracking + anomaly detection both missing | User provides current metric data → Execute DACE analysis | Output based on user data DACE analysis, Define and Analyze annotated "to be supplemented" |
| Analysis results missing | User provides data findings → Convert to insights | Insights based on user description, may lack deep attribution |
| Experiment results missing | Skip experiment-related insight transformation | Experiment insight dimension missing |
| Analysis results + experiment results both missing | User provides data findings → Convert to insights | Output based on user description insights, attribution and decision boundaries annotated "to be supplemented" |

### Data Acquisition Instructions

When upstream files are missing, users need to provide the following information to support degraded generation:
- **Current metric data**: Current values, baseline values and target values for key metrics
- **Business objectives** (optional): Current stage business priorities and decision needs
- **Known issues** (optional): Discovered anomalies or pending decisions
- **Data findings** (optional): Observed data changes, trends or anomalies
- **Expected decision direction** (optional): Desired type of decision the insights should support

## Execution Frequency

| Phase | Execution Frequency | Trigger Method |
|-------|---------|---------|
| Define | Quarterly/OKR change | Automatic |
| Analyze | Continuous | Scheduled + Event |
| Conclude | On demand | Analysis completed |
| Execute | Continuous | Decision approved |
