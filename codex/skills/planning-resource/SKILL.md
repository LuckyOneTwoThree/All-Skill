---
name: planning-resource
description: "Use when planning project resource requirements. Automates resource planning based on project scope, technical solution, and team capability data, completing workload estimation, resource type identification, team capability matching, and resource conflict detection. Keywords: resource planning, resource allocation, workforce planning, resource requirements, capacity planning."
metadata:
  module: "Project Management & Execution"
  sub-module: "Project Planning"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How many people does the project need"
    - "What to do when resources are insufficient"
    - "How to allocate workforce"
execution_depth:
  default: standard
  quick_description: "Output resource allocation and bottleneck identification"
  deep_description: "Full allocation + resource optimization simulation + bottleneck mitigation plan + multi-scenario resource planning"
---

# Resource Requirements Auto-planning

## Core Principles

1. **Transparency Enables Collaboration**: Resource requirements and allocation plans are visible to all, ensuring the team understands resource constraints
2. **Risk Early Identification**: Resource conflicts and dependency risks are identified and flagged at the planning stage
3. **Automated Tracking**: Resource status, conflict detection, and utilization rate are automatically tracked

## Interaction Mode

**AI AI Auto-execution**

- All steps are completed automatically by AI
- Output is generated automatically, no real-time human participation required
- If critical conflicts cannot be automatically resolved, an escalation request is output
- Human can review and adjust the allocation plan at any time

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| project_scope | object | Yes | output/pm-project/planning-project-charter/project_charter | Project scope (including in_scope/out_of_scope) |
| technical_solution | object | Yes | User provided | Technical solution description |
| team_capability_data | object | O | User provided | Team capability data (skill matrix, historical performance) |

---

## Execution Steps

### Step 1: Workload Estimation [Core]

**Actions**:
- Analyze project scope, identify work items
- Estimate baseline hours based on historical data (similar projects)
- Adjust estimates using AI learning model (considering technical complexity, team familiarity)
- Summarize total workload and person-day requirements

**Output**:
```json
{
  "workload_estimates": [{
    "work_item_id": "WI-001",
    "description": "string",
    "estimated_hours": number,
    "confidence": 0.0-1.0,
    "estimation_method": "historical | ai-adjusted | expert",
    "similar_historical_project": "string | null"
  }],
  "total_estimated_hours": number,
  "estimation_confidence": 0.0-1.0
}
```

### Step 2: Resource Type Requirements Identification [Core]

**Actions**:
- Analyze skill types required for work items
- Identify human resource types needed (roles)
- Identify non-human resources needed (tools, environments, budget)
- Summarize requirements by skill type

**Output**:
```json
{
  "resource_needs": {
    "human_resources": [{
      "role": "string",
      "skill_types": ["string"],
      "quantity_needed": number,
      "duration_days": number,
      "total_hours": number
    }],
    "non_human_resources": [{
      "type": "tool | environment | budget | external",
      "description": "string",
      "quantity": number,
      "cost_estimate": number,
      "procurement_timeline": "string"
    }]
  }
}
```

### Step 3: Team Capability Matching [Core]

**Actions**:
- Load team capability data (skill matrix, availability, historical performance)
- Match work items with team member capabilities
- Identify capability gaps
- Suggest training or external resource supplementation

**Output**:
```json
{
  "team_matching": [{
    "work_item_id": "WI-001",
    "recommended_assignee": "string",
    "match_score": 0.0-1.0,
    "skill_coverage": {
      "required": ["string"],
      "covered": ["string"],
      "gaps": ["string"]
    },
    "historical_performance": "good | average | below_avg | unknown"
  }],
  "skill_gaps": [{
    "skill": "string",
    "current_capacity": number,
    "required_capacity": number,
    "gap": number,
    "recommendation": "train | hire | outsource"
  }]
}
```

### Step 4: Resource Conflict Detection [Core]

**Actions**:
- Check matching between resource requirements and available resources
- Identify time conflicts (same resource needed by multiple tasks)
- Identify skill conflicts (required skills have no available resources)
- Identify quantity conflicts (demand exceeds available quantity)

**Output**:
```json
{
  "conflict_detection": {
    "time_conflicts": [{
      "resource_id": "string",
      "conflicting_tasks": ["string"],
      "conflict_period": "date range",
      "overload_hours": number
    }],
    "skill_conflicts": [{
      "skill": "string",
      "demand": number,
      "available": number,
      "gap": number,
      "affected_tasks": ["string"]
    }],
    "capacity_conflicts": [{
      "role": "string",
      "demand": number,
      "available": number,
      "overcapacity_percentage": number
    }]
  },
  "conflict_summary": {
    "total_conflicts": number,
    "critical_conflicts": number,
    "auto_resolvable": boolean
  }
}
```

### Step 5: Resource Allocation Plan Generation [Core]

**Actions**:
- Generate resource allocation plan based on the above analysis
- Resolve conflicts that can be automatically resolved
- Propose multiple options for conflicts that cannot be automatically resolved
- Generate final resource allocation schedule

**Output**:
```json
{
  "resource_allocation": {
    "assignments": [{
      "work_item_id": "WI-001",
      "assignee": "string",
      "start_date": "ISO date",
      "end_date": "ISO date",
      "allocation_percentage": 0-100,
      "status": "confirmed | tentative"
    }],
    "schedule": {
      "phases": [{
        "phase_id": "PHASE-001",
        "name": "string",
        "start_date": "ISO date",
        "end_date": "ISO date",
        "resources": ["string"],
        "key_deliverables": ["string"]
      }]
    }
  },
  "unresolved_conflicts": [{
    "conflict_type": "string",
    "description": "string",
    "options": ["string"],
    "recommendation": "string",
    "escalation_required": boolean
  }],
  "resource_plan_confidence": 0.0-1.0
}
```

