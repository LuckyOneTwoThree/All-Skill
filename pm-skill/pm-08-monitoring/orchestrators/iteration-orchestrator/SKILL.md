---
name: iteration-orchestrator
description: 当需要规划迭代周期或调整产品优先级时使用。迭代决策指挥官，包括Backlog持续优化与关联分析、优先级数据驱动调整、迭代复盘与持续改进。关键词：迭代决策、Backlog优化、优先级调整、迭代复盘、迭代规划。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "orchestrator"
  version: "2.0"
---

# 迭代决策指挥官

## 核心原则

**数据驱动的优先级决策，平衡短期修复与长期价值**

迭代不是简单的需求排队，而是在有限资源下做出最优取舍。每一次优先级调整都是在短期修复和长期价值之间寻找平衡点，数据是决策的依据而非决策本身。

## 执行步骤

1. **主动监控而非被动响应**：Backlog持续优化而非迭代前才整理，优先级调整基于监控数据触发而非人工发起
2. **归因分层**：Backlog优化按"问题优先级→关联分析→重组建议"分层，优先级调整按"变更影响→调整方案→风险评估"分层
3. **决策规则前置**：优先级评分标准、调整触发条件、风险容忍阈值在迭代启动时定义
4. **持续学习**：迭代复盘结论反馈到Backlog优化，形成持续改进循环

## 任务调度

```
iteration-backlog → iteration-prioritization → iteration-retrospective
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 迭代启动 / Backlog评审前 / 重大变更后 | → iteration-backlog（Backlog优化） |
| 监控异常 / 重大反馈 / 战略变化 / 资源变化 | → iteration-prioritization（优先级调整） |
| 迭代结束 | → iteration-retrospective（迭代复盘） |

### 数据流转

```
[需求池 + 技术债务 + 告警 + 反馈]
       ↓
iteration-backlog
       ↓ prioritized_items / linked_issues / technical_debt_impact / reorganization_suggestions
[迭代计划 + 触发事件 + 资源]
       ↓
iteration-prioritization
       ↓ impact_assessment / adjustment_options / risk_assessment / communication_draft
[迭代数据 + 质量指标 + 反馈]
       ↓
iteration-retrospective
       ↓ summary / metrics_analysis / problem_identification / improvement_suggestions
       ↓ (循环回到 iteration-backlog)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-monitoring/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| Backlog已优化 | 问题优先级评估完成，关联分析完成，重组建议已生成 | 补充需求分析或延长优化周期 |
| 优先级调整方案已生成 | 变更影响评估完成，调整方案和风险评估已输出 | 补充影响分析数据 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 迭代计划调整确认 | 优先级调整方案生成完成 | 确认调整方案、资源重新分配和风险接受 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
