---
name: project-init
description: 当需要初始化UI前端项目时使用。项目初始化与视觉定义一体化，从品牌规范推导视觉方向，选择组件库并定制主题，同步生成项目脚手架和设计上下文文件。关键词：项目初始化、设计系统、视觉方向、主题定制、项目脚手架、建项目、出设计规范、配主题色。
metadata:
  module: "UI设计与前端开发"
  sub-module: "设计系统"
  type: "pipeline"
  version: "1.7"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "初始化前端项目"
    - "建立设计系统"
    - "配一下主题色"
    - "搭个项目"
  interaction_mode: "ai_suggest_human_approve"
---

# 项目初始化与视觉定义

## 核心原则

1. **视觉方向优先**——先定义"长什么样"，再生成令牌和代码
2. **组件库优先**——优先选用成熟组件库（shadcn/Ant Design/MUI等），从零构建仅作备选
3. **品牌驱动**——所有视觉决策从品牌基因推导，而非凭空定义
4. **上下文即代码**——PRODUCT.md/DESIGN.md 与代码同步生成，供后续Skill和ext-impeccable消费

## 步骤检查点

每个 Step 完成后，将当前进度写入内部检查点文件，支持编排器恢复时跳过已完成的步骤：

**检查点文件**：`output/checkpoints/project-init.json`

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
1. project-init 启动时检查 `output/checkpoints/project-init.json`
2. 若存在且有 `pending_steps`，从第一个 pending 步骤继续，跳过已完成步骤
3. 每个步骤完成后立即更新检查点（先写文件再推进）
4. 全部步骤完成后，检查点文件保留作为执行记录

## 交互模式

🤖→👤 AI建议人类审批

## 输入

**PM 输入自由度原则**：PM 层输出（品牌规范、产品定位、PRD）定义"需要什么"（意图），本 Skill 决定"怎么做"（实现）。PM 输入仅作为意图参考，不限制设计决策。当 PM 输入与本 Skill 的设计判断冲突时，以设计判断为准，但需在输出中标注偏离原因。

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 品牌规范 | JSON/markdown | 是 | 用户提供 / output/pm-strategy/positioning-strategy/positioning-strategy.json | 品牌色彩、字体、风格指南 |
| 产品定位 | JSON | ○ | output/pm-strategy/positioning-strategy/positioning-strategy.json | 产品定位陈述 |
| 目标平台 | string | 是 | 用户提供 | Web / Mobile / 跨平台 |
| 目标语言 | string | 是 | 上游编排器传递 / 用户提供（默认zh-CN） | 目标界面语言 |
| project_name | string | 是 | 用户提供 | 项目名称 |
| project_dir | string | 是 | 用户提供 | 项目根目录绝对路径 |
| framework | string | 是 | 用户提供 | React/Vue/Svelte/Next.js/Nuxt.js |
| package_manager | string | ○ | 用户提供 | npm/pnpm/yarn（默认pnpm） |
| 组件库偏好 | string | ○ | 用户提供 | shadcn/Ant Design/MUI/Element Plus/自定义（默认根据framework推荐） |
| PRD | markdown | ○ | output/pm-design/design-prd/prd.md | 产品需求文档（含功能区域和组件需求） |
| PRD结构化数据 | JSON | ○ | output/pm-design/design-prd/prd.json | PRD机器可消费版本，包含pages[]/user_flows[]，供项目初始化编程式消费 |

## 执行步骤

### Step 1: 品牌基因提取与色彩体系生成

从品牌规范中提取核心设计基因：
- 主色调：品牌主色（1个）+ 辅助色（2-3个）
- 色彩情绪：专业/温暖/活力/科技/稳重
- 字体气质：现代/经典/几何/人文
- 视觉风格：扁平/拟物/毛玻璃/新拟态

基于主色调生成完整色彩体系（使用OKLCH色彩空间保持感知均匀性）：

