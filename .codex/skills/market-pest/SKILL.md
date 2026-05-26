---
name: market-pest
description: "Use when scanning target market's policies and regulations, economic indicators, social trends, and technology dynamics. PEST auto-scan, outputs four-dimension trend summary and impact assessment, tiered signal alerts, real-time alerts for major changes. Keywords: PEST analysis, policies and regulations, economic indicators, social trends, technology dynamics, environmental scanning, tiered signal alerts, external environment, policy impact, market trends."
metadata:
  module: "Product Discovery"
  sub-module: "Market Competitors"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Finance", "Healthcare", "General"]
  trigger_examples:
    - "What changes in the market environment"
    - "What impact do policies have on us"
    - "Help me scan the external environment"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Directly output PEST analysis conclusions"
  deep_description: "Complete analysis + policy impact projection + trend forecasting + strategic response recommendations"
---

# PEST Auto-Scan

## Core Principles

1. **All four dimensions are indispensable** — All four PEST dimensions must be scanned; analysis missing any dimension is incomplete; when data is insufficient, fill with industry benchmark values and annotate "estimated value"
2. **Tiered signals, not flat listing** — Not all trends are equally important; signals with impact level ≥4 trigger alerts, <3 are grouped into routine monitoring; resources focus on high-impact signals
3. **Timeliness annotation** — Each signal is annotated as "has occurred / is occurring / expected to occur"; signals with different timeliness require completely different response strategies; occurred ones need immediate response, expected ones need advance preparation
4. **Impact path traceable** — Each trend must be linked to a category impact path (e.g., "compliance cost increase → higher entry barriers for SMBs"); trends not linked to impact paths are noise

## Interaction Mode

🤖 AI auto-executes

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| category_keywords | string | Yes | User provided | Category keywords, e.g., "online education", "SaaS CRM" |
| target_market | string | Yes | User provided | Target market, e.g., "Mainland China", "Southeast Asia" |

## Execution Steps

### Step 1: Scheduled Scanning [Core]

Collect and monitor information across four dimensions:

| Dimension | Scan Scope | Data Sources |
|------|---------|--------|
| Political | Industry regulatory policies, access licenses, compliance requirements, data privacy regulations, tax policies, subsidy policies | Government websites, regulatory databases, industry association announcements, policy interpretation media |
| Economic | GDP growth rate, industry growth rate, consumer spending, financing environment, exchange rate fluctuations, inflation rate | Statistics bureau data, central bank reports, third-party economic databases |
| Social | Demographic structure changes, consumption habit shifts, cultural trends, user preference evolution, lifestyle changes | Social media trends, user research reports, census data, lifestyle studies |
| Technological | New technology maturity, technology adoption curves, infrastructure evolution, technology standard changes, patent trends | Technology media, patent databases, Gartner/IDC technology reports, open-source community dynamics |

### Step 2: Trend Summary [Core]

Structure summary of information collected for each dimension:

- Extract core trends (3-5 per dimension)
- Annotate trend direction (rising/declining/stable/emerging)
- Annotate trend strength (strong/medium/weak)
- Link to category impact path

### Step 3: Key Change Signals [Core]

Identify key change signals from the trend summary:

- Signal type: New policy release / Indicator mutation / Trend reversal / Technology breakthrough
- Signal timeliness: Has occurred / Is occurring / Expected to occur
- Signal source and verifiability

### Step 4: Impact Assessment [Core]

Assess impact for each key change signal:

| Assessment Dimension | Description |
|---------|------|
| Impact direction | Positive (opportunity) / Negative (threat) / Neutral |
| Impact level | 1-5 points (1=minimal impact, 5=disruptive impact) |
| Impact time window | Short-term (<6 months) / Medium-term (6-18 months) / Long-term (>18 months) |
| Impact scope | Category only / Entire industry / Cross-industry |
| Response recommendation | Leverage strategy / Avoidance strategy / Monitoring strategy |

### Step 5: Major Change Alerts [Core]

Trigger alerts for high-impact signals:

- Filter signals with impact level ≥4
- Generate alert summary: signal description + impact assessment + response recommendation
- Real-time push to human PM

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | PEST analysis conclusions | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output, including all Step outputs |
| deep | Complete analysis + policy impact projection + trend forecasting + strategic response recommendations | Complete output + extended analysis + deep projection |

## Output

