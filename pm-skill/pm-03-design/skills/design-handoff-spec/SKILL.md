---
name: design-handoff-spec
description: 当设计阶段完成需要交付给开发团队时使用。设计交接文档自动生成，整合原型规格、设计令牌、交互规则和响应式断点，产出面向开发的设计交接清单文档。关键词：设计交接、设计交付、Handoff、设计标注、切图清单、设计开发交接。
metadata:
  module: "产品构思与设计"
  sub-module: "设计交付"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 设计交接文档自动生成

## 核心原则

1. **开发是设计的消费者**——交接文档是给开发看的，用开发能理解的语言
2. **零歧义**——颜色用色值不用"浅蓝"，间距用像素不用"稍大一点"
3. **完整性校验**——每个页面、每个状态、每个断点都必须覆盖
4. **可追溯**——设计决策有依据，变更可追踪

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 原型规格 | JSON | ○ | output/pm-design/design-prototype/prototype_spec.json | 页面原型和交互规格 |
| 设计令牌 | JSON | ○ | output/pm-design/design-token/tokens.json | 颜色/字体/间距/阴影 |
| IA信息架构 | JSON | ○ | output/pm-design/design-ia/ia.json | 页面路由和导航结构 |
| 用户流程 | JSON | ○ | output/pm-design/design-userflow/userflow.json | 用户操作流程和状态机 |
| PRD文档 | Markdown | ○ | output/pm-design/design-prd/PRD-{产品名}.md | 产品需求参考 |
| 组件库 | JSON | ○ | output/pm-design/component-library/component-library.json | 可复用组件清单 |

## 执行步骤

### Step 1: 页面清单与路由映射

基于 IA 和原型规格，生成完整的页面清单：

**页面清单**：

| 页面名称 | 路由 | 层级 | 原型文件 | 状态 |
|----------|------|------|---------|------|
| 首页 | / | L1 | home.fig | 已设计 |
| 商品详情 | /product/:id | L2 | product-detail.fig | 已设计 |
| 购物车 | /cart | L2 | cart.fig | 已设计 |
| 结算页 | /checkout | L3 | checkout.fig | 待设计 |

**路由结构**（来自 ia.json 的 routes）：

```
/                    → 首页
/product/:id         → 商品详情
/cart                → 购物车
/checkout            → 结算页
/checkout/success    → 支付成功
/profile             → 个人中心
```

### Step 2: 设计令牌映射

将设计令牌翻译为开发可直接使用的规格：

**颜色系统**：

| 令牌名 | 色值 | 用途 | CSS变量 |
|--------|------|------|---------|
| color-primary | #1890FF | 主色调 | var(--color-primary) |
| color-danger | #FF4D4F | 错误/危险 | var(--color-danger) |
| color-text-primary | #262626 | 主文本 | var(--color-text-primary) |
| color-text-secondary | #8C8C8C | 辅助文本 | var(--color-text-secondary) |
| color-bg-page | #F5F5F5 | 页面背景 | var(--color-bg-page) |

**字体系统**：

| 令牌名 | 字体 | 大小 | 行高 | 字重 | CSS变量 |
|--------|------|------|------|------|---------|
| font-heading-1 | PingFang SC | 24px | 32px | 600 | var(--font-heading-1) |
| font-body | PingFang SC | 14px | 22px | 400 | var(--font-body) |
| font-caption | PingFang SC | 12px | 18px | 400 | var(--font-caption) |

**间距系统**：

| 令牌名 | 值 | 用途 | CSS变量 |
|--------|-----|------|---------|
| spacing-xs | 4px | 紧凑间距 | var(--spacing-xs) |
| spacing-sm | 8px | 小间距 | var(--spacing-sm) |
| spacing-md | 16px | 标准间距 | var(--spacing-md) |
| spacing-lg | 24px | 大间距 | var(--spacing-lg) |
| spacing-xl | 32px | 超大间距 | var(--spacing-xl) |

**阴影系统**：

| 令牌名 | 值 | 用途 |
|--------|-----|------|
| shadow-sm | 0 1px 2px rgba(0,0,0,0.06) | 轻微浮起 |
| shadow-md | 0 4px 12px rgba(0,0,0,0.1) | 卡片浮起 |
| shadow-lg | 0 8px 24px rgba(0,0,0,0.15) | 弹窗浮起 |

### Step 3: 组件规格清单

列出每个页面使用的组件及其规格：

**组件清单**：

| 组件名 | 所属页面 | 变体 | 设计令牌依赖 | 交互规则 | 状态 |
|--------|---------|------|------------|---------|------|
| Button | 全局 | primary/secondary/danger | color-*, spacing-* | hover/active/disabled | ✅ |
| Input | 表单页 | default/error/disabled | color-*, font-* | focus/error | ✅ |
| Card | 列表页 | default/selected | shadow-*, spacing-* | click/hover | ✅ |
| Modal | 全局 | info/confirm/danger | shadow-lg | open/close/confirm | ⚠️缺动画 |

