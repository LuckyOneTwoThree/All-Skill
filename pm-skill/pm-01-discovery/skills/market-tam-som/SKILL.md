---
name: market-tam-som
description: 当需要评估目标市场的TAM/SAM/SOM规模时使用。市场规模自动测算，支持自上而下与自下而上双路径测算，输出区间估计与置信度评估。关键词：市场规模、TAM、SAM、SOM、市场容量、区间估计。
metadata:
  module: "产品探索与发现"
  sub-module: "市场竞品"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 市场规模自动测算

## 核心原则

1. **数据优先人工补充**——AI处理大规模数据，人类补充定性洞察
2. **显式规则拒绝模糊**——所有分类/判断规则必须可编码
3. **批量并行规模优势**——能并行的步骤不串行
4. **标注置信度分级交付**——所有推断标注置信度，<0.5升级人类

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

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| 无强依赖 | 本Skill可独立运行，用户提供品类关键词和目标市场即可执行 |
| 所有上游文件均缺失 | 用户提供品类关键词和目标市场 → 基于AI知识库中的公开数据估算TAM/SAM/SOM |
| 若用户未提供category_keywords | 提示用户提供品类关键词，否则无法执行市场规模测算 |
| 若用户未提供geographic_scope | 提示用户提供目标市场地理范围，否则默认使用"全球" |
| 若用户未提供time_range | 提示用户提供测算时间范围，否则默认使用当前年份起3年 |

数据获取说明：
- 本Skill需要品类关键词和目标市场信息，请通过以下方式之一提供：
  1. 直接输入品类关键词（如"在线教育""SaaS CRM"）和目标市场（如"中国大陆"）
  2. 上传市场调研数据文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
