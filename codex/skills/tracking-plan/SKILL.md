---
name: tracking-plan
description: "Use when generating a tracking plan. Tracking plan auto-generation including reverse-engineering tracking needs from metric system, PRD feature tracking extraction, tracking quality checks, PRD consistency validation. Keywords: Tracking plan, event design, property design, tracking specification, Tracking Plan, data collection, add tracking, instrumentation."
metadata:
  module: "Product Metrics Design"
  sub-module: "Tracking Plan"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "This feature needs tracking"
    - "Help me create a tracking plan"
    - "Organize what data needs to be collected"
execution_depth:
  default: standard
  quick_description: "Output core event list and tracking checklist only"
  deep_description: "Full plan + data governance specs + privacy compliance audit + long-term evolution roadmap"
---

# Tracking Plan Auto-Generation

## Core Principles

1. **Comprehensive Analysis**: Systematically analyze all available data without omitting key dimensions
2. **Real-time Awareness**: Metric system design supports real-time monitoring and rapid response
3. **Automated Attribution**: Anomalous fluctuations are automatically attributed to specific causes, reducing manual investigation
4. **Explicit Decision Rules**: Every alert and escalation condition has clear quantitative rules

## Interaction Mode

**AI->Human AI suggests, human approves**

This Pipeline automatically generates tracking plans, but key decision points require human approval:
- **Must approve**: Tracking business logic correctness
- **Must approve**: Privacy compliance
- **Recommended approval**: Tracking priority adjustment

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| PRD | string/file | Yes | User provided | PRD document content (including feature descriptions, user flows, core paths, business rules) |
| Metric system | JSON | Yes | output/pm-metrics-design/metrics-system/metric_system.json | North Star metric, L1/L2/actionable metrics |
| Existing tracking list | JSON array | O | User provided | Existing tracking event list |

### PRD (required)

**PRD document content**, including:
- Product feature descriptions
- User flow descriptions
- Core path definitions
- Business rule descriptions

**Supported formats**:
- Markdown format
- Word documents
- Structured JSON
- Prototype + description

---

### Metric System (from Pipeline 1)

```json
{
  "north_star": {
    "name": "string",
    "calculation": "string"
  },
  "l1_metrics": [...],
  "l2_metrics": [...],
  "actionable_metrics": [...]
}
```

---

### Existing Tracking List (optional)

```json
[
  {
    "event_name": "string",
    "trigger": "string",
    "properties": [
      {
        "name": "string",
        "type": "string"
      }
    ],
    "last_modified": "2026-01-01"
  }
]
```

---

## Execution Steps

### Step 1: Reverse-Engineer Tracking Needs from Metric System [Conditional]

**AI AI Processing**

**Processing Logic**:

```
FOR each metric in metric_system:
  1. Analyze data elements required for metric calculation
  2. Identify user behaviors that need to be tracked
  3. Define corresponding tracking events
  4. List required tracking properties
```

**Reverse Engineering Mapping Table**:

| Metric Type | Required Behavior Data | Tracking Event Example |
|-------------|----------------------|----------------------|
| Conversion rate metric | Page/feature impression + click | page_view + button_click |
| Frequency metric | Behavior occurrence count | feature_use |
| Duration metric | Behavior start + end time | session_start + session_end |
| Quality metric | Behavior result + evaluation | action_result + feedback |
| Coverage rate metric | Feature used vs. unused comparison | feature_use vs non_use |

**Output**:

```json
{
  "metrics_to_track": [
    {
      "metric_name": "string",
      "required_behavior": "string",
      "proposed_event": {
        "event_name": "string",
        "trigger": "string",
        "required_properties": ["string"]
      }
    }
  ]
}
```

---

### Step 2: Extract Feature Tracking Needs from PRD [Conditional]

**AI AI Processing**

**Processing Logic**:

```
1. Parse PRD document structure
2. Identify feature module list
3. Extract core user paths
4. Identify key interaction nodes
5. Define feature tracking events
```