**每个组件的详细规格**：

```
### Button 组件
- 尺寸：大(40px高) / 中(32px高) / 小(24px高)
- 圆角：6px（primary）/ 4px（secondary）
- 内边距：12px 20px（中号）
- 文字：font-body, color: white(primary) / color-primary(secondary)
- 边框：1px solid color-primary(secondary)
- 状态：
  - Default: 如上
  - Hover: 背景色加深10%
  - Active: 背景色加深20%
  - Disabled: opacity: 0.4, cursor: not-allowed
  - Loading: 显示旋转图标，文字保留
```

### Step 4: 交互规则文档

基于用户流程和原型规格，生成交互规则：

**页面级交互**：

| 页面 | 交互 | 触发 | 效果 | 动画 |
|------|------|------|------|------|
| 首页 | 下拉刷新 | 下拉>60px | 刷新内容 | 弹性回弹 300ms |
| 商品详情 | 加入购物车 | 点击按钮 | 按钮变"已加入"+购物车角标+1 | 缩放 200ms |
| 购物车 | 删除商品 | 左滑>80px | 显示删除按钮 | 滑动 200ms |

**全局交互规则**：

| 规则 | 说明 |
|------|------|
| 加载状态 | 骨架屏（首屏）/ Spinner（局部）/ 进度条（上传下载） |
| 空状态 | 插图 + 引导文案 + 操作按钮 |
| 错误状态 | 错误图标 + 错误描述 + 重试按钮 |
| 网络断开 | Toast提示"网络连接已断开" |
| 表单验证 | 实时验证（失焦后）+ 提交验证（点击后） |

### Step 5: 响应式断点规格

**断点定义**：

| 断点名称 | 宽度范围 | 列数 | 间距 | 典型设备 |
|----------|---------|------|------|---------|
| xs | 0-375px | 4 | 16px | iPhone SE |
| sm | 376-428px | 4 | 16px | iPhone 14 |
| md | 429-768px | 8 | 24px | iPad Mini |
| lg | 769-1024px | 8 | 24px | iPad Pro |
| xl | 1025-1440px | 12 | 24px | 笔记本 |
| xxl | 1441px+ | 12 | 32px | 桌面显示器 |

**每个页面的响应式适配**：

| 页面 | xs/sm | md | lg/xl/xxl |
|------|-------|-----|-----------|
| 首页 | 单列瀑布流 | 双列 | 三列+侧边栏 |
| 商品详情 | 全宽图片+信息 | 左图右信息 | 左图右信息+推荐 |

### Step 6: 切图与资源清单

**资源清单**：

| 资源名 | 类型 | 尺寸 | 格式 | 用途 | 状态 |
|--------|------|------|------|------|------|
| logo | 图标 | 120x40 | SVG | 导航栏 | ✅ |
| empty-state | 插图 | 240x180 | PNG@2x | 空状态 | ✅ |
| icon-cart | 图标 | 24x24 | SVG | 购物车 | ✅ |

**图标规格**：
- 尺寸：16/20/24/32px
- 格式：SVG（优先）/ PNG@2x@3x
- 颜色：currentColor（支持主题切换）

### Step 7: 文档组装

**交接文档结构**：

```
# {产品名}设计交接文档

## 1. 概述
### 1.1 项目信息
### 1.2 设计文件索引
### 1.3 设计令牌版本

## 2. 页面清单与路由
### 2.1 路由结构
### 2.2 页面清单

## 3. 设计令牌
### 3.1 颜色系统
### 3.2 字体系统
### 3.3 间距系统
### 3.4 阴影系统
### 3.5 圆角系统

## 4. 组件规格
### 4.1 组件清单
### 4.2 逐组件详细规格

## 5. 交互规则
### 5.1 全局交互规则
### 5.2 页面级交互

## 6. 响应式规格
### 6.1 断点定义
### 6.2 逐页面适配方案

## 7. 资源清单
### 7.1 图标
### 7.2 插图
### 7.3 图片

## 8. 待确认项
| 编号 | 问题 | 影响范围 | 负责人 | 状态 |
|------|------|---------|--------|------|

## 附录
- 设计规范一致性检查报告
- 变更记录
```

## 输出

