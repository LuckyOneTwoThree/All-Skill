---
name: experiment-execution
description: 当需要执行A/B测试并分析结果时使用。A/B测试自动执行与分析，AI自动执行实验运行中的监控和实验结束后的分析，包括统计检验、业务意义评估、多维下钻、新奇效应检测和决策建议。关键词：A/B测试执行、统计检验、实验分析、新奇效应、实验监控、实验结果分析。
metadata:
  module: "产品度量运营"
  sub-module: "实验验证"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_auto"
---

# Pipeline 9：A/B测试自动执行与分析

## 核心原则

1. **统计显著≠业务有效**：p值只告诉你"差异存在"，效应量才告诉你"差异有多大、值不值得做"
2. **异质性是隐藏的真相**：整体正向可能掩盖某群体负向，不下钻就不知道真实效果
3. **新奇效应是实验的陷阱**：初期效应可能随时间衰减，稳定才是可信

## 交互模式

### 运行中监控模式

```
定时执行（每日/每4小时）
├── 数据同步检查
├── 样本量进度
├── 主指标趋势
├── 护栏指标检查
├── 统计显著性检查
└── 异常检测
```

### 结束后分析模式

```
触发条件：达到终止条件
├── 锁定数据
├── 统计分析
├── 下钻分析
├── 生成结论
└── 输出建议
```

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 实验设计文档 | object | 是 | output/pm-metrics-ops/experiment-design/experiment_design.json | experiment-design 输出的实验方案 |
| 实验数据 | object | 是 | 用户提供 | 分组数据、指标数据、护栏指标数据 |
| 终止条件 | object | 是 | output/pm-metrics-ops/experiment-design/experiment_design.json | 样本量目标、运行时长、最小可检测效应 |

## 执行步骤

### Step 1：统计显著性检验

#### 检验方法选择

| 指标类型 | 检验方法 | 说明 |
|---------|---------|------|
| 比例（转化率） | Z-test / 卡方检验 | 二项分布 |
| 均值（收入） | T-test / Mann-Whitney | 正态/非正态 |
| 分布（时长） | KS检验 | 分布差异 |
| 多指标 | FDR校正 | 多重检验 |

#### 输出格式

```yaml
statistical_test:
  method: "two_sample_proportion_z_test"

  results:
    control:
      sample_size: 12450
      rate: 0.352
      standard_error: 0.0043

    treatment:
      sample_size: 12380
      rate: 0.381
      standard_error: 0.0044

    test_statistic: 4.82
    p_value: 0.0000014
    confidence_interval:
      lower: 0.018
      upper: 0.040
      confidence_level: 0.95

  interpretation:
    is_significant: true
    significance_level: 0.05
    conclusion: "实验组显著优于对照组"
```

### Step 2：实际业务意义评估

统计显著 ≠ 业务有效

```yaml
practical_significance:
  absolute_lift: 0.029  # +2.9pp
  relative_lift: 0.082  # +8.2%

  threshold:
    minimum_meaningful_lift: 0.02  # 业务认可的最小提升

  assessment:
    is_practically_significant: true
    business_verdict: "值得全量发布"
    reasoning: "提升8.2%超过业务阈值5%，预计年收入增加120万"
```

### Step 3：多维下钻分析

#### 异质性效应检测

```yaml
heterogeneous_effects:
  summary: "发现显著的平台差异"

  dimension_analysis:
    platform:
      ios:
        lift: 0.052  # +5.2%
        p_value: 0.001
        significant: true

      android:
        lift: 0.018  # +1.8%
        p_value: 0.089
        significant: false

      conclusion: "iOS用户效果显著，Android不显著"

    user_segment:
      new_users:
        lift: 0.041  # +4.1%
        significant: true

      returning_users:
        lift: 0.015  # +1.5%
        significant: false

      conclusion: "主要对新用户有效"

    traffic_source:
      organic:
        lift: 0.045
        significant: true

      paid:
        lift: 0.022
        significant: false

      conclusion: "对自然流量更有效"

  recommendations:
    - "考虑仅在iOS全量"
    - "优化Android版本的实现"
    - "针对新用户定向推广"
```

### Step 4：新奇效应检测

检测用户初期行为异常：

