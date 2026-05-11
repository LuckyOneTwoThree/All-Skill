---
name: product-launch-orchestrator
description: 当需要从0到1做新产品时使用。产品启动总指挥，协调PM、UI、Backend三大领域的设计、构建、集成和交付全流程。关键词：产品启动、从0到1、新产品、全流程、跨领域、产品上线。
metadata:
  module: "跨领域协调"
  sub-module: "产品启动"
  type: "orchestrator"
  version: "1.0"
---

# 产品启动总指挥

## 核心原则

**PRD为契约，并行构建，集成验证，渐进交付**

产品启动的核心挑战不是某个领域的技能缺失，而是三大领域之间的协调：PM的PRD必须同时满足Backend的API设计需求和UI的界面设计需求，Backend的API契约必须与UI的前端联调对齐，任何一方的变更都会波及其他方。本编排器以PRD为核心契约，管理跨领域的数据传递和阶段卡口。

## 执行步骤

1. **PM先行**：先完成探索、战略、设计全流程，产出PRD作为跨领域契约
2. **并行构建**：PRD确认后，Backend和UI同时启动，缩短整体周期
3. **集成验证**：前后端开发完成后，通过集成编排器验证联调
4. **渐进交付**：质量验证→灰度发布→全量发布→复盘

## 任务调度

```
[PM阶段]
insight-orchestrator → market-orchestrator → business-orchestrator → positioning-orchestrator → design-orchestrator → metrics-orchestrator
       ↓ PRD确认
[并行构建阶段]
├── api-design-orchestrator → data-architecture-orchestrator → backend-architecture-orchestrator
└── design-system-orchestrator → ui-frontend-orchestrator
       ↓ 双方就绪
[集成阶段]
frontend-integration-orchestrator
       ↓ 集成通过
[交付阶段]
quality-orchestrator → release-orchestrator → retrospective-orchestrator
```

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 需要用户研究支撑 | → user-research-orchestrator（在insight-orchestrator之前执行） |
| 需要机会验证 | → opportunity-orchestrator（在business-orchestrator之前执行） |
| 需要验证假设 | → validation-orchestrator（在design-orchestrator之后执行） |
| 需要项目管理支撑 | → project-planning-orchestrator（贯穿全程） |

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| 产品方向未明确 | → insight-orchestrator → market-orchestrator（探索发现） |
| 市场分析完成 | → business-orchestrator → positioning-orchestrator（商业战略） |
| 战略定位确认 | → design-orchestrator → metrics-orchestrator（方案设计） |
| PRD人类确认通过 | → 同时触发 api-design-orchestrator + design-system-orchestrator |
| API契约人类确认通过 | → data-architecture-orchestrator → backend-architecture-orchestrator |
| 设计令牌人类确认通过 | → ui-frontend-orchestrator |
| 前端+后端均就绪 | → frontend-integration-orchestrator |
| 集成测试通过 | → quality-orchestrator → release-orchestrator |
| 发布完成 | → retrospective-orchestrator |
| PRD变更 | → 暂停并行构建，人类确认变更影响范围后重新分发 |
| API契约与前端需求冲突 | → 暂停双方，人类裁决 |

### 数据流转

```
[用户反馈 + 市场数据 + 竞品信息]
       ↓
insight-orchestrator → market-orchestrator
       ↓ 洞察报告 + 市场分析
business-orchestrator → positioning-orchestrator
       ↓ 商业模式 + 定位陈述
design-orchestrator → metrics-orchestrator
       ↓ PRD + 指标体系 + IA + 原型 + 交互规格
       ↓ ───────────────┬───────────────┐
       ↓                ↓               ↓
       ↓    api-design-orchestrator   design-system-orchestrator
       ↓         ↓ API契约              ↓ 设计令牌 + 组件库
       ↓    data-architecture →         ui-frontend-orchestrator
       ↓    backend-architecture              ↓ 页面代码
       ↓ ───────────────┴───────────────┘
       ↓
frontend-integration-orchestrator
       ↓ 联调通过
quality-orchestrator → release-orchestrator → retrospective-orchestrator
```

## 调度规则

- 每次只加载当前阶段需要的领域编排器，完成后再加载下一阶段，不要一次性加载所有编排器
- 每个阶段完成后，将中间结果写入各领域的 `output/` 文件，释放上下文空间
- 跨领域数据契约（PRD、API契约、设计令牌）必须经过人类确认后才能传递到下游领域
- 并行构建阶段，Backend和UI两个分支独立执行，互不阻塞
- 若上下文接近上限，优先保留当前阶段内容和跨领域契约文件，将已完成阶段摘要为关键结论

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| PM设计完成 | PRD已生成且人类确认通过 | 补充产品方向或需求信息 |
| 并行构建就绪 | API契约人类确认 + 设计令牌人类确认 | 延迟启动受影响的分支 |
| 前后端均就绪 | 后端审查通过 + 前端代码审查通过 | 等待滞后方完成 |
| 集成测试通过 | 前后端联调核心流程100%通过 | 修复联调问题后重新集成 |
| 质量门禁通过 | P0问题=0，P1问题≤3 | 修复阻断问题后重新验证 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| PRD确认 | design-orchestrator完成 | 确认PRD可分发到Backend和UI |
| API契约确认 | api-design-orchestrator完成 | 确认API契约可交付前端 |
| 设计令牌确认 | design-system-orchestrator完成 | 确认设计令牌可交付前端 |
| 前后端冲突裁决 | API契约与前端需求冲突 | 决策API侧改还是前端侧改 |
| 集成就绪确认 | frontend-integration-orchestrator完成 | 确认前后端联调通过 |
| 发布决策 | release-orchestrator灰度完成 | 确认是否全量发布 |
| 复盘确认 | retrospective-orchestrator完成 | 确认复盘结论和行动项 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| PRD频繁变更 | 锁定PRD版本，变更走变更审批流程，受影响领域暂停 |
| API契约与前端需求冲突 | 暂停双方，人类裁决，胜出方更新输出 |
| 设计令牌与组件库不兼容 | 优先调整组件库适配令牌，令牌为权威源 |
| 后端开发进度落后于前端 | 前端使用Mock数据继续开发，标注"待联调" |
| 前端开发进度落后于后端 | 后端先自测API，提供Postman集合给前端 |
| 集成测试环境不可用 | 降级为本地联调验证，标注"集成环境待验证" |
| 并行构建某分支失败 | 不阻塞另一分支，失败分支修复后单独进入集成 |

## 变更记录

- v1.0: 初始版本
