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

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

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

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-strategy/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-strategy/positioning-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: planning-orchestrator
    reason: 定位策略完成，制定OKR和路线图
    input_mapping:
      positioning_output: "output/pm-strategy/positioning-strategy/ → planning-okr输入"
  alternatives:
    - target: business-orchestrator
      reason: 定位结果影响商业模式，需回溯调整
      condition: 定位策略与现有商业模式不一致时
    - target: design-orchestrator
      reason: 定位已清晰且规划已完成，直接进入设计
      condition: OKR和路线图已在前序阶段完成时
  special_cases: []
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

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

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范
- v4.0: 核心原则替换为编排理念原则，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.0: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v7.0: 合并定位四件套——将positioning-statement/value-curve/differentiation/exclusion合并为positioning-strategy；Pipeline stages从4阶段简化为1阶段；更新阶段执行计划、阶段卡口和人类决策点
- v8.0: 透传编排器改造——description标注透传编排器；Pipeline阶段卡口精简为"输出文件已生成"和"阶段总结已生成"；人类决策点从3个精简为2个（定位陈述最终选择、排他决策）；异常处理精简；编排协议后增加透传说明
