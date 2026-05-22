---
name: design-prd
description: "Use when generating standardized PRD documents. PRD auto-generation and management, producing standardized PRD documents based on requirements and ideation outputs, providing input for subsequent IA, flow, and prototype design. Covers PRD-L/S/X three-tier classification, 9-section complete structure, 4 quality gates. Keywords: PRD generation, product requirements document, requirements doc auto-generation, PRD management, write requirements doc, product documentation."
metadata:
  module: "Product Ideation & Design"
  sub-module: "Product Design & Prototyping"
  type: "pipeline"
  version: "3.3"
  domain_tags: ["Internet", "Software", "General"]
  trigger_examples:
    - "Help me write a PRD document"
    - "Generate a product requirements document"
    - "How to write a requirements document"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Generate PRD-L level document with core sections (background, feature specs, acceptance criteria) and basic quality checks"
  deep_description: "Generate PRD-X level document with upstream conflict decision records, self-correction loop logs, open issue management, version change traceability chain, and degradation impact assessment"
---

# PRD Generator

This Skill is responsible for automatically transforming upstream stage outputs (user insights, opportunity definition, ideation) into quality-standard PRD documents, providing structured input for subsequent product design (IA, flows, prototypes). Requirements collection, understanding, and prioritization are built into design-prd's Step 1-3, eliminating the need for a separate requirements management stage. Supports PRD-L/S/X three-tier classification, automatically performs 4 quality gate checks, ensuring document completeness, consistency, ambiguity elimination, and traceability.

## Core Principles
1. Quality gates cannot be bypassed -- 4 gates are the PRD quality baseline, never to be skipped under any circumstances
2. Tiering matches complexity -- PRD-L/S/X corresponds to different complexity levels, avoiding over- or under-engineering
3. Traceability chain must be end-to-end -- Every feature point must be traceable to upstream outputs and business goals
4. Human decision authority takes priority -- AI judgment confidence < 0.7 triggers mandatory human confirmation; PM can override AI classification

## Execution Steps

1. [Core] Determine PRD tier level (L/S/X) -- Auto-classify based on Effort estimation and team count; PM can override
2. [Core] Generate PRD document per corresponding tier structure -- PRD-L uses simplified template, PRD-S uses complete 9-section structure, PRD-X uses enhanced 9-section structure
3. [Core] Execute 4 quality gate checks -- Completeness/Consistency/Ambiguity elimination/Traceability; auto-correct if not passed
4. [Conditional] Version lifecycle management -- Create->Review->Finalize->Change; each change recorded in changelog
5. [Conditional] Upstream-downstream alignment -- Ensure PRD is traceable to upstream requirements, downstream design can directly consume PRD output

**Key Output Requirements**:
- **entities[].fields must be complete**: Each entity must include at least an identifier field (id), name field, status field, and business core fields. Field granularity should be at the level of "backend can directly use for ER model design"; do not provide only entity names without fields
- **pages[].data_requirements must be complete**: Each page must specify what data is needed, data operation types (read/create/update/delete), which entity it relates to, and which fields are required. This is the direct input for UI page generation and API design
- **entities[].api_endpoints are advisory**: The PRD stage defines business operation requirements (e.g., "users need to view course list"); specific API paths are designed by api-design-spec

See detailed descriptions in each section below.

## 1. PRD Tier System

### 1.1 Tier Definition

| Tier | Trigger Condition | Document Scale | Review Process | Decision Authority |
|------|-------------------|---------------|----------------|-------------------|
| **PRD-L (Light)** | Effort < 2 person-days | 200-500 words | PM self-review | PM unilateral decision |
| **PRD-S (Standard)** | 2 person-days <= Effort <= 20 person-days | 1500-3000 words | Requirements review meeting | Product committee decision |
| **PRD-X (eXtensive)** | Effort > 20 person-days OR cross 3+ teams | 3000-8000 words | Multi-round review | Cross-department review + management approval |

### 1.2 Auto-Classification Rules

```
Classification Algorithm:
1. Extract Effort estimation from upstream output (unit: person-days)
2. Count number of teams involved (development, design, testing, operations, etc.)
3. Apply classification decision tree:
   IF Effort < 2 AND team count <= 1 THEN PRD-L
   ELSE IF Effort <= 20 AND team count <= 3 THEN PRD-S
   ELSE PRD-X
```

