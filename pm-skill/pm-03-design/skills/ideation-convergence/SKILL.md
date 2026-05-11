---
name: ideation-convergence
description: 当需要从多个创意方案中筛选和深化时使用。方案收敛与深化Pipeline，从SCAMPER方案列表中筛选高质量候选，通过深化和对比矩阵为人类决策提供支持。关键词：方案收敛、方案深化、对比矩阵、人类决策、产品决策。
metadata:
  module: "产品构思与设计"
  sub-module: "创意发散与方案构思"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 7：方案收敛与深化

## 核心原则

1. **收敛不是淘汰而是深化**——筛选出的方案必须经过完整深化，而非简单排序
2. **对比矩阵是决策的脚手架**——多维度量化对比为人类决策提供结构化支撑，而非替代决策
3. **人类决策权不可让渡**——AI提供分析和推荐，方案最终选择必须由人类决策
4. **假设是方案的灵魂**——每个深化方案必须暴露关键假设，假设的可靠性决定方案的可靠性

方案收敛是整个创意构思工作流的关键收尾阶段。本Pipeline从SCAMPER生成的众多候选方案中，通过科学的筛选机制、深度的方案完善和全面的对比分析，为人类决策者提供清晰的决策依据。**方案最终选择必须由人类决策**，AI的角色是提供高质量的分析和建议。

### 执行角色

🤖→👤 **AI建议，人类审批**

- **AI负责**：方案筛选、深化分析、对比矩阵生成
- **人类负责**：最终方案选择、优先级确认、行动项决策

---

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| Solutions | JSON/array | 是 | output/pm-design/ideation-scamper/solutions.json | 来自Pipeline 5的SCAMPER方案列表 |
| Inversion Analysis | JSON/array | 是 | output/pm-design/ideation-inversion/inversion_analysis.json | 来自Pipeline 6的思维逆转分析结果，包括设计约束 |
| Product Context | JSON/object | ○ | 用户提供 | 产品战略和资源约束信息 |

### 输入格式

