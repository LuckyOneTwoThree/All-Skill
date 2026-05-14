---
name: analysis-funnel
description: 当需要分析用户转化路径时使用。漏斗自动分析，AI自动执行全量漏斗计算、多维下钻、流失节点识别和趋势分析。关键词：漏斗分析、转化分析、流失节点、转化率、用户路径、用户在哪儿流失了、转化太低了、用户走不完流程。
metadata:
  module: "产品度量运营"
  sub-module: "数据分析"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["电商", "互联网", "通用"]
  trigger_examples:
    - "注册流程转化率太低了，帮我分析一下"
    - "用户在哪个步骤流失最多"
    - "支付转化漏斗帮我看看"
  interaction_mode: "ai_auto"
---

# 漏斗自动分析

## 核心原则

1. **流失即机会**：每个流失节点都是优化的切入点，最大流失点 = 最大提升空间
2. **下钻才能归因**：整体转化率只告诉你"有问题"，多维下钻才告诉你"问题在哪"
3. **对比才有判断**：绝对值没有意义，环比同比对比才能判断趋势健康度

## 交互模式

🤖 AI自动执行（数据分析类）

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 漏斗定义 | object | 是 | 用户提供 | 漏斗的步骤定义和事件配置 |
| 事件数据 | object | 是 | 用户提供 | 埋点事件数据 |
| 分群配置 | object | ○ | 用户提供 | 可选的用户分群维度 |
| 对比周期 | string | ○ | 用户提供 | 与哪段时间对比 |

## 支持的漏斗类型

| 类型 | 示例 |
|-----|------|
| 转化漏斗 | 浏览→点击→加购→下单→支付 |
| 激活漏斗 | 注册→首次使用→完成新手引导 |
| 付费漏斗 | 曝光→点击→详情→支付→复购 |
| 搜索漏斗 | 搜索→结果页→详情页→加购 |

## 执行步骤

### Step 1：全量漏斗计算

```
获取漏斗定义
├── 查询每个步骤的事件数据
├── 计算各步骤用户数
├── 计算步骤间转化率
└── 计算整体转化率
```

### Step 2：多维下钻

对漏斗进行多维度拆分分析：

| 维度 | 拆分项 |
|-----|--------|
| 平台 | iOS、Android、Web、小程序 |
| 渠道 | 自然流量、付费渠道、分享来源 |
| 用户类型 | 新用户/老用户、付费/免费、高价值/普通 |
| 版本 | 按App版本分组 |
| 地区 | 按国家/省份分组 |
| 时间 | 按小时/天/周分组 |

### Step 3：最大流失节点识别

```
分析每个步骤的流失率
├── 找出流失率最高的步骤
├── 分析该步骤的流失用户特征
├── 关联流失前的用户行为
└── 识别流失原因假设
```

### Step 4：趋势分析

- **时间趋势**：各步骤转化率的日/周/月变化
- **对比分析**：与上一周期对比
- **预测**：基于趋势预测未来表现

## 输出

