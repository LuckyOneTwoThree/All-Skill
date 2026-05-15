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

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
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
    depends_on: [phase-1, phase-3]
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
下游衔接:
  primary:
    target: positioning-orchestrator
    reason: 商业模式设计完成，建议进入产品定位阶段，确定差异化定位策略
    input_mapping:
      business_outputs: "output/pm-strategy/business-model-canvas/ + business-pricing/ → positioning-strategy输入"
  alternatives:
    - target: planning-orchestrator
      reason: 如定位已明确，直接进入战略规划
      condition: 产品定位已在商业模式设计中确定时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

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

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 business-strategy-report（商业战略规划报告）
- v4.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范
- v5.0: 核心原则替换为编排理念原则，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v7.0: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
