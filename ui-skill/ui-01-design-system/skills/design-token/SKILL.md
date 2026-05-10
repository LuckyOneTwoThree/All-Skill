---
name: design-token
description: 当需要提取和生成设计令牌时使用。设计令牌自动生成，从品牌规范和产品定位提取设计变量，生成色彩体系、字体排版、间距节奏、阴影层级、圆角规范等设计令牌，输出为多平台可消费的Token文件（CSS Variables / Tailwind Config / Figma Tokens）。关键词：设计令牌、Design Token、色彩体系、字体排版、设计变量。
metadata:
  module: "UI设计与前端开发"
  sub-module: "设计系统"
  type: "pipeline"
  version: "1.0"
---

# Pipeline 1: 设计令牌自动生成

## 核心原则

1. **品牌驱动**：所有设计令牌必须从品牌基因推导，而非凭空定义
2. **语义化命名**：令牌使用语义命名（如 `color-primary` 而非 `color-blue-500`），确保主题切换和品牌更新时只需修改源头
3. **多平台消费**：一次定义，自动输出为CSS Variables、Tailwind Config、Figma Tokens等多格式
4. **可访问性优先**：色彩对比度必须满足WCAG 2.1 AA标准（≥4.5:1正文 / ≥3:1大文本）

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 品牌规范 | JSON/markdown | 是 | 用户提供 | 品牌色彩、字体、风格指南 |
| 产品定位 | JSON | 是 | positioning-statement → positioning-statements.json | 产品定位陈述，影响视觉风格 |
| 目标平台 | string | 是 | 用户提供 | Web / Mobile / 跨平台 |

## 执行步骤

### Step 1: 品牌基因提取

从品牌规范中提取核心设计基因：

- **主色调**：品牌主色（1个）+ 辅助色（2-3个）
- **色彩情绪**：专业/温暖/活力/科技/稳重
- **字体气质**：现代/经典/几何/人文
- **视觉风格**：扁平/拟物/毛玻璃/新拟态

### Step 2: 色彩体系生成

基于主色调生成完整色彩体系：

| 令牌类别 | 生成规则 | 数量 |
|----------|----------|------|
| 品牌色 | 主色 + 辅助色，各生成50-950共10个色阶 | 30-40 |
| 功能色 | 成功(绿)/警告(橙)/错误(红)/信息(蓝)，各10个色阶 | 40 |
| 中性色 | 灰度色阶50-950 | 10 |
| 语义色 | 背景/前景/边框/链接/禁用，映射到具体色阶 | 15-20 |

**对比度校验规则**：
- 正文色与背景色对比度 ≥ 4.5:1
- 大文本与背景色对比度 ≥ 3:1
- 不达标时自动调整色阶并标注"已调整"

### Step 3: 字体排版体系

| 令牌类别 | 生成规则 |
|----------|----------|
| 字体家族 | 主字体 + 回退字体栈（系统字体→Web安全字体） |
| 字号层级 | 12/14/16/18/20/24/30/36/48px（模块化缩放比1.2-1.25） |
| 行高 | 紧凑(1.3)/常规(1.5)/宽松(1.8) |
| 字重 | Regular(400)/Medium(500)/Semibold(600)/Bold(700) |
| 字间距 | 标题(-0.02em)/正文(0)/宽松(0.05em) |

### Step 4: 间距与布局体系

| 令牌类别 | 生成规则 |
|----------|----------|
| 间距 | 基准4px，生成4/8/12/16/24/32/48/64/96px |
| 圆角 | 无(0)/小(4px)/中(8px)/大(12px)/圆(50%) |
| 阴影 | 层级1(卡片)/层级2(悬浮)/层级3(弹窗)/层级4(全屏遮罩) |
| 断点 | 移动(375)/平板(768)/桌面(1024)/大屏(1440)px |

### Step 5: 多平台输出

将所有令牌转换为多平台可消费格式：

- **CSS Variables**：`--color-primary-500: #3B82F6;`
- **Tailwind Config**：`colors: { primary: { 500: '#3B82F6' } }`
- **Figma Tokens JSON**：标准Design Tokens格式
- **iOS/Swift**：`Color.primary500` / `UIFont.systemFont`
- **Android/Kotlin**：`R.color.primary_500` / `dimen.spacing_md`

## 输出

