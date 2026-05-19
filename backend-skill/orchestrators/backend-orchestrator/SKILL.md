---
name: backend-orchestrator
description: 当需要完成后端从设计到代码实现的全流程时使用。后端全流程指挥官，协调"先全量设计、再统一实现"的两阶段流程：设计阶段按架构→数据→API顺序产出设计规范，经统一设计审查后，实现阶段按数据→API→架构顺序生成可运行代码。关键词：后端全流程、后端开发、后端设计+实现、后端整体方案。
metadata:
  module: "后端架构与开发"
  sub-module: "全流程编排"
  type: "orchestrator"
  version: "5.0"
  domain_tags: ["电商", "SaaS", "金融", "通用"]
  trigger_examples:
    - "完成后端开发全流程"
    - "从设计到代码一步到位"
    - "后端整体方案设计和实现"
    - "后端从零开始搭建"
---

# 后端全流程指挥官

## 核心原则

架构约束先行，数据驱动契约，设计审查闭环，实现步步可编译。

1. **架构约束先行**：架构决策从根本上影响数据模型和API设计，必须最先确定
2. **数据驱动契约**：API契约基于已确认的数据模型设计，字段定义有据可依
3. **先全量设计再统一实现**：设计阶段只产出文档，三份设计交叉验证后统一审查，避免设计冲突导致代码返工
4. **实现步步可编译**：实现阶段按数据→API→架构顺序，每步产出都可独立编译运行

## 执行步骤

1. **设计阶段串行**：架构→数据→API，后一步消费前一步产出
2. **统一设计审查**：三份设计交叉验证，确保一致性后人类统一确认
3. **实现阶段串行**：数据→API→架构，每步可编译
4. **最终验证**：项目可启动，健康检查通过

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline 定义

```yaml
pipeline: backend-orchestrator
version: 5.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/backend-orchestrator.md

stages:
  - id: design-phase
    name: "全量设计阶段"
    stages:
      - id: arch-design
        name: "架构设计"
        skills:
          - backend-architecture-spec
        gate:
          condition: "架构模式+ADR+服务设计+服务数据归属+技术栈决策完整 + 人类审查通过"
          fail_action: "缺失项必须补充"

      - id: data-design
        name: "数据架构设计"
        depends_on: [arch-design]
        skills:
          - data-architecture-spec
        gate:
          condition: "ER图+DDL+数据字典+缓存策略+迁移方案完整 + 人类审查通过"
          fail_action: "缺失项必须补充"

      - id: api-design
        name: "API设计"
        depends_on: [data-design]
        skills:
          - api-design-spec
        gate:
          condition: "API契约+安全策略+认证鉴权方案完整 + 人类审查通过"
          fail_action: "缺失项必须补充"

    gate:
      condition: "三份设计产出完整 + 统一设计审查通过（API资源与ER模型对齐 + API分组与服务边界一致 + 技术栈统一） + 人类统一确认"
      fail_action: "不一致项必须修正后重新审查"

  - id: impl-phase
    name: "统一实现阶段"
    depends_on: [design-phase]
    stages:
      - id: data-impl
        name: "数据层实现"
        skills:
          - data-architecture-impl
        gate:
          condition: "代码可编译 + Migration可执行 + 代码自审P0=0 + 人类确认通过"
          fail_action: "缺失项补充后重新验证"

      - id: api-impl
        name: "API层实现"
        depends_on: [data-impl]
        skills:
          - api-design-impl
        gate:
          condition: "代码可编译 + PRD功能点100%覆盖 + 代码自审P0=0 + 人类确认通过"
          fail_action: "缺失项补充后重新验证"

      - id: arch-impl
        name: "架构层实现"
        depends_on: [api-impl]
        skills:
          - backend-architecture-impl
        gate:
          condition: "项目可启动 + /health返回200 + 架构决策100%在代码中体现 + 代码自审P0=0 + 人类确认通过"
          fail_action: "缺失项补充后重新验证"
```

## 阶段执行计划

### 阶段A：全量设计

