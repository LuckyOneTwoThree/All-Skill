---
name: validation-orchestrator
description: 当需要验证产品方案时使用。方案验证子模块指挥官，调度子Skill：validation-assumption-map、validation-mvp、validation-experiment、validation-usability。关键词：方案验证、假设验证、MVP、可用性测试、实验设计、假设地图、风险评估、验证想法、最小可行产品。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "orchestrator"
  version: "6.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "验证一下产品方案"
    - "设计MVP范围"
    - "做一下假设验证"
    - "评估一下方案风险"
---

# 方案验证指挥官

## 核心原则

1. **验证的是假设不是方案**——用最小成本获取最大置信度，MVP的目标是学习而非交付
2. **假设驱动验证顺序**——最大风险假设优先验证，验证结果决定方案走向
3. **验证闭环必须完整**——假设→实验→数据→结论→决策，任何环节断裂都是浪费

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill输出文件缺失 | 阻塞当前阶段，提示人类补充上游输入或提供替代数据 |
| 假设地图功能点覆盖不全 | 标注缺失功能点，建议人类确认是否补充假设 |
| MVP占比超过60% | 升级人类判断，输出裁剪建议，确认是否调整MVP范围 |
| 实验方案无法满足统计显著性 | 降低置信水平或增加样本量，标注"统计功效不足" |
| 可用性测试参与者不足5人 | 结果仅供参考，标注"样本量不足"，建议补充测试 |
| 人类决策超时未响应 | 暂停编排流程，保留当前状态，等待人类决策后继续 |
| 上下文接近上限 | 优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论写入文件 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 编排协议

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
pipeline: validation-orchestrator
version: 6.1

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-design/validation-orchestrator.md

stages:
  - id: phase-1
    name: "假设地图"
    depends_on: []
    skills: [validation-assumption-map]
    gate:
      condition: "最大风险假设已识别，每个功能点至少1个假设"
      fail_action: "每个功能点至少1个假设，最大风险假设必须有验证计划"

  - id: phase-2
    name: "MVP范围界定"
    depends_on: [phase-1]
    skills: [validation-mvp]
    gate:
      condition: "MVP占比<60%，Must Have功能都有假设关联"
      fail_action: "MVP占比>60%升级人类判断，确认是否调整"

  - id: phase-3
    name: "实验设计"
    depends_on: [phase-1, phase-2]
    parallel_with: [phase-4]
    skills: [validation-experiment]
    gate:
      condition: "实验方案人类已审核，含验证方法、样本量、时长、终止条件"
      fail_action: "所有实验方案必须人类审核"

  - id: phase-4
    name: "可用性测试"
    depends_on: [phase-1, phase-2]
    parallel_with: [phase-3]
    skills: [validation-usability]
    gate:
      condition: "问题严重程度分级合理（P0/P1/P2/P3），洞察与假设地图有对应关系"
      fail_action: "测试执行必须由人类研究员主持"
```

## 阶段执行计划

#### 调用 validation-assumption-map

```
Skill: validation-assumption-map
输入:
  design_output: output/pm-design/design-prototype/prototype_spec.json（或output/pm-design/design-userflow/userflow.json）
  prd: output/pm-design/design-prd/prd.md
输出: output/pm-design/validation-assumption-map/assumption_map.json
验证: 最大风险假设已识别，每个功能点至少1个假设
模式: 🤖
```

#### 调用 validation-mvp

```
Skill: validation-mvp
输入:
  design_output: output/pm-design/design-prototype/prototype_spec.json（或output/pm-design/design-userflow/userflow.json）
  assumption_map: output/pm-design/validation-assumption-map/assumption_map.json
  resource_constraints: 可选
输出: output/pm-design/validation-mvp/mvp_definition.json
验证: MVP占比<60%，Must Have功能都有假设关联
模式: 🤖→👤
```

#### 调用 validation-experiment

```
Skill: validation-experiment
输入:
  assumption_map: output/pm-design/validation-assumption-map/assumption_map.json
  mvp_scope: output/pm-design/validation-mvp/mvp_definition.json
  traffic_data: 可选（可用流量/用户数据）
输出: output/pm-design/validation-experiment/experiment_design.json
验证: 实验方案人类已审核，含验证方法、样本量、时长、终止条件
模式: 🤖→👤
```

#### 调用 validation-usability

```
Skill: validation-usability
输入:
  test_plan: output/pm-design/validation-assumption-map/assumption_map.json
  participants: 用户提供
  test_scenarios: output/pm-design/design-prototype/prototype_spec.json
输出: output/pm-design/validation-usability/usability_report.json
验证: 问题严重程度分级合理（P0/P1/P2/P3），洞察与假设地图有对应关系
模式: 👤→🤖
```

### 阶段总结（post_pipeline）

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-design/validation-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-design/ |
| 总结输出路径 | output/phase-reports/pm-design/validation-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: design-orchestrator（方案验证完成，基于验证结论调整设计方案）
  alternatives:
    - target: experiment-orchestrator
      reason: 验证结论需A/B测试进一步确认
      condition: 验证结果不确定（置信度<80%），需量化实验验证时
    - target: ideation-orchestrator
      reason: 验证否定当前方案，需重新创意发散
      condition: MVP验证结论为否定，核心假设不成立时
  special_cases:
    - target: validation-usability
      reason: 仅需可用性测试，无需完整验证流程
      condition: 方案已通过假设验证，仅需用户体验测试时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 假设地图完成 | validation-assumption-map输出文件已生成且非空 | 每个功能点至少1个假设，最大风险假设必须有验证计划 |
| MVP范围完成 | validation-mvp-scope输出文件已生成且非空 | MVP占比>60%升级人类判断，确认是否调整 |
| 实验设计完成 | 实验方案人类已审核 | 所有实验方案必须人类审核 |
| 可用性测试完成 | validation-usability-test输出文件已生成且非空 | 测试执行必须由人类研究员主持 |
| 阶段总结已生成 | output/phase-reports/pm-design/validation-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| MVP范围确认 | MVP范围界定完成，MVP占比>60%或Must Have有争议 | 人类审批并决定最终MVP范围 |
| 实验方案审核 | 实验方案设计完成 | 人类审核并批准实验方案 |
| 验证结论决策 | 可用性测试完成，验证数据已整理 | 人类做最终产品方案决策 |
