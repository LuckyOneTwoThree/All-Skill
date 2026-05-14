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

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-strategy/business-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

```yaml
pipeline: business-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/business-orchestrator.md

stages:
  - id: phase-1
    name: "商业画布"
    skills: [business-model-canvas]
    gate:
      condition: "BMC 9格全部填充、假设已标注"
      fail_action: "补充缺失要素，无法填充的标注为待验证假设"

  - id: phase-2
    name: "价值匹配"
    depends_on: [phase-1]
    skills: [business-value-fit]
    gate:
      condition: "价值主张匹配度≥3.0"
      fail_action: "匹配度<3.0触发人类决策者介入评估"

  - id: phase-3
    name: "定价策略"
    depends_on: [phase-1]
    skills: [business-pricing]
    gate:
      condition: "3个定价方案已生成"
      fail_action: "补充缺失方案，确保差异化定位"

  - id: phase-4
    name: "商业战略报告"
    depends_on: [phase-1, phase-2, phase-3]
    skills: [business-strategy-report]
    gate:
      condition: "报告执行摘要完整，至少2个战略方向"
      fail_action: "补充战略方向或标注建议补充战略分析"
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

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-strategy/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-strategy/business-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| BMC生成完成 | BMC 9格全部填充、假设已标注 | 补充缺失要素，无法填充的标注为待验证假设 |
| 价值主张匹配完成 | 价值主张匹配度≥3.0 | 匹配度<3.0触发人类决策者介入评估 |
| 定价方案完成 | 3个定价方案已生成 | 补充缺失方案，确保差异化定位 |
| 商业战略报告完成 | 报告执行摘要完整，至少2个战略方向 | 补充战略方向或标注"建议补充战略分析" |
| 阶段总结已生成 | output/phase-reports/pm-strategy/business-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1某子Skill失败 | 暂停编排，输出失败诊断信息，请求人类介入修复后重试该阶段 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 所有上游数据全部缺失 | 终止编排，输出数据依赖图和缺失清单，要求人类提供最小必要输入后重新启动 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 收入模型选择 | 阶段1 business-model-canvas 生成多个收入模式选项 | 人类选择最终收入模式方案 |
| 定价数字拍板 | 阶段3 business-pricing 提供定价分析和方案 | 人类决定具体定价数字和套餐结构 |
| 商业战略方向确认 | 阶段4 business-strategy-report 推荐战略方向 | 人类确认最终战略选择 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 business-strategy-report（商业战略规划报告）
- v4.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范
- v5.0: 核心原则替换为编排理念原则，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v7.0: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
