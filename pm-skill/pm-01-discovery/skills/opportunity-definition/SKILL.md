---
name: opportunity-definition
description: 机会识别与定义，整合机会评分、问题陈述、HMW发散和机会简报。关键词：机会识别、机会评估、HMW、Problem Statement、机会简报、产品机会。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我评估一下这个产品机会"
    - "识别一下有哪些产品机会"
    - "定义一下我们要解决的问题"
    - "生成机会简报"
    - "这个机会值不值得追"
    - "帮我换个角度思考问题"
  interaction_mode: "ai_suggest_human_approve"
---

# Opportunity Definition — 机会识别与定义

## 核心原则

1. **好机会是定义出来的**——机会不是客观存在等待发现的，而是通过评分验证、Problem Statement定义、HMW重构逐步定义出来的
2. **评分先于发散**——先评分确定机会优先级（scoring），再发散探索创新空间（hmw），顺序不可颠倒，否则HMW会发散到低价值方向
3. **Problem Statement是锚点**——所有HMW和Brief都锚定在Problem Statement上，Problem Statement质量不通过则后续输出不可信
4. **评分是建议不是决策**——AI输出为决策参考，最终优先级排序需人类综合判断；战略契合度维度必须人类判定
5. **发散优于收敛**——HMW生成阶段追求数量与广度，筛选留给人类审核；四维度缺一不可
6. **Brief是决策文档不是数据堆砌**——每个字段必须服务于决策判断，假设风险驱动下一步

## 交互模式

🤖→👤 AI 建议人类审批（机会评分阶段战略契合度维度 👤 由人类执行）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 用户研究数据 | JSON | 是 | output/pm-discovery/user-research-voice-analysis/voice-analysis.json / output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 用户痛点、行为数据、期望数据 |
| 市场分析数据 | JSON | 是 | output/pm-discovery/market-tam-som/tam-som.json | SOM 估算值 |
| 竞品分析数据 | JSON | 是 | output/pm-discovery/market-competitor-analysis/competitor-analysis.json | 竞品能力与壁垒分析 |
| 需求洞察数据 | JSON | ○ | output/pm-discovery/user-research-user-modeling/persona.json / output/pm-discovery/insight-analysis/insight-analysis.json | 用户画像、待办任务、需求分类 |
| 技术团队评估 | object | ○ | 用户提供 | 现有技术栈可实现性评估 |

## 执行步骤

### Step 1: 机会评分

对产品机会进行多维度量化评分，确定优先级。

**评分函数**：总分 = Σ(维度得分 × 维度权重)

#### 维度1：问题真实性（权重 0.30）

| 得分 | 标准 |
|------|------|
| 5 | 痛点提及率 > 10% 且行为数据印证 |
| 4 | 痛点提及率 > 10% 但无行为数据印证 |
| 3 | 痛点提及率 5%-10% 且行为数据印证 |
| 2 | 痛点提及率 5%-10% 但无行为数据印证 |
| 1 | 无直接数据，纯假设 |

#### 维度2：市场规模（权重 0.25）

| 得分 | 标准 |
|------|------|
| 5 | SOM > 1亿 |
| 4 | SOM 5000万-1亿 |
| 3 | SOM 1000万-5000万 |
| 2 | SOM 500万-1000万 |
| 1 | 无法估算 |

#### 维度3：解决可行性（权重 0.20）

| 得分 | 标准 |
|------|------|
| 5 | 现有技术栈可直接实现 |
| 4 | 现有技术栈需少量扩展 |
| 3 | 需引入新技术但团队有能力 |
| 2 | 需引入新技术且团队需学习 |
| 1 | 当前技术不可行 |

#### 维度4：战略契合度（权重 0.15）👤 人类判定

| 得分 | 标准 |
|------|------|
| 5 | 核心战略方向，高度契合 |
| 4 | 重要战略方向，较好契合 |
| 3 | 相关战略方向，部分契合 |
| 2 | 边缘战略方向，弱契合 |
| 1 | 不在战略方向内 |

> **注意**：AI 提供战略契合度分析建议，但最终得分必须由人类判定。AI 评分后此维度标记为 `needs_human: true`。

#### 维度5：竞争壁垒（权重 0.10）

| 得分 | 标准 |
|------|------|
| 5 | 竞品无此能力且短期难复制 |
| 4 | 竞品无此能力但中期可复制 |
| 3 | 竞品有部分能力但体验差 |
| 2 | 竞品有较好能力但未主导 |
| 1 | 竞品已领先 |

### Step 2: 问题陈述

基于评分结果和用户研究数据生成结构化 Problem Statement。

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

#### 质量检查（自动执行，不通过则修复重试，最多3次）

| 检查项 | 通过条件 | 修复策略 |
|--------|----------|----------|
| 是否指定了具体用户群体 | 用户群体描述具体，非泛称 | 从 persona 数据中提取具体用户群体描述替换 |
| 是否指定了具体场景 | 场景描述具体且可观察 | 从行为数据中提取高频场景替换 |
| 是否描述了现有方案不足 | 明确指出1个或多个具体不足 | 从竞品分析和用户反馈中提取具体不足 |
| 是否可验证 | 预期收益可量化或可通过实验验证 | 将模糊收益替换为可量化指标 |
| 是否避免了解决方案预设 | 问题描述不包含任何具体解决方案 | 移除方案描述，聚焦问题本身 |

### Step 3: HMW发散

基于 Problem Statement 和用户研究数据，从4个维度生成 HMW 陈述，每个维度2-3个：

#### 维度1：消除障碍

**模板**："我们如何消除/减少[用户在XX场景下的XX障碍]？"

- 聚焦用户当前面临的具体阻碍
- 障碍需有用户研究数据支撑
- 避免直接跳入解决方案

#### 维度2：提升体验

**模板**："我们如何让[XX体验]变得更[简单/快速/愉悦]？"

- 聚焦已有但体验不佳的环节
- 体验改善方向需有行为数据印证
- 量化改善目标

#### 维度3：创造新价值

**模板**："我们如何帮助[XX用户]实现[他们尚未表达的XX期望]？"

- 挖掘用户未明确表达但行为数据暗示的需求
- 基于用户研究中的隐性模式

#### 维度4：重新定义

**模板**："如果我们重新思考[XX流程]，会怎样？"

- 挑战现有流程的基本假设
- 借鉴跨行业创新模式
- 鼓励突破性思维

### Step 4: 机会简报

将前序所有产出组装为完整的机会简报。

#### 结构定义

| 字段 | 来源 | 说明 |
|------|------|------|
| title | 自动生成 | 格式：[目标用户群体] - [核心痛点摘要] |
| problem_statement | Step 2 输出 | 直接引用 Problem Statement 文本 |
| evidence_summary | 多源汇总 | 用户研究证据、市场分析证据、竞争格局证据 |
| opportunity_score | Step 1 输出 | 加权总分与各维度得分 |
| hmw_statements | Step 3 输出 | HMW 陈述列表，标注创新空间评分 |
| key_assumptions | 推断生成 | 关键假设列表，含类型/可验证性/风险等级 |
| recommended_next_step | 基于评分与假设分析 | 推荐的下一步行动 |
| human_decisions_needed | 推断生成 | 需人类决策的事项列表 |

## 输出

输出路径：`output/pm-discovery/opportunity-definition/`

输出文件：opportunity-definition.json + opportunity-definition.md

### 输出Schema

```json
{
  "type": "object",
  "required": ["scoring", "problem_statement", "hmw", "brief", "metadata"],
  "properties": {
    "scoring": {
      "type": "object",
      "required": ["opportunities", "metadata"],
      "properties": {
        "opportunities": {"type": "array", "description": "机会评分列表，详见输出校验规则→scoring校验"},
        "metadata": {"type": "object", "description": "评分元数据，含awaiting_human_input"}
      }
    },
    "problem_statement": {
      "type": "object",
      "required": ["problem_statement", "data_support", "template_elements", "quality_check"],
      "properties": {
        "problem_statement": {"type": "string", "description": "完整Problem Statement文本"},
        "data_support": {"type": "object", "description": "数据支撑，详见输出校验规则→problem_statement校验"},
        "template_elements": {"type": "object", "description": "模板6要素"},
        "quality_check": {"type": "object", "description": "5项质量检查结果"}
      }
    },
    "hmw": {
      "type": "object",
      "required": ["hmw_statements", "dimension_coverage"],
      "properties": {
        "hmw_statements": {"type": "array", "description": "HMW陈述列表，详见输出校验规则→hmw校验"},
        "dimension_coverage": {"type": "object", "description": "4维度覆盖统计"}
      }
    },
    "brief": {
      "type": "object",
      "required": ["title", "problem_statement", "evidence_summary", "opportunity_score", "hmw_statements", "key_assumptions", "recommended_next_step", "human_decisions_needed"],
      "properties": {
        "title": {"type": "string"},
        "evidence_summary": {"type": "object", "description": "3类证据摘要，详见输出校验规则→brief校验"},
        "key_assumptions": {"type": "array", "description": "关键假设列表，详见输出校验规则→brief校验"},
        "human_decisions_needed": {"type": "array", "description": "人类决策事项列表"}
      }
    },
    "metadata": {"type": "object", "description": "元数据，含版本、时间戳和来源文件"}
  }
}
```

