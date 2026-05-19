---
name: user-research-voice-analysis
description: "Use when analyzing user feedback from app reviews, support tickets, and social media. Auto-extracts sentiment distribution, theme clustering, pain points, and user segments. Keywords: VOC analysis, user feedback, sentiment analysis, pain point extraction, user segmentation, app reviews, support tickets."
metadata:
  module: "Product Discovery"
  sub-module: "User Research"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Analyze user feedback"
    - "What are users complaining about"
    - "Help me extract user pain points"
execution_depth:
  default: standard
  quick_description: "Output voice themes and sentiment distribution"
  deep_description: "Full analysis + sentiment trend tracking + topic clustering deep analysis + action recommendation roadmap"
---

# User Voice Auto-Analysis

## Core Principles

1. **User voice is the raw material, not the conclusion** -- User feedback is unstructured raw data; it needs to be cleaned, clustered, and extracted to become usable insights
2. **Sentiment is a signal, not a score** -- The value of sentiment analysis lies not in the score itself, but in the direction and intensity of sentiment changes; sentiment trends are more valuable than point-in-time scores
3. **Pain points must be traceable** -- Each extracted pain point must be traceable to the original user feedback; untraceable pain points are unreliable
4. **Segments are hypotheses, not facts** -- User segments are inferred models based on data; they require subsequent validation rather than being solidified

## Interaction Mode

AI **AI auto-executes** -- No human intervention required, fully automated

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| app_reviews | JSON/CSV | Yes | User provided | App store review data |
| support_tickets | JSON/CSV | No | User provided | Customer support ticket data |
| social_mentions | JSON/CSV | No | User provided | Social media mention data |
| community_posts | JSON/CSV | No | User provided | Community/forum post data |
| analysis_config | object | No | User provided | Analysis configuration (language, time range, minimum review count) |

### Input Format

```json
{
  "data_sources": [
    {
      "type": "app_reviews|support_tickets|social_mentions|community_posts",
      "location": "string",
      "time_range": "string",
      "total_entries": "number"
    }
  ],
  "analysis_config": {
    "language": "auto|zh|en",
    "time_range": "string",
    "min_reviews": "number"
  }
}
```

**Data source descriptions**:
- `app_reviews`: App store review data (rating, content, date, version)
- `support_tickets`: Customer support ticket data (title, description, category, priority)
- `social_mentions`: Social media mention data (content, platform, date)
- `community_posts`: Community/forum post data (title, content, replies, views)

---

## Execution Steps

### Step 1: Data Cleaning and Standardization [Core]

- Remove duplicates, spam, and irrelevant content
- Standardize format (date, language, rating)
- Data quality assessment: completeness, timeliness, representativeness
- Output: Cleaned dataset, data quality report

### Step 2: Sentiment Analysis [Core]

- Sentiment classification for each piece of feedback: Positive / Neutral / Negative
- Sentiment intensity scoring (0-5)
- Sentiment distribution statistics (by time period, by source, by version)
- Sentiment trend analysis (trend changes over time)
- Output: Sentiment distribution, sentiment trends

### Step 3: Theme Clustering [Core]

- Extract key themes from feedback content
- Cluster related feedback under themes
- Calculate theme frequency and sentiment tendency
- Identify emerging themes (rapidly growing recently)
- Output: Theme list, theme frequency, theme sentiment

### Step 4: Pain Point Extraction [Core]

- Extract specific pain points from negative feedback
- Pain point severity classification: P0 (blocking usage) / P1 (severe impact) / P2 (inconvenience) / P3 (minor issue)
- Pain point frequency statistics
- Pain point correlation analysis (which pain points often co-occur)
- Output: Pain point list, pain point severity, pain point frequency

### Step 5: User Segmentation [Core]

- Segment users based on feedback content and behavioral characteristics
- Segment dimensions: Usage depth / Feature preference / Pain point type / Sentiment tendency
- Generate segment characteristic descriptions
- Output: User segment list, segment characteristics

