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
execution_depth:
  default: standard
  quick_description: "直接输出IA方案和导航需求"
  deep_description: "完整IA方案 + 卡片分类验证 + 用户心智模型对齐 + 导航可用性评估"
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

### Step 1: 内容清单生成 [核心]

从PRD中提取所有功能点和内容项：

- 功能模块清单
- 内容类型列表
- 核心业务实体
- 用户可触达的信息节点

### Step 2: 自动分类 [核心]

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

### Step 3: 导航需求定义 [核心]

根据内容特点和用户场景，定义导航需求（不定义具体导航模式，由 UI Skill 决定实现方式）：

| 内容特点 | 导航需求 |
|----------|---------|
| 扁平结构 | 3-5个同级入口需同时可见 |
| 层级分明 | 层级深度≤3，核心功能2次点击可达 |
| 功能导向 | 核心功能入口需常驻可见 |
| 内容丰富 | 需支持浏览+搜索组合 |

### Step 4: 卡片分类建议 [核心]

AI基于分类结果生成卡片分类建议：

1. 将Step 2的分类结果转化为卡片分组
2. 识别跨组归属模糊的功能点（可能属于多个分组）
3. 对模糊归属点生成2-3个候选分组
4. 标注需用户验证的关键分类决策点
5. 输出分类建议而非测试结论

### Step 5: IA方案生成 [核心]

生成2-3个候选IA方案，每个包含：

- **name**: 方案名称
- **structure**: 层级结构定义
- **navigation_pattern**: 导航模式选择
- **avg_clicks_to_core**: 核心功能平均点击次数
- **alignment_with_user_model**: 与用户心智模型的对齐度
- **needs_user_validation**: 需用户验证的节点标记

### 输出深度分级

| 深度级别 | 输出范围 | 说明 |
|----------|----------|------|
| quick | IA方案和导航需求 | 核心结论 + 最小可行产物 |
| standard | 完整产物（当前默认） | 完整产物，包含全部Step输出 |
| deep | 完整IA方案 + 卡片分类验证 + 用户心智模型对齐 + 导航可用性评估 | 完整产物 + 扩展分析 + 深度推演 |

## 输出

**存储路径**：`output/pm-design/design-ia/`

**输出文件**：`ia_proposals.json`

以下为完整示例，展示 batch_generation（AI 批量生成 3 个候选方案）+ human_filter（人类筛选最终方案）原则的实际应用。场景：在线学习平台信息架构设计，AI 生成 3 个候选方案并标注评分，人类筛选后选定方案B。

