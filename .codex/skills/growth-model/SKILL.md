---
name: growth-model
description: Use when diagnosing product growth models. An automated growth model diagnosis pipeline that analyzes product characteristics, user data, and business models, automatically matches the optimal growth model (PLG/SLG/MLG/Hybrid), and outputs a growth flywheel model, key constraints, and bottleneck analysis. Keywords: growth model, PLG, SLG, growth flywheel, growth diagnosis.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Growth Model"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output growth model diagnosis and bottleneck identification"
  deep_description: "Full diagnosis + Flywheel modeling inference + Cold start simulation + Growth stage evolution roadmap"
---

# Automated Growth Model Diagnosis

## Core Principles

1. **Model Matches Product Essence**: PLG/SLG/MLG is not a choice but an inevitable result of product characteristics and business model
2. **Flywheel Must Be a Closed Loop**: The growth flywheel must form a reinforcing loop; an open loop is a chain, not a flywheel
3. **Bottleneck Determines Leverage**: The current biggest bottleneck determines the highest-leverage investment direction; resources always go to the bottleneck

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Product characteristics | object | Yes | User provided | Product type, core features, value proposition |
| User data | object | Yes | output/pm-metrics-ops/analysis-retention/retention_analysis.json | User behavior, conversion funnel, retention curve |
| Business model | object | Yes | User provided | Pricing strategy, target customers, market positioning |

## Execution Steps

### Step 1: Growth Model Matching Decision Tree [Core]

Analyze the following dimensions to determine the optimal growth model:

#### PLG (Product-Led Growth) Characteristics
- Product can independently deliver user value
- Users can self-serve registration and usage
- Network effects exist or value increases with usage
- Word-of-mouth is an important acquisition channel

#### SLG (Sales-Led Growth) Characteristics
- High deal value (complex B2B decisions)
- Requires human demos and customized services
- Sales team is the core acquisition engine
- Customer success is key to retention

#### MLG (Marketing-Led Growth) Characteristics
- Brand awareness is a prerequisite for purchase
- Content marketing and SEO are important channels
- Requires sustained marketing investment to maintain growth
- Product is relatively standardized

#### Hybrid Model Determination
- Different user groups adopt different growth models
- Different product lines adopt different growth models
- Different market stages adopt different growth models

### Step 2: Flywheel Auto-Modeling [Core]

Based on the identified growth model, build the growth flywheel model:

1. **Identify Core Value Loop**: Find the core causal chain of product value creation
2. **Identify Flywheel Nodes**: Key user behaviors and business metrics
3. **Identify Reinforcing Loops**: Which nodes positively reinforce other nodes
4. **Identify Resistance Points**: Sources of friction when the flywheel turns

### Step 3: Cold Start Threshold Identification [Core]

Analyze the cold start conditions of the growth flywheel:

- How many initial users/revenue are needed to trigger flywheel self-rotation?
- What external resources are needed during the cold start phase?
- How to validate the flywheel hypothesis?

### Step 4: Key Leverage Identification [Core]

Based on the flywheel model, identify the highest-leverage growth actions for the current stage:

- Which node, if strengthened first, would bring the greatest flywheel acceleration?
- Which bottleneck, if eliminated, would unlock the most growth potential?
- Where should resources be prioritized?

### Output Depth Tiering

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Growth model diagnosis and bottleneck identification | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output including all Step outputs |
| deep | Full diagnosis + Flywheel modeling inference + Cold start simulation + Growth stage evolution roadmap | Full output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-growth/growth-model/`

**Output Files**: growth_model.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["model", "flywheel", "bottleneck"],
  "properties": {
    "model": {"type": "string", "description": "Growth model: PLG/SLG/MLG/Hybrid"},
    "flywheel": {"type": "object", "description": "Growth flywheel model, including nodes and edges"},
    "key_constraints": {"type": "array", "description": "Key constraint list"},
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
    "nodes": ["Teachers register and use", "Create and publish courses", "Students join and learn", "Learning data feedback", "Word-of-mouth referral spread"],
    "edges": [{"from": "Students join and learn", "to": "Word-of-mouth referral spread", "description": "The better the student learning outcomes, the more willing teachers are to recommend to peers"}]
  },
  "key_constraints": ["Free version limited to 3 courses, affecting teacher deep usage"],
  "bottleneck": "Teacher activation rate only 35%, course creation barrier too high",
  "confidence": 0.95
}
```

### Diagnosis Output Example

