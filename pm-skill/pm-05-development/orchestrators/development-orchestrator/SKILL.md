---
name: development-orchestrator
description: 当需要将PRD转化为开发任务、进行代码审查或管理需求变更时使用。开发协作指挥官，调度任务分解、代码审查、PRD同步及合规安全等子Skill。关键词：开发协作、任务分解、代码审查、PRD同步、需求变更、隐私合规、安全需求。
metadata:
  module: "产品开发与上线"
  sub-module: "开发交付"
  type: "orchestrator"
  version: "6.0"
---

# 开发协作指挥官

## 核心原则

**让正确的东西被正确地构建出来**

开发协作的本质不是流程管控，而是确保从需求到交付的每一步都指向正确的目标、以正确的方式执行。

## 编排理念

1. **需求到交付的闭环驱动**：每个子Skill的输出必须是下一个子Skill的输入，形成从需求理解到技术交付的完整链路
2. **卡口即质量底线**：阶段卡口不是流程瓶颈而是质量底线，未通过则回溯而非放行
3. **按需调度而非全量执行**：主流程顺序执行，附加阶段按需触发，避免不必要的资源消耗

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/pm-development/development-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入对应模块的 `output/pm-development/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/pm-development/development-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: development-task-breakdown
    gate: Epic→Story→Task结构完整无遗漏
  - stage: development-auto-review
    parallel: true
    gate: Sprint分配合理
  - stage: development-prd-sync
    depends_on: [development-task-breakdown]
    gate: PRD门禁通过
  - stage: requirements-change-log
    trigger: 需求变更请求
    gate: 需求变更审批
  - stage: privacy-compliance-assessment
    trigger: 上线前合规检查
    gate: 隐私合规通过
  - stage: security-requirements
    trigger: 安全需求制定
    gate: 安全需求已制定
  - stage: data-dictionary
    trigger: 数据标准制定
    gate: 数据字典已建立
  - stage: tech-debt-register
    trigger: 技术债务管理
    gate: 技术债务已登记
  - stage: architecture-decision-record
    trigger: 架构决策记录
    gate: 架构决策确认
```

## 阶段执行计划

### 主流程

#### 调用 development-task-breakdown

```
Skill: development-task-breakdown
输入:
  prd_pipeline_output: PRD Pipeline输出（prd_task_breakdown、prd_quality_gates）
  tech_stack: 技术规范库
  team_capacity: 团队配置
  sprint_calendar: 项目日历
输出: output/pm-development/development-task-breakdown/
验证: Epic→Story→Task三级结构完整，Sprint分配覆盖率100%，依赖关系识别率100%
模式: 🤖
```

#### 调用 development-auto-review

```
Skill: development-auto-review
输入:
  change_request: 变更管理系统
  current_prd: PRD管理系统
  current_tech_plan: 技术方案库
  dev_progress: 开发跟踪系统
输出: output/pm-development/development-auto-review/
验证: 影响范围功能/技术/测试/运营四维度全覆盖，重评审判断有对应证据
模式: 🤖
```

#### 调用 development-prd-sync

```
Skill: development-prd-sync
输入:
  prd_doc: output/pm-design/design-prd/prd.json
  tech_plan: output/pm-development/development-task-breakdown/task_breakdown.json
  dev_progress: 用户提供
输出: output/pm-development/development-prd-sync/
验证: 同步延迟<1小时，冲突检测准确率≥90%，功能/技术/测试用例全覆盖
模式: 🤖
```

### 附加调度（按需触发）

#### 调用 requirements-change-log

```
Skill: requirements-change-log
输入:
  prd_doc: output/pm-design/design-prd/PRD-{产品名}.md
  srs_doc: output/pm-design/requirements-srs/SRS-{产品名}.md
  change_description: 变更描述
  change_reason: 变更原因
  change_initiator: 变更发起人
输出: output/pm-development/requirements-change-log/
验证: 变更有唯一编号，影响评估覆盖5个维度，审批流程已定义
模式: 🤖→👤
```

#### 调用 privacy-compliance-assessment

```
Skill: privacy-compliance-assessment
输入:
  prd_doc: output/pm-design/design-prd/PRD-{产品名}.md
  api_contract: backend api-contract → openapi.yaml
  data_model: backend data-model → er_model.json
  target_market: 目标市场
输出: output/pm-development/privacy-compliance-assessment/
验证: 适用法规已识别，个人信息盘点完整，合规检查清单逐项覆盖
模式: 🤖→👤
```

#### 调用 security-requirements

```
Skill: security-requirements
输入:
  prd: design-prd
  srs: requirements-srs
  privacy_assessment: privacy-compliance-assessment
  security_standards: 安全标准
输出: output/pm-development/security-requirements/
验证: STRIDE全覆盖，安全需求可追溯，合规映射完整，验收标准可验证
模式: 🤖→👤
```

#### 调用 data-dictionary

```
Skill: data-dictionary
输入:
  prd: design-prd
  srs: requirements-srs
  data_model: 用户提供
输出: output/pm-development/data-dictionary/
验证: 实体覆盖完整，字段规格精确，敏感数据已标注，枚举值完整
模式: 🤖→👤
```

#### 调用 tech-debt-register

```
Skill: tech-debt-register
输入:
  code_review_result: development-auto-review
  prd_sync_record: development-prd-sync
  tech_info: 用户提供
输出: output/pm-development/tech-debt-register/
验证: 债务分类完整，影响评估量化，优先级有依据，偿还计划可执行
模式: 🤖→👤
```

#### 调用 architecture-decision-record

```
Skill: architecture-decision-record
输入:
  decision_context: 用户提供（决策背景）
  alternatives: 用户提供（备选方案）
  constraints: 用户提供（约束条件）
输出: output/pm-development/architecture-decision-record/
验证: 决策背景清晰，备选方案≥2，评分有依据，影响分析完整
模式: 🤖→👤
```

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
- v5.0: 执行步骤原则替换为编排理念
- v6.0: 编排协议优化——将"读取子Skill定义并代理执行"改为"使用Skill工具显式调用子Skill"；新增Pipeline定义（YAML声明式执行图）；阶段执行计划改为调用指令格式；调度规则合并入编排协议
