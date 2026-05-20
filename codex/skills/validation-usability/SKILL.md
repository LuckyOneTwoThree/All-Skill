---
name: validation-usability
description: Use when assisting with usability testing. Usability testing assistance tool providing AI support across pre-test, during-test, and post-test phases: generates task scripts and recruitment questionnaires before testing, and organizes data and generates insight reports after testing. Note: Actual test execution must be facilitated by a human researcher. Keywords: usability testing, task scripts, recruitment screening, problem clustering, insight extraction, user experience testing, test tasks.
metadata:
  module: "Product Ideation & Design"
  sub-module: "Solution Validation"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "Software", "General"]
  trigger_examples:
    - "How to conduct usability testing"
    - "Help me design test tasks"
    - "How to do user experience testing"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output usability issues and improvement recommendations"
  deep_description: "Complete assessment + usability scoring system + priority ranking + improvement roadmap"
---

# Usability Testing Assistance

## Core Principles

1. **User behavior is more truthful than user opinions** — Observe what users do, not what they say
2. **5 users discover 85% of problems** — Usability testing doesn't need large samples; 5-8 people can discover major issues
3. **Severity determines fix priority** — Critical issues must be fixed; minor issues can be scheduled
4. **Test reports must be actionable** — Every finding must correspond to an improvement recommendation; non-actionable findings are noise

### Basic Information

| Attribute | Value |
|------|-----|
| Pipeline ID | 15 |
| Name | Usability Testing Assistance |
| Execution Mode | 👤→🤖 Human Executes, AI Assists |
| Input | Assumption Map + MVP Features + Test Objectives |

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Usability Test Plan | object | Yes | output/pm-design/validation-assumption-map/assumption_map.json | Test objectives, assumption map, MVP features |
| Test Participants | object | Yes | User provided | Target user profile, recruitment screening criteria |
| Test Task Scenarios | object | Yes | output/pm-design/design-prototype/prototype_spec.json | Usability hypotheses to validate and task scripts |

## Execution Steps

### ⚠️ Important Note

Usability testing is the only phase that **must be facilitated by a human researcher**. AI provides auxiliary support in this process:

| Phase | Executor | AI Assistance Content |
|------|--------|------------|
| Pre-test | 👤 Preparation | Generate task scripts, recruitment questionnaires, observation record templates |
| During test | 👤 Execution | Human researcher facilitates the test |
| Post-test | 👤+🤖 | AI organizes and analyzes, human reviews and confirms |

### Pre-Test AI Assistance

#### Step 1: Define Test Objectives

Determine usability test objectives based on the assumption map:

```json
{
  "test_goals": [
    {
      "goal_id": "TG001",
      "related_assumption": "A001",
      "goal_description": "Verify whether users can successfully complete browsing recommended content"
    }
  ]
}
```

#### Step 2: Generate Task Scripts

**Rule**: Each task corresponds to a usability hypothesis to be validated

```json
{
  "task_script": [
    {
      "task_id": "T001",
      "task_description": "Find a piece of recommended content that interests you within 3 seconds",
      "related_assumption": "A002",
      "success_criteria": "Complete click within 3 seconds",
      "hints": ["Hint information (if needed)"]
    }
    // ... same structure, extensible
  ]
}
```

#### Step 3: Generate Recruitment Screening Questionnaire

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
      // ... same structure, extensible
    ],
    "target_sample_size": 8,
    "oversample_ratio": 1.25
  }
}
```

#### Step 4: Generate Observation Record Template

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
        "quotes": ["User's exact words"]
      }
    ],
    "overall_notes": "Overall observations"
  }
}
```

### Post-Test AI Assistance

#### Step 5: Test Record Structured Organization

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

#### Step 6: Automated Problem Clustering

**Clustering Dimensions**:

| Dimension | Description |
|------|------|
| Severity | Critical / Severe / Moderate / Minor |
| Frequency | High / Medium / Low |
| Affected Area | Navigation / Operation / Feedback / Content |

**Severity Definitions**:

| Level | Definition | Impact |
|------|------|------|
| Critical (P0) | Task cannot be completed | Causes user abandonment |
| Severe (P1) | Task requires significant assistance | Severely impacts efficiency |
| Moderate (P2) | Task is difficult but completed | Impacts user experience |
| Minor (P3) | Operation inconvenient but acceptable | Optimization item |

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

#### Step 7: Insight Extraction

**Three Types of Insights**:

| Type | Description | Example |
|------|------|------|
| Assumption Validation | Whether hypothesis was validated | A001 hypothesis confirmed/rejected/partially confirmed |
| Design Changes | Design points needing adjustment | Recommendation display position adjustment |
| Unexpected Findings | New problems/opportunities discovered during testing | Discovered new user scenario |

```json
{
  "insights": [
    {
      "type": "assumption_validation",
      "assumption_id": "A001",
      "result": "confirmed|rejected|partial",
      "evidence": "Supporting/contradicting evidence"
    }
    // ... same structure, extensible, type can be design_changes / unexpected_findings
  ]
}
```

#### Step 8: Generate Improvement Recommendations

**Priority Ranking Rules**:

1. P0 issues → Fix immediately
2. P1 issues → High priority
3. P2 issues → Medium priority
4. P3 issues → Low priority

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

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Usability issues and improvement recommendations | Core conclusions + minimum viable deliverables |
| standard | Complete deliverables (current default) | Complete deliverables, including all Step outputs |
| deep | Complete assessment + usability scoring system + priority ranking + improvement roadmap | Complete deliverables + extended analysis + deep inference |

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
      "test_goals": ["Verify whether learners can quickly find suitable courses"]
    },
    "problems": [
      {
        "problem_id": "P001",
        "severity": "P1",
        "frequency": "3/8",
        "affected_element": "Course recommendation list",
        "description": "Learners cannot understand the connection between recommended courses and their learning progress",
        "evidence": ["6/8 learners expressed uncertainty about the recommendation basis"]
      }
      // ... same structure, extensible
    ],
    "insights": [
      {
        "type": "assumption_validation",
        "assumption_id": "A001",
        "result": "confirmed",
        "description": "Hypothesis A001 partially confirmed"
      }
      // ... same structure, extensible, type can be design_changes / unexpected_findings
    ],
    "improvement_suggestions": [
      {
        "suggestion": "Add recommendation rationale and learning progress match display to course recommendation cards",
        "priority": "P1",
        "problem_ref": "P001",
        "effort": "Medium",
        "impact": "High"
      }
      // ... same structure, extensible
    ]
  }
}
```

**Output Validation Rules**: See output validation rules section below

## Decision Rules

| Situation | Handling |
|------|----------|
| P0 issue (task cannot be completed) | Fix immediately, block release |
| Same issue encountered by 3/8+ users | Mark as high-frequency issue, prioritize |
| Hypothesis rejected | Update assumption map, adjust design direction |
| Test participants < 5 | Results for reference only, recommend supplementary testing |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Problem severity classification (P0/P1/P2/P3 classification is reasonable)
- [ ] Insight hypothesis linkage (insights correspond to assumption map)

### P1 Checks (must pass for standard/deep)

- [ ] Improvement recommendations are actionable (recommendations are clear and actionable)
- [ ] Data completeness (test data is complete without omissions)

### P2 Checks (only deep must pass)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| Prototype data missing | User provides design description, generate test scripts | Lacking prototype data, test tasks may not be precise enough | Request user to provide design description and page screenshots or upload prototype file |
| Assumption map missing | User provides design description, generate test scripts | Lacking assumption map data, test objectives may not be focused enough | Request user to provide key assumption list or upload assumption-map file |
| Prototype + assumption map both missing | User provides design description, generate test scripts | Overall confidence reduced, test scripts may not be complete | Request user to provide design description and key assumptions |
| All upstream files missing | Prompt user to execute prior stages first, or generate test scripts based on user description | Output is only a basic test framework | Request user to provide design description, core features, and test objectives |

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| usability_report | object | Yes | Usability test report |
| usability_report.test_summary | object | Yes | Test summary |
| usability_report.test_summary.participant_count | integer | Yes | Participant count |
| usability_report.test_summary.test_goals | array | Yes | Test objectives list |
| usability_report.problems | array | Yes | Problem list |
| usability_report.problems[].problem_id | string | Yes | Problem unique identifier |
| usability_report.problems[].severity | string | Yes | Severity (P0/P1/P2/P3) |
| usability_report.problems[].frequency | string | Yes | Occurrence frequency |
| usability_report.problems[].affected_element | string | Yes | Affected element |
| usability_report.problems[].description | string | Yes | Problem description |
| usability_report.insights | array | Yes | Insight list |
| usability_report.insights[].type | string | Yes | Insight type |
| usability_report.improvement_suggestions | array | Yes | Improvement recommendation list |
| usability_report.improvement_suggestions[].suggestion | string | Yes | Recommendation content |
| usability_report.improvement_suggestions[].priority | string | Yes | Priority |
| usability_report.improvement_suggestions[].problem_ref | string | Yes | Linked problem ID |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Prototype change (page/interaction modification) | Test tasks, test scripts | Annotate affected test tasks, recommend human confirmation on whether to update test scripts |
| Assumption map change (assumptions added/removed, score changes) | Test objectives, hypothesis validation items | Annotate affected test objectives, recommend human confirmation on whether to adjust test focus |
| MVP scope change | Test scope | Annotate affected test scope, recommend human confirmation on whether to adjust test coverage |

### Downstream Notification Mechanism

| Usability Test Report Change Type | Notification Scope | Notification Method |
|----------------------|----------|----------|
| Problem discovery addition/removal | design-prototype, interaction-spec | Mark problem change, trigger prototype and interaction spec update |
| Hypothesis validation result change | validation-assumption-map, validation-mvp | Mark validation result change, trigger assumption map and MVP scope update |
| Improvement recommendation change | design-prototype | Mark recommendation change, trigger prototype update |

---

## Usage Example

**Test Execution**: Human researcher facilitates, 8 users participate

**AI-Assisted Output**: Structure is the same as the output JSON above, where `problems`/`insights`/`improvement_suggestions` arrays are populated based on actual test results, with field meanings consistent with the output validation rules.
