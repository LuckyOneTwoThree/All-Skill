---
name: opportunity-brief
description: 当需要将前序所有产出组装为完整的机会简报时使用。Opportunity Brief自动生成，包含问题陈述、证据摘要、机会评分、HMW陈述、关键假设和推荐下一步。关键词：Opportunity Brief、机会简报、机会文档、产品机会总结、决策文档。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Opportunity Brief — 机会简报生成

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

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| voice-analysis.json / behavior-analysis.json | 用户提供机会描述 → 生成简化版Brief，证据摘要部分基于用户描述填充 |
| persona.json / jtbd.json / kano.json | 用户提供机会描述 → 生成简化版Brief，标注"缺乏用户画像和需求分类数据" |
| tam-som.json / competitor-intel.json | 用户提供机会描述 → 生成简化版Brief，市场分析和竞品分析部分基于用户描述 |
| opportunity-scoring.json / hmw.json / problem-statement.json | 用户提供机会描述 → 生成简化版Brief，核心内容基于用户描述填充 |
| 多个前序文件缺失 | 用户提供机会描述 → 生成简化版Brief，标注各缺失数据源 |

数据获取说明：
- 本Skill需要多个前序阶段的数据，请通过以下方式之一提供：
  1. 直接描述产品机会、目标用户和核心痛点
  2. 上传前序阶段输出的JSON文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
