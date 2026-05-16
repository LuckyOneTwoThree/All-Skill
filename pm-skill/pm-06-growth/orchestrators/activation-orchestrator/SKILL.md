---
name: activation-orchestrator
description: 当需要识别Aha Moment或设计Onboarding流程时使用。用户激活指挥官，调度activation-aha/onboarding。关键词：用户激活、Aha Moment、Onboarding、新用户引导、新手引导、激活率。
metadata:
  module: "产品增长与运营"
  sub-module: "激活"
  type: "orchestrator"
  version: "6.1"
  domain_tags: ["电商", "社交", "工具", "通用"]
  trigger_examples:
    - "找到Aha Moment"
    - "设计新手引导流程"
    - "提升用户激活率"
    - "优化Onboarding"
---

# 用户激活指挥官

## 核心原则

**Aha Moment是用户留存的起点**

用户激活的本质是帮助用户尽快到达Aha Moment——那个让用户感受到产品核心价值的瞬间。没有Aha Moment的激活只是流程完成，不是价值传递。

## 编排理念

1. **Aha Moment锚定Onboarding**：先识别Aha Moment，再以Aha Moment为终点设计Onboarding路径，确保引导有明确目标
2. **数据从识别流向设计**：Aha Moment的到达率和路径数据直接驱动Onboarding的流程设计

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: activation-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/activation-orchestrator.md

stages:
  - id: phase-1
    name: "Aha Moment识别"
    depends_on: []
    skills: [activation-aha]
    gate:
      condition: "至少产出1个Aha Moment候选行为，含留存提升和到达率数据"
      fail_action: "扩大行为搜索范围"

  - id: phase-2
    name: "Onboarding设计"
    depends_on: [phase-1]
    skills: [activation-onboarding]
    gate:
      condition: "各用户分群的Onboarding路径和内容已设计"
      fail_action: "补充分群数据或延长分析周期"
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

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-growth/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-growth/activation-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: retention-orchestrator
    reason: 用户激活优化完成，防止用户流失
    input_mapping:
      activation_output: "output/pm-growth/activation-aha/ + activation-onboarding/ → retention-management输入"
  alternatives:
    - target: growth-orchestrator
      reason: 激活不是当前瓶颈，回退到增长诊断重新评估
      condition: 激活率优化效果不达预期或激活非当前最大瓶颈时
    - target: experiment-orchestrator
      reason: 激活策略需A/B测试验证
      condition: Onboarding方案变更需量化验证时
  special_cases:
    - target: activation-aha
      reason: 仅需识别Aha Moment，无需完整激活编排
      condition: 已有Onboarding方案，仅需确认Aha Moment时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| Aha Moment候选已识别 | activation-aha-moment输出文件已生成且非空 | 扩大行为搜索范围 |
| Onboarding策略已生成 | activation-onboarding输出文件已生成且非空 | 补充分群数据或延长分析周期 |
| 阶段总结已生成 | output/phase-reports/pm-growth/activation-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

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
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
- v4.0: 执行步骤替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
