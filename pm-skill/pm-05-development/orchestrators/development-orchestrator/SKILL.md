---
name: development-orchestrator
description: 开发协作指挥官。当需要将PRD转化为开发任务、进行代码审查或保持PRD与开发同步时使用，包括任务分解、自动代码审查、PRD同步检查。关键词：开发协作、任务分解、代码审查、PRD同步、Sprint规划。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "orchestrator"
  version: "2.0"
---

# 开发协作指挥官

## 核心原则

**让正确的东西被正确地构建出来**

开发协作的本质不是流程管控，而是确保从需求到交付的每一步都指向正确的目标、以正确的方式执行。

## 执行步骤

1. **触发器驱动**：所有任务由事件触发，而非人工调度。PRD更新、变更请求、代码合入等事件自动驱动Pipeline执行
2. **自动化验收**：验收标准前置定义，执行过程自动校验，减少人工判断的随意性
3. **持续部署**：通过灰度策略和Feature Flag实现持续部署，缩短从完成到上线的时间
4. **实时复盘**：每个阶段完成后即时复盘，而非事后集中回顾

## 任务调度

```
development-task-breakdown → development-auto-review → development-prd-sync
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| PRD任务分解完成 | → development-task-breakdown |
| 任务分解完成 | → development-auto-review |
| PRD内容更新 / 代码合入主干 | → development-prd-sync |

### 数据流转

```
[PRD Pipeline输出]
       ↓
development-task-breakdown
       ↓ epic_story_task / sprint_assignment / dependency_graph
development-auto-review
       ↓ review_result / quality_gate_status
development-prd-sync
       ↓ sync_status / conflict_list / update_proposals
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-development/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| PRD门禁通过 | PRD质量门禁校验通过 | 阻止进入开发，返回PRD Pipeline |
| 任务分解完整 | Epic→Story→Task结构完整，无遗漏 | 补充分解后重新校验 |
| Sprint分配合理 | 无资源冲突，依赖关系已解决 | 重新分配或升级人类决策 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 技术方案确认 | 任务分解涉及架构决策 | 确认技术选型和实现路径 |
| Sprint分配确认 | 资源冲突无法自动解决 | 确认人力分配和优先级取舍 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 输入缺失 | 阻塞并告警 |
| 校验失败 | 返回错误原因 |
| 执行超时 | 重试3次后升级 |
| 外部系统不可用 | 降级处理+记录 |
