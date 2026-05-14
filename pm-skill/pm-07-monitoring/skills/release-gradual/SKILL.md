---
name: release-gradual
description: 当需要执行灰度发布时使用。灰度发布自动执行，执行渐进式灰度发布，从1%到10%到50%到100%，各阶段自动监控指标并判断是否进入下一阶段，支持P0指标恶化时自动回滚。🤖 AI自动执行。关键词：灰度发布、渐进式发布、Feature Flag、自动回滚、发布策略、金丝雀发布、小流量、逐步放量。
metadata:
  module: "产品监控与迭代"
  sub-module: "发布上线"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "做灰度发布，先放1%流量"
    - "帮我做小流量验证"
    - "逐步放量到全量"
  interaction_mode: "ai_auto"
---

# 灰度发布自动执行

## 核心原则

1. **触发器驱动**：由质量门禁通过事件自动触发灰度发布，指标恶化自动触发回滚
2. **自动化验收**：各阶段指标自动监控，阶段转换自动判定，回滚自动执行
3. **持续部署**：灰度策略配合Feature Flag，实现渐进式部署和即时回滚
4. **实时复盘**：各阶段指标实时汇总，发布完成后即时生成复盘输入

## 交互模式

🤖 **AI自动执行**

触发条件：
- 质量门禁通过
- 手动触发（发布负责人确认）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 发布内容 | JSON | 是 | 发布管理系统 | 待发布的版本和变更内容 |
| Feature Flag配置 | JSON | 是 | Feature Flag系统 | 灰度开关配置 |
| 监控指标定义 | JSON | 是 | 监控系统 | 各阶段监控指标 |
| 灰度策略配置 | JSON | 是 | 发布策略库 | 各阶段流量比例和持续时间 |

### 发布内容结构示例

```json
{
  "release_id": "release_2024_0125_001",
  "version": "v2.1.0",
  "build_ref": "abc123def",
  "change_summary": "新增微信登录功能，优化登录流程",
  "affected_services": ["auth-service", "user-service"],
  "rollback_version": "v2.0.9",
  "rollback_strategy": "feature_flag_offline"
}
```

## 灰度阶段配置

### 标准灰度阶段

| 阶段 | 流量比例 | 持续时间 | 最小持续时间 | 通过条件 |
|------|----------|----------|--------------|----------|
| Stage 0 | 0% (验证) | - | 10分钟 | 构建验证通过 |
| Stage 1 | 1% | 30分钟 | 30分钟 | 核心指标无异常 |
| Stage 2 | 10% | 2小时 | 1小时 | P0指标稳定 |
| Stage 3 | 50% | 4小时 | 2小时 | 无新增异常 |
| Stage 4 | 100% | - | - | 所有条件通过 |

### 护栏指标配置

```json
{
  "guardrail_metrics": {
    "p0_metrics": [
      {
        "name": "error_rate",
        "description": "5xx错误率",
        "unit": "percentage",
        "warning_threshold": 0.01,
        "rollback_threshold": 0.03,
        "comparison": "vs_baseline"
      },
      {
        "name": "latency_p99",
        "description": "P99响应时间",
        "unit": "milliseconds",
        "warning_threshold": 500,
        "rollback_threshold": 1000,
        "comparison": "vs_baseline"
      },
      {
        "name": "availability",
        "description": "服务可用性",
        "unit": "percentage",
        "warning_threshold": 99.9,
        "rollback_threshold": 99.0,
        "comparison": "absolute"
      }
    ],
    "p1_metrics": [
      {
        "name": "api_success_rate",
        "description": "API成功率",
        "unit": "percentage",
        "warning_threshold": 99,
        "rollback_threshold": 97
      },
      {
        "name": "error_count",
        "description": "错误次数",
        "unit": "count",
        "warning_threshold": 100,
        "rollback_threshold": 500
      }
    ],
    "p2_metrics": [
      {
        "name": "conversion_rate",
        "description": "业务转化率",
        "unit": "percentage",
        "warning_threshold": -10,
        "rollback_threshold": -30,
        "comparison": "vs_previous_phase"
      }
    ]
  }
}
```

