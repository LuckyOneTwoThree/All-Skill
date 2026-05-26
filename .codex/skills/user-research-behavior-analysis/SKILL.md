---
name: user-research-behavior-analysis
description: Use when there is a need to diagnose funnel health, discover Aha Moments, and analyze feature usage depth from event data, funnel data, and heatmap data. Behavioral data automated analysis pipeline. Keywords: behavior analysis, funnel analysis, Aha Moment, feature usage analysis, anomaly detection, user churn, conversion rate, user behavior anomaly.
metadata:
  module: "Product Discovery"
  sub-module: "User Research"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Where are users churning"
    - "Why is the funnel conversion rate so low"
    - "Are there any anomalies in user behavior"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Directly output behavior patterns and usage insights"
  deep_description: "Complete analysis + behavioral sequence mining + user segmentation deep analysis + behavior prediction model"
---

# Automated Behavioral Data Analysis

## Core Principles

1. **Behavior Doesn't Lie** — Actual user behavior is more reliable than self-reported data; behavioral data serves as the factual baseline
2. **Funnels Are Symptoms, Not Causes** — Funnel breakage points indicate problem manifestations; need to dig deeper into the last behaviors and characteristics of churned users
3. **Aha Moment Is Causation, Not Correlation** — Candidate behaviors must be validated through predictive power; correlation ≠ causation
4. **Anomalies Are Signals, Not Noise** — Metric spikes/gradual changes/cyclical anomalies all require attribution; they should not be ignored or simply smoothed out

## Interaction Mode

🤖 **AI Auto-Execution** — No human intervention required, fully automated

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| event_data | JSON | Yes | User provided | User behavior event logs (clicks, views, submissions, etc.) |
| funnel_data | JSON | Yes | User provided | Conversion funnel step-by-step data |
| heatmap_data | JSON | ○ | User provided | Page heatmap data (click heatmaps, scroll heatmaps) |
| analysis_config | object | ○ | User provided | Analysis configuration (anomaly sensitivity, funnel granularity, cohort dimensions) |

### Input Format

```json
{
  "data_sources": [
    {
      "type": "event_data",
      "location": "string",
      "time_range": "string",
      "events_tracked": ["string"],
      "daily_active_users": "number"
    },
    {
      "type": "funnel_data",
      "location": "string",
      "funnel_steps": ["string"],
      "time_range": "string"
    },
    {
      "type": "heatmap_data",
      "location": "string",
      "pages_covered": ["string"],
      "time_range": "string"
    }
  ],
  "analysis_config": {
    "anomaly_sensitivity": "high|medium|low",
    "funnel_granularity": "daily|weekly|monthly",
    "cohort_dimensions": ["string"]
  }
}
```

**Data Source Descriptions**:
- `event_data`: User behavior event logs (clicks, views, submissions, etc.)
- `funnel_data`: Conversion funnel step-by-step data
- `heatmap_data`: Page heatmap data (click heatmaps, scroll heatmaps)

---

## Execution Steps

### Step 1: Funnel Health Diagnosis [Core]

- Calculate conversion rate for each funnel step
- Identify steps with abnormally low conversion rates (below industry benchmark or 1 standard deviation below historical average)
- Analyze characteristics of churned users at each step (last action, time spent, device, etc.)
- Calculate overall funnel health score (0-100)
- Output: Funnel diagnosis report, including conversion rates per step, churn analysis, health score

### Step 2: Behavioral Path Analysis [Core]

- Extract actual user behavioral paths (not preset paths)
- Identify high-frequency paths and anomalous paths
- Discover user "detour" behaviors (reaching goals via unexpected paths)
- Identify user "lost" behaviors (repeatedly jumping between multiple pages)
- Output: Behavioral path map, annotated with high-frequency paths, detours, and lost points

### Step 3: Feature Usage Depth Analysis [Core]

- Calculate usage rate for each feature (reached users / active users)
- Analyze feature usage depth (discover only → try → deep use → paid conversion)
- Identify high-value but low-usage features (discovery barriers)
- Identify low-value but high-usage features (potentially misleading users)
- Output: Feature usage matrix (usage rate × value score)

### Step 4: Anomaly Detection [Core]

- Perform time-series anomaly detection on key behavioral metrics
- Detection dimensions: DAU, retention, core feature usage rate, conversion rate
- Anomaly types: Spike (single-day large change), Gradual (sustained trend change), Cyclical (inconsistent with historical cycles)
- Correlate anomalies with possible causes (version releases, external events, data issues)
- Output: Anomaly event list, including anomaly type, impact scope, possible causes, confidence

---

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Behavior patterns and usage insights | Core conclusions + minimum viable deliverable |
| standard | Complete deliverable (current default) | Complete deliverable, including all Step outputs |
| deep | Complete analysis + behavioral sequence mining + user segmentation deep analysis + behavior prediction model | Complete deliverable + extended analysis + deep inference |

