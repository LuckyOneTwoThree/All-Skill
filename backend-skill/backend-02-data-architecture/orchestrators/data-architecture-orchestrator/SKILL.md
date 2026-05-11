---
name: data-architecture-orchestrator
description: 数据架构指挥官。协调data-model、cache-strategy、data-migration三个子Skill的完整流程，确保数据架构合理、可迁移、高性能。关键词：数据架构、数据模型、数据迁移、缓存策略、data-model、cache-strategy、data-migration。
metadata:
  module: "后端架构与开发"
  sub-module: "数据架构"
  type: "orchestrator"
  version: "2.0"
---

# 数据架构指挥官

## 核心原则

数据是系统根基，模型决定上限，缓存决定下限。

## 执行步骤

1. **模型先行**：先设计数据模型，再设计缓存和迁移
2. **迁移安全**：每个变更可回滚，数据不丢失
3. **缓存按需**：有性能瓶颈才加缓存，不过度设计
4. **一致性显式**：缓存与数据库的一致性策略显式定义

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：data-model（数据模型设计）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | data-model |
| 读取定义路径 | `.trae/skills/data-model/SKILL.md` |
| 输入 | PRD：`output/pm-design/design-prd/prd.md`；API契约：`output/backend-api-design/api-contract/openapi.yaml`；数据量预估（用户提供，可选） |
| 输出 | `output/backend-data-architecture/data-model/`（ER模型、DDL、索引策略、数据字典、分库分表方案） |
| 验证 | ER图+DDL+数据字典完整，缺失项必须补充 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 数据模型人类确认通过后才可进入阶段2 |

### 阶段2：cache-strategy（缓存策略设计）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | cache-strategy |
| 读取定义路径 | `.trae/skills/cache-strategy/SKILL.md` |
| 输入 | 数据模型：`output/backend-data-architecture/data-model/er_model.json`；API契约：`output/backend-api-design/api-contract/openapi.yaml`；并发量预估（用户提供，可选） |
| 输出 | `output/backend-data-architecture/cache-strategy/`（多级缓存架构、一致性策略、Key规范、穿透/击穿/雪崩防护、监控方案） |
| 验证 | 穿透/击穿/雪崩防护全覆盖，防护缺失必须补充 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 缓存策略人类确认通过后才可进入阶段3 |

### 阶段3：data-migration（数据迁移方案）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | data-migration |
| 读取定义路径 | `.trae/skills/data-migration/SKILL.md` |
| 输入 | 当前Schema（用户提供）；目标Schema：`output/backend-data-architecture/data-model/`（DDL）；数据量（用户提供，可选） |
| 输出 | `output/backend-data-architecture/data-migration/`（Schema迁移脚本、数据迁移脚本、回滚脚本、数据校验方案） |
| 验证 | 100%变更有回滚脚本，无回滚脚本的变更阻塞 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 迁移方案完整且人类确认是否执行迁移 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/backend-data-architecture/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

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

- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
