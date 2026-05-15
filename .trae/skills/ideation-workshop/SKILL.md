---
name: ideation-workshop
description: 创意工作坊，整合多方法发散（HMW/SCAMPER/反转思维）和创意收敛。关键词：创意发散、创意收敛、HMW、SCAMPER、反转思维、创意工作坊。
metadata:
  module: "产品构思与设计"
  sub-module: "创意发散与方案构思"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["互联网", "软件", "通用"]
  trigger_examples:
    - "帮我发散创意"
    - "用SCAMPER方法创新"
    - "逆向思考一下"
    - "方案太多选哪个"
    - "头脑风暴一下"
    - "创意工作坊"
  interaction_mode: "ai_suggest_human_approve"
---

# 创意工作坊

## 核心原则

1. **问题比答案更重要**——HMW的质量决定后续方案的质量，宽泛和预设方案的HMW是创意的毒药
2. **七维度是发散的保险**——SCAMPER七个维度确保思维不陷入单一模式，每个维度至少2个方案
3. **失败比成功更有启发性**——先想清楚"为什么会死"，再想"怎么活"；约束是创意的护栏不是枷锁
4. **收敛不是淘汰而是深化**——筛选出的方案必须经过完整深化，而非简单排序
5. **人类决策权不可让渡**——AI提供分析和推荐，方案最终选择必须由人类决策
6. **数量先于质量**——发散阶段追求方案数量，收敛阶段再筛选，早期判断是创意的敌人

创意工作坊整合了HMW问题重构、SCAMPER结构化发散、反转思维和创意收敛四种方法，形成完整的"发散→收敛"创意流程。Step 1 通过HMW将问题陈述转化为开放性问题；Step 2 并行执行SCAMPER和反转思维，最大化发散产出；Step 3 通过筛选、深化和对比矩阵完成创意收敛，为人类决策提供结构化支撑。

### 执行角色

🤖→👤 **AI建议，人类审批**

- **AI负责**：HMW生成、SCAMPER方案生成、反转思维分析、方案筛选、深化分析、对比矩阵生成
- **人类负责**：HMW审批、最终方案选择、优先级确认、行动项决策

---

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| Problem Statement | string | 是 | 用户提供 / 上游产出 | 清晰、具体地描述需要解决的问题，避免过于抽象或宽泛 |
| User Research Data | JSON/object | 是 | 用户提供 / 上游产出 | 包含至少一种类型的用户研究数据（访谈、问卷或行为数据），确保HMW生成有据可依 |
| Current Solution | JSON/object | ○ | 用户提供 | 当前产品的现有方案描述，包括功能点和局限性 |
| Competitor Solutions | JSON/array | ○ | 用户提供 | 至少2-3个竞品的方案分析，包括功能、优劣势 |
| Product Context | JSON/object | ○ | 用户提供 | 产品战略和资源约束信息 |

### 输入格式

```json
{
  "problem_statement": "需要解决的核心问题描述",
  "user_research_data": {
    "interviews": [
      {
        "user_id": "用户标识",
        "quotes": ["用户原话引用"],
        "pain_points": ["痛点描述"],
        "context": "使用场景"
      }
    ],
    "surveys": [
      {
        "question": "调研问题",
        "responses": ["用户回答"],
        "insights": ["关键洞察"]
      }
    ],
    "behavior_data": {
      "metrics": "行为数据指标",
      "patterns": ["用户行为模式"]
    }
  },
  "current_solution": {
    "description": "当前产品方案的详细描述",
    "features": ["功能1", "功能2"],
    "limitations": ["当前方案的局限性"]
  },
  "competitor_solutions": [
    {
      "competitor_name": "竞品名称",
      "solution_description": "竞品方案描述",
      "key_features": ["关键功能1", "关键功能2"],
      "strengths": ["优势1", "优势2"],
      "weaknesses": ["劣势1", "劣势2"]
    }
  ],
  "product_context": {
    "strategic_goals": ["战略目标1", "战略目标2"],
    "resource_constraints": ["资源约束1", "资源约束2"],
    "timeline": "时间限制",
    "risk_tolerance": "风险偏好"
  }
}
```

---

## 执行步骤