**存储路径**：`output/ui-design-system/design-token/`

```json
{
  "token_metadata": {
    "version": "1.0.0",
    "brand_name": "智学云",
    "generated_at": "ISO8601",
    "platforms": ["web", "ios", "android"]
  },
  "color": {
    "brand": {
      "primary": { "50": "#EFF6FF", "500": "#3B82F6", "900": "#1E3A8A" },
      "secondary": { "50": "#F0FDF4", "500": "#22C55E", "900": "#14532D" }
    },
    "semantic": {
      "background-primary": "{color.neutral.50}",
      "text-primary": "{color.neutral.900}",
      "border-default": "{color.neutral.200}"
    },
    "functional": {
      "success": { "500": "#22C55E" },
      "warning": { "500": "#F59E0B" },
      "error": { "500": "#EF4444" },
      "info": { "500": "#3B82F6" }
    },
    "neutral": { "50": "#F9FAFB", "500": "#6B7280", "900": "#111827" }
  },
  "typography": {
    "font_family": {
      "primary": "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      "mono": "'JetBrains Mono', 'Fira Code', monospace"
    },
    "font_size": { "xs": "12px", "sm": "14px", "base": "16px", "lg": "18px", "xl": "20px", "2xl": "24px", "3xl": "30px", "4xl": "36px" },
    "line_height": { "tight": "1.3", "normal": "1.5", "relaxed": "1.8" },
    "font_weight": { "regular": "400", "medium": "500", "semibold": "600", "bold": "700" }
  },
  "spacing": { "1": "4px", "2": "8px", "3": "12px", "4": "16px", "6": "24px", "8": "32px", "12": "48px", "16": "64px" },
  "border_radius": { "none": "0", "sm": "4px", "md": "8px", "lg": "12px", "full": "50%" },
  "shadow": {
    "sm": "0 1px 2px rgba(0,0,0,0.05)",
    "md": "0 4px 6px rgba(0,0,0,0.07)",
    "lg": "0 10px 15px rgba(0,0,0,0.1)",
    "xl": "0 20px 25px rgba(0,0,0,0.15)"
  },
  "breakpoint": { "sm": "375px", "md": "768px", "lg": "1024px", "xl": "1440px" },
  "contrast_check": {
    "text_on_bg": { "ratio": "7.2:1", "level": "AAA" },
    "secondary_text_on_bg": { "ratio": "4.8:1", "level": "AA" }
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 品牌色对比度<4.5:1（白色背景） | 自动生成深色变体作为文本色，原色仅用于装饰元素 |
| 品牌色对比度≥4.5:1 | 可同时用于文本和装饰 |
| 目标平台=Web | 输出CSS Variables + Tailwind Config |
| 目标平台=Mobile | 输出iOS Swift + Android Kotlin |
| 目标平台=跨平台 | 输出全部格式 |
| 色彩情绪=专业/稳重 | 中性色占比≥60%，品牌色点缀≤20% |
| 色彩情绪=活力/温暖 | 品牌色占比30%-40%，中性色≤40% |
| 间距基准非4px/8px | 强制对齐到4px网格，标注"已对齐" |

## 质量检查

- [ ] 色彩体系覆盖品牌色+功能色+中性色+语义色4类，总计≥80个令牌
- [ ] 正文色与背景色对比度≥4.5:1（WCAG AA）
- [ ] 字号层级≥6级，最大与最小比≤4倍
- [ ] 间距令牌≥8级，基准为4px整数倍
- [ ] 100%的语义令牌引用具体色阶而非硬编码色值
- [ ] 输出格式覆盖目标平台所需全部格式

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 品牌规范缺失 | 用户提供产品名称和行业 → 基于行业基准生成默认品牌色 | 品牌色基于行业推断，标注"待品牌确认" |
| 产品定位缺失 | 基于品牌规范推断色彩情绪 | 色彩情绪可能不够精准 |
| 品牌规范+产品定位均缺失 | 用户提供产品名称和目标用户 → 生成通用设计令牌 | 输出为通用令牌，关键决策标注"待确认" |

数据获取说明：
- 本Skill需要品牌规范和产品定位，请通过以下方式之一提供：
  1. 直接提供品牌色彩、字体和风格指南
  2. 上传positioning-statements.json文件
  3. 描述产品名称、行业和目标用户
