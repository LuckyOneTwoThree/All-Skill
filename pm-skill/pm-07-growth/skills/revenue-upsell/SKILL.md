---
name: revenue-upsell
description: 当需要优化升级转化策略时使用。升级转化自动化Pipeline，识别升级信号用户，自动生成个性化升级内容，优化触达时机，设计A/B测试。关键词：升级转化、增购、Upsell、升级策略、交叉销售。
metadata:
  module: "产品增长与运营"
  sub-module: "变现"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 10: 升级转化自动化

## 核心原则

1. **千人千面**：不同用户分群采用差异化升级推荐策略
2. **自动实验持续优化**：升级方案通过A/B测试验证，让数据决定最优方案
3. **实时优化**：基于实时使用数据动态调整升级推荐时机和内容
4. **数据驱动归因**：量化每个升级触点对转化的贡献

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 用户行为数据 | object | 是 | 用户提供 | 使用量、功能使用、协作行为 |
| 付费历史数据 | object | 是 | output/pm-growth/revenue-nrr/nrr_report.yaml | 历史套餐、付费金额、付费周期 |
| 产品使用数据 | object | ○ | 用户提供 | 功能使用详情、用量统计 |

## 升级信号类型

### 类型1: 用量触顶信号
| 信号 | 描述 | 升级潜力 |
|------|------|---------|
| 存储达到上限 | 文件存储接近免费版限制 | 高 |
| API调用超限 | API调用接近配额 | 高 |
| 席位使用满额 | 团队人数达到免费版上限 | 高 |
| 功能使用超限 | 某些功能有使用次数限制 | 中 |

### 类型2: 功能需求信号
| 信号 | 描述 | 升级潜力 |
|------|------|---------|
| 高级功能访问 | 频繁访问付费专属功能 | 高 |
| 协作功能使用 | 使用团队协作功能 | 高 |
| API深度使用 | 使用高级API功能 | 高 |
| 定制化需求 | 出现定制化需求 | 中 |

### 类型3: 行为信号
| 信号 | 描述 | 升级潜力 |
|------|------|---------|
| 高频使用 | 远超普通用户的使用频率 | 高 |
| 长时间使用 | 远超普通用户的使用时长 | 中 |
| 多项目操作 | 同时操作多个项目/工作区 | 高 |
| 关键功能使用 | 使用核心商业功能 | 高 |

### 类型4: 意向信号
| 信号 | 描述 | 升级潜力 |
|------|------|---------|
| 定价页访问 | 频繁查看付费定价 | 高 |
| 对比页访问 | 查看不同套餐对比 | 高 |
| 试用申请 | 申请付费功能试用 | 高 |
| 客服咨询 | 咨询升级相关问题 | 高 |

## 执行步骤

### Step 1: 升级信号识别

#### 信号检测规则
```yaml
signal_rules:
  usage_limit:
    - condition: "storage_usage >= 0.8 * free_limit"
      weight: 0.9
    - condition: "storage_usage >= 0.6 * free_limit"
      weight: 0.6
      
  feature_access:
    - condition: "premium_feature_access_count >= 5"
      weight: 0.8
      
  behavioral:
    - condition: "daily_active_days >= 5 AND avg_session > 30min"
      weight: 0.7
```

#### 信号强度计算
```python
signal_strength = (
    signal_type_weight * 0.4 +
    behavior_frequency * 0.3 +
    recency_factor * 0.3
)
```

#### 升级机会评分
```python
upgrade_score = (
    usage_signals * 0.35 +
    feature_signals * 0.30 +
    behavioral_signals * 0.20 +
    intent_signals * 0.15
)
```

#### 优先级分层
| 优先级 | 评分范围 | 特征 | 响应策略 |
|--------|---------|------|---------|
| P0 | ≥0.8 | 多重强信号 | 即时升级引导 |
| P1 | 0.6-0.8 | 明显升级需求 | 主动升级推荐 |
| P2 | 0.4-0.6 | 部分升级信号 | 场景化升级引导 |
| P3 | <0.4 | 潜在升级需求 | 持续培育 |

### Step 2: 升级内容个性化

#### 个性化要素
| 要素 | 内容来源 | 说明 |
|------|---------|------|
| 用户名 | 用户profile | 个性化称呼 |
| 当前用量 | 产品数据 | "您已使用80%" |
| 使用限制 | 产品数据 | 具体限制场景 |
| 升级收益 | 产品信息 | 升级后获得什么 |
| 推荐套餐 | 产品定价 | 最适合的套餐 |

#### 个性化内容模板
```
标题: {用户名}，您已达到{产品名称}{限制类型}上限

正文: 
您在本月已使用了{当前用量}/{免费限制}，
当使用量达到100%时，部分功能将受到限制。

升级到{推荐套餐}，您可以:
✓ {收益1}
✓ {收益2}
✓ {收益3}

{激励信息}

[立即升级] [了解更多]
```

### Step 3: 触达时机优化

#### 最佳触达时机
| 时机 | 触发条件 | 效果 |
|------|---------|------|
| 实时触发 | 达到用量限制时 | 最相关 |
| 行为高峰 | 用户活跃高峰时段 | 触达率高 |
| 功能使用后 | 访问/尝试付费功能后 | 需求明确 |
| 周期性提醒 | 月初/周末 | 决策时间充足 |

