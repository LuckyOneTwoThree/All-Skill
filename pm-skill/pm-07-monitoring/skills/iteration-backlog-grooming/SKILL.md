---
name: iteration-backlog-grooming
description: 当需要整理和优先级排序产品Backlog时使用。Backlog整理工具，负责问题优先级评估、技术债务影响分析和重组建议。关键词：Backlog整理、优先级评估、技术债务、需求重组。
metadata:
  module: "产品监控与迭代"
  sub-module: "迭代优化"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "软件", "通用"]
  trigger_examples:
    - "需求池太乱了怎么整理"
    - "backlog优先级怎么排"
    - "需求太多了先做哪个"
    - "需求要加塞怎么排"
    - "优先级怎么重新排"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "仅输出Backlog优先级排序建议"
  deep_description: "完整整理 + 技术债务影响分析 + 关联分析 + 重组建议"
---

# Backlog 整理与优先级评估 🤖

## 核心原则

1. **优先级是资源分配的量化表达**：Backlog排序的本质是决定资源投向，每个排序变化都意味着资源的重新分配
2. **关联即杠杆**：识别需求间的依赖和协同关系，关联需求一起做比分散做效率高3倍
3. **技术债务是隐形成本，必须显性化**：技术债务不进Backlog就永远不会被还，必须在优先级评分中占权重
4. **数据驱动归因，而非主观印象**：用指标数据验证"感觉"，避免印象偏差掩盖真实问题

### 触发条件

| 触发条件 | 描述 | 优先级 |
|----------|------|--------|
| 监控异常 | 监控系统检测到异常 | P0 |
| 重大反馈 | 大量用户投诉或重要客户反馈 | P0 |
| 战略变化 | 业务战略或市场环境重大变化 | P1 |
| 资源变化 | 团队成员增减或可用时间变化 | P2 |

## 基本信息

| 项目 | 值 |
|------|-----|
| 模块 | 产品监控与迭代 |
| 子模块 | 迭代优化 |
| 类型 | pipeline |
| 版本 | 2.0 |
| 交互模式 | AI建议人类审批 |
| 执行深度 | standard（默认） |

## 交互模式

🤖→👤 AI建议人类审批

- AI自动完成Backlog整理、优先级评分、技术债务分析和重组建议
- 人类审批重点：优先级排序是否合理、技术债务权重是否适当、重组建议是否可执行
- 人类可要求AI调整评分维度或权重，AI重新生成
- Product Owner批准后，输出可供 agile-sprint-planning 消费的 prioritized_items

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 需求池 | JSON数组 | 是 | 项目管理系统 → 需求池 | 用户故事、功能需求、Bug |
| 技术债务 | JSON | 是 | 代码质量平台 → 技术债务 | 债务清单、影响评估 |
| 监控告警 | JSON | ○ | output/pm-monitoring/monitoring-alert-detection/告警数据 | 待解决的技术问题，用于紧急优先策略 |
| 用户反馈 | JSON | ○ | 反馈系统 → 用户反馈 | 投诉、功能请求、建议，用于用户价值评分 |
| 资源约束 | JSON | ○ | 用户提供 | 团队容量、可用时间、依赖（用于工作量调整维度评分） |
| 质量指标 | JSON | ○ | 测试平台/CI/CD → 质量数据 | 缺陷数、代码覆盖率、返工率，用于技术债务影响分析 |
| 监控数据 | JSON | ○ | output/pm-monitoring/monitoring-alert-detection/监控数据 | 稳定性、性能变化数据，用于债务影响评估 |

**重要**：本 Skill 无跨模块依赖，不依赖 pm-project 模块输出，可独立执行。资源约束由用户直接提供而非从 pm-project 获取。

## 执行步骤

### Step 1: 问题优先级评估 [核心]

**目标**：基于多维度评分模型对Backlog项目进行优先级排序

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
      revenue_impact: 7.5
      brand_impact: 6.0
      strategic_value: 8.0
  user_value:
    score: 0-10
    factors:
      request_frequency: 12
      pain_point_intensity: 7.0
  urgency:
    score: 0-10
    factors:
      alert_impact: 5.0
      competitive_threat: 6.5
      compliance_requirement: 3.0
  effort_adjusted:
    score: 0-10
    factors:
      resource_requirement: 8
      dependencies: 3
      technical_risk: 4.0
  final_score: 7.2
```

### Step 2: 技术债务影响分析 [条件]

**目标**：量化技术债务对Backlog项目的影响，将隐性成本显性化

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
  - debt_id: TD-001
    category: code_quality | performance | security | architecture
    severity: critical | high | medium | low
    affected_systems: [order_service, payment_service]
    metrics:
      development_overhead: 15%
      defect_rate_impact: 8%
      performance_impact: 12%
    affected_backlog_items: [US-101, US-205]
    interest_accrued: 2.5
```

### Step 3: 关联分析 [条件]

**目标**：识别需求间的依赖、协同和冲突关系，为重组提供依据

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
  - item_id: US-101
    dependencies:
      - depends_on: US-098
        type: hard | soft
        reason: 依赖用户认证模块完成
    synergies:
      - related_to: US-103
        reason: "一起实现价值最大化"
    technical_debt_blockers:
      - debt_id: TD-001
        impact: "导致开发效率降低 20%"
```

### Step 4: Backlog 重组 [深度]

**目标**：基于优先级评分和关联分析生成Backlog重组建议

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
      item_id: US-101
      current_position: 5
      suggested_position: 1
    reason: 关联P0告警，需优先处理
    impact:
      effort_saved: 3
      risk_reduced: 20%
      value_delivered: 提前修复支付链路风险
```

