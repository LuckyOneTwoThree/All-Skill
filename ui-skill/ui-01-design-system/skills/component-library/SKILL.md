---
name: component-library
description: 当需要规划和生成组件库时使用。组件库自动规划与生成，基于设计令牌和PRD，规划原子/分子/组织三级组件层级，生成组件规格定义和基础代码骨架，确保UI一致性和复用性。关键词：组件库、组件规划、原子设计、UI组件、设计系统组件。
metadata:
  module: "UI设计与前端开发"
  sub-module: "设计系统"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
---

# Pipeline 2: 组件库自动规划与生成

## 核心原则

1. **原子设计分层**：严格按原子(Atom)→分子(Molecule)→组织(Organism)→模板(Template)分层，确保组件粒度合理
2. **组合优于继承**：组件通过组合复用，避免深层继承链导致的耦合
3. **令牌驱动**：所有视觉属性引用Design Token，不硬编码样式值
4. **可访问性内建**：每个组件默认包含键盘导航、ARIA属性、焦点管理

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 设计令牌 | JSON | 是 | output/ui-design-system/design-token/tokens.json | 色彩、字体、间距等设计变量 |
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 产品需求文档，提取组件需求 |
| 现有组件库 | JSON | ○ | 用户提供 | 已有组件清单（如有，避免重复） |

## 执行步骤

### Step 1: 组件需求提取

从PRD中提取所有UI组件需求：

- 梳理全部页面和功能模块
- 提取每个页面中需要的UI元素
- 标注交互行为（点击、输入、拖拽、滚动）
- 识别跨页面复用的UI模式

### Step 2: 原子组件定义

定义最小粒度的不可再分组件：

| 原子组件类别 | 典型组件 | 规格要素 |
|-------------|---------|---------|
| 基础按钮 | Button | 变体(primary/secondary/ghost/danger)、尺寸(sm/md/lg)、状态(default/hover/active/disabled/loading) |
| 输入控件 | Input / Select / Checkbox / Radio / Switch | 尺寸、验证状态、前缀后缀图标 |
| 文本展示 | Text / Heading / Label / Badge | 字号令牌、颜色令牌、截断规则 |
| 图标 | Icon | 尺寸(16/20/24/32)、颜色令牌 |
| 分割 | Divider / Spacer | 方向、粗细、间距令牌 |
| 容器 | Box / Card | 内边距令牌、圆角令牌、阴影令牌 |

**每个原子组件必须定义**：
- Props接口（名称、类型、默认值、必填性）
- 视觉变体（Variant）列表
- 状态列表及各状态视觉表现
- 可访问性要求（ARIA role、键盘交互）

### Step 3: 分子组件组合

由原子组件组合而成的功能单元：

| 分子组件类别 | 典型组合 | 组成原子 |
|-------------|---------|---------|
| 表单字段 | FormField | Label + Input + ErrorText |
| 搜索栏 | SearchBar | Input + Icon + Button |
| 列表项 | ListItem | Text + Badge + Icon + Chevron |
| 导航标签 | NavTab | Button(active变体) + Badge |
| 头像组 | AvatarGroup | Avatar × N + Badge(+N) |
| 评分 | Rating | Icon(star) × N |

**组合规则**：
- 分子组件不直接使用令牌，通过原子组件间接引用
- 分子组件定义原子组件间的布局关系（间距令牌）
- 分子组件管理内部原子组件的状态联动

### Step 4: 组织组件定义

由分子组件和原子组件组合的完整功能区块：

| 组织组件类别 | 典型组件 | 组成分子/原子 |
|-------------|---------|-------------|
| 表单 | Form | FormField × N + Button(submit) |
| 数据表格 | DataTable | ListItem(header) + ListItem(row) × N + Pagination |
| 侧边导航 | SideNav | NavTab × N + SectionHeading |
| 对话框 | Dialog | Box + Heading + Text + Button × 2 |
| 卡片列表 | CardGrid | Card × N + Pagination |

### Step 5: 组件依赖图与代码骨架

生成组件依赖关系图和代码骨架：

