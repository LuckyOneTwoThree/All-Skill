---
name: ui-orchestrator
description: 当需要UI设计与前端开发时使用。UI设计与前端开发总指挥，根据项目复杂度自动选择L1快速模式或L2完整模式，调度子编排器完成从设计系统到前端集成的全流程。关键词：UI设计、前端开发、UI、前端、界面开发、做UI、写前端、出界面、搭页面、设计系统+前端代码。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI总指挥"
  type: "orchestrator"
  version: "1.1"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "做UI"
    - "写前端"
    - "出界面"
    - "搭页面"
    - "设计系统加前端代码一起做"
    - "从设计到前端全流程"
  interaction_mode: "ai_suggest_human_approve"
---

# UI设计与前端开发总指挥

## 核心原则

分级不降质——L1精简的是流程长度，不是产出质量。

## 设计分级策略

根据项目复杂度自动选择执行模式：

### 复杂度判断规则

| 判断维度 | L1 快速模式 | L2 完整模式 |
|----------|-----------|-----------|
| 页面数量 | ≤5 页 | >5 页 |
| 组件复杂度 | 标准组件为主，无自定义复杂交互 | 需要自定义组件+复杂状态机 |
| 后端集成 | 无后端 / 静态数据 | 需要API联调+状态管理 |
| 性能要求 | 无特殊要求 | 有性能预算+SSR/SSG需求 |
| 多端适配 | 仅桌面或仅移动 | 需要多端自适应 |

**5 项中任一命中 L2 条件 → 走 L2 完整模式。**

### 分级流程对比

```
L1 快速模式（2个Skill）：
design-system → ui-component-gen（含页面组装+内置质量检查）

L2 完整模式（3个子编排器，8个Skill）：
design-system-orchestrator → ui-frontend-orchestrator → frontend-integration-orchestrator
```

### L1 与 L2 产出质量对齐

| 质量维度 | L1 快速模式 | L2 完整模式 | 对齐方式 |
|----------|-----------|-----------|---------|
| WCAG对比度 | design-system 内建校验 | design-system 内建校验 | ✅ 同源 |
| Token引用率 | ui-component-gen 内建检查 | ui-review 独立审查 | L1内建检查项与L2审查标准一致 |
| 组件可访问性 | ui-component-gen 内建ARIA | ui-review 独立审查 | L1组件生成时强制包含ARIA |
| 状态机完整性 | ui-component-gen 内建校验 | ui-review 独立审查 | L1组件生成时校验无死锁 |
| 单元测试 | ui-component-gen 生成基础骨架 | frontend-test 完整测试 | L1仅骨架，L2完整覆盖 |
| E2E测试 | 不生成 | frontend-test 生成 | L1无E2E，标注"待补充" |
| API联调 | 不涉及 | api-contract-consume | L1无后端集成 |
| 性能优化 | 不涉及 | frontend-performance | L1无性能优化 |
| 构建部署 | 输出标准项目结构 | frontend-build-deploy 完整CI/CD | L1仅输出项目结构 |

**核心承诺：L1 在其覆盖范围内（设计系统+组件+页面），产出质量与 L2 一致。**

## 执行步骤

1. **复杂度评估**：根据判断规则确定 L1 或 L2
2. **模式路由**：按分级策略调度对应流程
3. **质量兜底**：无论 L1 或 L2，最终产出必须通过质量卡口

## 编排协议

你是编排器，职责是**按阶段调度子Skill或子编排器执行**，而非代理执行内部逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill或子编排器，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。

### 上下文管理

- 每个子Skill/编排器调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/ui/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的名称

### 阶段总结

所有阶段执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/ui/ui-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、分级模式（L1/L2）、子Skill/编排器执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill/编排器的核心输出摘要（1-3条）、跨阶段交叉洞察
3. **决策记录**：复杂度分级决策及依据、人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、L1模式下缺失的L2能力清单、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

### L1 快速模式

```yaml
pipeline:
  post_pipeline:
    - action: stage-summary
      output: output/phase-reports/ui/ui-orchestrator.md
  stages:
    - id: project-scaffold
      name: 项目脚手架初始化
      depends_on: []
    - id: design-system
      name: 设计系统一体化生成
      depends_on: [project-scaffold]
    - id: ui-component-gen
      name: UI组件与页面生成
      depends_on: [design-system]
```

### L2 完整模式

```yaml
pipeline:
  post_pipeline:
    - action: stage-summary
      output: output/phase-reports/ui/ui-orchestrator.md
  stages:
    - id: project-scaffold
      name: 项目脚手架初始化
      depends_on: []
    - id: design-system-orchestrator
      name: 设计系统建立
      depends_on: [project-scaffold]
    - id: ui-frontend-orchestrator
      name: UI前端生成
      depends_on: [design-system-orchestrator]
    - id: frontend-integration-orchestrator
      name: 前端集成
      depends_on: [ui-frontend-orchestrator]
```

## 阶段执行计划

### 复杂度评估

