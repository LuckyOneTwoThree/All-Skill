# 阶段-E：快速生成（仅快速模式）

仅在 `mode=express` 时执行。根据 `express_engine` 参数选择对应的 ext Skill，直接读取 PRD 和品牌规范，一步生成完整页面代码，跳过完整的设计系统建立、token 生成和增强-审计周期。

## 轻量级设计锚点（v7.2 新增）

快速模式跳过阶段 1 的完整设计系统建立，但**不能完全跳过设计约束**——无约束的 ext 调用会产生随机且不可控的质量。因此，在 ext Skill 调用之前，编排器生成一个轻量级设计锚点（express_design_anchor），为 ext Skill 提供最小的设计方向指导。

```
Action: 生成轻量级设计锚点
触发条件：mode=express，在 ext Skill 调用前
输入：
  prd_text：PRD 描述
  品牌规范：用户提供（可选）
  产品定位：用户提供（可选）
  express_engine：visual/ux/polish/motion
流程：
  1. 从 PRD 推断 register（品牌/产品）
  2. 从 PRD + 品牌规范推断色彩方向（暖/冷/中性 + 主色调）
  3. 从 PRD 推断排版方向（展示/功能性）
  4. 从 express_engine 推断设计重点（见下表）
  5. 生成 express_design_anchor（内联 JSON，不写入文件）
输出：express_design_anchor（传递给 ext Skill 的 inline_context 参数）
验证：锚点包含 register + color_direction + typography_direction + design_focus
模式：AI
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
  "design_focus": "Visual differentiation | UX best practices | Quality polish | Interaction animation",
  "visual_bans": ["Inter/Roboto as primary font", "blue-purple gradient", "identical card grid", "generic AI aesthetic"]
}
```

**设计重点映射**：

| express_engine | design_focus | 额外锚点约束 |
|----------------|-------------|-------------|
| `visual` | 视觉差异化 | color_direction.primary_hue 不得为蓝紫；layout_direction.approach 不得为 card-grid |
| `ux` | UX 最佳实践 | typography_direction.style=clean-functional；layout_direction.whitespace=generous |
| `polish` | 质量打磨 | 所有避免列表扩展为 ext-impeccable 的完整反模式 |
| `motion` | 交互动画 | layout_direction.approach 优先考虑有动画空间的布局（asymmetric-hero/editorial-flow） |

## 设计方向快速选择（v7.3 新增）

快速模式自动提示的质量取决于编排器生成提示的精度。v7.3 在锚点生成后、ext Skill 调用前添加了**设计方向快速选择**步骤：编排器生成 2-3 个差异化的设计方向描述，用户快速选择一个，编排器根据选择的方向生成高质量的结构化提示。

**为什么需要快速选择**：
- 在单方案自动模式下，用户对设计方向零控制，输出质量随机
- 快速选择增加 1 个决策点（约 1-2 分钟），但显著提高设计方向命中率和用户满意度
- 对应完整模式的"设计探索 -> 人工选择"流程，快速版本更轻量（方向描述而非完整视觉方向）

```
Action: 设计方向快速选择
触发条件：mode=express，express_prompt_source=auto，在锚点生成后
输入：
  express_design_anchor：生成的轻量级设计锚点
  prd_text：PRD 描述
  品牌规范：用户提供（可选）
  express_engine：visual/ux/polish/motion
流程：
  1. 根据锚点生成 2-3 个差异化的设计方向（每个约 100-200 字，不生成代码）
  2. 方向必须有明显差异（不同色温/不同布局/不同排版风格，至少 2 个维度不同）
  3. [GATE] 用户快速选择：选择 1 个方向，或从多个方向合并特性
  4. 将选择的方向回写到 express_design_anchor 的对应字段
输出：更新后的 express_design_anchor（用户确认的设计方向）
验证：用户已选择一个设计方向
模式：AI->Human
```

**设计方向描述结构**：

```json
{
  "schemes": [
    {
      "id": "A",
      "name": "方向名称（2-4 字，例如'温暖有机'）",
      "description": "设计方向描述（100-200 字，包括色彩主题 + 字体组合 + 布局策略 + 核心视觉特征）",
      "color_preview": ["主色 CSS 值", "辅色 CSS 值", "背景色 CSS 值"],
      "layout_hint": "asymmetric-hero | sidebar-main | fullscreen-cta | editorial-flow",
      "typography_hint": "display-dramatic | editorial | clean-functional | geometric",
      "keywords": ["关键词 1", "关键词 2", "关键词 3"]
    }
  ]
}
```

**方向差异化规则**（2-3 个方向之间必须满足）：

