---
name: backend-architecture-impl
description: 当需要生成后端项目架构代码时使用。后端架构代码实现，基于backend-architecture-spec产出的架构方案和服务设计，直接生成可运行的项目架构代码到项目目录。本Skill统一负责应用入口（app.ts），整合api-design-impl和data-architecture-impl的代码产出。内建架构对齐检查和代码自审确保代码质量。关键词：生成项目脚手架、生成app.ts、生成Docker配置、生成CI配置、项目架构代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "pipeline"
  version: "5.0"
  domain_tags: ["电商", "SaaS", "金融", "通用"]
  trigger_examples:
    - "生成项目脚手架"
    - "生成app.ts"
    - "生成Docker配置"
    - "生成CI配置"
    - "项目初始化代码"
  interaction_mode: "ai_suggest_human_approve"
---

# 后端架构代码实现

## Code Write Boundary

Follow [Engineering Boundary Protocol](../../templates/engineering-boundary-protocol.md) or the equivalent relative path from this skill.

1. Scan first: identify framework, package manager, module layout, ORM, migration tool, validation library, auth middleware, and test conventions before implementation.
2. Target scope: declare exact files/directories to create or modify; generated code must stay inside the target module unless integration files are explicitly required.
3. No overwrite: preserve existing business logic, routes, models, migrations, configs, and tests unless the user explicitly asks for replacement.
4. Consistency checks: verify OpenAPI, controller/service signatures, DTO/schema validation, ER model, migrations, repositories, and auth rules are aligned.
5. Migration safety: generated migrations must be additive by default; destructive data changes require explicit human confirmation.
6. Implementation report: list created/modified files, skipped files, checks run, failed checks, and residual risks.

## 核心原则

1. **设计即规范**：严格遵循backend-architecture-spec的设计产出
2. **统一入口**：本Skill统一负责app.ts，整合api-design-impl和data-architecture-impl的代码产出
3. **多环境支持**：配置管理支持dev/staging/prod
4. **容器化就绪**：Docker镜像多阶段构建，镜像精简
5. **CI内建**：CI流水线包含lint+test+build

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 架构方案 | JSON | 是 | output/backend-architecture/backend-architecture-spec/architecture_decision.json | 架构模式和拓扑图 |
| 服务设计 | JSON | 是 | output/backend-architecture/backend-architecture-spec/service_design.json | 服务划分和通信方案 |
| ADR | JSON | 是 | output/backend-architecture/backend-architecture-spec/adr.json | 架构决策记录 |
| 审查报告 | JSON | ○ | output/backend-architecture/backend-architecture-spec/review_report.json | 审查问题清单 |
| 技术债登记册 | JSON | ○ | output/backend-architecture/backend-architecture-spec/tech_debt_register.json | 技术债 |
| 技术栈决策 | JSON | ○ | output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | 统一技术栈，决定ORM和数据库连接配置 |
| API契约 | YAML | 是 | output/backend-api-design/api-design-spec/openapi.yaml | 用于路由挂载 |
| 数据模型 | JSON | 是 | output/backend-data-architecture/data-architecture-spec/er_model.json | 用于数据库初始化 |
| 缓存策略 | JSON | ○ | output/backend-data-architecture/data-architecture-spec/cache_strategy.json | 用于缓存初始化 |
| project_dir | string | 是 | 用户提供 | 项目根目录绝对路径 |
| tech_stack | string | ○ | 用户提供 | 技术栈决策.json未提供时使用，备用降级 |

## 执行步骤

### Step 1: 项目入口和配置生成

生成应用入口和配置管理：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| 项目入口 | src/app.ts（或等效） | 应用启动入口，注册中间件、挂载api-design-impl的路由、初始化data-architecture-impl的数据库连接和缓存 |
| 配置管理 | src/config/ | 环境变量、数据库、缓存、日志配置 |

**代码质量要求**：
- app.ts整合api-design-impl的路由（从src/routes/index.ts挂载）和data-architecture-impl的数据库/缓存初始化
- 配置管理支持多环境（dev/staging/prod）

**阶段卡口**：app.ts正确挂载所有路由和中间件，配置支持多环境

### Step 2: 服务层和通信层生成

基于服务设计生成服务层和通信层：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| 服务层骨架 | src/services/coordinator/ | 每个限界上下文一个Service目录（跨资源协调逻辑，调用api-design-impl的资源级Service） |
| 通信层 | src/clients/（或events/） | 服务间通信（HTTP/gRPC/消息队列） |

**代码质量要求**：
- Service层与api-design-impl的资源级Service对齐，coordinator层调用resource层
- 服务间通信方式与架构决策匹配

**阶段卡口**：Service层与api-design-impl的资源级Service对齐，通信方式与架构决策匹配

### Step 3: 基础设施代码生成

生成错误处理、日志、健康检查等基础设施代码：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| 错误处理 | src/errors/ | 统一错误类和错误处理中间件 |
| 日志 | src/utils/logger.ts | 结构化日志配置 |
| 健康检查 | src/health/ | /health端点+依赖检查（数据库+缓存+外部服务） |

