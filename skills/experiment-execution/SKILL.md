---
name: experiment-execution
description: 当需要执行A/B测试、分析结果并生成完整报告时使用。A/B测试自动执行、分析与报告生成，AI自动执行实验运行中的监控和实验结束后的分析，包括统计检验、业务意义评估、多维下钻、新奇效应检测，并生成包含实验概述、统计结论、效果分析和行动建议的完整A/B测试报告。关键词：A/B测试执行、统计检验、实验分析、新奇效应、实验监控、实验结果分析、AB测试跑完了帮我看看结果、实验数据怎么看、结果显著吗、A/B测试报告、实验报告、统计结论、效果分析、实验总结、出个实验报告、AB测试总结、实验结果汇报。
metadata:
  module: "产品度量运营"
  sub-module: "实验验证"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "AB测试跑完了，帮我分析结果"
    - "实验数据看起来有差异，显著吗"
    - "帮我监控正在跑的实验"
    - "帮我出一份AB测试的完整报告"
    - "实验做完了，写个总结报告"
    - "把实验结果整理成可汇报的文档"
  interaction_mode: "ai_auto"
---

# A/B测试自动执行、分析与报告

## 核心原则

1. **统计显著≠业务有效**：p值只告诉你"差异存在"，效应量才告诉你"差异有多大、值不值得做"
2. **异质性是隐藏的真相**：整体正向可能掩盖某群体负向，不下钻就不知道真实效果
3. **新奇效应是实验的陷阱**：初期效应可能随时间衰减，稳定才是可信
4. **实验报告是决策的依据，不是数据的堆砌**：报告的核心价值在于将统计结论转化为可执行的行动建议，回答"我们应该做什么"以及"为什么"

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

### 结束后分析+报告模式

```
触发条件：达到终止条件
├── 锁定数据
├── 统计分析
├── 下钻分析
├── 生成结论
├── 生成报告
└── 输出建议
```

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 实验设计文档 | object | 是 | output/pm-metrics-ops/experiment-design/experiment_design.json | experiment-design 输出的实验方案 |
| 实验数据 | object | 是 | 用户提供 | 分组数据、指标数据、护栏指标数据 |
| 终止条件 | object | 是 | output/pm-metrics-ops/experiment-design/experiment_design.json | 样本量目标、运行时长、最小可检测效应 |
| 产品背景 | text | 否 | 用户输入 | 产品阶段、业务目标、历史实验 |

## 执行步骤

### Step 1：实验监控与结果分析（original experiment-execution）

统计检验、业务意义评估、多维下钻、新奇效应检测

#### 1.1 统计显著性检验

##### 检验方法选择

| 指标类型 | 检验方法 | 说明 |
|---------|---------|------|
| 比例（转化率） | Z-test / 卡方检验 | 二项分布 |
| 均值（收入） | T-test / Mann-Whitney | 正态/非正态 |
| 分布（时长） | KS检验 | 分布差异 |
| 多指标 | FDR校正 | 多重检验 |

##### 输出格式

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

#### 1.2 实际业务意义评估

统计显著 ≠ 业务有效

```yaml
practical_significance:
  absolute_lift: 0.029
  relative_lift: 0.082

  threshold:
    minimum_meaningful_lift: 0.02

  assessment:
    is_practically_significant: true
    business_verdict: "值得全量发布"
    reasoning: "提升8.2%超过业务阈值5%，预计年收入增加120万"
```

#### 1.3 多维下钻分析

##### 异质性效应检测

```yaml
heterogeneous_effects:
  summary: "发现显著的平台差异"

  dimension_analysis:
    platform:
      ios:
        lift: 0.052
        p_value: 0.001
        significant: true

      android:
        lift: 0.018
        p_value: 0.089
        significant: false

      conclusion: "iOS用户效果显著，Android不显著"

    user_segment:
      new_users:
        lift: 0.041
        significant: true

      returning_users:
        lift: 0.015
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

#### 1.4 新奇效应检测

检测用户初期行为异常：

```yaml
novelty_check:
  enabled: true

  indicators:
    daily_trend:
      day_1: 0.15
      day_3: 0.09
      day_7: 0.08
      day_14: 0.082

    assessment:
      is_novelty_effect: false
      trend_stable: true
      conclusion: "效应稳定，无新奇效应"

    actions:
      if_novelty: "延长实验周期2周"
      if_stable: "可进入决策流程"
```

#### 1.5 决策建议生成

```yaml
decision_recommendation:
  overall_assessment:
    statistical_significance: true
    practical_significance: true
    guardrail_metrics_safe: true
    no_heterogeneous_risks: true
    novelty_effect_resolved: true

  conclusion: "positive"

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

  heterogeneous_effects:
    summary: "iOS效果显著(+5.2%)，Android不显著(+1.8%)"
    recommendations:
      - "考虑分平台发布策略"
      - "Android版本需要进一步优化"

  novelty_check:
    detected: false
    trend: "stable"

  recommendation:
    action: "全量发布"
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

### Step 2：A/B测试报告生成（from experiment-report）

