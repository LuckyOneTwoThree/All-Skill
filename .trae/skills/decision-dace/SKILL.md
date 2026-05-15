---
name: decision-dace
description: 当需要执行数据驱动决策闭环或将数据转化为可执行洞察时使用。DACE循环自动化，Define/Analyze由AI自动执行，Conclude由AI辅助人类决策，Execute由AI追踪执行效果。Analyze阶段融合洞察转化能力，将分析结果转化为故事化洞察、决策建议和决策边界标注。关键词：DACE循环、数据决策、决策闭环、数据驱动、决策框架、决策循环、数据分析闭环、用数据做决策、决策流程、怎么用数据推动行动、数据洞察、洞察转化、决策建议、故事化分析、数据故事、数据看不懂、把数据变成人话、数据说明了什么。
metadata:
  module: "产品度量运营"
  sub-module: "决策闭环"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我用DACE方法做一个数据决策"
    - "从数据到行动的完整闭环怎么做"
    - "数据分析了但没人执行怎么办"
    - "这些数据说明了什么，帮我解读一下"
    - "把分析结果变成能讲的故事"
    - "数据太干了，帮我转化成可执行的建议"
  interaction_mode: "ai_suggest_human_approve"
---

# DACE循环自动化（含洞察转化）

## 核心原则

1. **Define是方向，Analyze是证据**：没有明确目标的分析和没有证据支撑的决策同样危险
2. **Conclude权在人类，Execute追踪在系统**：AI提供选项和边界，人类做最终决策，系统负责追踪执行效果
3. **闭环才是完整**：DACE缺一不可，没有Execute的Conclude是空谈，没有Analyze的Conclude是赌博
4. **数据是起点，洞察是终点，行动是目的**：没有行动方向的洞察只是数据展示
5. **故事化而非术语化**：将"p=0.001"翻译为"99.9%可信度"，让决策者听懂才能行动
6. **边界标注比推荐更重要**：明确哪些可自动执行、哪些需人类确认，比简单推荐更有价值

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| OKR数据 | object | 是 | 用户提供 | 目标与关键结果、基线值与目标值 |
| KR进度 | object | 是 | output/pm-metrics-ops/analysis-anomaly/anomaly_report.json | 各KR当前进度与偏差分析 |
| 实验结果 | object | 是 | output/pm-metrics-ops/experiment-execution/ab_test_result.yaml | A/B测试结果、异常检测数据 |
| 分析结果 | object | 是 | output/pm-metrics-ops/analysis-anomaly/anomaly_report.json | anomaly/funnel/retention报告 |
| 业务上下文 | object | ○ | 用户提供 | 产品阶段、团队目标 |
| 历史洞察库 | object[] | ○ | output/pm-metrics-ops/decision-dace/insight_library.json | 避免重复 |

## 执行步骤

### DACE四阶段

```
┌────────────────────────────────────────────────────────┐
│                     DACE循环                            │
├────────────────────────────────────────────────────────┤
│                                                        │
│   ┌─────────┐                                          │
│   │  Define │  定义目标与成功指标                        │
│   └────┬────┘                                          │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐                                          │
│   │ Analyze │  洞察生成：数据→故事→决策建议              │
│   └────┬────┘                                          │
│        │                                                │
│        ▼                                                │
│   ┌─────────┐                                          │
│   │Conclude │  得出结论与决策建议      ◀──────┐         │
│   └────┬────┘                               │         │
│        │                                    │         │
│        ▼                                    │         │
│   ┌─────────┐                               │         │
│   │ Execute │  执行策略并追踪效果 ───────────┘         │
│   └─────────┘       │                             │    │
│        │            │                             │    │
│        ▼            │                             │    │
│   返回Analyze ◀─────┘                             │    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Step 1: Define（定义）🤖

自动建立OKR追踪体系：

```yaml
define:
  status: "automated"
  trigger: "OKR更新或季度开始"

  output:
    current_cycle: "2024_Q1"
    cycle_id: "dace_2024_Q1"

    objectives:
      - id: "obj_1"
        text: "提升用户活跃度"
        owner: "product_team"

        key_results:
          - id: "kr_1_1"
            text: "DAU达到1200万"
            metric: "dau"
            baseline: 10500000
            target: 12000000
            current: 10800000
            progress: 30

          - id: "kr_1_2"
            text: "D7留存率达到30%"
            metric: "d7_retention"
            baseline: 0.25
            target: 0.30
            current: 0.285
            progress: 70

      - id: "obj_2"
        text: "提升商业化收入"
        owner: "biz_team"

        key_results:
          - id: "kr_2_1"
            text: "月收入达到5000万"
            metric: "monthly_revenue"
            baseline: 42000000
            target: 50000000
            current: 45500000
            progress: 43.75

    success_metrics:
      primary: ["dau", "d7_retention", "monthly_revenue"]
      supporting: ["dau_conversion", "arpu", "paying_users"]
      guardrail: ["user_satisfaction", "app_crash_rate"]
