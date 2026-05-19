---
name: growth-model
description: "Use when diagnosing product growth model. Growth model auto-diagnosis pipeline analyzing product features, user data, and business model to match optimal growth model (PLG/SLG/MLG/Hybrid), outputting growth flywheel model, key constraints, and bottleneck analysis. Keywords: growth model, PLG, SLG, growth flywheel, growth diagnosis."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Growth Model"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Diagnose our growth model"
    - "What growth model fits our product"
    - "Is our product PLG or SLG"
    - "Analyze our growth flywheel"
execution_depth:
  default: standard
  quick_description: "Output growth model diagnosis and bottleneck identification"
  deep_description: "Full diagnosis + flywheel modeling simulation + cold start simulation + growth stage evolution roadmap"
---

# Growth Model Auto-Diagnosis

## Core Principles

1. **Model matches product essence**: PLG/SLG/MLG is not a choice but the inevitable result of product characteristics and business model
2. **Flywheel must be closed-loop**: The growth flywheel must form a reinforcing loop; an open loop is a chain, not a flywheel
3. **Bottleneck determines leverage**: The current biggest bottleneck determines the highest-leverage investment direction; resources always go to the bottleneck

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Product Features | object | Yes | User provided | Product type, core features, value proposition |
| User Data | object | Yes | output/pm-metrics-ops/analysis-retention/retention_analysis.json | User behavior, conversion funnel, retention curve |
| Business Model | object | Yes | User provided | Pricing strategy, target customers, market positioning |

## Execution Steps

### Step 1: Growth Model Matching Decision Tree [Core]

Analyze the following dimensions to determine the optimal growth model:

#### PLG (Product-Led Growth) Characteristics
- Product can independently deliver user value
- Users can self-register and use
- Network effects exist or value increases with usage
- Word-of-mouth is an important acquisition channel

#### SLG (Sales-Led Growth) Characteristics
- High average deal size (complex B2B decisions)
- Requires manual demos and customized service
- Sales team is the core acquisition engine
- Customer success is key to retention

#### MLG (Marketing-Led Growth) Characteristics
- Brand awareness is a prerequisite for purchase
- Content marketing and SEO are important channels
- Requires sustained marketing investment to maintain growth
- Product is relatively standardized

#### Hybrid Model Determination
- Different user segments adopt different growth models
- Different product lines adopt different growth models
- Different market stages adopt different growth models

### Step 2: Flywheel Auto-Modeling [Core]

Based on the identified growth model, build the growth flywheel model:

1. **Identify core value loop**: Find the core causal chain of product value creation
2. **Identify flywheel nodes**: Key user behaviors and business metrics
3. **Identify reinforcing loops**: Which nodes positively reinforce other nodes
4. **Identify friction points**: Sources of friction when the flywheel turns

### Step 3: Cold Start Threshold Identification [Core]

Analyze the cold start conditions of the growth flywheel:

- How many initial users/revenue are needed to trigger flywheel self-rotation?
- What external resources are needed during the cold start phase?
- How to validate the flywheel hypothesis?

### Step 4: Key Leverage Identification [Core]

Based on the flywheel model, identify the highest-leverage growth actions for the current stage:

- Which node should be strengthened first to maximize flywheel acceleration?
- Which bottleneck should be eliminated to unlock the greatest growth potential?
- Where should resources be prioritized?

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | growth model diagnosis and bottleneck identification | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full diagnosis + flywheel modeling simulation + cold start simulation + growth stage evolution roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-growth/growth-model/`

**Output File**: growth_model.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["model", "flywheel", "bottleneck"],
  "properties": {
    "model": {"type": "string", "description": "Growth model: PLG/SLG/MLG/Hybrid"},
    "flywheel": {"type": "object", "description": "Growth flywheel model, containing nodes and edges"},
    "key_constraints": {"type": "array", "description": "Key constraints list"},
    "bottleneck": {"type": "string", "description": "Current biggest bottleneck description"},
    "confidence": {"type": "number", "description": "Diagnosis confidence"}
  }
}
```

`growth_diagnosis`
```json
{
  "model": "PLG|SLG|MLG|Hybrid",
  "flywheel": {
    "nodes": ["Teachers register and use", "Create and publish courses", "Students join and learn", "Learning data feedback", "Word-of-mouth referral"],
    "edges": [{"from": "Students join and learn", "to": "Word-of-mouth referral", "description": "The better the student learning outcomes, the more willing teachers are to recommend to peers"}]
  },
  "key_constraints": ["Free version limited to 3 courses, affecting teacher depth of use"],
  "bottleneck": "Teacher activation rate only 35%, course creation threshold too high",
  "confidence": 0.95
}
```

### Diagnosis Output Example

