# 后端架构与开发 Skill 集

> **10个AI Agent Skill（1顶层编排器+3子编排器+6Pipeline）**，覆盖后端从设计到代码实现的全流程。采用"先全量设计、再统一实现"的两阶段模式：设计阶段按架构→数据→API顺序产出设计规范，实现阶段按数据→API→架构顺序生成可运行代码。设计阶段三份设计交叉验证后统一审查，确保一致性。

## 设计理念

### 先全量设计，再统一实现

后端全流程分为两个阶段：

1. **设计阶段（架构→数据→API）**：架构决策先行，约束后续设计；数据模型基于架构边界和业务规则独立建模；API契约基于真实数据模型精确设计
2. **实现阶段（数据→API→架构）**：数据层先生成Repository；API层基于已存在的Repository生成可编译的Service；架构层整合并验证

这种模式确保：
- **架构决策不迟到**：架构决策在最前，约束数据模型和API设计
- **数据模型质量高**：数据模型由业务规则驱动，而非适配API的denormalized视图
- **API字段精确**：API字段从ER模型精确投影，不再盲猜
- **代码步步可编译**：每步impl的产出都可独立编译，无需等待最后一步
- **统一设计审查**：三份设计交叉验证，避免设计冲突导致代码返工

### 保留子编排器独立性

顶层编排器（backend-orchestrator）协调两阶段流程，但三个子编排器（api-design-orchestrator、data-architecture-orchestrator、backend-architecture-orchestrator）可独立调用，支持渐进式迁移或局部使用场景。

### 双输出模式

- **代码文件** → 直接写入 `{project_dir}/src/` 项目目录（可立即运行）
- **元数据文件** → 写入 `output/` 目录（供下游 Skill 消费）

## 模块总览

| 模块 | 编排器 | 设计Skill | 实现Skill | 核心定位 |
|------|--------|----------|----------|----------|
| 后端全流程 | backend-orchestrator | — | — | 顶层两阶段编排：架构→数据→API设计，数据→API→架构实现 |
| API设计 | api-design-orchestrator | api-design-spec | api-design-impl | 数据驱动契约，字段有据可依 |
| 数据架构 | data-architecture-orchestrator | data-architecture-spec | data-architecture-impl | 架构约束先行，模型决定上限 |
| 后端架构 | backend-architecture-orchestrator | backend-architecture-spec | backend-architecture-impl | 适度架构，按需演进 |

## 执行流程

```
═══ 阶段A：全量设计 ═══
backend-architecture-spec → data-architecture-spec → api-design-spec
       ↓                                                        ↓
═══ 阶段B：统一实现 ═══                              统一设计审查
data-architecture-impl → api-design-impl → backend-architecture-impl
```

阶段A（设计）：架构设计→数据架构设计→API设计，三份设计产出后进行**统一设计审查**，交叉验证一致性。

阶段B（实现）：数据层→API层→架构层，每步产出可独立编译，最后backend-architecture-impl做统一对齐检查。

## 代码产出全景

```
{project_dir}/
├── src/
│   ├── app.ts                    ← backend-architecture-impl 统一负责
│   ├── routes/                   ← api-design-impl
│   │   └── index.ts              ← 路由注册入口，供 app.ts 挂载
│   ├── controllers/              ← api-design-impl（请求/响应转换）
│   ├── services/                 ← api-design-impl（业务逻辑+事务+真实Repository调用）
│   ├── validators/               ← api-design-impl（请求校验）
│   ├── middleware/               ← api-design-impl（认证/限流/CORS/错误处理）
│   ├── types/
│   │   ├── api.ts                ← api-design-impl（API层传输类型）
│   │   └── mappers.ts            ← api-design-impl（API类型↔Model类型转换，完整实现）
│   ├── models/                   ← data-architecture-impl（数据层实体）
│   ├── repositories/             ← data-architecture-impl（CRUD+查询，供API层调用）
│   ├── cache/                    ← data-architecture-impl（Redis+CacheRepository）
│   ├── migrations/               ← data-architecture-impl（Schema迁移）
│   ├── config/
│   │   └── database.ts           ← data-architecture-impl（数据库配置）
│   ├── seeds/                    ← data-architecture-impl（种子数据）
│   ├── clients/                  ← backend-architecture-impl（服务间通信）
│   ├── errors/                   ← backend-architecture-impl（统一错误处理）
│   ├── health/                   ← backend-architecture-impl（健康检查）
│   ├── utils/logger.ts           ← backend-architecture-impl（结构化日志）
│   └── __tests__/                ← 三个实现Skill共享测试目录
│       ├── routes/               ← api-design-impl 测试
│       ├── models/               ← data-architecture-impl 测试
│       ├── repositories/         ← data-architecture-impl 测试
│       └── integration/          ← backend-architecture-impl 测试
├── Dockerfile                    ← backend-architecture-impl
├── docker-compose.yml            ← backend-architecture-impl
├── package.json                  ← backend-architecture-impl
└── .github/workflows/            ← backend-architecture-impl（CI: lint+test+build）
```

## 代码质量保障

| 保障机制 | 设计Skill | 实现Skill |
|----------|----------|----------|
| 阶段卡口 | ✅ 每步有卡口 | ✅ 每步有卡口 |
| 人类审查 | ✅ 设计产出审查 | ✅ 代码产出确认 |
| PRD对齐检查 | ✅ api-design-spec | ✅ api-design-impl |
| 前端对齐检查 | ✅ api-design-spec | ✅ api-design-impl |
| API↔Model对齐检查 | ✅ api-design-spec（质量检查项） | ✅ data-architecture-impl（可选）/ backend-architecture-impl（兜底） |
| 架构对齐检查 | ✅ backend-architecture-spec | ✅ backend-architecture-impl |
| 统一设计审查 | ✅ backend-orchestrator（三份设计交叉验证） | — |
| 统一对齐检查 | — | ✅ backend-architecture-impl（API-Model映射+Repository-Service调用链） |
| 代码自审 | — | ✅ 三个impl Skill |
| 测试代码生成 | — | ✅ 三个impl Skill |
| 代码可编译验证 | — | ✅ npm run build / tsc --noEmit |
| 项目可启动验证 | — | ✅ npm run dev + /health 200 |

## 跨模块数据流

| 数据契约 | 生产方 | 消费方 |
|----------|--------|--------|
| PRD | PM design-prd | api-design-spec / data-architecture-spec / backend-architecture-spec |
| 架构方案+拓扑图 | backend-architecture-spec | data-architecture-spec / api-design-spec / backend-architecture-impl |
| 服务设计 | backend-architecture-spec | api-design-spec / backend-architecture-impl |
| 服务数据归属 | backend-architecture-spec | data-architecture-spec（核心消费方） |
| 技术栈决策 | backend-architecture-spec | data-architecture-impl / api-design-impl / backend-architecture-impl（统一消费） |
| ADR | backend-architecture-spec | backend-architecture-impl |
| ER模型 | data-architecture-spec | api-design-spec（核心消费方）/ data-architecture-impl / backend-architecture-impl |
| 缓存策略 | data-architecture-spec | data-architecture-impl / backend-architecture-impl |
| 数据层实现报告 | data-architecture-impl | api-design-impl（核心消费方，了解Repository方法签名） |
| OpenAPI契约 | api-design-spec | api-design-impl / backend-architecture-impl |
| 安全策略 | api-design-spec | api-design-impl |
| 认证鉴权方案 | api-design-spec | api-design-impl |
| 审查报告 | backend-architecture-spec | PM quality-acceptance |
| API覆盖报告 | api-design-impl | PM quality-acceptance |
