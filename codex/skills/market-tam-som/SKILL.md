---
name: market-tam-som
description: "Use when assessing the TAM/SAM/SOM size of a target market. Market size auto-estimation, supports top-down and bottom-up dual-path cross-validation, annotates and escalates to human judgment when difference >20%, outputs range estimates and confidence assessment. Keywords: market size, TAM, SAM, SOM, market capacity, range estimate, dual-path cross-validation, how big is the market, ceiling, how large can we grow."
metadata:
  module: "Product Discovery"
  sub-module: "Market Competitors"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "Finance", "General"]
  trigger_examples:
    - "How big is this market"
    - "Help me calculate market size"
    - "Where is our ceiling"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output market size estimation"
  deep_description: "Complete estimation + segment market decomposition + growth rate forecast + market entry priority"
---

# Market Size Auto-Estimation

## Core Principles

1. **Dual-path cross-validation** — Top-down and bottom-up paths estimate independently; when difference >20%, must annotate and escalate to human judgment; single-path conclusions are unreliable
2. **Range over point estimate** — All size figures output range estimates (optimistic/neutral/conservative); do not output single determined values, because certainty in market size is an illusion
3. **Assumptions made explicit** — Assumptions for each estimation step must be explicitly listed (assumption/basis/impact_direction); assumptions whose change impacts results by >30% are annotated as high-sensitivity
4. **Layered confidence** — TAM confidence is highest (industry data support), SAM next (overlaid with filter coefficients), SOM lowest (overlaid with competition and resource constraints); progressive decrease is normal

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| category_keywords | string | Yes | User provided | Category keywords, e.g., "online education", "SaaS CRM" |
| geographic_scope | string | Yes | User provided | Target market geographic scope, e.g., "Mainland China", "Southeast Asia" |
| time_range | string | Yes | User provided | Estimation time range, e.g., "2025-2027" |

## Execution Steps

### Step 1: TAM Estimation [Core]

Adopt dual-path cross-validation:

**Top-down path:**
- Obtain industry total size data (statistics bureau / industry associations / third-party research reports)
- Determine target category's share within the industry
- Calculate: TAM = Industry total size × Target category share

**Bottom-up path:**
- Estimate total target users (population base × target group penetration rate)
- Obtain ARPU (average revenue per user per year) reference value
- Calculate: TAM = Total target users × ARPU

**Output requirements:**
- Range estimate: Optimistic / Neutral / Conservative values
- Each estimated value annotated with data source
- When two paths' results differ by >20%, annotate as needing human judgment

### Step 2: SAM Estimation [Core]

Filter layer by layer on top of TAM:

| Filter Dimension | Description |
|---------|------|
| Geographic scope limitation | Trim to target regional market size based on geographic_scope |
| Target customer group filter | Exclude non-target customer groups, overlay customer profile filter coefficient |
| Service capability boundary | Deduct portions that own channels/technology/compliance cannot cover |

**Calculation logic:** SAM = TAM × Geographic coefficient × Customer group coefficient × Service capability coefficient

**Output requirements:**
- Each filter coefficient and its basis
- SAM range estimate (optimistic/neutral/conservative)

### Step 3: SOM Estimation [Core]

Overlay competition and resource constraints on top of SAM:

| Constraint Dimension | Description |
|---------|------|
| Competitive landscape | Market share already occupied by existing competitors + competitor barrier strength |
| Own resource constraints | Team size / Funding / Technology reserves / Channel resources |
| Customer acquisition capability estimate | Expected customer acquisition channel efficiency + Conversion rate + Retention rate |

**Calculation logic:** SOM = SAM × (1 - Competition constraint%) × (1 - Resource constraint%) × (1 - Acquisition constraint%)

> SOM uses SAM as the base, progressively deducting competition, resource, and acquisition constraints to arrive at the obtainable market share.

**Output requirements:**
- SOM range estimate (optimistic/neutral/conservative)
- Achievable timeline (6-month/12-month/24-month milestones)

### Step 4: Confidence Assessment [Core]

Assess credibility of overall estimation results:

| Assessment Dimension | Method |
|---------|------|
| Data source reliability | Evaluate reliability score for each data source (0-1); sources include official statistics, industry associations, third-party research reports, expert interviews, etc. |
| Assumption sensitivity analysis | Apply ±20% variation to key assumptions, observe impact magnitude on final results |
| Key assumption annotation | List all core assumptions, annotate assumption content, basis, impact direction on results |

**Output requirements:**
- Overall confidence score (0-1)
- Key assumption list and sensitivity analysis results
- Low confidence data points annotated

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Market size estimation | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output, including all Step outputs |
| deep | Complete estimation + segment market decomposition + growth rate forecast + market entry priority | Complete output + extended analysis + deep projection |

## Output

