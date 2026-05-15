---
name: insight-analysis
description: 需求洞察分析，整合JTBD、需求分层、5Whys根因、KANO分类和优先级评分。关键词：需求洞察、JTBD、5Whys、KANO、优先级评分、需求分析。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我分析一下用户需求"
    - "需求太多了，帮我排个优先级"
    - "用KANO模型分析一下需求"
    - "挖掘一下用户的深层需求"
    - "用户到底想完成什么任务"
    - "为什么用户总是抱怨这个功能"
    - "哪些功能是必须有的"
    - "需求太多先做哪个"
  interaction_mode: "ai_suggest_human_approve"
---

# Insight Analysis — 需求洞察分析

## 核心原则

1. **需求≠问题**——用户描述的是解决方案不是问题本身，先拆解（requirement-layers）再分析（jtbd/5whys），避免停留在表面需求
2. **任务而非方案**——用户表达的"想要XX功能"是方案而非任务，JTBD要挖掘的是"用户用这个功能想完成什么"
3. **现象驱动而非假设驱动**——5Whys从可观测的问题现象出发，每层追问必须锚定上一层回答，禁止跳跃式推断
4. **分类基于用户反应而非产品属性**——KANO分类的依据是"用户对功能有无的反应"，而非"功能本身的技术复杂度"
5. **多维度独立贡献**——痛点强度、频率、可解决性各自独立贡献分数，采用加权求和而非乘法避免极端值
6. **KANO是加成而非乘数**——KANO分类作为加成系数调整基础分，不会让其他维度的贡献完全消失
7. **未确认维度显式标注**——可解决性默认值3（中等），未获技术确认的需求整体评分置信度强制为low

## 交互模式

🤖→👤 AI 建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 用户反馈数据 | JSON | 是 | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | 用户声音与情感分析数据 |
| 行为分析数据 | JSON | 是 | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 行为模式与痛点数据 |
| 原始需求列表 | JSON | ○ | 用户提供 | 用户声音、业务方需求、数据异常等原始需求 |

## 执行步骤

### Step 1: 并行洞察（JTBD + 需求分层）

并行执行 JTBD 分析和需求三层模型拆解。

#### 1a: JTBD 分析

从用户反馈和行为数据中提取功能性、情感性、社会性三层Job。

**Step 1a-1: Functional Job 提取**

- 扫描用户原话，匹配任务意图模式
- 从行为数据中提取高频行为目标，推断用户试图完成的任务
- 意图模式库：

| 模式类别 | 匹配模式 | 推断方向 |
|----------|----------|----------|
| 直接表达 | "我想..."、"能不能..."、"需要..."、"帮我..."、"希望..." | 直接提取为Functional Job |
| 痛点反推 | "太慢了"、"太麻烦了"、"不方便"、"不好用" | 反推用户想高效/便捷地完成某事 |
| 行为目标 | 高频操作路径、重复行为模式 | 推断用户试图达成的行为目标 |
| 竞品对比 | "XX产品可以..."、"为什么你们不能..." | 提取用户期望的功能能力 |
| 场景描述 | "每次做XX的时候..."、"在XX场景下..." | 提取场景化的功能需求 |

- 对每个Functional Job标注频率和情感强度

**Step 1a-2: Emotional Job 推断**

- 从负向反馈中推断情感诉求
- 情感映射规则库：

| 负向表达模式 | 情感诉求方向 | 置信度基准 |
|-------------|-------------|-----------|
| "太麻烦了"/"太复杂了"/"操作太多" | 渴望轻松/省力 | 0.8 |
| "不放心"/"担心"/"怕出错" | 渴望安全感/确定性 | 0.75 |
| "很焦虑"/"着急"/"来不及" | 渴望掌控感/效率 | 0.75 |
| "被忽略了"/"没人理我"/"反馈没回应" | 渴望被重视/被关注 | 0.7 |
| "太慢了"/"等太久"/"响应慢" | 渴望即时反馈/流畅感 | 0.8 |
| "看不懂"/"不知道怎么用" | 渴望清晰/简单/易懂 | 0.75 |

- 置信度调整：单条证据×0.7，2-3条×0.85，4条以上×1.0

**Step 1a-3: Social Job 推断**

- 提取涉及他人评价、社会关系、群体归属的表述
- 社会映射规则库：

