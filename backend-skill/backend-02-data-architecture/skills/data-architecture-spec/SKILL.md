---
name: data-architecture-spec
description: 当需要设计数据架构时使用。数据架构设计规范产出，从PRD和架构约束自动设计业务数据字典、ER模型、表结构、索引策略、缓存方案和数据迁移方案。基于架构方案的服务数据归属划分数据边界，基于业务规则驱动范式建模。内建业务数据字典提取确保数据标准统一。产出经人类审查后，交由data-architecture-impl生成代码。关键词：数据模型、ER图、表结构、索引、缓存策略、数据迁移、数据字典、建表、数据库设计。
metadata:
  module: "后端架构与开发"
  sub-module: "数据架构"
  type: "pipeline"
  version: "5.0"
  domain_tags: ["电商", "金融", "SaaS", "通用"]
  trigger_examples:
    - "设计数据库表"
    - "建表和索引"
    - "系统响应慢怎么加缓存"
    - "Redis缓存怎么设计"
    - "改表结构"
    - "数据库升级"
  interaction_mode: "ai_suggest_human_approve"
---

# 数据架构设计规范

## 核心原则

1. **架构约束先行**：数据模型在架构边界内设计，每个服务的数据归属由架构决定
2. **业务数据标准驱动**：从PRD提取业务数据字典，确保数据定义统一
3. **范式与反范式平衡**：写密集场景遵循3NF，读密集场景适度反范式
4. **缓存有据**：每个缓存项有明确的命中率目标和失效策略
5. **迁移可回滚**：每个迁移必须有对应的回滚脚本

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 业务实体和关系需求 |
| PRD结构化数据 | JSON | 是 | output/pm-design/design-prd/prd.json | PRD机器可消费版本，包含entities[]/features[]，供数据模型设计编程式消费 |
| 架构方案 | JSON | 是 | output/backend-architecture/backend-architecture-spec/architecture_decision.json | 架构模式+拓扑图，决定数据库拆分策略 |
| 服务数据归属 | JSON | 是 | output/backend-architecture/backend-architecture-spec/service_data_ownership.json | 每个服务拥有的数据实体，决定数据模型边界 |
| 技术栈决策 | JSON | 是 | output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | 统一技术栈（含数据库类型），替代用户单独提供database_type |
| API契约 | YAML/JSON | ○ | output/backend-api-design/api-design-spec/openapi.yaml | 接口数据结构定义（API尚未设计时为空，正常情况） |
| 数据量预估 | JSON | ○ | 用户提供 | 核心表数据量级和增长速度 |
| 并发量预估 | JSON | ○ | 用户提供 | QPS/TPS峰值和均值 |
| 当前Schema | SQL/JSON | ○ | 用户提供 | 现有数据库表结构（增量项目必填） |

## 执行步骤

### Step 1: 业务数据字典提取

从PRD中提取业务数据实体定义，建立产品数据标准：

- 识别核心业务实体和属性
- 定义数据类型、约束和业务规则
- 建立实体间关系和引用完整性
- 生成业务数据字典（供下游消费）

**阶段卡口**：核心业务实体100%有数据字典定义

### Step 2: 实体识别与关系建模

从PRD、服务数据归属和数据字典中提取数据实体：

- 识别核心业务实体（名词提取）
- 按服务数据归属（service_data_ownership.json）将实体分组到对应限界上下文
- 确定实体间关系（1:1 / 1:N / N:M）
- 标注关系的基数和可选性
- 生成ER图

**关系映射规则**：
- 1:1 → 主表加外键 + UNIQUE约束
- 1:N → 子表加外键
- N:M → 创建关联表

### Step 3: 表结构与索引设计

为每个实体设计表结构（主键、外键、时间戳、软删除、状态字段等通用字段规范），设计索引策略和分库分表方案。

**架构约束适配**：
- 微服务架构：按服务数据归属决定是否需要 database-per-service
- 单体架构：所有实体在同一数据库，按限界上下文使用 schema 前缀分组
- Serverless：考虑使用 DynamoDB 等非关系型数据库的表设计

**阶段卡口**：ER图+DDL+数据字典完整

### Step 4: 缓存策略设计

识别需要缓存的数据访问模式，设计多级缓存架构、一致性策略和穿透/击穿/雪崩防护。

**缓存决策矩阵**：

| 场景 | 读写比 | 一致性要求 | 推荐缓存策略 | 一致性方案 | TTL建议 |
|------|--------|-----------|-------------|-----------|---------|
| 用户资料 | 读>>写 | 强一致 | cache-aside | 写失效（更新DB后删缓存） | 5min |
| 商品/课程列表 | 读>>>写 | 最终一致 | cache-aside + TTL | 写失效 + 短TTL兜底 | 1-5min |
| 商品/课程详情 | 读>>>写 | 最终一致 | cache-aside | 写失效 | 5-10min |
| 库存/余额 | 读≈写 | 强一致 | write-through | 写穿透（同步写DB+缓存） | 无TTL |
| 热门排行榜 | 读>>>>写 | 最终一致 | cache-aside + 预热 | 定时刷新 | 1min |
| 配置/字典 | 读>>>>>>写 | 弱一致 | cache-aside + 长TTL | 手动失效 + 长TTL | 30min |
| 会话/Token | 读>>写 | 强一致 | 分布式缓存 | 写穿透 + 短TTL | 与Token过期一致 |
| 搜索结果 | 读>>>写 | 弱一致 | 本地缓存 + 分布式缓存 | 定时刷新 | 30s-2min |

**缓存层级选择**：

