---
name: backend-architecture-orchestrator
description: 当需要设计后端架构、选择架构模式或进行架构审查时使用。后端架构指挥官，协调backend-architecture-spec（设计）和backend-architecture-impl（实现）两个子Skill的完整流程，确保后端架构合理、可扩展、高质量，设计产出经人类审查后再生成代码。关键词：后端架构、架构模式、服务设计、架构审查、技术架构、微服务、系统架构、代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "orchestrator"
  version: "4.0"
  domain_tags: ["电商", "SaaS", "金融", "通用"]
  trigger_examples:
    - "设计后端架构"
    - "选择架构模式"
    - "设计微服务"
    - "做一下架构审查"
---

# 后端架构指挥官

## 核心原则

架构服务于业务，简单方案优先，按需演进。设计先行，审查后实现。

## 执行步骤

1. **模式先行**：先确定架构模式，再设计服务
2. **领域驱动**：服务边界由业务领域决定
3. **审查闭环**：审查不通过则回退修复
4. **演进式**：从简单开始，按需演进
5. **设计审查**：设计产出必须经人类审查确认后，才进入代码实现

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline 定义

```yaml
pipeline: backend-architecture-orchestrator
version: 5.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/backend-architecture-orchestrator.md

stages:
  - id: phase-1
    name: "后端架构设计规范"
    skills:
      - backend-architecture-spec
    gate:
      condition: "架构模式+ADR+服务设计+服务数据归属+技术栈决策完整 + P0问题=0 + 人类审查通过"
      fail_action: "P0问题必须修复后才能通过"

  - id: phase-2
    name: "后端架构代码实现"
    depends_on: [phase-1]
    skills:
      - backend-architecture-impl
    gate:
      condition: "项目可启动 + /health返回200 + 架构决策100%在代码中体现 + 统一对齐检查通过 + 代码自审P0=0 + 人类确认通过"
      fail_action: "缺失项补充后重新验证"
```

## 阶段执行计划

#### 阶段1：后端架构设计规范

#### 调用 backend-architecture-spec

```
Skill: backend-architecture-spec
输入:
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  业务规模: 用户提供
  技术约束: 用户提供（可选）
输出: output/backend-architecture/backend-architecture-spec/
关键产出:
  - architecture_decision.json — 架构方案+拓扑图
  - service_design.json — 服务划分+限界上下文
  - service_data_ownership.json — 服务数据归属（供data-architecture-spec消费）
  - tech_stack_decision.json — 技术栈决策（供所有impl Skill统一消费）
  - adr.json — 架构决策记录
  - review_report.json — 审查问题清单
  - tech_debt_register.json — 技术债登记册
验证: 架构模式+ADR+服务设计+服务数据归属+技术栈决策完整，P0问题=0
模式: 🤖→👤
内部步骤:
  1. 架构模式评估与选择：单体/微服务/Serverless，生成拓扑图
  2. 架构决策记录：为每个决策生成ADR
  3. 服务设计：DDD限界上下文+服务拆分+通信方案+服务数据归属
  4. 后端审查：性能/安全/可维护/可扩展审查
  5. 技术债登记：识别和登记技术债
```

⏸ **设计审查卡口**：架构模式+服务设计+审查报告+技术债登记完整 + P0问题=0 → 人类审查设计产出 → 审查通过后进入代码实现

#### 阶段2：后端架构代码实现

#### 调用 backend-architecture-impl

```
Skill: backend-architecture-impl
输入:
  架构方案: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  服务设计: output/backend-architecture/backend-architecture-spec/service_design.json
  ADR: output/backend-architecture/backend-architecture-spec/adr.json
  审查报告: output/backend-architecture/backend-architecture-spec/review_report.json（可选）
  技术债登记册: output/backend-architecture/backend-architecture-spec/tech_debt_register.json（可选）
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json（可选）
  API契约: output/backend-api-design/api-design-spec/openapi.yaml
  数据模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  缓存策略: output/backend-data-architecture/data-architecture-spec/cache_strategy.json（可选）
  project_dir: 用户提供
  tech_stack: 用户提供（可选，tech_stack_decision.json未提供时使用）
输出: output/backend-architecture/backend-architecture-impl/ + 代码写入 {project_dir}/
验证: 项目可启动，/health返回200，架构决策100%在代码中体现，统一对齐检查通过，代码自审P0=0
模式: 🤖→👤
内部步骤:
  1. 项目入口和配置生成：app.ts+config（整合api-design-impl路由+data-architecture-impl数据库/缓存）
  2. 服务层和通信层生成：services+clients
  3. 基础设施代码生成：errors+logger+health
  4. 容器化和CI/CD生成：Docker+CI+package.json
  5. 架构对齐检查与代码自审：app.ts整合+Service对齐+配置多环境+Docker可构建+CI完整+统一对齐检查
  6. 架构测试代码生成：健康检查+契约测试+构建验证测试
```

### 阶段总结（post_pipeline）

遵循 [orchestrator-protocol.md](../../../../templates/orchestrator-protocol.md) 阶段总结协议。

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/backend-architecture/ |
| 总结输出路径 | output/phase-reports/backend/backend-architecture-orchestrator.md |

下游衔接:
  primary: （设计阶段由backend-orchestrator统一协调，此编排器可单独调用时下游为release-orchestrator）
  alternatives:
    - target: data-architecture-orchestrator
      reason: 架构方案确定后进入数据架构设计
      condition: 需要设计数据模型时
    - target: ui-orchestrator
      reason: 后端就绪后启动UI前端开发与集成
      condition: 前端尚未开发，需要后端API支撑时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 后端架构设计完成 | backend-architecture-spec输出文件已生成且非空 | P0问题必须修复后才能通过 |
| 设计审查通过 | 人类审查设计产出并确认 | 人类修改意见反馈后重新设计 |
| 后端架构代码实现完成 | backend-architecture-impl输出文件已生成且非空 | 缺失项补充后重新验证 |
| 阶段总结已生成 | output/phase-reports/backend/backend-architecture-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 架构模式选择 | backend-architecture-spec执行时 | 单体/微服务/Serverless，人类最终确认 |
| 服务拆分粒度 | backend-architecture-spec执行时 | 拆分过细增加复杂度，拆分过粗失去灵活性 |
| 技术栈确认 | backend-architecture-spec执行时 | 确认统一技术栈决策，影响后续所有实现 |
| 服务数据归属确认 | backend-architecture-spec执行时 | 确认每个服务拥有的数据实体，影响数据架构设计 |
| 演进节奏 | backend-architecture-spec执行时 | 何时从单体演进到微服务，人类决定 |
| P1问题处理 | backend-architecture-spec执行时 | 修复还是接受为技术债务 |
| 设计审查确认 | backend-architecture-spec完成后 | 审查架构设计是否满足需求，确认后才进入代码实现 |
| 架构就绪确认 | backend-architecture-impl审查通过后 | 代码实现完成，人类确认架构可进入开发 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD缺失 | 无法设计架构，输出为空 |
| 业务规模未指定 | 默认中等规模（用户量1万，QPS 100，数据量10GB，团队5人），标注"规模待确认" |
| 架构模式争议 | 提供单体+微服务双方案对比，人类决策 |
| 服务循环依赖 | 自动检测并告警，必须消除后才能进入审查 |
| 审查P0问题 | 必须修复后才能通过设计审查 |
| 设计审查不通过 | 根据人类修改意见调整设计，重新审查 |
| 代码自审P0问题 | 自动修复后重新自审，无法修复则阻塞输出 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
