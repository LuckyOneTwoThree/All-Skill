# Stage 2: Design System Enhancement

**Prerequisite Input**: If stage-1 Conditional Branch B generated constraint_review.json, the orchestrator should pass it to stage-2's ext Skill invocation, ensuring PM constraint review findings influence design enhancement decisions (e.g., when constraint_review flags "overly restrictive component selection", the ext Skill may choose alternatives from the provided options).

## ext Skill Invocation Priority and Conflict Resolution

ext-ui-ux-pro-max and ext-frontend-design have conflicting design philosophies -- the former recommends mainstream patterns (database matching), while the latter opposes AI homogenization and pursues differentiation. The following priority rules resolve conflicts:

**Priority Rule**: ext-frontend-design > ext-ui-ux-pro-max > ext-impeccable

| Conflict Scenario | ext-ui-ux-pro-max Recommends | ext-frontend-design Prohibits | Resolution Strategy |
|----------|----------------------|------------------------|---------|
| SaaS Color Scheme | `#2563EB` (blue) | "Blue-purple gradient + white background" | Adopt ext-frontend-design's color_substitutions as replacement |
| Typography | Inter (Minimal Swiss) | Inter/Roboto/Arial | Adopt ext-frontend-design's font_substitutions as replacement |
| Layout | Standard card grid | "Uniform card grid layout" | Adopt ext-frontend-design's layout_differentiation |
| Effects | Standard shadows/rounded corners | Per specific visual_bans | ext-frontend-design's visual_bans takes priority |

**Execution Order**: First invoke ext-ui-ux-pro-max to get baseline recommendations, then invoke ext-frontend-design for differentiation corrections. ext-frontend-design's output overrides ext-ui-ux-pro-max's same-dimension recommendations.

| # | Skill | Input | Output | Validation |
|---|-------|------|------|------|
| 2.1 | ext-ui-ux-pro-max --design-system | query="{product_type} {industry} {style_keywords}"+brand specifications+visual_direction+project_name (stage-1) | Design system recommendations | >=3 color schemes + 2 font pairings |
| 2.2 | ext-impeccable colorize | Color system + brand specifications (stage-1, Mode A: run load-context.mjs) | Color layout enhancement | Color enhancement suggestions generated |
| 2.3 | ext-frontend-design | design_brief=project requirement description+register+brand specifications+product positioning+visual_direction+design_tokens+target_language+target_framework (stage-1) | Aesthetic direction review | Free of AI homogenization characteristics |
| 2.4 | ext-impeccable typeset | Typography system + visual_direction (stage-1, Mode A: run load-context.mjs) | Typography hierarchy enhancement | Typography enhancement suggestions generated |

## Mandatory Write-back Step (must execute after all of 2.1-2.4 are completed)

Enhancement suggestions produced by ext Skills must be **forcefully written back** to project-init.json, otherwise stage-3's page-builder will still consume stage-1's original tokens, causing the enhancement effect to break.

| Write-back Source | Write-back Target | Write-back Rule |
|---------|---------|---------|
| ext-ui-ux-pro-max colors[].palette | tokens.colors.brand | Replace brand color scale with the top-ranked recommended color scheme |
| ext-ui-ux-pro-max typography[].heading/body | tokens.typography.font_families | Replace heading and body fonts with the top-ranked recommended font pairing |
| ext-impeccable colorize | tokens.colors + visual_direction.color_strategy | Merge color enhancement suggestions into tokens; update strategy synchronously if changed |
| ext-impeccable typeset | tokens.typography | Merge typography enhancement suggestions into typography tokens (font-size/font-weight/line-height) |
| ext-frontend-design font_substitutions | tokens.typography.font_families | Replace item by item: avoid font -> use_instead font |
| ext-frontend-design color_substitutions | tokens.colors | Replace item by item: avoid color -> use_instead color |
| ext-frontend-design visual_bans | visual_direction.visual_bans | Append to visual bans list (do not overwrite existing items) |
| ext-frontend-design aesthetic_direction | visual_direction.aesthetic_direction | Replace aesthetic direction description |
| ext-frontend-design layout_differentiation | visual_direction.visual_narrative | Append layout differentiation strategy to visual narrative |

Write-back Execution Instructions:
```
Action: Force Write-back of ext Enhancement Results
Input:
  ext-ui-ux-pro-max output: Design system recommendations (color schemes + font pairings)
  ext-impeccable colorize output: Color enhancement suggestions
  ext-impeccable typeset output: Typography enhancement suggestions
  ext-frontend-design output: Aesthetic direction review (font substitutions + color substitutions + visual_bans + aesthetic_direction + layout_differentiation)
  project-init.json: output/ui-project-init/project-init.json
Output: Updated output/ui-project-init/project-init.json + Updated {project_dir}/src/styles/tokens.css + Updated {project_dir}/src/styles/tokens.json + Updated {project_dir}/DESIGN.md
Validation: project-init.json's tokens and visual_direction include ext enhancement results, tokens.css/tokens.json synchronously updated, DESIGN.md synchronously updated
Mode: AI
```

## Write-back Validation Step (must execute after write-back is complete)

| # | Validation Item | Validation Method | Failure Handling |
|---|--------|---------|---------|
| V1 | project-init.json syntax is correct | JSON parsing without errors | Roll back write-back, use original tokens |
| V2 | WCAG contrast still compliant | Body text >=4.5:1, large text >=3:1 | Adjust enhanced color values until compliant |
| V3 | tokens.css and tokens.json are in sync | Both contain the same variable names and values | Regenerate tokens.css based on tokens.json |
| V4 | No new hardcoded values | Enhanced token values are all variable references | Remove hardcoded values and replace with variable references |
| V5 | visual_direction semantic consistency | aesthetic_direction does not contradict tension_level | Flag contradictory items, [GATE] Human confirmation required |

## Page Manifest Pre-generation (must execute before design_brief generation)

The layout_instructions/component_specifications/animation_specifications in design_brief.json all contain a page_id field, which must be consistent with the page_id in page_manifest.json. Therefore, page_manifest.json must be generated before design_brief.json.

```
Action: Page Manifest Pre-generation
Trigger Condition: Always execute (before design_brief generation)
Input:
  prd_json: output/pm-design/design-prd/prd.json (optional)
  ia_proposals: output/pm-design/design-ia/ia_proposals.json (optional)
  Page requirements: Provided by user (string/markdown, used when no PM input)
Process:
  1. If prd.json exists: Extract page manifest from pages[]
  2. If ia_proposals.json exists: Extract route manifest from routes[]
  3. Cross-validate both; use prd.json as authoritative source for inconsistencies
  4. If neither exists: Extract from user page requirement description, assign page_id (slug format)
  5. Generate page_manifest.json
Output: output/ui-frontend/page-manifest/page_manifest.json
Validation: page_manifest.json generated
Mode: AI (without PM input -> AI->Human, human confirmation required for page manifest completeness)
```

## Design Brief Generation

After write-back is complete, integrate all ext Skill outputs into `design_brief.json` -- an executable design specification that directly guides page-builder code generation. Schema definition: [schemas/design-brief.json](../schemas/design-brief.json).

```
Action: Design Brief Generation
Input:
  ext-frontend-design output: aesthetic_direction/font_substitutions/color_substitutions/layout_differentiation/visual_bans
  ext-ui-ux-pro-max output: Design system recommendations (color schemes/font pairings/effects/anti-patterns)
  ext-impeccable colorize output: Color enhancement suggestions
  ext-impeccable typeset output: Typography enhancement suggestions
  project-init.json: visual_direction + tokens (enhanced version)
  Brand specifications: Provided by user
Output: output/ui-frontend/design-brief/design_brief.json
Mode: AI
```

[GATE] Human confirmation required for design system enhancement results (including final tokens and visual direction after write-back)
