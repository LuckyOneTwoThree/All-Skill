---
name: insight-jtbd
description: 当需要从用户反馈和行为数据中提取功能性、情感性、社会性三层Job时使用。JTBD结构化分析。关键词：JTBD、Jobs-to-be-Done、用户任务、功能诉求、情感诉求、社会诉求。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# JTBD结构化分析

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
| voice-analysis.json | JSON | 是 | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | 用户声音分析数据，含用户原话、情感、频率 |
| behavior-analysis.json | JSON | 是 | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 行为分析数据，含行为模式、流失率、上下文 |

### Input JSON 示例结构

```json
{
  "voice_data": [
    {
      "quote": "太麻烦了，每次都要重复填写",
      "sentiment": "negative",
      "frequency": 12,
      "source": "用户访谈#23"
    }
  ],
  "behavior_data": [
    {
      "action": "放弃填写表单",
      "drop_off_rate": 0.35,
      "context": "注册流程第3步"
    }
  ]
}
```

## 执行步骤

### Step 1: Functional Job 提取

从用户反馈和行为数据中提取功能性任务，识别"我想完成XX"模式。

- 扫描voice-analysis.json中的用户原话，匹配任务意图模式：`"我想..."`、`"能不能..."`、`"需要..."`、`"帮我..."`等
- 从behavior-analysis.json中提取高频行为目标，推断用户试图完成的任务
- 对每个Functional Job标注：
  - **频率**：该任务在数据中出现的次数/占比
  - **情感强度**：1-5分，基于用户表达的情绪强烈程度
- 输出格式：`{ type: "functional", job: "...", frequency: N, sentiment_intensity: 1-5 }`

### Step 2: Emotional Job 推断

从负向反馈中推断情感诉求，识别用户未被满足的情感需求。

- 模式匹配规则：
  - `"太麻烦了"` → 渴望轻松/省力
  - `"不放心"` → 渴望安全感/确定性
  - `"很焦虑"` → 渴望掌控感
  - `"被忽略了"` → 渴望被重视/被关注
  - `"太慢了"` → 渴望效率/即时反馈
  - `"看不懂"` → 渴望清晰/简单
- 从负向反馈（sentiment=negative）中提取情感关键词，映射到情感诉求
- 对每个Emotional Job标注：
  - **推断依据**：引用原始用户反馈
  - **置信度**：0-1.0，基于模式匹配的明确程度
- 输出格式：`{ type: "emotional", job: "...", frequency: N, evidence: "...", confidence: 0-1.0 }`

### Step 3: Social Job 推断

提取涉及他人评价、社会关系、群体归属的表述，推断社会性任务。

- 模式匹配规则：
  - `"同事都在用"` → 社会认同/归属感
  - `"领导要求"` → 合规/服从权威
  - `"别人觉得"` → 社会形象/面子
  - `"行业标配"` → 行业认同/竞争力
  - `"客户投诉"` → 客户满意度/关系维护
- 从用户反馈中提取涉及他人、群体、社会关系的表述
- 对每个Social Job标注：
  - **推断依据**：引用原始用户反馈
  - **置信度**：0-1.0，基于表述的明确程度
- 输出格式：`{ type: "social", job: "...", frequency: N, evidence: "...", confidence: 0-1.0 }`

## 输出

输出文件：`output/pm-discovery/insight-jtbd/jtbd.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["analysis_metadata", "jobs"],
  "properties": {
    "analysis_metadata": {"type": "object", "description": "分析元数据，包含来源文件、条目数和时间戳"},
    "jobs": {"type": "array", "description": "JTBD列表，包含功能性、情感性、社会性三层Job"},
    "needs_human_validation": {"type": "array", "description": "需人工验证的Job列表"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| analysis_metadata | object | 是 | 分析元信息 |
| analysis_metadata.source_files | array | 是 | 数据来源文件列表 |
| analysis_metadata.total_voice_entries | number | 是 | 语音反馈条目数 |
| analysis_metadata.total_behavior_entries | number | 是 | 行为数据条目数 |
| analysis_metadata.analysis_timestamp | string | 是 | 分析时间戳(ISO8601) |
| jobs | array | 是 | 任务列表 |
| jobs[].type | enum(functional,emotional,social) | 是 | 任务类型 |
| jobs[].job | string | 是 | 任务描述 |
| jobs[].frequency | number | 是 | 出现频次 |
| jobs[].evidence | string | 是 | 推断依据 |
| jobs[].confidence | number | 是 | 置信度(0-1.0) |
| jobs[].current_solution | string | 否 | 当前解决方案 |
| jobs[].pain_level | enum(high,medium,low) | 否 | 痛点程度 |
| summary | object | 是 | 分析摘要 |
| summary.total_jobs | number | 是 | 任务总数 |
| summary.by_type | object | 是 | 按类型统计 |

### Output JSON 格式

```json
{
  "analysis_metadata": {
    "source_files": ["voice-analysis.json", "behavior-analysis.json"],
    "total_voice_entries": 0,
    "total_behavior_entries": 0,
    "analysis_timestamp": "ISO8601"
  },
  "jobs": [
    {
      "type": "functional",
      "job": "快速完成表单填写",
      "frequency": 12,
      "current_solution": "手动逐项填写",
      "pain_with_current": "重复劳动，耗时且易出错",
      "confidence": 1.0,
      "evidence": ["用户访谈#23", "行为数据-表单放弃率35%"],
      "sentiment_intensity": 4
    },
    {
      "type": "emotional",
      "job": "获得轻松省力的体验",
      "frequency": 8,
      "current_solution": "无",
      "pain_with_current": "每次操作都感到烦躁",
      "confidence": 0.7,
      "evidence": ["3位用户提到'太麻烦了'"],
      "sentiment_intensity": 3
    },
    {
      "type": "social",
      "job": "获得同事的认可",
      "frequency": 3,
      "current_solution": "使用竞品A",
      "pain_with_current": "觉得自己工具落后于同事",
      "confidence": 0.6,
      "evidence": ["用户访谈#17提到'同事都在用XX'"],
      "sentiment_intensity": 2
    }
  ],
  "needs_human_validation": [
    {
      "job_index": 2,
      "reason": "Social Job置信度<0.7，推断依据仅1条反馈",
      "suggested_action": "补充更多用户访谈验证社会认同需求"
    }
  ]
}
```

## 决策规则

| 规则 | 条件 | 动作 |
|---|---|---|
| Emotional/Social Job低置信度升级 | Emotional或Social Job置信度 < 0.5 | 标记需人类验证，列入needs_human_validation |
| Functional Job缺失 | 未提取到任何Functional Job | 终止分析，返回错误提示补充数据 |
| 数据不足 | voice_data条目 < 5 | 标记分析结果为低可信度，建议补充数据 |

## 质量检查

- [ ] 三层Job（Functional/Emotional/Social）均已提取
- [ ] 每个Job均有数据支撑（evidence字段非空）
- [ ] 每个Job均有置信度标注
- [ ] 低置信度Job已标记需人类验证
- [ ] frequency和sentiment_intensity字段完整

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| voice-analysis.json | 基于用户直接粘贴的反馈文本提取JTBD，标注"缺乏声音数据系统化支撑" |
| behavior-analysis.json | 基于用户反馈文本推断行为意图，标注"缺乏行为数据交叉验证" |
| voice-analysis.json + behavior-analysis.json | 用户提供用户反馈文本 → 直接提取JTBD，整体置信度降低 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述执行轻量版JTBD提取 |

数据获取说明：
- 本Skill需要用户声音分析和行为分析数据，请通过以下方式之一提供：
  1. 直接粘贴用户反馈文本
  2. 上传voice-analysis.json / behavior-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
