---
name: acquisition-orchestrator
description: 当需要评估获客渠道或优化获客漏斗时使用。用户获取指挥官，调度 acquisition-analysis（获客分析一体化），实现从渠道评估到漏斗优化的闭环。关键词：用户获取、获客渠道、漏斗优化、渠道评估、获客策略、acquisition-analysis、拉新、获客。
metadata:
  module: "产品增长与运营"
  sub-module: "获客"
  type: "orchestrator"
  version: "7.0"
  domain_tags: ["电商", "社交", "教育", "通用"]
  trigger_examples:
    - "评估一下获客渠道"
    - "优化一下获客漏斗"
    - "怎么拉新用户"
    - "获客成本太高了"
---

# 用户获取指挥官

## 核心原则

**让正确的用户找到产品**

用户获取不是流量游戏，而是匹配游戏。目标不是更多用户，而是更多正确用户——那些能从产品中获得价值、同时为产品创造价值的用户。

## 编排理念

1. **渠道评估与漏斗优化一体执行**：acquisition-analysis 内部先完成渠道评估再执行漏斗优化，确保优化方案有渠道级数据支撑
2. **数据在步骤间流转**：渠道评估的输出直接驱动漏斗优化的输入，无需编排器中转

## 编排器定位声明

本编排器当前 Pipeline 仅包含 1 个子 Skill（acquisition-analysis），属于合并简化后的退化编排器。保留本编排器的理由：

1. **统一入口**：为用户获取子模块提供标准化的调用入口，上层编排器（如 product-launch-orchestrator）无需关心内部子 Skill 的合并历史
2. **阶段总结**：强制生成阶段总结文档（post_pipeline），确保子模块产出可审计、可追溯
3. **异常处理**：提供统一的异常处理策略和降级方案，子 Skill 自身的降级策略不覆盖编排器层面的异常拦截
4. **人类决策点**：在子 Skill 执行前后提供人类决策卡口，确保关键结论经人类确认后才传递下游

若未来该子模块需要扩展为多阶段 Pipeline，本编排器可直接增加阶段，无需修改上层编排器的调用方式。

## 编排协议

> 协议源头：[orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md)（仅供维护者追踪，本文件已内联完整协议内容，可独立使用）

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **双模式调用**：平台支持 Skill 工具时，显式调用子Skill；平台不支持时，按子Skill的 `name`、输入契约、输出契约和阶段卡口执行兼容调度。
2. **不代理扩写**：兼容调度时不得把子Skill内部方法论复制进编排器上下文，也不得改写子Skill逻辑；只传递必要输入、输出路径和验证条件。
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现细节。
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径和 artifact index 传递数据。
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段。
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。
7. **跨子Skill交叉验证**：当多个子Skill的产出之间存在一致性约束时，编排器可在阶段间执行交叉验证（读取多份产出比对一致性），这属于编排器的协调职责而非代理执行子Skill逻辑。交叉验证规则在编排器SKILL.md中显式定义。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/{领域路径}/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段卡口标准

编排器的阶段卡口只校验以下3类条件，不深入子Skill内部字段：

| 卡口类型 | 校验内容 | 示例 |
|----------|----------|------|
| 输出存在性 | 输出文件已生成且非空 | "api-design-spec输出文件已生成" |
| 顶层结构完整性 | JSON顶层必填字段存在 | "prd.json包含features/pages/entities" |
| 人类决策确认 | 关键决策点已获人类确认 | "设计审查人类确认通过" |

### 通用异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板，整体置信度设为0.3，强制人类确认是否继续 |

## Pipeline

```yaml
pipeline: acquisition-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/acquisition-orchestrator.md

stages:
  - id: phase-1
    name: "渠道评估与漏斗优化"
    depends_on: []
    skills: [acquisition-analysis]
    gate:
      condition: "渠道评估完成且漏斗优化方案已生成"
      fail_action: "补充缺失渠道数据或延长分析周期"
```

## 阶段执行计划

#### 调用 acquisition-analysis

```
Skill: acquisition-analysis
输入:
  channel_data: 用户提供（19种获客渠道数据）
  historical_performance: 用户提供（历史渠道表现）
  channel_config_cost: 用户提供（渠道配置和成本）
  historical_optimization: 用户提供（可选，历史优化实验数据）
输出: output/pm-growth/acquisition-analysis/
验证: 渠道评估覆盖规模、转化率、ROI、质量4个维度；渠道分级标准明确（主力/测试/观察）；ROI计算考虑用户LTV而非单次收入；评估覆盖19种获客渠道类型；漏斗阶段定义完整（曝光→激活/付费）；流失原因区分认知/信任/行动/价值4类障碍；优化方案附带预期提升和实施难度评估；A/B测试设计包含决策规则和终止条件
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-growth/acquisition-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-growth/ |
| 总结输出路径 | output/phase-reports/pm-growth/acquisition-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: activation-orchestrator（获客优化完成，提升新用户转化）
  alternatives:
    - target: growth-orchestrator
      reason: 获客不是当前瓶颈，回退到增长诊断重新评估
      condition: 获客渠道ROI低于行业基准或优化效果不达预期时
    - target: experiment-orchestrator
      reason: 获客策略需A/B测试验证
      condition: 获客方案涉及渠道策略变更需量化验证时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 获客分析完成 | acquisition-analysis输出文件已生成且非空 | 补充缺失渠道数据或延长分析周期 |
| 阶段总结已生成 | output/phase-reports/pm-growth/acquisition-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 渠道策略确认 | 渠道评估完成，需调整资源分配 | 确认主力渠道、测试渠道和观察渠道的划分及预算分配 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 渠道数据严重缺失（>50%渠道无数据） | 暂停渠道评估，要求用户补充核心渠道数据后再继续 |
| 漏斗优化A/B测试样本不足 | 延长测试周期至样本达标，或放宽显著性要求至90%置信度 |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
