---
name: project-init
description: "Use when initializing a UI frontend project. Integrated project initialization and visual definition, deriving visual direction from brand specifications, selecting and customizing component library themes, simultaneously generating project scaffold and design context files. Keywords: project initialization, design system, visual direction, theme customization, project scaffold, create project, design specification, configure theme colors."
metadata:
  module: "UI Design & Frontend Development"
  sub-module: "Design System"
  type: "pipeline"
  version: "1.7"
  domain_tags: ["Internet", "General"]
  trigger_examples:
    - "Initialize frontend project"
    - "Establish design system"
    - "Configure theme colors"
    - "Set up a project"
  interaction_mode: "ai_suggest_human_approve"
---

# Project Initialization and Visual Definition

## Engineering Delivery Boundary

Follow [Engineering Boundary Protocol](../../codex-templates/engineering-boundary-protocol.md).

1. Project first: inspect existing framework, router, state management, component library, styling, API client, and test stack before writing code; inherit by default.
2. Design-system first: existing design system, component library, and brand rules override visual_policy unless the user explicitly asks to change them.
3. Write scope: declare target directories and files before implementation; do not overwrite unrelated user code.
4. Responsive acceptance: check desktop/mobile layout, text overflow, cramped controls, nested cards, accessibility basics, and design-token consistency.
5. Verification record: report created/modified files, checks run, checks that could not run, and residual risks.

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../codex-templates/engineering-boundary-protocol.md).

1. Scan first: identify existing project structure, framework, component library, and design system before writing code; inherit by default.
2. Target scope: declare target directories and files before implementation; generated code must stay inside {project_dir}/ unless context files are explicitly required.
3. No overwrite: preserve existing project files, configurations, and customizations unless the user explicitly asks for replacement.
4. Design-system first: existing design system, component library, and brand rules override visual_policy unless the user explicitly asks to change them.
5. Token consistency: generated design tokens must be consistent with visual direction and brand specifications.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## Core Principles

1. **Visual Direction First** -- Define "what it looks like" first, then generate tokens and code
2. **Component Library First** -- Prefer mature component libraries (shadcn/Ant Design/MUI etc.), building from scratch only as fallback
3. **Brand-Driven** -- All visual decisions derived from brand DNA, not arbitrarily defined
4. **Context as Code** -- PRODUCT.md/DESIGN.md generated alongside code, for subsequent Skill and ext-impeccable consumption

## Step Checkpoints

After each Step completes, write current progress to internal checkpoint file, supporting orchestrator resume by skipping completed steps:

**Checkpoint File**: `output/checkpoints/project-init.json`

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
1. On project-init startup, check `output/checkpoints/project-init.json`
2. If it exists and has `pending_steps`, continue from the first pending step, skip completed steps
3. Update checkpoint immediately after each step completes (write file before proceeding)
4. After all steps complete, checkpoint file is retained as execution record

## Interaction Mode

AI->Human AI suggests, human approves

## Input

**PM Input Freedom Principle**: PM layer outputs (brand specifications, product positioning, PRD) define "what is needed" (intent), this Skill decides "how to implement" (implementation). PM input serves as intent reference only, not limiting design decisions. When PM input conflicts with this Skill's design judgment, design judgment prevails, but deviation reasons must be noted in output.

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Brand Specification | JSON/markdown | Yes | User provided / output/pm-strategy/positioning-strategy/positioning-strategy.json | Brand colors, fonts, style guidelines |
| Product Positioning | JSON | O | output/pm-strategy/positioning-strategy/positioning-strategy.json | Product positioning statement |
| Target Platform | string | Yes | User provided | Web / Mobile / Cross-platform |
| Target Language | string | Yes | Passed from upstream orchestrator / User provided (default zh-CN) | Target interface language |
| project_name | string | Yes | User provided | Project name |
| project_dir | string | Yes | User provided | Project root directory absolute path |
| framework | string | Yes | User provided | React/Vue/Svelte/Next.js/Nuxt.js |
| package_manager | string | O | User provided | npm/pnpm/yarn (default pnpm) |
| Component Library Preference | string | O | User provided | shadcn/Ant Design/MUI/Element Plus/Custom (default recommended based on framework) |
| PRD | markdown | O | output/pm-design/design-prd/prd.md | Product requirements document (including functional areas and component requirements) |
| PRD Structured Data | JSON | O | output/pm-design/design-prd/prd.json | Machine-consumable PRD version, containing pages[]/user_flows[], for programmatic project initialization consumption |
| visual_policy | string | O | User provided / Orchestrator default | Visual strategy: existing-design-system-first / balanced / differentiation-strict, default existing-design-system-first |