**存储路径**：`output/pm-metrics-ops/analysis-funnel/`
**输出文件**：funnel_analysis.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["funnel_name", "steps", "overall_conversion"],
  "properties": {
    "funnel_name": {"type": "string", "description": "漏斗名称"},
    "date_range": {"type": "object", "description": "分析时间范围，包含起止日期"},
    "steps": {"type": "array", "description": "漏斗步骤数据，包含事件名、计数和转化率"},
    "overall_conversion": {"type": "number", "description": "整体转化率"},
    "vs_last_period": {"type": "object", "description": "与上期对比，包含变化趋势和关键步骤"},
    "critical_drop": {"type": "object", "description": "关键流失分析，包含维度拆解和潜在原因"}
  }
}
```

```yaml
funnel_analysis:
  analysis_time: "2024-01-15T10:00:00Z"
  
  # 漏斗基本信息
  funnel_name: "电商购买转化漏斗"
  date_range:
    start: "2024-01-08"
    end: "2024-01-14"
  
  # 漏斗步骤数据
  steps:
    - step: 1
      name: "商品详情页浏览"
      event: "product_view"
      count: 500000
      conversion_from_previous: 100.0  # 第一步为100%
      
    - step: 2
      name: "加入购物车"
      event: "add_to_cart"
      count: 80000
      conversion_from_previous: 16.0
      dropoff_from_previous: 420000
      
    - step: 3
      name: "发起结算"
      event: "checkout_start"
      count: 50000
      conversion_from_previous: 62.5
      dropoff_from_previous: 30000
      
    - step: 4
      name: "完成支付"
      event: "purchase_complete"
      count: 35000
      conversion_from_previous: 70.0
      dropoff_from_previous: 15000
  
  # 整体转化率
  overall_conversion: 7.0  # 从第一步到最终支付
  
  # 与上期对比
  vs_last_period:
    change_pct: -5.2
    trend: "declining"
    significant_steps:
      - step: 2  # 加购转化下降
        change: -8.3
      - step: 3  # 结算转化下降
        change: -3.1
  
  # 关键流失分析
  critical_drop:
    step: 1_to_2  # 从浏览到加购
    dropoff_rate: 84.0  # 流失率
    affected_users: 420000
    
    dimension_breakdown:
      platform:
        iOS: 82.0
        Android: 85.0
        Web: 88.0
      user_type:
        new_users: 78.0
        returning_users: 86.0
      traffic_source:
        search: 75.0
        recommendation: 90.0
        direct: 80.0
    
    potential_causes:
      - "商品价格高于用户预期"
      - "详情页信息不够吸引"
      - "推荐算法不够精准"
    
    optimization_suggestions:
      - "优化商品定价策略"
      - "改进详情页设计和内容"
      - "优化推荐算法，提升相关性"
  
  # 详细报告链接
  reports:
    funnel_chart: "output/pm-metrics-ops/analysis-funnel/charts/funnel_purchase_20240114.png"
    trend_chart: "output/pm-metrics-ops/analysis-funnel/charts/funnel_trend_20240114.png"
    dimension_data: "output/pm-metrics-ops/analysis-funnel/data/funnel_dimensions_20240114.json"
```

## 多维下钻示例

```yaml
# 平台维度分析
platform_breakdown:
  ios:
    step1_count: 200000
    step4_count: 15000
    conversion: 7.5
    vs_avg: +0.5
    
  android:
    step1_count: 250000
    step4_count: 16000
    conversion: 6.4
    vs_avg: -0.6
    
  web:
    step1_count: 50000
    step4_count: 4000
    conversion: 8.0
    vs_avg: +1.0

# 用户类型维度分析
user_type_breakdown:
  new_users:
    conversion: 5.2
    main_drop: "step_2_to_3"  # 结算环节流失大
    
  returning_users:
    conversion: 9.8
    main_drop: "step_1_to_2"  # 加购环节流失大
```

## 漏斗定义配置

```yaml
# 漏斗配置示例
funnel_definitions:
  - name: "purchase_conversion"
    description: "电商购买转化漏斗"
    steps:
      - name: "商品详情页浏览"
        event: "product_view"
        conditions:
          page_type: "product_detail"
          
      - name: "加入购物车"
        event: "add_to_cart"
        
      - name: "发起结算"
        event: "checkout_start"
        
      - name: "完成支付"
        event: "purchase_complete"
        conditions:
          payment_status: "success"
    
    conversion_window: 7d  # 7天内完成算转化
    
    exclusion_events:
      - event: "refund_complete"
        window: 30d
