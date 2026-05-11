---
name: validation-orchestrator
description: 当需要验证产品方案时使用。方案验证子模块指挥官，包括假设地图生成、MVP范围界定、验证实验设计、可用性测试辅助。关键词：方案验证、假设验证、MVP、可用性测试、实验设计。
metadata:
  module: "产品构思与设计"
  sub-module: "方案验证"
  type: "orchestrator"
  version: "2.0"
---

# 方案验证指挥官

## 核心原则

验证的是假设不是方案，用最小成本获取最大置信度。

## 执行步骤

1. **批量生成人类筛选**：AI批量生成分类/排序建议，人类做最终筛选和判定
2. **结构化发散**：用固定模板和框架引导需求拆解，避免遗漏和随意性
3. **假设驱动而非功能驱动**：每个需求背后必须还原为用户假设，而非直接进入功能设计
4. **设计规范即约束**：需求分析阶段就引入设计规范约束，避免后期返工

## 任务调度

```
validation-assumption-map → validation-mvp → validation-experiment → validation-usability
```

| 阶段 | 任务 | 执行模式 |
|------|------|----------|
| 1 | validation-assumption-map | 🤖 AI自动执行 |
| 2 | validation-mvp | 🤖→👤 AI建议，人类审批 |
| 3 | validation-experiment | 🤖→👤 AI建议，人类审批 |
| 4 | validation-usability | 👤→🤖 人类执行，AI辅助 |

### 数据流转

```
[PRD + 方案设计 + 原型]
       ↓
validation-assumption-map
       ↓ assumption_map (assumptions: value / feasibility / usability / growth / risk_score / validation_method)
validation-mvp
       ↓ mvp_scope (core_mvp / extended_mvp / excluded / scope_ratio / key_assumptions)
validation-experiment
       ↓ experiment_design (hypothesis / test_method / success_criteria / sample_size / duration / confidence_level)
validation-usability
       ↓ usability_report (problems / severity / insights / assumption_validation / improvement_suggestions)
```

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-design/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 假设地图完成 | 最大风险假设已识别 | 每个功能点至少1个假设，最大风险假设必须有验证计划 |
| MVP范围完成 | MVP占比<60% | MVP占比>60%升级人类判断，确认是否调整 |
| 实验设计完成 | 实验方案人类已审核 | 所有实验方案必须人类审核 |
| 可用性测试完成 | 问题严重程度分级合理 | 测试执行必须由人类研究员主持 |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| MVP范围确认 | AI建议MVP范围，人类审批并决定最终范围 |
| 实验方案审核 | AI设计实验方案，人类审核并批准 |
| 验证结论决策 | AI整理验证数据，人类做最终产品方案决策 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
