---
name: design-handoff-spec
description: 当需要将设计阶段产物交付给开发团队或生成开发交接文档时使用。开发交接摘要自动生成，整合页面清单、路由结构、功能需求和待确认项，产出面向开发的交接文档。关键词：设计交接、设计交付、Handoff、开发对接、交付文档。
metadata:
  module: "产品构思与设计"
  sub-module: "设计交付"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["互联网", "软件", "通用"]
  trigger_examples:
    - "设计稿做好了怎么交给开发"
    - "帮我生成设计交付文档"
    - "开发对接文档怎么出"
  interaction_mode: "ai_suggest_human_approve"
execution_depth:
  default: standard
  quick_description: "直接输出设计交付规格"
  deep_description: "完整规格 + 交互状态机 + 响应式断点规范 + 无障碍设计规格"
---

# 开发交接摘要自动生成

## 核心原则

1. **PM 定义产品需求，UI 决定实现方式**——交接文档只传递产品需求，不定义令牌值/组件规格/动画参数/响应式断点
2. **引用而非内联**——UI 实现细节（令牌/组件/交互/响应式）由 UI Skill 产出，交接文档引用其输出路径
3. **完整性校验**——每个页面、每个功能区域都必须覆盖
4. **可追溯**——需求来源有依据，变更可追踪

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| IA信息架构 | JSON | ○ | output/pm-design/design-ia/ia_proposals.json | 页面路由和导航需求 |
| PRD文档 | Markdown | ○ | output/pm-design/design-prd/prd.md | 产品需求参考 |
| PRD结构化数据 | JSON | ○ | output/pm-design/design-prd/prd.json | PRD机器可消费版本，供交接文档对齐 |
| 交互规范 | Markdown | ○ | output/pm-design/interaction-spec/interaction-spec.md | 交互意图和无障碍要求 |

## 执行步骤

### Step 1: 页面清单与路由映射 [核心]

基于 IA 和 PRD，生成完整的页面清单：

**页面清单**：

| 页面名称 | 路由 | 层级 | 功能区域 | 状态 |
|----------|------|------|---------|------|
| 首页 | / | L1 | 轮播/推荐列表/搜索入口 | 已定义 |
| 商品详情 | /product/:id | L2 | 商品图/规格选择/评价 | 已定义 |
| 购物车 | /cart | L2 | 商品列表/总价/结算 | 已定义 |
| 结算页 | /checkout | L3 | 收货地址/支付方式/确认 | 待定义 |

**路由结构**（来自 ia_proposals.json 的 routes）：

```
/                    → 首页
/product/:id         → 商品详情
/cart                → 购物车
/checkout            → 结算页
/checkout/success    → 支付成功
/profile             → 个人中心
```

### Step 2: 功能需求摘要 [核心]

基于 PRD，提取每个页面的功能需求：

| 页面 | 功能需求 | 交互意图 | 异常场景 |
|------|---------|---------|---------|
| 首页 | 展示推荐内容、搜索入口 | 下拉刷新需有反馈 | 网络错误/空推荐 |
| 商品详情 | 展示商品信息、加入购物车 | 加入购物车需有确认反馈 | 商品下架/库存不足 |
| 购物车 | 管理购物车商品 | 删除需确认/数量调整即时生效 | 空购物车/价格变动 |
| 结算页 | 填写收货信息、选择支付 | 表单验证需实时反馈 | 地址无效/支付失败 |

### Step 3: 数据绑定与API消费映射 [核心]

基于 PRD 的 pages[].data_requirements 和 entities[]，生成每个页面的数据绑定和API消费清单：

**页面数据绑定表**：

| 页面 | 数据需求 | 关联实体 | 数据操作 | 所需字段 | 数据来源 |
|------|---------|---------|---------|---------|---------|
| 首页 | 推荐课程列表 | Course | read | id,title,cover,price,rating | API |
| 商品详情 | 课程详情 | Course | read | id,title,description,price,syllabus | API |
| 购物车 | 购物车列表 | CartItem | read,update,delete | id,course_id,quantity,price | API |
| 结算页 | 创建订单 | Order | create | items[],total,address_id,payment_method | API |

**API消费清单**（供 api-integration Skill 消费）：

| API操作 | 方法 | 路径（建议） | 消费页面 | 关联实体 |
|---------|------|------------|---------|---------|
| 获取推荐课程 | GET | /courses/recommended | 首页 | Course |
| 获取课程详情 | GET | /courses/:id | 商品详情 | Course |
| 获取购物车 | GET | /cart | 购物车 | CartItem |
| 更新购物车 | PUT | /cart/items/:id | 购物车 | CartItem |
| 创建订单 | POST | /orders | 结算页 | Order |

