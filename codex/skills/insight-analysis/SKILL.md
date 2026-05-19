---
name: insight-analysis
description: "Use when analyzing user needs and prioritizing requirements. Integrates JTBD, requirement layering, 5Whys root cause, KANO classification, and priority scoring. Keywords: need insight, JTBD, 5Whys, KANO, priority scoring, requirement analysis."
metadata:
  module: "Product Discovery"
  sub-module: "Need Insight"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me analyze user needs"
    - "Too many requirements, help me prioritize"
    - "Analyze requirements using the KANO model"
    - "Uncover deep user needs"
    - "What tasks do users really want to accomplish"
execution_depth:
  default: standard
  quick_description: "Output key insights and evidence only"
  deep_description: "Full analysis + cross-source validation + insight priority matrix + insight application roadmap"
---

# Insight Analysis -- Need Insight Analysis

## Core Principles

1. **Requirements != Problems** -- Users describe solutions, not problems themselves. Decompose first (requirement-layers), then analyze (jtbd/5whys), avoiding staying at surface-level requirements
2. **Tasks over solutions** -- Users expressing "want XX feature" is a solution, not a task. JTBD must uncover "what the user wants to accomplish with this feature"
3. **Phenomenon-driven, not assumption-driven** -- 5Whys starts from observable problem phenomena; each layer of questioning must anchor to the previous answer; jumping inferences are prohibited
4. **Classification based on user reactions, not product attributes** -- KANO classification is based on "user reactions to the presence or absence of a feature," not "the technical complexity of the feature itself"
5. **Multi-dimensional independent contribution** -- Pain intensity, frequency, and solvability each independently contribute to the score; weighted sum is used instead of multiplication to avoid extreme values
6. **KANO is a bonus, not a multiplier** -- KANO classification adjusts the base score as an additive coefficient; it does not make other dimensions' contributions completely disappear
7. **Unconfirmed dimensions explicitly marked** -- Solvability defaults to 3 (medium); requirements without technical confirmation have overall score confidence forced to low

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User feedback data | JSON | Yes | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | User voice and sentiment analysis data |
| Behavior analysis data | JSON | Yes | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | Behavior patterns and pain point data |
| Original requirement list | JSON | No | User provided | User voice, stakeholder requirements, data anomalies, and other original requirements |

## Execution Steps

### Step 1: Parallel Insight (JTBD + Requirement Layering) [Core]

Execute JTBD analysis and requirement three-layer model decomposition in parallel.

#### 1a: JTBD Analysis

Extract functional, emotional, and social layers of Jobs from user feedback and behavior data.

**Step 1a-1: Functional Job Extraction**

- Scan user quotes, match task intent patterns
- Extract high-frequency behavioral goals from behavior data, infer tasks users are trying to accomplish
- Intent pattern library:

| Pattern Category | Matching Pattern | Inference Direction |
|----------|----------|----------|
| Direct expression | "I want...", "Can it...", "Need...", "Help me...", "Hope..." | Directly extract as Functional Job |
| Pain point inference | "Too slow", "Too complicated", "Inconvenient", "Hard to use" | Infer user wants to accomplish something efficiently/conveniently |
| Behavioral goal | High-frequency operation paths, repeated behavioral patterns | Infer behavioral goals user is trying to achieve |
| Competitor comparison | "Product XX can...", "Why can't you..." | Extract expected functional capabilities |
| Scenario description | "Every time I do XX...", "In XX scenario..." | Extract scenario-based functional requirements |

- For each Functional Job, annotate frequency and sentiment intensity

**Step 1a-2: Emotional Job Inference**

- Infer emotional needs from negative feedback
- Emotion mapping rule library:

