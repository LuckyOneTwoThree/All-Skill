---
name: design-userflow
description: "Use when designing user flows and task flows. Automatically designs user flows from PRD and IA proposals, generating Task Flows and User Flows with conditional branches, exception paths, quality checks, and optimization suggestions. Keywords: user flow, User Flow, Task Flow, flow design, path optimization, user path, operation flow."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Product Design & Prototyping"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How to map user operation flows"
    - "Help me structure user paths"
    - "How to design task flows"
---

# User Flow Auto-Design

## Core Principles

1. **Exception paths are as important as happy paths**: 80% of UX problems occur on exception paths
2. **Zero tolerance for dead ends**: Any path that prevents users from completing a task must be eliminated
3. **Batch generation, human filtering**: AI generates flow proposals in bulk, humans make final selection and judgment
4. **Shortest path first**: Core task path step count < 5 is optimal

AI->Human AI suggests -> Human approves

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | Product requirements document |
| PRD Structured Data | JSON | O | output/pm-design/design-prd/prd.json | Machine-consumable PRD version containing user_flows[]/pages[] for flow design alignment |
| IA Proposal | JSON | Yes | output/pm-design/design-ia/ia_proposals.json | Information architecture proposal from Pipeline 9 |
| User Research Data | JSON | O | output/pm-discovery/user-research-voice-analysis / output/pm-discovery/user-research-behavior-analysis | User behavior patterns, task preferences |

## Execution Steps

### Step 1: Task Flow Generation

Define task-level flows:

- **Starting Point**: User enters scenario
- **Step Sequence**: Core path to complete task
- **System Response**: System feedback at each step
- **End Point**: Task completion state

### Step 2: User Flow Generation

Expand into complete user flows:

- **Conditional Branches**: if/else decision nodes
- **Exception Paths**: Network errors, no permissions, empty states, etc.
- **Return Paths**: Operations to go back to previous step
- **Alternative Paths**: Different ways to accomplish the same goal

### Step 3: Flow Quality Auto-Check

Validate generated flows for quality:

| Check Item | Description |
|-----------|-------------|
| Shortest path | Minimum steps for core task |
| Exception coverage | Exception path coverage rate |
| Return paths | Whether return operations are supported |
| Decision point information | Whether information at decision points is sufficient |
| Dead ends | Situations where task cannot be completed |

### Step 4: Flow Optimization Suggestions

Propose improvements based on quality check results:

- **Long path marking**: Paths with >5 steps flagged
- **Exception handling supplementation**: Suggestions for uncovered exception scenarios
- **Guidance suggestions**: Guidance optimization for complex nodes
- **Dead end handling**: Eliminate or optimize dead ends

## Output

**Storage Path**: `output/pm-design/design-userflow/`
**Output File**: userflow.json

```json
{
  "user_flow": {
    "task": "Core Task Name",
    "flow_type": "task_flow | user_flow",
    "steps": [
      {
        "step": 1,
        "step_id": "UF-S001",
        "action": "User Action",
        "page_id": "page-dashboard",
        "system_response": "System Feedback",
        "expected_outcome": "Expected Result",
        "error_handling": "Exception Handling",
        "branch": null
      },
      {
        "step": 2,
        "step_id": "UF-S002",
        "action": "User Action",
        "page_id": "page-courses",
        "system_response": "System Feedback",
        "expected_outcome": "Expected Result",
        "error_handling": "Exception Handling",
        "branch": {
          "condition": "Condition Description",
          "if_true": {
            "step_id": "UF-S002a",
            "action": "Action when condition is met",
            "page_id": "page-target",
            "expected_outcome": "Expected result when condition is met"
          },
          "if_false": {
            "step_id": "UF-S002b",
            "action": "Action when condition is not met",
            "page_id": "page-fallback",
            "expected_outcome": "Expected result when condition is not met"
          }
        }
      }
    ],
    "quality_check": {
      "shortest_path_steps": 3,
      "exception_coverage": 0.85,
      "dead_ends": 0,
      "issues": []
    }
  }
}
```

**Output Validation Rules**: See Output Validation Rules section below

## Decision Rules

| Condition | Action |
|-----------|--------|
| Dead end count > 0 | Must fix, provide fix suggestion for each dead end |
| Core task path step count > 7 | Mark "Path too long", suggest splitting into sub-flows |
| Exception path coverage < 80% | Mark "Insufficient exception coverage", list uncovered exception scenarios |
| Decision point information insufficient | Mark "Decision point needs supplementation", list missing information items |
| Return path incomplete | Mark "Return path missing", suggest supplementing return paths |
| Flow confidence < 0.5 | Escalate to human validation, mark "Low flow inference reliability" |
| Key path mismatch with PRD feature points | Mark "Feature coverage gap", list PRD feature points not covered |

