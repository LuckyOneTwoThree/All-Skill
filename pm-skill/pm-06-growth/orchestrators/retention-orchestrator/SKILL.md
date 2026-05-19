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

> 协议源头：[orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md)（仅供维护者追踪，本文件已内联完整协议内容，可独立使用）

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **双模式调用**：平台支持 Skill 工具时，显式调用子Skill；平台不支持时，按子Skill的 `name`、输入契约、输出契约和阶段卡口执行兼容调度。
2. **不代理扩写**：兼容调度时不得把子Skill内部方法论复制进编排器上下文，也不得改写子Skill逻辑；只传递必要输入、输出路径和验证条件。
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现细节。
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径和 artifact index 传递数据。
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段。
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。
7. **跨子Skill交叉验证**：当多个子Skill的产出之间存在一致性约束时，编排器可在阶段间执行交叉验证（读取多份产出比对一致性），这属于编排器的协调职责而非代理执行子Skill逻辑。交叉验证规则在编排器SKILL.md中显式定义。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/{领域路径}/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段卡口标准

编排器的阶段卡口只校验以下3类条件，不深入子Skill内部字段：

| 卡口类型 | 校验内容 | 示例 |
|----------|----------|------|
| 输出存在性 | 输出文件已生成且非空 | "api-design-spec输出文件已生成" |
| 顶层结构完整性 | JSON顶层必填字段存在 | "prd.json包含features/pages/entities" |
| 人类决策确认 | 关键决策点已获人类确认 | "设计审查人类确认通过" |

### 通用异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板，整体置信度设为0.3，强制人类确认是否继续 |

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

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-growth/retention-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-growth/ |
| 总结输出路径 | output/phase-reports/pm-growth/retention-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: revenue-orchestrator（留存优化完成，优化付费转化）
  alternatives:
    - target: growth-orchestrator
      reason: 留存不是当前瓶颈，回退到增长诊断重新评估
      condition: 留存率优化效果不达预期或留存非当前最大瓶颈时
    - target: experiment-orchestrator
      reason: 留存策略需A/B测试验证
      condition: 流失干预方案变更需量化验证时
  special_cases: []

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
