---
name: api-contract
description: 当需要设计API接口契约时使用。API契约自动设计，基于PRD和数据模型，自动设计RESTful/GraphQL接口契约，生成OpenAPI 3.0规范文档，包含接口定义、版本策略、错误码规范和变更管理。关键词：API设计、接口契约、OpenAPI、RESTful、GraphQL、版本管理。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 12: API契约自动设计

## 核心原则

1. **契约先行**：API契约在设计阶段确定，前后端基于契约并行开发
2. **RESTful优先**：优先使用RESTful风格，复杂查询场景考虑GraphQL
3. **版本化**：API从第一天起就支持版本管理
4. **向后兼容**：非破坏性变更不升级主版本号

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 产品需求文档 |
| 数据模型 | JSON | ○ | output/backend-data-architecture/data-model/er_model.json | 数据实体和关系定义（API设计阶段通常未就绪，从PRD推导） |
| 业务流程 | JSON | ○ | output/pm-design/design-userflow/userflow.json | 用户流程定义 |

## 执行步骤

### Step 1: 资源识别与建模

从PRD和数据模型中识别API资源：

- 每个核心数据实体映射为一个资源（复数名词）
- 识别资源间的关系（一对一/一对多/多对多）
- 确定资源的CRUD操作需求
- 标注哪些资源需要嵌套资源（子资源）

**资源命名规范**：
- 使用复数名词：`/courses` 而非 `/course`
- 嵌套资源最多2层：`/courses/{id}/lessons`
- 使用kebab-case：`/user-groups` 而非 `/userGroups`

### Step 2: 接口设计

为每个资源设计标准接口：

| 操作 | Method | Path | 说明 |
|------|--------|------|------|
| 列表查询 | GET | /resources | 分页+筛选+排序 |
| 详情查询 | GET | /resources/{id} | 单个资源详情 |
| 创建 | POST | /resources | 创建新资源 |
| 全量更新 | PUT | /resources/{id} | 替换整个资源 |
| 部分更新 | PATCH | /resources/{id} | 更新指定字段 |
| 删除 | DELETE | /resources/{id} | 删除资源 |

**查询参数规范**：
- 分页：`page` + `page_size`（默认20，最大100）
- 排序：`sort_by` + `sort_order`
- 筛选：`filter[{field}]` + `filter[{field}][op]`
- 字段选择：`fields=id,name,description`
- 搜索：`q=关键词`

### Step 3: 请求响应规范

定义统一的请求响应格式：

**成功响应**：
```json
{
  "data": { ... },
  "meta": { "page": 1, "page_size": 20, "total": 100 }
}
```

**列表响应**：
```json
{
  "data": [ ... ],
  "meta": { "page": 1, "page_size": 20, "total": 100 }
}
```

