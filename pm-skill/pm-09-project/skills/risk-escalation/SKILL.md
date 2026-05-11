---
name: risk-escalation
description: 当需要升级风险或问题时使用。风险升级与问题升级自动化，自动判断升级必要性、确定升级路径、发送升级通知、追踪升级状态，输出完整的升级记录和升级路径模板。关键词：风险升级、问题升级、升级流程、升级通知、应急升级。
metadata:
  module: "项目管理与执行"
  sub-module: "风险管理"
  type: "pipeline"
  version: "3.0"
  interaction_mode: "ai_auto"
---

# Pipeline 9: 风险升级与问题升级自动化

## 核心原则

1. **透明度即协作**：升级路径和升级状态全员可见，确保相关方及时知情
2. **风险前置**：升级规则前置定义，满足条件自动触发升级
3. **自动化追踪**：升级通知发送、处理状态、闭环确认自动追踪

## 交互模式

**🤖 AI自动执行**

- 升级判断和路径确定由AI自动完成
- 通知自动发送
- 人类接收通知并响应
- 升级结果记录由AI维护
- 复杂升级需人类干预决策

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| risk_data | object | 是 | output/pm-project/risk-monitoring/risk_monitoring | 风险数据 |
| issue_data | object | 是 | 用户提供 | 问题数据 |
| escalation_rules | object | 是 | 用户提供 | 升级规则配置 |
| organizational_structure | object | 是 | 用户提供 | 组织结构（用于确定升级路径） |
| pending_escalations | object[] | ○ | output/pm-project/risk-escalation/升级记录 | 待处理的升级请求 |

---

## 执行步骤

### Step 1: 升级必要性自动判断

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

### Step 2: 升级路径自动确定

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

### Step 3: 升级通知自动发送

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

### Step 4: 升级状态自动追踪

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

**存储路径**：`output/pm-project/risk-escalation/`

**输出文件**：escalation.json、metadata.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["escalation", "metadata"],
  "properties": {
    "escalation": {"type": "object", "description": "升级数据，包含问题列表和升级路径模板"},
    "metadata": {"type": "object", "description": "元数据，包含处理数、待处理数和解决率"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
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
| metadata.escalations_processed | number | 是 | 已处理升级数 |
| metadata.pending_escalations | number | 是 | 待处理升级数 |
| metadata.avg_escalation_time_hours | number | 是 | 平均升级耗时（小时） |
| metadata.resolution_rate | number | 是 | 解决率，范围0.0-1.0 |

```json
{
  "escalation": {
    "issues": [{
      "id": "RISK-001",
      "description": "string",
      "escalation_needed": boolean,
      "escalation_level": number,
      "escalation_path": ["string"],
      "notifications_sent": [{
        "channel": "string",
        "recipient": "string",
        "status": "string"
      }],
      "status": "pending | in_progress | resolved | closed"
    }],
    "escalation_path_templates": [{
      "level": 1,
      "title": "string",
      "criteria": "string",
      "typical_owner": "string",
      "expected_response_time": "string"
    }]
  },
  "metadata": {
    "escalations_processed": number,
    "pending_escalations": number,
    "avg_escalation_time_hours": number,
    "resolution_rate": 0.0-1.0
  }
}
```

---

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

## 标准升级路径模板

| 级别 | 标题 | 适用场景 | 典型负责人 | 响应时间 |
|------|------|----------|------------|----------|
| 1 | 团队级升级 | 团队内部无法解决的障碍 | Team Lead / SM | 24h |
| 2 | 项目级升级 | 影响项目目标的风险 | 项目经理 | 24h |
| 3 | 部门级升级 | 跨团队冲突或资源问题 | 部门负责人 | 48h |
| 4 | 执行级升级 | 可能影响业务的重大风险 | 总监/VP | 24h |

---

## 决策规则

| 条件 | 动作 |
|------|------|
| 升级请求被拒绝 | 退回发起人，说明原因，记录拒绝理由 |
| P0风险升级超时≥15分钟无响应 | 自动升级至下一级（总监级） |
| P1风险升级超时≥2小时无响应 | 自动升级至下一级 |
| P2风险升级超时≥24小时无响应 | 自动升级至下一级 |
| 同一风险连续被搁置≥2次 | 升级至更高级别，标记"需紧急关注" |
| 升级与现有决策冲突 | 升级至更高权威，附冲突说明 |
| 升级涉及≥3个部门 | 自动抄送PMO，标记"跨部门协调" |
| 升级后24小时仍无响应 | 自动升级至CEO/CTO级 |

## 质量检查

- [ ] 升级路径与风险等级匹配（P0→总监级/P1→经理级/P2→组长级）
- [ ] 升级通知在风险等级对应SLA内发送（P0≤5分钟/P1≤30分钟/P2≤4小时）
- [ ] 升级原因包含≥3个要素（风险描述+影响范围+紧急程度）
- [ ] 升级超时有自动跟进机制（P0每15分钟/P1每2小时/P2每24小时）
- [ ] 100%的升级操作有记录且可追溯

---

## 升级质量标准

- **升级完整性**：所有必要信息必须包含
- **升级及时性**：符合响应时间要求
- **升级准确性**：目标接收人正确
- **升级可追溯**：所有操作有记录

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 问题数据 | 用户描述问题现象和影响，AI基于描述生成升级建议 | 基于用户描述的升级建议，缺少结构化风险/问题数据支撑 |
| 升级规则 | 使用默认升级规则模板，标注需人工确认 | 基于默认规则的升级判断，需人工确认规则适用性 |
| 组织结构 | 用户提供关键决策人信息，AI据此构建升级链 | 基于用户输入的升级路径，可能不完整 |
| 待处理升级 | 从零开始记录升级状态，无法关联历史升级 | 全新升级追踪记录，无法关联历史升级上下文 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **问题数据缺失**：请用户描述问题，包括：问题现象、影响范围、当前处理状态、紧急程度，AI将基于描述生成升级建议和通知内容
2. **升级规则缺失**：采用默认升级规则模板（Critical→立即升级L2，High→24h内升级L1，Medium→48h内评估），输出中标注默认规则需人工审核
3. **组织结构缺失**：请用户提供关键决策人姓名和联系方式，AI将据此构建升级路径和通知链

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 风险数据变更（优先级调整/状态变化） | 升级必要性判断、升级路径确定 | 重新评估升级必要性，更新升级路径和通知 |
| 问题数据更新（新增问题/严重度变化） | 升级判断、通知内容 | 重新评估问题升级需求，更新通知内容 |
| 升级规则变更（阈值调整/新增规则） | 升级判断逻辑、自动触发条件 | 重新应用升级规则，更新升级评估结果 |
| 组织结构变更（人员变动/角色调整） | 升级路径、通知接收人 | 重新构建升级路径，更新通知接收人 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 升级状态变更（新升级/已响应/已解决） | 风险监控、项目经理、相关方 | 更新escalation.json，通知risk-monitoring和相关决策人 |
| 升级路径变更 | 当前活跃升级、后续升级流程 | 更新escalation.json，通知当前升级链中所有接收人 |
| 升级规则变更 | 后续所有升级判断 | 更新escalation.json，通知规则维护者 |
