---
name: user-research-user-modeling
description: "Use when generating Personas, Empathy Maps, and Journey Maps from voice analysis and behavior analysis results. Keywords: user modeling, Persona generation, empathy map, user journey map, user persona, typical user, user profile."
metadata:
  module: "Product Discovery"
  sub-module: "User Research"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me create user personas"
    - "How to map user journeys"
    - "What do our users look like"
---

# User Modeling Auto-Generation

## Core Principles

1. **Personas are hypotheses, not facts** -- Personas are inferred models based on data; they require continuous validation rather than being solidified; low-confidence fields must be annotated
2. **Voice + behavior cross-validation** -- What users say (VOC) and what they do (behavior) must cross-validate; contradictions marked as hypotheses pending validation
3. **Inferences must be source-annotated** -- Each characteristic field annotated with data_source (voice/behavior/survey/inferred); inferred content must not be disguised as fact
4. **Low confidence equals pending validation hypothesis** -- Fields with confidence < 0.5 are escalated for human validation; they do not automatically enter subsequent processes

## Interaction Mode

AI->Human **AI suggests, human approves** -- AI generates model drafts; only after human approval can they be used in subsequent processes

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| voice-analysis.json | JSON | Yes | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | User voice insights, pain points, themes, segments |
| behavior-analysis.json | JSON | Yes | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | Behavioral insights, funnels, paths, Aha Moments |
| survey_data | JSON | No | User provided | Survey data, supplementing demographic information and attitudinal data |
| modeling_config | object | No | User provided | Modeling configuration (max Persona count, confidence threshold, journey stages, etc.) |

### Input Format

```json
{
  "voice_analysis_path": "output/pm-discovery/user-research-voice-analysis/voice-analysis.json",
  "behavior_analysis_path": "output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json",
  "survey_data": {
    "available": "boolean",
    "location": "string",
    "sample_size": "number"
  },
  "modeling_config": {
    "max_personas": "number",
    "min_confidence_threshold": "number",
    "journey_stages": ["string"],
    "include_emotional_arc": "boolean"
  }
}
```

**Input dependencies**:
- `voice-analysis.json`: Provides user voice insights, pain points, themes, segments
- `behavior-analysis.json`: Provides behavioral insights, funnels, paths, Aha Moments
- Survey data (optional): Supplements demographic information and attitudinal data

---

## Execution Steps

### Step 1: User Clustering

- Integrate user segments from voice-analysis with behavioral segments from behavior-analysis
- Use cross-validation to determine optimal cluster count (2-6 Personas)
- Clustering dimensions: Behavioral characteristics x Voice characteristics x Demographics (if available)
- Evaluate cohesion and separation of each cluster
- Output: Clustering results, core characteristic description for each cluster

### Step 2: Characteristic Profile Extraction

- Extract key characteristics for each cluster:
  - **Behavioral characteristics**: Core usage scenarios, usage frequency, feature preferences, Aha Moments
  - **Voice characteristics**: Primary needs, core pain points, sentiment tendencies, representative quotes
  - **Demographics**: Age range, occupational tendencies, tech proficiency (if data available)
  - **Jobs to be Done**: Functional Job / Emotional Job / Social Job
- Annotate confidence for each characteristic
- Annotate data source (voice / behavior / survey / inferred)
- Output: Characteristic profile for each cluster

### Step 3: Persona Document Generation

- Generate Persona document for each cluster, including:
  - **Name**: Memorable label (e.g., "Efficiency Pioneer", "Experience Explorer")
  - **Core goals**: What this Persona most wants to achieve (2-3)
  - **Key behaviors**: Typical usage behavior patterns (3-5)
  - **Core pain points**: Most troubling problems (2-4, citing voice-analysis data)
  - **Representative quotes**: Quotes from real user feedback (3-5)
  - **Size ratio**: This Persona's proportion in the user base
  - **Confidence**: Overall confidence score (0-1)
- Annotate inferred content (characteristics without direct data support)
- Output: persona.json

### Step 4: Empathy Map Generation

