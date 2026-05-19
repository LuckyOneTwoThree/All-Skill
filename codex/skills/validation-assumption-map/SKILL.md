---
name: validation-assumption-map
description: "Use when extracting and evaluating product assumptions. Automatically generates assumption maps based on solution design and PRD, extracting value, feasibility, usability, and growth assumptions with risk assessment and validation method recommendations. Keywords: assumption extraction, risk assessment, assumption map, validation methods, assumption mapping, risk assumptions."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Solution Validation"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "What product assumptions haven't been validated"
    - "Help me map out assumptions and risks"
    - "Which assumptions might not hold"
execution_depth:
  default: standard
  quick_description: "Output core assumptions and validation priorities"
  deep_description: "Full assumption map + validation experiment design + risk quantification assessment + assumption evolution tracking"
---

# Assumption Map Auto-Generation

## Core Principles

1. **Every feature point is backed by an assumption** -- Unvalidated feature points are bets; the assumption map is the bet list
2. **Risk = Impact x Uncertainty** -- High impact + high uncertainty assumptions are the greatest risks and must be validated first
3. **Validation methods must match assumption types** -- Value assumptions use landing page tests, usability assumptions use prototype tests; mismatching is not allowed
4. **Maximum risk assumptions must have validation plans** -- Identifying risks without planning validation is like knowing there are mines but not clearing them

### Basic Information

| Attribute | Value |
|-----------|-------|
| Pipeline ID | 12 |
| Name | Assumption Map Auto-Generation |
| Execution Mode | AI AI Auto-Execution |
| Input | Solution design output + PRD |

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Solution Design Output | JSON | Yes | output/pm-design/design-prototype / output/pm-design/design-userflow | Feature list, user journey, interaction design description |
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | Problem statement, target users, core value proposition |
| PRD Structured Data | JSON | O | output/pm-design/design-prd/prd.json | Machine-consumable PRD version containing features[] for assumption extraction alignment |

### Input Format
```json
{
  "solution_design": {
    "features": ["Feature 1", "Feature 2", ...],
    "user_journey": "User journey description",
    "interaction_design": "Interaction design description"
  },
  "prd": {
    "problem_statement": "Problem statement",
    "target_users": "Target users",
    "core_value": "Core value proposition"
  }
}
```

## Execution Steps

### Step 1: Assumption Extraction [Core]

For each feature point, extract the following four types of assumptions:

| Assumption Type | Definition | Example |
|----------------|-----------|---------|
| Value Assumption | Whether users recognize the feature's value | Users are willing to pay for feature XX |
| Feasibility Assumption | Whether technology/resources support implementation | We can implement feature XX |
| Usability Assumption | Whether users can use it smoothly | Users can understand how to operate XX |
| Growth Assumption | Whether the feature can drive growth | Feature XX can bring user retention improvement |

**Rule**: Each feature point -> at least 1 assumption

### Step 2: Assumption Risk Assessment [Core]

Assess risk for each assumption:

| Dimension | Score | Description |
|-----------|-------|-------------|
| Impact | 1-5 | Degree of impact on the product if the assumption doesn't hold |
| Uncertainty | 1-5 | Degree of uncertainty about the assumption holding |

**Risk Score Calculation**: `risk_score = impact x uncertainty`

| Risk Level | Score Range | Identifier |
|-----------|-------------|-----------|
| High Risk | 15-25 | is_max_risk = true |
| Medium Risk | 8-14 | is_max_risk = false |
| Low Risk | 1-7 | is_max_risk = false |

### Step 3: Validation Method Recommendation [Conditional]

Recommend validation methods based on assumption type:

| Assumption Type | Recommended Validation Methods |
|----------------|-------------------------------|
| Value Assumption | Landing page test, pre-sale MVP, user interviews, willingness-to-pay survey |
| Feasibility Assumption | Technical prototype, cost estimation, expert review |
| Usability Assumption | Prototype test, usability test, task completion rate analysis |
| Growth Assumption | A/B test, data analysis, user behavior tracking |

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | core assumptions and validation priorities | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full assumption map + validation experiment design + risk quantification assessment + assumption evolution tracking | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-design/validation-assumption-map/`
**Output File**: assumption_map.json

```json
{
  "assumption_map": [
    {
      "id": "A001",
      "feature_id": "F001",
      "type": "value|feasibility|usability|growth",
      "assumption": "Assumption content description",
      "impact": 4,
      "uncertainty": 4,
      "risk_score": 16,
      "is_max_risk": false,
      "validation_method": "Recommended validation method",
      "validation_metric": "Validation metric"
    }
  ],
  "summary": {
    "total_assumptions": 12,
    "max_risk_assumptions": ["A005", "A008"],
    "assumption_coverage": "100%"
  }
}
```

### Output Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| id | string | Assumption unique identifier |
| feature_id | string | Associated feature point ID |
| type | enum | Assumption type |
| assumption | string | Assumption content |
| impact | number | Impact score (1-5) |
| uncertainty | number | Uncertainty score (1-5) |
| risk_score | number | Risk score (1-25) |
| is_max_risk | boolean | Whether this is a maximum risk assumption |
| validation_method | string | Recommended validation method |
| validation_metric | string | Validation metric |

**Output Validation Rules**: See Output Validation Rules section below

## Decision Rules

1. **Maximum Risk Assumption Identification**
   - Must identify the assumption with the highest risk score
   - Maximum risk assumptions must have a clear validation plan

2. **Assumption Validation Methods**
   - Each assumption must have a corresponding validation method
   - Validation methods must match the assumption type

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Feature point coverage (All feature points have at least 1 assumption)
- [ ] Assumption risk assessment (Each assumption has impact and uncertainty scores)

### P1 Checks (must pass for standard/deep)

- [ ] Validation method matching (Validation methods correspond to assumption types)
- [ ] Maximum risk identification (Highest risk score assumption identified)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|------------------------|-----------------|---------------|----------|
| Solution design data missing | User provides solution description, extract assumptions | Lacks structured solution data, assumption coverage may be incomplete | Request user to describe solution features and design decisions, or upload solution-design.json |
| PRD document missing | User provides solution description, extract assumptions | Lacks PRD data, assumptions may be disconnected from requirements | Request user to provide feature requirements, or upload prd.json |
| Both solution design and PRD missing | User provides solution description, extract assumptions | Overall confidence reduced, assumptions may be less complete | Request user to describe solution and requirements, or execute design-prd and ideation-workshop first |
| All upstream files missing | Prompt user to execute prior stages first, or extract assumptions based on user solution description | Output is only basic assumption list | Request user to describe solution and key decisions, or execute design-prd and ideation-workshop first |

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| assumption_map | array | Yes | Assumption list |
| assumption_map[].id | string | Yes | Assumption unique identifier |
| assumption_map[].feature_id | string | Yes | Associated feature point ID |
| assumption_map[].type | string | Yes | Assumption type (value/feasibility/usability/growth) |
| assumption_map[].assumption | string | Yes | Assumption content |
| assumption_map[].impact | number | Yes | Impact score (1-5) |
| assumption_map[].uncertainty | number | Yes | Uncertainty score (1-5) |
| assumption_map[].risk_score | number | Yes | Risk score (1-25) |
| assumption_map[].is_max_risk | boolean | Yes | Whether this is a maximum risk assumption |
| assumption_map[].validation_method | string | Yes | Recommended validation method |
| assumption_map[].validation_metric | string | Yes | Validation metric |
| summary | object | Yes | Statistical summary |
| summary.total_assumptions | integer | Yes | Total assumption count |
| summary.max_risk_assumptions | array | Yes | Maximum risk assumption ID list |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| Solution design feature addition/removal | Assumption extraction, risk assessment | Mark affected feature points, suggest human confirmation on whether to re-extract assumptions |
| PRD core value change | Value assumptions | Mark affected value assumptions, suggest human confirmation on whether to re-evaluate |
| Prototype interaction change | Usability assumptions | Mark affected usability assumptions, suggest human confirmation on whether to re-evaluate |

### Downstream Notification Mechanism

| Assumption Map Change Type | Notification Scope | Notification Method |
|---------------------------|-------------------|---------------------|
| Assumption addition/removal | validation-mvp, validation-experiment | Mark assumption changes, trigger MVP scope and experiment design updates |
| Risk score change | validation-mvp, validation-experiment | Mark score changes, trigger MVP Must Have and experiment priority updates |
| Validation method change | validation-experiment | Mark method changes, trigger experiment plan updates |

---

## Usage Example

**Input**:
```
Feature Point: Smart Recommendations
PRD Core Value: Help users quickly discover content they're interested in
```

**Output**:
```json
{
  "assumption_map": [
    {
      "id": "A001",
      "feature_id": "F001",
      "type": "value",
      "assumption": "Users believe smart recommendations can help them discover interesting content",
      "impact": 4,
      "uncertainty": 4,
      "risk_score": 16,
      "is_max_risk": true,
      "validation_method": "Usability test",
      "validation_metric": "Recommended content click-through rate > 15%"
    },
    {
      "id": "A002",
      "feature_id": "F001",
      "type": "usability",
      "assumption": "Users can understand the source and meaning of recommendation results",
      "impact": 3,
      "uncertainty": 3,
      "risk_score": 9,
      "is_max_risk": false,
      "validation_method": "Prototype test",
      "validation_metric": "Task completion rate > 80%"
    }
  ]
}
```
