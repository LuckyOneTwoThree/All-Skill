---
name: {domain}-{methodology-name}
description: "Use when {trigger scenario}. {One-line functional description}. Keywords: {keyword1}, {keyword2}, {keyword3}."
metadata:
  module: "{Module Name in English}"
  sub-module: "{Sub-Module Name in English}"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "{Natural language example users might say 1}"
    - "{Natural language example users might say 2}"
---

# {Methodology Name}

## Core Principles

1. **{Principle 1 Name}** -- {Principle 1 description}
2. **{Principle 2 Name}** -- {Principle 2 description}
3. **{Principle 3 Name}** -- {Principle 3 description}
4. **{Principle 4 Name}** -- {Principle 4 description}

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| {Input name} | {JSON/markdown/string} | {Yes/No} | {Upstream Skill output path / User provided} | {Description} |

### Input JSON Example Structure

```json
{
  "example_field": "Example value"
}
```

## Execution Steps

### Step 1: {Step Name}

{Step description}

- {Sub-step 1}
- {Sub-step 2}

### Step 2: {Step Name}

{Step description}

### Step N: {Step Name}

{Step description}

## Output

Output file: `output/{domain-path}/{skill-name}/{output-filename}`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["field1", "field2"],
  "properties": {
    "field1": {"type": "string", "description": "Field 1 description"},
    "field2": {"type": "object", "description": "Field 2 description"}
  }
}
```

### Output JSON Format

```json
{
  "field1": "Example value",
  "field2": {
    "sub_field": "Example value"
  }
}
```

## Decision Rules

| Condition | Decision |
|-----------|----------|
| {Condition description} | {Decision action} |

## Quality Checks

- [ ] {Check item 1}
- [ ] {Check item 2}
- [ ] {Check item 3}

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|------------------|---------------|
| {Upstream file} | {Degradation plan} | {Impact description} |

Data acquisition notes:
- This Skill requires {input description}; please provide via one of the following methods:
  1. {Method 1}
  2. {Method 2}
  3. {Method 3}

## Reference (Optional)

When SKILL.md exceeds 500 lines, it is recommended to split the following content into the `Reference/` folder:

- **Template Files**: Complete document structure templates, table templates -> `Reference/{template-name}.md`
- **JSON Schemas**: Input/output data structure definitions -> `Reference/input-schema.md`, `Reference/output-schema.md`
- **Example Data**: Complete example JSON, example documents -> `Reference/examples.md`

After splitting, retain overview tables in the corresponding SKILL.md sections and reference via links:
```
**Full {content}**: See [Reference/{file-name}.md](Reference/{file-name}.md)
```

## Upstream Change Response

When upstream input changes occur, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|-------------|-------------------|
| {Change type} | {Impact scope} | {Response strategy} |

When this Skill itself changes, the notification mechanism to downstream:

| Change Type | Impact Scope | Notification Method |
|-------------|-------------|---------------------|
| {Change type} | {Downstream Skill} | {Notification method} |
