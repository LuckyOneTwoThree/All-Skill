# All-Skill 路线图

本文件列出计划中但尚未实现的 Skill 和领域扩展方向。欢迎认领！

## 认领方式

1. 在对应条目下留言认领，或创建 [New Skill Issue](https://github.com/LuckyOneTwoThree/All-Skill/issues/new?template=new-skill.yml)
2. 认领后维护者会将条目标记为"进行中"
3. 完成后提交 PR，合并后标记为"已完成"

---

## PM 领域

### 新模块提案

| 模块 | 说明 | 状态 |
|------|------|------|
| pm-10-ai-product | AI 原生产品设计：Prompt 设计、AI 交互范式、幻觉防护、人机协作模式 | 💡 提案中 |
| pm-11-data-privacy | 数据隐私与合规设计：GDPR/CCPA 合规、数据最小化、用户同意管理 | 💡 提案中 |
| pm-12-accessibility | 无障碍产品设计：WCAG 合规、辅助技术适配、包容性设计审计 | 💡 提案中 |

### 现有模块 Skill 补充

| 所属模块 | Skill 名称 | 说明 | 状态 |
|----------|-----------|------|------|
| pm-01-discovery | insight-impact-mapping | 影响地图：从业务目标到交付物的可视化映射 | 💡 提案中 |
| pm-01-discovery | user-research-diary-study | 日记研究：用户长期行为追踪与模式识别 | 💡 提案中 |
| pm-02-strategy | planning-scenario | 情景规划：多未来场景下的战略弹性设计 | 💡 提案中 |
| pm-03-design | design-accessibility-audit | 无障碍审计：基于 WCAG 的设计阶段无障碍检查 | 💡 提案中 |
| pm-05-development | development-api-mock | API Mock 生成：基于 OpenAPI 契约自动生成 Mock 服务 | 💡 提案中 |
| pm-07-growth | growth-referral | 推荐裂变：推荐系统设计与病毒系数优化 | 💡 提案中 |
| pm-08-monitoring | monitoring-sla | SLA 监控：服务等级协议监控与告警 | 💡 提案中 |

---

## UI 领域

### 新模块提案

| 模块 | 说明 | 状态 |
|------|------|------|
| ui-04-motion-design | 动效设计：动效语言、转场规范、微交互模式库 | 💡 提案中 |
| ui-05-design-ops | 设计运维：设计版本管理、跨团队同步、设计 Debt 治理 | 💡 提案中 |

### 现有模块 Skill 补充

| 所属模块 | Skill 名称 | 说明 | 状态 |
|----------|-----------|------|------|
| ui-01-design-system | design-token-dark-mode | 暗色模式：基于亮色令牌自动推导暗色方案 | 💡 提案中 |
| ui-02-ui-frontend | ui-responsive-adapt | 响应式适配：多端自适应布局与断点策略 | 💡 提案中 |
| ui-03-frontend-integration | frontend-error-boundary | 前端错误边界：异常捕获、降级渲染与用户反馈 | 💡 提案中 |

---

## Backend 领域

### 新模块提案

| 模块 | 说明 | 状态 |
|------|------|------|
| backend-04-observability | 可观测性设计：日志、指标、链路追踪三位一体 | 💡 提案中 |
| backend-05-messaging | 消息与事件架构：消息队列、事件驱动、异步编排 | 💡 提案中 |

### 现有模块 Skill 补充

| 所属模块 | Skill 名称 | 说明 | 状态 |
|----------|-----------|------|------|
| backend-01-api-design | api-rate-limiting | 限流策略：令牌桶/漏桶/滑动窗口策略设计 | 💡 提案中 |
| backend-02-data-architecture | data-search | 搜索引擎设计：全文检索、索引策略、相关性排序 | 💡 提案中 |
| backend-03-backend-architecture | architecture-circuit-breaker | 熔断降级：熔断器模式、降级策略、限流隔离 | 💡 提案中 |

---

## 新领域提案

| 领域 | 说明 | 状态 |
|------|------|------|
| devops-skill | DevOps 与基础设施：CI/CD 流水线设计、容器编排、基础设施即代码、监控告警 | 💡 提案中 |
| data-skill | 数据工程与分析：数据管道设计、ETL 编排、数据质量治理、数据仓库建模 | 💡 提案中 |
| security-skill | 安全工程：威胁建模、渗透测试、安全审计、合规检查 | 💡 提案中 |
| ai-skill | AI 工程化：模型评估、Prompt 工程、RAG 架构、AI 安全与对齐 | 💡 提案中 |

---

## Good First Issue

以下任务门槛较低，适合首次贡献者：

| 任务 | 类型 | 说明 |
|------|------|------|
| 补全 Skill 的 Input JSON 示例 | improve-skill | 部分 Skill 缺少 Input JSON 示例结构，可参照标杆 Skill 补全 |
| 补全 Skill 的降级策略 | improve-skill | 部分 Skill 的降级策略较简略，可补充更多降级场景 |
| 翻译 Skill 为英文版 | translation | 为现有 Skill 创建英文版 SKILL_en.md |
| 补充真实案例到输出示例 | improve-skill | 用更贴近真实场景的数据替换模板化示例 |

---

## 状态说明

| 图标 | 含义 |
|------|------|
| 💡 提案中 | 已有人提议，等待讨论确认 |
| 🔍 设计中 | 已认领，正在设计 Skill 结构 |
| 🚧 开发中 | 正在编写 SKILL.md |
| ✅ 已完成 | 已合并到主分支 |
