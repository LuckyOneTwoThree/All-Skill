---
name: iteration-backlog
description: 当需要优化产品Backlog优先级时使用。产品 Backlog 自动优化，根据问题优先级、技术债务影响和关联关系，自动重组 Backlog 优先级。关键词：Backlog优化、需求池管理、需求关联、Backlog梳理、需求重组。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 5: 产品 Backlog 自动优化 🤖

## 核心原则

1. **优先级是资源分配的量化表达**：Backlog排序的本质是决定资源投向，每个排序变化都意味着资源的重新分配
2. **关联即杠杆**：识别需求间的依赖和协同关系，关联需求一起做比分散做效率高3倍
3. **技术债务是隐形成本，必须显性化**：技术债务不进Backlog就永远不会被还，必须在优先级评分中占权重

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 需求池 | JSON数组 | 是 | 项目管理系统 → 需求池 | 用户故事、功能需求、Bug |
| 技术债务 | JSON | 是 | 代码质量平台 → 技术债务 | 债务清单、影响评估 |
| 监控告警 | JSON | ○ | output/pm-monitoring/monitoring-escalation/告警数据 | 待解决的技术问题 |
| 用户反馈 | JSON | ○ | 反馈系统 → 用户反馈 | 投诉、功能请求、建议 |

## 执行步骤

### Step 1: 问题优先级评估

**目标**：对 Backlog 中的各项进行优先级评分

**评估模型**：

```
Priority Score = Business Impact × User Value × Urgency × Effort Adjusted
```

**评分维度**：

| 维度 | 权重 | 评分标准 |
|------|------|----------|
| Business Impact | 30% | 收入影响、品牌影响、战略价值 |
| User Value | 25% | 用户请求频率、痛点强度 |
| Urgency | 25% | 告警影响、竞品威胁、合规要求 |
| Effort Adjusted | 20% | 资源需求、依赖关系、风险 |

**评分公式**：

```yaml
priority_score:
  business_impact:
    score: 0-10
    factors:
      revenue_impact: {value}
      brand_impact: {value}
      strategic_value: {value}
  user_value:
    score: 0-10
    factors:
      request_frequency: {count}
      pain_point_intensity: {value}
  urgency:
    score: 0-10
    factors:
      alert_impact: {value}
      competitive_threat: {value}
      compliance_requirement: {value}
  effort_adjusted:
    score: 0-10
    factors:
      resource_requirement: {story_points}
      dependencies: {count}
      technical_risk: {value}
  final_score: {weighted_sum}
```

### Step 2: 技术债务影响分析

**目标**：量化技术债务对业务和开发效率的影响

**影响类型**：

| 类型 | 影响指标 | 量化方法 |
|------|----------|----------|
| 开发效率 | 额外工时比例 | Sprint 内债务 vs 新功能 |
| 缺陷率 | Bug 密度 | 每千行 Bug 数 |
| 性能损耗 | 响应时间增量 | 优化前后对比 |
| 维护成本 | 代码复杂度 | Cyclomatic Complexity |

**债务分类**：

```yaml
technical_debt_impact:
  - debt_id: {id}
    category: code_quality | performance | security | architecture
    severity: critical | high | medium | low
    affected_systems: [{system}]
    metrics:
      development_overhead: {percentage}
      defect_rate_impact: {percentage}
      performance_impact: {percentage}
    affected_backlog_items: [{item_id}]
    interest_accrued: {story_points_per_sprint}
```

### Step 3: 关联分析

**目标**：识别 Backlog 项之间的依赖和关联关系

**关联类型**：

| 类型 | 说明 | 处理方式 |
|------|------|----------|
| 依赖关系 | A 必须在 B 之前 | 强制顺序 |
| 关联关系 | A 和 B 一起效果更好 | 建议组合 |
| 互斥关系 | A 和 B 不能同时做 | 标记冲突 |
| 技术债务关联 | 新功能受债务影响 | 债务优先 |

**关联输出**：

```yaml
linked_issues:
  - item_id: {id}
    dependencies:
      - depends_on: {item_id}
        type: hard | soft
        reason: {description}
    synergies:
      - related_to: {item_id}
        reason: "一起实现价值最大化"
    technical_debt_blockers:
      - debt_id: {id}
        impact: "导致开发效率降低 20%"
```

### Step 4: Backlog 重组

**目标**：基于优先级和关联关系生成重组建议

**重组策略**：

| 策略 | 适用场景 | 操作 |
|------|----------|------|
| 紧急优先 | 告警/重大 Bug | 提升优先级，标记 P0 |
| 批量组合 | 有关联的债务/功能 | 打包为 Epic |
| 延迟处理 | 低优先级长尾需求 | 移入 Icebox |
| 拆分处理 | 大颗粒度项 | 拆分为小故事 |
| 依赖排序 | 有前置依赖项 | 按依赖链排序 |

**重组建议格式**：

