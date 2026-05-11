---
name: insight-requirement-layers
description: 当需要将原始需求拆解为表层需求、行为需求、本质需求三层时使用，通过推断模式库逐层深挖。需求三层模型自动拆解。关键词：需求拆解、三层模型、表层需求、行为需求、本质需求、需求深挖。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 需求三层模型自动拆解

## 核心原则

1. **表层是症状不是病因**——用户说出的需求是冰山一角，三层模型要穿透表层直达本质动机，每一层都必须比上一层更接近"为什么"
2. **推断必须可追溯**——行为需求和本质需求都是推断结果，inference_basis字段必须明确记录推断逻辑和数据来源，拒绝无依据猜测
3. **置信度逐层递减**——表层需求置信度1.0（直接引用），行为需求0.7-0.9（场景推断），本质需求0.4-0.7（深层推断），每层置信度下降是正常的，关键是标注清楚
4. **验证标记不可省略**——本质需求置信度<0.5必须标记validation_needed=true，行为需求置信度<0.7必须标记validation_needed=true，低置信度不是错误而是待验证假设

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 原始需求列表 | JSON | 是 | 用户提供 / output/pm-discovery/user-research-voice-analysis/voice-analysis.json | 用户声音、业务方需求、数据异常等原始需求 |

### Input JSON 示例结构

```json
{
  "requirements": [
    {
      "id": "REQ-001",
      "source": "用户反馈",
      "content": "希望增加批量导出功能",
      "context": "运营人员日常报表处理",
      "frequency": 8,
      "sentiment": "negative"
    },
    {
      "id": "REQ-002",
      "source": "业务方",
      "content": "需要支持多语言界面",
      "context": "海外业务拓展",
      "frequency": 3,
      "sentiment": "neutral"
    }
  ]
}
```

## 执行步骤

### Step 1: 表层需求提取

直接提取用户或业务方明确表达的需求内容。

- 逐条读取原始需求列表，提取用户/业务方直接说出的内容
- 保留原始表述，不做推断和改写
- 置信度 = 1.0（因为是直接引用，无需推断）
- 输出格式：`{ surface: "原始表述", confidence: 1.0 }`

### Step 2: 行为需求推断

从表层需求推断用户在什么场景下、实际会产生什么行为。

- 推断规则：
  - 分析表层需求 → 识别用户所处的使用场景
  - 推断用户在该场景下的实际行为模式
  - 关联behavior-analysis.json中的行为数据作为佐证
- 推断模式：
  - `"希望增加XX功能"` → 场景：XX场景下需要完成YY → 行为：当前通过ZZ方式替代
  - `"需要支持XX"` → 场景：XX条件下无法完成YY → 行为：转向竞品或手动处理
  - `"XX太慢/太卡"` → 场景：高频操作XX时体验受阻 → 行为：减少使用频率或寻找替代方案
  - `"找不到XX"` → 场景：信息架构不清晰导致迷失 → 行为：反复搜索或求助他人
  - `"XX操作太复杂"` → 场景：任务流程步骤过多 → 行为：跳过非必要步骤或放弃使用
  - `"希望XX能自动"` → 场景：重复性操作消耗精力 → 行为：手动执行但产生挫败感
  - `"XX数据不准"` → 场景：决策依赖数据但数据不可靠 → 行为：交叉验证或延迟决策
- 置信度范围：0.7-0.9（基于推断逻辑的合理性和数据佐证程度）
- 输出格式：`{ behavioral: "场景+行为描述", confidence: 0.7-0.9, inference_basis: "推断依据" }`

### Step 3: 本质需求推断

从行为需求推断为什么用户需要这样做，挖掘底层动机。

- 推断规则：
  - 行为需求 → 用户为什么需要这样做 → 底层动机/价值观
  - 使用5Whys思维框架进行单步深挖
  - 参考JTBD分析中的Emotional/Social Job作为交叉验证
