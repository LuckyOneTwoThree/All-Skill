---
name: market-orchestrator
description: 当需要执行完整的市场与竞品分析流程时使用。市场竞品指挥官，调度market-tam-som/pest/competitor-intel/quadrant/report。关键词：市场分析、竞品分析、TAM/SAM/SOM、PEST、竞品情报、四象限。
metadata:
  module: "产品探索与发现"
  sub-module: "市场竞品"
  type: "orchestrator"
  version: "5.0"
---

# 市场竞品指挥官

## 核心原则

市场不是静态的赛场，而是动态的生态系统。

## 执行步骤

1. **数据优先人工补充**——AI处理大规模数据，人类补充定性洞察
2. **显式规则拒绝模糊**——所有分类/判断规则必须可编码
3. **批量并行规模优势**——能并行的步骤不串行
4. **标注置信度分级交付**——所有推断标注置信度，<0.5升级人类

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1（并行执行）

**子Skill A**：

| 项目 | 内容 |
|------|------|
| 子Skill名称 | market-tam-som |
| 读取定义路径 | `.trae/skills/market-tam-som/SKILL.md` |
| 输入 | 品类关键词 + 目标市场地理范围 + 测算时间范围（用户提供） |
| 输出 | `output/pm-discovery/market-tam-som/tam-som.json` |
| 验证 | tam/sam/som三层测算完整，每层含区间估计（乐观/中性/保守），关键假设已标注 |
| 执行模式 | 🤖→👤 AI建议人类审批 |

**子Skill B**：

| 项目 | 内容 |
|------|------|
| 子Skill名称 | market-pest |
| 读取定义路径 | `.trae/skills/market-pest/SKILL.md` |
| 输入 | 品类关键词 + 目标市场（用户提供） |
| 输出 | `output/pm-discovery/market-pest/pest.json` |
| 验证 | political/economic/social/technological四维度均已扫描，每维度至少3条趋势摘要 |
| 执行模式 | 🤖 AI自动执行 |

⏸ **阶段卡口**：tam-som.json + pest.json 均已生成且验证通过 → 未通过：补充品类关键词和目标市场信息或检查子Skill执行结果

### 阶段2：market-competitor-intel

| 项目 | 内容 |
|------|------|
| 子Skill名称 | market-competitor-intel |
| 读取定义路径 | `.trae/skills/market-competitor-intel/SKILL.md` |
| 输入 | 竞品列表 + 监控配置（用户提供），可选参考 `output/pm-discovery/market-tam-som/tam-som.json` 和 `output/pm-discovery/market-pest/pest.json` |
| 输出 | `output/pm-discovery/market-competitor-intel/competitor-intel.json` |
| 验证 | competitors数组非空，Feature Matrix已更新，竞品口碑对比已完成，战略方向推断已完成 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | competitors数组非空，Feature Matrix已更新 → 未通过：检查竞品列表是否充分 |

### 阶段3：market-competitor-quadrant

| 项目 | 内容 |
|------|------|
| 子Skill名称 | market-competitor-quadrant |
| 读取定义路径 | `.trae/skills/market-competitor-quadrant/SKILL.md` |
| 输入 | 品类关键词 + 已知竞品列表（用户提供），可选参考 `output/pm-discovery/market-competitor-intel/competitor-intel.json` |
| 输出 | `output/pm-discovery/market-competitor-quadrant/competitor-quadrant.json` |
| 验证 | 四象限（direct/indirect/substitutes/potential）均已填充，每项标注了数据来源和置信度 |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | 四象限均已填充，每项标注了数据来源和置信度 → 未通过：补充已知竞品名称或检查输入数据 |

### 阶段4：market-competitor-report

| 项目 | 内容 |
|------|------|
| 子Skill名称 | market-competitor-report |
| 读取定义路径 | `.trae/skills/market-competitor-report/SKILL.md` |
| 输入 | `output/pm-discovery/market-competitor-intel/competitor-intel.json` + `output/pm-discovery/market-competitor-quadrant/competitor-quadrant.json` + `output/pm-discovery/market-tam-som/tam-som.json` + `output/pm-discovery/market-pest/pest.json` + 品类关键词（用户提供）+ 自身产品信息（可选） |
| 输出 | `output/pm-discovery/market-competitor-report/competitor-report.md` + `output/pm-discovery/market-competitor-report/competitor-report.json` |
| 验证 | 执行摘要包含3条核心发现+Top1策略，每个核心竞品有完整SWOT分析，差异化策略至少3条 |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | 执行摘要包含3条核心发现+Top1策略 → 未通过：检查上游数据是否完整 |

## 调度规则

- 每次只执行当前阶段的子Skill，完成后再执行下一阶段，不要一次性加载所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件，按其指令执行，不要自行推断执行逻辑
- 每个阶段完成后，将中间结果写入 `output/pm-discovery/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | tam-som.json + pest.json 均已生成 | 补充品类关键词和目标市场信息或检查子Skill执行结果 |
| TAM/SAM/SOM关键假设已标注 | tam-som.json 中 key_assumptions 非空 | 补充数据重新执行market-tam-som |
| 阶段2完成 | competitor-intel.json 已生成，Feature Matrix已更新 | 检查竞品列表是否充分 |
| 竞品Feature Matrix已更新 | competitors数组中feature_matrix非空 | 补充竞品信息重新执行market-competitor-intel |
| 阶段3完成 | competitor-quadrant.json 已生成，四象限已填充 | 补充已知竞品名称或检查输入数据 |
| 差异化机会已识别 | reputation_comparison中differentiation_opportunities非空 | 补充竞品口碑数据 |
| 阶段4完成 | competitor-report.md + competitor-report.json 均已生成 | 检查上游数据是否完整 |
| 竞品分析报告执行摘要完整 | executive_summary含3条核心发现+Top1策略 | 补充上游数据重新生成报告 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| TAM/SAM/SOM关键假设验证 | market-tam-som完成 | 确认关键假设是否合理，双路径差异>20%时需人类判断 |
| 竞品战略推断验证 | market-competitor-intel完成，战略推断置信度<0.5 | 确认竞品战略方向推断是否合理 |
| 差异化策略优先级确认 | market-competitor-report完成 | 确认差异化策略的优先级排序和资源分配 |
| 报告结论与行动建议审批 | market-competitor-report完成 | 审批竞品分析报告的最终结论和行动建议 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 market-competitor-report（竞品分析报告）
- v4.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格和人类决策点表格
- v5.0: 统一阶段执行计划为表格格式，移除数据流转图
