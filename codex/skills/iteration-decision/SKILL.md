---
name: iteration-decision
description: Use when optimizing product Backlog priorities or adjusting iteration decisions. End-to-end iteration decision pipeline, from Backlog grooming, priority assessment to iteration retrospective. Keywords: Backlog optimization, requirement pool management, requirement linking, Backlog grooming, requirement reorganization, messy requirement pool, what to do first, priority adjustment, iteration priority, RICE scoring, requirement ranking, iteration planning, inserting requirements, re-ranking priorities, iteration retrospective, Sprint retrospective, continuous improvement, action item tracking, iteration review, iteration summary, how did this iteration go.
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Iteration Optimization"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Requirement pool is too messy, how to organize"
    - "How to rank backlog priorities"
    - "Too many requirements, which to do first"
    - "Iteration plan needs adjustment, what to do"
    - "Need to insert a requirement, how to prioritize"
    - "How to re-rank priorities"
    - "This iteration needs retrospective"
    - "Sprint ended, how to summarize"
    - "How did the iteration go"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Only output iteration direction suggestions"
  deep_description: "Complete decision + competitive iteration comparison + technical debt impact analysis + long-term roadmap assessment"
---

# Iteration Decision Pipeline 🤖

## Core Principles

1. **Priority is the quantitative expression of resource allocation**: The essence of Backlog ranking is deciding where resources go. Every ranking change means reallocation of resources
2. **Correlation is leverage**: Identifying dependency and synergy relationships between requirements. Correlated requirements done together are 3x more efficient than done separately
3. **Technical debt is a hidden cost that must be made explicit**: Technical debt not in the Backlog will never be paid back. It must carry weight in priority scoring
4. **Priority adjustment is not re-ranking, but re-allocating resources**: Every adjustment means breaking existing commitments. Chain effects must be evaluated
5. **Change impact assessment precedes adjustment decisions**: Quantify impact first, then decide on adjustments. Avoid snap decisions causing greater chaos
6. **Risk assessment is the guardrail for adjustments**: Every adjustment must come with a risk assessment, ensuring adjustments don't introduce bigger problems
7. **The purpose of retrospective is improvement, not blame**: Retrospectives must establish psychological safety, otherwise teams will only report good news and hide problems
8. **Data-driven attribution, not subjective impressions**: Use metric data to validate "feelings", avoiding impression bias masking real issues
9. **Improvement suggestions must be trackable and verifiable**: Every improvement suggestion must have an owner and verification criteria, otherwise retrospectives are just going through the motions

### Trigger Conditions

| Trigger Condition | Description | Priority |
|----------|------|--------|
| Monitoring Anomaly | Monitoring system detects anomaly | P0 |
| Major Feedback | Large volume of user complaints or important customer feedback | P0 |
| Strategic Change | Major change in business strategy or market environment | P1 |
| Resource Change | Team member additions/reductions or available time changes | P2 |

## Interaction Mode

🤖→👤 AI Suggests Human Approval

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Requirement Pool | JSON Array | Yes | Project Management System → Requirement Pool | User stories, feature requests, Bugs |
| Technical Debt | JSON | Yes | Code Quality Platform → Technical Debt | Debt list, impact assessment |
| Monitoring Alerts | JSON | No | output/pm-monitoring/monitoring-pipeline/alert_data | Technical issues to resolve |
| User Feedback | JSON | No | Feedback System → User Feedback | Complaints, feature requests, suggestions |
| Current Iteration Plan | JSON | Yes | output/pm-project/agile-sprint-planning/sprint_plan | Sprint Backlog, committed items |
| Trigger Event | JSON | Yes | Monitoring System/Feedback System → Trigger Event | Anomaly details, feedback content, strategic change |
| Resource Constraints | JSON | Yes | output/pm-project/planning-resource/resource_plan | Team capacity, available time, dependencies |
| Change Requirements | JSON | Yes | User provided | Items to add/modify/remove |
| Iteration Completion Status | JSON | Yes | output/pm-project/agile-daily-sync/daily_sync | Completed/incomplete items, story points |
| Quality Metrics | JSON | Yes | Test Platform/CI/CD → Quality Data | Defect count, code coverage, rework rate |
| Team Feedback | JSON | No | Retro Tool → Team Feedback | Retro meeting notes, voting results |
| Monitoring Data | JSON | No | output/pm-monitoring/monitoring-pipeline/monitoring_data | Stability, performance change data |

