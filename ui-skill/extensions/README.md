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

| 调用时机 | 调用方 Skill | 作用 |
|----------|-------------|------|
| project-init Step 2 | `project-init` | 提供差异化美学方向建议 |
| page-builder Step 2 | `page-builder` | 组件视觉差异化实现 |

### ext-impeccable — 设计质量全生命周期工具箱

| 属性 | 说明 |
|------|------|
| 定位 | 覆盖 UI 设计从构思到交付全流程的 20+ 子命令工具箱 |
| 侧重点 | 设计迭代 + 质量打磨 |
| 来源 | 本目录 `ext-impeccable/` |

**子命令与调用点**：

| 子命令 | 作用 | 调用方 Skill | 客观触发条件 |
|--------|------|-------------|-------------|
| colorize | 战略性色彩增强 | `project-init` | 品牌色占比<10% 或 中性色占比>70% |
| typeset | 排版层级增强 | `project-init` | 字号层级<6级 或 最大/最小字号比<2 |
| extract | 从现有代码逆向提取设计系统 | `project-init` | 输入包含"现有组件库"或"已有项目" |
| shape | 编码前先设计（产出设计简报） | `page-builder` | 组件意图描述含"复杂"/状态数>5 |
| animate | 动效策略评估 | `page-builder` | 组件状态转换>3个 或 有异步操作 |
| bolder | 放大视觉表现力 | `page-builder` | 品牌色占比<15% 或 视觉描述含"安全/标准" |
| quieter | 收敛视觉强度 | `page-builder` | 品牌色占比>40% 或 医疗/金融/法律场景 |
| delight | 增加愉悦感微细节 | `page-builder` | 组件为核心用户流程节点 |
| harden | 生产就绪化（边界/错误/i18n） | `page-builder` | 组件有表单输入/异步操作/国际化需求 |
| polish | 最终质量打磨（始终最后执行） | `page-builder` | 所有其他外部调用完成后 |
| layout | 页面布局/间距/视觉层级增强 | `page-builder` | 页面区块>5个 或 组件树层级>3 |
| adapt | 响应式设计策略层适配 | `page-builder` | 目标平台含"跨平台"或"移动端" |
| clarify | UX文案优化 | `page-builder` | 页面含表单/空状态/错误状态 |
| onboard | 新手引导设计 | `page-builder` | 页面为首页/注册页/新手引导页 |
| distill | 简化过度复杂的UI | `page-builder` | 页面组件数>10个 或 操作按钮>5个 |
| audit | 5维度技术质量审计 | `page-builder` | 始终调用（如已部署） |
| critique | UX设计评审（启发式评分） | `page-builder` | audit设计品味评分<80分 |
| optimize | UI渲染性能专项诊断和修复 | `production-ready` | LCP>2.5s且瓶颈为UI渲染 |

### ext-interaction-design — 交互动效模式库

| 属性 | 说明 |
|------|------|
| 定位 | 提供微交互、动效设计、状态转换和用户反馈的具体代码模式 |
| 侧重点 | 交互层的代码实现 |
| 来源 | 本目录 `ext-interaction-design/` |

**调用点**：

| 调用时机 | 调用方 Skill | 作用 |
|----------|-------------|------|
| page-builder Step 2 | `page-builder` | 提供可直接使用的交互动效代码模式 |

### ext-ui-ux-pro-max — 数据驱动设计决策引擎

| 属性 | 说明 |
|------|------|
| 定位 | 基于可搜索数据库的设计智能推荐系统 |
| 侧重点 | 数据驱动的设计决策 |
| 来源 | 本目录 `ext-ui-ux-pro-max/` |

**调用点**：

| 调用时机 | 调用方 Skill | 作用 |
|----------|-------------|------|
| project-init Step 1 | `project-init` | 配色/字体/风格数据推荐（`--design-system`） |
| page-builder Step 1 | `page-builder` | 页面结构推荐（`--domain` 自动检测页面类型） |

