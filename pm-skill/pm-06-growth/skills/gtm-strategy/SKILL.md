---
name: gtm-strategy
description: 当需要制定产品上市策略时使用。Go-to-Market策略文档自动生成，包含目标市场定义、上市路径选择、定价与包装策略、渠道与推广计划、上市里程碑与成功指标。关键词：Go-to-Market、GTM策略、上市策略、产品上市、市场进入、发布策略、产品上线、怎么推向市场、上市计划。
metadata:
  module: "产品增长与运营"
  sub-module: "增长模式"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "新产品要上线了怎么推"
    - "帮我做上市计划"
    - "产品发布策略怎么做"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "直接输出目标市场定义和上市路径"
  deep_description: "完整GTM策略 + 渠道ROI模拟 + 上市风险预案 + 竞品应对策略"
---

# Go-to-Market策略文档生成

## 核心原则

**GTM是产品与市场的第一次正式约会**

Go-to-Market策略的核心不是"如何把产品推出去"，而是"如何让正确的用户在正确的场景下发现产品价值"。好的GTM策略是产品价值主张与市场需求的精准匹配。

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 产品定位 | markdown | 是 | positioning-strategy | 定位陈述、差异化优势 |
| 差异化策略 | markdown | 否 | positioning-strategy | 竞争差异化定位 |
| 商业模式 | markdown | 否 | business-model-canvas | 价值主张、客户细分、收入来源 |
| 定价方案 | markdown | 否 | business-pricing | 定价模型、价格层级 |
| 增长模式 | markdown | 否 | growth-model | 增长模式诊断、获客策略 |
| 产品信息 | text | 是 | 用户输入 | 产品功能、目标用户、上线时间 |

## 执行步骤

### Step 1：目标市场定义 [核心]

精确定义上市目标市场：

1. **理想客户画像（ICP）**：行业、规模、角色、痛点、购买力
2. **市场切入顺序**：灯塔客户 → 早期采用者 → 早期大众的切入路径
3. **TAM/SAM/SOM**：市场规模估算，聚焦可触达的SOM
4. **市场时机**：为什么是现在？市场趋势、政策窗口、竞争空白

### Step 2：上市路径选择 [核心]

基于产品类型和目标市场选择上市路径：

1. **上市模式评估**：
   - 🚀 大爆炸发布（适合C端消费级产品）
   - 🎯 定向邀请制（适合B端企业级产品）
   - 🔄 渐进式发布（适合平台型产品）
   - 🏖️ 软启动（适合需要市场验证的产品）
2. **路径推荐**：基于产品特征推荐最优路径及理由
3. **阶段划分**：预热期 → 发布期 → 增长期各阶段目标

### Step 3：定价与包装策略 [条件]

确定产品如何被包装和定价：

1. **产品包装**：Free / Pro / Enterprise 各层级功能边界
2. **定价模型**：订阅制 / 按量计费 / 买断制 / 混合模型
3. **上市定价**：首发价、早鸟价、年付折扣等促销策略
4. **价值锚定**：与竞品定价对比，突出性价比优势

### Step 4：渠道与推广计划 [条件]

设计从触达到转化的全链路渠道策略：

1. **自有渠道**：官网、博客、社区、邮件、产品内引导
2. **付费渠道**：搜索广告、社交广告、内容营销、KOL合作
3. **生态渠道**：合作伙伴、应用市场、集成平台、分销商
4. **渠道预算分配**：各渠道预算占比和预期ROI
5. **内容日历**：上市前后4周的内容发布计划

### Step 5：上市里程碑与成功指标 [核心]

定义上市成功的衡量标准：

1. **上市里程碑**：关键时间节点和交付物
2. **成功指标**：
   - 上市首周：注册量、激活率、NPS
   - 上市首月：留存率、付费转化率、CAC
   - 上市首季：LTV、LTV/CAC、市场份额
3. **预警指标**：低于预期时触发的调整机制
4. **Go/No-Go检查清单**：上市前的最终检查项

### Step 6：报告组装 [核心]

