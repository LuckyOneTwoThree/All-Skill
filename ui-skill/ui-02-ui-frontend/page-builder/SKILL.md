---
name: page-builder
description: 当需要生成前端页面和组件时使用。页面与组件一体化构建，基于视觉方向和设计令牌，在页面上下文中生成组件并组装为完整页面，内建质量门禁确保产出质量。关键词：页面生成、组件生成、页面组装、UI构建、写页面、出组件、搭页面。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "1.4"
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
6. **上下文预算**——主动管理上下文窗口，确保关键信息不丢失

## 上下文预算管理

page-builder 单次执行可能生成大量组件代码，必须主动管理上下文窗口防止信息丢失。

### 步骤检查点

每个 Step 完成后，将当前进度写入内部检查点文件，支持编排器恢复时跳过已完成的步骤：

**检查点文件**：`output/checkpoints/page-builder.json`

```json
{
  "type": "object",
  "required": ["completed_steps", "pending_steps", "step_outputs", "last_updated"],
  "properties": {
    "completed_steps": {"type": "array", "items": {"type": "string"}, "description": "已完成的步骤ID列表（如 ['step1', 'step2']）"},
    "pending_steps": {"type": "array", "items": {"type": "string"}, "description": "待执行的步骤ID列表（如 ['step3', 'step4', 'step5']）"},
    "step_outputs": {"type": "object", "description": "每个已完成步骤的输出文件路径或关键结论摘要"},
    "last_updated": {"type": "string", "description": "最后更新时间（ISO 8601）"}
  }
}
```

**续执行规则**：
1. page-builder 启动时检查 `output/checkpoints/page-builder.json`
2. 若存在且有 `pending_steps`，从第一个 pending 步骤继续，跳过已完成步骤
3. 每个步骤完成后立即更新检查点（先写文件再推进）
4. 全部步骤完成后，检查点文件保留作为执行记录

### 保留优先级（上下文接近上限时）

| 优先级 | 保留内容 | 原因 |
|--------|---------|------|
| P0（必须保留） | 当前步骤的输入/输出、visual_direction、设计令牌、组件库 | 当前步骤执行必需 |
| P0（必须保留） | 待执行步骤的名称和关键输入来源 | 知道下一步做什么 |
| P1（尽量保留） | 已完成步骤的输出文件路径和关键结论摘要 | 供后续步骤引用 |
| P2（可丢弃） | 已完成步骤的详细代码和中间产物 | 可从 output/ 目录重新读取 |

### 多页面项目策略

页面数>3时，采用分页处理：
1. 每个页面独立执行 Step 2-4，完成后代码写入文件、上下文只保留摘要
2. 所有页面完成后统一执行 Step 5（代码输出与最终打磨）
3. 分页间共享 visual_direction 和设计令牌（始终保留在上下文中）

## 交互模式

🤖→👤 AI建议人类审批

## 输入

**PM 输入自由度原则**：PM 层输出（PRD、IA、Interaction-Spec）定义"需要什么"（意图），本 Skill 决定"怎么做"（实现）。PM 输入仅作为意图参考，不限制设计决策。具体而言：
- PRD 的 functional_areas 定义必须覆盖的功能清单，但区域布局方式、视觉层次、组件选型由本 Skill 决定
- IA 的路由结构定义页面间导航关系，但页面内部布局和导航模式由本 Skill 决定
- Interaction-Spec 的状态机和动画意图定义必须覆盖的交互完整性，但视觉表现、过渡效果、反馈组件由本 Skill + ext-interaction-design 决定
- 当 PM 输入与本 Skill 的设计判断冲突时，以设计判断为准，但需在输出中标注偏离原因

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 页面需求 | string/markdown | 是 | 用户提供 / output/pm-design/design-prd/prd.md | 页面功能描述和布局需求 |
| 视觉方向 | JSON | 是 | output/ui-project-init/project-init.json → visual_direction | 美学方向/色彩策略/视觉禁忌等 |
| 设计令牌 | JSON | 是 | output/ui-project-init/project-init.json → tokens | 设计变量定义 |
| 组件库 | JSON | 是 | output/ui-project-init/project-init.json → component_library | 可用组件清单和主题定制 |
| 目标框架 | string | 是 | 用户提供 | React/Vue/Svelte |
| 目标语言 | string | 是 | 上游编排器传递 / 用户提供（默认zh-CN） | 目标界面语言 |
| project_dir | string | 是 | output/ui-project-init/project-init.json → project_dir | 项目根目录绝对路径 |
| PRD | markdown | ○ | output/pm-design/design-prd/prd.md | 产品需求上下文（含功能区域和组件需求） |
| 路由结构 | JSON | ○ | output/pm-design/design-ia/ia_proposals.json | 信息架构定义的路由层级 |
| 交互规范 | markdown | ○ | output/pm-design/interaction-spec/interaction-spec.md | 交互状态机/交互意图/异常路径/无障碍交互 |

