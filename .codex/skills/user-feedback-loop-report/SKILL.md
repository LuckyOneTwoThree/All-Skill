---
name: user-feedback-loop-report
description: Use when consolidating user feedback processing into a complete deliverable loop report. User feedback loop report auto-generation, including feedback source analysis, processing progress tracking, closure rate statistics, unresolved issues, and improvement suggestions. Keywords: user feedback loop, feedback report, feedback tracking, closure rate, VOC closure, feedback processing, feedback processed yet, user opinions.
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Monitoring & Alerting"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "How is user feedback processing going"
    - "Help me generate a feedback loop report"
    - "How is the feedback closure rate"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Output closure rate and P0 unresolved list directly"
  deep_description: "Full report + feedback trend prediction + root cause deep analysis + improvement roadmap"
---

# User Feedback Loop Report Generation

## Core Principles

**Every piece of user feedback deserves a response**

The core value of the user feedback loop report lies in ensuring every piece of user feedback has a beginning and an end. Closure is not a formal "read" status, but a substantive "processed" or "decided" status. Unclosed feedback is a loss of user trust.

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User Voice Analysis | markdown | No | user-research-voice-analysis | Sentiment analysis, topic extraction, pain point list |
| Anomaly Monitoring Data | markdown | No | monitoring-pipeline | Anomaly events, user impact scope |
| Feedback Data | text | Yes | User input | Raw user feedback data from various channels |
| Processing Records | text | No | User input | Records and results of processed feedback |

### Degradation Strategy

| Missing Input | Degradation Plan |
|----------|----------|
| No user voice analysis | Categorize and analyze based on raw feedback data independently, mark "Pending VOC deep analysis" |
| No anomaly monitoring data | Skip anomaly correlation analysis, mark "Pending monitoring data supplementation" |
| No processing records | Only count feedback sources and categories, closure rate marked "Pending processing record supplementation" |
| No feedback data | If user does not provide feedback data, prompt user to provide or skip related input steps |

## Execution Steps

### Step 1: Feedback Source Analysis [Core]

Analyze and compile the distribution of feedback sources:

1. **Channel Distribution**: In-app feedback / Customer service tickets / Social media / App stores / Community / Email
2. **Sentiment Distribution**: Positive / Neutral / Negative and their proportions
3. **Topic Distribution**: Feedback distribution categorized by functional module
4. **Time Trend**: Time-based trend of feedback volume

### Step 2: Processing Progress Tracking [Conditional]

Track the processing status of each feedback item:

1. **Status Classification**:
   - 🆕 New (unprocessed)
   - 👀 Evaluating (confirming validity)
   - 📋 Scheduled (included in iteration plan)
   - 🔨 In Progress (development/fix in progress)
   - ✅ Closed (issue resolved and verified)
   - ❌ Dismissed (not processing, with reason)
2. **Processing Timeliness**: Average dwell time per status
3. **Bottleneck Identification**: Blockages in the processing workflow

### Step 3: Closure Rate Statistics [Core]

Calculate and track feedback closure rates:

1. **Overall Closure Rate**: Closed + Dismissed / Total feedback
2. **Closure Rate by Channel**: Closure rate comparison across channels
3. **Closure Rate by Severity**: Closure rates for P0/P1/P2/P3
4. **Closure Timeliness**: Average time from feedback to closure
5. **Trend Comparison**: Closure rate comparison with previous period

### Step 4: Unresolved Issue Analysis [Conditional]

Analyze feedback that has not yet been closed:

1. **P0/P1 Unresolved List**: High-priority unresolved issues
2. **Long-standing Unresolved**: Feedback not closed for over 30 days
3. **Repeated Feedback**: Similar issues reported multiple times
4. **Root Cause Analysis**: Primary reasons categorized for unclosed feedback

### Step 5: Improvement Suggestions [Deep]

Propose improvement suggestions based on closure analysis:

1. **Process Improvement**: Workflow optimization to reduce processing time
2. **Product Improvement**: Product optimization directions corresponding to high-frequency feedback
3. **Communication Improvement**: Communication strategies for responding to user feedback
4. **Preventive Measures**: Prevention plans to reduce similar feedback

### Step 6: Report Assembly [Core]

Assemble the above content into a complete loop report.

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Closure rate and P0 unresolved list | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (current default) | Complete deliverables including all Step outputs |
| deep | Full report + feedback trend prediction + root cause deep analysis + improvement roadmap | Full deliverables + extended analysis + deep simulation |

## Output

### Output Files

