# 跨领域编排器

跨领域编排器协调 PM、UI、Backend 三大领域的编排器执行顺序和数据传递，解决跨领域协作的编排问题。

## 定位

三大领域各自有领域内编排器，但以下场景需要跨领域协调：

- **产品启动**：从0到1做新产品，需要 PM→Backend+UI→集成→交付 的全流程协调
- **产品迭代**：已有产品的功能迭代，需要根据变更影响范围协调多个领域

跨领域编排器不替代领域内编排器，而是**调度领域编排器**，管理跨领域的数据契约传递和阶段卡口。

## 编排器清单（2个）

本模块不包含 Pipeline Skill，仅包含编排器。

| 编排器 | 定位 | 适用场景 | 调度的子编排器 |
|--------|------|----------|--------------|
| product-launch-orchestrator | 产品启动总指挥 | 从0到1做新产品（SaaS/C端/移动端） | insight / market / business / positioning / design / metrics / api-design / data-architecture / backend-architecture / design-system / ui-frontend / frontend-integration / quality / release / retrospective |
| product-iteration-orchestrator | 产品迭代总指挥 | 已有产品的功能迭代优化 | requirements / design / api-design / data-architecture / backend-architecture / design-system / ui-frontend / frontend-integration / quality / release |

## 跨领域数据契约

| 契约 | 生产方 | 消费方 | 传递路径 |
|------|--------|--------|----------|
| PRD | PM → design-orchestrator | Backend → api-design-orchestrator / UI → design-system-orchestrator + ui-frontend-orchestrator | PM → Backend + UI |
| 定位陈述 | PM → positioning-orchestrator | UI → design-system-orchestrator（品牌基因） | PM → UI |
| IA/原型/交互规格 | PM → design-orchestrator | UI → ui-frontend-orchestrator | PM → UI |
| API契约 | Backend → api-design-orchestrator | UI → frontend-integration-orchestrator（前端联调） | Backend → UI |
| 设计令牌+组件库 | UI → design-system-orchestrator | UI → ui-frontend-orchestrator | UI内部 |
