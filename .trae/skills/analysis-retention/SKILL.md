---
name: analysis-retention
description: 当需要分析用户粘性和流失风险时使用。留存自动分析，AI自动执行全量留存曲线、Cohort分析、Aha Moment搜索和流失预警。关键词：留存分析、Cohort分析、Aha Moment、流失预警、用户粘性、用户回不来、留存太差、用户什么时候走的。
metadata:
  module: "产品度量运营"
  sub-module: "数据分析"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "新用户7日留存只有15%，帮我分析一下"
    - "用户什么时候开始流失的"
    - "帮我找找Aha Moment"
  interaction_mode: "ai_auto"
---

# 留存自动分析

## 核心原则

1. **留存是产品健康的终极指标**：获客决定天花板，留存决定地板
2. **Aha Moment是增长的杠杆**：找到"啊哈时刻"并提升到达率，比泛化优化更高效
3. **预警优于召回**：在用户流失前干预，远比流失后召回成本低、效果好

## 交互模式

🤖 AI自动执行（数据分析类）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 用户行为数据 | object | 是 | 用户提供 | 用户所有行为事件 |
| 分群定义 | object | ○ | 用户提供 | 用户分群配置 |
| Cohort配置 | object | ○ | 用户提供 | Cohort划分规则 |
| 基准日期 | string | ○ | 用户提供 | 分析基准时间 |

## 执行步骤

### Step 1：全量留存曲线

```
计算标准留存曲线
├── 定义时间周期（日/周/月）
├── 计算次日/D+7/D+30留存率
├── 绘制留存曲线
└── 识别曲线形态
```

### Step 2：留存曲线形态判断

| 曲线形态 | 特征 | 含义 |
|---------|------|------|
| 微笑型 | 初期下降后回升 | 用户习惯后持续使用 |
| L型 | 初期大幅下降后平稳 | 产品仅满足一次性需求 |
| 陡降型 | 快速持续下降 | 产品粘性不足 |
| 平滑型 | 缓慢稳定下降 | 健康稳定的用户群 |

### Step 3：Cohort自动分析

按Cohort（同期群）分析留存变化：

```
Cohort划分
├── 时间Cohort：按首次使用日期
├── 渠道Cohort：按首次来源
├── 行为Cohort：按首次行为类型
└── 价值Cohort：按首日价值
```

### Step 4：Aha Moment自动搜索

```
识别"啊哈时刻"
├── 分析留存用户 vs 流失用户的早期行为差异
├── 计算各行为与留存的相关系数
├── 寻找临界点行为（如使用某功能X次）
└── 验证假设
```

### Step 5：流失预警模型

```
流失风险评估
├── 定义流失用户（连续N天未使用）
├── 提取流失前的行为特征
├── 构建流失预警模型
└── 输出高风险用户列表
```

## 输出

**存储路径**：`output/pm-metrics-ops/analysis-retention/`
**输出文件**：retention_analysis.json

输出文件：retention_curve_{date}.png、cohort_heatmap_{date}.png、aha_moment_{date}.yaml、churn_risk_users_{date}.csv

**输出Schema**：

```json
{
  "type": "object",
  "required": ["overall"],
  "properties": {
    "overall": {"type": "object", "description": "整体留存数据，包含关键节点、曲线形态和历史对比"},
    "cohort_trend": {"type": "object", "description": "Cohort趋势分析，包含月度队列和洞察"},
    "aha_moment_candidates": {"type": "array", "description": "Aha Moment候选列表，包含行为、留存提升和统计显著性"},
    "churn_prediction": {"type": "object", "description": "流失预测，包含高风险用户列表和预警模型"},
    "lifecycle_stages": {"type": "array", "description": "生命周期阶段划分"}
  }
}
```

