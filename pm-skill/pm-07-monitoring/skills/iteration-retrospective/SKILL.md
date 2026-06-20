---
name: iteration-retrospective
description: 当需要辅助迭代回顾时使用。迭代回顾工具，负责完成情况分析、问题识别、改进建议和沟通草稿生成。关键词：迭代回顾、完成分析、问题识别、改进建议、Retro。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "软件", "通用"]
  trigger_examples:
    - "这期迭代要复盘"
    - "sprint结束了怎么总结"
    - "迭代效果怎么样"
    - "迭代计划要调整怎么办"
    - "需求要加塞怎么排"
  interaction_mode: "human_ai_collaborate"
execution_depth:
  default: standard
  quick_description: "仅输出迭代回顾核心结论"
  deep_description: "完整回顾 + 变更影响评估 + 调整方案 + 风险评估 + 沟通草案 + 竞品迭代对比"
---

# 迭代回顾与调整 🤖

## 核心原则

1. **复盘的目的是改进不是追责**：复盘必须建立心理安全感，否则团队只会报喜不报忧
2. **数据驱动归因，而非主观印象**：用指标数据验证"感觉"，避免印象偏差掩盖真实问题
3. **改进建议必须可追踪可验证**：每条改进建议都要有责任人和验证标准，否则复盘就是走过场
4. **优先级调整不是重新排序，而是重新分配资源**：每次调整都意味着已有承诺的打破，必须评估连锁影响
5. **变更影响评估先于调整决策**：先量化影响再决定调整，避免拍脑袋调整导致更大的混乱
6. **风险评估是调整的护栏**：每次调整必须附带风险评估，确保不会因调整引入更大的问题

### 触发条件

| 触发条件 | 描述 | 优先级 |
|----------|------|--------|
| 监控异常 | 监控系统检测到异常 | P0 |
| 重大反馈 | 大量用户投诉或重要客户反馈 | P0 |
| 战略变化 | 业务战略或市场环境重大变化 | P1 |
| 资源变化 | 团队成员增减或可用时间变化 | P2 |
| 迭代结束 | Sprint周期结束，需要回顾 | P1 |

## 基本信息

| 项目 | 值 |
|------|-----|
| 模块 | 产品监控与迭代 |
| 子模块 | 迭代优化 |
| 类型 | pipeline |
| 版本 | 2.0 |
| 交互模式 | 人机协作 |
| 执行深度 | standard（默认） |

## 交互模式

👤↔🤖 人机协作

- 人类提供迭代执行情况、团队反馈和调整需求
- AI自动完成数据分析、问题识别、改进建议生成和调整方案评估
- 人类审批重点：问题归因是否准确、改进建议是否可执行、调整方案风险是否可接受
- 人类可要求AI补充分析维度或调整方案，AI重新生成
- 改进建议和调整方案经团队确认后正式生效

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 当前迭代计划 | JSON | 是 | output/pm-project/agile-sprint-planning/sprint_plan | Sprint Backlog、承诺内容，作为回顾和调整的基准 |
| 迭代完成情况 | JSON | 是 | output/pm-project/agile-daily-sync/daily_sync | 已完成/未完成项、故事点，用于完成情况分析 |
| 资源约束 | JSON | ○ | output/pm-project/planning-resource/resource_plan | 团队容量、可用时间、依赖，用于调整方案容量验证 |
| 触发事件 | JSON | ○ | 监控系统/反馈系统 → 触发事件 | 异常详情、反馈内容、战略变化，用于变更影响评估 |
| 变更需求 | JSON | ○ | 用户提供 | 新增/修改/删除的项，用于调整方案生成 |
| 质量指标 | JSON | 是 | 测试平台/CI/CD → 质量数据 | 缺陷数、代码覆盖率、返工率，用于质量分析 |
| 团队反馈 | JSON | ○ | Retro工具 → 团队反馈 | Retro 会议记录、投票结果，用于协作分析 |
| 监控数据 | JSON | ○ | output/pm-monitoring/monitoring-alert-detection/监控数据 | 稳定性、性能变化数据，用于稳定性分析 |
| 监控告警 | JSON | ○ | output/pm-monitoring/monitoring-alert-detection/告警数据 | 迭代期间的告警，用于问题识别 |

