---
name: planning-project-charter
description: Use when generating a project charter document. Project charter auto-generation, transforming product background, strategic objectives, and resource constraints into a formal project charter document, including background, objectives & scope, success criteria, stakeholders, preliminary risk assessment, resource requirements, and timeline. Keywords: project charter, project articles of association, project objectives, project scope, success criteria, project definition.
metadata:
  module: "Project Management & Execution"
  sub-module: "Project Planning"
  type: "pipeline"
  version: "3.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "How to write a project charter"
    - "Help me create a project charter"
    - "How to define project objectives and scope"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Output project charter and objectives directly"
  deep_description: "Full charter + stakeholder alignment + risk contingency + governance mechanism design"
---

# Project Charter Auto-generation

## Core Principles

1. **Transparency Enables Collaboration**: Project charter is visible to all, with objectives, scope, and success criteria transparent, eliminating information asymmetry
2. **Risk Early Identification**: Identify preliminary risks at the charter generation stage, establishing the initial risk register
3. **Automated Tracking**: Charter approval status and change records are automatically tracked, reducing manual reporting burden

## Interaction Mode

**🤖→👤 AI Suggests, Human Approves**

- AI automatically completes Step 1-6, generating a complete project charter draft
- Human review focus: objective definition, scope boundaries, success criteria, stakeholder identification
- Human can request AI to modify specific sections, AI regenerates
- After human approval, the charter becomes officially effective

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| product_background | string | Yes | User provided | Product background information |
| strategic_goals | string[] | Yes | User provided | Strategic objectives list |
| resource_constraints | object | ○ | User provided | Resource constraint conditions |

---

## Execution Steps

### Step 1: Project Background Auto-compilation [Core]

**Actions**:
- Extract key product information (product name, positioning, core value)
- Compile market background and competitive environment
- Identify project origin and driving factors
- Generate concise project background description (within 200 words)

**Output**:
```json
{
  "background_summary": "string",
  "product_info": {
    "name": "string",
    "positioning": "string",
    "core_value": "string"
  },
  "market_context": "string",
  "project_drivers": ["string"]
}
```

### Step 2: Objectives & Scope Auto-definition [Core]

**Actions**:
- Decompose strategic objectives into measurable project objectives
- Distinguish project scope (what to do) and non-project scope (what not to do)
- Clarify risk scope (factors that may cause objective deviation)
- Generate SMART objective descriptions

**Output**:
```json
{
  "objectives": [{
    "id": "OBJ-001",
    "description": "string",
    "measurable": "string",
    "target_date": "ISO date"
  }],
  "scope": {
    "in_scope": ["string"],
    "out_of_scope": ["string"]
  },
  "risk_scope": ["string"]
}
```

### Step 3: Success Criteria Auto-quantification [Core]

**Actions**:
- Define quantifiable success criteria for each objective
- Determine key performance indicators (KPIs)
- Set baseline values and target values
- Distinguish between "must achieve" and "desired to achieve"

**Output**:
```json
{
  "success_criteria": [{
    "objective_id": "OBJ-001",
    "kpi": "string",
    "baseline": "number",
    "target": "number",
    "measurement_method": "string",
    "must_achieve": true | false
  }]
}
```

### Step 4: Stakeholder Auto-identification [Core]

**Actions**:
- Scan stakeholders involved in the project (individuals, teams, departments)
- Assess each party's interests and influence
- Identify key decision makers and approvers
- Generate stakeholder matrix

**Output**:
```json
{
  "stakeholders": [{
    "name": "string",
    "role": "string",
    "interest": "string",
    "influence": "high | medium | low",
    "engagement_level": "string"
  }],
  "key_decision_makers": ["string"],
  "approval_required": ["string"]
}
```

### Step 5: Preliminary Risk Assessment [Core]

**Actions**:
- Identify preliminary risks based on project background
- Assess probability and impact for each risk
- Suggest preliminary response strategies
- Sort by priority

**Output**:
```json
{
  "initial_risk_assessment": [{
    "id": "RISK-001",
    "description": "string",
    "category": "technical | team | external | business",
    "probability": 0.0-1.0,
    "impact": 0.0-1.0,
    "priority": "high | medium | low",
    "initial_mitigation": "string"
  }]
}
```

### Step 6: Project Charter Document Generation [Core]

**Actions**:
- Integrate outputs from the above 5 steps
- Generate formal project charter document
- Format output as structured document
- Prepare human approval version

**Output**:
```yaml
# project_charter

## Basic Information
- Project Name:
- Charter Version:
- Effective Date:
- Charter Owner:

## 1. Project Background
{Step 1 Output}

## 2. Objectives & Scope
{Step 2 Output}

## 3. Success Criteria
{Step 3 Output}

## 4. Stakeholders
{Step 4 Output}

## 5. Preliminary Risk Assessment
{Step 5 Output}

## 6. Resource Requirements Summary
{Estimated based on available information}

## 7. Timeline Summary
{Estimated based on available information}

## Approval Signatures
- Project Sponsor:
- Project Manager:
- Date:
```

