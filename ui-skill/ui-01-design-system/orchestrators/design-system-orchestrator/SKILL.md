---
name: design-system-orchestrator
description: 设计系统建立指挥官。协调design-token、component-library、design-system-doc三个子Skill的完整流程，确保设计系统一致性、可复用、文档完善。关键词：设计系统、Design System、设计令牌、组件库、设计规范、design-token、component-library、design-system-doc。
metadata:
  module: "UI设计与前端开发"
  sub-module: "设计系统"
  type: "orchestrator"
  version: "2.0"
---

# 设计系统建立指挥官

## 核心原则

设计系统是约束不是限制，一致性释放创造力。

## 执行步骤

1. **令牌先行**：先建立设计令牌，所有视觉决策基于令牌
2. **原子到组织**：组件从最小粒度开始，逐步组合
3. **文档同步**：组件创建即生成文档，避免文档债务
4. **品牌驱动**：所有设计决策回溯到品牌基因

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：design-token（设计令牌生成）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | design-token |
| 读取定义路径 | `.trae/skills/design-token/SKILL.md` |
| 输入 | 品牌规范（用户提供）；产品定位：`output/pm-strategy/positioning-statement/positioning-statements.json`；目标平台（用户提供） |
| 输出 | `output/ui-design-system/design-token/`（色彩体系、字体排版、间距节奏、阴影层级、圆角规范、断点、对比度校验、多平台Token文件） |
| 验证 | WCAG AA对比度100%达标 + 色彩体系≥80个令牌 + 间距令牌≥8级 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 设计令牌人类确认通过后才可进入阶段2；不达标的色阶自动调整，人类确认调整结果 |

### 阶段2：component-library（组件库规划与生成）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | component-library |
| 读取定义路径 | `.trae/skills/component-library/SKILL.md` |
| 输入 | 设计令牌：`output/ui-design-system/design-token/tokens.json`；PRD：`output/pm-design/design-prd/prd.md`；现有组件库（用户提供，可选） |
| 输出 | `output/ui-design-system/component-library/`（原子/分子/组织三级组件定义、Props接口、依赖图、代码骨架） |
| 验证 | 原子组件≥15个 + 依赖图无循环 + 100%视觉属性引用Design Token |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 组件库人类确认通过后才可进入阶段3；循环依赖必须修复 |

### 阶段3：design-system-doc（设计系统文档生成）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | design-system-doc |
| 读取定义路径 | `.trae/skills/design-system-doc/SKILL.md` |
| 输入 | 设计令牌：`output/ui-design-system/design-token/tokens.json`；组件库：`output/ui-design-system/component-library/library.json`；品牌规范（用户提供，可选） |
| 输出 | `output/ui-design-system/design-system-doc/`（使用指南、组件示例代码、Do/Don't规范、可访问性说明、变更日志模板） |
| 验证 | 100%组件有文档 + 每个组件≥1个可运行代码示例 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | 文档覆盖100%组件；缺失文档的组件标注"待补充"，不阻塞发布 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/ui-design-system/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 设计令牌完成 | WCAG AA对比度100%达标 | 不达标的色阶自动调整，人类确认调整结果 |
| 组件库完成 | 原子组件≥15个 + 依赖图无循环 | 循环依赖必须修复后才能进入文档阶段 |
| 文档完成 | 100%组件有文档 | 缺失文档的组件标注"待补充"，不阻塞发布 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 品牌色确认 | design-token执行时 | AI生成色彩体系，人类确认品牌主色和辅助色 |
| 组件层级划分 | component-library执行时 | AI建议原子/分子/组织分类，人类确认边界 |
| 令牌命名规范 | design-token执行时 | AI建议语义命名，人类确认命名体系 |
| WCAG对比度调整确认 | design-token自动调整不达标色阶后 | 人类确认调整结果 |
| 组件库发布确认 | component-library输出完成 | 组件库生成完成，人类确认是否发布到组件仓库 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 品牌规范不完整 | 使用行业默认值填充，标注"推断值"，人类确认 |
| WCAG对比度不达标 | 自动调整色阶，人类确认调整结果 |
| 组件循环依赖 | 自动检测并告警，必须修复后才能进入文档阶段 |
| 设计令牌冲突 | 标注冲突项，人类决策取舍 |
| 文档生成失败 | 降级为组件清单列表，标注"文档待补充" |

## 变更记录

- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
