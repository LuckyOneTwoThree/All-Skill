---
name: activation-aha
description: 当需要识别和工程化Aha Moment时使用。Aha Moment自动工程化Pipeline，分析留存数据和行为数据，自动识别Aha Moment候选，测量到达率，识别最短路径，输出Onboarding优化建议。关键词：Aha Moment、激活时刻、用户激活、到达率、Onboarding优化、什么时候觉得好用、体验核心价值、爽点在哪。
metadata:
  module: "产品增长与运营"
  sub-module: "激活"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "用户什么时候觉得产品好用"
    - "怎么找到aha moment"
    - "新用户多久能体验到核心价值"
  interaction_mode: "ai_suggest_human_approve"
---

# Aha Moment自动工程化

## 核心原则

1. **Aha是因果非相关**：Aha Moment必须是行为与留存的因果关系，而非仅仅是相关性
2. **到达率决定上限**：再强的Aha Moment，如果到达率低就无法规模化，必须同时优化到达路径
3. **最短路径优先**：从注册到Aha Moment的路径越短，激活率越高

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 留存数据 | object | 是 | output/pm-metrics-ops/analysis-retention/retention_analysis.yaml | D1/D7/D30留存率 |
| 用户行为数据 | object | 是 | 用户提供 | 事件日志、行为序列 |
| 用户分群数据 | object | ○ | 用户提供 | 用户分群数据 |

## Aha Moment定义

Aha Moment是用户首次体验到产品核心价值的关键时刻。当用户完成这个行为后，他们更有可能长期留存并成为活跃用户。

**Aha Moment = 特定行为 + 特定时间窗口 + 留存提升效果**

## 执行步骤

### Step 1: Aha Moment候选搜索

#### 候选行为穷举
扫描所有用户行为，寻找与留存高度相关的行为：

1. **行为类型分类**:
   - 核心功能使用
   - 关键路径完成
   - 社交互动行为
   - 内容创建行为
   - 设置配置行为

2. **时间窗口分析**:
   - 注册后1小时内
   - 注册后24小时内
   - 注册后7天内

3. **相关性计算**:
   ```
   相关性 = 用户执行行为与留存的相关程度
   提升 = 执行该行为用户的留存率 - 未执行用户的留存率
   ```

#### 候选筛选标准
- 相关性 ≥ 0.5
- 到达率 ≥ 10%
- 留存提升 ≥ 15%

### Step 2: 到达率测量

分析每个候选Aha Moment的实际到达情况：

| 指标 | 说明 |
|------|------|
| 总体到达率 | 到达该行为的用户占总注册用户的比例 |
| 时间分布 | 用户到达该行为的时间分布 |
| 路径分析 | 用户从注册到该行为的路径 |
| 流失节点 | 用户在到达该行为前的流失点 |

### Step 3: 最短路径识别

分析如何让用户最快到达Aha Moment：

1. **路径分析**: 识别从注册到Aha Moment的典型路径
2. **摩擦识别**: 找出路径中的摩擦点和流失点
3. **优化建议**: 设计更短的到达路径

### Step 4: Onboarding优化建议

基于Aha Moment分析，生成Onboarding优化建议：

#### 直接引导策略
- 在Onboarding流程中直接引导用户完成Aha Moment行为
- 设计"一键体验核心功能"的快捷路径

#### 激励策略
- 为完成Aha Moment行为的用户提供奖励
- 降低完成Aha Moment的门槛

#### 教育策略
- 强化Aha Moment的价值展示
- 在到达Aha Moment前提供价值预览

## 输出

**存储路径**：`output/pm-growth/activation-aha/`

