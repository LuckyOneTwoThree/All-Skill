---
name: project-init
description: 当需要初始化UI前端项目时使用。项目初始化与视觉定义一体化，从品牌规范推导视觉方向，选择组件库并定制主题，同步生成项目脚手架和设计上下文文件。关键词：项目初始化、设计系统、视觉方向、主题定制、项目脚手架、建项目、出设计规范、配主题色。
metadata:
  module: "UI设计与前端开发"
  sub-module: "设计系统"
  type: "pipeline"
  version: "1.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "初始化前端项目"
    - "建立设计系统"
    - "配一下主题色"
    - "搭个项目"
  interaction_mode: "ai_suggest_human_approve"
---

# 项目初始化与视觉定义

## 核心原则

1. **视觉方向优先**——先定义"长什么样"，再生成令牌和代码
2. **组件库优先**——优先选用成熟组件库（shadcn/Ant Design/MUI等），从零构建仅作备选
3. **品牌驱动**——所有视觉决策从品牌基因推导，而非凭空定义
4. **上下文即代码**——PRODUCT.md/DESIGN.md 与代码同步生成，供后续Skill和ext-impeccable消费

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 品牌规范 | JSON/markdown | 是 | 用户提供 / output/pm-strategy/positioning-statement/positioning-statements.json | 品牌色彩、字体、风格指南 |
| 产品定位 | JSON | ○ | output/pm-strategy/positioning-statement/positioning-statements.json | 产品定位陈述 |
| 目标平台 | string | 是 | 用户提供 | Web / Mobile / 跨平台 |
| 目标语言 | string | 是 | 上游编排器传递 / 用户提供（默认zh-CN） | 目标界面语言 |
| project_name | string | 是 | 用户提供 | 项目名称 |
| project_dir | string | 是 | 用户提供 | 项目根目录绝对路径 |
| framework | string | 是 | 用户提供 | React/Vue/Svelte/Next.js/Nuxt.js |
| package_manager | string | ○ | 用户提供 | npm/pnpm/yarn（默认pnpm） |
| 组件库偏好 | string | ○ | 用户提供 | shadcn/Ant Design/MUI/Element Plus/自定义（默认根据framework推荐） |
| PRD | markdown | ○ | output/pm-design/design-prd/prd.md | 产品需求文档 |

## 执行步骤

### Step 1: 品牌基因提取与色彩体系生成

从品牌规范中提取核心设计基因：
- 主色调：品牌主色（1个）+ 辅助色（2-3个）
- 色彩情绪：专业/温暖/活力/科技/稳重
- 字体气质：现代/经典/几何/人文
- 视觉风格：扁平/拟物/毛玻璃/新拟态

基于主色调生成完整色彩体系（使用OKLCH色彩空间保持感知均匀性）：

| 令牌类别 | 生成规则 | 数量 |
|----------|----------|------|
| 品牌色 | 主色+辅助色，各生成50-950共10个色阶 | 30-40 |
| 功能色 | 成功/警告/错误/信息，各10个色阶 | 40 |
| 中性色 | 灰度色阶50-950 | 10 |
| 语义色 | 背景/前景/边框/链接/禁用 | 15-20 |

对比度校验：正文≥4.5:1（WCAG AA），大文本≥3:1，不达标自动调整。

暗色模式推导（内建能力）：主色相不变降明度升饱和度、背景反转、文字对比度≥4.5:1。

**外部 Skill 调用**：

#### 1a. ext-ui-ux-pro-max --design-system

**触发条件**：品牌规范不完整 或 品牌色<3个 或 产品定位描述<50字
**反模式**：品牌规范完整且已有明确配色方案 → 跳过

```
Skill: ext-ui-ux-pro-max
输入:
  查询: "{产品类型} {行业} {风格关键词}"
  模式: --design-system
  项目名称: {project_name}
输出: 设计系统推荐（风格/色彩/字体/效果/反模式）
验证: 返回了完整的设计系统推荐，包含至少3个色彩方案和2个字体配对
模式: 🤖
```

#### 1b. ext-impeccable colorize

**触发条件**：品牌色占比<10% 或 中性色占比>70%
**反模式**：已通过ext-frontend-design获得色彩方案 → 跳过

```
Skill: ext-impeccable
输入:
  子命令: colorize
  目标: 当前色彩体系
  上下文: 品牌规范 + 产品定位 + 设计令牌初稿
输出: 增强色彩方案
验证: 品牌色占比提升至15-30%，中性色占比降至50%以下
模式: 🤖
```

### Step 2: 视觉风格定义（必调 ext-frontend-design）

**这是最关键的步骤**——定义"这个产品应该长什么样"，而非只输出令牌数值。

基于品牌基因提取结果，定义完整的视觉风格方向：

