---
name: ui-orchestrator
description: 当需要UI设计与前端开发时使用。UI设计与前端开发编排器，按需调度4个Skill完成从项目初始化到生产就绪的全流程。关键词：UI设计、前端开发、UI、前端、界面开发、做UI、写前端、出界面、搭页面、设计系统+前端代码。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI总指挥"
  type: "orchestrator"
  version: "3.4"
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

按需执行——只运行项目需要的步骤，不执行不需要的阶段。

## 执行流程

```
project-init → page-builder → [api-integration] → [production-ready]
                                 ↑按需             ↑按需
```

| 阶段 | Skill | 必选/按需 | 跳过条件 |
|------|-------|---------|---------|
| 项目初始化与视觉定义 | project-init | 必选 | — |
| 页面与组件构建 | page-builder | 必选 | — |
| API集成 | api-integration | 按需 | 无后端 / 静态数据（page-builder 将自行生成数据层 fallback） |
| 生产就绪 | production-ready | 按需 | 无需构建部署 |

## 编排协议

编排协议遵循 [orchestrator-protocol.md](../../templates/orchestrator-protocol.md) 统一标准。

### 断点续执行

每个子 Skill 执行完成后，编排器将执行状态写入检查点文件，支持中断后从断点恢复。

**检查点文件**：`output/checkpoints/ui-orchestrator.json`

**检查点 Schema**：
```json
{
  "type": "object",
  "required": ["completed_stages", "pending_stages", "skipped_stages", "stage_outputs", "last_updated"],
  "properties": {
    "completed_stages": {
      "type": "array",
      "items": {"type": "string"},
      "description": "已成功完成的阶段ID列表（如 ['project-init', 'page-builder']）"
    },
    "pending_stages": {
      "type": "array",
      "items": {"type": "string"},
      "description": "待执行的阶段ID列表（如 ['api-integration', 'production-ready']）"
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
    "last_updated": {"type": "string", "description": "最后更新时间（ISO 8601）"}
  }
}
```

**续执行规则**：
1. 编排器启动时，检查 `output/checkpoints/ui-orchestrator.json` 是否存在
2. 若存在且有 `pending_stages`，从第一个 pending 阶段继续执行，跳过已完成的阶段
3. 每个阶段完成后立即更新检查点文件（先写文件再推进，确保断电不丢失）
4. 阶段失败时，将该阶段保留在 `pending_stages` 中，检查点记录失败原因
5. 全部阶段完成后，检查点文件保留作为执行记录

**手动恢复**：用户可通过删除检查点文件重新全量执行，或手动修改 `pending_stages` 指定从某个阶段恢复。
## Pipeline

```yaml
pipeline:
  post_pipeline:
    - action: stage-summary
      output: output/phase-reports/ui/ui-orchestrator.md
  stages:
    - id: project-init
      name: 项目初始化与视觉定义
      depends_on: []
    - id: page-builder
      name: 页面与组件构建
      depends_on: [project-init]
    - id: api-integration
      name: API集成
      depends_on: [page-builder]
      skip_when: "无后端API或使用静态数据"
    - id: production-ready
      name: 生产就绪
      depends_on: [page-builder]
      skip_when: "无需构建部署"
```

## 阶段执行计划

### 项目信息收集

```
动作: 收集项目信息
输入:
  品牌规范: 用户提供 / output/pm-strategy/positioning-strategy/positioning-strategy.json
  产品定位: output/pm-strategy/positioning-strategy/positioning-strategy.json（可选）
  目标平台: 用户提供
  目标语言: 用户提供（默认zh-CN）
  project_name: 用户提供
  project_dir: 用户提供
  framework: 用户提供（React/Vue/Svelte/Next.js/Nuxt.js）
  组件库偏好: 用户提供（可选）
  后端集成需求: 用户提供（有/无）
  部署需求: 用户提供（有/无）
输出: 项目信息汇总 + 阶段执行计划（哪些阶段跳过）
验证: 必选信息已收集 + 阶段执行计划已确定
模式: 🤖→👤
```

⏸ **卡口**：人类确认项目信息和执行计划 → 未确认：补充信息后重新收集

### 调用 project-init

```
Skill: project-init
输入:
  品牌规范: 项目信息收集阶段确定
  产品定位: 项目信息收集阶段确定（可选）
  目标平台: 项目信息收集阶段确定
  目标语言: 项目信息收集阶段确定
  project_name: 项目信息收集阶段确定
  project_dir: 项目信息收集阶段确定
  framework: 项目信息收集阶段确定
  package_manager: 用户提供（可选，默认pnpm）
  组件库偏好: 项目信息收集阶段确定（可选）
  PRD: output/pm-design/design-prd/prd.md（可选）
输出: output/ui-project-init/ + 代码写入 {project_dir}/ + PRODUCT.md + DESIGN.md
验证: visual_direction 10个维度均有定义 + ext-frontend-design已调用 + ext-frontend-design输出已写入visual_bans + WCAG AA对比度100%达标 + PRODUCT.md和DESIGN.md已生成且非占位符 + 令牌文件已写入 + npm run dev启动成功
模式: 🤖→👤
```

⏸ **卡口**：人类确认视觉方向和品牌色 → 未确认：调整后重新生成

### 调用 page-builder

