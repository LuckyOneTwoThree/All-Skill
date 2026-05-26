# Stage 1: Design System Establishment

| Input | Source |
|--------|------|
| Brand specifications / Product positioning / Target platform / Target language / project_name / project_dir / framework / Component library preference | Determined during project information collection phase |
| package_manager | Provided by user (default: pnpm) |
| PRD | output/pm-design/design-prd/prd.md (optional) |
| PRD structured data | output/pm-design/design-prd/prd.json (optional) |

Output: output/ui-project-init/ + code written to {project_dir}/ + PRODUCT.md + DESIGN.md
Validation: visual_direction 10-dimension definition + inter-dimension consistency check passed + WCAG AA compliant + PRODUCT.md/DESIGN.md non-placeholder + token files written + npm run dev starts successfully
[GATE] Human confirmation required for visual direction and brand colors

## visual_direction Consistency Check (v7.2 New)

The stage-1 gate not only checks whether the 10 dimensions are "defined", but also validates logical consistency between dimensions, preventing contradictory visual_direction from propagating downstream.

**Consistency Check Rules**:

| Rule | Check Content | Contradiction Example | Handling |
|------|---------|---------|------|
| Color-Mood Consistency | color_strategy temperature matches mood_keywords | color_strategy=cool tone + mood_keywords=warm and approachable | [!] Flag contradiction, suggest adjustment |
| Layout-Density Consistency | layout_differentiation matches tension_level | layout=minimal with generous whitespace + tension_level=high | [!] Flag contradiction, suggest adjustment |
| Bans-Direction Consistency | visual_bans does not contradict aesthetic_direction | aesthetic_direction=bold color clashes + visual_bans=high saturation colors | [X] Block, must fix |
| Typography-Style Consistency | typography_strategy matches register | register=brand + typography=functional compact | [!] Flag contradiction, suggest adjustment |

**Check Result Handling**:
- [X] Block-level contradiction: Must fix before passing the gate
- [!] Warning-level contradiction: Flagged but not blocked, [GATE] Human confirmation required to accept

## Conditional Branch A: Design Exploration (when mode=progressive, runs before project-init execution)

Before consuming PM structured data, freely explore design directions based on unstructured product requirements, avoiding the "cognitive cage" effect of PM outputs.

```
Action: Design Exploration
Trigger Condition: mode=progressive
Input:
  prd_text: output/pm-design/design-prd/prd.md (consume text only, do not consume prd.json)
  Brand specifications: Provided by user
  Product positioning: Provided by user (optional)
Process:
  1. Extract core user tasks and functional requirements from prd.md
  2. Derive 2-3 visual direction candidates based on brand specifications (different tension_level)
  3. Generate page layout exploration schemes for each visual direction
  4. Output design_explorations.json
Output: output/ui-frontend/design-exploration/design_explorations.json
Validation: design_explorations.json generated, at least 2 exploration schemes
Mode: AI
```

[GATE] Human confirmation required to select exploration scheme (choose 1 or merge features from multiple schemes)

## Conditional Branch A Continued: Constraint Alignment (executed after human selects exploration scheme)

```
Action: Constraint Alignment
Trigger Condition: mode=progressive, and human has selected exploration scheme
Input:
  selected_exploration: Human-selected exploration scheme
  prd_json/ia_proposals/component_catalog/interaction_spec: PM structured outputs (optional)
Process:
  1. Align exploration scheme with PM constraints (4 dimensions: pages/functions/components/interactions)
  2. Generate design_decisions.json + design_feedback.json (if conflicts exist)
Output:
  output/ui-frontend/design-exploration/design_decisions.json
  output/ui-frontend/design-exploration/design_feedback.json (if conflicts requiring PM modifications)
Validation: design_decisions.json generated, all functional requirements covered
Mode: AI->Human
```

**design_feedback Propagation Mechanism** (consistent with stage-3 propagation flow):
When design_feedback.json exists and suggestions is non-empty, the orchestrator executes the following propagation flow:
1. Read design_feedback.json
2. Sort by severity (critical > high > medium)
3. [GATE] Human confirmation required to accept feedback suggestions (accept/reject/partially accept)
4. Write confirmed feedback to `output/pm-design/design-feedback/design_feedback.json`
5. Mark in checkpoint that design_feedback has been propagated
6. design-orchestrator checks this path on startup, processes feedback with priority then deletes to avoid duplicate consumption

[GATE] Human confirmation required for constraint alignment results and design decisions

## Conditional Branch B: PM Constraint Review (when PM input exists, runs after project-init execution)

Before page-builder consumes PM outputs, review the reasonableness of PM constraints from a UI design perspective.

```
Action: PM Constraint Review
Trigger Condition: prd.json or ia_proposals.json or component_catalog.json exists
Input:
  prd_json/ia_proposals/component_catalog/interaction_spec: PM structured outputs (optional)
  visual_direction: output/ui-project-init/project-init.json -> visual_direction
Process:
  5-dimension review: Page division / Functional areas / Component selection / Navigation structure / Interaction complexity
Output: output/ui-frontend/constraint-review/constraint_review.json
Validation: constraint_review.json generated
Mode: AI
```

[GATE] Human confirmation required for constraint review results (only critical-level findings require confirmation)
