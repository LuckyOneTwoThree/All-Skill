---
name: design-handoff-spec
description: Used when design phase deliverables need to be handed off to the development team or when a development handoff document needs to be generated. Development handoff summary is automatically generated, integrating page inventory, route structure, functional requirements, and pending items to produce a developer-facing handoff document. Keywords: design handoff, design delivery, Handoff, development alignment, delivery document.
metadata:
  module: "Product Ideation & Design"
  sub-module: "Design Handoff"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["Internet", "Software", "General"]
  trigger_examples:
    - "Design files are ready, how to hand off to development"
    - "Help me generate a design delivery document"
    - "How to produce a development alignment document"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output design delivery specification"
  deep_description: "Full specification + interaction state machine + responsive breakpoint specification + accessibility design specification"
---

# Development Handoff Summary Auto-Generation

## Core Principles

1. **PM defines product requirements, UI decides implementation** — handoff documents only convey product requirements, not token values/component specifications/animation parameters/responsive breakpoints
2. **Reference rather than inline** — UI implementation details (tokens/components/interactions/responsive) are produced by UI Skill; handoff documents reference their output paths
3. **Completeness check** — every page, every functional area must be covered
4. **Traceability** — requirement sources have basis, changes are trackable

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| IA Information Architecture | JSON | ○ | output/pm-design/design-ia/ia_proposals.json | Page routing and navigation requirements |
| PRD Document | Markdown | ○ | output/pm-design/design-prd/prd.md | Product requirements reference |
| PRD Structured Data | JSON | ○ | output/pm-design/design-prd/prd.json | Machine-consumable PRD version for handoff document alignment |
| Interaction Specification | Markdown | ○ | output/pm-design/interaction-spec/interaction-spec.md | Interaction intent and accessibility requirements |

## Execution Steps

### Step 1: Page Inventory & Route Mapping [Core]

Based on IA and PRD, generate a complete page inventory:

**Page Inventory**:

| Page Name | Route | Level | Functional Areas | Status |
|----------|------|------|---------|------|
| Home | / | L1 | Carousel/Recommendation List/Search Entry | Defined |
| Product Detail | /product/:id | L2 | Product Images/Spec Selection/Reviews | Defined |
| Shopping Cart | /cart | L2 | Product List/Total Price/Checkout | Defined |
| Checkout | /checkout | L3 | Shipping Address/Payment Method/Confirm | To Be Defined |

**Route Structure** (from ia_proposals.json routes):

```
/                    → Home
/product/:id         → Product Detail
/cart                → Shopping Cart
/checkout            → Checkout
/checkout/success    → Payment Success
/profile             → User Center
```

### Step 2: Functional Requirements Summary [Core]

Based on PRD, extract functional requirements for each page:

| Page | Functional Requirements | Interaction Intent | Error Scenarios |
|------|---------|---------|---------|
| Home | Display recommended content, search entry | Pull-to-refresh needs feedback | Network error/No recommendations |
| Product Detail | Display product info, add to cart | Add to cart needs confirmation feedback | Product delisted/Insufficient stock |
| Shopping Cart | Manage cart items | Delete needs confirmation/Quantity adjustment takes effect immediately | Empty cart/Price change |
| Checkout | Fill in shipping info, select payment | Form validation needs real-time feedback | Invalid address/Payment failed |

### Step 3: Data Binding & API Consumption Mapping [Core]

Based on PRD's pages[].data_requirements and entities[], generate data binding and API consumption inventory for each page:

**Page Data Binding Table**:

| Page | Data Requirement | Related Entity | Data Operations | Required Fields | Data Source |
|------|---------|---------|---------|---------|---------|
| Home | Recommended courses list | Course | read | id,title,cover,price,rating | API |
| Product Detail | Course details | Course | read | id,title,description,price,syllabus | API |
| Shopping Cart | Cart list | CartItem | read,update,delete | id,course_id,quantity,price | API |
| Checkout | Create order | Order | create | items[],total,address_id,payment_method | API |

