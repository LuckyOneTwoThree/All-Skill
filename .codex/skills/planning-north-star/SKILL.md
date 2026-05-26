---
name: planning-north-star
description: Use when you need to determine product core metrics, OKR North Star metric, or metric system design. North Star metric selection. AI assists in selecting the metric that best measures product success and user value. This is a human decision point — AI provides data support, humans make the final choice. Keywords: North Star metric, core metric, metric selection, product success metric, NSM, key metric, what data to look at.
metadata:
  module: "Product Business & Strategy"
  sub-module: "Strategic Planning & Roadmap"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "General"]
  trigger_examples:
    - "What should our core metric be"
    - "How to measure product success"
  interaction_mode: "human_ai_collaborate"
execution_depth:
  default: standard
  quick_description: "Directly output recommended North Star metric and input variables"
  deep_description: "Full analysis + metric correlation matrix + manipulation risk assessment + metric evolution roadmap"
---

# North Star Metric Selection

## Core Principles

1. **Multi-candidate comparison** — Generate 3-5 candidate metrics, score across four dimensions, then recommend; humans make the final choice
2. **Value-Business dual anchor** — The North Star must link to both user value and business success; neither can be missing
3. **Input variables must be actionable** — The recommended metric must be decomposed into 3 quantifiable, trackable, and influenceable input variables
4. **Anti-manipulation design** — Assess the risks of the metric being manipulated, invalidated, or misleading, and provide warnings

## Interaction Mode
👤→🤖 Human executes with AI assistance

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| User value data | JSON | Yes | user-research-user-modeling / user-research-voice-analysis | User value data from exploration phase |
| BMC Business Model Canvas | JSON | Yes | output/pm-strategy/business-model-canvas/bmc.json | Value proposition, revenue sources |
| Business status data | JSON | ○ | User provided | Current business metrics, user scale |

## Execution Steps

### Step 1: Candidate Metric Generation [Core]

Generate 3-5 North Star metric candidates based on input data:

- Extract value proposition keywords from BMC and map them to quantifiable metrics
- Extract core user behaviors from user value data and convert them to behavioral metrics
- Extract existing metrics from business status data and evaluate suitability as North Star
- Each candidate metric must include: metric name, calculation formula, data source, update frequency

### Step 2: Four-Dimension Scoring [Core]

Score each candidate metric on 4 dimensions (1-5 scale):

| Dimension | Scoring Criteria |
|------|----------|
| Relationship to core value | 5=Directly measures user value realization 3=Indirectly related 1=Unrelated |
| Correlation with business success | 5=Strongly correlated with revenue/growth 3=Weakly correlated 1=Unrelated |
| Actionability | 5=Team can directly influence 3=Partially influenceable 1=Cannot influence |
| Measurability | 5=Clear data definition + automated collection 3=Manual collection needed 1=Cannot collect |

**Composite Score = 0.3×Value Relationship + 0.3×Business Correlation + 0.2×Actionability + 0.2×Measurability**

### Step 3: Recommendation and Alternatives [Core]

- Metrics with composite score ≥4.0 are recommended as North Star metrics
- Metrics with composite score 3.0-4.0 are alternative metrics
- Metrics with composite score <3.0 are marked with elimination reasons
- Recommended metrics must be validated for alignment with BMC value proposition and OKR

### Step 4: Input Variable Definition [Core]

Define 3 key input variables (driving factors) for the recommended metric:

- Each input variable must be quantifiable, trackable, and influenceable
- The causal relationship between input variables and the North Star metric must be clear
- Mark the data source and collection method for each input variable

### Step 5: Driving Feature Mapping [Core]

Define 2-4 feature candidates that can directly influence the recommended metric:

- Each feature must be marked with priority (P0/P1/P2) and expected lift
- Features must be derived from user research and strategic analysis, not arbitrarily set
- Feature descriptions should be placeholders, awaiting design-prd to generate specific feature_id

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Recommended North Star metric and input variables | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output including all Step outputs |
| deep | Full analysis + metric correlation matrix + manipulation risk assessment + metric evolution roadmap | Full output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-strategy/planning-north-star/`

**Output File**: north_star.json

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| north_star_metric.recommended.metric_name | string | Yes | Recommended North Star metric name |
| north_star_metric.recommended.definition | string | Yes | Metric definition and calculation formula |
| north_star_metric.recommended.relationship_to_value | string | Yes | Description of relationship to user value |
| north_star_metric.recommended.relationship_to_business | string | Yes | Description of relationship to business success |
| north_star_metric.recommended.measurement.data_source | string | Yes | Data source |
| north_star_metric.recommended.measurement.calculation | string | Yes | Calculation formula |
| north_star_metric.recommended.measurement.frequency | string | Yes | Update frequency |
| north_star_metric.recommended.drives_features | array | Yes | List of driven features |
| north_star_metric.recommended.drives_features[].feature_priority | string | Yes | Priority of the corresponding feature (P0/P1/P2) |
| north_star_metric.recommended.drives_features[].feature_description | string | Yes | Feature description (placeholder, awaiting design-prd to generate specific ID) |
| north_star_metric.recommended.drives_features[].expected_lift | string | Yes | Expected lift of this feature on the metric |
| north_star_metric.alternatives | array | Yes | At least 2 alternative metrics |
| north_star_metric.alternatives[].fit_score | number | Yes | Alternative metric fit score 0-1 |
| north_star_metric.analysis_summary.recommendation_rationale | string | Yes | Recommendation rationale |

```yaml
north_star_metric:
  recommended:
    metric_name: "Weekly Active Users (WAU)"
    definition: "Number of unique users who visited at least once in the past 7 days"
    relationship_to_value: "Measures the frequency of sustained product usage, reflecting the ongoing value the product provides to users"
    relationship_to_business: "Highly correlated with ad revenue and paid conversion, a key metric for the growth engine"
    actionability: "High - can be improved through product optimization, content operations, and push notification strategies"
    measurement:
      data_source: "User behavior logs"
      calculation: "COUNT(DISTINCT user_id WHERE last_active <= 7 days)"
      frequency: "Daily update"
      owner: "Growth team"
    drives_features:
      - feature_priority: "P0"
        feature_description: "Personalized recommendation homepage"
        expected_lift: "15% WAU lift"
      - feature_priority: "P0"
        feature_description: "Daily check-in system"
        expected_lift: "8% WAU lift"
      - feature_priority: "P1"
        feature_description: "Content sharing feature"
        expected_lift: "5% WAU lift"
  alternatives:
    - metric_name: "Daily Active Users (DAU)"
      pros: "Strong real-time responsiveness"
      cons: "High volatility, poor stability"
      fit_score: 0.75
      drives_features: []
    - metric_name: "Monthly Active Users (MAU)"
      pros: "Good stability, reflects long-term user base"
      cons: "Slow response, difficult to detect issues in time"
      fit_score: 0.70
      drives_features: []
    - metric_name: "User Engagement Score"
      pros: "Comprehensively reflects user engagement"
      cons: "Subjective definition, difficult to standardize"
      fit_score: 0.65
      drives_features: []
  analysis_summary:
    recommendation_rationale: "WAU balances real-time responsiveness and stability, has strong correlation with both user value and business success, and the team has a clear improvement path"
    implementation_notes: "Need to establish user ID system and 7-day active calculation logic, recommend monitoring in parallel with DAU"
    warning: "Note the difference in activity patterns between new and existing users"
```

## AI-Assisted Analysis Content

AI should provide the following analytical support:

1. **Metric Candidate Pool**
   - Analyze possible metrics based on BMC
   - Analyze associated metrics based on user value data
   - Recommend metrics based on industry benchmarks

2. **Correlation Analysis**
   - Correlation analysis between each metric and revenue
   - Correlation analysis between each metric and retention
   - Correlation matrix across metrics

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
3. **Multi-party Participation**: It is recommended that product, technology, and business teams participate in the discussion

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] At least 3 metric candidates have been analyzed
- [ ] Each candidate has 5-dimension evaluation

### P1 Checks (must pass for standard/deep)

- [ ] Correlation analysis is complete
- [ ] Risk assessment is provided
- [ ] Final selection has human confirmation record
- [ ] Selection rationale is recorded
- [ ] drives_features[] is non-empty and contains at least 2 P0/P1 features
- [ ] Each driving feature has an expected lift description

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| User value data (voice-analysis / persona) | User provides product description → recommend North Star candidates | Lacking user value data, metric correlation with user value may be weak | Ask user to provide core user value description or upload persona.json/voice-analysis.json files |
| bmc.json | User provides product description → recommend North Star candidates | Lacking BMC data, metric correlation with business model may be weak | Ask user to provide business model description or upload bmc.json file |
| User value data + bmc.json | User provides product description → recommend North Star candidates | Overall confidence reduced, metrics lack value-business dual anchoring | Ask user to provide product core value and business model description |
| All upstream files missing | Prompt user to execute prior stages first, or recommend North Star candidates based on user-provided product description | Overall confidence significantly reduced, recommendations are only general industry references | Ask user to provide product description, core value, and business model information |
| Business status data (user provided) | If user has not provided business status data, prompt user to provide or skip steps related to this input | Lacking baseline data, unable to assess metric status | Ask user to provide current core metric values (e.g., DAU, retention rate, revenue, etc.) |

## Data Acquisition Instructions

This Skill requires user value data and BMC data. Please provide via one of the following methods:
  1. Directly describe the product core value and business model
  2. Upload persona.json / voice-analysis.json / bmc.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| bmc.json value proposition change | Candidate metrics' association with value proposition needs re-evaluation | Re-execute Step 1-2, update candidate metrics and scores |
| bmc.json revenue model change | Metric correlation with business success | Re-score business correlation dimension |
| persona/voice-analysis user value update | Candidate metric pool and user value association | Re-execute Step 1, update candidate metrics |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| North Star metric change | planning-okr, planning-roadmap, design-prd | Output file version number + change summary |
| Input variable definition change | planning-okr | Output file version number + change summary |
| Candidate metric score change | planning-okr | Output file version number + change summary |
| drives_features change | design-prd | Output file version number + change summary |
