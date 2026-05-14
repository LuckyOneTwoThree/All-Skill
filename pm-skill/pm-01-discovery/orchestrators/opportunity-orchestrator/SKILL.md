---
name: opportunity-orchestrator
description: 当需要执行完整的机会识别与定义流程时使用。机会识别指挥官，调度opportunity-definition完成机会评分、问题陈述、HMW发散和机会简报。关键词：机会识别、机会评分、HMW、Problem Statement、Opportunity Brief、产品机会、机会评估、问题定义。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "orchestrator"
  version: "8.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我评估一下这个产品机会"
    - "识别一下有哪些产品机会"
    - "定义一下我们要解决的问题"
    - "生成机会简报"
---

# 机会识别指挥官

## 核心原则

1. **好机会是定义出来的**——机会不是客观存在等待发现的，而是通过Problem Statement定义、HMW重构、评分验证逐步定义出来的，编排器确保定义过程完整
2. **评分先于发散**——先评分确定机会优先级（scoring），再发散探索创新空间（hmw），顺序不可颠倒，否则HMW会发散到低价值方向
3. **Problem Statement是锚点**——所有HMW和Brief都锚定在Problem Statement上，Problem Statement质量不通过则后续输出不可信
4. **人类判定三个关键节点**——战略契合度评分人类判定、Problem Statement质量3次不通过人类仲裁、Brief最终决策人类审批

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-discovery/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-discovery/opportunity-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline 定义

```yaml
pipeline: opportunity-orchestrator
version: 8.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-discovery/opportunity-orchestrator.md

stages:
  - id: phase-1
    name: "机会识别与定义"
    skills: [opportunity-definition]
    gate:
      condition: "opportunity-definition.json已生成，评分完整，Problem Statement质量检查通过，HMW 4维度覆盖，Brief证据摘要完整"
      fail_action: "按子步骤失败原因分别处理：评分缺失等人类判定、Problem Statement质量不通过自动重试3次后升级人类、HMW维度不完整补充数据、Brief缺失补充上游数据"
```

## 阶段执行计划

### 阶段1：机会识别与定义

#### 调用 opportunity-definition

```
Skill: opportunity-definition
输入:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
  tam_som: output/pm-discovery/market-tam-som/tam-som.json
  competitor_analysis: output/pm-discovery/market-competitor-analysis/competitor-analysis.json
  persona: output/pm-discovery/user-research-user-modeling/persona.json（可选）
  insight_analysis: output/pm-discovery/insight-analysis/insight-analysis.json（可选）
  tech_assessment: 用户提供（可选，技术团队评估）
输出: output/pm-discovery/opportunity-definition/opportunity-definition.json
验证:
  - scoring: 5个维度均已评分，战略契合度标记为needs_human=true，评分依据完整
  - problem_statement: 5项质量检查全部通过（quality_check.all_passed=true），数据支撑完整
  - hmw: 4个维度均已覆盖，总计8-12个HMW陈述
  - brief: 证据摘要3个子字段均有内容，关键假设已列出可验证性，人类决策项非空，机会评分完整
模式: 🤖→👤（战略契合度维度👤由人类判定，Brief最终决策👤人类审批）
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-discovery/opportunity-definition/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-discovery/opportunity-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | opportunity-definition.json 已生成且4个子步骤验证通过 | 按子步骤失败原因分别处理 |
| 战略契合度已人类判定 | scoring中strategic_fit.needs_human已由人类确认评分 | 等待人类判定战略契合度 |
| Problem Statement质量检查通过 | problem_statement.quality_check.all_passed=true | 质量检查不通过则自动重试（最多3次），3次仍不通过升级人类 |
| HMW维度覆盖完整 | hmw.dimension_coverage中4个维度均≥1 | 补充Problem Statement或用户研究数据 |
| Brief证据摘要完整 | brief.evidence_summary的3个子字段均有内容 | 补充上游数据 |
| Opportunity Brief人类已决策 | brief.human_decisions_needed中各项已确认 | 等待人类审批决策项 |
| 阶段总结已生成 | output/phase-reports/pm-discovery/opportunity-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 战略契合度判定 | opportunity-definition Step 1 机会评分完成 | 确认每个机会的战略契合度评分（AI仅提供分析建议，最终得分必须由人类判定） |
| Problem Statement质量检查 | opportunity-definition Step 2 质量检查3次不通过 | 人工审核所有尝试版本并决定最终Problem Statement |
| Opportunity Brief最终决策 | opportunity-definition Step 4 机会简报完成 | 审批机会简报的结论、关键假设验证优先级和推荐下一步方案 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 机会评分战略契合度未判定 | 暂停Brief生成，等待人类判定战略契合度评分，其余4个维度评分结果可先输出 |
| Problem Statement质量检查3次不通过 | 升级人类仲裁，输出3次尝试版本及未通过项对比，由人类决定最终Problem Statement |
| HMW某维度未覆盖 | 标注"维度覆盖不完整"，基于已有Problem Statement补充生成该维度HMW，标注"推断补充" |
| Brief上游数据大量缺失 | 基于已有数据生成Brief，缺失字段标注"数据缺失"，证据摘要和关键假设置信度降级，建议人类补充数据后重新生成 |
| 所有上游数据全部缺失 | 降级为轻量版流程：用户口述问题 → 基于描述生成Problem Statement → 基于Problem Statement生成HMW → 输出轻量版Brief，全流程标注"数据缺失" |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格和人类决策点表格
- v4.0: 统一阶段执行计划为表格格式，移除数据流转图
- v5.0: 核心原则重写为4条编排理念；移除通用4条执行步骤原则；新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义；阶段执行计划改为调用指令格式
- v7.0: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；异常处理新增阶段总结生成失败策略
- v8.0: 合并opportunity-scoring/opportunity-problem-statement/opportunity-hmw/opportunity-brief为opportunity-definition，Pipeline stages从4阶段简化为1阶段调用
