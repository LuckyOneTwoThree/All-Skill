---
name: user-research-voice-analysis
description: 当需要从用户评论、客服工单、社媒提及、社区帖子中提取情感、主题和痛点时使用。大规模用户声音分析Pipeline。关键词：用户声音分析、VOC、情感分析、痛点提取、用户反馈分析、用户吐槽、用户评价、用户反馈。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "消费", "通用"]
  trigger_examples:
    - "用户都在吐槽什么"
    - "帮我分析用户反馈"
    - "用户评价怎么样"
  interaction_mode: "ai_auto"
---

# 大规模用户声音分析

## 核心原则

1. **原声优先于总结**——用户原话比AI概括更有说服力，每个痛点必须有代表原声支撑
2. **痛点分级而非平铺**——按影响面×痛苦度×频率评分分级，不输出无优先级的痛点清单
3. **情感是信号不是噪音**——负面情绪指向真实痛点，混合情感指向未满足期望，都需深入分析
4. **数据量决定可信度**——反馈量<500条时结论降级为"探索性"，置信度上限0.5

## 交互模式

🤖 **AI自动执行** — 无需人类介入，全程自动化完成

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| app_reviews | JSON | 是 | 用户提供 | 应用商店评论数据（App Store / Google Play） |
| support_tickets | JSON | 是 | 用户提供 | 客服工单系统数据 |
| social_mentions | JSON | ○ | 用户提供 | 社交媒体提及数据（微博/小红书/Twitter等） |
| community_posts | JSON | ○ | 用户提供 | 社区/论坛帖子数据 |
| analysis_config | object | ○ | 用户提供 | 分析配置（语言、情感模型、聚类方法、最小聚类大小） |

### 输入格式

```json
{
  "data_sources": [
    {
      "type": "app_reviews",
      "location": "string",
      "time_range": "string",
      "expected_volume": "number"
    },
    {
      "type": "support_tickets",
      "location": "string",
      "time_range": "string",
      "expected_volume": "number"
    },
    {
      "type": "social_mentions",
      "location": "string",
      "time_range": "string",
      "expected_volume": "number"
    },
    {
      "type": "community_posts",
      "location": "string",
      "time_range": "string",
      "expected_volume": "number"
    }
  ],
  "analysis_config": {
    "language": "string",
    "sentiment_model": "string",
    "clustering_method": "string",
    "min_cluster_size": "number"
  }
}
```

**数据源说明**：
- `app_reviews`：应用商店评论（App Store / Google Play / 其他）
- `support_tickets`：客服工单系统数据
- `social_mentions`：社交媒体提及（微博/小红书/Twitter等）
- `community_posts`：社区/论坛帖子

---

## 执行步骤

### Step 1：数据采集与清洗

- 从各数据源拉取原始数据
- 去重（同一用户同一内容跨平台去重）
- 去噪（广告、水军、无关内容过滤）
- 语言检测与过滤
- 时间范围校验
- 输出：清洗后的反馈数据集，记录原始条数与清洗后条数

### Step 2：情感分类

- 对每条反馈进行情感分类：正面 / 负面 / 中性 / 混合
- 提取情感强度（0-1）
- 对负面反馈提取情感维度：愤怒/失望/困惑/焦虑/其他
- 输出：每条反馈附带情感标签和强度

### Step 3：主题聚类

- 对所有反馈进行语义聚类
- 生成主题标签（自动生成 + 人工可调整）
- 统计每个主题的反馈量、情感分布、趋势变化
- 识别跨主题的关联关系
- 输出：主题列表，每个主题包含反馈量、情感分布、代表原声

### Step 4：痛点提取与分级

- 从负面反馈和混合反馈中提取痛点
- 痛点分级标准：
  - **P0（致命）**：影响核心功能使用，大量用户受影响
  - **P1（严重）**：影响重要体验，较多用户受影响
  - **P2（一般）**：影响次要体验，部分用户受影响
  - **P3（轻微）**：体验瑕疵，少量用户提及
- 痛点评分 = 影响面（受影响用户占比） × 痛苦度（情感强度均值） × 频率（提及次数/总反馈数）
- 输出：痛点列表，按评分降序排列

### Step 5：用户分群洞察

- 基于反馈内容和情感模式进行用户分群
- 每个分群描述：核心特征、主要诉求、情感倾向、规模占比
- 识别分群间的差异和共性
- 输出：用户分群列表

---

## 输出

