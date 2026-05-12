---
name: requirements-orchestrator
description: 当需要管理产品需求时使用。需求管理子模块指挥官，调度子Skill：requirements-collection、requirements-understanding、requirements-prioritization。关键词：需求管理、需求收集、需求优先级、需求分析、需求分类、RICE评分、MoSCoW、整理需求、需求梳理。
metadata:
  module: "产品构思与设计"
  sub-module: "需求管理"
  type: "orchestrator"
  version: "6.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我整理需求"
    - "收集一下产品需求"
    - "给需求排个优先级"
    - "梳理一下需求清单"
---

# 需求管理指挥官

## 核心原则

1. **需求≠问题**——用户描述的是解决方案不是问题本身，理解阶段必须还原真实诉求
2. **分类置信度是安全阀**——低置信度分类必须升级人类复核，错误分类的代价远高于人工复核
3. **优先级是资源分配的决策**——RICE提供客观排序，MoSCoW融入战略考量，两者互补不可偏废

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill输出文件缺失 | 阻塞当前阶段，提示人类补充上游输入或提供替代数据 |
| 需求分类置信度普遍偏低 | 输出低置信度需求清单，建议人类批量复核分类 |
| 理解模板填充不完整 | 返回补充未填充项，低可信度需求强制问题还原 |
| RICE评分数据不充分 | 标注评分依据不足的维度，建议人类补充估算或降低置信度 |
| 人类决策超时未响应 | 暂停编排流程，保留当前状态，等待人类决策后继续 |
| 上下文接近上限 | 优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论写入文件 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-design/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-design/requirements-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  post_pipeline:
    - action: stage-summary
      output: output/phase-reports/pm-design/requirements-orchestrator.md
  stages:
    - id: requirements-collection
      name: 需求收集
      depends_on: []
    - id: requirements-understanding
      name: 需求理解
      depends_on: [requirements-collection]
    - id: requirements-prioritization
      name: 需求优先级排序
      depends_on: [requirements-understanding]
```

## 阶段执行计划

#### 调用 requirements-collection

```
Skill: requirements-collection
输入:
  sources: 用户提供（含用户反馈、行为数据、业务需求、竞品更新、战略输入等数据源连接器及同步频率）
输出: output/pm-design/requirements-collection/requirements.json
验证: 需求分类置信度已标注，每个需求都有category和classification_confidence
模式: 🤖
```

#### 调用 requirements-understanding

```
Skill: requirements-understanding
输入:
  requirements: output/pm-design/requirements-collection/requirements.json
输出: output/pm-design/requirements-understanding/requirement_analysis.json
验证: 理解模板5项已填充（who/where_when/what_problem/current_solution/ideal_state）
模式: 🤖→👤
```

#### 调用 requirements-prioritization

```
Skill: requirements-prioritization
输入:
  requirement_analysis: output/pm-design/requirements-understanding/requirement_analysis.json
  resource_constraints: 可选（含可用人力、最大并行功能数、战略目标、截止日期）
输出: output/pm-design/requirements-prioritization/requirement_prioritization.json
验证: MoSCoW人类已确认，RICE评分4个维度完整
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-design/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-design/requirements-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 收集完成 | 需求分类置信度已标注 | 置信度<0.7标记待人工复核 |
| 理解完成 | 理解模板5项已填充 | 未填充项返回补充，低可信度需求需问题还原 |
| 排序完成 | MoSCoW人类已确认 | AI提供MoSCoW建议，人类做最终定级 |
| 阶段总结已生成 | output/phase-reports/pm-design/requirements-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 需求分类判定 | AI自动分类置信度<0.7 | 低置信度需求由人类判定分类 |
| MoSCoW定级 | RICE评分完成，AI生成MoSCoW建议 | 人类确认最终MoSCoW定级，可覆盖AI建议 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——新增子Skill执行协议、任务调度改为阶段执行计划、调度规则改为执行模式、阶段卡口和人类决策点改为表格、增加子Skill输入输出路径
- v5.0: 编排协议重构——子Skill执行协议改为编排协议、新增Pipeline定义、阶段执行计划改为调用指令格式、删除调度规则
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
