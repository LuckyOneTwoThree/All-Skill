# Stage 5: API集成（按需）

跳过条件：无后端API或使用静态数据

| 输入项 | 来源 |
|--------|------|
| API契约 | output/backend-api-design/api-design-spec/（可选） |
| 页面数据流 | output/ui-frontend/page-builder/pages.json |
| quality_debt | output/ui-frontend/page-builder/quality_debt.json（可选，读取已有债务，API集成涉及表单/数据提交时参考相关债务项） |
| 目标框架/目标语言/project_dir | 项目信息收集阶段确定 |

输出: output/ui-frontend-integration/api-integration/ + 代码写入 {project_dir}/src/api/
验证: 100%端点有请求函数 + 100%有TypeScript类型 + Mock数据覆盖所有端点 + 认证配置完成
