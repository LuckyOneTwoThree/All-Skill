# 阶段 5：API 集成（按需）

跳过条件：无后端 API 或使用静态数据

**依赖关系**：depends_on: [stage-4]。阶段 5 必须在阶段 4 完成后执行，原因：
1. 阶段 4 的质量审计（audit+critique）确保页面代码质量达标（quality_score≥75），API 集成基于稳定代码进行，避免在低质量代码上叠加请求层
2. 阶段 4 的修复闭环可能修改页面结构和数据流，API 集成必须基于修复后的 pages.json
3. 阶段 4 的 quality_debt.json 包含与表单/数据提交相关的债务项，API 集成需引用并解决这些债务

## 与阶段 4 的数据衔接

**上游输入消耗**：

| 上游产出 | 消耗方式 | 衔接规则 |
|----------|---------|---------|
| pages.json（阶段 4 修复后） | 提取 data_flow 字段作为 API 端点推断依据 | 若阶段 4 修复闭环修改了页面数据流，必须使用修复后的版本 |
| quality_debt.json（阶段 4） | 读取与表单提交、数据获取相关的债务项 | 表单相关债务（severity≥medium）必须在 API 集成中解决；已解决的债务标记 status: "resolved_by_api_integration" |
| {project_dir}/src/api/（page-builder fallback） | 定位并替换 fallback 数据层 | 替换规则见下方"fallback 数据层替换" |

**fallback 数据层替换**：

当阶段 3 的 page-builder 因跳过 api-integration 而生成了 fallback 数据层时（pages.json 中 `api_integration_skipped: true`），阶段 5 必须执行替换流程：

| 替换步骤 | 操作 | 验证 |
|----------|------|------|
| 1. 定位 fallback 文件 | 扫描 `// @api-integration: 待 api-integration 替换` 注释标注的文件 | 所有 fallback 文件已定位 |
| 2. 替换请求函数 | 用 api-integration 生成的真实请求函数替换 fallback 异步函数，保持函数签名一致 | 函数签名不变，调用方无需修改 |
| 3. 保留类型定义 | 保留 fallback 中的 types.ts，仅补充 API 契约推导的扩展类型 | 类型兼容，无破坏性变更 |
| 4. 替换 Mock 数据 | 用契约生成的 Mock 数据替换 fallback 静态数据 | Mock 数据覆盖所有端点 |
| 5. 清理标记 | 删除 `@api-integration` 注释和 `api_integration_skipped` 标记 | 无残留 fallback 标记 |

## Skill 调用依赖图

```
5.1 api-integration（Step 1: 契约解析+端点规划）───> 5.2 api-integration（Step 2: 客户端代码生成）───> 5.3 api-integration（Step 3: Mock数据+并行开发）───> 5.4 api-integration（Step 4: 数据层对接+缓存策略）───> 5.5 质量验证
                                                                                                                                                                      │
                                                                                          5.0 认证方案确认（若推断或缺失）────────────────────────────────────────────────────────────┘
```

| # | Skill 调用 | 输入 | 输出 | 验证 | 依赖 | 说明 |
|---|-----------|------|------|------|------|------|
| 5.0 | 认证方案确认 | auth-scheme.json（可选）+ PRD 非功能需求 + 用户输入 | 确认的认证方案 | 认证方案已确定 | 无 | 若 auth-scheme.json 存在直接采用；缺失时按选择逻辑推断，需人类确认 |
| 5.1 | api-integration Step 1 | API 契约（可选）+ pages.json data_flow | 端点列表 + 目录规划 + 推断报告（如有推断端点） | 端点列表非空 | 5.0 | 契约缺失时触发推断流程，推断端点需人类确认 |
| 5.2 | api-integration Step 2 | 端点列表（5.1）+ 认证方案（5.0）+ 目标框架 | 请求函数 + 类型定义 + 拦截器 + 错误处理 | 100% 端点有请求函数 + 零 any 类型 | 5.1 | 拦截器包含 token 注入 + 错误处理 + 响应解包 |
| 5.3 | api-integration Step 3 | 端点列表（5.1）+ 类型定义（5.2）+ 目标语言 | Mock 数据 + MSW handler + 切换机制 | Mock 数据覆盖所有端点 | 5.2 | 目标语言≠en-US 时 Mock 数据使用目标语言内容 |
| 5.4 | api-integration Step 4 | 请求函数（5.2）+ pages.json 数据流 + 目标框架 | 数据 Hook + 缓存策略 + 乐观更新 + fallback 替换 | 缓存策略≥3种数据类型 + fallback 已替换 | 5.3 | 替换 page-builder 的 fallback 数据层 |
| 5.5 | 质量验证 | api-integration 全部输出 | 质量验证结果 | 见质量门禁 | 5.4 | P0 不通过则阻断，回到 5.2 修复 |

