---
name: decision-orchestrator
description: 当需要将数据分析结果转化为决策行动时使用。数据驱动决策指挥官，调度 decision-dace（DACE决策循环+洞察转化）、decision-culture（数据文化建设），实现从数据到决策的闭环。关键词：数据决策、DACE循环、数据洞察、决策框架、数据文化、decision-dace、decision-culture、数据驱动、决策支持。
metadata:
  module: "产品度量运营"
  sub-module: "决策闭环"
  type: "orchestrator"
  version: "7.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "基于数据做决策"
    - "建立数据驱动决策机制"
    - "把分析结果转化为行动"
    - "推动数据文化建设"
---

# 数据驱动决策指挥官

## 核心原则

**数据驱动决策，但决策权在人类**

数据的作用是照亮决策的盲区，而非替代决策者。DACE循环中，Define和Analyze由数据驱动，Conclude由人类决策，Execute由系统追踪——这是数据与人类的最优分工。

## 编排理念

1. **DACE循环是主线，洞察已内嵌，文化是支撑**：DACE循环驱动决策闭环，Analyze阶段已融合洞察转化能力，文化建设保障决策落地
2. **Conclude阶段必须有人类参与**：无论数据多明确，涉及业务策略的决策必须由人类确认
3. **决策边界分级传递**：data_decision自动执行、data_reference推送确认、human_decision等待审批

## 编排协议

> 协议源头：[orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md)（仅供维护者追踪，本文件已内联完整协议内容，可独立使用）

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **双模式调用**：平台支持 Skill 工具时，显式调用子Skill；平台不支持时，按子Skill的 `name`、输入契约、输出契约和阶段卡口执行兼容调度。
2. **不代理扩写**：兼容调度时不得把子Skill内部方法论复制进编排器上下文，也不得改写子Skill逻辑；只传递必要输入、输出路径和验证条件。
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现细节。
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径和 artifact index 传递数据。
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段。
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
pipeline: decision-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-metrics-ops/decision-orchestrator.md

stages:
  - id: phase-1
    name: "DACE决策循环"
    depends_on: []
    skills: [decision-dace]
    gate:
      condition: "目标已定义、数据已分析、洞察已生成、决策选项已提供"
      fail_action: "补充数据或重新定义目标"

  - id: phase-2
    name: "数据文化建设"
    depends_on: [phase-1]
    skills: [decision-culture]
    gate:
      condition: "报告体系正常运行（每日/每周/每月/每季）"
      fail_action: "检查上游数据源或调整报告模板"
```

## 阶段执行计划

#### 调用 decision-dace

```
Skill: decision-dace
输入:
  okr_data: 用户提供
  kr_progress: analysis-anomaly → anomaly_report.json
  experiment_result: experiment-execution → experiment_result.json
  analysis_result: analysis-anomaly → anomaly_report.json
  business_context: 用户提供（可选）
  insight_library: decision-dace → insight_library.json（可选）
输出: output/pm-metrics-ops/decision-dace/
验证: Define阶段目标可量化、有基线；Analyze阶段覆盖所有数据源；Conclude阶段提供至少2个决策选项；Execute阶段设置监控和回滚机制；洞察叙述使用业务语言而非数据术语；每个洞察至少提供2个决策选项；决策边界标注正确（auto/reference/human）；推荐行动有明确的下一步和负责人
模式: 🤖→👤
```

#### 调用 decision-culture

```
Skill: decision-culture
输入:
  okr_data: decision-dace → dace_status.json
  decision_records: decision-dace → decision_insight.json
  team_feedback: 用户提供（可选）
输出: output/pm-metrics-ops/decision-culture/
验证: 每日摘要无异常时未产生噪音告警；周报包含OKR进度和实验汇总；月报包含完整指标趋势和偏差分析；报告中所有数据引用可追溯至数据源
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-metrics-ops/decision-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-metrics-ops/ |
| 总结输出路径 | output/phase-reports/pm-metrics-ops/decision-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: design-orchestrator（决策完成，将决策结论转化为功能变更）
  alternatives:
    - target: experiment-orchestrator
      reason: 决策需A/B测试验证效果
      condition: 决策结论需要量化验证时
    - target: iteration-orchestrator
      reason: 决策涉及迭代优先级调整
      condition: 决策结论影响迭代计划时
  special_cases:
    - target: decision-dace
      reason: 仅需DACE决策循环，无需完整决策编排
      condition: 已有分析结论，仅需快速决策闭环时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| DACE循环Define/Analyze完成 | dace-define-analyze输出文件已生成且非空 | 补充数据或重新定义目标 |
| 决策选项已提供 | decision-options输出文件已生成且非空 | 标记为待处理，持续追踪 |
| 数据文化报告体系运行 | data-culture-report输出文件已生成且非空 | 检查上游数据源或调整报告模板 |
| 阶段总结已生成 | output/phase-reports/pm-metrics-ops/decision-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Conclude阶段决策 | DACE循环进入Conclude阶段 | 审核分析结论，做出最终决策 |

## 决策边界管理

| 决策类型 | 说明 | 执行方式 |
|---------|------|---------|
| data_decision | 数据明确支持，可自动执行 | AI自动执行 + 事后报告 |
| data_reference | 数据供参考，人类决策 | 推送洞察，等待决策 |
| human_decision | 复杂决策，人类主导 | 提供分析，人类决策 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| DACE循环Conclude阶段人类未响应 | 暂停Execute阶段，保留Conclude状态，支持人类恢复后继续 |
| 洞察置信度过低（<0.5） | 标记为human_decision，不自动传递到文化报告，等待人类确认 |
| OKR数据缺失 | 降级为用户提供指标数据执行DACE，标注"OKR数据待补充" |
| 决策边界标注冲突 | 标记冲突项，暂停自动执行，提交人类裁决 |
| 文化报告体系数据源中断 | 跳过受影响报告，标注"数据源中断"，其他报告正常生成 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
