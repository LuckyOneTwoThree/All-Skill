---
name: page-assembly
description: 当需要将组件组装为完整页面时使用。页面自动组装，基于组件库和页面需求，将UI组件组装为完整页面，包含路由配置、状态管理和数据流设计。关键词：页面组装、页面生成、路由配置、状态管理、布局设计、拼页面、搭页面。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "把组件拼成页面"
    - "组装一个完整页面"
    - "搭个新页面"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 5: 页面自动组装

## 核心原则

1. **组件组合而非页面单体**——页面是组件的组装，不写页面级单体代码
2. **数据驱动渲染**——页面结构由数据模型决定，而非硬编码布局
3. **状态最小化**——页面级状态只管理路由和全局上下文，组件状态自治
4. **渐进式加载**——首屏优先加载，非关键内容懒加载

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 页面需求 | string/markdown | 是 | 用户提供 / output/pm-design/design-prd/prd.md | 页面功能描述和布局需求 |
| 组件库 | JSON | 是 | output/ui-design-system/design-system/library.json | 可用组件清单 |
| 已生成组件 | JSON | 是 | output/ui-frontend/ui-component-gen/components.json | 已生成的自定义组件 |
| 设计令牌 | JSON | 是 | output/ui-design-system/design-system/tokens.json | 设计变量 |
| 目标语言 | string | 是 | 上游编排器传递 / 用户提供（默认zh-CN） | 目标界面语言，影响页面文案/排版方向/i18n框架选择 |
| project_dir | string | 是 | output/ui-project-scaffold/scaffold.json | 项目根目录绝对路径，页面代码直接写入此目录 |
| 路由结构 | JSON | ○ | output/pm-design/design-ia/ia_proposals.json | 信息架构定义的路由层级 |
| 原型规格 | JSON | ○ | output/pm-design/design-prototype/prototype_spec.json | 原型定义的页面布局和交互规格 |

## 执行步骤

### Step 1: 页面结构规划与组件映射

将页面需求拆解为布局区块：

| 布局区块 | 典型组件 | 说明 |
|----------|---------|------|
| Header | Navbar/SearchBar/UserMenu | 全局导航，固定顶部 |
| Sidebar | SideNav/FilterPanel | 侧边导航或筛选，可折叠 |
| Main | ContentArea/DataGrid/Form | 主内容区 |
| Footer | Footer/Links | 全局底部 |

布局规则：
- 桌面端：Header+Sidebar(240px)+Main+Footer
- 平板端：Header+可折叠Sidebar+Main+Footer
- 移动端：Header+BottomNav+Main（全屏）

组件映射：
- 遍历页面功能需求，逐项匹配组件库中的组件
- 标注组件间的数据依赖关系
- 定义组件间的交互通信方式（Props回调/Context/事件总线）
- 生成页面组件树（Page→Section→Component）

**外部 Skill 调用**（按执行顺序，同Skill子命令合并为单次调用以节省token）：

Step 1 外部调用：

#### 1a. ext-ui-ux-pro-max --domain landing|dashboard

**触发条件**：页面类型含"落地页/营销页/Landing"→使用landing域；含"仪表盘/数据看板/Dashboard"→使用dashboard域
**反模式**：内部管理页面或普通内容页面 → 跳过

```
Skill: ext-ui-ux-pro-max
输入:
  查询: "{页面类型} {行业} {风格关键词}"
  模式: --domain landing 或 --domain dashboard
  项目名称: {project_name}
输出: 页面结构推荐（布局模式/CTA策略/信息架构/反模式）
验证: 返回了完整的页面结构推荐，包含布局模式和CTA策略
模式: 🤖
```

**Register 感知**：brand→视觉冲击优先；product→转化率/信息密度优先

#### 1b. ext-impeccable layout adapt

**触发条件**：满足任一子命令触发条件即调用该子命令，一次调用传入所有命中的子命令
**反模式**：各子命令独立判断不调用条件

子命令触发条件明细：
- `layout`：页面区块>5个 或 组件树层级>3 或 间距不一致（反模式：简单单区块页面）
- `adapt`：目标平台含"跨平台"或"移动端"（反模式：仅桌面端页面）

```
Skill: ext-impeccable
输入:
  子命令: [layout] [adapt]（仅传入命中条件的子命令）
  目标: 当前页面布局
  上下文: 页面组件树 + 设计令牌 + 目标平台
输出: 布局优化方案（间距节奏/视觉层级/响应式适配）
验证: 布局间距有节奏变化，响应式断点覆盖375px/768px/1024px/1440px
模式: 🤖
```

**Register 感知**：brand/product按子命令分别感知

Step 2 外部调用：

#### 2a. ext-impeccable clarify onboard distill

**触发条件**：满足任一子命令触发条件即调用该子命令，一次调用传入所有命中的子命令
**反模式**：各子命令独立判断不调用条件

子命令触发条件明细：
- `clarify`：页面含表单/空状态/错误状态/确认对话框（反模式：纯数据展示页面无文案）
- `onboard`：页面为首页/注册页/新手引导页（反模式：非首次访问页面）
- `distill`：页面组件数>10个 或 操作按钮>5个 或 信息层级>3层（反模式：页面已足够简洁）

```
Skill: ext-impeccable
输入:
  子命令: [clarify] [onboard] [distill]（仅传入命中条件的子命令）
  目标: 当前页面代码
  上下文: 页面组件树 + 用户流程 + 设计令牌
输出: 优化后的页面代码（UX文案/新手引导/精简结构）
验证: 每个子命令的输出符合其验证标准
模式: 🤖
```

**Register 感知**：brand/product按子命令分别感知

### Step 2: 状态管理与数据流设计

状态管理方案（决策规则化，不再独立步骤）：

| 状态类型 | 管理方式 | 典型场景 |
|----------|---------|---------|
| UI状态 | 组件内部useState | 弹窗开关、Tab切换、表单输入 |
| 页面共享状态 | React Context/Vue Provide | 筛选条件、分页参数 |
| 全局状态 | Zustand/Pinia | 用户信息、权限、主题 |
| 服务端状态 | React Query/SWR | API数据、缓存、乐观更新 |

状态设计规则：
- 状态提升到最小公共父组件
- 避免Props逐层传递超过3层（使用Context）
- 服务端状态与客户端状态分离

数据流设计：
- 数据获取：页面级数据预加载 vs 组件级按需加载
- 加载状态：Skeleton/Spinner/进度条
- 错误处理：Error Boundary+重试机制+降级展示
- 缓存策略：SWR stale-while-revalidate/React Query缓存时间

路由配置（精简为输出字段，不再独立步骤）：
- 路由路径与IA层级对应
- 嵌套路由对应页面区块
- 路由守卫（鉴权/权限/数据预加载）
- 代码分割：每个路由页面独立chunk

**国际化**（内建能力）：
- 多语言场景下引入i18n框架（react-i18next/vue-i18n），文案抽取为语言包
- 输出：`output/ui-frontend/page-assembly/i18n/`

### Step 3: 页面代码生成与校验

生成完整页面代码并校验：
- 组件树层级≤4层
- 100%组件来自组件库或ui-component-gen生成
- 状态管理方案明确
- 路由配置覆盖全部页面
- 加载状态和错误处理100%覆盖

**代码写入规则**：生成的页面文件直接写入 `{project_dir}/src/pages/` 目录，路由配置写入 `{project_dir}/src/router/`，状态管理写入 `{project_dir}/src/stores/`。元数据写入 `output/` 目录供下游Skill消费。

## 输出

**代码文件输出**：`{project_dir}/src/pages/`（页面组件文件、路由配置、状态管理直接写入项目目录）

**元数据输出**：`output/ui-frontend/page-assembly/`

**元数据文件**：pages.json

**输出校验规则**：

| 字段路径 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| page_name | string | 是 | 页面名称 |
| route | string | 是 | 页面路由路径 |
| layout | enum(header-sidebar-main, header-main, header-main-footer) | 是 | 页面布局类型 |
| component_tree | object | 是 | 页面组件树 |
| state_management | object | 是 | 状态管理方案 |
| data_flow | object | 是 | 数据流设计 |
| files | array | 是 | 生成的页面文件列表 |

**输出Schema**：

```json
{
  "type": "object",
  "required": ["page_name", "route", "layout", "component_tree", "state_management", "data_flow", "files"],
  "properties": {
    "page_name": {"type": "string", "description": "页面名称"},
    "route": {"type": "string", "description": "页面路由路径"},
    "layout": {"type": "string", "enum": ["header-sidebar-main", "header-main", "header-main-footer"], "description": "页面布局类型"},
    "component_tree": {"type": "object", "description": "页面组件树，按布局区块组织组件列表"},
    "state_management": {"type": "object", "description": "状态管理方案，按UI状态/共享状态/服务端状态分类"},
    "data_flow": {"type": "object", "description": "数据流设计，定义各触发时机下的数据获取操作"},
    "files": {"type": "array", "description": "生成的页面文件列表，包含路径和类型"},
    "project_dir": {"type": "string", "description": "项目根目录路径，页面代码已写入此目录下的src/pages/"}
  }
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
| 目标语言=ar-SA | 排版方向设为RTL，布局组件添加dir="rtl" |
| 目标语言含多种 | 引入i18n框架（react-i18next/vue-i18n），文案抽取为语言包，内建i18n配置 |
| 目标语言=zh-CN | 页面文案使用中文，空状态文案"暂无数据"/"加载失败" |
| 目标语言=en-US | 页面文案使用英文，空状态文案"No data"/"Failed to load" |

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 组件库变更 | 页面组件映射 | 标注受影响的页面，建议重新映射组件 |
| 设计令牌变更 | 页面布局参数 | 标注受影响的布局，触发布局重排 |
| PRD功能变更 | 页面需求 | 标注受影响的页面，建议重新组装 |
| 路由结构变更 | 路由配置 | 标注受影响的路由，建议重新配置 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 页面组件树变更 | ui-review、frontend-test | 受影响的审查和测试 | 组件树结构变更 |
| 路由配置变更 | frontend-build-deploy | 路由变更 | 路由路径变更 |
| 数据流变更 | api-contract-consume | API需求变更 | 数据获取方式变更 |

## 质量检查

- [ ] 组件树层级≤4层
- [ ] 100%组件来自组件库或ui-component-gen生成
- [ ] 状态管理方案明确（UI状态/共享状态/服务端状态分离）
- [ ] 路由配置覆盖全部页面
- [ ] 加载状态和错误处理100%覆盖
- [ ] 数据流设计覆盖所有触发时机（on_mount/on_filter_change/on_page_change等）

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 路由结构缺失 | 基于页面需求推导路由 | 路由层级可能与IA不完全一致 |
| 原型规格缺失 | 基于页面需求推导页面布局 | 页面布局可能不够精准 |
| 组件库缺失 | 使用通用HTML组件占位 | 页面可运行但视觉不统一 |
| 设计令牌缺失 | 使用默认布局参数 | 间距/字号可能不符合设计规范 |
| 页面需求缺失 | 若用户未提供页面需求，提示用户提供或跳过该输入相关步骤 | 无法组装页面 |
| project_dir 缺失 | 仅输出到 output/ 目录的 pages.json 中，不写入项目目录 | 页面代码需手动复制到项目 |

## 数据获取说明
- 本Skill需要组件库和页面需求，请通过以下方式之一提供：
  1. 上传library.json和页面需求描述
  2. 描述页面功能和布局需求
  3. 提供PRD中相关页面章节

## 变更记录

- v2.1: 新增目标语言参数；外部Skill调用点重构为表格格式；新增clarify/onboard/distill子命令；i18n改为内建能力；降级策略和数据获取说明标题规范化
- v2.0: 初始版本
