---
name: insight-priority-scoring
description: 当需要对需求列表进行加权优先级评分排序时使用。需求优先级自动评分，基于痛点强度、频率、可解决性和KANO系数计算综合分数，采用加权求和避免极端值。关键词：优先级评分、需求排序、KANO系数、痛点强度、可解决性、加权评分。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 需求优先级自动评分

## 核心原则

1. **多维度独立贡献**——痛点强度、频率、可解决性各自独立贡献分数，任一维度低分不会导致总分归零，采用加权求和而非乘法避免极端值
2. **KANO是加成而非乘数**——KANO分类作为加成系数调整基础分，必备型加成50%，反向型建议不实施，但不会让其他维度的贡献完全消失
3. **未确认维度显式标注**——可解决性默认值3（中等），未获技术确认的需求整体评分置信度强制为low，不隐藏不确定性
4. **排序是建议不是决策**——评分排序是AI基于数据的建议，最终优先级由人类确认，权重可由人类调整覆盖

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 需求列表 | JSON | 是 | output/pm-discovery/insight-requirement-layers/requirement-layers.json | 需求三层模型拆解结果 |
| KANO分类结果 | JSON | 是 | output/pm-discovery/insight-kano/kano.json | KANO模型分类结果 |
| 痛点数据 | JSON | 是 | output/pm-discovery/insight-jtbd/jtbd.json / output/pm-discovery/insight-5whys/5whys.json | 痛点强度与频率数据 |

### Input JSON 示例结构

```json
{
  "requirements": [
    {
      "id": "REQ-001",
      "name": "批量导出功能",
      "surface": "希望增加批量导出功能",
      "feature_id": "FEAT-001"
    }
  ],
  "kano_data": [
    {
      "feature_id": "FEAT-001",
      "category": "must-be",
      "confidence": 0.85
    }
  ],
  "pain_data": [
    {
      "job": "快速完成表单填写",
      "pain_with_current": "重复劳动，耗时且易出错",
      "frequency": 12,
      "sentiment_intensity": 4
    }
  ]
}
```

## 评分函数

**基础分 = 0.35 × 痛点强度(1-5) + 0.30 × 频率权重(1-5) + 0.35 × 可解决性(1-5)**

**KANO加成 = 基础分 × (KANO系数 - 1)**

**优先级分数 = 基础分 + KANO加成**

### KANO系数映射

| KANO分类 | 系数 | 加成效果 | 说明 |
|---|---|---|---|
| 必备型（Must-be） | 1.5 | 基础分+50% | 缺失严重影响满意度，优先级最高 |
| 期望型（One-dimensional） | 1.0 | 无加成 | 线性影响满意度，正常优先级 |
| 兴奋型（Attractive） | 0.8 | 基础分-20% | 锦上添花，优先级略低 |
| 无差异型（Indifferent） | 0.2 | 基础分-80% | 用户不在乎，优先级最低 |
| 反向型（Reverse） | 0.0 | 基础分归零 | 有害功能，不建议实施 |

### 各维度评分规则

#### 痛点强度（1-5分）

| 分数 | 条件 | 说明 |
|---|---|---|
| 5 | 情感强度≥4 且 5Whys根因已确认 | 极强痛点，用户情绪激烈且根因明确 |
| 4 | 情感强度≥3 或 5Whys根因已确认 | 强痛点，用户有明显不满 |
| 3 | 情感强度=2-3 且有负向反馈 | 中等痛点，用户有不满但不强烈 |
| 2 | 情感强度=1-2 且反馈较少 | 弱痛点，用户略有不便 |
| 1 | 无负向反馈或情感强度<1 | 非痛点，用户未表达不满 |

#### 频率权重（1-5分）

| 分数 | 条件 | 说明 |
|---|---|---|
| 5 | 影响用户占比 > 30% 或 提及频率 > 10% | 高频痛点，影响大量用户 |
| 4 | 影响用户占比 20-30% 或 提及频率 5-10% | 中高频痛点 |
| 3 | 影响用户占比 10-20% 或 提及频率 2-5% | 中频痛点 |
| 2 | 影响用户占比 5-10% 或 提及频率 1-2% | 低频痛点 |
| 1 | 影响用户占比 < 5% 或 提及频率 < 1% | 极低频痛点 |

#### 可解决性（1-5分）

| 分数 | 条件 | 说明 |
|---|---|---|
| 5 | 技术方案成熟，1个迭代可交付 | 高可解决性，快速见效 |
| 4 | 技术方案可行，2-3个迭代可交付 | 较高可解决性 |
| 3 | 技术方案需调研，3-5个迭代 | 中等可解决性 |
| 2 | 技术方案有挑战，需跨团队协作 | 较低可解决性 |
| 1 | 技术方案不确定或依赖外部条件 | 低可解决性 |

### 评分示例

