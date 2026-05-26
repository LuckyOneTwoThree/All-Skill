---
name: release-notes
description: Use when you need to generate release notes, changelogs, or version announcements for a product release. Automated release notes generation, based on change records and PRD diffs, generating user/customer-facing version update descriptions, supporting multi-language and multi-platform formats. Keywords: release notes, changelog, version update, update description, version announcement, what's new.
metadata:
  module: "Product Monitoring & Iteration"
  sub-module: "Release & Go-Live"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["Internet", "General"]
  trigger_examples:
    - "Help me write version update notes"
    - "Generate release notes"
    - "What's new in this version, organize it"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Directly output release notes and change list"
  deep_description: "Complete notes + change impact analysis + upgrade guide + rollback contingency plan"
---

# Automated Release Notes Generation

## Core Principles

1. **User perspective** — Users care about "what impact does this have on me", not "what code changed"
2. **Tiered presentation** — Important changes are prominent; minor changes are not buried
3. **Honest and transparent** — Known issues are not hidden; breaking changes are communicated in advance
4. **Action-oriented** — What users need to do (upgrade/configure/pay attention) must be explicit

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Requirement change records | Markdown/JSON | ○ | output/pm-monitoring/release-auto-checklist/release_checklist.json | Requirement changes for this version |
| PRD document | Markdown | ○ | output/pm-design/design-prd/prd.md | Product requirement reference |
| SRS document | Markdown | ○ | output/pm-design/design-prd/prd.md | Requirement specification reference (covered by design-prd) |
| Version number | string | Yes | User provided | e.g., v2.3.0 |
| Release date | string | Yes | User provided | e.g., 2025-03-15 |
| Release type | string | Yes | User provided | major / minor / patch / hotfix |
| Target audience | string | ○ | User provided | End users / Enterprise customers / Developers / Internal team |

## Execution Steps

### Step 1: Change Collection & Classification [Core]

Collect all changes for this version and classify by type:

**Change Classification System**:

| Category | Icon | Description | Example |
|------|------|------|------|
| 🆕 New Features | ✨ | Newly added product features | Added social sharing feature |
| 🔄 Improvements | 🔧 | Optimizations to existing features | Search speed improved 3x |
| 🐛 Bug Fixes | 🐛 | Bug fixes | Fixed login page white screen issue |
| ⚠️ Breaking Changes | 💥 | Changes requiring user adaptation | API v1 deprecated, please migrate to v2 |
| 🗑️ Deprecations | 🗑️ | Feature/API removal | Removed legacy export feature |
| 🔒 Security | 🔒 | Security-related fixes | Fixed XSS vulnerability |

**Change Source Mapping**:

| Change Source | Extraction Method |
|----------|---------|
| requirements-change-log | Extract approved requirement changes from change records |
| PRD diff | Compare new and old PRDs to extract feature changes |
| User provided | Changes directly described by the user |

### Step 2: User Impact Assessment [Core]

Assess the impact of each change on users:

**Impact Level**:

| Level | Definition | Position in Release Notes |
|------|------|----------------|
| 🔴 High Impact | Changes user's core workflow or requires user action | Top "Important Changes" section |
| 🟡 Medium Impact | Improves experience but no mandatory action | Listed by category |
| 🟢 Low Impact | Optimizations imperceptible to users | Collapsed section |

**User Action Items**:

| Action Type | Description | Example |
|----------|------|------|
| Required action | Not doing so will affect usage | Please reconfigure your API key |
| Recommended action | Doing so improves experience | Recommend updating mobile app to latest version |
| No action needed | Takes effect automatically | Performance optimization has taken effect automatically |

### Step 3: Multi-format Generation [Core]

Generate release notes in different styles based on target audience:

**Format A: End User Version** (concise, emotive)

```
## ✨ New Features
- **Social Sharing**: One-click share to WeChat/Weibo, let friends discover great tools too
- **Dark Mode**: Easier on the eyes for late-night work, toggle in settings

## 🔧 Improvements
- Search speed improved 3x, results appear as you type
- List loading smoother, say goodbye to lag

## 🐛 Bug Fixes
- Fixed occasional login failure issue
- Fixed garbled export filenames issue
```

**Format B: Enterprise Customer Version** (professional, structured)

```
## New Features
| Feature | Description | Impact Scope |
|------|------|---------|
| Social Sharing | Supports sharing to Enterprise WeChat/DingTalk | All platforms |
| Dark Mode | System-level dark mode adaptation | Desktop |

## Improvements
| Improvement | Optimization Content | Performance Gain |
|--------|---------|---------|
| Search Engine | Rebuilt indexing algorithm | Response time -70% |

## Security Fixes
- CVE-2025-XXXX: Fixed XSS vulnerability (High severity)
- Updated dependency library versions, fixed known security vulnerabilities

## Breaking Changes
- API v1 will be deprecated on 2025-06-30, please migrate to API v2
  Migration guide: [Link]

## Known Issues
- Occasional style misalignment on Safari 14, fix in next version
```

**Format C: Developer Version** (technical, detailed)

```
## Breaking Changes
- `POST /api/v1/users` → `POST /api/v2/users` (new required field `tenant_id`)
- Removed `GET /api/v1/export` (use `GET /api/v2/export` instead)

## New APIs
- `POST /api/v2/share` — Social sharing endpoint
- `GET /api/v2/preferences/theme` — Theme preference endpoint

## Changelog
- feat: Added social sharing module
- perf: Search engine index rebuild, response time optimized 70%
- fix: Fixed login token not auto-refreshing after expiration
- security: Fixed XSS vulnerability CVE-2025-XXXX
```

