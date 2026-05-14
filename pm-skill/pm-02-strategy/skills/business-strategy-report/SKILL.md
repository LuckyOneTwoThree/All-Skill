---
name: business-strategy-report
description: 当需要产出完整的商业战略规划文档时使用。商业战略规划报告自动生成，整合商业画布、SWOT、OKR、路线图、定位和利益相关者数据，补充战略推演和执行路径，输出结构化Markdown报告。关键词：商业战略报告、战略规划、商业规划、战略文档、商业分析报告、战略规划书、商业规划报告。
metadata:
  module: "产品商业与战略"
  sub-module: "商业战略"
  type: "pipeline"
  version: "2.1"
  domain_tags: ["通用"]
  trigger_examples:
    - "帮我写一份商业战略规划"
    - "出一份战略报告"
  interaction_mode: "ai_suggest_human_approve"
---

# 商业战略规划报告自动生成

## 核心原则

1. **战略是选择的放弃**——好战略明确说不做什么，而非什么都做
2. **逻辑链可追溯**——从市场洞察→战略选择→执行路径，每一步推导可验证
3. **量化优于定性**——能用数字说话的地方不用形容词
4. **执行导向**——战略不落地就是空谈，每个战略方向必须有对应的OKR和路线图

## 交互模式

🤖→👤 AI建议人类审批

## 输入

| 输入项 | 类型 | 必填 | 来源 | 说明 |
|--------|------|------|------|------|
| 商业画布 | JSON | ○ | output/pm-strategy/business-model-canvas/bmc.json | 9宫格商业模型 |
| SWOT分析 | JSON | ○ | output/pm-strategy/strategic-analysis/strategic-analysis.json | 优势/劣势/机会/威胁 |
| OKR | JSON | ○ | output/pm-strategy/planning-okr/okr.json | 目标与关键结果 |
| 路线图 | JSON | ○ | output/pm-strategy/planning-roadmap/roadmap.json | 产品路线图 |
| 定位策略 | JSON | ○ | output/pm-strategy/positioning-strategy/positioning-strategy.json | 产品定位 |
| 价值曲线 | JSON | ○ | output/pm-strategy/positioning-strategy/positioning-strategy.json | 竞争价值曲线 |
| 差异化评估 | JSON | ○ | output/pm-strategy/positioning-strategy/positioning-strategy.json | 差异化程度 |
| 利益相关者 | JSON | ○ | output/pm-strategy/stakeholder-analysis/stakeholder-analysis.json | 利益相关者地图 |
| 定价策略 | JSON | ○ | output/pm-strategy/business-pricing/pricing_strategy.json | 定价方案 |
| 北极星指标 | JSON | ○ | output/pm-strategy/planning-north-star/north_star.json | 核心指标定义 |
| 产品/业务信息 | string | 是 | 用户提供 | 产品名称、业务模式、当前阶段 |

## 执行步骤

### Step 1: 战略态势评估

整合 SWOT + 五力模型 + 价值曲线，评估当前战略态势：

**外部环境评估**：
- 行业吸引力（五力模型结论）
- 市场机会窗口（SWOT的O）
- 外部威胁等级（SWOT的T）
- 竞争定位（价值曲线中的差异化位置）

**内部能力评估**：
- 核心优势（SWOT的S）
- 关键劣势（SWOT的W）
- 资源禀赋（商业画布的关键资源）
- 能力缺口（执行战略需要但当前缺失的能力）

**战略态势矩阵**：

| | 机会多 | 威胁多 |
|------|--------|--------|
| **优势强** | 进攻型战略 | 防御型战略 |
| **劣势明显** | 扭转型战略 | 生存型战略 |

### Step 2: 战略方向推演

基于态势评估，推演2-3个战略方向：

**推演逻辑**：
```
态势判断 → 安索夫矩阵定位 → 战略方向选择 → 定位验证 → OKR对齐
```

**每个战略方向包含**：

| 要素 | 说明 |
|------|------|
| 方向名称 | 一句话概括 |
| 安索夫定位 | 市场渗透/市场开发/产品开发/多元化 |
| 核心逻辑 | 为什么这个方向可行（引用SWOT/五力/价值曲线证据） |
| 目标市场 | 聚焦哪些用户/场景 |
| 差异化策略 | 如何与竞品区隔（引用差异化评估） |
| 关键假设 | 战略成立的前提条件 |
| 风险因素 | 可能导致战略失败的因素 |