```

### Step 2: Analyze（洞察生成）🤖

故事化洞察转化、决策建议、决策边界、置信度评估

融合原 decision-insight 的洞察转化能力，将分析结果转化为故事化洞察。

#### 2.1 数据收集与分析

自动收集和分析数据：

```yaml
analyze:
  status: "automated"
  execution_mode: "continuous"

  data_sources:
    - type: "metrics"
      name: "daily_metrics"
      frequency: "hourly"

    - type: "experiments"
      name: "ab_test_results"
      frequency: "on_completion"

    - type: "events"
      name: "product_events"
      frequency: "realtime"

  analyses_performed:
    - type: "anomaly_detection"
      findings:
        - metric: "dau_conversion"
          status: "warning"
          change: -3.2%
          reason: "注册流程改动影响"

    - type: "experiment_summary"
      findings:
        - experiment: "简化注册实验"
          result: "positive"
          lift: +8.2%

    - type: "funnel_analysis"
      findings:
        - funnel: "购买转化"
          conversion: 7.2%
          critical_drop: "step_1_to_2"
```

#### 2.2 从数字到故事

```
数据分析 → 业务叙事
```

**转化原则**：

| 数据语言 | 业务语言 |
|---------|---------|
| 转化率下降3.2% | "每100个访客中，减少3个完成注册" |
| p值=0.001 | "这个结论有99.9%的可信度" |
| 置信区间[2%,5%] | "我们确信提升在2%到5%之间" |
| D7留存28.5% | "一周后，约3成用户仍在使用" |

**叙事模板**：

```yaml
narrative_template: |
  ## 洞察标题

  ### 背景
  [产品/功能]在[时间范围]的表现如何？

  ### 发现
  我们发现[核心数据变化]，这意味着[业务影响]。

  ### 影响
  如果不干预，预计[时间后][影响程度]。
  如果干预成功，预计[收益]。

  ### 建议
  基于数据，我们建议[具体行动]。
```

#### 2.3 决策建议生成

生成多个可执行的决策选项：

```yaml
action_options:
  - option_id: "opt_001"
    option_name: "全量发布新功能"
    description: "将实验组的新注册流程全量发布"

    expected_effect:
      primary_metric: "+8.2% 注册转化率"
      secondary_metrics:
        - "注册用户数 +12%"
        - "整体DAU +2%"

    risk:
      level: "low"
      factors:
        - "护栏指标全部安全"
        - "效应稳定无新奇效应"
        - "可快速回滚"

    confidence:
      level: "high"
      basis:
        - "统计显著（p=0.001）"
        - "实验周期完整（14天）"
        - "样本量充足（24830）"

    resource_requirements:
      engineering: "2人日（发布部署）"
      qa: "1人日（回归测试）"

    timeline:
      ready_for_release: "2天后"

    prerequisites:
      - "技术评审通过"
      - "监控告警配置完成"

  - option_id: "opt_002"
    option_name: "分批发布"
    description: "先发布iOS，稳定后再发布Android"

    expected_effect:
      primary_metric: "+5.2% iOS注册转化率"
      secondary_metrics:
        - "Android效果待验证"

    risk:
      level: "medium"
      factors:
        - "Android效果不确定"
        - "维护两套逻辑"

    confidence:
      level: "medium"
      basis:
        - "iOS统计显著"
        - "Android效果不显著"
```

#### 2.4 决策边界标注

区分不同类型的决策：

```yaml
decision_boundary:
  type: "data_decision"
  criteria:
    - "统计显著（p < 0.01）"
    - "实际意义显著（超过阈值）"
    - "护栏指标安全"
    - "无重大风险"
  auto_execute_eligible: true

  automation_level: "full"

  human_oversight:
    required: false
    notification_only: true

