---
name: ideation-hmw
description: 当需要基于问题陈述生成HMW创意时使用。HMW（How Might We）批量生成工具，根据问题陈述和用户研究数据，从6个维度系统化生成HMW陈述，并进行质量检查与评分。关键词：HMW、创意问题陈述、需求挖掘、产品洞察。
metadata:
  module: "产品构思与设计"
  sub-module: "创意发散与方案构思"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 4：HMW批量生成

## 核心原则

1. **批量生成人类筛选**：AI批量生成分类/排序建议，人类做最终筛选和判定
2. **结构化发散**：用固定模板和框架引导需求拆解，避免遗漏和随意性
3. **假设驱动而非功能驱动**：每个需求背后必须还原为用户假设，而非直接进入功能设计
4. **设计规范即约束**：需求分析阶段就引入设计规范约束，避免后期返工

HMW（How Might We）是一种经典的创意启发工具，它将问题陈述转化为开放性的问题，激发多元化的解决方案。本Pipeline通过系统化的方法，从多个维度批量生成高质量的HMW陈述，为后续的方案构思奠定基础。

### 执行角色

🤖 **AI自动执行**

本Pipeline完全由AI自动执行，无需人工干预。AI将根据输入的问题陈述和用户研究数据，批量生成经过质量验证的HMW陈述。

---

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| Problem Statement | string | 是 | output/pm-design/requirements-understanding / 用户提供 | 清晰、具体地描述需要解决的问题，避免过于抽象或宽泛 |
| User Research Data | JSON/object | 是 | output/pm-design/requirements-collection / 用户提供 | 包含至少一种类型的用户研究数据（访谈、问卷或行为数据），确保HMW生成有据可依 |

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
  }
}
```

---

## 执行步骤

### Step 1：从6个维度生成HMW

AI需要从以下6个维度为每个核心问题生成HMW陈述：

#### 维度说明

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

#### 生成要求

- 每个维度至少生成2-3个HMW陈述
- HMW陈述应该：
  - 以"How might we"开头
  - 足够具体以指导方案生成
  - 足够开放以保留发散空间
  - 直接关联用户研究数据中的洞察

#### 示例

**问题**：用户在使用移动应用时，经常在中途放弃完成订单

**维度生成示例**：
- **消除障碍**：How might we eliminate the friction points that cause users to abandon checkout?
- **降低门槛**：How might we reduce the number of steps required to complete a purchase?
- **加速达成**：How might we speed up the payment process to match user expectations?
- **增强感知**：How might we help users understand the value of completing their purchase?
- **扩展场景**：How might we enable users to complete purchases in interrupted sessions?
- **重新定义**：How might we reimagine checkout as an enjoyable experience rather than a barrier?

---

### Step 2：HMW质量检查

对每个生成的HMW陈述进行质量检查，确保其符合以下标准：

#### 检查维度

1. **是否过于宽泛**
   - 检查：HMW是否涵盖过多问题，导致无法指导具体方案
   - 修复建议：缩小问题范围，聚焦单一痛点

2. **是否预设方案**
   - 检查：HMW是否已经暗示了特定解决方案
   - 修复建议：重新表述为更开放的问题形式

3. **是否具体**
   - 检查：HMW是否足够具体，能够指导方案方向
   - 修复建议：添加更多上下文或限制条件

4. **是否有发散空间**
   - 检查：HMW是否保留了多种可能的解决路径
   - 修复建议：移除过于具体的约束，扩展问题边界

#### 质量评估标准

每个HMW必须同时满足：
- ❌ 不是过于宽泛
- ❌ 不预设方案
- ✅ 足够具体
- ✅ 有发散空间

#### 质量检查结果

质量检查后，每条HMW将标记为：
- `"quality_check": "passed"` - 通过所有检查
- `"quality_check": "failed"` - 未通过，需要重新生成

---

### Step 3：HMW评分

对通过质量检查的HMW陈述进行发散潜力评分：

#### 评分维度

**发散潜力（Divergence Potential）**：1-5分

评估标准：
- **1分**：只能想到1-2种解决方案
- **2分**：能想到2-3种相关解决方案
- **3分**：能想到3-5种解决方案
- **4分**：能想到5-8种多样化的解决方案
- **5分**：能想到8种以上高度多样化的解决方案

#### 评分标准

发散潜力的高低取决于：
1. **问题开放性**：问题越开放，解决方案越多
2. **维度多样性**：可从多个角度切入解决问题
3. **技术中立性**：不绑定特定技术实现方式
4. **用户价值**：直接关联用户核心需求或痛点

---

## 输出

**存储路径**：`output/pm-design/ideation-hmw/`
**输出文件**：hmw_questions.json

### 数据结构

```json
{
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
  ]
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | HMW陈述唯一标识符 |
| statement | string | HMW陈述文本 |
| dimension | string | 主要所属维度 |
| source_problem | string | 关联的核心问题 |
| source_data | object | 来源的用户研究数据 |
| divergence_potential | integer | 发散潜力评分（1-5） |
| quality_check | string | 质量检查结果（passed/failed） |
| quality_issues | array | 质量问题列表（若有） |
| related_dimensions | array | 可能涉及的辅助维度 |