**API Consumption Inventory** (for api-integration Skill consumption):

| API Operation | Method | Path (Suggested) | Consuming Page | Related Entity |
|---------|------|------------|---------|---------|
| Get recommended courses | GET | /courses/recommended | Home | Course |
| Get course details | GET | /courses/:id | Product Detail | Course |
| Get shopping cart | GET | /cart | Shopping Cart | CartItem |
| Update shopping cart | PUT | /cart/items/:id | Shopping Cart | CartItem |
| Create order | POST | /orders | Checkout | Order |

> Note: API paths are suggested values; final paths are determined by api-design-spec. The purpose of this inventory is to align data consumption requirements between UI and Backend during the design phase.

**State Management Requirements**:

| Global State | Type | Consuming Pages | Data Source |
|----------|------|---------|---------|
| User Info | Global | All pages | API (GET /user/profile) |
| Cart Count | Global | Navbar + Cart page | API (GET /cart/count) |
| Auth Token | Global | All authenticated pages | Login API |

### Step 4: UI Output References [Core]

Reference UI Skill output paths, do not inline UI implementation details:

| UI Output | Source Path | Description |
|---------|---------|------|
| Design Tokens | output/ui-project-init/project-init.json → tokens | Colors/Fonts/Spacing/Shadows/Border radius |
| Component Library | output/ui-project-init/project-init.json → component_library | Reusable component list and theme customization |
| Visual Direction | output/ui-project-init/project-init.json → visual_direction | Aesthetic direction/Color strategy/Visual taboos |
| Page Components | output/ui-frontend/page-builder/ | Page component code and interaction implementation |
| Interaction Implementation | ext-interaction-design output | Animation tokens/Interaction patterns/Accessibility adaptation |
| Responsive Adaptation | page-builder output | Responsive breakpoints and adaptation scheme |

> Note: The above paths are output locations after UI Skill execution. If UI Skill has not been executed yet, mark as "Pending UI Skill output".

### Step 5: Pending Items & Open Issues [Core]

**Pending Items**:

| ID | Issue | Impact Scope | Owner | Status |
|------|------|---------|--------|------|
| Q1 | Whether homepage recommendation algorithm needs personalization | Homepage data layer | Backend | Pending |
| Q2 | Cart item quantity upper limit | Cart interaction | PM | Pending |

**Open Issues**:

| ID | Issue | Impact Scope | Status |
|------|------|---------|------|
| O1 | Whether offline mode is needed | Global interaction | Open |

### Step 6: Document Assembly [Core]

**Handoff Document Structure**:

```
# <Product Name> Development Handoff Summary

## 1. Overview
### 1.1 Project Information
### 1.2 Output File Index

## 2. Page Inventory & Routes
### 2.1 Route Structure
### 2.2 Page Inventory

## 3. Functional Requirements Summary
### 3.1 Per-Page Functional Requirements
### 3.2 Interaction Intent
### 3.3 Error Scenarios

## 4. Data Binding & API Consumption
### 4.1 Page Data Binding Table
### 4.2 API Consumption Inventory
### 4.3 State Management Requirements

## 5. UI Output References
### 5.1 Design Token References
### 5.2 Component Library References
### 5.3 Visual Direction References
### 5.4 Interaction Implementation References
### 5.5 Responsive Adaptation References

## 6. Pending Items
## 7. Open Issues

## Appendix
- Change Log
```

