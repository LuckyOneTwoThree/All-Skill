---
name: production-ready
description: 当需要将前端项目准备上线时使用。生产就绪一体化，集成构建配置、测试生成和性能优化，确保前端项目可部署、可测试、高性能。关键词：构建部署、性能优化、前端测试、生产就绪、上线准备、打包、优化。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "准备上线"
    - "优化前端性能"
    - "跑一下测试"
    - "构建部署"
  interaction_mode: "ai_auto"
---

# 生产就绪一体化

## Engineering Delivery Boundary

Follow [Engineering Boundary Protocol](../../../templates/engineering-boundary-protocol.md).

1. Project first: inspect existing framework, router, state management, component library, styling, API client, and test stack before writing code; inherit by default.
2. Design-system first: existing design system, component library, and brand rules override visual_policy unless the user explicitly asks to change them.
3. Write scope: declare target directories and files before implementation; do not overwrite unrelated user code.
4. Responsive acceptance: check desktop/mobile layout, text overflow, cramped controls, nested cards, accessibility basics, and design-token consistency.
5. Verification record: report created/modified files, checks run, checks that could not run, and residual risks.

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

**1a. Vite 构建配置模板**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip', threshold: 10240 }),
    mode === 'analyze' && visualizer({ open: true, gzipSize: true, brotliSize: true }),
  ].filter(Boolean),
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: mode === 'production' ? 'hidden' : true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@/components/ui'],
          utils: ['lodash-es', 'dayjs', 'axios'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: mode === 'production', drop_debugger: true },
    },
    chunkSizeWarningLimit: 300,
  },
  resolve: {
    alias: { '@': '/src' },
  },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3000', changeOrigin: true },
    },
  },
}))
```

**1b. Webpack 构建配置模板（按需）**

当项目已有Webpack配置或Vite不适用时使用：

```javascript
const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = (env, argv) => ({
  mode: argv.mode || 'production',
  entry: { main: './src/main.tsx' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'assets/js/[name].[contenthash:8].js',
    chunkFilename: 'assets/js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[ext]/[name].[contenthash:8][ext]',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()],
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendor', priority: 10 },
        ui: { test: /[\\/]src[\\/]components[\\/]ui[\\/]/, name: 'ui', priority: 20 },
        common: { minChunks: 2, name: 'common', priority: 5, reuseExistingChunk: true },
      },
    },
    runtimeChunk: 'single',
  },
  module: {
    rules: [
      { test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/ },
      { test: /\.css$/, use: ['style-loader', 'css-loader', 'postcss-loader'] },
      { test: /\.(png|jpe?g|gif|webp|svg)$/, type: 'asset', parser: { dataUrlCondition: { maxSize: 8192 } } },
      { test: /\.(woff2?|eot|ttf|otf)$/, type: 'asset/resource' },
    ],
  },
  plugins: [
    argv.analyze && new BundleAnalyzerPlugin({ analyzerMode: 'server', openAnalyzer: true }),
  ].filter(Boolean),
  performance: {
    maxEntrypointSize: 300000,
    maxAssetSize: 250000,
    hints: argv.mode === 'production' ? 'warning' : false,
  },
})
```

**1c. 环境变量配置模板**

```.env
VITE_APP_TITLE=应用名称
VITE_API_BASE_URL=/api
VITE_API_MOCK=false
```

```.env.development
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_MOCK=true
VITE_ENABLE_DEVTOOLS=true
```

```.env.staging
VITE_API_BASE_URL=https://staging-api.example.com/api
VITE_API_MOCK=false
VITE_ENABLE_DEVTOOLS=true
```

```.env.production
VITE_API_BASE_URL=https://api.example.com/api
VITE_API_MOCK=false
VITE_ENABLE_DEVTOOLS=false
```

环境变量使用规范：
- 所有变量以 `VITE_` 前缀开头（Vite）/ `REACT_APP_` 前缀开头（CRA）
- 禁止在环境变量中存储密钥/Token，敏感配置通过运行时注入
- 通过 `import.meta.env.VITE_XXX` 访问（Vite）/ `process.env.REACT_APP_XXX` 访问（CRA）
- 在 `src/env.d.ts` 中声明类型，确保类型安全

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

**2a. 组件测试模板（React Testing Library）**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { {{ComponentName}} } from './{{ComponentName}}'

describe('{{ComponentName}}', () => {
  const defaultProps = {
    // 默认props
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正常渲染', () => {
    render(<{{ComponentName}} {...defaultProps} />)
    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('各变体渲染', () => {
    const variants = ['default', 'primary', 'danger'] as const
    variants.forEach((variant) => {
      const { unmount } = render(<{{ComponentName}} {...defaultProps} variant={variant} />)
      expect(screen.getByRole('region')).toBeInTheDocument()
      unmount()
    })
  })

  it('交互回调触发', async () => {
    const onClick = vi.fn()
    render(<{{ComponentName}} {...defaultProps} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('loading状态显示', () => {
    render(<{{ComponentName}} {...defaultProps} loading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('error状态显示', () => {
    render(<{{ComponentName}} {...defaultProps} error="加载失败" />)
    expect(screen.getByText('加载失败')).toBeInTheDocument()
  })

  it('空数据边界', () => {
    render(<{{ComponentName}} {...defaultProps} data={[]} />)
    expect(screen.getByText(/暂无数据/)).toBeInTheDocument()
  })

  it('超长文本不溢出', () => {
    const longText = '很长的文本'.repeat(100)
    render(<{{ComponentName}} {...defaultProps} text={longText} />)
    const element = screen.getByText(longText)
    expect(element).toHaveStyle({ overflow: 'hidden', textOverflow: 'ellipsis' })
  })

  it('无障碍检查', async () => {
    const { container } = render(<{{ComponentName}} {...defaultProps} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

**2b. 组件测试模板（Vue Test Utils）**

```typescript
import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {{ComponentName}} from './{{ComponentName}}.vue'