| 社会表达模式 | 社会诉求方向 | 置信度基准 |
|-------------|-------------|-----------|
| "同事都在用"/"别人也在用" | 社会认同/归属感 | 0.7 |
| "领导要求"/"公司规定" | 合规/服从权威 | 0.8 |
| "行业标配"/"竞品都有" | 行业认同/竞争力 | 0.7 |
| "推荐给朋友"/"分享给同事" | 社交货币/分享欲 | 0.7 |

- 置信度调整规则同Emotional Job

#### 1b: 需求三层模型拆解

将原始需求拆解为表层需求、行为需求、本质需求三层。

**Step 1b-1: 表层需求提取**

- 逐条读取原始需求，保留原始表述
- 置信度 = 1.0（直接引用）

**Step 1b-2: 行为需求推断**

- 推断模式：
  - `"希望增加XX功能"` → 场景：XX场景下需要完成YY → 行为：当前通过ZZ方式替代
  - `"需要支持XX"` → 场景：XX条件下无法完成YY → 行为：转向竞品或手动处理
  - `"XX太慢/太卡"` → 场景：高频操作XX时体验受阻 → 行为：减少使用频率或寻找替代方案
  - `"找不到XX"` → 场景：信息架构不清晰导致迷失 → 行为：反复搜索或求助他人
  - `"XX操作太复杂"` → 场景：任务流程步骤过多 → 行为：跳过非必要步骤或放弃使用
  - `"希望XX能自动"` → 场景：重复性操作消耗精力 → 行为：手动执行但产生挫败感
  - `"XX数据不准"` → 场景：决策依赖数据但数据不可靠 → 行为：交叉验证或延迟决策
- 置信度范围：0.7-0.9

**Step 1b-3: 本质需求推断**

- 推断模式：
  - `"批量导出"` → 减少重复劳动 → 追求效率和成就感
  - `"多语言支持"` → 服务海外客户 → 追求业务拓展和竞争力
  - `"实时通知"` → 不想错过信息 → 追求掌控感和安全感
  - `"操作简化"` → 降低认知负荷 → 追求轻松体验和自主感
  - `"数据准确性"` → 避免决策失误 → 追求确定性和信任感
  - `"个性化定制"` → 适配自身工作流 → 追求自主性和归属感
  - `"协作功能"` → 减少沟通成本 → 追求社交连接和团队认同
- 置信度范围：0.4-0.7
- 验证标记：本质需求置信度<0.5 → `validation_needed: true`，行为需求置信度<0.7 → `validation_needed: true`

### Step 2: 根因深挖（5Whys）

对关键痛点或问题现象进行根因深挖。

**Round 1**: 基于问题现象，生成原因假设列表Top3，按可能性排序，每个原因标注数据支撑度和置信度

**Round 2-N**: 对上一轮Top1原因追问为什么，生成子原因列表Top3

**多路径分叉**：当上一轮Top1与Top2置信度差距 < 0.15时，同时追踪两条因果链

**终止条件**（满足任一即停止）：

| 条件 | 说明 |
|---|---|
| 达到第5层 | 已进行5轮追问，更深层次推断可信度不足 |
| 原因已触及不可再分根因 | 如"系统架构限制"、"组织流程问题"等不可再细化的原因 |
| 连续2层置信度 < 0.3 | 推断链可信度不足，需人类介入 |
| 已找到可行动改进点 | 根因已明确且可转化为具体行动 |

### Step 3: 需求分类（KANO）

对功能需求进行KANO模型分类。

**Step 3-1: 功能-反馈关联**

- 匹配规则：功能名称精确匹配、功能描述关键词匹配（匹配度 > 0.7）、用户反馈中提及的功能别名匹配
- 计算指标：正向提及率、负向提及率、提及频率、平均情感强度、使用深度相关性

**Step 3-2: 分类规则**

| 分类 | 条件 | 含义 |
|---|---|---|
| 必备型（Must-be） | 负向提及率 > 60% 且 提及频率 > 5% | 缺失时强烈不满，存在时视为理所当然 |
| 期望型（One-dimensional） | 负向提及率 30%-60% 且 与使用深度正相关（correlation > 0.3） | 做得越好用户越满意 |
| 兴奋型（Attractive） | 正向提及率 > 60% 且 提及频率 < 5% | 超出预期带来惊喜，缺失不会不满 |
| 无差异型（Indifferent） | 提及频率 < 1% 且 平均情感强度 < 2 | 用户不在乎有无 |

