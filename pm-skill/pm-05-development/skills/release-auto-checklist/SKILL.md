---
name: release-auto-checklist
description: 当需要生成发布检查清单时使用。上线Checklist自动生成与追踪，自动生成T-7/T-1/发布中/T+24h/T+72h的发布Checklist，逐项自动检查和人工确认，支持未完成项告警和状态追踪。🤖 AI自动执行。关键词：发布Checklist、上线检查、发布流程、发布追踪、上线准备、发布清单。
metadata:
  module: "产品开发与上线"
  sub-module: "发布上线"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_auto"
---

# Pipeline 7: 上线Checklist自动生成与追踪

## 核心原则

1. **触发器驱动**：由发布计划创建事件自动触发，定时检查自动执行
2. **自动化验收**：检查项自动执行，未完成项自动告警，状态自动追踪
3. **持续部署**：Checklist与发布流程联动，P0项未完成自动阻断发布
4. **实时复盘**：Checklist完成状态实时汇总，风险项即时暴露

## 交互模式

🤖 **AI自动执行**

触发条件：
- 发布计划创建（T-7开始）
- 定时检查（每小时）
- 手动触发（发布负责人请求）

## 发布阶段定义

| 阶段 | 时间点 | 目的 |
|------|--------|------|
| T-7 | 发布前7天 | 准备检查清单，识别风险 |
| T-1 | 发布前1天 | 最终确认，准备就绪 |
| T-0 | 发布中 | 执行发布，实时监控 |
| T+24h | 发布后24小时 | 稳定性确认 |
| T+72h | 发布后72小时 | 效果评估 |

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 发布内容 | JSON | 是 | 发布管理系统 | 发布版本和变更内容 |
| Checklist模板 | JSON | 是 | 发布策略库 | 各阶段的检查模板 |
| 发布计划 | JSON | 是 | 项目管理 | 发布时间和负责人 |
| 发布历史 | JSON | 是 | 发布历史库 | 用于生成个性化检查项 |

### 发布内容结构示例

```json
{
  "release_id": "release_2024_0125_001",
  "version": "v2.1.0",
  "release_time": "2024-01-25T14:00:00Z",
  "affected_services": ["auth-service", "user-service"],
  "change_type": "feature_release",
  "release_lead": "dev_zhang",
  "developers": ["dev_wang", "dev_li"],
  "testers": ["qa_chen"],
  "on_call": "ops_wu"
}
```

### Checklist模板结构

```json
{
  "templates": {
    "T-7": {
      "template_id": "checklist_T-7",
      "title": "发布前7天 - 准备检查",
      "items": [
        {
          "item_id": "C001",
          "category": "documentation",
          "title": "更新变更日志",
          "description": "确保变更日志包含本次发布的所有变更",
          "type": "manual",
          "owner_role": "developer",
          "priority": "P0"
        }
      ]
    },
    "T-1": {...},
    "T-0": {...},
    "T+24h": {...},
    "T+72h": {...}
  }
}
```

## 执行步骤

### Step 1: Checklist模板生成

#### 1.1 模板加载

**模板来源**：

| 来源 | 说明 |
|------|------|
| 标准模板 | 发布策略库中的通用模板 |
| 项目模板 | 针对特定项目定制的模板 |
| 发布类型模板 | feature_release/hotfix/config_change |
| 历史模板 | 基于历史发布自动生成 |

#### 1.2 个性化调整

**调整规则**：

| 调整维度 | 调整依据 |
|----------|----------|
| 服务范围 | affected_services决定需要检查的服务 |
| 变更类型 | change_type决定特殊的检查项 |
| 发布历史 | 历史上问题决定需要额外关注项 |
| 团队配置 | 负责人决定通知链 |

**个性化输出**：

