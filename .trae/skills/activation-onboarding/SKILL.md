---
name: activation-onboarding
description: 当需要优化用户Onboarding流程时使用。Onboarding自动优化Pipeline，分析Onboarding数据和用户分群，自动生成个性化引导策略，设计A/B测试方案。关键词：Onboarding、新用户引导、引导优化、个性化引导、用户激活、新手引导、上手快、引导太长。
metadata:
  module: "产品增长与运营"
  sub-module: "激活"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "新用户引导流程太长了"
    - "怎么让用户更快上手"
    - "新手引导怎么做更好"
  interaction_mode: "ai_suggest_human_approve"
---

# Onboarding自动优化

## 核心原则

1. **Onboarding是价值递送不是功能导览**：每个引导步骤都必须让用户感受到价值，而非仅仅知道功能在哪
2. **分群即分路**：不同用户分群需要不同的Onboarding路径，一条路径走不通所有人
3. **Aha Moment是终点**：Onboarding的唯一目标是让用户到达Aha Moment，其他都是手段

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| Onboarding数据 | object | 是 | 用户提供 | 完成率、流失率、用户反馈 |
| Aha Moment数据 | object | 是 | output/pm-growth/activation-aha/aha_moment.yaml | Aha Moment数据 |
| 用户分群数据 | object | ○ | 用户提供 | 用户特征、行为特征 |

## Onboarding阶段定义

标准Onboarding流程包含以下阶段：

```
欢迎页 → 价值展示 → 账户设置 → 功能引导 → Aha Moment → 激活完成
```

### 阶段1: 欢迎页
- 品牌展示
- 价值主张传达
- 引导开始

### 阶段2: 价值展示
- 核心功能演示
- 用户案例展示
- 价值承诺

### 阶段3: 账户设置
- 基本信息填写
- 偏好设置
- 个性化配置

### 阶段4: 功能引导
- 核心功能介绍
- 操作演示
- 实践练习

### 阶段5: Aha Moment
- 引导完成核心价值行为
- 确保用户感受到产品价值

### 阶段6: 激活完成
- 庆祝激活成功
- 展示后续价值路径
- 提供帮助资源

## 执行步骤

### Step 1: 当前Onboarding效果分析

#### 整体效果评估
- Onboarding完成率
- 各阶段转化率
- 完成时间分布
- 用户满意度

#### 流失分析
- 最大流失节点识别
- 流失原因推断
- 流失用户特征分析

#### 效果对比
- 不同渠道用户的Onboarding差异
- 不同用户分群的Onboarding差异
- 与行业基准对比

### Step 2: 分群Onboarding策略生成

基于用户分群，设计差异化Onboarding策略：

#### 分群维度
- 技术背景（技术/非技术）
- 使用场景（B端/C端）
- 行业类型
- 注册来源
- 用户规模

#### 策略设计原则
| 用户类型 | 引导风格 | 引导内容 |
|---------|---------|---------|
| 技术型 | 简洁直接 | 快速上手，提供高级功能 |
| 业务型 | 详细友好 | 逐步引导，强调价值 |
| 企业型 | 专业全面 | 完整培训，强调协作 |
| 个人型 | 轻量快速 | 最小步骤，立即体验 |

### Step 3: 个性化引导内容生成

基于分群策略，生成个性化引导内容：

#### 内容类型
1. **渐进式引导** - 分步骤引导用户完成关键操作
2. **上下文提示** - 在用户需要时展示帮助
3. **视频演示** - 展示核心功能操作
4. **交互教程** - 引导用户边学边做
5. **奖励激励** - 完成引导获得奖励

#### 内容生成原则
- 简洁明了，一眼看懂
- 行动导向，强调下一步
- 价值导向，强调收益
- 进度感知，让用户知道还剩多少

### Step 4: A/B测试设计

为Onboarding优化设计A/B测试：

#### 测试类型
1. **整体Onboarding改版** - 新旧Onboarding方案对比
2. **单点优化测试** - 某个引导步骤的优化
3. **分群差异化测试** - 不同用户群的不同引导方案

#### 核心指标
- **主要指标**: Onboarding完成率、激活率
- **次要指标**: Onboarding时长、用户满意度
- **护栏指标**: 后续留存率、付费转化率

## 输出

**存储路径**：`output/pm-growth/activation-onboarding/`

