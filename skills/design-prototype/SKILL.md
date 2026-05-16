---
name: design-prototype
description: 当需要基于IA和用户流程生成原型时使用。原型自动生成，基于IA方案和User Flow自动生成低保真和中保真原型，包含设计规范检查和可用性启发式评估。适用于快速原型验证和设计稿生成。关键词：原型设计、低保真原型、中保真原型、设计规范、原型生成、出设计稿、快速原型。
metadata:
  module: "产品构思与设计"
  sub-module: "产品设计与原型"
  type: "pipeline"
  version: "3.2"
  domain_tags: ["互联网", "软件", "通用"]
  trigger_examples:
    - "帮我生成原型"
    - "快速出个设计稿"
    - "低保真原型怎么做"
  interaction_mode: "ai_suggest_human_approve"
---

# 原型自动生成

## 核心原则

1. **原型是沟通工具，不是最终产品**：原型的价值在于快速验证假设，而非像素级还原
2. **保真度按需递进**：先低保真验证结构，再中保真验证交互，不跳步
3. **批量生成人类筛选**：AI批量生成原型方案，人类做最终筛选和判定
4. **一致性可量化**：设计规范一致性用分数衡量，<85%需人类确认

🤖→👤 AI建议 → 人类审批

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| IA方案 | JSON | 是 | output/pm-design/design-ia/ia_proposals.json | Pipeline 9输出的信息架构方案 |
| User Flow | JSON | 是 | output/pm-design/design-userflow/userflow.json | Pipeline 10输出的用户流程 |
| PRD文档 | Markdown | ○ | output/pm-design/design-prd/prd.md | 产品需求参考 |
| PRD结构化数据 | JSON | ○ | output/pm-design/design-prd/prd.json | PRD机器可消费版本，包含pages[]/features[]，供原型设计对齐 |

## 执行步骤

### Step 1: 低保真原型生成

生成线框图级别的原型描述：

- **布局**: 页面结构与区域划分
- **内容优先级**: 各区域的内容重要程度排序
- **文案**: 关键文字内容
- **功能区域**: 基于PRD的功能区域映射

### Step 2: 中保真原型生成

在低保真基础上增加：

- **区域关系**: 区域间的视觉层次和关联
- **导航流程**: 页面间的跳转关系
- **数据展示需求**: 列表数据、空状态、加载状态的需求描述（不定义具体UI实现）
- **交互意图**: 基本交互行为意图（不定义具体动画参数，由 interaction-spec 和 UI Skill 决定实现）

### Step 3: 可用性启发式评估

基于Nielsen十大可用性原则评估：

1. 系统状态可见性
2. 系统与现实世界匹配
3. 用户控制与自由
4. 一致性与标准
5. 错误预防
6. 识别而非回忆
7. 使用的灵活性与效率
8. 美观且最小化设计
9. 帮助用户识别和恢复错误
10. 帮助与文档

评分范围0-10，**评分<3的弱项需提供改进建议**。

## 输出

**存储路径**：`output/pm-design/design-prototype/`

**输出文件**：

| 文件 | 路径 | 说明 |
|------|------|------|
| 原型规格 | prototype_spec.json | 页面布局、功能区域、交互意图、启发式评估 |
| 组件清单 | component_catalog.json | 供 UI Skill 消费的组件清单，包含组件类型、属性、数据绑定 |

### prototype_spec.json

```json
{
  "prototype": {
    "fidelity": "medium",
    "pages": [
      {
        "name": "页面名称",
        "layout": {
          "regions": [],
          "content_priority": [],
          "navigation_flow": []
        },
        "functional_areas": [],
        "data_display_needs": [],
        "interaction_intents": []
      }
    ],
    "heuristic_evaluation": {
      "overall_score": 8.5,
      "weak_areas": [
        {
          "principle": "系统状态可见性",
          "score": 2,
          "suggestion": "增加加载进度指示器"
        }
      ]
    }
  }
}
```

### component_catalog.json

component_catalog.json 是原型设计的机器可消费组件清单，供 UI Skill 编程式消费，确保组件生成与原型设计对齐。

