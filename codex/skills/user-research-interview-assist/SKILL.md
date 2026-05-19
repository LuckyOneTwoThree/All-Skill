---
name: user-research-interview-assist
description: "Use when designing user interview scripts, extracting insights after interviews, and performing cross-interview clustering analysis. Keywords: user interview, interview script, interview insights, semi-structured interview, qualitative research assistance, interview outline."
metadata:
  module: "Product Discovery"
  sub-module: "User Research"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me prepare interview questions"
    - "How to organize insights after interviews"
    - "How to conduct user interviews"
execution_depth:
  default: standard
  quick_description: "Output interview guide and key questions"
  deep_description: "Full assist + interview strategy design + follow-up logic tree + data analysis framework"
---

# Interview Assistance

## Core Principles

1. **Human-led, AI-assisted** -- Interview execution is human-led; AI is responsible for script design, transcription analysis, and insight extraction; cannot replace human judgment
2. **Scripts serve objectives, not the other way around** -- Interview scripts are tools for validating hypotheses; humans can deviate from scripts to follow up based on on-site judgment; flexibility over completeness
3. **Follow-up questions are more valuable than main questions** -- Main questions open topics; follow-ups dig deeper; scripts must include follow-up strategies and probe prompts
4. **Interviews are for validation, not exploration** -- Interview objectives come from hypotheses discovered in existing data; each interview must answer "what was validated / what was refuted"

## Interaction Mode

Human->AI **Human-AI collaboration** -- Human leads interview execution; AI handles script design, transcription analysis, and insight extraction

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| persona.json | JSON | No | output/pm-discovery/user-research-user-modeling/persona.json | User persona data for targeting interview subjects and script design |
| research_objectives | object | Yes | User provided | Research objectives defining hypotheses to validate and directions to explore in this interview |
| interview_config | object | Yes | User provided | Interview configuration (target count, duration, format, recording availability) |
| voice-analysis.json | JSON | No | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | User voice analysis data |
| behavior-analysis.json | JSON | No | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | Behavior analysis data |

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

**Input dependencies**:
- `persona.json` (if generated): Used for targeting interview subjects and script design
- Research objectives (human input): Define hypotheses to validate and directions to explore
- voice-analysis.json / behavior-analysis.json: Provide data findings to validate

---

## Execution Steps

### Phase 1: Pre-Interview Preparation (AI generates, human confirms)

#### Step 1: Generate Objective List [Core]

- Based on research objectives and existing data analysis results, generate interview objective list
- Each objective annotated with:
  - Source hypothesis (from which data finding or inference)
  - Validation method (direct questioning / behavioral observation / projective techniques)
  - Priority (must validate / should validate / optional exploration)
- Identify contradictions in existing data, list as key validation objectives
- Output: Interview objective list

#### Step 2: Generate Semi-Structured Interview Script [Core]

