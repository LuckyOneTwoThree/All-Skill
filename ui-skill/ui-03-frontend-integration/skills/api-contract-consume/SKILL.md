---
name: api-contract-consume
description: 当需要基于API契约生成前端请求层代码时使用。API契约消费自动生成，基于OpenAPI/Swagger文档，自动生成前端请求层代码、TypeScript类型定义、Mock数据和接口调用Hook，实现前后端契约驱动开发。关键词：API契约、OpenAPI、请求层、类型定义、Mock数据、前后端联调。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 9: API契约消费自动生成

## 核心原则

1. **契约驱动**：前端代码由API契约自动生成，而非手写请求层
2. **类型安全**：请求参数和响应数据100%有TypeScript类型定义
3. **Mock先行**：后端未就绪时使用Mock数据开发，接口就绪后无缝切换
4. **错误标准化**：统一的错误处理和重试策略

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| API契约文档 | YAML/JSON | 是 | output/backend-api-design/api-contract/openapi.yaml | OpenAPI 3.0规范文档 |
| 页面数据需求 | JSON | 是 | output/ui-frontend/page-assembly | 页面需要的API接口清单 |
| 目标框架 | string | 是 | 用户提供 | React / Vue / Svelte |
| 设计令牌 | JSON | ○ | output/ui-design-system/design-token/tokens.json | 设计变量，用于生成带令牌引用的错误/加载状态UI |

## 执行步骤

### Step 1: 契约解析与校验

解析OpenAPI文档并校验完整性：

| 校验项 | 通过标准 |
|--------|---------|
| 接口定义 | 每个接口有method+path+summary |
| 请求参数 | 参数有name+type+required+description |
| 响应定义 | 200响应有schema定义 |
| 错误定义 | 4xx/5xx响应有统一错误格式 |
| 鉴权定义 | securitySchemes已定义 |

### Step 2: TypeScript类型生成

从OpenAPI Schema生成TypeScript类型：

- **请求参数类型**：Path params / Query params / Request body
- **响应数据类型**：Success response / Error response
- **枚举类型**：API中定义的enum
- **通用类型**：分页参数 / 排序参数 / 错误响应

**类型命名规范**：
- 请求参数：`{OperationId}Request`
- 响应数据：`{OperationId}Response`
- 错误响应：`ApiErrorResponse`

### Step 3: 请求层代码生成

生成统一的请求层代码：

| 生成内容 | 规范 |
|----------|------|
| HTTP客户端 | 基于axios/fetch封装，统一baseURL/超时/拦截器 |
| 请求函数 | 每个API接口一个函数，类型安全 |
| 鉴权注入 | 请求拦截器自动注入Token |
| 错误处理 | 响应拦截器统一处理401/403/500，错误提示样式引用design-token |
| 重试策略 | 网络错误自动重试1次，5xx重试2次（指数退避） |
| 取消请求 | 支持AbortController取消 |

### Step 4: React Hook / Vue Composable生成

为每个API接口生成数据请求Hook：

- **useQuery Hook**：GET请求，自动缓存+SWR+轮询
- **useMutation Hook**：POST/PUT/DELETE请求，乐观更新
- **useInfiniteQuery Hook**：分页加载，无限滚动
- **参数校验**：Hook内部校验必填参数

### Step 5: Mock数据生成

基于API Schema生成Mock数据：

- 字符串类型 → 有意义的中文内容（非lorem ipsum）
- 数字类型 → 符合业务范围的数值
- 日期类型 → 近期日期
- 枚举类型 → 随机枚举值
- 数组类型 → 3-5条数据
- 嵌套对象 → 递归生成

**Mock模式**：
- MSW（Mock Service Worker）拦截网络请求
- 开发环境自动启用，生产环境自动禁用
- 接口就绪后逐个切换为真实接口

## 输出

**存储路径**：`output/ui-frontend-integration/api-contract-consume/`

**输出文件**：api-client-config.json

```json
{
  "api_metadata": {
    "source": "openapi.yaml",
    "version": "1.0.0",
    "total_endpoints": 25,
    "generated_types": 42,
    "generated_hooks": 25
  },
  "files": [
    { "path": "api/client.ts", "type": "http_client", "description": "HTTP客户端封装" },
    { "path": "api/types.ts", "type": "types", "description": "TypeScript类型定义" },
    { "path": "api/endpoints/course.ts", "type": "endpoint", "description": "课程相关接口" },
    { "path": "api/hooks/useCourse.ts", "type": "hook", "description": "课程数据Hook" },
    { "path": "api/mocks/course.mock.ts", "type": "mock", "description": "课程Mock数据" },
    { "path": "api/mocks/handlers.ts", "type": "mock_handler", "description": "MSW请求处理器" }
  ],
  "endpoint_example": {
    "method": "GET",
    "path": "/api/v1/courses",
    "request_type": "GetCoursesRequest",
    "response_type": "GetCoursesResponse",
    "hook": "useCourses",
    "mock_available": true
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| API契约校验不通过 | 标注缺失项，生成部分代码，缺失部分用TODO标记 |
| 接口无错误响应定义 | 使用通用ApiErrorResponse，标注"待后端补充错误码" |
| GET接口返回列表数据 | 生成useQuery + useInfiniteQuery两个Hook |
| POST/PUT/DELETE接口 | 生成useMutation Hook + 乐观更新配置 |
| 接口需要鉴权 | 自动注入鉴权Header，401时跳转登录 |
| 分页接口 | 生成标准分页参数类型 + 无限滚动Hook |

## 质量检查

- [ ] 100%的API接口有TypeScript类型定义
- [ ] 100%的API接口有请求函数
- [ ] 100%的API接口有Mock数据
- [ ] 错误处理覆盖401/403/500/网络错误
- [ ] 鉴权Token自动注入
- [ ] Mock模式可一键切换为真实接口

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| API契约缺失 | 基于页面数据需求推导接口定义 | 接口定义可能与后端不一致，标注"待后端确认" |
| API契约部分缺失 | 已有接口生成完整代码，缺失接口生成占位 | 部分接口需手动补充 |
| 页面数据需求缺失 | 为所有API接口生成代码 | 可能生成未使用的接口代码 |
| 设计令牌缺失 | 错误/加载状态UI使用内联样式+TODO标注 | 错误提示样式硬编码，需后续替换为Token |
| 目标框架缺失 | 若用户未提供目标框架，提示用户提供或跳过该输入相关步骤 | 默认React + TypeScript |

数据获取说明：
- 本Skill需要API契约文档，请通过以下方式之一提供：
  1. 上传openapi.yaml / swagger.json文件
  2. 提供API文档URL
  3. 描述核心API接口列表
