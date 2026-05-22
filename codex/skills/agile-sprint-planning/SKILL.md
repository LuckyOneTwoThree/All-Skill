---
name: agile-sprint-planning
description: Use when planning a Sprint. Sprint Planning automation, transforming Product Backlog into Sprint Backlog, including Sprint Goal suggestions, Story auto-selection, workload estimation, and capacity matching validation, outputting a complete Sprint plan. Keywords: Sprint planning, Sprint plan, iteration planning, Story selection, capacity matching, scheduling, what to do this iteration.
metadata:
  module: "Project Management & Execution"
  sub-module: "Agile Execution"
  type: "pipeline"
  version: "3.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "How to plan the next Sprint"
    - "Which requirements for this iteration"
    - "How to schedule the Sprint plan"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Output Sprint plan and Story allocation directly"
  deep_description: "Full plan + risk buffer design + dependency analysis + capacity optimization suggestions"
---

# Sprint Planning Automation

## Core Principles

1. **Transparency Enables Collaboration**: Sprint plan is visible to all, with objectives, Story assignments, and capacity matching information transparent
2. **Risk Early Identification**: Identify risks and dependencies during Sprint Planning, rather than discovering issues during execution
3. **Automated Tracking**: Sprint progress and Story status are automatically tracked, reducing manual reporting burden

## Interaction Mode

**🤖→👤 AI Suggests, Human Approves**

- AI automatically completes Step 1-5, generating a complete Sprint plan
- Human review focus: Sprint Goal accuracy, Story selection reasonableness, capacity appropriateness
- Human can request AI adjustments, AI regenerates
- After Product Owner approval, the Sprint officially begins

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| product_backlog | object[] | Yes | output/pm-monitoring/iteration-decision/prioritized_items | Product backlog |
| sprint_goal | string | ○ | User provided | Sprint goal description |
| team_capacity | object | Yes | output/pm-project/planning-resource/resource_plan | Team capacity data |
| sprint_duration_days | number | Yes | User provided | Sprint duration in days |

---

## Execution Steps

### Step 1: Sprint Goal Auto-suggestion [Core]

**Actions**:
- Analyze high-priority Stories in Product Backlog
- Identify themes or feature areas
- Generate 1-2 sentence Sprint Goal
- Ensure Goal is specific, measurable, and valuable

**Output**:
```json
{
  "sprint_goal_suggestion": {
    "goal": "string",
    "focus_area": "string",
    "success_indicator": "string",
    "confidence": 0.0-1.0
  }
}
```

### Step 2: Story Auto-selection [Core]

**Actions**:
- Sort Backlog Stories by priority
- Consider dependencies between Stories
- Match Stories with team capabilities
- Greedy algorithm to select optimal combination up to capacity limit

**Output**:
```json
{
  "selected_stories": [{
    "id": "STORY-001",
    "title": "string",
    "priority": "P0 | P1 | P2 | P3",
    "dependencies": ["STORY-ID"],
    "estimated_points": number,
    "recommended_assignee": "string | null",
    "selection_reason": "string"
  }],
  "rejected_stories": [{
    "id": "string",
    "reason": "string"
  }],
  "selection_confidence": 0.0-1.0
}
```

### Step 3: Workload Auto-estimation [Core]

**Actions**:
- Estimate Story Points for each selected Story
- Use Planning Poker or T-Shirt Size as reference
- Consider technical complexity and uncertainty
- Summarize total points

**Output**:
```json
{
  "story_points_estimation": [{
    "story_id": "STORY-001",
    "title": "string",
    "story_points": number,
    "estimation_method": "fibonacci | t-shirt | ai-suggested",
    "confidence": 0.0-1.0,
    "notes": "string"
  }],
  "total_story_points": number,
  "velocity_reference": number,
  "estimation_confidence": 0.0-1.0
}
```

### Step 4: Capacity Matching Validation [Core]

**Actions**:
- Calculate team available capacity (person-days × team size)
- Compare planned points with capacity
- Validate within safe range (recommend 80% utilization)
- If exceeding capacity, suggest adjustments

**Output**:
```json
{
  "capacity_validation": {
    "team_capacity": {
      "total_available_hours": number,
      "story_points_capacity": number,
      "recommended_utilization": 0.0-1.0
    },
    "sprint_plan": {
      "planned_story_points": number,
      "planned_hours": number,
      "utilization_rate": 0.0-1.0
    },
    "validation_result": "green | yellow | red",
    "validation_message": "string",
    "adjustment_suggestions": ["string"]
  }
}
```

### Step 5: Sprint Plan Document Generation [Core]

**Actions**:
- Integrate outputs from the above steps
- Generate complete Sprint plan document
- Include risk alerts and recommendations
- Prepare human approval version

**Output**:
```yaml
# sprint_plan

## Sprint Information
- Sprint Number:
- Sprint Goal:
- Start Date:
- End Date:
- Team:

## Sprint Goal
<Step 1 output>

## Planned Stories
<Step 2 and Step 3 output>

## Capacity Validation
<Step 4 output>

## Risks & Recommendations
- Identified risks:
- Recommended focus areas:

## Approval
- Approval Status: Pending
```

