# Stage 6: 生产就绪+优化（按需）

跳过条件：无需构建部署

**阶段合并说明**：v7.0 将原 Stage 7（生产就绪）和 Stage 8（生产优化）合并为一个阶段，production-ready 执行后直接调用 ext-impeccable 进行 harden+polish+optimize。

| 输入项 | 来源 |
|--------|------|
| 前端代码 | {project_dir}/src/ + output/ui-frontend/page-builder/ |
| API集成 | output/ui-frontend-integration/api-integration/（可选） |
| quality_debt | output/ui-frontend/page-builder/quality_debt.json（可选） |
| 目标框架/部署目标/目标语言/project_dir | 项目信息收集阶段确定 / 用户提供 |

**执行顺序**：

| # | Skill | 输入 | 输出 | 验证 | 备注 |
|---|-------|------|------|------|------|
| 6.1 | production-ready | 前端代码+quality_debt | 构建+测试+性能+安全 | 构建成功+测试覆盖率≥80%+LCP≤2.5s+安全检查通过 | quality_debt中critical级必须修复 |
| 6.2 | ext-impeccable {harden\|polish} | 代码+构建配置 (6.1) | 生产就绪化增强 | harden+polish已生成 | 有表单/异步/i18n→harden，始终→polish |
| 6.3 | ext-impeccable optimize | 性能报告 (6.1) | UI渲染性能优化 | 优化建议已生成 | 性能瓶颈为网络延迟或包体积时跳过 |

⏸ 人类确认发布决策
