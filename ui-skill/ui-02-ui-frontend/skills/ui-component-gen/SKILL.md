---
name: ui-component-gen
description: 当需要生成前端UI组件代码时使用。UI组件自动生成，基于设计系统和意图描述，自动生成带样式、交互和状态机的前端组件代码，支持React/Vue/Svelte多框架输出。关键词：UI组件生成、组件代码、前端组件、React组件、Vue组件、交互设计、状态机、动画、写组件、出代码、加交互。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "帮我写个前端组件"
    - "生成一个按钮组件"
    - "出一段组件代码"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 4: UI组件自动生成

## 核心原则

1. **令牌约束**：生成的组件100%引用Design Token，不硬编码样式值
2. **组件库优先**：优先复用组件库中的已有组件，不重复造轮子
3. **可访问性默认**：每个组件默认包含ARIA属性、键盘导航、焦点管理
4. **类型安全**：所有Props使用TypeScript类型定义，提供完整类型推导
5. **交互即组件**：交互状态机和动画是组件的一部分，不是附加层

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 组件意图描述 | string | 是 | 用户提供 | 自然语言描述需要生成的组件 |
| 设计令牌 | JSON | 是 | output/ui-design-system/design-system/tokens.json | 设计变量定义 |
| 组件库 | JSON | 是 | output/ui-design-system/design-system/library.json | 可复用的组件清单和规格 |
| 目标框架 | string | 是 | 用户提供 | React / Vue / Svelte |
| 目标语言 | string | 是 | 上游编排器传递 / 用户提供（默认zh-CN） | 目标界面语言，影响占位文案/aria-label/按钮文案语言 |
| 原型规格 | JSON | ○ | output/pm-design/design-prototype/prototype_spec.json | 原型定义的组件视觉和交互规格 |
| PRD | markdown | ○ | output/pm-design/design-prd/prd.md | 产品需求上下文 |

## 执行步骤

### Step 1: 意图解析与组件匹配

解析用户的组件意图描述：

- 提取组件功能需求（展示/交互/数据/布局）
- 若有原型规格，从原型中提取组件视觉规格和交互行为
- 检查组件库中是否有可复用组件
- 确定需要新建的组件和可复用的组件
- 生成组件Props接口草案

**复用检查规则**：
- 组件库中已有功能匹配度≥80%的组件 → 直接复用，扩展Props
- 功能匹配度50%-80% → 复用并组合，补充差异逻辑
- 功能匹配度<50% → 新建组件

### Step 2: 组件结构设计与Props定义

设计组件的内部结构：

| 设计要素 | 规范 |
|----------|------|
| 文件结构 | 组件文件 + 样式文件 + 类型文件 + 测试文件 + Story文件 |
| Props设计 | 必填Props最小化，可选Props提供合理默认值 |
| 状态管理 | 内部状态用useState/refs，外部状态通过Props回调 |
| 子组件拆分 | 单组件代码≤200行，超出则拆分子组件 |
| 事件处理 | onChange/onSubmit/onClick统一命名，事件对象标准化 |

### Step 3: 样式实现

基于Design Token实现组件样式：

**样式方案决策树**：

| 项目技术栈 | 推荐方案 | 理由 |
|-----------|---------|------|
| Tailwind已配置 | Tailwind类名 | 与项目一致，零额外成本 |
| CSS Modules已配置 | CSS Modules | 作用域隔离，零运行时 |
| Styled Components已配置 | Styled Components | 与项目一致 |
| 无明确方案 | CSS Modules | 默认推荐，作用域隔离+零运行时+良好SSR支持 |

**AI执行指引**：样式实现时，所有色值引用 `var(--color-xxx)` 或 `tokens.color.xxx`，间距引用 `var(--spacing-xxx)`，字号引用 `var(--font-size-xxx)`。响应式样式使用断点令牌。

### Step 4: 交互逻辑与状态机

为每个有复杂交互的组件设计状态机：

```
[空闲] --focus--> [聚焦]
[聚焦] --input--> [输入中]
[输入中] --blur--> [验证中]
[验证中] --valid--> [有效]
[验证中] --invalid--> [错误]
```

**状态机规则**：
- 每个状态必须有明确的进入条件和退出条件
- 不允许出现无法退出的死锁状态
- 每个状态转换必须有视觉反馈
- 异步操作必须有loading状态

**动画规范**（引用设计令牌中的动画令牌）：

| 场景 | 时长令牌 | 缓动令牌 |
|------|---------|---------|
| 按钮hover | duration-instant | easing-default |
| 弹窗展开 | duration-fast | easing-decelerate |
| 页面切换 | duration-normal | easing-default |
| 复杂过渡 | duration-slow | easing-decelerate |

**反馈机制**：

