---
name: frontend-test
description: 当需要为前端组件生成测试用例时使用。前端测试自动生成与执行，为UI组件和页面自动生成组件测试、视觉回归测试、E2E测试和无障碍测试，确保前端代码质量可自动化验证。关键词：前端测试、组件测试、视觉回归、E2E测试、无障碍测试、Storybook。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 8: 前端测试自动生成与执行

## 核心原则

1. **测试金字塔**：单元测试(70%) > 集成测试(20%) > E2E测试(10%)
2. **用户行为驱动**：测试用户看到什么和做什么，而非实现细节
3. **快照即契约**：组件快照作为视觉契约，变更即预警
4. **持续验证**：测试集成到CI/CD，每次提交自动运行

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 组件代码 | code | 是 | output/ui-frontend/ui-component-gen | 待测试的组件代码 |
| 页面代码 | code | 是 | output/ui-frontend/page-assembly | 待测试的页面代码 |
| 交互规格 | JSON | ○ | output/ui-frontend/interaction-design | 交互行为定义（用于E2E场景） |
| UI审查结果 | JSON | ○ | output/ui-frontend/ui-review | 已知问题清单（优先覆盖） |

## 执行步骤

### Step 1: 组件单元测试生成

为每个组件生成单元测试：

| 测试类型 | 覆盖内容 | 工具 |
|----------|---------|------|
| 渲染测试 | 组件正常渲染、各变体渲染 | Jest + React Testing Library |
| Props测试 | 必填Props缺失时警告、默认值正确 | Jest |
| 交互测试 | 点击/输入/提交回调触发 | fireEvent / userEvent |
| 状态测试 | 状态转换正确、loading/error状态展示 | Jest + RTL |
| 边界测试 | 空数据/超长文本/极端值 | Jest |

**测试命名规范**：`should {期望结果} when {条件}`

### Step 2: Storybook Stories生成

为每个组件生成Storybook Stories：

- **基础Story**：每个Variant一个Story
- **交互Story**：展示交互行为（点击、输入、拖拽）
- **状态Story**：loading/error/disabled/empty状态
- **组合Story**：组件在典型场景中的组合使用
- **文档Story**：自动生成Props表格和使用说明

### Step 3: 视觉回归测试配置

配置视觉回归测试：

| 配置项 | 规范 |
|--------|------|
| 截图范围 | 每个Story自动截图 |
| 对比阈值 | 像素差异≤0.1%视为通过 |
| 视口尺寸 | 375px / 768px / 1440px |
| 比对模式 | 像素级diff + 结构相似度(SSIM) |
| 基线管理 | 首次截图自动设为基线，变更需人工审核 |
| 工具 | Chromatic / Percy / Loki |

### Step 4: E2E测试场景生成

基于交互规格生成E2E测试场景：

| 场景类别 | 典型场景 | 工具 |
|----------|---------|------|
| 核心流程 | 注册→登录→使用核心功能→退出 | Playwright / Cypress |
| 表单流程 | 填写→验证→提交→成功/失败 | Playwright |
| 导航流程 | 菜单导航→面包屑→浏览器前进后退 | Playwright |
| 权限流程 | 未登录访问→登录→权限内操作→权限外拦截 | Playwright |
| 错误恢复 | 网络断开→重连→数据恢复 | Playwright |

**E2E场景规则**：
- 每个核心用户流程≥1个E2E测试
- 测试数据使用Mock，不依赖真实后端
- 每个场景有独立的setup和teardown

### Step 5: 无障碍测试集成

集成自动化无障碍测试：

| 检查项 | 工具 | 标准 |
|--------|------|------|
| WCAG合规 | axe-core / jest-axe | AA级 |
| 键盘导航 | Playwright keyboard API | Tab/Enter/Escape可操作 |
| 屏幕阅读器 | AOM / aria-*检查 | 语义正确 |
| 色彩对比度 | axe-core | ≥4.5:1正文 / ≥3:1大文本 |

## 输出

**存储路径**：`output/ui-frontend/frontend-test/`

**输出文件**：test-report.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["test_summary", "coverage", "files"],
  "properties": {
    "test_summary": {"type": "object", "description": "测试汇总统计，包含单元测试、Stories、视觉回归、E2E和无障碍测试的数量"},
    "coverage": {"type": "object", "description": "测试覆盖率统计，包含组件覆盖率、交互覆盖率和无障碍覆盖率"},
    "files": {"type": "array", "description": "生成的测试文件列表，包含文件路径、类型和用例数"}
  }
}
```

```json
{
  "test_summary": {
    "unit_tests": { "total": 45, "components_covered": 12 },
    "stories": { "total": 68, "variants_covered": 34 },
    "visual_regression": { "baselines": 68, "viewports": [375, 768, 1440] },
    "e2e_scenarios": { "total": 8, "core_flows": 5 },
    "a11y_tests": { "total": 12, "standard": "WCAG 2.1 AA" }
  },
  "coverage": {
    "component_coverage": "100%",
    "interaction_coverage": "85%",
    "accessibility_coverage": "100%"
  },
  "files": [
    { "path": "__tests__/CourseCard.test.tsx", "type": "unit", "cases": 6 },
    { "path": "__tests__/CourseCard.stories.tsx", "type": "story", "stories": 5 },
    { "path": "e2e/course-enrollment.spec.ts", "type": "e2e", "steps": 8 }
  ]
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 组件交互复杂度≥5个状态 | 生成≥8个单元测试用例 |
| 组件交互复杂度<5个状态 | 生成≥4个单元测试用例 |
| 页面为核心用户流程 | 必须生成E2E测试 |
| 页面为辅助功能 | E2E测试可选 |
| 视觉回归diff>0.1% | 标记为视觉变更，需人工审核 |
| 无障碍测试不通过 | 标记P0，阻塞发布 |
| 组件覆盖率<80% | 补充缺失测试用例 |

## 质量检查

- [ ] 组件单元测试覆盖率≥80%
- [ ] 100%的交互组件有Storybook Story
- [ ] 视觉回归测试覆盖3个视口尺寸
- [ ] 核心用户流程100%有E2E测试
- [ ] 无障碍测试覆盖WCAG 2.1 AA标准
- [ ] 所有测试可独立运行，无相互依赖

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 交互规格缺失 | 仅生成渲染和Props测试，跳过交互测试 | 交互行为覆盖不足 |
| UI审查结果缺失 | 不针对已知问题生成专项测试 | 可能遗漏已知问题的回归测试 |
| 页面代码缺失 | 仅生成组件级测试 | 缺少E2E和页面集成测试 |

数据获取说明：
- 本Skill需要组件代码，请通过以下方式之一提供：
  1. 上传组件代码文件
  2. 提供代码仓库路径
  3. 描述组件功能和交互行为