```json
{
  "personalized_checklist": {
    "generated_from": "standard_template_v2",
    "customizations": [
      {"item_id": "C015", "added": true, "reason": "涉及auth-service需要额外安全检查"},
      {"item_id": "C020", "removed": true, "reason": "本次发布不涉及数据库变更"}
    ],
    "release_specific_items": [
      {
        "item_id": "C_RS_001",
        "title": "微信登录功能专项检查",
        "category": "feature_specific",
        "description": "检查微信登录的端到端流程",
        "priority": "P0"
      }
    ]
  }
}
```

### Step 2: 各阶段Checklist生成

#### 2.1 T-7 Checklist

**生成规则**：

```json
{
  "T-7_checklist": {
    "phase": "T-7",
    "release_date": "2024-01-25",
    "items": [
      {
        "item_id": "T7_C001",
        "category": "documentation",
        "title": "发布变更日志已完成",
        "description": "在CHANGELOG中记录所有功能变更、Bug修复和breaking changes",
        "type": "manual",
        "owner": "dev_wang",
        "priority": "P0",
        "auto_check_config": {
          "enabled": false
        }
      },
      {
        "item_id": "T7_C002",
        "category": "code_quality",
        "title": "代码已通过静态分析",
        "description": "运行SonarQube扫描，确保无Blocker/Critical问题",
        "type": "auto",
        "owner": "ci_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "sonarqube",
          "pass_condition": "no_blocker_or_critical"
        }
      },
      {
        "item_id": "T7_C003",
        "category": "test",
        "title": "所有自动化测试通过",
        "description": "CI流水线所有测试用例已通过",
        "type": "auto",
        "owner": "ci_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "ci_pipeline",
          "pass_condition": "all_tests_passed"
        }
      }
    ]
  }
}
```

#### 2.2 T-1 Checklist

**生成规则**：

```json
{
  "T-1_checklist": {
    "phase": "T-1",
    "items": [
      {
        "item_id": "T1_C001",
        "category": "release_ready",
        "title": "回滚版本已部署并验证",
        "description": "确认回滚版本(v2.0.9)在生产环境正常运行",
        "type": "manual",
        "owner": "ops_wu",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "health_check",
          "check_endpoint": "/health",
          "pass_condition": "status_200"
        }
      },
      {
        "item_id": "T1_C002",
        "category": "communication",
        "title": "发布通知已发送",
        "description": "向所有相关团队发送发布通知，包含发布时间和影响",
        "type": "manual",
        "owner": "dev_zhang",
        "priority": "P1",
        "auto_check_config": {
          "enabled": false
        }
      },
      {
        "item_id": "T1_C003",
        "category": "monitoring",
        "title": "监控仪表盘已就绪",
        "description": "确认发布相关服务的监控仪表盘正常显示",
        "type": "manual",
        "owner": "ops_wu",
        "priority": "P1",
        "auto_check_config": {
          "enabled": true,
          "check_type": "dashboard_access",
          "pass_condition": "accessible"
        }
      }
    ]
  }
}
```

#### 2.3 T-0 Checklist（发布中）

**生成规则**：

```json
{
  "T-0_checklist": {
    "phase": "T-0",
    "items": [
      {
        "item_id": "T0_C001",
        "category": "pre_release",
        "title": "发布窗口正常",
        "description": "当前时间在工作日10:00-16:00发布窗口内",
        "type": "auto",
        "owner": "system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "time_window",
          "pass_condition": "within_window"
        }
      },
      {
        "item_id": "T0_C002",
        "category": "release_execution",
        "title": "构建产物验证通过",
        "description": "验证构建产物的SHA256校验和",
        "type": "auto",
        "owner": "ci_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "artifact_verification",
          "pass_condition": "checksum_match"
        }
      },
      {
        "item_id": "T0_C003",
        "category": "release_execution",
        "title": "Feature Flag已配置",
        "description": "灰度发布Flag已正确配置初始值(1%)",
        "type": "auto",
        "owner": "release_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "feature_flag",
          "pass_condition": "configured"
        }
      },
      {
        "item_id": "T0_C004",
        "category": "post_release",
        "title": "服务健康检查通过",
        "description": "所有受影响的服务健康检查通过",
        "type": "auto",
        "owner": "monitoring_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "service_health",
          "pass_condition": "all_healthy"
        }
      }
    ]
  }
}
```