decision_boundary:
  type: "data_reference"
  criteria:
    - "数据支持某一选项"
    - "但存在不确定性"
    - "或涉及战略考量"
  auto_execute_eligible: false

  human_oversight:
    required: true
    decision_maker: "product_manager"
    deadline: "3 business days"
```

#### 2.5 洞察汇总

```yaml
insights_gathered:
  - insight: "简化注册流程可提升新用户转化"
    confidence: "high"
    source: "ab_test"

  - insight: "加购环节流失率偏高"
    confidence: "medium"
    source: "funnel_analysis"

  - insight: "iOS留存表现优于Android"
    confidence: "high"
    source: "retention_analysis"
```

### Step 3: Conclude（决策选项）🤖→👤

AI辅助人类决策

AI生成决策建议，人类做出最终决定：

```yaml
conclude:
  status: "human_decision"
  human_participation: true

  automated_analysis:
    options_considered: 3

    recommendations:
      - priority: 1
        action: "全量发布简化注册流程"
        rationale: "实验数据显示转化提升8.2%，护栏指标安全"
        expected_outcome: "新用户注册转化+8.2%"
        risk_level: "low"

      - priority: 2
        action: "优化加购环节流程"
        rationale: "漏斗分析显示加购是关键流失点"
        expected_outcome: "整体转化提升潜力+15%"
        risk_level: "medium"

      - priority: 3
        action: "针对Android做留存优化"
        rationale: "Android留存低于iOS，需针对性优化"
        expected_outcome: "Android D7留存+5%"
        risk_level: "medium"

  human_decision_required:
    decision_type: "strategy_confirmation"
    decision_maker: "product_director"
    deadline: "2024-01-20"

    context_provided:
      - "实验完整分析报告"
      - "风险评估"
      - "资源配置需求"
      - "时间规划"
```

### Step 4: Execute（执行追踪）🤖

追踪执行效果：

```yaml
execute:
  status: "tracking"
  tracking_mode: "automated"

  approved_actions:
    - action_id: "act_001"
      action: "全量发布简化注册流程"
      approved_by: "product_director"
      approved_at: "2024-01-18"

      implementation:
        planned_date: "2024-01-22"
        rollout_plan: "100% traffic"

      tracking:
        metrics:
          - name: "registration_completion_rate"
            baseline: 0.35
            target: 0.38
            current: 0.381

        status: "released"
        release_date: "2024-01-22"

        monitoring:
          daily_check: true
          alert_threshold: -0.02

  results_tracked:
    - action_id: "act_001"
      days_since_release: 3

      results:
        metric: "registration_completion_rate"
        baseline: 0.35
        current: 0.378
        change: +8.0%
        status: "on_track"

      guardrail_status:
        - metric: "d7_retention"
          baseline: 0.42
          current: 0.419
          change: -0.2%
          status: "safe"

      verdict: "功能表现符合预期，继续监控"
```

## DACE状态追踪

```yaml
dace_status:
  cycle_id: "dace_2024_Q1"
  current_phase: "Execute"

  phase_history:
    - phase: "Define"
      started: "2024-01-01"
      completed: "2024-01-05"
      output: "Q1 OKR体系"

    - phase: "Analyze"
      started: "2024-01-05"
      completed: "2024-01-15"
      output: "综合分析报告 + 故事化洞察"

    - phase: "Conclude"
      started: "2024-01-15"
      completed: "2024-01-18"
      output: "决策建议 + 审批"

    - phase: "Execute"
      started: "2024-01-18"
      status: "in_progress"
      output: "追踪结果"

  insights:
    total_insights: 12
    actionable: 8
    implemented: 3
    pending: 5

  action_taken:
    total_actions: 3
    completed: 1
    in_progress: 1
    pending: 1

  results_tracked:
    active_tracking: 2
    target_achieved: 0
    target_at_risk: 0
    target_on_track: 2
```

## 自动触发机制

| 触发条件 | DACE响应 |
|---------|---------|
| OKR更新 | 重新Define |
| 异常检测 | 优先Analyze，触发Conclude |
| 实验完成 | Analyze结果，触发Conclude |
| 决策执行 | 进入Execute追踪 |
| 周期结束 | 完成当前循环，准备下一周期 |

## OKR追踪配置

```yaml
okr_tracking:
  cycle: "quarterly"
  current_cycle: "2024_Q1"

  update_frequency:
    progress: "daily"
    review: "weekly"
    recalibration: "monthly"

  alert_rules:
    - condition: "KR进度落后 > 20%"
      severity: "high"
      action: "触发Conclude"

    - condition: "KR无法完成"
      severity: "critical"
      action: "升级 + OKR调整"
