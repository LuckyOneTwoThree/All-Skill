---
name: analysis-anomaly
description: 当需要自动检测和归因指标异常时使用。自动化数据分析引擎，AI自动执行7×24小时运行，负责指标健康检查、异常检测、自动归因和洞察推送。当发现指标异常时输出完整的异常报告。关键词：异常检测、数据分析、自动归因、指标监控、异常报告、指标异常、数据异常、异常告警。
metadata:
  module: "产品度量运营"
  sub-module: "数据分析"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 4：自动化数据分析引擎

## 核心原则

1. **全量分析**：对全量数据进行异常检测，不依赖抽样推断
2. **实时感知**：7×24小时运行，每小时核心指标健康检查，确保异常即时发现
3. **自动归因**：异常检测后自动执行归因流程——确认真实性、定位范围、关联外部事件、生成归因结论
4. **决策规则显式化**：P0异常即时推送+电话告警、P1异常2小时内通知，规则前置而非事后判断

## 交互模式

🤖 AI自动执行（数据分析类）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 指标体系 | JSON | 是 | output/pm-metrics-design/metrics-system/metrics.json | 需要监控的核心指标列表及定义 |
| 实时数据流 | JSON | 是 | 数据仓库/实时计算平台 | 指标时序数据 |
| 告警规则 | JSON | 是 | 用户提供 | 各类指标异常的阈值配置 |
| 事件日历 | JSON | ○ | 用户提供 | 产品改动、运营活动、市场事件等外部事件 |

## 执行步骤

### Step 1：每小时核心指标健康检查

```
每小时定时执行
├── 获取所有核心指标当前值
├── 计算同比（上周同期）、环比（上小时）变化
├── 对比预设阈值和历史波动范围
└── 标记需要关注的指标
```

### Step 2：异常检测

| 检测方法 | 说明 |
|---------|------|
| 统计阈值 | 基于历史数据设定上下限（如±3σ） |
| 趋势偏离 | 与历史趋势的显著偏离 |
| 环比异常 | 与近期数据的大幅波动 |
| 同比异常 | 与去年同期相比的显著变化 |

### Step 3：自动归因

异常自动归因四步法：

```
1. 确认真实性
   ├── 排除数据延迟问题
   ├── 排除数据管道故障
   ├── 排除统计噪声（自然波动）
   └── 确认为真实异常

2. 定位范围
   ├── 影响多少用户
   ├── 影响哪些功能/页面
   ├── 影响哪些平台/渠道
   └── 持续多长时间

3. 关联外部事件
   ├── 产品改动（版本发布、功能开关）
   ├── 运营活动（促销、推送、弹窗）
   ├── 市场事件（竞品动作、热点事件）
   └── 环境因素（节假日、天气、突发事件）

4. 生成归因结论
   ├── 最可能原因（most_likely_cause）
   ├── 置信度（confidence）
   ├── 支持证据（evidence）
   └── 建议行动（recommended_action）
```

### Step 4：洞察推送

根据异常严重程度推送：

- **P0（严重）**：即时推送 + 电话告警
- **P1（重要）**：2小时内通知
- **P2（一般）**：每日汇总
- **P3（提示）**：仅记录

## 输出

**输出Schema**：

```json
{
  "type": "object",
  "required": ["metric_name", "current_value", "severity", "attribution"],
  "properties": {
    "metric_name": {"type": "string", "description": "异常指标名称"},
    "current_value": {"type": "number", "description": "当前值"},
    "expected_range": {"type": "array", "description": "预期范围"},
    "deviation": {"type": "string", "description": "偏离程度"},
    "severity": {"type": "string", "description": "严重程度：P0/P1/P2/P3"},
    "attribution": {"type": "object", "description": "归因信息，包含真实性判断、相关事件和推荐行动"},
    "trend_chart_url": {"type": "string", "description": "趋势图URL"},
    "raw_data_url": {"type": "string", "description": "原始数据URL"}
  }
}
```

