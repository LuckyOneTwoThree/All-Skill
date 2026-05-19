---
name: risk-management
description: "Use when continuously monitoring project risks or handling risk escalations. Step 1 monitors risk status, detects indicator changes and trigger conditions; Step 2 performs escalation handling for high-priority risks, initiates response processes and resource allocation. Keywords: risk monitoring, risk alert, risk tracking, risk indicators, risk escalation, issue escalation, escalation process, emergency escalation."
metadata:
  module: "Project Management & Execution"
  sub-module: "Risk Management"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How to continuously monitor risks"
    - "What is the current risk status"
    - "Are there any new risks emerging"
    - "What to do when risk needs escalation"
    - "The problem is too big, need to escalate"
---

# Risk Monitoring & Escalation Handling Automation

## Core Principles

1. **Transparency Enables Collaboration**: Risk monitoring status, alert information, and escalation paths are visible to all, ensuring relevant parties are informed in a timely manner
2. **Risk Early Identification**: Continuously monitor risk indicators, trigger alerts before risk escalation; escalation rules defined upfront, automatically triggered when conditions are met
3. **Automated Tracking**: Risk status changes, response effectiveness, escalation notification delivery, processing status, and closed-loop confirmation are automatically tracked
4. **Escalation Cannot Be Delayed**: When risk reaches escalation threshold, delay is dereliction of duty; escalation process automatically triggers within SLA

## Interaction Mode

**AI AI Auto-execution**

- Monitoring and alerting executed automatically by AI
- Indicator checks executed hourly
- Alerts triggered and notified in real-time
- Escalation judgment and path determination completed automatically by AI
- Notifications sent automatically
- Human receives alert notifications and makes decisions
- Response adjustments require human approval
- Escalation results maintained by AI
- Complex escalations require human intervention decisions

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| risk_register | object | Yes | output/pm-project/risk-identification/risk_register.json | Risk register |
| project_data | object | Yes | Project management system -> Project data | Real-time project data |
| trigger_conditions | object | Yes | User provided | Configured trigger conditions |
| mitigation_actions | object[] | O | output/pm-project/risk-management/response-tracking | Executed response measures |
| issue_data | object | Yes | User provided | Issue data (used in Step 2) |
| escalation_rules | object | Yes | User provided | Escalation rule configuration (used in Step 2) |
| organizational_structure | object | Yes | User provided | Organizational structure for determining escalation paths (used in Step 2) |
| pending_escalations | object[] | O | output/pm-project/risk-management/escalation-records | Pending escalation requests (used in Step 2) |

## Execution Steps

### Step 1: Risk Monitoring (Continuously monitor risk status, detect risk indicator changes and trigger conditions)

#### Step 1.1: Risk Indicator Auto-tracking

**Actions**:
- Define tracking indicators for each active risk
- Collect current indicator values
- Compare with baselines
- Calculate indicator trends

**Output**:
```json
{
  "risk_indicators": [{
    "risk_id": "RISK-001",
    "indicators": [{
      "indicator_name": "string",
      "current_value": number,
      "baseline_value": number,
      "threshold_warning": number,
      "threshold_critical": number,
      "trend": "improving | stable | worsening",
      "trend_percentage": number,
      "last_measured": "ISO datetime"
    }]
  }]
}
```

#### Step 1.2: Risk Status Auto-update

**Actions**:
- Assess risk status based on indicator changes
- Identify risk escalation or de-escalation
- Update risk register
- Record status change history

**Output**:
```json
{
  "risk_status_updates": [{
    "risk_id": "RISK-001",
    "previous_status": "string",
    "new_status": "string",
    "status_change_reason": "string",
    "probability_change": 0.0-1.0,
    "impact_change": 0.0-1.0,
    "priority_reassessment": boolean,
    "updated_at": "ISO datetime"
  }],
  "status_summary": {
    "status_distribution": {
      "active": number,
      "escalated": number,
      "improving": number,
      "resolved": number
    },
    "significant_changes": number
  }
}
```

#### Step 1.3: New Risk Auto-identification

**Actions**:
- Scan risk indicator anomalies
- Detect risk signals not in the register
- Cross-validate new risks
- Assess whether to add to register

**Output**:
```json
{
  "new_risks_identified": [{
    "risk_id": "RISK-NEW-001",
    "description": "string",
    "detection_signal": "string",
    "signal_source": "string",
    "confidence": 0.0-1.0,
    "related_existing_risks": ["RISK-ID"],
    "auto_add_to_register": boolean
  }],
  "risk_signals_pending_review": number
}
```

