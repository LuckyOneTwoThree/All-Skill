---
name: decision-orchestrator
description: 当需要将数据分析结果转化为决策行动时使用。数据驱动决策指挥官，调度 decision-dace（DACE决策循环）、decision-insight（洞察转化）、decision-culture（数据文化建设），实现从数据到决策的闭环。关键词：数据决策、DACE循环、数据洞察、决策框架、数据文化、decision-dace、decision-insight、decision-culture。
metadata:
  module: "产品度量运营"
  sub-module: "决策闭环"
  type: "orchestrator"
  version: "5.0"
---

# 数据驱动决策指挥官

## 核心原则

**数据驱动决策，但决策权在人类**

数据的作用是照亮决策的盲区，而非替代决策者。DACE循环中，Define和Analyze由数据驱动，Conclude由人类决策，Execute由系统追踪——这是数据与人类的最优分工。

## 编排理念

1. **DACE循环是主线，洞察和文化是支撑**：DACE循环驱动决策闭环，洞察转化提升决策质量，文化建设保障决策落地
2. **Conclude阶段必须有人类参与**：无论数据多明确，涉及业务策略的决策必须由人类确认
3. **决策边界分级传递**：data_decision自动执行、data_reference推送确认、human_decision等待审批

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-metrics-ops/decision-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-metrics-ops/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-metrics-ops/decision-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: decision-dace
    gate: 目标已定义、数据已分析、洞察已生成
  - stage: decision-insight
    depends_on: [decision-dace]
    gate: 每个洞察都有对应的决策选项和行动方案
  - stage: decision-culture
    depends_on: [decision-dace, decision-insight]
    gate: 报告体系正常运行（每日/每周/每月/每季）
```

## 阶段执行计划

#### 调用 decision-dace

```
Skill: decision-dace
输入:
  okr_data: 用户提供
  kr_progress: analysis-anomaly → anomaly_report.json
  experiment_result: experiment-execution → ab_test_result.yaml
输出: output/pm-metrics-ops/decision-dace/
验证: Define阶段目标可量化、有基线；Analyze阶段覆盖所有数据源；Conclude阶段提供至少2个决策选项；Execute阶段设置监控和回滚机制
模式: 🤖→👤
```

#### 调用 decision-insight

```
Skill: decision-insight
输入:
  analysis_result: analysis-anomaly → anomaly_report.json
  experiment_result: experiment-execution → ab_test_result.yaml
  business_context: 用户提供（可选）
  insight_library: decision-insight → insight_library.json（可选）
输出: output/pm-metrics-ops/decision-insight/
验证: 洞察叙述使用业务语言而非数据术语；每个洞察至少提供2个决策选项；决策边界标注正确（auto/reference/human）；推荐行动有明确的下一步和负责人
模式: 🤖→👤
```

#### 调用 decision-culture

```
Skill: decision-culture
输入:
  okr_data: decision-dace → dace_status.yaml
  decision_records: decision-insight → data_insight.yaml
  team_feedback: 用户提供（可选）
输出: output/pm-metrics-ops/decision-culture/
验证: 每日摘要无异常时未产生噪音告警；周报包含OKR进度和实验汇总；月报包含完整指标趋势和偏差分析；报告中所有数据引用可追溯至数据源
模式: 🤖→👤
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| DACE循环Define/Analyze完成 | 目标已定义、数据已分析、洞察已生成 | 补充数据或重新定义目标 |
| 洞察已转化为行动 | 每个洞察都有对应的决策选项和行动方案 | 标记为待处理，持续追踪 |
| 数据文化报告体系运行 | 每日/每周/每月/每季报告正常生成 | 检查上游数据源或调整报告模板 |

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

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
- v4.0: 执行步骤原则替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
