---
name: iteration-orchestrator
description: 当需要规划迭代周期或调整产品优先级时使用。迭代决策指挥官，调度 iteration-decision 子Skill执行。关键词：迭代决策、Backlog优化、优先级调整、迭代复盘、迭代规划、需求重组、RICE评分、迭代管理。本编排器为透传编排器，仅调度1个子Skill(iteration-decision)，上层编排器也可直接调用iteration-decision。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "orchestrator"
  version: "10.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "规划下一个迭代"
    - "调整一下优先级"
    - "优化一下Backlog"
    - "做一下迭代复盘"
---

# 迭代决策指挥官

## 核心原则

**数据驱动的优先级决策，平衡短期修复与长期价值**

迭代不是简单的需求排队，而是在有限资源下做出最优取舍。每一次优先级调整都是在短期修复和长期价值之间寻找平衡点，数据是决策的依据而非决策本身。

## 编排理念

1. **Backlog优化先行，优先级调整跟进**：先优化Backlog建立清晰的优先级基线，再基于触发事件调整，避免在混乱的Backlog上做调整
2. **复盘结论闭环到Backlog**：迭代复盘的改进建议必须回流到Backlog优化，形成"执行→复盘→优化"的持续改进闭环

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

本编排器为透传编排器，职责是提供统一入口、阶段总结和异常处理。上层编排器可直接调用iteration-decision子Skill，无需经过本编排器。

## Pipeline

```yaml
pipeline: iteration-orchestrator
version: 10.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/iteration-orchestrator.md

stages:
  - id: phase-1
    name: "迭代决策"
    depends_on: []
    skills: [iteration-decision]
    gate:
      condition: "iteration-decision输出文件已生成"
      fail_action: "按子Skill失败原因处理，必要时升级人类"
```

## 阶段执行计划

#### 调用 iteration-decision

```
Skill: iteration-decision
输入:
  requirement_pool: 项目管理系统（需求池）
  tech_debt: 代码质量平台（技术债务）
  monitoring_alerts: monitoring-pipeline → 告警数据（可选）
  user_feedback: 反馈系统（可选）
  current_sprint_plan: agile-sprint-planning → sprint_plan
  trigger_event: 监控系统/反馈系统
  resource_constraints: planning-resource → resource_plan
  change_request: 用户提供
  iteration_completion: agile-daily-sync → daily_sync
  quality_metrics: 测试平台/CI/CD
  team_feedback: Retro工具（可选）
  monitoring_data: monitoring-pipeline（可选）
输出: output/pm-monitoring/iteration-decision/
验证: 输出文件已生成且内容完整
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-monitoring/iteration-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-monitoring/ |
| 总结输出路径 | output/phase-reports/pm-monitoring/iteration-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: design-orchestrator（迭代决策完成，实现迭代需求变更）
  alternatives:
    - target: release-orchestrator
      reason: 迭代决策为直接发布
      condition: 迭代决策为紧急修复或小版本发布时
    - target: monitoring-orchestrator
      reason: 迭代后需加强监控
      condition: 迭代涉及核心功能变更，需加强上线后监控时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 输出文件已生成 | iteration-decision输出已生成 | 按子Skill失败原因处理，必要时升级人类 |
| 阶段总结已生成 | output/phase-reports/pm-monitoring/iteration-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 下游衔接

- 迭代决策完成 → design-orchestrator（实现需求变更）
- 紧急修复/小版本 → release-orchestrator
- 核心功能变更需监控 → monitoring-orchestrator

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 迭代计划调整确认 | iteration-decision 优先级调整方案生成完成 | 确认调整方案、资源重新分配和风险接受 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill执行失败 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充，继续执行并在输出中高亮标注 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
