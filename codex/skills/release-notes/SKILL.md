---
name: release-notes
description: "Use when releasing a product version. Automated release notes generation, based on change records and PRD diffs, generating user/customer-facing version update notes, supporting multi-language and multi-platform formats. Keywords: release notes, Release Notes, changelog, version update, update notes, release description, what was updated."
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Release & Go-live"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Help me write version update notes"
    - "Generate release notes"
    - "What was updated in this version, organize it"
---

# Version Release Notes Auto-Generation

## Core Principles

1. **User perspective** -- Users care about "what impact does this have on me", not "what code changed"
2. **Tiered presentation** -- Important changes highlighted, minor changes not buried
3. **Honest and transparent** -- Known issues not hidden, breaking changes communicated in advance
4. **Action-oriented** -- What users need to do (upgrade/configure/attention) must be clear

## Interaction Mode

AI->Human AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|------------|------|----------|--------|-------------|
| Requirement Change Log | Markdown/JSON | No | output/pm-monitoring/release-auto-checklist/release_checklist.json | Requirement changes for this version |
| PRD Document | Markdown | No | output/pm-design/design-prd/prd.md | Product requirements reference |
| SRS Document | Markdown | No | output/pm-design/design-prd/prd.md | Requirements specification reference (already covered by design-prd) |
| Version Number | string | Yes | User provided | e.g., v2.3.0 |
| Release Date | string | Yes | User provided | e.g., 2025-03-15 |
| Release Type | string | Yes | User provided | major / minor / patch / hotfix |
| Target Audience | string | No | User provided | End users / Enterprise customers / Developers / Internal team |

## Execution Steps

### Step 1: Change Collection & Classification

Collect all changes for this version and classify by type:

**Change Classification System**:

| Category | Icon | Description | Example |
|----------|------|-------------|---------|
| [NEW] New Feature | [SPARKLE] | New product features | Added social sharing feature |
| [REFRESH] Improvement | [WRENCH] | Optimization of existing features | Search speed improved 3x |
| [BUG] Fix | [BUG] | Bug fixes | Fixed login page blank screen issue |
| [!] Breaking Change | [IMPACT] | Changes requiring user adaptation | API v1 deprecated, please migrate to v2 |
| [TRASH] Deprecation | [TRASH] | Feature/API removal | Removed legacy export feature |
| [LOCK] Security | [LOCK] | Security-related fixes | Fixed XSS vulnerability |

**Change Source Mapping**:

| Change Source | Extraction Method |
|--------------|-------------------|
| requirements-change-log | Extract approved requirement changes from change log |
| PRD diff | Compare new and old PRD to extract feature changes |
| User provided | User directly describes change content |

### Step 2: User Impact Assessment

Assess the impact of each change on users:

**Impact Level**:

| Level | Definition | Position in Release Notes |
|-------|------------|--------------------------|
| [RED] High Impact | Changes core user workflow or requires user action | Top "Important Changes" section |
| [YELLOW] Medium Impact | Improves experience but no mandatory action | Listed by category |
| [GREEN] Low Impact | Optimization imperceptible to users | Collapsed section |

**User Action Items**:

| Action Type | Description | Example |
|-------------|-------------|---------|
| Required Action | Not doing so affects usage | Please reconfigure API key |
| Recommended Action | Doing so improves experience | Recommend updating mobile app to latest version |
| No Action Needed | Takes effect automatically | Performance optimization auto-applied |

### Step 3: Multi-Format Generation

Generate release notes in different styles based on target audience:

**Format A: End User Edition** (concise, emotional)

```
## [SPARKLE] New Features
- **Social Sharing**: One-click share to WeChat/Weibo, let friends use the great tool too
- **Dark Mode**: Late night work easier on the eyes, toggle in settings

## [WRENCH] Improvements
- Search speed improved 3x, results appear as you type
- List loading smoother, goodbye lag

## [BUG] Fixes
- Fixed occasional login failure issue
- Fixed export file name garbled text issue
```

**Format B: Enterprise Customer Edition** (professional, structured)

```
## New Features
| Feature | Description | Impact Scope |
|---------|-------------|--------------|
| Social Sharing | Support sharing to Enterprise WeChat/DingTalk | All platforms |
| Dark Mode | System-level dark mode adaptation | Desktop |

## Improvements
| Improvement | Optimization | Performance Gain |
|-------------|-------------|------------------|
| Search Engine | Rebuilt indexing algorithm | Response time -70% |

## Security Fixes
- CVE-2025-XXXX: Fixed XSS vulnerability (High)
- Updated dependency library versions, fixed known security vulnerabilities

## Breaking Changes
- API v1 will be deprecated on 2025-06-30, please migrate to API v2
  Migration guide: [Link]

## Known Issues
- Safari 14 occasional style misalignment, fixed in next version
```

**Format C: Developer Edition** (technical, detailed)

```
## Breaking Changes
- `POST /api/v1/users` -> `POST /api/v2/users` (added required field `tenant_id`)
- Removed `GET /api/v1/export` (use `GET /api/v2/export` instead)

## New APIs
- `POST /api/v2/share` -- Social sharing endpoint
- `GET /api/v2/preferences/theme` -- Theme preference endpoint

## Changelog
- feat: Added social sharing module
- perf: Search engine index rebuild, response time optimized 70%
- fix: Fixed login Token not auto-refreshing after expiry
- security: Fixed XSS vulnerability CVE-2025-XXXX
```

