---
name: diagnosis-orchestrator
description: 当需要诊断产品健康度或追踪竞品动态时使用。智能诊断指挥官，包括产品健康度多维度评分与校准、竞品功能变更追踪与应对策略。关键词：智能诊断、健康度评分、竞品追踪、问题归因、MTTR。
metadata:
  module: "产品监控与迭代"
  sub-module: "问题诊断"
  type: "orchestrator"
  version: "3.0"
---

# 智能诊断指挥官

## 核心原则

**快速定位问题根因，减少MTTR**

诊断的价值不在于产出报告，而在于缩短从问题发现到根因定位的时间。每多一分钟不确定，就多一分钟的风险暴露和资源浪费。

## 执行步骤

1. **主动监控而非被动响应**：每日定时诊断+监控异常触发，而非等人工发起诊断
2. **归因分层**：健康度诊断按"性能→可用性→满意度→业务"多维度分层，竞品追踪按"功能变更→优劣势→应对策略"分层推进
3. **决策规则前置**：健康度评分偏差阈值、竞品重大更新判定标准在系统初始化时定义
4. **持续学习**：诊断结论和竞品应对效果持续反馈，优化诊断模型和应对策略库

## 任务调度

```
diagnosis-health → diagnosis-competition → competitor-monitoring-report
```

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 产品/功能下线决策 | → product-sunset-plan（产品下线方案） |

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 每日定时 / 监控异常触发 / 迭代里程碑 | → diagnosis-health（健康度诊断） |
| 每周定时 / 竞品重大更新 / 市场报告发布 | → diagnosis-competition（竞品动态追踪） |
| 竞品追踪完成 | → competitor-monitoring-report（竞品监控报告汇总） |
| 产品下线决策 | → product-sunset-plan（产品下线方案） |

### 数据流转

```
[性能/可用性/满意度/业务数据]
       ↓
diagnosis-health
       ↓ overall_score / dimension_scores / trend_analysis / bottlenecks / recommendations
[竞品数据 + 自身数据 + 市场数据]
       ↓
diagnosis-competition
       ↓ feature_changes / advantage_changes / response_strategy / effect_tracking
competitor-monitoring-report
       ↓ competitor_monitoring (dynamics / feature_changes / threat_assessment / response_recommendations)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-monitoring/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| 健康度评分偏差±10% | 健康度评分与实际状态偏差在可控范围内 | 校准评分模型或补充数据 |
| 竞品动态已追踪 | 竞品功能变更已识别，优劣势分析已完成 | 补充竞品数据源或延长追踪周期 |
| 竞品监控报告已审核 | 竞品监控报告经人类审核确认 | 补充分析或修改应对建议 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 健康度评分校准 | 健康度评分与实际感知偏差超过±10% | 确认评分模型校准方案和权重调整 |
| 竞品监控报告确认 | 竞品监控报告生成完成 | 确认威胁评估和应对建议 |
| 产品下线方案确认 | 产品下线方案生成完成 | 确认下线时间线和用户迁移方案 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 competitor-monitoring-report（竞品监控报告）、product-sunset-plan（产品下线方案）
