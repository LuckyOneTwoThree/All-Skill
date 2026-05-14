---
name: design-system
description: 当需要建立设计系统时使用。设计系统一体化生成，从品牌规范推导设计令牌（色彩/字体/间距/阴影），按原子设计规划组件库，同步生成设计系统文档。令牌驱动一切，一致性释放创造力。关键词：设计系统、Design System、设计令牌、组件库、设计规范、design-token、component-library、出设计规范、配主题色、搭组件库。
metadata:
  module: "UI设计与前端开发"
  sub-module: "设计系统"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "建立设计系统"
    - "制定设计规范"
    - "设计组件库"
    - "配一下主题色"
  interaction_mode: "ai_suggest_human_approve"
---

# 设计系统 Skill

## 核心原则

1. **品牌驱动**——所有设计令牌从品牌基因推导，而非凭空定义
2. **令牌约束一切**——硬编码是技术债，所有视觉属性从令牌推导
3. **原子到组织**——组件从最小粒度开始，逐步组合，组合优于继承
4. **文档即代码**——组件创建即生成文档，避免文档债务

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 品牌规范 | JSON/markdown | 是 | 用户提供 / output/pm-strategy/positioning-statement/positioning-statements.json | 品牌色彩、字体、风格指南 |
| 产品定位 | JSON | ○ | output/pm-strategy/positioning-statement/positioning-statements.json | 产品定位陈述，影响视觉风格 |
| 目标平台 | string | 是 | 用户提供 | Web / Mobile / 跨平台 |
| 目标语言 | string | 是 | 上游编排器传递 / 用户提供（默认zh-CN） | 目标界面语言，影响字体/字号/行高/间距令牌 |
| project_dir | string | 是 | output/ui-project-scaffold/scaffold.json | 项目根目录绝对路径，代码文件直接写入此目录 |
| PRD | markdown | ○ | output/pm-design/design-prd/prd.md | 产品需求文档，提取组件需求 |
| 现有组件库 | JSON | ○ | 用户提供 | 已有组件清单（避免重复） |

---

## 执行步骤

### Step 1: 品牌基因提取与色彩体系生成

从品牌规范中提取核心设计基因：

- **主色调**：品牌主色（1个）+ 辅助色（2-3个）
- **色彩情绪**：专业/温暖/活力/科技/稳重
- **字体气质**：现代/经典/几何/人文
- **视觉风格**：扁平/拟物/毛玻璃/新拟态

基于主色调生成完整色彩体系：

| 令牌类别 | 生成规则 | 数量 |
|----------|----------|------|
| 品牌色 | 主色+辅助色，各生成50-950共10个色阶 | 30-40 |
| 功能色 | 成功(绿)/警告(橙)/错误(红)/信息(蓝)，各10个色阶 | 40 |
| 中性色 | 灰度色阶50-950 | 10 |
| 语义色 | 背景/前景/边框/链接/禁用，映射到具体色阶 | 15-20 |

**AI执行指引**：色彩推导使用 OKLCH 色彩空间，保持感知均匀性。从品牌主色提取 H 色相值，通过调整 L（明度）生成 50-950 色阶，C（彩度）随明度变化自然衰减。

**对比度校验规则**：

- 正文色与背景色对比度 ≥ 4.5:1（WCAG AA）
- 大文本与背景色对比度 ≥ 3:1
- 不达标时自动调整色阶并标注"已调整"

**暗色模式推导**（内建能力）：
- 基于亮色令牌自动推导暗色方案
- 规则：主色相不变降明度升饱和度、背景反转、文字对比度≥4.5:1、阴影改用深色半透明
- 输出：`output/ui-design-system/design-system/dark-tokens.json`

**代码写入规则**：生成的设计令牌文件同时写入 `{project_dir}/src/styles/tokens.css` 和 `{project_dir}/src/styles/tokens.json`，确保后续Skill可直接引用。

