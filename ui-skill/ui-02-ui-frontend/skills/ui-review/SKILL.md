---
name: ui-review
description: 当需要对UI进行自动化审查时使用。UI审查自动执行，对生成的UI组件和页面进行视觉还原度、交互完整性、无障碍合规和响应式适配的自动化审查，输出问题清单和修复建议。关键词：UI审查、视觉还原、无障碍、响应式、WCAG、设计规范检查。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 7: UI审查自动执行

## 核心原则

1. **可量化检查**：所有检查项有明确的通过/不通过标准，不做主观判断
2. **自动优先**：能自动检查的不依赖人工，人工仅处理需审美判断的项
3. **修复建议可执行**：每个问题附带具体的代码级修复建议
4. **分级处理**：P0阻塞发布 / P1本迭代修复 / P2下迭代优化

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 组件代码 | code | 是 | output/ui-frontend/ui-component-gen | 待审查的组件代码 |
| 页面代码 | code | 是 | output/ui-frontend/page-assembly | 待审查的页面代码 |
| 设计令牌 | JSON | 是 | output/ui-design-system/design-token/tokens.json | 设计规范基准 |
| 交互规格 | JSON | ○ | output/ui-frontend/interaction-design | 交互行为定义 |

## 执行步骤

### Step 1: 设计规范一致性检查

检查代码与Design Token的一致性：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 色值引用 | 100%使用Token变量，无硬编码色值 | P0 |
| 字号引用 | 100%使用Token变量，无硬编码字号 | P0 |
| 间距引用 | 100%使用Token变量，无硬编码间距 | P1 |
| 圆角引用 | 100%使用Token变量 | P1 |
| 阴影引用 | 100%使用Token变量 | P2 |
| 组件复用 | 无与组件库重复的自建组件 | P1 |

### Step 2: 无障碍合规检查

基于WCAG 2.1 AA标准检查：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 色彩对比度 | 正文≥4.5:1，大文本≥3:1 | P0 |
| 图片替代文本 | 所有img有alt属性 | P0 |
| 表单标签 | 所有表单控件有关联label | P0 |
| 键盘可操作 | 所有交互可通过键盘完成 | P0 |
| ARIA属性 | 交互组件有正确的role和aria-* | P0 |
| 焦点管理 | 弹窗打开/关闭后焦点正确转移 | P1 |
| 焦点可见 | 焦点环清晰可见 | P1 |
| 标题层级 | h1-h6层级不跳级 | P2 |

### Step 3: 交互完整性检查

检查交互规格的实现完整性：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 状态覆盖 | default/hover/focus/active/disabled全部实现 | P0 |
| 加载状态 | 异步操作有loading指示 | P0 |
| 空状态 | 数据为空时有空状态展示 | P1 |
| 错误状态 | 请求失败有错误提示和重试 | P1 |
| 动画规范 | 时长100-500ms，使用标准缓动 | P2 |
| reduced-motion | 尊重用户减弱动画偏好 | P1 |

### Step 4: 响应式适配检查

检查多端适配：

| 检查项 | 通过标准 | 级别 |
|--------|---------|------|
| 移动端布局 | 375px宽度下内容不溢出 | P0 |
| 平板端布局 | 768px宽度下布局合理 | P1 |
| 桌面端布局 | 1024px+宽度下布局合理 | P1 |
| 触控目标 | 可点击元素≥44×44px | P0 |
| 文字缩放 | 200%缩放下内容可读 | P1 |
| 横竖屏 | 移动端横竖屏切换布局正常 | P2 |

### Step 5: 问题汇总与修复建议

汇总所有问题并生成修复建议：

- 按P0/P1/P2分级
- 每个问题附带：文件路径、行号、问题描述、修复建议代码
- 统计通过率和问题分布
- 生成修复优先级排序

## 输出

**存储路径**：`output/ui-frontend/ui-review/`

**输出文件**：review-report.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["review_summary", "issues"],
  "properties": {
    "review_summary": {"type": "object", "description": "审查汇总统计，包含检查总数、通过数、失败数、通过率和各级别问题数"},
    "issues": {"type": "array", "description": "问题清单，包含问题ID、严重级别、类别、文件位置、描述和修复建议"}
  }
}
```

```json
{
  "review_summary": {
    "total_checks": 28,
    "passed": 22,
    "failed": 6,
    "pass_rate": "78.6%",
    "p0_issues": 1,
    "p1_issues": 3,
    "p2_issues": 2
  },
  "issues": [
    {
      "id": "UIR-001",
      "severity": "P0",
      "category": "accessibility",
      "file": "CourseCard.tsx",
      "line": 45,
      "description": "按钮缺少aria-label，屏幕阅读器无法识别操作目的",
      "fix_suggestion": "添加 aria-label=\"报名课程\" 到 Button 组件",
      "fix_code": "<Button aria-label=\"报名课程\" onClick={onEnroll}>"
    },
    {
      "id": "UIR-002",
      "severity": "P1",
      "category": "design_consistency",
      "file": "CourseCard.module.css",
      "line": 12,
      "description": "硬编码色值 #3B82F6，应使用Token变量",
      "fix_suggestion": "替换为 var(--color-primary-500)",
      "fix_code": "background: var(--color-primary-500);"
    }
  ]
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| P0问题>0 | 阻塞发布，必须修复 |
| P0问题=0 且 P1问题≤3 | 可发布，标注已知问题 |
| P0问题=0 且 P1问题>3 | 建议修复后再发布 |
| 通过率≥95% | 标记"高质量" |
| 通过率80%-95% | 标记"合格" |
| 通过率<80% | 标记"需改进" |
| 同类问题≥3个 | 标记"系统性问题"，建议全局修复 |

## 质量检查

- [ ] 审查覆盖设计规范/无障碍/交互/响应式4个维度
- [ ] 每个问题有明确的通过标准（非主观判断）
- [ ] 每个问题附带可执行的修复建议
- [ ] P0问题100%有修复代码建议
- [ ] 审查结果按P0/P1/P2分级

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 设计令牌缺失 | 跳过设计规范一致性检查 | 无法检查硬编码值 |
| 交互规格缺失 | 跳过交互完整性检查 | 无法检查交互实现完整性 |
| 页面代码缺失 | 仅审查组件级问题 | 缺少页面级布局和响应式检查 |

数据获取说明：
- 本Skill需要组件代码和设计令牌，请通过以下方式之一提供：
  1. 上传组件代码文件和tokens.json
  2. 提供代码仓库路径
  3. 描述需要审查的组件和页面
