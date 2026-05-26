---
name: metrics-system
description: "Use when building a product metric system. Metric system auto-construction including North Star metric validation and recommendation, L1/L2 metric decomposition, actionable metric identification, vanity metric detection. Keywords: Metric system, AARRR model, North Star metric, L1/L2 metrics, OSM model, metrics framework, define metrics, core data."
metadata:
  module: "Product Metrics Design"
  sub-module: "Metric System"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Help me organize the product's core metrics"
    - "We need to define a North Star metric"
    - "Build a metric system"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Output North Star metric validation results and L1 metric decomposition"
  deep_description: "Full L1/L2 decomposition + actionable metric identification + vanity metric detection + metric health score + metric correlation analysis"
---

# Metric System Auto-Construction

## Core Principles

1. **Comprehensive Analysis**: Systematically analyze all available data without omitting key dimensions
2. **Real-time Awareness**: Metric system design supports real-time monitoring and rapid response
3. **Automated Attribution**: Anomalous fluctuations are automatically attributed to specific causes, reducing manual investigation
4. **Explicit Decision Rules**: Every alert and escalation condition has clear quantitative rules

## Interaction Mode

**🤖→👤 AI suggests, human approves**

This Pipeline is automatically executed by AI for metric system construction, but key decision points require human approval:
- **Must approve**: North Star metric selection
- **Recommended approval**: Vanity metric handling plan

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| product_context | JSON | Yes | output/pm-strategy/planning-okr/okr.json + output/pm-strategy/business-model-canvas/bmc.json / User provided | Product type, North Star metric, OKR, business model |
| existing_metrics | JSON array | ○ | User provided | Existing metric list (including name, definition, calculation, data source, level) |

### product_context (required)

```json
{
  "product_type": "string",
  "north_star_metric": "string",
  "okr": {
    "objective": "string",
    "key_results": ["string"]
  },
  "business_model": "string"
}
```

**product_type enum values**:
- `social` - Social product
- `ecommerce` - E-commerce product
- `saas` - SaaS product
- `content` - Content platform
- `gaming` - Gaming product
- `fintech` - Fintech
- `education` - Online education
- `healthcare` - Healthcare
- `other` - Other

---

### existing_metrics (optional)

```json
[
  {
    "name": "string",
    "definition": "string",
    "calculation": "string",
    "data_source": "string",
    "layer": "north_star|l1|l2|actionable"
  }
]
```

---

## Execution Steps

### Step 1: North Star Metric Validation [Core]

**🤖 AI Processing**

#### Branch A: North Star Already Defined

When `product_context.north_star_metric` is already defined:

**Validation Items**:
1. **Definition Clarity Check**
   - Has a clear calculation formula
   - Has a clear data source
   - Can be decomposed into sub-metrics

2. **Vanity Metric Detection**
   ```
   IF meets any of the following conditions THEN flag as potential vanity metric
     - Only increases, never decreases (no time dimension)
     - No causal link (cannot guide action)
     - Not actionable (cannot be influenced by team)
   ```

3. **Product Type Match Score**
   ```
   score = North Star metric recommendation score based on product type
   IF score < 0.6 THEN suggest reselecting North Star
   ```

**Output**:
```json
{
  "north_star": {
    "name": "string",
    "definition": "string",
    "calculation": "string",
    "data_source": "string",
    "validation": {
      "is_valid": true,
      "is_vanity_free": true,
      "product_type_match": 0.85,
      "issues": []
    }
  }
}
```

---

#### Branch B: North Star Not Defined

When `product_context.north_star_metric` is not defined:

**Auto-Recommendation Logic**:

```
Based on product_context.product_type and business_model
Generate 3 North Star metric candidates
```

**Product Type -> North Star Metric Mapping**:

| Product Type | Recommended North Star Metric Candidates |
|-------------|----------------------------------------|
| Social | 1. DAU x Average interactions<br>2. Daily messaging users<br>3. Social network density (active friend ratio) |
| E-commerce | 1. GMV<br>2. Paid orders<br>3. Active buyers x Average order value |
| SaaS | 1. Paid ARR<br>2. Core feature weekly active users<br>3. NRR (Net Revenue Retention) |
| Content | 1. Total user time<br>2. Per capita content consumption x Consuming users<br>3. Content engagement rate |
| Gaming | 1. DAU<br>2. DAU x Average play time<br>3. Paying user LTV |
| Fintech | 1. Active user loan/wealth conversion rate<br>2. AUM (Assets Under Management)<br>3. Risk approval rate x Loan amount |
| Online Education | 1. Course completion rate x Paying students<br>2. Student completion rate x NPS<br>3. Active learning users x Per capita study time |
| Healthcare | 1. Core service usage rate<br>2. User health metric improvement rate<br>3. User satisfaction x Repurchase rate |

**Output**:
```json
{
  "north_star_candidates": [
    {
      "rank": 1,
      "name": "string",
      "definition": "string",
      "calculation": "string",
      "data_source": "string",
      "pros": ["string"],
      "cons": ["string"],
      "recommendation_score": 0.85
    }
  ],
  "requires_human_decision": true
}
```

---

### Step 2: L1 Metric Auto-Decomposition [Core]

**🤖 AI Processing**

**Input**: North Star metric definition

**Decomposition Logic**:

Based on the AARRR model, decompose the North Star metric into 5 L1 dimensions (3-5 may be selected depending on product type):

```
North Star Metric
  ↓ Decomposition
L1 Dimensions (by AARRR)
  ├── Acquisition
  ├── Activation
  ├── Retention
  ├── Revenue
  └── Referral
```

**Decomposition Rules**:

```
FOR each L1 dimension:
  1. Identify relevance to North Star
  2. Calculate weight (based on correlation strength)
  3. Define L1 metric
  4. Ensure L1 metric is independently measurable
```

**North Star -> L1 Weight Mapping Example** (E-commerce):

| North Star Metric | Acquisition Weight | Activation Weight | Retention Weight | Revenue Weight | Referral Weight |
|-------------------|-------------------|-------------------|-----------------|---------------|----------------|
| GMV | 0.15 | 0.15 | 0.25 | 0.35 | 0.10 |
| Paid orders | 0.20 | 0.25 | 0.20 | 0.25 | 0.10 |
| Active buyers x AOV | 0.20 | 0.15 | 0.30 | 0.25 | 0.10 |

**Output**:
```json
{
  "l1_metrics": [
    {
      "layer": "Acquisition",
      "name": "User Acquisition",
      "weight": 0.20,
      "calculation": "string",
      "data_source": "string",
      "relationship_to_north_star": "Direct positive correlation",
      "l2_metrics_count": 3
    }
  ]
}
```

---

### Step 3: L2 Metric Auto-Decomposition [Conditional]

**🤖 AI Processing**

**Input**: L1 metric list

**Decomposition Logic**:

```
FOR each L1 metric:
  Decompose 3-5 L2 metrics
  Ensure each L2 metric:
    1. Has a clear mathematical relationship with L1
    2. Is independently measurable
    3. Has a clear data source
    4. Can be owned by a specific team
```

**L1 -> L2 Decomposition Example** (E-commerce - Activation):

```json
{
  "l1": "User Activation",
  "l2_metrics": [
    {
      "name": "New user first order conversion rate",
      "calculation": "First-order new users / Total new users",
      "data_source": "Order system",
      "is_actionable": true,
      "optimization_team": "Growth team"
    }
  ]
}
```

**L2 Metric Categories**:

| Type | Description | Example |
|------|-------------|---------|
| Conversion rate | Funnel step conversions | Click rate, registration rate, payment rate |
| Frequency | User usage frequency | Per capita usage count, per capita usage time |
| Quality | Usage effectiveness/quality | Satisfaction score, feature usage depth |
| Efficiency | Operational efficiency metrics | Page load time, response time |
| Coverage | Feature/content coverage | Category coverage rate, feature usage rate |

