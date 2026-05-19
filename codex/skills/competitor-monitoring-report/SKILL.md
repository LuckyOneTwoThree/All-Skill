---
name: competitor-monitoring-report
description: "Use when generating competitor monitoring reports. Competitor monitoring report generation, tracking competitor product/market/sentiment dynamics, assessing threat levels and response strategies. Keywords: competitor monitoring, competitor report, competitor dynamics, threat assessment, competitor tracking, competitive analysis, competitor response."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Competitor Monitoring"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Generate competitor monitoring report"
    - "What are competitors doing recently"
    - "Competitor threat assessment"
    - "How to respond to competitor changes"
execution_depth:
  default: standard
  quick_description: "Output competitor dynamics summary and threat level"
  deep_description: "Full report + competitor trend prediction + strategic impact simulation + response strategy roadmap"
---

# Competitor Monitoring Report Generation AI->Human

## Core Principles

1. **Monitoring is continuous, not one-time**: Competitor dynamics change at any time; reports are snapshots, monitoring must be continuous
2. **Threat assessment is evidence-based, not subjective**: Every threat judgment must have data support, avoiding subjective bias
3. **Response strategies must be actionable**: Reports are not for reading but for action; every suggestion must have clear execution steps

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Competitor Tracking Data | JSON | Yes | diagnosis-competition -> Competitor tracking data | Feature changes, advantage changes |
| Competitor Analysis | JSON | No | market-competitor-analysis -> Competitor analysis | Market position, strategy analysis |
| Monitoring Period | string | No | User provided | Report coverage period (default last 30 days) |

## Execution Steps

### Step 1: Dynamic Data Aggregation [Core]

**Goal**: Aggregate multi-dimensional competitor dynamic data

**Data Dimensions**:

| Dimension | Data Source | Update Frequency |
|-----------|-------------|------------------|
| Product Dynamics | diagnosis-competition | Real-time |
| Market Dynamics | Competitor analysis | Weekly |
| User Sentiment | Social media/Reviews | Daily |

**Aggregation Output**:

```yaml
dynamics_summary:
  period: {start} to {end}
  product_dynamics:
    new_features: {count}
    enhancements: {count}
    deprecations: {count}
  market_dynamics:
    market_share_changes: [{competitor: {delta}}]
    pricing_changes: [{competitor: {change}}]
  sentiment_dynamics:
    positive_trends: [{competitor}]
    negative_trends: [{competitor}]
```

### Step 2: Threat Level Assessment [Core]

**Goal**: Assess threat level of each competitor to self

**Assessment Model**:

| Dimension | Weight | Scoring Criteria |
|-----------|--------|------------------|
| Feature Overlap | 30% | Overlap ratio with core features |
| User Overlap | 25% | Target user overlap degree |
| Market Momentum | 25% | Growth rate, market share trend |
| Resource Advantage | 20% | Capital, team, technology |

**Threat Level Classification**:

| Level | Score Range | Response Urgency |
|-------|-------------|------------------|
| Critical | 8-10 | Immediate response |
| High | 6-7.9 | Respond within 1 week |
| Medium | 4-5.9 | Include in iteration plan |
| Low | 0-3.9 | Continue monitoring |

**Assessment Output**:

```yaml
threat_assessment:
  - competitor: {name}
    overall_score: 7.5
    level: high
    dimensions:
      feature_overlap:
        score: 8
        details: "Core payment flow 90% overlap"
      user_overlap:
        score: 7
        details: "Target user group 60% overlap"
      market_momentum:
        score: 8
        details: "MAU monthly growth 15%"
      resource_advantage:
        score: 6
        details: "Recently completed Series B funding"
    key_threats:
      - "Payment feature experience catching up"
      - "Rapidly gaining users in tier-2 cities"
```

### Step 3: Response Strategy Suggestions [Deep]

**Goal**: Generate targeted response strategy suggestions

**Strategy Matrix**:

| Threat Level | Feature Overlap | Recommended Strategy |
|--------------|----------------|---------------------|
| Critical | High | Accelerate core feature iteration |
| Critical | Low | Differentiated defense |
| High | High | Feature parity + differentiation |
| High | Low | Strengthen moat |
| Medium | Any | Monitor + reserve plans |
| Low | Any | Continue monitoring |

**Strategy Output**:

```yaml
response_suggestions:
  - competitor: {name}
    threat_level: high
    suggested_strategy: feature_parity_and_differentiation
    actions:
      - action: "Accelerate payment feature optimization"
        priority: P0
        timeline: 2 weeks
        owner: product_team
      - action: "Launch tier-2 city targeted marketing"
        priority: P1
        timeline: 4 weeks
        owner: marketing_team
    differentiators_to_strengthen:
      - "AI recommendation algorithm advantage"
      - "Enterprise customer service experience"
```

