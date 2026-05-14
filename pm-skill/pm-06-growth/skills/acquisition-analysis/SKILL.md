---
name: acquisition-analysis
description: 当需要评估获客渠道或优化获客漏斗时使用。获客分析一体化Pipeline，先分析19种获客渠道数据计算渠道规模、转化率、ROI输出渠道分级报告，再分析获客漏斗数据识别最大流失节点自动生成优化方案和A/B测试设计。关键词：获客渠道、渠道评估、ROI分析、渠道分级、获客优化、漏斗优化、转化优化、A/B测试、获客漏斗、转化率低、哪个渠道好、怎么提高转化。
metadata:
  module: "产品增长与运营"
  sub-module: "获客"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "哪个渠道拉新效果最好"
    - "帮我看看各个渠道的ROI"
    - "注册到激活的转化率太低了"
    - "漏斗哪里流失最多"
    - "怎么提高获客转化率"
  interaction_mode: "ai_suggest_human_approve"
---

# 获客分析一体化

## 核心原则

1. **渠道即投资组合**：每个渠道都是一笔投资，用ROI和规模双维度评估，而非单一指标
2. **分级管理动态调整**：主力/测试/观察三级动态流转，数据驱动升降级
3. **LTV视角算ROI**：渠道ROI必须考虑用户LTV而非单次收入，避免短视砍掉长周期高价值渠道
4. **流失即信号**：每个流失节点都是用户在用脚投票，流失率最高的节点就是最大优化杠杆
5. **障碍分类定向击破**：认知/信任/行动/价值四类障碍需要完全不同的优化手段
6. **实验验证不猜测**：优化方案必须通过A/B测试验证，用数据替代直觉

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 19种获客渠道数据 | object | 是 | 用户提供 | 19种获客渠道的完整数据 |
| 历史渠道表现 | object | 是 | 用户提供 | 历史渠道表现数据 |
| 渠道配置和成本 | object | 是 | 用户提供 | 渠道配置和成本数据 |
| 历史优化数据 | object | ○ | 用户提供 | 历史优化实验数据 |

## 19种获客渠道清单

### 付费获客渠道
1. **搜索广告（SEM）** - Google Ads、Baidu PPC
2. **社交广告** - Facebook/Instagram Ads、LinkedIn Ads、微信朋友圈广告
3. **展示广告** - DSP广告、原生广告
4. **视频广告** - YouTube Ads、抖音/快手广告
5. **应用商店广告** - Apple Search Ads、Google Play Ads

### 自然获客渠道
6. **SEO/SEM有机** - 搜索引擎自然排名
7. **内容营销** - 博客文章、白皮书、案例研究
8. **社交媒体有机** - 微博、小红书、抖音有机内容
9. **社区运营** - 知乎、贴吧、行业论坛
10. **病毒传播** - 用户分享、口碑传播

### 合作获客渠道
11. **联盟营销** - 合作伙伴推荐分成
12. **渠道分销** - 经销商/代理商网络
13. **平台合作** - 应用市场推荐、平台首发
14. **跨界合作** - 品牌联合活动

### 销售获客渠道
15. **SDR外呼** - 电话销售团队主动触达
16. **线下活动** - 行业展会、线下沙龙
17. **销售推荐** - 销售线索转介

### 其他渠道
18. **存量用户触达** - 邮件营销、Push推送、短信
19. **PR/品牌** - 媒体报道、品牌活动

## 执行步骤

### Step 1: 渠道评估（from acquisition-channel）

分析19种获客渠道数据，计算渠道规模、转化率、ROI，输出渠道分级报告。

#### 1.1 渠道规模评估

分析各渠道的可触达规模和实际投放规模：

- **可触达规模**: 渠道的潜在用户池大小
- **实际投放规模**: 当前投入资源覆盖的用户量
- **市场占有率**: 相对竞品的投放占比
- **增长潜力**: 渠道规模的增长趋势

#### 1.2 转化率分析

计算各渠道的完整转化漏斗：

| 指标 | 说明 |
|------|------|
| 曝光 → 点击转化率 | 广告展示到用户点击 |
| 点击 → 访问转化率 | 广告点击到页面访问 |
| 访问 → 注册转化率 | 页面访问到账号注册 |
| 注册 → 激活转化率 | 账号注册到首次使用 |
| 整体转化率 | 曝光到激活的端到端转化 |

#### 1.3 ROI计算

计算各渠道的投资回报率：

```
渠道ROI = (渠道带来的收入 - 渠道投入成本) / 渠道投入成本

考虑LTV的ROI = (渠道带来的用户LTV - 渠道CAC) / 渠道CAC
```

#### 1.4 渠道分级

基于多维度评分进行渠道分级：