**Output**:
```json
{
  "l1_metrics": [
    {
      "layer": "Activation",
      "name": "User Activation",
      "l2_metrics": [
        {
          "name": "string",
          "calculation": "string",
          "data_source": "string",
          "type": "conversion_rate|frequency|quality|efficiency|coverage",
          "is_actionable": true,
          "optimization_team": "string"
        }
      ]
    }
  ]
}
```

---

### Step 4: Actionable Metric Auto-Identification [Conditional]

**🤖 AI Processing**

**Identification Logic**:

```
FOR each L2 metric:
  IF can be directly influenced by a specific team AND
     can be verified through A/B testing AND
     has a clear optimization path
  THEN flag as actionable metric
```

**Actionable Metric Characteristics**:

1. **Attributable**: Can be traced to a specific cause
2. **Actionable**: Can be acted upon by a specific team
3. **Verifiable**: Can be verified through A/B testing
4. **Iterable**: Can be continuously optimized in short cycles

**Actionable Metric Mapping Example**:

| L2 Metric | Actionable Metric | Optimization Direction |
|-----------|------------------|----------------------|
| New user activation time | Average registration flow time | Simplify registration steps |
| First order conversion rate | Onboarding flow conversion rate | Optimize onboarding copy |
| Core feature usage rate | Feature entry click rate | Optimize feature entry position |
| Search result click rate | First search result click rate | Optimize ranking algorithm |

**Output**:
```json
{
  "actionable_metrics": [
    {
      "name": "Average registration flow time",
      "linked_l2": "New user activation time",
      "linked_l1": "User Activation",
      "optimization_approach": "Verify effect of simplifying registration steps through A/B testing",
      "estimated_impact": "Each 1-second reduction can increase activation rate by 3%",
      "measurement_method": "A/B testing"
    }
  ]
}
```

---

### Step 5: Vanity Metric Auto-Detection [Deep]

**🤖 AI Processing**

**Detection Rules**:

#### Rule 1: Only-Increases Detection

```
IF metric calculation meets any of the following conditions:
  - Cumulative value (no time dimension)
  - Irreversible metric
THEN flag as "only-increases" vanity metric
```

**Problem Metric Examples**:
- ❌ Cumulative users -> ✅ Daily Active Users
- ❌ Total registrations -> ✅ Daily new registrations
- ❌ Total page views -> ✅ Per capita page views

---

#### Rule 2: No Time Constraint Detection

```
IF metric definition lacks a clear time dimension:
  - No defined statistical period
  - Cannot calculate change trends
THEN flag as "no time constraint" vanity metric
```

**Problem Metric Examples**:
- ❌ Total users -> ✅ DAU / MAU
- ❌ Total revenue -> ✅ Monthly MRR / Annual ARR

---

#### Rule 3: No Causal Link Detection

```
IF metric cannot meet any of the following conditions:
  - Can be linked to North Star metric
  - Can guide specific action
  - Can be attributed to specific cause
THEN flag as "no causal link" vanity metric
```

**Problem Metric Examples**:
- Feature usage rate unrelated to core value
- Multiple independent metrics that cannot form a logical chain

---

#### Rule 4: Not Actionable Detection

```
IF metric cannot meet any of the following conditions:
  - Can be influenced by a specific team
  - Can be changed through product/operations means
  - Can see effects within a reasonable timeframe
THEN flag as "not actionable" vanity metric
```

**Problem Metric Examples**:
- ❌ Brand awareness -> ✅ Brand keyword search volume
- ❌ User satisfaction -> ✅ NPS sub-metrics
- ❌ Market share -> ✅ Vertical market penetration rate

---

**Detection Result Output**:

```json
{
  "vanity_alerts": [
    {
      "metric_name": "Cumulative users",
      "alert_type": "Only increases",
      "severity": "high",
      "recommendation": "Replace with 'Daily Active Users' or 'Monthly Active Users'",
      "suggested_replacement": {
        "name": "DAU",
        "calculation": "Daily active users"
      }
    }
  ],
  "summary": {
    "total_detected": 2,
    "high_severity": 1,
    "medium_severity": 1,
    "all_resolved": false
  }
}
```

---

## Output

**Storage Path**: `output/pm-metrics-design/metrics-system/`

**Output File**: `metric_system.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["metric_system"],
  "properties": {
    "metric_system": {"type": "object", "description": "Metric system, including North Star metric, L1/L2 metrics, actionable metrics, and vanity metric alerts"}
  }
}
```

### metric_system

```json
{
  "metric_system": {
    "north_star": {
      "name": "string",
      "definition": "string",
      "calculation": "string",
      "data_source": "string",
      "validation": { "is_vanity_free": true, "validation_date": "2026-05-08" }
    },
    "l1_metrics": [
      {
        "layer": "Acquisition|Activation|Retention|Revenue|Referral",
        "name": "string",
        "weight": 0.20,
        "calculation": "string",
        "data_source": "string",
        "l2_metrics": [
          { "name": "string", "calculation": "string", "data_source": "string", "type": "string", "is_actionable": true }
        ]
      }
    ],
    "actionable_metrics": [
      { "name": "string", "linked_l2": "string", "linked_l1": "string", "optimization_approach": "string" }
    ],
    "vanity_alerts": [
      { "metric_name": "string", "alert_type": "string", "severity": "high|medium|low", "recommendation": "string", "suggested_replacement": {} }
    ]
  }
}
```

---

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| metric_system | object | Yes | Metric system root object |
| metric_system.north_star | object | Yes | North Star metric |
| metric_system.north_star.name | string | Yes | North Star metric name |
| metric_system.north_star.definition | string | Yes | North Star metric definition |
| metric_system.north_star.calculation | string | Yes | Calculation formula |
| metric_system.north_star.data_source | string | Yes | Data source |
| metric_system.north_star.validation | object | Yes | Validation result |
| metric_system.north_star.validation.is_vanity_free | boolean | Yes | Whether free of vanity characteristics |
| metric_system.l1_metrics | array | Yes | L1 metric list, at least 3 dimensions |
| metric_system.l1_metrics[].layer | string | Yes | AARRR dimension enum value |
| metric_system.l1_metrics[].name | string | Yes | L1 metric name |
| metric_system.l1_metrics[].weight | number | Yes | Weight, sum of all L1 weights should be 1.0 |
| metric_system.l1_metrics[].l2_metrics | array | Yes | L2 metric list, at least 3 per L1 |
| metric_system.l1_metrics[].l2_metrics[].name | string | Yes | L2 metric name |
| metric_system.l1_metrics[].l2_metrics[].calculation | string | Yes | Calculation formula |
| metric_system.l1_metrics[].l2_metrics[].is_actionable | boolean | Yes | Whether it is an actionable metric |
| metric_system.actionable_metrics | array | Yes | Actionable metric list |
| metric_system.actionable_metrics[].name | string | Yes | Actionable metric name |
| metric_system.actionable_metrics[].linked_l2 | string | Yes | Associated L2 metric |
| metric_system.actionable_metrics[].optimization_approach | string | Yes | Optimization approach |
| metric_system.vanity_alerts | array | No | Vanity metric alert list |

---

## Decision Rules

### Rule 1: North Star Metric Ultimately Selected by Human

**Trigger Condition**:
- `north_star_metric` not defined in product_context
- AI generated 3 candidate North Star metrics

**Execution Flow**:

```
1. AI generates 3 North Star metric candidates (with scores)
2. Human product lead selects final North Star metric
3. Record selection rationale
4. Continue to subsequent steps
```

**Human Decision Factors**:
- ✅ Whether it reflects core user value
- ✅ Whether it can be directly influenced by the team
- ✅ Whether it matches the business development stage
- ✅ Whether data collection conditions exist
- ✅ Whether it is easy for the entire company to understand