---

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Project charter and objectives | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (current default) | Complete deliverables including all Step outputs |
| deep | Full charter + stakeholder alignment + risk contingency + governance mechanism design | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-project/planning-project-charter/`

**Output Files**: project_charter.json, metadata.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["project_charter", "metadata"],
  "properties": {
    "project_charter": {"type": "object", "description": "Project charter including background, objectives, success criteria, stakeholders, and risk assessment"},
    "metadata": {"type": "object", "description": "Metadata including confidence, generation time, and approval status"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| project_charter.background.summary | string | Yes | Project background summary, must be < 200 words |
| project_charter.background.product_info.name | string | Yes | Product name |
| project_charter.background.product_info.core_value | string | Yes | Core value description |
| project_charter.objectives | array | Yes | Project objectives list, at least 1 item |
| project_charter.objectives[].id | string | Yes | Objective unique identifier, format OBJ-NNN |
| project_charter.objectives[].measurable | string | Yes | Measurable indicator description |
| project_charter.objectives[].target_date | string | Yes | Objective achievement date, ISO 8601 format |
| project_charter.scope.in_scope | array | Yes | In-scope items, at least 1 item |
| project_charter.scope.out_of_scope | array | Yes | Out-of-scope items, at least 1 item |
| project_charter.success_criteria | array | Yes | Success criteria list, at least 1 item |
| project_charter.success_criteria[].must_achieve | boolean | Yes | Whether it must be achieved |
| project_charter.stakeholders | array | Yes | Stakeholder list, at least 1 item |
| project_charter.stakeholders[].influence | string | Yes | Influence level, enum values high/medium/low |
| project_charter.initial_risk_assessment | array | No | Preliminary risk assessment list |
| project_charter.initial_risk_assessment[].category | string | Yes | Risk category, enum values technical/team/external/business |
| project_charter.initial_risk_assessment[].priority | string | Yes | Risk priority, enum values high/medium/low |
| metadata.confidence | number | Yes | Overall confidence, range 0.0-1.0 |
| metadata.generated_at | string | Yes | Generation time, ISO 8601 format |
| metadata.human_approval_required | boolean | Yes | Whether human approval is required, must be true for charter |
| metadata.approval_status | string | Yes | Approval status, enum values pending/approved/rejected |

```json
{
  "project_charter": {
    "background": {
      "summary": "string",
      "product_info": {},
      "market_context": "string",
      "project_drivers": []
    },
    "objectives": {
      "scope": {},
      "risk_scope": []
    },
    "success_criteria": [],
    "stakeholders": [],
    "initial_risk_assessment": [],
    "resource_requirements": {},
    "timeline": {}
  },
  "metadata": {
    "confidence": 0.0-1.0,
    "generated_at": "ISO datetime",
    "human_approval_required": true,
    "approval_status": "pending | approved | rejected"
  }
}
```

---

## Confidence Annotation

Each Step output must include confidence annotation:

| Confidence | Meaning | Action |
|--------|------|------|
| High (≥0.8) | Sufficient data, reasonable inference | Can be used directly |
| Medium (0.6-0.8) | Basically sufficient data, some inference | Recommend human confirmation |
| Low (<0.6) | Insufficient data or high inference uncertainty | Must be reviewed by human |

---

## Decision Rules

| Condition | Action |
|------|------|
| Strategic objectives cannot align with project objectives | Escalate to human decision |
| Stakeholder identification misses key personnel | Escalate to human for supplementation |
| Success criteria cannot be quantified | Escalate to human for definition |
| Number of preliminary risks > 10 | Select Top 10, archive the rest as alternatives |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Project objectives follow SMART principles
- [ ] Stakeholders cover all key roles

### P1 Checks (must pass for standard/deep)

- [ ] Success criteria are quantifiable and verifiable
- [ ] Preliminary risk list includes impact and probability assessment

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Product background | User describes project objectives and core value, AI generates background summary based on description | Charter draft generated from user description, lacking market background and competitive environment analysis |
| Strategic objectives | User verbally states desired objectives, AI converts to SMART objectives | Objective definition based on verbal conversion, requires human confirmation of SMART compliance |
| Resource constraints | Skip resource requirement estimation, mark "Resource requirements pending assessment" in charter | Charter draft contains pending resource assessment items, need to supplement in resource planning stage |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Product background missing**: Ask user to describe project objectives, product positioning, and core value; AI will compile into structured project background summary
2. **Strategic objectives missing**: Ask user to verbally state desired business objectives (e.g., "increase conversion rate by 20%"); AI will convert to SMART format measurable objectives
3. **Resource constraints missing**: Mark resource requirements section as "pending assessment" in the charter, suggest supplementing in the resource planning stage (Pipeline 2)

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Product background change (positioning adjustment/market change) | Project background summary, driving factors, risk assessment | Recompile project background, update driving factors and preliminary risks |
| Strategic objectives change (objective additions/removals/priority adjustment) | Project objectives, success criteria, scope definition | Redecompose objectives, update success criteria and scope boundaries |
| Resource constraints change (budget/personnel adjustment) | Resource requirement estimation, timeline | Update resource requirements and timeline estimation |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Charter objectives/scope change | Resource planning, Kickoff meeting, risk identification | Update project_charter.json, notify planning-resource, planning-kickoff, risk-identification |
| Stakeholder change | Kickoff meeting participants, communication plan | Update project_charter.json, notify planning-kickoff |
| Approval status change | All downstream Pipelines dependent on charter | Update metadata.json, notify all downstream consumers |
