---
name: diagnosis-orchestrator
description: "Use when diagnosing product health or tracking competitor dynamics. Intelligent diagnosis commander orchestrating diagnosis-health, diagnosis-competition, competitor-monitoring-report, and product-sunset-plan sub-skills. Keywords: intelligent diagnosis, health score, competitor tracking, problem attribution, MTTR, competitor monitoring, product sunset, product diagnosis, troubleshooting."
metadata:
  module: "Product Monitoring and Iteration"
  sub-module: "Problem Diagnosis"
  type: "orchestrator"
  version: "10.0"
  trigger_examples:
    - "Diagnose product health"
    - "Track competitor dynamics"
    - "Troubleshoot product issues"
    - "Evaluate whether to sunset a product"
---

# Intelligent Diagnosis Commander

## Core Principles

**Rapidly locate problem root causes, reduce MTTR**

The value of diagnosis lies not in producing reports but in shortening the time from problem discovery to root cause identification. Every additional minute of uncertainty means an additional minute of risk exposure and resource waste.

## Orchestration Philosophy

1. **Health first, competitors follow**: First diagnose internal health to locate problems, then track competitor dynamics to find external causes; combining internal and external enables complete attribution
2. **Diagnosis data drives competitor response**: Bottleneck conclusions from health diagnosis directly determine the focus direction and response strategy priority for competitor tracking

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: diagnosis-orchestrator
version: 10.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/diagnosis-orchestrator.md

stages:
  - id: phase-1
    name: "Health Diagnosis"
    depends_on: []
    skills: [diagnosis-health]
    parallel_with: [phase-2]
    gate:
      condition: "Health score deviation within +/-10%"
      fail_action: "Calibrate scoring model or supplement data"

  - id: phase-2
    name: "Competitor Tracking"
    skills: [diagnosis-competition]
    parallel_with: [phase-1]
    gate:
      condition: "Competitor dynamics tracked"
      fail_action: "Supplement competitor data sources or extend tracking period"

  - id: phase-3
    name: "Competitor Monitoring Report"
    depends_on: [phase-2]
    skills: [competitor-monitoring-report]
    gate:
      condition: "Competitor monitoring report reviewed and confirmed by human"
      fail_action: "Supplement analysis or modify response suggestions"

  - id: phase-4
    name: "Product Sunset Plan"
    depends_on: [phase-1]
    skills: [product-sunset-plan]
    trigger: Product sunset requirement
    gate:
      condition: "Product sunset plan reviewed and confirmed by human"
      fail_action: "Supplement analysis or modify migration plan"
```

## Stage Execution Plan

#### Invoke diagnosis-health

```
Invoke: ${diagnosis-health}
Input:
  performance_data: APM/monitoring system
  availability_data: Monitoring system
  user_satisfaction: Feedback system
  business_metrics: Data analytics platform
  competitor_dynamics: diagnosis-competition -> competitor report (optional)
Output: output/pm-monitoring/diagnosis-health/
Validation: Data collection completeness >= 90%; scoring calculation accuracy; trend prediction deviation +/-10%; bottleneck identification coverage >= 90%
Mode: AI->Human
```

#### Invoke diagnosis-competition

```
Invoke: ${diagnosis-competition}
Input:
  competitor_data: Competitor monitoring system
  self_data: Product data platform
  market_data: Industry reports (optional)
  historical_tracking: diagnosis-competition -> historical reports (optional)
Output: output/pm-monitoring/diagnosis-competition/
Validation: Competitor coverage completeness >= 90%; feature change identification timeliness <= 7 days; strategy actionability >= 80%
Mode: AI->Human
```

#### Invoke competitor-monitoring-report

```
Invoke: ${competitor-monitoring-report}
Input:
  competitor_tracking: diagnosis-competition
  competitor_analysis: market-competitor-analysis (optional)
  monitoring_period: User provided (optional)
Output: output/pm-monitoring/competitor-monitoring-report/
Validation: Dynamic coverage complete (all 3 dimensions analyzed: product/market/public opinion); threat assessment evidence-based; response suggestions actionable
Mode: AI->Human
```

#### Invoke product-sunset-plan

```
Invoke: ${product-sunset-plan}
Input:
  health_diagnosis: diagnosis-health
  retention_data: retention-management (optional)
  sunset_target: User provided (sunset target)
  sunset_reason: User provided (sunset reason)
Output: output/pm-monitoring/product-sunset-plan/
Validation: Impact assessment complete (3 dimensions: user/revenue/brand); migration plan feasible; data disposal compliant; timeline executable
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/pm-monitoring/ |
| Summary output path | output/phase-reports/pm-monitoring/diagnosis-orchestrator.md |

Downstream connections:
  primary: iteration-orchestrator (diagnosis completed, adjust iteration plan based on diagnosis conclusions)
  alternatives:
    - target: monitoring-orchestrator
      reason: Diagnosis conclusion indicates need to establish monitoring alerts
      condition: When diagnosis reveals product lacks effective monitoring coverage
    - target: growth-orchestrator
      reason: Diagnosis conclusion indicates growth bottleneck, need growth strategy
      condition: When health decline is primarily caused by growth stagnation
    - target: iteration-orchestrator
      reason: Health extremely low with no improvement room, need iteration improvement or sunset plan
      condition: When health score < 30 and no improvement for 3 consecutive cycles
  special_cases:
    - target: monitoring-orchestrator
      reason: Only need health diagnosis, no full diagnosis orchestration needed
      condition: When competitor data already exists, only product health check needed

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Health score deviation +/-10% | diagnosis-health output files generated and non-empty | Calibrate scoring model or supplement data |
| Competitor dynamics tracked | diagnosis-competition output files generated and non-empty | Supplement competitor data sources or extend tracking period |
| Competitor monitoring report reviewed | Competitor monitoring report reviewed and confirmed by human | Supplement analysis or modify response suggestions |
| Product sunset plan reviewed | Product sunset plan reviewed and confirmed by human | Supplement analysis or modify migration plan |
| Quality acceptance | If acceptance needed, transfer to release-orchestrator to execute quality-acceptance | -- |
| Stage summary generated | output/phase-reports/pm-monitoring/diagnosis-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Downstream Connections

- Diagnosis completed -> iteration-orchestrator (adjust iteration plan)
- Lacks monitoring coverage -> monitoring-orchestrator
- Growth stagnation -> growth-orchestrator
- Health extremely low -> iteration-orchestrator (develop iteration improvement or sunset plan)
- Only health check needed -> monitoring-orchestrator

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Health score calibration | Health score deviation from actual perception exceeds +/-10% | Confirm scoring model calibration plan and weight adjustments |
| Competitor monitoring report confirmation | Competitor monitoring report generated | Confirm threat assessment and response suggestions |
| Product sunset plan confirmation | Product sunset plan generated | Confirm sunset timeline and user migration plan |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Health score model deviation too large (> +/-15%) | Pause automatic diagnosis, request manual calibration of scoring model weights before re-running |
| Competitor data source unavailable | Generate snapshot analysis based on most recent historical report, mark "data source unavailable, based on historical data" |
| Sub-skill output validation failed | Roll back to current stage and re-execute, max 1 retry; if still fails, mark exception and escalate to human |
| Upstream/downstream data format incompatible | Map fields and fill default values per downstream sub-skill input schema, record mapping relationships |
| Stage summary generation failed | Generate partial summary based on completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |

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
| PRD | pm-design related orchestrator | PRD is the business basis for diagnosis-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (competitor-monitoring-report, diagnosis-health, product-sunset-plan...) produce domain-specific outputs |

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
