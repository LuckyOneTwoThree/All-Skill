---
name: growth-orchestrator
description: 当需要制定增长策略或系统化推进增长时使用。增长策略总指挥官，先诊断增长模式，再按需调度获客/激活/留存/变现子编排器。关键词：增长策略、增长模式、AARRR、增长飞轮、增长体系、用户增长、增长瓶颈、增长诊断。
metadata:
  module: "产品增长与运营"
  sub-module: "增长模式"
  type: "orchestrator"
  version: "8.0"
  domain_tags: ["电商", "社交", "游戏", "教育", "通用"]
  trigger_examples:
    - "帮我制定增长策略"
    - "用户增长遇到瓶颈"
    - "诊断一下增长问题"
    - "建立增长体系"
---

# 增长策略总指挥官

## 核心原则

**先诊断模式，再分发执行**

增长不是盲目堆渠道，而是先搞清楚产品适合哪种增长模式，再把资源精准投入到最高杠杆的环节。增长模式决定了获客、激活、留存、变现的策略组合。

## 编排理念

1. **模式先行**：先诊断增长模式（PLG/SLG/MLG/混合），再决定各环节策略
2. **杠杆优先**：基于飞轮模型识别当前最高杠杆环节，集中资源突破
3. **数据驱动归因**：从增长模式到各环节全链路归因，量化每个动作的贡献
4. **闭环迭代**：增长策略通过数据持续验证和迭代

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: growth-orchestrator
version: 8.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/growth-orchestrator.md

stages:
  - id: phase-1
    name: "增长模式诊断"
    depends_on: []
    skills: [growth-model]
    gate:
      condition: "增长模式已确定，飞轮模型已构建"
      fail_action: "补充产品特征和用户数据"

  - id: phase-2
    name: "获客优化"
    depends_on: [phase-1]
    skills: [acquisition-orchestrator]
    trigger: 获客为瓶颈
    gate:
      condition: "渠道评估完成且漏斗优化方案已生成"
      fail_action: "补充缺失渠道数据或延长分析周期"

  - id: phase-3
    name: "激活优化"
    depends_on: [phase-1]
    skills: [activation-orchestrator]
    trigger: 激活为瓶颈
    gate:
      condition: "Aha Moment候选已识别且Onboarding策略已生成"
      fail_action: "扩大行为搜索范围或补充分群数据"

  - id: phase-4
    name: "留存优化"
    depends_on: [phase-1]
    skills: [retention-orchestrator]
    trigger: 留存为瓶颈
    gate:
      condition: "流失预警模型已构建且用户分层已完成"
      fail_action: "优化模型或补充训练数据"

  - id: phase-5
    name: "变现优化"
    depends_on: [phase-1]
    skills: [revenue-orchestrator]
    trigger: 变现为瓶颈
    gate:
      condition: "付费漏斗分析完成且NRR追踪已建立"
      fail_action: "补充漏斗步骤定义或数据"

  - id: phase-6
    name: "增长策略报告"
    depends_on: [phase-1, phase-2, phase-3, phase-4, phase-5]
    skills: [growth-strategy-report]
    gate:
      condition: "增长策略报告经人类确认"
      fail_action: "调整策略方向和执行路线图"

  - id: phase-7
    name: "GTM策略"
    depends_on: [phase-1]
    skills: [gtm-strategy]
    trigger: 新产品上市/市场拓展
    gate:
      condition: "GTM策略经人类确认"
      fail_action: "确认上市路径和渠道策略"

  - id: phase-8
    name: "运营手册"
    depends_on: [phase-1]
    skills: [product-operations-manual]
    trigger: 运营手册制定需求
    gate:
      condition: "运营手册经人类确认"
      fail_action: "确认运营SOP和应急流程"
```

## 阶段执行计划

### 阶段1：增长模式诊断

#### 调用 growth-model

```
Skill: growth-model
输入:
  product_features: 用户提供（产品特征）
  user_data: analysis-retention → retention_analysis.yaml
  business_model: 用户提供（商业模式）
输出: output/pm-growth/growth-model/
验证: 北极星指标与≥1个OKR Objective直接关联；增长模型包含≥3个可量化变量；增长飞轮包含≥4个节点且形成闭环；瓶颈约束识别≤5个，每个有量化影响评估
模式: 🤖→👤
```

### 阶段2：瓶颈环节优化（条件分支）

根据阶段1诊断的瓶颈环节，调度对应的子编排器。

#### 调用 acquisition-orchestrator

```
Skill: acquisition-orchestrator
输入:
  growth_model: output/pm-growth/growth-model/
  channel_data: 用户提供
  funnel_data: 用户提供
输出: output/pm-growth/acquisition-analysis/
验证: 渠道评估覆盖19种渠道；获客漏斗各层转化分析完成，优化建议已输出
模式: 🤖→👤
```

#### 调用 activation-orchestrator

```
Skill: activation-orchestrator
输入:
  growth_model: output/pm-growth/growth-model/
  user_behavior_data: 用户提供
  retention_data: analysis-retention → retention_analysis.yaml
输出: output/pm-growth/activation-aha/、output/pm-growth/activation-onboarding/
验证: Aha Moment候选已识别；Onboarding策略已生成
模式: 🤖→👤
```

#### 调用 retention-orchestrator

```
Skill: retention-orchestrator
输入:
  growth_model: output/pm-growth/growth-model/
  user_behavior_data: 用户提供
  churn_history: 用户提供（流失历史数据）