```yaml
retention_analysis:
  analysis_time: "2024-01-15T10:00:00Z"
  
  # 整体留存
  overall:
    # 关键留存节点
    d1: 45.2  # 次日留存 45.2%
    d7: 28.5  # 7日留存 28.5%
    d30: 18.3  # 30日留存 18.3%
    
    # 曲线形态分析
    curve_shape:
      type: "smooth_decline"
      description: "缓慢稳定下降，属于健康形态"
      d1_to_d7_drop: -37%
      d7_to_d30_drop: -36%
      assessment: "healthy"
    
    # 历史对比
    vs_last_period:
      d1_change: +2.1
      d7_change: +1.5
      d30_change: +0.8
      trend: "improving"
  
  # Cohort趋势
  cohort_trend:
    summary: "近3个月Cohort留存持续改善"
    
    monthly_cohorts:
      - cohort: "2023-12"
        d1: 44.5
        d7: 27.2
        d30: 17.1
        
      - cohort: "2023-11"
        d1: 43.8
        d7: 26.8
        d30: 16.9
        
      - cohort: "2023-10"
        d1: 42.1
        d7: 25.5
        d30: 16.2
    
    insight: "Cohort表现逐月改善，新用户质量提升"
  
  # Aha Moment候选
  aha_moment_candidates:
    - rank: 1
      behavior: "首周完成3次UGC内容发布"
      retention_lift:
        with_behavior: 68.5
        without_behavior: 22.3
        lift: +46.2
      correlation: 0.82
      statistical_significance: 0.001
      recommendation: |
        设计引导机制鼓励用户首周发布UGC内容
      
    - rank: 2
      behavior: "首日添加5个好友"
      retention_lift:
        with_behavior: 72.1
        without_behavior: 31.5
        lift: +40.6
      correlation: 0.78
      statistical_significance: 0.002
      recommendation: |
        优化好友推荐算法和添加好友流程
      
    - rank: 3
      behavior: "首周参与3次社区活动"
      retention_lift:
        with_behavior: 65.3
        without_behavior: 25.8
        lift: +39.5
      correlation: 0.75
      statistical_significance: 0.003
      recommendation: |
        优化新用户活动引导
  
  # 流失风险
  churn_risk:
    # 风险分布
    distribution:
      high_risk: 12500  # 高风险用户数
      medium_risk: 35000
      low_risk: 85000
      healthy: 180000
    
    high_risk_count: 12500
    high_risk_rate: 4.8
    
    # 流失前兆行为
    pre_churn_behaviors:
      - "连续3天未打开App"
      - "互动频率下降50%"
      - "核心功能使用减少"
      - "反馈/投诉增加"
    
    recommended_intervention:
      high_risk:
        - action: "Push召回"
          trigger: "连续2天未打开"
          template: "召回模板_v2"
        - action: "专属优惠"
          trigger: "高价值用户+连续3天未打开"
          offer: "7天VIP体验"
        - action: "客服回访"
          trigger: "流失预警+曾有投诉"
          channel: "人工电话"
          
      medium_risk:
        - action: "个性化推荐优化"
          description: "调整推荐算法，增加用户感兴趣内容"
        - action: "功能提醒"
          description: "推送用户可能感兴趣但未使用的功能"
  
  # 详细数据链接
  reports:
    retention_curve: "output/pm-metrics-ops/analysis-retention/charts/retention_curve_20240114.png"
    cohort_heatmap: "output/pm-metrics-ops/analysis-retention/charts/cohort_heatmap_20240114.png"
    aha_analysis: "output/pm-metrics-ops/analysis-retention/data/aha_moment_20240114.yaml"
    churn_users: "output/pm-metrics-ops/analysis-retention/data/churn_risk_users_20240114.csv"
```

## Cohort分析示例

```yaml
# 时间Cohort分析
time_cohort:
  table:
    headers: ["Cohort", "用户数", "D1", "D7", "D30"]
    rows:
      - ["2024-01", 50000, 46.2, 29.5, 19.2]
      - ["2023-12", 48000, 45.8, 28.8, 18.5]
      - ["2023-11", 45000, 44.5, 27.5, 17.2]
  
  insight: |
    Cohort D30留存从17.2%提升到19.2%，
    同比增长11.6%，主要归因于Aha Moment优化

# 渠道Cohort分析
channel_cohort:
  organic:
    d30: 22.5
    quality: "high"
  paid:
    d30: 15.2
    quality: "medium"
  referral:
    d30: 28.3
    quality: "excellent"
```

## Aha Moment发现逻辑

```
Step 1: 数据准备
├── 提取新用户首N天的行为
├── 标记留存用户和流失用户
└── 行为数据标准化

Step 2: 特征分析
├── 计算各行为的留存提升
├── 寻找最优阈值（触发X次效果最佳）
├── 相关性分析
└── 显著性检验

Step 3: 验证
├── 分组验证（有无该行为的留存对比）
├── 时间窗口验证（不同周期的Aha）
└── 用户分群验证（是否适用于所有用户）
```

## 流失预警配置

