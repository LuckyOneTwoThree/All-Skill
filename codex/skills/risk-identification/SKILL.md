---
name: risk-identification
description: "Use when identifying and assessing project risks. Automates risk identification and assessment, continuously scanning project data, external data, and historical risk library to complete risk identification, assessment, priority ranking, and strategy suggestions. Keywords: risk identification, risk assessment, risk register, risk scanning, risk priority, risk management."
metadata:
  module: "Project Management & Execution"
  sub-module: "Risk Management"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "What are the project risks"
    - "Help me identify risks"
    - "What could go wrong"
---

# Risk Auto-identification & Assessment

## Core Principles

1. **Transparency Enables Collaboration**: Risk register is visible to all, risk status synchronized in real-time
2. **Risk Early Identification**: Establish risk register at project initiation, continuously scan rather than identifying only when problems arise
3. **Automated Tracking**: Risk indicators automatically monitored, trigger conditions automatically detected

## Interaction Mode

**AI AI Auto-execution (continuous operation)**

- Scanning and analysis completed automatically by AI
- Incremental checks executed hourly
- Full scans executed daily
- New risks automatically added to register
- Human can query and review risk register at any time

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| project_data | object | Yes | output/pm-project/agile-sprint-planning/sprint_plan.json | Project data (progress, changes, dependencies) |
| external_data | object | O | User provided | External data (industry, technology, competition) |
| historical_risk_library | object[] | O | User provided | Historical risk library |
| current_risk_register | object | O | output/pm-project/risk-identification/risk_register.json | Current risk register (for incremental updates) |

---

## Execution Steps

### Step 1: Risk Source Auto-scanning

**Actions**:
- Scan technical risk sources (architecture, technical debt, dependencies)
- Scan team risk sources (personnel, capabilities, collaboration)
- Scan external risk sources (market, policy, competition)
- Scan business risk sources (requirements, scope, acceptance)

**Output**:
```json
{
  "risk_sources": {
    "technical": [{
      "source_id": "TECH-001",
      "source_type": "architecture | dependency | quality | security",
      "description": "string",
      "signal_strength": 0.0-1.0,
      "evidence": ["string"]
    }],
    "team": [{
      "source_id": "TEAM-001",
      "source_type": "capacity | skill | collaboration | stability",
      "description": "string",
      "signal_strength": 0.0-1.0,
      "evidence": ["string"]
    }],
    "external": [{
      "source_id": "EXT-001",
      "source_type": "market | regulatory | competitive | environmental",
      "description": "string",
      "signal_strength": 0.0-1.0,
      "evidence": ["string"]
    }],
    "business": [{
      "source_id": "BIZ-001",
      "source_type": "requirement | scope | stakeholder | acceptance",
      "description": "string",
      "signal_strength": 0.0-1.0,
      "evidence": ["string"]
    }]
  }
}
```

### Step 2: Risk Auto-assessment

**Actions**:
- Assess occurrence probability (P) for each identified risk
- Assess impact severity (I) for each risk
- Calculate risk score (RS = P x I)
- Annotate assessment confidence

**Output**:
```json
{
  "risk_assessments": [{
    "risk_id": "RISK-001",
    "description": "string",
    "category": "technical | team | external | business",
    "probability": 0.0-1.0,
    "probability_rationale": "string",
    "impact": 0.0-1.0,
    "impact_rationale": "string",
    "risk_score": 0.0-1.0,
    "assessment_confidence": 0.0-1.0,
    "assessment_method": "data-driven | heuristic | hybrid"
  }]
}
```

### Step 3: Risk Priority Auto-ranking

**Actions**:
- Sort by risk score in descending order
- Consider risk urgency (time factor)
- Consider risk correlation (related risk aggregation)
- Generate priority matrix

**Output**:
```json
{
  "risk_prioritization": {
    "priority_matrix": {
      "critical": ["RISK-ID"],
      "high": ["RISK-ID"],
      "medium": ["RISK-ID"],
      "low": ["RISK-ID"]
    },
    "sorted_risks": [{
      "rank": 1,
      "risk_id": "RISK-001",
      "risk_score": 0.0-1.0,
      "urgency_factor": 0.0-1.0,
      "final_priority": 1
    }]
  }
}
```

### Step 4: Risk Response Strategy Auto-suggestion

**Actions**:
- Suggest response strategies based on risk type and characteristics
- Provide multiple strategy options (avoid, transfer, mitigate, accept)
- Estimate cost and effectiveness for each strategy
- Specify recommended owner

**Output**:
```json
{
  "risk_strategies": [{
    "risk_id": "RISK-001",
    "strategy_options": [{
      "strategy": "avoid | transfer | mitigate | accept",
      "description": "string",
      "estimated_cost": "low | medium | high",
      "estimated_effectiveness": 0.0-1.0,
      "implementation_effort": "low | medium | high",
      "recommended": boolean
    }],
    "recommended_strategy": "string",
    "recommended_owner": "string",
    "implementation_timeline": "string"
  }]
}
```

### Step 5: Risk Register Auto-maintenance

**Actions**:
- Merge newly identified risks
- Update status of existing risks
- Close resolved risks
- Generate complete new risk register

**Output**:
```yaml
# risk_register

## Risk Register Summary
- Total Risks:
- Critical Risks:
- High Risks:
- Medium Risks:
- Low Risks:
- New Risks:
- Closed Risks:
- Last Updated:

## Risk List
{Complete information for each risk}
```

---

## Output

**Storage Path**: `output/pm-project/risk-identification/`

