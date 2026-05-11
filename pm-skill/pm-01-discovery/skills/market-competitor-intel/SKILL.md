---
name: market-competitor-intel
description: 当需要持续监控竞品动态、更新Feature Matrix、对比竞品口碑与定价策略时使用。竞品情报自动化Pipeline，覆盖采集-分析-输出三层架构，关键发现多源交叉验证。关键词：竞品监控、Feature Matrix、竞品口碑、定价策略、竞品情报、战略推断、多源交叉验证。
metadata:
  module: "产品探索与发现"
  sub-module: "市场竞品"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_auto"
---

# 竞品情报自动化Pipeline

## 核心原则

1. **多源交叉验证**——单一数据源的竞品情报不可信，每个关键发现必须至少2个独立来源交叉验证，招聘+融资+功能更新三源信号汇聚时战略推断置信度最高
2. **变更即信号**——竞品的每个功能变更、定价调整、招聘变化都是战略信号，不是孤立事件，必须关联解读而非简单罗列
3. **告警分级响应**——P0级（影响≥5）紧急通知+标记需紧急响应，P1级（影响=4）即时通知+纳入周报，P2级（影响<4）仅纳入周报，资源分配与影响程度匹配
4. **战略推断标注置信度**——招聘推断战略方向置信度0.5-0.7，融资+招聘双重信号0.7-0.9，官方公告0.9+，低置信度推断必须升级人类验证

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| competitor_list | array | 是 | 用户提供 | 竞品列表，每项含名称、品类、官网URL |
| monitor_config | object | 是 | 用户提供 | 监控配置，含扫描频率、关注维度、告警阈值 |

## 执行步骤

### 采集层

多源信息采集，覆盖竞品全方位动态：

| 采集源 | 采集内容 | 采集频率 |
|--------|---------|---------|
| App版本更新监控 | 版本号、更新日志、功能变更、发布时间 | 每次版本发布 |
| 官网/博客更新 | 产品页变更、新功能公告、战略文章、定价页变更 | 每日 |
| App评论采集 | 用户评分、评论内容、情感倾向、高频关键词 | 每周 |
| 定价页面监控 | 价格变动、套餐调整、优惠活动、新定价模式 | 每日 |
| 招聘信息监控 | 新增岗位、岗位数量变化、技术栈要求、地域分布 | 每周 |
| 行业新闻/融资信息 | 融资轮次金额、战略合作、并购、行业排名 | 实时 |

**招聘信息战略推断规则：**
- 大量招聘某技术栈岗位 → 推断技术方向投入
- 新增海外岗位 → 推断国际化战略
- 招聘量骤减 → 推断成本收缩或战略调整
- 新增AI/ML岗位 → 推断智能化方向

### 分析层

#### Feature Matrix自动更新

| 步骤 | 说明 |
|------|------|
| 检测版本更新 | 从采集层获取版本更新信息 |
| 提取功能变更 | 解析更新日志，提取新增/升级/移除功能 |
| 与现有矩阵对比 | 对比Feature Matrix，标注变更类型 |
| 评估影响程度 | 1-5分评估对竞争格局的影响 |
| 触发告警 | 影响程度≥4实时告警 |

**变更类型定义：**
- 新增（Added）：竞品新增此前不具备的功能
- 升级（Upgraded）：竞品对现有功能进行重大改进
- 移除（Removed）：竞品下线某项功能
- 降级（Downgraded）：竞品对现有功能进行限制或降级

#### 竞品用户口碑对比

| 分析维度 | 说明 |
|---------|------|
| 情感分布对比 | 各竞品正面/中性/负面情感占比对比 |
| 高频痛点对比 | 提取各竞品Top痛点，横向对比 |
| 差异化机会 | 识别竞品共性痛点，标记为差异化机会 |
| 竞争劣势预警 | 识别自身相对竞品的口碑劣势项 |
| 用户迁移信号 | 检测竞品用户表达不满或迁移意向的评论 |

#### 定价策略对比

| 分析维度 | 说明 |
|---------|------|
| 价格区间对比 | 各竞品定价区间与均价对比 |
| 套餐结构对比 | 免费/基础/专业/企业版功能分布对比 |
| 定价模式变化 | 检测定价模式变更（如按量→订阅） |
| 性价比评估 | 功能覆盖度/价格比对比 |

#### 功能更新解读

- 功能变更的战略意图解读
- 对用户价值的影响评估
- 对竞争格局的影响评估
- 建议的应对措施

