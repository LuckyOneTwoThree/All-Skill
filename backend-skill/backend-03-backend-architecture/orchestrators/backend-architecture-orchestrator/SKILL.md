---
name: backend-architecture-orchestrator
description: 后端架构指挥官。协调architecture-pattern、service-design、backend-review三个子Skill的完整流程，确保后端架构合理、可扩展、高质量。关键词：后端架构、架构模式、服务设计、架构审查、architecture-pattern、service-design、backend-review。
metadata:
  module: "后端架构与开发"
  sub-module: "后端架构"
  type: "orchestrator"
  version: "3.0"
---

# 后端架构指挥官

## 核心原则

架构服务于业务，简单方案优先，按需演进。

## 执行步骤

1. **模式先行**：先确定架构模式，再设计服务
2. **领域驱动**：服务边界由业务领域决定
3. **审查闭环**：审查不通过则回退修复
4. **演进式**：从简单开始，按需演进

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/backend/backend-architecture-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/backend-architecture/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/backend/backend-architecture-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: architecture-pattern
    gate: 架构推荐有量化评估支撑 + 每个关键决策有ADR记录 + 演进路线图有明确触发条件 + 人类确认通过
  - stage: service-design
    depends_on: [architecture-pattern]
    gate: 服务间无循环依赖 + 数据归属明确 + 通信方案明确 + 人类确认通过
  - stage: backend-review
    depends_on: [service-design]
    gate: P0问题=0
```

## 阶段执行计划

#### 调用 architecture-pattern

```
Skill: architecture-pattern
输入:
  业务规模: 用户提供
  技术约束: 用户提供（可选）
  PRD: output/pm-design/design-prd/prd.md（可选）
输出: output/backend-architecture/architecture-pattern/
验证: 架构推荐有量化评估支撑 + 每个关键决策有ADR记录 + 演进路线图有明确触发条件
模式: 🤖→👤
```

#### 调用 service-design

```
Skill: service-design
输入:
  PRD: output/pm-design/design-prd/prd.md
  数据模型: output/backend-data-architecture/data-model/er_model.json
  架构模式: output/backend-architecture/architecture-pattern/
输出: output/backend-architecture/service-design/
验证: 服务间无循环依赖 + 数据归属明确 + 通信方案明确
模式: 🤖→👤
```

#### 调用 backend-review

```
Skill: backend-review
输入:
  服务设计: output/backend-architecture/service-design/
  API契约: output/backend-api-design/api-contract/openapi.yaml
  数据模型: output/backend-data-architecture/data-model/er_model.json
  缓存策略: output/backend-data-architecture/cache-strategy（可选）
输出: output/backend-architecture/backend-review/
验证: P0问题=0，P0问题必须修复后才能进入开发
模式: 🤖
```

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

- v3.0: 统一优化为编排协议+Pipeline定义+调用指令格式
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
