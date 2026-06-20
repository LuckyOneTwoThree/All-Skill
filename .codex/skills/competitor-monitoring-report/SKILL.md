---
name: competitor-monitoring-report
description: Use when you need to consolidate competitor tracking data into a complete, deliverable monitoring report. Competitor Dynamic Monitoring Report auto-generation, including competitor dynamics summary, feature change tracking, market strategy changes, threat assessment, and response recommendations. Keywords: competitor monitoring report, competitor dynamics, feature tracking, threat assessment, competitor response, competitor report, what are competitors doing.
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Issue Diagnosis"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "What new moves have competitors made recently"
    - "Generate a competitor monitoring report for me"
    - "What features have competitors updated"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output competitor dynamics summary and threat level"
  deep_description: "Complete report + competitor trend prediction + strategic impact inference + response strategy roadmap"
---

# Competitor Dynamic Monitoring Report Generation

## Core Principles

**Competitor monitoring is not snooping, but strategic awareness**

The core value of competitor dynamic monitoring reports lies in transforming scattered competitor information into structured strategic insights. The purpose of monitoring is not to imitate competitors, but to understand market landscape changes and identify threats and opportunities.

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Competitor tracking data | markdown | Yes | diagnosis-competition | Feature changes, strength/weakness changes, response strategies |
| Competitor intelligence | markdown | No | market-competitor-analysis | Competitor dynamics, reputation, pricing |
| Competitor classification | markdown | No | market-competitor-analysis | Four-quadrant classification, competitor positioning |
| Monitoring period | text | No | User input | Time range covered by the report |

### Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|----------|----------|----------|
| No competitor tracking data | Generate report based on competitor intelligence, mark "tracking data missing" | Report lacks feature change tracking details |
| No competitor intelligence | Generate framework based on user-provided information, mark "awaiting analysis supplement" | Report is framework-level, lacking intelligence support |
| No competitor classification | Default to monitoring direct competitors, mark "classification to be supplemented" | Only covers direct competitors, indirect/substitute competitors missing |
| No monitoring period | Default to last 30 days, mark "period to be confirmed" | Report coverage range may be inaccurate |

## Execution Steps

### Step 1: Competitor Dynamics Summary [Core]

Summarize all competitor dynamics within the monitoring period:

1. **Major dynamics**: Fundraising/M&A/executive changes/strategic pivots
2. **Product dynamics**: New feature launches/feature retirements/major redesigns
3. **Market dynamics**: New market entry/pricing adjustments/channel changes
4. **Sentiment dynamics**: Positive/negative public sentiment, user reputation changes

### Step 2: Feature Change Tracking [Conditional]

Track competitor feature changes in detail:

1. **New features**: Feature description, target users, overlap with own product
2. **Feature optimizations**: Optimization content, user experience changes
3. **Feature retirements**: Retired features, possible reasons
4. **Feature comparison matrix**: Competitor comparison update across core feature dimensions

### Step 3: Market Strategy Changes [Conditional]

Analyze competitor market strategy changes:

1. **Pricing strategy changes**: Price adjustments, new pricing models, promotional campaigns
2. **Channel strategy changes**: New channel development, channel focus shifts
3. **Target market changes**: New user segments, new industry/geographic expansion
4. **Partnership ecosystem changes**: New partners, integration expansions

### Step 4: Threat Assessment [Core]

Assess the threat of competitor dynamics to your own product:

1. **Direct threats**: Competitor features directly replacing your core features
2. **Indirect threats**: Competitor strategy changes affecting your market position
3. **Opportunity windows**: Competitor missteps or vacated market space
4. **Threat level**: 🔴 Severe / 🟠 High / 🟡 Medium / 🟢 Low

### Step 5: Response Recommendations [Deep]

Generate response recommendations based on threat assessment:

1. **Immediate response** (1-2 weeks): Emergency response to severe threats
2. **Short-term response** (1-2 months): Feature alignment or differentiation strategy
3. **Long-term response** (quarterly+): Strategic adjustment or new direction exploration
4. **Monitoring enhancement**: Competitors or dimensions requiring increased monitoring

### Step 6: Report Assembly [Core]

Assemble the above content into a complete monitoring report.

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Competitor dynamics summary and threat level | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output, including all Step outputs |
| deep | Complete report + competitor trend prediction + strategic impact inference + response strategy roadmap | Complete output + extended analysis + deep inference |

## Output

### Output Files

