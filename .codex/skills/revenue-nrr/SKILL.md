---
name: revenue-nrr
description: Use when you need to track Net Revenue Retention rate. NRR Auto-Tracking & Alerting Pipeline, automatically calculates net revenue retention rate, analyzes NRR trends, identifies churn warnings, and identifies expansion revenue opportunities. Keywords: NRR, net revenue retention, revenue retention, churn warning, expansion revenue, renewal rate, existing customer revenue, is revenue growing or shrinking.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Monetization"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "Enterprise Services", "General"]
  trigger_examples:
    - "How to calculate net revenue retention rate"
    - "How is existing customer renewal going"
    - "How to read revenue retention trends"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output NRR analysis and retention strategy"
  deep_description: "Complete analysis + customer health score + churn prediction model + upsell opportunity identification"
---

# NRR Auto-Tracking & Alerting

## Core Principles

1. **NRR is the revenue health thermometer**: NRR >100% means the product is self-growing, NRR <100% means the product is self-consuming
2. **Expansion and churn are equally important**: Improving NRR requires both reducing churn and proactively identifying expansion opportunities
3. **Signal-driven, not cycle-driven**: Trigger actions based on risk signals and expansion signals, rather than waiting for monthly reports

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Revenue data | object | Yes | User provided | MRR, ARR, revenue details |
| User account data | object | Yes | User provided | Payment status, product configuration |
| User behavior data | object | ○ | User provided | Usage data, interaction data |

## NRR Definition & Calculation

### NRR (Net Revenue Retention Rate)
NRR is the most important metric for measuring revenue health, reflecting the change in revenue contribution from existing customers within the reporting period.

```
NRR = (Starting revenue - Churned revenue + Expansion revenue) / Starting revenue

Where:
- Starting revenue: MRR at period start
- Churned revenue: Revenue lost due to churn
- Expansion revenue: Revenue from upsells and price increases
```

### NRR Interpretation
| NRR Range | Meaning | Rating |
|--------|------|------|
| NRR ≥ 120% | Excellent | Extremely strong revenue retention and expansion capability |
| NRR ≥ 110% | Good | Healthy growth, sustainable |
| NRR ≥ 100% | Passing | Barely retaining, needs improvement |
| NRR < 100% | Dangerous | Revenue is continuously churning |

## Execution Steps

### Step 1: NRR Auto-Calculation [Core]

#### Revenue Data Processing
1. Calculate starting revenue: Beginning of month MRR
2. Calculate ending revenue: End of month MRR
3. Identify revenue change details:
   - New revenue (new paying customers)
   - Expansion revenue (upsells, upgrades, price increases)
   - Contraction revenue (downgrades, reduced usage)
   - Churned revenue (churn, cancellations)

#### NRR Formula Implementation
```python
nrr = (start_mrr - churned_mrr + expansion_mrr) / start_mrr
```

#### Multi-Dimensional Calculation
- Calculate NRR by user segment
- Calculate NRR by product line
- Calculate NRR by user size
- Calculate NRR by industry

### Step 2: NRR Trend Analysis [Core]

#### Trend Metrics
| Metric | Description |
|------|------|
| Monthly NRR | NRR per month |
| Quarterly NRR | NRR per quarter |
| Annual rolling NRR | 12-month rolling NRR |
| NRR acceleration | NRR change trend |

#### Trend Analysis
- NRR month-over-month change
- NRR year-over-year change
- NRR decomposition analysis (expansion/contraction/churn proportion changes)

#### Forecast Analysis
Based on historical trends, predict future NRR:
- Optimistic forecast
- Baseline forecast
- Pessimistic forecast

### Step 3: Churn Warning [Core]

#### Churn Risk Signals
| Signal Type | Specific Signal | Risk Weight |
|---------|---------|---------|
| Activity signal | Usage frequency decline | High |
| Feature signal | Core feature usage decrease | High |
| Financial signal | Payment delay | High |
| Organizational signal | Key contact departure | Medium |
| Feedback signal | Negative feedback / NPS decline | Medium |
| Competitor signal | Signs of using competitor products | Low |

#### Risk User Grading
| Risk Level | Definition | Response Strategy |
|---------|------|---------|
| Very high risk | Multiple churn signals + high value | Immediate intervention |
| High risk | Clear churn signals | Intervene within 3 days |
| Medium risk | Some churn signals | Intervene within 1 week |
| Low risk | Minor churn signals | Continuous monitoring |

