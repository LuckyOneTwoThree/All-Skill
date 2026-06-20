---
name: monitoring-attribution
description: 当需要对监控异常进行归因分析时使用。异常归因分析工具，负责根因定位、影响范围评估和修复建议。关键词：异常归因、根因分析、影响评估、修复建议。
metadata:
  module: "产品监控与迭代"
  sub-module: "监控预警"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "软件", "通用"]
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "仅输出根因摘要和即时修复动作"
  deep_description: "完整归因 + 5Why深度链 + 影响面量化 + 长期修复方案 + 复盘建议"
---

# 异常归因分析 🤖

## 核心原则

1. **告警归因是推理链不是猜测**：从确认真实性到定位范围到关联事件到生成归因，每一步都必须有证据支撑
2. **关联分析是归因的关键**：孤立看告警必然误判，必须关联时间窗口内的其他事件
3. **根因定位必须可追溯**：5 Why 追问链每一层都要有证据和数据支撑，不可跳步
4. **影响评估要量化而非定性**：受影响用户数、损失金额、功能可用性必须给出可度量数值
5. **修复建议要可执行**：每条建议必须包含具体操作步骤、命令和回滚方案

## 基本信息

- **Skill 类型**：pipeline
- **所属模块**：产品监控与迭代 / 监控预警
- **版本**：2.0
- **交互模式**：🤖 AI自动执行（分析类）
- **上游 Skill**：monitoring-alert-detection（异常检测输出告警事件、分类和关联分析）
- **下游 Skill**：user-feedback-loop-report（反馈闭环报告消费归因结果和影响范围）、iteration-backlog-grooming（Backlog整理消费修复建议进行优先级调整）

> **模块独立性说明**：本Skill已内聚完整的异常归因分析逻辑（根因定位、影响评估、修复建议），不再跨模块委托 pm-06 analysis-anomaly，消除跨模块依赖。

## 交互模式

🤖 AI自动执行（分析类）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 异常告警事件 | JSON | 是 | output/pm-monitoring/monitoring-alert-detection/monitoring-alert-detection.json | 监控告警检测输出的告警事件清单，包含alert_id、timestamp、classification |
| 告警分类 | object | 是 | output/pm-monitoring/monitoring-alert-detection/ | 告警层级、类别和置信度 |
| 关联分析 | object | 是 | output/pm-monitoring/monitoring-alert-detection/ | 关联类型、相关告警和关联分数 |
| 版本发布信息 | object | ○ | output/pm-monitoring/release-gradual/release_status.json | 近期发布记录，用于变更关联归因 |
| 配置变更记录 | object | ○ | 用户提供 | 配置修改历史，用于配置变更归因 |
| 流量变化数据 | object | ○ | 用户提供 | 流量趋势和异常波动，用于流量异常归因 |
| 根因知识库 | object[] | ○ | output/pm-monitoring/monitoring-alert-detection/知识库 | 历史问题-根因映射，用于案例匹配 |
| 产品架构 | JSON/文件 | ○ | 用户提供 | 系统架构图、组件关系、依赖链路，用于依赖拓扑溯源 |
| 指标体系 | JSON | ○ | output/pm-metrics-design/metrics-system/metric_system.json | 业务指标定义，用于影响评估 |

## 执行步骤

### Step 1: 根因定位 [核心]

**目标**：基于告警事件和关联分析，定位异常的根本原因，输出可追溯的推理链

#### 1.1 告警真实性确认 [核心]

**确认方法**：
- 校验告警数据源是否正常上报（排除采集故障）
- 校验阈值配置是否合理（排除误配置）
- 校验指标计算逻辑是否正确（排除计算错误）
- 交叉验证多数据源一致性

**输出**：

