---
name: opportunity-definition
description: "Use when identifying and defining product opportunities. Integrates opportunity scoring, problem statements, HMW divergence, and opportunity briefs. Keywords: opportunity identification, opportunity assessment, HMW, Problem Statement, opportunity brief, product opportunity."
metadata:
  module: "Product Discovery"
  sub-module: "Opportunity Identification"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me evaluate this product opportunity"
    - "Identify product opportunities"
    - "Define the problem we need to solve"
    - "Generate an opportunity brief"
    - "Is this opportunity worth pursuing"
---

# Opportunity Definition -- Opportunity Identification and Definition

## Core Principles

1. **Good opportunities are defined, not discovered** -- Opportunities are not objectively existing waiting to be found; they are progressively defined through scoring validation, Problem Statement definition, and HMW reframing
2. **Scoring before divergence** -- Score to determine opportunity priority first (scoring), then diverge to explore innovation space (hmw); order must not be reversed, otherwise HMW will diverge in low-value directions
3. **Problem Statement is the anchor** -- All HMW and Briefs anchor to the Problem Statement; if Problem Statement quality does not pass, subsequent output is unreliable
4. **Scoring is a suggestion, not a decision** -- AI output is for decision reference; final priority ranking requires human comprehensive judgment; strategic fit dimension must be human-judged
5. **Divergence over convergence** -- HMW generation phase pursues quantity and breadth; screening is left for human review; all four dimensions are essential
6. **Brief is a decision document, not data stacking** -- Every field must serve decision-making; assumptions and risks drive next steps

## Interaction Mode

AI->Human AI suggests, human approves (Opportunity scoring phase strategic fit dimension Human executed by human)

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User research data | JSON | Yes | output/pm-discovery/user-research-voice-analysis/voice-analysis.json / output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | User pain points, behavior data, expectation data |
| Market analysis data | JSON | Yes | output/pm-discovery/market-tam-som/tam-som.json | SOM estimated value |
| Competitor analysis data | JSON | Yes | output/pm-discovery/market-competitor-analysis/competitor-analysis.json | Competitor capabilities and barrier analysis |
| Need insight data | JSON | No | output/pm-discovery/user-research-user-modeling/persona.json / output/pm-discovery/insight-analysis/insight-analysis.json | User personas, jobs to be done, requirement classification |
| Technical team assessment | object | No | User provided | Current tech stack feasibility assessment |

## Execution Steps

### Step 1: Opportunity Scoring

Multi-dimensional quantitative scoring of product opportunities to determine priority.

**Scoring function**: Total score = Σ(Dimension score x Dimension weight)

#### Dimension 1: Problem Validity (Weight 0.30)

| Score | Standard |
|------|------|
| 5 | Pain point mention rate > 10% AND behavioral data corroborates |
| 4 | Pain point mention rate > 10% but no behavioral data corroboration |
| 3 | Pain point mention rate 5%-10% AND behavioral data corroborates |
| 2 | Pain point mention rate 5%-10% but no behavioral data corroboration |
| 1 | No direct data, pure assumption |

#### Dimension 2: Market Size (Weight 0.25)

| Score | Standard |
|------|------|
| 5 | SOM > 100 million |
| 4 | SOM 50 million - 100 million |
| 3 | SOM 10 million - 50 million |
| 2 | SOM 5 million - 10 million |
| 1 | Cannot estimate |

#### Dimension 3: Solution Feasibility (Weight 0.20)

| Score | Standard |
|------|------|
| 5 | Current tech stack can directly implement |
| 4 | Current tech stack needs minor extension |
| 3 | Need to introduce new technology but team has capability |
| 2 | Need to introduce new technology and team needs to learn |
| 1 | Current technology not feasible |

#### Dimension 4: Strategic Fit (Weight 0.15) Human Human Judgment

| Score | Standard |
|------|------|
| 5 | Core strategic direction, highly aligned |
| 4 | Important strategic direction, well aligned |
| 3 | Related strategic direction, partially aligned |
| 2 | Peripheral strategic direction, weakly aligned |
| 1 | Not within strategic direction |

