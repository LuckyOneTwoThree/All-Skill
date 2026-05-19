---
name: strategic-analysis
description: "Strategic analysis with automatic framework selection (SWOT/Ansoff/Porter's Five Forces) based on product stage and industry characteristics. Keywords: strategic analysis, SWOT, Ansoff matrix, Porter's Five Forces, strategic planning."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Strategic Planning & Roadmap"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me analyze strengths and weaknesses"
    - "What are our opportunities and threats"
    - "How should we expand the market"
    - "Where is the next growth direction"
    - "Is this industry worth entering"
---

# Strategic Analysis

## Core Principles

1. **Framework Selection Before Execution** -- Automatically select 1-2 most applicable strategic frameworks based on product stage and industry characteristics; not all frameworks suit all scenarios
2. **Internal-External Cross-Validation** -- SWOT S/W from internal capability assessment, O/T from external data; sources must not be conflated; Ansoff paths must cross-validate with SWOT strengths/weaknesses
3. **Mandatory Evidence Labeling** -- Each analysis item must have data or factual support, labeled with confidence; low confidence auto-escalates for human calibration
4. **Increasing Risk Principle** -- From market penetration to diversification, increasing risk must be explicitly labeled; Porter's Five Forces industry attractiveness overall assessment must be a human decision
5. **Dual-Path Reasoning** -- Ansoff recommends at least 2 growth paths, including risk level and feasibility assessment
6. **Five Forces Full Coverage** -- New entrants, substitutes, suppliers, buyers, competitive rivalry, all five forces must be covered

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Exploration Phase Output | JSON | Yes | user-research-user-modeling / opportunity-definition | User pain points, need insights |
| Competitor Analysis Data | JSON | Yes | output/pm-discovery/market-competitor-analysis/competitor-analysis.json | Competitor positioning, feature comparison |
| BMC Business Model Canvas | JSON | O | output/pm-strategy/business-model-canvas/bmc.json | Value propositions, core resources |
| Market Data | JSON | O | output/pm-discovery/market-tam-som/tam-som.json | Market size, growth rate |
| Industry Information | JSON | O | output/pm-discovery/market-pest/pest.json | Policies and regulations, technology trends |
| Internal Capability Assessment | JSON | O | User provided | Technology/brand/resource/financial capabilities |
| Current Product Definition | string | O | User provided | Product core features and value proposition description |
| Current Market Definition | string | O | User provided | Target market, user group description |
| Growth Goal | string | O | output/pm-strategy/planning-okr/okr.json | Desired growth direction and targets |

## Execution Steps

### Step 1: Framework Selection

Automatically select 1-2 most applicable strategic frameworks based on product stage and industry characteristics.

**Framework Selection Rules**:

| Scenario Characteristics | Recommended Framework | Selection Rationale |
|----------|----------|----------|
| New product/new market entry | SWOT + Porter's Five Forces | Need to simultaneously assess internal capabilities and external industry attractiveness |
| Existing product growth decision | SWOT + Ansoff | Need to assess strengths/weaknesses and determine growth path |
| Industry competitive landscape analysis | Porter's Five Forces | Focus on industry structure and competitive intensity |
| Strategic positioning and direction selection | SWOT | Focus on internal-external cross-analysis to generate strategic directions |
| Market expansion decision | Ansoff + Porter's Five Forces | Need to assess growth paths and target market attractiveness |
| Complete strategic planning | SWOT + Ansoff + Porter's Five Forces | Comprehensive strategic analysis |

**Selection Logic**:

1. If user provides internal capability assessment -> SWOT applicable
2. If user provides product/market definition -> Ansoff applicable
3. If user provides competitor and market data -> Porter's Five Forces applicable
4. Default recommendation: SWOT (most universally applicable)
5. Select at most 2 frameworks (avoid over-analysis); if all 3 are applicable, prioritize SWOT + Ansoff

### Step 2: Execute Analysis

Execute strategic analysis per selected frameworks.

#### 2a: SWOT Analysis

**Step 2a-1: Internal Strengths Identification (Strengths)**

Analyze internal strengths: Core technology and patents, brand awareness and reputation, user base and loyalty, channel and network resources, talent and organizational capabilities, financial resources and cash flow

**Step 2a-2: Internal Weaknesses Identification (Weaknesses)**

Analyze internal weaknesses: Technology or product gaps, insufficient brand awareness, resource or capability deficiencies, organizational structure issues, financial constraints