**推荐+备选模式**：每个组件提供推荐类型和备选方案，UI Skill 可根据设计判断选择更合适的实现方式，避免原型预选型限制设计自由度。

| 字段 | 说明 |
|------|------|
| type | 推荐的组件类型（基于原型功能需求推导） |
| alternatives | 备选组件方案列表，每个备选含类型、名称、推荐理由和适用场景 |
| selection_criteria | 组件选型决策依据，描述在什么条件下选择推荐类型 vs 备选类型 |

**示例**：
```json
{
  "component_id": "user-list",
  "type": "data_display",
  "name": "UserTable",
  "alternatives": [
    {
      "type": "composite",
      "name": "UserCardGrid",
      "reason": "Card Grid 更适合视觉差异化，支持图片+摘要的富展示",
      "best_for": "数据量<20条、需要视觉冲击力、移动端优先的场景"
    }
  ],
  "selection_criteria": "数据量>20行或需要排序/筛选用Table，数据量<20行或需要视觉差异化用CardGrid"
}
```

```json
{
  "catalog_id": "string",
  "generated_at": "ISO8601",
  "source_prototype": "prototype_spec.json",
  "components": [
    {
      "component_id": "string",
      "name": "string",
      "type": "layout | navigation | data_display | form | feedback | media | composite",
      "description": "string",
      "props": [
        {
          "prop_name": "string",
          "type": "string | number | boolean | array | object",
          "required": "boolean",
          "default_value": "string | null",
          "description": "string"
        }
      ],
      "data_binding": {
        "data_source": "api | local | cache",
        "api_endpoint": "string | null",
        "fields": ["string"],
        "loading_state": "string",
        "error_state": "string",
        "empty_state": "string"
      },
      "pages_used_in": ["page_name"],
      "sub_components": ["component_id"],
      "variants": [
        {
          "variant_name": "string",
          "description": "string",
          "prop_overrides": {}
        }
      ],
      "alternatives": [
        {
          "type": "layout | navigation | data_display | form | feedback | media | composite",
          "name": "string",
          "reason": "string",
          "best_for": "string"
        }
      ],
      "selection_criteria": "string"
    }
  ],
  "shared_components": [
    {
      "component_id": "string",
      "name": "string",
      "usage_count": "number",
      "pages": ["page_name"]
    }
  ],
  "component_dependencies": [
    {
      "component_id": "string",
      "depends_on": ["component_id"]
    }
  ]
}
```

### component_catalog.json 与 prototype_spec.json 的关系

| 维度 | prototype_spec.json | component_catalog.json |
|------|---------------------|------------------------|
| 消费者 | 人类（设计师、PM） | 机器（UI Skill） |
| 内容 | 页面布局+交互意图+评估 | 组件类型+属性+数据绑定+依赖 |
| 生成顺序 | 先生成 prototype_spec.json | 从 prototype_spec.json 提取组件清单 |
| 一致性 | component_catalog.json 中的组件必须覆盖 prototype_spec.json 中所有页面的 functional_areas 和 data_display_needs | |

**输出校验规则**：详见下方输出校验规则章节

## 决策规则