> **Note**: AI provides strategic fit analysis suggestions, but the final score must be human-judged. After AI scoring, this dimension is marked as `needs_human: true`.

#### Dimension 5: Competitive Moat (Weight 0.10)

| Score | Standard |
|------|------|
| 5 | Competitors lack this capability and short-term replication is difficult |
| 4 | Competitors lack this capability but medium-term replication is possible |
| 3 | Competitors have partial capability but poor experience |
| 2 | Competitors have good capability but not dominant |
| 1 | Competitors are already leading |

### Step 2: Problem Statement

Generate structured Problem Statement based on scoring results and user research data.

**Structured template**:

> [Target user group] in [scenario], needs to [accomplish what task], but currently faces [core pain point], because [shortcoming of existing solutions], if this problem is solved, they will [expected benefit].

**Data support requirements**: Each key element must be accompanied by data evidence.

#### Template Element Breakdown

| Element | Description | Data Requirements |
|------|------|----------|
| Target user group | Specific user group description; cannot be generic "users" | Must link to persona data |
| Scenario | Specific usage scenario the user is in | Must have behavioral or interview data support |
| Accomplish what task | Goal the user needs to achieve | Must link to JTBD data |
| Core pain point | Primary difficulty the user faces | Must have pain point mention rate data |
| Shortcoming of existing solutions | Deficiencies of current solutions | Must have competitor analysis or user feedback data |
| Expected benefit | Expected effect after problem is solved | Must be quantifiable or verifiable |

#### Quality Check (auto-executed, fix and retry if not passed, max 3 times)

| Check Item | Pass Condition | Fix Strategy |
|--------|----------|----------|
| Specific user group specified | User group description is specific, not generic | Extract specific user group description from persona data to replace |
| Specific scenario specified | Scenario description is specific and observable | Extract high-frequency scenarios from behavioral data to replace |
| Existing solution shortcomings described | Clearly identifies 1 or more specific shortcomings | Extract specific shortcomings from competitor analysis and user feedback |
| Verifiable | Expected benefit is quantifiable or verifiable through experiment | Replace vague benefits with quantifiable metrics |
| No solution preset avoided | Problem description does not contain any specific solution | Remove solution descriptions, focus on the problem itself |

### Step 3: HMW Divergence

Based on Problem Statement and user research data, generate HMW statements from 4 dimensions, 2-3 per dimension:

#### Dimension 1: Eliminate Barriers

**Template**: "How might we eliminate/reduce [user's XX barrier in XX scenario]?"

- Focus on specific obstacles users currently face
- Barriers must have user research data support
- Avoid jumping directly to solutions

#### Dimension 2: Enhance Experience

**Template**: "How might we make [XX experience] more [simple/fast/pleasant]?"

- Focus on existing but poorly experienced aspects
- Experience improvement directions must have behavioral data corroboration
- Quantify improvement targets

#### Dimension 3: Create New Value

**Template**: "How might we help [XX users] achieve [their unexpressed XX expectation]?"

- Uncover needs users haven't explicitly expressed but behavioral data suggests
- Based on implicit patterns in user research

#### Dimension 4: Redefine

**Template**: "What if we rethink [XX process]?"

- Challenge basic assumptions of existing processes
- Draw on cross-industry innovation models
- Encourage breakthrough thinking

### Step 4: Opportunity Brief

Assemble all preceding outputs into a complete opportunity brief.

#### Structure Definition

| Field | Source | Description |
|------|------|------|
| title | Auto-generated | Format: [Target user group] - [Core pain point summary] |
| problem_statement | Step 2 output | Directly quote Problem Statement text |
| evidence_summary | Multi-source aggregation | User research evidence, market analysis evidence, competitive landscape evidence |
| opportunity_score | Step 1 output | Weighted total score and each dimension score |
| hmw_statements | Step 3 output | HMW statement list, annotated with innovation space scoring |
| key_assumptions | Inferred | Key assumption list, including type/testability/risk level |
| recommended_next_step | Based on scoring and assumption analysis | Recommended next action |
| human_decisions_needed | Inferred | List of items requiring human decision |

## Output

Output path: `output/pm-discovery/opportunity-definition/`

Output files: opportunity-definition.json + opportunity-definition.md

