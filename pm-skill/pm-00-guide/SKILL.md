---
name: pm-00-guide
description: 产品方法论全流程导航。当用户提到"做产品""产品规划""从0到1""产品方法论""产品流程""做系统""做平台""做App""做商城""做SaaS""新项目"时使用，根据用户当前阶段和业务意图推荐对应的模块和Skill。关键词：产品方法论、产品流程、产品规划、从0到1、产品全流程、做系统、做平台、做App、做商城、做SaaS、做电商、做社交、做社区、做管理系统、新项目启动、做小程序、做网站、加功能、改需求、优化产品、增长、数据分析。
metadata:
  module: "产品方法论"
  sub-module: "导航入口"
  type: "guide"
  version: "2.0"
---

# 产品方法论全流程导航

## 产品全流程全景图

```
产品探索与发现 → 产品商业与战略 → 产品构思与设计（含PRD生成+变更影响分析）
       ↓                                    ↓
  产品度量设计(开发前)              [Backend开发与上线]
                                          ↓
                                  产品度量运营(上线后)
                                          ↓
                              产品增长与运营 ←→ 产品监控与迭代（含验收发布）
                                          ↓
                                    项目管理与执行（贯穿全程）
```

## 8大模块与入口编排器

| 阶段 | 模块 | 入口编排器 | 何时使用 |
|------|------|-----------|---------|
| 1 | 产品探索与发现 | user-research-orchestrator / insight-orchestrator / market-orchestrator / opportunity-orchestrator | 从0开始，不知道用户是谁、问题是什么 |
| 2 | 产品商业与战略 | business-orchestrator / positioning-orchestrator / planning-orchestrator / stakeholder-orchestrator | 已发现问题，需要确定商业模式和战略 |
| 3 | 产品构思与设计（含PRD生成+变更影响分析） | ideation-orchestrator / design-orchestrator / validation-orchestrator | 已有战略，需要设计方案、生成PRD并验证 |
| 4 | 产品度量设计 | metrics-orchestrator | 开发前，需要设计指标体系和埋点方案 |
| 5 | 产品度量运营 | analysis-orchestrator / experiment-orchestrator / decision-orchestrator | 上线后，需要数据分析和实验验证 |
| 6 | 产品增长与运营 | acquisition-orchestrator / activation-orchestrator / retention-orchestrator / revenue-orchestrator | 需要获取用户、提升留存、商业化 |
| 7 | 产品监控与迭代（含验收发布） | monitoring-orchestrator / diagnosis-orchestrator / iteration-orchestrator | 需要监控预警、问题诊断、迭代优化、验收发布 |
| 8 | 项目管理与执行 | project-planning-orchestrator / agile-orchestrator / risk-orchestrator | 贯穿全程的项目管理 |

## 意图路由

根据用户的自然语言输入，快速路由到对应的编排器或模板。

| 用户意图模式 | 路由目标 | 置信度 |
|---|---|---|
| 做\*系统 / 做\*平台 / 做\*App / 做\*商城 / 从0到1 / 新项目 / 做\*小程序 | product-launch-orchestrator | 高 |
| 加功能 / 改需求 / 优化 / 迭代 / 升级 / 新增模块 | product-iteration-orchestrator | 高 |
| 分析数据 / 看数据 / 漏斗 / 留存 / 异常 / 数据不好 | analysis-orchestrator | 高 |
| 增长 / 获客 / 变现 / AARRR / 用户量 / 收入 | growth-orchestrator | 高 |
| 写PRD / 需求文档 / 产品文档 / PRD | design-orchestrator | 高 |
| 竞品 / 市场 / 行业 / 市场规模 | market-orchestrator | 中 |
| 用户研究 / 调研 / 访谈 / Persona / 用户画像 | user-research-orchestrator | 高 |
| 商业模式 / 定价 / 画布 / 怎么赚钱 | business-orchestrator | 高 |
| 监控 / 告警 / 异常预警 / 线上问题 | monitoring-orchestrator | 高 |
| 项目管理 / Sprint / 敏捷 / 站会 | agile-orchestrator | 高 |
| 定位 / 差异化 / 竞争优势 | positioning-orchestrator | 中 |
| 需求分析 / 需求洞察 / KANO / JTBD | insight-orchestrator | 高 |
| 实验 / A/B测试 / 效果验证 | experiment-orchestrator | 高 |
| 质量保障 / 测试 / 验收 | quality-acceptance | 中 |
| 发布 / 上线 / 灰度 | release-gradual / release-auto-checklist / release-notes | 中 |

