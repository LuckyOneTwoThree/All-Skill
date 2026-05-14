---
name: monitoring-pipeline
description: 当需要构建产品监控预警体系时使用。监控预警全流程自动构建，从监控体系建立、异常检测、看板配置到告警升级一站式完成。关键词：监控系统、监控配置、健康检查、告警规则、监控体系、监控搭建、告警配置、搭监控、配告警、异常检测、异常告警、告警分级、指标异常、监控Dashboard、数据看板、实时监控、可视化、告警升级、升级流程、On-Call、告警通知、应急响应、值班。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "监控系统怎么搭"
    - "需要监控哪些指标"
    - "告警规则怎么配"
    - "告警太多了怎么分析"
    - "指标突然异常了怎么回事"
    - "帮我搭一个监控看板"
    - "告警升级流程怎么定"
    - "值班怎么安排"
  interaction_mode: "ai_auto"
---

# 监控预警全流程 🤖

## 核心原则

1. **监控体系的起点是核心路径而非指标堆砌**：先识别核心业务路径，再为路径配置指标和告警，避免监控一切却看不到关键
2. **告警规则是信号与噪音的平衡**：告警太多等于没有告警，每条告警都必须值得人工关注
3. **On-Call手册是监控体系的最后一公里**：没有On-Call手册的监控系统是不完整的，告警响了没人知道怎么处理等于没有监控
4. **告警归因是推理链不是猜测**：从确认真实性到定位范围到关联事件到生成归因，每一步都必须有证据支撑
5. **关联分析是归因的关键**：孤立看告警必然误判，必须关联时间窗口内的其他事件
6. **Dashboard是为角色服务的，不是为数据服务的**：不同角色关注不同指标，Dashboard必须按角色定制
7. **升级是保护不是推诿**：升级的目的是让对的人在对的时间介入，而非推卸责任

## 交互模式

🤖 AI自动执行（系统配置类）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 产品架构 | JSON/文件 | 是 | 用户提供 | 系统架构图、组件关系、依赖链路 |
| 指标体系 | JSON | 是 | output/pm-metrics-design/metrics-system/metric_system.json | 需监控的业务指标和技术指标定义 |
| SLA 要求 | JSON | 是 | 用户提供 | 可用性、响应时间、吞吐量要求 |
| 现有监控 | JSON | ○ | output/pm-monitoring/monitoring-pipeline/现有配置 | 已有的监控配置和告警规则 |
| 版本发布信息 | object | ○ | output/pm-monitoring/release-gradual/release_record.json | 近期发布记录 |
| 配置变更记录 | object | ○ | 用户提供 | 配置修改历史 |
| 流量变化数据 | object | ○ | 用户提供 | 流量趋势和异常波动 |
| 根因知识库 | object[] | ○ | 用户提供 | 历史问题-根因映射 |
| 用户角色 | string[] | 是 | 用户提供 | 需要访问 Dashboard 的角色 |
| 现有 Dashboard | JSON | ○ | output/pm-monitoring/monitoring-pipeline/现有配置 | 已有Dashboard配置（如有） |
| On-Call 排班 | JSON | 是 | 值班管理系统 → 排班表 | 值班表和联系方式 |
| 知识库 | JSON | ○ | output/pm-monitoring/monitoring-pipeline/知识库 | 问题处理指南和历史案例 |

## 执行步骤

### Step 1: 监控体系建立（from monitoring-system）

**目标**：建立核心路径监控体系，配置指标采集与告警规则

#### 1.1 核心路径识别

**方法**：
- 分析架构文档提取服务组件
- 识别用户请求主链路
- 映射服务间依赖关系
- 标记单点故障风险点

**输出**：核心路径清单，包含入口服务 → 核心服务 → 数据层 → 外部依赖

#### 1.2 指标-告警规则生成

**指标类型**：
- 黄金指标：延迟、流量、错误、饱和度
- 业务指标：转化率、订单量、DAU/MAU
- 自定义指标：特定业务事件

**告警规则配置**：

| 规则类型 | 生成方式 | 参数来源 |
|----------|----------|----------|
| 静态阈值 | 固定值 + SLA 要求 | SLA/SLO 定义 |
| 历史基线 | 统计历史数据 | 7d/30d 均值/标准差 |
| 动态阈值 | 趋势分析 + 异常检测 | 预测区间 |
| 复合告警 | 多指标组合逻辑 | 业务规则 |

**告警参数**：

