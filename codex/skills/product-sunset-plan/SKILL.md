---
name: product-sunset-plan
description: Use when you need to create a product or feature sunset plan. Automated product sunset plan generation, including sunset decision assessment, user migration plan, data disposal strategy, timeline, and communication plan. Keywords: product sunset, feature sunset, product retirement, Sunset, sunset plan, user migration, data disposal, feature deprecation, service shutdown.
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Issue Diagnosis"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "How to sunset this feature"
    - "Product is shutting down, how to arrange"
    - "Old feature needs to be retired, what to do"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output sunset plan and risk list"
  deep_description: "Complete sunset plan + user migration plan + data archival strategy + impact assessment report"
---

# Product Sunset Plan Generation

## Core Principles

**Sunset is the final respect for users**

The core value of a product sunset plan is to minimize the impact of product retirement on users. A good sunset is not a sudden disappearance, but an orderly transition. The time and data users have invested deserve to be taken seriously.

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Health diagnosis | markdown | No | diagnosis-health | Product health score, trends |
| Retention data | markdown | No | retention-management | User retention, churn trends |
| Sunset target | text | Yes | User input | Product/feature name and scope to be sunset |
| Sunset reason | text | Yes | User input | Business decision rationale |

### Degradation Strategy

| Missing Input | Degradation Plan |
|----------|----------|
| No health diagnosis | Assess sunset impact based on user-provided information, mark as "pending health diagnosis" |
| No retention data | Estimate affected user count based on user-provided information, mark as "pending retention data verification" |
| No sunset target/reason | Cannot generate; require user to provide basic information |

## Execution Steps

### Step 1: Sunset Decision Assessment [Core]

Assess the rationality and impact of the sunset decision:

1. **Sunset reason verification**:
   - Business metrics consistently declining (revenue/users/activity)
   - Strategic direction shift (no longer aligned with product positioning)
   - Excessive technical cost (maintenance cost > output value)
   - Compliance requirements (regulatory changes)
2. **Alternative evaluation**: Are there alternatives to sunsetting
3. **Impact scope assessment**:
   - Number and percentage of affected users
   - Amount and percentage of affected revenue
   - Affected partners
   - Brand impact assessment

### Step 2: User Migration Plan [Core]

Develop a migration strategy for users from the sunset product to alternatives:

1. **Alternative identification**:
   - Internal replacement product/feature
   - Third-party alternatives
   - No alternative (must be clearly communicated)
2. **Migration path design**:
   - Data export → import process
   - Feature mapping table (old feature → new feature)
   - Migration tools/scripts
3. **Migration incentives**:
   - Migration discounts/offers
   - Dedicated migration support
   - Data migration guarantee commitment
4. **Special user handling**:
   - Enterprise customers: 1-on-1 migration support
   - High-value users: Dedicated migration plan
   - Long-term users: Gratitude rewards

### Step 3: Data Disposal Strategy [Core]

Develop a data disposal plan for user data:

1. **Data classification**:
   - User-generated content (UGC)
   - User configurations/settings
   - Usage history/behavioral data
   - Payment/transaction records
2. **Disposal methods**:
   - Exportable: Provide standard format export tools
   - Migratable: Automatically migrate to replacement product
   - Must retain: Legal retention period and access methods
   - Must delete: Deletion timeline and confirmation mechanism
3. **Data retention periods**:
   - Legal retention (transaction records ≥ 5 years)
   - User-selected retention period
   - Final deletion timeline

### Step 4: Sunset Timeline [Core]

Develop a phased sunset timeline:

1. **Announcement period** (T-90 days):
   - Publish sunset announcement
   - Enable data export
   - Stop new user registration
2. **Transition period** (T-60 days):
   - Stop paid subscription renewals
   - Push migration guidance
   - Provide migration support
3. **Read-only period** (T-30 days):
   - Feature read-only, no new creation/modification
   - Final data export window
   - Dedicated customer support
4. **Sunset day** (T-0):
   - Service stops
   - Data enters retention period
   - Sunset page goes live
5. **Cleanup period** (T+30 days):
   - Data deleted/archived per strategy
   - Final confirmation report

### Step 5: Communication Plan [Core]

Develop a communication plan for all stakeholders:

1. **User communication**:
   - Announcement copy (versions for each channel)
   - FAQ document
   - Migration tutorials
   - Customer service scripts
2. **Internal communication**:
   - Team notification
   - Customer service training
   - Sales script updates
3. **External communication**:
   - Partner notification
   - Media messaging
   - Community announcement

### Step 6: Report Assembly [Core]

Assemble the above content into a complete sunset plan.

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Sunset plan and risk list | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Full output including all Step outputs |
| deep | Complete sunset plan + user migration plan + data archival strategy + impact assessment report | Complete output + extended analysis + deep inference |

