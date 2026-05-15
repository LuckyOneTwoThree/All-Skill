---
name: data-architecture-orchestrator
description: 当需要设计数据模型、规划数据架构或设计缓存迁移方案时使用。数据架构指挥官，协调data-architecture-spec（设计）和data-architecture-impl（实现）两个子Skill的完整流程，确保数据架构合理、可迁移、高性能，设计产出经人类审查后再生成代码。关键词：数据架构、数据模型、数据迁移、缓存策略、数据库设计、数据方案、代码生成。
metadata:
  module: "后端架构与开发"
  sub-module: "数据架构"
  type: "orchestrator"
  version: "4.0"
  domain_tags: ["电商", "SaaS", "金融", "物流", "通用"]
  trigger_examples:
    - "设计数据模型"
    - "规划数据架构"
    - "设计缓存策略"
    - "规划数据迁移方案"
---

# 数据架构指挥官

## 核心原则

数据是系统根基，模型决定上限，缓存决定下限。设计先行，审查后实现。

## 执行步骤

1. **模型先行**：先设计数据模型，再设计缓存和迁移
2. **迁移安全**：每个变更可回滚，数据不丢失
3. **缓存按需**：有性能瓶颈才加缓存，不过度设计
4. **一致性显式**：缓存与数据库的一致性策略显式定义
5. **设计审查**：设计产出必须经人类审查确认后，才进入代码实现

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
post_pipeline:
  - action: stage-summary
    output: output/phase-reports/backend/data-architecture-orchestrator.md
pipeline:
  - stage: data-architecture-spec
    gate: ER图+DDL+数据字典+缓存策略+迁移方案完整 + 人类审查通过
  - stage: data-architecture-impl
    gate: 代码可编译 + Migration可执行 + API数据需求100%覆盖 + 代码自审P0=0 + 人类确认通过
```

## 阶段执行计划

#### 阶段1：数据架构设计规范

#### 调用 data-architecture-spec

```
Skill: data-architecture-spec
输入:
  PRD: output/pm-design/design-prd/prd.md
  PRD结构化数据: output/pm-design/design-prd/prd.json
  API契约: output/backend-api-design/api-design-spec/openapi.yaml
  database_type: 用户提供
  数据量预估: 用户提供（可选）
  并发量预估: 用户提供（可选）
  当前Schema: 用户提供（可选）
输出: output/backend-data-architecture/data-architecture-spec/
验证: ER图+DDL+数据字典+缓存策略+迁移方案完整
模式: 🤖→👤
内部步骤:
  1. 业务数据字典提取：从PRD提取业务数据实体定义
  2. 实体识别与关系建模：设计ER图
  3. 表结构与索引设计：DDL+索引策略
  4. 缓存策略设计：多级缓存+穿透/击穿/雪崩防护
  5. 数据迁移方案：迁移+回滚脚本
```

⏸ **设计审查卡口**：ER图+DDL+数据字典+缓存策略+迁移方案完整 → 人类审查设计产出 → 审查通过后进入代码实现

#### 阶段2：数据层代码实现

#### 调用 data-architecture-impl

```
Skill: data-architecture-impl
输入:
  ER模型: output/backend-data-architecture/data-architecture-spec/er_model.json
  缓存策略: output/backend-data-architecture/data-architecture-spec/cache_strategy.json
  迁移方案: output/backend-data-architecture/data-architecture-spec/migration_plan.json（可选）
  API契约: output/backend-api-design/api-design-spec/openapi.yaml
  project_dir: 用户提供
  tech_stack: 用户提供
  database_type: 用户提供
输出: output/backend-data-architecture/data-architecture-impl/ + 代码写入 {project_dir}/src/
验证: 代码可编译，Migration可执行，API数据需求100%覆盖，代码自审P0=0
模式: 🤖→👤
内部步骤:
  1. Model代码生成：models/entities+数据库配置
  2. Migration和种子数据生成：迁移脚本+种子数据
  3. Repository代码生成：CRUD+常用查询
  4. 缓存层代码生成：Redis+CacheRepository
  5. 对齐检查与代码自审：API对齐+DDL一致性+缓存对齐+N+1检查
  6. 数据层测试代码生成：Model+Repository+Migration测试
```

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/backend-data-architecture/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/backend/data-architecture-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: backend-architecture-orchestrator
    reason: 数据架构完成后，进入后端架构设计，基于数据模型和API契约设计服务架构
    input_mapping:
      data_model: "output/backend-data-architecture/data-architecture-spec/ → backend-architecture-spec输入"
      cache_strategy: "output/backend-data-architecture/data-architecture-spec/cache_strategy.json → backend-architecture-spec输入"
  alternatives:
    - target: api-design-orchestrator
      reason: 数据模型变更需要反向更新API契约
      condition: 数据架构设计发现API契约需要调整时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 数据架构设计完成 | data-architecture-spec输出文件已生成且非空 | 缺失项必须补充 |
| 设计审查通过 | 人类审查设计产出并确认 | 人类修改意见反馈后重新设计 |
| 数据层代码实现完成 | data-architecture-impl输出文件已生成且非空 | 缺失项补充后重新验证 |
| 阶段总结已生成 | output/phase-reports/backend/data-architecture-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 范式vs反范式 | data-architecture-spec执行时 | 读写比决定，人类确认平衡点 |
| 分库分表策略 | data-architecture-spec执行时 | 影响成本和复杂度，人类确认 |
| 缓存一致性级别 | data-architecture-spec执行时 | 强一致vs最终一致，人类确认 |
| 迁移执行时间 | data-architecture-spec执行时 | 低峰期窗口，人类确认 |
| 设计审查确认 | data-architecture-spec完成后 | 审查数据架构设计是否满足需求，确认后才进入代码实现 |
| 数据迁移执行确认 | data-architecture-impl输出完成 | 迁移方案和回滚脚本生成完成，人类确认是否执行迁移 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD数据需求不明确 | 基于API契约推断数据实体，标注"推断值" |
| 数据量预估缺失 | 使用保守估计值，标注"预估待验证" |
| 缓存一致性策略冲突 | 标注冲突项，提供强一致和最终一致双方案，人类决策 |
| 迁移回滚脚本生成失败 | 阻塞迁移执行，必须人工编写回滚脚本 |
| 分库分表策略不确定 | 提供单表+分表双方案对比，人类决策 |
| 设计审查不通过 | 根据人类修改意见调整设计，重新审查 |
| 代码自审P0问题 | 自动修复后重新自审，无法修复则阻塞输出 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v4.0: 拆分data-architecture为data-architecture-spec（设计）+data-architecture-impl（实现），增加设计审查卡口
- v3.0: 新增代码生成能力（models/migrations/repositories），实现设计+代码双输出模式
- v2.0: 合并data-model、cache-strategy、data-migration为data-architecture单一Skill
- v1.0: 初始版本
