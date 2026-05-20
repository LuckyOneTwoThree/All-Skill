---
name: metrics-dashboard
description: "Use when configuring product metrics dashboards. Dashboard auto-configuration based on metric hierarchy, auto-assigning metrics to dashboards, configuring alert rules and thresholds. Keywords: Dashboard configuration, data dashboard, metric visualization, alert configuration, monitoring panel, dashboard setup, data reports."
metadata:
  module: "Product Metrics Design"
  sub-module: "Metrics Design"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["Internet", "SaaS", "General"]
  trigger_examples:
    - "Help me build a data dashboard"
    - "Configure a monitoring panel"
    - "Create a Dashboard to display all key metrics"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "Output core metrics dashboard design"
  deep_description: "Full dashboard + drill-down analysis design + alert rule system + data governance specs"
---

# Dashboard Auto-Configuration

## Core Principles

1. **Comprehensive Analysis**: Systematically analyze all available data without omitting key dimensions
2. **Real-time Awareness**: Metric system design supports real-time monitoring and rapid response
3. **Automated Attribution**: Anomalous fluctuations are automatically attributed to specific causes, reducing manual investigation
4. **Explicit Decision Rules**: Every alert and escalation condition has clear quantitative rules

## Interaction Mode

🤖→👤 AI suggests, human approves

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| metric_system | JSON | Yes | output/pm-metrics-design/metrics-system/metric_system.json | Metric system (including North Star, L1/L2/actionable metrics) |
| tracking_plan | JSON array | Yes | output/pm-metrics-design/tracking-plan/tracking_plan.json | Tracking plan |
| user_roles | string[] | ○ | User provided | Dashboard user roles |
| dashboard_platform | string | ○ | User provided | Visualization platform (amplitude/grafana/datadog) |

```json
{
  "metric_system": {
    "north_star": {...},
    "l1_metrics": [...],
    "l2_metrics": [...],
    "actionable_metrics": [...]
  },
  "tracking_plan": [...],
  "user_roles": ["Product Manager", "Operations", "Management"],
  "dashboard_platform": "amplitude|grafana|datadog"
}
```

---

## Execution Steps

### Step 1: Dashboard Structure Design [Core]

**Task**: Design Dashboard structure based on metric hierarchy

**Rules**:
- Strategic Dashboard (1): Display North Star metric and L1 metric trends, for management
- Tactical Dashboard (N): Divided by user lifecycle (AARRR) or business line, for PMs
- Operational Dashboard (N): Divided by feature module or team, for specific executors

**Execution**:
1. Design Dashboard quantity and type based on metric hierarchy
2. Determine the theme and positioning of each Dashboard
3. Plan navigation relationships between Dashboards

---

### Step 2: Metric Auto-Assignment [Core]

**Task**: Automatically assign metrics to each Dashboard

**Rules**:
- North Star metric -> Strategic Dashboard
- L1 metrics -> Tactical Dashboard
- L2 metrics -> Assign to Tactical or Operational Dashboard based on L1 ownership
- Actionable metrics -> Operational Dashboard

**Execution**:
1. Traverse the metric system and assign by hierarchy rules
2. Mark the data source for each Widget
3. Determine refresh frequency (Strategic: daily, Tactical: hourly, Operational: minutely)

---

### Step 3: Alert Rule Configuration [Core]

**Task**: Configure alert rules for key metrics

**Rules**:
- North Star metric: Configure daily MoM alert (threshold: ±15%)
- L1 metrics: Configure weekly MoM alert (threshold: ±10%)
- Anomaly detection triggered metrics: Automatically inherit anomaly detection alert configuration

**Execution**:
1. Generate alert rules based on statistical thresholds (mean±2σ) or historical baselines
2. Determine alert severity (P0/P1/P2/P3)
3. Configure notification channels and recipients

---

### Step 4: Dashboard Configuration Generation [Core]

**Task**: Generate Dashboard configurations for each platform

