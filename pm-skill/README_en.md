# Product Methodology AI Agent Skills Collection

🌐 **Language Switch**：[中文版](README.md) | [English](README_en.md)

> 📚 **Recommended**: Visit [GitHub Pages](https://LuckyOneTwoThree.github.io/pm-skill) for one-click language switching!

## What Is This

A comprehensive collection of 126 AI Agent Skills extracted from the complete product methodology loop, compatible with Trae / Claude Code's Agent Skills open standard. Each Skill is an independently executable methodology pipeline, with orchestrators managing the execution sequence of child Skills.

## Quick Start

### Deployment Method

The nested directory structure (`pm-0X-xxx/orchestrators|skills/`) is only for **human browsing and management**. Trae recursively scans and identifies Skills by **individual SKILL.md** files, and the `name` field must match the immediate parent directory name.

For actual use, all minimum Skill units need to be **flattened** into `.trae/skills/`:

```
# Current Directory Structure (for human management)
ALL/pm-01-discovery/orchestrators/user-research-orchestrator/SKILL.md
ALL/pm-01-discovery/skills/user-research-voice-analysis/SKILL.md
...

# Structure for Trae Deployment (flattened, for machine recognition)
.trae/skills/
├── user-research-orchestrator/SKILL.md
├── user-research-voice-analysis/SKILL.md
├── insight-orchestrator/SKILL.md
├── insight-jtbd/SKILL.md
├── ...(126 Skills flattened)
└── risk-escalation/SKILL.md
```

### Deployment Steps

1. **Full Deployment**: Copy all `{skill-name}/` folders to `.trae/skills/`, flattened
2. **On-demand Deployment**: Only copy Skill folders needed for the current project phase
3. **Trigger Usage**: Describe your needs in conversation, AI automatically matches corresponding Skills

> ⚠️ During deployment, only copy the innermost `{skill-name}/` folders (containing SKILL.md), no need to keep the outer `pm-0X-xxx/`, `orchestrators/`, `skills/` directory structure.

## Directory Structure

```
ALL/
├── pm-00-guide/          Navigation Entry (non-standard Skill)
├── pm-01-discovery/      Module 1: Product Discovery
├── pm-02-strategy/       Module 2: Business & Strategy
├── pm-03-design/         Module 3: Product Design (incl. PRD Generation)
├── pm-04-metrics-design/ Module 4: Metrics Design (Pre-development)
├── pm-05-development/    Module 5: Development & Launch
├── pm-06-metrics-ops/    Module 6: Metrics Operations (Post-launch)
├── pm-07-growth/         Module 7: Growth & Operations
├── pm-08-monitoring/     Module 8: Monitoring & Iteration
└── pm-09-project/        Module 9: Project Management (Throughout)
```

In each module directory:
- `orchestrators/` — Orchestrators (commander mode, scheduling child Skill execution sequence)
- `skills/` — Pipeline Skills (independently executable methodology pipelines)

## Module Flow Sequence

```
Discovery → Strategy → Design (incl. PRD)
     ↓                                  ↓
 Metrics Design                  Development
                                       ↓
                                Metrics Ops
                                       ↓
                            Growth ↔ Monitoring
                                       ↓
                             Project Management
```

## Skill Types

| Type | Count | Purpose | Usage |
|------|-------|---------|-------|
| Orchestrator | 30 | Schedule child Skill execution sequence and stage gates | Use by sub-module flow |
| Pipeline Skill | 95 | Single methodology pipeline, independently executable | Call on demand |
| Guide | 1 | Full process navigation, recommend modules by scenario | Entry guidance |

## Output Path

Skill execution results are written to `output/` in the **user's project root directory**:

```
User Project/
└── output/
    └── pm-discovery/          ← Module name (without number)
        └── user-research-voice-analysis/
            └── voice-analysis.json
```

Output follows the user project, not the Skill definition directory. Multi-project outputs don't interfere with each other.

## AI Capabilities & Limitations

- ✅ **Can Do**: Read local files, analyze pasted text, process uploaded files, generate structured reports, logical reasoning
- ❌ **Cannot Do**: Access external databases, call business APIs, fetch real-time data, operate external systems, execute code

When external data is needed, users must provide it through pasting / uploading / providing paths.

## Choose Modules by Scenario

| Your Scenario | Recommended Entry |
|--------------|-------------------|
| Building a new product from scratch | Module 1 → 2 → 3 → 4 → 5 |
| Optimizing an existing product | Module 6 (Data Analysis) or Module 8 (Monitoring & Iteration) |
| Need growth | Module 7 (Growth & Operations) |
| Need requirements analysis | Module 1 insight-orchestrator or Module 3 requirements-orchestrator |
| Need to write PRD | Module 3 design-prd |
| Project management & collaboration | Module 9 project-planning-orchestrator |

## Human-AI Collaboration

- 🤖 **AI Auto-Executes**: Data processing, analytical calculations, document generation
- 🤖→👤 **AI Suggests, Human Approves**: Solution selection, priority ranking, strategic direction
- 👤→🤖 **Human Executes, AI Assists**: Goal setting, value judgment
- 👤 **Human Executes**: Final decisions, external communication

Stage gates and human decision points in all orchestrators ensure critical decisions are controlled by humans.
