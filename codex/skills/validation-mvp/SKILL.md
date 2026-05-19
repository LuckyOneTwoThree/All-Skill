---
name: validation-mvp
description: "Use when defining MVP feature scope. Automatically defines MVP scope based on assumption maps and resource constraints, intelligently identifying Must Have, MUST NOT, and Nice to Have features, and evaluating MVP size ratio. Keywords: MVP scope, minimum viable product, feature priority, resource constraints, minimal product, core features."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Solution Validation"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "What features should the MVP include"
    - "How to build a minimal product"
    - "Which features can be deferred"
---

# MVP Scope Auto-Definition

## Core Principles

1. **MVP validates assumptions, not solutions** -- The goal of MVP is learning, not delivery; achieve maximum confidence at minimum cost
2. **Must Have is the MVP baseline** -- Must Have features cannot be cut; Nice to Have features are all cuttable
3. **2 weeks is the MVP time red line** -- An MVP exceeding 2 weeks is not an MVP, it's a full product
4. **Validation results have only three outcomes** -- Validated/Invalidated/Need more data; ambiguous conclusions are not allowed

### Basic Information

| Attribute | Value |
|-----------|-------|
| Pipeline ID | 13 |
| Name | MVP Scope Auto-Definition |
| Execution Mode | AI->Human AI suggests, human approves |
| Input | Solution design + Assumption map + Resource constraints |

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Solution Design | JSON | Yes | output/pm-design/design-prototype / output/pm-design/design-userflow | Complete feature list and descriptions |
| Assumption Map | JSON | Yes | output/pm-design/validation-assumption-map/assumption_map.json | Assumption map from Pipeline 12 |
| Resource Constraints | JSON | O | User provided | Time, personnel, budget constraints |

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
    "budget": "Budget constraints"
  }
}
```

## Execution Steps

### Step 1: Core Hypothesis Extraction and Must Have Identification

**Definition**: Features directly related to maximum risk assumptions = Must include

**Judgment Logic**:
1. Find all assumptions where is_max_risk = true
2. Extract core hypothesis list
3. Identify features associated with these hypotheses
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
      "linked_assumption": "Linked maximum risk assumption",
      "effort_estimate": "Effort estimate",
      "rationale": "Reason for inclusion"
    }
  ]
}
```

### Step 2: Cut Feature Identification

**Definition**: Features that interfere with core hypothesis validation = Exclude

**Exclusion Criteria**:

| Exclusion Type | Description | Example |
|---------------|-------------|---------|
| Overly rich | Features beyond MVP validation needs | MVP validation needs a list, but full search+filter+sort is built |
| Overly polished | High-fidelity design not necessary for MVP | Investing significant time in interaction animations |
| Overly configurable | Complex configuration items not necessary for validation | Multi-dimensional customization settings |

**Output Format**:
```json
{
  "cut_features": [
    {
      "feature": "Feature name",
      "rationale": "Reason for exclusion (interferes with core hypothesis validation)"
    }
  ]
}
```

### Step 3: Nice to Have Classification

**Definition**: Features that are neither Must Have nor cut features

**Priority Rules**:
1. Features associated with high-risk assumptions but not directly related -> P1
2. Features associated with medium-risk assumptions -> P2
3. Features associated with low-risk assumptions -> P3

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

### Step 4: MVP Size Assessment

**Calculation Formula**:

```
MVP Ratio = Must Have effort / Full solution effort x 100%
```

**Effort Unit**: Person-days/person-weeks/story points (per team convention)

**Assessment Criteria**:

| MVP Ratio | Assessment | Recommendation |
|-----------|-----------|----------------|
| < 40% | [OK] Ideal | Can start MVP development |
| 40-60% | [!] Acceptable | Review whether Nice to Have can be further streamlined |
| > 60% | [ALERT] Needs review | Escalate to human judgment, confirm whether to adjust |

### Step 5: Timeline Planning

**Definition**: Based on MVP feature effort and resource constraints, create timeline plan

**Planning Logic**:
1. Sum Must Have feature effort
2. Combine with resource_constraints timeline_weeks and team_size
3. Ensure total weeks <= 2 (MVP time red line)
4. Break down milestone nodes

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

### Step 6: Resource Estimation

**Definition**: Based on MVP feature effort and timeline plan, estimate required resources

**Estimation Logic**:
1. Calculate personnel needs based on Must Have feature effort
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
        "rationale": "Configuration reason"
      }
    ],
    "external_dependencies": []
  }
}
```

### Step 7: Success Criteria and Risk Mitigation

**Definition**: Define MVP validation success criteria, and identify risks and mitigation measures

**Success Criteria Logic**:
1. Transform core hypotheses into quantifiable validation metrics
2. Each core hypothesis corresponds to at least 1 success criterion
3. Success criteria must be quantifiable (with specific values or thresholds)

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

### Step 8: Go/No-Go Decision Framework

**Definition**: Build Go/No-Go decision framework based on success criteria; metrics directly reference quantifiable metrics from success_criteria

**Decision Logic**:
1. Extract key decision metrics from success_criteria (1 primary metric per core hypothesis)
2. Define Go/No-Go thresholds for each metric (based on success_criteria.target_value with upper/lower bounds)
3. Include at least 2 metrics and corresponding thresholds
4. Metrics do not redefine indicators; reference success_criteria via linked_criterion

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
      "needs_more_data": "Need more data condition description"
    }
  }
}
```

## Output

**Storage Path**: `output/pm-design/validation-mvp/`
**Output File**: mvp_definition.json

