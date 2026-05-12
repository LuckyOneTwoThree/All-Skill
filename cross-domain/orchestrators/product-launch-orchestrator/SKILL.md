---
name: product-launch-orchestrator
description: 当需要从0到1做新产品时使用。产品启动总指挥，协调PM/UI/Backend三大领域子编排器的全流程并行构建与集成。关键词：产品启动、从0到1、新产品、全流程、跨领域、产品上线。
metadata:
  module: "跨领域协调"
  sub-module: "产品启动"
  type: "orchestrator"
  version: "3.0"
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

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/cross-domain/product-launch-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/cross-domain/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/cross-domain/product-launch-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: insight
    skills: [insight-orchestrator]
    depends_on: []
    gate: 洞察报告人类确认通过

  - stage: market
    skills: [market-orchestrator]
    depends_on: [insight]
    gate: 市场分析人类确认通过

  - stage: business
    skills: [business-orchestrator]
    depends_on: [insight, market]
    gate: 商业模式人类确认通过

  - stage: positioning
    skills: [positioning-orchestrator]
    depends_on: [business]
    gate: 定位陈述人类确认通过

  - stage: design
    skills: [design-orchestrator]
    depends_on: [business, positioning]
    gate: PRD人类确认通过

  - stage: metrics
    skills: [metrics-orchestrator]
    depends_on: [design]
    parallel: true
    gate: 指标体系人类确认通过

  - stage: backend-api
    skills: [api-design-orchestrator]
    depends_on: [design]
    parallel: true
    gate: API契约人类确认通过

  - stage: ui-design
    skills: [design-system-orchestrator]
    depends_on: [design]
    parallel: true
    gate: 设计令牌人类确认通过

  - stage: backend-impl
    skills: [data-architecture-orchestrator, backend-architecture-orchestrator]
    depends_on: [backend-api]
    parallel: true
    gate: 后端审查通过（P0=0）

  - stage: ui-impl
    skills: [ui-frontend-orchestrator]
    depends_on: [ui-design]
    parallel: true
    gate: 前端代码审查通过

  - stage: integration
    skills: [frontend-integration-orchestrator]
    depends_on: [backend-api, ui-impl]
    gate: 前后端联调核心流程100%通过

  - stage: delivery
    skills: [quality-orchestrator, release-orchestrator, retrospective-orchestrator]
    depends_on: [integration, metrics]
    gate: P0问题=0，P1问题≤3 → 灰度发布通过 → 复盘结论确认
```

## 阶段执行计划

### 阶段1：探索发现

#### 调用 insight-orchestrator

```
Skill: insight-orchestrator
输入:
  用户反馈: 初始用户反馈数据
  市场数据: 市场趋势与规模数据
  竞品信息: 竞品分析资料
输出: output/cross-domain/insight-orchestrator/
验证: 洞察报告人类确认通过
模式: 🤖→👤
```

### 阶段2：市场分析

#### 调用 market-orchestrator

```
Skill: market-orchestrator
输入:
  洞察报告: output/cross-domain/insight-orchestrator/
输出: output/cross-domain/market-orchestrator/
验证: 市场分析人类确认通过
模式: 🤖→👤
```

### 阶段3：商业战略

#### 调用 business-orchestrator

```
Skill: business-orchestrator
输入:
  洞察报告: output/cross-domain/insight-orchestrator/
  市场分析: output/cross-domain/market-orchestrator/
输出: output/cross-domain/business-orchestrator/
验证: 商业模式人类确认通过
模式: 🤖→👤
```

### 阶段4：战略定位

#### 调用 positioning-orchestrator

```
Skill: positioning-orchestrator
输入:
  商业模式: output/cross-domain/business-orchestrator/
输出: output/cross-domain/positioning-orchestrator/
验证: 定位陈述人类确认通过
模式: 🤖→👤
```

### 阶段5：方案设计

#### 调用 design-orchestrator

```
Skill: design-orchestrator
输入:
  定位陈述: output/cross-domain/positioning-orchestrator/
  商业模式: output/cross-domain/business-orchestrator/
输出: output/cross-domain/design-orchestrator/
验证: PRD人类确认通过
模式: 🤖→👤
```

### 阶段6：指标体系（并行分支）

#### 调用 metrics-orchestrator

```
Skill: metrics-orchestrator
输入:
  PRD: output/cross-domain/design-orchestrator/
  商业模式: output/cross-domain/business-orchestrator/