| 维度 | 定义内容 | 输出字段 |
|------|---------|---------|
| 美学方向 | 具体风格描述（如"温暖有机+大留白+柔和圆角"） | aesthetic_direction |
| 色彩策略 | Restrained/Committed/Full palette/Drenched | color_strategy |
| 主题决策 | 亮色/暗色 + 物理场景句（如"SRE在凌晨2点昏暗房间看监控"） | theme_decision |
| 排版策略 | 标题字体风格 + 正文字体风格 + 层级对比度 | typography_strategy |
| 空间策略 | 留白比例 + 密度倾向 | spatial_strategy |
| 视觉禁忌 | 绝对不使用的模式 | visual_bans |
| 情绪关键词 | 3-5个核心情绪词 | mood_keywords |
| 参考风格 | 1-2个可参考的产品/设计风格 | reference_style |

**必调 ext-frontend-design**（每个项目都必须经过美学方向审视）：

```
Skill: ext-frontend-design
输入:
  设计需求: 品牌基因 + 产品定位 + 行业特征 + 色彩体系初稿
  上下文: 品牌规范 + 目标用户 + 竞品分析（如有）
输出: 反AI同质化的美学方向建议（字体替代/色彩替代/布局差异化/视觉禁忌）
验证: 建议中不包含Inter/Roboto/蓝紫渐变/卡片网格等AI同质化特征
模式: 🤖
```

**Register 感知**：brand→极端美学方向；product→差异化但克制

**ext-impeccable typeset**（条件触发）：

**触发条件**：字号层级<6级 或 最大/最小字号比<2 或 字重仅用400+700
**反模式**：目标语言=zh-CN且已配置思源黑体完整字重 → 跳过

```
Skill: ext-impeccable
输入:
  子命令: typeset
  目标: 当前排版体系
  上下文: 品牌规范 + 产品定位 + 字体令牌初稿
输出: 排版增强方案
验证: 字号层级≥6级，最大/最小字号比≥2，字重使用≥3种
模式: 🤖
```

### Step 3: 组件库选择与主题定制

**分支判断**：

if 用户指定了组件库(shadcn/Ant Design/MUI/Element Plus等):
    → 轻量路径：基于组件库定制主题
else:
    → 完整路径：从零规划组件库

**轻量路径**（组件库定制主题）：

| 步骤 | 内容 |
|------|------|
| 主题令牌映射 | 将品牌色映射到组件库的主题变量（如shadcn的CSS变量） |
| 主题覆盖 | 覆盖组件库默认的圆角/阴影/间距/字号 |
| 扩展组件 | 识别组件库未覆盖的组件需求，规划自定义组件 |

**完整路径**（从零构建组件库）：

按原子设计规划组件库：

| 类别 | 典型组件 | 规格要素 |
|------|---------|---------|
| 原子组件 | Button/Input/Text/Icon/Divider/Box | 变体/尺寸/状态 |
| 分子组件 | FormField/SearchBar/ListItem | 原子组合 |
| 组织组件 | Form/DataTable/Dialog | 分子+原子组合 |

组件复用决策：复用度≥3页面→高优先级，1-2页面→中优先级，仅1页面→页面私有。

**ext-impeccable extract**（条件触发）：

**触发条件**：输入包含"现有组件库"或"已有项目"
**反模式**：全新项目无现有代码 → 跳过

```
Skill: ext-impeccable
输入:
  子命令: extract
  目标: 现有组件库或已有项目代码
  上下文: 项目目录路径 + 现有设计令牌
输出: 可复用的设计令牌和组件模式提取
验证: 提取结果包含色彩、字体、间距、组件模式
模式: 🤖
```

### Step 4: 项目脚手架初始化

基于framework创建项目骨架：

| 框架 | 初始化命令 | 目录结构 |
|------|-----------|---------|
| React | Vite + React + TypeScript | src/components, src/pages, src/styles, src/api, src/stores |
| Vue | Vite + Vue + TypeScript | src/components, src/views, src/styles, src/api, src/stores |
| Next.js | create-next-app --ts | app/, components/, styles/, lib/ |
| Nuxt.js | nuxi init | components/, pages/, assets/, server/ |
| Svelte | Vite + Svelte + TypeScript | src/lib/components, src/routes, src/styles |

安装核心依赖：
- 路由：react-router/vue-router/sveltekit内置
- 状态管理：zustand/pinia/svelte stores
- 样式方案：根据组件库选择（Tailwind/CSS Modules/Styled Components）
- HTTP客户端：axios/fetch wrapper

验证项目可运行：`npm run dev` 启动成功。

### Step 5: 上下文文件与令牌文件输出

**生成上下文文件**（供ext-impeccable消费）：

生成 {project_dir}/PRODUCT.md：
- 产品名称和描述
- 目标用户画像
- 品牌调性和语气
- 产品目标和核心价值
- 反参考（不希望像什么）
- register字段（brand/product）

生成 {project_dir}/DESIGN.md：
- 视觉风格方向（来自Step 2）
- 色彩策略和主题决策
- 排版策略
- 空间策略
- 视觉禁忌
- 组件库选择和主题定制说明

**生成令牌文件**：

- {project_dir}/src/styles/tokens.css — CSS变量
- {project_dir}/src/styles/tokens.json — JSON格式令牌

