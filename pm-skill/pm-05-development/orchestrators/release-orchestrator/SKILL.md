---
name: release-orchestrator
description: 当需要制定灰度发布策略或版本发布说明时使用。发布策略指挥官，调度release-gradual/auto-checklist/release-notes。关键词：灰度发布、发布策略、发布检查清单、Feature Flag、版本发布说明。
metadata:
  module: "产品开发与上线"
  sub-module: "发布上线"
  type: "orchestrator"
  version: "5.0"
---

# 发布策略指挥官

## 核心原则

**发布策略的本质是不确定性的渐进消解**

发布不是一次性动作，而是通过灰度策略逐步验证假设、消解不确定性，最终在充分置信度下完成全量发布。

## 编排理念

1. **灰度验证先行，Checklist兜底**：灰度发布验证技术风险，Checklist验证流程完整性，两者缺一不可
2. **指标恶化即回滚，无需人工确认**：P0指标恶化自动回滚，将人工决策留给不确定场景而非确定风险
3. **发布说明必须覆盖所有变更**：任何未在发布说明中体现的变更视为遗漏，遗漏即风险

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-development/release-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-development/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-development/release-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: release-gradual
    gate: 灰度各阶段指标无恶化
  - stage: release-auto-checklist
    parallel: true
    gate: Checklist P0项全部完成
  - stage: release-notes
    depends_on: [release-gradual, release-auto-checklist]
    gate: 版本发布说明已生成
```

## 阶段执行计划

#### 调用 release-gradual

```
Skill: release-gradual
输入:
  release_content: 发布管理系统
  feature_flag_config: Feature Flag系统
  monitoring_metrics: 监控系统
  gradual_strategy: 发布策略库
输出: output/pm-development/release-gradual/
验证: 发布前验证全部通过，P0指标稳定无恶化趋势，回滚机制就绪，告警配置正确
模式: 🤖
```

#### 调用 release-auto-checklist

```
Skill: release-auto-checklist
输入:
  release_content: 发布管理系统
  checklist_template: 发布策略库
  release_plan: 项目管理
  release_history: 发布历史库
输出: output/pm-development/release-auto-checklist/
验证: P0项完成率100%，告警处理率100%，人工确认完整性
模式: 🤖
```

#### 调用 release-notes

```
Skill: release-notes
输入:
  change_log: output/pm-development/requirements-change-log/requirements-change-log.md
  prd_doc: output/pm-design/design-prd/PRD-{产品名}.md
  srs_doc: output/pm-design/requirements-srs/SRS-{产品名}.md
  version: 版本号
  release_date: 发布日期
  release_type: 发布类型
  target_audience: 目标受众
输出: output/pm-development/release-notes/
验证: 版本号和日期正确，变更按类别分类，破坏性变更已突出显示，用户行动项已明确，多格式已生成
模式: 🤖→👤
```

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
- v4.0: 执行步骤原则替换为编排理念
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