## Output

### Output Files

| File | Path | Description |
|------|------|------|
| Product sunset plan | `output/pm-monitoring/product-sunset-plan/product-sunset-plan.md` | Human-readable complete plan |
| Structured data | `output/pm-monitoring/product-sunset-plan/product-sunset-plan.json` | Machine-consumable structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["product_name", "sunset_date", "decision_assessment", "migration_plan"],
  "properties": {
    "product_name": {"type": "string", "description": "Product name"},
    "sunset_date": {"type": "string", "description": "Sunset date"},
    "report_date": {"type": "string", "description": "Report date"},
    "decision_assessment": {"type": "object", "description": "Sunset decision assessment, including reasons, alternatives, and impact"},
    "migration_plan": {"type": "object", "description": "User migration plan, including alternatives, paths, and incentives"},
    "data_disposal": {"type": "object", "description": "Data disposal strategy, including classification, methods, and retention periods"},
    "timeline": {"type": "object", "description": "Sunset timeline, including announcement/transition/read-only/sunset/cleanup"},
    "communication_plan": {"type": "object", "description": "Communication plan, including user/internal/external communication"},
    "risks": {"type": "array", "description": "Risk list"}
  }
}
```

### Markdown Report Structure

```markdown
# Product Sunset Plan: {Product/Feature Name}

## 1. Sunset Decision Assessment
- Sunset reasons and verification
- Alternative evaluation
- Impact scope assessment

## 2. User Migration Plan
- Alternatives
- Migration paths and tools
- Migration incentives
- Special user handling

## 3. Data Disposal Strategy
- Data classification
- Disposal methods
- Retention periods
- Deletion timeline

## 4. Sunset Timeline
- Announcement period (T-90)
- Transition period (T-60)
- Read-only period (T-30)
- Sunset day (T-0)
- Cleanup period (T+30)

## 5. Communication Plan
- User communication (announcement/FAQ/tutorials)
- Internal communication (team/customer service/sales)
- External communication (partners/media/community)

## 6. Risks and Contingency
- Migration failure contingency plan
- Legal compliance risks
- Brand reputation risks
```

### JSON Structure

```json
{
  "product_name": "",
  "sunset_date": "",
  "report_date": "",
  "decision_assessment": {
    "reasons": [],
    "alternatives_evaluated": [],
    "impact": {
      "affected_users": 0,
      "affected_revenue": 0,
      "brand_impact": ""
    }
  },
  "migration_plan": {
    "alternatives": [],
    "migration_paths": [],
    "incentives": [],
    "special_handling": []
  },
  "data_disposal": {
    "categories": [],
    "disposal_methods": [],
    "retention_periods": [],
    "deletion_timeline": ""
  },
  "timeline": {
    "announcement": "",
    "transition": "",
    "read_only": "",
    "sunset": "",
    "cleanup": ""
  },
  "communication_plan": {
    "user_communication": [],
    "internal_communication": [],
    "external_communication": []
  },
  "risks": []
}
```

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Impact assessment complete (all 3 dimensions assessed: users/revenue/brand)
- [ ] Migration plan feasible (each user category has a clear migration path)

### P1 Checks (must pass for standard/deep)

- [ ] Data disposal compliant (legally retained data has retention plan)
- [ ] Timeline executable (5 phases have clear dates and deliverables)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Decision Rules

- When affected users > 10%, the sunset timeline must include a transition period of ≥ 60 days
- When the product involves paid users, a refund or migration compensation plan must be included
- When data involves personal privacy, the data disposal strategy must include a compliant deletion plan
- Decision points requiring human confirmation: sunset decision confirmation, migration plan selection, data retention period, communication messaging approval

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| No health diagnosis | User describes product status; AI assesses sunset necessity based on description | Sunset decision lacks health data support |
| No retention data | Skip user impact quantification; mark as "retention data to be supplemented" | User impact assessment is qualitative description |
| No health diagnosis + no retention data | User describes product status and user scale; AI generates sunset plan based on description | Sunset plan based on qualitative description; key data marked as "to be confirmed" |

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| sunset_object | string | Yes | Sunset target name, cannot be empty |
| impact_assessment | object | Yes | Impact assessment, must include users/revenue/brand dimensions |
| migration_plan | object | Yes | Migration plan, must include migration path for each user category |
| data_disposal | object | Yes | Data disposal strategy, must include retention_policy/compliance |
| timeline | object | Yes | Timeline, must include dates and deliverables for 5 phases |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| diagnosis-health | Health score change | Sunset decision assessment | Reassess sunset necessity |
| retention-management | Retention data update | User impact assessment | Update affected user scale and migration plan |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| diagnosis-orchestrator | Sunset plan generation completed | Output file updated | Plan completion status and key conclusions |
