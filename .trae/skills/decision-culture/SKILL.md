---
name: decision-culture
description: 当需要推动团队数据驱动决策文化时使用。数据文化自动化，通过每日、每周、每月、每季的自动化报告体系，推动数据驱动决策文化的落地。确保团队始终基于数据做决策。关键词：数据文化、数据驱动、决策文化、数据素养、报告体系、让团队看数据做决定、培养数据习惯、定期发数据报告。
metadata:
  module: "产品度量运营"
  sub-module: "决策闭环"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "团队不习惯看数据，怎么推动"
    - "帮我建立数据驱动的文化"
    - "设置定期的数据报告推送"
  interaction_mode: "ai_suggest_human_approve"
---

# 数据文化自动化

## 核心原则

1. **无异常不打扰**：报告的价值不在于数量而在于信噪比，噪音报告会杀死数据文化
2. **节奏即习惯**：每日/每周/每月/每季的自动化节奏，让数据驱动从"要求"变成"习惯"
3. **行动导向**：每份报告都要有明确的下一步，没有行动建议的报告是数据堆砌

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| OKR数据 | object | 是 | output/pm-metrics-ops/decision-dace/dace_status.yaml | 目标与关键结果、进度追踪数据 |
| 决策记录 | object | 是 | output/pm-metrics-ops/decision-dace/decision_insight.json | 团队历史决策及数据支撑情况 |
| 团队反馈 | object | ○ | 用户提供 | 报告使用率、数据素养评估 |

## 执行步骤

### 执行节奏

```
┌─────────────────────────────────────────────────────────┐
│                   数据文化节奏                            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  每日      异常检测 → 每日摘要（无异常不打扰）            │
│  │                                                        │
│  ▼                                                        │
│  每周      功能Review → 实验汇总 → 周度报告              │
│  │                                                        │
│  ▼                                                        │
│  每月      完整报告 → OKR追踪 → 月度Review               │
│  │                                                        │
│  ▼                                                        │
│  每季      指标体系复盘 → 战略Review（人类主导）         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 每日节奏

#### 异常检测（自动）

```
每小时执行
├── 核心指标健康检查
├── 异常检测
└── 如有异常：触发告警
```

#### 每日摘要（无异常不打扰）

```yaml
daily_summary:
  generated_at: "2024-01-15T20:00:00Z"
  date: "2024-01-15"
  
  # 状态
  status: "no_alerts"  # no_alerts / alerts_handled / critical
  
  # 关键指标
  key_metrics:
    dau:
      value: 10850000
      vs_yesterday: +0.8%
      vs_last_week: +2.1%
      status: "healthy"
      
    revenue:
      value: 1580000
      vs_yesterday: -1.2%
      vs_last_week: +5.3%
      status: "healthy"
      
    conversion_rate:
      value: 0.352
      vs_yesterday: +0.5%
      status: "healthy"
  
  # 实验状态
  experiments:
    running: 3
    summary:
      - id: "exp_001"
        name: "简化注册流程"
        day: 7
        current_lift: "+8.5%"
        status: "on_track"
        
      - id: "exp_002"
        name: "新版首页"
        day: 4
        current_lift: "+2.1%"
        status: "monitoring"
        
      - id: "exp_003"
        name: "新定价策略"
        day: 2
        current_lift: "+0.3%"
        status: "early_monitoring"
  
  # 告警记录（如有）
  alerts:
    count: 0
    details: []
  
  # 今日要点
  highlights:
    - "所有核心指标正常，无告警"
    - "简化注册实验进展顺利，预计提前完成"
    - "今日无重大产品变更"
    
  # 明日预告
  tomorrow:
    - "exp_001 预计达到统计显著性"
    - "计划发布 v2.5.1 小版本"