**行业阈值适配规则**：

| 行业/阶段 | 适配规则 | 调整说明 |
|---|---|---|
| B端SaaS | 必备型阈值下调：负向提及率 > 50% 即为必备型 | B端用户对基础功能缺失容忍度更低 |
| C端消费 | 兴奋型阈值上调：正向提及率 > 70% 才为兴奋型 | C端用户更容易给出正向反馈 |
| 早期产品 | 整体阈值放宽：数据量不足时降低判定门槛（置信度0.5即可分类） | 早期数据有限 |
| 成熟产品 | 严格阈值：数据充足时使用标准阈值，置信度<0.7必须升级 | 成熟产品数据充分 |

**Step 3-3: 边界情况处理**

- 分类置信度 < 0.7：标记"待人类判定"
- 不同群体分类不同：按用户群体分别标注分类结果
- 反向型：正向提及率 < 10% 且负向提及率 > 70%，标记为"反向型"
- 无反馈数据：标记为"数据不足"

### Step 4: 优先级评分

对需求列表进行加权优先级评分排序。

**评分函数**：

- 基础分 = 0.35 × 痛点强度(1-5) + 0.30 × 频率权重(1-5) + 0.35 × 可解决性(1-5)
- KANO加成 = 基础分 × (KANO系数 - 1)
- 优先级分数 = 基础分 + KANO加成

**KANO系数映射**：

| KANO分类 | 系数 | 加成效果 |
|---|---|---|
| 必备型（Must-be） | 1.5 | 基础分+50% |
| 期望型（One-dimensional） | 1.0 | 无加成 |
| 兴奋型（Attractive） | 0.8 | 基础分-20% |
| 无差异型（Indifferent） | 0.2 | 基础分-80% |
| 反向型（Reverse） | 0.0 | 基础分归零 |

**各维度评分规则**：

痛点强度（1-5分）：

| 分数 | 条件 |
|---|---|
| 5 | 情感强度≥4 且 5Whys根因已确认 |
| 4 | 情感强度≥3 或 5Whys根因已确认 |
| 3 | 情感强度=2-3 且有负向反馈 |
| 2 | 情感强度=1-2 且反馈较少 |
| 1 | 无负向反馈或情感强度<1 |

频率权重（1-5分）：

| 分数 | 条件 |
|---|---|
| 5 | 影响用户占比 > 30% 或 提及频率 > 10% |
| 4 | 影响用户占比 20-30% 或 提及频率 5-10% |
| 3 | 影响用户占比 10-20% 或 提及频率 2-5% |
| 2 | 影响用户占比 5-10% 或 提及频率 1-2% |
| 1 | 影响用户占比 < 5% 或 提及频率 < 1% |

可解决性（1-5分）：

| 分数 | 条件 |
|---|---|
| 5 | 技术方案成熟，1个迭代可交付 |
| 4 | 技术方案可行，2-3个迭代可交付 |
| 3 | 技术方案需调研，3-5个迭代 |
| 2 | 技术方案有挑战，需跨团队协作 |
| 1 | 技术方案不确定或依赖外部条件 |

> **注意**：可解决性需技术团队输入，默认值为3（中等），标记为"待技术确认"，该需求整体评分置信度降级为low

## 输出

输出路径：`output/pm-discovery/insight-analysis/`

输出文件：insight-analysis.json + insight-analysis.md

### 输出Schema

```json
{
  "type": "object",
  "required": ["jtbd", "requirement_layers", "5whys", "kano", "priority_scoring", "metadata"],
  "properties": {
    "jtbd": {
      "type": "object",
      "required": ["jobs", "summary"],
      "properties": {
        "jobs": {"type": "array", "description": "任务列表，详见输出校验规则→jtbd校验"},
        "summary": {"type": "object", "description": "统计摘要，含total_jobs和by_type"}
      }
    },
    "requirement_layers": {
      "type": "object",
      "required": ["requirement_layers"],
      "properties": {
        "requirement_layers": {"type": "array", "description": "需求三层拆解列表，详见输出校验规则→requirement_layers校验"}
      }
    },
    "5whys": {
      "type": "object",
      "required": ["chains", "root_cause", "actionable_fix"],
      "properties": {
        "chains": {"type": "array", "description": "因果链列表，详见输出校验规则→5whys校验"},
        "root_cause": {"type": "string"},
        "actionable_fix": {"type": "object", "description": "可行动改进建议，含description/effort/impact/suggested_metrics"}
      }
    },
    "kano": {
      "type": "object",
      "required": ["kano_classification", "boundary_cases", "summary"],
      "properties": {
        "kano_classification": {"type": "array", "description": "KANO分类列表，详见输出校验规则→kano校验"},
        "boundary_cases": {"type": "array"},
        "summary": {"type": "object"}
      }
    },
    "priority_scoring": {
      "type": "object",
      "required": ["priority_list", "scoring_summary", "priority_thresholds"],
      "properties": {
        "priority_list": {"type": "array", "description": "优先级列表，详见输出校验规则→priority_scoring校验"},
        "scoring_summary": {"type": "object"},
        "priority_thresholds": {"type": "object"}
      }
    },
    "metadata": {"type": "object", "description": "元数据，含版本、时间戳和来源文件"}
  }
}
```

