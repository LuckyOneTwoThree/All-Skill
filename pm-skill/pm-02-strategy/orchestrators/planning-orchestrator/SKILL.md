---
name: planning-orchestrator
description: 当需要进行产品立项、战略规划或路线图制定时使用。战略规划指挥官，调度产品提案、SWOT、五力模型、OKR、北极星、路线图、安索夫等子Skill。关键词：产品立项、战略规划、SWOT、OKR、路线图、战略分析。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "orchestrator"
  version: "6.0"
---

# 战略规划与路线图指挥官

## 核心原则

确保做正确的事，而非正确地做事。

1. **战略对齐层层传递**——从愿景到OKR到路线图，确保每一层目标可追溯到上一层战略意图
2. **资源约束前置**——在规划阶段即引入资源边界条件，避免产出无法落地的理想化路线图
3. **决策点不后延**——每个阶段的战略选择必须在当前阶段完成，禁止以"待定"状态传递到下游

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-strategy/planning-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-strategy/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-strategy/planning-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline 定义

```yaml
pipeline: planning-orchestrator
version: 6.0

stages:
  - id: phase-0
    name: "产品提案"
    skills: [product-proposal]
    gate:
      condition: "提案书人类已签批"
      fail_action: "补充数据后重新提交"

  - id: phase-1
    name: "战略分析"
    parallel: true
    depends_on: [phase-0]
    skills:
      - planning-swot
      - planning-porter-five-forces
    gate:
      condition: "SWOT战略方向人类已选择 + 波特五力评分完成"
      fail_action: "置信度<0.6的项目升级人类校准"

  - id: phase-2
    name: "目标设定"
    parallel: true
    depends_on: [phase-1]
    skills:
      - planning-okr
      - planning-north-star
    gate:
      condition: "OKR人类已确认 + 北极星指标人类已选择"
      fail_action: "达成概率<0.3升级调整"

  - id: phase-3
    name: "路线图与增长"
    parallel: true
    depends_on: [phase-2]
    skills:
      - planning-roadmap
      - planning-ansoff
    gate:
      condition: "路线图资源人类已审批 + Ansoff增长路径已选择"
      fail_action: "优先级和资源分配必须人类决策"
```

## 阶段执行计划

### 阶段0：product-proposal

- **Skill**: product-proposal
- **输入**:
  - competitor_report: 竞品分析报告（来自 market-competitor-report → competitor-report.md）
  - tam_som: 市场规模数据（来自 market-tam-som → tam-som.json）
  - user_research_report: 用户研究报告（来自 user-research-report → user-research-report.md）
  - opportunity_brief: 机会简报（来自 opportunity-brief → opportunity_brief.json）
  - positioning_statement: 定位陈述（来自 output/pm-strategy/positioning-statement/positioning-statements.json）
  - product_name_category: 产品名称与品类（用户提供）
  - business_goal: 商业目标（用户提供）
  - resource_constraints: 资源约束（可选，用户提供）
- **输出**: `output/pm-strategy/product-proposal/`（product-proposal.md + product-proposal.json）
- **验证**: 提案书人类已签批
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: 提案书人类已签批 → 未通过：补充数据后重新提交

### 阶段1：planning-swot

- **Skill**: planning-swot
- **输入**:
  - exploration_output: 探索阶段输出（来自 user-research-user-modeling / opportunity-brief）
  - competitor_intel: 竞品分析数据（来自 market-competitor-intel → competitor-intel.json）
  - bmc: BMC商业模式画布（来自 output/pm-strategy/business-model-canvas/bmc.json）
  - internal_capability: 内部能力评估（可选，用户提供）
- **输出**: `output/pm-strategy/planning-swot/`（swot.json）
- **验证**: SWOT战略方向人类已选择
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: SWOT战略方向人类已选择 → 未通过：置信度<0.6的项目升级人类校准

### 阶段2：planning-porter-five-forces

- **Skill**: planning-porter-five-forces
- **输入**:
  - competitor_intel: 竞品分析数据（来自 market-competitor-intel → competitor-intel.json）
  - market_data: 市场数据（来自 market-tam-som → tam-som.json）
  - industry_info: 行业信息（可选，来自 market-pest → pest.json）
- **输出**: `output/pm-strategy/planning-porter-five-forces/`（porter_five_forces.json）
- **验证**: 波特五力评分完成
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: 波特五力评分完成 → 未通过：各力量评分需人类校准确认

### 阶段3：planning-okr