```
Growth Model: Hybrid (PLG + SLG)

Growth Flywheel:
├── PLG Flywheel: User registration -> Use product -> Discover value -> Word-of-mouth referral -> New user registration
├── SLG Flywheel: Marketing events -> Lead acquisition -> Sales follow-up -> Enterprise purchase -> Customer success -> Expansion

Key Constraints:
1. PLG side: Free-to-paid conversion rate only 2.3%, need to optimize payment funnel
2. SLG side: Average sales cycle 45 days, lead conversion rate 12%

Current Biggest Bottleneck: PLG user activation rate low (35%), resulting in insufficient word-of-mouth referrals

Recommended Priority Actions:
1. Optimize onboarding flow, target activation rate increase to 50%
2. Identify common behavioral characteristics of high-activation users
3. Design activation intervention strategies for low-activation users
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| model | string | Yes | Growth model, only PLG/SLG/MLG/Hybrid allowed |
| flywheel | object | Yes | Flywheel model, must contain nodes and edges |
| flywheel.nodes | array | Yes | Flywheel node list, at least 4 nodes |
| flywheel.nodes[].node_name | string | Yes | Node name, cannot be empty |
| flywheel.edges | array | Yes | Flywheel edge list, at least 2 edges, must contain from/to/description |
| flywheel.edges[].from | string | Yes | Source node, cannot be empty |
| flywheel.edges[].to | string | Yes | Target node, cannot be empty |
| flywheel.edges[].description | string | Yes | Causal relationship description, cannot be empty |
| key_constraints | array | Yes | Key constraints list, max 5 items |
| key_constraints[].constraint | string | Yes | Constraint description, cannot be empty |
| key_constraints[].impact | string | No | Impact assessment |
| key_constraints[].suggested_action | string | No | Suggested action |
| bottleneck | string | Yes | Bottleneck description, cannot be empty |
| confidence | number | Yes | Diagnosis confidence, range 0-1 |

## Decision Rules

| Condition | Decision |
|------|------|
| Product self-service completion rate >=60% + viral coefficient K>1 | Recommend PLG model |
| Average deal size >=50K CNY + sales cycle >=30 days | Recommend SLG model |
| Content-driven acquisition share >=40% | Recommend MLG model |
| None of the above conditions clearly met | Recommend hybrid model, mark as needs validation |
| Growth flywheel self-drive score >=7/10 | Mark as "can auto-execute" |
| Growth flywheel self-drive score <7/10 | Mark as "requires human intervention", human final confirmation of growth model |
| Bottleneck constraints >=3 | Prioritize resolving the highest-constraint one, others put on watch |
| North Star metric misaligned with current growth model | Recommend re-evaluating growth model |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] North Star metric directly linked to >=1 OKR Objective
- [ ] Growth model contains >=3 quantifiable variables with clear causal relationships

### P1 Checks (must pass for standard/deep)

- [ ] Input variables 100% trackable (have data source or collection plan)
- [ ] Each diagnosis recommendation cites at least 1 data point
- [ ] Growth flywheel contains >=4 nodes and forms a closed loop
- [ ] Bottleneck constraints identified <=5, each with quantified impact assessment

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|----------|
| Product features missing | User describes product -> diagnose growth model based on description | Product features based on user description, diagnosis precision limited | Request user to describe product features and core value proposition, or upload prd.json |
| User data missing | Skip data-driven growth stage assessment, infer based on user description | Growth stage assessment based on qualitative description | Request user to provide user metrics (DAU, MAU, growth rate), or upload user_data.json |
| Business model missing | Use generic business model template, mark as "to be confirmed" | Business model fit may be low | Request user to describe business model and revenue streams, or upload bmc.json |
| Product features + user data + business model all missing | User describes product -> diagnose growth model based on description | Output based on description growth diagnosis, key parameters marked "to be confirmed" | Request user to describe product, current growth stage, and core growth metrics, or execute business-model-canvas first |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| analysis-retention | Retention curve shape change | Growth model assessment and flywheel modeling | Re-evaluate growth model, adjust flywheel nodes |
| User provided - product features | Major product feature change | PLG/SLG/MLG model matching | Re-run decision tree, update model assessment |
| User provided - business model | Pricing or target customer change | Growth model matching and bottleneck identification | Re-evaluate business model fit |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| growth-strategy-report | Growth model or bottleneck change | Write to output file | New growth model, flywheel model and bottleneck identification |
| acquisition-orchestrator | Growth model change | Output file update | Model diagnosis completion status and key conclusions |
| activation-orchestrator | Growth model change | Output file update | Model diagnosis completion status and key conclusions |
| retention-orchestrator | Growth model change | Output file update | Model diagnosis completion status and key conclusions |
| revenue-orchestrator | Growth model change | Output file update | Model diagnosis completion status and key conclusions |
