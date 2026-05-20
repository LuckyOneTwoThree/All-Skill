---
name: business-value-fit
description: "Use when evaluating the fit between value propositions and user needs. Auto-evaluates value proposition fit, assessing how well BMC value propositions match user pain points and gains. Keywords: value proposition fit, pain point coverage, gain validation, fit score, user need validation, value alignment."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Business Model Design"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "General"]
  trigger_examples:
    - "Is our value proposition right"
    - "Do users really need this feature"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Output value-market fit assessment"
  deep_description: "Full assessment + value-market fit matrix + gap analysis + optimization roadmap"
---

# Value Proposition Fit Auto-Evaluation

## Core Principles

1. **Pain Point Coverage First** -- High-frequency, high-severity pain points must be covered by value propositions; omissions trigger warnings
2. **531 Scoring Scale** -- Fit evaluation uses 5/3/1/0 four-level scoring with unified standards, no ambiguity
3. **Transparent Weighted Calculation** -- Pain weight = frequency x severity; gain weight = importance x satisfaction gap
4. **Gaps Require Action** -- Uncovered pain points and gains must include improvement recommendations, not just labels

**Execution Cycle**: Automatically triggered after Pipeline 1 (Business Model Canvas) is complete

**Core Objective**: Systematically evaluate the degree of fit between value propositions and users' actual pain points and expected gains, identifying coverage blind spots and improvement opportunities.

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| BMC Value Propositions | JSON | Yes | output/pm-strategy/business-model-canvas/bmc.json | Value propositions list, including Pain Relievers and Gain Creators |
| User Research Data | JSON | Yes | user-research-user-modeling / user-research-voice-analysis | User personas, pain points, expected gains, opportunity brief |

### Required Input

**Value Propositions from BMC (from Pipeline 1):**
```json
{
  "value_propositions": [
    {
      "proposition_id": "vp-1",
      "headline": "Value proposition headline",
      "description": "Value proposition detailed description",
      "target_segment": "segment-1",
      "pain_relievers": ["Pain point addressed 1", "Pain point addressed 2"],
      "gain_creators": ["Gain created 1", "Gain created 2"]
    }
  ]
}
```

**Exploration Phase User Research Data:**
```json
{
  "persona_summary": {
    "demographics": "Demographic characteristics",
    "behaviors": "User behavioral characteristics",
    "goals": "User goals"
  },
  "problem_statement": {
    "pains": [
      {
        "pain_id": "pain-1",
        "description": "Pain point description",
        "frequency": "Occurrence frequency",
        "severity": "Severity level",
        "urgency": "Urgency level"
      }
    ],
    "gains": [
      {
        "gain_id": "gain-1",
        "description": "Expected gain description",
        "importance": "Importance level",
        "current_satisfaction": "Current satisfaction level"
      }
    ]
  },
  "opportunity_definition": {
    "opportunity_description": "Enterprise training digitalization penetration rate only 28%, AI personalized learning demand growing 45% annually",
    "evidence": ["iResearch 2024 enterprise training market report", "State Council vocational education reform implementation plan"]
  }
}
```

## Execution Steps

### Step 1: Pain Point Alignment Assessment [Core]

**Task**: Systematically evaluate the coverage of each Pain Reliever against user pain points.

**Scoring Standard (5/3/1 scoring)**:

| Score | Meaning | Judgment Criteria |
|------|------|----------|
| 5 | Perfect coverage | Value proposition fully addresses the core of the pain point, users can significantly perceive it |
| 3 | Partial coverage | Value proposition addresses the pain point but not the core dimension, or with limited effectiveness |
| 1 | Edge coverage | Value proposition has weak association with the pain point, only indirect impact |
| 0 | Not covered | Value proposition does not address this pain point |

**Execution Logic**:
1. Iterate through each Pain Reliever
2. Match against each pain point in the problem statement
3. Determine match score based on scoring criteria
4. Calculate weighted average score (weight: frequency x severity)

