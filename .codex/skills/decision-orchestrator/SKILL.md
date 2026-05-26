---
name: decision-orchestrator
description: "Use when converting data analysis results into decision actions. Data-driven decision orchestrator dispatching decision-dace (DACE decision loop + insight conversion) and decision-culture (data culture building), achieving closed loop from data to decision. Keywords: data decision, DACE loop, data insights, decision framework, data culture, decision-dace, decision-culture, data-driven, decision support."
metadata:
  module: "Product Metrics Operations"
  sub-module: "Decision Loop"
  type: "orchestrator"
  version: "7.0"
  trigger_examples:
    - "Make decisions based on data"
    - "Establish data-driven decision mechanism"
    - "Convert analysis results into actions"
    - "Drive data culture building"
---

# Data-Driven Decision Orchestrator

## Core Principles

**Data drives decisions, but decision authority belongs to humans**

The role of data is to illuminate blind spots in decisions, not to replace decision-makers. In the DACE loop, Define and Analyze are data-driven, Conclude is human-decided, Execute is system-tracked -- this is the optimal division of labor between data and humans.

## Orchestration Philosophy

1. **DACE loop is the main thread, insights embedded, culture is the support**: The DACE loop drives the decision closed loop; the Analyze stage has integrated insight conversion capability; culture building ensures decisions are implemented
2. **Conclude stage must have human participation**: No matter how clear the data, decisions involving business strategy must be confirmed by humans
3. **Decision boundary tiered delegation**: data_decision auto-executed, data_reference pushed for confirmation, human_decision waits for approval

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: decision-orchestrator
version: 7.0
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-metrics-ops/decision-orchestrator.md

stages:
  - id: phase-1
    name: "DACE Decision Loop"
    depends_on: []
    skills: [decision-dace]
    gate:
      condition: "Objectives defined, data analyzed, insights generated, decision options provided"
      fail_action: "Supplement data or redefine objectives"

  - id: phase-2
    name: "Data Culture Building"
    depends_on: [phase-1]
    skills: [decision-culture]
    gate:
      condition: "Report system operating normally (daily/weekly/monthly/quarterly)"
      fail_action: "Check upstream data sources or adjust report templates"
```

## Stage Execution Plan

#### Invoke decision-dace

```
Invoke: ${decision-dace}
Input:
  okr_data: provided by user
  kr_progress: analysis-anomaly -> anomaly_report.json
  experiment_result: experiment-execution -> experiment_result.json
  analysis_result: analysis-anomaly -> anomaly_report.json
  business_context: provided by user (optional)
  insight_library: decision-dace -> insight_library.json (optional)
Output: output/pm-metrics-ops/decision-dace/
Validation: Define stage objectives quantifiable with baselines; Analyze stage covers all data sources; Conclude stage provides at least 2 decision options; Execute stage sets monitoring and rollback mechanisms; insight narratives use business language not data jargon; each insight provides at least 2 decision options; decision boundaries labeled correctly (auto/reference/human); recommended actions have clear next steps and owners
Mode: AI->Human
```

#### Invoke decision-culture

```
Invoke: ${decision-culture}
Input:
  okr_data: decision-dace -> dace_status.json
  decision_records: decision-dace -> decision_insight.json
  team_feedback: provided by user (optional)
Output: output/pm-metrics-ops/decision-culture/
Validation: Daily summary produces no noise alerts when no anomalies; weekly report includes OKR progress and experiment summary; monthly report includes complete metric trends and deviation analysis; all data references in reports traceable to data sources
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-metrics-ops/ |
| Summary output path | output/phase-reports/pm-metrics-ops/decision-orchestrator.md |

Downstream connections:
  primary: design-orchestrator (decision complete, convert decision conclusions into feature changes)
  alternatives:
    - target: experiment-orchestrator
      reason: Decision needs A/B testing to validate effectiveness
      condition: Decision conclusions need quantitative verification
    - target: iteration-orchestrator
      reason: Decision involves iteration priority adjustment
      condition: Decision conclusions impact iteration plan
  special_cases:
    - target: decision-dace
      reason: Only need DACE decision loop, no full decision orchestration required
      condition: Already have analysis conclusions, only need quick decision closed loop

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| DACE loop Define/Analyze complete | dace-define-analyze output file generated and non-empty | Supplement data or redefine objectives |
| Decision options provided | decision-options output file generated and non-empty | Mark as pending, continuously track |
| Data culture report system running | data-culture-report output file generated and non-empty | Check upstream data sources or adjust report templates |
| Stage summary generated | output/phase-reports/pm-metrics-ops/decision-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Conclude stage decision | DACE loop enters Conclude stage | Review analysis conclusions, make final decision |

## Decision Boundary Management

| Decision Type | Description | Execution Method |
|---------|------|---------|
| data_decision | Data clearly supports, can auto-execute | AI auto-executes + post-hoc report |
| data_reference | Data for reference, human decides | Push insights, wait for decision |
| human_decision | Complex decision, human-led | Provide analysis, human decides |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| DACE loop Conclude stage human not responding | Pause Execute stage, preserve Conclude state, support resuming after human returns |
| Insight confidence too low (< 0.5) | Mark as human_decision, do not auto-transmit to culture report, wait for human confirmation |
| OKR data missing | Degrade to user-provided metric data for DACE execution, mark "OKR data to be supplemented" |
| Decision boundary labeling conflict | Mark conflicting items, pause auto-execution, submit to human adjudication |
| Culture report system data source interrupted | Skip affected reports, mark "data source interrupted", other reports generate normally |
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
| PRD | pm-design related orchestrator | PRD is the business basis for decision-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (decision-dace, decision-culture...) produce domain-specific outputs |

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