## 业务场景映射

将用户的业务语言翻译为方法论流程。当用户提到具体业务领域时，先识别业务类型，再推荐对应的场景模板和重点编排器。

| 用户可能的说法 | 业务类型 | 推荐模板 | 重点编排器 | 特别关注 |
|---|---|---|---|---|
| 做交易商城 / 电商 / 购物平台 / 电商小程序 | C端交易型 | 模板2 | product-launch-orchestrator | 支付安全(api-design)、交易数据(data-architecture)、增长全链路(acquisition→revenue) |
| 做SaaS / CRM / ERP / 管理系统 / OA / HR系统 | B端效率型 | 模板1 | product-launch-orchestrator | 权限设计(api-design)、多租户(data-architecture)、Stakeholder对齐 |
| 做社交 / 社区 / 内容平台 / 论坛 / 短视频 | C端内容型 | 模板2 | product-launch-orchestrator | 网络效应增长(growth-orchestrator)、内容审核安全 |
| 做金融 / 支付 / 借贷 / 保险 / 理财 | 金融合规型 | 模板1 | product-launch-orchestrator | 合规评估(Backend内建)、风控、交易流水(data-architecture) |
| 做教育 / 课程 / 知识付费 / 培训 | 内容交易型 | 模板2 | product-launch-orchestrator | 付费模式(business-pricing)、学习路径设计 |
| 做工具 / 效率 / 笔记 / 日历 / 待办 | 工具型 | 模板2 | product-launch-orchestrator | 激活(activation-aha)、留存策略(retention-orchestrator) |
| 做医疗 / 健康 / 健身 / 问诊 | 医疗健康型 | 模板1 | product-launch-orchestrator | 隐私合规(Backend内建)、数据安全 |
| 做物流 / 供应链 / 仓储 / 配送 | 供应链型 | 模板1 | product-launch-orchestrator | 数据架构(data-architecture)、系统集成 |
| 做游戏 / 娱乐 / 直播 | 娱乐型 | 模板2 | product-launch-orchestrator | 用户体验设计、留存与付费(revenue-orchestrator) |
| 做AI产品 / 智能助手 / ChatBot | AI产品型 | 模板2 | product-launch-orchestrator | 用户研究(user-research-orchestrator)、验证(validation-orchestrator) |

### 业务场景映射使用方法

1. **识别业务类型**：根据用户输入匹配上表的"用户可能的说法"列
2. **推荐模板**：使用对应行的"推荐模板"启动流程
3. **关注重点**：在流程执行中特别关注"特别关注"列标注的编排器和Skill
4. **一键启动**：直接调用"重点编排器"列的跨域编排器，它会自动协调全流程
5. **灵活调整**：业务场景映射是推荐起点，用户可根据实际情况调整流程

## 根据用户场景推荐

### 场景1：从0到1做新产品
推荐顺序：模块1 → 2 → 3 → 4 → 7

### 场景2：已有产品需要优化
推荐入口：模块5（数据分析）或 模块7（监控迭代）

### 场景3：需要增长
推荐入口：模块6（增长与运营）

### 场景4：需要做需求分析
推荐入口：模块1的 insight-orchestrator 或 模块3的 design-prd

### 场景5：需要写PRD
推荐入口：模块3 design-prd

### 场景6：项目管理和协作
推荐入口：模块8 project-planning-orchestrator

## 场景模板