## Execution Steps

### Step 1: Brand DNA Extraction and Color System Generation

Extract core design DNA from brand specifications:
- Primary color: Brand primary color (1) + secondary colors (2-3)
- Color mood: Professional/Warm/Energetic/Tech/Steady
- Font personality: Modern/Classic/Geometric/Humanist
- Visual style: Flat/Skeuomorphic/Glassmorphism/Neumorphism

Generate complete color system based on primary color (using OKLCH color space for perceptual uniformity):

| Token Category | Generation Rules | Count |
|----------|----------|------|
| Brand Colors | Primary + secondary, each generating 50-950 with 10 shades | 30-40 |
| Functional Colors | Success/Warning/Error/Info, each with 10 shades | 40 |
| Neutral Colors | Grayscale 50-950 | 10 |
| Semantic Colors | Background/Foreground/Border/Link/Disabled | 15-20 |

Contrast verification: Body text >=4.5:1 (WCAG AA), large text >=3:1, auto-adjust if not meeting standard.

Dark mode derivation (built-in capability): Primary hue unchanged with reduced lightness and increased saturation, background inverted, text contrast >=4.5:1.

> ext enhancement results are output through visual_direction/tokens for downstream consumption, this step focuses on core logic

### Step 2: Visual Style Definition

**This is the most critical step** -- defining "what this product should look like", not just outputting token values.

Based on brand DNA extraction results, define complete visual style direction:

| Dimension | Definition Content | Output Field |
|------|---------|---------|
| Visual Strategy | Existing design system first / balanced / strict differentiation | visual_policy |
| Aesthetic Direction | Specific style description (e.g. "warm organic + generous whitespace + soft rounded corners") | aesthetic_direction |
| Color Strategy | Restrained/Committed/Full palette/Drenched | color_strategy |
| Theme Decision | Light/Dark + physical scenario sentence (e.g. "SRE looking at monitoring in a dimly lit room at 2am") | theme_decision |
| Typography Strategy | Heading font style + body font style + hierarchy contrast | typography_strategy |
| Spatial Strategy | Whitespace ratio + density tendency | spatial_strategy |
| Visual Bans | Patterns absolutely not to use | visual_bans |
| Mood Keywords | 3-5 core mood words | mood_keywords |
| Reference Style | 1-2 referenceable products/design styles | reference_style |
| Design Tension | Bold vs restrained degree (conservative/balanced/bold/extreme), determining whether design is "safe but boring" or "memorable" | tension_level |
| Visual Narrative | How pages guide user eye flow (e.g. "Z-pattern reading -> focus CTA -> progressively reveal details"), defining narrative rhythm of information presentation | visual_narrative |

**visual_policy Execution Rules**:

| Strategy | Rules |
|------|------|
| existing-design-system-first | Default strategy. Existing projects prioritize inheriting current design system; differentiation rules must not override brand specifications and component library constraints |
| balanced | Introduce moderate differentiation while respecting brand and component library constraints, suitable for most new projects |
| differentiation-strict | Use for brand new projects or brand upgrades, forcibly avoiding homogenization patterns, allowing bolder visual anchors |

**Visual Anchor Definition** (preventing AI understanding ambiguity from text descriptions):

Pure text visual directions (like "warm organic") have 100 visual interpretations for AI models; concrete visual anchors must be supplemented to transform vague intent into executable visual parameters.

