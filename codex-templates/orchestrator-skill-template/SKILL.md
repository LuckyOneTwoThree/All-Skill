---
name: {domain}-{sub-module}-orchestrator
description: "Use when executing a complete {sub-module} workflow. {Sub-module} orchestrator dispatching sub-Skills by stage, including {sub-Skill list}. Keywords: {keyword1}, {keyword2}, {keyword3}."
metadata:
  module: "{Module Name in English}"
  sub-module: "{Sub-Module Name in English}"
  type: "orchestrator"
  version: "1.0"
  domain_tags: ["{Industry Tag 1}", "{Industry Tag 2}", "General"]
  trigger_examples:
    - "{Natural language example users might say 1}"
    - "{Natural language example users might say 2}"
    - "{Natural language example users might say 3}"
---

# {Sub-Module} Orchestrator

## Code Write Boundary

Follow [Engineering BoundaryProtocol](../engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## Core Principles

{1-2 sentences summarizing this orchestrator's core philosophy}

1. **{Principle 1 Name}** -- {Principle 1 description}
2. **{Principle 2 Name}** -- {Principle 2 description}
3. **{Principle 3 Name}** -- {Principle 3 description}

## Orchestration Protocol

> Protocol source: [orchestrator-protocol.md](../orchestrator-protocol.md) (for maintainers tracking only, this file has the complete protocol inlined and can be used independently)

You are an orchestrator, responsible for **dispatching sub-Skills by stage**, not proxy-executing sub-Skill logic. Strictly follow the protocol below:

### Invocation Rules

1. **Dual-Mode Invocation**: When the platform supports the Skill tool, explicitly invoke sub-Skills; when the platform does not support it, execute compatible dispatching based on sub-Skill's `name`, input contract, output contract, and stage gates.
2. **No Proxy Expansion**: During compatible dispatching, do not copy sub-Skill internal methodology into orchestrator context, nor rewrite sub-Skill logic; only pass necessary input, output paths, and validation conditions.
3. **Contract-Driven**: Focus only on sub-Skill input contracts, output contracts, and validation conditions; do not concern yourself with internal implementation details.
4. **State Passing**: Pass the current stage's output as the next stage's input, transmitting data via file paths and artifact index.
5. **Validate Before Advancing**: Only advance to the next stage after the current stage's output has passed validation.
6. **Stage Summary (Mandatory)**: After all Pipeline stages have completed execution, **must immediately** execute the stage summary action defined in `post_pipeline` to generate a summary document. This is not optional; if the stage summary is not generated, the orchestrator execution is considered incomplete.
7. **Cross-Sub-Skill Validation**: When consistency constraints exist between outputs of multiple sub-Skills, the orchestrator may perform cross-validation between stages (reading multiple outputs to compare consistency). This is the orchestrator's coordination responsibility, not proxy-executing sub-Skill logic. Cross-validation rules are explicitly defined in the orchestrator SKILL.md.

### Context Management

- After each sub-Skill invocation completes, retain only **output file paths** and **key conclusion summaries**
- Write detailed output to the `output/{domain-path}/{skill-name}/` directory
- If context approaches the limit, prioritize retaining current stage content and the names of sub-Skills in pending stages
- Cross-domain orchestrators do not transport sub-Skill full text; only maintain artifact references in `artifact-index.json`, reading directly downstream files on demand.

### Artifact Path and Index

- Sub-Skills always write to their domain-native output paths, e.g., `output/pm-design/`, `output/ui-frontend/`, `output/backend-api-design/`.
- Cross-domain orchestrators only generate summary artifacts: `output/cross-domain/artifact-index.json` and `output/phase-reports/cross-domain/{orchestrator-name}.md`.
- `artifact-index.json` records stage, skill, real output path, summary, and validation status, serving as the sole index for cross-domain transfer.

### Human Approval Records

Key human decision points should output lightweight approval records at `output/approvals/{orchestrator-name}/{stage-id}.approval.json`:

```json
{
  "approval_id": "string",
  "stage": "string",
  "decision_required": "string",
  "recommended_option": "approve",
  "options": ["approve", "revise", "reject"],
  "risks": [],
  "status": "pending | approved | rejected",
  "decided_by": "human",
  "decided_at": "ISO8601"
}
```

### Stage Summary

After all sub-Skills have completed execution, the orchestrator must generate a stage summary document, written to `output/phase-reports/{module}/{orchestrator-name}.md`, containing the following structure:

1. **Execution Overview**: Orchestrator name and version, execution time, sub-Skill execution status (success/failure/degraded)
2. **Key Findings**: Core output summary for each sub-Skill (1-3 items), cross-sub-Skill insights
3. **Decision Record**: Human decision points and decision results, AI automatic decisions and rationale
4. **Deliverables List**: All output file paths and content summaries, deliverable quality assessment (whether validation passed)
5. **Risks & Follow-ups**: Items that failed validation, items executed with degradation, recommended follow-up actions
6. **Downstream Handoff**: Which downstream orchestrators can consume this orchestrator's outputs, recommended next orchestrators. Structure contains three layers:
   - **primary** (1): The most recommended downstream orchestrator; must be an orchestrator-type Skill, cannot point to itself
   - **alternatives** (2-3): Alternative downstream orchestrators, prioritizing orchestrator-type Skills; condition uses [trigger scenario] + [judgment basis] format
   - **special_cases** (0-1): Special-case recommended sub-Skills (non-orchestrator); condition must note "no full orchestration pipeline needed"

### Stage Gate Standards

The orchestrator's stage gates only validate the following 3 categories of conditions, not sub-Skill internal fields:

| Gate Type | Validation Content | Example |
|-----------|-------------------|---------|
| Output Existence | Output files generated and non-empty | "api-design-spec output files generated" |
| Top-level Structure Integrity | JSON top-level required fields exist | "prd.json contains features/pages/entities" |
| Human Decision Confirmation | Key decision points have human confirmation | "Design review human confirmation passed" |

### General Exception Handling

| Exception Type | Handling Strategy |
|---------------|-------------------|
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestrator completion |
| Key decision point lacks human confirmation | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| Upstream data missing | Mark missing data items, fill with reasonable assumptions (mark confidence <=0.3), continue execution and highlight in output |
| All upstream data missing | Mark "all data missing" status, output minimal template, set overall confidence to 0.3, force human confirmation whether to continue |

## Pipeline Definition

```yaml
pipeline: {orchestrator-name}
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/{module}/{orchestrator-name}.md

stages:
  - id: phase-1
    name: "{Stage 1 Business Name}"
    skills:
      - {skill-name-a}
      - {skill-name-b}
    gate:
      condition: "{Gate condition}"
      fail_action: "{Failed handling}"

  - id: phase-2
    name: "{Stage 2 Business Name}"
    depends_on: [phase-1]
    skills: [{skill-name-c}]
    gate:
      condition: "{Gate condition}"
      fail_action: "{Failed handling}"
```

## Stage Execution Plan

### Stage 1: {Business Name}

**Parallel Invocation** `{skill-name-a}` + `{skill-name-b}`

#### Invoke {skill-name-a}

```
Skill: {skill-name-a}
Input:
  {field1}: {value1}
  {field2}: {value2}
Output: output/{domain-path}/{skill-name-a}/{output-file}
Validation: {Validation condition}
Mode: AI->Human
```

#### Invoke {skill-name-b}

```
Skill: {skill-name-b}
Input:
  {field1}: {value1}
Output: output/{domain-path}/{skill-name-b}/{output-file}
Validation: {Validation condition}
Mode: AI
```

[GATE] **Stage Gate**: {Gate condition} -> Not passed: {Handling method}

### Stage 2: {Business Name}

**Sequential Invocation** `{skill-name-c}` (depends on Stage 1 output)

```
Skill: {skill-name-c}
Input:
  {field1}: output/{domain-path}/{skill-name-a}/{output-file}
Output: output/{domain-path}/{skill-name-c}/{output-file}
Validation: {Validation condition}
Mode: AI->Human
```

[GATE] **Stage Gate**: {Gate condition} -> Not passed: {Handling method}

### Stage Summary (post_pipeline)

Follows the [orchestrator-protocol.md](../orchestrator-protocol.md) stage summary protocol.

| Parameter | Value |
|-----------|-------|
| Sub-Skill output path | output/{domain-path}/ |
| Summary output path | output/phase-reports/{module}/{orchestrator-name}.md |
| Approval record path | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

Downstream Handoff:
  primary: {downstream-orchestrator-name} ({recommendation reason})
  alternatives:
    - target: {alternative-orchestrator-1}
      reason: {recommendation reason}
      condition: {trigger scenario} + {judgment basis}
    - target: {alternative-orchestrator-2}
      reason: {recommendation reason}
      condition: {trigger scenario} + {judgment basis}
  special_cases:
    - target: {sub-Skill-name}
      reason: {Only need single capability, no full orchestration pipeline needed}
      condition: {trigger scenario}, when no full orchestration pipeline needed

## Stage Gates

| Gate | Condition | Failure Handling |
|------|-----------|-----------------|
| {Gate name} | {Condition} | {Handling method} |
| Stage summary generated | output/phase-reports/{module}/{orchestrator-name}.md generated and all 6 structural sections are non-empty | Supplement missing structural items then regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|---------------|-------------------|-----------------|
| {Decision point} | {Trigger condition} | {Decision content} |

## Exception Handling

| Exception Type | Handling Strategy |
|---------------|-------------------|
| A sub-Skill in a stage failed | {Handling strategy} |
| Upstream data missing | {Handling strategy} |
| Key decision point lacks human confirmation | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs, mark missing items as "data missing", do not block orchestrator completion |

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
| PRD | pm-design related orchestrator | PRD is the business basis for this orchestrator, missing will result in execution without business foundation |

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
