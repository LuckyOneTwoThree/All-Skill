---
name: user-research-interview-assist
description: 当需要设计用户访谈脚本、执行访谈后提取洞察、跨访谈聚类分析时使用。访谈辅助Pipeline。关键词：用户访谈、访谈脚本、访谈洞察、半结构化访谈、定性研究辅助。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "human_ai_collaborate"
---

# 访谈辅助

## 核心原则

1. **人类主导AI辅助**——访谈执行由人类主导，AI负责脚本设计、转录分析和洞察提取，不可替代人类判断
2. **脚本服务于目标不是目标本身**——访谈脚本是验证假设的工具，人类可基于现场判断偏离脚本追问，灵活性优先于完整性
3. **追问比主问题更有价值**——主问题打开话题，追问挖掘深度，脚本必须包含追问策略和探针提示
4. **访谈是验证不是探索**——访谈目标来自已有数据发现的假设，每场访谈必须回答"验证了什么/推翻了什么"

## 交互模式

👤→🤖 **人类AI协作** — 人类主导访谈执行，AI负责脚本设计、转录分析和洞察提取

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| persona.json | JSON | ○ | output/pm-discovery/user-research-user-modeling/persona.json | 用户画像数据，用于定向访谈对象和脚本设计 |
| research_objectives | object | 是 | 用户提供 | 研究目标，定义本次访谈要验证的假设和探索的方向 |
| interview_config | object | 是 | 用户提供 | 访谈配置（目标人数、时长、形式、录音可用性） |
| voice-analysis.json | JSON | ○ | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | 用户声音分析数据 |
| behavior-analysis.json | JSON | ○ | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 行为分析数据 |

### 输入格式

```json
{
  "persona_path": "output/pm-discovery/user-research-user-modeling/persona.json",
  "research_objectives": {
    "primary_questions": ["string"],
    "hypotheses_to_validate": ["string"],
    "areas_to_explore": ["string"]
  },
  "interview_config": {
    "target_count": "number",
    "duration_minutes": "number",
    "format": "in_person|video|phone",
    "recording_available": "boolean"
  },
  "existing_analysis": {
    "voice_analysis_path": "output/pm-discovery/user-research-voice-analysis/voice-analysis.json",
    "behavior_analysis_path": "output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json"
  }
}
```

**输入依赖**：
- `persona.json`（如已生成）：用于定向访谈对象和脚本设计
- 研究目标（人类输入）：定义本次访谈要验证的假设和探索的方向
- voice-analysis.json / behavior-analysis.json：提供待验证的数据发现

---

## 执行步骤

### 阶段一：访谈前准备（AI生成，人类确认）

#### Step 1：生成目标清单

- 基于研究目标和已有数据分析结果，生成访谈目标清单
- 每个目标标注：
  - 来源假设（来自哪个数据发现或推断）
  - 验证方式（直接提问 / 行为观察 / 投射技术）
  - 优先级（必须验证 / 建议验证 / 可选探索）
- 识别已有数据中的矛盾点，列为重点验证目标
- 输出：访谈目标清单

#### Step 2：生成半结构化访谈脚本

- 基于目标清单生成半结构化脚本，包含：
  - **开场**：破冰问题，建立信任
  - **核心模块**：按目标优先级排列的问题组
  - **每个问题**：
    - 主问题（开放式）
    - 追问策略（2-3个方向性追问）
    - 探针提示（当用户回答模糊时的引导方向）
    - 对应目标（该问题验证哪个假设）
  - **收尾**：开放性问题，让用户补充
- 脚本设计原则：
  - 先行为后态度（先问做了什么，再问怎么想）
  - 先具体后抽象（先问具体场景，再问一般观点）
  - 避免引导性问题
- 输出：interview-script.json

#### Step 3：推荐访谈对象

- 基于Persona推荐访谈对象特征：
  - 优先覆盖不同Persona类型
  - 优先选择数据中有矛盾行为的用户
  - 优先选择voice-analysis中高频痛点的反馈者
- 推荐人数：目标Persona数 × 3-5人
- 输出：推荐访谈对象列表

### 阶段二：访谈执行（人类主导）

- 人类按脚本执行访谈
- AI不参与实时访谈过程
- 人类可偏离脚本追问（鼓励基于现场判断的追问）
- 建议录音（需征得受访者同意）

### 阶段三：访谈后分析（AI辅助）

#### Step 4：转录与结构化

- 如有录音，AI辅助转录
- 将访谈内容按主题结构化整理
- 标注关键引用（原声）
- 输出：结构化访谈记录

#### Step 5：关键洞察提取

- 从每场访谈中提取关键洞察：
  - **验证的假设**：哪些假设被访谈数据支持
  - **推翻的假设**：哪些假设被访谈数据否定
  - **新发现**：访谈中出现的未预期发现
  - **用户原声**：支撑每个洞察的代表性引用
- 每个洞察标注置信度
- 区分：直接陈述（用户明确说） vs 推断（从行为描述推断）
- 输出：洞察列表

#### Step 6：跨访谈聚类

- 将多场访谈的洞察进行跨访谈聚类
- 识别跨访谈的共同模式（多个受访者独立提及）
- 识别独特但有价值的洞察（仅一人提及但深度高）
- 评估每个聚类的饱和度（是否需要更多访谈）
- 输出：跨访谈洞察聚类

#### Step 7：更新Persona

- 基于访谈发现更新Persona：
  - 补充或修正Persona特征
  - 提升低置信度字段的置信度（如访谈验证了推断）
  - 降低被推翻假设的置信度
  - 新增访谈中发现的新特征
- 标注更新来源：`interview-validated` / `interview-revised` / `interview-discovered`
- 输出：更新后的persona.json

---

## 输出

### interview-script.json

输出文件：`output/pm-discovery/user-research-interview-assist/interview-script.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["script_id", "research_objectives", "core_modules"],
  "properties": {
    "script_id": {"type": "string", "description": "访谈脚本唯一标识"},
    "research_objectives": {"type": "array", "description": "研究目标列表"},
    "target_personas": {"type": "array", "description": "目标Persona类型列表"},
    "opening": {"type": "object", "description": "开场模块，含破冰问题和背景设定"},
    "core_modules": {"type": "array", "description": "核心问题模块列表"},
    "closing": {"type": "object", "description": "收尾模块"},
    "recommended_participants": {"type": "array", "description": "推荐访谈对象列表"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| script_id | string | 是 | 脚本唯一标识 |
| research_objectives | string[] | 是 | 研究目标列表，不可为空 |
| target_personas | string[] | 否 | 目标Persona类型列表 |
| opening.icebreaker_questions | string[] | 是 | 破冰问题列表 |
| opening.context_setting | string | 是 | 背景设定描述 |
| core_modules | array | 是 | 核心问题模块列表，不可为空 |
| core_modules[].module_name | string | 是 | 模块名称 |
| core_modules[].objective | string | 是 | 模块目标 |
| core_modules[].hypothesis_to_validate | string | 是 | 待验证假设 |
| core_modules[].priority | string | 是 | 优先级枚举：must_validate/should_validate/optional |
| core_modules[].questions | array | 是 | 问题列表，每个核心问题≥2个追问方向 |
| core_modules[].questions[].main_question | string | 是 | 主问题（开放式） |
| core_modules[].questions[].follow_up_strategies | string[] | 是 | 追问策略，≥2个方向 |
| core_modules[].questions[].probes | string[] | 是 | 探针提示 |
| closing.open_ended_question | string | 是 | 收尾开放性问题 |
| recommended_participants | array | 否 | 推荐访谈对象列表 |
| recommended_participants[].persona_type | string | 是 | Persona类型 |
| recommended_participants[].priority | string | 是 | 优先级枚举：high/medium/low |

```json
{
  "script_id": "string",
  "research_objectives": ["string"],
  "target_personas": ["string"],
  "opening": {
    "icebreaker_questions": ["string"],
    "context_setting": "string"
  },
  "core_modules": [
    {
      "module_name": "string",
      "objective": "string",
      "hypothesis_to_validate": "string",
      "priority": "must_validate|should_validate|optional",
      "questions": [
        {
          "id": "string",
          "main_question": "string",
          "follow_up_strategies": ["string"],
          "probes": ["string"],
          "target_objective": "string"
        }
      ]
    }
  ],
  "closing": {
    "open_ended_question": "string",
    "wrap_up": "string"
  },
  "recommended_participants": [
    {
      "persona_type": "string",
      "key_characteristics": ["string"],
      "priority": "high|medium|low",
      "reason": "string"
    }
  ]
}
```

### interview-insights.json

输出文件：`output/pm-discovery/user-research-interview-assist/interview-insights.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["interviews_conducted", "validated_hypotheses", "new_discoveries", "metadata"],
  "properties": {
    "interviews_conducted": {"type": "number", "description": "已执行访谈数量"},
    "validated_hypotheses": {"type": "array", "description": "已验证的假设列表"},
    "refuted_hypotheses": {"type": "array", "description": "被推翻的假设列表"},
    "new_discoveries": {"type": "array", "description": "新发现列表"},
    "cross_interview_patterns": {"type": "array", "description": "跨访谈共同模式列表"},
    "persona_updates": {"type": "array", "description": "Persona更新列表"},
    "data_cross_validation": {"type": "object", "description": "与已有数据的交叉验证结果"},
    "metadata": {"type": "object", "description": "分析元数据，含时间戳和整体置信度"}
  }
}
```

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| interviews_conducted | number | 是 | 已执行访谈数量，须≥1 |
| validated_hypotheses | array | 是 | 已验证假设列表，每项须含hypothesis、supporting_evidence、supporting_quotes、interview_count、confidence |
| validated_hypotheses[].confidence | number | 是 | 验证置信度，0-1 |
| refuted_hypotheses | array | 是 | 被推翻假设列表，每项须含hypothesis、refuting_evidence、refuting_quotes、interview_count、confidence |
| refuted_hypotheses[].confidence | number | 是 | 推翻置信度，0-1 |
| new_discoveries | array | 是 | 新发现列表，每项须含discovery、evidence、quotes、interview_count、confidence、needs_further_validation |
| new_discoveries[].needs_further_validation | boolean | 是 | 是否需要进一步验证 |
| new_discoveries[].confidence | number | 是 | 发现置信度，0-1 |
| cross_interview_patterns | array | 否 | 跨访谈模式列表，每项须含pattern、frequency、interview_ids、confidence、saturation_level |
| cross_interview_patterns[].saturation_level | string | 是 | 饱和度枚举：saturated/near_saturated/needs_more |
| persona_updates | array | 否 | Persona更新列表，每项须含persona_id、updates |
| persona_updates[].updates[].update_type | string | 是 | 更新类型枚举：interview-validated/interview-revised/interview-discovered |
| data_cross_validation | object | 否 | 交叉验证结果，须含consistent_with_voice_analysis、consistent_with_behavior_analysis、contradictions_found |
| metadata.analysis_timestamp | string | 是 | 分析时间戳 |
| metadata.total_interviews | number | 是 | 访谈总数 |
| metadata.total_insights | number | 是 | 洞察总数 |
| metadata.confidence_overall | number | 是 | 整体置信度，0-1 |

```json
{
  "interviews_conducted": "number",
  "validated_hypotheses": [
    {
      "hypothesis": "string",
      "supporting_evidence": ["string"],
      "supporting_quotes": ["string"],
      "interview_count": "number",
      "confidence": "number"
    }
  ],
  "refuted_hypotheses": [
    {
      "hypothesis": "string",
      "refuting_evidence": ["string"],
      "refuting_quotes": ["string"],
      "interview_count": "number",
      "confidence": "number"
    }
  ],
  "new_discoveries": [
    {
      "discovery": "string",
      "evidence": ["string"],
      "quotes": ["string"],
      "interview_count": "number",
      "confidence": "number",
      "needs_further_validation": "boolean"
    }
  ],
  "cross_interview_patterns": [
    {
      "pattern": "string",
      "frequency": "number",
      "interview_ids": ["string"],
      "confidence": "number",
      "saturation_level": "saturated|near_saturated|needs_more"
    }
  ],
  "persona_updates": [
    {
      "persona_id": "string",
      "updates": [
        {
          "field": "string",
          "previous_value": "string",
          "updated_value": "string",
          "update_type": "interview-validated|interview-revised|interview-discovered",
          "confidence": "number"
        }
      ]
    }
  ],
  "data_cross_validation": {
    "consistent_with_voice_analysis": ["string"],
    "consistent_with_behavior_analysis": ["string"],
    "contradictions_found": [
      {
        "data_source": "string",
        "interview_finding": "string",
        "existing_finding": "string",
        "possible_explanation": "string",
        "resolution": "string"
      }
    ]
  },
  "metadata": {
    "analysis_timestamp": "string",
    "total_interviews": "number",
    "total_insights": "number",
    "confidence_overall": "number"
  }
}
```

---

## 决策规则

| 条件 | 动作 |
|------|------|
| 推断需求置信度 < 0.5 | 标记"需人类验证"，不直接更新Persona |
| 访谈发现与已有数据矛盾 | 记录矛盾，标记"需仲裁"，列出双方证据 |
| 跨访谈聚类饱和度不足 | 建议增加访谈数量，标注"需补充验证" |
| 新发现仅1人提及 | 标记"孤立发现"，置信度上限0.4，建议验证 |
| 访谈脚本偏离原目标 | 人类决策是否调整研究目标 |

---

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|-----------|
| 脚本包含追问策略 | 每个核心问题 ≥ 2个追问方向 | 补充追问策略 |
| 洞察与已有数据做了印证/矛盾分析 | 每个洞察有cross_validation记录 | 未做交叉验证的洞察标记"待验证" |
| 访谈对象覆盖主要Persona | 每个高优先级Persona ≥ 3人 | 标注"覆盖不足"，建议补充 |
| 每个洞察有原声支撑 | 每个洞察 ≥ 1条引用 | 无原声的洞察标记"支撑不足" |
| 所有输出标注置信度 | 100% | 缺失置信度的字段补填默认值0.3并标记 |
| 非引导性问题检查 | 核心问题无引导性表述 | 发现引导性问题则标记并建议修改 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| persona.json | 用户提供研究目标和用户描述 → 基于描述生成访谈脚本，标注"缺乏Persona数据定向" | target_personas为空，recommended_participants基于推断，访谈对象定向精度降低 |
| voice-analysis.json / behavior-analysis.json | 基于用户提供的研究目标直接生成脚本，标注"缺乏数据验证假设" | hypothesis_to_validate基于用户描述而非数据发现，data_cross_validation缺失 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述的研究目标生成轻量版访谈脚本 | 脚本为纯探索性设计，验证性假设缺失，整体置信度降低 |
| 若用户未提供research_objectives | 提示用户提供研究目标，否则无法设计定向访谈脚本 | 无法生成interview-script.json，流程中断 |
| 若用户未提供interview_config | 提示用户提供访谈配置，否则使用默认配置（目标人数：5，时长：45分钟，形式：视频，录音可用） | 使用默认配置，访谈安排可能不符合实际条件 |

数据获取说明：
- 本Skill需要Persona和用户研究数据，请通过以下方式之一提供：
  1. 直接描述研究目标、假设和目标用户特征
  2. 上传persona.json / voice-analysis.json / behavior-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 上游变更响应

### 上游变更影响

| 上游Skill | 变更类型 | 影响范围 | 响应动作 |
|-----------|---------|---------|---------|
| user-research-user-modeling | persona.json结构变更 | Persona字段映射变化 | 检查输入字段映射，适配新结构，不兼容时标记"上游数据格式异常" |
| user-research-user-modeling | persona.json内容更新 | Persona特征、痛点、JTBD变化 | 重新生成访谈脚本和推荐对象，标注"基于更新Persona重建" |
| user-research-voice-analysis | voice-analysis.json结构变更 | 痛点、主题数据格式变化 | 检查输入字段映射，适配新结构，不兼容时标记"上游数据格式异常" |
| user-research-voice-analysis | voice-analysis.json内容更新 | 痛点等级、情感分布变化 | 更新待验证假设清单，标注"基于更新数据调整假设" |
| user-research-behavior-analysis | behavior-analysis.json结构变更 | 行为分群、Aha Moment数据格式变化 | 检查输入字段映射，适配新结构，不兼容时标记"上游数据格式异常" |
| user-research-behavior-analysis | behavior-analysis.json内容更新 | 漏斗、路径、异常检测结果变化 | 更新待验证假设清单，标注"基于更新数据调整假设" |

### 下游通知机制

| 下游Skill | 通知触发条件 | 通知方式 | 通知内容 |
|-----------|------------|---------|---------|
| user-research-report | interview-insights.json更新完成 | 写入output文件 | 通知访谈洞察和Persona更新数据已就绪，可用于报告生成 |