```yaml
alert_rule:
  name: {metric_name}_alert
  severity: critical | high | medium | low
  threshold:
    operator: > | < | >= | <=
    value: {threshold_value}
  baseline:
    method: historical | moving_average | seasonal
    window: 7d | 30d | custom
    deviation: {sigma_value}σ
  sensitivity: high | medium | low
  evaluation_interval: {interval}
  for: {duration}
```

#### 1.3 告警收敛规则

**收敛策略**：
- 告警分组：按服务/组件/时间窗口聚合
- 告警抑制：父子告警关系，高优先级抑制低优先级
- 静默规则：维护窗口内自动静默
- 去重规则：相同告警合并通知

#### 1.4 On-Call 手册生成

**手册内容**：
- 问题描述
- 自检清单
- 常见原因
- 快速修复步骤
- 升级条件
- 关联文档链接

### Step 2: 异常检测（from monitoring-anomaly）

**目标**：实时检测指标异常，识别趋势偏移与突发波动

> **跨模块边界说明**：异常检测触发后，归因分析委托 pm-06 analysis-anomaly，本步骤仅负责异常识别和告警触发，不重复实现归因能力。

#### 2.1 告警分类

**分类维度**：

| 类别 | 子类 | 特征 |
|------|------|------|
| 系统层 | 基础设施 | CPU/内存/磁盘/网络 |
| 系统层 | 容器 | Pod/容器重启/资源限制 |
| 系统层 | 中间件 | 数据库/缓存/消息队列 |
| 应用层 | 服务响应 | 超时/连接失败/资源耗尽 |
| 应用层 | 错误异常 | 异常堆栈/业务异常 |
| 业务层 | 业务指标 | 转化率/订单量/支付失败 |
| 业务层 | 用户行为 | DAU 异常/功能使用异常 |
| 外部层 | 第三方服务 | API 超时/返回错误 |
| 外部层 | CDN/DNS | 访问异常/证书问题 |

**输出**：

```yaml
classification:
  layer: system | application | business | external
  category: {specific_category}
  confidence: 0.0-1.0
  related_alerts: [alert_ids]
```

#### 2.2 关联分析

**分析方法**：
- 时间窗口关联（告警时间接近）
- 服务拓扑关联（同一服务链路）
- 指标波动关联（同时发生异常）
- 变更事件关联（发布/配置变更后触发）

**输出**：

```yaml
correlation:
  is_correlated: true | false
  correlation_type: time | topology | metrics | change
  related_alerts: [alert_ids]
  correlation_score: 0.0-1.0
  root_alert: {alert_id} | null
```

#### 2.3 根因定位 (5 Why)

**分析方法**：
- 基于告警类型的常见根因模式匹配
- 基于变更事件的时序分析
- 基于依赖拓扑的向上溯源
- 基于知识库的历史案例匹配

**5 Why 输出格式**：

```yaml
root_cause:
  why_chain:
    - question: "为什么 {现象}？"
      answer: "{直接原因}"
      evidence: "{证据}"
    - question: "为什么 {直接原因}？"
      answer: "{深层原因}"
      evidence: "{证据}"
    - question: "为什么 {深层原因}？"
      answer: "{根因}"
      evidence: "{证据}"
    - question: "为什么 {根因}？"
      answer: "{系统性问题}"
      evidence: "{证据}"
    - question: "为什么 {系统性问题}？"
      answer: "{根本原因}"
      evidence: "{证据}"
  root_cause_summary: "{一句话根因描述}"
  root_cause_category: {category}
  confidence: 0.0-1.0
```

#### 2.4 影响评估

**评估维度**：

| 维度 | 指标 |
|------|------|
| 用户影响 | 受影响用户数/比例 |
| 功能影响 | 核心功能可用性 |
| 业务影响 | 转化率/订单量损失 |
| 收入影响 | 预估 GMV 损失 |
| 声誉影响 | 客诉数量/舆情 |

**输出**：

```yaml
impact_scope:
  level: critical | major | minor | negligible
  affected_users:
    count: {number}
    percentage: {percentage}
  affected_features:
    - feature_name: {name}
      availability: {percentage}
  business_metrics:
    - metric: {name}
      impact: {value}
      duration: {time}
  revenue_impact:
    estimated_loss: {amount}
    confidence: {percentage}
```

#### 2.5 修复建议

**建议类型**：

| 根因类型 | 建议模板 |
|----------|----------|
| 资源不足 | 扩容/资源调整方案 |
| 代码问题 | 回滚/热修复方案 |
| 配置错误 | 配置修正步骤 |
| 依赖故障 | 切换/降级方案 |
| 流量异常 | 限流/熔断配置 |

