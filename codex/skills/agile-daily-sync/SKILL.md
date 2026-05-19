---
name: agile-daily-sync
description: "Use when automating the daily standup process. Automates Daily Sync with pre-meeting AI preparation (progress summary, blocker identification, daily work item suggestions), in-meeting human sync, and post-meeting AI processing (records, action items, risk flags). Keywords: daily standup, Daily Sync, progress sync, blocker tracking, agile daily, standup."
metadata:
  module: "Project Management & Execution"
  sub-module: "Agile Execution"
  type: "pipeline"
  version: "1.0"
  trigger_examples:
    - "Daily standups take too much time"
    - "How to run standups efficiently"
    - "Help me prepare today's standup content"
---

# Daily Sync Automation

## Core Principles

1. **Transparency Enables Collaboration**: Daily progress and blocker status are visible to all in real-time, eliminating information silos
2. **Risk Early Identification**: Expose blockers and risks during Daily Sync, rather than waiting until Review to discover issues
3. **Automated Tracking**: Blocker tracking and action item completion status are automatically updated

## Interaction Mode

**AI AI Auto-execution (human participation required for sync meeting)**

- **Pre-meeting**: AI automatically generates reporting materials (Step 1-3)
- **In-meeting**: Humans participate in brief sync (assisted by AI-generated materials)
- **Post-meeting**: AI automatically completes recording and follow-up (Step 4-6)

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| sprint_backlog | object | Yes | output/pm-project/agile-sprint-planning/sprint_plan | Current Sprint Stories |
| team_assignments | object | Yes | output/pm-project/agile-sprint-planning/sprint_plan | Team member task assignments |
| previous_daily_sync | object | Yes | output/pm-project/agile-daily-sync/daily_sync | Previous Daily Sync status |
| blocker_log | object[] | O | output/pm-project/agile-daily-sync/blocker_log | Recorded blockers list |
| current_date | ISO date | Yes | System generated | Current date |

---

## Execution Steps

### Pre-meeting AI: Preparation Phase

#### Step 1: Progress Auto-summary

**Actions**:
- Scan all Stories for status updates
- Summarize yesterday's completions
- Calculate Sprint progress (completion rate, remaining points)
- Generate visual progress summary

**Output**:
```json
{
  "progress_summary": {
    "date": "ISO date",
    "sprint_progress": {
      "total_stories": number,
      "completed_stories": number,
      "in_progress_stories": number,
      "completion_rate": 0.0-1.0
    },
    "story_points_progress": {
      "planned": number,
      "completed": number,
      "remaining": number,
      "velocity_pace": "on_track | at_risk | behind"
    },
    "yesterday_completions": [{
      "story_id": "string",
      "title": "string",
      "completed_by": "string"
    }],
    "in_progress_items": [{
      "story_id": "string",
      "title": "string",
      "assignee": "string",
      "progress_percentage": 0-100
    }]
  }
}
```

#### Step 2: Blocker Auto-identification

**Actions**:
- Check active blockers in blocker_log
- Analyze tasks without updates (potential blocker signals)
- Cross-validate blocker status
- Assess blocker impact

**Output**:
```json
{
  "blockers_identified": [{
    "blocker_id": "BLK-001",
    "description": "string",
    "affected_stories": ["string"],
    "severity": "critical | high | medium | low",
    "duration_days": number,
    "current_status": "open | in_progress | resolved",
    "resolution_path": "string"
  }],
  "blocker_summary": {
    "total_blockers": number,
    "critical_blockers": number,
    "avg_blocker_age_days": number,
    "blocker_resolution_rate": 0.0-1.0
  }
}
```

#### Step 3: Daily Work Item Suggestions

**Actions**:
- Generate today's work suggestions based on progress and blockers
- Prioritize critical path tasks
- Prioritize resolving high-priority blockers
- Consider team members' current status

**Output**:
```json
{
  "suggested_items": [{
    "story_id": "string",
    "title": "string",
    "assignee": "string",
    "priority": "high | medium | low",
    "suggested_action": "string",
    "reason": "string"
  }]
}
```

### In-meeting Human: Brief Sync

**Human Sync Points**:
- Each person 1-2 minutes update (yesterday completed, today planned, blockers)
- Focus on key blockers and risks
- Quick alignment, no deep discussion (handle after meeting)

### Post-meeting AI: Follow-up Phase

#### Step 4: Meeting Notes Auto-generation

**Actions**:
- Compile sync meeting content
- Record each person's update highlights
- Compile discussion decisions
- Generate meeting summary