**PRD Parsing Dimensions**:

#### 2.1 Feature Module Identification

```
Identify feature modules in PRD -> Define module-level tracking
```

**Example**:

| PRD Feature Module | Tracking Namespace | Tracking Event Example |
|-------------------|-------------------|----------------------|
| User authentication | user_auth | login_success, logout, register_complete |
| Product browsing | product_browse | product_view, product_list_view, search |
| Shopping cart | cart | add_to_cart, remove_from_cart, cart_view |
| Order flow | order | checkout_start, payment_success, order_complete |
| User center | user_center | profile_view, settings_view |

---

#### 2.2 Core User Path Extraction

```
Identify user flows described in PRD -> Define path tracking
```

**Example Flow** (E-commerce):

```
Register/Login -> Homepage browsing -> Product search/category -> Product detail -> Add to cart -> Checkout payment -> Order complete
```

**Path Tracking Design**:
```json
{
  "user_journey": "Register->Browse->Search->Detail->Add to cart->Checkout->Payment->Complete",
  "touchpoints": [
    "register_success",
    "homepage_view",
    "product_list_view",
    "product_detail_view",
    "add_to_cart",
    "cart_view",
    "checkout_start",
    "payment_page_view",
    "payment_success",
    "order_complete"
  ]
}
```

---

#### 2.3 Key Interaction Node Identification

```
Identify interaction details in PRD -> Define interaction tracking
```

**Interaction Types**:

| Interaction Type | Trigger Timing | Tracking Properties |
|-----------------|---------------|-------------------|
| Button click | When click action occurs | button_name, page_name, position |
| Form submit | When form submission succeeds | form_name, submit_result, error_type |
| Swipe gesture | When swipe ends | swipe_direction, swipe_distance |
| Input behavior | When input is completed | input_field, input_length, input_type |
| Switch operation | When switch completes | switch_from, switch_to, switch_type |

---

### Step 3: Deduplicate with Existing Tracking [Conditional]

**AI AI Processing**

**Deduplication Logic**:

```
FOR each proposed_event:
  1. Search for similar events in existing tracking list
  2. Calculate similarity score
  3. IF similarity > 0.8 THEN flag as duplicate
  4. ELSE IF similarity > 0.5 THEN flag for human confirmation
  5. ELSE flag as new tracking
```

**Similarity Calculation Rules**:

```
Similarity = α x naming_similarity + β x trigger_timing_similarity + γ x property_similarity

Where:
  - Naming similarity: Based on string matching and semantic analysis
  - Trigger timing similarity: Based on semantic distance of trigger descriptions
  - Property similarity: Based on Jaccard coefficient of common properties

Weight recommendations:
  - α = 0.4
  - β = 0.3
  - γ = 0.3
```

**Deduplication Result Output**:

```json
{
  "deduplication_result": {
    "new_events": [...],
    "duplicate_events": [...],
    "similar_events": [...],
    "updated_events": [...]
  }
}
```

---

### Step 4: Tracking Quality Check [Conditional]

**AI AI Processing**

#### 4.1 Naming Convention Check

**Naming Rules**:

```
Event naming: all lowercase + underscore separator
  Example: user_login_success, product_add_to_cart

Property naming: all lowercase + underscore separator
  Example: user_id, product_price, page_name
```

**Check Items**:

| Check Item | Rule | Pass Condition |
|------------|------|----------------|
| Letter convention | Only a-z, 0-9, underscore allowed | No uppercase letters, no special characters |
| Separator convention | Use underscore to separate semantic units | Not camelCase, not hyphenated |
| Completeness | Includes subject_action_object | At least 3 semantic units |
| No abbreviations | Avoid non-standard abbreviations | Common abbreviations must be defined in specification |

**Check Output**:

```json
{
  "naming_check": {
    "total_events": 100,
    "passed": 95,
    "failed": 5,
    "issues": [
      {
        "event_name": "UserLoginSuccess",
        "issue": "Contains uppercase letters",
        "suggestion": "user_login_success"
      }
    ]
  }
}
```