| 反馈类型 | 触发条件 | 实现方式 |
|----------|---------|---------|
| 视觉反馈 | 所有交互 | 状态样式变化 |
| 进度反馈 | 异步操作>300ms | Spinner/ProgressBar/Skeleton |
| 结果反馈 | 操作完成 | Toast/Inline Message |

**交互代码生成**：
- 状态机：使用useReducer实现（轻量场景）或XState（复杂场景，状态数>8）
- 动画：使用Framer Motion / Vue Transition / CSS Animation
- 反馈：Toast组件+进度组件+状态样式

**外部 Skill 调用**（按执行顺序，同Skill子命令合并为单次调用以节省token）：

Step 1 外部调用：

| 顺序 | 调用 | 客观触发条件 | Register 感知 | 反模式（不调用条件） |
|------|------|-------------|--------------|-------------------|
| 1 | `ext-impeccable` `shape` | 组件意图描述含"复杂"/状态数>5/涉及多步骤流程 | brand:探索视觉可能性；product:聚焦用户任务 | 简单展示组件（Badge/Divider/Spacer） |

Step 4 外部调用（严格按顺序，每步依赖前步输出）：

| 顺序 | 调用 | 客观触发条件 | Register 感知 | 反模式（不调用条件） |
|------|------|-------------|--------------|-------------------|
| 1 | `ext-frontend-design` | 组件视觉描述含"卡片网格"/主色为蓝紫渐变/无明确美学方向 | brand:大胆视觉突破；product:差异化但克制 | 用户要求遵循特定UI库（如shadcn/Ant Design） |
| 2 | `ext-interaction-design` | 组件有拖拽/手势/页面转换/复杂状态转换 | 均适用 | 纯展示组件无交互 |
| 3 | `ext-impeccable` `animate bolder|quieter delight` | 满足任一子命令触发条件即调用该子命令，一次调用传入所有命中的子命令 | brand/product按子命令分别感知 | 各子命令独立判断不调用条件 |

子命令触发条件明细：
- `animate`：组件状态转换>3个 或 有异步操作（反模式：数据密集型仪表盘或医疗/金融场景）
- `bolder`：品牌色占比<15% 或 组件视觉描述含"安全/标准/普通"（反模式：已调用ext-frontend-design且方向足够大胆）
- `quieter`：品牌色占比>40% 或 组件视觉描述含"花哨/过度/太重" 或 医疗/金融/法律场景（反模式：组件视觉已偏保守）
- `delight`：组件为核心用户流程节点（反模式：辅助功能组件或后台管理组件）

Step 5 外部调用：

| 顺序 | 调用 | 客观触发条件 | Register 感知 | 反模式（不调用条件） |
|------|------|-------------|--------------|-------------------|
| 1 | `ext-impeccable` `harden polish` | 满足任一子命令触发条件即调用，一次调用传入所有命中的子命令 | brand:高端感打磨；product:专业感打磨 | 各子命令独立判断不调用条件 |

子命令触发条件明细：
- `harden`：组件有表单输入/异步操作/国际化需求（反模式：纯静态展示组件）
- `polish`：所有Step 4外部调用完成后（反模式：无，polish始终是最后一步）

**bolder vs quieter 决策规则**：同一组件只能调用其中一个，不可同时调用。判断依据：品牌色占比<25%→bolder，>40%→quieter，25%-40%→不调用（已平衡）。

### Step 5: 代码生成与校验

生成完整组件代码并校验：

- TypeScript类型检查通过
- 可访问性检查（aria-*属性完整、键盘可操作）
- Design Token引用率100%
- 生成Storybook Story（覆盖所有变体和状态）
- 生成单元测试骨架
- 状态机无死锁状态
- 动画时长在100-500ms范围内
- 异步操作>300ms有进度指示
- 支持prefers-reduced-motion

### L1 模式说明

当输入包含 `L1模式: true` 时，ui-component-gen 需额外承担以下职责（替代 L2 中独立的 page-assembly 和 ui-review）：

**页面组装**（L1内建）：
- 在组件生成后，根据用户提供的页面结构需求，直接生成页面代码
- 页面组件树层级≤4层
- 路由配置覆盖全部页面
- 加载状态和错误处理100%覆盖

**内建质量检查**（L1内建，替代 ui-review）：

| 内建检查项 | 通过标准 |
|-----------|---------|
| Token引用率检查 | 100%使用Token变量 |
| 对比度检查 | 正文≥4.5:1，大文本≥3:1 |
| ARIA属性检查 | 交互组件有正确role和aria-* |
| 状态覆盖检查 | default/hover/focus/active/disabled |
| 组件来源检查 | 100%来自组件库或本次生成 |
| 页面层级检查 | 组件树层级≤4层 |

未通过的内建检查项处理：P0问题必须修复，P1问题标注"待修复"。

## 输出

**存储路径**：`output/ui-frontend/ui-component-gen/`

