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

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

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
  experiment_result: experiment-execution → ab_test_result.yaml
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

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-metrics-ops/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-metrics-ops/decision-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: design-orchestrator
    reason: 决策完成，建议进入产品设计阶段，将决策结论转化为功能变更
    input_mapping:
      decision_output: "output/pm-metrics-ops/decision-dace/ → design-prd输入"
  alternatives:
    - target: experiment-orchestrator
      reason: 如决策需要A/B测试验证效果
      condition: 决策结论需要量化验证时
    - target: iteration-orchestrator
      reason: 如决策涉及迭代优先级调整
      condition: 决策结论影响迭代计划时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

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

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
- v4.0: 执行步骤原则替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.0: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v7.0: 合并 decision-insight 到 decision-dace，移除 decision-insight 阶段，更新编排理念为DACE循环是主线+洞察已内嵌，更新 decision-culture 输入来源从 decision-insight 改为 decision-dace
