---
name: page-builder
description: 当需要生成前端页面和组件时使用。页面与组件一体化构建，基于视觉方向和设计令牌，在页面上下文中生成组件并组装为完整页面，内建质量门禁确保产出质量。关键词：页面生成、组件生成、页面组装、UI构建、写页面、出组件、搭页面。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "2.0"
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

1. **设计简报驱动**——当 design_brief.json 存在时，以其可执行设计规范为强约束生成代码；不存在时退回视觉方向驱动模式
2. **视觉方向驱动**——所有组件和页面决策从visual-direction推导，不凭空设计
3. **页面上下文生成**——组件在页面场景中生成，确保视觉一致性和交互连贯性
4. **令牌约束**——100%引用Design Token，不硬编码样式值
5. **质量内建**——生成即校验，不依赖独立审查步骤
6. **可访问性默认**——每个组件默认包含ARIA属性、键盘导航、焦点管理
7. **上下文预算**——主动管理上下文窗口，确保关键信息不丢失

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
1. **分页前**：生成完整页面清单（从 page_manifest.json 或页面需求提取），确认待生成页面总数
2. 每个页面独立执行 Step 2-4，完成后代码写入文件、上下文只保留摘要
3. 所有页面完成后统一执行 Step 5（代码输出与最终打磨）
4. **分页后**：校验已生成页面与分页前清单的一致性，遗漏页面补充生成
5. 分页间共享 visual_direction 和设计令牌（始终保留在上下文中）

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
| 页面清单 | JSON | 条件必填 | output/ui-frontend/page-manifest/page_manifest.json | 编排器生成的统一页面清单，存在时必须消费，pages[]为页面生成权威来源 |
| 视觉方向 | JSON | 是 | output/ui-project-init/project-init.json → visual_direction | 美学方向/色彩策略/视觉禁忌等 |
| 设计令牌 | JSON | 是 | output/ui-project-init/project-init.json → tokens | 设计变量定义 |
| 组件库 | JSON | 是 | output/ui-project-init/project-init.json → component_library | 可用组件清单和主题定制 |
| 目标框架 | string | 是 | 用户提供 | React/Vue/Svelte |
| 目标语言 | string | 是 | 上游编排器传递 / 用户提供（默认zh-CN） | 目标界面语言 |
| project_dir | string | 是 | output/ui-project-init/project-init.json → project_dir | 项目根目录绝对路径 |
| PRD | markdown | ○ | output/pm-design/design-prd/prd.md | 产品需求上下文（含功能区域和组件需求） |
| PRD结构化数据 | JSON | 条件必填 | output/pm-design/design-prd/prd.json | 当文件存在时必填消费，pages[]为页面清单权威来源 |
| 路由结构 | JSON | 条件必填 | output/pm-design/design-ia/ia_proposals.json | 当文件存在时必填消费，routes[]为路由清单权威来源 |
| 交互规范 | markdown | ○ | output/pm-design/interaction-spec/interaction-spec.md | 交互状态机/交互意图/异常路径/无障碍交互 |
| 交互规范(结构化) | JSON | ○ | output/pm-design/interaction-spec/interaction-spec.json | 交互状态机/动画意图/手势意图的结构化数据，供编程式消费 |
| 探索阶段设计决策 | JSON | ○ | output/ui-frontend/design-exploration/design_decisions.json | progressive模式下Stage 1条件分支（约束对齐）产出的设计决策，作为design_decisions初始值 |
| 设计简报 | JSON | ○ | output/ui-frontend/design-brief/design_brief.json | ext Skill产出的可执行设计规范，包含具体的CSS值/组件结构/布局指令 |

## 执行步骤

### Step 1: 页面结构规划与视觉节奏设计

将页面需求拆解为布局区块，同时设计视觉节奏（而非只做功能布局）：

