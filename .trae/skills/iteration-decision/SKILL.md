---
name: iteration-decision
description: 当需要优化产品Backlog优先级或调整迭代决策时使用。迭代决策全流程，从Backlog整理、优先级评估到迭代回顾一站式完成。关键词：Backlog优化、需求池管理、需求关联、Backlog梳理、需求重组、需求池乱、先做哪个、优先级调整、迭代优先级、RICE评分、需求排序、迭代规划、加塞需求、重新排优先级、迭代复盘、Sprint复盘、持续改进、行动项追踪、迭代回顾、迭代总结、这期做得怎样。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "需求池太乱了怎么整理"
    - "backlog优先级怎么排"
    - "需求太多了先做哪个"
    - "迭代计划要调整怎么办"
    - "需求要加塞怎么排"
    - "优先级怎么重新排"
    - "这期迭代要复盘"
    - "sprint结束了怎么总结"
    - "迭代效果怎么样"
  interaction_mode: "ai_suggest_human_approve"
---

# 迭代决策全流程 🤖

## 核心原则

1. **优先级是资源分配的量化表达**：Backlog排序的本质是决定资源投向，每个排序变化都意味着资源的重新分配
2. **关联即杠杆**：识别需求间的依赖和协同关系，关联需求一起做比分散做效率高3倍
3. **技术债务是隐形成本，必须显性化**：技术债务不进Backlog就永远不会被还，必须在优先级评分中占权重
4. **优先级调整不是重新排序，而是重新分配资源**：每次调整都意味着已有承诺的打破，必须评估连锁影响
5. **变更影响评估先于调整决策**：先量化影响再决定调整，避免拍脑袋调整导致更大的混乱
6. **风险评估是调整的护栏**：每次调整必须附带风险评估，确保不会因调整引入更大的问题
7. **复盘的目的是改进不是追责**：复盘必须建立心理安全感，否则团队只会报喜不报忧
8. **数据驱动归因，而非主观印象**：用指标数据验证"感觉"，避免印象偏差掩盖真实问题
9. **改进建议必须可追踪可验证**：每条改进建议都要有责任人和验证标准，否则复盘就是走过场

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
| 需求池 | JSON数组 | 是 | 项目管理系统 → 需求池 | 用户故事、功能需求、Bug |
| 技术债务 | JSON | 是 | 代码质量平台 → 技术债务 | 债务清单、影响评估 |
| 监控告警 | JSON | ○ | output/pm-monitoring/monitoring-pipeline/告警数据 | 待解决的技术问题 |
| 用户反馈 | JSON | ○ | 反馈系统 → 用户反馈 | 投诉、功能请求、建议 |
| 当前迭代计划 | JSON | 是 | output/pm-project/agile-sprint-planning/sprint_plan | Sprint Backlog、承诺内容 |
| 触发事件 | JSON | 是 | 监控系统/反馈系统 → 触发事件 | 异常详情、反馈内容、战略变化 |
| 资源约束 | JSON | 是 | output/pm-project/planning-resource/resource_plan | 团队容量、可用时间、依赖 |
| 变更需求 | JSON | 是 | 用户提供 | 新增/修改/删除的项 |
| 迭代完成情况 | JSON | 是 | output/pm-project/agile-daily-sync/daily_sync | 已完成/未完成项、故事点 |
| 质量指标 | JSON | 是 | 测试平台/CI/CD → 质量数据 | 缺陷数、代码覆盖率、返工率 |
| 团队反馈 | JSON | ○ | Retro工具 → 团队反馈 | Retro 会议记录、投票结果 |
| 监控数据 | JSON | ○ | output/pm-monitoring/monitoring-pipeline/监控数据 | 稳定性、性能变化数据 |

## 执行步骤

### Step 1: Backlog整理（from iteration-backlog）

**目标**：整理与优化问题Backlog，完成关联分析与重组

#### 1.1 问题优先级评估

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

#### 1.2 技术债务影响分析

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

