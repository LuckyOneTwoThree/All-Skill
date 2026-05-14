---
name: insight-orchestrator
description: 当需要执行完整的需求分析流程时使用。需求洞察指挥官，调度insight-analysis完成JTBD、需求分层、5Whys、KANO分类和优先级评分。关键词：需求分析流程、需求洞察编排、需求优先级全流程、JTBD、5Whys、KANO、优先级评分、分析需求、挖掘需求、用户需求、需求排序。
metadata:
  module: "产品探索与发现"
  sub-module: "需求洞察"
  type: "orchestrator"
  version: "8.0"
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

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/pm-discovery/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-discovery/insight-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline 定义

```yaml
pipeline: insight-orchestrator
version: 8.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-discovery/insight-orchestrator.md

stages:
  - id: phase-1
    name: "需求洞察分析"
    skills: [insight-analysis]
    gate:
      condition: "insight-analysis.json已生成，JTBD三层Job已提取，需求三层已拆解，5Whys根因已定位，KANO分类完成，优先级评分完成"
      fail_action: "按子步骤失败原因分别处理：JTBD缺失补充数据、5Whys根因为空标注降级、KANO边界情况升级人类、优先级权重需人类确认"
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
  - jtbd: jobs数组非空，三层Job（functional/emotional/social）均已提取
  - requirement_layers: requirement_layers数组非空，三层（surface/behavioral/essential）均已拆解
  - 5whys: chains和root_cause字段非空，actionable_fix含effort/impact
  - kano: kano_classification字段非空，边界情况已标注
  - priority_scoring: priority_list和total_score字段非空，score_confidence已标注，base_score和kano_bonus分别计算
模式: 🤖→👤（优先级权重需人类确认）
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-discovery/insight-analysis/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-discovery/insight-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 阶段1完成 | insight-analysis.json 已生成且5个子步骤验证通过 | 按子步骤失败原因分别处理 |
| JTBD三层Job已提取 | functional/emotional/social Job均存在 | 补充数据重新调用 |
| 需求三层已拆解 | surface/behavioral/essential均有内容 | 补充输入数据 |
| 5Whys根因已定位 | root_cause非空 | 检查输入数据是否充分 |
| KANO分类完成 | kano_classification非空，边界情况已标注 | 边界情况升级人类判定 |
| 优先级评分完成 | priority-scoring部分total_score非空 | 优先级权重需人类确认 |
| 阶段总结已生成 | output/phase-reports/pm-discovery/insight-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| Emotional/Social Job验证 | insight-analysis Step 1 JTBD完成 | 确认情感和社会诉求推断是否合理 |
| KANO边界判定 | insight-analysis Step 3 KANO完成 | 确认边界情况的分类归属 |
| 优先级权重确认 | insight-analysis Step 4 优先级评分完成 | 确认评分权重和最终优先级排序 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| JTBD无Functional Job | 标注"缺乏Functional Job"，跳过5Whys分析（依赖Functional Job），直接进入KANO分类 |
| 5Whys根因为空 | 标注"根因未定位"，优先级评分中痛点强度维度使用默认值，score_confidence降级 |
| KANO全部为边界情况 | 全部升级人类判定，优先级评分暂缓执行直到KANO分类确认 |
| 优先级评分权重未确认 | 输出评分结果但标注"权重待确认"，建议人类确认后再进入下游编排器 |
| 上游数据全部缺失 | 降级为轻量版流程：用户口述需求 → 调用insight-analysis拆解 → 基于描述评分 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格
- v4.0: 统一阶段执行计划为表格格式，移除数据流转图
- v5.0: 核心原则重写为编排理念；新增异常处理表；阶段4验证条件新增base_score/kano_bonus
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义；阶段执行计划改为调用指令格式
- v7.0: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；异常处理新增阶段总结生成失败策略
- v8.0: 合并insight-jtbd/insight-requirement-layers/insight-5whys/insight-kano/insight-priority-scoring为insight-analysis，Pipeline stages从4阶段简化为1阶段调用