Output file: `output/pm-discovery/market-pest/pest.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["category_keywords", "target_market", "scan_timestamp", "political", "economic", "social", "technological"],
  "properties": {
    "category_keywords": {"type": "string", "description": "Category keywords"},
    "target_market": {"type": "string", "description": "Target market"},
    "scan_timestamp": {"type": "string", "description": "Scan timestamp"},
    "political": {"type": "object", "description": "Political dimension trends and signals"},
    "economic": {"type": "object", "description": "Economic dimension trends and signals"},
    "social": {"type": "object", "description": "Social dimension trends and signals"},
    "technological": {"type": "object", "description": "Technological dimension trends and signals"},
    "alerts": {"type": "array", "description": "Major change alert list"}
  }
}
```

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|---------|------|------|------|
| category_keywords | string | Yes | Category keywords, cannot be empty string |
| target_market | string | Yes | Target market, cannot be empty string |
| scan_timestamp | string | Yes | ISO 8601 format scan timestamp |
| political | object | Yes | Political dimension, cannot be missing |
| political.trends | array | Yes | At least 1 trend; each must contain trend, direction, strength, impact_path |
| political.trends[].trend | string | Yes | Trend description, cannot be empty |
| political.trends[].direction | string | Yes | Trend direction, enum: rising/declining/stable/emerging |
| political.trends[].strength | string | Yes | Trend strength, enum: strong/medium/weak |
| political.trends[].impact_path | string | Yes | Category impact path, cannot be empty |
| political.key_signals | array | Yes | Signal list; each must contain signal, type, timing, source, impact |
| political.key_signals[].signal | string | Yes | Signal description, cannot be empty |
| political.key_signals[].type | string | Yes | Signal type, enum: new_policy_release/indicator_mutation/trend_reversal/technology_breakthrough |
| political.key_signals[].timing | string | Yes | Signal timeliness, enum: has_occurred/is_occurring/expected_to_occur |
| political.key_signals[].source | string | Yes | Signal source, cannot be empty |
| political.key_signals[].impact | object | Yes | Impact assessment, must contain direction, degree, time_window, scope, recommendation |
| political.key_signals[].impact.direction | string | Yes | Impact direction, enum: positive/negative/neutral |
| political.key_signals[].impact.degree | integer | Yes | Impact level, 1-5 |
| political.key_signals[].impact.time_window | string | Yes | Impact time window, enum: short_term/medium_term/long_term |
| political.key_signals[].impact.scope | string | Yes | Impact scope |
| political.key_signals[].impact.recommendation | string | Yes | Response recommendation |
| economic | object | Yes | Economic dimension, cannot be missing; when data insufficient, fill with industry benchmark values and annotate "estimated value" |
| economic.trends | array | Yes | At least 1 trend; each must contain trend, direction, strength, impact_path |
| economic.trends[].trend | string | Yes | Trend description, cannot be empty |
| economic.trends[].direction | string | Yes | Trend direction, enum: rising/declining/stable/emerging |
| economic.trends[].strength | string | Yes | Trend strength, enum: strong/medium/weak |
| economic.trends[].impact_path | string | Yes | Category impact path, cannot be empty |
| economic.key_signals | array | Yes | Signal list; each must contain signal, type, timing, source, impact |
| economic.key_signals[].signal | string | Yes | Signal description, cannot be empty |
| economic.key_signals[].type | string | Yes | Signal type, enum: new_policy_release/indicator_mutation/trend_reversal/technology_breakthrough |
| economic.key_signals[].timing | string | Yes | Signal timeliness, enum: has_occurred/is_occurring/expected_to_occur |
| economic.key_signals[].source | string | Yes | Signal source, cannot be empty |
| economic.key_signals[].impact | object | Yes | Impact assessment, must contain direction, degree, time_window, scope, recommendation |
| economic.key_signals[].impact.direction | string | Yes | Impact direction, enum: positive/negative/neutral |
| economic.key_signals[].impact.degree | integer | Yes | Impact level, 1-5 |
| economic.key_signals[].impact.time_window | string | Yes | Impact time window, enum: short_term/medium_term/long_term |
| economic.key_signals[].impact.scope | string | Yes | Impact scope |
| economic.key_signals[].impact.recommendation | string | Yes | Response recommendation |
| social | object | Yes | Social dimension, cannot be missing; when data insufficient, fill with industry benchmark values and annotate "estimated value" |
| social.trends | array | Yes | At least 1 trend; each must contain trend, direction, strength, impact_path |
| social.trends[].trend | string | Yes | Trend description, cannot be empty |
| social.trends[].direction | string | Yes | Trend direction, enum: rising/declining/stable/emerging |
| social.trends[].strength | string | Yes | Trend strength, enum: strong/medium/weak |
| social.trends[].impact_path | string | Yes | Category impact path, cannot be empty |
| social.key_signals | array | Yes | Signal list; each must contain signal, type, timing, source, impact |
| social.key_signals[].signal | string | Yes | Signal description, cannot be empty |
| social.key_signals[].type | string | Yes | Signal type, enum: new_policy_release/indicator_mutation/trend_reversal/technology_breakthrough |
| social.key_signals[].timing | string | Yes | Signal timeliness, enum: has_occurred/is_occurring/expected_to_occur |
| social.key_signals[].source | string | Yes | Signal source, cannot be empty |
| social.key_signals[].impact | object | Yes | Impact assessment, must contain direction, degree, time_window, scope, recommendation |
| social.key_signals[].impact.direction | string | Yes | Impact direction, enum: positive/negative/neutral |
| social.key_signals[].impact.degree | integer | Yes | Impact level, 1-5 |
| social.key_signals[].impact.time_window | string | Yes | Impact time window, enum: short_term/medium_term/long_term |
| social.key_signals[].impact.scope | string | Yes | Impact scope |
| social.key_signals[].impact.recommendation | string | Yes | Response recommendation |
| technological | object | Yes | Technological dimension, cannot be missing; when data insufficient, fill with industry benchmark values and annotate "estimated value" |
| technological.trends | array | Yes | At least 1 trend; each must contain trend, direction, strength, impact_path |
| technological.trends[].trend | string | Yes | Trend description, cannot be empty |
| technological.trends[].direction | string | Yes | Trend direction, enum: rising/declining/stable/emerging |
| technological.trends[].strength | string | Yes | Trend strength, enum: strong/medium/weak |
| technological.trends[].impact_path | string | Yes | Category impact path, cannot be empty |
| technological.key_signals | array | Yes | Signal list; each must contain signal, type, timing, source, impact |
| technological.key_signals[].signal | string | Yes | Signal description, cannot be empty |
| technological.key_signals[].type | string | Yes | Signal type, enum: new_policy_release/indicator_mutation/trend_reversal/technology_breakthrough |
| technological.key_signals[].timing | string | Yes | Signal timeliness, enum: has_occurred/is_occurring/expected_to_occur |
| technological.key_signals[].source | string | Yes | Signal source, cannot be empty |
| technological.key_signals[].impact | object | Yes | Impact assessment, must contain direction, degree, time_window, scope, recommendation |
| technological.key_signals[].impact.direction | string | Yes | Impact direction, enum: positive/negative/neutral |
| technological.key_signals[].impact.degree | integer | Yes | Impact level, 1-5 |
| technological.key_signals[].impact.time_window | string | Yes | Impact time window, enum: short_term/medium_term/long_term |
| technological.key_signals[].impact.scope | string | Yes | Impact scope |
| technological.key_signals[].impact.recommendation | string | Yes | Response recommendation |
| alerts | array | Yes | Alert list for impact level ≥4; empty array when no high-impact signals |
| alerts[].signal | string | Yes (when alerts non-empty) | Alert signal description |
| alerts[].dimension | string | Yes (when alerts non-empty) | PEST dimension |
| alerts[].impact_degree | integer | Yes (when alerts non-empty) | Impact level, ≥4 |
| alerts[].impact_direction | string | Yes (when alerts non-empty) | Impact direction |
| alerts[].recommendation | string | Yes (when alerts non-empty) | Response recommendation |
| alerts[].timestamp | string | Yes (when alerts non-empty) | Alert timestamp |

