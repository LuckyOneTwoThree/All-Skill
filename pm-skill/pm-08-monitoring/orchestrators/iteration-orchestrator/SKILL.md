---
name: iteration-orchestrator
description: 当需要规划迭代周期或调整产品优先级时使用。迭代决策指挥官，调度 iteration-backlog、iteration-prioritization、iteration-retrospective 子Skill执行。关键词：迭代决策、Backlog优化、优先级调整、迭代复盘、迭代规划、需求重组、RICE评分。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "orchestrator"
  version: "5.0"
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
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-monitoring/iteration-orchestrator.md`

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
  - stage: iteration-backlog
    gate: Backlog已优化
  - stage: iteration-prioritization
    depends_on: [iteration-backlog]
    gate: 优先级调整方案已生成
  - stage: iteration-retrospective
    depends_on: [iteration-prioritization]
    gate: 迭代复盘完成且改进建议经人类确认
```

## 阶段执行计划

#### 调用 iteration-backlog

```
Skill: iteration-backlog
输入:
  requirement_pool: 项目管理系统（需求池）
  tech_debt: 代码质量平台（技术债务）
  monitoring_alerts: monitoring-escalation → 告警数据（可选）
  user_feedback: 反馈系统（可选）
输出: output/pm-monitoring/iteration-backlog/
验证: 优先级评分覆盖率100%；关联关系识别完整；技术债务影响评估准确；重组建议可执行
模式: 🤖→👤
```

#### 调用 iteration-prioritization

```
Skill: iteration-prioritization
输入:
  current_sprint_plan: agile-sprint-planning → sprint_plan
  trigger_event: 监控系统/反馈系统
  resource_constraints: planning-resource → resource_plan
  change_request: 用户提供
输出: output/pm-monitoring/iteration-prioritization/
验证: 变更影响评估覆盖率100%；调整方案数量≥2；风险评估完整性；沟通草案覆盖所有干系人
模式: 🤖→👤
```

#### 调用 iteration-retrospective

```
Skill: iteration-retrospective
输入:
  iteration_completion: agile-daily-sync → daily_sync
  quality_metrics: 测试平台/CI/CD
  team_feedback: Retro工具（可选）
  monitoring_data: monitoring-system（可选）
输出: output/pm-monitoring/iteration-retrospective/
验证: 数据收集完整率≥95%；分析覆盖所有四个维度；问题识别准确率≥80%；建议可执行率≥75%
模式: 🤖→👤
```

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

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| Backlog数据严重缺失（需求项<5） | 暂停Backlog优化，要求用户补充核心需求列表后再继续 |
| 优先级调整触发事件不明确 | 标注"触发原因待确认"，由人类决策是否执行调整 |
| 复盘数据不完整（完整率<70%） | 仅输出可用维度的复盘，缺失维度标注"数据不足"，建议人工补充 |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
- v4.0: 执行步骤替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
