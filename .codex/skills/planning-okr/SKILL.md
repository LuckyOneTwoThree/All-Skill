---
name: planning-okr
description: Use when you need to set quarterly/annual OKRs, decompose objectives, or define performance evaluation criteria. OKR auto-generation. Generate Objectives and Key Results from strategic direction, including Objective generation, Key Results design, feasibility assessment, and OKR alignment check. Keywords: OKR, objective management, key results, objective decomposition, OKR alignment, set goals, goal breakdown.
metadata:
  module: "Product Business & Strategy"
  sub-module: "Strategic Planning & Roadmap"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["General"]
  trigger_examples:
    - "Help me set quarterly OKRs"
    - "How to decompose objectives"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output OKRs and key results"
  deep_description: "Full OKR + alignment verification + progress tracking mechanism + quarterly review template"
---

# OKR Auto-Generation

## Core Principles

1. **Objectives come from strategy** — Objectives must originate from SWOT strategic directions, not be set in isolation from strategy
2. **KRs must be quantifiable** — Each KR has a clear numerical target and verification method; vague expressions are rejected
3. **Feasibility hard check** — Achievement probability <0.3 escalates for target adjustment; >0.9 escalates for increased challenge
4. **Alignment closed loop** — O and KR are logically consistent, KRs support each other, and are linked to the North Star metric

## Interaction Mode
🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| SWOT strategic direction | JSON | Yes | output/pm-strategy/strategic-analysis/strategic-analysis.json | SO/ST/WO/WT strategic directions |
| North Star metric | JSON | Yes | output/pm-strategy/planning-north-star/north-star.json | North Star metric and drill-down metrics |
| BMC Business Model Canvas | JSON | ○ | output/pm-strategy/business-model-canvas/bmc.json | Value proposition, revenue sources |
| Business status data | JSON | ○ | User provided | Current business metric baselines |

## Execution Steps

### Step 1: Objective Generation [Core]

Generate 2-3 Objective candidates

Quality check criteria:
- **Directional clarity**: Expresses a clear direction and intent
- **Strategic consistency**: Consistent with SWOT strategic direction
- **Motivational**: Can motivate the team
- **Time-bound**: Has a clear time period

Objective template:
```
O: [Verb] + [What] + [To achieve What]
```

### Step 2: Key Results Generation [Core]

Generate 3-5 Key Results for each Objective

Quality check criteria:
- **Quantifiable**: Measured with numbers
- **Verifiable**: Has clear verification method
- **Multi-dimensional**: Covers different dimensions (quantity/quality/time/cost)
- **Challenging**: Requires effort to achieve

KR template:
```
KR: [Time] [Quantity/Percentage] [Do What] reaching [Target Value]
```

**KR Achievement Probability Estimation Rules**:

| Scenario | Estimation Method | Confidence Level |
|------|----------|--------|
| Has historical data | Extrapolate based on historical trends, compare target/baseline ratio with historical growth rate | High (≥0.7) |
| Has industry benchmarks | Reference KR achievement rates of same-industry same-stage companies | Medium (0.4-0.7) |
| No reference data | Based on Delphi method — AI provides 3 probability tiers (optimistic 0.8/neutral 0.5/conservative 0.2), human selects | Low (<0.4) |

KRs with achievement probability < 0.3 are marked needs_human_validation: true, suggesting adjustment of target or splitting into multiple progressive KRs.

**North Star Metric Consumption**: Extract core metrics and drill-down metrics from the input North Star metric, ensure at least 1 KR's metric is directly associated with the North Star metric, mark north_star_alignment: true.

### Step 3: KR Feasibility Assessment [Core]

Perform feasibility assessment for each KR:

```yaml
kr_assessment:
  baseline: Current value
  target: Target value
  growth_needed: Required growth rate
  achievability: Achievement probability (0-1)
  dimension: Dimension category
  confidence_level: Confidence level
```

**achievability Calculation Method**:

```
achievability_score = w1 × resource_fit + w2 × historical_trend + w3 × dependency_risk

- resource_fit: Team current resources / estimated required resources (0-1), dynamically calibrated based on team size:
  - 1-3 people: 0.3 (resource constrained)
  - 4-6 people: 0.5 (moderate resources)
  - 7-10 people: 0.7 (resource sufficient)
  - >10 people: 0.8 (resource abundant)
  - If team size unknown, default 0.4 (conservative)
- historical_trend: Achievement probability when based on historical data, 0.5 when no historical data
- dependency_risk: 1 - (number of external dependencies × 0.15), minimum 0.1
- w1=0.4, w2=0.35, w3=0.25

achievability_score < 0.4 is marked as high-risk KR, needs_human_validation: true
```

