---
name: insight-kano
description: 当需要对功能需求进行KANO模型分类（必备型/期望型/兴奋型/无差异型）时使用。KANO自动分类，支持行业阈值适配。关键词：KANO模型、需求分类、必备型、期望型、兴奋型、无差异型、功能优先级、行业适配。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# KANO自动分类

## 核心原则

1. **分类基于用户反应而非产品属性**——KANO分类的依据是"用户对功能有无的反应"，而非"功能本身的技术复杂度"，必须从用户反馈数据中提取反应模式
2. **阈值可适配**——默认分类阈值（负向提及率60%、提及频率5%等）基于通用经验，不同行业和产品阶段需适配，提供行业适配规则
3. **边界即决策点**——分类置信度<0.7的边界情况不是"错误"，而是需要人类判定的决策点，必须明确标注并升级
4. **分类随时间演化**——今天的兴奋型可能变成明天的必备型，KANO分类不是一次性结论，需标注分类时效性和建议复评周期

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

### 行业阈值适配规则

不同行业和产品阶段需对默认阈值进行适配：

| 行业/阶段 | 适配规则 | 调整说明 |
|---|---|---|
| B端SaaS | 必备型阈值下调：负向提及率 > 50% 即为必备型 | B端用户对基础功能缺失容忍度更低，阈值需下调 |
| C端消费 | 兴奋型阈值上调：正向提及率 > 70% 才为兴奋型 | C端用户更容易给出正向反馈，需提高兴奋型判定门槛 |
| 早期产品 | 整体阈值放宽：数据量不足时降低判定门槛（置信度0.5即可分类） | 早期数据有限，过严阈值导致大量"数据不足"，放宽以获得初步分类 |
| 成熟产品 | 严格阈值：数据充足时使用标准阈值，置信度<0.7必须升级 | 成熟产品数据充分，应严格按标准阈值分类，减少模糊判定 |

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

### 输出校验规则

| 校验项 | 校验规则 | 失败处理 |
|---|---|---|
| 分类完整性 | 所有输入功能需求均已出现在kano_classification中 | 补充缺失功能的分类结果，标记为"数据不足" |
| 证据完整性 | 每个分类结果的evidence字段包含全部5项指标 | 补充缺失指标，无法计算的字段填null并标注 |
| 置信度范围 | 所有confidence值在[0, 1]区间内 | 修正越界值，记录异常日志 |
| 边界标记一致性 | confidence < 0.7的功能同时在boundary_cases中出现 | 补充boundary_cases条目，确保一一对应 |
| 分类值合法性 | category字段仅包含must-be/one-dimensional/attractive/indifferent/reverse/insufficient_data | 修正非法值，标记为insufficient_data并升级人类判定 |
| 统计一致性 | summary中各类型数量之和等于kano_classification数组长度 | 重新计算summary统计值 |
| 时效性标注 | 每个分类结果包含review_period字段 | 缺失时填充默认值"6个月"并标注"未指定复评周期" |

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
      "review_period": "6个月",
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
      "review_period": "3个月",
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
      "review_period": "12个月",
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
- [ ] 行业阈值适配规则已应用
- [ ] 每个分类结果包含review_period时效性标注

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---|---|---|
| 用户反馈数据 | 用户提供功能需求列表 → 基于行业经验推断KANO分类，标注"缺乏用户反馈数据，分类置信度较低" | 所有分类置信度≤0.5，evidence字段为推断值而非实测值，boundary_cases包含全部功能 |
| requirement-layers.json | 用户提供功能需求列表 → 直接进行KANO分类，标注"缺乏需求拆解数据" | 缺少需求三层模型关联，note字段标注"未关联需求拆解"，分类仅基于反馈数据 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的功能需求列表和行业经验推断分类 | 全部分类为推断结果，置信度≤0.3，summary中needs_judgment等于功能总数 |

数据获取说明：
- 本Skill需要用户反馈数据和功能需求列表，请通过以下方式之一提供：
  1. 直接粘贴功能需求列表
  2. 上传用户反馈数据/requirement-layers.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

当上游输入的Schema或数据结构发生变更时，按以下规则响应：

| 变更类型 | 响应策略 | 示例 |
|---|---|---|
| 字段新增 | 忽略新增字段，不影响现有分类逻辑；评估新增字段是否可提升分类精度，若可提升则纳入下一版本规则 | 上游反馈数据新增"emotion_category"字段 → 当前版本忽略，评估后决定是否纳入 |
| 字段删除 | 检查删除字段是否为分类必要输入；若是必要字段则触发降级策略，若非必要则标注"数据缺失"继续执行 | "usage_depth_correlation"字段被删除 → 期望型分类条件缺失，该条件降级为参考指标 |
| 字段重命名 | 建立字段映射表，将新字段名映射到本Skill使用的字段名，标注"字段映射：新名→旧名" | "positive_mentions"改名为"positive_count" → 自动映射，输出中标注映射关系 |
| 数据格式变更 | 尝试自动转换格式；转换失败则触发降级策略，标注"数据格式不兼容" | 日期格式从"YYYY-MM-DD"变为时间戳 → 自动转换；数值从整数变字符串 → 尝试解析，失败则降级 |
| Schema版本升级 | 对比版本差异，按上述规则逐字段处理；输出中标注上游版本号和适配状态 | voice-analysis从v1.0升级到v1.1 → 逐字段对比，标注适配结果 |
