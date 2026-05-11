---
name: agile-sprint-planning
description: 当需要规划Sprint时使用。Sprint Planning自动化，将Product Backlog转化为Sprint Backlog，包含Sprint Goal建议、Story自动选取、工作量估算、容量匹配验证，输出完整的Sprint计划。关键词：Sprint规划、Sprint计划、迭代规划、Story选取、容量匹配。
metadata:
  module: "项目管理与执行"
  sub-module: "敏捷执行"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 4: Sprint Planning自动化

## 核心原则

1. **透明度即协作**：Sprint计划全员可见，目标、Story分配、容量匹配信息透明
2. **风险前置**：Sprint Planning时识别风险和依赖，而非等到执行阶段才发现问题
3. **自动化追踪**：Sprint进度、Story状态自动追踪，减少人工汇报负担

## 交互模式

**🤖→👤 AI建议人类审批**

- AI自动完成Step 1-5，生成完整的Sprint计划
- 人类审批重点：Sprint Goal是否准确、Story选取是否合理、容量是否适当
- 人类可要求AI调整，AI重新生成
- Product Owner批准后，Sprint正式开始

---

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| product_backlog | object[] | 是 | output/pm-monitoring/iteration-backlog/prioritized_items | 产品待办列表 |
| sprint_goal | string | ○ | 用户提供 | Sprint目标描述 |
| team_capacity | object | 是 | output/pm-project/planning-resource/resource_plan | 团队容量数据 |
| sprint_duration_days | number | 是 | 用户提供 | Sprint天数 |

---

## 执行步骤

### Step 1: Sprint Goal自动建议

**动作**：
- 分析Product Backlog中的高优先级Stories
- 识别主题或功能领域
- 生成1-2句话的Sprint Goal
- 确保Goal具体、可衡量、有价值

**输出**：
```json
{
  "sprint_goal_suggestion": {
    "goal": "string",
    "focus_area": "string",
    "success_indicator": "string",
    "confidence": 0.0-1.0
  }
}
```

### Step 2: Story自动选取

**动作**：
- 按优先级排序Backlog Stories
- 考虑Story间的依赖关系
- 匹配Story与团队能力
- 贪心算法选取最优组合至容量上限

**输出**：
```json
{
  "selected_stories": [{
    "id": "STORY-001",
    "title": "string",
    "priority": "P0 | P1 | P2 | P3",
    "dependencies": ["STORY-ID"],
    "estimated_points": number,
    "recommended_assignee": "string | null",
    "selection_reason": "string"
  }],
  "rejected_stories": [{
    "id": "string",
    "reason": "string"
  }],
  "selection_confidence": 0.0-1.0
}
```

### Step 3: 工作量自动估算

**动作**：
- 为每个选入的Story估算Story Points
- 使用Planning Poker或T-Shirt Size作为参考
- 考虑技术复杂度和不确定性
- 汇总总点数

**输出**：
```json
{
  "story_points_estimation": [{
    "story_id": "STORY-001",
    "title": "string",
    "story_points": number,
    "estimation_method": "fibonacci | t-shirt | ai-suggested",
    "confidence": 0.0-1.0,
    "notes": "string"
  }],
  "total_story_points": number,
  "velocity_reference": number,
  "estimation_confidence": 0.0-1.0
}
```

### Step 4: 容量匹配验证

**动作**：
- 计算团队可用容量（人天 × 团队人数）
- 对比计划点数与容量
- 验证是否在安全范围内（建议80%利用率）
- 如超出容量，提示调整

**输出**：
```json
{
  "capacity_validation": {
    "team_capacity": {
      "total_available_hours": number,
      "story_points_capacity": number,
      "recommended_utilization": 0.0-1.0
    },
    "sprint_plan": {
      "planned_story_points": number,
      "planned_hours": number,
      "utilization_rate": 0.0-1.0
    },
    "validation_result": "green | yellow | red",
    "validation_message": "string",
    "adjustment_suggestions": ["string"]
  }
}
```

### Step 5: Sprint计划文档生成

