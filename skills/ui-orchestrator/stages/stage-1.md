# Stage 1: 设计系统建立

| 输入项 | 来源 |
|--------|------|
| 品牌规范/产品定位/目标平台/目标语言/project_name/project_dir/framework/组件库偏好 | 项目信息收集阶段确定 |
| package_manager | 用户提供（默认pnpm） |
| PRD | output/pm-design/design-prd/prd.md（可选） |
| PRD结构化数据 | output/pm-design/design-prd/prd.json（可选） |

输出: output/ui-project-init/ + 代码写入 {project_dir}/ + PRODUCT.md + DESIGN.md
验证: visual_direction 10维度定义 + 维度间一致性校验通过 + WCAG AA达标 + PRODUCT.md/DESIGN.md非占位符 + 令牌文件已写入 + npm run dev启动成功
⏸ 人类确认视觉方向和品牌色

## visual_direction 一致性校验（v7.2 新增）

stage-1 gate 不仅检查 10 维度是否"已定义"，还校验维度间的逻辑一致性，防止矛盾的 visual_direction 传递到下游。

**一致性校验规则**：

| 规则 | 校验内容 | 矛盾示例 | 处理 |
|------|---------|---------|------|
| 色彩-情绪一致 | color_strategy 的温度与 mood_keywords 匹配 | color_strategy=冷色调 + mood_keywords=温暖亲切 | ⚠️ 标注矛盾，建议调整 |
| 布局-密度一致 | layout_differentiation 与 tension_level 匹配 | layout=极简大量留白 + tension_level=high | ⚠️ 标注矛盾，建议调整 |
| 禁忌-方向一致 | visual_bans 不与 aesthetic_direction 矛盾 | aesthetic_direction=大胆撞色 + visual_bans=高饱和色 | ❌ 阻断，必须修复 |
| 排版-风格一致 | typography_strategy 与 register 匹配 | register=brand + typography=功能型紧凑 | ⚠️ 标注矛盾，建议调整 |

**校验结果处理**：
- ❌ 阻断级矛盾：必须修复后才能通过 gate
- ⚠️ 警告级矛盾：标注但不阻断，⏸ 人类确认是否接受

## 条件分支A：设计探索（mode=progressive 时，在 project-init 执行前运行）

在消费 PM 结构化数据之前，先基于非结构化的产品需求自由探索设计方案，避免 PM 产出的"认知牢笼"效应。

```
动作: 设计探索
触发条件: mode=progressive
输入:
  prd_text: output/pm-design/design-prd/prd.md（仅消费文本，不消费 prd.json）
  品牌规范: 用户提供
  产品定位: 用户提供（可选）
处理流程:
  1. 从 prd.md 提取核心用户任务和功能需求
  2. 基于品牌规范推导 2-3 个视觉方向候选（不同 tension_level）
  3. 为每个视觉方向生成页面布局探索方案
  4. 输出 design_explorations.json
输出: output/ui-frontend/design-exploration/design_explorations.json
验证: design_explorations.json 已生成，至少2个探索方案
模式: 🤖
```

⏸ 人类选择探索方案（选择1个或融合多个方案的特征）

## 条件分支A续：约束对齐（人类选择探索方案后执行）

```
动作: 约束对齐
触发条件: mode=progressive，且人类已选择探索方案
输入:
  selected_exploration: 人类选择的探索方案
  prd_json/ia_proposals/component_catalog/interaction_spec: PM结构化产出（可选）
处理流程:
  1. 将探索方案与PM约束对齐（页面/功能/组件/交互4维度）
  2. 生成 design_decisions.json + design_feedback.json（如有冲突）
输出:
  output/ui-frontend/design-exploration/design_decisions.json
  output/ui-frontend/design-exploration/design_feedback.json（如有冲突需PM修改）
验证: design_decisions.json 已生成，所有功能需求已覆盖
模式: 🤖→👤
```

**design_feedback 回传机制**（与 stage-3 回传流程一致）：
当 design_feedback.json 存在且 suggestions 非空时，编排器执行以下回传流程：
1. 读取 design_feedback.json
2. 按 severity 排序（critical > high > medium）
3. ⏸ 人类确认是否接受反馈建议（接受/拒绝/部分接受）
4. 将确认后的反馈写入 `output/pm-design/design-feedback/design_feedback.json`
5. 标注 checkpoint 中 design_feedback 已回传
6. design-orchestrator 启动时检查此路径，优先处理反馈后删除避免重复消费

⏸ 人类确认约束对齐结果和设计决策

## 条件分支B：PM约束审查（有PM输入时，在 project-init 执行后运行）

在 page-builder 消费 PM 产出之前，先从 UI 设计视角审查 PM 约束的合理性。

```
动作: PM约束审查
触发条件: prd.json或ia_proposals.json或component_catalog.json存在
输入:
  prd_json/ia_proposals/component_catalog/interaction_spec: PM结构化产出（可选）
  visual_direction: output/ui-project-init/project-init.json → visual_direction
处理流程:
  5维度审查：页面划分/功能区域/组件选型/导航结构/交互复杂度
输出: output/ui-frontend/constraint-review/constraint_review.json
验证: constraint_review.json已生成
模式: 🤖
```

⏸ 人类确认约束审查结果（仅 critical 级别 finding 需确认）
