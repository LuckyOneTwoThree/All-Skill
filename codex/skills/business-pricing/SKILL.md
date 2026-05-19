---
name: business-pricing
description: "Use when creating or optimizing a product pricing strategy. Auto-analyzes pricing with AI-suggested human-approved approach, analyzing competitor pricing, inferring willingness to pay, generating 3 differentiated pricing options. Keywords: pricing strategy, competitor analysis, willingness to pay, package design, unit economics, pricing model."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Business Model Design"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How should we price the product"
    - "How to create a pricing plan"
---

# Pricing Strategy Auto-Analysis

## Core Principles

1. **Three-Option Comparison** -- Must generate 3 differentiated pricing options (penetration/value/hybrid) for human selection
2. **Data-Anchored Pricing** -- Competitor pricing and willingness to pay are hard constraints; pricing must not be based on gut feeling
3. **Unit Economics Validation** -- Each option must pass feasibility validation through LTV/CAC and other unit economics metrics
4. **Risk Upfront** -- Risks such as underpricing damaging brand perception or overpricing blocking acquisition must be explicitly labeled

**Execution Cycle**: Triggered after Pipeline 2 (Value Proposition Fit) is complete

**Core Objective**: Based on the business canvas, competitor analysis, and willingness to pay inference, generate 3 differentiated pricing options and complete unit economics analysis.

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| BMC Data | JSON | Yes | output/pm-strategy/business-model-canvas/bmc.json | Value propositions, revenue models, customer segments, cost structure |
| Competitor Pricing Data | JSON | Yes | output/pm-discovery/market-competitor-analysis/competitor-analysis.json | Competitor pricing tiers, market positioning, market share |
| Willingness to Pay Inference Data | JSON | O | User provided | Willingness to pay range, inference method, confidence level |

### Required Input

**BMC Data (from Pipeline 1):**
```json
{
  "value_propositions": [...],
  "revenue_models": [...],
  "customer_segments": [...],
  "cost_structure": {...}
}
```

**Competitor Pricing Data:**
```json
{
  "competitor_pricing": [
    {
      "competitor_name": "Competitor name",
      "product_name": "Product name",
      "pricing_tiers": [
        {
          "tier_name": "Package name",
          "price": "Price",
          "billing_cycle": "monthly/annual/one-time",
          "features": ["Feature 1", "Feature 2"],
          "target_segment": "Target users"
        }
      ],
      "market_position": "premium/mid-market/budget",
      "market_share": "Market share estimate"
    }
  ]
}
```

**Willingness to Pay Inference Data:**
```json
{
  "willingness_to_pay": {
    "inferred_price_range": {
      "min": "Minimum price",
      "max": "Maximum price",
      "optimal": "Optimal price estimate"
    },
    "confidence": 0.7,
    "inference_method": "direct_survey/conjoint_analysis/market_analog/comparative_judgment",
    "sample_size": 50,
    "segment_variations": [
      {
        "segment_id": "segment-1",
        "price_sensitivity": "high/medium/low",
        "willingness_range": {"min": "X", "max": "Y"}
      }
    ]
  }
}
```

## Execution Steps

### Step 1: Competitor Pricing Matrix Analysis

**Task**: Integrate and systematically analyze competitor pricing strategies.

**Execution Logic**:
1. Collect competitor pricing data
2. Classify by price range and target market
3. Analyze pricing structure patterns (number of tiers, feature differentiation points)
4. Identify market pricing gap areas
5. Evaluate market acceptance of competitor pricing

**Output Format:**
```json
{
  "competitor_pricing_matrix": {
    "premium_segment": {
      "price_range": "JPY200-500/month",
      "players": ["Competitor A", "Competitor B"],
      "typical_features": ["Full features", "Premium support"],
      "positioning": "Enterprise/high-demand users"
    },
    "mid_market_segment": {
      "price_range": "JPY50-200/month",
      "players": ["Competitor C"],
      "typical_features": ["Core features + some premium"],
      "positioning": "Growing teams"
    },
    "budget_segment": {
      "price_range": "JPY0-50/month",
      "players": ["Competitor D", "Competitor E"],
      "typical_features": ["Basic features"],
      "positioning": "Individual users/entry-level"
    },
    "market_gaps": [
      {
        "gap_description": "Gap area description",
        "target_segment": "Target users",
        "opportunity": "Opportunity description"
      }
    ]
  }
}
```

