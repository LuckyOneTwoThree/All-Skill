---
name: ui-component-gen
description: 当需要生成前端UI组件代码时使用。UI组件自动生成，基于设计系统和意图描述，自动生成带样式和交互的前端组件代码，支持React/Vue/Svelte多框架输出。关键词：UI组件生成、组件代码、前端组件、React组件、Vue组件、设计系统组件。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 4: UI组件自动生成

## 核心原则

1. **令牌约束**：生成的组件100%引用Design Token，不硬编码样式值
2. **组件库优先**：优先复用组件库中的已有组件，不重复造轮子
3. **可访问性默认**：每个组件默认包含ARIA属性、键盘导航、焦点管理
4. **类型安全**：所有Props使用TypeScript类型定义，提供完整类型推导

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 组件意图描述 | string | 是 | 用户提供 | 自然语言描述需要生成的组件 |
| 设计令牌 | JSON | 是 | output/ui-design-system/design-token/tokens.json | 设计变量定义 |
| 组件库 | JSON | 是 | output/ui-design-system/component-library/library.json | 可复用的组件清单和规格 |
| 目标框架 | string | 是 | 用户提供 | React / Vue / Svelte |
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

### Step 2: 组件结构设计

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

- 所有色值引用 `var(--color-xxx)` 或 `tokens.color.xxx`
- 所有间距引用 `var(--spacing-xxx)` 或 `tokens.spacing.xxx`
- 所有字号引用 `var(--font-size-xxx)` 或 `tokens.typography.xxx`
- 响应式样式使用断点令牌
- 使用CSS Modules / Styled Components / Tailwind（与项目技术栈一致）

### Step 4: 交互逻辑实现

实现组件的交互行为：

- **表单组件**：受控/非受控双模式、验证逻辑、错误状态展示
- **列表组件**：虚拟滚动（数据量≥100条时）、空状态、加载状态
- **弹窗组件**：焦点陷阱、ESC关闭、遮罩点击关闭、滚动锁定
- **导航组件**：活跃状态管理、键盘导航（Tab/Arrow）、面包屑自动生成

### Step 5: 代码生成与校验

生成完整组件代码并校验：

- TypeScript类型检查通过
- 可访问性检查（aria-*属性完整、键盘可操作）
- Design Token引用率100%
- 生成Storybook Story（覆盖所有变体和状态）
- 生成单元测试骨架

## 输出

**存储路径**：`output/ui-frontend/ui-component-gen/`

**输出文件**：components.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["component_name", "framework", "files", "props", "token_coverage", "reused_components", "accessibility"],
  "properties": {
    "component_name": {"type": "string", "description": "组件名称"},
    "framework": {"type": "string", "description": "目标前端框架"},
    "files": {"type": "array", "description": "生成的组件文件列表，包含路径、类型和行数"},
    "props": {"type": "object", "description": "组件Props接口定义，包含类型、必填性和默认值"},
    "token_coverage": {"type": "string", "description": "Design Token引用覆盖率"},
    "reused_components": {"type": "array", "description": "复用的组件库组件名称列表"},
    "accessibility": {"type": "object", "description": "可访问性规格，包含ARIA角色、标签和键盘交互"}
  }
}
```

```json
{
  "component_name": "CourseCard",
  "framework": "react",
  "files": [
    { "path": "CourseCard/CourseCard.tsx", "type": "component", "lines": 85 },
    { "path": "CourseCard/CourseCard.module.css", "type": "style", "lines": 45 },
    { "path": "CourseCard/CourseCard.types.ts", "type": "types", "lines": 20 },
    { "path": "CourseCard/CourseCard.stories.tsx", "type": "story", "lines": 60 },
    { "path": "CourseCard/CourseCard.test.tsx", "type": "test", "lines": 35 }
  ],
  "props": {
    "title": { "type": "string", "required": true },
    "description": { "type": "string", "required": false, "default": "''" },
    "thumbnail": { "type": "string", "required": false },
    "price": { "type": "number", "required": false },
    "rating": { "type": "number", "required": false, "default": "0" },
    "onEnroll": { "type": "() => void", "required": false },
    "variant": { "type": "'default' | 'compact' | 'featured'", "default": "'default'" }
  },
  "token_coverage": "100%",
  "reused_components": ["Avatar", "Badge", "Rating"],
  "accessibility": {
    "role": "article",
    "aria_labels": ["aria-label=课程卡片", "aria-describedby=课程描述"],
    "keyboard": ["Tab进入", "Enter报名"]
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

## 质量检查

- [ ] Design Token引用率100%，无硬编码样式值
- [ ] TypeScript类型定义完整，无any类型
- [ ] 交互组件100%包含ARIA属性和键盘导航
- [ ] 单组件代码≤200行
- [ ] Story覆盖所有变体和状态
- [ ] 单元测试覆盖渲染+核心交互

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 设计令牌缺失 | 使用内联样式+TODO注释标注需替换为Token | 样式值硬编码，需后续替换 |
| 组件库缺失 | 全部新建组件，不检查复用 | 可能存在重复组件 |
| 目标框架未指定 | 默认React + TypeScript | 需手动转换为其他框架 |
| 组件意图描述缺失 | 若用户未提供组件意图描述，提示用户提供或跳过该输入相关步骤 | 无法生成组件 |
| 目标框架缺失 | 若用户未提供目标框架，提示用户提供或跳过该输入相关步骤 | 默认React + TypeScript |
| 原型规格缺失 | 基于意图描述推导组件规格 | 组件视觉细节可能不够精准 |

数据获取说明：
- 本Skill需要设计令牌和组件库定义，请通过以下方式之一提供：
  1. 上传tokens.json和library.json文件
  2. 描述组件意图和目标框架
  3. 提供PRD中相关页面描述