场景模板提供完整的编排器调用序列，可直接按顺序执行，无需自行判断每个阶段该用哪个编排器。

### 模板1：从0到1做SaaS/B端产品

> 🚀 **一键启动**：使用跨领域编排器 `product-launch-orchestrator` 自动协调全流程

```
product-launch-orchestrator
  阶段1：探索与定位
    insight-orchestrator → market-orchestrator → business-orchestrator → positioning-orchestrator
  阶段2：设计与度量
    design-orchestrator → metrics-orchestrator
  阶段3：并行构建（PRD确认后同时启动）
    ├── api-design-orchestrator → data-architecture-orchestrator → backend-architecture-orchestrator
    └── ui-orchestrator
  阶段4：集成验证
    ui-orchestrator
  阶段5：验收与发布
    quality-acceptance → release-gradual / release-auto-checklist / release-notes
```

关键数据契约：
- design-orchestrator 输出 PRD → api-design-orchestrator 消费
- positioning-orchestrator 输出定位陈述 → ui-orchestrator 消费（品牌基因）
- metrics-orchestrator 输出指标体系 → quality-acceptance 消费（验收标准）
- 目标语言：用户在启动时指定（默认zh-CN），全链路传递至 ui-orchestrator

### 模板2：从0到1做C端/移动端产品

> 🚀 **一键启动**：使用跨领域编排器 `product-launch-orchestrator` 自动协调全流程（前端优先模式）

```
product-launch-orchestrator
  阶段1：用户研究与洞察
    user-research-orchestrator → insight-orchestrator → opportunity-orchestrator
  阶段2：战略与设计
    positioning-orchestrator → design-orchestrator → metrics-orchestrator
  阶段3：并行构建
    ├── ui-orchestrator（设计系统建立）
    └── api-design-orchestrator（后端API设计）
  阶段4：前端优先开发
    ui-orchestrator
  阶段5：验收与发布
    quality-acceptance → release-gradual / release-auto-checklist / release-notes
```

关键数据契约：
- design-orchestrator 输出 IA/原型 → ui-orchestrator 消费
- api-design-orchestrator 输出 OpenAPI契约 → ui-orchestrator 消费
- ui-orchestrator 内部传递设计令牌
- 目标语言：用户在启动时指定（默认zh-CN），全链路传递至 ui-orchestrator

### 模板3：已有产品数据驱动优化

```
阶段1：数据诊断
  analysis-orchestrator → decision-orchestrator

阶段2：迭代设计
  design-orchestrator（仅更新变更部分）→ metrics-orchestrator（补充新指标）

阶段3：验证与发布
  quality-acceptance → release-gradual / release-auto-checklist / release-notes

阶段4：效果验证
  experiment-orchestrator → analysis-orchestrator（对比前后数据）
```

关键数据契约：
- analysis-orchestrator 输出分析报告 → decision-orchestrator 消费（决策依据）
- experiment-orchestrator 输出实验结果 → analysis-orchestrator 消费（效果对比）

### 模板4：增长突破

```
阶段1：增长诊断
  growth-orchestrator → [瓶颈子编排器：acquisition / activation / retention / revenue]

阶段2：实验验证
  experiment-orchestrator

阶段3：规模化
  release-gradual / release-notes（全量发布增长方案）
```

关键数据契约：
- growth-orchestrator 输出增长诊断 → 瓶颈子编排器消费
- experiment-orchestrator 输出实验结果 → 增长方案是否全量发布的决策依据

### 模板5：功能迭代

> 🚀 **一键启动**：使用跨领域编排器 `product-iteration-orchestrator` 自动协调迭代全流程

```
product-iteration-orchestrator
  阶段1：需求分析
    design-orchestrator（需求分析由 design-prd 覆盖）
  阶段2：方案设计
    design-orchestrator（仅变更模块）
  阶段3：影响分析与条件分支执行
    ├── API需变更 → api-design-orchestrator → data-architecture-orchestrator → backend-architecture-orchestrator
    ├── UI需变更 → ui-orchestrator
    └── 无变更 → 跳过
  阶段4：集成与交付
    ui-orchestrator（仅API变更时）
    → quality-acceptance → release-gradual / release-auto-checklist / release-notes
```

