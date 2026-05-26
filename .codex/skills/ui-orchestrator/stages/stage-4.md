# Stage 4: Page Enhancement + Quality Audit

**Stage Merge Note**: v7.0 merges the original Stage 4 (Page Enhancement) and Stage 5 (Quality Audit) into a single stage. ext-frontend-design is removed from this stage (already invoked in Stage 2, output consumed via design_brief.json), reducing duplicate invocations.

## Visual Review Result Consumption (v7.2 New)

The mandatory visual review after stage-3 completion produces `visual_review_result` (persisted path: `output/ui-frontend/visual-review/visual_review_result.json`), containing 5-dimension scores (overall visual impression / brand consistency / color harmony / typography rhythm / layout breathing room, each rated 1-5). stage-4 must consume this result, using low-scoring dimensions (<=2) as priority fix items for ext invocations. During checkpoint resumption, read from file; during non-resume execution, inline-passed data may be used.

**Consumption Rules**:

| Low-Scoring Dimension | Priority ext Sub-command | Fix Direction |
|----------|---------------------|---------|
| Overall visual impression <=2 | ext-impeccable bolder | Enhance visual impact |
| Brand consistency <=2 | ext-impeccable colorize | Adjust color strategy to align with brand tone |
| Color harmony <=2 | ext-impeccable colorize | Optimize color pairing and layering |
| Typography rhythm <=2 | ext-impeccable typeset | Improve font size hierarchy and rhythm |
| Layout breathing room <=2 | ext-impeccable layout adapt | Adjust whitespace and information density |

**Consumption Flow**:
1. Read dimensions scored <=2 in visual_review_result
2. Inject fix directions for low-scoring dimensions into inputs for 4.1/4.2/4.5 as priority focus items
3. If no low-scoring dimensions, ext invocations execute in normal flow
4. Fix closure (4.8) additionally validates whether low-scoring dimensions have improved (compare code before and after fixes)

## ext Invocation Dependency Graph (must execute in dependency order)

```
4.1 ext-ui-ux-pro-max ──┐
4.2 ext-impeccable layout ─┤ No dependency, can run in parallel
                          ├──-> 4.3 ext-impeccable shape ──-> 4.4 ext-interaction-design
                          │
4.5 ext-impeccable {clarify|onboard|distill} (No dependency, can run in parallel with 4.1/4.2)
                          │
                          └──-> 4.6 ext-impeccable audit (depends on 4.3+4.4+4.5) ──-> 4.7 ext-impeccable critique ──-> 4.8 Fix closure
```

| # | Skill | Input | Output | Validation | Dependency | Notes |
|---|-------|------|------|------|------|------|
| 4.1 | ext-ui-ux-pro-max --domain {landing/dashboard/general} | query="{product_type} {industry}"+page structure+industry keywords (stage-3/collection) | Page structure recommendations | Recommendations generated | None | |
| 4.2 | ext-impeccable layout adapt | Page layout + visual rhythm (stage-3, Mode A: run load-context.mjs) | Layout optimization + responsive adaptation | Layout enhancement generated | None | |
| 4.3 | ext-impeccable shape | Component specifications (stage-3, Mode A: run load-context.mjs) | State machines + interaction flows | Shape planning generated | 4.1, 4.2 | Purely static atomic components may be skipped |
| 4.4 | ext-interaction-design | interaction_needs+register+visual_direction+design_tokens+target_framework+state machines (stage-3/4.3) | Interaction animation patterns | Interaction patterns generated | 4.3 | Purely static with no interactions may be skipped; if design_brief.animation_specifications exists, output must not conflict (conflicts resolved using design_brief as authoritative) |
| 4.5 | ext-impeccable {clarify\|onboard\|distill} | Page code (stage-3, Mode A: run load-context.mjs) | UX copy optimization + simplification | Optimization suggestions generated | None | Forms/empty states/errors -> clarify, homepage/registration -> onboard, components>10 -> distill |
| 4.6 | ext-impeccable audit | All code (stage-3, Mode A: run load-context.mjs) | Technical quality score + issue list | audit_percent>=75 | 4.3, 4.4, 4.5 | Percentage scale |
| 4.7 | ext-impeccable critique | All code + audit report (4.6, Mode A: run load-context.mjs) | Design taste score + fix suggestions | critique_percent>=70 | 4.6 | Percentage scale, always execute |
| 4.8 | Fix closure | audit + critique issue lists (4.6+4.7) | Fixed code | quality_score>=75 | 4.7 | Maximum 3 closure iterations |

## Unified Scoring System

ext-impeccable's audit (technical quality, originally 20-point scale) and critique (design taste, originally 40-point scale) are uniformly converted to a percentage scale.

| Scoring Dimension | Original Scale | Percentage Conversion | Evaluation Content |
|----------|---------|-----------|---------|
| audit (Technical Quality) | 0-20 | x5 -> 0-100 | A11y/Perf/Theming/Responsive/AntiPatterns |
| critique (Design Taste) | 0-40 | x2.5 -> 0-100 | Nielsen 10 heuristics + Design aesthetics evaluation |

**critique Scoring Dimension Expansion** (v7.2):

The original critique only used Nielsen 10 heuristics (usability-focused). v7.2 expands the evaluation scope to a "usability + aesthetics" dual dimension. ext-impeccable critique still outputs a single percentage score, but the evaluation must cover both dimensions:

| Dimension | Evaluation Content |
|------|---------|
| Usability (Nielsen Heuristics) | Visibility/Feedback/Consistency/Error prevention/Efficiency/Cognition/Flexibility/Aesthetics(Minimalism)/Error recovery/Help |
| Design Aesthetics | Visual hierarchy/Color harmony/Typography rhythm/Whitespace usage/Brand expressiveness/Differentiation level |

> **Note**: Nielsen heuristic #8 "Aesthetic and Minimalist Design" overlaps with the design aesthetics dimension, but in the expanded evaluation, the aesthetics dimension more deeply evaluates visual expressiveness (not just "minimalism"), brand expressiveness (not just "consistency"), and differentiation level (not just "industry standards").

**visual_review_result Integration** (v7.2 New):

When stage-3's visual review has low-scoring dimensions (<=2), the critique score must additionally verify improvement of low-scoring dimensions. If low-scoring dimensions remain unimproved after enhancement, critique_percent should be deducted accordingly (5 points per unimproved low-scoring dimension, maximum deduction of 15 points).

**critique Score Calculation**:
- No low-scoring dimensions: `critique_percent = ext-impeccable critique raw percentage score`
- With low-scoring dimensions: `critique_percent = ext-impeccable critique raw percentage score - (number of unimproved dimensions x 5)` (minimum 0)

**Composite Quality Score**: `quality_score = audit_percent x 0.5 + critique_percent x 0.5`

**Scoring Weight Adjustment Note** (v7.2): The original weights of auditx0.6 + critiquex0.4 were biased toward technical quality, allowing technically perfect but design-mediocre pages to pass the gate. Adjusted to 50:50 balanced weights, ensuring design taste and technical quality are equally important.

**Per-Dimension Minimum Threshold** (preventing imbalance):

| Dimension | Minimum Threshold | Below Threshold Handling |
|------|---------|-------------|
| audit_percent | >=60 | Flag "technical quality imbalance", [GATE] Human confirmation required |
| critique_percent | >=55 | Flag "design taste imbalance", [GATE] Human confirmation required |

## design_brief Consistency Guard

Stage 4's ext enhancements directly modify code, potentially deviating from the design specifications established by design_brief.json in Stage 2. The following rules ensure enhancements do not break established consistency:

**Consistency Constraints** (all ext enhancements must comply):

| Constraint Dimension | design_brief Field | Stage 4 Enhancement Rule | Violation Determination |
|----------|------------------|-----------------|---------|
| Color Specification | color_specifications | Enhanced color values must fall within the color scale defined by design_brief.color_specifications | Color values not defined in design_brief appear |
| Typography Specification | typography_specifications | Enhanced font sizes/weights must fall within the hierarchy defined by design_brief.type_scale_values | Font sizes or weights not defined in design_brief appear |
| Brand Color Strategy | brand_color_strategy | Enhanced brand color distribution must conform to usage_mode and target_percentage | Brand color proportion deviates from target_percentage by more than +/-10% |
| Visual Bans | visual_bans | Enhanced code must absolutely not contain patterns from visual_bans | Patterns listed in visual_bans appear |
| Differentiation Direction | differentiation_direction | Enhancement must not pull the differentiation direction back toward homogenization (e.g., bolder must not be fully offset by quieter) | Enhanced code exhibits homogenization characteristics that design_brief explicitly opposes |

**Enhancement Modification Traceability Rules**:
- At stage-4 startup, **must read** existing quality_debt.json entries from stage-3, injecting debt summaries into ext invocation inputs (e.g., ext-impeccable colorize's input should include debt context like "known color token reference rate insufficient")
- After each ext sub-command modifies code, must record a modification summary to quality_debt.json (format: `{id, stage: "stage-4", description: "ext-{sub-command} modified {specific content}", severity, status: "applied"}`)
- Fix closure (4.8) additionally validates whether stage-3 inherited quality_debt entries have improved
- Audit check additionally validates design_brief consistency constraints; violations are flagged as P0 issues

## Closure Rules

- Each closure iteration: Fix issues found by audit and critique -> re-run audit+critique -> calculate quality_score
- Maximum 3 closure iterations
- After 3 iterations, quality_score still <75: Flag "pending human confirmation", [GATE] Human decides to approve or continue fixing
- quality_score>=75 but individual audit_percent<60 or critique_percent<55: Flag "imbalance risk", [GATE] Human confirmation required

## ext-impeccable Degradation Plan

When ext-impeccable is not deployed or invocation fails, audit/critique cannot execute, and quality_score uses page-builder's built-in self-assessment score as a fallback:

| Scoring Method | Calculation Formula | Gate Threshold | Applicable Scenario |
|----------|---------|-----------|---------|
| Standard Scoring | audit_percent x 0.5 + critique_percent x 0.5 | >=75 | ext-impeccable deployed and invocation successful |
| Degraded Scoring | Built-in self-assessment score (page-builder aesthetic_score) | >=60 | ext-impeccable not deployed or invocation failed |

**Built-in Self-Assessment Score Dimensions**:
- WCAG AA contrast compliance rate (weight 30%)
- Token reference rate (weight 25%)
- Responsive breakpoint coverage (weight 20%)
- Component state coverage (weight 15%)
- Visual rhythm consistency (weight 10%)

Degraded scoring must be recorded in quality_debt.json (severity: medium, description: "Quality audit using built-in self-assessment as fallback for ext-impeccable audit/critique").
