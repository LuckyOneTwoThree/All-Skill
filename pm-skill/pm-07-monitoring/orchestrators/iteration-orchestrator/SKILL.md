---
name: iteration-orchestrator
description: 当需要规划迭代周期或调整产品优先级时使用。迭代决策指挥官，调度 iteration-backlog-grooming 和 iteration-retrospective 子Skill执行。关键词：迭代决策、Backlog优化、优先级调整、迭代复盘、迭代规划、需求重组、RICE评分、迭代管理。本编排器调度2个子Skill，分别负责Backlog整理（无跨模块依赖）和迭代回顾（依赖pm-08输出）。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "orchestrator"
  version: "11.0"
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

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 编排协议。

### 本编排器特有约定

本编排器调度2个子Skill：iteration-backlog-grooming（Backlog整理，无跨模块依赖）和 iteration-retrospective（迭代回顾，依赖pm-08输出）。两个子Skill形成清晰的单向数据流：Backlog整理 → agile-sprint-planning → 迭代回顾，彻底消除循环依赖。

## Pipeline

```yaml
pipeline: iteration-orchestrator
version: 11.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/iteration-orchestrator.md

stages:
  - id: phase-1
    name: "Backlog整理"
    depends_on: []
    skills: [iteration-backlog-grooming]
    gate:
      condition: "iteration-backlog-grooming输出文件已生成且prioritized_items非空"
      fail_action: "按子Skill失败原因处理，必要时升级人类"
  - id: phase-2
    name: "迭代回顾"
    depends_on: [phase-1]
    skills: [iteration-retrospective]
    gate:
      condition: "iteration-retrospective输出文件已生成"
      fail_action: "按子Skill失败原因处理，必要时升级人类"
```

## 阶段执行计划

#### 调用 iteration-backlog-grooming（phase-1）

```
Skill: iteration-backlog-grooming
输入:
  requirement_pool: 项目管理系统（需求池）
  tech_debt: 代码质量平台（技术债务）
  monitoring_alerts: monitoring-alert-detection → 告警数据（可选）
  user_feedback: 反馈系统（可选）
  resource_constraints: 用户提供（可选）
  quality_metrics: 测试平台/CI/CD（可选）
  monitoring_data: monitoring-alert-detection（可选）
输出: output/pm-monitoring/iteration-backlog-grooming/
验证: 输出文件已生成且 prioritized_items 非空
模式: 🤖→👤
说明: 无跨模块依赖，可独立执行。输出 prioritized_items 供 agile-sprint-planning 消费。
```

#### 调用 iteration-retrospective（phase-2）

```
Skill: iteration-retrospective
输入:
  current_sprint_plan: agile-sprint-planning → sprint_plan
  iteration_completion: agile-daily-sync → daily_sync
  resource_constraints: planning-resource → resource_plan（可选）
  trigger_event: 监控系统/反馈系统（可选）
  change_request: 用户提供（可选）
  quality_metrics: 测试平台/CI/CD
  team_feedback: Retro工具（可选）
  monitoring_data: monitoring-alert-detection（可选）
  monitoring_alerts: monitoring-alert-detection（可选）
输出: output/pm-monitoring/iteration-retrospective/
验证: 输出文件已生成且内容完整
模式: 👤↔🤖
说明: 依赖 pm-08 输出（agile-sprint-planning/sprint_plan, agile-daily-sync/daily_sync），单向依赖不构成循环。
```

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
  primary: design-orchestrator（迭代回顾完成，实现迭代需求变更）
  alternatives:
    - target: agile-sprint-planning
      reason: Backlog整理完成，进行Sprint规划
      condition: phase-1 iteration-backlog-grooming 完成后，prioritized_items 已生成
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
| phase-1 输出文件已生成 | iteration-backlog-grooming输出已生成且prioritized_items非空 | 按子Skill失败原因处理，必要时升级人类 |
| phase-2 输出文件已生成 | iteration-retrospective输出已生成 | 按子Skill失败原因处理，必要时升级人类 |
| 阶段总结已生成 | output/phase-reports/pm-monitoring/iteration-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 下游衔接

- Backlog整理完成 → agile-sprint-planning（消费 prioritized_items 进行Sprint规划）
- 迭代回顾完成 → design-orchestrator（实现需求变更）
- 紧急修复/小版本 → release-orchestrator
- 核心功能变更需监控 → monitoring-orchestrator

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Backlog整理结果确认 | iteration-backlog-grooming 优先级排序完成 | 确认优先级排序、重组建议是否采纳 |
| 迭代调整方案确认 | iteration-retrospective 优先级调整方案生成完成 | 确认调整方案、资源重新分配和风险接受 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill执行失败 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充，继续执行并在输出中高亮标注 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
