---
name: product-launch-orchestrator
description: 当需要从0到1做新产品时使用。产品启动总指挥，协调PM/UI/Backend三大领域子编排器的全流程并行构建与集成。关键词：产品启动、从0到1、新产品、全流程、跨领域、产品上线、做新产品、做系统、做平台、做App、做商城、做SaaS、做交易系统、做电商、做社交平台、做社区、做管理系统、项目从零开始、新项目启动、做小程序、做网站、做应用。
metadata:
  module: "跨领域协调"
  sub-module: "产品启动"
  type: "orchestrator"
  version: "8.0"
  domain_tags: ["电商", "SaaS", "社交", "金融", "教育", "医疗", "物流", "游戏", "工具", "通用"]
  trigger_examples:
    - "我要做一个交易商城系统"
    - "我们想从0到1做一个SaaS产品"
    - "我想做一个社交App"
    - "公司要做一个新平台"
    - "我们要启动一个新项目做在线教育"
    - "帮我做一个电商小程序"
    - "从零开始做一个管理系统"
    - "做一个支付平台"
---

# 产品启动总指挥

## 核心原则

**PRD为契约，并行构建，集成验证，渐进交付**

产品启动的核心挑战不是某个领域的技能缺失，而是三大领域之间的协调：PM的PRD必须同时满足Backend的API设计需求和UI的界面设计需求，Backend的API契约必须与UI的前端联调对齐，任何一方的变更都会波及其他方。本编排器以PRD为核心契约，管理跨领域的数据传递和阶段卡口。

## 执行步骤

1. **PM先行**：先完成探索、战略、设计全流程，产出PRD作为跨领域契约
2. **契约优先**：PRD确认后先由Backend完成统一设计审查并产出OpenAPI契约，再驱动UI集成
3. **集成验证**：前后端开发完成后，通过集成编排器验证联调
4. **渐进交付**：质量验证→灰度发布→全量发布→复盘

## 编排协议

> 协议源头：[orchestrator-protocol.md](../../../templates/orchestrator-protocol.md)（仅供维护者追踪，本文件已内联完整协议内容，可独立使用）

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **双模式调用**：平台支持 Skill 工具时，显式调用子Skill；平台不支持时，按子Skill的 `name`、输入契约、输出契约和阶段卡口执行兼容调度。
2. **不代理扩写**：兼容调度时不得把子Skill内部方法论复制进编排器上下文，也不得改写子Skill逻辑；只传递必要输入、输出路径和验证条件。
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现细节。
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径和 artifact index 传递数据。
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段。
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。
7. **跨子Skill交叉验证**：当多个子Skill的产出之间存在一致性约束时，编排器可在阶段间执行交叉验证（读取多份产出比对一致性），这属于编排器的协调职责而非代理执行子Skill逻辑。交叉验证规则在编排器SKILL.md中显式定义。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/{领域路径}/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段卡口标准

编排器的阶段卡口只校验以下3类条件，不深入子Skill内部字段：

| 卡口类型 | 校验内容 | 示例 |
|----------|----------|------|
| 输出存在性 | 输出文件已生成且非空 | "api-design-spec输出文件已生成" |
| 顶层结构完整性 | JSON顶层必填字段存在 | "prd.json包含features/pages/entities" |
| 人类决策确认 | 关键决策点已获人类确认 | "设计审查人类确认通过" |

### 通用异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板，整体置信度设为0.3，强制人类确认是否继续 |

## Pipeline

```yaml
pipeline: product-launch-orchestrator
version: 8.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/cross-domain/product-launch-orchestrator.md

stages:
  - id: phase-1
    name: "洞察分析"
    depends_on: []
    skills: [insight-orchestrator]
    gate:
      condition: "洞察报告人类确认通过"
      fail_action: "补充产品方向或需求信息"

  - id: phase-2
    name: "市场分析"
    depends_on: [phase-1]
    skills: [market-orchestrator]
    gate:
      condition: "市场分析人类确认通过"
      fail_action: "补充市场数据或竞品信息"

  - id: phase-3
    name: "商业模式"
    depends_on: [phase-1, phase-2]
    skills: [business-orchestrator]
    gate:
      condition: "商业模式人类确认通过"
      fail_action: "补充商业模式要素"

  - id: phase-4
    name: "定位策略"
    depends_on: [phase-3]
    skills: [positioning-orchestrator]
    gate:
      condition: "定位陈述人类确认通过"
      fail_action: "调整定位策略"

  - id: phase-5
    name: "产品设计"
    depends_on: [phase-3, phase-4]
    skills: [design-orchestrator]
    gate:
      condition: "PRD人类确认通过"
      fail_action: "补充需求细节"

  - id: phase-6
    name: "指标体系"
    depends_on: [phase-5]
    parallel_with: [phase-7]
    skills: [metrics-orchestrator]
    gate:
      condition: "指标体系人类确认通过"
      fail_action: "补充指标定义"

  - id: phase-7
    name: "后端全流程"
    depends_on: [phase-5]
    parallel_with: [phase-6]
    skills: [backend-orchestrator]
    gate:
      condition: "后端统一设计审查通过 + OpenAPI契约已生成 + 后端实现审查通过"
      fail_action: "修复后端设计/实现阻断问题"

  - id: phase-8
    name: "UI开发"
    depends_on: [phase-5, phase-7]
    skills: [ui-orchestrator]
    gate:
      condition: "UI开发与集成验证通过"
      fail_action: "修复集成问题"

  - id: phase-9
    name: "集成对齐"
    depends_on: [phase-7, phase-8]
    type: cross-validation
    skills: []
    gate:
      condition: "UI页面数据需求与OpenAPI契约对齐，未覆盖接口=0"
      fail_action: "回退到backend-orchestrator或ui-orchestrator修复契约差异"

  - id: phase-10
    name: "交付上线"
    depends_on: [phase-8, phase-9, phase-6]
    skills: [release-orchestrator, monitoring-orchestrator, iteration-orchestrator, agile-orchestrator]
    gate:
      condition: "P0问题=0，P1问题≤3，灰度发布通过，复盘结论确认"
      fail_action: "修复阻断问题后重新验证"
```