- **Skill**: planning-okr
- **输入**:
  - swot_strategy: SWOT战略方向（来自阶段1 `output/pm-strategy/planning-swot/swot.json`）
  - north_star: 北极星指标（来自阶段4 `output/pm-strategy/planning-north-star/north_star.json`，若已执行）
  - bmc: BMC商业模式画布（可选，来自 output/pm-strategy/business-model-canvas/bmc.json）
  - business_status: 业务现状数据（可选，用户提供）
- **输出**: `output/pm-strategy/planning-okr/`（okr.json）
- **验证**: OKR人类已确认
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: OKR人类已确认 → 未通过：达成概率<0.3升级调整，>0.9升级增加挑战

### 阶段4：planning-north-star

- **Skill**: planning-north-star
- **输入**:
  - user_value_data: 用户价值数据（来自 user-research-user-modeling / user-research-voice-analysis）
  - bmc: BMC商业模式画布（来自 output/pm-strategy/business-model-canvas/bmc.json）
  - business_status: 业务现状数据（可选，用户提供）
- **输出**: `output/pm-strategy/planning-north-star/`（north_star.json）
- **验证**: 北极星指标人类已选择
- **执行模式**: 👤→🤖 人类执行，AI辅助
- **卡口**: 北极星指标人类已选择 → 未通过：必须人类决策，AI只提供分析支撑

### 阶段5：planning-roadmap

- **Skill**: planning-roadmap
- **输入**:
  - okr: OKR目标与关键结果（来自阶段3 `output/pm-strategy/planning-okr/okr.json`）
  - swot_strategy: SWOT战略方向（来自阶段1 `output/pm-strategy/planning-swot/swot.json`）
  - priority_score: 需求优先级评分（可选，来自 requirements-prioritization）
  - resource_constraints: 资源约束条件（可选，用户提供）
- **输出**: `output/pm-strategy/planning-roadmap/`（roadmap.json）
- **验证**: 路线图资源人类已审批
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: 路线图资源人类已审批 → 未通过：优先级和资源分配必须人类决策

### 阶段6：planning-ansoff

- **Skill**: planning-ansoff
- **输入**:
  - product_definition: 当前产品定义（用户提供）
  - market_definition: 当前市场定义（用户提供）
  - growth_goal: 增长目标（可选，来自阶段3 `output/pm-strategy/planning-okr/okr.json`）
  - swot_result: SWOT分析结果（可选，来自阶段1 `output/pm-strategy/planning-swot/swot.json`）
- **输出**: `output/pm-strategy/planning-ansoff/`（ansoff.json）
- **验证**: Ansoff增长路径已选择
- **执行模式**: 🤖→👤 AI建议，人类审批
- **卡口**: Ansoff增长路径已选择 → 未通过：增长路径必须人类最终决策

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 产品提案已审批 | 提案书人类已签批 | 补充数据后重新提交 |
| SWOT完成 | SWOT战略方向人类已选择 | 置信度<0.6的项目升级人类校准 |
| 行业分析完成 | 波特五力评分完成 | 各力量评分需人类校准确认 |
| OKR完成 | OKR人类已确认 | 达成概率<0.3升级调整，>0.9升级增加挑战 |
| 北极星确认 | 北极星指标人类已选择 | 必须人类决策，AI只提供分析支撑 |
| 路线图完成 | 路线图资源人类已审批 | 优先级和资源分配必须人类决策 |
| 增长路径确认 | Ansoff增长路径已选择 | 增长路径必须人类最终决策 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1某子Skill失败 | 暂停编排，输出失败诊断信息，请求人类介入修复后重试该阶段 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 所有上游数据全部缺失 | 终止编排，输出数据依赖图和缺失清单，要求人类提供最小必要输入后重新启动 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 产品立项审批 | 阶段0 product-proposal 生成产品提案书 | 人类决定是否立项 |
| 战略方向选择 | 阶段1 planning-swot 生成SO/ST/WO/WT四种战略方向 | 人类选择最终战略方向 |
| OKR确认 | 阶段3 planning-okr 生成OKR候选 | 人类确认最终OKR |
| 路线图优先级 | 阶段5 planning-roadmap 计算RICE评分并排序 | 人类决定最终优先级和资源分配 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 product-proposal（产品提案），新增 Stage 0 产品立项审批决策点
- v4.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范
- v5.0: 核心原则替换为编排理念原则，新增异常处理表
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图，阶段1-2/2-3/3-4并行）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