**Output**:
```json
{
  "meeting_notes": {
    "date": "ISO date",
    "attendees": ["string"],
    "updates": [{
      "person": "string",
      "yesterday": "string",
      "today": "string",
      "blockers": ["string"]
    }],
    "discussions": [{
      "topic": "string",
      "outcome": "string"
    }],
    "summary": "string"
  }
}
```

#### Step 5: Action Items Auto-extraction

**Actions**:
- Identify action items from meeting content
- Assign owners and due dates
- Update action item tracking

**Output**:
```json
{
  "action_items": [{
    "id": "AI-001",
    "description": "string",
    "owner": "string",
    "due_date": "ISO date",
    "source": "daily_sync",
    "priority": "high | medium | low"
  }]
}
```

#### Step 6: Risk Flag Auto-update

**Actions**:
- Update risk status based on Daily Sync
- Flag newly emerging risk signals
- Update severity of existing risks
- Trigger necessary escalations

**Output**:
```json
{
  "risk_flags": [{
    "flag_id": "RF-001",
    "description": "string",
    "signal_source": "string",
    "severity": "critical | high | medium | low",
    "recommended_action": "string",
    "escalation_needed": boolean
  }],
  "risk_trend": {
    "total_flags": number,
    "trend": "increasing | stable | decreasing",
    "critical_count_change": number
  }
}
```

---

## Output

**Storage Path**: `output/pm-project/agile-daily-sync/`

**Output Files**: daily_sync.json, metadata.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["daily_sync", "metadata"],
  "properties": {
    "daily_sync": {"type": "object", "description": "Daily sync data including progress, blockers, suggestions, and action items"},
    "metadata": {"type": "object", "description": "Metadata including date, Sprint ID, and generation time"}
  }
}
```

```json
{
  "daily_sync": {
    "progress_summary": {},
    "blockers_identified": {},
    "suggested_items": {},
    "meeting_notes": {},
    "action_items": {},
    "risk_flags": {}
  },
  "metadata": {
    "date": "ISO date",
    "sprint_id": "string",
    "generated_at": "ISO datetime",
    "meeting_completed": boolean,
    "attendees_count": number
  }
}
```

---

## Daily Sync Duration Recommendations

| Team Size | Recommended Duration |
|----------|----------|
| <= 5 people | 10-15 minutes |
| 6-10 people | 15-20 minutes |
| > 10 people | Consider split sync |

---

## Decision Rules

| Condition | Action |
|------|------|
| Critical blocker unresolved for > 3 days | Trigger escalation notification |
| Sprint progress behind > 20% | Trigger risk flag, notify SM |
| New risk is Critical level | Immediately escalate to project manager |
| Daily Sync participation rate < 70% | Remind and record absences |

## Quality Checks

- [ ] Progress summary covers all in-progress Stories
- [ ] Blocker items have clear status and follow-up owners
- [ ] Risk flags are timely and accurate
- [ ] Sync materials generated before meeting

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Sprint progress data | User describes current progress (completed/in-progress/blocked items), AI generates Sync materials | Sync materials based on user description, lacking system data validation |
| Team task assignments | Skip per-person progress summary, output overall progress only | No individual-level progress summary |
| Previous Sync status | Skip period-over-period analysis, output current status snapshot only | Current status snapshot report, no trend comparison |
| Blocker log | User verbally describes current blockers, AI compiles into structured blocker list | Blocker list based on user verbal description |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Sprint progress data missing**: Ask user to describe current progress, including: completed Stories, in-progress Stories, issues encountered; AI will generate Daily Sync reporting materials based on the description
2. **Blocker log missing**: Ask user to verbally describe current blockers and obstacles; AI will compile into structured blocker list and assess impact
3. **Previous Sync status missing**: Skip period-over-period analysis, output current Sprint status snapshot only; cannot provide progress trend comparison

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| sprint_summary | object | Yes | Sprint progress summary, must contain total_stories/completed/in_progress/blocked |
| blockers | array | Yes | Blocker list, each must contain description/owner/status |
| action_items | array | No | Action items list, each must contain action/owner/due_date |
| sync_material | object | No | Sync reporting materials |

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Source | Change Type | Impact Scope | Response Action |
|----------|----------|----------|----------|
| agile-sprint-planning | Sprint plan change | Progress summary and Story status | Update Sprint scope and completion rate calculation |
| Project management system | Story status change | Progress summary and blocker identification | Recalculate completion rate and blocked items |

### Downstream Notification Mechanism Table

| Downstream Consumer | Notification Condition | Notification Method | Notification Content |
|------------|----------|----------|----------|
| agile-review | Daily Sync completed | Write to output file | Progress summary and blocker list |
| agile-orchestrator | Sync materials generated | Output file updated | Completion status and key blockers |