**Step 2a-3: External Opportunities Identification (Opportunities)**

Analyze external market opportunities: Market size and growth, policy support, technology-driven opportunities, niche market gaps, partnership opportunities, user demand changes

**Step 2a-4: External Threats Identification (Threats)**

Analyze external market threats: Competitor actions, substitute threats, regulatory risks, technology disruption risks, market shrinkage, economic environment changes

**Step 2a-5: Strategic Direction Generation**

Generate 4 types of strategies based on SWOT cross-analysis:

| Strategy Type | Meaning |
|----------|------|
| SO Strategy (Strengths-Opportunities) | Leverage strengths to seize opportunities |
| ST Strategy (Strengths-Threats) | Leverage strengths to mitigate threats |
| WO Strategy (Weaknesses-Opportunities) | Leverage opportunities to compensate for weaknesses |
| WT Strategy (Weaknesses-Threats) | Retract and defend, minimize weaknesses and threats |

#### 2b: Ansoff Matrix Analysis

**Step 2b-1: Current Quadrant Determination**

```
                    │ Existing Products  │ New Products
────────────────────┼───────────────────┼──────────────
    Existing Market │ Market Penetration │ Product Development
                    │ (Penetration)      │ (Development)
────────────────────┼───────────────────┼──────────────
    New Market      │ Market Development │ Diversification
                    │ (Development)      │ (Diversification)
```

**Step 2b-2: Growth Path Recommendation**

Based on SWOT and growth goals, recommend 1-2 growth paths, each including:
- Path name and type
- Risk level (High/Medium/Low)
- Resource requirements (High/Medium/Low)
- Expected return (High/Medium/Low)
- Timeline (cycle)
- Feasibility assessment (market attractiveness, capability match, resource availability, risk controllability)

**Step 2b-3: Path Feasibility Assessment**

Assess feasibility of each path: Market attractiveness, capability match, resource availability, risk controllability

#### 2c: Porter's Five Forces Analysis

**Force 1: Threat of New Entrants**

| Score | Standard |
|------|------|
| 1 | Extremely high entry barriers, nearly impossible to enter |
| 2 | High entry barriers, difficult for new entrants |
| 3 | Moderate barriers, some entry possibility |
| 4 | Low entry barriers, easy to enter |
| 5 | Very low entry barriers, extremely easy to enter |

Assessment factors: Entry threshold, brand loyalty, economies of scale requirements, switching costs, capital requirements, distribution channel control

**Force 2: Threat of Substitutes**

| Score | Standard |
|------|------|
| 1 | Almost no substitutes |
| 2 | Few substitutes, high switching costs |
| 3 | Some substitutes exist |
| 4 | Many substitutes, clear price advantages |
| 5 | Abundant substitutes, extreme threat |

Assessment factors: Number and quality of substitutes, switching costs, substitute price advantages, user acceptance of substitutes

**Force 3: Bargaining Power of Suppliers**

| Score | Standard |
|------|------|
| 1 | Suppliers dispersed, weak bargaining power |
| 2 | Many suppliers, ample choices |
| 3 | Moderate supplier power |
| 4 | Suppliers concentrated, strong bargaining power |
| 5 | Supplier monopoly, extremely strong bargaining power |

Assessment factors: Number and concentration of suppliers, switching supplier costs, forward integration possibility, supplier product differentiation, supplier scale

**Force 4: Bargaining Power of Buyers**

| Score | Standard |
|------|------|
| 1 | Buyers dispersed, weak bargaining power |
| 2 | Many buyers, ample choices |
| 3 | Moderate buyer power |
| 4 | Buyers concentrated, strong bargaining power |
| 5 | Buyer monopoly, extremely strong bargaining power |

Assessment factors: Number and concentration of buyers, switching costs, price sensitivity, buyer information transparency, purchase volume

**Force 5: Intensity of Competitive Rivalry**

| Score | Standard |
|------|------|
| 1 | Mild competition, stable market |
| 2 | Moderate competition, orderly development |
| 3 | Medium competition, noticeable fluctuation |
| 4 | Intense competition, price wars common |
| 5 | Cutthroat competition, frequent elimination |

Assessment factors: Number and scale of competitors, industry growth rate, product differentiation degree, exit barriers, competitive strategy diversity

### Step 3: Strategic Conclusion Integration

Integrate analysis conclusions from each framework to generate unified strategic recommendations.

**Integration Rules**:

1. SWOT strategic directions + Ansoff growth paths cross-validation: Are SO strategies consistent with Ansoff recommended paths
2. Porter's Five Forces industry attractiveness + Ansoff path feasibility: When industry attractiveness is low, growth path risk needs to be upgraded
3. SWOT strengths + Porter's Five Forces competitive barriers: Do strengths constitute competitive barriers, are barriers sustainable
4. Generate integrated strategic recommendation list, sorted by priority

## Output

Output path: `output/pm-strategy/strategic-analysis/`

Output files: strategic-analysis.json + strategic-analysis.md

### Output Schema

```json
{
  "type": "object",
  "required": ["framework_selection", "swot", "ansoff", "porter", "strategic_conclusions", "metadata"],
  "properties": {
    "framework_selection": {"type": "object", "description": "Framework selection results and rationale"},
    "swot": {"type": "object", "description": "SWOT analysis results, null when not selected"},
    "ansoff": {"type": "object", "description": "Ansoff matrix analysis results, null when not selected"},
    "porter": {"type": "object", "description": "Porter's Five Forces analysis results, null when not selected"},
    "strategic_conclusions": {"type": "object", "description": "Integrated strategic conclusions"},
    "metadata": {"type": "object", "description": "Metadata, including version, timestamp, and source files"}
  }
}
```

### Output Validation Rules

#### framework_selection Validation

| Field Path | Type | Required | Description |
|----------|------|------|------|
| `framework_selection.selected_frameworks` | array | Yes | Selected framework list, 1-2, must be one of swot/ansoff/porter |
| `framework_selection.selection_rationale` | string | Yes | Selection rationale, cannot be empty |

#### swot Validation (required when selected)

| Field Path | Type | Required | Description |
|----------|------|------|------|
| `swot.strengths` | array | Yes | Strengths list, each with item, confidence, evidence |
| `swot.weaknesses` | array | Yes | Weaknesses list, each with item, confidence, evidence |
| `swot.opportunities` | array | Yes | Opportunities list, each with item, confidence, evidence |
| `swot.threats` | array | Yes | Threats list, each with item, confidence, evidence |
| `swot.strategies` | array | Yes | 4 strategic directions |
| `swot.strategies[].type` | string | Yes | SO/ST/WO/WT |
| `swot.strategies[].strategy` | string | Yes | Strategy name |
| `swot.strategies[].key_actions` | array | Yes | Key actions list |
| `swot.strategies[].expected_outcome` | string | Yes | Expected outcome |

#### ansoff Validation (required when selected)

| Field Path | Type | Required | Description |
|----------|------|------|------|
| `ansoff.current_position.quadrant` | string | Yes | Current quadrant |
| `ansoff.current_position.description` | string | Yes | Current positioning description |
| `ansoff.current_position.rationale` | array | Yes | Positioning rationale list |
| `ansoff.growth_paths` | array | Yes | At least 2 growth paths |
| `ansoff.growth_paths[].path` | string | Yes | Path name |
| `ansoff.growth_paths[].quadrant` | string | Yes | Target quadrant |
| `ansoff.growth_paths[].risk_level` | string | Yes | high/medium/low |
| `ansoff.growth_paths[].feasibility.overall` | number | Yes | Feasibility composite score 0-1 |
| `ansoff.growth_paths[].key_actions` | array | Yes | Key actions list |
| `ansoff.growth_paths[].risks` | array | Yes | Risk list, including mitigation |
| `ansoff.recommendations.primary` | string | Yes | Recommended primary path |
| `ansoff.recommendations.rationale` | string | Yes | Recommendation rationale |

#### porter Validation (required when selected)

| Field Path | Type | Required | Description |
|----------|------|------|------|
| `porter.new_entrant_threat.score` | number | Yes | 1-5 score |
| `porter.new_entrant_threat.key_factors` | array | Yes | Key influencing factors list |
| `porter.substitutes_threat.score` | number | Yes | 1-5 score |
| `porter.substitutes_threat.key_factors` | array | Yes | Key influencing factors list |
| `porter.supplier_power.score` | number | Yes | 1-5 score |
| `porter.supplier_power.key_factors` | array | Yes | Key influencing factors list |
| `porter.buyer_power.score` | number | Yes | 1-5 score |
| `porter.buyer_power.key_factors` | array | Yes | Key influencing factors list |
| `porter.competitive_rivalry.score` | number | Yes | 1-5 score |
| `porter.competitive_rivalry.key_factors` | array | Yes | Key influencing factors list |
| `porter.industry_attractiveness.overall_score` | number | Yes | Composite score |
| `porter.industry_attractiveness.rating` | string | Yes | Attractiveness rating |
| `porter.key_recommendations` | array | Yes | Strategic recommendations list |