**输出**：

```yaml
remediation:
  immediate_actions:
    - step: {description}
      command: {command} | {ui_action}
      automated: true | false
      rollback_command: {command}
  long_term_fixes:
    - description: {description}
      priority: P0-P3
      effort: {story_points}
  estimated_resolution_time: {minutes}
```

### Step 3: 看板配置（from monitoring-dashboard）

**目标**：构建可视化监控看板，聚合关键指标与告警状态

#### 3.1 角色视角确定

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

#### 3.2 核心指标分组

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

#### 3.3 可视化组件选择

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

#### 3.4 Dashboard 模板生成

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

### Step 4: 告警升级（from monitoring-escalation）

**目标**：告警分级与升级处理，确保关键告警及时触达责任人

#### 4.1 自动分级

**分级模型**：

```yaml
alert_severity:
  critical:
    criteria:
      - service_availability < 99%
      - error_rate > 5%
      - response_time_p99 > 5000ms
      - affected_users > 10000
    response_time_sla: 5 minutes
  high:
    criteria:
      - service_availability < 99.5%
      - error_rate > 1%
      - response_time_p99 > 2000ms
      - affected_users > 1000
    response_time_sla: 15 minutes
  medium:
    criteria:
      - service_availability < 99.9%
      - error_rate > 0.5%
      - response_time_p99 > 1000ms
    response_time_sla: 1 hour
  low:
    criteria:
      - non_functional_metrics
      - warning_thresholds
    response_time_sla: next_business_day
```

**分级输出**：

```yaml
alert_classification:
  alert_id: {id}
  original_severity: {level}
  assessed_severity: {level}
  confidence: {percentage}
  factors:
    - factor: service_impact
      contribution: {value}
    - factor: user_impact
      contribution: {value}
    - factor: business_impact
      contribution: {value}
  adjusted: true | false
  adjustment_reason: {reason}
```

#### 4.2 升级链触发

**升级规则**：

```yaml
escalation_rules:
  - rule_id: ESC-001
    trigger:
      severity: critical
      duration: 5 minutes
      not_acknowledged: true
    escalation_chain:
      - level: 1
        recipients: [oncall_primary]
        notification_channels: [sms, call, slack]
      - level: 2
        trigger: no_ack_15min
        recipients: [oncall_secondary, tl]
        notification_channels: [sms, call, slack, email]
      - level: 3
        trigger: no_ack_30min
        recipients: [engineering_manager, incident_commander]
        notification_channels: [sms, call]
  - rule_id: ESC-002
    trigger:
      severity: high
      duration: 15 minutes
    escalation_chain: [...]
```

**升级执行输出**：

```yaml
escalation_chain:
  alert_id: {id}
  current_level: 1
  escalation_history:
    - timestamp: {ISO8601}
      level: 1
      action: initial_notification
      recipients: [{name}]
      status: sent | delivered | acknowledged
  next_escalation:
    timestamp: {ISO8601}
    level: 2
    trigger_reason: {reason}
```

#### 4.3 通知发送

**通知渠道**：

| 渠道 | 适用级别 | 内容格式 |
|------|----------|----------|
| SMS | Critical, High | 简短摘要 + 链接 |
| Phone Call | Critical | 语音播报 + 确认 |
| Slack | All | 详细卡片 + 操作 |
| Email | Medium, Low | 完整报告 |
| PagerDuty | All | 标准格式 |

**通知模板**：

```yaml
notification:
  channels:
    - channel: sms
      content: |
        [CRITICAL] {service_name}
        {alert_summary}
        详情: {link}
    - channel: slack
      content: |
        :rotating_light: *{severity}* Alert
        *Service:* {service_name}
        *Issue:* {alert_summary}
        *Impact:* {affected_users} users affected
        *Action:* {recommended_action}
        <{link}|View Details>
    - channel: email
      subject: "[{severity}] {service_name} - {alert_title}"
      body: |
        Alert Details:
        ...
```

**发送状态**：

```yaml
notification_status:
  alert_id: {id}
  notifications:
    - channel: sms
      recipient: {phone}
      status: sent | delivered | failed
      sent_at: {ISO8601}
    - channel: slack
      recipient: {channel_name}
      status: sent | delivered | failed
      sent_at: {ISO8601}
  acknowledgment:
    required: true | false
    acknowledged_by: {name}
    acknowledged_at: {ISO8601}
```