##### 主力渠道（Primary）
- ROI ≥ 目标ROI
- 规模可扩展
- 获客成本可控
- 用户质量高

##### 测试渠道（Test）
- ROI接近目标但不稳定
- 有增长潜力待验证
- 新的获客方式探索
- 特定用户群定向

##### 观察渠道（Observation）
- ROI低于目标
- 战略意义大于短期ROI
- 品牌建设为主
- 处于优化期

#### 评分模型

```
综合得分 = 0.3 × ROI得分 + 0.25 × 规模得分 + 0.25 × 质量得分 + 0.2 × 可持续性得分
```

#### 渠道评估决策规则

| 情况 | 处理方式 |
|------|----------|
| 渠道ROI≥目标值且规模可扩展 | 评级为主力渠道，加大投入 |
| 渠道ROI接近目标但不稳定 | 评级为测试渠道，持续验证 |
| 渠道ROI<目标值且无战略意义 | 评级为观察渠道，减少投入 |
| 新渠道无历史数据 | 小流量测试，2周后评估 |

### Step 2: 漏斗优化（from acquisition-optimize）

基于Step 1输出的渠道评估数据，分析获客漏斗数据，识别最大流失节点，自动生成优化方案和A/B测试设计。

#### 漏斗阶段定义

标准获客漏斗包含以下阶段：

```
曝光 → 点击 → 访问 → 注册 → 激活 → 付费
```

##### 阶段1: 曝光
- 广告展示给目标用户
- 关键指标: 曝光量、CTR

##### 阶段2: 点击
- 用户点击广告进入落地页
- 关键指标: 点击量、CPM

##### 阶段3: 访问
- 用户访问落地页/产品页
- 关键指标: UV、跳出率、页面停留时长

##### 阶段4: 注册
- 用户完成账号注册
- 关键指标: 注册量、注册率

##### 阶段5: 激活
- 用户首次完成核心行为
- 关键指标: 激活量、激活率

##### 阶段6: 付费（可选）
- 用户完成首次付费
- 关键指标: 付费量、付费转化率

#### 2.1 漏斗各层转化分析

1. **计算各层转化率**: 识别每个阶段的转化效率
2. **对比基准**: 与行业基准、历史数据对比
3. **趋势分析**: 各层转化率的时间趋势
4. **渠道对比**: 不同渠道的漏斗表现差异

#### 2.2 最大流失节点识别

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

#### 2.3 优化方案自动生成

基于流失原因分析，生成针对性优化方案：

| 流失类型 | 优化方向 | 典型方案 |
|---------|---------|---------|
| 认知障碍 | 优化广告素材 | 突出价值主张、改进创意 |
| 信任障碍 | 增强社会证明 | 添加评价、案例、数据 |
| 行动障碍 | 简化流程 | 减少步骤、降低门槛 |
| 价值障碍 | 强化价值感知 | 演示功能、免费试用 |

#### 2.4 A/B测试设计

为优化方案设计A/B测试：

1. **假设定义**: 明确测试的优化假设
2. **样本计算**: 确定达到统计显著性所需的样本量
3. **测试分组**: 设计对照组和实验组
4. **监控指标**: 确定主要和次要监控指标
5. **决策规则**: 定义何时停止测试和判定胜负

## 输出

**存储路径**：`output/pm-growth/acquisition-analysis/`

**输出文件**：acquisition-analysis.json、acquisition-analysis.md

**输出Schema**：

```json
{
  "type": "object",
  "required": ["channel_assessment", "funnel_analysis", "optimization_suggestions"],
  "properties": {
    "channel_assessment": {"type": "object", "description": "渠道评估结果，包含渠道详情、分级和汇总指标"},
    "funnel_analysis": {"type": "object", "description": "漏斗分析，包含各阶段数据和关键流失节点"},
    "optimization_suggestions": {"type": "array", "description": "优化建议列表，包含优先级、问题、方案和预期提升"},
    "ab_test_designs": {"type": "array", "description": "A/B测试设计方案列表"}
  }
}
```

