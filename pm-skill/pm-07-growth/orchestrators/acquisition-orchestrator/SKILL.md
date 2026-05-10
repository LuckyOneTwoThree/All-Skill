---
name: acquisition-orchestrator
description: 当需要评估获客渠道或优化获客漏斗时使用。用户获取指挥官，包括19种渠道评估与分级、获客漏斗转化分析与优化。关键词：用户获取、获客渠道、漏斗优化、渠道评估、获客策略。
metadata:
  module: "产品增长与运营"
  sub-module: "获客"
  type: "orchestrator"
  version: "2.0"
---

# 用户获取指挥官

## 核心原则

**让正确的用户找到产品**

用户获取不是流量游戏，而是匹配游戏。目标不是更多用户，而是更多正确用户——那些能从产品中获得价值、同时为产品创造价值的用户。

## 执行步骤

1. **千人千面**：不同渠道、不同用户群体采用差异化获客策略，拒绝一刀切
2. **自动实验持续优化**：获客策略通过A/B测试持续验证和迭代，让数据决定最优方案
3. **实时优化**：基于实时漏斗数据动态调整获客策略，而非等待周期性报告
4. **数据驱动归因**：从渠道触达到用户激活全链路归因，明确每个渠道的真实贡献

## 任务调度

```
acquisition-channel → acquisition-optimize
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 定期评估（每周） | → acquisition-channel（渠道评估） |
| 渠道评估完成 / 漏斗数据更新 | → acquisition-optimize（漏斗优化） |
| 渠道配置变更 / 渠道表现异常 | → acquisition-channel（重新评估） |

### 数据流转

```
[渠道数据 + 漏斗数据]
       ↓
acquisition-channel
       ↓ channel_assessment (channels / primary_channels / test_channels / observation_channels)
acquisition-optimize
       ↓ funnel_optimization (funnel_analysis / optimization_suggestions / ab_test_designs)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-growth/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| 渠道评估完成 | 19种渠道数据已收集，分级报告已生成 | 补充缺失渠道数据 |
| 漏斗优化方案已生成 | 获客漏斗各层转化分析完成，优化建议已输出 | 延长分析周期或扩大数据范围 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 渠道策略确认 | 渠道评估完成，需调整资源分配 | 确认主力渠道、测试渠道和观察渠道的划分及预算分配 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
