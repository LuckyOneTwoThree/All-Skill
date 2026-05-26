---
name: release-gradual
description: Use when you need to execute a gradual release. Automated gradual release execution, performing progressive gradual release from 1% to 10% to 50% to 100%, with automatic metric monitoring at each stage and automatic progression decision, supporting automatic rollback when P0 metrics degrade. 🤖 AI auto-executes. Keywords: gradual release, progressive release, feature flag, automatic rollback, release strategy, canary release, small traffic, incremental rollout.
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Release & Go-Live"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["Internet", "General"]
  trigger_examples:
    - "Do a gradual release, start with 1% traffic"
    - "Help me do a small traffic validation"
    - "Incrementally roll out to full traffic"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Execute gradual release plan generation and Feature Flag configuration, output gradual release plan"
  deep_description: "Complete gradual flow + per-stage automatic monitoring + automatic rollback trigger + rollback impact assessment + gradual metric deep analysis"
---

# Automated Gradual Release Execution

## Core Principles

1. **Trigger-driven**: Automatically triggered by quality gate pass events; metric degradation automatically triggers rollback
2. **Automated verification**: Per-stage metric auto-monitoring, stage transition auto-decision, rollback auto-execution
3. **Continuous deployment**: Gradual strategy with Feature Flags for progressive deployment and instant rollback
4. **Real-time review**: Per-stage metrics aggregated in real-time; post-release review input generated immediately upon completion

## Interaction Mode

🤖 **AI Auto-executes**

Trigger conditions:
- Quality gate passed
- Manual trigger (release lead confirmation)

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Release content | JSON | Yes | Release management system | Version and changes to be released |
| Feature Flag configuration | JSON | Yes | Feature Flag system | Gradual release switch configuration |
| Monitoring metric definitions | JSON | Yes | Monitoring system | Per-stage monitoring metrics |
| Gradual release strategy configuration | JSON | Yes | Release strategy library | Per-stage traffic percentage and duration |

### Release Content Structure Example

```json
{
  "release_id": "release_2024_0125_001",
  "version": "v2.1.0",
  "build_ref": "abc123def",
  "change_summary": "Added WeChat login, optimized login flow",
  "affected_services": ["auth-service", "user-service"],
  "rollback_version": "v2.0.9",
  "rollback_strategy": "feature_flag_offline"
}
```

## Gradual Phase Configuration

### Standard Gradual Phases

| Phase | Traffic Percentage | Duration | Minimum Duration | Pass Criteria |
|------|----------|----------|--------------|----------|
| Stage 0 | 0% (verification) | - | 10 minutes | Build verification passed |
| Stage 1 | 1% | 30 minutes | 30 minutes | Core metrics normal |
| Stage 2 | 10% | 2 hours | 1 hour | P0 metrics stable |
| Stage 3 | 50% | 4 hours | 2 hours | No new anomalies |
| Stage 4 | 100% | - | - | All criteria passed |

### Guardrail Metrics Configuration

```json
{
  "guardrail_metrics": {
    "p0_metrics": [
      {
        "name": "error_rate",
        "description": "5xx error rate",
        "unit": "percentage",
        "warning_threshold": 0.01,
        "rollback_threshold": 0.03,
        "comparison": "vs_baseline"
      },
      {
        "name": "latency_p99",
        "description": "P99 response time",
        "unit": "milliseconds",
        "warning_threshold": 500,
        "rollback_threshold": 1000,
        "comparison": "vs_baseline"
      },
      {
        "name": "availability",
        "description": "Service availability",
        "unit": "percentage",
        "warning_threshold": 99.9,
        "rollback_threshold": 99.0,
        "comparison": "absolute"
      }
    ],
    "p1_metrics": [
      {
        "name": "api_success_rate",
        "description": "API success rate",
        "unit": "percentage",
        "warning_threshold": 99,
        "rollback_threshold": 97
      },
      {
        "name": "error_count",
        "description": "Error count",
        "unit": "count",
        "warning_threshold": 100,
        "rollback_threshold": 500
      }
    ],
    "p2_metrics": [
      {
        "name": "conversion_rate",
        "description": "Business conversion rate",
        "unit": "percentage",
        "warning_threshold": -10,
        "rollback_threshold": -30,
        "comparison": "vs_previous_phase"
      }
    ]
  }
}
```

