---
name: product-iteration-orchestrator
description: 当需要对已有产品进行功能迭代时使用。产品迭代总指挥，根据需求变更影响范围协调PM/UI/Backend子编排器的增量更新和集成交付。关键词：功能迭代、需求变更、增量更新、跨领域、产品优化。
metadata:
  module: "跨领域协调"
  sub-module: "产品迭代"
  type: "orchestrator"
  version: "2.0"
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

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 子编排器调度协议

当本编排器需要调度子编排器时：

1. 读取子编排器定义：`对应子编排器的定义文件（阶段执行计划中"读取定义"列指定的路径）`
2. 按子编排器的"子Skill执行协议"执行其完整流程
3. 子编排器的所有阶段完成后，收集其最终输出
4. 将子编排器的输出作为本编排器下一阶段的输入

## 阶段执行计划

### 阶段1：requirements-orchestrator（需求分析）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | requirements-orchestrator |
| 读取定义路径 | `.trae/skills/requirements-orchestrator/SKILL.md` |
| 输入 | 用户反馈 + 业务需求 + 数据异常 |
| 输出 | 需求文档 |
| 验证 | 需求文档人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 需求文档人类确认通过后才可进入阶段2 |

### 阶段2：design-orchestrator（增量更新PRD）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | design-orchestrator |
| 读取定义路径 | `.trae/skills/design-orchestrator/SKILL.md` |
| 输入 | 需求文档（阶段1输出） |
| 输出 | PRD变更（变更部分标注） |
| 验证 | PRD变更部分人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | PRD变更人类确认通过后才可进入阶段3 |

### 阶段3：影响分析（自动执行）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | 无（本编排器自动执行） |
| 读取定义路径 | 无 |
| 输入 | PRD变更（阶段2输出） |
| 输出 | 影响范围报告（API变更？UI变更？后端逻辑变更？） |
| 验证 | 所有受影响领域已识别 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | 影响范围人类确认通过后才可进入条件分支执行 |

### 阶段4a：api-design-orchestrator（API增量更新，条件执行）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | api-design-orchestrator |
| 读取定义路径 | `.trae/skills/api-design-orchestrator/SKILL.md` |
| 输入 | PRD变更（阶段2输出） |
| 输出 | API变更输出 |
| 验证 | API变更人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 仅当影响范围含API变更时执行；API变更确认通过后才可进入下游 |

### 阶段4b：data-architecture-orchestrator（数据架构增量更新，条件执行）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | data-architecture-orchestrator |
| 读取定义路径 | `.trae/skills/data-architecture-orchestrator/SKILL.md` |
| 输入 | PRD变更（阶段2输出）+ API变更输出（阶段4a，如有） |
| 输出 | 数据架构变更输出 |
| 验证 | 数据架构变更审查通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 仅当影响范围含数据模型变更时执行 |

### 阶段4c：backend-architecture-orchestrator（后端增量更新，条件执行）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | backend-architecture-orchestrator |
| 读取定义路径 | `.trae/skills/backend-architecture-orchestrator/SKILL.md` |
| 输入 | PRD变更（阶段2输出）+ API变更输出（阶段4a）+ 数据架构变更输出（阶段4b，如有） |
| 输出 | 后端架构变更输出 |
| 验证 | 后端审查通过（P0=0） |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 仅当影响范围含后端逻辑变更时执行 |

### 阶段4d：design-system-orchestrator（设计系统增量更新，条件执行）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | design-system-orchestrator |
| 读取定义路径 | `.trae/skills/design-system-orchestrator/SKILL.md` |
| 输入 | PRD变更（阶段2输出） |
| 输出 | 设计令牌/组件库变更输出 |
| 验证 | 设计令牌变更人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 仅当影响范围含设计令牌变更时执行 |

### 阶段4e：ui-frontend-orchestrator（前端增量更新，条件执行）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | ui-frontend-orchestrator |
| 读取定义路径 | `.trae/skills/ui-frontend-orchestrator/SKILL.md` |
| 输入 | PRD变更（阶段2输出）+ 设计令牌变更输出（阶段4d，如有） |
| 输出 | 前端代码变更输出 |
| 验证 | 前端代码审查通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 仅当影响范围含UI变更时执行 |

### 阶段5：frontend-integration-orchestrator（前端联调更新，条件执行）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | frontend-integration-orchestrator |
| 读取定义路径 | `.trae/skills/frontend-integration-orchestrator/SKILL.md` |
| 输入 | API变更输出（阶段4a）+ 前端代码变更输出（阶段4e） |
| 输出 | 前端集成输出 |
| 验证 | 前后端联调通过 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | 仅当API发生变更时执行；纯UI变更跳过此阶段 |

### 阶段6：quality-orchestrator → release-orchestrator（质量验证与发布）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | quality-orchestrator → release-orchestrator |
| 读取定义路径 | `.trae/skills/quality-orchestrator/SKILL.md` → `.trae/skills/release-orchestrator/SKILL.md` |
| 输入 | 所有变更部分的输出（阶段4a-4e + 阶段5） |
| 输出 | 质量报告 → 发布产物 |
| 验证 | P0问题=0，回归测试通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 质量门禁通过后才可发布；人类确认发布决策 |

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 需要数据支撑决策 | → analysis-orchestrator（在requirements-orchestrator之前执行） |
| 需要A/B验证 | → experiment-orchestrator（在release-orchestrator之前执行） |
| 需要项目管理支撑 | → agile-orchestrator（贯穿全程） |
| 迭代效果评估 | → analysis-orchestrator（在release-orchestrator之后执行） |

## 调度规则

- 每次只执行当前阶段需要的领域编排器，完成后再执行下一阶段
- 执行子编排器前必须先读取其SKILL.md定义文件
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

- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加子编排器调度协议和命令式调度指令
- v1.0: 初始版本