**PRD 消费规则**（意图约束）：
- **页面清单消费优先级**：page_manifest.json > prd.json.pages[] > ia_proposals.routes[] > 页面需求(string/markdown)
- 若有 page_manifest.json 输入：其 `pages[]` 为**页面生成的权威来源**，page-builder 必须为其中每个 page_id 生成对应页面，不可遗漏
- 若有 PRD 输入：其定义的功能区域和内容需求作为**必须覆盖的功能清单**（页面必须包含 PRD 中定义的所有功能区域），但区域布局方式、视觉层次、间距节奏由 page-builder 结合 visual_direction 决定
- PRD 定义"页面需要什么功能区域"，page-builder 决定"这些区域如何视觉呈现"
- **页面清单覆盖约束**：若有 prd.json 输入，其 `pages[]` 为**页面清单的权威来源**，page-builder 必须为 `pages[]` 中的每个 `page_id` 生成对应页面，不可遗漏
- **路由清单覆盖约束**：若有 ia_proposals.json 输入，其 `routes[]` 为**路由清单的权威来源**，page-builder 必须为 `routes[]` 中的每个路由生成对应页面，不可遗漏
- **交叉校验**：当 prd.json 和 ia_proposals.json 同时存在时，`prd.json.pages[].route` 必须与 `ia_proposals.routes[].path` 一一对应，不一致时以 prd.json.pages[] 为准，差异记录到 design_decisions

**component_catalog 消费规则**（推荐+备选模式）：
- 若有 component_catalog 输入：其 `type` 为推荐组件类型，`alternatives` 为备选方案，`selection_criteria` 为选型依据
- page-builder 根据 visual_direction 和页面上下文选择推荐类型或备选类型，选择备选类型时需记录到 design_decisions
- 当备选类型更符合视觉方向（如 visual_direction.tension_level=bold 时 Card Grid 比 Table 更合适）时，优先选择备选类型

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

**视觉锚点消费**（消费visual-direction的8个锚点维度）：

visual_direction 中的锚点维度将模糊的视觉意图转化为具体的视觉参数，page-builder 必须严格遵循：

| 锚点维度 | 消费规则 | 违反判定 |
|---------|---------|---------|
| border_radius_level | 所有圆角值必须与级别对应：sharp→0-2px, subtle→4-8px, medium→12-16px, round→20-24px, pill→999px | 出现不符合级别的圆角值 |
| shadow_style | 阴影风格必须一致：none→无阴影, flat→仅偏移无模糊, subtle→微扩散, elevated→多层扩散, dramatic→大范围投影 | 阴影风格与定义不一致 |
| spacing_rhythm | 间距必须遵循节奏模式：tight→4px基数, standard→8px基数, relaxed→16px基数；规律→均匀递增, jazz→跳跃式(4/8/24/8), symphonic→多层级(4/8/16/32/48) | 间距不符合节奏模式 |
| type_scale | 字号跳跃必须达到级别：modest→1.2x, standard→1.333x, strong→1.5x, dramatic→2x+ | h1与body字号比低于级别要求 |
| brand_color_usage | 品牌色分布必须匹配：accent→仅按钮/链接/图标, spotlight→关键区域背景+CTA, flood→大面积背景+渐变+Hero区域 | 品牌色分布与定义不符 |
| image_treatment | 图片处理方式必须一致：none→纯文字, photography→真实照片, illustration→插画, 3d→3D渲染, abstract→抽象图形, minimal-icon→极简图标 | 图片风格与定义不一致 |
| motion_style | 动效力度必须匹配：none→无动效, subtle→微反馈(色变/微移), moderate→平滑过渡(滑入/淡入), expressive→弹性+编排(交错/弹簧), theatrical→戏剧性编排(全屏转场/粒子) | 动效力度与定义不符 |
| grid_density | 信息密度必须匹配：sparse→宽松+大量留白(每屏≤3个内容块), balanced→标准间距(每屏4-6个内容块), dense→紧凑+信息密集(每屏≥7个内容块) | 内容块数量与密度定义不符 |

**页面级锚点覆盖消费**（消费visual-direction的anchor_overrides）：

当 visual_direction 中定义了 anchor_overrides 时，page-builder 按以下规则消费：