```yaml
alert_validation:
  alert_id: ALT-001
  is_real: true | false
  confidence: 0.0-1.0
  validation_checks:
    - check: data_source_health
      passed: true | false
      detail: "数据源正常上报，最近数据点 2026-06-15T10:04:00Z"
    - check: threshold_config
      passed: true | false
      detail: "阈值配置符合SLA要求"
  false_positive_reason: null | "采集Agent离线导致数据缺失触发误告警"
```

#### 1.2 根因模式匹配 [核心]

**分析方法**：
- 基于告警类型的常见根因模式匹配
- 基于变更事件的时序分析（发布/配置变更后触发）
- 基于依赖拓扑的向上溯源
- 基于知识库的历史案例匹配

**根因模式库**：

| 告警类别 | 常见根因模式 | 排查优先级 |
|----------|------------|-----------|
| 资源饱和 | 容量不足/连接池耗尽/内存泄漏 | P0 |
| 响应超时 | 依赖服务慢/网络抖动/锁竞争 | P0 |
| 错误率上升 | 代码缺陷/配置错误/依赖故障 | P0 |
| 业务指标下跌 | 转化链路断裂/支付通道故障/功能不可用 | P0 |
| 流量异常 | 爬虫/刷量/营销活动/外部攻击 | P1 |

**知识库匹配规则**：
- 相似度 ≥ 0.85：直接输出历史解决方案，标注置信度
- 相似度 0.6-0.85：输出历史解决方案，标注"需人工确认适用性"
- 相似度 < 0.6 或无历史案例：进入 5 Why 逻辑推理

#### 1.3 5 Why 深度追问 [深度]

**分析方法**：逐层追问"为什么"，每层回答必须有证据支撑，直到触及根本原因

**5 Why 输出格式**：

```yaml
root_cause:
  why_chain:
    - question: "为什么 订单服务响应超时？"
      answer: "数据库连接池耗尽"
      evidence: "连接池使用率100%，活跃连接数50/50"
    - question: "为什么 数据库连接池耗尽？"
      answer: "慢查询占用连接时间过长"
      evidence: "慢查询日志显示3条SQL执行时间>5s，平均占用连接120s"
    - question: "为什么 慢查询增多？"
      answer: "新增的订单查询接口未加索引"
      evidence: "EXPLAIN显示全表扫描，对应接口于2026-06-14上线"
    # ... 同结构可扩展至3-5层
  root_cause_summary: "新增订单查询接口未加索引导致慢查询，占用数据库连接池导致服务超时"
  root_cause_category: code_defect | resource_exhaustion | config_error | dependency_failure | traffic_anomaly
  confidence: 0.0-1.0
  evidence_list:
    - type: metric | log | trace | change_record
      content: "连接池使用率监控数据"
      source: "APM系统"
```

#### 1.4 候选根因排序 [条件]

**当存在多个候选根因时**：

```yaml
candidate_root_causes:
  - rank: 1
    summary: "数据库连接池耗尽"
    confidence: 0.85
    evidence_count: 5
    supporting_factors: ["连接池监控", "慢查询日志"]
  - rank: 2
    summary: "网络抖动"
    confidence: 0.45
    evidence_count: 2
    supporting_factors: ["网络延迟波动"]
  needs_human_investigation: true | false
  investigation_hint: "Top2候选置信度接近，建议排查网络层"
```

### Step 2: 影响评估 [核心]

**目标**：量化异常对用户、功能、业务和收入的影响范围

#### 2.1 影响维度评估 [核心]

**评估维度**：

| 维度 | 指标 | 数据来源 |
|------|------|----------|
| 用户影响 | 受影响用户数/比例 | 监控指标 + 用户行为日志 |
| 功能影响 | 核心功能可用性 | 服务健康检查 + 业务指标 |
| 业务影响 | 转化率/订单量损失 | 业务指标对比基线 |
| 收入影响 | 预估 GMV 损失 | 业务数据 + 历史均值 |
| 声誉影响 | 客诉数量/舆情 | 客服系统 + 舆情监控 |

**输出**：

