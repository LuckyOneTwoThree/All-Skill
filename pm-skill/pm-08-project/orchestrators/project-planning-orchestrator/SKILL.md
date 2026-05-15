---
name: project-planning-orchestrator
description: 当需要启动新项目或进行项目规划时使用。项目规划指挥官，调度 planning-project-charter、planning-resource、planning-kickoff 子Skill执行。关键词：项目规划、项目宪章、资源规划、Kickoff、项目启动、项目章程、资源分配、立项。
metadata:
  module: "项目管理与执行"
  sub-module: "项目规划"
  type: "orchestrator"
  version: "6.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "启动一个新项目"
    - "做一下项目规划"
    - "写项目宪章"
    - "规划一下资源分配"
---

# 项目规划指挥官

## 核心原则

**好的开始是成功的一半，混乱的开始无法补救**

项目规划阶段投入的每一分钟，都在为后续执行节省数小时。规划不是拖延，而是确保团队在正确的方向上全力奔跑。混乱的开始只会导致返工、冲突和士气消耗。

1. **宪章先行锁定**——项目宪章是所有后续规划的锚点，编排器应确保宪章在资源规划和Kickoff之前获得人类审批，避免在未确认目标的情况下分配资源。
2. **资源与范围对齐**——资源规划不是独立活动，必须与项目宪章中的范围和目标对齐。编排器应检测范围与资源的匹配度，不匹配时主动升级。
3. **启动即对齐**——Kickoff不是形式主义，而是确保所有利益相关方对目标、范围、角色达成一致的最后校准点。编排器应确保Kickoff覆盖所有关键对齐项。

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: project-planning-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-project/project-planning-orchestrator.md

stages:
  - id: phase-1
    name: "项目宪章"
    depends_on: []
    skills: [planning-project-charter]
    gate:
      condition: "宪章已批准"
      fail_action: "修改宪章后重新审批"

  - id: phase-2
    name: "资源锁定"
    depends_on: [phase-1]
    skills: [planning-resource]
    gate:
      condition: "资源已锁定"
      fail_action: "升级人类决策，调整范围或资源"

  - id: phase-3
    name: "Kickoff"
    depends_on: [phase-1, phase-2]
    skills: [planning-kickoff]
    gate:
      condition: "Kickoff已完成"
      fail_action: "重新调度会议时间"
```

## 阶段执行计划

#### 调用 planning-project-charter

```
Skill: planning-project-charter
输入:
  product_background: 用户提供
  strategic_goal: 用户提供
  resource_constraints: 用户提供（可选）
输出: output/pm-project/planning-project-charter/
验证: 项目目标符合SMART原则；利益相关方覆盖所有关键角色；成功标准可量化且可验证；初步风险清单包含影响和概率评估
模式: 🤖→👤
```

#### 调用 planning-resource

```
Skill: planning-resource
输入:
  project_scope: planning-project-charter → project_charter
  tech_plan: 用户提供
  team_capability: 用户提供（可选）
输出: output/pm-project/planning-resource/
验证: 资源估算基于WBS分解；关键资源缺口已识别并标注；时间表无资源冲突；估算置信度已标注
模式: 🤖
```

#### 调用 planning-kickoff

```
Skill: planning-kickoff
输入:
  project_charter: planning-project-charter → project_charter
  resource_plan: planning-resource → resource_plan
  meeting_participants: 用户提供
  preferred_time: 用户提供（可选）
输出: output/pm-project/planning-kickoff/
验证: 议程覆盖项目目标、范围、角色、时间线；关键利益相关方确认参会；行动项有明确负责人和截止日期
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-project/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-project/project-planning-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: agile-orchestrator
    reason: 项目规划完成，建议进入敏捷执行阶段，启动第一个Sprint
    input_mapping:
      planning_output: "output/pm-project/planning-project-charter/ + planning-resource/ → agile-sprint-planning输入"
  alternatives:
    - target: risk-orchestrator
      reason: 如项目规划识别到高风险
      condition: 项目宪章中风险评估等级为高时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 宪章已批准 | 项目宪章经人类审批 | 修改宪章后重新审批 |
| 资源已锁定 | resource-planning输出文件已生成且非空 | 升级人类决策，调整范围或资源 |
| Kickoff已完成 | kickoff输出文件已生成且非空 | 重新调度会议时间 |
| 阶段总结已生成 | output/phase-reports/pm-project/project-planning-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 宪章审批 | 项目宪章生成完成 | 审批项目目标、范围和成功标准 |
| 范围变更 | 执行过程中出现范围变更请求 | 评估变更影响，决定是否接受变更 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1子Skill（项目宪章）失败 | 暂停项目启动，输出失败原因，提示用户补充项目背景或战略目标后重试 |
| 上游数据缺失（如产品背景、战略目标） | 用占位数据生成草稿版宪章，标注低置信度，提示用户补充后重新生成 |
| 关键决策点未获人类确认（如宪章审批） | 暂停进入资源规划阶段，持续等待审批，超时后升级提醒 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板（仅含元信息和空结构），整体置信度设为0.3，强制人类确认是否继续。人类确认后基于用户提供信息和AI知识库推断生成，所有推断内容标注confidence≤0.5和needs_human_validation:true |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
- v4.0: 核心原则替换为编排理念原则，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