### 1.3 Human Can Override AI Judgment

- PM can manually specify tier level without following auto-judgment
- Override requires recording the reason in document metadata
- When auto-judgment confidence < 0.7, mandatory human confirmation is required

## 2. PRD-S Complete 9-Section Structure

The following is the standard structure for PRD-S (Standard). PRD-L and PRD-X adjust proportionally on this basis.

**Complete Structure Definition**: See [Reference/prd-structure.md](Reference/prd-structure.md)

### Structure Overview

| Section | Name | Core Content |
|---------|------|-------------|
| Section 1 | Meta Information | Document ID, version, status, related documents |
| Section 2 | Background & Goals (Why) | Problem Statement, goals and success definition, target users and scenarios |
| Section 3 | Solution Design (What & How) | Solution overview, feature specifications (MoSCoW), user stories (Given-When-Then), interaction logic, state design, data model, interface definitions |
| Section 4 | Boundaries & Constraints | Explicitly excluded items, technical constraints, known limitations |
| Section 5 | Non-Functional Requirements (NFR) | Performance, availability, security, observability |
| Section 6 | Data Tracking Plan | Event list, tracking validation plan |
| Section 7 | Acceptance Criteria | Functional acceptance, performance acceptance, security acceptance |
| Section 8 | Release & Operations | Gradual rollout plan, Feature Flags, rollback plan, operational readiness |
| Section 9 | Appendix | Glossary, changelog, open questions, related document index |

## 3. Quality Gates

### Gate 1: Completeness Check

**Checklist**:
- [ ] All 9 sections exist
- [ ] All required fields are populated
- [ ] MoSCoW classification is marked
- [ ] Given-When-Then acceptance criteria cover main flow
- [ ] State design covers 5 special states
- [ ] Non-functional requirements include 4 dimensions

**Failure Handling**:
- Block generation flow
- Output missing items list
- Prompt supplementation directions

### Gate 2: Consistency Check

**Check Rules**:
- OKR goals -> Success metrics consistency
- Metrics -> Feature requirements consistency
- Feature requirements -> Acceptance criteria consistency
- Upstream/downstream references exist

**Traceability Chain**:
```
Strategic Goals -> OKR -> Key Results -> Primary Metrics -> Feature Requirements -> Acceptance Criteria
```

**Failure Handling**:
- Identify inconsistent positions
- Provide correction suggestions
- Record as pending items

### Gate 3: Ambiguity Check

**Auto-Check Items**:
- Fuzzy quantifier detection ("fast", "large amount", "occasionally", etc.)
- Dangling reference detection (references to non-existent charts, fields, interfaces)
- Logical contradiction detection (prerequisites contradicting results)

**Human Review Items**:
- Business rule reasonableness
- User scenario authenticity
- Technical solution feasibility

**Failure Handling**:
- Auto-correct identifiable ambiguities
- Mark items requiring human confirmation
- Generate ambiguity clarification question list

### Gate 4: Traceability Check

**Traceability Requirements**:
- Every feature point traceable to upstream output
- Every acceptance criterion traceable to specific metric
- Every metric traceable to business goal

**Failure Handling**:
- Generate traceability chain breakpoint report
- Prompt missing traceability paths
- Require supplementary upstream evidence

## 4. Version Lifecycle [Conditional]

### 4.1 Version State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   v0.1 AI Draft  ->  v0.2 PM Refinement  ->  v0.3 Review Edit │
│       v                v               v                    │
│   Auto-generated    Manual revision    Review feedback      │
│                                                             │
│   v1.0 Finalized  ->  v1.x Dev Changes  ->  v2.0 Post-Launch │
│       v               v               v                    │
│   Review passed    In-dev adjustment   Post-launch review   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 4.2 Version Definitions

| Version | Trigger Condition | Change Authority | Review Requirement |
|---------|-------------------|-----------------|-------------------|
| v0.1 | AI auto-generated | AI | None |
| v0.2 | PM first revision | PM | None |
| v0.3 | Post-review revision | PM + Reviewer | None |
| v1.0 | Review passed and finalized | Change committee | Full review |
| v1.x | In-development changes | Dev + PM | Change review |
| v2.0 | Post-launch major version update | PM | Retrospective review |

