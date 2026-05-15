---
name: business-pricing
description: 当需要制定或优化产品定价策略时使用。定价策略自动分析，AI建议人类审批，分析竞品定价、推断用户支付意愿、生成3个差异化定价方案。关键词：定价策略、竞品分析、支付意愿、套餐设计、单位经济、怎么收费、定价方案。
metadata:
  module: "产品商业与战略"
  sub-module: "商业模式设计"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "电商", "通用"]
  trigger_examples:
    - "产品该怎么定价"
    - "定价方案怎么做"
  interaction_mode: "ai_suggest_human_approve"
---

# 定价策略自动分析

## 核心原则

1. **三方案对比**——必须生成渗透/价值/混合3个差异化定价方案供人类选择
2. **数据锚定定价**——竞品定价和支付意愿是定价的硬约束，不可凭感觉定价
3. **单位经济验证**——每个方案必须通过LTV/CAC等单位经济指标验证可行性
4. **风险前置**——定价过低损害品牌、过高阻碍获客等风险必须显式标注

**执行周期**：在Pipeline 2（价值主张匹配）完成后触发

**核心目标**：基于商业画布、竞品分析和用户支付意愿推断，生成3个差异化的定价方案，并完成单位经济效益分析。

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| BMC数据 | JSON | 是 | output/pm-strategy/business-model-canvas/bmc.json | 价值主张、收入模式、客户细分、成本结构 |
| 竞品定价数据 | JSON | 是 | output/pm-discovery/market-competitor-analysis/competitor-analysis.json | 竞品定价层级、市场定位、市场份额 |
| 支付意愿推断数据 | JSON | ○ | 用户提供 | 用户支付意愿区间、推断方法、置信度 |

### 必需输入

**BMC数据（来自Pipeline 1）：**
```json
{
  "value_propositions": [...],
  "revenue_models": [...],
  "customer_segments": [...],
  "cost_structure": {...}
}
```

**竞品定价数据：**
```json
{
  "competitor_pricing": [
    {
      "competitor_name": "竞品名称",
      "product_name": "产品名称",
      "pricing_tiers": [
        {
          "tier_name": "套餐名称",
          "price": "价格",
          "billing_cycle": "月/年/一次性",
          "features": ["功能1", "功能2"],
          "target_segment": "目标用户"
        }
      ],
      "market_position": "premium/mid-market/budget",
      "market_share": "市场份额估算"
    }
  ]
}
```

**用户支付意愿推断数据：**
```json
{
  "willingness_to_pay": {
    "inferred_price_range": {
      "min": "最低价格",
      "max": "最高价格",
      "optimal": "最优价格估算"
    },
    "confidence": 0.7,
    "inference_method": "direct_survey/conjoint_analysis/market_analog/comparative_judgment",
    "sample_size": 50,
    "segment_variations": [
      {
        "segment_id": "segment-1",
        "price_sensitivity": "high/medium/low",
        "willingness_range": {"min": "X", "max": "Y"}
      }
    ]
  }
}
```

## 执行步骤

### Step 1：竞品定价矩阵分析

**任务**：整合和系统化分析竞品定价策略。

**执行逻辑**：
1. 收集竞品定价数据
2. 按价格区间和目标市场进行分类
3. 分析定价结构模式（层级数、功能差异点）
4. 识别市场定价空白区域
5. 评估竞品定价的市场接受度

**输出格式：**
```json
{
  "competitor_pricing_matrix": {
    "premium_segment": {
      "price_range": "¥200-500/月",
      "players": ["竞品A", "竞品B"],
      "typical_features": ["完整功能", "高级支持"],
      "positioning": "企业级/高需求用户"
    },
    "mid_market_segment": {
      "price_range": "¥50-200/月",
      "players": ["竞品C"],
      "typical_features": ["核心功能+部分高级"],
      "positioning": "成长型团队"
    },
    "budget_segment": {
      "price_range": "¥0-50/月",
      "players": ["竞品D", "竞品E"],
      "typical_features": ["基础功能"],
      "positioning": "个人用户/入门级"
    },
    "market_gaps": [
      {
        "gap_description": "空白区域描述",
        "target_segment": "目标用户",
        "opportunity": "机会说明"
      }
    ]
  }
}
```

