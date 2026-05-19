---
name: product-sunset-plan
description: "Use when planning product sunset or end-of-life. Product sunset plan generation, assessing sunset impact, formulating user migration plans, data disposal strategies and timeline. Keywords: product sunset, product end-of-life, product offline, product decommission, user migration, data disposal, sunset plan, EOL, product retirement."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Product Sunset"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Plan product sunset"
    - "Product needs to go offline"
    - "How to migrate users to new product"
    - "Product end-of-life plan"
execution_depth:
  default: standard
  quick_description: "Output sunset plan and risk checklist"
  deep_description: "Full sunset plan + user migration plan + data archival strategy + impact assessment report"
---

# Product Sunset Plan Generation AI->Human

## Core Principles

1. **Sunset is responsible exit, not abandonment**: Every sunset must ensure users have a clear migration path and data is properly handled
2. **Impact assessment must be comprehensive**: Users, revenue, brand, data -- missing any dimension means irresponsible sunset
3. **Timeline must leave buffer**: Users need time to adapt; too aggressive a timeline leads to forced migration and brand damage

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Health Diagnosis | JSON | Yes | diagnosis-health -> Health diagnosis | Product health score and bottleneck analysis |
| Retention Data | JSON | No | retention-management -> Retention data | User retention and churn data |
| Sunset Target | string | Yes | User provided | Product/module to sunset |
| Sunset Reason | string | Yes | User provided | Reason for sunset (strategic/business/technical) |

## Execution Steps

### Step 1: Sunset Impact Assessment [Core]

**Goal**: Comprehensively assess the impact of product sunset

**Impact Dimensions**:

| Dimension | Assessment Content | Metric |
|-----------|-------------------|--------|
| User Impact | Affected user count, migration difficulty | Active user count, paying user count |
| Revenue Impact | Revenue loss, refund liability | MRR, ARR, contract commitments |
| Brand Impact | Brand reputation, user trust | NPS change, social media sentiment |
| Data Impact | Data volume, compliance requirements | Data classification, retention period |
| Technical Impact | Dependency chain, system coupling | Dependent service count, API call count |
| Team Impact | Team restructuring, capability transfer | Headcount, skill overlap |

**Assessment Output**:

```yaml
sunset_impact:
  - dimension: user
    severity: high | medium | low
    affected_users:
      active: {count}
      paying: {count}
      free: {count}
    migration_difficulty: easy | moderate | hard
    key_concerns:
      - "Paying users need refund handling"
      - "Data export functionality needed"
  - dimension: revenue
    severity: high | medium | low
    financial_impact:
      mrr_loss: {amount}
      arr_loss: {amount}
      refund_liability: {amount}
    contract_obligations:
      active_contracts: {count}
      earliest_expiry: {date}
  - dimension: brand
    severity: high | medium | low
    risk_assessment:
      nps_impact: {delta}
      social_sentiment: {assessment}
    mitigation:
      - "Communicate sunset decision in advance"
      - "Provide high-quality migration plan"
  - dimension: data
    severity: high | medium | low
    data_inventory:
      total_records: {count}
      pii_records: {count}
      compliance_requirements: [{requirement}]
  - dimension: technical
    severity: high | medium | low
    dependency_map:
      upstream_services: {count}
      downstream_services: {count}
      api_consumers: {count}
  - dimension: team
    severity: high | medium | low
    team_impact:
      affected_headcount: {count}
      skill_transfer_needed: [{skill}]
```

### Step 2: User Migration Plan [Core]

**Goal**: Formulate detailed user migration plan

**Migration Strategy**:

| Strategy | Applicable Scenario | Risk |
|----------|---------------------|------|
| Guided Migration | Alternative product exists | Low |
| Data Export | No alternative product | Medium |
| Gradual Transition | Large user base | Low |
| Immediate Cutover | Small user base | High |

**Migration Plan**:

```yaml
migration_plan:
  strategy: guided_migration
  target_product: {product_name}
  phases:
    - phase: notification
      duration: 30 days
      actions:
        - "Send sunset notification email"
        - "In-app sunset announcement"
        - "Publish migration guide"
    - phase: assisted_migration
      duration: 60 days
      actions:
        - "One-click migration tool online"
        - "Dedicated customer service support"
        - "Migration incentive program"
    - phase: grace_period
      duration: 30 days
      actions:
        - "Product read-only mode"
        - "Data export feature online"
        - "Final migration reminder"
    - phase: decommission
      duration: 7 days
      actions:
        - "Product offline"
        - "Data archiving"
        - "Service closure"
  migration_tools:
    - tool: one_click_migration
      description: "One-click migrate all data to new product"
      availability: {date_range}
    - tool: data_export
      description: "Export all user data as standard format"
      formats: [csv, json, pdf]
  support_plan:
    dedicated_support:
      channel: email | chat | phone
      hours: 9x5 | 7x24
      duration: {period}
    faq_document: {url}
    migration_guide: {url}
```

### Step 3: Data Disposal Strategy [Core]

**Goal**: Formulate compliant data disposal plan

**Data Classification**:

| Data Type | Retention Period | Disposal Method |
|-----------|-----------------|-----------------|
| Personal Identification Info | Per privacy policy | Anonymize or delete |
| Transaction Records | Per financial regulations | Archive or delete |
| User Content | Per user choice | Export or delete |
| System Logs | Per retention policy | Archive or delete |
| Analytics Data | Per business needs | Archive or delete |

**Disposal Plan**:

```yaml
data_disposal:
  - data_type: personal_identification
    classification: pii
    retention_policy: "Delete within 30 days after sunset"
    disposal_method: secure_delete
    compliance: [GDPR, CCPA]
    verification: "Third-party audit confirmation"
  - data_type: transaction_records
    classification: financial
    retention_policy: "Archive for 7 years per financial regulations"
    disposal_method: encrypted_archive
    compliance: [SOX]
    verification: "Finance team confirmation"
  - data_type: user_content
    classification: user_data
    retention_policy: "User chooses export or delete"
    disposal_method: user_choice
    compliance: [GDPR]
    verification: "User confirmation + system log"
```

### Step 4: Timeline Formulation [Core]

**Goal**: Formulate executable sunset timeline

**Timeline Template**:

```yaml
sunset_timeline:
  announcement_date: {date}
  phases:
    - phase: announcement
      start: {date}
      end: {date}
      milestones:
        - "Official sunset announcement published"
        - "Migration guide online"
        - "Customer service team trained"
    - phase: migration_period
      start: {date}
      end: {date}
      milestones:
        - "Migration tool online"
        - "50% users migrated"
        - "90% users migrated"
    - phase: grace_period
      start: {date}
      end: {date}
      milestones:
        - "Product enters read-only mode"
        - "Data export feature online"
        - "Final migration reminder sent"
    - phase: decommission
      start: {date}
      end: {date}
      milestones:
        - "Product officially offline"
        - "Data archiving completed"
        - "All services closed"
    - phase: post_sunset
      start: {date}
      end: {date}
      milestones:
        - "Data disposal completed"
        - "Compliance audit passed"
        - "Sunset process closed"
  key_dates:
    announcement: {date}
    migration_start: {date}
    read_only_mode: {date}
    service_end: {date}
    data_disposal_complete: {date}
```

### Step 5: Communication Plan [Core]

**Goal**: Formulate comprehensive communication plan

**Communication Objects**:

| Object | Communication Content | Channel | Time Point |
|--------|----------------------|---------|------------|
| Users | Sunset notification, migration guide | Email, In-app | Announcement day |
| Paying Users | Refund plan, exclusive migration support | Dedicated email, Phone | Announcement day |
| Enterprise Customers | Contract handling, dedicated migration plan | Dedicated email, Meeting | 7 days before announcement |
| Partners | API offline schedule, alternative solutions | Email, Developer docs | 14 days before announcement |
| Internal Team | Sunset process, responsibility assignment | Internal email, Meeting | 14 days before announcement |
| Public | Sunset announcement | Official website, Social media | Announcement day |

**Communication Template**:

```yaml
communication_templates:
  user_notification:
    subject: "Important: {product_name} Service Adjustment Notice"
    key_points:
      - "Service end date: {date}"
      - "Migration guide: {url}"
      - "Support channel: {contact}"
    tone: "Professional, empathetic, clear"
  enterprise_customer:
    subject: "Dedicated Notice: {product_name} Service Adjustment"
    key_points:
      - "Dedicated contact person"
      - "Custom migration plan"
      - "Contract handling plan"
    tone: "Professional, proactive, solution-oriented"
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | sunset plan and risk checklist | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full sunset plan + user migration plan + data archival strategy + impact assessment report | Full deliverables + extended analysis + deep simulation |

## Output


**Output file path**: `output/pm-monitoring/product-sunset-plan/`
**Output Schema**:

```json
{
  "type": "object",
  "required": ["plan_id", "sunset_target", "impact_assessment", "migration_plan", "data_disposal", "timeline"],
  "properties": {
    "plan_id": {"type": "string", "description": "Plan unique identifier"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "sunset_target": {"type": "string", "description": "Product/module to sunset"},
    "sunset_reason": {"type": "string", "description": "Sunset reason"},
    "impact_assessment": {"type": "array", "description": "Impact assessment, including user/revenue/brand/data/technical/team dimensions"},
    "migration_plan": {"type": "object", "description": "User migration plan, including strategy, phases and tools"},
    "data_disposal": {"type": "array", "description": "Data disposal strategy, including classification and disposal methods"},
    "timeline": {"type": "object", "description": "Sunset timeline, including phases and key dates"},
    "communication_plan": {"type": "object", "description": "Communication plan, including objects and templates"}
  }
}
```

```
├── {date}/
│   ├── impact_assessment.yaml
│   ├── migration_plan.yaml
│   ├── data_disposal.yaml
│   ├── timeline.yaml
│   ├── communication_plan.yaml
│   └── full_plan.md
└── latest/
    └── sunset_plan.md
```

## Decision Rules

| Scenario | Decision Rule |
|----------|---------------|
| Paying user count > 1000 | Must provide dedicated migration support |
| Active contracts not expired | Cannot sunset before contract expiry |
| PII data involved | Must comply with GDPR/CCPA requirements |
| Downstream service dependencies exist | Must provide alternative API or migration period |
| Brand impact assessed as high | Must formulate PR crisis plan |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Impact assessment complete (users/revenue/brand/data/technical/team 6 dimensions)
- [ ] Migration plan feasible (has tools, support, timeline)

### P1 Checks (must pass for standard/deep)

- [ ] Data disposal compliant (complies with privacy regulations)
- [ ] Timeline executable (has buffer, milestones clear)
- [ ] Communication plan complete (covers all stakeholders)
- [ ] P0 unresolved issues listed

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|------------------|---------------|
| Health diagnosis | User provides product health status description, AI assesses sunset necessity based on description | Impact assessment based on user description, lacking data validation |
| Retention data | Skip user retention analysis, use active user count to estimate migration difficulty | Migration plan lacking retention data support |
| Sunset target | Cannot execute, must be provided by user | -- |
| Sunset reason | Cannot execute, must be provided by user | -- |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Health diagnosis missing**: Ask user to describe product health status (e.g., "DAU declining, revenue shrinking"), AI will assess sunset necessity and impact based on description
2. **Retention data missing**: Ask user to provide active user count and approximate churn rate, AI will estimate migration difficulty and formulate migration plan accordingly
3. **Sunset target and reason missing**: These are required inputs, must be provided by user

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| plan_id | string | Yes | Plan unique identifier |
| sunset_target | string | Yes | Sunset target, cannot be empty |
| impact_assessment | array | Yes | Impact assessment, must cover at least 4 dimensions |
| migration_plan | object | Yes | Migration plan, must contain strategy/phases |
| data_disposal | array | Yes | Data disposal strategy, must contain classification/disposal_method |
| timeline | object | Yes | Timeline, must contain phases/key_dates |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|-----------------|-------------|--------------|-----------------|
| diagnosis-health | Health score change | Sunset necessity assessment | Re-evaluate sunset decision |
| retention-management | Retention data update | Migration plan and timeline | Update migration plan and timeline |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|---------------------|------------------------|---------------------|----------------------|
| diagnosis-orchestrator | Product sunset plan completed | Output file update | Plan completion status and key decisions |
| iteration-decision | Sunset plan confirmed | Write to output file | Sunset timeline and resource requirements |
