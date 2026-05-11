---
name: insight-jtbd
description: 当需要从用户反馈和行为数据中提取功能性、情感性、社会性三层Job时使用。JTBD结构化分析，通过模式匹配与语义推断识别用户真正想完成的任务。关键词：JTBD、Jobs-to-be-Done、用户任务、功能诉求、情感诉求、社会诉求。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# JTBD结构化分析

## 核心原则

1. **任务而非方案**——用户表达的"想要XX功能"是方案而非任务，JTBD要挖掘的是"用户用这个功能想完成什么"，而非停留在表面需求
2. **三层递进推断**——Functional Job有数据直接支撑，Emotional Job需从负向反馈推断，Social Job需从社会关系表述推断，推断深度逐层递进，置信度逐层递减
3. **痛点即未满足的Job**——每个痛点背后都存在一个未被满足的Job，pain_with_current字段必须明确描述当前方案的不足
4. **交叉验证降低误判**——Emotional/Social Job必须有多条独立证据交叉验证，单一来源的推断置信度上限为0.5

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

- 扫描voice-analysis.json中的用户原话，匹配任务意图模式
- 从behavior-analysis.json中提取高频行为目标，推断用户试图完成的任务
- **意图模式库**：

| 模式类别 | 匹配模式 | 推断方向 |
|----------|----------|----------|
| 直接表达 | "我想..."、"能不能..."、"需要..."、"帮我..."、"希望..." | 直接提取为Functional Job |
| 痛点反推 | "太慢了"、"太麻烦了"、"不方便"、"不好用" | 反推用户想高效/便捷地完成某事 |
| 行为目标 | 高频操作路径、重复行为模式 | 推断用户试图达成的行为目标 |
| 竞品对比 | "XX产品可以..."、"为什么你们不能..." | 提取用户期望的功能能力 |
| 场景描述 | "每次做XX的时候..."、"在XX场景下..." | 提取场景化的功能需求 |

- 对每个Functional Job标注：
  - **频率**：该任务在数据中出现的次数/占比
  - **情感强度**：1-5分，基于用户表达的情绪强烈程度
- 输出格式：`{ type: "functional", job: "...", frequency: N, sentiment_intensity: 1-5 }`

### Step 2: Emotional Job 推断

从负向反馈中推断情感诉求，识别用户未被满足的情感需求。

- **情感映射规则库**：

| 负向表达模式 | 情感诉求方向 | 置信度基准 |
|-------------|-------------|-----------|
| "太麻烦了"/"太复杂了"/"操作太多" | 渴望轻松/省力 | 0.8 |
| "不放心"/"担心"/"怕出错" | 渴望安全感/确定性 | 0.75 |
| "很焦虑"/"着急"/"来不及" | 渴望掌控感/效率 | 0.75 |
| "被忽略了"/"没人理我"/"反馈没回应" | 渴望被重视/被关注 | 0.7 |
| "太慢了"/"等太久"/"响应慢" | 渴望即时反馈/流畅感 | 0.8 |
| "看不懂"/"不知道怎么用"/"太专业了" | 渴望清晰/简单/易懂 | 0.75 |
| "很失望"/"不如预期"/"被骗了" | 渴望信任/透明度 | 0.7 |
| "很尴尬"/"丢面子"/"不好意思" | 渴望自信/尊严 | 0.65 |
| "很无聊"/"没意思"/"千篇一律" | 渴望新鲜感/趣味性 | 0.6 |
| "很沮丧"/"放弃了"/"不想用了" | 渴望成就感/正向激励 | 0.7 |
| "太贵了"/"不值"/"性价比低" | 渴望公平感/价值感 | 0.7 |
| "被限制"/"不能自定义"/"太死板" | 渴望自主性/灵活性 | 0.65 |
| "很困惑"/"不知道发生了什么" | 渴望清晰度/可理解性 | 0.7 |
| "很无助"/"不知道找谁" | 渴望支持/引导 | 0.65 |
| "很烦"/"被打扰"/"太多通知" | 渴望宁静/专注 | 0.7 |

- 从负向反馈（sentiment=negative）中提取情感关键词，映射到情感诉求
- 对每个Emotional Job标注：
  - **推断依据**：引用原始用户反馈
  - **置信度**：0-1.0，基于模式匹配的明确程度和证据条数
- 置信度调整规则：
  - 单条证据：置信度 = 基准值 × 0.7
  - 2-3条证据：置信度 = 基准值 × 0.85
  - 4条以上证据：置信度 = 基准值 × 1.0（不超过1.0）
- 输出格式：`{ type: "emotional", job: "...", frequency: N, evidence: "...", confidence: 0-1.0 }`

