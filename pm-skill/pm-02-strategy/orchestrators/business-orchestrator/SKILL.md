---
name: business-orchestrator
description: 当需要设计或评估产品商业模式时使用。商业模式指挥官，调度business-model-canvas/value-fit/pricing/strategy-report。关键词：商业模式、商业画布、定价策略、商业战略报告。
metadata:
  module: "产品商业与战略"
  sub-module: "商业模式设计"
  type: "orchestrator"
  version: "4.0"
---

# 商业模式设计指挥官

## 核心原则

商业模式不是设计出来的，是验证出来的。

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

### 阶段1：business-model-canvas

| 项目 | 内容 |
|------|------|
| 子Skill名称 | business-model-canvas |
| 读取定义路径 | `.trae/skills/business-model-canvas/SKILL.md` |
| 输入 | product_context（来自 user-research-user-modeling / opportunity-brief）；market_data（来自 market-competitor-intel） |
| 输出 | `output/pm-strategy/business-model-canvas/`（bmc.json + 假设清单） |
| 验证 | BMC 9格全部填充、假设已标注 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | BMC 9格全部填充、假设已标注 → 未通过：补充缺失要素，无法填充的标注为待验证假设 |

### 阶段2：business-value-fit

| 项目 | 内容 |
|------|------|
| 子Skill名称 | business-value-fit |
| 读取定义路径 | `.trae/skills/business-value-fit/SKILL.md` |
| 输入 | BMC价值主张（来自阶段1 `output/pm-strategy/business-model-canvas/bmc.json`）；用户研究数据（来自 user-research-user-modeling / user-research-voice-analysis） |
| 输出 | `output/pm-strategy/business-value-fit/`（evaluation_report.json） |
| 验证 | 价值主张匹配度≥3.0 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | 价值主张匹配度≥3.0 → 未通过：匹配度<3.0触发人类决策者介入评估 |

### 阶段3：business-pricing

| 项目 | 内容 |
|------|------|
| 子Skill名称 | business-pricing |
| 读取定义路径 | `.trae/skills/business-pricing/SKILL.md` |
| 输入 | BMC数据（来自阶段1 `output/pm-strategy/business-model-canvas/bmc.json`）；竞品定价数据（来自 market-competitor-intel → competitor-intel.json）；支付意愿推断数据（用户提供） |
| 输出 | `output/pm-strategy/business-pricing/`（pricing_analysis.json） |
| 验证 | 3个定价方案已生成 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 3个定价方案已生成 → 未通过：补充缺失方案，确保差异化定位 |

### 阶段4：business-strategy-report

| 项目 | 内容 |
|------|------|
| 子Skill名称 | business-strategy-report |
| 读取定义路径 | `.trae/skills/business-strategy-report/SKILL.md` |
| 输入 | 商业画布（来自阶段1 `output/pm-strategy/business-model-canvas/bmc.json`）；定价策略（来自阶段3 `output/pm-strategy/business-pricing/pricing_analysis.json`）；产品/业务信息（用户提供）；其他可选输入：SWOT、OKR、路线图、定位、价值曲线、差异化评估、利益相关者、北极星指标 |
| 输出 | `output/pm-strategy/business-strategy-report/`（business-strategy-report.md + business-strategy-report.json） |
| 验证 | 报告执行摘要完整，至少2个战略方向 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 报告执行摘要完整，至少2个战略方向 → 未通过：补充战略方向或标注"建议补充战略分析" |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/pm-strategy/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| BMC生成完成 | BMC 9格全部填充、假设已标注 | 补充缺失要素，无法填充的标注为待验证假设 |
| 价值主张匹配完成 | 价值主张匹配度≥3.0 | 匹配度<3.0触发人类决策者介入评估 |
| 定价方案完成 | 3个定价方案已生成 | 补充缺失方案，确保差异化定位 |
| 商业战略报告完成 | 报告执行摘要完整，至少2个战略方向 | 补充战略方向或标注"建议补充战略分析" |

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
