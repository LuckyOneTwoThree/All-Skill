---
name: ui-orchestrator
description: 当需要UI设计与前端开发时使用。UI设计与前端开发编排器，按需调度核心Skill与ext Skill完成从项目初始化到生产就绪的全流程。关键词：UI设计、前端开发、UI、前端、界面开发、做UI、写前端、出界面、搭页面、设计系统+前端代码。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI总指挥"
  type: "orchestrator"
  version: "6.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "做UI"
    - "写前端"
    - "出界面"
    - "搭页面"
    - "设计系统加前端代码一起做"
    - "从设计到前端全流程"
  interaction_mode: "ai_suggest_human_approve"
---

# UI设计与前端开发编排器

## 核心原则

按需执行——只运行项目需要的步骤，不执行不需要的阶段。核心阶段与ext增强阶段交替执行，ext Skill调用由编排器统一调度而非内嵌在Pipeline Skill内部。

## 执行模式

编排器支持三种执行模式，通过 `mode` 参数选择：

| 模式 | 说明 | 适用场景 |
|------|------|---------|
| `prototype` | 只出原型，不生成前端代码 | 需求验证阶段、多方案对比、交互逻辑对齐 |
| `full` | 完整输出前端代码，跳过探索 | 需求已确认、设计方向明确、直接进入实施 |
| `progressive` | 渐进式——先探索验证，确认后自动进入完整交付（**默认推荐**） | 大多数场景，特别是需求尚未完全验证时 |

**模式选择建议**：
- 不确定选哪个 → 用 `progressive`（默认）
- 只想快速看原型 → 用 `prototype`
- 需求和设计都已确认 → 用 `full`

### prototype 模式 Pipeline

```
stage-1 → stage-1.5 → stage-p
project-init → pm-constraint-review → prototype-output
  核心           审查                原型输出
```

仅执行设计系统建立和PM约束审查，输出视觉方向+约束审查结果，不生成页面代码。

### full 模式 Pipeline

```
stage-1 → stage-1.5 → stage-2 → stage-3 → stage-4 → stage-5 → [stage-6] → [stage-7] → [stage-8]
```

跳过探索阶段，直接从设计系统建立开始完整交付。

### progressive 模式 Pipeline（默认）

```
stage-0 → stage-0.5 → stage-1 → stage-1.5 → stage-2 → stage-3 → stage-4 → stage-5 → [stage-6] → [stage-7] → [stage-8]
探索      对齐         设计系统    审查        增强        页面构建     增强         审计        按需         按需          按需
```

先自由探索设计方案，人类确认后自动进入完整交付流程。

## 执行流程（full 模式 / progressive 模式 stage-1 起）

```
stage-1          stage-1.5            stage-2                stage-3        stage-4                stage-5            stage-6          stage-7          stage-8
project-init → pm-constraint-review → ext-design-system → page-builder → ext-page-enhance → ext-quality-audit → [api-integration] → [production-ready] → ext-production-enhance
  核心           审查                  增强                   核心           增强                   审计               按需              按需               增强
```

| 阶段 | 名称 | Skill | 必选/按需 | 跳过条件 |
|------|------|-------|---------|---------|
| stage-1 | 设计系统建立 | project-init | 必选 | — |
| stage-1.5 | PM约束审查 | — | 按需 | 无PM输入（prd.json/ia_proposals/component_catalog均缺失） |
| stage-2 | 设计系统增强 | ext-ui-ux-pro-max, ext-impeccable, ext-frontend-design | 必选 | — |
| stage-3 | 页面与组件构建 | page-builder | 必选 | — |
| stage-4 | 页面组件增强 | ext-ui-ux-pro-max, ext-impeccable, ext-frontend-design, ext-interaction-design | 必选 | — |
| stage-5 | 质量审计 | ext-impeccable | 必选 | — |
| stage-6 | API集成 | api-integration | 按需 | 无后端 / 静态数据（page-builder 将自行生成数据层 fallback） |
| stage-7 | 生产就绪 | production-ready | 按需 | 无需构建部署 |
| stage-8 | 生产优化 | ext-impeccable | 按需 | stage-7被跳过时同步跳过 |

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

### 断点续执行

每个子 Skill 执行完成后，编排器将执行状态写入检查点文件，支持中断后从断点恢复。

**检查点文件**：`output/checkpoints/ui-orchestrator.json`

**检查点 Schema**：
```json
{
  "type": "object",
  "required": ["completed_stages", "pending_stages", "skipped_stages", "stage_outputs", "ext_enhancement_applied", "last_updated"],
  "properties": {
    "completed_stages": {
      "type": "array",
      "items": {"type": "string"},
      "description": "已成功完成的阶段ID列表（如 ['stage-1', 'stage-2']）"
    },
    "pending_stages": {
      "type": "array",
      "items": {"type": "string"},
      "description": "待执行的阶段ID列表（如 ['stage-3', 'stage-4']）"
    },
    "skipped_stages": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "id": {"type": "string"},
          "reason": {"type": "string"}
        }
      },
      "description": "跳过的阶段及原因"
    },
    "stage_outputs": {
      "type": "object",
      "description": "每个已完成阶段的输出文件路径，键为阶段ID，值为输出路径"
    },
    "ext_enhancement_applied": {
      "type": "object",
      "description": "ext阶段执行状态，键为阶段ID，值为该阶段ext Skill调用结果摘要",
      "properties": {
        "stage-2": {"type": "object", "description": "设计系统增强结果"},
        "stage-4": {"type": "object", "description": "页面组件增强结果"},
        "stage-5": {"type": "object", "description": "质量审计结果"},
        "stage-8": {"type": "object", "description": "生产优化结果"}
      }
    },
    "last_updated": {"type": "string", "description": "最后更新时间（ISO 8601）"}
  }
}
```

**续执行规则**：
1. 编排器启动时，检查 `output/checkpoints/ui-orchestrator.json` 是否存在
2. 若存在且有 `pending_stages`，从第一个 pending 阶段继续执行，跳过已完成的阶段
3. 每个阶段完成后立即更新检查点文件（先写文件再推进，确保断电不丢失）
4. 阶段失败时，将该阶段保留在 `pending_stages` 中，检查点记录失败原因
5. ext阶段完成后，将调用结果摘要写入 `ext_enhancement_applied` 对应字段
6. 全部阶段完成后，检查点文件保留作为执行记录

**手动恢复**：用户可通过删除检查点文件重新全量执行，或手动修改 `pending_stages` 指定从某个阶段恢复。

## Pipeline

```yaml
pipeline: ui-orchestrator
version: 5.1

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/ui/ui-orchestrator.md

stages:
  - id: stage-0
    name: "设计探索"
    depends_on: []
    skills: []
    trigger: mode=progressive
    gate:
      condition: "design_explorations.json已生成，至少2个探索方案"
      fail_action: "补充探索方案"

  - id: stage-0.5
    name: "约束对齐"
    depends_on: [stage-0]
    skills: []
    trigger: mode=progressive
    gate:
      condition: "design_decisions.json已生成，所有功能需求已覆盖"
      fail_action: "补充功能覆盖缺失项"

  - id: stage-1
    name: "设计系统建立"
    depends_on: []
    skills: [project-init]
    gate:
      condition: "visual_direction 10维度定义完成 + WCAG AA达标 + npm run dev启动成功"
      fail_action: "修复不达标项后重新验证"

  - id: stage-1.5
    name: "PM约束审查"
    depends_on: [stage-1]
    skills: []
    trigger: 有PM输入（prd.json或ia_proposals或component_catalog存在）
    gate:
      condition: "constraint_review.json已生成"
      fail_action: "标注审查未完成，不阻塞后续"

  - id: stage-2
    name: "设计系统增强"
    depends_on: [stage-1]
    skills: [ext-ui-ux-pro-max, ext-impeccable, ext-frontend-design]
    gate:
      condition: "ext-frontend-design已调用 + 色彩/排版增强已应用"
      fail_action: "核心增强(ext-frontend-design/ext-ui-ux-pro-max)失败→阻断stage-3；增强性质(colorize/typeset)失败→标注不阻断"

  - id: stage-3
    name: "页面与组件构建"
    depends_on: [stage-2]
    skills: [page-builder]
    gate:
      condition: "P0问题=0 + Token引用率100%"
      fail_action: "修复P0问题后重新验证"

  - id: stage-4
    name: "页面组件增强"
    depends_on: [stage-3]
    skills: [ext-ui-ux-pro-max, ext-impeccable, ext-frontend-design, ext-interaction-design]
    gate:
      condition: "ext-frontend-design已调用 + 视觉增强已应用"
      fail_action: "核心增强(ext-frontend-design)失败→阻断stage-5；其他增强失败→标注不阻断"

  - id: stage-5
    name: "质量审计"
    depends_on: [stage-4]
    skills: [ext-impeccable]
    gate:
      condition: "quality_score≥75（audit百分制×0.6+critique百分制×0.4）"
      fail_action: "修复后重新audit+critique，最多3次闭环"

  - id: stage-6
    name: "API集成"
    depends_on: [stage-3]
    trigger: 有后端API需要集成
    skills: [api-integration]
    gate:
      condition: "100%端点覆盖 + 类型安全 + 认证配置完成"
      fail_action: "补充缺失端点"

  - id: stage-7
    name: "生产就绪"
    depends_on: [stage-3, stage-6]
    trigger: 需要生产部署
    skills: [production-ready]
    gate:
      condition: "构建成功 + 测试覆盖率≥80% + LCP≤2.5s + 安全检查通过"
      fail_action: "修复阻断问题后重新验证"

  - id: stage-8
    name: "生产优化"
    depends_on: [stage-7]
    skills: [ext-impeccable]
    gate:
      condition: "harden+polish已完成"
      fail_action: "标注待优化项，不阻塞"
```

## 阶段执行计划

### 项目信息收集

| 输入项 | 来源 | 必选 |
|--------|------|------|
| mode | 用户提供（默认progressive） | 否 |
| 品牌规范 | 用户提供 / output/pm-strategy/positioning-strategy/positioning-strategy.json | 是 |
| 产品定位 | output/pm-strategy/positioning-strategy/positioning-strategy.json | 否 |
| 目标平台 | 用户提供 | 是 |
| 目标语言 | 用户提供（默认zh-CN） | 是 |
| project_name | 用户提供 | 是 |
| project_dir | 用户提供 | 是 |
| framework | 用户提供（React/Vue/Svelte/Next.js/Nuxt.js） | 是 |
| 组件库偏好 | 用户提供 | 否 |
| 后端集成需求 | 用户提供（有/无） | 是 |
| 部署需求 | 用户提供（有/无） | 是 |

