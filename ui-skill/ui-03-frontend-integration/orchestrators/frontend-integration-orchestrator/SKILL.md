---
name: frontend-integration-orchestrator
description: 前端集成指挥官。协调api-contract-consume、frontend-build-deploy、frontend-performance三个子Skill的完整流程，确保前端与后端联调集成和上线质量。关键词：前端集成、前后端联调、构建部署、性能优化、api-contract-consume、frontend-build-deploy、frontend-performance。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "orchestrator"
  version: "3.0"
---

# 前端集成指挥官

## 核心原则

前后端通过契约解耦，集成通过自动化保障。

## 执行步骤

1. **契约先行**：先消费API契约，再联调接口
2. **Mock开发**：后端未就绪时用Mock数据开发，就绪后无缝切换
3. **构建验证**：构建通过+测试通过才能部署
4. **性能卡口**：性能预算不通过不能上线

## 编排协议

你是编排器，职责是**按阶段调度子Skill执行**，而非代理执行子Skill逻辑。严格遵循以下协议：

### 调用规则

1. **显式调用**：使用 `Skill` 工具调用子Skill，传递输入数据，接收输出结果
2. **不代理执行**：不读取子Skill的SKILL.md来替代执行，不自行推断子Skill的内部逻辑
3. **契约驱动**：只关注子Skill的输入契约、输出契约和验证条件，不关注内部实现
4. **状态传递**：将当前阶段的输出作为下一阶段的输入，通过文件路径传递数据
5. **验证后推进**：每个阶段输出验证通过后，才推进到下一阶段
6. **阶段总结**：所有子Skill执行完成后，生成阶段总结文档，写入 `output/phase-reports/ui/frontend-integration-orchestrator.md`

### 上下文管理

- 每个子Skill调用完成后，只保留**输出文件路径**和**关键结论摘要**
- 详细输出写入 `output/ui/{skill-name}/` 目录
- 若上下文接近上限，优先保留当前阶段内容和待执行阶段的子Skill名称

### 阶段总结

所有子Skill执行完成后，编排器必须生成一份阶段总结文档，写入 `output/phase-reports/ui/frontend-integration-orchestrator.md`，包含以下结构：

1. **执行概览**：编排器名称与版本、执行时间、子Skill执行状态（成功/失败/降级）
2. **关键发现**：每个子Skill的核心输出摘要（1-3条）、跨子Skill的交叉洞察
3. **决策记录**：人类决策点及决策结果、AI自动决策及依据
4. **产出清单**：所有输出文件路径及内容摘要、产出质量评估（是否通过验证）
5. **风险与待办**：未通过验证的项、降级执行的项、建议后续跟进的事项
6. **下游衔接**：本编排器产出可被哪些下游编排器消费、推荐的下一步编排器

## Pipeline

```yaml
pipeline:
  - stage: api-contract-consume
    parallel: true
    gate: 100%接口有类型定义 + 100%接口有Mock数据 + 错误处理覆盖401/403/500
  - stage: frontend-build-deploy
    parallel: true
    gate: 构建成功 + CI流水线通过
  - stage: frontend-performance
    depends_on: [api-contract-consume, frontend-build-deploy]
    gate: LCP≤2.5s + 首屏JS≤200KB
```

## 阶段执行计划

### 阶段1：api-contract-consume（并行）

#### 调用 api-contract-consume

```
Skill: api-contract-consume
输入:
  API契约文档: output/backend-api-design/api-contract/openapi.yaml
  页面数据需求: output/ui-frontend/page-assembly/
  目标框架: 用户提供
  设计令牌: output/ui-design-system/design-token/tokens.json（可选）
输出: output/ui-frontend-integration/api-contract-consume/
验证: 100%接口有类型定义 + 100%接口有Mock数据 + 错误处理覆盖401/403/500
模式: 🤖
```

### 阶段2：frontend-build-deploy（并行）

#### 调用 frontend-build-deploy

```
Skill: frontend-build-deploy
输入:
  项目信息: 用户提供
  部署目标: 用户提供
  环境配置: 用户提供（可选）
输出: output/ui-frontend-integration/frontend-build-deploy/
验证: 构建成功 + CI流水线通过
模式: 🤖
```

### 阶段3：frontend-performance

#### 调用 frontend-performance

```
Skill: frontend-performance
输入:
  前端代码: output/ui-frontend/page-assembly/ / output/ui-frontend/ui-component-gen/
  构建产物: output/ui-frontend-integration/frontend-build-deploy/
  性能数据: 用户提供（可选）
输出: output/ui-frontend-integration/frontend-performance/
验证: LCP≤2.5s + 首屏JS≤200KB
模式: 🤖
```

## 阶段卡口

| 卡口 | 条件 | 未通过处理 |
|------|------|------------|
| API契约消费完成 | 100%接口有类型定义+Mock数据 | 缺失接口标注TODO，不阻塞开发 |
| 构建部署完成 | 构建成功+CI流水线通过 | 构建失败必须修复 |
| 性能优化完成 | LCP≤2.5s + 首屏JS≤200KB | 性能不达标必须优化后才能上线 |

## 人类决策点

| 决策点 | 触发条件 | 决策内容 |
|--------|----------|----------|
| API契约确认 | api-contract-consume执行后 | AI消费API契约后，人类确认接口理解是否正确 |
| 部署目标选择 | frontend-build-deploy执行时 | 人类确认部署平台和环境配置 |
| 性能预算调整 | frontend-performance执行时 | 人类确认性能预算阈值是否合理 |
| Mock数据确认 | api-contract-consume执行后 | AI生成Mock数据后，人类确认Mock逻辑是否合理 |
| 性能不达标处理 | frontend-performance优化后仍不达标 | 人类决策是否接受为技术债务 |

## 异常处理

| 异常类型 | 处理策略 |
|----------|----------|
| API契约文档缺失 | 降级使用Mock数据开发，标注"缺乏API契约" |
| 构建失败 | 标注错误信息，回退修复后重新构建 |
| CI流水线不可用 | 本地构建验证，标注"CI待验证" |
| 性能优化后仍不达标 | 标注"性能待优化"，人类决策是否接受技术债务 |
| CDN配置异常 | 降级为本地静态资源，标注"CDN待配置" |

## 变更记录

- v3.0: 统一优化为编排协议+Pipeline+调用指令格式，删除调度规则，识别api-contract-consume与frontend-build-deploy可并行执行
- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
