---
name: planning-okr
description: "Use when setting quarterly/annual OKRs, decomposing objectives, or defining performance measurement standards. Auto-generates OKRs from strategic directions including Objective generation, Key Results design, feasibility assessment and OKR alignment checks. Keywords: OKR, objective management, key results, objective decomposition, OKR alignment, goal setting, target breakdown."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Strategic Planning & Roadmap"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me set quarterly OKRs"
    - "How to decompose objectives"
execution_depth:
  default: standard
  quick_description: "Output OKRs and key results"
  deep_description: "Full OKR + alignment verification + progress tracking mechanism + quarterly review template"
---

# OKR Auto-Generation

## Core Principles

1. **Objectives Come From Strategy** -- Objectives must originate from SWOT strategic directions; cannot be set in isolation from strategy
2. **KRs Must Be Quantifiable** -- Each KR has clear numeric targets and validation methods; vague expressions are rejected
3. **Feasibility Hard Check** -- Achievement probability <0.3 escalates for target adjustment; >0.9 escalates for increased challenge
4. **Alignment Closed Loop** -- O and KR logically consistent, KRs mutually supportive, linked to North Star metric

## Interaction Mode
AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| SWOT Strategic Directions | JSON | Yes | output/pm-strategy/strategic-analysis/strategic-analysis.json | SO/ST/WO/WT strategic directions |
| North Star Metric | JSON | Yes | output/pm-strategy/planning-north-star/north_star.json | North Star metric and drill-down metrics |
| BMC Business Model Canvas | JSON | O | output/pm-strategy/business-model-canvas/bmc.json | Value propositions, revenue streams |
| Business Status Data | JSON | O | User provided | Current business metric baselines |

## Execution Steps

### Step 1: Objective Generation [Core]

Generate 2-3 Objective candidates

Quality check standards:
- **Directionality**: Expresses clear direction and intent
- **Strategic consistency**: Consistent with SWOT strategic directions
- **Motivational**: Can motivate the team
- **Time-bound**: Has a clear cycle

Objective template:
```
O: [Verb] + [What] + [Achieve What]
```

### Step 2: Key Results Generation [Core]

Generate 3-5 Key Results per Objective

Quality check standards:
- **Quantifiable**: Measured with numbers
- **Verifiable**: Has clear validation methods
- **Multi-dimensional**: Covers different dimensions (quantity/quality/time/cost)
- **Challenging**: Requires effort to achieve

KR template:
```
KR: [Time] [Quantity/Percentage] [What to do] reaching [Target value]
```

**KR Achievement Probability Estimation Rules**:

| Scenario | Estimation Method | Confidence |
|------|----------|--------|
| Has historical data | Extrapolate based on historical trends, compare target/baseline ratio with historical growth rate | High (>=0.7) |
| Has industry benchmarks | Reference KR achievement rates of same-industry same-stage companies | Medium (0.4-0.7) |
| No reference data | Delphi method -- AI provides 3 probability tiers (optimistic 0.8/neutral 0.5/conservative 0.2), human selects | Low (<0.4) |

Achievement probability < 0.3 KRs labeled needs_human_validation: true, recommend adjusting target or splitting into multiple progressive KRs.

**North Star Metric Consumption**: Extract core metrics and drill-down metrics from input North Star metric, ensure at least 1 KR's metric is directly linked to the North Star metric, label north_star_alignment: true.

### Step 3: KR Feasibility Assessment [Core]

Conduct feasibility assessment for each KR:

```yaml
kr_assessment:
  baseline: Current value
  target: Target value
  growth_needed: Required growth rate
  achievability: Achievement probability (0-1)
  dimension: Dimension classification
  confidence_level: Confidence level
```

**achievability Calculation Method**:

```
achievability_score = w1 x resource_fit + w2 x historical_trend + w3 x dependency_risk

- resource_fit: Team current resources / estimated required resources (0-1), dynamically calibrated based on team size:
  - 1-3 people: 0.3 (resource constrained)
  - 4-6 people: 0.5 (moderate resources)
  - 7-10 people: 0.7 (resource sufficient)
  - >10 people: 0.8 (resource rich)
  - If team size unknown, default 0.4 (conservative)
- historical_trend: Achievement probability when based on historical data, 0.5 when no historical data
- dependency_risk: 1 - (number of external dependencies x 0.15), minimum 0.1
- w1=0.4, w2=0.35, w3=0.25

achievability_score < 0.4 labeled as high-risk KR, needs_human_validation: true
```

### Step 4: OKR Alignment Check [Core]

Check alignment relationships between OKRs:
- Aligned with company strategy
- O and KR logically consistent
- KRs mutually supportive
- Timeline reasonable

**Alignment Check Execution Rules**:

| Check Dimension | Check Method | Pass Condition | Failure Handling |
|----------|----------|----------|-----------|
| O-KR consistency | Each KR must directly contribute to corresponding O achievement | All KRs have direct causal relationship with O | Label inconsistent KRs, recommend redefinition |
| KR independence | KRs should not have inclusion or causal relationships | No logical dependency between any two KRs | Merge dependent KRs or split into independent KRs |
| North Star alignment | At least 1 KR's metric is directly linked to North Star metric | north_star_alignment=true KRs >=1 | Label North Star alignment gap, recommend adding linked KR |
| Quantifiable verifiability | Each KR includes numeric target value and deadline | All KRs include metric+target+deadline | Label unverifiable KRs, recommend adding quantifiable metrics |
| Resource feasibility | achievability_score >= 0.4 | All KRs' achievability >= 0.4 | Label high-risk KRs, recommend adjusting target or increasing resources |

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | OKRs and key results | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full OKR + alignment verification + progress tracking mechanism + quarterly review template | Full deliverables + extended analysis + deep simulation |

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
| okr_candidates[].alignment_check.strategic_alignment | boolean | Yes | Strategic alignment check |
| okr_candidates[].alignment_check.kr_coherence | boolean | Yes | KR consistency check |
| okr_candidates[].alignment_check.timeline_feasibility | boolean | Yes | Timeline feasibility |

```yaml
okr_candidates:
  - objective: "O1: Increase user activity"
    key_results:
      - kr: "KR1: DAU reaches 1 million"
        baseline: 600k
        target: 1 million
        growth_needed: 67%
        achievability: 0.65
        dimension: "Quantity"
        confidence_level: 0.85
        deadline: "2026-06-30"
      - kr: "KR2: User next-day retention reaches 45%"
        baseline: 35%
        target: 45%
        growth_needed: 29%
        achievability: 0.70
        dimension: "Quality"
        confidence_level: 0.80
        deadline: "2026-06-30"
      - kr: "KR3: Core feature usage rate reaches 60%"
        baseline: 40%
        target: 60%
        growth_needed: 50%
        achievability: 0.55
        dimension: "Quality"
        confidence_level: 0.75
        deadline: "2026-06-30"
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
    alignment_check:
      strategic_alignment: true
      kr_coherence: true
      timeline_feasibility: true
      notes: "Alignment check notes"
```

## Decision Rules

1. **Achievement Probability Escalation**:
   - Achievement probability < 0.3: Escalate for target adjustment
   - Achievement probability > 0.9: Escalate for increased challenge
2. **OKR Final Confirmation**: Must be a human decision
3. **Resource Matching**: Check whether KR resource requirements can be met

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Each O contains 1-sentence description <=30 characters
- [ ] Each KR contains >=1 numeric target value (metric+target)

### P1 Checks (must pass for standard/deep)

- [ ] Each KR contains deadline field (ISO8601 format)
- [ ] north_star_alignment=true KRs >=1, O-KR consistency check 100% passed
- [ ] All KRs' achievability_score calculated and KRs with >=0.4 account for >=60%
- [ ] Strategic consistency verified

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|----------|
| strategic-analysis.json | User provides business objectives -> Directly generate OKR candidates | Lacks strategic analysis data support, O-strategic direction alignment may be insufficient | Request user to describe strategic direction and priorities, or upload strategic-analysis.json |
| north-star.json | User provides business objectives -> Directly generate OKR candidates | Lacks North Star metric alignment, KRs may be disconnected from core metrics | Request user to provide North Star metric and sub-metrics, or upload north-star.json |
| bmc.json | User provides business objectives -> Directly generate OKR candidates | Lacks BMC data, OKR-business model correlation may be weak | Request user to describe business model and revenue streams, or upload bmc.json |
| strategic-analysis.json + north-star.json + bmc.json | User provides business objectives -> Directly generate OKR candidates | Overall confidence reduced, OKRs lack strategic and metric anchoring | Request user to provide business objectives and key metrics, or upload strategic-analysis.json / north-star.json / bmc.json |
| All upstream files missing | Prompt user to execute prior phases first, or directly generate OKR candidates based on user-provided business objectives | Overall confidence significantly reduced, OKRs are generic target references only | Request user to describe business objectives and expected key results, or execute strategic-analysis and planning-north-star first |
| Business status data (user provided) | If user has not provided business status data, prompt user to provide or skip related steps | Lacks baseline data, KR target values lack reference | Prompt user to provide current metric values and target expectations |

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| strategic-analysis.json strategic direction adjustment | Objective generation needs re-alignment | Re-execute Step 1, update O candidates |
| north-star.json North Star change | KRs need re-alignment with North Star | Re-execute Step 2, update KRs and linkages |
| bmc.json business model change | OKR-business model correlation | Re-evaluate OKR alignment with revenue/cost structure |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Objective adjustment | planning-roadmap, business-strategy-report | Output file version number + change summary |
| KR target value change | planning-roadmap | Output file version number + change summary |
| Alignment check result change | planning-roadmap | Output file version number + change summary |

## Alignment with prd.json Data Contract

| This Skill's Output Field | Corresponding prd.json Field | Alignment Rule |
|----------------|-----------------|---------|
| okr_candidates[].objective | prd.json.goals[].description | O description consistent with PRD goal description |
| okr_candidates[].key_results[].kr | prd.json.goals[].success_metrics[].metric_name | KR description includes PRD success metric name |
| okr_candidates[].key_results[].target | prd.json.goals[].success_metrics[].target_value | KR target value consistent with PRD metric target value |
| okr_candidates[].key_results[].baseline | prd.json.goals[].success_metrics[].current_value | KR baseline consistent with PRD metric current value |
