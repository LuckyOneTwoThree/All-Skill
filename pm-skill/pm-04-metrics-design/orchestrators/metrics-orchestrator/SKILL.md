---
name: metrics-orchestrator
description: 当需要构建产品度量体系时使用。产品度量设计子模块指挥官，包括指标体系自动构建、埋点方案自动生成、Dashboard自动配置。关键词：度量设计、指标体系、埋点方案、Dashboard配置。
metadata:
  module: "产品度量设计"
  sub-module: "度量设计"
  type: "orchestrator"
  version: "2.0"
---

# 产品度量设计指挥官

## 核心原则

用数据减少决策中的猜测，而非用数据为决策做背书。

## 执行步骤

1. **全量分析**：对所有可用数据进行系统性分析，不遗漏关键维度
2. **实时感知**：指标体系设计支持实时监控和快速响应
3. **自动归因**：异常波动自动归因到具体原因，减少人工排查
4. **决策规则显式化**：每个告警和升级条件都有明确的量化规则

## 任务调度

```
metrics-system → tracking-plan → metrics-dashboard
```

| 阶段 | 任务 | 执行模式 |
|------|------|----------|
| 1 | metrics-system | 🤖→👤 AI建议，人类审批 |
| 2 | tracking-plan | 🤖→👤 AI建议，人类审批 |
| 3 | metrics-dashboard | 🤖→👤 AI建议，人类审批 |

### 数据流转

```
[产品信息 + OKR + 商业模式 + 已有指标]
       ↓
metrics-system
       ↓ metric_system (north_star / l1_metrics / l2_metrics / actionable_metrics / vanity_alerts)
tracking-plan
       ↓ tracking_plan (events / properties / metrics_to_track / prd_consistency)
metrics-dashboard
       ↓ dashboards (strategic / tactical / operational) / alerts / configuration_files
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-metrics-design/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 指标体系完成 | 北极星指标人类已选择 | 北极星指标必须人类决策，AI只提供候选和分析 |
| 埋点方案完成 | 埋点方案人类已审核 | 业务逻辑正确性和隐私合规性必须人类确认 |
| Dashboard完成 | Dashboard布局人类已确认 | 布局合理性和告警阈值需人类审核 |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 北极星指标选择 | AI推荐3个候选北极星指标，人类选择最终指标 |
| 埋点方案审核 | AI生成埋点方案，人类审核业务逻辑和隐私合规 |
| Dashboard布局确认 | AI配置Dashboard，人类确认布局和告警阈值 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
