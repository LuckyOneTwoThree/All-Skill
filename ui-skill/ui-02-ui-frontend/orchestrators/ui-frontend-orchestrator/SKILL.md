---
name: ui-frontend-orchestrator
description: 当需要生成UI组件与前端代码时使用。UI前端指挥官，调度ui-component-gen/page-assembly/interaction-design/ui-review/frontend-test。关键词：UI前端、组件生成、页面组装、交互设计、UI审查、前端测试。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "orchestrator"
  version: "2.0"
---

# UI前端生成指挥官

## 核心原则

UI与前端一体化，设计即实现，实现即设计。

## 执行步骤

1. **组件先行**：先完成组件生成，再组装页面
2. **交互增强**：页面组装后添加交互设计
3. **审查闭环**：审查不通过则回退修复，不跳过
4. **测试保障**：测试覆盖核心流程，不盲目追求覆盖率

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：ui-component-gen（UI组件代码生成）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | ui-component-gen |
| 读取定义路径 | `.trae/skills/ui-component-gen/SKILL.md` |
| 输入 | 组件意图描述（用户提供）；设计令牌：`output/ui-design-system/design-token/tokens.json`；组件库：`output/ui-design-system/component-library/library.json`；目标框架（用户提供）；原型规格：`output/pm-design/design-prototype/prototype_spec.json`（可选）；PRD：`output/pm-design/design-prd/prd.md`（可选） |
| 输出 | `output/ui-frontend/ui-component-gen/`（组件代码、Props类型、Story、测试骨架、Token合规性） |
| 验证 | Design Token引用率100% + TypeScript类型定义完整 + 交互组件包含ARIA属性 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 组件代码人类确认通过后才可进入阶段2；硬编码值必须替换为Token引用 |

### 阶段2：page-assembly（页面组装）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | page-assembly |
| 读取定义路径 | `.trae/skills/page-assembly/SKILL.md` |
| 输入 | 页面需求（用户提供/`output/pm-design/design-prd/prd.md`）；组件库：`output/ui-design-system/component-library/library.json`；已生成组件：`output/ui-frontend/ui-component-gen/components.json`；设计令牌：`output/ui-design-system/design-token/tokens.json`；路由结构：`output/pm-design/design-ia/ia_proposals.json`（可选）；原型规格：`output/pm-design/design-prototype/prototype_spec.json`（可选） |
| 输出 | `output/ui-frontend/page-assembly/`（页面代码、路由配置、状态管理、组件树、数据流） |
| 验证 | 组件树层级≤4层 + 100%组件来自组件库或ui-component-gen生成 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 页面布局人类确认通过后才可进入阶段3；层级过深需重构 |

### 阶段3：interaction-design（交互设计）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | interaction-design |
| 读取定义路径 | `.trae/skills/interaction-design/SKILL.md` |
| 输入 | 组件规格：`output/ui-frontend/ui-component-gen/` / `output/ui-design-system/component-library`；页面需求：`output/ui-frontend/page-assembly/` / `output/pm-design/design-prd`；设计令牌：`output/ui-design-system/design-token/tokens.json` |
| 输出 | `output/ui-frontend/interaction-design/`（状态机、动画规范、手势支持、反馈机制、交互代码） |
| 验证 | 所有异步操作有loading状态 + 状态机无死锁 + 动画时长100-500ms |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 交互方案人类确认通过后才可进入阶段4；缺失loading状态必须补充 |

### 阶段4：ui-review（UI审查）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | ui-review |
| 读取定义路径 | `.trae/skills/ui-review/SKILL.md` |
| 输入 | 组件代码：`output/ui-frontend/ui-component-gen/`；页面代码：`output/ui-frontend/page-assembly/`；设计令牌：`output/ui-design-system/design-token/tokens.json`；交互规格：`output/ui-frontend/interaction-design/`（可选） |
| 输出 | `output/ui-frontend/ui-review/`（审查报告：设计规范/无障碍/交互/响应式、问题清单P0/P1/P2、修复建议） |
| 验证 | P0问题=0 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | P0问题=0才可进入阶段5；P0>0则回退到对应阶段修复 |

### 阶段5：frontend-test（前端测试）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | frontend-test |
| 读取定义路径 | `.trae/skills/frontend-test/SKILL.md` |
| 输入 | 组件代码：`output/ui-frontend/ui-component-gen/`；页面代码：`output/ui-frontend/page-assembly/`；交互规格：`output/ui-frontend/interaction-design/`（可选）；UI审查结果：`output/ui-frontend/ui-review/`（可选） |
| 输出 | `output/ui-frontend/frontend-test/`（单元测试、视觉回归测试、E2E测试、无障碍测试、覆盖率报告） |
| 验证 | 核心流程E2E测试100%通过 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | 核心流程E2E测试100%通过；不通过则回退到组件生成阶段修复 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/ui-frontend/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 组件生成完成 | Design Token引用率100% | 硬编码值必须替换为Token引用 |
| 页面组装完成 | 组件树层级≤4层 | 层级过深需重构后才能进入交互阶段 |
| 交互设计完成 | 所有异步操作有loading状态 | 缺失loading状态必须补充 |
| UI审查完成 | P0问题=0 | P0问题必须修复后才能进入测试阶段 |
| 前端测试完成 | 核心流程E2E测试100%通过 | 不通过则回退到组件生成阶段修复 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 组件方案确认 | ui-component-gen执行时 | AI生成组件清单，人类确认组件边界和Props设计 |
| 页面布局确认 | page-assembly执行时 | AI生成页面布局方案，人类确认布局选择 |
| 交互方案确认 | interaction-design执行时 | AI生成交互状态机，人类确认交互行为 |
| UI审查P1问题处理 | ui-review发现P1问题时 | P1问题修复还是接受为技术债务 |
| 测试策略确认 | frontend-test执行时 | AI生成测试方案后，人类确认测试范围和优先级 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 设计令牌缺失 | 降级使用默认设计令牌，标注"缺乏品牌定制" |
| 组件库不完整 | 基于已有组件组装，缺失组件标注"待补充" |
| UI审查P0问题 | 必须修复后才能进入测试阶段 |
| E2E测试环境不可用 | 跳过E2E测试，标注"E2E待执行"，不阻塞发布 |
| 组件树层级过深 | 标注"需重构"，人类确认是否立即重构或标记为技术债务 |

## 变更记录

- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