## Execution Steps

### Step 1: Gradual Release Plan Generation [Core]

#### 1.1 Pre-release Verification

**Verification Checklist**:

| Verification Item | Check Content | Failure Handling |
|--------|----------|----------|
| Build artifact | Verify build artifact integrity | Block release |
| Rollback version | Confirm rollback version is available | Block release |
| Feature Flag | Verify Flag configuration is correct | Block release |
| Monitoring alerts | Verify alert rules are configured | Block release |
| On-call personnel | Confirm on-call personnel are online | Warning |

**Verification Output**:

```json
{
  "pre_release_verification": {
    "build_artifact": {"verified": true, "sha256": "abc123..."},
    "rollback_version": {"available": true, "version": "v2.0.9"},
    "feature_flag": {"configured": true, "flag_key": "feature_wechat_login"},
    "monitoring": {"alerts_configured": true, "channel": "pagerduty"},
    "on_call": {"confirmed": true, "engineer": "dev_zhang"},
    "ready_to_release": true
  }
}
```

#### 1.2 Gradual Plan Generation

**Plan Structure**:

```json
{
  "canary_plan": {
    "plan_id": "canary_2024_0125_001",
    "release_id": "release_2024_0125_001",
    "phases": [
      {
        "phase_id": "phase_1",
        "traffic_percentage": 1,
        "duration_minutes": 30,
        "min_duration_minutes": 30,
        "target_users": {
          "strategy": "random",
          "percentage": 1
        },
        "success_criteria": {
          "p0_metrics": "all_normal",
          "p1_metrics": "all_normal",
          "manual_approval": false
        }
      },
      {
        "phase_id": "phase_2",
        "traffic_percentage": 10,
        "duration_minutes": 120,
        "min_duration_minutes": 60,
        "target_users": {
          "strategy": "random",
          "percentage": 10
        },
        "success_criteria": {
          "p0_metrics": "stable",
          "p1_metrics": "all_normal",
          "manual_approval": true
        }
      },
      {
        "phase_id": "phase_3",
        "traffic_percentage": 50,
        "duration_minutes": 240,
        "min_duration_minutes": 120,
        "target_users": {
          "strategy": "random",
          "percentage": 50
        },
        "success_criteria": {
          "p0_metrics": "stable",
          "p1_metrics": "stable",
          "manual_approval": true
        }
      },
      {
        "phase_id": "phase_4",
        "traffic_percentage": 100,
        "duration_minutes": null,
        "target_users": {
          "strategy": "all"
        },
        "success_criteria": {
          "p0_metrics": "all_normal",
          "p1_metrics": "all_normal",
          "manual_approval": true
        }
      }
    ]
  }
}
```

### Step 2: Feature Flag Auto-configuration [Core]

#### 2.1 Flag Configuration Generation

**Configuration Rules**:

```json
{
  "feature_flag_config": {
    "flag_key": "feature_wechat_login",
    "flag_type": "boolean",
    "default_value": false,
    "serving_config": {
      "phase_1": {
        "percentage": 1,
        "rules": [
          {
            "name": "random_1_percent",
            "percentage": 1,
            "variation": true
          }
        ]
      },
      "phase_2": {
        "percentage": 10,
        "rules": [
          {
            "name": "random_10_percent",
            "percentage": 10,
            "variation": true
          }
        ]
      },
      "phase_3": {
        "percentage": 50,
        "rules": [
          {
            "name": "random_50_percent",
            "percentage": 50,
            "variation": true
          }
        ]
      },
      "phase_4": {
        "percentage": 100,
        "rules": [
          {
            "name": "all_users",
            "percentage": 100,
            "variation": true
          }
        ]
      }
    }
  }
}
```

#### 2.2 Flag Status Tracking

**Status Record**:

```json
{
  "flag_status_tracking": {
    "flag_key": "feature_wechat_login",
    "current_phase": "phase_2",
    "current_traffic_percentage": 10,
    "last_updated": "ISO8601",
    "updated_by": "release-gradual-pipeline",
    "history": [
      {"timestamp": "ISO8601", "phase": "phase_1", "percentage": 1, "action": "enabled"},
      {"timestamp": "ISO8601", "phase": "phase_2", "percentage": 10, "action": "increased"},
      {"timestamp": "ISO8601", "phase": "phase_2", "percentage": 0, "action": "rollback"}
    ]
  }
}
```