**Output Format:**
```json
{
  "pain_alignment": {
    "covered_pains": [
      {
        "pain_id": "pain-1",
        "pain_description": "Training effectiveness difficult to quantify and track",
        "matched_by": ["vp-1"],
        "coverage_score": 5,
        "coverage_quality": "full/partial/edge/none",
        "notes": "AI learning report feature fully covers this pain point"
      }
    ],
    "uncovered_pains": [
      {
        "pain_id": "pain-5",
        "pain_description": "Student learning paths lack personalization",
        "frequency": "high",
        "severity": "high",
        "impact": "High-frequency high-severity pain point 'Course content disconnected from job requirements' not covered",
        "recommendation": "Recommend adding job skill graph matching feature"
      }
    ],
    "pain_coverage_summary": {
      "total_pains": 10,
      "fully_covered": 4,
      "partially_covered": 3,
      "uncovered": 3,
      "weighted_average_score": 3.2,
      "high_frequency_coverage_rate": "80%"
    }
  }
}
```

**Acceptance Criteria**:
- All Pain Relievers matched against pain points
- Each pain point has clear coverage status
- Omitted pain points include improvement recommendations

### Step 2: Gain Creation Validation [Core]

**Task**: Evaluate the match between Gain Creators and users' expected gains.

**Execution Logic**:
1. Iterate through each Gain Creator
2. Match against expected gains in the problem statement
3. Evaluate the authenticity and achievability of gain creation
4. Identify user expectations not promised

**Output Format:**
```json
{
  "gain_validation": {
    "covered_gains": [
      {
        "gain_id": "gain-1",
        "gain_description": "Training ROI quantifiable",
        "created_by": ["vp-1"],
        "coverage_status": "covered/partial/not_covered",
        "realizability": "high/medium/low",
        "notes": "AI learning report + ROI dashboard achievable, high technical maturity"
      }
    ],
    "uncovered_gains": [
      {
        "gain_id": "gain-3",
        "gain_description": "Increased student self-directed learning motivation",
        "importance": "high",
        "gap_analysis": "Users expect social learning experience but current value proposition does not address it",
        "recommendation": "Recommend including learning community feature in V2.0 planning"
      }
    ],
    "gain_summary": {
      "total_gains": 8,
      "covered": 5,
      "partial": 2,
      "uncovered": 1,
      "alignment_rate": "75%"
    }
  }
}
```

**Acceptance Criteria**:
- All Gain Creators validated
- Uncovered gains identified and importance assessed
- Achievability assessment reasonable

### Step 3: Overall Fit Score [Core]

**Task**: Synthesize pain point coverage and gain creation to calculate overall fit score.

**Weighted Average Calculation**:
```
Overall Fit Score = (Pain Alignment Score x 0.6) + (Gain Validation Score x 0.4)
```

**Score Interpretation:**
| Score Range | Meaning | Action Recommendation |
|----------|------|----------|
| 4.0-5.0 | Excellent fit | Value proposition design is sound, can proceed to next phase |
| 3.0-3.9 | Good fit | Room for improvement, recommend optimizing before proceeding |
| 2.0-2.9 | Fair fit | Notable gaps exist, value propositions need adjustment |
| 1.0-1.9 | Poor fit | Significant misalignment between value propositions and user needs |
| 0-0.9 | Severe misalignment | Value propositions need to be redesigned |

**Output Format:**
```json
{
  "overall_fit_score": 3.4,
  "score_interpretation": "Good fit",
  "score_breakdown": {
    "pain_alignment_score": 3.5,
    "pain_weight": 0.6,
    "pain_contribution": 2.1,
    "gain_validation_score": 3.25,
    "gain_weight": 0.4,
    "gain_contribution": 1.3
  },
  "coverage_rate": {
    "pain_coverage": "80%",
    "gain_coverage": "75%",
    "high_priority_coverage": "85%"
  }
}
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | value-market fit assessment | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full assessment + value-market fit matrix + gap analysis + optimization roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-strategy/business-value-fit/`