| Negative Expression Pattern | Emotional Need Direction | Confidence Baseline |
|-------------|-------------|-----------|
| "Too troublesome"/"Too complex"/"Too many steps" | Desire for ease/effortlessness | 0.8 |
| "Worried"/"Concerned"/"Afraid of mistakes" | Desire for security/certainty | 0.75 |
| "Anxious"/"Rushed"/"Running out of time" | Desire for control/efficiency | 0.75 |
| "Ignored"/"Nobody responds"/"No feedback" | Desire for recognition/attention | 0.7 |
| "Too slow"/"Waiting too long"/"Slow response" | Desire for instant feedback/fluency | 0.8 |
| "Don't understand"/"Don't know how to use" | Desire for clarity/simplicity/ease of understanding | 0.75 |

- Confidence adjustment: Single piece of evidence x0.7, 2-3 pieces x0.85, 4+ pieces x1.0

**Step 1a-3: Social Job Inference**

- Extract expressions involving others' evaluations, social relationships, group belonging
- Social mapping rule library:

| Social Expression Pattern | Social Need Direction | Confidence Baseline |
|-------------|-------------|-----------|
| "Colleagues are using it"/"Others are using it too" | Social identity/belonging | 0.7 |
| "Leadership requires"/"Company policy" | Compliance/authority obedience | 0.8 |
| "Industry standard"/"Competitors all have it" | Industry identity/competitiveness | 0.7 |
| "Recommend to friends"/"Share with colleagues" | Social currency/desire to share | 0.7 |

- Confidence adjustment rules same as Emotional Job

#### 1b: Requirement Three-Layer Model Decomposition

Decompose original requirements into surface requirements, behavioral requirements, and essential requirements.

**Step 1b-1: Surface Requirement Extraction**

- Read original requirements one by one, preserving original expressions
- Confidence = 1.0 (direct quote)

**Step 1b-2: Behavioral Requirement Inference**

- Inference patterns:
  - `"Hope to add XX feature"` -> Scenario: Need to accomplish YY in XX scenario -> Behavior: Currently substituting via ZZ method
  - `"Need to support XX"` -> Scenario: Cannot accomplish YY under XX conditions -> Behavior: Switch to competitor or handle manually
  - `"XX is too slow/laggy"` -> Scenario: Experience hindered during high-frequency XX operation -> Behavior: Reduce usage frequency or find alternatives
  - `"Can't find XX"` -> Scenario: Information architecture unclear causing disorientation -> Behavior: Repeated searching or asking others for help
  - `"XX operation is too complex"` -> Scenario: Too many steps in task flow -> Behavior: Skip non-essential steps or abandon usage
  - `"Hope XX can be automatic"` -> Scenario: Repetitive operations consuming energy -> Behavior: Manual execution with frustration
  - `"XX data is inaccurate"` -> Scenario: Decision relies on data but data is unreliable -> Behavior: Cross-verify or delay decisions
- Confidence range: 0.7-0.9

**Step 1b-3: Essential Requirement Inference**

- Inference patterns:
  - `"Batch export"` -> Reduce repetitive labor -> Pursuit of efficiency and achievement
  - `"Multi-language support"` -> Serve overseas customers -> Pursuit of business expansion and competitiveness
  - `"Real-time notifications"` -> Don't want to miss information -> Pursuit of control and security
  - `"Simplify operations"` -> Reduce cognitive load -> Pursuit of ease and autonomy
  - `"Data accuracy"` -> Avoid decision errors -> Pursuit of certainty and trust
  - `"Personalized customization"` -> Adapt to own workflow -> Pursuit of autonomy and belonging
  - `"Collaboration features"` -> Reduce communication costs -> Pursuit of social connection and team identity
- Confidence range: 0.4-0.7
- Validation flag: Essential requirement confidence < 0.5 -> `validation_needed: true`, Behavioral requirement confidence < 0.7 -> `validation_needed: true`

### Step 2: Root Cause Deep Dive (5Whys) [Core]

Conduct root cause deep dive on key pain points or problem phenomena.

**Round 1**: Based on problem phenomena, generate top 3 cause hypotheses, sorted by likelihood, each cause annotated with data support level and confidence