### Step 1：HMW问题重构

基于问题陈述和用户研究数据，从6个维度批量生成HMW陈述，并进行质量检查与评分。

#### 1.1 从6个维度生成HMW

AI需要从以下6个维度为每个核心问题生成HMW陈述：

##### 维度说明

1. **消除障碍（Remove）**
   - 目标：移除导致问题产生的障碍因素
   - 问题导向：如何消除阻碍用户达成目标的障碍？

2. **降低门槛（Reduce）**
   - 目标：减少解决问题所需的努力、时间或复杂度
   - 问题导向：如何降低用户完成任务的门槛？

3. **加速达成（Accelerate）**
   - 目标：加快用户达成目标的效率
   - 问题导向：如何帮助用户更快地实现目标？

4. **增强感知（Amplify）**
   - 目标：增强用户对产品价值或功能的感知与理解
   - 问题导向：如何让用户更好地感知和理解产品价值？

5. **扩展场景（Expand）**
   - 目标：扩展产品的使用场景或用户群体
   - 问题导向：如何将产品应用到更多的使用场景中？

6. **重新定义（Rethink）**
   - 目标：从全新角度重新定义问题或解决方案
   - 问题导向：如何从根本上重新思考这个问题？

##### 生成要求

- 每个维度至少生成2-3个HMW陈述
- HMW陈述应该：
  - 以"How might we"开头
  - 足够具体以指导方案生成
  - 足够开放以保留发散空间
  - 直接关联用户研究数据中的洞察

#### 1.2 HMW质量检查

对每个生成的HMW陈述进行质量检查：

1. **是否过于宽泛**：HMW是否涵盖过多问题，导致无法指导具体方案
2. **是否预设方案**：HMW是否已经暗示了特定解决方案
3. **是否具体**：HMW是否足够具体，能够指导方案方向
4. **是否有发散空间**：HMW是否保留了多种可能的解决路径

每个HMW必须同时满足：不宽泛、不预设方案、足够具体、有发散空间。

#### 1.3 HMW评分

对通过质量检查的HMW陈述进行发散潜力评分（1-5分）：

- **1分**：只能想到1-2种解决方案
- **2分**：能想到2-3种相关解决方案
- **3分**：能想到3-5种解决方案
- **4分**：能想到5-8种多样化的解决方案
- **5分**：能想到8种以上高度多样化的解决方案

#### HMW输出结构

```json
{
  "hmw_ideas": {
    "hmw_statements": [
      {
        "id": "hmw_001",
        "statement": "How might we eliminate the friction points that cause users to abandon checkout?",
        "dimension": "remove",
        "source_problem": "用户在中途放弃完成订单",
        "source_data": {
          "type": "interview",
          "user_id": "user_001",
          "quote": "用户原话引用"
        },
        "divergence_potential": 4,
        "quality_check": "passed",
        "quality_issues": [],
        "related_dimensions": ["remove", "reduce"]
      }
    ],
    "summary": {
      "total_hmw": 36,
      "passed": 32,
      "failed": 4,
      "dimension_distribution": {
        "remove": 6,
        "reduce": 6,
        "accelerate": 6,
        "amplify": 6,
        "expand": 6,
        "rethink": 6
      },
      "average_divergence": 3.8,
      "high_potential_count": 18
    }
  }
}
```

---

### Step 2：并行发散（SCAMPER + 反转思维）

基于Step 1的HMW产出，并行执行SCAMPER结构化发散和反转思维分析，最大化创意产出。

#### 2A：SCAMPER结构化方案生成

对每个选定的HMW（建议选择发散潜力≥3的），从7个维度各生成2-3个方案。

##### SCAMPER维度详解

1. **Substitute（替代 S）**——可以用什么替代现有的元素？
2. **Combine（合并 C）**——可以与什么合并？
3. **Adapt（借鉴 A）**——可以借鉴什么？
4. **Modify（修改 M）**——可以怎样修改？
5. **Put to other use（转用 P）**——可以有什么其他用途？
6. **Eliminate（删除 E）**——可以删除什么？
7. **Reverse（反转 R）**——可以怎么反转？

##### SCAMPER生成要求

