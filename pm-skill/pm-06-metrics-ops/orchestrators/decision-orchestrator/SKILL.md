---
name: decision-orchestrator
description: 数据驱动决策指挥官。当需要将数据分析结果转化为决策行动时使用，包括DACE决策循环执行、洞察转化为行动方案、数据驱动文化建设。关键词：数据决策、DACE循环、数据洞察、决策框架、数据文化。
metadata:
  module: "产品度量运营"
  sub-module: "决策闭环"
  type: "orchestrator"
  version: "2.0"
---

# 数据驱动决策指挥官

## 核心原则

**数据驱动决策，但决策权在人类**

数据的作用是照亮决策的盲区，而非替代决策者。DACE循环中，Define和Analyze由数据驱动，Conclude由人类决策，Execute由系统追踪——这是数据与人类的最优分工。

## 执行步骤

1. **全量分析**：决策依据基于全量数据分析，不依赖片段信息或直觉判断
2. **实时感知**：异常检测和实验结果即时触发决策流程，缩短从洞察到行动的时间
3. **自动归因**：洞察自动转化为决策选项，附带决策边界和置信度评估
4. **决策规则显式化**：data_decision可AI自动执行、data_reference需人类确认、human_decision由人类主导，决策边界规则前置

## 任务调度

```
decision-dace → decision-insight → decision-culture
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 每日定时 | → decision-culture（daily） |
| 每周定时 | → decision-culture（weekly）+ decision-dace（review） |
| 异常检测触发 | → decision-insight（异常分析）→ decision-dace（响应） |
| 实验结果产出 | → decision-insight（实验解读）→ decision-dace（决策） |

### 数据流转

```
[OKR追踪 + 异常检测 + 实验结果]
       ↓
decision-dace
       ↓ dace_status (current_phase / insights / action_taken / results_tracked)
decision-insight
       ↓ data_insight (narrative / action_options / decision_boundary / auto_execute_eligible)
decision-culture
       ↓ daily_summary / weekly_report / monthly_report
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-metrics-ops/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| DACE循环Define/Analyze完成 | 目标已定义、数据已分析、洞察已生成 | 补充数据或重新定义目标 |
| 洞察已转化为行动 | 每个洞察都有对应的决策选项和行动方案 | 标记为待处理，持续追踪 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Conclude阶段决策 | DACE循环进入Conclude阶段 | 审核分析结论，做出最终决策 |

## 决策边界管理

| 决策类型 | 说明 | 执行方式 |
|---------|------|---------|
| data_decision | 数据明确支持，可自动执行 | AI自动执行 + 事后报告 |
| data_reference | 数据供参考，人类决策 | 推送洞察，等待决策 |
| human_decision | 复杂决策，人类主导 | 提供分析，人类决策 |
