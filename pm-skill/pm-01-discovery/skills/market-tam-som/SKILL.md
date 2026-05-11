---
name: market-tam-som
description: 当需要评估目标市场的TAM/SAM/SOM规模时使用。市场规模自动测算，支持自上而下与自下而上双路径交叉验证，差异>20%时标注并升级人类判断，输出区间估计与置信度评估。关键词：市场规模、TAM、SAM、SOM、市场容量、区间估计、双路径交叉验证。
metadata:
  module: "产品探索与发现"
  sub-module: "市场竞品"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 市场规模自动测算

## 核心原则

1. **双路径交叉验证**——自上而下与自下而上两条路径独立测算，差异>20%时必须标注并升级人类判断，单一路径结论不可信
2. **区间优于点估计**——所有规模数字输出区间估计（乐观/中性/保守），不输出单一确定值，因为市场规模的确定性是幻觉
3. **假设显式化**——每个测算步骤的假设必须显式列出（assumption/basis/impact_direction），假设变化对结果影响>30%的标注为高敏感
4. **置信度分层**——TAM置信度最高（行业数据支撑），SAM次之（叠加过滤系数），SOM最低（叠加竞争与资源约束），逐层递减是正常的

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| category_keywords | string | 是 | 用户提供 | 品类关键词，如"在线教育""SaaS CRM" |
| geographic_scope | string | 是 | 用户提供 | 目标市场地理范围，如"中国大陆""东南亚" |
| time_range | string | 是 | 用户提供 | 测算时间范围，如"2025-2027" |

## 执行步骤

### Step 1: TAM测算

采用双路径交叉验证：

**自上而下路径：**
- 获取行业总规模数据（统计局/行业协会/第三方研报）
- 确定目标品类在行业中的占比
- 计算：TAM = 行业总规模 × 目标品类占比

**自下而上路径：**
- 估算目标用户总数（人口基数 × 目标人群渗透率）
- 获取ARPU（每用户年均收入）参考值
- 计算：TAM = 目标用户数 × ARPU

**输出要求：**
- 区间估计：乐观值 / 中性值 / 保守值
- 每个估计值标注数据来源
- 两条路径结果差异>20%时标注需人类判断

### Step 2: SAM测算

在TAM基础上逐层过滤：

| 过滤维度 | 说明 |
|---------|------|
| 地理范围限制 | 根据geographic_scope裁剪至目标区域市场规模 |
| 目标客群过滤 | 排除非目标客群，叠加客群画像过滤系数 |
| 服务能力边界 | 扣除自身渠道/技术/合规无法覆盖的部分 |

**计算逻辑：** SAM = TAM × 地理系数 × 客群系数 × 服务能力系数

**输出要求：**
- 各过滤系数及依据
- SAM区间估计（乐观/中性/保守）

### Step 3: SOM测算

在SAM基础上叠加竞争与资源约束：

| 约束维度 | 说明 |
|---------|------|
| 竞争格局 | 现有竞品已占据份额 + 竞品壁垒强度 |
| 自身资源约束 | 团队规模 / 资金 / 技术储备 / 渠道资源 |
| 获客能力预估 | 预期获客渠道效率 + 转化率 + 留存率 |

**计算逻辑：** SOM = SAM × (1 - 竞争约束%) × (1 - 资源约束%) × (1 - 获客约束%)

> SOM以SAM为基数，逐层扣除竞争、资源、获客三方面约束后得到可获取市场份额。

**输出要求：**
- SOM区间估计（乐观/中性/保守）
- 可达时间线（6个月/12个月/24个月里程碑）

### Step 4: 置信度评估

对整体测算结果进行可信度评估：

| 评估维度 | 方法 |
|---------|------|
| 数据来源可靠性 | 对每个数据源评估可靠性评分（0-1），来源包括官方统计、行业协会、第三方研报、专家访谈等 |
| 假设敏感度分析 | 对关键假设做±20%变动，观察对最终结果的影响幅度 |
| 关键假设标注 | 列出所有核心假设，标注假设内容、依据、对结果影响方向 |

**输出要求：**
- 整体confidence评分（0-1）
- 关键假设清单及敏感度分析结果
- 低置信度数据点标注

## 输出

