---
name: api-integration
description: 当需要将前端与后端API对接时使用。API集成自动生成，基于API契约自动生成前端请求层代码，包含类型安全的API客户端、请求/响应拦截器、错误处理和Mock数据。关键词：API对接、接口联调、请求层、API客户端、前后端联调、接API、调接口。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "对接后端API"
    - "生成请求层代码"
    - "调接口"
  interaction_mode: "ai_suggest_human_approve"
---

# API集成自动生成

## 核心原则

1. **契约驱动**——API客户端代码从契约自动生成，不手写请求函数。契约缺失时基于页面数据流推断，但推断结果必须人类确认
2. **类型安全**——请求参数和响应类型100%从契约推导，零 any 类型
3. **防御性编程**——每个API调用都有错误处理、超时和重试，错误处理策略分层定义
4. **认证内建**——token管理、刷新、过期处理作为基础设施，不遗漏
5. **开发体验**——Mock数据自动生成，前后端可并行开发，Mock与真实接口一键切换

## 交互模式

🤖 AI建议，人类确认

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| API契约 | YAML/JSON | ○ | output/backend-api-design/api-design-spec/openapi.yaml | OpenAPI 3.0规范（缺失时基于页面数据流推断） |
| 认证鉴权方案 | JSON | ○ | output/backend-api-design/api-design-spec/auth-scheme.json | 后端API认证鉴权设计（JWT/OAuth2/SSO方案、权限模型、会话管理），优先于PRD非功能需求 |
| 安全策略 | JSON | ○ | output/backend-api-design/api-design-spec/security-policy.json | 后端API安全策略（限流规则、CORS策略、数据脱敏规则），用于前端错误处理和安全策略对齐 |
| 页面数据流 | JSON | 是 | output/ui-frontend/page-builder/pages.json | 页面数据获取需求 |
| 目标框架 | string | 是 | 上游编排器传递 | React/Vue/Svelte |
| 目标语言 | string | ○ | 上游编排器传递（默认zh-CN） | 目标界面语言，影响Mock数据和错误提示语言 |
| project_dir | string | 是 | 上游编排器传递 | 项目根目录绝对路径 |
| 认证方案 | string | ○ | PRD非功能需求 / 用户提供 | JWT/OAuth2/Cookie/ApiKey（默认JWT），当auth-scheme.json不可用时使用 |

## 执行步骤

### Step 1: API契约解析与端点规划

**1a. 契约解析**

若有API契约输入：
1. 解析OpenAPI/Swagger规范，提取所有端点（method/path/parameters/requestBody/responses）
2. 提取认证方案（security schemes）
3. 提取通用错误码定义
4. 标注已废弃端点（deprecated）

若API契约缺失：
1. 从pages.json的data_flow字段推断API端点
2. 推断规则：每个data_flow的source对应一个API端点
3. 推断的端点标注 `inferred: true`
4. 生成推断报告，需人类确认

**1b. 端点分类与目录规划**

| 分类规则 | 目录结构 | 示例 |
|---------|---------|------|
| 按领域模块 | src/api/{module}/ | src/api/auth/、src/api/user/、src/api/product/ |
| 公共端点 | src/api/shared/ | 健康检查、配置接口 |
| 端点≤5个 | 单文件 src/api/index.ts | 小型项目不分模块 |

**1c. 认证方案规划**

| 认证类型 | 实现策略 | Token存储 |
|---------|---------|----------|
| JWT | axios拦截器自动注入Authorization头 | localStorage + 内存缓存 |
| OAuth2 | 授权码流程 + PKCE | localStorage + 内存缓存 |
| Cookie | withCredentials配置 | 浏览器自动管理 |
| ApiKey | 请求头/查询参数注入 | 环境变量 |

Token刷新策略：
- 过期前5分钟自动刷新（基于exp claim）
- 刷新失败→跳转登录页
- 并发请求时队列等待刷新完成

### Step 2: API客户端代码生成

**2a. 类型定义生成**

从契约schema推导TypeScript类型：