**重要**：本 Skill 依赖 pm-08 模块输出（agile-sprint-planning/sprint_plan, agile-daily-sync/daily_sync），这是单向依赖，不构成循环。iteration-backlog-grooming → agile-sprint-planning → iteration-retrospective 形成清晰的单向数据流。

## 执行步骤

### Step 1: 变更影响评估 [核心]

**目标**：基于触发事件评估对当前迭代的影响，为调整决策提供量化依据

#### 1.1 影响维度评估 [核心]

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
    description: 支付服务错误率突增
  scope_impact:
    affected_items:
      - item_id: US-110
        current_status: in_progress | planned
        impact_type: replace | postpone | remove | add
        story_points_affected: 5
    total_story_points: 5
    percentage_of_iteration: 15%
  schedule_impact:
    original_end_date: 2026-06-30
    estimated_end_date: 2026-07-03
    days_delayed: 3
  quality_impact:
    risk_level: high | medium | low
    areas_affected: [payment, checkout]
  team_impact:
    workload_change: +10%
    context_switches: 2
  business_impact:
    kpis_affected: [payment_success_rate, conversion_rate]
    impact_assessment: 支付成功率下降影响GMV
```

#### 1.2 调整方案生成 [核心]

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
    title: 加塞支付修复并推迟报表优化
    description: 将支付修复插入当前迭代，报表优化推迟至下迭代
    changes:
      items_to_add:
        - item_id: US-201
          story_points: 5
          source: monitoring_alert
      items_to_remove:
        - item_id: US-105
          story_points: 5
          reason: 优先级低于支付修复
      items_to_modify:
        - item_id: US-110
          modification: 拆分为前端和后端两个子任务
    tradeoffs:
      scope: "放弃 报表导出功能"
      schedule: "延期 3 天"
      quality: "引入 测试覆盖不足风险"
      business: "影响 报表相关KPI"
    risks:
      - risk: 测试时间压缩可能导致缺陷泄漏
        likelihood: high | medium | low
        mitigation: 增加回归测试用例覆盖
    recommendation_score: 78
```

#### 1.3 风险评估 [条件]

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
  overall_risk_score: 3.5
  risk_breakdown:
    technical_risk:
      score: 3
      concerns: [支付模块复杂度高]
    schedule_risk:
      score: 4
      concerns: [迭代时间已过半]
    quality_risk:
      score: 2
      concerns: [回归测试覆盖充分]
    communication_risk:
      score: 3
      concerns: [需同步PO和干系人]
  mitigation_plan:
    - risk: 测试时间不足
      strategy: avoid | mitigate | transfer | accept
      action: 增加测试资源并优先回归测试
```

#### 1.4 沟通草案 [深度]

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
  subject: "迭代 Sprint-26 变更通知"
  sections:
    change_summary:
      content: "因支付服务告警，本次迭代加塞支付修复任务"
    impact:
      content: "影响范围：2个故事点替换，迭代延期3天"
    decisions:
      content: "决策：加塞US-201，推迟US-105至下迭代"
    timeline:
      content: "新计划完成日期：2026-07-03"
    questions_contact:
      content: "如有疑问请联系PO张三"
```

### Step 2: 数据收集 [条件]

**目标**：收集迭代执行期间的交付、质量、团队反馈和监控数据

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
  iteration_id: Sprint-26
  period:
    start: 2026-06-01T00:00:00Z
    end: 2026-06-15T00:00:00Z
  delivery_data:
    planned_items: 12
    completed_items: 10
    planned_story_points: 40
    completed_story_points: 36
    carry_over_items: 2
  quality_data:
    bugs_found: 18
    bugs_fixed: 15
    bug_leakage_rate: 4%
    code_coverage: 82%
    deployment_frequency: 3
  team_feedback:
    retro_items: 8
    top_votes: [需求变更频繁, 测试环境不稳定]
    sentiment: positive | neutral | negative
  monitoring_data:
    availability: 99.2%
    performance_change: +50ms
    incidents: 1