### 4.3 State Transitions

| Current State | Transition Action | Next State | Trigger Condition |
|--------------|-------------------|-----------|-------------------|
| Draft | Submit for review | In Review | All 4 quality gates passed |
| In Review | Review passed | Finalized | Review committee approved |
| In Review | Review not passed | Review Revision | Blocking items exist |
| Finalized | Change triggered | In-Development Change | Development stage finds adjustments needed |
| Launched | Publish update | Archived | New version launched |

## 5. Execution Decision Logic [Conditional]

### 5.1 Generation Order Dependency Graph

**Topological Sort Rules**:
```
Generation Priority (high to low):
1. Meta Information (Section 1) - No dependencies
2. Background & Goals (Section 2) - Depends on upstream exploration output
3. Solution Design (Section 3) - Depends on Section 2 and design output
4. Boundaries & Constraints (Section 4) - Depends on Section 3
5. Non-Functional Requirements (Section 5) - Depends on Section 3
6. Data Tracking (Section 6) - Depends on Section 3
7. Acceptance Criteria (Section 7) - Depends on Section 2, 3
8. Release & Operations (Section 8) - Depends on Section 7
9. Appendix (Section 9) - Depends on all other Sections
```

### 5.2 Upstream Conflict Decision Rules

**Conflict Types and Handling Strategies**:

| Conflict Type | Judgment Rule | Handling Strategy | Escalation Condition |
|--------------|---------------|-------------------|---------------------|
| **Goal conflict** | Two OKRs in opposite directions | Priority arbitration | Involves KPI impact > 10% |
| **Solution conflict** | Multiple solutions point to different implementations | Solution comparison scoring | Involves major architecture adjustment |
| **Metric conflict** | Metric optimization directions contradict | Guardrail metric constraints | Guardrail metric breached |
| **Priority conflict** | Feature priority ranking contradictions | MoSCoW re-classification | MVP scope change > 30% |

**Escalation Decision Matrix**:
```
Escalation Thresholds:
- Source count >= 2 with inconsistent conclusions
- MVP scope change > 30%
- Involves security/compliance issues
- Involves significant technical debt

Escalation Path:
1. Record conflict details
2. Convene stakeholder meeting
3. Produce decision minutes
4. Update PRD
```

### 5.3 Upstream Data Incompleteness Handling

**Missing Level Definitions**:

| Level | Definition | Handling Method |
|-------|-----------|-----------------|
| **L0** | Fields complete but content is hollow | AI supplements description, marks low confidence |
| **L1** | Some fields missing | Fill with template, mark as pending confirmation |
| **L2** | Core fields completely missing | Interrupt flow, mandatory supplementation required |

**Missing Data Handling Flow**:
```
Detect missing -> Judge level -> Apply strategy -> Output result

L0 Handling:
1. Mark "AI supplemented, pending confirmation"
2. Provide confidence score
3. Generate confirmation question list

L1 Handling:
1. Mark "Pending supplementation"
2. Use default values or template filling
3. Block related downstream generation
4. Generate supplementation list

L2 Handling:
1. Mark "Missing core input"
2. Output interruption report
3. Specify missing fields
4. Require re-input
```

### 5.4 Self-Correction Loop

**Trigger Conditions**:
- Quality gate check failure
- Human feedback correction
- Upstream data update

**Loop Limits**:
- Maximum self-correction rounds: 3
- Per-round timeout: 5 minutes
- After exceeding limits, output problem report for manual intervention

**Self-Correction Flow**:
```
Round N Correction:
1. Analyze failure reason
2. Generate correction plan
3. Apply correction
4. Re-execute quality gate check
5. If passed, end; otherwise enter Round N+1
```

## 6. Upstream-Downstream Alignment [Conditional]

### 6.1 Upstream Consumption

