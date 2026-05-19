---
name: diagnosis-competition
description: "Use when tracking competitor dynamics and formulating response strategies. Competitor dynamics tracking and response, monitoring competitor feature changes, evaluating dynamic shifts in competitive advantage, generating response strategies and tracking effectiveness. Keywords: competitor tracking, competitor analysis, competitor monitoring, feature changes, competitive analysis, competitor shifts, competitor dynamics."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Issue Diagnosis"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Competitors updated again, what to do"
    - "Competitor added a new feature, how to respond"
    - "How to track competitor dynamics"
---

# Competitor Dynamics Tracking & Response AI

## Core Principles

1. **Feature changes are signals not noise**: Every competitor feature change reflects their strategic intent; the key is identifying intent, not listing changes
2. **Advantage is dynamic not static**: Competitive advantage changes at any time; yesterday's lead doesn't guarantee tomorrow's
3. **Response strategies must be trackable**: The value of a strategy lies in execution and effectiveness verification, not just remaining at suggestions

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Competitor Data | JSON | Yes | Competitor monitoring system -> Competitor data | Feature list, version updates, user reviews |
| Self Data | JSON | Yes | Product data platform -> Self data | Feature list, user reviews, satisfaction |
| Market Data | JSON | No | Industry reports -> Market data | Industry trends, user demand changes |
| Historical Tracking | JSON | No | output/pm-monitoring/diagnosis-competition/historical-reports | Historical competitor analysis reports |

## Execution Steps

### Step 1: Feature Change Monitoring

**Goal**: Identify recent competitor feature changes

**Monitoring Channels**:
- Competitor websites/update logs
- App store update records
- User review aggregation
- Social media discussions
- Industry media coverage

**Change Type Classification**:

| Type | Definition | Attention Level |
|------|------------|-----------------|
| New Feature | Competitor-unique new capability | P0 |
| Feature Enhancement | Experience/performance improvement of existing feature | P1 |
| Feature Deprecation | Discontinued feature support | P2 |
| Pricing Adjustment | Pricing strategy change | P1 |
| Ecosystem Expansion | Partner/integration change | P2 |

**Output Format**:

```yaml
feature_changes:
  - competitor: {name}
    change_type: new_feature | enhancement | deprecation | pricing | ecosystem
    feature_name: {name}
    change_date: {date}
    description: {description}
    user_reaction:
      sentiment: positive | negative | neutral
      volume: {count}
      key_themes: [themes]
    source: {source_url}
    priority: P0 | P1 | P2
```

### Step 2: Advantage Dynamic Assessment

**Goal**: Assess changes in competitive advantage relative to competitors

**Assessment Dimensions**:

| Dimension | Metric | Data Source |
|-----------|--------|-------------|
| Feature Leadership | Unique feature count vs competitors | Feature comparison matrix |
| User Experience | Rating comparison, feature usability | App Store/Google Play |
| Performance Metrics | Response time, stability comparison | Third-party reviews |
| Value Perception | Price-performance ratio, brand perception | User research |
| Ecosystem Richness | Integration count, API openness | Technical documentation |

**Assessment Methods**:
- Radar chart multi-dimensional comparison
- Trend line change analysis
- User review semantic analysis

**Output Format**:

```yaml
advantage_changes:
  period: {start} to {end}
  dimensions:
    - dimension: feature_leadership
      previous_status: leading | parity | lagging
      current_status: leading | parity | lagging
      change: improved | unchanged | declined
      delta: {description}
    - dimension: user_experience
      previous_status: leading | parity | lagging
      current_status: leading | parity | lagging
      change: improved | unchanged | declined
      delta: {description}
  overall_trend:
    direction: gaining | holding | losing
    confidence: {percentage}
  critical_changes:
    - description: "Competitor X launched Y feature, narrowing feature gap"
      impact_level: high | medium | low
```

### Step 3: Response Strategy Generation

**Goal**: Generate response strategies based on competitor dynamics

**Strategy Types**:

| Strategy Type | Applicable Scenario | Execution Requirements |
|---------------|---------------------|------------------------|
| Accelerate | Competitor capturing market share | Rapid iteration, high priority |
| Differentiate | Competitor feature homogenization | Find unique value points |
| Defend | Competitor threatening core features | Consolidate moat |
| Monitor | Uncertain impact | Continuous monitoring, reserve plans |

**Strategy Generation Rules**:

```yaml
response_strategy:
  - competitor_change:
      feature: {feature_name}
      change_type: new_feature
    recommended_approach: accelerate | differentiate | defend | monitor
    action:
      title: {action_title}
      description: {description}
      options:
        - option: aggressive
          description: "Fast follow, feature priority"
          timeline: 2-4 weeks
          priority: P0
          resource_needed: {story_points}
        - option: balanced
          description: "Differentiated implementation"
          timeline: 4-8 weeks
          priority: P1
          resource_needed: {story_points}
        - option: conservative
          description: "Continue observing, wait for more information"
          timeline: tbd
          priority: P2
    selected_option: {option}
    tracking:
      status: planned | in_progress | completed | dismissed
      milestones: [...]
```

