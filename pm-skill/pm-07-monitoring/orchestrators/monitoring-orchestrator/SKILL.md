---
name: monitoring-orchestrator
description: 当需要建立产品监控体系或处理异常告警时使用。监控预警指挥官，调度 monitoring-pipeline、user-feedback-loop-report 子Skill执行。关键词：监控预警、异常检测、告警分级、监控系统、健康监控、监控仪表盘、告警升级、反馈闭环、线上告警、系统监控。
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

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: monitoring-orchestrator
version: 9.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/monitoring-orchestrator.md

stages:
  - id: phase-1
    name: "监控预警Pipeline"
    depends_on: []
    skills: [monitoring-pipeline]
    gate:
      condition: "监控预警全流程完成（核心路径覆盖率≥95%，告警噪音率<15%）"
      fail_action: "补充缺失路径的监控配置、优化告警规则"

  - id: phase-2
    name: "用户反馈闭环"
    depends_on: [phase-1]
    skills: [user-feedback-loop-report]
    trigger: 用户反馈闭环需求
    gate:
      condition: "反馈闭环报告经人类审核确认"
      fail_action: "补充分析或修改改进建议"
```

## 阶段执行计划

#### 调用 monitoring-pipeline

```
Skill: monitoring-pipeline
输入:
  product_architecture: 用户提供
  metrics_system: metrics-system → metric_system.json
  sla_requirements: 用户提供
  release_info: release-gradual → release_record.json（可选）
  user_roles: 用户提供
  oncall_schedule: 值班管理系统 → 排班表
输出: output/pm-monitoring/monitoring-pipeline/
验证: 核心路径覆盖率≥95%；每个核心路径至少有4个黄金指标；告警噪音率<15%；告警分类准确率≥85%；所有角色都有对应Dashboard；告警分级准确率≥90%；升级触发及时性100%
模式: 🤖
```

#### 调用 user-feedback-loop-report

```
Skill: user-feedback-loop-report
输入:
  voice_analysis: user-research-voice-analysis（可选）
  anomaly_monitoring: monitoring-pipeline（可选）
  feedback_data: 用户提供
输出: output/pm-monitoring/user-feedback-loop-report/
验证: 闭环率可计算；P0未解决已列出；改进建议可执行
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-monitoring/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-monitoring/monitoring-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: diagnosis-orchestrator
    reason: 监控预警建立完成，如发现异常建议进入诊断阶段，定位问题根因
    input_mapping:
      monitoring_output: "output/pm-monitoring/monitoring-pipeline/ → diagnosis-health输入"
  alternatives:
    - target: release-orchestrator
      reason: 如监控发现需发布修复
      condition: 监控预警触发发布需求时
    - target: iteration-orchestrator
      reason: 如监控发现需迭代调整
      condition: 监控数据表明需调整迭代优先级时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 监控预警全流程完成 | monitoring相关输出文件已生成且非空 | 补充缺失路径的监控配置、优化告警规则、补充可视化配置或升级规则 |
| 反馈闭环报告已审核 | 反馈闭环报告经人类审核确认 | 补充分析或修改改进建议 |
| 阶段总结已生成 | output/phase-reports/pm-monitoring/monitoring-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 告警阈值调整 | 告警噪音率过高或漏报率过高 | 确认告警阈值调整方案 |
| 仪表盘布局确认 | 仪表盘构建完成 | 确认核心指标展示和布局 |
| 升级策略确认 | 升级规则生成完成 | 确认升级路径和通知渠道配置 |
| 反馈闭环报告确认 | 反馈闭环报告生成完成 | 确认闭环率和改进建议 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 监控体系核心路径覆盖率不足（<80%） | 暂停后续阶段，要求用户补充产品架构信息以完善核心路径 |
| 告警噪音率过高（>30%） | 暂停告警分析，回退至监控体系优化告警规则后再继续 |
| On-Call排班缺失 | 使用默认升级规则，标注"排班待配置"，P0告警直接通知产品负责人 |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 发布需求 | 转交 release-orchestrator 处理 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 user-feedback-loop-report（用户反馈闭环报告）
- v4.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
- v5.0: 执行步骤替换为编排理念，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v7.0: 合并 monitoring-system + monitoring-anomaly + monitoring-dashboard + monitoring-escalation → monitoring-pipeline；4阶段Pipeline简化为1阶段；更新所有引用和输出路径
- v8.0: 新增 quality-acceptance、release-gradual、release-auto-checklist、release-notes——从pm-05迁移；Pipeline新增4个触发阶段；阶段执行计划新增4个子Skill调用；阶段卡口新增4项；人类决策点新增质量验收放行决策和灰度发布策略确认
- v9.0: 拆分发布交付阶段至 release-orchestrator；移除 quality-acceptance、release-auto-checklist、release-gradual、release-notes；Pipeline精简为2阶段；异常处理新增"发布需求→转交release-orchestrator"