| 令牌类别 | 生成规则 | 数量 |
|----------|----------|------|
| 品牌色 | 主色+辅助色，各生成50-950共10个色阶 | 30-40 |
| 功能色 | 成功/警告/错误/信息，各10个色阶 | 40 |
| 中性色 | 灰度色阶50-950 | 10 |
| 语义色 | 背景/前景/边框/链接/禁用 | 15-20 |

对比度校验：正文≥4.5:1（WCAG AA），大文本≥3:1，不达标自动调整。

暗色模式推导（内建能力）：主色相不变降明度升饱和度、背景反转、文字对比度≥4.5:1。

> ext 增强结果已通过 visual_direction/tokens 输出供下游消费，本步骤专注核心逻辑

### Step 2: 视觉风格定义

**这是最关键的步骤**——定义"这个产品应该长什么样"，而非只输出令牌数值。

基于品牌基因提取结果，定义完整的视觉风格方向：

| 维度 | 定义内容 | 输出字段 |
|------|---------|---------|
| 美学方向 | 具体风格描述（如"温暖有机+大留白+柔和圆角"） | aesthetic_direction |
| 色彩策略 | Restrained/Committed/Full palette/Drenched | color_strategy |
| 主题决策 | 亮色/暗色 + 物理场景句（如"SRE在凌晨2点昏暗房间看监控"） | theme_decision |
| 排版策略 | 标题字体风格 + 正文字体风格 + 层级对比度 | typography_strategy |
| 空间策略 | 留白比例 + 密度倾向 | spatial_strategy |
| 视觉禁忌 | 绝对不使用的模式 | visual_bans |
| 情绪关键词 | 3-5个核心情绪词 | mood_keywords |
| 参考风格 | 1-2个可参考的产品/设计风格 | reference_style |
| 设计张力 | 大胆vs克制的程度（conservative/balanced/bold/extreme），决定设计是"安全但无聊"还是"有记忆点" | tension_level |
| 视觉叙事 | 页面如何引导用户视线流动（如"Z型阅读→聚焦CTA→渐进展示细节"），定义信息呈现的叙事节奏 | visual_narrative |

**视觉锚点定义**（防止文字描述导致AI理解模糊）：

纯文字的视觉方向（如"温暖有机"）对AI模型而言有100种视觉解释，必须补充具体的视觉锚点，将模糊意图转化为可执行的视觉参数。

| 锚点维度 | 定义内容 | 输出字段 | 示例 |
|---------|---------|---------|------|
| 圆角策略 | 全局圆角半径级别 | border_radius_level | sharp(0-2px)/subtle(4-8px)/medium(12-16px)/round(20-24px)/pill(999px) |
| 阴影策略 | 阴影层级和风格 | shadow_style | none/flat(纯偏移)/subtle(微扩散)/elevated(多层扩散)/dramatic(大范围投影) |
| 间距节奏 | 间距基数和节奏模式 | spacing_rhythm | tight(4px基数)/standard(8px基数)/relaxed(16px基数) + 规律(均匀)/jazz(跳跃)/symphonic(多层级) |
| 字号跳跃 | 标题与正文的字号对比度 | type_scale | modest(1.2x)/standard(1.333x)/strong(1.5x)/dramatic(2x+) |
| 品牌色使用方式 | 品牌色在页面中的分布模式 | brand_color_usage | accent(仅按钮/链接)/spotlight(关键区域背景)/flood(大面积背景+渐变) |
| 图像风格 | 图片/插画的视觉处理方式 | image_treatment | none/photography/illustration/3d/abstract/minimal-icon |
| 动效风格 | 交互动效的力度和节奏 | motion_style | none/subtle(微反馈)/moderate(平滑过渡)/expressive(弹性+编排)/theatrical(戏剧性编排) |
| 网格密度 | 内容区域的信息密度 | grid_density | sparse(宽松+大量留白)/balanced(标准间距)/dense(紧凑+信息密集) |

**语义一致性校验**（visual_direction 维度间的逻辑约束）：

visual_direction 的各维度之间存在语义约束关系，自相矛盾的定义会导致下游消费混乱。以下组合必须通过校验：

