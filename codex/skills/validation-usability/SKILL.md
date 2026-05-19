---
name: validation-usability
description: "Use when assisting with usability testing. Usability testing assistant providing AI support before, during, and after testing: generates task scripts and recruitment surveys before testing, organizes data and generates insight reports after testing. Note: Actual test execution must be led by a human researcher. Keywords: usability testing, task scripts, recruitment screening, problem clustering, insight extraction, UX testing, test tasks."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Solution Validation"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How to conduct usability testing"
    - "Help me design test tasks"
    - "How to do user experience testing"
execution_depth:
  default: standard
  quick_description: "Output usability issues and improvement suggestions"
  deep_description: "Full assessment + usability scoring system + priority ranking + improvement roadmap"
---

# Usability Testing Assistant

## Core Principles

1. **User behavior is more truthful than user opinions** -- Observe what users do, not what they say
2. **5 users discover 85% of problems** -- Usability testing doesn't need large samples; 5-8 people can discover major issues
3. **Severity determines fix priority** -- Critical issues must be fixed; minor issues can be scheduled
4. **Test reports must be actionable** -- Every finding must correspond to an improvement suggestion; non-actionable findings are noise

### Basic Information

| Attribute | Value |
|-----------|-------|
| Pipeline ID | 15 |
| Name | Usability Testing Assistant |
| Execution Mode | Human->AI Human executes, AI assists |
| Input | Assumption map + MVP features + Test objectives |

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Usability Test Plan | object | Yes | output/pm-design/validation-assumption-map/assumption_map.json | Test objectives, assumption map, MVP features |
| Test Participants | object | Yes | User provided | Target user profiles, recruitment screening criteria |
| Test Task Scenarios | object | Yes | output/pm-design/design-prototype/prototype_spec.json | Usability assumptions to validate and task scripts |

## Execution Steps

### [!] Important Note

Usability testing is the only phase that **must be led by a human researcher**. AI provides auxiliary support in this process:

| Phase | Executor | AI Assistance Content |
|-------|----------|----------------------|
| Pre-test | Human Preparation | Generate task scripts, recruitment surveys, observation record templates |
| During test | Human Execution | Human researcher leads the test |
| Post-test | Human+AI | AI organizes and analyzes, human reviews and confirms |

### Pre-Test AI Assistance

#### Step 1: Determine Test Objectives [Core]

Determine usability test objectives based on the assumption map:

```json
{
  "test_goals": [
    {
      "goal_id": "TG001",
      "related_assumption": "A001",
      "goal_description": "Validate whether users can smoothly browse recommended content"
    }
  ]
}
```

#### Step 2: Generate Task Scripts [Core]

**Rule**: Each task corresponds to a usability assumption to be validated

```json
{
  "task_script": [
    {
      "task_id": "T001",
      "task_description": "Find a piece of interesting recommended content within 3 seconds",
      "related_assumption": "A002",
      "success_criteria": "Click completed within 3 seconds",
      "hints": ["Hint information (if needed)"]
    }
  ]
}
```

#### Step 3: Generate Recruitment Screening Survey [Conditional]

**Screening Criteria**:
- Target user profile match
- Product usage experience requirements
- No conflict of interest

```json
{
  "recruitment_survey": {
    "screening_questions": [
      {
        "question_id": "SQ001",
        "question": "Have you used products with similar recommendation features?",
        "options": ["Frequently", "Occasionally", "Never"],
        "correct_answer": "Frequently|Occasionally"
      }
    ],
    "target_sample_size": 8,
    "oversample_ratio": 1.25
  }
}
```

#### Step 4: Generate Observation Record Template [Conditional]

```json
{
  "observation_template": {
    "participant_id": "",
    "test_date": "",
    "tasks": [
      {
        "task_id": "T001",
        "time_on_task": "seconds",
        "success": true/false,
        "errors": ["Error description"],
        "observations": "Observation notes",
        "quotes": ["User verbatim quotes"]
      }
    ],
    "overall_notes": "Overall observations"
  }
}
```

