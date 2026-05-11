---
name: interaction-spec
description: 当需要将用户流程和原型设计转化为完整的交互设计规范时使用。交互设计规范文档自动生成，包含交互状态机、动画规范、手势操作、反馈机制、无障碍交互和异常状态处理。关键词：交互设计规范、交互规范、状态机、动画规范、手势操作、交互反馈、无障碍交互。
metadata:
  module: "产品构思与设计"
  sub-module: "产品设计与原型"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_suggest_human_approve"
  upstream:
    - design-userflow
    - design-prototype
    - design-handoff-spec
---

# 交互设计规范文档生成

## 核心原则

**交互规范是用户体验的宪法**

交互设计规范确保产品中每个交互行为都有一致、可预测、无障碍的体验。规范不是限制创造力，而是保证基础体验质量的底线，让设计师可以专注于创新而非重复定义基础交互。

## 输入

| 输入项 | 来源 | 必需 | 说明 |
|--------|------|------|------|
| 用户流程 | output/pm-design/design-userflow | ✅ | 用户流程图、状态转换、决策节点 |
| 原型规格 | output/pm-design/design-prototype | ✅ | 原型设计、交互标注、组件规格 |
| 设计交接文档 | output/pm-design/design-handoff-spec | ⬜ | 设计令牌、组件规格、响应式断点 |
| 品牌规范 | 用户提供 | ⬜ | 品牌调性、动画风格偏好 |

### 降级策略

| 缺失输入 | 降级方案 |
|----------|----------|
| 无用户流程 | 基于原型推导交互流程，标注"流程待确认" |
| 无原型规格 | 基于用户流程生成交互规范框架，标注"待原型验证" |
| 无设计交接文档 | 交互规范独立编号，后续与交接文档对齐 |
| 无品牌规范 | 采用中性交互风格，标注"待品牌确认" |

## 执行步骤

### Step 1：交互状态机定义

为每个核心组件和页面定义交互状态机：

1. **状态枚举**：Default / Hover / Active / Focus / Disabled / Loading / Error / Empty / Success
2. **状态转换表**：触发条件、转换动作、过渡效果、持续时间
3. **状态优先级**：多状态叠加时的优先级规则（如 Disabled + Error）
4. **状态持久性**：瞬时状态 vs 持续状态的保持规则

### Step 2：动画与过渡规范

定义产品中所有动画和过渡效果的标准：

1. **缓动函数**：
   - 标准缓动：`cubic-bezier(0.4, 0.0, 0.2, 1)` — 通用过渡
   - 减速缓动：`cubic-bezier(0.0, 0.0, 0.2, 1)` — 进入动画
   - 加速缓动：`cubic-bezier(0.4, 0.0, 1, 1)` — 退出动画
   - 急速缓动：`cubic-bezier(0.4, 0.0, 0.6, 1)` — 频繁切换
2. **持续时间标准**：
   - 微交互：100-150ms（按钮反馈、开关切换）
   - 小型过渡：150-250ms（下拉展开、Toast出现）
   - 大型过渡：250-400ms（页面切换、模态框）
   - 复杂动画：400-600ms（数据可视化、3D变换）
3. **动画性能**：仅使用 transform 和 opacity，避免 layout 和 paint 触发
4. **减弱动画**：`prefers-reduced-motion` 适配规则

### Step 3：手势与操作规范

定义各平台的手势操作标准：

1. **点击/按压**：
   - 点击热区最小 44×44px（iOS）/ 48×48dp（Android）
   - 长按阈值 500ms，触觉反馈
   - 双击间隔阈值 300ms
2. **滑动/拖拽**：
   - 滑动触发阈值 8px
   - 滑动速度与惯性衰减
   - 边缘滑动保留系统手势
3. **缩放/旋转**：
   - 双指缩放范围 [0.5x, 3.0x]
   - 旋转吸附角度 15°
4. **键盘操作**：
   - Tab 顺序与焦点管理
   - 快捷键映射表
   - Enter/Space 激活规则

### Step 4：反馈机制规范

定义用户操作的反馈标准：

1. **即时反馈**（0-100ms）：
   - 按钮按下态、链接悬停态
   - 输入框聚焦态、开关切换态
2. **过程反馈**（100ms-2s）：
   - 加载指示器（Spinner/Skeleton/Progress）
   - 上传/下载进度条
   - 骨架屏占位规范
