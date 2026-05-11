---
name: opportunity-problem-statement
description: 当需要基于用户研究数据和需求洞察生成结构化问题陈述时使用。Problem Statement自动生成，包含目标用户、场景、痛点、现有方案不足和预期收益。关键词：Problem Statement、问题陈述、痛点定义、用户问题、机会定义。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Opportunity Problem Statement — Problem Statement 生成

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
| 用户研究数据 | JSON | 是 | output/pm-discovery/user-research-voice-analysis/voice-analysis.json / output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 用户痛点、行为数据、期望数据 |
| 需求洞察数据 | JSON | 是 | output/pm-discovery/user-research-user-modeling/persona.json / output/pm-discovery/insight-jtbd/jtbd.json / output/pm-discovery/insight-kano/kano.json | 用户画像、待办任务、需求分类 |
| 机会评分数据 | JSON | ○ | output/pm-discovery/opportunity-scoring/opportunity-scoring.json | 已评分的机会信息 |

## 执行步骤

### 生成模板

**结构化模板**：

> [目标用户群体] 在 [场景] 下，需要 [完成什么任务]，但当前面临 [核心痛点]，因为 [现有方案的不足]，如果这个问题被解决，他们将 [预期收益]。

**数据支撑要求**：每个关键要素必须附带数据证据。

#### 模板要素拆解

| 要素 | 说明 | 数据要求 |
|------|------|----------|
| 目标用户群体 | 具体的用户群体描述，不能是"用户"泛称 | 需关联 persona 数据 |
| 场景 | 用户所处的具体使用场景 | 需有行为数据或访谈数据支撑 |
| 完成什么任务 | 用户需要达成的目标 | 需关联 JTBD 数据 |
| 核心痛点 | 用户面临的主要困难 | 需有痛点提及率数据 |
| 现有方案的不足 | 当前解决方案的缺陷 | 需有竞品分析或用户反馈数据 |
| 预期收益 | 问题解决后的预期效果 | 需可量化或可验证 |

## 输出

输出文件：`output/pm-discovery/opportunity-problem-statement/problem-statement.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["problem_statement", "data_support", "template_elements", "quality_check"],
  "properties": {
    "problem_statement": {"type": "string", "description": "完整的Problem Statement文本"},
    "data_support": {"type": "object", "description": "数据支撑，含痛点频率、行为证据和置信度"},
    "template_elements": {"type": "object", "description": "模板各要素拆解"},
    "quality_check": {"type": "object", "description": "5项质量检查结果"},
    "metadata": {"type": "object", "description": "元数据，含来源文件引用"}
  }
}
```

```json
{
  "problem_statement": "月活超过1000的SaaS产品运营人员，在月底结算高峰期，需要快速核对多渠道数据一致性，但当前面临手动比对耗时且易错的核心痛点，因为现有工具仅支持单渠道数据导出且缺乏自动校验能力，如果这个问题被解决，他们将把数据核对时间从平均4小时缩短至30分钟以内。",
  "data_support": {
    "pain_point_frequency": "12.3%",
    "behavioral_evidence": "78%的用户在月底会反复导出数据并手动比对",
    "confidence": 0.88
  },
  "template_elements": {
    "target_user": "月活超过1000的SaaS产品运营人员",
    "scenario": "月底结算高峰期",
    "task": "快速核对多渠道数据一致性",
    "core_pain": "手动比对耗时且易错",
    "current_gap": "现有工具仅支持单渠道数据导出且缺乏自动校验能力",
    "expected_benefit": "数据核对时间从平均4小时缩短至30分钟以内"
  },
  "quality_check": {
    "specific_user_group": {
      "passed": true,
      "detail": "指定了'月活超过1000的SaaS产品运营人员'"
    },
    "specific_scenario": {
      "passed": true,
      "detail": "指定了'月底结算高峰期'"
    },
    "current_solution_gap": {
      "passed": true,
      "detail": "描述了'仅支持单渠道数据导出且缺乏自动校验能力'"
    },
    "verifiable": {
      "passed": true,
      "detail": "预期收益可量化：4小时→30分钟"
    },
    "no_solution_preset": {
      "passed": true,
      "detail": "问题描述未包含具体解决方案"
    },
    "all_passed": true,
    "retry_count": 0
  },
  "metadata": {
    "source_persona": "output/pm-discovery/user-research-user-modeling/persona.json",
    "source_jtbd": "output/pm-discovery/insight-jtbd/jtbd.json",
    "source_scoring": "output/pm-discovery/opportunity-scoring/opportunity-scoring.json"
  }
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `problem_statement` | string | 完整的 Problem Statement 文本 |
| `data_support.pain_point_frequency` | string | 痛点提及率 |
| `data_support.behavioral_evidence` | string | 行为数据印证 |
| `data_support.confidence` | number | 置信度（0-1） |
| `template_elements` | object | 模板各要素拆解 |
| `quality_check` | object | 5项质量检查结果 |
| `quality_check.all_passed` | boolean | 是否全部通过 |
| `quality_check.retry_count` | number | 重试次数 |

## 决策规则

1. **质量检查不通过则自动修改重试**：根据未通过的检查项修复 Problem Statement，最多重试3次
2. **3次仍不通过升级人类**：将所有尝试版本及检查结果提交人类处理
3. **重试策略**：每次重试针对未通过项进行定向修复，保留已通过项不变

### 通过条件

| 检查项 | 通过条件 |
|--------|----------|
| 5项质量检查全部通过 | `quality_check.all_passed === true` |
| 数据支撑完整 | `pain_point_frequency`、`behavioral_evidence`、`confidence` 均非空 |
| 重试次数记录 | `retry_count` 准确反映重试次数 |

---

## 质量检查

生成后自动执行以下5项质量检查：

### 检查1：是否指定了具体用户群体？

- **通过**：用户群体描述具体（如"月活>1000的SaaS产品运营人员"）
- **不通过**：使用泛称（如"用户"、"客户"、"人们"）
- **修复策略**：从 persona 数据中提取具体用户群体描述替换

### 检查2：是否指定了具体场景？

- **通过**：场景描述具体且可观察（如"在月底结算高峰期"）
- **不通过**：场景模糊或缺失（如"在日常使用中"）
- **修复策略**：从行为数据中提取高频场景替换

### 检查3：是否描述了现有方案不足？

- **通过**：明确指出当前方案的1个或多个具体不足
- **不通过**：未提及现有方案或仅笼统说"不够好"
- **修复策略**：从竞品分析和用户反馈中提取具体不足

### 检查4：是否可验证？

- **通过**：预期收益可量化或可通过实验验证
- **不通过**：预期收益模糊（如"体验更好"、"更满意"）
- **修复策略**：将模糊收益替换为可量化指标

### 检查5：是否避免了解决方案预设？

- **通过**：问题描述不包含任何具体解决方案
- **不通过**：问题描述中隐含或明示了具体方案
- **修复策略**：移除方案描述，聚焦问题本身

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| 用户研究数据（voice-analysis / behavior-analysis） | 用户口述问题和用户群体 → 直接生成Problem Statement，标注"缺乏用户研究数据支撑" |
| 需求洞察数据（persona / jtbd / kano） | 基于用户描述直接生成，标注"缺乏需求洞察数据" |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述的问题和用户群体直接生成 |

数据获取说明：
- 本Skill需要用户研究和需求洞察数据，请通过以下方式之一提供：
  1. 直接描述目标用户群体、核心痛点和场景
  2. 上传persona.json / jtbd.json / voice-analysis.json等文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