```yaml
anomaly_report:
  timestamp: "2024-01-15T10:30:00Z"

  # 基本信息
  metric_name: "dau_conversion_rate"
  current_value: 12.3
  expected_range: [15.0, 20.0]
  deviation: -27%

  # 严重程度
  severity: "P1"  # P0/P1/P2/P3

  # 归因信息
  attribution:
    is_real: true
    scope:
      affected_users: 150000
      affected_platforms: ["iOS", "Android"]
      affected_features: ["首页推荐"]
      duration: "ongoing"

    related_events:
      - type: "product_release"
        name: "v2.5.0发布"
        time: "2024-01-15T08:00:00Z"
        confidence: 0.85
      - type: "marketing_campaign"
        name: "新年促销活动"
        time: "2024-01-14T00:00:00Z"
        confidence: 0.3

    most_likely_cause: |
      v2.5.0版本中首页推荐算法改动，
      导致推荐内容与用户兴趣匹配度下降

    confidence: 0.85

    evidence:
      - "异常发生在版本发布后2小时内"
      - "iOS和Android同时下降，排除端侧问题"
      - "非活动时段，排除营销影响"

    recommended_action: |
      1. 立即检查v2.5.0首页推荐算法改动
      2. 如果2小时内无法定位，准备回滚
      3. 准备A/B测试验证假设

    needs_human_confirmation: true

  # 辅助信息
  trend_chart_url: "output/pm-metrics-ops/analysis-anomaly/charts/dau_conversion_20240115.png"
  raw_data_url: "output/pm-metrics-ops/analysis-anomaly/data/dau_conversion_20240115.json"
```

### 存储路径

```
output/pm-metrics-ops/analysis-anomaly/
├── anomaly_reports/
│   ├── YYYYMMDD_HHMMSS_anomaly_{metric}.yaml
│   └── summary_{date}.yaml
├── charts/
│   └── {metric}_{date}.png
└── data/
    └── {metric}_{date}.json
```

### 配置示例

```yaml
# 指标异常检测配置
anomaly_detection:
  core_metrics:
    - name: "dau"
      threshold_type: "absolute"
      min_value: 1000000
      max_value: null
      alert_on: "below"

    - name: "dau_conversion_rate"
      threshold_type: "statistical"
      std_multiplier: 3
      min_change_pct: 5
      alert_on: "both"

    - name: "revenue_daily"
      threshold_type: "relative"
      vs_last_week_pct: -15
      alert_on: "below"

  notification:
    channels:
      - type: "slack"
        url: "${SLACK_WEBHOOK}"
      - type: "phone"
        for_severity: ["P0"]
```

## 决策规则

| 条件 | Action |
|-----|--------|
| P0异常（核心指标↓ > 10%） | 即时推送 + 电话告警 + 自动创建Incident |
| P1异常（指标↓ 3-10%） | 2小时内推送 + Slack通知 |
| P2异常（指标↓ 1-3%） | 每日汇总 |
| P3波动（指标↓ < 1%） | 记录，持续监控 |
| 需要人工确认 | 发送确认请求，等待响应 |

## 质量检查

- [ ] 异常检测覆盖所有关键指标
- [ ] 异常等级分类正确（P0/P1/P2）
- [ ] 根因分析有数据支撑
- [ ] 建议措施可操作

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 指标体系缺失 | 提示用户提供指标数据和异常描述，基于描述进行归因分析 | 异常检测范围基于用户描述，可能遗漏未关注指标 |
| 实时数据流缺失 | 用户提供指标数据和异常描述 → 基于描述归因分析 | 无法自动检测异常，依赖用户主动发现 |
| 指标体系 + 实时数据流均缺失 | 用户提供指标数据和异常描述 → 基于描述归因分析 | 输出基于描述的归因分析报告，标注"待验证" |

- 若用户未提供告警规则，提示用户提供或跳过该输入相关步骤
- 若用户未提供事件日历，提示用户提供或跳过该输入相关步骤

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **指标数据**：异常指标的名称、当前值、基线值、变化幅度
- **异常描述**：观察到的异常现象和发生时间
- **近期变更**（可选）：可能相关的产品改动或运营活动

### 执行频率

- **正常运行**：每小时执行一次
- **P0异常期间**：每15分钟更新状态
- **例行报告**：每日8:00生成日报
