---
name: planning-kickoff
description: Use when preparing and executing project Kickoff meetings. Kickoff meeting automation, including pre-meeting AI preparation (agenda generation, background material compilation, question list pre-preparation), in-meeting human facilitation, post-meeting AI processing (minutes generation, action item extraction, follow-up reminder setup). Keywords: Kickoff, project launch, launch meeting, action items, project kickoff meeting, startup meeting, project initiation.
metadata:
  module: "Project Management & Execution"
  sub-module: "Project Planning"
  type: "pipeline"
  version: "3.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Project is starting, how to hold the meeting"
    - "How to prepare for kickoff meeting"
    - "How to run a project kickoff meeting"
  interaction_mode: "human_ai_collaborate"
execution_depth:
  default: standard
  quick_description: "Directly output project kickoff plan and goals"
  deep_description: "Complete kickoff + team alignment plan + risk contingency plan + communication mechanism design"
---

# Kickoff Meeting Automation

## Core Principles

1. **Transparency is Collaboration**: Meeting agenda, background materials, action items are visible to all, ensuring information synchronization
2. **Risk Early Warning**: Pre-identify potential problems and risks before the meeting, ensuring efficient discussion of key topics
3. **Automated Tracking**: Action item extraction, follow-up reminders, completion status automatically tracked

## Interaction Mode

**🤖 AI-Assisted (Kickoff requires human facilitation)**

- **Pre-meeting**: AI automatically completes all preparation work (Step 1-3)
- **In-meeting**: Human facilitates the meeting, AI provides real-time assistance (e.g., real-time Q&A suggestions)
- **Post-meeting**: AI automatically completes minutes and follow-up (Step 4-6)

---

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| project_charter | object | Yes | output/pm-project/planning-project-charter/project_charter | Project charter |
| resource_plan | object | Yes | output/pm-project/planning-resource/resource_plan | Resource plan |
| meeting_attendees | string[] | Yes | User provided | Meeting attendee list |
| preferred_meeting_time | string | No | User provided | Preferred meeting time |

---

## Execution Steps

### Pre-meeting AI: Preparation Phase

#### Step 1: Agenda Auto-Generation

**Actions**:
- Generate meeting agenda based on project charter and resource plan
- Assign duration for each agenda item
- Mark the responsible person for each item
- Ensure key information is not missed

**Output**:
```json
{
  "agenda": {
    "meeting_title": "string",
    "duration_minutes": number,
    "items": [{
      "order": 1,
      "topic": "string",
      "duration_minutes": number,
      "presenter": "string",
      "key_points": ["string"],
      "decision_needed": boolean
    }],
    "buffer_minutes": number
  }
}
```

#### Step 2: Background Materials Auto-Compilation

**Actions**:
- Summarize core content of project charter into 1-page summary
- Organize resource plan highlights
- Collect related document links
- Generate visual project overview

**Output**:
```json
{
  "background_materials": {
    "executive_summary": "string (< 500 words)",
    "project_overview": {
      "objectives": ["string"],
      "scope": ["string"],
      "timeline": "string",
      "team": ["string"]
    },
    "key_risks": ["string"],
    "success_criteria": ["string"],
    "document_links": [{
      "title": "string",
      "url": "string",
      "description": "string"
    }]
  }
}
```

#### Step 3: Question List Pre-Preparation

**Actions**:
- Identify common questions based on project background
- Predict questions stakeholders may care about
- Pre-prepare answer key points
- Mark questions requiring specific people to answer

**Output**:
```json
{
  "prepared_questions": [{
    "question": "string",
    "likely_from": "string",
    "prepared_answer": "string",
    "answer_owner": "string",
    "priority": "high | medium | low"
  }]
}
```

### In-meeting Human: Meeting Facilitation

**Human Facilitation Key Points**:
- Advance meeting according to agenda
- Ensure every key decision has a conclusion
- Record new questions raised during the meeting
- Control time, avoid overtime

### Post-meeting AI: Follow-up Phase

#### Step 4: Meeting Minutes Auto-Generation

**Actions**:
- Receive meeting records (or transcript from recording)
- Extract key discussion points and conclusions
- Organize unresolved issues
- Generate formatted meeting minutes

**Output**:
```json
{
  "minutes": {
    "meeting_info": {
      "title": "string",
      "date": "ISO date",
      "attendees": ["string"],
      "absentees": ["string"]
    },
    "key_decisions": [{
      "decision": "string",
      "decision_maker": "string",
      "date": "ISO date"
    }],
    "discussion_summary": "string",
    "unresolved_issues": ["string"],
    "next_steps": ["string"]
  }
}
```

#### Step 5: Action Items Auto-Extraction

**Actions**:
- Identify action items from meeting minutes
- Extract for each action item: owner, content, due date
- Assign action item IDs
- Establish action item tracking

**Output**:
```json
{
  "action_items": [{
    "id": "AI-001",
    "description": "string",
    "owner": "string",
    "due_date": "ISO date",
    "status": "open | in_progress | completed",
    "priority": "high | medium | low",
    "related_decision": "string | null"
  }]
}
```

