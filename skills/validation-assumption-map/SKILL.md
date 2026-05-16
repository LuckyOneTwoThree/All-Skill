---
name: validation-assumption-map
description: 当需要提取和评估产品假设时使用。假设地图自动生成工具，根据方案设计和PRD，自动提取价值假设、可行性假设、可用性假设、增长假设，并进行风险评估和验证方法推荐。关键词：假设提取、风险评估、假设地图、验证方法、假设梳理、风险假设。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "软件", "通用"]
  trigger_examples:
    - "产品有哪些假设没验证"
    - "帮我梳理假设和风险"
    - "哪些假设可能不成立"
  interaction_mode: "ai_suggest_human_approve"
---

# 假设地图自动生成

## 核心原则

1. **每个功能点背后都是假设**——没有经过验证的功能点就是赌注，假设地图是赌注清单
2. **风险=影响×不确定性**——高影响+高不确定性的假设是最大风险，必须优先验证
3. **验证方法与假设类型必须匹配**——价值假设用落地页测试，可用性假设用原型测试，不可错配
4. **最大风险假设必须有验证计划**——识别风险而不规划验证，等于知道有雷却不排雷

### 基本信息

| 属性 | 值 |
|------|-----|
| Pipeline ID | 12 |
| 名称 | 假设地图自动生成 |
| 执行模式 | 🤖 AI自动执行 |
| 输入 | 方案设计输出 + PRD |

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 方案设计输出 | JSON | 是 | output/pm-design/design-prototype / output/pm-design/design-userflow | 功能列表、用户旅程、交互设计说明 |
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 问题陈述、目标用户、核心价值主张 |
| PRD结构化数据 | JSON | ○ | output/pm-design/design-prd/prd.json | PRD机器可消费版本，包含features[]，供假设提取对齐 |

### 输入格式
```json
{
  "solution_design": {
    "features": ["功能1", "功能2", ...],
    "user_journey": "用户旅程描述",
    "interaction_design": "交互设计说明"
  },
  "prd": {
    "problem_statement": "问题陈述",
    "target_users": "目标用户",
    "core_value": "核心价值主张"
  }
}
```

## 执行步骤

### Step 1: 假设提取

对每个功能点，提取以下四类假设：

| 假设类型 | 定义 | 示例 |
|----------|------|------|
| 价值假设 | 用户是否认可该功能价值 | 用户愿意为XX功能付费 |
| 可行性假设 | 技术/资源是否支撑实现 | 我们能够实现XX功能 |
| 可用性假设 | 用户是否能顺利使用 | 用户能理解XX的操作方式 |
| 增长假设 | 该功能是否能驱动增长 | XX功能能带来用户留存提升 |

**规则**: 每个功能点 → 至少1个假设

### Step 2: 假设风险评估

对每个假设进行风险评估：

| 维度 | 评分 | 说明 |
|------|------|------|
| 影响度 (Impact) | 1-5 | 假设不成立对产品的影响程度 |
| 不确定性 (Uncertainty) | 1-5 | 假设成立概率的不确定程度 |

**风险分数计算**: `risk_score = impact × uncertainty`

| 风险等级 | 分数范围 | 标识 |
|----------|----------|------|
| 高风险 | 15-25 | is_max_risk = true |
| 中风险 | 8-14 | is_max_risk = false |
| 低风险 | 1-7 | is_max_risk = false |

### Step 3: 验证方法推荐

根据假设类型，推荐验证方法：

| 假设类型 | 推荐验证方法 |
|----------|--------------|
| 价值假设 | 落地页测试、预售MVP、用户访谈、付费意愿调研 |
| 可行性假设 | 技术原型、成本估算、专家评审 |
| 可用性假设 | 原型测试、可用性测试、任务完成率分析 |
| 增长假设 | A/B测试、数据分析、用户行为追踪 |

## 输出

**存储路径**：`output/pm-design/validation-assumption-map/`
**输出文件**：assumption_map.json