输出: 项目信息汇总 + 阶段执行计划（根据 mode 确定哪些阶段执行/跳过）
⏸ 人类确认项目信息、执行模式和执行计划

### Stage 0: 设计探索（progressive 模式专属）

仅在 `mode=progressive` 时执行。在消费 PM 结构化数据之前，先基于非结构化的产品需求自由探索设计方案，避免 PM 产出的"认知牢笼"效应。

```
动作: 设计探索
触发条件: mode=progressive
输入:
  prd_text: output/pm-design/design-prd/prd.md（仅消费文本，不消费 prd.json）
  品牌规范: 用户提供 / output/pm-strategy/positioning-strategy/positioning-strategy.json
  产品定位: output/pm-strategy/positioning-strategy/positioning-strategy.json（可选）
  页面需求: 用户提供（可选）
处理流程:
  1. 从 prd.md 提取核心用户任务和功能需求（不参考 pages[]/functional_areas[] 的结构化划分）
  2. 基于品牌规范推导 2-3 个视觉方向候选（不同 tension_level）
  3. 为每个视觉方向生成 1 个页面布局探索方案
  4. 每个方案包含：
     - 视觉方向描述（aesthetic_direction + mood_keywords + tension_level）
     - 页面布局草图描述（区域划分 + 视觉节奏 + 交互意图）
     - 与 PRD 功能需求的覆盖映射
  5. 输出 design_explorations.json
输出: output/ui-frontend/design-exploration/design_explorations.json
验证: design_explorations.json 已生成，至少2个探索方案
模式: 🤖
```

**design_explorations.json Schema**：

```json
{
  "type": "object",
  "required": ["exploration_id", "generated_at", "explorations"],
  "properties": {
    "exploration_id": {"type": "string"},
    "generated_at": {"type": "string"},
    "source_prd": {"type": "string", "description": "来源PRD文件路径"},
    "explorations": {
      "type": "array",
      "minItems": 2,
      "maxItems": 3,
      "items": {
        "type": "object",
        "required": ["exploration_name", "visual_direction", "page_layouts", "feature_coverage", "strengths", "trade_offs"],
        "properties": {
          "exploration_name": {"type": "string", "description": "方案名称（如'极简专业风'/'活力沉浸风'）"},
          "visual_direction": {
            "type": "object",
            "description": "候选视觉方向（与 project-init 的 visual_direction 结构一致，10维度+8锚点）"
          },
          "page_layouts": {
            "type": "array",
            "description": "页面布局探索",
            "items": {
              "type": "object",
              "properties": {
                "page_name": {"type": "string"},
                "layout_description": {"type": "string", "description": "布局描述（区域划分+视觉重心+节奏）"},
                "interaction_intents": {"type": "array", "items": {"type": "string"}, "description": "交互意图"}
              }
            }
          },
          "feature_coverage": {
            "type": "array",
            "description": "PRD功能需求覆盖映射",
            "items": {
              "type": "object",
              "properties": {
                "feature": {"type": "string", "description": "PRD中的功能需求"},
                "covered_by": {"type": "string", "description": "本方案中如何覆盖该功能"}
              }
            }
          },
          "strengths": {"type": "array", "items": {"type": "string"}, "description": "方案优势"},
          "trade_offs": {"type": "array", "items": {"type": "string"}, "description": "方案取舍"}
        }
      }
    }
  }
}
```

⏸ 人类选择探索方案（选择1个或融合多个方案的特征）

### Stage 0.5: 约束对齐（progressive 模式专属）

仅在 `mode=progressive` 时执行。将人类选择的探索方案与 PM 结构化约束对齐，识别冲突并生成设计决策。

```
动作: 约束对齐
触发条件: mode=progressive，且人类已选择探索方案
输入:
  selected_exploration: 人类选择的探索方案（或融合方案）
  prd_json: output/pm-design/design-prd/prd.json（可选）
  ia_proposals: output/pm-design/design-ia/ia_proposals.json（可选）
  component_catalog: output/pm-design/design-prototype/component_catalog.json（可选）
  interaction_spec: output/pm-design/interaction-spec/interaction-spec.json（可选）
处理流程:
  1. 将探索方案的页面布局与 prd.json.pages[] 对齐
     - 标注探索方案中与 PM 页面划分一致的布局
     - 标注探索方案中与 PM 页面划分冲突的布局（如探索方案合并了 PM 的2个页面）
  2. 将探索方案的功能覆盖与 prd.json.features[] 对齐
     - 验证所有功能需求已被覆盖
     - 标注功能覆盖方式的差异
  3. 将探索方案的组件选型与 component_catalog 对齐
     - 标注与推荐类型一致的组件
     - 标注选择 alternatives 的组件
     - 标注 component_catalog 中未覆盖的新组件需求
  4. 将探索方案的交互意图与 interaction-spec 对齐
     - 标注与交互规范一致的意图
     - 标注与交互规范冲突的意图
  5. 生成 design_decisions.json（对齐过程中的设计决策）
  6. 生成 design_feedback.json（需要 PM 侧修改的建议，如有）
输出:
  output/ui-frontend/design-exploration/design_decisions.json
  output/ui-frontend/design-exploration/design_feedback.json（如有冲突需 PM 修改）
验证: design_decisions.json 已生成，所有功能需求已覆盖
模式: 🤖→👤
```

**design_decisions.json Schema**（探索阶段版本）：

