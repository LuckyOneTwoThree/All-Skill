---
name: monitoring-pipeline
description: Use when building a product monitoring and alerting system. End-to-end automated monitoring pipeline construction, from monitoring system setup, anomaly detection, dashboard configuration to alert escalation. Keywords: monitoring system, monitoring configuration, health check, alert rules, monitoring framework, monitoring setup, alert configuration, set up monitoring, configure alerts, anomaly detection, anomaly alerting, alert severity, metric anomaly, monitoring Dashboard, data dashboard, real-time monitoring, visualization, alert escalation, escalation process, On-Call, alert notification, incident response, on-duty.
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Monitoring & Alerting"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "How to set up a monitoring system"
    - "What metrics need monitoring"
    - "How to configure alert rules"
    - "Too many alerts, how to analyze"
    - "Metrics suddenly anomalous, what happened"
    - "Help me build a monitoring dashboard"
    - "How to define alert escalation process"
    - "How to arrange on-call schedule"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Only output core path monitoring + basic alert rules"
  deep_description: "Complete system + capacity planning + chaos engineering plan + SRE maturity assessment"
---

# Monitoring & Alerting Pipeline 🤖

## Core Principles

1. **The starting point of a monitoring system is core paths, not metric stacking**: First identify core business paths, then configure metrics and alerts for those paths. Avoid monitoring everything yet missing what matters
2. **Alert rules are a balance of signal and noise**: Too many alerts equals no alerts. Every alert must be worth human attention
3. **On-Call runbooks are the last mile of a monitoring system**: A monitoring system without On-Call runbooks is incomplete. Alerts firing with no one knowing how to respond equals no monitoring
4. **Alert attribution is a reasoning chain, not a guess**: From confirming authenticity to narrowing scope to correlating events to generating attribution, every step must be supported by evidence
5. **Correlation analysis is key to attribution**: Looking at alerts in isolation inevitably leads to misjudgment. Other events within the time window must be correlated
6. **Dashboards serve roles, not data**: Different roles focus on different metrics. Dashboards must be customized by role
7. **Escalation is protection, not passing the buck**: The purpose of escalation is to get the right people involved at the right time, not to shirk responsibility

## Interaction Mode

🤖 AI Auto-Execute (System Configuration Type)

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Product Architecture | JSON/File | Yes | User provided | System architecture diagram, component relationships, dependency chains |
| Metrics System | JSON | Yes | output/pm-metrics-design/metrics-system/metric_system.json | Business and technical metric definitions to monitor |
| SLA Requirements | JSON | Yes | User provided | Availability, response time, throughput requirements |
| Existing Monitoring | JSON | No | output/pm-monitoring/monitoring-pipeline/existing_config | Existing monitoring configurations and alert rules |
| Release Information | object | No | output/pm-monitoring/release-gradual/release_status.json | Recent release records |
| Configuration Change Records | object | No | User provided | Configuration modification history |
| Traffic Change Data | object | No | User provided | Traffic trends and anomalous fluctuations |
| Root Cause Knowledge Base | object[] | No | User provided | Historical problem-to-root-cause mappings |
| User Roles | string[] | Yes | User provided | Roles that need Dashboard access |
| Existing Dashboards | JSON | No | output/pm-monitoring/monitoring-pipeline/existing_config | Existing Dashboard configurations (if any) |
| On-Call Schedule | JSON | Yes | On-Call Management System → Schedule | On-duty schedule and contact information |
| Knowledge Base | JSON | No | output/pm-monitoring/monitoring-pipeline/knowledge_base | Issue handling guides and historical cases |

## Execution Steps

### Step 1: Monitoring System Setup [Core] (from monitoring-system)

**Objective**: Establish a core path monitoring system, configure metric collection and alert rules

#### 1.1 Core Path Identification [Core]

**Method**:
- Analyze architecture documents to extract service components
- Identify user request main paths
- Map inter-service dependency relationships
- Mark single point of failure risk points

**Output**: Core path inventory, including entry services → core services → data layer → external dependencies