## 认证方案规划

**认证方案选择逻辑**（编排器层面调度，具体实现由 api-integration 执行）：

| 优先级 | 判断条件 | 认证方案 | 说明 |
|--------|---------|---------|------|
| 1 | auth-scheme.json 存在 | 采用 auth-scheme.json 定义的方案 | 后端 API 设计的认证鉴权方案为权威来源 |
| 2 | API 契约中包含 security schemes | 从契约提取认证方案 | OpenAPI security 字段 |
| 3 | PRD 非功能需求明确指定 | 采用 PRD 指定方案 | 如"需要 OAuth2 登录" |
| 4 | 用户显式指定 | 采用用户指定方案 | 交互确认 |
| 5 | 以上均缺失 | 默认 JWT，标注"待确认认证方案" | 降级策略，需人类确认 |

**认证方案与实现策略映射**：

| 认证方案 | 前端实现策略 | Token 存储 | 刷新机制 | 编排器关注点 |
|---------|------------|-----------|---------|------------|
| JWT | axios 拦截器自动注入 Authorization 头 | localStorage + 内存缓存 | 过期前 5 分钟自动刷新，并发请求队列等待 | 确认刷新端点可用 |
| OAuth2 | 授权码流程 + PKCE | localStorage + 内存缓存 | 使用 refresh_token 刷新 | 确认回调 URL 配置 |
| Cookie | withCredentials 配置 | 浏览器自动管理 | 依赖后端 session 续期 | 确认 CORS 配置允许凭证 |
| ApiKey | 请求头/查询参数注入 | 环境变量 | 无自动刷新 | 确认 API Key 安全存储 |
| None | 无认证 | — | — | 确认无需认证的端点确实为公开接口 |

## 与阶段 6 的数据衔接

**下游输出传递**：

| 阶段 5 输出 | 传递给阶段 6 的方式 | 阶段 6 消耗规则 |
|------------|-------------------|----------------|
| api-integration.json（元数据） | output/ui-frontend-integration/api-integration/ | production-ready 读取 endpoints/types/auth_config 用于测试生成和构建配置 |
| {project_dir}/src/api/（代码） | 直接写入项目目录 | production-ready 将 API 代码纳入构建和测试范围 |
| quality_debt.json 更新 | 追加 API 集成相关债务 | production-ready 必须修复 severity≥high 的债务项 |
| fallback 替换记录 | 记录在 api-integration.json | production-ready 验证无残留 fallback 标记 |

**阶段 6 对阶段 5 的可选依赖**：

阶段 6 的 `optional_depends_on: [stage-5]` 意味着：
- 阶段 5 执行时：阶段 6 消耗 API 集成输出，测试覆盖包含 API 层
- 阶段 5 跳过时：阶段 6 直接消耗阶段 4 的增强代码，测试覆盖不包含 API 层，但需验证 fallback 数据层可正常工作

## 降级策略

**API 契约缺失时的推断流程**：

```
pages.json data_flow ──> 提取 source 字段 ──> 映射为 API 端点 ──> 标注 inferred:true ──> 生成推断报告 ──> 人类确认
```

