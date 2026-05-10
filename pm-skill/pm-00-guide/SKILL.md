---
name: pm-00-guide
description: 产品方法论全流程导航。当用户提到"做产品""产品规划""从0到1""产品方法论""产品流程"时使用，根据用户当前阶段推荐对应的模块和Skill。关键词：产品方法论、产品流程、产品规划、从0到1、产品全流程。
metadata:
  module: "产品方法论"
  sub-module: "导航入口"
  type: "guide"
  version: "1.0"
---

# 产品方法论全流程导航

## 产品全流程全景图

```
产品探索与发现 → 产品商业与战略 → 产品构思与设计（含PRD生成）
       ↓                                    ↓
  产品度量设计(开发前)              产品开发与上线
                                          ↓
                                  产品度量运营(上线后)
                                          ↓
                              产品增长与运营 ←→ 产品监控与迭代
                                          ↓
                                    项目管理与执行（贯穿全程）
```

## 9大模块与入口编排器

| 阶段 | 模块 | 入口编排器 | 何时使用 |
|------|------|-----------|---------|
| 1 | 产品探索与发现 | user-research-orchestrator / insight-orchestrator / market-orchestrator / opportunity-orchestrator | 从0开始，不知道用户是谁、问题是什么 |
| 2 | 产品商业与战略 | business-orchestrator / positioning-orchestrator / planning-orchestrator / stakeholder-orchestrator | 已发现问题，需要确定商业模式和战略 |
| 3 | 产品构思与设计（含PRD生成） | requirements-orchestrator / ideation-orchestrator / design-orchestrator / validation-orchestrator | 已有战略，需要设计方案、生成PRD并验证 |
| 4 | 产品度量设计 | metrics-orchestrator | 开发前，需要设计指标体系和埋点方案 |
| 5 | 产品开发与上线 | development-orchestrator / quality-orchestrator / release-orchestrator / retrospective-orchestrator | PRD完成，进入开发交付 |
| 6 | 产品度量运营 | analysis-orchestrator / experiment-orchestrator / decision-orchestrator | 上线后，需要数据分析和实验验证 |
| 7 | 产品增长与运营 | acquisition-orchestrator / activation-orchestrator / retention-orchestrator / revenue-orchestrator | 需要获取用户、提升留存、商业化 |
| 8 | 产品监控与迭代 | monitoring-orchestrator / diagnosis-orchestrator / iteration-orchestrator | 需要监控预警、问题诊断、迭代优化 |
| 9 | 项目管理与执行 | project-planning-orchestrator / agile-orchestrator / risk-orchestrator | 贯穿全程的项目管理 |

## 根据用户场景推荐

### 场景1：从0到1做新产品
推荐顺序：模块1 → 2 → 3 → 4 → 5

### 场景2：已有产品需要优化
推荐入口：模块6（数据分析）或 模块8（监控迭代）

### 场景3：需要增长
推荐入口：模块7（增长与运营）

### 场景4：需要做需求分析
推荐入口：模块1的 insight-orchestrator 或 模块3的 requirements-orchestrator

### 场景5：需要写PRD
推荐入口：模块3 design-prd

### 场景6：项目管理和协作
推荐入口：模块9 project-planning-orchestrator

## Skill目录结构

### 存放路径

所有Skill定义文件存放在 `ALL/` 目录下，按模块编号+模块名组织：

