---
name: ideation-orchestrator
description: 当需要发散创意或构思解决方案时使用。创意发散与方案构思子模块指挥官，调度子Skill：ideation-hmw、ideation-scamper、ideation-inversion、ideation-convergence。关键词：创意发散、HMW、SCAMPER、方案构思、产品创意、思维逆转、方案收敛。
metadata:
  module: "产品构思与设计"
  sub-module: "创意发散与方案构思"
  type: "orchestrator"
  version: "3.0"
---

# 创意发散与方案构思指挥官

## 核心原则

创意质量与数量正相关，早期判断是创意的敌人。

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

### 阶段1：ideation-hmw

| 项目 | 内容 |
|------|------|
| 子Skill名称 | ideation-hmw |
| 读取定义路径 | `.trae/skills/ideation-hmw/SKILL.md` |
| 输入 | Problem Statement（`output/pm-design/requirements-understanding/requirement_analysis.json`或用户提供）、User Research Data（`output/pm-design/requirements-collection/requirements.json`或用户提供） |
| 输出 | `output/pm-design/ideation-hmw/hmw_statements.json` |
| 验证 | HMW通过质量检查，6个维度都已覆盖 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 未通过质量检查的HMW重新生成，维度覆盖不全则补充 |

### 阶段2：ideation-scamper

| 项目 | 内容 |
|------|------|
| 子Skill名称 | ideation-scamper |
| 读取定义路径 | `.trae/skills/ideation-scamper/SKILL.md` |
| 输入 | HMW Statements（`output/pm-design/ideation-hmw/hmw_statements.json`，选择发散潜力≥3的HMW）、Current Solution（用户提供）、Competitor Solutions（可选） |
| 输出 | `output/pm-design/ideation-scamper/solutions.json` |
| 验证 | 至少10个候选方案，7个SCAMPER维度都已覆盖 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 方案数量不足则针对稀缺维度补充生成 |

### 阶段3：ideation-inversion

| 项目 | 内容 |
|------|------|
| 子Skill名称 | ideation-inversion |
| 读取定义路径 | `.trae/skills/ideation-inversion/SKILL.md` |
| 输入 | Product Goals（`output/pm-design/ideation-hmw/hmw_statements.json`或用户提供）、Product Context（可选） |
| 输出 | `output/pm-design/ideation-inversion/inversion_analysis.json` |
| 验证 | 设计约束已生成，失败路径覆盖5个维度 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 失败路径覆盖不全则补充，约束过于抽象则重新定义 |

### 阶段4：ideation-convergence

| 项目 | 内容 |
|------|------|
| 子Skill名称 | ideation-convergence |
| 读取定义路径 | `.trae/skills/ideation-convergence/SKILL.md` |
| 输入 | Solutions（`output/pm-design/ideation-scamper/solutions.json`）、Inversion Analysis（`output/pm-design/ideation-inversion/inversion_analysis.json`）、Product Context（可选） |
| 输出 | `output/pm-design/ideation-convergence/converged_solutions.json` |
| 验证 | Top5方案已深化，对比矩阵6个维度完整 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 深化不足则补充，对比矩阵不完整则补充缺失维度 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件（`对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）`）
- 每个阶段完成后，将中间结果写入 `output/pm-design/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| HMW完成 | HMW通过质量检查 | 未通过质量检查的HMW重新生成，维度覆盖不全则补充 |
| 方案生成完成 | 至少10个候选方案 | 方案数量不足则针对稀缺维度补充生成 |
| 逆转分析完成 | 设计约束已生成 | 失败路径覆盖不全则补充，约束过于抽象则重新定义 |
| 收敛完成 | Top5方案已深化 | 深化不足则补充，对比矩阵不完整则补充缺失维度 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 方案最终选择 | 收敛完成，对比矩阵已生成 | 人类做最终方案选择，可接受AI推荐、调整优先级、组合方案或否决 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——新增子Skill执行协议、任务调度改为阶段执行计划、调度规则改为执行模式、阶段卡口和人类决策点改为表格、增加子Skill输入输出路径
