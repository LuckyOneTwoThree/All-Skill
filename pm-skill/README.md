# 产品方法论 AI Agent Skills 全集

🌐 **语言切换**：[中文版](README.md) | [English](README_en.md)

> 🌟 **推荐**：访问 [PM Skill Galaxy](https://LuckyOneTwoThree.github.io/pm-skill) 体验可视化浏览 —— 星空背景、9大模块星系、完整产品全流程时间线，126个AI Agent Skills一目了然！

## 这是什么

将完整的产品方法论闭环提取为 127 个 AI Agent Skill，兼容 Trae / Claude Code 的 Agent Skills 开放标准。每个 Skill 是一个可独立执行的方法论 Pipeline，编排器负责调度子 Skill 的执行顺序。

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
├── insight-jtbd/SKILL.md
├── ...（127个Skill扁平平铺）
└── risk-escalation/SKILL.md
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
├── pm-03-design/              模块3：产品构思与设计（含PRD生成）
├── pm-04-metrics-design/      模块4：产品度量设计（开发前）
├── pm-05-development/         模块5：产品开发与上线
├── pm-06-metrics-ops/         模块6：产品度量运营（上线后）
├── pm-07-growth/              模块7：产品增长与运营
├── pm-08-monitoring/          模块8：产品监控与迭代
├── pm-09-project/             模块9：项目管理与执行（贯穿全程）
```

每个模块目录下：
- `orchestrators/` — 编排器（指挥官模式，调度子 Skill 执行顺序）
- `skills/` — Pipeline Skill（可独立执行的方法论 Pipeline）

## 模块流程顺序

```
探索与发现 → 商业与战略 → 构思与设计（含PRD生成）
     ↓                                       ↓
 度量设计(开发前)                     开发与上线
                                             ↓
                                     度量运营(上线后)
                                             ↓
                             增长与运营 ←→ 监控与迭代
                                             ↓
                                   项目管理（贯穿全程）
```

## Skill 类型

| 类型 | 数量 | 作用 | 使用方式 |
|------|------|------|----------|
| 编排器 Orchestrator | 31 | 调度子 Skill 的执行顺序和阶段卡口 | 按子模块流程使用 |
| Pipeline Skill | 95 | 单个方法论 Pipeline，可独立执行 | 按需单独调用 |
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
| 从 0 到 1 做新产品 | 模块1 → 2 → 3 → 4 → 5 |
| 已有产品需要优化 | 模块6（数据分析）或 模块8（监控迭代） |
| 需要增长 | 模块7（增长与运营） |
| 需要做需求分析 | 模块1 insight-orchestrator 或 模块3 requirements-orchestrator |
| 需要写 PRD | 模块3 design-prd |
| 项目管理和协作 | 模块9 project-planning-orchestrator |

## 人类与 AI 分工

- 🤖 AI 自动执行：数据处理、分析计算、文档生成
- 🤖→👤 AI 建议人类审批：方案选择、优先级排序、策略方向
- 👤→🤖 人类执行 AI 辅助：目标设定、价值判断
- 👤 人类执行：最终决策、外部沟通

所有编排器的阶段卡口和人类决策点确保关键决策由人类把控。
