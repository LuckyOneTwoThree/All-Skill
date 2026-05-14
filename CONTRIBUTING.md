# 贡献指南

感谢你对 All-Skill 的关注！本文档帮助你快速参与贡献。

## 贡献方式

| 方式 | 适合人群 | 入口 |
|------|---------|------|
| 新增 Skill | 有方法论经验，想补全新能力 | [New Skill Issue](https://github.com/LuckyOneTwoThree/All-Skill/issues/new?template=new-skill.yml) |
| 改进现有 Skill | 发现某个 Skill 可以更好 | [Improve Skill Issue](https://github.com/LuckyOneTwoThree/All-Skill/issues/new?template=improve-skill.yml) |
| 报告问题 | 使用 Skill 时遇到问题 | [Bug Issue](https://github.com/LuckyOneTwoThree/All-Skill/issues/new?template=bug-skill.yml) |

## 快速开始

### 1. 选择你要做的事

- **从 ROADMAP.md 认领**：查看待实现的 Skill，选择你感兴趣的方向
- **从 Good First Issue 开始**：搜索 `good first issue` 标签，找低门槛任务
- **自主提案**：发现现有体系缺少某个方法论，提 Issue 讨论

### 2. 使用模板编写 Skill

```
templates/
├── pipeline-skill-template/SKILL.md      Pipeline Skill 模板
└── orchestrator-skill-template/SKILL.md   Orchestrator Skill 模板
```

复制对应模板，按模板中的 `{占位符}` 提示填写内容。

### 3. 提交前校验

```bash
node scripts/validate-skill.js {skill-name}/SKILL.md
```

确保所有必填项通过后再提交 PR。

---

## Skill 编写规范

### 命名规范

```
格式：{领域}-{方法论名}

领域前缀：
  pm-skill       → insight / market / opportunity / user-research / business / planning / positioning / stakeholder / ideation / requirements / design / validation / metrics / development / quality / release / retrospective / analysis / decision / experiment / growth / acquisition / activation / retention / revenue / monitoring / diagnosis / iteration / agile / planning / risk
  ui-skill       → design-system / component / page / ui / frontend / api-contract
  backend-skill  → api / data / architecture / backend / auth / cache
  cross-domain   → product

示例：
✅ insight-analysis          （需求洞察-5Whys）
✅ api-contract           （API设计-契约）
✅ design-system           （设计系统一体化）
❌ 5whys                  （缺少领域前缀）
❌ insight_5whys          （使用了下划线）
❌ Insight-5Whys          （大写不规范）
```

### description 触发词规范

```
格式：当需要{触发场景}时使用。{一句话功能描述}。关键词：{关键词1}、{关键词2}、{关键词3}。

触发场景：描述什么情况下用户会需要这个 Skill
功能描述：一句话说清这个 Skill 做什么
关键词：3-5个，用顿号分隔，用于 AI 自动匹配

示例：
✅ 当需要对关键痛点或问题现象进行根因深挖时使用。5Whys结构化根因分析，通过逐层追问定位可行动的根因和改进点。关键词：5Whys、根因分析、因果链、痛点深挖、原因追溯。
❌ 5Whys分析工具。（太简略，AI 无法匹配）
```

### Frontmatter 规范

```yaml
---
name: {与父目录名一致}
description: {触发词格式}
metadata:
  module: "{所属模块中文名}"
  sub-module: "{所属子模块中文名}"
  type: "pipeline | orchestrator | guide"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve | ai_auto | human_ai_collaborate"
  domain_tags: ["{行业标签1}", "{行业标签2}", "通用"]
  trigger_examples:
    - "{用户可能说的自然语言示例1}"
    - "{用户可能说的自然语言示例2}"
---
```

**type 取值**：

| 值 | 说明 |
|----|------|
| pipeline | 单个方法论 Pipeline，可独立执行 |
| orchestrator | 编排器，调度子 Skill 执行顺序 |
| guide | 导航入口，根据场景推荐模块 |

**interaction_mode 取值**：

| 值 | 符号 | 适用场景 |
|----|------|----------|
| ai_auto | 🤖 | 纯数据处理、格式转换、审查检查 |
| ai_suggest_human_approve | 🤖→👤 | 方案选择、分类判断、优先级排序 |
| human_ai_collaborate | 👤→🤖 | 目标设定、品牌规范、价值判断 |

**domain_tags（推荐）**：

标注 Skill 适用的业务行业标签，帮助 AI 根据用户业务领域精准匹配 Skill。

| 规则 | 说明 |
|------|------|
| 格式 | 字符串数组，至少包含 `"通用"` |
| 可选标签 | 电商、SaaS、社交、金融、教育、医疗、物流、游戏、工具、通用 |
| 用途 | 当用户提到具体行业时，AI 可通过 domain_tags 二次过滤推荐相关 Skill |

**trigger_examples（推荐）**：

提供用户可能说的自然语言示例，帮助 AI 更准确地匹配用户意图。

| 规则 | 说明 |
|------|------|
| 格式 | 字符串数组，至少 2 条 |
| 要求 | 使用用户的日常语言，避免方法论术语 |
| 用途 | AI 参考示例理解用户意图，提升匹配准确度 |

### 输出路径规范

```
格式：output/{领域路径}/{skill-name}/{output-filename}

领域路径映射：
  pm-skill       → pm-discovery / pm-strategy / pm-design / pm-metrics-design / pm-development / pm-metrics-ops / pm-growth / pm-monitoring / pm-project
  ui-skill       → ui-design-system / ui-frontend / ui-frontend-integration
  backend-skill  → backend-api-design / backend-data-architecture / backend-architecture

示例：
✅ output/pm-discovery/insight-analysis/insight-analysis.json
✅ output/backend-api-design/api-contract/openapi.yaml
❌ output/5whys.json                        （缺少领域路径）
❌ output/pm/insight-analysis/insight-analysis.json       （领域路径不正确）
```

### 目录放置规范

新增 Skill 放入对应领域模块的 `skills/` 目录下：

```
pm-skill/pm-01-discovery/skills/your-new-skill/SKILL.md
backend-skill/backend-01-api-design/skills/your-new-skill/SKILL.md
ui-skill/ui-01-design-system/skills/your-new-skill/SKILL.md
```

新增 Orchestrator 放入对应领域模块的 `orchestrators/` 目录下：

```
pm-skill/pm-01-discovery/orchestrators/your-new-orchestrator/SKILL.md
```

**关键**：`name` 字段必须与直接父目录名一致。Trae 按 `name` 字段识别 Skill。

---

## 参考实现

编写新 Skill 时，请参考以下标杆 Skill 的写法：

### Pipeline Skill 参考

| 领域 | Skill | 参考亮点 |
|------|-------|----------|
| PM | insight-analysis | 输入输出完整、决策规则清晰、降级策略完善 |
| UI | design-system | 多平台输出、对比度校验、上游变更响应完整 |
| Backend | api-contract | 契约驱动、降级策略、上下游通知机制完整 |

### Orchestrator 参考

| 类型 | Skill | 参考亮点 |
|------|-------|----------|
| 领域内编排器 | insight-orchestrator | 编排协议+Pipeline定义+post_pipeline、调用指令格式、阶段总结（强制）、卡口清晰 |
| 跨领域编排器 | product-launch-orchestrator | 并行分支Pipeline、异常处理、阶段总结（post_pipeline） |

---

## 修改边界

### 可安全修改（不影响其他 Skill）

- 核心原则的措辞优化
- 执行步骤的细化（增加子步骤）
- 决策规则的补充（增加新条件）
- 质量检查项的增加
- 降级策略的完善
- Input/Output JSON 示例的补充

### 需要谨慎修改（可能影响上下游）

- 输出 Schema 的 required 字段变更（下游 Skill 可能依赖）
- 输出文件路径变更（编排器中硬编码了路径）
- 输入来源路径变更（影响数据契约）

修改此类内容时，请在 PR 中说明：
1. 变更影响范围
2. 受影响的下游 Skill（搜索 `output/` 路径可找到）
3. 下游 Skill 的降级策略是否能处理该变更

### 不可修改（需维护者审批）

- Skill 的 `name` 字段
- 所属领域/模块归属
- 编排器中的阶段顺序
- 跨领域数据契约定义

---

## PR 流程

1. Fork 本仓库
2. 创建分支：`feat/{skill-name}` 或 `fix/{skill-name}`
3. 按模板编写或修改 Skill
4. 运行校验：`node scripts/validate-skill.js {skill-name}/SKILL.md`
5. 提交 PR，标题格式：`feat: 新增 {skill-name}` 或 `fix: 修复 {skill-name} 的 {问题}`
6. 等待自动校验和人工 Review

### PR 检查清单

- [ ] `name` 字段与父目录名一致
- [ ] `description` 符合触发词格式
- [ ] 输入表包含：输入项、类型、必填、来源、说明
- [ ] 输出包含：文件路径、Schema 或校验规则
- [ ] 质量检查项已填写
- [ ] 降级策略已填写
- [ ] 如涉及数据契约变更，已说明影响范围
