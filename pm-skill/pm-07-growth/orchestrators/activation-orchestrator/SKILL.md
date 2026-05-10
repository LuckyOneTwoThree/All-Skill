---
name: activation-orchestrator
description: 用户激活指挥官。当需要识别Aha Moment或设计Onboarding流程时使用，包括Aha Moment候选行为识别与验证、差异化Onboarding路径设计。关键词：用户激活、Aha Moment、Onboarding、新用户引导、激活策略。
metadata:
  module: "产品增长与运营"
  sub-module: "激活"
  type: "orchestrator"
  version: "2.0"
---

# 用户激活指挥官

## 核心原则

**Aha Moment是用户留存的起点**

用户激活的本质是帮助用户尽快到达Aha Moment——那个让用户感受到产品核心价值的瞬间。没有Aha Moment的激活只是流程完成，不是价值传递。

## 执行步骤

1. **千人千面**：不同用户分群采用差异化Onboarding路径，确保每类用户都能高效到达Aha Moment
2. **自动实验持续优化**：Aha Moment候选和Onboarding策略通过A/B测试持续验证，让数据决定最优路径
3. **实时优化**：基于实时激活数据动态调整Onboarding内容和序列
4. **数据驱动归因**：量化每个Onboarding步骤对激活的贡献，识别关键路径和流失节点

## 任务调度

```
activation-aha → activation-onboarding
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 产品重大更新 / 季度回顾 | → activation-aha（Aha Moment识别） |
| Aha Moment识别完成 / 用户分群更新 | → activation-onboarding（Onboarding优化） |
| 新用户留存数据积累完成 | → activation-aha（重新评估） |

### 数据流转

```
[用户行为数据 + 留存数据]
       ↓
activation-aha
       ↓ aha_moment (candidates / primary_aha / onboarding_recommendations)
activation-onboarding
       ↓ onboarding_optimization (current_effectiveness / segment_strategies / personalized_content / ab_tests)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-growth/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| Aha Moment候选已识别 | 至少产出1个Aha Moment候选行为，含留存提升和到达率数据 | 扩大行为搜索范围 |
| Onboarding策略已生成 | 各用户分群的Onboarding路径和内容已设计 | 补充分群数据或延长分析周期 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Aha Moment确认 | Aha Moment候选识别完成 | 确认主Aha Moment的选择和Onboarding路径设计 |
