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

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: agile-orchestrator
version: 7.0

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

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-project/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-project/agile-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: release-orchestrator
    reason: Sprint完成且交付物达到发布标准，进入发布流程
    input_mapping:
      sprint_output: "output/pm-project/agile-review/ → release-orchestrator输入"
  alternatives:
    - target: agile-orchestrator
      reason: 进入下一Sprint规划，持续迭代
      condition: Sprint交付物未达发布标准，需继续迭代时
    - target: monitoring-orchestrator
      reason: Sprint复盘发现需加强监控
      condition: 复盘发现线上问题频发或监控覆盖不足时
  special_cases: []
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| Sprint计划已确认 | sprint-planning输出文件已生成且非空 | 暂停Sprint启动，补充规划 |
| Daily Sync障碍已暴露 | daily-sync输出文件已生成且非空 | 加强障碍追踪和升级机制 |
| Sprint评审与复盘报告已完成 | sprint-review输出文件已生成且人类审核确认 | 补充分析或修改行动项 |
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

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 sprint-retrospective-report（Sprint复盘报告）
- v4.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
- v5.0: 核心原则替换为编排理念原则，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v7.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v8.0: 合并 agile-review + sprint-retrospective-report → agile-review；移除sprint-retrospective-report阶段；agile-review新增daily_sync_records输入依赖agile-daily-sync；更新Pipeline为3阶段；更新阶段卡口和验证条件
- v9.0: agile-review 合并 retrospective-auto 自动回顾能力——从pm-05迁移；agile-review新增team_feedback输入；验证条件新增回顾洞察已生成且协作模式已识别；阶段卡口更新；核心原则更新复盘闭环改进描述