> 注：API路径为建议值，最终路径由 api-design-spec 确定。此清单的目的是让 UI 和 Backend 在设计阶段就对齐数据消费需求。

**状态管理需求**：

| 全局状态 | 类型 | 消费页面 | 数据来源 |
|----------|------|---------|---------|
| 用户信息 | 全局 | 所有页面 | API (GET /user/profile) |
| 购物车数量 | 全局 | 导航栏+购物车页 | API (GET /cart/count) |
| 认证Token | 全局 | 所有需认证页面 | 登录接口 |

### Step 4: UI 产出引用 [核心]

引用 UI Skill 的产出路径，不内联定义 UI 实现细节：

| UI 产出 | 来源路径 | 说明 |
|---------|---------|------|
| 设计令牌 | output/ui-project-init/project-init.json → tokens | 颜色/字体/间距/阴影/圆角 |
| 组件库 | output/ui-project-init/project-init.json → component_library | 可复用组件清单和主题定制 |
| 视觉方向 | output/ui-project-init/project-init.json → visual_direction | 美学方向/色彩策略/视觉禁忌 |
| 页面组件 | output/ui-frontend/page-builder/ | 页面组件代码和交互实现 |
| 交互实现 | ext-interaction-design 产出 | 动画令牌/交互模式/无障碍适配 |
| 响应式适配 | page-builder 产出 | 响应式断点和适配方案 |

> 注：以上路径为 UI Skill 执行后的产出位置。若 UI Skill 尚未执行，标注"待 UI Skill 产出"。

### Step 5: 待确认项与开放问题 [核心]

**待确认项**：

| 编号 | 问题 | 影响范围 | 负责人 | 状态 |
|------|------|---------|--------|------|
| Q1 | 首页推荐算法是否需要个性化 | 首页数据层 | 后端 | 待确认 |
| Q2 | 购物车商品数量上限 | 购物车交互 | PM | 待确认 |

**开放问题**：

| 编号 | 问题 | 影响范围 | 状态 |
|------|------|---------|------|
| O1 | 是否需要离线模式 | 全局交互 | Open |

### Step 6: 文档组装 [核心]

**交接文档结构**：

```
# {产品名}开发交接摘要

## 1. 概述
### 1.1 项目信息
### 1.2 产出文件索引

## 2. 页面清单与路由
### 2.1 路由结构
### 2.2 页面清单

## 3. 功能需求摘要
### 3.1 逐页面功能需求
### 3.2 交互意图
### 3.3 异常场景

## 4. 数据绑定与API消费
### 4.1 页面数据绑定表
### 4.2 API消费清单
### 4.3 状态管理需求

## 5. UI 产出引用
### 5.1 设计令牌引用
### 5.2 组件库引用
### 5.3 视觉方向引用
### 5.4 交互实现引用
### 5.5 响应式适配引用

## 6. 待确认项
## 7. 开放问题

## 附录
- 变更记录
```

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | 设计交付规格 | 核心结论 + 最小可行产物 |
| standard | 完整产物（当前默认） | 完整产物，包含全部Step输出 |
| deep | 完整规格 + 交互状态机 + 响应式断点规范 + 无障碍设计规格 | 完整产物 + 扩展分析 + 深度推演 |

## 输出

