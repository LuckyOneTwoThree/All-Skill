---
name: diagnosis-health
description: 当需要诊断产品健康度时使用。产品健康度自动诊断，采集多维度数据并进行综合评分、趋势预测和瓶颈识别，输出健康度报告。关键词：健康度评分、产品诊断、多维度评分、健康检查、产品健康、健康评分。
metadata:
  module: "产品监控与迭代"
  sub-module: "问题诊断"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 3: 产品健康度自动诊断 🤖

## 核心原则

1. **健康度是先行指标不是滞后报告**：健康度评分的目的不是记录过去，而是预测未来——在用户感知到问题之前发现隐患
2. **分层评分独立追踪**：性能/可用性/满意度/业务四层独立评分，确保每层可独立定位和追踪
3. **瓶颈决定资源投向**：健康度诊断的终极目标是识别瓶颈，瓶颈在哪资源就投向哪

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 性能数据 | JSON | 是 | APM/监控系统 → 性能数据 | 响应时间、吞吐量、资源使用率 |
| 可用性数据 | JSON | 是 | 监控系统 → 可用性数据 | SLA 达成率、MTTR、MTBF |
| 用户满意度 | JSON | 是 | 反馈系统 → 满意度数据 | NPS、CSAT、反馈、投诉 |
| 业务指标 | JSON | 是 | 数据分析平台 → 业务指标 | 转化率、GMV、DAU/MAU、留存 |
| 竞品动态 | JSON | ○ | output/pm-monitoring/diagnosis-competition/竞品报告 | 竞品健康度对比数据 |

## 执行步骤

### Step 1: 数据采集标准化

**目标**：采集并标准化各维度数据

**数据源映射**：

| 维度 | 数据源 | 采集方式 |
|------|--------|----------|
| 性能 | APM/监控系统 | API/导出 |
| 可用性 | 监控系统/事件管理 | API/导出 |
| 满意度 | 反馈系统/调研工具 | API/导出 |
| 业务 | 数据分析平台 | SQL/API |

**标准化处理**：
- 时间对齐（统一到相同时间窗口）
- 指标归一化（0-100 或 0-1 范围）
- 异常值处理（剔除/平滑）
- 缺失值填补（插值/均值）

**输出格式**：

```yaml
raw_data:
  collected_at: {ISO8601}
  time_window:
    start: {ISO8601}
    end: {ISO8601}
  dimensions:
    performance:
      metrics: {...}
    availability:
      metrics: {...}
    satisfaction:
      metrics: {...}
    business:
      metrics: {...}
  data_quality:
    completeness: {percentage}
    accuracy: {percentage}
    freshness: {minutes}
```

### Step 2: 维度评分

**目标**：计算各健康维度得分

**评分方法**：

| 维度 | 指标权重 | 评分算法 |
|------|----------|----------|
| 性能 | 响应时间 40%, 吞吐 30%, 资源 30% | 基准偏差评分 |
| 可用性 | SLA 50%, MTTR 25%, 故障频率 25% | 目标达成评分 |
| 满意度 | NPS 40%, CSAT 30%, 投诉率 30% | 行业对标评分 |
| 业务 | 转化率 30%, 留存 30%, GMV 40% | 趋势环比评分 |

**评分公式**：

```
score = Σ(metric_weight × metric_score)
metric_score = min(100, (actual / baseline) × 100)
```

**输出格式**：

```yaml
scores_by_dimension:
  performance:
    score: 85
    trend: improving | stable | declining
    metrics:
      - name: response_time_p95
        value: 120ms
        baseline: 150ms
        score: 125
  availability:
    score: 92
    trend: stable
    metrics:
      - name: sla_achievement
        value: 99.9%
        target: 99.95%
        score: 99.5
  satisfaction:
    score: 78
    trend: declining
    metrics:
      - name: nps
        value: 35
        benchmark: 40
        score: 87.5
  business:
    score: 88
    trend: improving
    metrics:
      - name: conversion_rate
        value: 4.2%
        baseline: 4.0%
        score: 105
```

### Step 3: 趋势预测

**目标**：基于历史数据预测未来健康度趋势

**分析方法**：
- 移动平均（MA）
- 指数平滑（Holt-Winters）
- 趋势外推（线性/多项式回归）

**预测维度**：
- 7 日趋势预测
- 30 日趋势预测
- 季节性分析（如适用）

**输出格式**：

```yaml
trend_analysis:
  prediction_horizon: 7d | 30d
  overall_trend:
    direction: up | down | stable
    change_rate: {percentage}
    confidence: {percentage}
  dimension_trends:
    - dimension: performance
      current: 85
      predicted_7d: 83
      predicted_30d: 80
      risk_alert: true | false
```

### Step 4: 瓶颈识别

**目标**：识别影响整体健康度的关键瓶颈

**分析方法**：
- 维度加权贡献度分析
- 环比/同比异常检测
- 与竞品对标分析

**瓶颈分级**：

| 级别 | 定义 | 响应要求 |
|------|------|----------|
| P0 | 严重威胁业务指标 | 立即处理 |
| P1 | 显著影响用户体验 | 本周处理 |
| P2 | 存在隐患 | 计划处理 |
| P3 | 优化项 | 持续跟进 |

**输出格式**：

```yaml
bottlenecks:
  - id: BOT-001
    dimension: satisfaction
    severity: P1
    description: "NPS 持续下降 3 周"
    root_cause: "支付流程转化率下降"
    impact_score: 8
    affected_metrics: [nps, conversion_rate]
    recommendation: "优化支付流程"
```

### Step 5: 综合报告

