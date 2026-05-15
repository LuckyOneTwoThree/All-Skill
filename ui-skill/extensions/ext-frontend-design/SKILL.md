---
name: ext-frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

## Register Awareness

Every design task operates in one of two registers, which fundamentally changes the design approach:

| Register | Meaning | Design Law | Typical Scenarios |
|----------|---------|-----------|-------------------|
| brand | Design IS the product | Bold, unique, memorable | Creative agencies, portfolios, brand websites, campaigns |
| product | Design SERVES the product | Clear, efficient, trustworthy | SaaS tools, e-commerce, admin dashboards |

**Register determination** (first match wins):
1. Explicit `register` field in input
2. Cue in the task itself ("landing page" → brand; "dashboard" → product)
3. Surface in focus (the page, file, or route being worked on)
4. Default: product

**Register-specific behavior**:

| Aspect | brand | product |
|--------|-------|---------|
| Aesthetic ambition | Extreme, polarizing, unforgettable | Distinctive but restrained, professional |
| Color commitment | Committed / Drenched preferred | Restrained / Committed preferred |
| Typography | Display fonts, dramatic scale contrast | Refined body fonts, moderate contrast |
| Layout | Asymmetric, grid-breaking, unexpected | Clean hierarchy, purposeful asymmetry |
| Motion | Choreographed, dramatic reveals | Subtle, functional transitions |
| Risk tolerance | High — safe is failure | Moderate — clarity over spectacle |

## Input Contract

When called by ui-orchestrator (on behalf of project-init / page-builder), accept the following structured input:

| Input Field | Type | Required | Description |
|-------------|------|----------|-------------|
| design_brief | string | yes | What to design: component intent, page type, or feature description |
| register | string | yes | "brand" or "product" |
| brand_spec | object | no | Brand guidelines: colors, fonts, style guide |
| product_positioning | string | no | Product positioning statement |
| visual_direction | object | no | Current visual_direction (aesthetic_direction, color_strategy, mood_keywords, tension_level, visual_narrative, visual_bans) |
| design_tokens | object | no | Current design tokens (colors, typography, spacing) |
| target_language | string | no | Target UI language (default: en-US) |
| target_framework | string | no | React / Vue / Svelte / HTML |
| inline_context | string | no | Inline context when PRODUCT.md/DESIGN.md are not yet available (passed by project-init Step 1-2, contains register + product name + positioning + brand spec + current step output + target language) |

When invoked directly by users (not via core Skill), the input is free-form: describe what you want built.

## Output Contract

When called by ui-orchestrator, MUST return structured output in the following schema:

```json
{
  "type": "object",
  "required": ["aesthetic_direction", "font_substitutions", "color_substitutions", "layout_differentiation", "visual_bans", "differentiation_summary"],
  "properties": {
    "aesthetic_direction": {
      "type": "string",
      "description": "Specific aesthetic direction description (e.g., 'Warm organic + generous whitespace + soft rounded corners')"
    },
    "font_substitutions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "avoid": {"type": "string", "description": "Font to avoid (e.g., 'Inter')"},
          "use_instead": {"type": "string", "description": "Recommended replacement (e.g., 'DM Sans')"},
          "reason": {"type": "string", "description": "Why this substitution improves distinctiveness"}
        }
      }
    },
    "color_substitutions": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "avoid": {"type": "string", "description": "Color pattern to avoid (e.g., 'blue-purple gradient')"},
          "use_instead": {"type": "string", "description": "Recommended replacement (e.g., 'warm amber accent on tinted neutrals')"},
          "reason": {"type": "string", "description": "Why this substitution improves distinctiveness"}
        }
      }
    },
    "layout_differentiation": {
      "type": "string",
      "description": "Specific layout differentiation strategy (e.g., 'Asymmetric hero with diagonal flow instead of centered card grid')"
    },
    "visual_bans": {
      "type": "array",
      "items": {"type": "string"},
      "description": "Patterns that must NOT appear in the design (e.g., 'Identical card grids', 'Side-stripe borders', 'Inter font')"
    },
    "differentiation_summary": {
      "type": "string",
      "description": "One-sentence summary of what makes this design distinctive and memorable"
    }
  }
}
```

**Consumer mapping** (how core Skills consume this output, dispatched by ui-orchestrator):

| Output Field | Consumer | Mapping |
|---|---|---|
| font_substitutions[*].avoid | project-init / page-builder | Append "禁止使用{font}" to visual_direction.visual_bans |
| color_substitutions[*].avoid | project-init / page-builder | Append the avoided pattern to visual_direction.visual_bans |
| layout_differentiation | project-init / page-builder | Append to visual_direction.aesthetic_direction |
| visual_bans[*] | project-init / page-builder | Append to visual_direction.visual_bans |
| aesthetic_direction | project-init | Use as visual_direction.aesthetic_direction value |

## Verification Criteria

Core Skills verify ext-frontend-design output against these criteria (dispatched by ui-orchestrator):

| Criterion | Check |
|-----------|-------|
| No AI-homogenized fonts | font_substitutions does not recommend Inter, Roboto, Arial, or system-ui |
| No AI-homogenized colors | color_substitutions does not recommend blue-purple gradients on white |
| No AI-homogenized layouts | layout_differentiation does not suggest identical card grids |
| Register alignment | Output ambition matches register (brand=bold, product=restrained) |
| visual_bans non-empty | At least 3 items in visual_bans array |
| Substitution feasibility | Recommended fonts are real, available on Google Fonts or system |

## Degradation Strategy

| Scenario | Behavior |
|----------|----------|
| ext-frontend-design not deployed | Skip, annotate "视觉差异化待 ext-frontend-design 支持", do not block |
| ext-frontend-design call fails | Execute degradation: apply built-in anti-AI-homogenization rules (avoid Inter/Roboto/blue-purple gradients/card grids), annotate "视觉差异化使用内置降级规则" |
| Output fails verification | Re-request once with specific failure reasons; if still fails, use partial output + annotate failed criteria |

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