- 每个HMW在每个维度至少生成2个方案
- 方案应直接回应HMW陈述中的问题
- 体现对应SCAMPER维度的核心思想
- 具有一定的新颖性和差异化

##### 方案去重与聚类

1. **语义去重**：识别语义相同或高度相似的方案，合并或删除重复项
2. **维度校验**：确保同一方案不会被重复归类到不同维度
3. **聚类算法**：基于目标相似性、方法相似性、用户价值相似性、实现复杂度相似性进行聚类

##### SCAMPER初步评分

对每个方案从4个维度进行评分：

1. **创新度（Innovation）** 1-5分
2. **可行性（Feasibility）** 1-5分
3. **影响力（Impact）** 1-5分
4. **风险度（Risk）** 1-5分（反向评分，5分=几乎无风险）

#### 2B：反转思维分析

基于产品/功能目标，生成失败路径并逆向转化为成功条件和设计约束。

##### 生成失败路径

基于产品/功能目标，生成10-15条潜在的失败路径，覆盖5个层面：

1. **用户行为层面**：用户不使用、误解价值、学习曲线困难
2. **技术实现层面**：功能不稳定、性能问题、安全漏洞
3. **业务运营层面**：成本超预算、合规性问题、市场时机不佳
4. **价值感知层面**：用户不感知价值、竞品替代
5. **生态系统层面**：合作伙伴不配合、第三方依赖风险

每个失败路径包含：
- **失败模式（Failure Mode）**：清晰描述失败的具体表现
- **严重程度（Severity）** 1-5分
- **发生可能性（Likelihood）** 1-5分
- **优先级** = 严重程度 × 发生可能性（Critical ≥ 15, High 10-14, Medium 6-9, Low < 6）

##### 逆向转化为成功条件

将每个失败路径逆向思考，转化为对应的成功条件：
- 不是"如何避免失败"，而是"什么条件下这个失败不会发生"
- 成功条件必须具体明确、可观测和可验证、与失败路径直接相关、不预设特定实现方式

##### 转化为设计约束

将高优先级的成功条件转化为具体可执行的设计约束，分类为：

1. **功能约束**：必须提供或禁止的功能
2. **交互约束**：必须遵循或避免的交互模式
3. **视觉约束**：必须遵守或避免的视觉设计
4. **性能约束**：必须满足的性能指标
5. **内容约束**：必须包含或避免的内容元素
6. **技术约束**：必须采用或避免的技术方案

每个设计约束必须有明确的验证方法。

#### 并行发散输出结构

```json
{
  "scamper_ideas": {
    "solutions": [
      {
        "id": "solution_001",
        "source_hmw": {
          "id": "hmw_001",
          "statement": "How might we eliminate the friction points that cause users to abandon checkout?"
        },
        "scamper_dimension": "eliminate",
        "solution": "移除强制注册要求，允许游客结账",
        "description": "允许用户在不创建账号的情况下完成购买，只需提供必要的配送和支付信息",
        "innovation_score": 3,
        "feasibility_score": 5,
        "impact_score": 4,
        "risk_score": 4,
        "key_assumption": "用户愿意在不登录的情况下提供支付信息",
        "cluster": "cluster_001"
      }
    ],
    "clusters": [
      {
        "cluster_id": "cluster_001",
        "cluster_name": "流程简化类",
        "description": "通过减少步骤和字段来简化结账过程",
        "solution_ids": ["solution_001", "solution_004", "solution_007"],
        "cluster_potential": 4.2,
        "dominant_dimension": "eliminate"
      }
    ],
    "summary": {
      "total_solutions": 42,
      "total_clusters": 8,
      "average_scores": {
        "innovation": 3.4,
        "feasibility": 3.8,
        "impact": 3.6,
        "risk": 3.5
      },
      "dimension_distribution": {
        "substitute": 6,
        "combine": 5,
        "adapt": 6,
        "modify": 6,
        "put_to_other_use": 6,
        "eliminate": 7,
        "reverse": 6
      }
    }
  },
  "inversion_ideas": {
    "inversion_analysis": [
      {
        "id": "inversion_001",
        "failure_mode": "用户在结账页面放弃",
        "severity": 5,
        "likelihood": 4,
        "risk_score": 20,
        "priority": "critical",
        "success_condition": "用户能够顺利完成结账流程，没有任何阻碍",
        "design_constraints": [
          {
            "constraint": "结账流程最多3个步骤",
            "category": "功能约束",
            "verifiable": true,
            "verification_method": "功能测试验证步骤数"
          },
          {
            "constraint": "每步不超过5个字段",
            "category": "交互约束",
            "verifiable": true,
            "verification_method": "UI审查验证字段数量"
          }
        ]
      }
    ],
    "summary": {
      "total_failure_modes": 12,
      "priority_distribution": {
        "critical": 3,
        "high": 4,
        "medium": 3,
        "low": 2
      },
      "total_design_constraints": 38,
      "constraints_by_category": {
        "功能约束": 8,
        "交互约束": 12,
        "性能约束": 6,
        "视觉约束": 4,
        "内容约束": 5,
        "技术约束": 3
      },
      "critical_success_conditions": 3,
      "high_priority_constraints": 15
    }
  }
}
```