**Acceptance Criteria**:
- Major competitors covered
- Price range classification clear
- Market gaps accurately identified

### Step 2: Willingness to Pay Inference

**Task**: Infer user willingness to pay based on multiple data sources.

**Inference Method Priority**:
1. Direct survey data (highest confidence)
2. Conjoint analysis results
3. Market analog method
4. Comparative judgment method

**Execution Logic**:
1. Integrate results from multiple inference methods
2. Calculate weighted average comprehensive willingness to pay range
3. Stratified analysis by user segment groups
4. Evaluate inference confidence

**Output Format:**
```json
{
  "willingness_to_pay_analysis": {
    "overall_range": {
      "floor": "JPY30/month",
      "ceiling": "JPY300/month",
      "optimal": "JPY80/month"
    },
    "confidence": 0.65,
    "confidence_breakdown": {
      "direct_survey_weight": 0.4,
      "conjoint_analysis_weight": 0.3,
      "market_analog_weight": 0.2,
      "comparative_judgment_weight": 0.1
    },
    "segment_analysis": [
      {
        "segment_id": "segment-1",
        "segment_name": "Segment group name",
        "price_floor": "JPY50/month",
        "price_ceiling": "JPY200/month",
        "price_optimal": "JPY80/month",
        "price_sensitivity": "medium"
      }
    ],
    "key_factors": [
      "Feature completeness is the primary value driver",
      "Competitor price anchoring effect is significant",
      "Annual subscription willingness higher than monthly"
    ]
  }
}
```

**Acceptance Criteria**:
- Inference methods transparent
- Confidence level justified
- Segment differences analyzed

### Step 3: Pricing Option Generation

**Task**: Generate 3 differentiated pricing options.

#### Option A: Penetration Pricing

**Positioning**: Market entry strategy, rapidly acquiring users with competitive pricing

**Execution Logic**:
1. Reference competitor low-to-mid pricing
2. Consider willingness to pay floor
3. Set acceptable initial loss tolerance period
4. Design conversion path

**Package Structure Example:**
```json
{
  "pricing_option_a": {
    "name": "Penetration Pricing",
    "positioning": "Market entry/user acquisition",
    "tiers": [
      {
        "tier_name": "Starter",
        "price": 29,
        "billing_cycle": "monthly",
        "annual_price": 290,
        "features": ["Core features", "5GB storage", "Basic support"],
        "limitations": ["User limit 5", "No advanced analytics"],
        "target_segment": "Individual users/small teams"
      },
      {
        "tier_name": "Professional",
        "price": 79,
        "billing_cycle": "monthly",
        "annual_price": 790,
        "features": ["Full features", "50GB storage", "Priority support", "API access"],
        "target_segment": "Growing teams"
      }
    ],
    "unit_economics": {
      "average_revenue_per_user": 54,
      "estimated_conversion_rate": "15%",
      "customer_acquisition_cost": 120,
      "payback_period_months": 3,
      "ltv_cac_ratio": 3.5
    },
    "risks": [
      "Low pricing may damage brand perception",
      "Initial losses impact cash flow",
      "Limited room for price adjustments"
    ],
    "recommended_timeline": "Evaluate price increase after 12-18 months"
  }
}
```

#### Option B: Value Pricing

**Positioning**: Mid-to-premium pricing based on value perception

**Execution Logic**:
1. Anchor to optimal willingness to pay range
2. Emphasize value premium from differentiation
3. Design clear feature tiering
4. Include bundled value