#### Churn Warning Triggers
```yaml
warning_rules:
  - condition: "usage_decline > 50% AND payment_delayed == true"
    level: "critical"
    action: "immediate_escalation"

  - condition: "usage_decline > 30%"
    level: "high"
    action: "customer_success_outreach"

  - condition: "nps_score < 6"
    level: "medium"
    action: "feedback_followup"
```

### Step 4: Expansion Opportunity Identification [Core]

#### Expansion Signals
| Signal Type | Specific Signal | Expansion Potential |
|---------|---------|---------|
| Usage signal | Usage reaching limit | High |
| Frequency signal | High-frequency use of core features | High |
| Collaboration signal | Increased use of team collaboration features | Medium |
| Feature signal | Increased use of advanced features | Medium |
| Demand signal | Proactively inquiring about higher-tier plans | High |

#### Expansion Opportunity Scoring
```python
expansion_score = (
    usage_intensity * 0.4 +
    feature_adoption * 0.3 +
    team_growth * 0.2 +
    engagement_score * 0.1
)
```

#### Expansion Strategy Recommendations
| Expansion Type | Trigger Condition | Recommended Strategy |
|---------|---------|---------|
| Upgrade | Usage reaching limit | Upgrade guidance + discount |
| Upsell | Team size growing | Seat upsell recommendation |
| Expansion | New business needs | New product line recommendation |

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | NRR analysis and retention strategy | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output, including all Step outputs |
| deep | Complete analysis + customer health score + churn prediction model + upsell opportunity identification | Complete output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-growth/revenue-nrr/`

**Output File**: nrr_analysis.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["current_nrr", "nrr_breakdown"],
  "properties": {
    "current_nrr": {"type": "number", "description": "Current net revenue retention rate"},
    "nrr_breakdown": {"type": "object", "description": "NRR breakdown, including expansion/contraction/churned revenue proportions"},
    "trend": {"type": "array", "description": "NRR trend data, including monthly NRR and proportion of each component"},
    "churn_warnings": {"type": "array", "description": "Churn warning list, including risk signals and recommended actions"},
    "expansion_opportunities": {"type": "array", "description": "Expansion opportunity list, including upgrade signals and expected revenue growth"},
    "summary": {"type": "object", "description": "Revenue summary, including active revenue, expansion, churn, and net new"}
  }
}
```

