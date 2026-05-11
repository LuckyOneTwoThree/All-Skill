---
name: opportunity-orchestrator
description: 当需要执行完整的机会识别与定义流程时使用。机会识别指挥官，调度opportunity-scoring/hmw/problem-statement/brief。关键词：机会识别、机会评分、HMW、Problem Statement、Opportunity Brief。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "orchestrator"
  version: "4.0"
---

# 机会识别指挥官

## 核心原则

好机会不是找到的，是定义出来的。

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

### 阶段1：opportunity-scoring

| 项目 | 内容 |
|------|------|
| 子Skill名称 | opportunity-scoring |
| 读取定义路径 | `.trae/skills/opportunity-scoring/SKILL.md` |
| 输入 | `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`（用户痛点数据）+ `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json`（行为数据）+ `output/pm-discovery/market-tam-som/tam-som.json`（SOM估算值）+ `output/pm-discovery/market-competitor-intel/competitor-intel.json`（竞品能力与壁垒）+ 技术团队评估（可选，用户提供） |
| 输出 | `output/pm-discovery/opportunity-scoring/opportunity-scoring.json` |
| 验证 | 5个维度均已评分，战略契合度标记为needs_human=true，评分依据完整 |
| 执行模式 | 🤖 AI自动执行（战略契合度维度👤由人类判定） |
| ⏸ 阶段卡口 | 5个维度均已评分，战略契合度由人类判定 → 未通过：等待人类判定战略契合度 |

### 阶段2：opportunity-hmw

| 项目 | 内容 |
|------|------|
| 子Skill名称 | opportunity-hmw |
| 读取定义路径 | `.trae/skills/opportunity-hmw/SKILL.md` |
| 输入 | `output/pm-discovery/opportunity-problem-statement/problem-statement.json`（Problem Statement）+ `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`（用户痛点）+ `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json`（行为数据） |
| 输出 | `output/pm-discovery/opportunity-hmw/hmw.json` |
| 验证 | 4个维度（eliminate_barriers/enhance_experience/create_value/redefine）均已覆盖，总计8-12个HMW陈述 |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | 4维度均已覆盖，总计8-12个HMW陈述 → 未通过：补充Problem Statement或用户研究数据 |

### 阶段3：opportunity-problem-statement

| 项目 | 内容 |
|------|------|
| 子Skill名称 | opportunity-problem-statement |
| 读取定义路径 | `.trae/skills/opportunity-problem-statement/SKILL.md` |
| 输入 | `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`（用户痛点）+ `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json`（行为数据）+ `output/pm-discovery/user-research-user-modeling/persona.json`（用户画像）+ `output/pm-discovery/insight-jtbd/jtbd.json`（待办任务）+ `output/pm-discovery/insight-kano/kano.json`（需求分类）+ `output/pm-discovery/opportunity-scoring/opportunity-scoring.json`（可选，已评分的机会信息） |
| 输出 | `output/pm-discovery/opportunity-problem-statement/problem-statement.json` |
| 验证 | 5项质量检查全部通过（quality_check.all_passed=true），数据支撑完整 |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | 5项质量检查全部通过 → 未通过：针对未通过项定向修复重试，3次仍不通过升级人类 |

### 阶段4：opportunity-brief

| 项目 | 内容 |
|------|------|
| 子Skill名称 | opportunity-brief |
| 读取定义路径 | `.trae/skills/opportunity-brief/SKILL.md` |
| 输入 | `output/pm-discovery/user-research-voice-analysis/voice-analysis.json` + `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json` + `output/pm-discovery/user-research-user-modeling/persona.json` + `output/pm-discovery/insight-jtbd/jtbd.json` + `output/pm-discovery/insight-kano/kano.json` + `output/pm-discovery/market-tam-som/tam-som.json` + `output/pm-discovery/market-competitor-intel/competitor-intel.json` + `output/pm-discovery/opportunity-scoring/opportunity-scoring.json` + `output/pm-discovery/opportunity-hmw/hmw.json` + `output/pm-discovery/opportunity-problem-statement/problem-statement.json` |
| 输出 | `output/pm-discovery/opportunity-brief/opportunity-brief.json` |
| 验证 | 证据摘要3个子字段均有内容，关键假设已列出可验证性，人类决策项非空，机会评分完整 |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | 证据摘要完整，关键假设可验证，人类决策项非空 → 未通过：补充上游数据或等待人类决策 |

## 调度规则

- 每次只执行当前阶段的子Skill，完成后再执行下一阶段，不要一次性加载所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件，按其指令执行，不要自行推断执行逻辑
- 每个阶段完成后，将中间结果写入 `output/pm-discovery/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | opportunity-scoring.json 已生成 | 补充用户研究/市场/竞品数据或检查子Skill执行结果 |
| 战略契合度已人类判定 | strategic_fit.needs_human已由人类确认评分 | 等待人类判定战略契合度 |
| 阶段2完成 | hmw.json 已生成，4维度均已覆盖 | 补充Problem Statement或用户研究数据 |
| 阶段3完成 | problem-statement.json 已生成，quality_check.all_passed=true | 质量检查不通过则自动重试（最多3次），3次仍不通过升级人类 |
| Problem Statement质量检查通过 | 5项质量检查全部通过 | 针对未通过项定向修复重试 |
| 阶段4完成 | opportunity-brief.json 已生成，人类已做最终决策 | 补充上游数据或等待人类决策 |
| Opportunity Brief人类已决策 | human_decisions_needed中各项已确认 | 等待人类审批决策项 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 战略契合度判定 | opportunity-scoring完成 | 确认每个机会的战略契合度评分（AI仅提供分析建议，最终得分必须由人类判定） |
| Problem Statement质量检查 | opportunity-problem-statement质量检查3次不通过 | 人工审核所有尝试版本并决定最终Problem Statement |
| Opportunity Brief最终决策 | opportunity-brief完成 | 审批机会简报的结论、关键假设验证优先级和推荐下一步方案 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格和人类决策点表格
- v4.0: 统一阶段执行计划为表格格式，移除数据流转图
