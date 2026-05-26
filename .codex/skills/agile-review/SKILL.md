---
name: agile-review
description: Use when automating Sprint reviews and retrospective reports. Integrated Sprint review and retrospective reporting, Step 1 completes Sprint review (deliverable inventory, Demo preparation checklist, feedback collection & classification, data collection, problem identification, improvement suggestion generation), Step 2 generates complete retrospective report (Sprint goal achievement analysis, delivery quality assessment, team velocity trends, improvement action items, next Sprint recommendations), Step 3 completes release retrospective (effectiveness review, engineering quality review, process review, improvement action item generation). Keywords: Sprint Review, Sprint Retro, iteration review, iteration retrospective, agile retrospective, review meeting, retrospective report, Sprint retrospective, improvement action items, how did it go, release retrospective, release review, effectiveness assessment, continuous improvement.
metadata:
  module: "Project Management & Execution"
  sub-module: "Agile Execution"
  type: "pipeline"
  version: "3.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Sprint ended, need review"
    - "How to do iteration retrospective"
    - "How did this iteration go"
    - "How to write Sprint retrospective report"
    - "Help me produce an iteration retrospective report"
    - "Summarize this iteration"
    - "Two weeks after release, do a retrospective"
    - "Help me summarize the results of this release"
    - "Hold a retrospective meeting, organize improvement points"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Only output iteration score and TOP3 improvement items"
  deep_description: "Complete retrospective + team dynamics analysis + trend comparison + improvement roadmap"
---

# Sprint Review & Retrospective Report Automation

## Core Principles

1. **Transparency is Collaboration**: Sprint deliverables, feedback, and improvement suggestions are visible to all, ensuring team alignment
2. **Risk Early Warning**: Issues and risks identified in Retro are exposed promptly, preventing recurrence in subsequent Sprints
3. **Automated Tracking**: Improvement suggestion execution status, action item completion automatically tracked
4. **Retrospectives are for Learning, Not Blame**: The core value of Sprint retrospective reports is extracting reusable learnings from each iteration, forming a flywheel of continuous team improvement. Retrospectives are not scorecards, but improvement roadmaps

## Interaction Mode

**🤖 AI Auto-Execute**

- All preparation and follow-up processing is automatically completed by AI
- Sprint Review meetings still require human facilitation and presentation
- Sprint Retro meetings require human participation in discussion and decision-making
- Improvement suggestions require human confirmation before execution
- Retrospective reports require human review and confirmation (Sprint Goal achievement determination, improvement action item owner assignment, next Sprint capacity forecast)

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| sprint_backlog | object | Yes | output/pm-project/agile-sprint-planning/sprint_plan.json | Sprint planned Stories |
| completed_stories | object[] | Yes | User provided | Completed Stories |
| team_data | object | No | User provided | Team performance data |
| stakeholder_feedback | object[] | No | User provided | Stakeholder feedback (optional) |
| daily_sync_records | markdown | No | agile-daily-sync | Daily sync records (blocker tracking, risk records, progress updates) |
| historical_sprint_data | text | No | User input | Velocity and delivery data from past 3-5 Sprints |
| release_data | JSON | No | Release Management System | Release version and change content (required for release retrospective) |
| monitoring_data | JSON | No | Monitoring System | Business metrics and performance metrics (required for release retrospective) |
| user_feedback_data | JSON | No | Customer Service/Feedback Platform | User satisfaction and feedback (optional for release retrospective) |
| bug_statistics | JSON | No | Bug Tracking System | Release-related Bug statistics (optional for release retrospective) |
| release_process_data | JSON | No | Release Logs | Release process data (optional for release retrospective) |

## Execution Steps

### Step 1: Sprint Review [Core] (Assess goal achievement and capture improvements)

#### Step 1.1: Deliverable Inventory Auto-Compilation [Core]

**Actions**:
- Aggregate all Stories completed in the Sprint
- Organize delivery content for each Story
- Calculate completion rate
- Generate deliverable summary

**Output**:
```json
{
  "deliverables": {
    "sprint_summary": {
      "sprint_id": "string",
      "planned_stories": number,
      "completed_stories": number,
      "cancelled_stories": number,
      "completion_rate": 0.0-1.0,
      "planned_points": number,
      "completed_points": number,
      "points_completion_rate": 0.0-1.0
    },
    "completed_items": [{
      "story_id": "string",
      "title": "string",
      "story_points": number,
      "key_deliverables": ["string"],
      "completed_by": "string",
      "quality_notes": "string"
    }],
    "incomplete_items": [{
      "story_id": "string",
      "title": "string",
      "remaining_work": "string",
      "carryover_decision": "next_sprint | deprioritize | replan"
    }]
  }
}
```

#### Step 1.2: Demo Preparation Checklist Generation [Conditional]

**Actions**:
- Generate Demo agenda based on completed Stories
- Assign duration for each Demo
- Prepare Demo environment checklist
- Suggest presentation order

**Output**:
```json
{
  "demo_checklist": {
    "demo_duration_minutes": number,
    "items": [{
      "order": 1,
      "demo_topic": "string",
      "story_id": "string",
      "presenter": "string",
      "duration_minutes": number,
      "environment_check": {
        "staging_ready": boolean,
        "test_data_ready": boolean,
        "access_verified": boolean
      },
      "key_points": ["string"],
      "questions_to_anticipate": ["string"]
    }]
  }
}
```