**输出文件**：aha_moment.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["candidates", "primary_aha"],
  "properties": {
    "candidates": {"type": "array", "description": "Aha Moment候选列表，包含行为、相关性、到达率和留存提升"},
    "primary_aha": {"type": "object", "description": "主Aha Moment，包含行为、到达率、留存提升和置信度"},
    "secondary_ahas": {"type": "array", "description": "次要Aha Moment列表"},
    "onboarding_optimization": {"type": "object", "description": "Onboarding优化建议，包含目标行为和优化漏斗"}
  }
}
```

`aha_moment`
```json
{
  "candidates": [
    {
      "behavior": "首次创建在线课程并发布",
      "behavior_type": "action|feature_engagement",
      "retention_lift": 0.35,
      "correlation": 0.78,
      "reach_rate": 0.45,
      "time_to_aha": "注册后24小时",
      "recommendation": "在Onboarding中引导用户使用课程模板快速创建首门课程"
    }
  ],
  "primary_aha": {
    "behavior": "首次创建在线课程并发布",
    "reach_rate": 0.45,
    "retention_lift": 0.35,
    "confidence": 0.92
  },
  "secondary_ahas": [
    {
      "behavior": "首次邀请学员加入课程",
      "reach_rate": 0.25,
      "retention_lift": 0.28
    }
  ],
  "onboarding_optimization": {
    "target_behaviors": ["创建在线课程", "发布课程", "邀请学员"],
    "current_funnel": {...},
    "optimized_funnel": {...},
    "expected_activation_lift": "15%"
  }
}
```

## Aha Moment分析示例

```
候选Aha Moment分析:

1. "首次创建第一个项目"
   - 相关性: 0.82
   - 到达率: 35%
   - 留存提升: +42%
   - 建议: 优化项目创建流程，降低创建门槛

2. "首次分享内容给好友"
   - 相关性: 0.65
   - 到达率: 18%
   - 留存提升: +28%
   - 建议: 引导用户分享，增加分享激励

3. "首次使用核心分析功能"
   - 相关性: 0.75
   - 到达率: 25%
   - 留存提升: +35%
   - 建议: 在Onboarding中演示核心功能价值
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| candidates | array | 是 | Aha Moment候选列表，至少1个候选 |
| candidates[].behavior | string | 是 | 行为描述，不可为空 |
| candidates[].correlation | number | 是 | 相关性系数，范围0-1 |
| candidates[].reach_rate | number | 是 | 到达率，范围0-1 |
| candidates[].retention_lift | number | 是 | 留存提升，须>0 |
| primary_aha | object | 是 | 主Aha Moment，须含behavior/reach_rate/retention_lift/confidence |
| primary_aha.confidence | number | 是 | 置信度，范围0-1 |
| secondary_ahas | array | 否 | 次要Aha Moment列表 |
| onboarding_optimization | object | 否 | Onboarding优化建议，须含target_behaviors |

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| Aha候选相关性≥0.5且到达率≥10% | 列入优先验证列表 |
| 主Aha到达率<20% | 优化Onboarding引导路径 |
| 多个Aha候选指向不同分群 | 按分群设计差异化引导 |
| Aha行为与留存无因果关系 | 排除该候选，继续搜索 |

## 质量检查

- [ ] Aha候选通过相关性筛选（≥0.5）和显著性检验
- [ ] 到达率分析包含时间分布和路径分析
- [ ] 最短路径识别包含摩擦点分析
- [ ] Onboarding优化建议可直接执行

## 降级策略

### 上游文件缺失降级方案

| 缺失的上游输入 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 留存数据缺失 | 用户提供用户行为列表 → 推断Aha Moment候选 | Aha Moment基于推断而非数据验证 |
| 行为数据缺失 | 用户提供用户行为列表 → 推断Aha Moment候选 | 无法进行行为-留存相关性分析 |
| 留存数据 + 行为数据均缺失 | 用户提供用户行为列表 → 推断Aha Moment候选 | 输出Aha Moment候选列表，标注"待数据验证" |
- 若用户未提供用户分群数据，提示用户提供或跳过该输入相关步骤

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **用户行为列表**：产品中用户可执行的核心行为
- **留存率数据**（可选）：不同行为用户的留存率差异
- **新用户典型路径**（可选）：新用户最常见的操作序列

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| analysis-retention | 留存指标口径变更 | 相关性计算和留存提升评估 | 按新口径重新计算相关性和留存提升 |
| 用户提供-行为数据 | 事件定义变更 | 候选行为穷举和路径分析 | 更新行为分类，重新搜索候选 |
| 用户提供-分群数据 | 分群维度变更 | 分群级Aha Moment识别 | 按新维度重新识别分群Aha |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| activation-onboarding | 主Aha Moment变更 | 写入输出文件 | 新的Aha行为、到达率和引导路径 |
| activation-orchestrator | Aha Moment识别完成 | 输出文件更新 | Aha识别完成状态和关键结论 |

## 注意事项

- Aha Moment可能随产品迭代而变化，应定期重新评估
- 不同的用户分群可能有不同的Aha Moment
- Aha Moment的优化需要平衡到达率和留存提升