### Output Depth Levels

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Design delivery specification | Core conclusions + minimum viable output |
| standard | Full output (current default) | Complete output, including all Step outputs |
| deep | Full specification + interaction state machine + responsive breakpoint specification + accessibility design specification | Complete output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-design/design-handoff-spec/`

**Output Files**:

| File | Format | Description |
|------|------|------|
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
      "status": "Defined/To Be Defined"
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
  "data_bindings": [
    {
      "page": "Page Name",
      "data_name": "Data Requirement Name",
      "related_entity": "entity_id",
      "data_operations": ["read | create | update | delete"],
      "required_fields": [],
      "data_source": "api | local | cache"
    }
  ],
  "api_consumption": [
    {
      "operation": "Operation Description",
      "method": "GET | POST | PUT | DELETE",
      "suggested_path": "Suggested Path",
      "consuming_pages": [],
      "related_entity": "entity_id"
    }
  ],
  "state_management": [
    {
      "state_name": "State Name",
      "scope": "global | page | component",
      "consuming_pages": [],
      "data_source": "Data Source Description"
    }
  ],
  "ui_output_references": {
    "design_tokens": "output/ui-project-init/project-init.json → tokens",
    "component_library": "output/ui-project-init/project-init.json → component_library",
    "visual_direction": "output/ui-project-init/project-init.json → visual_direction",
    "page_components": "output/ui-frontend/page-builder/",
    "interaction_implementation": "ext-interaction-design output",
    "responsive_adaptation": "page-builder output"
  },
  "open_questions": []
}
```

**Output Validation Rules**: See the Output Validation Rules section below

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| project_info.product | string | Yes | Product name |
| project_info.version | string | Yes | Document version number |
| pages | array | Yes | Page inventory, cannot be empty |
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
| functional_requirements[].error_scenarios | array | Yes | Error scenario list |
| ui_output_references | object | Yes | UI output references |
| open_questions | array | Yes | Pending items |

## Decision Rules

| Condition | Decision |
|------|------|
| IA missing | Page inventory derived from PRD, mark "Lacks IA validation" |
| PRD missing | Functional requirements derived from IA and user description, mark "Lacks PRD validation" |
| Interaction spec missing | Interaction intent derived from PRD, mark "Lacks interaction spec validation" |
| UI Skill not yet executed | ui_output_references marked as "Pending UI Skill output" |

## Quality Check

### P0 Check (must pass for quick/standard/deep)

- [ ] Page inventory and routes are complete
- [ ] Each page has functional requirements summary

### P1 Check (must pass for standard/deep)

- [ ] Each page has interaction intent and error scenarios
- [ ] Each page has data binding and API consumption mapping
- [ ] API consumption inventory covers all page data requirements
- [ ] Global state management requirements identified
- [ ] UI output reference paths are correct
- [ ] Pending items listed

### P2 Check (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have basis and alternatives)

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact | Data Acquisition Instructions |
|---------------|---------|---------|------------|
| IA missing | Page inventory derived from PRD | Route structure may be incomplete | Ask user to provide page structure and navigation description or upload IA proposal file |
| PRD missing | Functional requirements derived from IA | Functional requirements may be incomplete | Ask user to provide functional requirement description or upload prd.json file |
| Interaction spec missing | Interaction intent derived from PRD | Interaction intent may lack detail | Ask user to provide interaction spec description or upload interaction design file |
| Both IA and PRD missing | Derived from user description | Overall confidence reduced | Ask user to provide functional requirements and page structure description |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| IA structure change (route/navigation adjustment) | Page inventory, route structure | Mark affected routes and pages, suggest human confirmation on whether to update route mapping |
| PRD requirement change (feature addition/removal) | Functional requirements summary, interaction intent, error scenarios | Mark affected feature points, suggest human confirmation on whether to update handoff scope |
| Interaction spec change | Interaction intent, error scenarios | Mark affected interaction intents, suggest human confirmation on whether to update |

### Downstream Notification Mechanism

| Handoff Document Change Type | Notification Scope | Notification Method |
|-----------------|----------|----------|
| Page/route change | Development team, Testing team | Mark change impact scope, trigger route and page structure re-confirmation |
| Functional requirement change | Development team, Testing team | Mark requirement change, trigger feature implementation and test case update |
| Interaction intent change | Development team | Mark interaction change, trigger interaction implementation update |
