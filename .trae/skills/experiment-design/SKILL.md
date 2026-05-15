---
name: experiment-design
description: 当需要设计新的A/B测试实验时使用。A/B测试自动设计，AI自动执行假设结构化、指标选择、样本量计算、分流方案设计和实验配置生成。关键词：A/B测试设计、实验设计、样本量计算、分流方案、假设检验、做个AB测试、想验证一下这个改动、怎么设计实验。
metadata:
  module: "产品度量运营"
  sub-module: "实验验证"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "我想验证新首页是否提升转化，帮我设计AB测试"
    - "这个功能改动需要多少样本量"
    - "帮我设计一个分流实验方案"
  interaction_mode: "ai_suggest_human_approve"
---

# A/B测试自动设计

## 核心原则

1. **假设先于实验**：没有结构化假设的实验是盲目的探索，If-Then-Because-For缺一不可
2. **护栏与主指标同等重要**：主指标衡量"是否有效"，护栏指标衡量"是否安全"，两者缺一不可
3. **样本量决定可信度**：统计功效不足的实验不如不做，MDE和样本量必须在设计阶段确定

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 假设陈述 | string | 是 | 用户提供 | 业务问题或改进想法 |
| 可用流量 | number | 是 | 用户提供 | 可参与实验的用户量 |
| 指标体系 | JSON | ○ | output/pm-metrics-design/metrics-system/metrics.json | 产品关键指标定义 |
| 历史数据 | JSON | ○ | analysis-funnel / analysis-retention | 用于样本量计算的基线数据 |

## 执行步骤

### Step 1：假设结构化

将原始假设转化为结构化的Hypothesis：

```
原始假设 → 结构化Hypothesis
```

**结构化模板**：

```
If [we do this change]
Then [this metric] will [increase/decrease]
Because [our hypothesis about why]
For [these users]
```

**示例**：

```
原始：简化注册流程能提升转化率

结构化后：
If we simplify the registration flow from 5 steps to 3 steps
Then the registration completion rate will increase by 10%
Because users face less friction
For all new users on iOS and Android
```

### Step 2：指标自动选择

#### 主指标（Primary Metric）

| 选择标准 | 说明 |
|---------|------|
| 直接衡量假设 | 与假设中的"then"部分对应 |
| 敏感度高 | 能检测到预期变化 |
| 业务相关 | 与核心业务目标相关 |

#### 护栏指标（Guardrail Metrics）

防止实验对产品造成负面影响：

| 类型 | 示例 | 阈值 |
|-----|------|------|
| 核心留存 | D7留存 | 不得下降 > 2% |
| 收入指标 | ARPU | 不得下降 > 5% |
| 技术指标 | 页面加载时间 | 不得增加 > 20% |
| 体验指标 | 崩溃率 | 不得增加 > 50% |

#### 辅助指标（Secondary Metrics）

提供额外洞察：

- 细分维度指标（下钻用）
- 相关联指标（归因用）
- 探索性指标（发现用）

### Step 3：样本量自动计算

```
样本量计算公式：
n = 2 * (Zα + Zβ)² * p̄(1-p̄) / MDE²

其中：
- Zα: 显著性水平（通常1.96 for α=0.05）
- Zβ: 统计功效（通常0.84 for power=80%）
- p̄: 基线转化率
- MDE: 最小可检测效应
```

**计算器配置**：

```yaml
sample_size_calculation:
  significance_level: 0.05
  statistical_power: 0.80
  
  # 主指标参数
  primary_metric:
    baseline_rate: 0.15  # 基线转化率 15%
    minimum_detectable_effect: 0.10  # 最小可检测提升 10%
    relative_mde: 0.015  # 绝对提升 1.5% (15% * 10%)
    
  result:
    sample_size_per_group: 12400
    total_sample_size: 24800
    expected_duration_days: 7
```

### Step 4：分流方案设计

#### 分流原则

| 原则 | 说明 |
|-----|------|
| 随机性 | 用户随机分配 |
| 均匀性 | 各组特征分布一致 |
| 独立性 | 用户只在一个实验组 |
| 一致性 | 用户体验稳定 |

#### 分流层级

```
Traffic
├── Layer 1: 体验一致性实验
├── Layer 2: 核心功能实验
├── Layer 3: 个性化实验
└── Layer 4: 营销实验
```

#### 分流比例

| 场景 | 推荐比例 | 说明 |
|-----|---------|------|
| 标准测试 | 50/50 | 最高统计功效 |
| 高风险 | 90/10 | 减少影响面 |
| 高不确定性 | 50/25/25 | 多方案对比 |
| 灰度发布 | 95/5 | 最小流量验证 |

