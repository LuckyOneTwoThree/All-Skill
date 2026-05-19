# 阶段 4：页面增强 + 质量审计

**阶段合并说明**：v7.0 将原阶段 4（页面增强）和阶段 5（质量审计）合并为一个阶段。ext-frontend-design 从此阶段中移除（已在阶段 2 调用，输出通过 design_brief.json 消耗），减少重复调用。

## 视觉评审结果消耗（v7.2 新增）

阶段 3 完成后的强制视觉评审产生 `visual_review_result`（持久化路径：`output/ui-frontend/visual-review/visual_review_result.json`），包含 5 维度评分（整体视觉印象 / 品牌一致性 / 色彩和谐 / 排版节奏 / 布局留白，每个维度 1-5 分）。阶段 4 必须消耗此结果，将低评分维度（<=2）作为 ext 调用的优先修复项。在检查点恢复时，从文件读取；在非恢复执行时，可以使用内联传递的数据。

**消耗规则**：

| 低评分维度 | 优先 ext 子命令 | 修复方向 |
|----------|---------------------|---------|
| 整体视觉印象 <=2 | ext-impeccable bolder | 增强视觉冲击力 |
| 品牌一致性 <=2 | ext-impeccable colorize | 调整色彩策略以符合品牌调性 |
| 色彩和谐 <=2 | ext-impeccable colorize | 优化色彩搭配和层次 |
| 排版节奏 <=2 | ext-impeccable typeset | 改善字号层级和节奏 |
| 布局留白 <=2 | ext-impeccable layout adapt | 调整留白和信息密度 |

**消耗流程**：
1. 读取 visual_review_result 中得分 <=2 的维度
2. 将低评分维度的修复方向注入到 4.1/4.2/4.5 的输入中作为优先关注点
3. 如果没有低评分维度，ext 调用按正常流程执行
4. 修复闭环（4.8）额外验证低评分维度是否已改善（对比修复前后的代码）

## ext 调用依赖图（必须按依赖顺序执行）

```
4.1 ext-ui-ux-pro-max ──┐
4.2 ext-impeccable layout ─┤ 无依赖，可以并行运行
                          ├──-> 4.3 ext-impeccable shape ──-> 4.4 ext-interaction-design
                          │
4.5 ext-impeccable {clarify|onboard|distill}（无依赖，可以与 4.1/4.2 并行运行）
                          │
                          └──-> 4.6 ext-impeccable audit（依赖 4.3+4.4+4.5） ──-> 4.7 ext-impeccable critique ──-> 4.8 修复闭环
```

| # | Skill | 输入 | 输出 | 验证 | 依赖 | 说明 |
|---|-------|------|------|------|------|------|
| 4.1 | ext-ui-ux-pro-max --domain {landing/dashboard/general} | query="{product_type} {industry}"+页面结构+行业关键词（阶段 3/收集） | 页面结构建议 | 建议已生成 | 无 | |
| 4.2 | ext-impeccable layout adapt | 页面布局 + 视觉节奏（阶段 3，模式 A：运行 load-context.mjs） | 布局优化 + 响应式适配 | 布局增强已生成 | 无 | |
| 4.3 | ext-impeccable shape | 组件规范（阶段 3，模式 A：运行 load-context.mjs） | 状态机 + 交互流程 | 形状规划已生成 | 4.1, 4.2 | 纯静态原子组件可以跳过 |
| 4.4 | ext-interaction-design | interaction_needs+register+visual_direction+design_tokens+target_framework+状态机（阶段 3/4.3） | 交互动画模式 | 交互模式已生成 | 4.3 | 纯静态无交互可以跳过；如果 design_brief.animation_specifications 存在，输出不得冲突（冲突以 design_brief 为权威解决） |
| 4.5 | ext-impeccable {clarify\|onboard\|distill} | 页面代码（阶段 3，模式 A：运行 load-context.mjs） | UX 文案优化 + 简化 | 优化建议已生成 | 无 | 表单/空状态/错误 -> clarify，首页/注册 -> onboard，组件>10 -> distill |
| 4.6 | ext-impeccable audit | 所有代码（阶段 3，模式 A：运行 load-context.mjs） | 技术质量评分 + 问题列表 | audit_percent>=75 | 4.3, 4.4, 4.5 | 百分比比例 |
| 4.7 | ext-impeccable critique | 所有代码 + audit 报告（4.6，模式 A：运行 load-context.mjs） | 设计品味评分 + 修复建议 | critique_percent>=70 | 4.6 | 百分比比例，始终执行 |
| 4.8 | 修复闭环 | audit + critique 问题列表（4.6+4.7） | 修复后的代码 | quality_score>=75 | 4.7 | 最多 3 次闭环迭代 |

## 统一评分系统

ext-impeccable 的 audit（技术质量，原 20 分制）和 critique（设计品味，原 40 分制）统一转换为百分比比例。

| 评分维度 | 原比例 | 百分比转换 | 评估内容 |
|----------|---------|-----------|---------|
| audit（技术质量） | 0-20 | x5 -> 0-100 | A11y/Perf/Theming/Responsive/AntiPatterns |
| critique（设计品味） | 0-40 | x2.5 -> 0-100 | Nielsen 10 启发 + 设计审美评估 |

**critique 评分维度扩展**（v7.2）：

原 critique 仅使用 Nielsen 10 启发（以可用性为重点）。v7.2 将评估范围扩展为"可用性 + 美学"双维度。ext-impeccable critique 仍输出单个百分比评分，但评估必须覆盖两个维度：

