# Stage-E: 快速生成（express 模式专属）

仅在 `mode=express` 时执行。根据 `express_engine` 参数选择对应的 ext Skill，直接读取 PRD 和品牌规范，一步生成完整页面代码，跳过完整设计系统建立、令牌生成、增强-审计循环。

## 轻量设计锚点（v7.2 新增）

express 模式跳过 stage-1 的完整设计系统建立，但**不能完全跳过设计约束**——无约束的 ext 调用产出质量随机且不可控。因此在 ext Skill 调用前，编排器生成轻量设计锚点（express_design_anchor），为 ext Skill 提供最小设计方向指引。

```
动作: 生成轻量设计锚点
触发条件: mode=express，ext Skill调用前
输入:
  prd_text: PRD描述
  品牌规范: 用户提供（可选）
  产品定位: 用户提供（可选）
  express_engine: visual/ux/polish/motion
处理流程:
  1. 从PRD推断register（brand/product）
  2. 从PRD+品牌规范推断色彩方向（暖色/冷色/中性色+主色调）
  3. 从PRD推断排版方向（展示型/功能型）
  4. 从express_engine推断设计侧重（见下表）
  5. 生成express_design_anchor（内联JSON，不写入文件）
输出: express_design_anchor（传递给ext Skill的inline_context参数）
验证: anchor包含register+color_direction+typography_direction+design_focus
模式: 🤖
```

**express_design_anchor 结构**：

```json
{
  "register": "brand | product",
  "color_direction": {
    "temperature": "warm | cool | neutral",
    "primary_hue": "amber | teal | rose | indigo | emerald | slate",
    "avoid": ["blue-purple gradient", "generic gray", "pure black on white"],
    "brand_colors": ["用户提供或推断的品牌色值"]
  },
  "typography_direction": {
    "style": "display-dramatic | clean-functional | editorial | geometric",
    "avoid": ["Inter as primary", "system-ui as only font"],
    "heading_scale": "large-contrast | moderate | compact"
  },
  "layout_direction": {
    "approach": "asymmetric-hero | sidebar-main | fullscreen-cta | card-grid | editorial-flow",
    "avoid": ["identical card grids", "centered everything", "cookie-cutter sections"],
    "whitespace": "generous | moderate | compact"
  },
  "design_focus": "视觉差异化 | UX最佳实践 | 质量打磨 | 交互动效",
  "visual_bans": ["Inter/Roboto as primary font", "blue-purple gradient", "identical card grid", "generic AI aesthetic"]
}
```

**设计侧重映射**：

| express_engine | design_focus | 额外锚点约束 |
|----------------|-------------|-------------|
| `visual` | 视觉差异化 | color_direction.primary_hue必须非蓝紫色系；layout_direction.approach必须非card-grid |
| `ux` | UX最佳实践 | typography_direction.style=clean-functional；layout_direction.whitespace=generous |
| `polish` | 质量打磨 | 所有avoid列表扩展为ext-impeccable的完整anti-patterns |
| `motion` | 交互动效 | layout_direction.approach优先选择有动效空间的布局（asymmetric-hero/editorial-flow） |

## 设计方向快选（v7.3 新增）

express 模式的 auto prompt 质量依赖编排器生成的 prompt 精确度。v7.3 在锚点生成后、ext Skill 调用前，新增**设计方向快选**环节：编排器生成 2-3 套差异化设计方向描述，用户快速选择后，编排器基于选中方向生成高质量结构化 prompt。

**为什么需要快选**：
- 单方案 auto 模式下，用户对设计方向零掌控，产出质量随机
- 快选增加 1 个决策点（~1-2分钟），但显著提升设计方向命中率和用户满意度
- 与 full 模式的"设计探索→人类选择"形成对应，express 版本更轻量（方向描述而非完整视觉方向）

```
动作: 设计方向快选
触发条件: mode=express，express_prompt_source=auto，锚点生成后
输入:
  express_design_anchor: 已生成的轻量设计锚点
  prd_text: PRD描述
  品牌规范: 用户提供（可选）
  express_engine: visual/ux/polish/motion
处理流程:
  1. 基于锚点生成2-3套差异化设计方向（每套约100-200字，不生成代码）
  2. 方向之间必须有明显差异（不同色温/不同布局/不同排版风格，至少2个维度不同）
  3. ⏸ 用户快选：选择1套方向，或融合多套方向的特征
  4. 将选中方向回写到express_design_anchor的对应字段
输出: 更新后的express_design_anchor（用户确认的设计方向）
验证: 用户已选择设计方向
模式: 🤖→👤
```

**设计方向描述结构**：

```json
{
  "schemes": [
    {
      "id": "A",
      "name": "方向名称（2-4字，如'暖调有机'）",
      "description": "设计方向描述（100-200字，包含色彩主调+字体组合+布局策略+核心视觉特征）",
      "color_preview": ["主色CSS值", "辅助色CSS值", "背景色CSS值"],
      "layout_hint": "asymmetric-hero | sidebar-main | fullscreen-cta | editorial-flow",
      "typography_hint": "display-dramatic | editorial | clean-functional | geometric",
      "keywords": ["关键词1", "关键词2", "关键词3"]
    }
  ]
}
```