1. **匹配规则**：anchor_overrides[].page 与当前页面 name 或 route 匹配时，该页面的对应锚点维度使用 override_value 替代 global_value
2. **覆盖优先级**：页面级覆盖值 > 全局锚点值
3. **未覆盖维度**：未在 anchor_overrides 中出现的维度仍使用全局锚点值
4. **覆盖约束**：单个页面覆盖维度不超过3个；覆盖值须在对应枚举范围内
5. **质量检查适配**：视觉锚点遵循检查使用覆盖后的最终值判定，而非全局值

**覆盖消费示例**：

```
全局锚点: grid_density=balanced, brand_color_usage=accent
页面"Landing"覆盖: grid_density→dense, brand_color_usage→spotlight
→ Landing页消费: grid_density=dense, brand_color_usage=spotlight（其余6维度用全局值）
→ 其他页面消费: 全部8维度用全局值
```

**tension_level 视觉模式库**：

tension_level 决定整体视觉大胆程度，不同级别对应不同的视觉实现策略：

| 张力级别 | 布局策略 | 色彩策略 | 排版策略 | 间距策略 | 品牌色策略 |
|---------|---------|---------|---------|---------|-----------|
| conservative | 对称布局，标准网格，居中对齐 | 中性色为主(≥70%)，品牌色点缀(≤10%) | 标准字号跳跃(1.333x)，常规字重(400/600) | 均匀间距，标准8px基数 | 仅按钮和链接使用品牌色 |
| balanced | 适度不对称，1-2个视觉焦点 | 中性色为主(50-60%)，品牌色辅助(20-30%) | 适度跳跃(1.333-1.5x)，标题加粗(700) | 有节奏的间距变化，8px基数+jazz节奏 | 关键区域背景使用品牌色淡色变体 |
| bold | 不对称布局，大面积视觉区域，打破网格 | 品牌色显著(30-50%)，强对比色块 | 大跳跃(1.5x+)，超大标题(48px+)，极端字重对比(900/300) | 大幅跳跃间距，16px基数+symphonic节奏 | Hero区域品牌色大面积使用，渐变背景 |
| extreme | 实验性布局，全屏视觉，重叠元素，非传统网格 | 品牌色主导(>50%)，撞色，高饱和度 | 极端跳跃(2x+)，文字叠加图片，非常规排版 | 极端间距对比(4px↔64px)，留白与密集交替 | 品牌色flood模式，全屏渐变+文字叠加 |

布局规则：
- 桌面端：Header+Sidebar(240px)+Main+Footer
- 平板端：Header+可折叠Sidebar+Main+Footer
- 移动端：Header+BottomNav+Main（全屏）

**PM 约束偏离记录**（设计自由度保障机制）：

当 page-builder 的设计判断与 PM 输入约束不一致时，必须显式记录偏离决策，确保偏离可追溯、可评估、可回退：

**探索阶段决策消费规则**：
- 若有探索阶段设计决策输入（design_decisions.json from Stage 1 条件分支）：其 decisions[] 作为 design_decisions 的初始值
- page-builder 在探索阶段决策基础上继续追加新的偏离记录
- 探索阶段已确认的决策（severity=minor/moderate 且人类已确认）不再重复记录
- 探索阶段未确认的决策（severity=major/critical）需重新评估和确认

```json
{
  "design_decisions": [{
    "pm_constraint": "PRD要求3个独立功能区域（用户信息/订单列表/操作面板）",
    "ui_decision": "合并为Tab式单区域，3个Tab切换展示",
    "rationale": "用户任务流连贯，分区域增加认知负荷和页面纵向长度",
    "impact": "减少页面纵向滚动，提升任务完成效率，但需确保Tab切换可达性",
    "constraint_source": "prd.json → pages[].functional_areas",
    "severity": "moderate"
  }]
}
```

**偏离严重度分级**：

| 严重度 | 定义 | 示例 |
|--------|------|------|
| minor | 布局微调，不影响功能覆盖 | 功能区域顺序调整、间距节奏变化 |
| moderate | 实现方式变更，功能覆盖不变 | 多区域合并为Tab、列表改为卡片网格 |
| major | 功能范围重新划分 | 页面合并/拆分、功能区域增删 |
| critical | 核心交互路径变更 | 用户流程关键步骤修改、导航结构重组 |

