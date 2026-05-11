---
name: user-research-orchestrator
description: 当需要执行完整的用户研究流程时使用。用户研究指挥官，调度voice-analysis/behavior-analysis/user-modeling/interview-assist/report。关键词：用户研究、VOC分析、行为分析、Persona、访谈辅助。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "orchestrator"
  version: "6.0"
---

# 用户研究指挥官

## 核心原则

1. **用户说的和做的不一样**——VOC（用户说的）和行为数据（用户做的）必须并行采集、交叉验证，单一信源结论不可信
2. **建模是假设不是事实**——Persona/Empathy Map/Journey Map都是基于数据的假设模型，必须人类审批确认后方可用于后续流程
3. **访谈是验证不是探索**——访谈的目的是验证已有假设（来自VOC和行为数据），不是漫无目的的探索，脚本必须锚定待验证假设
4. **报告是终点也是起点**——用户研究报告是研究阶段的终点，但也是产品决策的起点，报告必须包含可执行的行动建议

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
| 子Skill名称 | user-research-voice-analysis |
| 读取定义路径 | `.trae/skills/user-research-voice-analysis/SKILL.md` |
| 输入 | 应用商店评论 + 客服工单数据（用户提供），可选社交媒体提及 + 社区帖子 + 分析配置 |
| 输出 | `output/pm-discovery/user-research-voice-analysis/voice-analysis.json` |
| 验证 | sentiment_distribution非空，top_themes至少3个主题，top_pain_points已提取，置信度已标注 |
| 执行模式 | 🤖 AI自动执行 |

**子Skill B**：

| 项目 | 内容 |
|------|------|
| 子Skill名称 | user-research-behavior-analysis |
| 读取定义路径 | `.trae/skills/user-research-behavior-analysis/SKILL.md` |
| 输入 | 行为事件日志 + 漏斗数据（用户提供），可选热力图数据 + 分析配置 |
| 输出 | `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json` |
| 验证 | funnel_health非空，aha_moment_candidates已提取，feature_usage分析已完成，置信度已标注 |
| 执行模式 | 🤖 AI自动执行 |

⏸ **阶段卡口**：voice-analysis.json + behavior-analysis.json 均已生成且验证通过 → 未通过：补充用户反馈数据或行为数据

### 阶段2：user-research-user-modeling

| 项目 | 内容 |
|------|------|
| 子Skill名称 | user-research-user-modeling |
| 读取定义路径 | `.trae/skills/user-research-user-modeling/SKILL.md` |
| 输入 | `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`（用户声音洞察）+ `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json`（行为洞察）+ 问卷数据（可选，用户提供）+ 建模配置（可选，用户提供） |
| 输出 | `output/pm-discovery/user-research-user-modeling/persona.json` + `output/pm-discovery/user-research-user-modeling/empathy-map.json` + `output/pm-discovery/user-research-user-modeling/journey-map.json` |
| 验证 | personas数组非空，至少1个Persona置信度≥0.7，Empathy Map四象限完整，Journey Map阶段完整 |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | personas数组非空，至少1个Persona置信度≥0.7 → 未通过：标记建模不充分，建议补充数据或访谈 |

### 阶段3（可与阶段2并行）：user-research-interview-assist

| 项目 | 内容 |
|------|------|
| 子Skill名称 | user-research-interview-assist |
| 读取定义路径 | `.trae/skills/user-research-interview-assist/SKILL.md` |
| 输入 | `output/pm-discovery/user-research-user-modeling/persona.json`（可选，用户画像）+ 研究目标 + 访谈配置（用户提供）+ `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`（可选）+ `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json`（可选） |
| 输出 | `output/pm-discovery/user-research-interview-assist/interview-script.json` + `output/pm-discovery/user-research-interview-assist/interview-insights.json` |
| 验证 | interview-script.json中core_modules非空，每个核心问题有追问策略；interview-insights.json中validated_hypotheses或new_discoveries非空 |
| 执行模式 | 👤→🤖 人类执行AI辅助 |
| ⏸ 阶段卡口 | interview-script.json已生成，访谈执行后interview-insights.json已生成 → 未通过：检查研究目标和访谈配置是否完整 |

