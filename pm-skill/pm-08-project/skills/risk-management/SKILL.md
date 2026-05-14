---
name: risk-management
description: 当需要持续监控项目风险或处理风险升级时使用。风险监控与升级处理一体化，Step 1持续监控风险状态、检测风险指标变化与触发条件，Step 2对高优先级风险进行升级处理、启动应对流程与资源调配。关键词：风险监控、风险预警、风险追踪、风险状态、风险指标、风险升级、问题升级、升级流程、升级通知、应急升级、问题上报、盯风险、要升级了。
metadata:
  module: "项目管理与执行"
  sub-module: "风险管理"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "风险怎么持续监控"
    - "风险状态怎么样了"
    - "有没有新的风险冒出来"
    - "风险要升级了怎么办"
    - "问题太大了要上报"
    - "出了大问题找谁"
  interaction_mode: "ai_auto"
---

# 风险监控与升级处理自动化

## 核心原则

1. **透明度即协作**：风险监控状态、预警信息和升级路径全员可见，确保相关方及时知情
2. **风险前置**：持续监控风险指标，在风险升级前触发预警；升级规则前置定义，满足条件自动触发升级
3. **自动化追踪**：风险状态变化、应对效果、升级通知发送、处理状态、闭环确认自动追踪
4. **升级不可延迟**：当风险达到升级阈值时，延迟即失职，升级流程在SLA内自动触发

## 交互模式

**🤖 AI自动执行**

- 监控和预警由AI自动执行
- 每小时执行指标检查
- 预警实时触发和通知
- 升级判断和路径确定由AI自动完成
- 通知自动发送
- 人类接收预警通知并决策
- 应对调整需人类批准
- 升级结果记录由AI维护
- 复杂升级需人类干预决策

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| risk_register | object | 是 | output/pm-project/risk-identification/risk_register.json | 风险登记册 |
| project_data | object | 是 | 项目管理系统 → 项目数据 | 项目实时数据 |
| trigger_conditions | object | 是 | 用户提供 | 配置的触发条件 |
| mitigation_actions | object[] | ○ | output/pm-project/risk-management/应对追踪 | 已执行的应对措施 |
| issue_data | object | 是 | 用户提供 | 问题数据（Step 2使用） |
| escalation_rules | object | 是 | 用户提供 | 升级规则配置（Step 2使用） |
| organizational_structure | object | 是 | 用户提供 | 组织结构，用于确定升级路径（Step 2使用） |
| pending_escalations | object[] | ○ | output/pm-project/risk-management/升级记录 | 待处理的升级请求（Step 2使用） |

## 执行步骤

### Step 1: 风险监控（持续监控风险状态，检测风险指标变化与触发条件）

#### Step 1.1: 风险指标自动追踪

**动作**：
- 为每个活跃风险定义追踪指标
- 收集指标当前值
- 与基线对比
- 计算指标趋势

**输出**：
```json
{
  "risk_indicators": [{
    "risk_id": "RISK-001",
    "indicators": [{
      "indicator_name": "string",
      "current_value": number,
      "baseline_value": number,
      "threshold_warning": number,
      "threshold_critical": number,
      "trend": "improving | stable | worsening",
      "trend_percentage": number,
      "last_measured": "ISO datetime"
    }]
  }]
}
```

#### Step 1.2: 风险状态自动更新

**动作**：
- 基于指标变化评估风险状态
- 识别风险升级或降级
- 更新风险登记册
- 记录状态变更历史

**输出**：
```json
{
  "risk_status_updates": [{
    "risk_id": "RISK-001",
    "previous_status": "string",
    "new_status": "string",
    "status_change_reason": "string",
    "probability_change": 0.0-1.0,
    "impact_change": 0.0-1.0,
    "priority_reassessment": boolean,
    "updated_at": "ISO datetime"
  }],
  "status_summary": {
    "status_distribution": {
      "active": number,
      "escalated": number,
      "improving": number,
      "resolved": number
    },
    "significant_changes": number
  }
}
```

#### Step 1.3: 新风险自动识别

**动作**：
- 扫描风险指标异常
- 检测未在登记册中的风险信号
- 交叉验证新风险
- 评估是否需要添加到登记册

**输出**：
```json
{
  "new_risks_identified": [{
    "risk_id": "RISK-NEW-001",
    "description": "string",
    "detection_signal": "string",
    "signal_source": "string",
    "confidence": 0.0-1.0,
    "related_existing_risks": ["RISK-ID"],
    "auto_add_to_register": boolean
  }],
  "risk_signals_pending_review": number
}
```