### 输出校验规则

#### jtbd 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `jtbd.jobs` | array | 是 | 任务列表，不可为空 |
| `jtbd.jobs[].type` | enum(functional,emotional,social) | 是 | 任务类型 |
| `jtbd.jobs[].job` | string | 是 | 任务描述，不可为空 |
| `jtbd.jobs[].frequency` | number | 是 | 出现频次 |
| `jtbd.jobs[].evidence` | string | 是 | 推断依据，不可为空 |
| `jtbd.jobs[].confidence` | number | 是 | 置信度(0-1.0) |
| `jtbd.jobs[].pain_with_current` | string | 否 | 当前方案的痛点 |
| `jtbd.jobs[].pain_level` | enum(high,medium,low) | 否 | 痛点程度 |
| `jtbd.summary.total_jobs` | number | 是 | 任务总数 |
| `jtbd.summary.by_type` | object | 是 | 按类型统计 |

#### requirement_layers 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `requirement_layers.requirement_layers` | array | 是 | 需求三层拆解结果列表，不可为空 |
| `requirement_layers.requirement_layers[].id` | string | 是 | 需求标识，唯一 |
| `requirement_layers.requirement_layers[].surface.content` | string | 是 | 表层需求，保留原始表述 |
| `requirement_layers.requirement_layers[].surface.confidence` | number | 是 | 必须等于1.0 |
| `requirement_layers.requirement_layers[].behavioral.content` | string | 是 | 行为需求，含场景+行为描述 |
| `requirement_layers.requirement_layers[].behavioral.confidence` | number | 是 | 必须在0.7-0.9范围内 |
| `requirement_layers.requirement_layers[].behavioral.inference_basis` | string | 是 | 推断依据，不可为空 |
| `requirement_layers.requirement_layers[].essential.content` | string | 是 | 本质需求，描述底层动机 |
| `requirement_layers.requirement_layers[].essential.confidence` | number | 是 | 必须在0.4-0.7范围内 |
| `requirement_layers.requirement_layers[].essential.inference_basis` | string | 是 | 推断依据，不可为空 |
| `requirement_layers.requirement_layers[].validation_needed` | boolean | 是 | 本质需求置信度<0.5或行为需求置信度<0.7时必须为true |
| `requirement_layers.summary.total` | integer | 是 | 需求总数 |

#### 5whys 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `5whys.chains` | array | 是 | 因果链列表，长度≥1 |
| `5whys.chains[].path_id` | string | 是 | 路径标识 |
| `5whys.chains[].round` | number | 是 | 追问轮次 |
| `5whys.chains[].question` | string | 是 | 追问问题 |
| `5whys.chains[].answer` | string | 是 | 回答内容 |
| `5whys.chains[].evidence` | string | 是 | 证据来源 |
| `5whys.chains[].confidence` | number | 是 | 置信度(0-1.0) |
| `5whys.chains[].data_support` | enum(high,medium,low) | 是 | 数据支撑度 |
| `5whys.root_cause` | string | 是 | 根本原因，非空 |
| `5whys.actionable_fix.description` | string | 是 | 改进建议描述 |
| `5whys.actionable_fix.effort` | enum(low,medium,high) | 是 | 实施难度 |
| `5whys.actionable_fix.impact` | enum(low,medium,high) | 是 | 预期影响 |
| `5whys.actionable_fix.suggested_metrics` | array | 是 | 建议追踪的指标 |