关键数据契约：
- design-orchestrator 输出需求文档（由 design-prd 覆盖）→ 下游消费
- design-orchestrator 输出更新后的PRD → change-impact-analysis 消费

### 模板使用说明

1. **按需裁剪**：模板是完整路径，实际使用中可根据产品阶段跳过已完成的阶段
2. **并行启动**：标记为"并行"的阶段可同时启动，缩短整体周期
3. **数据依赖**：每个模板标注了关键数据契约，确保跨编排器的数据传递正确
4. **项目管理**：所有模板均可叠加 project-planning-orchestrator 进行项目管理
5. **降级执行**：如果某个编排器的上游数据不存在，该编排器仍可独立执行（按各Skill的降级策略）

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
│   └── skills/                         ← Pipeline Skill（10个）
│       ├── user-research-voice-analysis/SKILL.md
│       ├── insight-analysis/SKILL.md
│       └── ...（8个Pipeline）
├── pm-02-strategy/                     ← 模块2：产品商业与战略
│   ├── orchestrators/（4个编排器）
│   └── skills/（11个Pipeline）
├── pm-03-design/                       ← 模块3：产品构思与设计（含PRD生成+变更影响分析）
│   ├── orchestrators/（3个编排器）
│   └── skills/（12个Pipeline，含design-prd、change-impact-analysis）
├── pm-04-metrics-design/               ← 模块4：产品度量设计
│   ├── orchestrators/（1个编排器）
│   └── skills/（3个Pipeline）
├── pm-05-metrics-ops/                  ← 模块5：产品度量运营
│   ├── orchestrators/（3个编排器）
│   └── skills/（8个Pipeline）
├── pm-06-growth/                       ← 模块6：产品增长与运营
│   ├── orchestrators/（5个编排器）
│   └── skills/（11个Pipeline）
├── pm-07-monitoring/                   ← 模块7：产品监控与迭代（含验收发布）
│   ├── orchestrators/（3个编排器）
│   └── skills/（11个Pipeline，含quality-acceptance、release-gradual、release-auto-checklist、release-notes）
└── pm-08-project/                      ← 模块8：项目管理与执行
    ├── orchestrators/（3个编排器）
    └── skills/（8个Pipeline，agile-review含迭代复盘）
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
│   ├── user-research-report/
│   ├── insight-analysis/
│   ├── market-tam-som/
│   ├── market-pest/
│   ├── market-competitor-analysis/
│   └── opportunity-definition/
├── pm-strategy/                   ← 模块2：产品商业与战略
│   ├── business-model-canvas/
│   ├── business-value-fit/
│   ├── business-pricing/
│   ├── business-strategy-report/
│   ├── positioning-strategy/
│   ├── strategic-analysis/
│   ├── planning-okr/
│   ├── planning-north-star/
│   ├── planning-roadmap/
│   ├── stakeholder-analysis/
│   └── product-proposal/
├── pm-design/                     ← 模块3：产品构思与设计（含PRD生成+变更影响分析）
│   ├── ideation-workshop/
│   ├── design-prd/
│   ├── design-ia/
│   ├── design-userflow/
│   ├── design-prototype/
│   ├── design-handoff-spec/
│   ├── change-impact-analysis/
│   ├── validation-assumption-map/
│   ├── validation-mvp/
│   ├── validation-experiment/
│   ├── validation-usability/
│   └── interaction-spec/
├── pm-metrics-design/             ← 模块4：产品度量设计
│   ├── metrics-system/
│   ├── tracking-plan/
│   └── metrics-dashboard/
├── pm-metrics-ops/                ← 模块5：产品度量运营
│   ├── analysis-anomaly/
│   ├── analysis-funnel/
│   ├── analysis-retention/
│   ├── data-analysis-report/
│   ├── experiment-design/
│   ├── experiment-execution/
│   ├── decision-dace/
│   └── decision-culture/
├── pm-growth/                     ← 模块6：产品增长与运营
│   ├── growth-model/
│   ├── growth-strategy-report/
│   ├── gtm-strategy/
│   ├── product-operations-manual/
│   ├── acquisition-analysis/
│   ├── activation-aha/
│   ├── activation-onboarding/
│   ├── retention-management/
│   ├── revenue-funnel/
│   ├── revenue-nrr/
│   └── revenue-upsell/
├── pm-monitoring/                 ← 模块7：产品监控与迭代（含验收发布）
│   ├── monitoring-pipeline/
│   ├── diagnosis-health/
│   ├── diagnosis-competition/
│   ├── competitor-monitoring-report/
│   ├── user-feedback-loop-report/
│   ├── iteration-decision/
│   ├── quality-acceptance/
│   ├── release-gradual/
│   ├── release-auto-checklist/
│   ├── release-notes/
│   └── product-sunset-plan/
└── pm-project/                    ← 模块8：项目管理与执行
    ├── planning-project-charter/
    ├── planning-resource/
    ├── planning-kickoff/
    ├── agile-sprint-planning/
    ├── agile-daily-sync/
    ├── agile-review/
    ├── risk-identification/
    └── risk-management/