```
Growth Model: Hybrid (PLG + SLG)

Growth Flywheel:
├── PLG Flywheel: User registration → Use product → Discover value → Word-of-mouth referral → New user registration
├── SLG Flywheel: Marketing campaign → Lead generation → Sales follow-up → Enterprise purchase → Customer success → Upsell

Key Constraints:
1. PLG side: Free-to-paid conversion rate only 2.3%, need to optimize payment funnel
2. SLG side: Average sales cycle 45 days, lead conversion rate 12%

Current Biggest Bottleneck: PLG user activation rate is low (35%), resulting in insufficient word-of-mouth referrals

Recommended Priority Actions:
1. Optimize Onboarding flow, target activation rate increase to 50%
2. Identify common behavioral characteristics of high-activation users
3. Design activation intervention strategy for low-activation users
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| model | string | Yes | Growth model, only allows PLG/SLG/MLG/Hybrid values |
| flywheel | object | Yes | Flywheel model, must include nodes and edges |
| flywheel.nodes | array | Yes | Flywheel node list, at least 4 nodes |
| flywheel.nodes[].node_name | string | Yes | Node name, cannot be empty |
| flywheel.edges | array | Yes | Flywheel edge list, at least 2 edges, must include from/to/description |
| flywheel.edges[].from | string | Yes | Source node, cannot be empty |
| flywheel.edges[].to | string | Yes | Target node, cannot be empty |
| flywheel.edges[].description | string | Yes | Causal relationship description, cannot be empty |
| key_constraints | array | Yes | Key constraint list, maximum 5 |
| key_constraints[].constraint | string | Yes | Constraint description, cannot be empty |
| key_constraints[].impact | string | No | Impact assessment |
| key_constraints[].suggested_action | string | No | Suggested action |
| bottleneck | string | Yes | Bottleneck description, cannot be empty |
| confidence | number | Yes | Diagnosis confidence, range 0-1 |

## Decision Rules

| Condition | Decision |
|------|------|
| Product self-service completion rate ≥60% + Viral coefficient K>1 | Recommend PLG model |
| Deal value ≥50K CNY + Sales cycle ≥30 days | Recommend SLG model |
| Content-driven acquisition proportion ≥40% | Recommend MLG model |
| None of the above conditions clearly met | Recommend hybrid model, note needs validation |
| Growth flywheel self-drive score ≥7/10 | Mark as "can auto-execute" |
| Growth flywheel self-drive score <7/10 | Mark as "requires human intervention", human final confirmation of growth model |
| Bottleneck constraints ≥3 | Prioritize resolving the 1 with highest constraint degree, rest on watch list |
| North Star metric misaligned with current growth model | Recommend re-evaluating growth model |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] North Star metric is directly linked to ≥1 OKR Objective
- [ ] Growth model includes ≥3 quantifiable variables with clear causal relationships between variables

### P1 Checks (must pass for standard/deep)

- [ ] Input variables are 100% trackable (have data source or collection plan)
- [ ] Each diagnostic recommendation cites at least 1 data point
- [ ] Growth flywheel includes ≥4 nodes and forms a closed loop
- [ ] Bottleneck constraints identified ≤5, each with quantified impact assessment

### P2 Checks (only deep must pass)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|------------|
| Product characteristics missing | User describes product → Diagnose growth model based on description | Product characteristics based on user description, diagnosis precision limited | Request user to provide product description (what the product is, what problem it solves, core value proposition) |
| User data missing | Skip data-driven growth stage determination, infer based on user description | Growth stage determination based on qualitative description | Request user to provide current growth stage and core growth metrics (e.g., DAU, GMV, MRR, etc.) |
| Business model missing | Use generic business model template, mark as "to be confirmed" | Business model fit may not be high | Request user to provide business model type (subscription/transaction/advertising/platform, etc.) and revenue sources |
| Product characteristics + User data + Business model all missing | User describes product → Diagnose growth model based on description | Output is growth diagnosis based on description, key parameters marked as "to be confirmed" | Request user to provide product description, growth stage, and business model information |

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Product Description**: What the product is, what problem it solves, core value proposition
- **Current Growth Stage** (optional): Product is in exploration/growth/maturity/decline phase
- **Core Growth Metrics** (optional): Currently most important growth metrics (e.g., DAU, GMV, MRR, etc.)

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| analysis-retention | Retention curve shape change | Growth model determination and flywheel modeling | Re-evaluate growth model, adjust flywheel nodes |
| User provided - Product characteristics | Major product feature change | PLG/SLG/MLG model matching | Re-run decision tree, update model determination |
| User provided - Business model | Pricing or target customer change | Growth model matching and bottleneck identification | Re-evaluate business model fit |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| growth-strategy-report | Growth model or bottleneck change | Write to output file | New growth model, flywheel model, and bottleneck identification |
| acquisition-orchestrator | Growth model change | Output file updated | Model diagnosis completion status and key conclusions |
| activation-orchestrator | Growth model change | Output file updated | Model diagnosis completion status and key conclusions |
| retention-orchestrator | Growth model change | Output file updated | Model diagnosis completion status and key conclusions |
| revenue-orchestrator | Growth model change | Output file updated | Model diagnosis completion status and key conclusions |
