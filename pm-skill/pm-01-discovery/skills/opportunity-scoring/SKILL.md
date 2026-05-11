---
name: opportunity-scoring
description: 当需要对产品机会进行多维度量化评分时使用。机会评分自动计算，包括问题真实性、市场规模、解决可行性、战略契合度、竞争壁垒五个维度。关键词：机会评分、机会量化、加权评分、战略契合度、机会优先级。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Opportunity Scoring — 机会评分

## 核心原则

1. **数据优先人工补充**——AI处理大规模数据，人类补充定性洞察
2. **显式规则拒绝模糊**——所有分类/判断规则必须可编码
3. **批量并行规模优势**——能并行的步骤不串行
4. **标注置信度分级交付**——所有推断标注置信度，<0.5升级人类

## 交互模式

🤖 AI 自动执行（战略契合度维度 👤 由人类执行）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 用户研究数据 | JSON | 是 | output/pm-discovery/user-research-voice-analysis/voice-analysis.json / output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 痛点提及率、行为数据印证 |
| 市场分析数据 | JSON | 是 | output/pm-discovery/market-tam-som/tam-som.json | SOM 估算值 |
| 竞品分析数据 | JSON | 是 | output/pm-discovery/market-competitor-intel/competitor-intel.json | 竞品能力与壁垒分析 |
| 技术团队评估 | object | ○ | 用户提供 | 现有技术栈可实现性评估 |

## 执行步骤

### 评分函数

**总分 = Σ(维度得分 × 维度权重)**

#### 维度1：问题真实性（权重 0.30）

| 得分 | 标准 |
|------|------|
| 5 | 痛点提及率 > 10% 且行为数据印证 |
| 4 | 痛点提及率 > 10% 但无行为数据印证 |
| 3 | 痛点提及率 5%-10% 且行为数据印证 |
| 2 | 痛点提及率 5%-10% 但无行为数据印证 |
| 1 | 无直接数据，纯假设 |

#### 维度2：市场规模（权重 0.25）

| 得分 | 标准 |
|------|------|
| 5 | SOM > 1亿 |
| 4 | SOM 5000万-1亿 |
| 3 | SOM 1000万-5000万 |
| 2 | SOM 500万-1000万 |
| 1 | 无法估算 |

#### 维度3：解决可行性（权重 0.20）

| 得分 | 标准 |
|------|------|
| 5 | 现有技术栈可直接实现 |
| 4 | 现有技术栈需少量扩展 |
| 3 | 需引入新技术但团队有能力 |
| 2 | 需引入新技术且团队需学习 |
| 1 | 当前技术不可行 |

#### 维度4：战略契合度（权重 0.15）👤 人类判定

| 得分 | 标准 |
|------|------|
| 5 | 核心战略方向，高度契合 |
| 4 | 重要战略方向，较好契合 |
| 3 | 相关战略方向，部分契合 |
| 2 | 边缘战略方向，弱契合 |
| 1 | 不在战略方向内 |

> **注意**：AI 提供战略契合度分析建议，但最终得分必须由人类判定。AI 评分后此维度标记为 `needs_human: true`。

#### 维度5：竞争壁垒（权重 0.10）

| 得分 | 标准 |
|------|------|
| 5 | 竞品无此能力且短期难复制 |
| 4 | 竞品无此能力但中期可复制 |
| 3 | 竞品有部分能力但体验差 |
| 2 | 竞品有较好能力但未主导 |
| 1 | 竞品已领先 |

## 输出

输出文件：`output/pm-discovery/opportunity-scoring/opportunity-scoring.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["opportunities", "metadata"],
  "properties": {
    "opportunities": {"type": "array", "description": "机会评分列表，含各维度得分和加权总分"},
    "metadata": {"type": "object", "description": "评分元数据，含版本和待人类输入状态"}
  }
}
```

```json
{
  "opportunities": [
    {
      "name": "机会名称",
      "scores": {
        "problem_validity": {
          "score": 4,
          "weight": 0.30,
          "evidence": "痛点提及率12%，行为数据显示用户反复尝试解决",
          "needs_human": false
        },
        "market_size": {
          "score": 3,
          "weight": 0.25,
          "evidence": "SOM估算约3000万",
          "needs_human": false
        },
        "feasibility": {
          "score": 4,
          "weight": 0.20,
          "evidence": "现有技术栈需少量扩展",
          "needs_human": false
        },
        "strategic_fit": {
          "score": null,
          "weight": 0.15,
          "evidence": "AI分析：该机会与核心战略方向高度相关，建议评分4-5",
          "needs_human": true
        },
        "competitive_moat": {
          "score": 3,
          "weight": 0.10,
          "evidence": "竞品有部分能力但体验差",
          "needs_human": false
        }
      },
      "weighted_total": null,
      "provisional_rank": null
    }
  ],
  "metadata": {
    "scoring_version": "1.0",
    "awaiting_human_input": true,
    "pending_dimensions": ["strategic_fit"]
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `name` | string | 机会名称 |
| `scores.{dimension}.score` | number\|null | 维度得分（1-5），待人类判定时为 null |
| `scores.{dimension}.weight` | number | 维度权重 |
| `scores.{dimension}.evidence` | string | 评分依据 |
| `scores.{dimension}.needs_human` | boolean | 是否需要人类判定 |
| `weighted_total` | number\|null | 加权总分，待人类判定后计算 |
| `provisional_rank` | number\|null | 暂定排名，待人类判定后计算 |

## 决策规则

1. **战略契合度必须人类判定**：AI 仅提供分析建议，不自动评分
2. **加权总分待人类判定后计算**：所有维度评分完成后方可计算 `weighted_total`
3. **暂定排名基于已评分维度**：在人类判定前可提供基于4个维度的暂定排名供参考

## 质量检查

| 检查项 | 通过条件 |
|--------|----------|
| 所有维度已评分 | 5个维度均有 score 值或标记为 needs_human |
| 战略契合度标记为待人类判定 | `strategic_fit.needs_human === true` |
| 评分依据完整 | 每个维度的 evidence 字段非空 |
| 权重一致性 | 5个维度权重之和 = 1.00 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| 用户研究数据（voice-analysis / behavior-analysis） | 用户描述机会 → 基于描述评分，问题真实性维度使用默认值，标注置信度较低 |
| 市场分析数据（tam-som） | 用户描述机会 → 市场规模维度基于用户估算评分，标注"缺乏市场数据" |
| 竞品分析数据（competitor-intel） | 用户描述机会 → 竞争壁垒维度基于用户描述评分，标注"缺乏竞品数据" |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户描述的机会直接评分（标注置信度较低） |
| 若用户未提供技术团队评估 | 跳过该输入相关步骤，可解决性维度使用默认值3（中等），标记confirmed=false |

数据获取说明：
- 本Skill需要用户研究、市场分析和竞品分析数据，请通过以下方式之一提供：
  1. 直接描述机会及其相关数据
  2. 上传voice-analysis.json / tam-som.json / competitor-intel.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
