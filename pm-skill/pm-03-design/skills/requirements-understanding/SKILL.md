---
name: requirements-understanding
description: 当需要深入理解需求背后的真实问题时使用。需求自动理解与拆解，将分类后的需求还原为真实问题，分析需求间的关联关系。执行角色：🤖→👤 AI建议，人类审批。关键词：需求理解、需求拆解、问题还原、需求关联、需求分析。
metadata:
  module: "产品构思与设计"
  sub-module: "需求管理"
  type: "pipeline"
  pipeline: "2"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 2：需求自动理解与拆解

## 核心原则

1. **需求背后是问题，问题背后是假设**——每个需求必须还原为用户假设，而非直接进入功能设计
2. **低可信度需求必须逆向还原**——"老板说""竞品有"类需求必须还原真实诉求
3. **关联关系是需求的经络**——独立需求是例外，关联需求是常态
4. **理解置信度是通行证**——置信度<0.6的需求不能进入下一阶段

### 基本信息

| 属性 | 值 |
|------|-----|
| 执行角色 | 🤖→👤 AI建议，人类审批 |
| 输入 | requirements[] (Pipeline 1输出) |
| 输出 | requirement_analysis[] |
| 输出目录 | output/pm-design/requirements-understanding/ |
| 前置依赖 | Pipeline 1完成 |

---

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| requirements[] | JSON/array | 是 | output/pm-design/requirements-collection/requirements.json | Pipeline 1输出的已分类需求列表，含id、category、original_text、source_credibility等字段 |

---

## 执行步骤

### Step 1: 需求拆解

**理解模板（5项必填）**：

| 维度 | 问题 | 说明 |
|------|------|------|
| 用户是谁 | Who | 原始需求背后是哪种用户/角色 |
| 使用场景 | Where/When | 用户在什么场景下产生这个需求 |
| 核心问题 | What Problem | 用户遇到的核心问题是什么 |
| 当前解决方案 | Current Solution | 用户目前如何解决这个问题 |
| 理想状态 | Ideal State | 用户期望的完美解决方案是什么 |

**拆解规则**：
- 每项必须填充，无法确定的标注"待确认"
- 原始文本直接引用用引号标注
- 推断内容标注置信度

**输出**：`requirement_understanding{}`

---

### Step 2: 真实问题还原

**适用条件**：source_credibility < 0.6 的需求

**还原规则**：

| 来源类型 | 还原方向 | 还原问题示例 |
|----------|----------|--------------|
| 老板说 | 还原真实诉求 | "老板说要做社交" → "老板真正想要的是什么？用户增长？变现？还是竞品压力？" |
| 竞品有 | 还原用户期望 | "竞品上了AI助手" → "用户期望从AI助手中获得什么？效率？体验？还是功能？" |
| 业务转述 | 还原一线观察 | "业务说用户需要X" → "一线观察到的具体场景是什么？" |

**还原结构**：
```
原始需求 → 表面问题 → 深层问题 → 真实需求
```

**输出**：`restoration_analysis{}`

---

### Step 3: 需求关联分析

**关联类型**：

| 类型 | 符号 | 说明 |
|------|------|------|
| 依赖关系 | depends_on | A的实现依赖B先完成 |
| 互斥关系 | excludes | A和B不能同时实现 |
| 聚类关系 | clusters_with | A和B属于同一个用户旅程 |
| 增强关系 | enhances | A的存在使B价值提升 |

**分析规则**：
- 每个需求必须标注至少一种关联（无关联标注"独立需求"）
- 关联关系需给出置信度
- 跨类别关联（Bug/优化/新功能）需特别标注

**输出**：`requirement_relationships[]`

---

## 输出

**存储路径**：`output/pm-design/requirements-understanding/`
**输出文件**：requirement_analysis.json

### requirement_analysis[] 数据结构

