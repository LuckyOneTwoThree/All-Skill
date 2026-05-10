# 后端架构与开发 AI Agent Skills 全集

## 这是什么

将后端开发的完整流程闭环提取为 12 个 AI Agent Skill（3个编排器 + 9个Pipeline），兼容 Trae / Claude Code 的 Agent Skills 开放标准。每个 Skill 是一个可独立执行的方法论 Pipeline，编排器负责调度子 Skill 的执行顺序。

## 快速开始

### 部署方式

本目录的嵌套结构（`backend-0X-xxx/orchestrators|skills/`）仅用于**人工浏览和管理**。Trae 按**单个 SKILL.md** 递归扫描识别 Skill，`name` 字段必须匹配直接父目录名。

实际使用时，需将所有最小 Skill 单元**扁平化**放入 `.trae/skills/` 下：

```
# 本目录结构（人工管理用）
backend-skill/backend-01-api-design/orchestrators/api-design-orchestrator/SKILL.md
backend-skill/backend-01-api-design/skills/api-contract/SKILL.md
...

# 部署到 Trae 时的结构（扁平化，机器识别用）
.trae/skills/
├── api-design-orchestrator/SKILL.md
├── api-contract/SKILL.md
├── api-security/SKILL.md
├── auth-design/SKILL.md
├── data-architecture-orchestrator/SKILL.md
├── data-model/SKILL.md
├── cache-strategy/SKILL.md
├── data-migration/SKILL.md
├── backend-architecture-orchestrator/SKILL.md
├── architecture-pattern/SKILL.md
├── service-design/SKILL.md
└── backend-review/SKILL.md
```

### 部署步骤

1. **全量部署**：将所有 `{skill-name}/` 文件夹复制到 `.trae/skills/` 下，扁平平铺
2. **按需部署**：只复制当前项目阶段需要的 Skill 文件夹
3. **触发使用**：在对话中描述需求，AI 自动匹配对应 Skill

> ⚠️ 部署时只需复制最内层的 `{skill-name}/` 文件夹（含 SKILL.md），不需要保留外层的 `backend-0X-xxx/`、`orchestrators/`、`skills/` 目录结构。

## 目录结构

```
backend-skill/
├── backend-01-api-design/           模块1：API设计（契约驱动，安全内建）
│   ├── orchestrators/
│   │   └── api-design-orchestrator/     API设计指挥官
│   └── skills/
│       ├── api-contract/                API契约设计（OpenAPI 3.0）
│       ├── api-security/                API安全设计（限流/加密/CORS）
│       └── auth-design/                 认证鉴权设计（JWT/OAuth2/RBAC）
├── backend-02-data-architecture/    模块2：数据架构（模型决定上限，缓存决定下限）
│   ├── orchestrators/
│   │   └── data-architecture-orchestrator/  数据架构指挥官
│   └── skills/
│       ├── data-model/                   数据模型设计（ER/DDL/索引/分库分表）
│       ├── cache-strategy/               缓存策略设计（多级缓存/一致性/防护）
│       └── data-migration/               数据迁移方案（Schema迁移/回滚/校验）
└── backend-03-backend-architecture/ 模块3：后端架构（架构服务业务，简单优先演进）
    ├── orchestrators/
    │   └── backend-architecture-orchestrator/  后端架构指挥官
    └── skills/
        ├── architecture-pattern/              架构模式选择（单体/微服务/Serverless）
        ├── service-design/                    服务设计（DDD/限界上下文/通信）
        └── backend-review/                    后端审查（性能/安全/可维护/可扩展）
```

## 模块流程顺序

```
API设计 → 数据架构 → 后端架构
  │           │           │
  │           │           └── 审查闭环，P0不通过不开发
  │           └── 模型先行，缓存按需，迁移可回滚
  └── 契约驱动，安全内建，认证鉴权统一

详细执行链路：

api-contract → api-security → auth-design
      ↓
data-model → cache-strategy → data-migration
      ↓
architecture-pattern → service-design → backend-review
```

## Skill 类型

| 类型 | 数量 | 作用 | 使用方式 |
|------|------|------|----------|
| 编排器 Orchestrator | 3 | 调度子 Skill 的执行顺序和阶段卡口 | 按子模块流程使用 |
| Pipeline Skill | 9 | 单个方法论 Pipeline，可独立执行 | 按需单独调用 |

## 模块详解

### 模块1：API设计

后端开发的起点。基于PRD和数据模型设计API契约、安全策略和认证鉴权方案，实现前后端契约驱动开发。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| api-contract | 设计RESTful/GraphQL接口契约，生成OpenAPI 3.0规范 | PRD、数据模型(可选) | openapi.yaml | 🤖→👤 |
| api-security | 设计限流规则、数据加密、输入校验、CORS和安全头 | API契约、安全等级 | 安全策略文档 | 🤖→👤 |
| auth-design | 设计JWT/OAuth2/SSO认证、RBAC/ABAC权限、多租户隔离 | PRD、API契约 | 认证鉴权方案 | 🤖→👤 |

