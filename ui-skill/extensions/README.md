# UI Skill 外部扩展

本目录存放外部 Skill。实际 Skill 文件从 GitHub 等来源获取，部署到 `.trae/skills/` 下。

## 命名规范

### 前缀规则

| 类型 | 前缀 | 示例 | 说明 |
|------|------|------|------|
| 核心自建 Skill | 无前缀 | `design-system`、`ui-component-gen` | 本项目维护，流程必需 |
| 外部 UI Skill | `ext-` | `ext-frontend-design`、`ext-impeccable` | 第三方提供，增强核心能力 |

### 命名约束

1. **`name` 字段必须匹配目录名**：Trae 按 `name` 字段匹配目录名识别 Skill
2. **前缀不可省略**：`ext-` 前缀是区分核心与外部的唯一标识
3. **使用小写连字符**：`ext-frontend-design` 而非 `ext-FrontendDesign` 或 `ext_frontend_design`
4. **语义化命名**：名称应表达增强能力

## 可用外部 Skill（共4个）

### ext-frontend-design — 视觉创意引擎

| 属性 | 说明 |
|------|------|
| 定位 | 生成视觉独特、避免AI审美同质化的生产级前端界面 |
| 侧重点 | 美学方向选择 + 视觉差异化 |
| 来源 | 本目录 `ext-frontend-design/` |

**调用点**：

| 调用时机 | 编排器阶段 | 作用 |
|----------|-----------|------|
| 设计系统增强 | stage-2 | 提供差异化美学方向建议，生成 design_brief.json |

**可执行设计规范（executable_specifications）**：

ext-frontend-design 输出新增 `executable_specifications`（required字段），将建议转化为可直接消费的设计规范：

| 规范维度 | 内容 | 消费方 |
|----------|------|--------|
| color_values | 具体CSS色值数组 | design_brief.json → page-builder |
| typography_values | 字体/字号/字重/行高具体值 | design_brief.json → page-builder |
| layout_patterns | 布局模式+间距+对齐规则 | design_brief.json → page-builder |
| spacing_rhythm_values | 间距节奏具体值 | design_brief.json → page-builder |
| border_radius_values | 圆角具体值 | design_brief.json → page-builder |

color_substitutions 新增 `use_instead_values` 字段（具体CSS色值数组），替代抽象建议。

### ext-impeccable — 设计质量全生命周期工具箱

| 属性 | 说明 |
|------|------|
| 定位 | 覆盖 UI 设计从构思到交付全流程的 20+ 子命令工具箱 |
| 侧重点 | 设计迭代 + 质量打磨 |
| 来源 | 本目录 `ext-impeccable/` |

**子命令与调用点**：

| 子命令 | 作用 | 编排器阶段 | 客观触发条件 |
|--------|------|-------------|-------------|
| colorize | 战略性色彩增强 | stage-2 | 品牌色占比<10% 或 中性色占比>70% |
| typeset | 排版层级增强 | stage-2 | 字号层级<6级 或 最大/最小字号比<2 |
| extract | 从现有代码逆向提取设计系统 | stage-2 | 输入包含"现有组件库"或"已有项目" |
| shape | 编码前先设计（产出设计简报） | stage-4 | 组件意图描述含"复杂"/状态数>5 |
| animate | 动效策略评估 | stage-4 | 组件状态转换>3个 或 有异步操作 |
| bolder | 放大视觉表现力 | stage-4 | 品牌色占比<15% 或 视觉描述含"安全/标准" |
| quieter | 收敛视觉强度 | stage-4 | 品牌色占比>40% 或 医疗/金融/法律场景 |
| delight | 增加愉悦感微细节 | stage-4 | 组件为核心用户流程节点 |
| harden | 生产就绪化（边界/错误/i18n） | stage-6 | 组件有表单输入/异步操作/国际化需求 |
| polish | 最终质量打磨（始终最后执行） | stage-6 | 所有其他外部调用完成后 |
| layout | 页面布局/间距/视觉层级增强 | stage-4 | 页面区块>5个 或 组件树层级>3 |
| adapt | 响应式设计策略层适配 | stage-4 | 目标平台含"跨平台"或"移动端" |
| clarify | UX文案优化 | stage-4 | 页面含表单/空状态/错误状态 |
| onboard | 新手引导设计 | stage-4 | 页面为首页/注册页/新手引导页 |
| distill | 简化过度复杂的UI | stage-4 | 页面组件数>10个 或 操作按钮>5个 |
| audit | 5维度技术质量审计 | stage-4 | 始终调用（如已部署） |
| critique | UX设计评审（启发式评分） | stage-4 | audit设计品味评分<80分 |
| optimize | UI渲染性能专项诊断和修复 | stage-6 | LCP>2.5s且瓶颈为UI渲染 |

