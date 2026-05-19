---
name: quality-acceptance
description: "Use when generating acceptance execution plans and sign-off reports. Generates acceptance plans based on Given-When-Then criteria (P0/P1 failures block release), integrating acceptance criteria, open issues and sign-off confirmation. Keywords: acceptance execution plan, acceptance testing, Given-When-Then, quality gate, release check, acceptance report, sign-off report, UAT report, acceptance confirmation."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Quality Assurance"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Run acceptance tests automatically"
    - "Help me execute acceptance checks"
    - "Check if it passes quality gate"
    - "Generate acceptance report"
    - "Version needs acceptance, help me produce the report"
    - "Organize acceptance results"
---

# Acceptance Execution Plan Generation & Sign-off Report Generation

## Core Principles

1. **Trigger-driven**: Auto-triggered by Story completion and build success events, not waiting for manual initiation
2. **Acceptance plan generation**: Auto-parse acceptance criteria, generate test environment configuration suggestions, auto-generate execution instructions and judgment rules
3. **Continuous deployment**: Passing acceptance means ready for release; P0/P1 failures immediately block
4. **Real-time review**: Acceptance results generated instantly, failed cases analyzed for root cause immediately
5. **Criteria first**: Acceptance criteria must be defined before testing, not after testing is complete
6. **Data speaks**: Pass/fail is determined by data, not by people
7. **Open issues trackable**: Failed items must have resolution plans and tracking IDs
8. **Sign-off auditable**: Sign-off records are traceable, responsibilities are definable

## Interaction Mode

AI **AI generates plan** (Step 1) -> Human **AI suggests, human approves** (Step 2)

Trigger Conditions:
- Story development completed event
- Code merged to main branch event
- Build success event
- Manual trigger (acceptance lead request)

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Story Acceptance Criteria | JSON | Yes | PRD | Given-When-Then format |
| Test Cases | JSON array | Yes | PRD | Test cases derived from PRD acceptance criteria |
| Test Environment Configuration | JSON | Yes | Testing system | Environment parameters and Mock configuration suggestions |
| Build Artifact | File/Reference | Yes | CI/CD | Build version for acceptance |
| Test Results | JSON | No | CI/CD | Automated test execution results |
| SRS Document | Markdown | No | output/pm-design/design-prd/prd.md | Requirements specification (including acceptance criteria, already covered by design-prd) |
| Version Number | string | Yes | User provided | Version number for acceptance |
| Acceptance Scope | string | Yes | User provided | Feature scope for this acceptance |
| Acceptance Party | string | No | User provided | Acceptance lead/team |
| Backend Review Report | JSON | No | output/backend-architecture/backend-architecture-spec/review_report.json | Backend architecture review results |
| API Coverage Report | JSON | No | output/backend-api-design/api-design-spec/api-coverage.json | PRD/frontend alignment coverage report |

### Story Acceptance Criteria Structure Example

```json
{
  "story_id": "story_001",
  "title": "Phone Number Verification Code Login",
  "build_ref": "build_2024_0125_001",
  "version": "v2.1.0",
  "acceptance_criteria": [
    {
      "id": "AC001",
      "format": "given_when_then",
      "content": "Given user is on login page\nWhen user enters valid phone number 13800138000\nAnd clicks get verification code button\nThen system sends 6-digit verification code to that phone number\nAnd page displays send success notification",
      "automatable": true,
      "priority": "P0"
    }
  ]
}
```

## Execution Steps

### Step 1: Acceptance Execution Plan Generation

#### 1.1 Acceptance Criteria Parsing

**GWT Format Standardization**:

| GWT Component | Parse Result | Purpose |
|---------------|--------------|---------|
| Given | Precondition array | Setup steps |
| When | Action step array | Execution steps |
| And | Append to previous When | Continuous actions |
| Then | Expected result array | Assertion verification |

**Parse Output**:

```json
{
  "parsed_criteria": [
    {
      "criteria_id": "AC001",
      "setup": [
        "Open login page",
        "Confirm page has loaded"
      ],
      "actions": [
        "Enter phone number: 13800138000",
        "Click get verification code button"
      ],
      "assertions": [
        "Verify SMS send API was called",
        "Verify success response returned",
        "Verify page displays send success notification"
      ],
      "priority": "P0",
      "automatable": true
    }
  ]
}
```

#### 1.2 Test Strategy Selection

