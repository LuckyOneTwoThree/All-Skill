# UI设计与前端开发 AI Agent Skills 全集

## 这是什么

将UI设计与前端开发的完整流程闭环提取为 12 个 AI Agent Skill（4个编排器 + 8个Pipeline），兼容 Trae / Claude Code 的 Agent Skills 开放标准。每个 Skill 是一个可独立执行的方法论 Pipeline，编排器负责调度子 Skill 的执行顺序。实现"设计即实现，实现即设计"的UI与前端一体化工作流。

## 快速开始

### 统一入口

**推荐使用 `ui-orchestrator` 作为统一入口**，它会根据项目复杂度自动选择 L1 快速模式或 L2 完整模式：

```
Skill: ui-orchestrator
```

也可以直接调用子编排器或单个 Skill，适用于特定阶段的需求。

### 设计分级策略

| 级别 | 适用场景 | 调用方式 | 流程长度 |
|------|---------|---------|---------|
| **L1 快速模式** | 落地页、简单表单、内部工具、原型验证（≤5页，无后端集成） | `ui-orchestrator` 自动路由 | 2 个 Skill |
| **L2 完整模式** | SaaS产品、电商平台、复杂Dashboard（>5页，需API联调） | `ui-orchestrator` 自动路由 | 3 个子编排器，8 个 Skill |

**核心承诺：L1 精简的是流程长度，不是产出质量。** L1 在覆盖范围内（设计系统+组件+页面）的产出质量与 L2 一致。

| 质量维度 | L1 快速模式 | L2 完整模式 | 对齐方式 |
|----------|-----------|-----------|---------|
| WCAG对比度 | design-system 内建校验 | design-system 内建校验 | ✅ 同源 |
| Token引用率 | ui-component-gen 内建检查 | ui-review 独立审查 | 标准一致 |
| 组件可访问性 | ui-component-gen 内建ARIA | ui-review 独立审查 | 标准一致 |
| 状态机完整性 | ui-component-gen 内建校验 | ui-review 独立审查 | 标准一致 |
| 单元测试 | 基础骨架 | 完整覆盖 | L1仅骨架 |
| E2E测试 | 不生成 | 完整覆盖 | L1标注"待补充" |
| API联调 | 不涉及 | 完整覆盖 | L1无此需求 |
| 性能优化 | 不涉及 | 完整覆盖 | L1无此需求 |

### 部署方式

本目录的嵌套结构（`ui-0X-xxx/orchestrators|skills/`）仅用于**人工浏览和管理**。Trae 按**单个 SKILL.md** 递归扫描识别 Skill，`name` 字段必须匹配直接父目录名。

实际使用时，需将所有最小 Skill 单元**扁平化**放入 `.trae/skills/` 下：

```
# 部署到 Trae 时的结构（扁平化，机器识别用）
.trae/skills/
├── 核心自建 Skill
│   ├── ui-orchestrator/SKILL.md                  ← 统一入口
│   ├── design-system-orchestrator/SKILL.md
│   ├── design-system/SKILL.md
│   ├── ui-frontend-orchestrator/SKILL.md
│   ├── ui-component-gen/SKILL.md
│   ├── page-assembly/SKILL.md
│   ├── ui-review/SKILL.md
│   ├── frontend-test/SKILL.md
│   ├── frontend-integration-orchestrator/SKILL.md
│   ├── api-contract-consume/SKILL.md
│   ├── frontend-build-deploy/SKILL.md
│   └── frontend-performance/SKILL.md
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

> ⚠️ 部署时只需复制最内层的 `{skill-name}/` 文件夹（含 SKILL.md），不需要保留外层的 `ui-0X-xxx/`、`orchestrators/`、`skills/` 目录结构。

## 目录结构

```
ui-skill/
├── orchestrators/                  顶层编排器（统一入口）
│   └── ui-orchestrator/            UI总指挥（L1/L2分级自动路由）
├── ui-01-design-system/            模块1：UI设计系统（令牌驱动，一致性释放创造力）
│   ├── orchestrators/
│   │   └── design-system-orchestrator/    设计系统建立指挥官
│   └── skills/
│       └── design-system/                 设计系统一体化生成（令牌+组件库+文档）
├── ui-02-ui-frontend/              模块2：UI前端生成（设计即实现，实现即设计）
│   ├── orchestrators/
│   │   └── ui-frontend-orchestrator/      UI前端生成指挥官
│   └── skills/
│       ├── ui-component-gen/              UI组件生成（含交互设计，React/Vue/Svelte）
│       ├── page-assembly/                 页面组装（路由/状态管理/数据流）
│       ├── ui-review/                     UI审查（规范/无障碍/交互/响应式）
│       └── frontend-test/                 前端测试（单元/E2E/无障碍）
├── ui-03-frontend-integration/     模块3：前端集成（契约驱动联调，自动化保障上线）
│   ├── orchestrators/
│   │   └── frontend-integration-orchestrator/  前端集成指挥官
│   └── skills/
│       ├── api-contract-consume/               API契约消费（类型/Mock/Hook）
│       ├── frontend-build-deploy/              构建部署（CI/CD/CDN/环境管理）
│       └── frontend-performance/               性能优化（包体积/加载/渲染）
└── extensions/                     外部 Skill 适配层（按需获取，ext- 前缀）
    └── README.md
