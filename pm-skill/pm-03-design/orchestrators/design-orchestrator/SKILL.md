---
name: design-orchestrator
description: 当需要生成PRD、信息架构、用户流程、原型或交互规范时使用。产品设计指挥官，调度design-prd/design-ia/design-userflow/design-prototype/interaction-spec/design-handoff-spec/change-impact-analysis。需求管理功能（需求收集、理解、优先级排序、需求规格）已由 design-prd 覆盖。PRD变更时触发 change-impact-analysis 评估下游影响。关键词：产品设计、PRD、信息架构、原型、交互规范、设计交接、写PRD、产品文档、设计输出、变更影响分析。
metadata:
  module: "产品构思与设计"
  sub-module: "产品设计与原型"
  type: "orchestrator"
  version: "10.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我写PRD"
    - "生成产品需求文档"
    - "设计一下信息架构"
    - "画一下用户流程"
    - "输出交互设计规范"
    - "PRD变更了，分析一下影响"
---

# 产品设计与原型指挥官

## 核心原则

1. **设计是取舍不是堆砌**——核心路径必须极致流畅，非核心路径可以妥协
2. **上游质量决定下游效率**——PRD质量门禁不可绕过，垃圾进垃圾出
3. **设计一致性是系统属性**——从令牌到组件到交互规范必须一脉相承，断裂即债务
4. **双向反馈闭环**——PM→UI 是正向约束，UI→PM 是反向反馈，两者共同保证设计质量

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill输出文件缺失 | 阻塞当前阶段，输出缺失项清单，提示人类补充上游输入 |
| 子Skill质量检查未通过 | 阻塞进入下一阶段，输出未通过项详情，提示人类确认是否修复或接受风险 |
| 上下文接近上限 | 优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论写入文件 |
| 人类决策超时未响应 | 暂停编排流程，保留当前状态，等待人类决策后继续 |
| 上游输入数据格式异常 | 尝试兼容解析，解析失败则降级为用户提供描述，标注"数据格式异常" |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 编排协议

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 编排协议。

## Pipeline

```yaml
pipeline: design-orchestrator
version: 10.1

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-design/design-orchestrator.md

stages:
  - id: phase-0
    name: "UI反馈处理"
    depends_on: []
    skills: []
    trigger: output/pm-design/design-feedback/design_feedback.json 存在时
    gate:
      condition: "反馈建议已评估，接受/拒绝已决定"
      fail_action: "标注未处理反馈，不阻塞主流程"

  - id: phase-1
    name: "产品需求文档"
    depends_on: [phase-0]
    skills: [design-prd]
    gate:
      condition: "PRD 4道质量门禁全部通过"
      fail_action: "门禁1或2失败阻塞流程，输出缺失项清单"

  - id: phase-2
    name: "信息架构设计"
    depends_on: [phase-1]
    parallel_with: [phase-3]
    skills: [design-ia]
    gate:
      condition: "IA方案人类已确认"
      fail_action: "生成2-3个候选方案供人类选择"

  - id: phase-3
    name: "用户流程设计"
    depends_on: [phase-1]
    parallel_with: [phase-2]
    skills: [design-userflow]
    gate:
      condition: "用户流程死胡同=0"
      fail_action: "死胡同必须修复后才能进入原型阶段"

  - id: phase-4
    name: "原型设计"
    depends_on: [phase-2, phase-3]
    skills: [design-prototype]
    gate:
      condition: "原型设计规范一致性≥85%"
      fail_action: "一致性<85%需人类确认violations"

  - id: phase-5
    name: "交互设计规范"
    depends_on: [phase-3, phase-4]
    parallel_with: [phase-6]
    skills: [interaction-spec]
    gate:
      condition: "交互状态机8种基础状态全覆盖"
      fail_action: "补充缺失状态定义"

  - id: phase-6
    name: "设计交接规范"
    depends_on: [phase-4, phase-2, phase-3, phase-1]
    parallel_with: [phase-5]
    skills: [design-handoff-spec]
    gate:
      condition: "交接文档待确认项=0"
      fail_action: "待确认项需逐项确认或标注接受风险"

  - id: phase-7
    name: "变更影响分析"
    depends_on: [phase-1, phase-2, phase-3, phase-4]
    skills: [change-impact-analysis]
    trigger: PRD变更时触发
    gate:
      condition: "影响矩阵覆盖所有下游设计产出，重做清单可执行"
      fail_action: "补充缺失的下游影响项"
```

## 阶段执行计划

#### 处理 UI 反馈（phase-0，条件执行）

