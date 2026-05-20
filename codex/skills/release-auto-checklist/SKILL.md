---
name: release-auto-checklist
description: Use when you need to generate a release checklist. Automated release checklist generation and tracking, automatically generating T-7/T-1/during release/T+24h/T+72h checklists, with per-item automated checks and manual confirmation, supporting incomplete item alerts and status tracking. 🤖 AI auto-executes. Keywords: release checklist, go-live check, release process, release tracking, go-live preparation, release list, go-live list, release verification.
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Release & Go-Live"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["Internet", "General"]
  trigger_examples:
    - "Help me create a pre-release checklist"
    - "Generate a release checklist"
    - "Organize what needs to be checked before go-live"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Generate release checklist template and phase-specific check items, output pending confirmation list"
  deep_description: "Complete checklist + per-item automated checks + incomplete item alerts + status tracking + post-release verification + regression checks"
---

# Automated Release Checklist Generation & Tracking

## Core Principles

1. **Trigger-driven**: Automatically triggered by release plan creation events; scheduled checks auto-execute
2. **Automated verification**: Check items execute automatically, incomplete items trigger automatic alerts, status is automatically tracked
3. **Continuous deployment**: Checklist integrated with release process; P0 incomplete items automatically block release
4. **Real-time review**: Checklist completion status aggregated in real-time; risk items exposed immediately

## Interaction Mode

🤖 **AI Auto-executes**

Trigger conditions:
- Release plan created (starts at T-7)
- Scheduled check (hourly)
- Manual trigger (release lead request)

## Release Phase Definitions

| Phase | Time Point | Purpose |
|------|--------|------|
| T-7 | 7 days before release | Prepare checklist, identify risks |
| T-1 | 1 day before release | Final confirmation, readiness check |
| T-0 | During release | Execute release, real-time monitoring |
| T+24h | 24 hours post-release | Stability confirmation |
| T+72h | 72 hours post-release | Effectiveness evaluation |

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Release content | JSON | Yes | Release management system | Release version and change content |
| Checklist template | JSON | Yes | Release strategy library | Check templates for each phase |
| Release plan | JSON | Yes | Project management | Release time and responsible persons |
| Release history | JSON | Yes | Release history library | Used to generate personalized check items |

### Release Content Structure Example

```json
{
  "release_id": "release_2024_0125_001",
  "version": "v2.1.0",
  "release_time": "2024-01-25T14:00:00Z",
  "affected_services": ["auth-service", "user-service"],
  "change_type": "feature_release",
  "release_lead": "dev_zhang",
  "developers": ["dev_wang", "dev_li"],
  "testers": ["qa_chen"],
  "on_call": "ops_wu"
}
```

### Checklist Template Structure

```json
{
  "codex-templates": {
    "T-7": {
      "template_id": "checklist_T-7",
      "title": "7 days before release - Preparation check",
      "items": [
        {
          "item_id": "C001",
          "category": "documentation",
          "title": "Update changelog",
          "description": "Ensure changelog includes all changes for this release",
          "type": "manual",
          "owner_role": "developer",
          "priority": "P0"
        }
      ]
    },
    "T-1": {...},
    "T-0": {...},
    "T+24h": {...},
    "T+72h": {...}
  }
}
```

## Execution Steps

### Step 1: Checklist Template Generation [Core]

#### 1.1 Template Loading

**Template Sources**:

| Source | Description |
|------|------|
| Standard template | Generic template from release strategy library |
| Project template | Template customized for specific projects |
| Release type template | feature_release/hotfix/config_change |
| Historical template | Auto-generated based on historical releases |

#### 1.2 Personalization Adjustment

**Adjustment Rules**:

| Adjustment Dimension | Adjustment Basis |
|----------|----------|
| Service scope | affected_services determines which services need checking |
| Change type | change_type determines special check items |
| Release history | Historical issues determine items requiring extra attention |
| Team configuration | Responsible persons determine notification chain |

**Personalized Output**:

```json
{
  "personalized_checklist": {
    "generated_from": "standard_template_v2",
    "customizations": [
      {"item_id": "C015", "added": true, "reason": "Involving auth-service requires additional security checks"},
      {"item_id": "C020", "removed": true, "reason": "This release does not involve database changes"}
    ],
    "release_specific_items": [
      {
        "item_id": "C_RS_001",
        "title": "WeChat login feature-specific check",
        "category": "feature_specific",
        "description": "Check end-to-end flow of WeChat login",
        "priority": "P0"
      }
    ]
  }
}
```

### Step 2: Phase-specific Checklist Generation [Core]

#### 2.1 T-7 Checklist

**Generation Rules**:

```json
{
  "T-7_checklist": {
    "phase": "T-7",
    "release_date": "2024-01-25",
    "items": [
      {
        "item_id": "T7_C001",
        "category": "documentation",
        "title": "Release changelog completed",
        "description": "Record all feature changes, bug fixes, and breaking changes in CHANGELOG",
        "type": "manual",
        "owner": "dev_wang",
        "priority": "P0",
        "auto_check_config": {
          "enabled": false
        }
      },
      {
        "item_id": "T7_C002",
        "category": "code_quality",
        "title": "Code passed static analysis",
        "description": "Run SonarQube scan, ensure no Blocker/Critical issues",
        "type": "auto",
        "owner": "ci_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "sonarqube",
          "pass_condition": "no_blocker_or_critical"
        }
      },
      {
        "item_id": "T7_C003",
        "category": "test",
        "title": "All automated tests passed",
        "description": "All test cases in CI pipeline have passed",
        "type": "auto",
        "owner": "ci_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "ci_pipeline",
          "pass_condition": "all_tests_passed"
        }
      }
    ]
  }
}
```

#### 2.2 T-1 Checklist

**Generation Rules**:

```json
{
  "T-1_checklist": {
    "phase": "T-1",
    "items": [
      {
        "item_id": "T1_C001",
        "category": "release_ready",
        "title": "Rollback version deployed and verified",
        "description": "Confirm rollback version (v2.0.9) is running normally in production",
        "type": "manual",
        "owner": "ops_wu",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "health_check",
          "check_endpoint": "/health",
          "pass_condition": "status_200"
        }
      },
      {
        "item_id": "T1_C002",
        "category": "communication",
        "title": "Release notification sent",
        "description": "Send release notification to all relevant teams, including release time and impact",
        "type": "manual",
        "owner": "dev_zhang",
        "priority": "P1",
        "auto_check_config": {
          "enabled": false
        }
      },
      {
        "item_id": "T1_C003",
        "category": "monitoring",
        "title": "Monitoring dashboards ready",
        "description": "Confirm monitoring dashboards for release-related services are displaying normally",
        "type": "manual",
        "owner": "ops_wu",
        "priority": "P1",
        "auto_check_config": {
          "enabled": true,
          "check_type": "dashboard_access",
          "pass_condition": "accessible"
        }
      }
    ]
  }
}
```

#### 2.3 T-0 Checklist (During Release)

**Generation Rules**:

```json
{
  "T-0_checklist": {
    "phase": "T-0",
    "items": [
      {
        "item_id": "T0_C001",
        "category": "pre_release",
        "title": "Release window valid",
        "description": "Current time is within weekday 10:00-16:00 release window",
        "type": "auto",
        "owner": "system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "time_window",
          "pass_condition": "within_window"
        }
      },
      {
        "item_id": "T0_C002",
        "category": "release_execution",
        "title": "Build artifact verified",
        "description": "Verify SHA256 checksum of build artifacts",
        "type": "auto",
        "owner": "ci_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "artifact_verification",
          "pass_condition": "checksum_match"
        }
      },
      {
        "item_id": "T0_C003",
        "category": "release_execution",
        "title": "Feature Flag configured",
        "description": "Gradual release Flag correctly configured with initial value (1%)",
        "type": "auto",
        "owner": "release_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "feature_flag",
          "pass_condition": "configured"
        }
      },
      {
        "item_id": "T0_C004",
        "category": "post_release",
        "title": "Service health check passed",
        "description": "All affected services passed health check",
        "type": "auto",
        "owner": "monitoring_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "service_health",
          "pass_condition": "all_healthy"
        }
      }
    ]
  }
}
```