| Stage | Output | Consumption Method |
|-------|--------|-------------------|
| **Insight Analysis (insight-analysis)** | User insights, pain points, behavior patterns | Replaces original requirements-collection input, extracts user research data and requirements collection |
| **Opportunity Definition (opportunity-definition)** | Opportunity list, priority ranking, problem statement | Replaces original requirements-understanding/prioritization input, provides requirements understanding and prioritization |
| **Discovery** | User insights, problem statement, requirements pool | Extract Problem Statement, target user definition |
| **Strategy** | OKR, roadmap, value proposition | Align business goals, priority judgment |
| **Ideation** | Solutions, feature list | Reference solution design, acceptance criteria source |
| **Design** | Prototypes, flowcharts, information architecture | Reference interaction logic, page specifications |
| **Metrics** | Metrics system, data tracking plan | Directly reference or supplement |

### 6.2 Downstream Driving

| Downstream Party | Driving Content | Deliverable | Consumption Source |
|-----------------|----------------|------------|-------------------|
| **UI Frontend** | Interaction logic, state design, page specifications, data model | Component intent description + page data requirements | prd.json.pages[] + prd.json.user_flows[] |
| **Backend Architecture** | Feature specifications, interface definitions, data entities, boundary conditions | API contract input + data model input | prd.json.features[] + prd.json.entities[] |
| **Development** | Feature specifications, interface definitions, boundary conditions | Technical design document | prd.md + prd.json |
| **Design** | Interaction logic, state design, page specifications | Design specification document | prd.md + prd.json.pages[] |
| **Testing** | Acceptance criteria, test cases, environment requirements | Test plan | prd.json.features[].acceptance_criteria[] |
| **Operations** | Release strategy, operational readiness, impact assessment | Operations plan | prd.md |
| **Monitoring** | Observability requirements, tracking plan | Monitoring dashboard | prd.json.non_functional_requirements |

### 6.3 Data Flow Diagram

```
[Insight Analysis Output] -> [Opportunity Definition Output] -> [Ideation Output]
        v              v                v
        └──────────────┴────────────────┘
                      v
          PRD Generator (requirements collection, understanding, prioritization built into Step 1-3)
                      v
        ┌─────────┼─────────┐
        v         v         v
[IA Design]  [Flow Design]  [Prototype Design]
```

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| metadata | JSON/object | Yes | System generated | Request metadata |
| insight_analysis | JSON/object | O | output/pm-discovery/insight-analysis / upstream discovery stage | User insight analysis output, replaces original requirements-collection input, provides user research data and requirements collection |
| opportunity_definition | JSON/object | O | output/pm-discovery/opportunity-definition / upstream discovery stage | Opportunity definition output, replaces original requirements-understanding/prioritization input, provides requirements understanding and prioritization |
| exploration_outputs | JSON/object | O | Upstream discovery stage | User insights, problem statement |
| strategy_outputs | JSON/object | O | Upstream strategy stage | OKR, roadmap |
| north_star_metric | JSON/object | O | output/pm-strategy/planning-north-star/north_star.json | North Star Metric and driven features |
| okr_candidates | JSON/object | O | output/pm-strategy/planning-okr/okr.json | OKR candidates and driven features |
| ideation_outputs | JSON/object | O | Upstream ideation stage | Solutions, feature list |
| design_outputs | JSON/object | O | Upstream design stage | Prototypes, user flows |
| metrics_outputs | JSON/object | O | Upstream metrics stage | Metrics system, tracking plan |
| requirement | JSON/object | Yes | User provided | Requirements context and manual override configuration |

**Complete Input Data Structure and Validation Rules**: See [Reference/input-schema.md](Reference/input-schema.md)

## Output

| Output Item | Format | Path |
|------------|--------|------|
| PRD Document | Markdown | `output/pm-design/design-prd/prd.md` |
| PRD Structured Data | JSON | `output/pm-design/design-prd/prd.json` |
| Quality Gate Check Report | JSON | `output/pm-design/design-prd/<prd-id>_quality_report_<timestamp>.json` |
| Human Review Required List | Markdown | `output/pm-design/design-prd/<prd-id>_human_review_required.md` |

**Complete Output Data Structure and Templates**: See [Reference/output-schema.md](Reference/output-schema.md)

### prd.json Structure Definition

prd.json is the machine-consumable version of the PRD, for programmatic consumption by downstream Backend/UI Skills, ensuring core information like feature points, pages, entities, and user flows can be automatically parsed and aligned.