---

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Sprint plan and Story allocation | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (current default) | Complete deliverables including all Step outputs |
| deep | Full plan + risk buffer design + dependency analysis + capacity optimization suggestions | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-project/agile-sprint-planning/`

**Output Files**: sprint_plan.json, metadata.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["sprint_plan", "metadata"],
  "properties": {
    "sprint_plan": {"type": "object", "description": "Sprint plan including objectives, Story list, capacity validation, and risks"},
    "metadata": {"type": "object", "description": "Metadata including Sprint ID, confidence, and approval status"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| sprint_plan.sprint_goal | string | Yes | Sprint goal description, must be specific and measurable |
| sprint_plan.stories | array | Yes | Planned Story list, each must contain id, title, story_points, assignee |
| sprint_plan.stories[].story_points | number | Yes | Story point estimate, must be positive integer |
| sprint_plan.stories[].status | string | Yes | Story status, enum value planned |
| sprint_plan.capacity_validation.status | string | Yes | Capacity validation result, enum values green/yellow/red |
| sprint_plan.capacity_validation.message | string | Yes | Validation explanation message |
| sprint_plan.risks | array | No | Risk list, each must contain description and priority |
| sprint_plan.risks[].priority | string | Yes | Risk priority, enum values high/medium/low |
| metadata.sprint_id | string | Yes | Sprint unique identifier |
| metadata.generated_at | string | Yes | Generation time, ISO 8601 format |
| metadata.confidence | number | Yes | Overall confidence, range 0.0-1.0 |
| metadata.human_approval_required | boolean | Yes | Whether human approval is required, must be true for Sprint Planning |
| metadata.approval_status | string | Yes | Approval status, enum values pending/approved/rejected |

```json
{
  "sprint_plan": {
    "sprint_goal": "string",
    "stories": [{
      "id": "string",
      "title": "string",
      "story_points": number,
      "assignee": "string",
      "status": "planned"
    }],
    "capacity_validation": {
      "status": "green | yellow | red",
      "message": "string"
    },
    "risks": [{
      "description": "string",
      "priority": "high | medium | low"
    }]
  },
  "metadata": {
    "sprint_id": "string",
    "generated_at": "ISO datetime",
    "confidence": 0.0-1.0,
    "human_approval_required": true,
    "approval_status": "pending | approved | rejected"
  }
}
```

---

## Capacity Calculation Rules

```
Available Capacity = Team Size × Available Hours Per Person Per Day × Sprint Days × Utilization Factor

Recommended Configuration:
- Utilization Factor: 0.8 (reserve 20% for meetings, ad-hoc tasks)
- Available Hours Per Person Per Day: 6 hours (not 8 hours)
```

---

## Decision Rules

| Condition | Action |
|------|------|
| Backlog Stories < Sprint capacity 50% | Escalate to Product Owner to supplement requirements |
| Capacity validation red (> 100%) | Mandatory requirement to reduce Stories or extend Sprint |
| Complex dependencies preventing selection | Output multiple options, escalate to human decision |
| Story estimation confidence < 0.5 | Mark uncertainty, escalate to team for confirmation |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Sprint Goal is clear and contains ≥1 quantifiable acceptance criteria
- [ ] Selected Stories total points ≤ team available capacity × 1.1 (10% buffer reserved)

### P1 Checks (must pass for standard/deep)

- [ ] 100% of cross-team dependencies identified with resolution plan or timeline
- [ ] Each Story estimate confirmed by ≥2 team members
- [ ] Sprint includes ≥1 tech debt or improvement item (if backlog exists)
- [ ] No P0 risks excluded from Sprint consideration

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Product Backlog | User provides requirements list (title + priority + estimate), AI generates Sprint plan accordingly | Sprint plan generated from user input, lacking structured Backlog data support |
| Sprint goal | AI infers Sprint Goal from high-priority Stories, marks for PO confirmation | Sprint Goal is AI-inferred, requires Product Owner confirmation before execution |
| Team capacity | Skip capacity validation, mark "Requires manual confirmation of capacity matching" in plan | Sprint plan has no capacity validation result, requires manual supplementation |
| Sprint duration | If user does not provide Sprint days, prompt user to provide or skip related steps | Capacity calculation and scheduling lack time range, requires manual supplementation |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Product Backlog missing**: Ask user to provide requirements list, including requirement title, priority (P0-P3), and rough estimate; AI will perform Story selection and Sprint plan generation accordingly
2. **Sprint goal missing**: AI will infer Sprint Goal from highest priority Stories, mark in output "AI-inferred, requires Product Owner confirmation"
3. **Team capacity missing**: Skip capacity matching validation step, mark in Sprint plan "Requires manual confirmation of team capacity support", suggest confirming with team before submitting for approval

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Product Backlog change (priority adjustment/Story additions/removals) | Story selection results, Sprint Goal suggestion | Re-execute Story selection, update Sprint plan and Goal suggestion |
| Team capacity change (personnel changes/holiday adjustments) | Capacity validation results, Story selection upper limit | Recalculate capacity, adjust Story selection and capacity validation |
| Sprint duration adjustment | Capacity calculation, scheduling timeline | Recalculate available capacity, update Sprint plan time range |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Sprint plan change (Story additions/removals/Goal adjustment) | Daily sync, Sprint review, risk management | Update sprint_plan.json, notify agile-daily-sync, agile-review, risk-management |
| Capacity validation result change | Resource planning, team scheduling | Update sprint_plan.json, notify planning-resource |
| Approval status change | All downstream Pipelines dependent on Sprint plan | Update metadata.json, notify all downstream consumers |