```json
{
  "requirement_analysis": [
    {
      "id": "REQ-2026-0001",
      "original_requirement": { ... },
      "understanding": {
        "who": "中小电商商家的运营人员",
        "where_when": "每天上午查看昨日销售数据时",
        "what_problem": "现有报表加载慢，无法快速定位问题",
        "current_solution": "等待加载+凭记忆判断",
        "ideal_state": "3秒内看到关键指标和异常预警",
        "confidence": 0.88
      },
      "restoration_needed": false,
      "restoration_analysis": null,
      "relationships": [
        {
          "type": "clusters_with",
          "related_id": "REQ-2026-0003",
          "confidence": 0.92,
          "note": "都属于数据分析场景"
        }
      ],
      "understanding_confidence": 0.88,
      "pending_human_review": false,
      "ai_suggestions": ["建议优先处理，与REQ-2026-0003打包"],
      "human_approval": null
    }
  ]
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 关联原始需求ID |
| original_requirement | object | Pipeline 1输出的原始需求 |
| understanding | object | 5项理解模板结果 |
| restoration_needed | boolean | 是否需要问题还原 |
| restoration_analysis | object | 还原分析结果（可选） |
| relationships | array | 关联关系列表 |
| understanding_confidence | float | 理解置信度，0-1 |
| pending_human_review | boolean | 是否需要人工审批 |
| ai_suggestions | array | AI补充建议 |
| human_approval | object | 人类审批结果 |

---

## 决策规则

### 理解置信度决策

| 置信度范围 | 动作 |
|------------|------|
| ≥ 0.6 | 自动通过，进入下一阶段 |
| < 0.6 | 升级人类确认，标注具体问题点 |

---

## 人类审批流程

### 审批触发条件
- AI理解置信度 < 0.6
- restoration_needed = true 且 restoration_analysis 已完成
- 批量审批：每10个需求做一次汇总审批

### 审批操作
- **批准**：直接进入下一Pipeline
- **修改后批准**：调整understanding后进入下一Pipeline
- **驳回**：返回重新理解，附带修改意见

### 审批输出
```json
{
  "human_approval": {
    "status": "approved|modified|rejected",
    "approver": "human",
    "timestamp": "2026-05-08T10:00:00Z",
    "feedback": "可选的修改意见或审批备注"
  }
}
```

---

## 质量检查

质量检查必须在输出前完成：

| 检查项 | 标准 | 不通过动作 |
|--------|------|------------|
| 理解模板填充 | 5项理解维度全部填充 | 返回Step 1补充 |
| 还原分析执行 | 所有source_credibility<0.6的需求已完成还原 | 返回Step 2补充 |
| 关联关系标注 | 每个需求至少有一条关联标注 | 返回Step 3补充 |
| 置信度标注 | 理解置信度已给出 | 返回Step 1补充 |

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 分类后需求列表缺失 | 用户口述需求，直接理解拆解 | 缺乏结构化需求输入，理解模板可能不够完整 |
| 所有上游文件均缺失 | 提示用户先执行需求收集阶段，或基于用户口述需求直接理解拆解 | 输出仅为基本理解框架 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| requirement_analysis | array | 是 | 需求分析列表 |
| requirement_analysis[].id | string | 是 | 关联原始需求ID |
| requirement_analysis[].understanding | object | 是 | 5项理解模板结果 |
| requirement_analysis[].understanding.who | string | 是 | 用户是谁 |
| requirement_analysis[].understanding.where_when | string | 是 | 使用场景 |
| requirement_analysis[].understanding.what_problem | string | 是 | 核心问题 |
| requirement_analysis[].understanding.current_solution | string | 是 | 当前解决方案 |
| requirement_analysis[].understanding.ideal_state | string | 是 | 理想状态 |
| requirement_analysis[].restoration_needed | boolean | 是 | 是否需要问题还原 |
| requirement_analysis[].relationships | array | 是 | 关联关系列表 |
| requirement_analysis[].understanding_confidence | number | 是 | 理解置信度（0-1） |
| requirement_analysis[].pending_human_review | boolean | 是 | 是否需要人工审批 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 需求列表增删 | 理解模板、关联关系 | 标注新增/删除的需求，建议人类确认是否重新理解 |
| 需求分类变更 | 问题还原判断 | 标注分类变更，建议人类确认是否需要重新还原 |
| 需求可信度变更 | 问题还原触发条件 | 标注可信度变更，建议人类确认是否需要补充还原 |

### 下游通知机制

| 需求理解变更类型 | 通知范围 | 通知方式 |
|-----------------|----------|----------|
| 理解模板变更 | requirements-prioritization | 标记理解变更，触发RICE评分更新 |
| 问题还原结果变更 | requirements-prioritization | 标记还原变更，触发优先级评估更新 |
| 关联关系变更 | requirements-prioritization | 标记关联变更，触发需求分组更新 |

数据获取说明：
- 本Skill需要分类后的需求列表，请通过以下方式之一提供：
  1. 直接口述需求内容
  2. 上传requirements.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