```json
{
  "assumption_map": [
    {
      "id": "A001",
      "feature_id": "F001",
      "type": "value|feasibility|usability|growth",
      "assumption": "假设内容描述",
      "impact": 4,
      "uncertainty": 4,
      "risk_score": 16,
      "is_max_risk": false,
      "validation_method": "推荐验证方法",
      "validation_metric": "验证指标"
    }
  ],
  "summary": {
    "total_assumptions": 12,
    "max_risk_assumptions": ["A005", "A008"],
    "assumption_coverage": "100%"
  }
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 假设唯一标识 |
| feature_id | string | 关联的功能点ID |
| type | enum | 假设类型 |
| assumption | string | 假设内容 |
| impact | number | 影响度评分(1-5) |
| uncertainty | number | 不确定性评分(1-5) |
| risk_score | number | 风险分数(1-25) |
| is_max_risk | boolean | 是否为最大风险假设 |
| validation_method | string | 推荐验证方法 |
| validation_metric | string | 验证指标 |

**输出校验规则**：详见下方输出校验规则章节

## 决策规则

1. **最大风险假设识别**
   - 必须识别风险分数最高的假设
   - 最大风险假设必须有明确的验证计划

2. **假设验证方法**
   - 每个假设必须有对应的验证方法
   - 验证方法必须与假设类型匹配

## 质量检查

| 检查项 | 通过条件 | 检查结果 |
|--------|----------|----------|
| 功能点覆盖 | 所有功能点都有至少1个假设 | pass/fail |
| 假设风险评估 | 每个假设都有impact和uncertainty评分 | pass/fail |
| 验证方法匹配 | 验证方法与假设类型对应 | pass/fail |
| 最大风险识别 | 识别出风险分数最高的假设 | pass/fail |

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 方案设计数据缺失 | 用户提供方案描述，提取假设 | 缺乏结构化方案数据，假设覆盖可能不全 |
| PRD文档缺失 | 用户提供方案描述，提取假设 | 缺乏PRD数据，假设与需求可能脱节 |
| 方案设计+PRD均缺失 | 用户提供方案描述，提取假设 | 整体置信度降低，假设可能不够完整 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户方案描述提取假设 | 输出仅为基本假设列表 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| assumption_map | array | 是 | 假设列表 |
| assumption_map[].id | string | 是 | 假设唯一标识 |
| assumption_map[].feature_id | string | 是 | 关联功能点ID |
| assumption_map[].type | string | 是 | 假设类型（value/feasibility/usability/growth） |
| assumption_map[].assumption | string | 是 | 假设内容 |
| assumption_map[].impact | number | 是 | 影响度评分（1-5） |
| assumption_map[].uncertainty | number | 是 | 不确定性评分（1-5） |
| assumption_map[].risk_score | number | 是 | 风险分数（1-25） |
| assumption_map[].is_max_risk | boolean | 是 | 是否为最大风险假设 |
| assumption_map[].validation_method | string | 是 | 推荐验证方法 |
| assumption_map[].validation_metric | string | 是 | 验证指标 |
| summary | object | 是 | 统计摘要 |
| summary.total_assumptions | integer | 是 | 假设总数 |
| summary.max_risk_assumptions | array | 是 | 最大风险假设ID列表 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 方案设计功能增删 | 假设提取、风险评估 | 标注受影响的功能点，建议人类确认是否重新提取假设 |
| PRD核心价值变更 | 价值假设 | 标注受影响的价值假设，建议人类确认是否重新评估 |
| 原型交互变更 | 可用性假设 | 标注受影响的可用性假设，建议人类确认是否重新评估 |

### 下游通知机制

| 假设地图变更类型 | 通知范围 | 通知方式 |
|-----------------|----------|----------|
| 假设增删 | validation-mvp、validation-experiment | 标记假设变更，触发MVP范围和实验设计更新 |
| 风险评分变更 | validation-mvp、validation-experiment | 标记评分变更，触发MVP Must Have和实验优先级更新 |
| 验证方法变更 | validation-experiment | 标记方法变更，触发实验方案更新 |

---

## 使用示例

**输入**:
```
功能点: 智能推荐
PRD核心价值: 帮助用户快速发现感兴趣的内容
```

**输出**:
```json
{
  "assumption_map": [
    {
      "id": "A001",
      "feature_id": "F001",
      "type": "value",
      "assumption": "用户认为智能推荐能帮助其发现感兴趣的内容",
      "impact": 4,
      "uncertainty": 4,
      "risk_score": 16,
      "is_max_risk": true,
      "validation_method": "可用性测试",
      "validation_metric": "推荐内容点击率>15%"
    },
    {
      "id": "A002",
      "feature_id": "F001",
      "type": "usability",
      "assumption": "用户能理解推荐结果的来源和含义",
      "impact": 3,
      "uncertainty": 3,
      "risk_score": 9,
      "is_max_risk": false,
      "validation_method": "原型测试",
      "validation_metric": "任务完成率>80%"
    }
  ]
}
```
