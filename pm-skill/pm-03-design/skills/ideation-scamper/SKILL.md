---
name: ideation-scamper
description: 当需要系统化生成产品改进方案时使用。SCAMPER结构化方案生成工具，基于HMW陈述，从替代、合并、改编、修改、转换用途、消除、逆向7个维度系统化生成产品方案。关键词：SCAMPER、方案生成、产品创新、结构化思考。
metadata:
  module: "产品构思与设计"
  sub-module: "创意发散与方案构思"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_auto"
---

# Pipeline 5：SCAMPER结构化方案生成

## 核心原则

1. **七维度是发散的保险**——SCAMPER七个维度确保思维不陷入单一模式，每个维度至少2个方案
2. **数量先于质量**——发散阶段追求方案数量，收敛阶段再筛选，早期判断是创意的敌人
3. **聚类让方案可管理**——语义聚类将海量方案归组，让人类决策者看到森林而非树木
4. **评分是筛选的起点不是终点**——四维度评分辅助排序，但最终选择权在人类

SCAMPER是一种经典的结构化创意工具，通过7个维度的启发式问题，引导生成多元化的解决方案。本Pipeline将HMW陈述作为输入，结合当前产品方案和竞品分析，从SCAMPER的7个维度系统化地生成候选方案，并通过去重、聚类和初步评分，为后续的方案收敛提供高质量的输入。

### 执行角色

🤖 **AI自动执行**

本Pipeline完全由AI自动执行，无需人工干预。AI将基于HMW陈述，从多个维度生成丰富多样的方案候选。

---

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| HMW Statements | JSON/array | 是 | output/pm-design/ideation-hmw/hmw.json | 来自Pipeline 4的HMW陈述数组，建议选择发散潜力≥3的HMW |
| Current Solution | JSON/object | 是 | 用户提供 | 当前产品的现有方案描述，包括功能点和局限性 |
| Competitor Solutions | JSON/array | ○ | 用户提供 | 至少2-3个竞品的方案分析，包括功能、优劣势 |

### 输入格式

```json
{
  "hmw_statements": [
    {
      "id": "hmw_001",
      "statement": "How might we eliminate the friction points that cause users to abandon checkout?",
      "dimension": "remove",
      "divergence_potential": 4
    }
  ],
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
  ]
}
```

---

## 执行步骤

### Step 1：SCAMPER七维度方案生成

对每个选定的HMW，从7个维度各生成2-3个方案。

#### 维度详解

1. **Substitute（替代 S）**
   - 核心问题：可以用什么替代现有的元素？
   - 启发问题：
     - 什么可以替代当前的解决方案？
     - 谁可以替代当前角色？
     - 什么材料/资源可以替代现有的？
   - 应用场景：替换关键技术、替代用户角色、更换内容来源

2. **Combine（合并 C）**
   - 核心问题：可以与什么合并？
   - 启发问题：
     - 可以与什么功能合并以创造新价值？
     - 可以整合哪些用户需求？
     - 哪些流程可以合并以提升效率？
   - 应用场景：功能整合、服务捆绑、流程合并

3. **Adapt（借鉴 A）**
   - 核心问题：可以借鉴什么？
   - 启发问题：
     - 其他行业/产品如何解决类似问题？
     - 现有解决方案可以借鉴哪些最佳实践？
     - 其他场景的解决方案如何适配当前场景？
   - 应用场景：跨行业借鉴、模式迁移、最佳实践引入

4. **Modify（修改 M）**
   - 核心问题：可以怎样修改？
   - 启发问题：
     - 如何放大或缩小现有方案？
     - 如何改变形状、外观或功能？
     - 如何增加新的特性或属性？
   - 应用场景：功能增强、体验优化、范围调整

5. **Put to other use（转用 P）**
   - 核心问题：可以有什么其他用途？
   - 启发问题：
     - 当前方案还可以解决什么问题？
     - 可以扩展到哪些新的用户群体？
     - 可以应用于哪些新的场景？
   - 应用场景：功能延展、场景扩展、用户群体拓展

6. **Eliminate（删除 E）**
   - 核心问题：可以删除什么？
   - 启发问题：
     - 什么是不必要的，可以删除？
     - 如何简化现有方案？
     - 核心功能是什么，最小可用版本是什么？
   - 应用场景：简化流程、减少步骤、MVP定义

7. **Reverse（反转 R）**
   - 核心问题：可以怎么反转？
   - 启发问题：
     - 相反的操作会怎样？
     - 如何反转现有流程或顺序？
     - 如何从结果倒推解决方案？
   - 应用场景：流程反转、角色反转、视角反转

#### 生成要求

- 每个HMW在每个维度至少生成2个方案
- 方案应该：
  - 直接回应HMW陈述中的问题
  - 体现对应SCAMPER维度的核心思想
  - 具有一定的新颖性和差异化
  - 可以是渐进式改进或激进式创新

#### 生成示例

**HMW**: "How might we eliminate the friction points that cause users to abandon checkout?"

**维度方案生成示例**：

**S (Substitute)**:
- 用生物识别支付替代传统密码输入
- 用社交账号登录替代繁琐的注册流程

**C (Combine)**:
- 将配送信息与支付信息合并为一个步骤
- 将优惠券自动应用到结账流程中

**A (Adapt)**:
- 借鉴游戏化机制，让结账过程更有趣
- 借鉴一键购买功能，简化购买流程

**M (Modify)**:
- 将结账页面设计得更简洁，减少信息量
- 增加进度指示器，让用户了解当前状态

**P (Put to other use)**:
- 将购物车功能扩展到愿望清单
- 将保存的支付方式用于其他服务

**E (Eliminate)**:
- 移除强制注册要求，允许游客结账
- 删除不必要的表单字段

**R (Reverse)**:
- 让用户先体验产品再决定是否购买
- 反转传统结账流程，先确认后填信息

---

### Step 2：方案去重与聚类

#### 去重处理

1. **语义去重**：识别语义相同或高度相似的方案，合并或删除重复项
2. **维度校验**：确保同一方案不会被重复归类到不同维度
3. **冗余检测**：删除明显冗余或无实际差异的方案变体

#### 聚类算法

基于方案的相似性进行聚类：

**聚类维度**：
1. **目标相似性**：方案解决的核心问题是否相同
2. **方法相似性**：采用的技术或方法是否类似
3. **用户价值相似性**：带来的用户价值是否相近
4. **实现复杂度相似性**：实现难度和资源需求是否相当

**聚类原则**：
- 同一聚类内的方案具有高度相似性
- 不同聚类之间的方案具有明显差异性
- 每个聚类应有2-5个方案
- 核心聚类应包含具有最高潜力的方案

#### 聚类输出

```json
{
  "clusters": [
    {
      "cluster_id": "cluster_001",
      "cluster_name": "简化结账流程类",
      "description": "通过减少步骤和字段来简化结账过程",
      "solution_ids": ["solution_001", "solution_004", "solution_007"],
      "representative_solution": "solution_001"
    }
  ]
}
```

---

### Step 3：初步评分

对每个方案从4个维度进行评分：

#### 评分维度

1. **创新度（Innovation）** 1-5分
   - 评估标准：
     - **1分**：完全沿用现有方案，无新意
     - **2分**：有轻微改进，但本质未变
     - **3分**：有一定创新，但可预测
     - **4分**：具有明显创新，差异性突出
     - **5分**：具有突破性创新，颠覆传统

2. **可行性（Feasibility）** 1-5分
   - 评估标准：
     - **1分**：技术不可行，需要突破性技术
     - **2分**：实现难度很高，需要大量资源
     - **3分**：可以实现，但需要一定努力
     - **4分**：容易实现，技术成熟
     - **5分**：可快速实现，现成方案可用

3. **影响力（Impact）** 1-5分
   - 评估标准：
     - **1分**：对用户几乎无影响
     - **2分**：有轻微正面影响
     - **3分**：有中等正面影响
     - **4分**：有显著正面影响
     - **5分**：能彻底解决用户问题

4. **风险度（Risk）** 1-5分
   - **注意**：风险度是反向评分
   - 评估标准：
     - **1分**：风险极高，可能导致严重后果
     - **2分**：风险较高，需要重点关注
     - **3分**：风险中等，有应对措施
     - **4分**：风险较低，影响可控
     - **5分**：几乎无风险

#### 评分方法

- 结合HMW的divergence_potential和SCAMPER维度特点
- 考虑当前技术能力和资源限制
- 参考竞品方案的市场表现
- 评估方案对用户体验和业务目标的影响

---

## 输出

**存储路径**：`output/pm-design/ideation-scamper/`
**输出文件**：scamper_ideas.json

### 数据结构