**外部 Skill 调用**（按执行顺序）：

Step 1 外部调用（合并同Skill子命令为单次调用以节省token）：

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

**Register 感知**：brand→侧重风格独特性；product→侧重可用性准则

#### 1b. ext-frontend-design

**触发条件**：品牌色为蓝紫渐变/主字体为Inter或Roboto/视觉风格描述含"简洁现代"（AI同质化特征）
**反模式**：用户明确要求遵循特定设计系统（如Material/Ant Design） → 跳过

```
Skill: ext-frontend-design
输入:
  设计需求: 当前色彩体系和视觉方向描述
  上下文: 品牌规范 + 产品定位
输出: 反AI同质化的美学方向建议（字体替代/色彩替代/布局差异化）
验证: 建议中不包含Inter/Roboto/蓝紫渐变等AI同质化特征
模式: 🤖
```

**Register 感知**：brand→极端美学方向；product→差异化但克制

#### 1c. ext-impeccable colorize

**触发条件**：品牌色占比<10% 或 中性色占比>70% 或 色彩情绪描述含"安全/保守"
**反模式**：已通过ext-frontend-design获得色彩方案 → 跳过

```
Skill: ext-impeccable
输入:
  子命令: colorize
  目标: 当前色彩体系
  上下文: 品牌规范 + 产品定位 + 设计令牌初稿
输出: 增强色彩方案（OKLCH色彩、色彩策略建议、功能色增强）
验证: 品牌色占比提升至15-30%，中性色占比降至50%以下
模式: 🤖
```

**Register 感知**：brand→大胆用色；product→功能性色彩增强

Step 2 外部调用：

#### 2a. ext-impeccable typeset

**触发条件**：字号层级<6级 或 最大/最小字号比<2 或 字重仅用400+700
**反模式**：目标语言=zh-CN且已配置思源黑体完整字重 → 跳过

```
Skill: ext-impeccable
输入:
  子命令: typeset
  目标: 当前排版体系
  上下文: 品牌规范 + 产品定位 + 字体令牌初稿
输出: 排版增强方案（字号层级扩展、字重对比增强、行高优化）
验证: 字号层级≥6级，最大/最小字号比≥2，字重使用≥3种
模式: 🤖
```

**Register 感知**：brand→戏剧化排版对比；product→清晰层级

Step 4 外部调用：

#### 4a. ext-impeccable extract

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

**Register 感知**：均适用

---

### Step 2: 字体/间距/阴影令牌与多平台输出

**字体排版体系**：

**语言适配规则**（根据目标语言调整字体、字号和行高基准）：

| 目标语言 | 主字体推荐 | 正文字号 | 行高基准 | 间距倾向 | 排版方向 |
|----------|-----------|---------|---------|---------|---------|
| zh-CN | 思源黑体(Noto Sans SC)/霞鹜文楷 | 14-16px | 1.6-1.8 | 偏大（中文密度高需呼吸） | LTR |
| en-US | Inter/Space Grotesk | 13-14px | 1.4-1.5 | 标准 | LTR |
| ja-JP | Noto Sans JP | 14-16px | 1.7-1.8 | 偏大 | LTR |
| ko-KR | Noto Sans KR | 14-16px | 1.6-1.8 | 偏大 | LTR |
| ar-SA | Noto Sans Arabic | 14-16px | 1.6-1.8 | 偏大 | RTL |
| 多语言 | 多字体栈（主字体+回退字体覆盖所有目标语言） | 最大语言字号 | 取最大语言行高 | 偏大 | LTR+RTL兼容 |

| 令牌类别 | 生成规则 |
|----------|----------|
| 字体家族 | 主字体+回退字体栈（系统字体→Web安全字体） |
| 字号层级 | 12/14/16/18/20/24/30/36/48px（模块化缩放比1.2-1.25） |
| 行高 | 紧凑(1.3)/常规(1.5)/宽松(1.8) |
| 字重 | Regular(400)/Medium(500)/Semibold(600)/Bold(700) |

