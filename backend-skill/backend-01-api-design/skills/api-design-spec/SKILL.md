---
name: api-design-spec
description: 当需要设计API规范时使用。API设计规范产出，基于已确认的数据模型和服务边界设计RESTful/GraphQL接口契约、安全策略和认证鉴权方案，生成OpenAPI 3.0规范。数据驱动契约，API字段从ER模型精确投影。内建合规检查确保API安全合规。产出经人类审查后，交由api-design-impl生成代码。关键词：API设计、接口契约、OpenAPI、RESTful、GraphQL、API安全、认证鉴权、JWT、OAuth2、RBAC、写接口、接口文档。
metadata:
  module: "后端架构与开发"
  sub-module: "API设计"
  type: "pipeline"
  version: "4.0"
  domain_tags: ["电商", "SaaS", "金融", "通用"]
  trigger_examples:
    - "设计API接口"
    - "写接口文档"
    - "定义接口规范"
    - "接口安全防护"
    - "做登录认证"
    - "设计权限系统"
  interaction_mode: "ai_suggest_human_approve"
---

# API设计规范

## 核心原则

1. **数据驱动契约**：API契约基于已确认的数据模型和服务边界设计，字段定义有据可依
2. **安全内建**：安全策略和认证鉴权与接口设计同步，不事后补丁
3. **合规默认**：隐私合规检查内建，确保API设计满足GDPR/等保等要求
4. **RESTful优先**：优先使用RESTful风格，复杂查询场景考虑GraphQL
5. **默认拒绝**：未明确允许的请求一律拒绝

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 产品需求文档 |
| PRD结构化数据 | JSON | 是 | output/pm-design/design-prd/prd.json | PRD机器可消费版本，包含features[]/entities[]，供API设计编程式消费 |
| 数据模型 | JSON | 是 | output/backend-data-architecture/data-architecture-spec/er_model.json | 数据实体和关系定义，API字段从Model精确投影 |
| 业务数据字典 | JSON | ○ | output/backend-data-architecture/data-architecture-spec/data_dictionary.json | 业务数据标准和实体定义，供字段命名和类型对齐 |
| 架构方案 | JSON | 是 | output/backend-architecture/backend-architecture-spec/architecture_decision.json | 架构模式，决定API按服务拆分还是统一入口 |
| 服务设计 | JSON | 是 | output/backend-architecture/backend-architecture-spec/service_design.json | 服务划分+限界上下文，决定API按服务分组 |
| 技术栈决策 | JSON | ○ | output/backend-architecture/backend-architecture-spec/tech_stack_decision.json | 统一技术栈，决定API框架和中间件风格 |
| 业务流程 | JSON | ○ | output/pm-design/design-userflow/userflow.json | 用户流程定义 |
| 安全等级 | string | 是 | 用户提供 | 标准 / 高安全（金融/医疗） |
| 合规要求 | string | ○ | 用户提供 | GDPR / 等保 / PCI-DSS |
| 多租户需求 | string | ○ | 用户提供 | 是否需要多租户隔离 |
| 前端页面数据需求 | JSON | ○ | output/ui-frontend/page-builder/pages.json | 前端页面数据获取需求，确保API与前端对齐 |

## 执行步骤

### Step 1: 资源识别与建模

从ER模型直接映射API资源：

- 每个核心数据实体映射为一个资源（复数名词）
- API字段从Model字段精确投影，不再凭PRD推导
- 识别资源间的关系（一对一/一对多/多对多）
- 确定资源的CRUD操作需求
- 标注哪些资源需要嵌套资源（子资源）
- 根据服务设计（service_design.json）按限界上下文分组API资源

**资源命名规范**：
- 使用复数名词：`/courses` 而非 `/course`
- 嵌套资源最多2层：`/courses/{id}/lessons`
- 使用kebab-case：`/user-groups` 而非 `/userGroups`

### Step 2: 接口与规范设计

为每个资源设计标准接口：

| 操作 | Method | Path | 说明 |
|------|--------|------|------|
| 列表查询 | GET | /resources | 分页+筛选+排序 |
| 详情查询 | GET | /resources/{id} | 单个资源详情 |
| 创建 | POST | /resources | 创建新资源 |
| 全量更新 | PUT | /resources/{id} | 替换整个资源 |
| 部分更新 | PATCH | /resources/{id} | 更新指定字段 |
| 删除 | DELETE | /resources/{id} | 删除资源 |

定义统一的请求响应格式、错误码体系和版本策略。

**服务边界适配**：
- 微服务架构：API按服务拆分，每个服务生成独立的 OpenAPI tags 或独立文件
- 单体架构：API统一入口，按限界上下文使用 tags 分组
- BFF模式：为不同前端（Web/Mobile）设计差异化API

