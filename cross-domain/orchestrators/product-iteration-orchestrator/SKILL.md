---
name: product-iteration-orchestrator
description: 当需要对已有产品进行功能迭代时使用。产品迭代总指挥，根据需求变更影响范围协调PM/UI/Backend子编排器的增量更新和集成交付。关键词：功能迭代、需求变更、增量更新、跨领域、产品优化、加功能、改需求、产品升级、系统升级、功能优化、新增模块、需求调整、版本迭代、功能改进、迭代开发。
metadata:
  module: "跨领域协调"
  sub-module: "产品迭代"
  type: "orchestrator"
  version: "6.0"
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

1. **需求分析**：明确迭代需求范围和优先级
2. **方案设计**：增量更新PRD，仅变更部分
3. **影响分析**：判断API是否需变更、UI是否需变更、后端逻辑是否需变更
4. **条件分支执行**：仅执行受影响的领域编排器
5. **集成交付**：联调验证→质量验证→发布

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结（强制）**：Pipeline 所有 stages 执行完成后，**必须立即**执行 `post_pipeline` 中定义的阶段总结动作，生成总结文档。这不是可选步骤，若未生成阶段总结，编排器执行视为未完成。

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/cross-domain/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/cross-domain/product-iteration-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline: product-iteration-orchestrator
version: 8.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/cross-domain/product-iteration-orchestrator.md

stages:
  - id: phase-1
    name: "需求文档"
    depends_on: []
    skills: [design-prd]
    gate:
      condition: "需求文档人类确认通过"
      fail_action: "补充需求细节"

  - id: phase-2
    name: "产品设计"
    depends_on: [phase-1]
    skills: [design-orchestrator]
    gate:
      condition: "PRD人类确认通过"
      fail_action: "补充需求细节"

  - id: phase-3
    name: "影响分析"
    depends_on: [phase-2]
    skills: [change-impact-analysis]
    gate:
      condition: "影响矩阵覆盖所有下游设计产出，重做清单可执行"
      fail_action: "补充缺失的下游影响项"

  - id: phase-4
    name: "API更新"
    depends_on: [phase-2]
    skills: [api-design-orchestrator]
    trigger: 影响范围含API变更
    gate:
      condition: "API契约人类确认通过"
      fail_action: "调整API设计"

  - id: phase-5
    name: "UI开发"
    depends_on: [phase-2, phase-4]
    skills: [ui-orchestrator]
    trigger: 影响范围含UI变更或设计令牌变更，或API发生变更
    gate:
      condition: "UI开发与集成验证通过"
      fail_action: "修复集成问题"

  - id: phase-6
    name: "数据更新"
    depends_on: [phase-4]
    skills: [data-architecture-orchestrator]
    trigger: 影响范围含数据模型变更
    gate:
      condition: "数据架构审查通过"
      fail_action: "修复数据架构问题"

  - id: phase-7
    name: "后端更新"
    depends_on: [phase-4, phase-6]
    skills: [backend-architecture-orchestrator]
    trigger: 影响范围含后端逻辑变更
    gate:
      condition: "后端审查通过（P0=0）"
      fail_action: "修复P0问题"

  - id: phase-8
    name: "交付上线"
    depends_on: [phase-7, phase-5]
    skills: [monitoring-orchestrator, iteration-orchestrator]
    gate:
      condition: "P0问题=0，P1问题≤3，灰度发布通过，复盘结论确认"
      fail_action: "修复阻断问题后重新验证"
```

## 阶段执行计划

### 阶段1：需求分析

#### 调用 design-prd

```
Skill: design-prd
输入:
  用户反馈: 迭代用户反馈数据
  业务需求: 业务需求变更
  数据异常: 数据异常指标
输出: output/pm-design/design-prd/
验证: 需求文档人类确认通过
模式: 🤖→👤
```

### 阶段2：增量更新PRD

#### 调用 design-orchestrator

```
Skill: design-orchestrator
输入:
  需求文档: output/pm-design/design-prd/
输出: output/cross-domain/design-orchestrator/
验证: PRD变更部分人类确认通过
模式: 🤖→👤
```

### 阶段3：影响分析（自动执行）

```
Skill: 无（本编排器自动执行）
输入:
  PRD变更: output/cross-domain/design-orchestrator/
