---
name: experiment-report
description: 当需要将实验设计和执行结果汇总为完整可交付的A/B测试报告时使用。A/B测试报告自动生成，包含实验概述、统计结论、效果分析、异质性发现和行动建议。关键词：A/B测试报告、实验报告、统计结论、效果分析、实验总结。
metadata:
  module: "产品度量运营"
  sub-module: "实验验证"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
  upstream:
    - experiment-design
    - experiment-execution
---

# A/B测试报告生成

## 核心原则

**实验报告是决策的依据，不是数据的堆砌**

A/B测试报告的核心价值在于将统计结论转化为可执行的行动建议。报告不是简单罗列p值和置信区间，而是回答"我们应该做什么"以及"为什么"。

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| 实验设计方案 | experiment-design | ✅ | 假设、指标、分流方案、终止条件 |
| 实验执行结果 | experiment-execution | ✅ | 统计结论、护栏指标、异质性效应、新奇效应 |
| 产品背景 | 用户提供 | ⬜ | 产品阶段、业务目标、历史实验 |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无实验设计方案 | 基于执行结果反推实验设计要素，标注"设计信息缺失" |
| 无实验执行结果 | 仅生成实验设计方案摘要，标注"等待实验结果" |
| 无产品背景 | 聚焦统计结论本身，行动建议标注"需结合业务上下文" |

## 执行步骤

### Step 1：实验概述组装

从实验设计方案提取核心要素：

1. **实验身份**：实验名称、ID、运行周期、样本量
2. **假设陈述**：原假设 H₀ 和备择假设 H₁
3. **指标体系**：核心指标（OEC）、护栏指标、辅助指标
4. **分流方案**：实验组/对照组配比、流量占比、分层策略

### Step 2：统计结论提炼

从实验执行结果提炼统计结论：

1. **核心指标结论**：效应量、置信区间、p值、统计功效
2. **护栏指标检查**：各护栏指标是否触发告警阈值
3. **样本量验证**：实际样本量是否达到预设MDE要求
4. **统计显著性判定**：显著/不显著/边际显著，附判定依据

### Step 3：效果深度分析

对核心效果进行多维度分析：

1. **效应量解读**：绝对提升、相对提升、业务影响换算
2. **异质性效应**：按用户分群（新/老、平台、地域等）的下钻分析
3. **新奇效应评估**：短期效应 vs 长期效应预判
4. **交互效应**：与其他正在运行实验的潜在交互

### Step 4：行动建议生成

基于统计结论和效果分析，生成分层行动建议：

| 结论类型 | 建议等级 | 行动 |
|----------|----------|------|
| 核心指标显著正向 + 护栏安全 | 🟢 强烈推荐全量 | 全量发布 + 监控计划 |
| 核心指标显著正向 + 护栏有风险 | 🟡 条件推荐 | 分阶段全量 + 护栏专项优化 |
| 核心指标不显著 | 🔵 需要更多信息 | 延长周期/扩大样本/调整指标 |
| 核心指标显著负向 | 🔴 建议终止 | 终止实验 + 根因分析 |
| 异质性效应显著 | 🟠 分群策略 | 分群差异化发布 |

### Step 5：报告组装

将以上内容组装为完整报告。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| A/B测试报告 | `output/pm-metrics-ops/experiment-report/experiment-report.md` | 人类可读的完整报告 |
| 结构化数据 | `output/pm-metrics-ops/experiment-report/experiment-report.json` | 机器可消费的结构化数据 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["experiment_id", "summary", "action_recommendation"],
  "properties": {
    "experiment_id": {"type": "string", "description": "实验ID"},
    "experiment_name": {"type": "string", "description": "实验名称"},
    "report_date": {"type": "string", "description": "报告日期"},
    "summary": {"type": "object", "description": "统计结论摘要，包含结论、推荐和主指标结果"},
    "heterogeneous_effects": {"type": "array", "description": "异质性效应分析"},
    "novelty_effect": {"type": "object", "description": "新奇效应评估"},
    "action_recommendation": {"type": "object", "description": "行动建议，包含决策、理由、风险和后续实验"}
  }
}
```

### Markdown 报告结构

```markdown
# A/B测试报告：{实验名称}

## 1. 实验概述
- 实验ID / 运行周期 / 样本量
- 假设陈述（H₀ / H₁）
- 指标体系（核心 / 护栏 / 辅助）
- 分流方案

## 2. 统计结论
- 核心指标：效应量 [CI] (p=xxx)
- 护栏指标：✅/⚠️/❌ 逐项检查
- 样本量验证：达标/未达标
- 综合判定：显著正向 / 不显著 / 显著负向

## 3. 效果分析
- 效应量解读（绝对/相对/业务换算）
- 异质性效应（分群下钻表格）
- 新奇效应评估
- 交互效应检查

## 4. 行动建议
- 推荐行动 + 理由
- 风险提示
- 后续实验建议

## 5. 附录
- 统计方法说明
- 数据质量检查
- 完整指标明细表
```

### JSON 结构

```json
{
  "experiment_id": "",
  "experiment_name": "",
  "report_date": "",
  "summary": {
    "conclusion": "significant_positive|not_significant|significant_negative|marginal",
    "recommendation": "ship_full|ship_conditional|extend|terminate|segmented",
    "primary_metric": {
      "name": "",
      "control_value": 0,
      "treatment_value": 0,
      "absolute_lift": 0,
      "relative_lift": 0,
      "confidence_interval": [0, 0],
      "p_value": 0,
      "statistical_power": 0
    },
    "guardrail_status": []
  },
  "heterogeneous_effects": [],
  "novelty_effect": {},
  "action_recommendation": {
    "decision": "",
    "rationale": "",
    "risks": [],
    "next_experiments": []
  }
}
```

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| 统计结论与数据一致 | 效应量、p值、CI与原始数据吻合 | 重新计算并标注差异 |
| 行动建议与结论一致 | 建议等级与统计结论匹配 | 调整建议等级 |
| 护栏指标全覆盖 | 所有护栏指标均有检查结论 | 补充缺失护栏指标分析 |
| 异质性效应已分析 | 至少包含3个分群维度 | 补充分群分析 |
