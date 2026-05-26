# PRD Generator Output Schema Reference

> This document is split from the design-prd SKILL.md and contains the complete output data structure definition, quality report format, and human review checklist template for the PRD Generator.

### 8.1 PRD Document Output

**Format**: Markdown
**File Naming**: `PRD-{ProductName}-{RequirementID}-{Version}.md`
**Storage Path**: `output/pm-design/design-prd/`
**Output File**: prd.md

**Output Template**:
```markdown
# {PRD Title}

| Field | Value |
|------|-----|
| Document ID | PRDS-{YearMonth}-{SequenceNumber} |
| Version | v{MajorVersion}.{MinorVersion} |
| Status | {Status} |
| Author | {Author} |
| Created At | {Timestamp} |

## Table of Contents
1. [Meta Information](#1-meta-information)
2. [Background & Goals](#2-background-&-goals)
3. [Solution Design](#3-solution-design)
...
```

### 8.2 Quality Gate Check Report

**Format**: JSON
**File Naming**: `{PRD-ID}_quality_report_{Timestamp}.json`

**Output Validation Rules**:

| Field Path | Type | Required | Description |
|----------|------|------|------|
| prd_id | string | Yes | PRD unique identifier |
| level | enum(L,S,X) | Yes | PRD level |
| metadata | object | Yes | Meta information |
| metadata.product_name | string | Yes | Product name |
| metadata.version | string | Yes | Version number |
| metadata.created_at | string | Yes | Creation time (ISO8601) |
| sections | array | Yes | PRD section list |
| sections[].section_id | string | Yes | Section identifier |
| sections[].title | string | Yes | Section title |
| sections[].content | string | Yes | Section content |
| sections[].confidence | number | Yes | Section confidence (0-1.0) |
| functional_requirements | array | Yes | Functional requirements list |
| functional_requirements[].req_id | string | Yes | Requirement identifier |
| functional_requirements[].title | string | Yes | Requirement title |
| functional_requirements[].priority | enum(P0,P1,P2) | Yes | Priority |
| quality_gates | array | Yes | Quality gates |

**Report Structure**:
```json
{
  "prd_id": "string",
  "check_timestamp": "ISO8601",
  "gate_results": {
    "gate1_completeness": {
      "status": "passed|failed|warning",
      "score": "number",
      "issues": [
        {
          "section": "string",
          "field": "string",
          "severity": "blocking|warning",
          "message": "string"
        }
      ]
    },
    "gate2_consistency": {
      "status": "passed|failed|warning",
      "score": "number",
      "traceability_chain": "intact|broken",
      "issues": []
    },
    "gate3_ambiguity": {
      "status": "passed|failed|warning",
      "auto_fixed": ["string"],
      "human_review_required": [
        {
          "location": "string",
          "question": "string",
          "options": ["string"]
        }
      ]
    },
    "gate4_traceability": {
      "status": "passed|failed|warning",
      "trace_coverage": "number%",
      "missing_traces": []
    }
  },
  "overall_status": "passed|failed|pending_human_review",
  "next_action": "string"
}
```

### 8.3 Human Review Checklist

**Format**: Markdown
**File Naming**: `{PRD-ID}_human_review_required.md`

**Output Content**:
```markdown
# Human Review Checklist

Generated At: {Timestamp}
PRD Version: v{Version}

## Ambiguity Clarification Questions

| # | Location | Question | Options |
|---|------|------|------|
| 1 | Section.X.X | Question description | A/B/C |

## Priority Arbitration Requests

| # | Conflict Description | Involved Parties | Suggestion |
|---|----------|--------|------|
| 1 | | | |

## Upstream Data Supplement Requests

| # | Field | Importance | Supplement Guidance |
|---|------|--------|----------|
| 1 | | | |
```