## 阶段执行计划

### 跨领域产物索引

本编排器不要求子Skill把产物写入 `output/cross-domain/{skill-name}/`。所有子Skill仍写入各自领域原生路径；本编排器在 `output/cross-domain/artifact-index.json` 记录阶段、skill、真实输出路径、摘要和验证状态。下方出现的跨领域路径仅表示索引引用，不表示改写子Skill输出目录。

### 阶段1：探索发现

#### 调用 insight-orchestrator

```
Skill: insight-orchestrator
输入:
  用户反馈: 初始用户反馈数据
  市场数据: 市场趋势与规模数据
  竞品信息: 竞品分析资料
输出: output/cross-domain/insight-orchestrator/
验证: 洞察报告人类确认通过
模式: 🤖→👤
```

### 阶段2：市场分析

#### 调用 market-orchestrator

```
Skill: market-orchestrator
输入:
  洞察报告: output/cross-domain/insight-orchestrator/
输出: output/cross-domain/market-orchestrator/
验证: 市场分析人类确认通过
模式: 🤖→👤
```

### 阶段3：商业战略

#### 调用 business-orchestrator

```
Skill: business-orchestrator
输入:
  洞察报告: output/cross-domain/insight-orchestrator/
  市场分析: output/cross-domain/market-orchestrator/
输出: output/cross-domain/business-orchestrator/
验证: 商业模式人类确认通过
模式: 🤖→👤
```

### 阶段4：战略定位

#### 调用 positioning-orchestrator

```
Skill: positioning-orchestrator
输入:
  商业模式: output/cross-domain/business-orchestrator/
输出: output/cross-domain/positioning-orchestrator/
验证: 定位陈述人类确认通过
模式: 🤖→👤
```

### 阶段5：方案设计

#### 调用 design-orchestrator

```
Skill: design-orchestrator
输入:
  定位陈述: output/cross-domain/positioning-orchestrator/
  商业模式: output/cross-domain/business-orchestrator/
输出: output/cross-domain/design-orchestrator/
验证: PRD人类确认通过
模式: 🤖→👤
```

### 阶段6：指标体系（并行分支）

#### 调用 metrics-orchestrator

```
Skill: metrics-orchestrator
输入:
  PRD: output/cross-domain/design-orchestrator/
  商业模式: output/cross-domain/business-orchestrator/
输出: output/cross-domain/metrics-orchestrator/
验证: 指标体系人类确认通过
模式: 🤖→👤
```

### 阶段7：后端全流程（Backend）

#### 调用 backend-orchestrator

```
Skill: backend-orchestrator
输入:
  PRD: artifact-index.json → design-orchestrator → output/pm-design/design-prd/prd.md
  PRD结构化数据: artifact-index.json → design-orchestrator → output/pm-design/design-prd/prd.json
  project_dir: 用户提供
输出: output/backend-architecture/ + output/backend-data-architecture/ + output/backend-api-design/ + output/backend-design-review/
验证: 统一设计审查通过 + OpenAPI契约已生成 + 后端实现审查通过
模式: 🤖→👤
```

### 阶段8：UI开发与集成（并行分支-UI）

#### 调用 ui-orchestrator

```
Skill: ui-orchestrator
输入:
  mode: full（产品启动场景，需求和设计已由上游design-orchestrator确认，跳过探索阶段）
  品牌规范: 品牌规范资料
  产品定位: artifact-index.json → positioning-orchestrator
  目标语言: 用户提供（默认zh-CN）
  project_name: 用户提供
  project_dir: 用户提供
  framework: 用户提供（React/Vue/Svelte/Next.js/Nuxt.js）
  PRD: artifact-index.json → design-orchestrator → output/pm-design/design-prd/
  API契约: artifact-index.json → backend-orchestrator → output/backend-api-design/api-design-spec/openapi.yaml
输出: output/ui-project-init/ + output/ui-frontend/ + output/ui-frontend-integration/ + 代码写入 {project_dir}/
验证: UI开发与集成验证通过 + 项目可运行（npm run dev成功）+ 项目构建成功（npm run build成功）
模式: 🤖→👤
```

