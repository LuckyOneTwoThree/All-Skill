---
name: ui-orchestrator
description: 当需要UI设计与前端开发时使用。UI设计与前端开发编排器，按需调度核心Skill与ext Skill完成从项目初始化到生产就绪的全流程。关键词：UI设计、前端开发、UI、前端、界面开发、做UI、写前端、出界面、搭页面、设计系统+前端代码。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI总指挥"
  type: "orchestrator"
  version: "4.0"
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

## 执行流程

```
stage-1          stage-2                stage-3        stage-4                stage-5            stage-6          stage-7          stage-8
project-init → ext-design-system → page-builder → ext-page-enhance → ext-quality-audit → [api-integration] → [production-ready] → ext-production-enhance
  核心           增强                   核心           增强                   审计               按需              按需               增强
```

| 阶段 | 名称 | Skill | 必选/按需 | 跳过条件 |
|------|------|-------|---------|---------|
| stage-1 | 设计系统建立 | project-init | 必选 | — |
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
version: 4.0

post_pipeline:
  - action: stage-summary
    output: output/phase-reports/ui/ui-orchestrator.md

stages:
  - id: stage-1
    name: "设计系统建立"
    depends_on: []
    skills: [project-init]
    gate:
      condition: "visual_direction 10维度定义完成 + WCAG AA达标 + npm run dev启动成功"
      fail_action: "修复不达标项后重新验证"

  - id: stage-2
    name: "设计系统增强"
    depends_on: [stage-1]
    skills: [ext-ui-ux-pro-max, ext-impeccable, ext-frontend-design]
    gate:
      condition: "ext-frontend-design已调用 + 色彩/排版增强已应用"
      fail_action: "标注待增强项，不阻塞后续"

  - id: stage-3
    name: "页面与组件构建"
    depends_on: [stage-2]
    skills: [page-builder]
    gate:
      condition: "P0问题=0 + Token引用率100% + audit≥75"
      fail_action: "修复P0问题后重新验证"

  - id: stage-4
    name: "页面组件增强"
    depends_on: [stage-3]
    skills: [ext-ui-ux-pro-max, ext-impeccable, ext-frontend-design, ext-interaction-design]
    gate:
      condition: "ext-frontend-design已调用 + 视觉增强已应用"
      fail_action: "标注待增强项，不阻塞后续"

  - id: stage-5
    name: "质量审计"
    depends_on: [stage-4]
    skills: [ext-impeccable]
    gate:
      condition: "audit评分≥75"
      fail_action: "critique修复后重新审计"

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

输出: 项目信息汇总 + 阶段执行计划（哪些阶段跳过）
⏸ 人类确认项目信息和执行计划

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

### Stage 2: 设计系统增强

| # | Skill | 输入 | 输出 | 验证 |
|---|-------|------|------|------|
| 2.1 | ext-ui-ux-pro-max --design-system | 品牌规范+visual_direction (stage-1) | 设计系统推荐 | ≥3色彩方案+2字体配对 |
| 2.2 | ext-impeccable colorize | 色彩体系+品牌规范 (stage-1) | 色彩布局增强 | 色彩增强建议已生成 |
| 2.3 | ext-frontend-design | visual_direction+品牌规范+产品定位 (stage-1) | 美学方向审视 | 不含AI同质化特征 |
| 2.4 | ext-impeccable typeset | 排版体系+visual_direction (stage-1) | 排版层级增强 | 排版增强建议已生成 |

⏸ 人类确认设计系统增强结果

### Stage 3: 页面与组件构建

| 输入项 | 来源 |
|--------|------|
| 页面需求 | 用户提供 / output/pm-design/design-prd/prd.md |
| 视觉方向/设计令牌/组件库 | output/ui-project-init/project-init.json |
| 目标框架/目标语言/project_dir | 项目信息收集阶段确定 |
| PRD | output/pm-design/design-prd/prd.md（可选） |
| PRD结构化数据 | output/pm-design/design-prd/prd.json（可选） |
| 路由结构 | output/pm-design/design-ia/ia_proposals.json（可选） |
| 交互规范 | output/pm-design/interaction-spec/interaction-spec.md（可选） |

输出: output/ui-frontend/page-builder/ + 代码写入 {project_dir}/src/
验证: P0问题=0 + Token引用率100% + WCAG AA达标 + 响应式375/768/1024px + audit≥75
⏸ 人类确认页面布局和组件方案

