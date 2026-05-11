---
name: diagnosis-orchestrator
description: 当需要诊断产品健康度或追踪竞品动态时使用。智能诊断指挥官，调度 diagnosis-health、diagnosis-competition、competitor-monitoring-report、product-sunset-plan 子Skill执行。关键词：智能诊断、健康度评分、竞品追踪、问题归因、MTTR、竞品监控、产品下线。
metadata:
  module: "产品监控与迭代"
  sub-module: "问题诊断"
  type: "orchestrator"
  version: "4.0"
---

# 智能诊断指挥官

## 核心原则

**快速定位问题根因，减少MTTR**

诊断的价值不在于产出报告，而在于缩短从问题发现到根因定位的时间。每多一分钟不确定，就多一分钟的风险暴露和资源浪费。

## 执行步骤

1. **主动监控而非被动响应**：每日定时诊断+监控异常触发，而非等人工发起诊断
2. **归因分层**：健康度诊断按"性能→可用性→满意度→业务"多维度分层，竞品追踪按"功能变更→优劣势→应对策略"分层推进
3. **决策规则前置**：健康度评分偏差阈值、竞品重大更新判定标准在系统初始化时定义
4. **持续学习**：诊断结论和竞品应对效果持续反馈，优化诊断模型和应对策略库

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：健康度诊断

| 项目 | 内容 |
|------|------|
| 子Skill名称 | diagnosis-health |
| 读取定义路径 | `.trae/skills/diagnosis-health/SKILL.md` |
| 输入 | 性能数据（APM/监控系统）、可用性数据（监控系统）、用户满意度（反馈系统）、业务指标（数据分析平台）、竞品动态（diagnosis-competition → 竞品报告，可选） |
| 输出 | `output/pm-monitoring/diagnosis-health/`（{date}/overall_score.md、dimension_scores.yaml、trend_analysis.yaml、bottlenecks.yaml、recommendations.md、latest/health_report.md） |
| 验证 | 数据采集完整率≥90%；评分计算准确性；趋势预测偏差±10%；瓶颈识别覆盖率≥90% |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 健康度评分偏差±10%以内，否则校准评分模型或补充数据后再进入下一阶段 |

### 阶段2：竞品动态追踪

| 项目 | 内容 |
|------|------|
| 子Skill名称 | diagnosis-competition |
| 读取定义路径 | `.trae/skills/diagnosis-competition/SKILL.md` |
| 输入 | 竞品数据（竞品监控系统）、自身数据（产品数据平台）、市场数据（行业报告，可选）、历史追踪（diagnosis-competition → 历史报告，可选） |
| 输出 | `output/pm-monitoring/diagnosis-competition/`（{date}/feature_changes.yaml、advantage_changes.yaml、response_strategy.yaml、effect_tracking.yaml、latest/competition_report.md） |
| 验证 | 竞品覆盖完整性≥90%；功能变更识别及时性≤7天；策略可执行性≥80% |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 竞品动态已追踪（竞品功能变更已识别，优劣势分析已完成），否则补充竞品数据源或延长追踪周期 |

### 阶段3：竞品监控报告汇总

| 项目 | 内容 |
|------|------|
| 子Skill名称 | competitor-monitoring-report |
| 读取定义路径 | `.trae/skills/competitor-monitoring-report/SKILL.md` |
| 输入 | 竞品追踪数据（diagnosis-competition）、竞品情报（market-competitor-intel，可选）、竞品分类（market-competitor-quadrant，可选）、监控周期（用户提供，可选） |
| 输出 | `output/pm-monitoring/competitor-monitoring-report/competitor-monitoring-report.md`、`output/pm-monitoring/competitor-monitoring-report/competitor-monitoring-report.json` |
| 验证 | 动态覆盖完整（产品/市场/舆论3维度均有分析）；威胁评估有依据；应对建议可执行 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 竞品监控报告经人类审核确认，否则补充分析或修改应对建议 |

### 附加阶段（按需触发）：产品下线方案

| 项目 | 内容 |
|------|------|
| 子Skill名称 | product-sunset-plan |
| 读取定义路径 | `.trae/skills/product-sunset-plan/SKILL.md` |
| 输入 | 健康度诊断（diagnosis-health）、留存数据（retention-churn，可选）、下线对象（用户提供）、下线原因（用户提供） |
| 输出 | `output/pm-monitoring/product-sunset-plan/product-sunset-plan.md`、`output/pm-monitoring/product-sunset-plan/product-sunset-plan.json` |
| 验证 | 影响评估完整（用户/收入/品牌3维度）；迁移方案可行；数据处置合规；时间线可执行 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 产品下线方案经人类审核确认，否则补充分析或修改迁移方案 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-monitoring/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 健康度评分偏差±10% | 健康度评分与实际状态偏差在可控范围内 | 校准评分模型或补充数据 |
| 竞品动态已追踪 | 竞品功能变更已识别，优劣势分析已完成 | 补充竞品数据源或延长追踪周期 |
| 竞品监控报告已审核 | 竞品监控报告经人类审核确认 | 补充分析或修改应对建议 |
| 产品下线方案已审核 | 产品下线方案经人类审核确认 | 补充分析或修改迁移方案 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 健康度评分校准 | 健康度评分与实际感知偏差超过±10% | 确认评分模型校准方案和权重调整 |
| 竞品监控报告确认 | 竞品监控报告生成完成 | 确认威胁评估和应对建议 |
| 产品下线方案确认 | 产品下线方案生成完成 | 确认下线时间线和用户迁移方案 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 competitor-monitoring-report（竞品监控报告）、product-sunset-plan（产品下线方案）
- v4.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
