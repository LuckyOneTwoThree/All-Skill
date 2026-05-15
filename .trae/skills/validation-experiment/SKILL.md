---
name: validation-experiment
description: 当需要设计验证实验方案时使用。验证实验自动设计工具，根据假设地图和MVP范围，智能选择验证方法并设计实验方案，包括A/B测试和可用性测试的参数设计。关键词：实验设计、A/B测试、样本量、验证方法、验证方案、测试设计。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "软件", "通用"]
  trigger_examples:
    - "怎么验证这个假设"
    - "帮我设计A/B测试"
    - "实验方案怎么做"
  interaction_mode: "ai_suggest_human_approve"
---

# 验证实验自动设计

## 核心原则

1. **实验是假设的审判庭**——每个实验必须对应一个假设，没有假设的实验是浪费
2. **最小成本获取最大置信度**——实验设计追求成本最小化，而非完美数据
3. **统计显著性是底线**——样本量和置信水平必须预先设定，事后调整是作弊
4. **失败实验和成功实验同样有价值**——证伪假设与证实假设等效，关键是学到什么

### 基本信息

| 属性 | 值 |
|------|-----|
| Pipeline ID | 14 |
| 名称 | 验证实验自动设计 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| 输入 | 假设地图 + MVP范围 + 可用流量/用户数据 |

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 假设地图 | JSON | 是 | output/pm-design/validation-assumption-map/assumption-map.json | Pipeline 12输出的假设地图 |
| MVP范围 | JSON | 是 | output/pm-design/validation-mvp/mvp-scope.json | Pipeline 13输出的MVP范围 |
| 可用流量/用户数据 | JSON | ○ | 用户提供 | 当前用户量、日活、新增等数据 |

### 输入格式
```json
{
  "assumption_map": [...],
  "mvp_scope": {...},
  "traffic_data": {
    "daily_active_users": 10000,
    "new_users_daily": 500,
    "weekly_users": 50000,
    "conversion_rate": 0.03
  }
}
```

## 执行步骤

### Step 1: 验证方法选择

**决策树**:

```
开始
  ↓
流量是否足够A/B测试?
  ↓
是 → 考虑A/B测试
否 → 考虑可用性测试
  ↓
成本考量
  ↓
向导MVP / 原型测试 / 落地页测试
```

**验证方法对比**:

| 方法 | 适用场景 | 成本 | 可靠性 |
|------|----------|------|--------|
| A/B测试 | 流量充足、需量化验证 | 高 | ⭐⭐⭐⭐⭐ |
| 可用性测试 | 流量不足、需定性洞察 | 中 | ⭐⭐⭐⭐ |
| 落地页测试 | 价值假设验证 | 低 | ⭐⭐⭐ |
| 向导MVP | 可行性验证 | 高 | ⭐⭐⭐⭐ |
| 原型测试 | 可用性假设验证 | 低 | ⭐⭐⭐⭐ |

**选择规则**:

| 条件 | 推荐方法 |
|------|----------|
| 日活 > 5000，且假设可量化 | A/B测试 |
| 日活 < 5000 | 可用性测试 |
| 需要快速验证价值假设 | 落地页测试 |
| 需要验证技术可行性 | 向导MVP |

### Step 2: 实验方案设计

#### A/B测试设计方案

```json
{
  "experiment_design": {
    "type": "A/B_TEST",
    "experiment_group": "实验组描述",
    "control_group": "对照组描述",
    "split_ratio": "50/50",
    "primary_metric": "主指标",
    "secondary_metrics": ["辅助指标"],
    "sample_size": 10000,
    "duration_days": 14,
    "minimum_detectable_effect": "MDE",
    "stopping_criteria": {
      "significance_level": 0.05,
      "statistical_power": 0.8,
      "early_stopping_conditions": ["达到显著性"]
    }
  }
}
```

**参数计算说明**:

| 参数 | 说明 | 计算依据 |
|------|------|----------|
| sample_size | 所需样本量 | 基于MDE、显著性水平、统计功效 |
| duration_days | 实验时长 | sample_size / 日均流量 |
| split_ratio | 分流比例 | 常用50/50，可调整 |

#### 可用性测试设计方案

```json
{
  "experiment_design": {
    "type": "USABILITY_TEST",
    "objectives": ["测试目标"],
    "task_script": [
      {
        "task_id": "T001",
        "task_description": "任务描述",
        "success_criteria": "成功标准"
      }
    ],
    "recruitment_criteria": {
      "user_count": 8,
      "qualification_questions": ["筛选问题"]
    },
    "success_metrics": {
      "task_completion_rate": ">90%",
      "time_on_task": "<2分钟",
      "error_rate": "<10%"
    }
  }
}
```

### Step 3: 结果预判

**三种场景**:

```json
{
  "outcome_scenarios": {
    "optimistic": {
      "condition": "指标提升≥MDE",
      "action": "推进开发，持续监控"
    },
    "neutral": {
      "condition": "指标有提升但不显著",
      "action": "延长实验或调整方案"
    },
    "pessimistic": {
      "condition": "指标无提升或下降",
      "action": "重新审视假设或调整方案"
    }
  }
}
```

## 输出


**输出校验规则**：详见下方章节
**存储路径**：`output/pm-design/validation-experiment/`
**输出文件**：experiment_plan.json

```json
{
  "validation_experiment": {
    "method": "A_B_TEST|USABILITY_TEST|LANDING_PAGE|WIZARD_MVP",
    "target_assumption": {
      "id": "A001",
      "assumption": "假设内容",
      "risk_score": 16
    },
    "experiment_design": {
      "type": "A_B_TEST",
      "experiment_group": "...",
      "control_group": "...",
      "split_ratio": "50/50",
      "primary_metric": "点击率",
      "sample_size": 10000,
      "duration_days": 14,
      "stopping_criteria": {...}
    },
    "outcome_scenarios": {...}
  },
  "approval_status": "pending",
  "ai_recommendation": "AI建议说明"
}
```

**输出校验规则**：详见下方输出校验规则章节

## 决策规则

| 规则 | 条件 | 动作 |
|------|------|------|
| 人类审核 | 所有实验方案 | 必须人类审核 |
| 样本量不足 | sample_size > 可用流量 | 降低MDE或改用可用性测试 |
| 周期过长 | duration_days > 30 | 考虑提高流量或降低MDE |

## 质量检查

| 检查项 | 通过条件 | 检查结果 |
|--------|----------|----------|
| 方法选择有依据 | 决策树结果有说明 | pass/fail |
| 实验设计完整 | 含所有必要参数 | pass/fail |
| 成功标准明确 | 有量化指标 | pass/fail |
| 场景预判完整 | 三种场景都有 | pass/fail |
| 终止条件明确 | 含显著性/功效要求 | pass/fail |

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|----------|
| 假设地图缺失 | 用户描述关键假设，设计实验 | 缺乏结构化假设数据，实验与假设可能不对齐 |
| 方案设计数据缺失 | 用户描述方案，设计实验 | 缺乏方案数据，实验设计可能不够精准 |
| 假设地图+方案设计均缺失 | 用户描述假设和方案，设计实验 | 整体置信度降低，实验设计可能不够完整 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户描述设计实验 | 输出仅为基本实验框架 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| experiments | array | 是 | 实验列表 |
| experiments[].id | string | 是 | 实验唯一标识 |
| experiments[].assumption_id | string | 是 | 关联假设ID |
| experiments[].type | string | 是 | 实验类型 |
| experiments[].hypothesis | string | 是 | 实验假设 |
| experiments[].method | string | 是 | 实验方法 |
| experiments[].metrics | array | 是 | 指标列表 |
| experiments[].metrics[].name | string | 是 | 指标名称 |
| experiments[].metrics[].type | string | 是 | 指标类型（primary/secondary） |
| experiments[].metrics[].target | string | 是 | 目标值 |
| experiments[].sample_size | object | 是 | 样本量 |
| experiments[].sample_size.minimum | integer | 是 | 最小样本量 |
| experiments[].duration | string | 是 | 实验周期 |
| experiments[].confidence_level | number | 是 | 置信水平 |
| experiments[].cost_estimate | object | 是 | 成本估算 |
| experiments[].result | object | 否 | 实验结果（实验完成后填充） |
| experiments[].result.conclusion | string | 否 | 实验结论 |
| experiments[].result.learnings | array | 否 | 学习要点 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 假设地图变更（假设增删/评分变更） | 实验假设、实验优先级 | 标注受影响的实验，建议人类确认是否重新设计 |
| 方案设计变更 | 实验设计细节 | 标注受影响的实验设计，建议人类确认是否调整 |
| 资源约束变更 | 实验成本估算、样本量 | 标注受影响的成本和样本量，建议人类确认是否调整 |

### 下游通知机制

| 实验设计变更类型 | 通知范围 | 通知方式 |
|-----------------|----------|----------|
| 实验增删 | validation-mvp | 标记实验变更，触发MVP范围调整 |
| 实验优先级变更 | validation-mvp | 标记优先级变更，触发MVP验证计划更新 |
| 实验结果更新 | validation-mvp | 标记结果更新，触发MVP假设验证状态更新 |

---

## 使用示例

**输入**:
```json
{
  "assumption_map": [
    {"id": "A001", "assumption": "用户认为推荐内容与兴趣匹配", "risk_score": 20}
  ],
  "traffic_data": {
    "daily_active_users": 10000,
    "new_users_daily": 500
  }
}
```

**AI分析**:
```
流量判断: 日活10000 > 5000，可进行A/B测试
假设类型: 价值假设 + 可用性假设
推荐方法: A/B测试

实验设计:
- 分流: 50/50
- 主指标: 推荐内容点击率
- 样本量: 约10000（基于MDE=10%）
- 时长: 14天
```

**输出**:
```json
{
  "validation_experiment": {
    "method": "A_B_TEST",
    "target_assumption": {
      "id": "A001",
      "assumption": "用户认为推荐内容与兴趣匹配"
    },
    "experiment_design": {
      "type": "A_B_TEST",
      "primary_metric": "推荐内容点击率",
      "sample_size": 10000,
      "duration_days": 14
    }
  }
}
```