**方向差异化规则**（2-3套方向之间必须满足）：

| 维度 | 差异要求 | 示例 |
|------|---------|------|
| 色温 | 至少2套不同色温 | A=暖调(amber/rose)，B=冷调(teal/slate) |
| 布局 | 至少2套不同布局 | A=asymmetric-hero，B=fullscreen-cta |
| 排版 | 至少2套不同排版风格 | A=display-dramatic，B=clean-functional |
| 张力 | 至少2套不同张力级别 | A=bold，B=balanced |

**引擎对方向的影响**：

| express_engine | 方向生成侧重 | 方向差异维度优先级 |
|----------------|------------|------------------|
| `visual` | 视觉冲击力+差异化 | 色温 > 布局 > 排版 |
| `ux` | 功能性+信息架构 | 布局 > 排版 > 色温 |
| `polish` | 完成度+细节品质 | 排版 > 色温 > 布局 |
| `motion` | 动效空间+交互叙事 | 布局 > 色温 > 排版 |

**用户选择后的处理**：
- 选择单套方向：将该方向的 color_preview/layout_hint/typography_hint 回写到 express_design_anchor
- 融合多套方向：用户指定融合哪些特征（如"A的色温+B的布局"），编排器合并回写
- 跳过快选：用户可直接跳过，使用锚点默认方向（等效于 v7.2 行为）

## 结构化 Prompt 生成（v7.3 新增）

原 auto 模式的 prompt 是简单拼接（PRD + 品牌规范 + 锚点），质量低且缺乏结构。v7.3 升级为**结构化 prompt**，基于用户选中的设计方向 + PRD + 锚点，生成精确、完整、可直接指导 ext Skill 产出的 prompt。

**结构化 Prompt 模板**：

```
Design a {page_type} with these specific requirements:

Register: {register} ({register_explanation})

Aesthetic Direction: {selected_scheme.description}
Primary Color: {color_preview[0]} ({color_name})
Secondary Color: {color_preview[1]}
Background: {color_preview[2]}
Heading Font: {typography_heading} ({typography_style})
Body Font: {typography_body}
Layout: {layout_hint} ({layout_description})

Visual Bans (MUST NOT appear):
{visual_bans_list}

Tension Level: {tension_level}
Design Focus: {design_focus}

Feature Requirements:
{prd_feature_list}

Target Framework: {target_framework}
Target Language: {target_language}

Constraints:
- All colors must use the specified palette, no random colors
- All fonts must match the specified typography direction
- Layout must follow the specified approach
- Must pass WCAG AA contrast (4.5:1 for body text)
- Must be responsive (375px/768px/1024px)
```

**prompt 质量保障规则**：

| 规则 | 说明 |
|------|------|
| 色值具体化 | prompt 中的色彩必须使用具体 CSS 值（oklch/hex），不使用"暖色"等模糊描述 |
| 字体具体化 | prompt 中的字体必须指定具体字体名，不使用"展示型字体"等模糊描述 |
| 布局具体化 | prompt 中的布局必须指定具体布局模式，不使用"有创意的布局"等模糊描述 |
| 禁忌明确化 | visual_bans 逐条列出，不使用"避免AI同质化"等模糊描述 |
| 功能需求结构化 | 从 PRD 提取的功能需求逐条列出，不使用整段 PRD 文本 |
| 锚点一致性 | prompt 中所有设计参数必须与 express_design_anchor（含快选更新）一致 |

**manual 模式 prompt 增强**：

manual 模式下用户自行提供 prompt，但编排器仍将 express_design_anchor 作为设计约束附加到用户 prompt 末尾：

```
{用户提供的prompt}

--- Design Constraints (auto-appended) ---
Register: {register}
Primary Color: {color_preview[0]}
Visual Bans: {visual_bans_list}
Layout Direction: {layout_hint}
```

## 引擎→Skill 映射

| express_engine | 调用的 ext Skill | 输入适配 |
|----------------|-----------------|---------|
| `visual` | ext-frontend-design | design_brief=结构化prompt + register + 品牌规范 + product_positioning + target_language + target_framework + express_design_anchor |
| `ux` | ext-ui-ux-pro-max | query="{product_type} {industry} {style_keywords}" + --domain {landing/dashboard/general} + 结构化prompt + 行业关键词 + project_name + express_design_anchor |
| `polish` | ext-impeccable | Mode B内联上下文：register + 产品名称 + 产品定位 + 品牌规范 + 结构化prompt + 目标语言 + express_design_anchor |
| `motion` | ext-interaction-design | interaction_needs=结构化prompt + register + 交互需求描述 + target_framework + express_design_anchor |

