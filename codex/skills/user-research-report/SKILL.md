---
name: user-research-report
description: Use when there is a need to produce a complete user research report. Automated user research report generation, integrating voice of customer analysis, behavior analysis, user modeling, and interview data, supplementing research methodology descriptions and action recommendations, outputting a structured Markdown report. Keywords: user research report, user survey report, user insight report, research report, user analysis report, survey report, user analysis, produce report.
metadata:
  module: "Product Discovery"
  sub-module: "User Research"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["General"]
  trigger_examples:
    - "Help me produce a user research report"
    - "How to organize user research results"
    - "Produce a user analysis report"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output research conclusions and recommendations"
  deep_description: "Complete report + research methodology reflection + insight deep analysis + action recommendation roadmap"
---

# Automated User Research Report Generation

## Core Principles

1. **Insight over Data** — Data is evidence, insight is conclusion; every piece of data must answer "what does this mean for the product"
2. **User Voice First** — Direct quotes from users are more persuasive than AI summaries
3. **Action-Oriented** — Research is not the goal; driving product improvement is the goal
4. **Methodology Transparency** — The credibility of research conclusions depends on the transparency of the methodology

## Interaction Mode

🤖→👤 AI Suggests, Human Approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Voice of Customer Analysis | JSON | ○ | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | Sentiment distribution, topic clustering, pain point extraction |
| Behavior Analysis | JSON | ○ | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | Funnel health, Aha Moment, feature usage depth |
| User Modeling | JSON | ○ | output/pm-discovery/user-research-user-modeling/persona.json | Persona, Empathy Map, Journey Map |
| Interview Data | JSON | ○ | output/pm-discovery/user-research-interview-assist/interview-script.json | Interview scripts, interview records, insight extraction |
| Research Objectives | string | Yes | User provided | Core questions this research aims to answer |
| Product/Category Information | string | ○ | User provided | Product name, category, target market |

## Execution Steps

### Step 1: Research Background and Objectives Review [Core]

Based on user-provided research objectives and product information, clarify:

- Research background: Why this research is being conducted
- Core research questions: 3-5 key questions to answer
- Research scope: Target user group, product scope, time range
- Research methodology overview: Which methods were used (VOC analysis/behavior analysis/interviews/surveys)

### Step 2: User Persona Integration [Core]

Integrate persona.json data to generate a readable user persona chapter:

| Persona Element | Data Source | Report Presentation |
|----------|---------|---------|
| Demographics | persona → demographics | Demographic description |
| Behavioral characteristics | output/pm-discovery/user-research-behavior-analysis/usage_patterns | Usage habit description |
| Goals and motivations | persona → goals | Quotes + summary |
| Pain points and frustrations | output/pm-discovery/user-research-voice-analysis/pain_points | Quotes + frequency annotation |
| Empathy map | persona → empathy_map | Mind map description |

**Persona Quantity Rules**:
- 2-4 core Personas
- Each Persona annotated with representative user quotes (at least 2)

### Step 3: User Journey Integration [Core]

Integrate Journey Map and behavior data:

**Journey Stage Division**:
```
Awareness → Evaluation → First Use → Deep Use → Churn/Renewal
```

Each stage includes:

| Dimension | Content |
|------|------|
| User behavior | What users actually did (supported by behavior data) |
| Touchpoints | Interaction points with the product |
| Emotion curve | Peaks/valleys/key moments |
| Pain points | Core obstacles at this stage |
| Opportunities | Room for improvement |

**Key Metrics Embedded**:
- Funnel conversion rates (from behavior-analysis)
- Aha Moment trigger conditions
- Churn warning signals

### Step 4: Insight Extraction [Core]

Extract core insights from all upstream data:

**Insight Extraction Rules**:
- Each insight = observation + evidence + product implication
- Evidence must be annotated with source (VOC/behavior/interview)
- Insights sorted by impact scope: global > local

**Insight Classification**:

| Category | Description | Example |
|------|------|------|
| Need insight | What users really want | "Users don't want a faster horse; they want shorter commute times" |
| Pain point insight | The essence of core obstacles | "It's not that features are lacking, but that features can't be found" |
| Behavior insight | Actual user behavior vs. expectations | "Users who don't complete their first action within 3 days of registration have an 87% churn rate" |
| Opportunity insight | Unmet need spaces | "40% of users abandon after searching; there's an opportunity in intent understanding" |

### Step 5: Action Recommendations [Core]

Generate actionable product improvement recommendations based on insights:

| Recommendation Element | Requirement |
|----------|------|
| Recommendation description | Specific enough to be actionable |
| Linked insight | Reference the supporting insight ID |
| Expected impact | Assessment of impact on core metrics |
| Priority | P0 (must do) / P1 (should do) / P2 (could do) |
| Validation method | How to verify the improvement effect |

**Priority Derivation Rules**:
- Pain points affecting core funnel → P0
- Obstacles affecting retention/engagement → P1
- Experience optimization recommendations → P2

### Step 6: Report Assembly [Core]

Integrate all chapters into a complete Markdown report:

**Report Structure**:

```
# <Product Name> User Research Report

## Executive Summary
- Research overview (one paragraph)
- 3 core findings
- Top 1 action recommendation

## 1. Research Background and Methods
- Research objectives
- Research questions
- Research methods and sample
- Data sources and limitations

## 2. User Personas
### 2.1 Core User Group A: {Name}
- Demographics
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
### 4.3 Behavior Insights
### 4.4 Opportunity Insights

## 5. Action Recommendations
| Priority | Recommendation | Linked Insight | Expected Impact | Validation Method |
|--------|------|---------|---------|---------|

## Appendix
- Data source list
- Detailed research methodology description
- Sample description and limitations
```

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Research conclusions and recommendations | Core conclusions + minimum viable deliverable |
| standard | Complete deliverable (current default) | Complete deliverable, including all Step outputs |
| deep | Complete report + research methodology reflection + insight deep analysis + action recommendation roadmap | Complete deliverable + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-discovery/user-research-report/`

**Output Files**:

| File | Format | Description |
|------|------|------|
| user-research-report.md | Markdown | Complete user research report |
| user-research-report.json | JSON | Structured data (for downstream Skill reference) |

**user-research-report.json Structure**:

**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_metadata", "executive_summary", "personas", "insights", "recommendations"],
  "properties": {
    "report_metadata": {"type": "object", "description": "Report metadata, including product name, research objectives, and confidence"},
    "executive_summary": {"type": "object", "description": "Executive summary, including overview, core findings, and top recommendation"},
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
| report_metadata.research_goals | string[] | Yes | Research objectives list, cannot be empty |
| report_metadata.generated_at | string | Yes | Generation timestamp |
| report_metadata.data_sources | string[] | Yes | Data source list |
| report_metadata.overall_confidence | number | Yes | Overall confidence, 0-1 |
| executive_summary | object | Yes | Executive summary |
| executive_summary.overview | string | Yes | Research overview, one paragraph |
| executive_summary.key_findings | string[] | Yes | Core findings, must be ≥ 3 |
| executive_summary.top_recommendation | string | Yes | Top 1 action recommendation |
| personas | array | Yes | User persona list, 2-4 items |
| personas[].name | string | Yes | User group name |
| personas[].demographics | object | No | Demographic information |
| personas[].goals | string[] | No | Goals and motivations list |
| personas[].pain_points | string[] | No | Core pain points list |
| personas[].quotes | string[] | Yes | Representative quotes, ≥ 2 per Persona |
| journey | object | No | User journey |
| journey.stages | array | No | Journey stages list |
| journey.stages[].name | string | Yes | Stage name |
| journey.stages[].behaviors | string[] | Yes | User behaviors |
| journey.stages[].touchpoints | string[] | No | Touchpoints list |
| journey.stages[].emotion_peak | string | No | Emotion peak description |
| journey.stages[].emotion_valley | string | No | Emotion valley description |
| journey.stages[].pain_points | string[] | Yes | Pain points |
| journey.stages[].opportunities | string[] | Yes | Opportunities |
| journey.stages[].metrics | object | No | Key metrics (conversion rate, retention rate, etc.) |
| journey.aha_moment | string | No | Aha Moment description |
| journey.churn_signals | string[] | No | Churn signals list |
| insights | array | Yes | Core insight list, ≤ 15 items |
| insights[].id | string | Yes | Insight ID, format INS-XXX |
| insights[].category | string | Yes | Insight category enum: need/pain_point/behavior/opportunity |
| insights[].observation | string | Yes | Observation description |
| insights[].evidence | string | Yes | Evidence and source |
| insights[].implication | string | Yes | Product implication |
| insights[].scope | string | Yes | Impact scope enum: global/local |
| recommendations | array | Yes | Action recommendation list, ≥ 3 items |
| recommendations[].id | string | Yes | Recommendation ID, format REC-XXX |
| recommendations[].description | string | Yes | Recommendation description |
| recommendations[].linked_insights | string[] | Yes | Linked insight IDs list |
| recommendations[].expected_impact | string | Yes | Expected impact |
| recommendations[].priority | string | Yes | Priority enum: P0/P1/P2 |
| recommendations[].validation_method | string | Yes | Validation method |

```json
{
  "report_metadata": {
    "product": "Product Name",
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
      "name": "User Group Name",
      "demographics": {},
      "goals": [],
      "pain_points": [],
      "quotes": []
    }
  ],
  "journey": {
    "stages": [
      {
        "name": "Stage Name",
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
| All upstream data missing | Generate report based on research objectives and AI knowledge base, annotate "lacks empirical data, recommend supplementary research" |
| Only VOC data available | Focus on sentiment and pain point insights, annotate behavior insights as "lacks behavior data" |
| Only behavior data available | Focus on funnel and usage depth, annotate need insights as "lacks user voice data" |
| Persona count > 6 | Sort by user volume and take Top 4 |
| Insight count > 15 | Sort by impact scope and priority, take Top 10 |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Executive summary contains 3 core findings + Top 1 recommendation
- [ ] Each Persona has representative user quotes

### P1 Checks (must pass for standard/deep)

- [ ] User journey includes emotion curve and key moments
- [ ] Each insight has the three elements: observation + evidence + implication
- [ ] Action recommendations have at least 3 items, each with priority and validation method
- [ ] Data sources and limitations are stated

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| voice-analysis missing | User personas and pain points based on behavior data and AI inference | Pain point insights lack user quote support | Ask user to provide user feedback text or upload voice-analysis.json file |
| behavior-analysis missing | Journey and behavior insights based on VOC and interview data | Behavior insights lack quantitative data | Ask user to provide behavioral event logs or upload behavior-analysis.json file |
| persona missing | Derive user personas from VOC and behavior data | Personas may be less refined | Ask user to provide target user persona descriptions or upload persona.json file |
| interview data missing | Insights based on VOC and behavior data | Lacks deep qualitative insights | Ask user to provide interview record text or upload interview data file |
| All upstream data missing | Generate based on research objectives and AI knowledge base, overall confidence reduced | Report requires significant human supplementation and verification | Ask user to provide research objectives, target user descriptions, and product information |
| If user has not provided research objectives | Prompt user to provide research objectives, otherwise report focus cannot be determined | Cannot generate targeted report | Ask user to provide research objectives (e.g., "understand user payment decision factors") |
| If user has not provided product/category information | Skip steps related to this input, product-related descriptions in report based on inference | Product background descriptions may be inaccurate | Ask user to provide product name, category, and core feature descriptions |

---

## Upstream Change Response

### Upstream Change Impact

| Upstream Skill | Change Type | Impact Scope | Response Action |
|-----------|---------|---------|---------|
| user-research-voice-analysis | voice-analysis.json structure change | Sentiment distribution, pain points, topic data format changes | Check input field mapping, adapt to new structure, mark "upstream data format anomaly" if incompatible |
| user-research-voice-analysis | voice-analysis.json content update | Pain point levels, sentiment distribution, segmentation results changes | Re-integrate user personas and pain point insights, annotate "rebuilt based on updated data" |
| user-research-behavior-analysis | behavior-analysis.json structure change | Funnel, Aha Moment, feature usage data format changes | Check input field mapping, adapt to new structure, mark "upstream data format anomaly" if incompatible |
| user-research-behavior-analysis | behavior-analysis.json content update | Funnel health, behavior paths, anomaly detection results changes | Re-integrate user journey and behavior insights, annotate "rebuilt based on updated data" |
| user-research-user-modeling | persona.json structure change | Persona field mapping changes | Check input field mapping, adapt to new structure, mark "upstream data format anomaly" if incompatible |
| user-research-user-modeling | persona.json content update | Persona characteristics, pain points, JTBD changes | Re-integrate user persona chapter, annotate "rebuilt based on updated Persona" |
| user-research-interview-assist | interview-insights.json structure change | Interview insights, cross-interview pattern data format changes | Check input field mapping, adapt to new structure, mark "upstream data format anomaly" if incompatible |
| user-research-interview-assist | interview-insights.json content update | Validated/refuted hypotheses, new discoveries, Persona updates changes | Re-integrate insights and action recommendations, annotate "rebuilt based on updated interview data" |

### Downstream Notification Mechanism

This Skill is a terminal Skill with no downstream dependencies; downstream notification is not applicable.
