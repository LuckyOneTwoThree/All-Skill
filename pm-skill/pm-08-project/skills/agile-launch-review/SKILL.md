---
name: agile-launch-review
description: 当需要辅助上线复盘时使用。上线复盘工具，帮助整理上线质量、指标对比和问题归因。关键词：上线复盘、上线质量、指标对比、问题归因、发布回顾。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "软件", "通用"]
  interaction_mode: "human_ai_collaborate"
execution_depth:
  default: standard
---

# 上线复盘

## 核心原则

1. **复盘是为了学习，不是为了追责**：上线复盘的核心价值在于从每次发布中提取可复用的学习，形成团队持续改进的飞轮
2. **数据驱动归因**：指标对比和问题归因须有数据支撑，避免主观臆断
3. **闭环改进**：复盘结论必须转化为具体行动项，每项有负责人、截止日期和验证方法
4. **多维度评估**：从效果、工程质量、过程三个维度全面复盘，避免单一视角偏差

## 基本信息

| 项目 | 值 |
|------|-----|
| Pipeline ID | agile-launch-review |
| 版本 | 2.0 |
| 模块 | 项目管理与执行 / 敏捷执行 |
| 交互模式 | 人机协同 |
| 上游依赖 | 发布管理系统、监控系统、Bug跟踪系统 |
| 下游衔接 | design-prd、quality-acceptance、monitoring-alert-detection、monitoring-attribution、backend-architecture-spec |

## 交互模式

**👤🤖 人机协同**

- 数据收集、分析、报告组装由AI自动完成
- 上线复盘会议需人类参与讨论和决策
- 改进行动项需人类确认负责人和截止日期
- 复盘报告需人类审核确认（目标达成判定、归因分析确认、行动项优先级）

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| release_data | JSON | 是 | 发布管理系统 | 发布版本和变更内容 |
| monitoring_data | JSON | 是 | 监控系统 | 业务指标和性能指标 |
| user_feedback_data | JSON | ○ | 客服系统/反馈平台 | 用户满意度和反馈（可选） |
| bug_statistics | JSON | ○ | Bug跟踪系统 | 发布相关Bug统计（可选） |
| release_process_data | JSON | ○ | 发布日志 | 发布流程数据（可选） |

## 执行步骤

本Pipeline在发布完成后（建议T+2周）执行，自动收集多源数据，对上线效果、工程质量、发布过程进行复盘，并生成改进行动项。

### Step 1: 效果复盘 [条件]（上线后核心指标对比）

**动作**：
- 收集上线后核心业务指标和性能指标数据
- 对比发布目标与实际达成情况
- 对未达标指标进行归因分析
- 评估数据质量和完整性

**输出**：
```json
{
  "release_effectiveness": {
    "release_id": "string",
    "retrospective_period": {
      "start": "ISO date",
      "end": "ISO date"
    },
    "goal_vs_actual": [{
      "metric": "string",
      "target": number,
      "actual": number,
      "achievement_rate": 0.0-1.0,
      "status": "achieved | partially_achieved | not_achieved | exceeded",
      "gap": number,
      "significance": "high | medium | low"
    }],
    "attribution_analysis": [{
      "metric": "string",
      "actual_vs_target_gap": number,
      "attributions": [{
        "factor": "string",
        "impact": number,
        "confidence": 0.0-1.0,
        "evidence": "string"
      }],
      "primary_cause": "string"
    }],
    "data_quality": {
      "completeness": 0.0-1.0,
      "accuracy": "verified | unverified",
      "gaps": ["string"]
    }
  }
}
```

### Step 2: 工程质量复盘 [条件]（Bug密度、技术债变化）

**动作**：
- 统计发布后Bug数量、严重程度分布、来源分布
- 对比本次与上次发布的Bug趋势
- 分析技术债务变化（新增/偿还）
- 识别Bug根因模式

**输出**：
```json
{
  "release_quality": {
    "bug_statistics": {
      "total_bugs": number,
      "by_severity": { "P0": number, "P1": number, "P2": number, "P3": number },
      "by_source": {
        "testing_discovered": number,
        "production_reported": number,
        "leakage_rate": 0.0-1.0
      },
      "by_category": { "functional": number, "ui_ux": number, "performance": number, "security": number, "other": number }
    },
    "bug_trend_analysis": {
      "trend_comparison": {
        "total_bugs": { "current": number, "previous": number, "change_pct": number, "trend": "improving | stable | worsening" },
        "leakage_rate": { "current": number, "previous": number, "change_pct": number, "trend": "improving | stable | worsening" },
        "avg_fix_time_days": { "current": number, "previous": number, "change_pct": number, "trend": "improving | stable | worsening" }
      },
      "root_cause_patterns": [{
        "pattern": "string",
        "evidence": "string",
        "confidence": 0.0-1.0
      }]
    },
    "technical_debt_analysis": {
      "code_quality": {
        "maintainability_index": number,
        "baseline": number,
        "status": "improving | stable | slight_degradation | significant_degradation"
      },
      "debt_items": [{
        "item": "string",
        "severity": "high | medium | low",
        "estimated_debt_hours": number,
        "introduced_in": "string"
      }],
      "total_estimated_debt_hours": number
    }
  }
}
```