### Step 4: Driving Feature Mapping [Core]

Define 1-3 feature candidates for each KR that can directly contribute to its achievement:

- Each feature must be marked with priority and expected lift
- Features must be further refined based on the North Star metric's drives_features
- Feature descriptions are placeholders, awaiting design-prd to generate specific feature_id

### Step 5: OKR Alignment Check [Core]

Check alignment relationships between OKRs:
- Alignment with company strategy
- Logical consistency between O and KR
- KRs support each other
- Reasonable timeline

**Alignment Check Execution Rules**:

| Check Dimension | Check Method | Pass Condition | Failure Handling |
|----------|----------|----------|-----------|
| O-KR consistency | Each KR must directly contribute to the corresponding O's achievement | All KRs have direct causal relationship with O | Mark inconsistent KRs, suggest redefinition |
| KR independence | KRs should not have inclusion or causal relationships with each other | No logical dependency between any pair of KRs | Merge dependent KRs or split into independent KRs |
| North Star alignment | At least 1 KR's metric is directly associated with the North Star metric | KRs with north_star_alignment=true ≥1 | Mark North Star alignment gap, suggest adding associated KR |
| Quantifiable verifiability | Each KR contains numerical target value and deadline | All KRs contain metric+target+deadline | Mark unverifiable KRs, suggest adding quantifiable metrics |
| Resource feasibility | achievability_score ≥ 0.4 | All KRs' achievability ≥ 0.4 | Mark high-risk KRs, suggest adjusting target or adding resources |

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | OKRs and key results | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output including all Step outputs |
| deep | Full OKR + alignment verification + progress tracking mechanism + quarterly review template | Full output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-strategy/planning-okr/`

**Output File**: okr.json

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| okr_candidates | array | Yes | At least 2 Objective candidates |
| okr_candidates[].objective | string | Yes | Objective description |
| okr_candidates[].key_results | array | Yes | At least 3 KRs per O |
| okr_candidates[].key_results[].kr | string | Yes | KR description |
| okr_candidates[].key_results[].baseline | string | Yes | Current baseline value |
| okr_candidates[].key_results[].target | string | Yes | Target value |
| okr_candidates[].key_results[].growth_needed | string | Yes | Required growth rate |
| okr_candidates[].key_results[].achievability | number | Yes | Achievement probability 0-1 |
| okr_candidates[].key_results[].confidence_level | number | Yes | Confidence level 0-1 |
| okr_candidates[].key_results[].deadline | string | Yes | KR deadline (ISO8601 format) |
| okr_candidates[].key_results[].drives_features | array | Yes | List of features driven by this KR |
| okr_candidates[].key_results[].drives_features[].feature_priority | string | Yes | Feature priority (P0/P1/P2) |
| okr_candidates[].key_results[].drives_features[].feature_description | string | Yes | Feature description (placeholder) |
| okr_candidates[].alignment_check.strategic_alignment | boolean | Yes | Strategic alignment check |
| okr_candidates[].alignment_check.kr_coherence | boolean | Yes | KR consistency check |
| okr_candidates[].alignment_check.timeline_feasibility | boolean | Yes | Timeline feasibility |

```yaml
okr_candidates:
  - objective: "O1: Increase user activity"
    key_results:
      - kr: "KR1: DAU reaches 1 million"
        baseline: 600K
        target: 1M
        growth_needed: 67%
        achievability: 0.65
        dimension: "Quantity"
        confidence_level: 0.85
        deadline: "2026-06-30"
        north_star_alignment: true
        drives_features:
          - feature_priority: "P0"
            feature_description: "Personalized recommendation homepage"
            expected_lift: "15% DAU lift"
          - feature_priority: "P0"
            feature_description: "Daily check-in system"
            expected_lift: "8% DAU lift"
      - kr: "KR2: User D1 retention rate reaches 45%"
        baseline: 35%
        target: 45%
        growth_needed: 29%
        achievability: 0.70
        dimension: "Quality"
        confidence_level: 0.80
        deadline: "2026-06-30"
        drives_features:
          - feature_priority: "P0"
            feature_description: "Onboarding flow optimization"
            expected_lift: "10% D1 retention lift"
          - feature_priority: "P1"
            feature_description: "First-time experience optimization"
            expected_lift: "5% D1 retention lift"
      - kr: "KR3: Core feature usage rate reaches 60%"
        baseline: 40%
        target: 60%
        growth_needed: 50%
        achievability: 0.55
        dimension: "Quality"
        confidence_level: 0.75
        deadline: "2026-06-30"
        drives_features:
          - feature_priority: "P1"
            feature_description: "Feature discovery guidance"
            expected_lift: "8% usage rate lift"
    alignment_check:
      strategic_alignment: true
      kr_coherence: true
      timeline_feasibility: true
      notes: "Alignment check notes"
  - objective: "O2: Optimize unit economics"
    key_results:
      - kr: "KR1: CAC reduced by 20%"
        baseline: 150 CNY
        target: 120 CNY
        growth_needed: -20%
        achievability: 0.60
        dimension: "Cost"
        confidence_level: 0.75
        deadline: "2026-06-30"
        drives_features:
          - feature_priority: "P1"
            feature_description: "Precision ad targeting optimization"
            expected_lift: "12% CAC reduction"
    alignment_check:
      strategic_alignment: true
      kr_coherence: true
      timeline_feasibility: true
      notes: "Alignment check notes"
