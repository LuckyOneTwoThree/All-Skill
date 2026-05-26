# PRD-S Complete 9-Section Structure Reference

> This document is split from the design-prd SKILL.md and contains the standard structure definition for PRD-S (Standard). PRD-L and PRD-X are proportionally adjusted based on this structure.

The following is the standard structure for PRD-S (Standard). PRD-L and PRD-X are proportionally adjusted based on this structure.

### PRD-L (Light) Adjustment Rules

- **Retain**: Section 1 (Meta Information), Section 2.1-2.2 (Problem Statement + Goal Definition), Section 3.2.1-3.2.2 (Feature List + User Stories, Must/Should only), Section 7.1 (Functional Acceptance, Happy Path only)
- **Merge**: Section 4+5 merged into "Constraints & Requirements" section, Section 8+9 merged into "Release & Appendix" section
- **Remove**: Section 3.2.5-3.2.6 (Data Model / Interface Definition), Section 6 (Data Tracking), Section 7.2-7.3 (Performance / Security Acceptance)
- **Target Scale**: 200-500 words, 3-5 core user stories

### PRD-X (eXtensive) Adjustment Rules

- **Retain**: All 9 sections of PRD-S
- **Enhance**: Section 3.2.2 add exception flow user stories for each feature, Section 3.2.5 Data Model add ER diagram, Section 3.2.6 Interface Definition add error code table, Section 5 add disaster recovery plan, Section 8.1 add A/B testing plan
- **Add**: Section 3.3 Technical Solution Evaluation (multi-option comparison matrix), Section 5.5 Compliance Requirements (GDPR/CCPA etc.), Section 8.4 Internationalization Plan
- **Target Scale**: 3000-8000 words, 10+ user stories with complete exception flows

### Section 1: Meta Information

Auto-generate the following fields:

| Field | Description | Generation Method |
|------|------|----------|
| Title | Requirement name | Extracted from upstream or AI-generated |
| Document ID | Globally unique identifier | PRDS-{YearMonth}-{SequenceNumber} |
| Version | Current version number | Automatically follows lifecycle |
| Author | Document creator | Extracted from context |
| Status | Draft / In Review / Finalized / Launched | State machine transition |
| Created At | ISO 8601 format | System time |
| Related Documents | Upstream output reference list | Auto-linked |

### Section 2: Background & Goals (Why)

#### 2.1 Why (Problem Statement)

- **Problem Statement**: Clearly define the business problem or user pain point to be solved
- **Data Support**: Reference insight data from upstream exploration phase
- **Problem Source**: User feedback / Data analysis / Competitor analysis / Strategic planning
- **Impact Scope**: Number of affected users, business revenue, conversion rate loss

Data reference format:
```
[Data Source: {Upstream Output ID}]
- Metric Name: {Specific Value}
- Data Period: {Time Range}
- Confidence: {High/Medium/Low}
```

#### 2.2 Goals & Success Definition

**Primary Metric**
- Metric Name:
- Current Baseline:
- Target Improvement:
- Statistical Period:

**Guardrail Metrics**
| Metric | Baseline | Lower Bound | Monitoring Frequency |
|------|------|------|----------|
| | | | |

**Supporting Metrics**
| Metric | Relationship to Primary Metric | Data Source |
|------|--------------|----------|
| | | |

**OKR Alignment** (aligned with prd.json goals[] structure)
```
Goal #{goal_id}:
  Description: {goal_description}
  OKR Alignment: {okr_alignment}
  Success Metrics:
    - {metric_name}: Target {target_value}, Current {current_value}, Unit {unit}
    - ...
```

#### 2.3 Target Users & Scenarios

**User Persona**
- User Type:
- User Scale:
- Core Needs:
- Usage Scenarios:

**Usage Scenario Matrix**
| Scenario | User | Touchpoint | Frequency |
|------|------|------|------|
| | | | |

### Section 3: Solution Design (What & How)

#### 3.1 Solution Overview

- **Solution Type**: New feature / Feature optimization / Architecture refactoring / Experience improvement
- **Core Value Proposition**:
- **Solution Highlights**:
- **Relationship with Existing System**:

