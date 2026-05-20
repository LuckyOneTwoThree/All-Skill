---
name: validation-mvp
description: Use when defining MVP feature scope. Automated MVP scope definition tool that intelligently identifies Must Have, MUST NOT, and Nice to Have features based on assumption maps and resource constraints, and evaluates MVP size ratio. Keywords: MVP scope, minimum viable product, feature prioritization, resource constraints, minimal product, core features.
metadata:
  module: "Product Ideation & Design"
  sub-module: "Solution Validation"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "Software", "General"]
  trigger_examples:
    - "What features should the MVP include"
    - "How to build a minimal product"
    - "Which features can be deferred"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output MVP scope and validation plan"
  deep_description: "Complete plan + MVP scope optimization + validation metrics system + iterative evolution roadmap"
---

# Automated MVP Scope Definition

## Core Principles

1. **MVP validates hypotheses, not solutions** — The goal of MVP is learning, not delivery; obtain maximum confidence at minimum cost
2. **Must Have is the MVP baseline** — Must Have features cannot be cut; Nice to Have features are all cuttable
3. **2 weeks is the MVP time red line** — An MVP exceeding 2 weeks is not an MVP, it's a complete product
4. **Validation results have only three outcomes** — Validated / Invalidated / Need more data; ambiguous conclusions are not allowed

### Basic Information

| Attribute | Value |
|------|-----|
| Pipeline ID | 13 |
| Name | Automated MVP Scope Definition |
| Execution Mode | 🤖→👤 AI Suggests, Human Approves |
| Input | Solution Design + Assumption Map + Resource Constraints |

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Solution Design | JSON | Yes | output/pm-design/design-prototype / output/pm-design/design-userflow | Complete feature list and descriptions |
| Assumption Map | JSON | Yes | output/pm-design/validation-assumption-map/assumption_map.json | Assumption map output from Pipeline 12 |
| Resource Constraints | JSON | ○ | User provided | Time, staffing, budget limitations |

### Input Format
```json
{
  "solution_design": {
    "features": [
      {
        "id": "F001",
        "name": "Feature name",
        "description": "Feature description",
        "effort_estimate": "Effort estimate"
      }
    ]
  },
  "assumption_map": [...],
  "resource_constraints": {
    "timeline_weeks": 8,
    "team_size": 4,
    "budget": "Budget limit"
  }
}
```

## Execution Steps

### Step 1: Core Hypothesis Extraction & Must Have Identification [Core]

**Definition**: Features directly related to the highest-risk assumptions = Must Include

**Judgment Logic**:
1. Identify all assumptions where is_max_risk = true
2. Extract core hypothesis list
3. Identify features linked to these assumptions
4. Mark as Must Have

**Output Format**:
```json
{
  "core_hypothesis": [
    {
      "id": "A001",
      "description": "Hypothesis description",
      "risk_score": 20
    }
  ],
  "must_have": [
    {
      "feature": "Feature name",
      "linked_assumption": "Linked highest-risk assumption",
      "effort_estimate": "Effort estimate",
      "rationale": "Rationale for must include"
    }
  ]
}
```

### Step 2: Cut Feature Identification [Core]

**Definition**: Features that interfere with core hypothesis validation = Exclude

**Exclusion Criteria**:

| Exclusion Type | Description | Example |
|----------|------|------|
| Over-featured | Complete functionality beyond MVP validation needs | MVP validation needs a list, but building full search + filter + sort |
| Over-polished | High-fidelity design not necessary for MVP | Investing significant time in interaction animations |
| Over-configured | Complex configuration options not necessary for validation | Multi-dimensional customization settings |

**Output Format**:
```json
{
  "cut_features": [
    {
      "feature": "Feature name",
      "rationale": "Rationale for exclusion (interferes with core hypothesis validation)"
    }
  ]
}
```

### Step 3: Nice to Have Classification [Core]

**Definition**: Features that are neither Must Have nor cut features

