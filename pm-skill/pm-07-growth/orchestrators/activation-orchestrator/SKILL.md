---
name: activation-orchestrator
description: 当需要识别Aha Moment或设计Onboarding流程时使用。用户激活指挥官，调度activation-aha/onboarding。关键词：用户激活、Aha Moment、Onboarding、新用户引导。
metadata:
  module: "产品增长与运营"
  sub-module: "激活"
  type: "orchestrator"
  version: "4.0"
---

# 用户激活指挥官

## 核心原则

**Aha Moment是用户留存的起点**

用户激活的本质是帮助用户尽快到达Aha Moment——那个让用户感受到产品核心价值的瞬间。没有Aha Moment的激活只是流程完成，不是价值传递。

## 编排理念

1. **Aha Moment锚定Onboarding**：先识别Aha Moment，再以Aha Moment为终点设计Onboarding路径，确保引导有明确目标
2. **数据从识别流向设计**：Aha Moment的到达率和路径数据直接驱动Onboarding的流程设计

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：Aha Moment识别

| 项目 | 内容 |
|------|------|
| 子Skill名称 | activation-aha |
| 读取定义路径 | `.trae/skills/activation-aha/SKILL.md` |
| 输入 | 留存数据（analysis-retention → retention_analysis.yaml）、用户行为数据（用户提供）、用户分群数据（用户提供，可选） |
| 输出 | `output/pm-growth/activation-aha/` |
| 验证 | Aha候选通过相关性筛选（≥0.5）和显著性检验；到达率分析包含时间分布和路径分析；最短路径识别包含摩擦点分析；Onboarding优化建议可直接执行 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 至少产出1个Aha Moment候选行为，含留存提升和到达率数据；若未通过则扩大行为搜索范围 |

### 阶段2：Onboarding优化

| 项目 | 内容 |
|------|------|
| 子Skill名称 | activation-onboarding |
| 读取定义路径 | `.trae/skills/activation-onboarding/SKILL.md` |
| 输入 | Onboarding数据（用户提供）、Aha Moment数据（activation-aha → `output/pm-growth/activation-aha/aha_moment.yaml`）、用户分群数据（用户提供，可选） |
| 输出 | `output/pm-growth/activation-onboarding/` |
| 验证 | Onboarding阶段定义完整（欢迎→激活完成）；流失分析覆盖各阶段和用户分群；个性化引导与用户分群匹配；A/B测试包含护栏指标（后续留存、付费转化） |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 各用户分群的Onboarding路径和内容已设计；若未通过则补充分群数据或延长分析周期 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-growth/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

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
