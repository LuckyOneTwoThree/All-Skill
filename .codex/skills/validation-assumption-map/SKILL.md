---
name: validation-assumption-map
description: Used when extracting and evaluating product assumptions. Assumption map auto-generation tool, automatically extracting value assumptions, feasibility assumptions, usability assumptions, and growth assumptions based on solution design and PRD, performing risk assessment and recommending validation methods. Keywords: assumption extraction, risk assessment, assumption map, validation method, assumption mapping, risk assumption.
metadata:
  module: "Product Ideation & Design"
  sub-module: "Solution Validation"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "Software", "General"]
  trigger_examples:
    - "Which product assumptions haven't been validated"
    - "Help me map out assumptions and risks"
    - "Which assumptions might not hold"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output core assumptions and validation priorities"
  deep_description: "Complete assumption map + validation experiment design + risk quantification assessment + assumption evolution tracking"
---

# Assumption Map Auto-Generation

## Core Principles

1. **Every feature point is backed by an assumption** — unvalidated feature points are bets; the assumption map is the bet list
2. **Risk = Impact × Uncertainty** — high impact + high uncertainty assumptions are the greatest risk and must be validated first
3. **Validation methods must match assumption types** — value assumptions use landing page tests, usability assumptions use prototype tests; mismatching is not allowed
4. **Maximum risk assumptions must have validation plans** — identifying risks without planning validation is like knowing there are mines but not clearing them

### Basic Information

| Attribute | Value |
|------|-----|
| Pipeline ID | 12 |
| Name | Assumption Map Auto-Generation |
| Execution Mode | 🤖 AI auto-execution |
| Input | Solution design output + PRD |

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Solution Design Output | JSON | Yes | output/pm-design/design-prototype / output/pm-design/design-userflow | Feature list, user journey, interaction design description |
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | Problem statement, target users, core value proposition |
| PRD Structured Data | JSON | ○ | output/pm-design/design-prd/prd.json | Machine-consumable PRD version, containing features[], for assumption extraction alignment |

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
|----------|------|------|
| Value Assumption | Whether users recognize the feature's value | Users are willing to pay for feature XX |
| Feasibility Assumption | Whether technology/resources support implementation | We can implement feature XX |
| Usability Assumption | Whether users can use it smoothly | Users can understand how to operate XX |
| Growth Assumption | Whether the feature can drive growth | Feature XX can bring user retention improvement |

**Rule**: Each feature point → at least 1 assumption

### Step 2: Assumption Risk Assessment [Core]

Perform risk assessment for each assumption:

| Dimension | Score | Description |
|------|------|------|
| Impact | 1-5 | Degree of impact on the product if the assumption does not hold |
| Uncertainty | 1-5 | Degree of uncertainty about the probability of the assumption holding |

**Risk Score Calculation**: `risk_score = impact × uncertainty`

| Risk Level | Score Range | Identifier |
|----------|----------|------|
| High Risk | 15-25 | is_max_risk = true |
| Medium Risk | 8-14 | is_max_risk = false |
| Low Risk | 1-7 | is_max_risk = false |

### Step 3: Validation Method Recommendation [Core]

Based on assumption type, recommend validation methods:

| Assumption Type | Recommended Validation Methods |
|----------|--------------|
| Value Assumption | Landing page test, pre-sale MVP, user interviews, willingness-to-pay survey |
| Feasibility Assumption | Technical prototype, cost estimation, expert review |
| Usability Assumption | Prototype test, usability test, task completion rate analysis |
| Growth Assumption | A/B test, data analysis, user behavior tracking |

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Core assumptions and validation priorities | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output, including all Step outputs |
| deep | Complete assumption map + validation experiment design + risk quantification assessment + assumption evolution tracking | Complete output + extended analysis + deep inference |

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
|------|------|------|
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

**Output Validation Rules**: See the Output Validation Rules section below

## Decision Rules

1. **Maximum Risk Assumption Identification**
   - Must identify the assumption with the highest risk score
   - Maximum risk assumptions must have a clear validation plan

2. **Assumption Validation Methods**
   - Each assumption must have a corresponding validation method
   - Validation methods must match the assumption type

## Quality Check

### P0 Check (must pass for quick/standard/deep)

- [ ] Feature point coverage (all feature points have at least 1 assumption)
- [ ] Assumption risk assessment (each assumption has impact and uncertainty scores)

### P1 Check (must pass for standard/deep)

- [ ] Validation method matching (validation methods correspond to assumption types)
- [ ] Maximum risk identification (assumption with the highest risk score identified)

### P2 Check (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have basis and alternatives)

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| Solution design data missing | User provides solution description, extract assumptions | Lacks structured solution data, assumption coverage may be incomplete | Ask user to provide solution description or upload design-prototype/design-userflow files |
| PRD document missing | User provides solution description, extract assumptions | Lacks PRD data, assumptions may be disconnected from requirements | Ask user to provide functional requirement description or upload prd.json file |
| Both solution design and PRD missing | User provides solution description, extract assumptions | Overall confidence reduced, assumptions may be incomplete | Ask user to provide core assumptions and functional requirement description |
| All upstream files missing | Prompt user to execute prior stages first, or extract assumptions based on user solution description | Output is only a basic assumption list | Ask user to provide core assumptions, user pain points, and functional requirements |

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
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
| summary.total_assumptions | integer | Yes | Total number of assumptions |
| summary.max_risk_assumptions | array | Yes | Maximum risk assumption ID list |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Solution design feature addition/removal | Assumption extraction, risk assessment | Mark affected feature points, suggest human confirmation on whether to re-extract assumptions |
| PRD core value change | Value assumptions | Mark affected value assumptions, suggest human confirmation on whether to re-evaluate |
| Prototype interaction change | Usability assumptions | Mark affected usability assumptions, suggest human confirmation on whether to re-evaluate |

### Downstream Notification Mechanism

| Assumption Map Change Type | Notification Scope | Notification Method |
|-----------------|----------|----------|
| Assumption addition/removal | validation-mvp, validation-experiment | Mark assumption change, trigger MVP scope and experiment design update |
| Risk score change | validation-mvp, validation-experiment | Mark score change, trigger MVP Must Have and experiment priority update |
| Validation method change | validation-experiment | Mark method change, trigger experiment plan update |

---

## Usage Example

**Input**:
```
Feature point: Smart Recommendations
PRD core value: Help users quickly discover content they're interested in
```

**Output**:
```json
{
  "assumption_map": [
    {
      "id": "A001",
      "feature_id": "F001",
      "type": "value",
      "assumption": "Users believe smart recommendations can help them discover content they're interested in",
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