`nrr_tracking`
```json
{
  "current_nrr": 1.15,
  "nrr_breakdown": {
    "expansion_revenue_ratio": 0.12,
    "contraction_revenue_ratio": 0.03,
    "churned_revenue_ratio": 0.05
  },
  "trend": [
    {
      "month": "2024-01",
      "nrr": 1.12,
      "expansion": 0.10,
      "contraction": 0.02,
      "churn": 0.06
    }
  ],
  "churn_warnings": [
    {
      "user_id": "EDU-20240156",
      "company_name": "Qihang Education Group",
      "monthly_revenue": 5000,
      "risk_signals": ["Usage decline", "Contact departure"],
      "risk_level": "high",
      "recommended_action": "Customer success proactive outreach"
    }
  ],
  "expansion_opportunities": [
    {
      "user_id": "EDU-20240203",
      "company_name": "Boxue Online Technology",
      "current_plan": "pro",
      "expansion_signals": ["Usage approaching limit", "High-frequency use of core features"],
      "recommended_upgrade": "enterprise",
      "expected_revenue_increase": 3000
    }
  ],
  "summary": {
    "total_active_revenue": 500000,
    "expansion_this_month": 60000,
    "churn_this_month": 25000,
    "net_new_revenue": 35000,
    "at_risk_revenue": 80000,
    "expansion_pipeline": 150000
  }
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| current_nrr | number | Yes | Current NRR, must be >0 |
| nrr_breakdown | object | Yes | NRR breakdown, must include expansion_revenue_ratio/contraction_revenue_ratio/churned_revenue_ratio |
| nrr_breakdown.expansion_revenue_ratio | number | Yes | Expansion revenue proportion, must be ≥0 |
| nrr_breakdown.contraction_revenue_ratio | number | No | Contraction revenue proportion |
| nrr_breakdown.churned_revenue_ratio | number | Yes | Churned revenue proportion, must be ≥0 |
| trend | array | No | NRR trend data, each item must include month/nrr |
| trend[].month | string | Yes | Month identifier |
| trend[].nrr | number | Yes | NRR value |
| trend[].expansion | number | No | Expansion revenue |
| trend[].contraction | number | No | Contraction revenue |
| trend[].churn | number | No | Churned revenue |
| churn_warnings | array | No | Churn warning list, each item must include user_id/risk_signals/risk_level |
| churn_warnings[].user_id | string | Yes | User ID |
| churn_warnings[].company_name | string | No | Company name |
| churn_warnings[].monthly_revenue | number | No | Monthly revenue |
| churn_warnings[].risk_signals | string[] | Yes | Risk signal list |
| churn_warnings[].risk_level | string | Yes | Risk level, enum: high/medium/low |
| churn_warnings[].recommended_action | string | No | Recommended action |
| expansion_opportunities | array | No | Expansion opportunity list, each item must include user_id/expansion_signals/recommended_upgrade |
| expansion_opportunities[].user_id | string | Yes | User ID |
| expansion_opportunities[].company_name | string | No | Company name |
| expansion_opportunities[].current_plan | string | No | Current plan |
| expansion_opportunities[].expansion_signals | string[] | Yes | Expansion signal list |
| expansion_opportunities[].recommended_upgrade | string | Yes | Recommended upgrade plan |
| expansion_opportunities[].expected_revenue_increase | number | No | Expected revenue increase |
| summary | object | No | Revenue summary, must include total_active_revenue |
| summary.total_active_revenue | number | Yes | Total active revenue |
| summary.expansion_this_month | number | No | Expansion revenue this month |
| summary.churn_this_month | number | No | Churned revenue this month |
| summary.net_new_revenue | number | No | Net new revenue |
| summary.at_risk_revenue | number | No | At-risk revenue |
| summary.expansion_pipeline | number | No | Expansion pipeline |

## Decision Rules

| Situation | Handling |
|------|----------|
| NRR<100% | Trigger revenue churn alert, recommend urgent intervention |
| Churn risk signals ≥2 | Customer success intervention within 3 days |
| Expansion score >0.7 | Proactively recommend upgrade or upsell |
| NRR declining for 3 consecutive months | Trigger strategic-level review |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] NRR calculation includes expansion, contraction, and churn components
- [ ] Churn warning covers activity, feature, financial, and organizational signal types

### P1 Checks (must pass for standard/deep)

- [ ] Expansion opportunity identification includes scoring and recommended strategy
- [ ] Multi-dimensional NRR calculation covers user segments and product lines

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Notes |
|----------|----------|----------|------------|
| Revenue data missing | User provides revenue and churn data → Calculate NRR | NRR calculation based on user-provided summary data | Request user to provide beginning-of-month MRR, expansion MRR, contraction MRR, churned MRR |
| Account data missing | Skip account-level NRR analysis, calculate overall NRR only | Unable to identify high churn risk accounts | Request user to provide paying account list, payment status, and product configuration |
| User behavior data missing | Skip behavior-driven churn signal analysis, warn based on revenue and account data only | Churn warnings lack behavioral dimension, warning precision reduced | Request user to provide user activity, feature usage frequency, and interaction data |
| Revenue data + Account data both missing | User provides revenue and churn data → Calculate NRR | Output basic NRR calculation, account-level analysis marked "to be supplemented" | Request user to provide revenue summary data and customer tier distribution |

### Data Acquisition Notes

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Revenue data**: Beginning-of-month MRR, expansion MRR, contraction MRR, churned MRR
- **Churn data** (optional): Churned customer count and churned MRR
- **Customer tiers** (optional): Customer distribution by size or value

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| User provided - Revenue data | MRR口径 change | NRR calculation and trend analysis | Recalculate NRR based on new口径 |
| User provided - Account data | Payment status change | Churn warning and expansion opportunities | Update risk scores and expansion signals |
| User provided - Behavior data | Usage metric change | Churn signals and expansion signals | Update signal weights and trigger rules |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| revenue-upsell | Expansion opportunity change | Write to output file | New expansion opportunities and upgrade recommendations |
| revenue-funnel | NRR data update | Write to output file | NRR trends and payment conversion baseline |
| revenue-orchestrator | NRR tracking complete | Output file update | NRR tracking completion status and key conclusions |

## Key Success Metrics

| Metric | Definition | Target Value |
|------|------|--------|
| NRR | Net Revenue Retention rate | ≥115% |
| Churn rate | Monthly churned MRR / Beginning-of-month MRR | ≤3% |
| Expansion rate | Monthly expansion MRR / Beginning-of-month MRR | ≥10% |
| Contraction rate | Monthly contraction MRR / Beginning-of-month MRR | ≤2% |
| At-risk revenue proportion | High-risk user MRR / Total MRR | ≤10% |
