---
name: ideation-orchestrator
description: "Use when diverging ideas or designing solutions. Orchestrates ideation-workshop sub-Skill. Keywords: ideation, HMW, SCAMPER, solution design, product ideas, thought reversal, solution convergence, brainstorming, innovative solutions, creative workshop."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Ideation & Solution Design"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "Help me brainstorm ideas"
    - "Design solutions"
    - "Innovate using SCAMPER"
    - "Brainstorm"
---

# Ideation & Solution Design Orchestrator

## Core Principles

1. **Idea quality correlates with quantity** -- Early judgment is the enemy of creativity; diverge first, then converge
2. **Constraints are guardrails for creativity, not shackles** -- Thought reversal constraints ensure solutions avoid pitfalls, not limit imagination
3. **Convergence must have structured basis** -- Comparison matrices and assumption validation provide objective support for solution selection; intuitive decisions are the last resort

## Exception Handling

| Exception Type | Handling Strategy |
|----------|----------|
| Sub-Skill output file missing | Block current stage, prompt human to supplement upstream input or provide alternative data |
| HMW dimension coverage incomplete | Supplement generation for missing dimensions, retry up to 2 times; still incomplete then annotate "dimension coverage incomplete" |
| SCAMPER solution count insufficient | Supplement generation for scarce dimensions; still insufficient then lower solution count threshold and annotate |
| Convergence stage comparison matrix dimension missing | Supplement missing dimension scores; unable to score then annotate "insufficient data" |
| Human decision timeout without response | Pause orchestration flow, preserve current state, wait for human decision before continuing |
| Context approaching limit | Prioritize current stage content, summarize completed stage outputs as key conclusions written to file |
| Stage summary generation failure | Generate partial summary based on completed sub-Skill output, mark missing items as "data missing", do not block orchestration completion |


## Standalone Usage Input Acquisition Strategy

### Standalone Trigger Scenario Identification

When this orchestrator is invoked directly (not through a parent orchestrator), it is considered a standalone trigger scenario. Typical trigger methods:
- User directly requests capabilities within this orchestrator's domain
- Triggered as an independent skill by external systems
- Parent orchestrator not executed, but user only needs this orchestrator's capability

### Required Input Acquisition Strategy

| Required Input | Priority: Read from output/ | Fallback: Get from user conversation | Last Resort: AI knowledge base inference |
|---------------|---------------------------|-------------------------------------|---------------------------------------|
| PRD (prd.md) | Read output/pm-design/design-prd/prd.md | Ask user for PRD document or verbal requirements | Infer requirements from user description (low confidence, mark "PRD is AI-inferred") |
| project_dir | — | Ask user for project directory path | Cannot infer, user must provide |

### Upstream Orchestrator Auto-Backtracking

When critical required inputs are missing, suggest user execute upstream orchestrators in the following priority:

| Missing Input | Suggested Upstream Orchestrator | Description |
|--------------|-------------------------------|-------------|
| PRD | pm-design related orchestrator | PRD is the business basis for ideation-orchestrator, missing will result in execution without business foundation |
| Sub-skill outputs | Sub-skill execution | Sub-skills (ideation-workshop...) produce domain-specific outputs |

Backtracking suggestion output format:
```
Critical input missing detected, suggest executing upstream orchestrator first:
1. [Priority] pm-design related orchestrator -> Produces PRD
Continue with AI-inferred values? (Inferred values confidence <=0.3, outputs require additional human review)
```

### Standalone Usage Gate

When triggered standalone, must pass the following additional checks before executing Pipeline:

| Gate Item | Check Content | Failure Handling |
|-----------|--------------|-----------------|
| PRD existence | prd.md or equivalent requirements document available | Block execution, suggest user provide PRD |
| project_dir validity | User provided valid project directory path | Block execution, user must provide valid project_dir |
| Input confidence assessment | All required input acquisition methods determined, overall confidence >=0.5 | When confidence <0.5, force human confirmation whether to continue execution |

Gate execution order: PRD existence -> project_dir validity -> Input confidence assessment

## Orchestration Protocol

The orchestration protocol follows the unified standard in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

## Pipeline

```yaml
pipeline: ideation-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-design/ideation-orchestrator.md

stages:
  - id: phase-1
    name: "Ideation Workshop"
    depends_on: []
    skills: [ideation-workshop]
    gate:
      condition: "HMW 6-dimension coverage, SCAMPER 7-dimension coverage with at least 10 solutions, reversal thinking design constraints generated, Top 5 solutions deepened with comparison matrix 6 dimensions complete"
      fail_action: "Supplement generation or re-deepen for substandard items"
```

## Stage Execution Plan

#### Invoke ideation-workshop

```
Invoke: ${ideation-workshop}
Input:
  problem_statement: User provided (or upstream output)
  user_research_data: User provided (or upstream output)
  current_solution: Optional
  competitor_solutions: Optional
  product_context: Optional
Output: output/pm-design/ideation-workshop/ideation-workshop.json + ideation-workshop.md
Validation: HMW passes quality check and all 6 dimensions covered; SCAMPER at least 10 candidate solutions and all 7 dimensions covered; reversal thinking design constraints generated and failure path covers 5 dimensions; Top 5 solutions deepened and comparison matrix 6 dimensions complete
Mode: AI->Human
```

### Stage Summary (post_pipeline)

Follows the stage summary protocol in [orchestrator-protocol.md](../../codex-templates/orchestrator-protocol.md).

| Parameter | Value |
|------|-----|
| Sub-Skill output path | output/pm-design/ideation-workshop/ |
| Summary output path | output/phase-reports/pm-design/ideation-orchestrator.md |

Next Steps:
  primary: design-orchestrator (ideation complete, transform creative solutions into PRD)
  alternatives:
    - target: validation-orchestrator
      reason: Creative solutions have high-risk assumptions that need validation first
      condition: When key assumption risk level >= high in creative solutions
    - target: opportunity-orchestrator
      reason: Creative direction unclear, need to backtrack to opportunity definition
      condition: When creative convergence still cannot form a clear product direction
  special_cases: []

## Stage Gates

| Gate | Condition | Failed Handling |
|------|------|------------|
| Ideation workshop complete | ideation-workshop output file generated and non-empty | Supplement generation or re-deepen for substandard items |
| Stage summary generated | output/phase-reports/pm-design/ideation-orchestrator.md generated and all 6 structure items non-empty | Supplement missing structure items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|--------|----------|----------|
| Solution final selection | Ideation workshop convergence complete, comparison matrix generated | Human makes final solution selection; may accept AI recommendation, adjust priorities, combine solutions, or reject |
