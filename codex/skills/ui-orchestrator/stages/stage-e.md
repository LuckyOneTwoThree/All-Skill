# Stage-E: Express Generation (Express Mode Only)

Executed only when `mode=express`. Selects the corresponding ext Skill based on the `express_engine` parameter, directly reads the PRD and brand specifications, generates complete page code in one step, skipping the full design system establishment, token generation, and enhancement-audit cycle.

## Lightweight Design Anchor (v7.2 New)

Express mode skips stage-1's full design system establishment, but **cannot completely skip design constraints** -- unconstrained ext invocations produce random and uncontrollable quality. Therefore, before ext Skill invocation, the orchestrator generates a lightweight design anchor (express_design_anchor), providing minimal design direction guidance for the ext Skill.

```
Action: Generate Lightweight Design Anchor
Trigger Condition: mode=express, before ext Skill invocation
Input:
  prd_text: PRD description
  Brand specifications: Provided by user (optional)
  Product positioning: Provided by user (optional)
  express_engine: visual/ux/polish/motion
Process:
  1. Infer register from PRD (brand/product)
  2. Infer color direction from PRD + brand specifications (warm/cool/neutral + primary hue)
  3. Infer typography direction from PRD (display/functional)
  4. Infer design focus from express_engine (see table below)
  5. Generate express_design_anchor (inline JSON, not written to file)
Output: express_design_anchor (passed to ext Skill's inline_context parameter)
Validation: anchor contains register + color_direction + typography_direction + design_focus
Mode: AI
```

**express_design_anchor Structure**:

```json
{
  "register": "brand | product",
  "color_direction": {
    "temperature": "warm | cool | neutral",
    "primary_hue": "amber | teal | rose | indigo | emerald | slate",
    "avoid": ["blue-purple gradient", "generic gray", "pure black on white"],
    "brand_colors": ["Brand color values provided or inferred by user"]
  },
  "typography_direction": {
    "style": "display-dramatic | clean-functional | editorial | geometric",
    "avoid": ["Inter as primary", "system-ui as only font"],
    "heading_scale": "large-contrast | moderate | compact"
  },
  "layout_direction": {
    "approach": "asymmetric-hero | sidebar-main | fullscreen-cta | card-grid | editorial-flow",
    "avoid": ["identical card grids", "centered everything", "cookie-cutter sections"],
    "whitespace": "generous | moderate | compact"
  },
  "design_focus": "Visual differentiation | UX best practices | Quality polish | Interaction animation",
  "visual_bans": ["Inter/Roboto as primary font", "blue-purple gradient", "identical card grid", "generic AI aesthetic"]
}
```

**Design Focus Mapping**:

| express_engine | design_focus | Additional Anchor Constraints |
|----------------|-------------|-------------|
| `visual` | Visual differentiation | color_direction.primary_hue must not be blue-purple; layout_direction.approach must not be card-grid |
| `ux` | UX best practices | typography_direction.style=clean-functional; layout_direction.whitespace=generous |
| `polish` | Quality polish | All avoid lists expanded to ext-impeccable's full anti-patterns |
| `motion` | Interaction animation | layout_direction.approach prioritizes layouts with animation space (asymmetric-hero/editorial-flow) |

## Design Direction Quick Selection (v7.3 New)

The quality of express mode's auto prompt depends on the precision of the orchestrator-generated prompt. v7.3 adds a **Design Direction Quick Selection** step after anchor generation and before ext Skill invocation: the orchestrator generates 2-3 differentiated design direction descriptions, the user quickly selects one, and the orchestrator generates a high-quality structured prompt based on the selected direction.

**Why Quick Selection is Needed**:
- In single-scheme auto mode, users have zero control over design direction, and output quality is random
- Quick selection adds 1 decision point (~1-2 minutes) but significantly improves design direction hit rate and user satisfaction
- Corresponds to the full mode's "Design Exploration -> Human Selection" flow, with the express version being more lightweight (direction descriptions rather than complete visual directions)

```
Action: Design Direction Quick Selection
Trigger Condition: mode=express, express_prompt_source=auto, after anchor generation
Input:
  express_design_anchor: Generated lightweight design anchor
  prd_text: PRD description
  Brand specifications: Provided by user (optional)
  express_engine: visual/ux/polish/motion
Process:
  1. Generate 2-3 differentiated design directions based on anchor (each ~100-200 words, no code generated)
  2. Directions must have clear differences (different color temperatures/different layouts/different typography styles, at least 2 dimensions different)
  3. [GATE] User quick selection: Choose 1 direction, or merge features from multiple directions
  4. Write selected direction back to express_design_anchor's corresponding fields
Output: Updated express_design_anchor (user-confirmed design direction)
Validation: User has selected a design direction
Mode: AI->Human
```

**Design Direction Description Structure**:

```json
{
  "schemes": [
    {
      "id": "A",
      "name": "Direction name (2-4 characters, e.g., 'Warm Organic')",
      "description": "Design direction description (100-200 words, including color theme + font combination + layout strategy + core visual characteristics)",
      "color_preview": ["Primary color CSS value", "Secondary color CSS value", "Background color CSS value"],
      "layout_hint": "asymmetric-hero | sidebar-main | fullscreen-cta | editorial-flow",
      "typography_hint": "display-dramatic | editorial | clean-functional | geometric",
      "keywords": ["Keyword 1", "Keyword 2", "Keyword 3"]
    }
  ]
}
```

**Direction Differentiation Rules** (must be satisfied between 2-3 directions):

| Dimension | Differentiation Requirement | Example |
|------|---------|------|
| Color Temperature | At least 2 directions with different color temperatures | A=warm (amber/rose), B=cool (teal/slate) |
| Layout | At least 2 directions with different layouts | A=asymmetric-hero, B=fullscreen-cta |
| Typography | At least 2 directions with different typography styles | A=display-dramatic, B=clean-functional |
| Tension | At least 2 directions with different tension levels | A=bold, B=balanced |

**Engine Influence on Directions**:

| express_engine | Direction Generation Focus | Direction Differentiation Dimension Priority |
|----------------|------------|------------------|
| `visual` | Visual impact + differentiation | Color temperature > Layout > Typography |
| `ux` | Functionality + information architecture | Layout > Typography > Color temperature |
| `polish` | Completeness + detail quality | Typography > Color temperature > Layout |
| `motion` | Animation space + interaction narrative | Layout > Color temperature > Typography |

**Post-Selection Processing**:
- Select single direction: Write that direction's color_preview/layout_hint/typography_hint back to express_design_anchor
- Merge multiple directions: User specifies which features to merge (e.g., "A's color temperature + B's layout"), orchestrator merges and writes back
- Skip quick selection: User may skip directly, using the anchor's default direction (equivalent to v7.2 behavior)

## Structured Prompt Generation (v7.3 New)

The original auto mode prompt was a simple concatenation (PRD + brand specifications + anchor), which was low quality and lacked structure. v7.3 upgrades to a **structured prompt**, based on the user-selected design direction + PRD + anchor, generating a precise, complete prompt that directly guides ext Skill output.

**Structured Prompt Template**:

```
Design a {page_type} with these specific requirements:

Register: {register} ({register_explanation})

Aesthetic Direction: {selected_scheme.description}
Primary Color: {color_preview[0]} ({color_name})
Secondary Color: {color_preview[1]}
Background: {color_preview[2]}
Heading Font: {typography_heading} ({typography_style})
Body Font: {typography_body}
Layout: {layout_hint} ({layout_description})

Visual Bans (MUST NOT appear):
{visual_bans_list}

Tension Level: {tension_level}
Design Focus: {design_focus}

Feature Requirements:
{prd_feature_list}

Target Framework: {target_framework}
Target Language: {target_language}

Constraints:
- All colors must use the specified palette, no random colors
- All fonts must match the specified typography direction
- Layout must follow the specified approach
- Must pass WCAG AA contrast (4.5:1 for body text)
- Must be responsive (375px/768px/1024px)
```

**Prompt Quality Assurance Rules**:

| Rule | Description |
|------|------|
| Color Value Concretization | Colors in the prompt must use specific CSS values (oklch/hex), not vague descriptions like "warm colors" |
| Font Concretization | Fonts in the prompt must specify concrete font names, not vague descriptions like "display font" |
| Layout Concretization | Layout in the prompt must specify concrete layout patterns, not vague descriptions like "creative layout" |
| Bans Explicitization | visual_bans listed item by item, not vague descriptions like "avoid AI homogenization" |
| Feature Requirements Structured | Feature requirements extracted from PRD listed item by item, not using entire PRD text blocks |
| Anchor Consistency | All design parameters in the prompt must be consistent with express_design_anchor (including quick selection updates) |

**Manual Mode Prompt Enhancement**:

In manual mode, the user provides their own prompt, but the orchestrator still appends express_design_anchor as design constraints to the end of the user prompt:

```
{User-provided prompt}

--- Design Constraints (auto-appended) ---
Register: {register}
Primary Color: {color_preview[0]}
Visual Bans: {visual_bans_list}
Layout Direction: {layout_hint}
```

## Engine->Skill Mapping

| express_engine | Invoked ext Skill | Input Adaptation |
|----------------|-----------------|---------|
| `visual` | ext-frontend-design | design_brief=structured prompt + register + brand specifications + product_positioning + target_language + target_framework + express_design_anchor |
| `ux` | ext-ui-ux-pro-max | query="{product_type} {industry} {style_keywords}" + --domain {landing/dashboard/general} + structured prompt + industry keywords + project_name + express_design_anchor |
| `polish` | ext-impeccable | Mode B inline context: register + product name + product positioning + brand specifications + structured prompt + target language + express_design_anchor |
| `motion` | ext-interaction-design | interaction_needs=structured prompt + register + interaction requirement description + target_framework + express_design_anchor |

**Polish Engine (ext-impeccable) Inline Context Notes**:

Express mode does not generate PRODUCT.md/DESIGN.md, so ext-impeccable's Mode B (Inline Context) must be used. The orchestrator must construct the following inline context to pass to ext-impeccable:
- `register`: Product core characteristics extracted from PRD description
- Product name: Obtained from project information collection phase (project_name)
- Product positioning: Obtained from project information collection phase (optional, inferred from PRD if missing)
- Brand specifications: Obtained from project information collection phase (optional, marked as "pending brand specification supplement" if missing)
- Current step output: Structured prompt (v7.3 upgrade, replacing original PRD text description)
- Target language: Obtained from project information collection phase (default zh-CN)
- `express_design_anchor`: Lightweight design anchor (including design direction after quick selection updates)

When brand specifications or product positioning are missing, the orchestrator should prompt the user to provide them, or automatically infer from PRD text.

## Express Generation Flow

```
Action: Express Generation
Trigger Condition: mode=express
Input:
  prd_text: output/pm-design/design-prd/prd.md (optional) or user direct description
  Brand specifications: Provided by user (optional)
  Product positioning: Provided by user (optional)
  target_framework: React/Vue/Svelte/HTML (default React)
  target_language: Target language (default zh-CN)
  project_dir: Project root directory
  express_engine: visual/ux/polish/motion (default visual)
  express_prompt_source: auto/manual (default auto)
  express_prompt: User-written or externally sourced prompt (required only in manual mode)
  express_skip_scheme: true/false (default false, skip design direction quick selection and use anchor default direction)
Process:
  1. Generate lightweight design anchor (express_design_anchor)
  2. Determine subsequent flow based on express_prompt_source:
     - auto:
       a. If express_skip_scheme=false: Generate 2-3 design directions -> [GATE] User quick selection -> Update anchor
       b. If express_skip_scheme=true: Skip quick selection, use anchor default direction
       c. Generate structured prompt based on selected direction + PRD + anchor
       d. Select corresponding ext Skill based on express_engine
       e. Pass structured prompt + express_design_anchor to ext Skill
     - manual:
       a. Orchestrator prompts user to visit recommended external tool websites (e.g., v0.dev/Bolt/Lovable/Cursor/Framer etc.)
       b. User obtains/writes prompt and fills in express_prompt
       c. Orchestrator passes user prompt + express_design_anchor constraints to ext Skill
  3. Invoke selected ext Skill, directly output complete page code
  4. Write code to {project_dir}/src/
  5. Initialize minimal project scaffold (package.json + entry file + basic configuration)
  6. Execute enhanced quality check (see below)
Output:
  {project_dir}/ -- Runnable project (including page code)
Validation: Page code generated + WCAG AA compliant + No hardcoded secrets + npm run dev starts successfully + visual_bans compliant + Design anchor consistent
Mode: AI->Human->AI (auto: Generate directions -> User quick selection -> Generate code) / AI->Human->AI (manual: Prompt user -> User fills prompt -> Continue execution)
```

## Enhanced Quality Check (v7.2 Upgrade)

The original minimal quality check had only 3 items (WCAG AA + No secrets + Runnable), which did not cover design quality. Upgraded to 5 items:

| # | Check Item | Check Method | Failure Handling |
|---|--------|---------|-----------|
| 1 | WCAG AA contrast (body text >=4.5:1) | Automatic check | Auto-fix: Adjust text color until compliant |
| 2 | No hardcoded secrets/tokens | Automatic check | Auto-remove |
| 3 | npm run dev starts successfully | Automatic check | Auto-fix dependencies and configuration |
| 4 | **visual_bans compliance** | Check if code contains patterns from express_design_anchor.visual_bans | Auto-replace: Inter->DM Sans, blue-purple gradient->anchor primary hue gradient, card-grid->anchor layout |
| 5 | **Design anchor consistency** | Check if colors/typography are consistent with express_design_anchor direction | Flag deviations, suggest human confirmation |

> **Note**: Checks 4 and 5 are lightweight design quality assurances, not equivalent to full mode's audit/critique, but can prevent the worst case of "AI homogenization".

**Manual Mode Timeout/Fallback Rules**:
- After the orchestrator prompts the user to visit external tools, it waits for the user to fill in `express_prompt`
- If the user indicates they cannot obtain a prompt, the orchestrator provides two options:
  1. Switch to `auto` mode (orchestrator auto-generates prompt, including design direction quick selection)
  2. Cancel express mode, switch to `full` mode to execute the complete flow

**Express Mode Limitations**:
- Does not generate design tokens, visual_direction, design_brief.json
- Does not go through ext-impeccable enhancement/audit
- Does not support design_feedback propagation
- Does not support quality_debt tracking
- If subsequent API integration or production readiness is needed, must switch to full mode to re-execute