### Step 5：实验配置生成

生成完整的实验配置：

```yaml
ab_test_design:
  created_at: "2024-01-15T10:00:00Z"
  
  # 实验基本信息
  experiment:
    id: "exp_20240115_simplified_register"
    name: "简化注册流程实验"
    owner: "product_team"
    priority: "high"
  
  # 结构化假设
  hypothesis:
    original: "简化注册流程能提升转化率"
    structured: |
      If we simplify the registration flow from 5 steps to 3 steps,
      then the registration completion rate will increase by 10%,
      because users face less friction,
      for all new users on iOS and Android.
    
    components:
      change: "Simplify registration from 5 steps to 3 steps"
      expected_outcome: "Registration rate +10%"
      mechanism: "Reduced user friction"
      target_users: "New users on iOS and Android"
  
  # 指标选择
  metrics:
    primary_metric:
      name: "registration_completion_rate"
      definition: "完成注册的用户数 / 开始注册的用户数"
      baseline_value: 0.35
      minimum_detectable_effect: 0.10  # 10%相对提升
      
    guardrail_metrics:
      - name: "d7_retention_rate"
        definition: "注册后7日留存率"
        baseline_value: 0.42
        acceptable_change: -0.02  # 允许下降2%
        
      - name: "daily_active_users"
        definition: "DAU"
        baseline_value: 1000000
        acceptable_change: -0.05  # 允许下降5%
        
      - name: "app_crash_rate"
        definition: "崩溃率"
        baseline_value: 0.002
        acceptable_change: +0.001  # 允许增加0.1%
        
    secondary_metrics:
      - name: "registration_abandon_rate"
        definition: "注册中断率"
        
      - name: "time_to_complete_registration"
        definition: "完成注册耗时"
        
      - name: "register_via_social_count"
        definition: "社交账号注册数"
  
  # 样本量计算
  sample_size:
    per_group: 12400
    total: 24800
    daily_eligible_users: 4000
    expected_duration_days: 7
    minimum_duration_days: 5
    
    assumptions:
      baseline_rate: 0.35
      mde: 0.10
      significance_level: 0.05
      statistical_power: 0.80
  
  # 分流方案
  traffic_split:
    strategy: "random"
    allocation:
      control: 50
      treatment: 50
    
    targeting:
      platform: ["ios", "android"]
      user_type: "new_user"
      exclusion:
        - registered_users
        - test_accounts
        
    hash_salt: "exp_reg_2024_v1"
    
  # 终止条件
  termination_conditions:
    automatic:
      - condition: "达到目标样本量"
        action: "触发结果分析"
      - condition: "p值持续显著超过0.99"
        action: "提前终止"
        
    manual:
      - condition: "护栏指标显著下降"
        action: "告警+人工决策"
      - condition: "外部重大事件影响"
        action: "暂停实验"
        
    minimum_runtime_days: 5
    maximum_runtime_days: 30
  
  # 实验变体
  variants:
    control:
      name: "当前注册流程"
      description: "5步注册流程，包含邮箱、手机号验证"
      config: {}
      
    treatment:
      name: "简化注册流程"
      description: "3步注册流程，仅手机号验证"
      config:
        steps: 3
        required_fields: ["phone"]
        optional_fields: ["email", "nickname"]
        skip_verification: false
  
  # 技术配置
  technical:
    platform: "internal_ab_platform"
    layer: 2
    mutex_group: "registration_flow"
    traffic_allocation: 100  # 100%可用流量
  
  # 风险评估
  risk_assessment:
    overall_risk: "low"
    reasons:
      - "仅影响新用户注册流程"
      - "保留核心功能"
      - "可快速回滚"
    mitigation:
      - "配置实时监控"
      - "设置自动告警"
      - "准备回滚方案"
```

## 输出

**存储路径**：`output/pm-metrics-ops/experiment-design/`

