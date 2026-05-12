---
name: api-design-orchestrator
description: API设计指挥官。协调api-contract、api-security、auth-design三个子Skill的完整流程，确保API设计安全合规。关键词：API设计、接口契约、API安全、认证鉴权、api-contract、api-security、auth-design。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "orchestrator"
  version: "3.0"
---

# API设计指挥官

## 核心原则

契约驱动开发，安全内建而非外挂。

## 执行步骤

1. **契约先行**：先设计API契约，前后端基于契约并行开发
2. **安全内建**：安全策略与契约同步设计，不事后补丁
3. **认证鉴权统一**：统一认证方案，不每个接口单独处理
4. **版本管理**：API从第一天起就支持版本管理

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/backend/api-design-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/backend-api-design/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/backend/api-design-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: api-contract
    gate: 每个资源有CRUD定义 + 错误码体系完整 + 版本策略明确 + 人类确认通过
  - stage: api-security
    depends_on: [api-contract]
    parallel: true
    gate: 100%接口有安全级别 + 限流规则覆盖全部接口级别 + 人类确认通过
  - stage: auth-design
    depends_on: [api-contract]
    parallel: true
    gate: 认证方案 + 权限模型 + 会话管理完整 + 人类确认通过
```

## 阶段执行计划

#### 调用 api-contract

```
Skill: api-contract
输入:
  PRD: output/pm-design/design-prd/prd.md
  数据模型: output/backend-data-architecture/data-model/er_model.json（可选）
  业务流程: output/pm-design/design-userflow/userflow.json（可选）
输出: output/backend-api-design/api-contract/
验证: 每个资源有CRUD定义 + 错误码体系完整 + 版本策略明确
模式: 🤖→👤
```

#### 调用 api-security

```
Skill: api-security
输入:
  API契约: output/backend-api-design/api-contract/openapi.yaml
  安全等级: 用户提供
  合规要求: 用户提供（可选）
输出: output/backend-api-design/api-security/
验证: 100%接口有安全级别 + 限流规则覆盖全部接口级别
模式: 🤖→👤
```

#### 调用 auth-design

```
Skill: auth-design
输入:
  PRD: output/pm-design/design-prd/prd.md
  API契约: output/backend-api-design/api-contract/openapi.yaml
  多租户需求: 用户提供（可选）
输出: output/backend-api-design/auth-design/
验证: 认证方案 + 权限模型 + 会话管理完整，缺失任一项阻塞
模式: 🤖→👤
```

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

- v3.0: 统一优化为编排协议+Pipeline定义+调用指令格式
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