```typescript
type {Endpoint}Request = { /* 从requestBody推导 */ }
type {Endpoint}Response = { /* 从200响应schema推导 */ }
type {Endpoint}Error = { /* 从4xx/5xx响应schema推导 */ }

type ApiResponse<T> = { code: number; data: T; message: string }
type PaginatedResponse<T> = { items: T[]; total: number; page: number; page_size: number }
```

**2b. 请求函数生成**

每个端点生成一个请求函数：

```typescript
export async function {endpointName}(params: {Endpoint}Request, config?: RequestConfig): Promise<{Endpoint}Response> {
  return request.{method}<{Endpoint}Response>('{path}', params, config)
}
```

生成规则：
- GET请求参数映射为查询参数
- POST/PUT/PATCH请求参数映射为请求体
- Path参数（如 /users/{id}）从params中提取
- 每个函数包含JSDoc注释（从契约的description/summary提取）

**2c. 请求层基础设施**

| 基础设施 | 实现内容 |
|---------|---------|
| HTTP客户端 | axios实例（React/Vue）或fetch封装（Svelte） |
| 请求拦截器 | token注入 + 请求ID + 时间戳 + 请求体序列化 |
| 响应拦截器 | 统一错误处理 + token过期自动刷新 + 响应解包 |
| 错误处理 | 网络错误/超时(10s)/业务错误/认证过期 分级处理 |
| 重试策略 | 网络错误和5xx重试2次，指数退避(1s/2s) |
| 取消机制 | AbortController封装，页面卸载自动取消 |
| 请求去重 | 相同URL+参数的并发请求合并 |

**2d. 错误处理策略**

| 错误类型 | 处理方式 | 用户反馈 |
|---------|---------|---------|
| 网络错误 | 重试2次→提示网络异常 | "网络连接异常，请检查网络后重试" |
| 超时(>10s) | 重试1次→提示响应超时 | "请求超时，请稍后重试" |
| 401未授权 | 尝试刷新token→跳转登录 | 自动跳转登录页 |
| 403禁止 | 提示无权限 | "您没有权限执行此操作" |
| 404不存在 | 提示资源不存在 | "请求的资源不存在" |
| 422验证失败 | 提取字段错误 | 显示具体字段错误信息 |
| 429限流 | 等待后重试 | "操作过于频繁，请稍后重试" |
| 5xx服务错误 | 重试2次→提示服务异常 | "服务异常，请稍后重试" |

### Step 3: Mock数据与并行开发

**3a. Mock数据生成**

从契约的response schema生成Mock数据：
- string类型：根据字段名推断内容（name→"张三"，email→"test@example.com"）
- number类型：根据范围约束生成，无约束时使用合理默认值
- array类型：生成3-5条数据
- 嵌套对象：递归生成
- enum类型：随机选择一个值
- 目标语言≠en-US时Mock数据使用目标语言内容

**3b. Mock切换机制**

```typescript
export const useMock = import.meta.env.VITE_API_MOCK === 'true'

export async function getUser(id: string) {
  if (useMock) return mockData.user
  return request.get(`/users/${id}`)
}
```

**3c. MSW集成（推荐）**

生成MSW（Mock Service Worker）handler：
- 每个端点一个handler
- 支持请求参数匹配
- 支持延迟模拟（200-500ms随机延迟）
- 支持错误场景模拟（5%概率返回500错误）

### Step 4: 数据层对接与缓存策略

**4a. 数据预加载配置**

| 框架 | 方案 | 配置 |
|------|------|------|
| React | React Query (TanStack Query) | staleTime/cacheTime/refetchOnWindowFocus |
| Vue | Vue Query (TanStack Query) | staleTime/cacheTime/refetchOnWindowFocus |
| Svelte | svelte-query | staleTime/cacheTime/refetchOnWindowFocus |

**4b. 缓存策略**

| 数据类型 | staleTime | cacheTime | refetch策略 |
|---------|-----------|-----------|------------|
| 用户信息 | 5min | 30min | 窗口聚焦 |
| 列表数据 | 2min | 10min | 窗口聚焦 |
| 详情数据 | 10min | 30min | 不自动刷新 |
| 配置数据 | 30min | 60min | 不自动刷新 |
| 实时数据 | 0 | 5min | 轮询(5s) |

