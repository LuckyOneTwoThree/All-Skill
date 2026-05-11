---
name: diagnosis-competition
description: 当需要追踪竞品动态并制定应对策略时使用。竞品动态追踪与应对，监控竞品功能变更，评估自身优势动态变化，生成应对策略并追踪效果。关键词：竞品追踪、竞品分析、竞品监控、功能变更、竞争分析、竞品变化、竞品动态。
metadata:
  module: "产品监控与迭代"
  sub-module: "问题诊断"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 4: 竞品动态追踪与应对 🤖

## 核心原则

1. **功能变更是信号不是噪音**：每次竞品功能变更都反映了其战略意图，关键是识别意图而非罗列变更
2. **优势是动态的不是静态的**：竞争优势随时在变化，昨天的领先不保证明天的领先
3. **应对策略必须可追踪**：策略的价值在于执行和效果验证，而非停留在建议层面

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 竞品数据 | JSON | 是 | 竞品监控系统 → 竞品数据 | 功能列表、版本更新、用户评价 |
| 自身数据 | JSON | 是 | 产品数据平台 → 自身数据 | 功能列表、用户评价、满意度 |
| 市场数据 | JSON | ○ | 行业报告 → 市场数据 | 行业趋势、用户需求变化 |
| 历史追踪 | JSON | ○ | output/pm-monitoring/diagnosis-competition/历史报告 | 历史竞品分析报告 |

## 执行步骤

### Step 1: 功能变更监控

**目标**：识别竞品近期功能变更

**监控渠道**：
- 竞品官网/更新日志
- 应用商店更新记录
- 用户评价聚合
- 社交媒体讨论
- 行业媒体报道

**变更类型分类**：

| 类型 | 定义 | 关注级别 |
|------|------|----------|
| 新功能 | 竞品独有的新能力 | P0 |
| 功能优化 | 已有功能的体验/性能提升 | P1 |
| 功能下线 | 停止支持的功能 | P2 |
| 价格调整 | 定价策略变化 | P1 |
| 生态扩展 | 合作伙伴/集成变化 | P2 |

**输出格式**：

```yaml
feature_changes:
  - competitor: {name}
    change_type: new_feature | enhancement | deprecation | pricing | ecosystem
    feature_name: {name}
    change_date: {date}
    description: {description}
    user_reaction:
      sentiment: positive | negative | neutral
      volume: {count}
      key_themes: [themes]
    source: {source_url}
    priority: P0 | P1 | P2
```

### Step 2: 优势动态评估

**目标**：评估自身相对竞品的优劣势变化

**评估维度**：

| 维度 | 指标 | 数据来源 |
|------|------|----------|
| 功能领先度 | 独有功能数 vs 竞品 | 功能对比矩阵 |
| 用户体验 | 评分对比、功能易用性 | App Store/Google Play |
| 性能指标 | 响应时间、稳定性对比 | 第三方评测 |
| 价值感知 | 性价比、品牌认知 | 用户调研 |
| 生态丰富度 | 集成数量、API 开放度 | 技术文档 |

**评估方法**：
- 雷达图多维对比
- 趋势线变化分析
- 用户评论语义分析

**输出格式**：

```yaml
advantage_changes:
  period: {start} to {end}
  dimensions:
    - dimension: feature_leadership
      previous_status: leading | parity | lagging
      current_status: leading | parity | lagging
      change: improved | unchanged | declined
      delta: {description}
    - dimension: user_experience
      previous_status: leading | parity | lagging
      current_status: leading | parity | lagging
      change: improved | unchanged | declined
      delta: {description}
  overall_trend:
    direction: gaining | holding | losing
    confidence: {percentage}
  critical_changes:
    - description: "竞品 X 推出 Y 功能，缩小功能差距"
      impact_level: high | medium | low
```

### Step 3: 应对策略生成

**目标**：基于竞品动态生成应对策略

**策略类型**：

| 策略类型 | 适用场景 | 执行要求 |
|----------|----------|----------|
| 加速 | 竞品抢占市场份额 | 快速迭代，高优先级 |
| 差异化 | 竞品功能同质化 | 寻找独特价值点 |
| 防御 | 竞品威胁核心功能 | 巩固护城河 |
| 观望 | 影响不确定 | 持续监控，储备方案 |

**策略生成规则**：

```yaml
response_strategy:
  - competitor_change:
      feature: {feature_name}
      change_type: new_feature
    recommended_approach: accelerate | differentiate | defend | monitor
    action:
      title: {action_title}
      description: {description}
      options:
        - option: aggressive
          description: "快速跟进，功能优先"
          timeline: 2-4 weeks
          priority: P0
          resource_needed: {story_points}
        - option: balanced
          description: "差异化实现"
          timeline: 4-8 weeks
          priority: P1
          resource_needed: {story_points}
        - option: conservative
          description: "持续观察，等待更多信息"
          timeline: tbd
          priority: P2
    selected_option: {option}
    tracking:
      status: planned | in_progress | completed | dismissed
      milestones: [...]
```

