---
name: analysis-orchestrator
description: 当需要进行数据异常检测、漏斗分析或留存分析时使用。数据分析指挥官，调度analysis-anomaly/funnel/retention/data-analysis-report。关键词：数据分析、异常检测、漏斗分析、留存分析、Aha Moment、看数据、数据不好、数据洞察。
metadata:
  module: "产品度量运营"
  sub-module: "数据分析"
  type: "orchestrator"
  version: "7.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我分析一下数据"
    - "数据有异常，排查一下"
    - "做一下漏斗分析"
    - "分析一下用户留存"
    - "数据不好，找找原因"
---

# 数据分析指挥官

## 核心原则

**用数据减少决策中的猜测**

数据分析的价值不在于产出报告，而在于将不确定性转化为可量度的风险，将直觉判断转化为证据支撑的决策。

## 编排理念

1. **检测先行，分析跟进，报告收口**：异常检测7×24运行，漏斗和留存按需触发，报告整合收口
2. **每个分析结果必须可行动**：没有行动建议的分析结果不传递到下游
3. **异常即阻断，其他按序执行**：P0异常立即阻断当前流程，其他阶段按序执行

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: analysis-orchestrator
version: 7.1

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-metrics-ops/analysis-orchestrator.md

stages:
  - id: phase-1
    name: "异常检测"
    depends_on: []
    skills: [analysis-anomaly]
    gate:
      condition: "异常检测Pipeline持续运行，无中断"
      fail_action: "立即修复检测Pipeline，启动备用监控"

  - id: phase-2
    name: "漏斗分析"
    parallel_with: [phase-3]
    skills: [analysis-funnel]
    gate:
      condition: "核心业务漏斗已定义且数据完整"
      fail_action: "补充漏斗定义，确保核心路径覆盖"

  - id: phase-3
    name: "留存分析"
    parallel_with: [phase-2]
    skills: [analysis-retention]
    gate:
      condition: "至少产出1个Aha Moment候选行为"
      fail_action: "扩大行为搜索范围或延长分析周期"

  - id: phase-4
    name: "数据分析报告"
    depends_on: [phase-1, phase-2, phase-3]
    skills: [data-analysis-report]
    gate:
      condition: "报告执行摘要完整，至少3条行动建议"
      fail_action: "补充分析或标注建议补充数据"
```

## 阶段执行计划

#### 调用 analysis-anomaly

```
Skill: analysis-anomaly
输入:
  metrics_system: metrics-system → metrics.json
  real_time_data: 数据仓库/实时计算平台
  alert_rules: 用户提供
  event_calendar: 用户提供（可选）
输出: output/pm-metrics-ops/analysis-anomaly/
验证: 异常检测覆盖所有关键指标；异常等级分类正确（P0/P1/P2）；根因分析有数据支撑；建议措施可操作
模式: 🤖
```

#### 调用 analysis-funnel

```
Skill: analysis-funnel
输入:
  funnel_definition: 用户提供
  event_data: 用户提供
  segment_config: 用户提供（可选）
  comparison_period: 用户提供（可选）
输出: output/pm-metrics-ops/analysis-funnel/
验证: 漏斗步骤定义完整、无遗漏；转化率计算基于全量数据；流失节点识别附带原因假设；多维下钻覆盖至少3个维度
模式: 🤖
```

#### 调用 analysis-retention

```
Skill: analysis-retention
输入:
  user_behavior_data: 用户提供
  segment_definition: 用户提供（可选）
  cohort_config: 用户提供（可选）
  baseline_date: 用户提供（可选）
输出: output/pm-metrics-ops/analysis-retention/
验证: 留存计算基于全量用户而非抽样；Cohort分析覆盖时间、渠道、行为三个维度；Aha Moment候选通过显著性检验；流失预警模型准确率>70%
模式: 🤖
```

#### 调用 data-analysis-report

```
Skill: data-analysis-report
输入:
  funnel_analysis: output/pm-metrics-ops/analysis-funnel/
  retention_analysis: output/pm-metrics-ops/analysis-retention/
  anomaly_detection: output/pm-metrics-ops/analysis-anomaly/
  decision_dace: decision-dace → decision_insight.json（可选）
  metrics_system: metrics-system → metrics_system.json（可选）
  analysis_time_range: 用户提供
  product_info: 用户提供（可选）
输出: output/pm-metrics-ops/data-analysis-report/
验证: 执行摘要包含3条关键发现+Top1建议；核心指标仪表盘完整；漏斗分析包含最大流失点和提升机会；留存分析包含生命周期阶段；每条洞察有数据事实+业务含义；行动建议至少3条，每条有优先级和验证方式；数据口径和局限性已说明
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-metrics-ops/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-metrics-ops/analysis-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: decision-orchestrator
    reason: 数据分析完成，将分析洞察转化为可执行决策
    input_mapping:
      analysis_output: "output/pm-metrics-ops/data-analysis-report/ → decision-dace输入"
  alternatives:
    - target: experiment-orchestrator
      reason: 分析发现需A/B测试验证的假设
      condition: 数据分析发现因果关系不确定，需实验验证时
    - target: iteration-orchestrator
      reason: 分析结论直接影响迭代优先级
      condition: 数据分析产出明确的迭代方向建议时
  special_cases: []
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 异常检测7×24运行 | 异常检测Pipeline持续运行，无中断 | 立即修复检测Pipeline，启动备用监控 |
| 漏斗核心路径覆盖 | 核心业务漏斗已定义且数据完整 | 补充漏斗定义，确保核心路径覆盖 |
| 留存Aha Moment候选已识别 | retention-analysis输出文件已生成且非空 | 扩大行为搜索范围或延长分析周期 |
| 数据洞察报告已生成 | 数据洞察报告文件已生成且非空 | 补充分析或标注"建议补充数据" |
| 阶段总结已生成 | output/phase-reports/pm-metrics-ops/analysis-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

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

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill输出校验失败 | 暂停下游阶段执行，输出校验失败报告，提示人类修正后重试当前阶段 |
| P0异常检测触发 | 立即中断当前阶段，优先处理P0异常，处理完成后恢复原流程 |
| 上游数据源不可用 | 按子Skill降级策略执行，记录降级信息，在最终输出中标注降级影响范围 |
| 分析结果无行动建议 | 阻断传递到下游，要求当前子Skill补充行动建议 |
| 人类决策超时未响应 | 暂停流程，保留当前阶段状态，支持人类恢复后从断点继续 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 data-analysis-report（数据分析报告）
- v4.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
- v5.0: 执行步骤原则替换为编排理念，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