### ext-interaction-design — 交互动效模式库

| 属性 | 说明 |
|------|------|
| 定位 | 提供微交互、动效设计、状态转换和用户反馈的具体代码模式 |
| 侧重点 | 交互层的代码实现 |
| 来源 | 本目录 `ext-interaction-design/` |

**调用点**：

| 调用时机 | 编排器阶段 | 作用 |
|----------|-----------|------|
| 页面交互动效设计 | stage-4 | 提供可直接使用的交互动效代码模式 |

### ext-ui-ux-pro-max — 数据驱动设计决策引擎

| 属性 | 说明 |
|------|------|
| 定位 | 基于可搜索数据库的设计智能推荐系统 |
| 侧重点 | 数据驱动的设计决策 |
| 来源 | 本目录 `ext-ui-ux-pro-max/` |

**调用点**：

| 调用时机 | 编排器阶段 | 作用 |
|----------|-----------|------|
| 设计系统基线推荐 | stage-2 | 配色/字体/风格数据推荐 |
| 页面结构推荐 | stage-4 | 页面结构推荐 |

## 调用机制

ext skill 是专业设计能力，由 **ui-orchestrator 编排器**统一调度，不在 Pipeline Skill 内部调用。核心 Skill 中不再包含 `Skill: ext-xxx` 调用块，所有 ext 调用由编排器按阶段执行。ext Skill 产出通过 **design_brief.json** 转化为可执行设计规范，page-builder 直接消费，消除"建议-执行断裂"。

### ext-impeccable Setup（统一规范）

核心 Skill 调用 ext-impeccable 时，根据 PRODUCT.md/DESIGN.md 是否已生成，采用不同策略：

**策略一：完整 Setup**（PRODUCT.md/DESIGN.md 已存在）

1. 运行 `node {SKILL_DIR}/scripts/load-context.mjs` 加载 PRODUCT.md / DESIGN.md（从 {project_dir}/ 读取）
2. 识别 register：从 PRODUCT.md 的 register 字段获取；若无则从产品定位推断（创意/设计/品牌/展示/作品集→brand；管理/工具/平台/系统/数据→product；无法判断→默认product）
3. 加载对应 register reference：brand→`{SKILL_DIR}/reference/brand.md`，product→`{SKILL_DIR}/reference/product.md`
4. 若调用子命令，同时加载该子命令的 reference 文件（如 shape→`{SKILL_DIR}/reference/shape.md`）

**策略二：内联上下文**（PRODUCT.md/DESIGN.md 尚未生成，如 project-init Step 1-2）

1. 跳过 `load-context.mjs`，由调用方 Skill 直接将品牌规范+产品定位+当前步骤产出作为内联上下文传递
2. 内联上下文必须包含：register（brand/product）、产品名称、产品定位、品牌规范、当前步骤产出、目标语言
3. 调用时显式声明 `跳过 Setup，使用内联上下文`，ext-impeccable 直接消费内联上下文执行子命令，不触发 teach 或 load-context
4. 内联上下文中 register 的判断规则同策略一第 2 步

> 各核心 Skill 的 SKILL.md 中不再重复此 Setup 说明，统一引用本规范。

### Register 感知

ext-impeccable 和 ext-frontend-design 区分两种设计寄存器，决定设计法则：

| Register | 含义 | 设计法则 | 典型场景 |
|----------|------|---------|---------|
| brand | 设计即产品 | 大胆、独特、令人难忘 | 创意机构、作品集、品牌官网 |
| product | 设计服务产品 | 清晰、高效、可信赖 | SaaS工具、电商平台、后台管理 |