## Execution Steps

### Step 1: Backlog Grooming [Core] (from iteration-backlog)

**Objective**: Groom and optimize the issue Backlog, complete correlation analysis and reorganization

#### 1.1 Issue Priority Assessment [Core]

**Assessment Model**:

```
Priority Score = Business Impact × User Value × Urgency × Effort Adjusted
```

**Scoring Dimensions**:

| Dimension | Weight | Scoring Criteria |
|------|------|----------|
| Business Impact | 30% | Revenue impact, brand impact, strategic value |
| User Value | 25% | User request frequency, pain point intensity |
| Urgency | 25% | Alert impact, competitive threat, compliance requirements |
| Effort Adjusted | 20% | Resource requirements, dependencies, risk |

**Scoring Formula**:

```yaml
priority_score:
  business_impact:
    score: 0-10
    factors:
      revenue_impact: {value}
      brand_impact: {value}
      strategic_value: {value}
  user_value:
    score: 0-10
    factors:
      request_frequency: {count}
      pain_point_intensity: {value}
  urgency:
    score: 0-10
    factors:
      alert_impact: {value}
      competitive_threat: {value}
      compliance_requirement: {value}
  effort_adjusted:
    score: 0-10
    factors:
      resource_requirement: {story_points}
      dependencies: {count}
      technical_risk: {value}
  final_score: {weighted_sum}
```

#### 1.2 Technical Debt Impact Analysis [Conditional]

**Impact Types**:

| Type | Impact Metric | Quantification Method |
|------|----------|----------|
| Development Efficiency | Extra effort ratio | Debt vs new features within Sprint |
| Defect Rate | Bug density | Bugs per thousand lines of code |
| Performance Degradation | Response time increment | Before/after optimization comparison |
| Maintenance Cost | Code complexity | Cyclomatic Complexity |

**Debt Classification**:

```yaml
technical_debt_impact:
  - debt_id: {id}
    category: code_quality | performance | security | architecture
    severity: critical | high | medium | low
    affected_systems: [{system}]
    metrics:
      development_overhead: {percentage}
      defect_rate_impact: {percentage}
      performance_impact: {percentage}
    affected_backlog_items: [{item_id}]
    interest_accrued: {story_points_per_sprint}
```

#### 1.3 Correlation Analysis [Conditional]

**Correlation Types**:

| Type | Description | Handling Method |
|------|------|----------|
| Dependency | A must come before B | Enforce order |
| Synergy | A and B work better together | Suggest combining |
| Mutual Exclusion | A and B cannot be done simultaneously | Flag conflict |
| Technical Debt Link | New feature affected by debt | Debt takes priority |

**Correlation Output**:

```yaml
linked_issues:
  - item_id: {id}
    dependencies:
      - depends_on: {item_id}
        type: hard | soft
        reason: {description}
    synergies:
      - related_to: {item_id}
        reason: "Maximize value when implemented together"
    technical_debt_blockers:
      - debt_id: {id}
        impact: "Causes 20% reduction in development efficiency"
```

#### 1.4 Backlog Reorganization [Deep]

**Reorganization Strategies**:

| Strategy | Applicable Scenarios | Operation |
|------|----------|------|
| Urgent First | Alerts/Major Bugs | Elevate priority, mark P0 |
| Batch Combination | Related debt/features | Package as Epic |
| Defer | Low priority long-tail requirements | Move to Icebox |
| Split | Large granularity items | Split into smaller stories |
| Dependency Ordering | Items with prerequisites | Sort by dependency chain |

**Reorganization Suggestion Format**:

```yaml
reorganization_suggestions:
  - action: prioritize | combine | postpone | split | reorder
    target:
      item_id: {id}
      current_position: {position}
      suggested_position: {position}
    reason: {description}
    impact:
      effort_saved: {story_points}
      risk_reduced: {percentage}
      value_delivered: {description}
```

### Step 2: Priority Assessment [Core] (from iteration-prioritization)

**Objective**: Data-driven assessment of issue priorities, generate adjustment plans and risk assessments