## 调用机制

核心 Skill 通过 `Skill: ext-xxx` 定向调用外部 Skill。调用前必须先检测外部 Skill 是否已部署，避免调用不存在的能力导致流程中断。

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

ext skill 是专业设计能力，核心 Skill 必须经过 ext skill 审视，上层传递的输入仅作为意图参考。

```
1. 检测：检查 ext-xxx/SKILL.md 是否存在
2. 存在 → 必调（除非满足明确跳过条件）
3. 调用 `Skill: ext-xxx`，核心 Skill 通过指令性调用块调用，包含输入/输出/验证条件，脚本使用 `{SKILL_DIR}/scripts/` 路径
4. 上层输入作为"已有方案"传入（参考，不作为约束），ext skill 独立审视并可能挑战现有方案
5. 不存在 → 执行降级策略，标注"xxx待 ext-xxx 支持"，不阻塞后续步骤
```

**跳过条件**（仅限以下场景）：
- ext-impeccable extract：全新项目无现有代码
- ext-impeccable shape：纯静态展示原子组件（Badge/Divider/Spacer/Icon）
- ext-interaction-design：纯静态无交互组件（纯文本/纯图片展示）
- ext-impeccable clarify/onboard/distill：三项子命令均不满足页面特征时
- ext-impeccable optimize：性能瓶颈明确为网络延迟或包体积（非UI渲染）
- ext-impeccable animate：数据密集型仪表盘或医疗/金融场景
- ext-impeccable delight：辅助功能组件

### 执行顺序规则

1. **同一步骤内多个外部调用按表格顺序执行**，前者输出作为后者输入
2. **同 Skill 多子命令合并调用**：同一步骤内同一外部 Skill 的多个子命令合并为单次调用（如 `ext-impeccable animate bolder delight`），避免重复加载 SKILL.md 浪费 token
3. **polish 始终是最后一步**，不可在其他外部调用之前执行
4. **bolder 和 quieter 选择规则**，同一组件只能调用其中一个（品牌色占比<25%→bolder，>40%→quieter，25%-40%→视场景选择：品牌场景倾向bolder，产品场景倾向不调用）
5. **audit 后可触发反馈闭环**：若 critique 执行后修改了代码，需重新 audit 验证，最多循环2次

### 冲突解决规则

| 冲突场景 | 解决方案 |
|----------|---------|
| ext-frontend-design 方向与 ext-ui-ux-pro-max 推荐冲突 | 优先 ext-frontend-design（创意方向 > 数据推荐） |
| bolder 与 quieter 同时满足触发条件 | 按品牌色占比判断（<25%→bolder，>40%→quieter） |
| animate 与 ext-interaction-design 功能重叠 | animate 管策略（评估哪里需要动画），interaction-design 管实现（提供代码模式），先策略后实现 |
| distill 删减了 bolder/delight 增强的内容 | 以 distill 为准（简化优先于增强） |

### 调用格式（写入核心 Skill 的 SKILL.md）

```
**必调**：`Skill: ext-frontend-design`
- 作用：提供差异化美学方向审视，确保设计系统视觉独特性，避免AI同质化
- 输入：品牌规范+产品定位+目标语言+已有方案（作为参考，不作为约束）
- 输出：差异化美学方向建议
- 调用方式：核心 Skill 执行到 ext- 调用点时，按指令性调用块格式调用 `Skill: ext-frontend-design`，包含输入/输出/验证条件 → 不存在则跳过，标注"视觉差异化待 ext-frontend-design 支持"，不阻塞后续步骤
- 设计原则：上层传递的输入仅作为意图参考，ext-frontend-design 独立审视并可能挑战现有方案
```

### 降级策略分类

| 降级类型 | 适用场景 | 示例 |
|----------|---------|------|
| 跳过+标注 | 外部 Skill 未部署或调用失败 | `ext-frontend-design`、`ext-ui-ux-pro-max`、`ext-interaction-design` |
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