| 校验规则 | 矛盾示例 | 修正建议 |
|----------|---------|---------|
| aesthetic_direction 与 tension_level 语义一致 | "极简克制风" + tension_level=extreme | 调整tension_level为conservative/balanced，或调整aesthetic_direction |
| grid_density 与 brand_color_usage 互补 | grid_density=sparse + brand_color_usage=flood | 稀疏布局+大面积品牌色通常矛盾，建议grid_density→balanced或brand_color_usage→spotlight |
| spacing_rhythm 与 tension_level 匹配 | spacing_rhythm=tight(4px) + tension_level=bold | bold张力需要大幅跳跃间距，建议spacing_rhythm→relaxed+symphonic |
| type_scale 与 tension_level 匹配 | type_scale=modest(1.2x) + tension_level=bold | bold张力需要强字号跳跃，建议type_scale→strong(1.5x)或dramatic(2x+) |
| motion_style 与 tension_level 匹配 | motion_style=none + tension_level=extreme | extreme张力需要丰富动效，建议motion_style→expressive或theatrical |
| shadow_style 与 aesthetic_direction 匹配 | "极简扁平风" + shadow_style=dramatic | 极简风格不需要大范围投影，建议shadow_style→none或subtle |

**校验执行时机**：Step 2 输出 visual_direction 后立即执行，矛盾项标注为 P0 问题，必须修正后才能继续。

**页面级覆盖的语义校验**：anchor_overrides 覆盖后的锚点组合仍须通过上述校验规则。

**页面级锚点覆盖**（anchor_overrides）：

全局锚点定义了整体视觉基调，但特定页面可能需要打破全局节奏以实现视觉焦点或差异化。anchor_overrides 允许在页面级别覆盖全局锚点值，同时保持整体视觉一致性。

**覆盖规则**：
- 每个覆盖必须提供 `reason`（覆盖理由）和 `visual_impact`（视觉影响说明）
- 覆盖后的锚点值仍须在枚举范围内（如 border_radius_level 仍为 sharp/subtle/medium/round/pill）
- 单个页面最多覆盖 3 个锚点维度，超过 3 个说明该页面可能需要独立的视觉方向
- 覆盖不改变全局锚点定义，仅影响指定页面的消费行为

**典型覆盖场景**：

| 场景 | 覆盖维度 | 示例 |
|------|---------|------|
| Landing页需要视觉冲击 | grid_density: balanced→dense, brand_color_usage: accent→spotlight | 首页密集展示+品牌色突出 |
| 详情页需要呼吸感 | grid_density: dense→sparse, spacing_rhythm: tight→standard | 内容页宽松留白 |
| 表单页需要安全感 | border_radius_level: sharp→subtle, shadow_style: subtle→elevated | 圆角+阴影增加亲和力 |
| 数据大屏需要沉浸感 | grid_density: balanced→dense, motion_style: moderate→expressive | 密集数据+丰富动效 |

**视觉参考图生成**：

基于视觉方向和锚点定义，生成2张Moodboard参考图，为后续页面构建提供视觉锚点：

```
动作: 生成视觉参考图
输入:
  aesthetic_direction: Step 2定义的美学方向
  mood_keywords: 情绪关键词
  reference_style: 参考风格
  border_radius_level/shadow_style/spacing_rhythm/type_scale/brand_color_usage/image_treatment/motion_style/grid_density: 8个锚点维度
输出:
  moodboard_light: 参考图URL（亮色模式Moodboard，展示整体视觉氛围+布局节奏+色彩分布）
  moodboard_dark: 参考图URL（暗色模式Moodboard，如有暗色需求）
prompt构建规则:
  - 包含aesthetic_direction关键词
  - 包含mood_keywords
  - 包含reference_style参考
  - 包含锚点维度的具体参数（如"round border radius"、"dramatic type scale"）
  - 包含"web UI dashboard/landing page"确保产出是界面而非纯艺术
  - 包含"no AI generic style, no blue-purple gradient, no Inter font"排除同质化
  - image_size: landscape_16_9
```