---

#### 4.2 Property Completeness Check

**Core Property Definitions**:

| Property Type | Property Name | Required | Description |
|--------------|---------------|----------|-------------|
| Common property | user_id | Yes | User unique identifier |
| Common property | session_id | Yes | Session unique identifier |
| Common property | timestamp | Yes | Event occurrence time |
| Common property | platform | Yes | Platform type |
| Common property | app_version | Yes | App version number |
| Page property | page_name | Yes | Page name |
| Page property | page_url | Yes | Page URL |
| Device property | device_type | Yes | Device type |
| Device property | os_version | Yes | Operating system version |

**Check Rules**:

```
FOR each event:
  1. Verify core common properties are complete
  2. Verify required properties for specific event types
  3. Calculate property completeness rate
  4. IF completeness rate < 80% THEN flag as failed
```

**Check Output**:

```json
{
  "completeness_check": {
    "total_events": 100,
    "core_attributes_coverage": 0.95,
    "events_with_full_attributes": 92,
    "events_needing_review": [
      {
        "event_name": "product_view",
        "missing_attributes": ["product_category", "source_page"],
        "completeness_rate": 0.70
      }
    ]
  }
}
```

---

#### 4.3 Core Path Coverage Check

**Core Path Definition**:

```
Based on metric system and PRD, define core user paths that must be covered
```

**Coverage Requirement**:

```
Core path coverage rate >= 90%
```

**Check Logic**:

```python
def check_core_path_coverage():
    core_paths = get_core_paths_from_prd()
    covered_paths = get_covered_paths_from_tracking()

    coverage_rate = len(covered_paths & core_paths) / len(core_paths)

    return {
        "total_core_paths": len(core_paths),
        "covered_paths": len(covered_paths & core_paths),
        "uncovered_paths": core_paths - covered_paths,
        "coverage_rate": coverage_rate,
        "pass": coverage_rate >= 0.9
    }
```

**Check Output**:

```json
{
  "core_path_coverage": {
    "total_paths": 10,
    "covered": 9,
    "uncovered": ["path_to_checkout"],
    "coverage_rate": 0.90,
    "status": "pass"
  }
}
```

---

#### 4.4 Anomaly State Coverage Check

**Anomaly State Definitions**:

| Anomaly Type | Anomaly Scenario | Tracking Need |
|-------------|-----------------|---------------|
| Load anomaly | Page/API load failure | error_view, api_error |
| Form anomaly | Form validation failure, submission failure | form_error, submit_failed |
| Payment anomaly | Payment failure, payment cancelled | payment_failed, payment_cancelled |
| Permission anomaly | No access permission | permission_denied |
| Network anomaly | Disconnection, timeout | network_error, timeout |

**Check Rules**:

```
FOR each core_flow:
  1. Identify anomaly branches in the flow
  2. Check for corresponding anomaly tracking
  3. IF anomaly scenario has no tracking THEN add warning
```

**Check Output**:

```json
{
  "anomaly_coverage": {
    "total_anomaly_scenarios": 15,
    "covered_scenarios": 14,
    "missing_scenarios": [
      {
        "scenario": "Empty search results",
        "flow": "search",
        "suggested_event": "search_no_result"
      }
    ],
    "coverage_rate": 0.93
  }
}
```

---

#### 4.5 Redundancy Detection

**Redundancy Rules**:

```
IF any of the following conditions exist THEN flag as redundant tracking:
  - Two events collect exactly the same data
  - Parent-child event data is duplicated (parent event already includes child event data)
  - Events with identical statistical scope are defined redundantly
```

**Detection Output**:

```json
{
  "redundancy_check": {
    "duplicates": [
      {
        "event_a": "page_view",
        "event_b": "screen_show",
        "reason": "Both collect the same data (page impression)",
        "recommendation": "Keep page_view, remove screen_show"
      }
    ],
    "total_redundant": 1
  }
}
```

