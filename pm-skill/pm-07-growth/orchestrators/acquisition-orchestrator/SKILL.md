---
name: acquisition-orchestrator
description: 当需要评估获客渠道或优化获客漏斗时使用。用户获取指挥官，调度 acquisition-channel（渠道评估）、acquisition-optimize（漏斗优化），实现从渠道评估到漏斗优化的闭环。关键词：用户获取、获客渠道、漏斗优化、渠道评估、获客策略、acquisition-channel、acquisition-optimize。
metadata:
  module: "产品增长与运营"
  sub-module: "获客"
  type: "orchestrator"
  version: "5.0"
---

# 用户获取指挥官

## 核心原则

**让正确的用户找到产品**

用户获取不是流量游戏，而是匹配游戏。目标不是更多用户，而是更多正确用户——那些能从产品中获得价值、同时为产品创造价值的用户。

## 编排理念

1. **渠道评估先行，漏斗优化跟进**：先明确渠道质量和分级，再基于渠道数据优化漏斗，避免在低质量渠道上浪费优化资源
2. **数据在渠道间流转**：渠道评估的输出直接驱动漏斗优化的输入，确保优化方案有渠道级数据支撑

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-growth/acquisition-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-growth/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-growth/acquisition-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: acquisition-channel
    gate: 19种渠道数据已收集，分级报告已生成
  - stage: acquisition-optimize
    depends_on: [acquisition-channel]
    gate: 获客漏斗各层转化分析完成，优化建议已输出
```

## 阶段执行计划

#### 调用 acquisition-channel

```
Skill: acquisition-channel
输入:
  channel_data: 用户提供（19种获客渠道数据）
  historical_performance: 用户提供（历史渠道表现）
  channel_config_cost: 用户提供（渠道配置和成本）
输出: output/pm-growth/acquisition-channel/
验证: 渠道评估覆盖规模、转化率、ROI、质量4个维度；渠道分级标准明确（主力/测试/观察）；ROI计算考虑用户LTV而非单次收入；评估覆盖19种获客渠道类型
模式: 🤖→👤
```

#### 调用 acquisition-optimize

```
Skill: acquisition-optimize
输入:
  funnel_data: output/pm-growth/acquisition-channel/channel_report.json
  channel_performance: output/pm-growth/acquisition-channel/channel_report.json
  historical_optimization: 用户提供（可选）
输出: output/pm-growth/acquisition-optimize/
验证: 漏斗阶段定义完整（曝光→激活/付费）；流失原因区分认知/信任/行动/价值4类障碍；优化方案附带预期提升和实施难度评估；A/B测试设计包含决策规则和终止条件
模式: 🤖→👤
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 渠道评估完成 | 19种渠道数据已收集，分级报告已生成 | 补充缺失渠道数据 |
| 漏斗优化方案已生成 | 获客漏斗各层转化分析完成，优化建议已输出 | 延长分析周期或扩大数据范围 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 渠道策略确认 | 渠道评估完成，需调整资源分配 | 确认主力渠道、测试渠道和观察渠道的划分及预算分配 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 渠道数据严重缺失（>50%渠道无数据） | 暂停渠道评估，要求用户补充核心渠道数据后再继续 |
| 漏斗优化A/B测试样本不足 | 延长测试周期至样本达标，或放宽显著性要求至90%置信度 |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
- v4.0: 执行步骤替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