输出: output/cross-domain/metrics-orchestrator/
验证: 指标体系人类确认通过
模式: 🤖→👤
```

### 阶段7a：API设计（并行分支-Backend）

#### 调用 api-design-orchestrator

```
Skill: api-design-orchestrator
输入:
  PRD: output/cross-domain/design-orchestrator/
输出: output/cross-domain/api-design-orchestrator/
验证: API契约人类确认通过
模式: 🤖→👤
```

### 阶段7b：数据架构→后端架构（并行分支-Backend）

#### 调用 data-architecture-orchestrator

```
Skill: data-architecture-orchestrator
输入:
  API契约: output/cross-domain/api-design-orchestrator/
  PRD: output/cross-domain/design-orchestrator/
输出: output/cross-domain/data-architecture-orchestrator/
验证: 数据模型审查通过
模式: 🤖→👤
```

#### 调用 backend-architecture-orchestrator

```
Skill: backend-architecture-orchestrator
输入:
  API契约: output/cross-domain/api-design-orchestrator/
  PRD: output/cross-domain/design-orchestrator/
  数据模型: output/cross-domain/data-architecture-orchestrator/
输出: output/cross-domain/backend-architecture-orchestrator/
验证: 后端审查通过（P0=0）
模式: 🤖→👤
```

### 阶段8a：设计系统（并行分支-UI）

#### 调用 design-system-orchestrator

```
Skill: design-system-orchestrator
输入:
  品牌规范: 品牌规范资料
  产品定位: output/cross-domain/positioning-orchestrator/
  PRD: output/cross-domain/design-orchestrator/
输出: output/cross-domain/design-system-orchestrator/
验证: 设计令牌人类确认通过
模式: 🤖→👤
```

### 阶段8b：UI前端生成（并行分支-UI）

#### 调用 ui-frontend-orchestrator

```
Skill: ui-frontend-orchestrator
输入:
  设计令牌: output/cross-domain/design-system-orchestrator/
  组件库: output/cross-domain/design-system-orchestrator/
  PRD: output/cross-domain/design-orchestrator/
  原型规格: output/cross-domain/design-orchestrator/
输出: output/cross-domain/ui-frontend-orchestrator/
验证: 前端代码审查通过
模式: 🤖→👤
```

### 阶段9：前端集成

#### 调用 frontend-integration-orchestrator

```
Skill: frontend-integration-orchestrator
输入:
  API契约: output/cross-domain/api-design-orchestrator/
  前端代码: output/cross-domain/ui-frontend-orchestrator/
输出: output/cross-domain/frontend-integration-orchestrator/
验证: 前后端联调核心流程100%通过
模式: 🤖
```

### 阶段10：质量→发布→复盘

#### 调用 quality-orchestrator

```
Skill: quality-orchestrator
输入:
  集成输出: output/cross-domain/frontend-integration-orchestrator/
  指标体系: output/cross-domain/metrics-orchestrator/
输出: output/cross-domain/quality-orchestrator/
验证: P0问题=0，P1问题≤3
模式: 🤖→👤
```

#### 调用 release-orchestrator

```
Skill: release-orchestrator
输入:
  质量报告: output/cross-domain/quality-orchestrator/
  集成输出: output/cross-domain/frontend-integration-orchestrator/
输出: output/cross-domain/release-orchestrator/
验证: 灰度发布通过
模式: 🤖→👤
```

#### 调用 retrospective-orchestrator

```
Skill: retrospective-orchestrator
输入:
  发布产物: output/cross-domain/release-orchestrator/
  指标体系: output/cross-domain/metrics-orchestrator/
输出: output/cross-domain/retrospective-orchestrator/
验证: 复盘结论确认
模式: 🤖→👤
```

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 需要用户研究支撑 | → user-research-orchestrator（在insight-orchestrator之前执行） |
| 需要机会验证 | → opportunity-orchestrator（在business-orchestrator之前执行） |
| 需要验证假设 | → validation-orchestrator（在design-orchestrator之后执行） |
| 需要项目管理支撑 | → project-planning-orchestrator（贯穿全程） |

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

- v3.0: 统一优化为编排协议+Pipeline+调用指令模式，删除子Skill执行协议和调度规则
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加子编排器调度协议和命令式调度指令
- v1.0: 初始版本