#### 2.4 T+24h Checklist

**生成规则**：

```json
{
  "T+24h_checklist": {
    "phase": "T+24h",
    "items": [
      {
        "item_id": "T24_C001",
        "category": "stability",
        "title": "核心指标无异常",
        "description": "错误率、响应时间、可用性等P0指标无异常",
        "type": "auto",
        "owner": "monitoring_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "metrics_check",
          "metrics": ["error_rate", "latency_p99", "availability"],
          "pass_condition": "all_normal"
        }
      },
      {
        "item_id": "T24_C002",
        "category": "stability",
        "title": "无P0/P1级别告警",
        "description": "过去24小时内无P0/P1级别告警",
        "type": "auto",
        "owner": "monitoring_system",
        "priority": "P0",
        "auto_check_config": {
          "enabled": true,
          "check_type": "alert_check",
          "pass_condition": "no_p0_p1_alerts"
        }
      },
      {
        "item_id": "T24_C003",
        "category": "user_feedback",
        "title": "用户反馈正常",
        "description": "客服工单和用户反馈无异常增多",
        "type": "manual",
        "owner": "product_manager_zhang",
        "priority": "P1",
        "auto_check_config": {
          "enabled": false
        }
      }
    ]
  }
}
```

#### 2.5 T+72h Checklist

**生成规则**：

```json
{
  "T+72h_checklist": {
    "phase": "T+72h",
    "items": [
      {
        "item_id": "T72_C001",
        "category": "effectiveness",
        "title": "业务指标达成",
        "description": "核心业务指标(转化率、DAU等)达到预期",
        "type": "manual",
        "owner": "product_manager_zhang",
        "priority": "P0",
        "auto_check_config": {
          "enabled": false
        }
      },
      {
        "item_id": "T72_C002",
        "category": "technical",
        "title": "无技术债务增加",
        "description": "代码质量指标无恶化",
        "type": "auto",
        "owner": "ci_system",
        "priority": "P1",
        "auto_check_config": {
          "enabled": true,
          "check_type": "code_quality_trend",
          "pass_condition": "no_degradation"
        }
      }
    ]
  }
}
```

### Step 3: 逐项自动检查

#### 3.1 检查执行

**执行配置**：

```json
{
  "check_execution": {
    "execution_mode": "sequential",
    "parallel_execution": true,
    "timeout_seconds": 60,
    "retry_config": {
      "enabled": true,
      "max_retries": 2,
      "retry_delay_seconds": 10
    }
  }
}
```

**检查结果输出**：

```json
{
  "check_results": [
    {
      "item_id": "T7_C002",
      "check_type": "sonarqube",
      "status": "passed",
      "checked_at": "ISO8601",
      "details": {
        "blocker_issues": 0,
        "critical_issues": 0,
        "major_issues": 5
      },
      "evidence": "sonarqube_scan_2024_0125.json"
    },
    {
      "item_id": "T1_C001",
      "check_type": "health_check",
      "status": "passed",
      "checked_at": "ISO8601",
      "details": {
        "endpoint": "https://api.example.com/health",
        "response_time_ms": 45,
        "status_code": 200
      }
    }
  ]
}
```

### Step 4: 未完成项告警

#### 4.1 告警规则

**告警级别**：

| 级别 | 条件 | 通知方式 |
|------|------|----------|
| 阻断 | P0项未完成且临近发布时间 | 立即通知+阻断发布 |
| 高 | P0项未完成 | 通知负责人 |
| 中 | P1项未完成 | 通知负责人 |
| 低 | P2项未完成 | 汇总通知 |