#### Step 1.4: Risk Alert Auto-trigger

**Actions**:
- Detect alert trigger conditions
- Assess alert severity
- Generate alert notifications
- Route alerts to appropriate recipients

**Output**:
```json
{
  "alerts_triggered": [{
    "alert_id": "ALERT-001",
    "risk_id": "RISK-001",
    "alert_type": "threshold_breach | trend_worsening | new_risk | mitigation_failed",
    "severity": "critical | high | medium | low",
    "message": "string",
    "triggered_conditions": {
      "indicator_name": "string",
      "current_value": number,
      "threshold_value": number
    },
    "notification_routed": ["string"],
    "created_at": "ISO datetime"
  }],
  "alert_summary": {
    "critical_alerts": number,
    "high_alerts": number,
    "medium_alerts": number,
    "low_alerts": number,
    "total_alerts_24h": number,
    "alert_trend": "increasing | stable | decreasing"
  }
}
```

#### Step 1.5: Response Effectiveness Auto-tracking

**Actions**:
- Check status of implemented response measures
- Assess response effectiveness (whether indicators improved)
- Identify response failures
- Suggest response adjustments

**Output**:
```json
{
  "mitigation_effectiveness": [{
    "risk_id": "RISK-001",
    "mitigation_action": "string",
    "implementation_date": "ISO date",
    "expected_impact": "string",
    "actual_impact": "string",
    "effectiveness_score": 0.0-1.0,
    "status": "effective | partially_effective | ineffective | needs_adjustment",
    "next_review_date": "ISO date",
    "adjustment_suggestions": ["string"]
  }],
  "effectiveness_summary": {
    "total_mitigations_tracked": number,
    "effective_count": number,
    "partially_effective_count": number,
    "ineffective_count": number,
    "overall_effectiveness_rate": 0.0-1.0
  }
}
```

---

### Step 2: Escalation Handling (High-priority risk escalation handling, initiate response process and resource allocation)

Step 2 receives Step 1 output as input (risk data from Step 1 monitoring results), combined with issue data, escalation rules, and organizational structure, to execute escalation handling.

#### Step 2.1: Escalation Necessity Auto-judgment

**Actions**:
- Apply configured escalation rules
- AI-assisted judgment on whether escalation is needed
- Assess escalation urgency
- Annotate escalation reason

**Output**:
```json
{
  "escalation_assessment": [{
    "item_id": "RISK-001",
    "item_type": "risk | issue",
    "rule_based_decision": {
      "escalation_needed": boolean,
      "matched_rule": "string",
      "rule_confidence": 0.0-1.0
    },
    "ai_assisted_decision": {
      "escalation_needed": boolean,
      "reasoning": "string",
      "ai_confidence": 0.0-1.0
    },
    "final_decision": {
      "escalate": boolean,
      "urgency": "critical | high | medium | low",
      "reason": "string",
      "escalation_type": "risk | issue | both"
    }
  }]
}
```

#### Step 2.2: Escalation Path Auto-determination

**Actions**:
- Determine escalation path based on organizational structure
- Identify recipients at each level
- Calculate estimated response time
- Generate escalation roadmap

**Output**:
```json
{
  "escalation_paths": [{
    "item_id": "RISK-001",
    "escalation_level": 1,
    "escalation_chain": [{
      "level": 1,
      "role": "string",
      "name": "string",
      "contact": "string",
      "notified_at": "ISO datetime",
      "response_deadline": "ISO datetime",
      "response_status": "pending | acknowledged | responded | escalated"
    }],
    "current_level": number,
    "estimated_resolution_time": "string",
    "escalation_timeline": "string"
  }]
}
```

#### Step 2.3: Escalation Notification Auto-sending

**Actions**:
- Prepare escalation notification content
- Select appropriate notification channels
- Send notifications along escalation path
- Track notification delivery status

**Output**:
```json
{
  "notifications_sent": [{
    "notification_id": "NOT-001",
    "item_id": "RISK-001",
    "recipient": "string",
    "recipient_role": "string",
    "channel": "email | sms | slack | phone",
    "subject": "string",
    "message": "string",
    "sent_at": "ISO datetime",
    "delivery_status": "sent | delivered | read | failed",
    "acknowledgment_required": boolean,
    "acknowledgment_deadline": "ISO datetime"
  }],
  "notification_summary": {
    "total_sent": number,
    "delivered": number,
    "pending_acknowledgment": number,
    "failed_delivery": number
  }
}
```

#### Step 2.4: Escalation Status Auto-tracking

**Actions**:
- Monitor escalation response status
- Track escalation processing progress
- Record escalation outcomes
- Generate escalation report