**输出文件**：experiment_design.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["hypothesis", "primary_metric", "sample_size", "traffic_allocation"],
  "properties": {
    "hypothesis": {"type": "object", "description": "结构化假设，包含If-Then-Because-For"},
    "primary_metric": {"type": "object", "description": "主指标定义，包含名称和计算方式"},
    "guardrail_metrics": {"type": "array", "description": "护栏指标列表，覆盖留存/收入/技术维度"},
    "sample_size": {"type": "object", "description": "样本量估算，包含计算参数和结果"},
    "traffic_allocation": {"type": "object", "description": "分流方案，包含比例和分层策略"},
    "termination_conditions": {"type": "object", "description": "终止条件，包含提前终止和最大周期"},
    "risk_assessment": {"type": "object", "description": "风险评估和缓解措施"}
  }
}
```

### 必填输出

1. **实验设计方案**：完整的实验配置
2. **样本量估算**：基于统计计算的样本需求
3. **风险评估**：实验风险和缓解措施

### 辅助输出

1. **历史参考**：类似实验的结果参考
2. **建议清单**：上线前检查项
3. **监控配置**：实验监控面板配置

## 执行检查清单

```
□ 假设结构化完成
□ 主指标明确定义
□ 护栏指标设置
□ 样本量计算完成
□ 分流方案设计完成
□ 终止条件设置
□ 技术配置完成
□ 风险评估完成
□ 实验配置审核通过
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| ab_test_design | object | 是 | 实验设计根对象 |
| ab_test_design.experiment | object | 是 | 实验基本信息 |
| ab_test_design.experiment.id | string | 是 | 实验ID |
| ab_test_design.experiment.name | string | 是 | 实验名称 |
| ab_test_design.hypothesis | object | 是 | 结构化假设 |
| ab_test_design.hypothesis.structured | string | 是 | If-Then-Because-For格式假设 |
| ab_test_design.metrics | object | 是 | 指标体系 |
| ab_test_design.metrics.primary_metric | object | 是 | 主指标 |
| ab_test_design.metrics.primary_metric.name | string | 是 | 主指标名称 |
| ab_test_design.metrics.primary_metric.baseline_value | number | 是 | 基线值 |
| ab_test_design.metrics.guardrail_metrics | array | 是 | 护栏指标列表，至少2个 |
| ab_test_design.sample_size | object | 是 | 样本量计算 |
| ab_test_design.sample_size.per_group | number | 是 | 每组样本量 |
| ab_test_design.sample_size.total | number | 是 | 总样本量 |
| ab_test_design.sample_size.expected_duration_days | number | 是 | 预期天数 |
| ab_test_design.traffic_split | object | 是 | 分流方案 |
| ab_test_design.termination_conditions | object | 是 | 终止条件 |
| ab_test_design.risk_assessment | object | 是 | 风险评估 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 假设陈述变更 | 结构化假设和指标选择 | 重新结构化假设，更新指标选择 |
| 可用流量变更 | 样本量计算和实验周期 | 重新计算样本量，更新预期实验周期 |
| 指标体系变更 | 主指标和护栏指标 | 更新指标选择，重新评估护栏指标覆盖度 |
| 历史数据变更 | 基线值和MDE | 更新基线值，重新计算样本量 |

当实验设计自身变更时，对下游的通知机制：

| 设计变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 主指标变更 | experiment-execution | 标记主指标变更，触发执行配置更新 |
| 护栏指标变更 | experiment-execution | 标记护栏变更，触发监控配置更新 |
| 分流方案变更 | experiment-execution | 标记分流变更，触发分流配置更新 |

---

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 可用流量<样本量需求 | 延长实验周期或扩大分流比例 |
| 护栏指标阈值被突破 | 暂停实验，人工决策 |
| MDE过小导致样本量过大 | 调整MDE或接受更长实验周期 |
| 多实验争抢同一流量层 | 按优先级排队或使用正交分层 |

## 质量检查

- [ ] 假设已结构化（If-Then-Because-For）
- [ ] 主指标与假设直接对应
- [ ] 护栏指标覆盖留存、收入、技术三个维度
- [ ] 样本量计算参数有据可依

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 假设陈述缺失 | 无法执行，需用户描述假设 | - |
| 可用流量缺失 | 使用保守默认值（总流量5%），标注"待确认" | 样本量计算基于保守假设，实验周期可能偏长 |
| 指标体系缺失 | 基于假设描述推断主指标和护栏指标，标注"待确认" | 指标选择基于推断，可能不全面 |
| 假设陈述 + 可用流量 + 指标体系均缺失 | 用户描述假设 → 基于描述设计实验 | 输出实验设计方案，关键参数标注"待确认" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **假设描述**：想要验证的改进想法和预期效果
- **可用流量**（可选）：可参与实验的用户量或流量比例
- **关键指标**（可选）：实验关注的主要指标和护栏指标

## 设计原则

| 原则 | 说明 |
|-----|------|
| 单一变量 | 每次实验只改变一个因素 |
| 足够样本 | 确保统计功效 |
| 合理周期 | 覆盖完整用户周期 |
| 护栏保护 | 防止负向影响 |
| 可重复 | 支持重复验证 |