```

## 执行频率

- **每日分析**：每日8:00执行
- **按需分析**：手动触发针对特定漏斗的分析
- **实时监控**：核心转化节点的实时监控

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| funnel_analysis | object | 是 | 漏斗分析根对象 |
| funnel_analysis.funnel_name | string | 是 | 漏斗名称 |
| funnel_analysis.date_range | object | 是 | 分析时间范围 |
| funnel_analysis.date_range.start | string | 是 | 开始日期 |
| funnel_analysis.date_range.end | string | 是 | 结束日期 |
| funnel_analysis.steps | array | 是 | 漏斗步骤数据，至少2步 |
| funnel_analysis.steps[].step | number | 是 | 步骤序号 |
| funnel_analysis.steps[].name | string | 是 | 步骤名称 |
| funnel_analysis.steps[].event | string | 是 | 事件名称 |
| funnel_analysis.steps[].count | number | 是 | 用户数 |
| funnel_analysis.steps[].conversion_from_previous | number | 是 | 步骤间转化率 |
| funnel_analysis.overall_conversion | number | 是 | 整体转化率 |
| funnel_analysis.vs_last_period | object | 是 | 与上期对比 |
| funnel_analysis.critical_drop | object | 是 | 关键流失分析 |
| funnel_analysis.critical_drop.step | string | 是 | 流失步骤 |
| funnel_analysis.critical_drop.dropoff_rate | number | 是 | 流失率 |
| funnel_analysis.critical_drop.potential_causes | array | 是 | 潜在原因列表 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 漏斗定义变更 | 步骤配置和转化计算 | 重新执行全量漏斗计算，标记变更步骤 |
| 事件数据更新 | 转化率和流失分析 | 增量更新转化数据，重新评估流失节点 |
| 分群配置变更 | 多维下钻维度 | 更新下钻维度，重新执行分群分析 |
| 对比周期变更 | 环比同比对比 | 重新执行对比分析，更新趋势判断 |

当漏斗分析自身变更时，对下游的通知机制：

| 分析变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 关键步骤转化率下降>10% | decision-dace | 标记告警，触发洞察转化 |
| 流失节点变更 | data-analysis-report | 标记流失变更，触发报告更新 |
| 整体转化率趋势变化 | decision-dace | 标记趋势变化，触发DACE Analyze |

---

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 关键步骤转化率下降>10% | 触发告警，标记为优先优化项 |
| 整体转化率低于行业基准 | 生成全链路优化建议 |
| 新用户转化率显著低于老用户 | 建议优化新用户引导流程 |
| 多维度下钻发现显著差异 | 生成针对性优化方案 |

## 质量检查

- [ ] 漏斗步骤定义完整、无遗漏
- [ ] 转化率计算基于全量数据
- [ ] 流失节点识别附带原因假设
- [ ] 多维下钻覆盖至少3个维度

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 漏斗定义缺失 | 提示用户提供漏斗步骤和各步数据，直接计算转化率 | 漏斗步骤基于用户描述，可能不完整 |
| 事件数据缺失 | 用户提供漏斗步骤和各步数据 → 直接计算转化率 | 无法自动获取数据，依赖用户输入 |
| 漏斗定义 + 事件数据均缺失 | 用户提供漏斗步骤和各步数据 → 直接计算转化率 | 输出基础转化率计算结果，多维下钻标注"待补充" |

- 若用户未提供分群配置，提示用户提供或跳过该输入相关步骤
- 若用户未提供对比周期，提示用户提供或跳过该输入相关步骤

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **漏斗步骤**：转化漏斗的各步骤名称和顺序
- **各步数据**：每个步骤的用户数或事件数
- **对比周期**（可选）：需要对比的时间段

## 关键指标

| 指标 | 计算方式 | 健康范围 |
|-----|---------|---------|
| 整体转化率 | 最终转化/进入用户 | 因业务而异 |
| 步骤转化率 | 下一步/当前步 | 因步骤而异 |
| 流失率 | 流失用户/上步用户 | < 50% 理想 |
| 漏斗效率 | 实际转化/理论最优 | > 60% 良好 |
