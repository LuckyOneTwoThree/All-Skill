---
name: api-design-orchestrator
description: 当需要设计API接口、制定接口规范或设计认证鉴权方案时使用。API设计指挥官，协调api-design-spec（设计）和api-design-impl（实现）两个子Skill的完整流程，确保API设计安全合规，设计产出经人类审查后再生成代码。关键词：API设计、接口契约、API安全、认证鉴权、接口设计、API规范、接口文档、代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "orchestrator"
  version: "5.0"
  domain_tags: ["电商", "SaaS", "金融", "通用"]
  trigger_examples:
    - "设计API接口"
    - "制定API规范"
    - "设计认证鉴权方案"
    - "生成接口文档"
---

# API设计指挥官

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## 核心原则

契约驱动开发，安全内建而非外挂。设计先行，审查后实现。

## 执行步骤

1. **契约先行**：先设计API契约，前后端基于契约并行开发
2. **安全内建**：安全策略与契约同步设计，不事后补丁
3. **认证鉴权统一**：统一认证方案，不每个接口单独处理
4. **设计审查**：设计产出必须经人类审查确认后，才进入代码实现
5. **版本管理**：API从第一天起就支持版本管理

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
pipeline: api-design-orchestrator
version: 5.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/api-design-orchestrator.md

stages:
  - id: phase-1
    name: "API设计规范"
    skills:
      - api-design-spec
    gate:
      condition: "api-design-spec输出文件已生成且非空 + 人类审查通过"
      fail_action: "缺失任一项阻塞"

  - id: phase-2
    name: "API代码实现"
    depends_on: [phase-1]
    skills:
      - api-design-impl
    gate:
      condition: "api-design-impl输出文件已生成且非空 + 人类确认通过"
      fail_action: "缺失项补充后重新验证"
```

## 阶段执行计划

#### 阶段1：API设计规范

#### 调用 api-design-spec

```
Skill: api-design-spec
输入:
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  数据模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  业务数据字典: output/backend-data-architecture/data-architecture-spec/data_dictionary.json（可选）
  架构方案: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  服务设计: output/backend-architecture/backend-architecture-spec/service_design.json
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json（可选）
  业务流程: output/pm-design/design-userflow/userflow.json（可选）
  安全等级: 用户提供
  合规要求: 用户提供（可选）
  多租户需求: 用户提供（可选）
  前端页面数据需求: output/ui-frontend/page-builder/pages.json（可选）
  PRD页面数据需求: output/pm-design/design-prd/prd.json -> pages[].data_requirements（可选）
输出: output/backend-api-design/api-design-spec/
验证: API契约+安全策略+认证鉴权方案完整，合规检查无P0问题
模式: 🤖→👤
内部步骤:
  1. 资源识别与建模：从ER模型直接映射API资源，字段从Model精确投影
  2. 接口与规范设计：设计CRUD接口+错误码+版本策略+服务边界分组
  3. 接口安全设计：L1-L4分级+限流+数据安全
  4. 认证鉴权设计：认证方案+权限模型+会话管理
  5. 合规检查：隐私合规评估
```

⏸ **设计审查卡口**：API契约+安全策略+认证鉴权方案完整 → 人类审查设计产出 → 审查通过后进入代码实现

#### 阶段2：API代码实现

#### 调用 api-design-impl

```
Skill: api-design-impl
输入:
  OpenAPI规范: output/backend-api-design/api-design-spec/openapi.yaml
  安全策略: output/backend-api-design/api-design-spec/security-policy.json
  认证鉴权方案: output/backend-api-design/api-design-spec/auth-scheme.json
  合规检查清单: output/backend-api-design/api-design-spec/compliance-checklist.json（可选）
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  数据模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  数据层实现报告: output/backend-data-architecture/data-architecture-impl/impl-report.json
  前端页面数据需求: output/ui-frontend/page-builder/pages.json（可选）
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json（可选）
  project_dir: 用户提供
  tech_stack: 用户提供（可选，tech_stack_decision.json未提供时使用）