```
动作: 评估项目复杂度
输入:
  页面数量: 用户提供
  组件复杂度: 用户提供 / 从PRD推断
  后端集成需求: 用户提供
  性能要求: 用户提供
  多端适配需求: 用户提供
  目标语言: 用户提供（zh-CN / en-US / ja-JP / ko-KR / ar-SA 等，默认zh-CN）
  project_name: 用户提供
  project_dir: 用户提供
  framework: 用户提供（React/Vue/Svelte/Next.js/Nuxt.js）
输出: L1 或 L2 模式选择 + 判断依据 + 目标语言 + project_dir
验证: 5项判断维度均有明确结论 + 目标语言已确定
模式: 🤖→👤
```

⏸ **卡口**：人类确认分级结果 → 未确认：补充项目信息后重新评估

### L1 快速模式

#### 调用 project-scaffold

```
Skill: project-scaffold
输入:
  project_name: 复杂度评估阶段确定
  project_dir: 复杂度评估阶段确定
  framework: 复杂度评估阶段确定
  package_manager: 用户提供（可选，默认pnpm）
  目标语言: 复杂度评估阶段确定
输出: output/ui-project-scaffold/ + 代码写入 {project_dir}/
验证: npm run dev 启动成功 + 目录结构完整
模式: 🤖
```

#### 调用 design-system

```
Skill: design-system
输入:
  品牌规范: 用户提供 / output/pm-strategy/positioning-statement/positioning-statements.json
  产品定位: output/pm-strategy/positioning-statement/positioning-statements.json（可选）
  目标平台: 用户提供
  目标语言: 复杂度评估阶段确定
  project_dir: 复杂度评估阶段确定
  PRD: output/pm-design/design-prd/prd.md（可选）
  现有组件库: 用户提供（可选）
输出: output/ui-design-system/design-system/ + 代码写入 {project_dir}/
验证: WCAG AA对比度100%达标 + 色彩体系≥80个令牌 + 间距令牌≥8级 + 动画令牌覆盖duration+easing + 组件依赖图无循环 + 100%组件有文档
模式: 🤖→👤
```

#### 调用 ui-component-gen（含页面组装）

```
Skill: ui-component-gen
输入:
  组件意图描述: 用户提供（包含页面结构需求）
  设计令牌: output/ui-design-system/design-system/tokens.json
  组件库: output/ui-design-system/design-system/library.json
  目标框架: 用户提供
  目标语言: 复杂度评估阶段确定
  project_dir: 复杂度评估阶段确定
  PRD: output/pm-design/design-prd/prd.md（可选）
  L1模式: true（标记为L1模式，触发内置质量检查）
输出: output/ui-frontend/ui-component-gen/ + 代码写入 {project_dir}/src/
验证:
  Design Token引用率100% + TypeScript类型定义完整 + 交互组件包含ARIA属性
  + 状态机无死锁 + 动画时长100-500ms
  + 页面组件树层级≤4层（L1内建页面组装质量检查）
  + 100%组件来自组件库或本次生成（L1内建审查检查）
  + 正文与背景对比度≥4.5:1（L1内建无障碍检查）
  + 异步操作>300ms有进度指示（L1内建交互检查）
模式: 🤖→👤
```

**L1 内建质量检查说明**：

L1 模式下 `ui-component-gen` 在代码生成后自动执行内建质量检查（Token引用率/对比度/ARIA/状态覆盖/组件来源/页面层级），确保与 L2 的 `ui-review` 审查标准对齐。具体检查项见 ui-component-gen SKILL.md。未通过的内建检查项处理：P0问题必须修复，P1问题标注"待修复"。

#### L1 阶段总结（post_pipeline）

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/ui/
  分级模式: L1
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/ui/ui-orchestrator.md
验证: 阶段总结文档已生成，6项结构均非空 + L1缺失能力清单已列出
模式: 🤖
```

### L2 完整模式

#### 调用 project-scaffold

```
Skill: project-scaffold
输入:
  project_name: 复杂度评估阶段确定
  project_dir: 复杂度评估阶段确定
  framework: 复杂度评估阶段确定
  package_manager: 用户提供（可选，默认pnpm）
  目标语言: 复杂度评估阶段确定
输出: output/ui-project-scaffold/ + 代码写入 {project_dir}/
验证: npm run dev 启动成功 + 目录结构完整
模式: 🤖
```

#### 调用 design-system-orchestrator

```
Skill: design-system-orchestrator
输入:
  品牌规范: 用户提供 / output/pm-strategy/positioning-statement/positioning-statements.json
  产品定位: output/pm-strategy/positioning-statement/positioning-statements.json（可选）
  目标平台: 用户提供
  目标语言: 复杂度评估阶段确定
  project_name: 复杂度评估阶段确定
  project_dir: 复杂度评估阶段确定
  framework: 复杂度评估阶段确定
  PRD: output/pm-design/design-prd/prd.md（可选）