**错误响应**：
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数校验失败",
    "details": [
      { "field": "email", "message": "邮箱格式不正确" }
    ]
  }
}
```

### Step 4: 错误码体系

设计分层错误码体系：

| 错误码范围 | 类别 | 示例 |
|-----------|------|------|
| 40000-40099 | 参数校验错误 | 40001=必填参数缺失 |
| 40100-40199 | 认证授权错误 | 40101=Token过期 |
| 40300-40399 | 权限错误 | 40301=无访问权限 |
| 40400-40499 | 资源不存在 | 40401=资源未找到 |
| 40900-40999 | 业务冲突 | 40901=资源已存在 |
| 42900-42999 | 限流错误 | 42901=请求过于频繁 |
| 50000-50099 | 系统内部错误 | 50001=数据库异常 |

### Step 5: 版本策略

设计API版本管理策略：

| 策略 | 实现 | 适用场景 |
|------|------|---------|
| URL路径版本 | /v1/resources /v2/resources | 大版本变更 |
| Header版本 | Accept: application/vnd.api.v2+json | 小版本变更 |
| 向后兼容 | 新增字段不升级版本 | 非破坏性变更 |

**版本变更规则**：
- 新增可选字段 → 不升级版本
- 新增接口 → 不升级版本
- 删除字段 → 升级主版本
- 修改字段类型 → 升级主版本
- 废弃接口 → 先标记deprecated，下个主版本移除

## 输出

**存储路径**：`output/backend-api-design/api-contract/`

**输出文件**：openapi.yaml

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| openapi | string | 是 | OpenAPI版本号 |
| info | object | 是 | API基本信息 |
| info.title | string | 是 | API名称 |
| info.version | string | 是 | API版本 |
| paths | object | 是 | API端点定义 |
| paths.{endpoint} | object | 是 | 端点路径 |
| paths.{endpoint}.{method} | object | 是 | HTTP方法定义 |
| paths.{endpoint}.{method}.summary | string | 是 | 方法摘要 |
| paths.{endpoint}.{method}.responses | object | 是 | 响应定义 |
| paths.{endpoint}.{method}.responses."200" | object | 是 | 成功响应 |
| components | object | 否 | 公共组件定义 |
| components.schemas | object | 否 | 数据模型定义 |
| security | array | 否 | 全局安全策略 |

```json
{
  "api_metadata": {
    "title": "智学云平台API",
    "version": "1.0.0",
    "base_url": "/api/v1",
    "total_endpoints": 25,
    "resources": ["courses", "lessons", "users", "enrollments", "progress"]
  },
  "openapi_spec": "openapi.yaml",
  "openapi_min_structure": {
    "openapi": "3.0.x",
    "info": "title + version + description",
    "servers": "base_url列表",
    "paths": "每个接口的method+operationId+summary+parameters+requestBody+responses",
    "components": {
      "schemas": "请求/响应数据模型",
      "securitySchemes": "认证方案定义",
      "responses": "通用错误响应"
    },
    "security": "全局认证要求",
    "tags": "接口分组标签"
  },
  "error_codes": {
    "total": 30,
    "categories": 7
  },
  "versioning": {
    "strategy": "url_path",
    "current_version": "v1",
    "deprecation_policy": "deprecated标记保留≥2个主版本"
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 资源间多对多关系 | 创建关联资源（如enrollments关联users和courses） |
| 查询条件≥5个 | 考虑提供GraphQL端点 |
| 列表接口数据量可能>100条 | 强制分页，默认page_size=20 |
| 接口涉及敏感数据 | 标记需鉴权，不暴露在公开文档 |
| 接口写操作 | 强制定义幂等性（PUT幂等/POST非幂等） |
| 删除操作 | 默认软删除，提供force参数硬删除 |

## 质量检查

- [ ] 每个资源有完整的CRUD接口定义
- [ ] 100%的接口有请求参数和响应Schema
- [ ] 错误码覆盖4xx和5xx场景
- [ ] 版本策略明确（URL/Header/兼容规则）
- [ ] 分页接口默认page_size≤100
- [ ] 写操作接口定义幂等性

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 数据模型缺失 | 从PRD推导核心实体，生成实体关系草案；数据架构阶段基于API契约反向完善数据模型 | 资源定义基于推导，标注"待数据模型确认"；data-model阶段会反向校验和补充 |
| 业务流程缺失 | 仅设计CRUD接口，不设计流程接口 | 缺少跨资源的业务接口 |
| PRD缺失 | 无法设计API，需用户提供核心需求 | 输出为空 |

数据获取说明：
- 本Skill需要PRD和数据模型，请通过以下方式之一提供：
  1. 上传prd.md和er_model.json文件
  2. 描述核心业务实体和功能需求
  3. 提供现有API文档（用于增量设计）

## 上游变更响应

当上游输入发生变更时，本Skill的响应策略：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD功能点增删 | API端点增删 | 标注受影响的API端点，生成变更清单 |
| 数据模型变更 | API请求/响应结构 | 标注受影响的字段，评估向后兼容性 |
| 安全等级变更 | API安全策略 | 标注受影响的安全规则，建议人类确认 |

当API契约自身变更时，对下游的通知机制：

| API变更类型 | 兼容性 | 通知范围 | 通知方式 |
|-------------|--------|----------|----------|
| 新增端点 | 向后兼容 | api-contract-consume | 标记新增端点，前端可增量对接 |
| 新增可选字段 | 向后兼容 | api-contract-consume | 标记新增字段，前端可选择性使用 |
| 删除端点 | 破坏性变更 | api-contract-consume、frontend-test | 必须人类确认，提供迁移方案和过渡期 |
| 修改字段类型 | 破坏性变更 | api-contract-consume、frontend-test | 必须人类确认，提供兼容方案或版本升级 |
| 修改必填/可选 | 可能破坏 | api-contract-consume | 标注变更，建议前端验证 |