### 输出校验规则

#### scoring 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `scoring.opportunities` | array | 是 | 机会评分列表，不可为空数组 |
| `scoring.opportunities[].name` | string | 是 | 机会名称，不可为空字符串 |
| `scoring.opportunities[].scores.{dimension}.score` | number\|null | 是 | 维度得分1-5，待人类判定时必须为null |
| `scoring.opportunities[].scores.{dimension}.weight` | number | 是 | 维度权重，5个维度权重之和必须等于1.00 |
| `scoring.opportunities[].scores.{dimension}.evidence` | string | 是 | 评分依据，不可为空字符串 |
| `scoring.opportunities[].scores.{dimension}.needs_human` | boolean | 是 | 是否需要人类判定，strategic_fit维度必须为true |
| `scoring.opportunities[].weighted_total` | number\|null | 是 | 加权总分，任一维度score为null时必须为null |
| `scoring.metadata.awaiting_human_input` | boolean | 是 | 是否有待人类输入，strategic_fit未评分时必须为true |

#### problem_statement 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `problem_statement.problem_statement` | string | 是 | 完整的Problem Statement文本，不可为空且不可包含具体解决方案 |
| `problem_statement.data_support.pain_point_frequency` | string | 是 | 痛点提及率，不可为空 |
| `problem_statement.data_support.behavioral_evidence` | string | 是 | 行为数据印证，不可为空 |
| `problem_statement.data_support.confidence` | number | 是 | 置信度0-1，低于0.5时需升级人类审核 |
| `problem_statement.template_elements.target_user` | string | 是 | 目标用户群体，不可使用泛称 |
| `problem_statement.template_elements.scenario` | string | 是 | 具体场景，不可为模糊描述 |
| `problem_statement.template_elements.task` | string | 是 | 用户需完成的任务，不可为空 |
| `problem_statement.template_elements.core_pain` | string | 是 | 核心痛点，不可为空 |
| `problem_statement.template_elements.current_gap` | string | 是 | 现有方案不足，需指出1个或多个具体不足 |
| `problem_statement.template_elements.expected_benefit` | string | 是 | 预期收益，需可量化或可验证 |
| `problem_statement.quality_check.all_passed` | boolean | 是 | 5项质量检查是否全部通过 |
| `problem_statement.quality_check.retry_count` | number | 是 | 重试次数，最大值为3 |

#### hmw 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `hmw.hmw_statements` | array | 是 | HMW陈述列表，数量必须在8-12范围内 |
| `hmw.hmw_statements[].id` | string | 是 | HMW唯一标识，格式为hmw-NNN |
| `hmw.hmw_statements[].statement` | string | 是 | HMW陈述文本，不可为空且不可包含具体解决方案 |
| `hmw.hmw_statements[].dimension` | string | 是 | 所属维度，必须为eliminate_barriers/enhance_experience/create_value/redefine之一 |
| `hmw.hmw_statements[].problem_ref` | string | 是 | 关联的Problem Statement字段引用，不可为空 |
| `hmw.hmw_statements[].data_source` | string | 是 | 数据来源引用，不可为空 |
| `hmw.hmw_statements[].innovation_space` | number | 是 | 创新空间评分1-5，≥4时需人类重点审核 |
| `hmw.hmw_statements[].confidence` | number | 是 | 置信度0-1 |
| `hmw.dimension_coverage` | object | 是 | 4个维度均必须出现且值≥1 |
| `hmw.dimension_coverage.eliminate_barriers` | number | 是 | 消除障碍维度HMW数量，≥2 |
| `hmw.dimension_coverage.enhance_experience` | number | 是 | 提升体验维度HMW数量，≥2 |
| `hmw.dimension_coverage.create_value` | number | 是 | 创造新价值维度HMW数量，≥2 |
| `hmw.dimension_coverage.redefine` | number | 是 | 重新定义维度HMW数量，≥2 |