---

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | voice themes and sentiment distribution | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full analysis + sentiment trend tracking + topic clustering deep analysis + action recommendation roadmap | Full deliverables + extended analysis + deep simulation |

## Output

Output file: `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["sentiment_distribution", "top_themes", "top_pain_points", "metadata"],
  "properties": {
    "sentiment_distribution": {"type": "object", "description": "Sentiment distribution statistics"},
    "sentiment_trends": {"type": "array", "description": "Sentiment trend changes"},
    "top_themes": {"type": "array", "description": "Theme clustering results"},
    "top_pain_points": {"type": "array", "description": "Pain point extraction results"},
    "user_segments": {"type": "array", "description": "User segmentation results"},
    "metadata": {"type": "object", "description": "Analysis metadata, including timestamp and confidence"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| summary.total_feedback_analyzed | number | Yes | Total feedback analyzed, must be > 0 |
| summary.data_sources_used | string[] | Yes | Data sources actually used, must not be empty |
| summary.time_range | string | Yes | Data time range |
| summary.sentiment_distribution.positive | number | Yes | Positive sentiment ratio, 0-1 |
| summary.sentiment_distribution.negative | number | Yes | Negative sentiment ratio, 0-1 |
| summary.sentiment_distribution.neutral | number | Yes | Neutral sentiment ratio, 0-1 |
| summary.sentiment_distribution.mixed | number | Yes | Mixed sentiment ratio, 0-1 |
| summary.top_themes | array | Yes | Theme list; each must include theme, feedback_count, representative_quotes, confidence; >= 3 themes |
| summary.top_themes[].theme | string | Yes | Theme name, must not be empty |
| summary.top_themes[].feedback_count | number | Yes | Feedback count for this theme |
| summary.top_themes[].representative_quotes | string[] | Yes | >= 2 representative quotes per theme |
| summary.top_themes[].confidence | number | Yes | Theme confidence, 0-1 |
| summary.top_pain_points | array | Yes | Pain point list; each must include pain_point, severity, impact_score, representative_quotes, confidence |
| summary.top_pain_points[].pain_point | string | Yes | Pain point description, must not be empty |
| summary.top_pain_points[].severity | string | Yes | Pain point level enum: P0/P1/P2/P3 |
| summary.top_pain_points[].impact_score | number | Yes | Pain point impact score |
| summary.top_pain_points[].representative_quotes | string[] | Yes | >= 2 representative quotes per pain point |
| summary.top_pain_points[].confidence | number | Yes | Pain point confidence, 0-1 |
| summary.emerging_themes | array | No | Emerging theme list |
| summary.emerging_themes[].confidence | number | Yes | Emerging theme confidence, 0-1 |
| summary.user_segments | array | Yes | User segment list; each must include segment_name, size_ratio, confidence |
| summary.user_segments[].segment_name | string | Yes | Segment name, must not be empty |
| summary.user_segments[].size_ratio | number | Yes | Size ratio, 0-1 |
| summary.user_segments[].confidence | number | Yes | Segment confidence, 0-1 |
| metadata.analysis_timestamp | string | Yes | Analysis timestamp |
| metadata.data_quality_flags | string[] | Yes | Data quality flags |
| metadata.confidence_overall | number | Yes | Overall confidence, 0-1 |

```json
{
  "sentiment_distribution": {
    "positive": "number",
    "neutral": "number",
    "negative": "number",
    "total_entries": "number",
    "by_source": {
      "app_reviews": { "positive": "number", "neutral": "number", "negative": "number" },
      "support_tickets": { "positive": "number", "neutral": "number", "negative": "number" }
    }
  },
  "sentiment_trends": [
    {
      "date": "string",
      "positive": "number",
      "neutral": "number",
      "negative": "number",
      "total": "number"
    }
  ],
  "top_themes": [
    {
      "theme": "string",
      "frequency": "number",
      "sentiment": "positive|neutral|negative|mixed",
      "sub_themes": ["string"],
      "representative_quotes": ["string"],
      "confidence": "number"
    }
  ],
  "top_pain_points": [
    {
      "pain_point": "string",
      "severity": "P0|P1|P2|P3",
      "frequency": "number",
      "related_themes": ["string"],
      "representative_quotes": ["string"],
      "confidence": "number"
    }
  ],
  "user_segments": [
    {
      "segment_name": "string",
      "size_ratio": "number",
      "key_characteristics": ["string"],
      "primary_needs": ["string"],
      "primary_pain_points": ["string"],
      "confidence": "number"
    }
  ],
  "metadata": {
    "analysis_timestamp": "string",
    "data_sources_used": ["string"],
    "data_quality": {
      "completeness": "number",
      "timeliness": "string",
      "representativeness": "number"
    },
    "confidence_overall": "number"
  }
}
```

---

## Decision Rules

| Condition | Action |
|------|------|
| Data volume < 500 entries | Mark "insufficient data"; output degraded to exploratory conclusions; confidence uniformly downgraded |
| Sentiment distribution extreme (one direction > 90%) | Mark "sentiment distribution extreme"; check for data source bias |
| Pain point confidence < 0.5 | Mark "low confidence pain point"; recommend human review |
| User segment differentiation insufficient | Merge similar segments; annotate merge reason |

---

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Sentiment distribution completeness (Positive + Neutral + Negative = 100%)
- [ ] Theme count >= 3 (Met)

### P1 Checks (must pass for standard/deep)

- [ ] Each pain point has quote support (Met)
- [ ] Data quality assessment complete (Completeness, timeliness, representativeness all scored)
- [ ] All outputs annotated with confidence (100%)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|----------|----------|
| All data sources missing | Prompt user to provide user feedback data first, or execute analysis directly based on user-pasted feedback text | Output based on user-provided data; confidence depends on data volume and quality | Request user to paste user feedback text, or upload CSV/Excel/JSON files containing app reviews, support tickets, social mentions |
| If user does not provide app_reviews | Prompt user to provide app review data; otherwise lacking core VOC data source | sentiment_distribution and top_themes may be incomplete | Prompt user to provide app review data (e.g., App Store/Google Play reviews) or upload app_reviews.json |
| If user does not provide support_tickets | Skip input-related steps; customer support dimension data not included in analysis | Pain point extraction lacks support ticket dimension; may miss technical issues | Request user to provide support ticket data (e.g., ticket_id, category, description, sentiment) or upload support_tickets.json |
| If user does not provide social_mentions | Skip input-related steps; social media dimension data not included in analysis | Lacking social media sentiment data; sentiment trends may be incomplete | Request user to provide social media mention data (e.g., platform, content, sentiment) or upload social_mentions.json |
| If user does not provide community_posts | Skip input-related steps; community dimension data not included in analysis | Lacking community discussion data; may miss deep user needs | Request user to provide community post data (e.g., forum threads, Q&A posts) or upload community_posts.json |
| If user does not provide analysis_config | Skip input-related steps; use default analysis configuration (language: auto, time range: last 6 months, minimum review count: 100) | Default configuration used; analysis may not match user's actual needs | Prompt user to specify analysis config (language, time range, minimum review count) or accept defaults |

---

## Upstream Change Response

### Upstream Change Impact

This Skill is a starting Skill with no upstream file dependencies; does not involve upstream change impact.

### Downstream Notification Mechanism

| Downstream Skill | Notification Trigger Condition | Notification Method | Notification Content |
|-----------|------------|---------|---------|
| user-research-user-modeling | voice-analysis.json update complete | Write to output file | Notify sentiment distribution, theme clustering, pain point extraction data ready |
| user-research-report | voice-analysis.json update complete | Write to output file | Notify user voice analysis data ready for report generation |
