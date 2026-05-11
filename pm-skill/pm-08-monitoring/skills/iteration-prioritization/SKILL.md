---
name: iteration-prioritization
description: 当需要调整迭代优先级时使用。迭代优先级自动调整，评估变更影响并生成调整方案，支持加塞、替换、推迟、拆分等决策。关键词：优先级调整、迭代优先级、RICE评分、需求排序、迭代规划。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 6: 迭代优先级自动调整 🤖

## 核心原则

1. **主动监控而非被动响应**：优先级调整基于监控数据触发而非人工发起
2. **归因分层**：按"变更影响→调整方案→风险评估"分层推进
3. **决策规则前置**：调整触发条件和风险容忍阈值在迭代启动时定义
4. **持续学习**：调整效果反馈到优先级模型，持续优化决策质量

### 触发条件

| 触发条件 | 描述 | 优先级 |
|----------|------|--------|
| 监控异常 | 监控系统检测到异常 | P0 |
| 重大反馈 | 大量用户投诉或重要客户反馈 | P0 |
| 战略变化 | 业务战略或市场环境重大变化 | P1 |
| 资源变化 | 团队成员增减或可用时间变化 | P2 |

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 当前迭代计划 | JSON | 是 | output/pm-project/agile-sprint-planning/sprint_plan | Sprint Backlog、承诺内容 |
| 触发事件 | JSON | 是 | 监控系统/反馈系统 → 触发事件 | 异常详情、反馈内容、战略变化 |
| 资源约束 | JSON | 是 | output/pm-project/planning-resource/resource_plan | 团队容量、可用时间、依赖 |
| 变更需求 | JSON | 是 | 用户提供 | 新增/修改/删除的项 |

## 执行步骤

### Step 1: 变更影响评估

**目标**：全面评估变更对当前迭代的影响

**影响维度**：

| 维度 | 评估内容 | 指标 |
|------|----------|------|
| 范围影响 | 哪些项需要调整 | 项数、故事点 |
| 进度影响 | 对交付时间的影响 | 天数延期 |
| 质量影响 | 对质量标准的影响 | 风险等级 |
| 团队影响 | 对团队士气和效率的影响 | 工作量变化 |
| 业务影响 | 对业务目标的影响 | KPI 变化 |

**影响计算**：

```yaml
impact_assessment:
  trigger_event:
    type: monitoring_alert | user_feedback | strategic_change | resource_change
    severity: P0 | P1 | P2
    description: {description}
  scope_impact:
    affected_items:
      - item_id: {id}
        current_status: in_progress | planned
        impact_type: replace | postpone | remove | add
        story_points_affected: {points}
    total_story_points: {points}
    percentage_of_iteration: {percentage}
  schedule_impact:
    original_end_date: {date}
    estimated_end_date: {date}
    days_delayed: {days}
  quality_impact:
    risk_level: high | medium | low
    areas_affected: [{area}]
  team_impact:
    workload_change: {percentage}
    context_switches: {count}
  business_impact:
    kpis_affected: [{kpi_name}]
    impact_assessment: {description}
```

### Step 2: 调整方案生成

**目标**：生成多个可选的调整方案

**方案类型**：

| 方案类型 | 适用场景 | 代价 |
|----------|----------|------|
| 加塞 | P0 紧急问题必须处理 | 延期其他项 |
| 替换 | 有同等价值的低优先级项 | 放弃部分功能 |
| 推迟 | 低优先级项可以延后 | 延后交付 |
| 拆分 | 部分功能可以先行交付 | 分批交付 |

**方案生成**：

```yaml
adjustment_options:
  - option_id: OPT-001
    option_type: insert | replace | postpone | split
    title: {option_title}
    description: {description}
    changes:
      items_to_add:
        - item_id: {id}
          story_points: {points}
          source: {trigger_event}
      items_to_remove:
        - item_id: {id}
          story_points: {points}
          reason: {reason}
      items_to_modify:
        - item_id: {id}
          modification: {description}
    tradeoffs:
      scope: "放弃 {feature}"
      schedule: "延期 {X} 天"
      quality: "引入 {risk}"
      business: "影响 {KPI}"
    risks:
      - risk: {description}
        likelihood: high | medium | low
        mitigation: {description}
    recommendation_score: {score}
  - option_id: OPT-002
    # 第二个方案...
```

### Step 3: 风险评估

**目标**：评估每个方案的执行风险

**风险矩阵**：

| 风险类别 | 评估维度 | 评分方法 |
|----------|----------|----------|
| 技术风险 | 复杂度、依赖、技术挑战 | 1-5 分 |
| 进度风险 | 时间压力、变更频率 | 1-5 分 |
| 质量风险 | 测试覆盖、缺陷率 | 1-5 分 |
| 沟通风险 | 干系人满意度、期望管理 | 1-5 分 |

