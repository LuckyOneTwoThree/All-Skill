---
name: agile-review
description: 当需要自动化Sprint评审和回顾时使用。Sprint Review与Retro自动化，包含Sprint Review（产出清单整理、Demo准备清单、反馈收集分类）和Sprint Retro（数据收集、问题识别、改进建议生成）。关键词：Sprint Review、Sprint Retro、迭代评审、迭代回顾、敏捷复盘。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "pipeline"
  version: "3.0"
  interaction_mode: "ai_auto"
---

# Pipeline 6: Sprint Review与Retro自动化

## 核心原则

1. **透明度即协作**：Sprint产出、反馈、改进建议全员可见，确保团队对齐
2. **风险前置**：Retro识别的问题和风险及时暴露，防止在后续Sprint中重复出现
3. **自动化追踪**：改进建议执行状态、行动项完成情况自动追踪

## 交互模式

**🤖 AI自动执行**

- 所有准备和后续处理由AI自动完成
- Sprint Review会议仍需人类主持和展示
- Sprint Retro会议由人类参与讨论和决定
- 改进建议需人类确认后才可执行

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| sprint_backlog | object | 是 | output/pm-project/agile-sprint-planning/sprint_plan.json | Sprint计划的Stories |
| completed_stories | object[] | 是 | 用户提供 | 已完成的Stories |
| team_data | object | ○ | 用户提供 | 团队绩效数据 |
| stakeholder_feedback | object[] | ○ | 用户提供 | 利益相关方反馈（可选） |

## 执行步骤

### Sprint Review 部分

#### Step 1: 产出清单自动整理

**动作**：
- 汇总Sprint完成的所有Stories
- 整理每个Story的交付内容
- 统计完成率
- 生成产出摘要

**输出**：
```json
{
  "deliverables": {
    "sprint_summary": {
      "sprint_id": "string",
      "planned_stories": number,
      "completed_stories": number,
      "cancelled_stories": number,
      "completion_rate": 0.0-1.0,
      "planned_points": number,
      "completed_points": number,
      "points_completion_rate": 0.0-1.0
    },
    "completed_items": [{
      "story_id": "string",
      "title": "string",
      "story_points": number,
      "key_deliverables": ["string"],
      "completed_by": "string",
      "quality_notes": "string"
    }],
    "incomplete_items": [{
      "story_id": "string",
      "title": "string",
      "remaining_work": "string",
      "carryover_decision": "next_sprint | deprioritize | replan"
    }]
  }
}
```

#### Step 2: Demo准备清单生成

**动作**：
- 基于完成Stories生成Demo议程
- 标注每个Demo的时长
- 准备Demo环境检查清单
- 建议演示顺序

**输出**：
```json
{
  "demo_checklist": {
    "demo_duration_minutes": number,
    "items": [{
      "order": 1,
      "demo_topic": "string",
      "story_id": "string",
      "presenter": "string",
      "duration_minutes": number,
      "environment_check": {
        "staging_ready": boolean,
        "test_data_ready": boolean,
        "access_verified": boolean
      },
      "key_points": ["string"],
      "questions_to_anticipate": ["string"]
    }]
  }
}
```

#### Step 3: 反馈自动收集与分类

**动作**：
- 收集利益相关方反馈
- 分类反馈类型（功能/体验/性能/其他）
- 识别重复反馈
- 按重要性排序

**输出**：
```json
{
  "feedback_collected": {
    "total_feedback_count": number,
    "feedback_by_type": {
      "feature_request": number,
      "usability_issue": number,
      "performance_concern": number,
      "bug_report": number,
      "positive_feedback": number,
      "other": number
    },
    "feedback_items": [{
      "feedback_id": "FB-001",
      "description": "string",
      "type": "string",
      "source": "string",
      "timestamp": "ISO datetime",
      "priority": "high | medium | low",
      "related_story": "string | null",
      "actionable": boolean
    }]
  }
}
```

---

### Sprint Retro 部分

#### Step 4: 数据自动收集

**动作**：
- 收集Sprint完成率、质量指标、协作数据
- 分析团队节奏和效率
- 提取关键数据指标
- 生成数据摘要

**输出**：
```json
{
  "metrics": {
    "completion_metrics": {
      "story_completion_rate": 0.0-1.0,
      "point_completion_rate": 0.0-1.0,
      "avg_story_completion_time_days": number,
      "carryover_rate": 0.0-1.0
    },
    "quality_metrics": {
      "bug_count": number,
      "bug_rejection_rate": 0.0-1.0,
      "code_review_turnaround_hours": number,
      "build_failure_rate": 0.0-1.0
    },
    "collaboration_metrics": {
      "blocker_resolution_time_hours": number,
      "meeting_hours_total": number,
      "ad_hoc_interruption_count": number,
      "cross_team_dependency_delays": number
    },
    "team_health": {
      "avg_overtime_hours": number,
      "member_stress_indicators": ["string"],
      "velocity_stability": "stable | fluctuating | declining"
    }
  }
}
```

#### Step 5: 问题自动识别

**动作**：
- 分析数据识别模式和问题
- 检测Sprint中的异常
- 识别重复出现的问题
- 分类问题类型（流程/技术/协作/资源）

