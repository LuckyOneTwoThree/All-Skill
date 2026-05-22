---
name: product-proposal
description: Use when you need to write a product proposal. Product proposal auto-generation, integrating all prior analysis results to generate a structured product proposal document. Keywords: product proposal, product initiative, proposal document, business plan, product planning document, project proposal, initiative application.
metadata:
  module: "Product Business & Strategy"
  sub-module: "Product Proposal"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "General"]
  trigger_examples:
    - "Help me write a product proposal document"
    - "How to write a product proposal"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output product proposal and core arguments"
  deep_description: "Full proposal + business feasibility analysis + technical feasibility assessment + risk and mitigation plan"
---

# Product Proposal Auto-Generation

## Core Principles

1. **Evidence chain closed loop** — Every conclusion in the proposal must be traceable to prior analysis data; unsupported assertions are rejected
2. **Explicit decision points** — All key nodes requiring human decision must be marked; AI must not decide on behalf of humans
3. **Risk front-loading** — Technical/market/resource/compliance risks must be explicitly presented in the proposal
4. **One-pager first** — The executive summary must explain the core logic on one page, with detailed content as support

## Interaction Mode
🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User research data | JSON | ○ | user-research-user-modeling | User personas, pain points, needs |
| Business Model Canvas | JSON | ○ | output/pm-strategy/business-model-canvas/bmc.json | Business model 9-block canvas |
| SWOT analysis | JSON | ○ | output/pm-strategy/strategic-analysis/strategic-analysis.json | Strategic landscape |
| OKR | JSON | ○ | output/pm-strategy/planning-okr/okr.json | Objectives and Key Results |
| Roadmap | JSON | ○ | output/pm-strategy/planning-roadmap/roadmap.json | Product roadmap |
| Pricing strategy | JSON | ○ | output/pm-strategy/business-pricing/pricing_analysis.json | Pricing plan |
| Positioning strategy | JSON | ○ | output/pm-strategy/positioning-strategy/positioning-strategy.json | Product positioning |
| Stakeholders | JSON | ○ | output/pm-strategy/stakeholder-analysis/stakeholder-analysis.json | Stakeholders |
| Product/business information | string | Yes | User provided | Product name, business description |

## Execution Steps

### Step 1: Executive Summary Generation [Core]

Generate a one-page executive summary, including:

| Element | Content |
|------|------|
| Product name | Product name and one-sentence description |
| Target users | Core user groups |
| Core value | One-sentence value proposition |
| Business model | Revenue model overview |
| Market opportunity | Market size and growth |
| Competitive advantage | Differentiation advantages |
| Key metrics | North Star metric + core OKR |
| Resource needs | Team, budget, timeline |
| Key risks | Top 3 risks |
| Decision requests | Items requiring approval |

### Step 2: Product Definition [Core]

Integrate user research and positioning data:

**Product Overview**:
- Product vision
- Target user personas
- Core use cases
- Value proposition

**Feature Scope**:
- MVP feature list
- V2.0 feature planning
- Feature priorities

### Step 3: Business Analysis [Core]

Integrate BMC, pricing, and SWOT data:

**Market Analysis**:
- Market size (TAM/SAM/SOM)
- Market growth trends
- Target market positioning

**Business Model**:
- Revenue model
- Pricing strategy
- Cost structure
- Unit economics

**Competitive Analysis**:
- Competitor comparison
- Differentiation advantages
- Competitive moat

### Step 4: Execution Plan [Core]

Integrate OKR and roadmap data:

**Goal System**:
- Annual OKR
- Quarterly milestones
- Key metrics

**Roadmap**:
- Now/Next/Later
- Resource needs
- Dependencies

### Step 5: Risk Assessment [Core]

Identify and assess key risks:

| Risk Category | Assessment Dimensions |
|----------|----------|
| Market risk | Demand changes, competitor actions, market shrinkage |
| Technical risk | Technical feasibility, performance bottlenecks, security compliance |
| Resource risk | Talent shortage, budget shortfall, time pressure |
| Execution risk | Team capability, collaboration efficiency, external dependencies |

### Step 6: Document Assembly [Core]

**Proposal Structure**:

```
# <Product Name> Product Proposal

## Executive Summary (One Page)

## 1. Product Definition
### 1.1 Product Vision
### 1.2 Target Users
### 1.3 Core Value
### 1.4 Feature Scope

## 2. Business Analysis
### 2.1 Market Opportunity
### 2.2 Business Model
### 2.3 Competitive Analysis

## 3. Execution Plan
### 3.1 Goal System
### 3.2 Product Roadmap
### 3.3 Resource Needs

## 4. Risk Assessment
### 4.1 Risk Matrix
### 4.2 Mitigation Measures

## 5. Decision Requests
### 5.1 Items Requiring Approval
### 5.2 Suggested Next Steps

## Appendix
- Data Sources
- Assumptions List
- Detailed Analysis
```

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Product proposal and core arguments | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output including all Step outputs |
| deep | Full proposal + business feasibility analysis + technical feasibility assessment + risk and mitigation plan | Full output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-strategy/product-proposal/`

**Output Files**:

| File | Format | Description |
|------|------|------|
| product-proposal.md | Markdown | Complete product proposal |
| product-proposal.json | JSON | Structured data |

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| proposal_metadata.product_name | string | Yes | Product name |
| proposal_metadata.generated_at | string | Yes | Generation timestamp |
| proposal_metadata.data_sources | array | Yes | Data source list |
| proposal_metadata.overall_confidence | number | Yes | Overall confidence 0-1 |
| executive_summary.product_name | string | Yes | Product name |
| executive_summary.target_user | string | Yes | Target users |
| executive_summary.core_value | string | Yes | Core value |
| executive_summary.business_model | string | Yes | Business model |
| executive_summary.market_opportunity | string | Yes | Market opportunity |
| executive_summary.key_risks | array | Yes | Top 3 risks |
| executive_summary.decision_requests | array | Yes | Items requiring approval |
| product_definition.vision | string | Yes | Product vision |
| product_definition.target_users | array | Yes | Target user group list |
| product_definition.target_users[].segment_name | string | Yes | User group name |
| product_definition.target_users[].description | string | Yes | Group description |
| product_definition.target_users[].core_needs | array | Yes | Core needs list |
| product_definition.target_users[].scenarios | array | Yes | Use case list |
| product_definition.core_value_proposition | string | Yes | Core value proposition |
| product_definition.feature_scope | object | Yes | Feature scope |
| product_definition.feature_scope.mvp_features | array | Yes | MVP feature list |
| product_definition.feature_scope.mvp_features[].name | string | Yes | Feature name |
| product_definition.feature_scope.mvp_features[].priority | string | Yes | Priority: must/should/could |
| product_definition.feature_scope.mvp_features[].description | string | Yes | Feature description |
| product_definition.feature_scope.v2_features | array | Yes | V2.0 feature planning list |
| business_analysis.market_analysis | object | Yes | Market analysis |
| business_analysis.market_analysis.tam | string | Yes | Total Addressable Market |
| business_analysis.market_analysis.sam | string | Yes | Serviceable Available Market |
| business_analysis.market_analysis.som | string | Yes | Serviceable Obtainable Market |
| business_analysis.market_analysis.growth_trend | string | Yes | Growth trend |
| business_analysis.business_model | object | Yes | Business model |
| business_analysis.business_model.revenue_model | string | Yes | Revenue model |
| business_analysis.business_model.pricing_strategy | string | Yes | Pricing strategy overview |
| business_analysis.business_model.cost_structure | array | Yes | Major cost items list |
| business_analysis.business_model.unit_economics | string | Yes | Unit economics |
| business_analysis.competitive_analysis | object | Yes | Competitive analysis |
| business_analysis.competitive_analysis.key_competitors | array | Yes | Key competitors list |
| business_analysis.competitive_analysis.differentiation | string | Yes | Differentiation advantages |
| business_analysis.competitive_analysis.competitive_moat | string | Yes | Competitive moat |
| execution_plan.okr | object | Yes | Objectives and Key Results |
| execution_plan.okr.objective | string | Yes | Annual objective |
| execution_plan.okr.key_results | array | Yes | Key results list |
| execution_plan.okr.key_results[].kr | string | Yes | Key result |
| execution_plan.okr.key_results[].metric | string | Yes | Measurement metric |
| execution_plan.okr.key_results[].target | string | Yes | Target value |
| execution_plan.roadmap | object | Yes | Product roadmap |
| execution_plan.roadmap.now | array | Yes | Current phase items |
| execution_plan.roadmap.next | array | Yes | Next phase items |
| execution_plan.roadmap.later | array | Yes | Future planning items |
| execution_plan.resource_needs | object | Yes | Resource needs |
| execution_plan.resource_needs.team | string | Yes | Team configuration |
| execution_plan.resource_needs.budget | string | Yes | Budget requirements |
| execution_plan.resource_needs.timeline | string | Yes | Timeline planning |
| execution_plan.dependencies | array | Yes | Key dependencies list |
| risk_assessment.risks | array | Yes | Risks list |
| risk_assessment.risks[].category | string | Yes | Risk category: market/technology/resource/execution |
| risk_assessment.risks[].description | string | Yes | Risk description |
| risk_assessment.risks[].severity | string | Yes | Severity: high/medium/low |
| risk_assessment.risks[].probability | string | Yes | Probability: high/medium/low |
| risk_assessment.risks[].mitigation | string | Yes | Mitigation measure |
| risk_assessment.risk_matrix_summary | string | Yes | Risk matrix summary |
| decision_requests | array | Yes | Decision requests |

```json
{
  "proposal_metadata": {
    "product_name": "Product Name",
    "generated_at": "Timestamp",
    "data_sources": [],
    "overall_confidence": 0.0
  },
  "executive_summary": {
    "product_name": "Product Name",
    "target_user": "Target Users",
    "core_value": "Core Value",
    "business_model": "Business Model",
    "market_opportunity": "Market Opportunity",
    "competitive_advantage": "Competitive Advantage",
    "key_metrics": {},
    "resource_needs": {},
    "key_risks": [],
    "decision_requests": []
  },
  "product_definition": {
    "vision": "Product Vision",
    "target_users": [
      {
        "segment_name": "User Group Name",
        "description": "Group Description",
        "core_needs": ["Core Needs"],
        "scenarios": ["Use Cases"]
      }
    ],
    "core_value_proposition": "Core Value Proposition",
    "feature_scope": {
      "mvp_features": [
        {"name": "Feature Name", "priority": "must|should|could", "description": "Feature Description"}
      ],
      "v2_features": ["V2.0 Feature Planning"]
    }
  },
  "business_analysis": {
    "market_analysis": {
      "tam": "Total Addressable Market",
      "sam": "Serviceable Available Market",
      "som": "Serviceable Obtainable Market",
      "growth_trend": "Growth Trend"
    },
    "business_model": {
      "revenue_model": "Revenue Model",
      "pricing_strategy": "Pricing Strategy Overview",
      "cost_structure": ["Major Cost Items"],
      "unit_economics": "Unit Economics"
    },
    "competitive_analysis": {
      "key_competitors": ["Key Competitors"],
      "differentiation": "Differentiation Advantages",
      "competitive_moat": "Competitive Moat"
    }
  },
  "execution_plan": {
    "okr": {
      "objective": "Annual Objective",
      "key_results": [
        {"kr": "Key Result", "metric": "Measurement Metric", "target": "Target Value"}
      ]
    },
    "roadmap": {
      "now": ["Current Phase"],
      "next": ["Next Phase"],
      "later": ["Future Planning"]
    },
    "resource_needs": {
      "team": "Team Configuration",
      "budget": "Budget Requirements",
      "timeline": "Timeline Planning"
    },
    "dependencies": ["Key Dependencies"]
  },
  "risk_assessment": {
    "risks": [
      {
        "category": "market|technology|resource|execution",
        "description": "Risk Description",
        "severity": "high|medium|low",
        "probability": "high|medium|low",
        "mitigation": "Mitigation Measure"
      }
    ],
    "risk_matrix_summary": "Risk Matrix Summary"
  },
  "decision_requests": []
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| All upstream data complete | Generate full proposal |
| Some upstream data missing | Mark missing sections, generate based on available data |
| Critical data missing (users/market) | Prompt to supplement data, lower confidence |
| Overall confidence <0.5 | Mark "Recommend supplementing data before approval" |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] executive_summary field ≤500 characters
- [ ] product_definition contains ≥1 target_user and feature_scope.mvp_features ≥3

