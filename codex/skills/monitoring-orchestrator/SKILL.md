---
name: monitoring-orchestrator
description: "Use when building a product monitoring system or handling anomaly alerts. Monitoring alert commander orchestrating monitoring-pipeline and user-feedback-loop-report sub-skills. Keywords: monitoring alerts, anomaly detection, alert grading, monitoring system, health monitoring, monitoring dashboard, alert escalation, feedback loop, production alerts, system monitoring."
metadata:
  module: "Product Monitoring and Iteration"
  sub-module: "Monitoring Alerts"
  type: "orchestrator"
  version: "9.0"
  trigger_examples:
    - "Build a product monitoring system"
    - "There are anomaly alerts in production"
    - "Configure a monitoring dashboard"
    - "Handle production issues"
---

# Monitoring Alert Commander

## Core Principles

**Solve problems before users discover them**

The highest level of monitoring is not rapid response but advance prevention. When users perceive a problem, damage has already occurred. The value of a monitoring system lies in moving the problem discovery point earlier than user perception.

## Orchestration Philosophy

1. **System first, alerts follow, escalation as safety net**: First build the monitoring system to establish baselines, then respond precisely based on alert attribution, and finally use escalation mechanisms as a safety net
2. **Data flows progressively through system -> attribution -> escalation**: The monitoring system defines alert rules, alert attribution provides root causes, and escalation mechanisms deliver precise notifications based on root causes

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: monitoring-orchestrator
version: 9.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/monitoring-orchestrator.md

stages:
  - id: phase-1
    name: "Monitoring Alert Pipeline"
    depends_on: []
    skills: [monitoring-pipeline]
    gate:
      condition: "Monitoring alert full process completed (core path coverage >= 95%, alert noise rate < 15%)"
      fail_action: "Supplement monitoring configuration for missing paths, optimize alert rules"

  - id: phase-2
    name: "User Feedback Loop"
    depends_on: [phase-1]
    skills: [user-feedback-loop-report]
    trigger: User feedback loop requirement
    gate:
      condition: "Feedback loop report reviewed and confirmed by human"
      fail_action: "Supplement analysis or modify improvement suggestions"
```

## Stage Execution Plan

#### Invoke monitoring-pipeline

```
Invoke: ${monitoring-pipeline}
Input:
  product_architecture: User provided
  metrics_system: metrics-system -> metric_system.json
  sla_requirements: User provided
  release_info: release-gradual -> release_record.json (optional)
  user_roles: User provided
  oncall_schedule: On-call management system -> schedule
Output: output/pm-monitoring/monitoring-pipeline/
Validation: Core path coverage >= 95%; each core path has at least 4 golden signals; alert noise rate < 15%; alert classification accuracy >= 85%; all roles have corresponding dashboards; alert grading accuracy >= 90%; escalation trigger timeliness 100%
Mode: AI
```

#### Invoke user-feedback-loop-report

```
Invoke: ${user-feedback-loop-report}
Input:
  voice_analysis: user-research-voice-analysis (optional)
  anomaly_monitoring: monitoring-pipeline (optional)
  feedback_data: User provided
Output: output/pm-monitoring/user-feedback-loop-report/
Validation: Loop closure rate calculable; P0 unresolved items listed; improvement suggestions actionable
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/pm-monitoring/ |
| Summary output path | output/phase-reports/pm-monitoring/monitoring-orchestrator.md |

Downstream connections:
  primary: diagnosis-orchestrator (monitoring alerts established, if anomalies found proceed to diagnosis and root cause identification)
  alternatives:
    - target: release-orchestrator
      reason: Monitoring detects need for release fix
      condition: When monitoring alerts trigger P0/P1 anomalies requiring emergency fix
    - target: iteration-orchestrator
      reason: Monitoring data indicates need to adjust iteration priorities
      condition: When monitoring metric trends continue to deteriorate and iteration direction needs adjustment
  special_cases:
    - target: monitoring-pipeline
      reason: Only need to set up monitoring, no full monitoring orchestration needed
      condition: When feedback loop mechanism already exists, only monitoring alert configuration needed

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Monitoring alert full process completed | Monitoring-related output files generated and non-empty | Supplement monitoring configuration for missing paths, optimize alert rules, supplement visualization configuration or escalation rules |
| Feedback loop report reviewed | Feedback loop report reviewed and confirmed by human | Supplement analysis or modify improvement suggestions |
| Stage summary generated | output/phase-reports/pm-monitoring/monitoring-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Alert threshold adjustment | Alert noise rate too high or miss rate too high | Confirm alert threshold adjustment plan |
| Dashboard layout confirmation | Dashboard construction completed | Confirm core metric display and layout |
| Escalation strategy confirmation | Escalation rules generated | Confirm escalation paths and notification channel configuration |
| Feedback loop report confirmation | Feedback loop report generated | Confirm loop closure rate and improvement suggestions |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Monitoring system core path coverage insufficient (<80%) | Pause subsequent stages, request user to supplement product architecture information to improve core paths |
| Alert noise rate too high (>30%) | Pause alert analysis, roll back to monitoring system to optimize alert rules before continuing |
| On-call schedule missing | Use default escalation rules, mark "schedule pending configuration", P0 alerts directly notify product owner |
| Sub-skill output validation failed | Roll back to current stage and re-execute, max 1 retry; if still fails, mark exception and escalate to human |
| Upstream/downstream data format incompatible | Map fields and fill default values per downstream sub-skill input schema, record mapping relationships |
| Stage summary generation failed | Generate partial summary based on completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |
| Release requirement | Transfer to release-orchestrator for handling |

## Standalone Usage Input Acquisition Strategy

### Standalone Trigger Scenario Identification

When this orchestrator is invoked directly (not through a parent orchestrator), it is considered a standalone trigger scenario. Typical trigger methods:
- User directly requests capabilities within this orchestrator's domain
- Triggered as an independent skill by external systems
- Parent orchestrator not executed, but user only needs this orchestrator's capability

### Required Input Acquisition Strategy

| Required Input | Priority: Read from output/ | Fallback: Get from user conversation | Last Resort: AI knowledge base inference |
|---------------|---------------------------|-------------------------------------|---------------------------------------|
| PRD (prd.md) | Read output/pm-design/design-prd/prd.md | Ask user for PRD document or verbal requirements | Infer requirements from user description (low confidence, mark "PRD is AI-inferred") |
| project_dir | — | Ask user for project directory path | Cannot infer, user must provide |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest user execute upstream orchestrators in the following priority:

| Missing Input | Suggested Upstream Orchestrator | Description |
|--------------|-------------------------------|-------------|
| PRD | pm-design related orchestrator | PRD is the business basis for monitoring-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (monitoring-pipeline, user-feedback-loop-report...) produce domain-specific outputs |

Backtracking suggestion output format:
```
Critical input missing detected, suggest executing upstream orchestrator first:
1. [Priority] pm-design related orchestrator -> Produces PRD
Continue with AI-inferred values? (Inferred values confidence <=0.3, outputs require additional human review)
```

### Standalone Usage Gate

When triggered standalone, must pass the following additional checks before executing Pipeline:

| Gate Item | Check Content | Failure Handling |
|-----------|--------------|-----------------|
| PRD existence | prd.md or equivalent requirements document available | Block execution, suggest user provide PRD |
| project_dir validity | User provided valid project directory path | Block execution, user must provide valid project_dir |
| Input confidence assessment | All required input acquisition methods determined, overall confidence >=0.5 | When confidence <0.5, force human confirmation whether to continue execution |

Gate execution order: PRD existence -> project_dir validity -> Input confidence assessment