**验收标准**：
- 覆盖主要竞品
- 价格区间分类清晰
- 市场空白识别准确

### Step 2：支付意愿推断

**任务**：基于多种数据源推断用户支付意愿。

**推断方法优先级**：
1. 直接调研数据（置信度最高）
2. 联合分析法结果
3. 市场类比法
4. 比较判断法

**执行逻辑**：
1. 整合多种推断方法的结果
2. 加权平均计算综合支付意愿区间
3. 按用户细分群体分层分析
4. 评估推断置信度

**输出格式：**
```json
{
  "willingness_to_pay_analysis": {
    "overall_range": {
      "floor": "¥30/月",
      "ceiling": "¥300/月",
      "optimal": "¥80/月"
    },
    "confidence": 0.65,
    "confidence_breakdown": {
      "direct_survey_weight": 0.4,
      "conjoint_analysis_weight": 0.3,
      "market_analog_weight": 0.2,
      "comparative_judgment_weight": 0.1
    },
    "segment_analysis": [
      {
        "segment_id": "segment-1",
        "segment_name": "细分群体名称",
        "price_floor": "¥50/月",
        "price_ceiling": "¥200/月",
        "price_optimal": "¥80/月",
        "price_sensitivity": "medium"
      }
    ],
    "key_factors": [
      "功能完整性是主要价值驱动",
      "竞品价格锚定效应明显",
      "年度订阅意愿高于月度"
    ]
  }
}
```

**验收标准**：
- 推断方法透明
- 置信度有依据
- 细分群体差异已分析

### Step 3：定价方案生成

**任务**：生成3个差异化的定价方案。

#### 方案A：渗透定价方案

**定位**：市场进入策略，以有竞争力的价格快速获取用户

**执行逻辑**：
1. 参考竞品中低端定价
2. 考虑支付意愿下限
3. 设定可接受的初期亏损容忍期
4. 设计转化路径

**套餐结构示例：**
```json
{
  "pricing_option_a": {
    "name": "渗透定价",
    "positioning": "市场进入/用户获取",
    "tiers": [
      {
        "tier_name": "入门版",
        "price": 29,
        "billing_cycle": "monthly",
        "annual_price": 290,
        "features": ["核心功能", "5GB存储", "基础支持"],
        "limitations": ["用户上限5人", "无高级分析"],
        "target_segment": "个人用户/小团队"
      },
      {
        "tier_name": "专业版",
        "price": 79,
        "billing_cycle": "monthly",
        "annual_price": 790,
        "features": ["全功能", "50GB存储", "优先支持", "API访问"],
        "target_segment": "成长型团队"
      }
    ],
    "unit_economics": {
      "average_revenue_per_user": 54,
      "estimated_conversion_rate": "15%",
      "customer_acquisition_cost": 120,
      "payback_period_months": 3,
      "ltv_cac_ratio": 3.5
    },
    "risks": [
      "定价过低可能损害品牌认知",
      "初期亏损影响现金流",
      "价格调整空间有限"
    ],
    "recommended_timeline": "12-18个月后评估提价"
  }
}
```

#### 方案B：价值定价方案

**定位**：基于价值感知的中高端定价

**执行逻辑**：
1. 锚定用户支付意愿最优区间
2. 强调差异化价值的价值溢价
3. 设计清晰的功能分层
4. 包含一定的捆绑价值