- **启发式评估弱项**（评分<3）需人类判断是否修改
- 弱项有具体改进建议才能通过

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|------------|
| 启发式评估 | 已完成10项原则评估 | 标注"评估未完成"，补充缺失项评估 |
| 弱项改进建议 | 评分<3的弱项均有具体改进建议 | 标注"建议缺失"，补充改进方案后重新评估 |
| 核心页面覆盖 | 所有核心页面已覆盖 | 标注"覆盖不全"，列出未覆盖页面并补充 |
| 功能区域覆盖 | 每个页面的功能区域与PRD对齐 | 标注"功能区域不完整"，补充缺失的功能区域 |
| 组件清单覆盖 | component_catalog 覆盖所有页面的 functional_areas 和 data_display_needs | 标注"组件清单不完整"，补充缺失组件 |
| 组件备选方案 | 关键组件（跨页面共享组件+数据展示类组件）有alternatives备选方案 | 标注"备选方案缺失"，补充备选方案（不影响输出） |
| 组件页面引用一致性 | component_catalog.components[].pages_used_in 中的页面名在 prototype.pages[] 中存在 | 标注"引用不一致"，修正页面引用 |

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| IA方案缺失 | 用户提供功能描述，生成低保真原型 | 缺乏IA数据，页面结构可能不够合理 |
| UserFlow缺失 | 用户提供功能描述，生成低保真原型 | 缺乏UserFlow数据，交互流程可能不够完整 |
| PRD缺失 | 基于IA和UserFlow推导功能区域 | 功能区域可能不够完整 |
| IA+UserFlow均缺失 | 基于用户功能描述生成低保真原型 | 整体置信度降低，仅产出低保真级别 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户功能描述生成低保真原型 | 输出仅为低保真原型描述 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| prototype | object | 是 | 原型数据 |
| prototype.fidelity | string | 是 | 保真度级别（low/medium） |
| prototype.pages | array | 是 | 页面列表，不可为空 |
| prototype.pages[].name | string | 是 | 页面名称 |
| prototype.pages[].layout | object | 是 | 页面布局（区域划分/内容优先级/导航流程） |
| prototype.pages[].functional_areas | array | 是 | 功能区域列表 |
| prototype.pages[].data_display_needs | array | 是 | 数据展示需求 |
| prototype.pages[].interaction_intents | array | 是 | 交互意图 |
| prototype.heuristic_evaluation | object | 是 | 启发式评估 |
| prototype.heuristic_evaluation.overall_score | number | 是 | 整体评分（0-10） |
| prototype.heuristic_evaluation.weak_areas | array | 是 | 弱项列表 |
| component_catalog | object | 是 | 组件清单数据 |
| component_catalog.catalog_id | string | 是 | 清单唯一标识 |
| component_catalog.components | array | 是 | 组件列表，不可为空 |
| component_catalog.components[].component_id | string | 是 | 组件唯一标识 |
| component_catalog.components[].name | string | 是 | 组件名称 |
| component_catalog.components[].type | string | 是 | 组件类型，枚举值：layout/navigation/data_display/form/feedback/media/composite |
| component_catalog.components[].props | array | 是 | 组件属性列表 |
| component_catalog.components[].data_binding | object | 是 | 数据绑定，含data_source/fields/loading_state/error_state/empty_state |
| component_catalog.components[].pages_used_in | array | 是 | 使用该组件的页面列表，须与prototype.pages[].name对应 |
| component_catalog.components[].alternatives | array | 否 | 备选组件方案列表，每项含type/name/reason/best_for |
| component_catalog.components[].selection_criteria | string | 否 | 组件选型决策依据 |
| component_catalog.shared_components | array | 是 | 跨页面共享组件列表 |
| component_catalog.component_dependencies | array | 是 | 组件依赖关系列表 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| IA方案变更（页面增删/层级调整） | 页面清单、布局结构 | 标注受影响的页面，建议人类确认是否重新生成原型 |
| UserFlow变更（流程路径修改） | 导航流程、交互意图 | 标注受影响的交互流程，建议人类确认是否更新 |
| PRD变更（功能增删） | 功能区域、数据展示需求 | 标注受影响的功能区域，建议人类确认是否更新 |

### 下游通知机制

| 原型变更类型 | 通知范围 | 通知方式 |
|-------------|----------|----------|
| 页面增删 | interaction-spec、design-handoff-spec | 标记页面变更，触发交互规范和交接文档更新 |
| 功能区域变更 | design-handoff-spec | 标记功能区域变更，触发交接文档更新 |
| 交互意图变更 | interaction-spec | 标记交互意图变更，触发交互规范更新 |
| 组件清单变更 | UI Skill（ui-01-component-design） | 标记组件增删/属性变更，触发组件生成更新 |
| 共享组件变更 | UI Skill（ui-01-component-design） | 标记共享组件变更，触发跨页面组件更新 |

## 数据获取说明

本Skill需要IA、UserFlow和设计规范数据，请通过以下方式之一提供：
  1. 直接描述功能、页面结构和交互流程
  2. 上传ia_proposals.json / userflow.json / 设计规范文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