输出: output/ui-design-system/ + output/phase-reports/ui/design-system-orchestrator.md + 代码写入 {project_dir}/
验证: 子编排器阶段总结已生成 + WCAG AA对比度100%达标
模式: 🤖→👤
```

#### 调用 ui-frontend-orchestrator

```
Skill: ui-frontend-orchestrator
输入:
  设计令牌: output/ui-design-system/design-system/tokens.json
  组件库: output/ui-design-system/design-system/library.json
  页面需求: 用户提供 / output/pm-design/design-prd/prd.md
  目标框架: 用户提供
  目标语言: 复杂度评估阶段确定
  project_dir: 复杂度评估阶段确定
输出: output/ui-frontend/ + output/phase-reports/ui/ui-frontend-orchestrator.md + 代码写入 {project_dir}/src/
验证: 子编排器阶段总结已生成 + P0问题=0 + 核心流程E2E测试100%通过
模式: 🤖→👤
```

#### 调用 frontend-integration-orchestrator

```
Skill: frontend-integration-orchestrator
输入:
  API契约: output/backend-api-design/api-contract/（可选）
  前端代码: output/ui-frontend/
  项目信息: 用户提供
  部署目标: 用户提供
  目标语言: 复杂度评估阶段确定
  project_dir: 复杂度评估阶段确定
输出: output/ui-frontend-integration/ + output/phase-reports/ui/frontend-integration-orchestrator.md + 配置文件写入 {project_dir}/
验证: 子编排器阶段总结已生成 + 构建成功 + LCP≤2.5s
模式: 🤖→👤
```

#### L2 阶段总结（post_pipeline）

```
动作: 生成阶段总结
输入:
  所有子编排器输出: output/ui/
  所有子编排器阶段总结: output/phase-reports/ui/
  分级模式: L2
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/ui/ui-orchestrator.md
验证: 阶段总结文档已生成，6项结构均非空
模式: 🤖
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 复杂度评估完成 | 5项判断维度均有结论 + 人类确认分级 + 目标语言已确定 | 补充项目信息后重新评估 |
| L1: 设计系统完成 | WCAG AA对比度100%达标 + 组件依赖图无循环 | 对比度不达标自动调整人类确认；循环依赖必须修复 |
| L1: 组件与页面生成完成 | Token引用率100% + 状态机无死锁 + 内建质量检查全部通过 | P0问题必须修复；P1问题标注"待修复" |
| L2: 设计系统建立完成 | 子编排器阶段总结已生成 + WCAG达标 | 修复后重新验证 |
| L2: UI前端生成完成 | 子编排器阶段总结已生成 + P0问题=0 + E2E通过 | P0问题必须修复；E2E失败回退组件生成 |
| L2: 前端集成完成 | 子编排器阶段总结已生成 + 构建成功 + LCP≤2.5s | 构建失败修复后重试；性能不达标优化后重测 |
| 阶段总结已生成 | output/phase-reports/ui/ui-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 分级确认 | 复杂度评估完成时 | AI建议L1或L2，人类确认分级结果和目标语言 |
| 品牌色确认 | design-system执行Step 1时 | AI生成色彩体系，人类确认品牌主色和辅助色 |
| 组件方案确认 | ui-component-gen执行时 | AI生成组件清单和交互状态机，人类确认 |
| L2: 页面布局确认 | ui-frontend-orchestrator执行时 | AI生成页面布局方案，人类确认 |
| L2: 部署目标选择 | frontend-integration-orchestrator执行时 | AI建议部署方案，人类确认目标环境 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 项目信息不足以判断复杂度 | 默认走L2完整模式，标注"分级待确认" |
| L1内建质量检查P0问题不通过 | 必须修复后才能生成阶段总结 |
| L1内建质量检查P1问题不通过 | 标注"待修复"，不阻塞阶段总结 |
| 子编排器调用失败 | 记录失败原因，降级为跳过该阶段，标注"待重试" |
| 阶段总结生成失败 | 基于已完成的输出生成部分总结，缺失项标注"数据缺失" |

## L1 升级到 L2 的条件

L1 执行过程中，若出现以下情况，应建议人类升级到 L2：

| 触发条件 | 升级理由 |
|----------|---------|
| 组件数量>20个 | 组件量大，需要独立审查和测试阶段 |
| 发现需要API联调 | L1不支持后端集成 |
| 发现需要多端适配 | L1不支持响应式优化 |
| 发现需要性能优化 | L1不支持性能分析 |
| 页面数量实际>5页 | 超出L1覆盖范围 |
| 内建质量检查P0问题>3个 | 问题多，需要独立审查阶段 |

升级时，已完成的设计系统产出可直接复用，从 ui-frontend-orchestrator 开始继续。

## 变更记录

- v2.0: L1/L2模式均增加 project-scaffold 初始化阶段；所有子Skill/编排器传递 project_dir，代码直接写入项目目录
- v1.1: 新增目标语言参数全链路传递；sub-module元数据补全；API契约路径修正
- v1.0: 初始版本，L1/L2分级策略，统一入口自动路由
