---
name: page-builder
description: "Use when generating frontend pages and components. Integrated page and component construction, generating components within page context based on visual direction and design tokens, assembling into complete pages with built-in quality gates. Keywords: page generation, component generation, page assembly, UI construction, build pages, create components, assemble pages."
metadata:
  module: "UI Design & Frontend Development"
  sub-module: "UI Frontend Generation"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me build a page"
    - "Generate frontend components"
    - "Build a new page"
    - "Create component code"
---

# Integrated Page and Component Construction

## Core Principles

1. **Design Brief Driven** -- When design_brief.json exists, use its executable design specifications as strong constraints for code generation; fall back to visual direction driven mode when absent
2. **Visual Direction Driven** -- All component and page decisions derived from visual-direction, never designed arbitrarily
3. **Page Context Generation** -- Components generated within page scenarios, ensuring visual consistency and interaction coherence
4. **Token Constraints** -- 100% reference Design Tokens, no hardcoded style values
5. **Built-in Quality** -- Generate and validate simultaneously, no independent review step needed
6. **Accessibility by Default** -- Every component includes ARIA attributes, keyboard navigation, focus management by default
7. **Context Budget** -- Proactively manage context window, ensuring critical information is not lost

## Context Budget Management

page-builder single execution may generate large amounts of component code; must proactively manage context window to prevent information loss.

### Step Checkpoints

After each Step completes, write current progress to internal checkpoint file, supporting orchestrator resume by skipping completed steps:

**Checkpoint File**: `output/checkpoints/page-builder.json`

```json
{
  "type": "object",
  "required": ["completed_steps", "pending_steps", "step_outputs", "last_updated"],
  "properties": {
    "completed_steps": {"type": "array", "items": {"type": "string"}, "description": "List of completed step IDs (e.g. ['step1', 'step2'])"},
    "pending_steps": {"type": "array", "items": {"type": "string"}, "description": "List of pending step IDs (e.g. ['step3', 'step4', 'step5'])"},
    "step_outputs": {"type": "object", "description": "Output file paths or key conclusion summaries for each completed step"},
    "last_updated": {"type": "string", "description": "Last update time (ISO 8601)"}
  }
}
```

**Resume Execution Rules**:
1. On page-builder startup, check `output/checkpoints/page-builder.json`
2. If it exists and has `pending_steps`, continue from the first pending step, skip completed steps
3. Update checkpoint immediately after each step completes (write file before proceeding)
4. After all steps complete, checkpoint file is retained as execution record

### Retention Priority (when context approaches limit)

| Priority | Retained Content | Reason |
|--------|---------|------|
| P0 (Must retain) | Current step input/output, visual_direction, design tokens, component library | Required for current step execution |
| P0 (Must retain) | Names and key input sources of pending steps | Know what to do next |
| P1 (Try to retain) | Output file paths and key conclusion summaries of completed steps | For subsequent step reference |
| P2 (Can discard) | Detailed code and intermediate artifacts of completed steps | Can be re-read from output/ directory |

### Multi-Page Project Strategy

When page count >3, use paginated processing:
1. **Before pagination**: Generate complete page list (from page_manifest.json or page requirements), confirm total pages to generate
2. Each page independently executes Step 2-4, after completion code is written to files, context retains only summary
3. All pages complete then uniformly execute Step 5 (code output and final polish)
4. **After pagination**: Verify consistency between generated pages and pre-pagination list, supplement missing pages
5. Between pages share visual_direction and design tokens (always retained in context)

## Interaction Mode

AI->Human AI suggests, human approves

## Input

