---
name: planning-porter-five-forces
description: 当需要进行行业分析、竞争战略制定、市场吸引力评估时使用。波特五力自动评估。分析行业竞争结构的五种力量，评估行业吸引力。关键词：波特五力、行业分析、竞争战略、行业吸引力、竞争结构。
metadata:
  module: "产品商业与战略"
  sub-module: "战略规划与路线图"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 8: 波特五力自动评估

## 核心原则

1. **五力全覆盖**——新进入者、替代品、供应商、买家、同业竞争五种力量缺一不可
2. **1-5分标尺统一**——每力使用1-5分评分，评分标准前置定义，不可主观随意
3. **数据依据标注**——每个评分因子必须标注数据来源和影响程度
4. **吸引力总评人类定**——行业吸引力综合判断必须人类决策，AI只提供评分支撑

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 竞品分析数据 | JSON | 是 | output/pm-discovery/market-competitor-intel/competitor-intel.json | 竞品能力、市场份额、战略动向 |
| 市场数据 | JSON | 是 | output/pm-discovery/market-tam-som/tam-som.json | 市场规模、增长率 |
| 行业信息 | JSON | ○ | output/pm-discovery/market-pest/pest.json | 政策法规、技术动态 |

## 执行步骤

### 五力评估框架

### Force 1: 新进入者威胁

评估因素：
- 进入门槛高低
- 品牌忠诚度
- 规模经济要求
- 转换成本
- 资本要求
- 分销渠道控制

评分标准：
```
1分：进入壁垒极高，几乎不可能进入
2分：进入壁垒较高，新进入者困难
3分：中等壁垒，存在一定进入可能
4分：进入壁垒较低，容易进入
5分：进入壁垒很低，极易进入
```

### Force 2: 替代品威胁

评估因素：
- 替代品数量和质量
- 转换成本
- 替代品价格优势
- 用户对替代品的接受度

评分标准：
```
1分：几乎没有替代品
2分：替代品较少，转换成本高
3分：存在一定替代品
4分：替代品较多，价格优势明显
5分：大量替代品，威胁极大
```

### Force 3: 供应商议价能力

评估因素：
- 供应商数量和集中度
- 切换供应商成本
- 前向整合可能性
- 供应商产品差异化
- 供应商规模

评分标准：
```
1分：供应商分散，议价能力弱
2分：供应商较多，选择余地大
3分：供应商能力中等
4分：供应商集中，议价能力强
5分：供应商垄断，议价能力极强
```

### Force 4: 买家议价能力

评估因素：
- 买家数量和集中度
- 转换成本
- 价格敏感度
- 买家信息透明度
- 购买量大小

评分标准：
```
1分：买家分散，议价能力弱
2分：买家较多，选择余地大
3分：买家能力中等
4分：买家集中，议价能力强
5分：买家垄断，议价能力极强
```

### Force 5: 同业竞争强度

评估因素：
- 竞争者数量和规模
- 行业增长率
- 产品差异化程度
- 退出壁垒高低
- 竞争策略多样性

评分标准：
```
1分：竞争温和，市场稳定
2分：竞争适中，有序发展
3分：竞争中等，波动明显
4分：竞争激烈，价格战常见
5分：竞争白热化，淘汰频繁
```

## 输出

**存储路径**：`output/pm-strategy/planning-porter-five-forces/`

**输出文件**：porter_five_forces.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| porter_five_forces.new_entrant_threat.score | number | 是 | 1-5分 |
| porter_five_forces.new_entrant_threat.key_factors | array | 是 | 关键影响因素列表 |
| porter_five_forces.substitutes_threat.score | number | 是 | 1-5分 |
| porter_five_forces.substitutes_threat.key_factors | array | 是 | 关键影响因素列表 |
| porter_five_forces.supplier_power.score | number | 是 | 1-5分 |
| porter_five_forces.supplier_power.key_factors | array | 是 | 关键影响因素列表 |
| porter_five_forces.buyer_power.score | number | 是 | 1-5分 |
| porter_five_forces.buyer_power.key_factors | array | 是 | 关键影响因素列表 |
| porter_five_forces.competitive_rivalry.score | number | 是 | 1-5分 |
| porter_five_forces.competitive_rivalry.key_factors | array | 是 | 关键影响因素列表 |
| porter_five_forces.industry_attractiveness.overall_score | number | 是 | 综合评分 |
| porter_five_forces.industry_attractiveness.rating | string | 是 | 吸引力等级 |
| porter_five_forces.key_recommendations | array | 是 | 战略建议列表 |

```yaml
porter_five_forces:
  new_entrant_threat:
    score: 3
    key_factors:
      - factor: "进入门槛"
        impact: "high"
        description: "描述"
    analysis: "综合分析"
  substitutes_threat:
    score: 4
    key_factors:
      - factor: "替代品数量"
        impact: "high"
        description: "描述"
    analysis: "综合分析"
  supplier_power:
    score: 2
    key_factors:
      - factor: "供应商集中度"
        impact: "medium"
        description: "描述"
    analysis: "综合分析"
  buyer_power:
    score: 4
    key_factors:
      - factor: "买家集中度"
        impact: "high"
        description: "描述"
    analysis: "综合分析"
  competitive_rivalry:
    score: 5
    key_factors:
      - factor: "竞争者数量"
        impact: "high"
        description: "描述"
    analysis: "综合分析"
  industry_attractiveness:
    overall_score: 3.6
    rating: "中等吸引力"
    summary: "行业总体吸引力评估"
  key_recommendations:
    - recommendation: "战略建议1"
      impact: "high"
    - recommendation: "战略建议2"
      impact: "medium"
```

## 决策规则

1. **评分校准**：各力量评分需人类校准确认
2. **关键力量识别**：识别对战略影响最大的力量
3. **行业吸引力**：总评必须人类判断

## 质量检查

- [ ] 5种力量都已评估
- [ ] 每种力量有明确的评分
- [ ] 评分有数据依据
- [ ] 关键影响因素已识别
- [ ] 行业吸引力总评已完成

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| competitor-intel.json | 用户提供行业信息 → 基于AI知识评估五力 | 缺乏竞品分析数据，同业竞争和替代品评分可能不够精准 |
| 市场数据（tam-som / pest） | 用户提供行业信息 → 基于AI知识评估五力 | 缺乏市场数据，行业吸引力评估缺乏量化依据 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的行业信息基于AI知识评估五力 | 整体置信度显著降低，评分主要为AI推断 |

数据获取说明：
- 本Skill需要竞品分析和市场数据，请通过以下方式之一提供：
  1. 直接描述行业信息、竞争格局和供应链结构
  2. 上传competitor-intel.json / tam-som.json / pest.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| competitor-intel竞品数据更新 | 同业竞争强度和新进入者威胁 | 重新评估Force 1和Force 5，更新评分 |
| tam-som市场规模变更 | 行业吸引力评估 | 重新计算吸引力综合评分 |
| pest政策/技术环境变更 | 五力评估的多项因素 | 重新评估受影响的力，更新关键因素 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 五力评分变更 | planning-swot、business-strategy-report | 输出文件版本号+变更摘要 |
| 行业吸引力评级变更 | planning-ansoff、business-strategy-report | 输出文件版本号+变更摘要 |
| 战略建议调整 | planning-swot | 输出文件版本号+变更摘要 |
