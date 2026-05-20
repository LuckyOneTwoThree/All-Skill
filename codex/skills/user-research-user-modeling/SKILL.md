---
name: user-research-user-modeling
description: Use when generating Persona, Empathy Map, and Journey Map based on user voice analysis and behavior analysis results. Automated user modeling pipeline. Keywords: user modeling, Persona generation, empathy map, user journey map, user profile, typical user, user role, what users look like.
metadata:
  module: "Product Discovery"
  sub-module: "User Research"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["General"]
  trigger_examples:
    - "Help me create user profiles"
    - "How to map user journeys"
    - "What kind of users are they"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output user models and behavioral characteristics"
  deep_description: "Complete modeling + behavioral sequence analysis + model validation plan + user evolution tracking"
---

# Automated User Modeling

## Core Principles

1. **Personas are hypotheses, not facts** — Personas are inference models based on data, requiring continuous validation rather than solidification; low-confidence fields must be annotated
2. **Voice + Behavior cross-validation** — What users say (VOC) and what they do (behavior) must cross-validate; contradictions are marked as hypotheses pending verification
3. **Inferences must cite sources** — Each characteristic field must be annotated with data_source (voice/behavior/survey/inferred); inferred content must not be disguised as fact
4. **Low confidence = hypothesis pending verification** — Fields with confidence < 0.5 are escalated for human verification and do not automatically enter downstream processes

## Interaction Mode

🤖→👤 **AI Suggests, Human Approves** — AI generates model drafts; human approval is required before they can be used in downstream processes

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| voice-analysis.json | JSON | Yes | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | User voice insights, pain points, themes, segments |
| behavior-analysis.json | JSON | Yes | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | Behavioral insights, funnels, paths, Aha Moments |
| survey_data | JSON | ○ | User provided | Survey data, supplementing demographic and attitudinal data |
| modeling_config | object | ○ | User provided | Modeling configuration (max Persona count, confidence threshold, journey stages, etc.) |

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

**Input Dependencies**:
- `voice-analysis.json`: Provides user voice insights, pain points, themes, segments
- `behavior-analysis.json`: Provides behavioral insights, funnels, paths, Aha Moments
- Survey data (optional): Supplements demographic and attitudinal data

---

## Execution Steps

### Step 1: User Clustering [Core]

- Integrate voice-analysis user segments with behavior-analysis behavioral segments
- Use cross-validation to determine optimal cluster count (2-6 Personas)
- Clustering dimensions: behavioral features × voice features × demographics (if available)
- Evaluate cohesion and differentiation for each cluster
- Output: Clustering results with core characteristic descriptions for each cluster

### Step 2: Feature Profile Extraction [Core]

- Extract key characteristics for each cluster:
  - **Behavioral Features**: Core usage scenarios, usage frequency, feature preferences, Aha Moments
  - **Voice Features**: Primary demands, core pain points, sentiment tendencies, representative quotes
  - **Demographics**: Age range, occupational tendencies, tech proficiency (if data available)
  - **Jobs to be Done**: Functional Job / Emotional Job / Social Job
- Annotate confidence level for each characteristic
- Annotate data source (voice / behavior / survey / inferred)
- Output: Feature profile for each cluster

### Step 3: Persona Document Generation [Core]

- Generate Persona document for each cluster, including:
  - **Name**: Memorable label (e.g., "Efficiency Pioneer", "Experience Explorer")
  - **Core Goals**: What this Persona most wants to achieve (2-3)
  - **Key Behaviors**: Typical usage behavior patterns (3-5)
  - **Core Pain Points**: Most troubling problems (2-4, citing voice-analysis data)
  - **Representative Quotes**: Quotes from real user feedback (3-5)
  - **Size Ratio**: Proportion of this Persona within the user base
  - **Confidence**: Overall confidence score (0-1)
- Annotate inferred content (characteristics without direct data support)
- Output: persona.json

### Step 4: Empathy Map Generation [Core]

- Generate Empathy Map for each Persona, including four quadrants:
  - **Says**: What the user said (quotes from voice-analysis)
  - **Thinks**: What the user might be thinking (inferred, annotated with confidence)
  - **Does**: What the user did (behavioral data from behavior-analysis)
  - **Feels**: User's emotional state (from sentiment analysis + inference, annotated with confidence)
- Annotate data source and confidence for each quadrant entry
- Output: empathy-map.json

### Step 5: Journey Map Generation [Core]

