# UI设计与前端开发 AI Agent Skills 全集

## 这是什么

将UI设计与前端开发的完整流程闭环提取为 5 个 AI Agent Skill（1个编排器 + 4个Pipeline），兼容 Trae / Claude Code 的 Agent Skills 开放标准。每个 Skill 是一个可独立执行的方法论 Pipeline，编排器负责按需调度子 Skill 的执行顺序，无需求则跳过。实现"设计即实现，实现即设计"的UI与前端一体化工作流。

## 快速开始

### 统一入口

**推荐使用 `ui-orchestrator` 作为统一入口**，它会根据项目需求按需调度各 Pipeline Skill，无需求的阶段自动跳过：

```
Skill: ui-orchestrator
```

也可以直接调用单个 Pipeline Skill，适用于特定阶段的需求。

### 按需跳过策略

取代原有的 L1/L2 分级模式，改为按需跳过：编排器根据项目实际需求判断每个阶段是否执行，无需求则跳过，不浪费流程步骤。

| 策略 | 说明 |
|------|------|
| **按需跳过** | 编排器根据项目需求自动判断每个 Pipeline 是否需要执行 |
| **质量不跳过** | 跳过的是流程步骤，不是质量标准；已执行的阶段内建完整质量门禁 |
| **随时可补** | 跳过的阶段可在后续按需单独调用对应 Pipeline 补充 |

**核心承诺：按需跳过精简的是流程长度，不是产出质量。** 已执行阶段的产出质量始终一致。

| 质量维度 | 保障方式 |
|----------|---------|
| WCAG对比度 | project-init / page-builder 内建校验 |
| Token引用率 | page-builder 内建检查 |
| 组件可访问性 | page-builder 内建ARIA |
| 状态机完整性 | page-builder 内建校验 |
| 视觉节奏遵循 | page-builder 美学验证检查 |
| visual_direction一致性 | page-builder 美学验证检查 |
| 品牌色占比 | page-builder 美学验证检查 |
| 排版层级跳跃 | page-builder 美学验证检查 |
| 留白节奏 | page-builder 美学验证检查 |
| 设计品味 | page-builder 统一评分体系（audit×0.5+critique×0.5） |
| PM约束偏离 | page-builder design_decisions 4级记录 |
| 设计自由度 | ui-orchestrator Stage 1 条件分支（设计探索）+ constraint_review |
| visual_bans合规 | express模式增强质量检查（检查代码是否包含visual_bans中的模式） |
| 设计锚点一致性 | express模式增强质量检查（检查色彩/排版是否与锚点方向一致） |
| 质量债务 | page-builder + stage-4 quality_debt.json 追踪 |
| 单元测试 | production-ready 覆盖 |
| E2E测试 | production-ready 覆盖 |
| API联调 | api-integration 覆盖 |
| 性能优化 | production-ready 覆盖 |

### 部署方式

本目录的模块结构（`ui-0X-xxx/`）仅用于**人工浏览和管理**。Trae 按**单个 SKILL.md** 递归扫描识别 Skill，`name` 字段必须匹配直接父目录名。

实际使用时，需将所有最小 Skill 单元**扁平化**放入 `.trae/skills/` 下：

```
# 部署到 Trae 时的结构（扁平化，机器识别用）
.trae/skills/
├── 核心自建 Skill
│   ├── ui-orchestrator/SKILL.md                  ← 统一入口
│   ├── project-init/SKILL.md
│   ├── page-builder/SKILL.md
│   ├── api-integration/SKILL.md
│   └── production-ready/SKILL.md
│
└── 外部 Skill（ext- 前缀，按需部署）
    ├── ext-frontend-design/SKILL.md
    ├── ext-impeccable/SKILL.md
    ├── ext-interaction-design/SKILL.md
    └── ext-ui-ux-pro-max/SKILL.md
```

### 部署步骤

1. **核心部署**：将所有 `{skill-name}/` 文件夹复制到 `.trae/skills/` 下，扁平平铺
2. **扩展部署**：从 `extensions/` 目录获取外部 Skill，同样扁平平铺到 `.trae/skills/`
3. **按需部署**：只复制当前项目阶段需要的 Skill 文件夹
4. **触发使用**：在对话中描述需求，AI 自动匹配对应 Skill