**记录规则**：
- minor 级别偏离：记录但无需人类确认
- moderate 级别偏离：记录并在 quality_report 中标注，建议人类确认
- major/critical 级别偏离：记录并阻断输出，需人类确认后方可继续

组件映射：遍历页面功能需求，逐项匹配组件库中的组件，标注组件间数据依赖和交互通信方式。

**设计简报消费**（消费 design_brief.json）：

当 design_brief.json 存在时，page-builder 必须将其作为**强约束输入**消费，而非可选参考。设计简报包含 ext Skill 产出的可执行设计规范，直接指导代码生成：

| 消费维度 | design_brief 字段 | 消费方式 | 优先级 |
|----------|------------------|---------|--------|
| 色彩规范 | color_specifications | 具体CSS色值直接应用（如`oklch(97% 0.01 60)`），替代令牌中的推导值 | 强约束 |
| 排版规范 | typography_specifications | 具体字号/字重/行高直接应用 | 强约束 |
| 布局指令 | layout_instructions | 布局类型和视觉焦点作为设计参考，page-builder 可基于页面上下文和 visual_direction 调整布局实现（如将推荐的 sidebar-main 改为 tab-main，需记录到 design_decisions） | 指导性 |
| 组件规范 | component_specifications | 组件结构/状态/变体直接实现 | 强约束 |
| 动效规范 | animation_specifications | 动效参数（时长/缓动/延迟）直接应用 | 强约束 |
| 品牌色策略 | brand_color_strategy | 品牌色分布区域和占比直接遵循 | 强约束 |
| 视觉禁忌 | visual_bans | 禁止的模式/风格绝对不出现 | 强约束 |
| 差异化方向 | differentiation_direction | 美学差异化方向作为设计决策依据 | 指导性 |

**消费规则**：
- design_brief 中的具体值（CSS色值、字号、间距值）**覆盖** visual_direction 中的推导值
- design_brief 中的布局指令作为**设计参考**，page-builder 可基于页面上下文调整实现，调整需记录到 design_decisions
- design_brief 中的视觉禁忌**追加到** visual_direction.visual_bans
- 当 design_brief 与 PM 输入冲突时：design_brief 优先，冲突记录到 design_decisions
- 当 design_brief 的指导性维度（layout_instructions/differentiation_direction）与 page-builder 的设计判断冲突时：以设计判断为准，偏离记录到 design_decisions

### Step 2: 组件生成（在页面上下文中）

基于页面结构和视觉方向，在页面场景中生成组件：

**组件生成顺序**：先页面骨架 → 再核心交互组件 → 最后装饰组件

**设计简报驱动**：当 design_brief.component_specifications 存在时，按其指定的组件结构/状态/变体/specific_values 直接实现，而非从组件库默认配置推导。

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

> ext 增强结果已通过 design_brief.json 在 Step 1 中消费，本步骤专注核心逻辑

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

> ext 增强结果已通过 design_brief.json 在 Step 1 中消费，本步骤专注核心逻辑

### Step 4: 内建质量门禁

生成代码后立即执行质量检查（不依赖独立审查步骤）：

**设计规范检查**：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 色值引用 | 100%使用Token变量 | P0 |
| 字号引用 | 100%使用Token变量 | P0 |
| 间距引用 | 100%使用Token变量 | P0 |
| 色彩对比度 | 正文≥4.5:1，大文本≥3:1 | P0 |
| 视觉禁忌 | 不包含visual_direction.visual_bans中的模式 | P0 |

