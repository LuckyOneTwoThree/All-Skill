---
name: planning-resource
description: 当需要规划项目资源需求时使用。资源需求自动规划，基于项目范围、技术方案和团队能力数据，自动完成工作量估算、资源类型识别、团队能力匹配、资源冲突检测，输出完整的资源配置方案。关键词：资源规划、资源分配、人力规划、资源需求、容量规划。
metadata:
  module: "项目管理与执行"
  sub-module: "项目规划"
  type: "pipeline"
  version: "3.0"
  interaction_mode: "ai_auto"
---

# Pipeline 2: 资源需求自动规划

## 核心原则

1. **透明度即协作**：资源需求和配置方案全员可见，确保团队了解资源约束
2. **风险前置**：资源冲突和依赖风险在规划阶段即识别和预警
3. **自动化追踪**：资源状态、冲突检测、利用率自动追踪

## 交互模式

**🤖 AI自动执行**

- 所有步骤由AI自动完成
- 输出自动生成，无需人类实时参与
- 如有无法自动解决的关键冲突，输出升级请求
- 人类可在任何时候审查和调整配置方案

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| project_scope | object | 是 | output/pm-project/planning-project-charter/project_charter | 项目范围（含in_scope/out_of_scope） |
| technical_solution | object | 是 | 用户提供 | 技术方案描述 |
| team_capability_data | object | ○ | 用户提供 | 团队能力数据（技能矩阵、历史绩效） |

---

## 执行步骤

### Step 1: 工作量估算

**动作**：
- 分析项目范围，识别工作项
- 基于历史数据（相似项目）估算基准工时
- 使用AI学习模型调整估算（考虑技术复杂度、团队熟悉度）
- 汇总总工作量和人天需求

**输出**：
```json
{
  "workload_estimates": [{
    "work_item_id": "WI-001",
    "description": "string",
    "estimated_hours": number,
    "confidence": 0.0-1.0,
    "estimation_method": "historical | ai-adjusted | expert",
    "similar_historical_project": "string | null"
  }],
  "total_estimated_hours": number,
  "estimation_confidence": 0.0-1.0
}
```

### Step 2: 资源类型需求识别

**动作**：
- 分析工作项所需的技能类型
- 识别需要的人力资源类型（角色）
- 识别需要的非人力资源（工具、环境、预算）
- 按技能类型汇总需求

**输出**：
```json
{
  "resource_needs": {
    "human_resources": [{
      "role": "string",
      "skill_types": ["string"],
      "quantity_needed": number,
      "duration_days": number,
      "total_hours": number
    }],
    "non_human_resources": [{
      "type": "tool | environment | budget | external",
      "description": "string",
      "quantity": number,
      "cost_estimate": number,
      "procurement_timeline": "string"
    }]
  }
}
```

### Step 3: 团队能力匹配

**动作**：
- 加载团队能力数据（技能矩阵、可用时间、历史绩效）
- 将工作项与团队成员能力进行匹配
- 识别能力缺口
- 建议培训或外部资源补充

**输出**：
```json
{
  "team_matching": [{
    "work_item_id": "WI-001",
    "recommended_assignee": "string",
    "match_score": 0.0-1.0,
    "skill_coverage": {
      "required": ["string"],
      "covered": ["string"],
      "gaps": ["string"]
    },
    "historical_performance": "good | average | below_avg | unknown"
  }],
  "skill_gaps": [{
    "skill": "string",
    "current_capacity": number,
    "required_capacity": number,
    "gap": number,
    "recommendation": "train | hire | outsource"
  }]
}
```

### Step 4: 资源冲突检测

**动作**：
- 检查资源需求与可用资源的匹配情况
- 识别时间冲突（同一资源被多个任务需要）
- 识别技能冲突（所需技能无可用资源）
- 识别数量冲突（需求超过可用数量）

**输出**：
```json
{
  "conflict_detection": {
    "time_conflicts": [{
      "resource_id": "string",
      "conflicting_tasks": ["string"],
      "conflict_period": "date range",
      "overload_hours": number
    }],
    "skill_conflicts": [{
      "skill": "string",
      "demand": number,
      "available": number,
      "gap": number,
      "affected_tasks": ["string"]
    }],
    "capacity_conflicts": [{
      "role": "string",
      "demand": number,
      "available": number,
      "overcapacity_percentage": number
    }]
  },
  "conflict_summary": {
    "total_conflicts": number,
    "critical_conflicts": number,
    "auto_resolvable": boolean
  }
}
```

### Step 5: 资源配置方案生成

**动作**：
- 基于以上分析生成资源配置方案
- 解决可自动解决的冲突
- 对无法自动解决的冲突提出多个方案供选择
- 生成最终的资源分配时间表

**输出**：
```json
{
  "resource_allocation": {
    "assignments": [{
      "work_item_id": "WI-001",
      "assignee": "string",
      "start_date": "ISO date",
      "end_date": "ISO date",
      "allocation_percentage": 0-100,
      "status": "confirmed | tentative"
    }],
    "schedule": {
      "phases": [{
        "phase_id": "PHASE-001",
        "name": "string",
        "start_date": "ISO date",
        "end_date": "ISO date",
        "resources": ["string"],
        "key_deliverables": ["string"]
      }]
    }
  },
  "unresolved_conflicts": [{
    "conflict_type": "string",
    "description": "string",
    "options": ["string"],
    "recommendation": "string",
    "escalation_required": boolean
  }],
  "resource_plan_confidence": 0.0-1.0
}
```

