---
name: design-orchestrator
description: 当需要生成PRD、需求规格、信息架构、用户流程、原型或交互规范时使用。产品设计指挥官，调度design-prd/requirements-srs/design-ia/design-userflow/design-prototype/interaction-spec/design-handoff-spec。关键词：产品设计、PRD、SRS、信息架构、原型、交互规范、设计交接。
metadata:
  module: "产品构思与设计"
  sub-module: "产品设计与原型"
  type: "orchestrator"
  version: "5.0"
---

# 产品设计与原型指挥官

## 核心原则

设计是取舍不是堆砌，核心路径必须极致流畅。

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

### 阶段1：design-prd

| 项目 | 内容 |
|------|------|
| 子Skill名称 | design-prd |
| 读取定义路径 | `.trae/skills/design-prd/SKILL.md` |
| 输入 | 需求分析输出（`output/pm-design/requirements-understanding/requirement_analysis.json`）、创意方案输出（`output/pm-design/ideation-convergence/converged_solutions.json`）、战略输出（用户提供）、需求上下文（用户提供，product_name必填） |
| 输出 | `output/pm-design/design-prd/PRD-{产品名}.md`、质量门禁检查报告JSON |
| 验证 | PRD 4道质量门禁全部通过 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 门禁1或2失败阻塞流程，输出缺失项清单 |

### 阶段2：requirements-srs

| 项目 | 内容 |
|------|------|
| 子Skill名称 | requirements-srs |
| 读取定义路径 | `.trae/skills/requirements-srs/SKILL.md` |
| 输入 | PRD文档（`output/pm-design/design-prd/PRD-{产品名}.md`）、API契约（可选）、数据模型（可选）、IA信息架构（可选）、用户流程（可选）、技术约束（可选） |
| 输出 | `output/pm-design/requirements-srs/SRS-{产品名}.md`、`output/pm-design/requirements-srs/requirements-srs.json` |
| 验证 | 功能需求有唯一编号，非功能需求覆盖5维度 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 补充缺失需求或标注"待确认" |

### 阶段3：design-ia

| 项目 | 内容 |
|------|------|
| 子Skill名称 | design-ia |
| 读取定义路径 | `.trae/skills/design-ia/SKILL.md` |
| 输入 | PRD（`output/pm-design/design-prd/PRD-{产品名}.md`）、现有产品IA（可选）、用户研究数据（可选） |
| 输出 | `output/pm-design/design-ia/ia_proposals.json` |
| 验证 | IA方案人类已确认 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 生成2-3个候选方案供人类选择 |

### 阶段4：design-userflow

| 项目 | 内容 |
|------|------|
| 子Skill名称 | design-userflow |
| 读取定义路径 | `.trae/skills/design-userflow/SKILL.md` |
| 输入 | PRD（`output/pm-design/design-prd/PRD-{产品名}.md`）、IA方案（`output/pm-design/design-ia/ia_proposals.json`）、用户研究数据（可选） |
| 输出 | `output/pm-design/design-userflow/userflow.json` |
| 验证 | 用户流程死胡同=0 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 死胡同必须修复后才能进入原型阶段 |

### 阶段5：design-prototype

| 项目 | 内容 |
|------|------|
| 子Skill名称 | design-prototype |
| 读取定义路径 | `.trae/skills/design-prototype/SKILL.md` |
| 输入 | IA方案（`output/pm-design/design-ia/ia_proposals.json`）、User Flow（`output/pm-design/design-userflow/userflow.json`）、设计系统规范（可选）、设计令牌（可选） |
| 输出 | `output/pm-design/design-prototype/prototype_spec.json` |
| 验证 | 原型设计规范一致性≥85% |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 一致性<85%需人类确认violations |

### 阶段6：interaction-spec

| 项目 | 内容 |
|------|------|
| 子Skill名称 | interaction-spec |
| 读取定义路径 | `.trae/skills/interaction-spec/SKILL.md` |
| 输入 | 用户流程（`output/pm-design/design-userflow/userflow.json`）、原型规格（`output/pm-design/design-prototype/prototype_spec.json`）、设计交接文档（可选）、品牌规范（可选） |
| 输出 | `output/pm-design/interaction-spec/interaction-spec.md`、`output/pm-design/interaction-spec/interaction-spec.json` |
| 验证 | 交互状态机8种基础状态全覆盖 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 补充缺失状态定义 |

### 阶段7：design-handoff-spec

| 项目 | 内容 |
|------|------|
| 子Skill名称 | design-handoff-spec |
| 读取定义路径 | `.trae/skills/design-handoff-spec/SKILL.md` |
| 输入 | 原型规格（`output/pm-design/design-prototype/prototype_spec.json`）、设计令牌（可选）、IA信息架构（`output/pm-design/design-ia/ia_proposals.json`）、用户流程（`output/pm-design/design-userflow/userflow.json`）、PRD文档（`output/pm-design/design-prd/PRD-{产品名}.md`）、组件库（可选） |
| 输出 | `output/pm-design/design-handoff-spec/design-handoff-spec.md`、`output/pm-design/design-handoff-spec/design-handoff-spec.json` |
| 验证 | 交接文档待确认项=0 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 待确认项需逐项确认或标注接受风险 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件（`对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）`）
- 每个阶段完成后，将中间结果写入 `output/pm-design/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| PRD生成完成 | PRD 4道质量门禁全部通过 | 门禁1或2失败阻塞流程，输出缺失项清单 |
| SRS生成完成 | 功能需求有唯一编号，非功能需求覆盖5维度 | 补充缺失需求或标注"待确认" |
| IA设计完成 | IA方案人类已确认 | 生成2-3个候选方案供人类选择 |
| 用户流程完成 | 用户流程死胡同=0 | 死胡同必须修复后才能进入原型阶段 |
| 原型完成 | 原型设计规范一致性≥85% | 一致性<85%需人类确认violations |
| 交互规范完成 | 交互状态机8种基础状态全覆盖 | 补充缺失状态定义 |
| 设计交接完成 | 交接文档待确认项=0 | 待确认项需逐项确认或标注接受风险 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| PRD层级确认 | AI自动分级置信度<0.7 | 确认PRD层级（L/S/X） |
| SRS需求确认 | SRS生成完成 | 确认非功能需求指标和约束条件 |
| IA方案选择 | IA生成2-3个候选方案 | 选择最终IA方案 |
| 设计规范violation确认 | 设计规范一致性<85% | 判断是否接受violation |
| 交互规范确认 | 交互设计规范生成完成 | 确认状态机、动画和手势规范 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 requirements-srs（需求规格说明书）、design-handoff-spec（设计交接文档）
- v4.0: 新增 interaction-spec（交互设计规范）
- v5.0: 编排器优化——新增子Skill执行协议、任务调度改为阶段执行计划、调度规则改为执行模式、阶段卡口和人类决策点改为表格、增加子Skill输入输出路径
