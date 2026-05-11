---
name: monitoring-escalation
description: 当需要配置告警升级和On-Call流程时使用。告警升级与 On-Call 自动化，自动进行告警分级、触发升级链、发送通知并生成值班报告。关键词：告警升级、升级流程、On-Call、告警通知、应急响应、值班。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 9: 告警升级与 On-Call 自动化 🤖

## 核心原则

1. **升级是保护不是推诿**：升级的目的是让对的人在对的时间介入，而非推卸责任
2. **分级即响应策略**：不同级别对应不同的响应SLA和资源投入，高级别告警必须高优先级响应
3. **On-Call是安全网不是惩罚**：On-Call制度的目标是保障系统稳定，必须合理轮值和补偿

## 交互模式

🤖→👤 AI建议人类审批（升级需人类决策）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 告警数据 | JSON | 是 | output/pm-monitoring/monitoring-system/告警数据 | 告警内容、级别、来源 |
| On-Call 排班 | JSON | 是 | 值班管理系统 → 排班表 | 值班表和联系方式 |
| 告警规则 | JSON | 是 | output/pm-monitoring/monitoring-system/告警规则 | 升级规则和阈值配置 |
| 知识库 | JSON | ○ | output/pm-monitoring/monitoring-escalation/知识库 | 问题处理指南和历史案例 |

## 执行步骤

### Step 1: 自动分级

**目标**：基于规则和 ML 模型自动评估告警级别

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

### Step 2: 升级链触发

**目标**：根据告警级别和规则触发相应升级

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

### Step 3: 通知发送

**目标**：通过多渠道发送告警通知

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

### Step 4: 值班报告

**目标**：自动生成 On-Call 值班报告

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

**输出Schema**：

```json
{
  "type": "object",
  "required": ["report_id", "alerts", "oncall_schedule"],
  "properties": {
    "report_id": {"type": "string", "description": "报告唯一标识"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "alerts": {"type": "array", "description": "告警列表，包含严重度、升级级别和已执行动作"},
    "oncall_schedule": {"type": "object", "description": "值班安排，包含当前和下一轮值班信息"},
    "oncall_reports": {"type": "array", "description": "值班报告，包含告警数、SLA合规率和平均解决时间"}
  }
}
```

```
├── alerts/
│   └── {date}/
│       ├── {alert_id}/
│       │   ├── severity.yaml
│       │   ├── escalation_chain.yaml
│       │   └── notification_status.yaml
│       └── escalation_summary.yaml
├── oncall_schedule/
│   └── {week}.yaml
└── oncall_reports/
    └── {date}.yaml
```

### 告警升级输出格式

```yaml
escalation:
  report_id: {uuid}
  generated_at: {ISO8601}
  alerts:
    - id: {alert_id}
      severity: critical
      affected_service: {service_name}
      escalation_level: 2
      action_taken:
        - timestamp: {ISO8601}
          action: notified_oncall
          channel: sms
        - timestamp: {ISO8601}
          action: escalated
          level: 2
          reason: no_acknowledgment
  oncall_schedule:
    current:
      primary: {name}
      secondary: {name}
      period: {start} to {end}
    next:
      primary: {name}
      secondary: {name}
      period: {start} to {end}
  oncall_reports:
    - period: {start} to {end}
      total_alerts: {count}
      sla_compliance: {percentage}
      average_resolution_time: {minutes}
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| Critical 无 ACK | 5 分钟后升级 L2 |
| 连续触发相同告警 | 合并通知，避免轰炸 |
| On-Call 无人响应 | 升级至 Manager |
| 告警误报率高 | 反馈调整阈值 |
| 升级超时 | 自动通知应急联系人 |

## 质量检查

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
| 告警数据 | 用户提供告警信息（现象、服务、时间），AI基于描述推断级别并生成升级建议 | 基于用户描述的升级建议 |
| On-Call 排班 | 用户提供当前值班人员联系方式，AI据此配置升级链 | 基于用户输入的升级链 |
| 告警规则 | 使用默认升级规则（Critical 5min/High 15min/Medium 1h），标注需人工确认 | 基于默认规则的升级配置 |
| 知识库 | 升级建议中不包含历史案例参考，标注"无历史案例" | 无历史参考的升级建议 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **告警数据缺失**：请用户提供告警信息，包括：异常现象描述、受影响服务名称、发生时间、预估影响范围，AI将基于描述推断告警级别并生成升级建议
2. **On-Call排班缺失**：请用户提供当前值班人员姓名和联系方式（手机/Slack/邮箱），AI将据此配置升级通知链
3. **告警规则缺失**：采用默认升级规则模板（Critical→5min→L1/L2/L3，High→15min→L1/L2），输出中标注默认规则需人工审核确认

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| alert_classification | object | 是 | 告警分级，须含alert_id/severity/category |
| alert_classification.severity | string | 是 | 严重度，仅允许Critical/High/Medium/Low |
| escalation_chain | array | 是 | 升级链，至少1级 |
| notification_records | array | 否 | 通知记录，每项须含channel/recipient/status |
| oncall_report | object | 否 | 值班报告，须含total_alerts/resolved_count |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| monitoring-system | 告警规则变更 | 升级触发条件和分级标准 | 更新升级规则和分级映射 |
| 值班管理系统 | 排班变更 | 通知接收人和升级链 | 更新On-Call排班和通知配置 |
| monitoring-anomaly | 告警归因结果更新 | 升级建议和处理参考 | 更新升级建议中的根因信息 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| monitoring-orchestrator | 升级处理完成 | 输出文件更新 | 升级完成状态和处理结果 |
| iteration-backlog | P0告警触发 | 写入输出文件 | 紧急告警和升级详情 |