describe('{{ComponentName}}', () => {
  const defaultProps = {
    // 默认props
  }

  const createWrapper = (props = {}) =>
    mount({{ComponentName}}, { props: { ...defaultProps, ...props } })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正常渲染', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="component-root"]').exists()).toBe(true)
  })

  it('各变体渲染', () => {
    const variants = ['default', 'primary', 'danger'] as const
    variants.forEach((variant) => {
      const wrapper = createWrapper({ variant })
      expect(wrapper.find('[data-testid="component-root"]').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  it('交互回调触发', async () => {
    const onClick = vi.fn()
    const wrapper = createWrapper({ onClick })
    await wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('loading状态显示', () => {
    const wrapper = createWrapper({ loading: true })
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })

  it('error状态显示', () => {
    const wrapper = createWrapper({ error: '加载失败' })
    expect(wrapper.text()).toContain('加载失败')
  })

  it('空数据边界', () => {
    const wrapper = createWrapper({ data: [] })
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('无障碍检查', async () => {
    const wrapper = createWrapper()
    const results = await axe(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
```

**2c. API 集成测试模板**

```typescript
import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import { {{endpointName}} } from '@/api/{{module}}'

const mockHandlers = [
  http.get('/api/{{module}}/{{resource}}', () => {
    return HttpResponse.json({
      code: 0,
      data: { /* mock response */ },
      message: 'success',
    })
  }),
  http.post('/api/{{module}}/{{resource}}', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({
      code: 0,
      data: { id: 'mock-id', ...body },
      message: 'success',
    }, { status: 201 })
  }),
  http.get('/api/{{module}}/{{resource}}/:id', ({ params }) => {
    return HttpResponse.json({
      code: 0,
      data: { id: params.id, name: 'mock-name' },
      message: 'success',
    })
  }),
]

const errorHandlers = [
  http.get('/api/{{module}}/{{resource}}', () => {
    return HttpResponse.json({ code: 500, message: '服务异常' }, { status: 500 })
  }),
]

const server = setupServer(...mockHandlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('{{endpointName}} API', () => {
  it('正常请求返回数据', async () => {
    const result = await {{endpointName}}({ /* params */ })
    expect(result.code).toBe(0)
    expect(result.data).toBeDefined()
  })

  it('请求参数类型正确', async () => {
    const result = await {{endpointName}}({ /* params */ })
    expect(typeof result.data.id).toBe('string')
  })

  it('服务端错误触发错误处理', async () => {
    server.use(...errorHandlers)
    await expect({{endpointName}}({ /* params */ })).rejects.toThrow()
  })

  it('网络超时触发重试', async () => {
    server.use(
      http.get('/api/{{module}}/{{resource}}', async () => {
        await new Promise((resolve) => setTimeout(resolve, 15000))
        return HttpResponse.json({ code: 0, data: {} })
      })
    )
    await expect({{endpointName}}({ /* params */ }, { timeout: 1000 })).rejects.toThrow()
  })

  it('401未授权触发认证刷新', async () => {
    server.use(
      http.get('/api/{{module}}/{{resource}}', () => {
        return HttpResponse.json({ code: 401, message: '未授权' }, { status: 401 })
      })
    )
    await expect({{endpointName}}({ /* params */ })).rejects.toThrow()
  })
})
```

**2d. E2E 测试配置模板（Playwright）**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['github']],
  use: {
    baseURL: process.env.E2E_BASE_URL || 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'tablet', use: { ...devices['iPad Pro'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
```

E2E 核心流程测试模板：

```typescript
import { test, expect } from '@playwright/test'

test.describe('核心用户流程', () => {
  test('用户登录流程', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="username"]', 'testuser')
    await page.fill('[data-testid="password"]', 'testpass')
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible()
  })

  test('列表浏览流程', async ({ page }) => {
    await page.goto('/items')
    await expect(page.locator('[data-testid="item-list"]')).toBeVisible()
    await page.click('[data-testid="item-card"]:first-child')
    await expect(page).toHaveURL(/\/items\/\d+/)
    await expect(page.locator('[data-testid="item-detail"]')).toBeVisible()
  })

  test('表单提交流程', async ({ page }) => {
    await page.goto('/items/new')
    await page.fill('[data-testid="input-name"]', '测试项目')
    await page.click('[data-testid="submit-button"]')
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })
})
```

测试文件写入 {project_dir}/tests/。

### Step 3: 性能优化

建立性能基线：

| 指标 | 优秀 | 需优化 | 差 |
|------|------|--------|-----|
| LCP | ≤2.5s | 2.5-4s | >4s |
| FCP | ≤1.8s | 1.8-3s | >3s |
| FID | ≤100ms | 100-300ms | >300ms |
| CLS | ≤0.1 | 0.1-0.25 | >0.25 |
| 首屏JS | ≤200KB | 200-500KB | >500KB |
| 首屏CSS | ≤50KB | 50-100KB | >100KB |

**3a. 性能优化检查清单**

| 优化维度 | 具体措施 | 影响指标 | 优先级 |
|----------|---------|---------|--------|
| **LCP优化** | 关键资源预加载 `<link rel="preload">` | LCP | P0 |
| **LCP优化** | 首屏图片使用 `<img loading="eager">` + fetchpriority="high" | LCP | P0 |
| **LCP优化** | 关键CSS内联到 `<head>`，避免渲染阻塞 | LCP/FCP | P0 |
| **LCP优化** | 服务端渲染(SSR)或静态生成(SSG)首屏内容 | LCP/FCP | P1 |
| **LCP优化** | 使用 `font-display: swap` 避免字体加载阻塞文字渲染 | LCP/CLS | P1 |
| **FCP优化** | 内联关键CSS，异步加载非关键CSS | FCP | P0 |
| **FCP优化** | 减少首屏JS体积（代码分割+Tree Shaking） | FCP | P0 |
| **FCP优化** | 预连接关键域名 `<link rel="preconnect">` | FCP | P1 |
| **CLS优化** | 图片/视频设置明确 `width` 和 `height` 属性 | CLS | P0 |
| **CLS优化** | 动态内容预留占位空间（skeleton/placeholder） | CLS | P0 |
| **CLS优化** | 字体使用 `size-adjust` + `ascent-override` 避免布局偏移 | CLS | P1 |
| **CLS优化** | 避免在视口上方动态插入内容 | CLS | P1 |

**3b. 包大小分析与优化**

| 优化手段 | 实现方式 | 预期收益 |
|----------|---------|---------|
| 代码分割 | 路由级 `React.lazy`/`defineAsyncComponent` + 动态 `import()` | 首屏JS减少40-60% |
| Tree Shaking | 确保ESM导入、`package.json` 配置 `sideEffects:false` | 无用代码消除10-30% |
| 按需引入 | 组件库按需导入（如 `import { Button } from 'antd'`） | 单库减少50-80% |
| 包分析 | `rollup-plugin-visualizer` / `webpack-bundle-analyzer` 生成可视化报告 | 定位大包依赖 |
| 依赖替代 | moment→dayjs、lodash→lodash-es、原生替代库 | 单项减少50-200KB |
| 重复依赖 | `npm dedupe` / `pnpm` 自动去重 | 减少5-15% |
| 外部化CDN | React/Vue等大型框架通过CDN引入+externals配置 | 减少构建体积 |

**3c. 图片/字体优化**

| 优化类型 | 具体措施 | 工具/配置 |
|----------|---------|----------|
| 图片格式 | 优先使用WebP/AVIF，`<picture>` 标签降级 | vite-plugin-webp / sharp |
| 图片尺寸 | 响应式图片 `srcset` + `sizes`，按设备提供合适尺寸 | 手动配置 |
| 图片懒加载 | 非首屏图片 `loading="lazy"` + `decoding="async"` | 原生属性 |
| 图片占位 | LQIP(低质量占位) 或 SVG占位，避免布局偏移 | vite-plugin-lqip |
| SVG优化 | 清除元数据、合并路径、压缩 | svgo / vite-plugin-svgo |
| 字体子集化 | 仅包含使用到的字符，中文字体按需分片加载 | fontmin / subset-font |
| 字体预加载 | 关键字体 `<link rel="preload" as="font" crossorigin>` | HTML配置 |
| 字体显示 | `font-display: swap` 或 `optional` | CSS @font-face |
| 图标方案 | 小图标使用SVG sprite或图标字体，避免多图请求 | vite-plugin-svg-icons |

**3d. 缓存策略**

| 资源类型 | 缓存策略 | Cache-Control 配置 | 说明 |
|----------|---------|-------------------|------|
| HTML入口 | 协商缓存 | `no-cache` | 每次验证，确保更新及时 |
| JS/CSS（带hash） | 强缓存 | `public, max-age=31536000, immutable` | 内容hash变化即新文件，可长期缓存 |
| 图片/字体（带hash） | 强缓存 | `public, max-age=31536000, immutable` | 同上 |
| API响应 | 短期缓存 | `private, max-age=60, must-revalidate` | 根据业务调整 |
| Service Worker | 离线优先 | Workbox策略 | 静态资源CacheFirst，API NetworkFirst |

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
        "env_configs": {"type": "array", "description": "环境配置列表（dev/staging/prod）"},
        "compression": {"type": "string", "description": "压缩算法（gzip/brotli）"},
        "cdn_externals": {"type": "array", "description": "CDN外部化依赖列表"}
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
        "failed_tests": {"type": "number", "description": "失败用例数"},
        "visual_regression_pass": {"type": "boolean", "description": "视觉回归测试是否通过"}
      }
    },
    "performance_report": {
      "type": "object",
      "description": "性能报告",
      "properties": {
        "lcp": {"type": "number", "description": "LCP时间(s)"},
        "fcp": {"type": "number", "description": "FCP时间(s)"},
        "fid": {"type": "number", "description": "FID时间(ms)"},
        "cls": {"type": "number", "description": "CLS分数"},
        "first_screen_js_kb": {"type": "number", "description": "首屏JS体积(KB)"},
        "first_screen_css_kb": {"type": "number", "description": "首屏CSS体积(KB)"},
        "bottlenecks": {"type": "array", "description": "性能瓶颈列表"},
        "optimization_applied": {"type": "array", "description": "已应用的优化措施列表"}
      }
    },
    "performance_budget": {
      "type": "object",
      "description": "性能预算阈值",
      "properties": {
        "max_lcp": {"type": "number", "description": "LCP阈值(s)"},
        "max_fcp": {"type": "number", "description": "FCP阈值(s)"},
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
| 目标框架=React | 使用Jest/Vitest + React Testing Library |
| 目标框架=Vue | 使用Vitest + Vue Test Utils |
| 目标框架=Svelte | 使用Vitest + Svelte Testing Library |
| 部署目标=Vercel/Netlify | 生成对应平台配置文件（vercel.json/netlify.toml） |
| 部署目标=CDN | 生成CDN externals配置 + SRI hash |
| 单chunk>300KB | 拆分为更小chunk或懒加载 |

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
- [ ] 图片/字体优化已执行
- [ ] 缓存策略已配置（至少3种资源类型）
- [ ] 视觉回归测试已配置

### 真实运行验证策略

定义在 Claude/Trae 环境中可执行的验证命令清单，替代纯文本化验收规则。

**项目内命令发现策略**：
1. 读取 package.json 的 scripts 字段，识别可用的构建/测试/lint 命令
2. 优先执行已有命令，而非假设命令存在

**验证命令清单**：

| 验证维度 | 发现策略 | 执行命令 | 通过标准 | 失败处理 |
|---------|---------|---------|---------|---------|
| 构建检查 | package.json scripts.build | npm run build / pnpm build | 零错误退出 | 标注构建错误，阻断输出 |
| 类型检查 | package.json scripts.typecheck 或 tsconfig.json | npx tsc --noEmit | 零类型错误 | 标注类型错误，建议修复 |
| Lint检查 | package.json scripts.lint 或 .eslintrc | npm run lint | 零error（warning允许） | 标注lint错误 |
| 单元测试 | package.json scripts.test | npm run test -- --coverage | 覆盖率≥80% | 标注未覆盖模块 |
| 构建产物检查 | 构建后检查 dist/ 目录 | ls dist/ 或检查输出目录 | 产物存在且非空 | 标注构建产物缺失 |
| 响应式检查 | 浏览器 DevTools 或手动 | 检查 viewport meta + CSS media queries | 3个断点覆盖 | 标注缺失断点 |
| 文本溢出检查 | 代码审查 | 检查 text-overflow/truncation 使用 | 关键文本有溢出处理 | 标注溢出风险 |
| a11y检查 | package.json scripts.a11y 或 axe-core | npx axe-core 或 npm run a11y | WCAG AA 合规 | 标注不合规项 |

**验证执行顺序**：构建检查 → 类型检查 → Lint检查 → 单元测试 → 构建产物检查 → 响应式/a11y检查

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| API集成缺失 | 跳过API相关测试，不生成API集成测试模板 | 缺少API集成测试，Mock数据需手动补充 |
| quality_debt缺失 | 跳过债务处理，直接执行构建和测试 | critical级债务可能未修复，生产质量风险 |
| 部署目标缺失 | 输出通用构建配置，不生成平台专属配置 | 部署配置需手动调整，缺少vercel.json/netlify.toml |
| 目标语言缺失 | 默认zh-CN，测试断言和Mock数据使用中文 | 非中文项目需手动调整文案和断言 |
| project_dir缺失 | 仅输出到output/目录 | 配置文件需手动复制到项目目录 |

## 与 Stage-6 数据衔接

### 输入消费

production-ready 作为 stage-6 的核心执行技能（步骤6.1），消费以下上游数据：

| 数据来源 | 消费方式 | 衔接路径 |
|----------|---------|---------|
| stage-4 增强代码 | 作为构建和测试的代码输入 | `{project_dir}/src/` + `output/ui-frontend/page-builder/` |
| stage-5 API集成（可选） | 消费API集成元数据，生成API相关测试 | `output/ui-frontend-integration/api-integration/api-integration.json` |
| quality_debt（可选） | 优先处理critical级债务 | `output/ui-frontend/page-builder/quality_debt.json` |

**stage-5 跳过场景**：当无后端API时，stage-5不执行，production-ready 直接消费 stage-4 的增强代码，跳过API集成测试生成。

### 输出传递

production-ready 执行完成后，输出传递给 stage-6 后续步骤：

| 后续步骤 | 消费内容 | 传递方式 |
|----------|---------|---------|
| 6.2 ext-impeccable {harden\|polish} | 代码 + 构建配置 | 直接读取 {project_dir}/ 中的构建配置和源代码 |
| 6.3 ext-impeccable optimize | 性能报告 | 读取 `output/ui-frontend-integration/production-ready/production-ready.json` 中的 performance_report |

### 人工门禁

stage-6 在 production-ready 执行后设有 `[GATE] 发布决策需要人工确认`，production-ready 的 P0 质量检查结果作为门禁决策依据：
- P0 全部通过 → 建议通过门禁
- P0 存在不通过项 → 阻断门禁，必须修复后重新执行

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
| API类型不匹配 | api-integration | 请求/响应类型与实际不一致 | API集成测试类型断言失败 |