- Generate Journey Map for each Persona, including:
  - **Stages**: Awareness → Consideration → Usage → Deep Usage → Churn/Retention
  - **For each stage**:
    - User behaviors (from behavior-analysis)
    - Touchpoints (inside and outside the product)
    - Emotional arc (high/low points annotated)
    - Pain points (from voice-analysis)
    - Opportunities (pain points × unmet needs)
- Annotate confidence for emotional arc (supported by behavioral data vs. inferred)
- Output: journey-map.json

### Step 6: Confidence Assessment [Core]

- Assess overall confidence for each Persona
- Assess confidence for each output field
- Identify low-confidence fields (< 0.5) and flag for human verification
- Generate confidence report: which conclusions have strong data support, which need supplementary verification
- Output: Confidence assessment report

---

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | User models and behavioral characteristics | Core conclusions + minimum viable deliverables |
| standard | Complete deliverables (current default) | Complete deliverables, including all Step outputs |
| deep | Complete modeling + behavioral sequence analysis + model validation plan + user evolution tracking | Complete deliverables + extended analysis + deep inference |

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
| personas | array | Yes | Persona list, cannot be empty |
| personas[].id | string | Yes | Persona unique identifier |
| personas[].name | string | Yes | Persona name |
| personas[].core_goals | array | Yes | Core goals list, each item must contain goal, confidence, data_source |
| personas[].core_goals[].data_source | string | Yes | Data source enum: voice/behavior/survey/inferred |
| personas[].core_goals[].confidence | number | Yes | Goal confidence, 0-1 |
| personas[].key_behaviors | array | Yes | Key behaviors list, each item must contain behavior, confidence, data_source |
| personas[].key_behaviors[].data_source | string | Yes | Data source enum: voice/behavior/survey/inferred |
| personas[].core_pain_points | array | Yes | Core pain points list, each item must contain pain_point, severity, confidence, data_source |
| personas[].core_pain_points[].severity | string | Yes | Pain point severity enum: P0/P1/P2/P3 |
| personas[].core_pain_points[].evidence_ref | string | Yes | Evidence reference source |
| personas[].representative_quotes | array | Yes | Representative quotes list, ≥3 per Persona |
| personas[].size_ratio | number | Yes | Size ratio, 0-1 |
| personas[].confidence | number | Yes | Persona overall confidence, 0-1 |
| personas[].jobs_to_be_done.functional_job | object | Yes | Functional Job, must contain description, confidence |
| personas[].jobs_to_be_done.emotional_job | object | Yes | Emotional Job, must contain description, confidence |
| personas[].jobs_to_be_done.social_job | object | Yes | Social Job, must contain description, confidence |
| personas[].low_confidence_fields | string[] | Yes | Low confidence fields list |
| metadata.analysis_timestamp | string | Yes | Analysis timestamp |
| metadata.input_sources | string[] | Yes | Input sources list |
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
| empathy_maps | array | Yes | Empathy map list, cannot be empty |
| empathy_maps[].persona_id | string | Yes | Associated Persona ID |
| empathy_maps[].persona_name | string | Yes | Associated Persona name |
| empathy_maps[].says | array | Yes | Says quadrant, each item must contain content, source, confidence, ≥2 entries |
| empathy_maps[].thinks | array | Yes | Thinks quadrant, each item must contain content, inference_basis, confidence, ≥2 entries |
| empathy_maps[].does | array | Yes | Does quadrant, each item must contain content, source, confidence, ≥2 entries |
| empathy_maps[].feels | array | Yes | Feels quadrant, each item must contain emotion, intensity, inference_basis, confidence, ≥2 entries |

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
    "journey_maps": {"type": "array", "description": "User journey map list, including stages, emotional arcs, and opportunities"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| journey_maps | array | Yes | Journey map list, cannot be empty |
| journey_maps[].persona_id | string | Yes | Associated Persona ID |
| journey_maps[].persona_name | string | Yes | Associated Persona name |
| journey_maps[].stages | array | Yes | Journey stages list, must cover core stages |
| journey_maps[].stages[].stage_name | string | Yes | Stage name |
| journey_maps[].stages[].user_behaviors | string[] | Yes | User behaviors list |
| journey_maps[].stages[].touchpoints | string[] | Yes | Touchpoints list |
| journey_maps[].stages[].emotion_score | number | Yes | Emotion score |
| journey_maps[].stages[].emotion_confidence | number | Yes | Emotion confidence, 0-1 |
| journey_maps[].stages[].pain_points | string[] | Yes | Pain points list |
| journey_maps[].stages[].opportunities | string[] | Yes | Opportunities list |
| journey_maps[].emotional_arc | object | Yes | Emotional arc, must contain high_points, low_points, overall_trend |

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
| Persona overall confidence < 0.5 | Escalate to human verification, mark as "requires human confirmation", do not automatically enter downstream processes |
| Emotional Job inference confidence < 0.5 | Escalate to human verification, mark as "emotional need inference pending confirmation" |
| Social Job inference confidence < 0.5 | Escalate to human verification, mark as "social need inference pending confirmation" |
| Insufficient differentiation between two Personas (feature overlap > 70%) | Merge into 1 Persona or mark as "requires human judgment on whether to split" |
| Clustering quality score < 0.4 | Mark as "poor clustering quality", suggest adjusting clustering parameters or supplementing data |

---

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] At least 1 Persona with confidence ≥ 0.7 (satisfied)
- [ ] Each Persona has data support (each field annotated with data source)