#### 2.1 Change Impact Assessment [Core]

**Impact Dimensions**:

| Dimension | Assessment Content | Metric |
|------|----------|------|
| Scope Impact | Which items need adjustment | Item count, story points |
| Schedule Impact | Impact on delivery timeline | Days delayed |
| Quality Impact | Impact on quality standards | Risk level |
| Team Impact | Impact on team morale and efficiency | Workload change |
| Business Impact | Impact on business objectives | KPI changes |

**Impact Calculation**:

```yaml
impact_assessment:
  trigger_event:
    type: monitoring_alert | user_feedback | strategic_change | resource_change
    severity: P0 | P1 | P2
    description: {description}
  scope_impact:
    affected_items:
      - item_id: {id}
        current_status: in_progress | planned
        impact_type: replace | postpone | remove | add
        story_points_affected: {points}
    total_story_points: {points}
    percentage_of_iteration: {percentage}
  schedule_impact:
    original_end_date: {date}
    estimated_end_date: {date}
    days_delayed: {days}
  quality_impact:
    risk_level: high | medium | low
    areas_affected: [{area}]
  team_impact:
    workload_change: {percentage}
    context_switches: {count}
  business_impact:
    kpis_affected: [{kpi_name}]
    impact_assessment: {description}
```

#### 2.2 Adjustment Plan Generation [Core]

**Plan Types**:

| Plan Type | Applicable Scenarios | Cost |
|----------|----------|------|
| Insert | P0 urgent issue must be handled | Delay other items |
| Replace | Lower priority item of equal value exists | Abandon some features |
| Postpone | Lower priority items can be deferred | Delayed delivery |
| Split | Partial features can be delivered first | Phased delivery |

**Plan Generation**:

```yaml
adjustment_options:
  - option_id: OPT-001
    option_type: insert | replace | postpone | split
    title: {option_title}
    description: {description}
    changes:
      items_to_add:
        - item_id: {id}
          story_points: {points}
          source: {trigger_event}
        # ... same structure extensible
      items_to_remove:
        - item_id: {id}
          story_points: {points}
          reason: {reason}
        # ... same structure extensible
      items_to_modify:
        - item_id: {id}
          modification: {description}
        # ... same structure extensible
    tradeoffs:
      scope: "Abandon {feature}"
      schedule: "Delay {X} days"
      quality: "Introduce {risk}"
      business: "Impact {KPI}"
    risks:
      - risk: {description}
        likelihood: high | medium | low
        mitigation: {description}
      # ... same structure extensible
    recommendation_score: {score}
  # ... same structure extensible
```

#### 2.3 Risk Assessment [Conditional]

**Risk Matrix**:

| Risk Category | Assessment Dimension | Scoring Method |
|----------|----------|----------|
| Technical Risk | Complexity, dependencies, technical challenges | 1-5 score |
| Schedule Risk | Time pressure, change frequency | 1-5 score |
| Quality Risk | Test coverage, defect rate | 1-5 score |
| Communication Risk | Stakeholder satisfaction, expectation management | 1-5 score |

**Risk Assessment Output**:

```yaml
risk_assessment:
  option_id: OPT-001
  overall_risk_score: {score}
  risk_breakdown:
    technical_risk:
      score: 3
      concerns: [{concern}]
    schedule_risk:
      score: 4
      concerns: [{concern}]
    quality_risk:
      score: 2
      concerns: [{concern}]
    communication_risk:
      score: 3
      concerns: [{concern}]
  mitigation_plan:
    - risk: {description}
      strategy: avoid | mitigate | transfer | accept
      action: {description}
```

#### 2.4 Communication Draft [Deep]

**Stakeholders**:
- Team members
- Product Owner
- Stakeholders
- Customers (if applicable)

**Communication Template**:

```yaml
communication_draft:
  recipients:
    - team_members
    # ... same structure extensible
  subject: "Iteration {sprint_name} Change Notice"
  sections:
    change_summary:
      content: "{summary_text}"
    impact:
      content: "{impact_text}"
    decisions:
      content: "{decisions_text}"
    timeline:
      content: "{timeline_text}"
    questions_contact:
      content: "{contact_info}"
```

### Step 3: Iteration Retrospective [Conditional] (from iteration-retrospective)

