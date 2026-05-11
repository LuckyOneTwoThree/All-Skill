---
name: decision-insight
description: 当需要将数据转化为可执行洞察时使用。数据洞察自动转化，AI自动执行从分析结果到故事化洞察的转化，生成决策建议并标注决策边界。关键词：数据洞察、洞察转化、决策建议、故事化分析、数据故事。
metadata:
  module: "产品度量运营"
  sub-module: "决策闭环"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 12：数据洞察自动转化

## 核心原则

1. **数据是起点，洞察是终点，行动是目的**：没有行动方向的洞察只是数据展示
2. **故事化而非术语化**：将"p=0.001"翻译为"99.9%可信度"，让决策者听懂才能行动
3. **边界标注比推荐更重要**：明确哪些可自动执行、哪些需人类确认，比简单推荐更有价值

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 分析结果 | object | 是 | output/pm-metrics-ops/analysis-anomaly/anomaly_report.json | anomaly/funnel/retention报告 |
| 实验结果 | object | 是 | output/pm-metrics-ops/experiment-execution/ab_test_result.yaml | experiment-execution报告 |
| 业务上下文 | object | ○ | 用户提供 | 产品阶段、团队目标 |
| 历史洞察库 | object[] | ○ | output/pm-metrics-ops/decision-insight/insight_library.json | 避免重复 |

## 执行步骤

### Step 1：从数字到故事

```
数据分析 → 业务叙事
```

**转化原则**：

| 数据语言 | 业务语言 |
|---------|---------|
| 转化率下降3.2% | "每100个访客中，减少3个完成注册" |
| p值=0.001 | "这个结论有99.9%的可信度" |
| 置信区间[2%,5%] | "我们确信提升在2%到5%之间" |
| D7留存28.5% | "一周后，约3成用户仍在使用" |

**叙事模板**：

```yaml
narrative_template: |
  ## 洞察标题
  
  ### 背景
  [产品/功能]在[时间范围]的表现如何？
  
  ### 发现
  我们发现[核心数据变化]，这意味着[业务影响]。
  
  ### 影响
  如果不干预，预计[时间后][影响程度]。
  如果干预成功，预计[收益]。
  
  ### 建议
  基于数据，我们建议[具体行动]。
```

### Step 2：决策建议生成

生成多个可执行的决策选项：

```yaml
action_options:
  - option_id: "opt_001"
    option_name: "全量发布新功能"
    description: "将实验组的新注册流程全量发布"
    
    expected_effect:
      primary_metric: "+8.2% 注册转化率"
      secondary_metrics:
        - "注册用户数 +12%"
        - "整体DAU +2%"
        
    risk:
      level: "low"
      factors:
        - "护栏指标全部安全"
        - "效应稳定无新奇效应"
        - "可快速回滚"
        
    confidence:
      level: "high"
      basis:
        - "统计显著（p=0.001）"
        - "实验周期完整（14天）"
        - "样本量充足（24830）"
        
    resource_requirements:
      engineering: "2人日（发布部署）"
      qa: "1人日（回归测试）"
      
    timeline:
      ready_for_release: "2天后"
      
    prerequisites:
      - "技术评审通过"
      - "监控告警配置完成"

  - option_id: "opt_002"
    option_name: "分批发布"
    description: "先发布iOS，稳定后再发布Android"
    
    expected_effect:
      primary_metric: "+5.2% iOS注册转化率"
      secondary_metrics:
        - "Android效果待验证"
        
    risk:
      level: "medium"
      factors:
        - "Android效果不确定"
        - "维护两套逻辑"
        
    confidence:
      level: "medium"
      basis:
        - "iOS统计显著"
        - "Android效果不显著"
```

### Step 3：决策边界标注

区分不同类型的决策：

```yaml
decision_boundary:
  # 数据明确支持，可自动执行
  type: "data_decision"
  criteria:
    - "统计显著（p < 0.01）"
    - "实际意义显著（超过阈值）"
    - "护栏指标安全"
    - "无重大风险"
  auto_execute_eligible: true
  
  automation_level: "full"  # full / partial / none
  
  human_oversight:
    required: false
    notification_only: true
    
# vs

decision_boundary:
  # 数据供参考，人类决策
  type: "data_reference"
  criteria:
    - "数据支持某一选项"
    - "但存在不确定性"
    - "或涉及战略考量"
  auto_execute_eligible: false
  
  human_oversight:
    required: true
    decision_maker: "product_manager"
    deadline: "3 business days"
```

## 输出