**套餐结构示例：**
```json
{
  "pricing_option_b": {
    "name": "价值定价",
    "positioning": "价值导向/品质优先",
    "tiers": [
      {
        "tier_name": "标准版",
        "price": 99,
        "billing_cycle": "monthly",
        "annual_price": 990,
        "features": ["核心功能+", "20GB存储", "邮件支持"],
        "target_segment": "中小企业"
      },
      {
        "tier_name": "企业版",
        "price": 299,
        "billing_cycle": "monthly",
        "annual_price": 2990,
        "features": ["完整功能", "无限存储", "专属支持", "SSO集成", " SLA保障"],
        "target_segment": "大型企业"
      }
    ],
    "unit_economics": {
      "average_revenue_per_user": 199,
      "estimated_conversion_rate": "8%",
      "customer_acquisition_cost": 150,
      "payback_period_months": 2,
      "ltv_cac_ratio": 5.2
    },
    "risks": [
      "获客难度较高",
      "需要强价值传递支撑"
    ],
    "recommended_timeline": "持续执行"
  }
}
```

#### 方案C：混合定价方案

**定位**：分层覆盖，最大化市场覆盖和收入潜力

**执行逻辑**：
1. 引入免费层级建立用户基础
2. 中间层级作为主力收入
3. 高端层级捕获高价值客户
4. 设计清晰的升级路径

**套餐结构示例：**
```json
{
  "pricing_option_c": {
    "name": "混合定价",
    "positioning": "全面覆盖/收入最大化",
    "tiers": [
      {
        "tier_name": "免费版",
        "price": 0,
        "features": ["基础功能", "1GB存储", "社区支持"],
        "limitations": ["功能受限", "有使用限制"],
        "target_segment": "个人用户/试用"
      },
      {
        "tier_name": "付费版",
        "price": 59,
        "billing_cycle": "monthly",
        "annual_price": 590,
        "features": ["进阶功能", "30GB存储", "优先支持"],
        "target_segment": "专业用户"
      },
      {
        "tier_name": "团队版",
        "price": 199,
        "billing_cycle": "monthly",
        "annual_price": 1990,
        "features": ["团队协作", "100GB存储", "专属CSM", "高级权限"],
        "target_segment": "团队/部门"
      }
    ],
    "unit_economics": {
      "average_revenue_per_user": 89,
      "free_to_paid_conversion": "5%",
      "paid_tier_conversion": "12%",
      "customer_acquisition_cost": 80,
      "payback_period_months": 2.5,
      "ltv_cac_ratio": 4.2
    },
    "risks": [
      "免费版运维成本",
      "定价层级管理复杂度",
      "内部竞争可能分流"
    ],
    "recommended_timeline": "视初期数据调整层级"
  }
}
```

## 输出

**存储路径**：`output/pm-strategy/business-pricing/`

**输出文件**：pricing_analysis.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| pricing_analysis.competitor_pricing_matrix | object | 是 | 含premium/mid/budget三段分析 |
| pricing_analysis.willingness_to_pay | object | 是 | 含整体区间、置信度、细分分析 |
| pricing_analysis.pricing_options.option_a | object | 是 | 渗透定价方案，含tiers和unit_economics |
| pricing_analysis.pricing_options.option_b | object | 是 | 价值定价方案，含tiers和unit_economics |
| pricing_analysis.pricing_options.option_c | object | 是 | 混合定价方案，含tiers和unit_economics |
| pricing_options.*.unit_economics.ltv_cac_ratio | number | 是 | LTV/CAC比值，健康标准≥3 |
| pricing_options.*.unit_economics.payback_period_months | number | 是 | 回本周期（月） |
| pricing_analysis.recommendation.recommended_option | string | 是 | A/B/C |
| pricing_analysis.recommendation.reasoning | string | 是 | 推荐理由 |

### 完整定价分析报告

```json
{
  "pricing_analysis": {
    "competitor_pricing_matrix": {...},
    "willingness_to_pay": {...},
    "pricing_options": {
      "option_a": {...},
      "option_b": {...},
      "option_c": {...}
    },
    "recommendation": {
      "recommended_option": "A/B/C",
      "reasoning": "推荐理由",
      "alternative_for_mitigation": "备选方案"
    }
  }
}
```

## 决策规则

### 支付意愿置信度规则

**置信度<0.5时的处理**：
1. 标注建议预售测试验证
2. 提供降低不确定性所需的最小样本量
3. 建议保守定价策略作为备选
4. 明确标注定价数字需要人类拍板

### 定价数字规则

