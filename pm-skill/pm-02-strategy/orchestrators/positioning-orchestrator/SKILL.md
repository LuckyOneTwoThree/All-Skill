---
name: positioning-orchestrator
description: 当需要确定产品定位或评估差异化策略时使用。产品定位指挥官，调度positioning-strategy。关键词：产品定位、差异化、价值曲线、竞争策略、品牌定位、市场定位、竞争优势。
metadata:
  module: "产品商业与战略"
  sub-module: "产品定位与差异化"
  type: "orchestrator"
  version: "7.0"
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
- 详细输出写入 `output/pm-strategy/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-strategy/positioning-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline 定义

```yaml
pipeline: positioning-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/positioning-orchestrator.md

stages:
  - id: phase-1
    name: "定位策略"
    skills: [positioning-strategy]
    gate:
      condition: "定位陈述质量检查5项全部通过，差异化强度≥0.5，排他陈述已生成"
      fail_action: "定位陈述不通过自动重试≤3次；差异化强度<0.5警告；排他决策必须由人类产品负责人做出"
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
- **验证**: 定位陈述质量检查5项全部通过，差异化强度≥0.5，排他陈述已生成
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: 定位陈述质量检查5项全部通过，差异化强度≥0.5，排他陈述已生成 → 未通过：定位陈述不通过自动重试≤3次；差异化强度<0.5警告；排他决策必须由人类产品负责人做出

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-strategy/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-strategy/positioning-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 定位策略完成 | 定位陈述质量检查5项全部通过 | 自动重试≤3次，仍不通过升级人类 |
| 差异化强度达标 | 差异化强度≥0.5 | <0.5警告，蓝海动作需人类审核战略意图 |
| 差异化评估完成 | 5个维度都已评估 | 各维度需人类校准，综合推荐需人类最终判断 |
| 排他决策完成 | 排他陈述已生成 | 排他决策必须由人类产品负责人做出 |
| 阶段总结已生成 | output/phase-reports/pm-strategy/positioning-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1子Skill失败 | 暂停编排，输出失败诊断信息，请求人类介入修复后重试该阶段 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 所有上游数据全部缺失 | 终止编排，输出数据依赖图和缺失清单，要求人类提供最小必要输入后重新启动 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 定位陈述最终选择 | 阶段1 positioning-strategy 生成3-5个候选 | 人类选择最终定位陈述 |
| 差异化评估校准 | 阶段1 positioning-strategy 差异化评估完成 | 人类校准主观维度评分 |
| 排他决策 | 阶段1 positioning-strategy 提供排他建议 | 人类决定不为哪些用户服务 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范
- v4.0: 核心原则替换为编排理念原则，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.0: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v7.0: 合并定位四件套——将positioning-statement/value-curve/differentiation/exclusion合并为positioning-strategy；Pipeline stages从4阶段简化为1阶段；更新阶段执行计划、阶段卡口和人类决策点