```json
{
  "prd_id": "string",
  "version": "string",
  "level": "L | S | X",
  "status": "draft | in_review | approved | released",
  "meta": {
    "title": "string",
    "owner": "string",
    "created_at": "ISO8601",
    "updated_at": "ISO8601"
  },
  "goals": [
    {
      "goal_id": "string",
      "description": "string",
      "okr_alignment": "string",
      "success_metrics": [
        {
          "metric_name": "string",
          "target_value": "string",
          "current_value": "string | null",
          "unit": "string"
        }
      ]
    }
  ],
  "features": [
    {
      "feature_id": "string",
      "name": "string",
      "description": "string",
      "priority": "must | should | could | wont",
      "status": "planned | in_progress | completed | cancelled",
      "goal_id": "string",
      "driven_by": {
        "north_star_metric": "string | null",
        "okr_objective": "string | null",
        "kr_id": "string | null",
        "expected_lift": "string"
      },
      "acceptance_criteria": [
        {
          "criterion_id": "string",
          "given": "string",
          "when": "string",
          "then": "string"
        }
      ],
      "dependencies": ["feature_id"],
      "related_pages": ["page_id"],
      "related_entities": ["entity_id"]
    }
  ],
  "pages": [
    {
      "page_id": "string",
      "name": "string",
      "route": "string",
      "description": "string",
      "data_requirements": [
        {
          "data_name": "string",
          "source": "api | local | cache",
          "data_operations": ["read | create | update | delete"],
          "related_entity": "entity_id | null",
          "fields": ["string"],
          "description": "string"
        }
      ],
      "functional_areas": ["string"],
      "user_flows": ["flow_id"],
      "states": [
        {
          "state_name": "string",
          "description": "string",
          "triggers": ["string"]
        }
      ]
    }
  ],
  "entities": [
    {
      "entity_id": "string",
      "name": "string",
      "description": "string",
      "fields": [
        {
          "field_name": "string",
          "type": "string",
          "required": "boolean",
          "description": "string",
          "constraints": "string | null"
        }
      ],
      "relationships": [
        {
          "target_entity_id": "string",
          "type": "one_to_one | one_to_many | many_to_many",
          "description": "string"
        }
      ],
      "api_endpoints": [
        {
          "method": "GET | POST | PUT | PATCH | DELETE",
          "path": "string",
          "description": "string"
        }
      ]
    }
  ],
  "user_flows": [
    {
      "flow_id": "string",
      "name": "string",
      "description": "string",
      "entry_page": "page_id",
      "steps": [
        {
          "step_id": "string",
          "action": "string",
          "page_id": "string",
          "expected_outcome": "string",
          "error_handling": "string | null"
        }
      ],
      "alternative_paths": [
        {
          "condition": "string",
          "steps": ["step_id"]
        }
      ]
    }
  ],
  "non_functional_requirements": {
    "performance": [
      {
        "requirement": "string",
        "metric": "string",
        "target": "string"
      }
    ],
    "availability": [
      {
        "requirement": "string",
        "metric": "string",
        "target": "string",
        "measurement": "string"
      }
    ],
    "security": [
      {
        "category": "authentication | authorization | encryption | audit | compliance",
        "requirement": "string",
        "implementation": "string"
      }
    ],
    "observability": [
      {
        "dimension": "metrics | logs | traces",
        "indicator": "string",
        "alert_threshold": "string"
      }
    ]
  },
  "tracking_plan": {
    "events": [
      {
        "event_id": "string",
        "event_name": "string",
        "trigger": "string",
        "properties": [
          {
            "property_name": "string",
            "type": "string",
            "required": "boolean"
          }
        ],
        "related_metric": "string"
      }
    ],
    "validation": {
      "coverage_target": "number",
      "data_delay_threshold": "string"
    }
  },
  "traceability": [
    {
      "feature_id": "string",
      "goal_id": "string",
      "upstream_source": "string",
      "upstream_artifact_id": "string"
    }
  ]
}
```

### Relationship Between prd.json and prd.md