## Quality Checks

| Check Item | Standard | Non-Compliance Handling |
|-----------|----------|------------------------|
| Core task step count | < 5 steps optimal, <= 7 steps acceptable | Mark "Path too long", suggest splitting into sub-flows |
| Exception path coverage | >= 80% | List uncovered exceptions, mark "Insufficient exception coverage" |
| Dead end count | = 0 | Provide fix suggestion for each dead end, must fix |
| Decision point information sufficiency | All decision points have sufficient judgment information | Mark missing information items, suggest supplementation |
| Return path completeness | All branches have return to main path | Supplement missing return paths |
| PRD feature coverage | Key feature points 100% covered | List uncovered features, mark "Feature coverage gap" |
| All outputs have confidence scores | 100% | Fields missing confidence scores filled with default 0.3 and flagged |

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|-----------------|---------------|
| PRD document missing | User provides feature description, design flow directly | Lacks PRD structured data, flow may miss feature points |
| IA proposal missing | User provides feature description, design flow directly | Lacks IA data, flow may not match page structure |
| Both PRD and IA missing | User provides feature description, design flow directly | Overall confidence reduced, flow may be less complete |
| All upstream files missing | Prompt user to execute prior stages first, or design flow based on user feature description | Output is only basic flow framework |

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| user_flow | object | Yes | User flow data |
| user_flow.task | string | Yes | Core task name |
| user_flow.flow_type | string | Yes | Flow type (task_flow/user_flow) |
| user_flow.steps | array | Yes | Flow step list, must not be empty |
| user_flow.steps[].step | integer | Yes | Step number |
| user_flow.steps[].step_id | string | Yes | Step unique identifier (aligned with prd.json.user_flows.steps.step_id) |
| user_flow.steps[].action | string | Yes | User action |
| user_flow.steps[].page_id | string | Yes | Associated page ID (aligned with prd.json.pages.page_id) |
| user_flow.steps[].system_response | string | Yes | System feedback |
| user_flow.steps[].expected_outcome | string | Yes | Expected result (aligned with prd.json.user_flows.steps.expected_outcome) |
| user_flow.steps[].error_handling | string | No | Exception handling (aligned with prd.json.user_flows.steps.error_handling) |
| user_flow.quality_check | object | Yes | Quality check results |
| user_flow.quality_check.shortest_path_steps | integer | Yes | Shortest path step count |
| user_flow.quality_check.exception_coverage | number | Yes | Exception path coverage (0-1) |
| user_flow.quality_check.dead_ends | integer | Yes | Dead end count (must be 0) |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| PRD feature requirement addition/removal | Task flow, step sequence | Mark affected tasks and steps, suggest human confirmation on whether to regenerate flow |
| PRD interaction logic change | Conditional branches, exception paths | Mark affected branches and exception paths, suggest human confirmation on whether to update flow |
| IA proposal change (page addition/removal) | Page references in flow steps | Mark affected steps, suggest human confirmation on whether to adjust flow |
| IA route change | Page transitions in flow | Mark affected transition paths, suggest human confirmation on whether to update |
| User research data update | Flow optimization suggestions | Mark affected optimization points, suggest human confirmation on whether to adjust flow |

### Downstream Notification Mechanism

| Flow Change Type | Notification Scope | Notification Method |
|-----------------|-------------------|---------------------|
| Task flow change | design-prototype, interaction-spec | Mark flow changes, trigger prototype and interaction spec updates |
| Conditional branch change | design-prototype, interaction-spec | Mark branch changes, trigger prototype and interaction spec updates |
| Exception path change | design-prototype, interaction-spec | Mark exception path changes, trigger prototype and interaction spec updates |
| Dead end fix | design-prototype | Mark fix content, trigger prototype update |

## Alignment with prd.json Data Contract

| This Skill's Output Field | prd.json Corresponding Field | Alignment Rule |
|--------------------------|----------------------------|----------------|
| user_flow.task | prd.json.user_flows[].name | Task name must be consistent with user_flow name |
| user_flow.steps[].step_id | prd.json.user_flows[].steps[].step_id | Step IDs must be consistent |
| user_flow.steps[].page_id | prd.json.pages[].page_id | page_id must exist in prd.json.pages |
| user_flow.steps[].expected_outcome | prd.json.user_flows[].steps[].expected_outcome | Expected result descriptions must be consistent |

## Data Acquisition Instructions

This Skill requires PRD and IA proposal data. Please provide via one of the following methods:
  1. Directly describe feature flows and user tasks
  2. Upload PRD document / ia_proposals.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis
