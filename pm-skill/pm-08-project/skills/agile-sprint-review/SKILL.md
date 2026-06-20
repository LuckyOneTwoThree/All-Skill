---
name: agile-sprint-review
description: 当需要辅助Sprint评审时使用。Sprint评审会议辅助工具，帮助整理Demo清单、Story验收结果和Sprint评分。关键词：Sprint评审、Demo、Story验收、Sprint评分。
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

# Sprint评审辅助

## 核心原则

1. **透明度即协作**：Sprint产出、反馈、改进建议全员可见，确保团队对齐
2. **风险前置**：评审识别的问题和风险及时暴露，防止在后续Sprint中重复出现
3. **自动化追踪**：改进建议执行状态、行动项完成情况自动追踪
4. **复盘是为了学习，不是为了追责**：Sprint评审的核心价值在于从每个迭代中提取可复用的学习，形成团队持续改进的飞轮

## 基本信息

| 项目 | 值 |
|------|-----|
| Pipeline ID | agile-sprint-review |
| 版本 | 2.0 |
| 模块 | 项目管理与执行 / 敏捷执行 |
| 交互模式 | 人机协同 |
| 上游依赖 | agile-sprint-planning、agile-daily-sync |
| 下游衔接 | agile-retrospective、agile-launch-review |

## 交互模式

**👤🤖 人机协同**

- 产出清单整理、Demo准备、反馈收集、数据收集由AI自动完成
- Sprint Review会议仍需人类主持和展示
- 改进建议需人类确认后才可执行
- 评审结果需人类审核确认（Story完成率判定、Demo议程确认、改进建议优先级分配）

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| sprint_backlog | object | 是 | output/pm-project/agile-sprint-planning/sprint_plan.json | Sprint计划的Stories |
| completed_stories | object[] | 是 | 用户提供 | 已完成的Stories |
| team_data | object | ○ | 用户提供 | 团队绩效数据 |
| stakeholder_feedback | object[] | ○ | 用户提供 | 利益相关方反馈（可选） |
| daily_sync_records | markdown | ○ | agile-daily-sync | 每日同步记录（障碍追踪、风险记录、进展更新） |

## 执行步骤

### Step 1: 产出清单自动整理 [核心]（评估目标达成情况并沉淀改进）

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

### Step 2: Demo准备清单生成 [条件]

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

### Step 3: 反馈自动收集与分类 [条件]

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

### Step 4: 数据自动收集 [核心]（Sprint评分）

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

### Step 5: 问题自动识别 [条件]

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

### Step 6: 改进建议自动生成 [条件]

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

**存储路径**：`output/pm-project/agile-sprint-review/`

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | 产出清单 + TOP3改进项 | 核心结论 + 最小可行产物，仅输出Step 1产出清单和Step 5/6核心结论 |
| standard | 完整评审数据（当前默认） | 完整产物，包含Step 1-6全部输出 |
| deep | 完整评审 + 扩展分析 | 完整产物 + 团队动力学分析 + 趋势对比 |

**输出文件**：