**Supported Platforms**:
- Amplitude / Mixpanel / GrowingIO
- Grafana / Datadog (technical monitoring)
- Custom JSON configuration

**Execution**:
1. Generate platform-specific configuration format based on target platform
2. Generate Widget definitions (type, position, size)
3. Configure Dashboard layout and theme

---

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | core metrics dashboard design | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full dashboard + drill-down analysis design + alert rule system + data governance specs | Full deliverables + extended analysis + deep simulation |

## Output

**Storage Path**: `output/pm-metrics-design/metrics-dashboard/`

**Output File**: `dashboard_config.json`

**Output Schema**:

```json
{
  "type": "object",
  "required": ["dashboards", "configuration_files"],
  "properties": {
    "dashboards": {"type": "array", "description": "Dashboard configuration list, including strategic/tactical/operational dashboards"},
    "configuration_files": {"type": "object", "description": "Platform configuration files, including platform type and Dashboard JSON configuration"}
  }
}
```

```json
{
  "dashboards": [
    {
      "name": "Strategic Dashboard",
      "type": "strategic",
      "owner": "Product Lead",
      "widgets": [
        {
          "type": "kpi",
          "metric": "north_star_metric",
          "visualization": "number_with_trend",
          "refresh_interval": "daily"
        },
        {
          "type": "chart",
          "metric": "l1_metrics",
          "visualization": "line_chart",
          "refresh_interval": "daily"
        }
      ],
      "alerts": [
        {
          "metric": "north_star_metric",
          "condition": "daily_change",
          "threshold": 0.15,
          "severity": "P0",
          "notification": "slack:#product-alerts"
        }
      ]
    }
  ],
  "configuration_files": {
    "platform": "amplitude",
    "dashboard_json": {...}
  }
}
```

---

## Output Validation Rules

| Field Path | Type | Required | Description |
|----------|------|------|------|
| dashboards | array | Yes | Dashboard configuration list, at least 1 strategic dashboard |
| dashboards[].name | string | Yes | Dashboard name, cannot be empty |
| dashboards[].type | string | Yes | Dashboard type, enum: strategic/tactical/operational |
| dashboards[].owner | string | Yes | Dashboard owner |
| dashboards[].widgets | array | Yes | Widget list, at least 1 Widget |
| dashboards[].widgets[].type | string | Yes | Widget type, enum: kpi/chart/table/funnel |
| dashboards[].widgets[].metric | string | Yes | Associated metric name |
| dashboards[].widgets[].visualization | string | Yes | Visualization type |
| dashboards[].widgets[].refresh_interval | string | Yes | Refresh frequency |
| dashboards[].alerts | array | No | Alert rule list |
| dashboards[].alerts[].metric | string | Conditionally required | Alert associated metric, required when alerts exist |
| dashboards[].alerts[].threshold | number | Conditionally required | Alert threshold, required when alerts exist |
| dashboards[].alerts[].severity | string | Conditionally required | Alert severity, enum: P0/P1/P2/P3 |
| configuration_files | object | Yes | Platform configuration files |
| configuration_files.platform | string | Yes | Platform type |
| configuration_files.dashboard_json | object | Yes | Dashboard JSON configuration |

## Upstream Change Response

When upstream inputs change, this Skill's response strategy:

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| North Star metric change | Strategic Dashboard KPI Widget and alert rules | Update Strategic Dashboard core Widget, recalculate alert thresholds, flag for human confirmation |
| L1/L2 metric addition/removal | Tactical/Operational Dashboard Widget assignment | Re-execute metric auto-assignment, flag added/removed Widgets, preserve human-confirmed layouts |
| Actionable metric change | Operational Dashboard Widgets and alerts | Update Operational Dashboard, re-evaluate alert configuration |
| Tracking event addition/removal | Widget data source markers | Update Widget data source status, mark as "pending configuration" or "ready" |
| Metric definition modification | Associated Widget calculation logic | Update Widget display logic, flag for human confirmation |

