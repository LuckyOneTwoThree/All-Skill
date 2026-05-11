---
name: design-orchestrator
description: 当需要生成PRD、需求规格说明书、信息架构设计、用户流程设计、原型设计、交互设计规范或设计交接时使用。产品设计与原型子模块指挥官。关键词：产品设计、PRD、SRS、需求规格、信息架构、用户流程、原型设计、交互规范、设计交接、Handoff。
metadata:
  module: "产品构思与设计"
  sub-module: "产品设计与原型"
  type: "orchestrator"
  version: "4.0"
---

# 产品设计与原型指挥官

## 核心原则

设计是取舍不是堆砌，核心路径必须极致流畅。

## 执行步骤

1. **批量生成人类筛选**：AI批量生成分类/排序建议，人类做最终筛选和判定
2. **结构化发散**：用固定模板和框架引导需求拆解，避免遗漏和随意性
3. **假设驱动而非功能驱动**：每个需求背后必须还原为用户假设，而非直接进入功能设计
4. **设计规范即约束**：需求分析阶段就引入设计规范约束，避免后期返工

## 任务调度

```
design-prd → requirements-srs → design-ia → design-userflow → design-prototype → interaction-spec → design-handoff-spec
```

| 阶段 | 任务 | 执行模式 |
|------|------|----------|
| 1 | design-prd | 🤖→👤 AI建议，人类审批 |
| 2 | requirements-srs | 🤖→👤 AI建议，人类审批 |
| 3 | design-ia | 🤖→👤 AI建议，人类审批 |
| 4 | design-userflow | 🤖→👤 AI建议，人类审批 |
| 5 | design-prototype | 🤖→👤 AI建议，人类审批 |
| 6 | interaction-spec | 🤖→👤 AI建议，人类审批 |
| 7 | design-handoff-spec | 🤖→👤 AI建议，人类审批 |

### 数据流转

```
[需求分析输出 + 创意方案输出 + 战略输出]
       ↓
design-prd
       ↓ prd (background / objectives / solution_design / functional_spec / metrics / quality_report)
requirements-srs
       ↓ srs (functional_requirements / non_functional_requirements / constraints / data_models)
design-ia
       ↓ ia_proposals (navigation_pattern / content_structure / card_sorting_result / hierarchy)
design-userflow
       ↓ userflow (flow_steps / decision_points / error_flows / dead_ends)
design-prototype
       ↓ prototype (pages / components / interactions / states / design_system_compliance / heuristic_evaluation)
interaction-spec
       ↓ interaction_spec (state_machine / animations / gestures / feedback_patterns / accessibility)
design-handoff-spec
       ↓ handoff_spec (design_tokens / component_specs / spacing / assets / implementation_notes)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-design/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| PRD生成完成 | PRD 4道质量门禁全部通过 | 门禁1或2失败阻塞流程，输出缺失项清单 |
| SRS生成完成 | 功能需求有唯一编号，非功能需求覆盖5维度 | 补充缺失需求或标注"待确认" |
| IA设计完成 | IA方案人类已确认 | 生成2-3个候选方案供人类选择 |
| 用户流程完成 | 用户流程死胡同=0 | 死胡同必须修复后才能进入原型阶段 |
| 原型完成 | 原型设计规范一致性≥85% | 一致性<85%需人类确认violations |
| 交互规范完成 | 交互状态机8种基础状态全覆盖 | 补充缺失状态定义 |
| 设计交接完成 | 交接文档待确认项=0 | 待确认项需逐项确认或标注接受风险 |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| PRD层级确认 | AI自动分级置信度<0.7时，强制人类确认PRD层级（L/S/X） |
| SRS需求确认 | AI生成SRS后，人类确认非功能需求指标和约束条件 |
| IA方案选择 | AI生成2-3个IA候选方案，人类选择最终方案 |
| 设计规范violation确认 | 设计规范一致性<85%时，人类判断是否接受violation |
| 交互规范确认 | 交互设计规范生成后，人类确认状态机、动画和手势规范 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 requirements-srs（需求规格说明书）、design-handoff-spec（设计交接文档）
- v4.0: 新增 interaction-spec（交互设计规范）
