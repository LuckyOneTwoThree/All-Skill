---
name: cache-strategy
description: 当需要设计缓存策略时使用。缓存策略自动设计，为系统设计多级缓存架构、缓存一致性策略和穿透防护方案，确保高并发场景下的数据访问性能和一致性。关键词：缓存策略、Redis、多级缓存、缓存一致性、缓存穿透、缓存雪崩。
metadata:
  module: "后端架构与开发"
  sub-module: "数据架构"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 17: 缓存策略自动设计

## 核心原则

1. **缓存有据**：每个缓存项有明确的命中率目标和失效策略
2. **一致性显式**：缓存与数据库的一致性策略显式定义，不隐式假设
3. **防御先行**：穿透/击穿/雪崩防护是标配，不是可选
4. **可观测**：缓存命中率/内存使用/淘汰频率可监控

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 数据模型 | JSON | 是 | output/backend-data-architecture/data-model/er_model.json | 数据实体和访问模式 |
| API契约 | YAML/JSON | 是 | output/backend-api-design/api-contract/openapi.yaml | 接口读写模式 |
| 并发量预估 | JSON | ○ | 用户提供 | QPS/TPS峰值和均值 |

## 执行步骤

### Step 1: 缓存需求识别

识别需要缓存的数据访问模式：

| 访问模式 | 缓存价值 | 典型场景 |
|----------|---------|---------|
| 读多写少（读写比>10:1） | 高 | 课程详情、用户信息、配置数据 |
| 热点数据（Top10%占90%流量） | 高 | 首页推荐、热门课程 |
| 计算密集型查询 | 高 | 统计报表、排行榜 |
| 实时性要求低（可接受秒级延迟） | 高 | 搜索索引、推荐列表 |
| 写多读少 | 低 | 日志、审计记录 |
| 强一致性要求 | 低 | 余额、库存 |

### Step 2: 多级缓存架构设计

设计多级缓存架构：

| 缓存层级 | 技术 | 容量 | 延迟 | 适用数据 |
|----------|------|------|------|---------|
| L1 本地缓存 | Caffeine / Guava | 100MB | <1ms | 进程内热点数据、配置 |
| L2 分布式缓存 | Redis Cluster | 10GB+ | 1-5ms | 共享热点数据、会话 |
| L3 CDN缓存 | CloudFlare / 阿里CDN | 无限 | 10-50ms | 静态资源、公共API响应 |

**缓存分层规则**：
- L1缓存TTL≤60秒，仅缓存进程级热点
- L2缓存TTL按业务需求设置（5分钟-24小时）
- L3缓存用于HTTP响应缓存（API响应+静态资源）

### Step 3: 缓存一致性策略

为每个缓存项设计一致性策略：

| 一致性策略 | 实现方式 | 一致性延迟 | 适用场景 |
|-----------|---------|-----------|---------|
| Cache Aside | 读时写缓存，写时删缓存 | 毫秒级 | 通用场景 |
| Write Through | 写时同步更新缓存 | 强一致 | 余额、库存 |
| Write Behind | 写时异步更新缓存 | 秒级 | 计数器、排行榜 |
| Double Delete | 写时删缓存→延迟500ms→再删 | 毫秒级 | 高并发读场景 |

**一致性规则**：
- 强一致性数据（余额/库存）→ Write Through 或不缓存
- 最终一致性数据（列表/统计）→ Cache Aside + TTL
- 弱一致性数据（推荐/搜索）→ Write Behind + 长TTL

### Step 4: 穿透/击穿/雪崩防护

设计三层防护方案：

| 问题 | 原因 | 防护方案 |
|------|------|---------|
| 缓存穿透 | 查询不存在的数据 | 布隆过滤器 + 空值缓存(TTL=60s) |
| 缓存击穿 | 热点Key过期瞬间 | 互斥锁(redisson) + 逻辑过期 |
| 缓存雪崩 | 大量Key同时过期 | TTL加随机偏移(±10%) + 多级缓存 |

**防护规则**：
- 所有缓存Key必须有TTL（不允许永久缓存）
- 热点Key必须有过期防护（互斥锁或逻辑过期）
- 批量缓存Key的TTL必须加随机偏移
- 缓存故障时必须有降级方案（限流+DB兜底）

### Step 5: 缓存Key设计与监控

设计缓存Key规范和监控方案：

**Key命名规范**：`{业务域}:{实体}:{标识}:{版本}`

| 示例Key | TTL | 一致性策略 |
|---------|-----|-----------|
| `course:detail:12345:v2` | 30min | Cache Aside |
| `course:list:page:1:v1` | 5min | Cache Aside |
| `user:profile:67890:v1` | 60min | Cache Aside |
| `ranking:hot-courses:v1` | 10min | Write Behind |

**监控指标**：
| 指标 | 告警阈值 |
|------|---------|
| 缓存命中率 | <80%告警 |
| 内存使用率 | >80%告警 |
| 淘汰频率 | >1000次/分钟告警 |
| 慢查询(>10ms) | >10次/分钟告警 |

## 输出

**存储路径**：`output/backend-data-architecture/cache-strategy/`

**输出文件**：cache-strategy.json

```json
{
  "cache_architecture": {
    "levels": 3,
    "l1": { "type": "local", "technology": "Caffeine", "max_size": "100MB" },
    "l2": { "type": "distributed", "technology": "Redis Cluster", "max_memory": "10GB" },
    "l3": { "type": "cdn", "technology": "CloudFlare" }
  },
  "cache_items": [
    {
      "key_pattern": "course:detail:{id}:v2",
      "ttl": "30min",
      "consistency": "cache_aside",
      "level": "L2",
      "invalidation": "write_delete"
    }
  ],
  "protection": {
    "penetration": "bloom_filter + null_cache",
    "breakdown": "mutex_lock + logical_expire",
    "avalanche": "ttl_jitter + multi_level"
  },
  "monitoring": {
    "hit_rate_threshold": "80%",
    "memory_threshold": "80%",
    "eviction_threshold": "1000/min"
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 读写比>10:1 | 强烈建议缓存，L2+L3 |
| 读写比3:1-10:1 | 建议缓存，L2 |
| 读写比<3:1 | 评估缓存收益，可能不值得 |
| 强一致性要求 | Write Through 或不缓存 |
| QPS>10000 | 必须L1+L2多级缓存 |
| QPS<1000 | L2单层缓存即可 |
| 热点Key(单Key QPS>1000) | 互斥锁+逻辑过期 |

## 质量检查

- [ ] 每个缓存项有明确的TTL和一致性策略
- [ ] 穿透/击穿/雪崩三层防护全覆盖
- [ ] 缓存Key命名规范统一
- [ ] 监控指标覆盖命中率+内存+淘汰+慢查询
- [ ] 缓存故障有降级方案

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 并发量预估缺失 | 基于API契约推导读写比 | 缓存容量规划可能不精准 |
| 数据模型缺失 | 基于API契约推导缓存需求 | 缓存项可能不完整 |
| API契约缺失 | 无法设计缓存策略 | 输出为空 |

数据获取说明：
- 本Skill需要数据模型和API契约，请通过以下方式之一提供：
  1. 上传er_model.json和openapi.yaml文件
  2. 描述核心数据实体和访问模式
  3. 提供当前QPS/TPS数据