> ext 增强结果已通过 visual_direction/tokens 输出供下游消费，本步骤专注核心逻辑

### Step 3: 组件库选择与主题定制

**PRD 消费规则**（意图约束）：
- PRD 定义"产品需要什么功能"（功能需求），project-init 定义"技术实现是什么"（代码实现）
- 若有 PRD 输入：其功能需求作为**组件需求清单**（必须包含 PRD 中列出的所有功能区域对应的组件，或提供合理的替代方案并在输出中标注替代理由），但组件实现方式由 project-init 决定

**分支判断**：

if 用户指定了组件库(shadcn/Ant Design/MUI/Element Plus等):
    → 轻量路径：基于组件库定制主题
else:
    → 完整路径：从零规划组件库

**轻量路径**（组件库定制主题）：

| 步骤 | 内容 |
|------|------|
| 主题令牌映射 | 将品牌色映射到组件库的主题变量（如shadcn的CSS变量） |
| 主题覆盖 | 覆盖组件库默认的圆角/阴影/间距/字号 |
| 扩展组件 | 识别组件库未覆盖的组件需求，规划自定义组件 |

**完整路径**（从零构建组件库）：

按原子设计规划组件库：

| 类别 | 典型组件 | 规格要素 |
|------|---------|---------|
| 原子组件 | Button/Input/Text/Icon/Divider/Box | 变体/尺寸/状态 |
| 分子组件 | FormField/SearchBar/ListItem | 原子组合 |
| 组织组件 | Form/DataTable/Dialog | 分子+原子组合 |

组件复用决策：复用度≥3页面→高优先级，1-2页面→中优先级，仅1页面→页面私有。

> ext-impeccable extract 增强由编排器在后续阶段统一调用，本步骤专注核心逻辑。仅当项目包含现有代码时编排器会调用 extract（全新项目无内容可提取，跳过）

### Step 4: 项目脚手架初始化

基于framework创建项目骨架：

| 框架 | 初始化命令 | 目录结构 |
|------|-----------|---------|
| React | Vite + React + TypeScript | src/components, src/pages, src/styles, src/api, src/stores |
| Vue | Vite + Vue + TypeScript | src/components, src/views, src/styles, src/api, src/stores |
| Next.js | create-next-app --ts | app/, components/, styles/, lib/ |
| Nuxt.js | nuxi init | components/, pages/, assets/, server/ |
| Svelte | Vite + Svelte + TypeScript | src/lib/components, src/routes, src/styles |

安装核心依赖：
- 路由：react-router/vue-router/sveltekit内置
- 状态管理：zustand/pinia/svelte stores
- 样式方案：根据组件库选择（Tailwind/CSS Modules/Styled Components）
- HTTP客户端：axios/fetch wrapper

**生成令牌文件**：

- {project_dir}/src/styles/tokens.css — CSS变量
- {project_dir}/src/styles/tokens.json — JSON格式令牌

验证项目可运行：`npm run dev` 启动成功。

### Step 5: 上下文文件输出

**生成上下文文件**（供ext-impeccable消费）：

生成 {project_dir}/PRODUCT.md：
- 产品名称和描述
- 目标用户画像
- 品牌调性和语气
- 产品目标和核心价值
- 反参考（不希望像什么）
- register字段（brand/product）

生成 {project_dir}/DESIGN.md：
- 视觉风格方向（来自Step 2）
- 色彩策略和主题决策
- 排版策略
- 空间策略
- 视觉禁忌
- 组件库选择和主题定制说明

**语言适配规则**（根据目标语言调整字体、字号和行高基准）：

| 目标语言 | 主字体推荐 | 正文字号 | 行高基准 | 间距倾向 |
|----------|-----------|---------|---------|---------|
| zh-CN | 思源黑体/霞鹜文楷 | 14-16px | 1.6-1.8 | 偏大 |
| en-US | 按ext-frontend-design推荐 | 13-14px | 1.4-1.5 | 标准 |
| ja-JP | Noto Sans JP | 14-16px | 1.7-1.8 | 偏大 |
| ko-KR | Noto Sans KR | 14-16px | 1.6-1.8 | 偏大 |
| ar-SA | Noto Sans Arabic | 14-16px | 1.6-1.8 | 偏大（RTL） |