| 推断步骤 | 操作 | 输出 |
|---------|------|------|
| 1. 数据流提取 | 从 pages.json 的每个页面提取 data_flow.source | 原始数据源列表 |
| 2. 端点映射 | 将 source 映射为 RESTful 端点（GET/POST/PUT/DELETE） | 推断端点列表 |
| 3. 参数推断 | 从 data_flow.params 和页面表单字段推断请求参数 | 推断参数列表 |
| 4. 响应推断 | 从页面展示的数据结构推断响应类型 | 推断响应类型 |
| 5. 报告生成 | 汇总所有推断端点，标注推断依据 | 推断报告（含推断依据和置信度） |

**推断端点确认机制**：

| 确认场景 | 确认方式 | 未确认处理 |
|---------|---------|-----------|
| 推断端点≤5 个 | 逐个确认，用户可修改 method/path/参数 | 未确认端点不生成请求函数 |
| 推断端点 6-20 个 | 批量确认，用户可勾选/修改 | 未确认端点不生成请求函数 |
| 推断端点>20 个 | 按模块分组确认，用户可按模块批量操作 | 未确认模块不生成请求函数 |
| 推断端点>50% | 额外警告"高推断比例，建议补充 API 契约" | 标注为高风险，quality_debt 记录 |

**其他降级场景**：

| 缺失的上游输入 | 降级方案 | 输出影响 | quality_debt 记录 |
|---------------|---------|---------|------------------|
| API 契约缺失 | 基于页面数据流推断，推断端点需人类确认 | API 函数为骨架，需补充契约细节 | severity: medium，"API 契约缺失，使用推断端点" |
| 页面数据流缺失 | 为所有 API 端点生成独立函数，无页面级预加载 | 缺少页面级数据预加载和缓存配置 | severity: medium，"页面数据流缺失，无预加载配置" |
| 认证方案缺失 | 默认 JWT，标注"待确认认证方案" | token 刷新逻辑可能需调整 | severity: low，"认证方案待确认" |
| 安全策略缺失 | 跳过安全策略对齐，标注"待安全策略补充" | CORS/限流等前端安全策略未对齐 | severity: low，"安全策略待补充" |
| auth-scheme.json 缺失 | 使用 PRD 非功能需求或默认 JWT | 认证实现可能需调整 | severity: low，"auth-scheme 缺失，使用降级认证方案" |

## 质量门禁

**P0（必须通过，不通过则阻断输出）**：

| 检查项 | 通过标准 | 不通过处理 |
|--------|---------|-----------|
| 端点覆盖率 | 100% 的 API 端点有对应的请求函数 | 回到 5.2 补充缺失端点 |
| 类型安全 | 100% 的请求参数和响应有 TypeScript 类型（零 any） | 回到 5.2 修复类型定义 |
| 认证配置 | 认证方案已配置（token 注入 + 刷新 + 过期处理） | 回到 5.0 确认认证方案 + 5.2 补充配置 |
| 拦截器完整性 | 拦截器配置完整（token 注入 + 错误处理 + 响应解包） | 回到 5.2 补充拦截器 |
| API 代码质量 | API 代码质量审计≥70 分（由编排器调用 ext-impeccable audit） | 回到 5.2 修复质量问题 |

**P1（建议通过，不通过则标注"待修复"并记录到 quality_debt）**：

| 检查项 | 通过标准 | 不通过处理 |
|--------|---------|-----------|
| 错误处理 | 每个 API 调用有错误处理和超时配置 | 标注"待修复"，记录 quality_debt |
| Mock 覆盖 | Mock 数据覆盖所有端点 | 标注"待修复"，记录 quality_debt |
| 缓存策略 | 缓存策略已配置（至少 3 种数据类型） | 标注"待修复"，记录 quality_debt |
| 乐观更新 | 乐观更新已配置（写操作） | 标注"待修复"，记录 quality_debt |
| 推断端点确认 | 推断端点已人类确认 | 标注"待确认"，阻断该端点的请求函数生成 |

