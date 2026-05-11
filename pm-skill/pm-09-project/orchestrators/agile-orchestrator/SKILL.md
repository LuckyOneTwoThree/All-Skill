---
name: agile-orchestrator
description: 当需要管理Sprint周期或追踪敏捷执行时使用。敏捷执行指挥官，调度 agile-sprint-planning、agile-daily-sync、agile-review、sprint-retrospective-report 子Skill执行。关键词：敏捷执行、Sprint规划、每日站会、Sprint评审、敏捷管理、Sprint复盘、迭代复盘。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "orchestrator"
  version: "5.0"
---

# 敏捷执行指挥官

## 核心原则

**Sprint是节奏不是目标，交付是结果不是目的**

Sprint的价值不在于完成更多Story，而在于建立可持续的交付节奏。交付本身不是目的，交付对用户有价值的功能才是。不要为了完成Sprint而牺牲质量或忽视反馈。

1. **节奏驱动交付**——Sprint的核心价值在于建立可预测的交付节奏，而非追求单次Sprint的产出最大化。编排器应确保每个Sprint周期的完整性，避免跳过评审或复盘环节。
2. **障碍即时暴露**——敏捷执行的编排重心是让问题在Daily Sync中浮出水面，而非在Review时才被发现。编排器应优先保障障碍信息的流动速度。
3. **复盘闭环改进**——每个Sprint的复盘结论必须转化为下一Sprint的具体行动项，编排器应确保改进建议不被遗忘，而是成为下一轮规划的输入。

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：Sprint规划

| 项目 | 内容 |
|------|------|
| 子Skill名称 | agile-sprint-planning |
| 读取定义路径 | `.trae/skills/agile-sprint-planning/SKILL.md` |
| 输入 | Product Backlog（iteration-backlog → prioritized_items）、Sprint目标（用户提供，可选）、团队容量（planning-resource → resource_plan）、Sprint天数（用户提供） |
| 输出 | `output/pm-project/agile-sprint-planning/`（sprint_plan、metadata） |
| 验证 | Sprint Goal明确且包含≥1个可量化验收标准；选取的Stories总点数≤团队可用容量×1.1；100%的跨团队依赖已识别 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | Sprint计划已确认（Sprint Goal已定义，Story已分配，容量已确认），否则暂停Sprint启动，补充规划 |

### 阶段2：每日同步

| 项目 | 内容 |
|------|------|
| 子Skill名称 | agile-daily-sync |
| 读取定义路径 | `.trae/skills/agile-daily-sync/SKILL.md` |
| 输入 | Sprint Backlog（agile-sprint-planning → sprint_plan）、团队任务分配（agile-sprint-planning → sprint_plan）、上次Daily Sync状态（agile-daily-sync → daily_sync）、障碍日志（agile-daily-sync → blocker_log，可选） |
| 输出 | `output/pm-project/agile-daily-sync/`（daily_sync、metadata） |
| 验证 | 进展汇总覆盖所有进行中Story；障碍项有明确状态和跟进人；风险标记及时且准确 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | Daily Sync障碍已暴露（每日障碍已识别并标记，重大障碍已升级），否则加强障碍追踪和升级机制 |

### 阶段3：Sprint评审

| 项目 | 内容 |
|------|------|
| 子Skill名称 | agile-review |
| 读取定义路径 | `.trae/skills/agile-review/SKILL.md` |
| 输入 | Sprint Backlog（agile-sprint-planning → sprint_plan.json）、已完成Stories（用户提供）、团队数据（用户提供，可选）、利益相关方反馈（用户提供，可选） |
| 输出 | `output/pm-project/agile-review/`（sprint_review、sprint_retro、metadata） |
| 验证 | 评审覆盖所有已完成Story；演示内容与验收标准对应；反馈已分类；改进建议有明确负责人 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | Sprint评审完成（交付物已整理、反馈已收集、改进建议已生成），否则补充评审内容 |

### 阶段4：复盘报告生成

| 项目 | 内容 |
|------|------|
| 子Skill名称 | sprint-retrospective-report |
| 读取定义路径 | `.trae/skills/sprint-retrospective-report/SKILL.md` |
| 输入 | Sprint计划（agile-sprint-planning）、每日同步记录（agile-daily-sync，可选）、Sprint评审结果（agile-review）、历史Sprint数据（用户提供，可选） |
| 输出 | `output/pm-project/sprint-retrospective-report/sprint-retro-S{NN}.md`、`output/pm-project/sprint-retrospective-report/sprint-retro-S{NN}.json` |
| 验证 | 目标达成与数据一致；溢出根因已分类；行动项可执行（每项有负责人和截止日期）；速率趋势有依据 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 复盘报告已审核（Sprint复盘报告经人类审核确认），否则补充分析或修改行动项 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-project/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| Sprint计划已确认 | Sprint Goal已定义，Story已分配，容量已确认 | 暂停Sprint启动，补充规划 |
| Daily Sync障碍已暴露 | 每日障碍已识别并标记，重大障碍已升级 | 加强障碍追踪和升级机制 |
| 复盘报告已审核 | Sprint复盘报告经人类审核确认 | 补充分析或修改行动项 |

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
| 所有上游数据全部缺失 | 输出最小化Sprint框架模板，标注全部为待填充，要求用户提供基础信息后重新执行 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 sprint-retrospective-report（Sprint复盘报告）
- v4.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
- v5.0: 核心原则替换为编排理念原则，新增异常处理表
