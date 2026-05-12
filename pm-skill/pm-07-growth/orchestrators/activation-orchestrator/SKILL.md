---
name: activation-orchestrator
description: 当需要识别Aha Moment或设计Onboarding流程时使用。用户激活指挥官，调度activation-aha/onboarding。关键词：用户激活、Aha Moment、Onboarding、新用户引导。
metadata:
  module: "产品增长与运营"
  sub-module: "激活"
  type: "orchestrator"
  version: "5.0"
---

# 用户激活指挥官

## 核心原则

**Aha Moment是用户留存的起点**

用户激活的本质是帮助用户尽快到达Aha Moment——那个让用户感受到产品核心价值的瞬间。没有Aha Moment的激活只是流程完成，不是价值传递。

## 编排理念

1. **Aha Moment锚定Onboarding**：先识别Aha Moment，再以Aha Moment为终点设计Onboarding路径，确保引导有明确目标
2. **数据从识别流向设计**：Aha Moment的到达率和路径数据直接驱动Onboarding的流程设计

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-growth/activation-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-growth/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-growth/activation-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: activation-aha
    gate: 至少产出1个Aha Moment候选行为，含留存提升和到达率数据
  - stage: activation-onboarding
    depends_on: [activation-aha]
    gate: 各用户分群的Onboarding路径和内容已设计
```

## 阶段执行计划

#### 调用 activation-aha

```
Skill: activation-aha
输入:
  retention_data: analysis-retention → retention_analysis.yaml
  user_behavior_data: 用户提供
  user_segment_data: 用户提供（可选）
输出: output/pm-growth/activation-aha/
验证: Aha候选通过相关性筛选（≥0.5）和显著性检验；到达率分析包含时间分布和路径分析；最短路径识别包含摩擦点分析；Onboarding优化建议可直接执行
模式: 🤖→👤
```

#### 调用 activation-onboarding

```
Skill: activation-onboarding
输入:
  onboarding_data: 用户提供
  aha_moment_data: output/pm-growth/activation-aha/aha_moment.yaml
  user_segment_data: 用户提供（可选）
输出: output/pm-growth/activation-onboarding/
验证: Onboarding阶段定义完整（欢迎→激活完成）；流失分析覆盖各阶段和用户分群；个性化引导与用户分群匹配；A/B测试包含护栏指标（后续留存、付费转化）
模式: 🤖→👤
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| Aha Moment候选已识别 | 至少产出1个Aha Moment候选行为，含留存提升和到达率数据 | 扩大行为搜索范围 |
| Onboarding策略已生成 | 各用户分群的Onboarding路径和内容已设计 | 补充分群数据或延长分析周期 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Aha Moment确认 | Aha Moment候选识别完成 | 确认主Aha Moment的选择和Onboarding路径设计 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| Aha Moment无候选通过筛选阈值 | 降低相关性阈值至0.3重新搜索；仍无结果则基于产品功能推断候选，标注"待数据验证" |
| Onboarding数据完全缺失 | 基于Aha Moment数据设计通用Onboarding框架，标注"待Onboarding数据补充" |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
- v4.0: 执行步骤替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