#### 3.2 Feature Specification

##### 3.2.1 Feature List (MoSCoW Annotation)

| Feature | Priority | Type | Dependencies |
|--------|--------|------|----------|
| Must | | | |
| Should | | | |
| Could | | | |
| Won't | | | |

**Priority Definitions**:
- **Must**: MVP core, requirement fails if not implemented
- **Should**: Important but does not block MVP completion
- **Could**: Enhancement, implement when resources allow
- **Won't**: Explicitly excluded, reason documented

##### 3.2.2 User Stories (Given-When-Then Format)

**Standard Format**:
```
User Story #{ID}
Title: {Concise Description}
Role: {Who}
Feature: {What}
Value: {Why}

Acceptance Criteria:
  Given {Precondition}
  When {Trigger Action}
  Then {Expected Result}
```

**Flow Classification**:
- **Happy Path**: Optimal path for users to achieve their goal
- **Branch Flow**: Alternative operation paths
- **Exception Flow**: Error handling, boundary conditions
- **Postconditions**: System state changes after operation completion

**Example**:
```
User Story #PRDS-001
Title: User successfully completes order payment
Role: User who has placed an order
Feature: Pay for order
Value: Complete transaction loop

Acceptance Criteria:
  Given User has selected products and submitted order, order amount is 100 yuan, account balance is 200 yuan
  When User selects WeChat Pay and confirms payment
  Then System deducts 100 yuan, order status updates to "Paid", user receives payment success notification
```

##### 3.2.3 Interaction Logic

**Page Flow Diagram**
```
[Page A] -> [Action 1] -> [Page B]
            v
      [Action 2 Failed] -> [Error Prompt]
```

**Feedback Requirements**
| Action | In-Progress Feedback Intent | Result Feedback Intent | Timeout Handling Intent |
|------|----------|----------|----------|
| | | | |

##### 3.2.4 State Design (5 Special States)

| State Type | Trigger Condition | Design Intent | Interaction Handling |
|----------|----------|----------|----------|
| **Empty State** | No data available | Guide user to next action | Provide initial action entry |
| **Loading State** | Data fetching in progress | Let user perceive system is processing | Show progress, disable duplicate actions |
| **Error State** | Request failed | Clearly inform error reason and provide recovery path | Provide retry / contact support entry |
| **Partial State** | Incomplete data | Distinguish from complete state | Mark missing content |
| **Permission State** | No access permission | Explain permission restriction and provide application path | Provide permission request entry |

##### 3.2.5 Data Model

**Core Entities**
| Entity Name | Field | Type | Constraint | Description |
|--------|------|------|------|------|
| | | | | |

**Relationship Diagram**
```
Entity A (1:N) -> Entity B
     v
Entity C (N:1) -> Entity D
```

##### 3.2.6 Interface Definition

**API Interface List**
| Interface Name | Request Method | Path | Description |
|----------|----------|------|------|
| | | | |