**Objective**: Review iteration execution effectiveness, summarize learnings and improvement areas

#### 3.1 Data Collection [Conditional]

**Data Sources**:

| Data Type | Data Source | Collection Method |
|----------|--------|----------|
| Delivery Data | Project management system | API/Export |
| Quality Data | Test platform, CI/CD | API/Export |
| Team Feedback | Retro tool, meeting notes | Text/Export |
| Monitoring Data | Monitoring system, log platform | API/Export |

**Data Collection Scope**:

```yaml
data_collection:
  iteration_id: {id}
  period:
    start: {ISO8601}
    end: {ISO8601}
  delivery_data:
    planned_items: {count}
    completed_items: {count}
    planned_story_points: {points}
    completed_story_points: {points}
    carry_over_items: {count}
  quality_data:
    bugs_found: {count}
    bugs_fixed: {count}
    bug_leakage_rate: {percentage}
    code_coverage: {percentage}
    deployment_frequency: {count}
  team_feedback:
    retro_items: {count}
    top_votes: {items}
    sentiment: positive | neutral | negative
  monitoring_data:
    availability: {percentage}
    performance_change: {delta}
    incidents: {count}
```

#### 3.2 Multi-dimensional Analysis [Conditional]

##### 3.2.1 Delivery Analysis [Conditional]

**Metrics**:

| Metric | Definition | Target |
|------|------|------|
| Delivery Completion Rate | Completed story points / Planned story points | ≥ 85% |
| Delivery Forecast Accuracy | Actual / Planned | 0.9-1.1 |
| Requirement Change Rate | Changed items / Total items | < 15% |

**Analysis**:

```yaml
delivery_analysis:
  completion_rate: {percentage}
  velocity_actual: {points}
  velocity_planned: {points}
  velocity_accuracy: {ratio}
  change_rate: {percentage}
  carry_over_items:
    - item_id: {id}
      reason: {reason}
  assessment: good | acceptable | needs_improvement
```

##### 3.2.2 Quality Analysis [Conditional]

**Metrics**:

| Metric | Definition | Target |
|------|------|------|
| Bug Density | Bug count / Story point count | < 0.5 |
| Bug Leakage Rate | Production bugs / Test-discovered bugs | < 5% |
| Code Coverage | Covered code lines / Total code lines | ≥ 80% |

**Analysis**:

```yaml
quality_analysis:
  bug_density: {ratio}
  bug_leakage_rate: {percentage}
  code_coverage: {percentage}
  deployment_stability:
    success_rate: {percentage}
    rollbacks: {count}
  assessment: good | acceptable | needs_improvement
```

##### 3.2.3 Collaboration Analysis [Deep]

**Metrics**:

| Metric | Definition | Data Source |
|------|------|----------|
| Team Satisfaction | Team satisfaction score for iteration | Retro |
| Cross-team Collaboration | Collaboration effectiveness with other teams | Retro |
| Communication Efficiency | Information alignment level | Subjective evaluation |

**Analysis**:

```yaml
collaboration_analysis:
  team_satisfaction_score: {score}
  top_positives:
    - {item}
  top_pain_points:
    - {item}
  cross_team_collaboration:
    score: {score}
    issues: [{issue}]
  assessment: good | acceptable | needs_improvement
```

##### 3.2.4 Efficiency Analysis [Deep]

**Metrics**:

| Metric | Definition | Calculation Method |
|------|------|----------|
| Team Throughput | Story points / Person-days | Total points / Total person-days |
| Context Switching | Task interruption count | Statistical data |
| Blocked Time Ratio | Blocked time / Total time | Log statistics |

**Analysis**:

```yaml
efficiency_analysis:
  team_throughput: {points_per_day}
  context_switches:
    average: {count}
    total: {count}
  blocked_time_percentage: {percentage}
  dependency_issues:
    - issue: {description}
      duration: {days}
      impact: {story_points_lost}
  assessment: good | acceptable | needs_improvement
```

#### 3.3 Problem Identification [Conditional]

**Problem Classification**:

| Category | Identification Method | Priority |
|------|----------|--------|
| Process Issues | Recurring blockers, changes | P1 |
| Technical Issues | Defect patterns, performance bottlenecks | P1 |
| Collaboration Issues | Communication gaps, dependency issues | P2 |
| Environment Issues | Tool instability, environment issues | P2 |

