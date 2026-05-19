---
name: data-architecture-orchestrator
description: 当需要设计数据模型、规划数据架构或设计缓存迁移方案时使用。数据架构指挥官，协调data-architecture-spec（设计）和data-architecture-impl（实现）两个子Skill的完整流程，确保数据架构合理、可迁移、高性能，设计产出经人类审查后再生成代码。关键词：数据架构、数据模型、数据迁移、缓存策略、数据库设计、数据方案、代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "数据架构"
  type: "orchestrator"
  version: "5.0"
  domain_tags: ["电商", "SaaS", "金融", "物流", "通用"]
  trigger_examples:
    - "设计数据模型"
    - "规划数据架构"
    - "设计缓存策略"
    - "规划数据迁移方案"
---

# 数据架构指挥官

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## 核心原则

数据是系统根基，模型决定上限，缓存决定下限。设计先行，审查后实现。

## 执行步骤

1. **模型先行**：先设计数据模型，再设计缓存和迁移
2. **迁移安全**：每个变更可回滚，数据不丢失
3. **缓存按需**：有性能瓶颈才加缓存，不过度设计
4. **一致性显式**：缓存与数据库的一致性策略显式定义
5. **设计审查**：设计产出必须经人类审查确认后，才进入代码实现

## 编排协议

> 协议源头：[orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md)（仅供维护者追踪，本文件已内联完整协议内容，可独立使用）

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
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

## Pipeline 定义

```yaml
pipeline: data-architecture-orchestrator
version: 5.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/data-architecture-orchestrator.md

stages:
  - id: phase-1
    name: "数据架构设计规范"
    skills:
      - data-architecture-spec
    gate:
      condition: "data-architecture-spec输出文件已生成且非空 + 人类审查通过"
      fail_action: "缺失项必须补充"

  - id: phase-2
    name: "数据层代码实现"
    depends_on: [phase-1]
    skills:
      - data-architecture-impl
    gate:
      condition: "data-architecture-impl输出文件已生成且非空 + 人类确认通过"
      fail_action: "缺失项补充后重新验证"
```

## 阶段执行计划

#### 阶段1：数据架构设计规范

#### 调用 data-architecture-spec

```
Skill: data-architecture-spec
输入:
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  架构方案: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  服务数据归属: output/backend-architecture/backend-architecture-spec/service_data_ownership.json
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  API契约: output/backend-api-design/api-design-spec/openapi.yaml（可选）
  数据量预估: 用户提供（可选）
  并发量预估: 用户提供（可选）
  当前Schema: 用户提供（可选）
输出: output/backend-data-architecture/data-architecture-spec/
验证: ER图+DDL+数据字典+缓存策略+迁移方案完整
模式: 🤖→👤
内部步骤:
  1. 业务数据字典提取：从PRD提取业务数据实体定义
  2. 实体识别与关系建模：按服务数据归属划分ER图
  3. 表结构与索引设计：DDL+索引策略+架构约束适配
  4. 缓存策略设计：多级缓存+穿透/击穿/雪崩防护
  5. 数据迁移方案：迁移+回滚脚本
```

⏸ **设计审查卡口**：ER图+DDL+数据字典+缓存策略+迁移方案完整 → 人类审查设计产出 → 审查通过后进入代码实现

#### 阶段2：数据层代码实现

#### 调用 data-architecture-impl