---

## 输出

**存储路径**：`output/pm-project/planning-resource/`

**输出文件**：resource_plan.json、metadata.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["resource_plan", "metadata"],
  "properties": {
    "resource_plan": {"type": "object", "description": "资源计划，包含工作量估算、需求、匹配和分配"},
    "metadata": {"type": "object", "description": "元数据，包含生成时间、置信度和审核标记"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| resource_plan.workload_estimates | array | 是 | 工作量估算列表，每项须含work_item_id、estimated_hours、confidence |
| resource_plan.workload_estimates[].confidence | number | 是 | 估算置信度，范围0.0-1.0 |
| resource_plan.workload_estimates[].estimation_method | string | 是 | 估算方法，枚举值historical/ai-adjusted/expert |
| resource_plan.resource_needs.human_resources | array | 是 | 人力资源需求列表，每项须含role、quantity_needed、duration_days |
| resource_plan.resource_needs.non_human_resources | array | 否 | 非人力资源需求列表 |
| resource_plan.resource_needs.non_human_resources[].type | string | 是 | 资源类型，枚举值tool/environment/budget/external |
| resource_plan.team_matching | array | 是 | 团队匹配结果列表 |
| resource_plan.team_matching[].match_score | number | 是 | 匹配分数，范围0.0-1.0 |
| resource_plan.conflict_detection.conflict_summary.total_conflicts | number | 是 | 冲突总数 |
| resource_plan.conflict_detection.conflict_summary.critical_conflicts | number | 是 | 关键冲突数 |
| resource_plan.resource_allocation.assignments | array | 是 | 资源分配列表，每项须含work_item_id、assignee、start_date、end_date |
| resource_plan.resource_allocation.assignments[].status | string | 是 | 分配状态，枚举值confirmed/tentative |
| resource_plan.unresolved_conflicts[].escalation_required | boolean | 是 | 是否需要升级 |
| resource_plan.resource_plan_confidence | number | 是 | 整体置信度，范围0.0-1.0 |
| metadata.generated_at | string | 是 | 生成时间，ISO 8601格式 |
| metadata.confidence | number | 是 | 元数据置信度，范围0.0-1.0 |
| metadata.auto_generated | boolean | 是 | 是否自动生成 |
| metadata.requires_human_review | boolean | 是 | 是否需要人工审核 |

```json
{
  "resource_plan": {
    "workload_estimates": {},
    "resource_needs": {
      "type": "string",
      "count": number,
      "duration": "string"
    },
    "team_matching": {},
    "conflict_detection": {},
    "resource_allocation": {}
  },
  "metadata": {
    "generated_at": "ISO datetime",
    "confidence": 0.0-1.0,
    "auto_generated": true,
    "requires_human_review": boolean
  }
}
```

---

## 数据依赖

本Pipeline依赖以下上游数据：
- `project_charter.scope`：来自Pipeline 1的项目范围

---

## 决策规则

| 条件 | 动作 |
|------|------|
| 关键资源缺口 > 30% | 升级至人类决策资源配置 |
| 时间冲突无法自动排解 | 输出多个方案，升级至人类选择 |
| 团队能力数据严重缺失 | 降级输出，标注置信度低，升级至人类补充 |
| 估算置信度 < 0.5 | 标注不确定性，升级至人类确认 |

## 质量检查

- [ ] 资源估算基于WBS分解
- [ ] 关键资源缺口已识别并标注
- [ ] 时间表无资源冲突
- [ ] 估算置信度已标注

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 项目范围 | 用户提供需求列表和优先级，AI基于需求列表估算资源 | 基于需求列表的资源估算，缺少结构化范围定义支撑 |
| 技术方案 | 跳过技术复杂度调整，使用基准工时估算，标注置信度低 | 低置信度的工时估算，缺少技术复杂度因子调整 |
| 团队能力数据 | 用户提供团队人数和角色信息，AI按角色平均能力估算 | 基于平均能力的资源方案，需人工确认能力假设 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **项目范围缺失**：请用户提供需求列表（功能名称+简述+优先级），AI将基于需求列表识别工作项并估算工作量
2. **技术方案缺失**：跳过技术复杂度调整因子，使用行业基准工时估算，输出中标注估算置信度低，建议技术团队确认
3. **团队能力数据缺失**：请用户提供团队人数和角色构成（如"3名后端、2名前端、1名QA"），AI将按角色平均能力水平进行资源匹配，标注需人工确认能力假设

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 项目范围变更（需求增减/优先级调整） | 工作量估算、资源需求识别、冲突检测 | 重新估算工作量，更新资源需求和冲突检测 |
| 技术方案变更（架构调整/技术栈变化） | 技术复杂度调整、技能需求、工作量估算 | 重新评估技术复杂度，更新技能需求和工时估算 |
| 团队能力数据变更（人员变动/技能更新） | 团队匹配、能力缺口、冲突检测 | 重新执行团队匹配，更新能力缺口和冲突检测结果 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 资源配置方案变更 | Sprint规划、Kickoff会议、风险识别 | 更新resource_plan.json，通知agile-sprint-planning、planning-kickoff、risk-identification |
| 冲突检测结果变更 | 项目经理决策、资源协调 | 更新resource_plan.json，通知项目经理 |
| 技能缺口变更 | 招聘计划、培训计划 | 更新resource_plan.json，通知人力资源相关部门 |