**阶段卡口**：每个资源有CRUD定义+错误码体系+服务归属

### Step 3: 接口安全设计

按敏感度对接口分级：

| 级别 | 接口类型 | 访问控制 | 审计要求 |
|------|---------|---------|---------|
| L1-公开 | 健康检查、公开文档 | 无鉴权 | 无 |
| L2-认证 | 用户个人信息、业务查询 | Token鉴权 | 查询日志 |
| L3-授权 | 写操作、管理功能 | Token+权限校验 | 操作日志+变更记录 |
| L4-敏感 | 支付、密钥、数据导出 | Token+权限+二次验证 | 全量审计+告警 |

设计限流策略、数据安全（加密/脱敏/输入校验）、CORS和安全头。

**阶段卡口**：100%接口有安全级别+限流规则，L4接口安全策略完整

### Step 4: 认证鉴权设计

根据业务场景选择认证方案（JWT/OAuth2/SSO），设计权限模型（RBAC/ABAC），多租户隔离和会话管理。

**阶段卡口**：认证方案+权限模型+会话管理完整

### Step 5: 合规检查

内建隐私合规评估：
- 个人信息收集最小必要原则检查
- 数据跨境传输合规检查
- 用户同意机制设计
- 数据保留和删除策略
- 生成安全需求清单

**阶段卡口**：合规检查无P0问题

## 输出

**元数据输出**：output/backend-api-design/api-design-spec/

**输出文件**：
- openapi.yaml — OpenAPI 3.0规范
- security-policy.json — 安全策略
- auth-scheme.json — 认证鉴权方案
- compliance-checklist.json — 合规检查清单
- api-coverage.json — PRD/前端对齐覆盖报告

## 决策规则

| 条件 | 决策 |
|------|------|
| 资源间多对多关系 | 创建关联资源 |
| 查询条件≥5个 | 考虑提供GraphQL端点 |
| 安全等级=高安全 | L3+接口全部请求签名+全量审计 |
| 角色数≤10且固定 | 使用RBAC |
| 角色数>10或频繁变化 | 使用RBAC+权限组 |
| 多租户+租户数>100 | 共享数据库+tenant_id |
| 涉及个人隐私数据 | 强制脱敏+加密存储+合规检查 |
| 合规要求含GDPR | 数据导出接口+数据删除接口 |

## 质量检查

- [ ] 每个资源有完整的CRUD接口定义
- [ ] API资源与ER模型实体一一对应
- [ ] API请求/响应字段100%有Model字段支撑
- [ ] API分组与服务边界一致
- [ ] 100%的接口有安全级别标注
- [ ] L2+接口100%有鉴权要求
- [ ] 认证方案覆盖全部用户场景
- [ ] 权限模型覆盖全部角色和权限
- [ ] 合规检查无P0问题
- [ ] 敏感字段100%有脱敏或加密策略
- [ ] PRD功能点100%有API端点覆盖
- [ ] 前端页面数据需求100%有API对应（有前端输入时）

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 数据模型缺失 | 从PRD推导核心实体，标注"待数据模型确认" | 资源定义基于推导，字段可能不完整 |
| 架构方案缺失 | 默认单体架构，API统一入口 | API拆分策略可能不匹配 |
| 服务设计缺失 | 按资源独立设计API，标注"服务归属待确认" | API分组可能与服务边界不一致 |
| 技术栈决策缺失 | 默认Express + TypeScript | API框架风格可能不匹配 |
| 业务流程缺失 | 仅设计CRUD接口 | 缺少跨资源的业务接口 |
| PRD缺失 | 无法设计API | 输出为空 |
| 安全等级未指定 | 默认标准等级 | 可能不满足高安全要求 |
| 前端页面数据需求缺失 | 仅基于PRD设计API | 可能与前端实际需求不完全匹配 |

## 上游变更响应

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD功能点增删 | API端点增删 | 标注受影响的API端点，生成变更清单 |
| 数据模型变更 | API请求/响应结构 | 标注受影响的字段，评估向后兼容性 |
| 架构方案变更 | API分组和入口策略 | 重新评估API按服务拆分策略 |
| 服务设计变更 | API资源归属 | 重新划分API分组，评估跨服务API调整 |

| API变更类型 | 兼容性 | 通知范围 | 通知方式 |
|-------------|--------|----------|----------|
| 新增端点 | 向后兼容 | api-design-impl | 标记新增端点，实现Skill可增量生成 |
| 删除端点 | 破坏性变更 | api-design-impl | 必须人类确认，提供迁移方案 |
| 修改字段类型 | 破坏性变更 | api-design-impl | 必须人类确认，提供兼容方案 |
