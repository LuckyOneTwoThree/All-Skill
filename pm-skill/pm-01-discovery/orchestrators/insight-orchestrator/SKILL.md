---
name: insight-orchestrator
description: 当需要执行完整的需求分析流程时使用。需求洞察指挥官，调度insight-analysis完成JTBD、需求分层、5Whys、KANO分类和优先级评分。关键词：需求分析流程、需求洞察编排、需求优先级全流程、JTBD、5Whys、KANO、优先级评分、分析需求、挖掘需求、用户需求、需求排序。本编排器为透传编排器，仅调度1个子Skill(insight-analysis)，上层编排器也可直接调用insight-analysis。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "orchestrator"
  version: "9.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我分析一下用户需求"
    - "需求太多了，帮我排个优先级"
    - "用KANO模型分析一下需求"
    - "挖掘一下用户的深层需求"
---

# 需求洞察指挥官

## 核心原则

1. **需求≠问题**——用户描述的是解决方案不是问题本身，编排器确保先拆解（requirement-layers）再分析（jtbd/5whys），避免停留在表面需求
2. **多维度交叉验证**——JTBD+需求三层+5Whys+KANO四维交叉，单一维度结论不可信，编排器确保各维度数据汇合后才输出最终优先级
3. **串行依赖并行独立**——有数据依赖的步骤串行（5whys依赖jtbd），无依赖的步骤并行（jtbd与requirement-layers可并行），缩短整体周期
4. **人类决策不可替代**——情感诉求验证、KANO边界判定、优先级权重确认必须人类参与，编排器在每个阶段卡口设置人类决策点

## 编排器定位声明

本编排器当前 Pipeline 仅包含 1 个子 Skill（insight-analysis），属于合并简化后的退化编排器。保留本编排器的理由：

1. **统一入口**：为需求洞察子模块提供标准化的调用入口，上层编排器（如 product-launch-orchestrator）无需关心内部子 Skill 的合并历史
2. **阶段总结**：强制生成阶段总结文档（post_pipeline），确保子模块产出可审计、可追溯
3. **异常处理**：提供统一的异常处理策略和降级方案，子 Skill 自身的降级策略不覆盖编排器层面的异常拦截
4. **人类决策点**：在子 Skill 执行前后提供人类决策卡口，确保关键结论经人类确认后才传递下游

若未来该子模块需要扩展为多阶段 Pipeline，本编排器可直接增加阶段，无需修改上层编排器的调用方式。

## 编排协议

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 编排协议。

### 本编排器特有约定

本编排器为透传编排器，职责是提供统一入口、阶段总结和异常处理。上层编排器（如product-launch-orchestrator）可直接调用insight-analysis子Skill，无需经过本编排器。

## Pipeline 定义

```yaml
pipeline: insight-orchestrator
version: 9.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-discovery/insight-orchestrator.md

stages:
  - id: phase-1
    name: "需求洞察分析"
    skills: [insight-analysis]
    gate:
      condition: "insight-analysis输出文件已生成"
      fail_action: "按子Skill失败原因处理，必要时升级人类"
```

## 阶段执行计划

### 阶段1：需求洞察分析

#### 调用 insight-analysis

```
Skill: insight-analysis
输入:
  voice_analysis: output/pm-discovery/user-research-voice-analysis/voice-analysis.json
  behavior_analysis: output/pm-discovery/user-research-behavior-analysis/behavior-analysis.json
  requirements: 用户提供 或 output/pm-discovery/user-research-voice-analysis/voice-analysis.json（可选）
输出: output/pm-discovery/insight-analysis/insight-analysis.json
验证:
  - 输出文件已生成且内容完整
模式: 🤖→👤（优先级权重需人类确认）
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-discovery/insight-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-discovery/insight-analysis/ |
| 总结输出路径 | output/phase-reports/pm-discovery/insight-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: opportunity-orchestrator（洞察分析完成，将洞察转化为可执行的机会）
  alternatives:
    - target: market-orchestrator
      reason: 洞察结论缺乏市场数据验证，需补充市场分析
      condition: 洞察中市场数据引用率<30%或关键假设缺乏市场验证时
    - target: user-research-orchestrator
      reason: 洞察深度不足，需更多用户研究支撑
      condition: 洞察样本量不足或用户画像不清晰时
  special_cases:
    - target: insight-analysis
      reason: 仅需补充特定维度的需求洞察，无需完整编排流
      condition: 已有洞察基础，仅需增量更新时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 输出文件已生成 | insight-analysis.json 已生成 | 按子Skill失败原因处理，必要时升级人类 |
| 阶段总结已生成 | output/phase-reports/pm-discovery/insight-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| KANO边界判定 | insight-analysis KANO分类完成 | 确认边界情况的分类归属 |
| 优先级权重确认 | insight-analysis 优先级评分完成 | 确认评分权重和最终优先级排序 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 子Skill执行失败 | 按子Skill内部降级策略处理，编排器层面暂停并上报人类 |
| 上游数据全部缺失 | 降级为轻量版流程：用户口述需求 → 调用insight-analysis拆解 → 基于描述评分 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