#### brief 校验

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `brief.title` | string | 是 | 机会简报标题，格式为[目标用户群体]-[核心痛点摘要] |
| `brief.problem_statement` | string | 是 | 结构化问题陈述，不可为空 |
| `brief.evidence_summary.user_research` | object | 是 | 用户研究证据，需包含痛点频率和行为印证 |
| `brief.evidence_summary.market_analysis` | object | 是 | 市场分析证据，需包含SOM估算 |
| `brief.evidence_summary.competitive_landscape` | object | 是 | 竞争格局证据，需包含市场空白分析 |
| `brief.opportunity_score.weighted_total` | number | 是 | 加权总分，不可为null（需人类已完成战略契合度评分） |
| `brief.hmw_statements` | array | 是 | HMW陈述列表，不可为空数组 |
| `brief.key_assumptions` | array | 是 | 关键假设列表，不可为空数组 |
| `brief.key_assumptions[].assumption` | string | 是 | 假设描述，不可为空 |
| `brief.key_assumptions[].type` | string | 是 | 假设类型，必须为desirability/viability/feasibility/usability之一 |
| `brief.key_assumptions[].testability` | string | 是 | 可验证性描述，不可为空 |
| `brief.key_assumptions[].risk_if_wrong` | string | 是 | 风险等级，必须为高/中/低之一 |
| `brief.recommended_next_step` | string | 是 | 推荐下一步，必须基于评分和假设风险分析 |
| `brief.human_decisions_needed` | array | 是 | 人类决策事项列表，高风险假设必须有对应决策项 |
| `brief.human_decisions_needed[].item` | string | 是 | 决策事项，不可为空 |
| `brief.human_decisions_needed[].context` | string | 是 | 决策上下文，不可为空 |
| `brief.human_decisions_needed[].urgency` | string | 是 | 紧急程度，必须为高/中/低之一 |

### Output JSON 示例

