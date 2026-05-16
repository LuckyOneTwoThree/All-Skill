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
| product-launch-orchestrator | 产品启动总指挥 | 从0到1做新产品（SaaS/C端/移动端） | insight / market / business / positioning / design / metrics / api-design / data-architecture / backend-architecture / ui / quality / release / retrospective |
| product-iteration-orchestrator | 产品迭代总指挥 | 已有产品的功能迭代优化 | requirements / design / api-design / data-architecture / backend-architecture / ui / quality / release |

## 跨领域数据契约

| 契约 | 生产方 | 消费方 | 传递路径 |
|------|--------|--------|----------|
| PRD | PM → design-orchestrator | Backend → api-design-orchestrator / UI → ui-orchestrator | PM → Backend + UI |
| 定位陈述 | PM → positioning-orchestrator | UI → ui-orchestrator（品牌基因） | PM → UI |
| IA/原型/交互规格 | PM → design-orchestrator | UI → ui-orchestrator | PM → UI |
| API契约 | Backend → api-design-orchestrator | UI → ui-orchestrator（前端联调） | Backend → UI |
| 设计令牌+组件库 | UI → ui-orchestrator | UI → ui-orchestrator | UI内部 |
| 目标语言 | 用户指定（默认zh-CN） | UI → ui-orchestrator | 全链路传递 |
| design_feedback.json | UI → ui-orchestrator | PM → design-orchestrator | UI → PM（反向反馈） |
| constraint_review.json | UI → ui-orchestrator（Stage 1 条件分支） | PM → design-orchestrator | UI → PM（约束审查） |
| design_brief.json | UI → ui-orchestrator（Stage 2） | UI → page-builder | UI内部（ext产出→可执行规范） |
| page_manifest.json | UI → ui-orchestrator（Stage 2 预生成，Stage 3 校验） | UI → page-builder | UI内部（页面清单校验，防止页面遗漏） |
| quality_debt.json | UI → page-builder + stage-4 ext增强 | UI → production-ready | UI内部（质量债务传递） |

**双向反馈闭环**：UI→PM 反向反馈通道（design_feedback.json + constraint_review.json），设计侧可反向约束PM产出，确保设计自由度不被过度约束。
