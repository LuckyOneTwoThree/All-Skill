---
name: business-strategy-report
description: "Use when producing a complete business strategy planning document. Auto-generates business strategy report integrating BMC, SWOT, OKR, roadmap, positioning and stakeholder data with strategic reasoning and execution paths. Keywords: business strategy report, strategic planning, business plan, strategy document, business analysis, strategic planning document."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Business Strategy"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["General"]
  trigger_examples:
    - "Help me write a business strategy plan"
    - "Produce a strategy report"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Output strategic recommendations and priorities"
  deep_description: "Full report + strategic simulation + competitive landscape analysis + execution roadmap"
---

# Business Strategy Report Auto-Generation

## Core Principles

1. **Strategy Is Choosing What Not to Do** -- Good strategy explicitly says no, rather than trying to do everything
2. **Traceable Logic Chain** -- From market insight -> strategic choice -> execution path, each step of reasoning is verifiable
3. **Quantitative Over Qualitative** -- Use numbers wherever possible instead of adjectives
4. **Execution-Oriented** -- Strategy without implementation is empty talk; every strategic direction must have corresponding OKRs and roadmap

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Business Model Canvas | JSON | ○ | output/pm-strategy/business-model-canvas/bmc.json | 9-block business model |
| SWOT Analysis | JSON | ○ | output/pm-strategy/strategic-analysis/strategic-analysis.json | Strengths/Weaknesses/Opportunities/Threats |
| OKR | JSON | ○ | output/pm-strategy/planning-okr/okr.json | Objectives and Key Results |
| Roadmap | JSON | ○ | output/pm-strategy/planning-roadmap/roadmap.json | Product roadmap |
| Positioning Strategy | JSON | ○ | output/pm-strategy/positioning-strategy/positioning-strategy.json | Product positioning |
| Value Curve | JSON | ○ | output/pm-strategy/positioning-strategy/positioning-strategy.json | Competitive value curve |
| Differentiation Assessment | JSON | ○ | output/pm-strategy/positioning-strategy/positioning-strategy.json | Differentiation degree |
| Stakeholders | JSON | ○ | output/pm-strategy/stakeholder-analysis/stakeholder-analysis.json | Stakeholder map |
| Pricing Strategy | JSON | ○ | output/pm-strategy/business-pricing/pricing_analysis.json | Pricing options |
| North Star Metric | JSON | ○ | output/pm-strategy/planning-north-star/north_star.json | Core metric definition |
| Product/Business Info | string | Yes | User provided | Product name, business model, current stage |

## Execution Steps

### Step 1: Strategic Posture Assessment [Core]

Integrate SWOT + Porter's Five Forces + Value Curve to assess current strategic posture:

**External Environment Assessment**:
- Industry attractiveness (Porter's Five Forces conclusion)
- Market opportunity window (SWOT O)
- External threat level (SWOT T)
- Competitive positioning (differentiated position in value curve)

**Internal Capability Assessment**:
- Core strengths (SWOT S)
- Key weaknesses (SWOT W)
- Resource endowment (BMC key resources)
- Capability gaps (capabilities needed for strategy execution but currently missing)

**Strategic Posture Matrix**:

| | Many Opportunities | Many Threats |
|------|--------|--------|
| **Strong Strengths** | Offensive Strategy | Defensive Strategy |
| **Obvious Weaknesses** | Turnaround Strategy | Survival Strategy |

### Step 2: Strategic Direction Reasoning [Core]

Based on posture assessment, reason through 2-3 strategic directions:

**Reasoning Logic**:
```
Posture judgment -> Ansoff Matrix positioning -> Strategic direction selection -> Positioning validation -> OKR alignment
```

**Each strategic direction includes**:

| Element | Description |
|------|------|
| Direction name | One-sentence summary |
| Ansoff positioning | Market penetration/market development/product development/diversification |
| Core logic | Why this direction is viable (citing SWOT/Five Forces/Value Curve evidence) |
| Target market | Which users/scenarios to focus on |
| Differentiation strategy | How to differentiate from competitors (citing differentiation assessment) |
| Key assumptions | Prerequisites for the strategy to hold |
| Risk factors | Factors that could cause strategy failure |

**Strategic Direction Comparison Table**:

| Dimension | Direction A | Direction B | Direction C |
|------|-------|-------|-------|
| Market attractiveness | | | |
| Competitive advantage fit | | | |
| Resource requirements | | | |
| Risk level | | | |
| Expected return | | | |
| Recommendation level | | | |

### Step 3: Execution Path Planning [Core]

Develop execution paths for recommended strategic directions:

**OKR Alignment**:
- Decompose strategic direction into annual O
- Each O corresponds to 2-4 KRs
- KRs must be quantifiable and trackable
- Label North Star metric associations

**Roadmap Mapping**:
- Q1-Q4 milestones
- Deliverables for each milestone
- Key dependencies
- Resource requirement estimates

**Pricing Strategy Embedding**:
- Current pricing fit with strategic direction
- Pricing adjustment recommendations (if any)

### Step 4: Stakeholder Management [Core]

Integrate stakeholder data and develop communication strategy:

| Stakeholder | Attitude | Influence | Communication Strategy | Communication Frequency |
|-----------|------|--------|---------|---------|
| Decision makers | | High | Strategy briefing + ROI justification | Monthly |
| Execution team | | High | Goal alignment + resource assurance | Weekly |
| External partners | | Medium | Value sharing + risk sharing | As needed |

### Step 5: Risks and Contingencies [Core]

Identify key risks in strategy execution:

| Risk Category | Specific Risk | Probability | Impact | Contingency |
|----------|---------|------|------|------|
| Market risk | Demand changes/competitor actions | | | |
| Resource risk | Talent/funding shortage | | | |
| Execution risk | Team capability/collaboration issues | | | |
| Technology risk | Technical feasibility/data security | | | |

### Step 6: Report Assembly [Core]

**Report Structure**:

```
# <Product Name> Business Strategy Plan

## Executive Summary
- Strategic posture one-sentence judgment
- Recommended strategic direction
- Core OKRs
- Key risks

## 1. Strategic Posture Assessment
### 1.1 External Environment
### 1.2 Internal Capabilities
### 1.3 Strategic Posture Matrix

## 2. Strategic Direction Reasoning
### 2.1 Direction A: {Name}
### 2.2 Direction B: {Name}
### 2.3 Direction Comparison and Recommendation

## 3. Execution Path
### 3.1 OKR System
### 3.2 Roadmap
### 3.3 Pricing Strategy

## 4. Stakeholder Management
### 4.1 Stakeholder Map
### 4.2 Communication Strategy

## 5. Risks and Contingencies

## Appendix
- Data sources
- Assumptions list
- Methodology notes
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | strategic recommendations and priorities | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full report + strategic simulation + competitive landscape analysis + execution roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-strategy/business-strategy-report/`

**Output Files**:

| File | Format | Description |
|------|------|------|
| business-strategy-report.md | Markdown | Complete business strategy report |
| business-strategy-report.json | JSON | Structured data (for downstream Skill reference) |

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| report_metadata.product | string | Yes | Product name |
| report_metadata.generated_at | string | Yes | Generation timestamp |
| report_metadata.data_sources | array | Yes | Data source list |
| report_metadata.overall_confidence | number | Yes | Overall confidence 0-1 |
| executive_summary.strategic_posture | string | Yes | Offensive/defensive/turnaround/survival |
| executive_summary.recommended_direction | string | Yes | Recommended strategic direction |
| executive_summary.core_okr | object | Yes | Core OKR |
| executive_summary.key_risks | array | Yes | Key risks list |
| strategic_assessment.external | object | Yes | External environment assessment |
| strategic_assessment.external.industry_attractiveness | string | Yes | Industry attractiveness assessment, must not be empty |
| strategic_assessment.external.opportunities | array | Yes | External opportunities list, must not be empty |
| strategic_assessment.external.threats | array | Yes | External threats list, must not be empty |
| strategic_assessment.external.competitive_position | string | Yes | Competitive position description |
| strategic_assessment.internal | object | Yes | Internal capability assessment |
| strategic_assessment.internal.strengths | array | Yes | Core strengths list, must not be empty |
| strategic_assessment.internal.weaknesses | array | Yes | Key weaknesses list, must not be empty |
| strategic_assessment.internal.key_resources | array | No | Key resources list |
| strategic_assessment.internal.capability_gaps | array | No | Capability gaps list |
| strategic_assessment.posture_matrix.quadrant | string | Yes | Posture quadrant |
| strategic_directions | array | Yes | At least 2 strategic directions |
| strategic_directions[].name | string | Yes | Direction name, must not be empty |
| strategic_directions[].rationale | string | Yes | Direction rationale, must not be empty |
| strategic_directions[].target_market | string | No | Target market |
| strategic_directions[].differentiation | string | No | Differentiation strategy |
| strategic_directions[].key_assumptions | array | No | Key assumptions list |
| strategic_directions[].risk_factors | array | No | Risk factors list |
| execution_path.okr | object | Yes | OKR system |
| execution_path.roadmap | object | Yes | Roadmap |
| stakeholder_management | array | No | Stakeholder management strategies |
| stakeholder_management[].stakeholder | string | Yes | Stakeholder name |
| stakeholder_management[].attitude | string | No | Attitude |
| stakeholder_management[].influence | string | No | Influence level |
| stakeholder_management[].communication_strategy | string | No | Communication strategy |
| risks_and_contingencies | array | Yes | Risks and contingencies |
| risks_and_contingencies[].risk_category | string | Yes | Risk category |
| risks_and_contingencies[].probability | string | No | Probability assessment |
| risks_and_contingencies[].impact | string | No | Impact assessment |
| risks_and_contingencies[].contingency | string | No | Contingency plan |

**business-strategy-report.json Structure**:

```json
{
  "report_metadata": {
    "product": "Product name",
    "generated_at": "Timestamp",
    "data_sources": [],
    "overall_confidence": 0.0
  },
  "executive_summary": {
    "strategic_posture": "offensive/defensive/turnaround/survival",
    "recommended_direction": "",
    "core_okr": {},
    "key_risks": []
  },
  "strategic_assessment": {
    "external": {
      "industry_attractiveness": "",
      "opportunities": [],
      "threats": [],
      "competitive_position": ""
    },
    "internal": {
      "strengths": [],
      "weaknesses": [],
      "key_resources": [],
      "capability_gaps": []
    },
    "posture_matrix": {
      "quadrant": "",
      "implication": ""
    }
  },
  "strategic_directions": [
    {
      "name": "Direction name",
      "strategic_position": "",
      "rationale": "",
      "target_market": "",
      "differentiation": "",
      "key_assumptions": [],
      "risk_factors": [],
      "comparison_scores": {}
    }
  ],
  "execution_path": {
    "okr": {},
    "roadmap": {},
    "pricing_alignment": ""
  },
  "stakeholder_management": [],
  "risks_and_contingencies": []
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| SWOT data missing | Derive posture assessment from product information and AI knowledge, label "lacks SWOT data" |
| OKR data missing | Derive OKRs from strategic directions, label "recommend manual calibration" |
| Roadmap data missing | Derive milestones from OKRs, label "recommend supplementing timeline" |
| Positioning data missing | Strategic direction lacks positioning validation, label "recommend supplementing positioning analysis" |
| All upstream data missing | Generate based on product information and AI knowledge base, overall confidence reduced |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Executive summary includes posture judgment + recommended direction + core OKR
- [ ] Strategic posture matrix generated

### P1 Checks (must pass for standard/deep)

- [ ] At least 2 strategic directions compared
- [ ] OKRs quantifiable and trackable
- [ ] Roadmap includes Q1-Q4 milestones
- [ ] Key risks have contingencies
- [ ] All inferences labeled with confidence

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| bmc missing | Derive business model from product information | Business model analysis may be incomplete, lacking 9-block canvas structured support | Request user to provide product features, revenue model, and cost structure description, or upload bmc.json |
| swot missing | Derive posture from product information and AI knowledge | Posture assessment lacks structured basis, strategic directions may be subjective | Request user to describe product strengths, weaknesses, opportunities, and threats, or upload strategic-analysis.json |
| okr missing | Derive OKRs from strategic directions | OKRs need manual calibration, quantifiability may be insufficient | Request user to provide business objectives and expected key results, or upload okr.json |
| roadmap missing | Derive milestones from OKRs | Timeline needs manual adjustment, milestone dependencies may be inaccurate | Request user to provide feature priorities and time constraints, or upload roadmap.json |
| positioning missing | Strategic direction lacks positioning validation | Differentiation strategy needs supplementary validation, competitive positioning may be vague | Request user to provide product differentiation description, or upload positioning-strategy output files |
| Product/business info (user provided) | If user has not provided product/business info, prompt user to provide or skip related steps | Report cannot generate core content | Request user to provide product name, core features, target users, and business objectives |

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| bmc.json business model change | Strategic posture internal capability assessment, execution path business model | Re-evaluate internal capabilities, update business model section in execution path |
| strategic-analysis.json strategic analysis update | Strategic posture assessment, strategic direction reasoning | Re-execute Step 1 and Step 2, update posture matrix and direction recommendations |
| okr.json OKR adjustment | Execution path OKR alignment | Re-execute Step 3, update OKR system and roadmap mapping |
| roadmap.json roadmap change | Execution path milestones | Re-execute Step 3 roadmap mapping section |
| positioning change | Strategic direction differentiation strategy | Re-evaluate strategic direction differentiation logic |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Strategic direction adjustment | stakeholder-analysis | Output file version number + change summary |
| OKR change | planning-roadmap | Output file version number + change summary |
| Risk contingency update | stakeholder-analysis | Output file version number + change summary |
| Posture assessment change | strategic-analysis | Output file version number + change summary |