```
触发条件: output/pm-design/design-feedback/design_feedback.json 存在
动作: 评估UI→PM反馈建议
输入:
  design_feedback: output/pm-design/design-feedback/design_feedback.json
处理流程:
  1. 读取 design_feedback.json
  2. 按 target_artifact 分组 suggestions
  3. 对每个 suggestion 评估：
     - 接受：标记为 accepted，纳入后续阶段修改范围
     - 拒绝：标记为 rejected，记录拒绝理由
  4. ⏸ 人类确认反馈处理结果
  5. 对 accepted 的 suggestions：
     - 若 target_artifact 为 prd.json：在 phase-1 中纳入修改范围
     - 若 target_artifact 为 ia_proposals.json：在 phase-2 中纳入修改范围
     - 若 target_artifact 为 userflow.json：在 phase-3 中纳入修改范围
     - 若 target_artifact 为 component_catalog.json：在 phase-4 中纳入修改范围
     - 若 target_artifact 为 interaction-spec.json：在 phase-5 中纳入修改范围
  6. 处理完成后删除 design_feedback.json，避免重复消费
输出: 反馈处理结果（accepted/rejected 清单）
验证: 反馈建议已逐项评估，处理结果已人类确认
模式: 🤖→👤
```

#### 调用 design-prd

```
Skill: design-prd
输入:
  ideation_workshop: output/pm-design/ideation-workshop/ideation-workshop.json
  strategic_output: 用户提供
  requirement_context: 用户提供（product_name必填）
输出: output/pm-design/design-prd/
验证: PRD 4道质量门禁全部通过
模式: 🤖→👤
```

#### 调用 design-ia

```
Skill: design-ia
输入:
  prd: output/pm-design/design-prd/prd.md
  prd_json: output/pm-design/design-prd/prd.json
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
  prd: output/pm-design/design-prd/prd.md
  prd_json: output/pm-design/design-prd/prd.json
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
  prd_json: output/pm-design/design-prd/prd.json
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
  prd_json: output/pm-design/design-prd/prd.json
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
  prd: output/pm-design/design-prd/prd.md
  prd_json: output/pm-design/design-prd/prd.json
  component_library: 可选
输出: output/pm-design/design-handoff-spec/
验证: 交接文档待确认项=0
模式: 🤖→👤
```

#### 调用 change-impact-analysis

```
Skill: change-impact-analysis
输入:
  prd_change: 用户提供（PRD变更内容）
  current_prd: output/pm-design/design-prd/prd.json
  current_ia: output/pm-design/design-ia/ia_proposals.json
  current_userflow: output/pm-design/design-userflow/userflow.json
  current_prototype: output/pm-design/design-prototype/prototype_spec.json
  current_interaction_spec: output/pm-design/interaction-spec/interaction-spec.json（可选）
输出: output/pm-design/change-impact-analysis/
验证: 影响矩阵覆盖所有下游设计产出；重做清单可执行
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-design/design-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-design/ |
| 总结输出路径 | output/phase-reports/pm-design/design-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: metrics-orchestrator（产品设计完成，为PRD功能点设计指标体系和埋点方案）
  alternatives:
    - target: validation-orchestrator
      reason: PRD中存在高风险假设需验证
      condition: PRD中标记为高风险的功能点占比>30%时
    - target: api-design-orchestrator
      reason: PRD确认后并行启动后端API设计（跨模块：Backend）
      condition: 产品从0到1流程中，PRD确认后需并行启动Backend开发时
  special_cases:
    - target: design-handoff-spec
      reason: 仅需生成交接文档给开发团队
      condition: 设计方案已确认，仅需开发交接摘要时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| PRD生成完成 | design-prd输出文件已生成且非空 | 门禁1或2失败阻塞流程，输出缺失项清单 |
| IA设计完成 | IA方案人类已确认 | 生成2-3个候选方案供人类选择 |
| 用户流程完成 | design-userflow输出文件已生成且非空 | 死胡同必须修复后才能进入原型阶段 |
| 原型完成 | design-prototype输出文件已生成且非空 | 一致性<85%需人类确认violations |
| 交互规范完成 | interaction-spec输出文件已生成且非空 | 补充缺失状态定义 |
| 设计交接完成 | design-handoff-spec输出文件已生成且非空 | 待确认项需逐项确认或标注接受风险 |
| 变更影响分析完成 | change-impact-analysis输出文件已生成且非空 | 补充缺失的下游影响项 |
| 阶段总结已生成 | output/phase-reports/pm-design/design-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| UI反馈处理确认 | phase-0，design_feedback.json存在时 | 确认接受/拒绝UI侧的反馈建议 |
| PRD层级确认 | AI自动分级置信度<0.7 | 确认PRD层级（L/S/X） |
| IA方案选择 | IA生成2-3个候选方案 | 选择最终IA方案 |
| 设计规范violation确认 | 设计规范一致性<85% | 判断是否接受violation |
| 交互规范确认 | 交互设计规范生成完成 | 确认状态机、动画和手势规范 |