**代码质量要求**：
- 错误处理统一，不吞异常
- 日志结构化，包含请求ID追踪
- 健康检查覆盖所有依赖

**阶段卡口**：错误处理统一，健康检查端点可访问

### Step 4: 容器化和CI/CD生成

生成Docker和CI/CD配置：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| Docker | Dockerfile + docker-compose.yml | 容器化配置 |
| CI/CD | .github/workflows/（或等效） | 基础CI流水线（lint+test+build） |
| 包管理 | package.json（或等效） | 依赖声明+脚本+版本锁定 |

**代码质量要求**：
- Docker镜像多阶段构建，镜像精简
- CI流水线包含lint+test+build

**阶段卡口**：Docker镜像可构建，CI流水线完整

### Step 5: 架构对齐检查与代码自审

**架构对齐检查**：
- 项目目录结构与限界上下文划分一致
- 服务间通信方式与架构决策匹配
- 中间件配置与安全策略匹配
- app.ts正确挂载所有路由和中间件
- **统一对齐检查**：基于元数据文件执行结构化比对，确保 api-design-impl 和 data-architecture-impl 的衔接正确。执行方式：读取 api-design-impl/impl-report.json 中的 alignment_check.repository_call_chain 和 data-architecture-impl/impl-report.json 中的 repositories 字段，交叉比对 Repository 方法签名与 Service 调用是否匹配；读取 er_model.json 实体字段与 openapi.yaml 资源字段，比对 API-Model 映射完整性

**代码自审**：
- 检查app.ts是否正确整合api-design-impl的路由和data-architecture-impl的数据库/缓存初始化
- 检查Service层与api-design-impl的Service是否对齐
- 检查配置管理是否支持多环境
- 检查Docker镜像是否可构建
- 检查CI流水线是否完整（lint+test+build）
- 发现问题自动修复，P0问题阻塞输出

**阶段卡口**：项目可启动（npm run dev 成功或等效命令验证），健康检查端点可访问（/health返回200），架构决策100%在代码中体现，统一对齐检查通过，代码自审P0问题=0

### Step 6: 架构测试代码生成

为架构层生成测试代码：

- 为健康检查端点生成集成测试
- 为服务间通信生成契约测试骨架
- 为CI流水线生成构建验证测试
- 测试文件输出到 src/__tests__/integration/

**阶段卡口**：健康检查和服务间通信有测试骨架

## 输出

采用**双输出模式**：

1. **代码文件** → 直接写入用户指定的 `{project_dir}/` 项目目录
2. **元数据文件** → 写入 `output/` 目录，供下游 Skill 消费

**代码文件输出**：{project_dir}/（项目入口、配置、服务层、Docker、CI/CD直接写入项目目录）

**元数据输出**：output/backend-architecture/backend-architecture-impl/

**元数据输出文件**：
- impl-report.json — 代码实现报告（生成文件清单+对齐检查结果+自审结果）
- architecture-coverage.json — 架构对齐覆盖报告

**impl-report.json Schema**：