#### 触达渠道选择
| 用户类型 | 推荐渠道 | 优先级 |
|---------|---------|--------|
| 高活跃用户 | App弹窗+Push | 实时 |
| 中活跃用户 | 邮件+站内信 | 定期 |
| 低活跃用户 | 邮件+短信 | 强化 |
| 高价值用户 | 邮件+电话 | 全渠道 |

### Step 4: A/B测试设计

#### 测试类型
| 测试类型 | 测试内容 | 目标 |
|---------|---------|------|
| 时机测试 | 不同触发时机的效果 | 找到最佳触发点 |
| 内容测试 | 不同文案的转化效果 | 优化文案 |
| 激励测试 | 不同优惠力度的转化 | 平衡转化率和利润 |
| 渠道测试 | 不同触达渠道的效果 | 优化触达效率 |

#### A/B测试模板
```yaml
test_id: "UPSELL_TEST_{序号}"
test_name: "测试名称"
hypothesis: "如果...那么...的假设"

variants:
  control:
    name: "对照组"
    description: "当前方案"
  treatment:
    name: "实验组"
    description: "测试方案"

metrics:
  primary: "升级转化率"
  secondary: ["升级GMV", "升级用户数"]
  guardrail: ["留存率", "NPS"]

design:
  min_sample_per_variant: 500
  runtime_days: 14
  mde: 0.1
  
success_criteria:
  - primary_metric_lift: ">=10%"
  - guardrail_metrics: "无显著下降"
```

## 输出

**存储路径**：`output/pm-growth/revenue-upsell/`

**输出文件**：upsell_strategy.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["upgrade_signals", "personalized_offers"],
  "properties": {
    "upgrade_signals": {"type": "array", "description": "升级信号用户列表，包含信号类型、评分和推荐套餐"},
    "personalized_offers": {"type": "array", "description": "个性化升级方案列表，包含价值主张和激励"},
    "ab_tests": {"type": "array", "description": "A/B测试设计方案列表"},
    "tracking": {"type": "object", "description": "升级效果追踪，包含转化率、收入影响和ROI"}
  }
}
```

`upsell_automation`
```json
{
  "upgrade_signals": [
    {
      "user_id": "EDU-20240389",
      "current_plan": "free",
      "upgrade_signals": [
        {
          "signal_type": "usage_limit",
          "description": "使用量达到免费版上限80%",
          "strength": 0.85
        },
        {
          "signal_type": "feature_access",
          "description": "频繁访问高级功能",
          "strength": 0.72
        }
      ],
      "overall_score": 0.8,
      "recommended_plan": "pro",
      "expected_revenue_increase": 99
    }
  ],
  "personalized_offers": [
    {
      "offer_id": "OFFER_001",
      "target_segment": "free_user_usage_limit",
      "offer_type": "upgrade_cta",
      "headline": "您已使用免费版80%容量",
      "value_proposition": "升级Pro版，解锁无限使用",
      "incentive": "首年8折",
      "cta_text": "立即升级",
      "personalization_elements": ["用户使用量", "限制场景", "升级收益"]
    }
  ],
  "ab_tests": [
    {
      "test_id": "UPSELL_TEST_001",
      "test_name": "升级弹窗时机优化",
      "hypothesis": "使用量达到70%时展示升级弹窗比达到90%时效果更好",
      "target_segment": "免费版用户",
      "variants": {
        "control": "达到90%时触发",
        "treatment_a": "达到70%时触发",
        "treatment_b": "达到80%时触发"
      },
      "primary_metric": "升级转化率",
      "expected_lift": "15%"
    }
  ],
  "tracking": {
    "total_upgrade_opportunities": 5000,
    "upgrade_messages_sent": 3000,
    "upgrade_conversion_rate": 0.08,
    "revenue_impact": 150000,
    "roi": 4.5
  }
}
```

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 升级评分≥0.8（P0） | 即时触发升级引导 |
| 用量触顶+功能需求双重信号 | 优先推荐匹配套餐 |
| 升级转化率低于5% | 触达内容或时机需A/B测试优化 |
| 护栏指标（留存/NPS）下降 | 暂停升级推送，排查原因 |

## 质量检查

- [ ] 升级信号识别覆盖4类信号（用量/功能/行为/意向）
- [ ] 个性化内容包含用户名、用量、收益3个要素
- [ ] A/B测试设计包含护栏指标
- [ ] 升级ROI计算包含触达成本

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 用户行为数据缺失 | 用户描述付费用户特征 → 生成升级策略 | 升级信号基于用户描述，缺乏行为数据验证 |
| 付费历史缺失 | 跳过付费模式分析，使用通用升级触发规则 | 升级时机判断基于通用规则 |
| 用户行为 + 付费历史均缺失 | 用户描述付费用户特征 → 生成升级策略 | 输出基于描述的升级策略，标注"待数据验证" |
- 若用户未提供产品使用数据，提示用户提供或跳过该输入相关步骤

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **付费用户特征**：当前付费用户的使用行为和付费模式
- **产品层级**（可选）：各付费层级的定价和功能差异
- **升级障碍**（可选）：用户不升级的已知原因

## 关键成功指标

| 指标 | 定义 | 目标值 |
|------|------|--------|
| 升级转化率 | 升级用户/升级机会用户 | ≥8% |
| 升级GMV | 升级带来的月收入增加 | 持续增长 |
| 升级响应率 | 触达后有响应的用户比例 | ≥15% |
| 升级ROI | 升级GMV/触达成本 | ≥3 |
| 升级后留存率 | 升级用户的12个月留存率 | ≥85% |