### Step 4: Version Information Assembly [Core]

**Version Information Header**:

```
# {Product Name} v{Version} Release Notes

📅 Release Date: {Date}
🏷️ Version Type: {major/minor/patch/hotfix}
🔗 Upgrade Guide: {Link}
📋 Full Changelog: {Link}
```

**Version Number Semantics**:

| Type | Semantics | User Expectation |
|------|------|---------|
| major | Major update, may have breaking changes | Expect new experience, mindful of migration cost |
| minor | Feature update, backward compatible | Expect new features |
| patch | Bug fixes, backward compatible | Expect stability improvement |
| hotfix | Emergency fix | Expect issue resolution |

### Step 5: Document Assembly [Core]

**Complete Release Notes Structure**:

```
# {Product Name} v{Version} Release Notes

## ⚠️ Important Changes (if breaking changes or required actions exist)
- ...

## ✨ New Features
- **Feature name**: Description (impact level)
- ...

## 🔧 Improvements
- Description (impact level)
- ...

## 🐛 Bug Fixes
- Description
- ...

## 🔒 Security Fixes (if any)
- Description

## 🗑️ Deprecation Notices (if any)
- Description and alternatives

## ⚠️ Known Issues (if any)
- Description and workarounds

## 📋 Upgrade Guide (if needed)
### Prerequisites
### Upgrade Steps
### Rollback Plan

## Acknowledgments (optional)
```

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Release notes and change list | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Full output including all Step outputs |
| deep | Complete notes + change impact analysis + upgrade guide + rollback contingency plan | Complete output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-monitoring/release-notes/`

**Output Files**:

| File | Format | Description |
|------|------|------|
| release-notes-v{version}.md | Markdown | Complete release notes (end user version) |
| release-notes-v{version}-enterprise.md | Markdown | Enterprise customer version |
| release-notes-v{version}-developer.md | Markdown | Developer version |
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
    "changes": {"type": "object", "description": "Change list, classified by category", "properties": {"new_features": {"type": "array"}, "improvements": {"type": "array"}, "bug_fixes": {"type": "array"}}},
    "known_issues": {"type": "array", "description": "Known issues list"},
    "breaking_changes": {"type": "array", "description": "Breaking changes list"},
    "upgrade_guide": {"type": "object", "description": "Upgrade guide"}
  }
}
```

**release-notes.json Structure**:

```json
{
  "version": "2.3.0",
  "release_date": "2025-03-15",
  "release_type": "minor",
  "target_audience": "End Users",
  "high_impact_changes": [],
  "changes": [
    {
      "category": "New Feature/Improvement/Fix/Security/Deprecation/Breaking Change",
      "title": "Change title",
      "description": "Change description",
      "impact_level": "High/Medium/Low",
      "user_action": "Required action/Recommended action/No action needed",
      "related_requirement": "FR-XXX"
    }
  ],
  "known_issues": [],
  "breaking_changes": [],
  "upgrade_guide": {}
}
```

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
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
| release_notes.changes.bug_fixes | array | Yes | Bug fixes list |
| release_notes.changes.breaking_changes | array | No | Breaking changes list |
| release_notes.changes.deprecations | array | No | Deprecated features list |
| release_notes.upgrade_guide | object | Conditionally required | Upgrade guide, required when breaking_changes exist |
| release_notes.known_issues | array | No | Known issues list |
| release_notes.acknowledgments | array | No | Acknowledgments list |

## Upstream Change Response

When upstream inputs change, this skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| PRD requirement change | New features and improvement descriptions | Update change classification and descriptions, mark for human confirmation |
| Gradual release result | Known issues and upgrade guide | Update known issues list, supplement upgrade notes |
| Acceptance report change | Change classification and completeness | Re-evaluate change classification, ensure all changes are covered |
| Checklist change | Release notes completeness | Update release notes, ensure consistency with checklist |

When the release notes themselves change, the downstream notification mechanism:

| Notes Change Type | Notification Scope | Notification Method |
|-------------|----------|----------|
| New breaking change added | All downstream | Mark breaking change, trigger impact assessment |
| New known issue added | agile-review | Mark known issue, trigger review input |
| Version number changed | release-gradual | Mark version change, trigger gradual configuration update |

---

## Decision Rules

| Condition | Decision |
|------|------|
| Has breaking changes | Must be prominently displayed in the top "Important Changes" section |
| Has security fixes | Must include security fixes section, annotate CVE numbers |
| Change items > 20 | Sort by impact level, collapse low impact items |
| hotfix type | Only list fix items, do not list new features and improvements |
| major version | Must include upgrade guide and rollback plan |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Version number and date correct
- [ ] Changes classified by category

### P1 Checks (must pass for standard/deep)

- [ ] Breaking changes prominently displayed
- [ ] User action items explicit
- [ ] Known issues listed
- [ ] Multiple formats generated (user/enterprise/developer versions)
- [ ] No technical terminology leaked into end user version

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep inference and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Change records missing | Generate based on user-provided change descriptions | Changes may be incomplete |
| PRD missing | Cannot automatically extract feature changes | Manual supplementation of feature descriptions needed |
| Target audience not specified | Default to generating end user version | Other versions may need to be supplemented |