**Round 2-N**: Ask why about the top 1 cause from the previous round, generate top 3 sub-causes

**Multi-path branching**: When the confidence gap between top 1 and top 2 causes in the previous round is < 0.15, track both causal chains simultaneously

**Termination conditions** (stop when any is met):

| Condition | Description |
|---|---|
| Reached 5th layer | 5 rounds of questioning completed; deeper inferences lack credibility |
| Cause has reached indivisible root cause | Such as "system architecture limitations", "organizational process issues" that cannot be further refined |
| Consecutive 2 layers with confidence < 0.3 | Inference chain lacks credibility; human intervention needed |
| Actionable improvement point found | Root cause is clear and can be converted to specific action |

### Step 3: Requirement Classification (KANO) [Core]

Classify functional requirements using the KANO model.

**Step 3-1: Feature-Feedback Association**

- Matching rules: Exact feature name match, feature description keyword match (match degree > 0.7), feature alias match in user feedback
- Calculation metrics: Positive mention rate, negative mention rate, mention frequency, average sentiment intensity, usage depth correlation

**Step 3-2: Classification Rules**

| Category | Condition | Meaning |
|---|---|---|
| Must-be | Negative mention rate > 60% AND mention frequency > 5% | Strong dissatisfaction when absent, taken for granted when present |
| One-dimensional | Negative mention rate 30%-60% AND positively correlated with usage depth (correlation > 0.3) | Better implementation leads to higher satisfaction |
| Attractive | Positive mention rate > 60% AND mention frequency < 5% | Exceeds expectations bringing delight; absence causes no dissatisfaction |
| Indifferent | Mention frequency < 1% AND average sentiment intensity < 2 | Users don't care about presence or absence |

**Industry threshold adaptation rules**:

| Industry/Stage | Adaptation Rule | Adjustment Description |
|---|---|---|
| B2B SaaS | Must-be threshold lowered: negative mention rate > 50% qualifies as must-be | B2B users have lower tolerance for missing basic features |
| B2C Consumer | Attractive threshold raised: positive mention rate > 70% required for attractive | B2C users are more likely to give positive feedback |
| Early-stage product | Overall thresholds relaxed: lower judgment thresholds when data is insufficient (confidence 0.5 sufficient for classification) | Limited early-stage data |
| Mature product | Strict thresholds: standard thresholds when data is sufficient; confidence < 0.7 must be escalated | Mature products have sufficient data |

**Step 3-3: Boundary Case Handling**

- Classification confidence < 0.7: Mark as "pending human judgment"
- Different classifications across user groups: Annotate classification results by user group
- Reverse type: Positive mention rate < 10% AND negative mention rate > 70%, mark as "Reverse"
- No feedback data: Mark as "insufficient data"

### Step 4: Priority Scoring [Core]

Perform weighted priority scoring and sorting on the requirement list.

**Scoring function**:

- Base score = 0.35 x Pain intensity(1-5) + 0.30 x Frequency weight(1-5) + 0.35 x Solvability(1-5)
- KANO bonus = Base score x (KANO coefficient - 1)
- Priority score = Base score + KANO bonus

**KANO coefficient mapping**:

| KANO Category | Coefficient | Bonus Effect |
|---|---|---|
| Must-be | 1.5 | Base score +50% |
| One-dimensional | 1.0 | No bonus |
| Attractive | 0.8 | Base score -20% |
| Indifferent | 0.2 | Base score -80% |
| Reverse | 0.0 | Base score zeroed |

**Scoring rules for each dimension**:

Pain intensity (1-5 points):

| Score | Condition |
|---|---|
| 5 | Sentiment intensity >= 4 AND 5Whys root cause confirmed |
| 4 | Sentiment intensity >= 3 OR 5Whys root cause confirmed |
| 3 | Sentiment intensity = 2-3 AND negative feedback present |
| 2 | Sentiment intensity = 1-2 AND sparse feedback |
| 1 | No negative feedback or sentiment intensity < 1 |