```

### Step 3: 多维度分析 [条件]

**目标**：从交付、质量、协作、效率四个维度分析迭代执行效果

#### 3.1 交付分析 [条件]

**指标**：

| 指标 | 定义 | 目标 |
|------|------|------|
| 交付完成率 | 完成故事点 / 计划故事点 | ≥ 85% |
| 交付预测准确性 | 实际 / 计划 | 0.9-1.1 |
| 需求变更率 | 变更项数 / 总项数 | < 15% |

**分析**：

```yaml
delivery_analysis:
  completion_rate: 90%
  velocity_actual: 36
  velocity_planned: 40
  velocity_accuracy: 0.9
  change_rate: 12%
  carry_over_items:
    - item_id: US-108
      reason: 依赖外部接口未就绪
  assessment: good | acceptable | needs_improvement
```

#### 3.2 质量分析 [条件]

**指标**：

| 指标 | 定义 | 目标 |
|------|------|------|
| Bug 密度 | Bug 数 / 故事点数 | < 0.5 |
| Bug 泄漏率 | 生产 Bug / 测试发现 Bug | < 5% |
| 代码覆盖率 | 覆盖代码行 / 总代码行 | ≥ 80% |

**分析**：

```yaml
quality_analysis:
  bug_density: 0.5
  bug_leakage_rate: 4%
  code_coverage: 82%
  deployment_stability:
    success_rate: 95%
    rollbacks: 1
  assessment: good | acceptable | needs_improvement
```

#### 3.3 协作分析 [深度]

**指标**：

| 指标 | 定义 | 数据来源 |
|------|------|----------|
| 团队满意度 | 团队对迭代的满意度评分 | Retro |
| 跨团队协作 | 与其他团队的协作效果 | Retro |
| 沟通效率 | 信息对齐程度 | 主观评价 |

**分析**：

```yaml
collaboration_analysis:
  team_satisfaction_score: 3.8
  top_positives:
    - 跨团队协作顺畅
  top_pain_points:
    - 需求变更沟通不及时
  cross_team_collaboration:
    score: 3.5
    issues: [接口联调延迟]
  assessment: good | acceptable | needs_improvement
```

#### 3.4 效率分析 [深度]

**指标**：

| 指标 | 定义 | 计算方式 |
|------|------|----------|
| 团队吞吐量 | 故事点 / 人天 | 总点 / 总人天 |
| 上下文切换 | 任务中断次数 | 统计数据 |
| 阻塞时间占比 | 阻塞时间 / 总时间 | 日志统计 |

**分析**：

```yaml
efficiency_analysis:
  team_throughput: 0.9
  context_switches:
    average: 3
    total: 24
  blocked_time_percentage: 15%
  dependency_issues:
    - issue: 等待设计团队交付视觉稿
      duration: 2
      impact: 5
  assessment: good | acceptable | needs_improvement
```

### Step 4: 问题识别 [条件]

**目标**：基于多维度分析识别迭代中的问题，进行根因分析

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
    description: 需求在迭代中途变更2次
    evidence:
      - metric: change_rate
        value: 12%
        baseline: 5%
        deviation: +7%
    root_cause_analysis:
      - question: "为什么 需求变更频繁？"
        answer: "PO与业务方对齐不足"
    impact:
      items_affected: 3
      effort_lost: 5
      quality_impact: 返工导致测试时间压缩
```

### Step 5: 改进建议 [深度]

**目标**：基于问题识别生成可追踪、可验证的改进建议

**建议格式**：

```yaml
improvement_suggestions:
  - suggestion_id: IMP-001
    problem_id: PRB-001
    category: process | technical | collaboration | environment
    title: 建立需求变更评审机制
    description: 迭代中需求变更需经PO和Tech Lead双重确认
    expected_outcome:
      metric_improvement:
        - metric: change_rate
          current: 12%
          target: 5%
    action_items:
      - action: 制定需求变更流程文档
        owner: PO
        deadline: 2026-06-25
    effort_required:
      story_points: 2
      time_estimate: 3
    priority: P1 | P2 | P3
    recommendation_score: 8.5
```

