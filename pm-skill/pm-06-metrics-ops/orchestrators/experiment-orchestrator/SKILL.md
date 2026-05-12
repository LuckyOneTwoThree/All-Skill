---
name: experiment-orchestrator
description: 当需要设计或执行A/B测试实验时使用。实验验证指挥官，调度experiment-design/execution/report。关键词：A/B测试、实验设计、统计显著性、实验执行。
metadata:
  module: "产品度量运营"
  sub-module: "实验验证"
  type: "orchestrator"
  version: "6.0"
---

# 实验设计指挥官

## 核心原则

**实验是学习的最快方式**

每一个实验都是一次有控制的探索，目标不是证明假设正确，而是以最快速度获得可靠的学习。实验的价值在于学习速度，而非实验数量。

## 编排理念

1. **设计→执行→报告三阶段缺一不可**：没有设计的执行是盲目的，没有报告的执行是浪费的
2. **人类审核是实验的必要卡口**：实验方案和实验报告都必须经人类审核，执行过程可自动化
3. **护栏指标一票否决**：无论主指标多正向，护栏指标突破即暂停

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-metrics-ops/experiment-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-metrics-ops/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-metrics-ops/experiment-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: experiment-design
    gate: 实验设计经人类审核确认
  - stage: experiment-execution
    depends_on: [experiment-design]
    gate: 样本量充足且统计检验完成
  - stage: experiment-report
    depends_on: [experiment-design, experiment-execution]
    gate: 实验报告经人类审核确认
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
输出: output/pm-metrics-ops/experiment-execution/
验证: 实验分组流量分配正确；护栏指标未触发告警；实验数据采集完整；统计显著性计算正确
模式: 🤖
```

#### 调用 experiment-report

```
Skill: experiment-report
输入:
  experiment_design: output/pm-metrics-ops/experiment-design/
  execution_result: output/pm-metrics-ops/experiment-execution/
  product_background: 用户提供（可选）
输出: output/pm-metrics-ops/experiment-report/
验证: 统计结论与数据一致；行动建议与结论一致；护栏指标全覆盖；异质性效应已分析（至少3个分群维度）
模式: 🤖→👤
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 实验方案人类已审核 | 实验设计经人类审核确认 | 阻止实验上线，修改后重新审核 |
| 统计显著性已判断 | 样本量充足且统计检验完成 | 延长实验周期或扩大流量 |
| 实验报告已审核 | 实验报告经人类审核确认 | 补充分析或修改结论 |

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
| 实验报告人类审核未通过 | 返回报告阶段补充分析，不传递到下游 |
| 多实验流量冲突 | 按优先级排队，低优先级实验暂停，标注"流量冲突" |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 experiment-report（A/B测试报告）
- v4.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
- v5.0: 执行步骤原则替换为编排理念，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