## 执行步骤

### Step 1: 灰度计划生成

#### 1.1 发布前验证

**验证清单**：

| 验证项 | 检查内容 | 失败处理 |
|--------|----------|----------|
| 构建产物 | 验证构建产物完整性 | 阻止发布 |
| 回滚版本 | 确认回滚版本可用 | 阻止发布 |
| Feature Flag | 验证Flag配置正确 | 阻止发布 |
| 监控告警 | 验证告警规则已配置 | 阻止发布 |
| 值班人员 | 确认值班人员在线 | 警告 |

**验证输出**：

```json
{
  "pre_release_verification": {
    "build_artifact": {"verified": true, "sha256": "abc123..."},
    "rollback_version": {"available": true, "version": "v2.0.9"},
    "feature_flag": {"configured": true, "flag_key": "feature_wechat_login"},
    "monitoring": {"alerts_configured": true, "channel": "pagerduty"},
    "on_call": {"confirmed": true, "engineer": "dev_zhang"},
    "ready_to_release": true
  }
}
```

#### 1.2 灰度计划生成

**计划结构**：

```json
{
  "canary_plan": {
    "plan_id": "canary_2024_0125_001",
    "release_id": "release_2024_0125_001",
    "phases": [
      {
        "phase_id": "phase_1",
        "traffic_percentage": 1,
        "duration_minutes": 30,
        "min_duration_minutes": 30,
        "target_users": {
          "strategy": "random",
          "percentage": 1
        },
        "success_criteria": {
          "p0_metrics": "all_normal",
          "p1_metrics": "all_normal",
          "manual_approval": false
        }
      },
      {
        "phase_id": "phase_2",
        "traffic_percentage": 10,
        "duration_minutes": 120,
        "min_duration_minutes": 60,
        "target_users": {
          "strategy": "random",
          "percentage": 10
        },
        "success_criteria": {
          "p0_metrics": "stable",
          "p1_metrics": "all_normal",
          "manual_approval": true
        }
      },
      {
        "phase_id": "phase_3",
        "traffic_percentage": 50,
        "duration_minutes": 240,
        "min_duration_minutes": 120,
        "target_users": {
          "strategy": "random",
          "percentage": 50
        },
        "success_criteria": {
          "p0_metrics": "stable",
          "p1_metrics": "stable",
          "manual_approval": true
        }
      },
      {
        "phase_id": "phase_4",
        "traffic_percentage": 100,
        "duration_minutes": null,
        "target_users": {
          "strategy": "all"
        },
        "success_criteria": {
          "p0_metrics": "all_normal",
          "p1_metrics": "all_normal",
          "manual_approval": true
        }
      }
    ]
  }
}
```

### Step 2: Feature Flag自动配置

#### 2.1 Flag配置生成

**配置规则**：

```json
{
  "feature_flag_config": {
    "flag_key": "feature_wechat_login",
    "flag_type": "boolean",
    "default_value": false,
    "serving_config": {
      "phase_1": {
        "percentage": 1,
        "rules": [
          {
            "name": "random_1_percent",
            "percentage": 1,
            "variation": true
          }
        ]
      },
      "phase_2": {
        "percentage": 10,
        "rules": [
          {
            "name": "random_10_percent",
            "percentage": 10,
            "variation": true
          }
        ]
      },
      "phase_3": {
        "percentage": 50,
        "rules": [
          {
            "name": "random_50_percent",
            "percentage": 50,
            "variation": true
          }
        ]
      },
      "phase_4": {
        "percentage": 100,
        "rules": [
          {
            "name": "all_users",
            "percentage": 100,
            "variation": true
          }
        ]
      }
    }
  }
}
```

#### 2.2 Flag状态追踪

**状态记录**：

```json
{
  "flag_status_tracking": {
    "flag_key": "feature_wechat_login",
    "current_phase": "phase_2",
    "current_traffic_percentage": 10,
    "last_updated": "ISO8601",
    "updated_by": "release-gradual-pipeline",
    "history": [
      {"timestamp": "ISO8601", "phase": "phase_1", "percentage": 1, "action": "enabled"},
      {"timestamp": "ISO8601", "phase": "phase_2", "percentage": 10, "action": "increased"},
      {"timestamp": "ISO8601", "phase": "phase_2", "percentage": 0, "action": "rollback"}
    ]
  }
}
```

### Step 3: 各阶段自动监控

#### 3.1 指标采集

**采集配置**：

```json
{
  "metrics_collection": {
    "interval_seconds": 30,
    "metrics": [
      {"name": "error_rate", "source": "prometheus", "query": "rate(http_requests_total{status=~'5..'}[5m])"},
      {"name": "latency_p99", "source": "prometheus", "query": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))"},
      {"name": "availability", "source": "synthetic_monitoring", "frequency": "1m"}
    ]
  }
}
```

#### 3.2 阶段状态评估

**评估规则**：

| 指标类型 | 评估条件 | 评估结果 |
|----------|----------|----------|
| P0全部正常 | 无指标超warning阈值 | **可进入下一阶段** |
| P0任一告警 | 任一指标超warning但未超rollback | **继续观察** |
| P0恶化 | 任一指标超rollback阈值 | **立即回滚** |
| P1告警 | P1指标超阈值 | **延迟+告警** |

**阶段评估输出**：

```json
{
  "phase_assessment": {
    "phase_id": "phase_2",
    "assessed_at": "ISO8601",
    "duration_minutes": 90,
    "metrics_summary": {
      "p0_metrics": {
        "error_rate": {"current": 0.002, "baseline": 0.001, "status": "normal"},
        "latency_p99": {"current": 150, "baseline": 140, "status": "normal"},
        "availability": {"current": 99.99, "baseline": 99.99, "status": "normal"}
      },
      "p1_metrics": {
        "api_success_rate": {"current": 99.5, "baseline": 99.8, "status": "normal"}
      },
      "p2_metrics": {
        "conversion_rate": {"current": -2, "baseline": 0, "status": "normal"}
      }
    },
    "overall_status": "healthy",
    "recommendation": "can_proceed",
    "confidence": 0.95
  }
}
```

#### 3.3 阶段转换决策

**决策流程**：

```
┌─────────────────┐
│ 阶段时间已满？  │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   是        否
    │         │
    ▼         ▼
┌────────┐ ┌─────────────────┐
│指标评估│ │继续监控         │
└───┬────┘ └─────────────────┘
    │
    ▼
┌─────────────────┐
│ 所有P0指标正常？│
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   是        否
    │         │
    ▼         ▼
┌────────┐ ┌─────────────────┐
│进入下一 │ │ 告警/观察/回滚  │
│阶段     │ └─────────────────┘
└────────┘
```

**转换输出**：

```json
{
  "phase_transition_decision": {
    "current_phase": "phase_2",
    "decision": "proceed_to_next_phase",
    "next_phase": "phase_3",
    "reason": "阶段持续时间已满，所有P0指标正常",
    "metrics_verified": true,
    "approved_by": "release-gradual-pipeline",
    "scheduled_at": "ISO8601"
  }
}
```

### Step 4: 自动回滚触发

#### 4.1 回滚触发条件

**触发规则**：

| 条件 | 触发动作 | 延迟 |
|------|----------|------|
| P0指标超rollback阈值 | **立即自动回滚** | 0秒 |
| 服务不可用 | **立即自动回滚** | 0秒 |
| P1指标超rollback阈值 | 延迟观察 | 5分钟 |
| 人工确认异常 | 手动触发 | 0秒 |

#### 4.2 回滚执行

**回滚流程**：

```
触发回滚
    │
    ▼
┌─────────────────┐
│ 通知相关人员    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   自动化    人工
    │         │
    ▼         ▼
┌─────────┐ ┌─────────────────┐
│关闭Flag │ │确认并执行      │
│切换流量 │ └─────────────────┘
└────┬────┘
     │
     ▼
┌─────────────────┐
│ 验证回滚结果    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
   成功      失败
    │         │
    ▼         ▼
┌─────────┐ ┌─────────────────┐
│记录完成 │ │告警升级人工介入 │
└─────────┘ └─────────────────┘
```

**回滚执行输出**：

```json
{
  "rollback_execution": {
    "rollback_id": "rollback_2024_0125_002",
    "trigger": {
      "reason": "P0指标恶化",
      "metric": "error_rate",
      "current_value": 0.035,
      "threshold": 0.03
    },
    "action": {
      "step_1": "关闭Feature Flag",
      "step_2": "等待流量完全切换",
      "step_3": "验证旧版本健康"
    },
    "status": "completed",
    "completed_at": "ISO8601",
    "duration_seconds": 45,
    "verification": {
      "traffic_restored": true,
      "old_version_healthy": true,
      "error_rate_recovered": true
    }
  }
}
```

#### 4.3 回滚后处理

**处理清单**：

```json
{
  "post_rollback_actions": [
    {
      "action": "通知发布团队",
      "type": "notification",
      "recipients": ["release_lead", "dev_lead", "product_manager"]
    },
    {
      "action": "记录回滚事件",
      "type": "documentation",
      "content": "回滚原因、持续时间、影响范围"
    },
    {
      "action": "创建事件跟进Ticket",
      "type": "ticket",
      "template": "post_incident_review"
    },
    {
      "action": "分析根因",
      "type": "analysis",
      "deadline": "24小时内"
    }
  ]
}
```

## 输出

**存储路径**：`output/pm-monitoring/release-gradual/`

**输出文件**：`release_status.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["output_id", "release_id", "release_status"],
  "properties": {
    "output_id": {"type": "string", "description": "输出唯一标识"},
    "release_id": {"type": "string", "description": "发布ID"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "release_status": {"type": "object", "description": "当前发布状态，包含阶段、流量比例和进度"},
    "phase_transitions": {"type": "array", "description": "阶段转换历史记录"},
    "rollback_history": {"type": "array", "description": "回滚历史记录"},
    "monitoring_metrics": {"type": "object", "description": "监控数据汇总，包含当前和历史指标"},
    "canary_plan": {"type": "object", "description": "灰度发布计划"}
  }
}
```

### 最终输出结构