```
Skill: data-architecture-impl
输入:
  ER模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  缓存策略: output/backend-data-architecture/data-architecture-spec/cache_strategy.json
  迁移方案: output/backend-data-architecture/data-architecture-spec/migration_plan.json（可选）
  API契约: output/backend-api-design/api-design-spec/openapi.yaml（可选，用于API对齐检查）
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  project_dir: 用户提供
  tech_stack: 用户提供（可选，tech_stack_decision.json未提供时使用）
输出: output/backend-data-architecture/data-architecture-impl/ + 代码写入 {project_dir}/src/
验证: 代码可编译，Migration可执行，代码自审P0=0
模式: 🤖→👤
内部步骤:
  1. Model代码生成：models/entities+数据库配置
  2. Migration和种子数据生成：迁移脚本+种子数据
  3. Repository代码生成：CRUD+常用查询
  4. 缓存层代码生成：Redis+CacheRepository
  5. 对齐检查与代码自审：API对齐（可选）+DDL一致性+缓存对齐+N+1检查
  6. 数据层测试代码生成：Model+Repository+Migration测试
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/backend/data-architecture-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/backend-data-architecture/ |
| 总结输出路径 | output/phase-reports/backend/data-architecture-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: api-design-orchestrator（数据模型确定后进入API设计）
  alternatives:
    - target: backend-architecture-orchestrator
      reason: 数据架构需要调整时可能需要重新审视架构方案
      condition: 数据架构设计发现架构约束不合理+需要调整架构方案时
  special_cases:
    - target: data-architecture-spec
      reason: 仅需数据架构设计，无需代码实现
      condition: 仅需设计数据模型和缓存策略，无需完整编排流时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 数据架构设计完成 | data-architecture-spec输出文件已生成且非空 + 人类审查通过 | 缺失项必须补充 |
| 数据层代码实现完成 | data-architecture-impl输出文件已生成且非空 + 人类确认通过 | 缺失项补充后重新验证 |
| 阶段总结已生成 | output/phase-reports/backend/data-architecture-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 数据实体与服务归属确认 | data-architecture-spec执行时 | 确认每个数据实体归属的服务/限界上下文，数据归属与架构方案一致 |
| 范式vs反范式 | data-architecture-spec执行时 | 读写比决定，人类确认平衡点 |
| 分库分表策略 | data-architecture-spec执行时 | 影响成本和复杂度，人类确认 |
| 缓存一致性级别 | data-architecture-spec执行时 | 强一致vs最终一致，人类确认 |
| 迁移执行时间 | data-architecture-spec执行时 | 低峰期窗口，人类确认 |
| 设计审查确认 | data-architecture-spec完成后 | 审查数据架构设计是否满足需求，确认后才进入代码实现 |
| 数据迁移执行确认 | data-architecture-impl输出完成 | 迁移方案和回滚脚本生成完成，人类确认是否执行迁移 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 架构方案缺失 | 默认单体架构，所有实体同一数据库，标注"架构约束待确认" |
| 服务数据归属缺失 | 从PRD推导实体归属，标注"服务归属待确认"，人类确认后补充 |
| PRD数据需求不明确 | 基于服务数据归属推断数据实体，标注"推断值" |
| 数据量预估缺失 | 使用保守估计值，标注"预估待验证" |
| 缓存一致性策略冲突 | 标注冲突项，提供强一致和最终一致双方案，人类决策 |
| 迁移回滚脚本生成失败 | 阻塞迁移执行，必须人工编写回滚脚本 |
| 分库分表策略不确定 | 提供单表+分表双方案对比，人类决策 |
| 设计审查不通过 | 根据人类修改意见调整设计，重新审查 |
| 代码自审P0问题 | 自动修复后重新自审，无法修复则阻塞输出 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 独立使用输入获取策略

### 独立触发场景识别

当本编排器被直接调用（非通过 backend-orchestrator 编排调用）时，视为独立触发场景。典型触发方式：
- 用户直接请求"设计数据模型"或"规划数据架构"
- 作为独立技能被外部系统触发
- 上游编排器未执行，但用户仅需数据架构设计能力

### 必填输入获取策略

| 必填输入 | 优先策略：从output/读取 | 次选策略：从用户对话获取 | 兜底策略：AI知识库推断 |
|----------|------------------------|------------------------|----------------------|
| PRD (prd.md) | 读取 output/pm-design/design-prd/prd.md | 请用户提供PRD文档或口述需求 | 基于用户描述推断需求文档（⚠️低置信度，标注"PRD为AI推断"） |
| PRD结构化数据 (prd.json) | 读取 output/pm-design/design-prd/prd.json | 请用户提供结构化需求 | 从PRD文档提取结构化数据（⚠️低置信度） |
| 架构方案 (architecture_decision.json) | 读取 output/backend-architecture/backend-architecture-spec/architecture_decision.json | 请用户提供架构方案 | 默认单体架构，所有实体同一数据库（⚠️低置信度，标注"架构约束待确认"） |
| 服务数据归属 (service_data_ownership.json) | 读取 output/backend-architecture/backend-architecture-spec/service_data_ownership.json | 请用户提供服务数据归属 | 从PRD推导实体归属（⚠️低置信度，标注"服务归属待确认"） |
| 技术栈决策 (tech_stack_decision.json) | 读取 output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | 请用户提供技术栈决策 | 默认常见技术栈（⚠️低置信度，标注"技术栈待确认"） |
| project_dir | — | 请用户提供项目目录路径 | 无法推断，必须用户提供 |
| tech_stack | — | 请用户提供技术栈 | 读取 tech_stack_decision.json 或默认常见技术栈（⚠️低置信度） |

### 上游编排器自动回溯

当关键必填输入缺失时，按以下优先级建议用户先执行上游编排器：

| 缺失输入 | 建议执行的上游编排器 | 说明 |
|----------|---------------------|------|
| PRD + PRD结构化数据 | pm-design 相关编排器 | PRD是数据架构设计的业务源头，缺失将导致数据实体识别无依据 |
| 架构方案 + 服务数据归属 + 技术栈决策 | backend-architecture-orchestrator | 架构方案决定数据分库策略，服务数据归属决定实体划分，技术栈决定ORM和数据库选型 |

回溯建议输出格式：
```
⚠️ 检测到关键输入缺失，建议先执行上游编排器：
1. [优先] backend-architecture-orchestrator → 产出架构方案、服务数据归属和技术栈决策
2. [推荐] pm-design 相关编排器 → 产出PRD
是否继续使用AI推断值执行？（推断值置信度≤0.3，产出需额外人工审查）
```

### 独立使用门禁

独立触发时，在执行Pipeline前必须通过以下额外检查：

| 门禁项 | 检查内容 | 未通过处理 |
|--------|----------|------------|
| PRD存在性 | prd.md 或等效需求文档可获取 | 阻塞执行，建议用户先执行pm-design编排器或提供PRD |
| 架构方案存在性 | architecture_decision.json 可获取或可推断 | 降级执行，默认单体架构，标注"架构方案缺失，采用默认单体架构" |
| 服务数据归属存在性 | service_data_ownership.json 可获取或可推断 | 降级执行，从PRD推导实体归属，标注"服务归属待确认" |
| 技术栈决策存在性 | tech_stack_decision.json 可获取或可推断 | 降级执行，默认常见技术栈，标注"技术栈待确认" |
| project_dir有效性 | 用户提供有效的项目目录路径 | 阻塞执行，必须用户提供有效的project_dir |
| 输入置信度评估 | 所有必填输入的获取方式已确定，整体置信度≥0.5 | 置信度<0.5时强制人类确认是否继续执行 |

门禁执行顺序：PRD存在性 → project_dir有效性 → 架构方案存在性 → 服务数据归属存在性 → 技术栈决策存在性 → 输入置信度评估
