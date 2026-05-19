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
execution_depth:
  default: standard
  quick_description: "Output roadmap and milestones"
  deep_description: "Full roadmap + dependency analysis + risk buffer design + multi-scenario roadmap"
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

### Step 1: Strategic Theme Extraction [Core]

Extract 3-5 strategic themes from OKRs and SWOT:

```
Theme = Strategic Direction + Business Objective + Value Proposition
```

Each strategic theme includes:
- Theme name
- Supporting OKRs
- Strategic significance

### Step 2: Epic-Level Planning [Core]

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

### Step 3: Now/Next/Later Layering [Core]

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

### Step 4: RICE Score Calculation [Core]

RICE formula:
```
RICE Score = (Reach x Impact x Confidence) / Effort
```

Scoring criteria:
- **Reach**: Number of users/customers affected
- **Impact**: Positive impact on objectives (0.25-3)
- **Confidence**: Confidence in data and assumptions (0.5-1)
- **Effort**: Person-months required to complete

### Step 5: Risk Labeling [Core]

Identify and label risks:
- Technical risks
- Resource risks
- Dependency risks
- Market risks

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | roadmap and milestones | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full roadmap + dependency analysis + risk buffer design + multi-scenario roadmap | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-strategy/planning-roadmap/`

**Output File**: roadmap.json

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| roadmap.strategic_themes | array | Yes | 3-5 strategic themes |
| roadmap.strategic_themes[].theme | string | Yes | Theme name |
| roadmap.strategic_themes[].okr_reference | string | Yes | Linked OKR |
| roadmap.strategic_themes[].priority | number | No | Theme priority ranking |
| roadmap.quarterly_epics | array | Yes | Quarterly Epic list |
| roadmap.quarterly_epics[].quarter | string | Yes | Quarter identifier |
| roadmap.quarterly_epics[].epics | array | Yes | Epic list |
| roadmap.quarterly_epics[].epics[].name | string | Yes | Epic name, must not be empty |
| roadmap.quarterly_epics[].epics[].success_metric | string | No | Success metric |
| roadmap.quarterly_epics[].epics[].rice_score | number | Yes | RICE score |
| roadmap.quarterly_epics[].epics[].effort | number | Yes | Effort (person-months) |
| roadmap.quarterly_epics[].epics[].dependencies | array | No | Dependencies list |
| roadmap.quarterly_epics[].epics[].risks | array | Yes | Risk list |
| roadmap.quarterly_epics[].epics[].risks[].risk | string | Yes | Risk description |
| roadmap.quarterly_epics[].epics[].risks[].likelihood | string | Yes | Likelihood, enum: high/medium/low |
| roadmap.quarterly_epics[].epics[].risks[].mitigation | string | No | Mitigation measure |
| roadmap.now_next_later | object | Yes | Three-layer classification |
| roadmap.now_next_later.now | array | Yes | Current quarter Epics |
| roadmap.now_next_later.now[].epic | string | Yes | Epic name |
| roadmap.now_next_later.now[].quarter | string | No | Quarter identifier |
| roadmap.now_next_later.now[].rationale | string | No | Classification rationale |
| roadmap.now_next_later.next | array | Yes | Next quarter Epics |
| roadmap.now_next_later.next[].epic | string | Yes | Epic name |
| roadmap.now_next_later.next[].quarter | string | No | Quarter identifier |
| roadmap.now_next_later.next[].rationale | string | No | Classification rationale |
| roadmap.now_next_later.later | array | Yes | Future Epics |
| roadmap.now_next_later.later[].epic | string | Yes | Epic name |
| roadmap.now_next_later.later[].quarter | string | No | Quarter identifier |
| roadmap.now_next_later.later[].rationale | string | No | Classification rationale |

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

### P0 Checks (must pass for quick/standard/deep)

- [ ] Epics have clear success metrics
- [ ] All Epics have dependency labels

### P1 Checks (must pass for standard/deep)

- [ ] Now/Next/Later layering completed
- [ ] RICE scores calculated
- [ ] Risks identified with mitigation measures
- [ ] Resource estimates reasonable

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|----------|
| okr.json | User provides objective list -> Directly plan roadmap | Lacks OKR structured data, strategic theme-OKR alignment insufficient | Request user to provide business objectives and key results, or upload okr.json |
| strategic-analysis.json | User provides objective list -> Directly plan roadmap | Lacks strategic analysis data, strategic themes may deviate from strategic direction | Request user to describe strategic direction and priorities, or upload strategic-analysis.json |
| Requirement priority data (insight-analysis / design-prd) | User provides objective list -> Directly plan roadmap | Lacks requirement priority data, RICE scores lack input basis | Request user to provide feature priorities and effort estimates, or upload insight-analysis.json / prd.json |
| okr.json + strategic-analysis.json + requirement priority | User provides objective list -> Directly plan roadmap | Overall confidence reduced, Epic ranking lacks data anchoring | Request user to provide objectives, priorities, and effort estimates, or upload okr.json / strategic-analysis.json |
| All upstream files missing | Prompt user to execute prior phases first, or directly plan roadmap based on user-provided objective list | Overall confidence significantly reduced, roadmap is generic planning reference only | Request user to describe business objectives and feature priorities, or execute planning-okr and strategic-analysis first |
| Resource constraints (user provided) | If user has not provided resource constraints, prompt user to provide or skip related steps | Lacks resource constraints, Epic effort estimates may be unrealistic | Prompt user to provide team size, budget, and timeline constraints |

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