### Output Schema

```json
{
  "type": "object",
  "required": ["scoring", "problem_statement", "hmw", "brief", "metadata"],
  "properties": {
    "scoring": {
      "type": "object",
      "required": ["opportunities", "metadata"],
      "properties": {
        "opportunities": {"type": "array", "description": "Opportunity scoring list, see output validation rules -> scoring validation"},
        "metadata": {"type": "object", "description": "Scoring metadata, including awaiting_human_input"}
      }
    },
    "problem_statement": {
      "type": "object",
      "required": ["problem_statement", "data_support", "template_elements", "quality_check"],
      "properties": {
        "problem_statement": {"type": "string", "description": "Complete Problem Statement text"},
        "data_support": {"type": "object", "description": "Data support, see output validation rules -> problem_statement validation"},
        "template_elements": {"type": "object", "description": "Template 6 elements"},
        "quality_check": {"type": "object", "description": "5 quality check results"}
      }
    },
    "hmw": {
      "type": "object",
      "required": ["hmw_statements", "dimension_coverage"],
      "properties": {
        "hmw_statements": {"type": "array", "description": "HMW statement list, see output validation rules -> hmw validation"},
        "dimension_coverage": {"type": "object", "description": "4-dimension coverage statistics"}
      }
    },
    "brief": {
      "type": "object",
      "required": ["title", "problem_statement", "evidence_summary", "opportunity_score", "hmw_statements", "key_assumptions", "recommended_next_step", "human_decisions_needed"],
      "properties": {
        "title": {"type": "string"},
        "evidence_summary": {"type": "object", "description": "3 types of evidence summary, see output validation rules -> brief validation"},
        "key_assumptions": {"type": "array", "description": "Key assumption list, see output validation rules -> brief validation"},
        "human_decisions_needed": {"type": "array", "description": "Human decision items list"}
      }
    },
    "metadata": {"type": "object", "description": "Metadata, including version, timestamp, and source files"}
  }
}
```

### Output Validation Rules

#### scoring Validation

| Field Path | Type | Required | Description |
|----------|------|------|------|
| `scoring.opportunities` | array | Yes | Opportunity scoring list, must not be empty array |
| `scoring.opportunities[].name` | string | Yes | Opportunity name, must not be empty string |
| `scoring.opportunities[].scores.{dimension}.score` | number\|null | Yes | Dimension score 1-5; must be null when pending human judgment |
| `scoring.opportunities[].scores.{dimension}.weight` | number | Yes | Dimension weight; sum of 5 dimension weights must equal 1.00 |
| `scoring.opportunities[].scores.{dimension}.evidence` | string | Yes | Scoring basis, must not be empty string |
| `scoring.opportunities[].scores.{dimension}.needs_human` | boolean | Yes | Whether human judgment needed; strategic_fit dimension must be true |
| `scoring.opportunities[].weighted_total` | number\|null | Yes | Weighted total score; must be null when any dimension score is null |
| `scoring.metadata.awaiting_human_input` | boolean | Yes | Whether awaiting human input; must be true when strategic_fit is not scored |

#### problem_statement Validation

| Field Path | Type | Required | Description |
|----------|------|------|------|
| `problem_statement.problem_statement` | string | Yes | Complete Problem Statement text; must not be empty and must not contain specific solutions |
| `problem_statement.data_support.pain_point_frequency` | string | Yes | Pain point mention rate, must not be empty |
| `problem_statement.data_support.behavioral_evidence` | string | Yes | Behavioral data corroboration, must not be empty |
| `problem_statement.data_support.confidence` | number | Yes | Confidence 0-1; escalate to human review when below 0.5 |
| `problem_statement.template_elements.target_user` | string | Yes | Target user group; must not use generic terms |
| `problem_statement.template_elements.scenario` | string | Yes | Specific scenario; must not be vague description |
| `problem_statement.template_elements.task` | string | Yes | Task user needs to accomplish; must not be empty |
| `problem_statement.template_elements.core_pain` | string | Yes | Core pain point; must not be empty |
| `problem_statement.template_elements.current_gap` | string | Yes | Existing solution shortcomings; must identify 1 or more specific shortcomings |
| `problem_statement.template_elements.expected_benefit` | string | Yes | Expected benefit; must be quantifiable or verifiable |
| `problem_statement.quality_check.all_passed` | boolean | Yes | Whether all 5 quality checks passed |
| `problem_statement.quality_check.retry_count` | number | Yes | Retry count; maximum value is 3 |

