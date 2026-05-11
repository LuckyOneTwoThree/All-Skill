---
name: api-design-orchestrator
description: API设计指挥官。协调API契约设计、API安全和认证鉴权的完整流程，确保API设计安全合规。关键词：API设计、接口契约、API安全、认证鉴权。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "orchestrator"
  version: "1.0"
---

# API设计指挥官

## 核心原则

契约驱动开发，安全内建而非外挂。

## 执行步骤

1. **契约先行**：先设计API契约，前后端基于契约并行开发
2. **安全内建**：安全策略与契约同步设计，不事后补丁
3. **认证鉴权统一**：统一认证方案，不每个接口单独处理
4. **版本管理**：API从第一天起就支持版本管理

## 任务调度

```
api-contract → api-security → auth-design
```

| 阶段 | 任务 | 执行模式 |
|------|------|----------|
| 1 | api-contract | 🤖→👤 AI建议，人类审批 |
| 2 | api-security | 🤖→👤 AI建议，人类审批 |
| 3 | auth-design | 🤖→👤 AI建议，人类审批 |

### 数据流转

```
[PRD + 数据模型 + 业务流程]
       ↓
api-contract
       ↓ openapi.yaml (resources / endpoints / schemas / error_codes / versioning)
api-security
       ↓ security_policy (interface_levels / rate_limiting / encryption / input_validation / cors / security_headers)
auth-design
       ↓ auth_scheme (authentication: JWT / OAuth2 / SSO / authorization: RBAC / ABAC / multi_tenant / session_management)
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| PRD+数据模型就绪 | → api-contract（API契约设计） |
| API契约人类确认完成 | → api-security（API安全设计） |
| API安全人类确认完成 | → auth-design（认证鉴权设计） |
| API契约需调整 | → api-contract（增量更新契约） |
| 安全等级变更 | → api-security（重新评估安全策略） |

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/backend-api-design/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| API契约完成 | 每个资源有CRUD定义+错误码体系 | 缺失接口标注TODO，安全阶段仍可启动 |
| API安全完成 | 100%接口有安全级别+限流规则 | L4接口无安全策略则阻塞 |
| 认证鉴权完成 | 认证方案+权限模型+会话管理完整 | 缺失任一项阻塞 |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| API风格选择 | RESTful vs GraphQL，人类确认 |
| 安全等级确认 | 标准vs高安全，影响限流/加密/审计策略 |
| 权限模型选择 | RBAC vs ABAC，影响权限管理复杂度 |
| 多租户策略 | 隔离级别影响成本和安全，人类确认 |
| API版本策略确认 | 语义化版本vsURL版本，影响兼容性和客户端升级策略 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD功能点不明确 | 标注"功能点待确认"，生成TODO接口，人类补充 |
| 数据模型缺失 | 基于PRD推断数据实体，标注"数据模型待确认" |
| API风格争议 | 提供RESTful和GraphQL双方案对比，人类决策 |
| 安全策略冲突 | 标注冲突项，人类决策取舍 |
| 认证方案不兼容 | 提供兼容方案，人类确认 |