**动作**：
- 整合以上步骤的输出
- 生成完整的Sprint计划文档
- 包含风险提示和建议
- 准备人类审批版本

**输出**：
```yaml
# sprint_plan

## Sprint信息
- Sprint编号：
- Sprint目标：
- 开始日期：
- 结束日期：
- 团队：

## Sprint Goal
{Step 1 输出}

## 计划Stories
{Step 2 & 3 输出}

## 容量验证
{Step 4 输出}

## 风险与建议
- 识别的风险：
- 建议的关注点：

## 审批
- 审批状态：待审批
```

---

## 输出

**存储路径**：`output/pm-project/agile-sprint-planning/`

**输出文件**：sprint_plan.json、metadata.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["sprint_plan", "metadata"],
  "properties": {
    "sprint_plan": {"type": "object", "description": "Sprint计划，包含目标、Story列表、容量验证和风险"},
    "metadata": {"type": "object", "description": "元数据，包含Sprint ID、置信度和审批状态"}
  }
}
```

```json
{
  "sprint_plan": {
    "sprint_goal": "string",
    "stories": [{
      "id": "string",
      "title": "string",
      "story_points": number,
      "assignee": "string",
      "status": "planned"
    }],
    "capacity_validation": {
      "status": "green | yellow | red",
      "message": "string"
    },
    "risks": [{
      "description": "string",
      "priority": "high | medium | low"
    }]
  },
  "metadata": {
    "sprint_id": "string",
    "generated_at": "ISO datetime",
    "confidence": 0.0-1.0,
    "human_approval_required": true,
    "approval_status": "pending | approved | rejected"
  }
}
```

---

## 容量计算规则

```
可用容量 = 团队人数 × 每人每天可用小时 × Sprint天数 × 利用率系数

推荐配置：
- 利用率系数：0.8（保留20%用于会议、突发情况）
- 每人每天可用小时：6小时（非8小时）
```

---

## 决策规则

| 条件 | 动作 |
|------|------|
| Backlog Stories < Sprint容量 50% | 升级至Product Owner补充需求 |
| 容量验证红色（> 100%） | 强制要求减少Story或延长Sprint |
| 依赖关系复杂导致无法选取 | 输出多个方案，升级至人类决策 |
| Story估算置信度 < 0.5 | 标注不确定性，升级至团队确认 |

## 质量检查

- [ ] Sprint Goal明确且包含≥1个可量化验收标准
- [ ] 选取的Stories总点数≤团队可用容量×1.1（预留10%缓冲）
- [ ] 100%的跨团队依赖已识别并有解决方案或时间表
- [ ] 每个Story估算经≥2名团队成员确认
- [ ] Sprint包含≥1个技术债务或改进项（如有积压）
- [ ] 无P0级风险未纳入Sprint考量

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 影响范围 | 降级方案 | 降级输出 |
|---------------|---------|---------|---------|
| Product Backlog | 无法选取和排序Stories | 用户提供需求列表（标题+优先级+估算），AI据此生成Sprint计划 | 基于用户输入的Sprint计划 |
| Sprint目标 | 无法确定Sprint聚焦方向 | AI基于高优先级Stories自动推断Sprint Goal，标注需PO确认 | AI推断的Sprint Goal |
| 团队容量 | 无法验证计划可行性 | 跳过容量验证，计划中标注"需人工确认容量匹配" | 无容量验证的Sprint计划 |
| Sprint天数 | 无法确定Sprint时间范围 | 若用户未提供Sprint天数，提示用户提供或跳过该输入相关步骤 | — |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **Product Backlog缺失**：请用户提供需求列表，包含需求标题、优先级（P0-P3）和粗略估算，AI将据此进行Story选取和Sprint计划生成
2. **Sprint目标缺失**：AI将基于最高优先级Stories自动推断Sprint Goal，输出中标注"AI推断，需Product Owner确认"
3. **团队容量缺失**：跳过容量匹配验证步骤，Sprint计划中标注"需人工确认团队容量是否支持"，建议与团队确认后再提交审批
