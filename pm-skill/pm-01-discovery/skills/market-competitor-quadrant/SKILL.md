---
name: market-competitor-quadrant
description: 当需要对竞品进行直接/间接/替代/潜在四象限分类时使用。竞品四象限自动填充，自动识别与填充各象限竞品，标注数据来源与置信度，支持象限间流动追踪。关键词：竞品分类、四象限、直接竞品、间接竞品、替代方案、潜在竞品、象限流动。
metadata:
  module: "产品探索与发现"
  sub-module: "市场竞品"
  type: "pipeline"
  version: "2.0"
  interaction_mode: "ai_suggest_human_approve"
---

# 竞品四象限自动填充

## 核心原则

1. **四象限定义先行**——直接/间接/替代/潜在四个象限有严格定义（相同品类+相同用户+相同功能 / 相同场景+不同方案 / 非产品化方式 / 有能力进入），分类必须基于定义而非直觉
2. **象限间流动可追踪**——竞品不是静态归属某一象限，间接竞品可能升级为直接竞品，潜在竞品可能变为直接竞品，标注流动信号和预估时间线
3. **潜在竞品默认需验证**——潜在竞品象限的每一项默认needs_human_validation=true，因为潜在竞品的识别基于推断信号（招聘/专利/融资），不确定性最高
4. **空象限即风险提示**——任一象限为空不是"没有竞品"，而是"未识别到竞品"，必须标注该象限需补充，建议人类提供线索

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| category_keywords | string | 是 | 用户提供 | 品类关键词，如"在线教育""SaaS CRM" |
| known_competitors | array | 是 | 用户提供 | 已知竞品列表，每项含名称、品类、已知象限（可选） |

## 执行步骤

### Step 1: 直接竞品识别

**定义：** 相同品类 + 相同目标用户 + 相同核心功能

**识别逻辑：**
1. 从已知竞品列表中筛选品类完全匹配的竞品
2. 基于品类关键词搜索应用商店同分类产品
3. 通过产品目录/行业数据库检索同类产品
4. SEO竞品分析（搜索相同核心关键词的竞品投放）

**数据源：**

| 数据源 | 采集内容 | 可靠性 |
|--------|---------|--------|
| 应用商店分类 | 同分类下的产品列表 | 高 |
| 产品目录（如G2/Capterra） | 同品类产品对比列表 | 高 |
| SEO竞品分析 | 搜索相同关键词的竞品 | 中 |
| 行业协会/数据库 | 行业成员/认证产品 | 高 |

### Step 2: 间接竞品识别

**定义：** 相同用户场景 + 不同解决方案

**识别逻辑：**
1. 分析目标用户场景，列出所有可能的解决方式
2. 从用户反馈中提取提及的替代产品
3. 搜索词分析：用户搜索品类关键词时同时搜索的其他产品
4. 识别解决相同场景但技术路径/商业模式不同的产品

**数据源：**

| 数据源 | 采集内容 | 可靠性 |
|--------|---------|--------|
| 用户反馈替代方案 | 用户评论中提及的替代产品 | 中 |
| 搜索词关联分析 | 品类关键词的关联搜索词 | 中 |
| 场景映射分析 | 同场景不同解决方案的产品 | 中 |
| 社区/论坛讨论 | 用户讨论中的替代推荐 | 中 |

### Step 3: 替代方案识别

**定义：** 用户当前非产品化解决方式

**识别逻辑：**
1. 识别目标用户在没有该品类产品时的解决方式
2. 从用户访谈数据中提取当前工作流/手动流程
3. 从问卷调查中收集非产品化替代方式
4. 从论坛/社区讨论中提取DIY方案/手动流程

**数据源：**

| 数据源 | 采集内容 | 可靠性 |
|--------|---------|--------|
| 用户访谈数据 | 用户描述的当前解决方式 | 高 |
| 问卷调查 | 用户选择的替代方式 | 高 |
| 论坛/社区 | DIY方案、手动流程讨论 | 中 |
| 行业报告 | 行业中非产品化解决比例 | 中 |

### Step 4: 潜在竞品识别

