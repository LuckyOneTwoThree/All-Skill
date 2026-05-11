---
name: api-design-orchestrator
description: API设计指挥官。协调api-contract、api-security、auth-design三个子Skill的完整流程，确保API设计安全合规。关键词：API设计、接口契约、API安全、认证鉴权、api-contract、api-security、auth-design。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "orchestrator"
  version: "2.0"
---

# API设计指挥官

## 核心原则

契约驱动开发，安全内建而非外挂。

## 执行步骤

1. **契约先行**：先设计API契约，前后端基于契约并行开发
2. **安全内建**：安全策略与契约同步设计，不事后补丁
3. **认证鉴权统一**：统一认证方案，不每个接口单独处理
4. **版本管理**：API从第一天起就支持版本管理

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：api-contract（API契约设计）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | api-contract |
| 读取定义路径 | `.trae/skills/api-contract/SKILL.md` |
| 输入 | PRD：`output/pm-design/design-prd/prd.md`；数据模型：`output/backend-data-architecture/data-model/er_model.json`（可选）；业务流程：`output/pm-design/design-userflow/userflow.json`（可选） |
| 输出 | `output/backend-api-design/api-contract/`（openapi.yaml、错误码体系、版本策略） |
| 验证 | 每个资源有CRUD定义 + 错误码体系完整 + 版本策略明确 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | API契约人类确认通过后才可进入阶段2 |

### 阶段2：api-security（API安全设计）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | api-security |
| 读取定义路径 | `.trae/skills/api-security/SKILL.md` |
| 输入 | API契约：`output/backend-api-design/api-contract/openapi.yaml`；安全等级（用户提供）；合规要求（用户提供，可选） |
| 输出 | `output/backend-api-design/api-security/`（安全策略：接口分级、限流规则、加密策略、CORS、安全头、输入校验） |
| 验证 | 100%接口有安全级别 + 限流规则覆盖全部接口级别 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | API安全人类确认通过后才可进入阶段3；L4接口无安全策略则阻塞 |

### 阶段3：auth-design（认证鉴权设计）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | auth-design |
| 读取定义路径 | `.trae/skills/auth-design/SKILL.md` |
| 输入 | PRD：`output/pm-design/design-prd/prd.md`；API契约：`output/backend-api-design/api-contract/openapi.yaml`；多租户需求（用户提供，可选） |
| 输出 | `output/backend-api-design/auth-design/`（认证方案、权限模型、多租户隔离、会话管理、鉴权中间件） |
| 验证 | 认证方案 + 权限模型 + 会话管理完整，缺失任一项阻塞 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 认证鉴权方案完整且人类确认通过 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/backend-api-design/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| API契约完成 | 每个资源有CRUD定义+错误码体系 | 缺失接口标注TODO，安全阶段仍可启动 |
| API安全完成 | 100%接口有安全级别+限流规则 | L4接口无安全策略则阻塞 |
| 认证鉴权完成 | 认证方案+权限模型+会话管理完整 | 缺失任一项阻塞 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| API风格选择 | api-contract执行时 | RESTful vs GraphQL，人类确认 |
| 安全等级确认 | api-security执行时 | 标准vs高安全，影响限流/加密/审计策略 |
| 权限模型选择 | auth-design执行时 | RBAC vs ABAC，影响权限管理复杂度 |
| 多租户策略 | auth-design执行时 | 隔离级别影响成本和安全，人类确认 |
| API版本策略确认 | api-contract执行时 | 语义化版本vs URL版本，影响兼容性和客户端升级策略 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD功能点不明确 | 标注"功能点待确认"，生成TODO接口，人类补充 |
| 数据模型缺失 | 基于PRD推断数据实体，标注"数据模型待确认" |
| API风格争议 | 提供RESTful和GraphQL双方案对比，人类决策 |
| 安全策略冲突 | 标注冲突项，人类决策取舍 |
| 认证方案不兼容 | 提供兼容方案，人类确认 |

## 变更记录

- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
