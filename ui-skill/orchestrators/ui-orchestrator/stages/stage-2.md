# 阶段 2：设计系统增强

**前提输入**：如果阶段 1 条件分支 B 生成了 constraint_review.json，编排器应将其传递给阶段 2 的 ext Skill 调用，确保 PM 约束评审发现影响设计增强决策（例如，当 constraint_review 标记"组件选择过于严格"时，ext Skill 可以从提供的选项中选择替代方案）。

## ext Skill 调用优先级和冲突解决

ext-ui-ux-pro-max 和 ext-frontend-design 有冲突的设计理念——前者推荐主流模式（数据库匹配），而后者反对 AI 同质化，追求差异化。以下优先级规则解决冲突：

**优先级规则**：ext-frontend-design > ext-ui-ux-pro-max > ext-impeccable

| 冲突场景 | ext-ui-ux-pro-max 推荐 | ext-frontend-design 禁止 | 解决策略 |
|----------|----------------------|------------------------|---------|
| SaaS 配色方案 | `#2563EB`（蓝色） | "蓝紫渐变 + 白色背景" | 采用 ext-frontend-design 的 color_substitutions 作为替代 |
| 排版 | Inter（极简瑞士风） | Inter/Roboto/Arial | 采用 ext-frontend-design 的 font_substitutions 作为替代 |
| 布局 | 标准卡片网格 | "统一的卡片网格布局" | 采用 ext-frontend-design 的 layout_differentiation |
| 效果 | 标准阴影/圆角 | 根据具体的 visual_bans | ext-frontend-design 的 visual_bans 优先 |

**执行顺序**：首先调用 ext-ui-ux-pro-max 获取基线建议，然后调用 ext-frontend-design 进行差异化修正。ext-frontend-design 的输出覆盖 ext-ui-ux-pro-max 的同维度建议。

| # | Skill | 输入 | 输出 | 验证 |
|---|-------|------|------|------|
| 2.1 | ext-ui-ux-pro-max --design-system | query="{product_type} {industry} {style_keywords}"+品牌规范+visual_direction+project_name（阶段 1） | 设计系统建议 | >=3 个配色方案 + 2 个字体组合 |
| 2.2 | ext-impeccable colorize | 色彩系统 + 品牌规范（阶段 1，模式 A：运行 load-context.mjs） | 色彩布局增强 | 色彩增强建议已生成 |
| 2.3 | ext-frontend-design | design_brief=项目需求描述+register+品牌规范+产品定位+visual_direction+design_tokens+target_language+target_framework（阶段 1） | 审美方向评审 | 无 AI 同质化特征 |
| 2.4 | ext-impeccable typeset | 排版系统 + visual_direction（阶段 1，模式 A：运行 load-context.mjs） | 排版层级增强 | 排版增强建议已生成 |

## 强制回写步骤（必须在 2.1-2.4 全部完成后执行）

ext Skills 产生的增强建议必须**强制回写**到 project-init.json，否则阶段 3 的 page-builder 仍将消耗阶段 1 的原始 tokens，导致增强效果失效。

| 回写来源 | 回写目标 | 回写规则 |
|---------|---------|---------|
| ext-ui-ux-pro-max colors[].palette | tokens.colors.brand | 用排名第一的推荐配色方案替换品牌色阶 |
| ext-ui-ux-pro-max typography[].heading/body | tokens.typography.font_families | 用排名第一的推荐字体组合替换标题和正文字体 |
| ext-impeccable colorize | tokens.colors + visual_direction.color_strategy | 将色彩增强建议合并到 tokens；如果更改则同步更新策略 |
| ext-impeccable typeset | tokens.typography | 将排版增强建议合并到排版 tokens（font-size/font-weight/line-height） |
| ext-frontend-design font_substitutions | tokens.typography.font_families | 逐项替换：避免字体 -> 使用替代字体 |
| ext-frontend-design color_substitutions | tokens.colors | 逐项替换：避免颜色 -> 使用替代颜色 |
| ext-frontend-design visual_bans | visual_direction.visual_bans | 追加到视觉禁止列表（不覆盖现有项目） |
| ext-frontend-design aesthetic_direction | visual_direction.aesthetic_direction | 替换审美方向描述 |
| ext-frontend-design layout_differentiation | visual_direction.visual_narrative | 将布局差异化策略追加到视觉叙事 |

