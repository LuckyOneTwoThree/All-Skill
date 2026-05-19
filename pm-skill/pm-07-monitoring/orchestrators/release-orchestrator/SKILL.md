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

> 协议源头：[orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md)（仅供维护者追踪，本文件已内联完整协议内容，可独立使用）

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。
7. **跨子Skill交叉验证**：当多个子Skill的产出之间存在一致性约束时，编排器可在阶段间执行交叉验证（读取多份产出比对一致性），这属于编排器的协调职责而非代理执行子Skill逻辑。交叉验证规则在编排器SKILL.md中显式定义。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/{领域路径}/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段卡口标准

编排器的阶段卡口只校验以下3类条件，不深入子Skill内部字段：

| 卡口类型 | 校验内容 | 示例 |
|----------|----------|------|
| 输出存在性 | 输出文件已生成且非空 | "api-design-spec输出文件已生成" |
| 顶层结构完整性 | JSON顶层必填字段存在 | "prd.json包含features/pages/entities" |
| 人类决策确认 | 关键决策点已获人类确认 | "设计审查人类确认通过" |

### 通用异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板，整体置信度设为0.3，强制人类确认是否继续 |

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

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-monitoring/release-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-monitoring/ |
| 总结输出路径 | output/phase-reports/pm-monitoring/release-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: monitoring-orchestrator（发布完成，跟踪发布后指标变化）
  alternatives:
    - target: agile-orchestrator
      reason: 发布后需进入下一Sprint
      condition: 发布完成需继续迭代时
    - target: growth-orchestrator
      reason: 发布后启动增长策略
      condition: 发布涉及增长相关功能，需驱动用户增长时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 质量验收已通过 | quality-acceptance输出文件已生成且非空 | 修复P0问题后重新验收 |
| 发布检查已通过 | release-auto-checklist输出文件已生成且非空 | 补充缺失项后重新检查 |
| 灰度发布监控正常 | release-gradual输出文件已生成且非空 | 回滚并排查问题 |
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
