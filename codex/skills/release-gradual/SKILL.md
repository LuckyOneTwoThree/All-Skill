---
name: release-gradual
description: "Use when executing gradual rollout. Automated gradual rollout execution, from 1% to 10% to 50% to 100%, with automatic metric monitoring and stage transition decisions at each phase, supporting auto-rollback on P0 metric degradation. Keywords: gradual rollout, progressive release, Feature Flag, auto-rollback, release strategy, canary release, small traffic, incremental rollout."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Release & Go-live"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Do a gradual rollout, start with 1% traffic"
    - "Help me do small traffic verification"
    - "Incrementally roll out to full traffic"
execution_depth:
  default: standard
  quick_description: "Output rollout plan and go/no-go criteria only"
  deep_description: "Full rollout + rollback simulation + feature flag strategy + progressive delivery roadmap"
---

# Gradual Rollout Auto-Execution

## Core Principles

1. **Trigger-driven**: Auto-triggered by quality gate pass events, metric degradation auto-triggers rollback
2. **Automated acceptance**: Metrics auto-monitored at each phase, stage transitions auto-determined, rollback auto-executed
3. **Continuous deployment**: Gradual strategy combined with Feature Flags, enabling progressive deployment and instant rollback
4. **Real-time review**: Metrics aggregated in real-time at each phase, post-release review input generated immediately upon completion

## Interaction Mode

AI **AI auto-execution**

Trigger Conditions:
- Quality gate passed
- Manual trigger (release lead confirmation)

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Release Content | JSON | Yes | Release management system | Version and change content to release |
| Feature Flag Configuration | JSON | Yes | Feature Flag system | Gradual switch configuration |
| Monitoring Metric Definitions | JSON | Yes | Monitoring system | Metrics to monitor at each phase |
| Gradual Strategy Configuration | JSON | Yes | Release strategy library | Traffic percentages and durations for each phase |

## Gradual Phase Configuration

### Standard Gradual Phases

| Phase | Traffic % | Duration | Min Duration | Pass Condition |
|-------|-----------|----------|--------------|----------------|
| Stage 0 | 0% (Verification) | - | 10 minutes | Build verification passed |
| Stage 1 | 1% | 30 minutes | 30 minutes | Core metrics normal |
| Stage 2 | 10% | 2 hours | 1 hour | P0 metrics stable |
| Stage 3 | 50% | 4 hours | 2 hours | No new anomalies |
| Stage 4 | 100% | - | - | All conditions passed |

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

### Step 1: Gradual Plan Generation [Core]

#### 1.1 Pre-Release Verification

**Verification Checklist**:

| Verification Item | Check Content | Failed Action |
|-------------------|---------------|---------------|
| Build artifact | Verify build artifact integrity | Block release |
| Rollback version | Confirm rollback version available | Block release |
| Feature Flag | Verify Flag configuration correct | Block release |
| Monitoring alerts | Verify alert rules configured | Block release |
| On-call personnel | Confirm on-call personnel online | Warning |

#### 1.2 Gradual Plan Generation

Generate canary plan with phases, traffic percentages, durations, and success criteria.

### Step 2: Feature Flag Auto-Configuration [Core]

Generate Feature Flag serving configurations for each phase with appropriate traffic percentage rules.

### Step 3: Phase-by-Phase Auto-Monitoring [Core]

#### 3.1 Metric Collection

Collect metrics at configured intervals from monitoring sources.

#### 3.2 Phase Status Assessment

**Assessment Rules**:

| Metric Type | Assessment Condition | Assessment Result |
|-------------|---------------------|-------------------|
| All P0 normal | No metric exceeds warning threshold | **Can proceed to next phase** |
| Any P0 warning | Any metric exceeds warning but not rollback | **Continue observing** |
| P0 degradation | Any metric exceeds rollback threshold | **Immediately rollback** |
| P1 warning | P1 metric exceeds threshold | **Delay + alert** |

#### 3.3 Phase Transition Decision

Evaluate whether to proceed to next phase based on duration completion and metric health.

### Step 4: Auto-Rollback Trigger [Core]

#### 4.1 Rollback Trigger Conditions

