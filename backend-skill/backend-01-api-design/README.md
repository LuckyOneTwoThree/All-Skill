# 模块：API设计

## 定位

后端API层的设计与实现。基于PRD和已确认的数据模型设计API契约、安全策略和认证鉴权方案，再基于设计产出生成可运行的路由、Controller、Service、中间件和类型代码。目标是**数据驱动契约，字段有据可依，设计审查后实现**。

## 何时使用

- 产品需求已明确，需要设计后端API接口
- 需要定义API契约供前端并行开发
- 需要设计API安全策略和限流规则
- 需要设计用户认证和权限管理方案
- 需要基于API设计产出直接生成可运行代码

## 子模块与编排器

| 子模块 | 编排器 | 作用 | 何时调用 |
|--------|--------|------|----------|
| API设计 | api-design-orchestrator | 协调API设计规范和代码实现的完整流程 | 需要设计并实现后端API时 |

## Pipeline Skill 清单

### API设计规范（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| api-design-spec | 基于PRD和数据模型设计RESTful/GraphQL接口契约、安全策略和认证鉴权方案 | PRD、数据模型、架构方案 | openapi.yaml + security-policy.json + auth-scheme.json |

### API代码实现（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| api-design-impl | 基于设计产出生成可运行的路由、Controller、Service、中间件和类型代码 | OpenAPI规范、安全策略、数据层实现报告 | 项目代码 + impl-report.json |

## 执行顺序

```
阶段1                阶段2
┌──────────────┐  ┌──────────────┐
│ API设计规范   │→│ API代码实现   │
│ 契约+安全+鉴权│  │ 路由+逻辑+测试│
└──────────────┘  └──────────────┘
```

- 设计先行，审查后实现
- API契约基于已确认的数据模型设计，字段定义有据可依
- 安全内建而非外挂，与契约同步设计
- 实现阶段消费数据层实现报告，Service调用真实Repository

## 输出路径

```
output/backend-api-design/
├── api-design-spec/       ← 设计规范产出
│   ├── openapi.yaml
│   ├── security-policy.json
│   ├── auth-scheme.json
│   ├── compliance-checklist.json
│   └── api-coverage.json
└── api-design-impl/       ← 实现报告产出
    └── impl-report.json

{project_dir}/src/         ← 代码文件直接写入项目目录
├── routes/
├── controllers/
├── services/
├── validators/
├── middleware/
├── types/
└── __tests__/routes/
```

## 阶段卡口

### 进入代码实现前需满足：
- API契约+安全策略+认证鉴权方案完整
- 人类审查设计产出通过

### 代码实现完成需满足：
- 代码可编译
- PRD功能点100%覆盖
- mappers完整实现
- 代码自审P0=0

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| API风格选择 | RESTful vs GraphQL，人类确认 |
| 安全等级确认 | 标准vs高安全，影响限流/加密/审计策略 |
| 权限模型选择 | RBAC vs ABAC，影响权限管理复杂度 |
| 多租户策略 | 隔离级别影响成本和安全，人类确认 |
| 设计审查确认 | 审查API设计是否满足需求，确认后才进入代码实现 |

## 核心信念

- 契约驱动开发，前后端基于契约并行
- 数据驱动契约，API字段从ER模型精确投影
- 安全内建而非外挂
- 默认拒绝，未明确允许的一律拒绝
- 设计即规范，实现严格遵循设计产出