#### strategic_conclusions Validation

| Field Path | Type | Required | Description |
|----------|------|------|------|
| `strategic_conclusions.integrated_recommendations` | array | Yes | Integrated strategic recommendations list, cannot be empty |
| `strategic_conclusions.integrated_recommendations[].recommendation` | string | Yes | Strategic recommendation |
| `strategic_conclusions.integrated_recommendations[].priority` | string | Yes | Priority: high/medium/low |
| `strategic_conclusions.integrated_recommendations[].supporting_frameworks` | array | Yes | Frameworks supporting this recommendation |
| `strategic_conclusions.integrated_recommendations[].evidence` | string | Yes | Evidence basis |
| `strategic_conclusions.cross_validation_notes` | array | Yes | Cross-framework validation notes |
| `strategic_conclusions.human_decisions_needed` | array | Yes | Items requiring human decision |

### Output JSON Example

```json
{
  "framework_selection": {
    "selected_frameworks": ["swot", "ansoff"],
    "selection_rationale": "User provided internal capability assessment and product/market definition, suitable for SWOT+Ansoff combined analysis"
  },
  "swot": {
    "strengths": [
      { "item": "Owns proprietary AI adaptive learning engine", "confidence": 0.85, "evidence": "Patent ZL2023XXXXXX, A/B test shows learning efficiency improvement of 32%" }
    ],
    "weaknesses": [
      { "item": "Insufficient K12 subject content resources", "confidence": 0.75, "evidence": "Content SKU comparison: Competitor A covers 12 subjects vs our 3 subjects" }
    ],
    "opportunities": [
      { "item": "Vocational education policy dividend period", "confidence": 0.80, "evidence": "State Council 2024 Vocational Education Reform Implementation Plan" }
    ],
    "threats": [
      { "item": "Internet giants entering market with free strategy", "confidence": 0.70, "evidence": "Competitor B launched free basic version in 2024Q3" }
    ],
    "strategies": [
      { "type": "SO", "strategy": "AI engine + enterprise training market penetration", "key_actions": ["Sign pilot agreements with 50 mid-to-large enterprises for training platform"], "expected_outcome": "Enterprise customer count grows 40% within 6 months" }
    ]
  },
  "ansoff": {
    "current_position": {
      "quadrant": "Market Penetration",
      "description": "Currently positioned as existing product in existing market",
      "rationale": ["Product mature and stable"]
    },
    "growth_paths": [
      {
        "path": "Market Development",
        "quadrant": "Market Development",
        "risk_level": "medium",
        "resource_requirement": "medium",
        "expected_return": "medium",
        "timeline": "6-12 months",
        "feasibility": { "overall": 0.70, "market_attractiveness": 0.75, "capability_match": 0.80, "resource_availability": 0.65, "risk_controllability": 0.60 },
        "key_actions": ["Identify target new market segments"],
        "risks": [{ "risk": "Insufficient market awareness", "mitigation": "Co-branding promotion" }]
      }
    ],
    "recommendations": {
      "primary": "Market Development",
      "rationale": "Controllable risk, moderate resource requirements, high capability match"
    }
  },
  "porter": null,
  "strategic_conclusions": {
    "integrated_recommendations": [
      { "recommendation": "Prioritize market development strategy, leveraging AI engine advantage to expand enterprise training new market", "priority": "high", "supporting_frameworks": ["swot", "ansoff"], "evidence": "SO strategy consistent with Ansoff market development path, feasibility score 0.70" }
    ],
    "cross_validation_notes": [
      "SWOT SO strategy and Ansoff market development path direction consistent, mutually validated"
    ],
    "human_decisions_needed": [
      { "item": "Strategic direction selection", "context": "SO strategy (market penetration) vs WO strategy (content strengthening) vs market development path, human decision needed for final direction", "urgency": "High" }
    ]
  },
  "metadata": {
    "version": "1.0",
    "generated_at": "2026-05-14T21:00:00Z",
    "source_files": [
      "output/pm-discovery/market-competitor-analysis/competitor-analysis.json"
    ]
  }
}
```

## Decision Rules