#### 1.2 Metric-Alert Rule Generation [Core]

**Metric Types**:
- Golden Signals: latency, traffic, errors, saturation
- Business Metrics: conversion rate, order volume, DAU/MAU
- Custom Metrics: specific business events

**Alert Rule Configuration**:

| Rule Type | Generation Method | Parameter Source |
|----------|----------|----------|
| Static Threshold | Fixed value + SLA requirements | SLA/SLO definitions |
| Historical Baseline | Statistical historical data | 7d/30d mean/standard deviation |
| Dynamic Threshold | Trend analysis + anomaly detection | Prediction interval |
| Composite Alert | Multi-metric combination logic | Business rules |

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

#### 1.3 Alert Deduplication Rules [Conditional]

**Deduplication Strategies**:
- Alert Grouping: Aggregate by service/component/time window
- Alert Suppression: Parent-child alert relationships, high priority suppresses low priority
- Silence Rules: Auto-silence during maintenance windows
- Dedup Rules: Merge duplicate alert notifications

#### 1.4 On-Call Runbook Generation [Deep]

**Runbook Content**:
- Problem description
- Self-check checklist
- Common causes
- Quick fix steps
- Escalation conditions
- Related document links

### Step 2: Anomaly Detection [Conditional] (from monitoring-anomaly)

**Objective**: Real-time detection of metric anomalies, identify trend shifts and sudden fluctuations

> **Cross-module boundary note**: After anomaly detection is triggered, attribution analysis is delegated to pm-06 analysis-anomaly. This step is only responsible for anomaly identification and alert triggering, and does not re-implement attribution capabilities.

#### 2.1 Alert Classification [Conditional]

**Classification Dimensions**:

| Category | Subcategory | Characteristics |
|------|------|------|
| System Layer | Infrastructure | CPU/Memory/Disk/Network |
| System Layer | Container | Pod/Container restarts/Resource limits |
| System Layer | Middleware | Database/Cache/Message Queue |
| Application Layer | Service Response | Timeout/Connection failure/Resource exhaustion |
| Application Layer | Error Exceptions | Exception stacks/Business exceptions |
| Business Layer | Business Metrics | Conversion rate/Order volume/Payment failures |
| Business Layer | User Behavior | DAU anomaly/Feature usage anomaly |
| External Layer | Third-party Services | API timeout/Error responses |
| External Layer | CDN/DNS | Access anomalies/Certificate issues |

**Output**:

```yaml
classification:
  layer: system | application | business | external
  category: {specific_category}
  confidence: 0.0-1.0
  related_alerts: [alert_ids]
```

#### 2.2 Correlation Analysis [Conditional]

**Analysis Methods**:
- Time window correlation (alerts close in time)
- Service topology correlation (same service chain)
- Metric fluctuation correlation (anomalies occurring simultaneously)
- Change event correlation (triggered after release/config change)

**Output**:

```yaml
correlation:
  is_correlated: true | false
  correlation_type: time | topology | metrics | change
  related_alerts: [alert_ids]
  correlation_score: 0.0-1.0
  root_alert: {alert_id} | null
```

#### 2.3 Root Cause Localization [Deep] (5 Why)

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

#### 2.4 Impact Assessment [Conditional]

**Assessment Dimensions**:

| Dimension | Metric |
|------|------|
| User Impact | Number/percentage of affected users |
| Feature Impact | Core feature availability |
| Business Impact | Conversion rate/Order volume loss |
| Revenue Impact | Estimated GMV loss |
| Reputation Impact | Customer complaint count/Public sentiment |

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

#### 2.5 Remediation Suggestions [Conditional]

**Suggestion Types**:

| Root Cause Type | Suggestion Template |
|----------|----------|
| Resource Insufficiency | Scale-out/Resource adjustment plan |
| Code Issue | Rollback/Hotfix plan |
| Configuration Error | Configuration correction steps |
| Dependency Failure | Switch/Degradation plan |
| Traffic Anomaly | Rate limiting/Circuit breaker configuration |

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