#### 2.4 T+24h Checklist

**Generation Rules**:

```json
{
  "T+24h_checklist": {
    "phase": "T+24h",
    "items": [
      {
        "item_id": "T24_C001",
        "category": "stability",
        "title": "Core metrics normal",
        "description": "P0 metrics such as error rate, response time, and availability are normal",
        "type": "auto",
        "owner": "monitoring_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "metrics_check",
          "metrics": ["error_rate", "latency_p99", "availability"],
          "pass_condition": "all_normal"
        }
      },
      {
        "item_id": "T24_C002",
        "category": "stability",
        "title": "No P0/P1 level alerts",
        "description": "No P0/P1 level alerts in the past 24 hours",
        "type": "auto",
        "owner": "monitoring_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "alert_check",
          "pass_condition": "no_p0_p1_alerts"
        }
      },
      {
        "item_id": "T24_C003",
        "category": "user_feedback",
        "title": "User feedback normal",
        "description": "No abnormal increase in customer service tickets and user feedback",
        "type": "manual",
        "owner": "product_manager_zhang",
        "priority": "P1",
        "auto_check_config": {
          "enabled": false
        }
      }
    ]
  }
}
```

#### 2.5 T+72h Checklist

**Generation Rules**:

```json
{
  "T+72h_checklist": {
    "phase": "T+72h",
    "items": [
      {
        "item_id": "T72_C001",
        "category": "effectiveness",
        "title": "Business metrics achieved",
        "description": "Core business metrics (conversion rate, DAU, etc.) meet expectations",
        "type": "manual",
        "owner": "product_manager_zhang",
        "priority": "P0",
        "auto_check_config": {
          "enabled": false
        }
      },
      {
        "item_id": "T72_C002",
        "category": "technical",
        "title": "No technical debt increase",
        "description": "Code quality metrics have not degraded",
        "type": "auto",
        "owner": "ci_system",
        "priority": "P1",
        "auto_check_config": {
          "enabled": true,
          "check_type": "code_quality_trend",
          "pass_condition": "no_degradation"
        }
      }
    ]
  }
}
```

### Step 3: Per-item Automated Check [Conditional]

#### 3.1 Check Execution

**Execution Configuration**:

```json
{
  "check_execution": {
    "execution_mode": "sequential",
    "parallel_execution": true,
    "timeout_seconds": 60,
    "retry_config": {
      "enabled": true,
      "max_retries": 2,
      "retry_delay_seconds": 10
    }
  }
}
```

**Check Result Output**:

```json
{
  "check_results": [
    {
      "item_id": "T7_C002",
      "check_type": "sonarqube",
      "status": "passed",
      "checked_at": "ISO8601",
      "details": {
        "blocker_issues": 0,
        "critical_issues": 0,
        "major_issues": 5
      },
      "evidence": "sonarqube_scan_2024_0125.json"
    },
    {
      "item_id": "T1_C001",
      "check_type": "health_check",
      "status": "passed",
      "checked_at": "ISO8601",
      "details": {
        "endpoint": "https://api.example.com/health",
        "response_time_ms": 45,
        "status_code": 200
      }
    }
  ]
}
```

### Step 4: Incomplete Item Alerts [Conditional]

#### 4.1 Alert Rules

**Alert Levels**:

| Level | Condition | Notification Method |
|------|------|----------|
| Blocking | P0 item incomplete and approaching release time | Immediate notification + block release |
| High | P0 item incomplete | Notify responsible person |
| Medium | P1 item incomplete | Notify responsible person |
| Low | P2 item incomplete | Summary notification |

