---
name: skill-finder
description: "Use when needing to find the right Skill to solve a problem. Index-driven two-phase matching that intelligently recommends the best-matching Skill from 122 Skills. Supports natural language intent recognition, synonym expansion, and context-aware recommendations. Keywords: find Skill, recommend Skill, which Skill to use, skill recommendation, Skill matching, Skill search."
metadata:
  module: "Cross-domain Coordination"
  sub-module: "Skill Discovery"
  type: "guide"
  version: "1.0"
  trigger_examples:
    - "I don't know which Skill to use"
    - "Recommend a suitable Skill for me"
    - "What Skill should I use for competitor analysis"
    - "How to solve low user retention"
    - "How to build a product from 0 to 1"
    - "How to investigate data anomalies"
---

# Skill Finder -- Universal Skill Discovery & Recommendation

## Core Principles

1. **Index-Driven Two-phase Matching**: First query compact CSV index (Phase 1), then load complete SKILL.md on demand (Phase 2), avoiding full scan token waste
2. **Five-dimensional Scoring + Dynamic Weights**: domain/lifecycle/trigger/keyword/type five dimensions scoring, dynamically adjusting weights based on intent clarity
3. **Semantic Expansion Fallback**: synonym-map handles negative expressions, colloquialisms, industry jargon and other user-perspective expressions
4. **Context Awareness**: Detect output/ directory to infer project stage, improving recommendation relevance
5. **Recommendation is Routing**: Recommendation results directly point to executable Skill paths

## Execution Steps

### Phase 1: Index Matching (~9.5k tokens)

**Load Index Files** (by priority from high to low, all located in `index/` directory):

| File | Purpose | Size |
|------|------|------|
| `index/skill-index.csv` | 122 Skills core index | ~6.5k tk |
| `index/synonym-map.csv` | Synonym/negative expression mapping | ~0.7k tk |
| `index/domain-lifecycle-map.csv` | Domain-lifecycle mapping | ~0.3k tk |
| `index/execution-templates.csv` | Common scenario execution sequences | ~0.3k tk |
| `index/skill-relationships.csv` | Inter-Skill orchestration/data contract relationships | ~2.6k tk |

#### Step 1: Synonym Expansion [Core]

Read `index/synonym-map.csv`, mapping non-standard expressions in user input to standard trigger words and domains:

```
User input -> Scan synonym-map.csv user_expression column
  Match found -> Expand to mapped_trigger + mapped_domain
  No match -> Keep original input
```

**Matching Rules**:
- Negative expressions auto-flipped: "users not active" -> "retention decline/user churn" + domain=growth
- Colloquial mapping: "do competitor analysis" -> "competitor research/competitive analysis" + domain=strategy
- Industry jargon mapping: "DAU dropped" -> "DAU decline/user churn" + domain=growth

#### Step 2: Five-dimensional Scoring [Core]

Calculate match score for each Skill in `index/skill-index.csv`:

| Dimension | Weight (Clear Intent) | Weight (Vague Intent) | Matching Rule |
|------|-------------|-------------|---------|
| **trigger** | +3 | +2 | User input contains any phrase from trigger_examples |
| **domain** | +2 | +3 | User intent matches skill's domain field |
| **lifecycle** | +2 | +2 | User's product stage matches skill's lifecycle |
| **keyword** | +2 | +1 | User input contains any keyword from keywords |
| **type** | +1 | +1 | Priority: guide=0 > orchestrator=1 > pipeline=2 (score = 3-type_order) |

**Intent Clarity Determination**:
- Clear intent: User mentions specific operations/tools/deliverables (e.g., "write PRD", "do funnel analysis", "design API")
- Vague intent: User only describes problems/states (e.g., "data is bad", "nobody uses it", "growth is slow")

**Calculation Method**:
```
score = trigger_match * trigger_w
      + domain_match * domain_w
      + lifecycle_match * lifecycle_w
      + keyword_match * keyword_w
      + type_score * type_w
```