### Step 3: Per-stage Automatic Monitoring [Conditional]

#### 3.1 Metric Collection

**Collection Configuration**:

```json
{
  "metrics_collection": {
    "interval_seconds": 30,
    "metrics": [
      {"name": "error_rate", "source": "prometheus", "query": "rate(http_requests_total{status=~'5..'}[5m])"},
      {"name": "latency_p99", "source": "prometheus", "query": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))"},
      {"name": "availability", "source": "synthetic_monitoring", "frequency": "1m"}
    ]
  }
}
```

#### 3.2 Phase Status Assessment

**Assessment Rules**:

| Metric Type | Assessment Condition | Assessment Result |
|----------|----------|----------|
| All P0 normal | No metrics exceed warning threshold | **Can proceed to next phase** |
| Any P0 alert | Any metric exceeds warning but not rollback | **Continue observing** |
| P0 degradation | Any metric exceeds rollback threshold | **Immediately rollback** |
| P1 alert | P1 metric exceeds threshold | **Delay + alert** |

**Phase Assessment Output**:

```json
{
  "phase_assessment": {
    "phase_id": "phase_2",
    "assessed_at": "ISO8601",
    "duration_minutes": 90,
    "metrics_summary": {
      "p0_metrics": {
        "error_rate": {"current": 0.002, "baseline": 0.001, "status": "normal"},
        "latency_p99": {"current": 150, "baseline": 140, "status": "normal"},
        "availability": {"current": 99.99, "baseline": 99.99, "status": "normal"}
      },
      "p1_metrics": {
        "api_success_rate": {"current": 99.5, "baseline": 99.8, "status": "normal"}
      },
      "p2_metrics": {
        "conversion_rate": {"current": -2, "baseline": 0, "status": "normal"}
      }
    },
    "overall_status": "healthy",
    "recommendation": "can_proceed",
    "confidence": 0.95
  }
}
```

#### 3.3 Phase Transition Decision

**Decision Flow**:

```
┌─────────────────┐
│ Phase duration  │
│ elapsed?        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    ▼         ▼
┌────────┐ ┌─────────────────┐
│Metric  │ │Continue         │
│assess  │ │monitoring       │
└───┬────┘ └─────────────────┘
    │
    ▼
┌─────────────────┐
│ All P0 metrics  │
│ normal?         │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    ▼         ▼
┌────────┐ ┌─────────────────┐
│Proceed │ │ Alert/Observe/  │
│to next │ │ Rollback        │
│phase   │ └─────────────────┘
└────────┘
```

**Transition Output**:

```json
{
  "phase_transition_decision": {
    "current_phase": "phase_2",
    "decision": "proceed_to_next_phase",
    "next_phase": "phase_3",
    "reason": "Phase duration elapsed, all P0 metrics normal",
    "metrics_verified": true,
    "approved_by": "release-gradual-pipeline",
    "scheduled_at": "ISO8601"
  }
}
```

### Step 4: Automatic Rollback Trigger [Deep]

#### 4.1 Rollback Trigger Conditions

**Trigger Rules**:

| Condition | Trigger Action | Delay |
|------|----------|------|
| P0 metric exceeds rollback threshold | **Immediate automatic rollback** | 0 seconds |
| Service unavailable | **Immediate automatic rollback** | 0 seconds |
| P1 metric exceeds rollback threshold | Delayed observation | 5 minutes |
| Human-confirmed anomaly | Manual trigger | 0 seconds |

#### 4.2 Rollback Execution

**Rollback Flow**:

```
Rollback triggered
    │
    ▼
┌─────────────────┐
│ Notify relevant │
│ personnel       │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
 Automated  Manual
    │         │
    ▼         ▼
┌─────────┐ ┌─────────────────┐
│Turn off │ │Confirm and      │
│Flag     │ │execute          │
│Switch   │ └─────────────────┘
│traffic  │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Verify rollback │
│ result          │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
  Success   Failure
    │         │
    ▼         ▼
┌─────────┐ ┌─────────────────┐
│Record   │ │Escalate alert   │
│complete │ │for human        │
│         │ │intervention     │
└─────────┘ └─────────────────┘
```

