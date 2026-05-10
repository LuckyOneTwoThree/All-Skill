---
name: experiment-orchestrator
description: 当需要设计或执行A/B测试实验时使用。实验验证指挥官，包括实验方案自动设计、实验执行与统计显著性分析。关键词：A/B测试、实验设计、统计显著性、实验执行、数据实验。
metadata:
  module: "产品度量运营"
  sub-module: "实验验证"
  type: "orchestrator"
  version: "3.0"
---

# 实验设计指挥官

## 核心原则

**实验是学习的最快方式**

每一个实验都是一次有控制的探索，目标不是证明假设正确，而是以最快速度获得可靠的学习。实验的价值在于学习速度，而非实验数量。

## 执行步骤

1. **全量分析**：实验结果基于全量数据分析，统计检验使用完整样本，不依赖中间抽样推断
2. **实时感知**：实验运行期间持续监控，样本量、护栏指标、新奇效应实时追踪
3. **自动归因**：实验结果自动进行多维下钻分析，识别异质性效应和新奇效应
4. **决策规则显式化**：统计显著且稳定可考虑提前终止、护栏指标下降触发告警、新奇效应显著则延长周期，规则前置而非事后判断

## 任务调度

```
experiment-design → experiment-execution → experiment-report
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 新实验需求 | → experiment-design（假设结构化、指标选择、样本量计算） |
| 实验上线运行 | → experiment-execution（持续监控模式） |
| 实验结束 | → experiment-execution（结果分析模式） |
| 实验结果分析完成 | → experiment-report（报告生成） |

### 数据流转

```
[假设陈述 + 可用流量 + 指标体系]
       ↓
experiment-design
       ↓ ab_test_design (hypothesis / primary_metric / guardrail_metrics / sample_size / traffic_split / termination_conditions)
experiment-execution
       ↓ ab_test_result (conclusion / primary_metric / guardrail_metrics / heterogeneous_effects / novelty_check / decision_recommendation)
experiment-report
       ↓ experiment_report (statistical_conclusion / effect_analysis / action_recommendation)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-metrics-ops/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| 实验方案人类已审核 | 实验设计经人类审核确认 | 阻止实验上线，修改后重新审核 |
| 统计显著性已判断 | 样本量充足且统计检验完成 | 延长实验周期或扩大流量 |
| 实验报告已审核 | 实验报告经人类审核确认 | 补充分析或修改结论 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 实验方案审核 | 实验设计完成 | 审核假设合理性、指标选择、分流方案 |
| 全量/终止决策 | 实验结果分析完成 | 决定全量发布、终止实验或延长周期 |
| 实验报告确认 | 实验报告生成完成 | 确认报告结论和行动建议 |

## 决策规则

| 条件 | Action |
|------|--------|
| 样本量达到100% | 立即触发结果分析 |
| 统计显著（p < 0.05）且稳定 | 考虑提前终止 |
| 护栏指标显著下降 | 触发告警，考虑终止 |
| 新奇效应显著 | 延长实验周期 |
| 实验组持续负向 | 考虑提前终止 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 experiment-report（A/B测试报告）