**告警触发时间**：

| 检查项类型 | 告警触发时间 |
|------------|--------------|
| T-7检查项 | T-3未完成告警 |
| T-1检查项 | T-1 12:00未完成告警 |
| T-0检查项 | 发布前2小时未完成告警 |
| T+24h检查项 | T+24h未完成继续跟踪 |

#### 4.2 告警输出

```json
{
  "pending_alerts": [
    {
      "alert_id": "alert_001",
      "severity": "high",
      "item_id": "T-1_C002",
      "title": "发布通知未发送",
      "owner": "dev_zhang",
      "deadline": "2024-01-24T12:00:00Z",
      "time_remaining": "3小时",
      "notification_channels": ["slack", "email"]
    }
  ]
}
```

### Step 5: 状态追踪

#### 5.1 状态聚合

**状态报告**：

```json
{
  "checklist_status": {
    "phase": "T-1",
    "generated_at": "ISO8601",
    "summary": {
      "total_items": 20,
      "completed": 15,
      "pending": 3,
      "blocked": 2,
      "completion_rate": 0.75
    },
    "by_priority": {
      "P0": {"total": 8, "completed": 7, "pending": 1},
      "P1": {"total": 8, "completed": 6, "pending": 2},
      "P2": {"total": 4, "completed": 2, "pending": 2}
    },
    "by_category": {
      "documentation": {"completed": 2, "pending": 0},
      "test": {"completed": 3, "pending": 1},
      "release_ready": {"completed": 4, "pending": 1}
    }
  }
}
```

#### 5.2 进度可视化

**可视化数据**：

```json
{
  "progress_visualization": {
    "timeline": [
      {"phase": "T-7", "completion_rate": 1.0, "status": "completed"},
      {"phase": "T-1", "completion_rate": 0.75, "status": "in_progress"},
      {"phase": "T-0", "completion_rate": 0.0, "status": "pending"},
      {"phase": "T+24h", "completion_rate": 0.0, "status": "pending"},
      {"phase": "T+72h", "completion_rate": 0.0, "status": "pending"}
    ],
    "risk_indicators": [
      {"indicator": "P0阻塞项", "count": 1, "severity": "high"}
    ]
  }
}
```

## 输出

**存储路径**：`output/pm-development/release-auto-checklist/`

**输出文件**：`release_checklist.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["output_id", "release_id", "checklist", "completion_status"],
  "properties": {
    "output_id": {"type": "string", "description": "输出唯一标识"},
    "release_id": {"type": "string", "description": "发布ID"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "checklist": {"type": "object", "description": "各阶段完整Checklist，包含T-7/T-1/T-0/T+24h/T+72h"},
    "completion_status": {"type": "object", "description": "完成状态汇总，包含当前阶段和完成率"},
    "pending_alerts": {"type": "array", "description": "待处理告警列表"},
    "risk_assessment": {"type": "object", "description": "风险评估，包含风险等级和阻断项"}
  }
}
```

### 最终输出结构