---

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | resource allocation and bottleneck identification | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full allocation + resource optimization simulation + bottleneck mitigation plan + multi-scenario resource planning | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-project/planning-resource/`

**Output Files**: resource_plan.json, metadata.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["resource_plan", "metadata"],
  "properties": {
    "resource_plan": {"type": "object", "description": "Resource plan including workload estimates, requirements, matching, and allocation"},
    "metadata": {"type": "object", "description": "Metadata including generation time, confidence, and review flags"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| resource_plan.workload_estimates | array | Yes | Workload estimate list, each must contain work_item_id, estimated_hours, confidence |
| resource_plan.workload_estimates[].confidence | number | Yes | Estimation confidence, range 0.0-1.0 |
| resource_plan.workload_estimates[].estimation_method | string | Yes | Estimation method, enum values historical/ai-adjusted/expert |
| resource_plan.resource_needs.human_resources | array | Yes | Human resource requirements list, each must contain role, quantity_needed, duration_days |
| resource_plan.resource_needs.non_human_resources | array | No | Non-human resource requirements list |
| resource_plan.resource_needs.non_human_resources[].type | string | Yes | Resource type, enum values tool/environment/budget/external |
| resource_plan.team_matching | array | Yes | Team matching results list |
| resource_plan.team_matching[].match_score | number | Yes | Match score, range 0.0-1.0 |
| resource_plan.conflict_detection.conflict_summary.total_conflicts | number | Yes | Total conflicts |
| resource_plan.conflict_detection.conflict_summary.critical_conflicts | number | Yes | Critical conflicts |
| resource_plan.resource_allocation.assignments | array | Yes | Resource allocation list, each must contain work_item_id, assignee, start_date, end_date |
| resource_plan.resource_allocation.assignments[].status | string | Yes | Allocation status, enum values confirmed/tentative |
| resource_plan.unresolved_conflicts[].escalation_required | boolean | Yes | Whether escalation is required |
| resource_plan.resource_plan_confidence | number | Yes | Overall confidence, range 0.0-1.0 |
| metadata.generated_at | string | Yes | Generation time, ISO 8601 format |
| metadata.confidence | number | Yes | Metadata confidence, range 0.0-1.0 |
| metadata.auto_generated | boolean | Yes | Whether auto-generated |
| metadata.requires_human_review | boolean | Yes | Whether human review is required |

```json
{
  "resource_plan": {
    "workload_estimates": {},
    "resource_needs": {
      "type": "string",
      "count": number,
      "duration": "string"
    },
    "team_matching": {},
    "conflict_detection": {},
    "resource_allocation": {}
  },
  "metadata": {
    "generated_at": "ISO datetime",
    "confidence": 0.0-1.0,
    "auto_generated": true,
    "requires_human_review": boolean
  }
}
```

---

## Data Dependencies

This Pipeline depends on the following upstream data:
- `project_charter.scope`: Project scope from Pipeline 1

---

## Decision Rules

| Condition | Action |
|------|------|
| Key resource gap > 30% | Escalate to human for resource allocation decision |
| Time conflict cannot be automatically resolved | Output multiple options, escalate to human for selection |
| Team capability data severely missing | Degrade output, mark low confidence, escalate to human for supplementation |
| Estimation confidence < 0.5 | Mark uncertainty, escalate to human for confirmation |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Resource estimation based on WBS decomposition
- [ ] Key resource gaps identified and marked

### P1 Checks (must pass for standard/deep)

- [ ] Schedule has no resource conflicts
- [ ] Estimation confidence annotated

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Project scope | User provides requirements list and priorities, AI estimates resources based on requirements | Resource estimation based on requirements list, lacking structured scope definition support |
| Technical solution | Skip technical complexity adjustment, use baseline hour estimation, mark low confidence | Low confidence hour estimation, lacking technical complexity factor adjustment |
| Team capability data | User provides team size and role information, AI estimates based on average role capability | Resource plan based on average capability, requires human confirmation of capability assumptions |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Project scope missing**: Ask user to provide requirements list (feature name + brief description + priority); AI will identify work items and estimate workload based on the requirements list
2. **Technical solution missing**: Skip technical complexity adjustment factor, use industry baseline hour estimation, mark low estimation confidence in output, suggest technical team confirmation
3. **Team capability data missing**: Ask user to provide team size and role composition (e.g., "3 backend, 2 frontend, 1 QA"); AI will match resources based on average role capability level, mark need for human confirmation of capability assumptions

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Project scope change (requirement additions/removals/priority adjustment) | Workload estimation, resource requirement identification, conflict detection | Re-estimate workload, update resource requirements and conflict detection |
| Technical solution change (architecture adjustment/tech stack change) | Technical complexity adjustment, skill requirements, workload estimation | Re-evaluate technical complexity, update skill requirements and hour estimation |
| Team capability data change (personnel changes/skill updates) | Team matching, capability gaps, conflict detection | Re-execute team matching, update capability gaps and conflict detection results |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Resource allocation plan change | Sprint planning, Kickoff meeting, risk identification | Update resource_plan.json, notify agile-sprint-planning, planning-kickoff, risk-identification |
| Conflict detection result change | Project manager decision, resource coordination | Update resource_plan.json, notify project manager |
| Skill gap change | Recruitment plan, training plan | Update resource_plan.json, notify HR department |
