---
name: metrics-system
description: 当需要构建产品指标体系时使用。指标体系自动构建，包含北极星指标校验与推荐、L1/L2指标拆解、行动指标识别、虚荣指标检测。关键词：指标体系、AARRR模型、北极星指标、L1/L2指标、OSM模型、度量体系、定指标、核心数据。
metadata:
  module: "产品度量设计"
  sub-module: "指标体系"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "帮我梳理一下产品的核心指标"
    - "我们要定北极星指标"
    - "搭建一套指标体系"
  interaction_mode: "ai_suggest_human_approve"
---

# 指标体系自动构建

## 核心原则

1. **全量分析**：对所有可用数据进行系统性分析，不遗漏关键维度
2. **实时感知**：指标体系设计支持实时监控和快速响应
3. **自动归因**：异常波动自动归因到具体原因，减少人工排查
4. **决策规则显式化**：每个告警和升级条件都有明确的量化规则

## 交互模式

**🤖→👤 AI建议，人类审批**

本Pipeline由AI自动执行指标体系构建，但关键决策点需要人类审批：
- **必须审批**：北极星指标选择
- **建议审批**：虚荣指标处理方案

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| product_context | JSON | 是 | 用户提供 | 产品类型、北极星指标、OKR、商业模式 |
| existing_metrics | JSON数组 | ○ | 用户提供 | 已有指标清单（含名称、定义、计算方式、数据源、层级） |

### product_context（必填）

```json
{
  "product_type": "string",        // 产品类型枚举
  "north_star_metric": "string",   // 如已定义则校验，否则自动推荐
  "okr": {
    "objective": "string",         // 当前阶段目标
    "key_results": ["string"]     // 关键结果
  },
  "business_model": "string"       // 商业模式描述
}
```

**product_type枚举值**：
- `social` - 社交产品
- `ecommerce` - 电商产品
- `saas` - SaaS产品
- `content` - 内容平台
- `gaming` - 游戏产品
- `fintech` - 金融科技
- `education` - 在线教育
- `healthcare` - 医疗健康
- `other` - 其他

---

### existing_metrics（可选）

```json
[
  {
    "name": "string",
    "definition": "string",
    "calculation": "string",
    "data_source": "string",
    "layer": "north_star|l1|l2|actionable"
  }
]
```

---

## 执行步骤

### Step 1: 北极星指标校验

**🤖 AI处理**

#### 分支A：北极星已定义

当`product_context.north_star_metric`已定义时：

**校验项**：
1. **定义清晰性检查**
   - 是否有明确的计算公式
   - 是否有清晰的数据来源
   - 是否可被拆解为子指标

2. **虚荣指标检测**
   ```
   IF 符合以下任一条件 THEN 标记为潜在虚荣指标
     - 只增不减（无时间维度）
     - 无因果关联（无法指导行动）
     - 不可操作（无法被团队影响）
   ```

3. **产品类型匹配度**
   ```
   score = 基于产品类型的北极星指标推荐评分
   IF score < 0.6 THEN 建议重新选择北极星
   ```

**输出**：
```json
{
  "north_star": {
    "name": "string",
    "definition": "string",
    "calculation": "string",
    "data_source": "string",
    "validation": {
      "is_valid": true,
      "is_vanity_free": true,
      "product_type_match": 0.85,
      "issues": []
    }
  }
}
```

---

#### 分支B：北极星未定义

当`product_context.north_star_metric`未定义时：

**自动推荐逻辑**：

```
基于 product_context.product_type 和 business_model
生成3个北极星指标候选
```

**产品类型→北极星指标映射**：