### Step 3: Social Job 推断

提取涉及他人评价、社会关系、群体归属的表述，推断社会性任务。

- **社会映射规则库**：

| 社会表达模式 | 社会诉求方向 | 置信度基准 |
|-------------|-------------|-----------|
| "同事都在用"/"别人也在用" | 社会认同/归属感 | 0.7 |
| "领导要求"/"公司规定"/"合规要求" | 合规/服从权威 | 0.8 |
| "别人觉得"/"怕别人笑话"/"面子" | 社会形象/面子 | 0.65 |
| "行业标配"/"竞品都有" | 行业认同/竞争力 | 0.7 |
| "客户投诉"/"用户反馈" | 客户满意度/关系维护 | 0.75 |
| "推荐给朋友"/"分享给同事" | 社交货币/分享欲 | 0.7 |
| "团队协作"/"一起用"/"共享" | 协作效率/团队归属 | 0.7 |
| "显得专业"/"给客户看" | 专业形象/权威感 | 0.65 |
| "家人也在用"/"给孩子用" | 家庭关怀/责任感 | 0.65 |
| "大家都在讨论"/"热门话题" | 从众/潮流跟随 | 0.6 |
| "老板会看"/"向上汇报" | 向上管理/表现欲 | 0.65 |
| "朋友圈看到"/"小红书推荐" | 社交影响/口碑传播 | 0.6 |
| "合作伙伴要求"/"供应商需要" | 商业关系维护 | 0.7 |
| "学生都在问"/"学员期待" | 教育责任/使命感 | 0.65 |
| "行业趋势"/"数字化转型" | 行业转型/战略跟随 | 0.6 |

- 从用户反馈中提取涉及他人、群体、社会关系的表述
- 对每个Social Job标注：
  - **推断依据**：引用原始用户反馈
  - **置信度**：0-1.0，基于表述的明确程度
- 置信度调整规则同Emotional Job
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
| jobs[].pain_with_current | string | 否 | 当前方案的痛点 |
| jobs[].pain_level | enum(high,medium,low) | 否 | 痛点程度 |
| jobs[].sentiment_intensity | number | 否 | 情感强度(1-5) |
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
| 单一证据推断 | Emotional/Social Job仅1条证据 | 置信度上限设为0.5，标注"单一来源推断" |
| 多证据交叉验证 | 同一Job有3条以上独立证据 | 置信度可提升至0.8+ |

## 质量检查

- [ ] 三层Job（Functional/Emotional/Social）均已提取
- [ ] 每个Job均有数据支撑（evidence字段非空）
- [ ] 每个Job均有置信度标注
- [ ] 低置信度Job已标记需人类验证
- [ ] frequency和sentiment_intensity字段完整
- [ ] pain_with_current字段非空（描述当前方案痛点）

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| voice-analysis.json | 基于用户直接粘贴的反馈文本提取JTBD，标注"缺乏声音数据系统化支撑" | Emotional/Social Job推断依据减少，置信度降低 |
| behavior-analysis.json | 基于用户反馈文本推断行为意图，标注"缺乏行为数据交叉验证" | Functional Job缺乏行为数据佐证，频率统计不精确 |
| voice-analysis.json + behavior-analysis.json | 用户提供用户反馈文本 → 直接提取JTBD | 整体置信度降低，frequency为估算值 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述执行轻量版JTBD提取 | 输出为轻量版，仅含Functional Job，Emotional/Social Job标注"待补充" |

数据获取说明：
- 本Skill需要用户声音分析和行为分析数据，请通过以下方式之一提供：
  1. 直接粘贴用户反馈文本
  2. 上传voice-analysis.json / behavior-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| voice-analysis.json新增反馈条目 | Functional/Emotional/Social Job频率和证据变化 | 标注受影响的Job，建议人类确认是否需要重新提取 |
| voice-analysis.json情感分类修正 | Emotional Job推断依据变化 | 标注受影响的Emotional Job，建议重新评估置信度 |
| behavior-analysis.json行为模式更新 | Functional Job频率和行为目标变化 | 标注受影响的Functional Job，建议更新frequency |

当本Skill自身变更时，对下游的通知机制：

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| Job增删 | insight-5whys / insight-priority-scoring | 标注新增/删除的Job，5whys需确认因果链起点，priority-scoring需更新痛点数据 |
| Job置信度调整 | insight-priority-scoring | 标注置信度变化的Job，priority-scoring需重新评估评分可信度 |
| Functional Job优先级变化 | insight-5whys | 标注优先级变化的Job，5whys需确认分析顺序 |