输出文件：`output/pm-discovery/user-research-voice-analysis/voice-analysis.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["summary", "metadata"],
  "properties": {
    "summary": {"type": "object", "description": "分析摘要，含反馈总量、情感分布、主题、痛点和用户分群"},
    "metadata": {"type": "object", "description": "元数据，含时间戳、数据质量标记和整体置信度"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| summary.total_feedback_analyzed | number | 是 | 分析的反馈总量，须>0 |
| summary.data_sources_used | string[] | 是 | 实际使用的数据源列表，不可为空 |
| summary.time_range | string | 是 | 数据时间范围 |
| summary.sentiment_distribution.positive | number | 是 | 正面情感占比，0-1 |
| summary.sentiment_distribution.negative | number | 是 | 负面情感占比，0-1 |
| summary.sentiment_distribution.neutral | number | 是 | 中性情感占比，0-1 |
| summary.sentiment_distribution.mixed | number | 是 | 混合情感占比，0-1 |
| summary.top_themes | array | 是 | 主题列表，每项须含theme、feedback_count、representative_quotes、confidence |
| summary.top_themes[].representative_quotes | string[] | 是 | 每个主题≥2条代表原声 |
| summary.top_themes[].confidence | number | 是 | 主题置信度，0-1 |
| summary.top_pain_points | array | 是 | 痛点列表，每项须含pain_point、severity、impact_score、representative_quotes、confidence |
| summary.top_pain_points[].severity | string | 是 | 痛点等级，枚举：P0/P1/P2/P3 |
| summary.top_pain_points[].representative_quotes | string[] | 是 | 每个痛点≥2条代表原声 |
| summary.top_pain_points[].confidence | number | 是 | 痛点置信度，0-1 |
| summary.emerging_themes | array | 否 | 新兴主题列表 |
| summary.emerging_themes[].confidence | number | 是 | 新兴主题置信度，0-1 |
| summary.user_segments | array | 是 | 用户分群列表，每项须含segment_name、size_ratio、confidence |
| summary.user_segments[].confidence | number | 是 | 分群置信度，0-1 |
| metadata.analysis_timestamp | string | 是 | 分析时间戳 |
| metadata.data_quality_flags | string[] | 是 | 数据质量标记 |
| metadata.confidence_overall | number | 是 | 整体置信度，0-1 |

```json
{
  "summary": {
    "total_feedback_analyzed": "number",
    "data_sources_used": ["string"],
    "time_range": "string",
    "sentiment_distribution": {
      "positive": "number",
      "negative": "number",
      "neutral": "number",
      "mixed": "number"
    },
    "top_themes": [
      {
        "theme": "string",
        "feedback_count": "number",
        "sentiment_breakdown": {},
        "trend": "rising|stable|declining",
        "representative_quotes": ["string"],
        "confidence": "number"
      }
    ],
    "top_pain_points": [
      {
        "pain_point": "string",
        "severity": "P0|P1|P2|P3",
        "impact_score": "number",
        "affected_user_ratio": "number",
        "emotion_intensity_avg": "number",
        "frequency": "number",
        "related_theme": "string",
        "representative_quotes": ["string"],
        "confidence": "number"
      }
    ],
    "emerging_themes": [
      {
        "theme": "string",
        "frequency_change": "string",
        "current_volume": "number",
        "confidence": "number"
      }
    ],
    "user_segments": [
      {
        "segment_name": "string",
        "core_characteristics": ["string"],
        "primary_needs": ["string"],
        "sentiment_tendency": "string",
        "size_ratio": "number",
        "confidence": "number"
      }
    ]
  },
  "metadata": {
    "analysis_timestamp": "string",
    "data_quality_flags": ["string"],
    "confidence_overall": "number"
  }
}
```

---

## 决策规则

| 条件 | 动作 |
|------|------|
| 数据量 < 500条 | 标记"数据不足"，输出降级为"探索性结论"，置信度上限0.5 |
| 新兴主题频率上升 > 100%（环比） | 触发升级，标记为"需人类关注"，建议进入深度分析 |
| P0级痛点发现 | 立即通知人类，不等待完整流程结束 |
| 情感分类置信度 < 0.7 | 标记为"低置信度分类"，纳入统计但标注警告 |
| 数据源缺失率 > 30% | 标记"数据源不完整"，建议补充数据 |

---

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|-----------|
| 反馈覆盖量 | ≥ 500条 | 标记数据不足，输出降级 |
| 情感分类覆盖率 | ≥ 95% | 未分类条目标记"未覆盖"，说明原因 |
| 主题聚类一致性 | Silhouette Score ≥ 0.5 | 调整聚类参数或标记"聚类质量待优化" |
| 所有输出标注置信度 | 100% | 缺失置信度的字段补填默认值0.3并标记 |
| 痛点有代表原声 | 每个痛点≥2条原声 | 标记"原声支撑不足" |
| 数据去重率 | 记录去重比例 | 去重率>50%时标记"数据源可能重复" |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 所有数据源均缺失 | 提示用户先提供反馈数据，或基于用户直接粘贴的反馈文本执行轻量版分析 | summary字段为空，置信度降为0 |
| 若用户未提供app_reviews | 提示用户提供应用商店评论数据，否则缺乏核心反馈来源 | data_sources_used缺少app_reviews，情感分布和主题可能偏斜 |
| 若用户未提供support_tickets | 提示用户提供客服工单数据，否则缺乏核心反馈来源 | data_sources_used缺少support_tickets，痛点可能遗漏工单类问题 |
| 若用户未提供social_mentions | 跳过该输入相关步骤，社交媒体数据不参与分析 | data_sources_used缺少social_mentions，新兴主题检测能力降低 |
| 若用户未提供community_posts | 跳过该输入相关步骤，社区帖子数据不参与分析 | data_sources_used缺少community_posts，深度用户洞察可能缺失 |
| 若用户未提供analysis_config | 跳过该输入相关步骤，使用默认分析配置 | 使用默认配置，分析参数可能非最优 |

## 数据获取说明`n本Skill需要用户声音数据（评论、工单、社媒提及等），请通过以下方式之一提供：
  1. 直接粘贴反馈文本内容
  2. 上传CSV/Excel/JSON文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响

本Skill为起始Skill，无上游文件依赖，不涉及上游变更影响。

### 下游通知机制

| 下游Skill | 通知触发条件 | 通知方式 | 通知内容 |
|-----------|------------|---------|---------|
| user-research-user-modeling | voice-analysis.json更新完成 | 写入output文件 | 通知用户分群、痛点、主题数据已就绪 |
| user-research-report | voice-analysis.json更新完成 | 写入output文件 | 通知情感分布、痛点、主题数据已就绪 |