```json
{
  "type": "object",
  "required": ["decisions_id", "generated_at", "alignment_results", "decisions"],
  "properties": {
    "decisions_id": {"type": "string"},
    "generated_at": {"type": "string"},
    "selected_exploration": {"type": "string", "description": "选中的探索方案名称"},
    "alignment_results": {
      "type": "object",
      "properties": {
        "page_alignment": {"type": "array", "description": "页面对齐结果（consistent/conflict列表）"},
        "feature_alignment": {"type": "array", "description": "功能覆盖对齐结果"},
        "component_alignment": {"type": "array", "description": "组件选型对齐结果"},
        "interaction_alignment": {"type": "array", "description": "交互意图对齐结果"}
      }
    },
    "decisions": {
      "type": "array",
      "description": "对齐过程中的设计决策（复用 page-builder 的 design_decisions 结构）",
      "items": {
        "type": "object",
        "required": ["pm_constraint", "ui_decision", "rationale", "impact", "constraint_source", "severity"],
        "properties": {
          "pm_constraint": {"type": "string"},
          "ui_decision": {"type": "string"},
          "rationale": {"type": "string"},
          "impact": {"type": "string"},
          "constraint_source": {"type": "string"},
          "severity": {"type": "string", "enum": ["minor", "moderate", "major", "critical"]}
        }
      }
    }
  }
}
```

⏸ 人类确认约束对齐结果和设计决策

**约束对齐后的数据流**：
- `selected_exploration.visual_direction` → 作为 stage-1 project-init 的视觉方向输入参考
- `design_decisions.json` → 传递给 stage-3 page-builder，作为 design_decisions 的初始值
- `design_feedback.json` → 回传给 design-orchestrator（复用 stage-3 的 feedback 回传机制）

### Stage 1: 设计系统建立

| 输入项 | 来源 |
|--------|------|
| 品牌规范/产品定位/目标平台/目标语言/project_name/project_dir/framework/组件库偏好 | 项目信息收集阶段确定 |
| package_manager | 用户提供（默认pnpm） |
| PRD | output/pm-design/design-prd/prd.md（可选） |
| PRD结构化数据 | output/pm-design/design-prd/prd.json（可选） |

输出: output/ui-project-init/ + 代码写入 {project_dir}/ + PRODUCT.md + DESIGN.md
验证: visual_direction 10维度定义 + WCAG AA达标 + PRODUCT.md/DESIGN.md非占位符 + 令牌文件已写入 + npm run dev启动成功
⏸ 人类确认视觉方向和品牌色

### Stage 1.5: PM约束审查（按需）

跳过条件：无PM输入（prd.json、ia_proposals.json、component_catalog.json均缺失）

在 page-builder 消费 PM 产出之前，先从 UI 设计视角审查 PM 约束的合理性，识别可能限制设计自由度的隐性约束，提前生成优化建议。

```
动作: PM约束审查
触发条件: prd.json或ia_proposals.json或component_catalog.json存在
输入:
  prd_json: output/pm-design/design-prd/prd.json（可选）
  ia_proposals: output/pm-design/design-ia/ia_proposals.json（可选）
  component_catalog: output/pm-design/design-prototype/component_catalog.json（可选）
  interaction_spec: output/pm-design/interaction-spec/interaction-spec.json（可选）
  visual_direction: output/ui-project-init/project-init.json → visual_direction
处理流程:
  1. 页面划分审查：审查 prd.json.pages[] 的页面划分是否合理
     - 是否存在可合并的页面（功能高度关联的相邻页面）
     - 是否存在需拆分的页面（功能区域过多导致单页复杂度过高）
     - 页面数量与导航深度的平衡
  2. 功能区域审查：审查 prd.json.pages[].functional_areas 的区域划分
     - 功能区域是否与用户任务流匹配
     - 是否存在可合并的功能区域
     - 功能区域数量是否过多（>5个区域建议合并）
  3. 组件选型审查：审查 component_catalog.components[] 的组件类型
     - 推荐类型是否为最优选择（结合 visual_direction.tension_level 判断）
     - alternatives 中是否有更适合当前视觉方向的方案
     - 组件数量是否过多（>15个组件建议精简）
  4. 导航结构审查：审查 ia_proposals.json 的路由层级
     - 导航深度是否过深（>3层建议扁平化）
     - 核心页面是否在2次点击内可达
  5. 交互约束审查：审查 interaction-spec.json 的状态机完整性
     - 状态机是否过于复杂（>8个状态建议简化）
     - 异常路径是否过多导致交互体验碎片化
输出: output/ui-frontend/constraint-review/constraint_review.json
验证: constraint_review.json已生成
模式: 🤖
```

**constraint_review.json Schema**：

```json
{
  "type": "object",
  "required": ["review_id", "generated_at", "reviews", "summary"],
  "properties": {
    "review_id": {"type": "string"},
    "generated_at": {"type": "string"},
    "reviews": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["dimension", "source_artifact", "findings"],
        "properties": {
          "dimension": {"type": "string", "enum": ["page_structure", "functional_areas", "component_selection", "navigation_structure", "interaction_complexity"]},
          "source_artifact": {"type": "string"},
          "findings": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["finding_id", "severity", "description", "suggestion", "rationale"],
              "properties": {
                "finding_id": {"type": "string"},
                "severity": {"type": "string", "enum": ["info", "warning", "critical"]},
                "description": {"type": "string"},
                "suggestion": {"type": "string"},
                "rationale": {"type": "string"}
              }
            }
          }
        }
      }
    },
    "summary": {"type": "string"}
  }
}
```