回写执行说明：
```
Action: 强制回写 ext 增强结果
输入：
  ext-ui-ux-pro-max 输出：设计系统建议（配色方案 + 字体组合）
  ext-impeccable colorize 输出：色彩增强建议
  ext-impeccable typeset 输出：排版增强建议
  ext-frontend-design 输出：审美方向评审（字体替换 + 颜色替换 + visual_bans + aesthetic_direction + layout_differentiation）
  project-init.json：output/ui-project-init/project-init.json
输出：更新后的 output/ui-project-init/project-init.json + 更新后的 {project_dir}/src/styles/tokens.css + 更新后的 {project_dir}/src/styles/tokens.json + 更新后的 {project_dir}/DESIGN.md
验证：project-init.json 的 tokens 和 visual_direction 包含 ext 增强结果，tokens.css/tokens.json 同步更新，DESIGN.md 同步更新
模式：AI
```

## 回写验证步骤（必须在回写完成后执行）

| # | 验证项 | 验证方法 | 失败处理 |
|---|--------|---------|---------|
| V1 | project-init.json 语法正确 | JSON 解析无错误 | 回退回写，使用原始 tokens |
| V2 | WCAG 对比度仍合规 | 正文文本 >=4.5:1，大文本 >=3:1 | 调整增强后的颜色值直到达标 |
| V3 | tokens.css 和 tokens.json 同步 | 两者包含相同的变量名和值 | 根据 tokens.json 重新生成 tokens.css |
| V4 | 无新的硬编码值 | 增强的 token 值都是变量引用 | 移除硬编码值并替换为变量引用 |
| V5 | visual_direction 语义一致性 | aesthetic_direction 不与 tension_level 矛盾 | 标记矛盾项，[GATE] 需要人工确认 |

## 页面清单预生成（必须在 design_brief 生成前执行）

design_brief.json 中的 layout_instructions/component_specifications/animation_specifications 都包含 page_id 字段，该字段必须与 page_manifest.json 中的 page_id 一致。因此，必须在 design_brief.json 之前生成 page_manifest.json。

```
Action: 页面清单预生成
触发条件：始终执行（在 design_brief 生成前）
输入：
  prd_json：output/pm-design/design-prd/prd.json（可选）
  ia_proposals：output/pm-design/design-ia/ia_proposals.json（可选）
  页面需求：用户提供（string/markdown，无 PM 输入时使用）
流程：
  1. 如果 prd.json 存在：从 pages[] 提取页面清单
  2. 如果 ia_proposals.json 存在：从 routes[] 提取路由清单
  3. 交叉验证两者；不一致时以 prd.json 为权威来源
  4. 如果两者都不存在：从用户页面需求描述中提取，分配 page_id（slug 格式）
  5. 生成 page_manifest.json
输出：output/ui-frontend/page-manifest/page_manifest.json
验证：page_manifest.json 已生成
模式：AI（无 PM 输入 -> AI->Human，页面清单完整性需要人工确认）
```

## 设计概要生成

回写完成后，将所有 ext Skill 输出集成到 `design_brief.json` 中——这是一个可执行的设计规范，直接指导 page-builder 代码生成。模式定义：[schemas/design-brief.json](../schemas/design-brief.json)。

```
Action: 设计概要生成
输入：
  ext-frontend-design 输出：aesthetic_direction/font_substitutions/color_substitutions/layout_differentiation/visual_bans
  ext-ui-ux-pro-max 输出：设计系统建议（配色方案/字体组合/效果/反模式）
  ext-impeccable colorize 输出：色彩增强建议
  ext-impeccable typeset 输出：排版增强建议
  project-init.json：visual_direction + tokens（增强版）
  品牌规范：用户提供
输出：output/ui-frontend/design-brief/design_brief.json
模式：AI
```

[GATE] 设计系统增强结果需要人工确认（包括回写后的最终 tokens 和视觉方向）
