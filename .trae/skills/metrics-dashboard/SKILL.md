---
name: metrics-dashboard
description: 当需要配置产品度量Dashboard时使用。Dashboard自动配置，基于指标层级设计Dashboard结构，自动分配指标到各Dashboard，配置告警规则和阈值。关键词：Dashboard配置、数据看板、指标可视化、告警配置、监控面板、看板搭建、数据报表。
metadata:
  module: "产品度量设计"
  sub-module: "度量设计"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "帮我搭一个数据看板"
    - "配置一个监控面板"
    - "做个Dashboard把关键指标都展示出来"
  interaction_mode: "ai_suggest_human_approve"
---

# Dashboard自动配置

## 核心原则

1. **全量分析**：对所有可用数据进行系统性分析，不遗漏关键维度
2. **实时感知**：指标体系设计支持实时监控和快速响应
3. **自动归因**：异常波动自动归因到具体原因，减少人工排查
4. **决策规则显式化**：每个告警和升级条件都有明确的量化规则

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| metric_system | JSON | 是 | output/pm-metrics-design/metrics-system/metric_system.json | 指标体系（含北极星、L1/L2/行动指标） |
| tracking_plan | JSON数组 | 是 | output/pm-metrics-design/tracking-plan/tracking_plan | 埋点方案 |
| user_roles | string[] | ○ | 用户提供 | Dashboard使用角色 |
| dashboard_platform | string | ○ | 用户提供 | 可视化平台（amplitude/grafana/datadog） |

```json
{
  "metric_system": {
    "north_star": {...},
    "l1_metrics": [...],
    "l2_metrics": [...],
    "actionable_metrics": [...]
  },
  "tracking_plan": [...],
  "user_roles": ["产品经理", "运营", "管理层"],
  "dashboard_platform": "amplitude|grafana|datadog"
}
```

---

## 执行步骤

### Step 1: Dashboard结构设计

**任务**：根据指标层级设计Dashboard结构

**规则**：
- 战略Dashboard（1个）：展示北极星指标和L1指标趋势，面向管理层
- 战术Dashboard（N个）：按用户生命周期（AARRR）或业务线划分，面向PM
- 运营Dashboard（N个）：按功能模块或团队划分，面向具体执行者

**执行**：
1. 基于指标体系的层级关系设计Dashboard数量和类型
2. 确定每个Dashboard的主题和定位
3. 规划Dashboard之间的导航关系

---

### Step 2: 指标自动分配

**任务**：将指标自动分配到各Dashboard

**规则**：
- 北极星指标 → 战略Dashboard
- L1指标 → 战术Dashboard
- L2指标 → 按L1归属分配到战术Dashboard或运营Dashboard
- 行动指标 → 运营Dashboard

**执行**：
1. 遍历指标体系，按层级规则分配
2. 标记每个Widget的数据源
3. 确定刷新频率（战略Dashboard: 日级，战术Dashboard: 小时级，运营Dashboard: 分钟级）

---

### Step 3: 告警规则配置

**任务**：为关键指标配置告警规则

**规则**：
- 北极星指标：配置日级环比告警（阈值：±15%）
- L1指标：配置周级环比告警（阈值：±10%）
- 异常检测触发的指标：自动继承异常检测的告警配置

**执行**：
1. 基于统计阈值（均值±2σ）或历史基线生成告警规则
2. 确定告警级别（P0/P1/P2/P3）
3. 配置通知渠道和接收人

---

### Step 4: Dashboard配置生成

**任务**：生成各平台的Dashboard配置

**支持平台**：
- Amplitude / Mixpanel / GrowingIO（国内常用）
- Grafana / Datadog（技术监控）
- 自定义JSON配置

**执行**：
1. 根据目标平台生成对应的配置格式
2. 生成Widget定义（类型、位置、尺寸）
3. 配置Dashboard布局和主题

---

## 输出

**存储路径**：`output/pm-metrics-design/metrics-dashboard/`

**输出文件**：`dashboard_config.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["dashboards", "configuration_files"],
  "properties": {
    "dashboards": {"type": "array", "description": "Dashboard配置列表，包含战略/战术/运营看板"},
    "configuration_files": {"type": "object", "description": "平台配置文件，包含平台类型和Dashboard JSON配置"}
  }
}
```

