# 阶段-P：原型输出（仅原型模式）

仅在 `mode=prototype` 时执行。项目初始化完成后，输出视觉方向和约束评审结果，不生成页面代码。

```
Action: 原型输出
触发条件：mode=prototype
输入：
  visual_direction：output/ui-project-init/project-init.json -> visual_direction
  tokens：output/ui-project-init/project-init.json -> tokens
  component_library：output/ui-project-init/project-init.json -> component_library
  constraint_review：output/ui-frontend/constraint-review/constraint_review.json（可选）
  design_explorations：output/ui-frontend/design-exploration/design_explorations.json（可选）
流程：
  1. 从 project-init 输出汇总视觉方向、设计 tokens 和组件库选择
  2. 如果约束评审结果存在，包含在原型报告中
  3. 如果设计探索结果存在，包含在原型报告中
  4. 执行原型评审（5维度评分），将评分结果写入原型报告
  5. 生成原型报告（包括视觉方向摘要、关键页面布局描述、组件选择摘要、评审评分表）
  6. 不生成页面代码，不调用 ext Skill，不生成 design_brief
输出：
  output/ui-frontend/prototype/prototype-report.md -- 原型报告
  output/ui-frontend/prototype/prototype-review.json -- 原型评审评分
  output/ui-project-init/ -- 设计系统输出（已由阶段 1 生成）
验证：prototype-report.md 已生成 + visual_direction 10 维度定义完整 + prototype-review.json 已生成
模式：AI
```

**原型模式权衡**：
- [OK] 获得：快速验证设计方向、低成本多方案比较、交互逻辑对齐
- [X] 放弃：页面代码、ext 增强、质量审计、API 集成、生产就绪

**原型模式输出**：
- 原型报告（markdown）：视觉方向摘要 + 关键页面布局描述 + 组件选择摘要 + 评审评分表
- 原型评审评分（JSON）：5维度评分 + 综合评分 + 风险标记
- 设计系统输出（project-init.json）：视觉方向 + 设计 tokens + 组件库
- 无页面代码，无 design_brief，无 quality_debt

**与完整模式的关联**：
- 原型完成后，用户确认视觉方向和组件选择
- 切换到完整模式时，从阶段 2 开始执行（跳过阶段 1，复用现有 project-init 输出）
- 必须在项目信息收集期间保留 project_dir，以确保完整模式能够定位现有输出
- 原型评审中低评分维度（<=2）应作为完整模式阶段 2 的优先关注点注入

## 原型评审标准

原型模式虽不生成页面代码，但必须对视觉方向和组件选型进行结构化评审，确保设计方向在进入完整模式前已通过基本质量检查。

**5维度评分体系**（每个维度 1-5 分）：

| 维度 | 评估内容 | 1分 | 3分 | 5分 | 评审依据 |
|------|---------|-----|-----|-----|---------|
| 品牌一致性 | 视觉方向是否符合品牌规范 | 与品牌调性严重冲突 | 基本符合品牌调性，局部可优化 | 完全契合品牌基因，视觉语言统一 | mood_keywords + aesthetic_direction 是否与品牌定位匹配 |
| 色彩和谐度 | 色阶搭配是否和谐 | 色彩冲突明显，无层次 | 色彩基本和谐，层次可加强 | 色阶丰富且和谐，层次分明 | color_strategy + tokens 色阶梯度是否合理 |
| 排版层级 | 字号层级是否清晰 | 层级模糊，无法区分主次 | 层级基本清晰，对比度可加强 | 层级分明，对比度强，节奏感好 | typography_strategy + type_scale 是否定义清晰 |
| 组件适配性 | 组件库选择是否适合业务场景 | 组件库与业务场景严重不匹配 | 基本适配，部分组件需替换 | 组件库完全适配，覆盖核心场景 | component_library 选型 + constraint_review 评估 |
| 差异化程度 | 视觉方向是否具有辨识度 | 完全同质化，无辨识度 | 有一定差异化，但不够突出 | 差异化鲜明，具有强辨识度 | tension_level + visual_bans + reference_style 综合评估 |