```json
{
  "output_id": "checklist_report_xxx",
  "release_id": "release_2024_0125_001",
  "generated_at": "ISO8601",
  "checklist": {
    "T-7": {...},
    "T-1": {...},
    "T-0": {...},
    "T+24h": {...},
    "T+72h": {...}
  },
  "completion_status": {
    "current_phase": "T-1",
    "overall_completion_rate": 0.75,
    "p0_completion_rate": 0.875
  },
  "pending_alerts": [...],
  "risk_assessment": {
    "risk_level": "medium",
    "blocking_items": [
      {
        "item_id": "T-1_C002",
        "title": "发布通知未发送",
        "owner": "dev_zhang"
      }
    ]
  }
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| checklist | JSON | 各阶段完整Checklist |
| completion_status | JSON | 完成状态汇总 |
| pending_alerts | JSON | 待处理告警 |
| risk_assessment | JSON | 风险评估 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| release_checklist | object | 是 | 发布检查清单根对象 |
| release_checklist.version | string | 是 | 发布版本号 |
| release_checklist.items | array | 是 | 检查项列表 |
| release_checklist.items[].id | string | 是 | 检查项编号 |
| release_checklist.items[].category | string | 是 | 检查类别，枚举值：code_quality/testing/security/compliance/infrastructure/monitoring |
| release_checklist.items[].description | string | 是 | 检查描述 |
| release_checklist.items[].status | string | 是 | 状态，枚举值：pass/fail/pending/waived |
| release_checklist.items[].severity | string | 是 | 严重级别，枚举值：blocker/warning/info |
| release_checklist.items[].evidence | string | 否 | 证据链接 |
| release_checklist.items[].assignee | string | 否 | 负责人 |
| release_checklist.gate_result | string | 是 | 门禁结果，枚举值：go/no_go/conditional |
| release_checklist.blockers | array | 是 | 阻断项列表 |
| release_checklist.risk_summary | object | 是 | 风险摘要 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 验收报告变更 | 检查项状态 | 更新验收相关检查项状态，重新评估门禁结果 |
| 测试报告变更 | 测试类检查项 | 更新测试相关检查项状态，标记需人类确认 |
| 安全评估变更 | 安全类检查项 | 更新安全相关检查项状态，重新评估阻断项 |
| 灰度策略变更 | 基础设施类检查项 | 更新基础设施检查项，标记需人类确认 |

当检查清单自身变更时，对下游的通知机制：

| 清单变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 门禁结果变更 | release-gradual | 标记门禁变更，触发灰度发布决策 |
| 阻断项新增 | development-task-breakdown | 标记阻断项，触发修复任务创建 |
| 检查项状态变更 | release-notes | 标记状态变更，触发发布说明更新 |

---

## 决策规则

### 发布阻断规则

| 条件 | 决策 |
|------|------|
| T-0时存在P0阻塞项 | **立即阻断发布** |
| T-0时存在P0未完成项 | **延迟发布** |
| T+24h时P0指标未达标 | **触发复盘** |

### 通过条件

| 条件 | 要求 |
|------|------|
| P0项完成率 | 100% |
| P1项完成率 | ≥ 80% |
| 发布前告警已处理 | 100% |

## 质量检查

### Quality Gates

| 检查项 | 标准 | 未达标处理 |
|--------|------|------------|
| P0项完成率 | 100% | 阻断发布 |
| 告警处理率 | 100% | 延迟发布 |
| 人工确认完整性 | 所有manual项已确认 | 告警 |

### 质量检查清单

- [ ] 所有P0检查项已完成
- [ ] 所有告警已处理
- [ ] 负责人已确认
- [ ] 文档已更新
- [ ] 沟通已通知

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 发布内容缺失 | 用户提供发布范围 → 生成标准Checklist | Checklist无个性化调整，使用通用模板 |
| 监控配置缺失 | 跳过监控相关自动检查项，标记为"需人工确认" | T+24h/T+72h监控检查项需人工执行 |
| 发布内容 + 监控配置均缺失 | 用户提供发布范围 → 生成标准Checklist | 输出标准Checklist模板，自动检查项标注"待配置" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **发布范围**：本次发布涉及的服务、模块和变更类型
- **发布时间**（可选）：计划发布的时间窗口
- **负责人信息**（可选）：各角色的负责人名单

## 执行日志

```json
{
  "execution_id": "exec_p7_xxx",
  "pipeline": "release-auto-checklist",
  "release_id": "release_2024_0125_001",
  "trigger": "scheduled",
  "execution_type": "full_check",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "phases_processed": ["T-7", "T-1"],
  "items_checked": 25,
  "items_passed": 23,
  "items_failed": 0,
  "pending_items": 2,
  "alerts_generated": 2
}
```
