---
name: market-orchestrator
description: 当需要执行完整的市场与竞品分析流程时使用。市场竞品指挥官，按顺序调度子Skill执行，最终产出可交付的竞品分析报告。关键词：市场分析流程、竞品分析编排、市场研究全流程、竞品分析报告。
metadata:
  module: "产品探索与发现"
  sub-module: "市场竞品"
  type: "orchestrator"
  version: "3.0"
---

# 市场竞品指挥官

## 核心原则

市场不是静态的赛场，而是动态的生态系统。

## 执行步骤

1. **数据优先人工补充**——AI处理大规模数据，人类补充定性洞察
2. **显式规则拒绝模糊**——所有分类/判断规则必须可编码
3. **批量并行规模优势**——能并行的步骤不串行
4. **标注置信度分级交付**——所有推断标注置信度，<0.5升级人类

## 任务调度

### 阶段1（并行）

- → 加载 `market-tam-som` 执行
- → 加载 `market-pest` 执行
- ⏸ 等待两个输出文件生成

### 阶段2

- → 加载 `market-competitor-intel` 执行
- ⏸ 等待 competitor-intel.json 生成

### 阶段3

- → 加载 `market-competitor-quadrant` 执行
- ⏸ 等待 competitor-quadrant.json 生成

### 阶段4（报告生成）

- → 加载 `market-competitor-report` 执行
- ⏸ 等待 competitor-report.md 生成
- ✅ 完整竞品分析报告已产出

### 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-discovery/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

- TAM/SAM/SOM已测算关键假设已标注
- 竞品Feature Matrix已更新
- 差异化机会已识别
- 竞品分析报告已生成，执行摘要完整

## 人类决策点

- TAM/SAM/SOM关键假设验证
- 竞品战略推断置信度<0.5时升级
- 差异化策略优先级确认
- 报告结论与行动建议审批

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 market-competitor-report（竞品分析报告）