| Dimension | prd.md | prd.json |
|-----------|--------|----------|
| Consumer | Humans (PM, designers, developers) | Machines (Backend Skill, UI Skill) |
| Content | Complete 9-section narrative + tables + charts | Structured core data (features/pages/entities/flows) |
| Generation Order | Generate prd.md first | Extract structured data from prd.md to generate prd.json |
| Consistency | prd.json must be consistent with prd.md content; in case of conflict, prd.md takes precedence | |

### Output Validation Rules

- [ ] 9-section structure complete: PRD-S complete 9-section structure all exists
- [ ] Traceability chain end-to-end: Traceability chain from OKR to acceptance criteria is complete
- [ ] Quality gates passed: All 4 quality gates passed
- [ ] No residual ambiguity: No fuzzy quantifiers or dangling references
- [ ] prd.json completeness: features/pages/entities/user_flows arrays are all non-empty
- [ ] prd.json entities field completeness: Each entity's fields array is non-empty and contains at least core fields (id/name/status etc.), relationships array is non-empty
- [ ] prd.json pages data requirements completeness: Each page's data_requirements array is non-empty, with data source (api/local/cache) and required fields clearly marked
- [ ] prd.json reference consistency: feature.related_pages page_id exists in pages[], feature.related_entities entity_id exists in entities[]
- [ ] prd.json traceability complete: Every feature has a corresponding traceability entry
- [ ] prd.json and prd.md consistency: Feature names, priorities, and acceptance criteria in prd.json are consistent with prd.md
- [ ] prd.json tracking_plan completeness: tracking_plan.events is non-empty, each event's properties is non-empty
- [ ] prd.json NFR completeness: All 4 dimension arrays of non_functional_requirements are non-empty
- [ ] prd.json feature driven_by completeness: Every P0/P1 feature's driven_by field is non-empty, explicitly linked to North Star Metric or OKR
- [ ] prd.json feature priority and metric alignment consistency: feature.priority is positively correlated with driven_by.expected_lift

## Decision Rules (Detailed)

### 9.1 Gate Pass Rules

**Hard Requirements**:
- All 4 quality gates must pass
- Any gate failure blocks entry to development stage

**Gate Status Mapping**:
| Gate Status | Enter Development | Finalize | Release |
|------------|-------------------|----------|---------|
| All passed | ✓ | ✓ | ✓ |
| Gate 1 failed | ✗ | ✗ | ✗ |
| Gate 2 failed | ✗ | ✗ | ✗ |
| Gate 3 failed | Requires human confirmation | Requires human confirmation | ✗ |
| Gate 4 failed | Requires supplementation | Requires supplementation | ✗ |

### 9.2 Conflict Escalation Rules

**Mandatory Escalation Scenarios**:
1. **Source conflict**: Requirements involve >= 2 upstream sources with inconsistent conclusions
2. **Scope upheaval**: MVP scope change > 30%
3. **Security/compliance**: Involves user privacy, security compliance, financial regulation, etc.
4. **Resource overrun**: Requirement resource consumption exceeds 50% of original plan
5. **Technical risk**: Solution involves major technical architecture adjustment

**Escalation Flow**:
```
1. Identify escalation trigger condition
2. Generate escalation report (conflict details + stakeholder positions + impact analysis)
3. Determine escalation level (PM/Product Committee/Management)
4. Convene decision meeting
5. Produce decision minutes
6. Update PRD
```

### 9.3 Open Question Management [Deep]

**Open Question States**:
- **Open**: Unresolved
- **In Progress**: Being handled
- **Resolved**: Resolved
- **Won't Fix**: Explicitly excluded

**Finalization Rules**:
- All Open questions must be resolved or converted to Won't Fix
- Output question closure report upon finalization

## Quality Checks (Detailed)

### 10.1 Completeness Standards (P0)

| Check Item | Standard | Check Method |
|-----------|----------|-------------|
| Structure completeness | All 9 sections exist | Section existence scan |
| Field completeness | Required fields 100% populated | Field non-empty check |
| Acceptance coverage | Main flow + boundary + exception fully covered | Given-When-Then coverage rate |
| State coverage | All 5 state types defined | State type enumeration matching |

### 10.2 Consistency Standards (P1)

