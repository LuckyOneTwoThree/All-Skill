# 产品方法论 AI Agent Skills 全集

## 这是什么

将完整的产品方法论闭环提取为 102 个 AI Agent Skill，兼容 Trae / Claude Code 的 Agent Skills 开放标准。每个 Skill 是一个可独立执行的方法论 Pipeline，编排器负责调度子 Skill 的执行顺序。

## 快速开始

### 部署方式

本目录的嵌套结构（`pm-0X-xxx/orchestrators|skills/`）仅用于**人工浏览和管理**。Trae 按**单个 SKILL.md** 递归扫描识别 Skill，`name` 字段必须匹配直接父目录名。

实际使用时，需将所有最小 Skill 单元**扁平化**放入 `.trae/skills/` 下：

```
# 本目录结构（人工管理用）
ALL/pm-01-discovery/orchestrators/user-research-orchestrator/SKILL.md
ALL/pm-01-discovery/skills/user-research-voice-analysis/SKILL.md
...

# 部署到 Trae 时的结构（扁平化，机器识别用）
.trae/skills/
├── user-research-orchestrator/SKILL.md
├── user-research-voice-analysis/SKILL.md
├── insight-orchestrator/SKILL.md
├── insight-analysis/SKILL.md
├── ...（101个Skill扁平平铺）
└── risk-management/SKILL.md
```

### 部署步骤

1. **全量部署**：将所有 `{skill-name}/` 文件夹复制到 `.trae/skills/` 下，扁平平铺
2. **按需部署**：只复制当前项目阶段需要的 Skill 文件夹
3. **触发使用**：在对话中描述需求，AI 自动匹配对应 Skill

> ⚠️ 部署时只需复制最内层的 `{skill-name}/` 文件夹（含 SKILL.md），不需要保留外层的 `pm-0X-xxx/`、`orchestrators/`、`skills/` 目录结构。

## 目录结构

```
ALL/
├── pm-00-guide/               导航入口（非标准 Skill，类似本 README 的交互版）
├── pm-01-discovery/           模块1：产品探索与发现
├── pm-02-strategy/            模块2：产品商业与战略
├── pm-03-design/              模块3：产品构思与设计（含PRD生成+变更影响分析）
├── pm-04-metrics-design/      模块4：产品度量设计（开发前）
├── pm-05-metrics-ops/         模块5：产品度量运营（上线后）
├── pm-06-growth/              模块6：产品增长与运营
├── pm-07-monitoring/          模块7：产品监控与迭代（含验收发布）
├── pm-08-project/             模块8：项目管理与执行（贯穿全程）
└── [pm-05-development 已移除]  开发交付能力已由 Backend 模块内建，验收/发布技能迁至 pm-08
```

每个模块目录下：
- `orchestrators/` — 编排器（指挥官模式，调度子 Skill 执行顺序）
- `skills/` — Pipeline Skill（可独立执行的方法论 Pipeline）

## 模块流程顺序

```
探索与发现 → 商业与战略 → 构思与设计（含PRD生成+变更影响分析）
     ↓                                       ↓
 度量设计(开发前)                     [Backend开发与上线]
                                             ↓
                                     度量运营(上线后)
                                             ↓
                             增长与运营 ←→ 监控与迭代（含验收发布）
                                             ↓
                                   项目管理（贯穿全程）
```

## 模块详解

### 模块1：产品探索与发现

从市场、用户、需求、机会四个维度探索产品方向。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 需求洞察 | insight-orchestrator | insight-analysis | 需求优先级 |
| 市场竞品 | market-orchestrator | market-tam-som / market-pest / market-competitor-analysis | 竞品分析报告+差异化策略 |
| 机会识别 | opportunity-orchestrator | opportunity-definition | 机会简报 |
| 用户研究 | user-research-orchestrator | user-research-voice-analysis / user-research-behavior-analysis / user-research-user-modeling / user-research-interview-assist / user-research-report | 用户研究报告+行动建议 |

### 模块2：产品商业与战略