```
ALL/
├── pm-00-guide/                        ← 导航入口（非标准Skill）
│   └── SKILL.md
├── pm-01-discovery/                    ← 模块1：产品探索与发现
│   ├── orchestrators/                  ← 编排器
│   │   ├── user-research-orchestrator/SKILL.md
│   │   ├── insight-orchestrator/SKILL.md
│   │   ├── market-orchestrator/SKILL.md
│   │   └── opportunity-orchestrator/SKILL.md
│   └── skills/                         ← Pipeline Skill（18个，含竞品分析报告生成）
│       ├── user-research-voice-analysis/SKILL.md
│       ├── insight-jtbd/SKILL.md
│       └── ...（17个Pipeline）
├── pm-02-strategy/                     ← 模块2：产品商业与战略
│   ├── orchestrators/（4个编排器）
│   └── skills/（16个Pipeline）
├── pm-03-design/                       ← 模块3：产品构思与设计（含PRD生成）
│   ├── orchestrators/（4个编排器）
│   └── skills/（15个Pipeline，含design-prd）
├── pm-04-metrics-design/               ← 模块4：产品度量设计
│   ├── orchestrators/（1个编排器）
│   └── skills/（3个Pipeline）
├── pm-05-development/                  ← 模块5：产品开发与上线
│   ├── orchestrators/（4个编排器）
│   └── skills/（8个Pipeline）
├── pm-06-metrics-ops/                  ← 模块6：产品度量运营
│   ├── orchestrators/（3个编排器）
│   └── skills/（8个Pipeline）
├── pm-07-growth/                       ← 模块7：产品增长与运营
│   ├── orchestrators/（4个编排器）
│   └── skills/（10个Pipeline）
├── pm-08-monitoring/                   ← 模块8：产品监控与迭代
│   ├── orchestrators/（3个编排器）
│   └── skills/（9个Pipeline）
└── pm-09-project/                      ← 模块9：项目管理与执行
    ├── orchestrators/（3个编排器）
    └── skills/（9个Pipeline）
```

### 目录命名规则

- `pm-{序号}-{模块名}/`：模块级目录，序号控制流程顺序
- `orchestrators/`：存放编排器（指挥官模式）
- `skills/`：存放Pipeline Skill
- 最内层文件夹名必须与SKILL.md的 `name` 字段一致

## 输出路径规范

### 路径约定

所有Skill输出统一存放在**用户项目根目录**的 `output/` 下，遵循以下标准路径格式：

```
output/pm-{module}/{skill-name}/
```

- `pm-{module}`：模块级目录（不带序号，如 `pm-discovery`、`pm-design`）
- `{skill-name}`：Skill级子目录，与Skill的name字段一致
- 每个Skill的输出文件存放在自己的子目录下，避免文件名冲突
- output跟着用户项目走，不跟着Skill定义目录走

### 模块输出目录映射

```
output/
├── pm-discovery/                  ← 模块1：产品探索与发现
│   ├── user-research-voice-analysis/
│   ├── user-research-behavior-analysis/
│   ├── user-research-user-modeling/
│   ├── user-research-interview-assist/
│   ├── insight-jtbd/
│   ├── insight-5whys/
│   ├── insight-requirement-layers/
│   ├── insight-kano/
│   ├── insight-priority-scoring/
│   ├── market-tam-som/
│   ├── market-pest/
│   ├── market-competitor-intel/
│   ├── market-competitor-quadrant/
│   ├── market-competitor-report/
│   ├── opportunity-scoring/
│   ├── opportunity-hmw/
│   ├── opportunity-problem-statement/
│   └── opportunity-brief/
├── pm-strategy/                   ← 模块2：产品商业与战略
│   ├── business-model-canvas/
│   ├── business-value-fit/
│   ├── business-pricing/
│   ├── positioning-statement/
│   ├── positioning-value-curve/
│   ├── positioning-differentiation/
│   ├── positioning-exclusion/
│   ├── planning-swot/
│   ├── planning-porter-five-forces/
│   ├── planning-okr/
│   ├── planning-north-star/
│   ├── planning-roadmap/
│   ├── planning-ansoff/
│   ├── stakeholder-map/
│   ├── stakeholder-strategy-doc/
│   └── stakeholder-brief/
├── pm-design/                     ← 模块3：产品构思与设计（含PRD生成）
│   ├── requirements-collection/
│   ├── requirements-understanding/
│   ├── requirements-prioritization/
│   ├── ideation-hmw/
│   ├── ideation-scamper/
│   ├── ideation-inversion/
│   ├── ideation-convergence/
│   ├── design-prd/
│   ├── design-ia/
│   ├── design-userflow/
│   ├── design-prototype/
│   ├── validation-assumption-map/
│   ├── validation-mvp/
│   ├── validation-experiment/
│   └── validation-usability/
├── pm-metrics-design/             ← 模块4：产品度量设计
│   ├── metrics-system/
│   ├── tracking-plan/
│   └── metrics-dashboard/
├── pm-development/                ← 模块5：产品开发与上线
│   ├── development-task-breakdown/
│   ├── development-auto-review/
│   ├── development-prd-sync/
│   ├── quality-auto-test/
│   ├── quality-auto-acceptance/
│   ├── release-gradual/
│   ├── release-auto-checklist/
│   └── retrospective-auto/
├── pm-metrics-ops/                ← 模块6：产品度量运营
│   ├── analysis-anomaly/
│   ├── analysis-funnel/
│   ├── analysis-retention/
│   ├── experiment-design/
│   ├── experiment-execution/
│   ├── decision-dace/
│   ├── decision-insight/
│   └── decision-culture/
├── pm-growth/                     ← 模块7：产品增长与运营
│   ├── growth-model/
│   ├── acquisition-channel/
│   ├── acquisition-optimize/
│   ├── activation-aha/
│   ├── activation-onboarding/
│   ├── retention-churn/
│   ├── retention-engagement/
│   ├── revenue-funnel/
│   ├── revenue-nrr/
│   └── revenue-upsell/
├── pm-monitoring/                 ← 模块8：产品监控与迭代
│   ├── monitoring-system/
│   ├── monitoring-anomaly/
│   ├── monitoring-dashboard/
│   ├── monitoring-escalation/
│   ├── diagnosis-health/
│   ├── diagnosis-competition/
│   ├── iteration-backlog/
│   ├── iteration-prioritization/
│   └── iteration-retrospective/
└── pm-project/                    ← 模块9：项目管理与执行
    ├── planning-project-charter/
    ├── planning-resource/
    ├── planning-kickoff/
    ├── agile-sprint-planning/
    ├── agile-daily-sync/
    ├── agile-review/
    ├── risk-identification/
    ├── risk-monitoring/
    └── risk-escalation/
```

