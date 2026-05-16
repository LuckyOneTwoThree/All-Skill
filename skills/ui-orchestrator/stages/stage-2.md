# Stage 2: 设计系统增强

**前置输入**：若 stage-1 条件分支B生成了 constraint_review.json，编排器应将其传递给 stage-2 的 ext Skill 调用，确保 PM 约束审查的 findings 影响设计增强决策（如 constraint_review 标注"组件选型过度约束"时，ext Skill 可选择 alternatives 中的备选方案）。

## ext Skill 调用优先级与冲突消解

ext-ui-ux-pro-max 与 ext-frontend-design 存在设计哲学矛盾——前者推荐主流模式（数据库匹配），后者反对 AI 同质化追求差异化。以下优先级规则消解冲突：

**优先级规则**：ext-frontend-design > ext-ui-ux-pro-max > ext-impeccable

| 冲突场景 | ext-ui-ux-pro-max 推荐 | ext-frontend-design 禁止 | 消解策略 |
|----------|----------------------|------------------------|---------|
| SaaS配色 | `#2563EB`（蓝色） | "蓝紫渐变+白底" | 采纳ext-frontend-design的color_substitutions替代 |
| 字体 | Inter（Minimal Swiss） | Inter/Roboto/Arial | 采纳ext-frontend-design的font_substitutions替代 |
| 布局 | 标准卡片网格 | "均匀卡片网格布局" | 采纳ext-frontend-design的layout_differentiation |
| 效果 | 标准阴影/圆角 | 视具体visual_bans | ext-frontend-design的visual_bans优先 |

**执行顺序**：先调用 ext-ui-ux-pro-max 获取基线推荐，再调用 ext-frontend-design 进行差异化修正。ext-frontend-design 的输出覆盖 ext-ui-ux-pro-max 的同维度推荐。

| # | Skill | 输入 | 输出 | 验证 |
|---|-------|------|------|------|
| 2.1 | ext-ui-ux-pro-max --design-system | query="{product_type} {industry} {style_keywords}"+品牌规范+visual_direction+project_name (stage-1) | 设计系统推荐 | ≥3色彩方案+2字体配对 |
| 2.2 | ext-impeccable colorize | 色彩体系+品牌规范 (stage-1，Mode A: 运行load-context.mjs) | 色彩布局增强 | 色彩增强建议已生成 |
| 2.3 | ext-frontend-design | design_brief=项目需求描述+register+品牌规范+产品定位+visual_direction+design_tokens+target_language+target_framework (stage-1) | 美学方向审视 | 不含AI同质化特征 |
| 2.4 | ext-impeccable typeset | 排版体系+visual_direction (stage-1，Mode A: 运行load-context.mjs) | 排版层级增强 | 排版增强建议已生成 |

## 强制回写步骤（2.1-2.4全部完成后必须执行）

ext Skill 产出的增强建议必须**强制回写**到 project-init.json，否则 stage-3 的 page-builder 仍消费 stage-1 的原始令牌，增强效果断裂。

| 回写来源 | 回写目标 | 回写规则 |
|---------|---------|---------|
| ext-ui-ux-pro-max colors[].palette | tokens.colors.brand | 取推荐排名第1的色彩方案替换品牌色色阶 |
| ext-ui-ux-pro-max typography[].heading/body | tokens.typography.font_families | 取推荐排名第1的字体配对替换标题和正文字体 |
| ext-impeccable colorize | tokens.colors + visual_direction.color_strategy | 色彩增强建议合并到令牌，策略有变更时同步更新 |
| ext-impeccable typeset | tokens.typography | 排版增强建议合并到排版令牌（字号/字重/行高） |
| ext-frontend-design font_substitutions | tokens.typography.font_families | 逐项替换：avoid字体→use_instead字体 |
| ext-frontend-design color_substitutions | tokens.colors | 逐项替换：avoid配色→use_instead配色 |
| ext-frontend-design visual_bans | visual_direction.visual_bans | 追加到视觉禁忌列表（不覆盖原有项） |
| ext-frontend-design aesthetic_direction | visual_direction.aesthetic_direction | 替换美学方向描述 |
| ext-frontend-design layout_differentiation | visual_direction.visual_narrative | 追加布局差异化策略到视觉叙事 |