Frequency weight (1-5 points):

| Score | Condition |
|---|---|
| 5 | Affected user proportion > 30% OR mention frequency > 10% |
| 4 | Affected user proportion 20-30% OR mention frequency 5-10% |
| 3 | Affected user proportion 10-20% OR mention frequency 2-5% |
| 2 | Affected user proportion 5-10% OR mention frequency 1-2% |
| 1 | Affected user proportion < 5% OR mention frequency < 1% |

Solvability (1-5 points):

| Score | Condition |
|---|---|
| 5 | Mature technical solution, deliverable in 1 iteration |
| 4 | Feasible technical solution, deliverable in 2-3 iterations |
| 3 | Technical solution requires research, 3-5 iterations |
| 2 | Technical solution is challenging, requires cross-team collaboration |
| 1 | Technical solution uncertain or depends on external conditions |

> **Note**: Solvability requires technical team input; default value is 3 (medium), marked as "pending technical confirmation"; overall score confidence for this requirement is downgraded to low

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | key insights and evidence only | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full analysis + cross-source validation + insight priority matrix + insight application roadmap | Full deliverables + extended analysis + deep simulation |

## Output

Output path: `output/pm-discovery/insight-analysis/`

Output files: insight-analysis.json + insight-analysis.md

### Output Schema

```json
{
  "type": "object",
  "required": ["jtbd", "requirement_layers", "5whys", "kano", "priority_scoring", "metadata"],
  "properties": {
    "jtbd": {
      "type": "object",
      "required": ["jobs", "summary"],
      "properties": {
        "jobs": {"type": "array", "description": "Job list, see output validation rules -> jtbd validation"},
        "summary": {"type": "object", "description": "Statistical summary, containing total_jobs and by_type"}
      }
    },
    "requirement_layers": {
      "type": "object",
      "required": ["requirement_layers"],
      "properties": {
        "requirement_layers": {"type": "array", "description": "Requirement three-layer decomposition list, see output validation rules -> requirement_layers validation"}
      }
    },
    "5whys": {
      "type": "object",
      "required": ["chains", "root_cause", "actionable_fix"],
      "properties": {
        "chains": {"type": "array", "description": "Causal chain list, see output validation rules -> 5whys validation"},
        "root_cause": {"type": "string"},
        "actionable_fix": {"type": "object", "description": "Actionable improvement suggestions, containing description/effort/impact/suggested_metrics"}
      }
    },
    "kano": {
      "type": "object",
      "required": ["kano_classification", "boundary_cases", "summary"],
      "properties": {
        "kano_classification": {"type": "array", "description": "KANO classification list, see output validation rules -> kano validation"},
        "boundary_cases": {"type": "array"},
        "summary": {"type": "object"}
      }
    },
    "priority_scoring": {
      "type": "object",
      "required": ["priority_list", "scoring_summary", "priority_thresholds"],
      "properties": {
        "priority_list": {"type": "array", "description": "Priority list, see output validation rules -> priority_scoring validation"},
        "scoring_summary": {"type": "object"},
        "priority_thresholds": {"type": "object"}
      }
    },
    "metadata": {"type": "object", "description": "Metadata, containing version, timestamp, and source files"}
  }
}
```

### Output Validation Rules

> Type information is in the Output Schema above; the table below only lists required flags and constraint conditions ("--" indicates no additional constraints).

#### jtbd Validation