### 输出统计

```json
{
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
```

---

## 决策规则

### 通过条件

1. **质量检查**：所有HMW必须通过质量检查
2. **维度覆盖**：6个维度都必须有HMW覆盖
3. **数据支撑**：每条HMW必须有对应的用户研究数据支撑
4. **评分完成**：所有HMW都必须完成发散潜力评分

### 失败处理

#### 失败场景1：HMW未通过质量检查

**处理流程**：
1. 识别未通过质量检查的HMW
2. 分析质量问题类型
3. 针对具体问题重新生成HMW
4. 重新进行质量检查
5. 重复直到所有HMW通过

#### 失败场景2：维度覆盖不全

**处理流程**：
1. 检查6个维度的HMW数量
2. 识别缺失或数量不足的维度
3. 针对性为缺失维度生成更多HMW
4. 确保每个维度至少6个HMW

#### 失败场景3：缺乏数据支撑

**处理流程**：
1. 检查HMW是否关联到用户研究数据
2. 若缺乏支撑，返回输入阶段补充用户研究数据
3. 或者调整HMW表述，使其更紧密地关联现有数据

---

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|------------|
| 维度覆盖 | 6个维度都已覆盖 | 标注"维度缺失"，补充缺失维度的HMW陈述 |
| 维度HMW数量 | 每个维度至少6个HMW陈述 | 标注"数量不足"，针对不足维度补充生成HMW |
| 数据支撑 | 每条HMW有用户研究数据支撑 | 标注"缺乏数据支撑"，关联现有数据或返回输入阶段补充 |
| 发散潜力评分 | 所有HMW已完成发散潜力评分 | 标注"评分缺失"，补充评分后重新排序 |
| HMW宽泛性 | 没有过于宽泛的HMW | 标注"过于宽泛"，缩小问题范围重新生成 |
| HMW预设方案 | 没有预设方案的HMW | 标注"预设方案"，重新表述为开放性问题形式 |
| HMW具体性 | 所有HMW足够具体 | 标注"不够具体"，添加上下文或限制条件 |
| HMW发散空间 | 所有HMW有发散空间 | 标注"发散不足"，移除过具体约束，扩展问题边界 |
| 唯一ID | 所有HMW有唯一ID | 标注"ID缺失"，补充唯一标识符 |
| 数据关联 | 所有HMW关联到source_data | 标注"关联缺失"，补充source_data关联 |
| 输出格式 | 输出格式符合规范 | 标注"格式异常"，修正为标准输出格式 |
| 统计准确性 | 统计数据准确 | 标注"统计有误"，重新计算统计数据 |

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游文件 | 降级方案 |
|---------------|---------|
| problem-statement.json | 用户描述问题 → 直接生成HMW，标注"缺乏结构化Problem Statement" |
| 用户研究数据（voice-analysis / persona） | 用户描述问题 → 直接生成HMW，标注"缺乏用户研究数据支撑" |
| problem-statement.json + 用户研究数据 | 用户描述问题 → 直接生成HMW，整体置信度降低 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户口头描述的问题直接生成HMW |

数据获取说明：
- 本Skill需要Problem Statement和用户研究数据，请通过以下方式之一提供：
  1. 直接描述问题和用户痛点
  2. 上传problem-statement.json / persona.json / voice-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

---

## 最佳实践

### HMW生成技巧

1. **从小问题开始**：将大问题拆分为小的、可操作的问题
2. **保持积极语气**：用积极的语言表达问题，避免负面表述
3. **聚焦用户目标**：从用户角度出发，关注用户想要达成的目标
4. **避免技术绑定**：不预设技术实现方式，保持解决方案的多样性
5. **平衡具体与开放**：足够具体以指导方向，足够开放以保留创新空间

### 质量控制

1. **迭代优化**：初稿生成后进行多轮优化
2. **交叉验证**：用用户研究数据验证HMW的相关性
3. **同行评审**：建议人工复核AI生成的HMW质量
4. **持续更新**：根据方案生成效果反馈优化HMW生成策略
