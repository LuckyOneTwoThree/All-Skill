---
name: backend-architecture-orchestrator
description: 后端架构指挥官。协调architecture-pattern、service-design、backend-review三个子Skill的完整流程，确保后端架构合理、可扩展、高质量。关键词：后端架构、架构模式、服务设计、架构审查、architecture-pattern、service-design、backend-review。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "orchestrator"
  version: "2.0"
---

# 后端架构指挥官

## 核心原则

架构服务于业务，简单方案优先，按需演进。

## 执行步骤

1. **模式先行**：先确定架构模式，再设计服务
2. **领域驱动**：服务边界由业务领域决定
3. **审查闭环**：审查不通过则回退修复
4. **演进式**：从简单开始，按需演进

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：architecture-pattern（架构模式选择与设计）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | architecture-pattern |
| 读取定义路径 | `.trae/skills/architecture-pattern/SKILL.md` |
| 输入 | 业务规模（用户提供）；技术约束（用户提供，可选）；PRD：`output/pm-design/design-prd/prd.md`（可选） |
| 输出 | `output/backend-architecture/architecture-pattern/`（架构推荐、ADR决策记录、系统拓扑、技术选型、演进路线图） |
| 验证 | 架构推荐有量化评估支撑 + 每个关键决策有ADR记录 + 演进路线图有明确触发条件 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 人类确认架构模式和演进路线后才可进入阶段2 |

### 阶段2：service-design（服务设计）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | service-design |
| 读取定义路径 | `.trae/skills/service-design/SKILL.md` |
| 输入 | PRD：`output/pm-design/design-prd/prd.md`；数据模型：`output/backend-data-architecture/data-model/er_model.json`；架构模式：`output/backend-architecture/architecture-pattern/` |
| 输出 | `output/backend-architecture/service-design/`（限界上下文、服务拆分、服务间通信、依赖治理、上下文映射） |
| 验证 | 服务间无循环依赖 + 数据归属明确 + 通信方案明确 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 服务设计人类确认通过后才可进入阶段3；循环依赖必须消除 |

### 阶段3：backend-review（后端架构审查）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | backend-review |
| 读取定义路径 | `.trae/skills/backend-review/SKILL.md` |
| 输入 | 服务设计：`output/backend-architecture/service-design/`；API契约：`output/backend-api-design/api-contract/openapi.yaml`；数据模型：`output/backend-data-architecture/data-model/er_model.json`；缓存策略：`output/backend-data-architecture/cache-strategy`（可选） |
| 输出 | `output/backend-architecture/backend-review/`（审查报告：性能/安全/可维护性/可扩展性、问题清单P0/P1/P2、修复建议） |
| 验证 | P0问题=0，P0问题必须修复后才能进入开发 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | P0问题=0才可通过；P0>0则回退到对应阶段修复 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/backend-architecture/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 架构模式确认 | 人类确认架构模式和演进路线 | 不确认则不进入服务设计 |
| 服务设计完成 | 服务间无循环依赖+数据归属明确 | 循环依赖必须消除 |
| 后端审查完成 | P0问题=0 | P0问题必须修复后才能进入开发 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 架构模式选择 | architecture-pattern执行时 | 单体/微服务/Serverless，人类最终确认 |
| 服务拆分粒度 | service-design执行时 | 拆分过细增加复杂度，拆分过粗失去灵活性 |
| 演进节奏 | architecture-pattern执行时 | 何时从单体演进到微服务，人类决定 |
| P1问题处理 | backend-review执行时 | 修复还是接受为技术债务 |
| 架构就绪确认 | backend-review通过后 | 后端审查通过后，人类确认架构方案可进入开发 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 业务需求不完整 | 基于PRD推断业务领域，标注"推断值" |
| API契约缺失 | 基于PRD推断接口需求，标注"API契约待确认" |
| 架构模式争议 | 提供单体+微服务双方案对比，人类决策 |
| 服务循环依赖 | 自动检测并告警，必须消除后才能进入审查 |
| 审查P0问题 | 必须修复后才能进入开发阶段 |

## 变更记录

- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
