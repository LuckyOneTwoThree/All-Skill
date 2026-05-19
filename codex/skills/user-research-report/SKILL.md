---
name: user-research-report
description: "Use when producing a complete user research report. Auto-generates user research report integrating voice analysis, behavior analysis, user modeling, and interview data with methodology and action recommendations. Keywords: user research report, user survey report, user insight report, research report, user analysis report."
metadata:
  module: "Product Discovery"
  sub-module: "User Research"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me produce a user research report"
    - "How to organize user research results"
    - "Generate a user analysis report"
execution_depth:
  default: standard
  quick_description: "Output research conclusions and recommendations"
  deep_description: "Full report + research methodology reflection + insight deep analysis + action recommendation roadmap"
---

# User Research Report Auto-Generation

## Core Principles

1. **Insight over data** -- Data is evidence, insight is conclusion; every piece of data must answer "what does this mean for the product"
2. **User voice first** -- Direct quotes from users are more persuasive than AI summaries
3. **Action-oriented** -- Research is not the goal; driving product improvement is the goal
4. **Methodology transparency** -- The credibility of research conclusions depends on methodology transparency

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User voice analysis | JSON | No | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | Sentiment distribution, theme clustering, pain point extraction |
| Behavior analysis | JSON | No | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | Funnel health, Aha Moment, feature usage depth |
| User modeling | JSON | No | output/pm-discovery/user-research-user-modeling/persona.json | Persona, Empathy Map, Journey Map |
| Interview data | JSON | No | output/pm-discovery/user-research-interview-assist/interview-script.json | Interview scripts, interview records, insight extraction |
| Research objectives | string | Yes | User provided | Core questions this research aims to answer |
| Product/category information | string | No | User provided | Product name, category, target market |

## Execution Steps

### Step 1: Research Background and Objectives [Core]

Based on user-provided research objectives and product information, clarify:

- Research background: Why this research is being conducted
- Core research questions: 3-5 key questions to answer
- Research scope: Target user groups, product scope, time range
- Research methodology overview: Methods used (VOC analysis/behavioral analysis/interviews/surveys)

### Step 2: User Persona Integration [Core]

Integrate persona.json data to generate readable user persona sections:

| Persona Element | Data Source | Report Presentation |
|----------|---------|---------|
| Basic attributes | persona -> demographics | Demographic description |
| Behavioral characteristics | output/pm-discovery/user-research-behavior-analysis/usage_patterns | Usage habit description |
| Goals and motivations | persona -> goals | Quotes + summary |
| Pain points and frustrations | output/pm-discovery/user-research-voice-analysis/pain_points | Quotes + frequency annotation |
| Empathy map | persona -> empathy_map | Mind map description |

**Persona count rules**:
- 2-4 core Personas
- Each Persona annotated with representative user quotes (at least 2)

### Step 3: User Journey Integration [Core]

Integrate Journey Map and behavioral data:

**Journey stage division**:
```
Awareness -> Evaluation -> First Use -> Deep Use -> Churn/Retention
```

Each stage includes:

| Dimension | Content |
|------|------|
| User behavior | What they actually did (behavioral data support) |
| Touchpoints | Interaction points with the product |
| Emotion curve | Peaks/valleys/key moments |
| Pain points | Core obstacles at this stage |
| Opportunities | Room for improvement |

**Key metrics embedded**:
- Funnel conversion rates (from behavior-analysis)
- Aha Moment trigger conditions
- Churn warning signals

### Step 4: Insight Extraction [Core]

Extract core insights from all upstream data:

**Insight extraction rules**:
- Each insight = Observation + Evidence + Product implication
- Evidence must be annotated with source (VOC/behavior/interview)
- Insights sorted by impact scope: Global > Local

**Insight categories**:

| Category | Description | Example |
|------|------|------|
| Need insight | What users really want | "Users don't want a faster horse; they want shorter commute time" |
| Pain point insight | Essence of core obstacles | "Not insufficient features, but inability to find features" |
| Behavioral insight | Actual user behavior vs. expected | "Users who don't complete first operation within 3 days of registration have 87% churn rate" |
| Opportunity insight | Unmet need space | "40% of users abandon after searching; opportunity for intent understanding" |

### Step 5: Action Recommendations [Deep]

Generate actionable product improvement recommendations based on insights:

| Recommendation Element | Requirement |
|----------|------|
| Recommendation description | Specific enough to be actionable |
| Corresponding insight | Cite supporting insight number |
| Expected impact | Assessment of impact on core metrics |
| Priority | P0 (must do) / P1 (should do) / P2 (could do) |
| Validation method | How to verify improvement effectiveness |

**Priority derivation rules**:
- Pain points affecting core funnel -> P0
- Obstacles affecting retention/engagement -> P1
- Experience optimization recommendations -> P2

### Step 6: Report Assembly [Core]

Assemble all sections into a complete Markdown report:

**Report structure**:

