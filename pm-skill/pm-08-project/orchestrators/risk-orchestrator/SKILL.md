---
name: risk-orchestrator
description: 当需要识别项目风险或处理风险升级时使用。风险管理指挥官，调度 risk-identification、risk-management 子Skill执行。关键词：风险管理、风险识别、风险监控、风险升级、风险登记册、风险预警、应急升级、项目风险。
metadata:
  module: "项目管理与执行"
  sub-module: "风险管理"
  type: "orchestrator"
  version: "7.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "识别一下项目风险"
    - "监控项目风险"
    - "处理风险升级"
    - "建立风险预警机制"
---

# 风险管理指挥官

## 核心原则

**风险不会自己消失，你不管理它它就管理你**

风险是项目中最确定的不确定性。忽视风险不会让风险消失，只会让风险在最不期望的时候以最不期望的方式爆发。主动管理风险是项目管理的底线能力。

1. **识别先于应对**——风险管理的编排重心在识别阶段，未识别的风险无法被管理。编排器应确保风险扫描覆盖技术、资源、进度、外部四个维度，不留盲区。
2. **监控持续闭环**——风险监控不是一次性活动，而是持续循环。编排器应确保风险状态在每个周期更新，预警触发条件始终有效。
3. **升级不可延迟**——当风险达到升级阈值时，延迟即失职。编排器应确保升级流程在SLA内自动触发，不依赖人工判断是否升级。

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: risk-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-project/risk-orchestrator.md

stages:
  - id: phase-1
    name: "风险识别"
    depends_on: []
    skills: [risk-identification]
    gate:
      condition: "风险登记册已建立"
      fail_action: "补充风险扫描或延长识别周期"

  - id: phase-2
    name: "风险监控与升级"
    depends_on: [phase-1]
    skills: [risk-management]
    gate:
      condition: "风险已监控与升级处理"
      fail_action: "补充监控指标或调整预警阈值，立即执行升级"
```

## 阶段执行计划

#### 调用 risk-identification

```
Skill: risk-identification
输入:
  project_data: agile-sprint-planning → sprint_plan.json
  external_data: 用户提供（可选）
  historical_risk_library: 用户提供（可选）
  current_risk_register: risk-identification → risk_register.json（可选）
输出: output/pm-project/risk-identification/
验证: 风险覆盖技术、资源、进度、外部4个维度；每个风险有影响和概率评估；风险优先级排序合理；高优先级风险有应对策略
模式: 🤖
```

#### 调用 risk-management

```
Skill: risk-management
输入:
  risk_register: risk-identification → risk_register.json
  project_data: 项目管理系统
  trigger_conditions: 用户提供
  mitigation_tracking: risk-management → 应对追踪（可选）
  issue_data: 用户提供
  escalation_rules: 用户提供
  organizational_structure: 用户提供
  pending_escalations: risk-management → 升级记录（可选）
输出: output/pm-project/risk-management/
验证: 风险状态更新及时；预警触发条件明确；风险趋势分析覆盖至少3个周期；高风险项有跟进记录；升级路径与风险等级匹配；升级通知在SLA内发送；升级超时有自动跟进机制
模式: 🤖
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-project/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-project/risk-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: agile-orchestrator
    reason: 风险管理完成，将风险应对纳入Sprint规划
    input_mapping:
      risk_output: "output/pm-project/risk-identification/ + risk-management/ → agile-sprint-planning输入"
  alternatives:
    - target: monitoring-orchestrator
      reason: 风险涉及线上监控
      condition: 风险类型为运维或安全风险时
    - target: project-planning-orchestrator
      reason: 风险影响项目范围或资源
      condition: 风险等级变更导致项目宪章需调整时
  special_cases: []
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 风险登记册已建立 | risk-register输出文件已生成且非空 | 补充风险扫描或延长识别周期 |
| 风险已监控与升级处理 | risk-monitoring输出文件已生成且非空 | 补充监控指标或调整预警阈值，立即执行升级 |
| 阶段总结已生成 | output/phase-reports/pm-project/risk-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 风险应对策略确认 | 新风险识别或风险状态变化 | 确认应对策略（规避/转移/减轻/接受） |
| 升级决策 | 风险升级触发 | 确认升级路径和资源调配 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1子Skill（风险识别）失败 | 暂停风险流程，输出失败原因，提示用户补充项目数据后重试 |
| 上游数据缺失（如项目数据、历史风险库） | 基于有限数据执行风险扫描，标注识别覆盖度不足，提示用户补充后重新扫描 |
| 关键决策点未获人类确认（如风险应对策略） | 暂停升级流程，采用默认保守策略（规避/减轻），标注待确认，持续等待人类决策 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板（仅含元信息和空结构），整体置信度设为0.3，强制人类确认是否继续。人类确认后基于用户提供信息和AI知识库推断生成，所有推断内容标注confidence≤0.5和needs_human_validation:true |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
- v4.0: 核心原则替换为编排理念原则，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v7.0: 合并 risk-monitoring + risk-escalation → risk-management；Pipeline从3阶段简化为2阶段；更新阶段卡口和验证条件；更新所有输出路径引用