> ⚠️ 部署时只需复制最内层的 `{skill-name}/` 文件夹（含 SKILL.md），不需要保留外层的 `ui-0X-xxx/` 目录结构。

## 目录结构

```
ui-skill/
├── orchestrators/                  顶层编排器（统一入口）
│   └── ui-orchestrator/            UI总指挥（按需跳过路由）
├── ui-01-design-system/            模块1：设计系统（脚手架+设计系统+视觉风格）
│   └── project-init/               项目初始化一体化（脚手架+设计令牌+视觉风格+文档）
├── ui-02-ui-frontend/              模块2：UI前端（组件+页面+审查，设计即实现）
│   └── page-builder/               页面构建一体化（组件生成+页面组装+视觉节奏+质量门禁）
├── ui-03-frontend-integration/     模块3：前端集成（API联调+生产就绪）
│   ├── api-integration/            API契约消费一体化（类型/Mock/Hook）
│   └── production-ready/           生产就绪一体化（测试+构建部署+性能优化）
└── extensions/                     外部 Skill 适配层（按需获取，ext- 前缀）
    └── README.md
```

## 模块流程顺序

### 精简流程（按需跳过）

```
project-init → page-builder → api-integration → production-ready
     │              │               │                  │
     │              │               │                  └── 测试+构建+性能，上线保障
     │              │               └── 契约驱动联调，Mock先行
     │              └── 设计简报驱动，组件+页面+审查，视觉节奏，内建质量门禁
     └── 脚手架+设计系统+视觉风格+PRODUCT.md+DESIGN.md

ui-orchestrator（四种执行模式）
     │
     ├─ express: 生成轻量设计锚点 → 设计方向快选(2-3套) → 结构化prompt → ext Skill生成 → 增强质量检查 → 输出
     │    └─ 适用：单页面/落地页/快速原型/概念验证
     │    └─ 放弃：设计系统一致性、令牌驱动、组件库集成、质量债务追踪、PM↔UI反馈闭环
     │    └─ 新增(v7.3)：设计方向快选(2-3套差异化方向供用户选择) + 结构化prompt生成
     │
     ├─ prototype: project-init → prototype输出（视觉方向+约束审查，无页面代码）
     │    └─ 适用：需求验证、多方案对比、交互逻辑对齐
     │    └─ 放弃：页面代码、ext增强、质量审计、API集成、生产就绪
     │
     ├─ full: project-init（必经） → page-builder（必经） → api-integration（按需） → production-ready（按需）
     │    └─ 条件分支A: 设计探索（mode=progressive）
     │    └─ 条件分支B: PM约束审查（有PM输入时）
     │    └─ 新增(v7.2)：强制视觉审查(stage-3后) + visual_direction一致性校验(stage-1)
     │
     ├─ progressive: project-init（含设计探索） → page-builder → api-integration → production-ready
     │    └─ 设计探索阶段生成2-3个视觉方向候选，人类选择后进入约束对齐
```

**Pipeline 阶段精简**（v7.0）：9阶段 → 4+2阶段
- Stage 0/0.5/1.5 → 合并为 Stage 1 条件分支
- Stage 4+5 → 合并为"增强+审计一体化"
- Stage 7+8 → 合并为 Stage 6
- Stage 4 的 ext-frontend-design → 移除（Stage 2 已调用）

## Skill 类型

| 类型 | 数量 | 作用 | 使用方式 |
|------|------|------|----------|
| 顶层编排器 | 1 | 统一入口，按需跳过路由 | `Skill: ui-orchestrator` |
| Pipeline Skill | 4 | 单个方法论 Pipeline，可独立执行 | 按需单独调用 |
| 外部 Extension | 4 | 增强核心 Skill 的专业能力 | 定向调用，未安装自动降级 |

## 模块详解

### 模块1：项目初始化（project-init）

