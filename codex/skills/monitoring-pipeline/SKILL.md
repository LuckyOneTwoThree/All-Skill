---
name: monitoring-pipeline
description: "Use when building a product monitoring and alerting system. End-to-end pipeline from system setup, anomaly detection, dashboard configuration to alert escalation. Keywords: monitoring system, alert rules, monitoring setup, alert configuration, anomaly detection, anomaly alerts, alert classification, monitoring Dashboard, real-time monitoring, visualization, alert escalation, escalation workflow, On-Call, alert notification, incident response."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Monitoring & Alerting"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How to set up a monitoring system"
    - "What metrics need monitoring"
    - "How to configure alert rules"
    - "Too many alerts, how to analyze"
    - "Metrics suddenly anomalous, what happened"
---

# Monitoring & Alerting Full Pipeline AI

## Core Principles

1. **The starting point of monitoring is core paths, not metric stacking**: First identify core business paths, then configure metrics and alerts for those paths, avoiding monitoring everything while missing the critical
2. **Alert rules are a balance between signal and noise**: Too many alerts equals no alerts; every alert must be worth human attention
3. **On-Call runbooks are the last mile of monitoring**: A monitoring system without On-Call runbooks is incomplete; alerts ringing with no one knowing how to handle them equals no monitoring
4. **Alert attribution is a reasoning chain, not a guess**: From confirming authenticity to scoping to correlating events to generating attribution, each step must be evidence-based
5. **Correlation analysis is key to attribution**: Looking at alerts in isolation inevitably leads to misjudgment; other events within the time window must be correlated
6. **Dashboards serve roles, not data**: Different roles focus on different metrics; dashboards must be customized by role
7. **Escalation is protection, not blame-shifting**: The purpose of escalation is to get the right person involved at the right time, not to shirk responsibility

## Interaction Mode

AI AI auto-execution (system configuration type)

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Product Architecture | JSON/File | Yes | User provided | System architecture diagram, component relationships, dependency chains |
| Metrics System | JSON | Yes | output/pm-metrics-design/metrics-system/metric_system.json | Business and technical metric definitions to monitor |
| SLA Requirements | JSON | Yes | User provided | Availability, response time, throughput requirements |
| Existing Monitoring | JSON | No | output/pm-monitoring/monitoring-pipeline/existing-config | Existing monitoring configuration and alert rules |
| Release Info | object | No | output/pm-monitoring/release-gradual/release_status.json | Recent release records |
| Configuration Change Log | object | No | User provided | Configuration modification history |
| Traffic Change Data | object | No | User provided | Traffic trends and anomaly fluctuations |
| Root Cause Knowledge Base | object[] | No | User provided | Historical issue-root cause mappings |
| User Roles | string[] | Yes | User provided | Roles that need Dashboard access |
| Existing Dashboard | JSON | No | output/pm-monitoring/monitoring-pipeline/existing-config | Existing Dashboard configuration (if any) |
| On-Call Schedule | JSON | Yes | On-call management system -> Schedule | On-duty schedule and contact information |
| Knowledge Base | JSON | No | output/pm-monitoring/monitoring-pipeline/knowledge-base | Issue handling guides and historical cases |

## Execution Steps

### Step 1: Monitoring System Setup (from monitoring-system)

**Goal**: Establish core path monitoring system, configure metric collection and alert rules

#### 1.1 Core Path Identification

**Method**:
- Analyze architecture documents to extract service components
- Identify user request main chains
- Map inter-service dependency relationships
- Mark single point of failure risk points

**Output**: Core path inventory, including entry service -> core service -> data layer -> external dependencies

#### 1.2 Metric-Alert Rule Generation

**Metric Types**:
- Golden signals: Latency, Traffic, Errors, Saturation
- Business metrics: Conversion rate, Order volume, DAU/MAU
- Custom metrics: Specific business events

**Alert Rule Configuration**:

| Rule Type | Generation Method | Parameter Source |
|-----------|-------------------|------------------|
| Static threshold | Fixed value + SLA requirements | SLA/SLO definitions |
| Historical baseline | Statistical historical data | 7d/30d mean/stddev |
| Dynamic threshold | Trend analysis + anomaly detection | Prediction interval |
| Composite alert | Multi-metric combination logic | Business rules |

