---
name: product-operations-manual
description: Use when you need to consolidate operations strategies and processes into a complete, deliverable product operations manual. Product operations manual auto-generation, including daily operations SOP, content operations standards, user operations strategies, campaign operations templates, and emergency response procedures. Keywords: operations manual, operations SOP, content operations, user operations, campaign operations, emergency response, operations process, daily operations, operations standards.
metadata:
  module: "Product Growth & Operations"
  sub-module: "Growth Model"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "How to write an operations manual"
    - "How to standardize daily operations processes"
    - "Help me organize operations SOPs"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output operations SOP and emergency response procedures"
  deep_description: "Complete manual + operations strategy deep analysis + scenario-based SOP + operations metrics system design"
---

# Product Operations Manual Generation

## Core Principles

**An operations manual is the team's muscle memory, not a document gathering dust on a shelf**

The core value of a product operations manual lies in enabling the team to correctly execute daily operations even without guidance. The manual is not a document that ends once written, but a living document that is continuously updated — the minimum consensus for team collaboration.

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Growth model | markdown | No | growth-model | Growth model, flywheel model, bottleneck stage |
| Activation strategy | markdown | No | activation-onboarding | Onboarding flow, activation strategy |
| Retention strategy | markdown | No | retention-management | Segmented operations, engagement strategies |
| Monetization strategy | markdown | No | revenue-funnel | Payment funnel, pricing strategy |
| Product information | text | Yes | User input | Product features, operations objectives, team structure |

## Execution Steps

### Step 1: Daily Operations SOP [Core]

Define standard operating procedures for daily product operations:

1. **Daily operations checklist**:
   - Core metrics dashboard check (DAU/Revenue/Conversion rate)
   - Anomaly alert confirmation and handling
   - User feedback channel review
   - Content publishing schedule confirmation
2. **Weekly operations rhythm**:
   - Monday: Last week's data review + This week's goal setting
   - Wednesday: Mid-week check + Strategy fine-tuning
   - Friday: Weekly report output + Next week's scheduling
3. **Monthly operations rhythm**:
   - Monthly OKR review and calibration
   - Operations campaign effectiveness evaluation
   - Next month's operations plan development

### Step 2: Content Operations Standards [Conditional]

Define standards and processes for content operations:

1. **Content type matrix**: Product updates, user stories, industry insights, tutorial guides, campaign announcements
2. **Content production process**: Topic selection→Writing→Review→Publishing→Promotion→Retrospective
3. **Content quality standards**: Title conventions, word count range, image requirements, SEO optimization
4. **Content distribution channels**: Website, official account, community, email, push notifications, social media
5. **Content calendar template**: Weekly/monthly content scheduling template

### Step 3: User Operations Strategy [Core]

Define segmented user operations strategies and execution methods:

1. **User segmentation model**: User segmentation based on RFM or lifecycle
2. **Segmented operations strategies**:
   - New users: Onboarding guidance + First value experience
   - Active users: Deep usage + Community participation
   - Silent users: Recall strategy + Value rediscovery
   - Churned users: Churn prediction + Win-back plan
3. **Outreach strategy**: Push, email, SMS, in-app messaging frequency and content standards
4. **User feedback handling**: Feedback collection→Classification→Response→Closure SLA

### Step 4: Campaign Operations Templates [Conditional]

Define standard templates and processes for campaign operations:

1. **Campaign types**: User acquisition campaigns, engagement campaigns, payment conversion, brand awareness
2. **Campaign planning template**: Objective→Audience→Mechanics→Budget→Schedule→Risks
3. **Campaign execution checklist**: Pre-launch/During/Post-launch check items
4. **Campaign retrospective template**: Data review→Effectiveness evaluation→Lessons learned→Improvement recommendations
5. **Campaign budget template**: Expense details, ROI estimates, approval process

### Step 5: Emergency Response Procedures [Core]

Define emergency response procedures for operations anomalies:

1. **Severity classification**: P0 (Service unavailable) → P1 (Core functionality impaired) → P2 (Experience degradation) → P3 (Minor impact)
2. **Response SLA**: P0 5-minute response, P1 15-minute response, P2 1-hour response, P3 4-hour response
3. **Escalation path**: Operations→Product→Engineering→Management escalation conditions
4. **Emergency communication templates**: User announcements, internal notifications, post-incident summaries
5. **Common emergency scenarios**: Server failure, data anomalies, negative public sentiment, security incidents

### Step 6: Report Assembly [Core]

Assemble the above content into a complete operations manual.

## Output

**Storage Path**: `output/pm-growth/product-operations-manual/`

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Operations SOP + Emergency response procedures | Core conclusions + minimum viable deliverables, only output Step 1 and Step 5 |
| standard | Complete operations manual (current default) | Complete deliverables, including Step 1-6 all outputs |
| deep | Complete manual + extended analysis | Complete deliverables + operations strategy deep analysis + scenario-based SOP + operations metrics system design |

### Output Files