| 产品类型 | 推荐北极星指标候选 |
|---------|------------------|
| 社交 | 1. 日活跃用户数 × 平均互动次数<br>2. 日发送消息用户数<br>3. 社交网络密度（好友关系活跃比） |
| 电商 | 1. GMV<br>2. 支付订单量<br>3. 活跃买家数 × 平均客单价 |
| SaaS | 1. 付费ARR<br>2. 核心功能周活跃用户数<br>3. NRR（净收入留存率） |
| 内容 | 1. 用户总时长<br>2. 人均内容消费量 × 消费用户数<br>3. 内容互动率 |
| 游戏 | 1. 日活跃用户数<br>2. DAU × 平均游戏时长<br>3. 付费用户LTV |
| 金融科技 | 1. 活跃用户贷款/理财转化率<br>2. AUM（资产管理规模）<br>3. 风控通过率 × 放款额 |
| 在线教育 | 1. 完课率 × 付费学员数<br>2. 学员完课率 × NPS<br>3. 活跃学习用户数 × 人均学习时长 |
| 医疗健康 | 1. 核心服务使用率<br>2. 用户健康指标改善率<br>3. 用户满意度 × 复购率 |

**输出**：
```json
{
  "north_star_candidates": [
    {
      "rank": 1,
      "name": "string",
      "definition": "string",
      "calculation": "string",
      "data_source": "string",
      "pros": ["string"],
      "cons": ["string"],
      "recommendation_score": 0.85
    }
  ],
  "requires_human_decision": true
}
```

---

### Step 2: L1指标自动拆解

**🤖 AI处理**

**输入**：北极星指标定义

**拆解逻辑**：

基于AARRR模型，将北极星指标拆解为5个L1维度（根据产品类型可能选择其中3-5个）：

```
北极星指标
  ↓ 拆解
L1 维度（按AARRR）
  ├── Acquisition（获取）
  ├── Activation（激活）
  ├── Retention（留存）
  ├── Revenue（变现）
  └── Referral（推荐）
```

**拆解规则**：

```
FOR each L1 dimension:
  1. 识别与北极星的相关性
  2. 计算权重（基于相关性强度）
  3. 定义L1指标
  4. 确保L1指标可独立衡量
```

**北极星→L1权重映射示例**（电商）：

| 北极星指标 | Acquisition权重 | Activation权重 | Retention权重 | Revenue权重 | Referral权重 |
|-----------|----------------|---------------|-------------|-----------|-------------|
| GMV | 0.15 | 0.15 | 0.25 | 0.35 | 0.10 |
| 支付订单量 | 0.20 | 0.25 | 0.20 | 0.25 | 0.10 |
| 活跃买家数×客单价 | 0.20 | 0.15 | 0.30 | 0.25 | 0.10 |

**输出**：
```json
{
  "l1_metrics": [
    {
      "layer": "Acquisition",
      "name": "用户获取",
      "weight": 0.20,
      "calculation": "string",
      "data_source": "string",
      "relationship_to_north_star": "直接正向关系",
      "l2_metrics_count": 3
    }
  ]
}
```

---

### Step 3: L2指标自动拆解

**🤖 AI处理**

**输入**：L1指标列表

**拆解逻辑**：

```
FOR each L1 metric:
  拆解 3-5 个 L2 指标
  确保每个 L2 指标:
    1. 与 L1 有明确的数学关系
    2. 可独立衡量
    3. 有明确的数据来源
    4. 可被特定团队负责
```

**L1→L2拆解示例**（电商-Activation）：

```json
{
  "l1": "用户激活",
  "l2_metrics": [
    {
      "name": "新用户首次下单转化率",
      "calculation": "首次下单新用户数 / 新用户总数",
      "data_source": "订单系统",
      "is_actionable": true,
      "optimization_team": "增长团队"
    },
    {
      "name": "新用户激活时长",
      "calculation": "首次完成核心动作的平均时间",
      "data_source": "行为埋点",
      "is_actionable": true,
      "optimization_team": "产品团队"
    },
    {
      "name": "核心功能首次使用率",
      "calculation": "首次使用核心功能新用户数 / 新用户总数",
      "data_source": "行为埋点",
      "is_actionable": true,
      "optimization_team": "产品团队"
    },
    {
      "name": "新用户引导完成率",
      "calculation": "完成新手指引新用户数 / 开始指引新用户数",
      "data_source": "行为埋点",
      "is_actionable": true,
      "optimization_team": "UX团队"
    }
  ]
}
```