**Output File**: evaluation_report.json

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| evaluation_report.evaluation_metadata.evaluated_at | string | Yes | Evaluation timestamp |
| evaluation_report.evaluation_metadata.value_propositions_evaluated | number | Yes | Number of value propositions evaluated |
| evaluation_report.evaluation_metadata.pains_analyzed | number | Yes | Number of pain points analyzed |
| evaluation_report.evaluation_metadata.gains_analyzed | number | Yes | Number of gains analyzed |
| evaluation_report.evaluation_metadata.confidence | string | Yes | high/medium/low |
| evaluation_report.pain_alignment.covered_pains | array | Yes | Covered pain points list |
| evaluation_report.pain_alignment.covered_pains[].pain_id | string | Yes | Pain point ID, must not be empty |
| evaluation_report.pain_alignment.covered_pains[].coverage_score | number | Yes | Coverage score, 0-5 |
| evaluation_report.pain_alignment.covered_pains[].coverage_quality | string | Yes | Coverage quality, enum: full/partial/edge/none |
| evaluation_report.pain_alignment.uncovered_pains | array | Yes | Uncovered pain points list, each with recommendation |
| evaluation_report.pain_alignment.uncovered_pains[].pain_id | string | Yes | Pain point ID, must not be empty |
| evaluation_report.pain_alignment.uncovered_pains[].frequency | string | Yes | Frequency, enum: high/medium/low |
| evaluation_report.pain_alignment.uncovered_pains[].severity | string | Yes | Severity, enum: high/medium/low |
| evaluation_report.pain_alignment.uncovered_pains[].recommendation | string | Yes | Improvement suggestion, must not be empty |
| evaluation_report.pain_alignment.pain_coverage_summary | object | Yes | Coverage statistics |
| evaluation_report.pain_alignment.pain_coverage_summary.total_pains | number | Yes | Total pain points count |
| evaluation_report.pain_alignment.pain_coverage_summary.fully_covered | number | Yes | Fully covered count |
| evaluation_report.pain_alignment.pain_coverage_summary.uncovered | number | Yes | Uncovered count |
| evaluation_report.gain_validation.covered_gains | array | Yes | Covered gains list |
| evaluation_report.gain_validation.covered_gains[].gain_id | string | Yes | Gain ID, must not be empty |
| evaluation_report.gain_validation.covered_gains[].coverage_status | string | Yes | Coverage status, enum: covered/partial/not_covered |
| evaluation_report.gain_validation.covered_gains[].realizability | string | Yes | Realizability, enum: high/medium/low |
| evaluation_report.gain_validation.uncovered_gains | array | Yes | Uncovered gains list, each with recommendation |
| evaluation_report.gain_validation.uncovered_gains[].gain_id | string | Yes | Gain ID, must not be empty |
| evaluation_report.gain_validation.uncovered_gains[].importance | string | Yes | Importance, enum: high/medium/low |
| evaluation_report.gain_validation.uncovered_gains[].recommendation | string | Yes | Improvement suggestion, must not be empty |
| evaluation_report.overall_fit_score | number | Yes | Overall fit score 0-5 |
| evaluation_report.coverage_rate | object | Yes | Coverage metrics |
| evaluation_report.improvement_suggestions | array | Yes | Improvement suggestions list |
| evaluation_report.improvement_suggestions[].priority | string | Yes | Priority, enum: high/medium/low |
| evaluation_report.improvement_suggestions[].category | string | Yes | Suggestion category, enum: add_pain_coverage/enhance_gain/clarify_message/reposition |
| evaluation_report.improvement_suggestions[].description | string | Yes | Suggestion description, must not be empty |
| evaluation_report.warnings | array | Yes | Warnings list |
| evaluation_report.warnings[].warning_type | string | Yes | Warning type, e.g. high_frequency_uncovered |
| evaluation_report.warnings[].description | string | Yes | Warning description, must not be empty |
| evaluation_report.warnings[].severity | string | Yes | Severity, enum: high/medium/low |

### Complete Evaluation Report

```json
{
  "evaluation_report": {
    "evaluation_metadata": {
      "evaluated_at": "2024-06-15T14:20:00Z",
      "value_propositions_evaluated": 3,
      "pains_analyzed": 10,
      "gains_analyzed": 8,
      "confidence": "high/medium/low"
    },
    "pain_alignment": {...},
    "gain_validation": {...},
    "overall_fit_score": {...},
    "coverage_rate": {...},
    "improvement_suggestions": [
      {
        "suggestion_id": "sug-1",
        "priority": "high/medium/low",
        "category": "add_pain_coverage/enhance_gain/clarify_message/reposition",
        "description": "Add AI learning path effectiveness visualization feature to cover student progress tracking pain point",
        "expected_impact": "Pain point coverage rate increases 15%, fit score improves 0.5 points",
        "implementation_effort": "Medium, requires 2 sprint development cycles"
      }
    ],
    "warnings": [
      {
        "warning_type": "high_frequency_uncovered",
        "description": "High-frequency pain point 'Training effectiveness difficult to quantify' not covered by value proposition",
        "affected_pains": ["pain-3", "pain-7"],
        "severity": "high"
      }
    ]
  }
}
```

