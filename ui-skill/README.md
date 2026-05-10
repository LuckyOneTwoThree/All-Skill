# UI设计与前端开发 AI Agent Skills 全集

## 这是什么

将UI设计与前端开发的完整流程闭环提取为 14 个 AI Agent Skill（3个编排器 + 11个Pipeline），兼容 Trae / Claude Code 的 Agent Skills 开放标准。每个 Skill 是一个可独立执行的方法论 Pipeline，编排器负责调度子 Skill 的执行顺序。实现"设计即实现，实现即设计"的UI与前端一体化工作流。

## 快速开始

### 部署方式

本目录的嵌套结构（`ui-0X-xxx/orchestrators|skills/`）仅用于**人工浏览和管理**。Trae 按**单个 SKILL.md** 递归扫描识别 Skill，`name` 字段必须匹配直接父目录名。

实际使用时，需将所有最小 Skill 单元**扁平化**放入 `.trae/skills/` 下：

```
# 本目录结构（人工管理用）
ui-skill/ui-01-design-system/orchestrators/design-system-orchestrator/SKILL.md
ui-skill/ui-01-design-system/skills/design-token/SKILL.md
...

# 部署到 Trae 时的结构（扁平化，机器识别用）
.trae/skills/
├── design-system-orchestrator/SKILL.md
├── design-token/SKILL.md
├── component-library/SKILL.md
├── design-system-doc/SKILL.md
├── ui-frontend-orchestrator/SKILL.md
├── ui-component-gen/SKILL.md
├── page-assembly/SKILL.md
├── interaction-design/SKILL.md
├── ui-review/SKILL.md
├── frontend-test/SKILL.md
├── frontend-integration-orchestrator/SKILL.md
├── api-contract-consume/SKILL.md
├── frontend-build-deploy/SKILL.md
└── frontend-performance/SKILL.md
```

### 部署步骤

1. **全量部署**：将所有 `{skill-name}/` 文件夹复制到 `.trae/skills/` 下，扁平平铺
2. **按需部署**：只复制当前项目阶段需要的 Skill 文件夹
3. **触发使用**：在对话中描述需求，AI 自动匹配对应 Skill

> ⚠️ 部署时只需复制最内层的 `{skill-name}/` 文件夹（含 SKILL.md），不需要保留外层的 `ui-0X-xxx/`、`orchestrators/`、`skills/` 目录结构。

## 目录结构

```
ui-skill/
├── ui-01-design-system/            模块1：UI设计系统（令牌驱动，一致性释放创造力）
│   ├── orchestrators/
│   │   └── design-system-orchestrator/    设计系统建立指挥官
│   └── skills/
│       ├── design-token/                  设计令牌生成（色彩/字体/间距/阴影）
│       ├── component-library/             组件库规划（原子/分子/组织三级）
│       └── design-system-doc/             设计系统文档（使用指南+代码示例）
├── ui-02-ui-frontend/              模块2：UI前端生成（设计即实现，实现即设计）
│   ├── orchestrators/
│   │   └── ui-frontend-orchestrator/      UI前端生成指挥官
│   └── skills/
│       ├── ui-component-gen/              UI组件生成（React/Vue/Svelte）
│       ├── page-assembly/                 页面组装（路由/状态管理/数据流）
│       ├── interaction-design/            交互设计（状态机/动画/手势/反馈）
│       ├── ui-review/                     UI审查（规范/无障碍/交互/响应式）
│       └── frontend-test/                 前端测试（单元/视觉回归/E2E/无障碍）
└── ui-03-frontend-integration/     模块3：前端集成（契约驱动联调，自动化保障上线）
    ├── orchestrators/
    │   └── frontend-integration-orchestrator/  前端集成指挥官
    └── skills/
        ├── api-contract-consume/               API契约消费（类型/Mock/Hook）
        ├── frontend-build-deploy/              构建部署（CI/CD/CDN/环境管理）
        └── frontend-performance/               性能优化（包体积/加载/渲染）
```

## 模块流程顺序

```
UI设计系统 → UI前端生成 → 前端集成
     │             │             │
     │             │             └── 契约驱动联调，性能预算卡口
     │             └── 组件先行，审查闭环，测试保障
     └── 令牌驱动一切，原子到组织，文档同步

详细执行链路：

design-token → component-library → design-system-doc
      ↓
ui-component-gen → page-assembly → interaction-design → ui-review → frontend-test
      ↓
api-contract-consume → frontend-build-deploy → frontend-performance
```

## Skill 类型

| 类型 | 数量 | 作用 | 使用方式 |
|------|------|------|----------|
| 编排器 Orchestrator | 3 | 调度子 Skill 的执行顺序和阶段卡口 | 按子模块流程使用 |
| Pipeline Skill | 11 | 单个方法论 Pipeline，可独立执行 | 按需单独调用 |

## 模块详解

### 模块1：UI设计系统

