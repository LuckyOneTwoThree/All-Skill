---
name: acquisition-orchestrator
description: 当需要评估获客渠道或优化获客漏斗时使用。用户获取指挥官，调度 acquisition-analysis（获客分析一体化），实现从渠道评估到漏斗优化的闭环。关键词：用户获取、获客渠道、漏斗优化、渠道评估、获客策略、acquisition-analysis、拉新、获客。
metadata:
  module: "产品增长与运营"
  sub-module: "获客"
  type: "orchestrator"
  version: "7.0"
  domain_tags: ["电商", "社交", "教育", "通用"]
  trigger_examples:
    - "评估一下获客渠道"
    - "优化一下获客漏斗"
    - "怎么拉新用户"
    - "获客成本太高了"
---

# 用户获取指挥官

## 核心原则

**让正确的用户找到产品**

用户获取不是流量游戏，而是匹配游戏。目标不是更多用户，而是更多正确用户——那些能从产品中获得价值、同时为产品创造价值的用户。

## 编排理念

1. **渠道评估与漏斗优化一体执行**：acquisition-analysis 内部先完成渠道评估再执行漏斗优化，确保优化方案有渠道级数据支撑
2. **数据在步骤间流转**：渠道评估的输出直接驱动漏斗优化的输入，无需编排器中转

## 编排器定位声明

本编排器当前 Pipeline 仅包含 1 个子 Skill（acquisition-analysis），属于合并简化后的退化编排器。保留本编排器的理由：

1. **统一入口**：为用户获取子模块提供标准化的调用入口，上层编排器（如 product-launch-orchestrator）无需关心内部子 Skill 的合并历史
2. **阶段总结**：强制生成阶段总结文档（post_pipeline），确保子模块产出可审计、可追溯
3. **异常处理**：提供统一的异常处理策略和降级方案，子 Skill 自身的降级策略不覆盖编排器层面的异常拦截
4. **人类决策点**：在子 Skill 执行前后提供人类决策卡口，确保关键结论经人类确认后才传递下游

若未来该子模块需要扩展为多阶段 Pipeline，本编排器可直接增加阶段，无需修改上层编排器的调用方式。

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: acquisition-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/acquisition-orchestrator.md

stages:
  - id: phase-1
    name: "渠道评估与漏斗优化"
    depends_on: []
    skills: [acquisition-analysis]
    gate:
      condition: "渠道评估完成且漏斗优化方案已生成"
      fail_action: "补充缺失渠道数据或延长分析周期"
```

## 阶段执行计划

#### 调用 acquisition-analysis

```
Skill: acquisition-analysis
输入:
  channel_data: 用户提供（19种获客渠道数据）
  historical_performance: 用户提供（历史渠道表现）
  channel_config_cost: 用户提供（渠道配置和成本）
  historical_optimization: 用户提供（可选，历史优化实验数据）
输出: output/pm-growth/acquisition-analysis/
验证: 渠道评估覆盖规模、转化率、ROI、质量4个维度；渠道分级标准明确（主力/测试/观察）；ROI计算考虑用户LTV而非单次收入；评估覆盖19种获客渠道类型；漏斗阶段定义完整（曝光→激活/付费）；流失原因区分认知/信任/行动/价值4类障碍；优化方案附带预期提升和实施难度评估；A/B测试设计包含决策规则和终止条件
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-growth/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-growth/acquisition-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: activation-orchestrator
    reason: 获客优化完成，提升新用户转化
    input_mapping:
      acquisition_output: "output/pm-growth/acquisition-analysis/ → activation-aha输入"
  alternatives:
    - target: growth-orchestrator
      reason: 获客不是当前瓶颈，回退到增长诊断重新评估
      condition: 获客渠道ROI低于行业基准或优化效果不达预期时
    - target: experiment-orchestrator
      reason: 获客策略需A/B测试验证
      condition: 获客方案涉及渠道策略变更需量化验证时
  special_cases: []
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 获客分析完成 | acquisition-analysis输出文件已生成且非空 | 补充缺失渠道数据或延长分析周期 |
| 阶段总结已生成 | output/phase-reports/pm-growth/acquisition-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

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
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
- v4.0: 执行步骤替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v7.0: 合并 acquisition-channel + acquisition-optimize → acquisition-analysis，2阶段Pipeline简化为1阶段