### Step 3: 过程复盘 [深度]（Sprint效率、协作质量）

**动作**：
- 分析问题发现时机分布（开发/测试/生产各阶段占比）
- 评估事件响应速度（检测、响应、修复时长）
- 分析团队协作效率（满意度、瓶颈识别）
- 评估发布流程质量

**输出**：
```json
{
  "release_process": {
    "issue_discovery_timing": {
      "discovery_stages": [{
        "stage": "string",
        "issues_found": number,
        "pct": 0.0-1.0,
        "cost_multiplier": number
      }],
      "assessment": {
        "ideal_production_share": "string",
        "actual_production_share": "string",
        "status": "good | needs_improvement | critical"
      }
    },
    "response_speed_analysis": {
      "incident_response": {
        "avg_detection_time_minutes": number,
        "avg_response_time_minutes": number,
        "avg_resolution_time_minutes": number,
        "benchmark": "string"
      },
      "assessment": "good | acceptable | needs_improvement"
    },
    "collaboration_efficiency": {
      "team_feedback_summary": {
        "survey_response_rate": 0.0-1.0,
        "overall_satisfaction": number,
        "key_positives": ["string"],
        "key_improvements": ["string"]
      },
      "bottlenecks_identified": [{
        "bottleneck": "string",
        "frequency": "string",
        "impact": "string",
        "owner": "string"
      }]
    }
  }
}
```

### Step 4: 改进行动项生成 [条件]

**动作**：
- 基于效果复盘、工程质量复盘、过程复盘结果自动生成改进行动项
- 按影响/紧急度/可行性综合评分排序
- 每项行动项包含负责人、截止日期、验证方法和成功标准
- 行动项分类：产品改进、测试改进、基础设施改进、流程改进

**输出**：
```json
{
  "release_action_items": {
    "items": [{
      "item_id": "string",
      "source": "效果复盘 | 工程质量复盘 | 过程复盘",
      "title": "string",
      "description": "string",
      "priority": "high | medium | low",
      "type": "product_improvement | test_improvement | infrastructure | process_improvement",
      "owner": "string",
      "due_date": "ISO date",
      "verification_method": "string",
      "success_criteria": "string",
      "status": "open | in_progress | done"
    }],
    "priority_ranking": [{
      "item_id": "string",
      "priority_score": number,
      "factors": {
        "impact": number,
        "urgency": number,
        "feasibility": number
      },
      "rank": number
    }]
  }
}
```

### Step 5: 上线复盘报告组装 [条件]

将效果复盘、工程质量复盘、过程复盘和改进行动项组装为完整上线复盘报告。

**Markdown报告结构**：
```markdown
# 上线复盘报告：{release_id}

## 1. 执行摘要
- 发布版本 / 复盘周期 / 目标达成概况 / Top 3改进行动项

## 2. 效果复盘
- 目标vs实际对比
- 归因分析
- 数据质量评估

## 3. 工程质量复盘
- Bug统计与趋势
- 技术债务变化
- 根因模式识别

## 4. 过程复盘
- 问题发现时机分析
- 响应速度评估
- 协作效率分析

## 5. 改进行动项
- 行动项清单（来源/优先级/负责人/截止日期/验证方法）
- 优先级排序

## 6. 整体评估
- 评级（good / acceptable / needs_improvement）
- 综合摘要
```

**JSON结构**：
```json
{
  "release_retrospective": {
    "release_id": "string",
    "retrospective_period": { "start": "ISO date", "end": "ISO date" },
    "generated_at": "ISO datetime",
    "effectiveness": {
      "summary": {
        "goals_achieved": number,
        "goals_partially_achieved": number,
        "goals_not_achieved": number
      },
      "goal_vs_actual": [],
      "attribution_analysis": []
    },
    "quality": {
      "bug_statistics": {},
      "bug_trend_analysis": {},
      "technical_debt_analysis": {}
    },
    "process": {
      "issue_discovery_timing": {},
      "response_speed_analysis": {},
      "collaboration_efficiency": {}
    },
    "action_items": [],
    "overall_assessment": {
      "rating": "good | acceptable | needs_improvement",
      "summary": "string"
    }
  }
}
```

---

## 输出