```json
{
  "category_keywords": "Online Education",
  "target_market": "Mainland China",
  "scan_timestamp": "2026-05-10T08:00:00Z",
  "political": {
    "trends": [
      {
        "trend": "Data privacy regulations tightening, increased personal data protection",
        "direction": "rising",
        "strength": "strong",
        "impact_path": "Compliance cost increase → higher entry barriers for SMBs"
      }
    ],
    "key_signals": [
      {
        "signal": "Implementation rules for Personal Information Protection Law released",
        "type": "new_policy_release",
        "timing": "has_occurred",
        "source": "State Council website",
        "impact": {
          "direction": "negative",
          "degree": 5,
          "time_window": "medium_term",
          "scope": "industry",
          "recommendation": "Accelerate compliance system development, establish data privacy protection mechanisms"
        },
        "alert": false
      }
    ]
  },
  "economic": {
    "trends": [],
    "key_signals": []
  },
  "social": {
    "trends": [],
    "key_signals": []
  },
  "technological": {
    "trends": [],
    "key_signals": []
  },
  "alerts": [
    {
      "signal": "Implementation rules for Personal Information Protection Law released",
      "dimension": "Political",
      "impact_degree": 5,
      "impact_direction": "negative",
      "recommendation": "Accelerate compliance system development, establish data privacy protection mechanisms",
      "timestamp": "2026-05-10T08:00:00Z"
    }
  ]
}
```