#### kano 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `kano.kano_classification` | array | 是 | KANO分类结果列表，不可为空 |
| `kano.kano_classification[].feature_id` | string | 是 | 功能标识 |
| `kano.kano_classification[].category` | string | 是 | 分类，必须为must-be/one-dimensional/attractive/indifferent/reverse/insufficient_data之一 |
| `kano.kano_classification[].confidence` | number | 是 | 分类置信度(0-1) |
| `kano.kano_classification[].evidence` | object | 是 | 分类证据，含5项指标 |
| `kano.kano_classification[].review_period` | string | 是 | 复评周期 |
| `kano.boundary_cases` | array | 是 | 边界情况列表，confidence<0.7的必须在其中 |
| `kano.summary` | object | 是 | 各类型功能数量统计 |

#### priority_scoring 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `priority_scoring.priority_list` | array | 是 | 需求优先级列表，不可为空 |
| `priority_scoring.priority_list[].rank` | number | 是 | 排名 |
| `priority_scoring.priority_list[].requirement_id` | string | 是 | 需求标识 |
| `priority_scoring.priority_list[].requirement_name` | string | 是 | 需求名称 |
| `priority_scoring.priority_list[].scores.pain_intensity.score` | number | 是 | 痛点强度(1-5) |
| `priority_scoring.priority_list[].scores.frequency_weight.score` | number | 是 | 频率权重(1-5) |
| `priority_scoring.priority_list[].scores.solvability.score` | number | 是 | 可解决性(1-5) |
| `priority_scoring.priority_list[].scores.solvability.confirmed` | boolean | 是 | 是否已获技术确认 |
| `priority_scoring.priority_list[].scores.kano_coefficient.coefficient` | number | 是 | KANO系数 |
| `priority_scoring.priority_list[].scores.kano_coefficient.category` | string | 是 | KANO分类 |
| `priority_scoring.priority_list[].base_score` | number | 是 | 基础分 |
| `priority_scoring.priority_list[].kano_bonus` | number | 是 | KANO加成 |
| `priority_scoring.priority_list[].total_score` | number | 是 | 总分 |
| `priority_scoring.priority_list[].score_confidence` | enum(high,medium,low) | 是 | 评分可信度 |
| `priority_scoring.scoring_summary` | object | 是 | 评分统计摘要 |
| `priority_scoring.priority_thresholds` | object | 是 | 优先级分级阈值 |

### Output JSON 示例

