---
name: user-feedback-loop-report
description: "Use when generating user feedback loop reports. User feedback loop report generation, collecting multi-channel feedback, categorizing and prioritizing, tracking closure rate and improvement effectiveness. Keywords: user feedback, feedback loop, feedback analysis, closure rate, improvement tracking, user voice, feedback report, user complaints, user suggestions."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "User Feedback"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me analyze user feedback"
    - "Generate user feedback report"
    - "What are users complaining about recently"
    - "Feedback closure rate how"
execution_depth:
  default: standard
  quick_description: "Output closure rate and P0 unresolved list"
  deep_description: "Full report + feedback trend prediction + root cause deep analysis + improvement roadmap"
---

# User Feedback Loop Report Generation AI->Human

## Core Principles

1. **Feedback is a gift, not a burden**: Every piece of feedback is a user's expectation for the product; ignoring feedback = ignoring users
2. **Closure rate is the core metric**: The value of feedback lies in resolution, not collection; unresolved feedback is debt
3. **Categorization precedes prioritization**: Without categorization there's no focus; without focus there's no action

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Voice Analysis | JSON | No | user-research-voice-analysis -> Voice analysis | User voice analysis results |
| Anomaly Monitoring | JSON | No | monitoring-pipeline -> Anomaly data | Anomaly-related user feedback |
| Feedback Data | JSON | Yes | User provided | Raw user feedback data |

## Execution Steps

### Step 1: Feedback Collection & Aggregation [Core]

**Goal**: Collect and aggregate multi-channel user feedback

**Feedback Channels**:

| Channel | Data Source | Collection Method |
|---------|-------------|-------------------|
| In-app Feedback | Feedback system | API |
| App Store Reviews | App Store/Google Play | Crawler/API |
| Social Media | Weibo/WeChat/Xiaohongshu | Crawler/API |
| Customer Service | Customer service system | API/Export |
| User Research | Research reports | File import |
| Community | User community | API/Crawler |

**Aggregation Output**:

```yaml
feedback_aggregation:
  period: {start} to {end}
  total_feedback: {count}
  by_channel:
    in_app: {count}
    app_store: {count}
    social_media: {count}
    customer_service: {count}
    user_research: {count}
    community: {count}
  by_sentiment:
    positive: {count}
    neutral: {count}
    negative: {count}
```

### Step 2: Feedback Categorization [Core]

**Goal**: Categorize feedback by type and priority

**Categorization System**:

| Category | Subcategory | Example |
|----------|-------------|---------|
| Feature Request | New Feature | "Hope to add dark mode" |
| Feature Request | Enhancement | "Search should support fuzzy matching" |
| Bug Report | Functional | "Can't log in" |
| Bug Report | Performance | "Page loads too slowly" |
| Experience Issue | Interaction | "Button too hard to tap" |
| Experience Issue | Visual | "Text too small" |
| Content Issue | Accuracy | "Information is wrong" |
| Content Issue | Completeness | "Missing key information" |
| Service Issue | Response Speed | "Customer service too slow" |
| Service Issue | Attitude | "Customer service unfriendly" |
| Pricing Issue | Too Expensive | "Price too high" |
| Pricing Issue | Payment | "Payment failed" |

**Priority Assessment**:

| Priority | Criteria | Handling |
|----------|----------|----------|
| P0 | Affects core functionality, large user impact | Immediate handling |
| P1 | Affects experience, moderate user impact | Handle this week |
| P2 | Optimization suggestion, small user impact | Plan handling |
| P3 | Long-tail demand, minimal impact | Backlog |

**Categorization Output**:

```yaml
feedback_categorization:
  - category: feature_request
    subcategory: new_feature
    count: {count}
    priority_distribution:
      P0: {count}
      P1: {count}
      P2: {count}
      P3: {count}
    top_items:
      - description: "Hope to add dark mode"
        frequency: 45
        priority: P1
        source_channels: [in_app, social_media]
  - category: bug_report
    subcategory: functional
    count: {count}
    priority_distribution:
      P0: {count}
      P1: {count}
      P2: {count}
      P3: {count}
    top_items:
      - description: "Can't log in"
        frequency: 120
        priority: P0
        source_channels: [customer_service, app_store]
```

### Step 3: Closure Rate Tracking [Conditional]

**Goal**: Track feedback closure rate and resolution effectiveness

**Closure Rate Metrics**:

| Metric | Definition | Target |
|--------|------------|--------|
| Overall Closure Rate | Resolved feedback / Total feedback | >= 80% |
| P0 Closure Rate | Resolved P0 / Total P0 | 100% |
| P1 Closure Rate | Resolved P1 / Total P1 | >= 90% |
| Average Resolution Time | Average time from submission to resolution | P0: <4h, P1: <24h |
| User Satisfaction Rate | User satisfied with resolution / Total resolved | >= 70% |

**Tracking Output**:

```yaml
closure_tracking:
  overall_closure_rate: {percentage}
  by_priority:
    P0:
      total: {count}
      resolved: {count}
      closure_rate: {percentage}
      avg_resolution_time: {hours}
    P1:
      total: {count}
      resolved: {count}
      closure_rate: {percentage}
      avg_resolution_time: {hours}
    P2:
      total: {count}
      resolved: {count}
      closure_rate: {percentage}
    P3:
      total: {count}
      resolved: {count}
      closure_rate: {percentage}
  unresolved_p0:
    - id: {id}
      description: {description}
      submitted_at: {date}
      days_open: {days}
      assigned_to: {team}
  user_satisfaction_rate: {percentage}
```

