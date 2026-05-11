---
name: competitor-monitoring-report
description: 当需要将竞品追踪数据汇总为完整可交付的监控报告时使用。竞品动态监控报告自动生成，包含竞品动态汇总、功能变更追踪、市场策略变化、威胁评估和应对建议。关键词：竞品监控报告、竞品动态、功能追踪、威胁评估、竞品应对。
metadata:
  module: "产品监控与迭代"
  sub-module: "问题诊断"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
  upstream:
    - diagnosis-competition
    - market-competitor-intel
    - market-competitor-quadrant
---

# 竞品动态监控报告生成

## 核心原则

**竞品监控不是窥探，而是战略感知**

竞品动态监控报告的核心价值在于将零散的竞品信息转化为结构化的战略洞察。监控的目的不是模仿竞品，而是理解市场格局变化，识别威胁和机会。

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| 竞品追踪数据 | output/pm-monitoring/diagnosis-competition | ✅ | 功能变更、优劣势变化、应对策略 |
| 竞品情报 | output/pm-discovery/market-competitor-intel | ⬜ | 竞品动态、口碑、定价 |
| 竞品分类 | output/pm-discovery/market-competitor-quadrant | ⬜ | 四象限分类、竞品定位 |
| 监控周期 | 用户提供 | ⬜ | 报告覆盖的时间范围 |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无竞品追踪数据 | 基于竞品情报生成报告，标注"追踪数据缺失" |
| 无竞品情报 | 基于用户提供信息生成框架，标注"待情报补充" |
| 无竞品分类 | 默认监控直接竞品，标注"分类待补充" |
| 无监控周期 | 若用户未提供监控周期，提示用户提供或跳过该输入相关步骤 |

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