| Check Item | Standard | Check Method |
|-----------|----------|-------------|
| Goal traceability chain | OKR->Metrics->Features->Acceptance end-to-end | Traceability chain completeness check |
| Priority consistency | MoSCoW consistent across all references | Priority cross-validation |
| Version consistency | Version number matches changelog | Version number consistency check |

### 10.3 Ambiguity Elimination Standards (P1)

| Check Item | Standard | Check Method |
|-----------|----------|-------------|
| Quantifier quantification | No fuzzy quantifiers (fast -> <2s) | Quantifier regex matching + replacement |
| Dangling references | All references point to existing targets | Reference resolution + existence verification |
| Logical contradictions | No prerequisite-result contradictions | Logic rule engine check |

### 10.4 Executability Standards (P2)

| Check Item | Standard | Check Method |
|-----------|----------|-------------|
| Acceptance format | Given-When-Then format correct | Format regex matching |
| Judgment clarity | Then result can be objectively judged | Judgment condition testability check |
| Coverage completeness | Happy Path + boundary + exception | Coverage rate statistical analysis |

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact | Data Acquisition Instructions |
|--------------|-----------------|---------------|-------------------------------|
| insight_analysis missing | Supplement user insights based on user description and opportunity_definition, mark "Insight data pending supplementation" | Section 2 user needs section simplified, requirements collection may be less complete | Request user to provide user insight descriptions or upload insight-analysis.json file |
| opportunity_definition missing | Infer opportunities and priorities based on user description and insight_analysis, mark "Priorities pending confirmation" | Requirements understanding and prioritization may be less precise | Request user to provide opportunity definition and priority descriptions or upload opportunity-definition.json file |
| Both insight_analysis and opportunity_definition missing | Execute built-in requirements collection, understanding, and prioritization based on user verbal description (Step 1-3), mark "Requirements management data is AI-inferred" | Full requirements management process relies on AI inference, confidence reduced | Request user to provide core requirements, target users, and priority ranking |
| exploration_outputs missing | Background & Goals section marked "Pending supplementation", simplified version based on user description | Section 2 content simplified | Request user to provide product background and goal descriptions or upload exploration stage output files |
| strategy_outputs missing | OKR alignment and priority judgment section marked "Pending supplementation" | Section 2.2 goal definition simplified | Request user to provide strategic goals and OKR or upload strategy stage output files |
| ideation_outputs missing | Solution design section marked "Pending supplementation", feature list generated based on user description | Section 3 feature specifications simplified | Request user to provide feature solution descriptions or upload ideation stage output files |
| design_outputs missing | Interaction logic and state design marked "Pending supplementation" | Section 3.2 interaction logic simplified | Request user to provide interaction design descriptions or upload design stage output files |
| metrics_outputs missing | Data tracking plan marked "Pending supplementation" | Section 6 content simplified | Request user to provide core metrics and tracking requirements or upload metrics stage output files |
| All upstream missing | Generate simplified PRD-L based on user verbal description (200-500 words), with built-in requirements collection, understanding, and prioritization | Output PRD-L level document | Request user to provide product requirements description, core features, and target users |

### Data Acquisition Instructions

When upstream files are missing, users need to provide the following information to support degraded generation:
- **Product requirements description**: What are the core requirements, what problem is being solved
- **Target users**: Who is the product's target user group
- **Core feature list**: Main feature points that need to be implemented

## Upstream Change Response

When upstream input changes occur, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------------|-------------|-------------------|
| User insight addition/change | User requirements section in PRD | Mark affected requirement items, suggest human confirmation on whether to update PRD |
| Business model change | Business model section in PRD | Mark affected business logic, suggest human confirmation on whether to update PRD |
| OKR adjustment | Goals and metrics section in PRD | Mark affected metric definitions, suggest human confirmation on whether to update PRD |

When PRD itself changes, downstream notification mechanism:

| PRD Change Type | Notification Scope | Notification Method |
|----------------|-------------------|---------------------|
| Feature point addition/removal | change-impact-analysis | Mark change impact scope, trigger change impact analysis |
| Priority adjustment | change-impact-analysis | Mark priority change, trigger impact assessment |
| Goal metric change | metrics-system, tracking-plan | Mark metric change, trigger metrics system update |
| Business logic change | business-model-canvas, business-strategy-report | Mark business logic change, trigger strategy document update |