| 维度 | 差异化要求 | 示例 |
|------|---------|------|
| 色温 | 至少 2 个方向色温不同 | A=暖（琥珀/玫瑰），B=冷（青蓝/石板） |
| 布局 | 至少 2 个方向布局不同 | A=asymmetric-hero，B=fullscreen-cta |
| 排版 | 至少 2 个方向排版风格不同 | A=display-dramatic，B=clean-functional |
| 张力 | 至少 2 个方向张力水平不同 | A=大胆，B=平衡 |

**引擎对方向的影响**：

| express_engine | 方向生成重点 | 方向差异化维度优先级 |
|----------------|------------|------------------|
| `visual` | 视觉冲击力 + 差异化 | 色温 > 布局 > 排版 |
| `ux` | 功能性 + 信息架构 | 布局 > 排版 > 色温 |
| `polish` | 完整性 + 细节质量 | 排版 > 色温 > 布局 |
| `motion` | 动画空间 + 交互叙事 | 布局 > 色温 > 排版 |

**选择后处理**：
- 选择单个方向：将该方向的 color_preview/layout_hint/typography_hint 回写到 express_design_anchor
- 合并多个方向：用户指定要合并哪些特性（例如，"A 的色温 + B 的布局"），编排器合并并回写
- 跳过快速选择：用户可以直接跳过，使用锚点的默认方向（等同于 v7.2 行为）

## 结构化提示生成（v7.3 新增）

原自动模式提示是简单的拼接（PRD + 品牌规范 + 锚点），质量低且缺乏结构。v7.3 升级为**结构化提示**，基于用户选择的设计方向 + PRD + 锚点，生成精确、完整的提示，直接指导 ext Skill 输出。

**结构化提示模板**：

```
设计一个 {page_type}，具备以下具体要求：

Register：{register}（{register_explanation}）

审美方向：{selected_scheme.description}
主色：{color_preview[0]}（{color_name}）
辅色：{color_preview[1]}
背景：{color_preview[2]}
标题字体：{typography_heading}（{typography_style}）
正文字体：{typography_body}
布局：{layout_hint}（{layout_description}）

视觉禁止（不得出现）：
{visual_bans_list}

张力水平：{tension_level}
设计重点：{design_focus}

功能需求：
{prd_feature_list}

目标框架：{target_framework}
目标语言：{target_language}

约束：
- 所有颜色必须使用指定的调色板，无随机颜色
- 所有字体必须匹配指定的排版方向
- 布局必须遵循指定的方式
- 必须通过 WCAG AA 对比度（正文文本 4.5:1）
- 必须响应式（375px/768px/1024px）
```

**提示质量保证规则**：

| 规则 | 描述 |
|------|------|
| 颜色值具体化 | 提示中的颜色必须使用具体的 CSS 值（oklch/hex），而非模糊描述如"暖色" |
| 字体具体化 | 提示中的字体必须指定具体的字体名称，而非模糊描述如"展示字体" |
| 布局具体化 | 提示中的布局必须指定具体的布局模式，而非模糊描述如"创意布局" |
| 禁止项明确化 | visual_bans 逐项列出，而非模糊描述如"避免 AI 同质化" |
| 功能需求结构化 | 从 PRD 中提取的功能需求逐项列出，不使用整个 PRD 文本块 |
| 锚点一致性 | 提示中的所有设计参数必须与 express_design_anchor 一致（包括快速选择更新） |

**手动模式提示增强**：

在手动模式下，用户提供自己的提示，但编排器仍将 express_design_anchor 作为设计约束追加到用户提示的末尾：

```
{用户提供的提示}

--- 设计约束（自动追加）---
Register：{register}
主色：{color_preview[0]}
视觉禁止：{visual_bans_list}
布局方向：{layout_hint}
```

## 引擎->Skill 映射

| express_engine | 调用的 ext Skill | 输入适配 |
|----------------|-----------------|---------|
| `visual` | ext-frontend-design | design_brief=结构化提示 + register + 品牌规范 + product_positioning + target_language + target_framework + express_design_anchor |
| `ux` | ext-ui-ux-pro-max | query="{product_type} {industry} {style_keywords}" + --domain {landing/dashboard/general} + 结构化提示 + 行业关键词 + project_name + express_design_anchor |
| `polish` | ext-impeccable | 模式 B 内联上下文：register + 产品名称 + 产品定位 + 品牌规范 + 结构化提示 + 目标语言 + express_design_anchor |
| `motion` | ext-interaction-design | interaction_needs=结构化提示 + register + 交互需求描述 + target_framework + express_design_anchor |

**Polish 引擎（ext-impeccable）内联上下文说明**：

