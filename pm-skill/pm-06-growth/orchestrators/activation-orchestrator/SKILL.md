---
name: activation-orchestrator
description: 当需要识别Aha Moment或设计Onboarding流程时使用。用户激活指挥官，调度activation-aha/onboarding。关键词：用户激活、Aha Moment、Onboarding、新用户引导、新手引导、激活率。
metadata:
  module: "产品增长与运营"
  sub-module: "激活"
  type: "orchestrator"
  version: "7.0"
  domain_tags: ["电商", "社交", "工具", "通用"]
  trigger_examples:
    - "找到Aha Moment"
    - "设计新手引导流程"
    - "提升用户激活率"
    - "优化Onboarding"
---

# 用户激活指挥官

## 核心原则

**Aha Moment是用户留存的起点**

用户激活的本质是帮助用户尽快到达Aha Moment——那个让用户感受到产品核心价值的瞬间。没有Aha Moment的激活只是流程完成，不是价值传递。

## 编排理念

1. **Aha Moment锚定Onboarding**：先识别Aha Moment，再以Aha Moment为终点设计Onboarding路径，确保引导有明确目标
2. **数据从识别流向设计**：Aha Moment的到达率和路径数据直接驱动Onboarding的流程设计

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
pipeline: activation-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/activation-orchestrator.md

stages:
  - id: phase-1
    name: "Aha Moment识别"
    depends_on: []
    skills: [activation-aha]
    gate:
      condition: "至少产出1个Aha Moment候选行为，含留存提升和到达率数据"
      fail_action: "扩大行为搜索范围"

  - id: phase-2
    name: "Onboarding设计"
    depends_on: [phase-1]
    skills: [activation-onboarding]
    gate:
      condition: "各用户分群的Onboarding路径和内容已设计"
      fail_action: "补充分群数据或延长分析周期"
```

## 阶段执行计划

#### 调用 activation-aha

```
Skill: activation-aha
输入:
  retention_data: analysis-retention → retention_analysis.json
  user_behavior_data: 用户提供
  user_segment_data: 用户提供（可选）
输出: output/pm-growth/activation-aha/
验证: Aha候选通过相关性筛选（≥0.5）和显著性检验；到达率分析包含时间分布和路径分析；最短路径识别包含摩擦点分析；Onboarding优化建议可直接执行
模式: 🤖→👤
```

#### 调用 activation-onboarding

```
Skill: activation-onboarding
输入:
  onboarding_data: 用户提供
  aha_moment_data: output/pm-growth/activation-aha/aha_moment.json
  user_segment_data: 用户提供（可选）
输出: output/pm-growth/activation-onboarding/
验证: Onboarding阶段定义完整（欢迎→激活完成）；流失分析覆盖各阶段和用户分群；个性化引导与用户分群匹配；A/B测试包含护栏指标（后续留存、付费转化）
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-growth/activation-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-growth/ |
| 总结输出路径 | output/phase-reports/pm-growth/activation-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: retention-orchestrator（用户激活优化完成，防止用户流失）
  alternatives:
    - target: growth-orchestrator
      reason: 激活不是当前瓶颈，回退到增长诊断重新评估
      condition: 激活率优化效果不达预期或激活非当前最大瓶颈时
    - target: experiment-orchestrator
      reason: 激活策略需A/B测试验证
      condition: Onboarding方案变更需量化验证时
  special_cases:
    - target: activation-aha
      reason: 仅需识别Aha Moment，无需完整激活编排
      condition: 已有Onboarding方案，仅需确认Aha Moment时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| Aha Moment候选已识别 | activation-aha-moment输出文件已生成且非空 | 扩大行为搜索范围 |
| Onboarding策略已生成 | activation-onboarding输出文件已生成且非空 | 补充分群数据或延长分析周期 |
| 阶段总结已生成 | output/phase-reports/pm-growth/activation-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Aha Moment确认 | Aha Moment候选识别完成 | 确认主Aha Moment的选择和Onboarding路径设计 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| Aha Moment无候选通过筛选阈值 | 降低相关性阈值至0.3重新搜索；仍无结果则基于产品功能推断候选，标注"待数据验证" |
| Onboarding数据完全缺失 | 基于Aha Moment数据设计通用Onboarding框架，标注"待Onboarding数据补充" |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
