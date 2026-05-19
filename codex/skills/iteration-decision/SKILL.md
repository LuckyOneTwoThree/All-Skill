---
name: iteration-decision
description: "Use when optimizing product Backlog priorities or adjusting iteration decisions. End-to-end flow from Backlog grooming and priority assessment to iteration retrospective. Keywords: Backlog optimization, requirement pool management, Backlog grooming, requirement restructuring, priority adjustment, iteration priority, RICE scoring, iteration planning, iteration retrospective, continuous improvement, action item tracking, iteration review."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Iteration Optimization"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Requirement pool is messy, how to organize"
    - "How to rank backlog priorities"
    - "Too many requirements, which to do first"
    - "Need to adjust iteration plan"
    - "Need to insert a requirement, how to prioritize"
---

# Iteration Decision Full Pipeline AI

## Core Principles

1. **Priority is the quantified expression of resource allocation**: The essence of Backlog ordering is deciding where resources go; every priority change means resource reallocation
2. **Linkage is leverage**: Identifying dependencies and synergies between requirements; linked requirements done together are 3x more efficient than done separately
3. **Technical debt is a hidden cost that must be made visible**: If technical debt doesn't enter the Backlog it will never be repaid; it must have weight in priority scoring
4. **Priority adjustment is not re-sorting but resource reallocation**: Every adjustment means breaking existing commitments; chain effects must be evaluated
5. **Change impact assessment precedes adjustment decisions**: Quantify impact first then decide on adjustment; avoid snap decisions that create greater chaos
6. **Risk assessment is the guardrail for adjustments**: Every adjustment must include risk assessment, ensuring adjustments don't introduce bigger problems
7. **Retrospective purpose is improvement not blame**: Retrospectives must establish psychological safety, otherwise teams will only report good news
8. **Data-driven attribution, not subjective impressions**: Use metric data to validate "feelings", avoiding impression bias masking real issues
9. **Improvement suggestions must be trackable and verifiable**: Every improvement suggestion must have an owner and verification criteria, otherwise retrospectives are just going through the motions

### Trigger Conditions

| Trigger Condition | Description | Priority |
|-------------------|-------------|----------|
| Monitoring anomaly | Monitoring system detects anomaly | P0 |
| Major feedback | Large volume of user complaints or key customer feedback | P0 |
| Strategic change | Major business strategy or market environment change | P1 |
| Resource change | Team member additions/reductions or available time changes | P2 |

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Requirement Pool | JSON array | Yes | Project management system -> Requirement pool | User stories, feature requirements, Bugs |
| Technical Debt | JSON | Yes | Code quality platform -> Technical debt | Debt list, impact assessment |
| Monitoring Alerts | JSON | No | output/pm-monitoring/monitoring-pipeline/alert-data | Unresolved technical issues |
| User Feedback | JSON | No | Feedback system -> User feedback | Complaints, feature requests, suggestions |
| Current Iteration Plan | JSON | Yes | output/pm-project/agile-sprint-planning/sprint_plan | Sprint Backlog, committed items |
| Trigger Event | JSON | Yes | Monitoring system/Feedback system -> Trigger event | Anomaly details, feedback content, strategic change |
| Resource Constraints | JSON | Yes | output/pm-project/planning-resource/resource_plan | Team capacity, available time, dependencies |
| Change Request | JSON | Yes | User provided | Items to add/modify/remove |
| Iteration Completion | JSON | Yes | output/pm-project/agile-daily-sync/daily_sync | Completed/incomplete items, story points |
| Quality Metrics | JSON | Yes | Testing platform/CI/CD -> Quality data | Defect count, code coverage, rework rate |
| Team Feedback | JSON | No | Retro tool -> Team feedback | Retro meeting notes, voting results |
| Monitoring Data | JSON | No | output/pm-monitoring/monitoring-pipeline/monitoring-data | Stability, performance change data |

## Execution Steps

### Step 1: Backlog Grooming (from iteration-backlog)

**Goal**: Groom and optimize the issue Backlog, complete linkage analysis and restructuring

#### 1.1 Issue Priority Assessment

**Assessment Model**:

```
Priority Score = Business Impact x User Value x Urgency x Effort Adjusted
```

**Scoring Dimensions**:

