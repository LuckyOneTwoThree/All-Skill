---
name: backend-architecture-impl
description: 当需要生成后端项目架构代码时使用。后端架构代码实现，基于backend-architecture-spec产出的架构方案和服务设计，直接生成可运行的项目架构代码到项目目录。本Skill统一负责应用入口（app.ts），整合api-design-impl和data-architecture-impl的代码产出。内建架构对齐检查和代码自审确保代码质量。关键词：生成项目脚手架、生成app.ts、生成Docker配置、生成CI配置、项目架构代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "pipeline"
  version: "4.0"
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
| API契约 | YAML | 是 | output/backend-api-design/api-design-spec/openapi.yaml | 用于路由挂载 |
| 数据模型 | JSON | 是 | output/backend-data-architecture/data-architecture-spec/er_model.json | 用于数据库初始化 |
| 缓存策略 | JSON | ○ | output/backend-data-architecture/data-architecture-spec/cache_strategy.json | 用于缓存初始化 |
| project_dir | string | 是 | 用户提供 | 项目根目录绝对路径 |
| tech_stack | string | 是 | 用户提供 | 后端技术栈 |

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
| 服务层骨架 | src/services/ | 每个限界上下文一个Service目录（与api-design-impl的Service对齐，补充跨资源协调逻辑） |
| 通信层 | src/clients/（或events/） | 服务间通信（HTTP/gRPC/消息队列） |

**代码质量要求**：
- Service层与api-design-impl的Service对齐
- 服务间通信方式与架构决策匹配

**阶段卡口**：Service层与api-design-impl对齐，通信方式与架构决策匹配

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

**代码自审**：
- 检查app.ts是否正确整合api-design-impl的路由和data-architecture-impl的数据库/缓存初始化
- 检查Service层与api-design-impl的Service是否对齐
- 检查配置管理是否支持多环境
- 检查Docker镜像是否可构建
- 检查CI流水线是否完整（lint+test+build）
- 发现问题自动修复，P0问题阻塞输出

**阶段卡口**：项目可启动（npm run dev 成功或等效命令验证），健康检查端点可访问（/health返回200），架构决策100%在代码中体现，代码自审P0问题=0

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

## 决策规则

| 条件 | 决策 |
|------|------|
| 架构方案与代码实现冲突 | 以架构方案为准，调整代码实现 |
| 服务设计与api-design-impl不一致 | 以api-design-impl为准，调整服务层 |
| 代码自审发现P0问题 | 阻塞输出，自动修复后重新自审 |
| Docker构建失败 | 调整Dockerfile配置 |

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

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 架构方案缺失 | 默认单体架构 | 架构模式可能不匹配业务需求 |
| 服务设计缺失 | 按模块目录组织 | 服务拆分可能不合理 |
| tech_stack未指定 | 默认Node.js/Express | 代码风格可能不匹配 |
| project_dir缺失 | 无法生成代码 | 仅输出设计文档 |

## 上游变更响应

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 架构方案变更 | app.ts+配置+服务层 | 标注受影响的代码文件，评估修改范围 |
| 服务设计变更 | 服务层+通信层 | 更新Service目录和通信配置 |
| API契约变更 | 路由挂载 | 更新app.ts中的路由注册 |