### Step 4: Improvement Effectiveness Assessment [Deep]

**Goal**: Assess improvement effectiveness from feedback-driven changes

**Assessment Dimensions**:

| Dimension | Metric | Assessment Method |
|-----------|--------|-------------------|
| Feedback Volume Change | Related feedback before/after improvement | Volume reduction |
| Sentiment Change | Related feedback sentiment before/after | Sentiment improvement |
| Business Metric Change | Related business metric before/after | Metric improvement |
| User Satisfaction Change | User satisfaction score before/after | Score improvement |

**Assessment Output**:

```yaml
improvement_effectiveness:
  - improvement_id: IMP-001
    description: "Optimized payment flow"
    related_feedback:
      total_before: 85
      total_after: 12
      reduction_rate: 86%
    sentiment_change:
      negative_before: 72%
      negative_after: 15%
    business_impact:
      conversion_rate_before: 3.2%
      conversion_rate_after: 4.1%
      improvement: +28%
    user_satisfaction:
      before: 3.2
      after: 4.5
```

### Step 5: Report Generation [Core]

**Goal**: Generate complete user feedback loop report

**Report Structure**:

```yaml
feedback_loop_report:
  report_id: {uuid}
  generated_at: {ISO8601}
  period: {start} to {end}
  executive_summary:
    total_feedback: {count}
    closure_rate: {percentage}
    top_issues: [{issue}]
    key_improvements: [{improvement}]
  aggregation: {...}
  categorization: {...}
  closure_tracking: {...}
  improvement_effectiveness: {...}
  action_items:
    - action: {description}
      priority: P0/P1/P2
      owner: {team}
      deadline: {date}
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | closure rate and P0 unresolved list | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full report + feedback trend prediction + root cause deep analysis + improvement roadmap | Full deliverables + extended analysis + deep simulation |

## Output


**Output file path**: `output/pm-monitoring/user-feedback-loop-report/`
**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_id", "period", "aggregation", "categorization", "closure_tracking"],
  "properties": {
    "report_id": {"type": "string", "description": "Report unique identifier"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "period": {"type": "object", "description": "Report period, including start and end times"},
    "executive_summary": {"type": "object", "description": "Executive summary, including total feedback and closure rate"},
    "aggregation": {"type": "object", "description": "Feedback aggregation data, including channel and sentiment distribution"},
    "categorization": {"type": "array", "description": "Feedback categorization list, including category and priority distribution"},
    "closure_tracking": {"type": "object", "description": "Closure rate tracking, including overall and by-priority closure rates"},
    "improvement_effectiveness": {"type": "array", "description": "Improvement effectiveness list"},
    "action_items": {"type": "array", "description": "Action item list"}
  }
}
```

```
├── {date}/
│   ├── aggregation.yaml
│   ├── categorization.yaml
│   ├── closure_tracking.yaml
│   ├── improvement_effectiveness.yaml
│   └── full_report.md
└── latest/
    └── feedback_loop_report.md
```

## Decision Rules

| Scenario | Decision Rule |
|----------|---------------|
| P0 feedback unresolved | Mark red alert, include in emergency handling |
| P0 closure rate < 100% | Mark warning, require explanation |
| Overall closure rate < 60% | Mark warning, require improvement plan |
| Same category feedback surge (>50%) | Auto-trigger root cause analysis |
| User satisfaction rate < 50% | Mark warning, require service improvement |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Feedback aggregation data complete
- [ ] Categorization coverage >= 95%

### P1 Checks (must pass for standard/deep)

- [ ] Priority assessment reasonable
- [ ] Closure rate calculable
- [ ] P0 unresolved listed
- [ ] Improvement suggestions actionable
- [ ] Report structure complete

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|------------------|---------------|
| Voice analysis | Skip voice analysis dimension, categorize based solely on raw feedback data | Report lacking voice analysis dimension |
| Anomaly monitoring | Skip anomaly correlation analysis, mark "cannot correlate with monitoring data" | Report lacking anomaly correlation |
| Feedback data | User provides feedback summary (total count, main issues, etc.), AI generates report based on summary | Report based on user summary, lacking raw data support |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Voice analysis missing**: Skip voice analysis dimension, categorize based solely on raw feedback data, recommend supplementing voice analysis later to improve report quality
2. **Anomaly monitoring missing**: Skip anomaly correlation analysis, mark "cannot correlate with monitoring data" in report, recommend supplementing monitoring data later
3. **Feedback data missing**: Ask user to provide feedback summary, including: total feedback count, main issue categories, approximate priority distribution, AI will generate report based on summary

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| report_id | string | Yes | Report unique identifier |
| period | object | Yes | Report period, must contain start/end |
| aggregation | object | Yes | Feedback aggregation, must contain total_feedback/by_channel/by_sentiment |
| categorization | array | Yes | Categorization list, each must contain category/subcategory/count |
| closure_tracking | object | Yes | Closure tracking, must contain overall_closure_rate/by_priority |
| closure_tracking.overall_closure_rate | number | Yes | Overall closure rate, range 0-100 |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|-----------------|-------------|--------------|-----------------|
| user-research-voice-analysis | Voice analysis data update | Feedback categorization and sentiment analysis | Update categorization and sentiment data |
| monitoring-pipeline | Anomaly data update | Anomaly correlation analysis | Update anomaly correlation data |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|---------------------|------------------------|---------------------|----------------------|
| monitoring-orchestrator | Feedback loop report completed | Output file update | Report completion status and key findings |
| iteration-decision | P0 feedback unresolved | Write to output file | Unresolved feedback details and handling suggestions |
