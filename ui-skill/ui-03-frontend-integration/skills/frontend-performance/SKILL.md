---
name: frontend-performance
description: 当需要分析和优化前端性能时使用。前端性能优化自动执行，对前端应用进行性能分析，识别包体积、加载速度和渲染性能瓶颈，生成优化方案和代码级修复建议。关键词：前端性能、Web Vitals、包体积、加载速度、渲染性能、Lighthouse、页面卡顿、加载慢。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "pipeline"
  version: "1.2"
  domain_tags: ["互联网", "通用"]
  trigger_examples:
    - "页面加载太慢怎么办"
    - "帮我优化前端性能"
    - "分析一下页面卡顿原因"
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
| 目标语言 | string | ○ | 上游编排器传递（默认zh-CN） | 目标界面语言，影响字体子集化策略和i18n资源优化 |
| project_dir | string | ○ | output/ui-project-scaffold/scaffold.json | 项目根目录绝对路径，优先分析项目目录中的实际代码 |

## 执行步骤

### Step 1: 性能基线建立

**性能分析数据源优先级**：当 project_dir 存在时，优先分析 `{project_dir}/src/` 中的实际项目代码和 `{project_dir}/` 中的构建配置，而非 output/ 目录中的元数据。项目代码是可运行的最新版本，性能分析结果更准确。

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

**外部 Skill 调用**：

#### ext-impeccable optimize

**触发条件**：LCP>2.5s 且瓶颈为UI渲染（非网络/非包体积）
**反模式**：性能瓶颈为网络延迟或包体积（非UI渲染问题） → 跳过

```
Skill: ext-impeccable
输入:
  子命令: optimize
  目标: 性能瓶颈组件/页面代码
  上下文: 性能分析报告 + 项目目录代码（如project_dir存在）
输出: UI渲染优化方案（重排优化/重绘减少/合成层优化）
验证: LCP降至2.5s以下且视觉表现不降级
模式: 🤖
```

**Register 感知**：brand→优化视觉表现力；product→优化交互响应

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

**输出Schema**：

```json
{
  "type": "object",
  "required": ["baseline", "bottlenecks", "performance_budget"],
  "properties": {
    "baseline": {"type": "object", "description": "性能基线，包含LCP/FID/CLS/TTI/FCP/首屏JS/首屏CSS"},
    "bottlenecks": {"type": "array", "description": "性能瓶颈列表，每项含id/severity/category/description/root_cause/fix/expected_improvement"},
    "performance_budget": {"type": "object", "description": "性能预算阈值，包含first_screen_js/first_screen_css/LCP/CLS"}
  }
}
```

### 输出校验规则

- [ ] 性能指标可量化：LCP/FID/CLS等Core Web Vitals有明确基线
- [ ] 优化方案可执行：每项优化建议有具体实施步骤
- [ ] 监控方案完整：性能监控覆盖页面加载+运行时+资源加载
- [ ] 预算阈值合理：性能预算阈值与业务场景匹配

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
| project_dir 缺失 | 仅分析 output/ 目录中的元数据和代码片段 | 性能分析可能不完整 |

## 数据获取说明

本Skill需要前端代码和构建配置，请通过以下方式之一提供：
  1. 上传Lighthouse报告JSON
  2. 提供Web Vitals数据
  3. 描述页面加载慢的具体场景

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| 前端代码变更 | 性能基线和瓶颈分析 | 标注受影响的性能指标，建议重新建立基线 |
| 构建产物变更 | 包体积和加载速度 | 标注受影响的优化项，建议重新分析 |
| API契约变更 | 数据请求性能 | 标注受影响的接口调用，建议评估请求优化 |

### 下游通知机制表

| 本Skill输出变更 | 通知下游Skill | 通知内容 | 触发条件 |
|---------------|-------------|---------|---------|
| 性能预算调整 | frontend-build-deploy | 更新的性能预算阈值 | 预算阈值变更 |
| 优化方案变更 | ui-component-gen | 受影响的组件代码 | 组件级优化建议变更 |