```json
{
  "mvp_scope": {
    "core_hypothesis": [
      { "id": "A001", "description": "Hypothesis description", "risk_score": 20 }
    ],
    "must_have": [
      { "feature": "Feature name", "linked_assumption": "Linked assumption ID", "effort_estimate": 8, "rationale": "Reason for inclusion" }
    ],
    "nice_to_have": [
      { "feature": "Feature name", "priority": "P1", "target_version": "v2.0" }
    ],
    "cut_features": [
      { "feature": "Feature name", "rationale": "Exclusion reason" }
    ],
    "timeline": { "total_weeks": 2, "milestones": [{  }] },
    "resource_estimate": { "team_size": 3, "roles": [{  }], "external_dependencies": [] },
    "success_criteria": [{  }],
    "risk_mitigation": [{  }],
    "effort_summary": { "mvp_total": 24, "full_solution_total": 60, "mvp_ratio": "40%" },
    "go_no_go": { "metrics": [{  }], "thresholds": { "go": "...", "no_go": "...", "needs_more_data": "..." } }
  },
  "approval_status": "pending|approved|needs_discussion",
  "recommendation": "AI recommendation explanation"
}
```

**Output Validation Rules**: See Output Validation Rules section below

## Decision Rules

| Rule | Condition | Action |
|------|-----------|--------|
| Human approval trigger | MVP ratio > 60% | Escalate to human judgment |
| Approval trigger | Must Have has no assumption linkage | Needs supplementary explanation |
| Approval trigger | cut_features rationale insufficient | Needs supplementary exclusion basis |

## Quality Checks

| Check Item | Pass Condition | Result |
|-----------|---------------|--------|
| Core hypotheses | core_hypothesis non-empty and linked to must_have | pass/fail |
| Assumption linkage | Must Have features all have assumption linkage | pass/fail |
| Exclusion rationale | cut_features all have sufficient rationale | pass/fail |
| Ratio calculation | MVP ratio calculated | pass/fail |
| Priority completeness | Nice to Have all have priorities | pass/fail |
| Time red line | timeline.total_weeks <= 2 | pass/fail |
| Success criteria quantifiable | success_criteria includes quantifiable metrics and target values | pass/fail |
| Go/No-Go complete | go_no_go includes at least 2 metrics and corresponding thresholds | pass/fail |

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|-----------------|---------------|
| Assumption map missing | User describes key assumptions, define MVP | Lacks structured assumption data, MVP scope may be less precise |
| Solution design data missing | User describes solution, define MVP | Lacks solution data, feature cutting may be less reasonable |
| Resource constraint data missing | User describes resource constraints, define MVP | Lacks resource constraint data, timeline may be less reasonable |
| Assumption map + solution design + resource constraints all missing | User describes assumptions and solution, define MVP | Overall confidence reduced, MVP scope may be less complete |
| All upstream files missing | Prompt user to execute prior stages first, or define MVP based on user description | Output is only basic MVP framework |

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| mvp_scope | object | Yes | MVP scope definition |
| mvp_scope.core_hypothesis | array | Yes | Core hypothesis list |
| mvp_scope.must_have | array | Yes | Must Have feature list |
| mvp_scope.nice_to_have | array | Yes | Nice to Have feature list |
| mvp_scope.cut_features | array | Yes | Cut feature list |
| mvp_scope.timeline | object | Yes | Timeline plan |
| mvp_scope.timeline.total_weeks | number | Yes | Total weeks (<=2) |
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
|-----------------|-------------|-------------------|
| Assumption map change (assumption addition/removal/risk score change) | Core hypotheses, Must Have features | Mark affected hypotheses and features, suggest human confirmation on whether to redefine MVP |
| Solution design change | Feature list, cutting decisions | Mark affected features, suggest human confirmation on whether to adjust MVP scope |
| Resource constraint change | Timeline plan, resource estimation | Mark affected timeline, suggest human confirmation on whether to adjust MVP scope |
| Experiment result update | Core hypothesis validation status | Mark affected hypotheses, suggest human confirmation on whether to adjust MVP strategy |

### Downstream Notification Mechanism

| MVP Scope Change Type | Notification Scope | Notification Method |
|----------------------|-------------------|---------------------|
| Must Have feature addition/removal | validation-experiment, validation-usability | Mark feature changes, trigger experiment design and usability test updates |
| Timeline change | validation-experiment | Mark timeline change, trigger experiment duration adjustment |
| Success criteria change | validation-experiment | Mark criteria change, trigger experiment metric updates |
| Go/No-Go decision change | All downstream Skills | Mark decision change, trigger full pipeline update |

---

## Usage Example

**Maximum risk assumptions in the assumption map**:
- A001: Users believe recommended content matches their interests (Risk score: 20)

**Features in solution design**:
- F001: Smart recommendation algorithm
- F002: Recommendation results display
- F003: Bookmark feature
- F004: Share feature
- F005: High-fidelity animations

**AI Analysis**:
```
Core Hypothesis:
- A001: Users believe recommended content matches their interests (Risk score: 20)

Must Have:
- F001 Smart recommendation algorithm (directly validates A001)
- F002 Recommendation results display (necessary for validating A001)

Cut Features:
- F005 High-fidelity animations (interferes with core validation, not necessary for MVP)

Nice to Have:
- F003 Bookmark feature (P2, v2.0)
- F004 Share feature (P3, v3.0)

Timeline:
- Total 2 weeks, Week 1 complete core algorithm, Week 2 complete display and validation

Resource Estimation:
- 3 people: 1 backend + 1 frontend + 1 data

Success Criteria:
- Recommendation match rate >= 60% (linked to A001)

Risk Mitigation:
- Insufficient algorithm accuracy (high) -> Degrade to rule-based recommendations

Go/No-Go:
- Metrics: Recommendation match rate, User click-through rate
- Go: Match rate >= 60% AND click-through rate >= 30%
- No-Go: Match rate < 40% OR click-through rate < 15%

MVP Ratio: 40% [OK] Ideal
```