#### hmw Validation

| Field Path | Type | Required | Description |
|----------|------|------|------|
| `hmw.hmw_statements` | array | Yes | HMW statement list; count must be in 8-12 range |
| `hmw.hmw_statements[].id` | string | Yes | HMW unique identifier, format hmw-NNN |
| `hmw.hmw_statements[].statement` | string | Yes | HMW statement text; must not be empty and must not contain specific solutions |
| `hmw.hmw_statements[].dimension` | string | Yes | Belonging dimension; must be one of eliminate_barriers/enhance_experience/create_value/redefine |
| `hmw.hmw_statements[].problem_ref` | string | Yes | Referenced Problem Statement field; must not be empty |
| `hmw.hmw_statements[].data_source` | string | Yes | Data source reference; must not be empty |
| `hmw.hmw_statements[].innovation_space` | number | Yes | Innovation space score 1-5; >= 4 requires human emphasis review |
| `hmw.hmw_statements[].confidence` | number | Yes | Confidence 0-1 |
| `hmw.dimension_coverage` | object | Yes | All 4 dimensions must appear with value >= 1 |
| `hmw.dimension_coverage.eliminate_barriers` | number | Yes | Eliminate barriers dimension HMW count, >= 2 |
| `hmw.dimension_coverage.enhance_experience` | number | Yes | Enhance experience dimension HMW count, >= 2 |
| `hmw.dimension_coverage.create_value` | number | Yes | Create new value dimension HMW count, >= 2 |
| `hmw.dimension_coverage.redefine` | number | Yes | Redefine dimension HMW count, >= 2 |

#### brief Validation

| Field Path | Type | Required | Description |
|----------|------|------|------|
| `brief.title` | string | Yes | Opportunity brief title; format [Target user group]-[Core pain point summary] |
| `brief.problem_statement` | string | Yes | Structured problem statement; must not be empty |
| `brief.evidence_summary.user_research` | object | Yes | User research evidence; must include pain point frequency and behavioral corroboration |
| `brief.evidence_summary.market_analysis` | object | Yes | Market analysis evidence; must include SOM estimate |
| `brief.evidence_summary.competitive_landscape` | object | Yes | Competitive landscape evidence; must include market gap analysis |
| `brief.opportunity_score.weighted_total` | number | Yes | Weighted total score; must not be null (human must have completed strategic fit scoring) |
| `brief.hmw_statements` | array | Yes | HMW statement list; must not be empty array |
| `brief.key_assumptions` | array | Yes | Key assumption list; must not be empty array |
| `brief.key_assumptions[].assumption` | string | Yes | Assumption description; must not be empty |
| `brief.key_assumptions[].type` | string | Yes | Assumption type; must be one of desirability/viability/feasibility/usability |
| `brief.key_assumptions[].testability` | string | Yes | Testability description; must not be empty |
| `brief.key_assumptions[].risk_if_wrong` | string | Yes | Risk level; must be one of high/medium/low |
| `brief.recommended_next_step` | string | Yes | Recommended next step; must be based on scoring and assumption risk analysis |
| `brief.human_decisions_needed` | array | Yes | Human decision items list; high-risk assumptions must have corresponding decision items |
| `brief.human_decisions_needed[].item` | string | Yes | Decision item; must not be empty |
| `brief.human_decisions_needed[].context` | string | Yes | Decision context; must not be empty |
| `brief.human_decisions_needed[].urgency` | string | Yes | Urgency; must be one of high/medium/low |

### Output JSON Example

