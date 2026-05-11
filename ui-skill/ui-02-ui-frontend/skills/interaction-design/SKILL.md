---
name: interaction-design
description: 当需要生成交互设计规范和代码时使用。交互设计自动生成，基于组件和页面需求，生成交互状态机、动画规范、手势支持和反馈机制定义，输出为可执行的状态管理代码和动画代码。关键词：交互设计、状态机、动画、手势、反馈机制、交互规范。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 6: 交互设计自动生成

## 核心原则

1. **状态机驱动**：所有交互行为用有限状态机建模，状态转换显式定义
2. **反馈即时**：每个用户操作在100ms内有视觉反馈
3. **渐进增强**：基础交互无JS可用，增强交互依赖JS
4. **一致性**：同类交互在不同组件中行为一致

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 组件规格 | JSON | 是 | output/ui-frontend/ui-component-gen / output/ui-design-system/component-library | 组件Props和变体定义 |
| 页面需求 | markdown | 是 | output/ui-frontend/page-assembly / output/pm-design/design-prd | 页面交互场景描述 |
| 设计令牌 | JSON | 是 | output/ui-design-system/design-token/tokens.json | 动画时长、缓动曲线令牌 |

## 执行步骤

### Step 1: 交互场景梳理

从页面需求中提取所有交互场景：

| 交互类别 | 典型场景 | 关键指标 |
|----------|---------|---------|
| 点击反馈 | 按钮按下、卡片选中 | 反馈延迟<100ms |
| 表单交互 | 输入验证、自动补全、提交反馈 | 验证触发时机（blur/submit） |
| 拖拽操作 | 列表排序、看板拖拽 | 拖拽手柄、占位符、回弹 |
| 滚动交互 | 无限加载、吸顶、视差 | 触发距离、防抖间隔 |
| 手势操作 | 滑动删除、双指缩放、长按 | 手势阈值、冲突处理 |
| 过渡动画 | 页面切换、弹窗展开、列表增删 | 时长200-400ms |

### Step 2: 状态机设计

为每个有复杂交互的组件设计状态机：

```
[空闲] --focus--> [聚焦]
[聚焦] --input--> [输入中]
[输入中] --blur--> [验证中]
[验证中] --valid--> [有效]
[验证中] --invalid--> [错误]
[错误] --input--> [输入中]
[有效] --submit--> [提交中]
[提交中] --success--> [成功]
[提交中] --error--> [失败重试]
```

**状态机规则**：
- 每个状态必须有明确的进入条件和退出条件
- 不允许出现无法退出的死锁状态
- 每个状态转换必须有视觉反馈
- 异步操作必须有loading状态

### Step 3: 动画规范定义

基于Design Token定义动画规范：

| 动画令牌 | 值 | 使用场景 |
|----------|---|---------|
| duration-instant | 100ms | 按钮hover、焦点切换 |
| duration-fast | 200ms | 弹窗展开、下拉菜单 |
| duration-normal | 300ms | 页面切换、侧边栏展开 |
| duration-slow | 500ms | 复杂过渡、数据可视化 |
| easing-default | cubic-bezier(0.4, 0, 0.2, 1) | 大部分过渡 |
| easing-decelerate | cubic-bezier(0, 0, 0.2, 1) | 进入动画 |
| easing-accelerate | cubic-bezier(0.4, 0, 1, 1) | 退出动画 |
| easing-spring | cubic-bezier(0.175, 0.885, 0.32, 1.275) | 弹性效果 |

**动画规则**：
- 优先使用transform和opacity，避免布局属性动画
- 减弱动画偏好（prefers-reduced-motion）时禁用非必要动画
- 连续动画帧率≥60fps

### Step 4: 反馈机制设计

为每个交互定义反馈机制：

| 反馈类型 | 触发条件 | 实现方式 |
|----------|---------|---------|
| 视觉反馈 | 所有交互 | 状态样式变化（hover/active/focus） |
| 触觉反馈 | 移动端关键操作 | Haptic Feedback API |
| 声音反馈 | 可选（用户可关闭） | Web Audio API |
| 进度反馈 | 异步操作>300ms | Spinner/ProgressBar/Skeleton |
| 结果反馈 | 操作完成 | Toast/Inline Message/Badge |

### Step 5: 交互代码生成

将交互设计转化为可执行代码：

- **状态机**：使用XState或useReducer实现
- **动画**：使用Framer Motion / Vue Transition / CSS Animation
- **手势**：使用useGesture / Hammer.js
- **反馈**：Toast组件 + 进度组件 + 状态样式

## 输出

**存储路径**：`output/ui-frontend/interaction-design/`

**输出文件**：interaction-spec.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["interaction_spec"],
  "properties": {
    "interaction_spec": {"type": "object", "description": "交互规格定义，包含组件名、状态机、动画规范、手势和反馈机制"}
  }
}
```

```json
{
  "interaction_spec": {
    "component": "CourseCard",
    "state_machine": {
      "states": ["idle", "hovered", "pressed", "loading", "enrolled"],
      "transitions": [
        { "from": "idle", "trigger": "mouseenter", "to": "hovered", "feedback": "elevation-shadow-md" },
        { "from": "hovered", "trigger": "mousedown", "to": "pressed", "feedback": "scale(0.98)" },
        { "from": "pressed", "trigger": "mouseup", "to": "loading", "feedback": "spinner" },
        { "from": "loading", "trigger": "success", "to": "enrolled", "feedback": "badge+toast" }
      ]
    },
    "animations": [
      { "name": "card-hover", "duration": "duration-instant", "easing": "easing-default", "properties": ["box-shadow", "transform"] },
      { "name": "enroll-success", "duration": "duration-normal", "easing": "easing-spring", "properties": ["opacity", "transform"] }
    ],
    "gestures": [],
    "feedback": {
      "hover": "shadow-md + translateY(-2px)",
      "press": "scale(0.98)",
      "loading": "Spinner overlay",
      "success": "Toast('报名成功') + Badge('已报名')"
    }
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 状态数>8个 | 拆分为2个独立状态机 |
| 异步操作>300ms | 必须显示进度反馈 |
| 异步操作>3s | 显示预估剩余时间或进度条 |
| 动画帧率<60fps | 简化动画，减少同时动画属性 |
| 移动端交互 | 优先手势，减少依赖hover |
| prefers-reduced-motion | 禁用非必要动画，保留状态变化 |

## 质量检查

- [ ] 每个交互组件有完整状态机定义（状态+转换+反馈）
- [ ] 状态机无死锁状态
- [ ] 100%的用户操作在100ms内有视觉反馈
- [ ] 动画时长在100-500ms范围内
- [ ] 异步操作>300ms有进度指示
- [ ] 支持prefers-reduced-motion

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 组件规格缺失 | 基于页面需求推断组件交互 | 交互可能与组件Props不完全匹配 |
| 设计令牌缺失 | 使用默认动画时长（200ms/300ms/500ms） | 动画节奏可能不统一 |
| 页面需求缺失 | 仅生成基础交互（hover/focus/loading） | 缺少复杂交互定义 |

数据获取说明：
- 本Skill需要组件规格和页面需求，请通过以下方式之一提供：
  1. 上传组件规格JSON和页面需求描述
  2. 描述组件和页面的交互场景
  3. 提供交互设计参考（竞品截图/原型链接）