```

### 每周节奏

#### 周一：功能Review

```yaml
weekly_feature_review:
  week: "2024-W03"
  review_date: "2024-01-15"
  
  features_reviewed:
    - feature: "简化注册流程"
      release_date: "2024-01-08"
      status: "released"
      
      metrics:
        registration_rate:
          before: 0.352
          after: 0.381
          lift: +8.2%
        user_feedback: "positive"
        
      verdict: "功能成功，维持现状"
      
    - feature: "首页推荐优化"
      release_date: "2024-01-10"
      status: "monitoring"
      
      metrics:
        click_rate:
          before: 0.12
          after: 0.128
          lift: +6.7%
          
      verdict: "指标正向，继续监控2周"
```

#### 周中：实验汇总

```yaml
weekly_experiment_summary:
  week: "2024-W03"
  
  experiments_summary:
    completed_this_week: 2
    positive: 1
    negative: 0
    inconclusive: 1
    
    details:
      - id: "exp_reg_001"
        name: "简化注册实验"
        result: "positive"
        lift: "+8.2%"
        decision: "全量发布"
        
      - id: "exp_pricing_001"
        name: "新定价实验"
        result: "inconclusive"
        lift: "+2.1%"
        decision: "继续实验"
        
  learnings:
    - "简化操作步骤对转化有显著正向影响"
    - "定价改动需要更长时间验证"
    
  recommendations:
    - "继续简化产品核心流程"
    - "定价类实验延长到3-4周"
```

#### 周五：周度报告

```yaml
weekly_report:
  week: "2024-W03"
  period: "2024-01-08 to 2024-01-14"
  generated_at: "2024-01-14T18:00:00Z"
  
  # 执行摘要
  executive_summary: |
    本周整体表现良好。
    - DAU较上周增长2.1%，达到1085万
    - 注册转化率提升8.2%（实验组）
    - 完成2个实验，1个正向，1个待定
    
  # OKR进度
  okr_progress:
    obj_1_dau:
      target: 12000000
      current: 10850000
      progress: 35%
      on_track: true
      
    obj_2_revenue:
      target: 50000000  # 月度
      current: 15500000  # 本月累计
      progress: 31%
      on_track: true
  
  # 核心指标周报
  metrics_weekly:
    dau:
      this_week_avg: 10820000
      last_week_avg: 10590000
      change: +2.2%
      
    d7_retention:
      this_week: 0.285
      last_week: 0.278
      change: +0.7pp
      
    revenue_daily:
      this_week_avg: 1560000
      last_week_avg: 1480000
      change: +5.4%
  
  # 实验总结
  experiments:
    total: 5
    running: 3
    completed: 2
    positive_rate: 0.5
    
  # 洞察与行动
  insights:
    - "简化注册流程效果显著，建议扩展到其他注册场景"
    - "iOS用户转化优于Android，需针对性优化"
    
  actions_for_next_week:
    - "全量发布简化注册流程"
    - "启动Android注册流程优化实验"
    - "新首页功能灰度测试"
```

### 每月节奏

#### 月度OKR追踪

```yaml
monthly_okr_review:
  month: "2024-01"
  review_date: "2024-01-31"
  
  # OKR状态
  objectives:
    - id: "obj_1"
      text: "提升用户活跃度"
      progress: 72%
      status: "on_track"
      
      key_results:
        - kr: "DAU达到1200万"
          progress: 35%
          assessment: "需要加速"
          
        - kr: "D7留存达到30%"
          progress: 70%
          assessment: "进展良好"
          
    - id: "obj_2"
      text: "提升商业化收入"
      progress: 65%
      status: "on_track"
      
      key_results:
        - kr: "月收入达到5000万"
          progress: 31%
          assessment: "时间过半，任务完成31%，需关注"
  
  # 偏差分析
  deviation_analysis:
    - kr: "DAU目标"
      gap: 1150000
      reasons:
        - "新用户获取不及预期"
        - "老用户流失率略高"
      recommendations:
        - "加大渠道投放"
        - "提升老用户召回"
