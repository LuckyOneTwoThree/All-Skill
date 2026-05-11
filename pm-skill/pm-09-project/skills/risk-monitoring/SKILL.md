---
name: risk-monitoring
description: 当需要持续监控项目风险时使用。风险监控与预警自动化，持续追踪风险指标、更新风险状态、识别新风险、触发风险预警、追踪应对效果，输出完整的风险监控报告。关键词：风险监控、风险预警、风险追踪、风险状态、风险指标。
metadata:
  module: "项目管理与执行"
  sub-module: "风险管理"
  type: "pipeline"
  version: "3.0"
  interaction_mode: "ai_auto"
---

# Pipeline 8: 风险监控与预警自动化

## 核心原则

1. **透明度即协作**：风险监控状态和预警信息实时同步给相关方
2. **风险前置**：持续监控风险指标，在风险升级前触发预警
3. **自动化追踪**：风险状态变化、应对效果自动追踪和报告

## 交互模式

**🤖 AI自动执行（持续运行）**

- 监控和预警由AI自动执行
- 每小时执行指标检查
- 预警实时触发和通知
- 人类接收预警通知并决策
- 应对调整需人类批准

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| risk_register | object | 是 | output/pm-project/risk-identification/risk_register.json | 风险登记册 |
| project_data | object | 是 | 项目管理系统 → 项目数据 | 项目实时数据 |
| trigger_conditions | object | 是 | 用户提供 | 配置的触发条件 |
| mitigation_actions | object[] | ○ | output/pm-project/risk-monitoring/应对追踪 | 已执行的应对措施 |

---

## 执行步骤

### Step 1: 风险指标自动追踪

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

### Step 2: 风险状态自动更新

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

### Step 3: 新风险自动识别

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

### Step 4: 风险预警自动触发

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

### Step 5: 应对效果自动追踪

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

## 输出

**存储路径**：`output/pm-project/risk-monitoring/`

**输出文件**：risk_monitoring.json、metadata.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["risk_monitoring", "metadata"],
  "properties": {
    "risk_monitoring": {"type": "object", "description": "风险监控数据，包含追踪风险、预警和应对效果"},
    "metadata": {"type": "object", "description": "元数据，包含监控周期和置信度"}
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
| metadata.monitoring_cycle | string | 是 | 监控周期，ISO 8601格式 |
| metadata.monitoring_duration | string | 是 | 监控持续时间 |
| metadata.risks_monitored | number | 是 | 监控风险数 |
| metadata.alerts_generated | number | 是 | 生成预警数 |
| metadata.confidence | number | 是 | 整体置信度，范围0.0-1.0 |

```json
{
  "risk_monitoring": {
    "tracked_risks": [{
      "id": "RISK-001",
      "status": "active | escalated | improving | resolved",
      "triggered_conditions": ["string"],
      "latest_update": "ISO datetime",
      "indicators": {}
    }],
    "new_risks_identified": number,
    "alerts_triggered": [{
      "id": "string",
      "severity": "string",
      "message": "string"
    }],
    "mitigation_effectiveness": {}
  },
  "metadata": {
    "monitoring_cycle": "ISO datetime",
    "monitoring_duration": "string",
    "risks_monitored": number,
    "alerts_generated": number,
    "confidence": 0.0-1.0
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

---

## 预警通知配置

| 严重度 | 通知方式 | 通知对象 |
|--------|----------|----------|
| Critical | 即时 + 短信 | 项目经理 + 发起人 |
| High | 即时通知 | 项目经理 |
| Medium | 每日汇总 | 团队 |
| Low | 周报记录 | 记录 |

---

## 决策规则

| 条件 | 动作 |
|------|------|
| Critical预警 > 2个/天 | 升级至管理层 |
| 应对措施连续失效 | 触发应对重新设计 |
| 新风险识别频率激增 | 触发系统性风险审查 |
| 预警被忽略 > 48小时 | 自动升级 |

## 质量检查

- [ ] 风险状态更新及时
- [ ] 预警触发条件明确
- [ ] 风险趋势分析覆盖至少3个周期
- [ ] 高风险项有跟进记录

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 风险登记册 | 用户提供风险列表（风险描述+优先级），AI生成监控方案 | 基于用户输入的监控方案，缺少结构化风险数据支撑 |
| 项目数据 | 跳过指标自动采集，用户手动提供关键指标数值 | 基于手动数据的监控报告，缺少实时指标自动采集 |
| 触发条件 | 使用默认预警阈值，标注需人工确认 | 基于默认阈值的预警配置，需人工确认阈值合理性 |
| 应对措施 | 跳过应对效果追踪，仅监控风险状态变化 | 无应对效果追踪的监控，缺少应对效果评估维度 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **风险登记册缺失**：请用户提供风险列表，包含风险描述和优先级，AI将据此生成监控指标定义和预警方案
2. **项目数据缺失**：跳过指标自动采集，请用户定期手动提供关键指标数值，AI将基于手动数据进行趋势分析和预警判断
3. **触发条件缺失**：采用默认预警阈值模板（概率变化>20%触发Warning，>40%触发Critical），输出中标注默认阈值需人工审核

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 风险登记册变更（新增/关闭/优先级调整） | 监控指标定义、预警阈值、追踪范围 | 更新监控指标和预警配置，调整追踪范围 |
| 项目数据变更（进度/质量/资源变化） | 风险指标值、趋势分析、预警触发 | 重新采集指标数据，更新趋势分析和预警判断 |
| 触发条件变更（阈值调整/新增条件） | 预警触发逻辑、预警通知 | 重新应用触发条件，更新预警评估结果 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 风险状态变更（升级/降级/解决） | 风险升级、项目经理、相关方 | 更新risk_monitoring.json，通知risk-escalation和项目经理 |
| 预警触发/解除 | 项目经理、风险负责人 | 更新risk_monitoring.json，按预警通知配置发送通知 |
| 应对效果评估变更 | 风险负责人、项目经理 | 更新risk_monitoring.json，通知风险负责人和项目经理 |
