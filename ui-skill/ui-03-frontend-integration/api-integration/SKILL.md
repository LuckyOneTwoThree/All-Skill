---
name: api-integration
description: 当需要将前端与后端API对接时使用。API集成自动生成，基于API契约自动生成前端请求层代码，包含类型安全的API客户端、请求/响应拦截器、错误处理和Mock数据。关键词：API对接、接口联调、请求层、API客户端、前后端联调、接API、调接口。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "pipeline"
  version: "1.1"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "对接后端API"
    - "生成请求层代码"
    - "调接口"
  interaction_mode: "ai_auto"
---

# API集成自动生成

## 核心原则

1. **契约驱动**——API客户端代码从契约自动生成，不手写请求函数
2. **类型安全**——请求参数和响应类型100%从契约推导
3. **防御性编程**——每个API调用都有错误处理、超时和重试
4. **开发体验**——Mock数据自动生成，前后端可并行开发

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| API契约 | JSON/YAML | ○ | output/backend-api-design/api-design-spec/ | OpenAPI/Swagger规范（缺失时基于页面数据流推断） |
| 页面数据流 | JSON | 是 | output/ui-frontend/page-builder/pages.json | 页面数据获取需求 |
| 目标框架 | string | 是 | 上游编排器传递 | React/Vue/Svelte |
| 目标语言 | string | ○ | 上游编排器传递（默认zh-CN） | 目标界面语言，影响Mock数据和错误提示语言 |
| project_dir | string | 是 | 上游编排器传递 | 项目根目录绝对路径 |

## 执行步骤

### Step 1: API客户端代码生成

基于API契约生成类型安全的API客户端：

| 生成内容 | 说明 |
|----------|------|
| 请求函数 | 每个API端点一个函数，参数和返回值有完整TypeScript类型 |
| 类型定义 | 从契约的schema推导Request/Response类型 |
| 拦截器 | 请求拦截（token注入）+ 响应拦截（统一错误处理） |
| 错误处理 | 网络错误/超时/业务错误分级处理 |

### Step 2: Mock数据与并行开发支持

为每个API端点生成Mock数据：
- 基于schema的响应类型生成符合类型的Mock数据
- 支持开发环境自动切换Mock
- Mock数据语言与目标语言一致

### Step 3: 数据流对接

将API客户端与页面的数据流设计对接：
- 页面级数据预加载（React Query/SWR）
- 缓存策略配置
- 乐观更新配置
- 请求去重和取消

代码写入 {project_dir}/src/api/ 目录。

## 输出

**代码文件输出**：{project_dir}/src/api/（API客户端、类型定义、Mock数据直接写入项目目录）

**元数据输出**：output/ui-frontend-integration/api-integration/

**输出文件**：api-integration.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["endpoints", "types", "mock_data", "project_dir"],
  "properties": {
    "endpoints": {"type": "array", "description": "API端点列表，每项含method/path/requestType/responseType"},
    "types": {"type": "array", "description": "生成的TypeScript类型定义"},
    "mock_data": {"type": "array", "description": "Mock数据文件列表"},
    "project_dir": {"type": "string", "description": "项目根目录路径"}
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 目标框架=React | 使用React Query + axios |
| 目标框架=Vue | 使用Vue Query + axios |
| 目标框架=Svelte | 使用svelte-query + fetch |
| API端点>20个 | 按领域模块分文件 |
| 有分页接口 | 生成通用分页HOOK |
| 有文件上传接口 | 生成进度回调封装 |
| 目标语言≠en-US | Mock数据使用目标语言内容 |

## 质量检查

- [ ] 100%的API端点有对应的请求函数
- [ ] 100%的请求参数和响应有TypeScript类型
- [ ] 每个API调用有错误处理
- [ ] Mock数据覆盖所有端点
- [ ] 拦截器配置完整（token注入+错误处理）

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| API契约缺失 | 基于页面数据流推断API需求 | API函数为骨架，标注"待契约补充" |
| 页面数据流缺失 | 为所有API端点生成独立函数 | 缺少页面级数据预加载配置 |
| project_dir 缺失 | 仅输出到 output/ 目录 | 代码需手动复制 |

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| API契约变更（端点增删/参数变更/响应结构变更） | 请求函数、类型定义、Mock数据 | 标注受影响的端点和类型，建议重新生成对应请求函数和Mock数据 |
| 页面数据流变更（数据获取方式/缓存策略变更） | 数据预加载配置、缓存策略、请求去重 | 标注受影响的页面数据流，建议更新React Query/SWR配置 |
| 目标框架变更 | 请求层技术选型（React Query/Vue Query/svelte-query） | 标注需替换的数据请求层方案，建议重新生成 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| API端点增删 | production-ready | 受影响的测试和构建配置 | endpoints列表变更 |
| 类型定义变更 | production-ready | 受影响的类型相关测试 | types结构变更 |
| Mock数据变更 | production-ready | 受影响的测试Mock | mock_data文件变更 |
| 请求层技术选型变更 | production-ready | 依赖和构建配置变更 | 目标框架或请求库变更 |

## 变更记录

- v1.1: 补充上游变更响应和下游通知机制；移除多余的ext-impeccable Setup
- v1.0: 基于api-contract-consume调整，输入来源更新为page-builder
