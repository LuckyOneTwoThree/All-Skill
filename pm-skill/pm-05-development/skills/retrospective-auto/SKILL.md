---
name: retrospective-auto
description: 当需要进行上线效果复盘时使用。上线复盘自动化，执行T+2周效果复盘、工程质量复盘、发布过程复盘，自动生成改进行动项。包含目标vs实际对比、Bug统计、技术债务分析等。🤖 AI自动执行。关键词：上线复盘、发布复盘、效果评估、行动项、持续改进、效果复盘。
metadata:
  module: "产品开发与上线"
  sub-module: "复盘改进"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_auto"
---

# Pipeline 8: 上线复盘自动化

## 核心原则

1. **触发器驱动**：由发布完成事件自动触发复盘计划，T+2周自动触发效果复盘
2. **自动化验收**：多源数据自动收集，目标vs实际自动对比，行动项自动生成
3. **持续部署**：复盘行动项直接反馈到开发协作流程，形成持续改进闭环
4. **实时复盘**：发布后快速复盘即时启动，效果复盘T+2周自动触发

## 交互模式

🤖 **AI自动执行**

触发条件：
- 发布完成事件（T+2周自动触发）
- 手动触发（复盘负责人请求）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 发布内容 | JSON | 是 | 发布管理系统 | 发布版本和变更内容 |
| 监控数据 | JSON | 是 | 监控系统 | 业务指标和性能指标 |
| 用户反馈 | JSON | 是 | 客服系统/反馈平台 | 用户满意度和反馈 |
| 团队反馈 | JSON | 是 | 团队调查 | 团队协作反馈 |
| Bug统计 | JSON | 是 | Bug跟踪系统 | 发布相关Bug统计 |
| 发布过程数据 | JSON | 是 | 发布日志 | 发布流程数据 |

### 发布目标定义示例

```json
{
  "release_id": "release_2024_0125_001",
  "version": "v2.1.0",
  "release_date": "2024-01-25",
  "release_goals": {
    "business": {
      "login_conversion_rate": {
        "baseline": 0.65,
        "target": 0.70,
        "description": "登录转化率提升5%"
      },
      "wechat_login_usage": {
        "baseline": 0,
        "target": 0.30,
        "description": "30%用户使用微信登录"
      }
    },
    "technical": {
      "login_latency_p99": {
        "baseline": 200,
        "target": 250,
        "description": "P99延迟不超过250ms"
      },
      "test_coverage": {
        "baseline": 0.75,
        "target": 0.80,
        "description": "自动化测试覆盖率80%"
      }
    },
    "quality": {
      "p0_defects": {
        "target": 0,
        "description": "发布后无P0缺陷"
      },
      "bug_leakage_rate": {
        "baseline": 0.15,
        "target": 0.10,
        "description": "Bug泄漏率降低"
      }
    }
  }
}
```

## 执行步骤

### Step 1: 效果复盘（T+2周）

#### 1.1 数据收集与汇总

**数据源汇总**：

```json
{
  "effectiveness_data": {
    "period": {
      "start": "2024-01-25",
      "end": "2024-02-08"
    },
    "metrics": {
      "login_conversion_rate": {
        "value": 0.68,
        "trend": [0.65, 0.66, 0.67, 0.68],
        "data_source": "analytics_platform"
      },
      "wechat_login_usage": {
        "value": 0.25,
        "trend": [0, 0.10, 0.18, 0.25],
        "data_source": "analytics_platform"
      },
      "user_satisfaction": {
        "value": 4.2,
        "baseline": 4.0,
        "data_source": "app_store_rating"
      }
    },
    "data_quality": {
      "completeness": 0.98,
      "accuracy": "verified",
      "gaps": []
    }
  }
}
```

#### 1.2 目标vs实际对比

**对比分析**：

| 指标 | 目标值 | 实际值 | 达成率 | 状态 |
|------|--------|--------|--------|------|
| 登录转化率 | 70% | 68% | 97% | ⚠️ 未达成 |
| 微信登录使用率 | 30% | 25% | 83% | ❌ 未达成 |
| P99延迟 | ≤250ms | 180ms | ✅ 超额达成 | ✅ 超额达成 |
| 测试覆盖率 | 80% | 82% | ✅ 超额达成 | ✅ 超额达成 |

