---
name: data-architecture-impl
description: 当需要生成数据层代码时使用。数据层代码实现，基于data-architecture-spec产出的ER模型和表结构设计，直接生成可运行的Model、Migration、Repository和缓存层代码到项目目录。内建API对齐检查和代码自审确保代码质量。关键词：生成Model代码、生成Migration、生成Repository、生成缓存代码、数据层代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "数据架构"
  type: "pipeline"
  version: "4.0"
  domain_tags: ["电商", "金融", "SaaS", "通用"]
  trigger_examples:
    - "生成Model代码"
    - "生成Migration脚本"
    - "生成Repository代码"
    - "生成缓存层代码"
    - "建表脚本生成"
  interaction_mode: "ai_suggest_human_approve"
---

# 数据层代码实现

## 核心原则

1. **设计即规范**：严格遵循data-architecture-spec的设计产出，Model字段与DDL完全一致
2. **分层清晰**：Model仅定义数据层结构，API类型由api-design-impl的types/api.ts定义
3. **缓存对齐**：缓存层代码与缓存策略设计对齐
4. **迁移可回滚**：每个Migration脚本有对应的回滚脚本
5. **测试覆盖**：每个Model和Repository有测试骨架

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| ER模型 | JSON | 是 | output/backend-data-architecture/data-architecture-spec/er_model.json | 实体关系和DDL定义 |
| 缓存策略 | JSON | 是 | output/backend-data-architecture/data-architecture-spec/cache_strategy.json | 缓存方案 |
| 迁移方案 | JSON | ○ | output/backend-data-architecture/data-architecture-spec/migration_plan.json | 迁移方案（增量项目） |
| API契约 | YAML | 是 | output/backend-api-design/api-design-spec/openapi.yaml | 用于API对齐检查 |
| project_dir | string | 是 | 用户提供 | 项目根目录绝对路径 |
| tech_stack | string | 是 | 用户提供 | 后端技术栈（Node.js/Prisma、Node.js/TypeORM、Python/SQLAlchemy、Python/Django ORM、Go/GORM、Java/JPA） |
| database_type | string | 是 | 用户提供 | 数据库类型 |

## 执行步骤

### Step 1: Model代码生成

基于ER模型生成数据层实体代码：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| Model/Entity | src/models/（或entities/） | 每个实体一个Model文件，包含字段定义、校验规则、关联关系，仅定义数据层结构 |
| 数据库配置 | src/config/database.ts | 数据库连接配置+连接池 |

**代码质量要求**：
- Model字段类型、约束、默认值与DDL完全一致
- Model仅定义数据层结构，API类型由api-design-impl的types/api.ts定义

**阶段卡口**：代码可编译（npm run build 或 tsc --noEmit 通过），Model字段与DDL一致

### Step 2: Migration和种子数据生成

基于DDL生成迁移脚本和种子数据：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| Migration脚本 | src/migrations/ | 建表/索引/种子数据的迁移脚本 |
| 种子数据 | src/seeds/ | 开发环境种子数据 |

**代码质量要求**：
- Migration脚本可执行且可回滚
- 种子数据覆盖核心业务实体

**阶段卡口**：Migration可执行（npx prisma migrate status 或等效命令验证），100%有回滚脚本

### Step 3: Repository代码生成

为每个实体生成Repository：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| Repository/DAO | src/repositories/（或dao/） | 每个实体一个Repository，包含CRUD操作+常用查询 |

**代码质量要求**：
- Repository方法有完整的类型标注+错误处理
- 查询方法覆盖API层所有数据访问需求
- 软删除、分页、排序在Repository层统一封装

**阶段卡口**：每个API数据访问需求有对应Repository方法

### Step 4: 缓存层代码生成

基于缓存策略生成缓存层代码：

| 生成内容 | 路径 | 说明 |
|----------|------|------|
| 缓存层 | src/cache/ | Redis连接配置、CacheRepository、缓存装饰器/拦截器 |

**代码质量要求**：
- 缓存层与缓存策略设计对齐：命中率目标、失效策略、穿透/击穿/雪崩防护
- CacheRepository封装缓存读写逻辑，Service层通过Repository+CacheRepository访问数据

**阶段卡口**：缓存层与缓存策略设计对齐

### Step 5: 对齐检查与代码自审

**API对齐检查**：
- 逐条对照API契约中的请求/响应结构，确保Model字段覆盖所有API需求
- 缺失字段标注并自动补充

**代码自审**：
- 检查Model字段与DDL是否一致
- 检查Migration脚本是否可执行且可回滚
- 检查缓存层与缓存策略设计是否对齐
- 检查Repository查询是否有N+1问题
- 检查索引是否覆盖高频查询场景
- 发现问题自动修复，P0问题阻塞输出

**阶段卡口**：API数据需求100%有Model字段覆盖，代码自审P0问题=0

### Step 6: 数据层测试代码生成

为数据层生成测试代码：

- 为每个Model生成字段校验测试
- 为每个Repository生成CRUD测试骨架
- 为Migration生成执行+回滚验证测试
- 测试文件输出到 src/__tests__/models/ 和 src/__tests__/repositories/

**阶段卡口**：每个Model和Repository有测试骨架

## 输出

采用**双输出模式**：

1. **代码文件** → 直接写入用户指定的 `{project_dir}/src/` 项目目录
2. **元数据文件** → 写入 `output/` 目录，供下游 Skill 消费

**代码文件输出**：{project_dir}/src/（Model、Migration、Repository、缓存层、配置、测试直接写入项目目录）

**元数据输出**：output/backend-data-architecture/data-architecture-impl/

**元数据输出文件**：
- impl-report.json — 代码实现报告（生成文件清单+对齐检查结果+自审结果）

## 决策规则

| 条件 | 决策 |
|------|------|
| ER模型与API契约不一致 | 以ER模型为准，标注差异供人类确认 |
| 缓存策略与代码实现冲突 | 以缓存策略为准，调整代码实现 |
| 代码自审发现P0问题 | 阻塞输出，自动修复后重新自审 |
| Repository查询有N+1问题 | 改用JOIN或批量查询 |

## 质量检查

- [ ] 代码可编译（npm run build 或 tsc --noEmit 通过）
- [ ] Model字段与DDL完全一致
- [ ] Migration脚本可执行且可回滚
- [ ] 每个Repository方法有类型标注+错误处理
- [ ] 软删除/分页/排序统一封装
- [ ] 缓存层与缓存策略设计对齐
- [ ] Model仅定义数据层结构，API类型由api-design-impl的types/api.ts定义
- [ ] API数据需求100%有Model字段覆盖
- [ ] 代码自审P0问题=0
- [ ] 每个Model和Repository有测试骨架

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 缓存策略缺失 | 不生成缓存层代码 | 无缓存层，Service直接访问Repository |
| 迁移方案缺失 | 不生成迁移脚本 | 无迁移方案 |
| API契约缺失 | 仅基于ER模型生成代码 | 无法做API对齐检查 |
| tech_stack未指定 | 默认Node.js/Prisma | 代码风格可能不匹配 |
| database_type未指定 | 默认PostgreSQL | SQL方言可能不兼容 |

## 上游变更响应

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| ER模型变更 | Model+Migration+Repository | 标注受影响的代码文件，评估修改范围 |
| 缓存策略变更 | 缓存层代码 | 更新CacheRepository和缓存配置 |
| API契约变更 | Repository查询方法 | 评估是否需要新增或修改查询方法 |