**战略方向对比表**：

| 维度 | 方向A | 方向B | 方向C |
|------|-------|-------|-------|
| 市场吸引力 | | | |
| 竞争优势匹配度 | | | |
| 资源需求 | | | |
| 风险等级 | | | |
| 预期回报 | | | |
| 推荐度 | | | |

### Step 3: 执行路径规划

为推荐的战略方向制定执行路径：

**OKR对齐**：
- 将战略方向分解为年度O
- 每个O对应2-4个KR
- KR必须可量化、可追踪
- 标注北极星指标的关联

**路线图映射**：
- Q1-Q4里程碑
- 每个里程碑的交付物
- 关键依赖关系
- 资源需求估算

**定价策略嵌入**：
- 当前定价与战略方向的匹配度
- 定价调整建议（如有）

### Step 4: 利益相关者管理

整合利益相关者数据，制定沟通策略：

| 利益相关者 | 态度 | 影响力 | 沟通策略 | 沟通频率 |
|-----------|------|--------|---------|---------|
| 决策层 | | 高 | 战略汇报+ROI论证 | 月度 |
| 执行团队 | | 高 | 目标对齐+资源保障 | 周度 |
| 外部合作方 | | 中 | 价值共享+风险共担 | 按需 |

### Step 5: 风险与预案

识别战略执行的关键风险：

| 风险类别 | 具体风险 | 概率 | 影响 | 预案 |
|----------|---------|------|------|------|
| 市场风险 | 需求变化/竞品动作 | | | |
| 资源风险 | 人力/资金不足 | | | |
| 执行风险 | 团队能力/协作问题 | | | |
| 技术风险 | 技术可行性/数据安全 | | | |

### Step 6: 报告组装

**报告结构**：

```
# {产品名}商业战略规划

## 执行摘要
- 战略态势一句话判断
- 推荐战略方向
- 核心OKR
- 关键风险

## 1. 战略态势评估
### 1.1 外部环境
### 1.2 内部能力
### 1.3 战略态势矩阵

## 2. 战略方向推演
### 2.1 方向A：{名称}
### 2.2 方向B：{名称}
### 2.3 方向对比与推荐

## 3. 执行路径
### 3.1 OKR体系
### 3.2 路线图
### 3.3 定价策略

## 4. 利益相关者管理
### 4.1 利益相关者地图
### 4.2 沟通策略

## 5. 风险与预案

## 附录
- 数据来源
- 假设清单
- 方法论说明
```

## 输出

**存储路径**：`output/pm-strategy/business-strategy-report/`

**输出文件**：

| 文件 | 格式 | 说明 |
|------|------|------|
| business-strategy-report.md | Markdown | 完整商业战略规划报告 |
| business-strategy-report.json | JSON | 结构化数据（供下游Skill引用） |

### 输出校验规则

| 字段路径 | 类型 | 必填 | 说明 |
|----------|------|------|------|
| report_metadata.product | string | 是 | 产品名称 |
| report_metadata.generated_at | string | 是 | 生成时间戳 |
| report_metadata.data_sources | array | 是 | 数据来源列表 |
| report_metadata.overall_confidence | number | 是 | 整体置信度0-1 |
| executive_summary.strategic_posture | string | 是 | 进攻/防御/扭转/生存 |
| executive_summary.recommended_direction | string | 是 | 推荐战略方向 |
| executive_summary.core_okr | object | 是 | 核心OKR |
| executive_summary.key_risks | array | 是 | 关键风险列表 |
| strategic_assessment.external | object | 是 | 外部环境评估 |
| strategic_assessment.internal | object | 是 | 内部能力评估 |
| strategic_assessment.posture_matrix.quadrant | string | 是 | 态势象限 |
| strategic_directions | array | 是 | 至少2个战略方向 |
| execution_path.okr | object | 是 | OKR体系 |
| execution_path.roadmap | object | 是 | 路线图 |
| risks_and_contingencies | array | 是 | 风险与预案 |

**business-strategy-report.json 结构**：

