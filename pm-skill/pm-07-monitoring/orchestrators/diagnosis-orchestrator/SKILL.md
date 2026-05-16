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

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: diagnosis-orchestrator
version: 7.0

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

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-monitoring/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-monitoring/diagnosis-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: iteration-orchestrator
    reason: 诊断完成，根据诊断结论调整迭代计划
    input_mapping:
      diagnosis_output: "output/pm-monitoring/diagnosis-health/ + competitor-monitoring-report/ → iteration-decision输入"
  alternatives:
    - target: monitoring-orchestrator
      reason: 诊断结论为需建立监控预警
      condition: 诊断发现产品缺乏有效监控覆盖时
    - target: growth-orchestrator
      reason: 诊断结论为增长瓶颈，需增长策略
      condition: 健康度下降主因为增长乏力时
    - target: product-sunset-plan
      reason: 健康度极低且无改善空间，需制定下线方案
      condition: 健康度评分<30分且连续3个周期无改善时
  special_cases:
    - target: diagnosis-health
      reason: 仅需健康度诊断，无需完整诊断编排
      condition: 已有竞品数据，仅需产品健康检查时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 健康度评分偏差±10% | diagnosis-health-score输出文件已生成且非空 | 校准评分模型或补充数据 |
| 竞品动态已追踪 | diagnosis-competitor-track输出文件已生成且非空 | 补充竞品数据源或延长追踪周期 |
| 竞品监控报告已审核 | 竞品监控报告经人类审核确认 | 补充分析或修改应对建议 |
| 产品下线方案已审核 | 产品下线方案经人类审核确认 | 补充分析或修改迁移方案 |
| 质量验收 | 如需验收，转交 monitoring-orchestrator 执行 quality-acceptance | — |
| 阶段总结已生成 | output/phase-reports/pm-monitoring/diagnosis-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 下游衔接

- 诊断完成 → iteration-orchestrator（调整迭代计划）
- 缺乏监控覆盖 → monitoring-orchestrator
- 增长乏力 → growth-orchestrator
- 健康度极低 → product-sunset-plan
- 仅需健康检查 → diagnosis-health

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

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 competitor-monitoring-report（竞品监控报告）、product-sunset-plan（产品下线方案）
- v4.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
- v5.0: 执行步骤替换为编排理念，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v7.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v8.0: 更新子Skill下游引用——monitoring-anomaly/monitoring-dashboard/monitoring-escalation → monitoring-pipeline，iteration-backlog/iteration-prioritization → iteration-decision
- v9.0: 新增 quality-acceptance（质量验收）——从pm-05迁移；Pipeline新增quality-acceptance触发阶段；阶段执行计划新增quality-acceptance调用；阶段卡口新增质量验收报告已审核；人类决策点新增质量验收放行决策
- v10.0: 移除 quality-acceptance——统一归属 monitoring-orchestrator，消除跨编排器重复调度；Pipeline移除quality-acceptance触发阶段；阶段执行计划移除quality-acceptance调用；阶段卡口新增质量验收转交说明；新增下游衔接推荐
