---
name: planning-north-star
description: "Use when determining product core metrics, OKR north star metric, or metrics system design. AI-assisted selection of the metric that best measures product success and user value. This is a human decision point; AI provides data support, humans make the final choice. Keywords: north star metric, core metric, metric selection, product success metric, NSM, key metric, what data to watch."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Strategic Planning & Roadmap"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "What should our core metric be"
    - "How to measure product success"
---

# North Star Metric Selection

## Core Principles

1. **Multi-Candidate Comparison** -- Generate 3-5 candidate metrics, score on four dimensions, then recommend; humans make final selection
2. **Value-Business Dual Anchor** -- North Star must link to both user value and business success; neither can be missing
3. **Input Variables Drivable** -- Recommended metrics must be decomposed into 3 quantifiable, trackable, influenceable input variables
4. **Anti-Gaming Design** -- Assess risks of metric manipulation, invalidation, and misleading; provide warnings

## Interaction Mode

Human->AI Human executes, AI assists

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User Value Data | JSON | Yes | user-research-user-modeling / user-research-voice-analysis | Exploration phase user value data |
| BMC Business Model Canvas | JSON | Yes | output/pm-strategy/business-model-canvas/bmc.json | Value propositions, revenue streams |
| Business Status Data | JSON | O | User provided | Current business metrics, user scale |

## Execution Steps

### Step 1: Candidate Metric Generation

Generate 3-5 North Star metric candidates based on input data:

- Extract value proposition keywords from BMC, map to quantifiable metrics
- Extract core user behaviors from user value data, convert to behavioral metrics
- Extract existing metrics from business status data, assess suitability as North Star
- Each candidate metric must include: metric name, calculation formula, data source, update frequency

### Step 2: Four-Dimension Scoring

Score each candidate metric on 4 dimensions (1-5 scale):

| Dimension | Scoring Standard |
|------|----------|
| Relationship to core value | 5=Directly measures user value realization 3=Indirectly related 1=Unrelated |
| Correlation with business success | 5=Strongly correlated with revenue/growth 3=Weakly correlated 1=Unrelated |
| Actionability | 5=Team can directly influence 3=Partially influenceable 1=Cannot influence |
| Measurability | 5=Clear data definition + automated collection 3=Requires manual collection 1=Cannot collect |

**Composite Score = 0.3xValue Relationship + 0.3xBusiness Correlation + 0.2xActionability + 0.2xMeasurability**

### Step 3: Recommendation and Alternatives

- Metrics with composite score >=4.0 recommended as North Star metric
- Metrics with composite score 3.0-4.0 as alternative metrics
- Metrics with composite score <3.0 labeled with elimination reason
- Recommended metrics need alignment validation with BMC value propositions and OKRs

### Step 4: Input Variable Definition

Define 3 key input variables (driving factors) for the recommended metric:

- Each input variable must be quantifiable, trackable, and influenceable
- Causal relationship between input variables and North Star metric must be clear
- Label data source and collection method for each input variable

## Output

**Storage Path**: `output/pm-strategy/planning-north-star/`

**Output File**: north_star.json

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| north_star_metric.recommended.metric_name | string | Yes | Recommended North Star metric name |
| north_star_metric.recommended.definition | string | Yes | Metric definition and calculation formula |
| north_star_metric.recommended.relationship_to_value | string | Yes | Relationship to user value |
| north_star_metric.recommended.relationship_to_business | string | Yes | Relationship to business success |
| north_star_metric.recommended.measurement.data_source | string | Yes | Data source |
| north_star_metric.recommended.measurement.calculation | string | Yes | Calculation formula |
| north_star_metric.recommended.measurement.frequency | string | Yes | Update frequency |
| north_star_metric.alternatives | array | Yes | At least 2 alternative metrics |
| north_star_metric.alternatives[].fit_score | number | Yes | Alternative metric fit score 0-1 |
| north_star_metric.analysis_summary.recommendation_rationale | string | Yes | Recommendation rationale |