- 推断模式：
  - `"批量导出"` → 减少重复劳动 → 追求效率和成就感
  - `"多语言支持"` → 服务海外客户 → 追求业务拓展和竞争力
  - `"实时通知"` → 不想错过信息 → 追求掌控感和安全感
  - `"操作简化"` → 降低认知负荷 → 追求轻松体验和自主感
  - `"数据准确性"` → 避免决策失误 → 追求确定性和信任感
  - `"个性化定制"` → 适配自身工作流 → 追求自主性和归属感
  - `"协作功能"` → 减少沟通成本 → 追求社交连接和团队认同
  - `"权限管理"` → 保护敏感信息 → 追求安全感和控制权
  - `"移动端支持"` → 随时随地处理事务 → 追求灵活性和自由度
  - `"数据可视化"` → 快速理解复杂信息 → 追求认知确定性和决策信心
- 置信度范围：0.4-0.7（本质需求推断不确定性较高，需标注验证状态）
- 输出格式：`{ essential: "底层动机描述", confidence: 0.4-0.7, inference_basis: "推断依据" }`

### Step 4: 置信度标注

对每条需求的三层拆解结果进行置信度标注和验证标记。

- 置信度规则：
  - 表层需求：1.0（直接引用）
  - 行为需求：0.7-0.9（有场景推断，可能存在偏差）
  - 本质需求：0.4-0.7（深层推断，不确定性高）
- 验证标记规则：
  - 本质需求置信度 < 0.5 → `validation_needed: true`
  - 行为需求置信度 < 0.7 → `validation_needed: true`
  - 其他 → `validation_needed: false`

## 输出