**存储路径**：`output/pm-metrics-ops/decision-insight/`
**输出文件**：decision_insight.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["insight_id", "source", "narrative", "action_options"],
  "properties": {
    "insight_id": {"type": "string", "description": "洞察唯一标识"},
    "created_at": {"type": "string", "description": "创建时间"},
    "source": {"type": "object", "description": "洞察来源，包含类型和置信度"},
    "narrative": {"type": "string", "description": "故事化叙述，包含背景、发现、影响和建议"},
    "action_options": {"type": "array", "description": "决策选项列表，包含预期效果、风险和置信度"},
    "decision_maker": {"type": "string", "description": "决策人角色"},
    "deadline": {"type": "string", "description": "决策截止时间"}
  }
}
```

```yaml
data_insight:
  insight_id: "insight_20240115_001"
  created_at: "2024-01-15T14:30:00Z"
  
  # 来源
  source:
    type: "experiment_result"
    experiment_id: "exp_20240115_simplified_register"
    confidence: "high"
  
  # 故事化叙述
  narrative: |
    ## 简化注册流程实验洞察
    
    ### 背景
    产品团队在2024年1月15日启动了简化注册流程实验，
    将5步注册流程缩短为3步。
    实验持续14天，共24830名用户参与。
    
    ### 发现
    实验组（简化流程）的注册转化率达到38.1%，
    相比对照组（标准流程）的35.2%提升了8.2个百分点。
    这个结论有99.9%的可信度（p=0.001）。
    
    更重要的是，这个提升是稳定的——
    从实验第1天到第14天，效果没有衰减，
    说明这不是用户的新奇效应，而是真实的体验改善。
    
    ### 影响
    如果我们全量发布这个功能：
    - 每月预计新增注册用户 **+12%**（约3.6万用户/月）
    - 按照当前转化漏斗，预计带来 **+8%** 的DAU增长
    
    ### 风险
    我们检查了所有护栏指标：
    - 用户7日留存：42.0% → 41.8%（下降0.2%，可接受）
    - DAU：保持稳定
    - 崩溃率：无变化
    
    所有护栏指标都在安全范围内。
    
    ### 建议
    **建议全量发布简化注册流程。**
    这是低风险高回报的改动，数据支持立即执行。
  
  # 决策选项
  action_options:
    - option: "全量发布简化注册流程"
      option_id: "opt_001"
      expected_effect:
        primary: "注册转化率 +8.2%"
        secondary: ["DAU +2%", "新用户 +12%"]
      risk: "low"
      confidence: "high"
      
    - option: "分平台发布（先iOS）"
      option_id: "opt_002"
      expected_effect:
        primary: "iOS转化 +5.2%"
        secondary: ["Android待验证"]
      risk: "medium"
      confidence: "medium"
      
    - option: "继续实验2周"
      option_id: "opt_003"
      expected_effect:
        primary: "更多数据验证"
        secondary: ["降低不确定性"]
      risk: "low"
      confidence: "low"
  
  # 决策边界
  decision_boundary:
    type: "data_decision"
    description: |
      数据明确支持"全量发布"选项：
      - 统计显著（p=0.001）
      - 实际意义显著（+8.2%）
      - 护栏指标全部安全
      - 无新奇效应
      
    auto_execute_eligible: true
    
    automation_conditions:
      - condition: "技术团队确认可发布"
        required: true
      - condition: "监控告警已配置"
        required: true
      - condition: "回滚方案已准备"
        required: true
    
    override_conditions:
      - condition: "业务策略变更"
        action: "暂停自动执行，等待人工确认"
        
  # 推荐行动
  recommended_action:
    action: "全量发布简化注册流程"
    priority: "high"
    reason: "数据支持充分，风险低，收益显著"
    
    next_steps:
      - step: 1
        task: "技术评审"
        owner: "engineering"
        deadline: "2024-01-17"
      - step: 2
        task: "配置监控告警"
        owner: "data_team"
        deadline: "2024-01-18"
      - step: 3
        task: "发布部署"
        owner: "engineering"
        deadline: "2024-01-19"
      - step: 4
        task: "发布后监控"
        owner: "data_team"
        duration: "2 weeks"
```

## 洞察类型处理

### 异常洞察

```yaml
anomaly_insight:
  type: "anomaly"
  
  narrative: |
    ## 异常检测洞察
    
    今日发现：注册转化率从35%下降到32%。
    异常开始时间：今日9:00。
    影响用户数：约1.5万。
    
    最可能原因：v2.5.0版本中注册流程改动。
    置信度：85%。
    
    建议：立即检查新版本实现，准备回滚方案。
    
  action_options:
    - "立即回滚到上一版本"
    - "紧急修复后发布热更新"
    - "继续监控24小时"
    
  decision_boundary:
    type: "data_decision"
    auto_execute_eligible: true
    condition: "转化率继续下降超过5%"
```

### 漏斗洞察

```yaml
funnel_insight:
  type: "funnel_analysis"
  
  narrative: |
    ## 购买转化漏斗洞察
    
    漏斗整体转化率7.2%，较上周下降0.5个百分点。
    
    最大流失点：从浏览到加购，流失84%用户。
    流失主要集中在：价格敏感用户、Android端用户。
    
    建议优化方向：价格展示策略、加购引导话术。
    
  action_options:
    - "优化价格展示（显示折扣、对比）"
    - "增强加购引导（浮层、提示）"
    - "针对流失用户做调研"
