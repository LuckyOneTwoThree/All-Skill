# 模块：UI前端生成

## 定位

UI与前端一体化的核心模块。将设计系统转化为可运行的前端代码，实现"设计即实现，实现即设计"。目标是**基于设计简报和视觉方向，在页面上下文中一体化生成组件并组装为完整页面，内建质量门禁确保产出质量**。

**express 模式说明**：当 `mode=express` 时，本模块（page-builder）被跳过，由选定的 ext Skill（visual→ext-frontend-design / ux→ext-ui-ux-pro-max / polish→ext-impeccable / motion→ext-interaction-design）直接生成页面代码。express 模式不建立设计系统、不生成 design tokens、不经过增强-审计循环，仅通过最小质量检查（WCAG AA + 无硬编码密钥 + 可运行）。适用于单页面/落地页/快速原型场景。

## 何时使用

- 设计系统已建立，需要生成前端组件和页面
- 需要将PRD中的UI需求转化为可运行代码
- 需要基于视觉方向构建差异化UI

## Pipeline Skill 清单

### 页面与组件一体化构建（1个）

| Skill | 作用 | 输入 | 输出 |
|-------|------|------|------|
| page-builder | 基于设计简报和视觉方向，在页面上下文中生成组件并组装为完整页面，内建质量门禁 | 页面需求、设计简报(design_brief.json)、视觉方向、设计令牌、组件库、目标框架、project_dir、PRD(可选)、路由结构(可选)、原型规格(可选)、userflow(可选)、interaction-spec(可选) | pages.json（含pages/components/quality_report/design_decisions）+ design_feedback.json + quality_debt.json + 组件代码 + 页面代码 |

> 💡 **合并说明**：v2.0 将原 ui-component-gen + page-assembly + ui-review 合并为 page-builder 一个 Skill，消除阶段交接开销。新增设计简报驱动模式（消费 design_brief.json，ext Skill 产出从"建议"转化为"可执行设计规范"），视觉节奏设计（消费 visual_direction 定义视觉重心/密度分布/色彩节奏/层次感），组件改为页面上下文生成（确保视觉一致性和交互连贯性），审查改为内建质量门禁（生成即校验，不依赖独立审查步骤），PM约束偏离记录（design_decisions 4级严重度），UI→PM反向反馈通道（design_feedback.json），统一评分体系（audit×0.5+critique×0.5），质量债务追踪（quality_debt.json）。国际化能力已内建（见 [extensions/README.md](../extensions/README.md) 已内建能力表），视觉差异化、质量打磨、交互增强等通过外部 Skill（ext-frontend-design、ext-impeccable、ext-interaction-design、ext-ui-ux-pro-max）增强。

## 执行顺序

```
┌──────────────────────────────────────────────────────────────────────┐
│                     page-builder 一体化构建                           │
│  Step1: 页面结构规划+视觉节奏设计(消费visual_direction+design_brief)  │
│  → Step2: 组件生成(页面上下文中，含交互状态机，设计简报驱动)           │
│  → Step3: 页面组装+状态管理+路由配置                                 │
│  → Step4: 内建质量门禁(设计规范+无障碍+交互完整性+响应式)             │
│  → Step5: 代码输出+最终打磨                                          │
└──────────────────────────────────────────────────────────────────────┘
```

- 设计简报驱动——design_brief.json 为第一优先级输入，ext 产出从"建议"转化为"可执行规范"
- 视觉方向驱动——所有组件和页面决策从 visual_direction 推导
- 组件在页面上下文中生成，确保视觉一致性和交互连贯性
- 质量内建——生成即校验，P0问题必须修复后才能输出
- 可访问性默认内建，每个组件默认包含 ARIA 属性和键盘导航

## 输出路径

```
output/ui-frontend/
└── page-builder/

{project_dir}/src/
├── components/
├── pages/
├── router/
└── stores/
```

> 💡 **project_dir 双输出模式**：组件和页面代码直接写入 `{project_dir}/src/` 对应目录，元数据写入 `output/` 目录供下游 Skill 消费。

## 阶段卡口

### 内建质量门禁通过标准：
- Design Token引用率100%，无硬编码样式值
- WCAG AA对比度100%达标
- 交互组件100%包含ARIA属性和键盘导航
- 状态机无死锁
- visual_direction 的视觉禁忌100%未被违反
- 视觉节奏6维度已在页面中体现
- visual_direction一致性：组件视觉风格与aesthetic_direction一致
- 综合质量评分（audit×0.5+critique×0.5）≥75分
- design_decisions 无 critical 级偏离未记录

### 进入下一模块（前端集成）前需满足：
- P0问题=0
- 组件树层级≤4层
- 响应式覆盖375px/768px/1024px
- 品牌色占比在color_strategy对应区间内

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| 页面布局确认 | AI生成页面布局和视觉节奏方案，人类确认布局选择 |
| 组件方案确认 | AI在页面上下文中生成组件，人类确认组件边界和交互行为 |
| P1问题处理 | P1问题修复还是接受为技术债务 |

## 外部 Skill 扩展

> **命名规范**：外部 Skill 统一使用 `ext-` 前缀（如 `ext-impeccable`），与核心自建 Skill 区分。核心 Skill 通过 `Skill: ext-xxx` 定向调用，核心增强类失败阻断下游，可选增强类失败标注不阻断。详见 [extensions/README.md](../extensions/README.md)。

| 外部 Skill 名称 | 增强能力 | 编排器阶段 | 输入 | 输出 |
|----------------|---------|-----------|------|------|
| `ext-ui-ux-pro-max` `--domain landing\|dashboard` | 数据驱动页面结构推荐 | stage-4 | 页面类型+需求 | 页面结构推荐 |
| `ext-impeccable` `layout adapt` | 布局增强+响应式适配 | stage-4 | 页面区块+目标平台 | 增强后的布局代码 |
| `ext-impeccable` `shape` | 编码前设计简报 | stage-4 | 组件意图+状态数 | 设计简报 |
| `ext-frontend-design` | 视觉差异化，避免AI同质化 | stage-2 | visual_direction+品牌规范 | 可执行设计规范（design_brief.json） |
| `ext-interaction-design` | 交互动效代码模式 | stage-4 | 拖拽/手势/复杂状态转换 | 交互动效代码 |
| `ext-impeccable` `animate bolder\|quieter delight` | 动效策略+视觉表现力+愉悦感 | stage-4 | 组件状态+品牌色占比 | 增强后的组件代码 |
| `ext-impeccable` `clarify onboard distill` | UX文案+新手引导+简化 | stage-4 | 页面内容+类型 | 增强后的页面代码 |
| `ext-impeccable` `audit critique` | 技术质量审计+UX设计评审 | stage-4 | 组件代码+页面代码 | 审计报告+评审评分 |
| `ext-impeccable` `harden polish` | 生产就绪化+质量打磨 | stage-6 | 组件代码 | 打磨后的组件代码 |

## 核心信念

- 设计简报驱动，design_brief.json 为第一优先级输入
- 视觉方向驱动，所有决策从 visual_direction 推导
- UI与前端一体化，设计即实现
- 令牌约束一切，硬编码是技术债
- 质量内建，生成即校验
- 可访问性默认内建，不是事后补丁