### Post-Test AI Assistance

#### Step 5: Test Record Structured Organization [Core]

Convert raw test records into structured data:

```json
{
  "structured_records": [
    {
      "participant_id": "P001",
      "task_results": [
        {
          "task_id": "T001",
          "time_seconds": 5,
          "completed": true,
          "errors": [],
          "critical_incidents": []
        }
      ]
    }
  ]
}
```

#### Step 6: Problem Auto-Clustering [Deep]

**Clustering Dimensions**:

| Dimension | Description |
|-----------|-------------|
| Severity | Critical/Serious/Minor/Cosmetic |
| Frequency | High/Medium/Low |
| Affected Area | Navigation/Operation/Feedback/Content |

**Severity Definitions**:

| Level | Definition | Impact |
|-------|-----------|--------|
| Critical (P0) | Task cannot be completed | Causes user abandonment |
| Serious (P1) | Task requires significant assistance | Severely impacts efficiency |
| Minor (P2) | Task is difficult but completable | Impacts user experience |
| Cosmetic (P3) | Operation is inconvenient but acceptable | Optimization item |

```json
{
  "problem_clusters": [
    {
      "cluster_id": "PC001",
      "severity": "P1",
      "frequency": "3/8 users",
      "affected_element": "Recommendation list",
      "problem_description": "Users have difficulty understanding the relevance of recommended content",
      "evidence": ["Evidence 1", "Evidence 2"]
    }
  ]
}
```

#### Step 7: Insight Extraction [Deep]

**Three Types of Insights**:

| Type | Description | Example |
|------|-------------|---------|
| Assumption validation | Whether an assumption is validated | A001 assumption confirmed/rejected/partially confirmed |
| Design modification | Design points needing adjustment | Recommendation display position adjustment |
| Unexpected finding | New problems/opportunities discovered during testing | New user scenario discovered |

```json
{
  "insights": [
    {
      "type": "assumption_validation",
      "assumption_id": "A001",
      "result": "confirmed|rejected|partial",
      "evidence": "Supporting/contradicting evidence"
    }
  ]
}
```

#### Step 8: Generate Improvement Suggestions [Deep]

**Priority Ranking Rules**:

1. P0 issues -> Fix immediately
2. P1 issues -> High priority
3. P2 issues -> Medium priority
4. P3 issues -> Low priority

```json
{
  "improvement_suggestions": [
    {
      "suggestion_id": "IS001",
      "suggestion": "Add a 'Why recommended' explanation next to recommended content",
      "priority": "P1",
      "problem_ref": "PC001",
      "effort_estimate": "Medium",
      "expected_impact": "High"
    }
  ]
}
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | usability issues and improvement suggestions | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full assessment + usability scoring system + priority ranking + improvement roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-design/validation-usability/`
**Output File**: usability_report.json

```json
{
  "usability_report": {
    "test_summary": {
      "test_date": "2024-01-15",
      "participant_count": 8,
      "test_duration_minutes": 60,
      "test_goals": ["Validate whether learners can quickly find suitable courses"]
    },
    "problems": [
      {
        "problem_id": "P001",
        "severity": "P1",
        "frequency": "3/8",
        "affected_element": "Course recommendation list",
        "description": "Learners cannot understand the connection between recommended courses and their learning progress",
        "evidence": ["6/8 learners expressed uncertainty about recommendation basis"]
      }
    ],
    "insights": [
      {
        "type": "assumption_validation",
        "assumption_id": "A001",
        "result": "confirmed",
        "description": "Assumption A001 partially holds"
      }
    ],
    "improvement_suggestions": [
      {
        "suggestion": "Add recommendation reason and learning progress match display on course recommendation cards",
        "priority": "P1",
        "problem_ref": "P001",
        "effort": "Medium",
        "impact": "High"
      }
    ]
  }
}
```