Where match=1 (hit) or 0 (miss), type_score=3-type_order.

#### Step 3: Context Enhancement (Optional) [Core]

Detect `output/` directory under user's project directory:

```
Detection Rules:
  output/pm-design/ exists -> lifecycle_boost("design", +1)
  output/pm-growth/ exists -> lifecycle_boost("growth", +1)
  output/phase-reports/ exists -> Read latest stage summary to infer current stage
  No output/ directory -> Skip context enhancement
```

#### Step 4: Ambiguity Disambiguation [Core]

When Top-3 candidate scores differ by <= 1:
1. Read `index/skill-relationships.csv`, check upstream/downstream relationships between candidate Skills
2. Prioritize recommending upstream Skills (do prerequisite steps first)
3. If currently in the middle stage of an orchestrator, prioritize recommending pipeline skills from the same stage

#### Step 5: Scenario Template Matching [Core]

If user intent matches a scenario in `index/execution-templates.csv`:
- Directly recommend the complete orchestrator execution sequence
- Inform user this is an end-to-end scenario template that can be launched with one click

### Phase 2: Precise Loading (On-demand)

For Phase 1 Top-3 recommendation results:
1. Read each recommended Skill's complete `SKILL.md` (only 3 files, ~6-9k tokens)
2. Extract core information: description, execution steps, input/output, interaction mode
3. Present recommendation rationale and Skill summary to user

## Output

### Recommendation Result Format

```
[TARGET] Recommended Skills (Top-3):

1. **{skill-name}** (Confidence: {score})
   Type: {type} | Domain: {domain} | Stage: {lifecycle}
   Description: {one-line description}
   Recommendation Rationale: {matched dimensions}

2. **{skill-name}** (Confidence: {score})
   ...

3. **{skill-name}** (Confidence: {score})
   ...

[LIST] Execution Suggestions:
- If it's an orchestrator, it will automatically orchestrate sub-Skills
- If it's a pipeline, it can be executed independently
- If an end-to-end process is needed, recommend scenario template: {template-id}
```

### Degradation Strategy

| Scenario | Handling |
|------|------|
| Top-3 confidence all <= 2 | Prompt user to supplement intent details, provide domain list for selection |
| No matches at all | Guide user to view pm-00-guide for full lifecycle navigation |
| Multi-domain matches (>=2 different domains) | Display recommendations for each domain separately, let user choose direction |
| Matched guide type | Prioritize displaying guide; guide will internally route to specific orchestrator |

## Four-tier Routing System

```
Tier 0: skill-finder (this Skill) -- User intent -> Recommend appropriate Skill
Tier 1: pm-00-guide -- PM domain navigation -> Route to orchestrators
Tier 2: 33 orchestrators -- Orchestration dispatch -> Invoke pipelines
Tier 3: 88 pipelines -- Specific execution -> Produce deliverables
```

**Relationship with pm-00-guide**:
- skill-finder is the global entry point, covering all domains (PM/UI/Backend/Cross-domain)
- pm-00-guide focuses on PM domain deep navigation, including scenario templates and business mapping
- When user intent clearly points to PM domain, skill-finder routes to pm-00-guide

## Index Maintenance

### Auto-generation

Index files are auto-generated by `scripts/build-skill-index.js` from all SKILL.md frontmatter:

```bash
# Execute in project root directory
node scripts/build-skill-index.js
```

### When to Regenerate

- When adding/deleting/modifying Skills
- When modifying SKILL.md metadata fields
- Note: trigger_examples and metadata changes have the greatest impact

### No Manual Maintenance Required

- `index/skill-index.csv` -> Auto-extracted from SKILL.md frontmatter
- `index/skill-relationships.csv` -> Auto-generated from orchestrator YAML + manual data contracts
- `index/synonym-map.csv` -> Requires manual supplementation (mapping of user colloquial expressions)
- `index/execution-templates.csv` -> Requires manual supplementation (when adding new scenario templates)
- `index/domain-lifecycle-map.csv` -> Only update when adding new domains