```

## Decision Rules

1. **Achievement probability escalation**:
   - Achievement probability < 0.3: Escalate for target adjustment
   - Achievement probability > 0.9: Escalate for increased challenge
2. **OKR final confirmation**: Must be a human decision
3. **Resource matching**: Check if KR resource requirements can be met

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Each O contains a 1-sentence description ≤30 characters
- [ ] Each KR contains ≥1 numerical target value (metric+target)

### P1 Checks (must pass for standard/deep)

- [ ] Each KR contains a deadline field (ISO8601 format)
- [ ] KRs with north_star_alignment=true ≥1, O-KR consistency check 100% passed
- [ ] All KRs' achievability_score calculated and KRs with score ≥0.4 account for ≥60%
- [ ] Strategic consistency verified
- [ ] Each KR's drives_features[] is non-empty with at least 1 P0 feature
- [ ] drives_features have logical association with North Star metric features

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| strategic-analysis.json | User provides business objectives → directly generate OKR candidates | Lacking strategic analysis data support, O alignment with strategic direction may be insufficient | Ask user to provide strategic direction and key challenge descriptions or upload strategic-analysis.json file |
| north-star.json | User provides business objectives → directly generate OKR candidates | Lacking North Star metric alignment, KRs may be disconnected from core metrics | Ask user to provide North Star metric and current metric values or upload north-star.json file |
| bmc.json | User provides business objectives → directly generate OKR candidates | Lacking BMC data, OKR correlation with business model may be weak | Ask user to provide key business model elements or upload bmc.json file |
| strategic-analysis.json + north-star.json + bmc.json | User provides business objectives → directly generate OKR candidates | Overall confidence reduced, OKRs lack strategic and metric anchoring | Ask user to provide strategic direction, North Star metric, and business model description |
| All upstream files missing | Prompt user to execute prior stages first, or directly generate OKR candidates based on user-provided business objectives | Overall confidence significantly reduced, OKRs are only general goal references | Ask user to provide business objectives, key challenges, and core metrics |
| Business status data (user provided) | If user has not provided business status data, prompt user to provide or skip steps related to this input | Lacking baseline data, KR target values lack reference | Ask user to provide current core metric values (e.g., DAU, revenue, conversion rate, etc.) |

## Data Acquisition Instructions

This Skill requires strategic analysis, North Star metric, and BMC data. Please provide via one of the following methods:
  1. Directly describe business objectives and expected key results
  2. Upload strategic-analysis.json / north-star.json / bmc.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| strategic-analysis.json strategic direction adjustment | Objective generation needs re-alignment | Re-execute Step 1, update O candidates |
| north-star.json North Star change | KRs need re-alignment with North Star | Re-execute Step 2, update KRs and associations |
| bmc.json business model change | OKR alignment with business model | Re-evaluate OKR alignment with revenue/cost structure |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Objective adjustment | planning-roadmap, business-strategy-report, design-prd | Output file version number + change summary |
| KR target value change | planning-roadmap, design-prd | Output file version number + change summary |
| drives_features change | design-prd | Output file version number + change summary |
| Alignment check result change | planning-roadmap | Output file version number + change summary |

## Alignment with prd.json Data Contract

| This Skill's Output Field | Corresponding prd.json Field | Alignment Rule |
|----------------|-----------------|---------|
| okr_candidates[].objective | prd.json.goals[].description | O description consistent with PRD goal description |
| okr_candidates[].key_results[].kr | prd.json.goals[].success_metrics[].metric_name | KR description includes PRD success metric name |
| okr_candidates[].key_results[].target | prd.json.goals[].success_metrics[].target_value | KR target value consistent with PRD metric target value |
| okr_candidates[].key_results[].baseline | prd.json.goals[].success_metrics[].current_value | KR baseline consistent with PRD metric current value |
