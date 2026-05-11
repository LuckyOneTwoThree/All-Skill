---
name: development-orchestrator
description: 当需要将PRD转化为开发任务、进行代码审查或管理需求变更时使用。开发协作指挥官，调度任务分解、代码审查、PRD同步及合规安全等子Skill。关键词：开发协作、任务分解、代码审查、PRD同步、需求变更、隐私合规、安全需求。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "orchestrator"
  version: "4.0"
---

# 开发协作指挥官

## 核心原则

**让正确的东西被正确地构建出来**

开发协作的本质不是流程管控，而是确保从需求到交付的每一步都指向正确的目标、以正确的方式执行。

## 执行步骤

1. **触发器驱动**：所有任务由事件触发，而非人工调度。PRD更新、变更请求、代码合入等事件自动驱动Pipeline执行
2. **自动化验收**：验收标准前置定义，执行过程自动校验，减少人工判断的随意性
3. **持续部署**：通过灰度策略和Feature Flag实现持续部署，缩短从完成到上线的时间
4. **实时复盘**：每个阶段完成后即时复盘，而非事后集中回顾

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 主流程

#### 阶段1：PRD任务分解消费与开发深化

| 项目 | 内容 |
|------|------|
| 子Skill名称 | development-task-breakdown |
| 读取定义路径 | `.trae/skills/development-task-breakdown/SKILL.md` |
| 输入 | PRD Pipeline输出（prd_task_breakdown、prd_quality_gates）、技术规范库（tech_stack）、团队配置（team_capacity）、项目日历（sprint_calendar） |
| 输出 | `output/pm-development/development-task-breakdown/`（epic_story_task、sprint_assignment、dependency_graph、tech_clarifications） |
| 验证 | Epic→Story→Task三级结构完整，Sprint分配覆盖率100%，依赖关系识别率100% |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | 任务分解完整：Epic→Story→Task结构完整无遗漏，未通过则补充分解后重新校验 |

#### 阶段2：需求变更影响分析自动化

| 项目 | 内容 |
|------|------|
| 子Skill名称 | development-auto-review |
| 读取定义路径 | `.trae/skills/development-auto-review/SKILL.md` |
| 输入 | 变更请求（变更管理系统）、当前PRD（PRD管理系统）、当前技术方案（技术方案库）、开发进度（开发跟踪系统） |
| 输出 | `output/pm-development/development-auto-review/`（classification、impact_analysis、review_needed、review_decision、version_updates） |
| 验证 | 影响范围功能/技术/测试/运营四维度全覆盖，重评审判断有对应证据 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | Sprint分配合理：无资源冲突，依赖关系已解决，未通过则重新分配或升级人类决策 |

#### 阶段3：PRD双向同步自动化

| 项目 | 内容 |
|------|------|
| 子Skill名称 | development-prd-sync |
| 读取定义路径 | `.trae/skills/development-prd-sync/SKILL.md` |
| 输入 | PRD文档（output/pm-design/design-prd/prd.json）、技术方案（output/pm-development/development-task-breakdown/task_breakdown.json）、开发进度（用户提供） |
| 输出 | `output/pm-development/development-prd-sync/`（sync_status、conflict_list、update_proposals） |
| 验证 | 同步延迟<1小时，冲突检测准确率≥90%，功能/技术/测试用例全覆盖 |
| 执行模式 | 🤖 |
| ⏸ 阶段卡口 | PRD门禁通过：PRD质量门禁校验通过，未通过则阻止进入开发，返回PRD Pipeline |

### 附加调度（按需触发）

#### 附加阶段A：需求变更记录

| 项目 | 内容 |
|------|------|
| 子Skill名称 | requirements-change-log |
| 读取定义路径 | `.trae/skills/requirements-change-log/SKILL.md` |
| 触发事件 | 需求变更请求 |
| 输入 | PRD文档（output/pm-design/design-prd/PRD-{产品名}.md）、SRS文档（output/pm-design/requirements-srs/SRS-{产品名}.md）、变更描述、变更原因、变更发起人 |
| 输出 | `output/pm-development/requirements-change-log/`（requirements-change-log.md、requirements-change-log.json） |
| 验证 | 变更有唯一编号，影响评估覆盖5个维度，审批流程已定义 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 需求变更审批：变更影响>5个需求或延期>3天需人类确认 |

#### 附加阶段B：隐私合规评估

| 项目 | 内容 |
|------|------|
| 子Skill名称 | privacy-compliance-assessment |
| 读取定义路径 | `.trae/skills/privacy-compliance-assessment/SKILL.md` |
| 触发事件 | 上线前合规检查 |
| 输入 | PRD文档（output/pm-design/design-prd/PRD-{产品名}.md）、API契约（backend api-contract → openapi.yaml）、数据模型（backend data-model → er_model.json）、目标市场 |
| 输出 | `output/pm-development/privacy-compliance-assessment/`（privacy-compliance-assessment.md、privacy-compliance-assessment.json） |
| 验证 | 适用法规已识别，个人信息盘点完整，合规检查清单逐项覆盖 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 隐私合规通过：无P0合规差距，未通过则阻止上线，优先整改P0项 |

#### 附加阶段C：安全需求清单

