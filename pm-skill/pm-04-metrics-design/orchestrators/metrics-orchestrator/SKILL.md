---
name: metrics-orchestrator
description: 当需要构建产品度量体系时使用。产品度量设计子模块指挥官，调度子Skill：metrics-system（指标体系自动构建）、tracking-plan（埋点方案自动生成）、metrics-dashboard（Dashboard自动配置）。关键词：度量设计、指标体系、埋点方案、Dashboard配置、数据指标、KPI设计、数据埋点。
metadata:
  module: "产品度量设计"
  sub-module: "度量设计"
  type: "orchestrator"
  version: "6.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我设计指标体系"
    - "规划一下数据埋点"
    - "设计产品KPI"
    - "配置数据Dashboard"
---

# 产品度量设计指挥官

## 核心原则

用数据减少决策中的猜测，而非用数据为决策做背书。

## 编排理念

1. **指标先行，埋点跟进**：指标体系是度量设计的根基，埋点和看板必须从指标体系推导而非反向构建
2. **层层卡口，逐级确认**：每个阶段的输出必须通过人类确认后才传递给下游，避免错误沿链路放大
3. **数据闭环，双向校验**：指标→埋点→看板形成闭环，上游变更必须沿链路传递，下游反馈必须回溯到源头

## 编排协议

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 编排协议。

## Pipeline

```yaml
pipeline: metrics-orchestrator
version: 6.1

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-metrics-design/metrics-orchestrator.md

stages:
  - id: phase-1
    name: "指标体系"
    depends_on: []
    skills: [metrics-system]
    gate:
      condition: "北极星指标人类已选择"
      fail_action: "北极星指标必须人类决策，AI只提供候选和分析"

  - id: phase-2
    name: "埋点方案"
    depends_on: [phase-1]
    skills: [tracking-plan]
    gate:
      condition: "埋点方案人类已审核"
      fail_action: "业务逻辑正确性和隐私合规性必须人类确认"

  - id: phase-3
    name: "Dashboard配置"
    depends_on: [phase-1, phase-2]
    skills: [metrics-dashboard]
    gate:
      condition: "Dashboard布局人类已确认"
      fail_action: "布局合理性和告警阈值需人类审核"
```

## 阶段执行计划

#### 调用 metrics-system

```
Skill: metrics-system
输入:
  product_context: 用户提供（产品类型、北极星指标、OKR、商业模式）
  existing_metrics: 用户提供（已有指标清单）
输出: output/pm-metrics-design/metrics-system/metric_system.json
验证: 北极星虚荣指标检测通过，L1-L2拆解完整（每L1有3-5个L2），行动指标可追踪
模式: 🤖→👤
```

#### 调用 tracking-plan

```
Skill: tracking-plan
输入:
  PRD: 用户提供（产品功能描述、用户流程、核心路径、业务规则）
  metric_system: output/pm-metrics-design/metrics-system/metric_system.json
  existing_tracking: 用户提供（现有埋点清单）
输出: output/pm-metrics-design/tracking-plan/
验证: 命名规范通过，核心路径覆盖≥90%，PRD一致性≥90%
模式: 🤖→👤
```

#### 调用 metrics-dashboard

```
Skill: metrics-dashboard
输入:
  metric_system: output/pm-metrics-design/metrics-system/metric_system.json
  tracking_plan: output/pm-metrics-design/tracking-plan/tracking_plan.json
  user_roles: 用户提供
  dashboard_platform: 用户提供
输出: output/pm-metrics-design/metrics-dashboard/
验证: 所有指标已分配到Dashboard，每个Dashboard至少有1个Widget，北极星指标出现在战略Dashboard，告警规则配置完整
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-metrics-design/metrics-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-metrics-design/ |
| 总结输出路径 | output/phase-reports/pm-metrics-design/metrics-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: monitoring-orchestrator（度量设计完成，将指标体系和埋点方案落地为监控配置）
  alternatives:
    - target: design-orchestrator
      reason: 度量设计发现PRD功能点遗漏，需回溯补充
      condition: 指标体系设计中发现PRD功能点覆盖率<80%时
    - target: growth-orchestrator
      reason: 度量体系已就绪，启动增长策略
      condition: 产品已上线且度量体系已就绪，需驱动增长时
  special_cases:
    - target: tracking-plan
      reason: 仅需生成埋点方案，无需完整度量设计
      condition: 指标体系已建立，仅需更新埋点方案时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 指标体系完成 | 北极星指标人类已选择 | 北极星指标必须人类决策，AI只提供候选和分析 |
| 埋点方案完成 | 埋点方案人类已审核 | 业务逻辑正确性和隐私合规性必须人类确认 |
| Dashboard完成 | Dashboard布局人类已确认 | 布局合理性和告警阈值需人类审核 |
| 阶段总结已生成 | output/phase-reports/pm-metrics-design/metrics-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 北极星指标选择 | AI推荐3个候选北极星指标 | 人类选择最终指标 |
| 埋点方案审核 | AI生成埋点方案 | 人类审核业务逻辑和隐私合规 |
| Dashboard布局确认 | AI配置Dashboard | 人类确认布局和告警阈值 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill输出校验失败 | 暂停下游阶段执行，输出校验失败报告，提示人类修正后重试当前阶段 |
| 阶段卡口未通过 | 阻断流程推进，标记未通过的卡口条件，等待人类决策后继续 |
| 上游输入文件缺失 | 按子Skill降级策略执行，记录降级信息，在最终输出中标注降级影响范围 |
| 子Skill执行超时 | 标记超时阶段，输出已完成的部分结果，提示人类检查输入数据质量 |
| 人类决策超时未响应 | 暂停流程，保留当前阶段状态，支持人类恢复后从断点继续 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