#### 1.3 关联分析

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

#### 1.4 Backlog 重组

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

### Step 2: 优先级评估（from iteration-prioritization）

**目标**：基于数据评估问题优先级，生成调整方案与风险评估

#### 2.1 变更影响评估

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

#### 2.2 调整方案生成

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

#### 2.3 风险评估

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

#### 2.4 沟通草案

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

### Step 3: 迭代回顾（from iteration-retrospective）

**目标**：回顾迭代执行效果，总结经验与改进点

#### 3.1 数据收集

**数据源**：

| 数据类型 | 数据源 | 采集方式 |
|----------|--------|----------|
| 交付数据 | 项目管理系统 | API/导出 |
| 质量数据 | 测试平台、CI/CD | API/导出 |
| 团队反馈 | Retro 工具、会议记录 | 文本/导出 |
| 监控数据 | 监控系统、日志平台 | API/导出 |

**数据收集范围**：

```yaml
data_collection:
  iteration_id: {id}
  period:
    start: {ISO8601}
    end: {ISO8601}
  delivery_data:
    planned_items: {count}
    completed_items: {count}
    planned_story_points: {points}
    completed_story_points: {points}
    carry_over_items: {count}
  quality_data:
    bugs_found: {count}
    bugs_fixed: {count}
    bug_leakage_rate: {percentage}
    code_coverage: {percentage}
    deployment_frequency: {count}
  team_feedback:
    retro_items: {count}
    top_votes: {items}
    sentiment: positive | neutral | negative
  monitoring_data:
    availability: {percentage}
    performance_change: {delta}
    incidents: {count}
```

#### 3.2 多维度分析

##### 3.2.1 交付分析

**指标**：

| 指标 | 定义 | 目标 |
|------|------|------|
| 交付完成率 | 完成故事点 / 计划故事点 | ≥ 85% |
| 交付预测准确性 | 实际 / 计划 | 0.9-1.1 |
| 需求变更率 | 变更项数 / 总项数 | < 15% |

**分析**：

```yaml
delivery_analysis:
  completion_rate: {percentage}
  velocity_actual: {points}
  velocity_planned: {points}
  velocity_accuracy: {ratio}
  change_rate: {percentage}
  carry_over_items:
    - item_id: {id}
      reason: {reason}
  assessment: good | acceptable | needs_improvement
```

##### 3.2.2 质量分析

**指标**：

| 指标 | 定义 | 目标 |
|------|------|------|
| Bug 密度 | Bug 数 / 故事点数 | < 0.5 |
| Bug 泄漏率 | 生产 Bug / 测试发现 Bug | < 5% |
| 代码覆盖率 | 覆盖代码行 / 总代码行 | ≥ 80% |

**分析**：

```yaml
quality_analysis:
  bug_density: {ratio}
  bug_leakage_rate: {percentage}
  code_coverage: {percentage}
  deployment_stability:
    success_rate: {percentage}
    rollbacks: {count}
  assessment: good | acceptable | needs_improvement
```

##### 3.2.3 协作分析

**指标**：

| 指标 | 定义 | 数据来源 |
|------|------|----------|
| 团队满意度 | 团队对迭代的满意度评分 | Retro |
| 跨团队协作 | 与其他团队的协作效果 | Retro |
| 沟通效率 | 信息对齐程度 | 主观评价 |

**分析**：

```yaml
collaboration_analysis:
  team_satisfaction_score: {score}
  top_positives:
    - {item}
  top_pain_points:
    - {item}
  cross_team_collaboration:
    score: {score}
    issues: [{issue}]
  assessment: good | acceptable | needs_improvement
```

##### 3.2.4 效率分析

**指标**：

| 指标 | 定义 | 计算方式 |
|------|------|----------|
| 团队吞吐量 | 故事点 / 人天 | 总点 / 总人天 |
| 上下文切换 | 任务中断次数 | 统计数据 |
| 阻塞时间占比 | 阻塞时间 / 总时间 | 日志统计 |