**审查结果消费**：
- constraint_review.json 供 stage-3 的 page-builder 消费，作为 design_decisions 和 design_feedback 的输入参考
- warning 级别 finding：page-builder 可自主决定是否采纳，记录到 design_decisions
- critical 级别 finding：page-builder 应优先采纳，并生成 design_feedback 回传 PM 侧
- info 级别 finding：仅供参考，不影响设计决策

⏸ 人类确认约束审查结果（仅 critical 级别 finding 需确认）

### Stage 2: 设计系统增强

**ext Skill 调用优先级与冲突消解**：

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
| 2.1 | ext-ui-ux-pro-max --design-system | 品牌规范+visual_direction (stage-1) | 设计系统推荐 | ≥3色彩方案+2字体配对 |
| 2.2 | ext-impeccable colorize | 色彩体系+品牌规范 (stage-1) | 色彩布局增强 | 色彩增强建议已生成 |
| 2.3 | ext-frontend-design | visual_direction+品牌规范+产品定位 (stage-1) | 美学方向审视 | 不含AI同质化特征 |
| 2.4 | ext-impeccable typeset | 排版体系+visual_direction (stage-1) | 排版层级增强 | 排版增强建议已生成 |

**强制回写步骤**（2.1-2.4全部完成后必须执行）：

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

**回写验证步骤**（回写完成后必须执行）：

| # | 验证项 | 验证方式 | 失败处理 |
|---|--------|---------|---------|
| V1 | project-init.json 语法正确 | JSON解析无报错 | 回滚回写，使用原始令牌 |
| V2 | WCAG对比度仍达标 | 正文≥4.5:1，大文本≥3:1 | 调整增强后的色值直至达标 |
| V3 | tokens.css 与 tokens.json 同步 | 两者包含相同的变量名和值 | 以tokens.json为准重新生成tokens.css |
| V4 | 无新增硬编码值 | 增强后的令牌值均为变量引用 | 移除硬编码值替换为变量引用 |
| V5 | visual_direction 语义一致性 | aesthetic_direction与tension_level不矛盾 | 标注矛盾项，⏸人类确认 |

**设计简报生成**（将 ext 输出转化为可执行设计规范）：

回写完成后，将所有 ext Skill 的输出整合为 `design_brief.json`——一份可直接指导 page-builder 代码生成的可执行设计规范。这是解决"建议-执行断裂"的关键机制：ext 的建议不再是"供参考的文字描述"，而是"可直接消费的结构化规范"。

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

**design_brief.json Schema**：

```json
{
  "type": "object",
  "required": ["brief_id", "generated_at", "color_specifications", "typography_specifications", "layout_instructions", "component_specifications", "animation_specifications", "brand_color_strategy", "visual_bans", "differentiation_direction"],
  "properties": {
    "brief_id": {"type": "string"},
    "generated_at": {"type": "string"},
    "color_specifications": {
      "type": "object",
      "description": "具体CSS色值规范，替代令牌推导值",
      "properties": {
        "background_primary": {"type": "string", "description": "主背景色（如oklch(99% 0.002 60)）"},
        "background_secondary": {"type": "string", "description": "次背景色"},
        "surface_elevated": {"type": "string", "description": "提升面背景色"},
        "text_primary": {"type": "string", "description": "主文本色"},
        "text_secondary": {"type": "string", "description": "次文本色"},
        "brand_primary": {"type": "string", "description": "品牌主色"},
        "brand_secondary": {"type": "string", "description": "品牌辅色"},
        "accent": {"type": "string", "description": "强调色"},
        "success": {"type": "string", "description": "成功色"},
        "warning": {"type": "string", "description": "警告色"},
        "error": {"type": "string", "description": "错误色"},
        "border": {"type": "string", "description": "边框色"},
        "gradient_hero": {"type": "string", "description": "Hero区域渐变（如linear-gradient(...)）"}
      }
    },
    "typography_specifications": {
      "type": "object",
      "description": "具体排版规范",
      "properties": {
        "font_families": {
          "type": "object",
          "properties": {
            "heading": {"type": "string", "description": "标题字体（如'DM Sans'）"},
            "body": {"type": "string", "description": "正文字体"},
            "mono": {"type": "string", "description": "等宽字体"}
          }
        },
        "type_scale_values": {
          "type": "object",
          "properties": {
            "h1": {"type": "string", "description": "如48px/700/1.1"},
            "h2": {"type": "string"},
            "h3": {"type": "string"},
            "body_large": {"type": "string"},
            "body": {"type": "string"},
            "body_small": {"type": "string"},
            "caption": {"type": "string"}
          }
        }
      }
    },
    "layout_instructions": {
      "type": "array",
      "description": "页面布局指令",
      "items": {
        "type": "object",
        "properties": {
          "page": {"type": "string", "description": "页面名称"},
          "layout_type": {"type": "string", "description": "布局类型（如asymmetric-hero/sidebar-main/fullscreen-cta）"},
          "visual_focus": {"type": "string", "description": "视觉焦点区域"},
          "grid_config": {"type": "string", "description": "网格配置（如12col/240px-sidebar/1fr）"},
          "breakpoints": {"type": "object", "description": "响应式断点配置"}
        }
      }
    },
    "component_specifications": {
      "type": "array",
      "description": "组件级设计规范",
      "items": {
        "type": "object",
        "properties": {
          "component": {"type": "string", "description": "组件名称"},
          "variant": {"type": "string", "description": "变体（如primary/secondary/ghost）"},
          "structure": {"type": "string", "description": "组件结构描述"},
          "states": {"type": "array", "items": {"type": "string"}, "description": "必须实现的状态"},
          "specific_values": {"type": "object", "description": "具体CSS值（如border-radius: 12px, padding: 16px 24px）"}
        }
      }
    },
    "animation_specifications": {
      "type": "array",
      "description": "动效规范",
      "items": {
        "type": "object",
        "properties": {
          "element": {"type": "string", "description": "应用动效的元素"},
          "trigger": {"type": "string", "description": "触发条件"},
          "animation": {"type": "string", "description": "动效描述（如fade-in-up 0.4s ease-out）"},
          "duration": {"type": "string", "description": "时长（如300ms）"},
          "easing": {"type": "string", "description": "缓动函数（如cubic-bezier(0.16, 1, 0.3, 1)）"},
          "delay": {"type": "string", "description": "延迟（如100ms stagger）"}
        }
      }
    },
    "brand_color_strategy": {
      "type": "object",
      "description": "品牌色分布策略",
      "properties": {
        "usage_mode": {"type": "string", "description": "accent/spotlight/flood"},
        "target_percentage": {"type": "number", "description": "品牌色占页面面积目标百分比"},
        "distribution": {"type": "array", "items": {"type": "object", "properties": {"area": {"type": "string"}, "usage": {"type": "string"}}}, "description": "各区域品牌色使用方式"}
      }
    },
    "visual_bans": {
      "type": "array",
      "items": {"type": "string"},
      "description": "绝对禁止的视觉模式（如'均匀卡片网格'/'蓝紫渐变白底'/'Inter字体'）"
    },
    "differentiation_direction": {
      "type": "string",
      "description": "差异化方向描述（如'暖色调+大字号跳跃+不对称布局'）"
    }
  }
}
```