```yaml
north_star_metric:
  recommended:
    metric_name: "Weekly Active Users (WAU)"
    definition: "Number of unique users who visited at least once in the past 7 days"
    relationship_to_value: "Measures frequency of sustained product usage, reflecting continuous value provided to users"
    relationship_to_business: "Highly correlated with advertising revenue and paid conversion, key metric for growth engine"
    actionability: "High - improvable through product optimization, content operations, push strategies"
    measurement:
      data_source: "User behavior logs"
      calculation: "COUNT(DISTINCT user_id WHERE last_active <= 7 days)"
      frequency: "Daily update"
      owner: "Growth team"
  alternatives:
    - metric_name: "Daily Active Users (DAU)"
      pros: "Strong real-time nature, fast response"
      cons: "High volatility, poor stability"
      fit_score: 0.75
    - metric_name: "Monthly Active Users (MAU)"
      pros: "Good stability, reflects long-term user base"
      cons: "Slow response, difficult to detect issues in time"
      fit_score: 0.70
    - metric_name: "User Engagement Score"
      pros: "Comprehensively reflects user engagement"
      cons: "Subjective definition, difficult to standardize"
      fit_score: 0.65
  analysis_summary:
    recommendation_rationale: "WAU balances real-time nature and stability, has strong correlation with both user value and business success, and the team has clear improvement paths"
    implementation_notes: "Need to establish user ID system and 7-day active calculation logic, recommend monitoring alongside DAU"
    warning: "Note distinguishing active pattern differences between new and returning users"
```

## AI-Assisted Analysis Content

AI should provide the following analytical support:

1. **Metric Candidate Pool**
   - Analyze possible metrics based on BMC
   - Analyze related metrics based on user value data
   - Recommend metrics based on industry benchmarks

2. **Correlation Analysis**
   - Correlation analysis between each metric and revenue
   - Correlation analysis between each metric and retention
   - Correlation matrix between metrics

3. **Trend Analysis**
   - Historical trends of each candidate metric
   - Attribution analysis of metric changes
   - Predict future metric changes

4. **Risk Assessment**
   - Metric manipulation risk
   - Metric invalidation risk
   - Metric misleading risk

### Decision Flow

```
1. Human initiates request
2. AI analyzes and recommends metric candidates
3. Human evaluates candidate metrics
4. AI provides detailed analytical support
5. Human discusses and selects
6. AI records decision and rationale
7. Human confirms final metric
```

## Decision Rules

1. **Human Decision**: North Star metric selection is a human decision point
2. **AI Support**: AI only provides analytical support, does not make final decisions
3. **Multi-Party Participation**: Recommend product, technology, and business teams participate in discussion

## Quality Checks

- [ ] At least 3 metric candidates analyzed
- [ ] Each candidate has 5-dimension evaluation
- [ ] Correlation analysis completed
- [ ] Risk assessment provided
- [ ] Final selection has human confirmation record
- [ ] Selection rationale recorded

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| User value data (voice-analysis / persona) | User provides product description -> Recommend North Star candidates | Lacks user value data, metric-user value correlation may be weak |
| bmc.json | User provides product description -> Recommend North Star candidates | Lacks BMC data, metric-business model correlation may be weak |
| User value data + bmc.json | User provides product description -> Recommend North Star candidates | Overall confidence reduced, metrics lack value-business dual anchoring |
| All upstream files missing | Prompt user to execute prior phases first, or recommend North Star candidates based on user-provided product description | Overall confidence significantly reduced, recommendations are industry-generic references only |
| Business status data (user provided) | If user has not provided business status data, prompt user to provide or skip related steps | Lacks baseline data, cannot assess metric current status |

## Data Acquisition Instructions

This Skill requires user value data and BMC data, please provide via one of the following methods:
  1. Directly describe product core value and business model
  2. Upload persona.json / voice-analysis.json / bmc.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| bmc.json value proposition change | Candidate metric-value proposition correlation needs re-evaluation | Re-execute Step 1-2, update candidate metrics and scores |
| bmc.json revenue model change | Metric-business success correlation | Re-score business correlation dimension |
| persona/voice-analysis user value update | Candidate metric pool and user value correlation | Re-execute Step 1, update candidate metrics |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| North Star metric change | planning-okr, planning-roadmap | Output file version number + change summary |
| Input variable definition change | planning-okr | Output file version number + change summary |
| Candidate metric score change | planning-okr | Output file version number + change summary |