#### 战略方向推断

综合招聘、融资、功能更新、定价变化等多源信号，推断竞品战略方向：
- 市场扩张 / 收缩方向
- 技术投入方向
- 目标客群迁移方向
- 商业模式演进方向

### 输出层

| 输出类型 | 频率 | 说明 |
|---------|------|------|
| 竞品情报周报 | 每周 | 本周竞品动态汇总、Feature Matrix变更、口碑变化 |
| 重大变化分级告警 | 实时 | 影响程度≥4的竞品变更即时通知人类PM，影响程度≥5同时标记需紧急响应 |
| 季度深度分析 | 每季度 | 竞品战略方向总结、竞争格局演变、差异化机会梳理 |

## 输出

输出文件：`output/pm-discovery/market-competitor-intel/competitor-intel.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["scan_timestamp", "competitors"],
  "properties": {
    "scan_timestamp": {"type": "string", "description": "扫描时间戳"},
    "competitors": {"type": "array", "description": "竞品情报列表，含Feature Matrix、口碑、定价和战略信号"},
    "reputation_comparison": {"type": "object", "description": "竞品口碑横向对比"},
    "alerts": {"type": "array", "description": "竞品变更告警列表"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| scan_timestamp | string | 是 | ISO 8601格式时间戳，不得为空或未来时间 |
| competitors | array | 是 | 至少包含1个竞品条目，每条须含name和category |
| competitors[].feature_matrix | object | 是 | 须包含features数组和last_updated时间戳 |
| competitors[].feature_matrix.features | array | 是 | 每项须含feature_name、status、impact_degree、source |
| competitors[].feature_matrix.features[].impact_degree | integer | 是 | 取值1-5，须为整数 |
| competitors[].feature_matrix.features[].source | string | 是 | 数据来源不得为空，关键发现须标注≥2个独立来源 |
| competitors[].reputation | object | 是 | 须包含sentiment_distribution、top_pain_points、data_sources |
| competitors[].reputation.sentiment_distribution | object | 是 | positive+neutral+negative之和须为1.0（误差±0.01） |
| competitors[].reputation.data_sources | array | 是 | 至少标注1个口碑数据来源 |
| competitors[].pricing | object | 是 | 须包含price_range、plan_structure、value_score |
| competitors[].pricing.value_score | number | 是 | 取值0.0-1.0，保留两位小数 |
| competitors[].strategic_signals | object | 是 | 须包含direction、confidence、evidence、needs_human_validation |
| competitors[].strategic_signals.confidence | number | 是 | 取值0.0-1.0，<0.5时needs_human_validation必须为true |
| competitors[].strategic_signals.evidence | array | 是 | 至少包含1条证据，每条须标注来源类型和置信度 |
| competitors[].strategic_signals.needs_human_validation | boolean | 是 | 置信度<0.5或仅单一来源推断时必须为true |
| reputation_comparison | object | 否 | 若competitors数量≥2则必填，须含common_pain_points、differentiation_opportunities |
| reputation_comparison.common_pain_points | array | 否 | 每项须含痛点描述和涉及的竞品列表 |
| reputation_comparison.differentiation_opportunities | array | 否 | 每项须含机会描述和关联的竞品共性痛点 |
| reputation_comparison.competitive_disadvantages | array | 否 | 每项须含劣势描述和对比竞品名称 |
| alerts | array | 否 | 影响程度≥4的变更必须生成告警条目 |
| alerts[].impact_degree | integer | 是 | 取值1-5，≥4时须触发通知机制 |
| alerts[].recommendation | string | 是 | 应对建议不得为空，须为可执行的具体建议 |
| alerts[].timestamp | string | 是 | ISO 8601格式时间戳，不得为空 |

```json
{
  "scan_timestamp": "扫描时间戳",
  "competitors": [
    {
      "name": "竞品名称",
      "category": "品类",
      "feature_matrix": {
        "features": [
          {
            "feature_name": "功能名称",
            "status": "新增/升级/移除/降级/无变化",
            "change_detail": "变更详情",
            "impact_degree": 5,
            "detected_at": "检测时间",
            "source": "数据来源"
          }
        ],
        "last_updated": "最后更新时间"
      },
      "reputation": {
        "sentiment_distribution": {
          "positive": 0.0,
          "neutral": 0.0,
          "negative": 0.0
        },
        "top_pain_points": [],
        "migration_signals": [],
        "data_sources": []
      },
      "pricing": {
        "price_range": "价格区间",
        "plan_structure": "套餐结构",
        "pricing_model_changes": [],
        "value_score": 0.0
      },
      "strategic_signals": {
        "direction": "推断战略方向",
        "confidence": 0.0,
        "evidence": [],
        "needs_human_validation": false
      }
    }
  ],
  "reputation_comparison": {
    "common_pain_points": [],
    "differentiation_opportunities": [],
    "competitive_disadvantages": []
  },
  "alerts": [
    {
      "competitor": "竞品名称",
      "alert_type": "功能变更/定价变化/战略信号",
      "detail": "告警详情",
      "impact_degree": 5,
      "recommendation": "应对建议",
      "timestamp": "告警时间"
    }
  ]
}
```

## 决策规则

| 规则 | 触发条件 | 动作 |
|------|---------|------|
| P0级告警（自动通知+紧急标记） | 功能变更影响程度 ≥ 5 | 即时通知人类PM，标记需紧急响应，不等待周报周期 |
| P1级告警（自动通知） | 功能变更影响程度 4 | 即时通知人类PM，纳入下次周报详细分析 |
| 战略推断升级 | 竞品战略推断置信度 < 0.5 | 升级人类判断，标注需验证 |
| 定价变化告警 | 竞品定价发生变更 | 通知人类PM定价变化详情与影响分析 |
| 口碑异常告警 | 竞品口碑出现重大波动（情感分布变化>15%） | 通知人类PM口碑变化分析 |

## 质量检查

- [ ] Feature Matrix已更新，变更已标注类型和影响程度
- [ ] 竞品口碑对比已完成
- [ ] 差异化机会已识别
- [ ] 定价策略对比已完成
- [ ] 战略方向推断已完成，低置信度已标注
- [ ] 告警已触发（影响程度≥4的变更）
- [ ] 数据来源已标注
- [ ] 关键发现已多源交叉验证（至少2个独立来源）

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 竞品列表 | 用户提供品类关键词 → AI搜索识别竞品，标注"竞品列表为AI推断" | competitors[].name标注"AI推断"，strategic_signals.confidence上限降为0.5 |
| 所有上游文件均缺失 | 用户提供品类关键词 → 基于AI知识库搜索识别竞品并执行分析 | 全部推断标注"AI知识库推断"，needs_human_validation默认为true，告警仅纳入周报不触发即时通知 |
| monitor_config | 跳过该输入相关步骤，使用默认监控配置（扫描频率：每日，关注维度：全部，告警阈值：影响程度≥4） | 输出中不包含monitor_config相关定制化字段，告警阈值固定为≥4 |

数据获取说明：
- 本Skill需要竞品列表或品类关键词，请通过以下方式之一提供：
  1. 直接提供竞品名称列表和品类关键词
  2. 上传竞品数据文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游文件 | 变更类型 | 对本Skill的影响 | 响应动作 |
|---------|---------|---------------|---------|
| pest.json | 政策法规变化 | 影响竞品合规成本评估，可能改变定价策略对比中的合规成本维度 | 重新评估受影响竞品的pricing.value_score，更新strategic_signals中合规相关推断 |
| pest.json | 技术动态变化 | 影响竞品技术方向判断，可能改变Feature Matrix中技术功能的影响评估 | 重新评估相关功能变更的impact_degree，更新strategic_signals中技术方向推断 |
| tam-som.json | 市场规模数据变化 | 影响竞争格局评估，可能改变竞品战略推断中的市场扩张/收缩判断 | 重新评估竞品strategic_signals.direction，调整confidence值 |
| tam-som.json | 细分市场数据变化 | 影响竞品目标客群迁移方向推断 | 更新strategic_signals中客群迁移相关推断，重新评估差异化机会 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| Feature Matrix变更 | competitor-quadrant | 变更的竞品名称、功能变更类型、影响程度 | impact_degree ≥ 3的功能变更 |
| Feature Matrix变更 | competitor-report | 完整Feature Matrix变更摘要 | 任何功能变更 |
| 战略推断变更 | competitor-report | 更新后的战略方向、置信度、证据链 | strategic_signals.direction或confidence发生变更 |
| 口碑对比变更 | competitor-report | 口碑变化摘要、新增差异化机会 | reputation_comparison内容发生变更 |
| 新增告警 | competitor-report | 告警详情及应对建议 | alerts新增P0或P1级告警 |