⏸ 人类确认设计系统增强结果（含回写后的最终令牌和视觉方向）

### Stage 3: 页面与组件构建（消费设计简报）

**核心变化**：page-builder 现在直接消费 Stage 2 产出的 design_brief.json，将 ext 的设计决策内建于代码生成过程，而非事后打补丁。

| 输入项 | 来源 |
|--------|------|
| 页面需求 | 用户提供 / output/pm-design/design-prd/prd.md |
| 视觉方向/设计令牌/组件库 | output/ui-project-init/project-init.json |
| **设计简报** | **output/ui-frontend/design-brief/design_brief.json（Stage 2 产出）** |
| 目标框架/目标语言/project_dir | 项目信息收集阶段确定 |
| PRD | output/pm-design/design-prd/prd.md（可选） |
| PRD结构化数据 | output/pm-design/design-prd/prd.json（可选） |
| 路由结构 | output/pm-design/design-ia/ia_proposals.json（可选） |
| 交互规范 | output/pm-design/interaction-spec/interaction-spec.md（可选） |

**page-builder 执行模式**：

当 design_brief.json 存在时，page-builder 进入"设计简报驱动模式"：
1. Step 1 页面结构规划：消费 design_brief.layout_instructions 和 brand_color_strategy
2. Step 2 组件生成：消费 design_brief.component_specifications 和 color_specifications/typography_specifications
3. Step 3 页面组装：消费 design_brief.animation_specifications
4. Step 4 质量检查：额外验证 design_brief.visual_bans 和 differentiation_direction

当 design_brief.json 不存在时，page-builder 退回"令牌驱动模式"（仅消费 visual_direction + tokens）。

输出: output/ui-frontend/page-builder/ + 代码写入 {project_dir}/src/
验证: P0问题=0 + Token引用率100% + WCAG AA达标 + 响应式375/768/1024px
⏸ 人类确认页面布局和组件方案

**design_feedback 回传处理**（UI→PM反向反馈通道）：

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

### Stage 4: 页面组件增强

**ext 调用依赖关系**（必须按依赖顺序执行）：

```
4.1 ext-ui-ux-pro-max ──┐
4.2 ext-impeccable layout ─┤ 无依赖，可并行
                          ├──→ 4.3 ext-impeccable shape ──→ 4.5 ext-interaction-design
                          │         │
                          │         └──→ 4.4 ext-frontend-design ──→ 4.6 ext-impeccable animate
                          │
                          └──→ 4.7 ext-impeccable {clarify|onboard|distill}
```

| # | Skill | 输入 | 输出 | 验证 | 依赖 | 备注 |
|---|-------|------|------|------|------|------|
| 4.1 | ext-ui-ux-pro-max --domain | 页面结构+行业关键词 (stage-3/收集) | 页面结构推荐 | 推荐已生成 | 无 | |
| 4.2 | ext-impeccable layout adapt | 页面布局+视觉节奏 (stage-3) | 布局优化+响应式适配 | 布局增强已生成 | 无 | |
| 4.3 | ext-impeccable shape | 组件规格 (stage-3) | 状态机+交互流程 | shape规划已生成 | 4.1, 4.2 | 纯静态原子组件可跳过 |
| 4.4 | ext-frontend-design | 组件代码+visual_direction (stage-3/1) | 美学审视 | 不含AI同质化 | 4.3 | |
| 4.5 | ext-interaction-design | 组件交互需求+状态机 (stage-3/4.3) | 交互动效模式 | 交互模式已生成 | 4.3 | 纯静态无交互可跳过 |
| 4.6 | ext-impeccable animate {bolder\|quieter\|delight} | 组件代码+visual_direction+品牌色占比 (stage-3/1) | 视觉增强 | 增强已应用 | 4.4 | 品牌色<25%→bolder, >40%→quieter, 核心流程→delight |
| 4.7 | ext-impeccable {clarify\|onboard\|distill} | 页面代码 (stage-3) | UX文案优化+精简 | 优化建议已生成 | 无 | 表单/空状态/错误→clarify, 首页/注册→onboard, 组件>10→distill |