```json
{
  "scoring": {
    "opportunities": [
      {
        "name": "Multi-channel data reconciliation automation",
        "scores": {
          "problem_validity": { "score": 4, "weight": 0.30, "evidence": "Pain point mention rate 12%, behavioral data shows users repeatedly trying to resolve", "needs_human": false },
          "market_size": { "score": 3, "weight": 0.25, "evidence": "SOM estimate approximately 30 million", "needs_human": false },
          "feasibility": { "score": 4, "weight": 0.20, "evidence": "Current tech stack needs minor extension", "needs_human": false },
          "strategic_fit": { "score": null, "weight": 0.15, "evidence": "AI analysis: This opportunity is highly relevant to core strategic direction, recommended score 4-5", "needs_human": true },
          "competitive_moat": { "score": 3, "weight": 0.10, "evidence": "Competitors have partial capability but poor experience", "needs_human": false }
        },
        "weighted_total": null,
        "provisional_rank": null
      }
    ],
    "metadata": {
      "scoring_version": "1.0",
      "awaiting_human_input": true,
      "pending_dimensions": ["strategic_fit"]
    }
  },
  "problem_statement": {
    "problem_statement": "SaaS product operations staff with MAU exceeding 1000, during end-of-month settlement peak, need to quickly verify multi-channel data consistency, but currently face the core pain point of manual comparison being time-consuming and error-prone, because existing tools only support single-channel data export and lack automatic verification capability, if this problem is solved, they will reduce data reconciliation time from an average of 4 hours to under 30 minutes.",
    "data_support": {
      "pain_point_frequency": "12.3%",
      "behavioral_evidence": "78% of users repeatedly export and manually compare data at month-end",
      "confidence": 0.88
    },
    "template_elements": {
      "target_user": "SaaS product operations staff with MAU exceeding 1000",
      "scenario": "End-of-month settlement peak",
      "task": "Quickly verify multi-channel data consistency",
      "core_pain": "Manual comparison is time-consuming and error-prone",
      "current_gap": "Existing tools only support single-channel data export and lack automatic verification capability",
      "expected_benefit": "Data reconciliation time reduced from average 4 hours to under 30 minutes"
    },
    "quality_check": {
      "specific_user_group": { "passed": true, "detail": "Specified 'SaaS product operations staff with MAU exceeding 1000'" },
      "specific_scenario": { "passed": true, "detail": "Specified 'end-of-month settlement peak'" },
      "current_solution_gap": { "passed": true, "detail": "Described 'only support single-channel data export and lack automatic verification capability'" },
      "verifiable": { "passed": true, "detail": "Expected benefit is quantifiable: 4 hours -> 30 minutes" },
      "no_solution_preset": { "passed": true, "detail": "Problem description does not contain specific solutions" },
      "all_passed": true,
      "retry_count": 0
    }
  },
  "hmw": {
    "hmw_statements": [
      {
        "id": "hmw-001",
        "statement": "How might we eliminate the cognitive burden barrier for new users during initial setup?",
        "dimension": "eliminate_barriers",
        "problem_ref": "problem_statement.core_pain",
        "data_source": "voice-analysis.json::pain_point_frequency=12%",
        "innovation_space": 4,
        "confidence": 0.85
      },
      {
        "id": "hmw-002",
        "statement": "How might we make the report generation experience faster?",
        "dimension": "enhance_experience",
        "problem_ref": "problem_statement.current_gap",
        "data_source": "behavior-analysis.json::avg_report_time=10min",
        "innovation_space": 3,
        "confidence": 0.90
      }
    ],
    "dimension_coverage": {
      "eliminate_barriers": 3,
      "enhance_experience": 3,
      "create_value": 3,
      "redefine": 2
    },
    "metadata": {
      "total_count": 11,
      "high_innovation_count": 4
    }
  },
  "brief": {
    "title": "SaaS Operations Staff - Multi-channel Data Reconciliation Time-consuming and Error-prone",
    "problem_statement": "SaaS product operations staff with MAU exceeding 1000, during end-of-month settlement peak, need to quickly verify multi-channel data consistency, but currently face the core pain point of manual comparison being time-consuming and error-prone, because existing tools only support single-channel data export and lack automatic verification capability, if this problem is solved, they will reduce data reconciliation time from an average of 4 hours to under 30 minutes.",
    "evidence_summary": {
      "user_research": {
        "pain_point_frequency": "12.3% of users mentioned this pain point",
        "behavioral_evidence": "78% of target users repeatedly manually export and compare at month-end",
        "persona_summary": "Mainly affected group is mid-sized SaaS product operations staff",
        "core_jobs": "Data reconciliation, report generation, anomaly investigation",
        "need_type": "Basic need (Kano model), strong dissatisfaction when absent"
      },
      "market_analysis": {
        "tam": "5 billion",
        "sam": "1.5 billion",
        "som": "120 million",
        "growth_rate": "Annual growth rate approximately 25%"
      },
      "competitive_landscape": {
        "competitor_capabilities": "Mainstream competitors only support single-channel data management",
        "market_gap": "Multi-channel data automatic reconciliation capability missing",
        "barrier_analysis": "Data integration capability constitutes a certain barrier"
      }
    },
    "opportunity_score": {
      "weighted_total": 3.85,
      "dimensions": {
        "problem_validity": { "score": 4, "weight": 0.30 },
        "market_size": { "score": 4, "weight": 0.25 },
        "feasibility": { "score": 4, "weight": 0.20 },
        "strategic_fit": { "score": 4, "weight": 0.15 },
        "competitive_moat": { "score": 3, "weight": 0.10 }
      }
    },
    "hmw_statements": [
      { "id": "hmw-001", "statement": "How might we eliminate the cognitive burden barrier for new users during initial setup?", "innovation_space": 4 },
      { "id": "hmw-002", "statement": "How might we make the report generation experience faster?", "innovation_space": 3 }
    ],
    "key_assumptions": [
      { "assumption": "Target users are willing to pay for automatic reconciliation feature", "type": "viability", "testability": "Verified through willingness-to-pay research or MVP pricing test", "risk_if_wrong": "High" },
      { "assumption": "Multi-channel data interfaces can be unified and standardized", "type": "feasibility", "testability": "Verified through technical feasibility study of 3-5 mainstream channel data interfaces", "risk_if_wrong": "High" }
    ],
    "recommended_next_step": "Recommend entering solution exploration phase, prioritizing validation of high-risk assumptions (willingness to pay and data interface standardization), which can be advanced in parallel through smoke testing and technical feasibility study.",
    "human_decisions_needed": [
      { "item": "Confirm strategic fit score", "context": "AI recommends score 4; need human confirmation of alignment with company strategic direction", "urgency": "High" },
      { "item": "Confirm validation priority for high-risk assumptions", "context": "2 high-risk assumptions need decision on validation order and resource allocation", "urgency": "High" }
    ]
  },
  "metadata": {
    "version": "1.0",
    "generated_at": "2026-05-14T21:00:00Z",
    "source_files": [
      "output/pm-discovery/user-research-voice-analysis/voice-analysis.json",
      "output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json",
      "output/pm-discovery/market-tam-som/tam-som.json",
      "output/pm-discovery/market-competitor-analysis/competitor-analysis.json"
    ]
  }
}
```

