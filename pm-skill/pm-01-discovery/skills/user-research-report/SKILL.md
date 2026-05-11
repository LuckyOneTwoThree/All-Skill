---
name: user-research-report
description: 当需要产出完整的用户研究报告时使用。用户研究报告自动生成，整合用户声音分析、行为分析、用户建模和访谈数据，补充研究方法论说明和行动建议，输出结构化Markdown报告。关键词：用户研究报告、用户调研报告、用户洞察报告、研究报告、用户分析报告。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 用户研究报告自动生成

## 核心原则

1. **洞察重于数据**——数据是证据，洞察是结论，每条数据必须回答"这对产品意味着什么"
2. **用户声音优先**——直接引用用户原话，比AI总结更有说服力
3. **行动导向**——研究不是目的，驱动产品改进才是目的
4. **方法透明**——研究结论的可信度取决于方法论的透明度

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 用户声音分析 | JSON | ○ | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | 情感分布、主题聚类、痛点提取 |
| 行为分析 | JSON | ○ | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 漏斗健康度、Aha Moment、功能使用深度 |
| 用户建模 | JSON | ○ | output/pm-discovery/user-research-user-modeling/persona.json | Persona、Empathy Map、Journey Map |
| 访谈数据 | JSON | ○ | output/pm-discovery/user-research-interview-assist/interview_script.json | 访谈脚本、访谈记录、洞察提取 |
| 研究目标 | string | 是 | 用户提供 | 本次研究要回答的核心问题 |
| 产品/品类信息 | string | ○ | 用户提供 | 产品名称、品类、目标市场 |

## 执行步骤

### Step 1: 研究背景与目标梳理

基于用户提供的研究目标和产品信息，明确：

- 研究背景：为什么做这次研究
- 核心研究问题：3-5个要回答的关键问题
- 研究范围：目标用户群、产品范围、时间范围
- 研究方法概述：使用了哪些方法（VOC分析/行为分析/访谈/问卷）

### Step 2: 用户画像整合

整合 persona.json 数据，生成可读的用户画像章节：

| 画像要素 | 数据来源 | 报告呈现 |
|----------|---------|---------|
| 基本属性 | persona → demographics | 人口统计学描述 |
| 行为特征 | output/pm-discovery/user-research-behavior-analysis/usage_patterns | 使用习惯描述 |
| 目标与动机 | persona → goals | 引用原话+总结 |
| 痛点与挫折 | output/pm-discovery/user-research-voice-analysis/pain_points | 引用原话+频率标注 |
| 情感地图 | persona → empathy_map | 思维导图描述 |

**画像数量规则**：
- 2-4个核心Persona
- 每个Persona标注代表性用户原话（至少2条）

### Step 3: 用户旅程整合

整合 Journey Map 和行为数据：

**旅程阶段划分**：
```
认知 → 评估 → 首次使用 → 深度使用 → 流失/续费
```

每个阶段包含：

| 维度 | 内容 |
|------|------|
| 用户行为 | 实际做了什么（行为数据支撑） |
| 触点 | 与产品的交互点 |
| 情绪曲线 | 高峰/低谷/关键时刻 |
| 痛点 | 该阶段的核心障碍 |
| 机会 | 可改进的空间 |

**关键指标嵌入**：
- 漏斗转化率（来自 behavior-analysis）
- Aha Moment 触发条件
- 流失预警信号

### Step 4: 洞察提炼

从所有上游数据中提炼核心洞察：

**洞察提取规则**：
- 每条洞察 = 观察 + 证据 + 产品含义
- 证据必须标注来源（VOC/行为/访谈）
- 洞察按影响范围排序：全局性 > 局部性

**洞察分类**：

| 类别 | 说明 | 示例 |
|------|------|------|
| 需求洞察 | 用户真正想要什么 | "用户不是要更快的马，而是要更短的通勤时间" |
| 痛点洞察 | 核心障碍的本质 | "不是功能不够，而是找不到功能" |
| 行为洞察 | 用户实际行为 vs 预期 | "注册后3天内未完成首次操作的用户流失率87%" |
| 机会洞察 | 未被满足的需求空间 | "40%用户在搜索后放弃，存在意图理解的机会" |

### Step 5: 行动建议

基于洞察生成可执行的产品改进建议：

| 建议要素 | 要求 |
|----------|------|
| 建议描述 | 具体到可执行的操作 |
| 对应洞察 | 引用支撑的洞察编号 |
| 预期影响 | 对核心指标的影响评估 |
| 优先级 | P0（必须做）/ P1（应该做）/ P2（可以做） |
| 验证方式 | 如何验证改进效果 |

**优先级推导规则**：
- 影响核心漏斗的痛点 → P0
- 影响留存/活跃的障碍 → P1
- 体验优化类建议 → P2

### Step 6: 报告组装

将所有章节整合为完整的 Markdown 报告：

**报告结构**：

```
# {产品名}用户研究报告

## 执行摘要
- 研究概述（一段话）
- 3条核心发现
- Top1行动建议

## 1. 研究背景与方法
- 研究目标
- 研究问题
- 研究方法与样本
- 数据来源与局限性

## 2. 用户画像
### 2.1 核心用户群A：{名称}
- 基本属性
- 目标与动机
- 核心痛点
- 代表性原话
### 2.2 核心用户群B：{名称}
- ...

## 3. 用户旅程
- 旅程全景图
- 各阶段分析
- 关键时刻（Aha Moment / 流失点）
- 情绪曲线

## 4. 核心洞察
### 4.1 需求洞察
### 4.2 痛点洞察
### 4.3 行为洞察
### 4.4 机会洞察

## 5. 行动建议
| 优先级 | 建议 | 对应洞察 | 预期影响 | 验证方式 |
|--------|------|---------|---------|---------|

## 附录
- 数据来源清单
- 研究方法详细说明
- 样本描述与局限性
```

## 输出

**存储路径**：`output/pm-discovery/user-research-report/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| user-research-report.md | Markdown | 完整用户研究报告 |
| user-research-report.json | JSON | 结构化数据（供下游Skill引用） |

**user-research-report.json 结构**：

**输出Schema**：

```json
{
  "type": "object",
  "required": ["report_metadata", "executive_summary", "personas", "insights", "recommendations"],
  "properties": {
    "report_metadata": {"type": "object", "description": "报告元数据，含产品名、研究目标和置信度"},
    "executive_summary": {"type": "object", "description": "执行摘要，含概述、核心发现和Top建议"},
    "personas": {"type": "array", "description": "用户画像列表"},
    "journey": {"type": "object", "description": "用户旅程，含阶段、情绪曲线和关键时刻"},
    "insights": {"type": "array", "description": "核心洞察列表"},
    "recommendations": {"type": "array", "description": "行动建议列表"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| report_metadata | object | 是 | 报告元数据 |
| report_metadata.product | string | 是 | 产品名称 |
| report_metadata.research_goals | string[] | 是 | 研究目标列表，不可为空 |
| report_metadata.generated_at | string | 是 | 生成时间戳 |
| report_metadata.data_sources | string[] | 是 | 数据来源列表 |
| report_metadata.overall_confidence | number | 是 | 整体置信度，0-1 |
| executive_summary | object | 是 | 执行摘要 |
| executive_summary.overview | string | 是 | 研究概述，一段话 |
| executive_summary.key_findings | string[] | 是 | 核心发现，须≥3条 |
| executive_summary.top_recommendation | string | 是 | Top1行动建议 |
| personas | array | 是 | 用户画像列表，2-4个 |
| personas[].name | string | 是 | 用户群名称 |
| personas[].quotes | string[] | 是 | 代表性原话，每个Persona≥2条 |
| journey | object | 否 | 用户旅程 |
| journey.stages | array | 否 | 旅程阶段列表 |
| journey.stages[].name | string | 是 | 阶段名称 |
| journey.stages[].behaviors | string[] | 是 | 用户行为 |
| journey.stages[].pain_points | string[] | 是 | 痛点 |
| journey.stages[].opportunities | string[] | 是 | 机会点 |
| journey.aha_moment | string | 否 | Aha Moment描述 |
| journey.churn_signals | string[] | 否 | 流失信号列表 |
| insights | array | 是 | 核心洞察列表，≤15条 |
| insights[].id | string | 是 | 洞察编号，格式INS-XXX |
| insights[].category | string | 是 | 洞察类别枚举：需求/痛点/行为/机会 |
| insights[].observation | string | 是 | 观察描述 |
| insights[].evidence | string | 是 | 证据及来源 |
| insights[].implication | string | 是 | 产品含义 |
| insights[].scope | string | 是 | 影响范围枚举：全局/局部 |
| recommendations | array | 是 | 行动建议列表，≥3条 |
| recommendations[].id | string | 是 | 建议编号，格式REC-XXX |
| recommendations[].description | string | 是 | 建议描述 |
| recommendations[].linked_insights | string[] | 是 | 关联洞察编号列表 |
| recommendations[].expected_impact | string | 是 | 预期影响 |
| recommendations[].priority | string | 是 | 优先级枚举：P0/P1/P2 |
| recommendations[].validation_method | string | 是 | 验证方式 |

```json
{
  "report_metadata": {
    "product": "产品名",
    "research_goals": [],
    "generated_at": "时间戳",
    "data_sources": [],
    "overall_confidence": 0.0
  },
  "executive_summary": {
    "overview": "一段话",
    "key_findings": [],
    "top_recommendation": ""
  },
  "personas": [
    {
      "name": "用户群名称",
      "demographics": {},
      "goals": [],
      "pain_points": [],
      "quotes": []
    }
  ],
  "journey": {
    "stages": [
      {
        "name": "阶段名",
        "behaviors": [],
        "touchpoints": [],
        "emotion_peak": "",
        "emotion_valley": "",
        "pain_points": [],
        "opportunities": [],
        "metrics": {}
      }
    ],
    "aha_moment": "",
    "churn_signals": []
  },
  "insights": [
    {
      "id": "INS-001",
      "category": "需求/痛点/行为/机会",
      "observation": "观察描述",
      "evidence": "证据及来源",
      "implication": "产品含义",
      "scope": "全局/局部"
    }
  ],
  "recommendations": [
    {
      "id": "REC-001",
      "description": "建议描述",
      "linked_insights": ["INS-001"],
      "expected_impact": "预期影响",
      "priority": "P0/P1/P2",
      "validation_method": "验证方式"
    }
  ]
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 上游数据全部缺失 | 基于研究目标和AI知识库生成报告，标注"缺乏实证数据，建议补充研究" |
| 仅有VOC数据 | 聚焦情感和痛点洞察，行为洞察标注"缺乏行为数据" |
| 仅有行为数据 | 聚焦漏斗和使用深度，需求洞察标注"缺乏用户声音数据" |
| Persona数量>6 | 按用户量排序取Top4 |
| 洞察数量>15 | 按影响范围和优先级排序取Top10 |

## 质量检查

- [ ] 执行摘要包含3条核心发现+Top1建议
- [ ] 每个Persona有代表性用户原话
- [ ] 用户旅程包含情绪曲线和关键时刻
- [ ] 每条洞察有观察+证据+含义三要素
- [ ] 行动建议至少3条，每条有优先级和验证方式
- [ ] 数据来源和局限性已说明

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| voice-analysis缺失 | 用户画像和痛点基于行为数据和AI推断 | 痛点洞察缺乏用户原话支撑 |
| behavior-analysis缺失 | 旅程和行为洞察基于VOC和访谈数据 | 行为洞察缺乏量化数据 |
| persona缺失 | 基于VOC和行为数据推导用户画像 | 画像可能不够精细 |
| interview数据缺失 | 洞察基于VOC和行为数据 | 缺乏深度定性洞察 |
| 所有上游数据均缺失 | 基于研究目标和AI知识库生成，整体置信度降低 | 报告需人类大量补充验证 |
| 若用户未提供研究目标 | 提示用户提供研究目标，否则无法确定报告聚焦方向 | 无法生成定向报告 |
| 若用户未提供产品/品类信息 | 跳过该输入相关步骤，报告中产品相关描述基于推断 | 产品背景描述可能不够准确 |

---

## 上游变更响应

### 上游变更影响

| 上游Skill | 变更类型 | 影响范围 | 响应动作 |
|-----------|---------|---------|---------|
| user-research-voice-analysis | voice-analysis.json结构变更 | 情感分布、痛点、主题数据格式变化 | 检查输入字段映射，适配新结构，不兼容时标记"上游数据格式异常" |
| user-research-voice-analysis | voice-analysis.json内容更新 | 痛点等级、情感分布、分群结果变化 | 重新整合用户画像和痛点洞察，标注"基于更新数据重建" |
| user-research-behavior-analysis | behavior-analysis.json结构变更 | 漏斗、Aha Moment、功能使用数据格式变化 | 检查输入字段映射，适配新结构，不兼容时标记"上游数据格式异常" |
| user-research-behavior-analysis | behavior-analysis.json内容更新 | 漏斗健康度、行为路径、异常检测结果变化 | 重新整合用户旅程和行为洞察，标注"基于更新数据重建" |
| user-research-user-modeling | persona.json结构变更 | Persona字段映射变化 | 检查输入字段映射，适配新结构，不兼容时标记"上游数据格式异常" |
| user-research-user-modeling | persona.json内容更新 | Persona特征、痛点、JTBD变化 | 重新整合用户画像章节，标注"基于更新Persona重建" |
| user-research-interview-assist | interview-insights.json结构变更 | 访谈洞察、跨访谈模式数据格式变化 | 检查输入字段映射，适配新结构，不兼容时标记"上游数据格式异常" |
| user-research-interview-assist | interview-insights.json内容更新 | 验证/推翻假设、新发现、Persona更新变化 | 重新整合洞察和行动建议，标注"基于更新访谈数据重建" |

### 下游通知机制

本Skill为终端Skill，无下游依赖，不涉及下游通知。