| Anchor Dimension | Definition Content | Output Field | Example |
|---------|---------|---------|------|
| Border Radius Strategy | Global border radius level | border_radius_level | sharp(0-2px)/subtle(4-8px)/medium(12-16px)/round(20-24px)/pill(999px) |
| Shadow Strategy | Shadow hierarchy and style | shadow_style | none/flat(offset only)/subtle(slight spread)/elevated(multi-layer spread)/dramatic(large projection) |
| Spacing Rhythm | Spacing base and rhythm pattern | spacing_rhythm | tight(4px base)/standard(8px base)/relaxed(16px base) + regular(even)/jazz(jumping)/symphonic(multi-level) |
| Type Scale | Heading vs body font size contrast | type_scale | modest(1.2x)/standard(1.333x)/strong(1.5x)/dramatic(2x+) |
| Brand Color Usage | Brand color distribution pattern in pages | brand_color_usage | accent(buttons/links only)/spotlight(key area backgrounds)/flood(large area backgrounds+gradients) |
| Image Treatment | Visual treatment of images/illustrations | image_treatment | none/photography/illustration/3d/abstract/minimal-icon |
| Motion Style | Interaction motion intensity and rhythm | motion_style | none/subtle(micro-feedback)/moderate(smooth transitions)/expressive(spring+choreography)/theatrical(dramatic choreography) |
| Grid Density | Content area information density | grid_density | sparse(generous+large whitespace)/balanced(standard spacing)/dense(compact+information-dense) |

**Semantic Consistency Validation** (logical constraints between visual_direction dimensions):

Dimensions in visual_direction have semantic constraint relationships; self-contradictory definitions cause downstream consumption confusion. The following combinations must pass validation:

| Validation Rule | Contradictory Example | Fix Suggestion |
|----------|---------|---------|
| aesthetic_direction and tension_level semantically consistent | "Minimalist restrained style" + tension_level=extreme | Adjust tension_level to conservative/balanced, or adjust aesthetic_direction |
| grid_density and brand_color_usage complementary | grid_density=sparse + brand_color_usage=flood | Sparse layout + large area brand color usually contradicts, suggest grid_density->balanced or brand_color_usage->spotlight |
| spacing_rhythm and tension_level matched | spacing_rhythm=tight(4px) + tension_level=bold | Bold tension needs large jumping spacing, suggest spacing_rhythm->relaxed+symphonic |
| type_scale and tension_level matched | type_scale=modest(1.2x) + tension_level=bold | Bold tension needs strong font size jumps, suggest type_scale->strong(1.5x) or dramatic(2x+) |
| motion_style and tension_level matched | motion_style=none + tension_level=extreme | Extreme tension needs rich motion, suggest motion_style->expressive or theatrical |
| shadow_style and aesthetic_direction matched | "Minimalist flat style" + shadow_style=dramatic | Minimalist style doesn't need large projections, suggest shadow_style->none or subtle |

**Validation Execution Timing**: Execute immediately after Step 2 outputs visual_direction; contradictory items are marked as P0 issues, must be corrected before continuing.

**Page-level Override Semantic Validation**: Anchor combinations after anchor_overrides must still pass the above validation rules.

**Page-level Anchor Overrides** (anchor_overrides):

Global anchors define the overall visual baseline, but specific pages may need to break global rhythm for visual focus or differentiation. anchor_overrides allow page-level overrides of global anchor values while maintaining overall visual consistency.

**Override Rules**:
- Each override must provide `reason` (override rationale) and `visual_impact` (visual impact description)
- Overridden anchor values must still be within enum range (e.g. border_radius_level still sharp/subtle/medium/round/pill)
- Single page max 3 anchor dimension overrides; exceeding 3 suggests the page may need its own visual direction
- Overrides don't change global anchor definitions, only affect specified page consumption behavior

**Typical Override Scenarios**:

| Scenario | Override Dimensions | Example |
|------|---------|------|
| Landing page needs visual impact | grid_density: balanced->dense, brand_color_usage: accent->spotlight | Homepage dense display + brand color prominence |
| Detail page needs breathing room | grid_density: dense->sparse, spacing_rhythm: tight->standard | Content page generous whitespace |
| Form page needs sense of security | border_radius_level: sharp->subtle, shadow_style: subtle->elevated | Rounded corners + shadows increase approachability |
| Data dashboard needs immersion | grid_density: balanced->dense, motion_style: moderate->expressive | Dense data + rich motion |

**Visual Reference Image Generation**:

Based on visual direction and anchor definitions, generate 2 Moodboard reference images, providing visual anchors for subsequent page construction:

```
Action: Generate visual reference images
Input:
  aesthetic_direction: Aesthetic direction defined in Step 2
  mood_keywords: Mood keywords
  reference_style: Reference style
  border_radius_level/shadow_style/spacing_rhythm/type_scale/brand_color_usage/image_treatment/motion_style/grid_density: 8 anchor dimensions
Output:
  moodboard_light: Reference image URL (light mode Moodboard, showing overall visual atmosphere + layout rhythm + color distribution)
  moodboard_dark: Reference image URL (dark mode Moodboard, if dark mode needed)
Prompt construction rules:
  - Include aesthetic_direction keywords
  - Include mood_keywords
  - Include reference_style references
  - Include specific anchor dimension parameters (e.g. "round border radius", "dramatic type scale")
  - Include "web UI dashboard/landing page" ensuring output is interface not pure art
  - Include "no AI generic style, no blue-purple gradient, no Inter font" excluding homogenization
  - image_size: landscape_16_9
```

> ext enhancement results are output through visual_direction/tokens for downstream consumption, this step focuses on core logic

### Step 3: Component Library Selection and Theme Customization

**PRD Consumption Rules** (intent constraints):
- PRD defines "what functionality the product needs" (functional requirements), project-init defines "what the technical implementation is" (code implementation)
- If PRD input exists: Its functional requirements serve as **component requirements checklist** (must include all functional areas listed in PRD with corresponding components, or provide reasonable alternatives with alternative rationale noted in output), but component implementation method is decided by project-init

**Branch Decision**:

if User specified component library (shadcn/Ant Design/MUI/Element Plus etc.):
    -> Lightweight path: Customize theme based on component library
else:
    -> Full path: Plan component library from scratch

**Lightweight Path** (component library theme customization):

| Step | Content |
|------|------|
| Theme Token Mapping | Map brand colors to component library theme variables (e.g. shadcn CSS variables) |
| Theme Override | Override component library default border radius/shadows/spacing/font sizes |
| Extended Components | Identify component needs not covered by component library, plan custom components |

**Full Path** (building component library from scratch):

Plan component library using atomic design:

| Category | Typical Components | Specification Elements |
|------|---------|------|
| Atomic Components | Button/Input/Text/Icon/Divider/Box | Variants/sizes/states |
| Molecular Components | FormField/SearchBar/ListItem | Atomic combinations |
| Organism Components | Form/DataTable/Dialog | Molecular + atomic combinations |

Component reuse decision: Reuse >=3 pages -> high priority, 1-2 pages -> medium priority, single page -> page-private.

> ext-impeccable extract enhancement is called by orchestrator in subsequent stages, this step focuses on core logic. Only when project contains existing code will orchestrator call extract (brand new projects have no content to extract, skip)

### Step 4: Project Scaffold Initialization

Create project skeleton based on framework:

| Framework | Init Command | Directory Structure |
|------|-----------|---------|
| React | Vite + React + TypeScript | src/components, src/pages, src/styles, src/api, src/stores |
| Vue | Vite + Vue + TypeScript | src/components, src/views, src/styles, src/api, src/stores |
| Next.js | create-next-app --ts | app/, components/, styles/, lib/ |
| Nuxt.js | nuxi init | components/, pages/, assets/, server/ |
| Svelte | Vite + Svelte + TypeScript | src/lib/components, src/routes, src/styles |