**4c. 乐观更新配置**

对写操作（POST/PUT/PATCH）生成乐观更新配置：
- 更新操作：立即更新缓存，失败后回滚
- 删除操作：立即从缓存移除，失败后恢复
- 创建操作：立即添加到缓存（临时ID），成功后替换为真实ID

**4d. 与page-builder fallback数据层替换**

当api-integration执行时，替换page-builder生成的fallback数据层：
1. 定位所有标注 `@api-integration` 的文件
2. 用api-integration生成的请求函数替换fallback函数
3. 保持函数签名一致（page-builder的fallback签名与api-integration的请求函数签名对齐）
4. 删除不再需要的mock数据文件
5. 验证替换后页面功能正常

## 输出

**代码文件输出**：{project_dir}/src/api/（API客户端、类型定义、Mock数据直接写入项目目录）

**元数据输出**：output/ui-frontend-integration/api-integration/

**输出文件**：api-integration.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["endpoints", "types", "mock_data", "auth_config", "cache_config", "error_handling", "project_dir"],
  "properties": {
    "endpoints": {
      "type": "array",
      "description": "API端点列表",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "函数名"},
          "method": {"type": "string", "enum": ["GET","POST","PUT","PATCH","DELETE"]},
          "path": {"type": "string", "description": "API路径"},
          "request_type": {"type": "string", "description": "请求类型名"},
          "response_type": {"type": "string", "description": "响应类型名"},
          "module": {"type": "string", "description": "所属模块"},
          "inferred": {"type": "boolean", "description": "是否为推断端点"},
          "deprecated": {"type": "boolean", "description": "是否已废弃"}
        }
      }
    },
    "types": {
      "type": "array",
      "description": "TypeScript类型定义文件列表",
      "items": {
        "type": "object",
        "properties": {
          "file_path": {"type": "string", "description": "类型文件路径"},
          "type_count": {"type": "number", "description": "定义的类型数量"},
          "endpoints_covered": {"type": "array", "description": "覆盖的端点列表"}
        }
      }
    },
    "mock_data": {
      "type": "array",
      "description": "Mock数据文件列表",
      "items": {
        "type": "object",
        "properties": {
          "file_path": {"type": "string", "description": "Mock数据文件路径"},
          "endpoint": {"type": "string", "description": "对应端点"},
          "record_count": {"type": "number", "description": "Mock数据条数"}
        }
      }
    },
    "auth_config": {
      "type": "object",
      "description": "认证配置",
      "properties": {
        "type": {"type": "string", "enum": ["JWT","OAuth2","Cookie","ApiKey","None"]},
        "token_storage": {"type": "string", "description": "Token存储方式"},
        "refresh_enabled": {"type": "boolean", "description": "是否启用自动刷新"},
        "login_redirect": {"type": "string", "description": "未授权跳转路径"}
      }
    },
    "cache_config": {
      "type": "object",
      "description": "缓存策略配置",
      "properties": {
        "library": {"type": "string", "description": "数据请求库"},
        "strategies": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "data_type": {"type": "string", "description": "数据类型（user_info/list_data/detail_data/config_data/realtime_data）"},
              "stale_time": {"type": "string", "description": "数据新鲜时间"},
              "cache_time": {"type": "string", "description": "缓存保留时间"},
              "refetch_strategy": {"type": "string", "description": "重新获取策略（window_focus/polling/none）"}
            }
          }
        }
      }
    },
    "error_handling": {
      "type": "object",
      "description": "错误处理配置",
      "properties": {
        "timeout_ms": {"type": "number", "description": "请求超时时间(ms)"},
        "retry_count": {"type": "number", "description": "重试次数"},
        "retry_delay_ms": {"type": "number", "description": "重试延迟(ms)"},
        "error_codes_mapped": {"type": "number", "description": "已映射的错误码数量"},
        "error_strategies": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "error_type": {"type": "string", "description": "错误类型（network/timeout/401/403/404/422/429/5xx）"},
              "handling": {"type": "string", "description": "处理方式"},
              "user_feedback": {"type": "string", "description": "用户反馈文案"}
            }
          }
        }
      }
    },
    "project_dir": {"type": "string", "description": "项目根目录路径"}
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 目标框架=React | 使用React Query + axios |
| 目标框架=Vue | 使用Vue Query + axios |
| 目标框架=Svelte | 使用svelte-query + fetch封装 |
| API端点>20个 | 按领域模块分文件 |
| 有分页接口 | 生成通用分页Hook |
| 有文件上传接口 | 生成进度回调封装 |
| 目标语言≠en-US | Mock数据使用目标语言内容 |
| 认证方案=JWT | 自动生成token刷新拦截器 |
| 认证方案缺失 | 默认JWT，标注"待确认认证方案" |
| 推断端点>50% | 标注"高推断比例，建议补充API契约" |