---

### Step 5: Generate Tracking Document [Core]

**AI AI Processing**

**Document Structure**:

```json
{
  "tracking_document": {
    "version": "1.0",
    "generated_date": "2026-05-08",
    "overview": {
      "total_events": 100,
      "new_events": 30,
      "updated_events": 10,
      "existing_events": 60
    },
    "events": [
      {
        "event_name": "string",
        "display_name": "string",
        "trigger": {
          "description": "string",
          "timing": "on_action|immediate|on_exit",
          "conditions": ["string"]
        },
        "properties": [
          {
            "name": "string",
            "type": "string|string[]|number|boolean",
            "required": true,
            "description": "string",
            "example": "string"
          }
        ],
        "analysis_purpose": "string",
        "linked_metric": "string",
        "priority": "high|medium|low",
        "status": "pending|approved|implemented",
        "source": "metrics_prd|existing|new"
      }
    ]
  }
}
```

---

### Step 6: PRD Tracking Plan Consistency Validation [Conditional]

**AI AI Processing**

#### 6.1 Bidirectional Validation Mechanism

**Forward Validation**: PRD features -> Tracking coverage

```
FOR each functional_requirement in PRD:
  1. Identify tracking for the feature
  2. IF tracking is missing THEN flag as uncovered
  3. Calculate forward coverage rate
```

**Reverse Validation**: Tracking -> PRD features

```
FOR each tracking_event:
  1. Identify the feature analysis supported by this tracking
  2. IF feature is not in PRD THEN flag as extra tracking
  3. Calculate reverse coverage rate
```

---

#### 6.2 PRD Feature Extraction

**Feature Types**:

| Feature Type | Identification Keywords | Tracking Need |
|-------------|------------------------|---------------|
| Page | Page, module, tab | page_view + page properties |
| Button | Click, press, trigger | button_click + button properties |
| Form | Fill, input, submit | input + form_submit |
| List | List, browse, paginate | list_view + item_click |
| Detail | Detail, view, content | detail_view + detail properties |
| Flow | Flow, step, complete | flow_start + flow_complete |
| Anomaly | Failure, error, timeout | error + error details |

---

#### 6.3 Consistency Scoring

**Scoring Rules**:

```python
def calculate_prd_consistency_score():
    forward_coverage = calculate_forward_coverage()
    backward_coverage = calculate_backward_coverage()

    consistency_score = (
        0.6 * forward_coverage +
        0.4 * backward_coverage
    )

    return {
        "forward_coverage": forward_coverage,
        "backward_coverage": backward_coverage,
        "consistency_score": consistency_score,
        "status": "pass" if consistency_score >= 0.9 else "fail"
    }
```

---

#### 6.4 Continuous Validation Mechanism

**Trigger Timing**:

| Trigger Type | Trigger Condition | Validation Content |
|-------------|-------------------|-------------------|
| PRD change trigger | PRD document updated | Whether new features have tracking |
| Tracking change trigger | Tracking plan updated | Whether changes affect PRD coverage |
| Periodic validation | Weekly/monthly | Full consistency check |
| Pre-release validation | Before release | Targeted validation of changed parts |

**Validation Output**:

```json
{
  "prd_consistency": {
    "forward_coverage": 0.92,
    "backward_coverage": 0.88,
    "consistency_score": 0.90,
    "status": "pass",
    "discrepancies": [
      {
        "type": "uncovered_function",
        "description": "Product share feature has no tracking configured",
        "prd_reference": "PRD section 3.2",
        "severity": "high",
        "suggested_event": "product_share"
      }
    ]
  }
}
```