**阶段卡口**：
- 进入API安全前：每个资源有CRUD定义+错误码体系
- 进入认证鉴权前：100%接口有安全级别+限流规则，L4接口安全策略完整
- 进入数据架构前：OpenAPI文档完整，认证方案+权限模型+会话管理完整

**人类决策点**：API风格选择（RESTful vs GraphQL）、安全等级确认、权限模型选择（RBAC vs ABAC）、多租户策略

### 模块2：数据架构

后端数据层的设计核心。基于业务需求设计数据模型、缓存策略和迁移方案，确保数据存储合理、访问高效、变更安全。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| data-model | 设计ER模型、表结构、索引策略和分库分表方案 | PRD、API契约、数据量预估 | DDL+数据字典+ER图(Mermaid) | 🤖→👤 |
| cache-strategy | 设计多级缓存架构、一致性策略和穿透/击穿/雪崩防护 | 数据模型、API契约、并发量预估 | 缓存方案+Key规范+监控 | 🤖→👤 |
| data-migration | 设计Schema迁移、数据迁移和回滚方案 | 当前Schema、目标Schema、数据量 | 迁移脚本+回滚脚本+校验方案 | 🤖→👤 |

**阶段卡口**：
- 进入缓存策略前：ER图+DDL+数据字典完整
- 进入数据迁移前：穿透/击穿/雪崩防护全覆盖
- 进入后端架构前：100%变更有回滚脚本，数据模型人类已确认

**人类决策点**：范式vs反范式、分库分表策略、缓存一致性级别、迁移执行时间

### 模块3：后端架构

后端系统的架构决策层。基于业务规模选择架构模式，通过领域驱动设计服务边界，审查架构质量确保可扩展。

| Skill | 作用 | 输入 | 输出 | 交互模式 |
|-------|------|------|------|----------|
| architecture-pattern | 评估并推荐架构模式，生成ADR和演进路线图 | 业务规模、技术约束 | 架构方案+ADR+拓扑图 | 🤖→👤 |
| service-design | 识别限界上下文，设计服务拆分和通信方案 | PRD、数据模型、架构模式 | 服务划分+上下文映射 | 🤖→👤 |
| backend-review | 审查性能、安全、可维护性和可扩展性 | 服务设计、API契约、数据模型 | 问题清单+修复建议 | 🤖 |

**阶段卡口**：
- 进入服务设计前：架构模式和演进路线人类已确认
- 进入后端审查前：服务间无循环依赖，数据归属明确
- 进入开发前：P0问题=0，架构决策记录完整

**人类决策点**：架构模式选择、服务拆分粒度、演进节奏、P1问题处理

## 输出路径

Skill 执行结果写入**用户项目根目录**的 `output/` 下：

```
用户项目/
└── output/
    ├── backend-api-design/
    │   ├── api-contract/
    │   ├── api-security/
    │   └── auth-design/
    ├── backend-data-architecture/
    │   ├── data-model/
    │   ├── cache-strategy/
    │   └── data-migration/
    └── backend-architecture/
        ├── architecture-pattern/
        ├── service-design/
        └── backend-review/
```

output 跟着用户项目走，不跟着 Skill 定义目录走。多项目时各项目产出互不干扰。

## AI 能力边界

- ✅ 能做：读取本地文件、分析粘贴文本、处理上传文件、生成结构化报告、逻辑推导
- ❌ 不能做：访问外部数据库、调用业务 API、获取实时数据、操作外部系统、执行代码

需要外部数据时，用户需通过粘贴 / 上传 / 提供路径三种方式提供。

## 根据场景选择模块

| 你的场景 | 推荐入口 |
|----------|----------|
| 从零开始设计后端 | 模块1 → 2 → 3（完整流程） |
| 已有PRD，需要设计API | 模块1 api-design-orchestrator |
| 需要设计数据库和缓存 | 模块2 data-architecture-orchestrator |
| 需要确定架构模式 | 模块3 architecture-pattern |
| 已有后端代码需要审查 | 模块3 backend-review |
| 需要设计认证鉴权方案 | 模块1 auth-design |
| 需要规划数据迁移 | 模块2 data-migration |

## 人类与 AI 分工

- 🤖 AI 自动执行：数据处理、分析计算、文档生成、架构审查
- 🤖→👤 AI 建议人类审批：方案选择、架构决策、安全策略、权限模型
- 👤→🤖 人类执行 AI 辅助：业务需求确认、技术约束定义
- 👤 人类执行：最终决策、安全等级确认、多租户策略

所有编排器的阶段卡口和人类决策点确保关键决策由人类把控。

## 核心信念

- **契约驱动开发**：前后端基于契约并行，安全内建而非外挂
- **数据是系统根基**：模型决定上限，缓存决定下限，迁移可回滚
- **架构服务业务**：简单方案优先，按需演进，每个决策可追溯
- **默认拒绝**：未明确允许的一律拒绝，安全从第一天开始