```

## 执行检查清单

```
□ 分析结果理解
□ 数据翻译为业务语言
□ 故事化叙述生成
□ 决策选项生成（至少2个）
□ 风险评估完成
□ 决策边界标注
□ 推荐行动明确
□ 输出一致性检查
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| data_insight | object | 是 | 数据洞察根对象 |
| data_insight.insight_id | string | 是 | 洞察唯一标识 |
| data_insight.created_at | string | 是 | 创建时间 |
| data_insight.source | object | 是 | 洞察来源 |
| data_insight.source.type | string | 是 | 来源类型，枚举值：experiment_result/anomaly/funnel_analysis/retention_analysis |
| data_insight.source.confidence | string | 是 | 来源置信度 |
| data_insight.narrative | string | 是 | 故事化叙述 |
| data_insight.action_options | array | 是 | 决策选项列表，至少2个 |
| data_insight.action_options[].option_id | string | 是 | 选项ID |
| data_insight.action_options[].expected_effect | object | 是 | 预期效果 |
| data_insight.action_options[].risk | string | 是 | 风险等级 |
| data_insight.action_options[].confidence | string | 是 | 置信度 |
| data_insight.decision_boundary | object | 是 | 决策边界 |
| data_insight.decision_boundary.type | string | 是 | 边界类型，枚举值：data_decision/data_reference/human_decision |
| data_insight.decision_boundary.auto_execute_eligible | boolean | 是 | 是否可自动执行 |
| data_insight.recommended_action | object | 是 | 推荐行动 |
| data_insight.recommended_action.action | string | 是 | 行动描述 |
| data_insight.recommended_action.priority | string | 是 | 优先级 |

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 分析结果更新 | 洞察叙述和决策选项 | 更新洞察叙述，重新评估决策选项 |
| 实验结果更新 | 实验相关洞察 | 更新实验洞察，重新评估决策边界 |
| 业务上下文变更 | 行动建议和优先级 | 重新评估行动建议，更新优先级 |
| 历史洞察库更新 | 重复洞察检测 | 执行去重检查，合并相似洞察 |

当洞察自身变更时，对下游的通知机制：

| 洞察变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| data_decision类型洞察 | decision-dace | 标记可自动执行，触发Execute追踪 |
| data_reference类型洞察 | decision-dace | 标记需人类确认，触发Conclude |
| 洞察合并/置信度提升 | decision-culture | 标记洞察更新，触发报告更新 |

---

## 决策规则

| 情况 | 处理方式 |
|------|----------|
| 洞察置信度≥0.8 + 护栏指标无下降 | 标记auto_execute_eligible，通知执行 |
| 洞察置信度≥0.8 + 护栏指标存在不确定性 | 标记data_reference，需人类确认 |
| 洞察置信度0.5-0.8 | 标记data_reference，需人类确认 |
| 洞察置信度<0.5 | 标记human_decision，人类主导 |
| 洞察涉及战略考量（影响≥3个OKR） | 标记human_decision，人类主导 |
| ≥3个独立洞察指向同一结论 | 合并洞察，置信度提升0.15 |
| 2个洞察指向同一结论 | 合并洞察，置信度提升0.1 |
| 洞察涉及收入影响≥10% | 强制标记human_decision |

## 质量检查

- [ ] 洞察叙述使用业务语言而非数据术语
- [ ] 每个洞察至少提供2个决策选项
- [ ] 决策边界标注正确（auto/reference/human）
- [ ] 推荐行动有明确的下一步和负责人

## 降级策略

### 上游文件缺失降级方案

| 缺失范围 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 分析结果缺失 | 用户提供数据发现 → 转化为洞察 | 洞察基于用户描述，可能缺乏深度归因 |
| 实验结果缺失 | 跳过实验相关洞察转化 | 实验洞察维度缺失 |
| 分析结果 + 实验结果均缺失 | 用户提供数据发现 → 转化为洞察 | 输出基于用户描述的洞察，归因和决策边界标注"待补充" |
- 若用户未提供业务上下文，提示用户提供或跳过该输入相关步骤

### 数据获取说明

当上游文件缺失时，需用户提供以下信息以支撑降级生成：
- **数据发现**：观察到的数据变化、趋势或异常
- **业务上下文**（可选）：产品阶段、团队目标和近期变更
- **期望决策方向**（可选）：希望洞察支持的决策类型

## 执行频率

| 触发条件 | 执行 |
|---------|------|
| 分析报告产出 | 自动执行 |
| 实验结果完成 | 自动执行 |
| 手动请求 | 按需执行 |
| 每日汇总 | 每日18:00 |