**Alert Trigger Timing**:

| Check Item Type | Alert Trigger Time |
|------------|--------------|
| T-7 check items | Alert if incomplete by T-3 |
| T-1 check items | Alert if incomplete by T-1 12:00 |
| T-0 check items | Alert if incomplete 2 hours before release |
| T+24h check items | Continue tracking if incomplete at T+24h |

#### 4.2 Alert Output

```json
{
  "pending_alerts": [
    {
      "alert_id": "alert_001",
      "severity": "high",
      "item_id": "T-1_C002",
      "title": "Release notification not sent",
      "owner": "dev_zhang",
      "deadline": "2024-01-24T12:00:00Z",
      "time_remaining": "3 hours",
      "notification_channels": ["slack", "email"]
    }
  ]
}
```

### Step 5: Status Tracking [Deep]

#### 5.1 Status Aggregation

**Status Report**:

```json
{
  "checklist_status": {
    "phase": "T-1",
    "generated_at": "ISO8601",
    "summary": {
      "total_items": 20,
      "completed": 15,
      "pending": 3,
      "blocked": 2,
      "completion_rate": 0.75
    },
    "by_priority": {
      "P0": {"total": 8, "completed": 7, "pending": 1},
      "P1": {"total": 8, "completed": 6, "pending": 2},
      "P2": {"total": 4, "completed": 2, "pending": 2}
    },
    "by_category": {
      "documentation": {"completed": 2, "pending": 0},
      "test": {"completed": 3, "pending": 1},
      "release_ready": {"completed": 4, "pending": 1}
    }
  }
}
```

#### 5.2 Progress Visualization

**Visualization Data**:

```json
{
  "progress_visualization": {
    "timeline": [
      {"phase": "T-7", "completion_rate": 1.0, "status": "completed"},
      {"phase": "T-1", "completion_rate": 0.75, "status": "in_progress"},
      {"phase": "T-0", "completion_rate": 0.0, "status": "pending"},
      {"phase": "T+24h", "completion_rate": 0.0, "status": "pending"},
      {"phase": "T+72h", "completion_rate": 0.0, "status": "pending"}
    ],
    "risk_indicators": [
      {"indicator": "P0 blocking items", "count": 1, "severity": "high"}
    ]
  }
}
```

## Output

**Storage Path**: `output/pm-monitoring/release-auto-checklist/`

**Output File**: `release_checklist.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["output_id", "release_id", "checklist", "completion_status"],
  "properties": {
    "output_id": {"type": "string", "description": "Unique output identifier"},
    "release_id": {"type": "string", "description": "Release ID"},
    "generated_at": {"type": "string", "description": "Generation timestamp"},
    "checklist": {"type": "object", "description": "Complete checklist for all phases, including T-7/T-1/T-0/T+24h/T+72h"},
    "completion_status": {"type": "object", "description": "Completion status summary, including current phase and completion rate"},
    "pending_alerts": {"type": "array", "description": "Pending alert list"},
    "risk_assessment": {"type": "object", "description": "Risk assessment, including risk level and blocking items"}
  }
}
```

### Final Output Structure

```json
{
  "output_id": "checklist_report_xxx",
  "release_id": "release_2024_0125_001",
  "generated_at": "ISO8601",
  "checklist": {
    "T-7": {...},
    "T-1": {...},
    "T-0": {...},
    "T+24h": {...},
    "T+72h": {...}
  },
  "completion_status": {
    "current_phase": "T-1",
    "overall_completion_rate": 0.75,
    "p0_completion_rate": 0.875
  },
  "pending_alerts": [...],
  "risk_assessment": {
    "risk_level": "medium",
    "blocking_items": [
      {
        "item_id": "T-1_C002",
        "title": "Release notification not sent",
        "owner": "dev_zhang"
      }
    ]
  }
}
```

### Output Field Descriptions

