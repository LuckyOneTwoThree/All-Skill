# 模块：后端架构

## 定位

后端系统的架构决策层与代码实现。基于业务规模选择架构模式，通过领域驱动设计服务边界，审查架构质量确保可扩展，再基于设计产出生成项目入口、配置、服务层、容器化和CI/CD代码。本Skill统一负责应用入口（app.ts），整合api-design-impl和data-architecture-impl的代码产出。目标是**架构服务于业务，简单方案优先，按需演进**。

## 何时使用

- 需要确定后端架构模式（单体/微服务/Serverless）
- 需要按领域驱动设计拆分服务
- 需要审查后端架构的性能、安全、可维护性和可扩展性
- 需要生成项目脚手架、Docker配置和CI/CD配置
- 需要整合API层和数据层代码为可启动项目

## 子模块与编排器

| 子模块 | 编排器 | 作用 | 何时调用 |
|--------|--------|------|----------|
| 后端架构 | backend-architecture-orchestrator | 协调架构设计规范和代码实现的完整流程 | 需要设计并实现后端架构时 |

## Pipeline Skill 清单

### 后端架构设计规范（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| backend-architecture-spec | 评估架构模式、设计服务拆分、执行架构审查、登记技术债 | PRD、业务规模 | architecture_decision.json + service_design.json + tech_stack_decision.json |

### 后端架构代码实现（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| backend-architecture-impl | 生成项目入口、配置、服务层、容器化、CI/CD，整合API层和数据层代码 | 架构方案、服务设计、API契约、数据模型 | 项目代码 + impl-report.json + architecture-coverage.json |

## 执行顺序

```
阶段1                阶段2
┌──────────────┐  ┌──────────────┐
│ 架构设计规范  │→│ 架构代码实现  │
│ 模式+服务+审查│  │ 入口+配置+CI │
└──────────────┘  └──────────────┘
```

- 架构模式是决策基础，服务设计基于模式展开
- 服务设计遵循领域驱动，边界由业务决定
- 审查闭环，P0问题不通过不进入开发
- 实现阶段统一负责app.ts，整合API层和数据层产出

## 输出路径

```
output/backend-architecture/
├── backend-architecture-spec/  ← 设计规范产出
│   ├── architecture_decision.json
│   ├── adr.json
│   ├── service_design.json
│   ├── service_data_ownership.json
│   ├── tech_stack_decision.json
│   ├── review_report.json
│   └── tech_debt_register.json
└── backend-architecture-impl/  ← 实现报告产出
    ├── impl-report.json
    └── architecture-coverage.json

{project_dir}/                  ← 代码文件直接写入项目目录
├── src/
│   ├── app.ts
│   ├── config/
│   ├── services/coordinator/
│   ├── clients/
│   ├── errors/
│   ├── health/
│   ├── utils/logger.ts
│   └── __tests__/integration/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── .github/workflows/
```

## 阶段卡口

### 进入代码实现前需满足：
- 架构模式+服务设计+审查报告+技术债登记完整
- P0问题=0
- 人类审查设计产出通过

### 代码实现完成需满足：
- 项目可启动，/health返回200
- 架构决策100%在代码中体现
- 统一对齐检查通过
- 代码自审P0=0

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 架构模式选择 | 单体/微服务/Serverless，人类最终确认 |
| 服务拆分粒度 | 拆分过细增加复杂度，拆分过粗失去灵活性 |
| 技术栈确认 | 确认统一技术栈决策，影响后续所有实现 |
| 服务数据归属确认 | 确认每个服务拥有的数据实体，影响数据架构设计 |
| 演进节奏 | 何时从单体演进到微服务，人类决定 |
| P1问题处理 | 修复还是接受为技术债务 |
| 设计审查确认 | 审查架构设计是否满足需求，确认后才进入代码实现 |
| 架构就绪确认 | 代码实现完成，人类确认架构可进入开发 |

## 核心信念

- 架构服务于业务，不追求技术先进性
- 从简单开始，按需演进，不一步到位
- 每个架构决策可追溯
- 架构复杂度与团队能力匹配
- 统一入口，整合API层和数据层产出
