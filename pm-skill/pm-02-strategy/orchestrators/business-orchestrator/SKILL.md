---
name: business-orchestrator
description: 当需要设计或评估产品商业模式时使用。商业模式设计子模块指挥官，包括商业模式画布生成、价值主张匹配度评估、定价策略分析，最终产出商业战略规划报告。关键词：商业模式设计、商业画布、定价策略、商业化、商业战略报告。
metadata:
  module: "产品商业与战略"
  sub-module: "商业模式设计"
  type: "orchestrator"
  version: "3.0"
---

# 商业模式设计指挥官

## 核心原则

商业模式不是设计出来的，是验证出来的。

## 执行步骤

1. **选项生成优于单一推荐**：每个关键决策点生成2-3个可比较选项，由人类选择而非AI替选
2. **数据驱动填充人类驱动选择**：AI负责数据整合与逻辑推导，人类负责方向判断与最终决策
3. **假设显式化**：所有推断内容必须标注为假设，包含风险等级和验证方法
4. **财务建模自动化**：单位经济、敏感性分析等财务计算由AI自动完成，人类只审核结论

## 任务调度

```
business-model-canvas → business-value-fit → business-pricing → business-strategy-report
```

| 阶段 | 任务 | 执行模式 |
|------|------|----------|
| 1 | business-model-canvas | 🤖→👤 AI建议，人类审批 |
| 2 | business-value-fit | 🤖 AI自动执行 |
| 3 | business-pricing | 🤖→👤 AI建议，人类审批 |
| 4 | business-strategy-report | 🤖→👤 AI建议，人类审批 |

### 数据流转

```
[产品信息 + 市场数据 + 竞品数据]
       ↓
business-model-canvas
       ↓ bmc (9宫格: value_proposition / customer_segments / revenue_streams / key_resources / key_activities / key_partners / cost_structure / channels / customer_relationships)
business-value-fit
       ↓ value_fit_score / mismatch_items / alignment_recommendations
business-pricing
       ↓ pricing_strategy / pricing_tiers / unit_economics / sensitivity_analysis
business-strategy-report
       ↓ executive_summary / strategic_assessment / strategic_directions / execution_path / risks_and_contingencies
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-strategy/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| BMC生成完成 | BMC 9格全部填充、假设已标注 | 补充缺失要素，无法填充的标注为待验证假设 |
| 价值主张匹配完成 | 价值主张匹配度≥3.0 | 匹配度<3.0触发人类决策者介入评估 |
| 定价方案完成 | 3个定价方案已生成 | 补充缺失方案，确保差异化定位 |
| 商业战略报告完成 | 报告执行摘要完整，至少2个战略方向 | 补充战略方向或标注"建议补充战略分析" |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 收入模型选择 | AI生成多个收入模式选项，人类选择最终方案 |
| 定价数字拍板 | AI提供定价分析和方案，人类决定具体定价数字和套餐结构 |
| 商业战略方向确认 | AI推荐战略方向，人类确认最终战略选择 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 business-strategy-report（商业战略规划报告）