**目标**：生成综合健康度诊断报告

**报告结构**：
1. 执行摘要（Overall Score + 关键发现）
2. 各维度详细评分
3. 趋势分析
4. 瓶颈清单
5. 改进建议

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["report_id", "overall_score", "scores_by_dimension"],
  "properties": {
    "report_id": {"type": "string", "description": "报告唯一标识"},
    "generated_at": {"type": "string", "description": "生成时间"},
    "period": {"type": "object", "description": "评估周期，包含起止时间"},
    "overall_score": {"type": "number", "description": "整体健康度评分"},
    "score_trend": {"type": "string", "description": "评分趋势：improving/stable/declining"},
    "scores_by_dimension": {"type": "object", "description": "各维度评分，包含性能/可用性/满意度/业务"},
    "trend_analysis": {"type": "object", "description": "趋势预测，包含7天和30天预测变化"},
    "bottlenecks": {"type": "array", "description": "瓶颈列表，包含严重度和维度"},
    "recommendations": {"type": "array", "description": "改进建议列表，包含优先级和预期影响"}
  }
}
```

```
├── {date}/
│   ├── overall_score.md
│   ├── dimension_scores.yaml
│   ├── trend_analysis.yaml
│   ├── bottlenecks.yaml
│   └── recommendations.md
└── latest/
    └── health_report.md
```

### 健康度报告输出格式

```yaml
health_diagnosis:
  report_id: {uuid}
  generated_at: {ISO8601}
  period:
    start: {ISO8601}
    end: {ISO8601}
  overall_score: 86
  score_trend: improving
  scores_by_dimension:
    performance: 85
    availability: 92
    satisfaction: 78
    business: 88
  trend_analysis:
    predicted_change_7d: -1
    predicted_change_30d: -3
  bottlenecks:
    - id: BOT-001
      severity: P1
      dimension: satisfaction
  recommendations:
    - priority: high
      action: "优化支付流程"
      expected_impact: "+5 NPS"
```

## 决策规则

| 场景 | 决策规则 |
|------|----------|
| 维度得分 < 60 | 标记红色预警，生成专项诊断 |
| 维度得分 60-75 | 标记黄色预警，列入改进计划 |
| 维度得分 > 85 | 标记绿色，保持监控 |
| 预测趋势下降 | 生成预防性建议 |
| 数据缺失 > 30% | 标记数据质量问题，跳过该维度评分 |

## 质量检查

- [ ] 数据采集完整率 ≥ 90%
- [ ] 评分计算准确性（抽样验证）
- [ ] 趋势预测偏差 ±10%
- [ ] 瓶颈识别覆盖率 ≥ 90%
- [ ] 建议可执行率 ≥ 80%
- [ ] 报告生成及时性（< 5 分钟）

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 性能数据 | 用户提供响应时间、吞吐量等关键性能指标数值，AI直接评分 | 性能维度直接评分结果，缺乏自动采集数据 |
| 可用性数据 | 用户提供SLA达成率、故障次数等指标，AI直接评分 | 可用性维度直接评分结果，缺乏自动采集数据 |
| 用户满意度 | 用户提供NPS/CSAT评分和投诉率数据，AI直接评分 | 满意度维度直接评分结果，缺乏自动采集数据 |
| 业务指标 | 用户提供转化率、GMV、DAU/MAU、留存等指标，AI直接评分 | 业务维度直接评分结果，缺乏自动采集数据 |
| 竞品动态 | 跳过竞品对标，瓶颈识别仅基于自身数据 | 无竞品对标的健康度报告 |

### 数据获取说明

当上游文件缺失时，通过以下方式获取必要数据：

1. **多维度数据缺失**：请用户提供各维度的关键指标数值，AI将基于用户提供的数据直接进行维度评分，跳过自动采集和标准化步骤
2. **部分维度缺失**：仅对有数据的维度进行评分，缺失维度标记为"数据不足"，综合评分仅基于可用维度计算并标注置信度
3. **竞品动态缺失**：跳过竞品对标分析，瓶颈识别仅依赖自身数据趋势和阈值判断，建议后续补充竞品数据以完善分析

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| report_id | string | 是 | 报告唯一标识 |
| overall_score | number | 是 | 整体健康度评分，范围0-100 |
| score_trend | string | 是 | 评分趋势，仅允许improving/stable/declining |
| scores_by_dimension | object | 是 | 各维度评分，须含performance/availability/satisfaction/business |
| trend_analysis | object | 否 | 趋势预测，须含predicted_change_7d/predicted_change_30d |
| bottlenecks | array | 否 | 瓶颈列表，每项须含id/severity/dimension |
| bottlenecks[].severity | string | 是 | 严重度，仅允许P0/P1/P2/P3 |

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| APM/监控系统 | 性能指标口径变更 | 性能维度评分和基准对比 | 按新口径重新计算评分 |
| 监控系统 | 可用性数据格式变更 | 可用性维度评分 | 适配新格式，补充缺失字段 |
| 反馈系统 | 满意度指标变更 | 满意度维度评分 | 更新评分算法和权重 |
| 数据分析平台 | 业务指标定义变更 | 业务维度评分和趋势预测 | 按新定义重新计算评分和预测 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| diagnosis-orchestrator | 健康度诊断完成 | 输出文件更新 | 诊断完成状态和关键瓶颈 |
| monitoring-anomaly | 健康度评分异常 | 写入输出文件 | 异常维度和瓶颈详情 |
| iteration-backlog | P0/P1瓶颈识别 | 写入输出文件 | 瓶颈描述和改进建议 |