```json
{
  "scoring": {
    "opportunities": [
      {
        "name": "多渠道数据核对自动化",
        "scores": {
          "problem_validity": { "score": 4, "weight": 0.30, "evidence": "痛点提及率12%，行为数据显示用户反复尝试解决", "needs_human": false },
          "market_size": { "score": 3, "weight": 0.25, "evidence": "SOM估算约3000万", "needs_human": false },
          "feasibility": { "score": 4, "weight": 0.20, "evidence": "现有技术栈需少量扩展", "needs_human": false },
          "strategic_fit": { "score": null, "weight": 0.15, "evidence": "AI分析：该机会与核心战略方向高度相关，建议评分4-5", "needs_human": true },
          "competitive_moat": { "score": 3, "weight": 0.10, "evidence": "竞品有部分能力但体验差", "needs_human": false }
        },
        "weighted_total": null,
        "provisional_rank": null
      }
    ],
    "metadata": {
      "scoring_version": "1.0",
      "awaiting_human_input": true,
      "pending_dimensions": ["strategic_fit"]
    }
  },
  "problem_statement": {
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
      "specific_user_group": { "passed": true, "detail": "指定了'月活超过1000的SaaS产品运营人员'" },
      "specific_scenario": { "passed": true, "detail": "指定了'月底结算高峰期'" },
      "current_solution_gap": { "passed": true, "detail": "描述了'仅支持单渠道数据导出且缺乏自动校验能力'" },
      "verifiable": { "passed": true, "detail": "预期收益可量化：4小时→30分钟" },
      "no_solution_preset": { "passed": true, "detail": "问题描述未包含具体解决方案" },
      "all_passed": true,
      "retry_count": 0
    }
  },
  "hmw": {
    "hmw_statements": [
      {
        "id": "hmw-001",
        "statement": "我们如何消除新用户在首次配置场景下的认知负担障碍？",
        "dimension": "eliminate_barriers",
        "problem_ref": "problem_statement.core_pain",
        "data_source": "voice-analysis.json::pain_point_frequency=12%",
        "innovation_space": 4,
        "confidence": 0.85
      },
      {
        "id": "hmw-002",
        "statement": "我们如何让报表生成体验变得更快速？",
        "dimension": "enhance_experience",
        "problem_ref": "problem_statement.current_gap",
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
      "high_innovation_count": 4
    }
  },
  "brief": {
    "title": "SaaS运营人员 - 多渠道数据核对耗时易错",
    "problem_statement": "月活超过1000的SaaS产品运营人员，在月底结算高峰期，需要快速核对多渠道数据一致性，但当前面临手动比对耗时且易错的核心痛点，因为现有工具仅支持单渠道数据导出且缺乏自动校验能力，如果这个问题被解决，他们将把数据核对时间从平均4小时缩短至30分钟以内。",
    "evidence_summary": {
      "user_research": {
        "pain_point_frequency": "12.3%用户提及此痛点",
        "behavioral_evidence": "78%目标用户月底反复手动导出比对",
        "persona_summary": "主要受影响群体为中型SaaS产品运营人员",
        "core_jobs": "数据核对、报表生成、异常排查",
        "need_type": "基本需求（Kano模型），缺失时强烈不满"
      },
      "market_analysis": {
        "tam": "50亿",
        "sam": "15亿",
        "som": "1.2亿",
        "growth_rate": "年增长率约25%"
      },
      "competitive_landscape": {
        "competitor_capabilities": "主流竞品仅支持单渠道数据管理",
        "market_gap": "多渠道数据自动核对能力缺失",
        "barrier_analysis": "数据集成能力构成一定壁垒"
      }
    },
    "opportunity_score": {
      "weighted_total": 3.85,
      "dimensions": {
        "problem_validity": { "score": 4, "weight": 0.30 },
        "market_size": { "score": 4, "weight": 0.25 },
        "feasibility": { "score": 4, "weight": 0.20 },
        "strategic_fit": { "score": 4, "weight": 0.15 },
        "competitive_moat": { "score": 3, "weight": 0.10 }
      }
    },
    "hmw_statements": [
      { "id": "hmw-001", "statement": "我们如何消除新用户在首次配置场景下的认知负担障碍？", "innovation_space": 4 },
      { "id": "hmw-002", "statement": "我们如何让报表生成体验变得更快速？", "innovation_space": 3 }
    ],
    "key_assumptions": [
      { "assumption": "目标用户愿意为自动核对功能付费", "type": "viability", "testability": "通过付费意愿调研或MVP定价测试验证", "risk_if_wrong": "高" },
      { "assumption": "多渠道数据接口可统一标准化", "type": "feasibility", "testability": "通过技术预研验证3-5个主流渠道的数据接口", "risk_if_wrong": "高" }
    ],
    "recommended_next_step": "建议进入解决方案探索阶段，优先验证高风险假设（付费意愿与数据接口标准化），可通过烟雾测试与技术预研并行推进。",
    "human_decisions_needed": [
      { "item": "确认战略契合度评分", "context": "AI建议评分4，需人类确认是否与公司战略方向一致", "urgency": "高" },
      { "item": "确认高风险假设的验证优先级", "context": "2个高风险假设需决定验证顺序与资源分配", "urgency": "高" }
    ]
  },
  "metadata": {
    "version": "3.0",
    "generated_at": "2026-05-14T21:00:00Z",
    "source_files": [
      "output/pm-discovery/user-research-voice-analysis/voice-analysis.json",
      "output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json",
      "output/pm-discovery/market-tam-som/tam-som.json",
      "output/pm-discovery/market-competitor-analysis/competitor-analysis.json"
    ]
  }
}
```

## 决策规则

1. **战略契合度必须人类判定**：AI 仅提供分析建议，不自动评分；加权总分待人类判定后计算
2. **Problem Statement质量检查不通过则自动修改重试**：根据未通过的检查项定向修复，最多重试3次，3次仍不通过升级人类
3. **创新空间 ≥ 4 的 HMW 需人类重点审核**：这些陈述可能带来突破性创新，但也可能偏离核心问题
4. **创新空间 < 3 的 HMW 可快速通过**：偏向渐进式改进，风险较低
5. **每个维度至少保留1个 HMW**：确保机会探索的全面性
6. **关键假设风险等级"高"的必须标注**：`risk_if_wrong` 为"高"的假设必须在 `human_decisions_needed` 中列出对应的决策项
7. **推荐下一步需基于数据**：必须基于评分结果与假设风险分析，不能凭空建议

## 质量检查

