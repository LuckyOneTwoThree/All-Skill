---
name: acquisition-optimize
description: 当需要优化获客漏斗转化率时使用。获客漏斗自动优化Pipeline，分析获客漏斗数据，识别最大流失节点，自动生成优化方案和A/B测试设计。关键词：获客优化、漏斗优化、转化优化、A/B测试、获客漏斗。
metadata:
  module: "产品增长与运营"
  sub-module: "获客"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 3: 获客漏斗自动优化

## 核心原则

1. **千人千面**：不同用户群体采用差异化漏斗优化策略
2. **自动实验持续优化**：优化方案通过A/B测试持续验证，让数据决定最优方案
3. **实时优化**：基于实时漏斗数据动态调整优化策略
4. **数据驱动归因**：量化每个优化步骤对转化的贡献

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 获客漏斗数据 | object | 是 | output/pm-growth/acquisition-channel/channel_report.json | 获客漏斗全链路数据 |
| 渠道表现数据 | object | 是 | output/pm-growth/acquisition-channel/channel_report.json | 各渠道详细表现数据 |
| 历史优化数据 | object | ○ | 用户提供 | 历史优化实验数据 |

## 漏斗阶段定义

标准获客漏斗包含以下阶段：

```
曝光 → 点击 → 访问 → 注册 → 激活 → 付费
```

### 阶段1: 曝光
- 广告展示给目标用户
- 关键指标: 曝光量、CTR

### 阶段2: 点击
- 用户点击广告进入落地页
- 关键指标: 点击量、CPM

### 阶段3: 访问
- 用户访问落地页/产品页
- 关键指标: UV、跳出率、页面停留时长

### 阶段4: 注册
- 用户完成账号注册
- 关键指标: 注册量、注册率

### 阶段5: 激活
- 用户首次完成核心行为
- 关键指标: 激活量、激活率

### 阶段6: 付费（可选）
- 用户完成首次付费
- 关键指标: 付费量、付费转化率

## 执行步骤

### Step 1: 漏斗各层转化分析

1. **计算各层转化率**: 识别每个阶段的转化效率
2. **对比基准**: 与行业基准、历史数据对比
3. **趋势分析**: 各层转化率的时间趋势
4. **渠道对比**: 不同渠道的漏斗表现差异

### Step 2: 最大流失节点识别

1. **计算流失影响系数**: 
   ```
   影响系数 = 该层流失率 × 该层到最终的转化率权重
   ```

2. **多维度拆分**:
   - 按渠道拆分
   - 按用户画像拆分
   - 按流量来源拆分
   - 按时间拆分

3. **流失原因推断**:
   - 定量分析: 用户行为数据
   - 定性分析: 用户反馈、访谈

### Step 3: 优化方案自动生成

基于流失原因分析，生成针对性优化方案：

| 流失类型 | 优化方向 | 典型方案 |
|---------|---------|---------|
| 认知障碍 | 优化广告素材 | 突出价值主张、改进创意 |
| 信任障碍 | 增强社会证明 | 添加评价、案例、数据 |
| 行动障碍 | 简化流程 | 减少步骤、降低门槛 |
| 价值障碍 | 强化价值感知 | 演示功能、免费试用 |

### Step 4: A/B测试设计

为优化方案设计A/B测试：

1. **假设定义**: 明确测试的优化假设
2. **样本计算**: 确定达到统计显著性所需的样本量
3. **测试分组**: 设计对照组和实验组
4. **监控指标**: 确定主要和次要监控指标
5. **决策规则**: 定义何时停止测试和判定胜负

## 输出

**存储路径**：`output/pm-growth/acquisition-optimize/`

**输出文件**：optimization_plan.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["funnel_analysis", "optimization_suggestions"],
  "properties": {
    "funnel_analysis": {"type": "object", "description": "漏斗分析，包含各阶段数据和关键流失节点"},
    "optimization_suggestions": {"type": "array", "description": "优化建议列表，包含优先级、问题、方案和预期提升"},
    "ab_test_designs": {"type": "array", "description": "A/B测试设计方案列表"}
  }
}
```

`acquisition_optimization`
```json
{
  "funnel_analysis": {
    "stages": [
      {
        "name": "注册",
        "volume": 100000,
        "conversion_rate": 0.05,
        "drop_off_rate": 0.95,
        "avg_time_spent": 30
      }
    ],
    "critical_drop_off": {
      "from_stage": "访问",
      "to_stage": "注册",
      "drop_off_rate": 0.85,
      "impact_score": 0.9
    }
  },
  "optimization_suggestions": [
    {
      "priority": 1,
      "stage": "访问→注册",
      "issue": "注册表单字段过多，教育机构用户填写意愿低",
      "solution": "精简注册表单至3个必填字段，支持微信扫码一键注册",
      "expected_improvement": "预计提升15%转化率",
      "effort": "medium"
    }
  ],
  "ab_test_designs": [
    {
      "test_id": "TEST_001",
      "hypothesis": "简化注册流程可降低访问到注册的流失率",
      "control": "当前6字段注册表单",
      "treatment": "3字段精简注册表单+微信扫码注册",
      "primary_metric": "访问→注册转化率",
      "secondary_metrics": ["注册完成时长", "注册后激活率"],
      "min_sample_size": 10000,
      "estimated_duration": "7天"
    }
  ]
}
```

## A/B测试设计模板

```yaml
test_id: "ACQ_TEST_{序号}"
name: "测试名称"
hypothesis: "如果...那么...的假设"
variants:
  control: "对照组方案描述"
  treatment: "实验组方案描述"
metrics:
  primary: "主要指标"
  secondary: ["次要指标列表"]
  guardrail: ["护栏指标"]
design:
  min_sample_per_variant: 1000
  runtime_days: 7
  mde: 0.05
success_criteria:
  - primary_metric_lift: ">=5%"
  - guardrail_metrics: "无显著下降"
```

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 关键步骤流失率>80% | 标记为最高优先级优化项 |
| 新渠道转化率低于均值50% | 降级为观察渠道 |
| A/B测试主指标提升≥5%且统计显著 | 全量发布优化方案 |
| 多个流失节点同时存在 | 按影响系数排序，优先处理最大影响项 |

## 质量检查

- [ ] 漏斗阶段定义完整（曝光→激活/付费）
- [ ] 流失原因区分认知/信任/行动/价值4类障碍
- [ ] 优化方案附带预期提升和实施难度评估
- [ ] A/B测试设计包含决策规则和终止条件

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 获客漏斗数据缺失 | 用户提供漏斗数据 → 直接分析优化 | 漏斗步骤和转化率基于用户输入 |
| 历史优化数据缺失 | 跳过历史对比，仅基于当前数据分析 | 无法评估优化趋势 |
| 获客漏斗数据 + 历史优化数据均缺失 | 用户提供漏斗数据 → 直接分析优化 | 输出基础优化分析，A/B测试建议标注"待验证" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **漏斗数据**：获客漏斗各步骤的用户数和转化率
- **当前优化措施**（可选）：已实施的优化策略
- **优化目标**（可选）：期望提升的关键转化率