```

#### 月度完整报告

```yaml
monthly_report:
  month: "2024-01"
  generated_at: "2024-01-31T18:00:00Z"
  
  executive_summary: |
    一月份整体表现符合预期。
    DAU增长2.1%，注册转化提升8.2%。
    重点功能简化注册流程已全量发布。
    
  # 核心指标
  core_metrics:
    dau:
      monthly_avg: 10750000
      monthly_peak: 11200000
      trend: "up"
      
    retention:
      d1: 0.452
      d7: 0.285
      d30: 0.183
      trend: "improving"
      
    revenue:
      monthly_total: 46800000
      arpu: 4.35
      trend: "stable"
  
  # 实验总结
  experiments:
    total_this_month: 8
    positive: 4
    negative: 2
    inconclusive: 2
    
    key_findings:
      - "流程简化对转化有普遍正向影响"
      - "个性化推荐效果显著"
      - "定价策略需要更长时间验证"
  
  # 数据文化建设
  data_culture:
    decisions_made: 15
    data_driven: 12
    data_driven_rate: 0.80
    
    report_engagement:
      daily_summary_open_rate: 0.95
      weekly_report_read_rate: 0.85
```

### 每季节奏

#### 季度指标体系复盘

```yaml
quarterly_metrics_review:
  quarter: "2024_Q1"
  
  # 指标有效性
  metric_effectiveness:
    high_value:
      - name: "注册转化率"
        reason: "直接反映产品易用性"
        
      - name: "D7留存"
        reason: "核心健康指标"
        
    low_value:
      - name: "功能使用率"
        reason: "定义模糊，需重新定义"
        
  # 调整建议
  recommended_changes:
    - action: "新增指标：核心动作完成率"
      rationale: "更好地衡量用户价值"
      
    - action: "调整权重：D7留存权重提高"
      rationale: "更关注用户粘性"
```

#### 季度战略Review（人类主导）

```
人类主导的季度Review
├── 复盘Q1目标完成情况
├── 制定Q2策略方向
├── 调整OKR体系
└── 确定重点实验
```

## 自动化报告配置

```yaml
automation_config:
  # 每日报告
  daily:
    enabled: true
    time: "20:00"
    channels: ["slack", "email"]
    skip_if_no_alerts: true
    
  # 每周报告
  weekly:
    enabled: true
    day: "Friday"
    time: "18:00"
    channels: ["slack", "email", "wiki"]
    
  # 每月报告
  monthly:
    enabled: true
    day: "last_day"
    time: "18:00"
    channels: ["email", "presentation"]
    include_okr_review: true
    
  # 每季报告
  quarterly:
    enabled: true
    channels: ["presentation", "meeting"]
    human_dominated: true
```

## 团队数据文化指标

```yaml
data_culture_metrics:
  # 决策质量
  decision_quality:
    data_driven_decisions: 45
    total_decisions: 52
    rate: 0.87
    
  # 报告使用
  report_usage:
    daily_summary_open: 0.95
    weekly_report_read: 0.88
    monthly_report_engagement: 0.75
    
  # 实验文化
  experimentation:
    experiments_per_month: 8
    experiment_decision_rate: 0.92
    fast_iteration_speed: "2 weeks avg"
    
  # 数据素养
  data_literacy:
    self_service_usage: 0.70
    sql_query_growth: "+20%"
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| report_type | string | 是 | 报告类型，枚举值：daily/weekly/monthly/quarterly |
| report_date | string | 是 | 报告日期 |
| key_metrics | array | 是 | 关键指标列表，至少1项 |
| key_metrics[].name | string | 是 | 指标名称 |
| key_metrics[].value | number | 是 | 当前值 |
| key_metrics[].change | string | 是 | 变化趋势 |
| key_metrics[].status | string | 是 | 状态，枚举值：healthy/warning/critical |
| anomalies | array | 否 | 异常指标列表 |
| action_items | array | 是 | 行动项列表 |
| action_items[].description | string | 是 | 行动描述 |
| action_items[].owner | string | 否 | 负责人 |
| action_items[].deadline | string | 否 | 截止日期 |
| engagement_stats | object | 否 | 报告参与度统计 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| OKR数据变更 | OKR追踪章节 | 更新OKR进度，重新评估偏差分析 |
| 决策记录变更 | 数据文化指标 | 更新数据驱动决策率，重新评估文化健康度 |
| 团队反馈变更 | 报告模板和推送策略 | 调整报告格式和推送时机 |

