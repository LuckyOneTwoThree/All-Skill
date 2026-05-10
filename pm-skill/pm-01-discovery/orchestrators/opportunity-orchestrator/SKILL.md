---
name: opportunity-orchestrator
description: 机会识别指挥官。当需要执行完整的机会识别与定义流程时使用，按顺序调度子Skill执行。关键词：机会识别流程、机会评估编排、产品机会全流程。
metadata:
  module: "产品探索与发现"
  sub-module: "机会识别"
  type: "orchestrator"
  version: "2.0"
---

# 机会识别指挥官

## 核心原则

好机会不是找到的，是定义出来的。

## 执行步骤

1. **数据优先人工补充**——AI处理大规模数据，人类补充定性洞察
2. **显式规则拒绝模糊**——所有分类/判断规则必须可编码
3. **批量并行规模优势**——能并行的步骤不串行
4. **标注置信度分级交付**——所有推断标注置信度，<0.5升级人类

## 任务调度

### 阶段1

- → 加载 `opportunity-scoring` 执行
- ⏸ 等待 opportunity-scoring.json 生成且战略契合度由人类判定

### 阶段2

- → 加载 `opportunity-hmw` 执行
- ⏸ 等待 hmw.json 生成

### 阶段3

- → 加载 `opportunity-problem-statement` 执行
- ⏸ 等待 problem-statement.json 生成

### 阶段4

- → 加载 `opportunity-brief` 执行
- ⏸ 等待 opportunity-brief.json 生成且人类做最终决策

### 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-discovery/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

- 机会评分完成战略契合度已人类判定
- Problem Statement通过质量检查
- Opportunity Brief人类已做最终决策

## 人类决策点

- 战略契合度判定
- Problem Statement质量检查3次不通过
- Opportunity Brief最终决策