#### 4.4 值班报告

**报告内容**：

```yaml
oncall_report:
  period:
    start: {ISO8601}
    end: {ISO8601}
  oncall_engineer:
    name: {name}
    primary: {true | false}
  summary:
    total_alerts: {count}
    critical: {count}
    high: {count}
    medium: {count}
    low: {count}
  response_metrics:
    average_acknowledgment_time: {minutes}
    average_resolution_time: {minutes}
    sla_compliance: {percentage}
  top_alerts:
    - alert_id: {id}
      severity: {level}
      title: {title}
      acknowledged_at: {ISO8601}
      resolved_at: {ISO8601}
  unresolved_alerts:
    - alert_id: {id}
      severity: {level}
      reason: {reason}
  action_items:
    - description: {description}
      owner: {name}
      deadline: {date}
```

## 输出


**输出文件路径**：`output/pm-monitoring/monitoring-pipeline/`
**输出Schema**：

```json
{
  "type": "object",
  "required": ["metrics", "alert_id", "classification", "root_cause", "impact_scope", "dashboards", "report_id", "alerts", "oncall_schedule"],
  "properties": {
    "metrics": {"type": "array", "description": "监控指标配置列表，包含名称、类别、阈值和基线"},
    "alert_policies": {"type": "object", "description": "告警策略配置"},
    "suppression_rules": {"type": "object", "description": "收敛规则配置"},
    "alert_id": {"type": "string", "description": "告警ID"},
    "timestamp": {"type": "string", "description": "告警时间"},
    "classification": {"type": "object", "description": "告警分类，包含层级、类别和置信度"},
    "root_cause": {"type": "object", "description": "根因分析，包含5Why链和摘要"},
    "impact_scope": {"type": "object", "description": "影响范围，包含级别、受影响用户和功能"},
    "remediation": {"type": "object", "description": "修复建议，包含即时行动列表"},
    "needs_human_escalation": {"type": "boolean", "description": "是否需要人工升级"},
    "dashboards": {"type": "array", "description": "Dashboard配置列表，包含角色、标题和组件"},
    "report_id": {"type": "string", "description": "报告唯一标识"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "alerts": {"type": "array", "description": "告警列表，包含严重度、升级级别和已执行动作"},
    "oncall_schedule": {"type": "object", "description": "值班安排，包含当前和下一轮值班信息"},
    "oncall_reports": {"type": "array", "description": "值班报告，包含告警数、SLA合规率和平均解决时间"}
  }
}
```