从商业模式、战略规划、产品定位、Stakeholder对齐四个维度确定战略方向。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 商业模式 | business-orchestrator | business-model-canvas / business-value-fit / business-pricing / business-strategy-report | 商业战略规划报告 |
| 战略规划 | planning-orchestrator | product-proposal / strategic-analysis / planning-okr / planning-north-star / planning-roadmap | 产品提案+OKR+路线图 |
| 产品定位 | positioning-orchestrator | positioning-strategy | 定位陈述 → **消费方：ui design-system** |
| Stakeholder | stakeholder-orchestrator | stakeholder-analysis | 战略简报 |

### 模块3：产品构思与设计

从创意发散、需求管理、产品设计、方案验证四个维度将战略转化为可执行方案。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 创意发散 | ideation-orchestrator | ideation-workshop | Top5方案 |
| 产品设计与原型 | design-orchestrator | design-prd / design-ia / design-userflow / design-prototype / interaction-spec / design-handoff-spec | PRD+原型+交互规范+设计交接 → **消费方：ui page-assembly / ui-component-gen / backend api-contract** |
| 方案验证 | validation-orchestrator | validation-assumption-map / validation-mvp / validation-experiment / validation-usability | MVP范围 |
| 变更影响分析 | — | change-impact-analysis | 变更影响分析报告 → **消费方：backend api-contract / ui page-assembly** |

**关键衔接**：design-prd（PRD生成）是PM与UI/后端的核心契约，PRD同时驱动UI前端生成和后端API设计。

### 模块4：产品度量设计（开发前）

在开发前建立度量体系，确保上线后可量化可追踪。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 度量设计 | metrics-orchestrator | metrics-system / tracking-plan / metrics-dashboard | 指标体系+埋点方案 → **消费方：ui page-assembly（埋点）** |

### ~~模块5：产品开发与上线~~（已移除）

> ⚠️ **pm-05-development 模块已移除**。开发交付相关能力（任务分解、PRD同步、ADR、数据字典、安全合规、技术债务登记）已由 Backend 模块内建覆盖；quality-auto-test 由 UI/Backend 覆盖；验收与发布技能迁至模块8（监控与迭代）；迭代复盘能力合并至模块9 agile-review。

### 模块6：产品度量运营（上线后）

上线后通过数据分析、决策闭环、实验验证持续优化。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 数据分析 | analysis-orchestrator | analysis-anomaly / analysis-funnel / analysis-retention / data-analysis-report | 数据洞察报告+行动建议 |
| 决策闭环 | decision-orchestrator | decision-dace / decision-culture | DACE决策循环 |
| 实验验证 | experiment-orchestrator | experiment-design / experiment-execution | A/B测试报告+行动建议 |

### 模块7：产品增长与运营

围绕AARRR模型的获客、激活、留存、变现四个维度驱动增长。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 增长模式 | growth-orchestrator | growth-model / growth-strategy-report / gtm-strategy / product-operations-manual | 增长策略报告+GTM策略+运营手册 → **驱动获客/激活/留存/变现策略** |
| 获客 | acquisition-orchestrator | acquisition-analysis | 渠道评估+漏斗优化 |
| 激活 | activation-orchestrator | activation-aha / activation-onboarding | Aha Moment+Onboarding |
| 留存 | retention-orchestrator | retention-management | 流失预警+分层运营 |
| 变现 | revenue-orchestrator | revenue-funnel / revenue-nrr / revenue-upsell | 付费漏斗+NRR+增购 |

### 模块8：产品监控与迭代

通过监控预警、问题诊断、迭代优化、质量验收、发布管理形成持续改进闭环。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 监控预警 | monitoring-orchestrator | monitoring-pipeline / user-feedback-loop-report | 监控体系+异常归因+反馈闭环 |
| 问题诊断 | diagnosis-orchestrator | diagnosis-health / diagnosis-competition / competitor-monitoring-report / product-sunset-plan | 健康度评分+竞品监控报告+下线方案 |
| 迭代优化 | iteration-orchestrator | iteration-decision | Backlog优化+迭代复盘 |
| 质量验收 | — | quality-acceptance | 验收报告 |
| 发布管理 | — | release-gradual / release-auto-checklist / release-notes | 灰度发布+检查清单+发布说明 |

