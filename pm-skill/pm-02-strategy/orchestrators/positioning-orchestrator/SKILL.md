---
name: positioning-orchestrator
description: 当需要确定产品定位或评估差异化策略时使用。产品定位指挥官，调度positioning-statement/value-curve/differentiation/exclusion。关键词：产品定位、差异化、价值曲线、竞争策略。
metadata:
  module: "产品商业与战略"
  sub-module: "产品定位与差异化"
  type: "orchestrator"
  version: "3.0"
---

# 产品定位与差异化指挥官

## 核心原则

定位的本质是选择不为谁服务。

## 执行步骤

1. **选项生成优于单一推荐**：每个关键决策点生成2-3个可比较选项，由人类选择而非AI替选
2. **数据驱动填充人类驱动选择**：AI负责数据整合与逻辑推导，人类负责方向判断与最终决策
3. **假设显式化**：所有推断内容必须标注为假设，包含风险等级和验证方法
4. **财务建模自动化**：单位经济、敏感性分析等财务计算由AI自动完成，人类只审核结论

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：positioning-statement

| 项目 | 内容 |
|------|------|
| 子Skill名称 | positioning-statement |
| 读取定义路径 | `.trae/skills/positioning-statement/SKILL.md` |
| 输入 | 探索阶段输出（来自 user-research-user-modeling / opportunity-brief）；BMC（来自 output/pm-strategy/business-model-canvas/bmc.json）；竞品分析数据（来自 market-competitor-intel → competitor-intel.json） |
| 输出 | `output/pm-strategy/positioning-statement/positioning-statements.json` |
| 验证 | 定位陈述质量检查5项全部通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 定位陈述质量检查5项全部通过 → 未通过：自动重试≤3次，仍不通过升级人类 |

### 阶段2：positioning-value-curve

| 项目 | 内容 |
|------|------|
| 子Skill名称 | positioning-value-curve |
| 读取定义路径 | `.trae/skills/positioning-value-curve/SKILL.md` |
| 输入 | 竞品分析数据（来自 market-competitor-intel → competitor-intel.json）；自身产品能力评估（用户提供）；用户研究数据（来自 user-research-user-modeling → persona.json） |
| 输出 | `output/pm-strategy/positioning-value-curve/value-curve.json` |
| 验证 | 差异化强度≥0.5 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 差异化强度≥0.5 → 未通过：<0.5警告，蓝海动作需人类审核战略意图 |

### 阶段3：positioning-differentiation

| 项目 | 内容 |
|------|------|
| 子Skill名称 | positioning-differentiation |
| 读取定义路径 | `.trae/skills/positioning-differentiation/SKILL.md` |
| 输入 | 价值曲线（来自阶段2 `output/pm-strategy/positioning-value-curve/value-curve.json`）；竞品分析（来自 market-competitor-intel → competitor-intel.json）；自身能力评估（可选，用户提供） |
| 输出 | `output/pm-strategy/positioning-differentiation/differentiation-assessment.json` |
| 验证 | 5个维度都已评估 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 5个维度都已评估 → 未通过：各维度需人类校准，综合推荐需人类最终判断 |

### 阶段4：positioning-exclusion

| 项目 | 内容 |
|------|------|
| 子Skill名称 | positioning-exclusion |
| 读取定义路径 | `.trae/skills/positioning-exclusion/SKILL.md` |
| 输入 | positioning-statement输出（来自阶段1 `output/pm-strategy/positioning-statement/positioning-statements.json`）；竞品分析（来自 market-competitor-intel → competitor-intel.json） |
| 输出 | `output/pm-strategy/positioning-exclusion/exclusion-decision.json` |
| 验证 | 排他陈述已生成 |
| 执行模式 | 👤 人类执行，AI辅助 |
| ⏸ 阶段卡口 | 排他陈述已生成 → 未通过：排他决策必须由人类产品负责人做出 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/pm-strategy/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 定位陈述完成 | 定位陈述质量检查5项全部通过 | 自动重试≤3次，仍不通过升级人类 |
| 价值曲线完成 | 差异化强度≥0.5 | <0.5警告，蓝海动作需人类审核战略意图 |
| 差异化评估完成 | 5个维度都已评估 | 各维度需人类校准，综合推荐需人类最终判断 |
| 排他决策完成 | 排他陈述已生成 | 排他决策必须由人类产品负责人做出 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 定位陈述最终选择 | 阶段1 positioning-statement 生成3-5个候选 | 人类选择最终定位陈述 |
| 排他决策 | 阶段4 positioning-exclusion 提供排他建议 | 人类决定不为哪些用户服务 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范
