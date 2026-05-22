---
name: risk-identification
description: Use when there is a need to identify and assess project risks. Automated risk identification and assessment, continuously scanning project data, external data, and historical risk library, automatically completing risk identification, assessment, priority ranking, and strategy recommendations, outputting a complete risk register. Keywords: risk identification, risk assessment, risk register, risk scanning, risk priority, risk management, what could go wrong, risk investigation.
metadata:
  module: "Project Management & Execution"
  sub-module: "Risk Management"
  type: "pipeline"
  version: "3.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "What are the project risks"
    - "Help me identify risks"
    - "What could go wrong"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Directly output risk list and priority ranking"
  deep_description: "Complete identification + risk quantitative assessment + correlated risk analysis + risk response roadmap"
---

# Automated Risk Identification and Assessment

## Core Principles

1. **Transparency is Collaboration**: Risk register is visible to all members, risk status is synchronized in real-time
2. **Risk Proactivity**: Establish risk register at project initiation, continuously scan rather than identify only when problems arise
3. **Automated Tracking**: Risk indicators are automatically monitored, trigger conditions are automatically detected

## Interaction Mode

**🤖 AI Auto-Execution (Continuous Operation)**

- Scanning and analysis are automatically completed by AI
- Incremental checks executed every hour
- Full scan executed daily
- New risks are automatically added to the register
- Humans can query and review the risk register at any time

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| project_data | object | Yes | output/pm-project/agile-sprint-planning/sprint_plan.json | Project data (progress, changes, dependencies) |
| external_data | object | ○ | User provided | External data (industry, technology, competition) |
| historical_risk_library | object[] | ○ | User provided | Historical risk library |
| current_risk_register | object | ○ | output/pm-project/risk-identification/risk_register.json | Current risk register (for incremental updates) |

---

## Execution Steps

### Step 1: Automated Risk Source Scanning [Core]

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

### Step 2: Automated Risk Assessment [Core]

**Actions**:
- Assess occurrence probability (P) for each identified risk
- Assess impact level (I) for each risk
- Calculate risk score (RS = P × I)
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

### Step 3: Automated Risk Priority Ranking [Core]

**Actions**:
- Sort by risk score in descending order
- Consider risk urgency (time factor)
- Consider risk correlation (aggregate related risks)
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

### Step 4: Automated Risk Response Strategy Recommendations [Core]

**Actions**:
- Recommend response strategies based on risk type and characteristics
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

### Step 5: Automated Risk Register Maintenance [Core]

**Actions**:
- Merge newly identified risks
- Update status of existing risks
- Close resolved risks
- Generate complete new risk register

**Output**:
```yaml
# risk_register

## Risk Register Summary
- Total risks:
- Critical risks:
- High risks:
- Medium risks:
- Low risks:
- New risks:
- Closed risks:
- Last updated:

## Risk List
<Complete information for each risk>
```

---

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Risk list and priority ranking | Core conclusions + minimum viable deliverable |
| standard | Complete deliverable (current default) | Complete deliverable, including all Step outputs |
| deep | Complete identification + risk quantitative assessment + correlated risk analysis + risk response roadmap | Complete deliverable + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-project/risk-identification/`

**Output Files**: risk_register.json, metadata.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["risk_register", "metadata"],
  "properties": {
    "risk_register": {"type": "object", "description": "Risk register, containing risk list and summary statistics"},
    "metadata": {"type": "object", "description": "Metadata, containing scan time, data sources, and confidence"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| risk_register.risks | array | Yes | Risk list, each item must contain id, description, category, probability, impact, priority |
| risk_register.risks[].id | string | Yes | Risk unique identifier, format RISK-NNN |
| risk_register.risks[].category | string | Yes | Risk category, enum values technical/team/external/business |
| risk_register.risks[].probability | number | Yes | Occurrence probability, range 0.0-1.0 |
| risk_register.risks[].impact | number | Yes | Impact level, range 0.0-1.0 |
| risk_register.risks[].priority | string | Yes | Priority, enum values critical/high/medium/low |
| risk_register.risks[].mitigation_strategy | string | No | Response strategy description |
| risk_register.risks[].owner | string | No | Risk owner |
| risk_register.risks[].status | string | Yes | Risk status, enum values active/mitigated/resolved/closed |
| risk_register.risks[].identified_date | string | Yes | Identification date, ISO 8601 format |
| risk_register.risks[].last_updated | string | Yes | Last updated date, ISO 8601 format |
| risk_register.summary.total_risks | number | Yes | Total number of risks |
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
| Team | Staff turnover, skill gaps, poor communication, collaboration conflicts |
| External | Market changes, policy adjustments, intensified competition, supply chain disruptions |
| Business | Requirement changes, scope creep, acceptance delays, budget overruns |

---

## Decision Rules

| Condition | Action |
|------|------|
| Number of Critical risks > 3 | Immediate escalation notification |
| New risk score > 0.8 | Immediate escalation |
| No match in historical risk library | Lower confidence, mark for manual review |
| Abnormal increase in risk identification frequency | Trigger systematic review |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Risks cover technical, resource, schedule, and external dimensions
- [ ] Each risk has impact and probability assessment

### P1 Checks (must pass for standard/deep)

- [ ] Risk priority ranking is reasonable
- [ ] High-priority risks have response strategies

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Project data | User describes project scope and key dependencies, AI identifies risks based on industry experience | Risk list based on industry experience, lacking actual project data support |
| Historical risk library | Rely entirely on AI industry knowledge for risk identification, annotate "no historical data reference" | Risk register based on AI knowledge, assessment confidence is lower |
| External data | Skip external risk scanning, only identify technical/team/business risks | Risk register missing external dimension, requires manual addition of external risks |
| Current risk register | Generate risk register from scratch, cannot compare with existing risks | Brand new risk register, cannot perform incremental comparison and trend analysis |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Project data missing**: Ask the user to describe the project scope, tech stack, team size, and key dependencies; AI will identify common risks based on industry experience and assess probability and impact
2. **Historical risk library missing**: AI will rely entirely on industry knowledge and general risk patterns to identify risks, annotate "no historical data reference, assessment confidence is lower" in the output, and recommend manual review
3. **External data missing**: Skip the external risk scanning dimension (market/policy/competition), annotate "external risks require manual supplementary assessment" in the risk register

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Project data changes (progress deviation/dependency changes/scope adjustments) | Risk source scanning, risk assessment, priority ranking | Re-scan risk sources, update risk assessment and priorities |
| External data updates (market/policy/competition changes) | External risk scanning, risk assessment | Update external risk scan results, re-assess related risks |
| Historical risk library updates (new cases/lessons) | Risk matching, assessment confidence | Re-match historical cases, update assessment confidence |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Risk register changes (new/updated/closed risks) | Risk management, project manager | Update risk_register.json, notify risk-management |
| Risk priority changes | Risk management judgment, resource allocation | Update risk_register.json, notify risk-management and project manager |
| Risk response strategy changes | Risk management response tracking | Update risk_register.json, notify risk-management |
