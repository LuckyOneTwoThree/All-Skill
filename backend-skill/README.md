# 后端架构与开发 Skill 集

> **9个AI Agent Skill（3编排器+6Pipeline）**，覆盖后端从设计到代码实现的全流程。每个模块采用"设计Skill + 实现Skill"双阶段模式，设计产出经人类审查后再生成代码，确保代码质量。

## 设计理念

### 设计先行，审查后实现

每个模块拆分为两个阶段：
1. **设计阶段（-spec）**：产出设计规范（OpenAPI/ER图/ADR等），经人类审查确认
2. **实现阶段（-impl）**：基于审查通过的设计规范，生成可运行代码

这种模式确保：
- 设计缺陷在代码生成前被发现和修复
- 编排器在设计和实现之间加入人类审查卡口
- 每个 Skill 职责单一，AI 不会跳步或浅层生成

### 双输出模式

- **代码文件** → 直接写入 `{project_dir}/src/` 项目目录（可立即运行）
- **元数据文件** → 写入 `output/` 目录（供下游 Skill 消费）

## 模块总览

| 模块 | 编排器 | 设计Skill | 实现Skill | 核心定位 |
|------|--------|----------|----------|----------|
| API设计 | api-design-orchestrator | api-design-spec | api-design-impl | 契约驱动，安全内建 |
| 数据架构 | data-architecture-orchestrator | data-architecture-spec | data-architecture-impl | 模型决定上限，缓存决定下限 |
| 后端架构 | backend-architecture-orchestrator | backend-architecture-spec | backend-architecture-impl | 适度架构，按需演进 |

## 执行流程

```
api-design-spec → [人类审查] → api-design-impl
       ↓                              ↓
data-architecture-spec → [人类审查] → data-architecture-impl
       ↓                              ↓
backend-architecture-spec → [人类审查] → backend-architecture-impl
```

三个模块按顺序执行：API设计 → 数据架构 → 后端架构。每个模块内部先设计后实现。

## 代码产出全景

```
{project_dir}/
├── src/
│   ├── app.ts                    ← backend-architecture-impl 统一负责
│   ├── routes/                   ← api-design-impl
│   │   └── index.ts              ← 路由注册入口，供 app.ts 挂载
│   ├── controllers/              ← api-design-impl（请求/响应转换）
│   ├── services/                 ← api-design-impl（业务逻辑+事务+缓存调用）
│   ├── validators/               ← api-design-impl（请求校验）
│   ├── middleware/               ← api-design-impl（认证/限流/CORS/错误处理）
│   ├── types/
│   │   ├── api.ts                ← api-design-impl（API层传输类型）
│   │   └── mappers.ts            ← api-design-impl（API类型↔Model类型转换）
│   ├── models/                   ← data-architecture-impl（数据层实体）
│   ├── repositories/             ← data-architecture-impl（CRUD+查询）
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
| API对齐检查 | ✅ data-architecture-spec | ✅ data-architecture-impl |
| 架构对齐检查 | ✅ backend-architecture-spec | ✅ backend-architecture-impl |
| 代码自审 | — | ✅ 三个impl Skill |
| 测试代码生成 | — | ✅ 三个impl Skill |
| 代码可编译验证 | — | ✅ npm run build / tsc --noEmit |
| 项目可启动验证 | — | ✅ npm run dev + /health 200 |

## 跨模块数据流

| 数据契约 | 生产方 | 消费方 |
|----------|--------|--------|
| PRD | PM design-prd | api-design-spec / data-architecture-spec / backend-architecture-spec |
| OpenAPI契约 | api-design-spec | UI api-integration / data-architecture-spec / backend-architecture-spec |
| 安全策略 | api-design-spec | api-design-impl |
| 认证鉴权方案 | api-design-spec | api-design-impl |
| ER模型 | data-architecture-spec | data-architecture-impl / backend-architecture-spec |
| 缓存策略 | data-architecture-spec | data-architecture-impl / backend-architecture-spec |
| 架构方案 | backend-architecture-spec | backend-architecture-impl |
| 审查报告 | backend-architecture-spec | PM quality-acceptance |
| API覆盖报告 | api-design-impl | PM quality-acceptance |
