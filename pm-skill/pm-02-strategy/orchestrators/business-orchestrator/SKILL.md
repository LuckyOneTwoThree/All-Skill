---
name: business-orchestrator
description: 当需要设计或评估产品商业模式时使用。商业模式指挥官，调度business-model-canvas/value-fit/pricing/strategy-report。关键词：商业模式、商业画布、定价策略、商业战略报告、怎么赚钱、盈利模式、收费模式、商业评估。
metadata:
  module: "产品商业与战略"
  sub-module: "商业模式设计"
  type: "orchestrator"
  version: "7.1"
  domain_tags: ["电商", "SaaS", "金融", "教育", "通用"]
  trigger_examples:
    - "帮我设计商业模式"
    - "产品怎么赚钱"
    - "设计一下定价策略"
    - "评估一下商业模式是否可行"
    - "做一下商业画布"
---

# 商业模式设计指挥官

## 核心原则

商业模式不是设计出来的，是验证出来的。

1. **验证优先于设计**——商业模式假设必须可验证，每个画布要素都应附带验证方法和成功标准
2. **财务闭环驱动**——单位经济模型先于规模扩张假设，确保单点盈利逻辑成立再推演增长
3. **多方案并行比较**——定价与收入模式生成多个可比较方案，避免单一方案锁定思维

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
pipeline: business-orchestrator
version: 7.1

stages:
  - id: phase-1
    name: "商业模式画布"
    skills: [business-model-canvas]
    gate:
      condition: "BMC 9格全部填充、假设已标注"
      fail_action: "补充缺失要素，无法填充的标注为待验证假设"

  - id: phase-2
    name: "价值匹配验证"
    depends_on: [phase-1]
    skills: [business-value-fit]
    gate:
      condition: "价值主张匹配度≥3.0"
      fail_action: "调整价值主张或目标用户，重新验证"

  - id: phase-3
    name: "定价策略"
    depends_on: [phase-1]
    skills: [business-pricing]
    gate:
      condition: "3个定价方案已生成"
      fail_action: "补充定价方案，确保差异化"

  - id: phase-4
    name: "商业战略报告"
    depends_on: [phase-1, phase-2, phase-3]
    skills: [business-strategy-report]
    gate:
      condition: "报告执行摘要完整，至少2个战略方向"
      fail_action: "补充战略方向或标注建议补充战略分析"

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/business-orchestrator.md
```

## 阶段执行计划

#### 调用 business-model-canvas

```
Skill: business-model-canvas
输入:
  product_context: 来自 user-research-user-modeling / opportunity-definition
  market_data: 来自 market-competitor-analysis
输出: output/pm-strategy/business-model-canvas/
验证: BMC 9格全部填充、假设已标注
模式: 🤖→👤
```

#### 调用 business-value-fit

```
Skill: business-value-fit
输入:
  bmc_value_proposition: 来自阶段1 output/pm-strategy/business-model-canvas/bmc.json
  user_research_data: 来自 user-research-user-modeling / user-research-voice-analysis
输出: output/pm-strategy/business-value-fit/
验证: 价值主张匹配度≥3.0
模式: 🤖
```

#### 调用 business-pricing

```
Skill: business-pricing
输入:
  bmc_data: 来自阶段1 output/pm-strategy/business-model-canvas/bmc.json
  competitor_pricing_data: 来自 market-competitor-analysis → competitor-analysis.json
  willingness_to_pay: 用户提供
输出: output/pm-strategy/business-pricing/
验证: 3个定价方案已生成
模式: 🤖→👤
```

#### 调用 business-strategy-report

```
Skill: business-strategy-report
输入:
  bmc: 来自阶段1 output/pm-strategy/business-model-canvas/bmc.json
  pricing_strategy: 来自阶段3 output/pm-strategy/business-pricing/pricing_analysis.json
  product_business_info: 用户提供
  optional_inputs: SWOT、OKR、路线图、定位、价值曲线、差异化评估、利益相关者、北极星指标
输出: output/pm-strategy/business-strategy-report/
验证: 报告执行摘要完整，至少2个战略方向
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-strategy/business-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-strategy/ |
| 总结输出路径 | output/phase-reports/pm-strategy/business-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: positioning-orchestrator（商业模式设计完成，确定差异化定位策略）
  alternatives:
    - target: planning-orchestrator
      reason: 定位已明确，直接进入战略规划
      condition: 产品定位已在商业模式设计中确定时
    - target: design-orchestrator
      reason: 商业模式和定位均已确定，直接进入设计
      condition: 商业模式与定位均已完成，需快速进入产品构建时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| BMC生成完成 | business-model-canvas输出文件已生成且非空 | 补充缺失要素，无法填充的标注为待验证假设 |
| 定价方案完成 | pricing输出文件已生成且非空 | 补充缺失方案，确保差异化定位 |
| 商业战略报告完成 | strategy-report输出文件已生成且非空 | 补充战略方向或标注"建议补充战略分析" |
| 阶段总结已生成 | output/phase-reports/pm-strategy/business-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1某子Skill失败 | 暂停编排，输出失败诊断信息，请求人类介入修复后重试该阶段 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板（仅含元信息和空结构），整体置信度设为0.3，强制人类确认是否继续。人类确认后基于用户提供信息和AI知识库推断生成，所有推断内容标注confidence≤0.5和needs_human_validation:true |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 收入模型选择 | 阶段1 business-model-canvas 生成多个收入模式选项 | 人类选择最终收入模式方案 |
| 定价数字拍板 | 阶段3 business-pricing 提供定价分析和方案 | 人类决定具体定价数字和套餐结构 |
| 商业战略方向确认 | 阶段4 business-strategy-report 推荐战略方向 | 人类确认最终战略选择 |
