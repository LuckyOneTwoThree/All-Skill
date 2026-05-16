# Stage-P: 原型输出（prototype 模式专属）

仅在 `mode=prototype` 时执行。在 project-init 完成后，输出视觉方向和约束审查结果，不生成页面代码。

```
动作: 原型输出
触发条件: mode=prototype
输入:
  visual_direction: output/ui-project-init/project-init.json → visual_direction
  tokens: output/ui-project-init/project-init.json → tokens
  component_library: output/ui-project-init/project-init.json → component_library
  constraint_review: output/ui-frontend/constraint-review/constraint_review.json（可选）
  design_explorations: output/ui-frontend/design-exploration/design_explorations.json（可选）
处理流程:
  1. 汇总 project-init 产出的视觉方向、设计令牌、组件库选择
  2. 若有约束审查结果，纳入原型报告
  3. 若有设计探索结果，纳入原型报告
  4. 生成原型报告（含视觉方向概要、关键页面布局草图描述、组件选型摘要）
  5. 不生成页面代码、不调用 ext Skill、不生成 design_brief
输出:
  output/ui-frontend/prototype/prototype-report.md — 原型报告
  output/ui-project-init/ — 设计系统产出（已由 stage-1 生成）
验证: prototype-report.md 已生成 + visual_direction 10维度定义完成
模式: 🤖
```

**prototype 模式取舍**：
- ✅ 获得：快速验证设计方向、低成本多方案对比、交互逻辑对齐
- ❌ 放弃：页面代码、ext 增强、质量审计、API 集成、生产就绪

**prototype 模式输出**：
- 原型报告（markdown）：视觉方向概要 + 关键页面布局描述 + 组件选型摘要
- 设计系统产出（project-init.json）：视觉方向 + 设计令牌 + 组件库
- 无页面代码、无 design_brief、无 quality_debt

**与 full 模式的衔接**：
- prototype 完成后，用户确认视觉方向和组件选型
- 切换到 full 模式时，从 stage-2 开始执行（跳过 stage-1，复用已有 project-init 产出）
- 需要在项目信息收集时保留 project_dir，确保 full 模式可以找到已有产出
