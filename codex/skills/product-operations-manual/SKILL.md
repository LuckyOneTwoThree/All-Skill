---
name: product-operations-manual
description: "Use when consolidating operations strategies and processes into a deliverable product operations manual. Auto-generates product operations manual including daily operations SOP, content operations standards, user operations strategy, campaign operations templates, and emergency response procedures. Keywords: operations manual, operations SOP, content operations, user operations, campaign operations, emergency response, operations process, daily operations."
metadata:
  module: "Product Growth & Operations"
  sub-module: "Growth Model"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How to write an operations manual"
    - "How to standardize daily operations processes"
    - "Help me organize operations SOP"
---

# Product Operations Manual Generation

## Core Principles

**The operations manual is the team's muscle memory, not a document gathering dust**

The core value of a product operations manual is enabling the team to execute daily operations correctly without guidance. The manual is not a document that ends when written, but a living document that is continuously updated, representing the minimum consensus for team collaboration.

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Growth Model | markdown | No | growth-model | Growth model, flywheel model, bottleneck stage |
| Activation Strategy | markdown | No | activation-onboarding | Onboarding flow, activation strategy |
| Retention Strategy | markdown | No | retention-management | Segmented operations, engagement strategy |
| Revenue Strategy | markdown | No | revenue-funnel | Payment funnel, pricing strategy |
| Product Info | text | Yes | User input | Product features, operations goals, team structure |

## Execution Steps

### Step 1: Daily Operations SOP

Define standard operating procedures for daily product operations:

1. **Daily operations checklist**:
   - Core metrics dashboard check (DAU/revenue/conversion rate)
   - Anomaly alert confirmation and handling
   - User feedback channel patrol
   - Content publishing schedule confirmation
2. **Weekly operations rhythm**:
   - Monday: Last week data review + this week goal setting
   - Wednesday: Mid-week check + strategy fine-tuning
   - Friday: Weekly report output + next week scheduling
3. **Monthly operations rhythm**:
   - Monthly OKR review and calibration
   - Operations campaign effectiveness evaluation
   - Next month operations plan development

### Step 2: Content Operations Standards

Define standards and processes for content operations:

1. **Content type matrix**: Product updates, user stories, industry insights, tutorial guides, campaign announcements
2. **Content production process**: Topic selection -> Writing -> Review -> Publishing -> Promotion -> Retrospective
3. **Content quality standards**: Title conventions, word count range, image requirements, SEO optimization
4. **Content distribution channels**: Website, official account, community, email, push, social media
5. **Content calendar template**: Weekly/monthly content scheduling template

### Step 3: User Operations Strategy

Define segmented user operations strategies and execution methods:

1. **User segmentation model**: User segmentation based on RFM or lifecycle
2. **Segmented operations strategy**:
   - New users: Onboarding guidance + first value experience
   - Active users: Deep usage + community participation
   - Silent users: Recall strategy + value rediscovery
   - Churned users: Churn prediction + retention plan
3. **Outreach strategy**: Push, email, SMS, in-app message frequency and content standards
4. **User feedback handling**: Feedback collection -> Classification -> Response -> Closure SLA

### Step 4: Campaign Operations Templates

Define standard templates and processes for campaign operations:

1. **Campaign types**: User acquisition campaigns, engagement campaigns, payment conversion, brand communication
2. **Campaign planning template**: Objective -> Audience -> Mechanics -> Budget -> Schedule -> Risks
3. **Campaign execution checklist**: Pre-launch/during/post-launch check items
4. **Campaign retrospective template**: Data review -> Effectiveness evaluation -> Lessons learned -> Improvement recommendations
5. **Campaign budget template**: Expense details, ROI estimates, approval process

### Step 5: Emergency Response Procedures

Define emergency response procedures for operations anomalies:

1. **Severity classification**: P0 (Service unavailable) -> P1 (Core feature impaired) -> P2 (Experience degraded) -> P3 (Minor impact)
2. **Response SLA**: P0 5-minute response, P1 15-minute response, P2 1-hour response, P3 4-hour response
3. **Escalation path**: Operations -> Product -> Engineering -> Management escalation conditions
4. **Emergency communication templates**: User announcement, internal notification, post-incident summary
5. **Common emergency scenarios**: Server failure, data anomaly, negative PR, security incident

### Step 6: Report Assembly

Assemble the above content into a complete operations manual.

## Output

### Output Files

| File | Path | Description |
|------|------|------|
| Product Operations Manual | `output/pm-growth/product-operations-manual/product-operations-manual.md` | Human-readable complete manual |
| Structured Data | `output/pm-growth/product-operations-manual/product-operations-manual.json` | Machine-consumable structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["product_name", "daily_sop", "user_operations", "emergency_response"],
  "properties": {
    "product_name": {"type": "string", "description": "Product name"},
    "report_date": {"type": "string", "description": "Report date"},
    "daily_sop": {"type": "object", "description": "Daily operations SOP, including daily/weekly/monthly checklists"},
    "content_operations": {"type": "object", "description": "Content operations standards, including type matrix, production process, and quality standards"},
    "user_operations": {"type": "object", "description": "User operations strategy, including segmentation model and outreach strategy"},
    "activity_operations": {"type": "object", "description": "Campaign operations templates, including planning and retrospective templates"},
    "emergency_response": {"type": "object", "description": "Emergency response procedures, including severity levels and SLA"}
  }
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| product_name | string | Yes | Product name, cannot be empty |
| daily_sop | object | Yes | Daily operations SOP, must contain daily_checklist/weekly_rhythm/monthly_rhythm |
| daily_sop.daily_checklist | array | Yes | Daily checklist, at least 3 items |
| user_operations | object | Yes | User operations strategy, must contain segmentation_model/segment_strategies |
| user_operations.segment_strategies | array | Yes | Segmented strategies, at least covering new/active/silent/churned 4 types |
| emergency_response | object | Yes | Emergency response, must contain severity_levels/response_sla |
| emergency_response.severity_levels | array | Yes | Severity levels, at least covering P0-P3 |
| content_operations | object | No | Content operations standards |
| activity_operations | object | No | Campaign operations templates |

## Quality Checks

| Check Item | Standard | Failed Action |
|--------|------|------------|
| SOP executable | Each SOP has specific actions and timelines | Supplement execution details |
| Segmentation strategy complete | At least covering new/active/silent/churned 4 user types | Supplement missing segments |
| Emergency procedures actionable | P0-P3 all have response SLA and escalation paths | Supplement missing levels |
| Templates ready to use | Campaign templates have placeholders and fill-in instructions | Supplement template details |

## Decision Rules

- When growth model is PLG, user operations strategy focuses on self-service activation and viral spread
- When growth model is SLG, operations SOP focuses on sales support and customer success
- When emergency incident is P0 level, automatically trigger escalation path to engineering team
- Decision points requiring human confirmation: operations rhythm setting, user segmentation criteria, outreach frequency limits, emergency escalation thresholds

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| No growth model | Manual focuses on general operations SOP, growth strategy section marked "pending growth model diagnosis" | Operations SOP lacks growth model orientation |
| No stage strategies | Manual provides standard templates and best practices, marked "pending strategy customization" | Operations strategies are generic templates, not customized |
| No product info | Cannot generate, require user to provide basic information | No output |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| growth-model | Growth model change | Operations SOP and user operations strategy | Adjust operations rhythm and segmentation strategy |
| activation-onboarding | Onboarding flow change | New user operations strategy | Update new user guidance SOP |
| retention-management | Segmentation strategy change | User operations strategy | Update segmentation model and outreach strategy |
| revenue-funnel | Payment funnel change | Revenue operations strategy | Update payment conversion operations SOP |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| growth-orchestrator | Operations manual generation complete | Output file update | Manual completion status and key conclusions |
| User | Operations manual generation complete | Output file | Complete product operations manual |