**Priority Rules**:
1. Features linked to high-risk assumptions but not directly related → P1
2. Features linked to medium-risk assumptions → P2
3. Features linked to low-risk assumptions → P3

**Output Format**:
```json
{
  "nice_to_have": [
    {
      "feature": "Feature name",
      "priority": "P1/P2/P3",
      "target_version": "v2.0/v3.0"
    }
  ]
}
```

### Step 4: MVP Size Assessment [Core]

**Calculation Formula**:

```
MVP Ratio = Must Have Effort / Full Solution Effort × 100%
```

**Effort Unit**: Person-days / person-weeks / story points (per team convention)

**Assessment Criteria**:

| MVP Ratio | Assessment | Recommendation |
|---------|----------|------|
| < 40% | ✅ Ideal | Ready to start MVP development |
| 40-60% | ⚠️ Acceptable | Review whether Nice to Have can be further simplified |
| > 60% | 🚨 Requires Review | Escalate to human judgment, confirm whether adjustment is needed |

### Step 5: Timeline Planning [Core]

**Definition**: Create timeline planning based on MVP feature effort and resource constraints

**Planning Logic**:
1. Sum up Must Have feature effort
2. Combine with resource constraints timeline_weeks and team_size
3. Ensure total weeks ≤ 2 (MVP time red line)
4. Break down milestone checkpoints

**Output Format**:
```json
{
  "timeline": {
    "total_weeks": 2,
    "milestones": [
      {
        "name": "Milestone name",
        "week": 1,
        "deliverables": ["Deliverable 1", "Deliverable 2"]
      }
    ]
  }
}
```

### Step 6: Resource Estimation [Core]

**Definition**: Estimate required resources based on MVP feature effort and timeline planning

**Estimation Logic**:
1. Calculate staffing requirements based on Must Have feature effort
2. Infer team configuration based on timeline.total_weeks
3. Assess whether external resource support is needed

**Output Format**:
```json
{
  "resource_estimate": {
    "team_size": 3,
    "roles": [
      {
        "role": "Role name",
        "count": 1,
        "rationale": "Configuration rationale"
      }
    ],
    "external_dependencies": []
  }
}
```

### Step 7: Success Criteria & Risk Mitigation [Core]

**Definition**: Define MVP validation success criteria and identify risks with mitigation measures

**Success Criteria Logic**:
1. Transform core hypotheses into quantifiable validation metrics
2. Each core hypothesis must correspond to at least 1 success criterion
3. Success criteria must be quantifiable (including specific values or thresholds)

**Risk Mitigation Logic**:
1. Identify key risks during MVP execution
2. Develop mitigation measures for each risk
3. Assess risk impact level

**Output Format**:
```json
{
  "success_criteria": [
    {
      "criterion": "Success criterion description",
      "metric": "Quantifiable metric",
      "target_value": "Target value",
      "linked_hypothesis": "Linked hypothesis ID"
    }
  ],
  "risk_mitigation": [
    {
      "risk": "Risk description",
      "impact": "high/medium/low",
      "mitigation": "Mitigation measure"
    }
  ]
}
```

### Step 8: Go/No-Go Decision Framework [Core]

**Definition**: Build Go/No-Go decision framework based on success criteria; metrics directly reference quantifiable metrics from success_criteria

**Decision Logic**:
1. Extract key decision metrics from success_criteria (select 1 primary metric per core hypothesis)
2. Define Go/No-Go thresholds for each metric (based on fluctuations around success_criteria.target_value)
3. Include at least 2 metrics and corresponding thresholds
4. Metrics do not redefine indicators; they reference success_criteria via linked_criterion

