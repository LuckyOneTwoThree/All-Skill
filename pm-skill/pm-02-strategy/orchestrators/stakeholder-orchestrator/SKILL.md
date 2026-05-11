---
name: stakeholder-orchestrator
description: 当需要进行Stakeholder管理或战略文档编写时使用。Stakeholder对齐指挥官，调度stakeholder-map/strategy-doc/brief。关键词：Stakeholder对齐、战略文档、战略沟通。
metadata:
  module: "产品商业与战略"
  sub-module: "Stakeholder对齐"
  type: "orchestrator"
  version: "4.0"
---

# Stakeholder对齐指挥官

## 核心原则

对齐不是说服，是共创。

1. **权力-利益双维校准**——Stakeholder分析必须同时覆盖权力影响力和利益相关度，缺一不可
2. **沟通策略因人定制**——不同Stakeholder的沟通策略、信息粒度和表达方式必须差异化，禁止一刀切
3. **对齐结果可追溯**——每次对齐沟通的结论、承诺和异议必须记录归档，确保后续可追溯

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：stakeholder-map

| 项目 | 内容 |
|------|------|
| 子Skill名称 | stakeholder-map |
| 读取定义路径 | `.trae/skills/stakeholder-map/SKILL.md` |
| 输入 | 组织架构信息（来自 planning-okr / planning-roadmap）；项目涉及范围（来自 planning-okr / planning-roadmap） |
| 输出 | `output/pm-strategy/stakeholder-map/`（stakeholder-map.json） |
| 验证 | Stakeholder地图人类已校准 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | Stakeholder地图人类已校准 → 未通过：影响力评估需人类校准，遗漏的相关方需人工补充 |

### 阶段2：stakeholder-strategy-doc

| 项目 | 内容 |
|------|------|
| 子Skill名称 | stakeholder-strategy-doc |
| 读取定义路径 | `.trae/skills/stakeholder-strategy-doc/SKILL.md` |
| 输入 | BMC（来自 output/pm-strategy/business-model-canvas/bmc.json）；定位陈述（来自 output/pm-strategy/positioning-statement/positioning-statements.json）；SWOT（来自 output/pm-strategy/planning-swot/swot.json）；OKR（来自 output/pm-strategy/planning-okr/okr.json）；路线图（可选，来自 output/pm-strategy/planning-roadmap/roadmap.json）；Stakeholder地图（来自阶段1 `output/pm-strategy/stakeholder-map/stakeholder-map.json`） |
| 输出 | `output/pm-strategy/stakeholder-strategy-doc/strategy-doc.md` |
| 验证 | 战略文档质量检查通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 战略文档质量检查通过 → 未通过：质量检查不通过自动修改，修改后仍不达标需人类审核精炼 |

### 阶段3：stakeholder-brief

| 项目 | 内容 |
|------|------|
| 子Skill名称 | stakeholder-brief |
| 读取定义路径 | `.trae/skills/stakeholder-brief/SKILL.md` |
| 输入 | 产品战略文档（来自阶段2 `output/pm-strategy/stakeholder-strategy-doc/strategy-doc.md`） |
| 输出 | `output/pm-strategy/stakeholder-brief/`（stakeholder-brief.md） |
| 验证 | 简报可执行性检查通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 简报可执行性检查通过 → 未通过：语气和重点需根据受众调整 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/pm-strategy/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

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