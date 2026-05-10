---
name: insight-orchestrator
description: 需求洞察指挥官。当需要执行完整的需求分析流程时使用，按顺序调度子Skill执行。关键词：需求分析流程、需求洞察编排、需求优先级全流程。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "orchestrator"
  version: "2.0"
---

# 需求洞察指挥官

## 核心原则

需求≠问题，用户描述的是解决方案不是问题本身。

## 执行步骤

1. **数据优先人工补充**——AI处理大规模数据，人类补充定性洞察
2. **显式规则拒绝模糊**——所有分类/判断规则必须可编码
3. **批量并行规模优势**——能并行的步骤不串行
4. **标注置信度分级交付**——所有推断标注置信度，<0.5升级人类

## 任务调度

### 阶段1（并行）

- → 加载 `insight-jtbd` 执行
- → 加载 `insight-requirement-layers` 执行
- ⏸ 等待两个输出文件生成

### 阶段2

- → 加载 `insight-5whys` 执行
- ⏸ 等待 5whys.json 生成

### 阶段3

- → 加载 `insight-kano` 执行
- ⏸ 等待 kano.json 生成

### 阶段4

- → 加载 `insight-priority-scoring` 执行
- ⏸ 等待 priority-scoring.json 生成

### 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-discovery/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

- JTBD三层Job已提取
- KANO分类完成边界情况已升级
- 优先级评分权重人类已确认

## 人类决策点

- Emotional/Social Job验证
- KANO边界判定
- 优先级权重确认
