---
name: analysis-orchestrator
description: 当需要进行数据异常检测、漏斗分析或留存分析时使用。数据分析指挥官，调度analysis-anomaly/funnel/retention/data-analysis-report。关键词：数据分析、异常检测、漏斗分析、留存分析、Aha Moment。
metadata:
  module: "产品度量运营"
  sub-module: "数据分析"
  type: "orchestrator"
  version: "4.0"
---

# 数据分析指挥官

## 核心原则

**用数据减少决策中的猜测**

数据分析的价值不在于产出报告，而在于将不确定性转化为可量度的风险，将直觉判断转化为证据支撑的决策。

## 执行步骤

1. **全量分析**：不依赖抽样，对全量数据进行计算，确保分析结论的统计可靠性
2. **实时感知**：7×24小时异常检测运行，核心指标每小时健康检查，确保问题即时发现
3. **自动归因**：异常检测后自动执行归因流程——确认真实性、定位范围、关联外部事件、生成归因结论
4. **决策规则显式化**：P0异常即时推送+电话告警、P1异常2小时内通知、P2异常每日汇总、P3波动仅记录，规则前置而非事后判断

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：异常检测

| 项目 | 内容 |
|------|------|
| 子Skill名称 | analysis-anomaly |
| 读取定义路径 | `.trae/skills/analysis-anomaly/SKILL.md` |
| 输入 | 指标体系（metrics-system → metrics.json）、实时数据流（数据仓库/实时计算平台）、告警规则（用户提供）、事件日历（用户提供，可选） |
| 输出 | `output/pm-metrics-ops/analysis-anomaly/anomaly_reports/`、`output/pm-metrics-ops/analysis-anomaly/charts/`、`output/pm-metrics-ops/analysis-anomaly/data/` |
| 验证 | 异常检测覆盖所有关键指标；异常等级分类正确（P0/P1/P2）；根因分析有数据支撑；建议措施可操作 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 异常检测Pipeline持续运行，无中断；若未通过则立即修复检测Pipeline，启动备用监控 |

### 阶段2：漏斗分析

| 项目 | 内容 |
|------|------|
| 子Skill名称 | analysis-funnel |
| 读取定义路径 | `.trae/skills/analysis-funnel/SKILL.md` |
| 输入 | 漏斗定义（用户提供）、事件数据（用户提供）、分群配置（用户提供，可选）、对比周期（用户提供，可选） |
| 输出 | `output/pm-metrics-ops/analysis-funnel/`（charts/、data/） |
| 验证 | 漏斗步骤定义完整、无遗漏；转化率计算基于全量数据；流失节点识别附带原因假设；多维下钻覆盖至少3个维度 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 核心业务漏斗已定义且数据完整；若未通过则补充漏斗定义，确保核心路径覆盖 |

### 阶段3：留存分析

| 项目 | 内容 |
|------|------|
| 子Skill名称 | analysis-retention |
| 读取定义路径 | `.trae/skills/analysis-retention/SKILL.md` |
| 输入 | 用户行为数据（用户提供）、分群定义（用户提供，可选）、Cohort配置（用户提供，可选）、基准日期（用户提供，可选） |
| 输出 | `output/pm-metrics-ops/analysis-retention/`（charts/、data/） |
| 验证 | 留存计算基于全量用户而非抽样；Cohort分析覆盖时间、渠道、行为三个维度；Aha Moment候选通过显著性检验；流失预警模型准确率>70% |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 至少产出1个Aha Moment候选行为；若未通过则扩大行为搜索范围或延长分析周期 |

### 阶段4：数据洞察报告

| 项目 | 内容 |
|------|------|
| 子Skill名称 | data-analysis-report |
| 读取定义路径 | `.trae/skills/data-analysis-report/SKILL.md` |
| 输入 | 漏斗分析（analysis-funnel → `output/pm-metrics-ops/analysis-funnel/`）、留存分析（analysis-retention → `output/pm-metrics-ops/analysis-retention/`）、异常检测（analysis-anomaly → `output/pm-metrics-ops/analysis-anomaly/`）、决策洞察（decision-insight → insight.json，可选）、度量体系（metrics-system → metrics_system.json，可选）、分析时间范围（用户提供）、产品/业务信息（用户提供，可选） |
| 输出 | `output/pm-metrics-ops/data-analysis-report/data-analysis-report.md`、`output/pm-metrics-ops/data-analysis-report/data-analysis-report.json` |
| 验证 | 执行摘要包含3条关键发现+Top1建议；核心指标仪表盘完整；漏斗分析包含最大流失点和提升机会；留存分析包含生命周期阶段；每条洞察有数据事实+业务含义；行动建议至少3条，每条有优先级和验证方式；数据口径和局限性已说明 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 报告执行摘要完整，至少3条行动建议；若未通过则补充分析或标注"建议补充数据" |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-metrics-ops/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 异常检测7×24运行 | 异常检测Pipeline持续运行，无中断 | 立即修复检测Pipeline，启动备用监控 |
| 漏斗核心路径覆盖 | 核心业务漏斗已定义且数据完整 | 补充漏斗定义，确保核心路径覆盖 |
| 留存Aha Moment候选已识别 | 至少产出1个Aha Moment候选行为 | 扩大行为搜索范围或延长分析周期 |
| 数据洞察报告已生成 | 报告执行摘要完整，至少3条行动建议 | 补充分析或标注"建议补充数据" |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| P0异常即时确认 | P0级异常检测触发 | 确认异常真实性，决定响应策略 |

## 决策规则

| 条件 | Action |
|------|--------|
| P0异常 | 即时推送 + 电话告警 |
| P1异常 | 2小时内Slack/企微通知 |
| P2异常 | 每日汇总报告 |
| P3波动 | 仅记录，不告警 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 data-analysis-report（数据分析报告）
- v4.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