```
# {Product Name} User Research Report

## Executive Summary
- Research overview (one paragraph)
- 3 key findings
- Top 1 action recommendation

## 1. Research Background and Methodology
- Research objectives
- Research questions
- Research methods and sample
- Data sources and limitations

## 2. User Personas
### 2.1 Core User Group A: {Name}
- Basic attributes
- Goals and motivations
- Core pain points
- Representative quotes
### 2.2 Core User Group B: {Name}
- ...

## 3. User Journey
- Journey overview map
- Stage-by-stage analysis
- Key moments (Aha Moment / Churn points)
- Emotion curve

## 4. Core Insights
### 4.1 Need Insights
### 4.2 Pain Point Insights
### 4.3 Behavioral Insights
### 4.4 Opportunity Insights

## 5. Action Recommendations
| Priority | Recommendation | Corresponding Insight | Expected Impact | Validation Method |
|--------|------|---------|---------|---------|

## Appendix
- Data source list
- Detailed methodology description
- Sample description and limitations
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | research conclusions and recommendations | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full report + research methodology reflection + insight deep analysis + action recommendation roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage path**: `output/pm-discovery/user-research-report/`

**Output files**:

| File | Format | Description |
|------|------|------|
| user-research-report.md | Markdown | Complete user research report |
| user-research-report.json | JSON | Structured data (for downstream Skill reference) |

**user-research-report.json structure**:

**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_metadata", "executive_summary", "personas", "insights", "recommendations"],
  "properties": {
    "report_metadata": {"type": "object", "description": "Report metadata, including product name, research objectives, and confidence"},
    "executive_summary": {"type": "object", "description": "Executive summary, including overview, key findings, and top recommendation"},
    "personas": {"type": "array", "description": "User persona list"},
    "journey": {"type": "object", "description": "User journey, including stages, emotion curve, and key moments"},
    "insights": {"type": "array", "description": "Core insight list"},
    "recommendations": {"type": "array", "description": "Action recommendation list"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| report_metadata | object | Yes | Report metadata |
| report_metadata.product | string | Yes | Product name |
| report_metadata.research_goals | string[] | Yes | Research objective list, must not be empty |
| report_metadata.generated_at | string | Yes | Generation timestamp |
| report_metadata.data_sources | string[] | Yes | Data source list |
| report_metadata.overall_confidence | number | Yes | Overall confidence, 0-1 |
| executive_summary | object | Yes | Executive summary |
| executive_summary.overview | string | Yes | Research overview, one paragraph |
| executive_summary.key_findings | string[] | Yes | Key findings, must be >= 3 |
| executive_summary.top_recommendation | string | Yes | Top 1 action recommendation |
| personas | array | Yes | User persona list, 2-4 |
| personas[].name | string | Yes | User group name |
| personas[].demographics | object | No | Demographic information |
| personas[].goals | string[] | No | Goals and motivations list |
| personas[].pain_points | string[] | No | Core pain points list |
| personas[].quotes | string[] | Yes | Representative quotes, >= 2 per Persona |
| journey | object | No | User journey |
| journey.stages | array | No | Journey stage list |
| journey.stages[].name | string | Yes | Stage name |
| journey.stages[].behaviors | string[] | Yes | User behaviors |
| journey.stages[].touchpoints | string[] | No | Touchpoint list |
| journey.stages[].emotion_peak | string | No | Emotion peak description |
| journey.stages[].emotion_valley | string | No | Emotion valley description |
| journey.stages[].pain_points | string[] | Yes | Pain points |
| journey.stages[].opportunities | string[] | Yes | Opportunities |
| journey.stages[].metrics | object | No | Key metrics (conversion rate, retention rate, etc.) |
| journey.aha_moment | string | No | Aha Moment description |
| journey.churn_signals | string[] | No | Churn signal list |
| insights | array | Yes | Core insight list, <= 15 |
| insights[].id | string | Yes | Insight ID, format INS-XXX |
| insights[].category | string | Yes | Insight category enum: need/pain_point/behavior/opportunity |
| insights[].observation | string | Yes | Observation description |
| insights[].evidence | string | Yes | Evidence and source |
| insights[].implication | string | Yes | Product implication |
| insights[].scope | string | Yes | Impact scope enum: global/local |
| recommendations | array | Yes | Action recommendation list, >= 3 |
| recommendations[].id | string | Yes | Recommendation ID, format REC-XXX |
| recommendations[].description | string | Yes | Recommendation description |
| recommendations[].linked_insights | string[] | Yes | Linked insight IDs |
| recommendations[].expected_impact | string | Yes | Expected impact |
| recommendations[].priority | string | Yes | Priority enum: P0/P1/P2 |
| recommendations[].validation_method | string | Yes | Validation method |

```json
{
  "report_metadata": {
    "product": "Product name",
    "research_goals": [],
    "generated_at": "Timestamp",
    "data_sources": [],
    "overall_confidence": 0.0
  },
  "executive_summary": {
    "overview": "One paragraph",
    "key_findings": [],
    "top_recommendation": ""
  },
  "personas": [
    {
      "name": "User group name",
      "demographics": {},
      "goals": [],
      "pain_points": [],
      "quotes": []
    }
  ],
  "journey": {
    "stages": [
      {
        "name": "Stage name",
        "behaviors": [],
        "touchpoints": [],
        "emotion_peak": "",
        "emotion_valley": "",
        "pain_points": [],
        "opportunities": [],
        "metrics": {}
      }
    ],
    "aha_moment": "",
    "churn_signals": []
  },
  "insights": [
    {
      "id": "INS-001",
      "category": "need/pain_point/behavior/opportunity",
      "observation": "Observation description",
      "evidence": "Evidence and source",
      "implication": "Product implication",
      "scope": "global/local"
    }
  ],
  "recommendations": [
    {
      "id": "REC-001",
      "description": "Recommendation description",
      "linked_insights": ["INS-001"],
      "expected_impact": "Expected impact",
      "priority": "P0/P1/P2",
      "validation_method": "Validation method"
    }
  ]
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| All upstream data missing | Generate report based on research objectives and AI knowledge base, annotate "lacking empirical data; recommend supplementing research" |
| Only VOC data available | Focus on sentiment and pain point insights; behavioral insights annotated "lacking behavioral data" |
| Only behavioral data available | Focus on funnel and usage depth; need insights annotated "lacking user voice data" |
| Persona count > 6 | Sort by user volume and take top 4 |
| Insight count > 15 | Sort by impact scope and priority, take top 10 |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Executive summary contains 3 key findings + Top 1 recommendation
- [ ] Each Persona has representative user quotes

### P1 Checks (must pass for standard/deep)

- [ ] User journey includes emotion curve and key moments
- [ ] Each insight has observation + evidence + implication triad
- [ ] At least 3 action recommendations, each with priority and validation method
- [ ] Data sources and limitations described

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|----------|----------|
| voice-analysis missing | User personas and pain points based on behavioral data and AI inference | Pain point insights lack user quote support | Request user to upload voice-analysis.json or provide user feedback text for sentiment extraction |
| behavior-analysis missing | Journey and behavioral insights based on VOC and interview data | Behavioral insights lack quantitative data | Request user to upload behavior-analysis.json or provide event/funnel data for behavioral analysis |
| persona missing | Derive user personas from VOC and behavioral data | Personas may be less refined | Request user to upload persona.json or describe target user characteristics |
| interview data missing | Insights based on VOC and behavioral data | Lacking deep qualitative insights | Request user to provide interview notes or transcript text |
| All upstream data missing | Generate based on research objectives and AI knowledge base; overall confidence reduced | Report requires significant human supplementation and validation | Request user to provide research objectives and product/category information, or upload voice-analysis.json / behavior-analysis.json / persona.json |
| If user does not provide research objectives | Prompt user to provide research objectives; otherwise cannot determine report focus | Cannot generate targeted report | Prompt user to specify research objectives (e.g., "understand churn reasons", "evaluate feature satisfaction") |
| If user does not provide product/category information | Skip input-related steps; product-related descriptions in report based on inference | Product background description may be inaccurate | Prompt user to provide product name and category (e.g., "SaaS CRM", "e-commerce platform") |

---

## Upstream Change Response

### Upstream Change Impact

| Upstream Skill | Change Type | Impact Scope | Response Action |
|-----------|---------|---------|---------|
| user-research-voice-analysis | voice-analysis.json structure change | Sentiment distribution, pain points, theme data format changes | Check input field mapping, adapt to new structure; mark "upstream data format anomaly" when incompatible |
| user-research-voice-analysis | voice-analysis.json content update | Pain point severity, sentiment distribution, segment result changes | Re-integrate user personas and pain point insights; annotate "rebuilt based on updated data" |
| user-research-behavior-analysis | behavior-analysis.json structure change | Funnel, Aha Moment, feature usage data format changes | Check input field mapping, adapt to new structure; mark "upstream data format anomaly" when incompatible |
| user-research-behavior-analysis | behavior-analysis.json content update | Funnel health, behavioral paths, anomaly detection result changes | Re-integrate user journey and behavioral insights; annotate "rebuilt based on updated data" |
| user-research-user-modeling | persona.json structure change | Persona field mapping changes | Check input field mapping, adapt to new structure; mark "upstream data format anomaly" when incompatible |
| user-research-user-modeling | persona.json content update | Persona characteristics, pain points, JTBD changes | Re-integrate user persona section; annotate "rebuilt based on updated Persona" |
| user-research-interview-assist | interview-insights.json structure change | Interview insights, cross-interview pattern data format changes | Check input field mapping, adapt to new structure; mark "upstream data format anomaly" when incompatible |
| user-research-interview-assist | interview-insights.json content update | Validated/refuted hypotheses, new discoveries, Persona update changes | Re-integrate insights and action recommendations; annotate "rebuilt based on updated interview data" |

### Downstream Notification Mechanism

This Skill is a terminal Skill with no downstream dependencies; does not involve downstream notifications.
