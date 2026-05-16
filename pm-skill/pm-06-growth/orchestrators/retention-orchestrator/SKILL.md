---
name: retention-orchestrator
description: 当需要降低流失率或提升用户参与度时使用。用户留存指挥官，调度 retention-management（留存管理一体化），实现从流失预防到用户促活的闭环。关键词：用户留存、流失预警、分层运营、参与度、留存策略、retention-management、防流失、促活。
metadata:
  module: "产品增长与运营"
  sub-module: "留存"
  type: "orchestrator"
  version: "7.0"
  domain_tags: ["电商", "社交", "游戏", "通用"]
  trigger_examples:
    - "用户流失严重"
    - "提升用户留存率"
    - "做一下流失预警"
    - "设计分层运营策略"
---

# 用户留存指挥官

## 核心原则

**留存是衡量产品价值的核心指标**

获客决定起点，留存决定终点。如果用户不愿留下，说明产品尚未交付足够的价值。留存问题的根因永远是价值问题，而非运营问题。

## 编排理念

1. **预警与运营一体执行**：retention-management 内部先构建流失预警识别高风险用户，再基于风险分层设计差异化运营策略
2. **预警数据驱动运营优先级**：流失风险等级直接决定运营资源的分配和干预强度

## 编排器定位声明

本编排器当前 Pipeline 仅包含 1 个子 Skill（retention-management），属于合并简化后的退化编排器。保留本编排器的理由：

1. **统一入口**：为用户留存子模块提供标准化的调用入口，上层编排器（如 product-launch-orchestrator）无需关心内部子 Skill 的合并历史
2. **阶段总结**：强制生成阶段总结文档（post_pipeline），确保子模块产出可审计、可追溯
3. **异常处理**：提供统一的异常处理策略和降级方案，子 Skill 自身的降级策略不覆盖编排器层面的异常拦截
4. **人类决策点**：在子 Skill 执行前后提供人类决策卡口，确保关键结论经人类确认后才传递下游

若未来该子模块需要扩展为多阶段 Pipeline，本编排器可直接增加阶段，无需修改上层编排器的调用方式。

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: retention-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-growth/retention-orchestrator.md

stages:
  - id: phase-1
    name: "流失预警与用户分层"
    depends_on: []
    skills: [retention-management]
    gate:
      condition: "流失预警模型已构建且用户分层已完成"
      fail_action: "优化模型或补充训练数据"
```

## 阶段执行计划

#### 调用 retention-management

```
Skill: retention-management
输入:
  user_behavior_data: 数据分析平台（活跃日志）
  churn_history: 数据分析平台（流失记录）
  user_account_data: 用户系统（账户信息）
  user_lifecycle_stage: 用户提供（可选，注册时间、关键里程碑）
输出: output/pm-growth/retention-management/
验证: 流失定义区分免费/付费/企业用户；预警模型准确率>75%；干预策略与风险等级匹配；干预效果追踪包含ROI计算；用户分层覆盖完整生命周期（新/成长/成熟/沉睡/流失）；健康度评分包含活跃度、功能深度、付费意愿、社交参与；运营策略与用户层级匹配；触达内容经过个性化处理
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/pm-growth/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/pm-growth/retention-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: revenue-orchestrator
    reason: 留存优化完成，优化付费转化
    input_mapping:
      retention_output: "output/pm-growth/retention-management/ → revenue-funnel输入"
  alternatives:
    - target: growth-orchestrator
      reason: 留存不是当前瓶颈，回退到增长诊断重新评估
      condition: 留存率优化效果不达预期或留存非当前最大瓶颈时
    - target: experiment-orchestrator
      reason: 留存策略需A/B测试验证
      condition: 流失干预方案变更需量化验证时
  special_cases: []
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 留存管理完成 | retention-management输出文件已生成且非空 | 优化模型或补充训练数据 |
| 阶段总结已生成 | output/phase-reports/pm-growth/retention-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 干预策略确认 | 流失预警和分层运营策略生成完成 | 确认干预策略的优先级、触达方式和资源分配 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 流失预警模型准确率<75% | 降低应用场景，仅用于高置信度用户预警；标注"模型待优化"，建议补充训练数据 |
| 用户行为数据不足以支撑分层 | 采用简化分层模型（仅活跃/沉默/流失3层），标注"分层待细化" |
| 子Skill输出校验未通过 | 回退至当前阶段重新执行，最多重试1次；仍失败则标记异常并上报人类 |
| 上下游数据格式不兼容 | 按下游子Skill输入Schema做字段映射和默认值填充，记录映射关系 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v1.0: 初始版本
- v2.0: description触发词优化
- v3.0: 编排器优化——任务调度改为阶段执行计划，新增子Skill执行协议，调度规则改为执行模式，阶段卡口和人类决策点改为表格
- v4.0: 执行步骤替换为编排理念，新增异常处理表
- v5.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
- v6.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v7.0: 合并 retention-churn + retention-engagement → retention-management，2阶段Pipeline简化为1阶段
