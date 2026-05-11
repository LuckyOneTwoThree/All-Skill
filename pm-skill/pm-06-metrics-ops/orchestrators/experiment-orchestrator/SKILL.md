---
name: experiment-orchestrator
description: 当需要设计或执行A/B测试实验时使用。实验验证指挥官，调度experiment-design/execution/report。关键词：A/B测试、实验设计、统计显著性、实验执行。
metadata:
  module: "产品度量运营"
  sub-module: "实验验证"
  type: "orchestrator"
  version: "4.0"
---

# 实验设计指挥官

## 核心原则

**实验是学习的最快方式**

每一个实验都是一次有控制的探索，目标不是证明假设正确，而是以最快速度获得可靠的学习。实验的价值在于学习速度，而非实验数量。

## 执行步骤

1. **全量分析**：实验结果基于全量数据分析，统计检验使用完整样本，不依赖中间抽样推断
2. **实时感知**：实验运行期间持续监控，样本量、护栏指标、新奇效应实时追踪
3. **自动归因**：实验结果自动进行多维下钻分析，识别异质性效应和新奇效应
4. **决策规则显式化**：统计显著且稳定可考虑提前终止、护栏指标下降触发告警、新奇效应显著则延长周期，规则前置而非事后判断

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：实验设计

| 项目 | 内容 |
|------|------|
| 子Skill名称 | experiment-design |
| 读取定义路径 | `.trae/skills/experiment-design/SKILL.md` |
| 输入 | 假设陈述（用户提供）、可用流量（用户提供）、指标体系（metrics-system → metrics.json，可选）、历史数据（analysis-funnel/analysis-retention，可选） |
| 输出 | `output/pm-metrics-ops/experiment-design/` |
| 验证 | 假设已结构化（If-Then-Because-For）；主指标与假设直接对应；护栏指标覆盖留存、收入、技术三个维度；样本量计算参数有据可依 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 实验设计经人类审核确认；若未通过则阻止实验上线，修改后重新审核 |

### 阶段2：实验执行

| 项目 | 内容 |
|------|------|
| 子Skill名称 | experiment-execution |
| 读取定义路径 | `.trae/skills/experiment-execution/SKILL.md` |
| 输入 | 实验设计文档（experiment-design → `output/pm-metrics-ops/experiment-design/experiment_design.json`）、实验数据（用户提供）、终止条件（experiment-design → experiment_design.json） |
| 输出 | `output/pm-metrics-ops/experiment-execution/` |
| 验证 | 实验分组流量分配正确；护栏指标未触发告警；实验数据采集完整；统计显著性计算正确 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 样本量充足且统计检验完成；若未通过则延长实验周期或扩大流量 |

### 阶段3：实验报告

| 项目 | 内容 |
|------|------|
| 子Skill名称 | experiment-report |
| 读取定义路径 | `.trae/skills/experiment-report/SKILL.md` |
| 输入 | 实验设计方案（experiment-design → `output/pm-metrics-ops/experiment-design/`）、实验执行结果（experiment-execution → `output/pm-metrics-ops/experiment-execution/`）、产品背景（用户提供，可选） |
| 输出 | `output/pm-metrics-ops/experiment-report/experiment-report.md`、`output/pm-metrics-ops/experiment-report/experiment-report.json` |
| 验证 | 统计结论与数据一致；行动建议与结论一致；护栏指标全覆盖；异质性效应已分析（至少3个分群维度） |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 实验报告经人类审核确认；若未通过则补充分析或修改结论 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-metrics-ops/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

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

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 experiment-report（A/B测试报告）
- v4.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
