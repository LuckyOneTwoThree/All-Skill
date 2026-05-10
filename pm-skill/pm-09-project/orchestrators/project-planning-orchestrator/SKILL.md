---
name: project-planning-orchestrator
description: 当需要启动新项目或进行项目规划时使用。项目规划指挥官，包括项目宪章生成、资源需求与分配计划、Kickoff会议准备与行动项提取。关键词：项目规划、项目宪章、资源规划、Kickoff、项目启动。
metadata:
  module: "项目管理与执行"
  sub-module: "项目规划"
  type: "orchestrator"
  version: "2.0"
---

# 项目规划指挥官

## 核心原则

**好的开始是成功的一半，混乱的开始无法补救**

项目规划阶段投入的每一分钟，都在为后续执行节省数小时。规划不是拖延，而是确保团队在正确的方向上全力奔跑。混乱的开始只会导致返工、冲突和士气消耗。

## 执行步骤

1. **透明度即协作**：项目宪章、资源计划、Kickoff输出全员可见，信息不对称是协作最大的敌人
2. **风险前置**：在规划阶段识别和评估风险，而非在执行阶段被动应对。风险登记册在项目启动时即建立
3. **自动化追踪**：规划进度、资源状态、里程碑达成自动追踪，减少人工汇报的延迟和偏差

## 任务调度

```
planning-project-charter → planning-resource → planning-kickoff
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 项目启动信号 | → planning-project-charter（项目宪章生成） |
| 宪章生成完成 | → planning-resource（资源需求规划） |
| 资源规划完成 | → planning-kickoff（Kickoff会议自动化） |

### 数据流转

```
[产品背景 + 战略目标 + 资源约束]
       ↓
planning-project-charter
       ↓ project_charter (scope / objectives / success_criteria / risks)
planning-resource
       ↓ resource_plan (team / budget / timeline / dependencies)
planning-kickoff
       ↓ kickoff (meeting_prep / agenda / action_items / communication_plan)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-project/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| 宪章已批准 | 项目宪章经人类审批，目标和范围已确认 | 修改宪章后重新审批 |
| 资源已锁定 | 资源需求与可用资源匹配，关键资源已预留 | 升级人类决策，调整范围或资源 |
| Kickoff已完成 | Kickoff会议已召开，行动项已提取 | 重新调度会议时间 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 宪章审批 | 项目宪章生成完成 | 审批项目目标、范围和成功标准 |
| 范围变更 | 执行过程中出现范围变更请求 | 评估变更影响，决定是否接受变更 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
