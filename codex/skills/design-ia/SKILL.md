---
name: design-ia
description: "Use when designing product information architecture. Automatically designs IA by extracting content from PRD, performing semantic clustering, recommending navigation patterns, simulating card sorting, and generating IA candidate proposals. Keywords: information architecture, IA design, navigation design, card sorting, content organization, navigation structure, content classification."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Product Design & Prototyping"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "How to organize website navigation"
    - "Help me structure the information architecture"
    - "How to design content classification and navigation"
---

# Information Architecture Auto-Design

## Core Principles

1. **Information finds the path, not the path finds information**: IA design starts from user information needs, not from feature lists
2. **Layer restraint**: 3 levels max, 3-7 items per category, following Miller's Law
3. **Batch generation, human filtering**: AI generates classification proposals in bulk, humans make final selection and judgment
4. **Validation-driven**: Key classification nodes must be marked for user validation

AI->Human AI suggests -> Human approves

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| PRD | markdown | Yes | output/pm-design/design-prd/prd.md | Product requirements document |
| PRD Structured Data | JSON | O | output/pm-design/design-prd/prd.json | Machine-consumable PRD version containing pages[] for IA design to align page routes |
| Existing Product IA | JSON | O | User provided | Existing information architecture (if any) |
| User Research Data | JSON | O | output/pm-discovery/user-research-voice-analysis / output/pm-discovery/user-research-behavior-analysis | User behavior patterns, content preferences |

## Execution Steps

### Step 1: Content Inventory Generation

Extract all feature points and content items from PRD:

- Feature module inventory
- Content type list
- Core business entities
- User-reachable information nodes

### Step 2: Auto-Classification

Generate classification suggestions based on semantic similarity:

AI generates classification suggestions based on semantic similarity of feature names and descriptions:
1. Extract core keywords for each feature point
2. Group by keyword semantic proximity
3. Check if each group quantity meets the 3-7 item constraint
4. Suggest splitting or merging for groups exceeding the constraint
5. Mark classification confidence, low-confidence groups marked with needs_human_validation

- **Constraints**:
  - Existing classifications are preserved first
  - Each category contains 3-7 items
  - Hierarchy does not exceed 3 levels

### Step 3: Navigation Needs Definition

Based on content characteristics and user scenarios, define navigation needs (do not define specific navigation patterns, UI Skill decides implementation):

| Content Characteristic | Navigation Need |
|-----------------------|-----------------|
| Flat structure | 3-5 peer entries need to be simultaneously visible |
| Clear hierarchy | Depth <= 3, core features reachable in 2 clicks |
| Feature-oriented | Core feature entries need persistent visibility |
| Content-rich | Needs browsing + search combination |

### Step 4: Card Sorting Suggestions

AI generates card sorting suggestions based on classification results:

1. Convert Step 2 classification results into card groups
2. Identify feature points with ambiguous cross-group attribution (may belong to multiple groups)
3. Generate 2-3 candidate groups for ambiguous attribution points
4. Mark key classification decision points requiring user validation
5. Output classification suggestions rather than test conclusions

### Step 5: IA Proposal Generation

Generate 2-3 candidate IA proposals, each containing:

- **name**: Proposal name
- **structure**: Hierarchy structure definition
- **navigation_pattern**: Navigation pattern selection
- **avg_clicks_to_core**: Average clicks to core features
- **alignment_with_user_model**: Alignment with user mental model
- **needs_user_validation**: Nodes requiring user validation

## Output

**Storage Path**: `output/pm-design/design-ia/`

**Output File**: `ia_proposals.json`

```json
{
  "ia_proposals": [
    {
      "name": "Proposal A: Feature-Oriented",
      "structure": {
        "root": {
          "label": "string - Root node name",
          "children": [
            {
              "label": "string - Level 1 category name",
              "children": [
                { "label": "string - Level 2 category name", "items": ["string - Feature/content item"] }
              ]
            }
          ]
        }
      },
      "navigation_needs": "4 peer modules need quick switching, depth <= 2",
      "routes": [
        { "path": "/dashboard", "page": "Dashboard", "depth": 1 },
        { "path": "/courses", "page": "Course List", "depth": 1 },
        { "path": "/courses/:id", "page": "Course Detail", "depth": 2 },
        { "path": "/courses/:id/lessons/:lid", "page": "Lesson Learning", "depth": 3 }
      ],
      "avg_clicks_to_core": 2.3,
      "alignment_with_user_model": "high",
      "needs_user_validation": ["Classification node X", "Classification node Y"]
    }
  ]
}
```

**Output Validation Rules**: See Output Validation Rules section below

