---
name: agile-orchestrator
description: 当需要管理Sprint周期或追踪敏捷执行时使用。敏捷执行指挥官，调度 agile-sprint-planning、agile-daily-sync、agile-review 子Skill执行。agile-review 已合并 retrospective-auto 的自动回顾能力。关键词：敏捷执行、Sprint规划、每日站会、Sprint评审、敏捷管理、Sprint复盘、迭代复盘、敏捷开发、复盘报告、自动回顾。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "orchestrator"
  version: "9.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "规划一下Sprint"
    - "开一下每日站会"
    - "做Sprint评审"
    - "管理敏捷迭代"
---

# 敏捷执行指挥官

## 核心原则

**Sprint是节奏不是目标，交付是结果不是目的**

Sprint的价值不在于完成更多Story，而在于建立可持续的交付节奏。交付本身不是目的，交付对用户有价值的功能才是。不要为了完成Sprint而牺牲质量或忽视反馈。

1. **节奏驱动交付**——Sprint的核心价值在于建立可预测的交付节奏，而非追求单次Sprint的产出最大化。编排器应确保每个Sprint周期的完整性，避免跳过评审或复盘环节。
2. **障碍即时暴露**——敏捷执行的编排重心是让问题在Daily Sync中浮出水面，而非在Review时才被发现。编排器应优先保障障碍信息的流动速度。
3. **复盘闭环改进**——每个Sprint的复盘结论必须转化为下一Sprint的具体行动项，编排器应确保改进建议不被遗忘，而是成为下一轮规划的输入。agile-review 已合并 retrospective-auto 的自动回顾能力，可自动收集团队反馈、识别协作模式并生成回顾洞察。

## 编排协议

> 协议源头：[orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md)（仅供维护者追踪，本文件已内联完整协议内容，可独立使用）

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。
7. **跨子Skill交叉验证**：当多个子Skill的产出之间存在一致性约束时，编排器可在阶段间执行交叉验证（读取多份产出比对一致性），这属于编排器的协调职责而非代理执行子Skill逻辑。交叉验证规则在编排器SKILL.md中显式定义。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/{领域路径}/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段卡口标准

编排器的阶段卡口只校验以下3类条件，不深入子Skill内部字段：

| 卡口类型 | 校验内容 | 示例 |
|----------|----------|------|
| 输出存在性 | 输出文件已生成且非空 | "api-design-spec输出文件已生成" |
| 顶层结构完整性 | JSON顶层必填字段存在 | "prd.json包含features/pages/entities" |
| 人类决策确认 | 关键决策点已获人类确认 | "设计审查人类确认通过" |

### 通用异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板，整体置信度设为0.3，强制人类确认是否继续 |

## Pipeline

```yaml
pipeline: agile-orchestrator
version: 9.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-project/agile-orchestrator.md

stages:
  - id: phase-1
    name: "Sprint规划"
    depends_on: []
    skills: [agile-sprint-planning]
    gate:
      condition: "Sprint计划已确认"
      fail_action: "暂停Sprint启动，补充规划"

  - id: phase-2
    name: "每日同步"
    depends_on: [phase-1]
    skills: [agile-daily-sync]
    gate:
      condition: "Daily Sync障碍已暴露"
      fail_action: "加强障碍追踪和升级机制"

  - id: phase-3
    name: "Sprint评审与复盘"
    depends_on: [phase-1, phase-2]
    skills: [agile-review]
    gate:
      condition: "Sprint评审与复盘报告已完成"
      fail_action: "补充分析或修改行动项"
```

## 阶段执行计划

#### 调用 agile-sprint-planning

```
Skill: agile-sprint-planning
输入:
  product_backlog: iteration-decision → prioritized_items
  sprint_goal: 用户提供（可选）
  team_capacity: planning-resource → resource_plan
  sprint_days: 用户提供
输出: output/pm-project/agile-sprint-planning/
验证: Sprint Goal明确且包含≥1个可量化验收标准；选取的Stories总点数≤团队可用容量×1.1；100%的跨团队依赖已识别
模式: 🤖→👤
```

#### 调用 agile-daily-sync

```
Skill: agile-daily-sync
输入:
  sprint_backlog: agile-sprint-planning → sprint_plan
  task_assignment: agile-sprint-planning → sprint_plan
  last_daily_sync: agile-daily-sync → daily_sync
  blocker_log: agile-daily-sync → blocker_log（可选）
输出: output/pm-project/agile-daily-sync/
验证: 进展汇总覆盖所有进行中Story；障碍项有明确状态和跟进人；风险标记及时且准确
模式: 🤖
```

#### 调用 agile-review

```
Skill: agile-review
输入:
  sprint_backlog: agile-sprint-planning → sprint_plan.json
  completed_stories: 用户提供
  team_data: 用户提供（可选）
  stakeholder_feedback: 用户提供（可选）
  daily_sync_records: agile-daily-sync（可选）
  historical_sprint_data: 用户提供（可选）
  team_feedback: 用户提供（团队反馈，用于自动回顾）
输出: output/pm-project/agile-review/
验证: 评审覆盖所有已完成Story；演示内容与验收标准对应；反馈已分类；改进建议有明确负责人；目标达成与数据一致；行动项可执行；复盘报告已生成；回顾洞察已生成且协作模式已识别
模式: 🤖
```

### 阶段总结（post_pipeline）

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-project/agile-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-project/ |
| 总结输出路径 | output/phase-reports/pm-project/agile-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: release-orchestrator（Sprint完成且交付物达到发布标准，进入发布流程）
  alternatives:
    - target: agile-orchestrator
      reason: 进入下一Sprint规划，持续迭代
      condition: Sprint交付物未达发布标准，需继续迭代时
    - target: monitoring-orchestrator
      reason: Sprint复盘发现需加强监控
      condition: 复盘发现线上问题频发或监控覆盖不足时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| Sprint计划已确认 | agile-sprint-planning输出文件已生成且非空 | 暂停Sprint启动，补充规划 |
| Daily Sync障碍已暴露 | agile-daily-sync输出文件已生成且非空 | 加强障碍追踪和升级机制 |
| Sprint评审与复盘报告已完成 | agile-review输出文件已生成且人类审核确认 | 补充分析或修改行动项 |
| 阶段总结已生成 | output/phase-reports/pm-project/agile-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Sprint Goal确认 | Sprint Planning完成 | 确认Sprint目标的合理性和可达性 |
| Sprint取消决策 | Sprint目标连续未达成或重大范围变更 | 决定是否取消当前Sprint |
| 复盘行动项确认 | Sprint复盘报告生成完成 | 确认改进行动项和下一Sprint建议 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1子Skill（Sprint规划）失败 | 暂停Sprint启动，输出失败原因，提示用户补充Backlog或调整团队容量后重试 |
| 上游数据缺失（如Backlog、团队容量） | 用占位数据生成草稿版Sprint计划，标注低置信度，提示用户补充后重新规划 |
| 关键决策点未获人类确认（如Sprint Goal） | 暂停进入下一阶段，持续等待确认，超时后升级提醒 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板（仅含元信息和空结构），整体置信度设为0.3，强制人类确认是否继续。人类确认后基于用户提供信息和AI知识库推断生成，所有推断内容标注confidence≤0.5和needs_human_validation:true |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
