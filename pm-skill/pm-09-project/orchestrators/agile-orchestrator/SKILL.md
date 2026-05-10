---
name: agile-orchestrator
description: 敏捷执行指挥官。当需要管理Sprint周期或追踪敏捷执行时使用，包括Sprint规划与容量分配、每日同步与障碍追踪、Sprint评审与交付检查。关键词：敏捷执行、Sprint规划、每日站会、Sprint评审、敏捷管理。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "orchestrator"
  version: "2.0"
---

# 敏捷执行指挥官

## 核心原则

**Sprint是节奏不是目标，交付是结果不是目的**

Sprint的价值不在于完成更多Story，而在于建立可持续的交付节奏。交付本身不是目的，交付对用户有价值的功能才是。不要为了完成Sprint而牺牲质量或忽视反馈。

## 执行步骤

1. **透明度即协作**：Sprint计划、每日进展、障碍状态全员实时可见，消除信息孤岛
2. **风险前置**：Sprint Planning时识别风险和依赖，Daily Sync时暴露障碍，而非等到Review才发现问题
3. **自动化追踪**：Sprint进度、Story状态、障碍追踪自动化，减少人工汇报负担

## 任务调度

```
agile-sprint-planning → agile-daily-sync → agile-review
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| Sprint第一天 | → agile-sprint-planning（Sprint规划） |
| 每个工作日 | → agile-daily-sync（每日同步） |
| Sprint最后一天 | → agile-review（Sprint Review + Retro） |

### 数据流转

```
[Product Backlog + 团队容量]
       ↓
agile-sprint-planning
       ↓ sprint_plan (goal / stories / capacity / risks)
[每日进展 + 障碍 + 风险]
       ↓
agile-daily-sync
       ↓ daily_sync (progress / blockers / risks / updates)
[迭代数据 + 质量指标 + 团队反馈]
       ↓
agile-review
       ↓ sprint_review + sprint_retro (deliverables / feedback / improvements)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-project/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| Sprint计划已确认 | Sprint Goal已定义，Story已分配，容量已确认 | 暂停Sprint启动，补充规划 |
| Daily Sync障碍已暴露 | 每日障碍已识别并标记，重大障碍已升级 | 加强障碍追踪和升级机制 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Sprint Goal确认 | Sprint Planning完成 | 确认Sprint目标的合理性和可达性 |
| Sprint取消决策 | Sprint目标连续未达成或重大范围变更 | 决定是否取消当前Sprint |