UI与前端一体化流程的起点。合并原 project-scaffold 与 design-system，一步完成项目脚手架搭建、设计系统建立和视觉风格定义。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| project-init | 初始化项目骨架+设计系统+视觉风格，生成PRODUCT.md和DESIGN.md | 项目名称、框架、品牌规范、产品定位、项目目录、PRD(可选)、handoff-spec(可选) | project-init.json（含visual_direction/tokens/component_library/scaffold）+ PRODUCT.md + DESIGN.md + 可运行项目 | 🤖→👤 |

**新增能力**：
- 视觉风格定义步骤：从品牌基因推导差异化美学方向
- `ext-frontend-design` 必调：确保视觉差异化，避免AI同质化
- `PRODUCT.md` 生成：产品定义文档，供下游 Skill 消费
- `DESIGN.md` 生成：设计决策文档，记录视觉风格和设计令牌依据
- `anchor_overrides`：页面级视觉锚点覆盖机制，允许特定页面打破全局视觉锚点
- 语义一致性校验：visual_direction 6条维度间逻辑约束自动校验

**阶段卡口**：
- visual_direction 10维度均有明确定义
- ext-frontend-design 已调用且输出不含AI同质化特征
- PRODUCT.md 和 DESIGN.md 已生成且内容非占位符
- WCAG AA对比度100%达标
- 令牌文件已写入项目目录
- npm run dev 启动成功
- 进入页面构建前：设计令牌人类已确认，视觉风格人类已确认

**人类决策点**：品牌色确认、视觉风格方向确认、组件库选择、令牌命名规范

**外部扩展**：`ext-frontend-design`（必调，视觉差异化）、`ext-impeccable`（colorize/typeset/extract）、`ext-ui-ux-pro-max`（数据驱动设计推荐）

### 模块2：页面构建（page-builder）

UI与前端一体化的核心模块。合并原 ui-component-gen、page-assembly 与 ui-review，将设计系统一步到位转化为带样式、交互和质量保障的前端组件与页面。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| page-builder | 基于设计系统生成组件+组装页面+视觉节奏设计+内建质量审查 | 组件意图、页面需求、设计令牌、组件库、PRD(可选)、路由结构(可选)、原型规格(可选)、userflow(可选)、interaction-spec(可选) | pages.json（含pages/components/quality_report/visual_direction）+ 组件代码 + 页面代码 | 🤖→👤 |

**新增能力**：
- 视觉节奏设计：在页面组装阶段引入视觉节奏规划，确保页面层次感和信息引导
- 内建质量门禁：将原 ui-review 的审查能力内建到组件生成和页面组装流程中，不通过不放过
- 设计简报驱动模式：消费 design_brief.json（由编排器在 Stage 2 生成），ext Skill 产出从"建议"转化为"可执行设计规范"，page-builder 直接消费
- PM约束偏离记录（design_decisions）：4级严重度（minor/moderate/major/critical），记录设计自由度偏离
- UI→PM反向反馈通道（design_feedback.json）：双向反馈闭环，设计侧可反向约束PM产出
- 统一评分体系：audit(20→100, ×5) + critique(40→100, ×2.5)，综合=audit×0.5+critique×0.5
- 质量债务追踪（quality_debt.json）：降级问题统一追踪，供下游 production-ready 消费

**阶段卡口**：
- Design Token引用率100%
- 状态机无死锁
- 组件树层级≤4层
- P0问题=0
- 美学验证通过 + 综合质量评分（audit×0.5+critique×0.5）≥75分
- design_decisions 无 critical 级偏离未记录
- 进入API集成前：P0问题全部修复

**人类决策点**：页面布局确认、组件方案确认（含交互行为）、P1问题处理

**外部扩展**：`ext-interaction-design`（交互动效模式）、`ext-impeccable`（shape/animate/bolder/quieter/delight/harden/polish/layout/adapt/clarify/onboard/distill/audit/critique）、`ext-frontend-design`（组件视觉差异化）、`ext-ui-ux-pro-max`（落地页/仪表盘数据推荐）

### 模块3：API集成（api-integration）

