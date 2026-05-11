---
name: positioning-differentiation
description: 当需要评估差异化可持续性时使用。差异化来源自动评估，输入价值曲线+竞品分析+能力评估，从功能/体验/场景/商业/生态5个维度输出差异化强度评分和推荐。关键词：差异化评估、可持续性、竞争壁垒、护城河。
metadata:
  module: "产品商业与战略"
  sub-module: "产品定位与差异化"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 6: 差异化来源自动评估

## 核心原则

1. **五维度全覆盖**——功能/体验/场景/商业/生态5个维度缺一不可
2. **追赶难度量化**——评分标准锚定竞品追赶时间（3月/6月/12月+），拒绝模糊判断
3. **加权综合评分**——各维度加权计算综合差异化强度，权重可调但必须显式
4. **最可持续推荐**——不仅评估当前差异，更要推荐最可持续的差异化来源

## 交互模式
🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 价值曲线 | JSON | 是 | output/pm-strategy/positioning-value-curve/value-curve.json | 竞争要素评分、蓝海动作建议 |
| 竞品分析 | JSON | 是 | output/pm-discovery/market-competitor-intel/competitor-intel.json | 竞品能力、追赶难度评估 |
| 自身能力评估 | JSON | ○ | 用户提供 | 技术壁垒、资源优势 |

## 执行步骤

### Step 1: 功能差异评估
评估产品功能的差异化程度：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 难以复制 | 竞品需要12个月以上追赶 |
| 3分 | 中等难度 | 竞品需要3-6个月追赶 |
| 1分 | 容易复制 | 竞品可在3个月内复制 |

评估维度：
- 核心功能独特性
- 技术复杂度
- 数据积累优势

### Step 2: 体验差异评估
评估用户体验层面的差异化：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 难以追赶 | 用户习惯已形成，转换成本高 |
| 3分 | 中等难度 | 需要持续投入才能保持 |
| 1分 | 容易追赶 | 体验要素可快速复制 |

评估维度：
- 用户习惯培养程度
- 界面/交互独特性
- 使用流程效率

### Step 3: 场景差异评估
评估垂直场景深耕程度：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 深度场景 | 深度理解行业Know-How |
| 3分 | 中度场景 | 覆盖主流场景 |
| 1分 | 浅度场景 | 仅有通用功能 |

评估维度：
- 场景覆盖深度
- 行业专业知识
- 场景解决方案完整性

### Step 4: 商业差异评估
评估商业模式独特性：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 独特模式 | 商业模式难以复制 |
| 3分 | 可复制模式 | 模式可学习但有壁垒 |
| 1分 | 同质模式 | 与行业普遍模式相同 |

评估维度：
- 收入结构独特性
- 成本结构优势
- 商业模式护城河

### Step 5: 生态差异评估
评估生态系统的差异化强度：

| 评分 | 含义 | 说明 |
|------|------|------|
| 5分 | 强生态 | 多方参与，网络效应强 |
| 3分 | 中生态 | 有一定合作伙伴 |
| 1分 | 弱生态 | 单一产品 |

评估维度：
- 合作伙伴数量
- 网络效应强度
- 生态锁定能力

### Step 6: 综合差异化强度计算
加权计算综合差异化强度：
```
综合差异化强度 = (功能差异×0.25 + 体验差异×0.20 + 场景差异×0.25 + 商业差异×0.15 + 生态差异×0.15) / 5
```

### Step 7: 最可持续差异化来源推荐
基于5个维度评分，推荐最可持续的差异化来源：
1. 识别评分最高的维度
2. 分析可持续性理由
3. 给出具体行动建议

## 输出

**存储路径**：`output/pm-strategy/positioning-differentiation/differentiation-assessment.json`

**输出文件**：differentiation-assessment.json

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| differentiation_scores.feature | object | 是 | 功能差异评分，含score/description/sustainability |
| differentiation_scores.experience | object | 是 | 体验差异评分 |
| differentiation_scores.scenario | object | 是 | 场景差异评分 |
| differentiation_scores.business | object | 是 | 商业差异评分 |
| differentiation_scores.ecosystem | object | 是 | 生态差异评分 |
| overall_differentiation_strength | number | 是 | 综合差异化强度0-1 |
| recommended_differentiation_source.dimension | string | 是 | 推荐维度 |
| recommended_differentiation_source.reason | string | 是 | 推荐理由 |
| recommended_differentiation_source.action | string | 是 | 行动建议 |

```json
{
  "differentiation_scores": {
    "feature": {
      "score": 4,
      "description": "核心功能独特，技术壁垒高",
      "sustainability": "高"
    },
    "experience": {
      "score": 3,
      "description": "用户体验良好，有一定习惯壁垒",
      "sustainability": "中"
    },
    "scenario": {
      "score": 5,
      "description": "深度行业场景理解",
      "sustainability": "高"
    },
    "business": {
      "score": 3,
      "description": "商业模式有差异化",
      "sustainability": "中"
    },
    "ecosystem": {
      "score": 4,
      "description": "合作伙伴生态初步形成",
      "sustainability": "中高"
    }
  },
  "overall_differentiation_strength": 0.78,
  "recommended_differentiation_source": {
    "dimension": "scenario",
    "reason": "行业场景深度积累需要12-18个月，难以被竞品短期追赶",
    "action": "继续深耕垂直场景，构建行业解决方案壁垒"
  }
}
```

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 各维度评分 | 需人类校准主观维度 |
| 综合推荐 | 需人类最终判断确认 |
| 争议点 | 升级人类决策 |

## 质量检查

1. **完整性**：5个维度都已评估，无遗漏
2. **客观性**：评分有数据支撑，避免主观偏见
3. **一致性**：推荐理由与评分逻辑一致
4. **可执行性**：行动建议可转化为产品策略

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| positioning-value-curve.json | 用户提供自身和竞品特点 → 评估差异化 | 缺乏价值曲线数据，竞争要素评分缺乏可视化对比 |
| competitor-intel.json | 用户提供自身和竞品特点 → 评估差异化 | 缺乏竞品情报数据，追赶难度评估可能不够精准 |
| positioning-value-curve.json + competitor-intel.json | 用户提供自身和竞品特点描述 → 直接评估差异化 | 整体置信度降低，评分缺乏数据锚定 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的自身和竞品特点评估差异化 | 整体置信度显著降低，评估仅为假设推断 |
| 自身能力评估（用户提供） | 若用户未提供自身能力评估，提示用户提供或跳过该输入相关步骤 | 功能和场景差异评估缺乏内部数据支撑 |

数据获取说明：
- 本Skill需要价值曲线和竞品分析数据，请通过以下方式之一提供：
  1. 直接描述自身产品特点和竞品特点
  2. 上传positioning-value-curve.json / competitor-intel.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| value-curve.json价值曲线更新 | 竞争要素评分和差异化计算 | 重新执行Step 1-6，更新差异化评分 |
| competitor-intel竞品数据更新 | 追赶难度评估 | 重新评估各维度可持续性 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 差异化评分变更 | positioning-statement、business-strategy-report | 输出文件版本号+变更摘要 |
| 推荐差异化来源变更 | positioning-statement、planning-roadmap | 输出文件版本号+变更摘要 |
