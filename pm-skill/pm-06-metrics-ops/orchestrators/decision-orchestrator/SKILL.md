---
name: decision-orchestrator
description: 当需要将数据分析结果转化为决策行动时使用。数据驱动决策指挥官，调度 decision-dace（DACE决策循环）、decision-insight（洞察转化）、decision-culture（数据文化建设），实现从数据到决策的闭环。关键词：数据决策、DACE循环、数据洞察、决策框架、数据文化、decision-dace、decision-insight、decision-culture。
metadata:
  module: "产品度量运营"
  sub-module: "决策闭环"
  type: "orchestrator"
  version: "3.0"
---

# 数据驱动决策指挥官

## 核心原则

**数据驱动决策，但决策权在人类**

数据的作用是照亮决策的盲区，而非替代决策者。DACE循环中，Define和Analyze由数据驱动，Conclude由人类决策，Execute由系统追踪——这是数据与人类的最优分工。

## 执行步骤

1. **全量分析**：决策依据基于全量数据分析，不依赖片段信息或直觉判断
2. **实时感知**：异常检测和实验结果即时触发决策流程，缩短从洞察到行动的时间
3. **自动归因**：洞察自动转化为决策选项，附带决策边界和置信度评估
4. **决策规则显式化**：data_decision可AI自动执行、data_reference需人类确认、human_decision由人类主导，决策边界规则前置

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：DACE决策循环

| 项目 | 内容 |
|------|------|
| 子Skill名称 | decision-dace |
| 读取定义路径 | `.trae/skills/decision-dace/SKILL.md` |
| 输入 | OKR数据（用户提供）、KR进度（analysis-anomaly → anomaly_report.json）、实验结果（experiment-execution → ab_test_result.yaml） |
| 输出 | `output/pm-metrics-ops/decision-dace/dace_status.json`、`output/pm-metrics-ops/decision-dace/okr_tracking.json`、`output/pm-metrics-ops/decision-dace/action_log.json`、`output/pm-metrics-ops/decision-dace/dace_cycle_report.md` |
| 验证 | Define阶段目标可量化、有基线；Analyze阶段覆盖所有数据源；Conclude阶段提供至少2个决策选项；Execute阶段设置监控和回滚机制 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 目标已定义、数据已分析、洞察已生成；若未通过则补充数据或重新定义目标 |

### 阶段2：洞察转化

| 项目 | 内容 |
|------|------|
| 子Skill名称 | decision-insight |
| 读取定义路径 | `.trae/skills/decision-insight/SKILL.md` |
| 输入 | 分析结果（analysis-anomaly → anomaly_report.json）、实验结果（experiment-execution → ab_test_result.yaml）、业务上下文（用户提供，可选）、历史洞察库（decision-insight → insight_library.json，可选） |
| 输出 | `output/pm-metrics-ops/decision-insight/` |
| 验证 | 洞察叙述使用业务语言而非数据术语；每个洞察至少提供2个决策选项；决策边界标注正确（auto/reference/human）；推荐行动有明确的下一步和负责人 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 每个洞察都有对应的决策选项和行动方案；若未通过则标记为待处理，持续追踪 |

### 阶段3：数据文化建设

| 项目 | 内容 |
|------|------|
| 子Skill名称 | decision-culture |
| 读取定义路径 | `.trae/skills/decision-culture/SKILL.md` |
| 输入 | OKR数据（decision-dace → dace_status.yaml）、决策记录（decision-insight → data_insight.yaml）、团队反馈（用户提供，可选） |
| 输出 | `output/pm-metrics-ops/decision-culture/culture/`（daily/、weekly/、monthly/、quarterly/）、`output/pm-metrics-ops/decision-culture/dashboards/`、`output/pm-metrics-ops/decision-culture/engagement/` |
| 验证 | 每日摘要无异常时未产生噪音告警；周报包含OKR进度和实验汇总；月报包含完整指标趋势和偏差分析；报告中所有数据引用可追溯至数据源 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 报告体系正常运行（每日/每周/每月/每季）；若未通过则检查上游数据源或调整报告模板 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-metrics-ops/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

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

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