### 阶段4：user-research-report

| 项目 | 内容 |
|------|------|
| 子Skill名称 | user-research-report |
| 读取定义路径 | `.trae/skills/user-research-report/SKILL.md` |
| 输入 | `output/pm-discovery/user-research-voice-analysis/voice-analysis.json`（可选）+ `output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json`（可选）+ `output/pm-discovery/user-research-user-modeling/persona.json`（可选）+ `output/pm-discovery/user-research-interview-assist/interview-script.json`（可选）+ 研究目标（用户提供）+ 产品/品类信息（可选） |
| 输出 | `output/pm-discovery/user-research-report/user-research-report.md` + `output/pm-discovery/user-research-report/user-research-report.json` |
| 验证 | 执行摘要包含3条核心发现+Top1建议，每个Persona有代表性用户原话，行动建议至少3条且有优先级 |
| 执行模式 | 🤖→👤 AI建议人类审批 |
| ⏸ 阶段卡口 | 执行摘要包含3条核心发现+Top1建议 → 未通过：补充上游数据重新生成报告 |

## 调度规则

- 每次只执行当前阶段的子Skill，完成后再执行下一阶段，不要一次性加载所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件，按其指令执行，不要自行推断执行逻辑
- 每个阶段完成后，将中间结果写入 `output/pm-discovery/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | voice-analysis.json + behavior-analysis.json 均已生成 | 补充用户反馈数据或行为数据 |
| 用户声音分析覆盖量 | 反馈覆盖≥500条 | 标记数据不足，输出降级为探索性结论 |
| 阶段2完成 | persona.json 已生成且人类审批通过 | 补充数据或调整建模参数重新执行 |
| 至少1个Persona置信度≥0.7 | personas数组中存在confidence≥0.7的Persona | 标记建模不充分，建议补充数据或访谈 |
| 阶段3完成 | interview-script.json 已生成 | 检查研究目标和访谈配置是否完整 |
| 访谈洞察已提取 | interview-insights.json 已生成 | 等待人类完成访谈执行后提取洞察 |
| 阶段4完成 | user-research-report.md + user-research-report.json 均已生成 | 检查上游数据是否完整 |
| 用户研究报告执行摘要完整 | executive_summary含3条核心发现+Top1建议 | 补充上游数据重新生成报告 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Persona最终确认 | user-research-user-modeling完成 | 确认Persona画像是否准确，修正推断性特征 |
| Emotional/Social Job推断验证 | Persona中Emotional/Social Job置信度<0.5 | 确认情感和社会诉求推断是否合理 |
| 访谈结果校准 | user-research-interview-assist完成 | 校准访谈发现与已有数据的一致性，仲裁矛盾 |
| 用户研究报告结论与行动建议审批 | user-research-report完成 | 审批用户研究报告的最终结论和行动建议 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1某子Skill失败（voice-analysis或behavior-analysis） | 不阻塞另一子Skill，失败子Skill使用降级方案继续，标注"降级执行" |
| voice-analysis数据量不足（<500条） | 标注"数据不足"，输出降级为探索性结论，置信度统一降级，report中标注VOC结论为探索性 |
| behavior-analysis漏斗数据不完整 | 基于已有数据完成可分析部分，缺失阶段标注"数据缺失"，aha_moment_candidates标注低置信度 |
| user-modeling所有Persona置信度<0.7 | 标注"建模不充分"，输出最高置信度Persona供人类审批，建议补充数据或执行访谈后再建模 |
| interview-assist访谈未执行（人类未完成访谈） | interview-insights.json标注"访谈未执行"，report基于VOC+行为数据+建模数据生成，标注"缺少访谈验证" |
| 上游数据全部缺失 | 降级为轻量版流程：用户口述用户画像 → 基于描述生成假设性Persona → 生成探索性报告 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 user-research-report（用户研究报告）
- v4.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格和人类决策点表格
- v5.0: 统一阶段执行计划为表格格式，移除数据流转图
- v6.0: 核心原则重写为编排理念（说的做的不一样/建模是假设/访谈是验证/报告是起点）；移除通用4条执行步骤原则；新增异常处理表（6种异常场景）
