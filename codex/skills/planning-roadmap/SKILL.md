---
name: planning-roadmap
description: Use when you need to create a product roadmap, quarterly plan, version plan, or resource allocation. Roadmap auto-planning. Based on OKR and strategic direction, plan Epic-level product roadmap with Now/Next/Later layering and RICE scoring. Keywords: product roadmap, version planning, RICE scoring, quarterly planning, Epic planning, what features to build, schedule planning.
metadata:
  module: "Product Business & Strategy"
  sub-module: "Strategic Planning & Roadmap"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "General"]
  trigger_examples:
    - "Help me plan the product roadmap"
    - "What to build next version"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output roadmap and milestones"
  deep_description: "Full roadmap + dependency analysis + risk buffer design + multi-scenario roadmap"
---

# Roadmap Auto-Planning

## Core Principles

1. **Strategic theme driven** — Epics must be decomposed from OKR and SWOT strategic themes, not planned arbitrarily
2. **RICE quantitative scoring** — All Epics use the RICE formula for quantitative scoring, ranking is evidence-based
3. **Now/Next/Later layering** — Three-tier planning by priority and time dimension, avoiding flat listing
4. **Explicit dependency risks** — Each Epic marks dependencies and risks, including mitigation measures

## Interaction Mode
🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| OKR objectives and key results | JSON | Yes | output/pm-strategy/planning-okr/okr.json | Objectives and Key Results |
| SWOT strategic direction | JSON | Yes | output/pm-strategy/strategic-analysis/strategic-analysis.json | SO/ST/WO/WT strategic directions |
| Requirement priority scores | JSON | ○ | Covered by design-prd | RICE scoring results |
| Resource constraints | JSON | ○ | User provided | Team capacity, budget, time constraints |

## Execution Steps

### Step 1: Strategic Theme Extraction [Core]

Extract 3-5 strategic themes from OKR and SWOT:

```
Theme = Strategic Direction + Business Objective + Value Proposition
```

Each strategic theme includes:
- Theme name
- Supporting OKR
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

Layer based on RICE score and time dimension:

**Now (Current Quarter)**
- Confirmed high-priority Epics
- Must-complete dependencies
- High-confidence projects

**Next (Next Quarter)**
- Planned but adjustable Epics
- Dependent on Now phase results
- Medium-priority projects

**Later (Future)**
- Directional planning
- Assumptions requiring further validation
- Low-priority or exploratory projects

### Step 4: RICE Score Calculation [Core]

RICE formula:
```
RICE Score = (Reach × Impact × Confidence) ÷ Effort
```

Scoring criteria:
- **Reach**: Number of users/customers impacted
- **Impact**: Degree of positive impact on objectives (0.25-3)
- **Confidence**: Confidence level in data and assumptions (0.5-1)
- **Effort**: Person-months required to complete

### Step 5: Risk Annotation [Core]

