---
name: design-ia
description: 当需要设计产品信息架构时使用。信息架构自动设计，从PRD自动提取内容、进行语义聚类、推荐导航模式、模拟卡片分类、生成IA候选方案。适用于产品信息架构重构或新功能导航设计。关键词：信息架构、IA设计、导航设计、卡片分类、内容组织、导航梳理、内容分类。
metadata:
  module: "产品构思与设计"
  sub-module: "产品设计与原型"
  type: "pipeline"
  version: "3.0"
  domain_tags: ["互联网", "内容平台", "通用"]
  trigger_examples:
    - "网站导航怎么组织"
    - "帮我梳理信息架构"
    - "内容分类和导航怎么设计"
  interaction_mode: "ai_suggest_human_approve"
---

# 信息架构自动设计

## 核心原则

1. **信息找路而非路找信息**：IA设计从用户的信息需求出发，而非从功能列表出发
2. **层级克制**：3层以内，每类3-7项，符合米勒定律
3. **批量生成人类筛选**：AI批量生成分类方案，人类做最终筛选和判定
4. **验证驱动**：关键分类节点必须标注需用户验证

🤖→👤 AI建议 → 人类审批

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| PRD | markdown | 是 | output/pm-design/design-prd/prd.md | 产品需求文档 |
| PRD结构化数据 | JSON | ○ | output/pm-design/design-prd/prd.json | PRD机器可消费版本，包含pages[]，供IA设计对齐页面路由 |
| 现有产品IA | JSON | ○ | 用户提供 | 现有信息架构（如有） |
| 用户研究数据 | JSON | ○ | output/pm-discovery/user-research-voice-analysis / output/pm-discovery/user-research-behavior-analysis | 用户行为模式、内容偏好 |

## 执行步骤

### Step 1: 内容清单生成

从PRD中提取所有功能点和内容项：

- 功能模块清单
- 内容类型列表
- 核心业务实体
- 用户可触达的信息节点

### Step 2: 自动分类

基于语义相似度生成分类建议：

AI基于功能名称和描述的语义相似度进行分类建议：
1. 提取每个功能点的核心关键词
2. 按关键词语义相近度分组
3. 检查每组数量是否符合3-7项约束
4. 超出约束的组建议拆分或合并
5. 标注分类置信度，低置信度分组标注needs_human_validation

- **约束条件**：
  - 已有分类优先保留
  - 每类包含3-7项
  - 层级不超过3层

### Step 3: 导航需求定义

根据内容特点和用户场景，定义导航需求（不定义具体导航模式，由 UI Skill 决定实现方式）：

| 内容特点 | 导航需求 |
|----------|---------|
| 扁平结构 | 3-5个同级入口需同时可见 |
| 层级分明 | 层级深度≤3，核心功能2次点击可达 |
| 功能导向 | 核心功能入口需常驻可见 |
| 内容丰富 | 需支持浏览+搜索组合 |

### Step 4: 卡片分类建议

AI基于分类结果生成卡片分类建议：

1. 将Step 2的分类结果转化为卡片分组
2. 识别跨组归属模糊的功能点（可能属于多个分组）
3. 对模糊归属点生成2-3个候选分组
4. 标注需用户验证的关键分类决策点
5. 输出分类建议而非测试结论

### Step 5: IA方案生成

生成2-3个候选IA方案，每个包含：

- **name**: 方案名称
- **structure**: 层级结构定义
- **navigation_pattern**: 导航模式选择
- **avg_clicks_to_core**: 核心功能平均点击次数
- **alignment_with_user_model**: 与用户心智模型的对齐度
- **needs_user_validation**: 需用户验证的节点标记

## 输出

**存储路径**：`output/pm-design/design-ia/`

**输出文件**：`ia_proposals.json`

```json
{
  "ia_proposals": [
    {
      "name": "方案A：功能导向型",
      "structure": {
        "root": {
          "label": "string - 根节点名称",
          "children": [
            {
              "label": "string - 一级分类名称",
              "children": [
                { "label": "string - 二级分类名称", "items": ["string - 功能/内容项"] }
              ]
            }
          ]
        }
      },
      "navigation_needs": "4个同级模块需快速切换，层级深度≤2",
      "routes": [
        { "path": "/dashboard", "page": "仪表盘", "depth": 1 },
        { "path": "/courses", "page": "课程列表", "depth": 1 },
        { "path": "/courses/:id", "page": "课程详情", "depth": 2 },
        { "path": "/courses/:id/lessons/:lid", "page": "课时学习", "depth": 3 }
      ],
      "avg_clicks_to_core": 2.3,
      "alignment_with_user_model": "high",
      "needs_user_validation": ["分类节点X", "分类节点Y"]
    }
  ]
}
```

