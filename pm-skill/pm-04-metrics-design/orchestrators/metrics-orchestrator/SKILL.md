---
name: metrics-orchestrator
description: 当需要构建产品度量体系时使用。产品度量设计子模块指挥官，调度子Skill：metrics-system（指标体系自动构建）、tracking-plan（埋点方案自动生成）、metrics-dashboard（Dashboard自动配置）。关键词：度量设计、指标体系、埋点方案、Dashboard配置。
metadata:
  module: "产品度量设计"
  sub-module: "度量设计"
  type: "orchestrator"
  version: "5.0"
---

# 产品度量设计指挥官

## 核心原则

用数据减少决策中的猜测，而非用数据为决策做背书。

## 编排理念

1. **指标先行，埋点跟进**：指标体系是度量设计的根基，埋点和看板必须从指标体系推导而非反向构建
2. **层层卡口，逐级确认**：每个阶段的输出必须通过人类确认后才传递给下游，避免错误沿链路放大
3. **数据闭环，双向校验**：指标→埋点→看板形成闭环，上游变更必须沿链路传递，下游反馈必须回溯到源头

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-metrics-design/metrics-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-metrics-design/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-metrics-design/metrics-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: metrics-system
    gate: 北极星指标人类已选择
  - stage: tracking-plan
    depends_on: [metrics-system]
    gate: 埋点方案人类已审核
  - stage: metrics-dashboard
    depends_on: [metrics-system, tracking-plan]
    gate: Dashboard布局人类已确认
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

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill输出校验失败 | 暂停下游阶段执行，输出校验失败报告，提示人类修正后重试当前阶段 |
| 阶段卡口未通过 | 阻断流程推进，标记未通过的卡口条件，等待人类决策后继续 |
| 上游输入文件缺失 | 按子Skill降级策略执行，记录降级信息，在最终输出中标注降级影响范围 |
| 子Skill执行超时 | 标记超时阶段，输出已完成的部分结果，提示人类检查输入数据质量 |
| 人类决策超时未响应 | 暂停流程，保留当前阶段状态，支持人类恢复后从断点继续 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范，调度规则从"加载"改为"执行"
- v4.0: 执行步骤原则替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