将以上内容组装为完整GTM策略文档。

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | 目标市场定义和上市路径 | 核心结论 + 最小可行产物 |
| standard | 完整产物（当前默认） | 完整产物，包含全部Step输出 |
| deep | 完整GTM策略 + 渠道ROI模拟 + 上市风险预案 + 竞品应对策略 | 完整产物 + 扩展分析 + 深度推演 |

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

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| product_name | string | 是 | 产品名称，不可为空 |
| target_market | object | 是 | 目标市场，须含icp/market_size |
| target_market.icp | object | 是 | ICP画像，至少含行业/规模/角色3个维度 |
| target_market.icp.industry | string | 是 | 目标行业，不可为空 |
| target_market.icp.company_size | string | 是 | 企业规模，不可为空 |
| target_market.icp.target_role | string | 是 | 目标角色，不可为空 |
| target_market.icp.pain_points | string[] | 否 | ICP核心痛点 |
| target_market.market_size | object | 是 | 市场规模 |
| target_market.market_size.tam | string | 否 | 总可寻址市场 |
| target_market.market_size.sam | string | 否 | 可服务市场 |
| target_market.market_size.som | string | 否 | 可获得市场 |
| launch_path | object | 是 | 上市路径，须含mode/rationale/phases |
| launch_path.mode | string | 是 | 上市模式，仅允许big_bang/invite_only/progressive/soft_launch |
| launch_path.rationale | string | 是 | 模式选择理由，不可为空 |
| launch_path.phases | array | 是 | 上市阶段列表，至少1个阶段 |
| launch_path.phases[].phase_name | string | 是 | 阶段名称，不可为空 |
| launch_path.phases[].timeline | string | 否 | 阶段时间线 |
| launch_path.phases[].key_activities | string[] | 否 | 关键活动列表 |
| success_metrics | object | 是 | 成功指标，须含week_1/month_1/quarter_1 |
| success_metrics.week_1 | object | 是 | 首周指标 |
| success_metrics.week_1.target_users | number | 否 | 目标用户数 |
| success_metrics.week_1.activation_rate | number | 否 | 激活率 |
| success_metrics.month_1 | object | 是 | 首月指标 |
| success_metrics.month_1.retention_rate | number | 否 | 留存率 |
| success_metrics.month_1.revenue | number | 否 | 收入目标 |
| success_metrics.quarter_1 | object | 是 | 首季指标 |
| success_metrics.quarter_1.market_share | string | 否 | 市场份额目标 |
| success_metrics.quarter_1.nps | number | 否 | NPS目标 |
| channels | object | 否 | 渠道计划，须含owned/paid/ecosystem |
| channels.owned | array | 否 | 自有渠道列表 |
| channels.owned[].channel_name | string | 是 | 渠道名称 |
| channels.owned[].budget_ratio | number | 否 | 预算占比 |
| channels.paid | array | 否 | 付费渠道列表 |
| channels.paid[].channel_name | string | 是 | 渠道名称 |
| channels.paid[].budget_ratio | number | 否 | 预算占比 |
| channels.paid[].expected_roi | number | 否 | 预期ROI |
| channels.ecosystem | array | 否 | 生态渠道列表 |
| channels.ecosystem[].channel_name | string | 是 | 渠道名称 |
| channels.ecosystem[].partner_type | string | 否 | 合作类型 |
| risks | array | 否 | 风险清单 |
| risks[].risk | string | 是 | 风险描述 |
| risks[].probability | string | 否 | 概率，枚举：high/medium/low |
| risks[].impact | string | 否 | 影响程度，枚举：high/medium/low |
| risks[].mitigation | string | 否 | 缓解措施 |

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] ICP画像具体（至少包含行业、规模、角色3个维度）
- [ ] 上市路径有依据（路径选择基于产品类型和目标市场特征）

### P1 检查（standard/deep 必须通过）

- [ ] 渠道预算可执行（各渠道有预算占比和预期ROI）
- [ ] 成功指标可量化（首周/首月/首季指标均有具体数值）

### P2 检查（仅 deep 必须通过）

- [ ] 扩展分析完整（深度推演和路线图已生成）
- [ ] 决策记录完整（关键决策有依据和替代方案）

## 决策规则

- 当产品为B端企业级时，默认选择定向邀请制上市路径
- 当产品为C端消费级时，默认选择大爆炸发布或渐进式发布
- 当定价方案未确定时，GTM策略中定价章节生成框架，具体价格标注"待定价分析"
- 需要人类确认的决策点：上市路径选择、定价层级划分、渠道预算分配、Go/No-Go决策

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 | 数据获取说明 |
|----------|----------|----------|------------|
| 无产品定位 | 基于用户提供的产品信息推导定位，标注"定位待确认" | 产品定位为推导结论，需后续验证 | 要求用户提供产品定位描述或上传positioning-strategy输出文件 |
| 无商业模式 | 聚焦获客和渠道策略，商业模式部分标注"待补充" | 定价与包装策略缺乏商业模式支撑 | 要求用户提供商业模式描述或上传bmc.json文件 |
| 无定价方案 | 生成定价策略框架，具体价格标注"待定价分析" | 定价建议为框架级，无具体价格 | 要求用户提供定价方案或上传business-pricing输出文件 |
| 无增长模式 | 默认PLG模式，标注"增长模式待诊断" | 上市路径和渠道策略基于PLG假设 | 要求用户提供增长模式描述或上传growth-model输出文件 |
| 产品信息缺失 | 提示用户提供产品信息，否则无法确定上市策略 | 上市策略缺乏产品基础 | 要求用户提供产品名称、核心功能和目标用户描述 |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| positioning-strategy | 定位变更 | 目标市场定义和差异化策略 | 重新定义ICP和市场切入顺序 |
| business-pricing | 定价变更 | 定价与包装策略 | 更新定价层级和促销策略 |
| growth-model | 增长模式变更 | 渠道策略和上市路径 | 调整渠道预算分配和上市模式 |
| 用户提供-产品信息 | 上线时间变更 | 上市里程碑和内容日历 | 调整阶段划分和时间线 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| growth-orchestrator | GTM策略生成完成 | 输出文件更新 | GTM策略完成状态和关键结论 |
| product-operations-manual | GTM策略变更 | 写入输出文件 | 上市里程碑和渠道计划 |