**存储路径**：`output/pm-design/design-handoff-spec/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| design-handoff-spec.md | Markdown | 完整设计交接文档 |
| design-handoff-spec.json | JSON | 结构化数据 |

**design-handoff-spec.json 结构**：

```json
{
  "project_info": {
    "product": "产品名",
    "version": "1.0",
    "design_tool": "Figma",
    "token_version": "1.0"
  },
  "pages": [
    {
      "name": "页面名",
      "route": "/path",
      "level": "L1/L2/L3",
      "design_status": "已设计/待设计"
    }
  ],
  "routes": [],
  "tokens": {
    "colors": [],
    "typography": [],
    "spacing": [],
    "shadows": [],
    "border_radius": []
  },
  "components": [
    {
      "name": "组件名",
      "pages": [],
      "variants": [],
      "token_dependencies": [],
      "interaction_rules": [],
      "status": "✅/⚠️/❌"
    }
  ],
  "interactions": {
    "global_rules": [],
    "page_level": []
  },
  "responsive": {
    "breakpoints": [],
    "page_adaptations": []
  },
  "assets": [],
  "open_questions": []
}
```

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| project_info.product | string | 是 | 产品名称 |
| project_info.version | string | 是 | 文档版本号 |
| pages | array | 是 | 页面清单，不可为空 |
| pages[].name | string | 是 | 页面名称 |
| pages[].route | string | 是 | 页面路由 |
| pages[].level | string | 是 | 页面层级（L1/L2/L3） |
| pages[].design_status | string | 是 | 设计状态 |
| routes | array | 是 | 路由结构 |
| tokens | object | 是 | 设计令牌集合 |
| tokens.colors | array | 是 | 颜色令牌列表 |
| tokens.typography | array | 是 | 字体令牌列表 |
| tokens.spacing | array | 是 | 间距令牌列表 |
| components | array | 是 | 组件清单 |
| components[].name | string | 是 | 组件名称 |
| components[].variants | array | 是 | 组件变体 |
| components[].status | string | 是 | 组件状态（✅/⚠️/❌） |
| interactions | object | 是 | 交互规则 |
| interactions.global_rules | array | 是 | 全局交互规则 |
| responsive | object | 是 | 响应式规格 |
| responsive.breakpoints | array | 是 | 断点定义 |
| assets | array | 是 | 资源清单 |
| open_questions | array | 是 | 待确认项 |

## 决策规则

| 条件 | 决策 |
|------|------|
| 设计令牌缺失 | 使用通用设计令牌，标注"需确认设计令牌" |
| 原型规格缺失 | 页面和组件规格基于IA和PRD推导，标注"缺乏原型验证" |
| 组件库缺失 | 组件清单基于原型推导，标注"建议对齐组件库" |
| 响应式需求未明确 | 默认生成6断点规格，标注"需确认响应式需求" |

## 质量检查

- [ ] 页面清单与路由完整
- [ ] 设计令牌全部有CSS变量映射
- [ ] 每个组件有详细规格（尺寸/颜色/状态）
- [ ] 交互规则覆盖正常+异常状态
- [ ] 响应式断点定义完整
- [ ] 资源清单完整
- [ ] 待确认项已列出

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 原型规格缺失 | 基于IA和PRD推导页面和组件 | 规格可能不够精确 |
| 设计令牌缺失 | 使用通用设计令牌 | 需确认是否符合实际设计 |
| IA缺失 | 页面清单基于PRD推导 | 路由结构可能不完整 |
| 用户流程缺失 | 交互规则基于PRD推导 | 交互规则可能不够细致 |
| 组件库缺失 | 组件清单基于原型推导 | 可能有重复组件未识别 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 原型规格变更（页面增删/交互修改） | 页面清单、组件规格、交互规则 | 标注受影响的页面和组件，建议人类确认是否更新交接文档 |
| 设计令牌变更（颜色/字体/间距调整） | 令牌映射表、组件规格中的令牌依赖 | 标注受影响的令牌和组件，建议人类确认是否更新CSS变量映射 |
| IA结构变更（路由/导航调整） | 页面清单、路由结构、响应式适配 | 标注受影响的路由和页面，建议人类确认是否更新路由映射 |
| 用户流程变更（流程路径修改） | 交互规则、页面级交互 | 标注受影响的交互规则，建议人类确认是否更新交互文档 |
| PRD需求变更（功能增删） | 组件规格、交互规则、待确认项 | 标注受影响的功能点，建议人类确认是否更新交接范围 |

### 下游通知机制

| 交接文档变更类型 | 通知范围 | 通知方式 |
|-----------------|----------|----------|
| 页面/路由变更 | 开发团队、测试团队 | 标记变更影响范围，触发路由和页面结构重新确认 |
| 设计令牌变更 | 前端开发 | 标记令牌变更，触发CSS变量和主题系统更新 |
| 组件规格变更 | 前端开发、测试团队 | 标记组件变更，触发组件实现和测试用例更新 |
| 交互规则变更 | 前端开发、测试团队 | 标记交互变更，触发交互实现和验收标准更新 |
| 响应式断点变更 | 前端开发 | 标记断点变更，触发响应式布局更新 |