| Field Path | Required | Constraint |
|----------|------|----------|
| `jtbd.jobs` | Yes | Cannot be empty |
| `jtbd.jobs[].type` | Yes | enum: functional, emotional, social |
| `jtbd.jobs[].job` | Yes | Cannot be empty |
| `jtbd.jobs[].frequency` | Yes | -- |
| `jtbd.jobs[].evidence` | Yes | Cannot be empty |
| `jtbd.jobs[].confidence` | Yes | Range 0-1.0 |
| `jtbd.jobs[].pain_with_current` | No | -- |
| `jtbd.jobs[].pain_level` | No | enum: high, medium, low |
| `jtbd.summary.total_jobs` | Yes | -- |
| `jtbd.summary.by_type` | Yes | -- |

#### requirement_layers Validation

| Field Path | Required | Constraint |
|----------|------|----------|
| `requirement_layers.requirement_layers` | Yes | Cannot be empty |
| `requirement_layers.requirement_layers[].id` | Yes | Unique |
| `requirement_layers.requirement_layers[].surface.content` | Yes | Preserve original expression |
| `requirement_layers.requirement_layers[].surface.confidence` | Yes | Must equal 1.0 |
| `requirement_layers.requirement_layers[].behavioral.content` | Yes | Contains scenario + behavior description |
| `requirement_layers.requirement_layers[].behavioral.confidence` | Yes | Range 0.7-0.9 |
| `requirement_layers.requirement_layers[].behavioral.inference_basis` | Yes | Cannot be empty |
| `requirement_layers.requirement_layers[].essential.content` | Yes | Describes underlying motivation |
| `requirement_layers.requirement_layers[].essential.confidence` | Yes | Range 0.4-0.7 |
| `requirement_layers.requirement_layers[].essential.inference_basis` | Yes | Cannot be empty |
| `requirement_layers.requirement_layers[].validation_needed` | Yes | Must be true when essential requirement confidence < 0.5 or behavioral requirement confidence < 0.7 |
| `requirement_layers.summary.total` | Yes | -- |

#### 5whys Validation

| Field Path | Required | Constraint |
|----------|------|----------|
| `5whys.chains` | Yes | Length >= 1 |
| `5whys.chains[].path_id` | Yes | -- |
| `5whys.chains[].round` | Yes | -- |
| `5whys.chains[].question` | Yes | -- |
| `5whys.chains[].answer` | Yes | -- |
| `5whys.chains[].evidence` | Yes | -- |
| `5whys.chains[].confidence` | Yes | Range 0-1.0 |
| `5whys.chains[].data_support` | Yes | enum: high, medium, low |
| `5whys.root_cause` | Yes | Non-empty |
| `5whys.actionable_fix.description` | Yes | -- |
| `5whys.actionable_fix.effort` | Yes | enum: low, medium, high |
| `5whys.actionable_fix.impact` | Yes | enum: low, medium, high |
| `5whys.actionable_fix.suggested_metrics` | Yes | -- |

#### kano Validation

| Field Path | Required | Constraint |
|----------|------|----------|
| `kano.kano_classification` | Yes | Cannot be empty |
| `kano.kano_classification[].feature_id` | Yes | -- |
| `kano.kano_classification[].category` | Yes | Must be one of must-be/one-dimensional/attractive/indifferent/reverse/insufficient_data |
| `kano.kano_classification[].confidence` | Yes | Range 0-1 |
| `kano.kano_classification[].evidence` | Yes | Contains 5 metrics |
| `kano.kano_classification[].review_period` | Yes | -- |
| `kano.boundary_cases` | Yes | Those with confidence < 0.7 must be included |
| `kano.summary` | Yes | -- |

#### priority_scoring Validation