**判断规则**：产品定位含"创意/设计/品牌/展示/作品集"→brand；含"管理/工具/平台/系统/数据"→product；无法判断→默认product。

### 调用流程

ext skill 是专业设计能力，由 **ui-orchestrator 编排器**统一调度，不在 Pipeline Skill 内部调用。

```
1. 编排器按阶段调度：核心阶段（Pipeline Skill）→ ext增强阶段（ext Skill）交替执行
2. ext增强阶段：编排器使用 Skill 工具调用 ext-xxx，传递核心阶段产出作为输入
3. 上层输入作为"已有方案"传入（参考，不作为约束），ext skill 独立审视并可能挑战现有方案
4. ext skill 不存在或调用失败 → 按分类执行降级策略：核心增强类（ext-frontend-design/ext-ui-ux-pro-max）失败阻断下游阶段；可选增强类失败标注不阻断，记录到 quality_debt.json
```

**编排器 ext 调用阶段**：

| 阶段 | 名称 | 调用的 ext skill | 说明 |
|------|------|-----------------|------|
| stage-e | 快速生成 | ext-frontend-design / ext-ui-ux-pro-max / ext-impeccable / ext-interaction-design（4选1，由express_engine参数决定） | express 模式专属，直接生成页面代码 |
| stage-1 | 设计系统建立 | — | 内建条件分支：设计探索+PM约束审查 |
| stage-2 | 设计增强+简报生成 | ext-ui-ux-pro-max, ext-impeccable(colorize/typeset), ext-frontend-design | 审视 project-init 产出，生成 design_brief.json |
| stage-3 | 页面与组件构建 | — | page-builder 消费 design_brief |
| stage-4 | 页面增强+质量审计 | ext-ui-ux-pro-max, ext-impeccable(layout/adapt/shape/audit/critique/{bolder\|quieter/delight/clarify/onboard/distill}), ext-interaction-design | 增强+审计一体化，ext-frontend-design 不再调用（stage-2已调用） |
| stage-5 | API集成 | — | 按需 |
| stage-6 | 生产就绪+优化 | ext-impeccable(harden/polish/optimize) | 按需 |

**跳过条件**（仅限以下场景）：
- ext-impeccable extract：全新项目无现有代码
- ext-impeccable shape：纯静态展示原子组件（Badge/Divider/Spacer/Icon）
- ext-interaction-design：纯静态无交互组件（纯文本/纯图片展示）
- ext-impeccable clarify/onboard/distill：三项子命令均不满足页面特征时
- ext-impeccable optimize：性能瓶颈明确为网络延迟或包体积（非UI渲染）
- ext-impeccable animate：数据密集型仪表盘或医疗/金融场景
- ext-impeccable delight：辅助功能组件

### 执行顺序规则

1. **编排器按阶段顺序执行**：核心阶段→ext增强阶段→核心阶段→ext增强阶段，交替进行
2. **同一 ext 阶段内多个调用按编排器定义顺序执行**，前者输出作为后者输入
3. **同 Skill 多子命令合并调用**：同一 ext 阶段内同一外部 Skill 的多个子命令合并为单次调用（如 `ext-impeccable animate bolder delight`），避免重复加载 SKILL.md 浪费 token
4. **polish 始终是最后一步**，不可在其他外部调用之前执行
5. **bolder 和 quieter 选择规则**，同一组件只能调用其中一个（品牌色占比<25%→bolder，>40%→quieter，25%-40%→视场景选择：品牌场景倾向bolder，产品场景倾向不调用）
6. **audit 后可触发反馈闭环**：若 critique 执行后修改了代码，需重新 audit 验证，最多循环2次

### 冲突解决规则