**综合质量评分**（可选，当 ext-impeccable 可用时）：

| 评分维度 | 权重 | 评估内容 |
|----------|------|---------|
| API 代码质量（ext-impeccable audit） | 60% | 类型安全/错误处理/拦截器/认证/反模式 |
| API 设计品味（ext-impeccable critique） | 40% | 接口命名一致性/模块划分合理性/缓存策略适当性 |

质量评分≥70 为通过；<70 时最多 2 次修复迭代（少于阶段 4 的 3 次，因为 API 集成代码结构更规范、问题更集中）。

## 上游变更响应

**API 契约变更处理**：

| 变更类型 | 影响范围 | 编排器响应 | 需重新执行的步骤 |
|---------|---------|-----------|----------------|
| 端点增删 | 请求函数、类型定义、Mock 数据 | 标注受影响端点，建议重新生成 | 5.1 → 5.2 → 5.3 → 5.4 |
| 参数变更 | 请求类型、请求函数 | 标注受影响的请求函数和类型 | 5.2 → 5.3 |
| 响应结构变更 | 响应类型、Mock 数据、缓存策略 | 标注受影响的类型和 Mock 数据 | 5.2 → 5.3 → 5.4 |
| 认证方案变更 | 拦截器、token 管理、错误处理 | 标注需替换的认证基础设施 | 5.0 → 5.2 |
| 废弃端点标记 | 请求函数标注 deprecated | 保留函数但标注 deprecated，不删除 | 5.2 |

**页面数据流变更处理**（阶段 4 修复闭环导致）：

| 变更类型 | 影响范围 | 编排器响应 |
|---------|---------|-----------|
| 新增数据获取需求 | 新增 API 端点 | 从 5.1 开始补充新增端点 |
| 数据获取方式变更 | 请求函数、缓存策略 | 标注受影响的请求函数，建议更新 |
| 表单提交变更 | 请求函数、错误处理 | 标注受影响的写操作端点 |

**下游通知**（阶段 5 输出变更时通知阶段 6）：

| 本阶段输出变更 | 通知阶段 6 的内容 | 触发条件 |
|--------------|-----------------|---------|
| API 端点增删 | 受影响的测试和构建配置 | endpoints 列表变更 |
| 类型定义变更 | 受影响的类型相关测试 | types 结构变更 |
| Mock 数据变更 | 受影响的测试 Mock | mock_data 文件变更 |
| 认证配置变更 | 认证相关测试和依赖变更 | auth_config 变更 |
| 缓存策略变更 | 数据层相关测试变更 | cache_config 变更 |

## quality_debt 管理规则

**债务写入**：

| 触发条件 | 债务格式 | severity |
|---------|---------|----------|
| API 契约缺失，使用推断端点 | `{id, stage: "stage-5", description: "API 契约缺失，使用推断端点（{N}个），需补充契约后重新生成", severity: "medium", status: "applied"}` | medium |
| 认证方案待确认 | `{id, stage: "stage-5", description: "认证方案待确认，当前使用默认 JWT", severity: "low", status: "applied"}` | low |
| P1 检查未通过 | `{id, stage: "stage-5", description: "P1 检查未通过：{具体检查项}", severity: "low", status: "pending"}` | low |
| 推断端点>50% | `{id, stage: "stage-5", description: "高推断比例（{X}%），建议补充 API 契约", severity: "high", status: "applied"}` | high |

**债务解决**：

| 上游债务来源 | 解决方式 | 状态更新 |
|------------|---------|---------|
| 阶段 4 的表单/数据提交债务 | API 集成生成对应的请求函数和错误处理 | `status: "resolved_by_api_integration"` |
| 阶段 3 的 fallback 数据层债务 | fallback 替换为真实 API 调用 | `status: "resolved_by_api_integration"` |