| Field Path | Required | Constraint |
|----------|------|----------|
| `priority_scoring.priority_list` | Yes | Cannot be empty |
| `priority_scoring.priority_list[].rank` | Yes | -- |
| `priority_scoring.priority_list[].requirement_id` | Yes | -- |
| `priority_scoring.priority_list[].requirement_name` | Yes | -- |
| `priority_scoring.priority_list[].scores.pain_intensity.score` | Yes | Range 1-5 |
| `priority_scoring.priority_list[].scores.frequency_weight.score` | Yes | Range 1-5 |
| `priority_scoring.priority_list[].scores.solvability.score` | Yes | Range 1-5 |
| `priority_scoring.priority_list[].scores.solvability.confirmed` | Yes | -- |
| `priority_scoring.priority_list[].scores.kano_coefficient.coefficient` | Yes | -- |
| `priority_scoring.priority_list[].scores.kano_coefficient.category` | Yes | -- |
| `priority_scoring.priority_list[].base_score` | Yes | -- |
| `priority_scoring.priority_list[].kano_bonus` | Yes | -- |
| `priority_scoring.priority_list[].total_score` | Yes | -- |
| `priority_scoring.priority_list[].score_confidence` | Yes | enum: high, medium, low |
| `priority_scoring.scoring_summary` | Yes | -- |
| `priority_scoring.priority_thresholds` | Yes | -- |

### Output JSON Example

```json
{
  "jtbd": {
    "analysis_metadata": {
      "source_files": ["voice-analysis.json", "behavior-analysis.json"],
      "total_voice_entries": 0,
      "total_behavior_entries": 0,
      "analysis_timestamp": "ISO8601"
    },
    "jobs": [
      {
        "type": "functional",
        "job": "Quickly complete form filling",
        "frequency": 12,
        "current_solution": "Manually fill in each field",
        "pain_with_current": "Repetitive labor, time-consuming and error-prone",
        "confidence": 1.0,
        "evidence": ["User interview #23", "Behavior data - form abandonment rate 35%"],
        "sentiment_intensity": 4
      }
    ],
    "summary": {
      "total_jobs": 3,
      "by_type": { "functional": 1, "emotional": 1, "social": 1 }
    }
  },
  "requirement_layers": {
    "analysis_metadata": {
      "source": "Original requirement list",
      "total_requirements": 2,
      "analysis_timestamp": "ISO8601"
    },
    "requirement_layers": [
      {
        "id": "REQ-001",
        "source": "User feedback",
        "surface": { "content": "Hope to add batch export feature", "confidence": 1.0 },
        "behavioral": { "content": "Operations staff in monthly report scenario need to export multiple reports at once; currently can only export one by one", "confidence": 0.85, "inference_basis": "User feedback frequency 8 times + behavior data: abnormal average dwell time on report export page" },
        "essential": { "content": "Pursuit of work efficiency, reducing repetitive labor, gaining sense of achievement", "confidence": 0.6, "inference_basis": "Inferred from behavioral requirements + JTBD emotional Job cross-validation" },
        "validation_needed": true,
        "validation_reason": "Essential requirement confidence 0.6 < 0.7; recommend verification through user interviews"
      }
    ],
    "summary": { "total": 2, "needs_validation": 2, "high_confidence": 0 }
  },
  "5whys": {
    "analysis_metadata": {
      "source_files": ["jtbd.json"],
      "total_paths": 1,
      "analysis_timestamp": "ISO8601"
    },
    "phenomenon": {
      "description": "Users abandon registration process in large numbers at step 3",
      "source": "jtbd.json",
      "metrics": { "drop_off_rate": 0.35, "affected_users": 1200 }
    },
    "chains": [
      { "path_id": "main", "round": 1, "question": "Why do users abandon registration at step 3 in large numbers?", "answer": "Step 3 requires filling in too much non-essential information", "evidence": "Form has 12 fields, industry average is 5", "confidence": 0.85, "data_support": "high" }
    ],
    "root_cause": "Lack of a phased data collection strategy, treating registration as the sole data collection window",
    "actionable_fix": {
      "description": "Implement progressive data collection strategy; keep only core required fields (3-5) in registration flow",
      "effort": "medium",
      "impact": "high",
      "suggested_metrics": ["Registration completion rate increase", "Step 3 abandonment rate decrease"]
    }
  },
  "kano": {
    "analysis_metadata": {
      "source_files": ["voice-analysis.json", "requirement-layers.json"],
      "total_features": 3,
      "analysis_timestamp": "ISO8601"
    },
    "kano_classification": [
      { "feature_id": "FEAT-001", "feature_name": "Batch export", "category": "must-be", "confidence": 0.85, "evidence": { "negative_rate": 0.75, "frequency": 0.08, "positive_rate": 0.25, "usage_depth_correlation": 0.6, "avg_sentiment_intensity": 3.5 }, "review_period": "6 months" }
    ],
    "boundary_cases": [
      { "feature_id": "FEAT-002", "reason": "Frequency near attractive/one-dimensional boundary", "suggested_action": "Supplement with more user feedback data or conduct targeted questionnaire verification" }
    ],
    "summary": { "must_be": 1, "one_dimensional": 0, "attractive": 1, "indifferent": 1, "needs_judgment": 1 }
  },
  "priority_scoring": {
    "analysis_metadata": {
      "source_files": ["requirement-layers.json", "kano.json", "jtbd.json", "5whys.json"],
      "scoring_formula": "Base score (0.35xpain + 0.30xfrequency + 0.35xsolvability) + KANO bonus (base score x (coefficient - 1))",
      "weights_confirmed_by_human": false,
      "analysis_timestamp": "ISO8601"
    },
    "priority_list": [
      {
        "rank": 1,
        "requirement_id": "REQ-001",
        "requirement_name": "Batch export feature",
        "scores": {
          "pain_intensity": { "score": 4, "basis": "Sentiment intensity 4 + 5Whys root cause confirmed" },
          "frequency_weight": { "score": 4, "basis": "Mention frequency 8%, affected user proportion approximately 25%" },
          "solvability": { "score": 3, "basis": "Default value, pending technical team confirmation", "confirmed": false },
          "kano_coefficient": { "coefficient": 1.5, "category": "must-be", "confidence": 0.85 }
        },
        "base_score": 3.65,
        "kano_bonus": 1.825,
        "total_score": 5.475,
        "score_confidence": "medium"
      }
    ],
    "scoring_summary": { "total_requirements": 2, "high_priority": 0, "medium_priority": 1, "low_priority": 1, "needs_tech_confirmation": 1 },
    "priority_thresholds": { "high": "Total score >= 4.5", "medium": "Total score 2.0-4.4", "low": "Total score < 2.0" }
  },
  "metadata": {
    "version": "1.0",
    "generated_at": "2026-05-14T21:00:00Z",
    "source_files": [
      "output/pm-discovery/user-research-voice-analysis/voice-analysis.json"
    ]
  }
}
```