| 冲突场景 | 解决方案 |
|----------|---------|
| ext-frontend-design 方向与 ext-ui-ux-pro-max 推荐冲突 | 优先 ext-frontend-design（创意方向 > 数据推荐） |
| ext-frontend-design 与 ext-impeccable 视觉建议冲突 | 优先 ext-frontend-design（创意方向 > 质量打磨） |
| bolder 与 quieter 同时满足触发条件 | 按品牌色占比判断（<25%→bolder，>40%→quieter） |
| animate 与 ext-interaction-design 功能重叠 | animate 管策略（评估哪里需要动画），interaction-design 管实现（提供代码模式），先策略后实现 |
| distill 删减了 bolder/delight 增强的内容 | 以 distill 为准（简化优先于增强），但 distill 必须评估被删减内容的设计意图：若被删减内容属于 design_brief 的强约束维度（color_specifications/typography_specifications/visual_bans），则保留不删减；若属于指导性维度（differentiation_direction），可删减但需记录到 design_decisions |

**ext Skill 冲突消解优先级**：ext-frontend-design > ext-ui-ux-pro-max > ext-impeccable

### ext-impeccable 子命令输出消费规则

核心 Skill 调用 ext-impeccable 子命令后，必须按以下规则消费输出：

| 子命令 | 输出类型 | 消费规则 | 消费方 |
|--------|---------|---------|--------|
| colorize | 增强色彩方案 | 品牌色占比调整至15-30%，中性色占比降至50%以下；新增色彩追加到 design tokens | project-init |
| typeset | 排版增强方案 | 字号层级扩展至≥6级，字重使用≥3种；更新 typography tokens | project-init |
| extract | 可复用设计令牌和组件模式 | 提取的色彩/字体/间距/组件模式合并到现有令牌体系，避免重复定义 | project-init |
| shape | 组件UX规划 | 状态机覆盖所有状态转换，视觉方向建议映射到组件实现 | page-builder |
| layout | 布局优化方案 | 间距节奏和视觉层级应用到页面布局代码 | page-builder |
| adapt | 响应式适配策略 | 断点覆盖375px/768px/1024px/1440px，适配策略应用到响应式代码 | page-builder |
| animate | 动效策略评估 | 评估结果决定哪些状态转换需要动画，动效参数映射到动画令牌 | page-builder |
| bolder | 视觉增强代码 | 品牌色占比提升，视觉表现力增强；直接替换原组件代码 | page-builder |
| quieter | 视觉收敛代码 | 品牌色占比收敛，视觉强度降低；直接替换原组件代码 | page-builder |
| delight | 愉悦感微细节代码 | 微交互和视觉细节追加到组件代码 | page-builder |
| clarify | UX文案优化代码 | 表单/空状态/错误状态文案替换到页面代码 | page-builder |
| onboard | 新手引导设计代码 | 引导流程代码追加到页面组件 | page-builder |
| distill | 简化后代码 | 以 distill 输出为准，替换原页面代码（简化优先于增强） | page-builder |
| audit | 审查报告 | 统一评分：原始分(20→100, ×5)；综合分=audit×0.5+critique×0.5；综合分<75分触发 critique 闭环 | page-builder |
| critique | UX设计评审+代码修改 | 统一评分：原始分(40→100, ×2.5)；修改后的代码替换原代码，触发 re-audit 验证（最多3次闭环+偏科检测） | page-builder |
| harden | 生产就绪化代码 | 错误处理/i18n/边缘情况代码合并到组件代码 | page-builder |
| polish | 最终打磨代码 | 直接替换原组件代码（polish 始终最后执行） | page-builder |
| optimize | UI渲染优化方案 | 优化方案应用到性能瓶颈组件，LCP目标≤2.5s | production-ready |

**通用消费规则**：
1. 子命令输出为代码时，直接替换目标代码（非追加）
2. 子命令输出为方案/策略时，由核心 Skill 决定如何映射到代码实现
3. 多个子命令合并调用时（如 `animate bolder delight`），按子命令顺序依次消费，后者在前者输出基础上修改
4. 子命令输出与 visual_direction 冲突时，以 visual_direction 为准（visual_direction 是全局约束）
5. distill 输出优先级高于 bolder/delight（简化优先于增强）

### 调用格式（编排器调度）

编排器按阶段调度 ext skill，核心 Skill 中不再包含 ext 调用块。编排器调用 ext skill 时传递核心阶段产出作为输入，ext skill 独立审视并可能挑战现有方案。

