---
name: opportunity-hmw
description: 当需要基于Problem Statement和用户研究数据生成How Might We陈述时使用。HMW陈述自动生成，从消除障碍、提升体验、创造新价值、重新定义四个维度发散。关键词：HMW、How Might We、问题重构、创新空间、机会发散。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Opportunity HMW — HMW 陈述生成

## 核心原则

1. **数据优先人工补充**——AI处理大规模数据，人类补充定性洞察
2. **显式规则拒绝模糊**——所有分类/判断规则必须可编码
3. **批量并行规模优势**——能并行的步骤不串行
4. **标注置信度分级交付**——所有推断标注置信度，<0.5升级人类

## 交互模式

🤖→👤 AI 建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| problem-statement.json | JSON | 是 | output/pm-discovery/opportunity-problem-statement/problem-statement.json | Problem Statement 文本及数据支撑 |
| 用户研究数据 | JSON | 是 | output/pm-discovery/user-research-voice-analysis/voice-analysis.json / output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 用户痛点、行为数据、期望数据 |

## 执行步骤

### 生成维度

从以下4个维度生成 HMW 陈述，每个维度2-3个：

#### 维度1：消除障碍

**模板**："我们如何消除/减少[用户在XX场景下的XX障碍]？"

**生成要点**：
- 聚焦用户当前面临的具体阻碍
- 障碍需有用户研究数据支撑
- 避免直接跳入解决方案

**示例**：
- "我们如何消除新用户在首次配置场景下的认知负担障碍？"
- "我们如何减少中小企业在数据迁移场景下的技术门槛障碍？"

#### 维度2：提升体验

**模板**："我们如何让[XX体验]变得更[简单/快速/愉悦]？"

**生成要点**：
- 聚焦已有但体验不佳的环节
- 体验改善方向需有行为数据印证
- 量化改善目标（如"从5步简化为2步"）

**示例**：
- "我们如何让报表生成体验变得更快速（从10分钟缩短至2分钟）？"
- "我们如何让团队协作审批体验变得更简单？"

#### 维度3：创造新价值

**模板**："我们如何帮助[XX用户]实现[他们尚未表达的XX期望]？"

**生成要点**：
- 挖掘用户未明确表达但行为数据暗示的需求
- 基于用户研究中的隐性模式
- 关注用户"想要但说不出来"的部分

**示例**：
- "我们如何帮助内容创作者实现他们尚未表达的跨平台统一管理期望？"
- "我们如何帮助运营人员实现他们尚未表达的自动化决策建议期望？"

#### 维度4：重新定义

**模板**："如果我们重新思考[XX流程]，会怎样？"

**生成要点**：
- 挑战现有流程的基本假设
- 借鉴跨行业创新模式
- 鼓励突破性思维

**示例**：
- "如果我们重新思考用户入职流程，会怎样？"
- "如果我们重新思考客户服务响应机制，会怎样？"

## 输出

输出文件：`output/pm-discovery/opportunity-hmw/hmw.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["hmw_statements", "dimension_coverage", "metadata"],
  "properties": {
    "hmw_statements": {"type": "array", "description": "HMW陈述列表，含维度、创新空间和置信度"},
    "dimension_coverage": {"type": "object", "description": "各维度HMW数量统计"},
    "metadata": {"type": "object", "description": "元数据，含总数和来源引用"}
  }
}
```

```json
{
  "hmw_statements": [
    {
      "id": "hmw-001",
      "statement": "我们如何消除新用户在首次配置场景下的认知负担障碍？",
      "dimension": "eliminate_barriers",
      "problem_ref": "problem-statement.json::core_pain_point",
      "data_source": "voice-analysis.json::pain_point_frequency=12%",
      "innovation_space": 4,
      "confidence": 0.85
    },
    {
      "id": "hmw-002",
      "statement": "我们如何让报表生成体验变得更快速？",
      "dimension": "enhance_experience",
      "problem_ref": "problem-statement.json::current_solution_gap",
      "data_source": "behavior-analysis.json::avg_report_time=10min",
      "innovation_space": 3,
      "confidence": 0.90
    }
  ],
  "dimension_coverage": {
    "eliminate_barriers": 3,
    "enhance_experience": 3,
    "create_value": 3,
    "redefine": 2
  },
  "metadata": {
    "total_count": 11,
    "high_innovation_count": 4,
    "source_problem_statement": "output/pm-discovery/opportunity-problem-statement/problem-statement.json"
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | HMW 唯一标识 |
| `statement` | string | HMW 陈述文本 |
| `dimension` | string | 所属维度（eliminate_barriers / enhance_experience / create_value / redefine） |
| `problem_ref` | string | 关联的 Problem Statement 字段引用 |
| `data_source` | string | 数据来源引用 |
| `innovation_space` | number | 创新空间评分（1-5），5=最大创新空间 |
| `confidence` | number | 置信度（0-1），基于数据支撑强度 |

### 产出要求

- 总计生成 **8-12个** HMW 陈述
- 每个维度至少 **2个** HMW 陈述
- 4个维度全部覆盖

## 决策规则

1. **创新空间 ≥ 4 的 HMW 需人类重点审核**：这些陈述可能带来突破性创新，但也可能偏离核心问题，需人类判断方向性
2. **创新空间 < 3 的 HMW 可快速通过**：这些陈述偏向渐进式改进，风险较低
3. **每个维度至少保留1个 HMW**：确保机会探索的全面性

## 质量检查

| 检查项 | 通过条件 |
|--------|----------|
| 4个维度都已覆盖 | `dimension_coverage` 中4个维度均 ≥ 1 |
| 每个 HMW 有数据支撑 | 每个 HMW 的 `data_source` 非空 |
| HMW 陈述避免解决方案预设 | 陈述中不包含具体产品功能或技术方案描述 |
| 创新空间评分合理 | `innovation_space` 在1-5范围内 |
| 置信度评分合理 | `confidence` 在0-1范围内 |
| 总数符合要求 | `total_count` 在8-12范围内 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| problem-statement.json | 用户描述问题 → 直接生成HMW，标注"缺乏结构化Problem Statement" |
| 用户研究数据（voice-analysis / behavior-analysis） | 基于用户描述的问题直接生成HMW，标注"缺乏用户研究数据支撑" |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述的问题直接生成HMW |

数据获取说明：
- 本Skill需要Problem Statement和用户研究数据，请通过以下方式之一提供：
  1. 直接描述问题和用户痛点
  2. 上传problem-statement.json / voice-analysis.json / behavior-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