实验概述、统计结论、效果分析、行动建议

#### 2.1 实验概述组装

从实验设计方案提取核心要素：

1. **实验身份**：实验名称、ID、运行周期、样本量
2. **假设陈述**：原假设 H₀ 和备择假设 H₁
3. **指标体系**：核心指标（OEC）、护栏指标、辅助指标
4. **分流方案**：实验组/对照组配比、流量占比、分层策略

#### 2.2 统计结论提炼

从实验执行结果提炼统计结论：

1. **核心指标结论**：效应量、置信区间、p值、统计功效
2. **护栏指标检查**：各护栏指标是否触发告警阈值
3. **样本量验证**：实际样本量是否达到预设MDE要求
4. **统计显著性判定**：显著/不显著/边际显著，附判定依据

#### 2.3 效果深度分析

对核心效果进行多维度分析：

1. **效应量解读**：绝对提升、相对提升、业务影响换算
2. **异质性效应**：按用户分群（新/老、平台、地域等）的下钻分析
3. **新奇效应评估**：短期效应 vs 长期效应预判
4. **交互效应**：与其他正在运行实验的潜在交互

#### 2.4 行动建议生成

基于统计结论和效果分析，生成分层行动建议：

| 结论类型 | 建议等级 | 行动 |
|----------|----------|------|
| 核心指标显著正向 + 护栏安全 | 🟢 强烈推荐全量 | 全量发布 + 监控计划 |
| 核心指标显著正向 + 护栏有风险 | 🟡 条件推荐 | 分阶段全量 + 护栏专项优化 |
| 核心指标不显著 | 🔵 需要更多信息 | 延长周期/扩大样本/调整指标 |
| 核心指标显著负向 | 🔴 建议终止 | 终止实验 + 根因分析 |
| 异质性效应显著 | 🟠 分群策略 | 分群差异化发布 |

#### 2.5 报告组装

将以上内容组装为完整报告。

## 输出

**存储路径**：`output/pm-metrics-ops/experiment-execution/`

**输出文件**：

| 文件 | 路径 | 说明 |
|------|------|------|
| 实验结果数据 | `output/pm-metrics-ops/experiment-execution/experiment_result.json` | 机器可消费的实验结果数据 |
| A/B测试报告 | `output/pm-metrics-ops/experiment-execution/experiment-report.md` | 人类可读的完整报告 |
| 结构化报告数据 | `output/pm-metrics-ops/experiment-execution/experiment-report.json` | 机器可消费的结构化报告数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["experiment_id", "conclusion", "primary_metric", "summary", "action_recommendation"],
  "properties": {
    "experiment_id": {"type": "string", "description": "实验ID"},
    "analyzed_at": {"type": "string", "description": "分析时间"},
    "experiment_info": {"type": "object", "description": "实验信息，包含名称、周期和样本量"},
    "conclusion": {"type": "string", "description": "实验结论：positive/negative/neutral/inconclusive"},
    "primary_metric": {"type": "object", "description": "主指标结果，包含对照组/实验组数据和统计检验"},
    "guardrail_metrics": {"type": "object", "description": "护栏指标结果，包含各指标变化和安全性判断"},
    "heterogeneous_effects": {"type": "object", "description": "异质性效应，按平台/用户类型分群分析"},
    "novelty_check": {"type": "object", "description": "新奇效应检测"},
    "experiment_name": {"type": "string", "description": "实验名称"},
    "report_date": {"type": "string", "description": "报告日期"},
    "summary": {"type": "object", "description": "统计结论摘要，包含结论、推荐和主指标结果"},
    "novelty_effect": {"type": "object", "description": "新奇效应评估"},
    "action_recommendation": {"type": "object", "description": "行动建议，包含决策、理由、风险和后续实验"}
  }
}
```

### 实验结果数据示例

```yaml
ab_test_result:
  experiment_id: "exp_20240115_simplified_register"
  analyzed_at: "2024-01-22T10:00:00Z"

  experiment_info:
    name: "简化注册流程实验"
    start_date: "2024-01-15"
    end_date: "2024-01-21"
    duration_days: 7
    total_sample: 24830

  conclusion: "positive"

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

  heterogeneous_effects:
    platform:
      ios: { lift: 0.052, significant: true }
      android: { lift: 0.018, significant: false }
    user_type:
      new_users: { lift: 0.041, significant: true }
      returning_users: { lift: 0.015, significant: false }

  novelty_check:
    detected: false
    trend_stable: true

  decision_recommendation:
    action: "full_release"
    confidence: "high"
    reasoning:
      - "主指标提升8.2%"
      - "护栏指标安全"
      - "无新奇效应"
```

### Markdown 报告结构

```markdown
# A/B测试报告：{实验名称}

## 1. 实验概述
- 实验ID / 运行周期 / 样本量
- 假设陈述（H₀ / H₁）
- 指标体系（核心 / 护栏 / 辅助）
- 分流方案

