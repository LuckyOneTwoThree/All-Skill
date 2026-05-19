---
name: risk-orchestrator
description: "Use when identifying project risks or handling risk escalation. Risk management commander orchestrating risk-identification and risk-management sub-skills. Keywords: risk management, risk identification, risk monitoring, risk escalation, risk register, risk early warning, emergency escalation, project risk."
metadata:
  module: "Project Management and Execution"
  sub-module: "Risk Management"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Identify project risks"
    - "Monitor project risks"
    - "Handle risk escalation"
    - "Establish a risk early warning mechanism"
---

# Risk Management Commander

## Core Principles

**Risks do not disappear on their own; if you do not manage them, they manage you**

Risk is the most certain uncertainty in a project. Ignoring risks does not make them disappear; it only causes them to erupt at the least expected time in the least expected way. Proactively managing risk is the baseline capability of project management.

1. **Identification precedes response** -- The orchestration focus of risk management is in the identification phase; unidentified risks cannot be managed. The orchestrator should ensure risk scanning covers four dimensions: technical, resource, schedule, and external, leaving no blind spots.
2. **Monitoring forms a continuous loop** -- Risk monitoring is not a one-time activity but a continuous cycle. The orchestrator should ensure risk status is updated every cycle and early warning trigger conditions remain effective.
3. **Escalation cannot be delayed** -- When risk reaches escalation thresholds, delay is dereliction. The orchestrator should ensure escalation processes are automatically triggered within SLA, not dependent on human judgment for whether to escalate.

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: risk-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-project/risk-orchestrator.md

stages:
  - id: phase-1
    name: "Risk Identification"
    depends_on: []
    skills: [risk-identification]
    gate:
      condition: "Risk register established"
      fail_action: "Supplement risk scanning or extend identification period"

  - id: phase-2
    name: "Risk Monitoring and Escalation"
    depends_on: [phase-1]
    skills: [risk-management]
    gate:
      condition: "Risks monitored and escalation handled"
      fail_action: "Supplement monitoring metrics or adjust early warning thresholds, execute escalation immediately"
```

## Stage Execution Plan

#### Invoke risk-identification

```
Invoke: ${risk-identification}
Input:
  project_data: agile-sprint-planning -> sprint_plan.json
  external_data: User provided (optional)
  historical_risk_library: User provided (optional)
  current_risk_register: risk-identification -> risk_register.json (optional)
Output: output/pm-project/risk-identification/
Validation: Risk coverage across 4 dimensions: technical, resource, schedule, external; each risk has impact and probability assessment; risk priority ranking reasonable; high-priority risks have response strategies
Mode: AI
```

#### Invoke risk-management

```
Invoke: ${risk-management}
Input:
  risk_register: risk-identification -> risk_register.json
  project_data: Project management system
  trigger_conditions: User provided
  mitigation_tracking: risk-management -> response tracking (optional)
  issue_data: User provided
  escalation_rules: User provided
  organizational_structure: User provided
  pending_escalations: risk-management -> escalation records (optional)
Output: output/pm-project/risk-management/
Validation: Risk status updated timely; early warning trigger conditions clear; risk trend analysis covers at least 3 cycles; high-risk items have follow-up records; escalation paths match risk levels; escalation notifications sent within SLA; escalation timeouts have automatic follow-up mechanisms
Mode: AI
```

### Stage Summary (post_pipeline)

Follow the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-skill output path | output/pm-project/ |
| Summary output path | output/phase-reports/pm-project/risk-orchestrator.md |

Downstream connections:
  primary: agile-orchestrator (risk management completed, incorporate risk responses into Sprint planning)
  alternatives:
    - target: monitoring-orchestrator
      reason: Risk involves production monitoring
      condition: When risk type is ops or security risk
    - target: project-planning-orchestrator
      reason: Risk affects project scope or resources
      condition: When risk level changes require project charter adjustment
  special_cases: []

## Stage Gates

| Gate | Condition | Failure Handling |
|------|------|------------|
| Risk register established | risk-identification output files generated and non-empty | Supplement risk scanning or extend identification period |
| Risks monitored and escalation handled | risk-management output files generated and non-empty | Supplement monitoring metrics or adjust early warning thresholds, execute escalation immediately |
| Stage summary generated | output/phase-reports/pm-project/risk-orchestrator.md generated and all 6 structural items non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Risk response strategy confirmation | New risk identified or risk status changed | Confirm response strategy (avoid/transfer/mitigate/accept) |
| Escalation decision | Risk escalation triggered | Confirm escalation path and resource allocation |

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Stage 1 sub-skill (risk identification) failed | Pause risk process, output failure reason, prompt user to supplement project data before retry |
| Upstream data missing (e.g., project data, historical risk library) | Execute risk scanning based on limited data, mark identification coverage insufficient, prompt user to supplement before re-scanning |
| Key decision point not confirmed by human (e.g., risk response strategy) | Pause escalation process, adopt default conservative strategy (avoid/mitigate), mark pending confirmation, continue waiting for human decision |
| All upstream data missing | Mark "all data missing" status, output minimal template (metadata and empty structure only), set overall confidence to 0.3, force human confirmation on whether to continue. After human confirmation, generate based on user-provided information and AI knowledge base inference, all inferred content marked with confidence <= 0.5 and needs_human_validation: true |
| Stage summary generation failed | Generate partial summary based on completed sub-skill outputs, mark missing items as "data missing", do not block orchestration completion |

## Changelog

- v1.0: Initial version
