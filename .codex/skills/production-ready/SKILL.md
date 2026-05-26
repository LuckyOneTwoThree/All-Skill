---
name: production-ready
description: "Use when preparing a frontend project for production launch. Integrated production readiness with build configuration, test generation, and performance optimization ensuring deployable, testable, high-performance frontend projects. Keywords: build deployment, performance optimization, frontend testing, production ready, launch preparation, bundling, optimization."
metadata:
  module: "UI Design & Frontend Development"
  sub-module: "Frontend Integration"
  type: "pipeline"
  version: "2.0"
  domain_tags: ["Internet", "General"]
  trigger_examples:
    - "Prepare for launch"
    - "Optimize frontend performance"
    - "Run tests"
    - "Build and deploy"
  interaction_mode: "ai_auto"
execution_depth:
  default: standard
  quick_description: "Output deployment readiness checklist and critical issues"
  deep_description: "Full deployment + real runtime validation + performance benchmarking + operational readiness assessment"
---

# Production Ready Integration

## Engineering Delivery Boundary

Follow [Engineering Boundary Protocol](../../../codex-templates/engineering-boundary-protocol.md).

1. Project first: inspect existing framework, router, state management, component library, styling, API client, and test stack before writing code; inherit by default.
2. Design-system first: existing design system, component library, and brand rules override visual_policy unless the user explicitly asks to change them.
3. Write scope: declare target directories and files before implementation; do not overwrite unrelated user code.
4. Responsive acceptance: check desktop/mobile layout, text overflow, cramped controls, nested cards, accessibility basics, and design-token consistency.
5. Verification record: report created/modified files, checks run, checks that could not run, and residual risks.

## Core Principles

1. **Build as Validation** -- Build process simultaneously validates code quality and performance
2. **Built-in Testing** -- Tests generated alongside code, not added afterward
3. **Performance Budget** -- Performance metrics have clear thresholds, exceeding auto-blocks
4. **Progressive Optimization** -- Solve biggest bottlenecks first, then optimize incrementally

## Interaction Mode

AI auto-executes

## Input

| Input Item | Type | Required | Source | Description |
|--------|------|------|------|------|
| Frontend Code | code | Yes | {project_dir}/src/ | Page and component code (code in project src directory, metadata in output path) |
| API Integration | JSON | O | output/ui-frontend-integration/api-integration/ | API integration metadata (code in {project_dir}/src/api/) |
| quality_debt | JSON | O | output/ui-frontend/page-builder/quality_debt.json | Quality debt list downgraded during page-builder stage |
| Target Framework | string | Yes | Passed from upstream orchestrator | React/Vue/Svelte |
| Deployment Target | string | O | User provided | Vercel/Netlify/Self-hosted/CDN |
| Target Language | string | O | Passed from upstream orchestrator (default zh-CN) | Target interface language |
| project_dir | string | Yes | Passed from upstream orchestrator | Project root directory absolute path |

## Execution Steps

**quality_debt Consumption Rules**: If quality_debt.json exists, prioritize handling critical-level debt before Step 1 (must fix), major-level debt included in test priority coverage.

### Step 1: Build Configuration and Optimization [Deep]

Configure build tools and optimization strategies:

| Configuration Item | Content |
|--------|------|
| Build Tool | Vite/Webpack/Next.js built-in |
| Code Splitting | Route-level + component-level lazy loading |
| Asset Optimization | Image compression + font subsetting + SVG optimization |
| Cache Strategy | Content hash + long-term caching + preloading |
| Environment Variables | Dev/staging/production environment configuration |

**1a. Vite Build Configuration Template**

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

**1b. Webpack Build Configuration Template (On-Demand)**

Use when the project already has Webpack configuration or Vite is not applicable:

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

**1c. Environment Variable Configuration Template**

```.env
VITE_APP_TITLE=App Name
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

Environment variable usage conventions:
- All variables prefixed with `VITE_` (Vite) / `REACT_APP_` (CRA)
- Never store secrets/tokens in environment variables; sensitive configuration injected at runtime
- Access via `import.meta.env.VITE_XXX` (Vite) / `process.env.REACT_APP_XXX` (CRA)
- Declare types in `src/env.d.ts` to ensure type safety

Build configuration written to {project_dir}/.

### Step 2: Test Generation [Core]

**Test Pyramid**: Unit tests (70%) > Integration tests (20%) > E2E tests (10%)

| Test Type | Coverage Content | Tool (React) | Tool (Vue) | Tool (Svelte) | Ratio |
|----------|---------|-------------|-----------|--------------|------|
| Render Tests | Component renders normally, each variant renders | Jest+RTL | Vitest+Vue Test Utils | Vitest+Svelte Testing Library | 30% |
| Interaction Tests | Click/input/submit callbacks | fireEvent/userEvent | fireEvent/userEvent | fireEvent/userEvent | 25% |
| State Tests | State transitions, loading/error | Jest+RTL | Vitest+Vue Test Utils | Vitest+Svelte Testing Library | 15% |
| Boundary Tests | Empty data/long text/extreme values | Jest | Vitest | Vitest | 10% |
| Storybook Stories | One Story per Variant | Storybook | Storybook | Storybook | 20% |

E2E tests: Core user flows 100% covered, using Playwright/Cypress.

Accessibility tests: WCAG 2.1 AA standard, using axe-core/jest-axe.

Visual regression tests (built-in capability): Playwright screenshot comparison + Storybook Chromatic, covering 375/768/1440 three viewports.

**2a. Component Test Template (React Testing Library)**

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { {{ComponentName}} } from './{{ComponentName}}'

describe('{{ComponentName}}', () => {
  const defaultProps = {
    // default props
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders normally', () => {
    render(<{{ComponentName}} {...defaultProps} />)
    expect(screen.getByRole('region')).toBeInTheDocument()
  })

  it('renders each variant', () => {
    const variants = ['default', 'primary', 'danger'] as const
    variants.forEach((variant) => {
      const { unmount } = render(<{{ComponentName}} {...defaultProps} variant={variant} />)
      expect(screen.getByRole('region')).toBeInTheDocument()
      unmount()
    })
  })

  it('triggers interaction callback', async () => {
    const onClick = vi.fn()
    render(<{{ComponentName}} {...defaultProps} onClick={onClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('displays loading state', () => {
    render(<{{ComponentName}} {...defaultProps} loading={true} />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('displays error state', () => {
    render(<{{ComponentName}} {...defaultProps} error="Loading failed" />)
    expect(screen.getByText('Loading failed')).toBeInTheDocument()
  })

  it('handles empty data boundary', () => {
    render(<{{ComponentName}} {...defaultProps} data={[]} />)
    expect(screen.getByText(/No data/)).toBeInTheDocument()
  })

  it('long text does not overflow', () => {
    const longText = 'Very long text'.repeat(100)
    render(<{{ComponentName}} {...defaultProps} text={longText} />)
    const element = screen.getByText(longText)
    expect(element).toHaveStyle({ overflow: 'hidden', textOverflow: 'ellipsis' })
  })

  it('passes accessibility check', async () => {
    const { container } = render(<{{ComponentName}} {...defaultProps} />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
```

**2b. Component Test Template (Vue Test Utils)**

```typescript
import { mount, VueWrapper } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import {{ComponentName}} from './{{ComponentName}}.vue'

describe('{{ComponentName}}', () => {
  const defaultProps = {
    // default props
  }

  const createWrapper = (props = {}) =>
    mount({{ComponentName}}, { props: { ...defaultProps, ...props } })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders normally', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="component-root"]').exists()).toBe(true)
  })

  it('renders each variant', () => {
    const variants = ['default', 'primary', 'danger'] as const
    variants.forEach((variant) => {
      const wrapper = createWrapper({ variant })
      expect(wrapper.find('[data-testid="component-root"]').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  it('triggers interaction callback', async () => {
    const onClick = vi.fn()
    const wrapper = createWrapper({ onClick })
    await wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('displays loading state', () => {
    const wrapper = createWrapper({ loading: true })
    expect(wrapper.find('[role="status"]').exists()).toBe(true)
  })

  it('displays error state', () => {
    const wrapper = createWrapper({ error: 'Loading failed' })
    expect(wrapper.text()).toContain('Loading failed')
  })

  it('handles empty data boundary', () => {
    const wrapper = createWrapper({ data: [] })
    expect(wrapper.text()).toContain('No data')
  })

  it('passes accessibility check', async () => {
    const wrapper = createWrapper()
    const results = await axe(wrapper.element)
    expect(results).toHaveNoViolations()
  })
})
```

**2c. API Integration Test Template**

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
    return HttpResponse.json({ code: 500, message: 'Server error' }, { status: 500 })
  }),
]

const server = setupServer(...mockHandlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('{{endpointName}} API', () => {
  it('returns data on normal request', async () => {
    const result = await {{endpointName}}({ /* params */ })
    expect(result.code).toBe(0)
    expect(result.data).toBeDefined()
  })

  it('request parameter types are correct', async () => {
    const result = await {{endpointName}}({ /* params */ })
    expect(typeof result.data.id).toBe('string')
  })

  it('server error triggers error handling', async () => {
    server.use(...errorHandlers)
    await expect({{endpointName}}({ /* params */ })).rejects.toThrow()
  })

  it('network timeout triggers retry', async () => {
    server.use(
      http.get('/api/{{module}}/{{resource}}', async () => {
        await new Promise((resolve) => setTimeout(resolve, 15000))
        return HttpResponse.json({ code: 0, data: {} })
      })
    )
    await expect({{endpointName}}({ /* params */ }, { timeout: 1000 })).rejects.toThrow()
  })

  it('401 unauthorized triggers auth refresh', async () => {
    server.use(
      http.get('/api/{{module}}/{{resource}}', () => {
        return HttpResponse.json({ code: 401, message: 'Unauthorized' }, { status: 401 })
      })
    )
    await expect({{endpointName}}({ /* params */ })).rejects.toThrow()
  })
})
```

**2d. E2E Test Configuration Template (Playwright)**

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

E2E core flow test template:

```typescript
import { test, expect } from '@playwright/test'

test.describe('Core User Flows', () => {
  test('User login flow', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="username"]', 'testuser')
    await page.fill('[data-testid="password"]', 'testpass')
    await page.click('[data-testid="login-button"]')
    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('[data-testid="user-avatar"]')).toBeVisible()
  })

  test('List browsing flow', async ({ page }) => {
    await page.goto('/items')
    await expect(page.locator('[data-testid="item-list"]')).toBeVisible()
    await page.click('[data-testid="item-card"]:first-child')
    await expect(page).toHaveURL(/\/items\/\d+/)
    await expect(page.locator('[data-testid="item-detail"]')).toBeVisible()
  })

  test('Form submission flow', async ({ page }) => {
    await page.goto('/items/new')
    await page.fill('[data-testid="input-name"]', 'Test Item')
    await page.click('[data-testid="submit-button"]')
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
  })
})
```

Test files written to {project_dir}/tests/.

### Step 3: Performance Optimization [Deep]

Establish performance baselines:

| Metric | Excellent | Needs Optimization | Poor |
|------|------|--------|-----|
| LCP | <=2.5s | 2.5-4s | >4s |
| FCP | <=1.8s | 1.8-3s | >3s |
| FID | <=100ms | 100-300ms | >300ms |
| CLS | <=0.1 | 0.1-0.25 | >0.25 |
| First Screen JS | <=200KB | 200-500KB | >500KB |
| First Screen CSS | <=50KB | 50-100KB | >100KB |

**3a. Performance Optimization Checklist**

| Optimization Dimension | Specific Measures | Affected Metric | Priority |
|----------|---------|---------|--------|
| **LCP Optimization** | Critical resource preloading `<link rel="preload">` | LCP | P0 |
| **LCP Optimization** | Above-the-fold images use `<img loading="eager">` + fetchpriority="high" | LCP | P0 |
| **LCP Optimization** | Inline critical CSS to `<head>`, avoid render blocking | LCP/FCP | P0 |
| **LCP Optimization** | Server-side rendering (SSR) or static generation (SSG) for above-the-fold content | LCP/FCP | P1 |
| **LCP Optimization** | Use `font-display: swap` to avoid font loading blocking text rendering | LCP/CLS | P1 |
| **FCP Optimization** | Inline critical CSS, async load non-critical CSS | FCP | P0 |
| **FCP Optimization** | Reduce above-the-fold JS size (code splitting + Tree Shaking) | FCP | P0 |
| **FCP Optimization** | Preconnect to critical domains `<link rel="preconnect">` | FCP | P1 |
| **CLS Optimization** | Set explicit `width` and `height` attributes on images/videos | CLS | P0 |
| **CLS Optimization** | Reserve placeholder space for dynamic content (skeleton/placeholder) | CLS | P0 |
| **CLS Optimization** | Use `size-adjust` + `ascent-override` for fonts to avoid layout shifts | CLS | P1 |
| **CLS Optimization** | Avoid dynamically inserting content above the viewport | CLS | P1 |

**3b. Bundle Size Analysis and Optimization**

| Optimization Method | Implementation | Expected Benefit |
|----------|---------|---------|
| Code Splitting | Route-level `React.lazy`/`defineAsyncComponent` + dynamic `import()` | First screen JS reduced 40-60% |
| Tree Shaking | Ensure ESM imports, `package.json` configure `sideEffects:false` | Dead code elimination 10-30% |
| On-demand Import | Component library on-demand import (e.g. `import { Button } from 'antd'`) | Single library reduced 50-80% |
| Bundle Analysis | `rollup-plugin-visualizer` / `webpack-bundle-analyzer` generate visual report | Identify large dependencies |
| Dependency Replacement | moment->dayjs, lodash->lodash-es, native replacement libraries | Single item reduced 50-200KB |
| Duplicate Dependencies | `npm dedupe` / `pnpm` auto-deduplication | Reduced 5-15% |
| External CDN | React/Vue and other large frameworks via CDN + externals configuration | Reduced build size |

**3c. Image/Font Optimization**

| Optimization Type | Specific Measures | Tool/Configuration |
|----------|---------|----------|
| Image Format | Prefer WebP/AVIF, `<picture>` tag fallback | vite-plugin-webp / sharp |
| Image Sizing | Responsive images `srcset` + `sizes`, provide appropriate sizes per device | Manual configuration |
| Image Lazy Loading | Below-the-fold images `loading="lazy"` + `decoding="async"` | Native attributes |
| Image Placeholder | LQIP (Low Quality Image Placeholder) or SVG placeholder, avoid layout shifts | vite-plugin-lqip |
| SVG Optimization | Remove metadata, merge paths, compress | svgo / vite-plugin-svgo |
| Font Subsetting | Include only used characters, Chinese fonts on-demand chunked loading | fontmin / subset-font |
| Font Preloading | Critical fonts `<link rel="preload" as="font" crossorigin>` | HTML configuration |
| Font Display | `font-display: swap` or `optional` | CSS @font-face |
| Icon Solution | Small icons use SVG sprite or icon font, avoid multiple image requests | vite-plugin-svg-icons |

**3d. Cache Strategy**

| Resource Type | Cache Strategy | Cache-Control Configuration | Description |
|----------|---------|-------------------|------|
| HTML Entry | Negotiation cache | `no-cache` | Validate each time, ensure timely updates |
| JS/CSS (with hash) | Strong cache | `public, max-age=31536000, immutable` | Content hash change = new file, can be cached long-term |
| Images/Fonts (with hash) | Strong cache | `public, max-age=31536000, immutable` | Same as above |
| API Responses | Short-term cache | `private, max-age=60, must-revalidate` | Adjust based on business needs |
| Service Worker | Offline-first | Workbox strategy | Static assets CacheFirst, API NetworkFirst |

> ext enhancement results consumed through upstream design_brief.json, this step focuses on core logic

### Step 3b: Security Audit

**Security Checklist**:

| Check Item | Implementation | Block Level |
|--------|---------|---------|
| CSP Configuration | Generate Content-Security-Policy header, restrict script-src/style-src/img-src | P0 |
| XSS Protection | Ensure all user input is escaped, React default escaping + DOMPurify | P0 |
| CSRF Protection | SameSite Cookie + CSRF Token (if using Cookie authentication) | P1 |
| SRI | Add integrity attribute to external CDN resources | P1 |
| Sensitive Info Leakage | Check code for no hardcoded keys/tokens/passwords | P0 |
| Dependency Vulnerabilities | npm audit / pnpm audit, high-severity vulnerabilities must be fixed | P0 |
| HTTPS Enforcement | Force HTTPS in production, HSTS header configuration | P0 |

P0 level failure blocks output.

### Step 4: Performance Budget and CI Configuration [Core]

Establish performance budgets and CI blocking:

| Budget Item | Threshold | Block Level |
|--------|------|---------|
| First Screen JS | <=200KB | Exceeding blocks merge |
| First Screen CSS | <=50KB | Exceeding blocks merge |
| LCP | <=2.5s | Exceeding blocks release |
| CLS | <=0.1 | Exceeding warns |
| Single chunk size | <=300KB | Exceeding warns |

CI configuration written to {project_dir}/.

### Output Depth Grading

| Depth Level | Output Scope | Description |
|----------|----------|------|
| quick | deployment readiness checklist and critical issues | Core conclusions + minimum viable deliverable |
| standard | Full deliverables (default) | Complete output including all Steps |
| deep | Full deployment + real runtime validation + performance benchmarking + operational readiness assessment | Full deliverables + extended analysis + deep simulation |

## Output

**Code File Output**: {project_dir}/ (build configuration, test files, CI configuration, performance budgets)

**Metadata Output**: output/ui-frontend-integration/production-ready/

**Output Files**: production-ready.json

**Output Schema**:

```json
{
  "type": "object",
  "required": ["build_config", "test_report", "performance_report", "performance_budget", "project_dir"],
  "properties": {
    "build_config": {
      "type": "object",
      "description": "Build configuration information",
      "properties": {
        "bundler": {"type": "string", "description": "Build tool (Vite/Webpack/Next.js)"},
        "code_splitting": {"type": "boolean", "description": "Whether code splitting is enabled"},
        "chunk_count": {"type": "number", "description": "Code splitting chunk count"},
        "env_configs": {"type": "array", "description": "Environment configuration list (dev/staging/prod)"},
        "compression": {"type": "string", "description": "Compression algorithm (gzip/brotli)"},
        "cdn_externals": {"type": "array", "description": "CDN externalized dependency list"}
      }
    },
    "test_report": {
      "type": "object",
      "description": "Test report",
      "properties": {
        "unit_coverage": {"type": "number", "description": "Unit test coverage (%)"},
        "integration_coverage": {"type": "number", "description": "Integration test coverage (%)"},
        "e2e_pass_rate": {"type": "number", "description": "E2E test pass rate (%)"},
        "a11y_pass": {"type": "boolean", "description": "Whether accessibility tests passed"},
        "total_tests": {"type": "number", "description": "Total test case count"},
        "failed_tests": {"type": "number", "description": "Failed test case count"},
        "visual_regression_pass": {"type": "boolean", "description": "Whether visual regression tests passed"}
      }
    },
    "performance_report": {
      "type": "object",
      "description": "Performance report",
      "properties": {
        "lcp": {"type": "number", "description": "LCP time (s)"},
        "fcp": {"type": "number", "description": "FCP time (s)"},
        "fid": {"type": "number", "description": "FID time (ms)"},
        "cls": {"type": "number", "description": "CLS score"},
        "first_screen_js_kb": {"type": "number", "description": "First screen JS size (KB)"},
        "first_screen_css_kb": {"type": "number", "description": "First screen CSS size (KB)"},
        "bottlenecks": {"type": "array", "description": "Performance bottleneck list"},
        "optimization_applied": {"type": "array", "description": "Applied optimization measures list"}
      }
    },
    "performance_budget": {
      "type": "object",
      "description": "Performance budget thresholds",
      "properties": {
        "max_lcp": {"type": "number", "description": "LCP threshold (s)"},
        "max_fcp": {"type": "number", "description": "FCP threshold (s)"},
        "max_cls": {"type": "number", "description": "CLS threshold"},
        "max_first_screen_js_kb": {"type": "number", "description": "First screen JS threshold (KB)"},
        "max_first_screen_css_kb": {"type": "number", "description": "First screen CSS threshold (KB)"},
        "ci_blocking": {"type": "boolean", "description": "Whether CI blocks on threshold exceedance"}
      }
    },
    "project_dir": {"type": "string", "description": "Project root directory path"}
  }
}
```

## Decision Rules

| Condition | Decision |
|------|------|
| LCP>4s | P0, must optimize before release |
| First screen JS>500KB | P0, mandatory code splitting |
| CLS>0.25 | P0, layout shift must be fixed |
| Component coverage <80% | Supplement missing test cases |
| Core flow E2E failure | P0, blocks release |
| Accessibility test failure | P0, blocks release |
| Target language != en-US | E2E assertions use target language text, mock data uses target language |
| Target framework=React | Use Jest/Vitest + React Testing Library |
| Target framework=Vue | Use Vitest + Vue Test Utils |
| Target framework=Svelte | Use Vitest + Svelte Testing Library |
| Deployment target=Vercel/Netlify | Generate platform-specific configuration files (vercel.json/netlify.toml) |
| Deployment target=CDN | Generate CDN externals configuration + SRI hash |
| Single chunk>300KB | Split into smaller chunks or lazy load |

## Quality Checks

### P0 Checks (must pass for quick/standard/deep)

- [ ] Build succeeds, no TypeScript errors
- [ ] No hardcoded keys/tokens/passwords

### P1 Checks (must pass for standard/deep)

- [ ] npm audit has no high-severity vulnerabilities
- [ ] LCP<=2.5s
- [ ] CLS<=0.1
- [ ] Core user flows 100% have E2E tests
- [ ] Accessibility tests cover WCAG 2.1 AA
- [ ] XSS protection configured (React default escaping + DOMPurify)
- [ ] Component unit test coverage >=80%
- [ ] First screen JS<=200KB
- [ ] Performance budget written to CI configuration
- [ ] CSP configuration generated
- [ ] CSRF protection configured (when using Cookie authentication)
- [ ] SRI configured (external CDN resources)
- [ ] HTTPS enforcement + HSTS header configured
- [ ] Image/font optimization executed
- [ ] Cache strategy configured (at least 3 resource types)
- [ ] Visual regression tests configured

### P2 Checks (must pass for deep only)

- [ ] Extended analysis complete (deep simulation and roadmap generated)
- [ ] Decision records complete (key decisions have rationale and alternatives)

### Real Runtime Validation Strategy

Define executable validation command list in Claude/Trae environment, replacing text-only acceptance rules.

**Project Command Discovery Strategy**:
1. Read package.json scripts field to identify available build/test/lint commands
2. Prioritize executing existing commands rather than assuming commands exist

**Validation Command List**:

| Validation Dimension | Discovery Strategy | Execution Command | Pass Criteria | Failure Handling |
|---------|---------|---------|---------|---------|
| Build Check | package.json scripts.build | npm run build / pnpm build | Zero-error exit | Mark build errors, block output |
| Type Check | package.json scripts.typecheck or tsconfig.json | npx tsc --noEmit | Zero type errors | Mark type errors, suggest fixes |
| Lint Check | package.json scripts.lint or .eslintrc | npm run lint | Zero errors (warnings allowed) | Mark lint errors |
| Unit Tests | package.json scripts.test | npm run test -- --coverage | Coverage ≥80% | Mark uncovered modules |
| Build Artifact Check | Check dist/ directory after build | ls dist/ or check output directory | Artifacts exist and non-empty | Mark missing build artifacts |
| Responsive Check | Browser DevTools or manual | Check viewport meta + CSS media queries | 3 breakpoints covered | Mark missing breakpoints |
| Text Overflow Check | Code review | Check text-overflow/truncation usage | Key text has overflow handling | Mark overflow risks |
| a11y Check | package.json scripts.a11y or axe-core | npx axe-core or npm run a11y | WCAG AA compliance | Mark non-compliant items |

**Validation Execution Order**: Build Check → Type Check → Lint Check → Unit Tests → Build Artifact Check → Responsive/a11y Check

## Degradation Strategy

| Missing Upstream Input | Degradation Plan | Output Impact |
|---------------|---------|---------|
| API integration missing | Skip API-related tests, do not generate API integration test template | Missing API integration tests, mock data needs manual supplementation |
| quality_debt missing | Skip debt handling, proceed directly to build and test | Critical-level debt may be unfixed, production quality risk |
| Deployment target missing | Output generic build configuration, do not generate platform-specific configuration | Deployment configuration needs manual adjustment, missing vercel.json/netlify.toml |
| Target language missing | Default zh-CN, test assertions and mock data use Chinese | Non-Chinese projects need manual adjustment of text and assertions |
| project_dir missing | Output to output/ directory only | Configuration files need manual copying to project directory |

## Data Handoff with Stage-6

### Input Consumption

production-ready serves as the core execution skill of stage-6 (step 6.1), consuming the following upstream data:

| Data Source | Consumption Method | Handoff Path |
|----------|---------|---------|
| stage-4 enhanced code | Serves as code input for build and test | `{project_dir}/src/` + `output/ui-frontend/page-builder/` |
| stage-5 API integration (optional) | Consumes API integration metadata, generates API-related tests | `output/ui-frontend-integration/api-integration/api-integration.json` |
| quality_debt (optional) | Prioritizes handling critical-level debt | `output/ui-frontend/page-builder/quality_debt.json` |

**stage-5 skip scenario**: When there is no backend API, stage-5 does not execute, production-ready directly consumes stage-4's enhanced code, skipping API integration test generation.

### Output Delivery

After production-ready execution completes, output is delivered to subsequent stage-6 steps:

| Subsequent Step | Consumed Content | Delivery Method |
|----------|---------|---------|
| 6.2 ext-impeccable {harden\|polish} | Code + build configuration | Directly read build configuration and source code from {project_dir}/ |
| 6.3 ext-impeccable optimize | Performance report | Read performance_report from `output/ui-frontend-integration/production-ready/production-ready.json` |

### Human Gate

stage-6 has a `[GATE] Release decision requires human confirmation` after production-ready execution; production-ready's P0 quality check results serve as the gate decision basis:
- All P0 passed -> Recommend passing gate
- P0 has failures -> Block gate, must fix and re-execute

## Upstream Change Response

### Upstream Change Impact Table

| Upstream Change | Impact Scope | Response Strategy |
|----------|----------|----------|
| Frontend code change (component add/remove/page structure change/route change) | Test cases, build configuration, code splitting strategy | Mark affected test files and build chunks, recommend regenerating corresponding tests and verifying build |
| API integration change (endpoint add/remove/type definition change/request layer selection change) | API-related tests, mock data, dependency configuration | Mark affected API tests and dependencies, recommend updating test mocks and build configuration |
| quality_debt change | Step 1 debt handling plan | Mark new/upgraded critical-level debt, prioritize fixing before executing build and test |
| Target framework change | Build tool, test framework, dependency configuration | Mark build and test solutions needing replacement, recommend regenerating build configuration and tests |
| Deployment target change | CI/CD configuration, environment variables, cache strategy | Mark deployment configuration needing adjustment, recommend regenerating CI configuration |

### Upstream Feedback Mechanism Table

| Issue Found by This Skill | Feedback to Upstream Skill | Feedback Content | Trigger Condition |
|---------------|-------------|---------|---------|
| Component rendering performance issue | page-builder | Component needs optimization (e.g. missing memo/virtual list) | Single component render >16ms or list >100 items without virtualization |
| Build artifact size exceeds limit | page-builder | Component needs splitting or lazy loading | Single chunk >300KB |
| TypeScript type error | page-builder / api-integration | Type definition missing or inconsistent | Build fails due to type errors |
| Accessibility test failure | page-builder | Component missing ARIA attributes or keyboard navigation | axe-core detects WCAG AA violation |
| API type mismatch | api-integration | Request/response types inconsistent with actual | API integration test type assertion failure |