**Alert Parameters**:

```yaml
alert_rule:
  name: {metric_name}_alert
  severity: critical | high | medium | low
  threshold:
    operator: > | < | >= | <=
    value: {threshold_value}
  baseline:
    method: historical | moving_average | seasonal
    window: 7d | 30d | custom
    deviation: {sigma_value}σ
  sensitivity: high | medium | low
  evaluation_interval: {interval}
  for: {duration}
```

#### 1.3 Alert Suppression Rules

**Suppression Strategies**:
- Alert grouping: Aggregate by service/component/time window
- Alert suppression: Parent-child alert relationships, higher priority suppresses lower
- Silence rules: Auto-silence during maintenance windows
- Deduplication rules: Merge identical alert notifications

#### 1.4 On-Call Runbook Generation

**Runbook Contents**:
- Problem description
- Self-check checklist
- Common causes
- Quick fix steps
- Escalation conditions
- Related documentation links

### Step 2: Anomaly Detection (from monitoring-anomaly)

**Goal**: Real-time detection of metric anomalies, identify trend shifts and sudden fluctuations

> **Cross-module boundary note**: After anomaly detection triggers, attribution analysis is delegated to pm-06 analysis-anomaly. This step is only responsible for anomaly identification and alert triggering, and does not duplicate attribution capabilities.

#### 2.1 Alert Classification

**Classification Dimensions**:

| Category | Subcategory | Characteristics |
|----------|-------------|-----------------|
| System Layer | Infrastructure | CPU/Memory/Disk/Network |
| System Layer | Container | Pod/Container restarts/Resource limits |
| System Layer | Middleware | Database/Cache/Message queue |
| Application Layer | Service Response | Timeout/Connection failure/Resource exhaustion |
| Application Layer | Error Exceptions | Exception stacks/Business exceptions |
| Business Layer | Business Metrics | Conversion rate/Order volume/Payment failures |
| Business Layer | User Behavior | DAU anomaly/Feature usage anomaly |
| External Layer | Third-party Services | API timeout/Return errors |
| External Layer | CDN/DNS | Access anomalies/Certificate issues |

**Output**:

```yaml
classification:
  layer: system | application | business | external
  category: {specific_category}
  confidence: 0.0-1.0
  related_alerts: [alert_ids]
```

#### 2.2 Correlation Analysis

**Analysis Methods**:
- Time window correlation (alerts close in time)
- Service topology correlation (same service chain)
- Metric fluctuation correlation (anomalies occurring simultaneously)
- Change event correlation (triggered after release/configuration change)

**Output**:

```yaml
correlation:
  is_correlated: true | false
  correlation_type: time | topology | metrics | change
  related_alerts: [alert_ids]
  correlation_score: 0.0-1.0
  root_alert: {alert_id} | null
```

#### 2.3 Root Cause Localization (5 Why)

**Analysis Methods**:
- Common root cause pattern matching based on alert type
- Time-series analysis based on change events
- Upstream tracing based on dependency topology
- Historical case matching based on knowledge base

**5 Why Output Format**:

```yaml
root_cause:
  why_chain:
    - question: "Why {phenomenon}?"
      answer: "{direct_cause}"
      evidence: "{evidence}"
    # ... same structure extensible
  root_cause_summary: "{one-line root cause description}"
  root_cause_category: {category}
  confidence: 0.0-1.0
```

#### 2.4 Impact Assessment

**Assessment Dimensions**:

| Dimension | Metric |
|-----------|--------|
| User Impact | Affected user count/percentage |
| Feature Impact | Core feature availability |
| Business Impact | Conversion rate/Order volume loss |
| Revenue Impact | Estimated GMV loss |
| Reputation Impact | Complaint count/Public sentiment |

**Output**:

```yaml
impact_scope:
  level: critical | major | minor | negligible
  affected_users:
    count: {number}
    percentage: {percentage}
  affected_features:
    - feature_name: {name}
      availability: {percentage}
  business_metrics:
    - metric: {name}
      impact: {value}
      duration: {time}
  revenue_impact:
    estimated_loss: {amount}
    confidence: {percentage}
```

#### 2.5 Remediation Suggestions

**Suggestion Types**:

| Root Cause Type | Suggestion Template |
|-----------------|---------------------|
| Insufficient resources | Scaling/Resource adjustment plan |
| Code issue | Rollback/Hotfix plan |
| Configuration error | Configuration correction steps |
| Dependency failure | Switch/Degradation plan |
| Traffic anomaly | Rate limiting/Circuit breaker configuration |

**Output**:

```yaml
remediation:
  immediate_actions:
    - step: {description}
      command: {command} | {ui_action}
      automated: true | false
      rollback_command: {command}
  long_term_fixes:
    - description: {description}
      priority: P0-P3
      effort: {story_points}
  estimated_resolution_time: {minutes}
```

### Step 3: Dashboard Configuration (from monitoring-dashboard)

**Goal**: Build visual monitoring dashboards, aggregate key metrics and alert status

#### 3.1 Role Perspective Determination

**Role Categories**:

| Role | Focus | Refresh Rate | Detail Level |
|------|-------|--------------|--------------|
| Executive | Business health, overall status | Low | Summary |
| Product Owner | Feature status, user metrics | Medium | Overview |
| Engineering Lead | System status, alerts | High | Detailed |
| On-Call Engineer | Current alerts, issue diagnosis | Real-time | Detailed |
| Business Analyst | Business metrics, conversion funnel | Medium | Business |

**Role Requirements Mapping**:

```yaml
role_requirements:
  - role: executive
    focus_areas:
      - business_health
      # ... same structure extensible
    alert_preference: critical_only
    refresh_rate: 15m
  # ... same structure extensible
```

#### 3.2 Core Metric Grouping

**Grouping Strategy**:

| Group Type | Description | Example |
|------------|-------------|---------|
| Business View | Core business metrics | Order volume, Conversion rate, DAU |
| Technical View | System technical metrics | CPU, Memory, Latency |
| Alert View | Current alerts and events | Active alerts, Historical events |
| Service View | Grouped by service/component | User service, Order service |

**Metric Grouping Output**:

```yaml
metric_groups:
  - group_id: GRP-001
    group_name: {name}
    role: {role}
    metrics:
      - metric_name: api_response_time_p95
        data_source: apm
        visualization: time_series
      # ... same structure extensible
    priority: high | medium | low
    refresh_interval: {minutes}
```

#### 3.3 Visualization Component Selection

**Component Types**:

| Component Type | Applicable Metrics | Features |
|----------------|-------------------|----------|
| Time Series | Trend metrics | Shows changes over time |
| Gauge | Status metrics | Shows current value/target |
| Stat | Single value | Quick overview |
| Table | List data | Detailed data display |
| Alert List | Alert data | Real-time alert status |
| Heatmap | Distribution metrics | Shows distribution patterns |

**Component Configuration**:

```yaml
widget_config:
  - widget_id: WDG-001
    widget_type: time_series | gauge | stat | table | alert_list | heatmap
    title: {title}
    metrics:
      - name: {metric_name}
        aggregation: avg | sum | max | min
    visualization:
      color_scheme: green_yellow_red | blue | custom
      thresholds:
        warning: {value}
        critical: {value}
      time_range: 1h | 6h | 24h | 7d | custom
    layout:
      width: 1 | 2 | 4 | 6 | 12
      height: 1 | 2 | 3
      position: {row}_{column}
```

#### 3.4 Dashboard Template Generation

**Template Structure**:

```yaml
dashboard_template:
  - dashboard_id: DASH-001
    role: executive
    title: Business Overview
    description: Executive business health view
    widgets:
      - widget_id: WDG-001
        widget_type: stat
        title: Today's Orders
        metrics:
          - name: daily_orders
            data_source: business_db
        layout:
          width: 3
          height: 1
      # ... same structure extensible
    filters:
      - filter_type: time_range
        default: 7d
      # ... same structure extensible
    refresh_interval: 15m
```

