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

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

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

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-discovery/insight-analysis/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-discovery/insight-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: opportunity-orchestrator
    reason: 洞察分析完成，建议进入机会识别与定义阶段，将洞察转化为可执行的机会
    input_mapping:
      insight_analysis_output: "output/pm-discovery/insight-analysis/ → opportunity-definition输入"
  alternatives:
    - target: market-orchestrator
      reason: 如需补充市场数据支撑洞察结论
      condition: 洞察结论缺乏市场数据验证时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

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

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 新增子Skill执行协议，将描述性调度改为命令式可执行步骤；新增阶段执行计划含读取路径、输入输出、验证条件；新增阶段卡口表格
- v4.0: 统一阶段执行计划为表格格式，移除数据流转图
- v5.0: 核心原则重写为编排理念；新增异常处理表；阶段4验证条件新增base_score/kano_bonus
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义；阶段执行计划改为调用指令格式
- v7.0: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；异常处理新增阶段总结生成失败策略
- v8.0: 合并insight-jtbd/insight-requirement-layers/insight-5whys/insight-kano/insight-priority-scoring为insight-analysis，Pipeline stages从4阶段简化为1阶段调用
- v9.0: 透传编排器改造——description标注透传编排器；Pipeline阶段卡口精简为"输出文件已生成"和"阶段总结已生成"；人类决策点从3个精简为2个（KANO边界判定、优先级权重确认）；异常处理精简；编排协议后增加透传说明
