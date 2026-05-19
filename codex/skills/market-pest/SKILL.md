---
name: market-pest
description: "Use when scanning target market policies, economic indicators, social trends, and technology dynamics. PEST auto-scan outputs four-dimension trend summaries and impact assessments with tiered signal alerts. Keywords: PEST analysis, policy regulations, economic indicators, social trends, technology dynamics, environmental scanning, signal alerts."
metadata:
  module: "Product Discovery"
  sub-module: "Market Competitor"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "What changes in the market environment"
    - "How do policies affect us"
    - "Scan the external environment for me"
---

# PEST Auto-Scan

## Core Principles

1. **All four dimensions are essential** -- All four PEST dimensions must be scanned; analysis missing any dimension is incomplete; when data is insufficient, fill with industry baseline values and annotate "inferred value"
2. **Tiered signals, not flat listing** -- Not all trends are equally important; signals with impact level >= 4 trigger alerts; < 3 are grouped into routine monitoring; resources focus on high-impact signals
3. **Timeliness annotation** -- Each signal is annotated as "has occurred / is occurring / expected to occur"; different timeliness requires completely different response strategies; occurred events need immediate response, expected events need advance preparation
4. **Impact path traceability** -- Each trend must be linked to a category impact path (e.g., "compliance cost increase -> higher entry barrier for SMEs"); trends without linked impact paths are noise

## Interaction Mode

AI AI auto-executes

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| category_keywords | string | Yes | User provided | Category keywords, e.g., "online education", "SaaS CRM" |
| target_market | string | Yes | User provided | Target market, e.g., "Mainland China", "Southeast Asia" |

## Execution Steps

### Step 1: Scheduled Scanning

Collect and monitor information across four dimensions:

| Dimension | Scan Scope | Data Sources |
|------|---------|--------|
| Political | Industry regulatory policies, access permits, compliance requirements, data privacy regulations, tax policies, subsidy policies | Government websites, regulatory databases, industry association announcements, policy interpretation media |
| Economic | GDP growth rate, industry growth rate, consumer spending, financing environment, exchange rate fluctuations, inflation rate | Statistics bureau data, central bank reports, third-party economic databases |
| Social | Demographic structure changes, consumption habit migration, cultural trends, user preference evolution, lifestyle changes | Social media trends, user research reports, census data, lifestyle studies |
| Technological | New technology maturity, technology adoption curves, infrastructure evolution, technology standard changes, patent trends | Technology media, patent databases, Gartner/IDC technology reports, open-source community dynamics |

### Step 2: Trend Summary

Structure summaries of information collected for each dimension:

- Extract core trends (3-5 per dimension)
- Annotate trend direction (rising/declining/stable/emerging)
- Annotate trend strength (strong/medium/weak)
- Link category impact path

### Step 3: Key Change Signals

Identify key change signals from trend summaries:

- Signal type: New policy release / Indicator mutation / Trend reversal / Technology breakthrough
- Signal timing: Has occurred / Is occurring / Expected to occur
- Signal source and verifiability

### Step 4: Impact Assessment

Assess impact for each key change signal:

| Assessment Dimension | Description |
|---------|------|
| Impact direction | Positive (opportunity) / Negative (threat) / Neutral |
| Impact level | 1-5 points (1 = minimal impact, 5 = disruptive impact) |
| Impact time window | Short-term (< 6 months) / Medium-term (6-18 months) / Long-term (> 18 months) |
| Impact scope | Category only / Entire industry / Cross-industry |
| Response recommendation | Leverage strategy / Avoidance strategy / Monitoring strategy |

### Step 5: Major Change Alerts

Trigger alerts for high-impact signals:

- Filter signals with impact level >= 4
- Generate alert summary: Signal description + Impact assessment + Response recommendation
- Push to human PM in real-time

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
| category_keywords | string | Yes | Category keywords, must not be empty string |
| target_market | string | Yes | Target market, must not be empty string |
| scan_timestamp | string | Yes | ISO 8601 format scan timestamp |
| political | object | Yes | Political dimension, must not be missing |
| political.trends | array | Yes | Must contain at least 1 trend; each must include trend, direction, strength, impact_path |
| political.key_signals | array | Yes | Signal list; each must include signal, type, timing, source, impact |
| economic | object | Yes | Economic dimension, must not be missing; when data insufficient, fill with industry baseline values and annotate "inferred value" |
| economic.trends | array | Yes | Must contain at least 1 trend; each must include trend, direction, strength, impact_path |
| economic.key_signals | array | Yes | Signal list; each must include signal, type, timing, source, impact |
| social | object | Yes | Social dimension, must not be missing; when data insufficient, fill with industry baseline values and annotate "inferred value" |
| social.trends | array | Yes | Must contain at least 1 trend; each must include trend, direction, strength, impact_path |
| social.key_signals | array | Yes | Signal list; each must include signal, type, timing, source, impact |
| technological | object | Yes | Technological dimension, must not be missing; when data insufficient, fill with industry baseline values and annotate "inferred value" |
| technological.trends | array | Yes | Must contain at least 1 trend; each must include trend, direction, strength, impact_path |
| technological.key_signals | array | Yes | Signal list; each must include signal, type, timing, source, impact |
| alerts | array | Yes | Alert list for impact level >= 4; empty array when no high-impact signals |
| alerts[].signal | string | Yes (when alerts non-empty) | Alert signal description |
| alerts[].dimension | string | Yes (when alerts non-empty) | PEST dimension |
| alerts[].impact_degree | integer | Yes (when alerts non-empty) | Impact level, >= 4 |
| alerts[].impact_direction | string | Yes (when alerts non-empty) | Impact direction |
| alerts[].recommendation | string | Yes (when alerts non-empty) | Response recommendation |
| alerts[].timestamp | string | Yes (when alerts non-empty) | Alert timestamp |