### Step 4: Alert Escalation (from monitoring-escalation)

**Goal**: Alert severity classification and escalation handling, ensuring critical alerts reach responsible parties in time

#### 4.1 Auto Classification

**Classification Model**:

```yaml
alert_severity:
  critical:
    criteria:
      - service_availability < 99%
      - error_rate > 5%
      - response_time_p99 > 5000ms
      - affected_users > 10000
    response_time_sla: 5 minutes
  high:
    criteria:
      - service_availability < 99.5%
      - error_rate > 1%
      - response_time_p99 > 2000ms
      - affected_users > 1000
    response_time_sla: 15 minutes
  medium:
    criteria:
      - service_availability < 99.9%
      - error_rate > 0.5%
      - response_time_p99 > 1000ms
    response_time_sla: 1 hour
  low:
    criteria:
      - non_functional_metrics
      - warning_thresholds
    response_time_sla: next_business_day
```

**Classification Output**:

```yaml
alert_classification:
  alert_id: {id}
  original_severity: {level}
  assessed_severity: {level}
  confidence: {percentage}
  factors:
    - factor: service_impact
      contribution: {value}
    # ... same structure extensible
  adjusted: true | false
  adjustment_reason: {reason}
```

#### 4.2 Escalation Chain Trigger

**Escalation Rules**:

```yaml
escalation_rules:
  - rule_id: ESC-001
    trigger:
      severity: critical
      duration: 5 minutes
      not_acknowledged: true
    escalation_chain:
      - level: 1
        recipients: [oncall_primary]
        notification_channels: [sms, call, slack]
      # ... same structure extensible
  # ... same structure extensible
```

**Escalation Execution Output**:

```yaml
escalation_chain:
  alert_id: {id}
  current_level: 1
  escalation_history:
    - timestamp: {ISO8601}
      level: 1
      action: initial_notification
      recipients: [{name}]
      status: sent | delivered | acknowledged
  next_escalation:
    timestamp: {ISO8601}
    level: 2
    trigger_reason: {reason}
```

#### 4.3 Notification Delivery

**Notification Channels**:

| Channel | Applicable Severity | Content Format |
|---------|---------------------|----------------|
| SMS | Critical, High | Brief summary + link |
| Phone Call | Critical | Voice broadcast + confirmation |
| Slack | All | Detailed card + actions |
| Email | Medium, Low | Full report |
| PagerDuty | All | Standard format |

**Notification Template**:

```yaml
notification:
  channels:
    - channel: sms
      content: |
        [CRITICAL] {service_name}
        {alert_summary}
        Details: {link}
    # ... same structure extensible
```

**Delivery Status**:

```yaml
notification_status:
  alert_id: {id}
  notifications:
    - channel: sms
      recipient: {phone}
      status: sent | delivered | failed
      sent_at: {ISO8601}
    # ... same structure extensible
  acknowledgment:
    required: true | false
    acknowledged_by: {name}
    acknowledged_at: {ISO8601}
```

#### 4.4 On-Call Report

**Report Contents**:

```yaml
oncall_report:
  period:
    start: {ISO8601}
    end: {ISO8601}
  oncall_engineer:
    name: {name}
    primary: {true | false}
  summary:
    total_alerts: {count}
    critical: {count}
    high: {count}
    medium: {count}
    low: {count}
  response_metrics:
    average_acknowledgment_time: {minutes}
    average_resolution_time: {minutes}
    sla_compliance: {percentage}
  top_alerts:
    - alert_id: {id}
      severity: {level}
      title: {title}
      acknowledged_at: {ISO8601}
      resolved_at: {ISO8601}
  unresolved_alerts:
    - alert_id: {id}
      severity: {level}
      reason: {reason}
  action_items:
    - description: {description}
      owner: {name}
      deadline: {date}
```

## Output


**Output file path**: `output/pm-monitoring/monitoring-pipeline/`
**Output Schema**:

```json
{
  "type": "object",
  "required": ["metrics", "alert_id", "classification", "root_cause", "impact_scope", "dashboards", "report_id", "alerts", "oncall_schedule"],
  "properties": {
    "metrics": {"type": "array", "description": "Monitoring metric configuration list, including name, category, threshold and baseline"},
    "alert_policies": {"type": "object", "description": "Alert policy configuration"},
    "suppression_rules": {"type": "object", "description": "Suppression rule configuration"},
    "alert_id": {"type": "string", "description": "Alert ID"},
    "timestamp": {"type": "string", "description": "Alert time"},
    "classification": {"type": "object", "description": "Alert classification, including layer, category and confidence"},
    "root_cause": {"type": "object", "description": "Root cause analysis, including 5Why chain and summary"},
    "impact_scope": {"type": "object", "description": "Impact scope, including level, affected users and features"},
    "remediation": {"type": "object", "description": "Remediation suggestions, including immediate action list"},
    "needs_human_escalation": {"type": "boolean", "description": "Whether human escalation is needed"},
    "dashboards": {"type": "array", "description": "Dashboard configuration list, including role, title and components"},
    "report_id": {"type": "string", "description": "Report unique identifier"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "alerts": {"type": "array", "description": "Alert list, including severity, escalation level and executed actions"},
    "oncall_schedule": {"type": "object", "description": "On-call arrangement, including current and next on-call information"},
    "oncall_reports": {"type": "array", "description": "On-call reports, including alert count, SLA compliance rate and average resolution time"}
  }
}
```

```
├── monitoring-pipeline.json
├── monitoring-pipeline.md
├── core_paths.md
├── metrics/
│   ├── availability/
│   │   └── alert_rule.yaml
│   ├── latency/
│   │   └── alert_rule.yaml
│   ├── error_rate/
│   │   └── alert_rule.yaml
│   └── [custom_metrics]/
│       └── alert_rule.yaml
├── alert_policies.yaml
├── suppression_rules.yaml
├── oncall_handbook.md
├── anomaly/
│   ├── {alert_id}/
│   │   ├── classification.md
│   │   ├── correlation.md
│   │   ├── root_cause.md
│   │   ├── impact_assessment.md
│   │   ├── remediation.md
│   │   └── needs_human_escalation.yaml
│   └── escalation_queue.md
├── dashboards/
│   ├── {role}/
│   │   └── {dashboard_name}.yaml
│   ├── shared/
│   │   ├── alert_dashboard.yaml
│   │   └── system_health_dashboard.yaml
│   └── templates/
│       └── dashboard_template.yaml
├── escalation/
│   ├── alerts/
│   │   └── {date}/
│   │       ├── {alert_id}/
│   │       │   ├── severity.yaml
│   │       │   ├── escalation_chain.yaml
│   │       │   └── notification_status.yaml
│   │       └── escalation_summary.yaml
│   ├── oncall_schedule/
│   │   └── {week}.yaml
│   └── oncall_reports/
│       └── {date}.yaml
```

## Decision Rules

| Scenario | Decision Rule |
|----------|---------------|
| Metric coverage <80% | Mark warning, prompt to supplement metrics, list missing core metrics |
| Metric coverage 80%-95% | Mark notice, suggest supplementing non-core metrics |
| Threshold conflict (same metric >=2 alert rules) | Keep rule with highest severity, mark others as duplicate and disable |
| Insufficient baseline data (<7 days historical data) | Use static threshold as fallback, mark "data supplement needed, auto-switch to dynamic baseline after 7 days" |
| New service | Auto-inherit basic alert template (CPU>=80%, Memory>=85%, Error rate>=1%), prompt for specialized configuration |
| P0 service alert missing | Force supplement golden signal alerts, cannot skip |
| Alert noise rate >=15% | Auto-tighten thresholds by 10%, mark for human review |
| Alert storm (>=5 alerts/5 minutes) | Merge into single alert, mark primary cause, suppress correlated alerts |
| Root cause uncertain (>=3 candidate causes) | Mark for human investigation, output Top3 candidate causes with confidence |
| Impact scope expanding (affected user growth >=20%/10 minutes) | Auto-escalate severity by 1 level (max P0) |
| Impact scope expanding (affected user growth 5%-20%/10 minutes) | Auto-escalate severity by 1 level |
| Knowledge base hit (similarity >=0.85) | Output historical solution, note confidence |
| Knowledge base hit (similarity 0.6-0.85) | Output historical solution, note "human confirmation of applicability needed" |
| No historical cases | Output 5 Why inquiry chain, await feedback |
| P0 anomaly recovered | Auto-trigger post-incident review, generate review report within 24 hours |
| Too many metrics | Auto-group, collapse low priority |
| Too many alerts | Show only unresolved alerts |
| Slow page load | Lazy load low priority components |
| Role change | Auto-adjust metric configuration |
| No metric data | Display "No Data" status |
| Critical without ACK | Escalate to L2 after 5 minutes |
| Repeated identical alerts | Merge notifications, avoid bombardment |
| On-Call no response | Escalate to Manager |
| High false positive rate | Feedback-adjust thresholds |
| Escalation timeout | Auto-notify emergency contact |

## Quality Checks

- [ ] Core path coverage >= 95%
- [ ] Each core path has at least 4 golden signals
- [ ] Alert noise rate < 15%
- [ ] All P0 services have On-Call runbooks
- [ ] No conflicts or omissions in alert rules
- [ ] SLA requirements supported by corresponding metrics
- [ ] Alert classification accuracy >= 85%
- [ ] Root cause localization accuracy >= 80%
- [ ] 5 Why chain complete (3-5 levels)
- [ ] Remediation suggestions actionable
- [ ] No omissions in escalation markings
- [ ] MTTR reduction target achieved
- [ ] All roles have corresponding Dashboards
- [ ] Core metric coverage >= 90%
- [ ] Visualization component selection reasonable
- [ ] Layout aesthetically pleasing, clear hierarchy
- [ ] Alert configuration correct
- [ ] Refresh rate meets role needs
- [ ] Alert severity classification accuracy >= 90%
- [ ] Escalation trigger timeliness 100%
- [ ] Notification delivery rate >= 99%
- [ ] SLA response time compliant
- [ ] On-call report completeness 100%
- [ ] Escalation chain configuration correct

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|------------------|---------------|
| Metrics system | User provides core business metric list, supplement golden signals based on generic metric template | Basic monitoring metric configuration, lacking metrics system support |
| Product architecture | User provides service component list, infer dependencies based on generic microservice architecture | Basic core path inventory, dependencies are inferred |
| SLA requirements | User provides key service availability targets, adopt industry default thresholds (99.9%/99.5%/99%) | Alert rules based on default thresholds |
| Existing monitoring | Skip compatibility check, generate monitoring configuration from scratch | Brand new monitoring configuration |
| Release info | Skip change correlation analysis, mark in attribution "cannot exclude change factors" | Attribution results excluding change correlation |
| Configuration change log | Skip configuration change correlation, mark in attribution "cannot exclude configuration change factors" | Attribution results excluding configuration correlation |
| Traffic change data | Skip traffic analysis dimension, mark traffic data missing in impact assessment | Analysis results lacking traffic dimension |
| Root cause knowledge base | 5 Why analysis relies entirely on logical reasoning, cannot provide historical reference solutions | Pure reasoning attribution results, no historical case reference |
| User roles | Use default role template (Executive/Engineering/On-Call), user adjusts later | Generic role Dashboard template |
| Existing Dashboard | Generate Dashboard configuration from scratch, mark potential conflicts with existing configuration | Brand new Dashboard configuration |
| On-Call schedule | User provides current on-call personnel contact information, AI configures escalation chain accordingly | Escalation chain based on user input |
| Alert rules | Use default escalation rules (Critical 5min/High 15min/Medium 1h), mark for human confirmation | Escalation configuration based on default rules |
| Knowledge base | Escalation suggestions do not include historical case references, mark "no historical cases" | Escalation suggestions without historical reference |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Metrics system missing**: Ask user to provide core business metric list (e.g., order volume, conversion rate, DAU, etc.), AI will auto-supplement generic golden signals (latency, traffic, error rate, saturation) based on product type
2. **Product architecture missing**: Ask user to provide service component list or system name list, AI will infer service dependencies based on generic architecture patterns, and mark inferred items for human confirmation in output
3. **SLA requirements missing**: Ask user to provide key service availability targets (e.g., "payment service needs 99.9% availability"), unspecified services use industry default standards, mark default values in output for human review
4. **Alert data missing**: Ask user to describe anomaly symptoms, including: symptom manifestation, occurrence time, affected services/features, impact scope (user count/feature points), AI will perform attribution analysis based on description
5. **Context data missing** (release/configuration change/traffic change): AI will explicitly mark factors that cannot be excluded in attribution analysis, recommend human investigation of these dimensions
6. **Root cause knowledge base missing**: AI will rely entirely on 5 Why logical reasoning for attribution, mark "no historical case reference" in output, recommend human verification of attribution conclusions
7. **User roles missing**: Use default role template to generate Dashboard, including Executive overview, Engineering details, On-Call real-time three standard views, user can adjust based on actual role needs
8. **On-Call schedule missing**: Ask user to provide current on-call personnel names and contact information (phone/Slack/email), AI will configure escalation notification chain accordingly
9. **Alert rules missing**: Use default escalation rule template (Critical->5min->L1/L2/L3, High->15min->L1/L2), mark default rules in output for human review and confirmation

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| core_paths | array | Yes | Core path list, at least 1 path |
| core_paths[].path_name | string | Yes | Path name |
| metrics | object | Yes | Monitoring metric configuration, grouped by path |
| alert_policies | array | Yes | Alert policy list, at least 1 rule |
| suppression_rules | array | No | Suppression rule list |
| oncall_handbook | object | No | On-Call runbook, must contain escalation_paths/emergency_procedures |
| classification | object | Yes | Alert classification, must contain alert_type/severity/service |
| classification.severity | string | Yes | Severity, only P0/P1/P2/P3 allowed |
| root_cause | object | Yes | Root cause analysis, must contain 5_whys and conclusion |
| root_cause.5_whys | array | Yes | 5 Why chain, 3-5 levels |
| impact_assessment | object | No | Impact assessment, must contain affected_users/affected_services |
| remediation | object | No | Remediation suggestions, must contain immediate_actions/long_term_fixes |
| dashboard_config | object | Yes | Dashboard configuration, must contain role/panels |
| dashboard_config.role | string | Yes | Role name |
| dashboard_config.panels | array | Yes | Panel list, at least 1 panel |
| shared_views | object | No | Shared view configuration |
| templates | array | No | Template list |
| alert_classification | object | Yes | Alert classification, must contain alert_id/severity/category |
| alert_classification.severity | string | Yes | Severity, only Critical/High/Medium/Low allowed |
| escalation_chain | array | Yes | Escalation chain, at least 1 level |
| notification_records | array | No | Notification records, each must contain channel/recipient/status |
| oncall_report | object | No | On-call report, must contain total_alerts/resolved_count |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|-----------------|-------------|--------------|-----------------|
| metrics-system | Metric definition change | Monitoring metric configuration and alert rules | Update metric mapping and alert thresholds |
| User provided - Product architecture | Architecture change | Core paths and service dependencies | Re-identify core paths and dependency chains |
| User provided - SLA | SLA target change | Alert thresholds and classification standards | Adjust alert rules and escalation conditions |
| release-gradual | Release record update | Change correlation analysis | Update correlated events and attribution |
| Root cause knowledge base | Historical case update | Root cause matching and suggestions | Update reference case library |
| User provided - Roles | Role requirement change | Dashboard layering and panel layout | Redesign role views |
| On-call management system | Schedule change | Notification recipients and escalation chain | Update On-Call schedule and notification configuration |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|---------------------|------------------------|---------------------|----------------------|
| monitoring-orchestrator | Monitoring & alerting full workflow completed | Output file update | Build completion status and key configuration |
| iteration-decision | P0 alert triggered | Write to output file | Emergency alert and escalation details |
