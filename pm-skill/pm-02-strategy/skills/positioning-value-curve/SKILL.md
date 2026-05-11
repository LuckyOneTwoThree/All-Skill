---
name: positioning-value-curve
description: 当需要进行竞争定位可视化、蓝海策略制定时使用。价值曲线自动绘制。输入竞品分析+用户研究，绘制竞争价值曲线，识别蓝海机会。关键词：价值曲线、竞争定位、蓝海策略、差异化可视化。
metadata:
  module: "产品商业与战略"
  sub-module: "产品定位与差异化"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 4: 价值曲线自动绘制

## 核心原则

1. **竞争要素用户驱动**——竞争要素从用户研究中提取，非AI主观设定
2. **蓝海四动作框架**——Eliminate/Reduce/Raise/Create四动作必须全部识别
3. **差异化强度量化**——通过面积法计算差异化强度0-1评分，<0.5触发警告
4. **多方评分对比**——我方与每个主要竞品在同一要素上评分对比，差异可视化

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 竞品分析数据 | JSON | 是 | output/pm-discovery/market-competitor-intel/competitor-intel.json | 竞品功能、定价、定位 |
| 用户研究数据 | JSON | 是 | user-research-voice-analysis / user-research-user-modeling | 用户关注要素、满意度 |
| 价值主张 | JSON | 是 | output/pm-strategy/business-model-canvas/bmc.json | 价值主张、Pain Relievers、Gain Creators |

## 执行步骤

### Step 1: 竞争要素提取
从用户研究数据中提取5-8个竞争要素：

**提取逻辑**：
1. 从用户关注要素中提取高频关键词
2. 从价值主张中提取核心价值维度
3. 从竞品分析中提取竞品竞争维度
4. 合并和去重，形成5-8个竞争要素

**要素命名规范**：
- 使用用户语言（非技术术语）
- 每个要素可独立评分
- 要素之间不重叠

### Step 2: 竞品评分
对每个竞品在竞争要素上进行1-5分评分：

**评分标准**：
```
5分：行业领先，显著优于竞品
4分：优秀，优于多数竞品
3分：行业平均水平
2分：低于行业平均
1分：明显不足
```

**评分依据**：
- 功能完整性
- 用户评价
- 定价竞争力
- 市场份额

### Step 3: 我方评分
对我方产品在竞争要素上进行1-5分评分：

**评分原则**：
- 基于现有能力客观评分
- 不夸大、不低估
- 标注评分依据

### Step 4: 蓝海四动作识别
基于价值曲线分析，识别蓝海策略的4个动作：

**Eliminate（消除）**：哪些竞争要素可以完全消除？
- 评分≤2的要素
- 用户不关注的要素
- 成本高但价值低的要素

**Reduce（减少）**：哪些竞争要素可以降低标准？
- 评分3-4但非核心的要素
- 过度投资的要素
- 用户关注度中等的要素

**Raise（提升）**：哪些竞争要素需要提升？
- 核心差异化要素
- 用户高度关注但评分偏低的要素
- 竞品普遍薄弱的要素

**Create（创造）**：哪些新的竞争要素可以创造？
- 用户未被满足的需求
- 竞品尚未提供的价值
- 创新性功能或体验

### Step 5: 差异化强度计算
通过面积法计算差异化强度：

```
差异化强度 = 我方曲线与竞品平均曲线的面积差 / 最大可能面积差
```

- 强度 ≥ 0.7：强差异化
- 强度 0.5-0.7：中等差异化
- 强度 < 0.5：弱差异化（触发警告）

## 输出

**存储路径**：`output/pm-strategy/positioning-value-curve/`

