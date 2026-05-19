# 阶段 3：页面与组件构建（消耗设计概要）

**核心变更**：page-builder 现在直接消耗阶段 2 生成的 design_brief.json，将 ext 设计决策嵌入到代码生成过程中，而不是事后修补。

## 页面清单完整性保证（v7.2 新增）

在调用 page-builder 之前，编排器消耗阶段 2 预生成的 page_manifest.json 并执行完整性检查：

```
Action: 页面清单验证（消耗阶段 2 预生成结果）
触发条件：page_manifest.json 存在（由阶段 2 预生成）
输入：
  page_manifest：output/ui-frontend/page-manifest/page_manifest.json
  prd_json：output/pm-design/design-prd/prd.json（可选，用于交叉验证）
  ia_proposals：output/pm-design/design-ia/ia_proposals.json（可选，用于交叉验证）
流程：
  1. 读取 page_manifest.json
  2. 与 prd_json/ia_proposals.json 交叉验证（如果可用）
  3. 不一致时以 prd.json 为权威来源，更新 page_manifest.json
  4. 传递给 page-builder
输出：output/ui-frontend/page-manifest/page_manifest.json（验证版本）
验证：page_manifest.json 已生成且 pages[] 非空
模式：AI
```

**无 PM 输入且阶段 2 未生成页面清单时的回退方案**：

当 page_manifest.json 不存在时（理论上不应该发生，因为阶段 2 总是预生成），编排器从用户提供的页面需求描述中提取页面清单：

```
Action: 无 PM 输入时的回退页面清单生成
触发条件：page_manifest.json 不存在
输入：
  页面需求：用户提供（string/markdown）
  prd_md：output/pm-design/design-prd/prd.md（可选，仅文本描述）
流程：
  1. 从页面需求描述中提取所有页面名称和功能描述
  2. 为每个页面分配 page_id（slug 格式，例如"用户中心" -> "user-center"）
  3. 推断路由路径（基于页面名称和常见约定）
  4. 生成 page_manifest.json，source 标记为"user_input"
  5. [GATE] 页面清单完整性需要人工确认（无 PM 输出时，人工确认是唯一的完整性保证）
输出：output/ui-frontend/page-manifest/page_manifest.json
验证：page_manifest.json 已生成 + 人工确认
模式：AI->Human
```

page_manifest.json 模式定义：[schemas/page-manifest.json](../schemas/page-manifest.json)。

| 输入 | 来源 |
|--------|------|
| 页面需求 | 用户提供 / output/pm-design/design-prd/prd.md |
| **页面清单** | **output/ui-frontend/page-manifest/page_manifest.json（编排器生成）** |
| 视觉方向 / 设计 tokens / 组件库 | output/ui-project-init/project-init.json |
| **设计概要** | **output/ui-frontend/design-brief/design_brief.json（阶段 2 输出）** |
| 目标框架 / 目标语言 / project_dir | 在项目信息收集阶段确定 |
| PRD | output/pm-design/design-prd/prd.md（可选） |
| PRD 结构化数据 | output/pm-design/design-prd/prd.json（有条件要求，存在时必须消耗） |
| 路由结构 | output/pm-design/design-ia/ia_proposals.json（有条件要求，存在时必须消耗） |
| 交互规范 | output/pm-design/interaction-spec/interaction-spec.md（可选） |

**page-builder 执行模式**：

当 design_brief.json 存在时，page-builder 进入"设计概要驱动模式"：
1. 步骤 1 页面结构规划：消耗 design_brief.layout_instructions 和 brand_color_strategy
2. 步骤 2 组件生成：消耗 design_brief.component_specifications 和 color_specifications/typography_specifications
3. 步骤 3 页面组装：消耗 design_brief.animation_specifications
4. 步骤 4 质量检查：额外验证 design_brief.visual_bans 和 differentiation_direction

当 design_brief.json 不存在时，page-builder 回退到"token 驱动模式"（仅消耗 visual_direction + tokens）。