| Field | Type | Description |
|------|------|------|
| checklist | JSON | Complete checklist for all phases |
| completion_status | JSON | Completion status summary |
| pending_alerts | JSON | Pending alerts |
| risk_assessment | JSON | Risk assessment |

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| release_checklist | object | Yes | Release checklist root object |
| release_checklist.version | string | Yes | Release version number |
| release_checklist.items | array | Yes | Check item list |
| release_checklist.items[].id | string | Yes | Check item ID |
| release_checklist.items[].category | string | Yes | Check category, enum: code_quality/testing/security/compliance/infrastructure/monitoring |
| release_checklist.items[].description | string | Yes | Check description |
| release_checklist.items[].status | string | Yes | Status, enum: pass/fail/pending/waived |
| release_checklist.items[].severity | string | Yes | Severity level, enum: blocker/warning/info |
| release_checklist.items[].evidence | string | No | Evidence link |
| release_checklist.items[].assignee | string | No | Responsible person |
| release_checklist.gate_result | string | Yes | Gate result, enum: go/no_go/conditional |
| release_checklist.blockers | array | Yes | Blocking item list |
| release_checklist.risk_summary | object | Yes | Risk summary |

## Upstream Change Response

When upstream inputs change, this skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Acceptance report change | Check item status | Update acceptance-related check item status, re-evaluate gate result |
| Test report change | Test check items | Update test-related check item status, mark for human confirmation |
| Security assessment change | Security check items | Update security-related check item status, re-evaluate blocking items |
| Gradual release strategy change | Infrastructure check items | Update infrastructure check items, mark for human confirmation |

When the checklist itself changes, the downstream notification mechanism:

| Checklist Change Type | Notification Scope | Notification Method |
|-------------|----------|----------|
| Gate result change | release-gradual | Mark gate change, trigger gradual release decision |
| New blocking item added | change-impact-analysis | Mark blocking item, trigger impact assessment |
| Check item status change | release-notes | Mark status change, trigger release notes update |

---

## Decision Rules

### Release Blocking Rules

| Condition | Decision |
|------|------|
| P0 blocking items exist at T-0 | **Immediately block release** |
| P0 incomplete items exist at T-0 | **Delay release** |
| P0 metrics not met at T+24h | **Trigger post-mortem** |

### Pass Criteria

| Condition | Requirement |
|------|------|
| P0 item completion rate | 100% |
| P1 item completion rate | ≥ 80% |
| Pre-release alerts resolved | 100% |

## Quality Checks

### Quality Gates

| Check Item | Standard | Non-compliance Action |
|--------|------|------------|
| P0 item completion rate (P0) | 100% | Block release |
| Alert resolution rate (P0) | 100% | Delay release |
| Manual confirmation completeness (P1) | All manual items confirmed | Alert |

### Quality Checklist

- [ ] All P0 check items completed (P0)
- [ ] All alerts resolved (P0)
- [ ] Responsible persons confirmed (P1)
- [ ] Documentation updated (P2)
- [ ] Communication notifications sent (P2)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|----------|----------|----------|
| Release content missing | User provides release scope → generate standard checklist | Checklist has no personalization adjustments, uses generic template |
| Monitoring configuration missing | Skip monitoring-related auto-check items, mark as "requires manual confirmation" | T+24h/T+72h monitoring check items require manual execution |
| Release content + monitoring configuration both missing | User provides release scope → generate standard checklist | Output standard checklist template, auto-check items marked as "pending configuration" |

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Release scope**: Services, modules, and change types involved in this release
- **Release time** (optional): Planned release time window
- **Responsible person information** (optional): List of responsible persons for each role

## Execution Log

```json
{
  "execution_id": "exec_p7_xxx",
  "pipeline": "release-auto-checklist",
  "release_id": "release_2024_0125_001",
  "trigger": "scheduled",
  "execution_type": "full_check",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "phases_processed": ["T-7", "T-1"],
  "items_checked": 25,
  "items_passed": 23,
  "items_failed": 0,
  "pending_items": 2,
  "alerts_generated": 2
}
```