## 输出

**输出文件路径**：`output/pm-monitoring/iteration-retrospective/`

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | 迭代回顾核心结论 | 核心结论 + 最小可行产物，仅输出完成情况分析和关键问题 |
| standard | 完整迭代回顾（当前默认） | 完整产物，包含Step 1-5全部输出 |
| deep | 完整回顾 + 扩展分析 | 完整产物 + 竞品迭代对比 + 长期路线评估 + 决策记录 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["iteration_id", "summary", "metrics_analysis"],
  "properties": {
    "generated_at": {"type": "string", "description": "生成时间"},
    "iteration_id": {"type": "string", "description": "迭代ID"},
    "period": {"type": "object", "description": "迭代周期，包含起止时间"},
    "trigger_id": {"type": "string", "description": "触发事件ID（如有调整）"},
    "trigger_type": {"type": "string", "description": "触发类型：monitoring_alert/feedback/strategy_change"},
    "impact_assessment": {"type": "object", "description": "变更影响评估，包含范围/进度/质量影响"},
    "recommended_option": {"type": "string", "description": "推荐调整方案ID"},
    "options": {"type": "array", "description": "可选调整方案列表，包含类型、评分和权衡"},
    "needs_human_decision": {"type": "boolean", "description": "是否需要人工决策"},
    "summary": {"type": "object", "description": "迭代总结，包含完成率、质量状态和评分"},
    "metrics_analysis": {"type": "object", "description": "指标分析，包含交付/质量/协作/效率四维度"},
    "problem_identification": {"type": "object", "description": "问题识别，包含总数和P1/P2计数"},
    "improvement_suggestions": {"type": "array", "description": "改进建议列表，每项须含负责人和验证标准"}
  }
}
```

**输出文件结构**：

```
├── iteration-retrospective.json
├── iteration-retrospective.md
├── adjustment/
│   ├── TRG-001/
│   │   ├── impact_assessment.yaml
│   │   ├── adjustment_options.yaml
│   │   ├── risk_assessment.yaml
│   │   ├── communication_draft.md
│   │   └── needs_human_decision.yaml
│   └── latest/
│       └── adjustment_recommendation.md
└── retrospective/
    ├── Sprint-26/
    │   ├── summary.md
    │   ├── metrics_analysis.yaml
    │   ├── problem_identification.yaml
    │   └── improvement_suggestions.yaml
    └── latest/
        └── retrospective_report.md
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| iteration_id | string | 是 | 迭代ID，不可为空 |
| summary | object | 是 | 迭代总结，须含delivery_completion/quality_status/overall_score |
| metrics_analysis | object | 是 | 指标分析，须含delivery/quality/collaboration/efficiency四维度 |
| impact_assessment | object | 否 | 变更影响评估，须含affected_items/scope/severity |
| adjustment_options | array | 否 | 调整方案列表，至少2个方案 |
| adjustment_options[].recommendation_score | number | 否 | 推荐评分，范围0-100 |
| risk_assessment | object | 否 | 风险评估，须含risk_level/mitigation |
| communication_draft | object | 否 | 沟通草案，须含stakeholders/message |
| problem_identification | object | 否 | 问题识别，须含total_problems/p1_count |
| improvement_suggestions | array | 否 | 改进建议列表，每项须含负责人和验证标准 |

## 决策规则