```json
{
  "report_metadata": {
    "product": "产品名",
    "generated_at": "时间戳",
    "data_sources": [],
    "overall_confidence": 0.0
  },
  "executive_summary": {
    "strategic_posture": "进攻/防御/扭转/生存",
    "recommended_direction": "",
    "core_okr": {},
    "key_risks": []
  },
  "strategic_assessment": {
    "external": {
      "industry_attractiveness": "",
      "opportunities": [],
      "threats": [],
      "competitive_position": ""
    },
    "internal": {
      "strengths": [],
      "weaknesses": [],
      "key_resources": [],
      "capability_gaps": []
    },
    "posture_matrix": {
      "quadrant": "",
      "implication": ""
    }
  },
  "strategic_directions": [
    {
      "name": "方向名称",
      "strategic_position": "",
      "rationale": "",
      "target_market": "",
      "differentiation": "",
      "key_assumptions": [],
      "risk_factors": [],
      "comparison_scores": {}
    }
  ],
  "execution_path": {
    "okr": {},
    "roadmap": {},
    "pricing_alignment": ""
  },
  "stakeholder_management": [],
  "risks_and_contingencies": []
}
```

## 决策规则

| 条件 | 决策 |
|------|------|
| SWOT数据缺失 | 基于产品信息和AI知识推导态势评估，标注"缺乏SWOT数据" |
| OKR数据缺失 | 基于战略方向推导OKR，标注"建议人工校准" |
| 路线图数据缺失 | 基于OKR推导里程碑，标注"建议补充时间线" |
| 定位数据缺失 | 战略方向缺少定位验证环节，标注"建议补充定位分析" |
| 所有上游数据均缺失 | 基于产品信息和AI知识库生成，整体置信度降低 |

## 质量检查

- [ ] 执行摘要包含态势判断+推荐方向+核心OKR
- [ ] 战略态势矩阵已生成
- [ ] 至少2个战略方向对比
- [ ] OKR可量化、可追踪
- [ ] 路线图包含Q1-Q4里程碑
- [ ] 关键风险有预案
- [ ] 所有推断标注置信度

## 降级策略

| 缺失的上游输入 | 降级方案 | 输出影响 |
|---------------|---------|---------|
| bmc缺失 | 基于产品信息推导商业模式 | 商业模式分析可能不够完整，缺乏9格画布结构化支撑 |
| swot缺失 | 基于产品信息和AI知识推导态势 | 态势评估缺乏结构化依据，战略方向可能偏主观 |
| okr缺失 | 基于战略方向推导OKR | OKR需人工校准，可量化性可能不足 |
| roadmap缺失 | 基于OKR推导里程碑 | 时间线需人工调整，里程碑依赖关系可能不准确 |
| positioning缺失 | 战略方向缺少定位验证 | 差异化策略需补充验证，竞争定位可能模糊 |
| 产品/业务信息（用户提供） | 若用户未提供产品/业务信息，提示用户提供或跳过该输入相关步骤 | 报告无法生成核心内容 |

---

## 上游变更响应

### 上游变更影响表

| 上游变更 | 影响范围 | 响应策略 |
|----------|----------|----------|
| bmc.json商业模式变更 | 战略态势内部能力评估、执行路径商业模型 | 重新评估内部能力，更新执行路径中的商业模型部分 |
| strategic-analysis.json战略分析更新 | 战略态势评估、战略方向推演 | 重新执行Step 1和Step 2，更新态势矩阵和方向推荐 |
| okr.json OKR调整 | 执行路径OKR对齐 | 重新执行Step 3，更新OKR体系和路线图映射 |
| roadmap.json路线图变更 | 执行路径里程碑 | 重新执行Step 3路线图映射部分 |
| positioning定位变更 | 战略方向差异化策略 | 重新评估战略方向的差异化逻辑 |

### 下游通知机制表

| 变更类型 | 影响范围 | 通知方式 |
|----------|----------|----------|
| 战略方向调整 | stakeholder-analysis | 输出文件版本号+变更摘要 |
| OKR变更 | planning-roadmap | 输出文件版本号+变更摘要 |
| 风险预案更新 | stakeholder-analysis | 输出文件版本号+变更摘要 |
| 态势评估变更 | strategic-analysis | 输出文件版本号+变更摘要 |