```

## 洞察类型处理

### 异常洞察

```yaml
anomaly_insight:
  type: "anomaly"

  narrative: |
    ## 异常检测洞察

    今日发现：注册转化率从35%下降到32%。
    异常开始时间：今日9:00。
    影响用户数：约1.5万。

    最可能原因：v2.5.0版本中注册流程改动。
    置信度：85%。

    建议：立即检查新版本实现，准备回滚方案。

  action_options:
    - "立即回滚到上一版本"
    - "紧急修复后发布热更新"
    - "继续监控24小时"

  decision_boundary:
    type: "data_decision"
    auto_execute_eligible: true
    condition: "转化率继续下降超过5%"
```

### 漏斗洞察

```yaml
funnel_insight:
  type: "funnel_analysis"

  narrative: |
    ## 购买转化漏斗洞察

    漏斗整体转化率7.2%，较上周下降0.5个百分点。

    最大流失点：从浏览到加购，流失84%用户。
    流失主要集中在：价格敏感用户、Android端用户。

    建议优化方向：价格展示策略、加购引导话术。

  action_options:
    - "优化价格展示（显示折扣、对比）"
    - "增强加购引导（浮层、提示）"
    - "针对流失用户做调研"
```

## 输出

**存储路径**：`output/pm-metrics-ops/decision-dace/`

**输出文件**：dace_status.json、okr_tracking.json、action_log.json、dace_cycle_report.md、decision_insight.json、insight_library.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["dace_status", "okr_tracking", "insight_id", "source", "narrative", "action_options"],
  "properties": {
    "dace_status": {"type": "object", "description": "DACE循环状态，包含当前阶段和进度"},
    "okr_tracking": {"type": "object", "description": "OKR追踪数据，包含目标、关键结果和达成率"},
    "action_log": {"type": "array", "description": "行动日志，包含已执行决策和待执行项"},
    "cycle_report": {"type": "object", "description": "周期报告，包含分析结论和执行建议"},
    "insight_id": {"type": "string", "description": "洞察唯一标识"},
    "created_at": {"type": "string", "description": "创建时间"},
    "source": {"type": "object", "description": "洞察来源，包含类型和置信度"},
    "narrative": {"type": "string", "description": "故事化叙述，包含背景、发现、影响和建议"},
    "action_options": {"type": "array", "description": "决策选项列表，包含预期效果、风险和置信度"},
    "decision_boundary": {"type": "object", "description": "决策边界，包含类型和自动执行资格"},
    "decision_maker": {"type": "string", "description": "决策人角色"},
    "deadline": {"type": "string", "description": "决策截止时间"}
  }
}
```

### 洞察输出示例