```json
{
  "jtbd": {
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
        "pain_with_current": "每次操作都感到烦躁",
        "confidence": 0.7,
        "evidence": ["3位用户提到'太麻烦了'"],
        "sentiment_intensity": 3
      },
      {
        "type": "social",
        "job": "获得同事的认可",
        "frequency": 3,
        "pain_with_current": "觉得自己工具落后于同事",
        "confidence": 0.6,
        "evidence": ["用户访谈#17提到'同事都在用XX'"],
        "sentiment_intensity": 2
      }
    ],
    "summary": {
      "total_jobs": 3,
      "by_type": { "functional": 1, "emotional": 1, "social": 1 }
    }
  },
  "requirement_layers": {
    "analysis_metadata": {
      "source": "原始需求列表",
      "total_requirements": 2,
      "analysis_timestamp": "ISO8601"
    },
    "requirement_layers": [
      {
        "id": "REQ-001",
        "source": "用户反馈",
        "surface": { "content": "希望增加批量导出功能", "confidence": 1.0 },
        "behavioral": { "content": "运营人员在月度报表场景下，需要一次性导出多份报表，当前只能逐个导出", "confidence": 0.85, "inference_basis": "用户反馈频率8次+行为数据：报表导出页面平均停留时长异常" },
        "essential": { "content": "追求工作效率，减少重复性劳动，获得工作成就感", "confidence": 0.6, "inference_basis": "从行为需求推断+JTBD情感Job交叉验证" },
        "validation_needed": true,
        "validation_reason": "本质需求置信度0.6<0.7，建议通过用户访谈验证"
      }
    ],
    "summary": { "total": 2, "needs_validation": 2, "high_confidence": 0 }
  },
  "5whys": {
    "analysis_metadata": {
      "source_files": ["jtbd.json"],
      "total_paths": 1,
      "analysis_timestamp": "ISO8601"
    },
    "phenomenon": {
      "description": "用户在注册流程第3步大量放弃",
      "source": "jtbd.json",
      "metrics": { "drop_off_rate": 0.35, "affected_users": 1200 }
    },
    "chains": [
      { "path_id": "main", "round": 1, "question": "为什么用户在注册流程第3步大量放弃？", "answer": "第3步需要填写过多非必要信息", "evidence": "表单字段数12个，行业平均5个", "confidence": 0.85, "data_support": "high" },
      { "path_id": "main", "round": 2, "question": "为什么第3步需要填写过多非必要信息？", "answer": "产品需求将所有字段设为必填，未区分必要与非必要", "evidence": "需求文档PRD-2024-031中所有字段标记为必填", "confidence": 0.8, "data_support": "high" }
    ],
    "root_cause": "缺乏分阶段收集数据的策略，将注册流程当作唯一的数据收集窗口",
    "actionable_fix": {
      "description": "实施渐进式数据收集策略，注册流程仅保留核心必填字段（3-5个）",
      "effort": "medium",
      "impact": "high",
      "suggested_metrics": ["注册完成率提升", "第3步放弃率下降"]
    }
  },
  "kano": {
    "analysis_metadata": {
      "source_files": ["voice-analysis.json", "requirement-layers.json"],
      "total_features": 3,
      "analysis_timestamp": "ISO8601"
    },
    "kano_classification": [
      { "feature_id": "FEAT-001", "feature_name": "批量导出", "category": "must-be", "confidence": 0.85, "evidence": { "negative_rate": 0.75, "frequency": 0.08, "positive_rate": 0.25, "usage_depth_correlation": 0.6, "avg_sentiment_intensity": 3.5 }, "review_period": "6个月" },
      { "feature_id": "FEAT-002", "feature_name": "AI智能推荐", "category": "attractive", "confidence": 0.65, "evidence": { "negative_rate": 0.1, "frequency": 0.03, "positive_rate": 0.7, "usage_depth_correlation": 0.2, "avg_sentiment_intensity": 4.0 }, "review_period": "3个月", "needs_human_judgment": true },
      { "feature_id": "FEAT-003", "feature_name": "界面主题切换", "category": "indifferent", "confidence": 0.9, "evidence": { "negative_rate": 0.05, "frequency": 0.005, "positive_rate": 0.15, "usage_depth_correlation": 0.05, "avg_sentiment_intensity": 1.2 }, "review_period": "12个月" }
    ],
    "boundary_cases": [
      { "feature_id": "FEAT-002", "reason": "频率接近兴奋型/期望型边界", "suggested_action": "补充更多用户反馈数据或进行专项问卷验证" }
    ],
    "summary": { "must_be": 1, "one_dimensional": 0, "attractive": 1, "indifferent": 1, "needs_judgment": 1 }
  },
  "priority_scoring": {
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
          "pain_intensity": { "score": 4, "basis": "情感强度4+5Whys根因已确认" },
          "frequency_weight": { "score": 4, "basis": "提及频率8%，影响用户占比约25%" },
          "solvability": { "score": 3, "basis": "默认值，待技术团队确认", "confirmed": false },
          "kano_coefficient": { "coefficient": 1.5, "category": "must-be", "confidence": 0.85 }
        },
        "base_score": 3.65,
        "kano_bonus": 1.825,
        "total_score": 5.475,
        "score_confidence": "medium"
      }
    ],
    "scoring_summary": { "total_requirements": 2, "high_priority": 0, "medium_priority": 1, "low_priority": 1, "needs_tech_confirmation": 1 },
    "priority_thresholds": { "high": "总分 >= 4.5", "medium": "总分 2.0-4.4", "low": "总分 < 2.0" }
  },
  "metadata": {
    "version": "3.0",
    "generated_at": "2026-05-14T21:00:00Z",
    "source_files": [
      "output/pm-discovery/user-research-voice-analysis/voice-analysis.json",
      "output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json"
    ]
  }
}
```

## 决策规则