### Step 4: 效果追踪

**目标**：追踪应对策略的执行效果

**追踪指标**：
- 策略执行完成度
- 功能发布后用户反馈
- 市场份额变化
- 用户评分变化

**追踪报告**：

```yaml
effect_tracking:
  strategy_id: {id}
  execution:
    planned_date: {date}
    actual_date: {date}
    completed: true | false
  outcome:
    user_feedback:
      sentiment_change: {delta}
      volume: {count}
    market_impact:
      share_change: {delta}
      new_users: {count}
    competitive_position:
      status_change: improved | unchanged | declined
```

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["report_id", "feature_changes", "advantage_changes", "response_strategy"],
  "properties": {
    "report_id": {"type": "string", "description": "报告唯一标识"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "period": {"type": "object", "description": "分析周期，包含起止时间"},
    "feature_changes": {"type": "object", "description": "功能变更汇总，包含总数和P0/P1计数"},
    "advantage_changes": {"type": "object", "description": "优势变化，包含增长/保持/失去的维度"},
    "response_strategy": {"type": "array", "description": "应对策略列表，包含竞品、功能和优先级"}
  }
}
```

```
├── {date}/
│   ├── feature_changes.yaml
│   ├── advantage_changes.yaml
│   ├── response_strategy.yaml
│   └── effect_tracking.yaml
└── latest/
    └── competition_report.md
```

### 竞品应对输出格式

```yaml
competition_response:
  report_id: {uuid}
  generated_at: {ISO8601}
  period: {start} to {end}
  feature_changes:
    total: {count}
    p0_count: {count}
    p1_count: {count}
  advantage_changes:
    gaining: [{dimensions}]
    holding: [{dimensions}]
    losing: [{dimensions}]
  response_strategy:
    - id: STR-001
      competitor: {name}
      feature: {feature}
      approach: accelerate
      action: {description}
      timeline: {weeks}
      priority: P0
      tracking:
        status: planned
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| 竞品推出颠覆性功能 | 立即生成应对策略，标记 P0 |
| 优势差距缩小 < 10% | 生成防御策略 |
| 多个竞品同质化 | 触发差异化策略生成 |
| 策略执行延期 | 重新评估优先级 |
| 市场环境重大变化 | 重新评估整体策略 |

## 质量检查

- [ ] 竞品覆盖完整性 ≥ 90%
- [ ] 功能变更识别及时性 ≤ 7 天
- [ ] 优势评估与实际市场反馈一致
- [ ] 策略可执行性 ≥ 80%
- [ ] 效果追踪覆盖率 100%
- [ ] 报告完整性（所有维度）

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 竞品数据 | 用户提供竞品名称列表，AI基于公开信息和行业知识追踪竞品动态 | 基于AI知识的竞品追踪报告，数据来源和置信度需标注 |
| 自身数据 | 用户提供自身产品功能清单和用户评价，AI进行手动对比 | 基于用户输入的优劣势分析，缺乏数据验证 |
| 市场数据 | 跳过行业趋势分析，策略建议仅基于功能对比 | 无行业趋势的策略建议 |
| 历史追踪 | 跳过历史趋势分析，仅输出当前快照 | 竞品现状快照报告，无趋势对比 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **竞品数据缺失**：请用户提供竞品名称列表，AI将基于公开信息（官网、应用商店、行业报告等）和AI知识库追踪竞品功能动态，输出中标注数据来源和置信度
2. **自身数据缺失**：请用户提供自身产品功能清单和核心指标（用户评分、功能覆盖等），AI将基于用户输入与竞品进行手动对比分析
3. **市场数据缺失**：AI跳过行业趋势分析环节，应对策略仅基于功能对比结果生成，建议后续补充市场数据以完善策略

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| report_id | string | 是 | 报告唯一标识 |
| feature_changes | object | 是 | 功能变更汇总，须含total/p0_count/p1_count |
| feature_changes.total | number | 是 | 变更总数，须≥0 |
| advantage_changes | object | 是 | 优势变化，须含gaining/holding/losing |
| response_strategy | array | 是 | 应对策略列表，每项须含id/competitor/feature/approach/priority |
| response_strategy[].priority | string | 是 | 优先级，仅允许P0/P1/P2 |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| 竞品监控系统 | 竞品数据格式变更 | 功能变更解析和分类 | 适配新格式，更新变更类型分类 |
| 产品数据平台 | 自身功能列表变更 | 优势对比矩阵 | 更新对比基准，重新评估优劣势 |
| 行业报告 | 市场数据更新 | 行业趋势和策略建议 | 更新趋势分析，调整策略优先级 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| competitor-monitoring-report | 竞品追踪数据更新 | 写入输出文件 | 功能变更和优势变化 |
| diagnosis-orchestrator | 竞品追踪完成 | 输出文件更新 | 追踪完成状态和关键发现 |
| iteration-backlog | P0级别竞品变更 | 写入输出文件 | 紧急应对策略和优先级 |
