---
name: stakeholder-orchestrator
description: 当需要进行Stakeholder管理或战略文档编写时使用。Stakeholder对齐指挥官，调度stakeholder-map/strategy-doc/brief。关键词：Stakeholder对齐、战略文档、战略沟通。
metadata:
  module: "产品商业与战略"
  sub-module: "Stakeholder对齐"
  type: "orchestrator"
  version: "5.0"
---

# Stakeholder对齐指挥官

## 核心原则

对齐不是说服，是共创。

1. **权力-利益双维校准**——Stakeholder分析必须同时覆盖权力影响力和利益相关度，缺一不可
2. **沟通策略因人定制**——不同Stakeholder的沟通策略、信息粒度和表达方式必须差异化，禁止一刀切
3. **对齐结果可追溯**——每次对齐沟通的结论、承诺和异议必须记录归档，确保后续可追溯

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-strategy/stakeholder-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-strategy/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-strategy/stakeholder-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline: stakeholder-orchestrator
version: 5.0

stages:
  - id: phase-1
    name: "Stakeholder地图"
    skills: [stakeholder-map]
    gate:
      condition: "Stakeholder地图人类已校准"
      fail_action: "影响力评估需人类校准，遗漏的相关方需人工补充"

  - id: phase-2
    name: "战略文档"
    depends_on: [phase-1]
    skills: [stakeholder-strategy-doc]
    gate:
      condition: "战略文档质量检查通过"
      fail_action: "质量检查不通过自动修改，修改后仍不达标需人类审核精炼"

  - id: phase-3
    name: "战略简报"
    depends_on: [phase-2]
    skills: [stakeholder-brief]
    gate:
      condition: "简报可执行性检查通过"
      fail_action: "语气和重点需根据受众调整"
```

## 阶段执行计划

### 阶段1：stakeholder-map

- **Skill**: stakeholder-map
- **输入**:
  - org_structure: 组织架构信息（来自 planning-okr / planning-roadmap）
  - project_scope: 项目涉及范围（来自 planning-okr / planning-roadmap）
- **输出**: `output/pm-strategy/stakeholder-map/stakeholder-map.json`
- **验证**: Stakeholder地图人类已校准
- **执行模式**: 🤖→👤 AI建议，人类审批
- **⏸ 阶段卡口**: Stakeholder地图人类已校准 → 未通过：影响力评估需人类校准，遗漏的相关方需人工补充

### 阶段2：stakeholder-strategy-doc

- **Skill**: stakeholder-strategy-doc
- **输入**:
  - bmc: BMC（来自 output/pm-strategy/business-model-canvas/bmc.json）
  - positioning: 定位陈述（来自 output/pm-strategy/positioning-statement/positioning-statements.json）
  - swot: SWOT（来自 output/pm-strategy/planning-swot/swot.json）
  - okr: OKR（来自 output/pm-strategy/planning-okr/okr.json）
  - roadmap: 路线图（可选，来自 output/pm-strategy/planning-roadmap/roadmap.json）
  - stakeholder_map: Stakeholder地图（来自阶段1 `output/pm-strategy/stakeholder-map/stakeholder-map.json`）
- **输出**: `output/pm-strategy/stakeholder-strategy-doc/strategy-doc.md`
- **验证**: 战略文档质量检查通过
- **执行模式**: 🤖→👤 AI建议，人类审批
- **⏸ 阶段卡口**: 战略文档质量检查通过 → 未通过：质量检查不通过自动修改，修改后仍不达标需人类审核精炼

### 阶段3：stakeholder-brief

- **Skill**: stakeholder-brief
- **输入**:
  - strategy_doc: 产品战略文档（来自阶段2 `output/pm-strategy/stakeholder-strategy-doc/strategy-doc.md`）
- **输出**: `output/pm-strategy/stakeholder-brief/stakeholder-brief.md`
- **验证**: 简报可执行性检查通过
- **执行模式**: 🤖→👤 AI建议，人类审批
- **⏸ 阶段卡口**: 简报可执行性检查通过 → 未通过：语气和重点需根据受众调整

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| Stakeholder地图完成 | Stakeholder地图人类已校准 | 影响力评估需人类校准，遗漏的相关方需人工补充 |
| 战略文档完成 | 战略文档质量检查通过 | 质量检查不通过自动修改，修改后仍不达标需人类审核精炼 |
| 战略简报完成 | 简报可执行性检查通过 | 语气和重点需根据受众调整 |

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
| 影响力评估校准 | 阶段1 stakeholder-map 评估影响力评分 | 人类校准涉及人际判断的最终结果 |
| 战略文档审核 | 阶段2 stakeholder-strategy-doc 组装战略文档 | 人类审核内容准确性和表达方式 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范
- v4.0: 核心原则替换为编排理念原则，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