When Dashboard configuration itself changes, notification mechanism to downstream:

| Configuration Change Type | Notification Scope | Notification Method |
|-------------|----------|----------|
| Dashboard structure change | Module 7 (Product Metrics Operations) | Flag dashboard structure change, trigger monitoring configuration update |
| Alert rule change | Ops team, Product team | Flag alert change, trigger alert notification configuration update |
| Widget addition/removal | Module 7 (Product Metrics Operations) | Flag Widget change, trigger data source verification |

---

## Decision Rules

### Automatic Execution Rules
- Metric assignment executes automatically based on hierarchy rules
- Alert thresholds configured with default values

### Human Decision Points
- Dashboard layout requires human confirmation (🤖→👤)
- Alert thresholds can be adjusted based on actual conditions
- Dashboard naming and ownership determined by humans

### Escalation Rules
- When alert count exceeds 50, prompt to simplify alerts
- When Dashboard count exceeds 10, prompt to merge or archive

---

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] All metrics assigned to Dashboards
- [ ] Each Dashboard has at least 1 Widget

### P1 Checks (must pass for standard/deep)

- [ ] North Star metric appears in Strategic Dashboard
- [ ] Alert rules configured completely
- [ ] Dashboard configuration parses correctly
- [ ] Dashboard layout reasonableness
- [ ] Alert threshold setting reasonableness
- [ ] Access permission configuration
- [ ] Navigation structure clarity

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

---

## Degradation Strategy

### Upstream File Missing Degradation Plan

| Missing Scope | Degradation Plan | Output Impact | Data Acquisition Instructions |
|----------|----------|----------|------------|
| Metric system missing | Prompt user to provide core metric list, generate basic Dashboard configuration based on metric list | Dashboard hierarchy simplified, no strategic/tactical/operational layering | Request user to provide core metric names and definitions, or upload metrics-system.json |
| Tracking plan missing | Skip data source marking step, Widget data source marked as "pending configuration" | Cannot confirm data collection feasibility | Request user to provide tracking event list, or upload tracking-plan.json |
| Metric system + Tracking plan both missing | User provides core metric list -> generate basic Dashboard configuration | Output basic Dashboard configuration, data source and refresh frequency marked as "to be confirmed" | Request user to provide core metric list and target user roles, or execute metrics-system and tracking-plan first |
| user_roles missing | If user does not provide user_roles, prompt user to provide or skip related steps | Dashboard role layering missing, use default role configuration | Prompt user to specify Dashboard user roles (Management/PM/Operations) |
| dashboard_platform missing | If user does not provide dashboard_platform, prompt user to provide or skip related steps | Use generic JSON configuration format, platform-specific configuration marked as "to be specified" | Prompt user to specify visualization platform (Amplitude/Grafana/Datadog, etc.) |

### Data Acquisition Instructions

When upstream files are missing, the user needs to provide the following information to support degraded generation:
- **Core metric list**: Key metric names and definitions to monitor
- **Target user roles** (optional): Primary Dashboard user roles (Management/PM/Operations)
- **Dashboard platform** (optional): Visualization platform to use (Amplitude/Grafana/Datadog, etc.)

---

## Context Dependencies

- **Depends on preceding Pipeline**: Pipeline 1 (Metric System Auto-Construction), Pipeline 2 (Tracking Plan Auto-Generation)
- **Consumed by subsequent Pipeline**: Module 7 (Product Metrics Operations) Dashboard monitoring

---

## Key Principles

### Data-Driven Visualization
- Select chart types best suited for displaying metric trends
- KPI cards display current value and trend
- Line charts display time series changes

### Alert Layering
- P0: Core metric anomaly, requires immediate handling
- P1: Important metric anomaly, must be handled same day
- P2: General metric anomaly, needs attention
- P3: Minor deviation, can be ignored

### High Actionability
- Each Dashboard has a clear target user
- Each Widget has a clear data source description
- Each alert has a clear handling guide