### P1 Checks (must pass for standard/deep)

- [ ] Differentiation between Personas (feature overlap < 70%)
- [ ] Representative quotes (≥ 3 quotes per Persona)
- [ ] Empathy Map four quadrants complete (≥ 2 entries per quadrant)
- [ ] Journey Map stages complete (covers core stages)
- [ ] All outputs annotated with confidence (100%)

### P2 Checks (only deep must pass)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| voice-analysis.json | Infer Personas based on user-described target user characteristics, annotate "lacking voice data support" | Persona voice features and pain points are based on inference, representative_quotes missing, core_pain_points confidence reduced | Request user to provide user feedback text or upload voice-analysis.json file |
| behavior-analysis.json | Infer Personas based on user-described user behaviors, annotate "lacking behavioral data support" | Persona behavioral features and Aha Moments are based on inference, key_behaviors confidence reduced, Journey Map behavioral data missing | Request user to provide behavioral event logs or upload behavior-analysis.json file |
| voice-analysis.json + behavior-analysis.json | User provides target user descriptions → infer Personas based on descriptions, overall confidence reduced | personas overall confidence reduced, data_source mostly inferred, low_confidence_fields increased | Request user to provide user feedback text and behavioral event logs |
| All upstream files missing | Prompt user to execute prior stages first, or perform lightweight Persona inference based on user verbal descriptions | Output is purely inferred Personas, confidence_overall capped at 0.3, all fields annotated as inferred | Request user to provide target user characteristic descriptions, behavioral patterns, and core pain points |
| If user does not provide survey_data | Skip steps related to this input, Persona demographic information is based on inference, annotate "lacking survey data" | Demographic fields data_source is inferred, confidence reduced | Request user to provide user survey data (including demographics, usage habits, etc.) |
| If user does not provide modeling_config | Skip steps related to this input, use default modeling configuration (max Personas: 4, confidence threshold: 0.5) | Uses default configuration, Persona count and threshold may not be optimal | Request user to provide modeling parameters such as max Persona count, confidence threshold, etc. |

## Data Acquisition Instructions

This Skill requires user voice analysis and behavior analysis data. Please provide via one of the following methods:
  1. Directly paste user description text (target user characteristics, behavioral patterns, etc.)
  2. Upload voice-analysis.json / behavior-analysis.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact

| Upstream Skill | Change Type | Impact Scope | Response Action |
|-----------|---------|---------|---------|
| user-research-voice-analysis | voice-analysis.json structure change | User segments, pain points, theme data format changes | Check input field mapping, adapt to new structure, mark as "upstream data format anomaly" if incompatible |
| user-research-voice-analysis | voice-analysis.json content update | Pain point severity, sentiment distribution, segment result changes | Re-execute clustering and Persona generation, annotate "rebuilt based on updated data" |
| user-research-behavior-analysis | behavior-analysis.json structure change | Behavioral segments, Aha Moments, feature usage data format changes | Check input field mapping, adapt to new structure, mark as "upstream data format anomaly" if incompatible |
| user-research-behavior-analysis | behavior-analysis.json content update | Funnel, path, anomaly detection result changes | Re-execute clustering and Persona generation, annotate "rebuilt based on updated data" |

### Downstream Notification Mechanism

| Downstream Skill | Notification Trigger | Notification Method | Notification Content |
|-----------|------------|---------|---------|
| user-research-interview-assist | persona.json update completed | Write to output file | Notify Persona data is ready, can be used for interview script design |
| user-research-report | persona.json / empathy-map.json / journey-map.json update completed | Write to output file | Notify user modeling data is ready, can be used for report generation |
