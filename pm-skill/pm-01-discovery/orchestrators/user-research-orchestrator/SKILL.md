---
name: user-research-orchestrator
description: 当需要执行完整的用户研究流程时使用。用户研究指挥官，按顺序调度子Skill执行，最终产出可交付的用户研究报告。关键词：用户研究流程、用户研究编排、用户洞察全流程、用户研究报告。
metadata:
  module: "产品探索与发现"
  sub-module: "用户研究"
  type: "orchestrator"
  version: "3.0"
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

### 阶段4（报告生成）

- → 加载 `user-research-report` 执行
- ⏸ 等待 user-research-report.md 生成
- ✅ 完整用户研究报告已产出

### 数据流转

```
[用户反馈数据 + 行为数据]
       ↓
user-research-voice-analysis ∥ user-research-behavior-analysis
       ↓ sentiment_distribution / top_themes / top_pain_points / funnel_health / aha_moment_candidates / feature_usage
user-research-user-modeling
       ↓ personas / empathy_map / journey_map / confidence
user-research-interview-assist
       ↓ interview-script / interview-insights (validated_hypotheses / new_discoveries / cross_interview_patterns)
user-research-report
       ↓ executive_summary / personas / journey / insights / recommendations
```

### 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-discovery/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

进入需求洞察前：

- 用户声音分析完成覆盖≥500条
- 至少1个Persona置信度≥0.7
- 用户研究报告已生成，执行摘要完整

## 人类决策点

- Persona最终确认
- Emotional/Social Job推断验证
- 访谈结果校准
- 用户研究报告结论与行动建议审批

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 user-research-report（用户研究报告）