**对比输出**：

```json
{
  "goal_vs_actual": [
    {
      "metric": "login_conversion_rate",
      "target": 0.70,
      "actual": 0.68,
      "achievement_rate": 0.97,
      "status": "partially_achieved",
      "gap": -0.02,
      "significance": "medium"
    },
    {
      "metric": "wechat_login_usage",
      "target": 0.30,
      "actual": 0.25,
      "achievement_rate": 0.83,
      "status": "not_achieved",
      "gap": -0.05,
      "significance": "high"
    }
  ]
}
```

#### 1.3 归因分析

**分析维度**：

| 维度 | 分析内容 |
|------|----------|
| 功能价值 | 功能是否真正解决用户问题 |
| 用户体验 | 功能使用是否顺畅 |
| 推广策略 | 功能是否被用户发现 |
| 外部因素 | 市场环境变化影响 |

**归因输出**：

```json
{
  "attribution_analysis": [
    {
      "metric": "wechat_login_usage",
      "actual_vs_target_gap": 0.05,
      "attributions": [
        {
          "factor": "用户认知不足",
          "impact": 0.02,
          "confidence": 0.80,
          "evidence": "客服反馈30%用户在询问如何使用微信登录"
        },
        {
          "factor": "入口位置不明显",
          "impact": 0.02,
          "confidence": 0.75,
          "evidence": "用户测试显示60%用户未注意到微信登录入口"
        },
        {
          "factor": "微信绑定流程繁琐",
          "impact": 0.01,
          "confidence": 0.70,
          "evidence": "A/B测试显示简化流程后转化率提升15%"
        }
      ],
      "primary_cause": "用户认知不足"
    }
  ]
}
```

### Step 2: 工程质量复盘

#### 2.1 Bug统计分析

**Bug统计汇总**：

```json
{
  "bug_statistics": {
    "total_bugs": 23,
    "by_severity": {
      "P0": 0,
      "P1": 2,
      "P2": 8,
      "P3": 13
    },
    "by_source": {
      "testing_discovered": 15,
      "production_reported": 8,
      "leakage_rate": 0.35
    },
    "by_category": {
      "functional": 10,
      "ui_ux": 5,
      "performance": 3,
      "security": 2,
      "other": 3
    },
    "by_module": {
      "auth_service": 8,
      "user_service": 6,
      "payment_service": 5,
      "other": 4
    }
  }
}
```

#### 2.2 Bug趋势分析

**趋势指标**：

| 指标 | 本次发布 | 上次发布 | 变化 | 评估 |
|------|----------|----------|------|------|
| Bug总数 | 23 | 18 | +5 | ⚠️ 恶化 |
| P0/P1数量 | 2 | 1 | +1 | ⚠️ 轻微恶化 |
| 泄漏率 | 35% | 28% | +7% | ❌ 恶化 |
| 平均修复时间 | 2.5天 | 2天 | +0.5天 | ⚠️ 轻微恶化 |

**趋势输出**：

```json
{
  "bug_trend_analysis": {
    "trend_comparison": {
      "total_bugs": {"current": 23, "previous": 18, "change_pct": 27.8, "trend": "worsening"},
      "leakage_rate": {"current": 0.35, "previous": 0.28, "change_pct": 25.0, "trend": "worsening"},
      "avg_fix_time_days": {"current": 2.5, "previous": 2.0, "change_pct": 25.0, "trend": "worsening"}
    },
    "root_cause_patterns": [
      {
        "pattern": "跨模块集成测试不足",
        "evidence": "8个Bug中的5个涉及模块间交互",
        "confidence": 0.85
      },
      {
        "pattern": "异常场景测试覆盖不足",
        "evidence": "3个P2 Bug为边界条件遗漏",
        "confidence": 0.80
      }
    ]
  }
}
```

#### 2.3 技术债务分析

**技术债务评估**：