**输出文件**：onboarding_plan.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["current_effectiveness", "segment_strategies"],
  "properties": {
    "current_effectiveness": {"type": "object", "description": "当前Onboarding效果评估，包含完成率、流失点和平均完成时间"},
    "segment_strategies": {"type": "array", "description": "分群Onboarding策略列表，包含分群特征和预期提升"},
    "personalized_content": {"type": "array", "description": "个性化引导内容列表，包含内容类型和触发条件"},
    "ab_tests": {"type": "array", "description": "A/B测试设计方案列表"}
  }
}
```

`onboarding_optimization`
```json
{
  "current_effectiveness": {
    "overall_completion_rate": 0.45,
    "stage_completion_rates": {
      "welcome": 0.85,
      "profile_setup": 0.65,
      "first_action": 0.55,
      "aha_moment": 0.35
    },
    "drop_off_points": [
      {"stage": "profile_setup", "drop_off_rate": 0.24}
    ],
    "avg_time_to_complete": 12.5
  },
  "segment_strategies": [
    {
      "segment": "新用户-技术背景",
      "size": 5000,
      "characteristics": ["有技术背景", "偏好自助探索"],
      "strategy": "简化引导，提供高级功能入口",
      "expected_improvement": "+20%激活率"
    }
  ],
  "personalized_content": [
    {
      "segment": "新用户-非技术背景",
      "content_type": "step_by_step_guide",
      "content": "分步引导教师完成课程创建、内容编辑和学员邀请的交互式教程",
      "trigger": "注册后立即展示"
    }
  ],
  "ab_tests": [
    {
      "test_id": "ONB_TEST_001",
      "hypothesis": "分步骤引导 vs 自由探索",
      "target_segment": "非技术背景用户",
      "expected_lift": "15%"
    }
  ]
}
```

## A/B测试设计模板

```yaml
test_id: "ONB_TEST_{序号}"
name: "测试名称"
hypothesis: "优化假设描述"
target_segment: "目标用户群体"
variants:
  control:
    name: "对照组"
    description: "当前方案描述"
  treatment:
    name: "实验组"
    description: "优化方案描述"
metrics:
  primary: "主要指标定义"
  secondary: ["次要指标列表"]
  guardrail: ["护栏指标列表"]
design:
  min_sample_per_variant: 2000
  runtime_days: 14
  mde: 0.05
success_criteria:
  - primary_metric_lift: ">=10%"
  - guardrail_metrics: "无显著下降"
  - statistical_significance: 0.95
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| current_effectiveness | object | 是 | 当前效果评估，须含overall_completion_rate/drop_off_points |
| current_effectiveness.overall_completion_rate | number | 是 | 整体完成率，范围0-1 |
| current_effectiveness.drop_off_points | array | 是 | 流失点列表，每项须含stage/drop_off_rate |
| segment_strategies | array | 是 | 分群策略列表，至少1个分群策略 |
| segment_strategies[].segment | string | 是 | 分群名称 |
| segment_strategies[].strategy | string | 是 | 策略描述 |
| personalized_content | array | 否 | 个性化内容列表，每项须含segment/content_type/content/trigger |
| ab_tests | array | 否 | A/B测试列表，每项须含test_id/hypothesis |

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| Onboarding完成率<40% | 重新设计引导流程 |
| 某阶段流失率>30% | 优化该阶段引导内容 |
| 技术型用户完成率显著低于非技术型 | 提供自助探索路径 |
| A/B测试主指标提升<5% | 调整测试假设或扩大样本 |

## 质量检查

- [ ] Onboarding阶段定义完整（欢迎→激活完成）
- [ ] 流失分析覆盖各阶段和用户分群
- [ ] 个性化引导与用户分群匹配
- [ ] A/B测试包含护栏指标（后续留存、付费转化）

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|----------|----------|----------|
| Onboarding数据缺失 | 用户描述当前Onboarding流程 → 生成优化建议 | 优化建议基于定性描述而非数据驱动 |
| Aha Moment缺失 | 跳过Aha Moment引导优化，基于通用最佳实践 | Onboarding优化缺乏Aha Moment锚点 |
| Onboarding数据 + Aha Moment均缺失 | 用户描述当前Onboarding流程 → 生成优化建议 | 输出基于最佳实践的优化建议，标注"待数据验证" |
- 若用户未提供用户分群数据，提示用户提供或跳过该输入相关步骤

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **当前Onboarding流程**：新用户引导的步骤和内容
- **完成率数据**（可选）：各引导步骤的完成率
- **用户反馈**（可选）：新用户对引导流程的反馈

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| activation-aha | 主Aha Moment变更 | Onboarding终点和引导路径 | 重新设计引导路径指向新Aha |
| activation-aha | 到达率数据更新 | 分群策略的预期提升 | 调整预期提升和优先级 |
| 用户提供-Onboarding数据 | 数据口径变更 | 效果评估和流失分析 | 按新口径重新评估效果 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| retention-management | 激活率变更 | 写入输出文件 | 新用户激活率和Onboarding完成率 |
| activation-orchestrator | Onboarding策略输出完成 | 输出文件更新 | Onboarding优化完成状态和关键结论 |

## 关键成功指标

| 指标 | 当前值 | 目标值 |
|------|--------|--------|
| Onboarding完成率 | 45% | ≥60% |
| 激活率 | 35% | ≥50% |
| 平均完成时间 | 12.5分钟 | ≤10分钟 |
| 引导满意度 | 3.2 | ≥4.0 |
