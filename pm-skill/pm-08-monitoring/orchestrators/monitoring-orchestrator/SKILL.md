---
name: monitoring-orchestrator
description: 当需要建立产品监控体系或处理异常告警时使用。监控预警指挥官，包括监控系统自动构建与配置、异常自动检测与分级告警、监控仪表盘构建、告警升级策略。关键词：监控预警、异常检测、告警分级、监控系统、健康监控、监控仪表盘、告警升级。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "orchestrator"
  version: "3.0"
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

## 任务调度

```
monitoring-system → monitoring-anomaly → monitoring-dashboard → monitoring-escalation
```

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 用户反馈闭环分析 | → user-feedback-loop-report（反馈闭环报告） |

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 项目初始化 / 监控体系缺失 | → monitoring-system（监控体系构建） |
| 新告警产生 / 告警风暴检测 | → monitoring-anomaly（告警分析归因） |
| 监控体系构建完成 | → monitoring-dashboard（监控仪表盘构建） |
| 告警分析完成 + 需升级处理 | → monitoring-escalation（告警升级处理） |
| 定时批量分析 | → monitoring-anomaly（批量分析） |
| 用户反馈周期性复盘 | → user-feedback-loop-report（反馈闭环报告） |

### 数据流转

```
[产品架构 + 指标体系 + SLA/SLO]
       ↓
monitoring-system
       ↓ core_paths / metrics / alert_rules / oncall_handbook
[告警数据 + 上下文信息]
       ↓
monitoring-anomaly
       ↓ classification / root_cause / impact_assessment / remediation / escalation_queue
[监控指标 + 告警规则]
       ↓
monitoring-dashboard
       ↓ dashboard_config / widget_layout / alert_integration
[升级队列 + 严重告警]
       ↓
monitoring-escalation
       ↓ escalation_rules / notification_channels / auto_response
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-monitoring/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
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