#### Step 1.4: 风险预警自动触发

**动作**：
- 检测预警触发条件
- 评估预警严重度
- 生成预警通知
- 路由预警至相应接收人

**输出**：
```json
{
  "alerts_triggered": [{
    "alert_id": "ALERT-001",
    "risk_id": "RISK-001",
    "alert_type": "threshold_breach | trend_worsening | new_risk | mitigation_failed",
    "severity": "critical | high | medium | low",
    "message": "string",
    "triggered_conditions": {
      "indicator_name": "string",
      "current_value": number,
      "threshold_value": number
    },
    "notification_routed": ["string"],
    "created_at": "ISO datetime"
  }],
  "alert_summary": {
    "critical_alerts": number,
    "high_alerts": number,
    "medium_alerts": number,
    "low_alerts": number,
    "total_alerts_24h": number,
    "alert_trend": "increasing | stable | decreasing"
  }
}
```

#### Step 1.5: 应对效果自动追踪

**动作**：
- 检查已实施应对措施的状态
- 评估应对效果（指标是否改善）
- 识别应对失效情况
- 建议应对调整

**输出**：
```json
{
  "mitigation_effectiveness": [{
    "risk_id": "RISK-001",
    "mitigation_action": "string",
    "implementation_date": "ISO date",
    "expected_impact": "string",
    "actual_impact": "string",
    "effectiveness_score": 0.0-1.0,
    "status": "effective | partially_effective | ineffective | needs_adjustment",
    "next_review_date": "ISO date",
    "adjustment_suggestions": ["string"]
  }],
  "effectiveness_summary": {
    "total_mitigations_tracked": number,
    "effective_count": number,
    "partially_effective_count": number,
    "ineffective_count": number,
    "overall_effectiveness_rate": 0.0-1.0
  }
}
```

---

### Step 2: 升级处理（高优先级风险升级处理，启动应对流程与资源调配）

Step 2接收Step 1的输出作为输入（风险数据来自Step 1的监控结果），结合问题数据、升级规则和组织结构，执行升级处理。

#### Step 2.1: 升级必要性自动判断

**动作**：
- 应用配置的升级规则
- AI辅助判断是否需要升级
- 评估升级紧迫性
- 标注升级原因

**输出**：
```json
{
  "escalation_assessment": [{
    "item_id": "RISK-001",
    "item_type": "risk | issue",
    "rule_based_decision": {
      "escalation_needed": boolean,
      "matched_rule": "string",
      "rule_confidence": 0.0-1.0
    },
    "ai_assisted_decision": {
      "escalation_needed": boolean,
      "reasoning": "string",
      "ai_confidence": 0.0-1.0
    },
    "final_decision": {
      "escalate": boolean,
      "urgency": "critical | high | medium | low",
      "reason": "string",
      "escalation_type": "risk | issue | both"
    }
  }]
}
```

#### Step 2.2: 升级路径自动确定

**动作**：
- 基于组织结构确定升级路径
- 识别每一级的接收人
- 计算预计响应时间
- 生成升级路线图

**输出**：
```json
{
  "escalation_paths": [{
    "item_id": "RISK-001",
    "escalation_level": 1,
    "escalation_chain": [{
      "level": 1,
      "role": "string",
      "name": "string",
      "contact": "string",
      "notified_at": "ISO datetime",
      "response_deadline": "ISO datetime",
      "response_status": "pending | acknowledged | responded | escalated"
    }],
    "current_level": number,
    "estimated_resolution_time": "string",
    "escalation_timeline": "string"
  }]
}
```

#### Step 2.3: 升级通知自动发送

**动作**：
- 准备升级通知内容
- 选择适当的通知渠道
- 按升级路径发送通知
- 跟踪通知送达状态

**输出**：
```json
{
  "notifications_sent": [{
    "notification_id": "NOT-001",
    "item_id": "RISK-001",
    "recipient": "string",
    "recipient_role": "string",
    "channel": "email | sms | slack | phone",
    "subject": "string",
    "message": "string",
    "sent_at": "ISO datetime",
    "delivery_status": "sent | delivered | read | failed",
    "acknowledgment_required": boolean,
    "acknowledgment_deadline": "ISO datetime"
  }],
  "notification_summary": {
    "total_sent": number,
    "delivered": number,
    "pending_acknowledgment": number,
    "failed_delivery": number
  }
}
```

#### Step 2.4: 升级状态自动追踪

**动作**：
- 监控升级响应状态
- 追踪升级处理进度
- 记录升级结果
- 生成升级报告