**Problem Identification Output**:

```yaml
problem_identification:
  - problem_id: PRB-001
    category: process | technical | collaboration | environment
    severity: P1 | P2 | P3
    description: {description}
    evidence:
      - metric: {name}
        value: {value}
        baseline: {baseline}
        deviation: {deviation}
      # ... same structure extensible
    root_cause_analysis:
      - question: "Why {problem}?"
        answer: "{cause}"
    impact:
      items_affected: {count}
      effort_lost: {story_points}
      quality_impact: {description}
```

#### 3.4 Improvement Suggestions [Deep]

**Suggestion Format**:

```yaml
improvement_suggestions:
  - suggestion_id: IMP-001
    problem_id: PRB-001
    category: process | technical | collaboration | environment
    title: {title}
    description: {description}
    expected_outcome:
      metric_improvement:
        - metric: {name}
          current: {value}
          target: {value}
    action_items:
      - action: {description}
        owner: {role}
        deadline: {date}
    effort_required:
      story_points: {points}
      time_estimate: {days}
    priority: P1 | P2 | P3
    recommendation_score: {score}
```

## Output


**Output File Path**: `output/pm-monitoring/iteration-decision/`

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Iteration direction suggestions | Core conclusions + minimum viable output, only Step 1.1 priority ranking and Step 2.1-2.2 core adjustment plans |
| standard | Complete iteration decision (current default) | Complete output, including all Step 1-3 outputs |
| deep | Complete decision + extended analysis | Complete output + competitive iteration comparison + technical debt impact analysis + long-term roadmap assessment + decision records + risk assessment |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["prioritized_items", "backlog_size", "trigger_id", "impact_assessment", "options", "iteration_id", "summary", "metrics_analysis"],
  "properties": {
    "generated_at": {"type": "string", "description": "Generation timestamp"},
    "backlog_size": {"type": "object", "description": "Backlog size, including total item count and total story points"},
    "prioritized_items": {"type": "array", "description": "Prioritized requirement list, including scores, impact and correlations"},
    "technical_debt_priority": {"type": "array", "description": "Technical debt priority list, including interest and priority"},
    "reorganization_summary": {"type": "object", "description": "Reorganization suggestion summary, including elevate/combine/postpone/split counts"},
    "trigger_id": {"type": "string", "description": "Trigger event ID"},
    "trigger_type": {"type": "string", "description": "Trigger type: monitoring_alert/feedback/strategy_change"},
    "impact_assessment": {"type": "object", "description": "Impact assessment, including scope/schedule/quality impact"},
    "recommended_option": {"type": "string", "description": "Recommended option ID"},
    "options": {"type": "array", "description": "Available option list, including type, score and tradeoffs"},
    "needs_human_decision": {"type": "boolean", "description": "Whether human decision is needed"},
    "iteration_id": {"type": "string", "description": "Iteration ID"},
    "period": {"type": "object", "description": "Iteration period, including start and end times"},
    "summary": {"type": "object", "description": "Iteration summary, including completion rate, quality status and score"},
    "metrics_analysis": {"type": "object", "description": "Metrics analysis, including delivery/quality/collaboration/efficiency four dimensions"},
    "problem_identification": {"type": "object", "description": "Problem identification, including total count and P1/P2 counts"},
    "improvement_suggestions": {"type": "object", "description": "Improvement suggestions, including total count and high priority count"}
  }
}
```

```
├── iteration-decision.json
├── iteration-decision.md
├── backlog/
│   ├── {iteration_id}/
│   │   ├── prioritized_items.yaml
│   │   ├── linked_issues.yaml
│   │   ├── technical_debt_impact.yaml
│   │   └── reorganization_suggestions.md
│   └── latest/
│       └── backlog_recommendation.md
├── prioritization/
│   ├── {trigger_id}/
│   │   ├── impact_assessment.yaml
│   │   ├── adjustment_options.yaml
│   │   ├── risk_assessment.yaml
│   │   ├── communication_draft.md
│   │   └── needs_human_decision.yaml
│   └── latest/
│       └── adjustment_recommendation.md
└── retrospective/
    ├── {iteration_id}/
    │   ├── summary.md
    │   ├── metrics_analysis.yaml
    │   ├── problem_identification.yaml
    │   └── improvement_suggestions.yaml
    └── latest/
        └── retrospective_report.md
