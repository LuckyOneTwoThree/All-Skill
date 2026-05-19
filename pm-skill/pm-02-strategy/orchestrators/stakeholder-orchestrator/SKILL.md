---
name: stakeholder-orchestrator
description: 当需要进行Stakeholder管理或战略文档编写时使用。Stakeholder对齐指挥官，调度stakeholder-analysis。关键词：Stakeholder对齐、战略文档、战略沟通、利益相关者、干系人管理、对齐沟通。
metadata:
  module: "产品商业与战略"
  sub-module: "Stakeholder对齐"
  type: "orchestrator"
  version: "7.0"
  domain_tags: ["SaaS", "通用"]
  trigger_examples:
    - "帮我管理Stakeholder"
    - "写一份战略沟通文档"
    - "做一下利益相关者分析"
    - "对齐一下各方意见"
---

# Stakeholder对齐指挥官

## 核心原则

对齐不是说服，是共创。

1. **权力-利益双维校准**——Stakeholder分析必须同时覆盖权力影响力和利益相关度，缺一不可
2. **沟通策略因人定制**——不同Stakeholder的沟通策略、信息粒度和表达方式必须差异化，禁止一刀切
3. **对齐结果可追溯**——每次对齐沟通的结论、承诺和异议必须记录归档，确保后续可追溯

## 编排器定位声明

本编排器当前 Pipeline 仅包含 1 个子 Skill（stakeholder-analysis），属于合并简化后的退化编排器。保留本编排器的理由：

1. **统一入口**：为Stakeholder对齐子模块提供标准化的调用入口，上层编排器（如 product-launch-orchestrator）无需关心内部子 Skill 的合并历史
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
pipeline: stakeholder-orchestrator
version: 7.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/pm-strategy/stakeholder-orchestrator.md

stages:
  - id: phase-1
    name: "利益相关者分析"
    skills: [stakeholder-analysis]
    gate:
      condition: "Stakeholder地图人类已校准，战略文档质量检查通过，简报可执行性检查通过"
      fail_action: "影响力评估需人类校准；质量检查不通过自动修改，修改后仍不达标需人类审核；语气和重点需根据受众调整"
```

## 阶段执行计划

### 阶段1：利益相关者分析

- **Skill**: stakeholder-analysis
- **输入**:
  - bmc: 商业模式画布（来自 output/pm-strategy/business-model-canvas/bmc.json）
  - product_info: 产品/业务信息（用户提供）
  - strategy_report: 商业战略报告（来自 output/pm-strategy/business-strategy-report/business-strategy-report.json，可选）
  - audience_type: 受众类型（用户提供：executive/team/external）
- **输出**: `output/pm-strategy/stakeholder-analysis/stakeholder-analysis.json` + `output/pm-strategy/stakeholder-analysis/stakeholder-analysis.md`
- **验证**: Stakeholder地图人类已校准，战略文档质量检查通过，简报可执行性检查通过
- **执行模式**: 🤖→👤 AI建议，人类审批
- **⏸ 阶段卡口**: Stakeholder地图人类已校准，战略文档质量检查通过，简报可执行性检查通过 → 未通过：影响力评估需人类校准；质量检查不通过自动修改，修改后仍不达标需人类审核；语气和重点需根据受众调整

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/pm-strategy/stakeholder-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/pm-strategy/ |
| 总结输出路径 | output/phase-reports/pm-strategy/stakeholder-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: planning-orchestrator（利益相关者分析完成，确保规划对齐关键利益方）
  alternatives:
    - target: project-planning-orchestrator
      reason: 已进入项目执行阶段，直接启动项目规划
      condition: 战略规划已完成，需要启动项目时
    - target: business-orchestrator
      reason: 利益相关者诉求影响商业模式，需回溯调整
      condition: 关键利益方诉求与现有商业模式冲突时
  special_cases: []

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| Stakeholder地图完成 | Stakeholder地图人类已校准 | 影响力评估需人类校准，遗漏的相关方需人工补充 |
| 战略文档完成 | stakeholder-analysis输出文件已生成且非空 | 质量检查不通过自动修改，修改后仍不达标需人类审核精炼 |
| 战略简报完成 | stakeholder-analysis输出文件已生成且非空 | 语气和重点需根据受众调整 |
| 阶段总结已生成 | output/phase-reports/pm-strategy/stakeholder-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 阶段1子Skill失败 | 暂停编排，输出失败诊断信息，请求人类介入修复后重试该阶段 |
| 上游数据缺失 | 标注缺失数据项，使用合理假设填充（标注置信度≤0.3），继续执行并在输出中高亮标注 |
| 关键决策点未获人类确认 | 暂停编排，输出待确认事项清单，等待人类确认后继续 |
| 所有上游数据全部缺失 | 标注"全数据缺失"状态，输出最小化模板（仅含元信息和空结构），整体置信度设为0.3，强制人类确认是否继续。人类确认后基于用户提供信息和AI知识库推断生成，所有推断内容标注confidence≤0.5和needs_human_validation:true |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 影响力评估校准 | 阶段1 stakeholder-analysis 评估影响力评分 | 人类校准涉及人际判断的最终结果 |
| 战略文档审核 | 阶段1 stakeholder-analysis 组装战略文档 | 人类审核内容准确性和表达方式 |
