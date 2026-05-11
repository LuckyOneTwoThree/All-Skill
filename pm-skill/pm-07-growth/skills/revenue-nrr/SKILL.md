---
name: revenue-nrr
description: 当需要追踪净收入留存率时使用。NRR自动追踪与预警Pipeline，自动计算净收入留存率，分析NRR趋势，识别流失预警，识别扩张收入机会。关键词：NRR、净收入留存、收入留存、流失预警、扩张收入。
metadata:
  module: "产品增长与运营"
  sub-module: "变现"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 9: NRR自动追踪与预警

## 核心原则

1. **NRR是收入健康体温计**：NRR>100%意味着产品在自我增长，NRR<100%意味着产品在自我消耗
2. **扩张与流失同等重要**：提升NRR既要减少流失，也要主动识别扩张机会
3. **信号驱动而非周期驱动**：基于风险信号和扩张信号触发行动，而非等待月度报告

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 收入数据 | object | 是 | 用户提供 | MRR、ARR、收入明细 |
| 用户账户数据 | object | 是 | 用户提供 | 付费状态、产品配置 |
| 用户行为数据 | object | ○ | 用户提供 | 使用数据、互动数据 |

## NRR定义与计算

### NRR（净收入留存率）
NRR是衡量收入健康度最重要的指标，反映现有客户在报告期内的收入贡献变化。

```
NRR = (期初收入 - 流失收入 + 扩张收入) / 期初收入

其中：
- 期初收入：期初的MRR
- 流失收入：因流失减少的收入
- 扩张收入：增购和涨价带来的收入
```

### NRR解读
| NRR范围 | 含义 | 评价 |
|--------|------|------|
| NRR ≥ 120% | 优秀 | 极强的收入留存和扩张能力 |
| NRR ≥ 110% | 良好 | 健康增长，可持续 |
| NRR ≥ 100% | 及格 | 勉强留存，需改进 |
| NRR < 100% | 危险 | 收入持续流失 |

## 执行步骤

### Step 1: NRR自动计算

#### 收入数据处理
1. 计算期初收入：月初MRR
2. 计算期末收入：月末MRR
3. 识别收入变动明细：
   - 新增收入（新付费客户）
   - 扩张收入（增购、升级、涨价）
   - 收缩收入（降级、减少用量）
   - 流失收入（流失、取消）

#### NRR公式实现
```python
nrr = (start_mrr - churned_mrr + expansion_mrr) / start_mrr
```

#### 分维度计算
- 按用户分群计算NRR
- 按产品线计算NRR
- 按用户规模计算NRR
- 按行业计算NRR

### Step 2: NRR趋势分析

#### 趋势指标
| 指标 | 说明 |
|------|------|
| 月度NRR | 每月NRR |
| 季度NRR | 季度NRR |
| 年度滚动NRR | 12个月滚动NRR |
| NRR加速度 | NRR变化趋势 |

#### 趋势分析
- NRR环比变化
- NRR同比变化
- NRR分解分析（扩张/收缩/流失占比变化）

#### 预测分析
基于历史趋势，预测未来NRR：
- 乐观预测
- 基准预测
- 悲观预测

### Step 3: 流失预警

#### 流失风险信号
| 信号类型 | 具体信号 | 风险权重 |
|---------|---------|---------|
| 活跃度信号 | 使用频率下降 | 高 |
| 功能信号 | 核心功能使用减少 | 高 |
| 财务信号 | 付款延迟 | 高 |
| 组织信号 | 关键联系人离职 | 中 |
| 反馈信号 | 负面反馈/NPS下降 | 中 |
| 竞品信号 | 使用竞品迹象 | 低 |

#### 风险用户分级
| 风险等级 | 定义 | 响应策略 |
|---------|------|---------|
| 极高风险 | 多重流失信号+高价值 | 立即介入 |
| 高风险 | 明显流失信号 | 3天内介入 |
| 中风险 | 部分流失信号 | 1周内介入 |
| 低风险 | 轻微流失信号 | 持续监控 |

#### 流失预警触发
```yaml
warning_rules:
  - condition: "usage_decline > 50% AND payment_delayed == true"
    level: "critical"
    action: "immediate_escalation"
    
  - condition: "usage_decline > 30%"
    level: "high"
    action: "customer_success_outreach"
    
  - condition: "nps_score < 6"
    level: "medium"
    action: "feedback_followup"
```

### Step 4: 扩张机会识别

#### 扩张信号
| 信号类型 | 具体信号 | 扩张潜力 |
|---------|---------|---------|
| 用量信号 | 使用量达到上限 | 高 |
| 频次信号 | 高频使用核心功能 | 高 |
| 协作信号 | 团队协作功能使用增加 | 中 |
| 功能信号 | 高级功能使用增加 | 中 |
| 需求信号 | 主动询问更高规格 | 高 |

#### 扩张机会评分
```python
expansion_score = (
    usage_intensity * 0.4 +
    feature_adoption * 0.3 +
    team_growth * 0.2 +
    engagement_score * 0.1
)
```

#### 扩张策略推荐
| 扩张类型 | 触发条件 | 推荐策略 |
|---------|---------|---------|
| 升级 | 使用量达到上限 | 升级引导+优惠 |
| 增购 | 团队规模扩大 | 席位增购推荐 |
| 扩展 | 新业务需求 | 新产品线推荐 |

## 输出