## Decision Rules

1. **Strategic fit must be human-judged**: AI only provides analysis suggestions, does not auto-score; weighted total calculated after human judgment
2. **Problem Statement quality check auto-fix on failure**: Targeted fix based on failed check items, max 3 retries; escalate to human if still not passed after 3 retries
3. **HMW with innovation space >= 4 requires human emphasis review**: These statements may lead to breakthrough innovation but may also deviate from core problems
4. **HMW with innovation space < 3 can be quickly approved**: Leans toward incremental improvement, lower risk
5. **At least 1 HMW retained per dimension**: Ensure comprehensiveness of opportunity exploration
6. **Key assumptions with risk level "high" must be annotated**: Assumptions with `risk_if_wrong` as "high" must have corresponding decision items listed in `human_decisions_needed`
7. **Recommended next step must be data-based**: Must be based on scoring results and assumption risk analysis; cannot be arbitrarily suggested

## Quality Checks

| Check Item | Pass Condition |
|--------|----------|
| Opportunity scoring complete | All 5 dimensions have score values or marked as needs_human; strategic fit marked as needs_human |
| Scoring basis complete | Each dimension's evidence field is non-empty |
| Weight consistency | Sum of 5 dimension weights = 1.00 |
| Problem Statement 5 quality checks all passed | `quality_check.all_passed === true` |
| Data support complete | pain_point_frequency, behavioral_evidence, confidence all non-empty |
| HMW 4 dimensions all covered | All 4 dimensions in `dimension_coverage` >= 1 |
| Each HMW has data support | Each HMW's `data_source` is non-empty |
| HMW statements avoid solution presets | Statements do not contain specific product feature or technical solution descriptions |
| HMW total count within requirement | `total_count` in 8-12 range |
| All evidence summaries filled | All 3 sub-fields of `evidence_summary` have content |
| Key assumptions list testability | Each `key_assumptions`'s `testability` is non-empty |
| Human decision items specified | `human_decisions_needed` is non-empty and each item includes item/context/urgency |
| High-risk assumptions have corresponding decision items | Assumptions with `risk_if_wrong` as "high" have corresponding items in `human_decisions_needed` |

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|----------|
| User research data (voice-analysis / behavior-analysis) | User describes opportunity -> score and generate Problem Statement based on description | `problem_validity.score` defaults to 2, `data_support.pain_point_frequency` is user-estimated value, `confidence` < 0.5 |
| Market analysis data (tam-som) | User describes opportunity -> market size dimension scored based on user estimate | `market_size.score` based on user estimate, `evidence` annotated "lacking market data" |
| Competitor analysis data (competitor-analysis) | User describes opportunity -> competitive moat dimension scored based on user description | `competitive_moat.score` based on user description, `evidence` annotated "lacking competitor data" |
| Need insight data (persona / insight-analysis) | Generate directly based on user description | `template_elements.target_user` may use generic terms, `quality_check.specific_user_group` may not pass |
| All upstream files missing | Prompt user to execute prior stages first, or execute directly based on user's verbal description of opportunity | Multiple dimensions use default values, `weighted_total` credibility extremely low, `quality_check` multiple items may not pass, Brief decision value significantly reduced |