### Step 4: Version Information Assembly

**Version Information Header**:

```
# {Product Name} v{Version} Release Notes

[CALENDAR] Release Date: {Date}
[LABEL] Version Type: {major/minor/patch/hotfix}
[LINK] Upgrade Guide: {Link}
[LIST] Full Changelog: {Link}
```

**Version Number Semantics**:

| Type | Semantics | User Expectation |
|------|-----------|------------------|
| major | Major update, may have breaking changes | Expect new experience, watch migration cost |
| minor | Feature update, backward compatible | Expect new features |
| patch | Bug fixes, backward compatible | Expect stability improvement |
| hotfix | Emergency fix | Expect issue resolution |

### Step 5: Document Assembly

**Complete Release Notes Structure**:

```
# {Product Name} v{Version} Release Notes

## [!] Important Changes (if breaking changes or required actions)
- ...

## [SPARKLE] New Features
- **Feature Name**: Description (Impact Level)
- ...

## [WRENCH] Improvements
- Description (Impact Level)
- ...

## [BUG] Fixes
- Description
- ...

## [LOCK] Security Fixes (if any)
- Description

## [TRASH] Deprecation Notices (if any)
- Description and alternative

## [!] Known Issues (if any)
- Description and workaround

## [LIST] Upgrade Guide (if needed)
### Prerequisites
### Upgrade Steps
### Rollback Plan

## Acknowledgments (optional)
```

## Output

**Storage path**: `output/pm-monitoring/release-notes/`

**Output Files**:

| File | Format | Description |
|------|--------|-------------|
| release-notes-v{version}.md | Markdown | Complete release notes (end user edition) |
| release-notes-v{version}-enterprise.md | Markdown | Enterprise customer edition |
| release-notes-v{version}-developer.md | Markdown | Developer edition |
| release-notes-v{version}.json | JSON | Structured data |

**Output Schema**:

```json
{
  "type": "object",
  "required": ["version", "release_date", "release_type", "changes"],
  "properties": {
    "version": {"type": "string", "description": "Version number"},
    "release_date": {"type": "string", "description": "Release date"},
    "release_type": {"type": "string", "description": "Release type: major/minor/patch/hotfix"},
    "target_audience": {"type": "string", "description": "Target audience"},
    "high_impact_changes": {"type": "array", "description": "High impact change list"},
    "changes": {"type": "object", "description": "Change list, classified by category"},
    "known_issues": {"type": "array", "description": "Known issues list"},
    "breaking_changes": {"type": "array", "description": "Breaking changes list"},
    "upgrade_guide": {"type": "object", "description": "Upgrade guide"}
  }
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|------------|------|----------|-------------|
| release_notes | object | Yes | Release notes root object |
| release_notes.version | string | Yes | Version number |
| release_notes.release_date | string | Yes | Release date |
| release_notes.highlights | array | Yes | Core highlights list, at least 1 item |
| release_notes.highlights[].title | string | Yes | Highlight title |
| release_notes.highlights[].description | string | Yes | Highlight description |
| release_notes.highlights[].target_audience | string | Yes | Target audience |
| release_notes.changes | object | Yes | Change classification |
| release_notes.changes.new_features | array | Yes | New features list |
| release_notes.changes.improvements | array | Yes | Improvements list |
| release_notes.changes.bug_fixes | array | Yes | Fixes list |
| release_notes.changes.breaking_changes | array | No | Breaking changes list |
| release_notes.changes.deprecations | array | No | Deprecation list |
| release_notes.upgrade_guide | object | Conditional | Upgrade guide, required when breaking_changes exist |
| release_notes.known_issues | array | No | Known issues list |
| release_notes.acknowledgments | array | No | Acknowledgments list |

## Upstream Change Response

| Upstream Change | Impact Scope | Response Strategy |
|-----------------|--------------|-------------------|
| PRD requirement change | New features and improvement descriptions | Update change classification and descriptions, mark for human confirmation |
| Gradual rollout results | Known issues and upgrade guide | Update known issues list, supplement upgrade notes |
| Acceptance report change | Change classification and completeness | Re-evaluate change classification, ensure all changes covered |
| Checklist change | Release notes completeness | Update release notes, ensure consistency with checklist |

## Decision Rules

| Condition | Decision |
|-----------|----------|
| Breaking changes exist | Must be prominently displayed in top "Important Changes" section |
| Security fixes exist | Must include security fixes section, note CVE numbers |
| Change items > 20 | Sort by impact level, collapse low impact |
| hotfix type | Only list fix items, no new features or improvements |
| major version | Must include upgrade guide and rollback plan |

## Quality Checks

- [ ] Version number and date correct
- [ ] Changes classified by category
- [ ] Breaking changes highlighted
- [ ] User action items clear
- [ ] Known issues listed
- [ ] Multi-format generated (user/enterprise/developer editions)
- [ ] No technical jargon leaked into end user edition

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|------------------------|------------------|---------------|
| Change log missing | Generate based on user-provided change descriptions | Changes may be incomplete |
| PRD missing | Cannot auto-extract feature changes | Need manual supplement of feature descriptions |
| Target audience not specified | Default generate end user edition | May need to supplement other editions |