**风险评估输出**：

```yaml
risk_assessment:
  option_id: OPT-001
  overall_risk_score: {score}
  risk_breakdown:
    technical_risk:
      score: 3
      concerns: [{concern}]
    schedule_risk:
      score: 4
      concerns: [{concern}]
    quality_risk:
      score: 2
      concerns: [{concern}]
    communication_risk:
      score: 3
      concerns: [{concern}]
  mitigation_plan:
    - risk: {description}
      strategy: avoid | mitigate | transfer | accept
      action: {description}
```

### Step 4: 沟通草案

**目标**：生成变更沟通草案

**干系人**：
- 团队成员
- 产品负责人
- 利益相关者
- 客户（如适用）

**沟通模板**：

```yaml
communication_draft:
  recipients:
    - team_members
    - product_owner
    - stakeholders
  subject: "迭代 {sprint_name} 变更通知"
  sections:
    change_summary:
      content: "{summary_text}"
    impact:
      content: "{impact_text}"
    decisions:
      content: "{decisions_text}"
    timeline:
      content: "{timeline_text}"
    questions_contact:
      content: "{contact_info}"
```

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["trigger_id", "impact_assessment", "options"],
  "properties": {
    "trigger_id": {"type": "string", "description": "触发事件ID"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "trigger_type": {"type": "string", "description": "触发类型：monitoring_alert/feedback/strategy_change"},
    "impact_assessment": {"type": "object", "description": "影响评估，包含范围/进度/质量影响"},
    "recommended_option": {"type": "string", "description": "推荐方案ID"},
    "options": {"type": "array", "description": "可选方案列表，包含类型、评分和权衡"},
    "needs_human_decision": {"type": "boolean", "description": "是否需要人工决策"}
  }
}
```

```
├── {trigger_id}/
│   ├── impact_assessment.yaml
│   ├── adjustment_options.yaml
│   ├── risk_assessment.yaml
│   ├── communication_draft.md
│   └── needs_human_decision: true | false
└── latest/
    └── adjustment_recommendation.md
```

### 优先级调整输出格式

```yaml
priority_adjustment:
  trigger_id: {id}
  generated_at: {ISO8601}
  trigger_type: monitoring_alert
  impact_assessment:
    scope_impact: {percentage}
    schedule_impact: {days}
    quality_impact: {risk_level}
  recommended_option: OPT-001
  options:
    - option_id: OPT-001
      option_type: insert
      recommendation_score: 85
      tradeoffs: {...}
    - option_id: OPT-002
      option_type: replace
      recommendation_score: 72
  needs_human_decision: true
  decision_required_for:
    - "最终方案选择"
    - "干系人沟通策略"
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| P0 监控异常 | 自动推荐加塞，标记需人工确认 |
| 影响 > 50% 范围 | 标记需要 PO 决策 |
| 多个可选方案 | 推荐评分最高方案，列出对比 |
| 无可用替换项 | 建议延期或拆分 |
| 团队反对 | 标记需额外沟通 |

## 质量检查

- [ ] 变更影响评估覆盖率 100%
- [ ] 调整方案数量 ≥ 2
- [ ] 风险评估完整性
- [ ] 沟通草案覆盖所有干系人
- [ ] 决策标记准确性
- [ ] 方案可执行性 ≥ 80%

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 影响范围 | 降级方案 | 降级输出 |
|---------------|---------|---------|---------|
| 当前迭代计划 | 无法评估变更对现有计划的影响 | 用户描述需要调整的原因和期望，AI基于描述生成调整方案 | 基于用户描述的调整方案 |
| 触发事件 | 无法确定调整的紧迫性和方向 | 用户提供调整触发原因（异常/反馈/战略变化），AI据此评估 | 基于用户输入的影响评估 |
| 资源约束 | 无法验证方案容量可行性 | 跳过容量验证，方案中标注"需人工确认容量" | 无容量验证的调整方案 |
| 变更需求 | 无法明确具体调整内容 | 用户口述需要增删改的项，AI整理为结构化变更需求 | 用户口述转结构化的变更清单 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **当前迭代计划缺失**：请用户描述需要调整的原因（如"支付功能出现线上问题需要加塞"），AI将基于描述生成调整方案，包含加塞/替换/推迟等选项
2. **触发事件缺失**：请用户说明调整触发原因和紧迫程度，AI将据此进行影响评估和方案生成
3. **资源约束缺失**：方案生成时跳过容量匹配验证，所有方案标注"需人工确认团队容量是否支持"，建议后续补充资源数据
