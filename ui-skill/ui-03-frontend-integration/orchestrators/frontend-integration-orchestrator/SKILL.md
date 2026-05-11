---
name: frontend-integration-orchestrator
description: 前端集成指挥官。协调api-contract-consume、frontend-build-deploy、frontend-performance三个子Skill的完整流程，确保前端与后端联调集成和上线质量。关键词：前端集成、前后端联调、构建部署、性能优化、api-contract-consume、frontend-build-deploy、frontend-performance。
metadata:
  module: "UI设计与前端开发"
  sub-module: "前端集成"
  type: "orchestrator"
  version: "2.0"
---

# 前端集成指挥官

## 核心原则

前后端通过契约解耦，集成通过自动化保障。

## 执行步骤

1. **契约先行**：先消费API契约，再联调接口
2. **Mock开发**：后端未就绪时用Mock数据开发，就绪后无缝切换
3. **构建验证**：构建通过+测试通过才能部署
4. **性能卡口**：性能预算不通过不能上线

## 子Skill执行协议

你是编排器，你的职责是按阶段调度子Skill执行。执行每个子Skill时，你必须严格遵循以下步骤：

1. **读取子Skill定义**：读取 `对应子Skill的定义文件（阶段执行计划中"读取定义"列指定的路径）` 获取该子Skill的完整执行指令
2. **按子Skill指令执行**：严格遵循子Skill SKILL.md中的执行步骤、输入规范、输出规范和质量检查
3. **输出到指定路径**：将结果写入子Skill规定的输出路径
4. **验证输出完成**：确认输出文件已生成且符合校验规则后，再进入下一阶段
5. **传递数据给下游**：将当前子Skill的输出文件路径作为下一阶段子Skill的输入来源

**重要**：不要跳过任何子Skill，不要用自身逻辑替代子Skill的执行指令。每个子Skill必须通过读取其SKILL.md来执行。

## 阶段执行计划

### 阶段1：api-contract-consume（API契约消费）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | api-contract-consume |
| 读取定义路径 | `.trae/skills/api-contract-consume/SKILL.md` |
| 输入 | API契约文档：`output/backend-api-design/api-contract/openapi.yaml`；页面数据需求：`output/ui-frontend/page-assembly/`；目标框架（用户提供）；设计令牌：`output/ui-design-system/design-token/tokens.json`（可选） |
| 输出 | `output/ui-frontend-integration/api-contract-consume/`（TypeScript类型定义、请求函数、Mock数据、React Hook/Vue Composable、错误处理） |
| 验证 | 100%接口有类型定义 + 100%接口有Mock数据 + 错误处理覆盖401/403/500 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | API客户端代码生成完成且类型校验通过后才可进入阶段2；缺失接口标注TODO，不阻塞开发 |

### 阶段2：frontend-build-deploy（构建部署）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | frontend-build-deploy |
| 读取定义路径 | `.trae/skills/frontend-build-deploy/SKILL.md` |
| 输入 | 项目信息（用户提供）；部署目标（用户提供）；环境配置（用户提供，可选） |
| 输出 | `output/ui-frontend-integration/frontend-build-deploy/`（构建配置、环境管理、CDN策略、CI/CD流水线、监控告警） |
| 验证 | 构建成功 + CI流水线通过 |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | 构建成功+CI通过后才可进入阶段3；构建失败必须修复 |

### 阶段3：frontend-performance（性能优化）

| 项目 | 内容 |
|------|------|
| 子Skill名称 | frontend-performance |
| 读取定义路径 | `.trae/skills/frontend-performance/SKILL.md` |
| 输入 | 前端代码：`output/ui-frontend/page-assembly/` / `output/ui-frontend/ui-component-gen/`；构建产物：`output/ui-frontend-integration/frontend-build-deploy/`；性能数据（用户提供，可选） |
| 输出 | `output/ui-frontend-integration/frontend-performance/`（性能基线、瓶颈分析、优化方案、性能预算、防退化CI配置） |
| 验证 | LCP≤2.5s + 首屏JS≤200KB |
| 执行模式 | 🤖 AI自动执行 |
| ⏸ 阶段卡口 | 性能预算达标才可上线；性能不达标必须优化后才能上线 |

## 调度规则

- 每次只执行当前阶段需要的子Skill，完成后再执行下一阶段，不要一次性执行所有子Skill
- 执行子Skill前必须先读取其SKILL.md定义文件
- 每个阶段完成后，将中间结果写入 `output/ui-frontend-integration/{当前阶段子Skill名称}/` 文件，释放上下文空间
- 若上下文接近上限，优先保留当前阶段内容，将已完成阶段的输出摘要为关键结论
- 单个子Skill的输出应控制在2000字以内，超出部分写入文件

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

- v2.0: 优化为子Skill执行协议+阶段执行计划模式，增加命令式调度指令
- v1.0: 初始版本