### Stage 5: 质量审计

**统一评分体系**：ext-impeccable 的 audit（技术质量，原20分制）和 critique（设计品味，原40分制）统一换算为百分制，编排器门禁使用百分制。

| 评分维度 | 原始分制 | 百分制换算 | 评估内容 |
|----------|---------|-----------|---------|
| audit（技术质量） | 0-20 | ×5 → 0-100 | A11y/Perf/Theming/Responsive/AntiPatterns |
| critique（设计品味） | 0-40 | ×2.5 → 0-100 | Nielsen 10启发式 |

**综合质量评分**：`quality_score = audit_percent × 0.6 + critique_percent × 0.4`

| # | Skill | 输入 | 输出 | 验证 | 备注 |
|---|-------|------|------|------|------|
| 5.1 | ext-impeccable audit | 全部代码 (stage-3) | 技术质量评分+问题清单 | audit_percent≥75 | 百分制 |
| 5.2 | ext-impeccable critique | 全部代码+audit报告 (stage-5.1) | 设计品味评分+修复建议 | critique_percent≥70 | 百分制，始终执行（不依赖audit结果触发） |
| 5.3 | 修复闭环 | audit+critique问题清单 (5.1+5.2) | 修复后代码 | quality_score≥75 | 最多3次闭环，3次后仍不达标标注"待人类确认" |

**闭环规则**：
- 每次闭环：修复audit和critique发现的问题 → 重新audit+critique → 计算quality_score
- 最多3次闭环
- 3次后quality_score仍<75：标注"待人类确认"，⏸ 人类决定放行或继续修复
- quality_score≥75但单项audit_percent<60或critique_percent<50：标注"偏科风险"，⏸ 人类确认

### Stage 6: API集成（按需）

跳过条件：无后端API或使用静态数据

| 输入项 | 来源 |
|--------|------|
| API契约 | output/backend-api-design/api-design-spec/（可选） |
| 页面数据流 | output/ui-frontend/page-builder/pages.json |
| 目标框架/目标语言/project_dir | 项目信息收集阶段确定 |

输出: output/ui-frontend-integration/api-integration/ + 代码写入 {project_dir}/src/api/
验证: 100%端点有请求函数 + 100%有TypeScript类型 + Mock数据覆盖所有端点

### Stage 7: 生产就绪（按需）

跳过条件：无需构建部署

| 输入项 | 来源 |
|--------|------|
| 前端代码 | output/ui-frontend/page-builder/ |
| API集成 | output/ui-frontend-integration/api-integration/（可选） |
| 目标框架/部署目标/目标语言/project_dir | 项目信息收集阶段确定 / 用户提供 |

输出: output/ui-frontend-integration/production-ready/ + 配置/测试/CI写入 {project_dir}/
验证: 构建成功 + 测试覆盖率≥80% + LCP≤2.5s + 性能预算写入CI
⏸ 人类确认发布决策

### Stage 8: 生产优化（按需）

跳过条件：stage-7被跳过时同步跳过

| # | Skill | 输入 | 输出 | 验证 | 备注 |
|---|-------|------|------|------|------|
| 8.1 | ext-impeccable {harden\|polish} | 代码+构建配置 (stage-7) | 生产就绪化增强 | harden+polish已生成 | 有表单/异步/i18n→harden，始终→polish |
| 8.2 | ext-impeccable optimize | 性能报告 (stage-7) | UI渲染性能优化 | 优化建议已生成 | 性能瓶颈为网络延迟或包体积时跳过 |

### 阶段总结（post_pipeline）

输入: 所有子Skill输出 + 执行计划 + 人类决策记录 + ext增强记录
输出: output/phase-reports/ui/ui-orchestrator.md
验证: 阶段总结文档已生成，6项结构均非空
下游衔接:
  primary:
    target: release-orchestrator
    reason: UI开发完成后，进入质量验收和发布流程
    input_mapping:
      ui_output: "output/ui-frontend/ → release-orchestrator输入"
  alternatives:
    - target: api-integration
      reason: 后端API已就绪，需要前后端联调集成
      condition: 有后端API但尚未集成时
    - target: monitoring-orchestrator
      reason: UI上线后建立前端性能和用户体验监控
      condition: 前端已部署需要持续监控时

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 执行模式确认 | 项目信息收集完成时 | 确认执行模式（prototype/full/progressive） |
| 探索方案选择 | stage-0后，mode=progressive | 选择探索方案或融合多个方案 |
| 约束对齐确认 | stage-0.5后，mode=progressive | 确认约束对齐结果和设计决策 |
| 视觉方向确认 | stage-1后，stage-2前 | 确认核心视觉方向 |
| PM约束审查确认 | stage-1.5后，critical级别finding存在时 | 确认约束审查中的critical发现 |
| 设计系统增强确认 | stage-2后，stage-3前 | 确认ext增强结果 |
| 页面方案确认 | stage-3后，stage-4前 | 确认页面布局和组件 |
| PM反馈确认 | stage-3后，design_feedback.json存在时 | 确认是否接受UI→PM的反馈建议 |
| 发布决策 | stage-7后 | 确认是否发布 |