```yaml
data_insight:
  insight_id: "insight_20240115_001"
  created_at: "2024-01-15T14:30:00Z"

  source:
    type: "experiment_result"
    experiment_id: "exp_20240115_simplified_register"
    confidence: "high"

  narrative: |
    ## 简化注册流程实验洞察

    ### 背景
    产品团队在2024年1月15日启动了简化注册流程实验，
    将5步注册流程缩短为3步。
    实验持续14天，共24830名用户参与。

    ### 发现
    实验组（简化流程）的注册转化率达到38.1%，
    相比对照组（标准流程）的35.2%提升了8.2个百分点。
    这个结论有99.9%的可信度（p=0.001）。

    更重要的是，这个提升是稳定的——
    从实验第1天到第14天，效果没有衰减，
    说明这不是用户的新奇效应，而是真实的体验改善。

    ### 影响
    如果我们全量发布这个功能：
    - 每月预计新增注册用户 **+12%**（约3.6万用户/月）
    - 按照当前转化漏斗，预计带来 **+8%** 的DAU增长

    ### 风险
    我们检查了所有护栏指标：
    - 用户7日留存：42.0% → 41.8%（下降0.2%，可接受）
    - DAU：保持稳定
    - 崩溃率：无变化

    所有护栏指标都在安全范围内。

    ### 建议
    **建议全量发布简化注册流程。**
    这是低风险高回报的改动，数据支持立即执行。

  action_options:
    - option: "全量发布简化注册流程"
      option_id: "opt_001"
      expected_effect:
        primary: "注册转化率 +8.2%"
        secondary: ["DAU +2%", "新用户 +12%"]
      risk: "low"
      confidence: "high"

    - option: "分平台发布（先iOS）"
      option_id: "opt_002"
      expected_effect:
        primary: "iOS转化 +5.2%"
        secondary: ["Android待验证"]
      risk: "medium"
      confidence: "medium"

    - option: "继续实验2周"
      option_id: "opt_003"
      expected_effect:
        primary: "更多数据验证"
        secondary: ["降低不确定性"]
      risk: "low"
      confidence: "low"

  decision_boundary:
    type: "data_decision"
    description: |
      数据明确支持"全量发布"选项：
      - 统计显著（p=0.001）
      - 实际意义显著（+8.2%）
      - 护栏指标全部安全
      - 无新奇效应

    auto_execute_eligible: true

    automation_conditions:
      - condition: "技术团队确认可发布"
        required: true
      - condition: "监控告警已配置"
        required: true
      - condition: "回滚方案已准备"
        required: true

    override_conditions:
      - condition: "业务策略变更"
        action: "暂停自动执行，等待人工确认"

  recommended_action:
    action: "全量发布简化注册流程"
    priority: "high"
    reason: "数据支持充分，风险低，收益显著"

    next_steps:
      - step: 1
        task: "技术评审"
        owner: "engineering"
        deadline: "2024-01-17"
      - step: 2
        task: "配置监控告警"
        owner: "data_team"
        deadline: "2024-01-18"
      - step: 3
        task: "发布部署"
        owner: "engineering"
        deadline: "2024-01-19"
      - step: 4
        task: "发布后监控"
        owner: "data_team"
        duration: "2 weeks"
```