## Data Acquisition Instructions

This Skill requires user research, market analysis, and competitor analysis data. Please provide via one of the following methods:
  1. Directly describe the opportunity, target users, and core pain points
  2. Upload voice-analysis.json / tam-som.json / competitor-analysis.json files
  3. Provide data file paths
- AI is not responsible for external data collection; only for analysis

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Data Source | Change Type | Impact Dimension | Impact Description | Response Strategy |
|-----------|----------|----------|----------|----------|
| voice-analysis.json | Pain point mention rate update | scoring.problem_validity / problem_statement.data_support | Pain point frequency changes affect scoring and Problem Statement | Recalculate problem_validity score, update data_support and core_pain |
| behavior-analysis.json | Behavioral pattern data update | scoring.problem_validity / hmw.enhance_experience | Behavioral data changes affect scoring and HMW | Re-evaluate behavioral corroboration, update affected HMW's data_source and confidence |
| tam-som.json | SOM estimate adjustment | scoring.market_size / brief.evidence_summary.market_analysis | SOM value changes affect scoring and Brief | Recalculate market_size score, update Brief market analysis evidence |
| competitor-analysis.json | Competitor capability change | scoring.competitive_moat / brief.evidence_summary.competitive_landscape | Competitor changes affect scoring and Brief | Recalculate competitive_moat score, update Brief competitive landscape evidence |
| persona.json | User persona adjustment | problem_statement.template_elements.target_user | User group definition changes | Update target_user, re-execute specific_user_group check |
| insight-analysis.json | Insight analysis change | problem_statement.template_elements.task | User task definition changes | Update task element, re-execute quality check |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Field | Notification Timing | Notification Content |
|-----------|----------|----------|----------|
| Decision makers/stakeholders | `brief.title` / `scoring.opportunities[].weighted_total` | After Brief core conclusions change | Notify opportunity brief title and scoring changes; prompt re-review needed |
| Subsequent stages (solution exploration) | `brief.recommended_next_step` / `brief.key_assumptions` | After recommended action or assumptions change | Notify next step action adjustments and assumption changes requiring validation |

## Changelog

- v1.0: Merged opportunity-scoring + opportunity-problem-statement + opportunity-hmw + opportunity-brief into opportunity-definition, integrating 4 steps into a unified process
