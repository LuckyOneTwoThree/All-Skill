---
name: user-research-orchestrator
description: 用户研究指挥官。当需要执行完整的用户研究流程时使用，按顺序调度子Skill执行。关键词：用户研究流程、用户研究编排、用户洞察全流程。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "orchestrator"
  version: "2.0"
---

# 用户研究指挥官

## 核心原则

用户说的和做的不一样，两者都必须被听见。

## 执行步骤

1. **数据优先人工补充**——AI处理大规模数据，人类补充定性洞察
2. **显式规则拒绝模糊**——所有分类/判断规则必须可编码
3. **批量并行规模优势**——能并行的步骤不串行
4. **标注置信度分级交付**——所有推断标注置信度，<0.5升级人类

## 任务调度

### 阶段1（并行）

- → 加载 `user-research-voice-analysis` 执行
- → 加载 `user-research-behavior-analysis` 执行
- ⏸ 等待两个输出文件生成

### 阶段2

- → 加载 `user-research-user-modeling` 执行
- ⏸ 等待 persona.json 生成且人类审批

### 阶段3（可与阶段2并行）

- → 加载 `user-research-interview-assist` 执行

### 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-discovery/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

进入需求洞察前：

- 用户声音分析完成覆盖≥500条
- 至少1个Persona置信度≥0.7

## 人类决策点

- Persona最终确认
- Emotional/Social Job推断验证
- 访谈结果校准
