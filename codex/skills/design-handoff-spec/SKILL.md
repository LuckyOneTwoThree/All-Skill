---
name: design-handoff-spec
description: "Use when the design phase is complete and needs to be handed off to the development team. Automatically generates a development handoff summary integrating page inventory, route structure, functional requirements, and pending items. Keywords: design handoff, design delivery, Handoff, dev coordination, delivery document."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Design Delivery"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Design is done, how to hand off to development"
    - "Generate a design handoff document for me"
    - "How to produce a dev coordination document"
execution_depth:
  default: standard
  quick_description: "Output design handoff specifications"
  deep_description: "Full spec + interaction state machine + responsive breakpoint specs + accessibility design specs"
---

# Development Handoff Summary Auto-Generation

## Core Principles

1. **PM defines product requirements, UI decides implementation** -- Handoff documents only convey product requirements, not token values/component specs/animation parameters/responsive breakpoints
2. **Reference rather than inline** -- UI implementation details (tokens/components/interactions/responsive) are produced by UI Skill; handoff documents reference their output paths
3. **Completeness verification** -- Every page and every functional area must be covered
4. **Traceability** -- Requirements have documented sources, changes are trackable

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| IA Information Architecture | JSON | O | output/pm-design/design-ia/ia_proposals.json | Page routes and navigation requirements |
| PRD Document | Markdown | O | output/pm-design/design-prd/prd.md | Product requirements reference |
| PRD Structured Data | JSON | O | output/pm-design/design-prd/prd.json | Machine-consumable PRD version for handoff alignment |
| Interaction Specification | Markdown | O | output/pm-design/interaction-spec/interaction-spec.md | Interaction intents and accessibility requirements |

## Execution Steps

### Step 1: Page Inventory and Route Mapping [Core]

Based on IA and PRD, generate a complete page inventory:

**Page Inventory**:

| Page Name | Route | Level | Functional Areas | Status |
|-----------|-------|-------|-----------------|--------|
| Home | / | L1 | Carousel/Recommendation List/Search Entry | Defined |
| Product Detail | /product/:id | L2 | Product Images/Spec Selection/Reviews | Defined |
| Shopping Cart | /cart | L2 | Product List/Total Price/Checkout | Defined |
| Checkout | /checkout | L3 | Shipping Address/Payment Method/Confirm | Pending |

**Route Structure** (from ia_proposals.json routes):

```
/                    -> Home
/product/:id         -> Product Detail
/cart                -> Shopping Cart
/checkout            -> Checkout
/checkout/success    -> Payment Success
/profile             -> Profile
```

### Step 2: Functional Requirements Summary [Core]

Based on PRD, extract functional requirements for each page:

| Page | Functional Requirements | Interaction Intent | Exception Scenarios |
|------|------------------------|-------------------|---------------------|
| Home | Display recommended content, search entry | Pull-to-refresh needs feedback | Network error/Empty recommendations |
| Product Detail | Display product info, add to cart | Add to cart needs confirmation feedback | Product delisted/Insufficient stock |
| Shopping Cart | Manage cart items | Delete needs confirmation/Quantity changes take effect immediately | Empty cart/Price changes |
| Checkout | Fill in shipping info, select payment | Form validation needs real-time feedback | Invalid address/Payment failure |

### Step 3: UI Output References [Core]

Reference UI Skill output paths instead of inlining UI implementation details:

| UI Output | Source Path | Description |
|-----------|------------|-------------|
| Design Tokens | output/ui-project-init/project-init.json -> tokens | Colors/Fonts/Spacing/Shadows/Border radius |
| Component Library | output/ui-project-init/project-init.json -> component_library | Reusable component list and theme customization |
| Visual Direction | output/ui-project-init/project-init.json -> visual_direction | Aesthetic direction/Color strategy/Visual taboos |
| Page Components | output/ui-frontend/page-builder/ | Page component code and interaction implementation |
| Interaction Implementation | ext-interaction-design output | Animation tokens/Interaction patterns/Accessibility adaptation |
| Responsive Adaptation | page-builder output | Responsive breakpoints and adaptation schemes |

> Note: The above paths are where UI Skill outputs will be located after execution. If UI Skill has not yet been executed, mark as "Pending UI Skill output".

### Step 4: Pending Items and Open Questions [Core]

**Pending Items**:

| ID | Question | Impact Scope | Owner | Status |
|----|----------|-------------|-------|--------|
| Q1 | Does the home page recommendation algorithm need personalization | Home page data layer | Backend | Pending |
| Q2 | Cart item quantity limit | Cart interaction | PM | Pending |

**Open Questions**:

| ID | Question | Impact Scope | Status |
|----|----------|-------------|--------|
| O1 | Is offline mode needed | Global interaction | Open |

### Step 5: Document Assembly [Core]

**Handoff Document Structure**:

```
# {Product Name} Development Handoff Summary

## 1. Overview
### 1.1 Project Information
### 1.2 Output File Index

## 2. Page Inventory and Routes
### 2.1 Route Structure
### 2.2 Page Inventory

## 3. Functional Requirements Summary
### 3.1 Per-Page Functional Requirements
### 3.2 Interaction Intents
### 3.3 Exception Scenarios

## 4. UI Output References
### 4.1 Design Token References
### 4.2 Component Library References
### 4.3 Visual Direction References
### 4.4 Interaction Implementation References
### 4.5 Responsive Adaptation References

## 5. Pending Items
## 6. Open Questions

## Appendix
- Changelog
```

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | design handoff specifications | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full spec + interaction state machine + responsive breakpoint specs + accessibility design specs | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-design/design-handoff-spec/`

**Output Files**:

| File | Format | Description |
|------|--------|-------------|
| design-handoff-spec.md | Markdown | Complete development handoff summary |
| design-handoff-spec.json | JSON | Structured data |

**design-handoff-spec.json Structure**:

```json
{
  "project_info": {
    "product": "Product Name",
    "version": "1.0"
  },
  "pages": [
    {
      "name": "Page Name",
      "route": "/path",
      "level": "L1/L2/L3",
      "functional_areas": [],
      "status": "Defined/Pending"
    }
  ],
  "routes": [],
  "functional_requirements": [
    {
      "page": "Page Name",
      "requirements": [],
      "interaction_intents": [],
      "error_scenarios": []
    }
  ],
  "ui_output_references": {
    "design_tokens": "output/ui-project-init/project-init.json -> tokens",
    "component_library": "output/ui-project-init/project-init.json -> component_library",
    "visual_direction": "output/ui-project-init/project-init.json -> visual_direction",
    "page_components": "output/ui-frontend/page-builder/",
    "interaction_implementation": "ext-interaction-design output",
    "responsive_adaptation": "page-builder output"
  },
  "open_questions": []
}
```

**Output Validation Rules**: See Output Validation Rules section below

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| project_info.product | string | Yes | Product name |
| project_info.version | string | Yes | Document version number |
| pages | array | Yes | Page inventory, must not be empty |
| pages[].name | string | Yes | Page name |
| pages[].route | string | Yes | Page route |
| pages[].level | string | Yes | Page level (L1/L2/L3) |
| pages[].functional_areas | array | Yes | Functional area list |
| pages[].status | string | Yes | Definition status |
| routes | array | Yes | Route structure |
| functional_requirements | array | Yes | Functional requirements summary |
| functional_requirements[].page | string | Yes | Page name |
| functional_requirements[].requirements | array | Yes | Functional requirements list |
| functional_requirements[].interaction_intents | array | Yes | Interaction intent list |
| functional_requirements[].error_scenarios | array | Yes | Exception scenario list |
| ui_output_references | object | Yes | UI output references |
| open_questions | array | Yes | Pending items |

## Decision Rules

| Condition | Decision |
|-----------|----------|
| IA missing | Page inventory derived from PRD, marked "Lacks IA verification" |
| PRD missing | Functional requirements derived from IA and user description, marked "Lacks PRD verification" |
| Interaction spec missing | Interaction intents derived from PRD, marked "Lacks interaction spec verification" |
| UI Skill not yet executed | ui_output_references marked "Pending UI Skill output" |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Page inventory and routes are complete
- [ ] Each page has a functional requirements summary

### P1 Checks (must pass for standard/deep)

- [ ] Each page has interaction intents and exception scenarios
- [ ] UI output reference paths are correct
- [ ] Pending items are listed

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|------------------------|-----------------|---------------|----------|
| IA missing | Page inventory derived from PRD | Route structure may be incomplete | Request user to describe page structure and routes, or upload ia.json |
| PRD missing | Functional requirements derived from IA | Functional requirements may be less complete | Request user to provide feature list and requirements, or upload prd.json |
| Interaction spec missing | Interaction intents derived from PRD | Interaction intents may be less detailed | Request user to describe interaction behaviors, or upload interaction-spec.json |
| Both IA and PRD missing | Derived from user description | Overall confidence reduced | Request user to describe features and page structure, or execute design-prd and design-ia first |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| IA structure change (route/navigation adjustment) | Page inventory, route structure | Mark affected routes and pages, suggest human confirmation on whether to update route mapping |
| PRD requirement change (feature addition/removal) | Functional requirements summary, interaction intents, exception scenarios | Mark affected feature points, suggest human confirmation on whether to update handoff scope |
| Interaction spec change | Interaction intents, exception scenarios | Mark affected interaction intents, suggest human confirmation on whether to update |

### Downstream Notification Mechanism

| Handoff Document Change Type | Notification Scope | Notification Method |
|------------------------------|-------------------|---------------------|
| Page/route change | Development team, QA team | Mark change impact scope, trigger route and page structure re-confirmation |
| Functional requirement change | Development team, QA team | Mark requirement change, trigger feature implementation and test case updates |
| Interaction intent change | Development team | Mark interaction change, trigger interaction implementation update |
