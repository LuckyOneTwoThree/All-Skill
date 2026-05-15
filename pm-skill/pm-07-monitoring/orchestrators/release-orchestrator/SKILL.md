---
name: release-orchestrator
description: 当需要执行产品发布交付流程时使用。发布交付指挥官，调度质量验收、发布检查、灰度发布和发布说明的完整发布流程。关键词：产品发布、上线、灰度、发布检查、发布说明、交付、验收发布。
metadata:
  module: "产品监控与迭代"
  sub-module: "发布交付"
  type: "orchestrator"
  version: "1.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "发布产品"
    - "灰度上线"
    - "执行发布流程"
    - "验收后发布"
---

# 发布交付指挥官

## 核心原则

1. **质量是发布的前提**——P0问题=0才能进入发布流程
2. **渐进式交付**——灰度→小流量→全量，每步有监控护航
3. **回滚能力是底线**——任何发布步骤必须有对应的回滚预案

## 编排理念

1. **质量门控先行，渐进交付推进**：先通过质量验收确保发布前提，再按灰度策略逐步放量
2. **检查清单兜底，回滚预案保底**：发布检查确保无遗漏项，灰度每步都有回滚能力

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: release-orchestrator
version: 1.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-monitoring/release-orchestrator.md

stages:
  - id: phase-1
    name: "质量验收"
    depends_on: []
    skills: [quality-acceptance]
    gate:
      condition: "P0问题=0，P1问题≤3"
      fail_action: "修复P0问题后重新验收"

  - id: phase-2
    name: "发布检查"
    depends_on: [phase-1]
    skills: [release-auto-checklist]
    gate:
      condition: "发布检查清单全部通过"
      fail_action: "补充缺失项后重新检查"

  - id: phase-3
    name: "灰度发布"
    depends_on: [phase-2]
    skills: [release-gradual]
    gate:
      condition: "灰度发布监控指标正常"
      fail_action: "回滚并排查问题"

  - id: phase-4
    name: "发布说明"
    depends_on: [phase-3]
    skills: [release-notes]
    gate:
      condition: "发布说明人类已确认"
      fail_action: "补充发布说明内容"
```

## 阶段执行计划

#### 调用 quality-acceptance

```
Skill: quality-acceptance
输入:
  acceptance_criteria: 用户提供（验收标准）
  test_report: 测试平台（测试报告）
  launch_checklist: 用户提供（上线检查清单，可选）
输出: output/pm-monitoring/quality-acceptance/
验证: 验收标准逐项验证完成；风险项已列出；放行建议可执行
模式: 🤖→👤
```

#### 调用 release-auto-checklist

```
Skill: release-auto-checklist
输入:
  release_content: 用户提供（发布内容）
  env_config: 用户提供（环境配置）
  dependency_list: 用户提供（依赖清单，可选）
输出: output/pm-monitoring/release-auto-checklist/
验证: 检查项全覆盖；所有阻断项已解决
模式: 🤖
```

#### 调用 release-gradual

```
Skill: release-gradual
输入:
  release_plan: 用户提供（发布计划）
  gradual_strategy: 用户提供（灰度策略，可选）
  monitoring_config: monitoring-pipeline → 监控配置（可选）
输出: output/pm-monitoring/release-gradual/
验证: 灰度阶段配置完整；流量规则明确；回滚条件可执行
模式: 🤖→👤
```

#### 调用 release-notes

```
Skill: release-notes
输入:
  release_content: 用户提供（发布内容）
  change_log: 用户提供（变更记录）
  user_impact: 用户提供（用户影响，可选）
输出: output/pm-monitoring/release-notes/
验证: 用户版、运维版、内部版发布说明均已生成
模式: 🤖
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-monitoring/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-monitoring/release-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: monitoring-orchestrator
    reason: 发布完成，建议进入监控预警阶段，跟踪发布后指标变化
    input_mapping:
      release_output: "output/pm-monitoring/release-gradual/ → monitoring-pipeline输入"
  alternatives:
    - target: agile-orchestrator
      reason: 如发布后需进入下一Sprint
      condition: 发布完成需继续迭代时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 质量验收已通过 | quality-acceptance输出文件已生成且非空 | 修复P0问题后重新验收 |
| 发布检查已通过 | release-check输出文件已生成且非空 | 补充缺失项后重新检查 |
| 灰度发布监控正常 | release-canary输出文件已生成且非空 | 回滚并排查问题 |
| 发布说明已确认 | release-notes输出文件已生成且人类已确认 | 补充发布说明内容 |
| 阶段总结已生成 | output/phase-reports/pm-monitoring/release-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 质量验收放行决策 | 质量验收报告生成完成 | 确认验收结果，决定是否放行或附加条件放行 |
| 灰度发布策略确认 | 灰度发布方案生成完成 | 确认灰度阶段、流量规则和回滚条件 |
| 灰度监控指标确认 | 灰度发布执行中监控指标波动 | 确认是否继续放量或回滚 |
| 发布说明确认 | 发布说明文档生成完成 | 确认发布说明内容准确完整 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 质量验收P0问题未清零 | 阻断发布流程，要求修复P0问题后重新验收 |
| 发布检查阻断项无法解决 | 阻断发布流程，上报人类决策是否降级发布或延期 |
| 灰度发布监控指标异常 | 立即回滚至上一稳定版本，排查问题后重新制定灰度方案 |
| 灰度回滚失败 | 启动紧急回滚预案，通知On-Call人员，上报人类紧急处理 |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 监控预警需求 | 转交 monitoring-orchestrator 处理 |

## 变更记录

- v1.0: 从 monitoring-orchestrator v8.0 拆分创建；包含 quality-acceptance、release-auto-checklist、release-gradual、release-notes 四个阶段