```yaml
novelty_check:
  enabled: true

  indicators:
    daily_trend:
      day_1: 0.15  # 第一天15%提升
      day_3: 0.09  # 第三天9%提升
      day_7: 0.08  # 第七天8%提升
      day_14: 0.082  # 第十四天8.2%提升

    assessment:
      is_novelty_effect: false
      trend_stable: true
      conclusion: "效应稳定，无新奇效应"

    actions:
      if_novelty: "延长实验周期2周"
      if_stable: "可进入决策流程"
```

### Step 5：决策建议生成

```yaml
decision_recommendation:
  # 综合评估
  overall_assessment:
    statistical_significance: true
    practical_significance: true
    guardrail_metrics_safe: true
    no_heterogeneous_risks: true
    novelty_effect_resolved: true

  # 最终结论
  conclusion: "positive"  # positive / negative / inconclusive / stop

  # 详细结论
  primary_metric:
    name: "registration_completion_rate"

    control:
      value: 0.352
      lower_ci: 0.344
      upper_ci: 0.360

    treatment:
      value: 0.381
      lower_ci: 0.373
      upper_ci: 0.389

    lift:
      absolute: 0.029
      relative: 0.082
      confidence_interval: [0.018, 0.040]

    statistics:
      p_value: 0.0000014
      statistically_significant: true
      practically_significant: true

  # 护栏指标
  guardrail_metrics:
    - name: "d7_retention_rate"
      control: 0.42
      treatment: 0.418
      change: -0.47%
      safe: true
      verdict: "无显著影响"

    - name: "daily_active_users"
      control: 1000000
      treatment: 1001500
      change: +0.15%
      safe: true
      verdict: "无显著影响"

    - name: "app_crash_rate"
      control: 0.002
      treatment: 0.0021
      change: +5%
      safe: true
      verdict: "无显著影响"

  # 异质性效应
  heterogeneous_effects:
    summary: "iOS效果显著(+5.2%)，Android不显著(+1.8%)"
    recommendations:
      - "考虑分平台发布策略"
      - "Android版本需要进一步优化"

  # 新奇效应
  novelty_check:
    detected: false
    trend: "stable"

  # 决策建议
  recommendation:
    action: "全量发布"  # full_release / partial_release / no_release / continue_experiment
    confidence: "high"

    reasoning:
      - "主指标提升8.2%，统计显著"
      - "实际业务意义显著"
      - "护栏指标安全"
      - "效应稳定，无新奇效应"

    risks:
      - "Android效果不确定，需后续监控"

    next_steps:
      - "全量发布到iOS和Android"
      - "发布后2周监控关键指标"
      - "如果Android表现持续不佳，考虑回滚"
```

## 输出

**存储路径**：`output/pm-metrics-ops/experiment-execution/`