```json
{
  "technical_debt_analysis": {
    "code_quality": {
      "maintainability_index": 72,
      "baseline": 75,
      "status": "slight_degradation"
    },
    "debt_items": [
      {
        "item": "登录模块重复代码",
        "severity": "medium",
        "estimated_debt_hours": 8,
        "introduced_in": "v2.1.0"
      },
      {
        "item": "验证码校验逻辑分散",
        "severity": "low",
        "estimated_debt_hours": 4,
        "introduced_in": "v2.0.0"
      }
    ],
    "total_estimated_debt_hours": 12
  }
}
```

### Step 3: 发布过程复盘

#### 3.1 问题发现时机分析

**分析维度**：

```json
{
  "issue_discovery_timing": {
    "discovery_stages": [
      {
        "stage": "开发阶段",
        "issues_found": 12,
        "pct": 52,
        "cost_multiplier": 1
      },
      {
        "stage": "测试阶段",
        "issues_found": 8,
        "pct": 35,
        "cost_multiplier": 5
      },
      {
        "stage": "生产环境",
        "issues_found": 3,
        "pct": 13,
        "cost_multiplier": 20
      }
    ],
    "assessment": {
      "ideal_production_share": "<5%",
      "actual_production_share": "13%",
      "status": "needs_improvement"
    }
  }
}
```

#### 3.2 响应速度分析

**响应指标**：

```json
{
  "response_speed_analysis": {
    "incident_response": {
      "avg_detection_time_minutes": 5,
      "avg_response_time_minutes": 15,
      "avg_resolution_time_minutes": 45,
      "benchmark": "行业标准: 检测<10min, 响应<30min"
    },
    "change_review": {
      "avg_review_time_hours": 4,
      "fastest_review_hours": 1,
      "slowest_review_hours": 24
    },
    "assessment": "good"
  }
}
```

#### 3.3 协作效率分析

**协作指标**：

```json
{
  "collaboration_efficiency": {
    "team_feedback_summary": {
      "survey_response_rate": 0.85,
      "overall_satisfaction": 4.1,
      "key_positives": [
        "跨团队沟通顺畅",
        "需求澄清及时"
      ],
      "key_improvements": [
        "测试环境不稳定影响效率",
        "代码评审等待时间过长"
      ]
    },
    "bottlenecks_identified": [
      {
        "bottleneck": "测试环境频繁故障",
        "frequency": "每周2-3次",
        "impact": "每次耽误1-2小时",
        "owner": "ops_team"
      }
    ]
  }
}
```

### Step 4: 行动项自动生成

#### 4.1 行动项生成规则

**生成逻辑**：

```json
{
  "action_item_generation_rules": [
    {
      "trigger": "目标未达成",
      "condition": "achievement_rate < 0.9",
      "template": {
        "title": "提升{metric}达成率",
        "description": "当前{metric}达成率为{rate}，需分析原因并改进",
        "priority": "high",
        "type": "improvement"
      }
    },
    {
      "trigger": "Bug泄漏率上升",
      "condition": "leakage_rate_change > 0.05",
      "template": {
        "title": "降低生产Bug泄漏率",
        "description": "本次发布泄漏率为{rate}，需加强测试",
        "priority": "high",
        "type": "quality"
      }
    }
  ]
}
```

#### 4.2 行动项生成

**生成输出**：

```json
{
  "action_items_generated": [
    {
      "item_id": "AI_001",
      "source": "效果复盘",
      "title": "优化微信登录入口位置",
      "description": "基于归因分析，用户未发现微信登录入口，建议将入口位置调整到更显眼位置",
      "priority": "high",
      "type": "product_improvement",
      "owner": "product_manager_zhang",
      "due_date": "2024-02-15",
      "verification_method": "A/B测试验证点击率提升",
      "success_criteria": "微信登录使用率达到35%"
    },
    {
      "item_id": "AI_002",
      "source": "工程质量复盘",
      "title": "加强跨模块集成测试",
      "description": "本次8个Bug中5个涉及模块间交互，建议增加集成测试覆盖",
      "priority": "high",
      "type": "test_improvement",
      "owner": "qa_chen",
      "due_date": "2024-02-20",
      "verification_method": "下个版本集成测试Bug占比降低",
      "success_criteria": "集成测试Bug占比从60%降至30%"
    },
    {
      "item_id": "AI_003",
      "source": "发布过程复盘",
      "title": "改善测试环境稳定性",
      "description": "测试环境每周故障2-3次，严重影响效率，建议专项解决",
      "priority": "medium",
      "type": "infrastructure",
      "owner": "ops_wu",
      "due_date": "2024-02-28",
      "verification_method": "统计环境故障次数",
      "success_criteria": "环境故障次数降低至每周0-1次"
    }
  ]
}
```