### Step 4: Effectiveness Tracking

**Goal**: Track execution effectiveness of response strategies

**Tracking Metrics**:
- Strategy execution completion rate
- User feedback after feature release
- Market share changes
- User rating changes

**Tracking Report**:

```yaml
effect_tracking:
  strategy_id: {id}
  execution:
    planned_date: {date}
    actual_date: {date}
    completed: true | false
  outcome:
    user_feedback:
      sentiment_change: {delta}
      volume: {count}
    market_impact:
      share_change: {delta}
      new_users: {count}
    competitive_position:
      status_change: improved | unchanged | declined
```

## Output


**Output file path**: `output/pm-monitoring/diagnosis-competition/`
**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_id", "feature_changes", "advantage_changes", "response_strategy"],
  "properties": {
    "report_id": {"type": "string", "description": "Report unique identifier"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "period": {"type": "object", "description": "Analysis period, including start and end times"},
    "feature_changes": {"type": "object", "description": "Feature change summary, including total and P0/P1 counts"},
    "advantage_changes": {"type": "object", "description": "Advantage changes, including gaining/holding/losing dimensions"},
    "response_strategy": {"type": "array", "description": "Response strategy list, including competitor, feature and priority"}
  }
}
```

```
├── {date}/
│   ├── feature_changes.yaml
│   ├── advantage_changes.yaml
│   ├── response_strategy.yaml
│   └── effect_tracking.yaml
└── latest/
    └── competition_report.md
```

### Competitor Response Output Format

```yaml
competition_response:
  report_id: {uuid}
  generated_at: {ISO8601}
  period: {start} to {end}
  feature_changes:
    total: {count}
    p0_count: {count}
    p1_count: {count}
  advantage_changes:
    gaining: [{dimensions}]
    holding: [{dimensions}]
    losing: [{dimensions}]
  response_strategy:
    - id: STR-001
      competitor: {name}
      feature: {feature}
      approach: accelerate
      action: {description}
      timeline: {weeks}
      priority: P0
      tracking:
        status: planned
```

## Decision Rules

| Scenario | Decision Rule |
|----------|---------------|
| Competitor launches disruptive feature | Immediately generate response strategy, mark P0 |
| Advantage gap narrowing < 10% | Generate defense strategy |
| Multiple competitors homogenizing | Trigger differentiation strategy generation |
| Strategy execution delayed | Re-evaluate priority |
| Major market environment change | Re-evaluate overall strategy |

## Quality Checks

- [ ] Competitor coverage completeness >= 90%
- [ ] Feature change identification timeliness <= 7 days
- [ ] Advantage assessment consistent with actual market feedback
- [ ] Strategy executability >= 80%
- [ ] Effectiveness tracking coverage 100%
- [ ] Report completeness (all dimensions)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|------------------|---------------|
| Competitor data | User provides competitor name list, AI tracks competitor dynamics based on public information and industry knowledge | Competitor tracking report based on AI knowledge, data sources and confidence need to be marked |
| Self data | User provides own product feature list and user reviews, AI performs manual comparison | Advantage/disadvantage analysis based on user input, lacking data validation |
| Market data | Skip industry trend analysis, strategy suggestions based solely on feature comparison | Strategy suggestions without industry trends |
| Historical tracking | Skip historical trend analysis, output current snapshot only | Competitor current snapshot report, no trend comparison |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Competitor data missing**: Ask user to provide competitor name list, AI will track competitor feature dynamics based on public information (websites, app stores, industry reports, etc.) and AI knowledge base, marking data sources and confidence in output
2. **Self data missing**: Ask user to provide own product feature list and core metrics (user ratings, feature coverage, etc.), AI will perform manual comparison analysis with competitors based on user input
3. **Market data missing**: AI skips industry trend analysis, response strategies generated based solely on feature comparison results, recommend supplementing market data later to improve strategies

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| report_id | string | Yes | Report unique identifier |
| feature_changes | object | Yes | Feature change summary, must contain total/p0_count/p1_count |
| feature_changes.total | number | Yes | Total changes, must be >=0 |
| advantage_changes | object | Yes | Advantage changes, must contain gaining/holding/losing |
| response_strategy | array | Yes | Response strategy list, each must contain id/competitor/feature/approach/priority |
| response_strategy[].priority | string | Yes | Priority, only P0/P1/P2 allowed |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|-----------------|-------------|--------------|-----------------|
| Competitor monitoring system | Competitor data format change | Feature change parsing and classification | Adapt to new format, update change type classification |
| Product data platform | Self feature list change | Advantage comparison matrix | Update comparison baseline, re-evaluate advantages/disadvantages |
| Industry reports | Market data update | Industry trends and strategy suggestions | Update trend analysis, adjust strategy priorities |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|---------------------|------------------------|---------------------|----------------------|
| competitor-monitoring-report | Competitor tracking data updated | Write to output file | Feature changes and advantage changes |
| diagnosis-orchestrator | Competitor tracking completed | Output file update | Tracking completion status and key findings |
| iteration-decision | P0-level competitor change | Write to output file | Emergency response strategy and priority |
