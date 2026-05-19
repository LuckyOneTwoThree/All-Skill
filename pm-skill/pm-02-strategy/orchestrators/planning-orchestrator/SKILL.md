---
name: planning-orchestrator
description: 当需要进行产品立项、战略规划或路线图制定时使用。战略规划指挥官，调度产品提案、战略分析（SWOT/Ansoff/波特五力）、OKR、北极星、路线图等子Skill。关键词：产品立项、战略规划、SWOT、OKR、路线图、战略分析、制定目标、产品规划、年度规划。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "orchestrator"
  version: "10.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我做产品立项"
    - "制定一下战略规划"
    - "设定OKR目标"
    - "规划一下产品路线图"
    - "做一下SWOT分析"
---

# 战略规划与路线图指挥官

## 核心原则

确保做正确的事，而非正确地做事。

1. **战略对齐层层传递**——从愿景到OKR到路线图，确保每一层目标可追溯到上一层战略意图
2. **资源约束前置**——在规划阶段即引入资源边界条件，避免产出无法落地的理想化路线图
3. **决策点不后延**——每个阶段的战略选择必须在当前阶段完成，禁止以"待定"状态传递到下游

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline 定义

```yaml
pipeline: planning-orchestrator
version: 10.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/planning-orchestrator.md

stages:
  - id: phase-1
    name: "产品提案"
    skills: [product-proposal]
    gate:
      condition: "提案书人类已签批"
      fail_action: "补充数据后重新提交"

  - id: phase-2
    name: "战略分析"
    depends_on: [phase-1]
    skills: [strategic-analysis]
    gate:
      condition: "strategic-analysis.json已生成，战略结论整合完成，人类决策项已确认"
      fail_action: "置信度<0.6的项目升级人类校准，战略方向需人类选择"

  - id: phase-3
    name: "北极星指标"
    depends_on: [phase-2]
    skills:
      - planning-north-star
    gate:
      condition: "北极星指标人类已选择"
      fail_action: "北极星必须人类决策"

  - id: phase-3b
    name: "OKR设定"
    depends_on: [phase-3]
    skills:
      - planning-okr
    gate:
      condition: "OKR人类已确认"
      fail_action: "OKR达成概率<0.3升级调整"

  - id: phase-4
    name: "路线图"
    depends_on: [phase-3b]
    skills:
      - planning-roadmap
    gate:
      condition: "路线图资源人类已审批"
      fail_action: "优先级和资源分配必须人类决策"
```

## 阶段执行计划

### 阶段1：product-proposal

- **Skill**: product-proposal
- **输入**:
  - competitor_analysis: 竞品分析报告（来自 market-competitor-analysis → competitor-analysis.md）
  - tam_som: 市场规模数据（来自 market-tam-som → tam-som.json）
  - user_research_report: 用户研究报告（来自 user-research-report → user-research-report.md）
  - opportunity_definition: 机会定义（来自 opportunity-definition → opportunity-definition.json）
  - positioning_strategy: 定位策略（来自 output/pm-strategy/positioning-strategy/positioning-strategy.json）
  - product_name_category: 产品名称与品类（用户提供）
  - business_goal: 商业目标（用户提供）
  - resource_constraints: 资源约束（可选，用户提供）
- **输出**: `output/pm-strategy/product-proposal/`（product-proposal.md + product-proposal.json）
- **验证**: 提案书人类已签批
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: 提案书人类已签批 → 未通过：补充数据后重新提交

### 阶段2：strategic-analysis

- **Skill**: strategic-analysis
- **输入**:
  - exploration_output: 探索阶段输出（来自 user-research-user-modeling / opportunity-definition）
  - competitor_analysis: 竞品分析数据（来自 market-competitor-analysis → competitor-analysis.json）
  - bmc: BMC商业模式画布（来自 output/pm-strategy/business-model-canvas/bmc.json，可选）
  - market_data: 市场数据（来自 market-tam-som → tam-som.json，可选）
  - industry_info: 行业信息（来自 market-pest → pest.json，可选）
  - internal_capability: 内部能力评估（可选，用户提供）
  - product_definition: 当前产品定义（可选，用户提供）
  - market_definition: 当前市场定义（可选，用户提供）
  - growth_goal: 增长目标（可选，来自 planning-okr → okr.json）
- **输出**: `output/pm-strategy/strategic-analysis/`（strategic-analysis.json + strategic-analysis.md）
- **验证**: strategic-analysis.json已生成，框架选择合理，各选择框架分析完整，战略结论整合完成，人类决策项已确认
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: 战略结论整合完成，人类决策项已确认 → 未通过：置信度<0.6的项目升级人类校准，战略方向需人类选择