| Dimension | Weight | Scoring Criteria |
|-----------|--------|------------------|
| Business Impact | 30% | Revenue impact, brand impact, strategic value |
| User Value | 25% | User request frequency, pain point intensity |
| Urgency | 25% | Alert impact, competitive threat, compliance requirements |
| Effort Adjusted | 20% | Resource needs, dependencies, risk |

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

#### 1.2 Technical Debt Impact Analysis

**Impact Types**:

| Type | Impact Metric | Quantification Method |
|------|---------------|----------------------|
| Development Efficiency | Extra effort ratio | Debt vs new features within Sprint |
| Defect Rate | Bug density | Bugs per thousand lines |
| Performance Loss | Response time increment | Before/after optimization comparison |
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

#### 1.3 Linkage Analysis

**Linkage Types**:

| Type | Description | Handling |
|------|-------------|----------|
| Dependency | A must be before B | Enforce order |
| Synergy | A and B together are more effective | Suggest combination |
| Mutual Exclusion | A and B cannot be done simultaneously | Mark conflict |
| Technical Debt Linkage | New feature affected by debt | Debt first |

**Linkage Output**:

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
        impact: "Causes 20% development efficiency reduction"
```

#### 1.4 Backlog Restructuring

**Restructuring Strategies**:

| Strategy | Applicable Scenario | Operation |
|----------|---------------------|-----------|
| Urgent First | Alerts/Major Bugs | Elevate priority, mark P0 |
| Batch Combination | Linked debt/features | Package as Epic |
| Defer | Low-priority long-tail requirements | Move to Icebox |
| Split | Large granularity items | Split into smaller stories |
| Dependency Ordering | Items with prerequisites | Sort by dependency chain |

**Restructuring Suggestion Format**:

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

### Step 2: Priority Assessment (from iteration-prioritization)

**Goal**: Assess issue priorities based on data, generate adjustment plans and risk assessments

#### 2.1 Change Impact Assessment

**Impact Dimensions**:

| Dimension | Assessment Content | Metric |
|-----------|-------------------|--------|
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

#### 2.2 Adjustment Plan Generation

**Plan Types**:

| Plan Type | Applicable Scenario | Cost |
|-----------|---------------------|------|
| Insert | P0 urgent issue must be handled | Delay other items |
| Replace | Lower priority item of equal value exists | Abandon some features |
| Postpone | Lower priority items can be deferred | Delayed delivery |
| Split | Partial features can be delivered first | Batch delivery |

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

#### 2.3 Risk Assessment

**Risk Matrix**:

| Risk Category | Assessment Dimension | Scoring Method |
|---------------|---------------------|----------------|
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

#### 2.4 Communication Draft

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

### Step 3: Iteration Retrospective (from iteration-retrospective)

**Goal**: Review iteration execution effectiveness, summarize learnings and improvement points

#### 3.1 Data Collection

**Data Sources**:

| Data Type | Data Source | Collection Method |
|-----------|-------------|-------------------|
| Delivery Data | Project management system | API/Export |
| Quality Data | Testing platform, CI/CD | API/Export |
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

#### 3.2 Multi-dimensional Analysis

##### 3.2.1 Delivery Analysis

**Metrics**:

| Metric | Definition | Target |
|--------|------------|--------|
| Delivery Completion Rate | Completed story points / Planned story points | >= 85% |
| Delivery Prediction Accuracy | Actual / Planned | 0.9-1.1 |
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

##### 3.2.2 Quality Analysis

**Metrics**:

| Metric | Definition | Target |
|--------|------------|--------|
| Bug Density | Bug count / Story points | < 0.5 |
| Bug Leakage Rate | Production Bugs / Test-discovered Bugs | < 5% |
| Code Coverage | Covered code lines / Total code lines | >= 80% |

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

##### 3.2.3 Collaboration Analysis

**Metrics**:

| Metric | Definition | Data Source |
|--------|------------|-------------|
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

##### 3.2.4 Efficiency Analysis

**Metrics**:

| Metric | Definition | Calculation |
|--------|------------|-------------|
| Team Throughput | Story points / Person-days | Total points / Total person-days |
| Context Switches | Task interruption count | Statistical data |
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

#### 3.3 Problem Identification

**Problem Classification**:

| Category | Identification Method | Priority |
|----------|----------------------|----------|
| Process Issues | Recurring blockers, changes | P1 |
| Technical Issues | Defect patterns, performance bottlenecks | P1 |
| Collaboration Issues | Communication gaps, dependency issues | P2 |
| Environment Issues | Unstable tools, environment problems | P2 |

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

#### 3.4 Improvement Suggestions

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


**Output file path**: `output/pm-monitoring/iteration-decision/`
**Output Schema**:

```json
{
  "type": "object",
  "required": ["prioritized_items", "backlog_size", "trigger_id", "impact_assessment", "options", "iteration_id", "summary", "metrics_analysis"],
  "properties": {
    "generated_at": {"type": "string", "description": "Generation time"},
    "backlog_size": {"type": "object", "description": "Backlog size, including total item count and total story points"},
    "prioritized_items": {"type": "array", "description": "Sorted requirement list, including scores, impact and linkages"},
    "technical_debt_priority": {"type": "array", "description": "Technical debt priority list, including interest and priority"},
    "reorganization_summary": {"type": "object", "description": "Restructuring suggestion summary, including elevated/combined/deferred/split counts"},
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
    "improvement_suggestions": {"type": "object", "description": "Improvement suggestions, including total count and high-priority count"}
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
|----------|---------------|
| Alert-linked items | Auto-elevate priority +2 (max P0) |
| Technical debt interest rate >=0.7 (fix cost/delay cost) | Mark as "recommend priority repayment", priority +1 |
| Dependency chain conflict | Sort by longest chain first, blocking item priority >= blocked item |
| Team capacity utilization >=90% | Freeze low-priority items (score <=3), prioritize high-value items |
| Team capacity utilization 70%-90% | Normal scheduling, low-priority items optional |
| New high-priority item added (score >=8) | Evaluate replacing lowest-scored item in current Sprint |
| New medium-priority item added (score 5-7) | Add to Backlog, evaluate next Sprint |
| Item score <=3 with no alert linkage | Downgrade to "watch", remove if no progress for 2 consecutive Sprints |
| P0 monitoring anomaly | Auto-recommend insertion, mark for human confirmation |
| Impact > 50% scope | Mark as needing PO decision |
| Multiple available options | Recommend highest-scored option, list comparison |
| No available replacement items | Suggest delay or split |
| Team objection | Mark as needing additional communication |
| Completion rate < 70% | Mark key issues, analyze root causes |
| Bug leakage rate > 10% | Trigger quality process review |
| Team satisfaction < 3/5 | Mark collaboration issues, need targeted improvement |
| Same type of issue for 2 consecutive iterations | Mark as systemic defect |
| Cannot auto-identify root cause | Suggest manual specialized analysis |

## Quality Checks

- [ ] Priority scoring coverage 100%
- [ ] Linkage identification complete
- [ ] Technical debt impact assessment accurate
- [ ] Restructuring suggestions actionable
- [ ] Sprint capacity matched
- [ ] No critical dependency omissions
- [ ] Change impact assessment coverage 100%
- [ ] Adjustment options count >= 2
- [ ] Risk assessment completeness
- [ ] Communication draft covers all stakeholders
- [ ] Decision marking accuracy
- [ ] Plan executability >= 80%
- [ ] Data collection completeness >= 95%
- [ ] Analysis covers all four dimensions
- [ ] Problem identification accuracy >= 80%
- [ ] Suggestion executability >= 75%
- [ ] Improvement suggestions have clear owners
- [ ] Comparison with previous iteration complete

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|------------------|---------------|
| Requirement pool | User provides current requirement list (title + brief description), AI re-sorts based on user input | Priority ranking based on user input, lacking system data support |
| Technical debt | Skip technical debt impact analysis, debt weight set to zero in priority scoring | Sorted results without debt impact |
| Monitoring alerts | Skip alert linkage analysis, urgent-first strategy unavailable | Sorted results without alert linkage |
| User feedback | User value score inferred from requirement descriptions, mark low confidence | Low confidence user value scores |
| Current iteration plan | User describes adjustment reason and expectations, AI generates adjustment plan based on description | Adjustment plan based on user description, lacking plan data validation |
| Trigger event | User provides adjustment trigger reason (anomaly/feedback/strategic change), AI assesses accordingly | Impact assessment based on user input |
| Resource constraints | Skip capacity verification, mark "need human confirmation of capacity" in plan | Adjustment plan without capacity verification |
| Change request | User verbally describes items to add/remove/modify, AI structures into change requirements | Structured change list from verbal user input |
| Iteration completion | User provides iteration completion status (completed/incomplete items, story points), AI generates retrospective based on provided data | Retrospective report based on user input, lacking system data |
| Quality metrics | User provides defect count and rework situation, AI performs quality analysis directly | Quality analysis based on user input |
| Team feedback | Skip collaboration analysis dimension, mark "lacking team feedback data" | Retrospective lacking collaboration dimension |
| Monitoring data | Skip monitoring data analysis, mark "lacking stability data" in retrospective | Retrospective lacking stability dimension |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Requirement pool missing**: Ask user to provide current requirement list, including requirement title, brief description and type (feature/Bug/optimization), AI will score and sort priorities based on provided information
2. **Technical debt missing**: Skip debt impact analysis step, remove debt-related weights from priority scoring formula, recommend supplementing debt list later to improve sorting
3. **Monitoring alerts missing**: Skip alert linkage analysis, cannot auto-elevate urgent item priorities, recommend user manually mark urgent items
4. **User feedback missing**: User value dimension scoring will be inferred from requirement descriptions, mark low confidence for this dimension in output, recommend human confirmation
5. **Current iteration plan missing**: Ask user to describe adjustment reason (e.g., "payment feature has production issue, needs insertion"), AI will generate adjustment plan based on description, including insert/replace/postpone options
6. **Trigger event missing**: Ask user to explain adjustment trigger reason and urgency, AI will perform impact assessment and plan generation accordingly
7. **Resource constraints missing**: Skip capacity matching verification during plan generation, mark all plans "need human confirmation of team capacity support", recommend supplementing resource data later
8. **Iteration completion missing**: Ask user to provide iteration completion status, including: planned story points/actual completed story points, incomplete items and reasons, requirement change status, AI will generate retrospective report based on provided data
9. **Quality metrics missing**: Ask user to provide key quality data (Bug count, severity distribution, rework count), AI will perform quality dimension analysis accordingly
10. **Team feedback missing**: Skip collaboration analysis dimension, mark data missing for this dimension in retrospective, recommend supplementing through Retro meeting later
11. **Monitoring data missing**: Skip stability analysis, mark lacking stability data in retrospective, recommend exporting from monitoring system to supplement

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| prioritized_items | array | Yes | Priority-sorted requirement list, each must contain id/title/priority_score |
| prioritized_items[].priority_score | number | Yes | Priority score, range 0-100 |
| linked_issues | object | No | Linkage relationships, must contain dependency/synergy |
| technical_debt_impact | object | No | Technical debt impact assessment |
| reorganization_suggestions | array | No | Restructuring suggestion list |
| impact_assessment | object | Yes | Change impact assessment, must contain affected_items/scope/severity |
| adjustment_options | array | Yes | Adjustment option list, at least 2 options |
| adjustment_options[].recommendation_score | number | Yes | Recommendation score, range 0-100 |
| risk_assessment | object | No | Risk assessment, must contain risk_level/mitigation |
| communication_draft | object | No | Communication draft, must contain stakeholders/message |
| iteration_id | string | Yes | Iteration ID, cannot be empty |
| summary | object | Yes | Iteration summary, must contain delivery_completion/quality_status/overall_score |
| metrics_analysis | object | Yes | Metrics analysis, must contain delivery/quality/collaboration/efficiency four dimensions |
| problem_identification | object | No | Problem identification, must contain total_problems/p1_count |
| improvement_suggestions | array | No | Improvement suggestion list, each must contain owner and verification criteria |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|-----------------|-------------|--------------|-----------------|
| Project management system | Requirement status change | Priority sorting and linkage analysis | Recalculate priority scores |
| Code quality platform | Technical debt update | Debt impact assessment and weights | Update debt weights and impact scores |
| monitoring-pipeline | Alert data update | Urgent-first strategy | Update alert linkage and priority elevation |
| agile-sprint-planning | Iteration plan change | Change impact assessment baseline | Re-evaluate change impact |
| planning-resource | Resource constraint change | Plan capacity verification | Re-verify plan feasibility |
| agile-daily-sync | Iteration completion data update | Delivery dimension analysis | Update completion rate and story point statistics |
| Testing platform/CI/CD | Quality metric change | Quality dimension analysis | Update defect statistics and coverage |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|---------------------|------------------------|---------------------|----------------------|
| iteration-orchestrator | Iteration decision full workflow completed | Output file update | Decision completion status and key conclusions |

## Version History

- v3.0: Merged iteration-backlog + iteration-prioritization + iteration-retrospective