**综合评分计算**：

`prototype_score = (品牌一致性 + 色彩和谐度 + 排版层级 + 组件适配性 + 差异化程度) / 5`

**评分阈值与处理**：

| 评分范围 | 等级 | 处理方式 |
|----------|------|---------|
| 4.0-5.0 | 优秀 | 通过门禁，可直接进入完整模式 |
| 3.0-3.9 | 合格 | 通过门禁，低评分维度需在完整模式阶段 2 中优先关注 |
| 2.0-2.9 | 待改进 | [GATE] 需人工确认是否调整视觉方向后重新评审 |
| 1.0-1.9 | 不合格 | [GATE] 必须回退到阶段 1 重新定义视觉方向 |

**低评分维度标记规则**：

| 条件 | 标记 | 后续处理 |
|------|------|---------|
| 单维度 <=2 | 标记为"需优先增强" | 注入完整模式阶段 2 的 ext 调用输入 |
| 2个及以上维度 <=2 | 标记为"方向风险" | [GATE] 人工确认是否调整视觉方向 |
| 品牌一致性 <=2 | 标记为"品牌偏离" | 必须回退阶段 1 重新对齐品牌基因 |

**低评分维度与完整模式阶段 2 的关联**：

| 低评分维度 | 完整模式阶段 2 优先 ext 调用 | 修复方向 |
|-----------|---------------------------|---------|
| 品牌一致性 <=2 | ext-frontend-design | 重新对齐品牌调性和视觉语言 |
| 色彩和谐度 <=2 | ext-impeccable colorize | 优化色彩搭配和层次 |
| 排版层级 <=2 | ext-impeccable typeset | 改善字号层级和节奏 |
| 组件适配性 <=2 | ext-ui-ux-pro-max | 重新评估组件选型 |
| 差异化程度 <=2 | ext-frontend-design + ext-impeccable bolder | 增强视觉差异化 |

## 原型报告模板

prototype-report.md 必须遵循以下标准结构，确保信息完整且可被下游阶段消耗。

```markdown
# 原型报告：{project_name}

## 1. 项目概述

- **项目名称**：{project_name}
- **生成时间**：{generated_at}
- **模式**：prototype
- **框架**：{framework}
- **组件库**：{component_library.name}

## 2. 视觉方向摘要

### 2.1 核心风格
- **美学方向**：{aesthetic_direction}
- **视觉策略**：{visual_policy}
- **张力级别**：{tension_level}

### 2.2 色彩体系
- **色彩策略**：{color_strategy}
- **主题决策**：{theme_decision}
- **品牌色使用**：{brand_color_usage}

### 2.3 排版体系
- **排版策略**：{typography_strategy}
- **字号对比度**：{type_scale}

### 2.4 空间与节奏
- **空间策略**：{spatial_strategy}
- **间距节奏**：{spacing_rhythm}
- **网格密度**：{grid_density}

### 2.5 视觉锚点
- **圆角级别**：{border_radius_level}
- **阴影风格**：{shadow_style}
- **动效风格**：{motion_style}
- **图片处理**：{image_treatment}

### 2.6 情绪与叙事
- **情绪关键词**：{mood_keywords}
- **参考风格**：{reference_style}
- **视觉叙事**：{visual_narrative}

### 2.7 约束与禁忌
- **视觉禁忌**：{visual_bans}
- **差异化方向**：{differentiation_direction}

## 3. 关键页面布局描述

### 页面 1：{page_name}（{route}）
- **布局描述**：{layout_description}
- **视觉焦点**：{visual_focus}
- **关键组件**：{key_components}

### 页面 2：{page_name}（{route}）
- **布局描述**：{layout_description}
- **视觉焦点**：{visual_focus}
- **关键组件**：{key_components}

### 页面 3：{page_name}（{route}）
- **布局描述**：{layout_description}
- **视觉焦点**：{visual_focus}
- **关键组件**：{key_components}

> 至少包含 3 个核心页面的布局描述。

## 4. 组件选择摘要与适配性评估

| 组件 | 类型 | 选型理由 | 备选方案 | 适配性评估 |
|------|------|---------|---------|-----------|
| {component} | {type} | {rationale} | {alternatives} | 高/中/低 |

## 5. 评审评分表

| 维度 | 评分(1-5) | 评审依据 | 风险标记 |
|------|----------|---------|---------|
| 品牌一致性 | {score} | {rationale} | {risk_flag} |
| 色彩和谐度 | {score} | {rationale} | {risk_flag} |
| 排版层级 | {score} | {rationale} | {risk_flag} |
| 组件适配性 | {score} | {rationale} | {risk_flag} |
| 差异化程度 | {score} | {rationale} | {risk_flag} |
| **综合评分** | **{prototype_score}** | | |

## 6. 约束审查要点（如有）

| 维度 | 评估 | 发现 |
|------|------|------|
| {dimension} | {assessment} | {finding} |

> 仅当 constraint_review.json 存在时包含此节。

## 7. 风险与建议

### 风险项
- {risk_item}

### 建议
- {recommendation}

### 后续步骤
- 确认视觉方向后切换 full 模式从 stage-2 开始
- 优先关注维度：{low_score_dimensions}
```

