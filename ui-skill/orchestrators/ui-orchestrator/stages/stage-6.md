# 阶段 6：生产就绪 + 优化（按需）

跳过条件：无需构建/部署

**依赖关系**：depends_on: [stage-4]；optional_depends_on: [stage-5]。阶段 5（API 集成）是可选阶段，在无后端 API 时可以跳过。当阶段 5 不执行时，阶段 6 直接消耗阶段 4 的增强代码；阶段 5 执行后，阶段 6 消耗其 API 集成输出。

**阶段合并说明**：v7.0 将原阶段 7（生产就绪）和阶段 8（生产优化）合并为一个阶段。production-ready 执行后，直接调用 ext-impeccable 进行 harden+polish+optimize。

| 输入 | 来源 |
|--------|------|
| 前端代码 | {project_dir}/src/ + output/ui-frontend/page-builder/ |
| API 集成 | output/ui-frontend-integration/api-integration/（可选，仅在阶段 5 执行后存在） |
| quality_debt | output/ui-frontend/page-builder/quality_debt.json（可选） |
| 目标框架 / 部署目标 / 目标语言 / project_dir | 在项目信息收集阶段确定 / 用户提供 |

**执行顺序**：

| # | Skill | 输入 | 输出 | 验证 | 说明 |
|---|-------|------|------|------|------|
| 6.1 | production-ready | 前端代码 + quality_debt | 构建 + 测试 + 性能 + 安全 | 构建成功 + 测试覆盖率 >=80% + LCP<=2.5s + 安全检查通过 + harden + polish 完成 | quality_debt 中的高级项必须修复 |
| 6.2 | ext-impeccable {harden\|polish} | 代码 + 构建配置（6.1） | 生产就绪增强 | harden + polish 已生成 | 表单/异步/i18n -> harden，始终 -> polish |
| 6.3 | ext-impeccable optimize | 性能报告（6.1） | UI 渲染性能优化 | 优化建议已生成 | 当性能瓶颈是网络延迟或包大小时跳过 |

[GATE] 发布决策需要人工确认
