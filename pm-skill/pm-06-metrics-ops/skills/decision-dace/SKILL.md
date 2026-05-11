---
name: decision-dace
description: 当需要执行数据驱动决策闭环时使用。DACE循环自动化，Define/Analyze由AI自动执行，Conclude由AI辅助人类决策，Execute由AI追踪执行效果。实现数据驱动决策的持续迭代闭环。关键词：DACE循环、数据决策、决策闭环、数据驱动、决策框架、决策循环、数据分析闭环。
metadata:
  module: "产品度量运营"
  sub-module: "决策闭环"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 11：DACE循环自动化

## 核心原则

1. **全量分析**：决策依据基于全量数据分析，不依赖片段信息或直觉判断
2. **实时感知**：异常检测和实验结果即时触发DACE循环，缩短从洞察到行动的时间
3. **自动归因**：洞察自动转化为决策选项，附带决策边界和置信度评估
4. **决策规则显式化**：data_decision可AI自动执行、data_reference需人类确认、human_decision由人类主导

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| OKR数据 | object | 是 | 用户提供 | 目标与关键结果、基线值与目标值 |
| KR进度 | object | 是 | output/pm-metrics-ops/analysis-anomaly/anomaly_report.json | 各KR当前进度与偏差分析 |
| 实验结果 | object | 是 | output/pm-metrics-ops/experiment-execution/ab_test_result.yaml | A/B测试结果、异常检测数据 |

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
│   │ Analyze │  分析数据与实验结果                        │
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
│   └─────────┘       │                             │
│        │            │                             │
│        ▼            │                             │
│   返回Analyze ◀─────┘                             │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Phase 1: Define（定义）🤖

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

### Phase 2: Analyze（分析）🤖

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

### Phase 3: Conclude（结论）🤖→👤

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

### Phase 4: Execute（执行）🤖

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
            current: 0.381  # 实验数据
            
        status: "released"
        release_date: "2024-01-22"
        
        monitoring:
          daily_check: true
          alert_threshold: -0.02  # 下降2%触发告警
          
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
      output: "综合分析报告"
      
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

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| KR进度落后>20% | 触发Conclude，生成决策建议 |
| KR无法完成 | 升级+OKR调整建议 |
| 实验结果统计显著 | 自动进入Conclude阶段 |
| 护栏指标被突破 | 暂停Execute，回退至Analyze |

## 质量检查

- [ ] Define阶段目标可量化、有基线
- [ ] Analyze阶段覆盖所有数据源
- [ ] Conclude阶段提供至少2个决策选项
- [ ] Execute阶段设置监控和回滚机制

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| OKR追踪缺失 | 用户提供当前指标数据 → 执行DACE分析 | Define阶段目标定义基于用户描述 |
| 异常检测缺失 | 跳过Analyze阶段的异常触发，基于用户提供的指标数据执行 | 分析维度受限，可能遗漏未关注异常 |
| OKR追踪 + 异常检测均缺失 | 用户提供当前指标数据 → 执行DACE分析 | 输出基于用户数据的DACE分析，Define和Analyze标注"待补充" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **当前指标数据**：关键指标的当前值、基线值和目标值
- **业务目标**（可选）：当前阶段的业务优先级和决策需求
- **已知问题**（可选）：已经发现的异常或待决策问题

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["dace_status", "okr_tracking"],
  "properties": {
    "dace_status": {"type": "object", "description": "DACE循环状态，包含当前阶段和进度"},
    "okr_tracking": {"type": "object", "description": "OKR追踪数据，包含目标、关键结果和达成率"},
    "action_log": {"type": "array", "description": "行动日志，包含已执行决策和待执行项"},
    "cycle_report": {"type": "object", "description": "周期报告，包含分析结论和执行建议"}
  }
}
```

```
output/pm-metrics-ops/decision-dace/
├── dace_status.json
├── okr_tracking.json
├── action_log.json
└── dace_cycle_report.md
```

输出文件：dace_status.json、okr_tracking.json、action_log.json、dace_cycle_report.md

## 执行频率

| Phase | 执行频率 | 触发方式 |
|-------|---------|---------|
| Define | 季度/OKR变更 | 自动 |
| Analyze | 持续 | 定时+事件 |
| Conclude | 按需 | 分析完成 |
| Execute | 持续 | 决策批准 |