```json
{
  "dashboards": [
    {
      "name": "战略看板",
      "type": "strategic",
      "owner": "产品负责人",
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

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| dashboards | array | 是 | Dashboard配置列表，至少包含1个战略看板 |
| dashboards[].name | string | 是 | Dashboard名称，不可为空 |
| dashboards[].type | string | 是 | 看板类型，枚举值：strategic/tactical/operational |
| dashboards[].owner | string | 是 | 看板负责人 |
| dashboards[].widgets | array | 是 | Widget列表，至少包含1个Widget |
| dashboards[].widgets[].type | string | 是 | Widget类型，枚举值：kpi/chart/table/funnel |
| dashboards[].widgets[].metric | string | 是 | 关联指标名称 |
| dashboards[].widgets[].visualization | string | 是 | 可视化类型 |
| dashboards[].widgets[].refresh_interval | string | 是 | 刷新频率 |
| dashboards[].alerts | array | 否 | 告警规则列表 |
| dashboards[].alerts[].metric | string | 条件必填 | 告警关联指标，有alerts时必填 |
| dashboards[].alerts[].threshold | number | 条件必填 | 告警阈值，有alerts时必填 |
| dashboards[].alerts[].severity | string | 条件必填 | 告警级别，枚举值：P0/P1/P2/P3 |
| configuration_files | object | 是 | 平台配置文件 |
| configuration_files.platform | string | 是 | 平台类型 |
| configuration_files.dashboard_json | object | 是 | Dashboard JSON配置 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 北极星指标变更 | 战略Dashboard的KPI Widget和告警规则 | 更新战略Dashboard的核心Widget，重新计算告警阈值，标记需人类确认 |
| L1/L2指标增删 | 战术/运营Dashboard的Widget分配 | 重新执行指标自动分配，标记新增/移除的Widget，保留人类已确认的布局 |
| 行动指标变更 | 运营Dashboard的Widget和告警 | 更新运营Dashboard，重新评估告警配置 |
| 埋点事件增删 | Widget数据源标记 | 更新Widget的数据源状态，标记"待配置"或"已就绪" |
| 指标定义修改 | 关联Widget的计算逻辑 | 更新Widget展示逻辑，标记需人类确认 |

当Dashboard配置自身变更时，对下游的通知机制：

| 配置变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| Dashboard结构变更 | 模块7（产品度量运营） | 标记看板结构变更，触发监控配置更新 |
| 告警规则变更 | 运维团队、产品团队 | 标记告警变更，触发告警通知配置更新 |
| Widget增删 | 模块7（产品度量运营） | 标记Widget变更，触发数据源验证 |

---

## 决策规则

### 自动执行规则
- 指标分配按层级规则自动执行
- 告警阈值按默认值配置

### 人类决策点
- Dashboard布局需人类确认（🤖→👤）
- 告警阈值可根据实际情况调整
- Dashboard命名和归属由人类决定

### 升级规则
- 告警数量超过50个时，提示需要精简告警
- Dashboard数量超过10个时，提示需要合并或归档

---

## 质量检查

### 自动化检查清单
- [ ] 所有指标已分配到Dashboard
- [ ] 每个Dashboard至少有1个Widget
- [ ] 北极星指标出现在战略Dashboard
- [ ] 告警规则配置完整
- [ ] Dashboard配置可正常解析

### 人工审核清单
- [ ] Dashboard布局合理性
- [ ] 告警阈值设置合理性
- [ ] 访问权限配置
- [ ] 导航结构清晰性

---

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 指标体系缺失 | 提示用户提供核心指标列表，基于指标列表生成基础Dashboard配置 | Dashboard层级结构简化，无战略/战术/运营分层 |
| 埋点方案缺失 | 跳过数据源标记步骤，Widget数据源标注"待配置" | 无法确认数据采集可行性 |
| 指标体系 + 埋点方案均缺失 | 用户提供核心指标列表 → 生成基础Dashboard配置 | 输出基础Dashboard配置，数据源和刷新频率标注"待确认" |
| user_roles缺失 | 若用户未提供user_roles，提示用户提供或跳过该输入相关步骤 | Dashboard角色分层缺失，使用默认角色配置 |
| dashboard_platform缺失 | 若用户未提供dashboard_platform，提示用户提供或跳过该输入相关步骤 | 使用通用JSON配置格式，平台特定配置标注"待指定" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **核心指标列表**：需要监控的关键指标名称和定义
- **目标用户角色**（可选）：Dashboard的主要使用角色（管理层/PM/运营）
- **Dashboard平台**（可选）：使用的可视化平台（Amplitude/Grafana/Datadog等）

---

## 上下文依赖

- **依赖前序Pipeline**：Pipeline 1（指标体系自动构建）、Pipeline 2（埋点方案自动生成）
- **被后续Pipeline消费**：模块7（产品度量运营）中的Dashboard监控

---

## 关键原则

### 数据驱动可视化
- 选择最适合展示指标趋势的图表类型
- KPI卡片展示当前值和趋势
- 折线图展示时间序列变化

### 告警分层
- P0：核心指标异常，需立即处理
- P1：重要指标异常，需当天处理
- P2：一般指标异常，需关注
- P3：轻微偏离，可忽略

### 可操作性强
- 每个Dashboard都有明确的目标用户
- 每个Widget都有清晰的数据来源说明
- 告警都有明确的处理指引