**Output Format**:
```json
{
  "go_no_go": {
    "metrics": [
      {
        "name": "Metric name",
        "linked_criterion": "Linked success_criteria index",
        "description": "Metric description"
      }
    ],
    "thresholds": {
      "go": "Go condition description",
      "no_go": "No-Go condition description",
      "needs_more_data": "Needs more data condition description"
    }
  }
}
```

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | MVP scope and validation plan | Core conclusions + minimum viable deliverables |
| standard | Complete deliverables (current default) | Complete deliverables, including all Step outputs |
| deep | Complete plan + MVP scope optimization + validation metrics system + iterative evolution roadmap | Complete deliverables + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-design/validation-mvp/`
**Output File**: mvp_definition.json

```json
{
  "mvp_scope": {
    "core_hypothesis": [
      { "id": "A001", "description": "Hypothesis description", "risk_score": 20 }
      // ... same structure, extensible
    ],
    "must_have": [
      { "feature": "Feature name", "linked_assumption": "Linked assumption ID", "effort_estimate": 8, "rationale": "Rationale for must include" }
      // ... same structure, extensible
    ],
    "nice_to_have": [
      { "feature": "Feature name", "priority": "P1", "target_version": "v2.0" }
      // ... same structure, extensible
    ],
    "cut_features": [
      { "feature": "Feature name", "rationale": "Exclusion rationale" }
      // ... same structure, extensible
    ],
    "timeline": { "total_weeks": 2, "milestones": [{ /* same as Step5 structure */ }] },
    "resource_estimate": { "team_size": 3, "roles": [{ /* same as Step6 structure */ }], "external_dependencies": [] },
    "success_criteria": [{ /* same as Step7 structure */ }],
    "risk_mitigation": [{ /* same as Step7 structure */ }],
    "effort_summary": { "mvp_total": 24, "full_solution_total": 60, "mvp_ratio": "40%" },
    "go_no_go": { "metrics": [{ /* same as Step8 structure */ }], "thresholds": { "go": "...", "no_go": "...", "needs_more_data": "..." } }
  },
  "approval_status": "pending|approved|needs_discussion",
  "recommendation": "AI recommendation description"
}
```

**Output Validation Rules**: See output validation rules section below

## Decision Rules

| Rule | Condition | Action |
|------|------|------|
| Human approval trigger | MVP ratio > 60% | Escalate to human judgment |
| Approval trigger | Must Have has no linked assumption | Requires supplementary explanation |
| Approval trigger | cut_features rationale is insufficient | Requires supplementary exclusion basis |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Core hypotheses (core_hypothesis is non-empty and linked to must_have)
- [ ] Assumption linkage (Must Have features all have assumption linkage)

### P1 Checks (must pass for standard/deep)

- [ ] Exclusion rationale (cut_features all have sufficient rationale)
- [ ] Ratio calculation (MVP ratio calculated)
- [ ] Priority completeness (Nice to Have all have priorities)
- [ ] Time red line (timeline.total_weeks ≤ 2)
- [ ] Success criteria quantifiable (success_criteria includes quantifiable metrics and target values)
- [ ] Go/No-Go completeness (go_no_go includes at least 2 metrics and corresponding thresholds)

### P2 Checks (only deep must pass)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| Assumption map missing | User describes key assumptions, define MVP | Lacking structured assumption data, MVP scope may not be precise enough | Request user to provide key assumption list and validation priorities or upload assumption map file |
| Solution design data missing | User describes solution, define MVP | Lacking solution data, feature cuts may not be well-justified | Request user to provide feature solution description and core feature list or upload ideation output file |
| Resource constraint data missing | User describes resource constraints, define MVP | Lacking resource constraint data, timeline planning may not be well-justified | Request user to provide team size, available timeline, and tech stack resource constraint information |
| Assumption map + solution design + resource constraints all missing | User describes assumptions and solution, define MVP | Overall confidence reduced, MVP scope may not be complete | Request user to provide key assumptions, feature solution, and resource constraint descriptions |
| All upstream files missing | Prompt user to execute prior stages first, or define MVP based on user description | Output is only a basic MVP framework | Request user to provide core assumptions, minimum feature set, and resource constraints |

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| mvp_scope | object | Yes | MVP scope definition |
| mvp_scope.core_hypothesis | array | Yes | Core hypothesis list |
| mvp_scope.must_have | array | Yes | Must Have feature list |
| mvp_scope.nice_to_have | array | Yes | Nice to Have feature list |
| mvp_scope.cut_features | array | Yes | Cut feature list |
| mvp_scope.timeline | object | Yes | Timeline planning |
| mvp_scope.timeline.total_weeks | number | Yes | Total weeks (≤2) |
| mvp_scope.timeline.milestones | array | Yes | Milestone list |
| mvp_scope.resource_estimate | object | Yes | Resource estimation |
| mvp_scope.effort_summary | object | Yes | Effort summary |
| mvp_scope.effort_summary.mvp_total | number | Yes | MVP total effort |
| mvp_scope.effort_summary.full_solution_total | number | Yes | Full solution total effort |
| mvp_scope.effort_summary.mvp_ratio | string | Yes | MVP ratio |
| mvp_scope.success_criteria | array | Yes | Success criteria |
| mvp_scope.risk_mitigation | array | Yes | Risk mitigation measures |
| mvp_scope.go_no_go | object | Yes | Go/No-Go decision framework |
| mvp_scope.go_no_go.metrics | array | Yes | Decision metrics |
| mvp_scope.go_no_go.thresholds | object | Yes | Threshold definitions |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Assumption map change (assumptions added/removed, risk score changes) | Core hypotheses, Must Have features | Annotate affected assumptions and features, recommend human confirmation on whether to redefine MVP |
| Solution design change | Feature list, cut decisions | Annotate affected features, recommend human confirmation on whether to adjust MVP scope |
| Resource constraint change | Timeline planning, resource estimation | Annotate affected timeline, recommend human confirmation on whether to adjust MVP scope |
| Experiment result update | Core hypothesis validation status | Annotate affected hypotheses, recommend human confirmation on whether to adjust MVP strategy |

### Downstream Notification Mechanism

| MVP Scope Change Type | Notification Scope | Notification Method |
|----------------|----------|----------|
| Must Have feature addition/removal | validation-experiment, validation-usability | Mark feature change, trigger experiment design and usability test update |
| Timeline change | validation-experiment | Mark timeline change, trigger experiment cycle adjustment |
| Success criteria change | validation-experiment | Mark criteria change, trigger experiment metrics update |
| Go/No-Go decision change | All downstream Skills | Mark decision change, trigger full process update |

---

## Usage Example

**Highest-risk assumption in assumption map**:
- A001: Users believe recommended content matches their interests (risk score: 20)

**Features in solution design**:
- F001: Intelligent recommendation algorithm
- F002: Recommendation result display
- F003: Bookmark feature
- F004: Share feature
- F005: High-fidelity animations

**AI Analysis**:
```
Core Hypothesis:
- A001: Users believe recommended content matches their interests (risk score: 20)

Must Have:
- F001 Intelligent recommendation algorithm (directly validates A001)
- F002 Recommendation result display (required to validate A001)

Cut Features:
- F005 High-fidelity animations (interferes with core validation, not necessary for MVP)

Nice to Have:
- F003 Bookmark feature (P2, v2.0)
- F004 Share feature (P3, v3.0)

Timeline Planning:
- Total 2 weeks, Week 1 complete core algorithm, Week 2 complete display and validation

Resource Estimation:
- 3 people: 1 backend + 1 frontend + 1 data

Success Criteria:
- Recommendation match rate ≥ 60% (linked to A001)

Risk Mitigation:
- Insufficient algorithm accuracy (high) → Degrade to rule-based recommendations

Go/No-Go:
- metrics: Recommendation match rate, user click-through rate
- Go: Match rate ≥ 60% and click-through rate ≥ 30%
- No-Go: Match rate < 40% or click-through rate < 15%

MVP Ratio: 40% ✅ Ideal
```
