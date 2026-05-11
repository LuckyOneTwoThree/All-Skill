---
name: user-research-behavior-analysis
description: 当需要从事件数据、漏斗数据、热力图数据中诊断漏斗健康度、发现Aha Moment、分析功能使用深度时使用。行为数据自动分析Pipeline。关键词：行为分析、漏斗分析、Aha Moment、功能使用分析、异常检测。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_auto"
---

# 行为数据自动分析

## 核心原则

1. **行为不说谎**——用户实际行为比自我报告更可靠，以行为数据为事实基准
2. **漏斗是症状不是病因**——漏斗断裂点指向问题表现，需深挖流失用户的最后行为和特征
3. **Aha Moment是因果不是相关**——候选行为必须通过预测力验证，相关性≠因果性
4. **异常是信号不是噪音**——指标突变/渐变/周期异常都需归因，不可忽略或简单平滑

## 交互模式

🤖 **AI自动执行** — 无需人类介入，全程自动化完成

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| event_data | JSON | 是 | 用户提供 | 用户行为事件日志（点击、浏览、提交等） |
| funnel_data | JSON | 是 | 用户提供 | 转化漏斗各步骤数据 |
| heatmap_data | JSON | ○ | 用户提供 | 页面热力图数据（点击热力图、滚动热力图） |
| analysis_config | object | ○ | 用户提供 | 分析配置（异常灵敏度、漏斗粒度、队列维度） |

### 输入格式

```json
{
  "data_sources": [
    {
      "type": "event_data",
      "location": "string",
      "time_range": "string",
      "events_tracked": ["string"],
      "daily_active_users": "number"
    },
    {
      "type": "funnel_data",
      "location": "string",
      "funnel_steps": ["string"],
      "time_range": "string"
    },
    {
      "type": "heatmap_data",
      "location": "string",
      "pages_covered": ["string"],
      "time_range": "string"
    }
  ],
  "analysis_config": {
    "anomaly_sensitivity": "high|medium|low",
    "funnel_granularity": "daily|weekly|monthly",
    "cohort_dimensions": ["string"]
  }
}
```

**数据源说明**：
- `event_data`：用户行为事件日志（点击、浏览、提交等）
- `funnel_data`：转化漏斗各步骤数据
- `heatmap_data`：页面热力图数据（点击热力图、滚动热力图）

---

## 执行步骤

### Step 1：漏斗健康度诊断

- 计算漏斗各步骤转化率
- 识别转化率异常低的步骤（低于行业基准或历史均值1个标准差）
- 分析各步骤流失用户的特征（最后行为、停留时长、设备等）
- 计算漏斗整体健康度评分（0-100）
- 输出：漏斗诊断报告，包含各步骤转化率、流失分析、健康度评分

### Step 2：行为路径分析

- 提取用户实际行为路径（非预设路径）
- 识别高频路径和异常路径
- 发现用户"绕路"行为（走了非预期路径到达目标）
- 识别用户"迷失"行为（在多个页面间反复跳转）
- 输出：行为路径图，标注高频路径、绕路、迷失点

### Step 3：功能使用深度分析

- 统计各功能的使用率（触达用户数 / 活跃用户数）
- 分析功能使用深度（仅发现 → 尝试 → 深度使用 → 付费转化）
- 识别高价值但低使用率的功能（发现障碍）
- 识别低价值但高使用率的功能（可能误导用户）
- 输出：功能使用矩阵（使用率 × 价值度）

### Step 4：异常检测

- 对关键行为指标进行时序异常检测
- 检测维度：日活、留存、核心功能使用率、转化率
- 异常类型：突变（单日大幅变化）、渐变（持续趋势变化）、周期异常（与历史周期不符）
- 关联异常与可能的原因（版本发布、外部事件、数据问题）
- 输出：异常事件列表，包含异常类型、影响范围、可能原因、置信度

---

## 输出