## Decision Rules

| Rule | Trigger Condition | Action |
|------|---------|------|
| Real-time alert | Impact level ≥ 4 | Real-time alert to human PM, push signal description + impact assessment + response recommendation |
| Routine monitoring | Impact level < 3 | Group into routine monitoring list, no alert triggered |
| Signal escalation | Signal source unverifiable or contradictory | Annotate as needing human confirmation, lower confidence |
| Data source reliability < 0.5 | Annotate "unreliable data source", recommend human verification or alternative data source |
| PEST dimension data missing | Annotate "dimension data incomplete", fill with industry benchmark values and annotate "estimated value" |

## Quality Check

- [ ] Political dimension scanned
- [ ] Economic dimension scanned
- [ ] Social dimension scanned
- [ ] Technological dimension scanned
- [ ] At least 3 trend summaries per dimension
- [ ] Key change signals identified
- [ ] Impact assessment completed (direction + level + time window)
- [ ] Major changes (impact level ≥4) alerted
- [ ] Data sources annotated | Each PEST dimension annotated with data source and reliability | Dimensions without source annotation marked "source unknown"

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| No strong dependencies | This Skill can run independently; user provides category and target market to execute | Output complete, no impact | Request user to provide category keywords and target market |
| All upstream files missing | User provides category keywords and target market → scan PEST four-dimension trends based on AI knowledge base | Trend data based on AI knowledge base inference, confidence annotated as "estimated value", timeliness may lag | Request user to provide category keywords (e.g., "online education") and target market (e.g., "Mainland China") |
| If user does not provide category_keywords | Prompt user to provide category keywords; otherwise cannot determine scan scope | Cannot generate output, process interrupted | Request user to provide category keywords (e.g., "online education", "SaaS CRM") |
| If user does not provide target_market | Prompt user to provide target market; otherwise default to "Mainland China" | Target market defaults to "Mainland China"; trends for other markets may be missed | Request user to provide target market name (e.g., "North America", "Southeast Asia") |

## Data Acquisition Instructions

This Skill requires category keywords and target market information. Please provide via one of the following methods:
  1. Directly input category keywords (e.g., "online education", "SaaS CRM") and target market (e.g., "Mainland China")
  2. Upload industry analysis data files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

## Upstream Change Response

### Upstream Change Impact Table

| Upstream File | Change Type | Affected PEST Dimension | Impact Description |
|---------|---------|-------------|---------|
| tam-som.json | Market size data change | Economic | TAM/SAM/SOM size adjustments directly affect economic dimension industry growth rate, market capacity, and other trend judgments |
| competitor-analysis.json | Competitor technology dynamics change | Technological | Competitor new technology adoption, patent layout, and other dynamics affect technology dimension maturity and adoption curve judgments |
| competitor-analysis.json | Competitor compliance strategy change | Political | Competitor regulatory response strategy changes can reverse-infer policy enforcement intensity and trend direction |
| tam-som.json | Regional market data change | Social | Regional market user scale and penetration rate changes affect social dimension consumption habit and user preference judgments |

### Downstream Notification Mechanism Table

| PEST Change Type | Trigger Condition | Notify Downstream | Notification Content |
|-------------|---------|---------|---------|
| Major political change | Political dimension signal with impact level ≥4 | market-competitor-analysis | Policy change summary, impact assessment, competitor response recommendations |
| Major political change | Political dimension signal with impact level ≥4 | market-tam-som | Policy change impact on market access and size assessment, recommend recalculating TAM/SAM/SOM |
| Major economic change | Economic dimension signal with impact level ≥4 | market-tam-som | Economic indicator change summary, recommend re-evaluating market size and growth rate |
| Major technological change | Technological dimension signal with impact level ≥4 | market-competitor-analysis | Technology breakthrough summary, impact assessment, recommend updating competitor Feature Matrix technology dimension |
| Major social change | Social dimension signal with impact level ≥4 | market-tam-som | Social trend change summary, recommend re-evaluating target user scale and penetration rate |
