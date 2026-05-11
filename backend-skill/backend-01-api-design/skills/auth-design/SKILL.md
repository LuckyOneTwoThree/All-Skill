---
name: auth-design
description: 当需要设计认证鉴权方案时使用。认证鉴权自动设计，为系统设计完整的认证和授权方案，包含用户认证（JWT/OAuth2/SSO）、权限模型（RBAC/ABAC）、多租户隔离和会话管理。关键词：认证、鉴权、JWT、OAuth2、RBAC、ABAC、多租户、SSO。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 14: 认证鉴权自动设计

## 核心原则

1. **认证与授权分离**：认证确认"你是谁"，授权确认"你能做什么"，两者独立设计
2. **最小权限**：默认无权限，显式授权
3. **防御深度**：Token+权限+资源级校验三层防护
4. **可扩展**：权限模型支持业务增长，不因角色膨胀而失控

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 用户角色和权限需求 |
| API契约 | YAML/JSON | 是 | output/backend-api-design/api-contract/openapi.yaml | 需要鉴权的接口清单 |
| 多租户需求 | string | ○ | 用户提供 | 是否需要多租户隔离 |

## 执行步骤

### Step 1: 认证方案设计

根据业务场景选择认证方案：

| 场景 | 推荐方案 | Token策略 |
|------|---------|-----------|
| 单体Web应用 | JWT + Refresh Token | Access Token 15分钟 + Refresh Token 7天 |
| 前后端分离 | JWT + HttpOnly Cookie | Access Token 15分钟 + Refresh Token HttpOnly |
| 移动端 | JWT + Refresh Token | Access Token 30分钟 + Refresh Token 30天 |
| 第三方集成 | OAuth2 Client Credentials | Client ID + Secret |
| 企业内部 | SSO (SAML/OIDC) | 对接企业IdP |

**JWT Payload规范**：
- sub：用户ID
- role：主角色
- org：组织ID（多租户）
- permissions：权限列表（可选，短列表时嵌入）
- iat/exp：签发/过期时间

### Step 2: 权限模型设计

根据角色复杂度选择权限模型：

| 条件 | 推荐模型 | 适用场景 |
|------|---------|---------|
| 角色数≤10且固定 | RBAC（基于角色） | 简单管理系统 |
| 角色数>10或频繁变化 | RBAC + 权限组 | 中等复杂系统 |
| 需要属性级权限控制 | ABAC（基于属性） | 复杂业务规则 |
| 多租户+不同权限包 | RBAC + 租户权限模板 | SaaS平台 |

**RBAC设计**：
```
用户 → 角色 → 权限
  │                │
  └── 租户(可选) ──┘
```

| 角色 | 典型权限 | 数据范围 |
|------|---------|---------|
| super_admin | 全部权限 | 全租户 |
| admin | 管理功能 | 本租户 |
| manager | 业务管理 | 本部门 |
| member | 基础功能 | 本人数据 |
| guest | 只读 | 公开数据 |

### Step 3: 多租户隔离设计

如果需要多租户，设计数据隔离方案：

| 隔离策略 | 实现 | 适用条件 | 成本 |
|----------|------|---------|------|
| 共享数据库+租户ID | 每行加tenant_id字段 | 租户数>100 | 低 |
| Schema隔离 | 每个租户独立Schema | 租户数10-100 | 中 |
| 独立数据库 | 每个租户独立数据库 | 租户数<10 / 高安全 | 高 |

**共享数据库隔离规则**：
- 所有查询强制加 `WHERE tenant_id = ?`
- 中间件自动注入tenant_id
- 跨租户查询必须super_admin权限
- 租户间文件存储隔离（不同目录/桶）

### Step 4: 会话管理设计

设计会话管理策略：

| 策略 | 规范 |
|------|------|
| 并发控制 | 同一账号最多5个活跃会话 |
| 会话超时 | 活跃30分钟无操作→自动过期 |
| 强制下线 | 管理员可强制指定用户下线 |
| Token刷新 | Access Token过期前5分钟自动刷新 |
| Token撤销 | 修改密码/权限变更→旧Token立即失效 |
| 登录日志 | 记录IP/设备/时间/位置 |

### Step 5: 鉴权中间件设计

设计统一的鉴权中间件：

```
请求 → Token解析 → 认证校验 → 权限校验 → 资源校验 → 业务逻辑
         ↓            ↓           ↓           ↓
       401无效Token  401过期     403无权限   403无资源权限
```

**中间件规则**：
- Token校验失败 → 401 + 清除客户端Token
- 权限不足 → 403 + 记录审计日志
- 资源级校验 → 检查数据归属（本人/本部门/本租户）

## 输出

**存储路径**：`output/backend-api-design/auth-design/`

**输出文件**：auth-scheme.json, role-permissions.json

```json
{
  "auth_scheme": {
    "method": "JWT + Refresh Token",
    "access_token_ttl": "15min",
    "refresh_token_ttl": "7d",
    "token_storage": "HttpOnly Cookie + Memory"
  },
  "permission_model": {
    "type": "RBAC",
    "roles": 5,
    "permissions": 32,
    "role_permission_matrix": "role_permissions.json"
  },
  "multi_tenant": {
    "enabled": true,
    "strategy": "shared_db_tenant_id",
    "isolation_level": "row_level"
  },
  "session_management": {
    "max_concurrent": 5,
    "idle_timeout": "30min",
    "force_logout": true
  },
  "middleware": {
    "auth_order": ["token_parse", "auth_verify", "permission_check", "resource_check"],
    "error_responses": { "401": "认证失败", "403": "权限不足" }
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 角色数≤10且固定 | 使用RBAC |
| 角色数>10或频繁变化 | 使用RBAC+权限组 |
| 需要属性级权限（如"只能看本部门数据"） | 使用ABAC |
| 多租户+租户数>100 | 共享数据库+tenant_id |
| 多租户+高安全要求 | Schema隔离或独立数据库 |
| 移动端为主 | Refresh Token TTL=30天 |
| Web端为主 | Refresh Token TTL=7天 + HttpOnly |

## 质量检查

- [ ] 认证方案覆盖全部用户场景（Web/移动/第三方/企业）
- [ ] 权限模型覆盖全部角色和权限
- [ ] 多租户场景下数据隔离策略明确
- [ ] 会话管理包含并发控制+超时+强制下线
- [ ] 鉴权中间件覆盖认证+权限+资源3层校验
- [ ] Token过期和撤销策略完整

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| PRD缺失 | 基于API契约推导角色和权限 | 角色划分可能不准确 |
| 多租户需求不明确 | 默认单租户设计 | 后续需重构为多租户 |
| API契约缺失 | 设计通用认证鉴权方案 | 无法做接口级权限映射 |

数据获取说明：
- 本Skill需要PRD和API契约，请通过以下方式之一提供：
  1. 上传prd.md和openapi.yaml文件
  2. 描述用户角色、权限需求和多租户需求
  3. 提供现有认证系统信息（用于对接）