**定义：** 有能力进入该领域的公司

**识别逻辑：**
1. 招聘信息监控：检测相关技术/市场岗位的招聘
2. 专利分析：检索相关技术领域的专利申请
3. 融资信息：关注获得相关领域融资的公司
4. 战略公告：分析公司战略中提及的相关方向

**数据源：**

| 数据源 | 采集内容 | 可靠性 |
|--------|---------|--------|
| 招聘信息 | 相关技术/市场岗位招聘 | 低-中 |
| 专利数据库 | 相关技术专利申请 | 中 |
| 融资信息 | 相关领域融资事件 | 中 |
| 战略公告 | 公司战略中提及的相关方向 | 低-中 |
| 产业链分析 | 上下游企业延伸能力 | 低 |

### Step 5: 置信度评估与人类验证标注

对每个象限的每项竞品进行置信度评估：

| 评估维度 | 说明 |
|---------|------|
| 数据来源可靠性 | 数据源的可信程度（0-1） |
| 证据充分性 | 支持该分类的证据数量与质量 |
| 分类确定性 | 该竞品归入该象限的确定程度 |

**置信度分级：**
- 高（0.8-1.0）：多源交叉验证，分类确定
- 中（0.5-0.8）：有数据支撑但来源单一或部分矛盾
- 低（<0.5）：推断性结论，需人类验证

### Step 6: 象限间流动标注

对识别出的竞品进行象限间流动可能性评估：

| 流动类型 | 触发信号 | 预估时间线 |
|---------|---------|-----------|
| 间接→直接 | 间接竞品推出相同品类产品线、功能趋同化 | 6-18个月 |
| 潜在→直接 | 潜在竞品正式发布同类产品、完成市场验证 | 12-24个月 |
| 潜在→间接 | 潜在竞品推出差异化方案切入相同场景 | 6-12个月 |
| 替代→间接 | 非产品化方式被产品化（如工具化、平台化） | 12-36个月 |

**流动标注规则：**
- 每项竞品可选填 `flow_signal`（流动信号描述）和 `estimated_flow_timeline`（预估流动时间线）
- 仅有明确信号时才标注流动，无信号则不填
- 流动信号需附带数据来源

## 输出

输出文件：`output/pm-discovery/market-competitor-quadrant/competitor-quadrant.json`

**输出Schema**：

