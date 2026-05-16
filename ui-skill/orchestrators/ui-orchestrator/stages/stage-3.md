# Stage 3: 页面与组件构建（消费设计简报）

**核心变化**：page-builder 现在直接消费 Stage 2 产出的 design_brief.json，将 ext 的设计决策内建于代码生成过程，而非事后打补丁。

## 页面清单完整性保障（v7.0 新增）

在调用 page-builder 前，编排器消费 stage-2 已预生成的 page_manifest.json，执行完整性校验：

```
动作: 页面清单校验（消费stage-2预生成结果）
触发条件: page_manifest.json 存在（由 stage-2 预生成）
输入:
  page_manifest: output/ui-frontend/page-manifest/page_manifest.json
  prd_json: output/pm-design/design-prd/prd.json（可选，用于交叉校验）
  ia_proposals: output/pm-design/design-ia/ia_proposals.json（可选，用于交叉校验）
处理流程:
  1. 读取 page_manifest.json
  2. 与 prd.json/ia_proposals.json 交叉校验（若存在）
  3. 不一致时以 prd.json 为准，更新 page_manifest.json
  4. 传递给 page-builder
输出: output/ui-frontend/page-manifest/page_manifest.json（已校验版本）
验证: page_manifest.json 已生成且 pages[] 非空
模式: 🤖
```

**无 PM 输入且 stage-2 未生成页面清单时的兜底**：

当 page_manifest.json 不存在时（理论上不应发生，因为 stage-2 始终预生成），编排器从用户提供的页面需求描述中提取页面清单：

```
动作: 无PM输入页面清单兜底生成
触发条件: page_manifest.json 不存在
输入:
  页面需求: 用户提供（string/markdown）
  prd_md: output/pm-design/design-prd/prd.md（可选，仅文本描述）
处理流程:
  1. 从页面需求描述中提取所有页面名称和功能描述
  2. 为每个页面分配 page_id（slug格式，如"用户中心"→"user-center"）
  3. 推断路由路径（基于页面名称和常见约定）
  4. 生成 page_manifest.json，source 标记为 "user_input"
  5. ⏸ 人类确认页面清单完整性（无PM产出时，人类确认是唯一的完整性保障）
输出: output/ui-frontend/page-manifest/page_manifest.json
验证: page_manifest.json 已生成 + 人类已确认
模式: 🤖→👤
```

page_manifest.json Schema 定义见 [schemas/page-manifest.json](../schemas/page-manifest.json)。

| 输入项 | 来源 |
|--------|------|
| 页面需求 | 用户提供 / output/pm-design/design-prd/prd.md |
| **页面清单** | **output/ui-frontend/page-manifest/page_manifest.json（编排器生成）** |
| 视觉方向/设计令牌/组件库 | output/ui-project-init/project-init.json |
| **设计简报** | **output/ui-frontend/design-brief/design_brief.json（Stage 2 产出）** |
| 目标框架/目标语言/project_dir | 项目信息收集阶段确定 |
| PRD | output/pm-design/design-prd/prd.md（可选） |
| PRD结构化数据 | output/pm-design/design-prd/prd.json（条件必填，存在时必须消费） |
| 路由结构 | output/pm-design/design-ia/ia_proposals.json（条件必填，存在时必须消费） |
| 交互规范 | output/pm-design/interaction-spec/interaction-spec.md（可选） |

**page-builder 执行模式**：

当 design_brief.json 存在时，page-builder 进入"设计简报驱动模式"：
1. Step 1 页面结构规划：消费 design_brief.layout_instructions 和 brand_color_strategy
2. Step 2 组件生成：消费 design_brief.component_specifications 和 color_specifications/typography_specifications
3. Step 3 页面组装：消费 design_brief.animation_specifications
4. Step 4 质量检查：额外验证 design_brief.visual_bans 和 differentiation_direction

当 design_brief.json 不存在时，page-builder 退回"令牌驱动模式"（仅消费 visual_direction + tokens）。

输出: output/ui-frontend/page-builder/ + 代码写入 {project_dir}/src/
验证: P0问题=0 + Token引用率100% + WCAG AA达标 + 响应式375/768/1024px + 强制视觉审查已完成
⏸ 人类确认页面布局和组件方案

## 强制视觉审查（v7.2 新增）

stage-3 完成后、stage-4 增强前，编排器必须执行强制视觉审查。这是整个 full 流程中**唯一的人类视觉质量关卡**——stage-4 的 audit/critique 是自动化评分，无法替代人类对设计美感的判断。

```
动作: 强制视觉审查
触发条件: stage-3 gate 通过后，stage-4 执行前
输入:
  页面代码: {project_dir}/src/
  运行中的开发服务器: npm run dev
  design_brief: output/ui-frontend/design-brief/design_brief.json
  visual_direction: output/ui-project-init/project-init.json → visual_direction
处理流程:
  1. 确保开发服务器正在运行（npm run dev）
  2. 提示人类在浏览器中查看每个页面
  3. 人类按以下维度评估（每项1-5分）：
     - 整体视觉印象：第一眼是否吸引人？
     - 品牌一致性：是否符合品牌调性？
     - 色彩和谐度：色彩搭配是否舒适有层次？
     - 排版节奏：字号层级是否清晰有节奏？
     - 布局呼吸感：留白是否充分，信息密度是否合理？
  4. 任一维度≤2分：标注该维度为"需重点增强"，传递给 stage-4 的 ext Skill 作为优先修复项
  5. 平均分≤2.5：⏸ 人类决定是否回退到 stage-2 重新生成 design_brief
输出: visual_review_result（持久化至 output/ui-frontend/visual-review/visual_review_result.json，同时内联传递给stage-4）
验证: 人类已完成视觉审查
模式: 👤（必须人类执行）
```

**视觉审查与 stage-4 增强的衔接**：
- 审查中评分≤2 的维度，在 stage-4 的 ext 调用中优先处理
- 如"色彩和谐度"≤2：stage-4 优先调用 ext-impeccable colorize/bolder
- 如"排版节奏"≤2：stage-4 优先调用 ext-impeccable typeset
- 如"布局呼吸感"≤2：stage-4 优先调用 ext-impeccable layout adapt

## design_feedback 回传处理（UI→PM反向反馈通道）

当 page-builder 输出中包含 design_feedback.json 且 suggestions 非空时，编排器执行以下回传流程：

```
动作: design_feedback回传
触发条件: output/ui-frontend/page-builder/design_feedback.json 存在且 suggestions 非空
处理流程:
  1. 读取 design_feedback.json
  2. 按优先级排序 suggestions（high→medium→low）
  3. ⏸ 人类确认反馈建议：
     - 接受：将 design_feedback.json 复制到 output/pm-design/design-feedback/，供 design-orchestrator 消费
     - 拒绝：标注拒绝理由，page-builder 按 design_decisions 中的偏离决策继续执行
     - 部分接受：只回传接受的 suggestions
  4. 若人类接受任何 suggestion：
     - 将 design_feedback.json 写入 output/pm-design/design-feedback/design_feedback.json
     - 标注 ui-orchestrator 检查点：feedback_pending=true
     - 下次 design-orchestrator 执行时将消费此反馈
  5. 若人类全部拒绝：
     - 不生成反馈文件
     - page-builder 按 design_decisions 继续执行
输出: output/pm-design/design-feedback/design_feedback.json（仅人类接受时）
验证: 反馈文件已生成（若接受）或已标注拒绝理由
模式: 🤖→👤
```

**反馈与 design-orchestrator 的衔接**：
- design-orchestrator 启动时检查 output/pm-design/design-feedback/design_feedback.json
- 若存在，在 phase-1（PRD）完成后优先处理反馈建议，触发 change-impact-analysis 评估影响
- 反馈处理完成后删除 feedback 文件，避免重复消费
