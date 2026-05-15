---
name: competitor-monitoring-report
description: 当需要将竞品追踪数据汇总为完整可交付的监控报告时使用。竞品动态监控报告自动生成，包含竞品动态汇总、功能变更追踪、市场策略变化、威胁评估和应对建议。关键词：竞品监控报告、竞品动态、功能追踪、威胁评估、竞品应对、竞品报告、对手在干嘛。
metadata:
  module: "产品监控与迭代"
  sub-module: "问题诊断"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "SaaS", "通用"]
  trigger_examples:
    - "竞品最近有什么新动作"
    - "帮我出一份竞品监控报告"
    - "对手更新了什么功能"
  interaction_mode: "ai_suggest_human_approve"
---

# 竞品动态监控报告生成

## 核心原则

**竞品监控不是窥探，而是战略感知**

竞品动态监控报告的核心价值在于将零散的竞品信息转化为结构化的战略洞察。监控的目的不是模仿竞品，而是理解市场格局变化，识别威胁和机会。

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 竞品追踪数据 | markdown | 是 | diagnosis-competition | 功能变更、优劣势变化、应对策略 |
| 竞品情报 | markdown | 否 | market-competitor-analysis | 竞品动态、口碑、定价 |
| 竞品分类 | markdown | 否 | market-competitor-analysis | 四象限分类、竞品定位 |
| 监控周期 | text | 否 | 用户输入 | 报告覆盖的时间范围 |

### 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|----------|----------|----------|
| 无竞品追踪数据 | 基于竞品情报生成报告，标注"追踪数据缺失" | 报告缺乏功能变更追踪细节 |
| 无竞品情报 | 基于用户提供信息生成框架，标注"待分析补充" | 报告为框架级，缺乏情报支撑 |
| 无竞品分类 | 默认监控直接竞品，标注"分类待补充" | 仅覆盖直接竞品，间接/替代竞品缺失 |
| 无监控周期 | 默认最近30天，标注"周期待确认" | 报告覆盖范围可能不准确 |

## 执行步骤

### Step 1：竞品动态汇总

汇总监控周期内所有竞品动态：

1. **重大动态**：融资/并购/高管变动/战略转型
2. **产品动态**：新功能上线/功能下线/重大改版
3. **市场动态**：新市场进入/定价调整/渠道变化
4. **舆论动态**：正面/负面舆情、用户口碑变化

### Step 2：功能变更追踪

详细追踪竞品的功能变更：

1. **新增功能**：功能描述、目标用户、与自身产品的重叠度
2. **功能优化**：优化内容、用户体验变化
3. **功能下线**：下线功能、可能原因
4. **功能对比矩阵**：核心功能维度的竞品对比更新

### Step 3：市场策略变化

分析竞品的市场策略变化：

1. **定价策略变化**：价格调整、新定价模型、促销活动
2. **渠道策略变化**：新渠道开拓、渠道重心转移
3. **目标市场变化**：新用户群体、新行业/地域拓展
4. **合作生态变化**：新合作伙伴、集成拓展

### Step 4：威胁评估

评估竞品动态对自身产品的威胁：

1. **直接威胁**：竞品功能直接替代自身核心功能
2. **间接威胁**：竞品策略变化影响自身市场地位
3. **机会窗口**：竞品失误或空出的市场空间
4. **威胁等级**：🔴 严重 / 🟠 较高 / 🟡 中等 / 🟢 较低

### Step 5：应对建议

基于威胁评估生成应对建议：

1. **即时应对**（1-2周）：对严重威胁的紧急响应
2. **短期应对**（1-2月）：功能对齐或差异化策略
3. **长期应对**（季度+）：战略调整或新方向探索
4. **监控加强**：需要加大监控力度的竞品或维度

### Step 6：报告组装

将以上内容组装为完整监控报告。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 竞品监控报告 | `output/pm-monitoring/competitor-monitoring-report/competitor-monitoring-report.md` | 人类可读的完整报告 |
| 结构化数据 | `output/pm-monitoring/competitor-monitoring-report/competitor-monitoring-report.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["monitoring_period", "summary", "dynamics", "threat_assessment"],
  "properties": {
    "monitoring_period": {"type": "object", "description": "监控周期，包含起止日期"},
    "report_date": {"type": "string", "description": "报告日期"},
    "summary": {"type": "object", "description": "执行摘要，包含监控竞品数、重大动态和威胁等级"},
    "dynamics": {"type": "object", "description": "竞品动态汇总，包含重大/产品/市场/舆论动态"},
    "feature_changes": {"type": "object", "description": "功能变更追踪，包含新增/优化/下线和对比矩阵"},
    "market_strategy_changes": {"type": "array", "description": "市场策略变化列表"},
    "threat_assessment": {"type": "object", "description": "威胁评估，包含直接/间接威胁和机会窗口"},
    "response_recommendations": {"type": "object", "description": "应对建议，包含即时/短期/长期和监控加强"}
  }
}
```

