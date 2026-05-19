---
name: planning-roadmap
description: 当需要制定产品路线图、季度规划、版本规划、资源分配时使用。路线图自动规划。基于OKR和战略方向，规划Epic级别的产品路线图，进行Now/Next/Later分层和RICE评分排序。关键词：产品路线图、版本规划、RICE评分、季度规划、Epic规划、做什么功能、排期规划。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "通用"]
  trigger_examples:
    - "帮我规划产品路线图"
    - "下个版本做什么"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "直接输出路线图和里程碑"
  deep_description: "完整路线图 + 依赖关系分析 + 风险缓冲设计 + 多场景路线图"
---

# 路线图自动规划

## 核心原则

1. **战略主题驱动**——Epic必须从OKR和SWOT战略主题分解而来，不可凭空规划
2. **RICE量化排序**——所有Epic使用RICE公式量化评分，排序有据可依
3. **Now/Next/Later分层**——按优先级和时间维度三层层级规划，避免扁平化罗列
4. **依赖风险显式**——每个Epic标注依赖项和风险，含缓解措施

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| OKR目标与关键结果 | JSON | 是 | output/pm-strategy/planning-okr/okr.json | Objective与Key Results |
| SWOT战略方向 | JSON | 是 | output/pm-strategy/strategic-analysis/strategic-analysis.json | SO/ST/WO/WT战略方向 |
| 需求优先级评分 | JSON | ○ | 由 design-prd 覆盖 | RICE评分结果 |
| 资源约束条件 | JSON | ○ | 用户提供 | 团队容量、预算、时间约束 |

## 执行步骤

### Step 1: 战略主题提取 [核心]

从OKR和SWOT中提取3-5个战略主题：

```
主题 = 战略方向 + 业务目标 + 价值主张
```

每个战略主题包含：
- 主题名称
- 支撑的OKR
- 战略意义

### Step 2: Epic级别规划 [核心]

将战略主题分解为季度Epic：

```yaml
epic:
  name: "Epic名称"
  quarter: "Q1 2024"
  description: "Epic描述"
  success_metric: "成功指标"
  rice_score: 75
  effort: "人月"
  dependencies:
    - "依赖项1"
    - "依赖项2"
  risks:
    - risk: "风险描述"
      likelihood: "high/medium/low"
      mitigation: "缓解措施"
  key_assumptions:
    - "关键假设1"
    - "关键假设2"
```

### Step 3: Now/Next/Later分层 [核心]

根据RICE评分和时间维度分层：

**Now (当前季度)**
- 已确认的高优先级Epic
- 必须完成的依赖项
- 高信心度项目

**Next (下一季度)**
- 计划中但可调整的Epic
- 依赖Now阶段结果
- 中等优先级项目

**Later (远期)**
- 方向性规划
- 需进一步验证的假设
- 低优先级或探索性项目

### Step 4: RICE评分计算 [核心]

RICE公式：
```
RICE Score = (Reach × Impact × Confidence) ÷ Effort
```

评分标准：
- **Reach (触达)**：影响的用户/客户数量
- **Impact (影响)**：对目标的正面影响程度 (0.25-3)
- **Confidence (信心)**：对数据和假设的信心度 (0.5-1)
- **Effort (工作量)**：完成所需的人月数

### Step 5: 风险标注 [核心]

识别并标注风险：
- 技术风险
- 资源风险
- 依赖风险
- 市场风险

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | 路线图和里程碑 | 核心结论 + 最小可行产物 |
| standard | 完整产物（当前默认） | 完整产物，包含全部Step输出 |
| deep | 完整路线图 + 依赖关系分析 + 风险缓冲设计 + 多场景路线图 | 完整产物 + 扩展分析 + 深度推演 |

## 输出

**存储路径**：`output/pm-strategy/planning-roadmap/`

**输出文件**：roadmap.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| roadmap.strategic_themes | array | 是 | 3-5个战略主题 |
| roadmap.strategic_themes[].theme | string | 是 | 主题名称 |
| roadmap.strategic_themes[].okr_reference | string | 是 | 关联OKR |
| roadmap.strategic_themes[].priority | number | 否 | 主题优先级排序 |
| roadmap.quarterly_epics | array | 是 | 季度Epic列表 |
| roadmap.quarterly_epics[].quarter | string | 是 | 季度标识 |
| roadmap.quarterly_epics[].epics | array | 是 | Epic列表 |
| roadmap.quarterly_epics[].epics[].name | string | 是 | Epic名称，不可为空 |
| roadmap.quarterly_epics[].epics[].success_metric | string | 否 | 成功指标 |
| roadmap.quarterly_epics[].epics[].rice_score | number | 是 | RICE评分 |
| roadmap.quarterly_epics[].epics[].effort | number | 是 | 工作量（人月） |
| roadmap.quarterly_epics[].epics[].dependencies | array | 否 | 依赖项列表 |
| roadmap.quarterly_epics[].epics[].risks | array | 是 | 风险列表 |
| roadmap.quarterly_epics[].epics[].risks[].risk | string | 是 | 风险描述 |
| roadmap.quarterly_epics[].epics[].risks[].likelihood | string | 是 | 可能性，枚举：high/medium/low |
| roadmap.quarterly_epics[].epics[].risks[].mitigation | string | 否 | 缓解措施 |
| roadmap.now_next_later | object | 是 | 三层分层 |
| roadmap.now_next_later.now | array | 是 | 当前季度Epic |
| roadmap.now_next_later.now[].epic | string | 是 | Epic名称 |
| roadmap.now_next_later.now[].quarter | string | 否 | 季度标识 |
| roadmap.now_next_later.now[].rationale | string | 否 | 分层理由 |
| roadmap.now_next_later.next | array | 是 | 下一季度Epic |
| roadmap.now_next_later.next[].epic | string | 是 | Epic名称 |
| roadmap.now_next_later.next[].quarter | string | 否 | 季度标识 |
| roadmap.now_next_later.next[].rationale | string | 否 | 分层理由 |
| roadmap.now_next_later.later | array | 是 | 远期Epic |
| roadmap.now_next_later.later[].epic | string | 是 | Epic名称 |
| roadmap.now_next_later.later[].quarter | string | 否 | 季度标识 |
| roadmap.now_next_later.later[].rationale | string | 否 | 分层理由 |