## 异常处理

**质量债务追踪**：所有降级、标注"待修复"、"待确认"的问题统一写入 `output/ui-frontend/quality_debt.json`，确保降级问题不被遗忘。

```json
{
  "type": "object",
  "required": ["debt_items"],
  "properties": {
    "debt_items": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "stage", "description", "severity", "status", "created_at"],
        "properties": {
          "id": {"type": "string"},
          "stage": {"type": "string", "description": "产生债务的阶段（如stage-2）"},
          "description": {"type": "string", "description": "债务描述"},
          "severity": {"type": "string", "enum": ["low", "medium", "high"]},
          "status": {"type": "string", "enum": ["open", "resolved", "deferred"]},
          "created_at": {"type": "string"},
          "resolved_at": {"type": "string"},
          "resolution": {"type": "string"}
        }
      }
    }
  }
}
```

**债务管理规则**：
- 每个降级/标注项产生一条 debt_item
- stage-7（production-ready）执行前汇总检查 quality_debt.json
- high severity 的 open 债务 → ⏸ 人类确认是否继续
- medium severity 的 open 债务 → 标注在阶段总结中
- low severity 的 open 债务 → 记录但不阻塞

| 异常类型 | 处理策略 | 债务记录 |
|----------|----------|----------|
| 项目信息不足 | 提示用户补充，必选项缺失不可继续 | — |
| stage-1 失败 | 修复后重试，不可跳过 | — |
| stage-2 核心增强失败 | ext-frontend-design/ext-ui-ux-pro-max失败→阻断stage-3；colorize/typeset失败→标注不阻断 | colorize/typeset失败→medium |
| stage-3 P0问题 | 必须修复，不可跳过 | — |
| stage-4 核心增强失败 | ext-frontend-design失败→阻断stage-5；其他增强失败→标注不阻断 | 其他增强失败→medium |
| stage-5 quality_score<75 | 修复后重新audit+critique，最多3次闭环，3次后⏸人类确认 | 3次后仍不达标→high |
| stage-6 api-integration 失败 | 标注"待重试"，不阻塞stage-7 | medium |
| stage-7 构建失败 | 修复后重试 | — |
| stage-8 ext调用失败 | 标注待优化项，不阻塞 | low |
| 阶段总结生成失败 | 基于已完成的输出生成部分总结 |

## 变更记录

- v6.0: 核心架构重构——解决"建议-执行断裂"问题：(1) Stage 2新增design_brief.json生成机制，将ext输出从建议转化为可执行设计规范；(2) Stage 3 page-builder消费design_brief进入设计简报驱动模式；(3) ext-frontend-design输出增加executable_specifications字段；(4) ext Skill冲突消解优先级规则（ext-frontend-design>ext-ui-ux-pro-max>ext-impeccable）；(5) Stage 4 ext调用增加依赖声明
- v5.1: 质量保证体系强化——统一评分体系为百分制（audit×5+critique×2.5，综合=audit×0.6+critique×0.4）；critique独立于audit始终执行；stage-2/4增强失败分严重度处理（核心增强失败→阻断）；ext增强回写增加5项验证步骤；stage-4 ext调用增加依赖声明；质量债务追踪机制（quality_debt.json）；闭环次数2→3次+偏科风险检测
- v5.0: 新增三种执行模式（prototype/full/progressive），progressive为默认推荐；新增Stage 0设计探索（自由探索2-3个方案避免PM认知牢笼）+Stage 0.5约束对齐（探索方案与PM约束对齐生成设计决策）；项目信息收集新增mode参数；人类决策点新增执行模式确认、探索方案选择、约束对齐确认
- v4.1: 新增design_feedback回传机制（UI→PM反向反馈通道），Stage 3后检测feedback文件并人类确认回传；新增Stage 1.5 PM约束审查（constraint_review.json），5维度审查PM产出合理性；人类决策点新增PM反馈确认和约束审查确认
- v4.0: ext skill调用从Pipeline Skill内部移到编排器阶段；4阶段→8阶段（核心+ext交替）；新增5个人类决策点；检查点Schema增加ext_enhancement_applied字段
- v3.4: PM输入精简（project-init移除handoff-spec；page-builder移除prototype-spec/userflow）；PM→UI职责边界明确化（PM定义产品需求，UI决定实现方式）
- v3.3: 新增断点续执行机制（检查点文件+续执行规则）；api-integration跳过条件补充page-builder数据层fallback说明
- v3.2: project-init输入新增handoff-spec；page-builder输入新增userflow和interaction-spec
- v3.1: 卡口新增美学验证和audit评分要求；目录结构扁平化（移除skills/中间层）
- v3.0: 精简为1层编排器+4个Skill；取消L1/L2分级改为按需跳过；取消3个子编排器；新增视觉方向定义；ext-frontend-design改为必调
- v2.1: L2模式移除重复的project-scaffold调用
- v2.0: L1/L2模式增加project-scaffold；所有子Skill传递project_dir
- v1.0: 初始版本