## 执行步骤

### Step 1: 页面结构规划与视觉节奏设计

将页面需求拆解为布局区块，同时设计视觉节奏（而非只做功能布局）：

**PRD 消费规则**（意图约束）：
- 若有 PRD 输入：其定义的功能区域和内容需求作为**必须覆盖的功能清单**（页面必须包含 PRD 中定义的所有功能区域），但区域布局方式、视觉层次、间距节奏由 page-builder 结合 visual_direction 决定
- PRD 定义"页面需要什么功能区域"，page-builder 决定"这些区域如何视觉呈现"

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
| 设计张力 | 视觉大胆程度：conservative→安全克制，balanced→平衡，bold→有冲击力，extreme→极致实验 | tension_level |
| 视觉叙事 | 页面视线流动路径（如"Z型阅读→聚焦CTA→渐进展示细节"） | visual_narrative |

布局规则：
- 桌面端：Header+Sidebar(240px)+Main+Footer
- 平板端：Header+可折叠Sidebar+Main+Footer
- 移动端：Header+BottomNav+Main（全屏）

组件映射：遍历页面功能需求，逐项匹配组件库中的组件，标注组件间数据依赖和交互通信方式。

> ext skill 增强由编排器在后续阶段统一调用，本步骤专注核心逻辑

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

**交互逻辑与状态机**（消费 interaction-spec）：

每个有复杂交互的组件设计状态机：
- 每个状态有明确的进入/退出条件
- 不允许死锁状态
- 每个状态转换有视觉反馈
- 异步操作必须有loading状态
- 若有 interaction-spec 输入：状态机必须**覆盖**交互规范中定义的所有状态和转换（完整性约束），但状态机的视觉表现、转换动画、交互细节由 page-builder 决定（实现自由度）
- 若有 interaction-spec 输入：交互规范中的异常路径（网络错误/权限不足/数据为空等）必须映射为组件状态，不可遗漏
- 若有 interaction-spec 输入：交互规范中的无障碍交互要求（焦点管理/ARIA标注/键盘操作）必须实现

动画意图消费（interaction-spec 定义意图，page-builder + ext-interaction-design 决定实现）：

| 场景 | interaction-spec 意图示例 | page-builder 实现决策 |
|------|-------------------------|---------------------|
| 弹窗展开 | "弹窗展开需有弹性感" | 具体缓动函数和时长由 ext-interaction-design 结合 visual_direction 决定 |
| 列表加载 | "加载过程需有进度指示" | 骨架屏/Spinner/进度条由 page-builder 结合 visual_direction 决定 |
| 操作反馈 | "操作成功需有反馈" | Toast/Inline Message/动画由 page-builder 结合 visual_direction 决定 |

若 interaction-spec 未定义动画意图，使用 page-builder 内建默认动画规范表。interaction-spec 中的具体动画数值（缓动函数/时长/阈值）仅供参考，page-builder 有权基于 visual_direction 调整。

> ext skill 增强由编排器在后续阶段统一调用，本步骤专注核心逻辑

### Step 3: 页面组装与状态管理

将组件组装为完整页面：

**状态管理方案**：

| 状态类型 | 管理方式 | 典型场景 |
|----------|---------|---------|
| UI状态 | 组件内部useState / Svelte writable | 弹窗开关、Tab切换 |
| 页面共享状态 | React Context / Vue Provide / Svelte stores | 筛选条件、分页参数 |
| 全局状态 | Zustand / Pinia / Svelte stores | 用户信息、权限、主题 |
| 服务端状态 | React Query/SWR / Vue Query / svelte-query | API数据、缓存 |

路由配置：路由路径与IA层级对应，嵌套路由对应页面区块，代码分割每个路由独立chunk。

