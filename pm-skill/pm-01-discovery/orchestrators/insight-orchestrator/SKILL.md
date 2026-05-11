---
name: insight-orchestrator
description: 当需要执行完整的需求分析流程时使用。需求洞察指挥官，按阶段调度子Skill执行，包括insight-jtbd、insight-requirement-layers、insight-5whys、insight-kano、insight-priority-scoring。关键词：需求分析流程、需求洞察编排、需求优先级全流程、JTBD、5Whys、KANO、优先级评分。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "orchestrator"
  version: "5.0"
---

# 需求洞察指挥官

## 核心原则

1. **需求≠问题**——用户描述的是解决方案不是问题本身，编排器确保先拆解（requirement-layers）再分析（jtbd/5whys），避免停留在表面需求
2. **多维度交叉验证**——JTBD+需求三层+5Whys+KANO四维交叉，单一维度结论不可信，编排器确保各维度数据汇合后才输出最终优先级
3. **串行依赖并行独立**——有数据依赖的步骤串行（5whys依赖jtbd），无依赖的步骤并行（jtbd与requirement-layers可并行），缩短整体周期
4. **人类决策不可替代**——情感诉求验证、KANO边界判定、优先级权重确认必须人类参与，编排器在每个阶段卡口设置人类决策点

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
| 验证 | chains和root_cause字段非空，actionable_fix含effort/impact |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | chains和root_cause字段非空 → 未通过：检查输入数据是否充分 |

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
| 验证 | priority_list和total_score字段非空，score_confidence已标注，base_score和kano_bonus分别计算 |
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

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1某子Skill失败 | 不阻塞另一子Skill，失败子Skill使用降级方案继续，标注"降级执行" |
| jtbd.json无Functional Job | 终止阶段2（5whys依赖Functional Job），直接进入阶段3（kano不依赖jtbd） |
| 5whys.json根因为空 | 标注"根因未定位"，阶段4中痛点强度维度使用默认值，score_confidence降级 |
| kano.json全部为边界情况 | 全部升级人类判定，阶段4暂缓执行直到KANO分类确认 |
| priority-scoring权重未确认 | 输出评分结果但标注"权重待确认"，建议人类确认后再进入下游编排器 |
| 上游数据全部缺失 | 降级为轻量版流程：用户口述需求 → requirement-layers拆解 → 基于描述评分 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格
- v4.0: 统一阶段执行计划为表格格式，移除数据流转图
- v5.0: 核心原则重写为编排理念；新增异常处理表；阶段2验证条件更新为chains（支持多路径）；阶段4验证条件新增base_score/kano_bonus