### 阶段3：目标设定（planning-north-star → planning-okr）

本阶段顺序执行两个子Skill：先调用 planning-north-star 生成北极星指标候选，人类选择后，再调用 planning-okr 基于北极星指标生成OKR候选，人类确认。

#### 步骤1：planning-north-star

- **Skill**: planning-north-star
- **输入**:
  - user_value_data: 用户价值数据（来自 user-research-user-modeling / user-research-voice-analysis）
  - bmc: BMC商业模式画布（来自 output/pm-strategy/business-model-canvas/bmc.json）
  - business_status: 业务现状数据（可选，用户提供）
- **输出**: `output/pm-strategy/planning-north-star/`（north_star.json）
- **验证**: 北极星指标人类已选择
- **执行模式**: 👤→🤖 人类执行，AI辅助
- **卡口**: 北极星指标人类已选择 → 未通过：必须人类决策，AI只提供分析支撑

#### 步骤2：planning-okr

- **Skill**: planning-okr
- **输入**:
  - swot_strategy: SWOT战略方向（来自阶段2 `output/pm-strategy/strategic-analysis/strategic-analysis.json` 中 swot.strategies）
  - north_star: 北极星指标（来自阶段3步骤1 `output/pm-strategy/planning-north-star/north_star.json`）
  - bmc: BMC商业模式画布（可选，来自 output/pm-strategy/business-model-canvas/bmc.json）
  - business_status: 业务现状数据（可选，用户提供）
- **输出**: `output/pm-strategy/planning-okr/`（okr.json）
- **验证**: OKR人类已确认
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: OKR人类已确认 → 未通过：达成概率<0.3升级调整，>0.9升级增加挑战

### 阶段4：planning-roadmap

- **Skill**: planning-roadmap
- **输入**:
  - okr: OKR目标与关键结果（来自阶段3 `output/pm-strategy/planning-okr/okr.json`）
  - swot_strategy: SWOT战略方向（来自阶段2 `output/pm-strategy/strategic-analysis/strategic-analysis.json` 中 swot.strategies）
  - priority_score: 需求优先级评分（可选，由 design-prd 覆盖）
  - resource_constraints: 资源约束条件（可选，用户提供）
- **输出**: `output/pm-strategy/planning-roadmap/`（roadmap.json）
- **验证**: 路线图资源人类已审批
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: 路线图资源人类已审批 → 未通过：优先级和资源分配必须人类决策

### 阶段总结（post_pipeline）

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 阶段总结协议。

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-strategy/ |
| 总结输出路径 | output/phase-reports/pm-strategy/planning-orchestrator.md |

下游衔接:
  primary: design-orchestrator（战略规划完成，将战略转化为PRD和设计方案）
  alternatives:
    - target: metrics-orchestrator
      reason: 需先设计度量体系再进入设计
      condition: OKR中关键结果缺乏可量化指标支撑时
    - target: project-planning-orchestrator
      reason: 路线图已就绪，直接启动项目规划
      condition: 战略规划已充分，需快速进入项目执行时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 产品提案已审批 | 提案书人类已签批 | 补充数据后重新提交 |
| 战略分析完成 | strategic-analysis.json已生成且非空 | 置信度<0.6的项目升级人类校准，战略方向需人类选择 |
| 目标设定完成 | 北极星指标人类已选择，OKR人类已确认 | 北极星必须人类决策；OKR达成概率<0.3升级调整 |
| 路线图完成 | 路线图资源人类已审批 | 优先级和资源分配必须人类决策 |
| 阶段总结已生成 | output/phase-reports/pm-strategy/planning-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1某子Skill失败 | 暂停编排，输出失败诊断信息，请求人类介入修复后重试该阶段 |
| strategic-analysis框架选择异常 | 默认选择SWOT框架执行，标注"框架选择降级为SWOT" |
| strategic-analysis某框架分析失败 | 跳过失败框架，基于已完成的框架生成战略结论，标注"XX框架分析缺失" |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板（仅含元信息和空结构），整体置信度设为0.3，强制人类确认是否继续。人类确认后基于用户提供信息和AI知识库推断生成，所有推断内容标注confidence≤0.5和needs_human_validation:true |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 产品立项审批 | 阶段1 product-proposal 生成产品提案书 | 人类决定是否立项 |
| 战略方向选择 | 阶段2 strategic-analysis 生成战略结论 | 人类选择最终战略方向和增长路径 |
| 目标设定确认 | 阶段3 planning-north-star生成北极星候选后人类选择，planning-okr生成OKR候选后人类确认 | 人类选择北极星指标并确认OKR |
| 路线图优先级 | 阶段4 planning-roadmap 计算RICE评分并排序 | 人类决定最终优先级和资源分配 |