回写执行指令：
```
动作: ext增强结果强制回写
输入:
  ext-ui-ux-pro-max输出: 设计系统推荐（色彩方案+字体配对）
  ext-impeccable colorize输出: 色彩增强建议
  ext-impeccable typeset输出: 排版增强建议
  ext-frontend-design输出: 美学方向审视（字体替换+配色替换+visual_bans+aesthetic_direction+layout_differentiation）
  project-init.json: output/ui-project-init/project-init.json
输出: 更新后的 output/ui-project-init/project-init.json + 更新后的 {project_dir}/src/styles/tokens.css + 更新后的 {project_dir}/src/styles/tokens.json + 更新后的 {project_dir}/DESIGN.md
验证: project-init.json的tokens和visual_direction已包含ext增强结果，tokens.css/tokens.json已同步更新，DESIGN.md已同步更新
模式: 🤖
```

## 回写验证步骤（回写完成后必须执行）

| # | 验证项 | 验证方式 | 失败处理 |
|---|--------|---------|---------|
| V1 | project-init.json 语法正确 | JSON解析无报错 | 回滚回写，使用原始令牌 |
| V2 | WCAG对比度仍达标 | 正文≥4.5:1，大文本≥3:1 | 调整增强后的色值直至达标 |
| V3 | tokens.css 与 tokens.json 同步 | 两者包含相同的变量名和值 | 以tokens.json为准重新生成tokens.css |
| V4 | 无新增硬编码值 | 增强后的令牌值均为变量引用 | 移除硬编码值替换为变量引用 |
| V5 | visual_direction 语义一致性 | aesthetic_direction与tension_level不矛盾 | 标注矛盾项，⏸人类确认 |

## 页面清单预生成（design_brief 生成前必须执行）

design_brief.json 的 layout_instructions/component_specifications/animation_specifications 均包含 page_id 字段，必须与 page_manifest.json 的 page_id 一致。因此 page_manifest.json 必须在 design_brief.json 之前生成。

```
动作: 页面清单预生成
触发条件: 始终执行（design_brief生成前）
输入:
  prd_json: output/pm-design/design-prd/prd.json（可选）
  ia_proposals: output/pm-design/design-ia/ia_proposals.json（可选）
  页面需求: 用户提供（string/markdown，无PM输入时使用）
处理流程:
  1. 若 prd.json 存在：从 pages[] 提取页面清单
  2. 若 ia_proposals.json 存在：从 routes[] 提取路由清单
  3. 两者交叉校验，不一致时以 prd.json 为准
  4. 若两者均不存在：从用户页面需求描述中提取，分配 page_id（slug格式）
  5. 生成 page_manifest.json
输出: output/ui-frontend/page-manifest/page_manifest.json
验证: page_manifest.json 已生成
模式: 🤖（无PM输入时→🤖→👤，需人类确认页面清单完整性）
```

## 设计简报生成

回写完成后，将所有 ext Skill 的输出整合为 `design_brief.json`——一份可直接指导 page-builder 代码生成的可执行设计规范。Schema 定义见 [schemas/design-brief.json](../schemas/design-brief.json)。

```
动作: 设计简报生成
输入:
  ext-frontend-design输出: aesthetic_direction/font_substitutions/color_substitutions/layout_differentiation/visual_bans
  ext-ui-ux-pro-max输出: 设计系统推荐（色彩方案/字体配对/效果/反模式）
  ext-impeccable colorize输出: 色彩增强建议
  ext-impeccable typeset输出: 排版增强建议
  project-init.json: visual_direction + tokens（增强后版本）
  品牌规范: 用户提供
输出: output/ui-frontend/design-brief/design_brief.json
模式: 🤖
```

⏸ 人类确认设计系统增强结果（含回写后的最终令牌和视觉方向）