---

### Step 3：创意收敛

从SCAMPER方案列表和反转思维约束中筛选高质量候选，通过深化和对比矩阵为人类决策提供支持。

#### 3.1 方案筛选

AI自动筛选出高质量的候选方案：

1. **可行性过滤**：排除可行性评分 < 2的方案
2. **设计约束冲突检测**：排除与Critical/High级别设计约束冲突的方案
3. **基础质量门槛**：综合评分 = (创新度 + 可行性 + 影响力 + (6-风险度)) / 4 ≥ 3.5，或在某个维度特别突出（评分 ≥ 4.5）
4. **多维度考量**：平衡性、差异化、覆盖度

#### 3.2 方案深化

对筛选出的Top 5-10个方案进行深度分析和完善：

1. **详细方案描述**：完整的方案叙述、核心功能点、用户体验流程、差异化
2. **交互流程设计**：主要用户场景的交互步骤、关键页面和组件、异常处理
3. **关键假设**：技术假设、用户假设、业务假设、数据假设
4. **风险识别**：技术风险、用户风险、业务风险、市场风险
5. **MVP范围定义**：Core MVP / Extended MVP / Excluded
6. **成功指标**：Primary Metrics / Secondary Metrics / Guardrail Metrics

#### 3.3 方案对比矩阵

构建6维度的方案对比矩阵：

1. **用户价值（User Value）** 1-5分，权重0.25
2. **实现复杂度（Implementation Complexity）** 1-5分（反向），权重0.15
3. **创新程度（Innovation）** 1-5分，权重0.15
4. **风险程度（Risk）** 1-5分（反向），权重0.15
5. **战略对齐（Strategic Alignment）** 1-5分，权重0.15
6. **可扩展性（Scalability）** 1-5分，权重0.15

AI基于加权总分法、维度最优法、综合权衡法、场景适配法给出推荐建议，明确标注置信度和推荐理由。

#### 创意收敛输出结构

