---
name: {domain}-{sub-module}-orchestrator
description: "Use when executing a complete {sub-module} workflow. {Sub-module} orchestrator dispatching sub-Skills by stage, including {sub-Skill list}. Keywords: {keyword1}, {keyword2}, {keyword3}."
metadata:
  module: "{Module Name in English}"
  sub-module: "{Sub-Module Name in English}"
  type: "orchestrator"
  version: "1.0"
  trigger_examples:
    - "{Natural language example users might say 1}"
    - "{Natural language example users might say 2}"
    - "{Natural language example users might say 3}"
---

# {Sub-Module} Orchestrator

## Core Principles

{1-2 sentences summarizing this orchestrator's core philosophy}

1. **{Principle 1 Name}** -- {Principle 1 description}
2. **{Principle 2 Name}** -- {Principle 2 description}
3. **{Principle 3 Name}** -- {Principle 3 description}

## Orchestration Protocol

You are an orchestrator. Your responsibility is to **dispatch sub-Skills for execution by stage**, not to proxy-execute sub-Skill logic. Strictly follow this protocol:

### Invocation Rules

1. **Explicit Invocation**: Use the `Invoke` mechanism to call sub-Skills, pass input data, and receive output results
2. **No Proxy Execution**: Do not read a sub-Skill's SKILL.md to substitute for execution; do not infer a sub-Skill's internal logic on your own
3. **Contract-Driven**: Focus only on sub-Skill input contracts, output contracts, and validation conditions; do not concern yourself with internal implementation
4. **State Passing**: Pass the current stage's output as the next stage's input, transmitting data via file paths
5. **Validate Before Advancing**: Only advance to the next stage after the current stage's output has passed validation
6. **Stage Summary (Mandatory)**: After all Pipeline stages have completed execution, **must immediately** execute the stage summary action defined in `post_pipeline` to generate a summary document. This is not optional; if the stage summary is not generated, the orchestrator execution is considered incomplete.

### Context Management

- After each sub-Skill invocation completes, retain only **output file paths** and **key conclusion summaries**
- Write detailed output to the `output/{domain-path}/{skill-name}/` directory
- If context approaches the limit, prioritize retaining current stage content and the names of sub-Skills in pending stages

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
Invoke: ${skill-name-a}
Input:
  {field1}: {value1}
  {field2}: {value2}
Output: output/{domain-path}/{skill-name-a}/{output-file}
Validation: {Validation condition}
Mode: AI->Human
```

#### Invoke {skill-name-b}

```
Invoke: ${skill-name-b}
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
Invoke: ${skill-name-c}
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

| Gate | Condition | Failed Handling |
|------|-----------|-----------------|
| {Gate name} | {Condition} | {Handling method} |
| Stage summary generated | output/phase-reports/{module}/{orchestrator-name}.md generated and all 6 structural sections are non-empty | Supplement missing structural items and regenerate |

## Human Decision Points

| Decision Point | Trigger Condition | Decision Content |
|----------------|-------------------|------------------|
| {Decision point} | {Trigger condition} | {Decision content} |

## Exception Handling

| Exception Type | Handling Strategy |
|----------------|-------------------|
| A sub-Skill in a stage failed | {Handling strategy} |
| Upstream data missing | {Handling strategy} |
| Key decision point not confirmed by human | Pause orchestration, output pending confirmation list, wait for human confirmation before continuing |
| Stage summary generation failed | Generate partial summary based on completed sub-Skill outputs; mark missing items as "data missing"; do not block orchestrator completion |

## Changelog

- v1.0: Initial version