**Output Validation Rules**: See Output Validation Rules section below

## Decision Rules

| Situation | Handling Method |
|-----------|----------------|
| P0 issue (task cannot be completed) | Fix immediately, block release |
| Same issue encountered by 3/8+ users | Mark as high-frequency issue, prioritize handling |
| Assumption overturned | Update assumption map, adjust design direction |
| Test participants < 5 | Results for reference only, suggest supplementary testing |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Problem severity grading (P0/P1/P2/P3 grading is reasonable)
- [ ] Insight assumption linkage (Insights correspond to assumption map)

### P1 Checks (must pass for standard/deep)

- [ ] Improvement suggestions actionable (Suggestions are clear and actionable)
- [ ] Data completeness (Test data is complete without omissions)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|------------------------|-----------------|---------------|----------|
| Prototype data missing | User provides design description, generate test scripts | Lacks prototype data, test tasks may be less precise | Request user to describe page layouts and interaction flows, or upload prototype.json |
| Assumption map missing | User provides design description, generate test scripts | Lacks assumption map data, test objectives may be less focused | Request user to describe key assumptions to validate, or upload assumption-map.json |
| Both prototype and assumption map missing | User provides design description, generate test scripts | Overall confidence reduced, test scripts may be less complete | Request user to describe design and assumptions, or execute design-prototype and validation-assumption-map first |
| All upstream files missing | Prompt user to execute prior stages first, or generate test scripts based on user description | Output is only basic test framework | Request user to describe design features and test objectives, or execute design-prototype and validation-assumption-map first |

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| usability_report | object | Yes | Usability test report |
| usability_report.test_summary | object | Yes | Test summary |
| usability_report.test_summary.participant_count | integer | Yes | Participant count |
| usability_report.test_summary.test_goals | array | Yes | Test objective list |
| usability_report.problems | array | Yes | Problem list |
| usability_report.problems[].problem_id | string | Yes | Problem unique identifier |
| usability_report.problems[].severity | string | Yes | Severity (P0/P1/P2/P3) |
| usability_report.problems[].frequency | string | Yes | Occurrence frequency |
| usability_report.problems[].affected_element | string | Yes | Affected element |
| usability_report.problems[].description | string | Yes | Problem description |
| usability_report.insights | array | Yes | Insight list |
| usability_report.insights[].type | string | Yes | Insight type |
| usability_report.improvement_suggestions | array | Yes | Improvement suggestion list |
| usability_report.improvement_suggestions[].suggestion | string | Yes | Suggestion content |
| usability_report.improvement_suggestions[].priority | string | Yes | Priority |
| usability_report.improvement_suggestions[].problem_ref | string | Yes | Linked problem ID |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| Prototype change (page/interaction modification) | Test tasks, test scripts | Mark affected test tasks, suggest human confirmation on whether to update test scripts |
| Assumption map change (assumption addition/removal/score change) | Test objectives, assumption validation items | Mark affected test objectives, suggest human confirmation on whether to adjust test focus |
| MVP scope change | Test scope | Mark affected test scope, suggest human confirmation on whether to adjust test coverage |

### Downstream Notification Mechanism

| Usability Test Report Change Type | Notification Scope | Notification Method |
|----------------------------------|-------------------|---------------------|
| Problem finding addition/removal | design-prototype, interaction-spec | Mark problem changes, trigger prototype and interaction spec updates |
| Assumption validation result change | validation-assumption-map, validation-mvp | Mark validation result changes, trigger assumption map and MVP scope updates |
| Improvement suggestion change | design-prototype | Mark suggestion changes, trigger prototype update |

---

## Usage Example

**Test Execution**: Human researcher leads, 8 users participate

**AI-Assisted Output**: Structure same as the output JSON above, where `problems`/`insights`/`improvement_suggestions` arrays are populated based on actual test results, with field meanings consistent with the output validation rules.
