---
name: agile-daily-sync
description: 当需要自动化每日站会流程时使用。Daily Sync自动化，包含会前AI准备（进展汇总、障碍识别、每日工作项建议）、会中人类同步、会后AI处理（记录、行动项、风险标记），输出每日同步报告。关键词：每日站会、Daily Sync、进展同步、障碍追踪、敏捷日报。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 5: Daily Sync自动化

## 核心原则

1. **透明度即协作**：每日进展、障碍状态全员实时可见，消除信息孤岛
2. **风险前置**：Daily Sync时暴露障碍和风险，而非等到Review才发现问题
3. **自动化追踪**：障碍追踪、行动项完成状态自动更新

## 交互模式

**🤖 AI自动执行（需要人类参与同步会议）**

- **会前**：AI自动生成汇报材料（Step 1-3）
- **会中**：人类参与简短同步（AI生成的材料辅助）
- **会后**：AI自动完成记录和跟进（Step 4-6）

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| sprint_backlog | object | 是 | output/pm-project/agile-sprint-planning/sprint_plan | 当前Sprint的Stories |
| team_assignments | object | 是 | output/pm-project/agile-sprint-planning/sprint_plan | 团队成员任务分配 |
| previous_daily_sync | object | 是 | output/pm-project/agile-daily-sync/daily_sync | 上一次Daily Sync状态 |
| blocker_log | object[] | ○ | output/pm-project/agile-daily-sync/blocker_log | 已记录的障碍列表 |
| current_date | ISO date | 是 | 系统生成 | 当前日期 |

---

## 执行步骤

### 会前AI：准备阶段

#### Step 1: 进展自动汇总

**动作**：
- 扫描所有Stories的状态更新
- 统计昨日完成情况
- 计算Sprint进度（完成率、剩余点数）
- 生成可视化的进展摘要

**输出**：
```json
{
  "progress_summary": {
    "date": "ISO date",
    "sprint_progress": {
      "total_stories": number,
      "completed_stories": number,
      "in_progress_stories": number,
      "completion_rate": 0.0-1.0
    },
    "story_points_progress": {
      "planned": number,
      "completed": number,
      "remaining": number,
      "velocity_pace": "on_track | at_risk | behind"
    },
    "yesterday_completions": [{
      "story_id": "string",
      "title": "string",
      "completed_by": "string"
    }],
    "in_progress_items": [{
      "story_id": "string",
      "title": "string",
      "assignee": "string",
      "progress_percentage": 0-100
    }]
  }
}
```

#### Step 2: 障碍自动识别

**动作**：
- 检查 blocker_log 中的活跃障碍
- 分析未更新的任务（可能的障碍信号）
- 交叉验证障碍状态
- 评估障碍影响

**输出**：
```json
{
  "blockers_identified": [{
    "blocker_id": "BLK-001",
    "description": "string",
    "affected_stories": ["string"],
    "severity": "critical | high | medium | low",
    "duration_days": number,
    "current_status": "open | in_progress | resolved",
    "resolution_path": "string"
  }],
  "blocker_summary": {
    "total_blockers": number,
    "critical_blockers": number,
    "avg_blocker_age_days": number,
    "blocker_resolution_rate": 0.0-1.0
  }
}
```

#### Step 3: 每日工作项建议

**动作**：
- 基于进展和障碍生成今日工作建议
- 优先处理关键路径任务
- 优先解决高优先级障碍
- 考虑团队成员当前状态

**输出**：
```json
{
  "suggested_items": [{
    "story_id": "string",
    "title": "string",
    "assignee": "string",
    "priority": "high | medium | low",
    "suggested_action": "string",
    "reason": "string"
  }]
}
```

### 会中人类：简短同步

**人类同步要点**：
- 每人1-2分钟更新（昨天完成、今天计划、障碍）
- 聚焦关键障碍和风险
- 快速对齐，不深入讨论（会后处理）

### 会后AI：跟进阶段

#### Step 4: 会议记录自动生成

**动作**：
- 汇总同步会议内容
- 记录每人更新要点
- 整理讨论决定
- 生成会议摘要