## 输出

**输出文件路径**：`output/pm-monitoring/iteration-backlog-grooming/`

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | Backlog优先级排序 | 核心结论 + 最小可行产物，仅输出Step 1优先级排序 |
| standard | 完整Backlog整理（当前默认） | 完整产物，包含Step 1-4全部输出 |
| deep | 完整整理 + 扩展分析 | 完整产物 + 技术债务利息趋势 + 长期路线评估 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["prioritized_items", "backlog_size", "summary"],
  "properties": {
    "generated_at": {"type": "string", "description": "生成时间"},
    "backlog_size": {"type": "object", "description": "Backlog规模，包含总条目数和总故事点"},
    "prioritized_items": {"type": "array", "description": "排序后的需求列表，包含评分、影响和关联"},
    "technical_debt_priority": {"type": "array", "description": "技术债务优先级列表，包含利息和优先级"},
    "reorganization_summary": {"type": "object", "description": "重组建议汇总，包含提升/合并/推迟/拆分数量"},
    "linked_issues": {"type": "object", "description": "关联关系，包含依赖和协同"},
    "summary": {"type": "object", "description": "整理总结，包含关键发现和建议"}
  }
}
```

**输出文件结构**：

```
├── iteration-backlog-grooming.json
├── iteration-backlog-grooming.md
├── backlog/
│   ├── prioritized_items.yaml
│   ├── linked_issues.yaml
│   ├── technical_debt_impact.yaml
│   └── reorganization_suggestions.md
└── latest/
    └── backlog_recommendation.md
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| prioritized_items | array | 是 | 优先级排序后的需求列表，每项须含id/title/priority_score |
| prioritized_items[].priority_score | number | 是 | 优先级评分，范围0-100 |
| linked_issues | object | 否 | 关联关系，须含dependency/synergy |
| technical_debt_impact | object | 否 | 技术债务影响评估 |
| reorganization_suggestions | array | 否 | 重组建议列表 |
| backlog_size | object | 是 | Backlog规模，须含total_items/total_story_points |
| summary | object | 是 | 整理总结，须含key_findings/recommendations |

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

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 需求池 | 用户提供当前需求列表（标题+简述），AI基于用户输入重新排序 | 基于用户输入的优先级排序，缺乏系统数据支撑 |
| 技术债务 | 跳过技术债务影响分析，优先级评分中债务权重置零 | 无债务影响的排序结果 |
| 监控告警 | 跳过告警关联分析，紧急优先策略不可用 | 无告警关联的排序结果 |
| 用户反馈 | 用户价值评分基于需求描述推断，标注低置信度 | 低置信度的用户价值评分 |
| 资源约束 | 跳过容量验证，方案中标注"需人工确认容量" | 无容量验证的调整方案 |
| 质量指标 | 用户提供缺陷数和返工情况，AI直接进行质量分析 | 基于用户输入的质量分析 |
| 监控数据 | 跳过监控数据分析，在债务评估中标注"缺少稳定性数据" | 缺少稳定性维度的债务评估 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **需求池缺失**：请用户提供当前需求列表，包含需求标题、简述和类型（功能/Bug/优化），AI将基于提供的信息进行优先级评分和排序
2. **技术债务缺失**：跳过债务影响分析步骤，优先级评分公式中移除债务相关权重，建议后续补充债务清单以完善排序
3. **监控告警缺失**：跳过告警关联分析，无法自动提升紧急项优先级，建议用户手动标注紧急项
4. **用户反馈缺失**：用户价值维度评分将基于需求描述推断，输出中标注该维度置信度低，建议人工确认
5. **资源约束缺失**：方案生成时跳过容量匹配验证，所有方案标注"需人工确认团队容量是否支持"，建议后续补充资源数据
6. **质量指标缺失**：请用户提供关键质量数据（Bug数量、严重程度分布、返工次数），AI将据此进行质量维度分析
7. **监控数据缺失**：跳过稳定性分析，债务评估中标注缺少稳定性数据，建议从监控系统导出补充

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] 优先级评分覆盖率 100%
- [ ] prioritized_items 列表非空
- [ ] 每项含 id/title/priority_score

### P1 检查（standard/deep 必须通过）

- [ ] 关联关系识别完整
- [ ] 技术债务影响评估准确
- [ ] 重组建议可执行
- [ ] 无关键依赖遗漏
- [ ] 方案可执行性 ≥ 80%

### P2 检查（仅 deep 必须通过）

- [ ] 技术债务影响分析完整（债务利息率趋势、偿还优先级排序、对交付速率的量化影响）
- [ ] 与上一Backlog版本对比分析完整
- [ ] 长期路线评估已生成（3-6个月迭代路线图、关键里程碑、资源需求预测）

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| 项目管理系统 | 需求状态变更 | 优先级排序和关联分析 | 重新计算优先级评分 |
| 代码质量平台 | 技术债务更新 | 债务影响评估和权重 | 更新债务权重和影响评分 |
| monitoring-alert-detection | 告警数据更新 | 紧急优先策略 | 更新告警关联和优先级提升 |
| 测试平台/CI/CD | 质量指标变更 | 技术债务影响分析 | 更新缺陷统计和覆盖率 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| iteration-orchestrator | Backlog整理完成 | 输出文件更新 | 整理完成状态和关键结论 |
| agile-sprint-planning | prioritized_items 已生成 | 输出文件更新 | 排序后的需求列表供Sprint Planning消费 |