```json
{
  "type": "object",
  "required": ["category_keywords", "quadrants", "summary"],
  "properties": {
    "category_keywords": {"type": "string", "description": "品类关键词"},
    "quadrants": {"type": "object", "description": "四象限竞品分类，含直接/间接/替代/潜在竞品"},
    "summary": {"type": "object", "description": "分类统计摘要"}
  }
}
```

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|---------|------|------|------|
| category_keywords | string | 是 | 品类关键词，不可为空字符串 |
| quadrants | object | 是 | 四象限容器，必须包含全部四个子象限 |
| quadrants.direct_competitors | object | 是 | 直接竞品象限，definition不可为空 |
| quadrants.direct_competitors.items | array | 是 | 直接竞品列表，可为空数组但需标注需补充 |
| quadrants.direct_competitors.items[].name | string | 是 | 竞品名称，不可为空 |
| quadrants.direct_competitors.items[].confidence | number | 是 | 置信度，范围0-1 |
| quadrants.direct_competitors.items[].data_source | string | 是 | 数据来源，不可为空 |
| quadrants.direct_competitors.items[].needs_human_validation | boolean | 是 | 是否需人类验证，置信度<0.5时必须为true |
| quadrants.indirect_competitors | object | 是 | 间接竞品象限，definition不可为空 |
| quadrants.indirect_competitors.items | array | 是 | 间接竞品列表，可为空数组但需标注需补充 |
| quadrants.indirect_competitors.items[].name | string | 是 | 竞品名称，不可为空 |
| quadrants.indirect_competitors.items[].confidence | number | 是 | 置信度，范围0-1 |
| quadrants.indirect_competitors.items[].data_source | string | 是 | 数据来源，不可为空 |
| quadrants.indirect_competitors.items[].needs_human_validation | boolean | 是 | 是否需人类验证，置信度<0.5时必须为true |
| quadrants.substitutes | object | 是 | 替代方案象限，definition不可为空 |
| quadrants.substitutes.items | array | 是 | 替代方案列表，可为空数组但需标注需补充 |
| quadrants.substitutes.items[].name | string | 是 | 替代方案名称，不可为空 |
| quadrants.substitutes.items[].confidence | number | 是 | 置信度，范围0-1 |
| quadrants.substitutes.items[].data_source | string | 是 | 数据来源，不可为空 |
| quadrants.substitutes.items[].needs_human_validation | boolean | 是 | 是否需人类验证，置信度<0.5时必须为true |
| quadrants.potential_competitors | object | 是 | 潜在竞品象限，definition不可为空 |
| quadrants.potential_competitors.items | array | 是 | 潜在竞品列表，可为空数组但需标注需补充 |
| quadrants.potential_competitors.items[].name | string | 是 | 竞品名称，不可为空 |
| quadrants.potential_competitors.items[].confidence | number | 是 | 置信度，范围0-1 |
| quadrants.potential_competitors.items[].data_source | string | 是 | 数据来源，不可为空 |
| quadrants.potential_competitors.items[].needs_human_validation | boolean | 是 | 是否需人类验证，**默认必须为true** |
| summary | object | 是 | 分类统计摘要 |
| summary.total_items | number | 是 | 竞品总数，应等于四象限items数量之和 |
| summary.by_confidence | object | 是 | 按置信度分级的统计 |
| summary.by_confidence.high | number | 是 | 高置信度项数（≥0.8） |
| summary.by_confidence.medium | number | 是 | 中置信度项数（0.5-0.8） |
| summary.by_confidence.low | number | 是 | 低置信度项数（<0.5） |
| summary.needs_validation_count | number | 是 | 需人类验证的项数 |

**Output JSON**：

```json
{
  "category_keywords": "在线教育",
  "quadrants": {
    "direct_competitors": {
      "definition": "相同品类+相同目标用户+相同核心功能",
      "items": [
        {
          "name": "猿辅导",
          "category": "K12在线教育",
          "core_features": ["直播授课", "AI题库", "学习报告"],
          "target_users": "K12学生及家长",
          "data_source": "36氪",
          "confidence": 0.85,
          "needs_human_validation": false,
          "flow_signal": null,
          "estimated_flow_timeline": null
        }
      ]
    },
    "indirect_competitors": {
      "definition": "相同用户场景+不同解决方案",
      "items": [
        {
          "name": "新东方",
          "user_scenario": "课后辅导与提分",
          "solution_type": "线下培训机构",
          "difference": "线下重资产模式，受地域限制",
          "data_source": "艾瑞咨询",
          "confidence": 0.75,
          "needs_human_validation": false,
          "flow_signal": "新东方在线业务占比持续提升，OMO模式趋同",
          "estimated_flow_timeline": "12-18个月"
        }
      ]
    },
    "substitutes": {
      "definition": "用户当前非产品化解决方式",
      "items": [
        {
          "name": "家长自主辅导",
          "description": "家长自行购买教辅材料辅导孩子",
          "user_segment": "有时间且具备辅导能力的家长",
          "switching_cost": "低，家长可随时切换至在线产品",
          "data_source": "用户访谈",
          "confidence": 0.70,
          "needs_human_validation": false,
          "flow_signal": null,
          "estimated_flow_timeline": null
        }
      ]
    },
    "potential_competitors": {
      "definition": "有能力进入该领域的公司",
      "items": [
        {
          "name": "字节跳动",
          "current_business": "短视频与内容平台",
          "entry_capability": "拥有海量用户流量和AI技术储备，具备快速切入能力",
          "entry_signal": "大力教育品牌持续投入，招聘教育行业高管",
          "estimated_timeline": "已进入，持续扩张中",
          "data_source": "IT桔子",
          "confidence": 0.60,
          "needs_human_validation": true,
          "flow_signal": "大力教育品牌已上线多款产品，具备直接竞品形态",
          "estimated_flow_timeline": "6-12个月"
        }
      ]
    }
  },
  "summary": {
    "total_items": 0,
    "by_confidence": {
      "high": 0,
      "medium": 0,
      "low": 0
    },
    "needs_validation_count": 0
  }
}
```