```json
{
  "converged_ideas": {
    "converged_solutions": [
      {
        "id": "solution_001",
        "title": "允许游客结账",
        "detailed_description": {
          "overview": "允许用户在不创建账号的情况下完成购买...",
          "key_features": ["功能1", "功能2", "功能3"],
          "user_experience": "用户可以直接输入配送和支付信息...",
          "differentiation": "与现有方案相比，我们通过消除注册门槛..."
        },
        "interaction_flow": {
          "steps": [
            {
              "step": 1,
              "action": "用户点击购买按钮",
              "ui_elements": ["购买按钮", "商品信息"],
              "user_goal": "开始购买流程"
            }
          ],
          "main_scenarios": ["标准购买流程", "中断恢复流程", "支付失败重试"]
        },
        "assumptions": {
          "technical": ["用户愿意在不登录的情况下提供支付信息"],
          "user": ["新用户更倾向于先体验再注册"],
          "business": ["短期订单完成率提升可以弥补注册率下降"]
        },
        "risks": {
          "technical": {
            "description": "支付信息安全性需要额外保障",
            "severity": "medium",
            "mitigation": "采用第三方支付平台处理敏感信息"
          }
        },
        "mvp_scope": {
          "core": ["商品展示", "购物车", "简化结账", "基础支付"],
          "extended": ["账户创建引导", "订单追踪", "个性化推荐"],
          "excluded": ["复杂会员体系", "积分系统", "多地址管理"]
        },
        "success_metrics": {
          "primary": ["订单完成率", "转化率"],
          "secondary": ["用户满意度", "平均订单价值"],
          "guardrails": ["退款率", "欺诈率"]
        }
      }
    ],
    "comparison_matrix": {
      "dimensions": [
        {
          "name": "用户价值",
          "weight": 0.25,
          "description": "对用户需求的满足程度"
        },
        {
          "name": "实现复杂度",
          "weight": 0.15,
          "description": "技术实现难度（反向）",
          "reverse": true
        },
        {
          "name": "创新程度",
          "weight": 0.15,
          "description": "方案的新颖性和差异化"
        },
        {
          "name": "风险程度",
          "weight": 0.15,
          "description": "实施和运营风险（反向）",
          "reverse": true
        },
        {
          "name": "战略对齐",
          "weight": 0.15,
          "description": "与公司战略的一致性"
        },
        {
          "name": "可扩展性",
          "weight": 0.15,
          "description": "未来的扩展灵活性"
        }
      ],
      "solutions": [
        {
          "solution_id": "solution_001",
          "title": "允许游客结账",
          "scores": {
            "用户价值": 4,
            "实现复杂度": 5,
            "创新程度": 3,
            "风险程度": 4,
            "战略对齐": 4,
            "可扩展性": 4
          },
          "weighted_score": 4.05,
          "pros": ["直接降低结账门槛", "实现简单，风险可控"],
          "cons": ["创新程度中等", "可能影响后续用户运营"],
          "recommendation": "强烈推荐",
          "ai_confidence": 0.85
        }
      ],
      "recommendations": {
        "overall_top": "solution_001",
        "by_dimension": {
          "用户价值": "solution_003",
          "实现复杂度": "solution_001",
          "创新程度": "solution_007",
          "风险程度": "solution_001",
          "战略对齐": "solution_004",
          "可扩展性": "solution_002"
        }
      }
    },
    "human_decision_package": {
      "summary": "方案收敛总结",
      "ai_recommendation": "AI推荐说明",
      "decision_factors": ["决策考虑因素"],
      "next_steps": ["后续行动项"],
      "approval_required": true,
      "decision_maker": "产品负责人"
    }
  }
}
```

---

## 输出

**存储路径**：`output/pm-design/ideation-workshop/`
**输出文件**：ideation-workshop.json + ideation-workshop.md

### ideation-workshop.json 完整数据结构

```json
{
  "hmw_ideas": {
    "hmw_statements": ["...（见Step 1输出结构）"],
    "summary": {}
  },
  "scamper_ideas": {
    "solutions": ["...（见Step 2A输出结构）"],
    "clusters": [],
    "summary": {}
  },
  "inversion_ideas": {
    "inversion_analysis": ["...（见Step 2B输出结构）"],
    "summary": {}
  },
  "converged_ideas": {
    "converged_solutions": ["...（见Step 3输出结构）"],
    "comparison_matrix": {},
    "human_decision_package": {}
  }
}
```

### ideation-workshop.md

Markdown格式的创意工作坊报告，包含：
1. HMW问题重构摘要
2. SCAMPER方案列表与聚类
3. 反转思维分析摘要
4. 收敛方案对比矩阵
5. 人类决策建议

