---
name: insight-orchestrator
description: 当需要执行完整的需求分析流程时使用。需求洞察指挥官，按阶段调度子Skill执行，包括insight-jtbd、insight-requirement-layers、insight-5whys、insight-kano、insight-priority-scoring。关键词：需求分析流程、需求洞察编排、需求优先级全流程、JTBD、5Whys、KANO、优先级评分。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "orchestrator"
  version: "4.0"
---

# 需求洞察指挥官

## 核心原则

需求≠问题，用户描述的是解决方案不是问题本身。

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
| 子Skill名称 | insight-jtbd |
| 读取定义路径 | `.trae/skills/insight-jtbd/SKILL.md` |
| 输入 | 用户反馈数据 + 行为数据（用户提供或从 `output/pm-discovery/user-research-voice-analysis/voice-analysis.json` 和 `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json` 读取） |
| 输出 | `output/pm-discovery/insight-jtbd/jtbd.json` |
| 验证 | jobs数组非空，三层Job（functional/emotional/social）均已提取 |
| 执行模式 | 🤖→👤 AI建议人类审批 |

**子Skill B**：

| 项目 | 内容 |
|------|------|
| 子Skill名称 | insight-requirement-layers |
| 读取定义路径 | `.trae/skills/insight-requirement-layers/SKILL.md` |
| 输入 | 原始需求列表（用户提供或从 `output/pm-discovery/user-research-voice-analysis/voice-analysis.json` 读取） |
| 输出 | `output/pm-discovery/insight-requirement-layers/requirement-layers.json` |
| 验证 | requirement_layers数组非空，三层（surface/behavioral/essential）均已拆解 |
| 执行模式 | 🤖→👤 AI建议人类审批 |

⏸ **阶段卡口**：jtbd.json + requirement-layers.json 均已生成且验证通过 → 未通过：补充输入数据或检查子Skill执行结果

### 阶段2：insight-5whys

| 项目 | 内容 |
|------|------|
| 子Skill名称 | insight-5whys |
| 读取定义路径 | `.trae/skills/insight-5whys/SKILL.md` |
| 输入 | `output/pm-discovery/insight-jtbd/jtbd.json`（待分析的问题现象） |
| 输出 | `output/pm-discovery/insight-5whys/5whys.json` |
| 验证 | chain和root_cause字段非空 |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | chain和root_cause字段非空 → 未通过：检查输入数据是否充分 |

### 阶段3：insight-kano

| 项目 | 内容 |
|------|------|
| 子Skill名称 | insight-kano |
| 读取定义路径 | `.trae/skills/insight-kano/SKILL.md` |
| 输入 | `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`（用户反馈数据）+ `output/pm-discovery/insight-requirement-layers/requirement-layers.json`（功能需求列表） |
| 输出 | `output/pm-discovery/insight-kano/kano.json` |
| 验证 | kano_classification字段非空，边界情况已标注 |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | kano_classification字段非空，边界情况已标注 → 未通过：边界情况升级人类判定 |

### 阶段4：insight-priority-scoring

| 项目 | 内容 |
|------|------|
| 子Skill名称 | insight-priority-scoring |
| 读取定义路径 | `.trae/skills/insight-priority-scoring/SKILL.md` |
| 输入 | `output/pm-discovery/insight-requirement-layers/requirement-layers.json`（需求列表）+ `output/pm-discovery/insight-kano/kano.json`（KANO分类结果）+ `output/pm-discovery/insight-jtbd/jtbd.json` 和 `output/pm-discovery/insight-5whys/5whys.json`（痛点数据） |
| 输出 | `output/pm-discovery/insight-priority-scoring/priority-scoring.json` |
| 验证 | priority_list和total_score字段非空，score_confidence已标注 |
| 执行模式 | 🤖→👤 AI建议人类审批（优先级权重需人类确认） |
| ⏸ 阶段卡口 | priority_list和total_score字段非空，score_confidence已标注 → 未通过：优先级权重需人类确认 |

## 调度规则

- 每次只执行当前阶段的子Skill，完成后再执行下一阶段，不要一次性加载所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件，按其指令执行，不要自行推断执行逻辑
- 每个阶段完成后，将中间结果写入 `output/pm-discovery/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | jtbd.json + requirement-layers.json 均已生成 | 补充输入数据或检查子Skill执行结果 |
| JTBD三层Job已提取 | functional/emotional/social Job均存在 | 补充数据重新执行insight-jtbd |
| 阶段2完成 | 5whys.json 已生成，root_cause非空 | 检查输入数据是否充分 |
| 阶段3完成 | kano.json 已生成，分类完成 | 边界情况升级人类判定 |
| 阶段4完成 | priority-scoring.json 已生成 | 优先级权重需人类确认 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Emotional/Social Job验证 | insight-jtbd完成 | 确认情感和社会诉求推断是否合理 |
| KANO边界判定 | insight-kano完成 | 确认边界情况的分类归属 |
| 优先级权重确认 | insight-priority-scoring完成 | 确认评分权重和最终优先级排序 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格
- v4.0: 统一阶段执行计划为表格格式，移除数据流转图