**分析**：

```yaml
efficiency_analysis:
  team_throughput: {points_per_day}
  context_switches:
    average: {count}
    total: {count}
  blocked_time_percentage: {percentage}
  dependency_issues:
    - issue: {description}
      duration: {days}
      impact: {story_points_lost}
  assessment: good | acceptable | needs_improvement
```

#### 3.3 问题识别

**问题分类**：

| 类别 | 识别方法 | 优先级 |
|------|----------|--------|
| 流程问题 | 重复出现的阻塞、变更 | P1 |
| 技术问题 | 缺陷模式、性能瓶颈 | P1 |
| 协作问题 | 沟通不畅、依赖问题 | P2 |
| 环境问题 | 工具不稳定、环境问题 | P2 |

**问题识别输出**：

```yaml
problem_identification:
  - problem_id: PRB-001
    category: process | technical | collaboration | environment
    severity: P1 | P2 | P3
    description: {description}
    evidence:
      - metric: {name}
        value: {value}
        baseline: {baseline}
        deviation: {deviation}
      - feedback: "{quote}"
    root_cause_analysis:
      - question: "为什么 {problem}？"
        answer: "{cause}"
    impact:
      items_affected: {count}
      effort_lost: {story_points}
      quality_impact: {description}
```

#### 3.4 改进建议

**建议格式**：

```yaml
improvement_suggestions:
  - suggestion_id: IMP-001
    problem_id: PRB-001
    category: process | technical | collaboration | environment
    title: {title}
    description: {description}
    expected_outcome:
      metric_improvement:
        - metric: {name}
          current: {value}
          target: {value}
    action_items:
      - action: {description}
        owner: {role}
        deadline: {date}
    effort_required:
      story_points: {points}
      time_estimate: {days}
    priority: P1 | P2 | P3
    recommendation_score: {score}
```

## 输出


**输出文件路径**：`output/pm-monitoring/iteration-decision/`
**输出Schema**：

```json
{
  "type": "object",
  "required": ["prioritized_items", "backlog_size", "trigger_id", "impact_assessment", "options", "iteration_id", "summary", "metrics_analysis"],
  "properties": {
    "generated_at": {"type": "string", "description": "生成时间"},
    "backlog_size": {"type": "object", "description": "Backlog规模，包含总条目数和总故事点"},
    "prioritized_items": {"type": "array", "description": "排序后的需求列表，包含评分、影响和关联"},
    "technical_debt_priority": {"type": "array", "description": "技术债务优先级列表，包含利息和优先级"},
    "reorganization_summary": {"type": "object", "description": "重组建议汇总，包含提升/合并/推迟/拆分数量"},
    "trigger_id": {"type": "string", "description": "触发事件ID"},
    "trigger_type": {"type": "string", "description": "触发类型：monitoring_alert/feedback/strategy_change"},
    "impact_assessment": {"type": "object", "description": "影响评估，包含范围/进度/质量影响"},
    "recommended_option": {"type": "string", "description": "推荐方案ID"},
    "options": {"type": "array", "description": "可选方案列表，包含类型、评分和权衡"},
    "needs_human_decision": {"type": "boolean", "description": "是否需要人工决策"},
    "iteration_id": {"type": "string", "description": "迭代ID"},
    "period": {"type": "object", "description": "迭代周期，包含起止时间"},
    "summary": {"type": "object", "description": "迭代总结，包含完成率、质量状态和评分"},
    "metrics_analysis": {"type": "object", "description": "指标分析，包含交付/质量/协作/效率四维度"},
    "problem_identification": {"type": "object", "description": "问题识别，包含总数和P1/P2计数"},
    "improvement_suggestions": {"type": "object", "description": "改进建议，包含总数和高优先级计数"}
  }
}
```