**Rollback Execution Output**:

```json
{
  "rollback_execution": {
    "rollback_id": "rollback_2024_0125_002",
    "trigger": {
      "reason": "P0 metric degradation",
      "metric": "error_rate",
      "current_value": 0.035,
      "threshold": 0.03
    },
    "action": {
      "step_1": "Turn off Feature Flag",
      "step_2": "Wait for traffic to fully switch",
      "step_3": "Verify old version health"
    },
    "status": "completed",
    "completed_at": "ISO8601",
    "duration_seconds": 45,
    "verification": {
      "traffic_restored": true,
      "old_version_healthy": true,
      "error_rate_recovered": true
    }
  }
}
```

#### 4.3 Post-rollback Processing

**Processing Checklist**:

```json
{
  "post_rollback_actions": [
    {
      "action": "Notify release team",
      "type": "notification",
      "recipients": ["release_lead", "dev_lead", "product_manager"]
    },
    {
      "action": "Record rollback event",
      "type": "documentation",
      "content": "Rollback reason, duration, impact scope"
    },
    {
      "action": "Create incident follow-up ticket",
      "type": "ticket",
      "template": "post_incident_review"
    },
    {
      "action": "Analyze root cause",
      "type": "analysis",
      "deadline": "Within 24 hours"
    }
  ]
}
```

## Output

**Storage Path**: `output/pm-monitoring/release-gradual/`

**Output File**: `release_status.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["output_id", "release_id", "release_status"],
  "properties": {
    "output_id": {"type": "string", "description": "Unique output identifier"},
    "release_id": {"type": "string", "description": "Release ID"},
    "generated_at": {"type": "string", "description": "Generation timestamp"},
    "release_status": {"type": "object", "description": "Current release status, including phase, traffic percentage, and progress"},
    "phase_transitions": {"type": "array", "description": "Phase transition history records"},
    "rollback_history": {"type": "array", "description": "Rollback history records"},
    "monitoring_metrics": {"type": "object", "description": "Monitoring data summary, including current and historical metrics"},
    "canary_plan": {"type": "object", "description": "Gradual release plan"}
  }
}
```

### Final Output Structure

```json
{
  "output_id": "release_status_xxx",
  "release_id": "release_2024_0125_001",
  "generated_at": "ISO8601",
  "release_status": {
    "current_phase": "phase_3",
    "traffic_percentage": 50,
    "start_time": "ISO8601",
    "elapsed_minutes": 180,
    "status": "in_progress"
  },
  "phase_transitions": [
    {
      "phase_id": "phase_1",
      "traffic_percentage": 1,
      "started_at": "ISO8601",
      "completed_at": "ISO8601",
      "duration_minutes": 32,
      "outcome": "promoted",
      "metrics_at_completion": {...}
    },
    {
      "phase_id": "phase_2",
      "traffic_percentage": 10,
      "started_at": "ISO8601",
      "completed_at": "ISO8601",
      "duration_minutes": 125,
      "outcome": "promoted",
      "metrics_at_completion": {...}
    }
  ],
  "rollback_history": [],
  "monitoring_metrics": {
    "current": {...},
    "historical": [...]
  },
  "canary_plan": {...}
}
```

### Output Field Descriptions

| Field | Type | Description |
|------|------|------|
| release_status | JSON | Current release status |
| phase_transitions | JSON | Phase transition history |
| rollback_history | JSON | Rollback history |
| monitoring_metrics | JSON | Monitoring data summary |

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| gradual_release | object | Yes | Gradual release root object |
| gradual_release.strategy | object | Yes | Gradual strategy |
| gradual_release.strategy.type | string | Yes | Strategy type, enum: canary/blue_green/rolling/feature_flag |
| gradual_release.strategy.stages | array | Yes | Gradual phase list, at least 2 |
| gradual_release.strategy.stages[].name | string | Yes | Phase name |
| gradual_release.strategy.stages[].traffic_percentage | number | Yes | Traffic percentage, 0-100 |
| gradual_release.strategy.stages[].duration | string | Yes | Duration |
| gradual_release.strategy.stages[].success_criteria | object | Yes | Success criteria |
| gradual_release.strategy.stages[].rollback_criteria | object | Yes | Rollback criteria |
| gradual_release.monitoring | object | Yes | Monitoring configuration |
| gradual_release.monitoring.metrics | array | Yes | Monitoring metric list |
| gradual_release.monitoring.alert_rules | array | Yes | Alert rule list |
| gradual_release.rollback_plan | object | Yes | Rollback plan |
| gradual_release.rollback_plan.trigger_conditions | array | Yes | Trigger conditions |
| gradual_release.rollback_plan.steps | array | Yes | Rollback steps |

