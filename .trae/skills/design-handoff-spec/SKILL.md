---
name: design-handoff-spec
description: 当设计阶段完成需要交付给开发团队时使用。开发交接摘要自动生成，整合页面清单、路由结构、功能需求和待确认项，产出面向开发的交接文档。关键词：设计交接、设计交付、Handoff、开发对接、交付文档。
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
| 交互规范 | Markdown | ○ | output/pm-design/design-interaction-spec/interaction_spec.md | 交互意图和无障碍要求 |

## 执行步骤

### Step 1: 页面清单与路由映射

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

### Step 2: 功能需求摘要

基于 PRD，提取每个页面的功能需求：

| 页面 | 功能需求 | 交互意图 | 异常场景 |
|------|---------|---------|---------|
| 首页 | 展示推荐内容、搜索入口 | 下拉刷新需有反馈 | 网络错误/空推荐 |
| 商品详情 | 展示商品信息、加入购物车 | 加入购物车需有确认反馈 | 商品下架/库存不足 |
| 购物车 | 管理购物车商品 | 删除需确认/数量调整即时生效 | 空购物车/价格变动 |
| 结算页 | 填写收货信息、选择支付 | 表单验证需实时反馈 | 地址无效/支付失败 |

### Step 3: UI 产出引用

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

### Step 4: 待确认项与开放问题

**待确认项**：

| 编号 | 问题 | 影响范围 | 负责人 | 状态 |
|------|------|---------|--------|------|
| Q1 | 首页推荐算法是否需要个性化 | 首页数据层 | 后端 | 待确认 |
| Q2 | 购物车商品数量上限 | 购物车交互 | PM | 待确认 |

**开放问题**：

| 编号 | 问题 | 影响范围 | 状态 |
|------|------|---------|------|
| O1 | 是否需要离线模式 | 全局交互 | Open |

### Step 5: 文档组装

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

## 4. UI 产出引用
### 4.1 设计令牌引用
### 4.2 组件库引用
### 4.3 视觉方向引用
### 4.4 交互实现引用
### 4.5 响应式适配引用

## 5. 待确认项
## 6. 开放问题

## 附录
- 变更记录
```

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

- [ ] 页面清单与路由完整
- [ ] 每个页面有功能需求摘要
- [ ] 每个页面有交互意图和异常场景
- [ ] UI 产出引用路径正确
- [ ] 待确认项已列出

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| IA缺失 | 页面清单基于PRD推导 | 路由结构可能不完整 |
| PRD缺失 | 功能需求基于IA推导 | 功能需求可能不够完整 |
| 交互规范缺失 | 交互意图基于PRD推导 | 交互意图可能不够细致 |
| IA+PRD均缺失 | 基于用户描述推导 | 整体置信度降低 |

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

## 变更记录

- v3.0: 重新定位为开发交接摘要（移除令牌/组件/交互/响应式等UI决策，改为引用UI产出）；移除对UI产出的反向依赖（不再需要design-system.json作为输入）；输出Schema精简
- v2.1: 初始版本
