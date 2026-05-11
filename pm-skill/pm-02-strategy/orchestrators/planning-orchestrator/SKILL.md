---
name: planning-orchestrator
description: 当需要进行产品立项、战略规划或路线图制定时使用。战略规划指挥官，调度产品提案、SWOT、五力模型、OKR、北极星、路线图、安索夫等子Skill。关键词：产品立项、战略规划、SWOT、OKR、路线图、战略分析。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "orchestrator"
  version: "4.0"
---

# 战略规划与路线图指挥官

## 核心原则

确保做正确的事，而非正确地做事。

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

### 阶段0：product-proposal

| 项目 | 内容 |
|------|------|
| 子Skill名称 | product-proposal |
| 读取定义路径 | `.trae/skills/product-proposal/SKILL.md` |
| 输入 | 竞品分析报告（来自 market-competitor-report → competitor-report.md）；市场规模数据（来自 market-tam-som → tam-som.json）；用户研究报告（来自 user-research-report → user-research-report.md）；机会简报（来自 opportunity-brief → opportunity_brief.json）；定位陈述（来自 output/pm-strategy/positioning-statement/positioning-statements.json）；产品名称与品类、商业目标（用户提供）；资源约束（可选，用户提供） |
| 输出 | `output/pm-strategy/product-proposal/`（product-proposal.md + product-proposal.json） |
| 验证 | 提案书人类已签批 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 提案书人类已签批 → 未通过：补充数据后重新提交 |

### 阶段1：planning-swot

| 项目 | 内容 |
|------|------|
| 子Skill名称 | planning-swot |
| 读取定义路径 | `.trae/skills/planning-swot/SKILL.md` |
| 输入 | 探索阶段输出（来自 user-research-user-modeling / opportunity-brief）；竞品分析数据（来自 market-competitor-intel → competitor-intel.json）；BMC商业模式画布（来自 output/pm-strategy/business-model-canvas/bmc.json）；内部能力评估（可选，用户提供） |
| 输出 | `output/pm-strategy/planning-swot/`（swot.json） |
| 验证 | SWOT战略方向人类已选择 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | SWOT战略方向人类已选择 → 未通过：置信度<0.6的项目升级人类校准 |

### 阶段2：planning-porter-five-forces

| 项目 | 内容 |
|------|------|
| 子Skill名称 | planning-porter-five-forces |
| 读取定义路径 | `.trae/skills/planning-porter-five-forces/SKILL.md` |
| 输入 | 竞品分析数据（来自 market-competitor-intel → competitor-intel.json）；市场数据（来自 market-tam-som → tam-som.json）；行业信息（可选，来自 market-pest → pest.json） |
| 输出 | `output/pm-strategy/planning-porter-five-forces/`（porter_five_forces.json） |
| 验证 | 波特五力评分完成 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 波特五力评分完成 → 未通过：各力量评分需人类校准确认 |

### 阶段3：planning-okr

| 项目 | 内容 |
|------|------|
| 子Skill名称 | planning-okr |
| 读取定义路径 | `.trae/skills/planning-okr/SKILL.md` |
| 输入 | SWOT战略方向（来自阶段1 `output/pm-strategy/planning-swot/swot.json`）；北极星指标（来自阶段4 `output/pm-strategy/planning-north-star/north_star.json`，若已执行）；BMC商业模式画布（可选，来自 output/pm-strategy/business-model-canvas/bmc.json）；业务现状数据（可选，用户提供） |
| 输出 | `output/pm-strategy/planning-okr/`（okr.json） |
| 验证 | OKR人类已确认 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | OKR人类已确认 → 未通过：达成概率<0.3升级调整，>0.9升级增加挑战 |

### 阶段4：planning-north-star

| 项目 | 内容 |
|------|------|
| 子Skill名称 | planning-north-star |
| 读取定义路径 | `.trae/skills/planning-north-star/SKILL.md` |
| 输入 | 用户价值数据（来自 user-research-user-modeling / user-research-voice-analysis）；BMC商业模式画布（来自 output/pm-strategy/business-model-canvas/bmc.json）；业务现状数据（可选，用户提供） |
| 输出 | `output/pm-strategy/planning-north-star/`（north_star.json） |
| 验证 | 北极星指标人类已选择 |
| 执行模式 | 👤→🤖 人类执行，AI辅助 |
| ⏸ 阶段卡口 | 北极星指标人类已选择 → 未通过：必须人类决策，AI只提供分析支撑 |

### 阶段5：planning-roadmap

| 项目 | 内容 |
|------|------|
| 子Skill名称 | planning-roadmap |
| 读取定义路径 | `.trae/skills/planning-roadmap/SKILL.md` |
| 输入 | OKR目标与关键结果（来自阶段3 `output/pm-strategy/planning-okr/okr.json`）；SWOT战略方向（来自阶段1 `output/pm-strategy/planning-swot/swot.json`）；需求优先级评分（可选，来自 requirements-prioritization）；资源约束条件（可选，用户提供） |
| 输出 | `output/pm-strategy/planning-roadmap/`（roadmap.json） |
| 验证 | 路线图资源人类已审批 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 路线图资源人类已审批 → 未通过：优先级和资源分配必须人类决策 |

### 阶段6：planning-ansoff

| 项目 | 内容 |
|------|------|
| 子Skill名称 | planning-ansoff |
| 读取定义路径 | `.trae/skills/planning-ansoff/SKILL.md` |
| 输入 | 当前产品定义、当前市场定义（用户提供）；增长目标（可选，来自阶段3 `output/pm-strategy/planning-okr/okr.json`）；SWOT分析结果（可选，来自阶段1 `output/pm-strategy/planning-swot/swot.json`） |
| 输出 | `output/pm-strategy/planning-ansoff/`（ansoff.json） |
| 验证 | Ansoff增长路径已选择 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | Ansoff增长路径已选择 → 未通过：增长路径必须人类最终决策 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/pm-strategy/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 产品提案已审批 | 提案书人类已签批 | 补充数据后重新提交 |
| SWOT完成 | SWOT战略方向人类已选择 | 置信度<0.6的项目升级人类校准 |
| 行业分析完成 | 波特五力评分完成 | 各力量评分需人类校准确认 |
| OKR完成 | OKR人类已确认 | 达成概率<0.3升级调整，>0.9升级增加挑战 |
| 北极星确认 | 北极星指标人类已选择 | 必须人类决策，AI只提供分析支撑 |
| 路线图完成 | 路线图资源人类已审批 | 优先级和资源分配必须人类决策 |
| 增长路径确认 | Ansoff增长路径已选择 | 增长路径必须人类最终决策 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 产品立项审批 | 阶段0 product-proposal 生成产品提案书 | 人类决定是否立项 |
| 战略方向选择 | 阶段1 planning-swot 生成SO/ST/WO/WT四种战略方向 | 人类选择最终战略方向 |
| OKR确认 | 阶段3 planning-okr 生成OKR候选 | 人类确认最终OKR |
| 路线图优先级 | 阶段5 planning-roadmap 计算RICE评分并排序 | 人类决定最终优先级和资源分配 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 product-proposal（产品提案），新增 Stage 0 产品立项审批决策点
- v4.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范
