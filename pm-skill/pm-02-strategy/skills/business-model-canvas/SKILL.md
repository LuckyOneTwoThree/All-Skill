---
name: business-model-canvas
description: 当需要设计或评估产品商业模式时触发。商业模式画布自动生成，将产品探索阶段洞察转化为9格商业画布。关键词：商业模式画布、BMC、价值主张、收入模式、成本结构、怎么赚钱、商业模式梳理。
metadata:
  module: "产品商业与战略"
  sub-module: "商业模式设计"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["SaaS", "电商", "通用"]
  trigger_examples:
    - "帮我把商业模式理清楚"
    - "我们的商业模式怎么赚钱"
  interaction_mode: "ai_suggest_human_approve"
---

# 商业模式画布自动生成

## 核心原则

1. **九格联动**——画布9要素必须逻辑自洽，客户细分→价值主张→渠道→收入形成闭环
2. **选项优于定论**——收入模式等关键决策点生成2-3个可比较选项，由人类选择
3. **假设显式标注**——所有推断内容标注为假设，含风险等级和验证方法
4. **财务自动推算**——单位经济、敏感性分析由AI自动完成，人类只审核结论

**执行周期**：在产品探索阶段完成后触发

**核心目标**：将产品探索阶段收集的用户洞察、市场数据转化为结构化的商业模式画布，明确价值创造、传递和获取的系统架构。

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| product_context | JSON | 是 | user-research-user-modeling / opportunity-definition | 探索阶段输出：用户画像、问题陈述、机会定义 |
| market_data | JSON | 是 | market-competitor-analysis | 市场数据：竞品商业模式、市场规模、行业基准 |

### 必需输入

**product_context（来自探索阶段）：**
```json
{
  "persona_summary": "目标用户画像摘要，包含用户特征、需求、痛点",
  "problem_statement": "用户问题陈述，明确要解决的核心问题",
  "opportunity_definition": "商业机会定义，包含市场规模、机会描述"
}
```

**market_data（市场数据）：**
```json
{
  "competitor_business_models": [
    {
      "competitor_name": "竞品名称",
      "business_model_type": "竞品商业模式类型",
      "key_elements": {
        "value_proposition": "竞品价值主张",
        "revenue_model": "竞品收入模式",
        "pricing": "竞品定价"
      }
    }
  ],
  "market_size": {
    "tam": "总可寻址市场",
    "sam": "可服务市场",
    "som": "可获得市场"
  },
  "industry_benchmarks": {
    "typical_margin": "行业典型利润率",
    "typical_pricing": "行业典型定价范围",
    "customer_acquisition_cost": "行业获客成本基准"
  }
}
```

## 执行步骤

### Step 1：客户细分填充

**任务**：基于用户画像和痛点分析，定义目标客户细分群体。

**执行逻辑**：
1. 提取探索阶段的用户画像关键特征
2. 按需求优先级和可触达性划分细分群体
3. 为每个细分群体定义核心特征

**输出格式**：
```json
{
  "customer_segments": [
    {
      "segment_id": "segment-1",
      "name": "中小型培训机构",
      "characteristics": ["学员规模50-500人", "有线上化转型需求"],
      "primary_pains": ["缺乏技术能力自建在线教学平台"],
      "priority": "high/medium/low"
    }
  ]
}
```

**验收标准**：
- 至少识别2个差异化客户细分群体
- 每个群体有明确的特征描述
- 优先级排序有数据支撑

### Step 2：价值主张填充

**任务**：基于用户痛点和竞品分析，设计差异化价值主张。

**执行逻辑**：
1. 提取用户核心痛点和高优先级需求
2. 分析竞品价值主张的覆盖和缺口
3. 设计能够解决关键痛点的价值主张
4. 定义Pain Relievers（痛点解决方式）和Gain Creators（收益创造方式）

**输出格式**：
```json
{
  "value_propositions": [
    {
      "proposition_id": "vp-1",
      "headline": "AI驱动的个性化教学SaaS平台",
      "description": "通过AI自适应学习引擎为培训机构提供开箱即用的在线教学解决方案",
      "target_segment": "segment-1",
      "pain_relievers": ["降低培训机构线上化技术门槛", "提升学员学习效率与完课率"],
      "gain_creators": ["培训机构运营成本降低40%", "学员完课率提升至85%"],
      "differentiation": "AI自适应学习引擎动态调整教学路径，区别于静态课程平台"
    }
  ]
}
```

**验收标准**：
- 每个客户细分群体至少有1个价值主张
- 价值主张直接对应高优先级痛点
- 包含Pain Relievers和Gain Creators的具体描述