| File | Path | Description |
|------|------|------|
| Product operations manual | `output/pm-growth/product-operations-manual/product-operations-manual.md` | Human-readable complete manual |
| Structured data | `output/pm-growth/product-operations-manual/product-operations-manual.json` | Machine-consumable structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["product_name", "daily_sop", "user_operations", "emergency_response"],
  "properties": {
    "product_name": {"type": "string", "description": "Product name"},
    "report_date": {"type": "string", "description": "Report date"},
    "daily_sop": {"type": "object", "description": "Daily operations SOP, including daily/weekly/monthly checklists"},
    "content_operations": {"type": "object", "description": "Content operations standards, including type matrix, production process and quality standards"},
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
| daily_sop | object | Yes | Daily operations SOP, must include daily_checklist/weekly_rhythm/monthly_rhythm |
| daily_sop.daily_checklist | array | Yes | Daily checklist, at least 3 items |
| daily_sop.weekly_rhythm | array | No | Weekly rhythm check items |
| daily_sop.weekly_rhythm[].task | string | Yes | Task description |
| daily_sop.weekly_rhythm[].day | string | No | Execution day |
| daily_sop.monthly_rhythm | array | No | Monthly rhythm check items |
| daily_sop.monthly_rhythm[].task | string | Yes | Task description |
| daily_sop.monthly_rhythm[].deadline | string | No | Deadline |
| user_operations | object | Yes | User operations strategy, must include segmentation_model/segment_strategies |
| user_operations.segmentation_model | object | Yes | Segmentation model |
| user_operations.segmentation_model.dimensions | string[] | No | Segmentation dimensions |
| user_operations.segmentation_model.method | string | No | Segmentation method |
| user_operations.segment_strategies | array | Yes | Segment strategies, must cover at least 4 types: new/active/silent/churned |
| user_operations.segment_strategies[].segment | string | Yes | Segment name |
| user_operations.segment_strategies[].strategy | string | Yes | Strategy description |
| emergency_response | object | Yes | Emergency response, must include severity_levels/response_sla |
| emergency_response.severity_levels | array | Yes | Severity classification, must cover at least P0-P3 |
| emergency_response.response_sla | object | Yes | Response SLA |
| emergency_response.response_sla.P0 | string | No | P0 response time |
| emergency_response.response_sla.P1 | string | No | P1 response time |
| emergency_response.response_sla.P2 | string | No | P2 response time |
| emergency_response.response_sla.P3 | string | No | P3 response time |
| content_operations | object | No | Content operations standards |
| activity_operations | object | No | Campaign operations templates |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] SOP is executable (each SOP item has specific actions and time nodes)
- [ ] Emergency procedures are actionable (P0-P3 all have response SLA and escalation paths)

### P1 Checks (must pass for standard/deep)

- [ ] Segmentation strategy is complete (covers at least 4 user types: new/active/silent/churned)
- [ ] Templates are ready to use (campaign templates have placeholders and fill-in instructions)

### P2 Checks (only deep must pass)

- [ ] Operations strategy deep analysis complete (each strategy has ROI assessment and effectiveness prediction)
- [ ] Scenario-based SOP generated (key scenarios have detailed operation steps and decision trees)
- [ ] Operations metrics system designed (core operations metrics have definitions, collection plans and alert thresholds)

## Decision Rules

- When the growth model is PLG, user operations strategy focuses on self-service activation and viral spread
- When the growth model is SLG, operations SOP focuses on sales support and customer success
- When an emergency event is P0 level, automatically trigger escalation path to engineering team
- Decision points requiring human confirmation: operations rhythm setting, user segmentation criteria, outreach frequency limits, emergency escalation thresholds

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|------------|
| No growth model | Manual focuses on general operations SOP, growth strategy section annotated "pending growth model diagnosis" | Operations SOP lacks growth model orientation | Request user to provide product growth method (PLG/SLG/hybrid) and core growth metrics |
| No activation strategy | New user operations strategy uses generic Onboarding template, annotated "pending activation strategy customization" | New user onboarding SOP is a generic template, lacks product specificity | Request user to provide new user onboarding flow and first value experience path |
| No retention strategy | User segmentation uses generic RFM model, outreach strategy uses industry default frequency, annotated "pending retention strategy customization" | Segmented operations strategy based on generic assumptions, outreach frequency may not match | Request user to provide user segmentation criteria and engagement strategies |
| No monetization strategy | Payment conversion operations SOP uses generic funnel template, annotated "pending monetization strategy customization" | Payment operations process is a generic template, lacks pricing and funnel data support | Request user to provide payment funnel data and pricing plan |
| No stage-specific strategies | Manual provides standard templates and best practices, annotated "pending strategy customization" | Operations strategies are generic templates, not customized | Request user to provide core strategy summaries for each stage or execute prerequisite skills |
| No product information | Cannot generate, require user to provide basic information | No output | Request user to provide product features, operations objectives and team structure |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| growth-model | Growth model change | Operations SOP and user operations strategy | Adjust operations rhythm and segmentation strategy |
| activation-onboarding | Onboarding flow change | New user operations strategy | Update new user onboarding SOP |
| retention-management | Segmentation strategy change | User operations strategy | Update segmentation model and outreach strategy |
| revenue-funnel | Payment funnel change | Monetization operations strategy | Update payment conversion operations SOP |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| growth-orchestrator | Operations manual generation complete | Output file update | Manual completion status and key conclusions |
| User provided | Operations manual generation complete | Output file | Complete product operations manual |
