---
name: service-design
description: 当需要设计服务拆分方案时使用。服务设计自动生成，基于领域驱动设计，自动识别限界上下文、设计服务拆分方案、定义服务间通信和依赖治理策略。关键词：服务设计、领域驱动、DDD、限界上下文、服务拆分、依赖治理。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 19: 服务设计自动生成

## 核心原则

1. **领域驱动**：服务边界由业务领域决定，而非技术层
2. **高内聚低耦合**：服务内部高内聚，服务间低耦合
3. **数据自治**：每个服务拥有自己的数据，不共享数据库
4. **依赖单向**：服务间依赖关系无循环

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 业务领域和流程 |
| 数据模型 | JSON | 是 | output/backend-data-architecture/data-model/er_model.json | 数据实体和关系 |
| 架构模式 | JSON | 是 | output/backend-architecture/architecture-pattern | 选择的架构模式 |

## 执行步骤

### Step 1: 领域识别

从PRD中识别业务领域和子域：

| 子域类型 | 识别标准 | 示例 |
|----------|---------|------|
| 核心域 | 业务核心竞争力，差异化价值 | 课程管理、学习引擎 |
| 支撑域 | 支撑核心业务，非差异化 | 用户管理、支付 |
| 通用域 | 行业通用功能 | 通知、文件存储 |

**领域识别规则**：
- 每个核心业务实体属于一个子域
- 跨子域的实体关系通过事件/接口解耦
- 子域数量控制在3-8个

### Step 2: 限界上下文划分

将子域划分为限界上下文：

| 划分依据 | 规则 |
|----------|------|
| 语言边界 | 同一术语在不同上下文中含义不同时拆分 |
| 数据边界 | 数据被独立使用和管理时拆分 |
| 团队边界 | 不同团队负责时拆分 |
| 变化频率 | 变化节奏差异大时拆分 |

**上下文映射模式**：
| 模式 | 适用场景 |
|------|---------|
| 共享内核 | 两个上下文共享部分模型 |
| 防腐层 | 下游上下文对上游模型做适配 |
| 开放主机服务 | 上游提供标准API供下游使用 |
| 发布-订阅 | 上下文间通过事件异步通信 |

### Step 3: 服务拆分设计

将限界上下文映射为服务：

| 设计要素 | 规范 |
|----------|------|
| 服务粒度 | 一个限界上下文=一个服务 |
| 服务命名 | {领域}-service（如course-service） |
| 数据归属 | 每个服务独占自己的数据库/Schema |
| API暴露 | 通过API网关统一暴露，服务间通过内部API通信 |
| 事件发布 | 数据变更发布领域事件 |

**服务拆分检查**：
- 单服务代码量≤50000行
- 单服务团队≤8人
- 服务间同步调用≤3层
- 无循环依赖

### Step 4: 服务间通信设计

设计服务间通信方案：

| 通信方式 | 适用场景 | 技术选型 |
|----------|---------|---------|
| 同步REST | 需要即时响应的查询 | HTTP/gRPC |
| 异步事件 | 数据变更通知、解耦 | Kafka/RabbitMQ |
| 批量同步 | 大数据量传输 | 文件/消息队列 |
| 查询API | 跨服务数据聚合 | API组合/BFF |

**通信规则**：
- 写操作优先异步事件
- 读操作可同步查询
- 跨服务事务使用Saga模式
- 服务间调用有超时和重试策略

### Step 5: 依赖治理

设计服务依赖治理策略：

| 治理措施 | 规范 |
|----------|------|
| 依赖方向 | 只允许单向依赖，无循环 |
| 接口版本 | 语义化版本，向后兼容 |
| 破坏性变更 | 先新增→再迁移→最后废弃（≥2个版本周期） |
| 接口文档 | OpenAPI规范，自动生成 |
| 契约测试 | 消费者驱动契约测试（Pact） |
| 依赖监控 | 依赖拓扑图+调用链追踪 |

## 输出

**存储路径**：`output/backend-architecture/service-design/`

**输出文件**：service-design.json

```json
{
  "domains": {
    "core": ["course-management", "learning-engine"],
    "supporting": ["user-management", "payment"],
    "generic": ["notification", "file-storage"]
  },
  "bounded_contexts": [
    {
      "name": "course-management",
      "domain": "core",
      "entities": ["Course", "Lesson", "Chapter"],
      "service": "course-service",
      "database": "course_db",
      "api_endpoints": 12,
      "events_published": ["course.created", "course.updated", "course.published"]
    }
  ],
  "context_map": {
    "relationships": [
      { "from": "course-management", "to": "user-management", "pattern": "open_host_service" },
      { "from": "learning-engine", "to": "course-management", "pattern": "conformist" },
      { "from": "payment", "to": "course-management", "pattern": "anticorruption_layer" }
    ]
  },
  "communication": {
    "sync": "gRPC",
    "async": "Kafka",
    "saga": "choreography"
  },
  "dependency_graph": {
    "has_cycles": false,
    "max_depth": 2,
    "services": 6
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 架构模式=单体 | 不拆分服务，按模块组织 |
| 架构模式=微服务 | 按限界上下文拆分 |
| 两个上下文强依赖 | 合并为一个上下文 |
| 服务间同步调用>3层 | 评估合并或引入事件解耦 |
| 存在循环依赖 | 必须消除，引入事件或中间层 |
| 单服务团队>8人 | 评估进一步拆分 |

## 质量检查

- [ ] 限界上下文覆盖全部业务领域
- [ ] 服务间依赖无循环
- [ ] 每个服务有独立的数据归属
- [ ] 服务间通信方案明确（同步/异步）
- [ ] 领域事件覆盖核心数据变更
- [ ] 上下文映射关系完整

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 架构模式=单体 | 不做服务拆分，输出模块划分方案 | 无微服务相关设计 |
| 数据模型缺失 | 基于PRD推导数据实体 | 服务数据归属可能不准确 |
| PRD缺失 | 无法识别业务领域 | 输出为空 |

数据获取说明：
- 本Skill需要PRD和数据模型，请通过以下方式之一提供：
  1. 上传prd.md和er_model.json文件
  2. 描述核心业务领域和流程
  3. 提供现有系统架构信息
