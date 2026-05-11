---
name: monitoring-dashboard
description: 当需要配置监控Dashboard时使用。监控 Dashboard 自动配置，根据不同角色需求，自动生成监控指标分组和可视化组件配置。关键词：监控Dashboard、数据看板、实时监控、可视化、监控面板。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 8: 监控 Dashboard 自动配置 🤖

## 核心原则

1. **主动监控而非被动响应**：Dashboard配置主动适配角色需求，确保关键指标始终可见
2. **归因分层**：Dashboard按角色分层展示，从全局概览到下钻详情逐层深入
3. **决策规则前置**：每个角色视角的核心指标和告警阈值在配置时即定义
4. **持续学习**：Dashboard使用数据反馈到配置优化，持续提升监控效率

## 交互模式

🤖 AI自动执行（Dashboard生成类）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 指标体系 | JSON | 是 | output/pm-metrics-design/metrics-system/metric_system.json | 监控指标定义和分类 |
| 监控体系 | JSON | 是 | output/pm-monitoring/monitoring-system/告警规则 | 已有的告警规则和阈值 |
| 用户角色 | string[] | 是 | 用户提供 | 需要访问 Dashboard 的角色 |
| 现有 Dashboard | JSON | ○ | output/pm-monitoring/monitoring-dashboard/现有配置 | 已有配置（如有） |

## 执行步骤

### Step 1: 角色视角确定

**目标**：确定不同角色的监控关注点

**角色分类**：

| 角色 | 关注点 | 刷新频率 | 详细程度 |
|------|--------|----------|----------|
| Executive | 业务健康、整体状态 | 低 | 摘要 |
| Product Owner | 功能状态、用户指标 | 中 | 概览 |
| Engineering Lead | 系统状态、告警 | 高 | 详细 |
| On-Call Engineer | 当前告警、问题诊断 | 实时 | 详细 |
| Business Analyst | 业务指标、转化漏斗 | 中 | 业务 |

**角色需求映射**：

```yaml
role_requirements:
  - role: executive
    focus_areas:
      - business_health
      - revenue_metrics
      - user_satisfaction
    alert_preference: critical_only
    refresh_rate: 15m
  - role: engineering_lead
    focus_areas:
      - system_health
      - incident_status
      - performance_trends
    alert_preference: high_and_above
    refresh_rate: 5m
  - role: oncall_engineer
    focus_areas:
      - active_alerts
      - affected_services
      - recent_changes
    alert_preference: all
    refresh_rate: real_time
```

### Step 2: 核心指标分组

**目标**：按角色需求组织指标分组

**分组策略**：

| 分组类型 | 说明 | 示例 |
|----------|------|------|
| 业务视图 | 核心业务指标 | 订单量、转化率、DAU |
| 技术视图 | 系统技术指标 | CPU、内存、延迟 |
| 告警视图 | 当前告警和事件 | 活跃告警、历史事件 |
| 服务视图 | 按服务/组件分组 | 用户服务、订单服务 |

**指标分组输出**：

```yaml
metric_groups:
  - group_id: GRP-001
    group_name: {name}
    role: {role}
    metrics:
      - metric_name: api_response_time_p95
        data_source: apm
        visualization: time_series
      - metric_name: error_rate
        data_source: apm
        visualization: gauge
    priority: high | medium | low
    refresh_interval: {minutes}
```

### Step 3: 可视化组件选择

**目标**：为每个指标选择最合适的可视化组件

**组件类型**：

| 组件类型 | 适用指标 | 特点 |
|----------|----------|------|
| Time Series | 趋势指标 | 展示随时间变化 |
| Gauge | 状态指标 | 展示当前值/目标 |
| Stat | 单一数值 | 快速概览 |
| Table | 列表数据 | 详细数据展示 |
| Alert List | 告警数据 | 实时告警状态 |
| Heatmap | 分布指标 | 展示分布模式 |

**组件配置**：

