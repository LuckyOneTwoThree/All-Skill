---
name: planning-roadmap
description: "Use when creating a product roadmap, quarterly plan, version plan, or resource allocation. Auto-plans roadmap based on OKRs and strategic directions with Epic-level planning, Now/Next/Later layering and RICE scoring. Keywords: product roadmap, version planning, RICE score, quarterly planning, Epic planning, feature prioritization, schedule planning."
metadata:
  module: "Product Business & Strategy"
  sub-module: "Strategic Planning & Roadmap"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me plan the product roadmap"
    - "What should the next version include"
---

# Roadmap Auto-Planning

## Core Principles

1. **Strategic Theme Driven** -- Epics must be decomposed from OKRs and SWOT strategic themes; cannot be planned in isolation
2. **RICE Quantified Ranking** -- All Epics use RICE formula for quantified scoring; ranking is evidence-based
3. **Now/Next/Later Layering** -- Three-layer planning by priority and time dimension, avoiding flat listing
4. **Dependency Risk Explicit** -- Each Epic labels dependencies and risks, including mitigation measures

## Interaction Mode
AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| OKR Objectives and Key Results | JSON | Yes | output/pm-strategy/planning-okr/okr.json | Objectives and Key Results |
| SWOT Strategic Directions | JSON | Yes | output/pm-strategy/strategic-analysis/strategic-analysis.json | SO/ST/WO/WT strategic directions |
| Requirement Priority Scores | JSON | O | Covered by design-prd | RICE scoring results |
| Resource Constraints | JSON | O | User provided | Team capacity, budget, time constraints |

## Execution Steps

### Step 1: Strategic Theme Extraction

Extract 3-5 strategic themes from OKRs and SWOT:

```
Theme = Strategic Direction + Business Objective + Value Proposition
```

Each strategic theme includes:
- Theme name
- Supporting OKRs
- Strategic significance

### Step 2: Epic-Level Planning

Decompose strategic themes into quarterly Epics:

```yaml
epic:
  name: "Epic name"
  quarter: "Q1 2024"
  description: "Epic description"
  success_metric: "Success metric"
  rice_score: 75
  effort: "Person-months"
  dependencies:
    - "Dependency 1"
    - "Dependency 2"
  risks:
    - risk: "Risk description"
      likelihood: "high/medium/low"
      mitigation: "Mitigation measure"
  key_assumptions:
    - "Key assumption 1"
    - "Key assumption 2"
```

### Step 3: Now/Next/Later Layering

Layer based on RICE scores and time dimensions:

**Now (Current Quarter)**
- Confirmed high-priority Epics
- Must-complete dependencies
- High-confidence items

**Next (Next Quarter)**
- Planned but adjustable Epics
- Dependent on Now phase results
- Medium-priority items

**Later (Future)**
- Directional planning
- Assumptions requiring further validation
- Low-priority or exploratory items

### Step 4: RICE Score Calculation

RICE formula:
```
RICE Score = (Reach x Impact x Confidence) / Effort
```

Scoring criteria:
- **Reach**: Number of users/customers affected
- **Impact**: Positive impact on objectives (0.25-3)
- **Confidence**: Confidence in data and assumptions (0.5-1)
- **Effort**: Person-months required to complete

### Step 5: Risk Labeling

Identify and label risks:
- Technical risks
- Resource risks
- Dependency risks
- Market risks

## Output

**Storage Path**: `output/pm-strategy/planning-roadmap/`

**Output File**: roadmap.json

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| roadmap.strategic_themes | array | Yes | 3-5 strategic themes |
| roadmap.strategic_themes[].theme | string | Yes | Theme name |
| roadmap.strategic_themes[].okr_reference | string | Yes | Linked OKR |
| roadmap.quarterly_epics | array | Yes | Quarterly Epic list |
| roadmap.quarterly_epics[].quarter | string | Yes | Quarter identifier |
| roadmap.quarterly_epics[].epics[].rice_score | number | Yes | RICE score |
| roadmap.quarterly_epics[].epics[].effort | number | Yes | Effort (person-months) |
| roadmap.quarterly_epics[].epics[].risks | array | Yes | Risk list |
| roadmap.now_next_later | object | Yes | Three-layer classification |
| roadmap.now_next_later.now | array | Yes | Current quarter Epics |
| roadmap.now_next_later.next | array | Yes | Next quarter Epics |
| roadmap.now_next_later.later | array | Yes | Future Epics |

```yaml
roadmap:
  strategic_themes:
    - theme: "User Growth"
      okr_reference: "O1: Increase user activity"
      priority: 1
    - theme: "Business Monetization"
      okr_reference: "O2: Optimize unit economics"
      priority: 2
  quarterly_epics:
    - quarter: "Q1 2024"
      epics:
        - epic: "User onboarding optimization"
          success_metric: "New user activation rate increases 30%"
          rice_score: 85
          effort: 3
          dependencies: ["Design resources"]
          risks:
            - risk: "Technical implementation complexity"
              likelihood: "medium"
              mitigation: "Reserve technical research time"
          key_assumptions:
            - "Data analysis supports optimization direction"
    - quarter: "Q2 2024"
      epics:
        - epic: "Social feature development"
          success_metric: "User interaction rate increases 50%"
          rice_score: 72
          effort: 5
          dependencies: ["Backend API support"]
          risks:
            - risk: "User privacy compliance"
              likelihood: "high"
              mitigation: "Legal team early involvement"
          key_assumptions:
            - "High user acceptance after feature launch"
  now_next_later:
    now:
      - epic: "User onboarding optimization"
        quarter: "Q1"
        rationale: "High RICE score, directly supports OKR"
    next:
      - epic: "Social feature development"
        quarter: "Q2"
        rationale: "Depends on Q1 data validation, needs further research"
    later:
      - epic: "International expansion"
        quarter: "Q3+"
        rationale: "Long-term strategic direction, needs market validation"
```

## Decision Rules

1. **RICE Calculation**: AI completes calculation automatically
2. **Priority Decision**: Human decides final priorities
3. **Resource Allocation**: Human decides quarterly resource allocation
4. **Layer Adjustment**: Human can adjust Now/Next/Later layering

## Quality Checks

- [ ] Epics have clear success metrics
- [ ] All Epics have dependency labels
- [ ] Now/Next/Later layering completed
- [ ] RICE scores calculated
- [ ] Risks identified with mitigation measures
- [ ] Resource estimates reasonable

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| okr.json | User provides objective list -> Directly plan roadmap | Lacks OKR structured data, strategic theme-OKR alignment insufficient |
| strategic-analysis.json | User provides objective list -> Directly plan roadmap | Lacks strategic analysis data, strategic themes may deviate from strategic direction |
| Requirement priority data (insight-analysis / design-prd) | User provides objective list -> Directly plan roadmap | Lacks requirement priority data, RICE scores lack input basis |
| okr.json + strategic-analysis.json + requirement priority | User provides objective list -> Directly plan roadmap | Overall confidence reduced, Epic ranking lacks data anchoring |
| All upstream files missing | Prompt user to execute prior phases first, or directly plan roadmap based on user-provided objective list | Overall confidence significantly reduced, roadmap is generic planning reference only |
| Resource constraints (user provided) | If user has not provided resource constraints, prompt user to provide or skip related steps | Lacks resource constraints, Epic effort estimates may be unrealistic |

## Data Acquisition Instructions

This Skill requires OKR, strategic analysis, and requirement priority data, please provide via one of the following methods:
  1. Directly describe business objectives and feature priorities
  2. Upload okr.json / strategic-analysis.json / insight-analysis.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis

---

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| okr.json OKR adjustment | Strategic themes and Epic planning | Re-execute Step 1-2, update strategic themes and Epics |
| strategic-analysis.json strategic analysis update | Strategic theme direction | Re-execute Step 1, update strategic themes |
| Requirement priority data change | RICE scores and ranking | Re-execute Step 4, update RICE scores and layering |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Strategic theme adjustment | business-strategy-report, stakeholder-analysis | Output file version number + change summary |
| Epic priority change | business-strategy-report | Output file version number + change summary |
| Now/Next/Later layering change | stakeholder-analysis | Output file version number + change summary |
