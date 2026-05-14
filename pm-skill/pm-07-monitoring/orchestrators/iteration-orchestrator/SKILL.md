---
name: iteration-orchestrator
description: 当需要规划迭代周期或调整产品优先级时使用。迭代决策指挥官，调度 iteration-decision、release-gradual、release-auto-checklist、release-notes 子Skill执行。关键词：迭代决策、Backlog优化、优先级调整、迭代复盘、迭代规划、需求重组、RICE评分、迭代管理、灰度发布、发布检查、发布说明。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "orchestrator"
  version: "8.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "规划下一个迭代"
    - "调整一下优先级"
    - "优化一下Backlog"
    - "做一下迭代复盘"
---

# 迭代决策指挥官

## 核心原则

**数据驱动的优先级决策，平衡短期修复与长期价值**

迭代不是简单的需求排队，而是在有限资源下做出最优取舍。每一次优先级调整都是在短期修复和长期价值之间寻找平衡点，数据是决策的依据而非决策本身。

## 编排理念

1. **Backlog优化先行，优先级调整跟进**：先优化Backlog建立清晰的优先级基线，再基于触发事件调整，避免在混乱的Backlog上做调整
2. **复盘结论闭环到Backlog**：迭代复盘的改进建议必须回流到Backlog优化，形成"执行→复盘→优化"的持续改进闭环

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
- 详细输出写入对应模块的 `output/pm-monitoring/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-monitoring/iteration-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  post_pipeline:
    - action: stage-summary
      output: output/phase-reports/pm-monitoring/iteration-orchestrator.md
  - stage: iteration-decision
    gate: 迭代决策全流程完成（Backlog已优化，优先级调整方案已生成，迭代复盘完成且改进建议经人类确认）
  - stage: release-auto-checklist
    trigger: 发布前检查需求
    gate: 发布检查报告所有阻断项已解决
  - stage: release-gradual
    trigger: 灰度发布需求
    gate: 灰度发布方案经人类审核确认
  - stage: release-notes
    trigger: 发布说明需求
    gate: 发布说明文档已生成
```

## 阶段执行计划

#### 调用 iteration-decision

```
Skill: iteration-decision
输入:
  requirement_pool: 项目管理系统（需求池）
  tech_debt: 代码质量平台（技术债务）
  monitoring_alerts: monitoring-pipeline → 告警数据（可选）
  user_feedback: 反馈系统（可选）
  current_sprint_plan: agile-sprint-planning → sprint_plan
  trigger_event: 监控系统/反馈系统
  resource_constraints: planning-resource → resource_plan
  change_request: 用户提供
  iteration_completion: agile-daily-sync → daily_sync
  quality_metrics: 测试平台/CI/CD
  team_feedback: Retro工具（可选）
  monitoring_data: monitoring-pipeline（可选）
输出: output/pm-monitoring/iteration-decision/
验证: 优先级评分覆盖率100%；关联关系识别完整；技术债务影响评估准确；重组建议可执行；变更影响评估覆盖率100%；调整方案数量≥2；数据收集完整率≥95%；分析覆盖所有四个维度；问题识别准确率≥80%；建议可执行率≥75%
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
输出: output/phase-reports/pm-monitoring/iteration-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 迭代决策全流程完成 | Backlog已优化，优先级调整方案已生成，迭代复盘完成且改进建议经人类确认 | 补充需求分析、影响分析数据或修改改进建议 |
| 发布检查已通过 | 发布检查报告所有阻断项已解决 | 解决阻断项后重新检查 |
| 灰度发布方案已审核 | 灰度发布方案经人类审核确认 | 调整灰度阶段或回滚条件 |
| 发布说明已生成 | 用户版、运维版、内部版发布说明均已生成 | 补充缺失版本的发布说明 |
| 阶段总结已生成 | output/phase-reports/pm-monitoring/iteration-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 迭代计划调整确认 | 优先级调整方案生成完成 | 确认调整方案、资源重新分配和风险接受 |
| 灰度发布策略确认 | 灰度发布方案生成完成 | 确认灰度阶段、流量规则和回滚条件 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| Backlog数据严重缺失（需求项<5） | 暂停Backlog优化，要求用户补充核心需求列表后再继续 |
| 优先级调整触发事件不明确 | 标注"触发原因待确认"，由人类决策是否执行调整 |
| 复盘数据不完整（完整率<70%） | 仅输出可用维度的复盘，缺失维度标注"数据不足"，建议人工补充 |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
- v4.0: 执行步骤替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v7.0: 合并 iteration-backlog + iteration-prioritization + iteration-retrospective → iteration-decision；3阶段Pipeline简化为1阶段；更新所有引用和输出路径
- v8.0: 新增 release-gradual、release-auto-checklist、release-notes——从pm-05迁移；Pipeline新增3个触发阶段；阶段执行计划新增3个子Skill调用；阶段卡口新增3项；人类决策点新增灰度发布策略确认