### Stage 4: 页面组件增强

| # | Skill | 输入 | 输出 | 验证 | 备注 |
|---|-------|------|------|------|------|
| 4.1 | ext-ui-ux-pro-max --domain | 页面结构+行业关键词 (stage-3/收集) | 页面结构推荐 | 推荐已生成 | |
| 4.2 | ext-impeccable layout adapt | 页面布局+视觉节奏 (stage-3) | 布局优化+响应式适配 | 布局增强已生成 | |
| 4.3 | ext-impeccable shape | 组件规格 (stage-3) | 状态机+交互流程 | shape规划已生成 | 纯静态原子组件可跳过 |
| 4.4 | ext-frontend-design | 组件代码+visual_direction (stage-3/1) | 美学审视 | 不含AI同质化 | |
| 4.5 | ext-interaction-design | 组件交互需求+状态机 (stage-3/4.3) | 交互动效模式 | 交互模式已生成 | 纯静态无交互可跳过 |
| 4.6 | ext-impeccable animate {bolder\|quieter\|delight} | 组件代码+visual_direction+品牌色占比 (stage-3/1) | 视觉增强 | 增强已应用 | 品牌色<25%→bolder, >40%→quieter, 核心流程→delight |
| 4.7 | ext-impeccable {clarify\|onboard\|distill} | 页面代码 (stage-3) | UX文案优化+精简 | 优化建议已生成 | 表单/空状态/错误→clarify, 首页/注册→onboard, 组件>10→distill |

### Stage 5: 质量审计

| # | Skill | 输入 | 输出 | 验证 | 备注 |
|---|-------|------|------|------|------|
| 5.1 | ext-impeccable audit | 全部代码 (stage-3) | 质量评分+问题清单 | audit≥75 | |
| 5.2 | ext-impeccable critique | audit报告+问题代码 (stage-5.1) | 修复后代码 | re-audit≥75 | audit<75时触发，最多2次闭环，2次后仍<75标注"待人类确认" |

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
| 执行计划确认 | stage-1前，项目信息收集完成时 | 确认项目配置和设计方向 |
| 视觉方向确认 | stage-1后，stage-2前 | 确认核心视觉方向 |
| 设计系统增强确认 | stage-2后，stage-3前 | 确认ext增强结果 |
| 页面方案确认 | stage-3后，stage-4前 | 确认页面布局和组件 |
| 发布决策 | stage-7后 | 确认是否发布 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 项目信息不足 | 提示用户补充，必选项缺失不可继续 |
| stage-1 失败 | 修复后重试，不可跳过 |
| stage-2 ext调用失败 | 标注待增强项，不阻塞stage-3 |
| stage-3 P0问题 | 必须修复，不可跳过 |
| stage-4 ext调用失败 | 标注待增强项，不阻塞stage-5 |
| stage-5 audit评分<75 | critique修复后重新审计，最多2次闭环 |
| stage-6 api-integration 失败 | 标注"待重试"，不阻塞stage-7 |
| stage-7 构建失败 | 修复后重试 |
| stage-8 ext调用失败 | 标注待优化项，不阻塞 |
| 阶段总结生成失败 | 基于已完成的输出生成部分总结 |

## 变更记录

- v4.0: ext skill调用从Pipeline Skill内部移到编排器阶段；4阶段→8阶段（核心+ext交替）；新增5个人类决策点；检查点Schema增加ext_enhancement_applied字段
- v3.4: PM输入精简（project-init移除handoff-spec；page-builder移除prototype-spec/userflow）；PM→UI职责边界明确化（PM定义产品需求，UI决定实现方式）
- v3.3: 新增断点续执行机制（检查点文件+续执行规则）；api-integration跳过条件补充page-builder数据层fallback说明
- v3.2: project-init输入新增handoff-spec；page-builder输入新增userflow和interaction-spec
- v3.1: 卡口新增美学验证和audit评分要求；目录结构扁平化（移除skills/中间层）
- v3.0: 精简为1层编排器+4个Skill；取消L1/L2分级改为按需跳过；取消3个子编排器；新增视觉方向定义；ext-frontend-design改为必调
- v2.1: L2模式移除重复的project-scaffold调用
- v2.0: L1/L2模式增加project-scaffold；所有子Skill传递project_dir
- v1.0: 初始版本