| 项目 | 内容 |
|------|------|
| 子Skill名称 | security-requirements |
| 读取定义路径 | `.trae/skills/security-requirements/SKILL.md` |
| 触发事件 | 安全需求制定 |
| 输入 | PRD（design-prd）、SRS（requirements-srs）、隐私合规评估（privacy-compliance-assessment）、安全标准 |
| 输出 | `output/pm-development/security-requirements/`（security-requirements.md、security-requirements.json） |
| 验证 | STRIDE全覆盖，安全需求可追溯，合规映射完整，验收标准可验证 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 安全需求已制定：安全需求清单经人类审核确认，未通过则阻止开发，补充安全需求 |

#### 附加阶段D：数据字典

| 项目 | 内容 |
|------|------|
| 子Skill名称 | data-dictionary |
| 读取定义路径 | `.trae/skills/data-dictionary/SKILL.md` |
| 触发事件 | 数据标准制定 |
| 输入 | PRD（design-prd）、SRS（requirements-srs）、数据模型（用户提供） |
| 输出 | `output/pm-development/data-dictionary/`（data-dictionary.md、data-dictionary.json） |
| 验证 | 实体覆盖完整，字段规格精确，敏感数据已标注，枚举值完整 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 数据字典已建立：核心数据实体和字段规格已定义，未通过则补充数据定义 |

#### 附加阶段E：技术债务登记册

| 项目 | 内容 |
|------|------|
| 子Skill名称 | tech-debt-register |
| 读取定义路径 | `.trae/skills/tech-debt-register/SKILL.md` |
| 触发事件 | 技术债务管理 |
| 输入 | 代码审查结果（development-auto-review）、PRD同步记录（development-prd-sync）、技术信息（用户提供） |
| 输出 | `output/pm-development/tech-debt-register/`（tech-debt-register.md、tech-debt-register.json） |
| 验证 | 债务分类完整，影响评估量化，优先级有依据，偿还计划可执行 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 技术债务已登记：技术债务登记册经人类审核确认，未通过则补充债务识别 |

#### 附加阶段F：架构决策记录

| 项目 | 内容 |
|------|------|
| 子Skill名称 | architecture-decision-record |
| 读取定义路径 | `.trae/skills/architecture-decision-record/SKILL.md` |
| 触发事件 | 架构决策记录 |
| 输入 | 决策背景（用户提供）、备选方案（用户提供）、约束条件（用户提供） |
| 输出 | `output/pm-development/architecture-decision-record/`（ADR-{NNNN}-{slug}.md、adr-index.json） |
| 验证 | 决策背景清晰，备选方案≥2，评分有依据，影响分析完整 |
| 执行模式 | 🤖→👤 |
| ⏸ 阶段卡口 | 架构决策确认：ADR经人类审核确认，未通过则补充决策依据 |

## 调度规则

- 执行子Skill前必须先读取其SKILL.md定义文件（`对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）`）
- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 每个阶段完成后，将中间结果写入 `output/pm-development/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| PRD门禁通过 | PRD质量门禁校验通过 | 阻止进入开发，返回PRD Pipeline |
| 任务分解完整 | Epic→Story→Task结构完整，无遗漏 | 补充分解后重新校验 |
| Sprint分配合理 | 无资源冲突，依赖关系已解决 | 重新分配或升级人类决策 |
| 隐私合规通过 | 无P0合规差距 | 阻止上线，优先整改P0项 |
| 安全需求已制定 | 安全需求清单经人类审核确认 | 阻止开发，补充安全需求 |
| 数据字典已建立 | 核心数据实体和字段规格已定义 | 补充数据定义 |
| 技术债务已登记 | 技术债务登记册经人类审核确认 | 补充债务识别 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 技术方案确认 | 任务分解涉及架构决策 | 确认技术选型和实现路径 |
| Sprint分配确认 | 资源冲突无法自动解决 | 确认人力分配和优先级取舍 |
| 需求变更审批 | 需求变更影响>5个需求或延期>3天 | 确认是否接受变更 |
| 合规整改确认 | 隐私合规P0差距 | 确认整改方案和上线时间 |
| 安全需求确认 | 安全需求清单生成完成 | 确认安全功能需求和安全验收标准 |
| 数据字典确认 | 数据字典生成完成 | 确认数据实体定义和字段规格 |
| 技术债务优先级确认 | 技术债务登记册生成完成 | 确认债务偿还优先级和计划 |
| 架构决策确认 | ADR生成完成 | 确认架构决策和权衡取舍 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 输入缺失 | 阻塞并告警 |
| 校验失败 | 返回错误原因 |
| 执行超时 | 重试3次后升级 |
| 外部系统不可用 | 降级处理+记录 |

## 变更记录

- v1.0: 初始版本
- v2.0: 结构优化
- v3.0: 新增 requirements-change-log（需求变更记录）、privacy-compliance-assessment（隐私合规评估）、security-requirements（安全需求清单）、data-dictionary（数据字典）、tech-debt-register（技术债务登记册）、architecture-decision-record（架构决策记录）
- v4.0: 优化为子Skill执行协议+阶段执行计划模式，增加子Skill定义读取路径和输入输出规范，调度规则从"加载"改为"执行"
