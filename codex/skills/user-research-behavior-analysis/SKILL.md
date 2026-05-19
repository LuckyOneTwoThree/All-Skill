---
name: user-research-behavior-analysis
description: "Use when diagnosing funnel health, discovering Aha Moments, and analyzing feature usage depth from event, funnel, and heatmap data. Keywords: behavior analysis, funnel analysis, Aha Moment, feature usage analysis, anomaly detection, user churn, conversion rate, behavioral anomalies."
metadata:
  module: "Product Discovery"
  sub-module: "User Research"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Where are users dropping off"
    - "Why is funnel conversion rate so low"
    - "What behavioral anomalies exist among users"
execution_depth:
  default: standard
  quick_description: "Output behavior patterns and usage insights"
  deep_description: "Full analysis + behavior sequence mining + user segmentation deep analysis + behavior prediction model"
---

# Behavior Data Auto-Analysis

## Core Principles

1. **Behavior doesn't lie** -- Users' actual behavior is more reliable than self-reporting; behavioral data serves as the factual baseline
2. **Funnels are symptoms, not causes** -- Funnel break points indicate problem manifestations; need to dig deeper into last behaviors and characteristics of churned users
3. **Aha Moment is causation, not correlation** -- Candidate behaviors must pass predictive power validation; correlation != causation
4. **Anomalies are signals, not noise** -- Metric spikes/gradual changes/cyclical anomalies all need attribution; cannot be ignored or simply smoothed

## Interaction Mode

AI **AI auto-executes** -- No human intervention required, fully automated

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| event_data | JSON | Yes | User provided | User behavior event logs (clicks, views, submissions, etc.) |
| funnel_data | JSON | Yes | User provided | Conversion funnel step data |
| heatmap_data | JSON | No | User provided | Page heatmap data (click heatmap, scroll heatmap) |
| analysis_config | object | No | User provided | Analysis configuration (anomaly sensitivity, funnel granularity, cohort dimensions) |

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

**Data source descriptions**:
- `event_data`: User behavior event logs (clicks, views, submissions, etc.)
- `funnel_data`: Conversion funnel step data
- `heatmap_data`: Page heatmap data (click heatmap, scroll heatmap)

---

## Execution Steps

### Step 1: Funnel Health Diagnosis [Core]

- Calculate conversion rate for each funnel step
- Identify steps with abnormally low conversion rates (below industry benchmark or 1 standard deviation below historical average)
- Analyze characteristics of churned users at each step (last action, dwell time, device, etc.)
- Calculate overall funnel health score (0-100)
- Output: Funnel diagnosis report, including conversion rates, churn analysis, and health score for each step

### Step 2: Behavioral Path Analysis [Core]

- Extract actual user behavioral paths (not preset paths)
- Identify high-frequency paths and anomalous paths
- Discover user "detour" behaviors (taking unintended paths to reach goals)
- Identify user "lost" behaviors (bouncing between multiple pages repeatedly)
- Output: Behavioral path diagram, annotating high-frequency paths, detours, and lost points

### Step 3: Feature Usage Depth Analysis [Core]

- Calculate usage rate for each feature (users reached / active users)
- Analyze feature usage depth (discovery only -> trial -> deep use -> paid conversion)
- Identify high-value but low-usage features (discovery barriers)
- Identify low-value but high-usage features (potentially misleading users)
- Output: Feature usage matrix (usage rate x value score)

### Step 4: Anomaly Detection [Core]

- Perform time-series anomaly detection on key behavioral metrics
- Detection dimensions: DAU, retention, core feature usage rate, conversion rate
- Anomaly types: Spike (single-day large change), Gradual (sustained trend change), Cyclical (inconsistent with historical cycles)
- Correlate anomalies with possible causes (version releases, external events, data issues)
- Output: Anomaly event list, including anomaly type, impact scope, possible causes, confidence

---

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | behavior patterns and usage insights | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full analysis + behavior sequence mining + user segmentation deep analysis + behavior prediction model | Full deliverables + extended analysis + deep simulation |

## Output