前后端联调的桥梁。基于API契约生成前端请求层，Mock先行，后端未就绪不阻塞前端开发。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| api-integration | 基于OpenAPI生成前端请求层、类型定义、Mock数据和Hook | API契约文档、页面数据需求 | 请求代码+类型+Mock | 🤖→👤 |

**阶段卡口**：
- 100%接口有类型定义+Mock数据
- 类型安全100%覆盖

**人类决策点**：API契约确认

### 模块4：生产就绪（production-ready）

上线的最后保障。合并原 frontend-test、frontend-build-deploy 与 frontend-performance，从测试到构建到性能一步到位。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| production-ready | 自动生成测试+构建配置+性能优化，确保产品可上线 | 项目信息、部署目标、性能数据 | 测试代码+覆盖率报告+构建配置+CI/CD+优化方案 | 🤖 |

**阶段卡口**：
- 核心用户流程E2E测试100%通过
- 构建成功
- LCP≤2.5s，首屏JS≤200KB
- P0性能问题=0

**人类决策点**：部署目标选择、性能预算调整

## 输出路径

Skill 执行结果采用**双输出模式**：

1. **代码文件** → 直接写入用户指定的 `{project_dir}/` 项目目录，`npm run dev` 可立即运行
2. **元数据文件** → 写入 `output/` 目录，供下游 Skill 消费

```
用户项目/
├── src/                              ← 代码文件（可直接运行）
│   ├── components/                   ← page-builder 写入
│   ├── pages/                        ← page-builder 写入
│   ├── api/                          ← api-integration 写入
│   ├── styles/tokens.css             ← project-init 写入
│   └── tests/                        ← production-ready 写入
├── PRODUCT.md                        ← project-init 写入
├── DESIGN.md                         ← project-init 写入
└── output/                           ← 元数据文件（供下游 Skill 消费）
    ├── ui-project-init/
    │   └── project-init/
    ├── ui-frontend/
    │   └── page-builder/
    └── ui-frontend-integration/
        ├── api-integration/
        └── production-ready/
```

output 跟着用户项目走，不跟着 Skill 定义目录走。多项目时各项目产出互不干扰。代码文件直接写入项目目录，每个 Skill 执行后 `npm run dev` 可验证最新产出。

## AI 能力边界

- ✅ 能做：读取本地文件、分析粘贴文本、处理上传文件、生成结构化报告、逻辑推导
- ❌ 不能做：访问外部数据库、调用业务 API、获取实时数据、操作外部系统、执行代码

需要外部数据时，用户需通过粘贴 / 上传 / 提供路径三种方式提供。

## 根据场景选择入口

| 你的场景 | 推荐入口 |
|----------|----------|
| 从零开始，不确定复杂度 | `ui-orchestrator`（按需跳过） |
| 简单项目（落地页/内部工具） | `ui-orchestrator`（跳过API集成和生产就绪） |
| 复杂项目（SaaS/电商/Dashboard） | `ui-orchestrator`（全流程执行） |
| 已有项目，需要生成页面 | `page-builder` |
| 需要与后端API联调 | `api-integration` |
| 需要配置测试和构建部署 | `production-ready` |
| 品牌升级，更新设计令牌 | `project-init` |
| 只需要初始化项目骨架 | `project-init` |

## 人类与 AI 分工

- 🤖 AI 自动执行：文档生成、代码生成、审查检查、测试生成、性能分析
- 🤖→👤 AI 建议人类审批：设计令牌确认、视觉风格确认、组件方案确认（含交互行为）、页面布局确认
- 👤→🤖 人类执行 AI 辅助：品牌规范提供、意图描述、部署目标选择
- 👤 人类执行：品牌色确认、最终视觉决策、性能预算阈值确认

编排器的按需跳过策略和内建质量门禁确保关键决策由人类把控，流程步骤按需精简。

## 外部 Skill 扩展

核心 Skill 通过 `Skill: ext-xxx` 定向调用外部 Skill，未安装时按分类执行降级策略：**核心增强类**（ext-frontend-design、ext-ui-ux-pro-max）失败阻断下游阶段；**可选增强类**（ext-impeccable 子命令、ext-interaction-design）失败标注不阻断。