```
├── iteration-decision.json
├── iteration-decision.md
├── backlog/
│   ├── {iteration_id}/
│   │   ├── prioritized_items.yaml
│   │   ├── linked_issues.yaml
│   │   ├── technical_debt_impact.yaml
│   │   └── reorganization_suggestions.md
│   └── latest/
│       └── backlog_recommendation.md
├── prioritization/
│   ├── {trigger_id}/
│   │   ├── impact_assessment.yaml
│   │   ├── adjustment_options.yaml
│   │   ├── risk_assessment.yaml
│   │   ├── communication_draft.md
│   │   └── needs_human_decision: true | false
│   └── latest/
│       └── adjustment_recommendation.md
└── retrospective/
    ├── {iteration_id}/
    │   ├── summary.md
    │   ├── metrics_analysis.yaml
    │   ├── problem_identification.yaml
    │   └── improvement_suggestions.yaml
    └── latest/
        └── retrospective_report.md
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
| P0 监控异常 | 自动推荐加塞，标记需人工确认 |
| 影响 > 50% 范围 | 标记需要 PO 决策 |
| 多个可选方案 | 推荐评分最高方案，列出对比 |
| 无可用替换项 | 建议延期或拆分 |
| 团队反对 | 标记需额外沟通 |
| 完成率 < 70% | 标记重点问题，分析根本原因 |
| Bug 泄漏率 > 10% | 触发质量流程审查 |
| 团队满意度 < 3/5 | 标记协作问题，需专项改进 |
| 连续两期同类问题 | 标记为系统性缺陷 |
| 无法自动识别根因 | 建议人工专项分析 |

## 质量检查

- [ ] 优先级评分覆盖率 100%
- [ ] 关联关系识别完整
- [ ] 技术债务影响评估准确
- [ ] 重组建议可执行
- [ ] Sprint 容量匹配
- [ ] 无关键依赖遗漏
- [ ] 变更影响评估覆盖率 100%
- [ ] 调整方案数量 ≥ 2
- [ ] 风险评估完整性
- [ ] 沟通草案覆盖所有干系人
- [ ] 决策标记准确性
- [ ] 方案可执行性 ≥ 80%
- [ ] 数据收集完整率 ≥ 95%
- [ ] 分析覆盖所有四个维度
- [ ] 问题识别准确率 ≥ 80%
- [ ] 建议可执行率 ≥ 75%
- [ ] 改进建议有明确负责人
- [ ] 与上一迭代对比分析完整

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 需求池 | 用户提供当前需求列表（标题+简述），AI基于用户输入重新排序 | 基于用户输入的优先级排序，缺乏系统数据支撑 |
| 技术债务 | 跳过技术债务影响分析，优先级评分中债务权重置零 | 无债务影响的排序结果 |
| 监控告警 | 跳过告警关联分析，紧急优先策略不可用 | 无告警关联的排序结果 |
| 用户反馈 | 用户价值评分基于需求描述推断，标注低置信度 | 低置信度的用户价值评分 |
| 当前迭代计划 | 用户描述需要调整的原因和期望，AI基于描述生成调整方案 | 基于用户描述的调整方案，缺乏计划数据验证 |
| 触发事件 | 用户提供调整触发原因（异常/反馈/战略变化），AI据此评估 | 基于用户输入的影响评估 |
| 资源约束 | 跳过容量验证，方案中标注"需人工确认容量" | 无容量验证的调整方案 |
| 变更需求 | 用户口述需要增删改的项，AI整理为结构化变更需求 | 用户口述转结构化的变更清单 |
| 迭代完成情况 | 用户提供迭代完成情况（完成/未完成项、故事点），AI基于提供数据生成复盘 | 基于用户输入的复盘报告，缺乏系统数据 |
| 质量指标 | 用户提供缺陷数和返工情况，AI直接进行质量分析 | 基于用户输入的质量分析 |
| 团队反馈 | 跳过协作分析维度，标注"缺少团队反馈数据" | 缺少协作维度的复盘 |
| 监控数据 | 跳过监控数据分析，在复盘中标注"缺少稳定性数据" | 缺少稳定性维度的复盘 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **需求池缺失**：请用户提供当前需求列表，包含需求标题、简述和类型（功能/Bug/优化），AI将基于提供的信息进行优先级评分和排序
2. **技术债务缺失**：跳过债务影响分析步骤，优先级评分公式中移除债务相关权重，建议后续补充债务清单以完善排序
3. **监控告警缺失**：跳过告警关联分析，无法自动提升紧急项优先级，建议用户手动标注紧急项
4. **用户反馈缺失**：用户价值维度评分将基于需求描述推断，输出中标注该维度置信度低，建议人工确认
5. **当前迭代计划缺失**：请用户描述需要调整的原因（如"支付功能出现线上问题需要加塞"），AI将基于描述生成调整方案，包含加塞/替换/推迟等选项
6. **触发事件缺失**：请用户说明调整触发原因和紧迫程度，AI将据此进行影响评估和方案生成
7. **资源约束缺失**：方案生成时跳过容量匹配验证，所有方案标注"需人工确认团队容量是否支持"，建议后续补充资源数据
8. **迭代完成情况缺失**：请用户提供迭代完成情况，包括：计划完成的故事点/实际完成的故事点、未完成项及原因、需求变更情况，AI将基于提供的数据生成复盘报告
9. **质量指标缺失**：请用户提供关键质量数据（Bug数量、严重程度分布、返工次数），AI将据此进行质量维度分析
10. **团队反馈缺失**：跳过协作分析维度，复盘中标注该维度数据缺失，建议后续通过Retro会议补充
11. **监控数据缺失**：跳过稳定性分析，复盘中标注缺少稳定性数据，建议从监控系统导出补充

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| prioritized_items | array | 是 | 优先级排序后的需求列表，每项须含id/title/priority_score |
| prioritized_items[].priority_score | number | 是 | 优先级评分，范围0-100 |
| linked_issues | object | 否 | 关联关系，须含dependency/synergy |
| technical_debt_impact | object | 否 | 技术债务影响评估 |
| reorganization_suggestions | array | 否 | 重组建议列表 |
| impact_assessment | object | 是 | 变更影响评估，须含affected_items/scope/severity |
| adjustment_options | array | 是 | 调整方案列表，至少2个方案 |
| adjustment_options[].recommendation_score | number | 是 | 推荐评分，范围0-100 |
| risk_assessment | object | 否 | 风险评估，须含risk_level/mitigation |
| communication_draft | object | 否 | 沟通草案，须含stakeholders/message |
| iteration_id | string | 是 | 迭代ID，不可为空 |
| summary | object | 是 | 迭代总结，须含delivery_completion/quality_status/overall_score |
| metrics_analysis | object | 是 | 指标分析，须含delivery/quality/collaboration/efficiency四维度 |
| problem_identification | object | 否 | 问题识别，须含total_problems/p1_count |
| improvement_suggestions | array | 否 | 改进建议列表，每项须含负责人和验证标准 |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| 项目管理系统 | 需求状态变更 | 优先级排序和关联分析 | 重新计算优先级评分 |
| 代码质量平台 | 技术债务更新 | 债务影响评估和权重 | 更新债务权重和影响评分 |
| monitoring-pipeline | 告警数据更新 | 紧急优先策略 | 更新告警关联和优先级提升 |
| agile-sprint-planning | 迭代计划变更 | 变更影响评估基准 | 重新评估变更影响 |
| planning-resource | 资源约束变更 | 方案容量验证 | 重新验证方案可行性 |
| agile-daily-sync | 迭代完成数据更新 | 交付维度分析 | 更新完成率和故事点统计 |
| 测试平台/CI/CD | 质量指标变更 | 质量维度分析 | 更新缺陷统计和覆盖率 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| iteration-orchestrator | 迭代决策全流程完成 | 输出文件更新 | 决策完成状态和关键结论 |

## 版本历史

- v3.0: 合并 iteration-backlog + iteration-prioritization + iteration-retrospective
