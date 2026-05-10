---
name: revenue-orchestrator
description: 商业化指挥官。当需要优化付费转化或提升收入时使用，包括付费漏斗分析与瓶颈定位、NRR追踪与流失预警、升级与增购策略设计。关键词：商业化、付费漏斗、NRR、增购策略、收入优化。
metadata:
  module: "产品增长与运营"
  sub-module: "变现"
  type: "orchestrator"
  version: "2.0"
---

# 商业化指挥官

## 核心原则

**商业化是用户价值和商业价值的双赢**

好的商业化不是从用户身上榨取价值，而是为用户创造更多价值的同时获得合理回报。用户愿意付费是因为产品让他们的生活或工作变得更好，而非因为他们被设计成了付费陷阱。

## 执行步骤

1. **千人千面**：不同用户分群采用差异化定价和升级策略，基于使用行为和付费意愿匹配最优方案
2. **自动实验持续优化**：定价策略和升级方案通过A/B测试验证，让数据决定最优商业化路径
3. **实时优化**：基于实时付费漏斗和NRR数据动态调整商业化策略
4. **数据驱动归因**：从使用行为到付费转化全链路归因，量化每个触点的商业化贡献

## 任务调度

```
revenue-funnel → revenue-nrr → revenue-upsell
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 每日执行 / 付费漏斗数据更新 | → revenue-funnel（付费漏斗分析） |
| 收入数据更新 | → revenue-nrr（NRR追踪预警） |
| 用户使用数据更新 | → revenue-upsell（升级转化） |

### 数据流转

```
[付费漏斗数据]
       ↓
revenue-funnel
       ↓ revenue_funnel (funnel / bottlenecks / optimization_suggestions)
revenue-nrr
       ↓ nrr_tracking (current_nrr / trend / churn_warnings / expansion_opportunities)
revenue-upsell
       ↓ upsell_automation (upgrade_signals / personalized_offers / ab_tests)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-growth/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| 付费漏斗分析完成 | 注册到付费全链路转化分析完成，瓶颈已识别 | 补充漏斗步骤定义或数据 |
| NRR追踪已建立 | NRR计算和趋势追踪正常运行，流失预警和扩张机会已识别 | 完善收入数据采集 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 定价策略确认 | 付费漏斗分析和NRR追踪完成 | 确认定价调整、升级方案和资源分配策略 |
