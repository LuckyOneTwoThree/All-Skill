# All-Skill：产品×设计×工程 AI Agent Skills 全集

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Skill Count](https://img.shields.io/badge/Skills-121-orange.svg)](#四大领域总览)

> 🌟 **推荐**：访问 [All-Skill Galaxy](https://luckyonetwothree.github.io/all-skill-html/) 体验交互式可视化 —— 力导向图谱呈现121个Skill编排关系，12条跨域数据契约流一目了然，四大领域模块全景浏览！

> ## ⚠ 声明：AI 是杠杆，不是替代
>
> 这套 Skill 体系将产品方法论结构化为可执行的 Pipeline，让 AI 成为方法论的**忠实执行者**——但它永远无法替代人的**判断力**。
>
> **AI 擅长的**：规模化数据处理、结构化分析、模式识别、方案穷举、一致性检查。这些是杠杆的力臂，放大人的效率。
>
> **人必须掌控的**：战略取舍的平衡点、用户痛点的优先级判定、商业假设的真伪裁决、体验细节的审美判断、风险边界的最终拍板。这些是杠杆的支点，决定力的方向。
>
> 每个编排器的阶段卡口和人类决策点，不是流程的冗余，而是**人机协作的分界线**。跳过它们，AI 会高效地走向错误的方向。持续 Review 不是对 AI 的不信任，而是对产品本质的尊重——**产品是为人创造的，最终也必须由人来负责**。
>
> 记住：方法论不会因为被 AI 执行就自动产生正确的结果。**好的产品，始终是人的判断力 × AI 的执行力。**

## 这是什么

将软件产品从0到1的全生命周期方法论，提取为 **121 个 AI Agent Skill**，覆盖**产品方法论、UI设计与前端开发、后端架构与开发、跨领域协调**四大领域，兼容 Trae / Claude Code 的 Agent Skills 开放标准。

每个 Skill 是一个可独立执行的方法论 Pipeline，编排器（Orchestrator）负责调度子 Skill 的执行顺序和阶段卡口。四大领域通过**数据契约**紧密衔接，形成从产品探索到上线运营的完整闭环。

## 快速开始

### 部署方式

本目录的嵌套结构仅用于**人工浏览和管理**。Trae 按**单个 SKILL.md** 递归扫描识别 Skill，`name` 字段必须匹配直接父目录名。

实际使用时，需将所有最小 Skill 单元**扁平化**放入 `.trae/skills/` 下：

```
# 部署到 Trae 时的结构（扁平化，机器识别用）
.trae/skills/
├── insight-orchestrator/SKILL.md
├── insight-analysis/SKILL.md
├── api-design-spec/SKILL.md
├── project-init/SKILL.md
├── ...（121个Skill扁平平铺）
└── production-ready/SKILL.md
```

### 部署步骤

1. **全量部署**：将所有 `{skill-name}/` 文件夹复制到 `.trae/skills/` 下，扁平平铺
2. **按需部署**：只复制当前项目阶段需要的 Skill 文件夹

> ⚠️ 部署时只需复制最内层的 `{skill-name}/` 文件夹（含 SKILL.md），不需要保留外层的目录结构。

### 调用方式

部署完成后，在 Trae 对话中通过以下方式调用 Skill：

**1. 自然语言触发**

直接描述你的需求，AI 根据 Skill 的 `description` 字段自动匹配：

```
帮我分析一下竞品情况
→ 自动匹配 market-competitor-analysis 或 market-orchestrator

我需要写一份PRD
→ 自动匹配 design-prd

设计一下API接口
→ 自动匹配 api-design-orchestrator
```

**2. 命令式调用**

直接使用 Skill 的 `name` 字段精确调用：

```
/insight-orchestrator
/market-competitor-analysis
/design-prd
/api-design-spec
```

**3. 编排器调度**

调用编排器后，编排器会按阶段自动调度子 Skill 执行。你也可以在对话中逐步引导：

```
请按 insight-orchestrator 的流程执行需求洞察分析
→ 编排器依次调度 insight-analysis
→ 每个阶段卡口等待人类确认后继续
```

> 💡 **提示**：编排器会在每个阶段卡口暂停，等待人类审批后才进入下一阶段。这是人机协作的关键设计，不要跳过。

## 四大领域总览

| 领域 | 模块数 | 编排器 | Pipeline Skill | Extension | 导航 | 核心定位 |
|------|--------|--------|---------------|-----------|------|----------|
| **pm-skill** 产品方法论 | 8 | 26 | 74 | — | 1 | 做正确的事：从探索发现到增长运营 |
| **ui-skill** UI设计与前端 | 3 | 1 | 4 | 4 | — | 正确地呈现：设计即实现，令牌驱动 |
| **backend-skill** 后端架构 | 3 | 3 | 6 | — | — | 正确地构建：设计先行，审查后实现 |
| **cross-domain** 跨领域协调 | — | 2 | — | — | — | 全局编排：产品迭代与产品启动 |

## 全局流程与数据流

四大领域不是孤立的工具集，而是通过**数据契约**紧密衔接的完整产品构建闭环：

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PM 产品方法论（做正确的事）                         │
│                                                                         │
│  探索发现 → 商业战略 → 构思设计 → 度量设计 → 度量运营 → 增长 → 监控迭代 → 项目管理 │
│      │         │         │         │                                    │
│      │    定位陈述     PRD       指标体系                                  │
│      │    品牌规范     IA/原型    埋点方案                                  │
│      │         │         │         │                                    │
└──────┼─────────┼─────────┼─────────┼────────────────────────────────────┘
       │         │         │         │
       ▼         ▼         ▼         ▼
┌──────────────────────────────┐  ┌──────────────────────────────────────┐
│  UI 设计与前端（正确地呈现）    │  │  后端架构与开发（正确地构建）          │
│                              │  │                                      │
│  项目初始化 → 页面构建 →      │  │  API设计 → 数据架构 → 后端架构        │
│  API集成 → 生产就绪          │  │                                      │
│                              │  │  api-design（含安全+认证+合规）       │
│  project-init                │  │  data-architecture（含缓存+迁移）     │
│  page-builder                │  │  backend-architecture（含审查+ADR）   │
│  api-integration             │  │                                      │
│  production-ready            │  │  双输出：代码→{project_dir}/src/      │
│                              │  │        元数据→output/                 │
└──────────────────────────────┘  └──────────────────────────────────────┘
```

### 关键数据契约

三大领域之间通过以下核心产出物衔接，确保从产品定义到技术实现的连续性：

| 数据契约 | 生产方 | 消费方 | 作用 |
|----------|--------|--------|------|
| **PRD** | pm design-prd | ui page-builder / backend api-design | 产品需求是UI和后端设计的共同输入 |
| **定位陈述** | pm positioning-strategy | ui project-init | 产品定位决定品牌基因和视觉风格 |
| **品牌规范** | pm positioning + 用户提供 | ui project-init | 品牌色彩/字体推导设计令牌 |
| **IA/路由结构** | pm design-ia | ui page-builder | 信息架构决定页面路由和导航 |
| **用户流程** | pm design-userflow | ui page-builder | 用户流程定义交互状态机 |
| **原型** | pm design-prototype | ui page-builder | 原型指导组件生成和页面组装 |
| **设计令牌** | ui project-init | ui api-integration / pm design-prototype | 令牌驱动错误样式和一致性检查 |
| **设计简报** | ui page-builder | ui-orchestrator stage-2 | 预生成页面级设计决策供编排器调度 |
| **页面清单** | ui-orchestrator stage-2 | ui page-builder | 预生成页面结构清单指导组件生成 |
| **目标语言** | 用户指定（默认zh-CN） | ui ui-orchestrator | 全链路传递，影响字体/排版/文案/i18n |
| **OpenAPI契约** | backend api-design | ui api-integration | API契约是前后端联调的桥梁 |
| **数据模型** | backend data-architecture | backend api-design(可选) | 数据模型是API设计的基础 |
| **指标体系** | pm metrics-system | pm analysis / monitoring | 度量体系驱动数据分析和监控 |
| **埋点方案** | pm tracking-plan | ui page-builder | 埋点方案指导前端数据采集 |
| **后端审查报告** | backend backend-architecture | pm quality-acceptance | 后端审查结果作为验收参考 |
| **API覆盖报告** | backend api-design | pm quality-acceptance | PRD/前端对齐覆盖报告 |

## 目录结构

```
All-Skill/
├── .github/                          ← 项目基础设施（非 Skill）
│   ├── ISSUE_TEMPLATE/                   Issue 模板
│   ├── workflows/                        PR 自动校验
│   └── config.yml                        Issue 配置
├── scripts/                          ← 项目基础设施（非 Skill）
│   └── validate-skill.js                 SKILL.md 校验脚本
├── templates/                        ← 项目基础设施（非 Skill）
│   ├── pipeline-skill-template/          Pipeline Skill 编写模板
│   └── orchestrator-skill-template/      Orchestrator Skill 编写模板
├── CONTRIBUTING.md                   ← 项目基础设施（非 Skill）
├── LICENSE                           ← 项目基础设施（非 Skill）
├── ROADMAP.md                        ← 项目基础设施（非 Skill）
│
├── pm-skill/                         ✅ Skill 文件 —— 产品方法论
│   ├── pm-00-guide/                       导航入口
│   ├── pm-01-discovery/                   模块1：产品探索与发现
│   │   ├── orchestrators/                     insight / market / opportunity / user-research
│   │   └── skills/                            10个Pipeline Skill
│   ├── pm-02-strategy/                    模块2：产品商业与战略
│   │   ├── orchestrators/                     business / planning / positioning / stakeholder
│   │   └── skills/                            11个Pipeline Skill
│   ├── pm-03-design/                      模块3：产品构思与设计
│   │   ├── orchestrators/                     design / ideation / validation
│   │   └── skills/                            12个Pipeline Skill
│   ├── pm-04-metrics-design/              模块4：产品度量设计
│   │   ├── orchestrators/                     metrics
│   │   └── skills/                            3个Pipeline Skill
│   ├── pm-05-metrics-ops/                 模块5：产品度量运营
│   │   ├── orchestrators/                     analysis / decision / experiment
│   │   └── skills/                            8个Pipeline Skill
│   ├── pm-06-growth/                      模块6：产品增长与运营
│   │   ├── orchestrators/                     growth / acquisition / activation / retention / revenue
│   │   └── skills/                            11个Pipeline Skill
│   ├── pm-07-monitoring/                  模块7：产品监控与迭代
│   │   ├── orchestrators/                     monitoring / diagnosis / iteration
│   │   └── skills/                            11个Pipeline Skill
│   ├── pm-08-project/                     模块8：项目管理与执行
│   │   ├── orchestrators/                     agile / project-planning / risk
│   │   └── skills/                            8个Pipeline Skill
│   └── docs/                              可视化文档站
│
├── ui-skill/                         ✅ Skill 文件 —— UI设计与前端开发
│   ├── ui-01-design-system/               模块1：设计系统（项目初始化+视觉风格）
│   │   └── project-init/                      项目初始化一体化
│   ├── ui-02-ui-frontend/                 模块2：UI前端（组件+页面+审查）
│   │   └── page-builder/                      页面构建一体化
│   ├── ui-03-frontend-integration/        模块3：前端集成（API联调+生产就绪）
│   │   ├── api-integration/                   API契约消费一体化
│   │   └── production-ready/                  生产就绪一体化
│   ├── orchestrators/                     ui-orchestrator（统一编排器）
│   └── extensions/                        外部 Skill（ext-frontend-design / ext-impeccable / ext-interaction-design / ext-ui-ux-pro-max）
│
├── backend-skill/                     ✅ Skill 文件 —— 后端架构与开发
│   ├── backend-01-api-design/             模块1：API设计（契约驱动，安全内建）
│   │   ├── orchestrators/                     api-design-orchestrator
│   │   └── skills/                            api-design-spec + api-design-impl
│   ├── backend-02-data-architecture/       模块2：数据架构（模型决定上限，缓存决定下限）
│   │   ├── orchestrators/                     data-architecture-orchestrator
│   │   └── skills/                            data-architecture-spec + data-architecture-impl
│   └── backend-03-backend-architecture/    模块3：后端架构（适度架构，按需演进）
│       ├── orchestrators/                     backend-architecture-orchestrator
│       └── skills/                            backend-architecture-spec + backend-architecture-impl
│
└── cross-domain/                      ✅ Skill 文件 —— 跨领域协调
    └── orchestrators/                     product-iteration-orchestrator / product-launch-orchestrator
```

> **Skill 提取规则**：只有标记 ✅ 的目录下包含可部署的 Skill 文件。每个 Skill 的最小单元是 `{skill-name}/SKILL.md`，部署时只需将最内层的 `{skill-name}/` 文件夹扁平复制到 `.trae/skills/` 下。`templates/`、`scripts/`、`.github/` 等为项目基础设施，不需要部署。

## 各领域模块详解

### PM 产品方法论（101个Skill）

#### 模块1：产品探索与发现

从市场、用户、需求、机会四个维度探索产品方向。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 需求洞察 | insight-orchestrator | insight-analysis | 需求优先级 |
| 市场竞品 | market-orchestrator | market-tam-som / market-pest / market-competitor-analysis | 竞品分析报告+差异化策略 |
| 机会识别 | opportunity-orchestrator | opportunity-definition | 机会简报 |
| 用户研究 | user-research-orchestrator | user-research-voice-analysis / user-research-behavior-analysis / user-research-user-modeling / user-research-interview-assist / user-research-report | 用户研究报告+行动建议 |

#### 模块2：产品商业与战略

从商业模式、战略规划、产品定位、Stakeholder对齐四个维度确定战略方向。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 商业模式 | business-orchestrator | business-model-canvas / business-value-fit / business-pricing / business-strategy-report | 商业战略规划报告 |
| 战略规划 | planning-orchestrator | product-proposal / strategic-analysis / planning-okr / planning-north-star / planning-roadmap | 产品提案+OKR+路线图 |
| 产品定位 | positioning-orchestrator | positioning-strategy | 定位陈述 → **消费方：ui project-init** |
| Stakeholder | stakeholder-orchestrator | stakeholder-analysis | 战略简报 |

#### 模块3：产品构思与设计

从创意发散、产品设计、方案验证、变更影响分析四个维度将战略转化为可执行方案。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 创意发散 | ideation-orchestrator | ideation-workshop | Top5方案 |
| 产品设计与原型 | design-orchestrator | design-prd / design-ia / design-userflow / design-prototype / interaction-spec / design-handoff-spec / change-impact-analysis | PRD+原型+交互规范+设计交接+变更影响分析 → **消费方：ui page-builder / backend api-design** |
| 方案验证 | validation-orchestrator | validation-assumption-map / validation-mvp / validation-experiment / validation-usability | MVP范围 |

**关键衔接**：design-prd（PRD生成）是PM与UI/后端的核心契约，PRD同时驱动UI前端生成和后端API设计。

#### 模块4：产品度量设计（开发前）

在开发前建立度量体系，确保上线后可量化可追踪。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 度量设计 | metrics-orchestrator | metrics-system / tracking-plan / metrics-dashboard | 指标体系+埋点方案 → **消费方：ui page-builder（埋点）** |

#### 模块5：产品度量运营（上线后）

上线后通过数据分析、决策闭环、实验验证持续优化。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 数据分析 | analysis-orchestrator | analysis-anomaly / analysis-funnel / analysis-retention / data-analysis-report | 数据洞察报告+行动建议 |
| 决策闭环 | decision-orchestrator | decision-dace / decision-culture | DACE决策循环 |
| 实验验证 | experiment-orchestrator | experiment-design / experiment-execution | A/B测试报告+行动建议 |

#### 模块6：产品增长与运营

围绕AARRR模型的获客、激活、留存、变现四个维度驱动增长。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 增长模式 | growth-orchestrator | growth-model / growth-strategy-report / gtm-strategy / product-operations-manual | 增长策略报告+GTM策略+运营手册 → **驱动获客/激活/留存/变现策略** |
| 获客 | acquisition-orchestrator | acquisition-analysis | 渠道评估+漏斗优化 |
| 激活 | activation-orchestrator | activation-aha / activation-onboarding | Aha Moment+Onboarding |
| 留存 | retention-orchestrator | retention-management | 流失预警+分层运营 |
| 变现 | revenue-orchestrator | revenue-funnel / revenue-nrr / revenue-upsell | 付费漏斗+NRR+增购 |

#### 模块7：产品监控与迭代

通过监控预警、问题诊断、迭代优化、质量验收、发布管理形成持续改进闭环。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 监控预警 | monitoring-orchestrator | monitoring-pipeline / user-feedback-loop-report / quality-acceptance | 监控体系+异常归因+反馈闭环+质量验收 |
| 问题诊断 | diagnosis-orchestrator | diagnosis-health / diagnosis-competition / competitor-monitoring-report / product-sunset-plan | 健康度评分+竞品监控报告+下线方案 |
| 迭代优化 | iteration-orchestrator | iteration-decision / release-gradual / release-auto-checklist / release-notes | Backlog优化+灰度发布+检查清单+发布说明 |

#### 模块8：项目管理与执行

贯穿全程的项目规划、敏捷执行和风险管理。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 项目规划 | project-planning-orchestrator | planning-project-charter / planning-resource / planning-kickoff | 项目宪章+资源计划 |
| 敏捷执行 | agile-orchestrator | agile-sprint-planning / agile-daily-sync / agile-review（含迭代复盘） | Sprint规划+每日同步+迭代复盘 |
| 风险管理 | risk-orchestrator | risk-identification / risk-management | 风险登记册+监控+升级 |

---

### 跨领域协调（2个Skill）

跨领域编排器负责协调PM、UI、Backend三大领域的完整产品流程，实现从需求到上线的全局调度。

| 编排器 | 作用 | 调度的子编排器 |
|--------|------|--------------|
| product-iteration-orchestrator | 产品迭代总指挥，根据需求变更影响范围调度各领域编排器 | requirements / design / api-design / data-architecture / backend-architecture / ui / monitoring / iteration |
| product-launch-orchestrator | 产品启动总指挥，协调从0到1的全流程并行构建 | insight / market / business / positioning / design / metrics / api-design / data-architecture / backend-architecture / ui / monitoring / iteration / agile |

---

### UI 设计与前端开发（9个Skill）

> **统一编排 + 按需跳过**：UI 模块由单一编排器 `ui-orchestrator` 统一调度，采用按需跳过策略——已完成或不需要的阶段可直接跳过，不再使用 L1/L2 分级路由。9个Skill = 1编排器 + 4 Pipeline + 4 外部扩展。
>
> **双输出模式**：UI Skill 采用双输出模式——代码文件直接写入 `{project_dir}/` 项目目录（可运行），元数据文件写入 `output/` 目录（供下游 Skill 消费）。

#### 编排器

| 编排器 | 作用 | 调度策略 |
|--------|------|----------|
| ui-orchestrator | UI 全流程统一编排，支持 express/prototype/full/progressive 四种执行模式 | 按需跳过：已完成或不需要的阶段可直接跳过；express模式支持设计方向快选(2-3套)+结构化prompt生成 |

#### Pipeline Skill

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| project-init | 项目初始化 + 设计系统建立：框架选型、目录结构、依赖安装、从品牌规范推导设计令牌、视觉风格定义、生成 PRODUCT.md/DESIGN.md | **输入**：pm PRD + positioning-strategy + 品牌规范 → **必调** ext-frontend-design → **输出**：`{project_dir}/` 可运行项目骨架 + 设计令牌 + PRODUCT.md/DESIGN.md |
| page-builder | 组件生成 + 页面组装 + UI审查：基于设计系统生成前端组件，组装为完整页面，自动审查视觉/无障碍/交互/响应式 | **输入**：project-init + pm PRD/原型/IA + pm tracking-plan → 审查闭环，P0阻塞发布 |
| api-integration | 前后端联调桥梁：基于OpenAPI生成前端请求层+类型+Mock | **输入**：backend api-design-spec ← 核心跨领域契约 |
| production-ready | 生产就绪保障：构建配置+CI/CD+CDN + 性能优化 + 自动测试（组件/视觉/E2E/无障碍） | LCP≤2.5s + 首屏JS≤200KB + 核心流程E2E 100%通过 为上线卡口 |

> **Skill 合并映射**：`project-scaffold` + `design-system` → `project-init`；`ui-component-gen` + `page-assembly` + `ui-review` → `page-builder`；`api-contract-consume` → `api-integration`；`frontend-build-deploy` + `frontend-performance` + `frontend-test` → `production-ready`

#### 外部扩展

| 扩展 Skill | 作用 | 调用方（编排器阶段） |
|------------|------|---------------------|
| ext-frontend-design | 视觉差异化设计 | stage-2 **必调**（设计系统建立） / stage-e express模式（visual引擎） |
| ext-impeccable | colorize/typeset/layout/shape/animate/bolder/quieter/delight/clarify/onboard/distill/audit/critique/harden/polish/optimize | stage-2(colorize/typeset) / stage-4(layout/shape/animate/clarify/onboard/distill/audit/critique) / stage-6(harden/polish/optimize) |
| ext-interaction-design | 交互动效模式 | stage-4（交互动效增强） / stage-e express模式（motion引擎） |
| ext-ui-ux-pro-max | 数据驱动设计推荐 | stage-2 --design-system（设计系统推荐） / stage-4 --domain（页面结构推荐） / stage-e express模式（ux引擎） |

> **ext- Skill 调用方式**：外部扩展 Skill 已从描述性表格改为指令性调用块格式。编排器通过 `Skill: ext-xxx` 指令块精确调度，而非依赖描述匹配。例如：`Skill: ext-frontend-design`、`Skill: ext-impeccable`。

---

### 后端架构与开发（9个Skill）

> **设计先行，审查后实现**：Backend 模块每个子域拆分为"设计Skill + 实现Skill"两个阶段，设计产出经人类审查确认后才生成代码。编排器在设计和实现之间加入人类审查卡口，确保设计缺陷在代码生成前被发现和修复。

#### 模块1：API设计

契约驱动开发，安全内建而非外挂。

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| api-design-spec | 资源识别→接口设计→安全设计→认证鉴权→合规检查 | **输入**：pm PRD + 前端页面数据需求 → **输出**：openapi.yaml + 安全策略 + 认证鉴权方案 → **人类审查** |
| api-design-impl | 代码骨架→Service实现→中间件→对齐检查→测试生成 | **输入**：api-design-spec 产出 → **输出**：代码写入{project_dir}/src/ ← 前后端核心契约 |

#### 模块2：数据架构

模型决定上限，缓存决定下限，迁移可回滚。

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| data-architecture-spec | 数据字典→ER建模→表结构索引→缓存策略→迁移方案 | **输入**：pm PRD + api-design-spec → **输出**：er_model.json + 缓存策略 + 迁移方案 → **人类审查** |
| data-architecture-impl | Model→Migration→Repository→缓存层→对齐检查→测试生成 | **输入**：data-architecture-spec 产出 → **输出**：代码写入{project_dir}/src/ |

#### 模块3：后端架构

架构服务业务，简单方案优先，按需演进。

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| backend-architecture-spec | 架构模式→ADR→服务设计→后端审查→技术债登记 | **输入**：pm PRD + api-design-spec + data-architecture-spec → **输出**：review_report.json → **人类审查** |
| backend-architecture-impl | app.ts+配置→服务层→基础设施→Docker+CI→对齐检查→测试生成 | **输入**：backend-architecture-spec 产出 + api-design-impl + data-architecture-impl → **输出**：代码写入{project_dir}/ |

## 核心产出文档

PM 领域的 74 个 Pipeline Skill 中，17 个产出包含 Markdown 可交付文档，其余 57 个产出 JSON 数据片段供下游 Skill 消费。UI/Backend 以代码和配置为交付物。全局共 121 个 Skill（含 32 个编排器 + 74 个 PM Pipeline + 4 个 UI Pipeline + 6 个 Backend Pipeline + 4 个 UI 外部扩展 + 1 个导航）。

### PM 核心产出文档一览

| 生命周期 | 产出文档 | Skill |
|----------|---------|-------|
| 探索发现 | 竞品分析报告 | market-competitor-analysis |
| 探索发现 | 用户研究报告 | user-research-report |
| 商业战略 | 产品提案 | product-proposal |
| 商业战略 | 商业战略规划报告 | business-strategy-report |
| 构思设计 | PRD | design-prd |
| 构思设计 | 交互设计规范 | interaction-spec |
| 构思设计 | 设计交接文档 | design-handoff-spec |
| 构思设计 | 变更影响分析报告 | change-impact-analysis |
| 监控迭代 | 验收报告 | quality-acceptance |
| 监控迭代 | 版本发布说明 | release-notes |
| 度量运营 | 数据分析报告 | data-analysis-report |
| 度量运营 | A/B测试报告 | experiment-execution |
| 增长运营 | 增长策略报告 | growth-strategy-report |
| 增长运营 | Go-to-Market策略 | gtm-strategy |
| 增长运营 | 产品运营手册 | product-operations-manual |
| 监控迭代 | 竞品监控报告 | competitor-monitoring-report |
| 监控迭代 | 用户反馈闭环报告 | user-feedback-loop-report |
| 监控迭代 | 产品下线方案 | product-sunset-plan |

> 📌 **Backend 模块内建覆盖**：架构决策记录(ADR)、数据字典、安全合规评估、技术债务登记册等交付物已由 Backend 模块内建产出，不再作为独立 PM Pipeline Skill。

## 典型使用路径

### 路径1：从0到1做新产品

```
PM探索发现 → PM商业战略 → PM构思设计(PRD) ──┬── UI项目初始化 → UI页面构建 → UI API集成 → UI生产就绪
                                              │                                         ↑
                                              └── API设计 → 数据架构 → 后端架构
                                                       ↑
                                                 PRD+数据模型(可选)

跨领域数据流：
  positioning-strategy → UI项目初始化(project-init)
  IA/原型/令牌 → UI页面构建(page-builder)
  openapi.yaml → UI API集成(api-integration)
```

### 路径2：已有产品需要优化

```
PM度量运营(数据分析) → PM监控与迭代(诊断+迭代优化) → PM/Backend/UI 按需修复
```

### 路径3：需要增长

```
PM增长与运营(获客→激活→留存→变现) → PM度量运营(实验验证) → 持续迭代
```

### 路径4：前后端联调

```
Backend api-design(openapi.yaml) → UI api-integration(类型+Mock+Hook)
                                  → UI production-ready(CI/CD+性能卡口+测试)
```

## 输出路径

Skill 执行结果写入**用户项目根目录**的 `output/` 下：

```
用户项目/
└── output/
    ├── pm-discovery/               ← PM探索发现
    ├── pm-strategy/                ← PM商业战略
    ├── pm-design/                  ← PM构思设计
    ├── pm-metrics-design/          ← PM度量设计
    ├── pm-metrics-ops/             ← PM度量运营
    ├── pm-growth/                  ← PM增长运营
    ├── pm-monitoring/              ← PM监控迭代
    ├── pm-project/                 ← PM项目管理
    ├── ui/                           ← UI设计与前端（统一输出）
    ├── backend-api-design/         ← 后端API设计
    ├── backend-data-architecture/  ← 后端数据架构
    └── backend-architecture/       ← 后端架构
```

output 跟着用户项目走，不跟着 Skill 定义目录走。多项目时各项目产出互不干扰。

> **双输出模式**：UI/Backend Skill 的代码文件直接写入 `{project_dir}/` 项目目录，确保生成的代码可立即运行；元数据文件仍写入 `output/` 目录，供下游 Skill 消费。

## AI 能力边界

- ✅ 能做：读取本地文件、分析粘贴文本、处理上传文件、生成结构化报告、逻辑推导
- ❌ 不能做：访问外部数据库、调用业务 API、获取实时数据、操作外部系统、执行代码

需要外部数据时，用户需通过粘贴 / 上传 / 提供路径三种方式提供。

## 根据场景选择领域和模块

| 你的场景 | 推荐入口 |
|----------|----------|
| 从0到1做新产品 | product-launch-orchestrator（跨领域全流程） |
| 已有产品功能迭代 | product-iteration-orchestrator（跨领域增量更新） |
| 已有产品需要优化 | PM模块6（数据分析）或 PM模块8（监控迭代） |
| 需要增长 | PM模块7（增长与运营） |
| 竞品分析 | PM模块1 market-orchestrator |
| 用户研究 | PM模块1 user-research-orchestrator |
| 商业模式设计 | PM模块2 business-orchestrator |
| 产品定位 | PM模块2 positioning-orchestrator |
| 需要写PRD | PM模块3 design-prd |
| 需要A/B测试 | PM模块5 experiment-orchestrator |
| 需要建立设计系统 | UI project-init（含设计系统建立） |
| 需要生成前端代码 | UI ui-orchestrator（统一编排） |
| 需要与后端联调 | UI api-integration ← Backend api-design |
| 需要设计API | Backend模块1 api-design-orchestrator |
| 需要设计数据库 | Backend模块2 data-architecture-orchestrator |
| 需要确定架构模式 | Backend模块3 backend-architecture |
| 项目管理和协作 | PM模块8 project-planning-orchestrator |

## 人类与 AI 分工

- 🤖 AI 自动执行：数据处理、分析计算、文档生成、代码生成、审查检查
- 🤖→👤 AI 建议人类审批：方案选择、架构决策、安全策略、优先级排序
- 👤→🤖 人类执行 AI 辅助：目标设定、品牌规范、价值判断
- 👤 人类执行：最终决策、外部沟通、安全等级确认

所有编排器的阶段卡口和人类决策点确保关键决策由人类把控。

## 核心信念

- **做正确的事，然后正确地做事**：PM确保方向，UI/Backend确保执行
- **契约驱动一切**：PRD驱动设计，OpenAPI驱动联调，设计令牌驱动UI
- **安全/可访问性默认内建**：不是事后补丁，是默认项
- **审查闭环**：P0问题阻塞发布，不通过不放过
- **数据驱动决策**：用数据减少猜测，但决策权在人类
- **简单方案优先**：架构按需演进，不过度设计

## 参与贡献

我们欢迎各种形式的贡献——新增 Skill、改进现有 Skill、报告问题、翻译文档。

- 📋 [贡献指南](CONTRIBUTING.md) —— 命名规范、编写模板、PR 流程
- 🗺️ [路线图](ROADMAP.md) —— 待认领 Skill 和新领域扩展方向
- 🐛 [提交 Issue](https://github.com/LuckyOneTwoThree/All-Skill/issues/new?template=bug-skill.yml) —— 报告 Skill 执行问题
- 💡 [提议新 Skill](https://github.com/LuckyOneTwoThree/All-Skill/issues/new?template=new-skill.yml) —— 提案新增方法论 Pipeline

## 许可证

本项目基于 [MIT License](LICENSE) 开源。