---

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| hmw_ideas | object | 是 | HMW产出 |
| hmw_ideas.hmw_statements | array | 是 | HMW陈述列表 |
| hmw_ideas.hmw_statements[].id | string | 是 | HMW唯一标识 |
| hmw_ideas.hmw_statements[].statement | string | 是 | HMW陈述文本 |
| hmw_ideas.hmw_statements[].dimension | string | 是 | 所属维度（remove/reduce/accelerate/amplify/expand/rethink） |
| hmw_ideas.hmw_statements[].source_problem | string | 是 | 关联的核心问题 |
| hmw_ideas.hmw_statements[].source_data | object | 是 | 来源的用户研究数据 |
| hmw_ideas.hmw_statements[].divergence_potential | integer | 是 | 发散潜力评分（1-5） |
| hmw_ideas.hmw_statements[].quality_check | string | 是 | 质量检查结果（passed/failed） |
| hmw_ideas.hmw_statements[].quality_issues | array | 是 | 质量问题列表 |
| hmw_ideas.hmw_statements[].related_dimensions | array | 是 | 关联的其他维度 |
| hmw_ideas.summary | object | 是 | HMW统计摘要 |
| scamper_ideas | object | 是 | SCAMPER产出 |
| scamper_ideas.solutions | array | 是 | 方案列表，至少10个 |
| scamper_ideas.solutions[].id | string | 是 | 方案唯一标识 |
| scamper_ideas.solutions[].source_hmw | object | 是 | 来源HMW陈述 |
| scamper_ideas.solutions[].scamper_dimension | string | 是 | SCAMPER维度 |
| scamper_ideas.solutions[].solution | string | 是 | 方案标题 |
| scamper_ideas.solutions[].description | string | 是 | 方案详细描述 |
| scamper_ideas.solutions[].innovation_score | integer | 是 | 创新度评分（1-5） |
| scamper_ideas.solutions[].feasibility_score | integer | 是 | 可行性评分（1-5） |
| scamper_ideas.solutions[].impact_score | integer | 是 | 影响力评分（1-5） |
| scamper_ideas.solutions[].risk_score | integer | 是 | 风险度评分（1-5） |
| scamper_ideas.solutions[].key_assumption | string | 是 | 关键假设 |
| scamper_ideas.solutions[].cluster | string | 是 | 所属聚类ID |
| scamper_ideas.clusters | array | 是 | 聚类列表 |
| scamper_ideas.clusters[].cluster_id | string | 是 | 聚类ID |
| scamper_ideas.clusters[].cluster_name | string | 是 | 聚类名称 |
| scamper_ideas.clusters[].solution_ids | array | 是 | 聚类内方案ID列表 |
| scamper_ideas.summary | object | 是 | SCAMPER统计摘要 |
| inversion_ideas | object | 是 | 反转思维产出 |
| inversion_ideas.inversion_analysis | array | 是 | 逆转分析列表，至少10条 |
| inversion_ideas.inversion_analysis[].id | string | 是 | 唯一标识符 |
| inversion_ideas.inversion_analysis[].failure_mode | string | 是 | 失败模式描述 |
| inversion_ideas.inversion_analysis[].severity | integer | 是 | 严重程度（1-5） |
| inversion_ideas.inversion_analysis[].likelihood | integer | 是 | 发生可能性（1-5） |
| inversion_ideas.inversion_analysis[].risk_score | integer | 是 | 风险评分（severity × likelihood） |
| inversion_ideas.inversion_analysis[].priority | string | 是 | 优先级（critical/high/medium/low） |
| inversion_ideas.inversion_analysis[].success_condition | string | 是 | 成功条件 |
| inversion_ideas.inversion_analysis[].design_constraints | array | 是 | 设计约束数组 |
| inversion_ideas.inversion_analysis[].design_constraints[].constraint | string | 是 | 约束描述 |
| inversion_ideas.inversion_analysis[].design_constraints[].category | string | 是 | 约束类别 |
| inversion_ideas.inversion_analysis[].design_constraints[].verifiable | boolean | 是 | 是否可验证 |
| inversion_ideas.inversion_analysis[].design_constraints[].verification_method | string | 是 | 验证方法 |
| inversion_ideas.summary | object | 是 | 反转思维统计摘要 |
| converged_ideas | object | 是 | 收敛产出 |
| converged_ideas.converged_solutions | array | 是 | 收敛后的方案列表，至少3个 |
| converged_ideas.converged_solutions[].id | string | 是 | 方案唯一标识 |
| converged_ideas.converged_solutions[].title | string | 是 | 方案标题 |
| converged_ideas.converged_solutions[].detailed_description | object | 是 | 详细方案描述 |
| converged_ideas.converged_solutions[].interaction_flow | object | 是 | 交互流程设计 |
| converged_ideas.converged_solutions[].assumption | object | 是 | 关键假设 |
| converged_ideas.converged_solutions[].risk | object | 是 | 风险识别 |
| converged_ideas.converged_solutions[].mvp_scope | object | 是 | MVP范围定义 |
| converged_ideas.converged_solutions[].success_metrics | object | 是 | 成功指标 |
| converged_ideas.comparison_matrix | object | 是 | 对比矩阵 |
| converged_ideas.comparison_matrix.dimensions | array | 是 | 对比维度定义，6个维度 |
| converged_ideas.comparison_matrix.solutions | array | 是 | 各方案对比数据 |
| converged_ideas.comparison_matrix.recommendations | object | 是 | AI推荐结果 |
| converged_ideas.human_decision_package | object | 是 | 人类决策包 |
| converged_ideas.human_decision_package.approval_required | boolean | 是 | 是否需要人类审批 |