### Step 3a：收入来源填充（决策树匹配）

**任务**：基于产品特性和市场基准，自动匹配潜在收入模式类型。

**决策树逻辑**：

```
开始
  │
  ├─ 产品形态 = 实物商品？
  │     └─ 是 → 检查点：是否需要订阅服务？
  │           ├─ 是 → 收入模式 = 订阅+单购
  │           └─ 否 → 收入模式 = 一次性销售
  │
  ├─ 产品形态 = 软件/数字服务？
  │     └─ 是 → 检查点：用户使用频率？
  │           ├─ 高频（>1次/周）→ 收入模式 = 订阅制
  │           ├─ 中频（1次/月）→ 收入模式 = 用量计费
  │           └─ 低频（<1次/月）→ 收入模式 = 项目制/一次性
  │
  ├─ 产品形态 = 平台服务？
  │     └─ 是 → 收入模式 = 平台佣金/抽成
  │
  └─ 是否有多边市场？
        ├─ 是 → 收入模式 = 订阅+平台佣金
        └─ 否 → 基于产品形态选择
```

**Step 3b：多选项收入模式生成**

**任务**：基于Step 3a的决策树结果，生成至少2个可比较的收入模式选项。

**执行逻辑**：
1. 基于决策树结果确定主收入模式
2. 生成至少1个备选收入模式（考虑混合模式）
3. 分析每个模式的优势和风险

**输出格式**：
```json
{
  "revenue_models": [
    {
      "model_id": "rm-1",
      "type": "SaaS订阅制",
      "description": "按机构学员人数阶梯定价的月度/年度订阅",
      "pricing_structure": {
        "base_price": "2980",
        "unit": "元/机构/月",
        "tiers": ["基础版：50人以内2980元/月", "专业版：200人以内6980元/月"]
      },
      "pros": ["收入可预测，现金流稳定", "随客户规模增长自然增收"],
      "cons": ["初期获客成本较高", "需持续投入产品迭代"],
      "risk_level": "low/medium/high"
    },
    {
      "model_id": "rm-2",
      "type": "用量计费+订阅混合",
      "description": "基础订阅+按AI调用量超额计费",
      "pricing_structure": {...},
      "pros": [...],
      "cons": [...],
      "risk_level": "low/medium/high"
    }
  ]
}
```

**验收标准**：
- 至少生成2个收入模式选项
- 每个模式包含清晰的定价结构
- 优劣分析和风险等级已标注

### Step 4：成本结构填充

**任务**：基于商业模式需求，分析和估算成本结构。

**执行逻辑**：
1. 基于关键活动和资源配置识别成本驱动因素
2. 区分固定成本和可变成本
3. 估算各成本项的量级和占比
4. 与行业基准进行对比

**输出格式**：
```json
{
  "cost_structure": {
    "fixed_costs": [
      {
        "item": "研发团队薪资",
        "estimated_monthly": "800000",
        "category": "人员/基础设施/运营"
      }
    ],
    "variable_costs": [
      {
        "item": "AI算力调用费",
        "unit_cost": "0.5元/次推理调用",
        "driver": "活跃学员数×人均AI交互次数"
      }
    ],
    "unit_economics": {
      "target_cac": "5000元/机构",
      "target_ltv": "80000元",
      "ltv_cac_ratio": "16:1"
    }
  }
}
```

**验收标准**：
- 主要成本项已识别
- 固定成本和可变成本已分类
- 单位经济指标已设定

### Step 5：渠道通路填充

**任务**：定义触达客户和交付价值的渠道。

**执行逻辑**：
1. 基于客户细分确定触达渠道偏好
2. 分析各渠道的成本和效率
3. 设计线上线下渠道组合
4. 规划渠道优先级

**输出格式**：
```json
{
  "channels": [
    {
      "channel_id": "ch-1",
      "name": "教育行业展会与社群运营",
      "type": "direct/indirect",
      "phase": "awareness/evaluation/purchase/delivery",
      "cost_efficiency": "high/medium/low",
      "priority": 1
    }
  ]
}
```

**验收标准**：
- 覆盖客户旅程全阶段
- 直接和间接渠道组合
- 优先级排序合理

### Step 6：关键活动/资源/伙伴填充

**任务**：定义实现商业模式所需的关键活动、资源和合作伙伴。

**执行逻辑**：

**关键活动识别：**
1. 价值创造活动
2. 平台/网络建设活动
3. 客户获取活动

**关键资源识别：**
1. 实体资产
2. 知识产权
3. 人力资源
4. 财务资源