```

## Decision Rules

| Scenario | Decision Rule |
|------|----------|
| Alert-correlated items | Auto-elevate priority +2 (max P0) |
| Technical debt interest rate ≥ 0.7 (fix cost/delay cost) | Mark as "recommend priority repayment", priority +1 |
| Dependency chain conflict | Sort by longest chain first, blocking item priority ≥ blocked item |
| Team capacity utilization ≥ 90% | Freeze low priority items (score ≤ 3), prioritize high value items |
| Team capacity utilization 70%-90% | Normal scheduling, low priority items optional |
| New high priority item (score ≥ 8) | Evaluate replacing lowest scored item in current Sprint |
| New medium priority item (score 5-7) | Add to Backlog, evaluate next Sprint |
| Requirement score ≤ 3 with no alert correlation | Downgrade to "watch", remove if no progress for 2 consecutive Sprints |
| P0 monitoring anomaly | Auto-recommend insertion, mark for human confirmation |
| Impact > 50% scope | Flag as needing PO decision |
| Multiple available options | Recommend highest scored option, list comparison |
| No available replacement items | Suggest delay or split |
| Team objection | Flag as needing additional communication |
| Completion rate < 70% | Flag as key issue, analyze root cause |
| Bug leakage rate > 10% | Trigger quality process review |
| Team satisfaction < 3/5 | Flag collaboration issue, needs targeted improvement |
| Same type of issue in two consecutive iterations | Flag as systemic defect |
| Cannot auto-identify root cause | Suggest manual specialized analysis |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Priority scoring coverage 100%
- [ ] Change impact assessment coverage 100%
- [ ] Adjustment plan count ≥ 2

### P1 Checks (must pass for standard/deep)

- [ ] Correlation identification is complete
- [ ] Technical debt impact assessment is accurate
- [ ] Reorganization suggestions are actionable
- [ ] Sprint capacity matches
- [ ] No critical dependencies missed
- [ ] Risk assessment completeness
- [ ] Decision tagging accuracy
- [ ] Plan actionability ≥ 80%
- [ ] Data collection completeness rate ≥ 95%
- [ ] Analysis covers all four dimensions
- [ ] Problem identification accuracy ≥ 80%
- [ ] Suggestion actionability rate ≥ 75%
- [ ] Improvement suggestions have clear owners

### P2 Checks (must pass for deep only)

- [ ] Communication draft covers all stakeholders
- [ ] Comparison analysis with previous iteration is complete
- [ ] Competitive iteration comparison completed (competitor feature iteration pace, strategy difference analysis, market trend benchmarking)
- [ ] Technical debt impact analysis complete (debt interest rate trends, repayment priority ranking, quantified impact on delivery velocity)
- [ ] Long-term roadmap assessment generated (3-6 month iteration roadmap, key milestones, resource demand forecast)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Requirement Pool | User provides current requirement list (title + brief description), AI re-ranks based on user input | Priority ranking based on user input, lacking system data support |
| Technical Debt | Skip technical debt impact analysis, debt weight set to zero in priority scoring | Ranking results without debt impact |
| Monitoring Alerts | Skip alert correlation analysis, urgent-first strategy unavailable | Ranking results without alert correlation |
| User Feedback | User value score inferred from requirement descriptions, annotate low confidence | Low confidence user value scoring |
| Current Iteration Plan | User describes reasons for adjustment and expectations, AI generates adjustment plan based on description | Adjustment plan based on user description, lacking plan data validation |
| Trigger Event | User provides adjustment trigger reason (anomaly/feedback/strategic change), AI assesses accordingly | Impact assessment based on user input |
| Resource Constraints | Skip capacity verification, annotate in plan "needs human capacity confirmation" | Adjustment plan without capacity verification |
| Change Requirements | User verbally states items to add/remove/modify, AI structures into change requirements | User verbal input converted to structured change list |
| Iteration Completion Status | User provides iteration completion status (completed/incomplete items, story points), AI generates retrospective based on provided data | Retrospective report based on user input, lacking system data |
| Quality Metrics | User provides defect count and rework status, AI performs quality analysis directly | Quality analysis based on user input |
| Team Feedback | Skip collaboration analysis dimension, annotate "missing team feedback data" | Retrospective missing collaboration dimension |
| Monitoring Data | Skip monitoring data analysis, annotate in retrospective "missing stability data" | Retrospective missing stability dimension |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Requirement Pool Missing**: Ask user to provide current requirement list, including requirement title, brief description and type (feature/Bug/optimization), AI will perform priority scoring and ranking based on provided information
2. **Technical Debt Missing**: Skip debt impact analysis step, remove debt-related weights from priority scoring formula, suggest supplementing debt list later to improve ranking
3. **Monitoring Alerts Missing**: Skip alert correlation analysis, cannot auto-elevate urgent item priority, suggest user manually flag urgent items
4. **User Feedback Missing**: User value dimension scoring will be inferred from requirement descriptions, annotate low confidence for this dimension in output, suggest human confirmation
5. **Current Iteration Plan Missing**: Ask user to describe reasons for adjustment (e.g., "payment feature has production issue, needs insertion"), AI will generate adjustment plan based on description, including insert/replace/postpone options
6. **Trigger Event Missing**: Ask user to explain adjustment trigger reason and urgency level, AI will perform impact assessment and plan generation accordingly
7. **Resource Constraints Missing**: Skip capacity matching verification during plan generation, annotate all plans "needs human confirmation of team capacity support", suggest supplementing resource data later
8. **Iteration Completion Status Missing**: Ask user to provide iteration completion status, including: planned story points/actual completed story points, incomplete items and reasons, requirement change status, AI will generate retrospective report based on provided data
9. **Quality Metrics Missing**: Ask user to provide key quality data (Bug count, severity distribution, rework count), AI will perform quality dimension analysis accordingly
10. **Team Feedback Missing**: Skip collaboration analysis dimension, annotate missing data in retrospective, suggest supplementing through Retro meeting later
11. **Monitoring Data Missing**: Skip stability analysis, annotate missing stability data in retrospective, suggest exporting from monitoring system to supplement

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| prioritized_items | array | Yes | Priority-ranked requirement list, each must contain id/title/priority_score |
| prioritized_items[].priority_score | number | Yes | Priority score, range 0-100 |
| linked_issues | object | No | Correlation relationships, must contain dependency/synergy |
| technical_debt_impact | object | No | Technical debt impact assessment |
| reorganization_suggestions | array | No | Reorganization suggestion list |
| impact_assessment | object | Yes | Change impact assessment, must contain affected_items/scope/severity |
| adjustment_options | array | Yes | Adjustment plan list, at least 2 plans |
| adjustment_options[].recommendation_score | number | Yes | Recommendation score, range 0-100 |
| risk_assessment | object | No | Risk assessment, must contain risk_level/mitigation |
| communication_draft | object | No | Communication draft, must contain stakeholders/message |
| iteration_id | string | Yes | Iteration ID, cannot be empty |
| summary | object | Yes | Iteration summary, must contain delivery_completion/quality_status/overall_score |
| metrics_analysis | object | Yes | Metrics analysis, must contain delivery/quality/collaboration/efficiency four dimensions |
| problem_identification | object | No | Problem identification, must contain total_problems/p1_count |
| improvement_suggestions | array | No | Improvement suggestion list, each must have owner and verification criteria |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| Project Management System | Requirement status change | Priority ranking and correlation analysis | Recalculate priority scores |
| Code Quality Platform | Technical debt update | Debt impact assessment and weights | Update debt weights and impact scores |
| monitoring-pipeline | Alert data update | Urgent-first strategy | Update alert correlation and priority elevation |
| agile-sprint-planning | Iteration plan change | Change impact assessment baseline | Re-evaluate change impact |
| planning-resource | Resource constraint change | Plan capacity verification | Re-verify plan feasibility |
| agile-daily-sync | Iteration completion data update | Delivery dimension analysis | Update completion rate and story point statistics |
| Test Platform/CI/CD | Quality metric change | Quality dimension analysis | Update defect statistics and coverage |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| iteration-orchestrator | Iteration decision pipeline completed | Output file update | Decision completion status and key conclusions |
