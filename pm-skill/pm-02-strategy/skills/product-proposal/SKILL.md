---
name: product-proposal
description: 当需要撰写产品立项提案时使用。产品立项提案自动生成，整合所有前序分析结果，生成结构化的产品立项文档。关键词：产品立项、产品提案、立项文档、商业计划书、产品规划文档、立项申请、项目提案。
metadata:
  module: "产品商业与战略"
  sub-module: "产品立项"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "通用"]
  trigger_examples:
    - "帮我写产品立项文档"
    - "产品提案怎么写"
  interaction_mode: "ai_suggest_human_approve"
---

# 产品立项提案自动生成

## 核心原则

1. **证据链闭环**——提案中每个结论必须可追溯到前序分析数据，拒绝无据断言
2. **决策点显式**——所有需要人类决策的关键节点必须标注，不可AI代决
3. **风险前置**——技术/市场/资源/合规风险必须在提案中显式呈现
4. **一页纸先行**——执行摘要必须一页纸说清核心逻辑，详细内容作为支撑

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 用户研究数据 | JSON | ○ | user-research-user-modeling | 用户画像、痛点、需求 |
| 商业模式画布 | JSON | ○ | output/pm-strategy/business-model-canvas/bmc.json | 商业模式9宫格 |
| SWOT分析 | JSON | ○ | output/pm-strategy/strategic-analysis/strategic-analysis.json | 战略态势 |
| OKR | JSON | ○ | output/pm-strategy/planning-okr/okr.json | 目标与关键结果 |
| 路线图 | JSON | ○ | output/pm-strategy/planning-roadmap/roadmap.json | 产品路线图 |
| 定价策略 | JSON | ○ | output/pm-strategy/business-pricing/pricing_analysis.json | 定价方案 |
| 定位策略 | JSON | ○ | output/pm-strategy/positioning-strategy/positioning-strategy.json | 产品定位 |
| 利益相关者 | JSON | ○ | output/pm-strategy/stakeholder-analysis/stakeholder-analysis.json | 利益相关者 |
| 产品/业务信息 | string | 是 | 用户提供 | 产品名称、业务描述 |

## 执行步骤

### Step 1: 执行摘要生成

生成一页纸执行摘要，包含：

| 要素 | 内容 |
|------|------|
| 产品名称 | 产品名称和一句话描述 |
| 目标用户 | 核心用户群体 |
| 核心价值 | 价值主张一句话 |
| 商业模式 | 收入模式概述 |
| 市场机会 | 市场规模和增长 |
| 竞争优势 | 差异化优势 |
| 关键指标 | 北极星指标+核心OKR |
| 资源需求 | 团队、预算、时间 |
| 关键风险 | Top3风险 |
| 决策请求 | 需要审批的事项 |

### Step 2: 产品定义

整合用户研究和定位数据：

**产品概述**：
- 产品愿景
- 目标用户画像
- 核心使用场景
- 价值主张

**功能范围**：
- MVP功能列表
- V2.0功能规划
- 功能优先级

### Step 3: 商业分析

整合BMC、定价和SWOT数据：

**市场分析**：
- 市场规模（TAM/SAM/SOM）
- 市场增长趋势
- 目标市场定位

**商业模式**：
- 收入模式
- 定价策略
- 成本结构
- 单位经济

**竞争分析**：
- 竞品对比
- 差异化优势
- 竞争壁垒

### Step 4: 执行计划

整合OKR和路线图数据：

**目标体系**：
- 年度OKR
- 季度里程碑
- 关键指标

**路线图**：
- Now/Next/Later
- 资源需求
- 依赖关系

### Step 5: 风险评估

识别和评估关键风险：

| 风险类别 | 评估维度 |
|----------|----------|
| 市场风险 | 需求变化、竞品动作、市场萎缩 |
| 技术风险 | 技术可行性、性能瓶颈、安全合规 |
| 资源风险 | 人才短缺、预算不足、时间压力 |
| 执行风险 | 团队能力、协作效率、外部依赖 |

### Step 6: 文档组装

**提案结构**：

```
# {产品名}产品立项提案

## 执行摘要（一页纸）

## 1. 产品定义
### 1.1 产品愿景
### 1.2 目标用户
### 1.3 核心价值
### 1.4 功能范围

## 2. 商业分析
### 2.1 市场机会
### 2.2 商业模式
### 2.3 竞争分析

## 3. 执行计划
### 3.1 目标体系
### 3.2 产品路线图
### 3.3 资源需求

## 4. 风险评估
### 4.1 风险矩阵
### 4.2 缓解措施

## 5. 决策请求
### 5.1 需要审批的事项
### 5.2 建议的下一步

## 附录
- 数据来源
- 假设清单
- 详细分析
```