国际化（内建能力）：多语言场景下引入i18n框架，文案抽取为语言包。

**数据层 fallback**（api-integration 被跳过时）：

当编排器决定跳过 api-integration（无后端API或使用静态数据）时，page-builder 必须自行生成数据层，确保页面可运行：

| 数据层组件 | 生成规则 | 写入路径 |
|-----------|---------|---------|
| 静态 Mock 数据 | 基于页面数据流需求生成符合类型的 Mock 数据，内容与目标语言一致 | {project_dir}/src/api/mock/ |
| 数据获取函数 | 为每个数据需求生成简单的异步函数（返回 Promise，模拟网络延迟 200-500ms） | {project_dir}/src/api/fetch.ts |
| 数据 Hook | 使用 React Query/SWR 包装数据获取函数，包含 loading/error 状态 | {project_dir}/src/api/hooks/ |
| 类型定义 | 数据接口的 TypeScript 类型定义 | {project_dir}/src/api/types.ts |

生成规则：
- Mock 数据必须覆盖页面数据流中定义的所有数据需求
- 数据获取函数签名与 api-integration 生成的签名一致（便于后续替换）
- 在 pages.json 中标注 `api_integration_skipped: true`，供 production-ready 参考
- 代码中标注 `// @api-integration: 待 api-integration 替换` 注释，便于后续定位和替换

**与 api-integration 的衔接**：若后续 api-integration 执行，其生成的代码将覆盖 fallback 文件（api-integration 负责清理 fallback 标记并替换为真实 API 调用）。api-integration 应保留 fallback 中的类型定义（`types.ts`），仅替换数据获取函数和 Mock 数据。

> ext skill 增强由编排器在后续阶段统一调用，本步骤专注核心逻辑

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

**美学验证检查**：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 视觉节奏遵循 | 页面实现与Step 1视觉节奏设计一致（视觉重心/密度分布/色彩节奏/层次感/设计张力/视觉叙事6维度均已体现） | P0 |
| 品牌色占比 | 品牌色占比在visual_direction.color_strategy对应区间（Restrained:5-15%/Committed:30-60%/Full palette:15-40%/Drenched:>60%） | P1 |
| 排版层级跳跃 | h1/h2/h3/h4/body之间字号比≥1.25，字重差≥100 | P1 |
| visual_direction一致性 | 组件视觉风格与aesthetic_direction描述一致，不出现aesthetic_direction中未提及的风格特征 | P0 |
| 留白节奏 | 页面间距非均匀分布，至少3种不同间距值形成节奏感 | P1 |

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

> ext skill 增强由编排器在后续阶段统一调用，本步骤专注核心逻辑

### Step 5: 代码输出与最终打磨

**代码写入规则**：
- 组件文件 → {project_dir}/src/components/{ComponentName}/
- 页面文件 → {project_dir}/src/pages/
- 路由配置 → {project_dir}/src/router/
- 状态管理 → {project_dir}/src/stores/