**存储路径**：`output/pm-project/agile-launch-review/`

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | 效果复盘核心结论 + TOP3行动项 | 核心结论 + 最小可行产物，仅输出Step 1和Step 4核心结论 |
| standard | 完整上线复盘报告（当前默认） | 完整产物，包含Step 1-5全部输出 |
| deep | 完整复盘 + 扩展分析 | 完整产物 + 过程复盘深度分析 + 根因模式识别 + 改进路线图 |

**输出文件**：

| 文件 | 路径 | 说明 |
|------|------|------|
| 上线复盘数据 | release_retro.json | 上线复盘数据，包含效果复盘、工程质量复盘、过程复盘和改进行动项 |
| 上线复盘报告 | release-retro-{release_id}.md | 人类可读的上线复盘报告 |
| 上线复盘结构化数据 | release-retro-{release_id}.json | 机器可消费的上线复盘结构化数据 |
| 元数据 | metadata.json | 元数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["release_retrospective", "metadata"],
  "properties": {
    "release_retrospective": {"type": "object", "description": "上线复盘数据，包含效果复盘、工程质量复盘、过程复盘和改进行动项"},
    "metadata": {"type": "object", "description": "元数据"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| release_retrospective.release_id | string | 是 | 发布ID，唯一标识本次发布 |
| release_retrospective.retrospective_period.start | string | 是 | 复盘周期开始日期，ISO 8601格式 |
| release_retrospective.retrospective_period.end | string | 是 | 复盘周期结束日期，ISO 8601格式 |
| release_retrospective.effectiveness.summary.goals_achieved | number | 是 | 达成目标数，须≥0 |
| release_retrospective.effectiveness.summary.goals_not_achieved | number | 是 | 未达成目标数，须≥0 |
| release_retrospective.effectiveness.goal_vs_actual | array | 是 | 目标vs实际对比列表，每项须含metric、target、actual、status |
| release_retrospective.effectiveness.goal_vs_actual[].status | string | 是 | 达成状态，枚举值achieved/partially_achieved/not_achieved/exceeded |
| release_retrospective.quality.bug_statistics.total_bugs | number | 是 | Bug总数，须≥0 |
| release_retrospective.quality.bug_statistics.by_severity | object | 是 | Bug严重程度分布，含P0/P1/P2/P3计数 |
| release_retrospective.quality.bug_trend_analysis.trend_comparison | object | 是 | Bug趋势对比，含total_bugs/leakage_rate/avg_fix_time_days趋势 |
| release_retrospective.quality.technical_debt_analysis.total_estimated_debt_hours | number | 是 | 技术债务总估时，须≥0 |
| release_retrospective.process.issue_discovery_timing.discovery_stages | array | 是 | 问题发现阶段分布，每项须含stage、issues_found、pct |
| release_retrospective.process.collaboration_efficiency.bottlenecks_identified | array | 否 | 识别的瓶颈列表 |
| release_retrospective.action_items | array | 是 | 改进行动项列表，每项须含item_id、title、priority、owner、due_date |
| release_retrospective.action_items[].status | string | 是 | 行动项状态，枚举值open/in_progress/done |
| release_retrospective.overall_assessment.rating | string | 是 | 整体评级，枚举值good/acceptable/needs_improvement |
| release_retrospective.overall_assessment.summary | string | 是 | 整体评估摘要 |
| metadata.release_id | string | 是 | 发布ID，须与release_retrospective中一致 |
| metadata.generated_at | string | 是 | 生成时间，ISO 8601格式 |
| metadata.launch_review_completed | boolean | 是 | 上线复盘是否完成 |

### 输出示例

```json
{
  "release_retrospective": {
    "release_id": "REL-2024-001",
    "retrospective_period": { "start": "2024-01-15", "end": "2024-01-29" },
    "effectiveness": {
      "summary": { "goals_achieved": 3, "goals_partially_achieved": 1, "goals_not_achieved": 0 },
      "goal_vs_actual": [],
      "attribution_analysis": []
    },
    "quality": {
      "bug_statistics": {},
      "bug_trend_analysis": {},
      "technical_debt_analysis": {}
    },
    "process": {
      "issue_discovery_timing": {},
      "response_speed_analysis": {},
      "collaboration_efficiency": {}
    },
    "action_items": [],
    "overall_assessment": {
      "rating": "good",
      "summary": "本次发布整体达成预期目标"
    }
  },
  "metadata": {
    "release_id": "REL-2024-001",
    "generated_at": "ISO datetime",
    "launch_review_completed": true
  }
}
```

---

## 决策规则

| 条件 | 动作 |
|------|------|
| 效果未达预期≥30% | 触发上线深度分析 |
| 发布后P0缺陷出现 | 触发紧急上线复盘 |
| Bug泄漏率上升>20% | 触发根因分析 |
| 发布回滚发生 | 触发专项上线复盘 |
| 目标未达成 | 生成产品/运营改进行动项 |
| Bug趋势恶化 | 生成测试/质量改进行动项 |
| 协作效率问题 | 生成流程改进行动项 |
| 技术债务增加 | 生成技术改进行动项 |

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] 行动项可执行（每项有负责人和截止日期）
- [ ] 上线复盘目标vs实际对比清晰

### P1 检查（standard/deep 必须通过）

- [ ] 上线复盘数据来源已标注
- [ ] 上线复盘归因分析有证据支撑
- [ ] 上线复盘行动项有负责人和截止时间

### P2 检查（仅 deep 必须通过）

- [ ] 上线复盘Bug趋势分析完整
- [ ] 上线复盘过程问题已识别
- [ ] 上线复盘行动项有验证方法

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 发布数据缺失 | 用户提供发布内容描述 → 生成上线复盘框架 | 无法进行目标vs实际对比 |
| 监控数据缺失 | 跳过效果复盘中的指标对比步骤 | 效果复盘章节标注"待补充" |
| 用户反馈数据缺失 | 跳过用户满意度分析 | 用户反馈维度缺失 |
| Bug统计数据缺失 | 跳过工程质量复盘中的Bug统计分析 | Bug统计维度缺失 |
| 发布过程数据缺失 | 跳过过程复盘中的响应速度和协作效率分析 | 过程复盘维度缺失 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **发布数据缺失**：请用户提供发布内容描述（发布了什么功能、目标是什么），AI将据此生成上线复盘框架
2. **监控数据缺失**：跳过效果复盘指标对比，标注"待监控数据补充"，建议后续补充
3. **Bug统计数据缺失**：跳过工程质量复盘Bug统计，标注"待Bug数据补充"
4. **发布过程数据缺失**：跳过过程复盘响应速度和协作效率分析，标注"待过程数据补充"
5. **数据不可用时**：生成上线复盘框架，关键指标标注"待数据补充"

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 发布说明变更 | 上线复盘范围和指标回顾 | 更新复盘范围，重新评估指标回顾 |
| 灰度发布结果变更 | 上线复盘效果评估 | 更新灰度相关复盘内容，标记需人类确认 |
| 验收报告变更 | 上线复盘质量评估和改进建议 | 更新质量相关指标，重新评估改进建议 |
| 变更日志变更 | 上线复盘范围 | 更新变更影响评估，标记需人类确认 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 上线复盘行动项新增 | 行动项追踪 | 更新release_retro.json，通知change-impact-analysis |
| 上线复盘行动项状态变更 | 行动项追踪、后续验证 | 更新release_retro.json，通知行动项负责人 |
| 上线复盘指标异常 | 深度分析触发 | 更新release-retro-{release_id}.json，触发深度分析 |
| 上线复盘报告变更 | 下一发布规划、团队改进计划 | 更新release-retro-{release_id}.json，通知相关团队 |

### 上线复盘反馈回传机制

上线复盘的核心价值在于驱动持续改进闭环。以下定义了复盘结论回传上游 Skill 的规则，确保改进建议和行动项不仅停留在报告层面，而是能实际影响上游决策。

| 复盘结论类型 | 回传目标 | 回传内容 | 回传方式 |
|-------------|----------|----------|----------|
| 目标未达成 | design-prd | goal_vs_actual 中 not_achieved 项 | 写入 release-retro-{release_id}.json 的 effectiveness，design-prd 在下次PRD生成时参考历史目标达成率 |
| Bug泄漏率上升 | quality-acceptance | leakage_rate 趋势和 root_cause_patterns | 写入 release-retro-{release_id}.json 的 quality，quality-acceptance 在测试策略制定时参考 |
| 技术债务增加 | Backend Skill（backend-architecture-spec） | tech_debt_analysis 中的 debt_items | 写入 release-retro-{release_id}.json 的 quality，backend-architecture-spec 在架构设计时参考技术债务清单 |
| 协作瓶颈 | agile-sprint-planning | bottlenecks_identified | 写入 release-retro-{release_id}.json 的 process，agile-sprint-planning 在Sprint规划时规避已知瓶颈 |
| 发布流程问题 | monitoring-alert-detection | issue_discovery_timing 中的 needs_improvement/critical 项 | 写入 release-retro-{release_id}.json 的 process，monitoring-alert-detection 在监控策略制定时参考 |

#### 反馈回传执行规则

1. **自动回传**：复盘报告生成后，自动将回传内容写入对应输出文件，下游 Skill 在执行时消费
2. **回传标注**：所有回传内容须标注来源（`source: "agile-launch-review", release_id`），便于追溯
3. **回传验证**：回传内容须经过质量检查（数据完整、结论有证据支撑），不达标的回传内容标注"待验证"
4. **闭环检查**：下次上线复盘时，检查上次回传的改进行动项是否被执行，未执行的升级为团队讨论项

---