**Interface Detail Template**
```
Interface: {Interface Name}
Method: GET/POST/PUT/DELETE
Path: /api/v1/{resource}
Description:

Request Parameters:
| Parameter Name | Type | Required | Description |
|--------|------|------|------|

Response Example:
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### Section 4: Boundaries & Constraints

#### 4.1 Explicitly Not Doing

| Excluded Item | Original Scope | Exclusion Reason | Future Plan |
|--------|----------|----------|----------|
| | | | |

#### 4.2 Technical Constraints

| Constraint Type | Specific Requirement | Impact Description |
|----------|----------|----------|
| **Performance Constraints** | | |
| **Security Constraints** | | |
| **Compatibility Constraints** | | |
| **Technical Debt** | | |

#### 4.3 Known Limitations

| Limitation | Severity | Temporary Workaround | Root Fix Plan |
|--------|----------|--------------|----------|
| | | | |

### Section 5: Non-Functional Requirements (NFR)

#### 5.1 Performance Requirements

| Metric | Target Value | Measurement Method | Monitoring Threshold |
|------|--------|----------|----------|
| Page Load Time | < 2s | | |
| API Response Time | < 500ms | | |
| Concurrent Users | Support N simultaneous users | | |
| Error Rate | < 0.1% | | |

#### 5.2 Availability Requirements

| Requirement | Specific Metric | Test Method |
|--------|----------|----------|
| Success Rate | >= 99.5% | |
| Fault Tolerance | Support automatic retry N times | |
| Degradation Strategy | Core features available in degraded mode | |

#### 5.3 Security Requirements

| Category | Requirement | Implementation Method |
|------|------|----------|
| Authentication | | |
| Authorization | | |
| Data Encryption | | |
| Audit Logging | | |

#### 5.4 Observability Requirements

| Dimension | Metric | Alert Threshold |
|------|------|----------|
| **Metrics** | | |
| **Logs** | | |
| **Traces** | | |

### Section 6: Data Tracking Plan

#### 6.1 Event List

| Event Name | Trigger Timing | Properties | Associated Metric |
|--------|----------|------|----------|
| | | | |

**Event Property Standard**
```json
{
  "event_name": "xxx",
  "user_id": "string",
  "timestamp": "ISO8601",
  "properties": {
    "page_name": "string",
    "action_type": "string"
  }
}
```

#### 6.2 Tracking Validation Plan

- **Validation Method**: QA testing + data callback verification
- **Validation Timing**: Completed simultaneously during functional acceptance phase
- **Data Quality Monitoring**: Tracking coverage > 95%, data latency < 5min

### Section 7: Acceptance Criteria

#### 7.1 Functional Acceptance (Given-When-Then)

**Happy Path Coverage**
```
Given {Normal precondition}
When {User performs core action}
Then {All expected normal results}
```

**Boundary Condition Coverage**
```
Given {Boundary precondition}
When {Boundary value triggered}
Then {Expected boundary behavior}
```

**Exception Handling Coverage**
```
Given {Exception precondition}
When {Exception triggered}
Then {Graceful error handling}
```

**Compatibility Coverage**
```
Given {Specific environment/version precondition}
When {Action executed}
Then {Operates normally within constraints}
```

#### 7.2 Performance Acceptance

| Test Scenario | Expected Metric | Pass Criteria |
|----------|----------|----------|
| Stress Test | | |
| Capacity Test | | |
| Stability Test | | |

#### 7.3 Security Acceptance

| Security Test Item | Test Method | Pass Criteria |
|------------|----------|----------|
| Authentication Test | | |
| Permission Control Test | | |
| Data Encryption Test | | |

### Section 8: Release & Operations

#### 8.1 Release Strategy

**Gradual Rollout Plan**
| Phase | Scope | Timeline | Observation Metrics |
|------|------|------|----------|
| Internal Testing | Internal users | | |
| Small Traffic | 5% users | | |
| Full Rollout | 100% users | | |

**Feature Flag Configuration**
- Feature toggle key:
- Default state:
- Rollout percentage:

**Rollback Plan**
- Rollback trigger condition:
- Rollback operation procedure:
- Rollback impact assessment:

#### 8.2 Operations Preparation

| Preparation Item | Owner | Completion Time | Acceptance Criteria |
|--------|--------|----------|----------|
| Help Documentation | | | |
| Customer Service Scripts | | | |
| Operations Materials | | | |
| Training Materials | | | |

#### 8.3 Impact Evaluation Plan

| Metric | Evaluation Period | Evaluation Method | Decision Threshold |
|------|----------|----------|----------|
| | | | |

### Section 9: Appendix

#### 9.1 Glossary

| Term | Definition | First Occurrence |
|------|------|--------------|
| | | |

#### 9.2 Change Log

| Version | Date | Change Content | Changed By |
|------|------|----------|--------|
| | | | |

#### 9.3 Open Issues

| Issue Description | Impact Assessment | Owner | Planned Resolution Time |
|----------|----------|--------|--------------|
| | | | |

#### 9.4 Related Document Index

| Document Type | Document Name | Document ID/Path | Version |
|----------|----------|-------------|------|
| Strategy Document | | | |
| Design Document | | | |
| Technical Document | | | |
| Test Plan | | | |