**L2指标分类**：

| 类型 | 说明 | 示例 |
|-----|------|------|
| 转化率 | 漏斗各步骤转化 | 点击率、注册率、付费率 |
| 频次类 | 用户使用频率 | 人均使用次数、人均使用时长 |
| 质量类 | 使用效果/质量 | 满意度评分、功能使用深度 |
| 效率类 | 操作效率指标 | 页面加载时间、响应时间 |
| 覆盖类 | 功能/内容覆盖 | 品类覆盖率、功能使用率 |

**输出**：
```json
{
  "l1_metrics": [
    {
      "layer": "Activation",
      "name": "用户激活",
      "l2_metrics": [
        {
          "name": "string",
          "calculation": "string",
          "data_source": "string",
          "type": "conversion_rate|frequency|quality|efficiency|coverage",
          "is_actionable": true,
          "optimization_team": "string"
        }
      ]
    }
  ]
}
```

---

### Step 4: 行动指标自动识别

**🤖 AI处理**

**识别逻辑**：

```
FOR each L2 metric:
  IF 可被特定团队直接影响 AND
     可通过A/B测试验证 AND
     有明确优化路径
  THEN 标记为行动指标
```

**行动指标特征**：

1. **可归因**：可追溯到具体原因
2. **可操作**：可被特定团队采取行动
3. **可验证**：可通过A/B测试验证效果
4. **可迭代**：可在短周期内持续优化

**行动指标映射示例**：

| L2指标 | 行动指标 | 优化方向 |
|-------|---------|---------|
| 新用户激活时长 | 注册流程平均时长 | 简化注册步骤 |
| 首次下单转化率 | 新手引导流程转化率 | 优化引导文案 |
| 核心功能使用率 | 功能入口点击率 | 优化功能入口位置 |
| 搜索结果点击率 | 搜索结果首条点击率 | 优化排序算法 |

**输出**：
```json
{
  "actionable_metrics": [
    {
      "name": "注册流程平均时长",
      "linked_l2": "新用户激活时长",
      "linked_l1": "用户激活",
      "optimization_approach": "通过A/B测试验证简化注册步骤的效果",
      "estimated_impact": "每降低1秒可提升3%激活率",
      "measurement_method": "A/B测试"
    }
  ]
}
```

---

### Step 5: 虚荣指标自动检测

**🤖 AI处理**

**检测规则**：

#### 规则1：只增不减检测

```
IF 指标计算方式满足以下任一条件:
  - 累计值（无时间维度）
  - 不可逆指标
THEN 标记为「只增不减」虚荣指标
```

**问题指标示例**：
- ❌ 累计用户数 → ✅ 日活跃用户数
- ❌ 总注册量 → ✅ 日新增注册量
- ❌ 页面总浏览量 → ✅ 人均页面浏览量

---

#### 规则2：无时间限定检测

```
IF 指标定义中无明确时间维度:
  - 未定义统计周期
  - 无法计算变化趋势
THEN 标记为「无时间限定」虚荣指标
```

**问题指标示例**：
- ❌ 用户总数 → ✅ DAU / MAU
- ❌ 总收入 → ✅ 月度MRR / 年度ARR

---

#### 规则3：无因果关联检测

```
IF 指标无法满足以下任一条件:
  - 可关联到北极星指标
  - 可指导具体行动
  - 可归因到具体原因
THEN 标记为「无因果关联」虚荣指标
```

**问题指标示例**：
- 与核心价值无关的功能使用率
- 多个独立指标无法形成逻辑链

---

#### 规则4：不可操作检测

```
IF 指标无法满足以下任一条件:
  - 可被特定团队影响
  - 可通过产品/运营手段改变
  - 可在合理时间内看到效果
THEN 标记为「不可操作」虚荣指标
```

**问题指标示例**：
- ❌ 品牌知名度 → ✅ 品牌关键词搜索量
- ❌ 用户满意度 → ✅ NPS分项指标
- ❌ 市场占有率 → ✅ 垂直市场渗透率

---

**检测结果输出**：