```

## 模块流程顺序

### L1 快速模式（2步）

```
design-system → ui-component-gen（含页面组装+内置质量检查）
```

### L2 完整模式（8步）

```
UI设计系统 → UI前端生成 → 前端集成
     │             │             │
     │             │             └── 契约驱动联调，性能预算卡口
     │             └── 组件先行（含交互），审查闭环，测试保障
     └── 令牌驱动一切，原子到组织，文档同步

design-system
      ↓
ui-component-gen → page-assembly → ui-review → frontend-test
      ↓
api-contract-consume → frontend-build-deploy → frontend-performance
```

## Skill 类型

| 类型 | 数量 | 作用 | 使用方式 |
|------|------|------|----------|
| 顶层编排器 | 1 | 统一入口，L1/L2分级自动路由 | `Skill: ui-orchestrator` |
| 子编排器 | 3 | 调度子 Skill 的执行顺序和阶段卡口 | 按子模块流程使用 |
| Pipeline Skill | 8 | 单个方法论 Pipeline，可独立执行 | 按需单独调用 |
| 外部 Extension | 4 | 增强核心 Skill 的专业能力 | 定向调用，未安装自动降级 |

## 模块详解

### 模块1：UI设计系统

UI与前端一体化流程的起点。在需要建立设计系统或统一视觉规范时使用，从品牌基因推导设计变量，建立令牌驱动的组件化设计系统。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| design-system | 从品牌规范推导设计令牌，按原子设计规划组件库，同步生成文档 | 品牌规范、产品定位、目标平台 | design-system.json | 🤖→👤 |

**阶段卡口**：
- WCAG AA对比度100%达标
- 组件依赖图无循环
- 100%组件有文档
- 进入UI前端生成前：设计令牌人类已确认，组件层级划分人类已确认

**人类决策点**：品牌色确认、组件层级划分、令牌命名规范

**外部扩展**：`ext-frontend-design`（视觉差异化）、`ext-impeccable`（colorize/typeset/extract）、`ext-ui-ux-pro-max`（数据驱动设计推荐）

### 模块2：UI前端生成

UI与前端一体化的核心模块。将设计系统转化为可运行的前端代码，通过AI将设计意图一步到位地转化为带样式和交互的前端组件与页面。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| ui-component-gen | 基于设计系统生成带样式和交互的前端组件代码（含状态机和动画） | 组件意图、设计令牌、组件库 | 组件代码+Story+测试 | 🤖→👤 |
| page-assembly | 将组件组装为完整页面，配置路由、状态管理和数据流 | 页面需求、组件库、设计令牌 | 页面代码+路由配置 | 🤖→👤 |
| ui-review | 自动审查视觉还原度、无障碍合规、交互完整性和响应式适配 | 组件代码、页面代码、设计令牌 | 问题清单+修复建议 | 🤖 |
| frontend-test | 自动生成组件测试、E2E测试和无障碍测试 | 组件代码、页面代码 | 测试代码+覆盖率报告 | 🤖 |

**阶段卡口**：
- 进入页面组装前：Design Token引用率100%，状态机无死锁
- 进入UI审查前：组件树层级≤4层
- 进入前端测试前：P0问题=0
- 进入前端集成前：核心流程E2E测试100%通过，UI审查P0问题全部修复

**人类决策点**：组件方案确认（含交互行为）、页面布局确认、UI审查P1问题处理、测试策略确认

**外部扩展**：`ext-interaction-design`（交互动效模式）、`ext-impeccable`（shape/animate/bolder/quieter/delight/harden/polish/layout/adapt/clarify/onboard/distill/audit/critique）、`ext-frontend-design`（组件视觉差异化）、`ext-ui-ux-pro-max`（落地页/仪表盘数据推荐）

### 模块3：前端集成

前后端联调与上线的桥梁。将前端代码与后端API对接，完成构建部署和性能优化，确保产品可上线。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| api-contract-consume | 基于OpenAPI生成前端请求层、类型定义、Mock数据和Hook | API契约文档、页面数据需求 | 请求代码+类型+Mock | 🤖 |
| frontend-build-deploy | 生成构建配置、环境管理、CDN策略和CI/CD流水线 | 项目信息、部署目标 | 构建配置+CI/CD | 🤖 |
| frontend-performance | 分析性能瓶颈，生成包体积/加载/渲染优化方案 | 前端代码、构建产物、性能数据 | 优化方案+性能预算 | 🤖 |

**阶段卡口**：
- 进入构建部署前：100%接口有类型定义+Mock数据
- 进入性能优化前：构建成功+CI流水线通过
- 上线前：LCP≤2.5s，首屏JS≤200KB，P0性能问题=0

**人类决策点**：API契约确认、部署目标选择、性能预算调整

## 输出路径

Skill 执行结果写入**用户项目根目录**的 `output/` 下：

```
用户项目/
└── output/
    ├── ui-design-system/
    │   └── design-system/
    ├── ui-frontend/
    │   ├── ui-component-gen/
    │   ├── page-assembly/
    │   ├── ui-review/
    │   └── frontend-test/
    └── ui-frontend-integration/
        ├── api-contract-consume/
        ├── frontend-build-deploy/
        └── frontend-performance/