**输出文件**：value-curve.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| value_curve.competitive_factors | array | 是 | 5-8个竞争要素 |
| value_curve.competitive_factors[].factor | string | 是 | 要素名称 |
| value_curve.competitive_factors[].our_score | number | 是 | 我方评分1-5 |
| value_curve.competitive_factors[].competitor_scores | object | 是 | 各竞品评分 |
| value_curve.blue_ocean_actions.eliminate | array | 是 | 消除动作列表 |
| value_curve.blue_ocean_actions.reduce | array | 是 | 减少动作列表 |
| value_curve.blue_ocean_actions.raise | array | 是 | 提升动作列表 |
| value_curve.blue_ocean_actions.create | array | 是 | 创造动作列表 |
| value_curve.differentiation_strength | number | 是 | 差异化强度0-1 |
| value_curve.differentiation_warning | boolean | 是 | 差异化强度<0.5时为true |

```json
{
  "value_curve": {
    "competitive_factors": [
      {
        "factor": "个性化学习体验",
        "our_score": 5,
        "competitor_scores": {
          "竞品A": 2,
          "竞品B": 3,
          "竞品C": 1
        },
        "importance": "high"
      },
      {
        "factor": "内容丰富度",
        "our_score": 2,
        "competitor_scores": {
          "竞品A": 5,
          "竞品B": 4,
          "竞品C": 3
        },
        "importance": "medium"
      }
    ],
    "blue_ocean_actions": {
      "eliminate": [
        {
          "factor": "K12学科内容",
          "reason": "非核心赛道，资源投入产出比低"
        }
      ],
      "reduce": [
        {
          "factor": "内容丰富度",
          "reason": "从追求SKU数量转向精品课程策略",
          "target_level": 3
        }
      ],
      "raise": [
        {
          "factor": "个性化学习体验",
          "reason": "核心差异化优势，持续加大投入",
          "target_level": 5
        }
      ],
      "create": [
        {
          "factor": "AI学习路径可视化",
          "reason": "竞品尚未提供，用户有强需求",
          "target_level": 5
        }
      ]
    },
    "differentiation_strength": 0.72,
    "differentiation_warning": false
  }
}
```

## 决策规则

1. **差异化强度<0.5**：触发警告，建议调整策略
2. **蓝海动作**：需人类审批确认
3. **竞争要素**：需人类校准

## 质量检查

- [ ] 5-8个竞争要素已提取
- [ ] 我方和竞品评分已完成
- [ ] 蓝海四动作已识别
- [ ] 差异化强度已计算
- [ ] 评分依据已标注

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| competitor-intel.json | 用户提供竞品信息 → 绘制价值曲线 | 缺乏竞品分析数据，竞品评分可能不够精准 |
| 用户研究数据（voice-analysis / persona） | 用户提供竞品信息 → 绘制价值曲线 | 缺乏用户研究数据，竞争要素可能偏离用户关注 |
| bmc.json | 用户提供竞品信息 → 绘制价值曲线 | 缺乏BMC数据，我方评分缺乏价值主张锚定 |
| competitor-intel.json + 用户研究数据 + bmc.json | 用户提供竞品信息 → 绘制价值曲线 | 整体置信度降低，评分缺乏数据锚定 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的竞品信息绘制价值曲线 | 整体置信度显著降低，价值曲线仅为假设推断 |

数据获取说明：
- 本Skill需要竞品分析、用户研究和BMC数据，请通过以下方式之一提供：
  1. 直接描述产品特点、竞品特点和用户关注要素
  2. 上传competitor-intel.json / voice-analysis.json / bmc.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| competitor-intel竞品数据更新 | 竞品评分和蓝海动作 | 重新执行Step 2和Step 4，更新竞品评分 |
| persona/voice-analysis用户洞察更新 | 竞争要素提取 | 重新执行Step 1，更新竞争要素 |
| bmc.json价值主张变更 | 我方评分和蓝海动作 | 重新执行Step 3和Step 4，更新我方评分 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 竞争要素变更 | positioning-differentiation、positioning-statement | 输出文件版本号+变更摘要 |
| 蓝海动作调整 | positioning-differentiation、planning-roadmap | 输出文件版本号+变更摘要 |
| 差异化强度变更 | positioning-statement | 输出文件版本号+变更摘要 |