| File | Path | Description |
|------|------|------|
| Competitor monitoring report | `output/pm-monitoring/competitor-monitoring-report/competitor-monitoring-report.md` | Human-readable complete report |
| Structured data | `output/pm-monitoring/competitor-monitoring-report/competitor-monitoring-report.json` | Machine-consumable structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["monitoring_period", "summary", "dynamics", "threat_assessment"],
  "properties": {
    "monitoring_period": {"type": "object", "description": "Monitoring period, including start and end dates"},
    "report_date": {"type": "string", "description": "Report date"},
    "summary": {"type": "object", "description": "Executive summary, including number of monitored competitors, major dynamics, and threat level"},
    "dynamics": {"type": "object", "description": "Competitor dynamics summary, including major/product/market/sentiment dynamics"},
    "feature_changes": {"type": "object", "description": "Feature change tracking, including new/optimized/retired and comparison matrix"},
    "market_strategy_changes": {"type": "array", "description": "Market strategy changes list"},
    "threat_assessment": {"type": "object", "description": "Threat assessment, including direct/indirect threats and opportunity windows"},
    "response_recommendations": {"type": "object", "description": "Response recommendations, including immediate/short-term/long-term and monitoring enhancement"}
  }
}
```

### Markdown Report Structure

```markdown
# Competitor Dynamic Monitoring Report: {Monitoring Period}

## 1. Executive Summary
- Monitoring period / Number of monitored competitors / Number of major dynamics / Threat level

## 2. Competitor Dynamics Summary
- Major dynamics
- Product dynamics
- Market dynamics
- Sentiment dynamics

## 3. Feature Change Tracking
- New features
- Feature optimizations
- Feature retirements
- Feature comparison matrix update

## 4. Market Strategy Changes
- Pricing strategy
- Channel strategy
- Target market
- Partnership ecosystem

## 5. Threat Assessment
- Direct threats
- Indirect threats
- Opportunity windows
- Threat level matrix

## 6. Response Recommendations
- Immediate response
- Short-term response
- Long-term response
- Monitoring enhancement recommendations
```

### JSON Structure

```json
{
  "monitoring_period": { "start": "", "end": "" },
  "report_date": "",
  "summary": {
    "competitors_monitored": 0,
    "major_events": 0,
    "threat_level": "severe|high|medium|low"
  },
  "dynamics": {
    "major": [],
    "product": [],
    "market": [],
    "sentiment": []
  },
  "feature_changes": {
    "new_features": [],
    "optimizations": [],
    "retirements": [],
    "comparison_matrix": {}
  },
  "market_strategy_changes": [],
  "threat_assessment": {
    "direct_threats": [],
    "indirect_threats": [],
    "opportunities": [],
    "threat_matrix": {}
  },
  "response_recommendations": {
    "immediate": [],
    "short_term": [],
    "long_term": [],
    "monitoring_enhancement": []
  }
}
```

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Dynamics coverage is complete (analysis across product/market/sentiment dimensions)
- [ ] Threat assessment is evidence-based (each threat is supported by specific competitor dynamics)

### P1 Checks (must pass for standard/deep)

- [ ] Response recommendations are actionable (each recommendation has a timeframe and responsible party)
- [ ] Feature comparison is updated (comparison matrix reflects latest competitor status)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| monitoring_period | object | Yes | Monitoring period, must include start/end |
| summary | object | Yes | Executive summary, must include competitors_monitored/major_events/threat_level |
| summary.threat_level | string | Yes | Threat level, only allows severe/high/medium/low |
| dynamics | object | Yes | Competitor dynamics, must include major/product/market/sentiment |
| threat_assessment | object | Yes | Threat assessment, must include direct_threats/indirect_threats/opportunities |
| response_recommendations | object | No | Response recommendations, must include immediate/short_term/long_term |

## Decision Rules

- When threat level is severe/high, must include immediate response recommendations (executable within 1-2 weeks)
- When competitor features directly overlap, prioritize evaluating differentiation strategy over feature alignment
- When monitoring data covers ≥3 competitors, generate a complete comparison matrix
- Decision points requiring human confirmation: threat level determination, response strategy prioritization, monitoring competitor scope adjustment

## Degradation Strategy

- When no competitor tracking data: Generate report based on competitor analysis, mark "tracking data missing"
- When no competitor classification: Default to monitoring direct competitors, mark "classification to be supplemented"
- When competitor analysis is incomplete: Generate report framework, mark missing dimensions as "awaiting analysis supplement"
- When data is unavailable: Generate qualitative analysis report based on user-provided information, mark "requires data validation"

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| diagnosis-competition | Feature change data update | Feature change tracking and threat assessment | Update feature comparison matrix and threat level |
| market-competitor-analysis | Competitor intelligence update | Competitor dynamics summary and market strategy analysis | Update dynamics summary and strategy changes |
| market-competitor-analysis | Competitor classification change | Monitoring scope and threat assessment | Adjust monitoring competitor scope |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| diagnosis-orchestrator | Monitoring report generation complete | Output file update | Report completion status and key threat level |
| iteration-backlog-grooming | Threat level is severe/high | Write to output file | Competitor threat and immediate response recommendations |