```
编排器调度示例（stage-2 设计系统增强）：
1. 编排器调用 ext-ui-ux-pro-max --design-system，传递 project-init 产出的品牌规范+visual_direction
2. 编排器调用 ext-impeccable colorize，传递色彩体系+品牌规范
3. 编排器调用 ext-frontend-design，传递 visual_direction+品牌规范+产品定位
4. 编排器调用 ext-impeccable typeset，传递排版体系+visual_direction
5. ext skill 不存在或调用失败 → 执行降级策略，标注"xxx待 ext-xxx 支持"，不阻塞后续阶段
```

### 降级策略分类

| 降级类型 | 适用场景 | 示例 |
|----------|---------|------|
| 阻断下游 | 核心增强类未部署或调用失败，下游阶段依赖其产出 | `ext-frontend-design`、`ext-ui-ux-pro-max` |
| 跳过+标注 | 可选增强类未部署或调用失败，不影响下游阶段 | `ext-interaction-design` |
| 内置替代 | 核心有基础能力，外部 Skill 提供增强版 | `ext-impeccable` 各子命令（核心有默认输出作为降级） |

### 三种场景的具体行为

| 场景 | 行为 |
|------|------|
| 外部 Skill 已部署 | 检测到 `ext-xxx/SKILL.md` 存在 → 必调 `Skill: ext-xxx`，传递输入（含已有方案作为参考），验证输出 |
| 外部 Skill 未部署 | 检测到 `ext-xxx/SKILL.md` 不存在 → 执行降级策略（跳过+标注 或 内置替代），不阻塞流程 |
| 外部 Skill 调用失败 | 记录失败原因 → 执行降级策略 → 不阻塞后续阶段 |

## 已内建的原外部 Skill 能力

以下能力原由外部 Skill 提供，现已内建到核心 Skill 中：

| 原外部 Skill | 内建位置 | 内建方式 |
|-------------|---------|---------|
| ext-dark-mode | `project-init` Step 1 | 基于亮色令牌自动推导暗色方案（规则：主色相不变降明度升饱和度、背景反转、文字对比度≥4.5:1） |
| ext-figma-sync | `project-init` Step 5 | 输出标准 Design Tokens JSON 格式，可被 Figma Tokens 插件直接消费 |
| ext-i18n | `page-builder` Step 3 | 多语言场景下内建引入i18n框架（react-i18next/vue-i18n），文案抽取为语言包 |
| ext-visual-regression | `production-ready` Step 2 | 使用Playwright截图对比+Storybook Chromatic实现视觉回归检测 |

## 部署方式

1. 从本目录获取外部 Skill 的 `ext-{skill-name}/SKILL.md`
2. 将 `ext-{skill-name}/` 文件夹复制到 `.trae/skills/` 下，扁平平铺（含 scripts/、reference/、data/ 子目录）
3. 核心自建 Skill 中的定向调用点会自动检测并调用

```
.trae/skills/
├── ui-orchestrator/SKILL.md             ← 核心自建（编排器）
├── project-init/SKILL.md                ← 核心自建
├── page-builder/SKILL.md                ← 核心自建
├── api-integration/SKILL.md             ← 核心自建
├── production-ready/SKILL.md            ← 核心自建
├── ext-frontend-design/SKILL.md         ← 外部扩展
├── ext-impeccable/SKILL.md              ← 外部扩展
├── ext-interaction-design/SKILL.md      ← 外部扩展
├── ext-ui-ux-pro-max/SKILL.md           ← 外部扩展
└── ...
```

**{SKILL_DIR} 说明**：ext-impeccable 和 ext-ui-ux-pro-max 的脚本路径使用 `{SKILL_DIR}` 占位符，表示 Skill 所在目录的绝对路径。部署后，Agent 框架在执行脚本时会将 `{SKILL_DIR}` 替换为实际路径。例如：
- ext-impeccable：`node {SKILL_DIR}/scripts/load-context.mjs` → `node /path/to/.trae/skills/ext-impeccable/scripts/load-context.mjs`
- ext-ui-ux-pro-max：`python3 {SKILL_DIR}/scripts/search.py` → `python3 /path/to/.trae/skills/ext-ui-ux-pro-max/scripts/search.py`
