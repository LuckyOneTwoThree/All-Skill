---
name: user-research-interview-assist
description: Use when there is a need to design user interview scripts, extract insights after conducting interviews, or perform cross-interview clustering analysis. Interview assistance pipeline. Keywords: user interview, interview script, interview insights, semi-structured interview, qualitative research assistance, interview outline, interview organization, what to talk about with users.
metadata:
  module: "Product Discovery"
  sub-module: "User Research"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["General"]
  trigger_examples:
    - "Help me prepare an interview outline"
    - "How to organize insights after interviews"
    - "How to conduct user interviews"
  interaction_mode: "human_ai_collaborate"
execution_depth:
  default: standard
  quick_description: "Directly output interview outline and key questions"
  deep_description: "Complete assistance + interview strategy design + follow-up logic tree + data analysis framework"
---

# Interview Assistance

## Core Principles

1. **Human-Led, AI-Assisted** — Interview execution is human-led; AI is responsible for script design, transcription analysis, and insight extraction, and cannot replace human judgment
2. **Scripts Serve Objectives, Not the Other Way Around** — Interview scripts are tools for validating hypotheses; humans can deviate from the script to follow up based on on-site judgment; flexibility takes priority over completeness
3. **Follow-up Questions Are More Valuable Than Main Questions** — Main questions open topics, follow-up questions dig deeper; scripts must include follow-up strategies and probe prompts
4. **Interviews Are for Validation, Not Exploration** — Interview objectives come from hypotheses discovered in existing data; each interview must answer "what was validated / what was refuted"

## Interaction Mode

👤→🤖 **Human-AI Collaboration** — Human leads interview execution, AI handles script design, transcription analysis, and insight extraction

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| persona.json | JSON | ○ | output/pm-discovery/user-research-user-modeling/persona.json | User persona data, used for targeting interview subjects and script design |
| research_objectives | object | Yes | User provided | Research objectives, defining the hypotheses to validate and directions to explore in this interview |
| interview_config | object | Yes | User provided | Interview configuration (target count, duration, format, recording availability) |
| voice-analysis.json | JSON | ○ | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | Voice of customer analysis data |
| behavior-analysis.json | JSON | ○ | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | Behavior analysis data |

### Input Format

```json
{
  "persona_path": "output/pm-discovery/user-research-user-modeling/persona.json",
  "research_objectives": {
    "primary_questions": ["string"],
    "hypotheses_to_validate": ["string"],
    "areas_to_explore": ["string"]
  },
  "interview_config": {
    "target_count": "number",
    "duration_minutes": "number",
    "format": "in_person|video|phone",
    "recording_available": "boolean"
  },
  "existing_analysis": {
    "voice_analysis_path": "output/pm-discovery/user-research-voice-analysis/voice-analysis.json",
    "behavior_analysis_path": "output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json"
  }
}
```

**Input Dependencies**:
- `persona.json` (if generated): Used for targeting interview subjects and script design
- Research objectives (human input): Define the hypotheses to validate and directions to explore in this interview
- voice-analysis.json / behavior-analysis.json: Provide data findings to be validated

---

## Execution Steps

### Phase 1: Pre-Interview Preparation (AI generates, human confirms)

#### Step 1: Generate Objective List

- Based on research objectives and existing data analysis results, generate an interview objective list
- Each objective annotated with:
  - Source hypothesis (from which data finding or inference)
  - Validation method (direct questioning / behavioral observation / projective techniques)
  - Priority (must validate / should validate / optional exploration)
- Identify contradictions in existing data, list as priority validation objectives
- Output: Interview objective list

#### Step 2: Generate Semi-Structured Interview Script

- Based on the objective list, generate a semi-structured script, including:
  - **Opening**: Icebreaker questions, build trust
  - **Core modules**: Question groups arranged by objective priority
  - **Each question**:
    - Main question (open-ended)
    - Follow-up strategies (2-3 directional follow-ups)
    - Probe prompts (guidance directions when user answers are vague)
    - Linked objective (which hypothesis this question validates)
  - **Closing**: Open-ended question, let the user add anything
- Script design principles:
  - Behavior before attitude (ask what they did first, then what they think)
  - Specific before abstract (ask about specific scenarios first, then general opinions)
  - Avoid leading questions
- Output: interview-script.json

#### Step 3: Recommend Interview Subjects

- Based on Personas, recommend interview subject characteristics:
  - Prioritize covering different Persona types
  - Prioritize users with contradictory behaviors in the data
  - Prioritize feedback providers with high-frequency pain points in voice-analysis