输出: output/cross-domain/product-iteration-orchestrator/impact-report.md
验证: 所有受影响领域已识别
模式: 🤖
```

### 阶段4a：API增量更新（条件执行）

#### 调用 api-design-orchestrator

```
Skill: api-design-orchestrator
输入:
  PRD变更: output/cross-domain/design-orchestrator/
输出: output/cross-domain/api-design-orchestrator/
验证: API变更人类确认通过
模式: 🤖→👤
```

### 阶段4b：数据架构增量更新（条件执行）

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

### 阶段4c：后端增量更新（条件执行）

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

### 阶段4d：UI开发与集成（条件执行）

#### 调用 ui-orchestrator

```
Skill: ui-orchestrator
输入:
  PRD变更: output/cross-domain/design-orchestrator/
  API变更输出: output/cross-domain/api-design-orchestrator/
  目标语言: 用户提供（默认zh-CN）
  project_dir: 用户提供（已有项目目录路径）
输出: output/cross-domain/ui-orchestrator/
验证: 前端代码审查通过，前后端联调通过
模式: 🤖→👤
```

### 阶段5：质量验证与发布

#### 调用 monitoring-orchestrator

```
Skill: monitoring-orchestrator
输入:
  变更部分输出: output/cross-domain/
  集成输出: output/cross-domain/ui-orchestrator/
输出: output/cross-domain/monitoring-orchestrator/
验证: P0问题=0，回归测试通过
模式: 🤖→👤
```

#### 调用 iteration-orchestrator

```
Skill: iteration-orchestrator
输入:
  质量报告: output/cross-domain/monitoring-orchestrator/
  变更部分输出: output/cross-domain/
输出: output/cross-domain/iteration-orchestrator/
验证: 发布决策人类确认
模式: 🤖→👤
```

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 需要数据支撑决策 | → analysis-orchestrator（在design-prd之前执行） |
| 需要A/B验证 | → experiment-orchestrator（在iteration-orchestrator之前执行） |
| 需要项目管理支撑 | → agile-orchestrator（贯穿全程） |
| 迭代效果评估 | → analysis-orchestrator（在iteration-orchestrator之后执行） |

### 阶段总结（post_pipeline）

所有业务阶段执行完成后，**必须立即**生成阶段总结文档：

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/cross-domain/
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/cross-domain/product-iteration-orchestrator.md
验证: 阶段总结文档已生成，6项结构（执行概览/关键发现/决策记录/产出清单/风险与待办/下游衔接）均非空
模式: 🤖
```

⏸ **阶段卡口**：阶段总结文档已生成且6项结构均非空 → 未通过：补充缺失结构项后重新生成

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 需求确认 | 需求文档人类确认通过 | 补充需求细节或调整优先级 |
| PRD变更确认 | PRD变更部分人类确认通过 | 补充变更细节或调整变更范围 |
| 影响范围确认 | 所有受影响领域已识别 | 扩大扫描范围，补充遗漏的影响 |
| 变更部分就绪 | 受影响领域的审查均通过 | 等待滞后方完成 |
| 质量门禁通过 | P0问题=0，回归测试通过 | 修复问题后重新验证 |
| 阶段总结已生成 | output/phase-reports/cross-domain/product-iteration-orchestrator.md 已生成且6项结构均非空 | 补充缺失结构项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 需求确认 | design-prd完成 | 确认需求范围和优先级 |
| PRD变更确认 | design-orchestrator完成 | 确认PRD变更可分发到受影响领域 |
| 影响范围确认 | 影响分析完成 | 确认哪些领域需要变更，是否有遗漏 |
| 集成就绪确认 | ui-orchestrator完成 | 确认前后端联调通过 |
| 发布决策 | iteration-orchestrator完成 | 确认是否发布 |

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

- v6.0: UI子编排器合并——将design-system-orchestrator、ui-frontend-orchestrator、frontend-integration-orchestrator三个阶段合并为ui-development阶段，统一调用ui-orchestrator；更新Pipeline、阶段执行计划、输出路径、人类决策点、异常处理
- v5.0: UI阶段增加 project_dir 传递，代码直接写入已有项目目录
- v3.0: 统一优化为编排协议+Pipeline+调用指令模式，删除子Skill执行协议和调度规则
- v4.1: 阶段总结强化——Pipeline新增post_pipeline定义；调用规则第6条改为强制执行；阶段执行计划新增阶段总结执行指令；阶段卡口新增阶段总结校验；异常处理新增阶段总结生成失败策略
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加子编排器调度协议和命令式调度指令
- v1.0: 初始版本
