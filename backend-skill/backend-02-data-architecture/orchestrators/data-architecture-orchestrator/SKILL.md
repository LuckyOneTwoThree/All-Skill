---
name: data-architecture-orchestrator
description: 数据架构指挥官。协调data-model、cache-strategy、data-migration三个子Skill的完整流程，确保数据架构合理、可迁移、高性能。关键词：数据架构、数据模型、数据迁移、缓存策略、data-model、cache-strategy、data-migration。
metadata:
  module: "后端架构与开发"
  sub-module: "数据架构"
  type: "orchestrator"
  version: "3.0"
---

# 数据架构指挥官

## 核心原则

数据是系统根基，模型决定上限，缓存决定下限。

## 执行步骤

1. **模型先行**：先设计数据模型，再设计缓存和迁移
2. **迁移安全**：每个变更可回滚，数据不丢失
3. **缓存按需**：有性能瓶颈才加缓存，不过度设计
4. **一致性显式**：缓存与数据库的一致性策略显式定义

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/backend/data-architecture-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/backend-data-architecture/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/backend/data-architecture-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: data-model
    gate: ER图+DDL+数据字典完整 + 人类确认通过
  - stage: cache-strategy
    depends_on: [data-model]
    parallel: true
    gate: 穿透/击穿/雪崩防护全覆盖 + 人类确认通过
  - stage: data-migration
    depends_on: [data-model]
    parallel: true
    gate: 100%变更有回滚脚本 + 人类确认是否执行迁移
```

## 阶段执行计划

#### 调用 data-model

```
Skill: data-model
输入:
  PRD: output/pm-design/design-prd/prd.md
  API契约: output/backend-api-design/api-contract/openapi.yaml
  数据量预估: 用户提供（可选）
输出: output/backend-data-architecture/data-model/
验证: ER图+DDL+数据字典完整，缺失项必须补充
模式: 🤖→👤
```

#### 调用 cache-strategy

```
Skill: cache-strategy
输入:
  数据模型: output/backend-data-architecture/data-model/er_model.json
  API契约: output/backend-api-design/api-contract/openapi.yaml
  并发量预估: 用户提供（可选）
输出: output/backend-data-architecture/cache-strategy/
验证: 穿透/击穿/雪崩防护全覆盖，防护缺失必须补充
模式: 🤖→👤
```

#### 调用 data-migration

```
Skill: data-migration
输入:
  当前Schema: 用户提供
  目标Schema: output/backend-data-architecture/data-model/
  数据量: 用户提供（可选）
输出: output/backend-data-architecture/data-migration/
验证: 100%变更有回滚脚本，无回滚脚本的变更阻塞
模式: 🤖→👤
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 数据模型完成 | ER图+DDL+数据字典完整 | 缺失项必须补充 |
| 缓存策略完成 | 穿透/击穿/雪崩防护全覆盖 | 防护缺失必须补充 |
| 数据迁移完成 | 100%变更有回滚脚本 | 无回滚脚本的变更阻塞 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 范式vs反范式 | data-model执行时 | 读写比决定，人类确认平衡点 |
| 分库分表策略 | data-model执行时 | 影响成本和复杂度，人类确认 |
| 缓存一致性级别 | cache-strategy执行时 | 强一致vs最终一致，人类确认 |
| 迁移执行时间 | data-migration执行时 | 低峰期窗口，人类确认 |
| 数据迁移执行确认 | data-migration输出完成 | 迁移方案和回滚脚本生成完成，人类确认是否执行迁移 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD数据需求不明确 | 基于API契约推断数据实体，标注"推断值" |
| 数据量预估缺失 | 使用保守估计值，标注"预估待验证" |
| 缓存一致性策略冲突 | 标注冲突项，提供强一致和最终一致双方案，人类决策 |
| 迁移回滚脚本生成失败 | 阻塞迁移执行，必须人工编写回滚脚本 |
| 分库分表策略不确定 | 提供单表+分表双方案对比，人类决策 |

## 变更记录

- v3.0: 统一优化为编排协议+Pipeline定义+调用指令格式
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