```json
{
  "ia_proposals": [
    {
      "name": "方案A：功能导向型",
      "structure": {
        "root": {
          "label": "在线学习平台",
          "children": [
            {
              "label": "学习",
              "children": [
                { "label": "我的课程", "items": ["进行中课程", "已完成课程", "收藏课程"] },
                { "label": "课程市场", "items": ["全部课程", "分类浏览", "搜索"] }
              ]
            },
            {
              "label": "推荐",
              "children": [
                { "label": "个性化推荐", "items": ["为你推荐", "不感兴趣反馈"] },
                { "label": "学习路径", "items": ["前端路径", "后端路径", "产品路径"] }
              ]
            },
            {
              "label": "个人中心",
              "children": [
                { "label": "账户", "items": ["基本信息", "学习偏好", "职业目标"] },
                { "label": "成就", "items": ["学习证书", "学习统计"] }
              ]
            }
          ]
        }
      },
      "navigation_needs": "3个同级模块需快速切换，层级深度≤2，核心功能2次点击可达",
      "routes": [
        { "path": "/dashboard", "page": "学习首页", "depth": 1 },
        { "path": "/recommend", "page": "推荐首页", "depth": 1 },
        { "path": "/courses", "page": "课程市场", "depth": 1 },
        { "path": "/courses/:id", "page": "课程详情", "depth": 2 },
        { "path": "/paths", "page": "学习路径", "depth": 2 },
        { "path": "/profile", "page": "个人中心", "depth": 1 }
      ],
      "avg_clicks_to_core": 2.0,
      "alignment_with_user_model": "medium",
      "needs_user_validation": ["「学习」与「推荐」模块的边界划分", "「课程市场」是否独立为一级入口"],
      "rationale": "按功能类型组织，结构清晰易于维护。但「推荐」与「学习」分离可能导致学员在两个模块间频繁切换，增加认知负荷。",
      "pros": ["结构清晰，开发实现简单", "功能边界明确，便于团队分工"],
      "cons": ["推荐与学习割裂，用户心智模型对齐度低", "推荐入口层级较深，影响推荐曝光"],
      "score": {
        "user_alignment": 6,
        "development_cost": 8,
        "scalability": 7,
        "total": 21
      }
    },
    {
      "name": "方案B：用户目标导向型",
      "structure": {
        "root": {
          "label": "在线学习平台",
          "children": [
            {
              "label": "继续学习",
              "children": [
                { "label": "最近学习", "items": ["上次学习课程", "进行中课程"] },
                { "label": "学习路径", "items": ["我的路径", "推荐路径"] }
              ]
            },
            {
              "label": "发现课程",
              "children": [
                { "label": "为你推荐", "items": ["个性化推荐", "学习路径推荐"] },
                { "label": "浏览全部", "items": ["分类浏览", "搜索", "排行榜"] }
              ]
            },
            {
              "label": "我的成长",
              "children": [
                { "label": "学习记录", "items": ["学习统计", "完课证书"] },
                { "label": "账户设置", "items": ["基本信息", "学习偏好"] }
              ]
            }
          ]
        }
      },
      "navigation_needs": "3个同级模块按学员旅程组织，层级深度≤2，推荐内容与学习入口紧邻",
      "routes": [
        { "path": "/dashboard", "page": "继续学习", "depth": 1 },
        { "path": "/recommend", "page": "为你推荐", "depth": 2 },
        { "path": "/courses", "page": "浏览全部", "depth": 2 },
        { "path": "/courses/:id", "page": "课程详情", "depth": 2 },
        { "path": "/paths", "page": "学习路径", "depth": 2 },
        { "path": "/profile", "page": "我的成长", "depth": 1 }
      ],
      "avg_clicks_to_core": 1.8,
      "alignment_with_user_model": "high",
      "needs_user_validation": ["「继续学习」作为一级入口的命名", "「发现课程」与「继续学习」的优先级排序"],
      "rationale": "按学员学习旅程组织，从「继续学习」到「发现课程」形成自然流转。推荐内容与学习入口紧邻，降低切换成本，符合学员「学习-发现-再学习」的心智模型。",
      "pros": ["与学员心智模型高度对齐", "推荐内容曝光度高，核心功能点击次数少", "支持学员旅程自然流转"],
      "cons": ["结构对运营内容组织要求较高", "「发现课程」命名需用户验证"],
      "score": {
        "user_alignment": 9,
        "development_cost": 6,
        "scalability": 8,
        "total": 23
      }
    },
    {
      "name": "方案C：内容类型导向型",
      "structure": {
        "root": {
          "label": "在线学习平台",
          "children": [
            {
              "label": "课程",
              "children": [
                { "label": "全部课程", "items": ["分类浏览", "搜索", "排行榜"] },
                { "label": "我的课程", "items": ["进行中", "已完成", "收藏"] }
              ]
            },
            {
              "label": "路径",
              "children": [
                { "label": "推荐路径", "items": ["按职业方向", "按技能方向"] },
                { "label": "我的路径", "items": ["进行中路径", "已完成路径"] }
              ]
            },
            {
              "label": "推荐",
              "children": [
                { "label": "课程推荐", "items": ["个性化推荐", "相似课程"] },
                { "label": "路径推荐", "items": ["进阶路径", "关联路径"] }
              ]
            },
            {
              "label": "我的",
              "children": [
                { "label": "学习数据", "items": ["学习统计", "完课证书"] },
                { "label": "设置", "items": ["账户", "偏好"] }
              ]
            }
          ]
        }
      },
      "navigation_needs": "4个同级模块需快速切换，层级深度≤2，但4个入口可能超出米勒定律舒适区",
      "routes": [
        { "path": "/courses", "page": "课程", "depth": 1 },
        { "path": "/courses/:id", "page": "课程详情", "depth": 2 },
        { "path": "/paths", "page": "路径", "depth": 1 },
        { "path": "/recommend", "page": "推荐", "depth": 1 },
        { "path": "/profile", "page": "我的", "depth": 1 }
      ],
      "avg_clicks_to_core": 2.2,
      "alignment_with_user_model": "medium",
      "needs_user_validation": ["4个一级入口是否过多", "「路径」与「课程」是否需要合并"],
      "rationale": "按内容类型组织，课程与路径分离便于内容管理。但4个一级入口可能超出米勒定律（3-7项舒适区下限），且「推荐」独立成模块可能降低与学习的联动性。",
      "pros": ["内容类型边界清晰，便于内容运营", "路径与课程分离，支持精细化运营"],
      "cons": ["4个一级入口认知负荷较高", "推荐与学习场景割裂", "核心功能点击次数偏多"],
      "score": {
        "user_alignment": 5,
        "development_cost": 7,
        "scalability": 9,
        "total": 21
      }
    }
  ],
  "human_filter": {
    "selected_proposal": "方案B：用户目标导向型",
    "selection_rationale": "方案B 与学员心智模型对齐度最高（9分），核心功能平均点击次数最少（1.8次），推荐内容曝光度高。虽然开发成本略高于方案A，但用户体验优势明显，符合「信息找路而非路找信息」的核心原则。",
    "rejected_proposals": [
      {
        "name": "方案A：功能导向型",
        "reject_reason": "推荐与学习割裂，用户心智模型对齐度仅 medium"
      },
      {
        "name": "方案C：内容类型导向型",
        "reject_reason": "4个一级入口认知负荷过高，违反米勒定律舒适区原则"
      }
    ],
    "validation_actions": [
      "对「继续学习」「发现课程」命名进行卡片分类验证",
      "对推荐内容在「发现课程」下的层级进行 A/B 测试"
    ]
  }
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

### P0 检查（quick/standard/deep 都必须通过）

- [ ] 内容清单完整性（覆盖PRD所有功能点）
- [ ] 分类合理性（符合米勒定律（每类3-7项））

### P1 检查（standard/deep 必须通过）

- [ ] 导航需求定义（有明确导航需求且与内容特点匹配）
- [ ] 验证节点标注（所有关键分类节点已标注需用户验证）

### P2 检查（仅 deep 必须通过）

- [ ] 扩展分析完整（深度推演和路线图已生成）
- [ ] 决策记录完整（关键决策有依据和替代方案）

---

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 | 数据获取说明 |
|---------------|---------|---------|------------|
| PRD文档缺失 | 用户提供功能列表，直接设计IA | 缺乏PRD结构化数据，分类可能不够完整 | 要求用户提供功能需求描述或上传prd.json文件 |
| 现有IA数据缺失 | 从零设计IA，无参考基线 | 缺乏现有IA参考，可能遗漏已有结构 | 要求用户提供现有页面结构或导航层级描述 |
| 用户研究数据缺失 | 基于PRD功能推导分类 | 缺乏用户研究数据，分类可能与用户心智模型偏差 | 要求用户提供用户研究结论或上传persona.json文件 |
| 所有上游文件均缺失 | 提示用户先执行前序阶段，或基于用户提供的功能列表直接设计IA | 整体置信度降低 | 要求用户提供功能列表、目标用户和核心使用场景 |

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