**Output**:
```json
{
  "escalation_tracking": [{
    "item_id": "RISK-001",
    "escalation_id": "ESC-001",
    "status": "pending | in_progress | resolved | closed | expired",
    "current_level": number,
    "level_history": [{
      "level": 1,
      "escalated_at": "ISO datetime",
      "responded_at": "ISO datetime",
      "response": "string",
      "outcome": "approved | rejected | needs_more_info | escalated_up"
    }],
    "resolution": {
      "resolved_at": "ISO datetime",
      "resolution_summary": "string",
      "resolved_by": "string",
      "follow_up_required": boolean
    },
    "timeline": {
      "escalated_at": "ISO datetime",
      "first_response_at": "ISO datetime",
      "resolved_at": "ISO datetime",
      "total_escalation_hours": number
    }
  }]
}
```

---

## Output

**Storage Path**: `output/pm-project/risk-management/`

**Output Files**:

| File | Path | Description |
|------|------|------|
| Risk management data | risk-management.json | Structured data for risk monitoring and escalation handling |
| Risk management report | risk-management.md | Human-readable risk management report |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["risk_monitoring", "escalation", "metadata"],
  "properties": {
    "risk_monitoring": {"type": "object", "description": "Risk monitoring data including tracked risks, alerts, and response effectiveness"},
    "escalation": {"type": "object", "description": "Escalation handling data including issue list and escalation path templates"},
    "metadata": {"type": "object", "description": "Metadata including monitoring cycle, processing count, and confidence"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| risk_monitoring.tracked_risks | array | Yes | Tracked risk list, each must contain id, status |
| risk_monitoring.tracked_risks[].id | string | Yes | Risk unique identifier, format RISK-NNN |
| risk_monitoring.tracked_risks[].status | string | Yes | Risk status, enum values active/escalated/improving/resolved |
| risk_monitoring.tracked_risks[].triggered_conditions | array | No | Trigger conditions list |
| risk_monitoring.tracked_risks[].latest_update | string | Yes | Latest update time, ISO 8601 format |
| risk_monitoring.new_risks_identified | number | Yes | Number of newly identified risks |
| risk_monitoring.alerts_triggered | array | No | Triggered alerts list |
| risk_monitoring.alerts_triggered[].id | string | Yes | Alert unique identifier |
| risk_monitoring.alerts_triggered[].severity | string | Yes | Alert severity, enum values critical/high/medium/low |
| risk_monitoring.alerts_triggered[].message | string | Yes | Alert message |
| risk_monitoring.mitigation_effectiveness | object | No | Response effectiveness tracking data |
| escalation.issues | array | Yes | Escalation issue list, each must contain id, description, escalation_needed |
| escalation.issues[].id | string | Yes | Issue unique identifier, format RISK-NNN or ISSUE-NNN |
| escalation.issues[].escalation_needed | boolean | Yes | Whether escalation is needed |
| escalation.issues[].escalation_level | number | Yes | Escalation level, 1-4 |
| escalation.issues[].escalation_path | array | Yes | Escalation path, at least 1 recipient |
| escalation.issues[].notifications_sent | array | No | Sent notifications list |
| escalation.issues[].notifications_sent[].channel | string | Yes | Notification channel, enum values email/sms/slack/phone |
| escalation.issues[].notifications_sent[].status | string | Yes | Notification status, enum values sent/delivered/read/failed |
| escalation.issues[].status | string | Yes | Escalation status, enum values pending/in_progress/resolved/closed |
| escalation.escalation_path_templates | array | No | Escalation path template list |
| escalation.escalation_path_templates[].level | number | Yes | Escalation level |
| escalation.escalation_path_templates[].expected_response_time | string | Yes | Expected response time |
| metadata.monitoring_cycle | string | Yes | Monitoring cycle, ISO 8601 format |
| metadata.monitoring_duration | string | Yes | Monitoring duration |
| metadata.risks_monitored | number | Yes | Number of risks monitored |
| metadata.alerts_generated | number | Yes | Number of alerts generated |
| metadata.escalations_processed | number | Yes | Number of escalations processed |
| metadata.pending_escalations | number | Yes | Number of pending escalations |
| metadata.avg_escalation_time_hours | number | Yes | Average escalation time (hours) |
| metadata.resolution_rate | number | Yes | Resolution rate, range 0.0-1.0 |
| metadata.confidence | number | Yes | Overall confidence, range 0.0-1.0 |

### Output Example

```json
{
  "risk_monitoring": {
    "tracked_risks": [{
      "id": "RISK-001",
      "status": "escalated",
      "triggered_conditions": ["Indicator exceeded critical threshold"],
      "latest_update": "2024-04-12T10:00:00+08:00",
      "indicators": {}
    }],
    "new_risks_identified": 0,
    "alerts_triggered": [{
      "id": "ALERT-001",
      "severity": "critical",
      "message": "RISK-001 key indicator exceeded critical threshold"
    }],
    "mitigation_effectiveness": {}
  },
  "escalation": {
    "issues": [{
      "id": "RISK-001",
      "description": "Core service response time continuously degrading",
      "escalation_needed": true,
      "escalation_level": 2,
      "escalation_path": ["Project Manager - Zhang Ming", "Technical Director - Li Qiang"],
      "notifications_sent": [{
        "channel": "sms",
        "recipient": "Zhang Ming",
        "status": "delivered"
      }],
      "status": "in_progress"
    }],
    "escalation_path_templates": [{
      "level": 1,
      "title": "Team-level Escalation",
      "criteria": "Blockers that cannot be resolved within the team",
      "typical_owner": "Team Lead / SM",
      "expected_response_time": "24h"
    }]
  },
  "metadata": {
    "monitoring_cycle": "2024-04-12T09:00:00+08:00",
    "monitoring_duration": "1h",
    "risks_monitored": 5,
    "alerts_generated": 1,
    "escalations_processed": 1,
    "pending_escalations": 0,
    "avg_escalation_time_hours": 2.5,
    "resolution_rate": 0.85,
    "confidence": 0.9
  }
}
```

---

## Alert Trigger Rules

| Alert Type | Trigger Condition |
|----------|----------|
| Threshold breach | Indicator exceeds warning or critical threshold |
| Trend worsening | Indicator worsening for 3 consecutive days |
| New risk | Unregistered risk signal detected |
| Response failure | Indicator not improving after response measure implementation |

## Alert Notification Configuration

| Severity | Notification Method | Recipients |
|--------|----------|----------|
| Critical | Instant + SMS | Project Manager + Sponsor |
| High | Instant notification | Project Manager |
| Medium | Daily summary | Team |
| Low | Weekly report record | Record |

## Standard Escalation Path Template

| Level | Title | Applicable Scenario | Typical Owner | Response Time |
|------|------|----------|------------|----------|
| 1 | Team-level Escalation | Blockers that cannot be resolved within the team | Team Lead / SM | 24h |
| 2 | Project-level Escalation | Risks affecting project objectives | Project Manager | 24h |
| 3 | Department-level Escalation | Cross-team conflicts or resource issues | Department Head | 48h |
| 4 | Executive-level Escalation | Major risks potentially affecting business | Director/VP | 24h |

## Escalation Rule Configuration Example

```yaml
escalation_rules:
  automatic_escalation:
    - condition: "risk.priority == 'critical'"
      level: 2
      urgency: "critical"
      response_time: "1h"

    - condition: "risk.status == 'unresolved' AND risk.age_days > 7"
      level: 1
      urgency: "high"
      response_time: "24h"

    - condition: "issue.severity == 'high' AND issue.affected_scope == 'sprint'"
      level: 1
      urgency: "medium"
      response_time: "48h"

  escalation_timeout:
    default_hours: 48
    critical_hours: 24
    max_levels: 3
```

---

## Decision Rules

| Condition | Action |
|------|------|
| Critical alerts > 2 per day | Escalate to management |
| Response measures consecutively failing | Trigger response redesign |
| New risk identification frequency surging | Trigger systematic risk review |
| Alert ignored for > 48 hours | Auto-escalate |
| Escalation request rejected | Return to initiator, explain reason, record rejection rationale |
| P0 risk escalation timeout >= 15 minutes without response | Auto-escalate to next level (Director level) |
| P1 risk escalation timeout >= 2 hours without response | Auto-escalate to next level |
| P2 risk escalation timeout >= 24 hours without response | Auto-escalate to next level |
| Same risk shelved >= 2 times consecutively | Escalate to higher level, mark "requires urgent attention" |
| Escalation conflicts with existing decisions | Escalate to higher authority, attach conflict explanation |
| Escalation involves >= 3 departments | Auto-CC PMO, mark "cross-department coordination" |
| No response 24 hours after escalation | Auto-escalate to CEO/CTO level |

## Quality Checks

- [ ] Risk status updates timely
- [ ] Alert trigger conditions clear
- [ ] Risk trend analysis covers at least 3 cycles
- [ ] High-risk items have follow-up records
- [ ] Escalation paths match risk levels (P0->Director level/P1->Manager level/P2->Lead level)
- [ ] Escalation notifications sent within SLA corresponding to risk level (P0<=5 min/P1<=30 min/P2<=4 hours)
- [ ] Escalation reason includes >= 3 elements (risk description + impact scope + urgency level)
- [ ] Escalation timeout has automatic follow-up mechanism (P0 every 15 min/P1 every 2 hours/P2 every 24 hours)
- [ ] 100% of escalation operations recorded and traceable

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Risk register | User provides risk list (risk description + priority), AI generates monitoring plan | Monitoring plan based on user input, lacking structured risk data support |
| Project data | Skip automatic indicator collection, user manually provides key indicator values | Monitoring report based on manual data, lacking real-time automatic indicator collection |
| Trigger conditions | Use default alert thresholds, mark for human confirmation | Alert configuration based on default thresholds, requires human confirmation of threshold reasonableness |
| Response measures | Skip response effectiveness tracking, only monitor risk status changes | Monitoring without response effectiveness tracking, lacking response effectiveness assessment dimension |
| Issue data | User describes issue symptoms and impact, AI generates escalation suggestions based on description | Escalation suggestions based on user description, lacking structured risk/issue data support |
| Escalation rules | Use default escalation rule template, mark for human confirmation | Escalation judgment based on default rules, requires human confirmation of rule applicability |
| Organizational structure | User provides key decision maker information, AI builds escalation chain accordingly | Escalation path based on user input, may be incomplete |
| Pending escalations | Start recording escalation status from scratch, cannot link to historical escalations | Brand new escalation tracking record, cannot link to historical escalation context |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Risk register missing**: Ask user to provide risk list, including risk description and priority; AI will generate monitoring indicator definitions and alert plan accordingly
2. **Project data missing**: Skip automatic indicator collection; ask user to regularly manually provide key indicator values; AI will perform trend analysis and alert judgment based on manual data
3. **Trigger conditions missing**: Adopt default alert threshold template (probability change > 20% triggers Warning, > 40% triggers Critical), mark in output that default thresholds require human review
4. **Issue data missing**: Ask user to describe the issue, including: issue symptoms, impact scope, current processing status, urgency level; AI will generate escalation suggestions and notification content based on description
5. **Escalation rules missing**: Adopt default escalation rule template (Critical->immediate escalation L2, High->escalation within 24h L1, Medium->assessment within 48h), mark in output that default rules require human review
6. **Organizational structure missing**: Ask user to provide key decision maker names and contact information; AI will build escalation paths and notification chains accordingly

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Risk register change (new/closed/priority adjustment) | Monitoring indicator definitions, alert thresholds, tracking scope | Update monitoring indicators and alert configuration, adjust tracking scope |
| Project data change (progress/quality/resource changes) | Risk indicator values, trend analysis, alert triggering | Recollect indicator data, update trend analysis and alert judgment |
| Trigger condition change (threshold adjustment/new conditions) | Alert trigger logic, alert notifications | Reapply trigger conditions, update alert assessment results |
| Risk data change (priority adjustment/status change) | Escalation necessity judgment, escalation path determination | Re-assess escalation necessity, update escalation paths and notifications |
| Issue data update (new issues/severity change) | Escalation judgment, notification content | Re-assess issue escalation needs, update notification content |
| Escalation rule change (threshold adjustment/new rules) | Escalation judgment logic, automatic trigger conditions | Reapply escalation rules, update escalation assessment results |
| Organizational structure change (personnel changes/role adjustments) | Escalation paths, notification recipients | Rebuild escalation paths, update notification recipients |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Risk status change (escalation/de-escalation/resolution) | Project manager, stakeholders | Update risk-management.json, notify project manager and relevant decision makers |
| Alert triggered/cleared | Project manager, risk owner | Update risk-management.json, send notifications per alert notification configuration |
| Response effectiveness assessment change | Risk owner, project manager | Update risk-management.json, notify risk owner and project manager |
| Escalation status change (new escalation/responded/resolved) | Project manager, stakeholders | Update risk-management.json, notify relevant decision makers |
| Escalation path change | Currently active escalations, subsequent escalation processes | Update risk-management.json, notify all recipients in current escalation chain |
| Escalation rule change | All subsequent escalation judgments | Update risk-management.json, notify rule maintainers |

---

## Version History

- v1.0: Merged risk-monitoring + risk-escalation, Step 1 risk monitoring (indicator tracking, status update, new risk identification, alert triggering, response effectiveness tracking), Step 2 escalation handling (necessity judgment, path determination, notification sending, status tracking)