Output file: `output/pm-discovery/market-tam-som/tam-som.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["category_keywords", "geographic_scope", "time_range", "tam", "sam", "som", "confidence"],
  "properties": {
    "category_keywords": {"type": "string", "description": "Category keywords"},
    "geographic_scope": {"type": "string", "description": "Target market geographic scope"},
    "time_range": {"type": "string", "description": "Estimation time range"},
    "tam": {"type": "object", "description": "TAM Total Addressable Market estimation, including top-down and bottom-up dual paths"},
    "sam": {"type": "object", "description": "SAM Serviceable Addressable Market estimation"},
    "som": {"type": "object", "description": "SOM Serviceable Obtainable Market estimation"},
    "confidence": {"type": "object", "description": "Confidence assessment, including data source reliability and sensitivity analysis"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|---------|------|------|------|
| category_keywords | string | Yes | Category keywords, cannot be empty |
| geographic_scope | string | Yes | Target market geographic scope, cannot be empty |
| time_range | string | Yes | Estimation time range, format like "2025-2027" |
| tam | object | Yes | TAM estimation results, must include top_down and bottom_up sub-objects |
| tam.top_down | object | Yes | Top-down estimation path, must include industry_total, category_ratio, estimates, data_sources |
| tam.top_down.industry_total | string | Yes | Industry total size, must include unit |
| tam.top_down.category_ratio | string | Yes | Target category share, percentage format |
| tam.top_down.estimates | object | Yes | Must include optimistic, neutral, conservative range values |
| tam.top_down.data_sources | array | Yes | Data source list, can be empty array but cannot be missing |
| tam.bottom_up | object | Yes | Bottom-up estimation path, must include target_users, arpu, estimates, data_sources |
| tam.bottom_up.target_users | string | Yes | Total target users, must include unit |
| tam.bottom_up.arpu | string | Yes | Average revenue per user per year, must include unit |
| tam.bottom_up.estimates | object | Yes | Must include optimistic, neutral, conservative range values |
| tam.bottom_up.data_sources | array | Yes | Data source list, can be empty array but cannot be missing |
| sam | object | Yes | SAM estimation results |
| sam.geo_coefficient | string | Yes | Geographic filter coefficient, between 0-1 |
| sam.audience_coefficient | string | Yes | Customer group filter coefficient, between 0-1 |
| sam.service_coefficient | string | Yes | Service capability coefficient, between 0-1 |
| sam.estimates | object | Yes | Must include optimistic, neutral, conservative range values |
| sam.data_sources | array | Yes | Data source list |
| som | object | Yes | SOM estimation results |
| som.base | string | Yes | Calculation base, fixed as "SAM" |
| som.competition_constraint | string | Yes | Competition constraint percentage, between 0-1 |
| som.resource_constraint | string | Yes | Resource constraint percentage, between 0-1 |
| som.acquisition_constraint | string | Yes | Acquisition constraint percentage, between 0-1 |
| som.calculation | string | Yes | Calculation formula, showing complete multiplication process |
| som.estimates | object | Yes | Must include optimistic, neutral, conservative range values |
| som.timeline | object | Yes | Achievable timeline, must include 6m, 12m, 24m milestones |
| som.data_sources | array | Yes | Data source list |
| confidence | object | Yes | Confidence assessment |
| confidence.overall_score | number | Yes | Overall confidence score, between 0-1 |
| confidence.data_source_reliability | array | Yes | Data source reliability score list |
| confidence.sensitivity_analysis | array | Yes | Sensitivity analysis results list |
| confidence.key_assumptions | array | Yes | Key assumption list; each must include assumption, basis, impact_direction |
| confidence.key_assumptions[].assumption | string | Yes | Assumption content description |
| confidence.key_assumptions[].basis | string | Yes | Assumption basis |
| confidence.key_assumptions[].impact_direction | string | Yes | Impact direction on results: positive/negative/bidirectional |
| confidence.key_assumptions[].sensitivity | string | No | Sensitivity annotation; annotate as "high" when impact >30% |
| confidence.key_assumptions[].needs_human_validation | boolean | No | Whether human validation needed; high-sensitivity assumptions default to true |

```json
{
  "category_keywords": "Online Education",
  "geographic_scope": "Mainland China",
  "time_range": "2025-2027",
  "tam": {
    "top_down": {
      "industry_total": "500 billion",
      "category_ratio": "8%",
      "estimates": {
        "optimistic": "40 billion",
        "neutral": "30 billion",
        "conservative": "20 billion"
      },
      "data_sources": []
    },
    "bottom_up": {
      "target_users": "120 million",
      "arpu": "3000 CNY/year",
      "estimates": {
        "optimistic": "36 billion",
        "neutral": "28 billion",
        "conservative": "20 billion"
      },
      "data_sources": []
    }
  },
  "sam": {
    "geo_coefficient": "0.85",
    "audience_coefficient": "0.35",
    "service_coefficient": "0.60",
    "estimates": {
      "optimistic": "12 billion",
      "neutral": "8.5 billion",
      "conservative": "5.5 billion"
    },
    "data_sources": []
  },
  "som": {
    "base": "SAM",
    "competition_constraint": "0.60",
    "resource_constraint": "0.65",
    "acquisition_constraint": "0.50",
    "calculation": "SAM × (1 - 0.60) × (1 - 0.65) × (1 - 0.50) = SAM × 0.07",
    "estimates": {
      "optimistic": "900 million",
      "neutral": "600 million",
      "conservative": "300 million"
    },
    "timeline": {
      "6m": "Complete product MVP, acquire first 1000 paying users",
      "12m": "Iterate product to v2.0, paying users exceed 10,000",
      "24m": "Establish brand influence, paying users reach 100,000"
    },
    "data_sources": []
  },
  "confidence": {
    "overall_score": 0.0,
    "data_source_reliability": [],
    "sensitivity_analysis": [],
    "key_assumptions": [
      {
        "assumption": "K-12 online education penetration rate will continue to grow",
        "basis": "Ministry of Education promoting education digitalization policy",
        "impact_direction": "positive",
        "sensitivity": "high",
        "needs_human_validation": false
      }
    ]
  }
}
```

## Decision Rules

| Rule | Trigger Condition | Action |
|------|---------|------|
| Low data source reliability | Data source reliability score < 0.5 | Annotate as needing human validation, suspend use of that data point |
| High assumption sensitivity | Key assumption change impacts results by > 30% | Annotate as high-sensitivity assumption, recommend human confirmation |
| Large dual-path difference | Top-down and bottom-up results differ by > 20% | Annotate as needing human judgment, provide difference analysis |

## Quality Check

### P0 Checks (must pass for quick/standard/deep)

- [ ] TAM/SAM/SOM three-layer estimation complete
- [ ] Each layer includes range estimates (optimistic/neutral/conservative)

### P1 Checks (must pass for standard/deep)

- [ ] Key assumptions annotated
- [ ] Data sources listed
- [ ] Confidence score completed
- [ ] Low reliability data sources annotated as needing human validation
- [ ] High-sensitivity assumptions annotated

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep projection and roadmap generated)
- [ ] Decision records complete (key decisions have basis and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| No strong dependencies | This Skill can run independently; user provides category keywords and target market to execute | No impact, output complete | Request user to provide category keywords and target market |
| All upstream files missing | User provides category keywords and target market → estimate TAM/SAM/SOM based on public data in AI knowledge base | Data source reliability score lowered, confidence.overall_score may be <0.5, annotated "based on AI knowledge base estimation" | Request user to provide category keywords (e.g., "online education") and target market (e.g., "Mainland China") |
| If user does not provide category_keywords | Prompt user to provide category keywords; otherwise cannot execute market size estimation | Cannot generate output, process blocked | Request user to provide category keywords (e.g., "online education", "SaaS CRM") |
| If user does not provide geographic_scope | Prompt user to provide target market geographic scope; otherwise default to "Global" | sam.geo_coefficient defaults to 1.0 (no geographic filtering), SAM=TAM, confidence lowered | Request user to provide target market geographic scope (e.g., "Mainland China", "North America") |
| If user does not provide time_range | Prompt user to provide estimation time range; otherwise default to 3 years from current year | time_range field is inferred value, annotated "default value", trend forecast accuracy lowered | Request user to provide estimation time range (e.g., "2024-2026") |

## Data Acquisition Instructions

This Skill requires category keywords and target market information. Please provide via one of the following methods:
  1. Directly input category keywords (e.g., "online education", "SaaS CRM") and target market (e.g., "Mainland China")
  2. Upload market research data files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

## Upstream Change Response

### Upstream Change Impact Table

| Upstream File | Change Type | Impact Scope | Impact Description |
|---------|---------|---------|---------|
| pest.json | Policy/regulation change | SAM geographic coefficient, SAM customer group coefficient | New policies may expand or shrink serviceable market scope; need to re-evaluate geo_coefficient and audience_coefficient |
| pest.json | Economic indicator change | TAM industry total size | GDP/consumer spending and other indicator changes directly affect top_down path's industry_total |
| pest.json | Technology dynamics change | SAM service capability coefficient | New technology breakthroughs may improve service_coefficient, expanding serviceable boundaries |
| competitor-analysis.json | Competitive landscape change | SOM competition constraint coefficient | New competitor entry or competitor share changes directly affect competition_constraint |
| competitor-analysis.json | Competitor pricing strategy change | SOM acquisition constraint coefficient | Competitor price wars may increase customer acquisition costs, affecting acquisition_constraint |

### Downstream Notification Mechanism Table

| Trigger Event | Notify Target | Notification Content | Priority |
|---------|---------|---------|--------|
| TAM neutral value change >20% | market-competitor-analysis | TAM size significantly changed; recommend re-evaluating market attractiveness and competitive strategy | High |
| SAM filter coefficient adjustment >0.1 | market-competitor-analysis | Serviceable market scope changed; recommend updating competitor coverage analysis | Medium |
| SOM obtainable share change >30% | opportunity-definition | Obtainable market size significantly changed; recommend re-evaluating opportunity scoring | High |
| Key assumption added or changed | All downstream Skills | New/changed key assumptions may affect analysis conclusions relying on this Skill's output | Medium |
| confidence.overall_score drops to <0.5 | All downstream Skills | Overall confidence below threshold; downstream usage of this output requires附加 uncertainty disclaimer | High |
