---
name: data-architecture-orchestrator
description: 数据架构指挥官。协调数据模型设计、数据迁移和缓存策略的完整流程，确保数据架构合理、可迁移、高性能。关键词：数据架构、数据模型、数据迁移、缓存策略。
metadata:
  module: "后端架构与开发"
  sub-module: "数据架构"
  type: "orchestrator"
  version: "1.0"
---

# 数据架构指挥官

## 核心原则

数据是系统根基，模型决定上限，缓存决定下限。

## 执行步骤

1. **模型先行**：先设计数据模型，再设计缓存和迁移
2. **迁移安全**：每个变更可回滚，数据不丢失
3. **缓存按需**：有性能瓶颈才加缓存，不过度设计
4. **一致性显式**：缓存与数据库的一致性策略显式定义

## 任务调度

```
data-model → cache-strategy → data-migration
```

| 阶段 | 任务 | 执行模式 |
|------|------|----------|
| 1 | data-model | 🤖→👤 AI建议，人类审批 |
| 2 | cache-strategy | 🤖→👤 AI建议，人类审批 |
| 3 | data-migration | 🤖→👤 AI建议，人类审批 |

### 数据流转

```
[PRD + API契约 + 数据量预估]
       ↓
data-model
       ↓ er_model (entities / relationships / DDL / indexes / data_dictionary / sharding_strategy)
cache-strategy
       ↓ cache_scheme (multi_level_cache / consistency_policy / key_convention / penetration_protection / breakdown_protection / avalanche_protection)
data-migration
       ↓ migration_plan (schema_migration / data_migration / rollback_scripts / validation_checks)
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| PRD+API契约就绪 | → data-model（数据模型设计） |
| 数据模型人类确认完成 | → cache-strategy（缓存策略设计） |
| 缓存策略人类确认完成 | → data-migration（数据迁移方案） |
| 数据模型需调整 | → data-model（增量更新模型） |
| 性能瓶颈出现 | → cache-strategy（补充或调整缓存策略） |

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/backend-data-architecture/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 数据模型完成 | ER图+DDL+数据字典完整 | 缺失项必须补充 |
| 缓存策略完成 | 穿透/击穿/雪崩防护全覆盖 | 防护缺失必须补充 |
| 数据迁移完成 | 100%变更有回滚脚本 | 无回滚脚本的变更阻塞 |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 范式vs反范式 | 读写比决定，人类确认平衡点 |
| 分库分表策略 | 影响成本和复杂度，人类确认 |
| 缓存一致性级别 | 强一致vs最终一致，人类确认 |
| 迁移执行时间 | 低峰期窗口，人类确认 |
| 数据迁移执行确认 | 迁移方案和回滚脚本生成完成，人类确认是否执行迁移 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD数据需求不明确 | 基于API契约推断数据实体，标注"推断值" |
| 数据量预估缺失 | 使用保守估计值，标注"预估待验证" |
| 缓存一致性策略冲突 | 标注冲突项，提供强一致和最终一致双方案，人类决策 |
| 迁移回滚脚本生成失败 | 阻塞迁移执行，必须人工编写回滚脚本 |
| 分库分表策略不确定 | 提供单表+分表双方案对比，人类决策 |