## 交付物清单

原型模式必须交付以下文件，缺一不可：

| # | 交付物 | 路径 | 格式 | 必需 | 说明 |
|---|--------|------|------|------|------|
| 1 | 原型报告 | output/ui-frontend/prototype/prototype-report.md | Markdown | 是 | 视觉方向摘要 + 页面布局 + 组件选型 + 评审评分 |
| 2 | 原型评审评分 | output/ui-frontend/prototype/prototype-review.json | JSON | 是 | 5维度评分 + 综合评分 + 风险标记 |
| 3 | 设计系统输出 | output/ui-project-init/project-init.json | JSON | 是 | visual_direction + tokens + component_library（阶段 1 已生成） |
| 4 | 项目脚手架 | {project_dir}/ | 目录 | 是 | 可运行的项目骨架（阶段 1 已生成） |
| 5 | 令牌文件 | {project_dir}/src/styles/tokens.css + tokens.json | CSS/JSON | 是 | 设计令牌（阶段 1 已生成） |
| 6 | 上下文文件 | {project_dir}/PRODUCT.md + DESIGN.md | Markdown | 是 | 产品定义 + 设计决策（阶段 1 已生成） |

**交付物验证规则**：

| 验证项 | 条件 | 失败处理 |
|--------|------|---------|
| prototype-report.md 存在 | 文件非空且包含全部 7 个章节 | 重新生成报告 |
| prototype-review.json 存在 | 5个维度均有评分值 | 重新执行评审 |
| visual_direction 10 维度完整 | 每个字段非空且非占位符（TBD/待定） | 回退阶段 1 补全 |
| 关键页面 >=3 个 | key_pages 数组长度 >=3 | 补充页面布局描述 |
| 组件选型非空 | component_selection_summary 数组长度 >=1 | 补充组件选型 |

## 降级策略

当原型模式的可选输入缺失时，按以下策略降级处理，确保原型报告仍可生成：

### 约束评审结果缺失

| 条件 | 降级方式 | 影响 |
|------|---------|------|
| constraint_review.json 不存在 | 原型报告省略"约束审查要点"章节 | 不影响评审评分，组件适配性维度仅基于 visual_direction 评估 |
| constraint_review.json 存在但 findings 为空 | 包含"约束审查要点"章节，标注"无关键发现" | 无影响 |

### 设计探索结果缺失