### 跨模块文件引用

当Skill需要读取其他模块的输出时，使用以下路径格式：

```
output/pm-{源模块}/{源skill-name}/{文件名}
```

示例：
- 模块3的Skill读取模块1的用户研究输出：`output/pm-discovery/user-research-voice-analysis/voice-analysis.json`
- 模块3的PRD读取模块2的战略输出：`output/pm-strategy/planning-okr/okr.json`
- 模块5的开发Skill读取PRD：`output/pm-design/design-prd/prd.md`

### 文件命名约定

- JSON数据文件：`{skill-name}.json` 或 `{描述性名称}.json`
- Markdown文档：`{描述性名称}.md`
- 图表文件：`charts/{图表名称}.png`
- 数据文件：`data/{数据名称}.csv` 或 `data/{数据名称}.json`

## AI能力边界

本方法论所有Skill在AI Agent中运行，存在以下能力边界：

### AI能做的
- 读取项目本地文件（output/目录下的上游产出）
- 分析用户粘贴的文本内容
- 处理用户上传的CSV/Excel/JSON文件
- 生成结构化分析报告和文档
- 执行逻辑推导、评分、排序等计算任务

### AI不能做的
- **访问外部数据库**：无法直连MySQL/PostgreSQL/MongoDB等
- **调用业务API**：无法访问公司内部API、第三方数据平台
- **获取实时数据**：无法从Google Analytics、Mixpanel、神策等分析平台拉取数据
- **操作外部系统**：无法在JIRA、飞书、企业微信等系统中创建任务
- **执行代码**：无法运行Python/SQL脚本进行数据处理

### 数据提供方式

当Skill需要外部数据时，用户需通过以下方式之一提供：
1. **直接粘贴**：将数据内容粘贴到对话中
2. **上传文件**：上传CSV/Excel/JSON文件
3. **提供路径**：提供本地文件路径，AI读取文件内容

每个Pipeline Skill的"降级策略 > 数据获取说明"中已包含该Skill所需数据的具体提供方式。

## 使用建议

1. **首次使用**：从模块1开始，按顺序执行
2. **按需使用**：根据当前阶段直接调用对应编排器
3. **单独使用**：也可以直接调用任意Pipeline Skill，不经过编排器
4. **数据传递**：上游模块的输出文件存放在 `output/pm-{module}/{skill-name}/` 下，下游Skill按路径约定读取
5. **人类决策**：所有关键决策点都需要人类确认，AI只提供建议
6. **外部数据**：AI无法访问外部系统，需用户手动提供数据（见"AI能力边界"）