```yaml
reorganization_suggestions:
  - action: prioritize | combine | postpone | split | reorder
    target:
      item_id: {id}
      current_position: {position}
      suggested_position: {position}
    reason: {description}
    impact:
      effort_saved: {story_points}
      risk_reduced: {percentage}
      value_delivered: {description}
```

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["prioritized_items", "backlog_size"],
  "properties": {
    "generated_at": {"type": "string", "description": "生成时间"},
    "backlog_size": {"type": "object", "description": "Backlog规模，包含总条目数和总故事点"},
    "prioritized_items": {"type": "array", "description": "排序后的需求列表，包含评分、影响和关联"},
    "technical_debt_priority": {"type": "array", "description": "技术债务优先级列表，包含利息和优先级"},
    "reorganization_summary": {"type": "object", "description": "重组建议汇总，包含提升/合并/推迟/拆分数量"}
  }
}
```

```
├── {iteration_id}/
│   ├── prioritized_items.yaml
│   ├── linked_issues.yaml
│   ├── technical_debt_impact.yaml
│   └── reorganization_suggestions.md
└── latest/
    └── backlog_recommendation.md
```

### Backlog 优化输出格式

```yaml
backlog_optimization:
  generated_at: {ISO8601}
  backlog_size:
    total_items: {count}
    total_story_points: {points}
  prioritized_items:
    - rank: 1
      item_id: {id}
      title: {title}
      type: feature | bug | debt | enhancement
      priority_score: 9.5
      business_impact: 9
      user_value: 8
      urgency: 10
      effort_adjusted: 7
      linked_issues: [{item_ids}]
      technical_debt_impact: {description}
      suggestion: {reorganization_suggestion}
  technical_debt_priority:
    - debt_id: {id}
      interest_accrued: {points}
      priority: P1
  reorganization_summary:
    items_to_promote: {count}
    items_to_combine: {count}
    items_to_postpone: {count}
    items_to_split: {count}
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| 告警关联项 | 自动提升优先级+2（最高不超过P0） |
| 技术债务利息率≥0.7（修复成本/延迟成本） | 标记为"建议优先偿还"，优先级+1 |
| 依赖链冲突 | 按最长链优先排序，阻塞项优先级≥被阻塞项 |
| 团队容量利用率≥90% | 冻结低优先级项（评分≤3），优先高价值项 |
| 团队容量利用率70%-90% | 正常排期，低优先级项可选 |
| 新增高优先级项（评分≥8） | 评估替换当前Sprint中评分最低的项 |
| 新增中优先级项（评分5-7） | 加入Backlog，下个Sprint评估 |
| 需求评分≤3且无告警关联 | 降级为"待观察"，连续2个Sprint无进展则移除 |

## 质量检查

- [ ] 优先级评分覆盖率 100%
- [ ] 关联关系识别完整
- [ ] 技术债务影响评估准确
- [ ] 重组建议可执行
- [ ] Sprint 容量匹配
- [ ] 无关键依赖遗漏

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 需求池 | 用户提供当前需求列表（标题+简述），AI基于用户输入重新排序 | 基于用户输入的优先级排序，缺乏系统数据支撑 |
| 技术债务 | 跳过技术债务影响分析，优先级评分中债务权重置零 | 无债务影响的排序结果 |
| 监控告警 | 跳过告警关联分析，紧急优先策略不可用 | 无告警关联的排序结果 |
| 用户反馈 | 用户价值评分基于需求描述推断，标注低置信度 | 低置信度的用户价值评分 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **需求池缺失**：请用户提供当前需求列表，包含需求标题、简述和类型（功能/Bug/优化），AI将基于提供的信息进行优先级评分和排序
2. **技术债务缺失**：跳过债务影响分析步骤，优先级评分公式中移除债务相关权重，建议后续补充债务清单以完善排序
3. **监控告警缺失**：跳过告警关联分析，无法自动提升紧急项优先级，建议用户手动标注紧急项
4. **用户反馈缺失**：用户价值维度评分将基于需求描述推断，输出中标注该维度置信度低，建议人工确认

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| prioritized_items | array | 是 | 优先级排序后的需求列表，每项须含id/title/priority_score |
| prioritized_items[].priority_score | number | 是 | 优先级评分，范围0-100 |
| linked_issues | object | 否 | 关联关系，须含dependency/synergy |
| technical_debt_impact | object | 否 | 技术债务影响评估 |
| reorganization_suggestions | array | 否 | 重组建议列表 |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| 项目管理系统 | 需求状态变更 | 优先级排序和关联分析 | 重新计算优先级评分 |
| 代码质量平台 | 技术债务更新 | 债务影响评估和权重 | 更新债务权重和影响评分 |
| monitoring-escalation | 告警数据更新 | 紧急优先策略 | 更新告警关联和优先级提升 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| iteration-prioritization | Backlog优先级变更 | 写入输出文件 | 新的优先级排序和重组建议 |
| iteration-orchestrator | Backlog优化完成 | 输出文件更新 | 优化完成状态和关键结论 |