**必须人类拍板的决策**：
- 具体定价数字（任何方案的定价）
- 套餐结构设计
- 折扣力度
- 价格调整时机

### AI辅助范围

**AI可自动完成的分析**：
- 竞品数据整合和可视化
- 支付意愿区间推断
- 单位经济计算
- 敏感性分析
- 方案对比表格生成

## 质量检查

### 自检清单

- [ ] 3个定价方案都已生成
- [ ] 每个方案包含差异化定位
- [ ] 单位经济计算正确：
  - ARPU计算逻辑正确
  - CAC分摊合理
  - LTV计算包含留存假设
  - 盈亏平衡分析完整
- [ ] 风险已完整标注
- [ ] 竞品矩阵覆盖主要竞品
- [ ] 支付意愿推断方法透明

### 计算验证

**单位经济验证清单**：
- [ ] ARPU = Σ(套餐价格 × 套餐用户占比)
- [ ] CAC包括获取成本（广告、BD等）分摊
- [ ] LTV = ARPU × 平均生命周期（月）
- [ ] 回收期 = CAC / (ARPU - 边际成本)
- [ ] LTV/CAC ≥ 3（健康标准）

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| bmc.json | 用户提供产品描述 → 基于行业基准推荐定价 | 价值主张和成本结构缺乏BMC数据支撑，定价可能偏离实际 |
| 竞品定价数据（competitor-analysis.json） | 用户提供产品描述 → 基于行业基准推荐定价 | 竞品矩阵为空，市场空白无法识别，定价缺乏竞品锚定 |
| bmc.json + 竞品定价数据 | 用户提供产品描述和目标市场 → 基于行业基准推荐定价 | 整体置信度降低，方案缺乏数据锚定 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的产品描述和行业基准推荐定价 | 整体置信度显著降低，方案仅为行业基准参考 |
| 支付意愿推断数据（用户提供） | 若用户未提供支付意愿推断数据，提示用户提供或跳过该输入相关步骤 | 支付意愿分析缺失，定价方案缺乏用户端验证 |

## 数据获取说明

本Skill需要BMC和竞品定价数据，请通过以下方式之一提供：
  1. 直接描述产品功能、目标用户和定价预期
  2. 上传bmc.json / competitor-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| bmc.json价值主张更新 | 定价方案的价值锚点需调整 | 重新评估各方案定价合理性，更新价值溢价依据 |
| bmc.json客户细分变更 | 支付意愿分段和套餐目标用户 | 重新执行Step 2和Step 3，按新细分调整定价 |
| bmc.json成本结构变更 | 单位经济指标需重新计算 | 重新计算LTV/CAC和回本周期 |
| competitor-analysis竞品定价更新 | 竞品定价矩阵和市场空白 | 重新执行Step 1，更新竞品对标 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 定价方案调整 | business-strategy-report、stakeholder-analysis | 输出文件版本号+变更摘要 |
| 单位经济指标变更 | business-strategy-report | 输出文件版本号+变更摘要 |
| 竞品定价矩阵更新 | positioning-strategy | 输出文件版本号+变更摘要 |

---

## Human Review Checklist

在提交人类审批前，确保以下内容已呈现：

### 竞品分析
- [ ] 主要竞品定价已覆盖
- [ ] 价格区间分布清晰
- [ ] 市场空白已识别

### 支付意愿
- [ ] 推断方法已说明
- [ ] 置信度已标注
- [ ] 细分差异已分析

### 定价方案
- [ ] 3个方案定位差异化明显
- [ ] 单位经济指标已计算
- [ ] 风险已标注
- [ ] 方案优劣对比清晰

### 建议
- [ ] 推荐方案有清晰理由
- [ ] 备选方案已提供
- [ ] 决策所需信息完整

## 数据流规范

### 输入目录
```
input/
├── bmc/
│   └── business_model_canvas.json
├── competitor/
│   └── competitor_pricing.json
└── research/
    └── willingness_to_pay.json
```

### 输出目录
```
output/pm-strategy/
└── business-pricing/
    └── pricing_analysis.json
```