## 质量检查

**P0（必须通过，不通过则阻断输出）**：
- [ ] 100%的API端点有对应的请求函数
- [ ] 100%的请求参数和响应有TypeScript类型（零any）
- [ ] 认证方案已配置（token注入+刷新+过期处理）
- [ ] 拦截器配置完整（token注入+错误处理+响应解包）
- [ ] API代码质量审计≥70分（由编排器调用ext-impeccable audit）

**P1（建议通过，不通过则标注"待修复"）**：
- [ ] 每个API调用有错误处理和超时配置
- [ ] Mock数据覆盖所有端点
- [ ] 缓存策略已配置（至少3种数据类型）
- [ ] 乐观更新已配置（写操作）
- [ ] 推断端点已人类确认

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| API契约缺失 | 基于页面数据流推断API需求，推断端点标注inferred:true | API函数为骨架，需人类确认后补充契约细节 |
| 页面数据流缺失 | 为所有API端点生成独立函数，无页面级预加载 | 缺少页面级数据预加载和缓存配置 |
| 认证方案缺失 | 默认JWT方案，标注"待确认认证方案" | token刷新逻辑可能需调整 |
| 安全策略缺失 | 跳过安全策略对齐，标注"待安全策略补充" | CORS/限流等前端安全策略未对齐 |
| project_dir缺失 | 仅输出到output/目录 | 代码需手动复制 |

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| API契约变更（端点增删/参数变更/响应结构变更/认证方案变更） | 请求函数、类型定义、Mock数据、认证配置 | 标注受影响的端点和类型，建议重新生成对应请求函数、Mock数据和认证拦截器 |
| 页面数据流变更（数据获取方式/缓存策略变更） | 数据预加载配置、缓存策略、请求去重 | 标注受影响的页面数据流，建议更新React Query/Vue Query/svelte-query配置 |
| 目标框架变更 | 请求层技术选型（React Query/Vue Query/svelte-query） | 标注需替换的数据请求层方案，建议重新生成 |
| 认证方案变更 | token注入/刷新/过期处理逻辑 | 标注需替换的认证拦截器，建议重新生成认证基础设施 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| API端点增删 | production-ready | 受影响的测试和构建配置 | endpoints列表变更 |
| 类型定义变更 | production-ready | 受影响的类型相关测试 | types结构变更 |
| Mock数据变更 | production-ready | 受影响的测试Mock | mock_data文件变更 |
| 请求层技术选型变更 | production-ready | 依赖和构建配置变更 | 目标框架或请求库变更 |
| 认证配置变更 | production-ready | 认证相关测试和依赖变更 | auth_config变更 |
| 缓存策略变更 | production-ready | 数据层相关测试变更 | cache_config变更 |
| 错误处理变更 | production-ready | 错误处理相关测试变更 | error_handling变更 |

## 变更记录

- v2.0: 全面重构——4步骤替代3步骤；增加认证方案/错误处理策略/缓存策略；ext-impeccable audit/critique调用迁移到编排器统一调度；输出Schema细化；质量检查P0/P1分级；交互模式改为ai_suggest_human_approve
- v1.1: 补充上游变更响应和下游通知机制
- v1.0: 基于api-contract-consume调整