#### Step 6: Follow-up Reminder Setup

**Actions**:
- Set reminders based on action item due dates
- Set reminders for key milestones
- Configure reminder recipients
- Generate follow-up plan summary

**Output**:
```json
{
  "follow_up_reminders": [{
    "id": "REM-001",
    "type": "action_item | milestone | check_in",
    "title": "string",
    "due_date": "ISO date",
    "notify": ["string"],
    "reminder_timing": "1 day before | 3 days before | 1 week before",
    "auto_follow_up": boolean
  }],
  "follow_up_schedule": {
    "next_check_in": "ISO date",
    "next_status_review": "ISO date",
    "project_phase_end": "ISO date"
  }
}
```

---

### Output Depth Classification

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | Project kickoff plan and goals | Core conclusions + minimum viable output |
| standard | Complete output (current default) | Complete output, including all Step outputs |
| deep | Complete kickoff + team alignment plan + risk contingency plan + communication mechanism design | Complete output + extended analysis + deep inference |

## Output

**Storage Path**: `output/pm-project/planning-kickoff/`

**Output Files**: kickoff.json, metadata.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["kickoff", "metadata"],
  "properties": {
    "kickoff": {"type": "object", "description": "Kickoff meeting data, including agenda, background materials, prepared questions and meeting minutes"},
    "metadata": {"type": "object", "description": "Metadata, including meeting arrangement and preparation status"}
  }
}
```

### Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| kickoff.agenda.meeting_title | string | Yes | Meeting title, must include project name |
| kickoff.agenda.duration_minutes | number | Yes | Meeting duration (minutes), must be > 0 |
| kickoff.agenda.items | array | Yes | Agenda item list, each must contain order, topic, duration_minutes |
| kickoff.agenda.items[].decision_needed | boolean | Yes | Whether a decision is needed |
| kickoff.background_materials.executive_summary | string | Yes | Project summary, must be < 500 words |
| kickoff.background_materials.project_overview.objectives | array | Yes | Project objectives list, at least 1 item |
| kickoff.background_materials.key_risks | array | No | Key risks list |
| kickoff.background_materials.success_criteria | array | Yes | Success criteria list, at least 1 item |
| kickoff.prepared_questions[].priority | string | Yes | Question priority, enum value high/medium/low |
| kickoff.minutes.meeting_info.date | string | Yes | Meeting date, ISO 8601 format |
| kickoff.minutes.key_decisions | array | Yes | Key decisions list, each must contain decision, decision_maker, date |
| kickoff.action_items[].owner | string | Yes | Action item owner |
| kickoff.action_items[].due_date | string | Yes | Action item due date, ISO 8601 format |
| kickoff.action_items[].status | string | Yes | Action item status, enum value open/in_progress/completed |
| kickoff.follow_up_reminders[].type | string | Yes | Reminder type, enum value action_item/milestone/check_in |
| metadata.meeting_scheduled | boolean | Yes | Whether the meeting is scheduled |
| metadata.preparation_completed_at | string | Yes | Preparation completion time, ISO 8601 format |

```json
{
  "kickoff": {
    "agenda": {
      "meeting_title": "Online Classroom Interactive Feature Project Kickoff Meeting",
      "duration_minutes": 90,
      "items": [
        {
          "order": 1,
          "topic": "Project Background & Objectives",
          "duration_minutes": 15,
          "presenter": "Zhang Ming (Product Owner)",
          "key_points": ["Increase classroom interaction rate to 60%", "Support real-time Q&A and voting features"],
          "decision_needed": false
        }
      ],
      "buffer_minutes": 10
    },
    "background_materials": {
      "executive_summary": "This project aims to add real-time classroom interactive features to the online education platform, including student hand-raising for questions, real-time voting, and bullet screen interaction, to improve student engagement and course completion rate.",
      "project_overview": {
        "objectives": ["Classroom interaction rate increased to 60%", "Course completion rate increased by 15%"],
        "scope": ["Real-time Q&A module", "Classroom voting module", "Bullet screen interaction module"],
        "timeline": "2024-Q2 (10 weeks)",
        "team": ["Zhang Ming (PM)", "Li Wei (Frontend Lead)", "Wang Fang (Backend Lead)", "Chen Gang (QA Lead)"]
      },
      "key_risks": ["WebSocket concurrent performance risk", "Integration complexity with existing player"],
      "success_criteria": ["Classroom interaction rate ≥ 60% after interactive feature launch", "P0 defect count = 0"],
      "document_links": [
        {
          "title": "Classroom Interaction PRD",
          "url": "https://wiki.example.com/class-interaction-prd",
          "description": "Classroom interactive feature product requirements document"
        }
      ]
    },
    "prepared_questions": [
      {
        "question": "Does the interactive feature need to support replay scenarios?",
        "likely_from": "Li Wei (Frontend Lead)",
        "prepared_answer": "Phase 1 only supports live scenarios, replay scenarios included in Phase 2 planning",
        "answer_owner": "Zhang Ming",
        "priority": "high"
      }
    ],
    "minutes": {
      "meeting_info": {
        "title": "Online Classroom Interactive Feature Project Kickoff Meeting",
        "date": "2024-04-01",
        "attendees": ["Zhang Ming", "Li Wei", "Wang Fang", "Chen Gang"],
        "absentees": []
      },
      "key_decisions": [
        {
          "decision": "Phase 1 only supports live scenario interaction, replay interaction included in Phase 2",
          "decision_maker": "Zhang Ming",
          "date": "2024-04-01"
        }
      ],
      "discussion_summary": "Team reached consensus on classroom interactive feature objectives, confirmed Phase 1 focuses on live scenarios, technical solution adopts WebSocket+Redis architecture",
      "unresolved_issues": ["Bullet screen message review mechanism to be confirmed"],
      "next_steps": ["Li Wei completes technical solution design", "Wang Fang completes API definition", "Chen Gang prepares test environment"]
    },
    "action_items": [
      {
        "id": "AI-001",
        "description": "Complete classroom interactive technical solution design document",
        "owner": "Li Wei",
        "due_date": "2024-04-08",
        "status": "open",
        "priority": "high",
        "related_decision": null
      }
    ],
    "follow_up_reminders": [
      {
        "id": "REM-001",
        "type": "action_item",
        "title": "Technical solution design document deadline reminder",
        "due_date": "2024-04-08",
        "notify": ["Li Wei", "Zhang Ming"],
        "reminder_timing": "1 day before",
        "auto_follow_up": true
      }
    ]
  },
  "metadata": {
    "meeting_scheduled": true,
    "meeting_date": "2024-04-01",
    "attendees_confirmed": ["Zhang Ming", "Li Wei", "Wang Fang", "Chen Gang"],
    "preparation_completed_at": "2024-03-31T18:00:00+08:00",
    "follow_up_enabled": true
  }
}
```

---

## Meeting Duration Recommendations

| Project Scale | Recommended Duration |
|----------|----------|
| Small project (< 5 people, < 4 weeks) | 30-45 minutes |
| Medium project (5-15 people, 1-3 months) | 60-90 minutes |
| Large project (> 15 people, > 3 months) | 90-120 minutes |

---

## Decision Rules

| Condition | Action |
|------|------|
| Key stakeholder cannot attend | Escalate to human to coordinate time |
| Major scope change arises during meeting | Trigger charter update process (Pipeline 1) |
| Action item cannot be assigned an owner | Escalate to project manager for decision |
| Meeting cannot be held as scheduled | Reschedule, send notification |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Agenda covers project objectives, scope, roles, timeline
- [ ] Key stakeholders confirmed to attend

### P1 Checks (must pass for standard/deep)

- [ ] Action items have clear owners and due dates
- [ ] Meeting materials sent to attendees in advance

### P2 Checks (must pass for deep only)

- [ ] Extended analysis is complete (deep inference and roadmap generated)
- [ ] Decision records are complete (key decisions have basis and alternatives)

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| Project charter | User describes project objectives and scope, AI generates Kickoff agenda based on description | Kickoff agenda generated based on user description, lacking structured charter data support |
| Resource plan | Skip resource allocation discussion segment, annotate "resource plan to be confirmed" in agenda | Kickoff materials contain unconfirmed resource items, need post-meeting supplementation |
| Meeting attendees | User provides attendee list, AI adjusts agenda and question preparation accordingly | Based on user-provided attendee configuration, agenda and question pre-preparation may be incomplete |
| Preferred meeting time | If user does not provide preferred meeting time, prompt user to provide or skip steps related to this input | Meeting arrangement lacks time information, needs manual supplementation |

### Data Acquisition Instructions

When upstream files are missing, obtain necessary data through the following methods:

1. **Project charter missing**: Ask user to describe project objectives, scope and key milestones, AI will generate Kickoff agenda and background material summary based on description
2. **Resource plan missing**: Skip resource allocation discussion segment in Kickoff agenda, annotate "resource plan to be confirmed", suggest adding resource discussion topic in the meeting
3. **Meeting attendees missing**: Ask user to provide attendee names and roles, AI will adjust agenda time allocation and question pre-preparation accordingly

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Project charter change (objectives/scope/success criteria adjustment) | Agenda content, background materials, question pre-preparation | Regenerate agenda and background materials, update question list |
| Resource plan change (personnel/budget adjustment) | Resource allocation discussion segment, team information | Update resource highlights in background materials, adjust related agenda segments |
| Attendee change (additions/removals/role changes) | Agenda time allocation, question pre-preparation, reminder configuration | Readjust agenda and question preparation, update reminder recipients |

### Downstream Notification Mechanism Table

| Change Type | Impact Scope | Notification Method |
|----------|----------|----------|
| Meeting agenda change | All attendees, meeting arrangement | Update kickoff.json, send agenda change notification |
| Action item change (addition/modification/completion) | Action item owner, project manager | Update kickoff.json, notify relevant responsible persons and project manager |
| Key decision change | Project charter, subsequent planning Pipeline | Update kickoff.json, notify planning-project-charter |