**Output Files**: risk_register.json, metadata.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["risk_register", "metadata"],
  "properties": {
    "risk_register": {"type": "object", "description": "Risk register including risk list and summary statistics"},
    "metadata": {"type": "object", "description": "Metadata including scan time, data sources, and confidence"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| risk_register.risks | array | Yes | Risk list, each must contain id, description, category, probability, impact, priority |
| risk_register.risks[].id | string | Yes | Risk unique identifier, format RISK-NNN |
| risk_register.risks[].category | string | Yes | Risk category, enum values technical/team/external/business |
| risk_register.risks[].probability | number | Yes | Occurrence probability, range 0.0-1.0 |
| risk_register.risks[].impact | number | Yes | Impact severity, range 0.0-1.0 |
| risk_register.risks[].priority | string | Yes | Priority, enum values critical/high/medium/low |
| risk_register.risks[].mitigation_strategy | string | No | Response strategy description |
| risk_register.risks[].owner | string | No | Risk owner |
| risk_register.risks[].status | string | Yes | Risk status, enum values active/mitigated/resolved/closed |
| risk_register.risks[].identified_date | string | Yes | Identification date, ISO 8601 format |
| risk_register.risks[].last_updated | string | Yes | Last updated date, ISO 8601 format |
| risk_register.summary.total_risks | number | Yes | Total risks |
| risk_register.summary.by_priority | object | Yes | Distribution by priority, containing critical/high/medium/low counts |
| risk_register.summary.trend | string | Yes | Trend, enum values stable/increasing/decreasing |
| metadata.scan_time | string | Yes | Scan time, ISO 8601 format |
| metadata.data_sources | array | Yes | Data source list |
| metadata.confidence | number | Yes | Overall confidence, range 0.0-1.0 |
| metadata.new_risks_identified | number | Yes | Number of newly identified risks |
| metadata.risks_resolved | number | Yes | Number of resolved risks |

```json
{
  "risk_register": {
    "risks": [{
      "id": "RISK-001",
      "description": "Video transcoding service provider API rate limiting may cause course upload delays",
      "category": "external",
      "probability": 0.6,
      "impact": 0.8,
      "priority": "high",
      "mitigation_strategy": "Integrate backup transcoding provider, implement automatic failover",
      "owner": "Wang Fang (Backend Lead)",
      "status": "active",
      "identified_date": "2024-04-02",
      "last_updated": "2024-04-05"
    }],
    "summary": {
      "total_risks": 12,
      "by_priority": {"critical": 1, "high": 3, "medium": 5, "low": 3},
      "trend": "stable"
    }
  },
  "metadata": {
    "scan_time": "2024-04-05T10:30:00+08:00",
    "data_sources": ["sprint_plan.json", "Historical risk library", "Project progress data"],
    "confidence": 0.85,
    "new_risks_identified": 2,
    "risks_resolved": 1
  }
}
```

---

## Risk Classification Reference

| Category | Typical Risks |
|------|----------|
| Technical | Architecture mismatch, technical debt, dependency delays, security vulnerabilities |
| Team | Personnel turnover, skill gaps, communication breakdown, collaboration conflicts |
| External | Market changes, policy adjustments, increased competition, supply chain disruption |
| Business | Requirement changes, scope creep, acceptance delays, budget overruns |

---

## Decision Rules

| Condition | Action |
|------|------|
| Critical risk count > 3 | Immediate escalation notification |
| New risk score > 0.8 | Immediate escalation |
| No match in historical risk library | Lower confidence, mark for human review |
| Abnormal increase in risk identification frequency | Trigger systematic review |

## Quality Checks

- [ ] Risks cover technical, resource, schedule, and external dimensions
- [ ] Each risk has impact and probability assessment
- [ ] Risk priority ranking is reasonable
- [ ] High-priority risks have response strategies

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Project data | User describes project scope and key dependencies, AI identifies risks based on industry experience | Risk list based on industry experience, lacking actual project data support |
| Historical risk library | Rely entirely on AI industry knowledge for risk identification, mark "No historical data reference" | Risk register based on AI knowledge, lower assessment confidence |
| External data | Skip external risk scanning, only identify technical/team/business risks | Risk register lacking external dimension, requires manual supplementation of external risks |
| Current risk register | Generate risk register from scratch, cannot compare with existing risks | Brand new risk register, cannot perform incremental comparison and trend analysis |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Project data missing**: Ask user to describe project scope, tech stack, team size, and key dependencies; AI will identify common risks based on industry experience and assess probability and impact
2. **Historical risk library missing**: AI will rely entirely on industry knowledge and general risk patterns to identify risks, mark in output "No historical data reference, lower assessment confidence", suggest human review
3. **External data missing**: Skip external risk scanning dimension (market/policy/competition), mark in risk register "External risks require manual supplementary assessment"

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Project data change (progress deviation/dependency change/scope adjustment) | Risk source scanning, risk assessment, priority ranking | Re-scan risk sources, update risk assessment and priority |
| External data update (market/policy/competition change) | External risk scanning, risk assessment | Update external risk scanning results, re-assess related risks |
| Historical risk library update (new cases/lessons) | Risk matching, assessment confidence | Re-match historical cases, update assessment confidence |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Risk register change (new/updated/closed risks) | Risk management, project manager | Update risk_register.json, notify risk-management |
| Risk priority change | Risk management judgment, resource allocation | Update risk_register.json, notify risk-management and project manager |
| Risk response strategy change | Risk management response tracking | Update risk_register.json, notify risk-management |