- Based on objective list, generate semi-structured script including:
  - **Opening**: Icebreaker questions, build rapport
  - **Core modules**: Question groups ordered by objective priority
  - **Each question**:
    - Main question (open-ended)
    - Follow-up strategies (2-3 directional follow-ups)
    - Probe prompts (guidance directions when user's answer is vague)
    - Corresponding objective (which hypothesis this question validates)
  - **Closing**: Open-ended question, let user supplement
- Script design principles:
  - Behavior before attitude (ask what they did first, then how they feel)
  - Specific before abstract (ask about specific scenarios first, then general opinions)
  - Avoid leading questions
- Output: interview-script.json

#### Step 3: Recommend Interview Subjects [Core]

- Based on Persona, recommend interview subject characteristics:
  - Prioritize covering different Persona types
  - Prioritize users with contradictory behaviors in data
  - Prioritize feedback providers of high-frequency pain points in voice-analysis
- Recommended count: Target Persona count x 3-5 people
- Output: Recommended interview subject list

### Phase 2: Interview Execution (Human-led)

- Human executes interview following script
- AI does not participate in real-time interview process
- Human may deviate from script to follow up (follow-up based on on-site judgment is encouraged)
- Recording recommended (subject to interviewee's consent)

### Phase 3: Post-Interview Analysis (AI-assisted)

#### Step 4: Transcription and Structuring [Conditional]

- If recording available, AI assists with transcription
- Structure interview content by topic
- Annotate key quotes (verbatim)
- Output: Structured interview records

#### Step 5: Key Insight Extraction [Deep]

- Extract key insights from each interview:
  - **Validated hypotheses**: Which hypotheses are supported by interview data
  - **Refuted hypotheses**: Which hypotheses are contradicted by interview data
  - **New discoveries**: Unexpected findings from interviews
  - **User quotes**: Representative quotes supporting each insight
- Each insight annotated with confidence
- Distinguish: Direct statements (user explicitly said) vs. inferences (inferred from behavioral descriptions)
- Output: Insight list

#### Step 6: Cross-Interview Clustering [Deep]

- Cluster insights across multiple interviews
- Identify cross-interview common patterns (independently mentioned by multiple interviewees)
- Identify unique but valuable insights (only one person mentioned but high depth)
- Assess saturation level of each cluster (whether more interviews needed)
- Output: Cross-interview insight clusters

#### Step 7: Update Persona [Deep]

- Update Persona based on interview findings:
  - Supplement or correct Persona characteristics
  - Increase confidence of low-confidence fields (e.g., interview validated inferences)
  - Decrease confidence of refuted hypotheses
  - Add new characteristics discovered in interviews
- Annotate update source: `interview-validated` / `interview-revised` / `interview-discovered`
- Output: Updated persona.json

---

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | interview guide and key questions | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full assist + interview strategy design + follow-up logic tree + data analysis framework | Full deliverables + extended analysis + deep simulation |

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
    "research_objectives": {"type": "array", "description": "Research objective list"},
    "target_personas": {"type": "array", "description": "Target Persona type list"},
    "opening": {"type": "object", "description": "Opening module, including icebreaker questions and context setting"},
    "core_modules": {"type": "array", "description": "Core question module list"},
    "closing": {"type": "object", "description": "Closing module"},
    "recommended_participants": {"type": "array", "description": "Recommended interview subject list"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| script_id | string | Yes | Script unique identifier |
| research_objectives | string[] | Yes | Research objective list, must not be empty |
| target_personas | string[] | No | Target Persona type list |
| opening.icebreaker_questions | string[] | Yes | Icebreaker question list |
| opening.context_setting | string | Yes | Context setting description |
| core_modules | array | Yes | Core question module list, must not be empty |
| core_modules[].module_name | string | Yes | Module name |
| core_modules[].objective | string | Yes | Module objective |
| core_modules[].hypothesis_to_validate | string | Yes | Hypothesis to validate |
| core_modules[].priority | string | Yes | Priority enum: must_validate/should_validate/optional |
| core_modules[].questions | array | Yes | Question list; each core question >= 2 follow-up directions |
| core_modules[].questions[].main_question | string | Yes | Main question (open-ended) |
| core_modules[].questions[].follow_up_strategies | string[] | Yes | Follow-up strategies, >= 2 directions |
| core_modules[].questions[].probes | string[] | Yes | Probe prompts |
| closing.open_ended_question | string | Yes | Closing open-ended question |
| recommended_participants | array | No | Recommended interview subject list |
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
    "validated_hypotheses": {"type": "array", "description": "Validated hypothesis list"},
    "refuted_hypotheses": {"type": "array", "description": "Refuted hypothesis list"},
    "new_discoveries": {"type": "array", "description": "New discovery list"},
    "cross_interview_patterns": {"type": "array", "description": "Cross-interview common pattern list"},
    "persona_updates": {"type": "array", "description": "Persona update list"},
    "data_cross_validation": {"type": "object", "description": "Cross-validation results with existing data"},
    "metadata": {"type": "object", "description": "Analysis metadata, including timestamp and overall confidence"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| interviews_conducted | number | Yes | Number of interviews conducted, must be >= 1 |
| validated_hypotheses | array | Yes | Validated hypothesis list; each must include hypothesis, supporting_evidence, supporting_quotes, interview_count, confidence |
| validated_hypotheses[].confidence | number | Yes | Validation confidence, 0-1 |
| refuted_hypotheses | array | Yes | Refuted hypothesis list; each must include hypothesis, refuting_evidence, refuting_quotes, interview_count, confidence |
| refuted_hypotheses[].confidence | number | Yes | Refutation confidence, 0-1 |
| new_discoveries | array | Yes | New discovery list; each must include discovery, evidence, quotes, interview_count, confidence, needs_further_validation |
| new_discoveries[].needs_further_validation | boolean | Yes | Whether further validation is needed |
| new_discoveries[].confidence | number | Yes | Discovery confidence, 0-1 |
| cross_interview_patterns | array | No | Cross-interview pattern list; each must include pattern, frequency, interview_ids, confidence, saturation_level |
| cross_interview_patterns[].saturation_level | string | Yes | Saturation enum: saturated/near_saturated/needs_more |
| persona_updates | array | No | Persona update list; each must include persona_id, updates |
| persona_updates[].updates[].update_type | string | Yes | Update type enum: interview-validated/interview-revised/interview-discovered |
| data_cross_validation | object | No | Cross-validation results; must include consistent_with_voice_analysis, consistent_with_behavior_analysis, contradictions_found |
| metadata.analysis_timestamp | string | Yes | Analysis timestamp |
| metadata.total_interviews | number | Yes | Total interviews |
| metadata.total_insights | number | Yes | Total insights |
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
| Inferred need confidence < 0.5 | Mark "needs human validation"; do not directly update Persona |
| Interview finding contradicts existing data | Record contradiction, mark "needs arbitration"; list evidence from both sides |
| Cross-interview clustering saturation insufficient | Recommend increasing interview count; annotate "needs supplementary validation" |
| New discovery mentioned by only 1 person | Mark "isolated finding"; confidence ceiling 0.4; recommend validation |
| Interview script deviates from original objectives | Human decides whether to adjust research objectives |

---

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Script includes follow-up strategies (Each core question >= 2 follow-up directions)
- [ ] Insights cross-validated with existing data (Each insight has cross_validation record)

### P1 Checks (must pass for standard/deep)

- [ ] Interview subjects cover main Personas (Each high-priority Persona >= 3 people)
- [ ] Each insight has quote support (Each insight >= 1 quote)
- [ ] All outputs annotated with confidence (100%)
- [ ] Non-leading question check (Core questions have no leading language)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|----------|----------|
| persona.json | User provides research objectives and user descriptions -> generate interview script based on descriptions, annotate "lacking Persona data targeting" | target_personas empty, recommended_participants based on inference, interview subject targeting precision reduced | Request user to describe target user characteristics or upload persona.json for persona-guided interview design |
| voice-analysis.json / behavior-analysis.json | Generate script directly based on user-provided research objectives, annotate "lacking data-validated hypotheses" | hypothesis_to_validate based on user description rather than data findings, data_cross_validation missing | Request user to provide research hypotheses or upload voice-analysis.json / behavior-analysis.json for data-driven hypothesis generation |
| All upstream files missing | Prompt user to execute prior stages first, or generate lightweight interview script based on user's verbal description of research objectives | Script is purely exploratory design; validation hypotheses missing; overall confidence reduced | Request user to describe research objectives and target users, or execute user-research-voice-analysis and user-research-behavior-analysis first |
| If user does not provide research_objectives | Prompt user to provide research objectives; otherwise cannot design targeted interview script | Cannot generate interview-script.json; process interrupted | Prompt user to specify research objectives (e.g., "understand onboarding friction", "validate pricing willingness") |
| If user does not provide interview_config | Prompt user to provide interview configuration; otherwise use default configuration (target count: 5, duration: 45 minutes, format: video, recording available) | Default configuration used; interview arrangement may not match actual conditions | Prompt user to provide interview config (target count, duration, format) or accept defaults |

---

## Upstream Change Response

### Upstream Change Impact

| Upstream Skill | Change Type | Impact Scope | Response Action |
|-----------|---------|---------|---------|
| user-research-user-modeling | persona.json structure change | Persona field mapping changes | Check input field mapping, adapt to new structure; mark "upstream data format anomaly" when incompatible |
| user-research-user-modeling | persona.json content update | Persona characteristics, pain points, JTBD changes | Regenerate interview script and recommended subjects; annotate "rebuilt based on updated Persona" |
| user-research-voice-analysis | voice-analysis.json structure change | Pain point, theme data format changes | Check input field mapping, adapt to new structure; mark "upstream data format anomaly" when incompatible |
| user-research-voice-analysis | voice-analysis.json content update | Pain point severity, sentiment distribution changes | Update hypotheses to validate list; annotate "hypotheses adjusted based on updated data" |
| user-research-behavior-analysis | behavior-analysis.json structure change | Behavioral segment, Aha Moment data format changes | Check input field mapping, adapt to new structure; mark "upstream data format anomaly" when incompatible |
| user-research-behavior-analysis | behavior-analysis.json content update | Funnel, path, anomaly detection result changes | Update hypotheses to validate list; annotate "hypotheses adjusted based on updated data" |

### Downstream Notification Mechanism

| Downstream Skill | Notification Trigger Condition | Notification Method | Notification Content |
|-----------|------------|---------|---------|
| user-research-report | interview-insights.json update complete | Write to output file | Notify interview insights and Persona update data ready for report generation |
