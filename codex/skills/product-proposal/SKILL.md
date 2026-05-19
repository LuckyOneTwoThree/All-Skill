---
name: product-proposal
description: "Use when writing a product initiation proposal. Auto-generates structured product initiation document integrating all prior analysis results. Keywords: product initiation, product proposal, initiation document, business plan, product planning document, project charter, project proposal."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Product Initiation"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me write a product initiation document"
    - "How to write a product proposal"
---

# Product Proposal Auto-Generation

## Core Principles

1. **Evidence Chain Closed Loop** -- Every conclusion in the proposal must be traceable to prior analysis data; unsupported assertions are rejected
2. **Decision Points Explicit** -- All key nodes requiring human decision must be labeled; AI cannot decide on behalf of humans
3. **Risk Upfront** -- Technology/market/resource/compliance risks must be explicitly presented in the proposal
4. **One-Page First** -- Executive summary must explain the core logic on one page; detailed content serves as support

## Interaction Mode
AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User Research Data | JSON | O | user-research-user-modeling | User personas, pain points, needs |
| Business Model Canvas | JSON | O | output/pm-strategy/business-model-canvas/bmc.json | Business model 9 blocks |
| SWOT Analysis | JSON | O | output/pm-strategy/strategic-analysis/strategic-analysis.json | Strategic posture |
| OKR | JSON | O | output/pm-strategy/planning-okr/okr.json | Objectives and Key Results |
| Roadmap | JSON | O | output/pm-strategy/planning-roadmap/roadmap.json | Product roadmap |
| Pricing Strategy | JSON | O | output/pm-strategy/business-pricing/pricing_analysis.json | Pricing options |
| Positioning Strategy | JSON | O | output/pm-strategy/positioning-strategy/positioning-strategy.json | Product positioning |
| Stakeholders | JSON | O | output/pm-strategy/stakeholder-analysis/stakeholder-analysis.json | Stakeholders |
| Product/Business Info | string | Yes | User provided | Product name, business description |

## Execution Steps

### Step 1: Executive Summary Generation

Generate a one-page executive summary including:

| Element | Content |
|------|------|
| Product name | Product name and one-sentence description |
| Target users | Core user groups |
| Core value | Value proposition in one sentence |
| Business model | Revenue model overview |
| Market opportunity | Market size and growth |
| Competitive advantage | Differentiation advantages |
| Key metrics | North Star metric + core OKRs |
| Resource requirements | Team, budget, timeline |
| Key risks | Top 3 risks |
| Decision requests | Items requiring approval |

### Step 2: Product Definition

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

### Step 3: Business Analysis

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

### Step 4: Execution Plan

Integrate OKR and roadmap data:

**Objective System**:
- Annual OKRs
- Quarterly milestones
- Key metrics

**Roadmap**:
- Now/Next/Later
- Resource requirements
- Dependencies

### Step 5: Risk Assessment

Identify and assess key risks:

| Risk Category | Assessment Dimensions |
|----------|----------|
| Market risk | Demand changes, competitor actions, market shrinkage |
| Technology risk | Technical feasibility, performance bottlenecks, security compliance |
| Resource risk | Talent shortage, budget shortfall, time pressure |
| Execution risk | Team capability, collaboration efficiency, external dependencies |

### Step 6: Document Assembly

**Proposal Structure**:

```
# {Product Name} Product Initiation Proposal

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
### 3.1 Objective System
### 3.2 Product Roadmap
### 3.3 Resource Requirements

## 4. Risk Assessment
### 4.1 Risk Matrix
### 4.2 Mitigation Measures

## 5. Decision Requests
### 5.1 Items Requiring Approval
### 5.2 Recommended Next Steps

## Appendix
- Data sources
- Assumptions list
- Detailed analysis
```

## Output

**Storage Path**: `output/pm-strategy/product-proposal/`

**Output Files**:

| File | Format | Description |
|------|------|------|
| product-proposal.md | Markdown | Complete product initiation proposal |
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
| product_definition.target_users | array | Yes | Target user groups list |
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
| business_analysis.competitive_analysis.key_competitors | array | Yes | Core competitors list |
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
| execution_plan.resource_needs | object | Yes | Resource requirements |
| execution_plan.resource_needs.team | string | Yes | Team configuration |
| execution_plan.resource_needs.budget | string | Yes | Budget requirements |
| execution_plan.resource_needs.timeline | string | Yes | Timeline planning |
| execution_plan.dependencies | array | Yes | Key dependencies list |
| risk_assessment.risks | array | Yes | Risk list |
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
    "product_name": "Product name",
    "generated_at": "Timestamp",
    "data_sources": [],
    "overall_confidence": 0.0
  },
  "executive_summary": {
    "product_name": "Product name",
    "target_user": "Target users",
    "core_value": "Core value",
    "business_model": "Business model",
    "market_opportunity": "Market opportunity",
    "competitive_advantage": "Competitive advantage",
    "key_metrics": {},
    "resource_needs": {},
    "key_risks": [],
    "decision_requests": []
  },
  "product_definition": {
    "vision": "Product vision",
    "target_users": [
      {
        "segment_name": "User group name",
        "description": "Group description",
        "core_needs": ["Core needs"],
        "scenarios": ["Use cases"]
      }
    ],
    "core_value_proposition": "Core value proposition",
    "feature_scope": {
      "mvp_features": [
        {"name": "Feature name", "priority": "must|should|could", "description": "Feature description"}
      ],
      "v2_features": ["V2.0 feature planning"]
    }
  },
  "business_analysis": {
    "market_analysis": {
      "tam": "Total Addressable Market",
      "sam": "Serviceable Available Market",
      "som": "Serviceable Obtainable Market",
      "growth_trend": "Growth trend"
    },
    "business_model": {
      "revenue_model": "Revenue model",
      "pricing_strategy": "Pricing strategy overview",
      "cost_structure": ["Major cost items"],
      "unit_economics": "Unit economics"
    },
    "competitive_analysis": {
      "key_competitors": ["Core competitors"],
      "differentiation": "Differentiation advantages",
      "competitive_moat": "Competitive moat"
    }
  },
  "execution_plan": {
    "okr": {
      "objective": "Annual objective",
      "key_results": [
        {"kr": "Key result", "metric": "Measurement metric", "target": "Target value"}
      ]
    },
    "roadmap": {
      "now": ["Current phase"],
      "next": ["Next phase"],
      "later": ["Future planning"]
    },
    "resource_needs": {
      "team": "Team configuration",
      "budget": "Budget requirements",
      "timeline": "Timeline planning"
    },
    "dependencies": ["Key dependencies"]
  },
  "risk_assessment": {
    "risks": [
      {
        "category": "market|technology|resource|execution",
        "description": "Risk description",
        "severity": "high|medium|low",
        "probability": "high|medium|low",
        "mitigation": "Mitigation measure"
      }
    ],
    "risk_matrix_summary": "Risk matrix summary"
  },
  "decision_requests": []
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| All upstream data complete | Generate complete proposal |
| Partial upstream data missing | Label missing parts, generate based on available data |
| Critical data missing (users/market) | Prompt for data supplementation, reduce confidence |
| Overall confidence <0.5 | Label "recommend supplementing data before approval" |

## Quality Checks

P0 (must pass, blocks output if not passed):
- [ ] executive_summary field <=500 characters
- [ ] product_definition contains >=1 target_user and feature_scope.mvp_features >=3
- [ ] business_analysis.market_analysis includes TAM/SAM/SOM and business_model.revenue_model not empty
- [ ] execution_plan.okr contains >=2 key_results and roadmap.now not empty
- [ ] risk_assessment.risks covers >=3 categories

P1 (recommended to pass, labeled "pending fix" if not passed):
- [ ] decision_requests contains >=1 specific approval item
- [ ] proposal_metadata.data_sources contains >=1 source

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| User research data | Derive user personas from product description | User definition lacks empirical data, personas may be subjective |
| bmc.json | Derive business model from product description | Business model lacks 9-block canvas structured support |
| strategic-analysis.json | Derive strategic posture from product description | Strategic analysis lacks structured basis |
| okr.json | Derive objectives from product description | OKRs lack strategic alignment, quantifiability may be insufficient |
| roadmap.json | Derive roadmap from product description | Roadmap lacks RICE ranking basis |
| Pricing/positioning/stakeholder data | Derive from product description | Corresponding sections lack data anchoring |
| All upstream files missing | Generate complete proposal based on user-provided product description | Overall confidence significantly reduced, proposal lacks data support |

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| User research data update | Product definition, target users | Update product definition section |
| bmc.json business model change | Business analysis section | Update business model and unit economics |
| strategic-analysis.json strategic analysis update | Business analysis competitive analysis | Update competitive analysis and risk assessment |
| okr.json OKR adjustment | Execution plan section | Update objective system and roadmap |
| roadmap.json roadmap change | Execution plan section | Update roadmap and resource requirements |
| Pricing strategy change | Business analysis section | Update pricing strategy and unit economics |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Proposal content change | stakeholder-analysis | Output file version number + change summary |
| Risk assessment change | stakeholder-analysis | Output file version number + change summary |
| Decision request change | stakeholder-analysis | Output file version number + change summary |