### 模块9：项目管理与执行

贯穿全程的项目规划、敏捷执行和风险管理。

| 子模块 | 编排器 | Pipeline Skill | 核心产出 |
|--------|--------|---------------|----------|
| 项目规划 | project-planning-orchestrator | planning-project-charter / planning-resource / planning-kickoff | 项目宪章+资源计划 |
| 敏捷执行 | agile-orchestrator | agile-sprint-planning / agile-daily-sync / agile-review（含迭代复盘） | Sprint规划+每日同步+迭代复盘 |
| 风险管理 | risk-orchestrator | risk-identification / risk-management | 风险登记册+监控+升级 |

## Skill 类型

| 类型 | 数量 | 作用 | 使用方式 |
|------|------|------|----------|
| 编排器 Orchestrator | 26 | 调度子 Skill 的执行顺序和阶段卡口 | 按子模块流程使用 |
| Pipeline Skill | 74 | 单个方法论 Pipeline，可独立执行 | 按需单独调用 |
| 导航 Guide | 1 | 全流程导航，根据场景推荐模块 | 入口指引 |

## 输出路径

Skill 执行结果写入**用户项目根目录**的 `output/` 下：

```
用户项目/
└── output/
    └── pm-discovery/          ← 模块名（不带序号）
        └── user-research-voice-analysis/
            └── voice-analysis.json
```

output 跟着用户项目走，不跟着 Skill 定义目录走。多项目时各项目产出互不干扰。

## AI 能力边界

- ✅ 能做：读取本地文件、分析粘贴文本、处理上传文件、生成结构化报告、逻辑推导
- ❌ 不能做：访问外部数据库、调用业务 API、获取实时数据、操作外部系统、执行代码

需要外部数据时，用户需通过粘贴 / 上传 / 提供路径三种方式提供。

## 根据场景选择模块

| 你的场景 | 推荐入口 |
|----------|----------|
| 从 0 到 1 做新产品 | 模块1 → 2 → 3 → 4 → 7 |
| 已有产品需要优化 | 模块5（数据分析）或 模块7（监控迭代） |
| 需要增长 | 模块6（增长与运营） |
| 需要做需求分析 | 模块1 insight-orchestrator 或 模块3 design-prd |
| 需要写 PRD | 模块3 design-prd |
| 项目管理和协作 | 模块8 project-planning-orchestrator |

## 人类与 AI 分工

- 🤖 AI 自动执行：数据处理、分析计算、文档生成
- 🤖→👤 AI 建议人类审批：方案选择、优先级排序、策略方向
- 👤→🤖 人类执行 AI 辅助：目标设定、价值判断
- 👤 人类执行：最终决策、外部沟通

所有编排器的阶段卡口和人类决策点确保关键决策由人类把控。

## 核心产出文档

74 个 Pipeline Skill 中，17 个产出人类可读的 Markdown 可交付文档，其余 57 个产出 JSON 数据片段供下游 Skill 消费。

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

> 📌 **Backend 模块内建覆盖**：架构决策记录(ADR)、数据字典、安全合规评估、技术债务登记册、需求变更记录等交付物已由 Backend 模块内建产出，不再作为独立 PM Pipeline Skill。

## 核心信念

- **做正确的事**：PM确保方向正确，探索发现先行，数据验证假设
- **契约驱动一切**：PRD驱动设计，定位陈述驱动品牌，埋点方案驱动数据采集
- **数据驱动决策**：用数据减少猜测，但决策权在人类
- **安全/合规默认内建**：不是事后补丁，是默认项
- **审查闭环**：P0问题阻塞发布，不通过不放过
- **持续改进**：度量运营→监控迭代→反馈闭环，产品永远在进化