Output file: `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["funnel_health", "aha_moment_candidates", "feature_usage", "metadata"],
  "properties": {
    "funnel_health": {"type": "object", "description": "Funnel health diagnosis, including conversion rates and health score for each step"},
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
| funnel_health.steps | array | Yes | Funnel step data; each must include step_name, conversion_rate, drop_off_rate, confidence |
| funnel_health.steps[].step_name | string | Yes | Step name, must not be empty |
| funnel_health.steps[].conversion_rate | number | Yes | Conversion rate, 0-1 |
| funnel_health.steps[].drop_off_rate | number | Yes | Drop-off rate, 0-1 |
| funnel_health.steps[].is_anomaly | boolean | Yes | Whether this step is anomalous |
| funnel_health.steps[].confidence | number | Yes | Step confidence, 0-1 |
| funnel_health.trend | string | Yes | Trend enum: improving/stable/declining |
| aha_moment_candidates | array | Yes | Aha Moment candidate list; each must include behavior_pattern, correlation_with_retention, predictive_power, confidence |
| aha_moment_candidates[].behavior_pattern | string | Yes | Behavior pattern description, must not be empty |
| aha_moment_candidates[].correlation_with_retention | number | Yes | Correlation with retention; < 0.3 marked "insufficient predictive power" |
| aha_moment_candidates[].predictive_power | number | Yes | Predictive power score, 0-1 |
| aha_moment_candidates[].confidence | number | Yes | Candidate confidence, 0-1 |
| feature_usage | array | Yes | Feature usage list; each must include feature_name, adoption_rate, value_score, usage_vs_value_quadrant, confidence |
| feature_usage[].feature_name | string | Yes | Feature name, must not be empty |
| feature_usage[].adoption_rate | number | Yes | Adoption rate, 0-1 |
| feature_usage[].value_score | number | Yes | Value score, 0-1 |
| feature_usage[].usage_vs_value_quadrant | string | Yes | Quadrant enum: high_value_high_use/high_value_low_use/low_value_high_use/low_value_low_use |
| feature_usage[].confidence | number | Yes | Feature confidence, 0-1 |
| behavior_paths.top_paths | array | No | High-frequency path list |
| behavior_paths.top_paths[].path | string[] | Yes | Path step sequence |
| behavior_paths.top_paths[].user_count | number | Yes | User count for this path |
| behavior_paths.top_paths[].avg_completion_time | number | Yes | Average completion time (seconds) |
| behavior_paths.detour_patterns | array | No | Detour pattern list |
| behavior_paths.detour_patterns[].description | string | Yes | Detour description, must not be empty |
| behavior_paths.detour_patterns[].affected_user_ratio | number | Yes | Affected user ratio, 0-1 |
| behavior_paths.detour_patterns[].possible_cause | string | Yes | Possible cause |
| behavior_paths.lost_patterns | array | No | Lost pattern list |
| behavior_paths.lost_patterns[].description | string | Yes | Lost description, must not be empty |
| behavior_paths.lost_patterns[].affected_user_ratio | number | Yes | Affected user ratio, 0-1 |
| behavior_paths.lost_patterns[].loop_pages | string[] | Yes | Loop navigation page list |
| anomalies | array | No | Anomaly event list; each must include metric, anomaly_type, detected_date, magnitude, possible_causes, confidence |
| anomalies[].metric | string | Yes | Anomaly metric name, must not be empty |
| anomalies[].anomaly_type | string | Yes | Anomaly type enum: spike/gradual/cyclical |
| anomalies[].detected_date | string | Yes | Detection date, ISO 8601 format |
| anomalies[].magnitude | number | Yes | Change magnitude |
| anomalies[].possible_causes | string[] | Yes | Possible cause list |
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
| Key metric daily MoM change > 15% | Trigger alert, mark as "requires immediate attention", pause automated process and notify human |
| Funnel health score < 40 | Mark "funnel severely unhealthy", recommend entering deep diagnosis |
| Aha Moment candidate predictive power < 0.3 | Mark "insufficient predictive power", do not recommend as Aha Moment |
| Feature usage rate < 5% AND high value | Mark "discovery barrier", recommend entering usability analysis |
| Data source missing key steps | Mark "data incomplete", funnel analysis degraded to "partial analysis" |

---

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Funnel data completeness (All steps have data)
- [ ] Aha Moment candidates have predictive power validation (Correlation with retention >= 0.3)

### P1 Checks (must pass for standard/deep)

- [ ] Behavioral path sample size (>= 1000 paths)
- [ ] Anomaly detection false positive control (Anomaly events must have human-understandable cause hypotheses)
- [ ] All outputs annotated with confidence (100%)
- [ ] Heatmap data timeliness (Within last 30 days)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|----------|----------|
| All data sources missing | Prompt user to provide behavioral data first, or execute analysis directly based on user-provided event/funnel data | funnel_health, feature_usage fields empty, confidence reduced to 0 | Request user to paste event data or funnel step data, or upload CSV/Excel/JSON behavioral data files |
| If user does not provide event_data | Prompt user to provide behavioral event logs; otherwise lacking core behavioral data source | aha_moment_candidates and behavior_paths cannot be generated, feature usage analysis missing | Prompt user to provide event log data (e.g., user_id, event_name, timestamp, properties) or upload event_data.json |
| If user does not provide funnel_data | Prompt user to provide funnel data; otherwise cannot execute funnel health diagnosis | funnel_health field annotated "data missing", overall health score unavailable | Prompt user to provide funnel step names and conversion counts, or upload funnel_data.json |
| If user does not provide heatmap_data | Skip input-related steps; heatmap data not included in analysis | Behavioral path analysis lacks heatmap dimension, page-level insights missing | Request user to provide heatmap data (page clicks, scroll depth) or upload heatmap_data.json |
| If user does not provide analysis_config | Skip input-related steps; use default analysis configuration | Default configuration used; anomaly detection sensitivity and funnel granularity may be suboptimal | Prompt user to provide analysis config (anomaly sensitivity, funnel granularity) or accept defaults |

---

## Upstream Change Response

### Upstream Change Impact

This Skill is a starting Skill with no upstream file dependencies; does not involve upstream change impact.

### Downstream Notification Mechanism

| Downstream Skill | Notification Trigger Condition | Notification Method | Notification Content |
|-----------|------------|---------|---------|
| user-research-user-modeling | behavior-analysis.json update complete | Write to output file | Notify behavioral segments, Aha Moment, feature usage data ready |
| user-research-report | behavior-analysis.json update complete | Write to output file | Notify funnel health, behavioral paths, anomaly detection data ready |