### Markdown 报告结构

```markdown
# 竞品动态监控报告：{监控周期}

## 1. 执行摘要
- 监控周期 / 监控竞品数 / 重大动态数 / 威胁等级

## 2. 竞品动态汇总
- 重大动态
- 产品动态
- 市场动态
- 舆论动态

## 3. 功能变更追踪
- 新增功能
- 功能优化
- 功能下线
- 功能对比矩阵更新

## 4. 市场策略变化
- 定价策略
- 渠道策略
- 目标市场
- 合作生态

## 5. 威胁评估
- 直接威胁
- 间接威胁
- 机会窗口
- 威胁等级矩阵

## 6. 应对建议
- 即时应对
- 短期应对
- 长期应对
- 监控加强建议
```

### JSON 结构

```json
{
  "monitoring_period": { "start": "", "end": "" },
  "report_date": "",
  "summary": {
    "competitors_monitored": 0,
    "major_events": 0,
    "threat_level": "severe|high|medium|low"
  },
  "dynamics": {
    "major": [],
    "product": [],
    "market": [],
    "sentiment": []
  },
  "feature_changes": {
    "new_features": [],
    "optimizations": [],
    "retirements": [],
    "comparison_matrix": {}
  },
  "market_strategy_changes": [],
  "threat_assessment": {
    "direct_threats": [],
    "indirect_threats": [],
    "opportunities": [],
    "threat_matrix": {}
  },
  "response_recommendations": {
    "immediate": [],
    "short_term": [],
    "long_term": [],
    "monitoring_enhancement": []
  }
}
```

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| 动态覆盖完整 | 产品/市场/舆论3个维度均有分析 | 补充缺失维度 |
| 威胁评估有依据 | 每个威胁有具体竞品动态支撑 | 补充威胁依据 |
| 应对建议可执行 | 每项建议有时间范围和责任方 | 补充执行细节 |
| 功能对比已更新 | 对比矩阵反映最新竞品状态 | 更新对比数据 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| monitoring_period | object | 是 | 监控周期，须含start/end |
| summary | object | 是 | 执行摘要，须含competitors_monitored/major_events/threat_level |
| summary.threat_level | string | 是 | 威胁等级，仅允许severe/high/medium/low |
| dynamics | object | 是 | 竞品动态，须含major/product/market/sentiment |
| threat_assessment | object | 是 | 威胁评估，须含direct_threats/indirect_threats/opportunities |
| response_recommendations | object | 否 | 应对建议，须含immediate/short_term/long_term |

## 决策规则

- 当威胁等级为严重/较高时，必须包含即时应对建议（1-2周内可执行）
- 当竞品功能直接重叠时，优先评估差异化策略而非功能对齐
- 当监控数据覆盖≥3个竞品时，生成完整对比矩阵
- 需要人类确认的决策点：威胁等级判定、应对策略优先级、监控竞品范围调整

## 降级策略

- 当无竞品追踪数据时：基于竞品分析生成报告，标注"追踪数据缺失"
- 当无竞品分类时：默认监控直接竞品，标注"分类待补充"
- 当竞品分析不完整时：生成报告框架，缺失维度标注"待分析补充"
- 数据不可用时：基于用户提供信息生成定性分析报告，标注"需数据验证"

## 上游变更响应

### 上游变更影响表

| 上游来源 | 变更类型 | 影响范围 | 响应动作 |
|----------|----------|----------|----------|
| diagnosis-competition | 功能变更数据更新 | 功能变更追踪和威胁评估 | 更新功能对比矩阵和威胁等级 |
| market-competitor-analysis | 竞品情报更新 | 竞品动态汇总和市场策略分析 | 更新动态汇总和策略变化 |
| market-competitor-analysis | 竞品分类变更 | 监控范围和威胁评估 | 调整监控竞品范围 |

### 下游通知机制表

| 下游消费者 | 通知条件 | 通知方式 | 通知内容 |
|------------|----------|----------|----------|
| diagnosis-orchestrator | 监控报告生成完成 | 输出文件更新 | 报告完成状态和关键威胁等级 |
| iteration-decision | 威胁等级为severe/high | 写入输出文件 | 竞品威胁和即时应对建议 |