```
output/pm-metrics-ops/decision-dace/
├── dace_status.json
├── okr_tracking.json
├── action_log.json
├── dace_cycle_report.md
├── decision_insight.json
└── insight_library.json
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| dace_status | object | 是 | DACE循环状态 |
| dace_status.cycle_id | string | 是 | 循环ID |
| dace_status.current_phase | string | 是 | 当前阶段，枚举值：Define/Analyze/Conclude/Execute |
| dace_status.phase_history | array | 是 | 阶段历史 |
| okr_tracking | object | 是 | OKR追踪数据 |
| okr_tracking.objectives | array | 是 | 目标列表 |
| okr_tracking.objectives[].id | string | 是 | 目标ID |
| okr_tracking.objectives[].progress | number | 是 | 进度百分比 |
| okr_tracking.objectives[].status | string | 是 | 状态，枚举值：on_track/at_risk/behind |
| action_log | array | 是 | 行动日志 |
| action_log[].action_id | string | 是 | 行动ID |
| action_log[].action | string | 是 | 行动描述 |
| action_log[].status | string | 是 | 状态，枚举值：approved/in_progress/completed |
| data_insight | object | 否 | 数据洞察根对象（Analyze阶段产出） |
| data_insight.insight_id | string | 是 | 洞察唯一标识 |
| data_insight.created_at | string | 是 | 创建时间 |
| data_insight.source | object | 是 | 洞察来源 |
| data_insight.source.type | string | 是 | 来源类型，枚举值：experiment_result/anomaly/funnel_analysis/retention_analysis |
| data_insight.source.confidence | string | 是 | 来源置信度 |
| data_insight.narrative | string | 是 | 故事化叙述 |
| data_insight.action_options | array | 是 | 决策选项列表，至少2个 |
| data_insight.action_options[].option_id | string | 是 | 选项ID |
| data_insight.action_options[].expected_effect | object | 是 | 预期效果 |
| data_insight.action_options[].risk | string | 是 | 风险等级 |
| data_insight.action_options[].confidence | string | 是 | 置信度 |
| data_insight.decision_boundary | object | 是 | 决策边界 |
| data_insight.decision_boundary.type | string | 是 | 边界类型，枚举值：data_decision/data_reference/human_decision |
| data_insight.decision_boundary.auto_execute_eligible | boolean | 是 | 是否可自动执行 |
| data_insight.recommended_action | object | 是 | 推荐行动 |
| data_insight.recommended_action.action | string | 是 | 行动描述 |
| data_insight.recommended_action.priority | string | 是 | 优先级 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| OKR数据变更 | Define阶段目标定义 | 重新定义目标，更新KR基线和目标值 |
| KR进度变更 | Analyze阶段数据分析 | 更新偏差分析，重新评估Conclude选项 |
| 实验结果变更 | Analyze和Conclude阶段 | 更新实验数据，重新评估决策选项 |
| 分析结果更新 | 洞察叙述和决策选项 | 更新洞察叙述，重新评估决策选项 |
| 业务上下文变更 | 行动建议和优先级 | 重新评估行动建议，更新优先级 |
| 历史洞察库更新 | 重复洞察检测 | 执行去重检查，合并相似洞察 |

当DACE状态/洞察自身变更时，对下游的通知机制：

| 状态/洞察变更类型 | 通知范围 | 通知方式 |
|-------------------|----------|----------|
| Conclude阶段决策完成 | decision-culture | 标记决策完成，触发报告更新 |
| Execute阶段执行效果 | decision-culture | 标记执行效果，触发文化报告更新 |
| KR进度落后>20% | decision-culture | 标记进度风险，触发周报风险标注 |
| data_decision类型洞察 | decision-culture | 标记可自动执行，触发报告更新 |
| data_reference类型洞察 | decision-culture | 标记需人类确认，触发报告更新 |
| 洞察合并/置信度提升 | decision-culture | 标记洞察更新，触发报告更新 |

---

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| KR进度落后>20% | 触发Conclude，生成决策建议 |
| KR无法完成 | 升级+OKR调整建议 |
| 实验结果统计显著 | 自动进入Conclude阶段 |
| 护栏指标被突破 | 暂停Execute，回退至Analyze |
| 洞察置信度≥0.8 + 护栏指标无下降 | 标记auto_execute_eligible，通知执行 |
| 洞察置信度≥0.8 + 护栏指标存在不确定性 | 标记data_reference，需人类确认 |
| 洞察置信度0.5-0.8 | 标记data_reference，需人类确认 |
| 洞察置信度<0.5 | 标记human_decision，人类主导 |
| 洞察涉及战略考量（影响≥3个OKR） | 标记human_decision，人类主导 |
| ≥3个独立洞察指向同一结论 | 合并洞察，置信度提升0.15 |
| 2个洞察指向同一结论 | 合并洞察，置信度提升0.1 |
| 洞察涉及收入影响≥10% | 强制标记human_decision |

## 质量检查

- [ ] Define阶段目标可量化、有基线
- [ ] Analyze阶段覆盖所有数据源
- [ ] Conclude阶段提供至少2个决策选项
- [ ] Execute阶段设置监控和回滚机制
- [ ] 洞察叙述使用业务语言而非数据术语
- [ ] 每个洞察至少提供2个决策选项
- [ ] 决策边界标注正确（auto/reference/human）
- [ ] 推荐行动有明确的下一步和负责人

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| OKR追踪缺失 | 用户提供当前指标数据 → 执行DACE分析 | Define阶段目标定义基于用户描述 |
| 异常检测缺失 | 跳过Analyze阶段的异常触发，基于用户提供的指标数据执行 | 分析维度受限，可能遗漏未关注异常 |
| OKR追踪 + 异常检测均缺失 | 用户提供当前指标数据 → 执行DACE分析 | 输出基于用户数据的DACE分析，Define和Analyze标注"待补充" |
| 分析结果缺失 | 用户提供数据发现 → 转化为洞察 | 洞察基于用户描述，可能缺乏深度归因 |
| 实验结果缺失 | 跳过实验相关洞察转化 | 实验洞察维度缺失 |
| 分析结果 + 实验结果均缺失 | 用户提供数据发现 → 转化为洞察 | 输出基于用户描述的洞察，归因和决策边界标注"待补充" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **当前指标数据**：关键指标的当前值、基线值和目标值
- **业务目标**（可选）：当前阶段的业务优先级和决策需求
- **已知问题**（可选）：已经发现的异常或待决策问题
- **数据发现**（可选）：观察到的数据变化、趋势或异常
- **期望决策方向**（可选）：希望洞察支持的决策类型

## 执行频率

| Phase | 执行频率 | 触发方式 |
|-------|---------|---------|
| Define | 季度/OKR变更 | 自动 |
| Analyze | 持续 | 定时+事件 |
| Conclude | 按需 | 分析完成 |
| Execute | 持续 | 决策批准 |

## 版本历史

- v1.0: 初始版本（decision-dace）
- v2.0: 合并 decision-dace + decision-insight，Analyze阶段融合洞察转化能力，新增故事化叙述、决策边界标注、置信度评估