```yaml
impact_scope:
  level: critical | major | minor | negligible
  affected_users:
    count: 5000
    percentage: 15%
  affected_features:
    - feature_name: 订单创建
      availability: 95%
      impact_duration: 30m
  business_metrics:
    - metric: order_conversion_rate
      impact: -20%
      baseline: 5.2%
      current: 4.16%
      duration: 30m
  revenue_impact:
    estimated_loss: 50000
    currency: CNY
    confidence: 80%
    calculation_basis: "历史均值订单量 × 影响时长 × 客单价"
  reputation_impact:
    complaints: 12
    sentiment: negative
```

#### 2.2 影响范围动态追踪 [条件]

**当影响范围持续扩大时**：

```yaml
impact_trend:
  trend: expanding | stable | shrinking
  growth_rate_per_10min: 20%
  auto_escalation_triggered: true | false
  escalation_reason: "受影响用户增长≥20%/10分钟，自动升级severity"
```

### Step 3: 修复建议 [核心]

**目标**：基于根因和影响，输出可执行的即时修复和长期改进方案

#### 3.1 即时修复行动 [核心]

**建议类型**：

| 根因类型 | 建议模板 | 执行时效 |
|----------|----------|----------|
| 资源不足 | 扩容/资源调整方案 | 立即 |
| 代码问题 | 回滚/热修复方案 | 立即 |
| 配置错误 | 配置修正步骤 | 立即 |
| 依赖故障 | 切换/降级方案 | 立即 |
| 流量异常 | 限流/熔断配置 | 立即 |

**输出**：

```yaml
remediation:
  immediate_actions:
    - step: 扩容数据库连接池至100
      command: kubectl scale deploy order-db --replicas=3 | 调整连接池配置
      automated: true | false
      rollback_command: kubectl scale deploy order-db --replicas=1
      expected_effect: "连接池使用率降至60%以下"
      risk_level: low | medium | high
    - step: 为订单查询接口添加索引
      command: "CREATE INDEX idx_order_query ON orders(user_id, created_at)"
      automated: false
      rollback_command: "DROP INDEX idx_order_query ON orders"
      expected_effect: "查询执行时间从5s降至100ms"
      risk_level: low
  estimated_resolution_time: 30
```

#### 3.2 长期修复方案 [深度]

**输出**：

```yaml
long_term_fixes:
  - description: 优化连接池配置和慢查询监控
    priority: P0 | P1 | P2 | P3
    effort: 8
    effort_unit: hours
    owner: 待分配
    preventive: true | false
    action_items:
      - "建立慢查询自动告警机制，执行时间>1s自动通知"
      - "代码评审增加SQL索引检查项"
      - "连接池配置纳入容量规划"
```

#### 3.3 人工升级判断 [条件]

**输出**：

```yaml
needs_human_escalation: true | false
escalation_reason: "根因候选≥3个，需人工排查确认"
escalation_target: "后端团队 / DBA / SRE"
escalation_payload:
  - alert_id: ALT-001
  - top_candidates: ["数据库连接池耗尽", "网络抖动", "依赖服务慢"]
  - evidence_summary: "详见归因报告"
```

### Step 4: 复盘建议 [深度]

**目标**：P0异常恢复后，输出复盘流程和改进建议

**输出**：

```yaml
postmortem_suggestion:
  triggered: true | false
  trigger_condition: "P0异常恢复后自动触发"
  deadline: "24小时内生成复盘报告"
  review_scope:
    - timeline_reconstruction: "异常发生→检测→响应→恢复的完整时间线"
    - root_cause_analysis: "5 Why链条和证据复盘"
    - response_assessment: "响应时效、决策质量、沟通效率"
    - prevention_measures: "同类问题预防方案"
  action_items:
    - description: "建立SQL变更自动化检查流水线"
      priority: P1
      deadline: 2026-07-01
```

## 输出