```json
{
  "vanity_alerts": [
    {
      "metric_name": "累计用户数",
      "alert_type": "只增不减",
      "severity": "high",
      "recommendation": "替换为「日活跃用户数」或「月活跃用户数」",
      "suggested_replacement": {
        "name": "DAU",
        "calculation": "当日活跃用户数"
      }
    },
    {
      "metric_name": "页面总浏览量",
      "alert_type": "无时间限定",
      "severity": "medium",
      "recommendation": "添加时间维度，计算「日均PV」或「人均PV」",
      "suggested_replacement": {
        "name": "人均页面浏览量",
        "calculation": "日PV / 日UV"
      }
    }
  ],
  "summary": {
    "total_detected": 2,
    "high_severity": 1,
    "medium_severity": 1,
    "all_resolved": false
  }
}
```

---

## 输出

**存储路径**：`output/pm-metrics-design/metrics-system/`

**输出文件**：`metric_system.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["metric_system"],
  "properties": {
    "metric_system": {"type": "object", "description": "指标体系，包含北极星指标、L1/L2指标、行动指标和虚荣指标告警"}
  }
}
```

### metric_system

```json
{
  "metric_system": {
    "north_star": {
      "name": "string",
      "definition": "string",
      "calculation": "string",
      "data_source": "string",
      "validation": {
        "is_vanity_free": true,
        "validation_date": "2026-05-08"
      }
    },
    "l1_metrics": [
      {
        "layer": "Acquisition|Activation|Retention|Revenue|Referral",
        "name": "string",
        "weight": 0.20,
        "calculation": "string",
        "data_source": "string",
        "l2_metrics": [
          {
            "name": "string",
            "calculation": "string",
            "data_source": "string",
            "type": "string",
            "is_actionable": true
          }
        ]
      }
    ],
    "actionable_metrics": [
      {
        "name": "string",
        "linked_l2": "string",
        "linked_l1": "string",
        "optimization_approach": "string"
      }
    ],
    "vanity_alerts": [
      {
        "metric_name": "string",
        "alert_type": "string",
        "severity": "high|medium|low",
        "recommendation": "string",
        "suggested_replacement": {}
      }
    ]
  }
}
```

---

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| metric_system | object | 是 | 指标体系根对象 |
| metric_system.north_star | object | 是 | 北极星指标 |
| metric_system.north_star.name | string | 是 | 北极星指标名称 |
| metric_system.north_star.definition | string | 是 | 北极星指标定义 |
| metric_system.north_star.calculation | string | 是 | 计算公式 |
| metric_system.north_star.data_source | string | 是 | 数据来源 |
| metric_system.north_star.validation | object | 是 | 校验结果 |
| metric_system.north_star.validation.is_vanity_free | boolean | 是 | 是否无虚荣特征 |
| metric_system.l1_metrics | array | 是 | L1指标列表，至少3个维度 |
| metric_system.l1_metrics[].layer | string | 是 | AARRR维度枚举值 |
| metric_system.l1_metrics[].name | string | 是 | L1指标名称 |
| metric_system.l1_metrics[].weight | number | 是 | 权重，所有L1权重之和应为1.0 |
| metric_system.l1_metrics[].l2_metrics | array | 是 | L2指标列表，每L1至少3个 |
| metric_system.l1_metrics[].l2_metrics[].name | string | 是 | L2指标名称 |
| metric_system.l1_metrics[].l2_metrics[].calculation | string | 是 | 计算公式 |
| metric_system.l1_metrics[].l2_metrics[].is_actionable | boolean | 是 | 是否为行动指标 |
| metric_system.actionable_metrics | array | 是 | 行动指标列表 |
| metric_system.actionable_metrics[].name | string | 是 | 行动指标名称 |
| metric_system.actionable_metrics[].linked_l2 | string | 是 | 关联L2指标 |
| metric_system.actionable_metrics[].optimization_approach | string | 是 | 优化方案 |
| metric_system.vanity_alerts | array | 否 | 虚荣指标告警列表 |

---

## 决策规则

### 规则1：北极星指标最终由人类选择