```json
{
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
      "cluster": "cluster_001",
      "created_at": "2024-01-15T10:30:00Z"
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
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 方案唯一标识符 |
| source_hmw | object | 来源的HMW陈述 |
| scamper_dimension | string | SCAMPER维度 |
| solution | string | 方案标题 |
| description | string | 方案详细描述 |
| innovation_score | integer | 创新度评分（1-5） |
| feasibility_score | integer | 可行性评分（1-5） |
| impact_score | integer | 影响力评分（1-5） |
| risk_score | integer | 风险度评分（1-5） |
| key_assumption | string | 关键假设 |
| cluster | string | 所属聚类ID |
| created_at | string | 创建时间 |

---

## 决策规则

### 最低要求

- **方案数量**：至少生成10个候选方案
- **维度覆盖**：7个SCAMPER维度都必须有方案覆盖
- **评分完整性**：每个方案都必须有4个维度的评分
- **聚类完整性**：所有方案都必须归属于某个聚类

### 质量门控

#### 方案数量不足

**触发条件**：方案总数 < 10

**处理流程**：
1. 识别覆盖不足的SCAMPER维度
2. 针对稀缺维度生成更多方案
3. 降低相似度阈值以纳入更多变体
4. 扩展HMW陈述的选择范围

#### 维度覆盖不全

**触发条件**：某个SCAMPER维度没有方案

**处理流程**：
1. 识别缺失的维度
2. 回到Step 1，针对该维度补充生成方案
3. 确保每个维度至少有3个方案

#### 方案未聚类

**触发条件**：存在未归属任何聚类的方案

**处理流程**：
1. 检查未聚类方案与现有聚类的相似度
2. 若相似度低，创建新聚类
3. 若相似度高，合并到最相关的聚类

---

## 质量检查

### 完整性检查

- [ ] 7个SCAMPER维度都已覆盖
- [ ] 每个维度至少3个方案
- [ ] 至少生成10个候选方案
- [ ] 每个方案有4个维度的评分

### 质量检查

- [ ] 方案去重已完成，无明显重复
- [ ] 所有方案都有聚类归属
- [ ] 每个方案有明确的来源HMW
- [ ] 评分依据合理，符合评估标准

### 数据完整性

- [ ] 所有方案有唯一ID
- [ ] 所有方案有详细描述
- [ ] 输出格式符合规范
- [ ] 统计摘要准确

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| HMW陈述缺失 | 用户提供问题和当前方案，SCAMPER生成 | 缺乏HMW结构化数据，方案与问题可能不够聚焦 |
| 当前方案描述缺失 | 基于HMW直接生成方案，无改进基线 | 缺乏当前方案参考，替代/修改维度方案可能不够精准 |
| 竞品方案数据缺失 | 跳过竞品借鉴，基于HMW和当前方案生成 | 缺乏竞品方案参考，借鉴维度方案可能不够丰富 |
| HMW+当前方案+竞品方案均缺失 | 用户提供问题和当前方案，SCAMPER生成 | 整体置信度降低，方案维度覆盖可能不全 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户问题和当前方案SCAMPER生成 | 输出仅为基本方案列表 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| solutions | array | 是 | 方案列表，至少10个 |
| solutions[].id | string | 是 | 方案唯一标识 |
| solutions[].source_hmw | object | 是 | 来源HMW陈述 |
| solutions[].scamper_dimension | string | 是 | SCAMPER维度 |
| solutions[].solution | string | 是 | 方案标题 |
| solutions[].description | string | 是 | 方案详细描述 |
| solutions[].innovation_score | integer | 是 | 创新度评分（1-5） |
| solutions[].feasibility_score | integer | 是 | 可行性评分（1-5） |
| solutions[].impact_score | integer | 是 | 影响力评分（1-5） |
| solutions[].risk_score | integer | 是 | 风险度评分（1-5） |
| solutions[].key_assumption | string | 是 | 关键假设 |
| solutions[].cluster | string | 是 | 所属聚类ID |
| clusters | array | 是 | 聚类列表 |
| clusters[].cluster_id | string | 是 | 聚类ID |
| clusters[].cluster_name | string | 是 | 聚类名称 |
| clusters[].solution_ids | array | 是 | 聚类内方案ID列表 |
| summary | object | 是 | 统计摘要 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| HMW陈述增删 | 方案生成、维度覆盖 | 标注受影响的方案，建议人类确认是否重新生成 |
| HMW发散潜力评分变更 | 方案筛选排序 | 标注评分变更，建议人类确认是否重新排序 |
| 当前方案变更 | 替代/修改维度方案 | 标注受影响的维度方案，建议人类确认是否重新生成 |
| 竞品方案数据更新 | 借鉴维度方案 | 标注受影响的借鉴方案，建议人类确认是否补充 |

### 下游通知机制

| SCAMPER方案变更类型 | 通知范围 | 通知方式 |
|-------------------|----------|----------|
| 方案增删 | ideation-convergence | 标记方案变更，触发方案收敛重新筛选 |
| 方案评分变更 | ideation-convergence | 标记评分变更，触发筛选和排序更新 |
| 聚类变更 | ideation-convergence | 标记聚类变更，触发方案分组更新 |

---

## 最佳实践

### SCAMPER应用技巧

1. **深度思考每个维度**：不要浅尝辄止，深入挖掘每个维度的潜力
2. **跨界借鉴**：A（Adapt）维度特别适合引入其他行业的创新实践
3. **平衡创新与可行**：Generated ideas需要平衡创新性和可行性
4. **量化评估**：使用明确的评分标准，减少主观偏差
5. **迭代优化**：初稿生成后进行多轮优化和补充

### 质量控制

1. **多角度验证**：从用户、技术、业务多角度评估方案
2. **竞品对标**：与竞品方案进行对比，确保差异化
3. **专家评审**：建议人工复核AI生成的方案质量
4. **数据驱动**：基于用户研究数据验证方案价值