---

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | core event list and tracking checklist only | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full plan + data governance specs + privacy compliance audit + long-term evolution roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-metrics-design/tracking-plan/`

**Output File**: `tracking_plan.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["tracking_plan", "quality_check"],
  "properties": {
    "tracking_plan": {"type": "array", "description": "Tracking event list, including event definitions, properties, trigger conditions, etc."},
    "quality_check": {"type": "object", "description": "Quality check results, including naming compliance, property completeness, path coverage rate, etc."}
  }
}
```

### tracking_plan

```json
{
  "tracking_plan": [
    {
      "event_name": "string",
      "display_name": "string",
      "trigger": {
        "description": "string",
        "timing": "on_action|immediate|on_exit",
        "conditions": ["string"]
      },
      "properties": [
        {
          "name": "string",
          "type": "string|string[]|number|boolean",
          "required": true,
          "description": "string",
          "example": "string"
        }
      ],
      "analysis_purpose": "string",
      "linked_metric": "string",
      "priority": "high|medium|low",
      "status": "pending|approved|implemented"
    }
  ],
  "quality_check": {
    "naming_compliance": true,
    "property_completeness": 0.95,
    "core_path_coverage": 0.92,
    "anomaly_coverage": true,
    "redundancy_detected": [],
    "prd_consistency": {
      "forward_coverage": 0.92,
      "backward_coverage": 0.88,
      "consistency_score": 0.90,
      "status": "pass"
    }
  }
}
```

---

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| tracking_plan | array | Yes | Tracking event list |
| tracking_plan[].event_name | string | Yes | Event name, lowercase underscore format |
| tracking_plan[].display_name | string | Yes | Event display name |
| tracking_plan[].trigger | object | Yes | Trigger condition definition |
| tracking_plan[].trigger.description | string | Yes | Trigger description |
| tracking_plan[].trigger.timing | string | Yes | Trigger timing, enum: on_action/immediate/on_exit |
| tracking_plan[].properties | array | Yes | Property list |
| tracking_plan[].properties[].name | string | Yes | Property name |
| tracking_plan[].properties[].type | string | Yes | Property type |
| tracking_plan[].properties[].required | boolean | Yes | Whether required |
| tracking_plan[].analysis_purpose | string | Yes | Analysis purpose |
| tracking_plan[].linked_metric | string | Yes | Associated metric |
| tracking_plan[].priority | string | Yes | Priority, enum: high/medium/low |
| tracking_plan[].status | string | Yes | Status, enum: pending/approved/implemented |
| quality_check | object | Yes | Quality check results |
| quality_check.naming_compliance | boolean | Yes | Whether naming convention passed |
| quality_check.property_completeness | number | Yes | Property completeness rate, >=0.8 |
| quality_check.core_path_coverage | number | Yes | Core path coverage rate, >=0.9 |
| quality_check.prd_consistency | object | Yes | PRD consistency validation results |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| North Star metric change | Tracking events linked to North Star | Update linked_metric references, re-evaluate tracking priority, flag for human confirmation |
| L1/L2 metric addition/removal | Tracking events reverse-engineered from corresponding metrics | New metrics trigger new tracking recommendations, removed metrics flag associated tracking as "pending evaluation" |
| Actionable metric change | Tracking linked to actionable metrics | Update priority and analysis purpose of tracking linked to actionable metrics |
| PRD feature change | Feature module tracking and core path tracking | Re-extract PRD feature tracking, execute deduplication and consistency validation, flag changed parts |
| Metric definition modification | Property design of associated tracking | Update tracking properties to match new calculation logic, flag for human confirmation |

When the tracking plan itself changes, notification mechanism to downstream:

| Tracking Change Type | Notification Scope | Notification Method |
|---------------------|-------------------|---------------------|
| Tracking event addition/removal | metrics-dashboard | Flag event addition/removal, trigger Dashboard data source update |
| Tracking property change | metrics-dashboard | Flag property change, trigger Widget configuration update |
| Tracking priority change | Development team | Flag priority change, trigger development scheduling evaluation |
| Naming convention change | All downstream | Flag naming change, trigger full naming validation |

---

## Decision Rules

### Rule 1: Tracking Plan Requires Human Review of Business Logic

**Trigger Condition**:
- After all tracking plans are generated
- Any business logic-related tracking

**Review Points**:

#### Business Logic Correctness

```
1. Whether tracking trigger timing matches business expectations
2. Whether tracking properties accurately reflect business semantics
3. Whether tracking matches analysis purpose
4. Whether cross-flow tracking logic is consistent
```

#### Special Scenario Confirmation

```
1. Async operation tracking timing
2. Retry/failure scenario tracking
3. Boundary condition tracking
4. A/B testing related tracking
```

---

### Rule 2: Privacy Compliance Must Be Confirmed by Human

**Trigger Condition**:
- Tracking involves user personal information
- Tracking involves device information
- Tracking involves behavioral data

**Review Checklist**:

| Review Item | Description | Pass Condition |
|-------------|-------------|----------------|
| Personal information identification | Whether tracking collects PII | Desensitized or anonymized |
| Sensitive information | Whether bank card numbers, passwords, etc. are collected | Explicitly prohibited from collection |
| Data retention | Data retention period | Complies with regulatory requirements |
| User authorization | Whether user consent is obtained | Complies with privacy policy |

---

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] All event names use lowercase + underscore
- [ ] All property names use lowercase + underscore

### P1 Checks (must pass for standard/deep)

- [ ] No camelCase naming
- [ ] No special characters
- [ ] Semantic units complete

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

#### [OK] Core Path Coverage >=90%

**Check Standards**:
- [ ] Core user path coverage >=90%
- [ ] Key conversion node coverage complete
- [ ] Anomaly path coverage >=80%

**Failure Handling**:
```
IF core path coverage insufficient:
  1. Identify uncovered paths
  2. Supplement recommended tracking plan
  3. Adjust quality standards or supplement tracking
