---
name: user-research-user-modeling
description: 当需要基于用户声音分析和行为分析结果生成Persona、Empathy Map、Journey Map时使用。用户建模自动生成Pipeline。关键词：用户建模、Persona生成、同理心地图、用户旅程地图、用户画像、典型用户、用户角色、用户长什么样。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我画用户画像"
    - "用户旅程怎么梳理"
    - "用户是什么样的人"
  interaction_mode: "ai_suggest_human_approve"
---

# 用户建模自动生成

## 核心原则

1. **Persona是假设不是事实**——Persona是基于数据的推断模型，需持续验证而非固化，低置信度字段必须标注
2. **声音+行为交叉验证**——用户说的（VOC）和做的（行为）必须交叉印证，矛盾处标记为待验证假设
3. **推断必须标注来源**——每个特征字段标注data_source（voice/behavior/survey/inferred），推断性内容不可伪装为事实
4. **低置信度即待验证假设**——置信度<0.5的字段升级人类验证，不自动进入后续流程

## 交互模式

🤖→👤 **AI建议人类审批** — AI生成模型草案，人类审批确认后方可用于后续流程

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| voice-analysis.json | JSON | 是 | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | 用户声音洞察、痛点、主题、分群 |
| behavior-analysis.json | JSON | 是 | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 行为洞察、漏斗、路径、Aha Moment |
| survey_data | JSON | ○ | 用户提供 | 问卷数据，补充人口统计学信息和态度数据 |
| modeling_config | object | ○ | 用户提供 | 建模配置（最大Persona数、置信度阈值、旅程阶段等） |

### 输入格式

```json
{
  "voice_analysis_path": "output/pm-discovery/user-research-voice-analysis/voice-analysis.json",
  "behavior_analysis_path": "output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json",
  "survey_data": {
    "available": "boolean",
    "location": "string",
    "sample_size": "number"
  },
  "modeling_config": {
    "max_personas": "number",
    "min_confidence_threshold": "number",
    "journey_stages": ["string"],
    "include_emotional_arc": "boolean"
  }
}
```

**输入依赖**：
- `voice-analysis.json`：提供用户声音洞察、痛点、主题、分群
- `behavior-analysis.json`：提供行为洞察、漏斗、路径、Aha Moment
- 问卷数据（可选）：补充人口统计学信息和态度数据

---

## 执行步骤

### Step 1：用户聚类

- 整合voice-analysis的用户分群与behavior-analysis的行为分群
- 使用交叉验证确定最优聚类数（2-6个Persona）
- 聚类维度：行为特征 × 声音特征 × 人口统计（如有）
- 评估每个聚类的内聚度和区分度
- 输出：聚类结果，每个聚类的核心特征描述

### Step 2：特征画像提取

- 对每个聚类提取关键特征：
  - **行为特征**：核心使用场景、使用频率、功能偏好、Aha Moment
  - **声音特征**：主要诉求、核心痛点、情感倾向、代表原声
  - **人口统计**：年龄区间、职业倾向、技术熟练度（如有数据）
  - **Jobs to be Done**：Functional Job / Emotional Job / Social Job
- 标注每个特征的置信度
- 标注数据来源（voice / behavior / survey / 推断）
- 输出：每个聚类的特征画像

### Step 3：Persona文档生成

- 为每个聚类生成Persona文档，包含：
  - **名称**：易记的代称（如"效率先锋""体验探索者"）
  - **核心目标**：该Persona最想达成什么（2-3个）
  - **关键行为**：典型使用行为模式（3-5个）
  - **核心痛点**：最困扰的问题（2-4个，引用voice-analysis数据）
  - **代表性原声**：来自真实用户反馈的引用（3-5条）
  - **规模占比**：该Persona在用户群中的占比
  - **置信度**：整体置信度评分（0-1）
- 标注推断性内容（无直接数据支撑的特征）
- 输出：persona.json

### Step 4：Empathy Map生成

- 为每个Persona生成Empathy Map，包含四个象限：
  - **Says**：用户说了什么（来自voice-analysis的原声）
  - **Thinks**：用户可能在想什么（推断，标注置信度）
  - **Does**：用户做了什么（来自behavior-analysis的行为数据）
  - **Feels**：用户的情绪状态（来自情感分析 + 推断，标注置信度）
- 标注每个象限条目的数据来源和置信度
- 输出：empathy-map.json

### Step 5：Journey Map生成

- 为每个Persona生成Journey Map，包含：
  - **阶段**：认知 → 考虑 → 使用 → 深度使用 → 流失/留存
  - **每个阶段**：
    - 用户行为（来自behavior-analysis）
    - 触点（产品内外）
    - 情绪曲线（高/低点标注）
    - 痛点（来自voice-analysis）
    - 机会点（痛点 × 未满足需求）
- 标注情绪曲线的置信度（行为数据支撑 vs 推断）
- 输出：journey-map.json

### Step 6：置信度评估

- 评估每个Persona的整体置信度
- 评估每个输出字段的置信度
- 识别低置信度字段（< 0.5）并标记需人类验证
- 生成置信度报告：哪些结论有强数据支撑，哪些需要补充验证
- 输出：置信度评估报告

---

## 输出

### persona.json

输出文件：`output/pm-discovery/user-research-user-modeling/persona.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["personas", "metadata"],
  "properties": {
    "personas": {"type": "array", "description": "Persona列表，含目标、行为、痛点和JTBD"},
    "metadata": {"type": "object", "description": "元数据，含时间戳、来源和聚类质量评分"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| personas | array | 是 | Persona列表，不可为空 |
| personas[].id | string | 是 | Persona唯一标识 |
| personas[].name | string | 是 | Persona名称 |
| personas[].core_goals | array | 是 | 核心目标列表，每项须含goal、confidence、data_source |
| personas[].core_goals[].data_source | string | 是 | 数据来源枚举：voice/behavior/survey/inferred |
| personas[].core_goals[].confidence | number | 是 | 目标置信度，0-1 |
| personas[].key_behaviors | array | 是 | 关键行为列表，每项须含behavior、confidence、data_source |
| personas[].key_behaviors[].data_source | string | 是 | 数据来源枚举：voice/behavior/survey/inferred |
| personas[].core_pain_points | array | 是 | 核心痛点列表，每项须含pain_point、severity、confidence、data_source |
| personas[].core_pain_points[].severity | string | 是 | 痛点等级枚举：P0/P1/P2/P3 |
| personas[].core_pain_points[].evidence_ref | string | 是 | 证据引用来源 |
| personas[].representative_quotes | array | 是 | 代表原声列表，每个Persona≥3条 |
| personas[].size_ratio | number | 是 | 规模占比，0-1 |
| personas[].confidence | number | 是 | Persona整体置信度，0-1 |
| personas[].jobs_to_be_done.functional_job | object | 是 | 功能性Job，须含description、confidence |
| personas[].jobs_to_be_done.emotional_job | object | 是 | 情感性Job，须含description、confidence |
| personas[].jobs_to_be_done.social_job | object | 是 | 社会性Job，须含description、confidence |
| personas[].low_confidence_fields | string[] | 是 | 低置信度字段列表 |
| metadata.analysis_timestamp | string | 是 | 分析时间戳 |
| metadata.input_sources | string[] | 是 | 输入来源列表 |
| metadata.clustering_quality_score | number | 是 | 聚类质量评分，0-1 |
| metadata.confidence_overall | number | 是 | 整体置信度，0-1 |

```json
{
  "personas": [
    {
      "id": "string",
      "name": "string",
      "core_goals": [
        {
          "goal": "string",
          "confidence": "number",
          "data_source": "voice|behavior|survey|inferred"
        }
      ],
      "key_behaviors": [
        {
          "behavior": "string",
          "confidence": "number",
          "data_source": "voice|behavior|survey|inferred"
        }
      ],
      "core_pain_points": [
        {
          "pain_point": "string",
          "severity": "P0|P1|P2|P3",
          "confidence": "number",
          "data_source": "voice|behavior|survey|inferred",
          "evidence_ref": "string"
        }
      ],
      "representative_quotes": [
        {
          "quote": "string",
          "source": "string",
          "sentiment": "string"
        }
      ],
      "size_ratio": "number",
      "confidence": "number",
      "jobs_to_be_done": {
        "functional_job": {
          "description": "string",
          "confidence": "number"
        },
        "emotional_job": {
          "description": "string",
          "confidence": "number"
        },
        "social_job": {
          "description": "string",
          "confidence": "number"
        }
      },
      "low_confidence_fields": ["string"]
    }
  ],
  "metadata": {
    "analysis_timestamp": "string",
    "input_sources": ["string"],
    "clustering_quality_score": "number",
    "confidence_overall": "number"
  }
}
```

### empathy-map.json

输出文件：`output/pm-discovery/user-research-user-modeling/empathy-map.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["empathy_maps"],
  "properties": {
    "empathy_maps": {"type": "array", "description": "同理心地图列表，含Says/Thinks/Does/Feels四象限"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| empathy_maps | array | 是 | 同理心地图列表，不可为空 |
| empathy_maps[].persona_id | string | 是 | 关联Persona ID |
| empathy_maps[].persona_name | string | 是 | 关联Persona名称 |
| empathy_maps[].says | array | 是 | Says象限，每项须含content、source、confidence，≥2条 |
| empathy_maps[].thinks | array | 是 | Thinks象限，每项须含content、inference_basis、confidence，≥2条 |
| empathy_maps[].does | array | 是 | Does象限，每项须含content、source、confidence，≥2条 |
| empathy_maps[].feels | array | 是 | Feels象限，每项须含emotion、intensity、inference_basis、confidence，≥2条 |

```json
{
  "empathy_maps": [
    {
      "persona_id": "string",
      "persona_name": "string",
      "says": [
        {
          "content": "string",
          "source": "string",
          "confidence": "number"
        }
      ],
      "thinks": [
        {
          "content": "string",
          "inference_basis": "string",
          "confidence": "number"
        }
      ],
      "does": [
        {
          "content": "string",
          "source": "string",
          "confidence": "number"
        }
      ],
      "feels": [
        {
          "emotion": "string",
          "intensity": "number",
          "inference_basis": "string",
          "confidence": "number"
        }
      ]
    }
  ]
}
```

### journey-map.json

输出文件：`output/pm-discovery/user-research-user-modeling/journey-map.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["journey_maps"],
  "properties": {
    "journey_maps": {"type": "array", "description": "用户旅程地图列表，含阶段、情绪曲线和机会点"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| journey_maps | array | 是 | 旅程地图列表，不可为空 |
| journey_maps[].persona_id | string | 是 | 关联Persona ID |
| journey_maps[].persona_name | string | 是 | 关联Persona名称 |
| journey_maps[].stages | array | 是 | 旅程阶段列表，须覆盖核心阶段 |
| journey_maps[].stages[].stage_name | string | 是 | 阶段名称 |
| journey_maps[].stages[].user_behaviors | string[] | 是 | 用户行为列表 |
| journey_maps[].stages[].touchpoints | string[] | 是 | 触点列表 |
| journey_maps[].stages[].emotion_score | number | 是 | 情绪评分 |
| journey_maps[].stages[].emotion_confidence | number | 是 | 情绪置信度，0-1 |
| journey_maps[].stages[].pain_points | string[] | 是 | 痛点列表 |
| journey_maps[].stages[].opportunities | string[] | 是 | 机会点列表 |
| journey_maps[].emotional_arc | object | 是 | 情绪弧线，须含high_points、low_points、overall_trend |

```json
{
  "journey_maps": [
    {
      "persona_id": "string",
      "persona_name": "string",
      "stages": [
        {
          "stage_name": "string",
          "user_behaviors": ["string"],
          "touchpoints": ["string"],
          "emotion_score": "number",
          "emotion_confidence": "number",
          "pain_points": ["string"],
          "opportunities": ["string"]
        }
      ],
      "emotional_arc": {
        "high_points": ["string"],
        "low_points": ["string"],
        "overall_trend": "string"
      }
    }
  ]
}
```

---

## 决策规则

| 条件 | 动作 |
|------|------|
| Persona整体置信度 < 0.5 | 升级至人类验证，标记"需人工确认"，不自动进入后续流程 |
| Emotional Job推断置信度 < 0.5 | 升级至人类验证，标记"情感需求推断待确认" |
| Social Job推断置信度 < 0.5 | 升级至人类验证，标记"社交需求推断待确认" |
| 两个Persona区分度不足（特征重叠 > 70%） | 合并为1个Persona或标记"需人工判断是否拆分" |
| 聚类质量评分 < 0.4 | 标记"聚类质量不佳"，建议调整聚类参数或补充数据 |

---

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|-----------|
| 至少1个Persona置信度 ≥ 0.7 | 满足 | 无高置信度Persona时标记"建模不充分"，建议补充数据或访谈 |
| 每个Persona有数据支撑 | 每个字段标注数据来源 | 推断性字段占比 > 50%时标记"数据支撑不足" |
| Persona间区分度 | 特征重叠 < 70% | 重叠过高时建议合并或重新聚类 |
| 代表性原声 | 每个Persona ≥ 3条原声 | 不足时标记"原声支撑不足" |
| Empathy Map四象限完整 | 每个象限 ≥ 2条内容 | 缺失象限标记"数据不足" |
| Journey Map阶段完整 | 覆盖核心阶段 | 缺失阶段标记"数据缺失" |
| 所有输出标注置信度 | 100% | 缺失置信度的字段补填默认值0.3并标记 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| voice-analysis.json | 基于用户口头描述的目标用户特征推断Persona，标注"缺乏声音数据支撑" | Persona声音特征和痛点基于推断，representative_quotes缺失，core_pain_points置信度降低 |
| behavior-analysis.json | 基于用户口头描述的用户行为推断Persona，标注"缺乏行为数据支撑" | Persona行为特征和Aha Moment基于推断，key_behaviors置信度降低，Journey Map行为数据缺失 |
| voice-analysis.json + behavior-analysis.json | 用户提供目标用户描述 → 基于描述推断Persona，整体置信度降低 | personas整体confidence降低，data_source多为inferred，low_confidence_fields增多 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述执行轻量版Persona推断 | 输出为纯推断Persona，confidence_overall上限0.3，所有字段标注inferred |
| 若用户未提供survey_data | 跳过该输入相关步骤，Persona中人口统计学信息基于推断，标注"缺乏问卷数据" | 人口统计字段data_source为inferred，置信度降低 |
| 若用户未提供modeling_config | 跳过该输入相关步骤，使用默认建模配置（最大Persona数：4，置信度阈值：0.5） | 使用默认配置，Persona数量和阈值可能非最优 |

## 数据获取说明`n本Skill需要用户声音分析和行为分析数据，请通过以下方式之一提供：
  1. 直接粘贴用户描述文本（目标用户特征、行为模式等）
  2. 上传voice-analysis.json / behavior-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响

| 上游Skill | 变更类型 | 影响范围 | 响应动作 |
|-----------|---------|---------|---------|
| user-research-voice-analysis | voice-analysis.json结构变更 | 用户分群、痛点、主题数据格式变化 | 检查输入字段映射，适配新结构，不兼容时标记"上游数据格式异常" |
| user-research-voice-analysis | voice-analysis.json内容更新 | 痛点等级、情感分布、分群结果变化 | 重新执行聚类和Persona生成，标注"基于更新数据重建" |
| user-research-behavior-analysis | behavior-analysis.json结构变更 | 行为分群、Aha Moment、功能使用数据格式变化 | 检查输入字段映射，适配新结构，不兼容时标记"上游数据格式异常" |
| user-research-behavior-analysis | behavior-analysis.json内容更新 | 漏斗、路径、异常检测结果变化 | 重新执行聚类和Persona生成，标注"基于更新数据重建" |

### 下游通知机制

| 下游Skill | 通知触发条件 | 通知方式 | 通知内容 |
|-----------|------------|---------|---------|
| user-research-interview-assist | persona.json更新完成 | 写入output文件 | 通知Persona数据已就绪，可用于访谈脚本设计 |
| user-research-report | persona.json / empathy-map.json / journey-map.json更新完成 | 写入output文件 | 通知用户建模数据已就绪，可用于报告生成 |
