---
name: architecture-pattern
description: 当需要选择和设计后端架构模式时使用。架构模式自动选择与设计，基于业务规模、团队能力和技术约束，自动评估并推荐后端架构模式（单体/微服务/Serverless），输出架构决策记录和系统拓扑图。关键词：架构模式、微服务、单体架构、Serverless、架构决策、系统拓扑。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 18: 架构模式自动选择与设计

## 核心原则

1. **适度架构**：架构服务于业务，不追求技术先进性
2. **演进式架构**：从简单开始，按需演进，不一步到位
3. **决策可追溯**：每个架构决策有明确的理由和上下文
4. **团队适配**：架构复杂度与团队能力匹配

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 业务规模 | JSON | 是 | 用户提供 | 用户量、QPS、数据量、团队规模 |
| 技术约束 | JSON | ○ | 用户提供 | 技术栈、运维能力、预算 |
| PRD | markdown | ○ | output/pm-design/design-prd/prd.md | 业务需求上下文 |

## 执行步骤

### Step 1: 架构模式评估

基于多维度评估推荐架构模式：

| 评估维度 | 单体 | 微服务 | Serverless |
|----------|------|--------|------------|
| 团队规模<5人 | ⭐⭐⭐ | ⭐ | ⭐⭐ |
| 团队规模5-20人 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| 团队规模>20人 | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| QPS<1000 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| QPS 1000-10000 | ⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| QPS>10000 | ⭐ | ⭐⭐⭐ | ⭐⭐ |
| 快速迭代需求 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| 独立部署需求 | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| 运维能力弱 | ⭐⭐⭐ | ⭐ | ⭐⭐⭐ |
| 成本敏感 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ |

**推荐规则**：
- 总分最高者推荐，差距<3分时推荐简单方案
- 单体+模块化可作为微服务的前置阶段

### Step 2: 架构决策记录

为每个关键架构决策生成ADR（Architecture Decision Record）：

| ADR要素 | 内容 |
|----------|------|
| 标题 | 决策名称 |
| 上下文 | 决策背景和约束 |
| 决策 | 选择方案及理由 |
| 备选方案 | 考虑过的其他方案 |
| 影响 | 决策带来的影响和风险 |
| 状态 | 提议/已接受/已废弃 |

### Step 3: 系统拓扑设计

设计系统拓扑图：

**单体架构拓扑**：
```
客户端 → Nginx → 应用服务器(模块化) → 数据库
                              ↓
                           缓存/消息队列
```

**微服务架构拓扑**：
```
客户端 → API网关 → 服务A → 数据库A
                 → 服务B → 数据库B
                 → 服务C → 缓存 + 数据库C
                              ↓
                         消息队列 → 异步处理
```

**Serverless架构拓扑**：
```
客户端 → CDN → API网关 → Lambda函数A → DynamoDB
                         → Lambda函数B → S3
                         → Lambda函数C → SQS → Lambda函数D
```

### Step 4: 技术选型

基于架构模式推荐技术栈：

| 技术领域 | 单体推荐 | 微服务推荐 | Serverless推荐 |
|----------|---------|-----------|---------------|
| 语言 | Java/Go/Python | Go/Java/Node.js | Python/Node.js/Go |
| 框架 | Spring Boot/Gin/FastAPI | Spring Cloud/Go-Micro | AWS Lambda/Cloud Functions |
| 数据库 | MySQL/PostgreSQL | MySQL+Redis+ES | DynamoDB/RDS |
| 消息队列 | Redis Stream | Kafka/RabbitMQ | SQS/EventBridge |
| 服务发现 | 无 | Consul/Nacos | 无（平台托管） |
| 配置中心 | 配置文件 | Nacos/Apollo | 环境变量/SSM |
| 监控 | Prometheus+Grafana | SkyWalking+Prometheus | CloudWatch/X-Ray |

### Step 5: 演进路线图

设计架构演进路线：

| 阶段 | 架构 | 触发条件 | 预期时间 |
|------|------|---------|---------|
| V1 | 模块化单体 | 初始阶段 | 0-6个月 |
| V2 | 模块化单体+异步 | QPS>1000或需要异步处理 | 6-12个月 |
| V3 | 核心服务拆分 | 团队>10人或独立部署需求 | 12-18个月 |
| V4 | 完整微服务 | 团队>20人或业务域清晰 | 18-36个月 |

## 输出

**存储路径**：`output/backend-architecture/architecture-pattern/`

**输出文件**：architecture-decision.json, topology.mmd

```json
{
  "recommendation": {
    "pattern": "模块化单体",
    "confidence": "high",
    "reason": "团队5人+QPS<5000+快速迭代需求，模块化单体兼顾开发效率和未来演进"
  },
  "adr": [
    { "id": "ADR-001", "title": "选择模块化单体而非微服务", "status": "accepted" }
  ],
  "topology": {
    "pattern": "模块化单体",
    "components": ["Nginx", "App Server", "MySQL", "Redis", "MinIO"],
    "diagram": "topology.mmd"
  },
  "tech_stack": {
    "language": "Go",
    "framework": "Gin",
    "database": "MySQL 8.0 + Redis 7",
    "message_queue": "Redis Stream",
    "monitoring": "Prometheus + Grafana"
  },
  "evolution": {
    "current_stage": "V1",
    "next_trigger": "QPS>1000 或 团队>10人",
    "next_pattern": "核心服务拆分"
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 团队<5人 + QPS<1000 | 推荐单体 |
| 团队5-20人 + QPS 1000-10000 | 推荐模块化单体→微服务演进 |
| 团队>20人 + QPS>10000 | 推荐微服务 |
| 运维能力弱 + 预算充足 | 推荐Serverless |
| 快速验证MVP | 推荐单体或Serverless |
| 两种方案得分差<3 | 推荐简单方案 |

## 质量检查

- [ ] 架构推荐有量化评估支撑（非主观判断）
- [ ] 每个关键决策有ADR记录
- [ ] 系统拓扑图覆盖全部核心组件
- [ ] 技术选型与架构模式匹配
- [ ] 演进路线图有明确的触发条件

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 业务规模缺失 | 默认小团队+低QPS，推荐单体 | 架构可能过于简单 |
| 技术约束缺失 | 不限制技术选型 | 推荐可能与团队技术栈不匹配 |
| PRD缺失 | 基于业务规模推断 | 架构决策缺乏业务上下文 |

数据获取说明：
- 本Skill需要业务规模信息，请通过以下方式之一提供：
  1. 描述团队规模、用户量、QPS和预算
  2. 上传PRD文档
  3. 描述当前技术栈和运维能力
