---
name: design-prototype
description: "Use when generating prototypes based on IA and user flows. Automatically generates low-fidelity and medium-fidelity prototypes based on IA proposals and User Flows, including design spec checks and usability heuristic evaluation. Keywords: prototype design, low-fidelity prototype, medium-fidelity prototype, design specification, prototype generation, create design mockup, rapid prototype."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Product Design & Prototyping"
  type: "pipeline"
  version: "3.2"
  domain_tags: ["Internet", "Software", "General"]
  trigger_examples:
    - "Help me generate a prototype"
    - "Quickly create a design mockup"
    - "How to make a low-fidelity prototype"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Output prototype proposal and interaction notes"
  deep_description: "Full prototype + interaction state full coverage + multi-device adaptation plan + usability assessment"
---

# Prototype Auto-Generation

## Core Principles

1. **Prototypes are communication tools, not final products**: The value of prototypes lies in quickly validating assumptions, not pixel-perfect reproduction
2. **Fidelity progresses as needed**: Validate structure with low-fidelity first, then validate interaction with medium-fidelity; no skipping steps
3. **Batch generation, human filtering**: AI generates prototype proposals in bulk, humans make final selection and judgment
4. **Consistency is quantifiable**: Design spec consistency is measured with a score; <85% requires human confirmation

AI->Human AI suggests -> Human approves

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| IA Proposal | JSON | Yes | output/pm-design/design-ia/ia_proposals.json | Information architecture proposal from Pipeline 9 |
| User Flow | JSON | Yes | output/pm-design/design-userflow/userflow.json | User flow from Pipeline 10 |
| PRD Document | Markdown | O | output/pm-design/design-prd/prd.md | Product requirements reference |
| PRD Structured Data | JSON | O | output/pm-design/design-prd/prd.json | Machine-consumable PRD version containing pages[]/features[], for prototype design alignment |

## Execution Steps

### Step 1: Low-Fidelity Prototype Generation [Core]

Generate wireframe-level prototype descriptions:

- **Layout**: Page structure and area division
- **Content Priority**: Content importance ranking for each area
- **Copy**: Key text content
- **Functional Areas**: Functional area mapping based on PRD

### Step 2: Medium-Fidelity Prototype Generation [Core]

Add on top of low-fidelity:

- **Area Relationships**: Visual hierarchy and associations between areas
- **Navigation Flow**: Page-to-page transition relationships
- **Data Display Needs**: List data, empty states, loading state requirement descriptions (does not define specific UI implementation)
- **Interaction Intents**: Basic interaction behavior intents (does not define specific animation parameters; interaction-spec and UI Skill decide implementation)

### Step 3: Usability Heuristic Evaluation [Core]

Evaluate based on Nielsen's 10 Usability Heuristics:

1. Visibility of system status
2. Match between system and real world
3. User control and freedom
4. Consistency and standards
5. Error prevention
6. Recognition rather than recall
7. Flexibility and efficiency of use
8. Aesthetic and minimalist design
9. Help users recognize, diagnose, and recover from errors
10. Help and documentation