```json
{
  "solutions": [
    {
      "id": "solution_001",
      "source_hmw": {
        "id": "hmw_001",
        "statement": "How might we..."
      },
      "scamper_dimension": "eliminate",
      "solution": "移除强制注册要求，允许游客结账",
      "innovation_score": 3,
      "feasibility_score": 5,
      "impact_score": 4,
      "risk_score": 4,
      "key_assumption": "假设描述",
      "cluster": "cluster_001"
    }
  ],
  "inversion_analysis": [
    {
      "id": "inversion_001",
      "failure_mode": "失败模式描述",
      "priority": "critical",
      "design_constraints": [
        {
          "constraint": "约束描述",
          "category": "功能约束"
        }
      ]
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

### Step 1：方案筛选

AI自动筛选出高质量的候选方案。

#### 筛选维度

1. **可行性过滤**
   - **硬性规则**：排除可行性评分 < 2的方案
   - **理由**：可行性低于2分意味着实现难度过高，在当前资源和时间约束下不可行

2. **设计约束冲突检测**
   - **硬性规则**：排除与Critical/High级别设计约束冲突的方案
   - **检测方法**：
     - 将方案描述与设计约束进行语义匹配
     - 识别任何违反约束的设计决策
     - 标记可能的冲突但给予例外评估

3. **基础质量门槛**
   - **推荐标准**（保留Top 5-10）：
     - 综合评分 = (创新度 + 可行性 + 影响力 + (6-风险度)) / 4
     - 综合评分 ≥ 3.5
     - 或在某个维度特别突出（评分 ≥ 4.5）

4. **多维度考量**
   - **平衡性**：避免所有方案都是同一类型
   - **差异化**：确保保留的方案具有明显差异
   - **覆盖度**：尽量覆盖不同的SCAMPER维度和HMW来源

#### 筛选输出

```json
{
  "screening_result": {
    "initial_count": 42,
    "filtered_count": 8,
    "top_candidates": ["solution_001", "solution_007", ...],
    "eliminated_reasons": {
      "low_feasibility": ["solution_003", "solution_012"],
      "constraint_conflict": ["solution_008"],
      "low_overall_score": ["solution_015", "solution_021"]
    },
    "selection_rationale": "筛选说明"
  }
}
```

---

### Step 2：方案深化

对筛选出的Top 5-10个方案进行深度分析和完善。

#### 深化维度

1. **详细方案描述**
   - 完整的方案叙述
   - 核心功能点
   - 用户体验流程
   - 与现有方案的差异化

2. **交互流程设计**
   - 主要用户场景的交互步骤
   - 关键页面和组件
   - 用户决策点
   - 异常处理流程

3. **关键假设**
   - 技术假设：依赖的技术能力和限制
   - 用户假设：关于用户行为的假设
   - 业务假设：关于市场、竞争、运营的假设
   - 数据假设：需要验证的数据驱动决策

4. **风险识别**
   - 技术风险：实现难度和技术不确定性
   - 用户风险：用户可能不接受或误解
   - 业务风险：对现有业务模式的影响
   - 市场风险：竞争反应和市场时机

5. **MVP范围定义**
   - **Core MVP**：解决核心问题必须包含的功能
   - **Extended MVP**：可以后续迭代增加的功能
   - **Excluded**：明确排除的功能

6. **成功指标**
   - **Primary Metrics**：直接衡量方案成功的指标
   - **Secondary Metrics**：相关但非直接的指标
   - **Guardrail Metrics**：需要监控的底线指标

#### 深化模板

```json
{
  "converged_solution": {
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
      },
      "user": {
        "description": "用户可能对不熟悉的商家缺乏信任",
        "severity": "high",
        "mitigation": "展示用户评价和安全保障信息"
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
}
```

---

### Step 3：方案对比矩阵

构建多维度的方案对比矩阵，为人类决策提供全面的分析视角。

#### 对比维度

1. **用户价值（User Value）** 1-5分
   - 直接解决用户痛点的程度
   - 对用户体验的提升幅度
   - 满足用户核心需求的程度

2. **实现复杂度（Implementation Complexity）** 1-5分（反向）
   - 技术实现难度
   - 所需资源和时间
   - 与现有系统的集成难度
   - **注意**：这是反向评分，1分=最复杂，5分=最简单

3. **创新程度（Innovation）** 1-5分
   - 与现有方案的差异化程度
   - 突破性创新的程度
   - 竞争优势的可持续性

4. **风险程度（Risk）** 1-5分（反向）
   - 实施风险
   - 用户接受风险
   - 市场风险
   - **注意**：这是反向评分，1分=风险最高，5分=风险最低

5. **战略对齐（Strategic Alignment）** 1-5分
   - 与公司战略目标的一致性
   - 对长期发展的支持
   - 品牌定位的一致性

6. **可扩展性（Scalability）** 1-5分
   - 未来扩展的灵活性
   - 技术架构的扩展性
   - 适应新场景的能力

#### 对比矩阵格式

```json
{
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
        "pros": [
          "直接降低结账门槛",
          "实现简单，风险可控",
          "对用户体验有显著提升"
        ],
        "cons": [
          "创新程度中等，竞品已有类似功能",
          "可能影响后续用户运营"
        ],
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
  }
}
```

#### AI推荐逻辑

AI基于以下逻辑给出推荐建议：

1. **加权总分法**：按预设权重计算每个方案的加权总分
2. **维度最优法**：识别每个维度的最优方案
3. **综合权衡法**：在多个维度间进行权衡，推荐平衡性最好的方案
4. **场景适配法**：根据特定的决策场景（时间紧迫/资源有限/追求创新等）给出针对性推荐

AI推荐需要明确标注置信度，并在输出中说明推荐理由。

---

## 输出

**存储路径**：`output/pm-design/ideation-convergence/`
**输出文件**：converged_solutions.json

### 数据结构

```json
{
  "converged_solutions": [
    {
      "id": "solution_001",
      "title": "允许游客结账",
      "detailed_description": "...",
      "interaction_flow": "...",
      "assumption": "...",
      "risk": "...",
      "mvp_scope": "...",
      "success_metrics": [...]
    }
  ],
  "comparison_matrix": {
    "dimensions": [...],
    "solutions": [...],
    "recommendations": {...}
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
```

### 输出字段说明

#### Converged Solutions

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 方案唯一标识符 |
| title | string | 方案标题 |
| detailed_description | object | 详细方案描述 |
| interaction_flow | object | 交互流程设计 |
| assumption | string | 关键假设 |
| risk | object | 风险识别 |
| mvp_scope | object | MVP范围定义 |
| success_metrics | object | 成功指标 |

#### Comparison Matrix

| 字段 | 类型 | 说明 |
|------|------|------|
| dimensions | array | 对比维度定义 |
| solutions | array | 各方案的对比数据 |
| recommendations | object | AI推荐结果 |

---

## 人类决策点

## ⚠️ 方案最终选择必须人类决策

这是工作流中的关键人类决策点，AI无法替代人类进行最终方案选择。

### 决策责任

**决策者**：产品负责人 / 产品委员会 / 核心利益相关者

### 决策依据

人类决策者应该综合考虑：

1. **AI提供的分析**
   - 对比矩阵的各项评分
   - AI推荐理由和置信度
   - 各方案的优势和劣势

2. **AI无法量化的因素**
   - 组织文化和价值观
   - 团队能力和偏好
   - 长期战略考量
   - 政治和利益相关者因素

3. **具体情境因素**
   - 当前产品阶段
   - 可用资源和时间
   - 竞争环境变化
   - 风险承受能力

### 决策选项

人类决策者可以：

1. **接受AI推荐**：选择AI推荐的最佳方案
2. **调整优先级**：基于主观判断调整方案优先级
3. **组合方案**：将多个方案的优势组合
4. **要求重新分析**：提供反馈，要求AI重新分析
5. **否决所有方案**：认为现有方案都不够好，需要重新构思

### 决策输出

```json
{
  "human_decision": {
    "decision": "selected",
    "selected_solution": "solution_001",
    "alternative_considered": ["solution_003", "solution_007"],
    "decision_rationale": "选择该方案的理由",
    "adjustments": [
      {
        "field": "mvp_scope.extended",
        "adjustment": "增加会员引导功能"
      }
    ],
    "next_steps": [
      "启动技术可行性评估",
      "制定详细开发计划",
      "准备MVP版本发布"
    ],
    "decision_maker": "产品负责人",
    "decision_date": "2024-01-15"
  }
}
```

---

## 决策规则

### AI执行阶段规则

#### 筛选规则

1. **可行性门槛**：排除可行性 < 2的方案
2. **约束冲突**：排除与Critical/High约束冲突的方案
3. **数量控制**：保留Top 5-10个候选方案

#### 深化规则

1. **完整性**：每个深化方案必须包含所有6个维度
2. **可执行性**：MVP范围定义必须具体可执行
3. **可测量性**：成功指标必须可量化

#### 对比矩阵规则

1. **维度完整性**：必须包含全部6个对比维度
2. **评分一致性**：评分标准必须统一
3. **推荐合理性**：AI推荐必须有明确理由

### 人类决策阶段规则

#### 决策有效性

1. **必须决策**：Pipeline完成时必须做出最终选择
2. **明确授权**：决策者必须具有相应授权
3. **记录完整**：所有决策必须有完整记录

#### 决策质量

1. **依据充分**：决策必须基于AI分析和人类判断
2. **考虑全面**：不能仅凭单一因素决策
3. **可追溯**：决策理由必须清晰可追溯

---

## 质量检查

### 方案筛选

- [ ] 排除可行性 < 2的方案
- [ ] 排除与设计约束冲突的方案
- [ ] 保留Top 5-10个候选方案
- [ ] 筛选结果有明确理由

### 方案深化

- [ ] Top5方案已深化
- [ ] 每个方案包含详细描述
- [ ] 每个方案有交互流程
- [ ] 每个方案有明确假设
- [ ] 每个方案有风险识别
- [ ] 每个方案有MVP范围
- [ ] 每个方案有成功指标

### 对比矩阵

- [ ] 对比矩阵6个维度完整
- [ ] 每个方案有6个维度的评分
- [ ] 评分标准统一
- [ ] 有明确的推荐建议
- [ ] 推荐有理由支撑

### 人类决策

- [ ] 决策点已明确标注
- [ ] 决策者已指定
- [ ] 决策输出格式规范
- [ ] 决策记录完整

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| SCAMPER方案缺失 | 用户提供候选方案列表，直接收敛深化 | 缺乏SCAMPER方案数据，方案维度覆盖可能不全 |
| 思维逆转约束缺失 | 用户提供候选方案列表，跳过约束冲突检测 | 缺乏设计约束数据，可能保留与约束冲突的方案 |
| SCAMPER方案+思维逆转约束均缺失 | 用户提供候选方案列表，收敛深化 | 整体置信度降低，筛选和对比维度可能不够完整 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户候选方案列表收敛深化 | 输出仅为基本对比框架 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| converged_solutions | array | 是 | 收敛后的方案列表，至少3个 |
| converged_solutions[].id | string | 是 | 方案唯一标识 |
| converged_solutions[].title | string | 是 | 方案标题 |
| converged_solutions[].detailed_description | object | 是 | 详细方案描述 |
| converged_solutions[].interaction_flow | object | 是 | 交互流程设计 |
| converged_solutions[].assumption | object | 是 | 关键假设 |
| converged_solutions[].risk | object | 是 | 风险识别 |
| converged_solutions[].mvp_scope | object | 是 | MVP范围定义 |
| converged_solutions[].success_metrics | object | 是 | 成功指标 |
| comparison_matrix | object | 是 | 对比矩阵 |
| comparison_matrix.dimensions | array | 是 | 对比维度定义，6个维度 |
| comparison_matrix.solutions | array | 是 | 各方案对比数据 |
| comparison_matrix.recommendations | object | 是 | AI推荐结果 |
| human_decision_package | object | 是 | 人类决策包 |
| human_decision_package.approval_required | boolean | 是 | 是否需要人类审批 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| SCAMPER方案增删 | 筛选结果、深化方案、对比矩阵 | 标注受影响的方案，建议人类确认是否重新筛选 |
| SCAMPER方案评分变更 | 筛选结果、排序 | 标注评分变更的方案，建议人类确认是否重新排序 |
| 思维逆转约束增删 | 约束冲突检测、方案筛选 | 标注受影响的约束，建议人类确认是否重新筛选 |
| 产品上下文变更（战略/资源） | 战略对齐评分、MVP范围 | 标注受影响的评分维度，建议人类确认是否重新评分 |

### 下游通知机制

| 收敛结果变更类型 | 通知范围 | 通知方式 |
|-----------------|----------|----------|
| 方案选择变更 | design-prd、validation-assumption-map | 标记方案变更，触发PRD和假设地图更新 |
| 方案深化内容变更 | design-prd | 标记深化内容变更，触发PRD功能规格更新 |
| 对比矩阵评分变更 | design-prd | 标记评分变更，触发PRD优先级调整 |
| MVP范围变更 | validation-mvp | 标记MVP范围变更，触发MVP界定更新 |

---

## 最佳实践

### AI执行最佳实践

1. **客观公正**：评分和推荐必须基于事实，避免个人偏好
2. **透明可解释**：所有分析必须有明确的理由和依据
3. **多角度分析**：从不同视角审视每个方案
4. **量化与定性结合**：既要有量化评分，也要有定性描述
5. **风险预警**：明确指出每个方案的潜在风险

### 人类决策最佳实践

1. **充分了解**：在决策前充分理解每个方案
2. **权衡取舍**：明确各方案的优势和劣势，做出权衡
3. **考虑长远**：不仅考虑短期效果，也考虑长期影响
4. **勇于决策**：在信息不完整时也要敢于决策
5. **记录决策**：完整记录决策理由，便于后续复盘

### 人机协作

1. **信任但验证**：信任AI的分析，但保持独立判断
2. **聚焦关键**：在决策时聚焦最关键的几个因素
3. **迭代优化**：根据决策效果持续优化AI模型
4. **知识积累**：将决策经验沉淀为组织知识
