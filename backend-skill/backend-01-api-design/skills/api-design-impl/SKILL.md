---
name: api-design-impl
description: 当需要生成API代码时使用。API代码实现，基于api-design-spec产出的OpenAPI规范和安全策略，直接生成可运行的路由、Controller、Service、中间件和类型代码到项目目录。内建PRD对齐检查、前端对齐检查和代码自审确保代码质量。关键词：生成API代码、写接口代码、生成路由、生成Controller、生成Service、API代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "pipeline"
  version: "4.0"
  domain_tags: ["电商", "SaaS", "金融", "通用"]
  trigger_examples:
    - "生成API代码"
    - "写接口代码"
    - "生成路由和Controller"
    - "生成Service代码"
    - "生成中间件代码"
  interaction_mode: "ai_suggest_human_approve"
---

# API代码实现

## 核心原则

1. **设计即规范**：严格遵循api-design-spec的设计产出，不擅自修改接口契约
2. **分层清晰**：Controller仅做转换，Service承载逻辑，Repository访问数据
3. **类型安全**：API类型与数据模型通过mappers转换，不直接引用
4. **安全内建**：中间件按安全级别自动匹配，敏感字段自动脱敏
5. **测试覆盖**：每个API端点有集成测试骨架

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| OpenAPI规范 | YAML | 是 | output/backend-api-design/api-design-spec/openapi.yaml | API契约定义 |
| 安全策略 | JSON | 是 | output/backend-api-design/api-design-spec/security-policy.json | 安全级别和限流规则 |
| 认证鉴权方案 | JSON | 是 | output/backend-api-design/api-design-spec/auth-scheme.json | 认证和权限方案 |
| 合规检查清单 | JSON | ○ | output/backend-api-design/api-design-spec/compliance-checklist.json | 合规要求 |
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 用于PRD对齐检查 |
| PRD结构化数据 | JSON | 是 | output/pm-design/design-prd/prd.json | PRD机器可消费版本，供代码生成对齐检查 |
| 前端页面数据需求 | JSON | ○ | output/ui-frontend/page-builder/pages.json | 用于前端对齐检查 |
| project_dir | string | 是 | 用户提供 | 项目根目录绝对路径 |
| tech_stack | string | 是 | 用户提供 | 后端技术栈 |

## 执行步骤

### Step 1: 代码骨架生成

基于OpenAPI规范生成项目API层代码骨架：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| 路由定义 | src/routes/ | 每个资源一个路由文件，包含CRUD端点 |
| 路由注册入口 | src/routes/index.ts | 统一路由注册入口，供backend-architecture的app.ts挂载 |
| Controller | src/controllers/ | 每个资源一个Controller，负责请求/响应转换和参数校验 |
| 请求校验 | src/validators/ | 基于OpenAPI schema的请求参数校验 |
| API类型定义 | src/types/api.ts | API请求/响应TypeScript类型（与OpenAPI对齐），仅定义API层传输结构 |
| 类型转换层 | src/types/mappers.ts | API类型↔Model类型的转换函数，确保API层与数据层解耦 |

**阶段卡口**：代码可编译（npm run build 或 tsc --noEmit 通过），路由与OpenAPI规范一一对应

### Step 2: Service业务逻辑实现

为每个资源生成Service，包含完整业务逻辑：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| Service | src/services/ | 每个资源一个Service，包含业务逻辑、事务管理、跨资源协调、缓存调用 |

**Service方法结构**：参数校验→权限检查→业务处理→数据持久化→缓存更新→响应组装

**代码质量要求**：
- Controller方法仅做请求/响应转换+参数校验，不包含业务逻辑
- Service方法包含完整业务逻辑+错误处理+事务管理+JSDoc注释
- Service通过Repository+CacheRepository访问数据，不直接操作数据库

**阶段卡口**：每个API端点有对应Service方法，Controller→Service调用链完整

### Step 3: 中间件和安全实现

基于安全策略和认证鉴权方案生成中间件：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| 中间件 | src/middleware/ | 认证、限流、CORS、错误处理中间件 |

