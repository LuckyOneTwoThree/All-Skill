---
name: iteration-retrospective
description: 当需要进行迭代复盘时使用。迭代复盘自动化，自动收集迭代数据，进行多维度分析，识别问题并生成改进建议。关键词：迭代复盘、Sprint复盘、持续改进、行动项追踪、迭代回顾。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 7: 迭代复盘自动化 🤖

## 核心原则

1. **复盘的目的是改进不是追责**：复盘必须建立心理安全感，否则团队只会报喜不报忧
2. **数据驱动归因，而非主观印象**：用指标数据验证"感觉"，避免印象偏差掩盖真实问题
3. **改进建议必须可追踪可验证**：每条改进建议都要有责任人和验证标准，否则复盘就是走过场

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 迭代完成情况 | JSON | 是 | output/pm-project/agile-daily-sync/daily_sync | 已完成/未完成项、故事点 |
| 质量指标 | JSON | 是 | 测试平台/CI/CD → 质量数据 | 缺陷数、代码覆盖率、返工率 |
| 团队反馈 | JSON | ○ | Retro工具 → 团队反馈 | Retro 会议记录、投票结果 |
| 监控数据 | JSON | ○ | output/pm-monitoring/monitoring-system/监控数据 | 稳定性、性能变化数据 |

## 执行步骤

### Step 1: 数据收集

**目标**：自动收集迭代相关数据

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

### Step 2: 多维度分析

**目标**：从交付、质量、协作、效率四个维度分析迭代表现

#### 2.1 交付分析

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

#### 2.2 质量分析

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

#### 2.3 协作分析

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

#### 2.4 效率分析

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

### Step 3: 问题识别

**目标**：从数据中发现模式，识别核心问题

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

### Step 4: 改进建议

**目标**：基于问题分析生成可执行的改进建议

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

**输出Schema**：

```json
{
  "type": "object",
  "required": ["iteration_id", "summary", "metrics_analysis"],
  "properties": {
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
├── {iteration_id}/
│   ├── summary.md
│   ├── metrics_analysis.yaml
│   ├── problem_identification.yaml
│   └── improvement_suggestions.yaml
└── latest/
    └── retrospective_report.md
```

### 迭代复盘输出格式

```yaml
iteration_retrospective:
  iteration_id: {id}
  period:
    start: {ISO8601}
    end: {ISO8601}
  summary:
    delivery_completion: {percentage}
    quality_status: good | acceptable | needs_improvement
    overall_score: {score}
    key_highlights:
      - "{highlight}"
      - "{highlight}"
  metrics_analysis:
    delivery: {...}
    quality: {...}
    collaboration: {...}
    efficiency: {...}
  problem_identification:
    total_problems: {count}
    p1_count: {count}
    p2_count: {count}
    critical_issues: [...]
  improvement_suggestions:
    total: {count}
    high_priority: {count}
    recommended_first: {suggestion_id}
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| 完成率 < 70% | 标记重点问题，分析根本原因 |
| Bug 泄漏率 > 10% | 触发质量流程审查 |
| 团队满意度 < 3/5 | 标记协作问题，需专项改进 |
| 连续两期同类问题 | 标记为系统性缺陷 |
| 无法自动识别根因 | 建议人工专项分析 |

## 质量检查

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
| 迭代完成情况 | 用户提供迭代完成情况（完成/未完成项、故事点），AI基于提供数据生成复盘 | 基于用户输入的复盘报告，缺乏系统数据 |
| 质量指标 | 用户提供缺陷数和返工情况，AI直接进行质量分析 | 基于用户输入的质量分析 |
| 团队反馈 | 跳过协作分析维度，标注"缺少团队反馈数据" | 缺少协作维度的复盘 |
| 监控数据 | 跳过监控数据分析，在复盘中标注"缺少稳定性数据" | 缺少稳定性维度的复盘 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **迭代完成情况缺失**：请用户提供迭代完成情况，包括：计划完成的故事点/实际完成的故事点、未完成项及原因、需求变更情况，AI将基于提供的数据生成复盘报告
2. **质量指标缺失**：请用户提供关键质量数据（Bug数量、严重程度分布、返工次数），AI将据此进行质量维度分析
3. **团队反馈缺失**：跳过协作分析维度，复盘中标注该维度数据缺失，建议后续通过Retro会议补充
4. **监控数据缺失**：跳过稳定性分析，复盘中标注缺少稳定性数据，建议从监控系统导出补充

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| iteration_id | string | 是 | 迭代ID，不可为空 |
| summary | object | 是 | 迭代总结，须含delivery_completion/quality_status/overall_score |
| metrics_analysis | object | 是 | 指标分析，须含delivery/quality/collaboration/efficiency四维度 |
| problem_identification | object | 否 | 问题识别，须含total_problems/p1_count |
| improvement_suggestions | array | 否 | 改进建议列表，每项须含负责人和验证标准 |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| agile-daily-sync | 迭代完成数据更新 | 交付维度分析 | 更新完成率和故事点统计 |
| 测试平台/CI/CD | 质量指标变更 | 质量维度分析 | 更新缺陷统计和覆盖率 |
| monitoring-system | 监控数据更新 | 稳定性维度分析 | 更新稳定性指标 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| iteration-backlog | 改进建议生成 | 写入输出文件 | 改进建议和优先级 |
| iteration-orchestrator | 复盘完成 | 输出文件更新 | 复盘完成状态和关键发现 |