```json
{
  "type": "object",
  "required": ["skill_name", "version", "generated_files", "architecture_alignment", "self_audit"],
  "properties": {
    "skill_name": { "type": "string" },
    "version": { "type": "string" },
    "generated_files": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["path", "type", "description"],
        "properties": {
          "path": { "type": "string" },
          "type": { "type": "string", "enum": ["entry", "config", "service", "client", "infrastructure", "docker", "ci", "test"] },
          "description": { "type": "string" }
        }
      }
    },
    "architecture_alignment": {
      "type": "object",
      "required": ["api_model_mapping", "repository_service_chain", "architecture_decision_coverage"],
      "properties": {
        "api_model_mapping": { "type": "object", "properties": { "passed": { "type": "boolean" }, "unmapped_fields": { "type": "array", "items": { "type": "object", "properties": { "api_field": { "type": "string" }, "model_entity": { "type": "string" } } } } } },
        "repository_service_chain": { "type": "object", "properties": { "passed": { "type": "boolean" }, "missing_links": { "type": "array", "items": { "type": "object", "properties": { "service_method": { "type": "string" }, "repository_method": { "type": "string" } } } } } },
        "architecture_decision_coverage": { "type": "object", "properties": { "passed": { "type": "boolean" }, "unimplemented_decisions": { "type": "array", "items": { "type": "string" } } } }
      }
    },
    "self_audit": {
      "type": "object",
      "required": ["p0_count", "p1_count", "passed", "items"],
      "properties": {
        "p0_count": { "type": "integer" },
        "p1_count": { "type": "integer" },
        "passed": { "type": "boolean" },
        "items": { "type": "array", "items": { "type": "object", "properties": { "severity": { "type": "string" }, "check": { "type": "string" }, "result": { "type": "string" }, "detail": { "type": "string" } } } }
      }
    }
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 架构方案与代码实现冲突 | 以架构方案为准，调整代码实现 |
| 服务设计与api-design-impl不一致 | 以api-design-impl为准，调整服务层 |
| 代码自审发现P0问题 | 阻塞输出，自动修复后重新自审 |
| Docker构建失败 | 调整Dockerfile配置 |
| 技术栈决策与用户指定冲突 | 优先使用tech_stack_decision.json（架构设计产出），其次使用tech_stack参数（用户直接提供），无则默认Node.js/Express。标注冲突供人类确认 |

## 质量检查

- [ ] 项目可启动（npm run dev 成功或等效命令验证）
- [ ] 健康检查端点可访问（/health返回200）
- [ ] 架构决策100%在代码中体现
- [ ] app.ts正确整合api-design-impl的路由和data-architecture-impl的数据库/缓存初始化
- [ ] 配置管理支持多环境
- [ ] 错误处理统一不吞异常
- [ ] Docker镜像可构建
- [ ] CI流水线包含lint+test+build
- [ ] 代码自审P0问题=0
- [ ] 健康检查和服务间通信有测试骨架
- [ ] API-Model映射完整，Repository-Service调用链完整（统一对齐检查）

### 真实运行验证策略

**框架识别与适配矩阵**：

| 框架 | 识别信号 | 入口文件 | 路由风格 | 中间件风格 |
|------|---------|---------|---------|-----------|
| Express | package.json 含 "express" | src/app.ts 或 src/index.ts | Router() | app.use() |
| NestJS | package.json 含 "@nestjs/core" | src/main.ts | @Controller() 装饰器 | @UseGuards() 装饰器 |
| Fastify | package.json 含 "fastify" | src/app.ts | fastify.route() | app.register() |
| Koa | package.json 含 "koa" | src/app.ts | router.get/post | app.use() |

**ORM 识别与适配矩阵**：

| ORM | 识别信号 | Model 风格 | Migration 命令 | Seed 命令 |
|-----|---------|-----------|---------------|----------|
| Prisma | package.json 含 "@prisma/client" | schema.prisma | npx prisma migrate dev | npx prisma db seed |
| TypeORM | package.json 含 "typeorm" | @Entity() 装饰器 | npm run typeorm migration:run | — |
| Sequelize | package.json 含 "sequelize" | sequelize.define() | npx sequelize-cli db:migrate | npx sequelize-cli db:seed |
| Mongoose | package.json 含 "mongoose" | mongoose.Schema() | — (Schema-first) | — |

**验证命令清单**：

| 验证维度 | 发现策略 | 执行命令 | 通过标准 | 失败处理 |
|---------|---------|---------|---------|---------|
| 依赖安装 | package.json 存在 | npm install / pnpm install | 零错误 | 标注依赖冲突 |
| 编译检查 | tsconfig.json 存在 | npx tsc --noEmit | 零类型错误 | 标注类型错误 |
| 构建检查 | package.json scripts.build | npm run build | 零错误退出 | 标注构建错误 |
| 数据库迁移(dry-run) | 识别ORM后 | npx prisma migrate status / npm run typeorm migration:show | 迁移状态一致 | 标注待执行迁移 |
| 健康检查 | 识别框架后 | curl /health 或 npm run start 后检查 | HTTP 200 | 标注启动失败原因 |
| API类型一致性 | openapi.yaml 存在 | 对比路由定义与OpenAPI | 100%端点覆盖 | 标注未覆盖端点 |
| 测试 | package.json scripts.test | npm run test | 通过率≥80% | 标注失败用例 |

**验证执行顺序**：框架识别 → 依赖安装 → 编译检查 → 构建检查 → 数据库迁移(dry-run) → 健康检查 → API类型一致性 → 测试

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 技术栈决策缺失 | 使用tech_stack参数（用户提供），无则默认Node.js/Express | 代码风格可能不匹配 |
| 架构方案缺失 | 默认单体架构 | 架构模式可能不匹配业务需求 |
| 服务设计缺失 | 按模块目录组织 | 服务拆分可能不合理 |
| tech_stack参数缺失 | 默认Node.js/Express | 代码风格可能不匹配 |
| project_dir缺失 | 无法生成代码 | 仅输出设计文档 |

## 上游变更响应

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 架构方案变更 | app.ts+配置+服务层 | 标注受影响的代码文件，评估修改范围 |
| 服务设计变更 | 服务层+通信层 | 更新Service目录和通信配置 |
| 技术栈决策变更 | ORM配置+数据库连接 | 更新tech_stack相关配置 |
| API契约变更 | 路由挂载 | 更新app.ts中的路由注册 |
| 数据模型变更 | 数据库初始化配置 | 检查是否需要补充Model文件 |
| API实现或数据层实现变更 | 统一对齐检查 | 检查API-Model映射是否仍然完整 |

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| app.ts入口变更 | 所有已生成代码 | 标注受影响的启动流程，更新impl-report.json |
| Docker/CI配置变更 | 部署流程 | 标注受影响的构建和部署步骤，更新impl-report.json |
| 统一对齐检查结果 | api-design-impl, data-architecture-impl | 标注发现的映射缺失，更新architecture-coverage.json |