| File | Path | Description |
|------|------|------|
| Feedback Loop Report | `output/pm-monitoring/user-feedback-loop-report/feedback-loop-report.md` | Human-readable complete report |
| Structured Data | `output/pm-monitoring/user-feedback-loop-report/feedback-loop-report.json` | Machine-consumable structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_period", "summary", "closure_metrics"],
  "properties": {
    "report_period": {"type": "object", "description": "Report period, including start and end dates"},
    "report_date": {"type": "string", "description": "Report date"},
    "summary": {"type": "object", "description": "Executive summary, including total feedback count, closure rate, and P0 unresolved count"},
    "source_analysis": {"type": "object", "description": "Feedback source analysis, including channel/sentiment/topic distribution"},
    "processing_status": {"type": "object", "description": "Processing progress, including status distribution and bottlenecks"},
    "closure_metrics": {"type": "object", "description": "Closure rate statistics, including overall and by-channel/by-severity closure rates"},
    "unresolved": {"type": "object", "description": "Unresolved issues, including P0/P1 list and root cause analysis"},
    "improvement_suggestions": {"type": "array", "description": "Improvement suggestions list"}
  }
}
```

### Markdown Report Structure

```markdown
# User Feedback Loop Report: {Report Period}

## 1. Executive Summary
- Total feedback / Closure rate / Average closure time / P0 unresolved count

## 2. Feedback Source Analysis
- Channel distribution
- Sentiment distribution
- Topic distribution
- Time trend

## 3. Processing Progress Tracking
- Status distribution
- Processing timeliness
- Bottleneck identification

## 4. Closure Rate Statistics
- Overall closure rate
- By-channel/by-severity closure rates
- Closure timeliness
- Trend comparison

## 5. Unresolved Issues
- P0/P1 unresolved list
- Long-standing unresolved
- Repeated feedback
- Root cause analysis

## 6. Improvement Suggestions
- Process improvement
- Product improvement
- Communication improvement
- Preventive measures
```

### JSON Structure

```json
{
  "report_period": { "start": "", "end": "" },
  "report_date": "",
  "summary": {
    "total_feedback": 0,
    "closure_rate": 0,
    "avg_closure_time_days": 0,
    "p0_unresolved": 0
  },
  "source_analysis": {
    "channel_distribution": {},
    "sentiment_distribution": {},
    "topic_distribution": {},
    "time_trend": []
  },
  "processing_status": {
    "status_distribution": {},
    "avg_time_by_status": {},
    "bottlenecks": []
  },
  "closure_metrics": {
    "overall_rate": 0,
    "by_channel": {},
    "by_severity": {},
    "trend_comparison": {}
  },
  "unresolved": {
    "p0_p1_list": [],
    "long_standing": [],
    "repeated": [],
    "root_causes": []
  },
  "improvement_suggestions": []
}
```

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Closure rate is calculable (has clear closure definition and calculation formula)
- [ ] P0 unresolved items listed (all P0 unclosed feedback has a list)

### P1 Checks (must pass for standard/deep)

- [ ] Timeliness data complete (average processing time per status is calculable)
- [ ] Improvement suggestions are actionable (each suggestion has a responsible party and timeline)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Decision Rules

- When P0 feedback unresolved count > 0, the report must include a dedicated follow-up plan
- When closure rate < 80%, automatically generate process improvement suggestions
- When similar feedback appears ≥ 3 times, escalate to product improvement suggestion rather than case-by-case handling
- Decision points requiring human confirmation: feedback priority determination, closure criteria definition, dismissal reasons for closed feedback

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| No user voice analysis | Analyze directly based on user-provided feedback data, mark "VOC analysis pending supplementation" | Feedback analysis lacks sentiment and topic dimensions |
| No anomaly monitoring data | Skip anomaly correlation analysis, mark "Monitoring data pending supplementation" | Association between feedback and anomaly events is missing |
| No processing records | Only count feedback volume and categories, closure rate marked "Cannot calculate" | Closure rate is not calculable |

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| summary | object | Yes | Executive summary, must contain total_feedback/closed_rate |
| source_analysis | object | Yes | Feedback source analysis |
| progress_tracking | object | No | Processing progress tracking |
| closed_rate | object | No | Closure rate statistics, must contain overall/by_category |
| unresolved_p0 | array | No | P0 unresolved list |
| improvement_suggestions | array | No | Improvement suggestions list |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| user-research-voice-analysis | VOC analysis results updated | Feedback source analysis and sentiment dimension | Update sentiment distribution and topic classification |
| monitoring-pipeline | Anomaly events updated | Feedback and anomaly correlation analysis | Update associated events and impact scope |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| monitoring-orchestrator | Feedback loop report completed | Output file updated | Report completion status and key findings |
| iteration-retrospective | P0 unresolved feedback | Write to output file | P0 feedback list and improvement suggestions |