1. **SWOT Confidence Escalation**: Items with confidence < 0.6 auto-escalate for human calibration
2. **SWOT Strategic Selection**: 4 strategic directions must have human final selection
3. **Ansoff Growth Path Selection**: Must be human final decision
4. **Ansoff Risk Assessment**: Human judges risk acceptance level
5. **Porter's Five Forces Score Calibration**: Each force score requires human calibration confirmation
6. **Porter's Five Forces Industry Attractiveness**: Overall assessment must be human judgment
7. **Framework Selection Overridable**: AI auto-selected frameworks can be adjusted by human; human-specified frameworks take priority

## Quality Checks

| Check Item | Pass Condition |
|--------|----------|
| Framework selection reasonable | selected_frameworks not empty and selection rationale sufficient |
| SWOT each item has data support | evidence field not empty |
| SWOT 4 strategic directions generated | strategies include SO/ST/WO/WT |
| SWOT confidence assessment completed | Each item has confidence value |
| Ansoff 4 quadrants analyzed | Current positioning determined |
| Ansoff 1-2 growth paths recommended | growth_paths not empty |
| Ansoff each path has risk level labeled | risk_level not empty |
| Ansoff feasibility assessment completed | feasibility not empty |
| Porter's Five Forces 5 forces assessed | 5 forces each have score |
| Porter's Five Forces scores have data basis | key_factors not empty |
| Porter's Five Forces industry attractiveness overall assessment completed | industry_attractiveness not empty |
| Strategic conclusions integrated | integrated_recommendations not empty |
| Cross-framework validation completed | cross_validation_notes not empty |
| Human decision items listed | human_decisions_needed not empty |

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| exploration_outputs (persona / opportunity-definition etc.) | User provides product status description -> Generate analysis based on description | Lacks exploration phase data, O/T may lack user-side empirical evidence |
| competitor-analysis.json | User provides product/industry status description -> Generate analysis based on description | Lacks competitor analysis data, T and some O lack competitor reference, Porter's Five Forces competitive rivalry score may be imprecise |
| bmc.json | User provides product status description -> Generate analysis based on description | Lacks BMC data, S/W correlation with business model may be weak |
| Market data (tam-som / pest) | User provides industry information -> Assess based on AI knowledge | Lacks market data, industry attractiveness assessment lacks quantitative basis |
| Internal capability assessment (user provided) | Prompt user to provide or skip related steps | S/W lacks internal data support, may be subjective |
| Current product/market definition | User provides product status -> Position Ansoff quadrant | Lacks structured product-market definition, quadrant positioning may be imprecise |
| All upstream files missing | Prompt user to execute prior phases first, or directly generate analysis based on user-provided product status description | Overall confidence significantly reduced, analysis primarily AI inference |

## Data Acquisition Instructions

This Skill requires exploration outputs, competitor analysis, and BMC data, please provide via one of the following methods:
  1. Directly describe product status, strengths, and challenges
  2. Upload competitor-analysis.json / bmc.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Data Source | Change Type | Impact Dimension | Impact Description | Response Strategy |
|-----------|----------|----------|----------|----------|
| persona/opportunity-definition | User insight update | SWOT O and T | User insight changes affect opportunity and threat assessment | Re-execute SWOT Step 3-4, update opportunities and threats |
| competitor-analysis.json | Competitor data update | SWOT T and some O / Porter Force1 and Force5 | Competitor changes affect threat assessment and competitive analysis | Re-execute SWOT Step 3-4 and Porter Force1/5 |
| bmc.json | Business model change | SWOT S and W | Business model changes affect strengths and weaknesses | Re-execute SWOT Step 1-2 |
| tam-som.json | Market size change | Porter industry attractiveness / Ansoff feasibility | Market data changes affect attractiveness assessment | Recalculate industry attractiveness composite score and Ansoff feasibility |
| pest.json | Policy/technology environment change | Porter multiple factors | Environment changes affect multiple force assessments | Re-assess affected forces |
| okr.json | Growth goal adjustment | Ansoff growth path recommendation | Growth goal changes affect path direction | Re-execute Ansoff Step 2 |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Field | Notification Trigger | Notification Content |
|-----------|----------|----------|----------|
| planning-okr | `strategic_conclusions.integrated_recommendations` | After strategic conclusion change | Notify strategic direction adjustment and priority changes |
| planning-roadmap | `strategic_conclusions.integrated_recommendations` | After strategic conclusion change | Notify strategic direction adjustment |
| business-strategy-report | `swot.strategies` / `ansoff.growth_paths` / `porter.industry_attractiveness` | After each framework analysis change | Notify analysis result changes |