**输出**：
```json
{
  "problems_identified": [{
    "problem_id": "PRB-001",
    "description": "string",
    "category": "process | technical | collaboration | resource",
    "evidence": "string",
    "frequency": "first_time | recurring | persistent",
    "severity": "high | medium | low",
    "impact": "string"
  }]
}
```

#### Step 6: 改进建议自动生成

**动作**：
- 基于问题生成针对性改进建议
- 考虑团队上下文和历史改进
- 建议可落地的具体行动
- 标注建议优先级

**输出**：
```json
{
  "improvement_suggestions": [{
    "suggestion_id": "IMP-001",
    "problem_addressed": "PRB-001",
    "description": "string",
    "proposed_action": "string",
    "expected_impact": "string",
    "implementation_effort": "low | medium | high",
    "priority": "high | medium | low",
    "owner_suggestion": "string",
    "success_metric": "string"
  }]
}
```

---

## 输出

**存储路径**：`output/pm-project/agile-review/`

**输出文件**：sprint_review.json、sprint_retro.json、metadata.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["sprint_review"],
  "properties": {
    "sprint_review": {"type": "object", "description": "Sprint评审数据，包含交付物、Demo清单和反馈收集"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| sprint_review.deliverables.sprint_summary.sprint_id | string | 是 | Sprint唯一标识，格式SPR-YYYY-SNN |
| sprint_review.deliverables.sprint_summary.completion_rate | number | 是 | Story完成率，范围0.0-1.0 |
| sprint_review.deliverables.sprint_summary.points_completion_rate | number | 是 | 故事点完成率，范围0.0-1.0 |
| sprint_review.deliverables.completed_items | array | 是 | 已完成Story列表，每项须含story_id、title、story_points |
| sprint_review.deliverables.incomplete_items | array | 是 | 未完成Story列表，carryover_decision须为枚举值 |
| sprint_review.demo_checklist.items | array | 是 | Demo清单，每项须含order、demo_topic、duration_minutes |
| sprint_review.demo_checklist.items[].environment_check | object | 否 | 环境检查项，含staging_ready、test_data_ready、access_verified |
| sprint_review.feedback_collected.total_feedback_count | number | 是 | 反馈总数，须≥feedback_items数组长度 |
| sprint_review.feedback_collected.feedback_items[].priority | string | 是 | 优先级，枚举值high/medium/low |
| sprint_retro.metrics.completion_metrics.story_completion_rate | number | 是 | Story完成率，须与sprint_summary中一致 |
| sprint_retro.problems_identified[].category | string | 是 | 问题分类，枚举值process/technical/collaboration/resource |
| sprint_retro.problems_identified[].frequency | string | 是 | 出现频率，枚举值first_time/recurring/persistent |
| sprint_retro.improvement_suggestions[].problem_addressed | string | 是 | 关联问题ID，须与problems_identified中的problem_id对应 |
| sprint_retro.improvement_suggestions[].implementation_effort | string | 是 | 实施成本，枚举值low/medium/high |
| metadata.sprint_id | string | 是 | Sprint标识，须与sprint_summary中一致 |
| metadata.generated_at | string | 是 | 生成时间，ISO 8601格式 |
| metadata.review_completed | boolean | 是 | Review是否完成 |
| metadata.retro_completed | boolean | 是 | Retro是否完成 |

```json
{
  "sprint_review": {
    "deliverables": {
      "sprint_summary": {
        "sprint_id": "SPR-2024-S08",
        "planned_stories": 8,
        "completed_stories": 7,
        "cancelled_stories": 0,
        "completion_rate": 0.875,
        "planned_points": 34,
        "completed_points": 30,
        "points_completion_rate": 0.88
      },
      "completed_items": [
        {
          "story_id": "STO-042",
          "title": "课程播放器进度记忆功能",
          "story_points": 5,
          "key_deliverables": ["断点续播", "多端进度同步"],
          "completed_by": "李伟",
          "quality_notes": "通过全量回归测试，无P0/P1缺陷"
        }
      ],
      "incomplete_items": [
        {
          "story_id": "STO-048",
          "title": "课堂弹幕互动功能",
          "remaining_work": "弹幕审核后台接口待联调",
          "carryover_decision": "next_sprint"
        }
      ]
    },
    "demo_checklist": {
      "demo_duration_minutes": 45,
      "items": [
        {
          "order": 1,
          "demo_topic": "课程断点续播演示",
          "story_id": "STO-042",
          "presenter": "李伟",
          "duration_minutes": 10,
          "environment_check": {
            "staging_ready": true,
            "test_data_ready": true,
            "access_verified": true
          },
          "key_points": ["跨设备续播", "进度条精确跳转"],
          "questions_to_anticipate": ["离线场景是否支持？"]
        }
      ]
    },
    "feedback_collected": {
      "total_feedback_count": 12,
      "feedback_by_type": {
        "feature_request": 3,
        "usability_issue": 2,
        "performance_concern": 1,
        "bug_report": 1,
        "positive_feedback": 4,
        "other": 1
      },
      "feedback_items": [
        {
          "feedback_id": "FB-001",
          "description": "希望课程播放器支持倍速播放",
          "type": "feature_request",
          "source": "教务主管",
          "timestamp": "2024-04-12T15:30:00+08:00",
          "priority": "medium",
          "related_story": null,
          "actionable": true
        }
      ]
    }
  },
  "sprint_retro": {
    "metrics": {
      "completion_metrics": {
        "story_completion_rate": 0.875,
        "point_completion_rate": 0.88,
        "avg_story_completion_time_days": 3.2,
        "carryover_rate": 0.125
      },
      "quality_metrics": {
        "bug_count": 4,
        "bug_rejection_rate": 0.25,
        "code_review_turnaround_hours": 8,
        "build_failure_rate": 0.05
      },
      "collaboration_metrics": {
        "blocker_resolution_time_hours": 6,
        "meeting_hours_total": 12,
        "ad_hoc_interruption_count": 5,
        "cross_team_dependency_delays": 1
      },
      "team_health": {
        "avg_overtime_hours": 3.5,
        "member_stress_indicators": ["1名成员反馈排期偏紧"],
        "velocity_stability": "stable"
      }
    },
    "problems_identified": [
      {
        "problem_id": "PRB-001",
        "description": "弹幕审核接口依赖内容安全团队排期，导致Story跨Sprint",
        "category": "collaboration",
        "evidence": "STO-048因审核接口未就绪阻塞3天",
        "frequency": "recurring",
        "severity": "high",
        "impact": "课堂互动功能交付延迟1个Sprint"
      }
    ],
    "improvement_suggestions": [
      {
        "suggestion_id": "IMP-001",
        "problem_addressed": "PRB-001",
        "description": "跨团队依赖需提前对齐排期",
        "proposed_action": "Sprint规划阶段邀请内容安全团队参与依赖确认",
        "expected_impact": "减少跨团队阻塞导致的延期",
        "implementation_effort": "low",
        "priority": "high",
        "owner_suggestion": "张明（PM）",
        "success_metric": "跨团队阻塞导致的延期减少50%"
      }
    ]
  },
  "metadata": {
    "sprint_id": "SPR-2024-S08",
    "generated_at": "2024-04-12T18:00:00+08:00",
    "review_completed": true,
    "retro_completed": true,
    "action_items_committed": 3
  }
}
```

---

## Review时长建议

| 环节 | 建议时长 |
|------|----------|
| Demo展示 | 50% |
| 反馈讨论 | 30% |
| 下一步对齐 | 20% |

## Retro时长建议

| 环节 | 建议时长 |
|------|----------|
| 数据回顾 | 15% |
| 问题讨论 | 50% |
| 改进建议 | 35% |

---

## 决策规则

| 条件 | 动作 |
|------|------|
| Sprint完成率 < 60% | 触发深度复盘 |
| 质量问题数量异常增加 | 触发质量专项Retro |
| 改进建议连续2个Sprint未执行 | 升级至团队讨论 |
| 团队健康指标恶化 | 升级至管理层关注 |

## 质量检查

- [ ] 评审覆盖所有已完成Story
- [ ] 演示内容与验收标准对应
- [ ] 反馈已分类（接受/拒绝/改进）
- [ ] 改进建议有明确负责人和跟进计划

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| Sprint产出数据 | 用户提供完成情况（完成/未完成Stories），AI生成Review/Retro | 基于用户输入生成Review/Retro，缺少自动化数据支撑 |
| 团队绩效数据 | 跳过协作和效率维度分析，仅基于交付数据复盘 | Retro缺少团队协作和效率维度分析 |
| 利益相关方反馈 | 跳过反馈收集环节，Review中标注"无利益相关方反馈" | Review报告无外部反馈内容 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **Sprint产出数据缺失**：请用户提供完成情况，包括：已完成的Stories列表、未完成Stories及原因、故事点完成情况，AI将据此生成Review和Retro报告
2. **团队绩效数据缺失**：跳过协作和效率维度分析，Retro仅基于交付和质量数据，标注"缺少团队协作数据"
3. **利益相关方反馈缺失**：Review中跳过反馈收集环节，标注"无利益相关方反馈"，建议通过其他渠道补充收集

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| Sprint计划变更（Story增减/优先级调整） | 产出清单、完成率计算、Demo议程 | 重新整理产出清单，更新完成率和Demo准备清单 |
| 团队数据更新（人员变动/绩效变化） | Retro协作指标、团队健康评估 | 重新计算协作指标，更新问题识别和改进建议 |
| 反馈数据补充（新增利益相关方反馈） | 反馈收集分类、优先级排序 | 重新分类反馈，更新反馈统计和优先级排序 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| Sprint评审结果变更 | Sprint复盘报告、下一Sprint规划 | 更新sprint_review.json，通知sprint-retrospective-report和agile-sprint-planning |
| Retro改进建议变更 | 下一Sprint行动项、团队改进计划 | 更新sprint_retro.json，通知agile-sprint-planning |
| 行动项状态变更 | 团队执行跟踪、后续Sprint验证 | 更新metadata.json，通知相关行动项负责人 |