Install core dependencies:
- Routing: react-router/vue-router/sveltekit built-in
- State management: zustand/pinia/svelte stores
- Styling solution: Based on component library selection (Tailwind/CSS Modules/Styled Components)
- HTTP client: axios/fetch wrapper

**Generate Token Files**:

- {project_dir}/src/styles/tokens.css -- CSS variables
- {project_dir}/src/styles/tokens.json -- JSON format tokens

Verify project runs: `npm run dev` starts successfully.

### Step 5: Context File Output

**Generate Context Files** (for ext-impeccable consumption):

Generate {project_dir}/PRODUCT.md:
- Product name and description
- Target user personas
- Brand tone and voice
- Product goals and core values
- Anti-references (what not to be like)
- register field (brand/product)

Generate {project_dir}/DESIGN.md:
- Visual style direction (from Step 2)
- Color strategy and theme decision
- Typography strategy
- Spatial strategy
- Visual bans
- Component library selection and theme customization description

**Language Adaptation Rules** (adjust font, font size, and line-height baseline based on target language):

| Target Language | Primary Font Recommendation | Body Font Size | Line Height Baseline | Spacing Tendency |
|----------|-----------|---------|---------|---------|
| zh-CN | Source Han Sans / LXGW WenKai | 14-16px | 1.6-1.8 | Larger |
| en-US | Per ext-frontend-design recommendation | 13-14px | 1.4-1.5 | Standard |
| ja-JP | Noto Sans JP | 14-16px | 1.7-1.8 | Larger |
| ko-KR | Noto Sans KR | 14-16px | 1.6-1.8 | Larger |
| ar-SA | Noto Sans Arabic | 14-16px | 1.6-1.8 | Larger (RTL) |

> ext enhancement results are output through visual_direction/tokens for downstream consumption, this step focuses on core logic

## Output

**Code File Output**:
- {project_dir}/ -- Complete project skeleton
- {project_dir}/PRODUCT.md -- Product context
- {project_dir}/DESIGN.md -- Design context
- {project_dir}/src/styles/tokens.css -- Design token CSS variables
- {project_dir}/src/styles/tokens.json -- Design token JSON

**Metadata Output**: output/ui-project-init/