输出文件：`output/pm-discovery/insight-requirement-layers/requirement-layers.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["analysis_metadata", "requirement_layers", "summary"],
  "properties": {
    "analysis_metadata": {"type": "object", "description": "分析元数据，包含来源、需求数量和时间戳"},
    "requirement_layers": {"type": "array", "description": "需求三层拆解结果列表"},
    "summary": {"type": "object", "description": "拆解统计摘要"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| analysis_metadata.source | string | 是 | 必须非空，标识数据来源 |
| analysis_metadata.total_requirements | integer | 是 | 必须 ≥ 0，与requirement_layers数组长度一致 |
| analysis_metadata.analysis_timestamp | string | 是 | 必须符合ISO8601格式 |
| requirement_layers[].id | string | 是 | 必须非空且在数组内唯一 |
| requirement_layers[].source | string | 是 | 必须非空，标识需求来源 |
| requirement_layers[].surface.content | string | 是 | 必须非空，保留原始表述 |
| requirement_layers[].surface.confidence | number | 是 | 必须等于1.0 |
| requirement_layers[].behavioral.content | string | 是 | 必须非空，包含场景+行为描述 |
| requirement_layers[].behavioral.confidence | number | 是 | 必须在0.7-0.9范围内 |
| requirement_layers[].behavioral.inference_basis | string | 是 | 必须非空，记录推断逻辑和数据来源 |
| requirement_layers[].essential.content | string | 是 | 必须非空，描述底层动机 |
| requirement_layers[].essential.confidence | number | 是 | 必须在0.4-0.7范围内 |
| requirement_layers[].essential.inference_basis | string | 是 | 必须非空，记录推断逻辑和数据来源 |
| requirement_layers[].validation_needed | boolean | 是 | 本质需求置信度<0.5或行为需求置信度<0.7时必须为true |
| requirement_layers[].validation_reason | string | 条件必填 | 当validation_needed=true时必须非空，说明验证原因 |
| summary.total | integer | 是 | 必须 ≥ 0，与requirement_layers数组长度一致 |
| summary.needs_validation | integer | 是 | 必须 ≥ 0且 ≤ summary.total |
| summary.high_confidence | integer | 是 | 必须 ≥ 0且 ≤ summary.total |

### Output JSON 格式

```json
{
  "analysis_metadata": {
    "source": "原始需求列表",
    "total_requirements": 0,
    "analysis_timestamp": "ISO8601"
  },
  "requirement_layers": [
    {
      "id": "REQ-001",
      "source": "用户反馈",
      "surface": {
        "content": "希望增加批量导出功能",
        "confidence": 1.0
      },
      "behavioral": {
        "content": "运营人员在月度报表场景下，需要一次性导出多份报表，当前只能逐个导出",
        "confidence": 0.85,
        "inference_basis": "用户反馈频率8次+行为数据：报表导出页面平均停留时长异常"
      },
      "essential": {
        "content": "追求工作效率，减少重复性劳动，获得工作成就感",
        "confidence": 0.6,
        "inference_basis": "从行为需求推断+JTBD情感Job交叉验证"
      },
      "validation_needed": true,
      "validation_reason": "本质需求置信度0.6<0.7，建议通过用户访谈验证"
    },
    {
      "id": "REQ-002",
      "source": "业务方",
      "surface": {
        "content": "需要支持多语言界面",
        "confidence": 1.0
      },
      "behavioral": {
        "content": "海外团队在使用系统时因语言障碍导致操作效率低，需借助翻译工具",
        "confidence": 0.75,
        "inference_basis": "业务方需求描述+海外团队反馈"
      },
      "essential": {
        "content": "降低跨文化协作成本，提升全球化业务竞争力",
        "confidence": 0.45,
        "inference_basis": "从行为需求推断，缺乏直接数据佐证"
      },
      "validation_needed": true,
      "validation_reason": "本质需求置信度0.45<0.5，必须标记需人类验证"
    }
  ],
  "summary": {
    "total": 0,
    "needs_validation": 0,
    "high_confidence": 0
  }
}
```

## 决策规则

| 规则 | 条件 | 动作 |
|---|---|---|
| 本质需求低置信度强制验证 | 本质需求置信度 < 0.5 | 必须标记 `validation_needed: true`，升级人类验证 |
| 行为需求低置信度验证 | 行为需求置信度 < 0.7 | 标记 `validation_needed: true`，建议补充数据 |
| 表层需求冲突 | 同一需求不同来源表述矛盾 | 标记冲突，升级人类判定 |
| 数据不足 | 原始需求条目 < 3 | 标记分析结果为低可信度 |

## 质量检查

- [ ] 每条需求三层（surface/behavioral/essential）均已拆解
- [ ] 每层均有置信度标注
- [ ] 本质需求已标记验证状态（validation_needed字段）
- [ ] 低置信度项已列入验证清单
- [ ] 推断依据（inference_basis）非空

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 需求列表 | 用户口述需求 → 直接拆解三层，标注"缺乏结构化需求输入" | inference_basis缺失数据佐证，行为需求置信度上限降至0.7 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述的需求直接拆解三层模型 | 所有推断均无数据佐证，本质需求置信度上限降至0.5，全部标记validation_needed=true |

数据获取说明：
- 本Skill需要需求列表数据，请通过以下方式之一提供：
  1. 直接粘贴需求文本
  2. 上传需求列表JSON/CSV文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响

| 上游变更类型 | 影响范围 | 响应动作 |
|-------------|---------|---------|
| 需求列表字段新增 | requirement_layers结构需同步扩展 | 评估新字段是否影响三层拆解逻辑，必要时更新推断模式库 |
| 需求列表字段删除 | 依赖该字段的推断依据失效 | 标记受影响条目的inference_basis为"字段已删除"，降低对应置信度 |
| 需求列表格式变更 | Input JSON解析可能失败 | 尝试兼容解析，失败则提示用户提供正确格式 |
| 上游分析结果更新（如voice-analysis.json） | 行为需求的佐证数据变化 | 重新评估受影响条目的inference_basis和置信度 |

### 下游通知机制

| 本Skill输出变更 | 受影响下游 | 通知方式 |
|---------------|-----------|---------|
| requirement_layers结构新增字段 | insight-kano、insight-priority-scoring | 在analysis_metadata中添加schema_version字段，下游按版本适配 |
| 置信度阈值调整 | insight-5whys、insight-priority-scoring | 更新summary中needs_validation计数，下游重新评估优先级 |
| 推断模式库扩展 | 无直接影响 | 内部优化，输出格式不变 |
