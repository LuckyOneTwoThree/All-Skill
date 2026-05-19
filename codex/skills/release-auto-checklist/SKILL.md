---
name: release-auto-checklist
description: "Use when generating release checklists. Release Checklist auto-generation and tracking, automatically generating T-7/T-1/during-release/T+24h/T+72h checklists with item-by-item auto-checking and human confirmation, supporting incomplete item alerts and status tracking. Keywords: release Checklist, release check, release process, release tracking, release preparation, release checklist, go-live checklist, release verification."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Release & Go-live"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me list a pre-release checklist"
    - "Generate a release Checklist"
    - "Organize what needs to be checked before going live"
execution_depth:
  default: standard
  quick_description: "Output release checklist and critical checks only"
  deep_description: "Full checklist + compliance verification + rollback decision tree + release process optimization"
---

# Release Checklist Auto-Generation & Tracking

## Core Principles

1. **Trigger-driven**: Auto-triggered by release plan creation events, scheduled checks auto-execute
2. **Automated acceptance**: Check items auto-execute, incomplete items auto-alert, status auto-tracked
3. **Continuous deployment**: Checklist linked with release process, P0 items incomplete auto-block release
4. **Real-time review**: Checklist completion status aggregated in real-time, risk items exposed immediately

## Interaction Mode

AI **AI auto-execution**

Trigger Conditions:
- Release plan created (T-7 start)
- Scheduled check (hourly)
- Manual trigger (release lead request)

## Release Phase Definition

| Phase | Time Point | Purpose |
|-------|------------|---------|
| T-7 | 7 days before release | Preparation checklist, risk identification |
| T-1 | 1 day before release | Final confirmation, readiness check |
| T-0 | During release | Execute release, real-time monitoring |
| T+24h | 24 hours post-release | Stability confirmation |
| T+72h | 72 hours post-release | Effectiveness evaluation |

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Release Content | JSON | Yes | Release management system | Release version and change content |
| Checklist Template | JSON | Yes | Release strategy library | Checklist templates for each phase |
| Release Plan | JSON | Yes | Project management | Release time and responsible parties |
| Release History | JSON | Yes | Release history library | Used for generating personalized check items |

## Execution Steps

### Step 1: Checklist Template Generation [Core]

#### 1.1 Template Loading

**Template Sources**:

| Source | Description |
|--------|-------------|
| Standard Template | Generic templates from release strategy library |
| Project Template | Templates customized for specific projects |
| Release Type Template | feature_release/hotfix/config_change |
| Historical Template | Auto-generated based on historical releases |

#### 1.2 Personalization Adjustment

**Adjustment Rules**:

| Adjustment Dimension | Adjustment Basis |
|---------------------|------------------|
| Service Scope | affected_services determines which services need checking |
| Change Type | change_type determines special check items |
| Release History | Historical issues determine items needing extra attention |
| Team Configuration | Responsible parties determine notification chain |

### Step 2: Phase-by-Phase Checklist Generation [Core]

Generate checklists for T-7, T-1, T-0, T+24h, and T+72h phases with appropriate check items, priorities, and auto-check configurations per phase.

### Step 3: Item-by-Item Auto-Check [Core]

Execute automated checks for items with auto-check configurations, track results and evidence.

### Step 4: Incomplete Item Alerts [Core]

Generate alerts for incomplete items based on severity and proximity to release time.

### Step 5: Status Tracking [Conditional]

Aggregate completion status across all phases, visualize progress, and identify risk indicators.

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | release checklist and critical checks only | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full checklist + compliance verification + rollback decision tree + release process optimization | Full deliverables + extended analysis + deep simulation |

## Output

**Storage path**: `output/pm-monitoring/release-auto-checklist/`

**Output file**: `release_checklist.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["output_id", "release_id", "checklist", "completion_status"],
  "properties": {
    "output_id": {"type": "string", "description": "Output unique identifier"},
    "release_id": {"type": "string", "description": "Release ID"},
    "generated_at": {"type": "string", "description": "Generation time"},
    "checklist": {"type": "object", "description": "Complete checklist for each phase"},
    "completion_status": {"type": "object", "description": "Completion status summary"},
    "pending_alerts": {"type": "array", "description": "Pending alert list"},
    "risk_assessment": {"type": "object", "description": "Risk assessment"}
  }
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| release_checklist | object | Yes | Release checklist root object |
| release_checklist.version | string | Yes | Release version number |
| release_checklist.items | array | Yes | Check item list |
| release_checklist.items[].id | string | Yes | Check item ID |
| release_checklist.items[].category | string | Yes | Check category, enum: code_quality/testing/security/compliance/infrastructure/monitoring |
| release_checklist.items[].description | string | Yes | Check description |
| release_checklist.items[].status | string | Yes | Status, enum: pass/fail/pending/waived |
| release_checklist.items[].severity | string | Yes | Severity level, enum: blocker/warning/info |
| release_checklist.gate_result | string | Yes | Gate result, enum: go/no_go/conditional |
| release_checklist.blockers | array | Yes | Blocking items list |
| release_checklist.risk_summary | object | Yes | Risk summary |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|--------------|-------------------|
| Acceptance report change | Check item status | Update acceptance-related check item status, re-evaluate gate result |
| Test report change | Test category check items | Update test-related check item status |
| Security assessment change | Security category check items | Update security-related check item status, re-evaluate blocking items |
| Gradual release strategy change | Infrastructure category check items | Update infrastructure check items |

## Decision Rules

### Release Blocking Rules

| Condition | Decision |
|-----------|----------|
| P0 blocking items exist at T-0 | **Immediately block release** |
| P0 incomplete items exist at T-0 | **Delay release** |
| P0 metrics not meeting target at T+24h | **Trigger post-incident review** |

### Pass Conditions

| Condition | Requirement |
|-----------|-------------|
| P0 item completion rate | 100% |
| P1 item completion rate | >= 80% |
| Pre-release alerts resolved | 100% |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] P0 item completion rate (100%)
- [ ] Alert handling rate (100%)

### P1 Checks (must pass for standard/deep)

- [ ] Manual confirmation completeness (All manual items confirmed)

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact |
|---------------|------------------|---------------|
| Release content missing | User provides release scope -> generate standard Checklist | Checklist has no personalization, uses generic template |
| Monitoring configuration missing | Skip monitoring-related auto-check items, mark as "needs manual confirmation" | T+24h/T+72h monitoring check items need manual execution |
| Both release content + monitoring configuration missing | User provides release scope -> generate standard Checklist | Output standard Checklist template, auto-check items marked "pending configuration" |

### Data Acquisition Instructions

When upstream files are missing, user needs to provide the following information to support degraded generation:
- **Release scope**: Services, modules and change types involved in this release
- **Release time** (optional): Planned release time window
- **Owner information** (optional): Owner list for each role