## Decision Rules

| Condition | Action |
|-----------|--------|
| IA hierarchy depth > 4 levels | Mark "Hierarchy too deep", suggest flattening |
| Same-level node count > 7 | Mark "Cognitive overload", suggest grouping |
| Key task path click count > 3 | Mark "Path too deep", suggest elevating level |
| IA confidence < 0.5 | Escalate to human validation, mark "Low IA inference reliability" |
| Mismatch with PRD feature modules | Mark "Feature coverage gap", list uncovered feature modules |
| Navigation path has cycles | Must fix, eliminate circular references |

## Quality Checks

| Check Item | Standard | Non-Compliance Handling |
|-----------|----------|------------------------|
| Content inventory completeness | Covers all PRD feature points | Add missing feature points, mark "Feature coverage gap" |
| Classification reasonableness | Follows Miller's Law (3-7 items per category) | Re-cluster, split oversized categories or merge undersized ones |
| Navigation needs definition | Has clear navigation needs matching content characteristics | Add navigation need descriptions, re-evaluate |
| Validation node marking | All key classification nodes marked for user validation | Add missing validation marks, escalate to manual review |

---

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|-----------------|---------------|
| PRD document missing | User provides feature list, design IA directly | Lacks PRD structured data, classification may be less complete |
| Existing IA data missing | Design IA from scratch, no reference baseline | Lacks existing IA reference, may miss established structures |
| User research data missing | Derive classification based on PRD features | Lacks user research data, classification may deviate from user mental model |
| All upstream files missing | Prompt user to execute prior stages first, or design IA based on user-provided feature list | Overall confidence reduced |

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| ia_proposals | array | Yes | IA candidate proposal list, at least 2 |
| ia_proposals[].name | string | Yes | Proposal name |
| ia_proposals[].structure | object | Yes | Hierarchy structure definition |
| ia_proposals[].navigation_needs | string | Yes | Navigation needs description (does not define specific navigation pattern) |
| ia_proposals[].routes | array | Yes | Route list |
| ia_proposals[].routes[].path | string | Yes | Route path (must be consistent with prd.json.pages[].route) |
| ia_proposals[].routes[].page | string | Yes | Page name |
| ia_proposals[].routes[].depth | integer | Yes | Hierarchy depth |
| ia_proposals[].avg_clicks_to_core | number | Yes | Average clicks to core features |
| ia_proposals[].alignment_with_user_model | string | Yes | Alignment with user mental model |
| ia_proposals[].needs_user_validation | array | Yes | Nodes requiring user validation |

## Upstream Change Response

### Upstream Change Impact

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| PRD feature module addition/removal | Content inventory, classification structure, route definition | Mark affected feature points and classification nodes, suggest human confirmation on whether to re-cluster |
| PRD priority adjustment | IA hierarchy structure, navigation patterns | Mark affected hierarchy relationships, suggest human confirmation on whether to adjust depth |
| User research data update | Classification proposals, user mental model alignment | Mark affected classification judgments, suggest human confirmation on whether to adjust classification proposals |
| Existing IA structure adjustment | Route mapping, navigation patterns | Mark affected routes and navigation, suggest human confirmation on whether to redesign |

### Downstream Notification Mechanism

| IA Change Type | Notification Scope | Notification Method |
|---------------|-------------------|---------------------|
| Route structure change | design-userflow, design-prototype, design-handoff-spec | Mark route changes, trigger user flow and prototype redesign |
| Navigation needs change | design-prototype, interaction-spec | Mark navigation needs changes, trigger prototype and interaction spec updates |
| Hierarchy depth change | design-userflow, design-handoff-spec | Mark hierarchy changes, trigger flow and handoff document updates |
| Classification node change | design-userflow, design-prototype | Mark classification changes, trigger flow and prototype updates |

## Alignment with prd.json Data Contract

| This Skill's Output Field | prd.json Corresponding Field | Alignment Rule |
|--------------------------|----------------------------|----------------|
| ia_proposals[].routes[].path | prd.json.pages[].route | Route paths must be consistent; after IA proposal is confirmed, prd.json is updated synchronously |
| ia_proposals[].routes[].page | prd.json.pages[].name | Page names must be consistent |
| ia_proposals[].structure | prd.json.pages[] hierarchy | IA hierarchy determines parent-child relationships of pages |

## Data Acquisition Instructions

This Skill requires PRD, existing IA, and user research data. Please provide via one of the following methods:
  1. Directly describe feature list and user needs
  2. Upload PRD document / persona.json / voice-analysis.json files
  3. Provide data file paths
- AI is not responsible for external data collection, only for analysis