## Decision Rules

1. **Emotional/Social Job low confidence escalation**: Confidence < 0.5 marked as needing human verification, listed in needs_human_validation
2. **Functional Job missing**: When no Functional Job is extracted, terminate analysis and return error prompt to supplement data
3. **5Whys consecutive low confidence termination**: Consecutive 2 layers with confidence < 0.3, stop questioning, mark needs_human_validation=true
4. **5Whys multi-path branching**: When confidence gap between top 1 and top 2 causes is < 0.15, branch into two causal chains for parallel analysis
5. **KANO low confidence escalation**: Classification confidence < 0.7, mark needs_human_judgment=true, escalate to human judgment
6. **KANO reverse type marking**: Positive mention rate < 10% AND negative mention rate > 70%, mark as "reverse" type
7. **Priority scoring weights require human confirmation**: On first execution or after weight adjustment, pause scoring output and wait for human confirmation
8. **Solvability requires technical input**: When not confirmed by technical team, use default value 3, mark confirmed=false, score_confidence forced to low
9. **Reverse type features**: When KANO classification is Reverse, total score is zeroed, annotated "not recommended for implementation"
10. **Essential requirement low confidence mandatory validation**: Confidence < 0.5 must mark validation_needed=true, escalate to human verification

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] JTBD three-layer Jobs all extracted (functional/emotional/social Jobs all present)
- [ ] Each Job has data support (evidence field is non-empty)

