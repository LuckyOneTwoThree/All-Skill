---
name: frontend-build-deploy
description: 当需要配置前端构建和部署流程时使用。前端构建部署自动配置，生成前端项目的构建配置、环境管理、CDN策略和CI/CD流水线，实现前端自动化构建和部署。关键词：前端构建、部署、CI/CD、CDN、环境管理、Webpack、Vite。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 10: 前端构建部署自动配置

## 核心原则

1. **环境隔离**：开发/测试/预发/生产环境严格隔离，配置不交叉
2. **构建可复现**：锁定依赖版本，构建结果可复现
3. **渐进式发布**：生产环境使用灰度发布，降低发布风险
4. **回滚秒级**：每次发布保留回滚能力，回滚时间≤30秒

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 项目信息 | JSON | 是 | 用户提供 | 技术栈、框架、包管理器 |
| 部署目标 | string | 是 | 用户提供 | Vercel / AWS / 阿里云 / 自建 |
| 环境配置 | JSON | ○ | 用户提供 | 各环境API地址、功能开关等 |

## 执行步骤

### Step 1: 构建工具配置

根据技术栈生成构建配置：

| 技术栈 | 构建工具 | 配置要点 |
|--------|---------|---------|
| React | Vite / Webpack | 代码分割、Tree Shaking、HMR |
| Vue | Vite | 组件按需加载、CSS Scoped |
| Next.js | 内置 | SSR/SSG配置、Image优化 |

**通用构建优化**：
- 代码分割：路由级 + 组件级 + 第三方库独立chunk
- Tree Shaking：ESM模块、sideEffects标记
- 资源优化：图片压缩、SVG内联、字体子集化
- 构建缓存：babel-loader cacheDirectory、Vite缓存

### Step 2: 环境管理配置

生成多环境配置方案：

| 环境 | API地址 | 用途 | 访问控制 |
|------|---------|------|---------|
| development | localhost / dev-api | 本地开发 | 无 |
| staging | staging-api | 测试验证 | 内网 |
| pre-production | pre-api | 预发验证 | 内网+白名单 |
| production | api | 正式服务 | 公网 |

**配置管理规则**：
- 环境变量通过.env.{environment}文件管理
- 敏感信息（密钥、Token）不写入代码，通过CI环境变量注入
- 构建时注入环境变量，运行时不可更改
- 每个环境有独立的feature flags配置

### Step 3: CDN与缓存策略

配置静态资源CDN策略：

| 资源类型 | 缓存策略 | CDN规则 |
|----------|---------|---------|
| HTML入口 | no-cache（每次验证） | 不缓存或极短缓存 |
| JS/CSS文件 | max-age=31536000（1年） | 文件名含hash，长期缓存 |
| 图片/字体 | max-age=86400（1天） | 中期缓存 |
| API请求 | no-store | 不缓存 |

**CDN规则**：
- 静态资源上传CDN，HTML保留源站
- 开启Gzip/Brotli压缩
- 开启HTTP/2 Push（关键CSS/JS）
- 配置CORS头

### Step 4: CI/CD流水线

生成CI/CD流水线配置：

| 阶段 | 触发条件 | 执行内容 | 超时 |
|------|---------|---------|------|
| Lint | 每次提交 | ESLint + Prettier + TypeCheck | 5分钟 |
| Test | 每次提交 | 单元测试 + 快照测试 | 10分钟 |
| Build | main分支 | 生产构建 + 产物上传 | 10分钟 |
| Deploy-Staging | main分支 | 部署到测试环境 | 5分钟 |
| E2E | 部署后 | Playwright E2E测试 | 15分钟 |
| Deploy-Prod | 手动触发 | 灰度发布到生产环境 | 10分钟 |

### Step 5: 监控与告警

配置前端监控：

| 监控类型 | 工具 | 告警阈值 |
|----------|------|---------|
| 性能监控 | Web Vitals | LCP>2.5s / FID>100ms / CLS>0.1 |
| 错误监控 | Sentry | 错误率>0.1% |
| 可用性监控 | Uptime Robot | 可用性<99.9% |
| 用户行为 | 自建/第三方 | 核心流程转化率下降>10% |

## 输出

**存储路径**：`output/ui-frontend-integration/frontend-build-deploy/`

**输出文件**：build-config.json

```json
{
  "build_config": {
    "tool": "vite",
    "optimizations": ["code_splitting", "tree_shaking", "asset_compression"],
    "bundle_size_budget": { "initial_load": "200KB", "lazy_chunks": "100KB" }
  },
  "environments": {
    "development": { "api_base": "http://localhost:3000", "mock_enabled": true },
    "staging": { "api_base": "https://staging-api.example.com", "mock_enabled": false },
    "production": { "api_base": "https://api.example.com", "mock_enabled": false }
  },
  "cdn": {
    "provider": "cloudflare",
    "domain": "cdn.example.com",
    "cache_rules": 4
  },
  "ci_cd": {
    "platform": "github_actions",
    "pipelines": 6,
    "avg_build_time": "8min",
    "rollback_time": "30s"
  },
  "monitoring": {
    "performance": "web_vitals",
    "errors": "sentry",
    "uptime": "uptime_robot"
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| 首屏JS>200KB | 强制代码分割，非关键模块懒加载 |
| 首屏JS>500KB | 标记P0性能问题，必须优化后才能发布 |
| 构建时间>10分钟 | 优化构建缓存和并行构建 |
| LCP>2.5s | 标记P0，优化关键渲染路径 |
| 错误率>0.1% | 自动告警，触发回滚评估 |
| 核心流程转化率下降>10% | 自动告警，触发排查 |

## 质量检查

- [ ] 构建配置包含代码分割和Tree Shaking
- [ ] 环境配置≥3个（dev/staging/prod）
- [ ] 敏感信息不写入代码文件
- [ ] CDN缓存策略区分HTML和静态资源
- [ ] CI/CD流水线包含Lint+Test+Build+Deploy
- [ ] 监控覆盖性能+错误+可用性3类

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 部署目标未指定 | 生成通用配置，不绑定特定云平台 | 需手动适配云平台特定配置 |
| 环境配置缺失 | 生成开发+生产2个环境的最小配置 | 缺少staging/pre-production环境 |
| 项目信息缺失 | 默认React+Vite+pnpm | 技术栈可能与实际不符 |

数据获取说明：
- 本Skill需要项目信息和部署目标，请通过以下方式之一提供：
  1. 描述技术栈（框架/构建工具/包管理器）和部署平台
  2. 上传package.json文件
  3. 提供现有项目仓库路径
