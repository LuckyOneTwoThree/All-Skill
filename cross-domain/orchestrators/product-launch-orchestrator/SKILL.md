---
name: product-launch-orchestrator
description: 当需要从0到1做新产品时使用。产品启动总指挥，协调PM/UI/Backend三大领域子编排器的全流程并行构建与集成。关键词：产品启动、从0到1、新产品、全流程、跨领域、产品上线、做新产品、做系统、做平台、做App、做商城、做SaaS、做交易系统、做电商、做社交平台、做社区、做管理系统、项目从零开始、新项目启动、做小程序、做网站、做应用。
metadata:
  module: "跨领域协调"
  sub-module: "产品启动"
  type: "orchestrator"
  version: "8.0"
  domain_tags: ["电商", "SaaS", "社交", "金融", "教育", "医疗", "物流", "游戏", "工具", "通用"]
  trigger_examples:
    - "我要做一个交易商城系统"
    - "我们想从0到1做一个SaaS产品"
    - "我想做一个社交App"
    - "公司要做一个新平台"
    - "我们要启动一个新项目做在线教育"
    - "帮我做一个电商小程序"
    - "从零开始做一个管理系统"
    - "做一个支付平台"
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

编排协议遵循 [orchestrator-protocol.md](../../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: product-launch-orchestrator
version: 8.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/cross-domain/product-launch-orchestrator.md

stages:
  - id: phase-1
    name: "洞察分析"
    depends_on: []
    skills: [insight-orchestrator]
    gate:
      condition: "洞察报告人类确认通过"
      fail_action: "补充产品方向或需求信息"

  - id: phase-2
    name: "市场分析"
    depends_on: [phase-1]
    skills: [market-orchestrator]
    gate:
      condition: "市场分析人类确认通过"
      fail_action: "补充市场数据或竞品信息"

  - id: phase-3
    name: "商业模式"
    depends_on: [phase-1, phase-2]
    skills: [business-orchestrator]
    gate:
      condition: "商业模式人类确认通过"
      fail_action: "补充商业模式要素"

  - id: phase-4
    name: "定位策略"
    depends_on: [phase-3]
    skills: [positioning-orchestrator]
    gate:
      condition: "定位陈述人类确认通过"
      fail_action: "调整定位策略"

  - id: phase-5
    name: "产品设计"
    depends_on: [phase-3, phase-4]
    skills: [design-orchestrator]
    gate:
      condition: "PRD人类确认通过"
      fail_action: "补充需求细节"

  - id: phase-6
    name: "指标体系"
    depends_on: [phase-5]
    parallel_with: [phase-7]
    skills: [metrics-orchestrator]
    gate:
      condition: "指标体系人类确认通过"
      fail_action: "补充指标定义"

  - id: phase-7
    name: "API设计"
    depends_on: [phase-5]
    parallel_with: [phase-6]
    skills: [api-design-orchestrator]
    gate:
      condition: "API契约人类确认通过"
      fail_action: "调整API设计"

  - id: phase-8
    name: "UI开发"
    depends_on: [phase-5, phase-7]
    parallel_with: [phase-9]
    skills: [ui-orchestrator]
    gate:
      condition: "UI开发与集成验证通过"
      fail_action: "修复集成问题"

  - id: phase-9
    name: "后端实现"
    depends_on: [phase-7]
    parallel_with: [phase-8]
    skills: [data-architecture-orchestrator, backend-architecture-orchestrator]
    gate:
      condition: "后端审查通过（P0=0）"
      fail_action: "修复P0问题"

  - id: phase-10
    name: "交付上线"
    depends_on: [phase-8, phase-9, phase-6]
    skills: [release-orchestrator, monitoring-orchestrator, iteration-orchestrator, agile-orchestrator]
    gate:
      condition: "P0问题=0，P1问题≤3，灰度发布通过，复盘结论确认"
      fail_action: "修复阻断问题后重新验证"
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

### 阶段8：UI开发与集成（并行分支-UI）

#### 调用 ui-orchestrator

```
Skill: ui-orchestrator
输入:
  mode: full（产品启动场景，需求和设计已由上游design-orchestrator确认，跳过探索阶段）
  品牌规范: 品牌规范资料
  产品定位: output/cross-domain/positioning-orchestrator/
  目标语言: 用户提供（默认zh-CN）
  project_name: 用户提供
  project_dir: 用户提供
  framework: 用户提供（React/Vue/Svelte/Next.js/Nuxt.js）
  PRD: output/cross-domain/design-orchestrator/
  API契约: output/cross-domain/api-design-orchestrator/
输出: output/cross-domain/ui-orchestrator/ + 代码写入 {project_dir}/
验证: UI开发与集成验证通过 + 项目可运行（npm run dev成功）+ 项目构建成功（npm run build成功）
模式: 🤖→👤
```

### 阶段9：质量→发布→复盘

#### 调用 release-orchestrator

```
Skill: release-orchestrator
输入:
  后端输出: output/cross-domain/backend-architecture-orchestrator/
  UI输出: output/cross-domain/ui-orchestrator/
  指标体系: output/cross-domain/metrics-orchestrator/
输出: output/cross-domain/release-orchestrator/
验证: P0问题=0，灰度发布通过
模式: 🤖→👤
```

#### 调用 monitoring-orchestrator

```
Skill: monitoring-orchestrator
输入:
  集成输出: output/cross-domain/ui-orchestrator/
  指标体系: output/cross-domain/metrics-orchestrator/
输出: output/cross-domain/monitoring-orchestrator/
验证: P0问题=0，P1问题≤3
模式: 🤖→👤
```

#### 调用 iteration-orchestrator

```
Skill: iteration-orchestrator
输入:
  质量报告: output/cross-domain/monitoring-orchestrator/
  集成输出: output/cross-domain/ui-orchestrator/
输出: output/cross-domain/iteration-orchestrator/
验证: 灰度发布通过
模式: 🤖→👤
```

#### 调用 agile-orchestrator

```
Skill: agile-orchestrator
输入:
  发布产物: output/cross-domain/iteration-orchestrator/
  指标体系: output/cross-domain/metrics-orchestrator/
输出: output/cross-domain/agile-orchestrator/
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

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/cross-domain/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/cross-domain/product-launch-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: product-iteration-orchestrator
    reason: 产品上线后进入迭代优化循环，基于监控数据和用户反馈持续改进
    input_mapping:
      launch_output: "output/cross-domain/ → product-iteration-orchestrator输入"
  alternatives:
    - target: growth-orchestrator
      reason: 产品上线后启动增长策略，驱动用户获取和变现
      condition: 产品已验证PMF，需要规模化增长时
    - target: monitoring-orchestrator
      reason: 持续监控产品运行指标和异常告警
      condition: 需要独立建立长期监控体系时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| PM设计完成 | PRD已生成且人类确认通过 | 补充产品方向或需求信息 |
| 并行构建就绪 | API契约人类确认 + UI开发确认通过 | 延迟启动受影响的分支 |
| 后端与UI均就绪 | 后端与UI输出文件已生成且非空 | 等待滞后方完成 |
| 质量门禁通过 | 质量验收输出文件已生成且非空 | 修复阻断问题后重新验证 |
| 阶段总结已生成 | output/phase-reports/cross-domain/product-launch-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| PRD确认 | design-orchestrator完成 | 确认PRD可分发到Backend和UI |
| API契约确认 | api-design-orchestrator完成 | 确认API契约可交付前端 |
| UI开发确认 | ui-orchestrator完成 | 确认UI开发与集成验证通过 |
| 前后端冲突裁决 | API契约与前端需求冲突 | 决策API侧改还是前端侧改 |
| 发布决策 | iteration-orchestrator灰度完成 | 确认是否全量发布 |
| 复盘确认 | agile-orchestrator完成 | 确认复盘结论和行动项 |

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
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v6.0: UI阶段合并——将design-system-orchestrator、ui-frontend-orchestrator、frontend-integration-orchestrator三个UI子编排器合并为ui-orchestrator；Pipeline从3个UI阶段（ui-design/ui-impl/integration）合并为1个ui-development阶段；输出路径统一为output/cross-domain/ui-orchestrator/；project scaffold路径更新为output/ui-project-init/project-init.json；阶段卡口和人类决策点同步更新
- v5.0: UI阶段增加 project_dir 传递，代码直接写入可运行项目目录；design-system-orchestrator 增加 project-scaffold 初始化阶段；集成验证增加项目可运行性校验
- v3.0: 统一优化为编排协议+Pipeline+调用指令模式，删除子Skill执行协议和调度规则
- v4.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加子编排器调度协议和命令式调度指令
- v1.0: 初始版本