**输出**：
```json
{
  "meeting_notes": {
    "date": "ISO date",
    "attendees": ["string"],
    "updates": [{
      "person": "string",
      "yesterday": "string",
      "today": "string",
      "blockers": ["string"]
    }],
    "discussions": [{
      "topic": "string",
      "outcome": "string"
    }],
    "summary": "string"
  }
}
```

#### Step 5: 行动项自动提取

**动作**：
- 从会议内容中识别行动项
- 分配负责人和截止日期
- 更新行动项追踪

**输出**：
```json
{
  "action_items": [{
    "id": "AI-001",
    "description": "string",
    "owner": "string",
    "due_date": "ISO date",
    "source": "daily_sync",
    "priority": "high | medium | low"
  }]
}
```

#### Step 6: 风险标记自动更新

**动作**：
- 基于Daily Sync更新风险状态
- 标记新出现的风险信号
- 更新已有风险的严重度
- 触发必要升级

**输出**：
```json
{
  "risk_flags": [{
    "flag_id": "RF-001",
    "description": "string",
    "signal_source": "string",
    "severity": "critical | high | medium | low",
    "recommended_action": "string",
    "escalation_needed": boolean
  }],
  "risk_trend": {
    "total_flags": number,
    "trend": "increasing | stable | decreasing",
    "critical_count_change": number
  }
}
```

---

## 输出

**存储路径**：`output/pm-project/agile-daily-sync/`

**输出文件**：daily_sync.json、metadata.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["daily_sync", "metadata"],
  "properties": {
    "daily_sync": {"type": "object", "description": "每日同步数据，包含进展、障碍、建议和行动项"},
    "metadata": {"type": "object", "description": "元数据，包含日期、Sprint ID和生成时间"}
  }
}
```

```json
{
  "daily_sync": {
    "progress_summary": {},
    "blockers_identified": {},
    "suggested_items": {},
    "meeting_notes": {},
    "action_items": {},
    "risk_flags": {}
  },
  "metadata": {
    "date": "ISO date",
    "sprint_id": "string",
    "generated_at": "ISO datetime",
    "meeting_completed": boolean,
    "attendees_count": number
  }
}
```

---

## Daily Sync时长建议

| 团队规模 | 建议时长 |
|----------|----------|
| ≤ 5人 | 10-15分钟 |
| 6-10人 | 15-20分钟 |
| > 10人 | 考虑分组同步 |

---

## 决策规则

| 条件 | 动作 |
|------|------|
| 关键障碍持续 > 3天未解决 | 触发升级通知 |
| Sprint进度落后 > 20% | 触发风险标记，通知SM |
| 新风险为Critical级别 | 立即升级至项目经理 |
| Daily Sync参与率 < 70% | 提醒并记录缺勤 |

## 质量检查

- [ ] 进展汇总覆盖所有进行中Story
- [ ] 障碍项有明确状态和跟进人
- [ ] 风险标记及时且准确
- [ ] Sync材料在会前生成

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 影响范围 | 降级方案 | 降级输出 |
|---------------|---------|---------|---------|
| Sprint进展数据 | 无法自动汇总进展 | 用户描述当前进展（完成项/进行中项/阻塞项），AI生成Sync材料 | 基于用户描述的Sync材料 |
| 团队任务分配 | 无法按人汇总进展 | 跳过按人维度的进展汇总，仅输出整体进展 | 无个人维度的进展汇总 |
| 上次Sync状态 | 无法对比变化 | 跳过环比分析，仅输出当前状态快照 | 当前状态快照报告 |
| 障碍日志 | 无法识别活跃障碍 | 用户口述当前障碍，AI整理为结构化障碍清单 | 基于用户口述的障碍清单 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **Sprint进展数据缺失**：请用户描述当前进展情况，包括：已完成的Story、正在进行的Story、遇到的问题，AI将基于描述生成Daily Sync汇报材料
2. **障碍日志缺失**：请用户口述当前遇到的障碍和阻塞，AI将整理为结构化障碍清单并评估影响
3. **上次Sync状态缺失**：跳过环比分析，仅输出当前Sprint状态快照，无法提供进展趋势对比