| 条件 | 降级方式 | 影响 |
|------|---------|------|
| design_explorations.json 不存在 | 差异化程度维度仅基于 tension_level + visual_bans 评估 | 评分可能偏低，需人工确认 |
| design_explorations.json 存在但无选中方案 | 使用默认 visual_direction 评估 | 差异化程度维度标注"未经验证" |

### visual_direction 维度不完整

| 条件 | 降级方式 | 影响 |
|------|---------|------|
| 核心维度缺失（aesthetic_direction/color_strategy/typography_strategy） | [GATE] 必须回退阶段 1 补全 | 原型报告无法生成 |
| 锚点维度缺失（border_radius_level/shadow_style 等） | 使用框架/组件库默认值填充，标注"默认值" | 评审评分中对应维度标注"降级评估" |
| mood_keywords/visual_narrative 缺失 | 原型报告对应章节标注"未定义" | 品牌一致性和差异化程度维度评分可能偏低 |

### 降级评分计算

当存在降级评估的维度时，综合评分计算方式调整：

| 降级维度数量 | 计算方式 | 说明 |
|-------------|---------|------|
| 0 | 标准平均 | 所有维度正常评分 |
| 1-2 | 标准平均 + 降级标记 | 评分正常计算，报告标注降级维度 |
| >=3 | 降级评分 = 标准平均 x 0.8 | 多维度降级时评分打折，[GATE] 需人工确认 |

降级信息必须记录在 prototype-review.json 的 `degradation` 字段中：

```json
{
  "degraded_dimensions": ["差异化程度"],
  "degradation_reason": "design_explorations.json 不存在",
  "score_adjusted": true,
  "original_score": 3.4,
  "adjusted_score": 2.7
}
```

## 门禁规则

原型输出必须通过以下门禁才能标记为完成：

### 自动门禁（AI 验证）

| # | 门禁条件 | 验证方式 | 失败处理 |
|---|---------|---------|---------|
| G1 | prototype-report.md 已生成且包含全部 7 个章节 | 文件存在性 + 章节完整性检查 | 重新生成报告 |
| G2 | prototype-review.json 已生成且 5 维度均有评分 | JSON 解析 + 字段完整性检查 | 重新执行评审 |
| G3 | visual_direction 10 维度定义完整 | 每个字段非空且非占位符 | 回退阶段 1 补全 |
| G4 | 关键页面布局描述 >=3 个 | key_pages 数组长度检查 | 补充页面布局描述 |
| G5 | 综合评分 >=2.0 | prototype_score 阈值检查 | 评分 <2.0 必须回退阶段 1 |

### 人工门禁（Human 确认）

| # | 门禁条件 | 触发条件 | 确认内容 |
|---|---------|---------|---------|
| H1 | 视觉方向确认 | 始终执行 | 人工确认视觉方向和组件选择是否符合预期 |
| H2 | 低评分维度确认 | 任意维度 <=2 | 人工确认是否调整视觉方向或接受风险 |
| H3 | 方向风险确认 | 2个及以上维度 <=2 | 人工决定调整视觉方向或继续进入完整模式 |
| H4 | 降级确认 | 降级维度 >=3 | 人工确认降级评分是否可接受 |
| H5 | 品牌偏离确认 | 品牌一致性 <=2 | 人工决定回退阶段 1 或接受偏离 |

### 门禁通过标准

| 条件 | 结果 |
|------|------|
| G1-G5 全部通过 + H1 人工确认 + 无 H2-H5 触发 | **通过**：原型完成，可进入完整模式 |
| G1-G5 全部通过 + H1 人工确认 + H2/H3/H4 触发且人工确认接受 | **有条件通过**：原型完成，低评分维度注入完整模式优先处理 |
| G5 未通过 或 H5 触发且回退 | **不通过**：回退阶段 1 重新定义视觉方向 |
| G1-G4 任一未通过 | **阻断**：补全缺失交付物后重新验证 |
