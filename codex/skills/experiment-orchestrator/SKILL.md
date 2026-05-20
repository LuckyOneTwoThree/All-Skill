---
name: experiment-orchestrator
description: "Use when designing or executing A/B test experiments. Experiment validation orchestrator dispatching experiment-design/execution. Keywords: A/B testing, experiment design, statistical significance, experiment execution, effect validation, AB test, controlled experiment."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Experiment Validation"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Design an A/B test"
    - "Validate solution effectiveness"
    - "Run a controlled experiment"
    - "Analyze experiment results"
---

# Experiment Design Orchestrator

## Core Principles

**Experiments are the fastest way to learn**

Every experiment is a controlled exploration. The goal is not to prove hypotheses correct, but to gain reliable learning as quickly as possible. The value of experiments lies in learning speed, not experiment count.

## Orchestration Philosophy

1. **Design -> Execution: both stages are essential**: Execution without design is blind; the execution stage includes result analysis and report generation
2. **Human review is a necessary gate for experiments**: Both experiment plans and experiment reports must be reviewed by humans; the execution process can be automated
3. **Guardrail metrics have veto power**: No matter how positive the primary metric, guardrail metric breaches trigger immediate pause

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: experiment-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-metrics-ops/experiment-orchestrator.md

stages:
  - id: phase-1
    name: "Experiment Design"
    depends_on: []
    skills: [experiment-design]
    gate:
      condition: "Experiment design reviewed and confirmed by human"
      fail_action: "Block experiment launch, modify and re-review"

  - id: phase-2
    name: "Experiment Execution"
    depends_on: [phase-1]
    skills: [experiment-execution]
    gate:
      condition: "Sample size sufficient and statistical testing complete, experiment report reviewed and confirmed by human"
      fail_action: "Extend experiment period or expand traffic"
```

## Stage Execution Plan

#### Invoke experiment-design

```
Invoke: ${experiment-design}
Input:
  hypothesis: provided by user (hypothesis statement)
  available_traffic: provided by user (available traffic)
  metrics_system: metrics-system -> metrics.json (optional)
  historical_data: analysis-funnel/analysis-retention (optional)
Output: output/pm-metrics-ops/experiment-design/
Validation: Hypothesis structured (If-Then-Because-For); primary metric directly corresponds to hypothesis; guardrail metrics cover retention, revenue, and technical dimensions; sample size calculation parameters well-founded
Mode: AI->Human
```

#### Invoke experiment-execution

```
Invoke: ${experiment-execution}
Input:
  experiment_design: output/pm-metrics-ops/experiment-design/experiment_design.json
  experiment_data: provided by user
  termination_conditions: output/pm-metrics-ops/experiment-design/experiment_design.json
  product_background: provided by user (optional)
Output: output/pm-metrics-ops/experiment-execution/
Validation: Experiment group traffic allocation correct; guardrail metrics not triggered; experiment data collection complete; statistical significance calculated correctly; statistical conclusions consistent with data; action recommendations consistent with conclusions; guardrail metrics fully covered; heterogeneity effects analyzed (at least 3 segment dimensions)
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-metrics-ops/ |
| Summary output path | output/phase-reports/pm-metrics-ops/experiment-orchestrator.md |

Downstream connections:
  primary: decision-orchestrator (experiment complete, convert experiment conclusions into decision actions)
  alternatives:
    - target: release-orchestrator
      reason: Experiment results significant, recommend full rollout
      condition: Experiment results statistically significant (p < 0.05) and business impact meets threshold
    - target: analysis-orchestrator
      reason: Experiment results need deeper data analysis
      condition: Experiment results have anomalies or need multi-dimensional drill-down
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Experiment plan reviewed by human | Experiment design reviewed and confirmed by human | Block experiment launch, modify and re-review |
| Statistical significance determined | experiment-result output file generated and non-empty | Extend experiment period or expand traffic |
| Experiment report reviewed | Experiment report reviewed and confirmed by human | Supplement analysis or modify conclusions |
| Stage summary generated | output/phase-reports/pm-metrics-ops/experiment-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Experiment plan review | Experiment design complete | Review hypothesis reasonableness, metric selection, traffic allocation plan |
| Full rollout / termination decision | Experiment result analysis complete | Decide on full rollout, terminate experiment, or extend period |
| Experiment report confirmation | Experiment report generation complete | Confirm report conclusions and action recommendations |

## Decision Rules

| Condition | Action |
|------|--------|
| Sample size reaches 100% | Immediately trigger result analysis |
| Statistically significant (p < 0.05) and stable | Consider early termination |
| Guardrail metric significantly declined | Trigger alert, consider termination |
| Novelty effect significant | Extend experiment period |
| Experiment group consistently negative | Consider early termination |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Experiment design human review not passed | Block experiment launch, return to design stage for modification, do not enter execution stage |
| Guardrail metric exceeds threshold | Immediately pause experiment execution, trigger alert, submit to human decision on whether to terminate experiment |
| Experiment data collection anomaly | Mark data anomaly, pause statistical testing, prompt human to check data pipeline |
| Experiment report human review not passed | Return to execution stage for supplementary analysis, do not pass downstream |
| Multiple experiment traffic conflicts | Queue by priority, lower-priority experiments paused, mark "traffic conflict" |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestration completion |

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
| PRD | pm-design related orchestrator | PRD is the business basis for experiment-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (experiment-design, experiment-execution...) produce domain-specific outputs |

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