**PM Input Freedom Principle**: PM layer outputs (PRD, IA, Interaction-Spec) define "what is needed" (intent), this Skill decides "how to implement" (implementation). PM input serves as intent reference only, not limiting design decisions. Specifically:
- PRD's functional_areas define the must-cover feature list, but area layout method, visual hierarchy, component selection is decided by this Skill
- IA's route structure defines inter-page navigation relationships, but page internal layout and navigation patterns is decided by this Skill
- Interaction-Spec's state machines and animation intent define must-cover interaction completeness, but visual expression, transition effects, feedback components is decided by this Skill + ext-interaction-design
- When PM input conflicts with this Skill's design judgment, design judgment prevails, but deviation reasons must be noted in output

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Page Requirements | string/markdown | Yes | User provided / output/pm-design/design-prd/prd.md | Page functionality description and layout requirements |
| Page Manifest | JSON | Conditionally required | output/ui-frontend/page-manifest/page_manifest.json | Unified page manifest generated by orchestrator, must consume when exists, pages[] is authoritative source for page generation |
| Visual Direction | JSON | Yes | output/ui-project-init/project-init.json -> visual_direction | Aesthetic direction/color strategy/visual bans etc. |
| Design Tokens | JSON | Yes | output/ui-project-init/project-init.json -> tokens | Design variable definitions |
| Component Library | JSON | Yes | output/ui-project-init/project-init.json -> component_library | Available component inventory and theme customization |
| Target Framework | string | Yes | User provided | React/Vue/Svelte |
| Target Language | string | Yes | Passed from upstream orchestrator / User provided (default zh-CN) | Target interface language |
| project_dir | string | Yes | output/ui-project-init/project-init.json -> project_dir | Project root directory absolute path |
| PRD | markdown | O | output/pm-design/design-prd/prd.md | Product requirements context (including functional areas and component requirements) |
| PRD Structured Data | JSON | Conditionally required | output/pm-design/design-prd/prd.json | Must consume when file exists, pages[] is authoritative source for page manifest |
| Route Structure | JSON | Conditionally required | output/pm-design/design-ia/ia_proposals.json | Must consume when file exists, routes[] is authoritative source for route manifest |
| Interaction Spec | markdown | O | output/pm-design/interaction-spec/interaction-spec.md | Interaction state machines/interaction intent/exception paths/accessibility interactions |
| Interaction Spec (Structured) | JSON | O | output/pm-design/interaction-spec/interaction-spec.json | Structured data of interaction state machines/animation intent/gesture intent for programmatic consumption |
| User Flow | JSON | O | output/pm-design/design-userflow/userflow.json | User flow data containing step sequences and data_operations[], for page data binding and interaction logic mapping |
| Exploration Phase Design Decisions | JSON | O | output/ui-frontend/design-exploration/design_decisions.json | Design decisions from progressive mode Stage 1 conditional branch (constraint alignment), as design_decisions initial values |
| Design Brief | JSON | O | output/ui-frontend/design-brief/design_brief.json | Executable design specifications produced by ext Skills, containing specific CSS values/component structures/layout instructions |

## Execution Steps

### Step 1: Page Structure Planning and Visual Rhythm Design [Core]

Decompose page requirements into layout blocks, while designing visual rhythm (not just functional layout):

**PRD Consumption Rules** (intent constraints):
- **Page Manifest Consumption Priority**: page_manifest.json > prd.json.pages[] > ia_proposals.routes[] > Page Requirements (string/markdown)
- If page_manifest.json input exists: Its `pages[]` is the **authoritative source for page generation**, page-builder must generate corresponding pages for each page_id, no omissions allowed
- If PRD input exists: Its defined functional areas and content requirements serve as **must-cover feature checklist**, but area layout method, visual hierarchy, spacing rhythm is determined by page-builder combined with visual_direction
- **Page Manifest Coverage Constraint**: If prd.json input exists, its `pages[]` is the **authoritative source for page manifest**, page-builder must generate corresponding pages for each `page_id`, no omissions allowed
- **Route Manifest Coverage Constraint**: If ia_proposals.json input exists, its `routes[]` is the **authoritative source for route manifest**, page-builder must generate corresponding pages for each route, no omissions allowed
- **Cross-validation**: When both prd.json and ia_proposals.json exist, `prd.json.pages[].route` must correspond one-to-one with `ia_proposals.routes[].path`; when inconsistent, prd.json.pages[] takes precedence, differences recorded in design_decisions

**component_catalog Consumption Rules** (recommended + alternative mode):
- If component_catalog input exists: Its `type` is the recommended component type, `alternatives` are alternatives, `selection_criteria` is the selection basis
- page-builder selects recommended or alternative type based on visual_direction and page context; selecting alternative type must be recorded in design_decisions
- When alternative type better matches visual direction, prefer alternative type

**User Flow Consumption Rules** (data operation mapping):

- If userflow.json input exists: Its `steps[]` are associated with pages via `page_id`, `data_operations[]` provides cross-domain data perspective for page component data binding
- **Step-Page Mapping**: Group userflow.steps[] by page_id, the step set corresponding to each page defines the user operation sequence that the page needs to support
- **Data Operation-Component Mapping**: data_operations[].operation_type determines the component data interaction pattern:

| operation_type | Component Pattern | Required Interactions |
|---------------|-------------------|-----------------------|
| read | Display component (DataGrid/Card/List) | Data fetch logic + empty/loading/error three states |
| create | Form component (Form/Dialog) | Submit logic + validation feedback + success notification |
| update | Edit component (InlineEdit/Form) | Optimistic update + conflict handling + change confirmation |
| delete | Action component (ActionButton/ConfirmDialog) | Confirmation mechanism + undo capability + cascade impact prompt |