#### Step 1.3: Feedback Auto-Collection & Classification [Conditional]

**Actions**:
- Collect stakeholder feedback
- Classify feedback types (feature/UX/performance/other)
- Identify duplicate feedback
- Sort by importance

**Output**:
```json
{
  "feedback_collected": {
    "total_feedback_count": number,
    "feedback_by_type": {
      "feature_request": number,
      "usability_issue": number,
      "performance_concern": number,
      "bug_report": number,
      "positive_feedback": number,
      "other": number
    },
    "feedback_items": [{
      "feedback_id": "FB-001",
      "description": "string",
      "type": "string",
      "source": "string",
      "timestamp": "ISO datetime",
      "priority": "high | medium | low",
      "related_story": "string | null",
      "actionable": boolean
    }]
  }
}
```

#### Step 1.4: Data Auto-Collection [Core]

**Actions**:
- Collect Sprint completion rate, quality metrics, collaboration data
- Analyze team cadence and efficiency
- Extract key data metrics
- Generate data summary

**Output**:
```json
{
  "metrics": {
    "completion_metrics": {
      "story_completion_rate": 0.0-1.0,
      "point_completion_rate": 0.0-1.0,
      "avg_story_completion_time_days": number,
      "carryover_rate": 0.0-1.0
    },
    "quality_metrics": {
      "bug_count": number,
      "bug_rejection_rate": 0.0-1.0,
      "code_review_turnaround_hours": number,
      "build_failure_rate": 0.0-1.0
    },
    "collaboration_metrics": {
      "blocker_resolution_time_hours": number,
      "meeting_hours_total": number,
      "ad_hoc_interruption_count": number,
      "cross_team_dependency_delays": number
    },
    "team_health": {
      "avg_overtime_hours": number,
      "member_stress_indicators": ["string"],
      "velocity_stability": "stable | fluctuating | declining"
    }
  }
}
```

#### Step 1.5: Problem Auto-Identification [Conditional]

**Actions**:
- Analyze data to identify patterns and problems
- Detect anomalies within the Sprint
- Identify recurring problems
- Classify problem types (process/technical/collaboration/resource)

**Output**:
```json
{
  "problems_identified": [{
    "problem_id": "PRB-001",
    "description": "string",
    "category": "process | technical | collaboration | resource",
    "evidence": "string",
    "frequency": "first_time | recurring | persistent",
    "severity": "high | medium | low",
    "impact": "string"
  }]
}
```

#### Step 1.6: Improvement Suggestions Auto-Generation [Conditional]

**Actions**:
- Generate targeted improvement suggestions based on problems
- Consider team context and historical improvements
- Suggest actionable concrete actions
- Annotate suggestion priority

**Output**:
```json
{
  "improvement_suggestions": [{
    "suggestion_id": "IMP-001",
    "problem_addressed": "PRB-001",
    "description": "string",
    "proposed_action": "string",
    "expected_impact": "string",
    "implementation_effort": "low | medium | high",
    "priority": "high | medium | low",
    "owner_suggestion": "string",
    "success_metric": "string"
  }]
}
```

---

### Step 2: Retrospective Report Generation [Core] (Sprint goal achievement analysis, delivery quality assessment, team velocity trends, improvement action items)

Step 2 receives Step 1's output as input, combined with Sprint plan and historical data, to generate a complete retrospective report.

#### Step 2.1: Sprint Goal Achievement Analysis [Core]

Compare plan vs actual delivery:

1. **Sprint Goal Achievement**: Fully achieved / Partially achieved / Not achieved
2. **Story Completion Rate**: Planned Stories vs Completed Stories vs Spilled Stories
3. **Story Point Achievement Rate**: Committed SP vs Completed SP vs Spilled SP
4. **Spillover Analysis**: Root cause classification of spilled Stories (estimation inaccuracy/requirement changes/technical debt/external dependencies)

#### Step 2.2: Delivery Quality Assessment [Core]

Assess the quality of this Sprint's deliverables:

1. **Defect Density**: Defects per Story Point, compared with historical average
2. **Defect Distribution**: By severity (P0/P1/P2/P3)
3. **Rework Rate**: Proportion of Stories reworked due to quality issues
4. **Technical Debt**: Technical debt added/paid off this Sprint

#### Step 2.3: Team Velocity Analysis [Conditional]

Analyze team delivery velocity trends:

1. **This Sprint Velocity**: Completed SP, effective working days, daily average SP
2. **Velocity Trend**: Velocity change trend over last 5 Sprints (increasing/stable/decreasing)
3. **Velocity Volatility**: Standard deviation and coefficient of variation, assess predictability
4. **Capacity Utilization**: Actual output vs available capacity ratio

#### Step 2.4: Improvement Action Item Extraction [Core]

Extract actionable improvement suggestions from execution data:

1. **Keep** (What went well): Practices worth maintaining this Sprint
2. **Improve** (What needs improvement): Problems exposed this Sprint and improvement directions
3. **Try** (New experiments): New practices suggested for next Sprint
4. **Action Item List**: Each improvement has a clear owner, deadline and acceptance criteria

#### Step 2.5: Next Sprint Recommendations [Deep]

Provide recommendations for the next Sprint based on retrospective conclusions:

1. **Velocity Forecast**: Predict next Sprint's committable SP range based on trends
2. **Risk Anticipation**: Anticipate next Sprint risks based on this Sprint's spillover root causes
3. **Capacity Recommendations**: Capacity adjustments considering holidays, personnel changes, etc.
4. **Improvement Experiments**: Suggest 1-2 improvement experiments to validate in the next Sprint

#### Step 2.6: Report Assembly [Core]

Assemble the above content into a complete report.

**Markdown Report Structure**:
```markdown
# Sprint Retrospective Report: Sprint {NN}

## 1. Executive Summary
- Sprint Goal achievement / Story completion rate / Velocity / Top 3 improvement items

## 2. Goal Achievement Analysis
- Sprint Goal assessment
- Story completion rate (planned/completed/spilled)
- Story Point achievement rate
- Spillover root cause analysis

## 3. Delivery Quality Assessment
- Defect density (vs historical average)
- Defect distribution (P0-P3)
- Rework rate
- Technical debt change

## 4. Team Velocity Analysis
- This Sprint velocity
- Velocity trend (last 5 Sprints chart)
- Velocity volatility and predictability
- Capacity utilization

## 5. Improvement Action Items
- ✅ Keep (What went well)
- 🔧 Improve (What needs improvement)
- 🧪 Try (New experiments)
- Action item list (owner/deadline/acceptance criteria)

## 6. Next Sprint Recommendations
- Velocity forecast range
- Risk anticipation
- Capacity recommendations
- Improvement experiment suggestions
```

**JSON Structure**:
```json
{
  "sprint_id": "S{NN}",
  "sprint_dates": { "start": "", "end": "" },
  "report_date": "",
  "goal_achievement": {
    "status": "fully|partially|not_achieved",
    "sprint_goal": "",
    "evidence": ""
  },
  "delivery_metrics": {
    "stories_planned": 0,
    "stories_completed": 0,
    "stories_spilled": 0,
    "sp_planned": 0,
    "sp_completed": 0,
    "spill_reasons": []
  },
  "quality_metrics": {
    "defect_density": 0,
    "defect_distribution": { "P0": 0, "P1": 0, "P2": 0, "P3": 0 },
    "rework_rate": 0,
    "tech_debt_delta": ""
  },
  "velocity": {
    "current": 0,
    "trend": "increasing|stable|decreasing",
    "historical": [],
    "capacity_utilization": 0
  },
  "action_items": {
    "keep": [],
    "improve": [],
    "try": []
  },
  "next_sprint_recommendation": {
    "velocity_range": [0, 0],
    "risks": [],
    "capacity_adjustment": "",
    "experiments": []
  }
}
```

---

### Step 3: Release Retrospective [Conditional]

Step 3 is executed after release completion (recommended T+2 weeks), automatically collecting multi-source data to review release effectiveness, engineering quality, and release process, and generate improvement action items.

#### Step 3.1: Effectiveness Review [Conditional] (Post-release core metric comparison)

**Actions**:
- Collect post-release core business metrics and performance metrics data
- Compare release targets vs actual achievement
- Perform attribution analysis on unachieved metrics
- Assess data quality and completeness

**Output**:
```json
{
  "release_effectiveness": {
    "release_id": "string",
    "retrospective_period": {
      "start": "ISO date",
      "end": "ISO date"
    },
    "goal_vs_actual": [{
      "metric": "string",
      "target": number,
      "actual": number,
      "achievement_rate": 0.0-1.0,
      "status": "achieved | partially_achieved | not_achieved | exceeded",
      "gap": number,
      "significance": "high | medium | low"
    }],
    "attribution_analysis": [{
      "metric": "string",
      "actual_vs_target_gap": number,
      "attributions": [{
        "factor": "string",
        "impact": number,
        "confidence": 0.0-1.0,
        "evidence": "string"
      }],
      "primary_cause": "string"
    }],
    "data_quality": {
      "completeness": 0.0-1.0,
      "accuracy": "verified | unverified",
      "gaps": ["string"]
    }
  }
}
```

#### Step 3.2: Engineering Quality Review [Conditional] (Bug density, tech debt change)

**Actions**:
- Count post-release Bug count, severity distribution, source distribution
- Compare Bug trends between this and previous release
- Analyze technical debt change (added/paid off)
- Identify Bug root cause patterns

**Output**:
```json
{
  "release_quality": {
    "bug_statistics": {
      "total_bugs": number,
      "by_severity": { "P0": number, "P1": number, "P2": number, "P3": number },
      "by_source": {
        "testing_discovered": number,
        "production_reported": number,
        "leakage_rate": 0.0-1.0
      },
      "by_category": { "functional": number, "ui_ux": number, "performance": number, "security": number, "other": number }
    },
    "bug_trend_analysis": {
      "trend_comparison": {
        "total_bugs": { "current": number, "previous": number, "change_pct": number, "trend": "improving | stable | worsening" },
        "leakage_rate": { "current": number, "previous": number, "change_pct": number, "trend": "improving | stable | worsening" },
        "avg_fix_time_days": { "current": number, "previous": number, "change_pct": number, "trend": "improving | stable | worsening" }
      },
      "root_cause_patterns": [{
        "pattern": "string",
        "evidence": "string",
        "confidence": 0.0-1.0
      }]
    },
    "technical_debt_analysis": {
      "code_quality": {
        "maintainability_index": number,
        "baseline": number,
        "status": "improving | stable | slight_degradation | significant_degradation"
      },
      "debt_items": [{
        "item": "string",
        "severity": "high | medium | low",
        "estimated_debt_hours": number,
        "introduced_in": "string"
      }],
      "total_estimated_debt_hours": number
    }
  }
}
```

#### Step 3.3: Process Review [Deep] (Sprint efficiency, collaboration quality)

**Actions**:
- Analyze issue discovery timing distribution (percentage across dev/testing/production stages)
- Assess incident response speed (detection, response, resolution duration)
- Analyze team collaboration efficiency (satisfaction, bottleneck identification)
- Assess release process quality

**Output**:
```json
{
  "release_process": {
    "issue_discovery_timing": {
      "discovery_stages": [{
        "stage": "string",
        "issues_found": number,
        "pct": 0.0-1.0,
        "cost_multiplier": number
      }],
      "assessment": {
        "ideal_production_share": "string",
        "actual_production_share": "string",
        "status": "good | needs_improvement | critical"
      }
    },
    "response_speed_analysis": {
      "incident_response": {
        "avg_detection_time_minutes": number,
        "avg_response_time_minutes": number,
        "avg_resolution_time_minutes": number,
        "benchmark": "string"
      },
      "assessment": "good | acceptable | needs_improvement"
    },
    "collaboration_efficiency": {
      "team_feedback_summary": {
        "survey_response_rate": 0.0-1.0,
        "overall_satisfaction": number,
        "key_positives": ["string"],
        "key_improvements": ["string"]
      },
      "bottlenecks_identified": [{
        "bottleneck": "string",
        "frequency": "string",
        "impact": "string",
        "owner": "string"
      }]
    }
  }
}
```

#### Step 3.4: Improvement Action Item Generation [Conditional]

**Actions**:
- Auto-generate improvement action items based on effectiveness review, engineering quality review, and process review results
- Rank by composite score of impact/urgency/feasibility
- Each action item includes owner, deadline, verification method and success criteria
- Action item categories: product improvement, test improvement, infrastructure improvement, process improvement

**Output**:
```json
{
  "release_action_items": {
    "items": [{
      "item_id": "string",
      "source": "Effectiveness Review | Engineering Quality Review | Process Review",
      "title": "string",
      "description": "string",
      "priority": "high | medium | low",
      "type": "product_improvement | test_improvement | infrastructure | process_improvement",
      "owner": "string",
      "due_date": "ISO date",
      "verification_method": "string",
      "success_criteria": "string",
      "status": "open | in_progress | done"
    }],
    "priority_ranking": [{
      "item_id": "string",
      "priority_score": number,
      "factors": {
        "impact": number,
        "urgency": number,
        "feasibility": number
      },
      "rank": number
    }]
  }
}
```

#### Step 3.5: Release Retrospective Report Assembly [Conditional]

Assemble effectiveness review, engineering quality review, process review and improvement action items into a complete release retrospective report.

**Markdown Report Structure**:
```markdown
# Release Retrospective Report: {release_id}

## 1. Executive Summary
- Release version / Retrospective period / Goal achievement overview / Top 3 improvement action items

## 2. Effectiveness Review
- Target vs actual comparison
- Attribution analysis
- Data quality assessment

## 3. Engineering Quality Review
- Bug statistics and trends
- Technical debt change
- Root cause pattern identification

## 4. Process Review
- Issue discovery timing analysis
- Response speed assessment
- Collaboration efficiency analysis

## 5. Improvement Action Items
- Action item list (source/priority/owner/deadline/verification method)
- Priority ranking

## 6. Overall Assessment
- Rating (good / acceptable / needs_improvement)
- Comprehensive summary
```

**JSON Structure**:
```json
{
  "release_retrospective": {
    "release_id": "string",
    "retrospective_period": { "start": "ISO date", "end": "ISO date" },
    "generated_at": "ISO datetime",
    "effectiveness": {
      "summary": {
        "goals_achieved": number,
        "goals_partially_achieved": number,
        "goals_not_achieved": number
      },
      "goal_vs_actual": [],
      "attribution_analysis": []
    },
    "quality": {
      "bug_statistics": {},
      "bug_trend_analysis": {},
      "technical_debt_analysis": {}
    },
    "process": {
      "issue_discovery_timing": {},
      "response_speed_analysis": {},
      "collaboration_efficiency": {}
    },
    "action_items": [],
    "overall_assessment": {
      "rating": "good | acceptable | needs_improvement",
      "summary": "string"
    }
  }
}
```

---

## Output

**Storage Path**: `output/pm-project/agile-review/`

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Iteration score + TOP3 improvement items | Core conclusions + minimum viable output, only Step 1.1 deliverable inventory and Step 2.1/2.2/2.4 core conclusions |
| standard | Complete retrospective report (current default) | Complete output, including all Step 1-2 outputs and Step 3 (if release data available) |
| deep | Complete retrospective + extended analysis | Complete output + team dynamics analysis + trend comparison + improvement roadmap + decision records + risk assessment |

**Output Files**:

| File | Path | Description |
|------|------|------|
| Sprint Review Data | sprint_review.json | Sprint review data, including deliverables, Demo checklist and feedback collection |
| Sprint Retro Data | sprint_retro.json | Sprint retrospective data, including metrics, problem identification and improvement suggestions |
| Sprint Retrospective Report | sprint-retro-S{NN}.md | Human-readable complete retrospective report |
| Retrospective Structured Data | sprint-retro-S{NN}.json | Machine-consumable retrospective structured data |
| Metadata | metadata.json | Metadata |
| Release Retrospective Data | release_retro.json | Release retrospective data, including effectiveness review, engineering quality review, process review and improvement action items |
| Release Retrospective Report | release-retro-{release_id}.md | Human-readable release retrospective report |
| Release Retrospective Structured Data | release-retro-{release_id}.json | Machine-consumable release retrospective structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["sprint_review", "sprint_retro", "metadata"],
  "properties": {
    "sprint_review": {"type": "object", "description": "Sprint review data, including deliverables, Demo checklist and feedback collection"},
    "sprint_retro": {"type": "object", "description": "Sprint retrospective data, including metrics, problem identification and improvement suggestions"},
    "retrospective_report": {"type": "object", "description": "Retrospective report data, including goal achievement, delivery quality, velocity trends, improvement action items"},
    "release_retrospective": {"type": "object", "description": "Release retrospective data, including effectiveness review, engineering quality review, process review and improvement action items"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| sprint_review.deliverables.sprint_summary.sprint_id | string | Yes | Sprint unique identifier, format SPR-YYYY-SNN |
| sprint_review.deliverables.sprint_summary.completion_rate | number | Yes | Story completion rate, range 0.0-1.0 |
| sprint_review.deliverables.sprint_summary.points_completion_rate | number | Yes | Story point completion rate, range 0.0-1.0 |
| sprint_review.deliverables.completed_items | array | Yes | Completed Story list, each must contain story_id, title, story_points |
| sprint_review.deliverables.incomplete_items | array | Yes | Incomplete Story list, carryover_decision must be enum value |
| sprint_review.demo_checklist.items | array | Yes | Demo checklist, each must contain order, demo_topic, duration_minutes |
| sprint_review.demo_checklist.items[].environment_check | object | No | Environment check items, contains staging_ready, test_data_ready, access_verified |
| sprint_review.feedback_collected.total_feedback_count | number | Yes | Total feedback count, must be ≥ feedback_items array length |
| sprint_review.feedback_collected.feedback_items[].priority | string | Yes | Priority, enum high/medium/low |
| sprint_retro.metrics.completion_metrics.story_completion_rate | number | Yes | Story completion rate, must match sprint_summary |
| sprint_retro.problems_identified[].category | string | Yes | Problem category, enum process/technical/collaboration/resource |
| sprint_retro.problems_identified[].frequency | string | Yes | Occurrence frequency, enum first_time/recurring/persistent |
| sprint_retro.improvement_suggestions[].problem_addressed | string | Yes | Related problem ID, must correspond to problem_id in problems_identified |
| sprint_retro.improvement_suggestions[].implementation_effort | string | Yes | Implementation cost, enum low/medium/high |
| retrospective_report.sprint_id | string | Yes | Sprint identifier, format S{NN} |
| retrospective_report.sprint_dates.start | string | Yes | Sprint start date, ISO 8601 format |
| retrospective_report.sprint_dates.end | string | Yes | Sprint end date, ISO 8601 format |
| retrospective_report.report_date | string | Yes | Report generation date, ISO 8601 format |
| retrospective_report.goal_achievement.status | string | Yes | Achievement status, enum fully/partially/not_achieved |
| retrospective_report.goal_achievement.sprint_goal | string | Yes | Sprint goal description |
| retrospective_report.goal_achievement.evidence | string | Yes | Achievement determination basis |
| retrospective_report.delivery_metrics.stories_planned | number | Yes | Planned Story count, must be ≥ 0 |
| retrospective_report.delivery_metrics.stories_completed | number | Yes | Completed Story count, must be ≤ stories_planned |
| retrospective_report.delivery_metrics.stories_spilled | number | Yes | Spilled Story count, must be = stories_planned-stories_completed |
| retrospective_report.delivery_metrics.sp_planned | number | Yes | Planned SP count, must be ≥ 0 |
| retrospective_report.delivery_metrics.sp_completed | number | Yes | Completed SP count |
| retrospective_report.delivery_metrics.spill_reasons | array | No | Spillover root cause list, each must have root cause label |
| retrospective_report.quality_metrics.defect_density | number | Yes | Defect density, must be ≥ 0 |
| retrospective_report.quality_metrics.defect_distribution | object | Yes | Defect distribution, contains P0/P1/P2/P3 counts |
| retrospective_report.quality_metrics.rework_rate | number | Yes | Rework rate, range 0.0-1.0 |
| retrospective_report.quality_metrics.tech_debt_delta | string | Yes | Technical debt change description |
| retrospective_report.velocity.current | number | Yes | Current Sprint velocity, must be ≥ 0 |
| retrospective_report.velocity.trend | string | Yes | Velocity trend, enum increasing/stable/decreasing |
| retrospective_report.velocity.historical | array | No | Historical velocity data |
| retrospective_report.velocity.capacity_utilization | number | Yes | Capacity utilization, range 0.0-1.0 |
| retrospective_report.action_items.keep | array | Yes | Keep items list |
| retrospective_report.action_items.improve | array | Yes | Improve items list |
| retrospective_report.action_items.try | array | Yes | Try items list |
| retrospective_report.next_sprint_recommendation.velocity_range | array | Yes | Velocity forecast range, [lower_bound, upper_bound] |
| retrospective_report.next_sprint_recommendation.risks | array | No | Risk anticipation list |
| retrospective_report.next_sprint_recommendation.capacity_adjustment | string | Yes | Capacity adjustment recommendation |
| retrospective_report.next_sprint_recommendation.experiments | array | No | Improvement experiment suggestions |
| metadata.sprint_id | string | Yes | Sprint identifier, must match sprint_summary |
| metadata.generated_at | string | Yes | Generation timestamp, ISO 8601 format |
| metadata.review_completed | boolean | Yes | Whether Review is completed |
| metadata.retro_completed | boolean | Yes | Whether Retro is completed |
| metadata.report_completed | boolean | Yes | Whether retrospective report is completed |
| release_retrospective.release_id | string | Yes | Release ID, unique identifier for this release |
| release_retrospective.retrospective_period.start | string | Yes | Retrospective period start date, ISO 8601 format |
| release_retrospective.retrospective_period.end | string | Yes | Retrospective period end date, ISO 8601 format |
| release_retrospective.effectiveness.summary.goals_achieved | number | Yes | Achieved goals count, must be ≥ 0 |
| release_retrospective.effectiveness.summary.goals_not_achieved | number | Yes | Not achieved goals count, must be ≥ 0 |
| release_retrospective.effectiveness.goal_vs_actual | array | Yes | Target vs actual comparison list, each must contain metric, target, actual, status |
| release_retrospective.effectiveness.goal_vs_actual[].status | string | Yes | Achievement status, enum achieved/partially_achieved/not_achieved/exceeded |
| release_retrospective.quality.bug_statistics.total_bugs | number | Yes | Total Bug count, must be ≥ 0 |
| release_retrospective.quality.bug_statistics.by_severity | object | Yes | Bug severity distribution, contains P0/P1/P2/P3 counts |
| release_retrospective.quality.bug_trend_analysis.trend_comparison | object | Yes | Bug trend comparison, contains total_bugs/leakage_rate/avg_fix_time_days trends |
| release_retrospective.quality.technical_debt_analysis.total_estimated_debt_hours | number | Yes | Total technical debt estimated hours, must be ≥ 0 |
| release_retrospective.process.issue_discovery_timing.discovery_stages | array | Yes | Issue discovery stage distribution, each must contain stage, issues_found, pct |
| release_retrospective.process.collaboration_efficiency.bottlenecks_identified | array | No | Identified bottlenecks list |
| release_retrospective.action_items | array | Yes | Improvement action items list, each must contain item_id, title, priority, owner, due_date |
| release_retrospective.action_items[].status | string | Yes | Action item status, enum open/in_progress/done |
| release_retrospective.overall_assessment.rating | string | Yes | Overall rating, enum good/acceptable/needs_improvement |
| release_retrospective.overall_assessment.summary | string | Yes | Overall assessment summary |

### Output Example

```json
{
  "sprint_review": {
    "deliverables": { /* sprint_summary/completed_items/incomplete_items */ },
    "demo_checklist": { /* demo_duration_minutes/items[] */ },
    "feedback_collected": { /* total_feedback_count/feedback_by_type/feedback_items[] */ }
  },
  "sprint_retro": {
    "metrics": { /* completion_metrics/quality_metrics/collaboration_metrics/team_health */ },
    "problems_identified": [{ /* problem_id/description/category/evidence/frequency/severity/impact */ }],
    "improvement_suggestions": [{ /* suggestion_id/problem_addressed/proposed_action/priority/... */ }]
  },
  "retrospective_report": {
    "sprint_id": "S08",
    "goal_achievement": { /* status/sprint_goal/evidence */ },
    "delivery_metrics": { /* stories_planned/completed/spilled/sp_planned/completed/spill_reasons */ },
    "quality_metrics": { /* defect_density/defect_distribution/rework_rate/tech_debt_delta */ },
    "velocity": { /* current/trend/historical/capacity_utilization */ },
    "action_items": { /* keep[]/improve[]/try[] */ },
    "next_sprint_recommendation": { /* velocity_range/risks/capacity_adjustment/experiments */ }
  },
  "metadata": {
    "sprint_id": "SPR-2024-S08",
    "generated_at": "ISO datetime",
    "review_completed": true,
    "retro_completed": true,
    "report_completed": true
  }
}
```

---

## Review Duration Recommendations

| Segment | Recommended Duration |
|------|----------|
| Demo Presentation | 50% |
| Feedback Discussion | 30% |
| Next Steps Alignment | 20% |

## Retro Duration Recommendations

| Segment | Recommended Duration |
|------|----------|
| Data Review | 15% |
| Problem Discussion | 50% |
| Improvement Suggestions | 35% |

---

## Decision Rules

| Condition | Action |
|------|------|
| Sprint completion rate < 60% | Trigger deep retrospective |
| Quality issue count abnormally increased | Trigger quality-focused Retro |
| Improvement suggestions not executed for 2 consecutive Sprints | Escalate to team discussion |
| Team health metrics deteriorating | Escalate to management attention |
| Sprint Goal not achieved | Spillover root cause analysis is mandatory |
| Velocity declining for 3 consecutive Sprints | Auto-flag as risk and suggest focused retrospective |
| Rework rate > 20% | Quality improvement action item priority elevated to highest |
| Effectiveness below expectation ≥ 30% | Trigger deep release analysis |
| P0 defect appears post-release | Trigger urgent release retrospective |
| Bug leakage rate increase > 20% | Trigger root cause analysis |
| Release rollback occurs | Trigger focused release retrospective |
| Goals not achieved | Generate product/operations improvement action items |
| Bug trend worsening | Generate test/quality improvement action items |
| Collaboration efficiency issues | Generate process improvement action items |
| Technical debt increasing | Generate technical improvement action items |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Review covers all completed Stories
- [ ] Goal achievement is consistent with data (achievement determination matches Story completion rate)
- [ ] Action items are actionable (each has owner and deadline)

### P1 Checks (must pass for standard/deep)

- [ ] Demo content corresponds to acceptance criteria
- [ ] Feedback is classified (accepted/rejected/improved)
- [ ] Improvement suggestions have clear owners and follow-up plans
- [ ] Spillover root causes are classified (each spilled Story has root cause label)
- [ ] Velocity trend is evidence-based (trend judgment based on at least 3 Sprint data points, otherwise annotate "insufficient data, trend under observation")
- [ ] Release retrospective data sources are annotated
- [ ] Release retrospective target vs actual comparison is clear
- [ ] Release retrospective attribution analysis is evidence-supported
- [ ] Release retrospective action items have owners and deadlines

### P2 Checks (must pass for deep only)

- [ ] Release retrospective Bug trend analysis is complete
- [ ] Release retrospective process issues are identified
- [ ] Release retrospective action items have verification methods
- [ ] Team dynamics analysis is complete (team collaboration patterns, communication efficiency, decision quality)
- [ ] Trend comparison analysis is complete (cross-Sprint metric trend comparison, improvement effect tracking)
- [ ] Improvement roadmap is generated (short-term/mid-term/long-term improvement plan, with milestones and acceptance criteria)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Sprint deliverable data | User provides completion status (completed/incomplete Stories), AI generates Review/Retro | Review/Retro generated based on user input, lacking automated data support |
| Team performance data | Skip collaboration and efficiency dimension analysis, retrospective based on delivery data only | Retro missing team collaboration and efficiency dimension analysis |
| Stakeholder feedback | Skip feedback collection, annotate "no stakeholder feedback" in Review | Review report has no external feedback content |
| Sprint plan | Reverse-engineer Sprint goals from review results, annotate "plan information missing" | Goal achievement analysis based on reverse-engineered data, lacking plan baseline comparison |
| Daily sync records | Skip blocker analysis, annotate "blocker data missing" | Retrospective report missing blocker tracking and risk record dimension |
| Historical Sprint data | Skip velocity trend analysis, annotate "first Sprint, no trend data" | No velocity trend and predictability analysis, needs subsequent Sprint data accumulation |
| Release data missing | User provides release content description → generate release retrospective framework | Cannot perform target vs actual comparison |
| Monitoring data missing | Skip metric comparison in effectiveness review | Effectiveness review section annotated "to be supplemented" |
| User feedback data missing | Skip user satisfaction analysis | User feedback dimension missing |
| Bug statistics data missing | Skip Bug statistical analysis in engineering quality review | Bug statistics dimension missing |
| Release process data missing | Skip response speed and collaboration efficiency analysis in process review | Process review dimension missing |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Sprint deliverable data missing**: Ask user to provide completion status, including: completed Stories list, incomplete Stories and reasons, story point completion status, AI will generate Review and Retro reports accordingly
2. **Team performance data missing**: Skip collaboration and efficiency dimension analysis, Retro based on delivery and quality data only, annotate "missing team collaboration data"
3. **Stakeholder feedback missing**: Skip feedback collection in Review, annotate "no stakeholder feedback", suggest supplementing through other channels
4. **Sprint plan missing**: Reverse-engineer goals from review results, annotate "plan information missing"
5. **Historical Sprint data missing**: Skip velocity trend analysis, annotate "first Sprint, no trend data"
6. **Data unavailable**: Generate retrospective framework, key metrics annotated "awaiting data supplementation"
7. **Release data missing**: Ask user to provide release content description (what features were released, what the goals were), AI will generate release retrospective framework accordingly
8. **Monitoring data missing**: Skip effectiveness review metric comparison, annotate "awaiting monitoring data supplementation", suggest supplementing later
9. **Bug statistics data missing**: Skip engineering quality review Bug statistics, annotate "awaiting Bug data supplementation"
10. **Release process data missing**: Skip process review response speed and collaboration efficiency analysis, annotate "awaiting process data supplementation"

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Sprint plan change (Story additions/removals/priority adjustments) | Deliverable inventory, completion rate calculation, Demo agenda | Re-compile deliverable inventory, update completion rate and Demo preparation checklist |
| Team data update (personnel changes/performance changes) | Retro collaboration metrics, team health assessment | Recalculate collaboration metrics, update problem identification and improvement suggestions |
| Feedback data supplementation (new stakeholder feedback) | Feedback collection classification, priority ranking | Re-classify feedback, update feedback statistics and priority ranking |
| Sprint review result change (deliverable/feedback update) | Delivery quality assessment, improvement action items | Update quality metrics and improvement suggestions, regenerate report |
| Historical Sprint data supplementation | Velocity trend analysis, predictability assessment | Recalculate velocity trend and forecast range |
| Release notes change | Release retrospective scope and metric review | Update retrospective scope, re-evaluate metric review |
| Gradual release result change | Release retrospective effectiveness assessment | Update gradual release related retrospective content, flag for human confirmation |
| Acceptance report change | Release retrospective quality assessment and improvement suggestions | Update quality-related metrics, re-evaluate improvement suggestions |
| Change log change | Release retrospective scope | Update change impact assessment, flag for human confirmation |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Sprint review result change | Sprint retrospective report, next Sprint planning | Update sprint_review.json, notify agile-sprint-planning |
| Retro improvement suggestion change | Next Sprint action items, team improvement plan | Update sprint_retro.json, notify agile-sprint-planning |
| Action item status change | Team execution tracking, subsequent Sprint verification | Update metadata.json, notify relevant action item owners |
| Retrospective report change | Next Sprint planning, team improvement plan | Update sprint-retro-S{NN}.json, notify agile-sprint-planning |
| Improvement action item change | Team execution tracking, subsequent Sprint verification | Update sprint-retro-S{NN}.json, notify action item owners |
| Velocity forecast change | Sprint planning capacity reference | Update sprint-retro-S{NN}.json, notify agile-sprint-planning |
| Release retrospective action item added | Action item tracking | Update release_retro.json, notify change-impact-analysis |
| Release retrospective action item status change | Action item tracking, subsequent verification | Update release_retro.json, notify action item owners |
| Release retrospective metric anomaly | Deep analysis trigger | Update release-retro-{release_id}.json, trigger deep analysis |
| Release retrospective report change | Next release planning, team improvement plan | Update release-retro-{release_id}.json, notify relevant teams |

### Retrospective Feedback Loop Mechanism

The core value of retrospectives lies in driving a continuous improvement closed loop. The following defines rules for feeding retrospective conclusions back to upstream Skills, ensuring improvement suggestions and action items don't just stay at the report level but can actually influence upstream decisions.

#### Sprint Retrospective Feedback Loop

| Retrospective Conclusion Type | Feedback Target | Feedback Content | Feedback Method |
|-------------|----------|----------|----------|
| Velocity forecast change | agile-sprint-planning | velocity_range, capacity_adjustment | Write to output/pm-project/agile-review/sprint-retro-S{NN}.json's next_sprint_recommendation, agile-sprint-planning consumes this field as next Sprint capacity planning input |
| Spillover root cause pattern | agile-sprint-planning | recurring/persistent types in spill_reasons | Write to sprint_retro.json's problems_identified, agile-sprint-planning checks historical spillover root causes during planning phase |
| Cross-team dependency blocking | agile-sprint-planning | persistent issues of collaboration type | Write to sprint_retro.json's problems_identified, agile-sprint-planning references during dependency confirmation |
| Frequent requirement changes | design-prd, change-impact-analysis | Spillover statistics caused by requirement changes | Write to sprint_retro.json's problems_identified, mark category=process, design-prd references historical change frequency during requirement collection phase |
| Quality issue pattern | quality-acceptance | defect_density trend, rework_rate | Write to sprint_retro.json's metrics, quality-acceptance references historical quality data when establishing acceptance criteria |
| Improvement experiment results | agile-sprint-planning | Execution results of previous Sprint experiments | Write to sprint-retro-S{NN}.json's action_items.try, agile-sprint-planning validates whether experiments were effective during next Sprint planning |

#### Release Retrospective Feedback Loop

| Retrospective Conclusion Type | Feedback Target | Feedback Content | Feedback Method |
|-------------|----------|----------|----------|
| Goals not achieved | design-prd | not_achieved items in goal_vs_actual | Write to release-retro-{release_id}.json's effectiveness, design-prd references historical goal achievement rate when generating next PRD |
| Bug leakage rate increase | quality-acceptance | leakage_rate trend and root_cause_patterns | Write to release-retro-{release_id}.json's quality, quality-acceptance references when establishing test strategy |
| Technical debt increase | Backend Skill (backend-architecture-spec) | debt_items in tech_debt_analysis | Write to release-retro-{release_id}.json's quality, backend-architecture-spec references technical debt list during architecture design |
| Collaboration bottlenecks | agile-sprint-planning | bottlenecks_identified | Write to release-retro-{release_id}.json's process, agile-sprint-planning avoids known bottlenecks during Sprint planning |
| Release process issues | monitoring-pipeline | needs_improvement/critical items in issue_discovery_timing | Write to release-retro-{release_id}.json's process, monitoring-pipeline references when establishing monitoring strategy |

#### Feedback Loop Execution Rules

1. **Auto Feedback**: After retrospective report is generated, automatically write feedback content to corresponding output files, downstream Skills consume during execution
2. **Feedback Annotation**: All feedback content must be annotated with source (`source: "agile-review", sprint_id/release_id`), for traceability
3. **Feedback Validation**: Feedback content must pass quality checks (data complete, conclusions evidence-supported), non-compliant feedback annotated "pending verification"
4. **Closed-loop Check**: During next Sprint retrospective, check whether previous Sprint's fed-back improvement experiments were executed, unexecuted ones escalated to team discussion items

---
