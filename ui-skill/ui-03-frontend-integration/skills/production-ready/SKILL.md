---
name: production-ready
description: 当需要将前端项目准备上线时使用。生产就绪一体化，集成构建配置、测试生成和性能优化，确保前端项目可部署、可测试、高性能。关键词：构建部署、性能优化、前端测试、生产就绪、上线准备、打包、优化。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "pipeline"
  version: "1.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "准备上线"
    - "优化前端性能"
    - "跑一下测试"
    - "构建部署"
  interaction_mode: "ai_auto"
---

# 生产就绪一体化

## 核心原则

1. **构建即验证**——构建过程同时验证代码质量和性能
2. **测试内建**——测试与代码同步生成，不是事后补充
3. **性能预算**——性能指标有明确阈值，超标自动拦截
4. **渐进优化**——先解决最大瓶颈，再逐步优化

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 前端代码 | code | 是 | output/ui-frontend/page-builder/ | 页面和组件代码 |
| API集成 | JSON | ○ | output/ui-frontend-integration/api-integration/ | API客户端代码 |
| 目标框架 | string | 是 | 上游编排器传递 | React/Vue/Svelte |
| 部署目标 | string | ○ | 用户提供 | Vercel/Netlify/自建/CDN |
| 目标语言 | string | ○ | 上游编排器传递（默认zh-CN） | 目标界面语言 |
| project_dir | string | 是 | 上游编排器传递 | 项目根目录绝对路径 |

## 执行步骤

### Step 1: 构建配置与优化

配置构建工具和优化策略：

| 配置项 | 内容 |
|--------|------|
| 构建工具 | Vite/Webpack/Next.js内置 |
| 代码分割 | 路由级+组件级懒加载 |
| 资源优化 | 图片压缩+字体子集化+SVG优化 |
| 缓存策略 | 内容hash+长期缓存+预加载 |
| 环境变量 | 开发/预发/生产环境配置 |

构建配置写入 {project_dir}/。

### Step 2: 测试生成

**测试金字塔**：单元测试(70%) > 集成测试(20%) > E2E测试(10%)

| 测试类型 | 覆盖内容 | 工具 | 占比 |
|----------|---------|------|------|
| 渲染测试 | 组件正常渲染、各变体渲染 | Jest+RTL | 30% |
| 交互测试 | 点击/输入/提交回调 | fireEvent/userEvent | 25% |
| 状态测试 | 状态转换、loading/error | Jest+RTL | 15% |
| 边界测试 | 空数据/超长文本/极端值 | Jest | 10% |
| Storybook Stories | 每个Variant一个Story | Storybook | 20% |

E2E测试：核心用户流程100%覆盖，使用Playwright/Cypress。

无障碍测试：WCAG 2.1 AA标准，使用axe-core/jest-axe。

视觉回归测试（内建能力）：Playwright截图对比+Storybook Chromatic，覆盖375/768/1440三个视口。

测试文件写入 {project_dir}/tests/。

### Step 3: 性能优化

建立性能基线：

| 指标 | 优秀 | 需优化 | 差 |
|------|------|--------|-----|
| LCP | ≤2.5s | 2.5-4s | >4s |
| FID | ≤100ms | 100-300ms | >300ms |
| CLS | ≤0.1 | 0.1-0.25 | >0.25 |
| 首屏JS | ≤200KB | 200-500KB | >500KB |
| 首屏CSS | ≤50KB | 50-100KB | >100KB |

包体积优化：代码分割+Tree Shaking+按需引入+图片优化+字体子集化。

加载速度优化：关键CSS内联+资源预加载+图片懒加载。

渲染性能优化：虚拟列表+React.memo/useMemo+防抖节流。

**外部 Skill 调用**：

#### ext-impeccable optimize

**触发条件**：LCP>2.5s 且瓶颈为UI渲染
**反模式**：性能瓶颈为网络延迟或包体积 → 跳过

```
Skill: ext-impeccable
输入:
  子命令: optimize
  目标: 性能瓶颈组件/页面代码
  上下文: 性能分析报告 + project_dir代码
输出: UI渲染优化方案
验证: LCP降至2.5s以下且视觉表现不降级
模式: 🤖
```

### Step 4: 性能预算与CI配置

建立性能预算和CI拦截：

| 预算项 | 阈值 | 拦截级别 |
|--------|------|---------|
| 首屏JS | ≤200KB | 超标阻塞合并 |
| 首屏CSS | ≤50KB | 超标阻塞合并 |
| LCP | ≤2.5s | 超标阻塞发布 |
| CLS | ≤0.1 | 超标警告 |
| 单chunk大小 | ≤300KB | 超标警告 |

CI配置写入 {project_dir}/。

## 输出

**代码文件输出**：{project_dir}/（构建配置、测试文件、CI配置、性能预算）

**元数据输出**：output/ui-frontend-integration/production-ready/

**输出文件**：production-ready.json

**输出Schema**：

```json
{
  "type": "object",
  "required": ["build_config", "test_report", "performance_report", "performance_budget", "project_dir"],
  "properties": {
    "build_config": {"type": "object", "description": "构建配置信息"},
    "test_report": {"type": "object", "description": "测试报告，含覆盖率/通过率/E2E结果"},
    "performance_report": {"type": "object", "description": "性能报告，含基线/瓶颈/优化方案"},
    "performance_budget": {"type": "object", "description": "性能预算阈值"},
    "project_dir": {"type": "string", "description": "项目根目录路径"}
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| LCP>4s | P0，必须优化后才能发布 |
| 首屏JS>500KB | P0，强制代码分割 |
| CLS>0.25 | P0，布局偏移必须修复 |
| 组件覆盖率<80% | 补充缺失测试用例 |
| 核心流程E2E失败 | P0，阻塞发布 |
| 无障碍测试不通过 | P0，阻塞发布 |
| 目标语言≠en-US | E2E断言使用目标语言文案，Mock数据使用目标语言 |

## 质量检查

- [ ] 构建成功，无TypeScript错误
- [ ] 组件单元测试覆盖率≥80%
- [ ] 核心用户流程100%有E2E测试
- [ ] 无障碍测试覆盖WCAG 2.1 AA
- [ ] LCP≤2.5s
- [ ] CLS≤0.1
- [ ] 首屏JS≤200KB
- [ ] 性能预算写入CI配置

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| API集成缺失 | 跳过API相关测试 | 缺少API集成测试 |
| 部署目标缺失 | 输出通用构建配置 | 部署配置需手动调整 |
| project_dir 缺失 | 仅输出到 output/ 目录 | 配置文件需手动复制 |

## 变更记录

- v1.0: 合并 frontend-build-deploy + frontend-performance + frontend-test；构建+测试+性能一体化