`acquisition_analysis`
```json
{
  "channel_assessment": {
    "channels": [
      {
        "name": "教育行业展会",
        "scale": "年触达5万+教育机构决策者",
        "volume": 10000,
        "conversion_rate": 0.035,
        "cost_per_acquisition": 45.00,
        "roi": 2.5,
        "quality_score": 0.85,
        "classification": "primary|test|observation"
      }
    ],
    "primary_channels": ["教育行业展会", "SEO/SEM有机", "内容营销"],
    "test_channels": ["社交广告", "社区运营", "联盟营销"],
    "observation_channels": ["PR/品牌", "跨界合作", "视频广告"],
    "total_new_users": 50000,
    "blended_cac": 35.00,
    "blended_roi": 2.2
  },
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

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| channel_assessment | object | 是 | 渠道评估结果，须含channels/primary_channels/test_channels/observation_channels |
| channel_assessment.channels | array | 是 | 渠道评估详情列表，每项须含name/scale/conversion_rate/roi/classification |
| channel_assessment.primary_channels | array | 是 | 主力渠道名称列表，至少1个渠道 |
| channel_assessment.test_channels | array | 是 | 测试渠道名称列表 |
| channel_assessment.observation_channels | array | 是 | 观察渠道名称列表 |
| channel_assessment.total_new_users | number | 是 | 总新增用户数，须>0 |
| channel_assessment.blended_cac | number | 是 | 混合获客成本，须>0 |
| channel_assessment.blended_roi | number | 是 | 混合ROI |
| channel_assessment.channels[].classification | string | 是 | 渠道分级，仅允许primary/test/observation三值 |
| channel_assessment.channels[].roi | number | 是 | 渠道ROI，须基于LTV计算 |
| funnel_analysis | object | 是 | 漏斗分析，须含stages和critical_drop_off |
| funnel_analysis.stages | array | 是 | 各阶段数据，每项须含name/volume/conversion_rate/drop_off_rate |
| funnel_analysis.critical_drop_off | object | 是 | 关键流失节点，须含from_stage/to_stage/drop_off_rate/impact_score |
| optimization_suggestions | array | 是 | 优化建议列表，每项须含priority/stage/issue/solution/expected_improvement |
| optimization_suggestions[].priority | number | 是 | 优先级，从1开始递增 |
| ab_test_designs | array | 否 | A/B测试设计方案列表，每项须含test_id/hypothesis/primary_metric |

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 渠道ROI≥目标值且规模可扩展 | 评级为主力渠道，加大投入 |
| 渠道ROI接近目标但不稳定 | 评级为测试渠道，持续验证 |
| 渠道ROI<目标值且无战略意义 | 评级为观察渠道，减少投入 |
| 新渠道无历史数据 | 小流量测试，2周后评估 |
| 关键步骤流失率>80% | 标记为最高优先级优化项 |
| 新渠道转化率低于均值50% | 降级为观察渠道 |
| A/B测试主指标提升≥5%且统计显著 | 全量发布优化方案 |
| 多个流失节点同时存在 | 按影响系数排序，优先处理最大影响项 |

## 质量检查

- [ ] 渠道评估覆盖规模、转化率、ROI、质量4个维度
- [ ] 渠道分级标准明确（主力/测试/观察）
- [ ] ROI计算考虑用户LTV而非单次收入
- [ ] 评估覆盖19种获客渠道类型
- [ ] 漏斗阶段定义完整（曝光→激活/付费）
- [ ] 流失原因区分认知/信任/行动/价值4类障碍
- [ ] 优化方案附带预期提升和实施难度评估
- [ ] A/B测试设计包含决策规则和终止条件

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 渠道数据缺失 | 用户描述产品类型和目标用户 → 推荐渠道组合 | 渠道评分基于行业经验而非实际数据 |
| 历史表现缺失 | 跳过渠道历史表现评估，使用行业基准 | 无法识别已验证的高效渠道 |
| 渠道数据 + 历史表现均缺失 | 用户描述产品类型和目标用户 → 推荐渠道组合 | 输出基于行业经验的渠道推荐，标注"待验证" |
| 历史优化数据缺失 | 跳过历史对比，仅基于当前数据分析 | 无法评估优化趋势 |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **产品类型**：产品的类型和核心功能
- **目标用户**：目标用户群体特征和规模
- **预算范围**（可选）：可用于获客的预算规模
- **漏斗数据**（可选）：获客漏斗各步骤的用户数和转化率
- **优化目标**（可选）：期望提升的关键转化率

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| 用户提供-渠道数据 | 数据格式变更 | channels字段解析 | 适配新格式，补充缺失字段默认值 |
| 用户提供-历史表现 | 数据粒度变更 | ROI计算和趋势对比 | 按新粒度重新计算，标注数据口径变化 |
| 用户提供-渠道配置 | 渠道新增/下线 | 19种渠道清单和分级 | 更新渠道清单，新渠道默认归入测试级 |
| 用户提供-历史优化数据 | 实验结果更新 | 优化建议的基准对比 | 更新对比基准，调整优化优先级 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| activation-aha | 激活阶段流失率变更 | 写入输出文件 | 注册→激活转化率和流失分析 |
| acquisition-orchestrator | 渠道评估与漏斗优化完成 | 输出文件更新 | 渠道分级和漏斗优化完成状态与关键结论 |

## 版本历史

- v3.0: 合并 acquisition-channel + acquisition-optimize
