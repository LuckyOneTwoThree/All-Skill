---
name: project-planning-orchestrator
description: 当需要启动新项目或进行项目规划时使用。项目规划指挥官，调度 planning-project-charter、planning-resource、planning-kickoff 子Skill执行。关键词：项目规划、项目宪章、资源规划、Kickoff、项目启动、项目章程、资源分配。
metadata:
  module: "项目管理与执行"
  sub-module: "项目规划"
  type: "orchestrator"
  version: "5.0"
---

# 项目规划指挥官

## 核心原则

**好的开始是成功的一半，混乱的开始无法补救**

项目规划阶段投入的每一分钟，都在为后续执行节省数小时。规划不是拖延，而是确保团队在正确的方向上全力奔跑。混乱的开始只会导致返工、冲突和士气消耗。

1. **宪章先行锁定**——项目宪章是所有后续规划的锚点，编排器应确保宪章在资源规划和Kickoff之前获得人类审批，避免在未确认目标的情况下分配资源。
2. **资源与范围对齐**——资源规划不是独立活动，必须与项目宪章中的范围和目标对齐。编排器应检测范围与资源的匹配度，不匹配时主动升级。
3. **启动即对齐**——Kickoff不是形式主义，而是确保所有利益相关方对目标、范围、角色达成一致的最后校准点。编排器应确保Kickoff覆盖所有关键对齐项。

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-project/project-planning-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-project/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-project/project-planning-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: planning-project-charter
    gate: 宪章已批准
  - stage: planning-resource
    depends_on: [planning-project-charter]
    gate: 资源已锁定
  - stage: planning-kickoff
    depends_on: [planning-project-charter, planning-resource]
    gate: Kickoff已完成
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

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 宪章已批准 | 项目宪章经人类审批，目标和范围已确认 | 修改宪章后重新审批 |
| 资源已锁定 | 资源需求与可用资源匹配，关键资源已预留 | 升级人类决策，调整范围或资源 |
| Kickoff已完成 | Kickoff会议已召开，行动项已提取 | 重新调度会议时间 |

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
| 所有上游数据全部缺失 | 输出最小化项目宪章模板，标注全部为待填充，要求用户提供基础信息后重新执行 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 改造为子Skill执行协议+阶段执行计划模式，增加命令式调度规则
- v4.0: 核心原则替换为编排理念原则，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
