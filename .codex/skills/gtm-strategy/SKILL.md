---
name: gtm-strategy
description: Use when you need to develop a product go-to-market strategy. Go-to-Market strategy document auto-generation, including target market definition, launch path selection, pricing and packaging strategy, channel and promotion plan, launch milestones and success metrics. Keywords: Go-to-Market, GTM strategy, launch strategy, product launch, market entry, release strategy, product rollout, how to bring to market, launch plan.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Growth Model"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "New product is launching, how to promote it"
    - "Help me create a launch plan"
    - "How to develop a product release strategy"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output target market definition and launch path"
  deep_description: "Complete GTM strategy + channel ROI simulation + launch risk contingency plan + competitive response strategy"
---

# Go-to-Market Strategy Document Generation

## Core Principles

**GTM is the product's first formal date with the market**

The core of a Go-to-Market strategy is not "how to push the product out" but "how to let the right users discover the product's value in the right scenario." A good GTM strategy is a precise match between the product's value proposition and market demand.

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Product positioning | markdown | Yes | positioning-strategy | Positioning statement, differentiation advantages |
| Differentiation strategy | markdown | No | positioning-strategy | Competitive differentiation positioning |
| Business model | markdown | No | business-model-canvas | Value proposition, customer segments, revenue streams |
| Pricing plan | markdown | No | business-pricing | Pricing model, price tiers |
| Growth model | markdown | No | growth-model | Growth model diagnostics, acquisition strategy |
| Product information | text | Yes | User input | Product features, target users, launch timeline |

## Execution Steps

### Step 1: Target Market Definition [Core]

Precisely define the go-to-market target:

1. **Ideal Customer Profile (ICP)**: Industry, size, role, pain points, purchasing power
2. **Market entry sequence**: Lighthouse customers → Early adopters → Early majority entry path
3. **TAM/SAM/SOM**: Market size estimation, focusing on reachable SOM
4. **Market timing**: Why now? Market trends, policy windows, competitive gaps

### Step 2: Launch Path Selection [Core]

Select launch path based on product type and target market:

1. **Launch mode evaluation**:
   - 🚀 Big bang launch (suitable for B2C consumer products)
   - 🎯 Invite-only (suitable for B2B enterprise products)
   - 🔄 Progressive rollout (suitable for platform products)
   - 🏖️ Soft launch (suitable for products needing market validation)
2. **Path recommendation**: Recommend optimal path based on product characteristics with rationale
3. **Phase breakdown**: Pre-launch → Launch → Growth phase objectives

### Step 3: Pricing and Packaging Strategy [Conditional]

Determine how the product is packaged and priced:

1. **Product packaging**: Free / Pro / Enterprise tier feature boundaries
2. **Pricing model**: Subscription / Usage-based / One-time purchase / Hybrid model
3. **Launch pricing**: Launch price, early bird pricing, annual payment discounts and other promotional strategies
4. **Value anchoring**: Comparison with competitor pricing, highlighting cost-effectiveness advantages

### Step 4: Channel and Promotion Plan [Conditional]

Design a full-funnel channel strategy from reach to conversion:

1. **Owned channels**: Website, blog, community, email, in-product guidance
2. **Paid channels**: Search ads, social ads, content marketing, KOL partnerships
3. **Ecosystem channels**: Partners, app marketplaces, integration platforms, distributors
4. **Channel budget allocation**: Budget percentage and expected ROI for each channel
5. **Content calendar**: 4-week content publishing plan pre- and post-launch

### Step 5: Launch Milestones and Success Metrics [Core]

Define measures of launch success:

1. **Launch milestones**: Key timeline nodes and deliverables
2. **Success metrics**:
   - Launch week 1: Registrations, activation rate, NPS
   - Launch month 1: Retention rate, payment conversion rate, CAC
   - Launch quarter 1: LTV, LTV/CAC, market share
3. **Early warning indicators**: Adjustment mechanisms triggered when below expectations
4. **Go/No-Go checklist**: Final pre-launch check items

### Step 6: Report Assembly [Core]

Assemble the above content into a complete GTM strategy document.

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Target market definition and launch path | Core conclusions + minimum viable deliverables |
| standard | Complete deliverables (current default) | Complete deliverables, including all Step outputs |
| deep | Complete GTM strategy + channel ROI simulation + launch risk contingency plan + competitive response strategy | Complete deliverables + extended analysis + deep projection |

## Output

### Output Files