```

---

#### [OK] PRD Consistency >=90%

**Check Standards**:
- [ ] Forward coverage >=90% (PRD->Tracking)
- [ ] Reverse coverage >=85% (Tracking->PRD)
- [ ] Overall consistency >=90%

**Failure Handling**:
```
IF PRD consistency insufficient:
  1. List all inconsistent feature points
  2. Evaluate inconsistency reasons
  3. Supplement missing tracking or adjust PRD
  4. Record discrepancy reasons
```

---

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|-----------------|---------------|----------|
| PRD missing | Prompt user to provide feature list, generate basic tracking plan based on feature list | Cannot extract user flows and interaction details, tracking coverage may be incomplete | Request user to provide feature list and core user paths, or upload prd.json |
| Metric system missing | Skip metric reverse-engineering step, only extract tracking needs based on PRD features | Tracking-metric association missing, analysis purpose annotated as "to be supplemented" | Request user to provide core metric list, or upload metrics-system.json |
| Existing tracking list missing | Skip deduplication step, all tracking marked as new | May produce redundant tracking, requires subsequent manual deduplication | Request user to provide existing tracking event list, or upload tracking-plan.json |
| PRD + Metric system + Existing tracking list all missing | User provides feature list -> generate basic tracking plan based on features | Output basic tracking plan, annotated as "to be supplemented" and "to be confirmed" | Request user to provide feature list, core user paths, and key interaction nodes, or execute design-prd and metrics-system first |

---

## Escalation Path

### Escalation Trigger Conditions

When any of the following conditions are met, escalate to manual handling:

1. **PRD parsing failure**
   - PRD document format cannot be parsed
   - PRD content differs too much from structured requirements

2. **Tracking conflicts cannot be auto-resolved**
   - Similar tracking > 5 that cannot be judged
   - Naming conflicts cannot be auto-resolved

3. **Privacy compliance risk**
   - Tracking involves highly sensitive information
   - Compliance boundaries unclear

---

### Escalation Output

```json
{
  "escalation": {
    "trigger": "string",
    "reason": "string",
    "affected_events": ["string"],
    "ai_recommendation": {},
    "requires_human_action": true,
    "human_decision_needed": [
      "Business logic confirmation",
      "Privacy compliance confirmation",
      "Tracking priority adjustment"
    ]
  }
}
```

---