Identify and annotate risks:
- Technical risks
- Resource risks
- Dependency risks
- Market risks

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Roadmap and milestones | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output including all Step outputs |
| deep | Full roadmap + dependency analysis + risk buffer design + multi-scenario roadmap | Full output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-strategy/planning-roadmap/`

**Output File**: roadmap.json

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| roadmap.strategic_themes | array | Yes | 3-5 strategic themes |
| roadmap.strategic_themes[].theme | string | Yes | Theme name |
| roadmap.strategic_themes[].okr_reference | string | Yes | Associated OKR |
| roadmap.strategic_themes[].priority | number | No | Theme priority ranking |
| roadmap.quarterly_epics | array | Yes | Quarterly Epic list |
| roadmap.quarterly_epics[].quarter | string | Yes | Quarter identifier |
| roadmap.quarterly_epics[].epics | array | Yes | Epic list |
| roadmap.quarterly_epics[].epics[].name | string | Yes | Epic name, cannot be empty |
| roadmap.quarterly_epics[].epics[].success_metric | string | No | Success metric |
| roadmap.quarterly_epics[].epics[].rice_score | number | Yes | RICE score |
| roadmap.quarterly_epics[].epics[].effort | number | Yes | Effort (person-months) |
| roadmap.quarterly_epics[].epics[].dependencies | array | No | Dependencies list |
| roadmap.quarterly_epics[].epics[].risks | array | Yes | Risks list |
| roadmap.quarterly_epics[].epics[].risks[].risk | string | Yes | Risk description |
| roadmap.quarterly_epics[].epics[].risks[].likelihood | string | Yes | Likelihood, enum: high/medium/low |
| roadmap.quarterly_epics[].epics[].risks[].mitigation | string | No | Mitigation measure |
| roadmap.now_next_later | object | Yes | Three-tier layering |
| roadmap.now_next_later.now | array | Yes | Current quarter Epics |
| roadmap.now_next_later.now[].epic | string | Yes | Epic name |
| roadmap.now_next_later.now[].quarter | string | No | Quarter identifier |
| roadmap.now_next_later.now[].rationale | string | No | Layering rationale |
| roadmap.now_next_later.next | array | Yes | Next quarter Epics |
| roadmap.now_next_later.next[].epic | string | Yes | Epic name |
| roadmap.now_next_later.next[].quarter | string | No | Quarter identifier |
| roadmap.now_next_later.next[].rationale | string | No | Layering rationale |
| roadmap.now_next_later.later | array | Yes | Future Epics |
| roadmap.now_next_later.later[].epic | string | Yes | Epic name |
| roadmap.now_next_later.later[].quarter | string | No | Quarter identifier |
| roadmap.now_next_later.later[].rationale | string | No | Layering rationale |

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
        - epic: "User Onboarding Optimization"
          success_metric: "New user activation rate increased by 30%"
          rice_score: 85
          effort: 3
          dependencies: ["Design resources"]
          risks:
            - risk: "Technical implementation complexity"
              likelihood: "medium"
              mitigation: "Reserve time for technical research"
          key_assumptions:
            - "Data analysis supports optimization direction"
    - quarter: "Q2 2024"
      epics:
        - epic: "Social Feature Development"
          success_metric: "User interaction rate increased by 50%"
          rice_score: 72
          effort: 5
          dependencies: ["Backend API support"]
          risks:
            - risk: "User privacy compliance"
              likelihood: "high"
              mitigation: "Legal team involvement in advance"
          key_assumptions:
            - "High user acceptance after feature launch"
  now_next_later:
    now:
      - epic: "User Onboarding Optimization"
        quarter: "Q1"
        rationale: "High RICE score, directly supports OKR"
    next:
      - epic: "Social Feature Development"
        quarter: "Q2"
        rationale: "Depends on Q1 data validation, needs further research"
    later:
      - epic: "International Expansion"
        quarter: "Q3+"
        rationale: "Long-term strategic direction, needs market validation"
```

## Decision Rules

1. **RICE calculation**: AI automatically completes the calculation
2. **Priority decision**: Human makes final priority decision
3. **Resource allocation**: Human decides quarterly resource allocation
4. **Layering adjustment**: Human can adjust Now/Next/Later layering

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Epics have clear success metrics
- [ ] All Epics have dependency annotations

### P1 Checks (must pass for standard/deep)

- [ ] Now/Next/Later layering is complete
- [ ] RICE scores are calculated
- [ ] Risks are identified with mitigation measures
- [ ] Resource estimates are reasonable

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

When upstream files do not exist, this Skill can still execute independently:

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| okr.json | User provides objective list → directly plan roadmap | Lacking OKR structured data, strategic theme alignment with OKR may be insufficient | Ask user to provide business objectives and key results or upload okr.json file |
| strategic-analysis.json | User provides objective list → directly plan roadmap | Lacking strategic analysis data, strategic themes may deviate from strategic direction | Ask user to provide strategic direction and priority descriptions or upload strategic-analysis.json file |
| Requirement priority data (insight-analysis / design-prd) | User provides objective list → directly plan roadmap | Lacking requirement priority data, RICE scoring lacks input basis | Ask user to provide feature requirement list and priority ranking or upload insight-analysis.json file |
| okr.json + strategic-analysis.json + requirement priority | User provides objective list → directly plan roadmap | Overall confidence reduced, Epic ranking lacks data anchoring | Ask user to provide business objectives, strategic direction, and feature priorities |
| All upstream files missing | Prompt user to execute prior stages first, or directly plan roadmap based on user-provided objective list | Overall confidence significantly reduced, roadmap is only a general planning reference | Ask user to provide business objectives, feature requirements, and priority ranking |
| Resource constraints (user provided) | If user has not provided resource constraints, prompt user to provide or skip steps related to this input | Lacking resource constraints, Epic effort estimates may be unrealistic | Ask user to provide team size, tech stack, and available timeline resource constraint information |

## Data Acquisition Instructions

This Skill requires OKR, strategic analysis, and requirement priority data. Please provide via one of the following methods:
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
| Requirement priority data change | RICE scoring and ranking | Re-execute Step 4, update RICE scores and layering |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Strategic theme adjustment | business-strategy-report, stakeholder-analysis | Output file version number + change summary |
| Epic priority change | business-strategy-report | Output file version number + change summary |
| Now/Next/Later layering change | stakeholder-analysis | Output file version number + change summary |