#### A1：架构设计 → 调用 backend-architecture-spec

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
验证: 架构模式+ADR+服务设计+服务数据归属+技术栈决策完整
模式: 🤖→👤
```

⏸ **架构设计审查卡口**

#### A2：数据架构设计 → 调用 data-architecture-spec

```
Skill: data-architecture-spec
输入:
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  架构方案: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  服务数据归属: output/backend-architecture/backend-architecture-spec/service_data_ownership.json
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  数据量预估: 用户提供（可选）
  并发量预估: 用户提供（可选）
  当前Schema: 用户提供（可选）
输出: output/backend-data-architecture/data-architecture-spec/
关键产出:
  - data_dictionary.json — 业务数据字典
  - er_model.json — ER模型+DDL+索引策略
  - cache_strategy.json — 缓存方案
  - migration_plan.json — 迁移方案（增量项目）
验证: ER图+DDL+数据字典+缓存策略完整
模式: 🤖→👤
```

⏸ **数据架构设计审查卡口**

#### A3：API设计 → 调用 api-design-spec

```
Skill: api-design-spec
输入:
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  数据模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  业务数据字典: output/backend-data-architecture/data-architecture-spec/data_dictionary.json（可选）
  架构方案: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  服务设计: output/backend-architecture/backend-architecture-spec/service_design.json
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json（可选）
  业务流程: output/pm-design/design-userflow/userflow.json（可选）
  安全等级: 用户提供
  合规要求: 用户提供（可选）
  多租户需求: 用户提供（可选）
  前端页面数据需求: output/ui-frontend/page-builder/pages.json（可选）
输出: output/backend-api-design/api-design-spec/
关键产出:
  - openapi.yaml — OpenAPI 3.0规范
  - security-policy.json — 安全策略
  - auth-scheme.json — 认证鉴权方案
  - compliance-checklist.json — 合规检查清单
  - api-coverage.json — PRD/前端对齐覆盖报告
验证: API契约+安全策略+认证鉴权方案完整，合规检查无P0问题
模式: 🤖→👤
```

⏸ **统一设计审查卡口**：三份设计交叉验证

| 交叉验证项 | 验证内容 | 未通过处理 |
|-----------|---------|-----------|
| API资源↔ER模型 | 每个API资源有对应ER模型实体，API字段100%有Model字段支撑 | 补充缺失的实体或字段 |
| API分组↔服务边界 | API按限界上下文分组，与服务设计一致 | 调整API分组或服务边界 |
| 技术栈一致性 | 三个设计产出引用的技术栈统一 | 统一技术栈决策 |
| 缓存策略↔API访问模式 | 高频API有对应缓存策略 | 补充缓存策略 |
| 数据归属↔API归属 | API资源归属的服务与数据归属的服务一致 | 调整归属关系 |

→ 人类统一确认三份设计的一致性 → 审查通过后进入实现阶段

### 阶段B：统一实现

#### B1：数据层实现 → 调用 data-architecture-impl

```
Skill: data-architecture-impl
输入:
  ER模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  缓存策略: output/backend-data-architecture/data-architecture-spec/cache_strategy.json
  迁移方案: output/backend-data-architecture/data-architecture-spec/migration_plan.json（可选）
  API契约: output/backend-api-design/api-design-spec/openapi.yaml（可选，用于API对齐检查）
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  project_dir: 用户提供
输出: 代码写入 {project_dir}/src/ + 元数据 output/backend-data-architecture/data-architecture-impl/
验证: 代码可编译，Migration可执行，代码自审P0=0
模式: 🤖→👤
```

#### B2：API层实现 → 调用 api-design-impl

```
Skill: api-design-impl
输入:
  OpenAPI规范: output/backend-api-design/api-design-spec/openapi.yaml
  安全策略: output/backend-api-design/api-design-spec/security-policy.json
  认证鉴权方案: output/backend-api-design/api-design-spec/auth-scheme.json
  合规检查清单: output/backend-api-design/api-design-spec/compliance-checklist.json（可选）
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  数据模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  数据层实现报告: output/backend-data-architecture/data-architecture-impl/impl-report.json
  前端页面数据需求: output/ui-frontend/page-builder/pages.json（可选）
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  project_dir: 用户提供
输出: 代码写入 {project_dir}/src/ + 元数据 output/backend-api-design/api-design-impl/
验证: 代码可编译，PRD功能点100%覆盖，mappers完整实现，代码自审P0=0
模式: 🤖→👤
```

#### B3：架构层实现 → 调用 backend-architecture-impl

```
Skill: backend-architecture-impl
输入:
  架构方案: output/backend-architecture/backend-architecture-spec/architecture_decision.json
  服务设计: output/backend-architecture/backend-architecture-spec/service_design.json
  ADR: output/backend-architecture/backend-architecture-spec/adr.json
  审查报告: output/backend-architecture/backend-architecture-spec/review_report.json（可选）
  技术债登记册: output/backend-architecture/backend-architecture-spec/tech_debt_register.json（可选）
  API契约: output/backend-api-design/api-design-spec/openapi.yaml
  数据模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  缓存策略: output/backend-data-architecture/data-architecture-spec/cache_strategy.json（可选）
  技术栈决策: output/backend-architecture/backend-architecture-spec/tech_stack_decision.json
  project_dir: 用户提供