**Package Structure Example:**
```json
{
  "pricing_option_b": {
    "name": "Value Pricing",
    "positioning": "Value-driven/quality-first",
    "tiers": [
      {
        "tier_name": "Standard",
        "price": 99,
        "billing_cycle": "monthly",
        "annual_price": 990,
        "features": ["Core features+", "20GB storage", "Email support"],
        "target_segment": "Small and medium businesses"
      },
      {
        "tier_name": "Enterprise",
        "price": 299,
        "billing_cycle": "monthly",
        "annual_price": 2990,
        "features": ["Full features", "Unlimited storage", "Dedicated support", "SSO integration", "SLA guarantee"],
        "target_segment": "Large enterprises"
      }
    ],
    "unit_economics": {
      "average_revenue_per_user": 199,
      "estimated_conversion_rate": "8%",
      "customer_acquisition_cost": 150,
      "payback_period_months": 2,
      "ltv_cac_ratio": 5.2
    },
    "risks": [
      "Higher acquisition difficulty",
      "Requires strong value delivery support"
    ],
    "recommended_timeline": "Continuous execution"
  }
}
```

#### Option C: Hybrid Pricing

**Positioning**: Tiered coverage, maximizing market coverage and revenue potential

**Execution Logic**:
1. Introduce free tier to build user base
2. Mid-tier as primary revenue driver
3. Premium tier captures high-value customers
4. Design clear upgrade paths

**Package Structure Example:**
```json
{
  "pricing_option_c": {
    "name": "Hybrid Pricing",
    "positioning": "Full coverage/revenue maximization",
    "tiers": [
      {
        "tier_name": "Free",
        "price": 0,
        "features": ["Basic features", "1GB storage", "Community support"],
        "limitations": ["Feature restricted", "Usage limits"],
        "target_segment": "Individual users/trial"
      },
      {
        "tier_name": "Paid",
        "price": 59,
        "billing_cycle": "monthly",
        "annual_price": 590,
        "features": ["Advanced features", "30GB storage", "Priority support"],
        "target_segment": "Professional users"
      },
      {
        "tier_name": "Team",
        "price": 199,
        "billing_cycle": "monthly",
        "annual_price": 1990,
        "features": ["Team collaboration", "100GB storage", "Dedicated CSM", "Advanced permissions"],
        "target_segment": "Teams/departments"
      }
    ],
    "unit_economics": {
      "average_revenue_per_user": 89,
      "free_to_paid_conversion": "5%",
      "paid_tier_conversion": "12%",
      "customer_acquisition_cost": 80,
      "payback_period_months": 2.5,
      "ltv_cac_ratio": 4.2
    },
    "risks": [
      "Free tier operational costs",
      "Pricing tier management complexity",
      "Internal cannibalization possible"
    ],
    "recommended_timeline": "Adjust tiers based on initial data"
  }
}
```

## Output

**Storage Path**: `output/pm-strategy/business-pricing/`

**Output File**: pricing_analysis.json

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| pricing_analysis.competitor_pricing_matrix | object | Yes | Contains premium/mid/budget three-segment analysis |
| pricing_analysis.willingness_to_pay | object | Yes | Contains overall range, confidence, segment analysis |
| pricing_analysis.pricing_options.option_a | object | Yes | Penetration pricing option, includes tiers and unit_economics |
| pricing_analysis.pricing_options.option_b | object | Yes | Value pricing option, includes tiers and unit_economics |
| pricing_analysis.pricing_options.option_c | object | Yes | Hybrid pricing option, includes tiers and unit_economics |
| pricing_options.*.unit_economics.ltv_cac_ratio | number | Yes | LTV/CAC ratio, healthy standard >=3 |
| pricing_options.*.unit_economics.payback_period_months | number | Yes | Payback period (months) |
| pricing_analysis.recommendation.recommended_option | string | Yes | A/B/C |
| pricing_analysis.recommendation.reasoning | string | Yes | Recommendation rationale |

### Complete Pricing Analysis Report

```json
{
  "pricing_analysis": {
    "competitor_pricing_matrix": {...},
    "willingness_to_pay": {...},
    "pricing_options": {
      "option_a": {...},
      "option_b": {...},
      "option_c": {...}
    },
    "recommendation": {
      "recommended_option": "A/B/C",
      "reasoning": "Recommendation rationale",
      "alternative_for_mitigation": "Alternative option"
    }
  }
}
```

## Decision Rules

### Willingness to Pay Confidence Rules

**When confidence <0.5**:
1. Label recommendation for pre-sale test validation
2. Provide minimum sample size needed to reduce uncertainty
3. Suggest conservative pricing strategy as alternative
4. Explicitly label that pricing numbers require human approval