**输出校验规则**：详见下方输出校验规则章节

## 决策规则

| 条件 | 动作 |
|------|------|
| IA层级深度 > 4层 | 标注"层级过深"，建议扁平化 |
| 同层级节点数 > 7个 | 标注"认知负荷过高"，建议分组 |
| 关键任务路径点击数 > 3次 | 标注"路径过深"，建议提升层级 |
| IA置信度 < 0.5 | 升级人类验证，标注"IA推断可信度低" |
| 与PRD功能模块不匹配 | 标注"功能覆盖缺失"，列出未覆盖的功能模块 |
| 导航路径存在循环 | 必须修复，消除循环引用 |

## 质量检查

| 检查项 | 标准 | 不达标处理 |
|--------|------|------------|
| 内容清单完整性 | 覆盖PRD所有功能点 | 补充缺失功能点，标注"功能覆盖缺失" |
| 分类合理性 | 符合米勒定律（每类3-7项） | 重新聚类，拆分过大类或合并过小类 |
| 导航需求定义 | 有明确导航需求且与内容特点匹配 | 补充导航需求描述，重新评估 |
| 验证节点标注 | 所有关键分类节点已标注需用户验证 | 补充缺失的验证标注，升级为人工审核 |

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| PRD文档缺失 | 用户提供功能列表，直接设计IA | 缺乏PRD结构化数据，分类可能不够完整 |
| 现有IA数据缺失 | 从零设计IA，无参考基线 | 缺乏现有IA参考，可能遗漏已有结构 |
| 用户研究数据缺失 | 基于PRD功能推导分类 | 缺乏用户研究数据，分类可能与用户心智模型偏差 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的功能列表直接设计IA | 整体置信度降低 |

## 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| ia_proposals | array | 是 | IA候选方案列表，至少2个 |
| ia_proposals[].name | string | 是 | 方案名称 |
| ia_proposals[].structure | object | 是 | 层级结构定义 |
| ia_proposals[].navigation_needs | string | 是 | 导航需求描述（不定义具体导航模式） |
| ia_proposals[].routes | array | 是 | 路由列表 |
| ia_proposals[].routes[].path | string | 是 | 路由路径（须与prd.json.pages[].route一致） |
| ia_proposals[].routes[].page | string | 是 | 页面名称 |
| ia_proposals[].routes[].depth | integer | 是 | 层级深度 |
| ia_proposals[].avg_clicks_to_core | number | 是 | 核心功能平均点击次数 |
| ia_proposals[].alignment_with_user_model | string | 是 | 与用户心智模型对齐度 |
| ia_proposals[].needs_user_validation | array | 是 | 需用户验证的节点 |

## 上游变更响应

### 上游变更影响

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| PRD功能模块增删 | 内容清单、分类结构、路由定义 | 标注受影响的功能点和分类节点，建议人类确认是否重新聚类 |
| PRD优先级调整 | IA层级结构、导航模式 | 标注受影响的层级关系，建议人类确认是否调整层级深度 |
| 用户研究数据更新 | 分类方案、用户心智模型对齐度 | 标注受影响的分类判断，建议人类确认是否调整分类方案 |
| 现有IA结构调整 | 路由映射、导航模式 | 标注受影响的路由和导航，建议人类确认是否重新设计 |

### 下游通知机制

| IA变更类型 | 通知范围 | 通知方式 |
|-----------|----------|----------|
| 路由结构变更 | design-userflow、design-prototype、design-handoff-spec | 标记路由变更，触发用户流程和原型重新设计 |
| 导航需求变更 | design-prototype、interaction-spec | 标记导航需求变更，触发原型和交互规范更新 |
| 层级深度变更 | design-userflow、design-handoff-spec | 标记层级变更，触发流程和交接文档更新 |
| 分类节点变更 | design-userflow、design-prototype | 标记分类变更，触发流程和原型更新 |

## 与prd.json数据契约对齐

| 本Skill输出字段 | prd.json对应字段 | 对齐规则 |
|----------------|-----------------|---------|
| ia_proposals[].routes[].path | prd.json.pages[].route | 路由路径必须一致，IA方案确认后prd.json同步更新 |
| ia_proposals[].routes[].page | prd.json.pages[].name | 页面名称必须一致 |
| ia_proposals[].structure | prd.json.pages[]层级关系 | IA层级结构决定pages的父子关系 |

## 数据获取说明

本Skill需要PRD、现有IA和用户研究数据，请通过以下方式之一提供：
  1. 直接描述功能列表和用户需求
  2. 上传PRD文档 / persona.json / voice-analysis.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析