### Step 4: Report Generation [Core]

**Goal**: Generate complete competitor monitoring report

**Report Structure**:

```yaml
competitor_monitoring_report:
  report_id: {uuid}
  generated_at: {ISO8601}
  period: {start} to {end}
  executive_summary:
    key_findings: [{finding}]
    critical_threats: [{threat}]
    recommended_actions: [{action}]
  dynamics:
    product: {summary}
    market: {summary}
    sentiment: {summary}
  threat_assessment:
    - competitor: {name}
      level: {level}
      score: {score}
  response_suggestions:
    - competitor: {name}
      strategy: {strategy}
      actions: [{action}]
  monitoring_recommendations:
    focus_areas: [{area}]
    alert_triggers: [{trigger}]
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | competitor dynamics summary and threat level | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full report + competitor trend prediction + strategic impact simulation + response strategy roadmap | Full deliverables + extended analysis + deep simulation |

## Output


**Output file path**: `output/pm-monitoring/competitor-monitoring-report/`
**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_id", "period", "threat_assessment", "response_suggestions"],
  "properties": {
    "report_id": {"type": "string", "description": "Report unique identifier"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "period": {"type": "object", "description": "Monitoring period, including start and end times"},
    "executive_summary": {"type": "object", "description": "Executive summary, including key findings and critical threats"},
    "dynamics": {"type": "object", "description": "Dynamic data, including product/market/sentiment three dimensions"},
    "threat_assessment": {"type": "array", "description": "Threat assessment list, including competitor name, level and score"},
    "response_suggestions": {"type": "array", "description": "Response suggestion list, including strategy and action items"},
    "monitoring_recommendations": {"type": "object", "description": "Monitoring recommendations, including focus areas and alert triggers"}
  }
}
```

```
├── {date}/
│   ├── dynamics_summary.yaml
│   ├── threat_assessment.yaml
│   ├── response_suggestions.yaml
│   └── full_report.md
└── latest/
    └── competitor_monitoring_report.md
```

## Decision Rules

| Scenario | Decision Rule |
|----------|---------------|
| Competitor launches disruptive feature | Threat level auto-upgraded to Critical |
| Multiple competitors homogenizing | Trigger differentiation strategy generation |
| Competitor market share growth > 5% | Threat level auto-upgraded by 1 level |
| No significant competitor dynamics | Report marked as "stable period" |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Dynamic coverage complete (product/market/sentiment 3 dimensions all analyzed)
- [ ] Threat assessment evidence-based (each assessment has data support)

### P1 Checks (must pass for standard/deep)

- [ ] Response suggestions actionable (each suggestion has clear execution steps)
- [ ] Report structure complete (executive summary + detailed analysis + suggestions)
- [ ] Monitoring recommendations reasonable (focus areas and alert triggers clear)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|------------------|---------------|
| Competitor tracking data | User provides competitor name list and known dynamics, AI supplements analysis based on public information and industry knowledge | Report based on AI knowledge + user input, data sources and confidence need to be marked |
| Competitor analysis | Skip market dynamics dimension, report based solely on product dynamics and sentiment analysis | Report lacking market dynamics dimension |
| Monitoring period | Default last 30 days, AI infers monitoring period based on available data | Report using default period |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Competitor tracking data missing**: Ask user to provide competitor name list and known dynamics (e.g., recent feature updates, pricing changes, etc.), AI will supplement analysis based on public information and industry knowledge, marking data sources and confidence in output
2. **Competitor analysis missing**: Skip market dynamics dimension, report based solely on product dynamics and sentiment analysis, recommend supplementing competitor analysis data later to improve report quality
3. **Monitoring period not provided**: Default to last 30 days, AI infers monitoring period based on available data, mark in output

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| report_id | string | Yes | Report unique identifier |
| period | object | Yes | Monitoring period, must contain start/end |
| threat_assessment | array | Yes | Threat assessment list, each must contain competitor/level/score |
| threat_assessment[].level | string | Yes | Threat level, only Critical/High/Medium/Low allowed |
| threat_assessment[].score | number | Yes | Threat score, range 0-10 |
| response_suggestions | array | Yes | Response suggestion list, each must contain competitor/strategy/actions |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|-----------------|-------------|--------------|-----------------|
| diagnosis-competition | Competitor tracking data update | Dynamic data aggregation and threat assessment | Update dynamic data, re-evaluate threat levels |
| market-competitor-analysis | Competitor analysis update | Market dynamics and strategy suggestions | Update market dynamics analysis, adjust strategy suggestions |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|---------------------|------------------------|---------------------|----------------------|
| diagnosis-orchestrator | Competitor monitoring report completed | Output file update | Report completion status and key findings |
| iteration-decision | Critical/High level threat | Write to output file | Threat details and response strategies |
