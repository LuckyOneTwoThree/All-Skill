---
name: api-design-orchestrator
description: 当需要设计API接口、制定接口规范或设计认证鉴权方案时使用。API设计指挥官，协调api-design-spec（设计）和api-design-impl（实现）两个子Skill的完整流程，确保API设计安全合规，设计产出经人类审查后再生成代码。关键词：API设计、接口契约、API安全、认证鉴权、接口设计、API规范、接口文档、代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "orchestrator"
  version: "4.0"
  domain_tags: ["电商", "SaaS", "金融", "通用"]
  trigger_examples:
    - "设计API接口"
    - "制定API规范"
    - "设计认证鉴权方案"
    - "生成接口文档"
---

# API设计指挥官

## 核心原则

契约驱动开发，安全内建而非外挂。设计先行，审查后实现。

## 执行步骤

1. **契约先行**：先设计API契约，前后端基于契约并行开发
2. **安全内建**：安全策略与契约同步设计，不事后补丁
3. **认证鉴权统一**：统一认证方案，不每个接口单独处理
4. **设计审查**：设计产出必须经人类审查确认后，才进入代码实现
5. **版本管理**：API从第一天起就支持版本管理

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/api-design-orchestrator.md
pipeline:
  - stage: api-design-spec
    gate: API契约+安全策略+认证鉴权方案完整 + 人类审查通过
  - stage: api-design-impl
    gate: 代码可编译 + PRD功能点100%覆盖 + 代码自审P0=0 + 人类确认通过
```

## 阶段执行计划

#### 阶段1：API设计规范

#### 调用 api-design-spec

```
Skill: api-design-spec
输入:
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  数据模型: output/backend-data-architecture/data-architecture-spec/er_model.json（可选）
  业务流程: output/pm-design/design-userflow/userflow.json（可选）
  安全等级: 用户提供
  合规要求: 用户提供（可选）
  多租户需求: 用户提供（可选）
  前端页面数据需求: output/ui-frontend/page-builder/pages.json（可选）
输出: output/backend-api-design/api-design-spec/
验证: API契约+安全策略+认证鉴权方案完整，合规检查无P0问题
模式: 🤖→👤
内部步骤:
  1. 资源识别与建模：从PRD识别API资源
  2. 接口与规范设计：设计CRUD接口+错误码+版本策略
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
  前端页面数据需求: output/ui-frontend/page-builder/pages.json（可选）
  project_dir: 用户提供
  tech_stack: 用户提供
输出: output/backend-api-design/api-design-impl/ + 代码写入 {project_dir}/src/
验证: 代码可编译，PRD功能点100%覆盖，前端数据需求100%对应，代码自审P0=0
模式: 🤖→👤
内部步骤:
  1. 代码骨架生成：routes/controllers/validators/types/mappers
  2. Service业务逻辑实现：业务逻辑+事务管理+缓存调用
  3. 中间件和安全实现：认证/限流/CORS/错误处理
  4. 对齐检查与代码自审：PRD对齐+前端对齐+安全自审
  5. API测试代码生成：集成测试骨架
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/backend-api-design/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/backend/api-design-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: data-architecture-orchestrator
    reason: API契约完成后，进入数据架构设计，基于API数据需求设计ER模型和表结构
    input_mapping:
      api_contract: "output/backend-api-design/api-design-spec/ → data-architecture-spec输入"
  alternatives:
    - target: ui-orchestrator
      reason: API契约可供UI前端并行开发消费
      condition: 前后端并行开发模式下
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| API设计规范完成 | api-design-spec输出文件已生成且非空 | 缺失任一项阻塞 |
| 设计审查通过 | 人类审查设计产出并确认 | 人类修改意见反馈后重新设计 |
| API代码实现完成 | api-design-impl输出文件已生成且非空 | 缺失项补充后重新验证 |
| 阶段总结已生成 | output/phase-reports/backend/api-design-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
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

## 变更记录

- v4.0: 拆分api-design为api-design-spec（设计）+api-design-impl（实现），增加设计审查卡口
- v3.0: 新增代码生成能力（routes/controllers/middleware），实现设计+代码双输出模式
- v2.0: 合并api-contract、api-security、auth-design为api-design单一Skill
- v1.0: 初始版本