快速模式不生成 PRODUCT.md/DESIGN.md，因此必须使用 ext-impeccable 的模式 B（内联上下文）。编排器必须构建以下内联上下文传递给 ext-impeccable：
- `register`：从 PRD 描述中提取的产品核心特征
- 产品名称：从项目信息收集阶段获取（project_name）
- 产品定位：从项目信息收集阶段获取（可选，缺失时从 PRD 推断）
- 品牌规范：从项目信息收集阶段获取（可选，缺失时标记为"待品牌规范补充"）
- 当前步骤输出：结构化提示（v7.3 升级，替换原 PRD 文本描述）
- 目标语言：从项目信息收集阶段获取（默认 zh-CN）
- `express_design_anchor`：轻量级设计锚点（包括快速选择更新后的设计方向）

当品牌规范或产品定位缺失时，编排器应提示用户提供，或从 PRD 文本自动推断。

## 快速生成流程

```
Action: 快速生成
触发条件：mode=express
输入：
  prd_text：output/pm-design/design-prd/prd.md（可选）或用户直接描述
  品牌规范：用户提供（可选）
  产品定位：用户提供（可选）
  target_framework：React/Vue/Svelte/HTML（默认 React）
  target_language：目标语言（默认 zh-CN）
  project_dir：项目根目录
  express_engine：visual/ux/polish/motion（默认 visual）
  express_prompt_source：auto/manual（默认 auto）
  express_prompt：用户编写或外部来源的提示（仅手动模式需要）
  express_skip_scheme：true/false（默认 false，跳过设计方向快速选择，使用锚点默认方向）
流程：
  1. 生成轻量级设计锚点（express_design_anchor）
  2. 根据 express_prompt_source 确定后续流程：
     - auto：
       a. 如果 express_skip_scheme=false：生成 2-3 个设计方向 -> [GATE] 用户快速选择 -> 更新锚点
       b. 如果 express_skip_scheme=true：跳过快速选择，使用锚点默认方向
       c. 根据选择的方向 + PRD + 锚点生成结构化提示
       d. 根据 express_engine 选择对应的 ext Skill
       e. 将结构化提示 + express_design_anchor 传递给 ext Skill
     - manual：
       a. 编排器提示用户访问推荐的外部工具网站（例如 v0.dev/Bolt/Lovable/Cursor/Framer 等）
       b. 用户获取/编写提示并填入 express_prompt
       c. 编排器将用户提示 + express_design_anchor 约束传递给 ext Skill
  3. 调用选择的 ext Skill，直接输出完整页面代码
  4. 将代码写入 {project_dir}/src/
  5. 初始化最小化项目脚手架（package.json + 入口文件 + 基础配置）
  6. 执行增强质量检查（见下文）
输出：
  {project_dir}/ -- 可运行项目（包括页面代码）
验证：页面代码已生成 + WCAG AA 合规 + 无硬编码密钥 + npm run dev 启动成功 + visual_bans 合规 + 设计锚点一致
模式：AI->Human->AI（auto：生成方向 -> 用户快速选择 -> 生成代码）/ AI->Human->AI（manual：提示用户 -> 用户填写提示 -> 继续执行）
```

## 增强质量检查（v7.2 升级）

原最小化质量检查只有 3 项（WCAG AA + 无密钥 + 可运行），未覆盖设计质量。升级为 5 项：

| # | 检查项 | 检查方法 | 失败处理 |
|---|--------|---------|-----------|
| 1 | WCAG AA 对比度（正文文本 >=4.5:1） | 自动检查 | 自动修复：调整文本颜色直到达标 |
| 2 | 无硬编码密钥/tokens | 自动检查 | 自动移除 |
| 3 | npm run dev 启动成功 | 自动检查 | 自动修复依赖和配置 |
| 4 | **visual_bans 合规性** | 检查代码是否包含 express_design_anchor.visual_bans 中的模式 | 自动替换：Inter->DM Sans，蓝紫渐变->锚点主色调渐变，card-grid->锚点布局 |
| 5 | **设计锚点一致性** | 检查颜色/排版是否与 express_design_anchor 方向一致 | 标记偏差，建议人工确认 |

> **注意**：检查 4 和 5 是轻量级设计质量保证，不等同于完整模式的 audit/critique，但可以防止"AI 同质化"的最坏情况。

**手动模式超时/回退规则**：
- 编排器提示用户访问外部工具后，等待用户填写 `express_prompt`
- 如果用户表示无法获取提示，编排器提供两个选项：
  1. 切换到 `auto` 模式（编排器自动生成提示，包括设计方向快速选择）
  2. 取消快速模式，切换到 `full` 模式执行完整流程

**快速模式限制**：
- 不生成设计 tokens、visual_direction、design_brief.json
- 不经过 ext-impeccable 增强/审计
- 不支持 design_feedback 传播
- 不支持 quality_debt 追踪
- 如果需要后续 API 集成或生产就绪，必须切换到完整模式重新执行