---

### Rule 2: Vanity Metric Handling Plan Requires Advisory Approval

**Trigger Condition**:
- High-severity vanity metrics exist
- AI has recommended replacement metric plans

**Execution Flow**:

```
1. AI detects vanity metrics and generates handling recommendations
2. Flag vanity metrics requiring approval
3. Human confirms handling plan (or modifies)
4. Execute metric replacement or deletion
```

---

## Quality Checks

| Check Item | Standard | Non-Compliance Handling |
|--------|------|------------|
| North Star vanity metric detection (P0) | No "only-increases" characteristics, has time dimension, can be linked to business goals, can be influenced by team | Flag specific issues, re-recommend North Star metric, trigger human decision flow |
| L1-L2 decomposition completeness (P1) | Each L1 layer (Acquisition/Activation/Retention/Revenue/Referral) has 3-5 L2 metrics | Auto-supplement missing L2 metrics based on AARRR model, flag supplemented items for human confirmation |
| Actionable metric trackability (P1) | Has clear data source, has executable optimization plan, can be verified through A/B testing | Flag non-trackable metrics, suggest supplementing data instrumentation, lower metric priority |
| Vanity metric detection coverage (P2) | All metrics have passed vanity metric detection, flagging results complete | Supplement detection, flag undetected metrics |

---

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|----------|----------|----------|
| product_context missing | Prompt user to provide product type and business goals, execute based on user input | North Star recommendation based on user description rather than structured input |
| existing_metrics missing | Skip existing metric validation, build metric system from scratch | No existing metric comparison, cannot detect redundancy |
| product_context + existing_metrics both missing | User provides product type and business goals -> recommend metric system based on industry templates | Output metric system based on industry templates, annotated as "to be confirmed" |

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Product type**: Social/E-commerce/SaaS/Content/Gaming/Fintech/Online Education/Healthcare/Other
- **Business goals**: Core business objectives at the current stage (e.g., increase GMV, improve retention rate, etc.)
- **Business model**: Product business model description (optional, helps with more precise recommendations)

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| OKR adjustment | North Star metric, L1 metrics | Flag affected metric levels, suggest human confirmation on whether to update metric system |
| Business model change | Revenue metric definitions | Flag affected metrics, suggest human confirmation on whether to update |
| PRD feature change | Actionable metrics | Flag affected actionable metrics, suggest human confirmation on whether to update |

When the metric system itself changes, notification mechanism to downstream:

| Metric Change Type | Notification Scope | Notification Method |
|-------------|----------|----------|
| North Star metric change | tracking-plan, metrics-dashboard, monitoring-pipeline | Flag core metric change, trigger full-chain update |
| L1/L2 metric addition/removal | tracking-plan, metrics-dashboard | Flag metric addition/removal, trigger tracking and dashboard update |
| Actionable metric change | tracking-plan | Flag actionable metric change, trigger tracking update |
| Metric definition modification | tracking-plan, metrics-dashboard, monitoring-pipeline | Flag definition change, trigger related Skill re-evaluation |

---

## Escalation Path

### Escalation Trigger Conditions

When any of the following conditions are met, escalate to manual handling:

1. **North Star metric candidate recommendation failure**
   - Cannot recommend North Star metric based on product type
   - Recommendation score confidence below 0.5

2. **Vanity metric handling cannot be automated**
   - High-severity vanity metric count > 3
   - Replacement metric plans have conflicts

3. **L2 decomposition logic anomaly**
   - L2 metric count outside reasonable range (<3 or >10)
   - Cannot establish logical relationship between L2 and L1

---

### Escalation Output

```json
{
  "escalation": {
    "trigger": "string",
    "reason": "string",
    "current_status": {},
    "ai_recommendation": {},
    "requires_human_action": true,
    "human_decision_needed": [
      "North Star metric selection",
      "Vanity metric handling plan"
    ]
  }
}
```

---