```yaml
widget_config:
  - widget_id: WDG-001
    widget_type: time_series | gauge | stat | table | alert_list | heatmap
    title: {title}
    metrics:
      - name: {metric_name}
        aggregation: avg | sum | max | min
    visualization:
      color_scheme: green_yellow_red | blue | custom
      thresholds:
        warning: {value}
        critical: {value}
      time_range: 1h | 6h | 24h | 7d | custom
    layout:
      width: 1 | 2 | 4 | 6 | 12
      height: 1 | 2 | 3
      position: {row}_{column}
```

### Step 4: Dashboard 模板生成

**目标**：生成完整的 Dashboard 配置

**模板结构**：

```yaml
dashboard_template:
  - dashboard_id: DASH-001
    role: executive
    title: 业务概览
    description: 高层管理者业务健康视图
    widgets:
      - widget_id: WDG-001
        widget_type: stat
        title: 今日订单量
        metrics:
          - name: daily_orders
            data_source: business_db
        layout:
          width: 3
          height: 1
      - widget_id: WDG-002
        widget_type: time_series
        title: 订单量趋势
        metrics:
          - name: orders_trend
            data_source: business_db
        layout:
          width: 9
          height: 2
    filters:
      - filter_type: time_range
        default: 7d
      - filter_type: region
        options: [all, cn, us, eu]
    refresh_interval: 15m
```

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["dashboards"],
  "properties": {
    "dashboards": {"type": "array", "description": "Dashboard配置列表，包含角色、标题和组件"}
  }
}
```

```
├── {role}/
│   └── {dashboard_name}.yaml
├── shared/
│   ├── alert_dashboard.yaml
│   └── system_health_dashboard.yaml
└── templates/
    └── dashboard_template.yaml
```

### Dashboard 输出格式

```yaml
dashboards:
  - role: executive
    dashboard:
      id: DASH-EXEC-001
      title: 业务概览
      description: 高层业务健康仪表板
      widgets:
        - type: stat
          title: 核心 KPI
          data_source: metrics
          layout:
            width: 4
            height: 1
          alerts:
            threshold: {value}
            direction: above | below
        - type: time_series
          title: 趋势图
          data_source: metrics
          layout:
            width: 8
            height: 2
        - type: table
          title: Top 产品
          data_source: analytics
          layout:
            width: 12
            height: 2
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| 指标数量过多 | 自动分组，折叠低优先级 |
| 告警数量过多 | 仅显示未解决告警 |
| 页面加载慢 | 延迟加载低优先级组件 |
| 角色变更 | 自动调整指标配置 |
| 指标无数据 | 显示"No Data"状态 |

## 质量检查

- [ ] 所有角色都有对应 Dashboard
- [ ] 核心指标覆盖率 ≥ 90%
- [ ] 可视化组件选择合理
- [ ] 布局美观、层次清晰
- [ ] 告警配置正确
- [ ] 刷新频率符合角色需求

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 影响范围 | 降级方案 | 降级输出 |
|---------------|---------|---------|---------|
| 指标体系 | 无法确定Dashboard展示的指标 | 用户提供关键指标列表，AI基于通用Dashboard模板配置 | 基础Dashboard模板 |
| 监控体系 | 无法获取告警规则和阈值 | 跳过告警视图配置，Dashboard仅展示指标数据 | 无告警视图的Dashboard |
| 用户角色 | 无法按角色定制视图 | 使用默认角色模板（Executive/Engineering/On-Call），用户后续调整 | 通用角色Dashboard模板 |
| 现有 Dashboard | 无法复用已有配置 | 从零生成Dashboard配置，标注可能与现有配置冲突 | 全新Dashboard配置 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **指标体系缺失**：请用户提供关键指标列表（如订单量、响应时间、错误率等），AI将基于通用Dashboard模板为每个指标选择合适的可视化组件并生成配置
2. **监控体系缺失**：跳过告警视图和告警列表组件的配置，Dashboard仅包含指标展示视图，建议后续接入监控体系以启用告警视图
3. **用户角色缺失**：使用默认角色模板生成Dashboard，包含Executive概览、Engineering详情、On-Call实时三个标准视图，用户可根据实际角色需求调整
