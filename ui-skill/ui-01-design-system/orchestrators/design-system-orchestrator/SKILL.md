---
name: design-system-orchestrator
description: 当需要建立设计系统、制定设计规范或设计组件库时使用。设计系统建立指挥官，调度design-system子Skill完成令牌生成、组件库规划和文档生成的完整流程。关键词：设计系统、Design System、设计令牌、组件库、设计规范、design-token、component-library、design-system-doc、UI规范、视觉规范。
metadata:
  module: "UI设计与前端开发"
  sub-module: "设计系统"
  type: "orchestrator"
  version: "5.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "建立设计系统"
    - "制定设计规范"
    - "设计组件库"
    - "定义设计令牌"
---

# 设计系统建立指挥官

## 核心原则

设计系统是约束不是限制，一致性释放创造力。

## 执行步骤

1. **令牌先行**：先建立设计令牌，所有视觉决策基于令牌
2. **原子到组织**：组件从最小粒度开始，逐步组合
3. **文档同步**：组件创建即生成文档，避免文档债务
4. **品牌驱动**：所有设计决策回溯到品牌基因

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/ui/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/ui/design-system-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  post_pipeline:
    - action: stage-summary
      output: output/phase-reports/ui/design-system-orchestrator.md
  stages:
    - id: design-system
      name: 设计系统一体化生成
      depends_on: []
```

## 阶段执行计划

### 调用 design-system

```
Skill: design-system
输入:
  品牌规范: 用户提供 / output/pm-strategy/positioning-statement/positioning-statements.json
  产品定位: output/pm-strategy/positioning-statement/positioning-statements.json（可选）
  目标平台: 用户提供
  目标语言: 上游编排器传递 / 用户提供（默认zh-CN）
  PRD: output/pm-design/design-prd/prd.md（可选）
  现有组件库: 用户提供（可选）
输出: output/ui-design-system/design-system/
验证: WCAG AA对比度100%达标 + 色彩体系≥80个令牌 + 间距令牌≥8级 + 动画令牌覆盖duration+easing + 组件依赖图无循环 + 100%组件有文档
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/ui/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/ui/design-system-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 设计系统生成完成 | WCAG AA对比度100%达标 + 组件依赖图无循环 + 100%组件有文档 | 对比度不达标自动调整人类确认；循环依赖必须修复；缺失文档标注"待补充" |
| 阶段总结已生成 | output/phase-reports/ui/design-system-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 品牌色确认 | design-system执行Step 1时 | AI生成色彩体系，人类确认品牌主色和辅助色 |
| 组件层级划分 | design-system执行Step 3时 | AI建议原子/分子/组织分类，人类确认边界 |
| 令牌命名规范 | design-system执行Step 1时 | AI建议语义命名，人类确认命名体系 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 品牌规范不完整 | 使用行业默认值填充，标注"推断值"，人类确认 |
| WCAG对比度不达标 | 自动调整色阶，人类确认调整结果 |
| 组件循环依赖 | 自动检测并告警，必须修复 |
| 设计令牌冲突 | 标注冲突项，人类决策取舍 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失" |

## 变更记录

- v5.0: 合并 design-token + component-library + design-system-doc 为单一 design-system Skill；Pipeline格式对齐pm-skill规范；阶段从3个简化为1个
- v4.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v3.0: 统一优化为编排协议+Pipeline+调用指令格式，删除调度规则，增加并行阶段分析
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