| File | Path | Description |
|------|------|------|
| GTM strategy document | `output/pm-growth/gtm-strategy/gtm-strategy.md` | Human-readable complete strategy document |
| Structured data | `output/pm-growth/gtm-strategy/gtm-strategy.json` | Machine-consumable structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["product_name", "target_market", "launch_path", "success_metrics"],
  "properties": {
    "product_name": {"type": "string", "description": "Product name"},
    "report_date": {"type": "string", "description": "Report date"},
    "target_market": {"type": "object", "description": "Target market definition, including ICP, entry sequence and market size"},
    "launch_path": {"type": "object", "description": "Launch path, including mode, rationale and phases"},
    "pricing_packaging": {"type": "object", "description": "Pricing and packaging strategy, including tiers, model and promotions"},
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
| target_market | object | Yes | Target market, must include icp/market_size |
| target_market.icp | object | Yes | ICP profile, must include at least 3 dimensions: industry/size/role |
| target_market.icp.industry | string | Yes | Target industry, cannot be empty |
| target_market.icp.company_size | string | Yes | Company size, cannot be empty |
| target_market.icp.target_role | string | Yes | Target role, cannot be empty |
| target_market.icp.pain_points | string[] | No | ICP core pain points |
| target_market.market_size | object | Yes | Market size |
| target_market.market_size.tam | string | No | Total addressable market |
| target_market.market_size.sam | string | No | Serviceable available market |
| target_market.market_size.som | string | No | Serviceable obtainable market |
| launch_path | object | Yes | Launch path, must include mode/rationale/phases |
| launch_path.mode | string | Yes | Launch mode, only big_bang/invite_only/progressive/soft_launch allowed |
| launch_path.rationale | string | Yes | Mode selection rationale, cannot be empty |
| launch_path.phases | array | Yes | Launch phase list, at least 1 phase |
| launch_path.phases[].phase_name | string | Yes | Phase name, cannot be empty |
| launch_path.phases[].timeline | string | No | Phase timeline |
| launch_path.phases[].key_activities | string[] | No | Key activities list |
| success_metrics | object | Yes | Success metrics, must include week_1/month_1/quarter_1 |
| success_metrics.week_1 | object | Yes | Week 1 metrics |
| success_metrics.week_1.target_users | number | No | Target user count |
| success_metrics.week_1.activation_rate | number | No | Activation rate |
| success_metrics.month_1 | object | Yes | Month 1 metrics |
| success_metrics.month_1.retention_rate | number | No | Retention rate |
| success_metrics.month_1.revenue | number | No | Revenue target |
| success_metrics.quarter_1 | object | Yes | Quarter 1 metrics |
| success_metrics.quarter_1.market_share | string | No | Market share target |
| success_metrics.quarter_1.nps | number | No | NPS target |
| channels | object | No | Channel plan, must include owned/paid/ecosystem |
| channels.owned | array | No | Owned channels list |
| channels.owned[].channel_name | string | Yes | Channel name |
| channels.owned[].budget_ratio | number | No | Budget percentage |
| channels.paid | array | No | Paid channels list |
| channels.paid[].channel_name | string | Yes | Channel name |
| channels.paid[].budget_ratio | number | No | Budget percentage |
| channels.paid[].expected_roi | number | No | Expected ROI |
| channels.ecosystem | array | No | Ecosystem channels list |
| channels.ecosystem[].channel_name | string | Yes | Channel name |
| channels.ecosystem[].partner_type | string | No | Partnership type |
| risks | array | No | Risk list |
| risks[].risk | string | Yes | Risk description |
| risks[].probability | string | No | Probability, enum: high/medium/low |
| risks[].impact | string | No | Impact level, enum: high/medium/low |
| risks[].mitigation | string | No | Mitigation measures |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] ICP profile is specific (at least 3 dimensions: industry, size, role)
- [ ] Launch path has rationale (path selection based on product type and target market characteristics)

### P1 Checks (must pass for standard/deep)

- [ ] Channel budget is executable (each channel has budget percentage and expected ROI)
- [ ] Success metrics are quantifiable (week 1/month 1/quarter 1 metrics all have specific values)

### P2 Checks (only deep must pass)

- [ ] Extended analysis complete (deep projections and roadmap generated)
- [ ] Decision records complete (key decisions have basis and alternatives)

## Decision Rules

- When the product is B2B enterprise-level, default to invite-only launch path
- When the product is B2C consumer-level, default to big bang launch or progressive rollout
- When the pricing plan is not yet determined, generate a framework for the pricing section in the GTM strategy, with specific prices annotated as "pending pricing analysis"
- Decision points requiring human confirmation: launch path selection, pricing tier definition, channel budget allocation, Go/No-Go decision

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|------------|
| No product positioning | Derive positioning from user-provided product information, annotate "positioning pending confirmation" | Product positioning is an inferred conclusion, needs subsequent validation | Request user to provide product positioning description or upload positioning-strategy output file |
| No business model | Focus on acquisition and channel strategies, annotate business model section as "to be supplemented" | Pricing and packaging strategy lacks business model support | Request user to provide business model description or upload bmc.json file |
| No pricing plan | Generate pricing strategy framework, annotate specific prices as "pending pricing analysis" | Pricing recommendations are framework-level, no specific prices | Request user to provide pricing plan or upload business-pricing output file |
| No growth model | Default to PLG model, annotate "growth model pending diagnosis" | Launch path and channel strategy based on PLG assumption | Request user to provide growth model description or upload growth-model output file |
| Product information missing | Prompt user to provide product information, otherwise cannot determine launch strategy | Launch strategy lacks product foundation | Request user to provide product name, core features and target user description |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| positioning-strategy | Positioning change | Target market definition and differentiation strategy | Redefine ICP and market entry sequence |
| business-pricing | Pricing change | Pricing and packaging strategy | Update pricing tiers and promotional strategies |
| growth-model | Growth model change | Channel strategy and launch path | Adjust channel budget allocation and launch mode |
| User provided - Product information | Launch timeline change | Launch milestones and content calendar | Adjust phase breakdown and timeline |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| growth-orchestrator | GTM strategy generation complete | Output file update | GTM strategy completion status and key conclusions |
| product-operations-manual | GTM strategy change | Write to output file | Launch milestones and channel plan |
