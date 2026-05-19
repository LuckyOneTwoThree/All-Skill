---
name: change-impact-analysis
description: "Use when PRD or design changes occur. Automatically analyzes the impact scope of requirement changes across functional, technical, testing, and other dimensions, generating a change impact report and re-review recommendations. Keywords: change impact, requirement change, impact analysis, change review, PRD change."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Design Review"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Requirements changed, check the impact scope"
    - "Analyze which modules this change would affect"
    - "Requirements changed, help me assess the impact"
---

# Requirement Change Impact Analysis Automation

## Core Principles

1. **Trigger-driven**: Automatically triggered by new events in the change request system, not manually initiated
2. **Automated validation**: Change classification, impact propagation analysis, and re-review judgment are fully automated
3. **Continuous deployment**: Change impact analysis results automatically sync to version planning, maintaining release cadence
4. **Real-time retrospective**: Version linkage suggestions generated immediately after change impact analysis completion

## Interaction Mode

AI **AI Auto-Execution**

Trigger condition: New change request added to the change management system.

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Change Request | JSON | Yes | Change management system | Change content to be analyzed |
| Current PRD | JSON | Yes | PRD management system | Currently effective PRD version |
| Current Technical Solution | JSON | Yes | Technical solution repository | Reviewed technical solution |
| Development Progress | JSON | Yes | Development tracking system | Current development status of each task |
| API Contract | YAML/JSON | O | output/backend-api-design/api-design-spec/openapi.yaml | Backend API design, evaluating change impact on backend interfaces |
| Backend Review Report | JSON | O | output/backend-architecture/backend-architecture-spec/review_report.json | Backend architecture review results, evaluating change impact on backend architecture |

### Change Request Structure Example

```json
{
  "change_id": "CR_2024_001",
  "title": "Add WeChat login to login flow",
  "requester": "product_manager_zhang",
  "created_at": "ISO8601",
  "change_type": "functional",
  "description": "Add WeChat authorization login on top of existing phone number login",
  "affected_scope": ["Login module", "User center"],
  "proposed_solution": "Introduce WeChat OpenID authorization mechanism",
  "priority": "high",
  "expected_completion": "2024-02-01"
}
```

## Execution Steps

### Step 1: Change Classification (L1-L4)

#### Classification Dimensions

| Level | Change Type | Impact Scope | Decision Level |
|-------|------------|-------------|---------------|
| L1 Minor | Text corrections, style adjustments, copy optimization | Single small feature | Developer self-decision |
| L2 General | Feature detail adjustments, interaction optimization, non-core logic changes | Single feature module | Product manager approval |
| L3 Major | Core feature changes, API interface changes, database structure changes | Multiple feature modules | Multi-role review |
| L4 Strategic | Architecture changes, business model changes, cross-system impact | Global or cross-system | Strategic-level review |

#### Classification Decision Tree

```
Change Request
    │
    ├─ Does it affect core business processes? ──Yes──-> L3
    │
    ├─ Does it change API interface contracts? ──Yes──-> L3
    │
    ├─ Does it affect data models? ──Yes──-> L3
    │
    ├─ Does it affect multiple feature modules? ──Yes──-> L2
    │
    └─ Other ──-> L1
```

#### Classification Output

```json
{
  "classification": {
    "level": "L3",
    "level_description": "Major change",
    "reasons": [
      "Core login process undergoes significant change",
      "New WeChat authorization service dependency required"
    ],
    "confidence": 0.92
  }
}
```

### Step 2: Impact Propagation Analysis

#### 2.1 Functional Impact Analysis

**Analysis Content**:

| Analysis Item | Output |
|--------------|--------|
| Directly affected features | PRD feature points directly affected by the change |
| Indirectly affected features | Associated features affected by directly affected features |
| Features dependent on this feature | Whether upstream features are affected |

**Functional Impact Matrix**:

```json
{
  "functional_impact": {
    "directly_affected": [
      {"feature_id": "F001", "feature_name": "Phone Number Login", "impact_type": "modified"}
    ],
    "indirectly_affected": [
      {"feature_id": "F002", "feature_name": "User Registration", "impact_type": "needs_regression"},
      {"feature_id": "F003", "feature_name": "Third-Party Binding", "impact_type": "needs_regression"}
    ],
    "dependent_features": [
      {"feature_id": "F004", "feature_name": "Order Creation", "reason": "Depends on user login state"}
    ]
  }
}
```

#### 2.2 Technical Impact Analysis

**Analysis Content**:

| Analysis Item | Output |
|--------------|--------|
| Code change scope | Code files and functions needing modification |
| Database changes | Table structures and data migrations needing modification |
| API changes | New/modified/deprecated interfaces |
| Third-party dependencies | New/upgraded dependencies |

