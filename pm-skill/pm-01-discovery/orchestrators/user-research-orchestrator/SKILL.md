---
name: user-research-orchestrator
description: 当需要执行完整的用户研究流程时使用。用户研究指挥官，调度voice-analysis/behavior-analysis/user-modeling/interview-assist/report。关键词：用户研究、VOC分析、行为分析、Persona、访谈辅助、用户调研、用户画像、用户反馈、用户访谈。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "orchestrator"
  version: "8.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我做一下用户研究"
    - "分析一下用户反馈"
    - "设计一个用户访谈"
    - "生成用户画像"
    - "了解一下用户行为"
---

# 用户研究指挥官

## 核心原则

1. **用户说的和做的不一样**——VOC（用户说的）和行为数据（用户做的）必须并行采集、交叉验证，单一信源结论不可信
2. **建模是假设不是事实**——Persona/Empathy Map/Journey Map都是基于数据的假设模型，必须人类审批确认后方可用于后续流程
3. **访谈是验证不是探索**——访谈的目的是验证已有假设（来自VOC和行为数据），不是漫无目的的探索，脚本必须锚定待验证假设
4. **报告是终点也是起点**——用户研究报告是研究阶段的终点，但也是产品决策的起点，报告必须包含可执行的行动建议

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline 定义

```yaml
pipeline: user-research-orchestrator
version: 8.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-discovery/user-research-orchestrator.md

stages:
  - id: phase-1
    name: "并行采集"
    skills:
      - user-research-voice-analysis
      - user-research-behavior-analysis
    gate:
      condition: "voice-analysis.json + behavior-analysis.json 均已生成且验证通过"
      fail_action: "补充用户反馈数据或行为数据"

  - id: phase-2
    name: "建模与访谈"
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

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-discovery/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-discovery/user-research-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: insight-orchestrator
    reason: 用户研究完成，建议进入需求洞察分析阶段，从研究数据中提炼洞察
    input_mapping:
      user_research_output: "output/pm-discovery/user-research-report/ → insight-analysis输入"
  alternatives:
    - target: opportunity-orchestrator
      reason: 如研究结论已足够明确，直接进入机会定义
      condition: 用户研究已产出清晰的痛点和需求时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | voice-analysis.json + behavior-analysis.json 均已生成且非空 | 补充用户反馈数据或行为数据 |
| 阶段2完成 | persona.json 已生成且人类审批通过 | 补充数据或调整建模参数重新执行 |
| 阶段3完成 | interview-script.json 已生成且非空 | 检查研究目标和访谈配置是否完整 |
| 访谈洞察已提取 | interview-insights.json 已生成且非空 | 等待人类完成访谈执行后提取洞察 |
| 阶段4完成 | user-research-report.md + user-research-report.json 均已生成且非空 | 检查上游数据是否完整 |
| 阶段总结已生成 | output/phase-reports/pm-discovery/user-research-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

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
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 user-research-report（用户研究报告）
- v4.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格和人类决策点表格
- v5.0: 统一阶段执行计划为表格格式，移除数据流转图
- v6.0: 核心原则重写为编排理念（说的做的不一样/建模是假设/访谈是验证/报告是起点）；移除通用4条执行步骤原则；新增异常处理表（6种异常场景）
- v7.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议；阶段2-3合并为并行阶段
- v8.0: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