**美学验证检查**：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 视觉节奏遵循 | 页面实现与Step 1视觉节奏设计一致（视觉重心/密度分布/色彩节奏/层次感/设计张力/视觉叙事6维度均已体现） | P0 |
| 品牌色占比 | 品牌色占比在visual_direction.color_strategy对应区间（Restrained:5-15%/Committed:30-60%/Full palette:15-40%/Drenched:>60%） | P1 |
| 排版层级跳跃 | h1/h2/h3/h4/body之间字号比≥type_scale对应倍率，字重差≥100 | P0 |
| visual_direction一致性 | 组件视觉风格与aesthetic_direction描述一致，不出现aesthetic_direction中未提及的风格特征 | P0 |
| 留白节奏 | 页面间距非均匀分布，至少3种不同间距值形成节奏感 | P1 |
| 视觉锚点遵循 | 8个锚点维度(border_radius_level/shadow_style/spacing_rhythm/type_scale/brand_color_usage/image_treatment/motion_style/grid_density)的实现与visual_direction定义一致 | P0 |
| AI同质化特征检测 | 不包含以下AI同质化特征：Inter/Roboto/Arial作为主字体、蓝紫渐变+白底配色、均匀卡片网格布局、所有间距相同、无视觉焦点 | P0 |
| 视觉无聊度检测 | 不满足以下任一条件即为"视觉无聊"：①品牌色占比<5% ②所有字号跳跃<1.25x ③所有间距值相同 ④无视觉焦点区域 ⑤无任何阴影或深度层次 | P1 |

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
| 空状态 | 数据为空时有空状态展示 | P0 |
| 错误状态 | 请求失败有错误提示和重试 | P0 |

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
| 组件来源 | 100%来自组件库或本次生成 | P1 |
| 路由覆盖 | 全部页面有路由 | P1 |
| 页面清单覆盖 | page_manifest.json.pages[] 中的所有 page_id 均有对应页面生成（无 page_manifest 时检查 prd.json.pages[]） | P0 |
| 路由清单覆盖 | ia_proposals.routes[] 中的所有路由均已配置 | P0 |

**问题处理规则**：P0问题必须修复后才能输出，P1问题标注"待修复"。

> ext 增强结果已通过 design_brief.json 在 Step 1 中消费，本步骤专注核心逻辑

### Step 5: 代码输出与最终打磨

**代码写入规则**：
- 组件文件 → {project_dir}/src/components/{ComponentName}/
- 页面文件 → {project_dir}/src/pages/
- 路由配置 → {project_dir}/src/router/
- 状态管理 → {project_dir}/src/stores/

> ext 增强结果已通过 design_brief.json 在 Step 1 中消费，本步骤专注核心逻辑

## 输出

**代码文件输出**：{project_dir}/src/（组件、页面、路由、状态管理、数据层fallback直接写入项目目录）

**元数据输出**：output/ui-frontend/page-builder/