| 数据量 | 访问频率 | 推荐层级 |
|--------|---------|---------|
| <100MB | 极高（>10K QPS） | 本地缓存 + 分布式缓存 |
| 100MB-1GB | 高（1K-10K QPS） | 分布式缓存 |
| >1GB | 中低 | 分布式缓存 + 按需加载 |

**穿透/击穿/雪崩防护**：

| 问题 | 成因 | 防护方案 |
|------|------|---------|
| 缓存穿透 | 查询不存在的数据 | 布隆过滤器 + 空值缓存（TTL 30s） |
| 缓存击穿 | 热点Key过期瞬间大量请求 | 互斥锁（只允许一个请求回源） + 永不过期（异步刷新） |
| 缓存雪崩 | 大量Key同时过期 | TTL加随机偏移（±10%） + 多级缓存过期时间错开 |

**阶段卡口**：穿透/击穿/雪崩防护全覆盖

### Step 5: 数据迁移方案

对比当前Schema和目标Schema，生成迁移脚本+回滚脚本+校验方案。新项目跳过此步骤。

**阶段卡口**：100%变更有回滚脚本，数据模型人类已确认

## 输出

**元数据输出**：output/backend-data-architecture/data-architecture-spec/

**输出文件**：
- data_dictionary.json — 业务数据字典
- er_model.json — ER模型+DDL+索引策略
- cache_strategy.json — 缓存方案
- migration_plan.json — 迁移方案（增量项目）
- data-coverage.json — API对齐覆盖报告

**er_model.json Schema**：

```json
{
  "type": "object",
  "required": ["entities", "relationships"],
  "properties": {
    "entities": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["name", "table_name", "bounded_context", "fields"],
        "properties": {
          "name": { "type": "string" },
          "table_name": { "type": "string" },
          "bounded_context": { "type": "string" },
          "fields": { "type": "array", "items": { "type": "object", "required": ["name", "type", "nullable"], "properties": { "name": { "type": "string" }, "type": { "type": "string" }, "nullable": { "type": "boolean" }, "default": {}, "constraints": { "type": "array", "items": { "type": "string" } } } } },
          "indexes": { "type": "array", "items": { "type": "object", "properties": { "name": { "type": "string" }, "fields": { "type": "array", "items": { "type": "string" } }, "unique": { "type": "boolean" }, "query_scenario": { "type": "string" } } } },
          "ddl": { "type": "string" }
        }
      }
    },
    "relationships": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["from", "to", "type"],
        "properties": {
          "from": { "type": "string" },
          "to": { "type": "string" },
          "type": { "type": "string", "enum": ["1:1", "1:N", "N:M"] },
          "through": { "type": "string" },
          "foreign_key": { "type": "string" }
        }
      }
    }
  }
}
```

**cache_strategy.json Schema**：

```json
{
  "type": "object",
  "required": ["strategies"],
  "properties": {
    "strategies": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["entity", "cache_type", "ttl", "invalidation"],
        "properties": {
          "entity": { "type": "string" },
          "cache_type": { "type": "string", "enum": ["local", "distributed", "multi-level"] },
          "ttl": { "type": "string" },
          "invalidation": { "type": "string", "enum": ["write-through", "write-behind", "cache-aside"] },
          "penetration_protection": { "type": "boolean" },
          "breakdown_protection": { "type": "boolean" },
          "avalanche_protection": { "type": "boolean" }
        }
      }
    }
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 写密集场景 | 遵循3NF |
| 读密集场景 | 适度反范式 |
| 读写比>10:1 | 高缓存价值 |
| 热点数据 | 多级缓存+预热 |
| 大表迁移 | 在线DDL或双写策略 |
| 多租户+租户数>100 | 共享数据库+tenant_id |

## 质量检查

- [ ] 核心业务实体100%有数据字典定义
- [ ] 每个实体有完整的表结构设计
- [ ] 索引有明确的查询场景支撑
- [ ] 穿透/击穿/雪崩防护全覆盖
- [ ] 迁移脚本100%有回滚脚本
- [ ] API数据需求100%有Model字段覆盖

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 架构方案缺失 | 默认单体架构，所有实体同一数据库 | 数据库拆分策略可能不匹配 |
| 服务数据归属缺失 | 从PRD推导实体归属，标注"服务归属待确认" | 数据模型边界可能不准确 |
| 技术栈决策缺失 | 默认PostgreSQL + Prisma | SQL方言和ORM可能不匹配 |
| API契约缺失 | 正常情况，API尚未设计，数据模型基于PRD+服务数据归属独立设计 | 无API对齐覆盖报告 |
| PRD缺失 | 无法设计数据架构 | 输出为空 |
| 当前Schema缺失 | 仅设计新表结构，不生成迁移脚本 | 无迁移方案 |
| 并发量预估缺失 | 按中等并发设计缓存 | 缓存方案可能不足或过度 |

## 上游变更响应

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD实体增删 | 数据模型+数据字典 | 标注受影响的实体，生成变更清单 |
| 架构方案变更 | 数据库拆分策略 | 重新评估 database-per-service 需求，调整数据模型边界 |
| 服务数据归属变更 | 实体分组+表结构 | 重新划分实体归属，评估跨服务数据迁移需求 |
| API契约变更 | 表结构和索引 | 标注受影响的字段，评估迁移需求 |

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| ER模型变更 | api-design-spec, data-architecture-impl, backend-architecture-impl | 标注受影响的实体和字段，更新er_model.json |
| 缓存策略变更 | data-architecture-impl, backend-architecture-impl | 标注受影响的缓存配置，更新cache_strategy.json |
| 数据字典变更 | api-design-spec | 标注受影响的字段命名和类型，更新data_dictionary.json |