输出文件：`output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["funnel_health", "aha_moment_candidates", "feature_usage", "metadata"],
  "properties": {
    "funnel_health": {"type": "object", "description": "漏斗健康度诊断，含各步骤转化率和健康度评分"},
    "aha_moment_candidates": {"type": "array", "description": "Aha Moment候选列表"},
    "feature_usage": {"type": "array", "description": "功能使用深度分析列表"},
    "behavior_paths": {"type": "object", "description": "行为路径分析，含高频路径、绕路和迷失模式"},
    "anomalies": {"type": "array", "description": "异常事件检测列表"},
    "metadata": {"type": "object", "description": "分析元数据，含时间戳和置信度"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| funnel_health.overall_score | number | 是 | 漏斗整体健康度评分，0-100 |
| funnel_health.steps | array | 是 | 漏斗各步骤数据，每项须含step_name、conversion_rate、drop_off_rate、confidence |
| funnel_health.steps[].is_anomaly | boolean | 是 | 该步骤是否异常 |
| funnel_health.steps[].confidence | number | 是 | 步骤置信度，0-1 |
| funnel_health.trend | string | 是 | 趋势枚举：improving/stable/declining |
| aha_moment_candidates | array | 是 | Aha Moment候选列表，每项须含behavior_pattern、correlation_with_retention、predictive_power、confidence |
| aha_moment_candidates[].correlation_with_retention | number | 是 | 与留存的相关性，<0.3标记"预测力不足" |
| aha_moment_candidates[].predictive_power | number | 是 | 预测力评分，0-1 |
| aha_moment_candidates[].confidence | number | 是 | 候选置信度，0-1 |
| feature_usage | array | 是 | 功能使用列表，每项须含feature_name、adoption_rate、value_score、usage_vs_value_quadrant、confidence |
| feature_usage[].usage_vs_value_quadrant | string | 是 | 象限枚举：high_value_high_use/high_value_low_use/low_value_high_use/low_value_low_use |
| feature_usage[].confidence | number | 是 | 功能置信度，0-1 |
| behavior_paths.top_paths | array | 否 | 高频路径列表 |
| behavior_paths.detour_patterns | array | 否 | 绕路模式列表 |
| behavior_paths.lost_patterns | array | 否 | 迷失模式列表 |
| anomalies | array | 否 | 异常事件列表，每项须含metric、anomaly_type、detected_date、magnitude、possible_causes、confidence |
| anomalies[].anomaly_type | string | 是 | 异常类型枚举：spike/gradual/cyclical |
| anomalies[].confidence | number | 是 | 异常置信度，0-1 |
| metadata.analysis_timestamp | string | 是 | 分析时间戳 |
| metadata.data_quality_flags | string[] | 是 | 数据质量标记 |
| metadata.confidence_overall | number | 是 | 整体置信度，0-1 |

```json
{
  "funnel_health": {
    "overall_score": "number",
    "steps": [
      {
        "step_name": "string",
        "conversion_rate": "number",
        "drop_off_rate": "number",
        "is_anomaly": "boolean",
        "anomaly_description": "string",
        "lost_user_profile": {
          "last_action": "string",
          "avg_time_spent": "number",
          "device_distribution": {}
        },
        "confidence": "number"
      }
    ],
    "trend": "improving|stable|declining"
  },
  "aha_moment_candidates": [
    {
      "behavior_pattern": "string",
      "correlation_with_retention": "number",
      "user_segment": "string",
      "threshold": "string",
      "predictive_power": "number",
      "confidence": "number"
    }
  ],
  "feature_usage": [
    {
      "feature_name": "string",
      "discovery_rate": "number",
      "adoption_rate": "number",
      "depth_distribution": {
        "discover_only": "number",
        "try_once": "number",
        "regular_use": "number",
        "power_use": "number"
      },
      "value_score": "number",
      "usage_vs_value_quadrant": "high_value_high_use|high_value_low_use|low_value_high_use|low_value_low_use",
      "confidence": "number"
    }
  ],
  "behavior_paths": {
    "top_paths": [
      {
        "path": ["string"],
        "user_count": "number",
        "avg_completion_time": "number"
      }
    ],
    "detour_patterns": [
      {
        "description": "string",
        "affected_user_ratio": "number",
        "possible_cause": "string"
      }
    ],
    "lost_patterns": [
      {
        "description": "string",
        "affected_user_ratio": "number",
        "loop_pages": ["string"]
      }
    ]
  },
  "anomalies": [
    {
      "metric": "string",
      "anomaly_type": "spike|gradual|cyclical",
      "detected_date": "string",
      "magnitude": "number",
      "possible_causes": ["string"],
      "impact_scope": "string",
      "confidence": "number"
    }
  ],
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
| 关键指标日级环比变化 > 15% | 触发告警，标记为"需立即关注"，暂停自动流程通知人类 |
| 漏斗健康度评分 < 40 | 标记"漏斗严重不健康"，建议进入深度诊断 |
| Aha Moment候选预测力 < 0.3 | 标记"预测力不足"，不作为Aha Moment推荐 |
| 功能使用率 < 5% 且价值度高 | 标记"发现障碍"，建议进入可用性分析 |
| 数据源缺失关键步骤 | 标记"数据不完整"，漏斗分析降级为"部分分析" |

---

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|-----------|
| 漏斗数据完整性 | 所有步骤有数据 | 缺失步骤标记"数据缺失"，健康度评分标注"不完整" |
| Aha Moment候选有预测力验证 | 与留存的相关性 ≥ 0.3 | 低于0.3的候选标记"预测力不足" |
| 行为路径样本量 | ≥ 1000条路径 | 不足时标记"样本量不足"，结论降级 |
| 异常检测假阳性控制 | 异常事件需有人工可理解的原因假设 | 无原因假设的异常标记"待确认" |
| 所有输出标注置信度 | 100% | 缺失置信度的字段补填默认值0.3并标记 |
| 热力图数据时效性 | 最近30天内 | 超期标记"数据过期" |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 所有数据源均缺失 | 提示用户先提供行为数据，或基于用户提供的事件数据/漏斗数据直接执行分析 | funnel_health、feature_usage等字段为空，置信度降为0 |
| 若用户未提供event_data | 提示用户提供行为事件日志，否则缺乏核心行为数据来源 | aha_moment_candidates和behavior_paths无法生成，功能使用分析缺失 |
| 若用户未提供funnel_data | 提示用户提供漏斗数据，否则无法执行漏斗健康度诊断 | funnel_health字段标注"数据缺失"，整体健康度评分不可用 |
| 若用户未提供heatmap_data | 跳过该输入相关步骤，热力图数据不参与分析 | 行为路径分析缺少热力图维度，页面级洞察缺失 |
| 若用户未提供analysis_config | 跳过该输入相关步骤，使用默认分析配置 | 使用默认配置，异常检测灵敏度和漏斗粒度可能非最优 |

数据获取说明：
- 本Skill需要行为数据（事件日志、漏斗数据、热力图数据），请通过以下方式之一提供：
  1. 直接粘贴事件数据或漏斗步骤数据
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
| user-research-user-modeling | behavior-analysis.json更新完成 | 写入output文件 | 通知行为分群、Aha Moment、功能使用数据已就绪 |
| user-research-report | behavior-analysis.json更新完成 | 写入output文件 | 通知漏斗健康度、行为路径、异常检测数据已就绪 |