## 决策规则

### Step 1 HMW通过条件

1. **质量检查**：所有HMW必须通过质量检查
2. **维度覆盖**：6个维度都必须有HMW覆盖
3. **数据支撑**：每条HMW必须有对应的用户研究数据支撑
4. **评分完成**：所有HMW都必须完成发散潜力评分

### Step 2 并行发散通过条件

1. **SCAMPER方案数量**：至少生成10个候选方案
2. **SCAMPER维度覆盖**：7个SCAMPER维度都必须有方案覆盖
3. **SCAMPER评分完整性**：每个方案都必须有4个维度的评分
4. **SCAMPER聚类完整性**：所有方案都必须归属于某个聚类
5. **反转思维失败路径**：生成了10-15条失败路径，覆盖5个维度
6. **反转思维约束转化**：每个成功条件转化为具体的设计约束

### Step 3 收敛通过条件

1. **方案筛选**：排除可行性 < 2的方案，排除与Critical/High约束冲突的方案
2. **方案深化**：Top5方案已深化，每个方案包含所有6个维度
3. **对比矩阵**：6个维度完整，评分标准统一
4. **人类决策**：方案最终选择必须由人类决策

### 失败处理

| 失败场景 | 处理流程 |
|----------|----------|
| HMW未通过质量检查 | 识别质量问题类型，针对性重新生成，重新质量检查 |
| HMW维度覆盖不全 | 检查6个维度的HMW数量，针对缺失维度补充生成 |
| HMW缺乏数据支撑 | 关联现有数据或返回输入阶段补充用户研究数据 |
| SCAMPER方案数量不足 | 针对稀缺维度补充生成，降低相似度阈值 |
| SCAMPER维度覆盖不全 | 回到Step 2A，针对缺失维度补充生成方案 |
| 反转思维失败路径不足 | 检查失败路径分类完整性，补充缺失维度 |
| 设计约束过于抽象 | 审查约束描述，转化为具体可执行描述并定义验证方法 |
| 收敛方案深化不足 | 补充缺失的深化维度 |
| 对比矩阵维度缺失 | 补充缺失维度评分，无法评分则标注"数据不足" |

