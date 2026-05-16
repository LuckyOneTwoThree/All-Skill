# Stage 4: 页面增强+质量审计

**阶段合并说明**：v7.0 将原 Stage 4（页面增强）和 Stage 5（质量审计）合并为一个阶段。ext-frontend-design 从本阶段移除（已在 Stage 2 调用，产出通过 design_brief.json 消费），减少重复调用。

## ext 调用依赖关系（必须按依赖顺序执行）

```
4.1 ext-ui-ux-pro-max ──┐
4.2 ext-impeccable layout ─┤ 无依赖，可并行
                          ├──→ 4.3 ext-impeccable shape ──→ 4.4 ext-interaction-design
                          │
4.5 ext-impeccable {clarify|onboard|distill}（无依赖，可与4.1/4.2并行）
                          │
                          └──→ 4.6 ext-impeccable audit（依赖4.3+4.4+4.5）──→ 4.7 ext-impeccable critique ──→ 4.8 修复闭环
```

| # | Skill | 输入 | 输出 | 验证 | 依赖 | 备注 |
|---|-------|------|------|------|------|------|
| 4.1 | ext-ui-ux-pro-max --domain | 页面结构+行业关键词 (stage-3/收集) | 页面结构推荐 | 推荐已生成 | 无 | |
| 4.2 | ext-impeccable layout adapt | 页面布局+视觉节奏 (stage-3) | 布局优化+响应式适配 | 布局增强已生成 | 无 | |
| 4.3 | ext-impeccable shape | 组件规格 (stage-3) | 状态机+交互流程 | shape规划已生成 | 4.1, 4.2 | 纯静态原子组件可跳过 |
| 4.4 | ext-interaction-design | 组件交互需求+状态机 (stage-3/4.3) | 交互动效模式 | 交互模式已生成 | 4.3 | 纯静态无交互可跳过；若design_brief.animation_specifications存在，产出不得与其冲突（冲突时以design_brief为准） |
| 4.5 | ext-impeccable {clarify\|onboard\|distill} | 页面代码 (stage-3) | UX文案优化+精简 | 优化建议已生成 | 无 | 表单/空状态/错误→clarify, 首页/注册→onboard, 组件>10→distill |
| 4.6 | ext-impeccable audit | 全部代码 (stage-3) | 技术质量评分+问题清单 | audit_percent≥75 | 4.3, 4.4, 4.5 | 百分制 |
| 4.7 | ext-impeccable critique | 全部代码+audit报告 (4.6) | 设计品味评分+修复建议 | critique_percent≥70 | 4.6 | 百分制，始终执行 |
| 4.8 | 修复闭环 | audit+critique问题清单 (4.6+4.7) | 修复后代码 | quality_score≥75 | 4.7 | 最多3次闭环 |

## 统一评分体系

ext-impeccable 的 audit（技术质量，原20分制）和 critique（设计品味，原40分制）统一换算为百分制。

| 评分维度 | 原始分制 | 百分制换算 | 评估内容 |
|----------|---------|-----------|---------|
| audit（技术质量） | 0-20 | ×5 → 0-100 | A11y/Perf/Theming/Responsive/AntiPatterns |
| critique（设计品味） | 0-40 | ×2.5 → 0-100 | Nielsen 10启发式 |

**综合质量评分**：`quality_score = audit_percent × 0.6 + critique_percent × 0.4`

## design_brief 一致性守卫

Stage 4 的 ext 增强直接修改代码，可能偏离 Stage 2 通过 design_brief.json 建立的设计规范。以下规则确保增强不破坏已建立的一致性：

**一致性约束**（所有 ext 增强必须遵守）：

| 约束维度 | design_brief 字段 | Stage 4 增强规则 | 违反判定 |
|----------|------------------|-----------------|---------|
| 色彩规范 | color_specifications | 增强后的色值必须在 design_brief.color_specifications 定义的色阶范围内 | 出现 design_brief 中未定义的色值 |
| 排版规范 | typography_specifications | 增强后的字号/字重必须在 design_brief.type_scale_values 定义的层级内 | 出现 design_brief 中未定义的字号或字重 |
| 品牌色策略 | brand_color_strategy | 增强后的品牌色分布必须符合 usage_mode 和 target_percentage | 品牌色占比偏离 target_percentage 超过 ±10% |
| 视觉禁忌 | visual_bans | 增强后的代码绝对不包含 visual_bans 中的模式 | 出现 visual_bans 中列出的模式 |
| 差异化方向 | differentiation_direction | 增强不得将差异化方向拉回同质化（如 bolder 不得被 quieter 完全抵消） | 增强后代码出现 design_brief 明确反对的同质化特征 |

**增强修改溯源规则**：
- 每个 ext 子命令修改代码后，必须记录修改内容摘要到 quality_debt.json（格式：`{id, stage: "stage-4", description: "ext-{子命令}修改了{具体内容}", severity, status: "applied"}`）
- audit 检查时额外验证 design_brief 一致性约束，违反项标注为 P0 问题

## 闭环规则

- 每次闭环：修复audit和critique发现的问题 → 重新audit+critique → 计算quality_score
- 最多3次闭环
- 3次后quality_score仍<75：标注"待人类确认"，⏸ 人类决定放行或继续修复
- quality_score≥75但单项audit_percent<60或critique_percent<50：标注"偏科风险"，⏸ 人类确认

## ext-impeccable 降级方案

当 ext-impeccable 未部署或调用失败时，audit/critique 无法执行，quality_score 使用 page-builder 的内建自评分数替代：

| 评分方式 | 计算公式 | gate 门槛 | 适用场景 |
|----------|---------|-----------|---------|
| 标准评分 | audit_percent × 0.6 + critique_percent × 0.4 | ≥75 | ext-impeccable 已部署且调用成功 |
| 降级评分 | 内建自评分数（page-builder aesthetic_score） | ≥60 | ext-impeccable 未部署或调用失败 |

**内建自评分数维度**：
- WCAG AA 对比度达标率（权重 30%）
- Token 引用率（权重 25%）
- 响应式断点覆盖（权重 20%）
- 组件状态覆盖（权重 15%）
- 视觉节奏一致性（权重 10%）

降级评分必须记录到 quality_debt.json（severity: medium, description: "质量审计使用内建自评替代 ext-impeccable audit/critique"）。
