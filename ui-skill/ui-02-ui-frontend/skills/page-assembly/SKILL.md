---
name: page-assembly
description: 当需要将组件组装为完整页面时使用。页面自动组装，基于组件库和页面需求，将UI组件组装为完整页面，包含路由配置、状态管理、数据流设计和布局实现。关键词：页面组装、页面生成、路由配置、状态管理、布局设计。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 5: 页面自动组装

## 核心原则

1. **组件组合而非页面单体**：页面是组件的组装，不写页面级单体代码
2. **数据驱动渲染**：页面结构由数据模型决定，而非硬编码布局
3. **状态最小化**：页面级状态只管理路由和全局上下文，组件状态自治
4. **渐进式加载**：首屏优先加载，非关键内容懒加载

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 页面需求 | string/markdown | 是 | 用户提供 / output/pm-design/design-prd/prd.md | 页面功能描述和布局需求 |
| 组件库 | JSON | 是 | output/ui-design-system/component-library/library.json | 可用组件清单 |
| 已生成组件 | JSON | 是 | output/ui-frontend/ui-component-gen/components.json | 已生成的自定义组件 |
| 设计令牌 | JSON | 是 | output/ui-design-system/design-token/tokens.json | 设计变量 |
| 路由结构 | JSON | ○ | output/pm-design/design-ia/ia_proposals.json | 信息架构定义的路由层级 |
| 原型规格 | JSON | ○ | output/pm-design/design-prototype/prototype_spec.json | 原型定义的页面布局和交互规格 |

## 执行步骤

### Step 1: 页面结构规划

将页面需求拆解为布局区块：

| 布局区块 | 典型组件 | 说明 |
|----------|---------|------|
| Header | Navbar / SearchBar / UserMenu | 全局导航，固定顶部 |
| Sidebar | SideNav / FilterPanel | 侧边导航或筛选，可折叠 |
| Main | ContentArea / DataGrid / Form | 主内容区，占据最大空间 |
| Footer | Footer / Links | 全局底部，固定底部或跟随内容 |

**布局规则**：
- 桌面端：Header + Sidebar(240px) + Main + Footer
- 平板端：Header + 可折叠Sidebar + Main + Footer
- 移动端：Header + BottomNav + Main（全屏）

### Step 2: 组件映射与组装

将页面功能映射到具体组件：

- 遍历页面功能需求，逐项匹配组件库中的组件
- 标注组件间的数据依赖关系
- 定义组件间的交互通信方式（Props回调 / Context / 事件总线）
- 生成页面组件树（Page → Section → Component）

### Step 3: 状态管理设计

设计页面级状态管理方案：

| 状态类型 | 管理方式 | 典型场景 |
|----------|---------|---------|
| UI状态 | 组件内部useState | 弹窗开关、Tab切换、表单输入 |
| 页面共享状态 | React Context / Vue Provide | 筛选条件、分页参数 |
| 全局状态 | Zustand / Pinia | 用户信息、权限、主题 |
| 服务端状态 | React Query / SWR | API数据、缓存、乐观更新 |

**状态设计规则**：
- 状态提升到最小公共父组件
- 避免Props逐层传递超过3层（使用Context）
- 服务端状态与客户端状态分离

### Step 4: 路由配置

基于信息架构生成路由配置：

- 路由路径与IA层级对应
- 嵌套路由对应页面区块
- 路由守卫（鉴权/权限/数据预加载）
- 404/重定向/面包屑映射
- 代码分割：每个路由页面独立chunk

### Step 5: 数据流设计

设计页面数据获取和流转方案：

- **数据获取**：页面级数据预加载 vs 组件级按需加载
- **加载状态**：Skeleton / Spinner / 进度条
- **错误处理**：Error Boundary + 重试机制 + 降级展示
- **缓存策略**：SWR stale-while-revalidate / React Query缓存时间

## 输出

**存储路径**：`output/ui-frontend/page-assembly/`

**输出文件**：pages.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["page_name", "route", "layout", "component_tree", "state_management", "data_flow", "files"],
  "properties": {
    "page_name": {"type": "string", "description": "页面名称"},
    "route": {"type": "string", "description": "页面路由路径"},
    "layout": {"type": "string", "description": "页面布局类型"},
    "component_tree": {"type": "object", "description": "页面组件树，按布局区块组织组件列表"},
    "state_management": {"type": "object", "description": "状态管理方案，按UI状态/共享状态/服务端状态分类"},
    "data_flow": {"type": "object", "description": "数据流设计，定义各触发时机下的数据获取操作"},
    "files": {"type": "array", "description": "生成的页面文件列表，包含路径和类型"}
  }
}
```

```json
{
  "page_name": "CourseListPage",
  "route": "/courses",
  "layout": "header-sidebar-main",
  "component_tree": {
    "Page": {
      "Header": ["Navbar", "SearchBar", "UserMenu"],
      "Sidebar": ["SideNav", "FilterPanel"],
      "Main": ["CourseGrid", "Pagination"],
      "Footer": ["Footer"]
    }
  },
  "state_management": {
    "ui_state": { "filterOpen": "useState", "activeTab": "useState" },
    "shared_state": { "filters": "Context", "pagination": "Context" },
    "server_state": { "courses": "React Query", "categories": "React Query" }
  },
  "data_flow": {
    "on_mount": ["fetchCategories()", "fetchCourses(filters)"],
    "on_filter_change": ["fetchCourses(updatedFilters)"],
    "on_page_change": ["fetchCourses(filters, newPage)"]
  },
  "files": [
    { "path": "pages/CourseListPage/index.tsx", "type": "page" },
    { "path": "pages/CourseListPage/CourseListPage.types.ts", "type": "types" },
    { "path": "pages/CourseListPage/CourseListPage.module.css", "type": "style" },
    { "path": "pages/CourseListPage/hooks/useCourses.ts", "type": "hook" },
    { "path": "pages/CourseListPage/context/FilterContext.tsx", "type": "context" }
  ]
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 页面组件数>10个 | 拆分为子路由或Tab分页 |
| 共享状态被≥3个组件消费 | 使用Context，不逐层Props传递 |
| 服务端数据需要跨页面共享 | 使用全局缓存（React Query/Pinia） |
| 页面首屏数据量>100KB | 实现分页或虚拟滚动 |
| 路由层级>3层 | 实现面包屑导航 |
| 页面有鉴权需求 | 添加路由守卫，未登录重定向 |

## 质量检查

- [ ] 页面组件树层级≤4层
- [ ] 100%的组件来自组件库或ui-component-gen生成
- [ ] 状态管理方案明确（UI/共享/全局/服务端4类分离）
- [ ] 路由配置覆盖全部页面，含404和重定向
- [ ] 加载状态和错误处理100%覆盖
- [ ] 首屏渲染不依赖非关键数据（懒加载）

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 路由结构缺失 | 基于页面需求推导路由 | 路由层级可能与IA不完全一致 |
| 原型规格缺失 | 基于页面需求推导页面布局 | 页面布局可能不够精准 |
| 组件库缺失 | 使用通用HTML组件占位 | 页面可运行但视觉不统一 |
| 设计令牌缺失 | 使用默认布局参数 | 间距/字号可能不符合设计规范 |
| 页面需求缺失 | 若用户未提供页面需求，提示用户提供或跳过该输入相关步骤 | 无法组装页面 |

数据获取说明：
- 本Skill需要组件库和页面需求，请通过以下方式之一提供：
  1. 上传library.json和页面需求描述
  2. 描述页面功能和布局需求
  3. 提供PRD中相关页面章节
