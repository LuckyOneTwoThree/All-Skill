---
name: requirements-prioritization
description: 当需要对需求进行优先级排序时使用。需求自动评估与排序，基于RICE评分和MoSCoW框架对需求进行优先级排序。执行角色：🤖→👤 AI建议，人类审批。关键词：需求排序、RICE评分、MoSCoW、优先级评估、需求优先级。
metadata:
  module: "产品构思与设计"
  sub-module: "需求管理"
  type: "pipeline"
  pipeline: "3"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 3：需求自动评估与排序

## 核心原则

1. **RICE是客观标尺，MoSCoW是主观判断**——RICE提供量化排序，MoSCoW融入战略考量，两者缺一不可
2. **人类拥有最终定级权**——AI建议MoSCoW分类，人类可覆盖，但覆盖需记录原因
3. **投入估算的不确定性必须显性化**——effort_confidence<0.5必须升级技术团队评估
4. **战略对齐是优先级的放大器**——与战略目标对齐的需求在RICE基础上获得额外加权

### 基本信息

| 属性 | 值 |
|------|-----|
| 执行角色 | 🤖→👤 AI建议，人类审批 |
| 输入 | requirement_analysis[] + 资源约束 |
| 输出 | requirement_prioritization[] |
| 输出目录 | output/pm-design/requirements-prioritization/ |
| 前置依赖 | Pipeline 2完成 |

---

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| requirement_analysis[] | JSON/array | 是 | output/pm-design/requirements-understanding/requirement_analysis.json | Pipeline 2输出的需求分析列表，含id、understanding、relationships、understanding_confidence等字段 |
| 资源约束 | YAML/JSON | ○ | 用户提供 | 资源约束配置，含可用人力、最大并行功能数、战略目标、截止日期 |

### 输入格式

```yaml
resource_constraints:
  available_effort: 100  # 可用人力（人天/月）
  max_concurrent_features: 5  # 最大并行功能数
  strategic_goals: ["用户增长", "商业化"]  # 当前战略目标
  deadline: "2026-06-30"  # 截止日期
```

---

## 执行步骤

### Step 1: RICE评分

**RICE公式**：
```
RICE Score = Reach × Impact × Confidence ÷ Effort
```

**各维度评分规则**：

#### Reach（影响范围）

| 评分 | 定义 | 参考标准 |
|------|------|----------|
| 1 | 极少数用户 | <5%用户群 |
| 2 | 小部分用户 | 5-20%用户群 |
| 3 | 中等部分用户 | 20-40%用户群 |
| 4 | 大部分用户 | 40-60%用户群 |
| 5 | 绝大多数用户 | >60%用户群 |

#### Impact（影响程度）

| 评分 | 定义 | 参考标准 |
|------|------|----------|
| 0 | 无影响 | 指标无变化 |
| 0.25 | 微小影响 | 核心指标<5%提升 |
| 0.5 | 低影响 | 核心指标5-10%提升 |
| 1 | 中等影响 | 核心指标10-25%提升 |
| 2 | 高影响 | 核心指标25-50%提升 |
| 3 | 巨大影响 | 核心指标>50%提升 |

#### Confidence（置信度）

| 评分 | 定义 | 参考标准 |
|------|------|----------|
| 0.5 | 低置信度 | 主要是假设，数据支撑不足 |
| 0.7 | 中置信度 | 部分数据支撑，但有不确定性 |
| 1 | 高置信度 | 数据充分支撑 |

#### Effort（投入）

| 评分 | 定义 | 参考标准 |
|------|------|----------|
| 1 | 极低投入 | <1人天 |
| 2 | 低投入 | 1-3人天 |
| 3 | 中等投入 | 3-7人天 |
| 5 | 高投入 | 7-15人天 |
| 8 | 极高投入 | 15-30人天 |
| 13 | 巨大投入 | >30人天 |

