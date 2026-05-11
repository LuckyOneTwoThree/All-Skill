---
name: insight-kano
description: 当需要对功能需求进行KANO模型分类（必备型/期望型/兴奋型/无差异型）时使用。KANO自动分类。关键词：KANO模型、需求分类、必备型、期望型、兴奋型、无差异型、功能优先级。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# KANO自动分类

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
| 用户反馈数据 | JSON | 是 | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | 用户声音与情感分析数据 |
| 功能需求列表 | JSON | 是 | output/pm-discovery/insight-requirement-layers/requirement-layers.json | 需求三层模型拆解结果 |

### Input JSON 示例结构

```json
{
  "feedback_data": [
    {
      "feature": "批量导出",
      "positive_mentions": 15,
      "negative_mentions": 45,
      "total_mentions": 60,
      "frequency": 0.08,
      "avg_sentiment_intensity": 3.5,
      "usage_depth_correlation": 0.6
    }
  ],
  "feature_list": [
    {
      "id": "FEAT-001",
      "name": "批量导出",
      "description": "支持批量导出报表数据",
      "source": "REQ-001"
    }
  ]
}
```

## 执行步骤

### Step 1: 功能-反馈关联

将功能需求列表与用户反馈数据进行关联匹配。

- 匹配规则：
  - 功能名称精确匹配
  - 功能描述关键词匹配（匹配度 > 0.7）
  - 用户反馈中提及的功能别名匹配
- 对每个功能计算：
  - **正向提及率** = positive_mentions / total_mentions
  - **负向提及率** = negative_mentions / total_mentions
  - **提及频率** = total_mentions / 总反馈量
  - **平均情感强度** = avg_sentiment_intensity
  - **使用深度相关性** = usage_depth_correlation
- 无法匹配的功能标记为"无反馈数据"

### Step 2: 分类规则

基于计算指标，按以下规则进行KANO分类：

| 分类 | 条件 | 含义 |
|---|---|---|
| 必备型（Must-be） | 负向提及率 > 60% 且 提及频率 > 5% | 缺失时强烈不满，存在时视为理所当然 |
| 期望型（One-dimensional） | 负向提及率 30%-60% 且 与使用深度正相关（correlation > 0.3） | 做得越好用户越满意，做得差用户不满 |
| 兴奋型（Attractive） | 正向提及率 > 60% 且 提及频率 < 5% | 超出预期带来惊喜，缺失不会不满 |
| 无差异型（Indifferent） | 提及频率 < 1% 且 平均情感强度 < 2 | 用户不在乎有无 |

分类置信度计算：
- 所有条件均满足 → 置信度 = 0.9
- 主条件满足但边界值接近阈值（±10%） → 置信度 = 0.7
- 部分条件满足 → 置信度 = 0.5
- 数据不足（反馈量 < 10条） → 置信度 = 0.3

### Step 3: 边界情况处理

对分类结果中的边界情况进行特殊处理。

- **分类置信度 < 0.7**：标记"待人类判定"，附上分类依据和边界原因
- **不同群体分类不同**：按用户群体分别标注分类结果
  - 例如：新用户视为必备型，老用户视为期望型
  - 输出中按群体标注：`{ segment: "新用户", category: "must-be" }`
- **反向型**：如果正向提及率 < 10% 且负向提及率 > 70%，标记为"反向型"（该功能反而引起不满）
- **无反馈数据**：标记为"数据不足"，建议收集数据后再分类

## 输出

输出文件：`output/pm-discovery/insight-kano/kano.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["analysis_metadata", "kano_classification", "summary"],
  "properties": {
    "analysis_metadata": {"type": "object", "description": "分析元数据，包含来源文件、功能总数和时间戳"},
    "kano_classification": {"type": "array", "description": "KANO分类结果列表"},
    "boundary_cases": {"type": "array", "description": "边界情况列表"},
    "summary": {"type": "object", "description": "各类型功能数量统计"}
  }
}
```

### Output JSON 格式

```json
{
  "analysis_metadata": {
    "source_files": ["用户反馈数据", "requirement-layers.json"],
    "total_features": 0,
    "analysis_timestamp": "ISO8601"
  },
  "kano_classification": [
    {
      "feature_id": "FEAT-001",
      "feature_name": "批量导出",
      "category": "must-be",
      "confidence": 0.85,
      "evidence": {
        "negative_rate": 0.75,
        "frequency": 0.08,
        "positive_rate": 0.25,
        "usage_depth_correlation": 0.6,
        "avg_sentiment_intensity": 3.5
      },
      "note": "负向提及率75%远超60%阈值，频率8%>5%，分类明确"
    },
    {
      "feature_id": "FEAT-002",
      "feature_name": "AI智能推荐",
      "category": "attractive",
      "confidence": 0.65,
      "evidence": {
        "negative_rate": 0.1,
        "frequency": 0.03,
        "positive_rate": 0.7,
        "usage_depth_correlation": 0.2,
        "avg_sentiment_intensity": 4.0
      },
      "note": "正向提及率70%>60%但频率3%接近5%阈值边界，置信度降低",
      "needs_human_judgment": true,
      "judgment_reason": "频率接近兴奋型/期望型边界，建议人工判定"
    },
    {
      "feature_id": "FEAT-003",
      "feature_name": "界面主题切换",
      "category": "indifferent",
      "confidence": 0.9,
      "evidence": {
        "negative_rate": 0.05,
        "frequency": 0.005,
        "positive_rate": 0.15,
        "usage_depth_correlation": 0.05,
        "avg_sentiment_intensity": 1.2
      },
      "note": "频率0.5%<1%且情感强度1.2<2，用户关注度极低"
    }
  ],
  "boundary_cases": [
    {
      "feature_id": "FEAT-002",
      "reason": "频率接近兴奋型/期望型边界",
      "suggested_action": "补充更多用户反馈数据或进行专项问卷验证"
    }
  ],
  "summary": {
    "must_be": 1,
    "one_dimensional": 0,
    "attractive": 1,
    "indifferent": 1,
    "needs_judgment": 1
  }
}
```

## 决策规则

| 规则 | 条件 | 动作 |
|---|---|---|
| 低置信度升级 | 分类置信度 < 0.7 | 标记needs_human_judgment=true，升级人类判定 |
| 群体差异标注 | 不同用户群体分类结果不同 | 按群体分别输出分类结果 |
| 反向型标记 | 正向提及率 < 10% 且负向提及率 > 70% | 标记为"reverse"类型，建议重新评估功能价值 |
| 数据不足 | 反馈数据 < 10条 | 标记为"insufficient_data"，不进行分类 |

## 质量检查

- [ ] 所有功能需求已分类
- [ ] 每个分类有evidence支撑
- [ ] 边界情况已标记（confidence < 0.7）
- [ ] 群体差异已按群体标注
- [ ] 无反馈数据的功能已标记
- [ ] 分类统计summary完整

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| 用户反馈数据 | 用户提供功能需求列表 → 基于行业经验推断KANO分类，标注"缺乏用户反馈数据，分类置信度较低" |
| requirement-layers.json | 用户提供功能需求列表 → 直接进行KANO分类，标注"缺乏需求拆解数据" |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的功能需求列表和行业经验推断分类 |

数据获取说明：
- 本Skill需要用户反馈数据和功能需求列表，请通过以下方式之一提供：
  1. 直接粘贴功能需求列表
  2. 上传用户反馈数据/requirement-layers.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