### P1 Checks (must pass for standard/deep)

- [ ] Low-confidence Jobs marked for validation (Jobs with confidence < 0.5 are in needs_human_validation)
- [ ] Requirement three layers all decomposed (surface/behavioral/essential all have content)
- [ ] Inference basis is non-empty (inference_basis field is non-empty)
- [ ] Essential requirements marked with validation status (validation_needed field is complete)
- [ ] Causal chain is complete (Logically coherent from phenomenon to root cause)
- [ ] Root cause has data support (At least 1 evidence)
- [ ] Actionable suggestions provided (actionable_fix is non-empty, containing effort/impact/suggested_metrics)
- [ ] All functional requirements classified (kano_classification is complete)
- [ ] Boundary cases marked (Those with confidence < 0.7 are in boundary_cases)
- [ ] Classification statistics summary complete (Sum of each type in summary equals kano_classification array length)
- [ ] All requirements scored (priority_list is complete)
- [ ] Scoring results sorted by priority descending (rank field is correct)
- [ ] Score confidence level annotated (score_confidence field is complete)
- [ ] base_score and kano_bonus calculated separately (Auditable)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|----------|----------|
| voice-analysis.json | Extract JTBD and KANO classification based on user-pasted feedback text | Reduced basis for Emotional/Social Job inference, lower KANO classification confidence | Request user to paste user feedback text or upload voice-analysis.json file |
| behavior-analysis.json | Infer behavioral intent from user feedback text | Functional Jobs lack behavioral data corroboration, imprecise frequency statistics | Request user to provide event/funnel data or upload behavior-analysis.json file |
| voice-analysis.json + behavior-analysis.json | User provides feedback text -> directly extract JTBD | Overall confidence reduced, frequency is estimated | Request user to provide feedback text and requirement list, or upload voice-analysis.json / behavior-analysis.json files |
| Original requirement list | User verbally describes requirements -> directly decompose three layers | inference_basis lacks data corroboration, behavioral requirement confidence ceiling lowered to 0.7 | Request user to provide requirement list (e.g., feature requests, user stories) or upload requirements.json |
| All upstream files missing | Prompt user to execute prior stages first, or execute lightweight analysis based on user's verbal description | Output is lightweight version; JTBD only contains Functional Jobs; all KANO classifications are inferred; priority_scoring uses default values for multiple dimensions | Request user to describe product features and user needs, or execute user-research-voice-analysis and user-research-behavior-analysis first |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Data Source | Change Type | Impact Dimension | Impact Description | Response Strategy |
|-----------|----------|----------|----------|----------|
| voice-analysis.json | New feedback entries added | jtbd.jobs / kano.kano_classification | Job frequency and evidence changes, KANO classification metric changes | Annotate affected Jobs and KANO classifications; recommend human confirmation on whether re-extraction is needed |
| voice-analysis.json | Sentiment classification correction | jtbd.emotional_jobs | Emotional Job inference basis changes | Annotate affected Emotional Jobs; recommend re-evaluating confidence |
| behavior-analysis.json | Behavior pattern update | jtbd.functional_jobs / requirement_layers.behavioral | Functional Job frequency and behavioral goal changes | Annotate affected Functional Jobs, update frequency |
| Original requirement list | Requirements added/removed | requirement_layers / kano / priority_scoring | Requirement decomposition, classification, and scoring all affected | Annotate added/removed requirements, recalculate ranking |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Field | Notification Timing | Notification Content |
|-----------|----------|----------|----------|
| opportunity-definition | `jtbd.jobs` / `requirement_layers` | After JTBD or requirement layering changes | Notify Job additions/removals and requirement decomposition changes |
| design-orchestrator | `priority_scoring.priority_list` | After priority ranking changes | Notify requirements with ranking changes; recommend re-evaluating development schedule |
