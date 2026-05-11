---
name: frontend-performance
description: 当需要分析和优化前端性能时使用。前端性能优化自动执行，对前端应用进行性能分析，识别包体积、加载速度和渲染性能瓶颈，生成优化方案和代码级修复建议。关键词：前端性能、Web Vitals、包体积、加载速度、渲染性能、Lighthouse。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "pipeline"
  version: "1.0"
  interaction_mode: "ai_auto"
---

# Pipeline 11: 前端性能优化自动执行

## 核心原则

1. **数据驱动**：性能优化基于Lighthouse/Web Vitals实测数据，非主观判断
2. **用户感知优先**：优化目标是用户可感知的速度，而非技术指标
3. **渐进优化**：先解决最大瓶颈，再逐步优化次要问题
4. **防退化**：性能预算写入CI，超标自动拦截

## 交互模式

🤖 AI自动执行

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 前端代码 | code | 是 | output/ui-frontend/page-assembly / output/ui-frontend/ui-component-gen | 待优化的前端代码 |
| 构建产物 | JSON | 是 | output/ui-frontend-integration/frontend-build-deploy | 构建配置和产物分析 |
| 性能数据 | JSON | ○ | 用户提供 | Lighthouse报告 / Web Vitals数据 |

## 执行步骤

### Step 1: 性能基线建立

建立性能基线指标：

| 指标 | 优秀 | 需优化 | 差 |
|------|------|--------|-----|
| LCP（最大内容绘制） | ≤2.5s | 2.5-4s | >4s |
| FID（首次输入延迟） | ≤100ms | 100-300ms | >300ms |
| CLS（累积布局偏移） | ≤0.1 | 0.1-0.25 | >0.25 |
| TTI（可交互时间） | ≤3.5s | 3.5-7s | >7s |
| FCP（首次内容绘制） | ≤1.8s | 1.8-3s | >3s |
| 首屏JS体积 | ≤200KB | 200-500KB | >500KB |
| 首屏CSS体积 | ≤50KB | 50-100KB | >100KB |

### Step 2: 包体积优化

分析并优化包体积：

| 优化手段 | 适用条件 | 预期收益 |
|----------|---------|---------|
| 路由级代码分割 | 单页应用 | 首屏减少50%-70% |
| 组件级懒加载 | 非首屏组件 | 首屏减少20%-40% |
| 第三方库按需引入 | 全量引入的库 | 减少30%-60% |
| Tree Shaking | 有sideEffects标记 | 减少10%-30% |
| 图片优化 | 未压缩图片 | 减少50%-80% |
| 字体子集化 | 中文字体全量引入 | 减少80%-95% |

### Step 3: 加载速度优化

优化资源加载策略：

| 优化手段 | 适用条件 | 实现方式 |
|----------|---------|---------|
| 关键CSS内联 | 首屏CSS | Extract Critical CSS |
| 资源预加载 | 关键资源 | `<link rel="preload">` |
| DNS预解析 | 第三方域名 | `<link rel="dns-prefetch">` |
| 图片懒加载 | 非首屏图片 | Intersection Observer |
| 服务端渲染 | SEO+首屏速度 | SSR/SSG |
| HTTP/2 Push | 关键资源 | 服务器配置 |

### Step 4: 渲染性能优化

优化运行时渲染性能：

| 优化手段 | 适用条件 | 预期收益 |
|----------|---------|---------|
| 虚拟列表 | 列表>100项 | 内存减少90% |
| React.memo/useMemo | 频繁重渲染组件 | 渲染次数减少50%-80% |
| Web Worker | CPU密集计算 | 主线程不阻塞 |
| 防抖/节流 | 频繁触发事件 | 事件处理减少80%-95% |
| CSS containment | 独立渲染区域 | 重排范围缩小 |
| will-change | 动画元素 | GPU加速 |

### Step 5: 性能预算与防退化

建立性能预算和CI拦截：

| 预算项 | 阈值 | 拦截级别 |
|--------|------|---------|
| 首屏JS | ≤200KB | 超标阻塞合并 |
| 首屏CSS | ≤50KB | 超标阻塞合并 |
| LCP | ≤2.5s | 超标阻塞发布 |
| CLS | ≤0.1 | 超标警告 |
| 单chunk大小 | ≤300KB | 超标警告 |

## 输出

**存储路径**：`output/ui-frontend-integration/frontend-performance/`

**输出文件**：performance-report.json

```json
{
  "baseline": {
    "LCP": "3.2s",
    "FID": "85ms",
    "CLS": "0.15",
    "TTI": "4.5s",
    "first_screen_js": "380KB",
    "first_screen_css": "72KB"
  },
  "bottlenecks": [
    {
      "id": "PERF-001",
      "severity": "P0",
      "category": "bundle_size",
      "description": "首屏JS 380KB，超出预算200KB",
      "root_cause": "moment.js全量引入(230KB)，未使用按需加载",
      "fix": "替换为day.js(2KB)或使用Intl API",
      "expected_improvement": "首屏JS减少60%"
    },
    {
      "id": "PERF-002",
      "severity": "P1",
      "category": "rendering",
      "description": "课程列表页滚动卡顿，FPS<30",
      "root_cause": "100+课程卡片全部DOM渲染",
      "fix": "使用虚拟滚动（react-virtualized）",
      "expected_improvement": "FPS稳定60"
    }
  ],
  "performance_budget": {
    "first_screen_js": "200KB",
    "first_screen_css": "50KB",
    "LCP": "2.5s",
    "CLS": "0.1"
  }
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| LCP>4s | P0，必须优化后才能发布 |
| LCP 2.5-4s | P1，本迭代优化 |
| 首屏JS>500KB | P0，强制代码分割 |
| 首屏JS 200-500KB | P1，建议优化 |
| CLS>0.25 | P0，布局偏移必须修复 |
| CLS 0.1-0.25 | P2，下迭代优化 |
| 单项优化收益<10% | 优先级降低，先解决大瓶颈 |

## 质量检查

- [ ] 性能基线覆盖LCP/FID/CLS/TTI/FCP 5个核心指标
- [ ] 每个瓶颈有根因分析和修复建议
- [ ] 包体积优化覆盖代码分割+Tree Shaking+按需引入
- [ ] 性能预算写入CI配置
- [ ] 优化方案有预期收益量化

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| 性能数据缺失 | 基于代码静态分析推断性能问题 | 问题定位可能不够精准 |
| 构建产物缺失 | 基于代码结构估算包体积 | 体积数据为估算值 |
| 前端代码缺失 | 仅输出通用优化建议 | 无法提供代码级修复方案 |

数据获取说明：
- 本Skill需要前端代码和构建配置，请通过以下方式之一提供：
  1. 上传Lighthouse报告JSON
  2. 提供Web Vitals数据
  3. 描述页面加载慢的具体场景