| Condition | Trigger Action | Delay |
|-----------|----------------|-------|
| P0 metric exceeds rollback threshold | **Immediate auto-rollback** | 0 seconds |
| Service unavailable | **Immediate auto-rollback** | 0 seconds |
| P1 metric exceeds rollback threshold | Delayed observation | 5 minutes |
| Human confirmed anomaly | Manual trigger | 0 seconds |

#### 4.2 Rollback Execution

Execute rollback by disabling Feature Flag, switching traffic, and verifying rollback results.

#### 4.3 Post-Rollback Handling

Notify release team, document rollback event, create incident follow-up ticket, and analyze root cause within 24 hours.

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | rollout plan and go/no-go criteria only | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full rollout + rollback simulation + feature flag strategy + progressive delivery roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage path**: `output/pm-monitoring/release-gradual/`

**Output file**: `release_status.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["output_id", "release_id", "release_status"],
  "properties": {
    "output_id": {"type": "string", "description": "Output unique identifier"},
    "release_id": {"type": "string", "description": "Release ID"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "release_status": {"type": "object", "description": "Current release status, including phase, traffic percentage and progress"},
    "phase_transitions": {"type": "array", "description": "Phase transition history records"},
    "rollback_history": {"type": "array", "description": "Rollback history records"},
    "monitoring_metrics": {"type": "object", "description": "Monitoring data summary, including current and historical metrics"},
    "canary_plan": {"type": "object", "description": "Gradual rollout plan"}
  }
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| gradual_release | object | Yes | Gradual release root object |
| gradual_release.strategy | object | Yes | Gradual strategy |
| gradual_release.strategy.type | string | Yes | Strategy type, enum: canary/blue_green/rolling/feature_flag |
| gradual_release.strategy.stages | array | Yes | Gradual stage list, at least 2 |
| gradual_release.strategy.stages[].name | string | Yes | Stage name |
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

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|--------------|-------------------|
| Release checklist change | Gradual strategy and gate | Re-evaluate gradual gate conditions, mark for human confirmation |
| Acceptance report change | Gradual start conditions | Update gradual start conditions, re-evaluate whether to begin gradual rollout |
| Monitoring metric change | Monitoring configuration and alert rules | Update monitoring metrics and alert thresholds, mark for human confirmation |
| PRD requirement change | Gradual scope and feature verification | Re-evaluate gradual scope, mark for human confirmation |

## Decision Rules

### Auto-Rollback Rules

| Trigger Condition | Execution Action | Priority |
|-------------------|------------------|----------|
| P0 metric exceeds rollback threshold | Immediate auto-rollback | Highest |
| Service completely unavailable | Immediate auto-rollback | Highest |
| P1 metric exceeds rollback threshold | Rollback after 5-minute delay | High |
| P2 metric exceeds rollback threshold | Alert, wait for human confirmation | Medium |

### Phase Pass Rules

| Condition | Decision |
|-----------|----------|
| All P0 metrics normal | Can proceed to next phase |
| Phase duration completed | Evaluate whether to proceed to next phase |
| P0 alert exists (not exceeding threshold) | Extend observation time |
| P1 alert exists | Warning, proceed to next phase |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Pre-release verification (All verification items passed)
- [ ] P0 metrics stable (No metric degradation trend)

### P1 Checks (must pass for standard/deep)

- [ ] Rollback mechanism ready (Feature Flag available)
- [ ] Alert configuration correct (All metrics have alerts configured)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|---------------|------------------|---------------|
| Release content missing | User provides feature list -> generate gradual plan template | Release content details need manual supplement |
| Feature Flag configuration missing | Generate gradual plan but exclude Flag auto-configuration steps | Need manual Feature Flag configuration |
| Monitoring metrics missing | Use default P0/P1/P2 metric template, mark "pending confirmation" | Alert thresholds based on generic template |
| All three missing | User provides feature list -> generate gradual plan template | Output gradual plan template, all configurations marked "pending confirmation" |

### Data Acquisition Instructions

When upstream files are missing, user needs to provide the following information to support degraded generation:
- **Release feature list**: Features and changes included in this release
- **Rollback version** (optional): Previous version number available for rollback
- **Key monitoring metrics** (optional): Business and technical metrics to focus on