输出: 代码写入 {project_dir}/ + 元数据 output/backend-architecture/backend-architecture-impl/
验证: 项目可启动，/health返回200，架构决策100%在代码中体现，代码自审P0=0
模式: 🤖→👤
```

### 阶段总结（post_pipeline）

遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 阶段总结协议。

| 参数 | 值 |
|------|-----|
| 子Skill输出路径 | output/backend-architecture/ + output/backend-data-architecture/ + output/backend-api-design/ |
| 总结输出路径 | output/phase-reports/backend/backend-orchestrator.md |

下游衔接:
  primary: release-orchestrator（后端全流程完成后，进入质量验收和发布流程）
  alternatives:
    - target: ui-orchestrator
      reason: 后端就绪后启动UI前端开发与集成
      condition: 前端尚未开发，需要后端API支撑时

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 架构设计完成 | backend-architecture-spec输出文件已生成且非空 | 缺失项必须补充 |
| 数据架构设计完成 | data-architecture-spec输出文件已生成且非空 | 缺失项必须补充 |
| API设计完成 | api-design-spec输出文件已生成且非空 | 缺失项必须补充 |
| 统一设计审查通过 | 三份设计交叉验证通过 + 人类统一确认 | 不一致项修正后重新审查 |
| 数据层实现完成 | data-architecture-impl输出文件已生成且非空 | 缺失项补充后重新验证 |
| API层实现完成 | api-design-impl输出文件已生成且非空 | 缺失项补充后重新验证 |
| 架构层实现完成 | backend-architecture-impl输出文件已生成且非空 | 缺失项补充后重新验证 |
| 阶段总结已生成 | output/phase-reports/backend/backend-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 架构模式选择 | backend-architecture-spec执行时 | 单体/微服务/Serverless，人类最终确认 |
| 服务拆分粒度 | backend-architecture-spec执行时 | 拆分过细增加复杂度，拆分过粗失去灵活性 |
| 技术栈确认 | backend-architecture-spec执行时 | 确认统一技术栈决策，影响后续所有实现 |
| 范式vs反范式 | data-architecture-spec执行时 | 读写比决定，人类确认平衡点 |
| 缓存一致性级别 | data-architecture-spec执行时 | 强一致vs最终一致，人类确认 |
| API风格选择 | api-design-spec执行时 | RESTful vs GraphQL，人类确认 |
| 安全等级确认 | api-design-spec执行时 | 标准vs高安全，影响限流/加密/审计策略 |
| 统一设计审查确认 | 三份设计完成后 | 审查三份设计的一致性，确认后才进入实现 |
| 数据迁移执行确认 | data-architecture-impl输出完成 | 迁移方案和回滚脚本生成完成，人类确认是否执行迁移 |
| 架构就绪确认 | backend-architecture-impl审查通过后 | 代码实现完成，人类确认架构可进入开发 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 架构模式争议 | 提供单体+微服务双方案对比，人类决策 |
| 服务循环依赖 | 自动检测并告警，必须消除后才能进入审查 |
| 数据模型与API冲突 | 统一设计审查阶段解决，以数据模型为准调整API |
| 设计审查不通过 | 根据人类修改意见调整设计，重新审查 |
| 代码自审P0问题 | 自动修复后重新自审，无法修复则阻塞输出 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |
