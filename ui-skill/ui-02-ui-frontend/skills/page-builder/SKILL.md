---
name: page-builder
description: 当需要生成前端页面和组件时使用。页面与组件一体化构建，基于视觉方向和设计令牌，在页面上下文中生成组件并组装为完整页面，内建质量门禁确保产出质量。关键词：页面生成、组件生成、页面组装、UI构建、写页面、出组件、搭页面。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "1.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "帮我写个页面"
    - "生成前端组件"
    - "搭个新页面"
    - "出一段组件代码"
  interaction_mode: "ai_suggest_human_approve"
---

# 页面与组件一体化构建

## 核心原则

1. **视觉方向驱动**——所有组件和页面决策从visual-direction推导，不凭空设计
2. **页面上下文生成**——组件在页面场景中生成，确保视觉一致性和交互连贯性
3. **令牌约束**——100%引用Design Token，不硬编码样式值
4. **质量内建**——生成即校验，不依赖独立审查步骤
5. **可访问性默认**——每个组件默认包含ARIA属性、键盘导航、焦点管理

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 页面需求 | string/markdown | 是 | 用户提供 / output/pm-design/design-prd/prd.md | 页面功能描述和布局需求 |
| 视觉方向 | JSON | 是 | output/ui-project-init/project-init.json → visual_direction | 美学方向/色彩策略/视觉禁忌等 |
| 设计令牌 | JSON | 是 | output/ui-project-init/project-init.json → tokens | 设计变量定义 |
| 组件库 | JSON | 是 | output/ui-project-init/project-init.json → component_library | 可用组件清单和主题定制 |
| 目标框架 | string | 是 | 用户提供 | React/Vue/Svelte |
| 目标语言 | string | 是 | 上游编排器传递 / 用户提供（默认zh-CN） | 目标界面语言 |
| project_dir | string | 是 | output/ui-project-init/project-init.json → project_dir | 项目根目录绝对路径 |
| PRD | markdown | ○ | output/pm-design/design-prd/prd.md | 产品需求上下文 |
| 路由结构 | JSON | ○ | output/pm-design/design-ia/ia_proposals.json | 信息架构定义的路由层级 |
| 原型规格 | JSON | ○ | output/pm-design/design-prototype/prototype_spec.json | 原型定义的页面布局和交互规格 |

## 执行步骤

### Step 1: 页面结构规划与视觉节奏设计

将页面需求拆解为布局区块，同时设计视觉节奏（而非只做功能布局）：

**功能布局**：

| 布局区块 | 典型组件 | 说明 |
|----------|---------|------|
| Header | Navbar/SearchBar/UserMenu | 全局导航，固定顶部 |
| Sidebar | SideNav/FilterPanel | 侧边导航或筛选，可折叠 |
| Main | ContentArea/DataGrid/Form | 主内容区 |
| Footer | Footer/Links | 全局底部 |

**视觉节奏设计**（消费visual-direction）：

| 维度 | 设计内容 | 依据 |
|------|---------|------|
| 视觉重心 | 页面焦点区域（用户第一眼看到什么） | aesthetic_direction + mood_keywords |
| 密度分布 | 哪里密、哪里空 | spatial_strategy |
| 色彩节奏 | 哪里亮、哪里暗，品牌色在哪点缀 | color_strategy |
| 层次感 | 前景/中景/背景的区分方式 | theme_decision |

布局规则：
- 桌面端：Header+Sidebar(240px)+Main+Footer
- 平板端：Header+可折叠Sidebar+Main+Footer
- 移动端：Header+BottomNav+Main（全屏）

组件映射：遍历页面功能需求，逐项匹配组件库中的组件，标注组件间数据依赖和交互通信方式。

**外部 Skill 调用**：

#### 1a. ext-ui-ux-pro-max --domain landing|dashboard

**触发条件**：页面类型含"落地页/营销页/Landing"→landing域；含"仪表盘/数据看板/Dashboard"→dashboard域
**反模式**：内部管理页面或普通内容页面 → 跳过

```
Skill: ext-ui-ux-pro-max
输入:
  查询: "{页面类型} {行业} {风格关键词}"
  模式: --domain landing 或 --domain dashboard
  项目名称: {project_name}
输出: 页面结构推荐（布局模式/CTA策略/信息架构/反模式）
验证: 返回了完整的页面结构推荐
模式: 🤖
```

#### 1b. ext-impeccable layout adapt

**触发条件**：满足任一子命令触发条件即调用
**反模式**：简单单区块页面且仅桌面端 → 跳过

子命令触发条件：
- layout：页面区块>5个 或 组件树层级>3
- adapt：目标平台含"跨平台"或"移动端"

```
Skill: ext-impeccable
输入:
  子命令: [layout] [adapt]
  目标: 当前页面布局
  上下文: 页面组件树 + 设计令牌 + 目标平台 + visual_direction
输出: 布局优化方案（间距节奏/视觉层级/响应式适配）
验证: 布局间距有节奏变化，响应式断点覆盖375px/768px/1024px/1440px
模式: 🤖
```

### Step 2: 组件生成（在页面上下文中）

基于页面结构和视觉方向，在页面场景中生成组件：

**组件生成顺序**：先页面骨架 → 再核心交互组件 → 最后装饰组件

**样式方案**：

| 项目技术栈 | 推荐方案 |
|-----------|---------|
| Tailwind已配置 | Tailwind类名 |
| CSS Modules已配置 | CSS Modules |
| Styled Components已配置 | Styled Components |
| 无明确方案 | CSS Modules |

**组件规格**：
- Props接口（TypeScript类型定义，必填Props最小化）
- 视觉变体（Variant）列表
- 状态列表及各状态视觉表现
- ARIA属性和键盘交互
- Design Token引用清单

**交互逻辑与状态机**：

每个有复杂交互的组件设计状态机：
- 每个状态有明确的进入/退出条件
- 不允许死锁状态
- 每个状态转换有视觉反馈
- 异步操作必须有loading状态

动画规范（引用设计令牌中的动画令牌）：

| 场景 | 时长令牌 | 缓动令牌 |
|------|---------|---------|
| 按钮hover | duration-instant | easing-default |
| 弹窗展开 | duration-fast | easing-decelerate |
| 页面切换 | duration-normal | easing-default |

**外部 Skill 调用**：

#### 2a. ext-impeccable shape

**触发条件**：组件意图描述含"复杂" 或 状态数>5 或 涉及多步骤流程
**反模式**：简单展示组件（Badge/Divider/Spacer） → 跳过

```
Skill: ext-impeccable
输入:
  子命令: shape
  目标: 组件UX/UI规划
  上下文: 组件意图 + 状态列表 + 用户流程 + visual_direction
输出: 组件UX规划（状态机/交互流程/视觉方向）
验证: 规划包含完整状态转换图和视觉方向建议
模式: 🤖
```

#### 2b. ext-interaction-design

**触发条件**：组件有拖拽/手势/页面转换/复杂状态转换
**反模式**：纯展示组件无交互 → 跳过

```
Skill: ext-interaction-design
输入:
  交互需求: 组件交互模式
  上下文: 组件状态机 + 设计令牌
输出: 交互设计方案（动画时序/缓动函数/微交互模式/可访问性适配）
验证: 方案包含完整的时序参数和prefers-reduced-motion适配
模式: 🤖
```

#### 2c. ext-impeccable animate bolder|quieter delight

**触发条件**：满足任一子命令触发条件即调用该子命令

子命令触发条件：
- animate：组件状态转换>3个 或 有异步操作（反模式：数据密集型仪表盘或医疗/金融场景）
- bolder：品牌色占比<15% 或 组件视觉描述含"安全/标准/普通"（反模式：已调用ext-frontend-design且方向足够大胆）
- quieter：品牌色占比>40% 或 医疗/金融/法律场景（反模式：组件视觉已偏保守）
- delight：组件为核心用户流程节点（反模式：辅助功能组件）

bolder vs quieter 互斥规则：品牌色占比<25%→bolder，>40%→quieter，25%-40%→不调用。

```
Skill: ext-impeccable
输入:
  子命令: [animate] [bolder|quieter] [delight]
  目标: 当前组件代码
  上下文: 组件状态机 + 设计令牌 + 品牌色占比 + visual_direction
输出: 增强后的组件代码
验证: 每个子命令的输出符合其验证标准
模式: 🤖
```

### Step 3: 页面组装与状态管理

将组件组装为完整页面：

**状态管理方案**：

| 状态类型 | 管理方式 | 典型场景 |
|----------|---------|---------|
| UI状态 | 组件内部useState | 弹窗开关、Tab切换 |
| 页面共享状态 | React Context/Vue Provide | 筛选条件、分页参数 |
| 全局状态 | Zustand/Pinia | 用户信息、权限、主题 |
| 服务端状态 | React Query/SWR | API数据、缓存 |

路由配置：路由路径与IA层级对应，嵌套路由对应页面区块，代码分割每个路由独立chunk。

国际化（内建能力）：多语言场景下引入i18n框架，文案抽取为语言包。

**外部 Skill 调用**：

#### 3a. ext-impeccable clarify onboard distill

**触发条件**：满足任一子命令触发条件即调用

子命令触发条件：
- clarify：页面含表单/空状态/错误状态/确认对话框
- onboard：页面为首页/注册页/新手引导页
- distill：页面组件数>10个 或 操作按钮>5个

```
Skill: ext-impeccable
输入:
  子命令: [clarify] [onboard] [distill]
  目标: 当前页面代码
  上下文: 页面组件树 + 用户流程 + 设计令牌 + visual_direction
输出: 优化后的页面代码
验证: 每个子命令的输出符合其验证标准
模式: 🤖
```

### Step 4: 内建质量门禁

生成代码后立即执行质量检查（不依赖独立审查步骤）：

**设计规范检查**：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 色值引用 | 100%使用Token变量 | P0 |
| 字号引用 | 100%使用Token变量 | P0 |
| 间距引用 | 100%使用Token变量 | P1 |
| 色彩对比度 | 正文≥4.5:1，大文本≥3:1 | P0 |
| 视觉禁忌 | 不包含visual_direction.visual_bans中的模式 | P0 |

**无障碍检查**：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 图片替代文本 | 所有img有alt属性 | P0 |
| 表单标签 | 所有表单控件有关联label | P0 |
| 键盘可操作 | 所有交互可通过键盘完成 | P0 |
| ARIA属性 | 交互组件有正确的role和aria-* | P0 |

**交互完整性检查**：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 状态覆盖 | default/hover/focus/active/disabled | P0 |
| 加载状态 | 异步操作有loading指示 | P0 |
| 空状态 | 数据为空时有空状态展示 | P1 |
| 错误状态 | 请求失败有错误提示和重试 | P1 |

**响应式检查**：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 移动端 | 375px宽度下内容不溢出 | P0 |
| 平板端 | 768px宽度下布局合理 | P1 |
| 桌面端 | 1024px+宽度下布局合理 | P1 |

**页面级检查**：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 组件树层级 | ≤4层 | P1 |
| 组件来源 | 100%来自组件库或本次生成 | P0 |
| 路由覆盖 | 全部页面有路由 | P1 |

**问题处理规则**：P0问题必须修复后才能输出，P1问题标注"待修复"。

**可选增强**（条件触发 ext-impeccable audit critique）：

**触发条件**：P0问题>0 或 人类要求设计品味审查
**反模式**：所有内建检查通过且人类未要求 → 跳过

```
Skill: ext-impeccable
输入:
  子命令: audit [critique]
  目标: 组件代码 + 页面代码
  上下文: 设计令牌 + 品牌规范 + visual_direction
输出: 审查报告（a11y/性能/响应式/设计品味评分）
验证: audit覆盖WCAG AA + 响应式375px/1440px
模式: 🤖
```

### Step 5: 代码输出与最终打磨

**代码写入规则**：
- 组件文件 → {project_dir}/src/components/{ComponentName}/
- 页面文件 → {project_dir}/src/pages/
- 路由配置 → {project_dir}/src/router/
- 状态管理 → {project_dir}/src/stores/

**ext-impeccable harden polish**（最终打磨）：

**触发条件**：满足任一子命令触发条件即调用

子命令触发条件：
- harden：组件有表单输入/异步操作/国际化需求
- polish：所有Step 2-3外部调用完成后（polish始终是最后一步）

```
Skill: ext-impeccable
输入:
  子命令: [harden] [polish]
  目标: 当前组件+页面代码
  上下文: 质量检查结果 + 设计令牌 + visual_direction
输出: 生产级代码（错误处理/国际化/边缘情况/最终打磨）
验证: 代码通过所有质量门禁
模式: 🤖
```

## 输出

**代码文件输出**：{project_dir}/src/（组件、页面、路由、状态管理直接写入项目目录）

**元数据输出**：output/ui-frontend/page-builder/

**输出文件**：pages.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["pages", "components", "quality_report", "project_dir"],
  "properties": {
    "pages": {
      "type": "array",
      "description": "页面列表，每项含name/route/layout/component_tree/state_management/data_flow"
    },
    "components": {
      "type": "array",
      "description": "组件列表，每项含name/framework/files/props/token_coverage/accessibility/interaction"
    },
    "quality_report": {
      "type": "object",
      "description": "内建质量门禁报告，含pass_rate/p0_issues/p1_issues"
    },
    "project_dir": {"type": "string", "description": "项目根目录路径"}
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 组件库匹配度≥80% | 复用已有组件，扩展Props |
| 组件库匹配度50%-80% | 复用+组合，补充差异 |
| 组件库匹配度<50% | 新建组件 |
| 数据量≥100条 | 强制使用虚拟滚动 |
| 弹窗/对话框组件 | 强制实现焦点陷阱+ESC关闭 |
| 单组件代码>200行 | 拆分为1个父组件+N个子组件 |
| 目标语言=zh-CN | 占位文案"请输入"/"加载中"/"提交" |
| 目标语言=en-US | 占位文案"Enter..."/"Loading..."/"Submit" |
| 目标语言=ar-SA | 排版方向RTL，添加dir="rtl" |
| 页面组件数>10个 | 拆分为子路由或Tab分页 |
| P0问题>0 | 必须修复后才能输出 |
| P0问题=0 且 P1问题≤3 | 可输出，标注已知问题 |

## 质量检查

- [ ] visual_direction 的视觉禁忌100%未被违反
- [ ] Design Token引用率100%，无硬编码样式值
- [ ] TypeScript类型定义完整，无any类型
- [ ] 交互组件100%包含ARIA属性和键盘导航
- [ ] 状态机无死锁状态
- [ ] WCAG AA对比度100%达标
- [ ] 响应式覆盖375px/768px/1024px
- [ ] 组件树层级≤4层
- [ ] 100%组件来自组件库或本次生成
- [ ] 异步操作>300ms有进度指示
- [ ] 支持prefers-reduced-motion

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 视觉方向缺失 | 基于设计令牌推断视觉方向 | 美学方向可能不够精准 |
| 设计令牌缺失 | 使用内联样式+TODO注释 | 样式值硬编码，需后续替换 |
| 组件库缺失 | 全部新建组件 | 可能存在重复组件 |
| 原型规格缺失 | 基于页面需求推导布局 | 布局可能不够精准 |
| project_dir 缺失 | 仅输出到 output/ 目录 | 代码需手动复制 |

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 视觉方向变更 | 所有组件和页面的视觉决策 | 标注受影响的组件和页面，建议重新生成 |
| 设计令牌变更 | 组件样式引用 | 标注受影响的组件，建议更新Token引用 |
| 组件库变更 | 组件复用关系 | 标注受影响的复用组件，建议重新匹配 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 页面组件树变更 | production-ready | 受影响的测试和构建 | 组件树结构变更 |
| 路由配置变更 | production-ready | 路由变更 | 路由路径变更 |
| 数据流变更 | api-integration | API需求变更 | 数据获取方式变更 |

## 变更记录

- v1.0: 合并 ui-component-gen + page-assembly + ui-review；新增视觉方向消费；新增视觉节奏设计；审查改为内建质量门禁；组件改为页面上下文生成
