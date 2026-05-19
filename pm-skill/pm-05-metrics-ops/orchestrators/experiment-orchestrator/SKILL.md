---
name: experiment-orchestrator
description: 当需要设计或执行A/B测试实验时使用。实验验证指挥官，调度experiment-design/execution。关键词：A/B测试、实验设计、统计显著性、实验执行、效果验证、AB测试、对照实验。
metadata:
  module: "产品度量运营"
  sub-module: "实验验证"
  type: "orchestrator"
  version: "8.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "设计一个A/B测试"
    - "验证一下方案效果"
    - "跑一下对照实验"
    - "分析实验结果"
---

# 实验设计指挥官

## 核心原则

**实验是学习的最快方式**

每一个实验都是一次有控制的探索，目标不是证明假设正确，而是以最快速度获得可靠的学习。实验的价值在于学习速度，而非实验数量。

## 编排理念

1. **设计→执行两阶段缺一不可**：没有设计的执行是盲目的，执行阶段包含结果分析和报告生成
2. **人类审核是实验的必要卡口**：实验方案和实验报告都必须经人类审核，执行过程可自动化
3. **护栏指标一票否决**：无论主指标多正向，护栏指标突破即暂停

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
pipeline: experiment-orchestrator
version: 8.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-metrics-ops/experiment-orchestrator.md

stages:
  - id: phase-1
    name: "实验设计"
    depends_on: []
    skills: [experiment-design]
    gate:
      condition: "实验设计经人类审核确认"
      fail_action: "阻止实验上线，修改后重新审核"

  - id: phase-2
    name: "实验执行"
    depends_on: [phase-1]
    skills: [experiment-execution]
    gate:
      condition: "样本量充足且统计检验完成、实验报告经人类审核确认"
      fail_action: "延长实验周期或扩大流量"
```

## 阶段执行计划

#### 调用 experiment-design

```
Skill: experiment-design
输入:
  hypothesis: 用户提供（假设陈述）
  available_traffic: 用户提供（可用流量）
  metrics_system: metrics-system → metrics.json（可选）
  historical_data: analysis-funnel/analysis-retention（可选）
输出: output/pm-metrics-ops/experiment-design/
验证: 假设已结构化（If-Then-Because-For）；主指标与假设直接对应；护栏指标覆盖留存、收入、技术三个维度；样本量计算参数有据可依
模式: 🤖→👤
```

#### 调用 experiment-execution

```
Skill: experiment-execution
输入:
  experiment_design: output/pm-metrics-ops/experiment-design/experiment_design.json
  experiment_data: 用户提供
  termination_conditions: output/pm-metrics-ops/experiment-design/experiment_design.json
  product_background: 用户提供（可选）
输出: output/pm-metrics-ops/experiment-execution/
验证: 实验分组流量分配正确；护栏指标未触发告警；实验数据采集完整；统计显著性计算正确；统计结论与数据一致；行动建议与结论一致；护栏指标全覆盖；异质性效应已分析（至少3个分群维度）
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-metrics-ops/experiment-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-metrics-ops/ |
| 总结输出路径 | output/phase-reports/pm-metrics-ops/experiment-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: decision-orchestrator（实验完成，将实验结论转化为决策行动）
  alternatives:
    - target: release-orchestrator
      reason: 实验结果显著，建议全量发布
      condition: 实验结果统计显著（p<0.05）且业务意义达标时
    - target: analysis-orchestrator
      reason: 实验结果需更深入的数据分析
      condition: 实验结果存在异常或需多维下钻时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 实验方案人类已审核 | 实验设计经人类审核确认 | 阻止实验上线，修改后重新审核 |
| 统计显著性已判断 | experiment-result输出文件已生成且非空 | 延长实验周期或扩大流量 |
| 实验报告已审核 | 实验报告经人类审核确认 | 补充分析或修改结论 |
| 阶段总结已生成 | output/phase-reports/pm-metrics-ops/experiment-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 实验方案审核 | 实验设计完成 | 审核假设合理性、指标选择、分流方案 |
| 全量/终止决策 | 实验结果分析完成 | 决定全量发布、终止实验或延长周期 |
| 实验报告确认 | 实验报告生成完成 | 确认报告结论和行动建议 |

## 决策规则

| 条件 | Action |
|------|--------|
| 样本量达到100% | 立即触发结果分析 |
| 统计显著（p < 0.05）且稳定 | 考虑提前终止 |
| 护栏指标显著下降 | 触发告警，考虑终止 |
| 新奇效应显著 | 延长实验周期 |
| 实验组持续负向 | 考虑提前终止 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 实验设计人类审核未通过 | 阻止实验上线，返回设计阶段修改，不进入执行阶段 |
| 护栏指标突破阈值 | 立即暂停实验执行，触发告警，提交人类决策是否终止实验 |
| 实验数据采集异常 | 标记数据异常，暂停统计检验，提示人类检查数据管道 |
| 实验报告人类审核未通过 | 返回执行阶段补充分析，不传递到下游 |
| 多实验流量冲突 | 按优先级排队，低优先级实验暂停，标注"流量冲突" |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
