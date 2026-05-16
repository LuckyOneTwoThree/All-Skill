---
name: product-iteration-orchestrator
description: 当需要对已有产品进行功能迭代时使用。产品迭代总指挥，根据需求变更影响范围协调PM/UI/Backend子编排器的增量更新和集成交付。关键词：功能迭代、需求变更、增量更新、跨领域、产品优化、加功能、改需求、产品升级、系统升级、功能优化、新增模块、需求调整、版本迭代、功能改进、迭代开发。
metadata:
  module: "跨领域协调"
  sub-module: "产品迭代"
  type: "orchestrator"
  version: "9.0"
  domain_tags: ["通用"]
  trigger_examples:
    - "给现有产品加一个支付功能"
    - "需求改了，需要调整"
    - "产品要升级，加几个新模块"
    - "优化一下现有的功能"
    - "给系统加个新功能"
    - "需求变更了，重新评估影响"
    - "版本迭代，需要更新几个模块"
---

# 产品迭代总指挥

## 核心原则

**影响分析驱动，条件分支执行，最小变更集交付**

产品迭代与产品启动的核心区别在于：已有产品有存量代码、存量API、存量用户。迭代的关键不是全流程推进，而是精准识别变更影响范围，只执行受影响的领域编排器，避免不必要的全量重做。

## 执行步骤

1. **需求与设计**：调用design-orchestrator完成需求分析和PRD增量更新
2. **变更影响分析**：识别变更影响范围，判断API/UI/后端是否需变更
3. **API设计**：条件执行API设计编排器，产出API契约供后端和UI并行消费
4. **后端实现**：条件执行数据架构、后端架构编排器，与UI变更可并行
5. **UI变更**：条件执行UI编排器，基于API契约与后端实现并行
6. **交付上线**：调用release-orchestrator+monitoring-orchestrator完成质量验收→发布检查→灰度发布→监控建立

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

## Pipeline

```yaml
pipeline: product-iteration-orchestrator
version: 9.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/cross-domain/product-iteration-orchestrator.md

stages:
  - id: phase-1
    name: "需求与设计"
    depends_on: []
    skills: [design-orchestrator]
    gate:
      condition: "PRD人类确认通过"
      fail_action: "补充需求细节"

  - id: phase-2
    name: "变更影响分析"
    depends_on: [phase-1]
    skills: [change-impact-analysis]
    gate:
      condition: "影响矩阵覆盖所有下游产出"
      fail_action: "补充缺失的下游影响项"

  - id: phase-3
    name: "API设计"
    depends_on: [phase-2]
    trigger: API需变更
    skills: [api-design-orchestrator]
    gate:
      condition: "API变更人类确认通过"
      fail_action: "调整API设计"

  - id: phase-4
    name: "后端实现"
    depends_on: [phase-3]
    parallel_with: [phase-5]
    trigger: 数据/后端需变更
    skills: [data-architecture-orchestrator, backend-architecture-orchestrator]
    gate:
      condition: "后端审查通过（P0=0）"
      fail_action: "修复P0问题"

  - id: phase-5
    name: "UI变更"
    depends_on: [phase-3]
    parallel_with: [phase-4]
    trigger: UI需变更
    skills: [ui-orchestrator]
    gate:
      condition: "UI开发与集成验证通过"
      fail_action: "修复集成问题"

  - id: phase-6
    name: "交付上线"
    depends_on: [phase-4, phase-5]
    skills: [release-orchestrator, monitoring-orchestrator]
    gate:
      condition: "P0问题=0，灰度发布通过"
      fail_action: "修复阻断问题后重新验证"
```

## 阶段执行计划

### 阶段1：需求与设计

#### 调用 design-orchestrator

```
Skill: design-orchestrator
输入:
  用户反馈: 迭代用户反馈数据
  业务需求: 业务需求变更
  数据异常: 数据异常指标
输出: output/cross-domain/design-orchestrator/
验证: PRD人类确认通过
模式: 🤖→👤
```

### 阶段2：变更影响分析

#### 调用 change-impact-analysis

```
Skill: change-impact-analysis
输入:
  PRD变更: output/cross-domain/design-orchestrator/
输出: output/cross-domain/product-iteration-orchestrator/impact-report.md
验证: 影响矩阵覆盖所有下游产出
模式: 🤖
```

### 阶段3：API设计（条件执行）

#### 调用 api-design-orchestrator

```
Skill: api-design-orchestrator
输入:
  PRD变更: output/cross-domain/design-orchestrator/
输出: output/cross-domain/api-design-orchestrator/
验证: API变更人类确认通过
模式: 🤖→👤
```

### 阶段4：后端实现（条件执行，与阶段5并行）

#### 调用 data-architecture-orchestrator

```
Skill: data-architecture-orchestrator
输入:
  PRD变更: output/cross-domain/design-orchestrator/
  API变更输出: output/cross-domain/api-design-orchestrator/
输出: output/cross-domain/data-architecture-orchestrator/
验证: 数据架构变更审查通过
模式: 🤖→👤
```

#### 调用 backend-architecture-orchestrator

```
Skill: backend-architecture-orchestrator
输入:
  PRD变更: output/cross-domain/design-orchestrator/
  API变更输出: output/cross-domain/api-design-orchestrator/
  数据架构变更输出: output/cross-domain/data-architecture-orchestrator/
输出: output/cross-domain/backend-architecture-orchestrator/
验证: 后端审查通过（P0=0）
模式: 🤖→👤
```

