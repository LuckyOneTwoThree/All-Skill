---
name: user-research-orchestrator
description: 当需要执行完整的用户研究流程时使用。用户研究指挥官，调度voice-analysis/behavior-analysis/user-modeling/interview-assist/report。关键词：用户研究、VOC分析、行为分析、Persona、访谈辅助。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "orchestrator"
  version: "7.0"
---

# 用户研究指挥官

## 核心原则

1. **用户说的和做的不一样**——VOC（用户说的）和行为数据（用户做的）必须并行采集、交叉验证，单一信源结论不可信
2. **建模是假设不是事实**——Persona/Empathy Map/Journey Map都是基于数据的假设模型，必须人类审批确认后方可用于后续流程
3. **访谈是验证不是探索**——访谈的目的是验证已有假设（来自VOC和行为数据），不是漫无目的的探索，脚本必须锚定待验证假设
4. **报告是终点也是起点**——用户研究报告是研究阶段的终点，但也是产品决策的起点，报告必须包含可执行的行动建议

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-discovery/user-research-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-discovery/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-discovery/user-research-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline 定义

```yaml
pipeline: user-research-orchestrator
version: 7.0

stages:
  - id: phase-1
    name: "并行采集"
    parallel: true
    skills:
      - user-research-voice-analysis
      - user-research-behavior-analysis
    gate:
      condition: "voice-analysis.json + behavior-analysis.json 均已生成且验证通过"
      fail_action: "补充用户反馈数据或行为数据"

  - id: phase-2
    name: "建模与访谈"
    parallel: true
    depends_on: [phase-1]
    skills:
      - user-research-user-modeling
      - user-research-interview-assist
    gate:
      condition: "persona.json + interview-script.json 均已生成"
      fail_action: "补充数据或检查子Skill执行结果"

  - id: phase-3
    name: "研究报告"
    depends_on: [phase-1, phase-2]
    skills: [user-research-report]
    gate:
      condition: "执行摘要包含3条核心发现+Top1建议"
      fail_action: "补充上游数据重新生成报告"
```

## 阶段执行计划

### 阶段1：并行采集

#### 调用 user-research-voice-analysis

```
Skill: user-research-voice-analysis
输入:
  app_reviews: 用户提供（应用商店评论）
  support_tickets: 用户提供（客服工单数据）
  social_mentions: 用户提供（可选，社交媒体提及）
  community_posts: 用户提供（可选，社区帖子）
  analysis_config: 用户提供（可选，分析配置）
输出: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
验证: sentiment_distribution非空，top_themes至少3个主题，top_pain_points已提取，置信度已标注
模式: 🤖
```

#### 调用 user-research-behavior-analysis

```
Skill: user-research-behavior-analysis
输入:
  event_logs: 用户提供（行为事件日志）
  funnel_data: 用户提供（漏斗数据）
  heatmap_data: 用户提供（可选，热力图数据）
  analysis_config: 用户提供（可选，分析配置）
输出: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
验证: funnel_health非空，aha_moment_candidates已提取，feature_usage分析已完成，置信度已标注
模式: 🤖
```

⏸ **阶段卡口**：voice-analysis.json + behavior-analysis.json 均已生成且验证通过 → 未通过：补充用户反馈数据或行为数据

### 阶段2：建模与访谈（并行调用）

#### 调用 user-research-user-modeling

```
Skill: user-research-user-modeling
输入:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
  survey_data: 用户提供（可选，问卷数据）
  modeling_config: 用户提供（可选，建模配置）
输出: output/pm-discovery/user-research-user-modeling/persona.json + empathy-map.json + journey-map.json
验证: personas数组非空，至少1个Persona置信度≥0.7，Empathy Map四象限完整，Journey Map阶段完整
模式: 🤖→👤
```

⏸ **阶段卡口**：personas数组非空，至少1个Persona置信度≥0.7 → 未通过：标记建模不充分，建议补充数据或访谈

#### 调用 user-research-interview-assist

```
Skill: user-research-interview-assist
输入:
  persona: output/pm-discovery/user-research-user-modeling/persona.json（可选）
  research_objectives: 用户提供（研究目标）
  interview_config: 用户提供（访谈配置）
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json（可选）
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json（可选）
输出: output/pm-discovery/user-research-interview-assist/interview-script.json + interview-insights.json
验证: interview-script.json中core_modules非空，每个核心问题有追问策略；interview-insights.json中validated_hypotheses或new_discoveries非空
模式: 👤→🤖
```

⏸ **阶段卡口**：interview-script.json已生成，访谈执行后interview-insights.json已生成 → 未通过：检查研究目标和访谈配置是否完整

### 阶段3：研究报告

#### 调用 user-research-report

```
Skill: user-research-report
输入:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json（可选）
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json（可选）
  persona: output/pm-discovery/user-research-user-modeling/persona.json（可选）
  interview_script: output/pm-discovery/user-research-interview-assist/interview-script.json（可选）
  research_objectives: 用户提供（研究目标）
  product_info: 用户提供（可选，产品/品类信息）
输出: output/pm-discovery/user-research-report/user-research-report.md + user-research-report.json
验证: 执行摘要包含3条核心发现+Top1建议，每个Persona有代表性用户原话，行动建议至少3条且有优先级
模式: 🤖→👤
```

⏸ **阶段卡口**：执行摘要包含3条核心发现+Top1建议 → 未通过：补充上游数据重新生成报告

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
- v7.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议；阶段2-3合并为并行阶段
