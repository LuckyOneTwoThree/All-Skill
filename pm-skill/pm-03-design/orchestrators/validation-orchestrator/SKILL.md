---
name: validation-orchestrator
description: 当需要验证产品方案时使用。方案验证子模块指挥官，调度子Skill：validation-assumption-map、validation-mvp、validation-experiment、validation-usability。关键词：方案验证、假设验证、MVP、可用性测试、实验设计、假设地图、风险评估。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "orchestrator"
  version: "5.0"
---

# 方案验证指挥官

## 核心原则

1. **验证的是假设不是方案**——用最小成本获取最大置信度，MVP的目标是学习而非交付
2. **假设驱动验证顺序**——最大风险假设优先验证，验证结果决定方案走向
3. **验证闭环必须完整**——假设→实验→数据→结论→决策，任何环节断裂都是浪费

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill输出文件缺失 | 阻塞当前阶段，提示人类补充上游输入或提供替代数据 |
| 假设地图功能点覆盖不全 | 标注缺失功能点，建议人类确认是否补充假设 |
| MVP占比超过60% | 升级人类判断，输出裁剪建议，确认是否调整MVP范围 |
| 实验方案无法满足统计显著性 | 降低置信水平或增加样本量，标注"统计功效不足" |
| 可用性测试参与者不足5人 | 结果仅供参考，标注"样本量不足"，建议补充测试 |
| 人类决策超时未响应 | 暂停编排流程，保留当前状态，等待人类决策后继续 |
| 上下文接近上限 | 优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论写入文件 |

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-design/validation-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-design/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-design/validation-orchestrator.md`，包含以下结构：

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
    - id: validation-assumption-map
      name: 假设地图
      depends_on: []
    - id: validation-mvp
      name: MVP范围界定
      depends_on: [validation-assumption-map]
    - id: validation-experiment
      name: 实验设计
      depends_on: [validation-assumption-map, validation-mvp]
      parallel_with: [validation-usability]
    - id: validation-usability
      name: 可用性测试
      depends_on: [validation-assumption-map, validation-mvp]
      parallel_with: [validation-experiment]
```

## 阶段执行计划

#### 调用 validation-assumption-map

```
Skill: validation-assumption-map
输入:
  design_output: output/pm-design/design-prototype/prototype_spec.json（或output/pm-design/design-userflow/userflow.json）
  prd: output/pm-design/design-prd/PRD-{产品名}.md
输出: output/pm-design/validation-assumption-map/assumption_map.json
验证: 最大风险假设已识别，每个功能点至少1个假设
模式: 🤖
```

#### 调用 validation-mvp

```
Skill: validation-mvp
输入:
  design_output: output/pm-design/design-prototype/prototype_spec.json（或output/pm-design/design-userflow/userflow.json）
  assumption_map: output/pm-design/validation-assumption-map/assumption_map.json
  resource_constraints: 可选
输出: output/pm-design/validation-mvp/mvp_scope.json
验证: MVP占比<60%，Must Have功能都有假设关联
模式: 🤖→👤
```

#### 调用 validation-experiment

```
Skill: validation-experiment
输入:
  assumption_map: output/pm-design/validation-assumption-map/assumption_map.json
  mvp_scope: output/pm-design/validation-mvp/mvp_scope.json
  traffic_data: 可选（可用流量/用户数据）
输出: output/pm-design/validation-experiment/experiment_design.json
验证: 实验方案人类已审核，含验证方法、样本量、时长、终止条件
模式: 🤖→👤
```

#### 调用 validation-usability

```
Skill: validation-usability
输入:
  test_plan: output/pm-design/validation-assumption-map/assumption_map.json
  participants: 用户提供
  test_scenarios: output/pm-design/design-prototype/prototype_spec.json
输出: output/pm-design/validation-usability/usability_report.json
验证: 问题严重程度分级合理（P0/P1/P2/P3），洞察与假设地图有对应关系
模式: 👤→🤖
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 假设地图完成 | 最大风险假设已识别 | 每个功能点至少1个假设，最大风险假设必须有验证计划 |
| MVP范围完成 | MVP占比<60% | MVP占比>60%升级人类判断，确认是否调整 |
| 实验设计完成 | 实验方案人类已审核 | 所有实验方案必须人类审核 |
| 可用性测试完成 | 问题严重程度分级合理 | 测试执行必须由人类研究员主持 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| MVP范围确认 | MVP范围界定完成，MVP占比>60%或Must Have有争议 | 人类审批并决定最终MVP范围 |
| 实验方案审核 | 实验方案设计完成 | 人类审核并批准实验方案 |
| 验证结论决策 | 可用性测试完成，验证数据已整理 | 人类做最终产品方案决策 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——新增子Skill执行协议、任务调度改为阶段执行计划、调度规则改为执行模式、阶段卡口和人类决策点改为表格、增加子Skill输入输出路径
- v5.0: 编排协议重构——子Skill执行协议改为编排协议、新增Pipeline定义、阶段执行计划改为调用指令格式、删除调度规则