| 文件 | 路径 | 说明 |
|------|------|------|
| Sprint评审数据 | sprint_review.json | Sprint评审数据，包含交付物、Demo清单和反馈收集 |
| Sprint回顾数据 | sprint_retro.json | Sprint回顾数据，包含指标、问题识别和改进建议 |
| 元数据 | metadata.json | 元数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["sprint_review", "sprint_retro", "metadata"],
  "properties": {
    "sprint_review": {"type": "object", "description": "Sprint评审数据，包含交付物、Demo清单和反馈收集"},
    "sprint_retro": {"type": "object", "description": "Sprint回顾数据，包含指标、问题识别和改进建议"},
    "metadata": {"type": "object", "description": "元数据"}
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

### 输出示例

```json
{
  "sprint_review": {
    "deliverables": { /* sprint_summary/completed_items/incomplete_items */ },
    "demo_checklist": { /* demo_duration_minutes/items[] */ },
    "feedback_collected": { /* total_feedback_count/feedback_by_type/feedback_items[] */ }
  },
  "sprint_retro": {
    "metrics": { /* completion_metrics/quality_metrics/collaboration_metrics/team_health */ },
    "problems_identified": [{ /* problem_id/description/category/evidence/frequency/severity/impact */ }],
    "improvement_suggestions": [{ /* suggestion_id/problem_addressed/proposed_action/priority/... */ }]
  },
  "metadata": {
    "sprint_id": "SPR-2024-S08",
    "generated_at": "ISO datetime",
    "review_completed": true
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

## 决策规则

| 条件 | 动作 |
|------|------|
| Sprint完成率 < 60% | 触发深度复盘 |
| 质量问题数量异常增加 | 触发质量专项Retro |
| 改进建议连续2个Sprint未执行 | 升级至团队讨论 |
| 团队健康指标恶化 | 升级至管理层关注 |
| Sprint Goal未达成 | 溢出根因分析为必填项 |

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] 评审覆盖所有已完成Story
- [ ] 目标达成与数据一致（达成度判定与Story完成率吻合）
- [ ] 行动项可执行（每项有负责人和截止日期）

### P1 检查（standard/deep 必须通过）

- [ ] 演示内容与验收标准对应
- [ ] 反馈已分类（接受/拒绝/改进）
- [ ] 改进建议有明确负责人和跟进计划

### P2 检查（仅 deep 必须通过）

- [ ] 团队动力学分析完整（团队协作模式、沟通效率、决策质量）
- [ ] 趋势对比分析完整（跨Sprint指标趋势对比、改进效果追踪）

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| Sprint产出数据 | 用户提供完成情况（完成/未完成Stories），AI生成Review | 基于用户输入生成Review，缺少自动化数据支撑 |
| 团队绩效数据 | 跳过协作和效率维度分析，仅基于交付数据评审 | 评审缺少团队协作和效率维度分析 |
| 利益相关方反馈 | 跳过反馈收集环节，Review中标注"无利益相关方反馈" | Review报告无外部反馈内容 |
| Sprint计划 | 基于评审结果反推Sprint目标，标注"计划信息缺失" | 目标达成分析基于反推数据，缺少计划基准对比 |
| 每日同步记录 | 跳过障碍分析环节，标注"障碍数据缺失" | 评审缺少障碍追踪和风险记录维度 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **Sprint产出数据缺失**：请用户提供完成情况，包括：已完成的Stories列表、未完成Stories及原因、故事点完成情况，AI将据此生成Review报告
2. **团队绩效数据缺失**：跳过协作和效率维度分析，Review仅基于交付和质量数据，标注"缺少团队协作数据"
3. **利益相关方反馈缺失**：Review中跳过反馈收集环节，标注"无利益相关方反馈"，建议通过其他渠道补充收集
4. **Sprint计划缺失**：基于评审结果反推目标，标注"计划信息缺失"
5. **数据不可用时**：生成评审框架，关键指标标注"待数据补充"

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| Sprint计划变更（Story增减/优先级调整） | 产出清单、完成率计算、Demo议程 | 重新整理产出清单，更新完成率和Demo准备清单 |
| 团队数据更新（人员变动/绩效变化） | 评审协作指标、团队健康评估 | 重新计算协作指标，更新问题识别和改进建议 |
| 反馈数据补充（新增利益相关方反馈） | 反馈收集分类、优先级排序 | 重新分类反馈，更新反馈统计和优先级排序 |
| Sprint评审结果变更（交付物/反馈更新） | 交付质量评估、改进行动项 | 更新质量指标和改进建议，重新生成报告 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| Sprint评审结果变更 | Sprint复盘报告、下一Sprint规划 | 更新sprint_review.json，通知agile-retrospective、agile-sprint-planning |
| 评审改进建议变更 | 下一Sprint行动项、团队改进计划 | 更新sprint_retro.json，通知agile-retrospective、agile-sprint-planning |
| 行动项状态变更 | 团队执行跟踪、后续Sprint验证 | 更新metadata.json，通知相关行动项负责人 |

---