### Step 3: Dashboard Configuration [Conditional] (from monitoring-dashboard)

**Objective**: Build visual monitoring dashboards, aggregate key metrics and alert status

#### 3.1 Role Perspective Determination [Conditional]

**Role Categories**:

| Role | Focus Areas | Refresh Rate | Detail Level |
|------|--------|----------|----------|
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

#### 3.2 Core Metric Grouping [Conditional]

**Grouping Strategy**:

| Group Type | Description | Example |
|----------|------|------|
| Business View | Core business metrics | Order volume, conversion rate, DAU |
| Technical View | System technical metrics | CPU, memory, latency |
| Alert View | Current alerts and events | Active alerts, historical events |
| Service View | Grouped by service/component | User service, order service |

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

#### 3.3 Visualization Component Selection [Deep]

**Component Types**:

| Component Type | Applicable Metrics | Characteristics |
|----------|----------|------|
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

#### 3.4 Dashboard Template Generation [Deep]

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
        title: Today's Order Volume
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

### Step 4: Alert Escalation [Conditional] (from monitoring-escalation)

**Objective**: Alert severity classification and escalation handling, ensuring critical alerts reach responsible parties in time

#### 4.1 Auto-Classification [Conditional]

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

#### 4.2 Escalation Chain Trigger [Conditional]

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

#### 4.3 Notification Delivery [Conditional]

**Notification Channels**:

| Channel | Applicable Severity | Content Format |
|------|----------|----------|
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

#### 4.4 On-Call Report [Deep]

**Report Content**:

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