**触发条件**：
- `north_star_metric`未在product_context中定义
- AI生成了3个候选北极星指标

**执行流程**：

```
1. AI生成3个北极星指标候选（含评分）
2. 人类产品负责人选择最终北极星指标
3. 记录选择理由
4. 继续后续步骤
```

**人类决策要素**：
- ✅ 是否反映用户核心价值
- ✅ 是否可被团队直接影响
- ✅ 是否与业务发展阶段匹配
- ✅ 是否具备数据采集条件
- ✅ 是否易于被全公司理解

---

### 规则2：虚荣指标处理方案需建议性审批

**触发条件**：
- 存在高严重度的虚荣指标
- AI推荐了替代指标方案

**执行流程**：

```
1. AI检测虚荣指标并生成处理建议
2. 标记需要审批的虚荣指标
3. 人类确认处理方案（或修改）
4. 执行指标替换或删除
```

---

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|------------|
| 北极星虚荣指标检测 | 无「只增不减」特征、有时间维度、可关联业务目标、可被团队影响 | 标记具体问题，重新推荐北极星指标，触发人类决策流程 |
| L1-L2拆解完整性 | 每个L1层（Acquisition/Activation/Retention/Revenue/Referral）各有3-5个L2指标 | 自动补充缺失L2指标，基于AARRR模型推荐，标记补充项供人工确认 |
| 行动指标可追踪性 | 有明确数据来源、有可执行优化方案、可进行A/B测试验证 | 标记不可追踪指标，建议补充数据埋点，降低该指标优先级 |

---

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| product_context缺失 | 提示用户提供产品类型和业务目标，基于用户输入执行 | 北极星推荐基于用户描述而非结构化输入 |
| existing_metrics缺失 | 跳过现有指标校验，从零构建指标体系 | 无现有指标对比，无法检测冗余 |
| product_context + existing_metrics均缺失 | 用户提供产品类型和业务目标 → 基于行业模板推荐指标体系 | 输出基于行业模板的指标体系，标注"待确认" |

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **产品类型**：社交/电商/SaaS/内容/游戏/金融科技/在线教育/医疗健康/其他
- **业务目标**：当前阶段的核心业务目标（如提升GMV、提高留存率等）
- **商业模式**：产品的商业模式描述（可选，有助于更精准推荐）

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| OKR调整 | 北极星指标、L1指标 | 标注受影响的指标层级，建议人类确认是否更新指标体系 |
| 商业模式变更 | 收入类指标定义 | 标注受影响的指标，建议人类确认是否更新 |
| PRD功能变更 | 行动指标 | 标注受影响的行动指标，建议人类确认是否更新 |

当指标体系自身变更时，对下游的通知机制：

| 指标变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 北极星指标变更 | tracking-plan、metrics-dashboard、monitoring-pipeline | 标记核心指标变更，触发全链路更新 |
| L1/L2指标增删 | tracking-plan、metrics-dashboard | 标记指标增删，触发埋点和看板更新 |
| 行动指标变更 | tracking-plan | 标记行动指标变更，触发埋点更新 |
| 指标定义修改 | tracking-plan、metrics-dashboard、monitoring-pipeline | 标记定义变更，触发相关Skill重新评估 |

---

## 升级路径

### 升级触发条件

当以下任一条件满足时，升级到人工处理：

1. **北极星指标候选推荐失败**
   - 无法基于产品类型推荐北极星指标
   - 推荐评分的置信度低于0.5

2. **虚荣指标处理无法自动化**
   - 高严重度虚荣指标数量>3个
   - 替代指标方案存在冲突

3. **L2拆解逻辑异常**
   - L2指标数量超出合理范围（<3或>10）
   - L2与L1之间无法建立逻辑关系

---

### 升级输出

```json
{
  "escalation": {
    "trigger": "string",
    "reason": "string",
    "current_status": {},
    "ai_recommendation": {},
    "requires_human_action": true,
    "human_decision_needed": [
      "北极星指标选择",
      "虚荣指标处理方案"
    ]
  }
}
```

---

## 变更记录
