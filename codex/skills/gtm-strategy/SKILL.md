---
name: gtm-strategy
description: "Use when developing a product go-to-market strategy. Auto-generates Go-to-Market strategy document including target market definition, launch path selection, pricing and packaging strategy, channel and promotion plan, launch milestones and success metrics. Keywords: Go-to-Market, GTM strategy, launch strategy, product launch, market entry, release strategy, product rollout."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Growth Model"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "New product launching, how to promote it"
    - "Help me create a launch plan"
    - "How to develop a product release strategy"
---

# Go-to-Market Strategy Document Generation

## Core Principles

**GTM is the product's first formal date with the market**

The core of a Go-to-Market strategy is not "how to push the product out" but "how to let the right users discover product value in the right scenario." A good GTM strategy is the precise match between product value proposition and market demand.

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Product Positioning | markdown | Yes | positioning-strategy | Positioning statement, differentiation advantages |
| Differentiation Strategy | markdown | No | positioning-strategy | Competitive differentiation positioning |
| Business Model | markdown | No | business-model-canvas | Value proposition, customer segments, revenue streams |
| Pricing Plan | markdown | No | business-pricing | Pricing model, price tiers |
| Growth Model | markdown | No | growth-model | Growth model diagnosis, acquisition strategy |
| Product Info | text | Yes | User input | Product features, target users, launch timeline |

## Execution Steps

### Step 1: Target Market Definition

Precisely define the target market for launch:

1. **Ideal Customer Profile (ICP)**: Industry, size, role, pain points, purchasing power
2. **Market entry sequence**: Lighthouse customers -> Early adopters -> Early majority entry path
3. **TAM/SAM/SOM**: Market size estimation, focus on reachable SOM
4. **Market timing**: Why now? Market trends, policy windows, competitive gaps

### Step 2: Launch Path Selection

Select launch path based on product type and target market:

1. **Launch mode assessment**:
   - [LAUNCH] Big bang launch (suitable for consumer products)
   - [TARGET] Invite-only launch (suitable for enterprise products)
   - [REFRESH] Progressive rollout (suitable for platform products)
   - [BEACH] Soft launch (suitable for products needing market validation)
2. **Path recommendation**: Recommend optimal path based on product characteristics with rationale
3. **Phase breakdown**: Pre-launch -> Launch -> Growth phase objectives

### Step 3: Pricing and Packaging Strategy

Determine how the product is packaged and priced:

1. **Product packaging**: Free / Pro / Enterprise tier feature boundaries
2. **Pricing model**: Subscription / Usage-based / One-time purchase / Hybrid model
3. **Launch pricing**: Introductory price, early bird discount, annual payment discount and other promotional strategies
4. **Value anchoring**: Compare with competitor pricing, highlight cost-effectiveness advantages

### Step 4: Channel and Promotion Plan

Design a full-funnel channel strategy from reach to conversion:

1. **Owned channels**: Website, blog, community, email, in-product guidance
2. **Paid channels**: Search ads, social ads, content marketing, KOL partnerships
3. **Ecosystem channels**: Partners, app marketplaces, integration platforms, distributors
4. **Channel budget allocation**: Budget share and expected ROI for each channel
5. **Content calendar**: 4-week content publishing plan before and after launch

### Step 5: Launch Milestones and Success Metrics

Define criteria for launch success:

1. **Launch milestones**: Key timeline nodes and deliverables
2. **Success metrics**:
   - Launch week 1: Registrations, activation rate, NPS
   - Launch month 1: Retention rate, paid conversion rate, CAC
   - Launch quarter 1: LTV, LTV/CAC, market share
3. **Early warning indicators**: Adjustment mechanisms triggered when below expectations
4. **Go/No-Go checklist**: Final check items before launch

### Step 6: Report Assembly

Assemble the above content into a complete GTM strategy document.

## Output

### Output Files

| File | Path | Description |
|------|------|------|
| GTM Strategy Document | `output/pm-growth/gtm-strategy/gtm-strategy.md` | Human-readable complete strategy document |
| Structured Data | `output/pm-growth/gtm-strategy/gtm-strategy.json` | Machine-consumable structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["product_name", "target_market", "launch_path", "success_metrics"],
  "properties": {
    "product_name": {"type": "string", "description": "Product name"},
    "report_date": {"type": "string", "description": "Report date"},
    "target_market": {"type": "object", "description": "Target market definition, including ICP, entry sequence, and market size"},
    "launch_path": {"type": "object", "description": "Launch path, including mode, rationale, and phases"},
    "pricing_packaging": {"type": "object", "description": "Pricing and packaging strategy, including tiers, model, and promotions"},
    "channels": {"type": "object", "description": "Channel and promotion plan, including owned/paid/ecosystem channels"},
    "success_metrics": {"type": "object", "description": "Success metrics and milestones, including week 1/month 1/quarter 1 metrics"},
    "risks": {"type": "array", "description": "Risk list"}
  }
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| product_name | string | Yes | Product name, cannot be empty |
| target_market | object | Yes | Target market, must contain icp/market_size |
| target_market.icp | object | Yes | ICP profile, at least industry/size/role 3 dimensions |
| launch_path | object | Yes | Launch path, must contain mode/rationale/phases |
| launch_path.mode | string | Yes | Launch mode, only big_bang/invite_only/progressive/soft_launch allowed |
| success_metrics | object | Yes | Success metrics, must contain week_1/month_1/quarter_1 |
| channels | object | No | Channel plan, must contain owned/paid/ecosystem |
| risks | array | No | Risk list |

## Quality Checks

| Check Item | Standard | Failed Action |
|--------|------|------------|
| ICP profile specific | At least includes industry, size, role 3 dimensions | Supplement ICP details |
| Launch path justified | Path selection based on product type and target market characteristics | Supplement selection rationale |
| Channel budget executable | Each channel has budget share and expected ROI | Supplement budget details |
| Success metrics quantifiable | Week 1/month 1/quarter 1 metrics all have specific values | Set target values or mark "to be confirmed" |

## Decision Rules

- When product is enterprise-grade B2B, default to invite-only launch path
- When product is consumer-grade B2C, default to big bang launch or progressive rollout
- When pricing plan is not determined, generate framework for pricing chapter in GTM strategy, specific prices marked "pending pricing analysis"
- Decision points requiring human confirmation: launch path selection, pricing tier definition, channel budget allocation, Go/No-Go decision

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| No product positioning | Infer positioning from user-provided product info, mark "positioning to be confirmed" | Product positioning is inferred conclusion, needs subsequent validation |
| No business model | Focus on acquisition and channel strategy, business model section marked "to be supplemented" | Pricing and packaging strategy lacks business model support |
| No pricing plan | Generate pricing strategy framework, specific prices marked "pending pricing analysis" | Pricing recommendations are framework-level, no specific prices |
| No growth model | Default to PLG model, mark "growth model to be diagnosed" | Launch path and channel strategy based on PLG assumption |
- If user has not provided product info, prompt user to provide or skip steps related to that input

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| positioning-strategy | Positioning change | Target market definition and differentiation strategy | Redefine ICP and market entry sequence |
| business-pricing | Pricing change | Pricing and packaging strategy | Update pricing tiers and promotional strategies |
| growth-model | Growth model change | Channel strategy and launch path | Adjust channel budget allocation and launch mode |
| User provided - product info | Launch timeline change | Launch milestones and content calendar | Adjust phase breakdown and timeline |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| growth-orchestrator | GTM strategy generation complete | Output file update | GTM strategy completion status and key conclusions |
| product-operations-manual | GTM strategy change | Write to output file | Launch milestones and channel plan |