输出文件：`output/pm-discovery/market-tam-som/tam-som.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["category_keywords", "geographic_scope", "time_range", "tam", "sam", "som", "confidence"],
  "properties": {
    "category_keywords": {"type": "string", "description": "品类关键词"},
    "geographic_scope": {"type": "string", "description": "目标市场地理范围"},
    "time_range": {"type": "string", "description": "测算时间范围"},
    "tam": {"type": "object", "description": "TAM总可达市场规模测算，含自上而下和自下而上双路径"},
    "sam": {"type": "object", "description": "SAM可服务市场规模测算"},
    "som": {"type": "object", "description": "SOM可获取市场规模测算"},
    "confidence": {"type": "object", "description": "置信度评估，含数据源可靠性和敏感度分析"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| category_keywords | string | 是 | 品类关键词，不可为空 |
| geographic_scope | string | 是 | 目标市场地理范围，不可为空 |
| time_range | string | 是 | 测算时间范围，格式如"2025-2027" |
| tam | object | 是 | TAM测算结果，必须包含top_down和bottom_up两个子对象 |
| tam.top_down | object | 是 | 自上而下测算路径，必须包含industry_total、category_ratio、estimates、data_sources |
| tam.top_down.industry_total | string | 是 | 行业总规模，需带单位 |
| tam.top_down.category_ratio | string | 是 | 目标品类占比，百分比格式 |
| tam.top_down.estimates | object | 是 | 必须包含optimistic、neutral、conservative三个区间值 |
| tam.top_down.data_sources | array | 是 | 数据来源列表，可为空数组但不可缺失 |
| tam.bottom_up | object | 是 | 自下而上测算路径，必须包含target_users、arpu、estimates、data_sources |
| tam.bottom_up.target_users | string | 是 | 目标用户总数，需带单位 |
| tam.bottom_up.arpu | string | 是 | 每用户年均收入，需带单位 |
| tam.bottom_up.estimates | object | 是 | 必须包含optimistic、neutral、conservative三个区间值 |
| tam.bottom_up.data_sources | array | 是 | 数据来源列表，可为空数组但不可缺失 |
| sam | object | 是 | SAM测算结果 |
| sam.geo_coefficient | string | 是 | 地理过滤系数，0-1之间 |
| sam.audience_coefficient | string | 是 | 客群过滤系数，0-1之间 |
| sam.service_coefficient | string | 是 | 服务能力系数，0-1之间 |
| sam.estimates | object | 是 | 必须包含optimistic、neutral、conservative三个区间值 |
| sam.data_sources | array | 是 | 数据来源列表 |
| som | object | 是 | SOM测算结果 |
| som.base | string | 是 | 计算基数，固定为"SAM" |
| som.competition_constraint | string | 是 | 竞争约束百分比，0-1之间 |
| som.resource_constraint | string | 是 | 资源约束百分比，0-1之间 |
| som.acquisition_constraint | string | 是 | 获客约束百分比，0-1之间 |
| som.calculation | string | 是 | 计算公式，展示完整乘法过程 |
| som.estimates | object | 是 | 必须包含optimistic、neutral、conservative三个区间值 |
| som.timeline | object | 是 | 可达时间线，必须包含6m、12m、24m三个里程碑 |
| som.data_sources | array | 是 | 数据来源列表 |
| confidence | object | 是 | 置信度评估 |
| confidence.overall_score | number | 是 | 整体置信度评分，0-1之间 |
| confidence.data_source_reliability | array | 是 | 各数据源可靠性评分列表 |
| confidence.sensitivity_analysis | array | 是 | 敏感度分析结果列表 |
| confidence.key_assumptions | array | 是 | 关键假设清单，每项必须包含assumption、basis、impact_direction |
| confidence.key_assumptions[].assumption | string | 是 | 假设内容描述 |
| confidence.key_assumptions[].basis | string | 是 | 假设依据 |
| confidence.key_assumptions[].impact_direction | string | 是 | 对结果影响方向：正向/负向/双向 |
| confidence.key_assumptions[].sensitivity | string | 否 | 敏感度标注，影响>30%时标注为"高" |
| confidence.key_assumptions[].needs_human_validation | boolean | 否 | 是否需要人类验证，高敏感假设默认为true |

```json
{
  "category_keywords": "在线教育",
  "geographic_scope": "中国大陆",
  "time_range": "2025-2027",
  "tam": {
    "top_down": {
      "industry_total": "5000亿",
      "category_ratio": "8%",
      "estimates": {
        "optimistic": "400亿",
        "neutral": "300亿",
        "conservative": "200亿"
      },
      "data_sources": []
    },
    "bottom_up": {
      "target_users": "1.2亿",
      "arpu": "3000元/年",
      "estimates": {
        "optimistic": "360亿",
        "neutral": "280亿",
        "conservative": "200亿"
      },
      "data_sources": []
    }
  },
  "sam": {
    "geo_coefficient": "0.85",
    "audience_coefficient": "0.35",
    "service_coefficient": "0.60",
    "estimates": {
      "optimistic": "120亿",
      "neutral": "85亿",
      "conservative": "55亿"
    },
    "data_sources": []
  },
  "som": {
    "base": "SAM",
    "competition_constraint": "0.60",
    "resource_constraint": "0.65",
    "acquisition_constraint": "0.50",
    "calculation": "SAM × (1 - 0.60) × (1 - 0.65) × (1 - 0.50) = SAM × 0.07",
    "estimates": {
      "optimistic": "9亿",
      "neutral": "6亿",
      "conservative": "3亿"
    },
    "timeline": {
      "6m": "完成产品MVP，获取首批1000名付费用户",
      "12m": "产品迭代至v2.0，付费用户突破1万",
      "24m": "建立品牌影响力，付费用户达10万"
    },
    "data_sources": []
  },
  "confidence": {
    "overall_score": 0.0,
    "data_source_reliability": [],
    "sensitivity_analysis": [],
    "key_assumptions": [
      {
        "assumption": "K12在线教育渗透率将持续增长",
        "basis": "教育部推进教育数字化政策",
        "impact_direction": "正向",
        "sensitivity": "高",
        "needs_human_validation": false
      }
    ]
  }
}
```

## 决策规则

| 规则 | 触发条件 | 动作 |
|------|---------|------|
| 数据源可靠性低 | 数据来源可靠性评分 < 0.5 | 标注需人类验证，暂停该数据点使用 |
| 假设敏感度高 | 关键假设变化对结果影响 > 30% | 标注为高敏感假设，建议人类确认 |
| 双路径差异大 | 自上而下与自下而上结果差异 > 20% | 标注需人类判断，提供差异分析 |

## 质量检查

- [ ] TAM/SAM/SOM三层测算完整
- [ ] 每层均含区间估计（乐观/中性/保守）
- [ ] 关键假设已标注
- [ ] 数据来源已列出
- [ ] 置信度评分已完成
- [ ] 低可靠性数据源已标注需人类验证
- [ ] 高敏感假设已标注

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 无强依赖 | 本Skill可独立运行，用户提供品类关键词和目标市场即可执行 | 无影响，输出完整 |
| 所有上游文件均缺失 | 用户提供品类关键词和目标市场 → 基于AI知识库中的公开数据估算TAM/SAM/SOM | 数据来源可靠性评分降低，confidence.overall_score可能<0.5，需标注"基于AI知识库推算" |
| 若用户未提供category_keywords | 提示用户提供品类关键词，否则无法执行市场规模测算 | 无法生成输出，流程阻塞 |
| 若用户未提供geographic_scope | 提示用户提供目标市场地理范围，否则默认使用"全球" | sam.geo_coefficient默认为1.0（无地理过滤），SAM=TAM，置信度降低 |
| 若用户未提供time_range | 提示用户提供测算时间范围，否则默认使用当前年份起3年 | time_range字段为推断值，需标注"默认值"，趋势预测准确性降低 |

数据获取说明：
- 本Skill需要品类关键词和目标市场信息，请通过以下方式之一提供：
  1. 直接输入品类关键词（如"在线教育""SaaS CRM"）和目标市场（如"中国大陆"）
  2. 上传市场调研数据文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游文件 | 变更类型 | 影响范围 | 影响说明 |
|---------|---------|---------|---------|
| pest.json | 政策法规变化 | SAM地理系数、SAM客群系数 | 新政策可能扩大或缩小可服务市场范围，需重新评估geo_coefficient和audience_coefficient |
| pest.json | 经济指标变化 | TAM行业总规模 | GDP/消费支出等指标变化直接影响top_down路径的industry_total |
| pest.json | 技术动态变化 | SAM服务能力系数 | 新技术突破可能提升service_coefficient，扩大可服务边界 |
| competitor-intel.json | 竞争格局变化 | SOM竞争约束系数 | 新竞品进入或竞品份额变化直接影响competition_constraint |
| competitor-intel.json | 竞品定价策略变化 | SOM获客约束系数 | 竞品价格战可能提高获客成本，影响acquisition_constraint |

### 下游通知机制表

| 触发事件 | 通知目标 | 通知内容 | 优先级 |
|---------|---------|---------|--------|
| TAM中性值变化>20% | competitor-report | TAM规模显著变化，建议重新评估市场吸引力与竞争策略 | 高 |
| SAM过滤系数调整>0.1 | competitor-report | 可服务市场范围变化，建议更新竞品覆盖分析 | 中 |
| SOM可获取份额变化>30% | opportunity-scoring | 可获取市场规模显著变化，建议重新评估机会评分 | 高 |
| 关键假设新增或变更 | 所有下游Skill | 新增/变更关键假设，可能影响依赖本Skill输出的分析结论 | 中 |
| confidence.overall_score降至<0.5 | 所有下游Skill | 整体置信度低于阈值，下游使用本输出时需附加不确定性说明 | 高 |