```

output 跟着用户项目走，不跟着 Skill 定义目录走。多项目时各项目产出互不干扰。

## AI 能力边界

- ✅ 能做：读取本地文件、分析粘贴文本、处理上传文件、生成结构化报告、逻辑推导
- ❌ 不能做：访问外部数据库、调用业务 API、获取实时数据、操作外部系统、执行代码

需要外部数据时，用户需通过粘贴 / 上传 / 提供路径三种方式提供。

## 根据场景选择入口

| 你的场景 | 推荐入口 |
|----------|----------|
| 从零开始，不确定复杂度 | `ui-orchestrator`（自动分级） |
| 简单项目（落地页/内部工具） | `ui-orchestrator`（L1快速模式） |
| 复杂项目（SaaS/电商/Dashboard） | `ui-orchestrator`（L2完整模式） |
| 只需要建立设计系统 | `design-system-orchestrator` |
| 已有设计系统，需要生成前端代码 | `ui-frontend-orchestrator` |
| 需要生成特定组件 | `ui-component-gen` |
| 需要与后端API联调 | `api-contract-consume` |
| 需要配置构建部署 | `frontend-build-deploy` |
| 前端性能不达标 | `frontend-performance` |
| UI质量审查 | `ui-review` |
| 品牌升级，更新设计令牌 | `design-system` |

## 人类与 AI 分工

- 🤖 AI 自动执行：文档生成、代码生成、审查检查、测试生成、性能分析
- 🤖→👤 AI 建议人类审批：设计令牌确认、组件方案确认（含交互行为）、页面布局确认、分级确认
- 👤→🤖 人类执行 AI 辅助：品牌规范提供、意图描述、部署目标选择
- 👤 人类执行：品牌色确认、最终视觉决策、性能预算阈值确认

所有编排器的阶段卡口和人类决策点确保关键决策由人类把控。

## 外部 Skill 扩展

核心 Skill 通过 `Skill: ext-xxx` 定向调用外部 Skill，未安装时自动降级不阻塞流程。

> **命名规范**：外部 Skill 统一使用 `ext-` 前缀（如 `ext-frontend-design`），与核心自建 Skill 区分。部署到 `.trae/skills/` 下扁平平铺即可。详见 [extensions/README.md](extensions/README.md)。

| 外部 Skill 名称 | 增强能力 | 所属模块 | 调用时机 | 输入 | 输出 |
|----------------|---------|---------|---------|------|------|
| `ext-frontend-design` | 视觉差异化（避免AI同质化） | ui-01/ui-02 | design-system Step 1 / ui-component-gen Step 4 | 品牌规范+产品定位 | 差异化美学方向建议 |
| `ext-impeccable` | 设计质量全生命周期（20+子命令） | ui-01/ui-02/ui-03 | 各步骤按客观触发条件调用 | 组件/页面代码+设计令牌 | 增强后的代码+审计报告 |
| `ext-interaction-design` | 交互动效模式库 | ui-02 | ui-component-gen Step 4 | 组件交互需求 | 交互动效代码模式 |
| `ext-ui-ux-pro-max` | 数据驱动设计决策 | ui-01/ui-02 | design-system Step 1 / page-assembly Step 1 | 设计系统/页面类型 | 数据驱动设计推荐 |

## 核心信念

- **分级不降质**：L1精简的是流程长度，不是产出质量
- **令牌驱动一切**：硬编码是技术债，所有视觉属性从令牌推导
- **设计即实现**：UI与前端一体化，设计意图一步到位转化为代码
- **可访问性默认内建**：不是事后补丁，是默认项
- **审查闭环**：不通过不放过，P0问题阻塞发布
- **契约驱动联调**：Mock先行，后端未就绪不阻塞前端开发
- **性能预算卡口**：写入CI，超标自动拦截
- **核心精简+外部扩展**：核心流程不拉长，专业能力按需接入
