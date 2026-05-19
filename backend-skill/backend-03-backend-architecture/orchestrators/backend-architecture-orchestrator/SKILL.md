---
name: backend-architecture-orchestrator
description: 当需要设计后端架构、选择架构模式或进行架构审查时使用。后端架构指挥官，协调backend-architecture-spec（设计）和backend-architecture-impl（实现）两个子Skill的完整流程，确保后端架构合理、可扩展、高质量，设计产出经人类审查后再生成代码。关键词：后端架构、架构模式、服务设计、架构审查、技术架构、微服务、系统架构、代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "orchestrator"
  version: "5.0"
  domain_tags: ["电商", "SaaS", "金融", "通用"]
  trigger_examples:
    - "设计后端架构"
    - "选择架构模式"
    - "设计微服务"
    - "做一下架构审查"
---

# 后端架构指挥官

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## 核心原则

架构服务于业务，简单方案优先，按需演进。设计先行，审查后实现。

## 执行步骤

1. **模式先行**：先确定架构模式，再设计服务
2. **领域驱动**：服务边界由业务领域决定
3. **审查闭环**：审查不通过则回退修复
4. **演进式**：从简单开始，按需演进
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
pipeline: backend-architecture-orchestrator
version: 5.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/backend-architecture-orchestrator.md

stages:
  - id: phase-1
    name: "后端架构设计规范"
    skills:
      - backend-architecture-spec
    gate:
      condition: "backend-architecture-spec输出文件已生成且非空 + 人类审查通过"
      fail_action: "P0问题必须修复后才能通过"

  - id: phase-2
    name: "后端架构代码实现"
    depends_on: [phase-1]
    skills:
      - backend-architecture-impl
    gate:
      condition: "backend-architecture-impl输出文件已生成且非空 + 人类确认通过"
      fail_action: "缺失项补充后重新验证"
```

## 阶段执行计划

#### 阶段1：后端架构设计规范

#### 调用 backend-architecture-spec

```
Skill: backend-architecture-spec
输入:
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  业务规模: 用户提供
  技术约束: 用户提供（可选）
输出: output/backend-architecture/backend-architecture-spec/
关键产出:
  - architecture_decision.json — 架构方案+拓扑图
  - service_design.json — 服务划分+限界上下文
  - service_data_ownership.json — 服务数据归属（供data-architecture-spec消费）
  - tech_stack_decision.json — 技术栈决策（供所有impl Skill统一消费）
  - adr.json — 架构决策记录
  - review_report.json — 审查问题清单
  - tech_debt_register.json — 技术债登记册
验证: 架构模式+ADR+服务设计+服务数据归属+技术栈决策完整，P0问题=0
模式: 🤖→👤
内部步骤:
  1. 架构模式评估与选择：单体/微服务/Serverless，生成拓扑图
  2. 架构决策记录：为每个决策生成ADR
  3. 服务设计：DDD限界上下文+服务拆分+通信方案+服务数据归属
  4. 后端审查：性能/安全/可维护/可扩展审查
  5. 技术债登记：识别和登记技术债
```

⏸ **设计审查卡口**：架构模式+服务设计+审查报告+技术债登记完整 + P0问题=0 → 人类审查设计产出 → 审查通过后进入代码实现

#### 阶段2：后端架构代码实现

#### 调用 backend-architecture-impl

```
Skill: backend-architecture-impl
输入:
  架构方案: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  服务设计: output/backend-architecture/backend-architecture-spec/service_design.json
  ADR: output/backend-architecture/backend-architecture-spec/adr.json
  审查报告: output/backend-architecture/backend-architecture-spec/review_report.json（可选）
  技术债登记册: output/backend-architecture/backend-architecture-spec/tech_debt_register.json（可选）
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json（可选）
  API契约: output/backend-api-design/api-design-spec/openapi.yaml
  数据模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  缓存策略: output/backend-data-architecture/data-architecture-spec/cache_strategy.json（可选）
  project_dir: 用户提供
  tech_stack: 用户提供（可选，tech_stack_decision.json未提供时使用）
输出: output/backend-architecture/backend-architecture-impl/ + 代码写入 {project_dir}/
验证: 项目可启动，/health返回200，架构决策100%在代码中体现，统一对齐检查通过，代码自审P0=0
模式: 🤖→👤
内部步骤:
  1. 项目入口和配置生成：app.ts+config（整合api-design-impl路由+data-architecture-impl数据库/缓存）
  2. 服务层和通信层生成：services+clients
  3. 基础设施代码生成：errors+logger+health
  4. 容器化和CI/CD生成：Docker+CI+package.json
  5. 架构对齐检查与代码自审：app.ts整合+Service对齐+配置多环境+Docker可构建+CI完整+统一对齐检查
  6. 架构测试代码生成：健康检查+契约测试+构建验证测试
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/backend/backend-architecture-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/backend-architecture/ |
| 总结输出路径 | output/phase-reports/backend/backend-architecture-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: data-architecture-orchestrator（架构方案确定后进入数据架构设计）
  alternatives:
    - target: release-orchestrator
      reason: 架构实现完成后进入质量验收和发布
      condition: 仅执行架构模块+无需数据层和API层时
    - target: ui-orchestrator
      reason: 后端就绪后启动UI前端开发与集成
      condition: 前端尚未开发+需要后端API支撑时
  special_cases:
    - target: backend-architecture-spec
      reason: 仅需架构设计评估，无需代码实现
      condition: 仅需评估架构模式和服务设计，无需完整编排流时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 后端架构设计完成 | backend-architecture-spec输出文件已生成且非空 + 人类审查通过 | P0问题必须修复后才能通过 |