### 阶段5：UI变更（条件执行，与阶段4并行）

#### 调用 ui-orchestrator

```
Skill: ui-orchestrator
输入:
  mode: full（产品迭代场景，需求变更已由上游design-orchestrator确认，跳过探索阶段）
  PRD变更: output/cross-domain/design-orchestrator/
  API变更输出: output/cross-domain/api-design-orchestrator/
  目标语言: 用户提供（默认zh-CN）
  project_dir: 用户提供（已有项目目录路径）
输出: output/cross-domain/ui-orchestrator/
验证: 前端代码审查通过，前后端联调通过
模式: 🤖→👤
```

### 阶段6：交付上线

#### 调用 release-orchestrator

```
Skill: release-orchestrator
输入:
  变更部分输出: output/cross-domain/
  集成输出: output/cross-domain/ui-orchestrator/
输出: output/cross-domain/release-orchestrator/
验证: P0问题=0，灰度发布通过
模式: 🤖→👤
```

#### 调用 monitoring-orchestrator

```
Skill: monitoring-orchestrator
输入:
  发布产物: output/cross-domain/release-orchestrator/
  指标体系: output/cross-domain/metrics-orchestrator/（可选）
输出: output/cross-domain/monitoring-orchestrator/
验证: 监控预警体系已建立
模式: 🤖→👤
```

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 需要数据支撑决策 | → analysis-orchestrator（在design-orchestrator之前执行） |
| 需要A/B验证 | → experiment-orchestrator（在交付上线之前执行） |
| 需要项目管理支撑 | → agile-orchestrator（贯穿全程） |
| 迭代效果评估 | → analysis-orchestrator（在交付上线之后执行） |

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/cross-domain/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/cross-domain/product-iteration-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
下游衔接:
  primary:
    target: monitoring-orchestrator
    reason: 迭代发布后进入持续监控，跟踪指标变化和异常告警
    input_mapping:
      iteration_output: "output/cross-domain/ → monitoring-orchestrator输入"
  alternatives:
    - target: product-iteration-orchestrator
      reason: 继续下一轮迭代，基于监控数据和用户反馈
      condition: 有新的迭代需求时
    - target: growth-orchestrator
      reason: 迭代涉及增长功能时，启动增长策略
      condition: 迭代包含获客/激活/留存/变现相关功能时
    - target: agile-orchestrator
      reason: 进入下一Sprint规划
      condition: 采用敏捷开发模式时
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| PRD确认 | PRD人类确认通过 | 补充需求细节 |
| 影响范围确认 | change-impact输出文件已生成且非空 | 补充缺失的下游影响项 |
| API变更确认 | api-design-orchestrator输出文件已生成且非空 | 调整API设计 |
| 后端审查通过 | backend-review输出文件已生成且非空 | 修复P0问题 |
| UI集成验证 | ui-integration输出文件已生成且非空 | 修复集成问题 |
| 交付上线 | release输出文件已生成且非空 | 修复阻断问题后重新验证 |
| 阶段总结已生成 | output/phase-reports/cross-domain/product-iteration-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| PRD确认 | design-orchestrator完成 | 确认PRD变更可分发到受影响领域 |
| 影响范围确认 | change-impact-analysis完成 | 确认哪些领域需要变更，是否有遗漏 |
| 发布决策 | 交付上线阶段完成 | 确认是否发布 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 需求范围蔓延 | 标注超出范围的需求，人类决策是否纳入本期迭代 |
| PRD变更影响未评估领域 | 自动扫描所有领域编排器的输入依赖，补全遗漏的影响 |
| API向后不兼容 | 标注破坏性变更，必须提供兼容方案或版本升级策略 |
| 回归测试失败 | 回退到变更前的代码版本，标注"迭代阻塞" |
| 变更范围超出预期 | 暂停执行，人类决策是否拆分为多期迭代 |
| 纯UI变更但设计令牌需调整 | 由ui-orchestrator统一处理设计令牌更新与前端开发 |
| 纯后端变更但影响已有API | 必须执行api-design-orchestrator评估API兼容性 |
| 阶段总结生成失败 | 基于已完成的子Skill输出生成部分总结，缺失项标注"数据缺失"，不阻塞编排完成 |

## 变更记录

- v7.0: Pipeline精简——合并Phase-1(design-prd)+Phase-2(design-orchestrator)为Phase-1(需求与设计)，直接调用design-orchestrator；将change-impact-analysis从自动执行改为显式调用子Skill作为Phase-2；合并后端三阶段(API/数据/后端)为Phase-3(后端变更)；UI变更为Phase-4与后端变更可并行；Phase-8(交付上线)简化为调用monitoring-orchestrator+quality-acceptance+release-gradual+release-notes；Pipeline从8阶段精简为5阶段；阶段卡口从8项减少为6项；人类决策点从5个减少为3个
- v6.0: UI子编排器合并——将design-system-orchestrator、ui-frontend-orchestrator、frontend-integration-orchestrator三个阶段合并为ui-development阶段，统一调用ui-orchestrator；更新Pipeline、阶段执行计划、输出路径、人类决策点、异常处理
- v5.0: UI阶段增加 project_dir 传递，代码直接写入已有项目目录
- v3.0: 统一优化为编排协议+Pipeline+调用指令模式，删除子Skill执行协议和调度规则
- v4.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加子编排器调度协议和命令式调度指令
- v1.0: 初始版本
