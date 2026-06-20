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

## 编排器定位声明

本编排器当前 Pipeline 仅包含 1 个子 Skill（opportunity-definition），属于合并简化后的退化编排器。保留本编排器的理由：

1. **统一入口**：为机会识别子模块提供标准化的调用入口，上层编排器（如 product-launch-orchestrator）无需关心内部子 Skill 的合并历史
2. **阶段总结**：强制生成阶段总结文档（post_pipeline），确保子模块产出可审计、可追溯
3. **异常处理**：提供统一的异常处理策略和降级方案，子 Skill 自身的降级策略不覆盖编排器层面的异常拦截
4. **人类决策点**：在子 Skill 执行前后提供人类决策卡口，确保关键结论经人类确认后才传递下游

若未来该子模块需要扩展为多阶段 Pipeline，本编排器可直接增加阶段，无需修改上层编排器的调用方式。

## 编排协议

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 编排协议。

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

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-discovery/opportunity-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-discovery/opportunity-definition/ |
| 总结输出路径 | output/phase-reports/pm-discovery/opportunity-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: business-orchestrator（机会定义完成，将机会转化为可持续的商业模式）
  alternatives:
    - target: design-orchestrator
      reason: 商业模式已确定，直接进入产品设计
      condition: 商业模式已在前序阶段确定，无需重新设计时
    - target: validation-orchestrator
      reason: 机会假设风险较高，需先验证再投入
      condition: 机会简报中关键假设风险等级≥高时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | opportunity-definition.json 已生成且非空 | 按子步骤失败原因分别处理 |
| 战略契合度人类已确认 | 人类已确认战略契合度评分 | 等待人类判定战略契合度 |
| Opportunity Brief人类已确认 | 人类已审批Opportunity Brief | 等待人类审批决策项 |
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