### P1 Checks (must pass for standard/deep)

- [ ] business_analysis.market_analysis contains TAM/SAM/SOM and business_model.revenue_model is non-empty
- [ ] execution_plan.okr contains ≥2 key_results and roadmap.now is non-empty
- [ ] risk_assessment.risks covers ≥3 categories
- [ ] decision_requests contains ≥1 specific approval item
- [ ] proposal_metadata.data_sources contains ≥1 source

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| User research data | Derive user personas based on product description | User definitions lack empirical data, personas may be subjective | Ask user to provide target user characteristics and core pain point descriptions or upload persona.json file |
| bmc.json | Derive business model based on product description | Business model lacks 9-block canvas structured support | Ask user to provide revenue model, cost structure, and value proposition descriptions or upload bmc.json file |
| strategic-analysis.json | Derive strategic landscape based on product description | Strategic analysis lacks structured basis | Ask user to provide product strengths and challenge descriptions or upload strategic-analysis.json file |
| okr.json | Derive objectives based on product description | OKRs lack strategic alignment, quantifiability may be insufficient | Ask user to provide business objectives and key results or upload okr.json file |
| roadmap.json | Derive roadmap based on product description | Roadmap lacks RICE scoring basis | Ask user to provide feature priorities and timeline planning or upload roadmap.json file |
| Pricing/positioning/stakeholder data | Derive based on product description | Corresponding sections lack data anchoring | Ask user to provide pricing plan, product positioning, and organizational structure information |
| All upstream files missing | Generate full proposal based on user-provided product description | Overall confidence significantly reduced, proposal lacks data support | Ask user to provide product name, core features, target users, and business objectives |

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| User research data update | Product definition, target users | Update product definition section |
| bmc.json business model change | Business analysis section | Update business model and unit economics |
| strategic-analysis.json strategic analysis update | Business analysis competitive analysis | Update competitive analysis and risk assessment |
| okr.json OKR adjustment | Execution plan section | Update goal system and roadmap |
| roadmap.json roadmap change | Execution plan section | Update roadmap and resource needs |
| Pricing strategy change | Business analysis section | Update pricing strategy and unit economics |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Proposal content change | stakeholder-analysis | Output file version number + change summary |
| Risk assessment change | stakeholder-analysis | Output file version number + change summary |
| Decision request change | stakeholder-analysis | Output file version number + change summary |