#### 4.3 行动项优先级排序

**排序规则**：

```json
{
  "action_item_priority": [
    {
      "item_id": "AI_001",
      "priority_score": 85,
      "factors": {
        "impact": 40,
        "urgency": 30,
        "feasibility": 15
      },
      "rank": 1
    },
    {
      "item_id": "AI_002",
      "priority_score": 80,
      "factors": {
        "impact": 35,
        "urgency": 30,
        "feasibility": 15
      },
      "rank": 2
    }
  ]
}
```

## 输出

**存储路径**：`output/pm-development/retrospective-auto/`

**输出文件**：`retrospective_report.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["output_id", "release_id", "effectiveness", "action_items"],
  "properties": {
    "output_id": {"type": "string", "description": "输出唯一标识"},
    "release_id": {"type": "string", "description": "发布ID"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "retrospective_period": {"type": "object", "description": "复盘周期，包含起止日期"},
    "effectiveness": {"type": "object", "description": "效果复盘，包含目标达成和归因分析"},
    "quality": {"type": "object", "description": "质量复盘，包含Bug统计和技术债务分析"},
    "process": {"type": "object", "description": "过程复盘，包含问题发现时机和协作效率"},
    "action_items": {"type": "array", "description": "改进行动项列表，包含优先级和负责人"},
    "overall_assessment": {"type": "object", "description": "整体评估，包含评级和摘要"}
  }
}
```

### 最终输出结构