- Generate Empathy Map for each Persona, including four quadrants:
  - **Says**: What the user said (quotes from voice-analysis)
  - **Thinks**: What the user might be thinking (inferred, annotated with confidence)
  - **Does**: What the user did (behavioral data from behavior-analysis)
  - **Feels**: User's emotional state (from sentiment analysis + inference, annotated with confidence)
- Annotate data source and confidence for each quadrant entry
- Output: empathy-map.json

### Step 5: Journey Map Generation

- Generate Journey Map for each Persona, including:
  - **Stages**: Awareness -> Consideration -> Usage -> Deep Usage -> Churn/Retention
  - **Each stage**:
    - User behaviors (from behavior-analysis)
    - Touchpoints (inside and outside the product)
    - Emotion curve (high/low points annotated)
    - Pain points (from voice-analysis)
    - Opportunities (pain points x unmet needs)
- Annotate confidence of emotion curve (behavioral data support vs. inference)
- Output: journey-map.json

### Step 6: Confidence Assessment

- Assess overall confidence for each Persona
- Assess confidence for each output field
- Identify low-confidence fields (< 0.5) and mark for human validation
- Generate confidence report: which conclusions have strong data support, which need supplementary validation
- Output: Confidence assessment report

---

## Output

### persona.json

Output file: `output/pm-discovery/user-research-user-modeling/persona.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["personas", "metadata"],
  "properties": {
    "personas": {"type": "array", "description": "Persona list, including goals, behaviors, pain points, and JTBD"},
    "metadata": {"type": "object", "description": "Metadata, including timestamp, sources, and clustering quality score"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| personas | array | Yes | Persona list, must not be empty |
| personas[].id | string | Yes | Persona unique identifier |
| personas[].name | string | Yes | Persona name |
| personas[].core_goals | array | Yes | Core goals list; each must include goal, confidence, data_source |
| personas[].core_goals[].data_source | string | Yes | Data source enum: voice/behavior/survey/inferred |
| personas[].core_goals[].confidence | number | Yes | Goal confidence, 0-1 |
| personas[].key_behaviors | array | Yes | Key behaviors list; each must include behavior, confidence, data_source |
| personas[].key_behaviors[].data_source | string | Yes | Data source enum: voice/behavior/survey/inferred |
| personas[].core_pain_points | array | Yes | Core pain points list; each must include pain_point, severity, confidence, data_source |
| personas[].core_pain_points[].severity | string | Yes | Pain point level enum: P0/P1/P2/P3 |
| personas[].core_pain_points[].evidence_ref | string | Yes | Evidence reference source |
| personas[].representative_quotes | array | Yes | Representative quotes list, >= 3 per Persona |
| personas[].size_ratio | number | Yes | Size ratio, 0-1 |
| personas[].confidence | number | Yes | Persona overall confidence, 0-1 |
| personas[].jobs_to_be_done.functional_job | object | Yes | Functional Job; must include description, confidence |
| personas[].jobs_to_be_done.emotional_job | object | Yes | Emotional Job; must include description, confidence |
| personas[].jobs_to_be_done.social_job | object | Yes | Social Job; must include description, confidence |
| personas[].low_confidence_fields | string[] | Yes | Low-confidence field list |
| metadata.analysis_timestamp | string | Yes | Analysis timestamp |
| metadata.input_sources | string[] | Yes | Input source list |
| metadata.clustering_quality_score | number | Yes | Clustering quality score, 0-1 |
| metadata.confidence_overall | number | Yes | Overall confidence, 0-1 |

```json
{
  "personas": [
    {
      "id": "string",
      "name": "string",
      "core_goals": [
        {
          "goal": "string",
          "confidence": "number",
          "data_source": "voice|behavior|survey|inferred"
        }
      ],
      "key_behaviors": [
        {
          "behavior": "string",
          "confidence": "number",
          "data_source": "voice|behavior|survey|inferred"
        }
      ],
      "core_pain_points": [
        {
          "pain_point": "string",
          "severity": "P0|P1|P2|P3",
          "confidence": "number",
          "data_source": "voice|behavior|survey|inferred",
          "evidence_ref": "string"
        }
      ],
      "representative_quotes": [
        {
          "quote": "string",
          "source": "string",
          "sentiment": "string"
        }
      ],
      "size_ratio": "number",
      "confidence": "number",
      "jobs_to_be_done": {
        "functional_job": {
          "description": "string",
          "confidence": "number"
        },
        "emotional_job": {
          "description": "string",
          "confidence": "number"
        },
        "social_job": {
          "description": "string",
          "confidence": "number"
        }
      },
      "low_confidence_fields": ["string"]
    }
  ],
  "metadata": {
    "analysis_timestamp": "string",
    "input_sources": ["string"],
    "clustering_quality_score": "number",
    "confidence_overall": "number"
  }
}
```

### empathy-map.json

Output file: `output/pm-discovery/user-research-user-modeling/empathy-map.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["empathy_maps"],
  "properties": {
    "empathy_maps": {"type": "array", "description": "Empathy map list, including Says/Thinks/Does/Feels quadrants"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| empathy_maps | array | Yes | Empathy map list, must not be empty |
| empathy_maps[].persona_id | string | Yes | Associated Persona ID |
| empathy_maps[].persona_name | string | Yes | Associated Persona name |
| empathy_maps[].says | array | Yes | Says quadrant; each must include content, source, confidence, >= 2 items |
| empathy_maps[].thinks | array | Yes | Thinks quadrant; each must include content, inference_basis, confidence, >= 2 items |
| empathy_maps[].does | array | Yes | Does quadrant; each must include content, source, confidence, >= 2 items |
| empathy_maps[].feels | array | Yes | Feels quadrant; each must include emotion, intensity, inference_basis, confidence, >= 2 items |

```json
{
  "empathy_maps": [
    {
      "persona_id": "string",
      "persona_name": "string",
      "says": [
        {
          "content": "string",
          "source": "string",
          "confidence": "number"
        }
      ],
      "thinks": [
        {
          "content": "string",
          "inference_basis": "string",
          "confidence": "number"
        }
      ],
      "does": [
        {
          "content": "string",
          "source": "string",
          "confidence": "number"
        }
      ],
      "feels": [
        {
          "emotion": "string",
          "intensity": "number",
          "inference_basis": "string",
          "confidence": "number"
        }
      ]
    }
  ]
}
```

### journey-map.json

Output file: `output/pm-discovery/user-research-user-modeling/journey-map.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["journey_maps"],
  "properties": {
    "journey_maps": {"type": "array", "description": "User journey map list, including stages, emotion curve, and opportunities"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| journey_maps | array | Yes | Journey map list, must not be empty |
| journey_maps[].persona_id | string | Yes | Associated Persona ID |
| journey_maps[].persona_name | string | Yes | Associated Persona name |
| journey_maps[].stages | array | Yes | Journey stage list; must cover core stages |
| journey_maps[].stages[].stage_name | string | Yes | Stage name |
| journey_maps[].stages[].user_behaviors | string[] | Yes | User behaviors list |
| journey_maps[].stages[].touchpoints | string[] | Yes | Touchpoints list |
| journey_maps[].stages[].emotion_score | number | Yes | Emotion score |
| journey_maps[].stages[].emotion_confidence | number | Yes | Emotion confidence, 0-1 |
| journey_maps[].stages[].pain_points | string[] | Yes | Pain points list |
| journey_maps[].stages[].opportunities | string[] | Yes | Opportunities list |
| journey_maps[].emotional_arc | object | Yes | Emotional arc; must include high_points, low_points, overall_trend |

```json
{
  "journey_maps": [
    {
      "persona_id": "string",
      "persona_name": "string",
      "stages": [
        {
          "stage_name": "string",
          "user_behaviors": ["string"],
          "touchpoints": ["string"],
          "emotion_score": "number",
          "emotion_confidence": "number",
          "pain_points": ["string"],
          "opportunities": ["string"]
        }
      ],
      "emotional_arc": {
        "high_points": ["string"],
        "low_points": ["string"],
        "overall_trend": "string"
      }
    }
  ]
}
```

---

## Decision Rules

| Condition | Action |
|------|------|
| Persona overall confidence < 0.5 | Escalate to human validation, mark "needs human confirmation"; do not automatically enter subsequent processes |
| Emotional Job inference confidence < 0.5 | Escalate to human validation, mark "emotional need inference pending confirmation" |
| Social Job inference confidence < 0.5 | Escalate to human validation, mark "social need inference pending confirmation" |
| Two Personas insufficient differentiation (characteristic overlap > 70%) | Merge into 1 Persona or mark "needs human judgment on whether to split" |
| Clustering quality score < 0.4 | Mark "poor clustering quality"; recommend adjusting clustering parameters or supplementing data |

---

## Quality Checks

| Check Item | Standard | Non-compliance Handling |
|--------|------|-----------|
| At least 1 Persona confidence >= 0.7 | Met | When no high-confidence Persona, mark "insufficient modeling"; recommend supplementing data or conducting interviews |
| Each Persona has data support | Each field annotated with data source | When inferred field proportion > 50%, mark "insufficient data support" |
| Inter-Persona differentiation | Characteristic overlap < 70% | When overlap too high, recommend merging or re-clustering |
| Representative quotes | Each Persona >= 3 quotes | When insufficient, mark "insufficient quote support" |
| Empathy Map four quadrants complete | Each quadrant >= 2 items | Missing quadrants marked "insufficient data" |
| Journey Map stages complete | Core stages covered | Missing stages marked "data missing" |
| All outputs annotated with confidence | 100% | Fields missing confidence filled with default value 0.3 and flagged |

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|----------|
| voice-analysis.json | Infer Personas based on user's verbal description of target user characteristics, annotate "lacking voice data support" | Persona voice characteristics and pain points based on inference, representative_quotes missing, core_pain_points confidence reduced |
| behavior-analysis.json | Infer Personas based on user's verbal description of user behaviors, annotate "lacking behavioral data support" | Persona behavioral characteristics and Aha Moments based on inference, key_behaviors confidence reduced, Journey Map behavioral data missing |
| voice-analysis.json + behavior-analysis.json | User provides target user descriptions -> infer Personas based on descriptions, overall confidence reduced | personas overall confidence reduced, data_source mostly inferred, low_confidence_fields increased |
| All upstream files missing | Prompt user to execute prior stages first, or execute lightweight Persona inference based on user's verbal description | Output is purely inferred Personas, confidence_overall ceiling 0.3, all fields annotated inferred |
| If user does not provide survey_data | Skip input-related steps; Persona demographic information based on inference, annotate "lacking survey data" | Demographic field data_source is inferred, confidence reduced |
| If user does not provide modeling_config | Skip input-related steps; use default modeling configuration (max Personas: 4, confidence threshold: 0.5) | Default configuration used; Persona count and threshold may be suboptimal |

## Data Acquisition Instructions

This Skill requires user voice analysis and behavior analysis data. Please provide via one of the following methods:
  1. Directly paste user description text (target user characteristics, behavioral patterns, etc.)
  2. Upload voice-analysis.json / behavior-analysis.json files
  3. Provide data file paths
- AI is not responsible for external data collection; only for analysis

---

## Upstream Change Response

### Upstream Change Impact

| Upstream Skill | Change Type | Impact Scope | Response Action |
|-----------|---------|---------|---------|
| user-research-voice-analysis | voice-analysis.json structure change | User segments, pain points, theme data format changes | Check input field mapping, adapt to new structure; mark "upstream data format anomaly" when incompatible |
| user-research-voice-analysis | voice-analysis.json content update | Pain point severity, sentiment distribution, segment result changes | Re-execute clustering and Persona generation; annotate "rebuilt based on updated data" |
| user-research-behavior-analysis | behavior-analysis.json structure change | Behavioral segments, Aha Moment, feature usage data format changes | Check input field mapping, adapt to new structure; mark "upstream data format anomaly" when incompatible |
| user-research-behavior-analysis | behavior-analysis.json content update | Funnel, paths, anomaly detection result changes | Re-execute clustering and Persona generation; annotate "rebuilt based on updated data" |

### Downstream Notification Mechanism

| Downstream Skill | Notification Trigger Condition | Notification Method | Notification Content |
|-----------|------------|---------|---------|
| user-research-interview-assist | persona.json update complete | Write to output file | Notify Persona data ready for interview script design |
| user-research-report | persona.json / empathy-map.json / journey-map.json update complete | Write to output file | Notify user modeling data ready for report generation |