**评分输出结构**：
```json
{
  "rice_score": 12.5,
  "rice_detail": {
    "reach": { "value": 4, "note": "预计影响60%用户群" },
    "impact": { "value": 2, "note": "预计提升转化率30%" },
    "confidence": { "value": 0.8, "note": "基于竞品数据推断" },
    "effort": { "value": 5, "note": "约10人天" }
  },
  "effort_confidence": 0.7
}
```

---

### Step 2: 按RICE分数降序排列

**排序规则**：
- 主要排序维度：RICE分数（降序）
- 次要排序维度：strategic_alignment（战略对齐度高优先）

**排序输出**：
```json
{
  "priority_rank": 1,
  "rice_score": 18.7,
  "sorted_requirements": [ ... ]
}
```

---

### Step 3: MoSCoW自动建议

**分类规则**：

| 分类 | 条件 | 说明 |
|------|------|------|
| Must | RICE Top 20% + 战略对齐 | 必须做，否则目标无法达成 |
| Should | RICE Top 50% | 应该做，对目标有重要贡献 |
| Could | RICE Top 80% | 可以做，有价值但不紧急 |
| Won't | RICE Bottom 20% | 不会做，本次不考虑 |

**自动建议逻辑**：
```
IF (RICE_rank_percentile <= 0.2 AND strategic_alignment == true)
  → Must
ELSE IF (RICE_rank_percentile <= 0.5)
  → Should
ELSE IF (RICE_rank_percentile <= 0.8)
  → Could
ELSE
  → Won't
```

**战略对齐标注**：
```json
{
  "strategic_alignment": {
    "aligned": true,
    "strategic_goals": ["用户增长"],
    "alignment_strength": 0.85
  }
}
```

---

## 输出

**存储路径**：`output/pm-design/requirements-prioritization/`
**输出文件**：prioritized_requirements.json

### requirement_prioritization[] 数据结构

```json
{
  "requirement_prioritization": [
    {
      "id": "REQ-2026-0001",
      "from_pipeline_2": { ... },
      "rice_score": 18.7,
      "rice_detail": {
        "reach": { "value": 4, "note": "预计影响60%用户群" },
        "impact": { "value": 2, "note": "预计提升转化率30%" },
        "confidence": { "value": 0.8, "note": "基于竞品数据推断" },
        "effort": { "value": 5, "note": "约10人天" }
      },
      "effort_confidence": 0.7,
      "moscow_suggestion": "Must",
      "strategic_alignment": {
        "aligned": true,
        "strategic_goals": ["用户增长"],
        "alignment_strength": 0.85
      },
      "priority_rank": 1,
      "human_decision": null,
      "upgrade_reason": null
    }
  ]
}
```

### 输出字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| id | string | 关联原始需求ID |
| from_pipeline_2 | object | Pipeline 2的完整输出 |
| rice_score | float | RICE综合评分 |
| rice_detail | object | RICE各维度详细评分 |
| effort_confidence | float | 投入估算置信度 |
| moscow_suggestion | enum | AI建议分类：Must/Should/Could/Won't |
| strategic_alignment | object | 战略对齐情况 |
| priority_rank | int | 综合优先级排名 |
| human_decision | object | 人类最终决策（审批后填充） |
| upgrade_reason | string | 升级原因（可选） |

---

## 决策规则

### 投入估算置信度决策

| 置信度范围 | 动作 |
|------------|------|
| ≥ 0.5 | 使用AI估算的Effort评分 |
| < 0.5 | 升级技术团队评估，标注 `upgrade_reason: "effort_uncertainty"` |

### MoSCoW最终分类

| 动作 | 说明 |
|------|------|
| AI建议 | 基于RICE+战略对齐的自动建议 |
| 人类确认 | 最终MoSCoW分类必须由人类确认 |
| 人类可调整 | 人类可根据业务判断调整分类 |

---

## 人类审批流程