输出: output/pm-growth/retention-management/
验证: 流失预警模型已构建；用户分层已完成
模式: 🤖→👤
```

#### 调用 revenue-orchestrator

```
Skill: revenue-orchestrator
输入:
  growth_model: output/pm-growth/growth-model/
  payment_funnel_data: 用户提供（付费漏斗数据）
  revenue_data: 用户提供（收入数据）
输出: output/pm-growth/revenue-funnel/、output/pm-growth/revenue-nrr/、output/pm-growth/revenue-upsell/
验证: 付费漏斗分析完成；NRR追踪已建立
模式: 🤖→👤
```

> **多瓶颈场景**：若多个环节均为瓶颈，按飞轮顺序依次调度子编排器（获客→激活→留存→变现）。

### 阶段3：增长策略报告

#### 调用 growth-strategy-report

```
Skill: growth-strategy-report
输入:
  growth_model: output/pm-growth/growth-model/
  acquisition_plan: output/pm-growth/acquisition-analysis/（可选）
  activation_plan: output/pm-growth/activation-aha/（可选）
  retention_plan: output/pm-growth/retention-management/（可选）
  revenue_plan: output/pm-growth/revenue-funnel/（可选）
  business_goal: 用户提供（可选）
输出: output/pm-growth/growth-strategy-report/
验证: 飞轮模型完整性（至少3个节点+2条因果关系）；策略与瓶颈一致；路线图可执行；漏斗数据完整（AARRR至少3个环节有数据）
模式: 🤖→👤
```

### 附加阶段（按需触发）

#### 调用 gtm-strategy

```
Skill: gtm-strategy
输入:
  positioning: positioning-strategy（可选）
  business_model: business-model-canvas（可选）
  pricing: business-pricing（可选）
  growth_model: output/pm-growth/growth-model/
  product_info: 用户提供
输出: output/pm-growth/gtm-strategy/
验证: ICP画像具体（至少包含行业、规模、角色3个维度）；上市路径有依据；渠道预算可执行；成功指标可量化
模式: 🤖→👤
```

#### 调用 product-operations-manual

```
Skill: product-operations-manual
输入:
  growth_model: output/pm-growth/growth-model/（可选）
  activation_strategy: output/pm-growth/activation-onboarding/（可选）
  retention_strategy: output/pm-growth/retention-management/（可选）
  revenue_strategy: output/pm-growth/revenue-funnel/（可选）
  product_info: 用户提供
输出: output/pm-growth/product-operations-manual/
验证: SOP可执行；分层策略完整（至少覆盖新/活跃/沉默/流失4类用户）；应急流程可操作（P0-P3均有响应SLA和升级路径）；模板可直接使用
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-growth/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-growth/growth-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: experiment-orchestrator
    reason: 增长策略制定完成，建议进入实验验证阶段，量化验证增长方案效果
    input_mapping:
      growth_output: "output/pm-growth/growth-strategy-report/ → experiment-design输入"
  alternatives:
    - target: release-orchestrator
      reason: 如增长方案已验证，直接全量发布
      condition: 增长方案已有充分数据支撑，无需实验验证时
    - target: growth-orchestrator
      reason: 如是新产品上市，进入GTM策略阶段（growth-orchestrator内部phase-7）
      condition: 增长诊断结论为新产品需上市时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 增长模式诊断完成 | growth-model输出文件已生成且非空 | 补充产品特征和用户数据 |
| 瓶颈环节已识别 | growth-bottleneck输出文件已生成且非空 | 延长分析周期或扩大数据范围 |
| 增长策略报告已确认 | 增长策略报告经人类确认 | 调整策略方向和执行路线图 |
| 阶段总结已生成 | output/phase-reports/pm-growth/growth-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 增长模式确认 | growth-model诊断完成 | 确认最终增长模式（PLG/SLG/MLG/混合） |
| 瓶颈优先级确认 | 瓶颈环节识别完成 | 确认资源分配优先级 |
| 飞轮模型确认 | 飞轮模型构建完成 | 确认飞轮节点和因果关系 |
| 增长策略报告确认 | growth-strategy-report生成完成 | 确认策略方向和执行路线图 |
| GTM策略确认 | gtm-strategy生成完成 | 确认上市路径和渠道策略 |
| 运营手册确认 | product-operations-manual生成完成 | 确认运营SOP和应急流程 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 增长模式诊断无法收敛（多种模式得分接近） | 标注为混合模式，列出各模式得分和依据，由人类决策确认 |
| 子编排器执行超时或失败 | 跳过该瓶颈环节，继续执行其他瓶颈环节，最终报告中标注"该环节待补充" |
| 多瓶颈场景下上下文溢出 | 按飞轮顺序仅执行最高优先级瓶颈，其余瓶颈记录待办，分批执行 |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 growth-strategy-report（增长策略报告）、gtm-strategy（Go-to-Market策略）、product-operations-manual（产品运营手册）
- v4.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格，条件分支子编排器说明
- v5.0: 执行步骤替换为编排理念，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v7.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v8.0: 更新引用 acquisition-channel/acquisition-optimize → acquisition-analysis；更新引用 retention-churn/retention-engagement → retention-management；更新输出路径
