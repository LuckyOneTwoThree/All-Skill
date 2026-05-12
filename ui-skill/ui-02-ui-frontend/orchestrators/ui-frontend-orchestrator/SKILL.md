---
name: ui-frontend-orchestrator
description: 当需要生成UI组件与前端代码时使用。UI前端指挥官，调度ui-component-gen/page-assembly/interaction-design/ui-review/frontend-test。关键词：UI前端、组件生成、页面组装、交互设计、UI审查、前端测试。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "orchestrator"
  version: "3.0"
---

# UI前端生成指挥官

## 核心原则

UI与前端一体化，设计即实现，实现即设计。

## 执行步骤

1. **组件先行**：先完成组件生成，再组装页面
2. **交互增强**：页面组装后添加交互设计
3. **审查闭环**：审查不通过则回退修复，不跳过
4. **测试保障**：测试覆盖核心流程，不盲目追求覆盖率

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/ui/ui-frontend-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/ui/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/ui/ui-frontend-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: ui-component-gen
    gate: Design Token引用率100% + TypeScript类型定义完整 + 交互组件包含ARIA属性
  - stage: page-assembly
    depends_on: [ui-component-gen]
    gate: 组件树层级≤4层 + 100%组件来自组件库或ui-component-gen生成
  - stage: interaction-design
    depends_on: [ui-component-gen, page-assembly]
    gate: 所有异步操作有loading状态 + 状态机无死锁 + 动画时长100-500ms
  - stage: ui-review
    depends_on: [ui-component-gen, page-assembly, interaction-design]
    gate: P0问题=0
  - stage: frontend-test
    depends_on: [ui-component-gen, page-assembly, interaction-design, ui-review]
    gate: 核心流程E2E测试100%通过
```

## 阶段执行计划

### 阶段1：ui-component-gen

#### 调用 ui-component-gen

```
Skill: ui-component-gen
输入:
  组件意图描述: 用户提供
  设计令牌: output/ui-design-system/design-token/tokens.json
  组件库: output/ui-design-system/component-library/library.json
  目标框架: 用户提供
  原型规格: output/pm-design/design-prototype/prototype_spec.json（可选）
  PRD: output/pm-design/design-prd/prd.md（可选）
输出: output/ui-frontend/ui-component-gen/
验证: Design Token引用率100% + TypeScript类型定义完整 + 交互组件包含ARIA属性
模式: 🤖→👤
```

### 阶段2：page-assembly

#### 调用 page-assembly

```
Skill: page-assembly
输入:
  页面需求: 用户提供 / output/pm-design/design-prd/prd.md
  组件库: output/ui-design-system/component-library/library.json
  已生成组件: output/ui-frontend/ui-component-gen/components.json
  设计令牌: output/ui-design-system/design-token/tokens.json
  路由结构: output/pm-design/design-ia/ia_proposals.json（可选）
  原型规格: output/pm-design/design-prototype/prototype_spec.json（可选）
输出: output/ui-frontend/page-assembly/
验证: 组件树层级≤4层 + 100%组件来自组件库或ui-component-gen生成
模式: 🤖→👤
```

### 阶段3：interaction-design

#### 调用 interaction-design

```
Skill: interaction-design
输入:
  组件规格: output/ui-frontend/ui-component-gen/ / output/ui-design-system/component-library
  页面需求: output/ui-frontend/page-assembly/ / output/pm-design/design-prd
  设计令牌: output/ui-design-system/design-token/tokens.json
输出: output/ui-frontend/interaction-design/
验证: 所有异步操作有loading状态 + 状态机无死锁 + 动画时长100-500ms
模式: 🤖→👤
```

### 阶段4：ui-review

#### 调用 ui-review

```
Skill: ui-review
输入:
  组件代码: output/ui-frontend/ui-component-gen/
  页面代码: output/ui-frontend/page-assembly/
  设计令牌: output/ui-design-system/design-token/tokens.json
  交互规格: output/ui-frontend/interaction-design/（可选）
输出: output/ui-frontend/ui-review/
验证: P0问题=0
模式: 🤖
```

### 阶段5：frontend-test

#### 调用 frontend-test

```
Skill: frontend-test
输入:
  组件代码: output/ui-frontend/ui-component-gen/
  页面代码: output/ui-frontend/page-assembly/
  交互规格: output/ui-frontend/interaction-design/（可选）
  UI审查结果: output/ui-frontend/ui-review/（可选）
输出: output/ui-frontend/frontend-test/
验证: 核心流程E2E测试100%通过
模式: 🤖
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 组件生成完成 | Design Token引用率100% | 硬编码值必须替换为Token引用 |
| 页面组装完成 | 组件树层级≤4层 | 层级过深需重构后才能进入交互阶段 |
| 交互设计完成 | 所有异步操作有loading状态 | 缺失loading状态必须补充 |
| UI审查完成 | P0问题=0 | P0问题必须修复后才能进入测试阶段 |
| 前端测试完成 | 核心流程E2E测试100%通过 | 不通过则回退到组件生成阶段修复 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 组件方案确认 | ui-component-gen执行时 | AI生成组件清单，人类确认组件边界和Props设计 |
| 页面布局确认 | page-assembly执行时 | AI生成页面布局方案，人类确认布局选择 |
| 交互方案确认 | interaction-design执行时 | AI生成交互状态机，人类确认交互行为 |
| UI审查P1问题处理 | ui-review发现P1问题时 | P1问题修复还是接受为技术债务 |
| 测试策略确认 | frontend-test执行时 | AI生成测试方案后，人类确认测试范围和优先级 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 设计令牌缺失 | 降级使用默认设计令牌，标注"缺乏品牌定制" |
| 组件库不完整 | 基于已有组件组装，缺失组件标注"待补充" |
| UI审查P0问题 | 必须修复后才能进入测试阶段 |
| E2E测试环境不可用 | 跳过E2E测试，标注"E2E待执行"，不阻塞发布 |
| 组件树层级过深 | 标注"需重构"，人类确认是否立即重构或标记为技术债务 |

## 变更记录

- v3.0: 统一优化为编排协议+Pipeline+调用指令格式，删除调度规则，增加并行阶段分析
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