> ext 增强结果已通过 visual_direction/tokens 输出供下游消费，本步骤专注核心逻辑

## 输出

**代码文件输出**：
- {project_dir}/ — 完整项目骨架
- {project_dir}/PRODUCT.md — 产品上下文
- {project_dir}/DESIGN.md — 设计上下文
- {project_dir}/src/styles/tokens.css — 设计令牌CSS变量
- {project_dir}/src/styles/tokens.json — 设计令牌JSON

**元数据输出**：output/ui-project-init/

**输出文件**：project-init.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["visual_direction", "tokens", "component_library", "scaffold", "project_dir"],
  "properties": {
    "visual_direction": {
      "type": "object",
      "description": "视觉风格方向定义（10个维度均有定义 = 每个字段非空且非占位符，见下方验证标准）",
      "properties": {
        "aesthetic_direction": {"type": "string", "minLength": 10, "description": "具体风格描述，如'温暖有机+大留白+柔和圆角'，不允许'TBD'/'待定'等占位符"},
        "color_strategy": {"type": "string", "enum": ["restrained", "committed", "full_palette", "drenched"]},
        "theme_decision": {"type": "string", "minLength": 15, "description": "必须包含亮/暗决策+物理场景句，如'亮色+办公室日间自然光下使用'"},
        "typography_strategy": {"type": "string", "minLength": 10, "description": "必须包含标题字体风格+正文字体风格+层级对比度描述"},
        "spatial_strategy": {"type": "string", "minLength": 10, "description": "必须包含留白比例+密度倾向描述"},
        "visual_bans": {"type": "array", "items": {"type": "string"}, "minItems": 3, "description": "至少3项视觉禁忌"},
        "mood_keywords": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 5, "description": "3-5个核心情绪词"},
        "reference_style": {"type": "string", "minLength": 5, "description": "1-2个可参考的产品/设计风格"},
        "tension_level": {"type": "string", "enum": ["conservative", "balanced", "bold", "extreme"]},
        "visual_narrative": {"type": "string", "minLength": 10, "description": "页面视线流动路径描述，如'Z型阅读→聚焦CTA→渐进展示细节'"},
        "border_radius_level": {"type": "string", "enum": ["sharp", "subtle", "medium", "round", "pill"], "description": "全局圆角半径级别"},
        "shadow_style": {"type": "string", "enum": ["none", "flat", "subtle", "elevated", "dramatic"], "description": "阴影层级和风格"},
        "spacing_rhythm": {"type": "string", "description": "间距基数+节奏模式，如'standard+jazz'"},
        "type_scale": {"type": "string", "enum": ["modest", "standard", "strong", "dramatic"], "description": "标题与正文的字号对比度"},
        "brand_color_usage": {"type": "string", "enum": ["accent", "spotlight", "flood"], "description": "品牌色在页面中的分布模式"},
        "image_treatment": {"type": "string", "enum": ["none", "photography", "illustration", "3d", "abstract", "minimal-icon"], "description": "图片/插画的视觉处理方式"},
        "motion_style": {"type": "string", "enum": ["none", "subtle", "moderate", "expressive", "theatrical"], "description": "交互动效的力度和节奏"},
        "grid_density": {"type": "string", "enum": ["sparse", "balanced", "dense"], "description": "内容区域的信息密度"},
        "moodboard_light": {"type": "string", "description": "亮色模式Moodboard参考图URL"},
        "moodboard_dark": {"type": "string", "description": "暗色模式Moodboard参考图URL（可选）"},
        "anchor_overrides": {
          "type": "array",
          "description": "页面级锚点覆盖，允许特定页面打破全局视觉锚点以实现差异化",
          "items": {
            "type": "object",
            "required": ["page", "overrides"],
            "properties": {
              "page": {"type": "string", "description": "页面名称或路由路径"},
              "overrides": {
                "type": "array",
                "description": "该页面的锚点覆盖列表，最多3个维度",
                "items": {
                  "type": "object",
                  "required": ["dimension", "global_value", "override_value", "reason", "visual_impact"],
                  "properties": {
                    "dimension": {"type": "string", "enum": ["border_radius_level", "shadow_style", "spacing_rhythm", "type_scale", "brand_color_usage", "image_treatment", "motion_style", "grid_density"], "description": "覆盖的锚点维度"},
                    "global_value": {"type": "string", "description": "全局锚点值"},
                    "override_value": {"type": "string", "description": "页面级覆盖值（须在对应枚举范围内）"},
                    "reason": {"type": "string", "description": "覆盖理由"},
                    "visual_impact": {"type": "string", "description": "视觉影响说明"}
                  }
                },
                "maxItems": 3
              }
            }
          }
        }
      }
    },
    "tokens": {
      "type": "object",
      "properties": {
        "colors": {"type": "object", "description": "色彩令牌（brand/functional/neutral/semantic）"},
        "typography": {"type": "object", "description": "排版令牌（font_families/font_sizes/font_weights/line_heights）"},
        "spacing": {"type": "object", "description": "间距令牌（scale数组）"},
        "shadows": {"type": "object", "description": "阴影令牌（sm/md/lg/xl）"},
        "breakpoints": {"type": "object", "description": "断点令牌（sm/md/lg/xl）"},
        "animation": {"type": "object", "description": "动画令牌（durations/easings）"}
      }
    },
    "component_library": {
      "type": "object",
      "properties": {
        "name": {"type": "string", "description": "组件库名称（shadcn/Ant Design/MUI/Element Plus/custom）"},
        "version": {"type": "string", "description": "组件库版本"},
        "theme_overrides": {"type": "object", "description": "主题覆盖变量映射"},
        "custom_components": {"type": "array", "items": {"type": "string"}, "description": "需自定义的组件列表"},
        "available_components": {"type": "array", "items": {"type": "string"}, "description": "可用组件清单"}
      }
    },
    "scaffold": {
      "type": "object",
      "properties": {
        "framework": {"type": "string", "description": "框架（React/Vue/Svelte/Next.js/Nuxt.js）"},
        "package_manager": {"type": "string", "description": "包管理器（pnpm/npm/yarn）"},
        "dependencies": {"type": "array", "items": {"type": "string"}, "description": "核心依赖列表"},
        "directory_structure": {"type": "object", "description": "目录结构定义"},
        "dev_server_running": {"type": "boolean", "description": "npm run dev是否启动成功"}
      }
    },
    "project_dir": {"type": "string", "description": "项目根目录路径"}
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 用户指定组件库 | 轻量路径：定制主题 |
| 用户未指定组件库 + framework=React | 默认推荐shadcn/ui |
| 用户未指定组件库 + framework=Vue | 默认推荐Element Plus |
| 用户未指定组件库 + 需要完全自定义 | 完整路径：从零构建 |
| 品牌色对比度<4.5:1（白色背景） | 自动生成深色变体作为文本色 |
| 色彩情绪=专业/稳重 | 中性色占比≥60%，品牌色点缀≤20% |
| 色彩情绪=活力/温暖 | 品牌色占比30%-40%，中性色≤40% |
| 目标平台=Web | 输出CSS Variables+Tailwind Config |
| 目标平台=Mobile | 输出iOS Swift+Android Kotlin |
| 目标平台=跨平台 | 输出全部格式 |