### Pricing Number Rules

**Decisions requiring human approval**:
- Specific pricing numbers (for any option)
- Package structure design
- Discount levels
- Price adjustment timing

### AI Assistance Scope

**Analysis AI can complete automatically**:
- Competitor data integration and visualization
- Willingness to pay range inference
- Unit economics calculations
- Sensitivity analysis
- Option comparison table generation

## Quality Checks

### Self-Check List

- [ ] All 3 pricing options generated
- [ ] Each option has differentiated positioning
- [ ] Unit economics calculations correct:
  - ARPU calculation logic correct
  - CAC allocation reasonable
  - LTV calculation includes retention assumptions
  - Break-even analysis complete
- [ ] Risks fully labeled
- [ ] Competitor matrix covers major competitors
- [ ] Willingness to pay inference methods transparent

### Calculation Validation

**Unit Economics Validation Checklist**:
- [ ] ARPU = Σ(Tier price x Tier user proportion)
- [ ] CAC includes acquisition costs (advertising, BD, etc.) allocation
- [ ] LTV = ARPU x Average lifetime (months)
- [ ] Payback period = CAC / (ARPU - Marginal cost)
- [ ] LTV/CAC >= 3 (healthy standard)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| bmc.json | User provides product description -> Recommend pricing based on industry benchmarks | Value propositions and cost structure lack BMC data support, pricing may deviate from actual |
| Competitor pricing data (competitor-analysis.json) | User provides product description -> Recommend pricing based on industry benchmarks | Competitor matrix is empty, market gaps cannot be identified, pricing lacks competitor anchoring |
| bmc.json + Competitor pricing data | User provides product description and target market -> Recommend pricing based on industry benchmarks | Overall confidence reduced, options lack data anchoring |
| All upstream files missing | Prompt user to execute prior phases first, or recommend pricing based on user-provided product description and industry benchmarks | Overall confidence significantly reduced, options are industry benchmark references only |
| Willingness to pay inference data (user provided) | If user has not provided willingness to pay inference data, prompt user to provide or skip related steps | Willingness to pay analysis missing, pricing options lack user-side validation |

## Data Acquisition Instructions

This Skill requires BMC and competitor pricing data, please provide via one of the following methods:
  1. Directly describe product features, target users, and pricing expectations
  2. Upload bmc.json / competitor-analysis.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| bmc.json value proposition update | Pricing option value anchors need adjustment | Re-evaluate pricing reasonableness for each option, update value premium basis |
| bmc.json customer segment change | Willingness to pay segmentation and package target users | Re-execute Step 2 and Step 3, adjust pricing by new segments |
| bmc.json cost structure change | Unit economics metrics need recalculation | Recalculate LTV/CAC and payback period |
| competitor-analysis competitor pricing update | Competitor pricing matrix and market gaps | Re-execute Step 1, update competitor benchmarking |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Pricing option adjustment | business-strategy-report, stakeholder-analysis | Output file version number + change summary |
| Unit economics metric change | business-strategy-report | Output file version number + change summary |
| Competitor pricing matrix update | positioning-strategy | Output file version number + change summary |

---

## Human Review Checklist

Before submitting for human approval, ensure the following has been presented:

### Competitor Analysis
- [ ] Major competitor pricing covered
- [ ] Price range distribution clear
- [ ] Market gaps identified

### Willingness to Pay
- [ ] Inference methods explained
- [ ] Confidence levels labeled
- [ ] Segment differences analyzed

### Pricing Options
- [ ] 3 options have clear differentiated positioning
- [ ] Unit economics metrics calculated
- [ ] Risks labeled
- [ ] Pros and cons comparison clear

### Recommendation
- [ ] Recommended option has clear rationale
- [ ] Alternative option provided
- [ ] Decision-required information complete

## Data Flow Specification

### Input Directory
```
input/
├── bmc/
│   └── business_model_canvas.json
├── competitor/
│   └── competitor_pricing.json
└── research/
    └── willingness_to_pay.json
```

### Output Directory
```
output/pm-strategy/
└── business-pricing/
    └── pricing_analysis.json
```
