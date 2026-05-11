---
name: design-system-doc
description: 当需要生成设计系统文档时使用。设计系统文档自动生成，基于设计令牌和组件库，生成完整的设计系统文档，包含使用指南、组件示例代码、设计规范说明、最佳实践和变更日志模板。关键词：设计系统文档、组件文档、使用指南、设计规范、Storybook。
metadata:
  module: "UI设计与前端开发"
  sub-module: "设计系统"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 3: 设计系统文档自动生成

## 核心原则

1. **文档即代码**：文档与组件代码同源，变更同步，避免文档与实现脱节
2. **示例驱动**：每个组件提供可运行的代码示例，而非纯文字描述
3. **Do & Don't**：每个设计规范包含正确和错误示例，降低理解成本
4. **版本可追溯**：文档与设计令牌/组件库版本绑定，变更自动记录

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 设计令牌 | JSON | 是 | output/ui-design-system/design-token/tokens.json | 设计变量定义 |
| 组件库 | JSON | 是 | output/ui-design-system/component-library/library.json | 组件规格定义 |
| 品牌规范 | JSON/markdown | ○ | 用户提供 | 品牌故事、设计理念 |

## 执行步骤

### Step 1: 文档结构规划

生成设计系统文档的目录结构：

```
design-system/
├── getting-started/        # 快速开始
│   ├── installation.md     # 安装指南
│   └── usage.md            # 基础用法
├── foundations/             # 设计基础
│   ├── colors.md           # 色彩体系
│   ├── typography.md       # 字体排版
│   ├── spacing.md          # 间距系统
│   ├── shadows.md          # 阴影层级
│   └── breakpoints.md      # 响应式断点
├── components/             # 组件文档
│   ├── button.md           # 按钮组件
│   ├── input.md            # 输入框组件
│   └── ...                 # 其他组件
├── patterns/               # 设计模式
│   ├── forms.md            # 表单模式
│   ├── data-display.md     # 数据展示模式
│   └── navigation.md       # 导航模式
└── changelog.md            # 变更日志
```

### Step 2: 设计基础文档生成

为每个设计令牌类别生成文档：

- **色彩**：色板展示 + 对比度标注 + 使用场景说明 + Do/Don't示例
- **字体**：字号层级展示 + 行高对比 + 字重使用场景
- **间距**：间距可视化 + 布局示例 + 响应式间距规则
- **阴影**：层级对比展示 + 使用场景（卡片/悬浮/弹窗）
- **断点**：设备尺寸映射 + 响应式策略

### Step 3: 组件文档生成

为每个组件生成标准文档，包含：

| 文档章节 | 内容 |
|----------|------|
| 概述 | 组件用途、适用场景 |
| 变体展示 | 所有Variant的可视化展示 |
| Props表格 | 属性名、类型、默认值、说明 |
| 代码示例 | 每个Variant的可运行代码 |
| 可访问性 | ARIA属性、键盘交互说明 |
| 设计规范 | Do/Don't示例、使用约束 |
| 相关组件 | 关联组件链接 |

### Step 4: 设计模式文档生成

基于组件库中的组织组件，提炼通用设计模式：

- **表单模式**：布局规则、验证反馈、错误处理、必填标识
- **数据展示模式**：空状态、加载状态、分页、排序筛选
- **导航模式**：面包屑、侧边栏、标签页、返回顶部
- **反馈模式**：Toast、Dialog、Drawer、进度指示

### Step 5: 变更日志与版本管理

生成版本管理规范：

- 语义化版本号（Major.Minor.Patch）
- 变更类型分类（Added/Changed/Deprecated/Removed/Fixed）
- 变更日志模板
- 迁移指南模板（Major版本升级时）

## 输出

**存储路径**：`output/ui-design-system/design-system-doc/`

**输出文件**：doc-index.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["doc_metadata", "structure", "component_doc_example"],
  "properties": {
    "doc_metadata": {"type": "object", "description": "文档元信息，包含版本号、生成时间和文档页数统计"},
    "structure": {"type": "object", "description": "文档目录结构，按getting_started/foundations/components/patterns/changelog分类"},
    "component_doc_example": {"type": "object", "description": "组件文档示例，展示单个组件文档的覆盖情况"}
  }
}
```

```json
{
  "doc_metadata": {
    "version": "1.0.0",
    "token_version": "1.0.0",
    "library_version": "1.0.0",
    "generated_at": "ISO8601",
    "total_pages": 35,
    "components_documented": 45
  },
  "structure": {
    "getting_started": ["installation.md", "usage.md"],
    "foundations": ["colors.md", "typography.md", "spacing.md", "shadows.md", "breakpoints.md"],
    "components": ["button.md", "input.md", "select.md", "checkbox.md", "dialog.md", "form.md", "data-table.md"],
    "patterns": ["forms.md", "data-display.md", "navigation.md", "feedback.md"],
    "changelog": "changelog.md"
  },
  "component_doc_example": {
    "name": "Button",
    "variants": 4,
    "props_count": 6,
    "code_examples": 8,
    "do_dont_examples": 3,
    "accessibility_notes": true
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 组件变体≥4个 | 每个变体独立代码示例 + 合并对比示例 |
| 组件变体1-3个 | 合并为1个代码示例，参数注释说明 |
| 组件有≥3个使用约束 | 生成独立Do/Don't章节 |
| 组件有可访问性要求 | 强制生成可访问性章节，不可省略 |
| 设计令牌变更 | 自动标注影响范围（受影响组件列表） |
| 新增组件 | 生成完整文档，标记"新增" |
| 废弃组件 | 文档标注"已废弃"+迁移指南+移除版本号 |

## 质量检查

- [ ] 100%的组件有独立文档页
- [ ] 每个组件文档包含≥1个可运行代码示例
- [ ] 交互组件100%包含可访问性说明
- [ ] 设计基础文档覆盖色彩/字体/间距/阴影/断点5类
- [ ] 每个设计规范包含≥1组Do/Don't示例
- [ ] 文档版本号与设计令牌/组件库版本号一致

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 品牌规范缺失 | 跳过品牌故事章节，标注"待补充" | 缺少设计理念说明，不影响组件文档 |
| 组件库部分组件缺失 | 仅生成已有组件的文档 | 未覆盖的组件标注"待组件库补充" |
| 设计令牌缺失 | 使用通用令牌值，标注"待确认" | 色彩/字号等示例可能不准确 |

数据获取说明：
- 本Skill需要设计令牌和组件库定义，请通过以下方式之一提供：
  1. 上传tokens.json和library.json文件
  2. 提供设计令牌和组件库的描述
  3. 提供现有设计系统文档链接（用于增量更新）