> **命名规范**：外部 Skill 统一使用 `ext-` 前缀（如 `ext-frontend-design`），与核心自建 Skill 区分。部署到 `.trae/skills/` 下扁平平铺即可。详见 [extensions/README.md](extensions/README.md)。

| 外部 Skill 名称 | 增强能力 | 所属模块 | 调用时机 | 输入 | 输出 |
|----------------|---------|---------|---------|------|------|
| `ext-frontend-design` | 视觉差异化（避免AI同质化） | project-init / page-builder | project-init 必调 / page-builder 按需 | 品牌规范+产品定位 | 差异化美学方向建议 |
| `ext-impeccable` | 设计质量全生命周期（20+子命令） | project-init / page-builder / production-ready | 各步骤按客观触发条件调用 | 组件/页面代码+设计令牌 | 增强后的代码+审计报告 |
| `ext-interaction-design` | 交互动效模式库 | page-builder | page-builder 组件生成阶段 | 组件交互需求 | 交互动效代码模式 |
| `ext-ui-ux-pro-max` | 数据驱动设计决策 | project-init / page-builder | project-init 视觉风格阶段 / page-builder 页面组装阶段 | 设计系统/页面类型 | 数据驱动设计推荐 |

## 核心信念

- **按需跳过不降质**：跳过的是流程步骤，不是产出质量
- **令牌驱动一切**：硬编码是技术债，所有视觉属性从令牌推导
- **设计即实现**：UI与前端一体化，设计意图一步到位转化为代码
- **设计简报驱动**：ext Skill 产出从"建议"转化为"可执行规范"，消除建议-执行断裂
- **双向反馈闭环**：UI→PM 反向反馈通道，设计侧可约束PM产出
- **可访问性默认内建**：不是事后补丁，是默认项
- **质量门禁内建**：不通过不放过，P0问题阻塞发布
- **契约驱动联调**：Mock先行，后端未就绪不阻塞前端开发
- **性能预算卡口**：写入CI，超标自动拦截
- **核心精简+外部扩展**：核心流程不拉长，专业能力按需接入
- **代码即产出**：代码直接写入可运行项目，不浪费生成结果

## 版本兼容性协议

各 Skill 独立版本化，上下游 Skill 之间通过输出 Schema 契约耦合。版本变更时遵循以下规则：

### 版本号规则

格式：`MAJOR.MINOR`（无 PATCH，因为 Skill 是方法论而非代码库）

| 变更类型 | 版本变更 | 示例 |
|----------|---------|------|
| 输出 Schema 新增字段（向后兼容） | MINOR+1 | project-init 1.2→1.3 |
| 输出 Schema 删除/重命名字段（破坏兼容） | MAJOR+1 | project-init 1.x→2.0 |
| 输入新增可选字段 | MINOR+1 | page-builder 1.2→1.3 |
| 输入新增必填字段 | MAJOR+1 | page-builder 1.x→2.0 |
| 内部逻辑调整（不影响契约） | 不变 | — |

### 兼容性检查

编排器在调用子 Skill 前应检查版本兼容性：

| 上游 Skill 版本 | 下游 Skill 版本 | 兼容性 |
|----------------|----------------|--------|
| 同 MAJOR | 同或更高 MINOR | ✅ 兼容 |
| 同 MAJOR | 更低 MINOR | ⚠️ 可能缺失新字段，下游应有降级策略 |
| 不同 MAJOR | 任意 | ❌ 不兼容，需人工确认 |

### 当前版本矩阵

| Skill | 版本 | 输出 Schema 版本 |
|-------|------|----------------|
| ui-orchestrator | 7.3 | — |
| project-init | 1.7 | visual_direction v1.2（含 anchor_overrides + 语义一致性校验） |
| page-builder | 2.0 | pages.json v2.0（含 design_brief 消费 + design_decisions + design_feedback） |
| api-integration | 2.0 | api-integration.json v1.0 |
| production-ready | 1.3 | production-ready.json v1.0 |