| 维度 | 评估内容 |
|------|---------|
| 可用性（Nielsen 启发） | 可见性/反馈/一致性/错误预防/效率/认知/灵活性/美学（极简主义）/错误恢复/帮助 |
| 设计美学 | 视觉层级/色彩和谐/排版节奏/留白使用/品牌表现力/差异化程度 |

> **注意**：Nielsen 启发 #8"美学和极简主义设计"与设计美学维度重叠，但在扩展评估中，美学维度更深入地评估视觉表现力（不仅仅是"极简主义"）、品牌表现力（不仅仅是"一致性"）和差异化程度（不仅仅是"行业标准"）。

**visual_review_result 集成**（v7.2 新增）：

当阶段 3 的视觉评审有低评分维度（<=2）时，critique 评分必须额外验证低评分维度的改善情况。如果增强后低评分维度仍未改善，critique_percent 应相应扣除（每个未改善的低评分维度扣 5 分，最多扣 15 分）。

**critique 评分计算**：
- 无低评分维度：`critique_percent = ext-impeccable critique 原始百分比评分`
- 有低评分维度：`critique_percent = ext-impeccable critique 原始百分比评分 - (未改善维度数量 x 5)`（最低 0）

**综合质量评分**：`quality_score = audit_percent x 0.5 + critique_percent x 0.5`

**评分权重调整说明**（v7.2）：原权重 auditx0.6 + critiquex0.4 偏向技术质量，允许技术完美但设计平庸的页面通过门禁。调整为 50:50 平衡权重，确保设计品味和技术质量同等重要。

**各维度最低阈值**（防止不平衡）：

| 维度 | 最低阈值 | 低于阈值处理 |
|------|---------|-------------|
| audit_percent | >=60 | 标记"技术质量不平衡"，[GATE] 需要人工确认 |
| critique_percent | >=55 | 标记"设计品味不平衡"，[GATE] 需要人工确认 |

## design_brief 一致性守护

阶段 4 的 ext 增强直接修改代码，可能偏离阶段 2 由 design_brief.json 建立的设计规范。以下规则确保增强不会破坏已建立的一致性：

**一致性约束**（所有 ext 增强必须遵守）：

| 约束维度 | design_brief 字段 | 阶段 4 增强规则 | 违规判定 |
|----------|------------------|-----------------|---------|
| 色彩规范 | color_specifications | 增强的颜色值必须在 design_brief.color_specifications 定义的色阶范围内 | 出现 design_brief 中未定义的颜色值 |
| 排版规范 | typography_specifications | 增强的字号/字重必须在 design_brief.type_scale_values 定义的层级范围内 | 出现 design_brief 中未定义的字号或字重 |
| 品牌色策略 | brand_color_strategy | 增强的品牌色分布必须符合 usage_mode 和 target_percentage | 品牌色比例偏离 target_percentage 超过 +/-10% |
| 视觉禁止 | visual_bans | 增强的代码绝对不能包含 visual_bans 中的模式 | 出现 visual_bans 中列出的模式 |
| 差异化方向 | differentiation_direction | 增强不得将差异化方向拉回同质化（例如，bolder 不得完全被 quieter 抵消） | 增强的代码表现出 design_brief 明确反对的同质化特征 |

**增强修改可追溯规则**：
- 在阶段 4 启动时，**必须读取**阶段 3 现有的 quality_debt.json 条目，将债务摘要注入到 ext 调用输入中（例如，ext-impeccable colorize 的输入应包含债务上下文，如"已知颜色 token 引用率不足"）
- 每次 ext 子命令修改代码后，必须将修改摘要记录到 quality_debt.json（格式：`{id, stage: "stage-4", description: "ext-{sub-command} 修改了 {具体内容}", severity, status: "applied"}`）
- 修复闭环（4.8）额外验证阶段 3 继承的 quality_debt 条目是否已改善
- Audit 检查额外验证 design_brief 一致性约束；违规标记为 P0 问题

## 闭环规则

- 每次闭环迭代：修复 audit 和 critique 发现的问题 -> 重新运行 audit+critique -> 计算 quality_score
- 最多 3 次闭环迭代
- 3 次迭代后，quality_score 仍 <75：标记"待人工确认"，[GATE] 人工决定批准或继续修复
- quality_score>=75 但单个 audit_percent<60 或 critique_percent<55：标记"不平衡风险"，[GATE] 需要人工确认

## ext-impeccable 降级计划

当 ext-impeccable 未部署或调用失败时，audit/critique 无法执行，quality_score 使用 page-builder 内置的自我评估评分作为回退：

| 评分方法 | 计算公式 | 门禁阈值 | 适用场景 |
|----------|---------|-----------|---------|
| 标准评分 | audit_percent x 0.5 + critique_percent x 0.5 | >=75 | ext-impeccable 已部署且调用成功 |
| 降级评分 | 内置自我评估评分（page-builder aesthetic_score） | >=60 | ext-impeccable 未部署或调用失败 |

**内置自我评估评分维度**：
- WCAG AA 对比度合规率（权重 30%）
- Token 引用率（权重 25%）
- 响应式断点覆盖率（权重 20%）
- 组件状态覆盖率（权重 15%）
- 视觉节奏一致性（权重 10%）

降级评分必须记录在 quality_debt.json 中（severity：medium，description："质量审计使用内置自我评估作为 ext-impeccable audit/critique 的回退"）。