## Upstream Change Response

When upstream inputs change, this skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Release checklist change | Gradual strategy and gates | Re-evaluate gradual gate conditions, mark for human confirmation |
| Acceptance report change | Gradual start conditions | Update gradual start conditions, re-evaluate whether gradual release can begin |
| Monitoring metric change | Monitoring configuration and alert rules | Update monitoring metrics and alert thresholds, mark for human confirmation |
| PRD requirement change | Gradual scope and feature verification | Re-evaluate gradual scope, mark for human confirmation |

When the gradual release itself changes, the downstream notification mechanism:

| Gradual Change Type | Notification Scope | Notification Method |
|-------------|----------|----------|
| Gradual phase advancement | release-notes | Mark phase advancement, trigger release notes update |
| Gradual rollback | All downstream | Mark rollback event, trigger issue investigation and fix |
| Gradual completion | release-notes | Mark gradual completion, trigger full release decision |

---

## Decision Rules

### Automatic Rollback Rules

| Trigger Condition | Execution Action | Priority |
|----------|----------|--------|
| P0 metric exceeds rollback threshold | Immediate automatic rollback | Highest |
| Service completely unavailable | Immediate automatic rollback | Highest |
| P1 metric exceeds rollback threshold | Rollback after 5-minute delay | High |
| P2 metric exceeds rollback threshold | Alert, wait for human confirmation | Medium |

### Phase Pass Rules

| Condition | Decision |
|------|------|
| All P0 metrics normal | Can proceed to next phase |
| Phase duration elapsed | Assess whether to proceed to next phase |
| P0 alert exists (not exceeding threshold) | Extend observation period |
| P1 alert exists | Warning, proceed to next phase |

## Quality Checks

### Quality Gates

| Check Item | Standard | Non-compliance Action |
|--------|------|------------|
| Pre-release verification (P0) | All verification items passed | Block release |
| P0 metrics stable (P0) | No metric degradation trend | Stop gradual release |
| Rollback mechanism ready (P0) | Feature Flag available | Block release |
| Alert configuration correct (P1) | All metrics have alerts configured | Block release |

### Quality Checklist

- [ ] Pre-release verification all passed (P0)
- [ ] Feature Flag configured correctly (P0)
- [ ] Monitoring alerts configured (P1)
- [ ] Rollback mechanism ready (P0)
- [ ] On-call personnel confirmed (P1)
- [ ] Phase transition records complete (P2)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|----------|----------|----------|
| Release content missing | User provides release feature list → generate gradual plan template | Release content details need manual supplementation |
| Feature Flag configuration missing | Generate gradual plan but exclude Flag auto-configuration steps | Feature Flag requires manual configuration |
| Monitoring metrics missing | Use default P0/P1/P2 metric templates, mark as "pending confirmation" | Alert thresholds based on generic templates |
| Release content + Feature Flag + monitoring metrics all missing | User provides release feature list → generate gradual plan template | Output gradual plan template, each configuration item marked as "pending confirmation" |

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Release feature list**: Features and changes included in this release
- **Rollback version** (optional): Rollback-able previous version number
- **Key monitoring metrics** (optional): Business and technical metrics requiring focused attention

## Execution Log

```json
{
  "execution_id": "exec_p6_xxx",
  "pipeline": "release-gradual",
  "release_id": "release_2024_0125_001",
  "trigger": "quality_gate_passed",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "phases": [
    {"phase_id": "phase_1", "status": "completed", "duration_minutes": 32, "outcome": "promoted"},
    {"phase_id": "phase_2", "status": "completed", "duration_minutes": 125, "outcome": "promoted"},
    {"phase_id": "phase_3", "status": "in_progress", "duration_minutes": 45}
  ],
  "rollbacks": [],
  "final_status": {
    "outcome": "in_progress",
    "current_traffic": 50,
    "metrics_healthy": true
  }
}
```
