---
name: frontend-test
description: 当需要为前端组件生成测试用例时使用。前端测试自动生成与执行，为UI组件和页面自动生成组件测试、视觉回归测试、E2E测试和无障碍测试，确保前端代码质量可自动化验证。关键词：前端测试、组件测试、视觉回归、E2E测试、无障碍测试、Storybook、写测试、跑单测。
metadata:
  module: "UI设计与前端开发"
  sub-module: "UI前端生成"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "帮我写前端测试"
    - "给组件加测试用例"
    - "跑一下单测"
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
| 交互规格 | JSON | ○ | output/ui-frontend/ui-component-gen/ | 交互行为定义（用于E2E场景） |
| UI审查结果 | JSON | ○ | output/ui-frontend/ui-review | 已知问题清单（优先覆盖） |
| 目标语言 | string | ○ | 上游编排器传递（默认zh-CN） | 目标界面语言，影响测试断言文案和Mock数据语言 |
| project_dir | string | ○ | output/ui-project-scaffold/scaffold.json | 项目根目录绝对路径，测试文件直接写入此目录 |

## 执行步骤

### Step 1: 测试策略规划与单元测试生成

**测试文件写入规则**：当 project_dir 存在时，生成的测试文件直接写入 `{project_dir}/tests/` 目录，与项目代码同目录结构，确保测试可直接运行。

测试策略规划：

| 测试类型 | 覆盖内容 | 工具 | 占比 |
|----------|---------|------|------|
| 渲染测试 | 组件正常渲染、各变体渲染 | Jest+RTL | 30% |
| 交互测试 | 点击/输入/提交回调触发 | fireEvent/userEvent | 25% |
| 状态测试 | 状态转换、loading/error状态 | Jest+RTL | 15% |
| 边界测试 | 空数据/超长文本/极端值 | Jest | 10% |
| Storybook Stories | 每个Variant一个Story | Storybook | 20% |

测试命名规范：`should {期望结果} when {条件}`

### Step 2: E2E场景生成与无障碍测试

E2E测试场景（基于交互规格）：

| 场景类别 | 典型场景 | 工具 |
|----------|---------|------|
| 核心流程 | 注册→登录→使用核心功能→退出 | Playwright/Cypress |
| 表单流程 | 填写→验证→提交→成功/失败 | Playwright |
| 权限流程 | 未登录访问→登录→权限内操作 | Playwright |

E2E场景规则：
- 每个核心用户流程≥1个E2E测试
- 测试数据使用Mock，不依赖真实后端

无障碍测试集成：

| 检查项 | 工具 | 标准 |
|--------|------|------|
| WCAG合规 | axe-core/jest-axe | AA级 |
| 键盘导航 | Playwright keyboard API | Tab/Enter/Escape可操作 |
| 色彩对比度 | axe-core | ≥4.5:1正文/≥3:1大文本 |

**视觉回归测试**（内建能力）：
- 使用Playwright截图对比+Storybook Chromatic实现视觉回归检测
- 覆盖3个视口尺寸（375/768/1440）
- 输出：视觉回归测试报告+基线截图

### Step 3: 测试报告与覆盖率统计

汇总测试结果：
- 单元测试覆盖率统计
- E2E测试通过率
- 无障碍测试合规率
- 生成测试报告

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

**输出校验规则**（同质量检查项）：

| 字段路径 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| test_summary.unit_tests.total | integer | 是 | 单元测试总数 |
| test_summary.e2e_scenarios.total | integer | 是 | E2E场景总数 |
| test_summary.a11y_tests.standard | string | 是 | 无障碍标准，值为"WCAG 2.1 AA" |
| coverage.component_coverage | string | 是 | 组件覆盖率（≥80%） |
| files | array | 是 | 测试文件列表 |

## 上游变更响应

上游变更影响表：

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 组件代码变更 | 单元测试 | 标注受影响的测试用例，建议更新 |
| 页面代码变更 | E2E测试 | 标注受影响的E2E场景，建议更新 |
| UI审查结果变更 | 测试优先级 | 调整测试优先级，优先覆盖P0问题 |

下游通知机制表：

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 测试不通过 | ui-component-gen | 失败的测试用例 | 核心流程E2E测试失败 |
| 覆盖率下降 | ui-review | 覆盖率报告 | 组件覆盖率<80% |

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
| 目标语言≠en-US | E2E测试断言使用目标语言文案，Mock数据使用目标语言内容 |

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
| project_dir 缺失 | 测试文件仅输出到 output/ 目录 | 测试文件需手动复制到项目 |

## 数据获取说明

本Skill需要组件代码，请通过以下方式之一提供：
  1. 上传组件代码文件
  2. 提供代码仓库路径
  3. 描述组件功能和交互行为