| 后端架构代码实现完成 | backend-architecture-impl输出文件已生成且非空 + 人类确认通过 | 缺失项补充后重新验证 |
| 阶段总结已生成 | output/phase-reports/backend/backend-architecture-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 架构模式选择 | backend-architecture-spec执行时 | 单体/微服务/Serverless，人类最终确认 |
| 服务拆分粒度 | backend-architecture-spec执行时 | 拆分过细增加复杂度，拆分过粗失去灵活性 |
| 技术栈确认 | backend-architecture-spec执行时 | 确认统一技术栈决策，影响后续所有实现 |
| 服务数据归属确认 | backend-architecture-spec执行时 | 确认每个服务拥有的数据实体，影响数据架构设计 |
| 演进节奏 | backend-architecture-spec执行时 | 何时从单体演进到微服务，人类决定 |
| P1问题处理 | backend-architecture-spec执行时 | 修复还是接受为技术债务 |
| 设计审查确认 | backend-architecture-spec完成后 | 审查架构设计是否满足需求，确认后才进入代码实现 |
| 架构就绪确认 | backend-architecture-impl审查通过后 | 代码实现完成，人类确认架构可进入开发 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD缺失 | 无法设计架构，输出为空 |
| 业务规模未指定 | 默认中等规模（用户量1万，QPS 100，数据量10GB，团队5人），标注"规模待确认" |
| 架构模式争议 | 提供单体+微服务双方案对比，人类决策 |
| 服务循环依赖 | 自动检测并告警，必须消除后才能进入审查 |
| 审查P0问题 | 必须修复后才能通过设计审查 |
| 设计审查不通过 | 根据人类修改意见调整设计，重新审查 |
| 代码自审P0问题 | 自动修复后重新自审，无法修复则阻塞输出 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 独立使用输入获取策略

### 独立触发场景识别

当本编排器被直接调用（非通过 backend-orchestrator 编排调用）时，视为独立触发场景。典型触发方式：
- 用户直接请求"设计后端架构"或"选择架构模式"
- 作为独立技能被外部系统触发
- 上游编排器未执行，但用户仅需后端架构设计能力

### 必填输入获取策略

| 必填输入 | 优先策略：从output/读取 | 次选策略：从用户对话获取 | 兜底策略：AI知识库推断 |
|----------|------------------------|------------------------|----------------------|
| PRD (prd.md) | 读取 output/pm-design/design-prd/prd.md | 请用户提供PRD文档或口述需求 | 基于用户描述推断需求文档（⚠️低置信度，标注"PRD为AI推断"） |
| PRD结构化数据 (prd.json) | 读取 output/pm-design/design-prd/prd.json | 请用户提供结构化需求 | 从PRD文档提取结构化数据（⚠️低置信度） |
| 业务规模 | — | 请用户提供业务规模（用户量、QPS、数据量、团队规模） | 默认中等规模：用户量1万，QPS 100，数据量10GB，团队5人（⚠️低置信度，标注"规模待确认"） |
| project_dir | — | 请用户提供项目目录路径 | 无法推断，必须用户提供 |
| tech_stack | — | 请用户提供技术栈 | 默认常见技术栈（⚠️低置信度，标注"技术栈待确认"） |

### 上游编排器自动回溯

当关键必填输入缺失时，按以下优先级建议用户先执行上游编排器：

| 缺失输入 | 建议执行的上游编排器 | 说明 |
|----------|---------------------|------|
| PRD + PRD结构化数据 | pm-design 相关编排器 | PRD是架构设计的业务依据，缺失将导致架构模式选择和服务拆分无业务基础 |

回溯建议输出格式：
```
⚠️ 检测到关键输入缺失，建议先执行上游编排器：
1. [优先] pm-design 相关编排器 → 产出PRD
是否继续使用AI推断值执行？（推断值置信度≤0.3，产出需额外人工审查）
```

### 独立使用门禁

独立触发时，在执行Pipeline前必须通过以下额外检查：

| 门禁项 | 检查内容 | 未通过处理 |
|--------|----------|------------|
| PRD存在性 | prd.md 或等效需求文档可获取 | 阻塞执行，建议用户先执行pm-design编排器或提供PRD |
| 业务规模明确性 | 业务规模参数已获取 | 降级执行，使用默认中等规模，标注"规模待确认" |
| project_dir有效性 | 用户提供有效的项目目录路径 | 阻塞执行，必须用户提供有效的project_dir |
| 输入置信度评估 | 所有必填输入的获取方式已确定，整体置信度≥0.5 | 置信度<0.5时强制人类确认是否继续执行 |

门禁执行顺序：PRD存在性 → project_dir有效性 → 业务规模明确性 → 输入置信度评估