```json
{
  "output_id": "release_status_xxx",
  "release_id": "release_2024_0125_001",
  "generated_at": "ISO8601",
  "release_status": {
    "current_phase": "phase_3",
    "traffic_percentage": 50,
    "start_time": "ISO8601",
    "elapsed_minutes": 180,
    "status": "in_progress"
  },
  "phase_transitions": [
    {
      "phase_id": "phase_1",
      "traffic_percentage": 1,
      "started_at": "ISO8601",
      "completed_at": "ISO8601",
      "duration_minutes": 32,
      "outcome": "promoted",
      "metrics_at_completion": {...}
    },
    {
      "phase_id": "phase_2",
      "traffic_percentage": 10,
      "started_at": "ISO8601",
      "completed_at": "ISO8601",
      "duration_minutes": 125,
      "outcome": "promoted",
      "metrics_at_completion": {...}
    }
  ],
  "rollback_history": [],
  "monitoring_metrics": {
    "current": {...},
    "historical": [...]
  },
  "canary_plan": {...}
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| release_status | JSON | 当前发布状态 |
| phase_transitions | JSON | 阶段转换历史 |
| rollback_history | JSON | 回滚历史 |
| monitoring_metrics | JSON | 监控数据汇总 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| gradual_release | object | 是 | 灰度发布根对象 |
| gradual_release.strategy | object | 是 | 灰度策略 |
| gradual_release.strategy.type | string | 是 | 策略类型，枚举值：canary/blue_green/rolling/feature_flag |
| gradual_release.strategy.stages | array | 是 | 灰度阶段列表，至少2个 |
| gradual_release.strategy.stages[].name | string | 是 | 阶段名称 |
| gradual_release.strategy.stages[].traffic_percentage | number | 是 | 流量百分比，0-100 |
| gradual_release.strategy.stages[].duration | string | 是 | 持续时间 |
| gradual_release.strategy.stages[].success_criteria | object | 是 | 成功标准 |
| gradual_release.strategy.stages[].rollback_criteria | object | 是 | 回滚标准 |
| gradual_release.monitoring | object | 是 | 监控配置 |
| gradual_release.monitoring.metrics | array | 是 | 监控指标列表 |
| gradual_release.monitoring.alert_rules | array | 是 | 告警规则列表 |
| gradual_release.rollback_plan | object | 是 | 回滚计划 |
| gradual_release.rollback_plan.trigger_conditions | array | 是 | 触发条件 |
| gradual_release.rollback_plan.steps | array | 是 | 回滚步骤 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 发布检查清单变更 | 灰度策略和门禁 | 重新评估灰度门禁条件，标记需人类确认 |
| 验收报告变更 | 灰度启动条件 | 更新灰度启动条件，重新评估是否可以开始灰度 |
| 监控指标变更 | 监控配置和告警规则 | 更新监控指标和告警阈值，标记需人类确认 |
| PRD需求变更 | 灰度范围和功能验证 | 重新评估灰度范围，标记需人类确认 |

当灰度发布自身变更时，对下游的通知机制：

| 灰度变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 灰度阶段推进 | release-notes | 标记阶段推进，触发发布说明更新 |
| 灰度回滚 | 全部下游 | 标记回滚事件，触发问题排查和修复 |
| 灰度完成 | release-notes | 标记灰度完成，触发全量发布决策 |

---

## 决策规则

### 自动回滚规则

| 触发条件 | 执行动作 | 优先级 |
|----------|----------|--------|
| P0指标超rollback阈值 | 立即自动回滚 | 最高 |
| 服务完全不可用 | 立即自动回滚 | 最高 |
| P1指标超rollback阈值 | 5分钟延迟后回滚 | 高 |
| P2指标超rollback阈值 | 告警，等待人工确认 | 中 |

### 阶段通过规则

| 条件 | 决策 |
|------|------|
| P0指标全部正常 | 可进入下一阶段 |
| 阶段持续时间已满 | 评估是否进入下一阶段 |
| 存在P0告警（未超阈值） | 延长观察时间 |
| 存在P1告警 | 警告，进入下一阶段 |

## 质量检查

### Quality Gates

| 检查项 | 标准 | 未达标处理 |
|--------|------|------------|
| 发布前验证 | 所有验证项通过 | 阻止发布 |
| P0指标稳定 | 指标无恶化趋势 | 停止灰度 |
| 回滚机制就绪 | Feature Flag可用 | 阻止发布 |
| 告警配置正确 | 所有指标已配置告警 | 阻止发布 |

### 质量检查清单

- [ ] 发布前验证全部通过
- [ ] Feature Flag配置正确
- [ ] 监控告警已配置
- [ ] 回滚机制就绪
- [ ] 值班人员已确认
- [ ] 阶段转换记录完整

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 发布内容缺失 | 用户提供发布功能列表 → 生成灰度计划模板 | 发布内容细节需人工补充 |
| Feature Flag配置缺失 | 生成灰度计划但不包含Flag自动配置步骤 | 需人工配置Feature Flag |
| 监控指标缺失 | 使用默认P0/P1/P2指标模板，标注"待确认" | 告警阈值基于通用模板 |
| 发布内容 + Feature Flag + 监控指标均缺失 | 用户提供发布功能列表 → 生成灰度计划模板 | 输出灰度计划模板，各配置项标注"待确认" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **发布功能列表**：本次发布包含的功能和变更
- **回滚版本**（可选）：可回滚的上一版本号
- **关键监控指标**（可选）：需要重点关注的业务和技术指标

## 执行日志

```json
{
  "execution_id": "exec_p6_xxx",
  "pipeline": "release-gradual",
  "release_id": "release_2024_0125_001",
  "trigger": "quality_gate_passed",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "phases": [
    {"phase_id": "phase_1", "status": "completed", "duration_minutes": 32, "outcome": "promoted"},
    {"phase_id": "phase_2", "status": "completed", "duration_minutes": 125, "outcome": "promoted"},
    {"phase_id": "phase_3", "status": "in_progress", "duration_minutes": 45}
  ],
  "rollbacks": [],
  "final_status": {
    "outcome": "in_progress",
    "current_traffic": 50,
    "metrics_healthy": true
  }
}
```