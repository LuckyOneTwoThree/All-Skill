---
name: production-ready
description: 当需要将前端项目准备上线时使用。生产就绪一体化，集成构建配置、测试生成和性能优化，确保前端项目可部署、可测试、高性能。关键词：构建部署、性能优化、前端测试、生产就绪、上线准备、打包、优化。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "pipeline"
  version: "1.3"
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
| 前端代码 | code | 是 | {project_dir}/src/ | 页面和组件代码（代码在项目src目录，元数据在output路径） |
| API集成 | JSON | ○ | output/ui-frontend-integration/api-integration/ | API集成元数据（代码在{project_dir}/src/api/） |
| quality_debt | JSON | ○ | output/ui-frontend/page-builder/quality_debt.json | page-builder 阶段降级的质量债务清单 |
| 目标框架 | string | 是 | 上游编排器传递 | React/Vue/Svelte |
| 部署目标 | string | ○ | 用户提供 | Vercel/Netlify/自建/CDN |
| 目标语言 | string | ○ | 上游编排器传递（默认zh-CN） | 目标界面语言 |
| project_dir | string | 是 | 上游编排器传递 | 项目根目录绝对路径 |

## 执行步骤

**quality_debt 消费规则**：若 quality_debt.json 存在，在 Step 1 前优先处理 critical 级债务（必须修复），major 级债务纳入测试重点覆盖范围。

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

| 测试类型 | 覆盖内容 | 工具（React） | 工具（Vue） | 工具（Svelte） | 占比 |
|----------|---------|-------------|-----------|--------------|------|
| 渲染测试 | 组件正常渲染、各变体渲染 | Jest+RTL | Vitest+Vue Test Utils | Vitest+Svelte Testing Library | 30% |
| 交互测试 | 点击/输入/提交回调 | fireEvent/userEvent | fireEvent/userEvent | fireEvent/userEvent | 25% |
| 状态测试 | 状态转换、loading/error | Jest+RTL | Vitest+Vue Test Utils | Vitest+Svelte Testing Library | 15% |
| 边界测试 | 空数据/超长文本/极端值 | Jest | Vitest | Vitest | 10% |
| Storybook Stories | 每个Variant一个Story | Storybook | Storybook | Storybook | 20% |

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

> ext 增强结果已通过上游 design_brief.json 消费，本步骤专注核心逻辑

### Step 3b: 安全审计

**安全检查清单**：

| 检查项 | 实现方式 | 阻断级别 |
|--------|---------|---------|
| CSP配置 | 生成Content-Security-Policy头，限制script-src/style-src/img-src | P0 |
| XSS防护 | 确保所有用户输入经过转义，React默认转义+DOMPurify | P0 |
| CSRF防护 | SameSite Cookie + CSRF Token（若使用Cookie认证） | P1 |
| SRI | 外部CDN资源添加integrity属性 | P1 |
| 敏感信息泄露 | 检查代码中无硬编码密钥/token/密码 | P0 |
| 依赖漏洞 | npm audit / pnpm audit，高危漏洞必须修复 | P0 |
| HTTPS强制 | 生产环境强制HTTPS，HSTS头配置 | P0 |

P0级别不通过则阻断输出。

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
    "build_config": {
      "type": "object",
      "description": "构建配置信息",
      "properties": {
        "bundler": {"type": "string", "description": "构建工具（Vite/Webpack/Next.js）"},
        "code_splitting": {"type": "boolean", "description": "是否启用代码分割"},
        "chunk_count": {"type": "number", "description": "代码分割chunk数量"},
        "env_configs": {"type": "array", "description": "环境配置列表（dev/staging/prod）"}
      }
    },
    "test_report": {
      "type": "object",
      "description": "测试报告",
      "properties": {
        "unit_coverage": {"type": "number", "description": "单元测试覆盖率(%)"},
        "integration_coverage": {"type": "number", "description": "集成测试覆盖率(%)"},
        "e2e_pass_rate": {"type": "number", "description": "E2E测试通过率(%)"},
        "a11y_pass": {"type": "boolean", "description": "无障碍测试是否通过"},
        "total_tests": {"type": "number", "description": "测试用例总数"},
        "failed_tests": {"type": "number", "description": "失败用例数"}
      }
    },
    "performance_report": {
      "type": "object",
      "description": "性能报告",
      "properties": {
        "lcp": {"type": "number", "description": "LCP时间(s)"},
        "fid": {"type": "number", "description": "FID时间(ms)"},
        "cls": {"type": "number", "description": "CLS分数"},
        "first_screen_js_kb": {"type": "number", "description": "首屏JS体积(KB)"},
        "first_screen_css_kb": {"type": "number", "description": "首屏CSS体积(KB)"},
        "bottlenecks": {"type": "array", "description": "性能瓶颈列表"}
      }
    },
    "performance_budget": {
      "type": "object",
      "description": "性能预算阈值",
      "properties": {
        "max_lcp": {"type": "number", "description": "LCP阈值(s)"},
        "max_cls": {"type": "number", "description": "CLS阈值"},
        "max_first_screen_js_kb": {"type": "number", "description": "首屏JS阈值(KB)"},
        "max_first_screen_css_kb": {"type": "number", "description": "首屏CSS阈值(KB)"},
        "ci_blocking": {"type": "boolean", "description": "CI是否阻断超标"}
      }
    },
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