**存储路径**：`output/pm-design/design-handoff-spec/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| design-handoff-spec.md | Markdown | 完整开发交接摘要 |
| design-handoff-spec.json | JSON | 结构化数据 |

**design-handoff-spec.json 结构**：

```json
{
  "project_info": {
    "product": "产品名",
    "version": "1.0"
  },
  "pages": [
    {
      "name": "页面名",
      "route": "/path",
      "level": "L1/L2/L3",
      "functional_areas": [],
      "status": "已定义/待定义"
    }
  ],
  "routes": [],
  "functional_requirements": [
    {
      "page": "页面名",
      "requirements": [],
      "interaction_intents": [],
      "error_scenarios": []
    }
  ],
  "data_bindings": [
    {
      "page": "页面名",
      "data_name": "数据需求名",
      "related_entity": "entity_id",
      "data_operations": ["read | create | update | delete"],
      "required_fields": [],
      "data_source": "api | local | cache"
    }
  ],
  "api_consumption": [
    {
      "operation": "操作描述",
      "method": "GET | POST | PUT | DELETE",
      "suggested_path": "建议路径",
      "consuming_pages": [],
      "related_entity": "entity_id"
    }
  ],
  "state_management": [
    {
      "state_name": "状态名",
      "scope": "global | page | component",
      "consuming_pages": [],
      "data_source": "数据来源描述"
    }
  ],
  "ui_output_references": {
    "design_tokens": "output/ui-project-init/project-init.json → tokens",
    "component_library": "output/ui-project-init/project-init.json → component_library",
    "visual_direction": "output/ui-project-init/project-init.json → visual_direction",
    "page_components": "output/ui-frontend/page-builder/",
    "interaction_implementation": "ext-interaction-design 产出",
    "responsive_adaptation": "page-builder 产出"
  },
  "open_questions": []
}
```

**输出校验规则**：详见下方输出校验规则章节

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| project_info.product | string | 是 | 产品名称 |
| project_info.version | string | 是 | 文档版本号 |
| pages | array | 是 | 页面清单，不可为空 |
| pages[].name | string | 是 | 页面名称 |
| pages[].route | string | 是 | 页面路由 |
| pages[].level | string | 是 | 页面层级（L1/L2/L3） |
| pages[].functional_areas | array | 是 | 功能区域列表 |
| pages[].status | string | 是 | 定义状态 |
| routes | array | 是 | 路由结构 |
| functional_requirements | array | 是 | 功能需求摘要 |
| functional_requirements[].page | string | 是 | 页面名称 |
| functional_requirements[].requirements | array | 是 | 功能需求列表 |
| functional_requirements[].interaction_intents | array | 是 | 交互意图列表 |
| functional_requirements[].error_scenarios | array | 是 | 异常场景列表 |
| ui_output_references | object | 是 | UI 产出引用 |
| open_questions | array | 是 | 待确认项 |

## 决策规则

| 条件 | 决策 |
|------|------|
| IA缺失 | 页面清单基于PRD推导，标注"缺乏IA验证" |
| PRD缺失 | 功能需求基于IA和用户描述推导，标注"缺乏PRD验证" |
| 交互规范缺失 | 交互意图基于PRD推导，标注"缺乏交互规范验证" |
| UI Skill 尚未执行 | ui_output_references 标注"待 UI Skill 产出" |

## 质量检查

### P0 检查（quick/standard/deep 都必须通过）

- [ ] 页面清单与路由完整
- [ ] 每个页面有功能需求摘要

### P1 检查（standard/deep 必须通过）

- [ ] 每个页面有交互意图和异常场景
- [ ] 每个页面有数据绑定和API消费映射
- [ ] API消费清单覆盖所有页面的数据需求
- [ ] 全局状态管理需求已识别
- [ ] UI 产出引用路径正确
- [ ] 待确认项已列出

### P2 检查（仅 deep 必须通过）

- [ ] 扩展分析完整（深度推演和路线图已生成）
- [ ] 决策记录完整（关键决策有依据和替代方案）

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 | 数据获取说明 |
|---------------|---------|---------|------------|
| IA缺失 | 页面清单基于PRD推导 | 路由结构可能不完整 | 要求用户提供页面结构和导航描述或上传IA方案文件 |
| PRD缺失 | 功能需求基于IA推导 | 功能需求可能不够完整 | 要求用户提供功能需求描述或上传prd.json文件 |
| 交互规范缺失 | 交互意图基于PRD推导 | 交互意图可能不够细致 | 要求用户提供交互规范描述或上传交互设计文件 |
| IA+PRD均缺失 | 基于用户描述推导 | 整体置信度降低 | 要求用户提供功能需求和页面结构描述 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| IA结构变更（路由/导航调整） | 页面清单、路由结构 | 标注受影响的路由和页面，建议人类确认是否更新路由映射 |
| PRD需求变更（功能增删） | 功能需求摘要、交互意图、异常场景 | 标注受影响的功能点，建议人类确认是否更新交接范围 |
| 交互规范变更 | 交互意图、异常场景 | 标注受影响的交互意图，建议人类确认是否更新 |

### 下游通知机制

| 交接文档变更类型 | 通知范围 | 通知方式 |
|-----------------|----------|----------|
| 页面/路由变更 | 开发团队、测试团队 | 标记变更影响范围，触发路由和页面结构重新确认 |
| 功能需求变更 | 开发团队、测试团队 | 标记需求变更，触发功能实现和测试用例更新 |
| 交互意图变更 | 开发团队 | 标记交互变更，触发交互实现更新 |