```json
{
  "category_keywords": "Online education",
  "target_market": "Mainland China",
  "scan_timestamp": "2026-05-10T08:00:00Z",
  "political": {
    "trends": [
      {
        "trend": "Data privacy regulations tightening, personal data protection strengthening",
        "direction": "Rising",
        "strength": "Strong",
        "impact_path": "Compliance cost increase -> higher entry barrier for SMEs"
      }
    ],
    "key_signals": [
      {
        "signal": "Implementation rules for Personal Information Protection Law released",
        "type": "New policy release",
        "timing": "Has occurred",
        "source": "State Council website",
        "impact": {
          "direction": "Negative",
          "degree": 5,
          "time_window": "Medium-term",
          "scope": "Industry",
          "recommendation": "Accelerate compliance system construction, establish data privacy protection mechanisms"
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
      "impact_direction": "Negative",
      "recommendation": "Accelerate compliance system construction, establish data privacy protection mechanisms",
      "timestamp": "2026-05-10T08:00:00Z"
    }
  ]
}
```

## Decision Rules

| Rule | Trigger Condition | Action |
|------|---------|------|
| Real-time alert | Impact level >= 4 | Real-time alert to human PM, push signal description + impact assessment + response recommendation |
| Routine monitoring | Impact level < 3 | Group into routine monitoring list, do not trigger alert |
| Signal escalation | Signal source unverifiable or contradictory | Annotate as needing human confirmation, lower confidence |
| Data source reliability < 0.5 | Annotate "unreliable data source", recommend human verification or alternative data source |
| PEST dimension data missing | Annotate "dimension data incomplete", fill with industry baseline values and annotate "inferred value" |

## Quality Checks

- [ ] Political dimension scanned
- [ ] Economic dimension scanned
- [ ] Social dimension scanned
- [ ] Technological dimension scanned
- [ ] At least 3 trend summaries per dimension
- [ ] Key change signals identified
- [ ] Impact assessment completed (direction + level + time window)
- [ ] Major changes (impact level >= 4) alerted
- [ ] Data sources annotated | Each PEST dimension annotated with data source and reliability | Dimensions without source annotation marked "source unknown"

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|----------|
| No strong dependencies | This Skill can run independently; user provides category and target market to execute | Output complete, no impact |
| All upstream files missing | User provides category keywords and target market -> scan PEST four-dimension trends based on AI knowledge base | Trend data based on AI knowledge base inference, confidence annotated as "inferred value", timeliness may lag |
| If user does not provide category_keywords | Prompt user to provide category keywords; otherwise cannot determine scan scope | Cannot generate output, process interrupted |
| If user does not provide target_market | Prompt user to provide target market; otherwise default to "Mainland China" | Target market defaults to "Mainland China", trends for other markets may be missed |

## Data Acquisition Instructions

This Skill requires category keywords and target market information. Please provide via one of the following methods:
  1. Directly input category keywords (e.g., "online education", "SaaS CRM") and target market (e.g., "Mainland China")
  2. Upload industry analysis data files
  3. Provide data file paths
- AI is not responsible for external data collection; only for analysis

## Upstream Change Response

### Upstream Change Impact Table

| Upstream File | Change Type | Affected PEST Dimension | Impact Description |
|---------|---------|-------------|---------|
| tam-som.json | Market size data change | Economic | TAM/SAM/SOM size adjustments directly affect industry growth rate and market capacity trend judgments in economic indicators |
| competitor-analysis.json | Competitor technology dynamics change | Technological | Competitor new technology adoption and patent layout affect technology maturity and adoption curve judgments in the technology dimension |
| competitor-analysis.json | Competitor compliance strategy change | Political | Competitor regulatory response strategy changes can reverse-infer policy enforcement intensity and trend direction |
| tam-som.json | Regional market data change | Social | Regional market user scale and penetration rate changes affect consumption habit and user preference judgments in social trends |

### Downstream Notification Mechanism Table

| PEST Change Type | Trigger Condition | Notify Downstream | Notification Content |
|-------------|---------|---------|---------|
| Major political change | Political dimension signal with impact level >= 4 | market-competitor-analysis | Policy change summary, impact assessment, competitor response recommendations |
| Major political change | Political dimension signal with impact level >= 4 | market-tam-som | Impact assessment of policy change on market access and size; recommend re-estimating TAM/SAM/SOM |
| Major economic change | Economic dimension signal with impact level >= 4 | market-tam-som | Economic indicator change summary; recommend re-evaluating market size and growth rate |
| Major technology change | Technological dimension signal with impact level >= 4 | market-competitor-analysis | Technology breakthrough summary, impact assessment; recommend updating technology dimension in competitor Feature Matrix |
| Major social change | Social dimension signal with impact level >= 4 | market-tam-som | Social trend change summary; recommend re-evaluating target user scale and penetration rate |
