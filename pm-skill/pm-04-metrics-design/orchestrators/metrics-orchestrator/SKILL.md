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

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

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
  tracking_plan: output/pm-metrics-design/tracking-plan/tracking_plan
  user_roles: 用户提供
  dashboard_platform: 用户提供
输出: output/pm-metrics-design/metrics-dashboard/
验证: 所有指标已分配到Dashboard，每个Dashboard至少有1个Widget，北极星指标出现在战略Dashboard，告警规则配置完整
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-metrics-design/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-metrics-design/metrics-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: monitoring-orchestrator
    reason: 度量设计完成，将指标体系和埋点方案落地为监控配置
    input_mapping:
      metrics_output: "output/pm-metrics-design/metrics-system/ → monitoring-pipeline输入"
      tracking_output: "output/pm-metrics-design/tracking-plan/ → 开发阶段埋点实现"
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
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

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

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范，调度规则从"加载"改为"执行"
- v4.0: 执行步骤原则替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