**输出**：
```json
{
  "escalation_tracking": [{
    "item_id": "RISK-001",
    "escalation_id": "ESC-001",
    "status": "pending | in_progress | resolved | closed | expired",
    "current_level": number,
    "level_history": [{
      "level": 1,
      "escalated_at": "ISO datetime",
      "responded_at": "ISO datetime",
      "response": "string",
      "outcome": "approved | rejected | needs_more_info | escalated_up"
    }],
    "resolution": {
      "resolved_at": "ISO datetime",
      "resolution_summary": "string",
      "resolved_by": "string",
      "follow_up_required": boolean
    },
    "timeline": {
      "escalated_at": "ISO datetime",
      "first_response_at": "ISO datetime",
      "resolved_at": "ISO datetime",
      "total_escalation_hours": number
    }
  }]
}
```

---

## 输出

**存储路径**：`output/pm-project/risk-management/`

**输出文件**：

| 文件 | 路径 | 说明 |
|------|------|------|
| 风险管理数据 | risk-management.json | 风险监控与升级处理的结构化数据 |
| 风险管理报告 | risk-management.md | 人类可读的风险管理报告 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["risk_monitoring", "escalation", "metadata"],
  "properties": {
    "risk_monitoring": {"type": "object", "description": "风险监控数据，包含追踪风险、预警和应对效果"},
    "escalation": {"type": "object", "description": "升级处理数据，包含问题列表和升级路径模板"},
    "metadata": {"type": "object", "description": "元数据，包含监控周期、处理数和置信度"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| risk_monitoring.tracked_risks | array | 是 | 追踪风险列表，每项须含id、status |
| risk_monitoring.tracked_risks[].id | string | 是 | 风险唯一标识，格式RISK-NNN |
| risk_monitoring.tracked_risks[].status | string | 是 | 风险状态，枚举值active/escalated/improving/resolved |
| risk_monitoring.tracked_risks[].triggered_conditions | array | 否 | 触发条件列表 |
| risk_monitoring.tracked_risks[].latest_update | string | 是 | 最近更新时间，ISO 8601格式 |
| risk_monitoring.new_risks_identified | number | 是 | 新识别风险数 |
| risk_monitoring.alerts_triggered | array | 否 | 触发预警列表 |
| risk_monitoring.alerts_triggered[].id | string | 是 | 预警唯一标识 |
| risk_monitoring.alerts_triggered[].severity | string | 是 | 预警严重度，枚举值critical/high/medium/low |
| risk_monitoring.alerts_triggered[].message | string | 是 | 预警消息 |
| risk_monitoring.mitigation_effectiveness | object | 否 | 应对效果追踪数据 |
| escalation.issues | array | 是 | 升级问题列表，每项须含id、description、escalation_needed |
| escalation.issues[].id | string | 是 | 问题唯一标识，格式RISK-NNN或ISSUE-NNN |
| escalation.issues[].escalation_needed | boolean | 是 | 是否需要升级 |
| escalation.issues[].escalation_level | number | 是 | 升级级别，1-4 |
| escalation.issues[].escalation_path | array | 是 | 升级路径，至少含1个接收人 |
| escalation.issues[].notifications_sent | array | 否 | 已发送通知列表 |
| escalation.issues[].notifications_sent[].channel | string | 是 | 通知渠道，枚举值email/sms/slack/phone |
| escalation.issues[].notifications_sent[].status | string | 是 | 通知状态，枚举值sent/delivered/read/failed |
| escalation.issues[].status | string | 是 | 升级状态，枚举值pending/in_progress/resolved/closed |
| escalation.escalation_path_templates | array | 否 | 升级路径模板列表 |
| escalation.escalation_path_templates[].level | number | 是 | 升级级别 |
| escalation.escalation_path_templates[].expected_response_time | string | 是 | 预期响应时间 |
| metadata.monitoring_cycle | string | 是 | 监控周期，ISO 8601格式 |
| metadata.monitoring_duration | string | 是 | 监控持续时间 |
| metadata.risks_monitored | number | 是 | 监控风险数 |
| metadata.alerts_generated | number | 是 | 生成预警数 |
| metadata.escalations_processed | number | 是 | 已处理升级数 |
| metadata.pending_escalations | number | 是 | 待处理升级数 |
| metadata.avg_escalation_time_hours | number | 是 | 平均升级耗时（小时） |
| metadata.resolution_rate | number | 是 | 解决率，范围0.0-1.0 |
| metadata.confidence | number | 是 | 整体置信度，范围0.0-1.0 |

### 输出示例

```json
{
  "risk_monitoring": {
    "tracked_risks": [{
      "id": "RISK-001",
      "status": "escalated",
      "triggered_conditions": ["指标超过critical阈值"],
      "latest_update": "2024-04-12T10:00:00+08:00",
      "indicators": {}
    }],
    "new_risks_identified": 0,
    "alerts_triggered": [{
      "id": "ALERT-001",
      "severity": "critical",
      "message": "RISK-001关键指标超过critical阈值"
    }],
    "mitigation_effectiveness": {}
  },
  "escalation": {
    "issues": [{
      "id": "RISK-001",
      "description": "核心服务响应时间持续恶化",
      "escalation_needed": true,
      "escalation_level": 2,
      "escalation_path": ["项目经理-张明", "技术总监-李强"],
      "notifications_sent": [{
        "channel": "sms",
        "recipient": "张明",
        "status": "delivered"
      }],
      "status": "in_progress"
    }],
    "escalation_path_templates": [{
      "level": 1,
      "title": "团队级升级",
      "criteria": "团队内部无法解决的障碍",
      "typical_owner": "Team Lead / SM",
      "expected_response_time": "24h"
    }]
  },
  "metadata": {
    "monitoring_cycle": "2024-04-12T09:00:00+08:00",
    "monitoring_duration": "1h",
    "risks_monitored": 5,
    "alerts_generated": 1,
    "escalations_processed": 1,
    "pending_escalations": 0,
    "avg_escalation_time_hours": 2.5,
    "resolution_rate": 0.85,
    "confidence": 0.9
  }
}
```

---

## 预警触发规则

| 预警类型 | 触发条件 |
|----------|----------|
| 阈值突破 | 指标超过warning或critical阈值 |
| 趋势恶化 | 连续3天指标恶化 |
| 新风险 | 检测到未登记的风险信号 |
| 应对失效 | 应对措施实施后指标未改善 |

## 预警通知配置

| 严重度 | 通知方式 | 通知对象 |
|--------|----------|----------|
| Critical | 即时 + 短信 | 项目经理 + 发起人 |
| High | 即时通知 | 项目经理 |
| Medium | 每日汇总 | 团队 |
| Low | 周报记录 | 记录 |

## 标准升级路径模板

| 级别 | 标题 | 适用场景 | 典型负责人 | 响应时间 |
|------|------|----------|------------|----------|
| 1 | 团队级升级 | 团队内部无法解决的障碍 | Team Lead / SM | 24h |
| 2 | 项目级升级 | 影响项目目标的风险 | 项目经理 | 24h |
| 3 | 部门级升级 | 跨团队冲突或资源问题 | 部门负责人 | 48h |
| 4 | 执行级升级 | 可能影响业务的重大风险 | 总监/VP | 24h |

## 升级规则配置示例

```yaml
escalation_rules:
  automatic_escalation:
    - condition: "risk.priority == 'critical'"
      level: 2
      urgency: "critical"
      response_time: "1h"

    - condition: "risk.status == 'unresolved' AND risk.age_days > 7"
      level: 1
      urgency: "high"
      response_time: "24h"

    - condition: "issue.severity == 'high' AND issue.affected_scope == 'sprint'"
      level: 1
      urgency: "medium"
      response_time: "48h"

  escalation_timeout:
    default_hours: 48
    critical_hours: 24
    max_levels: 3
```

---

## 决策规则

| 条件 | 动作 |
|------|------|
| Critical预警 > 2个/天 | 升级至管理层 |
| 应对措施连续失效 | 触发应对重新设计 |
| 新风险识别频率激增 | 触发系统性风险审查 |
| 预警被忽略 > 48小时 | 自动升级 |
| 升级请求被拒绝 | 退回发起人，说明原因，记录拒绝理由 |
| P0风险升级超时≥15分钟无响应 | 自动升级至下一级（总监级） |
| P1风险升级超时≥2小时无响应 | 自动升级至下一级 |
| P2风险升级超时≥24小时无响应 | 自动升级至下一级 |
| 同一风险连续被搁置≥2次 | 升级至更高级别，标记"需紧急关注" |
| 升级与现有决策冲突 | 升级至更高权威，附冲突说明 |
| 升级涉及≥3个部门 | 自动抄送PMO，标记"跨部门协调" |
| 升级后24小时仍无响应 | 自动升级至CEO/CTO级 |

## 质量检查

- [ ] 风险状态更新及时
- [ ] 预警触发条件明确
- [ ] 风险趋势分析覆盖至少3个周期
- [ ] 高风险项有跟进记录
- [ ] 升级路径与风险等级匹配（P0→总监级/P1→经理级/P2→组长级）
- [ ] 升级通知在风险等级对应SLA内发送（P0≤5分钟/P1≤30分钟/P2≤4小时）
- [ ] 升级原因包含≥3个要素（风险描述+影响范围+紧急程度）
- [ ] 升级超时有自动跟进机制（P0每15分钟/P1每2小时/P2每24小时）
- [ ] 100%的升级操作有记录且可追溯

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 风险登记册 | 用户提供风险列表（风险描述+优先级），AI生成监控方案 | 基于用户输入的监控方案，缺少结构化风险数据支撑 |
| 项目数据 | 跳过指标自动采集，用户手动提供关键指标数值 | 基于手动数据的监控报告，缺少实时指标自动采集 |
| 触发条件 | 使用默认预警阈值，标注需人工确认 | 基于默认阈值的预警配置，需人工确认阈值合理性 |
| 应对措施 | 跳过应对效果追踪，仅监控风险状态变化 | 无应对效果追踪的监控，缺少应对效果评估维度 |
| 问题数据 | 用户描述问题现象和影响，AI基于描述生成升级建议 | 基于用户描述的升级建议，缺少结构化风险/问题数据支撑 |
| 升级规则 | 使用默认升级规则模板，标注需人工确认 | 基于默认规则的升级判断，需人工确认规则适用性 |
| 组织结构 | 用户提供关键决策人信息，AI据此构建升级链 | 基于用户输入的升级路径，可能不完整 |
| 待处理升级 | 从零开始记录升级状态，无法关联历史升级 | 全新升级追踪记录，无法关联历史升级上下文 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **风险登记册缺失**：请用户提供风险列表，包含风险描述和优先级，AI将据此生成监控指标定义和预警方案
2. **项目数据缺失**：跳过指标自动采集，请用户定期手动提供关键指标数值，AI将基于手动数据进行趋势分析和预警判断
3. **触发条件缺失**：采用默认预警阈值模板（概率变化>20%触发Warning，>40%触发Critical），输出中标注默认阈值需人工审核
4. **问题数据缺失**：请用户描述问题，包括：问题现象、影响范围、当前处理状态、紧急程度，AI将基于描述生成升级建议和通知内容
5. **升级规则缺失**：采用默认升级规则模板（Critical→立即升级L2，High→24h内升级L1，Medium→48h内评估），输出中标注默认规则需人工审核
6. **组织结构缺失**：请用户提供关键决策人姓名和联系方式，AI将据此构建升级路径和通知链

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 风险登记册变更（新增/关闭/优先级调整） | 监控指标定义、预警阈值、追踪范围 | 更新监控指标和预警配置，调整追踪范围 |
| 项目数据变更（进度/质量/资源变化） | 风险指标值、趋势分析、预警触发 | 重新采集指标数据，更新趋势分析和预警判断 |
| 触发条件变更（阈值调整/新增条件） | 预警触发逻辑、预警通知 | 重新应用触发条件，更新预警评估结果 |
| 风险数据变更（优先级调整/状态变化） | 升级必要性判断、升级路径确定 | 重新评估升级必要性，更新升级路径和通知 |
| 问题数据更新（新增问题/严重度变化） | 升级判断、通知内容 | 重新评估问题升级需求，更新通知内容 |
| 升级规则变更（阈值调整/新增规则） | 升级判断逻辑、自动触发条件 | 重新应用升级规则，更新升级评估结果 |
| 组织结构变更（人员变动/角色调整） | 升级路径、通知接收人 | 重新构建升级路径，更新通知接收人 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 风险状态变更（升级/降级/解决） | 项目经理、相关方 | 更新risk-management.json，通知项目经理和相关决策人 |
| 预警触发/解除 | 项目经理、风险负责人 | 更新risk-management.json，按预警通知配置发送通知 |
| 应对效果评估变更 | 风险负责人、项目经理 | 更新risk-management.json，通知风险负责人和项目经理 |
| 升级状态变更（新升级/已响应/已解决） | 项目经理、相关方 | 更新risk-management.json，通知相关决策人 |
| 升级路径变更 | 当前活跃升级、后续升级流程 | 更新risk-management.json，通知当前升级链中所有接收人 |
| 升级规则变更 | 后续所有升级判断 | 更新risk-management.json，通知规则维护者 |

---

## 版本历史

- v3.0: 合并 risk-monitoring + risk-escalation，Step 1风险监控（指标追踪、状态更新、新风险识别、预警触发、应对效果追踪），Step 2升级处理（必要性判断、路径确定、通知发送、状态追踪）
