---
name: release-orchestrator
description: 当需要制定灰度发布策略、生成发布检查清单或版本发布说明时使用。发布策略指挥官。关键词：灰度发布、发布策略、发布检查清单、Feature Flag、持续部署、版本发布说明、Release Notes。
metadata:
  module: "产品开发与上线"
  sub-module: "发布上线"
  type: "orchestrator"
  version: "2.0"
---

# 发布策略指挥官

## 核心原则

**发布策略的本质是不确定性的渐进消解**

发布不是一次性动作，而是通过灰度策略逐步验证假设、消解不确定性，最终在充分置信度下完成全量发布。

## 执行步骤

1. **触发器驱动**：质量门禁通过自动触发灰度发布，监控指标恶化自动触发回滚
2. **自动化验收**：灰度各阶段指标自动校验，Checklist自动生成与追踪
3. **持续部署**：灰度策略配合Feature Flag，实现渐进式部署和即时回滚能力
4. **实时复盘**：灰度各阶段数据实时汇总，发布完成后即时生成复盘输入

## 任务调度

```
release-gradual → release-auto-checklist → release-notes
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 质量门禁通过 | → release-gradual（启动灰度发布） |
| 灰度阶段完成且指标达标 | → release-gradual（进入下一阶段） |
| 灰度阶段指标恶化 | → release-gradual（自动回滚） |
| 发布计划到达检查时间点 | → release-auto-checklist |
| 全量发布完成 | → release-notes（生成版本发布说明） |

### 数据流转

```
[质量门禁通过]
       ↓
release-gradual
       ↓ release_status / phase_transitions / rollback_history / monitoring_metrics
release-auto-checklist
       ↓ checklist / completion_status / pending_alerts
release-notes
       ↓ release-notes-v{version}.md / release-notes-v{version}.json
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-development/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 通过条件 | 未通过处理 |
|------|----------|------------|
| 灰度各阶段指标无恶化 | P0指标稳定，无新增异常 | 暂停灰度或自动回滚 |
| Checklist P0项全部完成 | 所有P0检查项已通过 | 阻止进入下一发布阶段 |
| 版本发布说明已生成 | 发布说明覆盖所有变更类型 | 补充遗漏变更 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 灰度推进确认 | 灰度阶段指标达标，准备扩大流量 | 确认是否推进到下一灰度阶段 |
| 全量发布决策 | 50%灰度阶段完成 | 确认是否全量发布 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 监控数据不可用 | 暂停灰度，等待数据恢复 |
| Feature Flag不可用 | 停止发布，回滚到上一状态 |
| 自动回滚失败 | 立即告警，触发人工介入 |
| Checklist未完成 | 阻止进入下一发布阶段 |

## 变更记录

- v1.0: 初始版本
- v2.0: 新增 release-notes（版本发布说明）