- Recommended count: Target Persona count × 3-5 people
- Output: Recommended interview subject list

### Phase 2: Interview Execution (Human-led)

- Human executes interviews following the script
- AI does not participate in the real-time interview process
- Human can deviate from the script to follow up (on-site judgment-based follow-up is encouraged)
- Recording is recommended (with respondent's consent)

### Phase 3: Post-Interview Analysis (AI-assisted)

#### Step 4: Transcription and Structuring

- If recording is available, AI assists with transcription
- Structure interview content by topic
- Annotate key quotes (verbatim)
- Output: Structured interview records

#### Step 5: Key Insight Extraction

- Extract key insights from each interview:
  - **Validated hypotheses**: Which hypotheses are supported by interview data
  - **Refuted hypotheses**: Which hypotheses are contradicted by interview data
  - **New discoveries**: Unexpected findings that emerged during interviews
  - **User verbatim quotes**: Representative quotes supporting each insight
- Each insight annotated with confidence level
- Distinguish: Direct statements (user explicitly said) vs. inferences (inferred from behavioral descriptions)
- Output: Insight list

#### Step 6: Cross-Interview Clustering

- Cluster insights from multiple interviews across interviews
- Identify cross-interview common patterns (independently mentioned by multiple respondents)
- Identify unique but valuable insights (mentioned by only one person but with high depth)
- Assess saturation level of each cluster (whether more interviews are needed)
- Output: Cross-interview insight clusters

#### Step 7: Update Personas

- Update Personas based on interview findings:
  - Supplement or revise Persona characteristics
  - Increase confidence for low-confidence fields (if interview validated inferences)
  - Decrease confidence for refuted hypotheses
  - Add new characteristics discovered in interviews
- Annotate update source: `interview-validated` / `interview-revised` / `interview-discovered`
- Output: Updated persona.json

---

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Interview outline and key questions | Core conclusions + minimum viable deliverable |
| standard | Complete deliverable (current default) | Complete deliverable, including all Step outputs |
| deep | Complete assistance + interview strategy design + follow-up logic tree + data analysis framework | Complete deliverable + extended analysis + deep inference |

## Output

### interview-script.json

Output file: `output/pm-discovery/user-research-interview-assist/interview-script.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["script_id", "research_objectives", "core_modules"],
  "properties": {
    "script_id": {"type": "string", "description": "Interview script unique identifier"},
    "research_objectives": {"type": "array", "description": "Research objectives list"},
    "target_personas": {"type": "array", "description": "Target Persona types list"},
    "opening": {"type": "object", "description": "Opening module, including icebreaker questions and context setting"},
    "core_modules": {"type": "array", "description": "Core question modules list"},
    "closing": {"type": "object", "description": "Closing module"},
    "recommended_participants": {"type": "array", "description": "Recommended interview subjects list"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| script_id | string | Yes | Script unique identifier |
| research_objectives | string[] | Yes | Research objectives list, cannot be empty |
| target_personas | string[] | No | Target Persona types list |
| opening.icebreaker_questions | string[] | Yes | Icebreaker questions list |
| opening.context_setting | string | Yes | Context setting description |
| core_modules | array | Yes | Core question modules list, cannot be empty |
| core_modules[].module_name | string | Yes | Module name |
| core_modules[].objective | string | Yes | Module objective |
| core_modules[].hypothesis_to_validate | string | Yes | Hypothesis to validate |
| core_modules[].priority | string | Yes | Priority enum: must_validate/should_validate/optional |
| core_modules[].questions | array | Yes | Questions list, each core question must have ≥ 2 follow-up directions |
| core_modules[].questions[].main_question | string | Yes | Main question (open-ended) |
| core_modules[].questions[].follow_up_strategies | string[] | Yes | Follow-up strategies, ≥ 2 directions |
| core_modules[].questions[].probes | string[] | Yes | Probe prompts |
| closing.open_ended_question | string | Yes | Closing open-ended question |
| recommended_participants | array | No | Recommended interview subjects list |
| recommended_participants[].persona_type | string | Yes | Persona type |
| recommended_participants[].priority | string | Yes | Priority enum: high/medium/low |

```json
{
  "script_id": "string",
  "research_objectives": ["string"],
  "target_personas": ["string"],
  "opening": {
    "icebreaker_questions": ["string"],
    "context_setting": "string"
  },
  "core_modules": [
    {
      "module_name": "string",
      "objective": "string",
      "hypothesis_to_validate": "string",
      "priority": "must_validate|should_validate|optional",
      "questions": [
        {
          "id": "string",
          "main_question": "string",
          "follow_up_strategies": ["string"],
          "probes": ["string"],
          "target_objective": "string"
        }
      ]
    }
  ],
  "closing": {
    "open_ended_question": "string",
    "wrap_up": "string"
  },
  "recommended_participants": [
    {
      "persona_type": "string",
      "key_characteristics": ["string"],
      "priority": "high|medium|low",
      "reason": "string"
    }
  ]
}
```

### interview-insights.json

Output file: `output/pm-discovery/user-research-interview-assist/interview-insights.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["interviews_conducted", "validated_hypotheses", "new_discoveries", "metadata"],
  "properties": {
    "interviews_conducted": {"type": "number", "description": "Number of interviews conducted"},
    "validated_hypotheses": {"type": "array", "description": "Validated hypotheses list"},
    "refuted_hypotheses": {"type": "array", "description": "Refuted hypotheses list"},
    "new_discoveries": {"type": "array", "description": "New discoveries list"},
    "cross_interview_patterns": {"type": "array", "description": "Cross-interview common patterns list"},
    "persona_updates": {"type": "array", "description": "Persona updates list"},
    "data_cross_validation": {"type": "object", "description": "Cross-validation results with existing data"},
    "metadata": {"type": "object", "description": "Analysis metadata, including timestamp and overall confidence"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| interviews_conducted | number | Yes | Number of interviews conducted, must be ≥ 1 |
| validated_hypotheses | array | Yes | Validated hypotheses list, each item must contain hypothesis, supporting_evidence, supporting_quotes, interview_count, confidence |
| validated_hypotheses[].confidence | number | Yes | Validation confidence, 0-1 |
| refuted_hypotheses | array | Yes | Refuted hypotheses list, each item must contain hypothesis, refuting_evidence, refuting_quotes, interview_count, confidence |
| refuted_hypotheses[].confidence | number | Yes | Refutation confidence, 0-1 |
| new_discoveries | array | Yes | New discoveries list, each item must contain discovery, evidence, quotes, interview_count, confidence, needs_further_validation |
| new_discoveries[].needs_further_validation | boolean | Yes | Whether further validation is needed |
| new_discoveries[].confidence | number | Yes | Discovery confidence, 0-1 |
| cross_interview_patterns | array | No | Cross-interview patterns list, each item must contain pattern, frequency, interview_ids, confidence, saturation_level |
| cross_interview_patterns[].saturation_level | string | Yes | Saturation enum: saturated/near_saturated/needs_more |
| persona_updates | array | No | Persona updates list, each item must contain persona_id, updates |
| persona_updates[].updates[].update_type | string | Yes | Update type enum: interview-validated/interview-revised/interview-discovered |
| data_cross_validation | object | No | Cross-validation results, must contain consistent_with_voice_analysis, consistent_with_behavior_analysis, contradictions_found |
| metadata.analysis_timestamp | string | Yes | Analysis timestamp |
| metadata.total_interviews | number | Yes | Total number of interviews |
| metadata.total_insights | number | Yes | Total number of insights |
| metadata.confidence_overall | number | Yes | Overall confidence, 0-1 |

```json
{
  "interviews_conducted": "number",
  "validated_hypotheses": [
    {
      "hypothesis": "string",
      "supporting_evidence": ["string"],
      "supporting_quotes": ["string"],
      "interview_count": "number",
      "confidence": "number"
    }
  ],
  "refuted_hypotheses": [
    {
      "hypothesis": "string",
      "refuting_evidence": ["string"],
      "refuting_quotes": ["string"],
      "interview_count": "number",
      "confidence": "number"
    }
  ],
  "new_discoveries": [
    {
      "discovery": "string",
      "evidence": ["string"],
      "quotes": ["string"],
      "interview_count": "number",
      "confidence": "number",
      "needs_further_validation": "boolean"
    }
  ],
  "cross_interview_patterns": [
    {
      "pattern": "string",
      "frequency": "number",
      "interview_ids": ["string"],
      "confidence": "number",
      "saturation_level": "saturated|near_saturated|needs_more"
    }
  ],
  "persona_updates": [
    {
      "persona_id": "string",
      "updates": [
        {
          "field": "string",
          "previous_value": "string",
          "updated_value": "string",
          "update_type": "interview-validated|interview-revised|interview-discovered",
          "confidence": "number"
        }
      ]
    }
  ],
  "data_cross_validation": {
    "consistent_with_voice_analysis": ["string"],
    "consistent_with_behavior_analysis": ["string"],
    "contradictions_found": [
      {
        "data_source": "string",
        "interview_finding": "string",
        "existing_finding": "string",
        "possible_explanation": "string",
        "resolution": "string"
      }
    ]
  },
  "metadata": {
    "analysis_timestamp": "string",
    "total_interviews": "number",
    "total_insights": "number",
    "confidence_overall": "number"
  }
}
```

---

## Decision Rules

| Condition | Action |
|------|------|
| Inferred need confidence < 0.5 | Mark as "requires human validation", do not directly update Persona |
| Interview findings contradict existing data | Record contradiction, mark as "requires arbitration", list evidence from both sides |
| Cross-interview clustering saturation insufficient | Recommend increasing interview count, annotate "needs supplementary validation" |
| New discovery mentioned by only 1 person | Mark as "isolated finding", confidence ceiling 0.4, recommend validation |
| Interview script deviates from original objectives | Human decides whether to adjust research objectives |

---

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Script includes follow-up strategies (each core question ≥ 2 follow-up directions)
- [ ] Insights cross-validated with existing data (each insight has cross_validation record)

### P1 Checks (must pass for standard/deep)

- [ ] Interview subjects cover major Personas (each high-priority Persona ≥ 3 people)
- [ ] Each insight has verbatim quote support (each insight ≥ 1 quote)
- [ ] All outputs annotated with confidence (100%)
- [ ] Non-leading question check (core questions have no leading phrasing)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| persona.json | User provides research objectives and user descriptions → generate interview script based on descriptions, annotate "lacks Persona data targeting" | target_personas is empty, recommended_participants based on inference, interview subject targeting precision reduced | Ask user to provide target user persona descriptions or upload persona.json file |
| voice-analysis.json / behavior-analysis.json | Generate script directly based on user-provided research objectives, annotate "lacks data-validated hypotheses" | hypothesis_to_validate based on user descriptions rather than data findings, data_cross_validation missing | Ask user to provide user feedback text and behavior data, or upload corresponding json files |
| All upstream files missing | Prompt user to execute prior phases first, or generate a lightweight interview script based on user's verbal description of research objectives | Script is purely exploratory, validating hypotheses missing, overall confidence reduced | Ask user to provide research objectives, hypotheses, and target user characteristic descriptions |
| If user has not provided research_objectives | Prompt user to provide research objectives, otherwise targeted interview script cannot be designed | Cannot generate interview-script.json, process interrupted | Ask user to provide research objectives (e.g., "understand user payment decision factors") |
| If user has not provided interview_config | Prompt user to provide interview configuration, otherwise use default configuration (target count: 5, duration: 45 minutes, format: video, recording available) | Using default configuration, interview arrangements may not match actual conditions | Ask user to provide target interview count, duration, format, and other configuration information |

## Data Acquisition Instructions

This Skill requires Persona and user research data. Please provide through one of the following methods:
  1. Directly describe research objectives, hypotheses, and target user characteristics
  2. Upload persona.json / voice-analysis.json / behavior-analysis.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact

| Upstream Skill | Change Type | Impact Scope | Response Action |
|-----------|---------|---------|---------|
| user-research-user-modeling | persona.json structure change | Persona field mapping changes | Check input field mapping, adapt to new structure, mark "upstream data format anomaly" if incompatible |
| user-research-user-modeling | persona.json content update | Persona characteristics, pain points, JTBD changes | Regenerate interview script and recommended subjects, annotate "rebuilt based on updated Persona" |
| user-research-voice-analysis | voice-analysis.json structure change | Pain points, topic data format changes | Check input field mapping, adapt to new structure, mark "upstream data format anomaly" if incompatible |
| user-research-voice-analysis | voice-analysis.json content update | Pain point levels, sentiment distribution changes | Update hypotheses-to-validate list, annotate "hypotheses adjusted based on updated data" |
| user-research-behavior-analysis | behavior-analysis.json structure change | Behavioral segmentation, Aha Moment data format changes | Check input field mapping, adapt to new structure, mark "upstream data format anomaly" if incompatible |
| user-research-behavior-analysis | behavior-analysis.json content update | Funnel, paths, anomaly detection results changes | Update hypotheses-to-validate list, annotate "hypotheses adjusted based on updated data" |

### Downstream Notification Mechanism

| Downstream Skill | Notification Trigger Condition | Notification Method | Notification Content |
|-----------|------------|---------|---------|
| user-research-report | interview-insights.json update completed | Write to output file | Notify that interview insights and Persona update data are ready for report generation |