**polish 引擎（ext-impeccable）内联上下文说明**：

express 模式不生成 PRODUCT.md/DESIGN.md，因此必须使用 ext-impeccable 的 Mode B（Inline Context）。编排器需构建以下内联上下文传递给 ext-impeccable：
- `register`：从 PRD 描述中提取的产品核心特征
- 产品名称：从项目信息收集阶段获取（project_name）
- 产品定位：从项目信息收集阶段获取（可选，缺失时从 PRD 推断）
- 品牌规范：从项目信息收集阶段获取（可选，缺失时标注"待品牌规范补充"）
- 当前步骤产出：结构化 prompt（v7.3 升级，替代原 PRD 文本描述）
- 目标语言：从项目信息收集阶段获取（默认 zh-CN）
- `express_design_anchor`：轻量设计锚点（含快选更新后的设计方向）

当品牌规范或产品定位缺失时，编排器应提示用户提供，或从 PRD 文本中自动推断。

## 快速生成流程

```
动作: 快速生成
触发条件: mode=express
输入:
  prd_text: output/pm-design/design-prd/prd.md（可选）或用户直接描述
  品牌规范: 用户提供（可选）
  产品定位: 用户提供（可选）
  target_framework: React/Vue/Svelte/HTML（默认React）
  target_language: 目标语言（默认zh-CN）
  project_dir: 项目根目录
  express_engine: visual/ux/polish/motion（默认visual）
  express_prompt_source: auto/manual（默认auto）
  express_prompt: 用户自行编写或从外部工具获取的prompt（仅manual模式必填）
  express_skip_scheme: true/false（默认false，跳过设计方向快选直接使用锚点默认方向）
处理流程:
  1. 生成轻量设计锚点（express_design_anchor）
  2. 根据 express_prompt_source 决定后续流程：
     - auto:
       a. 若 express_skip_scheme=false：生成2-3套设计方向 → ⏸用户快选 → 更新锚点
       b. 若 express_skip_scheme=true：跳过快选，使用锚点默认方向
       c. 基于选中方向+PRD+锚点生成结构化prompt
       d. 根据 express_engine 选择对应的 ext Skill
       e. 将结构化prompt + express_design_anchor 传给 ext Skill
     - manual:
       a. 编排器提示用户前往推荐的外部工具官网（如 v0.dev/Bolt/Lovable/Cursor/Framer 等）
       b. 用户获取/编写 prompt 后填入 express_prompt
       c. 编排器将用户prompt + express_design_anchor约束附加传给 ext Skill
  3. 调用选定的 ext Skill，直接输出完整页面代码
  4. 将代码写入 {project_dir}/src/
  5. 初始化最小项目脚手架（package.json + 入口文件 + 基础配置）
  6. 执行增强质量检查（见下方）
输出:
  {project_dir}/ — 可运行的项目（含页面代码）
验证: 页面代码已生成 + WCAG AA达标 + 无硬编码密钥 + npm run dev启动成功 + visual_bans合规 + 设计锚点一致性
模式: 🤖→👤→🤖（auto: 生成方向→用户快选→生成代码）/ 🤖→👤→🤖（manual: 提示用户→用户填写prompt→继续执行）
```

## 增强质量检查（v7.2 升级）

原最小质量检查仅 3 项（WCAG AA + 无密钥 + 可运行），不覆盖设计质量。升级为 5 项：

| # | 检查项 | 检查方式 | 不通过处理 |
|---|--------|---------|-----------|
| 1 | WCAG AA 对比度（正文≥4.5:1） | 自动检查 | 自动修复：调整文字颜色至达标 |
| 2 | 无硬编码密钥/token | 自动检查 | 自动移除 |
| 3 | npm run dev 启动成功 | 自动检查 | 自动修复依赖和配置 |
| 4 | **visual_bans 合规** | 检查代码是否包含 express_design_anchor.visual_bans 中的模式 | 自动替换：Inter→DM Sans，蓝紫渐变→锚点主色调渐变，card-grid→锚点布局 |
| 5 | **设计锚点一致性** | 检查色彩/排版是否与 express_design_anchor 方向一致 | 标注偏离项，建议人类确认 |

> **注意**：检查 4 和 5 是轻量设计质量保障，不等于 full 模式的 audit/critique，但能避免"AI同质化"的最差情况。

**manual 模式超时/回退规则**：
- 编排器提示用户前往外部工具后，等待用户填写 `express_prompt`
- 若用户表示无法获取 prompt，编排器提供两个选项：
  1. 切换到 `auto` 模式（编排器自动生成 prompt，含设计方向快选）
  2. 取消 express 模式，切换到 `full` 模式执行完整流程

**express 模式限制**：
- 不生成 design tokens、visual_direction、design_brief.json
- 不经过 ext-impeccable 增强/审计
- 不支持 design_feedback 回传
- 不支持 quality_debt 追踪
- 如需后续 API 集成或生产就绪，需切换到 full 模式重新执行