| 检查项 | 通过条件 |
|--------|----------|
| 机会评分完整 | 5个维度均有 score 值或标记为 needs_human，战略契合度标记为 needs_human |
| 评分依据完整 | 每个维度的 evidence 字段非空 |
| 权重一致性 | 5个维度权重之和 = 1.00 |
| Problem Statement 5项质量检查全部通过 | `quality_check.all_passed === true` |
| 数据支撑完整 | pain_point_frequency、behavioral_evidence、confidence 均非空 |
| HMW 4个维度都已覆盖 | `dimension_coverage` 中4个维度均 ≥ 1 |
| 每个 HMW 有数据支撑 | 每个 HMW 的 `data_source` 非空 |
| HMW 陈述避免解决方案预设 | 陈述中不包含具体产品功能或技术方案描述 |
| HMW 总数符合要求 | `total_count` 在8-12范围内 |
| 所有证据摘要已填充 | `evidence_summary` 的3个子字段均有内容 |
| 关键假设已列出可验证性 | 每个 `key_assumptions` 的 `testability` 非空 |
| 人类决策项已明确 | `human_decisions_needed` 非空且每项包含 item/context/urgency |
| 高风险假设有对应决策项 | `risk_if_wrong` 为"高"的假设在 `human_decisions_needed` 中有对应项 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|----------|
| 用户研究数据（voice-analysis / behavior-analysis） | 用户描述机会 → 基于描述评分和生成Problem Statement | `problem_validity.score` 降为默认值2，`data_support.pain_point_frequency` 为用户估算值，`confidence`<0.5 |
| 市场分析数据（tam-som） | 用户描述机会 → 市场规模维度基于用户估算评分 | `market_size.score` 基于用户估算，`evidence` 标注"缺乏市场数据" |
| 竞品分析数据（competitor-analysis） | 用户描述机会 → 竞争壁垒维度基于用户描述评分 | `competitive_moat.score` 基于用户描述，`evidence` 标注"缺乏竞品数据" |
| 需求洞察数据（persona / insight-analysis） | 基于用户描述直接生成 | `template_elements.target_user` 可能使用泛称，`quality_check.specific_user_group` 可能不通过 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述的机会直接执行 | 多个维度使用默认值，`weighted_total` 可信度极低，`quality_check` 多项可能不通过，Brief决策价值大幅降低 |

## 数据获取说明

本Skill需要用户研究、市场分析和竞品分析数据，请通过以下方式之一提供：
  1. 直接描述机会、目标用户和核心痛点
  2. 上传voice-analysis.json / tam-som.json / competitor-analysis.json等文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游数据源 | 变更类型 | 影响维度 | 影响描述 | 响应策略 |
|-----------|----------|----------|----------|----------|
| voice-analysis.json | 痛点提及率更新 | scoring.problem_validity / problem_statement.data_support | 痛点频率变化影响评分和Problem Statement | 重新计算problem_validity得分，更新data_support和core_pain |
| behavior-analysis.json | 行为模式数据更新 | scoring.problem_validity / hmw.enhance_experience | 行为数据变化影响评分和HMW | 重新评估行为印证，更新受影响HMW的data_source和confidence |
| tam-som.json | SOM估算值调整 | scoring.market_size / brief.evidence_summary.market_analysis | SOM数值变化影响评分和Brief | 重新计算market_size得分，更新Brief市场分析证据 |
| competitor-analysis.json | 竞品能力变更 | scoring.competitive_moat / brief.evidence_summary.competitive_landscape | 竞品变化影响评分和Brief | 重新计算competitive_moat得分，更新Brief竞争格局证据 |
| persona.json | 用户画像调整 | problem_statement.template_elements.target_user | 用户群体定义变化 | 更新target_user，重新执行specific_user_group检查 |
| insight-analysis.json | 洞察分析变更 | problem_statement.template_elements.task | 用户任务定义变化 | 更新task要素，重新执行质量检查 |

### 下游通知机制表

| 下游消费者 | 通知字段 | 通知时机 | 通知内容 |
|-----------|----------|----------|----------|
| 决策层/利益相关方 | `brief.title` / `scoring.opportunities[].weighted_total` | Brief核心结论变更后 | 通知机会简报标题和评分变化，提示需重新审阅 |
| 后续阶段（解决方案探索） | `brief.recommended_next_step` / `brief.key_assumptions` | 推荐行动或假设变更后 | 通知下一步行动调整及需验证的假设变化 |

## 变更记录

- v3.0: 合并 opportunity-scoring + opportunity-problem-statement + opportunity-hmw + opportunity-brief 为 opportunity-definition，整合4步骤为统一流程