> ext skill 增强由编排器在后续阶段统一调用，本步骤专注核心逻辑

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
      "description": "内建质量门禁报告，含pass_rate/p0_issues/p1_issues/aesthetic_score"
    },
    "visual_direction": {
      "type": "object",
      "description": "透传project-init的visual_direction，含10个维度（含tension_level/visual_narrative）"
    },
    "api_integration_skipped": {
      "type": "boolean",
      "description": "是否跳过了api-integration（true时表示数据层为fallback Mock，待后续替换）"
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

## 质量检查

P0（必须通过，不通过则阻断输出）：
- [ ] visual_direction 的视觉禁忌100%未被违反
- [ ] Design Token引用率100%，无硬编码样式值
- [ ] 色值引用100%使用Token变量
- [ ] 色彩对比度正文≥4.5:1，大文本≥3:1
- [ ] 交互组件100%包含ARIA属性和键盘导航
- [ ] 状态覆盖 default/hover/focus/active/disabled
- [ ] 异步操作有loading指示
- [ ] 响应式375px宽度下内容不溢出
- [ ] 100%组件来自组件库或本次生成
- [ ] visual_direction一致性（组件风格与aesthetic_direction一致）
- [ ] 视觉节奏6维度已在页面中体现

P1（建议通过，不通过则标注"待修复"）：
- [ ] TypeScript类型定义完整，无any类型
- [ ] 状态机无死锁状态
- [ ] 间距引用100%使用Token变量
- [ ] 响应式覆盖768px/1024px
- [ ] 组件树层级≤4层
- [ ] 异步操作>300ms有进度指示
- [ ] 支持prefers-reduced-motion
- [ ] 品牌色占比在color_strategy对应区间内
- [ ] 排版层级有足够跳跃感（字号比≥1.25，字重差≥100）
- [ ] 页面间距有节奏感（非均匀分布，至少3种间距值）
- [ ] audit设计品味评分≥75分
- [ ] 页面结构推荐已被数据驱动审视（由编排器调用ext-ui-ux-pro-max）
- [ ] 差异化建议已应用（由编排器调用ext-frontend-design）
- [ ] 交互设计已应用（由编排器调用ext-interaction-design，非纯静态组件时）
- [ ] ext-impeccable 各子命令增强已应用（由编排器调用）

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 视觉方向缺失 | 基于设计令牌推断视觉方向 | 美学方向可能不够精准 |
| 设计令牌缺失 | 使用内联样式+TODO注释 | 样式值硬编码，需后续替换 |
| 组件库缺失 | 全部新建组件 | 可能存在重复组件 |
| PRD缺失 | 仅基于页面需求描述生成，无产品需求上下文 | 组件功能可能偏离产品意图，缺少业务逻辑约束，功能区域覆盖不完整 |
| 路由结构缺失 | 基于页面需求自行规划路由层级和嵌套关系 | 路由可能与IA定义不一致，导航结构需后续对齐 |
| 交互规范缺失 | 使用默认动画规范表和通用反馈机制，异常路径基于PRD推断 | 交互状态机可能不完整，异常路径可能遗漏，动画和反馈可能与产品层面定义不一致 |
| project_dir 缺失 | 仅输出到 output/ 目录 | 代码需手动复制 |

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 视觉方向变更 | 所有组件和页面的视觉决策 | 标注受影响的组件和页面，建议重新生成 |
| 设计令牌变更 | 组件样式引用 | 标注受影响的组件，建议更新Token引用 |
| 组件库变更 | 组件复用关系 | 标注受影响的复用组件，建议重新匹配 |
| PRD变更 | 页面功能需求、组件边界、功能区域覆盖 | 标注受影响的页面和组件，评估是否需重新规划 |
| 路由结构变更 | 路由配置和导航组件 | 标注受影响的路由路径，建议更新路由配置 |
| 交互规范变更 | 交互状态机、异常路径、无障碍交互 | 标注受影响的状态转换和异常路径，建议更新状态机 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 页面组件树变更 | production-ready | 受影响的测试和构建 | 组件树结构变更 |
| 路由配置变更 | production-ready | 路由变更 | 路由路径变更 |
| 数据流变更 | api-integration | API需求变更 | 数据获取方式变更 |

## 变更记录

- v1.4: PM输入精简（移除prototype_spec/userflow/handoff_spec，PM不应定义UI决策）；PRD消费规则替代原型规格消费规则（含功能区域覆盖）；interaction-spec消费规则精简（只消费意图不消费具体数值；合并userflow异常路径；增加无障碍交互要求）；动画意图消费表改为意图→实现决策映射
- v1.3: ext-frontend-design调用改用结构化输入/输出契约（Input Contract/Output Contract）；新增输出消费映射规则；验证条件改为可程序化检查
- v1.2: PM输入消费规则改为意图约束模式（interaction-spec从"必须一致/以PM为准"改为"必须覆盖/PM定义意图UI决定实现"；原型规格新增消费规则"功能区域必须覆盖/视觉布局UI决定"；userflow确认为完整性约束无需修改）
- v1.1: audit/critique改为必经步骤（设计品味评分≥80分）；新增美学验证检查5项；视觉节奏扩展至6维度（新增tension_level/visual_narrative）；bolder/delight增加视觉自评触发条件；输出Schema新增visual_direction和aesthetic_score；ext-impeccable Setup统一引用；输入新增userflow（用户流程）和interaction-spec（交互规范）含消费规则和降级策略
- v1.0: 合并 ui-component-gen + page-assembly + ui-review；新增视觉方向消费；新增视觉节奏设计；审查改为内建质量门禁；组件改为页面上下文生成