**存储路径**：`output/pm-growth/revenue-nrr/`

**输出文件**：nrr_analysis.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["current_nrr", "nrr_breakdown"],
  "properties": {
    "current_nrr": {"type": "number", "description": "当前净收入留存率"},
    "nrr_breakdown": {"type": "object", "description": "NRR分解，包含扩张/收缩/流失收入占比"},
    "trend": {"type": "array", "description": "NRR趋势数据，包含月度NRR和各部分占比"},
    "churn_warnings": {"type": "array", "description": "流失预警列表，包含风险信号和推荐行动"},
    "expansion_opportunities": {"type": "array", "description": "扩张机会列表，包含升级信号和预期收入增长"},
    "summary": {"type": "object", "description": "收入汇总，包含活跃收入、扩张、流失和净新增"}
  }
}
```

`nrr_tracking`
```json
{
  "current_nrr": 1.15,
  "nrr_breakdown": {
    "expansion_revenue_ratio": 0.12,
    "contraction_revenue_ratio": 0.03,
    "churned_revenue_ratio": 0.05
  },
  "trend": [
    {
      "month": "2024-01",
      "nrr": 1.12,
      "expansion": 0.10,
      "contraction": 0.02,
      "churn": 0.06
    }
  ],
  "churn_warnings": [
    {
      "user_id": "EDU-20240156",
      "company_name": "启航教育集团",
      "monthly_revenue": 5000,
      "risk_signals": ["使用量下降", "联系人离职"],
      "risk_level": "high",
      "recommended_action": "客户成功主动联系"
    }
  ],
  "expansion_opportunities": [
    {
      "user_id": "EDU-20240203",
      "company_name": "博学在线科技",
      "current_plan": "pro",
      "expansion_signals": ["使用量接近上限", "高频使用核心功能"],
      "recommended_upgrade": "enterprise",
      "expected_revenue_increase": 3000
    }
  ],
  "summary": {
    "total_active_revenue": 500000,
    "expansion_this_month": 60000,
    "churn_this_month": 25000,
    "net_new_revenue": 35000,
    "at_risk_revenue": 80000,
    "expansion_pipeline": 150000
  }
}
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| current_nrr | number | 是 | 当前NRR，须>0 |
| nrr_breakdown | object | 是 | NRR分解，须含expansion_revenue_ratio/contraction_revenue_ratio/churned_revenue_ratio |
| nrr_breakdown.expansion_revenue_ratio | number | 是 | 扩张收入占比，须≥0 |
| nrr_breakdown.churned_revenue_ratio | number | 是 | 流失收入占比，须≥0 |
| trend | array | 否 | NRR趋势数据，每项须含month/nrr |
| churn_warnings | array | 否 | 流失预警列表，每项须含user_id/risk_signals/risk_level |
| expansion_opportunities | array | 否 | 扩张机会列表，每项须含user_id/expansion_signals/recommended_upgrade |
| summary | object | 否 | 收入汇总，须含total_active_revenue |

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| NRR<100% | 触发收入流失告警，建议紧急干预 |
| 流失风险信号≥2个 | 3天内客户成功介入 |
| 扩张评分>0.7 | 主动推荐升级或增购 |
| NRR连续3个月下降 | 触发战略级Review |

## 质量检查

- [ ] NRR计算包含扩张、收缩、流失三部分
- [ ] 流失预警覆盖活跃度、功能、财务、组织4类信号
- [ ] 扩张机会识别有评分和推荐策略
- [ ] 分维度NRR计算覆盖用户分群和产品线

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 收入数据缺失 | 用户提供收入和流失数据 → 计算NRR | NRR计算基于用户提供的汇总数据 |
| 账户数据缺失 | 跳过账户级NRR分析，仅计算整体NRR | 无法识别高流失风险账户 |
| 收入数据 + 账户数据均缺失 | 用户提供收入和流失数据 → 计算NRR | 输出基础NRR计算，账户级分析标注"待补充" |
- 若用户未提供用户行为数据，提示用户提供或跳过该输入相关步骤

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **收入数据**：月初MRR、扩张MRR、收缩MRR、流失MRR
- **流失数据**（可选）：流失客户数和流失MRR
- **客户分层**（可选）：按规模或价值分的客户分布

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| 用户提供-收入数据 | MRR口径变更 | NRR计算和趋势分析 | 按新口径重新计算NRR |
| 用户提供-账户数据 | 付费状态变更 | 流失预警和扩张机会 | 更新风险评分和扩张信号 |
| 用户提供-行为数据 | 使用指标变更 | 流失信号和扩张信号 | 更新信号权重和触发规则 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| revenue-upsell | 扩张机会变更 | 写入输出文件 | 新的扩张机会和升级推荐 |
| revenue-funnel | NRR数据更新 | 写入输出文件 | NRR趋势和付费转化基准 |
| revenue-orchestrator | NRR追踪完成 | 输出文件更新 | NRR追踪完成状态和关键结论 |

## 关键成功指标

| 指标 | 定义 | 目标值 |
|------|------|--------|
| NRR | 净收入留存率 | ≥115% |
| 流失率 | 月流失MRR/月初MRR | ≤3% |
| 扩张率 | 月扩张MRR/月初MRR | ≥10% |
| 收缩率 | 月收缩MRR/月初MRR | ≤2% |
| 风险收入占比 | 高风险用户MRR/总MRR | ≤10% |