**输出文件**：components.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["component_name", "framework", "files", "props", "token_coverage", "reused_components", "accessibility", "interaction"],
  "properties": {
    "component_name": {"type": "string", "description": "组件名称"},
    "framework": {"type": "string", "description": "目标前端框架"},
    "files": {"type": "array", "description": "生成的组件文件列表，包含路径、类型和行数"},
    "props": {"type": "object", "description": "组件Props接口定义，包含类型、必填性和默认值"},
    "token_coverage": {"type": "string", "description": "Design Token引用覆盖率"},
    "reused_components": {"type": "array", "description": "复用的组件库组件名称列表"},
    "accessibility": {"type": "object", "description": "可访问性规格，包含ARIA角色、标签和键盘交互"},
    "interaction": {"type": "object", "description": "交互规格，包含状态机、动画和反馈机制"}
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 组件库匹配度≥80% | 复用已有组件，扩展Props，不新建 |
| 组件库匹配度50%-80% | 复用+组合，补充差异 |
| 组件库匹配度<50% | 新建组件 |
| 数据量≥100条 | 强制使用虚拟滚动 |
| 弹窗/对话框组件 | 强制实现焦点陷阱+ESC关闭 |
| 单组件代码>200行 | 拆分为1个父组件+N个子组件 |
| 目标框架=React | 输出TSX + CSS Modules |
| 目标框架=Vue | 输出SFC(.vue) + Scoped CSS |
| 目标框架=Svelte | 输出.svelte组件 |
| 目标语言=zh-CN | 占位文案"请输入"/"加载中"/"提交"，aria-label使用中文 |
| 目标语言=en-US | 占位文案"Enter..."/"Loading..."/"Submit"，aria-label使用英文 |
| 目标语言=ar-SA | 占位文案使用阿拉伯语，排版方向RTL，aria-label使用阿拉伯语 |
| 目标语言含多种 | 占位文案使用i18n key（如t('placeholder')），内建i18n框架配置 |
| 状态数>8个 | 拆分为2个独立状态机，或使用XState |
| 异步操作>300ms | 必须显示进度反馈 |
| 动画帧率<60fps | 简化动画，减少同时动画属性 |
| 移动端交互 | 优先手势，减少依赖hover |
| prefers-reduced-motion | 禁用非必要动画，保留状态变化 |

## 质量检查

- [ ] Design Token引用率100%，无硬编码样式值
- [ ] TypeScript类型定义完整，无any类型
- [ ] 交互组件100%包含ARIA属性和键盘导航
- [ ] 单组件代码≤200行
- [ ] Story覆盖所有变体和状态
- [ ] 单元测试覆盖渲染+核心交互
- [ ] 每个交互组件有完整状态机定义（状态+转换+反馈）
- [ ] 状态机无死锁状态
- [ ] 100%的用户操作在100ms内有视觉反馈
- [ ] 动画时长在100-500ms范围内
- [ ] 异步操作>300ms有进度指示
- [ ] 支持prefers-reduced-motion

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 设计令牌缺失 | 使用内联样式+TODO注释标注需替换为Token | 样式值硬编码，需后续替换 |
| 组件库缺失 | 全部新建组件，不检查复用 | 可能存在重复组件 |
| 目标框架未指定 | 默认React+TypeScript | 需手动转换为其他框架 |
| 原型规格缺失 | 基于意图描述推导组件规格 | 组件视觉细节可能不够精准 |
| 交互场景描述缺失 | 仅生成基础交互（hover/focus/loading） | 缺少复杂交互定义 |
| 动画令牌缺失 | 使用默认动画时长（200ms/300ms/500ms） | 动画节奏可能不统一 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 设计令牌变更 | 组件样式引用 | 标注受影响的组件，建议更新Token引用 |
| 组件库变更 | 组件复用关系 | 标注受影响的复用组件，建议重新匹配 |
| PRD功能变更 | 组件需求 | 标注受影响的组件，建议重新生成 |

### 下游通知机制

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 组件增删 | page-assembly | 新增/删除的组件清单 | 组件列表变更 |
| 组件Props变更 | page-assembly、ui-review | 受影响的页面和审查项 | Props接口变更 |
| 交互行为变更 | ui-review、frontend-test | 受影响的审查和测试 | 状态机或动画变更 |

## 数据获取说明

本Skill需要组件意图描述和设计令牌，请通过以下方式之一提供：

1. 描述需要生成的组件功能和交互行为
2. 上传tokens.json和library.json文件
3. 提供PRD中相关组件需求章节

## 变更记录

- v2.1: 新增目标语言参数；外部Skill调用点重构为表格格式（含执行顺序/客观触发条件/Register感知/反模式）；新增shape/harden/quieter子命令；bolder/quieter互斥规则
- v2.0: 合并 interaction-design 为内置步骤；新增动画令牌引用；外部Skill调用点