```json
{
  "output_id": "retrospective_report_xxx",
  "release_id": "release_2024_0125_001",
  "generated_at": "ISO8601",
  "retrospective_period": {
    "start": "2024-01-25",
    "end": "2024-02-08"
  },
  "effectiveness": {
    "summary": {
      "goals_achieved": 2,
      "goals_partially_achieved": 1,
      "goals_not_achieved": 1
    },
    "goal_vs_actual": [...],
    "attribution_analysis": [...]
  },
  "quality": {
    "bug_statistics": {...},
    "bug_trend_analysis": {...},
    "technical_debt_analysis": {...}
  },
  "process": {
    "issue_discovery_timing": {...},
    "response_speed_analysis": {...},
    "collaboration_efficiency": {...}
  },
  "action_items": [
    {
      "item_id": "AI_001",
      "title": "优化微信登录入口位置",
      "priority": "high",
      "owner": "product_manager_zhang",
      "due_date": "2024-02-15",
      "status": "open"
    }
  ],
  "overall_assessment": {
    "rating": "good",
    "summary": "本次发布整体成功，主要功能达到预期，但微信登录使用率未达标需改进"
  }
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| effectiveness | JSON | 效果复盘结果 |
| quality | JSON | 质量复盘结果 |
| process | JSON | 过程复盘结果 |
| action_items | JSON数组 | 改进行动项 |
| overall_assessment | JSON | 整体评估 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| retrospective | object | 是 | 复盘报告根对象 |
| retrospective.summary | object | 是 | 复盘摘要 |
| retrospective.summary.release_version | string | 是 | 发布版本 |
| retrospective.summary.period | string | 是 | 复盘周期 |
| retrospective.what_went_well | array | 是 | 做得好的列表，至少1项 |
| retrospective.what_went_wrong | array | 是 | 做得不好的列表，至少1项 |
| retrospective.what_to_improve | array | 是 | 改进建议列表，至少1项 |
| retrospective.metrics_review | object | 是 | 指标回顾 |
| retrospective.metrics_review.target_vs_actual | array | 是 | 目标vs实际对比 |
| retrospective.metrics_review.anomalies | array | 否 | 异常指标列表 |
| retrospective.action_items | array | 是 | 行动项列表 |
| retrospective.action_items[].id | string | 是 | 行动项编号 |
| retrospective.action_items[].description | string | 是 | 行动项描述 |
| retrospective.action_items[].owner | string | 是 | 负责人 |
| retrospective.action_items[].deadline | string | 是 | 截止日期 |
| retrospective.action_items[].verification | string | 是 | 验证方法 |
| retrospective.action_items[].status | string | 是 | 状态，枚举值：open/in_progress/done |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 发布说明变更 | 复盘范围和指标回顾 | 更新复盘范围，重新评估指标回顾 |
| 灰度发布结果 | 做得好/做得不好 | 更新灰度相关复盘内容，标记需人类确认 |
| 验收报告变更 | 指标回顾和改进建议 | 更新质量相关指标，重新评估改进建议 |
| 变更日志变更 | 复盘范围 | 更新变更影响评估，标记需人类确认 |

当复盘报告自身变更时，对下游的通知机制：

| 复盘变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 行动项新增 | development-task-breakdown | 标记行动项，触发任务创建 |
| 行动项状态变更 | retrospective-orchestrator | 标记状态变更，触发行动项追踪 |
| 指标异常 | analysis-anomaly | 标记异常指标，触发深度分析 |

---

## 决策规则

### 深度分析触发规则

| 条件 | 决策 |
|------|------|
| 效果未达预期≥30% | **触发深度分析** |
| P0缺陷出现 | **触发紧急复盘** |
| 泄漏率上升>20% | **触发根因分析** |
| 回滚发生 | **触发专项复盘** |

### 行动项生成规则

| 条件 | 生成行动项 |
|------|------------|
| 目标未达成 | 生成产品/运营改进项 |
| Bug趋势恶化 | 生成测试/质量改进项 |
| 协作效率问题 | 生成流程改进项 |
| 技术债务增加 | 生成技术改进项 |

## 质量检查

### Quality Gates

| 检查项 | 标准 | 未达标处理 |
|--------|------|------------|
| 数据来源标注 | 所有数据有来源 | 返回补充 |
| 行动项完整性 | 有负责人和截止时间 | 返回补充 |
| 行动项可验证 | 有明确的验证方法 | 返回补充 |

### 质量检查清单

- [ ] 数据来源已标注
- [ ] 目标vs实际对比清晰
- [ ] 归因分析有证据支撑
- [ ] Bug趋势分析完整
- [ ] 过程问题已识别
- [ ] 行动项有负责人和截止时间
- [ ] 行动项有验证方法

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 发布数据缺失 | 用户提供发布内容描述 → 生成复盘框架 | 无法进行目标vs实际对比 |
| 监控数据缺失 | 跳过效果复盘中的指标对比步骤 | 效果复盘章节标注"待补充" |
| 用户反馈缺失 | 跳过用户满意度分析 | 用户反馈维度缺失 |
| 发布数据 + 监控数据 + 用户反馈均缺失 | 用户提供发布内容描述 → 生成复盘框架 | 输出复盘框架模板，各分析维度标注"待补充" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **发布内容描述**：发布了什么功能，目标是什么
- **关键指标数据**（可选）：发布前后的核心指标变化
- **已知问题**（可选）：发布过程中遇到的问题

## 执行日志

```json
{
  "execution_id": "exec_p8_xxx",
  "pipeline": "retrospective-auto",
  "release_id": "release_2024_0125_001",
  "trigger": "scheduled",
  "started_at": "ISO8601",
  "completed_at": "ISO8601",
  "steps": [
    {"step": "effectiveness_review", "status": "completed", "duration_ms": 3000, "goals_evaluated": 4},
    {"step": "quality_review", "status": "completed", "duration_ms": 2000, "bugs_analyzed": 23},
    {"step": "process_review", "status": "completed", "duration_ms": 1500, "bottlenecks_identified": 2},
    {"step": "action_item_generation", "status": "completed", "duration_ms": 1000, "items_generated": 5}
  ],
  "output": {
    "goals_achieved": 2,
    "goals_partially_achieved": 1,
    "goals_not_achieved": 1,
    "action_items_generated": 5,
    "high_priority_items": 2
  },
  "quality_checks_passed": true
}
```