## Output

Output file: `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["funnel_health", "aha_moment_candidates", "feature_usage", "metadata"],
  "properties": {
    "funnel_health": {"type": "object", "description": "Funnel health diagnosis, including conversion rates per step and health score"},
    "aha_moment_candidates": {"type": "array", "description": "Aha Moment candidate list"},
    "feature_usage": {"type": "array", "description": "Feature usage depth analysis list"},
    "behavior_paths": {"type": "object", "description": "Behavioral path analysis, including high-frequency paths, detours, and lost patterns"},
    "anomalies": {"type": "array", "description": "Anomaly event detection list"},
    "metadata": {"type": "object", "description": "Analysis metadata, including timestamp and confidence"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| funnel_health.overall_score | number | Yes | Overall funnel health score, 0-100 |
| funnel_health.steps | array | Yes | Funnel steps data, each item must contain step_name, conversion_rate, drop_off_rate, confidence |
| funnel_health.steps[].step_name | string | Yes | Step name, cannot be empty |
| funnel_health.steps[].conversion_rate | number | Yes | Conversion rate, 0-1 |
| funnel_health.steps[].drop_off_rate | number | Yes | Drop-off rate, 0-1 |
| funnel_health.steps[].is_anomaly | boolean | Yes | Whether this step is anomalous |
| funnel_health.steps[].confidence | number | Yes | Step confidence, 0-1 |
| funnel_health.trend | string | Yes | Trend enum: improving/stable/declining |
| aha_moment_candidates | array | Yes | Aha Moment candidate list, each item must contain behavior_pattern, correlation_with_retention, predictive_power, confidence |
| aha_moment_candidates[].behavior_pattern | string | Yes | Behavior pattern description, cannot be empty |
| aha_moment_candidates[].correlation_with_retention | number | Yes | Correlation with retention, < 0.3 marked as "insufficient predictive power" |
| aha_moment_candidates[].predictive_power | number | Yes | Predictive power score, 0-1 |
| aha_moment_candidates[].confidence | number | Yes | Candidate confidence, 0-1 |
| feature_usage | array | Yes | Feature usage list, each item must contain feature_name, adoption_rate, value_score, usage_vs_value_quadrant, confidence |
| feature_usage[].feature_name | string | Yes | Feature name, cannot be empty |
| feature_usage[].adoption_rate | number | Yes | Adoption rate, 0-1 |
| feature_usage[].value_score | number | Yes | Value score, 0-1 |
| feature_usage[].usage_vs_value_quadrant | string | Yes | Quadrant enum: high_value_high_use/high_value_low_use/low_value_high_use/low_value_low_use |
| feature_usage[].confidence | number | Yes | Feature confidence, 0-1 |
| behavior_paths.top_paths | array | No | High-frequency paths list |
| behavior_paths.top_paths[].path | string[] | Yes | Path step sequence |
| behavior_paths.top_paths[].user_count | number | Yes | Number of users using this path |
| behavior_paths.top_paths[].avg_completion_time | number | Yes | Average completion time (seconds) |
| behavior_paths.detour_patterns | array | No | Detour patterns list |
| behavior_paths.detour_patterns[].description | string | Yes | Detour description, cannot be empty |
| behavior_paths.detour_patterns[].affected_user_ratio | number | Yes | Affected user ratio, 0-1 |
| behavior_paths.detour_patterns[].possible_cause | string | Yes | Possible cause |
| behavior_paths.lost_patterns | array | No | Lost patterns list |
| behavior_paths.lost_patterns[].description | string | Yes | Lost description, cannot be empty |
| behavior_paths.lost_patterns[].affected_user_ratio | number | Yes | Affected user ratio, 0-1 |
| behavior_paths.lost_patterns[].loop_pages | string[] | Yes | Loop jumping pages list |
| anomalies | array | No | Anomaly events list, each item must contain metric, anomaly_type, detected_date, magnitude, possible_causes, confidence |
| anomalies[].metric | string | Yes | Anomalous metric name, cannot be empty |
| anomalies[].anomaly_type | string | Yes | Anomaly type enum: spike/gradual/cyclical |
| anomalies[].detected_date | string | Yes | Detection date, ISO 8601 format |
| anomalies[].magnitude | number | Yes | Change magnitude |
| anomalies[].possible_causes | string[] | Yes | Possible causes list |
| anomalies[].impact_scope | string | No | Impact scope |
| anomalies[].confidence | number | Yes | Anomaly confidence, 0-1 |
| metadata.analysis_timestamp | string | Yes | Analysis timestamp |
| metadata.data_quality_flags | string[] | Yes | Data quality flags |
| metadata.confidence_overall | number | Yes | Overall confidence, 0-1 |

```json
{
  "funnel_health": {
    "overall_score": "number",
    "steps": [
      {
        "step_name": "string",
        "conversion_rate": "number",
        "drop_off_rate": "number",
        "is_anomaly": "boolean",
        "anomaly_description": "string",
        "lost_user_profile": {
          "last_action": "string",
          "avg_time_spent": "number",
          "device_distribution": {}
        },
        "confidence": "number"
      }
    ],
    "trend": "improving|stable|declining"
  },
  "aha_moment_candidates": [
    {
      "behavior_pattern": "string",
      "correlation_with_retention": "number",
      "user_segment": "string",
      "threshold": "string",
      "predictive_power": "number",
      "confidence": "number"
    }
  ],
  "feature_usage": [
    {
      "feature_name": "string",
      "discovery_rate": "number",
      "adoption_rate": "number",
      "depth_distribution": {
        "discover_only": "number",
        "try_once": "number",
        "regular_use": "number",
        "power_use": "number"
      },
      "value_score": "number",
      "usage_vs_value_quadrant": "high_value_high_use|high_value_low_use|low_value_high_use|low_value_low_use",
      "confidence": "number"
    }
  ],
  "behavior_paths": {
    "top_paths": [
      {
        "path": ["string"],
        "user_count": "number",
        "avg_completion_time": "number"
      }
    ],
    "detour_patterns": [
      {
        "description": "string",
        "affected_user_ratio": "number",
        "possible_cause": "string"
      }
    ],
    "lost_patterns": [
      {
        "description": "string",
        "affected_user_ratio": "number",
        "loop_pages": ["string"]
      }
    ]
  },
  "anomalies": [
    {
      "metric": "string",
      "anomaly_type": "spike|gradual|cyclical",
      "detected_date": "string",
      "magnitude": "number",
      "possible_causes": ["string"],
      "impact_scope": "string",
      "confidence": "number"
    }
  ],
  "metadata": {
    "analysis_timestamp": "string",
    "data_quality_flags": ["string"],
    "confidence_overall": "number"
  }
}
```

---

## Decision Rules

| Condition | Action |
|------|------|
| Key metric daily day-over-day change > 15% | Trigger alert, mark as "requires immediate attention", pause automated process and notify human |
| Funnel health score < 40 | Mark "funnel severely unhealthy", recommend entering deep diagnosis |
| Aha Moment candidate predictive power < 0.3 | Mark "insufficient predictive power", do not recommend as Aha Moment |
| Feature adoption rate < 5% and value score high | Mark "discovery barrier", recommend usability analysis |
| Data source missing key steps | Mark "incomplete data", degrade funnel analysis to "partial analysis" |

---

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Funnel data completeness (all steps have data)
- [ ] Aha Moment candidates have predictive power validation (correlation with retention ≥ 0.3)

### P1 Checks (must pass for standard/deep)

- [ ] Behavioral path sample size (≥ 1000 paths)
- [ ] Anomaly detection false positive control (anomaly events must have human-understandable cause hypotheses)
- [ ] All outputs annotated with confidence (100%)
- [ ] Heatmap data timeliness (within the last 30 days)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| All data sources missing | Prompt user to provide behavioral data first, or directly execute analysis based on user-provided event data/funnel data | funnel_health, feature_usage, etc. fields are empty, confidence drops to 0 | Ask user to provide behavioral event logs and funnel data |
| If user has not provided event_data | Prompt user to provide behavioral event logs, otherwise core behavioral data source is lacking | aha_moment_candidates and behavior_paths cannot be generated, feature usage analysis is missing | Ask user to provide user behavior event logs (including event name, timestamp, user ID) |
| If user has not provided funnel_data | Prompt user to provide funnel data, otherwise funnel health diagnosis cannot be executed | funnel_health field annotated "data missing", overall health score unavailable | Ask user to provide funnel step user counts and conversion rate data |
| If user has not provided heatmap_data | Skip steps related to this input, heatmap data not included in analysis | Behavioral path analysis lacks heatmap dimension, page-level insights missing | Ask user to provide page heatmap data or click distribution data |
| If user has not provided analysis_config | Skip steps related to this input, use default analysis configuration | Using default configuration, anomaly detection sensitivity and funnel granularity may not be optimal | Ask user to provide analysis parameter configuration such as anomaly detection sensitivity and funnel granularity |

## Data Acquisition Instructions

This Skill requires behavioral data (event logs, funnel data, heatmap data). Please provide through one of the following methods:
  1. Directly paste event data or funnel step data
  2. Upload CSV/Excel/JSON files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact

This Skill is a starting Skill with no upstream file dependencies; upstream change impact is not applicable.

### Downstream Notification Mechanism

| Downstream Skill | Notification Trigger Condition | Notification Method | Notification Content |
|-----------|------------|---------|---------|
| user-research-user-modeling | behavior-analysis.json update completed | Write to output file | Notify that behavioral segmentation, Aha Moment, and feature usage data are ready |
| user-research-report | behavior-analysis.json update completed | Write to output file | Notify that funnel health, behavioral paths, and anomaly detection data are ready |
