---
name: analysis-orchestrator
description: 当需要进行产品数据异常检测、漏斗分析或留存分析时使用。数据分析指挥官，最终产出可交付的数据洞察报告。关键词：数据分析、异常检测、漏斗分析、留存分析、Aha Moment、数据洞察报告。
metadata:
  module: "产品度量运营"
  sub-module: "数据分析"
  type: "orchestrator"
  version: "3.0"
---

# 数据分析指挥官

## 核心原则

**用数据减少决策中的猜测**

数据分析的价值不在于产出报告，而在于将不确定性转化为可量度的风险，将直觉判断转化为证据支撑的决策。

## 执行步骤

1. **全量分析**：不依赖抽样，对全量数据进行计算，确保分析结论的统计可靠性
2. **实时感知**：7×24小时异常检测运行，核心指标每小时健康检查，确保问题即时发现
3. **自动归因**：异常检测后自动执行归因流程——确认真实性、定位范围、关联外部事件、生成归因结论
4. **决策规则显式化**：P0异常即时推送+电话告警、P1异常2小时内通知、P2异常每日汇总、P3波动仅记录，规则前置而非事后判断

## 任务调度

```
analysis-anomaly → analysis-funnel → analysis-retention → data-analysis-report
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 定时（每小时） | → analysis-anomaly（核心指标健康检查） |
| 定时（每日） | → analysis-funnel + analysis-retention（全量分析） |
| 异常告警触发 | → analysis-anomaly → 定位问题后触发 funnel/retention 下钻 |
| 手动请求 | → 根据请求内容执行对应Pipeline |
| 分析完成 | → data-analysis-report（生成数据洞察报告） |

### 数据流转

```
[指标体系 + 实时数据流]
       ↓
analysis-anomaly
       ↓ anomaly_report (severity / attribution / scope / most_likely_cause / confidence / recommended_action)
analysis-funnel
       ↓ funnel_analysis (steps / overall_conversion / critical_drop)
analysis-retention
       ↓ retention_analysis (overall / cohort_trend / aha_moment_candidates / churn_risk)
data-analysis-report
       ↓ data_analysis_report (executive_summary / key_findings / recommendations)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-metrics-ops/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| 异常检测7×24运行 | 异常检测Pipeline持续运行，无中断 | 立即修复检测Pipeline，启动备用监控 |
| 漏斗核心路径覆盖 | 核心业务漏斗已定义且数据完整 | 补充漏斗定义，确保核心路径覆盖 |
| 留存Aha Moment候选已识别 | 至少产出1个Aha Moment候选行为 | 扩大行为搜索范围或延长分析周期 |
| 数据洞察报告已生成 | 报告执行摘要完整，至少3条行动建议 | 补充分析或标注"建议补充数据" |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| P0异常即时确认 | P0级异常检测触发 | 确认异常真实性，决定响应策略 |

## 决策规则

| 条件 | Action |
|------|--------|
| P0异常 | 即时推送 + 电话告警 |
| P1异常 | 2小时内Slack/企微通知 |
| P2异常 | 每日汇总报告 |
| P3波动 | 仅记录，不告警 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 data-analysis-report（数据分析报告）