| 需求 | 痛点强度 | 频率权重 | 可解决性 | KANO | 基础分 | KANO加成 | 总分 |
|------|---------|---------|---------|------|--------|---------|------|
| 批量导出 | 4 | 4 | 3 | must-be(1.5) | 3.65 | +1.825 | 5.475 |
| AI推荐 | 2 | 2 | 2 | attractive(0.8) | 2.00 | -0.400 | 1.600 |

## 执行步骤

### Step 1: 数据关联

将需求列表、KANO分类结果、痛点数据进行关联匹配。

- 通过feature_id关联需求与KANO分类
- 通过需求内容匹配痛点数据
- 无法关联的需求标记为"数据不完整"，相关维度使用默认值

### Step 2: 维度评分

对每个需求按评分规则进行四维度评分。

- 痛点强度：基于jtbd.json的sentiment_intensity和5whys.json的根因确认情况
- 频率权重：基于反馈频率和影响用户占比
- 可解决性：需技术团队输入，默认值为3（中等），标记为"待技术确认"，该需求整体评分置信度降级为low
- KANO系数：基于kano.json的分类结果

### Step 3: 加权计算

按评分函数计算每个需求的综合优先级分数。

- 基础分 = 0.35 × 痛点强度 + 0.30 × 频率权重 + 0.35 × 可解决性
- KANO加成 = 基础分 × (KANO系数 - 1)
- 优先级分数 = 基础分 + KANO加成
- 分数范围：0.2（1×0.35+1×0.30+1×0.35=1.0，Indifferent×0.2=0.2）至 7.5（5×0.35+5×0.30+5×0.35=5.0，Must-be×1.5=7.5）
- 按分数降序排列

### Step 4: 结果标注

对评分结果进行标注和分类。

- 标记可解决性维度是否已获技术团队确认（未确认的需求整体评分置信度降级为low）
- 标记KANO分类置信度是否足够
- 标记整体评分的可信度等级

## 输出

输出文件：`output/pm-discovery/insight-priority-scoring/priority-scoring.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["analysis_metadata", "priority_list", "scoring_summary"],
  "properties": {
    "analysis_metadata": {"type": "object", "description": "分析元数据，包含来源文件、评分公式和确认状态"},
    "priority_list": {"type": "array", "description": "需求优先级评分排序列表"},
    "scoring_summary": {"type": "object", "description": "评分统计摘要"},
    "priority_thresholds": {"type": "object", "description": "优先级分级阈值定义"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| analysis_metadata | object | 是 | 分析元信息 |
| analysis_metadata.source_files | array | 是 | 数据来源文件列表 |
| analysis_metadata.scoring_formula | string | 是 | 评分公式描述 |
| analysis_metadata.weights_confirmed_by_human | boolean | 是 | 权重是否已获人类确认 |
| analysis_metadata.analysis_timestamp | string | 是 | 分析时间戳(ISO8601) |
| priority_list | array | 是 | 需求优先级列表 |
| priority_list[].rank | number | 是 | 排名 |
| priority_list[].requirement_id | string | 是 | 需求标识 |
| priority_list[].requirement_name | string | 是 | 需求名称 |
| priority_list[].scores | object | 是 | 各维度评分详情 |
| priority_list[].scores.pain_intensity.score | number | 是 | 痛点强度(1-5) |
| priority_list[].scores.pain_intensity.basis | string | 是 | 评分依据 |
| priority_list[].scores.frequency_weight.score | number | 是 | 频率权重(1-5) |
| priority_list[].scores.frequency_weight.basis | string | 是 | 评分依据 |
| priority_list[].scores.solvability.score | number | 是 | 可解决性(1-5) |
| priority_list[].scores.solvability.confirmed | boolean | 是 | 是否已获技术确认 |
| priority_list[].scores.kano_coefficient.coefficient | number | 是 | KANO系数 |
| priority_list[].scores.kano_coefficient.category | string | 是 | KANO分类 |
| priority_list[].scores.kano_coefficient.confidence | number | 是 | KANO分类置信度 |
| priority_list[].base_score | number | 是 | 基础分 |
| priority_list[].kano_bonus | number | 是 | KANO加成 |
| priority_list[].total_score | number | 是 | 总分 |
| priority_list[].score_confidence | enum(high,medium,low) | 是 | 评分可信度 |
| scoring_summary | object | 是 | 评分统计摘要 |
| scoring_summary.total_requirements | number | 是 | 需求总数 |
| scoring_summary.high_priority | number | 是 | 高优先级数量 |
| scoring_summary.medium_priority | number | 是 | 中优先级数量 |
| scoring_summary.low_priority | number | 是 | 低优先级数量 |
| priority_thresholds | object | 是 | 优先级分级阈值 |

### Output JSON 格式

```json
{
  "analysis_metadata": {
    "source_files": ["requirement-layers.json", "kano.json", "jtbd.json", "5whys.json"],
    "scoring_formula": "基础分(0.35×痛点+0.30×频率+0.35×可解决性) + KANO加成(基础分×(系数-1))",
    "weights_confirmed_by_human": false,
    "analysis_timestamp": "ISO8601"
  },
  "priority_list": [
    {
      "rank": 1,
      "requirement_id": "REQ-001",
      "requirement_name": "批量导出功能",
      "scores": {
        "pain_intensity": {
          "score": 4,
          "basis": "情感强度4+5Whys根因已确认"
        },
        "frequency_weight": {
          "score": 4,
          "basis": "提及频率8%，影响用户占比约25%"
        },
        "solvability": {
          "score": 3,
          "basis": "默认值，待技术团队确认",
          "confirmed": false
        },
        "kano_coefficient": {
          "coefficient": 1.5,
          "category": "must-be",
          "confidence": 0.85
        }
      },
      "base_score": 3.65,
      "kano_bonus": 1.825,
      "total_score": 5.475,
      "score_confidence": "medium",
      "notes": "可解决性维度待技术确认，确认后分数可能调整"
    },
    {
      "rank": 2,
      "requirement_id": "REQ-002",
      "requirement_name": "AI智能推荐",
      "scores": {
        "pain_intensity": {
          "score": 2,
          "basis": "情感强度2，无强烈痛点表达"
        },
        "frequency_weight": {
          "score": 2,
          "basis": "提及频率1.5%"
        },
        "solvability": {
          "score": 2,
          "basis": "技术方案有挑战，需跨团队协作",
          "confirmed": true
        },
        "kano_coefficient": {
          "coefficient": 0.8,
          "category": "attractive",
          "confidence": 0.65
        }
      },
      "base_score": 2.00,
      "kano_bonus": -0.400,
      "total_score": 1.600,
      "score_confidence": "low",
      "notes": "KANO分类置信度<0.7，建议人工确认分类后再评分"
    }
  ],
  "scoring_summary": {
    "total_requirements": 2,
    "high_priority": 0,
    "medium_priority": 1,
    "low_priority": 1,
    "needs_tech_confirmation": 1,
    "needs_human_confirmation": 1
  },
  "priority_thresholds": {
    "high": "总分 >= 4.5",
    "medium": "总分 2.0-4.4",
    "low": "总分 < 2.0"
  }
}
```

## 决策规则

| 规则 | 条件 | 动作 |
|---|---|---|
| 权重需人类确认 | 首次执行或权重调整后 | 暂停评分输出，等待人类确认评分维度和权重 |
| 可解决性需技术输入 | 可解决性维度未获技术团队确认 | 使用默认值3，标记confirmed=false，该需求score_confidence强制为low，提示需技术确认 |
| KANO分类不确定 | KANO分类置信度 < 0.7 | 标记score_confidence=low，建议确认分类后重新评分 |
| 数据不完整 | 需求无法关联痛点或KANO数据 | 相关维度使用默认值，标记数据不完整 |
| 反向型功能 | KANO分类为Reverse | 总分归零，标注"不建议实施"，由人类最终决策 |

## 质量检查

- [ ] 所有需求已评分
- [ ] 评分维度权重已获人类确认（weights_confirmed_by_human=true）
- [ ] 可解决性维度已标注确认状态
- [ ] KANO分类置信度低的已标记
- [ ] 评分结果按优先级降序排列
- [ ] 评分可信度等级已标注
- [ ] 数据不完整的需求已标记
- [ ] base_score和kano_bonus分别计算（可审计）

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| kano.json | 用户提供需求列表 → 基于用户描述评分，KANO系数使用默认值1.0 | KANO加成为0，仅依赖基础分排序，必备型需求可能被低估 |
| 痛点数据（jtbd.json / 5whys.json） | 用户提供需求列表 → 基于用户描述评分，痛点强度使用用户主观评估 | 痛点强度维度为主观评估，score_confidence降级 |
| kano.json + 痛点数据 | 用户提供需求列表 → 基于用户描述评分 | 整体评分基于用户主观描述，score_confidence强制为low |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的需求列表直接评分 | 输出为轻量版评分，多个维度使用默认值 |

数据获取说明：
- 本Skill需要需求列表、KANO分类和痛点数据，请通过以下方式之一提供：
  1. 直接粘贴需求列表和优先级描述
  2. 上传kano.json / jtbd.json / 5whys.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| requirement-layers.json需求增删 | priority_list条目增删 | 标注新增/删除的需求，重新计算排名 |
| kano.json分类变更 | KANO系数和加成变化 | 标注受影响的需求，重新计算kano_bonus和total_score |
| jtbd.json情感强度更新 | 痛点强度维度变化 | 标注受影响的需求，重新评估pain_intensity评分 |
| 5whys.json根因确认/推翻 | 痛点强度维度变化 | 标注受影响的需求，根因确认则痛点强度可能提升，根因推翻则可能降低 |

当本Skill自身变更时，对下游的通知机制：

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 优先级排序变更 | design-orchestrator / development-task-breakdown | 标注排名变化的需求，建议重新评估开发排期 |
| 评分公式调整 | 所有消费priority-scoring的下游Skill | 标注公式变更内容，建议下游重新评估基于评分的决策 |
| 优先级阈值调整 | design-orchestrator | 标注阈值变化，可能影响需求的优先级分级 |