- **依赖图**：原子→分子→组织的完整依赖链
- **代码骨架**：每个组件生成TypeScript接口定义 + React/Vue组件骨架
- **Storybook Stories**：每个组件生成Story文件，覆盖所有变体和状态
- **单元测试骨架**：渲染测试 + 交互测试 + 可访问性测试

## 输出

**存储路径**：`output/ui-design-system/component-library/`

**输出文件**：library.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["library_metadata", "components", "dependency_graph"],
  "properties": {
    "library_metadata": {"type": "object", "description": "组件库元信息，包含版本号和各级组件数量统计"},
    "components": {"type": "array", "description": "组件定义列表，包含每个组件的Props、变体、状态和可访问性规格"},
    "dependency_graph": {"type": "object", "description": "组件依赖关系图，键为组件名，值为依赖的子组件列表"}
  }
}
```

```json
{
  "library_metadata": {
    "version": "1.0.0",
    "token_version": "1.0.0",
    "total_components": 45,
    "atoms": 15,
    "molecules": 18,
    "organisms": 12
  },
  "components": [
    {
      "name": "Button",
      "level": "atom",
      "props": {
        "variant": { "type": "enum", "values": ["primary", "secondary", "ghost", "danger"], "default": "primary" },
        "size": { "type": "enum", "values": ["sm", "md", "lg"], "default": "md" },
        "disabled": { "type": "boolean", "default": false },
        "loading": { "type": "boolean", "default": false },
        "icon": { "type": "IconName", "default": null },
        "children": { "type": "ReactNode", "default": null }
      },
      "variants": ["primary", "secondary", "ghost", "danger"],
      "states": ["default", "hover", "active", "focus", "disabled", "loading"],
      "accessibility": {
        "role": "button",
        "keyboard": ["Enter", "Space"],
        "aria_props": ["aria-disabled", "aria-busy"]
      },
      "token_refs": ["color.brand.primary.500", "spacing.2", "border-radius.md", "typography.font-weight.semibold"]
    }
  ],
  "dependency_graph": {
    "FormField": ["Label", "Input", "ErrorText"],
    "SearchBar": ["Input", "Icon", "Button"],
    "Form": ["FormField", "Button"]
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 组件复用度≥3个页面 | 纳入组件库，优先级=高 |
| 组件复用度1-2个页面 | 纳入组件库，优先级=中 |
| 组件仅1个页面使用且无复用可能 | 不纳入组件库，作为页面私有组件 |
| 原子组件数量>25个 | 检查是否有粒度过细的组件，建议合并 |
| 分子组件依赖>5个原子 | 检查职责是否过多，建议拆分为2个分子组件 |
| 组织组件嵌套层级>3层 | 标记"嵌套过深"，建议扁平化 |
| 现有组件库已有同类组件 | 复用现有组件，不重复创建，标注差异点 |

## 质量检查

- [ ] 组件层级严格遵循原子→分子→组织三级，无跨层引用
- [ ] 100%的视觉属性引用Design Token，无硬编码色值/字号/间距
- [ ] 每个组件Props接口定义完整（类型+默认值+必填性）
- [ ] 交互组件100%包含可访问性规格（ARIA role + 键盘交互）
- [ ] 组件变体覆盖全部状态（default/hover/active/focus/disabled）
- [ ] 依赖图无循环依赖
- [ ] 原子组件数量15-25个，分子组件15-25个，组织组件8-15个

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 设计令牌缺失 | 使用通用设计令牌（基于行业基准） | 组件视觉属性引用通用令牌，标注"待Design Token确认" |
| PRD缺失 | 用户提供核心页面列表和功能描述 | 仅生成核心组件，非核心组件标注"待PRD补充" |
| 现有组件库信息缺失 | 从零规划，不检查重复 | 可能存在与已有组件重复，标注"需与现有库对齐" |

数据获取说明：
- 本Skill需要设计令牌和PRD，请通过以下方式之一提供：
  1. 上传tokens.json和prd.md文件
  2. 描述核心页面列表和功能需求
  3. 提供现有组件库清单（如有）
