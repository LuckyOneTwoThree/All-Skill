---
name: validation-orchestrator
description: 当需要验证产品方案时使用。方案验证子模块指挥官，调度子Skill：validation-assumption-map、validation-mvp、validation-experiment、validation-usability。关键词：方案验证、假设验证、MVP、可用性测试、实验设计、假设地图、风险评估。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "orchestrator"
  version: "3.0"
---

# 方案验证指挥官

## 核心原则

验证的是假设不是方案，用最小成本获取最大置信度。

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

### 阶段1：validation-assumption-map

| 项目 | 内容 |
|------|------|
| 子Skill名称 | validation-assumption-map |
| 读取定义路径 | `.trae/skills/validation-assumption-map/SKILL.md` |
| 输入 | 方案设计输出（`output/pm-design/design-prototype/prototype_spec.json`或`output/pm-design/design-userflow/userflow.json`）、PRD（`output/pm-design/design-prd/PRD-{产品名}.md`） |
| 输出 | `output/pm-design/validation-assumption-map/assumption_map.json` |
| 验证 | 最大风险假设已识别，每个功能点至少1个假设 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 每个功能点至少1个假设，最大风险假设必须有验证计划 |

### 阶段2：validation-mvp

| 项目 | 内容 |
|------|------|
| 子Skill名称 | validation-mvp |
| 读取定义路径 | `.trae/skills/validation-mvp/SKILL.md` |
| 输入 | 方案设计（`output/pm-design/design-prototype/prototype_spec.json`或`output/pm-design/design-userflow/userflow.json`）、假设地图（`output/pm-design/validation-assumption-map/assumption_map.json`）、资源约束（可选） |
| 输出 | `output/pm-design/validation-mvp/mvp_scope.json` |
| 验证 | MVP占比<60%，Must Have功能都有假设关联 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | MVP占比>60%升级人类判断，确认是否调整 |

### 阶段3：validation-experiment

| 项目 | 内容 |
|------|------|
| 子Skill名称 | validation-experiment |
| 读取定义路径 | `.trae/skills/validation-experiment/SKILL.md` |
| 输入 | 假设地图（`output/pm-design/validation-assumption-map/assumption_map.json`）、MVP范围（`output/pm-design/validation-mvp/mvp_scope.json`）、可用流量/用户数据（可选） |
| 输出 | `output/pm-design/validation-experiment/experiment_design.json` |
| 验证 | 实验方案人类已审核，含验证方法、样本量、时长、终止条件 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 所有实验方案必须人类审核 |

### 阶段4：validation-usability

| 项目 | 内容 |
|------|------|
| 子Skill名称 | validation-usability |
| 读取定义路径 | `.trae/skills/validation-usability/SKILL.md` |
| 输入 | 可用性测试计划（`output/pm-design/validation-assumption-map/assumption_map.json`）、测试参与者（用户提供）、测试任务场景（`output/pm-design/design-prototype/prototype_spec.json`） |
| 输出 | `output/pm-design/validation-usability/usability_report.json` |
| 验证 | 问题严重程度分级合理（P0/P1/P2/P3），洞察与假设地图有对应关系 |
| 执行模式 | 👤→🤖 |
| ⏸ 阶段卡口 | 测试执行必须由人类研究员主持 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件（`对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）`）
- 每个阶段完成后，将中间结果写入 `output/pm-design/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 假设地图完成 | 最大风险假设已识别 | 每个功能点至少1个假设，最大风险假设必须有验证计划 |
| MVP范围完成 | MVP占比<60% | MVP占比>60%升级人类判断，确认是否调整 |
| 实验设计完成 | 实验方案人类已审核 | 所有实验方案必须人类审核 |
| 可用性测试完成 | 问题严重程度分级合理 | 测试执行必须由人类研究员主持 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| MVP范围确认 | MVP范围界定完成，MVP占比>60%或Must Have有争议 | 人类审批并决定最终MVP范围 |
| 实验方案审核 | 实验方案设计完成 | 人类审核并批准实验方案 |
| 验证结论决策 | 可用性测试完成，验证数据已整理 | 人类做最终产品方案决策 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——新增子Skill执行协议、任务调度改为阶段执行计划、调度规则改为执行模式、阶段卡口和人类决策点改为表格、增加子Skill输入输出路径
