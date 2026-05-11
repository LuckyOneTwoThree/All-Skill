---
name: monitoring-orchestrator
description: 当需要建立产品监控体系或处理异常告警时使用。监控预警指挥官，调度 monitoring-system、monitoring-anomaly、monitoring-dashboard、monitoring-escalation、user-feedback-loop-report 子Skill执行。关键词：监控预警、异常检测、告警分级、监控系统、健康监控、监控仪表盘、告警升级、反馈闭环。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "orchestrator"
  version: "4.0"
---

# 监控预警指挥官

## 核心原则

**让问题在用户发现之前被解决**

监控的最高境界不是快速响应，而是提前预防。当用户感知到问题时，损害已经发生。监控系统的价值在于将问题发现的时间点前移到用户感知之前。

## 执行步骤

1. **主动监控而非被动响应**：不是等告警来了再处理，而是持续扫描核心路径健康度，在异常萌芽阶段就介入
2. **归因分层**：告警分析按"确认真实性→定位范围→关联事件→生成归因"分层推进，避免跳步导致误判
3. **决策规则前置**：告警分级规则、升级阈值、自动处理策略在系统建设时就定义好，而非告警发生时临时判断
4. **持续学习**：每次告警处理的结果反馈到知识库，持续优化归因模型和告警规则

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：监控体系构建

| 项目 | 内容 |
|------|------|
| 子Skill名称 | monitoring-system |
| 读取定义路径 | `.trae/skills/monitoring-system/SKILL.md` |
| 输入 | 产品架构（用户提供）、指标体系（metrics-system → metric_system.json）、SLA要求（用户提供） |
| 输出 | `output/pm-monitoring/monitoring-system/`（core_paths.md、metrics/、alert_policies.yaml、suppression_rules.yaml、oncall_handbook.md） |
| 验证 | 核心路径覆盖率≥95%；每个核心路径至少有4个黄金指标；告警噪音率<15% |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 核心路径覆盖率≥95%，否则补充缺失路径的监控配置后再进入下一阶段 |

### 阶段2：告警分析归因

| 项目 | 内容 |
|------|------|
| 子Skill名称 | monitoring-anomaly |
| 读取定义路径 | `.trae/skills/monitoring-anomaly/SKILL.md` |
| 输入 | 告警数据（monitoring-system → alert.json）、版本发布信息（release-gradual → release_record.json，可选） |
| 输出 | `output/pm-monitoring/monitoring-anomaly/`（{alert_id}/classification.md、correlation.md、root_cause.md、impact_assessment.md、remediation.md、escalation_queue.md） |
| 验证 | 告警分类准确率≥85%；根因定位准确率≥80%；5 Why链条完整（3-5层） |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 告警噪音率<15%，否则优化告警规则后再进入下一阶段 |

### 阶段3：监控仪表盘构建

| 项目 | 内容 |
|------|------|
| 子Skill名称 | monitoring-dashboard |
| 读取定义路径 | `.trae/skills/monitoring-dashboard/SKILL.md` |
| 输入 | 指标体系（metrics-system → metric_system.json）、监控体系（monitoring-system → 告警规则）、用户角色（用户提供） |
| 输出 | `output/pm-monitoring/monitoring-dashboard/`（{role}/dashboard.yaml、shared/、templates/） |
| 验证 | 所有角色都有对应Dashboard；核心指标覆盖率≥90%；告警配置正确 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 仪表盘构建完成（核心指标已可视化，告警已集成），否则补充缺失指标的可视化配置后再进入下一阶段 |

### 阶段4：告警升级处理

| 项目 | 内容 |
|------|------|
| 子Skill名称 | monitoring-escalation |
| 读取定义路径 | `.trae/skills/monitoring-escalation/SKILL.md` |
| 输入 | 告警数据（monitoring-system → 告警数据）、On-Call排班（值班管理系统 → 排班表）、告警规则（monitoring-system → 告警规则） |
| 输出 | `output/pm-monitoring/monitoring-escalation/`（alerts/、oncall_schedule/、oncall_reports/） |
| 验证 | 告警分级准确率≥90%；升级触发及时性100%；通知送达率≥99% |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 升级策略已定义（P0/P1告警有明确升级路径和通知渠道），否则补充升级规则和通知配置 |

### 附加阶段（按需触发）：用户反馈闭环报告

| 项目 | 内容 |
|------|------|
| 子Skill名称 | user-feedback-loop-report |
| 读取定义路径 | `.trae/skills/user-feedback-loop-report/SKILL.md` |
| 输入 | 用户声音分析（user-research-voice-analysis，可选）、异常监控数据（monitoring-anomaly，可选）、反馈数据（用户提供） |
| 输出 | `output/pm-monitoring/user-feedback-loop-report/feedback-loop-report.md`、`output/pm-monitoring/user-feedback-loop-report/feedback-loop-report.json` |
| 验证 | 闭环率可计算；P0未解决已列出；改进建议可执行 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 反馈闭环报告经人类审核确认，否则补充分析或修改改进建议 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-monitoring/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 核心路径覆盖率≥95% | 产品核心路径已全部纳入监控 | 补充缺失路径的监控配置 |
| 告警噪音率<15% | 告警中误报和低价值告警占比低于15% | 优化告警规则，提高精准度 |
| 仪表盘构建完成 | 核心指标已可视化，告警已集成 | 补充缺失指标的可视化配置 |
| 升级策略已定义 | P0/P1告警有明确升级路径和通知渠道 | 补充升级规则和通知配置 |
| 反馈闭环报告已审核 | 反馈闭环报告经人类审核确认 | 补充分析或修改改进建议 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 告警阈值调整 | 告警噪音率过高或漏报率过高 | 确认告警阈值调整方案 |
| 仪表盘布局确认 | 仪表盘构建完成 | 确认核心指标展示和布局 |
| 升级策略确认 | 升级规则生成完成 | 确认升级路径和通知渠道配置 |
| 反馈闭环报告确认 | 反馈闭环报告生成完成 | 确认闭环率和改进建议 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 user-feedback-loop-report（用户反馈闭环报告）
- v4.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
