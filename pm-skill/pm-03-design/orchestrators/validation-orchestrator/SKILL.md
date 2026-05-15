---
name: validation-orchestrator
description: 当需要验证产品方案时使用。方案验证子模块指挥官，调度子Skill：validation-assumption-map、validation-mvp、validation-experiment、validation-usability。关键词：方案验证、假设验证、MVP、可用性测试、实验设计、假设地图、风险评估、验证想法、最小可行产品。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "orchestrator"
  version: "6.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "验证一下产品方案"
    - "设计MVP范围"
    - "做一下假设验证"
    - "评估一下方案风险"
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
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: validation-orchestrator
version: 6.1

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-design/validation-orchestrator.md

stages:
  - id: phase-1
    name: "假设地图"
    depends_on: []
    skills: [validation-assumption-map]
    gate:
      condition: "最大风险假设已识别，每个功能点至少1个假设"
      fail_action: "每个功能点至少1个假设，最大风险假设必须有验证计划"

  - id: phase-2
    name: "MVP范围界定"
    depends_on: [phase-1]
    skills: [validation-mvp]
    gate:
      condition: "MVP占比<60%，Must Have功能都有假设关联"
      fail_action: "MVP占比>60%升级人类判断，确认是否调整"

  - id: phase-3
    name: "实验设计"
    depends_on: [phase-1, phase-2]
    parallel_with: [phase-4]
    skills: [validation-experiment]
    gate:
      condition: "实验方案人类已审核，含验证方法、样本量、时长、终止条件"
      fail_action: "所有实验方案必须人类审核"

  - id: phase-4
    name: "可用性测试"
    depends_on: [phase-1, phase-2]
    parallel_with: [phase-3]
    skills: [validation-usability]
    gate:
      condition: "问题严重程度分级合理（P0/P1/P2/P3），洞察与假设地图有对应关系"
      fail_action: "测试执行必须由人类研究员主持"
```

## 阶段执行计划

#### 调用 validation-assumption-map

```
Skill: validation-assumption-map
输入:
  design_output: output/pm-design/design-prototype/prototype_spec.json（或output/pm-design/design-userflow/userflow.json）
  prd: output/pm-design/design-prd/prd.md
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

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-design/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-design/validation-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: design-orchestrator
    reason: 方案验证完成，建议进入产品设计阶段，基于验证结论调整设计方案
    input_mapping:
      validation_output: "output/pm-design/validation-assumption-map/ + validation-mvp/ → design-prd输入"
  alternatives:
    - target: experiment-orchestrator
      reason: 如验证结论需要A/B测试进一步确认
      condition: 验证结果不确定，需要量化实验验证时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 假设地图完成 | validation-assumption-map输出文件已生成且非空 | 每个功能点至少1个假设，最大风险假设必须有验证计划 |
| MVP范围完成 | validation-mvp-scope输出文件已生成且非空 | MVP占比>60%升级人类判断，确认是否调整 |
| 实验设计完成 | 实验方案人类已审核 | 所有实验方案必须人类审核 |
| 可用性测试完成 | validation-usability-test输出文件已生成且非空 | 测试执行必须由人类研究员主持 |
| 阶段总结已生成 | output/phase-reports/pm-design/validation-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

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
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