**Strategy Types**:

| Strategy | Applicable Scenario | Execution Instruction Generation Method |
|----------|---------------------|----------------------------------------|
| E2E Automation | Complete user flows | Selenium/Cypress execution instruction generation |
| API Automation | Pure backend features | RestAssured/Postman execution instruction generation |
| Unit Testing | Independent function logic | Jest/JUnit execution instruction generation |
| Integration Testing | Inter-module interaction | Mixed strategy execution instruction generation |

**Strategy Selection Rules**:

```json
{
  "strategy_selection": {
    "AC001": {
      "selected_strategy": "api_automation",
      "reason": "Acceptance point is API call and response",
      "test_framework": "rest_assured",
      "script_location": "tests/api/test_login.py::test_send_verification_code"
    },
    "AC002": {
      "selected_strategy": "e2e_automation",
      "reason": "Includes page navigation and other UI verification",
      "test_framework": "cypress",
      "script_location": "tests/e2e/test_login.py::test_verify_code_login"
    }
  }
}
```

#### 1.3 Test Data Preparation

```json
{
  "test_data_requirements": {
    "AC001": {
      "phone": "13800138000",
      "type": "valid_phone",
      "source": "test_data/phones/valid.json"
    },
    "AC002": {
      "phone": "13800138000",
      "verification_code": "123456",
      "type": "valid_code",
      "source": "generated_by_AC001"
    }
  }
}
```

#### 1.4 Test Environment Configuration Suggestions

**Environment Readiness Check**:

| Check Item | Check Content | Timeout |
|------------|---------------|---------|
| Application Service | Service started and health check passed | 60s |
| Database | Database connection normal, data ready | 30s |
| Cache Service | Redis connection normal | 15s |
| Message Queue | MQ connection normal | 15s |
| Third-party Mock | Mock service available | 30s |
| Test Accounts | Test data preparation complete | 20s |

**Environment Isolation Configuration**:

```json
{
  "isolation_config": {
    "test_db": "test_db_isolation_enabled",
    "test_cache_prefix": "test:",
    "network_isolation": "enabled",
    "clean_strategy": "per_suite"
  }
}
```

**Mock Service Configuration Suggestions**:

```json
{
  "mock_config": {
    "sms_gateway": {
      "enabled": true,
      "behavior": "record_and_playback",
      "record_file": "mocks/recordings/sms_gateway.json"
    },
    "wechat_auth": {
      "enabled": true,
      "behavior": "simulate_success",
      "user_id": "mock_wechat_123"
    }
  }
}
```

#### 1.5 Execution Instruction Generation

**Execution Plan Generation**:

```json
{
  "execution_plan": {
    "total_criteria": 12,
    "parallel_groups": [
      {
        "group_id": "group_1",
        "criteria": ["AC001", "AC002"],
        "execution_mode": "sequential",
        "reason": "Dependency exists (AC002 depends on AC001 data)"
      }
    ],
    "estimated_duration_minutes": 25
  }
}
```

**Execution Engine Configuration Suggestions**:

```json
{
  "execution_config": {
    "runner": "pytest",
    "browsers": ["chrome", "firefox"],
    "retry_config": {
      "enabled": true,
      "max_retries": 2,
      "retry_on_failure": ["timeout", "network_error"]
    },
    "timeout_config": {
      "test_case_timeout": 120,
      "api_call_timeout": 30,
      "page_load_timeout": 60
    },
    "reporting": {
      "generate_html_report": true,
      "generate_json_report": true,
      "screenshots_on_failure": true,
      "video_recording": "on_failure"
    }
  }
}
```

#### 1.6 Judgment Rule Generation

**Result Aggregation**:

```json
{
  "result_aggregation": {
    "summary": {
      "total_criteria": 12,
      "passed": 10,
      "failed": 2,
      "skipped": 0,
      "pass_rate": 0.83
    },
    "by_priority": {
      "P0": {"total": 4, "passed": 3, "failed": 1},
      "P1": {"total": 5, "passed": 5, "failed": 0},
      "P2": {"total": 3, "passed": 2, "failed": 1}
    },
    "execution_duration_seconds": 1200,
    "automated_execution_rate": 0.92
  }
}
```

**Gate Decision**:

| Condition | Decision | Handling |
|-----------|----------|----------|
| P0 has failures | **Block** | Block release, send alert |
| P1 failure count > 2 | **Block** | Block release, require fix |
| Automation rate < 90% | **Block** | Block release, increase automation |
| P2 failure count > 5 | **Warning** | Allow release, require fix commitment |

**Gate Output**:

```json
{
  "gate_decision": {
    "passed": false,
    "blocked_by": "P0_FAILURE",
    "blocking_items": [
      {
        "criteria_id": "AC002",
        "priority": "P0",
        "failure_reason": "No redirect to homepage after successful login"
      }
    ],
    "release_allowed": false,
    "next_actions": [
      "Fix defect corresponding to AC002",
      "Re-execute acceptance"
    ]
  }
}
```

#### 1.7 Failure Analysis Rule Generation

**Failure Classification**:

| Failure Type | Characteristics | Handling Strategy |
|--------------|-----------------|-------------------|
| Code Defect | Feature not working as expected | Submit Bug, require fix |
| Environment Issue | Environment configuration or data issue | Fix environment, re-execute |
| Test Issue | Test script defect itself | Fix test script |
| Data Issue | Inaccurate test data | Update test data |
| Requirement Change | Requirement and implementation out of sync | Confirm whether to update requirement |

**Classification Output**:

```json
{
  "failure_analysis": [
    {
      "criteria_id": "AC002",
      "failure_type": "code_defect",
      "evidence": {
        "expected": "Page redirects to homepage",
        "actual": "Page stays on login page",
        "error_message": "Navigation timeout after 30000ms",
        "screenshots": ["screenshots/ac002_failure_1.png"],
        "logs": ["logs/browser_console.log"]
      },
      "root_cause_hypothesis": "Frontend route navigation logic not executing correctly after successful login",
      "likely_location": "frontend/router/index.ts",
      "confidence": 0.85
    }
  ]
}
```

**Fix Suggestion Generation**:

```json
{
  "fix_suggestions": [
    {
      "criteria_id": "AC002",
      "fix_type": "code_fix",
      "location": "frontend/pages/login.vue",
      "line_range": "45-60",
      "suggestion": "Add router.push('/home') call in login success callback",
      "verification_plan": "Re-execute AC002 acceptance test"
    }
  ]
}
```

**Regression Risk Assessment**:

```json
{
  "regression_risk": {
    "scope": "limited",
    "affected_stories": ["story_002", "story_003"],
    "risk_level": "medium",
    "reason": "Login module changes may affect user registration flow",
    "recommendations": [
      "Recommend executing regression tests for story_002 and story_003",
      "Recommend executing login-related E2E test suite"
    ]
  }
}
```

### Step 2: Sign-off Report Generation

#### 2.1 Acceptance Criteria Extraction

Extract acceptance criteria from PRD and acceptance criteria data:

**Acceptance Criteria Classification**:

| Category | Description | Pass Condition |
|----------|-------------|----------------|
| Functional Acceptance | Core features implemented per requirements | All Must requirements pass |
| Performance Acceptance | Performance metrics meet targets | Key metric achievement rate 100% |
| Security Acceptance | Security requirements met | No high/critical vulnerabilities |
| Compatibility Acceptance | Target platforms compatible | All target platforms pass |
| User Experience Acceptance | Core flows smooth | No P0-level UX issues |

**Each Acceptance Criterion**:

| ID | Criterion Description | Source (PRD ID) | Priority | Verification Method |
|----|----------------------|-----------------|----------|---------------------|
| AC-001 | User can complete registration in 3 steps | FR-AUTH-001 | Must | Functional testing |
| AC-002 | Page first screen load <2s | NFR-PERF-001 | Must | Performance testing |

#### 2.2 Test Results Integration

Integrate test results, map to acceptance criteria:

**Test Results Summary**:

| Acceptance Criterion | Test Case Count | Passed | Failed | Blocked | Pass Rate | Status |
|---------------------|-----------------|--------|--------|---------|-----------|--------|
| AC-001 | 5 | 5 | 0 | 0 | 100% | [OK] |
| AC-002 | 3 | 2 | 1 | 0 | 67% | [X] |

**Overall Statistics**:

| Metric | Value |
|--------|-------|
| Total Test Cases | |
| Passed | |
| Failed | |
| Blocked | |
| Skipped | |
| Overall Pass Rate | |
| Must Requirement Pass Rate | |

#### 2.3 Defect Analysis