**输出文件路径**：`output/pm-monitoring/monitoring-attribution/`

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | 根因摘要 + 即时修复动作 | 核心结论 + 最小可行产物，仅输出根因摘要和即时修复步骤 |
| standard | 完整归因分析（当前默认） | 完整产物，包含Step 1-3全部输出 |
| deep | 完整归因 + 深度推演 + 复盘建议 | 完整产物 + 5Why深度链 + 长期修复方案 + 复盘流程 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["alert_id", "root_cause", "impact_scope", "remediation"],
  "properties": {
    "alert_id": {"type": "string", "description": "告警ID，关联monitoring-alert-detection输出"},
    "timestamp": {"type": "string", "description": "归因分析时间"},
    "alert_validation": {"type": "object", "description": "告警真实性确认，包含is_real/confidence/validation_checks"},
    "root_cause": {"type": "object", "description": "根因分析，包含5Why链、摘要、类别和置信度"},
    "candidate_root_causes": {"type": "array", "description": "候选根因排序列表，当根因不确定时输出"},
    "impact_scope": {"type": "object", "description": "影响范围，包含级别、受影响用户、功能和业务指标"},
    "impact_trend": {"type": "object", "description": "影响趋势，包含趋势方向和增长率"},
    "remediation": {"type": "object", "description": "修复建议，包含即时行动列表和预估解决时间"},
    "long_term_fixes": {"type": "array", "description": "长期修复方案列表"},
    "needs_human_escalation": {"type": "boolean", "description": "是否需要人工升级"},
    "postmortem_suggestion": {"type": "object", "description": "复盘建议，包含触发条件、范围和行动项"},
    "report_id": {"type": "string", "description": "归因报告唯一标识"},
    "generated_at": {"type": "string", "description": "生成时间"}
  }
}
```

```
├── monitoring-attribution.json
├── monitoring-attribution.md
├── anomaly/
│   ├── ALT-001/
│   │   ├── alert_validation.md
│   │   ├── root_cause.md
│   │   ├── impact_assessment.md
│   │   ├── remediation.md
│   │   └── needs_human_escalation.yaml
│   └── attribution_summary.md
└── postmortem/
    └── ALT-001/
        └── postmortem_report.md
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| 告警真实性存疑（数据源异常） | 标记为疑似误报，暂停归因，通知人工确认 |
| 根因不确定（候选原因≥3个） | 标记需人工排查，输出Top3候选原因及置信度 |
| 知识库命中（相似度≥0.85） | 输出历史解决方案，标注置信度 |
| 知识库命中（相似度0.6-0.85） | 输出历史解决方案，标注"需人工确认适用性" |
| 无历史案例 | 输出5 Why追问链，等待反馈 |
| 影响范围扩大（受影响用户增长≥20%/10分钟） | 自动升级severity 1级（最高P0），触发即时修复 |
| 影响范围扩大（受影响用户增长5%-20%/10分钟） | 自动升级severity 1级 |
| P0异常恢复后 | 自动触发复盘流程，24小时内生成复盘报告 |
| 根因涉及代码缺陷 | 优先建议回滚，再建议热修复 |
| 根因涉及配置错误 | 优先建议配置回滚，标注回滚命令 |
| 根因涉及依赖故障 | 建议降级/熔断方案，标注影响范围 |
| 根因涉及流量异常 | 建议限流/扩容方案，标注限流阈值 |

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] 每个告警事件都有根因分析结论
- [ ] 根因分析有证据支撑（非纯猜测）
- [ ] 影响范围已量化（受影响用户数、功能可用性）

### P1 检查（standard/deep 必须通过）

- [ ] 修复建议可执行（每条建议有具体步骤和命令）
- [ ] 即时修复行动有回滚方案
- [ ] 影响评估覆盖5个维度（用户/功能/业务/收入/声誉）
- [ ] 根因置信度已标注

### P2 检查（仅 deep 必须通过）

