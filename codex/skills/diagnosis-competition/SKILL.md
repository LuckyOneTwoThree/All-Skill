---
name: diagnosis-competition
description: Use when you need to track competitor dynamics and develop response strategies. Competitor Dynamic Tracking & Response, monitors competitor feature changes, evaluates dynamic changes in own advantages, generates response strategies, and tracks effectiveness. Keywords: competitor tracking, competitor analysis, competitor monitoring, feature changes, competitive analysis, competitor changes, competitor dynamics, competitor changed, competitor made a move.
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Issue Diagnosis"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Competitor updated again, what should I do"
    - "Competitor added a new feature, how to respond"
    - "How to track competitor dynamics"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output competitor diagnosis and feature comparison"
  deep_description: "Complete diagnosis + competitor strategic inference + differentiation opportunity identification + competitive response roadmap"
---

# Competitor Dynamic Tracking & Response 🤖

## Core Principles

1. **Feature changes are signals, not noise**: Every competitor feature change reflects their strategic intent; the key is identifying intent, not listing changes
2. **Advantages are dynamic, not static**: Competitive advantages are constantly changing; yesterday's lead doesn't guarantee tomorrow's lead
3. **Response strategies must be trackable**: The value of a strategy lies in execution and effectiveness verification, not停留在 the recommendation level

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Competitor data | JSON | Yes | Competitor monitoring system → Competitor data | Feature list, version updates, user reviews |
| Own data | JSON | Yes | Product data platform → Own data | Feature list, user reviews, satisfaction |
| Market data | JSON | ○ | Industry reports → Market data | Industry trends, user demand changes |
| Historical tracking | JSON | ○ | output/pm-monitoring/diagnosis-competition/Historical reports | Historical competitor analysis reports |

## Execution Steps

### Step 1: Feature Change Monitoring [Conditional]

**Goal**: Identify recent competitor feature changes

**Monitoring Channels**:
- Competitor websites / changelogs
- App store update records
- User review aggregation
- Social media discussions
- Industry media coverage

**Change Type Classification**:

| Type | Definition | Attention Level |
|------|------|----------|
| New feature | New capability unique to competitor | P0 |
| Feature optimization | Experience/performance improvement of existing feature | P1 |
| Feature retirement | Feature no longer supported | P2 |
| Pricing adjustment | Pricing strategy change | P1 |
| Ecosystem expansion | Partner/integration changes | P2 |

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

### Step 2: Advantage Dynamic Assessment [Core]

**Goal**: Evaluate changes in own strengths and weaknesses relative to competitors

**Assessment Dimensions**:

| Dimension | Metric | Data Source |
|------|------|----------|
| Feature leadership | Unique feature count vs competitor | Feature comparison matrix |
| User experience | Rating comparison, feature usability | App Store/Google Play |
| Performance metrics | Response time, stability comparison | Third-party reviews |
| Value perception | Price-performance ratio, brand awareness | User research |
| Ecosystem richness | Integration count, API openness | Technical documentation |

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
    - description: "Competitor X launched feature Y, narrowing the feature gap"
      impact_level: high | medium | low
```

### Step 3: Response Strategy Generation [Core]

**Goal**: Generate response strategies based on competitor dynamics

**Strategy Types**:

| Strategy Type | Applicable Scenario | Execution Requirements |
|----------|----------|----------|
| Accelerate | Competitor capturing market share | Rapid iteration, high priority |
| Differentiate | Competitor feature homogenization | Find unique value points |
| Defend | Competitor threatening core features | Strengthen moat |
| Monitor | Impact uncertain | Continuous monitoring, reserve plans |

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
          timeline: pending further signal confirmation
          priority: P2
    selected_option: {option}
    tracking:
      status: planned | in_progress | completed | dismissed
      milestones: [...]
```

### Step 4: Effectiveness Tracking [Conditional]

**Goal**: Track the execution effectiveness of response strategies