Defect analysis for failed and blocked test cases:

**Defect List**:

| Defect ID | Linked Acceptance Criterion | Severity | Description | Reproduction Steps | Status | Owner |
|-----------|----------------------------|----------|-------------|-------------------|--------|-------|
| BUG-001 | AC-002 | Critical | First screen load timeout | 1.Open homepage 2.Wait | Pending fix | |

**Severity Definition**:

| Level | Definition | Acceptance Impact |
|-------|------------|-------------------|
| Fatal | System crash/Data loss | Blocks acceptance |
| Critical | Core feature unavailable | Blocks acceptance |
| Major | Feature limited but workaround exists | Can accept with known issues |
| Minor | UX issue | Can accept with known issues |
| Suggestion | Optimization suggestion | Does not affect acceptance |

#### 2.4 Open Issues Assessment

**Open Issues List**:

| ID | Description | Severity | Impact Scope | Resolution Plan | Estimated Fix Time | Risk Assessment |
|----|-------------|----------|--------------|-----------------|-------------------|-----------------|
| | | | | Fix/Workaround/Accept | | |

**Open Issues Acceptance Impact Judgment**:

| Condition | Acceptance Recommendation |
|-----------|--------------------------|
| Fatal/Critical defects unfixed | [X] Recommend not passing acceptance |
| Only Major/Minor defects | [OK] Recommend conditional pass, open issues listed for next version |
| No open issues | [OK] Recommend passing acceptance |

#### 2.5 Acceptance Conclusion

**Acceptance Conclusion Template**:

```
Acceptance Conclusion: [OK] Pass / [!] Conditional Pass / [X] Fail

Acceptance Scope: {version} {feature scope}
Acceptance Date: {date}
Acceptance Party: {acceptance party}

Passed Items: {N} items ({X}%)
Failed Items: {N} items ({X}%)
Must Requirement Pass Rate: {X}%

Open Issues: {N}
- Fatal/Critical: {N}
- Major/Minor: {N}

Acceptance Recommendation:
{specific recommendations}
```

**Sign-off Confirmation**:

| Role | Name | Sign-off Opinion | Signature | Date |
|------|------|-----------------|-----------|------|
| Product Owner | | Agree/Disagree/Conditional Agree | | |
| Technical Lead | | Agree/Disagree/Conditional Agree | | |
| Test Lead | | Agree/Disagree/Conditional Agree | | |
| Business Representative | | Agree/Disagree/Conditional Agree | | |

#### 2.6 Document Assembly

**Report Structure**:

```
# {Product Name} v{Version} Acceptance Test Report

## 1. Acceptance Overview
### 1.1 Acceptance Scope
### 1.2 Acceptance Criteria
### 1.3 Acceptance Environment

## 2. Acceptance Execution Plan
### 2.1 Acceptance Criteria Parsing
### 2.2 Test Environment Configuration Suggestions
### 2.3 Execution Instructions & Judgment Rules
### 2.4 Gate Decision

## 3. Test Results Summary
### 3.1 Overall Statistics
### 3.2 Acceptance Criteria Item-by-Item Results
### 3.3 Test Coverage

## 4. Defect Analysis
### 4.1 Defect Statistics
### 4.2 Defect List
### 4.3 Defect Trends

## 5. Open Issues
### 5.1 Open Issues List
### 5.2 Open Issues Risk Assessment
### 5.3 Resolution Plan

## 6. Acceptance Conclusion
### 6.1 Conclusion
### 6.2 Open Issues Resolution Plan
### 6.3 Sign-off Confirmation

## Appendix
- Test case details
- Test environment configuration
- Complete acceptance criteria list
- Failed case analysis details
```

## Output

**Storage path**: `output/pm-monitoring/quality-acceptance/`

**Output Files**:

| File | Format | Description |
|------|--------|-------------|
| acceptance-report.md | Markdown | Complete acceptance test report (including acceptance execution plan and sign-off confirmation) |
| acceptance-report.json | JSON | Structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["output_id", "story_id", "acceptance_report", "gate_decision", "version", "acceptance_date", "conclusion"],
  "properties": {
    "output_id": {"type": "string", "description": "Output unique identifier"},
    "story_id": {"type": "string", "description": "Story ID"},
    "build_ref": {"type": "string", "description": "Build version reference"},
    "version": {"type": "string", "description": "Acceptance version number"},
    "acceptance_date": {"type": "string", "description": "Acceptance date"},
    "acceptance_scope": {"type": "string", "description": "Acceptance feature scope"},
    "acceptance_party": {"type": "string", "description": "Acceptance party"},
    "executed_at": {"type": "string", "description": "Execution time"},
    "acceptance_report": {"type": "object", "description": "Acceptance report body, including summary and item-by-item results"},
    "failed_cases_analysis": {"type": "array", "description": "Failed case analysis, including root cause and fix suggestions"},
    "gate_decision": {"type": "object", "description": "Quality gate decision result, including pass/fail and blocking items"},
    "criteria_results": {"type": "array", "description": "Acceptance criteria item-by-item results"},
    "defects": {"type": "array", "description": "Defect list"},
    "open_issues": {"type": "array", "description": "Open issues list"},
    "conclusion": {"type": "object", "description": "Acceptance conclusion, including result and sign-off confirmation"}
  }
}
```

### Final Output Structure

```json
{
  "output_id": "acceptance_report_xxx",
  "story_id": "story_001",
  "version": "2.3.0",
  "acceptance_report": { /* see output validation rules */ },
  "failed_cases_analysis": [ { /* see Step 1.7 failure analysis */ } ],
  "gate_decision": { /* see Step 1.6 gate output */ },
  "defects": [ { /* see Step 2.3 defect analysis */ } ],
  "open_issues": [],
  "conclusion": { /* see Step 2.5 acceptance conclusion */ }
}
```

### Output Field Description

See Output Schema and Output Validation Rules.

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| auto_acceptance | object | Yes | Auto acceptance root object |
| auto_acceptance.execution_summary | object | Yes | Execution summary |
| auto_acceptance.execution_summary.total_checks | number | Yes | Total check items |
| auto_acceptance.execution_summary.auto_passed | number | Yes | Auto-passed count |
| auto_acceptance.execution_summary.auto_failed | number | Yes | Auto-failed count |
| auto_acceptance.execution_summary.manual_required | number | Yes | Manual verification required count |
| auto_acceptance.checks | array | Yes | Check item list |
| auto_acceptance.checks[].id | string | Yes | Check item ID |
| auto_acceptance.checks[].type | string | Yes | Check type, enum: functional/performance/security/compatibility |
| auto_acceptance.checks[].method | string | Yes | Acceptance method, enum: automated/semi_auto/manual |
| auto_acceptance.checks[].result | string | Yes | Result, enum: pass/fail/pending |
| auto_acceptance.checks[].evidence | object | No | Acceptance evidence |
| auto_acceptance.checks[].confidence | number | Yes | Confidence, 0-1 |
| auto_acceptance.gate_result | string | Yes | Gate result, enum: pass/fail/conditional_pass |
| acceptance_report | object | Yes | Acceptance report root object |
| acceptance_report.summary | object | Yes | Acceptance summary |
| acceptance_report.summary.total_items | number | Yes | Total acceptance items |
| acceptance_report.summary.passed | number | Yes | Passed items |
| acceptance_report.summary.failed | number | Yes | Failed items |
| acceptance_report.summary.blocked | number | Yes | Blocked items |
| acceptance_report.items | array | Yes | Acceptance item list |
| acceptance_report.items[].id | string | Yes | Acceptance item ID |
| acceptance_report.items[].category | string | Yes | Acceptance category |
| acceptance_report.items[].description | string | Yes | Acceptance description |
| acceptance_report.items[].result | string | Yes | Result, enum: pass/fail/blocked/waived |
| acceptance_report.items[].evidence | string | No | Evidence link |
| acceptance_report.items[].severity | string | Yes | Severity level, enum: P0/P1/P2/P3 |
| acceptance_report.risk_assessment | object | Yes | Risk assessment |
| acceptance_report.sign_off | object | Yes | Sign-off record |
| acceptance_report.sign_off.status | string | Yes | Sign-off status, enum: pending/signed/rejected |

## Upstream Change Response

When upstream input changes, this skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|--------------|-------------------|
| Acceptance criteria change | Check items and methods | Regenerate affected check items, preserve passed historical records |
| Test case change | Auto acceptance check items | Update linked acceptance check items, mark for human confirmation |
| PRD requirement change | Acceptance coverage | Re-evaluate acceptance coverage, mark for human confirmation |
| Code change | Acceptance execution plan | Regenerate affected acceptance execution plan |
| Security requirement change | Security acceptance items | Update security acceptance items, re-evaluate security risk |

When acceptance results themselves change, downstream notification mechanism:

| Acceptance Change Type | Notification Scope | Notification Method |
|------------------------|-------------------|---------------------|
| Gate result change | release-orchestrator | Mark gate change, trigger release decision update |
| P0/P1 check failure | change-impact-analysis | Mark failed items, trigger impact assessment |
| Manual verification items | release-orchestrator | Mark pending items, trigger manual acceptance process |
| P0/P1 failure | release-orchestrator | Mark blocking items, block release process |
| Sign-off status change | release-orchestrator | Mark sign-off status, trigger release decision |

---

## Decision Rules

### Release Blocking Rules

| Condition | Decision |
|-----------|----------|
| P0 failures exist | **Immediate block**, send emergency alert |
| P1 failures > 2 | **Immediate block**, require fix |
| Automated execution rate < 90% | **Block**, require increasing automation rate |
| Environment configuration suggestions missing | **Block**, investigate environment configuration |
| Must requirement pass rate <100% | Acceptance conclusion is "fail" |
| Fatal/Critical defects unfixed | Acceptance conclusion is "fail" |
| Major defects > 5 | Recommend fix and re-acceptance |

### Pass Conditions

| Condition | Requirement |
|-----------|-------------|
| P0 cases | 100% pass |
| P1 cases | <= 2 failures |
| P2 cases | <= 5 failures |
| Automation rate | >= 90% |

## Quality Checks

### Quality Gates

| Check Item | Standard | Failed Action |
|------------|----------|---------------|
| P0 case pass rate | 100% | Block |
| Automated execution rate | >= 90% | Block |
| Test environment configuration | All configuration suggestion items output | Block |
| Failure analysis completeness | Includes root cause and suggestions | Alert |

### Quality Check List

- [ ] All P0 case execution instructions generated
- [ ] Automated execution rate meets target
- [ ] Failed case analysis rules generated
- [ ] Failed cases have fix suggestions
- [ ] Environment configuration suggestions output
- [ ] Acceptance criteria item-by-item results available
- [ ] Must requirement pass rate calculated
- [ ] Defects classified by severity
- [ ] Open issues have resolution plans
- [ ] Acceptance conclusion clear (pass/conditional pass/fail)
- [ ] Sign-off confirmation table included

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|---------------|------------------|---------------|
| Acceptance criteria missing | User provides Given-When-Then acceptance criteria -> generate acceptance checklist | Acceptance criteria need manual writing |
| Test environment missing | Generate acceptance checklist and execution instructions, environment configuration marked as to-be-filled | Only checklist and execution instructions output, environment configuration marked as to-be-filled |
| Both acceptance criteria + test environment missing | User provides Given-When-Then acceptance criteria -> generate acceptance checklist | Output acceptance checklist, environment configuration marked "pending configuration" |
| Test results missing | Generate to-be-filled report template based on acceptance criteria | Cannot auto-determine pass/fail |
| SRS missing (already covered by design-prd) | Acceptance criteria provided by user | Need manual definition of acceptance criteria |
| Acceptance party missing | If user does not provide acceptance party, prompt user to provide or skip steps related to this input | Sign-off confirmation table marked "acceptance party to be designated" |
| Backend review report missing | Accept based on functional acceptance criteria only | May miss backend architecture quality issues |
| API coverage report missing | Accept based on PRD acceptance criteria only | May miss API coverage incompleteness issues |

### Data Acquisition Instructions

When upstream files are missing, user needs to provide the following information to support degraded generation:
- **Given-When-Then acceptance criteria**: Given/When/Then description for each acceptance condition
- **Test environment information** (optional): Test environment address, accounts and other configuration
- **Build version** (optional): Build version number for acceptance

## Execution Log

```json
{
  "execution_id": "exec_p5_xxx",
  "pipeline": "quality-acceptance",
  "story_id": "story_001",
  "trigger": "story_completed",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "steps": [
    {"step": "criteria_parsing", "status": "completed", "duration_ms": 200}
  ],
  "gate_decision": {
    "passed": false,
    "reason": "P0_FAILURE"
  },
  "notifications_sent": ["dev_lead", "product_manager"]
}
```