- **Entity-Type Mapping**: data_operations[].related_entity corresponds to data layer type definitions, for generating TypeScript interfaces and Mock data structures
- **Operation Sequence-Interaction Flow Mapping**: The operation sequence of multiple steps within the same page determines data dependencies and interaction order between components (e.g., step 2 depends on step 1's creation result)
- **Branch Path-Conditional Rendering Mapping**: Branch conditions in userflow map to component conditional rendering logic (v-if/conditional rendering)
- **Coordination with Interaction Spec**: userflow's data_operations focuses on "data perspective" (what entity to operate on), interaction-spec focuses on "interaction perspective" (how to operate), they complement rather than replace each other

**Functional Layout**:

| Layout Block | Typical Components | Description |
|----------|---------|------|
| Header | Navbar/SearchBar/UserMenu | Global navigation, fixed top |
| Sidebar | SideNav/FilterPanel | Side navigation or filters, collapsible |
| Main | ContentArea/DataGrid/Form | Main content area |
| Footer | Footer/Links | Global footer |

**Visual Rhythm Design** (consuming visual-direction):

| Dimension | Design Content | Basis |
|------|---------|------|
| Visual Focus | Page focal area (what user sees first) | aesthetic_direction + mood_keywords |
| Density Distribution | Where dense, where sparse | spatial_strategy |
| Color Rhythm | Where bright, where dark, where brand color accents | color_strategy |
| Layering | Foreground/midground/background differentiation | theme_decision |
| Design Tension | Visual boldness degree | tension_level |
| Visual Narrative | Page eye flow path | visual_narrative |

**Visual Anchor Consumption** (consuming 8 anchor dimensions from visual-direction):

Anchor dimensions in visual_direction transform vague visual intent into concrete visual parameters; page-builder must strictly follow:

| Anchor Dimension | Consumption Rule | Violation Determination |
|---------|---------|---------|
| border_radius_level | All border radius values must match level: sharp->0-2px, subtle->4-8px, medium->12-16px, round->20-24px, pill->999px | Border radius value not matching level |
| shadow_style | Shadow style must be consistent: none->no shadows, flat->offset only, subtle->slight spread, elevated->multi-layer spread, dramatic->large projection | Shadow style inconsistent with definition |
| spacing_rhythm | Spacing must follow rhythm pattern: tight->4px base, standard->8px base, relaxed->16px base; regular/jazz/symphonic | Spacing not matching rhythm pattern |
| type_scale | Font size jumps must reach level: modest->1.2x, standard->1.333x, strong->1.5x, dramatic->2x+ | h1 vs body font size ratio below level requirement |
| brand_color_usage | Brand color distribution must match: accent/spotlight/flood | Brand color distribution inconsistent with definition |
| image_treatment | Image treatment must be consistent: none/photography/illustration/3d/abstract/minimal-icon | Image style inconsistent with definition |
| motion_style | Motion intensity must match: none/subtle/moderate/expressive/theatrical | Motion intensity inconsistent with definition |
| grid_density | Information density must match: sparse/balanced/dense | Content block count inconsistent with density definition |

**Page-level Anchor Override Consumption** (consuming visual-direction's anchor_overrides):

When visual_direction defines anchor_overrides, page-builder consumes them following these rules:

1. **Matching Rule**: When anchor_overrides[].page matches current page name or route, the corresponding anchor dimensions use override_value instead of global_value
2. **Override Priority**: Page-level override value > Global anchor value
3. **Non-overridden Dimensions**: Dimensions not appearing in anchor_overrides still use global anchor values
4. **Override Constraints**: Single page override dimensions <=3; override values must be within corresponding enum range
5. **Quality Check Adaptation**: Visual anchor compliance checks use the final value after overrides, not global values

**tension_level Visual Pattern Library**:

| Tension Level | Layout Strategy | Color Strategy | Typography Strategy | Spacing Strategy | Brand Color Strategy |
|---------|---------|---------|---------|---------|-----------|
| conservative | Symmetric layout, standard grid, center-aligned | Neutral dominant (>=70%), brand color accent (<=10%) | Standard font size jumps (1.333x), regular weights (400/600) | Even spacing, standard 8px base | Brand color only for buttons and links |
| balanced | Moderate asymmetry, 1-2 visual focal points | Neutral dominant (50-60%), brand color secondary (20-30%) | Moderate jumps (1.333-1.5x), bold headings (700) | Rhythmic spacing variation, 8px base+jazz rhythm | Key area backgrounds use brand color light variants |
| bold | Asymmetric layout, large visual areas, break grid | Brand color prominent (30-50%), strong contrast blocks | Large jumps (1.5x+), oversized headings (48px+), extreme weight contrast (900/300) | Large jumping spacing, 16px base+symphonic rhythm | Hero area brand color large area use, gradient backgrounds |
| extreme | Experimental layout, full-screen visuals, overlapping elements | Brand color dominant (>50%), clashing colors, high saturation | Extreme jumps (2x+), text overlay on images, unconventional typography | Extreme spacing contrast (4px<->64px) | Brand color flood mode, full-screen gradients + text overlay |

Layout rules:
- Desktop: Header+Sidebar(240px)+Main+Footer
- Tablet: Header+collapsible Sidebar+Main+Footer
- Mobile: Header+BottomNav+Main (full-screen)

**PM Constraint Deviation Recording**:

When page-builder's design judgment is inconsistent with PM input constraints, deviation decisions must be explicitly recorded:

```json
{
  "design_decisions": [{
    "pm_constraint": "PRD requires 3 independent functional areas (user info/order list/action panel)",
    "ui_decision": "Merged into Tab-style single area, 3 tabs switching display",
    "rationale": "User task flow is coherent, separate areas increase cognitive load and page vertical length",
    "impact": "Reduces page vertical scrolling, improves task completion efficiency, but must ensure Tab switching accessibility",
    "constraint_source": "prd.json -> pages[].functional_areas",
    "severity": "moderate"
  }]
}
```

**Deviation Severity Grading**:

| Severity | Definition | Example |
|--------|------|------|
| minor | Layout fine-tuning, no impact on feature coverage | Functional area order adjustment, spacing rhythm change |
| moderate | Implementation method change, feature coverage unchanged | Multi-area merged into Tabs, list changed to card grid |
| major | Feature scope re-division | Page merge/split, functional area add/remove |
| critical | Core interaction path change | Key user flow step modification, navigation structure reorganization |

**Recording Rules**:
- minor level deviations: Record but no human confirmation needed
- moderate level deviations: Record and annotate in quality_report, recommend human confirmation
- major/critical level deviations: Record and block output, require human confirmation before proceeding

**Design Brief Consumption** (consuming design_brief.json):

When design_brief.json exists, page-builder must consume it as a **strong constraint input**:

| Consumption Dimension | design_brief Field | Consumption Method | Priority |
|----------|------------------|---------|--------|
| Color Specification | color_specifications | Specific CSS color values directly applied | Strong constraint |
| Typography Specification | typography_specifications | Specific font sizes/weights/line heights directly applied | Strong constraint |
| Layout Instructions | layout_instructions | Layout type and visual focus as design reference | Guiding |
| Component Specification | component_specifications | Component structure/states/variants directly implemented | Strong constraint |
| Animation Specification | animation_specifications | Animation parameters directly applied | Strong constraint |
| Brand Color Strategy | brand_color_strategy | Brand color distribution directly followed | Strong constraint |
| Visual Bans | visual_bans | Banned patterns absolutely not appearing | Strong constraint |
| Differentiation Direction | differentiation_direction | Aesthetic differentiation direction as design decision basis | Guiding |

**Consumption Rules**:
- Specific values in design_brief **override** derived values in visual_direction
- Layout instructions in design_brief serve as **design reference**, page-builder can adjust implementation, adjustments recorded in design_decisions
- Visual bans in design_brief are **appended to** visual_direction.visual_bans
- When design_brief conflicts with PM input: design_brief takes precedence, conflicts recorded in design_decisions
- When guiding dimensions in design_brief conflict with page-builder's design judgment: Design judgment takes precedence, deviations recorded in design_decisions

### Step 2: Component Generation (in Page Context) [Core]

Generate components within page scenarios based on page structure and visual direction:

**Component Generation Order**: Page skeleton first -> then core interaction components -> finally decorative components

**Design Brief Driven**: When design_brief.component_specifications exists, implement according to specified component structure/states/variants/specific_values directly.

**Styling Solution**:

| Project Tech Stack | Recommended Solution |
|-----------|---------|
| Tailwind configured | Tailwind class names |
| CSS Modules configured | CSS Modules |
| Styled Components configured | Styled Components |
| No clear solution | CSS Modules |

**Component Specifications**:
- Props interface (TypeScript type definitions, minimize required Props)
- Visual variant list
- State list and visual expression per state
- ARIA attributes and keyboard interaction
- Design Token reference list

**Interaction Logic and State Machines** (consuming interaction-spec):

Each component with complex interaction designs a state machine:
- Each state has clear entry/exit conditions
- No deadlock states allowed
- Each state transition has visual feedback
- Async operations must have loading states
- If interaction-spec input exists: State machines must **cover** all states and transitions defined in interaction spec
- If interaction-spec input exists: Exception paths must be mapped to component states
- If interaction-spec input exists: Accessibility interaction requirements must be implemented

Animation intent consumption: interaction-spec defines intent, page-builder + ext-interaction-design decides implementation.

If interaction-spec doesn't define animation intent, use page-builder built-in default animation specification table.

**Data Operation Consumption** (consuming userflow.json data_operations):

When userflow.json exists, component generation must consume the corresponding page's data_operations, translating data operation intent into component interfaces:

| data_operations Dimension | Component Interface Impact | Example |
|--------------------------|---------------------------|---------|
| operation_type=read | Component must declare data fetch Props (dataSource/fetchParams), built-in loading/error/empty states | CourseList component accepts fetchCourses parameter, built-in skeleton and empty state |
| operation_type=create | Component must declare submit Props (onSubmit/onValidate), built-in form validation and submit feedback | CourseForm component accepts onSubmit callback, built-in field validation |
| operation_type=update | Component must declare edit Props (onUpdate/initialValues), built-in change detection and conflict handling | ProfileEdit component accepts onUpdate and initial values, built-in dirty check |
| operation_type=delete | Component must declare delete Props (onDelete/confirmMessage), built-in confirmation and undo | DeleteButton component accepts onDelete callback, built-in secondary confirmation dialog |
| related_entity | Corresponds to TypeScript type definition, as data object type in Props | related_entity="course" -> Course type interface |

- When multiple data_operations exist on the same page, components pass operation results via Props (e.g., after create, pass new data to read component for list refresh)
- Data requirements not covered by data_operations are supplemented by page-builder based on PRD and page requirements

> ext enhancement results consumed through design_brief.json in Step 1, this step focuses on core logic

### Step 3: Page Assembly and State Management [Core]

Assemble components into complete pages:

**State Management Solution**:

| State Type | Management Method | Typical Scenario |
|----------|---------|---------|
| UI State | Component internal useState / Svelte writable | Modal toggle, Tab switch |
| Page Shared State | React Context / Vue Provide / Svelte stores | Filter conditions, pagination parameters |
| Global State | Zustand / Pinia / Svelte stores | User info, permissions, theme |
| Server State | React Query/SWR / Vue Query / svelte-query | API data, caching |

Route configuration: Route paths correspond to IA hierarchy, nested routes correspond to page blocks, code splitting per route independent chunk.

Internationalization (built-in capability): Introduce i18n framework for multi-language scenarios, extract copy as language packs.

**Data Layer Fallback** (when api-integration is skipped):

When orchestrator decides to skip api-integration (no backend API or using static data), page-builder must generate its own data layer, ensuring pages are runnable:

| Data Layer Component | Generation Rule | Write Path |
|-----------|---------|---------|
| Static Mock Data | Generate type-compliant Mock data based on page data flow requirements, content consistent with target language | {project_dir}/src/api/mock/ |
| Data Fetch Functions | Generate simple async functions for each data requirement (return Promise, simulate network delay 200-500ms) | {project_dir}/src/api/fetch.ts |
| Data Hooks | Wrap data fetch functions using React Query/SWR, including loading/error states | {project_dir}/src/api/hooks/ |
| Type Definitions | TypeScript type definitions for data interfaces | {project_dir}/src/api/types.ts |

Generation rules:
- Mock data must cover all data requirements defined in page data flows
- When userflow.json exists: Mock data must cover data structures for all related_entity in data_operations, data operation types determine Mock data CRUD methods (read->query function, create->create function, update->update function, delete->delete function)
- Data fetch function signatures consistent with api-integration generated signatures (for subsequent replacement)
- Mark `api_integration_skipped: true` in pages.json, for production-ready reference
- Mark `// @api-integration: pending api-integration replacement` comments in code, for subsequent locating and replacement

**Connection with api-integration**: If api-integration executes subsequently, its generated code will override fallback files (api-integration handles cleaning fallback markers and replacing with real API calls). api-integration should preserve type definitions from fallback (`types.ts`), only replacing data fetch functions and mock data.

> ext enhancement results consumed through design_brief.json in Step 1, this step focuses on core logic

### Step 4: Built-in Quality Gates [Core]

Execute quality checks immediately after code generation (no independent review step needed):

**Design Specification Checks**:

| Check Item | Pass Standard | Level |
|--------|---------|------|
| Color value references | 100% use Token variables | P0 |
| Font size references | 100% use Token variables | P0 |
| Spacing references | 100% use Token variables | P0 |
| Color contrast | Body text >=4.5:1, large text >=3:1 | P0 |
| Visual bans | No patterns from visual_direction.visual_bans | P0 |

**Aesthetic Validation Checks**:

| Check Item | Pass Standard | Level |
|--------|---------|------|
| Visual rhythm compliance | Page implementation consistent with Step 1 visual rhythm design (6 dimensions all reflected) | P0 |
| Brand color proportion | Brand color proportion within visual_direction.color_strategy corresponding range | P1 |
| Typography hierarchy jumps | Font size ratio between h1/h2/h3/h4/body >=type_scale corresponding multiplier, weight difference >=100 | P0 |
| visual_direction consistency | Component visual style consistent with aesthetic_direction description | P0 |
| Whitespace rhythm | Page spacing non-uniform distribution, at least 3 different spacing values forming rhythm | P1 |
| Visual anchor compliance | 8 anchor dimensions implementation consistent with visual_direction definition | P0 |
| AI homogenization feature detection | No AI homogenization features: Inter/Roboto/Arial as primary font, blue-purple gradient+white background, uniform card grid layout, all spacing identical, no visual focus | P0 |
| Visual boredom detection | Not satisfying any of: (1)brand color <5% (2)all font jumps <1.25x (3)all spacing values identical (4)no visual focus area (5)no shadows or depth layering | P1 |

**Accessibility Checks**:

| Check Item | Pass Standard | Level |
|--------|---------|------|
| Image alt text | All img have alt attributes | P0 |
| Form labels | All form controls have associated labels | P0 |
| Keyboard operable | All interactions completable via keyboard | P0 |
| ARIA attributes | Interactive components have correct role and aria-* | P0 |

**Interaction Completeness Checks**:

| Check Item | Pass Standard | Level |
|--------|---------|------|
| State coverage | default/hover/focus/active/disabled | P0 |
| Loading state | Async operations have loading indicator | P0 |
| Empty state | Empty data has empty state display | P0 |
| Error state | Request failure has error prompt and retry | P0 |

**Responsive Checks**:

| Check Item | Pass Standard | Level |
|--------|---------|------|
| Mobile | 375px width no content overflow | P0 |
| Tablet | 768px width reasonable layout | P1 |
| Desktop | 1024px+ width reasonable layout | P1 |

**Page-level Checks**:

| Check Item | Pass Standard | Level |
|--------|---------|------|
| Component tree depth | <=4 levels | P1 |
| Component source | 100% from component library or current generation | P1 |
| Route coverage | All pages have routes | P1 |
| Page manifest coverage | All page_ids in page_manifest.json.pages[] have corresponding pages generated | P0 |
| Route manifest coverage | All routes in ia_proposals.routes[] are configured | P0 |
| Data operation coverage | When userflow exists, each page's data_operations[] has corresponding component support | P1 |

**Issue Handling Rules**: P0 issues must be fixed before output, P1 issues marked as "pending fix".

> ext enhancement results consumed through design_brief.json in Step 1, this step focuses on core logic

### Step 5: Code Output and Final Polish [Core]

**Code Writing Rules**:
- Component files -> {project_dir}/src/components/{ComponentName}/
- Page files -> {project_dir}/src/pages/
- Route configuration -> {project_dir}/src/router/
- State management -> {project_dir}/src/stores/

> ext enhancement results consumed through design_brief.json in Step 1, this step focuses on core logic

## Output

**Code File Output**: {project_dir}/src/ (components, pages, routes, state management, data layer fallback directly written to project directory)

**Metadata Output**: output/ui-frontend/page-builder/

**Output Files**: pages.json, design_feedback.json, quality_debt.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["pages", "components", "quality_report", "project_dir"],
  "properties": {
    "pages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "Page name"},
          "route": {"type": "string", "description": "Route path"},
          "layout": {"type": "string", "description": "Layout type (header-sidebar-main / header-main / full-screen)"},
          "component_tree": {"type": "array", "items": {"type": "string"}, "description": "Page component tree (component ID list)"},
          "state_management": {"type": "string", "description": "State management solution"},
          "data_flow": {"type": "array", "items": {"type": "object"}, "description": "Data flow definitions (source/params/response_type)"}
        }
      }
    },
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "Component name"},
          "framework": {"type": "string", "description": "Target framework"},
          "files": {"type": "array", "items": {"type": "string"}, "description": "Component file path list"},
          "props": {"type": "array", "items": {"type": "string"}, "description": "Props interface field list"},
          "token_coverage": {"type": "number", "description": "Design Token reference rate (%)"},
          "accessibility": {"type": "object", "description": "Accessibility attributes (aria_roles/keyboard_nav/focus_management)"},
          "interaction": {"type": "object", "description": "Interaction definitions (states/transitions/state_machine)"}
        }
      }
    },
    "quality_report": {
      "type": "object",
      "properties": {
        "pass_rate": {"type": "number", "description": "Quality check pass rate (%)"},
        "p0_issues": {"type": "array", "items": {"type": "object"}, "description": "P0 blocking issue list"},
        "p1_issues": {"type": "array", "items": {"type": "object"}, "description": "P1 pending fix issue list"},
        "aesthetic_score": {"type": "number", "description": "Aesthetic score (0-100)"}
      }
    },
    "design_decisions": {
      "type": "array",
      "description": "PM constraint deviation records, must be recorded when UI design judgment is inconsistent with PM input constraints",
      "items": {
        "type": "object",
        "required": ["pm_constraint", "ui_decision", "rationale", "impact", "constraint_source", "severity"],
        "properties": {
          "pm_constraint": {"type": "string", "description": "Original constraint description from PM input"},
          "ui_decision": {"type": "string", "description": "Actual design decision from UI side"},
          "rationale": {"type": "string", "description": "Deviation rationale"},
          "impact": {"type": "string", "description": "Deviation impact assessment on product"},
          "constraint_source": {"type": "string", "description": "Constraint source (e.g. prd.json->pages[].functional_areas)"},
          "severity": {"type": "string", "enum": ["minor", "moderate", "major", "critical"], "description": "Deviation severity"}
        }
      }
    },
    "visual_direction": {
      "type": "object",
      "description": "Pass-through of project-init visual_direction, including 10 dimensions (including tension_level/visual_narrative)"
    },
    "api_integration_skipped": {
      "type": "boolean",
      "description": "Whether api-integration was skipped (true means data layer is fallback Mock, pending subsequent replacement)"
    },
    "page_coverage": {
      "type": "object",
      "description": "Page manifest coverage report (generated when prd.json or ia_proposals.json exists)",
      "properties": {
        "source": {"type": "string", "description": "Page manifest source (prd.json / ia_proposals.json / both)"},
        "expected_pages": {"type": "array", "items": {"type": "object"}, "description": "Expected page list (from PM outputs)"},
        "generated_pages": {"type": "array", "items": {"type": "string"}, "description": "Actually generated page name list"},
        "missing_pages": {"type": "array", "items": {"type": "object"}, "description": "Missing pages (expected but not generated)"},
        "extra_pages": {"type": "array", "items": {"type": "string"}, "description": "Extra generated pages (not in expected list)"},
        "coverage_rate": {"type": "number", "description": "Page coverage rate (%), 100% means no omissions"}
      }
    },
    "project_dir": {"type": "string", "description": "Project root directory path"}
  }
}
```

### design_feedback.json

design_feedback.json is the UI-to-PM reverse feedback channel. When page-builder discovers optimizable space in PM outputs during design, it generates structured feedback suggestions, transmitted by ui-orchestrator back to design-orchestrator for processing.

**Distinction from design_decisions**:
- design_decisions: Records deviation decisions already made by UI side (UI decides autonomously, informs afterward)
- design_feedback: Suggests PM side modify their outputs (requires PM side confirmation and modification, prior negotiation)

**Generation Condition**: When design_decisions contains major or critical level deviations, corresponding design_feedback must be generated.

```json
{
  "type": "object",
  "required": ["feedback_id", "generated_at", "source", "suggestions"],
  "properties": {
    "feedback_id": {"type": "string", "description": "Feedback unique identifier"},
    "generated_at": {"type": "string", "description": "Generation time (ISO 8601)"},
    "source": {"type": "string", "description": "Feedback source (page-builder)"},
    "suggestions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["target_artifact", "target_field", "current_value", "suggested_value", "rationale", "impact_assessment", "priority"],
        "properties": {
          "target_artifact": {"type": "string", "enum": ["prd.json", "ia_proposals.json", "userflow.json", "component_catalog.json", "interaction-spec.json"], "description": "PM output file suggested for modification"},
          "target_field": {"type": "string", "description": "Specific field path suggested for modification (e.g. pages[].functional_areas)"},
          "current_value": {"type": "string", "description": "Current value description"},
          "suggested_value": {"type": "string", "description": "Suggested value description"},
          "rationale": {"type": "string", "description": "Modification rationale (based on UI design judgment)"},
          "impact_assessment": {"type": "object", "description": "Modification impact assessment", "properties": {
            "affected_downstream": {"type": "array", "items": {"type": "string"}, "description": "Affected downstream outputs"},
            "breaking_change": {"type": "boolean", "description": "Whether breaking change"},
            "effort": {"type": "string", "enum": ["low", "medium", "high"], "description": "Modification effort"}
          }},
          "priority": {"type": "string", "enum": ["low", "medium", "high"], "description": "Suggestion priority"}
        }
      }
    },
    "summary": {"type": "string", "description": "Feedback summary (one sentence summarizing core suggestion)"}
  }
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| Component library match rate >=80% | Reuse existing components, extend Props |
| Component library match rate 50%-80% | Reuse + compose, supplement differences |
| Component library match rate <50% | Create new components |
| Data volume >=100 records | Mandatory virtual scrolling |
| Modal/dialog components | Mandatory focus trap + ESC close |
| Single component code >200 lines | Split into 1 parent component + N child components |
| Target language = zh-CN | Placeholder text "Please enter"/"Loading"/"Submit" |
| Target language = en-US | Placeholder text "Enter..."/"Loading..."/"Submit" |
| Target language = ar-SA | Layout direction RTL, add dir="rtl" |
| Page component count >10 | Split into sub-routes or Tab pagination |

