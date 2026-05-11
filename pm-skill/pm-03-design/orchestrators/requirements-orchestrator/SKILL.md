---
name: requirements-orchestrator
description: 当需要管理产品需求时使用。需求管理子模块指挥官，调度子Skill：requirements-collection、requirements-understanding、requirements-prioritization。关键词：需求管理、需求收集、需求优先级、需求分析、需求分类、RICE评分、MoSCoW。
metadata:
  module: "产品构思与设计"
  sub-module: "需求管理"
  type: "orchestrator"
  version: "3.0"
---

# 需求管理指挥官

## 核心原则

需求≠问题，用户描述的是解决方案不是问题本身。

## 执行步骤

1. **批量生成人类筛选**：AI批量生成分类/排序建议，人类做最终筛选和判定
2. **结构化发散**：用固定模板和框架引导需求拆解，避免遗漏和随意性
3. **假设驱动而非功能驱动**：每个需求背后必须还原为用户假设，而非直接进入功能设计
4. **设计规范即约束**：需求分析阶段就引入设计规范约束，避免后期返工

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：requirements-collection

| 项目 | 内容 |
|------|------|
| 子Skill名称 | requirements-collection |
| 读取定义路径 | `.trae/skills/requirements-collection/SKILL.md` |
| 输入 | sources配置（用户提供，含用户反馈、行为数据、业务需求、竞品更新、战略输入等数据源连接器及同步频率） |
| 输出 | `output/pm-design/requirements-collection/requirements.json` |
| 验证 | 需求分类置信度已标注，每个需求都有category和classification_confidence |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 置信度<0.7标记待人工复核 |

### 阶段2：requirements-understanding

| 项目 | 内容 |
|------|------|
| 子Skill名称 | requirements-understanding |
| 读取定义路径 | `.trae/skills/requirements-understanding/SKILL.md` |
| 输入 | requirements[]（`output/pm-design/requirements-collection/requirements.json`） |
| 输出 | `output/pm-design/requirements-understanding/requirement_analysis.json` |
| 验证 | 理解模板5项已填充（who/where_when/what_problem/current_solution/ideal_state） |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 未填充项返回补充，低可信度需求需问题还原 |

### 阶段3：requirements-prioritization

| 项目 | 内容 |
|------|------|
| 子Skill名称 | requirements-prioritization |
| 读取定义路径 | `.trae/skills/requirements-prioritization/SKILL.md` |
| 输入 | requirement_analysis[]（`output/pm-design/requirements-understanding/requirement_analysis.json`）、资源约束（可选，含可用人力、最大并行功能数、战略目标、截止日期） |
| 输出 | `output/pm-design/requirements-prioritization/requirement_prioritization.json` |
| 验证 | MoSCoW人类已确认，RICE评分4个维度完整 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | AI提供MoSCoW建议，人类做最终定级 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件（`对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）`）
- 每个阶段完成后，将中间结果写入 `output/pm-design/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 收集完成 | 需求分类置信度已标注 | 置信度<0.7标记待人工复核 |
| 理解完成 | 理解模板5项已填充 | 未填充项返回补充，低可信度需求需问题还原 |
| 排序完成 | MoSCoW人类已确认 | AI提供MoSCoW建议，人类做最终定级 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 需求分类判定 | AI自动分类置信度<0.7 | 低置信度需求由人类判定分类 |
| MoSCoW定级 | RICE评分完成，AI生成MoSCoW建议 | 人类确认最终MoSCoW定级，可覆盖AI建议 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——新增子Skill执行协议、任务调度改为阶段执行计划、调度规则改为执行模式、阶段卡口和人类决策点改为表格、增加子Skill输入输出路径
