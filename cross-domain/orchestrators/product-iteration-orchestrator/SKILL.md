---
name: product-iteration-orchestrator
description: 当需要对已有产品进行功能迭代时使用。产品迭代总指挥，根据需求变更的影响范围，协调PM、UI、Backend相关领域的增量更新和集成交付。关键词：功能迭代、需求变更、增量更新、跨领域、产品优化。
metadata:
  module: "跨领域协调"
  sub-module: "产品迭代"
  type: "orchestrator"
  version: "1.0"
---

# 产品迭代总指挥

## 核心原则

**影响分析驱动，条件分支执行，最小变更集交付**

产品迭代与产品启动的核心区别在于：已有产品有存量代码、存量API、存量用户。迭代的关键不是全流程推进，而是精准识别变更影响范围，只执行受影响的领域编排器，避免不必要的全量重做。

## 执行步骤

1. **需求分析**：明确迭代需求范围和优先级
2. **方案设计**：增量更新PRD，仅变更部分
3. **影响分析**：判断API是否需变更、UI是否需变更、后端逻辑是否需变更
4. **条件分支执行**：仅执行受影响的领域编排器
5. **集成交付**：联调验证→质量验证→发布

## 任务调度

```
[需求阶段]
requirements-orchestrator
       ↓ 需求确认
[设计阶段]
design-orchestrator（增量更新PRD）
       ↓ PRD变更确认
[影响分析]
→ 自动分析：API变更？UI变更？后端逻辑变更？
       ↓ 影响范围确认
[条件分支执行]
├── API需变更 → api-design-orchestrator → data-architecture-orchestrator → backend-architecture-orchestrator
├── UI需变更 → design-system-orchestrator（令牌变更时）→ ui-frontend-orchestrator
└── 无变更 → 跳过
       ↓ 变更部分就绪
[集成阶段]
frontend-integration-orchestrator（仅API变更时执行）
       ↓
[交付阶段]
quality-orchestrator → release-orchestrator
```

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 需要数据支撑决策 | → analysis-orchestrator（在requirements-orchestrator之前执行） |
| 需要A/B验证 | → experiment-orchestrator（在release-orchestrator之前执行） |
| 需要项目管理支撑 | → agile-orchestrator（贯穿全程） |
| 迭代效果评估 | → analysis-orchestrator（在release-orchestrator之后执行） |

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 迭代需求已明确 | → requirements-orchestrator（需求分析） |
| 需求人类确认通过 | → design-orchestrator（增量更新PRD） |
| PRD变更人类确认通过 | → 执行影响分析 |
| 影响范围含API变更 | → api-design-orchestrator（API增量更新） |
| 影响范围含数据模型变更 | → data-architecture-orchestrator（数据架构增量更新） |
| 影响范围含后端逻辑变更 | → backend-architecture-orchestrator（后端增量更新） |
| 影响范围含设计令牌变更 | → design-system-orchestrator（设计系统增量更新） |
| 影响范围含UI变更 | → ui-frontend-orchestrator（前端增量更新） |
| API发生变更 | → frontend-integration-orchestrator（前端联调更新） |
| 纯UI变更（无API变更） | → 跳过frontend-integration-orchestrator，直接进入quality |
| 纯后端变更（无UI变更） | → 跳过ui-frontend-orchestrator和frontend-integration-orchestrator |
| 变更部分审查通过 | → quality-orchestrator → release-orchestrator |
| PRD变更影响范围扩大 | → 暂停执行，人类确认扩大后的影响范围 |

### 数据流转

```
[用户反馈 + 业务需求 + 数据异常]
       ↓
requirements-orchestrator
       ↓ 需求文档
design-orchestrator
       ↓ PRD变更（变更部分标注）
       ↓ ───────────── 影响分析 ────────────┐
       ↓                ↓                    ↓
       ↓    API变更？   UI变更？    后端逻辑变更？
       ↓        ↓           ↓              ↓
       ↓    api-design   design-system   backend-architecture
       ↓    data-arch    ui-frontend
       ↓        ↓           ↓
       ↓    frontend-integration（仅API变更时）
       ↓ ───────────────┴────────────────┘
       ↓
quality-orchestrator → release-orchestrator
```

## 调度规则

- 每次只加载当前阶段需要的领域编排器，完成后再加载下一阶段
- 影响分析是核心环节，必须扫描所有领域编排器的输入依赖，不能遗漏受影响的领域
- 条件分支执行：未受影响的领域直接跳过，不执行该领域的编排器
- 增量更新：领域编排器执行时，仅更新变更部分，保留未变更部分
- 跨领域数据契约变更必须经过人类确认后才能传递到下游领域
- 若上下文接近上限，优先保留影响分析结果和变更部分内容

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 需求确认 | 需求文档人类确认通过 | 补充需求细节或调整优先级 |
| PRD变更确认 | PRD变更部分人类确认通过 | 补充变更细节或调整变更范围 |
| 影响范围确认 | 所有受影响领域已识别 | 扩大扫描范围，补充遗漏的影响 |
| 变更部分就绪 | 受影响领域的审查均通过 | 等待滞后方完成 |
| 质量门禁通过 | P0问题=0，回归测试通过 | 修复问题后重新验证 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 需求确认 | requirements-orchestrator完成 | 确认需求范围和优先级 |
| PRD变更确认 | design-orchestrator完成 | 确认PRD变更可分发到受影响领域 |
| 影响范围确认 | 影响分析完成 | 确认哪些领域需要变更，是否有遗漏 |
| 集成就绪确认 | frontend-integration-orchestrator完成 | 确认前后端联调通过 |
| 发布决策 | release-orchestrator完成 | 确认是否发布 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 需求范围蔓延 | 标注超出范围的需求，人类决策是否纳入本期迭代 |
| PRD变更影响未评估领域 | 自动扫描所有领域编排器的输入依赖，补全遗漏的影响 |
| API向后不兼容 | 标注破坏性变更，必须提供兼容方案或版本升级策略 |
| 回归测试失败 | 回退到变更前的代码版本，标注"迭代阻塞" |
| 变更范围超出预期 | 暂停执行，人类决策是否拆分为多期迭代 |
| 纯UI变更但设计令牌需调整 | 优先执行design-system-orchestrator更新令牌，再执行ui-frontend-orchestrator |
| 纯后端变更但影响已有API | 必须执行api-design-orchestrator评估API兼容性 |

## 变更记录

- v1.0: 初始版本
