---
name: diagnosis-orchestrator
description: 当需要诊断产品健康度或追踪竞品动态时使用。智能诊断指挥官，调度 diagnosis-health、diagnosis-competition、competitor-monitoring-report、product-sunset-plan 子Skill执行。关键词：智能诊断、健康度评分、竞品追踪、问题归因、MTTR、竞品监控、产品下线、产品诊断、问题排查。
metadata:
  module: "产品监控与迭代"
  sub-module: "问题诊断"
  type: "orchestrator"
  version: "10.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "诊断一下产品健康度"
    - "追踪一下竞品动态"
    - "排查产品问题"
    - "评估是否需要下线产品"
---

# 智能诊断指挥官

## 核心原则

**快速定位问题根因，减少MTTR**

诊断的价值不在于产出报告，而在于缩短从问题发现到根因定位的时间。每多一分钟不确定，就多一分钟的风险暴露和资源浪费。

## 编排理念

1. **健康度先行，竞品跟进**：先诊断自身健康度定位问题，再追踪竞品动态寻找外部原因，内外结合才能完整归因
2. **诊断数据驱动竞品应对**：健康度诊断的瓶颈结论直接决定竞品追踪的重点方向和应对策略优先级

## 编排协议

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 编排协议。

## Pipeline

```yaml
pipeline: diagnosis-orchestrator
version: 10.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/diagnosis-orchestrator.md

stages:
  - id: phase-1
    name: "健康度诊断"
    depends_on: []
    skills: [diagnosis-health]
    parallel_with: [phase-2]
    gate:
      condition: "健康度评分偏差±10%以内"
      fail_action: "校准评分模型或补充数据"

  - id: phase-2
    name: "竞品追踪"
    skills: [diagnosis-competition]
    parallel_with: [phase-1]
    gate:
      condition: "竞品动态已追踪"
      fail_action: "补充竞品数据源或延长追踪周期"

  - id: phase-3
    name: "竞品监控报告"
    depends_on: [phase-2]
    skills: [competitor-monitoring-report]
    gate:
      condition: "竞品监控报告经人类审核确认"
      fail_action: "补充分析或修改应对建议"

  - id: phase-4
    name: "产品下线方案"
    depends_on: [phase-1]
    skills: [product-sunset-plan]
    trigger: 产品下线需求
    gate:
      condition: "产品下线方案经人类审核确认"
      fail_action: "补充分析或修改迁移方案"
```

## 阶段执行计划

#### 调用 diagnosis-health

```
Skill: diagnosis-health
输入:
  performance_data: APM/监控系统
  availability_data: 监控系统
  user_satisfaction: 反馈系统
  business_metrics: 数据分析平台
  competitor_dynamics: diagnosis-competition → 竞品报告（可选）
输出: output/pm-monitoring/diagnosis-health/
验证: 数据采集完整率≥90%；评分计算准确性；趋势预测偏差±10%；瓶颈识别覆盖率≥90%
模式: 🤖→👤
```

#### 调用 diagnosis-competition

```
Skill: diagnosis-competition
输入:
  competitor_data: 竞品监控系统
  self_data: 产品数据平台
  market_data: 行业报告（可选）
  historical_tracking: diagnosis-competition → 历史报告（可选）
输出: output/pm-monitoring/diagnosis-competition/
验证: 竞品覆盖完整性≥90%；功能变更识别及时性≤7天；策略可执行性≥80%
模式: 🤖→👤
```

#### 调用 competitor-monitoring-report

```
Skill: competitor-monitoring-report
输入:
  competitor_tracking: diagnosis-competition
  competitor_analysis: market-competitor-analysis（可选）
  monitoring_period: 用户提供（可选）
输出: output/pm-monitoring/competitor-monitoring-report/
验证: 动态覆盖完整（产品/市场/舆论3维度均有分析）；威胁评估有依据；应对建议可执行
模式: 🤖→👤
```

#### 调用 product-sunset-plan

```
Skill: product-sunset-plan
输入:
  health_diagnosis: diagnosis-health
  retention_data: retention-management（可选）
  sunset_target: 用户提供（下线对象）
  sunset_reason: 用户提供（下线原因）
输出: output/pm-monitoring/product-sunset-plan/
验证: 影响评估完整（用户/收入/品牌3维度）；迁移方案可行；数据处置合规；时间线可执行
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-monitoring/diagnosis-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-monitoring/ |
| 总结输出路径 | output/phase-reports/pm-monitoring/diagnosis-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: iteration-orchestrator（诊断完成，根据诊断结论调整迭代计划）
  alternatives:
    - target: monitoring-orchestrator
      reason: 诊断结论为需建立监控预警
      condition: 诊断发现产品缺乏有效监控覆盖时
    - target: growth-orchestrator
      reason: 诊断结论为增长瓶颈，需增长策略
      condition: 健康度下降主因为增长乏力时
    - target: iteration-orchestrator
      reason: 健康度极低且无改善空间，需制定迭代改进或下线方案
      condition: 健康度评分<30分且连续3个周期无改善时
  special_cases:
    - target: monitoring-orchestrator
      reason: 仅需健康度诊断，无需完整诊断编排
      condition: 已有竞品数据，仅需产品健康检查时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 健康度评分偏差±10% | diagnosis-health输出文件已生成且非空 | 校准评分模型或补充数据 |
| 竞品动态已追踪 | diagnosis-competition输出文件已生成且非空 | 补充竞品数据源或延长追踪周期 |
| 竞品监控报告已审核 | 竞品监控报告经人类审核确认 | 补充分析或修改应对建议 |
| 产品下线方案已审核 | 产品下线方案经人类审核确认 | 补充分析或修改迁移方案 |
| 质量验收 | 如需验收，转交 release-orchestrator 执行 quality-acceptance | — |
| 阶段总结已生成 | output/phase-reports/pm-monitoring/diagnosis-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 下游衔接

- 诊断完成 → iteration-orchestrator（调整迭代计划）
- 缺乏监控覆盖 → monitoring-orchestrator
- 增长乏力 → growth-orchestrator
- 健康度极低 → iteration-orchestrator（制定迭代改进或下线方案）
- 仅需健康检查 → monitoring-orchestrator

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 健康度评分校准 | 健康度评分与实际感知偏差超过±10% | 确认评分模型校准方案和权重调整 |
| 竞品监控报告确认 | 竞品监控报告生成完成 | 确认威胁评估和应对建议 |
| 产品下线方案确认 | 产品下线方案生成完成 | 确认下线时间线和用户迁移方案 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 健康度评分模型偏差过大（>±15%） | 暂停自动诊断，要求人工校准评分模型权重后重新运行 |
| 竞品数据源不可用 | 基于最近一次历史报告生成快照分析，标注"数据源不可用，基于历史数据" |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