- [ ] 根因定位准确率 ≥ 80%
- [ ] 5 Why 链条完整（3-5 层）
- [ ] MTTR 降低目标达成
- [ ] 长期修复方案有优先级和工时估算
- [ ] 复盘建议已生成（P0异常场景）

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 异常告警事件 | 请用户描述异常现象（症状/时间/服务/范围），基于描述进行归因 | 基于描述的归因，缺乏结构化告警数据 |
| 告警分类 | AI自行根据异常现象推断分类，标注"分类待确认" | 分类为推断，置信度降低 |
| 关联分析 | 跳过关联分析，在归因中标注"无法排除关联因素" | 孤立归因，可能误判 |
| 版本发布信息 | 跳过变更关联归因，标注"无法排除变更因素" | 排除变更关联的归因结果 |
| 配置变更记录 | 跳过配置变更关联，标注"无法排除配置变更因素" | 排除配置关联的归因结果 |
| 流量变化数据 | 跳过流量分析维度，在影响评估中标注流量数据缺失 | 缺少流量维度的分析结果 |
| 根因知识库 | 5 Why 分析完全依赖逻辑推理，无法提供历史参考方案 | 纯推理归因结果，无历史案例参考 |
| 产品架构 | 跳过依赖拓扑溯源，标注"拓扑溯源不可用" | 根因分析缺少拓扑维度 |
| 指标体系 | 影响评估使用用户提供的关键业务指标，标注"指标体系待补充" | 影响评估维度不完整 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **异常告警事件缺失**：请用户描述异常现象，包括：症状表现、发生时间、受影响的服务/功能、影响范围（用户数/功能点），AI将基于描述进行归因分析
2. **上下文数据缺失**（版本发布/配置变更/流量变化）：AI将在归因分析中明确标注无法排除的因素，建议人工排查这些维度
3. **根因知识库缺失**：AI将完全依赖5 Why逻辑推理进行归因，输出中标注"无历史案例参考"，建议人工验证归因结论
4. **产品架构缺失**：请用户提供服务组件清单或依赖关系，AI将基于有限信息进行拓扑溯源，标注溯源结果需人工确认

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| alert_id | string | 是 | 告警ID，须与monitoring-alert-detection输出一致 |
| root_cause | object | 是 | 根因分析，须含5_whys和conclusion |
| root_cause.5_whys | array | 是 | 5 Why链条，3-5层，每层须含question/answer/evidence |
| root_cause.root_cause_summary | string | 是 | 根因摘要 |
| root_cause.confidence | number | 是 | 置信度，0.0-1.0 |
| impact_scope | object | 是 | 影响评估，须含affected_users/affected_features |
| impact_scope.level | string | 是 | 影响级别，仅允许critical/major/minor/negligible |
| remediation | object | 是 | 修复建议，须含immediate_actions/estimated_resolution_time |
| remediation.immediate_actions | array | 是 | 即时行动列表，每项须含step/command/rollback_command |
| needs_human_escalation | boolean | 是 | 是否需要人工升级 |
| long_term_fixes | array | 否 | 长期修复方案，每项须含description/priority |
| postmortem_suggestion | object | 否 | 复盘建议，须含triggered/action_items |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| monitoring-alert-detection | 告警事件更新 | 根因分析输入 | 重新进行归因分析 |
| monitoring-alert-detection | 告警分类变更 | 根因模式匹配 | 更新根因匹配模式 |
| release-gradual | 版本发布记录更新 | 变更关联归因 | 更新关联事件和归因 |
| 根因知识库 | 历史案例更新 | 根因匹配和建议 | 更新参考案例库 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| monitoring-orchestrator | 归因分析完成 | 输出文件更新 | 归因完成状态和关键结论 |
| user-feedback-loop-report | 异常影响范围确认 | 写入输出文件 | 异常事件和用户影响范围 |
| iteration-backlog-grooming | P0异常触发修复 | 写入输出文件 | 根因和修复建议 |
