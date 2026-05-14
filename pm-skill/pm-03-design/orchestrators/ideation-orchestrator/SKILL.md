---
name: ideation-orchestrator
description: 当需要发散创意或构思解决方案时使用。创意发散与方案构思子模块指挥官，调度子Skill：ideation-workshop。关键词：创意发散、HMW、SCAMPER、方案构思、产品创意、思维逆转、方案收敛、头脑风暴、创新方案、创意工作坊。
metadata:
  module: "产品构思与设计"
  sub-module: "创意发散与方案构思"
  type: "orchestrator"
  version: "7.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我发散一下创意"
    - "构思一下解决方案"
    - "用SCAMPER方法创新"
    - "头脑风暴一下"
---

# 创意发散与方案构思指挥官

## 核心原则

1. **创意质量与数量正相关**——早期判断是创意的敌人，先发散再收敛
2. **约束是创意的护栏不是枷锁**——思维逆转提供的约束确保方案不踩坑，而非限制想象力
3. **收敛必须有结构化依据**——对比矩阵和假设验证为方案选择提供客观支撑，直觉决策是最后手段

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill输出文件缺失 | 阻塞当前阶段，提示人类补充上游输入或提供替代数据 |
| HMW维度覆盖不全 | 针对缺失维度补充生成，最多重试2次，仍不全则标注"维度覆盖不完整" |
| SCAMPER方案数量不足 | 针对稀缺维度补充生成，仍不足则降低方案数量阈值并标注 |
| 收敛阶段对比矩阵维度缺失 | 补充缺失维度评分，无法评分则标注"数据不足" |
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

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-design/ideation-orchestrator.md`，包含以下结构：

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
      output: output/phase-reports/pm-design/ideation-orchestrator.md
  stages:
    - id: ideation-workshop
      name: 创意工作坊
      depends_on: []
```

## 阶段执行计划

#### 调用 ideation-workshop

```
Skill: ideation-workshop
输入:
  problem_statement: 用户提供（或上游产出）
  user_research_data: 用户提供（或上游产出）
  current_solution: 可选
  competitor_solutions: 可选
  product_context: 可选
输出: output/pm-design/ideation-workshop/ideation-workshop.json + ideation-workshop.md
验证: HMW通过质量检查且6个维度都已覆盖；SCAMPER至少10个候选方案且7个维度都已覆盖；反转思维设计约束已生成且失败路径覆盖5个维度；Top5方案已深化且对比矩阵6个维度完整
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-design/ideation-workshop/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-design/ideation-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 创意工作坊完成 | HMW 6维度覆盖、SCAMPER 7维度覆盖且至少10个方案、反转思维设计约束已生成、Top5方案已深化且对比矩阵6维度完整 | 针对不达标项补充生成或重新深化 |
| 阶段总结已生成 | output/phase-reports/pm-design/ideation-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 方案最终选择 | 创意工作坊收敛完成，对比矩阵已生成 | 人类做最终方案选择，可接受AI推荐、调整优先级、组合方案或否决 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——新增子Skill执行协议、任务调度改为阶段执行计划、调度规则改为执行模式、阶段卡口和人类决策点改为表格、增加子Skill输入输出路径
- v5.0: 编排协议重构——子Skill执行协议改为编排协议、新增Pipeline定义、阶段执行计划改为调用指令格式、删除调度规则
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v7.0: 子Skill合并——ideation-hmw/ideation-scamper/ideation-inversion/ideation-convergence合并为ideation-workshop；Pipeline stages从4个阶段简化为1个阶段；阶段执行计划、阶段卡口、人类决策点相应更新
