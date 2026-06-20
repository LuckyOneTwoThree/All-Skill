---
name: monitoring-orchestrator
description: 当需要建立产品监控体系或处理异常告警时使用。监控预警指挥官，调度 monitoring-alert-detection、monitoring-attribution、user-feedback-loop-report 子Skill执行。关键词：监控预警、异常检测、告警分级、监控系统、健康监控、监控仪表盘、告警升级、反馈闭环、线上告警、系统监控、异常归因、根因分析。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "orchestrator"
  version: "9.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "建立产品监控体系"
    - "线上有异常告警"
    - "配置监控仪表盘"
    - "处理线上问题"
---

# 监控预警指挥官

## 核心原则

**让问题在用户发现之前被解决**

监控的最高境界不是快速响应，而是提前预防。当用户感知到问题时，损害已经发生。监控系统的价值在于将问题发现的时间点前移到用户感知之前。

## 编排理念

1. **体系先行，告警跟进，升级兜底**：先构建监控体系建立基线，再基于告警归因精准响应，最后用升级机制兜底
2. **数据在体系→归因→升级间递进流转**：监控体系定义告警规则，告警归因提供根因，升级机制基于根因精准通知

## 编排协议

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 编排协议。

## Pipeline

```yaml
pipeline: monitoring-orchestrator
version: 9.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/monitoring-orchestrator.md

stages:
  - id: phase-1
    name: "监控告警检测"
    depends_on: []
    skills: [monitoring-alert-detection]
    gate:
      condition: "监控告警检测完成（核心路径覆盖率≥95%，告警噪音率<15%）"
      fail_action: "补充缺失路径的监控配置、优化告警规则"

  - id: phase-2
    name: "异常归因分析"
    depends_on: [phase-1]
    skills: [monitoring-attribution]
    trigger: 异常告警触发
    gate:
      condition: "归因分析完成（每个告警事件有根因结论和影响评估）"
      fail_action: "补充证据数据或人工排查候选根因"

  - id: phase-3
    name: "用户反馈闭环"
    depends_on: [phase-2]
    skills: [user-feedback-loop-report]
    trigger: 用户反馈闭环需求
    gate:
      condition: "反馈闭环报告经人类审核确认"
      fail_action: "补充分析或修改改进建议"
```

## 阶段执行计划

#### 调用 monitoring-alert-detection

```
Skill: monitoring-alert-detection
输入:
  product_architecture: 用户提供
  metrics_system: metrics-system → metric_system.json
  sla_requirements: 用户提供
  release_info: release-gradual → release_record.json（可选）
  user_roles: 用户提供
  oncall_schedule: 值班管理系统 → 排班表
输出: output/pm-monitoring/monitoring-alert-detection/
验证: 核心路径覆盖率≥95%；每个核心路径至少有4个黄金指标；告警噪音率<15%；告警分类准确率≥85%；所有角色都有对应Dashboard；告警分级准确率≥90%；升级触发及时性100%
模式: 🤖
```

#### 调用 monitoring-attribution

```
Skill: monitoring-attribution
输入:
  alert_events: monitoring-alert-detection → monitoring-alert-detection.json
  classification: monitoring-alert-detection → 告警分类
  correlation: monitoring-alert-detection → 关联分析
  release_info: release-gradual → release_record.json（可选）
  root_cause_kb: 用户提供（可选）
  product_architecture: 用户提供（可选）
输出: output/pm-monitoring/monitoring-attribution/
验证: 每个告警事件有根因结论和证据支撑；影响范围已量化；修复建议可执行且有回滚方案；根因置信度已标注
模式: 🤖
```

#### 调用 user-feedback-loop-report

```
Skill: user-feedback-loop-report
输入:
  voice_analysis: user-research-voice-analysis（可选）
  anomaly_attribution: monitoring-attribution（可选）
  feedback_data: 用户提供
输出: output/pm-monitoring/user-feedback-loop-report/
验证: 闭环率可计算；P0未解决已列出；改进建议可执行
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-monitoring/monitoring-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-monitoring/ |
| 总结输出路径 | output/phase-reports/pm-monitoring/monitoring-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: diagnosis-orchestrator（监控预警建立完成，如发现异常进入诊断定位根因）
  alternatives:
    - target: release-orchestrator
      reason: 监控发现需发布修复
      condition: 监控预警触发P0/P1级异常需紧急修复时
    - target: iteration-orchestrator
      reason: 监控数据表明需调整迭代优先级
      condition: 监控指标趋势持续恶化，需调整迭代方向时
  special_cases:
    - target: monitoring-alert-detection
      reason: 仅需搭建监控，无需完整监控编排
      condition: 已有反馈闭环机制，仅需监控预警配置时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 监控告警检测完成 | monitoring-alert-detection 输出文件已生成且非空，核心路径覆盖率≥95% | 补充缺失路径的监控配置、优化告警规则、补充可视化配置或升级规则 |
| 异常归因分析完成 | monitoring-attribution 输出文件已生成且非空，每个告警事件有根因结论 | 补充证据数据或人工排查候选根因 |
| 反馈闭环报告已审核 | 反馈闭环报告经人类审核确认 | 补充分析或修改改进建议 |
| 阶段总结已生成 | output/phase-reports/pm-monitoring/monitoring-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 告警阈值调整 | 告警噪音率过高或漏报率过高 | 确认告警阈值调整方案 |
| 仪表盘布局确认 | 仪表盘构建完成 | 确认核心指标展示和布局 |
| 升级策略确认 | 升级规则生成完成 | 确认升级路径和通知渠道配置 |
| 根因确认 | 候选根因≥3个或置信度<0.6 | 确认最终根因或指定人工排查方向 |
| 反馈闭环报告确认 | 反馈闭环报告生成完成 | 确认闭环率和改进建议 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 监控体系核心路径覆盖率不足（<80%） | 暂停后续阶段，要求用户补充产品架构信息以完善核心路径 |
| 告警噪音率过高（>30%） | 暂停告警分析，回退至监控体系优化告警规则后再继续 |
| 根因不确定（候选原因≥3个） | 输出Top3候选原因及置信度，标记需人工排查，不阻塞归因报告生成 |
| On-Call排班缺失 | 使用默认升级规则，标注"排班待配置"，P0告警直接通知产品负责人 |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 发布需求 | 转交 release-orchestrator 处理 |