**输出文件**：experiment_result.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["experiment_id", "conclusion", "primary_metric"],
  "properties": {
    "experiment_id": {"type": "string", "description": "实验ID"},
    "analyzed_at": {"type": "string", "description": "分析时间"},
    "experiment_info": {"type": "object", "description": "实验信息，包含名称、周期和样本量"},
    "conclusion": {"type": "string", "description": "实验结论：positive/negative/neutral"},
    "primary_metric": {"type": "object", "description": "主指标结果，包含对照组/实验组数据和统计检验"},
    "guardrail_metrics": {"type": "object", "description": "护栏指标结果，包含各指标变化和安全性判断"},
    "heterogeneous_effects": {"type": "object", "description": "异质性效应，按平台/用户类型分群分析"},
    "novelty_check": {"type": "object", "description": "新奇效应检测"}
  }
}
```

```yaml
ab_test_result:
  experiment_id: "exp_20240115_simplified_register"
  analyzed_at: "2024-01-22T10:00:00Z"

  # 实验信息
  experiment_info:
    name: "简化注册流程实验"
    start_date: "2024-01-15"
    end_date: "2024-01-21"
    duration_days: 7
    total_sample: 24830

  # 结论
  conclusion: "positive"

  # 主指标
  primary_metric:
    name: "registration_completion_rate"

    control:
      value: 0.352
      sample_size: 12450
      confidence_interval: [0.344, 0.360]

    treatment:
      value: 0.381
      sample_size: 12380
      confidence_interval: [0.373, 0.389]

    lift:
      absolute: 0.029
      relative: 0.082
      confidence_interval: [0.018, 0.040]

    statistics:
      p_value: 0.0000014
      test_method: "two_sample_z_test"
      statistically_significant: true
      practically_significant: true

  # 护栏指标
  guardrail_metrics:
    d7_retention_rate:
      control: 0.42
      treatment: 0.418
      change: -0.47%
      safe: true

    daily_active_users:
      control: 1000000
      treatment: 1001500
      change: +0.15%
      safe: true

    app_crash_rate:
      control: 0.002
      treatment: 0.0021
      change: +5%
      safe: true

  # 异质性效应
  heterogeneous_effects:
    platform:
      ios: { lift: 0.052, significant: true }
      android: { lift: 0.018, significant: false }
    user_type:
      new_users: { lift: 0.041, significant: true }
      returning_users: { lift: 0.015, significant: false }

  # 新奇效应检测
  novelty_check:
    detected: false
    trend_stable: true

  # 决策建议
  decision_recommendation:
    action: "full_release"
    confidence: "high"
    reasoning:
      - "主指标提升8.2%"
      - "护栏指标安全"
      - "无新奇效应"
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| ab_test_result | object | 是 | 实验结果根对象 |
| ab_test_result.experiment_id | string | 是 | 实验ID |
| ab_test_result.analyzed_at | string | 是 | 分析时间 |
| ab_test_result.conclusion | string | 是 | 实验结论，枚举值：positive/negative/neutral/inconclusive |
| ab_test_result.primary_metric | object | 是 | 主指标结果 |
| ab_test_result.primary_metric.name | string | 是 | 主指标名称 |
| ab_test_result.primary_metric.control.value | number | 是 | 对照组值 |
| ab_test_result.primary_metric.treatment.value | number | 是 | 实验组值 |
| ab_test_result.primary_metric.lift.relative | number | 是 | 相对提升 |
| ab_test_result.primary_metric.statistics.p_value | number | 是 | p值 |
| ab_test_result.primary_metric.statistics.statistically_significant | boolean | 是 | 是否统计显著 |
| ab_test_result.guardrail_metrics | object | 是 | 护栏指标结果 |
| ab_test_result.heterogeneous_effects | object | 否 | 异质性效应 |
| ab_test_result.novelty_check | object | 是 | 新奇效应检测 |
| ab_test_result.novelty_check.detected | boolean | 是 | 是否检测到新奇效应 |
| ab_test_result.decision_recommendation | object | 是 | 决策建议 |
| ab_test_result.decision_recommendation.action | string | 是 | 建议行动，枚举值：full_release/partial_release/no_release/continue_experiment |
| ab_test_result.decision_recommendation.confidence | string | 是 | 置信度 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 实验设计变更 | 统计检验参数和终止条件 | 更新统计检验配置，重新评估终止条件 |
| 实验数据更新 | 统计检验和下钻分析 | 重新执行统计检验，更新异质性效应 |
| 终止条件变更 | 实验运行监控 | 更新终止条件，重新评估是否达到终止标准 |

当实验结果自身变更时，对下游的通知机制：

| 结果变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 结论变更 | experiment-report | 标记结论变更，触发报告更新 |
| 护栏指标触发告警 | decision-insight | 标记护栏告警，触发洞察转化 |
| 决策建议变更 | decision-dace | 标记建议变更，触发DACE Conclude |

---

## 决策规则

| 条件组合 | 决策 |
|---------|------|
| 主指标显著+有意义，护栏安全 | 全量发布 |
| 主指标显著，护栏有问题 | 分析护栏原因，再决策 |
| 主指标不显著 | 继续实验或终止 |
| 有新奇效应 | 延长实验 |
| 异质性显著 | 分群体发布 |

## 质量检查

- [ ] 实验分组流量分配正确
- [ ] 护栏指标未触发告警
- [ ] 实验数据采集完整
- [ ] 统计显著性计算正确

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 实验配置缺失 | 无法自动监控，需用户提供实验结果数据 | 无法执行运行中监控 |
| 实验数据缺失 | 用户提供实验结果数据 → 直接分析 | 无法进行趋势分析和新奇效应检测 |
| 实验配置 + 实验数据均缺失 | 用户提供实验结果数据 → 直接分析 | 输出基于用户数据的分析结果，趋势和新奇效应标注"待补充" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **实验结果数据**：实验组和对照组的样本量、指标均值、标准差等
- **实验配置**（可选）：实验的分流比例、运行时间、指标定义
- **统计显著性要求**（可选）：期望的置信水平和统计功效

### 执行频率

- **运行中监控**：每4小时或每日
- **结果分析**：达到终止条件时触发
- **自动告警**：P0问题立即触发
