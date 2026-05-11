---
name: product-launch-orchestrator
description: 当需要从0到1做新产品时使用。产品启动总指挥，协调PM/UI/Backend三大领域子编排器的全流程并行构建与集成。关键词：产品启动、从0到1、新产品、全流程、跨领域、产品上线。
metadata:
  module: "跨领域协调"
  sub-module: "产品启动"
  type: "orchestrator"
  version: "2.0"
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

### 阶段1：insight-orchestrator（探索发现）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | insight-orchestrator |
| 读取定义路径 | `.trae/skills/insight-orchestrator/SKILL.md` |
| 输入 | 用户反馈 + 市场数据 + 竞品信息 |
| 输出 | 洞察报告 |
| 验证 | 洞察报告人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 洞察报告确认通过后才可进入阶段2 |

### 阶段2：market-orchestrator（市场分析）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | market-orchestrator |
| 读取定义路径 | `.trae/skills/market-orchestrator/SKILL.md` |
| 输入 | 洞察报告（阶段1输出） |
| 输出 | 市场分析报告 |
| 验证 | 市场分析人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 市场分析确认通过后才可进入阶段3 |

### 阶段3：business-orchestrator（商业战略）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | business-orchestrator |
| 读取定义路径 | `.trae/skills/business-orchestrator/SKILL.md` |
| 输入 | 洞察报告（阶段1输出）+ 市场分析（阶段2输出） |
| 输出 | 商业模式 |
| 验证 | 商业模式人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 商业模式确认通过后才可进入阶段4 |

### 阶段4：positioning-orchestrator（战略定位）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | positioning-orchestrator |
| 读取定义路径 | `.trae/skills/positioning-orchestrator/SKILL.md` |
| 输入 | 商业模式（阶段3输出） |
| 输出 | 定位陈述 |
| 验证 | 定位陈述人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 定位陈述确认通过后才可进入阶段5 |

### 阶段5：design-orchestrator（方案设计）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | design-orchestrator |
| 读取定义路径 | `.trae/skills/design-orchestrator/SKILL.md` |
| 输入 | 定位陈述（阶段4输出）+ 商业模式（阶段3输出） |
| 输出 | PRD + IA + 原型 + 交互规格 |
| 验证 | PRD人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | PRD人类确认通过后才可进入阶段6（并行构建） |

### 阶段6：metrics-orchestrator（指标体系）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | metrics-orchestrator |
| 读取定义路径 | `.trae/skills/metrics-orchestrator/SKILL.md` |
| 输入 | PRD（阶段5输出）+ 商业模式（阶段3输出） |
| 输出 | 指标体系 |
| 验证 | 指标体系人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 指标体系确认通过；可与阶段7并行执行 |

### 阶段7a：api-design-orchestrator（API设计，并行分支-Backend）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | api-design-orchestrator |
| 读取定义路径 | `.trae/skills/api-design-orchestrator/SKILL.md` |
| 输入 | PRD（阶段5输出） |
| 输出 | API契约 + 安全策略 + 认证鉴权方案 |
| 验证 | API契约人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | API契约人类确认通过后才可进入阶段7b |

### 阶段7b：data-architecture-orchestrator → backend-architecture-orchestrator（数据架构→后端架构，并行分支-Backend）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | data-architecture-orchestrator → backend-architecture-orchestrator |
| 读取定义路径 | `.trae/skills/data-architecture-orchestrator/SKILL.md` → `.trae/skills/backend-architecture-orchestrator/SKILL.md` |
| 输入 | API契约（阶段7a输出）+ PRD（阶段5输出） |
| 输出 | 数据模型 + 缓存策略 + 迁移方案 + 架构模式 + 服务设计 + 后端审查报告 |
| 验证 | 后端审查通过（P0=0） |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 后端审查通过后才可进入阶段9（集成） |

### 阶段8a：design-system-orchestrator（设计系统，并行分支-UI）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | design-system-orchestrator |
| 读取定义路径 | `.trae/skills/design-system-orchestrator/SKILL.md` |
| 输入 | 品牌规范 + 产品定位（阶段4输出）+ PRD（阶段5输出） |
| 输出 | 设计令牌 + 组件库 + 设计系统文档 |
| 验证 | 设计令牌人类确认通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 设计令牌人类确认通过后才可进入阶段8b |

### 阶段8b：ui-frontend-orchestrator（UI前端生成，并行分支-UI）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | ui-frontend-orchestrator |
| 读取定义路径 | `.trae/skills/ui-frontend-orchestrator/SKILL.md` |
| 输入 | 设计令牌 + 组件库（阶段8a输出）+ PRD（阶段5输出）+ 原型规格（阶段5输出） |
| 输出 | 组件代码 + 页面代码 + 交互设计 + UI审查报告 + 前端测试 |
| 验证 | 前端代码审查通过 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 前端代码审查通过后才可进入阶段9（集成） |

### 阶段9：frontend-integration-orchestrator（前端集成）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | frontend-integration-orchestrator |
| 读取定义路径 | `.trae/skills/frontend-integration-orchestrator/SKILL.md` |
| 输入 | API契约（阶段7a输出）+ 前端代码（阶段8b输出） |
| 输出 | API客户端 + 构建部署 + 性能优化报告 |
| 验证 | 前后端联调核心流程100%通过 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | 前端+后端均就绪后才可执行；联调通过后才可进入阶段10 |

### 阶段10：quality-orchestrator → release-orchestrator → retrospective-orchestrator（质量→发布→复盘）

| 项目 | 内容 |
|------|------|
| 子编排器名称 | quality-orchestrator → release-orchestrator → retrospective-orchestrator |
| 读取定义路径 | `.trae/skills/quality-orchestrator/SKILL.md` → `.trae/skills/release-orchestrator/SKILL.md` → `.trae/skills/retrospective-orchestrator/SKILL.md` |
| 输入 | 集成输出（阶段9输出）+ 指标体系（阶段6输出） |
| 输出 | 质量报告 → 发布产物 → 复盘报告 |
| 验证 | P0问题=0，P1问题≤3 → 灰度发布通过 → 复盘结论确认 |
| 执行模式 | 🤖→👤 AI建议，人类审批 |
| ⏸ 阶段卡口 | 质量门禁通过后才可发布；人类确认全量发布；复盘结论确认 |

### 附加调度（按需触发）

| 触发事件 | 调度动作 |
|----------|----------|
| 需要用户研究支撑 | → user-research-orchestrator（在insight-orchestrator之前执行） |
| 需要机会验证 | → opportunity-orchestrator（在business-orchestrator之前执行） |
| 需要验证假设 | → validation-orchestrator（在design-orchestrator之后执行） |
| 需要项目管理支撑 | → project-planning-orchestrator（贯穿全程） |

## 调度规则

- 每次只执行当前阶段需要的领域编排器，完成后再执行下一阶段，不要一次性执行所有编排器
- 执行子编排器前必须先读取其SKILL.md定义文件
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

- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加子编排器调度协议和命令式调度指令
- v1.0: 初始版本
