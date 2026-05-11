# All-Skill：产品×设计×工程 AI Agent Skills 全集

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Skill Count](https://img.shields.io/badge/Skills-179-orange.svg)](#四大领域总览)

> 🌟 **推荐**：访问 [PM Skill Galaxy](https://LuckyOneTwoThree.github.io/pm-skill) 体验可视化浏览 —— 星空背景、9大模块星系、完整产品全流程时间线，151个AI Agent Skills一目了然！

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

将软件产品从0到1的全生命周期方法论，提取为 **179 个 AI Agent Skill**，覆盖**产品方法论、UI设计与前端开发、后端架构与开发、跨领域协调**四大领域，兼容 Trae / Claude Code 的 Agent Skills 开放标准。

每个 Skill 是一个可独立执行的方法论 Pipeline，编排器（Orchestrator）负责调度子 Skill 的执行顺序和阶段卡口。四大领域通过**数据契约**紧密衔接，形成从产品探索到上线运营的完整闭环。

## 快速开始

### 部署方式

本目录的嵌套结构仅用于**人工浏览和管理**。Trae 按**单个 SKILL.md** 递归扫描识别 Skill，`name` 字段必须匹配直接父目录名。

实际使用时，需将所有最小 Skill 单元**扁平化**放入 `.trae/skills/` 下：

```
# 部署到 Trae 时的结构（扁平化，机器识别用）
.trae/skills/
├── insight-orchestrator/SKILL.md
├── insight-jtbd/SKILL.md
├── api-contract/SKILL.md
├── design-token/SKILL.md
├── ...（179个Skill扁平平铺）
└── frontend-performance/SKILL.md
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
→ 自动匹配 market-competitor-intel 或 market-orchestrator

我需要写一份PRD
→ 自动匹配 design-prd

设计一下API接口
→ 自动匹配 api-design-orchestrator
```

**2. 命令式调用**

直接使用 Skill 的 `name` 字段精确调用：

```
/insight-orchestrator
/market-competitor-intel
/design-prd
/api-contract
```

**3. 编排器调度**

调用编排器后，编排器会按阶段自动调度子 Skill 执行。你也可以在对话中逐步引导：

```
请按 insight-orchestrator 的流程执行需求洞察分析
→ 编排器依次调度 insight-jtbd → insight-requirement-layers → insight-5whys → insight-kano → insight-priority-scoring
→ 每个阶段卡口等待人类确认后继续
```

> 💡 **提示**：编排器会在每个阶段卡口暂停，等待人类审批后才进入下一阶段。这是人机协作的关键设计，不要跳过。

## 四大领域总览

| 领域 | 模块数 | 编排器 | Pipeline Skill | 导航 | 核心定位 |
|------|--------|--------|---------------|------|----------|
| **pm-skill** 产品方法论 | 10 | 31 | 119 | 1 | 做正确的事：从探索发现到增长运营 |
| **ui-skill** UI设计与前端 | 3 | 3 | 11 | — | 正确地呈现：设计即实现，令牌驱动 |
| **backend-skill** 后端架构 | 3 | 3 | 9 | — | 正确地构建：契约驱动，安全内建 |
| **cross-domain** 跨领域协调 | — | 2 | — | — | 全局编排：产品迭代与产品启动 |

## 全局流程与数据流

四大领域不是孤立的工具集，而是通过**数据契约**紧密衔接的完整产品构建闭环：

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PM 产品方法论（做正确的事）                         │
│                                                                         │
│  探索发现 → 商业战略 → 构思设计 → 度量设计 → 开发上线 → 度量运营 → 增长 → 监控 │
│      │         │         │         │         │                           │
│      │    定位陈述     PRD       指标体系    任务分解                      │
│      │    品牌规范     IA/原型    埋点方案    验收标准                      │
│      │         │         │         │         │                           │
└──────┼─────────┼─────────┼─────────┼─────────┼───────────────────────────┘
       │         │         │         │         │
       ▼         ▼         ▼         ▼         ▼
┌──────────────────────────────┐  ┌──────────────────────────────────────┐
│  UI 设计与前端（正确地呈现）    │  │  后端架构与开发（正确地构建）          │
│                              │  │                                      │
│  设计系统 → UI前端生成 → 集成  │  │  API设计 → 数据架构 → 后端架构        │
│                              │  │                                      │
│  design-token                │  │  api-contract                        │
│  component-library           │  │  api-security                        │
│  page-assembly               │  │  auth-design                         │
│  interaction-design          │  │  data-model                          │
│  api-contract-consume        │  │  service-design                      │
│  frontend-build-deploy       │  │  backend-review                      │
│  frontend-performance        │  │                                      │
│                              │  │                                      │
└──────────────────────────────┘  └──────────────────────────────────────┘
```

### 关键数据契约

三大领域之间通过以下核心产出物衔接，确保从产品定义到技术实现的连续性：

| 数据契约 | 生产方 | 消费方 | 作用 |
|----------|--------|--------|------|
| **PRD** | pm design-prd | ui page-assembly / backend api-contract | 产品需求是UI和后端设计的共同输入 |
| **定位陈述** | pm positioning-statement | ui design-token | 产品定位决定品牌基因和视觉风格 |
| **品牌规范** | pm positioning + 用户提供 | ui design-token | 品牌色彩/字体推导设计令牌 |
| **IA/路由结构** | pm design-ia | ui page-assembly | 信息架构决定页面路由和导航 |
| **用户流程** | pm design-userflow | ui interaction-design | 用户流程定义交互状态机 |
| **原型** | pm design-prototype | ui ui-component-gen / ui page-assembly | 原型指导组件生成和页面组装 |
| **设计令牌** | ui design-token | ui api-contract-consume / pm design-prototype | 令牌驱动错误样式和一致性检查 |
| **OpenAPI契约** | backend api-contract | ui api-contract-consume | API契约是前后端联调的桥梁 |
| **数据模型** | backend data-model | backend api-contract(可选) / cache-strategy | 数据模型是API和缓存设计的基础 |
| **指标体系** | pm metrics-system | pm analysis / monitoring | 度量体系驱动数据分析和监控 |
| **埋点方案** | pm tracking-plan | ui page-assembly | 埋点方案指导前端数据采集 |
| **验收标准** | pm quality-auto-acceptance | backend backend-review | 验收标准是质量保障的基准 |

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
│   │   └── skills/                            19个Pipeline Skill
│   ├── pm-02-strategy/                    模块2：产品商业与战略
│   │   ├── orchestrators/                     business / planning / positioning / stakeholder
│   │   └── skills/                            18个Pipeline Skill
│   ├── pm-03-design/                      模块3：产品构思与设计
│   │   ├── orchestrators/                     design / ideation / requirements / validation
│   │   └── skills/                            18个Pipeline Skill
│   ├── pm-04-metrics-design/              模块4：产品度量设计
│   │   ├── orchestrators/                     metrics
│   │   └── skills/                            3个Pipeline Skill
│   ├── pm-05-development/                 模块5：产品开发与上线
│   │   ├── orchestrators/                     development / quality / release / retrospective
│   │   └── skills/                            16个Pipeline Skill
│   ├── pm-06-metrics-ops/                 模块6：产品度量运营
│   │   ├── orchestrators/                     analysis / decision / experiment
│   │   └── skills/                            10个Pipeline Skill
│   ├── pm-07-growth/                      模块7：产品增长与运营
│   │   ├── orchestrators/                     growth / acquisition / activation / retention / revenue
│   │   └── skills/                            13个Pipeline Skill
│   ├── pm-08-monitoring/                  模块8：产品监控与迭代
│   │   ├── orchestrators/                     diagnosis / iteration / monitoring
│   │   └── skills/                            12个Pipeline Skill
│   ├── pm-09-project/                     模块9：项目管理与执行
│   │   ├── orchestrators/                     agile / project-planning / risk
│   │   └── skills/                            10个Pipeline Skill
│   └── docs/                              可视化文档站
│
├── ui-skill/                         ✅ Skill 文件 —— UI设计与前端开发
│   ├── ui-01-design-system/               模块1：UI设计系统
│   │   ├── orchestrators/                     design-system-orchestrator
│   │   └── skills/                            design-token / component-library / design-system-doc
│   ├── ui-02-ui-frontend/                 模块2：UI前端生成
│   │   ├── orchestrators/                     ui-frontend-orchestrator
│   │   └── skills/                            ui-component-gen / page-assembly / interaction-design / ui-review / frontend-test
│   └── ui-03-frontend-integration/        模块3：前端集成
│       ├── orchestrators/                     frontend-integration-orchestrator
│       └── skills/                            api-contract-consume / frontend-build-deploy / frontend-performance
│
├── backend-skill/                     ✅ Skill 文件 —— 后端架构与开发
│   ├── backend-01-api-design/             模块1：API设计
│   │   ├── orchestrators/                     api-design-orchestrator
│   │   └── skills/                            api-contract / api-security / auth-design
│   ├── backend-02-data-architecture/       模块2：数据架构
│   │   ├── orchestrators/                     data-architecture-orchestrator
│   │   └── skills/                            data-model / cache-strategy / data-migration
│   └── backend-03-backend-architecture/    模块3：后端架构
│       ├── orchestrators/                     backend-architecture-orchestrator
│       └── skills/                            architecture-pattern / service-design / backend-review
│
└── cross-domain/                      ✅ Skill 文件 —— 跨领域协调
    └── orchestrators/                     product-iteration-orchestrator / product-launch-orchestrator
```

> **Skill 提取规则**：只有标记 ✅ 的目录下包含可部署的 Skill 文件。每个 Skill 的最小单元是 `{skill-name}/SKILL.md`，部署时只需将最内层的 `{skill-name}/` 文件夹扁平复制到 `.trae/skills/` 下。`templates/`、`scripts/`、`.github/` 等为项目基础设施，不需要部署。

## 各领域模块详解

### PM 产品方法论（151个Skill）

#### 模块1：产品探索与发现

从市场、用户、需求、机会四个维度探索产品方向。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 需求洞察 | insight-orchestrator | insight-jtbd / insight-requirement-layers / insight-5whys / insight-kano / insight-priority-scoring | 需求优先级 |
| 市场竞品 | market-orchestrator | market-tam-som / market-pest / market-competitor-intel / market-competitor-quadrant / market-competitor-report | 竞品分析报告+差异化策略 |
| 机会识别 | opportunity-orchestrator | opportunity-scoring / opportunity-hmw / opportunity-problem-statement / opportunity-brief | 机会简报 |
| 用户研究 | user-research-orchestrator | user-research-voice-analysis / user-research-behavior-analysis / user-research-user-modeling / user-research-interview-assist / user-research-report | 用户研究报告+行动建议 |

#### 模块2：产品商业与战略

从商业模式、战略规划、产品定位、Stakeholder对齐四个维度确定战略方向。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 商业模式 | business-orchestrator | business-model-canvas / business-value-fit / business-pricing / business-strategy-report | 商业战略规划报告 |
| 战略规划 | planning-orchestrator | product-proposal / planning-swot / planning-porter-five-forces / planning-okr / planning-north-star / planning-roadmap / planning-ansoff | 产品提案+OKR+路线图 |
| 产品定位 | positioning-orchestrator | positioning-statement / positioning-value-curve / positioning-differentiation / positioning-exclusion | 定位陈述 → **消费方：ui design-token** |
| Stakeholder | stakeholder-orchestrator | stakeholder-map / stakeholder-strategy-doc / stakeholder-brief | 战略简报 |

#### 模块3：产品构思与设计

从创意发散、需求管理、产品设计、方案验证四个维度将战略转化为可执行方案。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 创意发散 | ideation-orchestrator | ideation-hmw / ideation-scamper / ideation-inversion / ideation-convergence | Top5方案 |
| 需求管理 | requirements-orchestrator | requirements-collection / requirements-understanding / requirements-prioritization | MoSCoW排序 |
| 产品设计与原型 | design-orchestrator | design-prd / requirements-srs / design-ia / design-userflow / design-prototype / interaction-spec / design-handoff-spec | PRD+SRS+原型+交互规范+设计交接 → **消费方：ui page-assembly / interaction-design / backend api-contract** |
| 方案验证 | validation-orchestrator | validation-assumption-map / validation-mvp / validation-experiment / validation-usability | MVP范围 |

**关键衔接**：design-prd（PRD生成）是PM与UI/后端的核心契约，PRD同时驱动UI前端生成和后端API设计。

#### 模块4：产品度量设计（开发前）

在开发前建立度量体系，确保上线后可量化可追踪。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 度量设计 | metrics-orchestrator | metrics-system / tracking-plan / metrics-dashboard | 指标体系+埋点方案 → **消费方：ui page-assembly（埋点）** |

#### 模块5：产品开发与上线

从任务分解、质量保障、灰度发布、复盘改进四个维度确保正确交付。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 开发交付 | development-orchestrator | development-task-breakdown / development-auto-review / development-prd-sync / requirements-change-log / privacy-compliance-assessment / security-requirements / data-dictionary / tech-debt-register / architecture-decision-record | 任务分解+变更管理+合规+安全+数据+债务+ADR |
| 质量保障 | quality-orchestrator | quality-auto-test / quality-auto-acceptance / quality-acceptance-report | 测试+验收+验收报告 |
| 发布上线 | release-orchestrator | release-gradual / release-auto-checklist / release-notes | 灰度发布+检查清单+发布说明 |
| 复盘改进 | retrospective-orchestrator | retrospective-auto | 复盘报告 → **反馈到开发/质量编排器** |

#### 模块6：产品度量运营（上线后）

上线后通过数据分析、决策闭环、实验验证持续优化。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 数据分析 | analysis-orchestrator | analysis-anomaly / analysis-funnel / analysis-retention / data-analysis-report | 数据洞察报告+行动建议 |
| 决策闭环 | decision-orchestrator | decision-dace / decision-insight / decision-culture | DACE决策循环 |
| 实验验证 | experiment-orchestrator | experiment-design / experiment-execution / experiment-report | A/B测试报告+行动建议 |

#### 模块7：产品增长与运营

围绕AARRR模型的获客、激活、留存、变现四个维度驱动增长。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 增长模式 | growth-orchestrator | growth-model / growth-strategy-report / gtm-strategy / product-operations-manual | 增长策略报告+GTM策略+运营手册 → **驱动获客/激活/留存/变现策略** |
| 获客 | acquisition-orchestrator | acquisition-channel / acquisition-optimize | 渠道评估+漏斗优化 |
| 激活 | activation-orchestrator | activation-aha / activation-onboarding | Aha Moment+Onboarding |
| 留存 | retention-orchestrator | retention-churn / retention-engagement | 流失预警+分层运营 |
| 变现 | revenue-orchestrator | revenue-funnel / revenue-nrr / revenue-upsell | 付费漏斗+NRR+增购 |

#### 模块8：产品监控与迭代

通过监控预警、问题诊断、迭代优化形成持续改进闭环。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 监控预警 | monitoring-orchestrator | monitoring-system / monitoring-anomaly / monitoring-dashboard / monitoring-escalation / user-feedback-loop-report | 监控体系+异常归因+反馈闭环 |
| 问题诊断 | diagnosis-orchestrator | diagnosis-health / diagnosis-competition / competitor-monitoring-report / product-sunset-plan | 健康度评分+竞品监控报告+下线方案 |
| 迭代优化 | iteration-orchestrator | iteration-backlog / iteration-prioritization / iteration-retrospective | Backlog优化+迭代复盘 |

#### 模块9：项目管理与执行

贯穿全程的项目规划、敏捷执行和风险管理。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 项目规划 | project-planning-orchestrator | planning-project-charter / planning-resource / planning-kickoff | 项目宪章+资源计划 |
| 敏捷执行 | agile-orchestrator | agile-sprint-planning / agile-daily-sync / agile-review / sprint-retrospective-report | Sprint规划+每日同步+复盘报告 |
| 风险管理 | risk-orchestrator | risk-identification / risk-monitoring / risk-escalation | 风险登记册+升级流程 |

---

### 跨领域协调（2个Skill）

跨领域编排器负责协调PM、UI、Backend三大领域的完整产品流程，实现从需求到上线的全局调度。

| 编排器 | 作用 | 调度的子编排器 |
|--------|------|--------------|
| product-iteration-orchestrator | 产品迭代总指挥，根据需求变更影响范围调度各领域编排器 | requirements / design / api-design / data-architecture / backend-architecture / design-system / ui-frontend / frontend-integration / quality / release |
| product-launch-orchestrator | 产品启动总指挥，协调从0到1的全流程并行构建 | insight / market / business / positioning / design / metrics / api-design / data-architecture / backend-architecture / design-system / ui-frontend / frontend-integration / quality / release / retrospective |

---

### UI 设计与前端开发（14个Skill）

#### 模块1：UI设计系统

从品牌基因推导设计变量，建立令牌驱动的组件化设计系统。

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| design-token | 从品牌规范生成色彩/字体/间距/阴影等设计令牌 | **输入**：pm positioning-statement（定位陈述）+ 品牌规范 |
| component-library | 按原子设计分层规划组件 | **输入**：design-token + pm PRD |
| design-system-doc | 生成设计系统文档 | **输入**：design-token + component-library |

#### 模块2：UI前端生成

将设计系统转化为可运行的前端代码，实现设计即实现。

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| ui-component-gen | 基于设计系统和意图描述生成组件代码 | **输入**：design-token + component-library + pm PRD/原型(prototype_spec.json) |
| page-assembly | 将组件组装为完整页面 | **输入**：design-token + pm design-ia（路由结构）+ pm design-prototype（原型规格）+ pm tracking-plan（埋点） |
| interaction-design | 生成交互状态机、动画规范 | **输入**：pm design-userflow（用户流程）+ design-token |
| ui-review | 自动审查视觉/无障碍/交互/响应式 | 审查闭环，P0阻塞发布 |
| frontend-test | 自动生成组件/视觉回归/E2E/无障碍测试 | 核心流程E2E必须100%通过 |

#### 模块3：前端集成

前后端联调与上线的桥梁，契约驱动联调。

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| api-contract-consume | 基于OpenAPI生成前端请求层+类型+Mock | **输入**：backend api-contract（openapi.yaml）+ design-token(可选) ← 核心跨领域契约 |
| frontend-build-deploy | 生成构建配置+CI/CD+CDN | 构建可复现，回滚秒级 |
| frontend-performance | 分析性能瓶颈，生成优化方案 | LCP≤2.5s + 首屏JS≤200KB 为上线卡口 |

---

### 后端架构与开发（12个Skill）

#### 模块1：API设计

契约驱动开发，安全内建而非外挂。

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| api-contract | 设计RESTful/GraphQL接口契约，生成OpenAPI 3.0 | **输入**：pm PRD + data-model(可选) → **输出**：openapi.yaml ← 前后端核心契约 |
| api-security | 设计限流/加密/输入校验/CORS/安全头 | **输入**：api-contract |
| auth-design | 设计JWT/OAuth2/SSO + RBAC/ABAC + 多租户 | **输入**：pm PRD + api-contract |

#### 模块2：数据架构

模型决定上限，缓存决定下限，迁移可回滚。

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| data-model | 设计ER模型+DDL+索引+分库分表 | **输入**：pm PRD + api-contract → **输出**：er_model.json + Mermaid ER图 |
| cache-strategy | 设计多级缓存+一致性+穿透/击穿/雪崩防护 | **输入**：data-model + api-contract |
| data-migration | 设计Schema迁移+数据迁移+回滚方案 | 100%变更有回滚脚本 |

#### 模块3：后端架构

架构服务业务，简单方案优先，按需演进。

| Skill | 作用 | 关键衔接 |
|-------|------|----------|
| architecture-pattern | 评估单体/微服务/Serverless，生成ADR+演进路线 | **输入**：业务规模+技术约束 |
| service-design | DDD限界上下文+服务拆分+通信方案 | **输入**：pm PRD + data-model + architecture-pattern |
| backend-review | 审查性能/安全/可维护/可扩展 | P0问题=0才能进入开发 |

## 核心产出文档

PM 领域的 119 个 Pipeline Skill 中，39 个产出包含 Markdown 可交付文档，79 个产出 JSON 数据片段供下游 Skill 消费，1 个产出配置文件。UI/Backend 以代码和配置为交付物。全局共 179 个 Skill（含 39 个编排器 + 119 个 PM Pipeline + 11 个 UI Pipeline + 9 个 Backend Pipeline + 1 个导航）。

### PM 核心产出文档一览

| 生命周期 | 产出文档 | Skill |
|----------|---------|-------|
| 探索发现 | 竞品分析报告 | market-competitor-report |
| 探索发现 | 用户研究报告 | user-research-report |
| 商业战略 | 产品提案 | product-proposal |
| 商业战略 | 商业战略规划报告 | business-strategy-report |
| 构思设计 | PRD | design-prd |
| 构思设计 | 需求规格说明书(SRS) | requirements-srs |
| 构思设计 | 交互设计规范 | interaction-spec |
| 构思设计 | 设计交接文档 | design-handoff-spec |
| 开发上线 | 安全需求清单 | security-requirements |
| 开发上线 | 数据字典 | data-dictionary |
| 开发上线 | 技术债务登记册 | tech-debt-register |
| 开发上线 | 架构决策记录(ADR) | architecture-decision-record |
| 开发上线 | 需求变更记录 | requirements-change-log |
| 开发上线 | 隐私合规评估报告 | privacy-compliance-assessment |
| 开发上线 | 验收报告 | quality-acceptance-report |
| 开发上线 | 版本发布说明 | release-notes |
| 度量运营 | 数据分析报告 | data-analysis-report |
| 度量运营 | A/B测试报告 | experiment-report |
| 增长运营 | 增长策略报告 | growth-strategy-report |
| 增长运营 | Go-to-Market策略 | gtm-strategy |
| 增长运营 | 产品运营手册 | product-operations-manual |
| 监控迭代 | 竞品监控报告 | competitor-monitoring-report |
| 监控迭代 | 用户反馈闭环报告 | user-feedback-loop-report |
| 监控迭代 | 产品下线方案 | product-sunset-plan |

## 典型使用路径

### 路径1：从0到1做新产品

```
PM探索发现 → PM商业战略 → PM构思设计(PRD) ──┬── UI设计系统 → UI前端生成 → 前端集成
                                              │                              ↑
                                              └── API设计 → 数据架构 → 后端架构
                                                       ↑
                                                 PRD+数据模型(可选)

跨领域数据流：
  positioning-statement → UI设计系统(design-token)
  IA/原型/令牌 → UI前端生成(component-library)
  openapi.yaml → 前端集成(api-contract-consume)
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
Backend api-contract(openapi.yaml) → UI api-contract-consume(类型+Mock+Hook)
                                  → UI frontend-build-deploy(CI/CD)
                                  → UI frontend-performance(性能卡口)
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
    ├── pm-development/             ← PM开发上线
    ├── pm-metrics-ops/             ← PM度量运营
    ├── pm-growth/                  ← PM增长运营
    ├── pm-monitoring/              ← PM监控迭代
    ├── pm-project/                 ← PM项目管理
    ├── ui-design-system/           ← UI设计系统
    ├── ui-frontend/                ← UI前端生成
    ├── ui-frontend-integration/    ← 前端集成
    ├── backend-api-design/         ← 后端API设计
    ├── backend-data-architecture/  ← 后端数据架构
    └── backend-architecture/       ← 后端架构
```

output 跟着用户项目走，不跟着 Skill 定义目录走。多项目时各项目产出互不干扰。

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
| 需要A/B测试 | PM模块6 experiment-orchestrator |
| 需要建立设计系统 | UI模块1 design-system-orchestrator |
| 需要生成前端代码 | UI模块2 ui-frontend-orchestrator |
| 需要与后端联调 | UI模块3 api-contract-consume ← Backend api-contract |
| 需要设计API | Backend模块1 api-design-orchestrator |
| 需要设计数据库 | Backend模块2 data-architecture-orchestrator |
| 需要确定架构模式 | Backend模块3 architecture-pattern |
| 项目管理和协作 | PM模块9 project-planning-orchestrator |

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