## 质量检查

P0（必须通过，不通过则阻断输出）：
- [ ] WCAG AA对比度100%达标（正文≥4.5:1，大文本≥3:1）
- [ ] 视觉方向不含AI同质化特征（由编排器调用ext-frontend-design审视）
- [ ] 设计系统推荐已被数据驱动审视（由编排器调用ext-ui-ux-pro-max）
- [ ] npm run dev启动成功

P1（建议通过，不通过则标注"待修复"）：
- [ ] 色彩体系完整（品牌色+功能色+中性色+语义色）
- [ ] 字号层级≥6级
- [ ] 间距令牌≥8级
- [ ] visual_direction 10个维度均有定义
- [ ] 色彩增强已应用（由编排器调用ext-impeccable colorize）
- [ ] 排版增强已应用（由编排器调用ext-impeccable typeset）
- [ ] 暗色模式推导完成
- [ ] 组件库主题定制完成
- [ ] 项目骨架文件完整（package.json/tsconfig/路由/布局组件）
- [ ] PRODUCT.md和DESIGN.md已生成

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 品牌规范缺失 | 基于行业基准生成默认品牌色 | 品牌色基于行业推断，标注"待品牌确认" |
| 产品定位缺失 | 基于品牌规范推断色彩情绪 | 色彩情绪可能不够精准 |
| 组件库偏好缺失 | 根据framework推荐默认组件库 | 可能不是用户期望的组件库 |
| package_manager缺失 | 默认使用pnpm | 包管理器可能与团队习惯不一致 |
| PRD缺失 | 不规划自定义组件，仅配置组件库主题 | 组件需求待PRD补充 |
| project_dir 缺失 | 仅输出到 output/ 目录 | 代码文件需手动复制 |
| ext skill 未部署 | 由编排器负责调用，若编排器未调用则执行内置降级 | ext增强效果缺失，核心功能不受影响 |

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 定位陈述变更 | 品牌色、视觉方向 | 标注受影响的令牌和视觉方向，建议人类确认 |
| 品牌规范变更 | 色彩体系、视觉方向、令牌生成 | 标注受影响的全部下游产出，建议重新生成视觉方向和令牌 |
| 目标平台新增 | 新增平台适配令牌 | 标注需新增的平台令牌 |
| PRD变更 | 组件需求清单 | 标注受影响的组件规划，评估是否需补充自定义组件 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 视觉方向变更 | page-builder | 美学方向/色彩策略/视觉禁忌 | visual_direction任何字段变更 |
| 令牌变更 | page-builder | 受影响的令牌类别 | 令牌值变更 |
| 组件库变更 | page-builder | 组件复用关系 | 组件库选择或主题变更 |
| PRODUCT.md/DESIGN.md变更 | ext-impeccable | 上下文文件内容变更 | PRODUCT.md或DESIGN.md内容变更 |