**间距与布局体系**：

| 令牌类别 | 生成规则 |
|----------|----------|
| 间距 | 基准4px，生成4/8/12/16/24/32/48/64/96px |
| 圆角 | 无(0)/小(4px)/中(8px)/大(12px)/圆(50%) |
| 阴影 | 层级1(卡片)/层级2(悬浮)/层级3(弹窗)/层级4(全屏遮罩) |
| 断点 | 移动(375)/平板(768)/桌面(1024)/大屏(1440)px |

**动画令牌**（纳入设计令牌体系，而非独立于交互设计）：

| 令牌类别 | 值 | 使用场景 |
|----------|---|---------|
| duration-instant | 100ms | 按钮hover、焦点切换 |
| duration-fast | 200ms | 弹窗展开、下拉菜单 |
| duration-normal | 300ms | 页面切换、侧边栏展开 |
| duration-slow | 500ms | 复杂过渡、数据可视化 |
| easing-default | cubic-bezier(0.4, 0, 0.2, 1) | 大部分过渡 |
| easing-decelerate | cubic-bezier(0, 0, 0.2, 1) | 进入动画 |
| easing-accelerate | cubic-bezier(0.4, 0, 1, 1) | 退出动画 |

**多平台输出格式**：

- CSS Variables：`--color-primary-500: #3B82F6;`
- Tailwind Config：`colors: { primary: { 500: '#3B82F6' } }`
- Figma Tokens JSON：标准Design Tokens格式
- iOS/Swift：`Color.primary500`
- Android/Kotlin：`R.color.primary_500`

---

### Step 3: 组件需求提取与原子设计规划

从PRD中提取所有UI组件需求：

- 梳理全部页面和功能模块
- 提取每个页面中需要的UI元素
- 识别跨页面复用的UI模式

**原子组件定义**（最小粒度不可再分）：

| 类别 | 典型组件 | 规格要素 |
|------|---------|---------|
| 基础按钮 | Button | 变体(primary/secondary/ghost/danger)、尺寸(sm/md/lg)、状态 |
| 输入控件 | Input/Select/Checkbox/Radio/Switch | 尺寸、验证状态、前缀后缀图标 |
| 文本展示 | Text/Heading/Label/Badge | 字号令牌、颜色令牌、截断规则 |
| 图标 | Icon | 尺寸(16/20/24/32)、颜色令牌 |
| 分割 | Divider/Spacer | 方向、粗细、间距令牌 |
| 容器 | Box/Card | 内边距令牌、圆角令牌、阴影令牌 |

**分子组件组合**（原子组合的功能单元）：

| 类别 | 典型组合 | 组成原子 |
|------|---------|---------|
| 表单字段 | FormField | Label+Input+ErrorText |
| 搜索栏 | SearchBar | Input+Icon+Button |
| 列表项 | ListItem | Text+Badge+Icon+Chevron |

**组织组件定义**（完整功能区块）：

| 类别 | 典型组件 | 组成分子/原子 |
|------|---------|-------------|
| 表单 | Form | FormField×N+Button(submit) |
| 数据表格 | DataTable | ListItem(header)+ListItem(row)×N+Pagination |
| 对话框 | Dialog | Box+Heading+Text+Button×2 |

**组件复用决策规则**：

- 复用度≥3个页面 → 纳入组件库，优先级=高
- 复用度1-2个页面 → 纳入组件库，优先级=中
- 仅1个页面使用 → 不纳入组件库，作为页面私有组件

---

### Step 4: 组件规格输出与文档同步生成

为每个组件生成完整规格：

- Props接口（名称、类型、默认值、必填性）
- 视觉变体（Variant）列表
- 状态列表及各状态视觉表现
- 可访问性要求（ARIA role、键盘交互）
- Design Token引用清单

**同步生成设计系统文档**：