## 2. 统计结论
- 核心指标：效应量 [CI] (p=xxx)
- 护栏指标：✅/⚠️/❌ 逐项检查
- 样本量验证：达标/未达标
- 综合判定：显著正向 / 不显著 / 显著负向

## 3. 效果分析
- 效应量解读（绝对/相对/业务换算）
- 异质性效应（分群下钻表格）
- 新奇效应评估
- 交互效应检查

## 4. 行动建议
- 推荐行动 + 理由
- 风险提示
- 后续实验建议

## 5. 附录
- 统计方法说明
- 数据质量检查
- 完整指标明细表
```

### 结构化报告数据示例

```json
{
  "experiment_id": "",
  "experiment_name": "",
  "report_date": "",
  "summary": {
    "conclusion": "significant_positive|not_significant|significant_negative|marginal",
    "recommendation": "ship_full|ship_conditional|extend|terminate|segmented",
    "primary_metric": {
      "name": "",
      "control_value": 0,
      "treatment_value": 0,
      "absolute_lift": 0,
      "relative_lift": 0,
      "confidence_interval": [0, 0],
      "p_value": 0,
      "statistical_power": 0
    },
    "guardrail_status": []
  },
  "heterogeneous_effects": [],
  "novelty_effect": {},
  "action_recommendation": {
    "decision": "",
    "rationale": "",
    "risks": [],
    "next_experiments": []
  }
}
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
| experiment_id | string | 是 | 实验ID（报告） |
| experiment_name | string | 是 | 实验名称（报告） |
| report_date | string | 是 | 报告日期 |
| summary | object | 是 | 统计结论摘要 |
| summary.conclusion | string | 是 | 结论，枚举值：significant_positive/not_significant/significant_negative/marginal |
| summary.recommendation | string | 是 | 建议，枚举值：ship_full/ship_conditional/extend/terminate/segmented |
| summary.primary_metric | object | 是 | 主指标结果 |
| summary.primary_metric.name | string | 是 | 主指标名称 |
| summary.primary_metric.relative_lift | number | 是 | 相对提升 |
| summary.primary_metric.p_value | number | 是 | p值 |
| summary.guardrail_status | array | 是 | 护栏指标状态列表 |
| heterogeneous_effects | array | 否 | 异质性效应分析 |
| novelty_effect | object | 否 | 新奇效应评估 |
| action_recommendation | object | 是 | 行动建议 |
| action_recommendation.decision | string | 是 | 决策 |
| action_recommendation.rationale | string | 是 | 理由 |
| action_recommendation.risks | array | 是 | 风险列表 |
| action_recommendation.next_experiments | array | 否 | 后续实验建议 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 实验设计变更 | 统计检验参数和终止条件 | 更新统计检验配置，重新评估终止条件 |
| 实验数据更新 | 统计检验和下钻分析 | 重新执行统计检验，更新异质性效应 |
| 终止条件变更 | 实验运行监控 | 更新终止条件，重新评估是否达到终止标准 |
| 产品背景变更 | 行动建议的业务针对性 | 重新评估行动建议，更新风险和后续实验建议 |

当实验结果/报告自身变更时，对下游的通知机制：

| 结果/报告变更类型 | 通知范围 | 通知方式 |
|-------------------|----------|----------|
| 结论变更 | decision-dace | 标记结论变更，触发DACE Analyze |
| 护栏指标触发告警 | decision-dace | 标记护栏告警，触发洞察转化 |
| 决策建议变更 | decision-dace | 标记建议变更，触发DACE Conclude |
| 行动建议变更 | decision-culture | 标记建议变更，触发报告推送 |

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
- [ ] 统计结论与数据一致
- [ ] 行动建议与结论一致
- [ ] 护栏指标全覆盖
- [ ] 异质性效应已分析（至少3个分群维度）

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 实验配置缺失 | 无法自动监控，需用户提供实验结果数据 | 无法执行运行中监控 |
| 实验数据缺失 | 用户提供实验结果数据 → 直接分析 | 无法进行趋势分析和新奇效应检测 |
| 实验配置 + 实验数据均缺失 | 用户提供实验结果数据 → 直接分析 | 输出基于用户数据的分析结果，趋势和新奇效应标注"待补充" |
| 无实验设计方案 | 基于执行结果反推实验设计要素，标注"设计信息缺失" | 实验概述章节不完整 |
| 无产品背景 | 聚焦统计结论本身，行动建议标注"需结合业务上下文" | 行动建议可能缺乏业务针对性 |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **实验结果数据**：实验组和对照组的样本量、指标均值、标准差等
- **实验配置**（可选）：实验的分流比例、运行时间、指标定义
- **统计显著性要求**（可选）：期望的置信水平和统计功效
- **产品背景**（可选）：产品阶段、业务目标和历史实验

### 执行频率

- **运行中监控**：每4小时或每日
- **结果分析**：达到终止条件时触发
- **报告生成**：结果分析完成后自动触发
- **自动告警**：P0问题立即触发

## 版本历史

- v1.0: 初始版本（experiment-execution）
- v2.0: 合并 experiment-execution + experiment-report，新增A/B测试报告生成步骤