输出：output/ui-frontend/page-builder/ + 代码写入 {project_dir}/src/
验证：P0 问题=0 + Token 引用率 100% + WCAG AA 合规 + 响应式 375/768/1024px + 强制视觉评审完成
[GATE] 页面布局和组件方案需要人工确认

## 强制视觉评审（v7.2 新增）

在阶段 3 完成后、阶段 4 增强之前，编排器必须执行强制视觉评审。这是整个完整流程中**唯一的人工视觉质量门禁**——阶段 4 的 audit/critique 是自动化评分，无法替代人类对设计审美的判断。

```
Action: 强制视觉评审
触发条件：阶段 3 门禁通过后，阶段 4 执行前
输入：
  页面代码：{project_dir}/src/
  运行中的 dev 服务器：npm run dev
  design_brief：output/ui-frontend/design-brief/design_brief.json
  visual_direction：output/ui-project-init/project-init.json -> visual_direction
流程：
  1. 确保 dev 服务器正在运行（npm run dev）
  2. 提示人工在浏览器中查看每个页面
  3. 人工在以下维度进行评估（每个维度 1-5 分）：
     - 整体视觉印象：第一眼看起来是否吸引人？
     - 品牌一致性：是否符合品牌调性？
     - 色彩和谐：配色是否舒适且层次分明？
     - 排版节奏：字号层级是否清晰且有节奏感？
     - 布局留白：留白是否充足，信息密度是否合理？
  4. 任何维度 <=2：将该维度标记为"需要优先增强"，作为优先修复项传递给阶段 4 的 ext Skill
  5. 平均得分 <=2.5：[GATE] 人工决定是否回退到阶段 2 重新生成 design_brief
输出：visual_review_result（持久化到 output/ui-frontend/visual-review/visual_review_result.json，同时内联传递给阶段 4）
验证：人工已完成视觉评审
模式：Human（必须由人工执行）
```

**视觉评审与阶段 4 增强的关联**：
- 评审中得分 <=2 的维度在阶段 4 的 ext 调用中优先处理
- 如果"色彩和谐" <=2：阶段 4 优先调用 ext-impeccable colorize/bolder
- 如果"排版节奏" <=2：阶段 4 优先调用 ext-impeccable typeset
- 如果"布局留白" <=2：阶段 4 优先调用 ext-impeccable layout adapt

## design_feedback 传播处理（UI->PM 反向反馈通道）

当 page-builder 输出包含 design_feedback.json 且 suggestions 非空时，编排器执行以下传播流程：

```
Action: design_feedback 传播
触发条件：output/ui-frontend/page-builder/design_feedback.json 存在且 suggestions 非空
流程：
  1. 读取 design_feedback.json
  2. 按优先级对建议排序（高->中->低）
  3. [GATE] 反馈建议需要人工确认：
     - 接受：将 design_feedback.json 复制到 output/pm-design/design-feedback/ 供 design-orchestrator 消耗
     - 拒绝：记录拒绝原因，page-builder 根据 design_decisions 偏差决策继续执行
     - 部分接受：仅传播接受的建议
  4. 如果人工接受任何建议：
     - 将 design_feedback.json 写入 output/pm-design/design-feedback/design_feedback.json
     - 标记 ui-orchestrator 检查点：feedback_pending=true
     - 下次 design-orchestrator 执行将消耗此反馈
  5. 如果人工全部拒绝：
     - 不生成反馈文件
     - page-builder 根据 design_decisions 继续执行
输出：output/pm-design/design-feedback/design_feedback.json（仅在人工接受时）
验证：反馈文件已生成（如果接受）或拒绝原因已记录
模式：AI->Human
```

**反馈与 design-orchestrator 的关联**：
- design-orchestrator 在启动时检查 output/pm-design/design-feedback/design_feedback.json
- 如果存在，在阶段 1（PRD）完成后优先处理反馈建议，触发变更影响分析以评估影响
- 处理后删除反馈文件以避免重复消耗