| 文档章节 | 内容 |
|----------|------|
| 设计基础 | 色彩/字体/间距/阴影/断点，含Do/Don't示例 |
| 组件文档 | 概述+变体展示+Props表格+代码示例+可访问性+设计规范 |
| 设计模式 | 表单/数据展示/导航/反馈模式 |

**Figma同步**（内建能力）：
- 将设计令牌和组件库同步到 Figma
- 规则：输出标准 Design Tokens JSON 格式，可被 Figma Tokens 插件直接消费
- 输出：`output/ui-design-system/design-system/figma-tokens.json`

---

## 输出

**代码文件输出**：`{project_dir}/src/styles/tokens.css`（设计令牌CSS变量）、`{project_dir}/src/styles/tokens.json`（设计令牌JSON）

**元数据输出**：`output/ui-design-system/design-system/`

**输出文件**：design-system.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["token_metadata", "color", "typography", "spacing", "border_radius", "shadow", "breakpoint", "animation", "contrast_check", "library_metadata", "components", "dependency_graph", "doc_structure"],
  "properties": {
    "token_metadata": {"type": "object", "description": "令牌元信息"},
    "color": {"type": "object", "description": "色彩体系令牌"},
    "typography": {"type": "object", "description": "字体排版令牌"},
    "spacing": {"type": "object", "description": "间距令牌"},
    "border_radius": {"type": "object", "description": "圆角令牌"},
    "shadow": {"type": "object", "description": "阴影令牌"},
    "breakpoint": {"type": "object", "description": "响应式断点令牌"},
    "animation": {"type": "object", "description": "动画令牌，包含时长和缓动曲线"},
    "contrast_check": {"type": "object", "description": "对比度校验结果"},
    "library_metadata": {"type": "object", "description": "组件库元信息"},
    "components": {"type": "array", "description": "组件定义列表"},
    "dependency_graph": {"type": "object", "description": "组件依赖关系图"},
    "doc_structure": {"type": "object", "description": "文档目录结构"},
    "project_dir": {"type": "string", "description": "项目根目录路径，代码文件已写入此目录"}
  }
}
```

### 输出校验规则（字段级）

| 字段路径 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| token_metadata.version | string | 是 | 令牌版本 |
| token_metadata.platform | enum(web,ios,android) | 是 | 目标平台 |
| token_metadata.generated_at | string | 是 | 生成时间(ISO8601) |
| color.brand | object | 是 | 品牌色，含primary和secondary |
| color.semantic | object | 是 | 语义色 |
| color.functional | object | 是 | 功能色(success/warning/error/info) |
| color.neutral | object | 是 | 中性色 |
| typography.font_family | object | 是 | 字体族 |
| typography.font_size | object | 是 | 字号体系，≥6级 |
| spacing.scale | array | 是 | 间距梯度，≥8级 |
| animation.duration | object | 是 | 动画时长令牌 |
| animation.easing | object | 是 | 缓动曲线令牌 |
| contrast_check | object | 是 | WCAG合规性，正文对比度≥4.5:1 |
| library_metadata.total_components | integer | 是 | 组件总数 |
| components | array | 是 | 组件列表，每个含name/level/props/variants/states/accessibility/token_refs |
| dependency_graph | object | 是 | 依赖图，无循环依赖 |
| doc_structure | object | 是 | 文档结构，100%组件有文档 |

---

## 决策规则

| 条件 | 决策 |
|------|------|
| 品牌色对比度<4.5:1（白色背景） | 自动生成深色变体作为文本色，原色仅用于装饰元素 |
| 品牌色对比度≥4.5:1 | 可同时用于文本和装饰 |
| 目标平台=Web | 输出CSS Variables+Tailwind Config |
| 目标平台=Mobile | 输出iOS Swift+Android Kotlin |
| 目标平台=跨平台 | 输出全部格式 |
| 目标语言适配 | 详见Step 2语言适配规则表 |
| 色彩情绪=专业/稳重 | 中性色占比≥60%，品牌色点缀≤20% |
| 色彩情绪=活力/温暖 | 品牌色占比30%-40%，中性色≤40% |
| 原子组件数量>25个 | 检查粒度过细，建议合并 |
| 分子组件依赖>5个原子 | 检查职责过多，建议拆分 |
| 组织组件嵌套层级>3层 | 标记"嵌套过深"，建议扁平化 |
| 现有组件库已有同类组件 | 复用现有组件，标注差异点 |

---

## 质量检查

- [ ] 色彩体系覆盖品牌色+功能色+中性色+语义色4类，总计≥80个令牌
- [ ] 正文色与背景色对比度≥4.5:1（WCAG AA）
- [ ] 字号层级≥6级，最大与最小比≤4倍
- [ ] 间距令牌≥8级，基准为4px整数倍
- [ ] 动画令牌覆盖duration+easing两类
- [ ] 100%的语义令牌引用具体色阶而非硬编码色值
- [ ] 组件层级严格遵循原子→分子→组织三级
- [ ] 100%视觉属性引用Design Token
- [ ] 交互组件100%包含可访问性规格
- [ ] 依赖图无循环依赖
- [ ] 100%组件有文档，每个组件≥1个代码示例

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 品牌规范缺失 | 用户提供产品名称和行业→基于行业基准生成默认品牌色 | 品牌色基于行业推断，标注"待品牌确认" |
| 产品定位缺失 | 基于品牌规范推断色彩情绪 | 色彩情绪可能不够精准 |
| 品牌规范+产品定位均缺失 | 用户提供产品名称和目标用户→生成通用设计令牌 | 输出为通用令牌，关键决策标注"待确认" |
| 目标平台缺失 | 提示用户提供或默认输出Web格式 | 默认Web格式，标注"待平台确认" |
| PRD缺失 | 用户提供核心页面列表和功能描述 | 仅生成核心组件，非核心标注"待PRD补充" |
| 现有组件库信息缺失 | 从零规划，不检查重复 | 可能存在与已有组件重复，标注"需与现有库对齐" |
| project_dir 缺失 | 仅输出到 output/ 目录，不写入项目目录 | 代码文件需手动复制到项目 |

---

## 数据获取说明

本Skill需要品牌规范和目标平台，请通过以下方式之一提供：

1. 直接提供品牌色彩、字体和风格指南
2. 上传positioning-statements.json文件
3. 描述产品名称、行业和目标用户

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 定位陈述变更 | 品牌色、品牌字体 | 标注受影响的令牌类别，建议人类确认是否更新令牌 |
| 目标平台新增 | 新增平台适配令牌 | 标注需新增的平台令牌，建议人类确认 |
| PRD功能变更 | 组件需求 | 标注受影响的组件，建议重新规划组件库 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 色彩令牌变更 | ui-component-gen、page-assembly | 受影响的组件和页面 | 任何色彩令牌值变更 |
| 间距令牌变更 | ui-component-gen、page-assembly | 受影响的布局 | 间距梯度变更 |
| 字体令牌变更 | ui-component-gen、page-assembly | 受影响的文本样式 | 字号或字重变更 |
| 动画令牌变更 | ui-component-gen | 受影响的动画代码 | duration或easing变更 |
| 组件增删 | ui-component-gen、page-assembly | 新增/删除的组件 | 组件列表变更 |
| 新增令牌类别 | ui-component-gen | 新增令牌 | 新增令牌类别 |

---

## 变更记录

- v2.1: 新增目标语言参数及语言适配规则表；外部Skill调用点重构为表格格式（含客观触发条件/Register感知/反模式）；暗色模式/Figma同步/i18n改为内建能力
- v2.0: 合并 design-token + component-library + design-system-doc 为单一Skill，新增动画令牌、外部Skill调用点、上游变更响应双表、字段级输出校验
- v1.1: 各子Skill独立版本
