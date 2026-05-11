---
name: frontend-integration-orchestrator
description: 前端集成指挥官。协调API契约消费、构建部署和性能优化的完整流程，确保前端与后端联调集成和上线质量。关键词：前端集成、前后端联调、构建部署、性能优化。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "orchestrator"
  version: "1.0"
---

# 前端集成指挥官

## 核心原则

前后端通过契约解耦，集成通过自动化保障。

## 执行步骤

1. **契约先行**：先消费API契约，再联调接口
2. **Mock开发**：后端未就绪时用Mock数据开发，就绪后无缝切换
3. **构建验证**：构建通过+测试通过才能部署
4. **性能卡口**：性能预算不通过不能上线

## 任务调度

```
api-contract-consume → frontend-build-deploy → frontend-performance
```

| 阶段 | 任务 | 执行模式 |
|------|------|----------|
| 1 | api-contract-consume | 🤖 AI自动执行 |
| 2 | frontend-build-deploy | 🤖 AI自动执行 |
| 3 | frontend-performance | 🤖 AI自动执行 |

### 数据流转

```
[API契约文档 + 页面代码 + 构建配置]
       ↓
api-contract-consume
       ↓ api_client (type_definitions / request_functions / mock_data / hooks / error_handling)
frontend-build-deploy
       ↓ build (ci_config / cdn_config / environment_config / deploy_pipeline / build_output)
frontend-performance
       ↓ performance_report (bundle_analysis / load_metrics / render_metrics / optimization_suggestions / budget_compliance)
```

### 调度逻辑

| 触发事件 | 调度动作 |
|----------|----------|
| API契约文档就绪 | → api-contract-consume（API契约消费） |
| API客户端代码生成完成 | → frontend-build-deploy（构建部署） |
| 构建成功+CI通过 | → frontend-performance（性能优化） |
| 构建失败 | → 标注构建错误，回退修复 |
| 性能预算不达标 | → frontend-performance（继续优化） |
| 性能预算达标 | → 标注"可上线" |

## 调度规则

- 每次只加载当前阶段需要的子Skill，完成后再加载下一阶段，不要一次性加载所有子Skill
- 每个阶段完成后，将中间结果写入 `output/ui-frontend-integration/{skill-name}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| API契约消费完成 | 100%接口有类型定义+Mock数据 | 缺失接口标注TODO，不阻塞开发 |
| 构建部署完成 | 构建成功+CI流水线通过 | 构建失败必须修复 |
| 性能优化完成 | LCP≤2.5s + 首屏JS≤200KB | 性能不达标必须优化后才能上线 |

## 人类决策点

| 决策点 | 说明 |
|--------|------|
| API契约确认 | AI消费API契约后，人类确认接口理解是否正确 |
| 部署目标选择 | 人类确认部署平台和环境配置 |
| 性能预算调整 | 人类确认性能预算阈值是否合理 |
| Mock数据确认 | AI生成Mock数据后，人类确认Mock逻辑是否合理 |
| 性能不达标处理 | 性能优化后仍不达标，人类决策是否接受为技术债务 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| API契约文档缺失 | 降级使用Mock数据开发，标注"缺乏API契约" |
| 构建失败 | 标注错误信息，回退修复后重新构建 |
| CI流水线不可用 | 本地构建验证，标注"CI待验证" |
| 性能优化后仍不达标 | 标注"性能待优化"，人类决策是否接受技术债务 |
| CDN配置异常 | 降级为本地静态资源，标注"CDN待配置" |