```yaml
roadmap:
  strategic_themes:
    - theme: "用户增长"
      okr_reference: "O1: 提升用户活跃度"
      priority: 1
    - theme: "商业变现"
      okr_reference: "O2: 优化单位经济"
      priority: 2
  quarterly_epics:
    - quarter: "Q1 2024"
      epics:
        - epic: "用户引导优化"
          success_metric: "新用户激活率提升30%"
          rice_score: 85
          effort: 3
          dependencies: ["设计资源"]
          risks:
            - risk: "技术实现复杂度"
              likelihood: "medium"
              mitigation: "预留技术调研时间"
          key_assumptions:
            - "数据分析支持优化方向"
    - quarter: "Q2 2024"
      epics:
        - epic: "社交功能开发"
          success_metric: "用户互动率提升50%"
          rice_score: 72
          effort: 5
          dependencies: ["后端API支持"]
          risks:
            - risk: "用户隐私合规"
              likelihood: "high"
              mitigation: "法务提前介入"
          key_assumptions:
            - "功能上线后用户接受度高"
  now_next_later:
    now:
      - epic: "用户引导优化"
        quarter: "Q1"
        rationale: "高RICE分数，直接支撑OKR"
    next:
      - epic: "社交功能开发"
        quarter: "Q2"
        rationale: "依赖Q1数据验证，需进一步调研"
    later:
      - epic: "国际化扩展"
        quarter: "Q3+"
        rationale: "长期战略方向，需市场验证"
```

## 决策规则

1. **RICE计算**：AI自动完成计算
2. **优先级决策**：人类决策最终优先级
3. **资源分配**：人类决策季度资源分配
4. **分层调整**：人类可调整Now/Next/Later分层

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] Epic有明确的成功指标
- [ ] 所有Epic有依赖关系标注

### P1 检查（standard/deep 必须通过）

- [ ] Now/Next/Later分层已完成
- [ ] RICE评分已计算
- [ ] 风险已识别并有缓解措施
- [ ] 资源估算合理

### P2 检查（仅 deep 必须通过）

- [ ] 扩展分析完整（深度推演和路线图已生成）
- [ ] 决策记录完整（关键决策有依据和替代方案）

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 | 数据获取说明 |
|---------------|---------|---------|------------|
| okr.json | 用户提供目标列表 → 直接规划路线图 | 缺乏OKR结构化数据，战略主题与OKR对齐度不足 | 要求用户提供业务目标和关键结果或上传okr.json文件 |
| strategic-analysis.json | 用户提供目标列表 → 直接规划路线图 | 缺乏战略分析数据，战略主题可能偏离战略方向 | 要求用户提供战略方向和优先级描述或上传strategic-analysis.json文件 |
| 需求优先级数据（insight-analysis / design-prd） | 用户提供目标列表 → 直接规划路线图 | 缺乏需求优先级数据，RICE评分缺乏输入依据 | 要求用户提供功能需求列表和优先级排序或上传insight-analysis.json文件 |
| okr.json + strategic-analysis.json + 需求优先级 | 用户提供目标列表 → 直接规划路线图 | 整体置信度降低，Epic排序缺乏数据锚定 | 要求用户提供业务目标、战略方向和功能优先级 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的目标列表直接规划路线图 | 整体置信度显著降低，路线图仅为通用规划参考 | 要求用户提供业务目标、功能需求和优先级排序 |
| 资源约束条件（用户提供） | 若用户未提供资源约束条件，提示用户提供或跳过该输入相关步骤 | 缺乏资源约束，Epic工作量估算可能不切实际 | 要求用户提供团队规模、技术栈和可用工期等资源约束信息 |

## 数据获取说明

本Skill需要OKR、战略分析和需求优先级数据，请通过以下方式之一提供：
  1. 直接描述业务目标和功能优先级
  2. 上传okr.json / strategic-analysis.json / insight-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| okr.json OKR调整 | 战略主题和Epic规划 | 重新执行Step 1-2，更新战略主题和Epic |
| strategic-analysis.json战略分析更新 | 战略主题方向 | 重新执行Step 1，更新战略主题 |
| 需求优先级数据变更 | RICE评分和排序 | 重新执行Step 4，更新RICE评分和分层 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 战略主题调整 | business-strategy-report、stakeholder-analysis | 输出文件版本号+变更摘要 |
| Epic优先级变更 | business-strategy-report | 输出文件版本号+变更摘要 |
| Now/Next/Later分层变更 | stakeholder-analysis | 输出文件版本号+变更摘要 |
