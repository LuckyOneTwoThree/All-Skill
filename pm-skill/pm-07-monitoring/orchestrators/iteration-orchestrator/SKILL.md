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

编排协议遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 统一标准。

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

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 阶段总结协议。

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-monitoring/ |
| 总结输出路径 | output/phase-reports/pm-monitoring/iteration-orchestrator.md |

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
