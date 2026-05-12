---
name: ideation-orchestrator
description: 当需要发散创意或构思解决方案时使用。创意发散与方案构思子模块指挥官，调度子Skill：ideation-hmw、ideation-scamper、ideation-inversion、ideation-convergence。关键词：创意发散、HMW、SCAMPER、方案构思、产品创意、思维逆转、方案收敛。
metadata:
  module: "产品构思与设计"
  sub-module: "创意发散与方案构思"
  type: "orchestrator"
  version: "5.0"
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

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-design/ideation-orchestrator.md`

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
  stages:
    - id: ideation-hmw
      name: HMW问题重构
      depends_on: []
    - id: ideation-scamper
      name: SCAMPER创意发散
      depends_on: [ideation-hmw]
      parallel_with: [ideation-inversion]
    - id: ideation-inversion
      name: 思维逆转分析
      depends_on: [ideation-hmw]
      parallel_with: [ideation-scamper]
    - id: ideation-convergence
      name: 方案收敛
      depends_on: [ideation-scamper, ideation-inversion]
```

## 阶段执行计划

#### 调用 ideation-hmw

```
Skill: ideation-hmw
输入:
  problem_statement: output/pm-design/requirements-understanding/requirement_analysis.json（或用户提供）
  user_research_data: output/pm-design/requirements-collection/requirements.json（或用户提供）
输出: output/pm-design/ideation-hmw/hmw_statements.json
验证: HMW通过质量检查，6个维度都已覆盖
模式: 🤖
```

#### 调用 ideation-scamper

```
Skill: ideation-scamper
输入:
  hmw_statements: output/pm-design/ideation-hmw/hmw_statements.json（选择发散潜力≥3的HMW）
  current_solution: 用户提供
  competitor_solutions: 可选
输出: output/pm-design/ideation-scamper/solutions.json
验证: 至少10个候选方案，7个SCAMPER维度都已覆盖
模式: 🤖
```

#### 调用 ideation-inversion

```
Skill: ideation-inversion
输入:
  product_goals: output/pm-design/ideation-hmw/hmw_statements.json（或用户提供）
  product_context: 可选
输出: output/pm-design/ideation-inversion/inversion_analysis.json
验证: 设计约束已生成，失败路径覆盖5个维度
模式: 🤖
```

#### 调用 ideation-convergence

```
Skill: ideation-convergence
输入:
  solutions: output/pm-design/ideation-scamper/solutions.json
  inversion_analysis: output/pm-design/ideation-inversion/inversion_analysis.json
  product_context: 可选
输出: output/pm-design/ideation-convergence/converged_solutions.json
验证: Top5方案已深化，对比矩阵6个维度完整
模式: 🤖→👤
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| HMW完成 | HMW通过质量检查 | 未通过质量检查的HMW重新生成，维度覆盖不全则补充 |
| 方案生成完成 | 至少10个候选方案 | 方案数量不足则针对稀缺维度补充生成 |
| 逆转分析完成 | 设计约束已生成 | 失败路径覆盖不全则补充，约束过于抽象则重新定义 |
| 收敛完成 | Top5方案已深化 | 深化不足则补充，对比矩阵不完整则补充缺失维度 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 方案最终选择 | 收敛完成，对比矩阵已生成 | 人类做最终方案选择，可接受AI推荐、调整优先级、组合方案或否决 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——新增子Skill执行协议、任务调度改为阶段执行计划、调度规则改为执行模式、阶段卡口和人类决策点改为表格、增加子Skill输入输出路径
- v5.0: 编排协议重构——子Skill执行协议改为编排协议、新增Pipeline定义、阶段执行计划改为调用指令格式、删除调度规则
