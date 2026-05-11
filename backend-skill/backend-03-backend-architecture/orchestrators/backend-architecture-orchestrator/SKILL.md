---
name: backend-architecture-orchestrator
description: 后端架构指挥官。协调架构模式选择、服务设计和后端审查的完整流程，确保后端架构合理、可扩展、高质量。关键词：后端架构、架构模式、服务设计、架构审查。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "orchestrator"
  version: "1.0"
---

# 后端架构指挥官

## 核心原则

架构服务于业务，简单方案优先，按需演进。

## 执行步骤

1. **模式先行**：先确定架构模式，再设计服务
2. **领域驱动**：服务边界由业务领域决定
3. **审查闭环**：审查不通过则回退修复
4. **演进式**：从简单开始，按需演进

## 任务调度

```
architecture-pattern → service-design → backend-review
```

| 阶段 | 任务 | 执行模式 |
|------|------|----------|
| 1 | architecture-pattern | 🤖→👤 AI建议，人类审批 |
| 2 | service-design | 🤖→👤 AI建议，人类审批 |
| 3 | backend-review | 🤖 AI自动执行 |

### 数据流转

```
[业务需求 + API契约 + 数据模型]
       ↓
architecture-pattern
       ↓ architecture_decision (pattern: monolithic / microservices / serverless / evolution_roadmap / tech_stack)
service-design
       ↓ service_architecture (bounded_contexts / service_boundaries / communication: sync / async / dependency_graph / api_composition)
backend-review
       ↓ review_report (performance / security / maintainability / scalability / issues: P0 / P1 / P2 / fix_suggestions)
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 业务需求+API契约+数据模型就绪 | → architecture-pattern（架构模式选择） |
| 架构模式人类确认完成 | → service-design（服务设计） |
| 服务设计人类确认完成 | → backend-review（后端审查） |
| 审查P0问题>0 | → 回退到对应阶段修复 |
| 审查P0问题=0 | → 标注"架构就绪，可进入开发" |

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/backend-architecture/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 架构模式确认 | 人类确认架构模式和演进路线 | 不确认则不进入服务设计 |
| 服务设计完成 | 服务间无循环依赖+数据归属明确 | 循环依赖必须消除 |
| 后端审查完成 | P0问题=0 | P0问题必须修复后才能进入开发 |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 架构模式选择 | 单体/微服务/Serverless，人类最终确认 |
| 服务拆分粒度 | 拆分过细增加复杂度，拆分过粗失去灵活性 |
| 演进节奏 | 何时从单体演进到微服务，人类决定 |
| P1问题处理 | 修复还是接受为技术债务 |
| 架构就绪确认 | 后端审查通过后，人类确认架构方案可进入开发 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 业务需求不完整 | 基于PRD推断业务领域，标注"推断值" |
| API契约缺失 | 基于PRD推断接口需求，标注"API契约待确认" |
| 架构模式争议 | 提供单体+微服务双方案对比，人类决策 |
| 服务循环依赖 | 自动检测并告警，必须消除后才能进入审查 |
| 审查P0问题 | 必须修复后才能进入开发阶段 |