3. **结果反馈**（操作完成后）：
   - 成功：Toast / Inline Message（绿色系，3s自动消失）
   - 警告：Toast / Banner（黄色系，需手动关闭或5s消失）
   - 错误：Inline Message / Modal（红色系，需手动关闭）
   - 信息：Toast / Tooltip（蓝色系，3s自动消失）
4. **无反馈场景**：明确列出不需要反馈的操作及理由

### Step 5：异常状态交互

定义异常场景的交互处理：

1. **网络异常**：离线提示、重试机制、本地缓存策略
2. **数据为空**：空状态插图、引导操作、推荐内容
3. **权限不足**：权限说明、申请入口、替代操作
4. **数据超限**：截断规则、展开交互、分页加载
5. **并发冲突**：冲突检测、合并策略、用户选择

### Step 6：无障碍交互规范

确保交互符合无障碍标准：

1. **WCAG 2.1 AA 合规**：
   - 可感知：文本替代、时基媒体替代、适应性、可辨别
   - 可操作：键盘可操作、充足时间、癫痫安全、可导航
   - 可理解：可读性、可预测性、输入辅助
   - 健壮性：兼容辅助技术
2. **焦点管理**：焦点陷阱（Modal）、焦点还原（关闭Modal后）、焦点顺序
3. **ARIA标注**：角色（role）、状态（aria-state）、属性（aria-property）使用规范
4. **屏幕阅读器**：关键交互的朗读文本和朗读顺序

### Step 7：报告组装

将以上内容组装为完整交互设计规范文档。

## 输出

### 输出文件

| 文件 | 路径 | 说明 |
|------|------|------|
| 交互设计规范 | `output/pm-design/interaction-spec/interaction-spec.md` | 人类可读的完整规范 |
| 结构化数据 | `output/pm-design/interaction-spec/interaction-spec.json` | 机器可消费的结构化数据 |

### Markdown 报告结构

```markdown
# 交互设计规范：{产品名称}

## 1. 交互状态机
- 状态枚举与定义
- 状态转换表
- 状态优先级规则
- 状态持久性规则

## 2. 动画与过渡规范
- 缓动函数标准
- 持续时间标准
- 性能约束
- 减弱动画适配

## 3. 手势与操作规范
- 点击/按压规范
- 滑动/拖拽规范
- 缩放/旋转规范
- 键盘操作规范

## 4. 反馈机制规范
- 即时反馈（0-100ms）
- 过程反馈（100ms-2s）
- 结果反馈（成功/警告/错误/信息）
- 无反馈场景

## 5. 异常状态交互
- 网络异常
- 数据为空
- 权限不足
- 数据超限
- 并发冲突

## 6. 无障碍交互规范
- WCAG 2.1 AA合规检查
- 焦点管理规则
- ARIA标注规范
- 屏幕阅读器适配

## 7. 交互规范索引
- 组件×状态交叉引用表
- 动画×场景交叉引用表
```

### JSON 结构

```json
{
  "product_name": "",
  "report_date": "",
  "state_machines": {
    "states": [],
    "transitions": [],
    "priority_rules": [],
    "persistence_rules": []
  },
  "animation": {
    "easing_functions": [],
    "duration_standards": [],
    "performance_constraints": [],
    "reduced_motion": {}
  },
  "gestures": {
    "tap_press": {},
    "swipe_drag": {},
    "pinch_rotate": {},
    "keyboard": {}
  },
  "feedback": {
    "immediate": [],
    "progress": [],
    "result": [],
    "no_feedback_scenarios": []
  },
  "error_states": {
    "network_error": {},
    "empty_state": {},
    "permission_denied": {},
    "data_overflow": {},
    "concurrent_conflict": {}
  },
  "accessibility": {
    "wcag_compliance": [],
    "focus_management": [],
    "aria_specifications": [],
    "screen_reader": []
  }
}
```

## 质量检查

| 检查项 | 标准 | 不通过处理 |
|--------|------|------------|
| 状态机完整 | 8种基础状态全覆盖 | 补充缺失状态定义 |
| 动画性能合规 | 仅使用transform/opacity | 替换不合规动画属性 |
| 无障碍合规 | WCAG 2.1 AA全部覆盖 | 补充缺失无障碍规范 |
| 反馈全覆盖 | 每种用户操作有对应反馈 | 补充缺失反馈或标注"无反馈"理由 |