## Quality Checks

P0 (Must pass, blocks output if not):
- [ ] visual_direction visual bans 100% not violated
- [ ] Design Token reference rate 100%, no hardcoded style values (colors/font sizes/spacing)
- [ ] Color contrast body text >=4.5:1, large text >=3:1
- [ ] Interactive components 100% include ARIA attributes and keyboard navigation
- [ ] State coverage default/hover/focus/active/disabled
- [ ] Async operations have loading indicator
- [ ] Empty data has empty state display
- [ ] Request failure has error prompt and retry
- [ ] Responsive 375px width no content overflow
- [ ] Visual rhythm 6 dimensions reflected in page
- [ ] Visual anchor 8 dimensions implementation consistent with visual_direction definition (including final values after page-level overrides)
- [ ] Typography hierarchy jumps >=type_scale corresponding multiplier
- [ ] No AI homogenization features (Inter/Roboto primary font, blue-purple gradient+white background, uniform card grid, identical spacing, no visual focus)
- [ ] design_decisions has no critical/major level deviations without human confirmation

P1 (Recommended, mark as "pending fix" if not):
- [ ] TypeScript type definitions complete, no any types
- [ ] State machines have no deadlock states
- [ ] Spacing references 100% use Token variables
- [ ] Responsive coverage 768px/1024px
- [ ] Component tree depth <=4 levels
- [ ] Async operations >300ms have progress indicator
- [ ] Support prefers-reduced-motion
- [ ] Brand color proportion within color_strategy corresponding range
- [ ] Typography hierarchy has sufficient jump (font size ratio >=1.25, weight difference >=100)
- [ ] Page spacing has rhythm (non-uniform distribution, at least 3 spacing values)
- [ ] Visual boredom detection passed
- [ ] Page structure recommendation has been data-driven reviewed
- [ ] Differentiation suggestions applied
- [ ] Interaction design applied (when not purely static components)
- [ ] design_decisions moderate level deviations annotated with recommendation for human confirmation
- [ ] When userflow exists, all data_operations have corresponding component implementations

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Visual direction missing | Infer visual direction from design tokens | Aesthetic direction may be less precise |
| Design tokens missing | Use inline styles + TODO comments | Style values hardcoded, need subsequent replacement |
| Component library missing | Create all new components | May have duplicate components |
| Design brief missing | Fall back to token-driven mode, only consume visual_direction and design tokens for component generation | Color/typography/layout no strong constraint specifications, component visual consistency relies on token derivation |
| Page manifest missing | Extract page list from PRD text or page requirement descriptions, no structured validation | Pages may be missing, routes may be incomplete, no page_coverage report |
| PRD missing | Generate based on page requirement descriptions only, no product requirements context | Component functionality may deviate from product intent, missing business logic constraints, incomplete functional area coverage |
| Route structure missing | Plan route hierarchy and nesting based on page requirements independently | Routes may be inconsistent with IA definition, navigation structure needs subsequent alignment |
| Interaction spec missing | Use default animation specification table and generic feedback mechanisms, exception paths inferred from PRD | Interaction state machines may be incomplete, exception paths may be missing, animations and feedback may be inconsistent with product-level definitions |
| User flow missing | Infer data operation requirements from PRD and interaction spec, component data binding relies on page requirement description derivation | Data operations may be incomplete, component data interfaces lack cross-domain data perspective, page and user flow data operations may be inconsistent |
| project_dir missing | Output to output/ directory only | Code needs manual copying |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Visual direction change | All component and page visual decisions | Mark affected components and pages, recommend regenerating |
| Design brief change | Component generation, color specs, typography specs, layout instructions | Mark affected dimensions and pages, strong constraint dimension changes need regenerating corresponding components |
| Page manifest change | Page coverage completeness, route configuration | Mark added/removed pages, supplement missing pages or remove deprecated pages |
| Design token change | Component style references | Mark affected components, recommend updating Token references |
| Component library change | Component reuse relationships | Mark affected reused components, recommend re-matching |
| PRD change | Page functional requirements, component boundaries, functional area coverage | Mark affected pages and components, assess whether re-planning needed |
| Route structure change | Route configuration and navigation components | Mark affected route paths, recommend updating route configuration |
| Interaction spec change | Interaction state machines, exception paths, accessibility interactions | Mark affected state transitions and exception paths, recommend updating state machines |
| User flow change | Page data binding, component data interfaces, data layer type definitions | Mark affected pages and data_operations, recommend updating component Props and data layer |

### Downstream Notification Mechanism Table

| This Skill Output Change | Notify Downstream Skill | Notification Content | Trigger Condition |
|---------------|-------------|---------|---------|
| Page component tree change | production-ready | Affected tests and build | Component tree structure change |
| Route configuration change | production-ready | Route change | Route path change |
| quality_debt change | production-ready | New/upgraded critical/high level debt | debt_items severity change or new open status items |
| Data flow change | api-integration | API requirement change | Data fetching method change |
| design_feedback generated | ui-orchestrator -> design-orchestrator | PM output modification suggestion | design_feedback.json exists and suggestions non-empty |