└── phase-reports/                 ← 编排器阶段总结
    ├── pm-discovery/
    ├── pm-strategy/
    ├── pm-design/
    ├── pm-metrics-design/
    ├── pm-metrics-ops/
    ├── pm-growth/
    ├── pm-monitoring/
    ├── pm-project/
    ├── ui/
    ├── backend/
    └── cross-domain/
```

### 跨模块文件引用

当Skill需要读取其他模块的输出时，使用以下路径格式：

```
output/pm-{源模块}/{源skill-name}/{文件名}
```

示例：
- 模块3的Skill读取模块1的用户研究输出：`output/pm-discovery/user-research-voice-analysis/voice-analysis.json`
- 模块3的PRD读取模块2的战略输出：`output/pm-strategy/planning-okr/okr.json`
- 模块8的验收Skill读取PRD：`output/pm-design/design-prd/prd.md`

### 文件命名约定

- JSON数据文件：`{skill-name}.json` 或 `{描述性名称}.json`
- Markdown文档：`{描述性名称}.md`
- 图表文件：`charts/{图表名称}.png`
- 数据文件：`data/{数据名称}.csv` 或 `data/{数据名称}.json`

### 输出校验规则

每个 Pipeline Skill 的输出部分包含 **输出校验规则** 表格，定义输出 JSON 的必填字段和类型约束。AI 生成输出后，必须对照校验规则验证：

| 校验项 | 规则 | 不达标处理 |
|--------|------|-----------|
| 必填字段完整性 | 所有标记为"必填"的字段必须存在 | 自动补填缺失字段，标注 `auto_filled: true`，置信度降为0.3 |
| 字段类型正确性 | 字段值类型必须匹配声明类型 | 尝试类型转换，转换失败则标注 `type_error: true` |
| 枚举值合法性 | enum 类型字段值必须在允许范围内 | 标注 `invalid_value: true`，建议人类修正 |
| 置信度标注 | 所有推断性字段必须标注置信度(0-1.0) | 缺失置信度的字段补填默认值0.3并标记 |
| 数组非空 | 标记为必填的 array 字段不能为空数组 | 标注 `empty_array: true`，建议人类补充数据 |

校验规则表格格式：

```
| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| 顶层字段 | object/array/string/number/boolean | 是/否 | 字段描述 |
| 嵌套字段 | ... | ... | ... |
```

> 注：校验规则为渐进式添加。核心 Skill（design-prd、api-design、design-system、metrics-system 等）已包含完整校验规则，其余 Skill 按需补充。

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
