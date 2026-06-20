---
name: revenue-orchestrator
description: 当需要优化付费转化或提升收入时使用。商业化指挥官，调度 revenue-funnel（付费漏斗分析）、revenue-nrr（NRR追踪预警）、revenue-upsell（升级转化），实现从付费漏斗分析到增购策略的闭环。关键词：商业化、付费漏斗、NRR、增购策略、收入优化、revenue-funnel、revenue-nrr、revenue-upsell、赚钱、变现、付费转化。
metadata:
  module: "产品增长与运营"
  sub-module: "变现"
  type: "orchestrator"
  version: "7.0"
  domain_tags: ["电商", "SaaS", "金融", "教育", "游戏", "通用"]
  trigger_examples:
    - "优化付费转化率"
    - "提升产品收入"
    - "分析付费漏斗"
    - "设计增购策略"
    - "提升NRR"
---

# 商业化指挥官

## 核心原则

**商业化是用户价值和商业价值的双赢**

好的商业化不是从用户身上榨取价值，而是为用户创造更多价值的同时获得合理回报。用户愿意付费是因为产品让他们的生活或工作变得更好，而非因为他们被设计成了付费陷阱。

## 编排理念

1. **漏斗诊断定方向，NRR追踪看健康，升级转化抓机会**：三阶段从诊断到监控到行动，形成完整的商业化闭环
2. **数据在漏斗→NRR→升级间递进流转**：前序阶段的输出直接驱动后序阶段的策略制定

## 编排协议

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 编排协议。

## Pipeline

```yaml
pipeline: revenue-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/revenue-orchestrator.md

stages:
  - id: phase-1
    name: "NRR追踪"
    depends_on: []
    skills: [revenue-nrr]
    gate:
      condition: "NRR计算和趋势追踪正常运行，流失预警和扩张机会已识别"
      fail_action: "完善收入数据采集"

  - id: phase-2
    name: "付费漏斗"
    depends_on: [phase-1]
    skills: [revenue-funnel]
    gate:
      condition: "注册到付费全链路转化分析完成，瓶颈已识别"
      fail_action: "补充漏斗步骤定义或数据"

  - id: phase-3
    name: "升级转化"
    depends_on: [phase-2]
    skills: [revenue-upsell]
    gate:
      condition: "升级转化策略和个性化方案已生成"
      fail_action: "优化升级信号识别或补充用户行为数据"
```

## 阶段执行计划

#### 调用 revenue-nrr

```
Skill: revenue-nrr
输入:
  revenue_data: 用户提供（收入数据）
  user_account_data: 用户提供
  user_behavior_data: 用户提供（可选）
输出: output/pm-growth/revenue-nrr/
验证: NRR计算包含扩张、收缩、流失三部分；流失预警覆盖活跃度、功能、财务、组织4类信号；扩张机会识别有评分和推荐策略；分维度NRR计算覆盖用户分群和产品线
模式: 🤖→👤
```

#### 调用 revenue-funnel

```
Skill: revenue-funnel
输入:
  payment_funnel_data: 用户提供（注册到付费全链路数据）
  conversion_data: output/pm-growth/revenue-nrr/nrr_analysis.json
  user_profile_data: 用户提供（可选）
输出: output/pm-growth/revenue-funnel/
验证: 付费漏斗覆盖注册到复购全链路；障碍识别区分定性和定量分析；优化建议按影响系数×实施难度排序；付费墙时机建议基于用户行为数据
模式: 🤖→👤
```

#### 调用 revenue-upsell

```
Skill: revenue-upsell
输入:
  user_behavior_data: 用户提供
  payment_history: output/pm-growth/revenue-nrr/nrr_analysis.json
  product_usage_data: 用户提供（可选）
输出: output/pm-growth/revenue-upsell/
验证: 升级信号识别覆盖4类信号（用量/功能/行为/意向）；个性化内容包含用户名、用量、收益3个要素；A/B测试设计包含护栏指标；升级ROI计算包含触达成本
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-growth/revenue-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-growth/ |
| 总结输出路径 | output/phase-reports/pm-growth/revenue-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: growth-orchestrator（商业化优化完成，回到增长诊断评估整体增长飞轮效果）
  alternatives:
    - target: experiment-orchestrator
      reason: 商业化方案需A/B测试验证
      condition: 定价或付费墙策略变更需量化验证时
    - target: metrics-orchestrator
      reason: 商业化指标需补充度量设计
      condition: 付费漏斗关键指标缺乏埋点支撑时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| NRR追踪已建立 | revenue-nrr输出文件已生成且非空 | 完善收入数据采集 |
| 付费漏斗分析完成 | revenue-funnel输出文件已生成且非空 | 补充漏斗步骤定义或数据 |
| 升级转化策略已生成 | revenue-upsell输出文件已生成且非空 | 优化升级信号识别或补充用户行为数据 |
| 阶段总结已生成 | output/phase-reports/pm-growth/revenue-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 定价策略确认 | 付费漏斗分析和NRR追踪完成 | 确认定价调整、升级方案和资源分配策略 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 付费漏斗数据严重缺失（无法构建完整漏斗） | 基于已有数据构建部分漏斗，缺失环节标注"待补充"，由人类确认是否继续 |
| NRR计算异常（NRR<80%或>150%） | 标注数据异常警告，建议人工核实收入数据口径后重新计算 |
| 升级信号识别无有效候选 | 放宽信号阈值重新搜索；仍无结果则基于产品功能推断升级场景，标注"待数据验证" |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
