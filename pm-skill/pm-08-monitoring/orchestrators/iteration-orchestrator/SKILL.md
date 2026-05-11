---
name: iteration-orchestrator
description: 当需要规划迭代周期或调整产品优先级时使用。迭代决策指挥官，调度 iteration-backlog、iteration-prioritization、iteration-retrospective 子Skill执行。关键词：迭代决策、Backlog优化、优先级调整、迭代复盘、迭代规划、需求重组、RICE评分。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "orchestrator"
  version: "3.0"
---

# 迭代决策指挥官

## 核心原则

**数据驱动的优先级决策，平衡短期修复与长期价值**

迭代不是简单的需求排队，而是在有限资源下做出最优取舍。每一次优先级调整都是在短期修复和长期价值之间寻找平衡点，数据是决策的依据而非决策本身。

## 执行步骤

1. **主动监控而非被动响应**：Backlog持续优化而非迭代前才整理，优先级调整基于监控数据触发而非人工发起
2. **归因分层**：Backlog优化按"问题优先级→关联分析→重组建议"分层，优先级调整按"变更影响→调整方案→风险评估"分层
3. **决策规则前置**：优先级评分标准、调整触发条件、风险容忍阈值在迭代启动时定义
4. **持续学习**：迭代复盘结论反馈到Backlog优化，形成持续改进循环

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：Backlog优化

| 项目 | 内容 |
|------|------|
| 子Skill名称 | iteration-backlog |
| 读取定义路径 | `.trae/skills/iteration-backlog/SKILL.md` |
| 输入 | 需求池（项目管理系统）、技术债务（代码质量平台）、监控告警（monitoring-escalation → 告警数据，可选）、用户反馈（反馈系统，可选） |
| 输出 | `output/pm-monitoring/iteration-backlog/`（{iteration_id}/prioritized_items.yaml、linked_issues.yaml、technical_debt_impact.yaml、reorganization_suggestions.md、latest/backlog_recommendation.md） |
| 验证 | 优先级评分覆盖率100%；关联关系识别完整；技术债务影响评估准确；重组建议可执行 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | Backlog已优化（问题优先级评估完成，关联分析完成，重组建议已生成），否则补充需求分析或延长优化周期 |

### 阶段2：优先级调整

| 项目 | 内容 |
|------|------|
| 子Skill名称 | iteration-prioritization |
| 读取定义路径 | `.trae/skills/iteration-prioritization/SKILL.md` |
| 输入 | 当前迭代计划（agile-sprint-planning → sprint_plan）、触发事件（监控系统/反馈系统）、资源约束（planning-resource → resource_plan）、变更需求（用户提供） |
| 输出 | `output/pm-monitoring/iteration-prioritization/`（{trigger_id}/impact_assessment.yaml、adjustment_options.yaml、risk_assessment.yaml、communication_draft.md、latest/adjustment_recommendation.md） |
| 验证 | 变更影响评估覆盖率100%；调整方案数量≥2；风险评估完整性；沟通草案覆盖所有干系人 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 优先级调整方案已生成（变更影响评估完成，调整方案和风险评估已输出），否则补充影响分析数据 |

### 阶段3：迭代复盘

| 项目 | 内容 |
|------|------|
| 子Skill名称 | iteration-retrospective |
| 读取定义路径 | `.trae/skills/iteration-retrospective/SKILL.md` |
| 输入 | 迭代完成情况（agile-daily-sync → daily_sync）、质量指标（测试平台/CI/CD）、团队反馈（Retro工具，可选）、监控数据（monitoring-system，可选） |
| 输出 | `output/pm-monitoring/iteration-retrospective/`（{iteration_id}/summary.md、metrics_analysis.yaml、problem_identification.yaml、improvement_suggestions.yaml、latest/retrospective_report.md） |
| 验证 | 数据收集完整率≥95%；分析覆盖所有四个维度；问题识别准确率≥80%；建议可执行率≥75% |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 迭代复盘完成且改进建议经人类确认，否则补充分析或修改改进建议 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-monitoring/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| Backlog已优化 | 问题优先级评估完成，关联分析完成，重组建议已生成 | 补充需求分析或延长优化周期 |
| 优先级调整方案已生成 | 变更影响评估完成，调整方案和风险评估已输出 | 补充影响分析数据 |
| 迭代复盘已完成 | 复盘报告生成且改进建议经人类确认 | 补充分析或修改改进建议 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 迭代计划调整确认 | 优先级调整方案生成完成 | 确认调整方案、资源重新分配和风险接受 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