**关键伙伴识别：**
1. 供应商
2. 战略联盟
3. 合资伙伴

**输出格式**：
```json
{
  "key_activities": [
    {
      "activity": "AI学习引擎算法优化",
      "type": "creation/delivery/platform",
      "priority": "high/medium/low"
    }
  ],
  "key_resources": [
    {
      "resource": "自适应学习算法引擎",
      "type": "physical/intellectual/human/financial",
      "ownership": "自建/外包/合作"
    }
  ],
  "key_partners": [
    {
      "partner": "职业院校内容合作方",
      "type": "supplier/strategic/joint_venture",
      "purpose": "获取权威课程内容授权",
      "dependency": "依赖程度"
    }
  ]
}
```

**验收标准**
- 关键活动覆盖价值创造全流程
- 资源需求与能力匹配
- 伙伴关系设计合理

### Step 7：客户关系填充

**任务**：定义与不同客户细分群体的关系类型。

**执行逻辑**：
1. 分析客户旅程各阶段的关系需求
2. 确定自助服务/辅助服务/社区服务的组合
3. 规划客户关系演进路径

**输出格式**：
```json
{
  "customer_relationships": [
    {
      "segment_id": "segment-1",
      "relationship_type": "personal_assistance/dedicated_assistance/self_service/automated_service/community",
      "description": "自助服务+客户成功经理辅助",
      "touchpoints": ["在线帮助中心与知识库", "专属客户成功经理月度回访"]
    }
  ]
}
```

**验收标准**：
- 每个客户细分群体有对应关系类型
- 关系类型与产品特性匹配
- 触点清晰

## 输出

**存储路径**：`output/pm-strategy/business-model-canvas/`

**输出文件**：bmc.json, assumptions.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| bmc.customer_segments | array | 是 | 客户细分列表，至少2个 |
| bmc.value_propositions | array | 是 | 价值主张列表，至少1个 |
| bmc.channels | array | 是 | 覆盖客户旅程全阶段 |
| bmc.customer_relationships | array | 是 | 每个细分群体有对应关系类型 |
| bmc.revenue_streams | array | 是 | 收入来源列表，至少1个 |
| bmc.key_resources | array | 是 | 覆盖实体/知识产权/人力/财务 |
| bmc.key_activities | array | 是 | 覆盖价值创造全流程 |
| bmc.key_partnerships | array | 是 | 含供应商/战略联盟/合资伙伴 |
| bmc.cost_structure | array | 是 | 成本结构列表，至少1个 |
| metadata.confidence | number | 是 | 0-1之间，整体置信度 |
| metadata.requires_human_review | boolean | 是 | 是否需要人类审核 |
| assumptions[].assumption_id | string | 是 | 假设唯一标识 |
| assumptions[].related_bmc_element | string | 是 | 关联画布要素路径 |
| assumptions[].priority | string | 是 | critical/high/medium/low |
| assumptions[].confidence | number | 是 | 0-1之间，假设置信度 |

### 完整商业画布JSON

```json
{
  "bmc": {
    "customer_segments": [
      {
        "segment_name": "string - 客户群体名称",
        "description": "string - 群体描述",
        "characteristics": ["string - 群体特征"]
      }
    ],
    "value_propositions": [
      {
        "proposition": "string - 价值主张",
        "target_segment": "string - 对应客户群体",
        "pain_addressed": "string - 解决的痛点",
        "gain_created": "string - 创造的收益"
      }
    ],
    "channels": [
      {
        "channel_name": "string - 渠道名称",
        "type": "direct|indirect|partner",
        "phase": "awareness|evaluation|purchase|delivery|after_sales"
      }
    ],
    "customer_relationships": [
      {
        "type": "personal|automated|community|self_service",
        "segment": "string - 对应客户群体",
        "description": "string - 关系描述"
      }
    ],
    "revenue_streams": [
      {
        "stream_name": "string - 收入来源名称",
        "pricing_model": "subscription|transaction|freemium|advertising|licensing",
        "estimated_amount": "string - 预估金额区间",
        "target_segment": "string - 对应客户群体"
      }
    ],
    "key_resources": [
      {
        "resource": "string - 核心资源",
        "type": "physical|intellectual|human|financial"
      }
    ],
    "key_activities": [
      {
        "activity": "string - 核心活动",
        "type": "production|problem_solving|platform|network"
      }
    ],
    "key_partnerships": [
      {
        "partner": "string - 合作伙伴",
        "type": "strategic_alliance|joint_venture|buyer_supplier",
        "purpose": "string - 合作目的"
      }
    ],
    "cost_structure": [
      {
        "cost_item": "string - 成本项",
        "type": "fixed|variable",
        "estimated_range": "string - 预估成本区间",
        "category": "infrastructure|marketing|operations|personnel"
      }
    ]
  },
  "metadata": {
    "generated_at": "2024-06-15T10:30:00Z",
    "confidence": "0.78",
    "requires_human_review": true
  }
}
```