```
├── monitoring-pipeline.json
├── monitoring-pipeline.md
├── core_paths.md
├── metrics/
│   ├── availability/
│   │   └── alert_rule.yaml
│   ├── latency/
│   │   └── alert_rule.yaml
│   ├── error_rate/
│   │   └── alert_rule.yaml
│   └── [custom_metrics]/
│       └── alert_rule.yaml
├── alert_policies.yaml
├── suppression_rules.yaml
├── oncall_handbook.md
├── anomaly/
│   ├── {alert_id}/
│   │   ├── classification.md
│   │   ├── correlation.md
│   │   ├── root_cause.md
│   │   ├── impact_assessment.md
│   │   ├── remediation.md
│   │   └── needs_human_escalation: true | false
│   └── escalation_queue.md
├── dashboards/
│   ├── {role}/
│   │   └── {dashboard_name}.yaml
│   ├── shared/
│   │   ├── alert_dashboard.yaml
│   │   └── system_health_dashboard.yaml
│   └── templates/
│       └── dashboard_template.yaml
├── escalation/
│   ├── alerts/
│   │   └── {date}/
│   │       ├── {alert_id}/
│   │       │   ├── severity.yaml
│   │       │   ├── escalation_chain.yaml
│   │       │   └── notification_status.yaml
│   │       └── escalation_summary.yaml
│   ├── oncall_schedule/
│   │   └── {week}.yaml
│   └── oncall_reports/
│       └── {date}.yaml
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| 指标覆盖率<80% | 标记警告，提示补充指标，列出缺失的核心指标 |
| 指标覆盖率80%-95% | 标记提示，建议补充非核心指标 |
| 阈值冲突（同一指标≥2条告警规则） | 保留severity最高的规则，其余标记为重复并禁用 |
| 基线数据不足（<7天历史数据） | 使用静态阈值作为fallback，标记"需补充数据，7天后自动切换动态基线" |
| 新增服务 | 自动继承基础告警模板（CPU≥80%、内存≥85%、错误率≥1%），提示需专项配置 |
| P0服务告警缺失 | 强制补充黄金指标告警，不可跳过 |
| 告警噪音率≥15% | 自动收紧阈值10%，标记需人工审核 |
| 告警风暴（≥5条告警/5分钟） | 合并为单一告警，标记主因，抑制关联告警 |
| 根因不确定（候选原因≥3个） | 标记需人工排查，输出Top3候选原因及置信度 |
| 影响范围扩大（受影响用户增长≥20%/10分钟） | 自动升级severity 1级（最高P0） |
| 影响范围扩大（受影响用户增长5%-20%/10分钟） | 自动升级severity 1级 |
| 知识库命中（相似度≥0.85） | 输出历史解决方案，标注置信度 |
| 知识库命中（相似度0.6-0.85） | 输出历史解决方案，标注"需人工确认适用性" |
| 无历史案例 | 输出5 Why追问链，等待反馈 |
| P0异常恢复后 | 自动触发复盘流程，24小时内生成复盘报告 |
| 指标数量过多 | 自动分组，折叠低优先级 |
| 告警数量过多 | 仅显示未解决告警 |
| 页面加载慢 | 延迟加载低优先级组件 |
| 角色变更 | 自动调整指标配置 |
| 指标无数据 | 显示"No Data"状态 |
| Critical 无 ACK | 5 分钟后升级 L2 |
| 连续触发相同告警 | 合并通知，避免轰炸 |
| On-Call 无人响应 | 升级至 Manager |
| 告警误报率高 | 反馈调整阈值 |
| 升级超时 | 自动通知应急联系人 |

## 质量检查

- [ ] 核心路径覆盖率 ≥ 95%
- [ ] 每个核心路径至少有 4 个黄金指标
- [ ] 告警噪音率 < 15%
- [ ] 所有 P0 服务有 On-Call 手册
- [ ] 告警规则无冲突无遗漏
- [ ] SLA 要求有对应指标支撑
- [ ] 告警分类准确率 ≥ 85%
- [ ] 根因定位准确率 ≥ 80%
- [ ] 5 Why 链条完整（3-5 层）
- [ ] 修复建议可执行
- [ ] 升级标记无遗漏
- [ ] MTTR 降低目标达成
- [ ] 所有角色都有对应 Dashboard
- [ ] 核心指标覆盖率 ≥ 90%
- [ ] 可视化组件选择合理
- [ ] 布局美观、层次清晰
- [ ] 告警配置正确
- [ ] 刷新频率符合角色需求
- [ ] 告警分级准确率 ≥ 90%
- [ ] 升级触发及时性 100%
- [ ] 通知送达率 ≥ 99%
- [ ] SLA 响应时间达标
- [ ] 值班报告完整率 100%
- [ ] 升级链配置正确

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 指标体系 | 用户提供核心业务指标列表，基于通用指标模板补充黄金指标 | 基础监控指标配置，缺乏指标体系支撑 |
| 产品架构 | 用户提供服务组件清单，按通用微服务架构推断依赖关系 | 基础核心路径清单，依赖关系为推断 |
| SLA 要求 | 用户提供关键服务的可用性目标，采用行业默认阈值（99.9%/99.5%/99%） | 基于默认阈值的告警规则 |
| 现有监控 | 跳过兼容性检查，从零生成监控配置 | 全新监控配置 |
| 版本发布信息 | 跳过变更关联分析，在归因中标注"无法排除变更因素" | 排除变更关联的归因结果 |
| 配置变更记录 | 跳过配置变更关联，在归因中标注"无法排除配置变更因素" | 排除配置关联的归因结果 |
| 流量变化数据 | 跳过流量分析维度，在影响评估中标注流量数据缺失 | 缺少流量维度的分析结果 |
| 根因知识库 | 5 Why 分析完全依赖逻辑推理，无法提供历史参考方案 | 纯推理归因结果，无历史案例参考 |
| 用户角色 | 使用默认角色模板（Executive/Engineering/On-Call），用户后续调整 | 通用角色Dashboard模板 |
| 现有 Dashboard | 从零生成Dashboard配置，标注可能与现有配置冲突 | 全新Dashboard配置 |
| On-Call 排班 | 用户提供当前值班人员联系方式，AI据此配置升级链 | 基于用户输入的升级链 |
| 告警规则 | 使用默认升级规则（Critical 5min/High 15min/Medium 1h），标注需人工确认 | 基于默认规则的升级配置 |
| 知识库 | 升级建议中不包含历史案例参考，标注"无历史案例" | 无历史参考的升级建议 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **指标体系缺失**：请用户提供核心业务指标列表（如订单量、转化率、DAU等），AI将基于产品类型自动补充通用黄金指标（延迟、流量、错误率、饱和度）
2. **产品架构缺失**：请用户提供服务组件清单或系统名称列表，AI将按通用架构模式推断服务依赖关系，并在输出中标注推断项需人工确认
3. **SLA 要求缺失**：请用户提供关键服务的可用性目标（如"支付服务需99.9%可用"），未指定的服务采用行业默认标准，输出中标注默认值供人工审核
4. **告警数据缺失**：请用户描述异常现象，包括：症状表现、发生时间、受影响的服务/功能、影响范围（用户数/功能点），AI将基于描述进行归因分析
5. **上下文数据缺失**（版本发布/配置变更/流量变化）：AI将在归因分析中明确标注无法排除的因素，建议人工排查这些维度
6. **根因知识库缺失**：AI将完全依赖5 Why逻辑推理进行归因，输出中标注"无历史案例参考"，建议人工验证归因结论
7. **用户角色缺失**：使用默认角色模板生成Dashboard，包含Executive概览、Engineering详情、On-Call实时三个标准视图，用户可根据实际角色需求调整
8. **On-Call排班缺失**：请用户提供当前值班人员姓名和联系方式（手机/Slack/邮箱），AI将据此配置升级通知链
9. **告警规则缺失**：采用默认升级规则模板（Critical→5min→L1/L2/L3，High→15min→L1/L2），输出中标注默认规则需人工审核确认

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| core_paths | array | 是 | 核心路径列表，至少1条路径 |
| core_paths[].path_name | string | 是 | 路径名称 |
| metrics | object | 是 | 监控指标配置，按路径分组 |
| alert_policies | array | 是 | 告警策略列表，至少1条规则 |
| suppression_rules | array | 否 | 抑制规则列表 |
| oncall_handbook | object | 否 | On-Call手册，须含escalation_paths/emergency_procedures |
| classification | object | 是 | 告警分类，须含alert_type/severity/service |
| classification.severity | string | 是 | 严重度，仅允许P0/P1/P2/P3 |
| root_cause | object | 是 | 根因分析，须含5_whys和conclusion |
| root_cause.5_whys | array | 是 | 5 Why链条，3-5层 |
| impact_assessment | object | 否 | 影响评估，须含affected_users/affected_services |
| remediation | object | 否 | 修复建议，须含immediate_actions/long_term_fixes |
| dashboard_config | object | 是 | Dashboard配置，须含role/panels |
| dashboard_config.role | string | 是 | 角色名称 |
| dashboard_config.panels | array | 是 | 面板列表，至少1个面板 |
| shared_views | object | 否 | 共享视图配置 |
| templates | array | 否 | 模板列表 |
| alert_classification | object | 是 | 告警分级，须含alert_id/severity/category |
| alert_classification.severity | string | 是 | 严重度，仅允许Critical/High/Medium/Low |
| escalation_chain | array | 是 | 升级链，至少1级 |
| notification_records | array | 否 | 通知记录，每项须含channel/recipient/status |
| oncall_report | object | 否 | 值班报告，须含total_alerts/resolved_count |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| metrics-system | 指标定义变更 | 监控指标配置和告警规则 | 更新指标映射和告警阈值 |
| 用户提供-产品架构 | 架构变更 | 核心路径和服务依赖 | 重新识别核心路径和依赖链 |
| 用户提供-SLA | SLA目标变更 | 告警阈值和分级标准 | 调整告警规则和升级条件 |
| release-gradual | 版本发布记录更新 | 变更关联分析 | 更新关联事件和归因 |
| 根因知识库 | 历史案例更新 | 根因匹配和建议 | 更新参考案例库 |
| 用户提供-角色 | 角色需求变更 | Dashboard分层和面板布局 | 重新设计角色视图 |
| 值班管理系统 | 排班变更 | 通知接收人和升级链 | 更新On-Call排班和通知配置 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| monitoring-orchestrator | 监控预警全流程完成 | 输出文件更新 | 构建完成状态和关键配置 |
| iteration-decision | P0告警触发 | 写入输出文件 | 紧急告警和升级详情 |

## 版本历史

- v3.0: 合并 monitoring-system + monitoring-anomaly + monitoring-dashboard + monitoring-escalation
