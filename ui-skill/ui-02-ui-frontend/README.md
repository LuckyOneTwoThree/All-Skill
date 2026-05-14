# 模块：UI前端生成

## 定位

UI与前端一体化的核心模块。将设计系统转化为可运行的前端代码，实现"设计即实现，实现即设计"。目标是**通过AI将设计意图一步到位地转化为带样式和交互的前端组件与页面**。

## 何时使用

- 设计系统已建立，需要生成前端组件和页面
- 需要将PRD中的UI需求转化为可运行代码
- 需要审查UI质量并自动生成测试

## 子模块与编排器

| 子模块 | 编排器 | 作用 | 何时调用 |
|--------|--------|------|----------|
| UI前端生成 | ui-frontend-orchestrator | 协调组件生成、页面组装、审查和测试 | 需要端到端生成UI前端代码时 |

## Pipeline Skill 清单

### UI组件生成（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| ui-component-gen | 基于设计系统生成带样式和交互的前端组件代码 | 组件意图、设计令牌、组件库 | 组件代码+Story+测试 |

> 💡 **合并说明**：v2.0 将原 interaction-design 合并到 ui-component-gen，交互状态机和动画作为组件的一部分生成。国际化能力已内建到 page-assembly（见 [extensions/README.md](../extensions/README.md) 已内建能力表），视觉差异化、质量打磨、交互增强等通过外部 Skill（ext-frontend-design、ext-impeccable、ext-interaction-design、ext-ui-ux-pro-max）增强。

### 页面组装（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| page-assembly | 将组件组装为完整页面，配置路由、状态管理和数据流 | 页面需求、组件库、设计令牌 | 页面代码+路由配置 |

### UI审查（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| ui-review | 自动审查视觉还原度、无障碍合规、交互完整性和响应式适配 | 组件代码、页面代码、设计令牌 | 问题清单+修复建议 |

### 前端测试（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| frontend-test | 自动生成组件测试、E2E测试和无障碍测试 | 组件代码、页面代码 | 测试代码+覆盖率报告 |

## 执行顺序

```
阶段1            阶段2              阶段3            阶段4
┌──────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────┐
│ 组件生成  │→│ 页面组装      │→│ UI审查        │→│ 前端测试  │
│ 含交互设计│  │ 路由+状态管理 │  │ 规范+无障碍   │  │ 单元+E2E │
└──────────┘  └──────────────┘  └──────────────┘  └──────────┘
```

- 组件生成包含交互设计，一步到位
- 页面组装精简为3步（结构映射→状态数据流→代码生成）
- UI审查不通过则回退修复
- 前端测试保障质量，核心流程E2E必须通过

## 输出路径

```
output/ui-frontend/
├── ui-component-gen/
├── page-assembly/
├── ui-review/
└── frontend-test/
```

> 💡 **project_dir 双输出模式**：当 `project_dir` 参数指定时，组件和页面代码直接写入 `{project_dir}/src/components/` 和 `{project_dir}/src/pages/`，元数据仍写入 `output/` 目录供下游 Skill 消费。

## 阶段卡口

### 进入页面组装前需满足：
- Design Token引用率100%
- 状态机无死锁

### 进入UI审查前需满足：
- 组件树层级≤4层

### 进入前端测试前需满足：
- P0问题=0

### 进入下一模块（前端集成）前需满足：
- 核心流程E2E测试100%通过
- UI审查P0问题全部修复

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 组件方案确认 | AI生成组件清单和交互状态机，人类确认组件边界和交互行为 |
| 页面布局确认 | AI生成页面布局方案，人类确认布局选择 |
| UI审查P1问题处理 | P1问题修复还是接受为技术债务 |
| 测试策略确认 | AI生成测试方案后，人类确认测试范围和优先级 |

## 外部 Skill 扩展

> **命名规范**：外部 Skill 统一使用 `ext-` 前缀（如 `ext-impeccable`），与核心自建 Skill 区分。核心 Skill 通过 `Skill: ext-xxx` 定向调用，未安装时自动降级不阻塞流程。详见 [extensions/README.md](../extensions/README.md)。

> **调用格式优化**：ext- 外部 Skill 调用已从描述性表格改为指令性调用块格式（`Skill: ext-xxx`），包含输入/输出/验证条件；脚本路径使用 `{SKILL_DIR}` 占位符，部署后由 Agent 框架解析为实际路径。

| 外部 Skill 名称 | 增强能力 | 调用时机 | 输入 | 输出 |
|----------------|---------|---------|------|------|
| `ext-impeccable` `shape` | 编码前设计简报 | ui-component-gen Step 3 | 组件意图+状态数 | 设计简报 |
| `ext-frontend-design` | 视觉差异化，避免AI同质化 | ui-component-gen Step 4 | 组件视觉描述+目标语言 | 差异化美学方向 |
| `ext-interaction-design` | 交互动效代码模式 | ui-component-gen Step 4 | 拖拽/手势/复杂状态转换 | 交互动效代码 |
| `ext-impeccable` `animate bolder\|quieter delight` | 动效策略+视觉表现力+愉悦感 | ui-component-gen Step 4 | 组件状态+品牌色占比 | 增强后的组件代码 |
| `ext-impeccable` `harden polish` | 生产就绪化+质量打磨 | ui-component-gen Step 5 | 组件代码 | 打磨后的组件代码 |
| `ext-ui-ux-pro-max` `--domain landing\|dashboard` | 数据驱动页面结构推荐 | page-assembly Step 1 | 页面类型+需求 | 页面结构推荐 |
| `ext-impeccable` `layout adapt` | 布局增强+响应式适配 | page-assembly Step 1 | 页面区块+目标平台 | 增强后的布局代码 |
| `ext-impeccable` `clarify onboard distill` | UX文案+新手引导+简化 | page-assembly Step 2 | 页面内容+类型 | 增强后的页面代码 |
| `ext-impeccable` `audit critique` | 技术质量审计+UX设计评审 | ui-review Step 1 | 组件代码+页面代码 | 审计报告+评审评分 |
| `ext-impeccable` `distill` | 简化过度复杂UI | ui-review Step 2 | P1问题清单 | 简化后的代码 |

## 核心信念

- UI与前端一体化，设计即实现
- 令牌约束一切，硬编码是技术债
- 可访问性默认内建，不是事后补丁
- 审查闭环，不通过不放过
