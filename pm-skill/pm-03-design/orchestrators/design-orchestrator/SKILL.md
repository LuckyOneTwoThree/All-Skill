---
name: design-orchestrator
description: 当需要生成PRD、需求规格、信息架构、用户流程、原型或交互规范时使用。产品设计指挥官，调度design-prd/requirements-srs/design-ia/design-userflow/design-prototype/interaction-spec/design-handoff-spec。关键词：产品设计、PRD、SRS、信息架构、原型、交互规范、设计交接。
metadata:
  module: "产品构思与设计"
  sub-module: "产品设计与原型"
  type: "orchestrator"
  version: "7.0"
---

# 产品设计与原型指挥官

## 核心原则

1. **设计是取舍不是堆砌**——核心路径必须极致流畅，非核心路径可以妥协
2. **上游质量决定下游效率**——PRD质量门禁不可绕过，垃圾进垃圾出
3. **设计一致性是系统属性**——从令牌到组件到交互规范必须一脉相承，断裂即债务

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill输出文件缺失 | 阻塞当前阶段，输出缺失项清单，提示人类补充上游输入 |
| 子Skill质量检查未通过 | 阻塞进入下一阶段，输出未通过项详情，提示人类确认是否修复或接受风险 |
| 上下文接近上限 | 优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论写入文件 |
| 人类决策超时未响应 | 暂停编排流程，保留当前状态，等待人类决策后继续 |
| 上游输入数据格式异常 | 尝试兼容解析，解析失败则降级为用户提供描述，标注"数据格式异常" |

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-design/design-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-design/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-design/design-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  stages:
    - id: design-prd
      name: 产品需求文档
      depends_on: []
    - id: requirements-srs
      name: 需求规格说明书
      depends_on: [design-prd]
    - id: design-ia
      name: 信息架构设计
      depends_on: [design-prd]
      parallel_with: [design-userflow]
    - id: design-userflow
      name: 用户流程设计
      depends_on: [design-prd]
      parallel_with: [design-ia]
    - id: design-prototype
      name: 原型设计
      depends_on: [design-ia, design-userflow]
    - id: interaction-spec
      name: 交互设计规范
      depends_on: [design-userflow, design-prototype]
      parallel_with: [design-handoff-spec]
    - id: design-handoff-spec
      name: 设计交接规范
      depends_on: [design-prototype, design-ia, design-userflow, design-prd]
      parallel_with: [interaction-spec]
```

## 阶段执行计划

#### 调用 design-prd

```
Skill: design-prd
输入:
  requirement_analysis: output/pm-design/requirements-understanding/requirement_analysis.json
  converged_solutions: output/pm-design/ideation-convergence/converged_solutions.json
  strategic_output: 用户提供
  requirement_context: 用户提供（product_name必填）
输出: output/pm-design/design-prd/
验证: PRD 4道质量门禁全部通过
模式: 🤖→👤
```

#### 调用 requirements-srs

```
Skill: requirements-srs
输入:
  prd: output/pm-design/design-prd/PRD-{产品名}.md
  api_contract: 可选
  data_model: 可选
  ia: 可选
  userflow: 可选
  tech_constraints: 可选
输出: output/pm-design/requirements-srs/
验证: 功能需求有唯一编号，非功能需求覆盖5维度
模式: 🤖→👤
```

#### 调用 design-ia

```
Skill: design-ia
输入:
  prd: output/pm-design/design-prd/PRD-{产品名}.md
  existing_ia: 可选
  user_research: 可选
输出: output/pm-design/design-ia/ia_proposals.json
验证: IA方案人类已确认
模式: 🤖→👤
```

#### 调用 design-userflow

```
Skill: design-userflow
输入:
  prd: output/pm-design/design-prd/PRD-{产品名}.md
  ia_proposals: output/pm-design/design-ia/ia_proposals.json
  user_research: 可选
输出: output/pm-design/design-userflow/userflow.json
验证: 用户流程死胡同=0
模式: 🤖→👤
```

#### 调用 design-prototype

```
Skill: design-prototype
输入:
  ia_proposals: output/pm-design/design-ia/ia_proposals.json
  userflow: output/pm-design/design-userflow/userflow.json
  design_system: 可选
  design_tokens: 可选
输出: output/pm-design/design-prototype/prototype_spec.json
验证: 原型设计规范一致性≥85%
模式: 🤖→👤
```

#### 调用 interaction-spec

```
Skill: interaction-spec
输入:
  userflow: output/pm-design/design-userflow/userflow.json
  prototype_spec: output/pm-design/design-prototype/prototype_spec.json
  handoff_doc: 可选
  brand_guidelines: 可选
输出: output/pm-design/interaction-spec/
验证: 交互状态机8种基础状态全覆盖
模式: 🤖→👤
```

#### 调用 design-handoff-spec

```
Skill: design-handoff-spec
输入:
  prototype_spec: output/pm-design/design-prototype/prototype_spec.json
  design_tokens: 可选
  ia_proposals: output/pm-design/design-ia/ia_proposals.json
  userflow: output/pm-design/design-userflow/userflow.json
  prd: output/pm-design/design-prd/PRD-{产品名}.md
  component_library: 可选
输出: output/pm-design/design-handoff-spec/
验证: 交接文档待确认项=0
模式: 🤖→👤
```

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

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| PRD层级确认 | AI自动分级置信度<0.7 | 确认PRD层级（L/S/X） |
| SRS需求确认 | SRS生成完成 | 确认非功能需求指标和约束条件 |
| IA方案选择 | IA生成2-3个候选方案 | 选择最终IA方案 |
| 设计规范violation确认 | 设计规范一致性<85% | 判断是否接受violation |
| 交互规范确认 | 交互设计规范生成完成 | 确认状态机、动画和手势规范 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 requirements-srs（需求规格说明书）、design-handoff-spec（设计交接文档）
- v4.0: 新增 interaction-spec（交互设计规范）
- v5.0: 编排器优化——新增子Skill执行协议、任务调度改为阶段执行计划、调度规则改为执行模式、阶段卡口和人类决策点改为表格、增加子Skill输入输出路径
- v7.0: 编排协议重构——子Skill执行协议改为编排协议、新增Pipeline定义、阶段执行计划改为调用指令格式、删除调度规则