| 场景 | 决策规则 |
|------|----------|
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

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 当前迭代计划 | 用户描述需要调整的原因和期望，AI基于描述生成调整方案 | 基于用户描述的调整方案，缺乏计划数据验证 |
| 迭代完成情况 | 用户提供迭代完成情况（完成/未完成项、故事点），AI基于提供数据生成复盘 | 基于用户输入的复盘报告，缺乏系统数据 |
| 资源约束 | 跳过容量验证，方案中标注"需人工确认容量" | 无容量验证的调整方案 |
| 触发事件 | 用户提供调整触发原因（异常/反馈/战略变化），AI据此评估 | 基于用户输入的影响评估 |
| 变更需求 | 用户口述需要增删改的项，AI整理为结构化变更需求 | 用户口述转结构化的变更清单 |
| 质量指标 | 用户提供缺陷数和返工情况，AI直接进行质量分析 | 基于用户输入的质量分析 |
| 团队反馈 | 跳过协作分析维度，标注"缺少团队反馈数据" | 缺少协作维度的复盘 |
| 监控数据 | 跳过监控数据分析，在复盘中标注"缺少稳定性数据" | 缺少稳定性维度的复盘 |
| 监控告警 | 跳过告警关联分析，紧急优先策略不可用 | 无告警关联的调整方案 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **当前迭代计划缺失**：请用户描述需要调整的原因（如"支付功能出现线上问题需要加塞"），AI将基于描述生成调整方案，包含加塞/替换/推迟等选项
2. **迭代完成情况缺失**：请用户提供迭代完成情况，包括：计划完成的故事点/实际完成的故事点、未完成项及原因、需求变更情况，AI将基于提供的数据生成复盘报告
3. **资源约束缺失**：方案生成时跳过容量匹配验证，所有方案标注"需人工确认团队容量是否支持"，建议后续补充资源数据
4. **触发事件缺失**：请用户说明调整触发原因和紧迫程度，AI将据此进行影响评估和方案生成
5. **变更需求缺失**：请用户口述需要增删改的项，AI整理为结构化变更清单
6. **质量指标缺失**：请用户提供关键质量数据（Bug数量、严重程度分布、返工次数），AI将据此进行质量维度分析
7. **团队反馈缺失**：跳过协作分析维度，复盘中标注该维度数据缺失，建议后续通过Retro会议补充
8. **监控数据缺失**：跳过稳定性分析，复盘中标注缺少稳定性数据，建议从监控系统导出补充
9. **监控告警缺失**：跳过告警关联分析，无法自动提升紧急项优先级，建议用户手动标注紧急项

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] 迭代ID非空
- [ ] 完成情况分析覆盖率 100%
- [ ] 调整方案数量 ≥ 2（如有触发事件）

### P1 检查（standard/deep 必须通过）

- [ ] 变更影响评估覆盖率 100%（如有触发事件）
- [ ] Sprint 容量匹配
- [ ] 无关键依赖遗漏
- [ ] 风险评估完整性
- [ ] 决策标记准确性
- [ ] 方案可执行性 ≥ 80%
- [ ] 数据收集完整率 ≥ 95%
- [ ] 分析覆盖所有四个维度
- [ ] 问题识别准确率 ≥ 80%
- [ ] 建议可执行率 ≥ 75%
- [ ] 改进建议有明确负责人

### P2 检查（仅 deep 必须通过）

- [ ] 沟通草案覆盖所有干系人
- [ ] 与上一迭代对比分析完整
- [ ] 竞品迭代对比已完成（竞品功能迭代节奏、策略差异分析、市场趋势对标）
- [ ] 长期路线评估已生成（3-6个月迭代路线图、关键里程碑、资源需求预测）

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| agile-sprint-planning | 迭代计划变更 | 变更影响评估基准 | 重新评估变更影响 |
| planning-resource | 资源约束变更 | 方案容量验证 | 重新验证方案可行性 |
| agile-daily-sync | 迭代完成数据更新 | 交付维度分析 | 更新完成率和故事点统计 |
| 测试平台/CI/CD | 质量指标变更 | 质量维度分析 | 更新缺陷统计和覆盖率 |
| monitoring-alert-detection | 告警数据更新 | 紧急优先策略 | 更新告警关联和优先级提升 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| iteration-orchestrator | 迭代回顾全流程完成 | 输出文件更新 | 回顾完成状态和关键结论 |
| iteration-backlog-grooming | 改进建议生成完成 | 输出文件更新 | 改进项回流至Backlog供下轮整理 |