---

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|------------|
| HMW维度覆盖 | 6个维度都已覆盖 | 标注"维度缺失"，补充缺失维度的HMW陈述 |
| HMW数量 | 每个维度至少6个HMW陈述 | 标注"数量不足"，针对不足维度补充生成HMW |
| HMW数据支撑 | 每条HMW有用户研究数据支撑 | 标注"缺乏数据支撑"，关联现有数据或返回输入阶段补充 |
| HMW发散潜力评分 | 所有HMW已完成发散潜力评分 | 标注"评分缺失"，补充评分后重新排序 |
| HMW宽泛性 | 没有过于宽泛的HMW | 标注"过于宽泛"，缩小问题范围重新生成 |
| HMW预设方案 | 没有预设方案的HMW | 标注"预设方案"，重新表述为开放性问题形式 |
| SCAMPER维度覆盖 | 7个SCAMPER维度都已覆盖 | 标注"维度缺失"，补充缺失维度的方案 |
| SCAMPER方案数量 | 每个维度至少3个方案，总计至少10个 | 标注"数量不足"，针对不足维度补充生成 |
| SCAMPER去重 | 方案去重已完成，无明显重复 | 标注"存在重复"，执行语义去重 |
| SCAMPER聚类 | 所有方案都有聚类归属 | 标注"聚类缺失"，补充聚类归属 |
| 反转思维失败路径数量 | 生成了10-15条失败路径 | 标注"路径不足"或"路径过多"，补充或精简 |
| 反转思维失败路径评分 | 每条失败路径都有严重程度和发生可能性评分 | 标注"评分缺失"，补充评分后重新计算优先级 |
| 反转思维成功条件对应 | 每条失败路径都有对应的成功条件 | 标注"条件缺失"，逆向转化补充成功条件 |
| 反转思维设计约束可执行性 | 每条设计约束具体可执行 | 标注"约束模糊"，将抽象约束转化为具体可执行描述 |
| 反转思维约束验证方法 | 设计约束有明确的验证方法 | 标注"验证缺失"，为每条约束定义验证方法 |
| 收敛方案筛选 | 排除可行性<2和约束冲突的方案 | 标注"筛选未完成"，补充筛选 |
| 收敛方案深化 | Top5方案已深化，包含所有6个维度 | 标注"深化不足"，补充缺失维度 |
| 收敛对比矩阵 | 6个维度完整，评分标准统一 | 标注"矩阵不完整"，补充缺失维度 |
| 唯一ID | 所有条目有唯一ID | 标注"ID缺失"，补充唯一标识符 |
| 输出格式 | 输出格式符合规范 | 标注"格式异常"，修正为标准输出格式 |
| 统计准确性 | 统计数据准确 | 标注"统计有误"，重新计算统计数据 |

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| Problem Statement缺失 | 用户描述问题，直接生成HMW | 缺乏结构化Problem Statement，HMW可能不够聚焦 |
| 用户研究数据缺失 | 用户描述问题，直接生成HMW | 缺乏用户研究数据支撑，HMW与用户需求可能偏差 |
| Problem Statement+用户研究数据均缺失 | 用户描述问题，直接生成HMW | 整体置信度降低，HMW可能过于宽泛 |
| 当前方案描述缺失 | 基于HMW直接生成方案，无改进基线 | 缺乏当前方案参考，替代/修改维度方案可能不够精准 |
| 竞品方案数据缺失 | 跳过竞品借鉴，基于HMW和当前方案生成 | 缺乏竞品方案参考，借鉴维度方案可能不够丰富 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述直接生成 | 输出仅为基本HMW列表和方案框架 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| Problem Statement变更 | HMW陈述的聚焦方向 | 标注受影响的HMW，建议人类确认是否重新生成 |
| 用户研究数据更新 | HMW的数据支撑、source_data关联 | 标注受影响的HMW，建议人类确认是否补充数据关联 |
| 当前方案变更 | SCAMPER替代/修改维度方案 | 标注受影响的维度方案，建议人类确认是否重新生成 |
| 竞品方案数据更新 | SCAMPER借鉴维度方案 | 标注受影响的借鉴方案，建议人类确认是否补充 |
| 产品上下文变更 | 反转思维失败路径优先级、收敛战略对齐评分 | 标注受影响的评分维度，建议人类确认是否重新评分 |

### 下游通知机制

| 变更类型 | 通知范围 | 通知方式 |
|----------|----------|----------|
| 收敛方案选择变更 | design-prd、validation-assumption-map | 标记方案变更，触发PRD和假设地图更新 |
| 收敛方案深化内容变更 | design-prd | 标记深化内容变更，触发PRD功能规格更新 |
| 对比矩阵评分变更 | design-prd | 标记评分变更，触发PRD优先级调整 |
| MVP范围变更 | validation-mvp | 标记MVP范围变更，触发MVP界定更新 |

## 变更记录

- v3.0: 合并ideation-hmw、ideation-scamper、ideation-inversion、ideation-convergence四件套为ideation-workshop创意工作坊；Step 1 HMW问题重构、Step 2 并行发散（SCAMPER+反转思维）、Step 3 创意收敛；输出合并为ideation-workshop.json（含hmw_ideas+scamper_ideas+inversion_ideas+converged_ideas）+ ideation-workshop.md
