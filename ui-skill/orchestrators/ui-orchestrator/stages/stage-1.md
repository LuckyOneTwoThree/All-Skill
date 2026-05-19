# 阶段 1：设计系统建立

| 输入 | 来源 |
|--------|------|
| 品牌规范 / 产品定位 / 目标平台 / 目标语言 / project_name / project_dir / framework / 组件库偏好 | 在项目信息收集阶段确定 |
| package_manager | 用户提供（默认：pnpm） |
| PRD | output/pm-design/design-prd/prd.md（可选） |
| PRD 结构化数据 | output/pm-design/design-prd/prd.json（可选） |

输出：output/ui-project-init/ + 代码写入 {project_dir}/ + PRODUCT.md + DESIGN.md
验证：visual_direction 10 维度定义 + 维度间一致性检查通过 + WCAG AA 合规 + PRODUCT.md/DESIGN.md 非占位符 + token 文件已写入 + npm run dev 启动成功
[GATE] 视觉方向和品牌颜色需要人工确认

## visual_direction 一致性检查（v7.2 新增）

阶段 1 的门禁不仅检查 10 个维度是否"已定义"，还会验证维度之间的逻辑一致性，防止矛盾的 visual_direction 向下游传播。

**一致性检查规则**：

| 规则 | 检查内容 | 矛盾示例 | 处理方式 |
|------|---------|---------|------|
| 颜色-情绪一致性 | color_strategy 温度匹配 mood_keywords | color_strategy=冷色调 + mood_keywords=温暖亲切 | [!] 标记矛盾，建议调整 |
| 布局-密度一致性 | layout_differentiation 匹配 tension_level | 布局=极简+大量留白 + tension_level=高 | [!] 标记矛盾，建议调整 |
| 禁止项-方向一致性 | visual_bans 不与 aesthetic_direction 矛盾 | aesthetic_direction=大胆的色彩碰撞 + visual_bans=高饱和度颜色 | [X] 阻止，必须修复 |
| 排版-风格一致性 | typography_strategy 匹配 register | register=品牌 + typography=功能性紧凑 | [!] 标记矛盾，建议调整 |

**检查结果处理**：
- [X] 阻止级矛盾：在通过门禁前必须修复
- [!] 警告级矛盾：标记但不阻止，[GATE] 需要人工确认接受

## 条件分支 A：设计探索（当 mode=progressive 时，在项目初始化执行前运行）

在消耗 PM 结构化数据之前，根据非结构化产品需求自由探索设计方向，避免 PM 输出的"认知牢笼"效应。

```
Action: 设计探索
触发条件：mode=progressive
输入：
  prd_text：output/pm-design/design-prd/prd.md（仅消耗文本，不消耗 prd.json）
  品牌规范：用户提供
  产品定位：用户提供（可选）
流程：
  1. 从 prd.md 中提取核心用户任务和功能需求
  2. 根据品牌规范推导出 2-3 个视觉方向候选方案（不同的 tension_level）
  3. 为每个视觉方向生成页面布局探索方案
  4. 输出 design_explorations.json
输出：output/ui-frontend/design-exploration/design_explorations.json
验证：design_explorations.json 已生成，至少 2 个探索方案
模式：AI
```

[GATE] 需要人工确认选择探索方案（选择 1 个或从多个方案中合并特性）

## 条件分支 A 继续：约束对齐（在人工选择探索方案后执行）

```
Action: 约束对齐
触发条件：mode=progressive，且人工已选择探索方案
输入：
  selected_exploration：人工选择的探索方案
  prd_json/ia_proposals/component_catalog/interaction_spec：PM 结构化输出（可选）
流程：
  1. 将探索方案与 PM 约束对齐（4 个维度：页面/功能/组件/交互）
  2. 生成 design_decisions.json + design_feedback.json（如果存在冲突）
输出：
  output/ui-frontend/design-exploration/design_decisions.json
  output/ui-frontend/design-exploration/design_feedback.json（如果存在需要 PM 修改的冲突）
验证：design_decisions.json 已生成，所有功能需求已覆盖
模式：AI->Human
```

**design_feedback 传播机制**（与阶段 3 传播流程一致）：
当 design_feedback.json 存在且 suggestions 非空时，编排器执行以下传播流程：
1. 读取 design_feedback.json
2. 按严重性排序（critical > high > medium）
3. [GATE] 需要人工确认接受反馈建议（接受/拒绝/部分接受）
4. 将确认的反馈写入 `output/pm-design/design-feedback/design_feedback.json`
5. 在检查点标记 design_feedback 已传播
6. design-orchestrator 在启动时检查此路径，优先处理反馈然后删除以避免重复消耗

[GATE] 约束对齐结果和设计决策需要人工确认

## 条件分支 B：PM 约束评审（当 PM 输入存在时，在项目初始化执行后运行）

在 page-builder 消耗 PM 输出之前，从 UI 设计角度评审 PM 约束的合理性。

```
Action: PM 约束评审
触发条件：prd.json 或 ia_proposals.json 或 component_catalog.json 存在
输入：
  prd_json/ia_proposals/component_catalog/interaction_spec：PM 结构化输出（可选）
  visual_direction：output/ui-project-init/project-init.json -> visual_direction
流程：
  5 维度评审：页面划分 / 功能区域 / 组件选择 / 导航结构 / 交互复杂度
输出：output/ui-frontend/constraint-review/constraint_review.json
验证：constraint_review.json 已生成
模式：AI
```

[GATE] 约束评审结果需要人工确认（仅 critical 级发现需要确认）