### 阶段9：集成对齐

编排器读取 `artifact-index.json` 中的 UI 页面数据需求与 Backend OpenAPI 契约，执行跨领域对齐检查：

```
动作: UI/API契约对齐检查
输入:
  UI页面数据需求: artifact-index.json → ui-orchestrator → output/ui-frontend/page-builder/pages.json
  OpenAPI契约: artifact-index.json → backend-orchestrator → output/backend-api-design/api-design-spec/openapi.yaml
输出: output/cross-domain/integration-alignment.json
验证: UI页面数据需求与OpenAPI契约对齐，未覆盖接口=0
模式: 🤖→👤
```

### 阶段10：质量→发布→复盘

#### 调用 release-orchestrator

```
Skill: release-orchestrator
输入:
  后端输出: artifact-index.json → backend-orchestrator
  UI输出: artifact-index.json → ui-orchestrator
  指标体系: artifact-index.json → metrics-orchestrator
输出: output/pm-monitoring/release-orchestrator/
验证: P0问题=0，灰度发布通过
模式: 🤖→👤
```

#### 调用 monitoring-orchestrator

```
Skill: monitoring-orchestrator
输入:
  集成输出: output/cross-domain/ui-orchestrator/
  指标体系: output/cross-domain/metrics-orchestrator/
输出: output/cross-domain/monitoring-orchestrator/
验证: P0问题=0，P1问题≤3
模式: 🤖→👤
```

#### 调用 iteration-orchestrator

```
Skill: iteration-orchestrator
输入:
  质量报告: output/cross-domain/monitoring-orchestrator/
  集成输出: output/cross-domain/ui-orchestrator/
输出: output/cross-domain/iteration-orchestrator/
验证: 灰度发布通过
模式: 🤖→👤
```

#### 调用 agile-orchestrator

```
Skill: agile-orchestrator
输入:
  发布产物: output/cross-domain/iteration-orchestrator/
  指标体系: output/cross-domain/metrics-orchestrator/
输出: output/cross-domain/agile-orchestrator/
验证: 复盘结论确认
模式: 🤖→👤
```

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 需要用户研究支撑 | → user-research-orchestrator（在insight-orchestrator之前执行） |
| 需要机会验证 | → opportunity-orchestrator（在business-orchestrator之前执行） |
| 需要验证假设 | → validation-orchestrator（在design-orchestrator之后执行） |
| 需要项目管理支撑 | → project-planning-orchestrator（贯穿全程） |

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/cross-domain/product-launch-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/cross-domain/ |
| 总结输出路径 | output/phase-reports/cross-domain/product-launch-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: product-iteration-orchestrator（产品上线后进入迭代优化循环）
  alternatives:
    - target: growth-orchestrator
      reason: 产品已验证PMF，启动规模化增长
      condition: 产品已验证产品-市场匹配，需要规模化增长时
    - target: monitoring-orchestrator
      reason: 持续监控产品运行指标
      condition: 需要独立建立长期监控体系时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| PM设计完成 | PRD已生成且人类确认通过 | 补充产品方向或需求信息 |
| 并行构建就绪 | API契约人类确认 + UI开发确认通过 | 延迟启动受影响的分支 |
| 后端与UI均就绪 | 后端与UI输出文件已生成且非空 | 等待滞后方完成 |
| 质量门禁通过 | 质量验收输出文件已生成且非空 | 修复阻断问题后重新验证 |
| 阶段总结已生成 | output/phase-reports/cross-domain/product-launch-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| PRD确认 | design-orchestrator完成 | 确认PRD可分发到Backend和UI |
| API契约确认 | api-design-orchestrator完成 | 确认API契约可交付前端 |
| UI开发确认 | ui-orchestrator完成 | 确认UI开发与集成验证通过 |
| 前后端冲突裁决 | API契约与前端需求冲突 | 决策API侧改还是前端侧改 |
| 发布决策 | iteration-orchestrator灰度完成 | 确认是否全量发布 |
| 复盘确认 | agile-orchestrator完成 | 确认复盘结论和行动项 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD频繁变更 | 锁定PRD版本，变更走变更审批流程，受影响领域暂停 |
| API契约与前端需求冲突 | 暂停双方，人类裁决，胜出方更新输出 |
| 设计令牌与组件库不兼容 | 优先调整组件库适配令牌，令牌为权威源 |
| 后端开发进度落后于前端 | 前端使用Mock数据继续开发，标注"待联调" |
| 前端开发进度落后于后端 | 后端先自测API，提供Postman集合给前端 |
| 集成测试环境不可用 | 降级为本地联调验证，标注"集成环境待验证" |
| 并行构建某分支失败 | 不阻塞另一分支，失败分支修复后单独进入集成 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
