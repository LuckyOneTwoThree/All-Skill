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

编排协议遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: ideation-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-design/ideation-orchestrator.md

stages:
  - id: phase-1
    name: "创意工作坊"
    depends_on: []
    skills: [ideation-workshop]
    gate:
      condition: "HMW 6维度覆盖、SCAMPER 7维度覆盖且至少10个方案、反转思维设计约束已生成、Top5方案已深化且对比矩阵6维度完整"
      fail_action: "针对不达标项补充生成或重新深化"
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

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 阶段总结协议。

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-design/ideation-workshop/ |
| 总结输出路径 | output/phase-reports/pm-design/ideation-orchestrator.md |

下游衔接:
  primary: design-orchestrator（创意发散完成，将创意方案转化为PRD）
  alternatives:
    - target: validation-orchestrator
      reason: 创意方案存在高风险假设，需先验证
      condition: 创意方案中关键假设风险等级≥高时
    - target: opportunity-orchestrator
      reason: 创意方向不明确，需回溯到机会定义
      condition: 创意收敛后仍无法形成明确产品方向时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 创意工作坊完成 | ideation-workshop输出文件已生成且非空 | 针对不达标项补充生成或重新深化 |
| 阶段总结已生成 | output/phase-reports/pm-design/ideation-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 方案最终选择 | 创意工作坊收敛完成，对比矩阵已生成 | 人类做最终方案选择，可接受AI推荐、调整优先级、组合方案或否决 |