Scoring range 0-10, **weak areas with score <3 require improvement suggestions**.

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | prototype proposal and interaction notes | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full prototype + interaction state full coverage + multi-device adaptation plan + usability assessment | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-design/design-prototype/`

**Output Files**:

| File | Path | Description |
|------|------|-------------|
| Prototype Specification | prototype_spec.json | Page layout, functional areas, interaction intents, heuristic evaluation |
| Component Catalog | component_catalog.json | Component catalog for UI Skill consumption, including component types, properties, data binding |

### prototype_spec.json

```json
{
  "prototype": {
    "fidelity": "medium",
    "pages": [
      {
        "name": "Page Name",
        "layout": {
          "regions": [],
          "content_priority": [],
          "navigation_flow": []
        },
        "functional_areas": [],
        "data_display_needs": [],
        "interaction_intents": []
      }
    ],
    "heuristic_evaluation": {
      "overall_score": 8.5,
      "weak_areas": [
        {
          "principle": "Visibility of system status",
          "score": 2,
          "suggestion": "Add loading progress indicators"
        }
      ]
    }
  }
}
```

### component_catalog.json

component_catalog.json is the machine-consumable component catalog from prototype design, for UI Skill programmatic consumption, ensuring component generation aligns with prototype design.

**Recommended + Alternative Mode**: Each component provides a recommended type and alternatives. UI Skill can choose a more suitable implementation based on design judgment, avoiding prototype pre-selection limiting design freedom.

| Field | Description |
|-------|-------------|
| type | Recommended component type (derived from prototype functional requirements) |
| alternatives | Alternative component proposal list, each alternative includes type, name, reason, and applicable scenarios |
| selection_criteria | Component selection decision basis, describing conditions for choosing recommended type vs alternative type |

**Example**:
```json
{
  "component_id": "user-list",
  "type": "data_display",
  "name": "UserTable",
  "alternatives": [
    {
      "type": "composite",
      "name": "UserCardGrid",
      "reason": "Card Grid is better for visual differentiation, supports image + summary rich display",
      "best_for": "Data count <20, needs visual impact, mobile-first scenarios"
    }
  ],
  "selection_criteria": "Use Table when data >20 rows or needs sorting/filtering; use CardGrid when data <20 rows or needs visual differentiation"
}
```

```json
{
  "catalog_id": "string",
  "generated_at": "ISO8601",
  "source_prototype": "prototype_spec.json",
  "components": [
    {
      "component_id": "string",
      "name": "string",
      "type": "layout | navigation | data_display | form | feedback | media | composite",
      "description": "string",
      "props": [
        {
          "prop_name": "string",
          "type": "string | number | boolean | array | object",
          "required": "boolean",
          "default_value": "string | null",
          "description": "string"
        }
      ],
      "data_binding": {
        "data_source": "api | local | cache",
        "api_endpoint": "string | null",
        "fields": ["string"],
        "loading_state": "string",
        "error_state": "string",
        "empty_state": "string"
      },
      "pages_used_in": ["page_name"],
      "sub_components": ["component_id"],
      "variants": [
        {
          "variant_name": "string",
          "description": "string",
          "prop_overrides": {}
        }
      ],
      "alternatives": [
        {
          "type": "layout | navigation | data_display | form | feedback | media | composite",
          "name": "string",
          "reason": "string",
          "best_for": "string"
        }
      ],
      "selection_criteria": "string"
    }
  ],
  "shared_components": [
    {
      "component_id": "string",
      "name": "string",
      "usage_count": "number",
      "pages": ["page_name"]
    }
  ],
  "component_dependencies": [
    {
      "component_id": "string",
      "depends_on": ["component_id"]
    }
  ]
}
```

### Relationship Between component_catalog.json and prototype_spec.json

| Dimension | prototype_spec.json | component_catalog.json |
|-----------|---------------------|------------------------|
| Consumer | Humans (designers, PM) | Machines (UI Skill) |
| Content | Page layout + interaction intents + evaluation | Component types + properties + data binding + dependencies |
| Generation Order | Generate prototype_spec.json first | Extract component catalog from prototype_spec.json |
| Consistency | Components in component_catalog.json must cover all pages' functional_areas and data_display_needs in prototype_spec.json | |

**Output Validation Rules**: See Output Validation Rules section below

## Decision Rules

- **Heuristic evaluation weak areas** (score <3) require human judgment on whether to modify
- Weak areas must have specific improvement suggestions to pass

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Heuristic evaluation (All 10 principles evaluated)
- [ ] Weak area improvement suggestions (All weak areas with score <3 have specific improvement suggestions)

### P1 Checks (must pass for standard/deep)

- [ ] Core page coverage (All core pages covered)
- [ ] Functional area coverage (Each page's functional areas align with PRD)
- [ ] Component catalog coverage (component_catalog covers all pages' functional_areas and data_display_needs)
- [ ] Component alternatives (Key components (cross-page shared + data display components) have alternatives)
- [ ] Component page reference consistency (component_catalog.components[].pages_used_in page names exist in prototype.pages[])

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|------------------------|-----------------|---------------|-------------------------------|
| IA proposal missing | User provides feature description, generate low-fidelity prototype | Lacks IA data, page structure may be less reasonable | Request user to describe page structure and navigation, or upload design-ia output file |
| UserFlow missing | User provides feature description, generate low-fidelity prototype | Lacks UserFlow data, interaction flow may be less complete | Request user to describe user tasks and flow, or upload design-userflow output file |
| PRD missing | Derive functional areas based on IA and UserFlow | Functional areas may be less complete | Request user to provide feature list and requirements, or upload prd.json file |
| Both IA and UserFlow missing | Generate low-fidelity prototype based on user feature description | Overall confidence reduced, only low-fidelity output | Request user to describe features and page layout, or execute design-ia and design-userflow first |
| All upstream files missing | Prompt user to execute prior stages first, or generate low-fidelity prototype based on user feature description | Output is only low-fidelity prototype description | Request user to describe core features and page layout requirements |

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| prototype | object | Yes | Prototype data |
| prototype.fidelity | string | Yes | Fidelity level (low/medium) |
| prototype.pages | array | Yes | Page list, must not be empty |
| prototype.pages[].name | string | Yes | Page name |
| prototype.pages[].layout | object | Yes | Page layout (area division/content priority/navigation flow) |
| prototype.pages[].functional_areas | array | Yes | Functional area list |
| prototype.pages[].data_display_needs | array | Yes | Data display needs |
| prototype.pages[].interaction_intents | array | Yes | Interaction intents |
| prototype.heuristic_evaluation | object | Yes | Heuristic evaluation |
| prototype.heuristic_evaluation.overall_score | number | Yes | Overall score (0-10) |
| prototype.heuristic_evaluation.weak_areas | array | Yes | Weak areas list |
| component_catalog | object | Yes | Component catalog data |
| component_catalog.catalog_id | string | Yes | Catalog unique identifier |
| component_catalog.components | array | Yes | Component list, must not be empty |
| component_catalog.components[].component_id | string | Yes | Component unique identifier |
| component_catalog.components[].name | string | Yes | Component name |
| component_catalog.components[].type | string | Yes | Component type, enum: layout/navigation/data_display/form/feedback/media/composite |
| component_catalog.components[].props | array | Yes | Component property list |
| component_catalog.components[].data_binding | object | Yes | Data binding, includes data_source/fields/loading_state/error_state/empty_state |
| component_catalog.components[].pages_used_in | array | Yes | Pages using this component, must correspond to prototype.pages[].name |
| component_catalog.components[].alternatives | array | No | Alternative component proposal list, each item includes type/name/reason/best_for |
| component_catalog.components[].selection_criteria | string | No | Component selection decision basis |
| component_catalog.shared_components | array | Yes | Cross-page shared component list |
| component_catalog.component_dependencies | array | Yes | Component dependency relationship list |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| IA proposal change (page addition/removal/hierarchy adjustment) | Page inventory, layout structure | Mark affected pages, suggest human confirmation on whether to regenerate prototype |
| UserFlow change (flow path modification) | Navigation flow, interaction intents | Mark affected interaction flows, suggest human confirmation on whether to update |
| PRD change (feature addition/removal) | Functional areas, data display needs | Mark affected functional areas, suggest human confirmation on whether to update |

### Downstream Notification Mechanism

| Prototype Change Type | Notification Scope | Notification Method |
|----------------------|-------------------|---------------------|
| Page addition/removal | interaction-spec, design-handoff-spec | Mark page changes, trigger interaction spec and handoff document updates |
| Functional area change | design-handoff-spec | Mark functional area changes, trigger handoff document update |
| Interaction intent change | interaction-spec | Mark interaction intent changes, trigger interaction spec update |
| Component catalog change | UI Skill (ui-01-component-design) | Mark component addition/removal/property changes, trigger component generation update |
| Shared component change | UI Skill (ui-01-component-design) | Mark shared component changes, trigger cross-page component update |

## Data Acquisition Instructions

This Skill requires IA, UserFlow, and design specification data. Please provide via one of the following methods:
  1. Directly describe features, page structure, and interaction flows
  2. Upload ia_proposals.json / userflow.json / design specification files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis
