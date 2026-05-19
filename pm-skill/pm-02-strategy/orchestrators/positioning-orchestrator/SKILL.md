---
name: positioning-orchestrator
description: 当需要确定产品定位或评估差异化策略时使用。产品定位指挥官，调度positioning-strategy。关键词：产品定位、差异化、价值曲线、竞争策略、品牌定位、市场定位、竞争优势。本编排器为透传编排器，仅调度1个子Skill(positioning-strategy)，上层编排器也可直接调用positioning-strategy。
metadata:
  module: "产品商业与战略"
  sub-module: "产品定位与差异化"
  type: "orchestrator"
  version: "8.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我确定产品定位"
    - "分析一下差异化优势"
    - "写一个定位陈述"
    - "评估一下竞争策略"
---

# 产品定位与差异化指挥官

## 核心原则

定位的本质是选择不为谁服务。

1. **取舍显式化**——定位的每个选择必须同时声明"选择做什么"和"选择不做什么"，取舍不可隐含
2. **竞争锚点驱动**——差异化评估必须以竞品为参照锚点，避免脱离竞争语境的自我定位
3. **排他即承诺**——排他决策一旦做出即视为产品承诺，必须纳入后续需求过滤的硬约束

## 编排器定位声明

本编排器当前 Pipeline 仅包含 1 个子 Skill（positioning-strategy），属于合并简化后的退化编排器。保留本编排器的理由：

1. **统一入口**：为产品定位与差异化子模块提供标准化的调用入口，上层编排器（如 product-launch-orchestrator）无需关心内部子 Skill 的合并历史
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

本编排器为透传编排器，职责是提供统一入口、阶段总结和异常处理。上层编排器（如product-launch-orchestrator）可直接调用positioning-strategy子Skill，无需经过本编排器。

## Pipeline 定义

```yaml
pipeline: positioning-orchestrator
version: 8.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/positioning-orchestrator.md

stages:
  - id: phase-1
    name: "定位策略"
    skills: [positioning-strategy]
    gate:
      condition: "positioning-strategy输出文件已生成"
      fail_action: "按子Skill失败原因处理，必要时升级人类"
```

## 阶段执行计划

### 阶段1：定位策略

- **调用Skill**: `positioning-strategy`
- **输入参数**:
  - `value_fit`: 价值主张匹配结果（来自 output/pm-strategy/business-value-fit/evaluation_report.json）
  - `competitor_analysis`: 竞品分析数据（来自 market-competitor-analysis → competitor-analysis.json）
  - `user_insight`: 用户洞察（来自 user-research-user-modeling）
  - `bmc`: 价值主张（来自 output/pm-strategy/business-model-canvas/bmc.json，可选）
  - `capability_assessment`: 自身能力评估（可选，用户提供）
- **输出**: `output/pm-strategy/positioning-strategy/positioning-strategy.json` + `output/pm-strategy/positioning-strategy/positioning-strategy.md`
- **验证**: 输出文件已生成且内容完整
- **执行模式**: 🤖→👤 AI建议，人类审批

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-strategy/positioning-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-strategy/ |
| 总结输出路径 | output/phase-reports/pm-strategy/positioning-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: planning-orchestrator（定位策略完成，制定OKR和路线图）
  alternatives:
    - target: business-orchestrator
      reason: 定位结果影响商业模式，需回溯调整
      condition: 定位策略与现有商业模式不一致时
    - target: design-orchestrator
      reason: 定位已清晰且规划已完成，直接进入设计
      condition: OKR和路线图已在前序阶段完成时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 输出文件已生成 | positioning-strategy.json 已生成 | 按子Skill失败原因处理，必要时升级人类 |
| 阶段总结已生成 | output/phase-reports/pm-strategy/positioning-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 定位陈述最终选择 | positioning-strategy 生成候选定位陈述 | 人类选择最终定位陈述 |
| 排他决策 | positioning-strategy 提供排他建议 | 人类决定不为哪些用户服务 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill执行失败 | 暂停编排，输出失败诊断信息，请求人类介入修复后重试 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