## 决策规则

| 规则 | 触发条件 | 动作 |
|------|---------|------|
| 潜在竞品需验证 | 潜在竞品象限的任何项 | 默认标注needs_human_validation=true，置信度通常较低需人类确认 |
| 象限最低填充 | 任一象限为空 | 标注该象限需补充，建议人类提供线索 |
| 低置信度标注 | 置信度 < 0.5 | 标注需人类验证，说明不确定原因 |

## 质量检查

- [ ] 四象限已填充（直接/间接/替代/潜在）
- [ ] 每个象限至少1项（空象限已标注需补充）
- [ ] 每项标注了数据来源（data_source）
- [ ] 每项标注了置信度（confidence）
- [ ] 潜在竞品已标注需人类验证（needs_human_validation=true）
- [ ] 低置信度项已标注
- [ ] 空象限已标注需补充（非"无竞品"，而是"未识别到"）
- [ ] 象限间流动信号已标注（有信号时）

---

## 降级策略

当上游文件不存在时，本Skill仍可独立执行：

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| competitor-intel.json | 用户提供已知竞品名称 → 基于AI知识填充四象限，标注"缺乏竞品情报数据支撑" | 各象限竞品置信度整体降低0.1-0.2，data_source标注为"AI推断"而非情报数据 |
| 所有上游文件均缺失 | 用户提供品类关键词和已知竞品名称 → 基于AI知识库推断填充四象限 | 所有竞品项confidence≤0.6，needs_human_validation默认为true，summary中需标注"全量推断模式" |
| 若用户未提供category_keywords | 提示用户提供品类关键词，否则无法确定竞品搜索范围 | 无法生成输出，返回错误提示"缺少品类关键词" |
| 若用户未提供known_competitors | 提示用户提供或跳过该输入相关步骤，基于AI推断识别竞品填充四象限 | 直接竞品象限可能为空或项数不足，需标注"缺乏已知竞品输入，建议人类补充" |

数据获取说明：
- 本Skill需要竞品信息，请通过以下方式之一提供：
  1. 直接提供已知竞品名称和品类关键词
  2. 上传competitor-intel.json文件
  3. 提供数据文件路径
- AI不负责外部数据采集，仅负责分析

## 上游变更响应

### 上游变更影响表

| 上游变更事件 | 影响范围 | 响应动作 |
|------------|---------|---------|
| competitor-intel.json新增竞品 | 直接竞品象限 | 重新评估新增竞品的象限归属，若符合直接竞品定义则添加至direct_competitors.items，更新summary统计 |
| competitor-intel.json战略信号变化 | 潜在竞品象限 | 评估战略信号是否构成新的进入信号，更新potential_competitors对应项的entry_signal和confidence，检查是否触发流动标注 |
| competitor-intel.json融资事件更新 | 潜在竞品象限 | 新增融资事件可能提升潜在竞品confidence，更新data_source和confidence值 |
| competitor-intel.json产品功能变更 | 直接/间接竞品象限 | 功能趋同可能触发间接→直接流动，更新flow_signal和estimated_flow_timeline |
| 品类关键词变更 | 全部四个象限 | 需重新执行完整四象限填充，旧数据标记为deprecated |

### 下游通知机制表

| 本Skill变更事件 | 通知目标 | 通知内容 |
|---------------|---------|---------|
| 象限分类变更（竞品跨象限移动） | competitor-report | 通知竞品从原象限移至新象限，附带流动信号和时间线 |
| 新增竞品项 | competitor-intel | 通知新增竞品名称及象限归属，建议competitor-intel补充持续监控 |
| 象限为空标注 | 人类用户 | 提示该象限未识别到竞品，建议提供线索或补充数据源 |
| 潜在竞品升级为直接竞品 | competitor-report + competitor-intel | 通知竞品象限升级，建议更新竞品情报监控优先级和报告重点 |