## Decision Rules

### Warning Trigger Rules

1. **High-Frequency Pain Point Omission Warning**:
   - Trigger condition: Pain point with frequency >=20% not covered
   - Action: Generate warning, explicitly label affected pain points
   - Severity: High

2. **High-Severity Pain Point Omission Warning**:
   - Trigger condition: Pain point coverage rate for severity=high <70%
   - Action: Generate warning, recommend priority improvement

3. **Gain Expectation Gap Warning**:
   - Trigger condition: Gain with importance=high not promised
   - Action: Generate warning, assess whether adjustment is needed

### Escalation Rules

1. **Fit Score <3.0 Escalation**:
   - Trigger condition: Overall Fit Score < 3.0
   - Action: Flag for human attention, does not block but recommends adjustment
   - Output escalation flag for human decision-makers' reference

2. **Coverage Rate <60% Escalation**:
   - Trigger condition: High-frequency pain point coverage rate < 60%
   - Action: Mandatory escalation to human approval

3. **High-Risk Assumption Identification**:
   - Trigger condition: Fit score depends on high-risk assumptions
   - Action: Label assumption risk, recommend validation plan

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] All Pain Relievers evaluated
- [ ] All Gain Creators validated

### P1 Checks (must pass for standard/deep)

- [ ] Omission list complete with no gaps
- [ ] Scoring logic consistent
- [ ] Weight settings reasonable
- [ ] Warning rules correctly triggered

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| bmc.json | User provides value propositions and user pain points -> Directly evaluate fit | Lacks BMC structured data, value propositions may be incomplete | Request user to provide product value proposition description, or upload bmc.json |
| User research data (voice-analysis / persona) | User provides value propositions and user pain points -> Directly evaluate fit | Lacks user research data, pain point frequency and severity lack empirical evidence | Request user to describe user pain points, or upload persona.json / voice-analysis.json |
| bmc.json + User research data | User provides value proposition and user pain point descriptions -> Directly evaluate fit | Overall confidence reduced, scoring lacks data anchoring | Request user to describe value propositions and pain points, or upload bmc.json / persona.json / voice-analysis.json |
| All upstream files missing | Prompt user to execute prior phases first, or evaluate fit based on user-provided value propositions and pain points | Overall confidence significantly reduced, evaluation is assumption-based only | Request user to provide product value propositions, target user pain points, and core feature descriptions |

## Data Acquisition Instructions

This Skill requires BMC and user research data, please provide through one of the following methods:
  1. Directly describe value propositions and user pain points
  2. Upload bmc.json / persona.json / voice-analysis.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| bmc.json value proposition change | Pain point alignment and gain creation validation need re-evaluation | Re-execute Step 1-3, update fit scores |
| bmc.json customer segment adjustment | Value proposition and segment group correspondence | Re-match value propositions with target users |
| persona/voice-analysis user pain point update | Pain point coverage rate and omission analysis | Re-execute Step 1, update uncovered pain points list |
| problem-statement problem statement change | Pain point and gain priority weights | Recalculate weighted scores, update overall fit assessment |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Fit score change | business-pricing, positioning-strategy | Output file version number + change summary |
| Pain point coverage rate change | business-model-canvas | Output file version number + change summary |
| Improvement suggestion addition | business-model-canvas | Output file version number + change summary |
| Warning triggered/resolved | business-pricing | Output file version number + change summary |

---

## Integration

### Integration with Pipeline 1

Pipeline 2 output will be passed to Pipeline 3 (Pricing Strategy), key transmitted content includes:
- Value proposition Fit score
- Coverage rate and omission analysis
- Improvement suggestions (may affect pricing options)

### Integration with Human Decision-Making

Evaluation results and warnings will be presented to human decision-makers for the following decisions:
- Whether value propositions need adjustment
- Whether to accept current fit level and proceed to next phase
- Priority improvement directions