1. **Emotional/Social Job低置信度升级**：置信度 < 0.5 标记需人类验证，列入needs_human_validation
2. **Functional Job缺失**：未提取到任何Functional Job时终止分析，返回错误提示补充数据
3. **5Whys连续低置信度终止**：连续2层置信度 < 0.3 终止追问，标记needs_human_validation=true
4. **5Whys多路径分叉**：Top1和Top2原因置信度差距 < 0.15 时分叉为两条因果链并行分析
5. **KANO低置信度升级**：分类置信度 < 0.7 标记needs_human_judgment=true，升级人类判定
6. **KANO反向型标记**：正向提及率 < 10% 且负向提及率 > 70% 标记为"reverse"类型
7. **优先级评分权重需人类确认**：首次执行或权重调整后，暂停评分输出等待人类确认
8. **可解决性需技术输入**：未获技术团队确认时使用默认值3，标记confirmed=false，score_confidence强制为low
9. **反向型功能**：KANO分类为Reverse时总分归零，标注"不建议实施"
10. **本质需求低置信度强制验证**：置信度 < 0.5 必须标记validation_needed=true，升级人类验证

## 质量检查

| 检查项 | 通过条件 |
|--------|----------|
| JTBD三层Job均已提取 | functional/emotional/social Job均存在 |
| 每个Job有数据支撑 | evidence字段非空 |
| 低置信度Job已标记验证 | confidence<0.5的Job在needs_human_validation中 |
| 需求三层均已拆解 | surface/behavioral/essential均有内容 |
| 推断依据非空 | inference_basis字段非空 |
| 本质需求已标记验证状态 | validation_needed字段完整 |
| 因果链完整 | 从现象到根因逻辑连贯 |
| 根因有数据支撑 | 至少1条evidence |
| 可行动建议已给出 | actionable_fix非空，含effort/impact/suggested_metrics |
| 所有功能需求已分类 | kano_classification完整 |
| 边界情况已标记 | confidence<0.7的在boundary_cases中 |
| 分类统计summary完整 | summary中各类型数量之和等于kano_classification数组长度 |
| 所有需求已评分 | priority_list完整 |
| 评分结果按优先级降序排列 | rank字段正确 |
| 评分可信度等级已标注 | score_confidence字段完整 |
| base_score和kano_bonus分别计算 | 可审计 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|----------|
| voice-analysis.json | 基于用户直接粘贴的反馈文本提取JTBD和KANO分类 | Emotional/Social Job推断依据减少，KANO分类置信度降低 |
| behavior-analysis.json | 基于用户反馈文本推断行为意图 | Functional Job缺乏行为数据佐证，频率统计不精确 |
| voice-analysis.json + behavior-analysis.json | 用户提供反馈文本 → 直接提取JTBD | 整体置信度降低，frequency为估算值 |
| 原始需求列表 | 用户口述需求 → 直接拆解三层 | inference_basis缺失数据佐证，行为需求置信度上限降至0.7 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述执行轻量版分析 | 输出为轻量版，JTBD仅含Functional Job，KANO全部分类为推断结果，priority_scoring多个维度使用默认值 |

## 数据获取说明

本Skill需要用户反馈和行为分析数据，请通过以下方式之一提供：
  1. 直接粘贴用户反馈文本和需求列表
  2. 上传voice-analysis.json / behavior-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游数据源 | 变更类型 | 影响维度 | 影响描述 | 响应策略 |
|-----------|----------|----------|----------|----------|
| voice-analysis.json | 新增反馈条目 | jtbd.jobs / kano.kano_classification | Job频率和证据变化，KANO分类指标变化 | 标注受影响的Job和KANO分类，建议人类确认是否需要重新提取 |
| voice-analysis.json | 情感分类修正 | jtbd.emotional_jobs | Emotional Job推断依据变化 | 标注受影响的Emotional Job，建议重新评估置信度 |
| behavior-analysis.json | 行为模式更新 | jtbd.functional_jobs / requirement_layers.behavioral | Functional Job频率和行为目标变化 | 标注受影响的Functional Job，更新frequency |
| 原始需求列表 | 需求增删 | requirement_layers / kano / priority_scoring | 需求拆解、分类和评分均受影响 | 标注新增/删除的需求，重新计算排名 |

### 下游通知机制表

| 下游消费者 | 通知字段 | 通知时机 | 通知内容 |
|-----------|----------|----------|----------|
| opportunity-definition | `jtbd.jobs` / `requirement_layers` | JTBD或需求分层变更后 | 通知Job增删和需求拆解变化 |
| design-orchestrator | `priority_scoring.priority_list` | 优先级排序变更后 | 通知排名变化的需求，建议重新评估开发排期 |

## 变更记录

- v3.0: 合并 insight-jtbd + insight-requirement-layers + insight-5whys + insight-kano + insight-priority-scoring 为 insight-analysis，整合4步骤为统一流程