## 变更记录

- v1.7: 新增visual_direction语义一致性校验（6条维度间逻辑约束），矛盾项标注为P0问题
- v1.6: 新增anchor_overrides（页面级锚点覆盖机制），允许特定页面打破全局视觉锚点实现差异化，含覆盖规则和典型场景
- v1.5: 质量检查P0/P1分级，P0不通过阻断输出
- v1.4: 移除handoff-spec输入（PM不应定义UI决策）；PRD消费规则替代handoff-spec消费规则；PRD说明增加"含功能区域和组件需求"
- v1.3: ext-impeccable两阶段调用策略（解决PRODUCT.md/DESIGN.md循环依赖）；Step 1-2使用内联上下文替代Setup；Step 5完成后执行完整Setup确认；colorize/typeset调用块增加内联上下文指令
- v1.2: handoff-spec消费规则从"约束"改为"意图约束"；组件需求从"必须包含"改为"必须包含或提供合理替代方案"；令牌覆盖从"所有变量"改为"所有变量意图"
- v1.1: visual_direction扩展至10维度（新增tension_level/visual_narrative）；ext-frontend-design输出自动写入visual_bans；ext-impeccable Setup统一引用extensions/README.md；输入新增handoff-spec（设计交接文档）含消费规则和职责边界；降级策略新增handoff-spec缺失处理；质量检查新增handoff-spec覆盖验证
- v1.0: 合并 project-scaffold + design-system；新增视觉风格定义步骤；新增PRODUCT.md/DESIGN.md生成；ext-frontend-design改为必调；新增组件库分支路径（轻量/完整）
