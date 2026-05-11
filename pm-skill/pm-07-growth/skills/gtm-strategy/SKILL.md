---
name: gtm-strategy
description: 当需要制定产品上市策略时使用。Go-to-Market策略文档自动生成，包含目标市场定义、上市路径选择、定价与包装策略、渠道与推广计划、上市里程碑与成功指标。关键词：Go-to-Market、GTM策略、上市策略、产品上市、市场进入、发布策略。
metadata:
  module: "产品增长与运营"
  sub-module: "增长模式"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
  upstream:
    - positioning-statement
    - positioning-differentiation
    - business-model-canvas
    - business-pricing
    - growth-model
---

# Go-to-Market策略文档生成

## 核心原则

**GTM是产品与市场的第一次正式约会**

Go-to-Market策略的核心不是"如何把产品推出去"，而是"如何让正确的用户在正确的场景下发现产品价值"。好的GTM策略是产品价值主张与市场需求的精准匹配。

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| 产品定位 | positioning-statement | ✅ | 定位陈述、差异化优势 |
| 差异化策略 | positioning-differentiation | ⬜ | 竞争差异化定位 |
| 商业模式 | business-model-canvas | ⬜ | 价值主张、客户细分、收入来源 |
| 定价方案 | business-pricing | ⬜ | 定价模型、价格层级 |
| 增长模式 | growth-model | ⬜ | 增长模式诊断、获客策略 |
| 产品信息 | 用户提供 | ✅ | 产品功能、目标用户、上线时间 |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无产品定位 | 基于用户提供的产品信息推导定位，标注"定位待确认" |
| 无商业模式 | 聚焦获客和渠道策略，商业模式部分标注"待补充" |
| 无定价方案 | 生成定价策略框架，具体价格标注"待定价分析" |
| 无增长模式 | 默认PLG模式，标注"增长模式待诊断" |
- 若用户未提供产品信息，提示用户提供或跳过该输入相关步骤

## 执行步骤

### Step 1：目标市场定义

精确定义上市目标市场：

1. **理想客户画像（ICP）**：行业、规模、角色、痛点、购买力
2. **市场切入顺序**：灯塔客户 → 早期采用者 → 早期大众的切入路径
3. **TAM/SAM/SOM**：市场规模估算，聚焦可触达的SOM
4. **市场时机**：为什么是现在？市场趋势、政策窗口、竞争空白

### Step 2：上市路径选择

基于产品类型和目标市场选择上市路径：

1. **上市模式评估**：
   - 🚀 大爆炸发布（适合C端消费级产品）
   - 🎯 定向邀请制（适合B端企业级产品）
   - 🔄 渐进式发布（适合平台型产品）
   - 🏖️ 软启动（适合需要市场验证的产品）
2. **路径推荐**：基于产品特征推荐最优路径及理由
3. **阶段划分**：预热期 → 发布期 → 增长期各阶段目标

### Step 3：定价与包装策略

确定产品如何被包装和定价：

1. **产品包装**：Free / Pro / Enterprise 各层级功能边界
2. **定价模型**：订阅制 / 按量计费 / 买断制 / 混合模型
3. **上市定价**：首发价、早鸟价、年付折扣等促销策略
4. **价值锚定**：与竞品定价对比，突出性价比优势

### Step 4：渠道与推广计划

设计从触达到转化的全链路渠道策略：

1. **自有渠道**：官网、博客、社区、邮件、产品内引导
2. **付费渠道**：搜索广告、社交广告、内容营销、KOL合作
3. **生态渠道**：合作伙伴、应用市场、集成平台、分销商
4. **渠道预算分配**：各渠道预算占比和预期ROI
5. **内容日历**：上市前后4周的内容发布计划

### Step 5：上市里程碑与成功指标

定义上市成功的衡量标准：

1. **上市里程碑**：关键时间节点和交付物
2. **成功指标**：
   - 上市首周：注册量、激活率、NPS
   - 上市首月：留存率、付费转化率、CAC
   - 上市首季：LTV、LTV/CAC、市场份额
3. **预警指标**：低于预期时触发的调整机制
4. **Go/No-Go检查清单**：上市前的最终检查项

### Step 6：报告组装

将以上内容组装为完整GTM策略文档。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| GTM策略文档 | `output/pm-growth/gtm-strategy/gtm-strategy.md` | 人类可读的完整策略文档 |
| 结构化数据 | `output/pm-growth/gtm-strategy/gtm-strategy.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["product_name", "target_market", "launch_path", "success_metrics"],
  "properties": {
    "product_name": {"type": "string", "description": "产品名称"},
    "report_date": {"type": "string", "description": "报告日期"},
    "target_market": {"type": "object", "description": "目标市场定义，包含ICP、切入顺序和市场规模"},
    "launch_path": {"type": "object", "description": "上市路径，包含模式、理由和阶段"},
    "pricing_packaging": {"type": "object", "description": "定价与包装策略，包含层级、模型和促销"},
    "channels": {"type": "object", "description": "渠道与推广计划，包含自有/付费/生态渠道"},
    "success_metrics": {"type": "object", "description": "成功指标与里程碑，包含首周/首月/首季指标"},
    "risks": {"type": "array", "description": "风险清单"}
  }
}
```

### Markdown 报告结构

```markdown
# Go-to-Market策略：{产品名称}

## 1. 执行摘要
- 目标市场 / 上市路径 / 核心渠道 / 首月目标

## 2. 目标市场定义
- ICP画像
- 市场切入顺序
- TAM/SAM/SOM
- 市场时机分析

## 3. 上市路径
- 上市模式评估与推荐
- 阶段划分（预热→发布→增长）
- 各阶段目标与时间线

## 4. 定价与包装
- 产品层级与功能边界
- 定价模型与价格
- 上市促销策略
- 价值锚定（vs 竞品）

## 5. 渠道与推广
- 渠道矩阵（自有/付费/生态）
- 预算分配与预期ROI
- 内容日历（上市前后4周）

## 6. 成功指标与里程碑
- 上市里程碑时间线
- 成功指标（首周/首月/首季）
- 预警指标与调整机制
- Go/No-Go检查清单

## 7. 风险与应急
- 关键风险清单
- 应急预案
- 退路策略
```

### JSON 结构

```json
{
  "product_name": "",
  "report_date": "",
  "target_market": {
    "icp": {},
    "entry_sequence": [],
    "market_size": { "tam": 0, "sam": 0, "som": 0 },
    "market_timing": ""
  },
  "launch_path": {
    "mode": "big_bang|invite_only|progressive|soft_launch",
    "rationale": "",
    "phases": []
  },
  "pricing_packaging": {
    "tiers": [],
    "pricing_model": "",
    "launch_promotions": [],
    "value_anchoring": ""
  },
  "channels": {
    "owned": [],
    "paid": [],
    "ecosystem": [],
    "budget_allocation": {},
    "content_calendar": []
  },
  "success_metrics": {
    "milestones": [],
    "week_1": {},
    "month_1": {},
    "quarter_1": {},
    "alert_triggers": []
  },
  "risks": []
}
```

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| ICP画像具体 | 至少包含行业、规模、角色3个维度 | 补充ICP细节 |
| 上市路径有依据 | 路径选择基于产品类型和目标市场特征 | 补充选择理由 |
| 渠道预算可执行 | 各渠道有预算占比和预期ROI | 补充预算细节 |
| 成功指标可量化 | 首周/首月/首季指标均有具体数值 | 设定目标值或标注"待确认" |
