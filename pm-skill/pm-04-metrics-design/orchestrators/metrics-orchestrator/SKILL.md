---
name: metrics-orchestrator
description: 当需要构建产品度量体系时使用。产品度量设计子模块指挥官，调度子Skill：metrics-system（指标体系自动构建）、tracking-plan（埋点方案自动生成）、metrics-dashboard（Dashboard自动配置）。关键词：度量设计、指标体系、埋点方案、Dashboard配置。
metadata:
  module: "产品度量设计"
  sub-module: "度量设计"
  type: "orchestrator"
  version: "3.0"
---

# 产品度量设计指挥官

## 核心原则

用数据减少决策中的猜测，而非用数据为决策做背书。

## 执行步骤

1. **全量分析**：对所有可用数据进行系统性分析，不遗漏关键维度
2. **实时感知**：指标体系设计支持实时监控和快速响应
3. **自动归因**：异常波动自动归因到具体原因，减少人工排查
4. **决策规则显式化**：每个告警和升级条件都有明确的量化规则

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

#### 阶段1：指标体系自动构建

| 项目 | 内容 |
|------|------|
| 子Skill名称 | metrics-system |
| 读取定义路径 | `.trae/skills/metrics-system/SKILL.md` |
| 输入 | product_context（用户提供：产品类型、北极星指标、OKR、商业模式）、existing_metrics（用户提供：已有指标清单） |
| 输出 | `output/pm-metrics-design/metrics-system/metric_system.json`（north_star、l1_metrics、l2_metrics、actionable_metrics、vanity_alerts） |
| 验证 | 北极星虚荣指标检测通过，L1-L2拆解完整（每L1有3-5个L2），行动指标可追踪 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 指标体系完成：北极星指标人类已选择，未通过则北极星指标必须人类决策，AI只提供候选和分析 |

#### 阶段2：埋点方案自动生成

| 项目 | 内容 |
|------|------|
| 子Skill名称 | tracking-plan |
| 读取定义路径 | `.trae/skills/tracking-plan/SKILL.md` |
| 输入 | PRD（用户提供：产品功能描述、用户流程、核心路径、业务规则）、指标体系（output/pm-metrics-design/metrics-system/metric_system.json）、现有埋点清单（用户提供） |
| 输出 | `output/pm-metrics-design/tracking-plan/`（tracking_plan、quality_check） |
| 验证 | 命名规范通过，核心路径覆盖≥90%，PRD一致性≥90% |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 埋点方案完成：埋点方案人类已审核，未通过则业务逻辑正确性和隐私合规性必须人类确认 |

#### 阶段3：Dashboard自动配置

| 项目 | 内容 |
|------|------|
| 子Skill名称 | metrics-dashboard |
| 读取定义路径 | `.trae/skills/metrics-dashboard/SKILL.md` |
| 输入 | metric_system（output/pm-metrics-design/metrics-system/metric_system.json）、tracking_plan（output/pm-metrics-design/tracking-plan/tracking_plan）、user_roles（用户提供）、dashboard_platform（用户提供） |
| 输出 | `output/pm-metrics-design/metrics-dashboard/`（dashboards、configuration_files） |
| 验证 | 所有指标已分配到Dashboard，每个Dashboard至少有1个Widget，北极星指标出现在战略Dashboard，告警规则配置完整 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | Dashboard完成：Dashboard布局人类已确认，未通过则布局合理性和告警阈值需人类审核 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件（`对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）`）
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-metrics-design/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 指标体系完成 | 北极星指标人类已选择 | 北极星指标必须人类决策，AI只提供候选和分析 |
| 埋点方案完成 | 埋点方案人类已审核 | 业务逻辑正确性和隐私合规性必须人类确认 |
| Dashboard完成 | Dashboard布局人类已确认 | 布局合理性和告警阈值需人类审核 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 北极星指标选择 | AI推荐3个候选北极星指标 | 人类选择最终指标 |
| 埋点方案审核 | AI生成埋点方案 | 人类审核业务逻辑和隐私合规 |
| Dashboard布局确认 | AI配置Dashboard | 人类确认布局和告警阈值 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范，调度规则从"加载"改为"执行"
