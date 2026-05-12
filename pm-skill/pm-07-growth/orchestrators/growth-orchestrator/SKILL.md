---
name: growth-orchestrator
description: 当需要制定增长策略或系统化推进增长时使用。增长策略总指挥官，先诊断增长模式，再按需调度获客/激活/留存/变现子编排器。关键词：增长策略、增长模式、AARRR、增长飞轮、增长体系。
metadata:
  module: "产品增长与运营"
  sub-module: "增长模式"
  type: "orchestrator"
  version: "6.0"
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

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-growth/growth-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-growth/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-growth/growth-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: growth-model
    gate: 增长模式已确定，飞轮模型已构建
  - stage: acquisition-orchestrator
    depends_on: [growth-model]
    trigger: 获客为瓶颈
    gate: 渠道评估完成且漏斗优化方案已生成
  - stage: activation-orchestrator
    depends_on: [growth-model]
    trigger: 激活为瓶颈
    gate: Aha Moment候选已识别且Onboarding策略已生成
  - stage: retention-orchestrator
    depends_on: [growth-model]
    trigger: 留存为瓶颈
    gate: 流失预警模型已构建且用户分层已完成
  - stage: revenue-orchestrator
    depends_on: [growth-model]
    trigger: 变现为瓶颈
    gate: 付费漏斗分析完成且NRR追踪已建立
  - stage: growth-strategy-report
    depends_on: [growth-model]
    gate: 增长策略报告经人类确认
  - stage: gtm-strategy
    trigger: 新产品上市 / 市场拓展
    gate: GTM策略经人类确认
  - stage: product-operations-manual
    trigger: 运营手册制定需求
    gate: 运营手册经人类确认
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
输出: output/pm-growth/acquisition-channel/、output/pm-growth/acquisition-optimize/
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
输出: output/pm-growth/retention-churn/、output/pm-growth/retention-engagement/
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
  acquisition_plan: output/pm-growth/acquisition-channel/（可选）
  activation_plan: output/pm-growth/activation-aha/（可选）
  retention_plan: output/pm-growth/retention-churn/（可选）
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
  positioning: positioning-statement（可选）
  differentiation: positioning-differentiation（可选）
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
  retention_strategy: output/pm-growth/retention-engagement/（可选）
  revenue_strategy: output/pm-growth/revenue-funnel/（可选）
  product_info: 用户提供
输出: output/pm-growth/product-operations-manual/
验证: SOP可执行；分层策略完整（至少覆盖新/活跃/沉默/流失4类用户）；应急流程可操作（P0-P3均有响应SLA和升级路径）；模板可直接使用
模式: 🤖→👤
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 增长模式诊断完成 | 增长模式已确定，飞轮模型已构建 | 补充产品特征和用户数据 |
| 瓶颈环节已识别 | 至少1个瓶颈环节已定位 | 延长分析周期或扩大数据范围 |
| 增长策略报告已确认 | 增长策略报告经人类确认 | 调整策略方向和执行路线图 |

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

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 growth-strategy-report（增长策略报告）、gtm-strategy（Go-to-Market策略）、product-operations-manual（产品运营手册）
- v4.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格，条件分支子编排器说明
- v5.0: 执行步骤替换为编排理念，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