当文化报告自身变更时，对下游的通知机制：

| 报告变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| OKR进度落后>20% | decision-dace | 标记进度风险，触发DACE Conclude |
| 数据驱动决策率下降 | 全部下游 | 标记文化风险，触发培训建议 |
| 报告参与度下降 | decision-culture | 标记参与度问题，触发报告优化 |

---

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 核心指标异常（↓>5%） | 即时推送告警，触发专项分析 |
| OKR进度落后>20% | 周报中标注风险，建议调整策略 |
| 数据驱动决策率<70% | 推送数据文化培训建议 |
| 报告打开率持续下降 | 优化报告格式和推送时机 |

## 质量检查

- [ ] 每日摘要无异常时未产生噪音告警
- [ ] 周报包含OKR进度和实验汇总
- [ ] 月报包含完整指标趋势和偏差分析
- [ ] 报告中所有数据引用可追溯至数据源

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 各分析模块输出缺失 | 用户提供关键指标 → 生成摘要报告 | 报告内容基于用户提供的指标，缺乏自动分析深度 |
| 异常检测输出缺失 | 每日摘要使用用户提供的指标数据 | 每日报告可能遗漏未关注异常 |
| 实验结果输出缺失 | 周报中实验汇总章节标注"待补充" | 实验进展追踪缺失 |
| 各分析模块输出均缺失 | 用户提供关键指标 → 生成摘要报告 | 输出基础摘要报告，各分析维度标注"待补充" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **关键指标**：需要追踪的核心指标名称和当前值
- **指标目标**（可选）：各指标的目标值和基线值
- **团队关注点**（可选）：当前团队最关注的业务问题

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["report_type", "report_date", "key_metrics"],
  "properties": {
    "report_type": {"type": "string", "description": "报告类型：daily/weekly/monthly/quarterly"},
    "report_date": {"type": "string", "description": "报告日期"},
    "key_metrics": {"type": "array", "description": "关键指标列表，包含名称、当前值和变化趋势"},
    "anomalies": {"type": "array", "description": "异常指标列表"},
    "action_items": {"type": "array", "description": "行动项列表"},
    "engagement_stats": {"type": "object", "description": "报告参与度统计"}
  }
}
```

```
output/pm-metrics-ops/decision-culture/
├── culture/
│   ├── daily/
│   │   └── {date}_daily_summary.md
│   ├── weekly/
│   │   └── {week}_weekly_report.md
│   ├── monthly/
│   │   └── {month}_monthly_report.md
│   └── quarterly/
│       └── {quarter}_quarterly_report.md
├── dashboards/
│   ├── daily_dashboard.yaml
│   └── metrics_overview.yaml
└── engagement/
    └── report_analytics.yaml
```

输出文件：{date}_daily_summary.md、{week}_weekly_report.md、{month}_monthly_report.md、{quarter}_quarterly_report.md、daily_dashboard.yaml、metrics_overview.yaml、report_analytics.yaml

## 文化推广原则

| 原则 | 说明 |
|-----|------|
| 无异常不打扰 | 减少噪音，只在需要时打扰 |
| 数据一致性 | 所有报告使用同一数据源 |
| 行动导向 | 每份报告都要有明确的下一步 |
| 持续迭代 | 根据反馈优化报告形式 |
| 透明公开 | 所有人都能看到数据 |