### 审批触发条件
- 投入估算置信度 < 0.5
- MoSCoW建议为Must且涉及重大投入
- 批量审批：每20个需求做一次汇总审批

### 审批操作
- **批准AI建议**：直接进入下一阶段
- **调整排序**：修改priority_rank
- **调整MoSCoW**：修改最终分类（覆盖AI建议）
- **驳回**：需求移出本次优先级列表，标注原因

### 审批输出
```json
{
  "human_decision": {
    "status": "approved|adjusted|rejected",
    "final_moscow": "Must",
    "priority_rank": 1,
    "approver": "human",
    "timestamp": "2026-05-08T10:00:00Z",
    "feedback": "审批意见"
  }
}
```

---

## 质量检查

质量检查必须在输出前完成：

| 检查项 | 标准 | 不通过动作 |
|--------|------|------------|
| RICE评分完整性 | 每个需求都有4个维度的评分 | 返回Step 1补充 |
| 数据支撑 | RICE各维度评分有数据/推断说明 | 返回Step 1补充 |
| 置信度标注 | 投入估算已标注置信度 | 返回Step 1补充 |
| MoSCoW覆盖 | 所有需求都有MoSCoW建议 | 返回Step 3补充 |
| 排序完成 | 所有需求已按优先级排序 | 返回Step 2确认 |

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 需求理解数据缺失 | 用户提供需求列表，直接RICE评分 | 缺乏需求理解数据，评分依据可能不够充分 |
| KANO/优先级评分数据缺失 | 用户提供需求列表，直接RICE评分 | 缺乏KANO和优先级数据，分类参考维度减少 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户需求列表直接RICE评分 | 输出仅为基本RICE排序 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| requirement_prioritization | array | 是 | 优先级排序后的需求列表 |
| requirement_prioritization[].id | string | 是 | 关联原始需求ID |
| requirement_prioritization[].rice_score | number | 是 | RICE综合评分 |
| requirement_prioritization[].rice_detail | object | 是 | RICE各维度详细评分 |
| requirement_prioritization[].rice_detail.reach | object | 是 | 影响范围评分 |
| requirement_prioritization[].rice_detail.impact | object | 是 | 影响程度评分 |
| requirement_prioritization[].rice_detail.confidence | object | 是 | 置信度评分 |
| requirement_prioritization[].rice_detail.effort | object | 是 | 投入评分 |
| requirement_prioritization[].effort_confidence | number | 是 | 投入估算置信度 |
| requirement_prioritization[].moscow_suggestion | string | 是 | AI建议MoSCoW分类 |
| requirement_prioritization[].strategic_alignment | object | 是 | 战略对齐情况 |
| requirement_prioritization[].priority_rank | integer | 是 | 综合优先级排名 |
| requirement_prioritization[].human_decision | object | 否 | 人类最终决策（审批后填充） |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 需求理解结果变更 | RICE评分的依据 | 标注受影响的需求，建议人类确认是否重新评分 |
| 需求增删 | RICE排序、MoSCoW分类 | 标注新增/删除的需求，建议人类确认是否重新排序 |
| 资源约束变更 | MoSCoW分类边界 | 标注约束变更，建议人类确认是否调整分类 |
| 战略目标变更 | 战略对齐评分 | 标注受影响的战略对齐评分，建议人类确认是否重新评分 |

### 下游通知机制

| 优先级排序变更类型 | 通知范围 | 通知方式 |
|-------------------|----------|----------|
| RICE评分变更 | design-prd | 标记评分变更，触发PRD优先级调整 |
| MoSCoW分类变更 | design-prd | 标记分类变更，触发PRD功能优先级更新 |
| 优先级排名变更 | design-prd | 标记排名变更，触发PRD章节排序更新 |

数据获取说明：
- 本Skill需要理解后的需求列表，请通过以下方式之一提供：
  1. 直接粘贴需求列表和优先级描述
  2. 上传requirement_analysis.json / kano.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