**输出文件**：pages.json, design_feedback.json, quality_debt.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["pages", "components", "quality_report", "project_dir"],
  "properties": {
    "pages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "页面名称"},
          "route": {"type": "string", "description": "路由路径"},
          "layout": {"type": "string", "description": "布局类型（header-sidebar-main / header-main / full-screen）"},
          "component_tree": {"type": "array", "items": {"type": "string"}, "description": "页面组件树（组件ID列表）"},
          "state_management": {"type": "string", "description": "状态管理方案"},
          "data_flow": {"type": "array", "items": {"type": "object"}, "description": "数据流定义（source/params/response_type）"}
        }
      }
    },
    "components": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "name": {"type": "string", "description": "组件名称"},
          "framework": {"type": "string", "description": "目标框架"},
          "files": {"type": "array", "items": {"type": "string"}, "description": "组件文件路径列表"},
          "props": {"type": "array", "items": {"type": "string"}, "description": "Props接口字段列表"},
          "token_coverage": {"type": "number", "description": "Design Token引用率(%)"},
          "accessibility": {"type": "object", "description": "无障碍属性（aria_roles/keyboard_nav/focus_management）"},
          "interaction": {"type": "object", "description": "交互定义（states/transitions/state_machine）"}
        }
      }
    },
    "quality_report": {
      "type": "object",
      "properties": {
        "pass_rate": {"type": "number", "description": "质量检查通过率(%)"},
        "p0_issues": {"type": "array", "items": {"type": "object"}, "description": "P0阻断问题列表"},
        "p1_issues": {"type": "array", "items": {"type": "object"}, "description": "P1待修复问题列表"},
        "aesthetic_score": {"type": "number", "description": "美学评分(0-100)，计算规则：audit百分制×0.5+critique百分制×0.5（由编排器stage-4计算后回填）；未执行审计时为内建自评分数"}
      }
    },
    "design_decisions": {
      "type": "array",
      "description": "PM约束偏离记录，当UI设计判断与PM输入约束不一致时必须记录",
      "items": {
        "type": "object",
        "required": ["pm_constraint", "ui_decision", "rationale", "impact", "constraint_source", "severity"],
        "properties": {
          "pm_constraint": {"type": "string", "description": "PM输入的原始约束描述"},
          "ui_decision": {"type": "string", "description": "UI侧的实际设计决策"},
          "rationale": {"type": "string", "description": "偏离理由"},
          "impact": {"type": "string", "description": "偏离对产品的影响评估"},
          "constraint_source": {"type": "string", "description": "约束来源（如prd.json→pages[].functional_areas）"},
          "severity": {"type": "string", "enum": ["minor", "moderate", "major", "critical"], "description": "偏离严重度"}
        }
      }
    },
    "visual_direction": {
      "type": "object",
      "description": "透传project-init的visual_direction，含10个维度（含tension_level/visual_narrative）"
    },
    "api_integration_skipped": {
      "type": "boolean",
      "description": "是否跳过了api-integration（true时表示数据层为fallback Mock，待后续替换）"
    },
    "page_coverage": {
      "type": "object",
      "description": "页面清单覆盖报告（当prd.json或ia_proposals.json存在时生成）",
      "properties": {
        "source": {"type": "string", "description": "页面清单来源（prd.json / ia_proposals.json / both）"},
        "expected_pages": {"type": "array", "items": {"type": "object"}, "description": "期望页面清单（来自PM产出）"},
        "generated_pages": {"type": "array", "items": {"type": "string"}, "description": "实际生成的页面名称列表"},
        "missing_pages": {"type": "array", "items": {"type": "object"}, "description": "遗漏的页面（期望但未生成）"},
        "extra_pages": {"type": "array", "items": {"type": "string"}, "description": "额外生成的页面（不在期望清单中）"},
        "coverage_rate": {"type": "number", "description": "页面覆盖率(%)，100%表示无遗漏"}
      }
    },
    "project_dir": {"type": "string", "description": "项目根目录路径"}
  }
}
```

### design_feedback.json

design_feedback.json 是 UI 侧向 PM 侧的反向反馈通道。当 page-builder 在设计过程中发现 PM 产出存在可优化空间时，生成结构化反馈建议，由 ui-orchestrator 回传给 design-orchestrator 处理。

**与 design_decisions 的区别**：
- design_decisions：记录 UI 侧已做出的偏离决策（UI 自主决定，事后告知）
- design_feedback：建议 PM 侧修改其产出（需要 PM 侧确认和修改，事前协商）

**生成条件**：当 design_decisions 中存在 major 或 critical 级别偏离时，必须生成对应的 design_feedback。

```json
{
  "type": "object",
  "required": ["feedback_id", "generated_at", "source", "suggestions"],
  "properties": {
    "feedback_id": {"type": "string", "description": "反馈唯一标识"},
    "generated_at": {"type": "string", "description": "生成时间（ISO 8601）"},
    "source": {"type": "string", "description": "反馈来源（page-builder）"},
    "suggestions": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["target_artifact", "target_field", "current_value", "suggested_value", "rationale", "impact_assessment", "priority"],
        "properties": {
          "target_artifact": {"type": "string", "enum": ["prd.json", "ia_proposals.json", "userflow.json", "component_catalog.json", "interaction-spec.json"], "description": "建议修改的PM产出文件"},
          "target_field": {"type": "string", "description": "建议修改的具体字段路径（如pages[].functional_areas）"},
          "current_value": {"type": "string", "description": "当前值描述"},
          "suggested_value": {"type": "string", "description": "建议修改为的值描述"},
          "rationale": {"type": "string", "description": "修改理由（基于UI设计判断）"},
          "impact_assessment": {"type": "object", "description": "修改影响评估", "properties": {
            "affected_downstream": {"type": "array", "items": {"type": "string"}, "description": "受影响的下游产出"},
            "breaking_change": {"type": "boolean", "description": "是否为破坏性变更"},
            "effort": {"type": "string", "enum": ["low", "medium", "high"], "description": "修改工作量"}
          }},
          "priority": {"type": "string", "enum": ["low", "medium", "high"], "description": "建议优先级"}
        }
      }
    },
    "summary": {"type": "string", "description": "反馈摘要（一句话概括核心建议）"}
  }
}
```

**示例**：
```json
{
  "feedback_id": "fb-20240116-001",
  "generated_at": "2024-01-16T10:30:00Z",
  "source": "page-builder",
  "suggestions": [{
    "target_artifact": "prd.json",
    "target_field": "pages[2].functional_areas",
    "current_value": "3个独立功能区域：用户信息/订单列表/操作面板",
    "suggested_value": "合并为1个Tab式区域，3个Tab切换展示",
    "rationale": "用户任务流连贯，分区域增加认知负荷和页面纵向长度，Tab方式更符合操作流程",
    "impact_assessment": {
      "affected_downstream": ["ia_proposals.json（路由可能简化）", "component_catalog.json（组件类型变更）"],
      "breaking_change": false,
      "effort": "low"
    },
    "priority": "medium"
  }],
  "summary": "建议将用户中心页3个独立功能区域合并为Tab式布局"
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
- [ ] Design Token引用率100%，无硬编码样式值（色值/字号/间距）
- [ ] 色值引用100%使用Token变量
- [ ] 间距引用100%使用Token变量
- [ ] 色彩对比度正文≥4.5:1，大文本≥3:1
- [ ] 交互组件100%包含ARIA属性和键盘导航
- [ ] 状态覆盖 default/hover/focus/active/disabled
- [ ] 异步操作有loading指示
- [ ] 数据为空有空状态展示
- [ ] 请求失败有错误提示和重试
- [ ] 响应式375px宽度下内容不溢出
- [ ] 视觉节奏6维度已在页面中体现
- [ ] 视觉锚点8维度实现与visual_direction定义一致（含页面级覆盖后的最终值）
- [ ] 排版层级跳跃≥type_scale对应倍率
- [ ] 不包含AI同质化特征（Inter/Roboto主字体、蓝紫渐变+白底、均匀卡片网格、相同间距、无视觉焦点）
- [ ] design_decisions中无critical/major级别偏离未经人类确认

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
- [ ] 视觉无聊度检测通过（品牌色占比≥5%、字号跳跃≥1.25x、间距有变化、有视觉焦点、有深度层次）
- [ ] audit设计品味评分≥75分
- [ ] 页面结构推荐已被数据驱动审视（由编排器调用ext-ui-ux-pro-max）
- [ ] 差异化建议已应用（由编排器调用ext-frontend-design）
- [ ] 交互设计已应用（由编排器调用ext-interaction-design，非纯静态组件时）
- [ ] ext-impeccable 各子命令增强已应用（由编排器调用）
- [ ] design_decisions中moderate级别偏离已标注建议人类确认

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 视觉方向缺失 | 基于设计令牌推断视觉方向 | 美学方向可能不够精准 |
| 设计令牌缺失 | 使用内联样式+TODO注释 | 样式值硬编码，需后续替换 |
| 组件库缺失 | 全部新建组件 | 可能存在重复组件 |
| 设计简报缺失 | 退回令牌驱动模式，仅消费visual_direction和设计令牌生成组件 | 色彩/排版/布局无强约束规范，组件视觉一致性依赖令牌推导 |
| 页面清单缺失 | 从PRD文本或页面需求描述中提取页面列表，无结构化校验 | 页面可能遗漏，路由可能不完整，无page_coverage覆盖率报告 |
| PRD缺失 | 仅基于页面需求描述生成，无产品需求上下文 | 组件功能可能偏离产品意图，缺少业务逻辑约束，功能区域覆盖不完整 |
| 路由结构缺失 | 基于页面需求自行规划路由层级和嵌套关系 | 路由可能与IA定义不一致，导航结构需后续对齐 |
| 交互规范缺失 | 使用默认动画规范表和通用反馈机制，异常路径基于PRD推断 | 交互状态机可能不完整，异常路径可能遗漏，动画和反馈可能与产品层面定义不一致 |
| project_dir 缺失 | 仅输出到 output/ 目录 | 代码需手动复制 |

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 视觉方向变更 | 所有组件和页面的视觉决策 | 标注受影响的组件和页面，建议重新生成 |
| 设计简报变更 | 组件生成、色彩规范、排版规范、布局指令 | 标注受影响的维度和页面，强约束维度变更需重新生成对应组件 |
| 页面清单变更 | 页面覆盖完整性、路由配置 | 标注新增/删除的页面，补充生成遗漏页面或移除废弃页面 |
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
| quality_debt变更 | production-ready | 新增/升级的critical/high级债务 | debt_items中severity变更或新增open状态项 |
| 数据流变更 | api-integration | API需求变更 | 数据获取方式变更 |
| design_feedback生成 | ui-orchestrator → design-orchestrator | PM产出修改建议 | design_feedback.json存在且suggestions非空 |

## 变更记录

- v2.0: 核心架构升级——新增设计简报驱动模式（design_brief.json），ext Skill产出从建议升级为可执行设计规范；核心原则新增"设计简报驱动"为第一优先级；Step 1新增设计简报消费规则（8维度强约束）；Step 2新增设计简报驱动的组件生成；移除"ext skill增强由编排器在后续阶段统一调用"声明
- v1.8: P0/P1分类修正——间距Token引用升级P0、空状态/错误状态升级P0、组件来源降级P1；aesthetic_score明确计算规则（audit×0.5+critique×0.5）；P0检查列表同步更新
- v1.7: 新增探索阶段设计决策输入（design_decisions.json from Stage 1 条件分支），作为design_decisions初始值；PM约束偏离记录增加探索阶段决策消费规则
- v1.6: 新增design_feedback.json（UI→PM反向反馈通道），当major/critical级别偏离时必须生成；下游通知机制增加design_feedback回传
- v1.5: 新增design_decisions（PM约束偏离记录），含4级严重度分级（minor/moderate/major/critical）和对应处理规则；视觉锚点消费增加页面级覆盖机制（anchor_overrides）
- v1.4: PM输入精简（移除prototype_spec/userflow/handoff_spec，PM不应定义UI决策）；PRD消费规则替代原型规格消费规则（含功能区域覆盖）；interaction-spec消费规则精简（只消费意图不消费具体数值；合并userflow异常路径；增加无障碍交互要求）；动画意图消费表改为意图→实现决策映射
- v1.3: ext-frontend-design调用改用结构化输入/输出契约（Input Contract/Output Contract）；新增输出消费映射规则；验证条件改为可程序化检查
- v1.2: PM输入消费规则改为意图约束模式（interaction-spec从"必须一致/以PM为准"改为"必须覆盖/PM定义意图UI决定实现"；原型规格新增消费规则"功能区域必须覆盖/视觉布局UI决定"；userflow确认为完整性约束无需修改）
- v1.1: audit/critique改为必经步骤（设计品味评分≥80分）；新增美学验证检查5项；视觉节奏扩展至6维度（新增tension_level/visual_narrative）；bolder/delight增加视觉自评触发条件；输出Schema新增visual_direction和aesthetic_score；ext-impeccable Setup统一引用；输入新增userflow（用户流程）和interaction-spec（交互规范）含消费规则和降级策略
- v1.0: 合并 ui-component-gen + page-assembly + ui-review；新增视觉方向消费；新增视觉节奏设计；审查改为内建质量门禁；组件改为页面上下文生成
