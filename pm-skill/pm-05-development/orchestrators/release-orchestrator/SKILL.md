---
name: release-orchestrator
description: 当需要制定灰度发布策略或版本发布说明时使用。发布策略指挥官，调度release-gradual/auto-checklist/release-notes。关键词：灰度发布、发布策略、发布检查清单、Feature Flag、版本发布说明。
metadata:
  module: "产品开发与上线"
  sub-module: "发布上线"
  type: "orchestrator"
  version: "3.0"
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

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

#### 阶段1：灰度发布自动执行

| 项目 | 内容 |
|------|------|
| 子Skill名称 | release-gradual |
| 读取定义路径 | `.trae/skills/release-gradual/SKILL.md` |
| 输入 | 发布内容（发布管理系统）、Feature Flag配置（Feature Flag系统）、监控指标定义（监控系统）、灰度策略配置（发布策略库） |
| 输出 | `output/pm-development/release-gradual/`（release_status、phase_transitions、rollback_history、monitoring_metrics、canary_plan） |
| 验证 | 发布前验证全部通过，P0指标稳定无恶化趋势，回滚机制就绪，告警配置正确 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 灰度各阶段指标无恶化：P0指标稳定，无新增异常，未通过则暂停灰度或自动回滚 |

#### 阶段2：上线Checklist自动生成与追踪

| 项目 | 内容 |
|------|------|
| 子Skill名称 | release-auto-checklist |
| 读取定义路径 | `.trae/skills/release-auto-checklist/SKILL.md` |
| 输入 | 发布内容（发布管理系统）、Checklist模板（发布策略库）、发布计划（项目管理）、发布历史（发布历史库） |
| 输出 | `output/pm-development/release-auto-checklist/`（checklist、completion_status、pending_alerts、risk_assessment） |
| 验证 | P0项完成率100%，告警处理率100%，人工确认完整性 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | Checklist P0项全部完成：所有P0检查项已通过，未通过则阻止进入下一发布阶段 |

#### 阶段3：版本发布说明自动生成

| 项目 | 内容 |
|------|------|
| 子Skill名称 | release-notes |
| 读取定义路径 | `.trae/skills/release-notes/SKILL.md` |
| 输入 | 需求变更记录（output/pm-development/requirements-change-log/requirements-change-log.md）、PRD文档（output/pm-design/design-prd/PRD-{产品名}.md）、SRS文档（output/pm-design/requirements-srs/SRS-{产品名}.md）、版本号、发布日期、发布类型、目标受众 |
| 输出 | `output/pm-development/release-notes/`（release-notes-v{版本号}.md、release-notes-v{版本号}-enterprise.md、release-notes-v{版本号}-developer.md、release-notes-v{版本号}.json） |
| 验证 | 版本号和日期正确，变更按类别分类，破坏性变更已突出显示，用户行动项已明确，多格式已生成 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 版本发布说明已生成：发布说明覆盖所有变更类型，未通过则补充遗漏变更 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件（`对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）`）
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-development/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 灰度各阶段指标无恶化 | P0指标稳定，无新增异常 | 暂停灰度或自动回滚 |
| Checklist P0项全部完成 | 所有P0检查项已通过 | 阻止进入下一发布阶段 |
| 版本发布说明已生成 | 发布说明覆盖所有变更类型 | 补充遗漏变更 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 灰度推进确认 | 灰度阶段指标达标，准备扩大流量 | 确认是否推进到下一灰度阶段 |
| 全量发布决策 | 50%灰度阶段完成 | 确认是否全量发布 |
| 回滚决策 | 灰度阶段指标恶化但未触发自动回滚 | 确认是否手动回滚或继续观察 |
| 发布窗口确认 | Checklist全部通过 | 确认最终发布时间窗口 |
| 紧急发布审批 | 未走完标准灰度流程需紧急发布 | 确认紧急发布方案和风险接受 |

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
- v3.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范，调度规则从"加载"改为"执行"