**语言适配规则**（根据目标语言调整字体、字号和行高基准）：

| 目标语言 | 主字体推荐 | 正文字号 | 行高基准 | 间距倾向 |
|----------|-----------|---------|---------|---------|
| zh-CN | 思源黑体/霞鹜文楷 | 14-16px | 1.6-1.8 | 偏大 |
| en-US | 按ext-frontend-design推荐 | 13-14px | 1.4-1.5 | 标准 |
| ja-JP | Noto Sans JP | 14-16px | 1.7-1.8 | 偏大 |
| ko-KR | Noto Sans KR | 14-16px | 1.6-1.8 | 偏大 |
| ar-SA | Noto Sans Arabic | 14-16px | 1.6-1.8 | 偏大（RTL） |

## 输出

**代码文件输出**：
- {project_dir}/ — 完整项目骨架
- {project_dir}/PRODUCT.md — 产品上下文
- {project_dir}/DESIGN.md — 设计上下文
- {project_dir}/src/styles/tokens.css — 设计令牌CSS变量
- {project_dir}/src/styles/tokens.json — 设计令牌JSON

**元数据输出**：output/ui-project-init/

**输出文件**：project-init.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["visual_direction", "tokens", "component_library", "scaffold", "project_dir"],
  "properties": {
    "visual_direction": {
      "type": "object",
      "description": "视觉风格方向定义",
      "properties": {
        "aesthetic_direction": {"type": "string"},
        "color_strategy": {"type": "string", "enum": ["restrained", "committed", "full_palette", "drenched"]},
        "theme_decision": {"type": "string"},
        "typography_strategy": {"type": "string"},
        "spatial_strategy": {"type": "string"},
        "visual_bans": {"type": "array", "items": {"type": "string"}},
        "mood_keywords": {"type": "array", "items": {"type": "string"}},
        "reference_style": {"type": "string"}
      }
    },
    "tokens": {"type": "object", "description": "设计令牌（色彩/字体/间距/阴影/断点/动画）"},
    "component_library": {"type": "object", "description": "组件库选择和主题定制信息"},
    "scaffold": {"type": "object", "description": "项目脚手架信息（框架/依赖/目录结构）"},
    "project_dir": {"type": "string", "description": "项目根目录路径"}
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 用户指定组件库 | 轻量路径：定制主题 |
| 用户未指定组件库 + framework=React | 默认推荐shadcn/ui |
| 用户未指定组件库 + framework=Vue | 默认推荐Element Plus |
| 用户未指定组件库 + 需要完全自定义 | 完整路径：从零构建 |
| 品牌色对比度<4.5:1（白色背景） | 自动生成深色变体作为文本色 |
| 色彩情绪=专业/稳重 | 中性色占比≥60%，品牌色点缀≤20% |
| 色彩情绪=活力/温暖 | 品牌色占比30%-40%，中性色≤40% |
| 目标平台=Web | 输出CSS Variables+Tailwind Config |
| 目标平台=Mobile | 输出iOS Swift+Android Kotlin |
| 目标平台=跨平台 | 输出全部格式 |

## 质量检查

- [ ] visual_direction 所有8个维度均有明确定义
- [ ] ext-frontend-design 已调用且输出不含AI同质化特征
- [ ] PRODUCT.md 和 DESIGN.md 已生成且内容非占位符
- [ ] 色彩体系覆盖品牌色+功能色+中性色+语义色4类
- [ ] 正文色与背景色对比度≥4.5:1（WCAG AA）
- [ ] 字号层级≥6级
- [ ] 间距令牌≥8级
- [ ] npm run dev 启动成功
- [ ] 令牌文件已写入 {project_dir}/src/styles/

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 品牌规范缺失 | 基于行业基准生成默认品牌色 | 品牌色基于行业推断，标注"待品牌确认" |
| 产品定位缺失 | 基于品牌规范推断色彩情绪 | 色彩情绪可能不够精准 |
| 组件库偏好缺失 | 根据framework推荐默认组件库 | 可能不是用户期望的组件库 |
| PRD缺失 | 不规划自定义组件，仅配置组件库主题 | 组件需求待PRD补充 |
| project_dir 缺失 | 仅输出到 output/ 目录 | 代码文件需手动复制 |

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 定位陈述变更 | 品牌色、视觉方向 | 标注受影响的令牌和视觉方向，建议人类确认 |
| 目标平台新增 | 新增平台适配令牌 | 标注需新增的平台令牌 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 视觉方向变更 | page-builder | 美学方向/色彩策略/视觉禁忌 | visual_direction任何字段变更 |
| 令牌变更 | page-builder | 受影响的令牌类别 | 令牌值变更 |
| 组件库变更 | page-builder | 组件复用关系 | 组件库选择或主题变更 |

## 变更记录

- v1.0: 合并 project-scaffold + design-system；新增视觉风格定义步骤；新增PRODUCT.md/DESIGN.md生成；ext-frontend-design改为必调；新增组件库分支路径（轻量/完整）