```yaml
# 流失预警配置
churn_prediction:
  # 流失定义
  churn_definition:
    inactive_days: 7  # 连续7天未使用定义为流失
  
  # 预警信号
  early_signals:
    - days: 2
      signals:
        - "未打开App"
        - "推送未点击"
        
    - days: 4
      signals:
        - "核心功能使用 < 30%"
        - "DAU/MAU 下降 > 50%"
        
    - days: 6
      signals:
        - "几乎所有功能使用归零"
        - "明显的流失意图行为"
  
  # 干预策略
  interventions:
    high_value:
      push_content: "个性化召回"
      offer: "专属优惠/权益"
      escalation: "人工客服"
      
    medium_value:
      push_content: "内容推荐"
      offer: "功能引导"
      
    low_value:
      push_content: "通用召回"
```

## 执行频率

- **每日留存计算**：每日8:00更新
- **Cohort周报**：每周一生成周度Cohort报告
- **Aha Moment复盘**：每月重新分析
- **流失预警**：实时计算

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| retention_analysis | object | 是 | 留存分析根对象 |
| retention_analysis.overall | object | 是 | 整体留存数据 |
| retention_analysis.overall.d1 | number | 是 | 次日留存率 |
| retention_analysis.overall.d7 | number | 是 | 7日留存率 |
| retention_analysis.overall.d30 | number | 是 | 30日留存率 |
| retention_analysis.overall.curve_shape | object | 是 | 曲线形态分析 |
| retention_analysis.overall.curve_shape.type | string | 是 | 形态类型，枚举值：smile/L/steep_decline/smooth |
| retention_analysis.cohort_trend | object | 是 | Cohort趋势分析 |
| retention_analysis.aha_moment_candidates | array | 是 | Aha Moment候选列表，至少1个 |
| retention_analysis.aha_moment_candidates[].rank | number | 是 | 排名 |
| retention_analysis.aha_moment_candidates[].behavior | string | 是 | 行为描述 |
| retention_analysis.aha_moment_candidates[].retention_lift | object | 是 | 留存提升数据 |
| retention_analysis.aha_moment_candidates[].correlation | number | 是 | 相关系数 |
| retention_analysis.churn_risk | object | 是 | 流失风险分析 |
| retention_analysis.churn_risk.high_risk_count | number | 是 | 高风险用户数 |
| retention_analysis.churn_risk.high_risk_rate | number | 是 | 高风险用户占比 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 用户行为数据更新 | 留存曲线和Cohort | 重新计算留存曲线，更新Cohort分析 |
| 分群定义变更 | Cohort维度 | 更新分群配置，重新执行Cohort分析 |
| 流失定义变更 | 流失预警模型 | 重新构建流失预警模型，更新高风险用户列表 |
| 基准日期变更 | 留存计算基准 | 重新计算留存数据，更新趋势判断 |

当留存分析自身变更时，对下游的通知机制：

| 分析变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| D7留存下降>5% | decision-dace | 标记告警，触发洞察转化 |
| Aha Moment候选变更 | data-analysis-report | 标记候选变更，触发报告更新 |
| 流失风险等级变更 | decision-dace | 标记风险变更，触发DACE Analyze |

---

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| D7留存下降>5% | 触发流失预警，推送告警 |
| 留存曲线呈陡降型 | 标记产品粘性不足，建议Aha优化 |
| Aha Moment到达率<20% | 建议优化Onboarding引导 |
| 高风险流失用户>5% | 触发干预策略推荐 |

## 质量检查

- [ ] 留存计算基于全量用户而非抽样
- [ ] Cohort分析覆盖时间、渠道、行为三个维度
- [ ] Aha Moment候选通过显著性检验
- [ ] 流失预警模型准确率>70%

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 用户行为数据缺失 | 用户提供留存数据 → 直接分析 | 无法进行Aha Moment搜索和Cohort下钻 |
| 分群定义缺失 | 对全量用户进行分析，不区分分群 | 无法进行分群对比分析 |
| 用户行为数据 + 分群定义均缺失 | 用户提供留存数据 → 直接分析 | 输出基础留存分析，Cohort和Aha Moment标注"待补充" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **留存数据**：各周期（D1/D7/D30等）的留存率数据
- **Cohort数据**（可选）：按时间分组的留存率矩阵
- **关键行为列表**（可选）：可能与留存相关的用户行为

## 关键指标

| 指标 | 说明 | 健康标准 |
|-----|------|---------|
| 次日留存率 | D1留存 | > 40% 优秀 |
| 7日留存率 | D7留存 | > 25% 良好 |
| 30日留存率 | D30留存 | > 15% 可接受 |
| 留存曲线形态 | 曲线趋势 | 微笑型/平滑型 |
| Cohort改善率 | Cohort D30变化 | > 0% 表示改善 |
| 流失预警准确率 | 预测准确度 | > 70% 可用 |