P0（必须通过，不通过则阻断输出）：
- [ ] 构建成功，无TypeScript错误
- [ ] 无硬编码密钥/token/密码
- [ ] npm audit无高危漏洞
- [ ] LCP≤2.5s
- [ ] CLS≤0.1
- [ ] 核心用户流程100%有E2E测试
- [ ] 无障碍测试覆盖WCAG 2.1 AA
- [ ] XSS防护已配置（React默认转义+DOMPurify）

P1（建议通过，不通过则标注"待修复"）：
- [ ] 组件单元测试覆盖率≥80%
- [ ] 首屏JS≤200KB
- [ ] 性能预算写入CI配置
- [ ] CSP配置已生成
- [ ] CSRF防护已配置（Cookie认证时）
- [ ] SRI已配置（外部CDN资源）
- [ ] HTTPS强制+HSTS头已配置

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| API集成缺失 | 跳过API相关测试 | 缺少API集成测试 |
| quality_debt缺失 | 跳过债务处理，直接执行构建和测试 | critical级债务可能未修复，生产质量风险 |
| 部署目标缺失 | 输出通用构建配置 | 部署配置需手动调整 |
| project_dir 缺失 | 仅输出到 output/ 目录 | 配置文件需手动复制 |

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 前端代码变更（组件增删/页面结构变更/路由变更） | 测试用例、构建配置、代码分割策略 | 标注受影响的测试文件和构建chunk，建议重新生成对应测试并验证构建 |
| API集成变更（端点增删/类型定义变更/请求层选型变更） | API相关测试、Mock数据、依赖配置 | 标注受影响的API测试和依赖，建议更新测试Mock和构建配置 |
| quality_debt变更 | Step 1 债务处理计划 | 标注新增/升级的critical级债务，优先修复后再执行构建和测试 |
| 目标框架变更 | 构建工具、测试框架、依赖配置 | 标注需替换的构建和测试方案，建议重新生成构建配置和测试 |
| 部署目标变更 | CI/CD配置、环境变量、缓存策略 | 标注需调整的部署配置，建议重新生成CI配置 |

### 向上游反馈机制表

| 本Skill发现问题 | 反馈上游Skill | 反馈内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 组件渲染性能问题 | page-builder | 组件需优化（如缺少memo/虚拟列表） | 单组件渲染>16ms或列表>100项未虚拟化 |
| 构建产物体积超标 | page-builder | 组件需拆分或懒加载 | 单chunk>300KB |
| TypeScript类型错误 | page-builder / api-integration | 类型定义缺失或不一致 | 构建失败且原因为类型错误 |
| 无障碍测试不通过 | page-builder | 组件缺少ARIA属性或键盘导航 | axe-core检测到WCAG AA违规 |

## 变更记录

- v1.3: 修复输入路径混淆（代码路径vs元数据路径）；输出Schema细化；新增安全审计步骤；质量检查增加安全项
- v1.2: ext-impeccable调用增加Setup前置检查（确保单独调用production-ready时也能正常工作）
- v1.1: 补充上游变更响应和向上游反馈机制；ext-impeccable Setup统一引用
- v1.0: 合并 frontend-build-deploy + frontend-performance + frontend-test；构建+测试+性能一体化