### 假设清单

```json
{
  "assumptions": [
    {
      "assumption_id": "string - 假设ID",
      "description": "string - 假设描述",
      "related_bmc_element": "string - 关联的画布要素（如customer_segments.0）",
      "validation_method": "string - 验证方法",
      "priority": "critical|high|medium|low",
      "confidence": 0.0
    }
  ]
}
```

## 决策规则

### 收入模式决策规则

1. **选项生成规则**：必须生成至少2个收入模式选项供选择

2. **风险评估规则**：
   - 高风险假设需在建议中明确标注
   - 高风险假设失效影响>50%收入时，强制升级人类审批

3. **假设显式化规则**：
   - 所有收入假设必须列出
   - 每个假设需标注风险等级（low/medium/high）
   - 假设来源需可追溯

### 整体决策规则

1. **多选项呈现**：每个关键决策点生成2-3个可比较选项

2. **数据支撑标注**：每个画布要素需标注数据来源和推断依据

3. **不确定性透明**：所有推断内容需标注置信度

## 质量检查

### 自检清单

- [ ] 商业模式画布9个要素全部填充
- [ ] 每个要素包含内容有数据支撑或假设标注
- [ ] 至少生成2个收入模式选项
- [ ] 假设清单完整，每个假设包含：
  - 描述清晰
  - 风险等级已标注
  - 验证状态已标注
  - 影响评估已提供
- [ ] 核心假设的验证方法已建议
- [ ] 单位经济指标已设定

### 输出质量标准

1. **完整性**：9格画布每格至少1条内容，且value_propositions与customer_segments有对应关系
2. **可追溯性**：每格内容标注data_source(上游skill/用户描述/AI推断)
3. **假设完整性**：assumptions列表≥3条，每条包含assumption+validation_method+priority
4. **收入可验证性**：revenue_streams包含≥1个具体收入来源且定价策略有数字区间

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| persona.json / opportunity-definition.json | 用户提供产品描述和目标用户 → 基于描述生成BMC | 客户细分和价值主张缺乏探索阶段数据支撑，整体置信度从0.8降至0.5，相关画布格置信度≤0.4，标注needs_human_validation: true |
| exploration_outputs（多个探索阶段文件） | 用户提供产品描述和目标用户 → 基于描述生成BMC | 各模块整体置信度从0.8降至0.5，假设条目增多，相关画布格置信度≤0.3，标注auto_filled: true |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的产品描述和目标用户直接生成BMC | 整体置信度从0.8降至0.3，大部分内容为假设推断，相关画布格置信度≤0.3，标注auto_filled: true |

## 数据获取说明

本Skill需要探索阶段输出数据（Persona、机会简报等），请通过以下方式之一提供：
  1. 直接描述产品概念、目标用户和价值主张
  2. 上传persona.json / opportunity-definition.json等文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| persona.json用户画像更新 | 客户细分、客户关系模块需重新填充 | 重新执行Step 1和Step 7，标注变更来源 |
| opportunity-definition机会定义更新 | 价值主张、收入模式可能需调整 | 重新评估价值主张优先级，检查收入模式匹配度 |
| competitor-analysis竞品数据更新 | 价值主张差异化、收入模式定价参考 | 重新执行Step 2和Step 3，更新竞品对标数据 |
| 市场规模数据变更 | 收入预期和成本结构 | 重新计算单位经济指标，更新市场规模假设 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 客户细分调整 | business-value-fit、business-pricing | 输出文件版本号+变更摘要 |
| 价值主张变更 | business-value-fit、positioning-strategy | 输出文件版本号+变更摘要 |
| 收入模式变更 | business-pricing | 输出文件版本号+变更摘要 |
| 成本结构变更 | business-pricing、business-strategy-report | 输出文件版本号+变更摘要 |

---

## Human Review Checklist

在提交人类审批前，确保以下内容：

- [ ] 客户细分符合市场实际情况
- [ ] 价值主张差异化明显且可实现
- [ ] 收入模式选项各有清晰优劣
- [ ] 成本结构与运营计划匹配
- [ ] 关键假设可验证且有验证计划