**实现要求**：
- 中间件按安全级别(L1-L4)自动匹配认证策略
- 限流规则直接写入中间件配置
- 统一错误响应格式与OpenAPI错误码体系一致

**阶段卡口**：L1-L4中间件匹配正确，限流规则与安全策略一致

### Step 4: 对齐检查与代码自审

**PRD对齐检查**：
- 逐条对照PRD功能点，确保每个功能点有对应API端点
- 若有前端页面数据需求输入，逐页对照确保API覆盖所有前端数据获取需求
- 未覆盖的功能点标注为TODO并生成补充建议

**前端对齐检查**：
- 若有前端页面数据需求，验证每个页面的数据获取都有对应API
- API响应字段与前端页面展示需求匹配
- 缺失的API端点自动补充

**代码自审**：
- 检查生成的代码是否符合安全策略（L1-L4中间件匹配、敏感字段脱敏）
- 检查Controller→Service→Repository调用链是否完整
- 检查API类型与OpenAPI规范是否一致
- 检查是否存在SQL注入、XSS等安全漏洞
- 发现问题自动修复，P0问题阻塞输出

**阶段卡口**：PRD功能点100%有API覆盖，前端数据需求100%有API对应，代码自审P0问题=0

### Step 5: API测试代码生成

为每个API端点生成集成测试骨架：

- 测试覆盖：正常流程、参数校验失败、权限拒绝、资源不存在
- 测试文件输出到 src/__tests__/routes/

**阶段卡口**：每个API端点有集成测试骨架

## 输出

采用**双输出模式**：

1. **代码文件** → 直接写入用户指定的 `{project_dir}/src/` 项目目录
2. **元数据文件** → 写入 `output/` 目录，供下游 Skill 消费

**代码文件输出**：{project_dir}/src/（路由、Controller、Service、中间件、类型定义、测试直接写入项目目录）

**元数据输出**：output/backend-api-design/api-design-impl/

**元数据输出文件**：
- impl-report.json — 代码实现报告（生成文件清单+对齐检查结果+自审结果）

## 决策规则

| 条件 | 决策 |
|------|------|
| OpenAPI规范与PRD不一致 | 以OpenAPI规范为准，标注差异供人类确认 |
| 安全策略与代码实现冲突 | 以安全策略为准，调整代码实现 |
| 前端数据需求缺少API | 自动补充API端点，标注为"前端驱动新增" |
| 代码自审发现P0问题 | 阻塞输出，自动修复后重新自审 |

## 质量检查

- [ ] 代码可编译（npm run build 或 tsc --noEmit 通过）
- [ ] 路由与OpenAPI规范一一对应
- [ ] Controller仅做请求/响应转换，不含业务逻辑
- [ ] Service包含完整业务逻辑+错误处理+事务管理
- [ ] 中间件按安全级别正确匹配
- [ ] API类型与Model类型通过mappers.ts转换，不直接引用
- [ ] PRD功能点100%有API端点覆盖
- [ ] 前端页面数据需求100%有API对应（有前端输入时）
- [ ] 代码自审P0问题=0
- [ ] 每个API端点有集成测试骨架

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 安全策略缺失 | 默认L2认证级别 | 中间件可能不满足安全要求 |
| 认证鉴权方案缺失 | 默认JWT+RBAC | 认证方案可能不匹配业务需求 |
| PRD缺失 | 仅基于OpenAPI规范生成代码 | 无法做PRD对齐检查 |
| 前端页面数据需求缺失 | 仅基于OpenAPI规范生成代码 | 无法做前端对齐检查 |
| tech_stack未指定 | 默认Node.js/Express | 代码风格可能不匹配项目偏好 |

## 上游变更响应

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| OpenAPI规范变更 | 路由+Controller+Service+类型 | 标注受影响的代码文件，评估修改范围 |
| 安全策略变更 | 中间件配置 | 更新中间件匹配规则 |
| 认证鉴权方案变更 | 中间件+Service权限检查 | 更新认证和权限逻辑 |