**Output Files**: project-init.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["visual_direction", "tokens", "component_library", "scaffold", "project_dir"],
  "properties": {
    "visual_direction": {
      "type": "object",
      "description": "Visual style direction definition (10 dimensions all defined = each field non-empty and non-placeholder, see validation standards below)",
      "properties": {
        "visual_policy": {"type": "string", "enum": ["existing-design-system-first", "balanced", "differentiation-strict"], "description": "Visual strategy, default existing-design-system-first"},
        "aesthetic_direction": {"type": "string", "minLength": 10, "description": "Specific style description, e.g. 'warm organic + generous whitespace + soft rounded corners', 'TBD'/'pending' placeholders not allowed"},
        "color_strategy": {"type": "string", "enum": ["restrained", "committed", "full_palette", "drenched"]},
        "theme_decision": {"type": "string", "minLength": 15, "description": "Must include light/dark decision + physical scenario sentence, e.g. 'Light + daytime natural office light'"},
        "typography_strategy": {"type": "string", "minLength": 10, "description": "Must include heading font style + body font style + hierarchy contrast description"},
        "spatial_strategy": {"type": "string", "minLength": 10, "description": "Must include whitespace ratio + density tendency description"},
        "visual_bans": {"type": "array", "items": {"type": "string"}, "minItems": 3, "description": "At least 3 visual bans"},
        "mood_keywords": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 5, "description": "3-5 core mood words"},
        "reference_style": {"type": "string", "minLength": 5, "description": "1-2 referenceable products/design styles"},
        "tension_level": {"type": "string", "enum": ["conservative", "balanced", "bold", "extreme"]},
        "visual_narrative": {"type": "string", "minLength": 10, "description": "Page eye flow path description, e.g. 'Z-pattern reading -> focus CTA -> progressively reveal details'"},
        "border_radius_level": {"type": "string", "enum": ["sharp", "subtle", "medium", "round", "pill"], "description": "Global border radius level"},
        "shadow_style": {"type": "string", "enum": ["none", "flat", "subtle", "elevated", "dramatic"], "description": "Shadow hierarchy and style"},
        "spacing_rhythm": {"type": "string", "description": "Spacing base + rhythm pattern, e.g. 'standard+jazz'"},
        "type_scale": {"type": "string", "enum": ["modest", "standard", "strong", "dramatic"], "description": "Heading vs body font size contrast"},
        "brand_color_usage": {"type": "string", "enum": ["accent", "spotlight", "flood"], "description": "Brand color distribution pattern in pages"},
        "image_treatment": {"type": "string", "enum": ["none", "photography", "illustration", "3d", "abstract", "minimal-icon"], "description": "Visual treatment of images/illustrations"},
        "motion_style": {"type": "string", "enum": ["none", "subtle", "moderate", "expressive", "theatrical"], "description": "Interaction motion intensity and rhythm"},
        "grid_density": {"type": "string", "enum": ["sparse", "balanced", "dense"], "description": "Content area information density"},
        "moodboard_light": {"type": "string", "description": "Light mode Moodboard reference image URL"},
        "moodboard_dark": {"type": "string", "description": "Dark mode Moodboard reference image URL (optional)"},
        "anchor_overrides": {
          "type": "array",
          "description": "Page-level anchor overrides, allowing specific pages to break global visual anchors for differentiation",
          "items": {
            "type": "object",
            "required": ["page", "overrides"],
            "properties": {
              "page": {"type": "string", "description": "Page name or route path"},
              "overrides": {
                "type": "array",
                "description": "Anchor override list for this page, max 3 dimensions",
                "items": {
                  "type": "object",
                  "required": ["dimension", "global_value", "override_value", "reason", "visual_impact"],
                  "properties": {
                    "dimension": {"type": "string", "enum": ["border_radius_level", "shadow_style", "spacing_rhythm", "type_scale", "brand_color_usage", "image_treatment", "motion_style", "grid_density"], "description": "Overridden anchor dimension"},
                    "global_value": {"type": "string", "description": "Global anchor value"},
                    "override_value": {"type": "string", "description": "Page-level override value (must be within corresponding enum range)"},
                    "reason": {"type": "string", "description": "Override rationale"},
                    "visual_impact": {"type": "string", "description": "Visual impact description"}
                  }
                },
                "maxItems": 3
              }
            }
          }
        }
      }
    },
    "tokens": {
      "type": "object",
      "properties": {
        "colors": {"type": "object", "description": "Color tokens (brand/functional/neutral/semantic)"},
        "typography": {"type": "object", "description": "Typography tokens (font_families/font_sizes/font_weights/line_heights)"},
        "spacing": {"type": "object", "description": "Spacing tokens (scale array)"},
        "shadows": {"type": "object", "description": "Shadow tokens (sm/md/lg/xl)"},
        "breakpoints": {"type": "object", "description": "Breakpoint tokens (sm/md/lg/xl)"},
        "animation": {"type": "object", "description": "Animation tokens (durations/easings)"}
      }
    },
    "component_library": {
      "type": "object",
      "properties": {
        "name": {"type": "string", "description": "Component library name (shadcn/Ant Design/MUI/Element Plus/custom)"},
        "version": {"type": "string", "description": "Component library version"},
        "theme_overrides": {"type": "object", "description": "Theme override variable mapping"},
        "custom_components": {"type": "array", "items": {"type": "string"}, "description": "Custom component list needed"},
        "available_components": {"type": "array", "items": {"type": "string"}, "description": "Available component inventory"}
      }
    },
    "scaffold": {
      "type": "object",
      "properties": {
        "framework": {"type": "string", "description": "Framework (React/Vue/Svelte/Next.js/Nuxt.js)"},
        "package_manager": {"type": "string", "description": "Package manager (pnpm/npm/yarn)"},
        "dependencies": {"type": "array", "items": {"type": "string"}, "description": "Core dependency list"},
        "directory_structure": {"type": "object", "description": "Directory structure definition"},
        "dev_server_running": {"type": "boolean", "description": "Whether npm run dev starts successfully"}
      }
    },
    "project_dir": {"type": "string", "description": "Project root directory path"}
  }
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| User specified component library | Lightweight path: Customize theme |
| User did not specify component library + framework=React | Default recommendation shadcn/ui |
| User did not specify component library + framework=Vue | Default recommendation Element Plus |
| User did not specify component library + needs full customization | Full path: Build from scratch |
| Brand color contrast <4.5:1 (white background) | Auto-generate darker variant as text color |
| Color mood = Professional/Steady | Neutral color ratio >=60%, brand color accent <=20% |
| Color mood = Energetic/Warm | Brand color ratio 30%-40%, neutral color <=40% |
| Target platform = Web | Output CSS Variables + Tailwind Config |
| Target platform = Mobile | Output iOS Swift + Android Kotlin |
| Target platform = Cross-platform | Output all formats |