**Technical Impact Matrix**:

```json
{
  "technical_impact": {
    "code_changes": [
      {"file": "auth/login.ts", "change_type": "modify", "change_lines": 150}
    ],
    "database_changes": [
      {"table": "user_bindings", "change_type": "add_column", "column": "wechat_openid"}
    ],
    "api_changes": [
      {"endpoint": "/api/auth/wechat", "method": "POST", "change_type": "new"}
    ],
    "external_dependencies": [
      {"service": "WeChat Open Platform API", "change_type": "new", "risk": "medium"}
    ]
  }
}
```

#### 2.3 Testing Impact Analysis

**Analysis Content**:

| Analysis Item | Output |
|--------------|--------|
| Features requiring regression testing | Test cases for affected features |
| New test cases needed | Tests for new features |
| Test environment requirements | Special environments needed for testing |

**Testing Impact Matrix**:

```json
{
  "test_impact": {
    "regression_cases": [
      {"case_id": "TC001", "case_name": "Phone number login normal flow", "priority": "P0"},
      {"case_id": "TC002", "case_name": "Verification code error handling", "priority": "P1"}
    ],
    "new_cases_needed": [
      {"case_id": "TC_NEW_001", "case_name": "WeChat authorization login flow", "priority": "P0"},
      {"case_id": "TC_NEW_002", "case_name": "WeChat unbound handling", "priority": "P1"}
    ],
    "test_environment": {
      "needs_mock_wechat": true,
      "special_config": "WeChat sandbox environment"
    }
  }
}
```

#### 2.4 Operations Impact Analysis

**Analysis Content**:

| Analysis Item | Output |
|--------------|--------|
| Operations configuration changes | Whether operations backend needs adjustment |
| Data tracking impact | Whether tracking and statistics are affected |
| Customer service script impact | Whether customer service knowledge base needs updating |

**Operations Impact Matrix**:

```json
{
  "operation_impact": {
    "config_changes": [],
    "data_tracking": [
      {"event": "wechat_login_success", "change_type": "new", "need_verify": true}
    ],
    "customer_service": [
      {"topic": "WeChat login issues", "update_needed": true, "priority": "medium"}
    ]
  }
}
```

### Step 3: Re-Review Necessity Judgment

#### Review Trigger Rules

**Decision Matrix**:

| Change Level | Involves Role Changes | Involves Assumption Changes | Re-Review Necessity |
|-------------|----------------------|----------------------------|---------------------|
| L4 | Any | Any | **Mandatory re-review** |
| L3 | Any | Yes | **Mandatory re-review** |
| L3 | Yes | No | **Mandatory re-review** |
| L3 | No | No | Suggested review |
| L2 | Yes | Yes | Suggested review |
| L2 | Other | - | Optional review |
| L1 | - | - | No review needed |

#### Review Role Identification

| Role | Trigger Condition |
|------|-------------------|
| Product Manager | Requirement change involves product features |
| Designer | UI/UX-related changes |
| Backend Developer | API/data model changes |
| Frontend Developer | Interface/interaction changes |
| QA Lead | Any change |
| Operations | Operations-related changes |

#### Re-Review Necessity Output

```json
{
  "review_decision": {
    "required": true,
    "level": "L3_mandatory_review",
    "review_scope": [
      {"role": "Product Manager", "reason": "Core feature change"},
      {"role": "QA Lead", "reason": "Testing scope expansion"}
    ],
    "review_content": [
      "WeChat login technical solution",
      "Compatibility with existing login flow",
      "Regression test plan"
    ],
    "review_deadline": "ISO8601"
  }
}
```

### Step 4: Version Linkage Analysis

#### 4.1 PRD Version Update

**Analysis Content**:

| Analysis Item | Output |
|--------------|--------|
| PRD sections needing update | PRD sections involved in the change |
| Change type | Addition/modification/deletion |
| Update suggestions | Specific update content suggestions |

**PRD Version Update**:

```json
{
  "prd_version_update": {
    "current_version": "1.2.0",
    "new_version": "1.3.0",
    "update_type": "minor_version",
    "sections_to_update": [
      {"chapter": "3. Login Feature", "change_type": "modify", "suggestion": "Add WeChat login section"}
    ],
    "update_proposal": "See attached PRD update suggestions"
  }
}
```

#### 4.2 Code Version Planning

**Analysis Content**:

| Analysis Item | Output |
|--------------|--------|
| Target version | Version planned for the change |
| Code branch strategy | How to organize code changes |
| Release cadence | Which Sprint to release with |

**Code Version Planning**:

```json
{
  "code_version_plan": {
    "target_release": "v2.1.0",
    "branch_strategy": "feature/wechat_login",
    "merge_target": "release/2.1.0",
    "sprint_plan": "Sprint 8",
    "code_freeze_date": "ISO8601"
  }
}
```

#### 4.3 Test Case Version Update

**Analysis Content**:

| Analysis Item | Output |
|--------------|--------|
| New test cases needed | For new features |
| Test cases needing modification | For changed content |
| Test cases to be deleted | For deprecated features |

**Test Case Version Update**:

```json
{
  "test_case_version_update": {
    "cases_to_add": [
      {"case_id": "NEW_001", "case_name": "WeChat login success", "priority": "P0"}
    ],
    "cases_to_modify": [
      {"case_id": "TC_001", "case_name": "Login page UI", "change": "Add WeChat login entry"}
    ],
    "cases_to_delete": [],
    "estimated_test_effort_hours": 16
  }
}
```

## Output

**Storage Path**: `output/pm-design/change-impact-analysis/`

**Output File**: `change_impact_report.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["output_id", "change_id", "classification", "impact_analysis", "review_needed"],
  "properties": {
    "output_id": {"type": "string", "description": "Output unique identifier"},
    "change_id": {"type": "string", "description": "Change request ID"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "classification": {"type": "object", "description": "Change classification, including level and reasons"},
    "impact_analysis": {"type": "object", "description": "Impact analysis, including functional/technical/testing/operations four dimensions"},
    "review_needed": {"type": "boolean", "description": "Whether re-review is needed"},
    "review_decision": {"type": "object", "description": "Review decision, including review scope and content"},
    "version_updates": {"type": "object", "description": "Version linkage update suggestions"},
    "summary": {"type": "object", "description": "Change impact summary, including impact scope and risk level"}
  }
}
```

### Final Output Structure

```json
{
  "output_id": "change_impact_report_xxx",
  "change_id": "CR_2024_001",
  "generated_at": "ISO8601",
  "classification": {
    "level": "L3",
    "level_description": "Major change",
    "reasons": [...]
  },
  "impact_analysis": {
    "functional": {...},
    "technical": {...},
    "test": {...},
    "operation": {...}
  },
  "review_needed": true,
  "review_decision": {...},
  "version_updates": {
    "prd": {...},
    "code": {...},
    "test_cases": {...}
  },
  "summary": {
    "impact_scope": "Multiple feature modules",
    "estimated_effort_days": 10,
    "risk_level": "medium"
  }
}
```

### Output Field Descriptions

| Field | Type | Description |
|-------|------|-------------|
| classification | JSON | Change level and reasons |
| impact_analysis | JSON | Four-dimension impact analysis details |
| review_needed | boolean | Whether re-review is needed |
| review_decision | JSON | Review scope and content |
| version_updates | JSON | Version linkage update suggestions |

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| output_id | string | Yes | Output unique identifier |
| change_id | string | Yes | Change request ID, must match input change_id |
| generated_at | string | Yes | Generation time, ISO 8601 format |
| classification | object | Yes | Change classification |
| classification.level | string | Yes | Change level, enum: L1/L2/L3/L4 |
| classification.level_description | string | Yes | Level description |
| classification.reasons | array | Yes | Classification reason list, must not be empty |
| classification.confidence | number | Yes | Classification confidence, range 0.0-1.0 |
| impact_analysis | object | Yes | Impact analysis |
| impact_analysis.functional | object | Yes | Functional impact analysis, includes directly_affected/indirectly_affected/dependent_features |
| impact_analysis.functional.directly_affected | array | Yes | Directly affected feature list, each item includes feature_id/feature_name/impact_type |
| impact_analysis.technical | object | Yes | Technical impact analysis, includes code_changes/database_changes/api_changes/external_dependencies |
| impact_analysis.technical.api_changes | array | Yes | API change list, each item includes endpoint/method/change_type |
| impact_analysis.test | object | Yes | Testing impact analysis, includes regression_cases/new_cases_needed/test_environment |
| impact_analysis.operation | object | Yes | Operations impact analysis, includes config_changes/data_tracking/customer_service |
| review_needed | boolean | Yes | Whether re-review is needed |
| review_decision | object | No | Review decision (required when review_needed is true), includes level/review_scope/review_content/review_deadline |
| review_decision.level | string | No | Review level, enum: L1_optional/L2_suggested/L3_mandatory/L4_strategic |
| review_decision.review_scope | array | No | Review role list, each item includes role/reason |
| version_updates | object | No | Version linkage update suggestions, includes prd/code/test_cases |
| version_updates.prd | object | No | PRD version update suggestions, includes current_version/new_version/sections_to_update |
| version_updates.code | object | No | Code version planning, includes target_release/branch_strategy/sprint_plan |
| version_updates.test_cases | object | No | Test case version update, includes cases_to_add/cases_to_modify/cases_to_delete |
| summary | object | Yes | Change impact summary |
| summary.impact_scope | string | Yes | Impact scope description |
| summary.estimated_effort_days | number | Yes | Estimated impact person-days, must be >= 0 |
| summary.risk_level | string | Yes | Risk level, enum: low/medium/high/critical |

## Upstream Change Response

When upstream input changes occur, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| PRD requirement change | Functional impact analysis, version linkage | Update functional impact matrix, re-evaluate change level and re-review necessity |
| API contract change | Technical impact analysis | Update API change list, re-evaluate technical impact scope |
| Backend architecture review result change | Technical impact analysis | Update technical impact assessment, re-evaluate architecture risk |
| Development progress change | Testing impact analysis | Update regression testing scope, adjust version planning |

When change impact analysis results themselves change, downstream notification mechanism:

| Change Impact Analysis Change Type | Notification Scope | Notification Method |
|-----------------------------------|-------------------|---------------------|
| Change level escalation | agile-review | Mark change level change, trigger retrospective assessment |
| Impact scope expansion | design-prd | Mark impact scope change, trigger PRD update assessment |
| Re-review necessity change | quality-acceptance | Mark review need change, trigger acceptance criteria update |
| Version planning adjustment | agile-sprint-planning | Mark version planning change, trigger Sprint plan adjustment |

---

## Decision Rules

### Mandatory Re-Review Rules

| Condition | Decision |
|-----------|----------|
| L3 level change | **Must trigger re-review** |
| L4 level change | **Must trigger strategic-level review** |
| Involves assumption changes | Must re-review |
| Impact scope > 3 feature modules | Suggest escalating review level |

### Special Handling Rules

| Condition | Handling Method |
|-----------|----------------|
| Change involves data migration | Must include data rollback plan |
| Change involves third-party services | Must include service degradation plan |
| Change affects P0 features | Must have product owner sign-off |

## Quality Checks

### Quality Check

| Check Item | Standard | Non-Compliance Handling |
|-----------|----------|------------------------|
| Impact scope exhaustiveness | Functional/technical/testing/operations four dimensions fully covered | Return for supplementation |
| Re-review judgment basis | Every judgment has corresponding evidence | Return for supplementation |
| Version linkage completeness | PRD/code/test case versions synchronized | Alert + manual confirmation |

### Impact Scope Exhaustiveness Checklist

- [ ] Functional impact: Direct/indirect/dependent features identified
- [ ] Technical impact: Code/database/API/dependencies identified
- [ ] Testing impact: Regression/new test cases identified
- [ ] Operations impact: Configuration/data/customer service identified

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|--------------|-----------------|---------------|
| Change request missing | Cannot execute, user must describe change content | - |
| Current PRD missing | User describes change content -> analyze impact directly, no PRD baseline comparison | Cannot precisely locate affected sections; impact scope based on inference |
| Technical solution missing | Skip code change scope assessment in technical impact analysis | Technical impact analysis incomplete |
| Change request + current PRD + technical solution all missing | User describes change content -> analyze impact directly | Output simplified impact analysis, each dimension marked "Pending supplementation" |
| API contract missing | Only assess impact on frontend and design | Backend impact may be underestimated |
| Backend review report missing | Only assess based on PRD and design | Backend architecture risk may be missed |

### Data Acquisition Instructions

When upstream files are missing, users need to provide the following information to support degraded generation:
- **Change content description**: What changed, which feature modules are involved
- **Change reason** (optional): Why the change is needed
- **Expected impact scope** (optional): Modules or systems the change may affect

## Execution Log

```json
{
  "execution_id": "exec_p2_xxx",
  "pipeline": "change-impact-analysis",
  "change_id": "CR_2024_001",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "steps": [
    {"step": "step_1_classification", "status": "completed", "duration_ms": 500},
    {"step": "step_2_impact_analysis", "status": "completed", "duration_ms": 2000},
    {"step": "step_3_review_decision", "status": "completed", "duration_ms": 800},
    {"step": "step_4_version_updates", "status": "completed", "duration_ms": 600}
  ],
  "output_ref": "output_ref_xxx",
  "quality_checks_passed": true
}
```

## Changelog

- v2.0: Initial version
- v2.1: Fixed output validation rules -- replaced review_result field that didn't match actual Schema, aligned with output_id/change_id/classification/impact_analysis/review_needed/review_decision/version_updates/summary; fixed upstream change response -- aligned with change impact analysis scenarios instead of code review scenarios; fixed downstream notification mechanism -- aligned with actual notification scenarios and added version planning adjustment notification
