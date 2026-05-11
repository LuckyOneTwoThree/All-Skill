---
name: opportunity-brief
description: 当需要将前序所有产出组装为完整的机会简报时使用。Opportunity Brief自动生成，包含问题陈述、证据摘要、机会评分、HMW陈述、关键假设和推荐下一步。关键词：Opportunity Brief、机会简报、机会文档、产品机会总结、决策文档。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Opportunity Brief — 机会简报生成

## 核心原则

1. **Brief是决策文档不是数据堆砌**——每个字段必须服务于决策判断，无决策价值的数据不纳入
2. **假设风险驱动下一步**——关键假设及其风险等级决定推荐行动，高风险假设优先验证
3. **人类决策项不可省略**——所有需人类判断的事项必须显式列出，含决策上下文和紧急程度
4. **证据链可追溯**——每条证据必须可追溯到上游数据源，确保决策依据可审计

## 交互模式

🤖→👤 AI 建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 用户之声分析 | JSON | 是 | output/pm-discovery/user-research-voice-analysis/voice-analysis.json | 用户反馈与情感分析 |
| 行为分析 | JSON | 是 | output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json | 用户行为模式与痛点 |
| 用户画像 | JSON | 是 | output/pm-discovery/user-research-user-modeling/persona.json | 目标用户群体画像 |
| 待办任务 | JSON | 是 | output/pm-discovery/insight-jtbd/jtbd.json | 用户待办任务分析 |
| 需求分类 | JSON | 是 | output/pm-discovery/insight-kano/kano.json | Kano 模型需求分类 |
| 市场规模 | JSON | 是 | output/pm-discovery/market-tam-som/tam-som.json | TAM/SAM/SOM 估算 |
| 竞品情报 | JSON | 是 | output/pm-discovery/market-competitor-intel/competitor-intel.json | 竞品能力与壁垒分析 |
| 机会评分 | JSON | 是 | output/pm-discovery/opportunity-scoring/opportunity-scoring.json | 多维度加权评分结果 |
| HMW 陈述 | JSON | 是 | output/pm-discovery/opportunity-hmw/hmw.json | How Might We 陈述 |
| Problem Statement | JSON | 是 | output/pm-discovery/opportunity-problem-statement/problem-statement.json | 结构化问题陈述 |

## 执行步骤

### 结构定义

#### 1. title

机会简报标题，格式：`[目标用户群体] - [核心痛点摘要]`

#### 2. problem_statement

直接引用 `problem-statement.json` 中的 `problem_statement` 字段。

#### 3. evidence_summary

| 子字段 | 来源 | 说明 |
|--------|------|------|
| `user_research` | voice-analysis + behavior-analysis + persona + jtbd + kano | 用户研究证据摘要，包括痛点频率、行为印证、用户画像特征、核心任务、需求类型 |
| `market_analysis` | tam-som | 市场分析证据摘要，包括 TAM/SAM/SOM 估算及增长率 |
| `competitive_landscape` | competitor-intel | 竞争格局证据摘要，包括竞品能力、市场空白、壁垒分析 |

#### 4. opportunity_score

引用 `opportunity-scoring.json` 中的加权总分与各维度得分。

#### 5. hmw_statements

引用 `hmw.json` 中的 HMW 陈述列表，标注创新空间评分。

#### 6. key_assumptions

关键假设列表，每个假设包含：

| 子字段 | 类型 | 说明 |
|--------|------|------|
| `assumption` | string | 假设描述 |
| `type` | string | 假设类型（desirability / viability / feasibility / usability） |
| `testability` | string | 可验证性描述（如何验证该假设） |
| `risk_if_wrong` | string | 假设错误时的风险等级（高/中/低） |

#### 7. recommended_next_step

基于评分与假设分析，推荐的下一步行动。

#### 8. human_decisions_needed

需要人类决策的事项列表。

## 输出

输出文件：`output/pm-discovery/opportunity-brief/opportunity-brief.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["title", "problem_statement", "evidence_summary", "opportunity_score", "key_assumptions", "recommended_next_step"],
  "properties": {
    "title": {"type": "string", "description": "机会简报标题"},
    "problem_statement": {"type": "string", "description": "结构化问题陈述"},
    "evidence_summary": {"type": "object", "description": "证据摘要，含用户研究、市场分析和竞争格局"},
    "opportunity_score": {"type": "object", "description": "机会评分，含加权总分和各维度得分"},
    "hmw_statements": {"type": "array", "description": "HMW陈述列表"},
    "key_assumptions": {"type": "array", "description": "关键假设列表"},
    "recommended_next_step": {"type": "string", "description": "推荐的下一步行动"},
    "human_decisions_needed": {"type": "array", "description": "需人类决策的事项列表"},
    "metadata": {"type": "object", "description": "元数据，含版本、时间戳和来源文件"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| `title` | string | 是 | 机会简报标题，格式为[目标用户群体]-[核心痛点摘要]，不可为空 |
| `problem_statement` | string | 是 | 结构化问题陈述，不可为空，需可追溯到problem-statement.json |
| `evidence_summary` | object | 是 | 证据摘要，3个子字段均必须有内容 |
| `evidence_summary.user_research` | object | 是 | 用户研究证据，需包含痛点频率和行为印证 |
| `evidence_summary.market_analysis` | object | 是 | 市场分析证据，需包含SOM估算 |
| `evidence_summary.competitive_landscape` | object | 是 | 竞争格局证据，需包含市场空白分析 |
| `opportunity_score` | object | 是 | 机会评分，weighted_total不可为null（需人类已完成战略契合度评分） |
| `opportunity_score.weighted_total` | number | 是 | 加权总分，不可为null |
| `opportunity_score.dimensions` | object | 是 | 各维度得分，5个维度均需有score值 |
| `hmw_statements` | array | 是 | HMW陈述列表，不可为空数组 |
| `hmw_statements[].id` | string | 是 | HMW唯一标识 |
| `hmw_statements[].statement` | string | 是 | HMW陈述文本 |
| `hmw_statements[].innovation_space` | number | 是 | 创新空间评分1-5 |
| `key_assumptions` | array | 是 | 关键假设列表，不可为空数组 |
| `key_assumptions[].assumption` | string | 是 | 假设描述，不可为空 |
| `key_assumptions[].type` | string | 是 | 假设类型，必须为desirability/viability/feasibility/usability之一 |
| `key_assumptions[].testability` | string | 是 | 可验证性描述，不可为空 |
| `key_assumptions[].risk_if_wrong` | string | 是 | 风险等级，必须为高/中/低之一 |
| `recommended_next_step` | string | 是 | 推荐下一步，必须基于评分和假设风险分析，不可凭空建议 |
| `human_decisions_needed` | array | 是 | 人类决策事项列表，高风险假设必须有对应决策项 |
| `human_decisions_needed[].item` | string | 是 | 决策事项，不可为空 |
| `human_decisions_needed[].context` | string | 是 | 决策上下文，不可为空 |
| `human_decisions_needed[].urgency` | string | 是 | 紧急程度，必须为高/中/低之一 |
| `metadata.version` | string | 是 | 版本号 |
| `metadata.generated_at` | string | 是 | 生成时间戳，ISO 8601格式 |
| `metadata.source_files` | array | 是 | 来源文件列表，不可为空数组 |

```json
{
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
    {
      "id": "hmw-001",
      "statement": "我们如何消除新用户在首次配置场景下的认知负担障碍？",
      "innovation_space": 4
    },
    {
      "id": "hmw-002",
      "statement": "我们如何让报表生成体验变得更快速？",
      "innovation_space": 3
    }
  ],
  "key_assumptions": [
    {
      "assumption": "目标用户愿意为自动核对功能付费",
      "type": "viability",
      "testability": "通过付费意愿调研或MVP定价测试验证",
      "risk_if_wrong": "高"
    },
    {
      "assumption": "多渠道数据接口可统一标准化",
      "type": "feasibility",
      "testability": "通过技术预研验证3-5个主流渠道的数据接口",
      "risk_if_wrong": "高"
    },
    {
      "assumption": "用户能接受自动核对结果的准确率在95%以上",
      "type": "desirability",
      "testability": "通过可用性测试验证用户对准确率的接受阈值",
      "risk_if_wrong": "中"
    }
  ],
  "recommended_next_step": "建议进入解决方案探索阶段，优先验证高风险假设（付费意愿与数据接口标准化），可通过烟雾测试与技术预研并行推进。",
  "human_decisions_needed": [
    {
      "item": "确认战略契合度评分",
      "context": "AI建议评分4，需人类确认是否与公司战略方向一致",
      "urgency": "高"
    },
    {
      "item": "确认高风险假设的验证优先级",
      "context": "2个高风险假设需决定验证顺序与资源分配",
      "urgency": "高"
    },
    {
      "item": "审批推荐下一步方案",
      "context": "是否进入解决方案探索阶段，以及验证方式选择",
      "urgency": "中"
    }
  ],
  "metadata": {
    "version": "1.0",
    "generated_at": "2026-05-08T18:00:00Z",
    "source_files": [
      "output/pm-discovery/user-research-voice-analysis/voice-analysis.json",
      "output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json",
      "output/pm-discovery/user-research-user-modeling/persona.json",
      "output/pm-discovery/insight-jtbd/jtbd.json",
      "output/pm-discovery/insight-kano/kano.json",
      "output/pm-discovery/market-tam-som/tam-som.json",
      "output/pm-discovery/market-competitor-intel/competitor-intel.json",
      "output/pm-discovery/opportunity-scoring/opportunity-scoring.json",
      "output/pm-discovery/opportunity-hmw/hmw.json",
      "output/pm-discovery/opportunity-problem-statement/problem-statement.json"
    ]
  }
}
```

## 决策规则

1. **关键假设风险等级"高"的必须标注**：`risk_if_wrong` 为"高"的假设必须在 `human_decisions_needed` 中列出对应的决策项
2. **人类决策项必须列出**：所有需要人类判断的事项均需在 `human_decisions_needed` 中明确列出，包含决策项、上下文和紧急程度
3. **推荐下一步需基于数据**：`recommended_next_step` 必须基于评分结果与假设风险分析，不能凭空建议

## 质量检查

| 检查项 | 通过条件 |
|--------|----------|
| 所有证据摘要已填充 | `evidence_summary` 的3个子字段均有内容 |
| 关键假设已列出可验证性 | 每个 `key_assumptions` 的 `testability` 非空 |
| 人类决策项已明确 | `human_decisions_needed` 非空且每项包含 item/context/urgency |
| 高风险假设有对应决策项 | `risk_if_wrong` 为"高"的假设在 `human_decisions_needed` 中有对应项 |
| 机会评分完整 | `opportunity_score.weighted_total` 非空且各维度得分完整 |
| HMW 陈述已引用 | `hmw_statements` 非空 |
| Problem Statement 已引用 | `problem_statement` 非空 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|----------|
| voice-analysis.json / behavior-analysis.json | 用户提供机会描述 → 生成简化版Brief，证据摘要部分基于用户描述填充 | `evidence_summary.user_research` 基于用户描述，缺乏痛点频率和行为印证数据，决策可信度降低 |
| persona.json / jtbd.json / kano.json | 用户提供机会描述 → 生成简化版Brief，标注"缺乏用户画像和需求分类数据" | `evidence_summary.user_research` 缺乏persona_summary/core_jobs/need_type，假设分析缺乏用户洞察支撑 |
| tam-som.json / competitor-intel.json | 用户提供机会描述 → 生成简化版Brief，市场分析和竞品分析部分基于用户描述 | `evidence_summary.market_analysis` 和 `competitive_landscape` 基于用户估算，缺乏SOM和竞品能力数据 |
| opportunity-scoring.json / hmw.json / problem-statement.json | 用户提供机会描述 → 生成简化版Brief，核心内容基于用户描述填充 | `opportunity_score` 缺乏结构化评分，`hmw_statements` 为空，`problem_statement` 为用户描述，`human_decisions_needed` 大幅增加 |
| 多个前序文件缺失 | 用户提供机会描述 → 生成简化版Brief，标注各缺失数据源 | 多个字段基于用户描述，`evidence_summary` 大面积缺失，`key_assumptions` 可信度极低，Brief决策价值大幅降低 |

数据获取说明：
- 本Skill需要多个前序阶段的数据，请通过以下方式之一提供：
  1. 直接描述产品机会、目标用户和核心痛点
  2. 上传前序阶段输出的JSON文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游数据源 | 变更类型 | 影响维度 | 影响描述 | 响应策略 |
|-----------|----------|----------|----------|----------|
| voice-analysis.json | 痛点频率或情感数据更新 | evidence_summary.user_research | 用户研究证据摘要需更新 | 更新user_research子字段，重新评估key_assumptions |
| behavior-analysis.json | 行为模式数据更新 | evidence_summary.user_research | 行为印证数据需更新 | 更新behavioral_evidence，重新评估假设风险 |
| persona.json | 用户画像调整 | evidence_summary.user_research / problem_statement | 用户群体描述可能变化 | 更新persona_summary，评估problem_statement是否需同步更新 |
| jtbd.json | 待办任务变更 | evidence_summary.user_research | 核心任务描述需更新 | 更新core_jobs，重新评估desirability类假设 |
| kano.json | 需求分类调整 | evidence_summary.user_research | 需求类型描述需更新 | 更新need_type，重新评估假设优先级 |
| tam-som.json | 市场规模估算调整 | evidence_summary.market_analysis | TAM/SAM/SOM数据需更新 | 更新market_analysis，重新评估viability类假设 |
| competitor-intel.json | 竞品能力变更 | evidence_summary.competitive_landscape | 竞争格局和壁垒分析需更新 | 更新competitive_landscape，重新评估竞争壁垒相关假设 |
| opportunity-scoring.json | 评分结果更新 | opportunity_score / recommended_next_step | 加权总分和排名变化影响推荐行动 | 更新opportunity_score，重新生成recommended_next_step |
| hmw.json | HMW陈述变更 | hmw_statements | HMW列表需同步更新 | 更新hmw_statements，评估创新空间分布变化 |
| problem-statement.json | Problem Statement变更 | problem_statement | 问题陈述需同步更新 | 更新problem_statement，评估是否影响key_assumptions |

### 下游通知机制表

| 下游消费者 | 通知字段 | 通知时机 | 通知内容 |
|-----------|----------|----------|----------|
| 决策层/利益相关方 | `title` / `opportunity_score.weighted_total` | Brief核心结论变更后 | 通知机会简报标题和评分变化，提示需重新审阅 |
| 后续阶段（解决方案探索） | `recommended_next_step` / `key_assumptions` | 推荐行动或假设变更后 | 通知下一步行动调整及需验证的假设变化 |