## Quality Checks

P0 (Must pass, blocks output if not):
- [ ] WCAG AA contrast 100% compliant (body text >=4.5:1, large text >=3:1)
- [ ] Visual direction compliant with visual_policy; under existing-design-system-first mode must not break existing design system to avoid homogenization
- [ ] Design system recommendation has been data-driven reviewed (by orchestrator calling ext-ui-ux-pro-max)
- [ ] npm run dev starts successfully

P1 (Recommended, mark as "pending fix" if not):
- [ ] Color system complete (brand + functional + neutral + semantic)
- [ ] Font size hierarchy >=6 levels
- [ ] Spacing tokens >=8 levels
- [ ] visual_direction 10 dimensions all defined
- [ ] Color enhancement applied (by orchestrator calling ext-impeccable colorize)
- [ ] Typography enhancement applied (by orchestrator calling ext-impeccable typeset)
- [ ] Dark mode derivation complete
- [ ] Component library theme customization complete
- [ ] Project skeleton files complete (package.json/tsconfig/routing/layout components)
- [ ] PRODUCT.md and DESIGN.md generated

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Brand specification missing | Generate default brand colors based on industry benchmarks | Brand colors based on industry inference, marked as "pending brand confirmation" |
| Product positioning missing | Infer color mood from brand specification | Color mood may be less precise |
| Component library preference missing | Recommend default component library based on framework | May not be user's expected component library |
| package_manager missing | Default pnpm | Package manager may not match team habits |
| PRD missing | Don't plan custom components, only configure component library theme | Component requirements pending PRD supplement |
| project_dir missing | Output to output/ directory only | Code files need manual copying |
| ext skill not deployed | Orchestrator responsible for calling; if orchestrator doesn't call, execute built-in degradation | ext enhancement effects missing, core functionality unaffected |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Positioning statement change | Brand colors, visual direction | Mark affected tokens and visual direction, recommend human confirmation |
| Brand specification change | Color system, visual direction, token generation | Mark all affected downstream outputs, recommend regenerating visual direction and tokens |
| New target platform | New platform adaptation tokens | Mark platform tokens needing addition |
| PRD change | Component requirements checklist | Mark affected component planning, assess whether custom components need supplementing |

### Downstream Notification Mechanism Table

| This Skill Output Change | Notify Downstream Skill | Notification Content | Trigger Condition |
|---------------|-------------|---------|---------|
| Visual direction change | page-builder | Aesthetic direction/color strategy/visual bans | Any visual_direction field change |
| Token change | page-builder | Affected token categories | Token value change |
| Component library change | page-builder | Component reuse relationships | Component library selection or theme change |
| PRODUCT.md/DESIGN.md change | ext-impeccable | Context file content change | PRODUCT.md or DESIGN.md content change |