**Output File Path**: `output/pm-monitoring/monitoring-pipeline/`

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Core path monitoring + basic alert rules | Core conclusions + minimum viable output, only Step 1.1-1.2 core paths and alert rules |
| standard | Complete monitoring system (current default) | Complete output, including all Step 1-4 outputs |
| deep | Complete system + extended analysis | Complete output + capacity planning + chaos engineering plan + SRE maturity assessment + decision records + risk assessment |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["metrics", "alert_id", "classification", "root_cause", "impact_scope", "dashboards", "report_id", "alerts", "oncall_schedule"],
  "properties": {
    "metrics": {"type": "array", "description": "Monitoring metric configuration list, including name, category, threshold and baseline"},
    "alert_policies": {"type": "object", "description": "Alert policy configuration"},
    "suppression_rules": {"type": "object", "description": "Deduplication rule configuration"},
    "alert_id": {"type": "string", "description": "Alert ID"},
    "timestamp": {"type": "string", "description": "Alert timestamp"},
    "classification": {"type": "object", "description": "Alert classification, including layer, category and confidence"},
    "root_cause": {"type": "object", "description": "Root cause analysis, including 5Why chain and summary"},
    "impact_scope": {"type": "object", "description": "Impact scope, including level, affected users and features"},
    "remediation": {"type": "object", "description": "Remediation suggestions, including immediate action list"},
    "needs_human_escalation": {"type": "boolean", "description": "Whether human escalation is needed"},
    "dashboards": {"type": "array", "description": "Dashboard configuration list, including role, title and widgets"},
    "report_id": {"type": "string", "description": "Report unique identifier"},
    "generated_at": {"type": "string", "description": "Generation timestamp"},
    "alerts": {"type": "array", "description": "Alert list, including severity, escalation level and executed actions"},
    "oncall_schedule": {"type": "object", "description": "On-call schedule, including current and next rotation info"},
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
│   └── codex-templates/
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
|------|----------|
| Metric coverage < 80% | Flag warning, prompt to supplement metrics, list missing core metrics |
| Metric coverage 80%-95% | Flag notice, suggest supplementing non-core metrics |
| Threshold conflict (same metric ≥ 2 alert rules) | Keep the rule with highest severity, mark others as duplicate and disable |
| Insufficient baseline data (< 7 days historical data) | Use static threshold as fallback, mark "needs data supplementation, auto-switch to dynamic baseline after 7 days" |
| New service added | Auto-inherit basic alert template (CPU≥80%, Memory≥85%, Error rate≥1%), prompt for specialized configuration |
| P0 service alert missing | Force supplement golden signal alerts, cannot skip |
| Alert noise rate ≥ 15% | Auto-tighten threshold by 10%, mark for human review |
| Alert storm (≥ 5 alerts/5 minutes) | Merge into single alert, mark primary cause, suppress correlated alerts |
| Root cause uncertain (≥ 3 candidate causes) | Mark for human investigation, output Top 3 candidate causes with confidence |
| Impact scope expanding (affected users growing ≥ 20%/10 minutes) | Auto-escalate severity by 1 level (max P0) |
| Impact scope expanding (affected users growing 5%-20%/10 minutes) | Auto-escalate severity by 1 level |
| Knowledge base hit (similarity ≥ 0.85) | Output historical solution, annotate confidence |
| Knowledge base hit (similarity 0.6-0.85) | Output historical solution, annotate "needs human confirmation of applicability" |
| No historical cases | Output 5 Why inquiry chain, await feedback |
| After P0 anomaly recovery | Auto-trigger post-incident review, generate review report within 24 hours |
| Too many metrics | Auto-group, collapse low priority |
| Too many alerts | Show only unresolved alerts |
| Slow page load | Lazy load low priority components |
| Role change | Auto-adjust metric configuration |
| No metric data | Display "No Data" status |
| Critical without ACK | Escalate to L2 after 5 minutes |
| Repeated identical alerts | Merge notifications, avoid alert fatigue |
| No On-Call response | Escalate to Manager |
| High false positive rate | Feedback to adjust threshold |
| Escalation timeout | Auto-notify emergency contact |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Core path coverage ≥ 95%
- [ ] Each core path has at least 4 golden signals
- [ ] No conflicting or missing alert rules
- [ ] SLA requirements have corresponding metric support

### P1 Checks (must pass for standard/deep)

- [ ] Alert noise rate < 15%
- [ ] All P0 services have On-Call runbooks
- [ ] Alert classification accuracy ≥ 85%
- [ ] Remediation suggestions are actionable
- [ ] No missing escalation tags
- [ ] All roles have corresponding Dashboards
- [ ] Core metric coverage ≥ 90%
- [ ] Alert configuration is correct
- [ ] Alert severity classification accuracy ≥ 90%
- [ ] Escalation trigger timeliness 100%
- [ ] Notification delivery rate ≥ 99%
- [ ] SLA response time meets target
- [ ] Escalation chain configuration is correct

### P2 Checks (must pass for deep only)

- [ ] Root cause localization accuracy ≥ 80%
- [ ] 5 Why chain is complete (3-5 levels)
- [ ] MTTR reduction target achieved
- [ ] Visualization component selection is reasonable
- [ ] Layout is aesthetically pleasing with clear hierarchy
- [ ] Refresh rate matches role requirements
- [ ] On-call report completeness rate 100%
- [ ] Capacity planning output provided (resource utilization forecast, scale-out thresholds, capacity redundancy assessment)
- [ ] Chaos engineering plan generated (fault injection scenarios, blast radius assessment, recovery verification plan)
- [ ] SRE maturity assessment completed (five-dimensional scoring across monitoring/alerting/response/postmortem/automation)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Metrics System | User provides core business metric list, supplement golden signals based on generic metric template | Basic monitoring metric configuration, lacking metrics system support |
| Product Architecture | User provides service component list, infer dependencies based on generic microservice architecture | Basic core path inventory, dependencies are inferred |
| SLA Requirements | User provides availability targets for key services, adopt industry default thresholds (99.9%/99.5%/99%) | Alert rules based on default thresholds |
| Existing Monitoring | Skip compatibility check, generate monitoring config from scratch | Brand new monitoring configuration |
| Release Information | Skip change correlation analysis, annotate in attribution "cannot exclude change factors" | Attribution results excluding change correlation |
| Configuration Change Records | Skip config change correlation, annotate in attribution "cannot exclude configuration change factors" | Attribution results excluding config correlation |
| Traffic Change Data | Skip traffic analysis dimension, annotate missing traffic data in impact assessment | Analysis results missing traffic dimension |
| Root Cause Knowledge Base | 5 Why analysis relies entirely on logical reasoning, cannot provide historical reference solutions | Pure reasoning attribution results, no historical case reference |
| User Roles | Use default role template (Executive/Engineering/On-Call), user adjusts later | Generic role Dashboard template |
| Existing Dashboards | Generate Dashboard config from scratch, annotate potential conflicts with existing config | Brand new Dashboard configuration |
| On-Call Schedule | User provides current on-duty personnel contact info, AI configures escalation chain accordingly | Escalation chain based on user input |
| Alert Rules | Use default escalation rules (Critical 5min/High 15min/Medium 1h), annotate for human confirmation | Escalation configuration based on default rules |
| Knowledge Base | Escalation suggestions do not include historical case references, annotate "no historical cases" | Escalation suggestions without historical reference |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Metrics System Missing**: Ask user to provide core business metric list (e.g., order volume, conversion rate, DAU, etc.), AI will auto-supplement generic golden signals (latency, traffic, error rate, saturation) based on product type
2. **Product Architecture Missing**: Ask user to provide service component list or system name list, AI will infer service dependency relationships based on generic architecture patterns, and annotate inferred items for human confirmation in output
3. **SLA Requirements Missing**: Ask user to provide availability targets for key services (e.g., "payment service needs 99.9% availability"), unspecified services adopt industry default standards, annotate default values for human review in output
4. **Alert Data Missing**: Ask user to describe anomaly symptoms, including: symptom manifestation, occurrence time, affected services/features, impact scope (user count/feature points), AI will perform attribution analysis based on description
5. **Context Data Missing** (release/config change/traffic change): AI will explicitly annotate factors that cannot be excluded in attribution analysis, suggest human investigation of these dimensions
6. **Root Cause Knowledge Base Missing**: AI will rely entirely on 5 Why logical reasoning for attribution, annotate "no historical case reference" in output, suggest human verification of attribution conclusions
7. **User Roles Missing**: Use default role template to generate Dashboards, including three standard views: Executive overview, Engineering details, On-Call real-time, user can adjust based on actual role requirements
8. **On-Call Schedule Missing**: Ask user to provide current on-duty personnel names and contact info (phone/Slack/email), AI will configure escalation notification chain accordingly
9. **Alert Rules Missing**: Adopt default escalation rule template (Critical→5min→L1/L2/L3, High→15min→L1/L2), annotate default rules for human review and confirmation in output

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
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
| alert_classification | object | Yes | Alert severity classification, must contain alert_id/severity/category |
| alert_classification.severity | string | Yes | Severity, only Critical/High/Medium/Low allowed |
| escalation_chain | array | Yes | Escalation chain, at least 1 level |
| notification_records | array | No | Notification records, each must contain channel/recipient/status |
| oncall_report | object | No | On-call report, must contain total_alerts/resolved_count |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| metrics-system | Metric definition change | Monitoring metric configuration and alert rules | Update metric mapping and alert thresholds |
| User provided-Product Architecture | Architecture change | Core paths and service dependencies | Re-identify core paths and dependency chains |
| User provided-SLA | SLA target change | Alert thresholds and severity standards | Adjust alert rules and escalation conditions |
| release-gradual | Release record update | Change correlation analysis | Update correlated events and attribution |
| Root Cause Knowledge Base | Historical case update | Root cause matching and suggestions | Update reference case library |
| User provided-Roles | Role requirement change | Dashboard layering and panel layout | Redesign role views |
| On-Call Management System | Schedule change | Notification recipients and escalation chain | Update On-Call schedule and notification configuration |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| monitoring-orchestrator | Monitoring & alerting pipeline completed | Output file update | Build completion status and key configuration |
| iteration-backlog-grooming | P0 alert triggered | Write to output file | Urgent alert and escalation details |