输出: output/backend-api-design/api-design-impl/ + 代码写入 {project_dir}/src/
验证: 代码可编译，PRD功能点100%覆盖，mappers完整实现，Service调用真实Repository，代码自审P0=0
模式: 🤖→👤
内部步骤:
  1. 代码骨架生成：routes/controllers/validators/types/mappers完整实现
  2. Service业务逻辑实现：业务逻辑+事务管理+真实Repository调用（代码可编译）
  3. 中间件和安全实现：认证/限流/CORS/错误处理
  4. 对齐检查与代码自审：PRD对齐+前端对齐+安全自审+Repository调用链验证
  5. API测试代码生成：集成测试骨架
```

### 阶段总结（post_pipeline）

所有子Skill执行完成后，必须生成阶段总结文档，写入 `output/phase-reports/backend/api-design-orchestrator.md`，包含以下6项结构（均不可为空）：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/backend-api-design/ |
| 总结输出路径 | output/phase-reports/backend/api-design-orchestrator.md |
| 审批记录路径 | output/approvals/{orchestrator-name}/{stage-id}.approval.json |

下游衔接:
  primary: backend-architecture-orchestrator（API代码实现完成后进入架构层代码整合和项目组装）
  alternatives:
    - target: ui-orchestrator
      reason: API契约可供UI前端并行开发消费
      condition: 前后端并行开发+需要API契约支撑前端时
    - target: data-architecture-orchestrator
      reason: API设计发现数据模型不满足需求时回溯调整数据架构
      condition: API设计阶段发现ER模型缺失或不完整+需要补充数据架构时
  special_cases:
    - target: api-design-spec
      reason: 仅需API设计规范，无需代码实现
      condition: 仅需设计接口契约，无需完整编排流时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| API设计规范完成 | api-design-spec输出文件已生成且非空 + 人类审查通过 | 缺失任一项阻塞 |
| API代码实现完成 | api-design-impl输出文件已生成且非空 + 人类确认通过 | 缺失项补充后重新验证 |
| 阶段总结已生成 | output/phase-reports/backend/api-design-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| API资源与数据实体映射确认 | api-design-spec执行时 | 确认每个API资源有对应ER模型实体，字段100%有Model字段支撑 |
| API风格选择 | api-design-spec执行时 | RESTful vs GraphQL，人类确认 |
| 安全等级确认 | api-design-spec执行时 | 标准vs高安全，影响限流/加密/审计策略 |
| 权限模型选择 | api-design-spec执行时 | RBAC vs ABAC，影响权限管理复杂度 |
| 多租户策略 | api-design-spec执行时 | 隔离级别影响成本和安全，人类确认 |
| API版本策略确认 | api-design-spec执行时 | 语义化版本vs URL版本，影响兼容性和客户端升级策略 |
| 设计审查确认 | api-design-spec完成后 | 审查API设计是否满足需求，确认后才进入代码实现 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD功能点不明确 | 标注"功能点待确认"，生成TODO接口，人类补充 |
| 数据模型缺失 | 基于PRD推断数据实体，标注"数据模型待确认" |
| API风格争议 | 提供RESTful和GraphQL双方案对比，人类决策 |
| 安全策略冲突 | 标注冲突项，人类决策取舍 |
| 认证方案不兼容 | 提供兼容方案，人类确认 |
| 设计审查不通过 | 根据人类修改意见调整设计，重新审查 |
| 代码自审P0问题 | 自动修复后重新自审，无法修复则阻塞输出 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 独立使用输入获取策略

### 独立触发场景识别

当本编排器被直接调用（非通过 backend-orchestrator 编排调用）时，视为独立触发场景。典型触发方式：
- 用户直接请求"设计API接口"或"制定API规范"
- 作为独立技能被外部系统触发
- 上游编排器未执行，但用户仅需API设计能力

### 必填输入获取策略

| 必填输入 | 优先策略：从output/读取 | 次选策略：从用户对话获取 | 兜底策略：AI知识库推断 |
|----------|------------------------|------------------------|----------------------|
| PRD (prd.md) | 读取 output/pm-design/design-prd/prd.md | 请用户提供PRD文档或口述需求 | 基于用户描述推断需求文档（⚠️低置信度，标注"PRD为AI推断"） |
| PRD结构化数据 (prd.json) | 读取 output/pm-design/design-prd/prd.json | 请用户提供结构化需求 | 从PRD文档提取结构化数据（⚠️低置信度） |
| 数据模型 (er_model.json) | 读取 output/backend-data-architecture/data-architecture-spec/er_model.json | 请用户提供数据模型 | 从PRD推断数据实体和关系（⚠️低置信度，标注"数据模型待确认"） |
| 架构方案 (architecture_decision.json) | 读取 output/backend-architecture/backend-architecture-spec/architecture_decision.json | 请用户提供架构方案 | 默认单体架构（⚠️低置信度，标注"架构方案待确认"） |
| 服务设计 (service_design.json) | 读取 output/backend-architecture/backend-architecture-spec/service_design.json | 请用户提供服务划分 | 默认单服务（⚠️低置信度，标注"服务设计待确认"） |
| 安全等级 | — | 请用户明确安全等级要求 | 默认标准安全等级（⚠️低置信度，标注"安全等级待确认"） |
| project_dir | — | 请用户提供项目目录路径 | 无法推断，必须用户提供 |
| tech_stack | — | 请用户提供技术栈 | 读取 tech_stack_decision.json 或默认常见技术栈（⚠️低置信度） |

### 上游编排器自动回溯

当关键必填输入缺失时，按以下优先级建议用户先执行上游编排器：

| 缺失输入 | 建议执行的上游编排器 | 说明 |
|----------|---------------------|------|
| PRD + PRD结构化数据 | pm-design 相关编排器 | PRD是API设计的业务源头，缺失将导致接口设计无依据 |
| 架构方案 + 服务设计 | backend-architecture-orchestrator | 架构方案决定API的服务边界和通信方式，缺失将导致API设计缺乏架构约束 |
| 数据模型 | data-architecture-orchestrator | ER模型是API资源映射的基础，缺失将导致API资源与数据实体不对齐 |

回溯建议输出格式：
```
⚠️ 检测到关键输入缺失，建议先执行上游编排器：
1. [优先] backend-architecture-orchestrator → 产出架构方案和服务设计
2. [优先] data-architecture-orchestrator → 产出数据模型
3. [推荐] pm-design 相关编排器 → 产出PRD
是否继续使用AI推断值执行？（推断值置信度≤0.3，产出需额外人工审查）
```

### 独立使用门禁

独立触发时，在执行Pipeline前必须通过以下额外检查：

| 门禁项 | 检查内容 | 未通过处理 |
|--------|----------|------------|
| PRD存在性 | prd.md 或等效需求文档可获取 | 阻塞执行，建议用户先执行pm-design编排器或提供PRD |
| 数据模型存在性 | er_model.json 可获取或可推断 | 降级执行，标注"数据模型缺失，API资源映射基于PRD推断" |
| 架构方案存在性 | architecture_decision.json 可获取或可推断 | 降级执行，默认单体架构，标注"架构方案缺失，采用默认单体架构" |
| project_dir有效性 | 用户提供有效的项目目录路径 | 阻塞执行，必须用户提供有效的project_dir |
| 输入置信度评估 | 所有必填输入的获取方式已确定，整体置信度≥0.5 | 置信度<0.5时强制人类确认是否继续执行 |

门禁执行顺序：PRD存在性 → project_dir有效性 → 数据模型存在性 → 架构方案存在性 → 输入置信度评估