**Tracking Metrics**:
- Strategy execution completion rate
- User feedback after feature launch
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

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Competitor diagnosis and feature comparison | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output, including all Step outputs |
| deep | Complete diagnosis + competitor strategic inference + differentiation opportunity identification + competitive response roadmap | Complete output + extended analysis + deep inference |

## Output


**Output File Path**: `output/pm-monitoring/diagnosis-competition/`
**Output Schema**:

```json
{
  "type": "object",
  "required": ["report_id", "feature_changes", "advantage_changes", "response_strategy"],
  "properties": {
    "report_id": {"type": "string", "description": "Unique report identifier"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "period": {"type": "object", "description": "Analysis period, including start and end time"},
    "feature_changes": {"type": "object", "description": "Feature change summary, including total count and P0/P1 counts"},
    "advantage_changes": {"type": "object", "description": "Advantage changes, including gaining/holding/losing dimensions"},
    "response_strategy": {"type": "array", "description": "Response strategy list, including competitor, feature, and priority"}
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
|------|----------|
| Competitor launches disruptive feature | Immediately generate response strategy, mark P0 |
| Advantage gap narrows < 10% | Generate defense strategy |
| Multiple competitors homogenizing | Trigger differentiation strategy generation |
| Strategy execution delayed | Re-evaluate priority |
| Major market environment change | Re-evaluate overall strategy |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Competitor coverage completeness ≥ 90%
- [ ] Feature change identification timeliness ≤ 7 days

### P1 Checks (must pass for standard/deep)

- [ ] Advantage assessment consistent with actual market feedback
- [ ] Strategy executability ≥ 80%
- [ ] Effectiveness tracking coverage 100%
- [ ] Report completeness (all dimensions)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Competitor data | User provides competitor name list, AI tracks competitor dynamics based on public information and industry knowledge | AI knowledge-based competitor tracking report, data sources and confidence levels need to be annotated |
| Own data | User provides own product feature list and user reviews, AI performs manual comparison | User input-based strength/weakness analysis, lacking data validation |
| Market data | Skip industry trend analysis, strategy recommendations based on feature comparison only | Strategy recommendations without industry trends |
| Historical tracking | Skip historical trend analysis, output current snapshot only | Competitor status snapshot report, no trend comparison |

### Data Acquisition Notes

When upstream files are missing, obtain necessary data through the following methods:

1. **Competitor data missing**: Request user to provide competitor name list, AI will track competitor feature dynamics based on public information (websites, app stores, industry reports, etc.) and AI knowledge base, annotating data sources and confidence levels in the output
2. **Own data missing**: Request user to provide own product feature list and core metrics (user ratings, feature coverage, etc.), AI will perform manual comparison analysis with competitors based on user input
3. **Market data missing**: AI skips the industry trend analysis phase, response strategies are generated based on feature comparison results only, recommending subsequent supplementation of market data to improve strategy

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| report_id | string | Yes | Unique report identifier |
| feature_changes | object | Yes | Feature change summary, must include total/p0_count/p1_count |
| feature_changes.total | number | Yes | Total change count, must be ≥0 |
| advantage_changes | object | Yes | Advantage changes, must include gaining/holding/losing |
| response_strategy | array | Yes | Response strategy list, each item must include id/competitor/feature/approach/priority |
| response_strategy[].priority | string | Yes | Priority, only allows P0/P1/P2 |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| Competitor monitoring system | Competitor data format change | Feature change parsing and classification | Adapt to new format, update change type classification |
| Product data platform | Own feature list change | Advantage comparison matrix | Update comparison baseline, re-evaluate strengths/weaknesses |
| Industry reports | Market data update | Industry trends and strategy recommendations | Update trend analysis, adjust strategy priorities |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| competitor-monitoring-report | Competitor tracking data update | Write to output file | Feature changes and advantage changes |
| diagnosis-orchestrator | Competitor tracking complete | Output file update | Tracking completion status and key findings |
| iteration-decision | P0-level competitor change | Write to output file | Urgent response strategy and priority |