```
Skill: page-builder
输入:
  页面需求: 用户提供 / output/pm-design/design-prd/prd.md
  视觉方向: output/ui-project-init/project-init.json → visual_direction
  设计令牌: output/ui-project-init/project-init.json → tokens
  组件库: output/ui-project-init/project-init.json → component_library
  目标框架: 项目信息收集阶段确定
  目标语言: 项目信息收集阶段确定
  project_dir: 项目信息收集阶段确定
  PRD: output/pm-design/design-prd/prd.md（可选）
  路由结构: output/pm-design/design-ia/ia_proposals.json（可选）
  交互规范: output/pm-design/design-interaction-spec/interaction_spec.md（可选）
输出: output/ui-frontend/page-builder/ + 代码写入 {project_dir}/src/
验证: 内建质量门禁P0问题=0 + Token引用率100% + WCAG AA达标 + 响应式覆盖375px/768px/1024px + 美学验证通过 + audit设计品味评分≥75分
模式: 🤖→👤
```

⏸ **卡口**：人类确认页面布局和组件方案 → 未确认：调整后重新生成

### 调用 api-integration（按需）

**跳过条件**：无后端API或使用静态数据

```
Skill: api-integration
输入:
  API契约: output/backend-api-design/api-design-spec/（可选）
  页面数据流: output/ui-frontend/page-builder/pages.json
  目标框架: 项目信息收集阶段确定
  目标语言: 项目信息收集阶段确定
  project_dir: 项目信息收集阶段确定
输出: output/ui-frontend-integration/api-integration/ + 代码写入 {project_dir}/src/api/
验证: 100%端点有请求函数 + 100%有TypeScript类型 + Mock数据覆盖所有端点
模式: 🤖
```

### 调用 production-ready（按需）

**跳过条件**：无需构建部署（如仅需代码输出）

```
Skill: production-ready
输入:
  前端代码: output/ui-frontend/page-builder/
  API集成: output/ui-frontend-integration/api-integration/（可选）
  目标框架: 项目信息收集阶段确定
  部署目标: 用户提供（可选）
  目标语言: 项目信息收集阶段确定
  project_dir: 项目信息收集阶段确定
输出: output/ui-frontend-integration/production-ready/ + 配置/测试/CI写入 {project_dir}/
验证: 构建成功 + 测试覆盖率≥80% + LCP≤2.5s + 性能预算写入CI
模式: 🤖
```

### 阶段总结（post_pipeline）

```
动作: 生成阶段总结
输入:
  所有子Skill输出: output/ui-project-init/、output/ui-frontend/、output/ui-frontend-integration/
  执行计划: 哪些阶段执行/跳过
  人类决策记录: 本轮执行中的人类决策点及结果
输出: output/phase-reports/ui/ui-orchestrator.md
验证: 阶段总结文档已生成，6项结构均非空
模式: 🤖
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| 项目信息收集完成 | 必选信息已收集 + 人类确认执行计划 | 补充信息后重新收集 |
| project-init 完成 | ui-project-init输出文件已生成且非空 | 调整视觉方向或修复令牌 |
| page-builder 完成 | ui-frontend/page-builder输出文件已生成且非空 | P0问题必须修复；美学不达标触发critique闭环 |
| api-integration 完成 | ui-frontend-integration/api-integration输出文件已生成且非空 | 补充缺失端点 |
| production-ready 完成 | ui-frontend-integration/production-ready输出文件已生成且非空 | 构建失败修复重试；性能不达标优化重测 |
| 阶段总结已生成 | 6项结构均非空 | 补充缺失项后重新生成 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| 执行计划确认 | 项目信息收集完成时 | 确认哪些阶段执行/跳过 |
| 视觉方向确认 | project-init Step 2时 | 确认美学方向、色彩策略、视觉禁忌 |
| 页面方案确认 | page-builder Step 1时 | 确认页面布局和组件方案 |
| 部署目标选择 | production-ready执行时 | 确认部署环境 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| 项目信息不足 | 提示用户补充，必选项缺失不可继续 |
| project-init 失败 | 修复后重试，不可跳过 |
| page-builder P0问题 | 必须修复，不可跳过 |
| api-integration 失败 | 标注"待重试"，不阻塞production-ready |
| production-ready 构建失败 | 修复后重试 |
| 阶段总结生成失败 | 基于已完成的输出生成部分总结 |

## 变更记录

- v3.4: PM输入精简（project-init移除handoff-spec；page-builder移除prototype-spec/userflow）；PM→UI职责边界明确化（PM定义产品需求，UI决定实现方式）
- v3.3: 新增断点续执行机制（检查点文件+续执行规则）；api-integration跳过条件补充page-builder数据层fallback说明
- v3.2: project-init输入新增handoff-spec；page-builder输入新增userflow和interaction-spec
- v3.1: 卡口新增美学验证和audit评分要求；目录结构扁平化（移除skills/中间层）
- v3.0: 精简为1层编排器+4个Skill；取消L1/L2分级改为按需跳过；取消3个子编排器；新增视觉方向定义；ext-frontend-design改为必调
- v2.1: L2模式移除重复的project-scaffold调用
- v2.0: L1/L2模式增加project-scaffold；所有子Skill传递project_dir
- v1.0: 初始版本