## 输出

**存储路径**：`output/pm-strategy/product-proposal/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| product-proposal.md | Markdown | 完整产品立项提案 |
| product-proposal.json | JSON | 结构化数据 |

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| proposal_metadata.product_name | string | 是 | 产品名称 |
| proposal_metadata.generated_at | string | 是 | 生成时间戳 |
| proposal_metadata.data_sources | array | 是 | 数据来源列表 |
| proposal_metadata.overall_confidence | number | 是 | 整体置信度0-1 |
| executive_summary.product_name | string | 是 | 产品名称 |
| executive_summary.target_user | string | 是 | 目标用户 |
| executive_summary.core_value | string | 是 | 核心价值 |
| executive_summary.business_model | string | 是 | 商业模式 |
| executive_summary.market_opportunity | string | 是 | 市场机会 |
| executive_summary.key_risks | array | 是 | Top3风险 |
| executive_summary.decision_requests | array | 是 | 需审批事项 |
| product_definition | object | 是 | 产品定义 |
| business_analysis | object | 是 | 商业分析 |
| execution_plan | object | 是 | 执行计划 |
| risk_assessment | object | 是 | 风险评估 |
| decision_requests | array | 是 | 决策请求 |

```json
{
  "proposal_metadata": {
    "product_name": "产品名",
    "generated_at": "时间戳",
    "data_sources": [],
    "overall_confidence": 0.0
  },
  "executive_summary": {
    "product_name": "产品名",
    "target_user": "目标用户",
    "core_value": "核心价值",
    "business_model": "商业模式",
    "market_opportunity": "市场机会",
    "competitive_advantage": "竞争优势",
    "key_metrics": {},
    "resource_needs": {},
    "key_risks": [],
    "decision_requests": []
  },
  "product_definition": {},
  "business_analysis": {},
  "execution_plan": {},
  "risk_assessment": {},
  "decision_requests": []
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 所有上游数据完整 | 生成完整提案 |
| 部分上游数据缺失 | 标注缺失部分，基于已有数据生成 |
| 关键数据缺失（用户/市场） | 提示补充数据，降低置信度 |
| 整体置信度<0.5 | 标注"建议补充数据后再审批" |

## 质量检查

- [ ] 执行摘要一页纸可读完
- [ ] 产品定义清晰完整
- [ ] 商业分析有数据支撑
- [ ] 执行计划可落地
- [ ] 风险评估覆盖4类风险
- [ ] 决策请求明确
- [ ] 数据来源可追溯

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 用户研究数据 | 基于产品描述推导用户画像 | 用户定义缺乏实证数据，画像可能偏主观 |
| bmc.json | 基于产品描述推导商业模式 | 商业模式缺乏9格画布结构化支撑 |
| strategic-analysis.json | 基于产品描述推导战略态势 | 战略分析缺乏结构化依据 |
| okr.json | 基于产品描述推导目标 | OKR缺乏战略对齐，可量化性可能不足 |
| roadmap.json | 基于产品描述推导路线图 | 路线图缺乏RICE排序依据 |
| 定价/定位/利益相关者数据 | 基于产品描述推导 | 对应章节缺乏数据锚定 |
| 所有上游文件均缺失 | 基于用户提供的产品描述生成完整提案 | 整体置信度显著降低，提案缺乏数据支撑 |

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 用户研究数据更新 | 产品定义、目标用户 | 更新产品定义章节 |
| bmc.json商业模式变更 | 商业分析章节 | 更新商业模式和单位经济 |
| strategic-analysis.json战略分析更新 | 商业分析竞争分析 | 更新竞争分析和风险评估 |
| okr.json OKR调整 | 执行计划章节 | 更新目标体系和路线图 |
| roadmap.json路线图变更 | 执行计划章节 | 更新路线图和资源需求 |
| 定价策略变更 | 商业分析章节 | 更新定价策略和单位经济 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 提案内容变更 | stakeholder-analysis | 输出文件版本号+变更摘要 |
| 风险评估变更 | stakeholder-analysis | 输出文件版本号+变更摘要 |
| 决策请求变更 | stakeholder-analysis | 输出文件版本号+变更摘要 |