UI与前端一体化流程的起点。在需要建立设计系统或统一视觉规范时使用，从品牌基因推导设计变量，建立令牌驱动的组件化设计系统。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| design-token | 从品牌规范生成色彩/字体/间距/阴影等设计令牌，输出多平台格式 | 品牌规范、产品定位、目标平台 | tokens.json | 🤖→👤 |
| component-library | 按原子设计分层规划组件，生成组件规格和代码骨架 | 设计令牌、PRD | library.json | 🤖→👤 |
| design-system-doc | 生成完整的设计系统文档，包含使用指南和代码示例 | 设计令牌、组件库 | 文档站点 | 🤖 |

**阶段卡口**：
- 进入组件库规划前：设计令牌WCAG AA对比度100%达标
- 进入文档生成前：原子组件≥15个，依赖图无循环
- 进入UI前端生成前：设计令牌人类已确认，组件层级划分人类已确认

**人类决策点**：品牌色确认、组件层级划分、令牌命名规范

### 模块2：UI前端生成

UI与前端一体化的核心模块。将设计系统转化为可运行的前端代码，通过AI将设计意图一步到位地转化为带样式和交互的前端组件与页面。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| ui-component-gen | 基于设计系统和意图描述生成带样式和交互的前端组件代码 | 组件意图、设计令牌、组件库、原型规格(可选)、PRD(可选) | 组件代码+Story+测试 | 🤖→👤 |
| page-assembly | 将组件组装为完整页面，配置路由、状态管理和数据流 | 页面需求、组件库、设计令牌、路由结构(可选)、原型规格(可选) | 页面代码+路由配置 | 🤖→👤 |
| interaction-design | 生成交互状态机、动画规范、手势支持和反馈机制 | 组件规格、页面需求、设计令牌 | 交互规格+动画代码 | 🤖→👤 |
| ui-review | 自动审查视觉还原度、无障碍合规、交互完整性和响应式适配 | 组件代码、页面代码、设计令牌 | 问题清单+修复建议 | 🤖 |
| frontend-test | 自动生成组件测试、视觉回归测试、E2E测试和无障碍测试 | 组件代码、页面代码、交互规格 | 测试代码+覆盖率报告 | 🤖 |

**阶段卡口**：
- 进入页面组装前：Design Token引用率100%
- 进入交互设计前：组件树层级≤4层
- 进入UI审查前：所有异步操作有loading状态
- 进入前端测试前：P0问题=0
- 进入前端集成前：核心流程E2E测试100%通过，UI审查P0问题全部修复

**人类决策点**：组件方案确认、页面布局确认、交互方案确认、UI审查P1问题处理

### 模块3：前端集成

前后端联调与上线的桥梁。将前端代码与后端API对接，完成构建部署和性能优化，确保产品可上线。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| api-contract-consume | 基于OpenAPI生成前端请求层、类型定义、Mock数据和Hook | API契约文档、页面数据需求、设计令牌(可选) | 请求代码+类型+Mock | 🤖 |
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
    │   ├── design-token/
    │   ├── component-library/
    │   └── design-system-doc/
    ├── ui-frontend/
    │   ├── ui-component-gen/
    │   ├── page-assembly/
    │   ├── interaction-design/
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

## 根据场景选择模块

| 你的场景 | 推荐入口 |
|----------|----------|
| 从零开始建立产品UI | 模块1 → 2 → 3（完整流程） |
| 需要建立设计系统 | 模块1 design-system-orchestrator |
| 已有设计系统，需要生成前端代码 | 模块2 ui-frontend-orchestrator |
| 需要生成特定组件 | 模块2 ui-component-gen |
| 需要与后端API联调 | 模块3 api-contract-consume |
| 需要配置构建部署 | 模块3 frontend-build-deploy |
| 前端性能不达标 | 模块3 frontend-performance |
| UI质量审查 | 模块2 ui-review |
| 品牌升级，更新设计令牌 | 模块1 design-token |

## 人类与 AI 分工

- 🤖 AI 自动执行：文档生成、代码生成、审查检查、测试生成、性能分析
- 🤖→👤 AI 建议人类审批：设计令牌确认、组件方案确认、页面布局确认、交互方案确认
- 👤→🤖 人类执行 AI 辅助：品牌规范提供、意图描述、部署目标选择
- 👤 人类执行：品牌色确认、最终视觉决策、性能预算阈值确认

所有编排器的阶段卡口和人类决策点确保关键决策由人类把控。

## 核心信念

- **令牌驱动一切**：硬编码是技术债，所有视觉属性从令牌推导
- **设计即实现**：UI与前端一体化，设计意图一步到位转化为代码
- **可访问性默认内建**：不是事后补丁，是默认项
- **审查闭环**：不通过不放过，P0问题阻塞发布
- **契约驱动联调**：Mock先行，后端未就绪不阻塞前端开发
- **性能预算卡口**：写入CI，超标自动拦截
